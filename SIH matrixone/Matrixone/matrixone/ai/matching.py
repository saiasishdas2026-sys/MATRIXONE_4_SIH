"""AI Material Matching Engine - Hybrid entity-resolution pipeline."""

from typing import List, Dict, Optional, Tuple, Any
from dataclasses import dataclass, field
import importlib
import numpy as np

try:
    SentenceTransformer = importlib.import_module(
        "sentence_transformers"
    ).SentenceTransformer
    has_sentence_transformers = True
except Exception:
    SentenceTransformer = None
    has_sentence_transformers = False


try:
    fuzz = process = None
    from rapidfuzz import fuzz, process
    HAS_RAPIDFUZZ = True
except ImportError:
    HAS_RAPIDFUZZ = False


@dataclass
class AttributeSpec:
    is_identity_critical: bool = False
    is_context_dependent: bool = False
    is_descriptive: bool = False
    is_optional: bool = False
    normalization: str = "none"
    acceptable_variants: Optional[List[str]] = None


@dataclass
class MaterialCandidate:
    source_material_id: int
    local_code: str
    description: str
    attributes: Dict[str, Any]
    organization: str
    source_system: str


@dataclass
class TechSpecs:
    valve_type: Optional[str] = None
    size_mm: Optional[float] = None
    size_raw: Optional[str] = None
    grade: Optional[str] = None
    grade_raw: Optional[str] = None
    pressure: Optional[str] = None
    pressure_raw: Optional[str] = None
    connection: Optional[str] = None
    category: Optional[str] = None


GRADE_SYNONYMS: Dict[str, List[str]] = {
    "SS316": ["ss316", "ss 316", "stainless steel 316", "aisi 316", "a182-f316", "316 stainless"],
    "SS304": ["ss304", "ss 304", "stainless steel 304", "aisi 304", "304 stainless"],
    "CS": ["cs", "carbon steel", "c.s.", "a105", "a106", "wcb"],
    "CI": ["ci", "cast iron", "c.i."],
    "MS": ["ms", "mild steel"],
    "BRASS": ["brass"],
}

PRESSURE_EQUIV: Dict[str, List[str]] = {
    "PN40": ["pn40", "class 300", "cl300", "300#", "300 #",
              "300lbs", "300 lbs", "300lb", "300 lb", "300# wog", "pn 40"],
    "PN16": ["pn16", "class 150", "cl150", "150#", "150 #",
              "150lbs", "150 lbs", "150lb", "150 lb", "150# wog", "pn 16"],
    "PN10": ["pn10", "class 125", "125#", "125lbs", "125 lbs", "125lb", "125 lb"],
}

CATEGORY_CODES: Dict[str, str] = {
    "valve": "VLV", "pump": "PMP", "bearing": "BRG", "pipe": "PIP",
    "motor": "MTR", "cable": "CBL", "flange": "FLG",
    "fastener": "FST", "bolt": "FST", "gasket": "GSK",
}


def _variant_pattern(variant: str) -> str:
    """Build a word-boundary regex for a synonym variant.

    Allows flexible whitespace (``ss 316`` matches ``ss316`` / ``ss  316``)
    and an optional space between digits and trailing letters so that
    ``150lbs`` also matches ``150 lbs``.
    """
    import re
    pat = re.escape(variant)
    # re.escape escapes a literal space as "\ " — allow any whitespace run.
    pat = pat.replace(r"\ ", r"\s*")
    # Allow "150lbs" <-> "150 lbs" style spacing between digits and letters.
    pat = re.sub(r"(?<=\d)(?=[A-Za-z#])", r"\\s*", pat)
    return r"(?<![a-z0-9])" + pat + r"(?![a-z0-9])"


def _canon_grade(text: str) -> Tuple[Optional[str], Optional[str]]:
    import re
    t = f" {str(text or '').lower()} "
    t = re.sub(r"\s+", " ", t)
    hits: list[tuple[int, str, str]] = []
    for canon, variants in GRADE_SYNONYMS.items():
        for v in variants:
            # Avoid matching short grades such as ``cs`` inside ordinary words.
            pattern = _variant_pattern(v.lower())
            for m in re.finditer(pattern, t):
                hits.append((m.start(), canon, v))
    if not hits:
        return None, None
    if len(hits) == 1:
        _, canon, v = hits[0]
        return canon, v
    # Multiple distinct materials mentioned (e.g. "WCB BODY, SS316 BALL"
    # trim vs body). Prefer the body material for identity, else the first
    # mention, so trim metallurgy doesn't force a false grade conflict.
    distinct = {c for _, c, _ in hits}
    if len(distinct) == 1:
        hits.sort(key=lambda h: h[0])
        _, canon, v = hits[0]
        return canon, v
    for pos, canon, v in sorted(hits, key=lambda h: h[0]):
        window = t[max(0, pos - 24): pos + 24]
        if "body" in window:
            return canon, v
    hits.sort(key=lambda h: h[0])
    _, canon, v = hits[0]
    return canon, v


def _canon_pressure(text: str) -> Tuple[Optional[str], Optional[str]]:
    import re
    raw = str(text or "")
    t = f" {raw.lower()} "
    t = re.sub(r"\s+", " ", t)
    for canon, variants in PRESSURE_EQUIV.items():
        for v in variants:
            m = re.search(_variant_pattern(v.lower()), t)
            if m:
                return canon, m.group(0).strip()
    # generic PN / CLASS / # / LBS patterns
    m = re.search(r"pn\s*(\d+)", t)
    if m:
        return f"PN{m.group(1)}", m.group(0).strip()
    m = re.search(r"(?<![a-z0-9])class\s*(\d+)", t)
    if m:
        num = m.group(1)
        # Normalise well-known class ratings onto the PN namespace so that
        # "CLASS 300" equals "PN40" / "300#" instead of conflicting.
        if num == "150":
            return "PN16", m.group(0).strip()
        if num == "300":
            return "PN40", m.group(0).strip()
        if num == "125":
            return "PN10", m.group(0).strip()
        return f"CLASS{num}", m.group(0).strip()
    m = re.search(r"(?<![a-z0-9])cl\s*(\d+)", t)
    if m:
        num = m.group(1)
        if num == "150":
            return "PN16", m.group(0).strip()
        if num == "300":
            return "PN40", m.group(0).strip()
        return f"CLASS{num}", m.group(0).strip()
    m = re.search(r"(\d+)\s*(?:lbs?|psi)\b", t)
    if m:
        num = m.group(1)
        if num == "150":
            return "PN16", m.group(0).strip()
        if num == "300":
            return "PN40", m.group(0).strip()
        if num == "125":
            return "PN10", m.group(0).strip()
        return f"CLASS{num}", m.group(0).strip()
    m = re.search(r"(\d+)\s*#", t)
    if m:
        num = m.group(1)
        if num == "150":
            return "PN16", m.group(0).strip()
        if num == "300":
            return "PN40", m.group(0).strip()
        if num == "125":
            return "PN10", m.group(0).strip()
        return f"#{num}", m.group(0).strip()
    return None, None


def parse_tech_specs(description: str, classification: Optional[str] = None) -> TechSpecs:
    """Layer 3 — Technical Specification Matching: extract engineering attributes."""
    import re
    text = description or ""
    t = f" {text.lower()} "
    t = re.sub(r"\s+", " ", t)
    # valve type (word-boundary match so "gate" doesn't hit "aggregate",
    # "lug" doesn't hit "plug", etc). Accept plural "valves".
    valve_type = None
    has_valve = re.search(r"(?<![a-z0-9])valves?(?![a-z0-9])", t) is not None
    if has_valve:
        for vt in ["gate", "ball", "globe", "butterfly", "check", "plug", "needle", "diaphragm", "safety", "foot", "knife"]:
            if re.search(r"(?<![a-z0-9])" + re.escape(vt) + r"(?![a-z0-9])", t):
                valve_type = f"{vt} valve"
                break
    # size: triple dimension (bearings "25X52X15MM" -> bore 25),
    # then DN / NB / mm / fractional + decimal inch.
    size_mm: Optional[float] = None
    size_raw: Optional[str] = None
    m = re.search(
        r"(?<![a-z0-9])(\d+(?:\.\d+)?)\s*[x\u00d7]\s*(\d+(?:\.\d+)?)\s*[x\u00d7]\s*(\d+(?:\.\d+)?)\s*(?:mm\b)?",
        t,
    )
    if m:
        # AxBxC (e.g. bearing 25x52x15): first number is the bore.
        size_mm = float(m.group(1)); size_raw = m.group(0).strip()
    else:
        m = re.search(r"dn\s*(\d+(?:\.\d+)?)", t)
        if m:
            size_mm = float(m.group(1)); size_raw = m.group(0).strip()
        else:
            m = re.search(r"(?<![a-z0-9])(\d+(?:\.\d+)?)\s*nb\b", t)
            if m:
                size_mm = float(m.group(1)); size_raw = m.group(0).strip()
            else:
                m = re.search(r"(?<![a-z0-9])(\d+(?:\.\d+)?)\s*mm\b", t)
                if m:
                    size_mm = float(m.group(1)); size_raw = m.group(0).strip()
                else:
                    # fractional inches: 1/2", 3/4 in, mixed "1 1/2 inch"
                    m = re.search(
                        r"(?<![a-z0-9/])(\d+)\s+(\d+)\s*/\s*(\d+)\s*(?:inch(?:es)?|in\b|\")",
                        t,
                    )
                    if m:
                        whole, num, den = float(m.group(1)), float(m.group(2)), float(m.group(3))
                        if den != 0:
                            size_mm = round((whole + num / den) * 25.4, 1); size_raw = m.group(0).strip()
                    else:
                        m = re.search(
                            r"(?<![a-z0-9/])(\d+)\s*/\s*(\d+)\s*(?:inch(?:es)?|in\b|\")",
                            t,
                        )
                        if m:
                            num, den = float(m.group(1)), float(m.group(2))
                            if den != 0:
                                size_mm = round((num / den) * 25.4, 1); size_raw = m.group(0).strip()
                        else:
                            # Decimal inches: 2", 2in, 2 in, 2 inch, 2 inches.
                            # Safe without an extra guard: the pattern requires
                            # leading digits, so "flanged"/"main"/"stain" (no
                            # leading number) can never match.
                            m = re.search(r"(?<![a-z0-9/])(\d+(?:\.\d+)?)\s*(?:inch(?:es)?|in\b|\")", t)
                            if m:
                                size_mm = round(float(m.group(1)) * 25.4, 1); size_raw = m.group(0).strip()
    grade, grade_raw = _canon_grade(text)
    pressure, pressure_raw = _canon_pressure(text)
    connection = None
    # Word-boundary matching: bare "rf"/"lug" must not fire inside
    # "surface"/"plug"/"flug", etc. "flgd"/"rf"/"rtj"/"wnrf" normalise to flanged.
    for c in ["flanged", "flgd", "wnrf", "screwed", "threaded", "welded", "wafer", "lug", "rf", "rtj", "npt", "bsp"]:
        if re.search(r"(?<![a-z0-9])" + re.escape(c) + r"(?![a-z0-9])", t):
            connection = "flanged" if c in ("flgd", "rf", "rtj", "wnrf") else c
            break
    category = (classification or "").strip() or None
    if category and category.strip().lower() in ("general", "unknown", "n/a", "na", "-", "misc", "other"):
        category = None
    if not category:
        for k in ["valve", "pump", "bearing", "pipe", "motor", "cable", "flange", "bolt", "gasket", "fastener"]:
            # Substring would false-fire ("pipe" in "pipeline"); require a
            # word boundary but still accept plurals ("valves", "pipes"...).
            if re.search(r"(?<![a-z0-9])" + re.escape(k) + r"s?(?![a-z0-9])", t):
                category = k.capitalize() if k != "bolt" else "Fastener"
                break
    return TechSpecs(
        valve_type=valve_type, size_mm=size_mm, size_raw=size_raw,
        grade=grade, grade_raw=grade_raw, pressure=pressure, pressure_raw=pressure_raw,
        connection=connection, category=category,
    )


def category_code(category: Optional[str]) -> str:
    if not category:
        return "GEN"
    return CATEGORY_CODES.get(category.strip().lower(), "GEN")


def generate_standard_name(specs: TechSpecs, fallback_desc: str = "") -> str:
    """One clean standardized material name, configurable convention."""
    parts: List[str] = []
    if specs.grade:
        parts.append(specs.grade)
    # type first for readability: "GATE VALVE, SS316, DN50, PN40, FLANGED"
    type_part = (specs.valve_type or "").upper() if specs.valve_type else None
    if type_part:
        # grade already added; order: TYPE, GRADE, SIZE, PRESSURE, CONNECTION
        ordered = [type_part]
        if specs.grade:
            ordered.append(specs.grade)
        if specs.size_mm is not None:
            ordered.append(f"DN{int(specs.size_mm) if float(specs.size_mm).is_integer() else specs.size_mm}")
        if specs.pressure:
            ordered.append(specs.pressure)
        if specs.connection:
            ordered.append(specs.connection.upper())
        return ", ".join(ordered)
    # non-valve fallback
    if specs.category:
        parts.insert(0, specs.category.upper())
    if specs.size_mm is not None:
        parts.append(f"DN{int(specs.size_mm) if float(specs.size_mm).is_integer() else specs.size_mm}")
    if specs.pressure:
        parts.append(specs.pressure)
    if specs.connection:
        parts.append(specs.connection.upper())
    if parts:
        return ", ".join(parts)
    # last resort: tidy fallback
    import re
    s = re.sub(r"\s+", " ", (fallback_desc or "").strip()).upper()
    return s[:140] if s else "UNSPECIFIED MATERIAL"


@dataclass
class MatchResult:
    material_a_id: int
    material_b_id: int
    decision_category: str
    similarity_score: float
    attribute_agreement: float
    evidence_completeness: float
    conflict_score: float
    matching_attributes: List[Dict[str, Any]]
    conflicting_attributes: List[Dict[str, Any]]
    missing_critical: List[str]
    evidence_records: List[Dict[str, Any]]
    rule_version: str
    model_version: str
    # ── Three-layer AI matching (new, backward-compatible defaults) ──
    semantic_score: float = 0.0
    text_score: float = 0.0
    spec_score: float = 0.0
    confidence_score: float = 0.0
    match_type: str = "different"  # exact | near_duplicate | functional_equivalent | different | conflict | insufficient
    explanation: List[str] = field(default_factory=list)
    standardized_name: str = ""
    recommendation: str = ""


class AttributeNormalizer:
    ABBREVIATIONS = {
        "valve": ["valv", "vlv"],
        "pipe": ["pip", "pt"],
        "bearing": ["bear", "brg"],
        "cable": ["cabl", "cbl"],
        "fastener": ["fastnr", "ftnr", "bolt", "nut", "screw"],
        "pressure": ["press", "pr"],
        "rating": ["rat", "rdg"],
        "nominal": ["nom", "nl"],
        "actual": ["act", "ac"],
    }
    UNIT_MAP = {
        "mm": "millimeter", "m": "meter", "kg": "kilogram",
        "pcs": "piece", "set": "set", "box": "box",
        "coil": "coil", "ton": "tonne", "pa": "pascal", "bar": "bar",
    }

    def normalize(self, value: str, spec: AttributeSpec) -> str:
        if value is None:
            return ""
        v = str(value).strip()
        if spec.normalization == "lowercase":
            v = v.lower()
        if spec.normalization == "strip_whitespace":
            v = v.replace(" ", "")
        if spec.normalization == "fraction":
            v = self._normalize_fraction(v)
        if spec.normalization == "unit":
            v = self._normalize_unit(v)
        v = self._expand_abbreviations(v)
        return v

    def _normalize_fraction(self, v: str) -> str:
        frac_map = {"1/2": "0.5", "1/4": "0.25", "3/4": "0.75"}
        for k, frac in frac_map.items():
            v = v.replace(k, frac)
        return v

    def _normalize_unit(self, v: str) -> str:
        import re
        for short, long in self.UNIT_MAP.items():
            # "50 mm" / "50  mm" with whitespace...
            v = re.sub(
                r"(?<![a-z0-9])" + re.escape(short) + r"(?![a-z0-9])",
                long,
                v,
                flags=re.IGNORECASE,
            )
            # ...as well as compact suffixes such as "50mm" / "10kg".
            v = re.sub(
                r"(?<=\d)\s*" + re.escape(short) + r"\b",
                r" " + long,
                v,
                flags=re.IGNORECASE,
            )
            v = v.replace(f"^{short}", f"^{long}")
            v = v.replace(f"^{long.lower()}", f"^{long}")
        # Collapse accidental double expansions ("millimeter" stays single).
        v = re.sub(r"\s+", " ", v)
        return v

    def _expand_abbreviations(self, v: str) -> str:
        import re
        # Expand abbreviations on every whitespace-separated token, not just
        # a leading prefix, so "gate vlv" / "vlv, gate" also normalise.
        reverse = {}
        for abbr, variants in self.ABBREVIATIONS.items():
            for var in variants:
                reverse[var.lower()] = abbr
        parts = re.split(r"(\s+)", v)
        for i, tok in enumerate(parts):
            if not tok or tok.isspace():
                continue
            core = re.sub(r"^[^a-z0-9]+|[^a-z0-9]+$", "", tok, flags=re.IGNORECASE)
            if core.lower() in reverse:
                prefix = tok[: tok.find(core)] if core else ""
                suffix = tok[tok.find(core) + len(core):] if core else tok
                # Preserve simple capitalization of the original token.
                repl = reverse[core.lower()]
                parts[i] = prefix + repl + suffix
        return "".join(parts)


class HybridMatcher:
    def __init__(self, embedding_model_name="all-MiniLM-L6-v2",
                 enable_embeddings=True, enable_lexical=True, enable_fuzzy=True):
        self.embedding_model_name = embedding_model_name
        self.enable_embeddings = enable_embeddings and has_sentence_transformers
        self.enable_lexical = enable_lexical
        self.enable_fuzzy = enable_fuzzy and HAS_RAPIDFUZZ
        self.embedding_model = None
        self.embedding_dim = 0
        if self.enable_embeddings:
            try:
                self.embedding_model = SentenceTransformer(embedding_model_name)
                self.embedding_dim = self.embedding_model.get_sentence_embedding_dimension()
            except Exception:
                self.enable_embeddings = False
                self.embedding_model = None
        self.exact_match_threshold = 1.0
        self.same_material_threshold = 0.85
        self.close_match_threshold = 0.7
        self.critical_conflict_threshold = 0.3
        self.model_version = embedding_model_name

    def compute_lexical_similarity(self, text_a: str, text_b: str) -> float:
        text_a = str(text_a or "")
        text_b = str(text_b or "")
        if not text_a.strip() or not text_b.strip():
            return 0.0
        if not self.enable_lexical or fuzz is None:
            words_a = set(text_a.lower().split())
            words_b = set(text_b.lower().split())
            if not words_a or not words_b:
                return 0.0
            intersection = words_a & words_b
            union = words_a | words_b
            return len(intersection) / len(union) if union else 0.0
        return fuzz.WRatio(text_a, text_b) / 100.0

    def compute_fuzzy_similarity(self, text_a: str, text_b: str) -> float:
        text_a = str(text_a or "")
        text_b = str(text_b or "")
        if not text_a.strip() or not text_b.strip():
            return 0.0
        if not self.enable_fuzzy or process is None:
            return self.compute_lexical_similarity(text_a, text_b)
        # extractOne returns (matched_choice, score_0_100, index) — the score
        # is element [1], not [2] (which is just the index into `choices`).
        try:
            best = process.extractOne(text_a, [text_b], scorer=fuzz.WRatio)
            if not best:
                return 0.0
            return float(best[1]) / 100.0
        except Exception:
            return self.compute_lexical_similarity(text_a, text_b)

    def compute_embedding_similarity(self, text_a: str, text_b: str) -> float:
        if not self.enable_embeddings or self.embedding_model is None:
            return 0.0
        try:
            emb_a = np.asarray(self.embedding_model.encode(str(text_a or ""), convert_to_numpy=True), dtype=float).reshape(-1)
            emb_b = np.asarray(self.embedding_model.encode(str(text_b or ""), convert_to_numpy=True), dtype=float).reshape(-1)
            if emb_a.size == 0 or emb_b.size == 0 or emb_a.size != emb_b.size:
                return 0.0
            dot = np.dot(emb_a, emb_b)
            na = np.linalg.norm(emb_a)
            nb = np.linalg.norm(emb_b)
            if na == 0 or nb == 0:
                return 0.0
            # Numerical noise can otherwise produce values outside [0, 1].
            return float(np.clip(dot / (na * nb), 0.0, 1.0))
        except Exception:
            return 0.0

    def decide_category(self, similarity_score: float, attribute_agreement: float,
                        conflict_score: float, missing_critical: List[str],
                        identity_critical_checks: dict) -> str:
        if conflict_score > self.critical_conflict_threshold:
            return "CONFLICTING_SPECIFICATION"
        if missing_critical and similarity_score < 0.85:
            return "INSUFFICIENT_EVIDENCE"
        if similarity_score >= 0.97:
            return "EXACT_RECORD_DUPLICATE"
        if similarity_score >= self.same_material_threshold:
            return "SAME_MATERIAL_CANDIDATE"
        if similarity_score >= self.close_match_threshold:
            return "NEAR_DUPLICATE_REVIEW"
        if missing_critical:
            return "INSUFFICIENT_EVIDENCE"
        return "NO_CANDIDATE_FOUND"

    def analyze_pair(self, material_a: MaterialCandidate, material_b: MaterialCandidate,
                     identity_critical_keys: Optional[List[str]] = None) -> MatchResult:
        lexical_sim = self.compute_lexical_similarity(material_a.description, material_b.description)
        fuzzy_sim = self.compute_fuzzy_similarity(material_a.description, material_b.description)
        emb_sim = self.compute_embedding_similarity(material_a.description, material_b.description)
        # ── Layer 1: Semantic / meaning (embeddings if available, else synonym-aware token overlap)
        if self.enable_embeddings and getattr(self, "embedding_model", None) is not None and emb_sim > 0:
            semantic = 0.6 * emb_sim + 0.4 * lexical_sim
        else:
            semantic = self.compute_semantic_similarity(material_a.description, material_b.description, lexical_sim)
        # ── Layer 2: Fuzzy text matching (typos, abbrev, spacing, order, punctuation)
        text_layer = max(lexical_sim, fuzzy_sim)
        # ── Layer 3: Technical specification matching (engineering attributes)
        spec_a = parse_tech_specs(material_a.description, material_a.attributes.get("classification") or material_a.attributes.get("category"))
        spec_b = parse_tech_specs(material_b.description, material_b.attributes.get("classification") or material_b.attributes.get("category"))
        spec_layer, _ = self.compute_spec_similarity(spec_a, spec_b)
        if self.enable_embeddings and self.enable_lexical:
            retrieval_sim = 0.6 * emb_sim + 0.4 * lexical_sim if emb_sim > 0 else lexical_sim
        elif self.enable_embeddings and emb_sim > 0:
            retrieval_sim = emb_sim
        else:
            retrieval_sim = lexical_sim
        attr_agreement = self._compute_attribute_agreement(material_a.attributes, material_b.attributes)
        # blend explicit attrs with parsed tech specs
        attr_agreement = round(0.5 * attr_agreement + 0.5 * spec_layer, 4)
        conflict_score = self._compute_conflict_score(material_a.attributes, material_b.attributes, identity_critical_keys)
        # critical tech conflicts (different grade/size/pressure/type) force conflict
        tech_conflict = self._tech_conflict_score(spec_a, spec_b)
        conflict_score = max(conflict_score, tech_conflict)
        missing_critical = self._identify_missing_critical(material_a.attributes, material_b.attributes, identity_critical_keys or [])
        matching_attrs = self._identify_matching_attributes(material_a.attributes, material_b.attributes)
        conflicting_attrs = self._identify_conflicting_attributes(material_a.attributes, material_b.attributes, identity_critical_keys or [])
        # decision follows overall confidence (3-layer), not raw lexical retrieval
        _pref_conf = 0.40 * semantic + 0.30 * text_layer + 0.30 * spec_layer
        if conflict_score > self.critical_conflict_threshold:
            _pref_conf *= 0.3
        decision = self.decide_category(_pref_conf, attr_agreement, conflict_score, missing_critical,
                                        {"identity_critical_keys": identity_critical_keys or []})
        evidence = self._generate_evidence(material_a, material_b, matching_attrs, conflicting_attrs,
                                            missing_critical, conflict_score)
        # layer + explanation evidence (stored so no schema migration is needed)
        evidence.append({"attribute_name": "LAYER_SEMANTIC", "status": "score",
                         "value_a": None, "value_b": None,
                         "normalization_applied": "synonym-aware semantic",
                         "evidence_level": "strong", "model_version": self.model_version,
                         "rule_version": "v2.0", "score": round(semantic, 4)})
        evidence.append({"attribute_name": "LAYER_TEXT", "status": "score",
                         "value_a": None, "value_b": None,
                         "normalization_applied": "fuzzy WRatio",
                         "evidence_level": "strong", "model_version": self.model_version,
                         "rule_version": "v2.0", "score": round(text_layer, 4)})
        evidence.append({"attribute_name": "LAYER_SPEC", "status": "score",
                         "value_a": None, "value_b": None,
                         "normalization_applied": "tech-spec parse",
                         "evidence_level": "critical", "model_version": self.model_version,
                         "rule_version": "v2.0", "score": round(spec_layer, 4)})
        evidence_completeness = min(
            1.0,
            len(evidence) / max(1, len(material_a.attributes) + len(material_b.attributes)) * 2,
        )
        confidence = 0.40 * semantic + 0.30 * text_layer + 0.30 * spec_layer
        if conflict_score > self.critical_conflict_threshold:
            confidence *= 0.3
        overall_score = round(confidence, 4)
        match_type = self._public_match_type(decision, confidence, semantic, text_layer, spec_layer)
        explanation = self._build_explanation(spec_a, spec_b, semantic, text_layer, spec_layer, confidence, match_type)
        # standardized name from the richer parse
        # Prefer the parse with more usable engineering information.
        spec_a_fields = sum(value is not None for value in vars(spec_a).values())
        spec_b_fields = sum(value is not None for value in vars(spec_b).values())
        primary_spec, primary_desc = (
            (spec_b, material_b.description)
            if spec_b_fields > spec_a_fields else (spec_a, material_a.description)
        )
        std_name = generate_standard_name(primary_spec, primary_desc)
        if match_type in ("exact", "near_duplicate", "functional_equivalent"):
            # prefer the more complete parse
            alt = generate_standard_name(spec_b, material_b.description)
            if len(alt) > len(std_name):
                std_name = alt
        for line in explanation:
            evidence.append({"attribute_name": f"WHY: {line[:80]}", "status": "explanation",
                             "value_a": None, "value_b": None, "normalization_applied": "xai",
                             "evidence_level": "strong", "model_version": self.model_version,
                             "rule_version": "v2.0"})
        evidence.append({"attribute_name": "STANDARD_NAME", "status": "suggestion",
                         "value_a": std_name, "value_b": std_name,
                         "normalization_applied": "naming-convention",
                         "evidence_level": "strong", "model_version": self.model_version,
                         "rule_version": "v2.0"})
        rule_version = "v2.0"
        model_version = self.embedding_model_name if self.embedding_model is not None else "lexical-only"
        return MatchResult(
            material_a_id=material_a.source_material_id,
            material_b_id=material_b.source_material_id,
            decision_category=decision,
            similarity_score=round(retrieval_sim, 4),
            attribute_agreement=round(attr_agreement, 4),
            evidence_completeness=round(evidence_completeness, 4),
            conflict_score=round(conflict_score, 4),
            matching_attributes=matching_attrs,
            conflicting_attributes=conflicting_attrs,
            missing_critical=missing_critical,
            evidence_records=evidence,
            rule_version=rule_version,
            model_version=model_version,
            semantic_score=round(semantic, 4),
            text_score=round(text_layer, 4),
            spec_score=round(spec_layer, 4),
            confidence_score=round(confidence, 4),
            match_type=match_type,
            explanation=explanation,
            standardized_name=std_name,
            recommendation=(
                "These materials are likely the same." if match_type in ("exact", "functional_equivalent")
                else "Likely near-duplicate — review wording." if match_type == "near_duplicate"
                else "Do not merge." if match_type == "conflict"
                else "Insufficient evidence."
                if match_type == "insufficient" else "Not the same material."
            ),
        )

    # ── Layer helpers ──────────────────────────────────────────────
    def compute_semantic_similarity(self, text_a: str, text_b: str, fallback_lexical: float = 0.0) -> float:
        """Synonym-aware token overlap (SS316≈AISI316, PN40≈Class300, Stainless Steel≈SS)."""
        import re
        def canon_tokens(text: str) -> set[str]:
            t = f" {text.lower()} "
            t = re.sub(r"\s+", " ", t)
            # fold grade synonyms to canonical (word-boundary regex so that
            # short codes like "cs"/"ci"/"ms" don't corrupt "mechanics", etc.)
            for canon, variants in GRADE_SYNONYMS.items():
                for v in variants:
                    t = re.sub(_variant_pattern(v.lower()), f" {canon.lower()} ", t)
            for canon, variants in PRESSURE_EQUIV.items():
                for v in variants:
                    t = re.sub(_variant_pattern(v.lower()), f" {canon.lower()} ", t)
            # fold residual lbs/psi ratings onto the PN namespace
            def _fold_lbs(m: "re.Match") -> str:
                num = m.group(1)
                if num == "150":
                    return " pn16 "
                if num == "300":
                    return " pn40 "
                if num == "125":
                    return " pn10 "
                return f" class{num} "
            t = re.sub(r"(?<![a-z0-9])(\d+)\s*(?:lbs?|psi)\b", _fold_lbs, t)
            # fold size synonyms: 50mm / 50 mm / dn50 / 50nb / 50 nb / 2inch / 2 in -> dn50
            import re as _re
            def _fold_size(m: "_re.Match") -> str:
                num, unit = m.group(1), (m.group(2) or "").lower()
                try:
                    v = float(num)
                except Exception:
                    return m.group(0)
                if unit.startswith("in"):
                    v = round(v * 25.4, 1)
                iv = int(v) if float(v).is_integer() else v
                return f" dn{iv} "
            # Bearing-style triples "25x52x15[mm]": keep the bore for semantics.
            t = _re.sub(
                r"(?<![a-z0-9])(\d+(?:\.\d+)?)\s*[x\u00d7]\s*\d+(?:\.\d+)?\s*[x\u00d7]\s*\d+(?:\.\d+)?\s*(?:mm\b)?",
                lambda m: f" dn{int(float(m.group(1)))} ",
                t,
            )
            t = _re.sub(r"dn\s*(\d+(?:\.\d+)?)", lambda m: f" dn{int(float(m.group(1)))} ",
                        t)
            t = _re.sub(r"(\d+(?:\.\d+)?)\s*(mm|nb|inch(?:es)?|in\b|\")", _fold_size, t)
            t = _re.sub(r"(?<![a-z0-9])flgd(?![a-z0-9])", " flanged ", t)
            t = _re.sub(r"(?<![a-z0-9])rf(?![a-z0-9])", " flanged ", t)
            t = t.replace("stainless steel", " ss ")
            toks = set(re.findall(r"[a-z0-9]+", t))
            stop = {"the", "and", "with", "for", "of", "a", "an"}
            return {x for x in toks if x not in stop}
            toks = set(re.findall(r"[a-z0-9]+", t))
            stop = {"the", "and", "with", "for", "of", "a", "an"}
            return {x for x in toks if x not in stop}
        a, b = canon_tokens(text_a or ""), canon_tokens(text_b or "")
        if not a or not b:
            return 0.0
        inter, union = len(a & b), len(a | b)
        jaccard = inter / union if union else 0.0
        # blend with lexical so word-order differences don't collapse the score
        return round(0.7 * jaccard + 0.3 * fallback_lexical, 4)

    def compute_spec_similarity(self, a: TechSpecs, b: TechSpecs) -> Tuple[float, Dict[str, bool]]:
        checks: Dict[str, bool] = {}
        scores: List[float] = []
        # category/type — valve-type mismatch must not be masked by equal
        # parent categories (gate vs ball are both "Valve" but not the same).
        if a.valve_type and b.valve_type:
            same = a.valve_type == b.valve_type
            checks["type"] = same; scores.append(1.0 if same else 0.0)
        elif (a.category or "").lower() == (b.category or "").lower() and a.category:
            checks["type"] = True; scores.append(1.0)
        elif (a.valve_type or "") == (b.valve_type or "") and a.valve_type:
            checks["type"] = True; scores.append(1.0)
        elif a.category and b.category:
            checks["type"] = False; scores.append(0.0)
        # grade (synonym-canonicalised)
        if a.grade and b.grade:
            same = a.grade == b.grade
            checks["grade"] = same; scores.append(1.0 if same else 0.0)
        # size (±2mm tolerance)
        if a.size_mm is not None and b.size_mm is not None:
            same = abs(a.size_mm - b.size_mm) <= 2.0
            checks["size"] = same; scores.append(1.0 if same else 0.0)
        # pressure (canonicalised)
        if a.pressure and b.pressure:
            same = a.pressure == b.pressure
            checks["pressure"] = same; scores.append(1.0 if same else 0.0)
        # connection
        if a.connection and b.connection:
            same = a.connection == b.connection
            checks["connection"] = same; scores.append(1.0 if same else 0.0)
        if not scores:
            return 0.5, checks  # no tech evidence either way
        return round(sum(scores) / len(scores), 4), checks

    def _tech_conflict_score(self, a: TechSpecs, b: TechSpecs) -> float:
        conflicts = 0
        compared = 0
        if a.grade and b.grade:
            compared += 1
            if a.grade != b.grade:
                conflicts += 1
        if a.size_mm is not None and b.size_mm is not None:
            compared += 1
            if abs(a.size_mm - b.size_mm) > 2.0:
                conflicts += 1
        if a.pressure and b.pressure:
            compared += 1
            if a.pressure != b.pressure:
                conflicts += 1
        if a.valve_type and b.valve_type:
            compared += 1
            if a.valve_type != b.valve_type:
                conflicts += 1
        if a.category and b.category:
            compared += 1
            if a.category.lower() != b.category.lower():
                conflicts += 1
        if a.connection and b.connection:
            compared += 1
            if a.connection != b.connection:
                conflicts += 1
        if compared == 0:
            return 0.0
        return min(1.0, conflicts / compared)

    def _public_match_type(self, decision: str, confidence: float, semantic: float, text: float, spec: float) -> str:
        if decision == "CONFLICTING_SPECIFICATION":
            return "conflict"
        if decision == "EXACT_RECORD_DUPLICATE" or (confidence >= 0.97 and spec >= 0.9):
            return "exact"
        if decision == "SAME_MATERIAL_CANDIDATE" or (confidence >= 0.85 and spec >= 0.7):
            return "functional_equivalent"
        if decision == "NEAR_DUPLICATE_REVIEW" or confidence >= 0.70:
            return "near_duplicate"
        if decision == "INSUFFICIENT_EVIDENCE":
            return "insufficient"
        return "different"

    def _build_explanation(self, a: TechSpecs, b: TechSpecs, semantic: float, text: float,
                           spec: float, confidence: float, match_type: str) -> List[str]:
        lines: List[str] = []
        if a.grade and b.grade:
            lines.append(f"{'Same' if a.grade == b.grade else 'Different'} material grade: {a.grade} vs {b.grade}")
        if a.valve_type and b.valve_type:
            lines.append(f"{'Same' if a.valve_type == b.valve_type else 'Different'} valve type: {a.valve_type} vs {b.valve_type}")
        elif a.category and b.category:
            lines.append(f"{'Same' if (a.category or '').lower() == (b.category or '').lower() else 'Different'} category: {a.category} vs {b.category}")
        if a.size_mm is not None and b.size_mm is not None:
            same = abs(a.size_mm - b.size_mm) <= 2.0
            lines.append(f"{'Same' if same else 'Different'} size: DN{int(a.size_mm)} vs DN{int(b.size_mm)}")
        if a.pressure and b.pressure:
            lines.append(f"{'Same' if a.pressure == b.pressure else 'Different'} pressure rating: {a.pressure} vs {b.pressure}")
        if a.connection and b.connection:
            lines.append(f"{'Same' if a.connection == b.connection else 'Different'} connection: {a.connection} vs {b.connection}")
        lines.append(f"Semantic similarity: {semantic:.0%}")
        lines.append(f"Text similarity: {text:.0%}")
        lines.append(f"Specification similarity: {spec:.0%}")
        lines.append(f"Overall confidence: {confidence:.0%}")
        return lines

    def _compute_attribute_agreement(self, attrs_a: Dict[str, Any], attrs_b: Dict[str, Any]) -> float:
        if not attrs_a and not attrs_b:
            return 1.0
        if not attrs_a or not attrs_b:
            return 0.0
        matching = 0
        total = 0
        for key in set(list(attrs_a.keys()) + list(attrs_b.keys())):
            val_a = attrs_a.get(key)
            val_b = attrs_b.get(key)
            total += 1
            if val_a is None and val_b is None:
                matching += 0.5
            elif val_a is not None and val_b is not None:
                if str(val_a).strip().lower() == str(val_b).strip().lower():
                    matching += 1
        return matching / total if total > 0 else 0.0

    def _compute_conflict_score(self, attrs_a: Dict[str, Any], attrs_b: Dict[str, Any],
                                identity_critical_keys: Optional[List[str]] = None) -> float:
        if identity_critical_keys is None:
            identity_critical_keys = []
        critical_conflicts = 0
        critical_compared = 0
        for key in set(list(attrs_a.keys()) + list(attrs_b.keys())):
            val_a = attrs_a.get(key)
            val_b = attrs_b.get(key)
            is_critical = key in identity_critical_keys
            if val_a is not None and val_b is not None:
                if is_critical:
                    critical_compared += 1
                    if str(val_a).strip().lower() != str(val_b).strip().lower():
                        critical_conflicts += 1
        if critical_compared == 0:
            return 0.0
        return min(critical_conflicts / critical_compared, 1.0)

    def _identify_missing_critical(self, attrs_a: Dict[str, Any], attrs_b: Dict[str, Any],
                                    critical_keys: List[str]) -> List[str]:
        missing = []
        for key in critical_keys:
            if key not in attrs_a or key not in attrs_b:
                missing.append(key)
            elif attrs_a.get(key) is None or attrs_b.get(key) is None:
                missing.append(key)
        return missing

    def _identify_matching_attributes(self, attrs_a: Dict[str, Any], attrs_b: Dict[str, Any]) -> List[Dict[str, Any]]:
        matching = []
        for key in set(list(attrs_a.keys()) + list(attrs_b.keys())):
            val_a = attrs_a.get(key)
            val_b = attrs_b.get(key)
            if val_a is not None and val_b is not None:
                if str(val_a).strip().lower() == str(val_b).strip().lower():
                    matching.append({"attribute_name": key, "value_a": val_a, "value_b": val_b,
                                     "normalization_applied": "lowercase comparison"})
        return matching

    def _identify_conflicting_attributes(self, attrs_a: Dict[str, Any], attrs_b: Dict[str, Any],
                                          critical_keys: List[str]) -> List[Dict[str, Any]]:
        conflicting = []
        for key in set(list(attrs_a.keys()) + list(attrs_b.keys())):
            val_a = attrs_a.get(key)
            val_b = attrs_b.get(key)
            if val_a is not None and val_b is not None:
                if str(val_a).strip().lower() != str(val_b).strip().lower():
                    conflicting.append({"attribute_name": key, "value_a": val_a, "value_b": val_b,
                                        "is_identity_critical": key in critical_keys,
                                        "normalization_applied": "direct comparison"})
        return conflicting

    def _generate_evidence(self, material_a: MaterialCandidate, material_b: MaterialCandidate,
                           matching_attrs: List[Dict[str, Any]],
                           conflicting_attrs: List[Dict[str, Any]],
                           missing_critical: List[str], conflict_score: float) -> List[Dict[str, Any]]:
        evidence: List[Dict[str, Any]] = []
        for ma in matching_attrs:
            evidence.append({"attribute_name": ma["attribute_name"], "status": "match",
                             "value_a": ma["value_a"], "value_b": ma["value_b"],
                             "normalization_applied": ma["normalization_applied"],
                             "evidence_level": "strong",
                             "model_version": self.model_version, "rule_version": "v1.0"})
        for ca in conflicting_attrs:
            evidence.append({"attribute_name": ca["attribute_name"], "status": "conflict",
                             "value_a": ca["value_a"], "value_b": ca["value_b"],
                             "normalization_applied": ca["normalization_applied"],
                             "evidence_level": "critical" if ca["is_identity_critical"] else "weak",
                             "model_version": self.model_version, "rule_version": "v1.0",
                             "conflict_detected": True})
        if missing_critical:
            evidence.append({"attribute_name": f"MISSING_CRITICAL: {', '.join(missing_critical)}", "status": "missing",
                             "value_a": None, "value_b": None, "normalization_applied": "n/a",
                             "evidence_level": "critical", "model_version": self.model_version,
                             "rule_version": "v1.0", "missing_critical": True})
        if conflict_score > 0.3:
            evidence.append({"attribute_name": "OVERALL_CONFLICT", "status": "blocked",
                             "value_a": f"Conflict score: {conflict_score:.2f}", "value_b": "Identity mapping blocked",
                             "normalization_applied": "n/a", "evidence_level": "critical",
                             "model_version": self.model_version, "rule_version": "v1.0",
                             "conflict_blocked": True})
        return evidence