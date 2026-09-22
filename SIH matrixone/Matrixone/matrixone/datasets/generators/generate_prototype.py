"""Generate MATRIXONE prototype datasets (~1500 rows, DEMO/SIMULATED).

Outputs (matrixone/datasets/fixtures/):
  - cpse_master.csv
  - material_master.csv        (main dataset ⭐)
  - procurement_history.csv
  - matching_labels.csv
  - README.md

Design: ~100 base concepts × variations across 6 CPSEs with realistic
Indian procurement terminology, abbreviations, typos and unit variants so the
AI matching engine can demo Identical / Near-Duplicate / Equivalent.
"""
import csv
import os
import random
from pathlib import Path

random.seed(42)

FIXTURES = Path(__file__).resolve().parents[1] / "fixtures"
FIXTURES.mkdir(parents=True, exist_ok=True)

CPSES = [
    ("ONGC", "Oil & Gas", "Ministry of Petroleum & Natural Gas", "Active"),
    ("IOCL", "Oil & Gas", "Ministry of Petroleum & Natural Gas", "Active"),
    ("CPCL", "Oil & Gas", "Ministry of Petroleum & Natural Gas", "Active"),
    ("NTPC", "Power", "Ministry of Power", "Active"),
    ("SAIL", "Steel", "Ministry of Steel", "Active"),
    ("CIL", "Mining", "Ministry of Coal", "Active"),
]

# (category, base_desc, spec, uom, variants_per_concept)
# Keep counts summing ≈1500 with variations
CATEGORY_PLAN = [
    ("Valve", 30, 15),      # 30 concepts × ~15 rows? too many. We'll control below.
]

# Base material concepts: (category, canonical, spec, uom, code_prefix)
BASE_CONCEPTS = [
    # Valves (30 concepts)
    ("Valve", "Gate Valve 100mm CS Class 150", "CS, 150#, Flanged", "EA", "VLV"),
    ("Valve", "Gate Valve 50mm SS316 PN40", "SS316, PN40, Flanged RF", "EA", "VLV"),
    ("Valve", "Ball Valve 80mm SS304 Class 300", "SS304, Class 300, Screwed", "NOS", "VLV"),
    ("Valve", "Globe Valve 65mm CS 150#", "CS, 150#, Flanged", "EA", "VLV"),
    ("Valve", "Butterfly Valve 200mm CI PN16", "CI, PN16, Wafer", "EA", "VLV"),
    ("Valve", "Check Valve 150mm CS Class 150", "CS, NACE, Flanged", "NOS", "VLV"),
    ("Valve", "Gate Valve 150mm CS 300#", "CS, 300#, RTJ", "EA", "VLV"),
    ("Valve", "Needle Valve 25mm SS316 6000psi", "SS316, 6000 psi, NPT", "NOS", "VLV"),
    ("Valve", "Plug Valve 100mm CS PTFE", "CS+PTFE sleeve, 150#", "EA", "VLV"),
    ("Valve", "Safety Relief Valve 50mm SS", "SS, Set 10 barg, Flanged", "EA", "VLV"),
    ("Valve", "Gate Valve 200mm CI PN10", "CI, PN10, Flanged", "EA", "VLV"),
    ("Valve", "Ball Valve 50mm Brass Screwed", "Brass, Screwed BSP", "NOS", "VLV"),
    ("Valve", "Diaphragm Valve 80mm PP", "PP body, EPDM diaphragm", "EA", "VLV"),
    ("Valve", "Knife Gate Valve 250mm SS", "SS gate, PN10, Lug", "EA", "VLV"),
    ("Valve", "Foot Valve 100mm CI", "CI, Flanged, With strainer", "NOS", "VLV"),
    # Pumps (20)
    ("Pump", "Centrifugal Pump 50x40 15kW", "50x40mm, 15kW, 2900rpm", "SET", "PMP"),
    ("Pump", "Submersible Pump 10HP 100mm", "10HP, 100mm bore, 3ph", "SET", "PMP"),
    ("Pump", "Screw Pump 5m3/hr SS", "5 m3/hr, SS wetted", "NOS", "PMP"),
    ("Pump", "Diaphragm Dosing Pump 0-100LPH", "0-100 LPH, PP head", "NOS", "PMP"),
    ("Pump", "Multistage Pump 65x50 30kW", "65x50, 30kW, 8 stage", "SET", "PMP"),
    ("Pump", "Slurry Pump 100mm HNBR", "100mm, HNBR lined", "SET", "PMP"),
    ("Pump", "Gear Pump 2inch CI", "2 inch, CI, 1440rpm", "NOS", "PMP"),
    ("Pump", "Vertical Turbine Pump 200mm", "200mm column, 75kW", "SET", "PMP"),
    # Bearings (15)
    ("Bearing", "Deep Groove Ball Bearing 6205", "25x52x15, SKF/equiv", "NOS", "BRG"),
    ("Bearing", "Taper Roller Bearing 32210", "50x90x24.75", "NOS", "BRG"),
    ("Bearing", "Spherical Roller Bearing 22218", "90x160x40", "NOS", "BRG"),
    ("Bearing", "Plummer Block UCP210", "50mm bore, CI housing", "NOS", "BRG"),
    ("Bearing", "Thrust Ball Bearing 51108", "40x60x13", "NOS", "BRG"),
    ("Bearing", "Needle Roller Bearing NK45/35", "45x55x35", "NOS", "BRG"),
    # Pipes (12)
    ("Pipe", "MS Pipe 100mm NB ERW", "100 NB, ERW, 6m", "MTR", "PIP"),
    ("Pipe", "SS316 Pipe 50mm NB Sch40", "50 NB, Sch40, Seamless", "MTR", "PIP"),
    ("Pipe", "CS Pipe 150mm NB Sch80", "150 NB, Sch80, API 5L", "MTR", "PIP"),
    ("Pipe", "GI Pipe 25mm Medium", "25mm, Medium, IS1239", "MTR", "PIP"),
    ("Pipe", "HDPE Pipe 110mm PN10", "110mm OD, PN10, PE100", "MTR", "PIP"),
    # Motors (9)
    ("Motor", "Induction Motor 15kW 4P IE3", "15kW, 4P, 415V, IE3", "NOS", "MTR"),
    ("Motor", "Flameproof Motor 30kW Exd", "30kW, Exd IIB, 415V", "NOS", "MTR"),
    ("Motor", "DC Motor 5kW 1500rpm", "5kW, 220V DC", "NOS", "MTR"),
    # Cables (6)
    ("Cable", "XLPE Cable 3Cx120sqmm 1.1kV", "3Cx120, Al, Armoured", "MTR", "CBL"),
    ("Cable", "Control Cable 12Cx2.5sqmm", "12Cx2.5 Cu, Unarm", "MTR", "CBL"),
    ("Cable", "HT Cable 3Cx300 11kV", "3Cx300 Al XLPE 11kV", "MTR", "CBL"),
    # Flanges (5)
    ("Flange", "WN Flange 100mm 150# CS", "100 NB, 150#, A105", "NOS", "FLG"),
    ("Flange", "Blind Flange 50mm 300# SS316", "50 NB, 300#, SS316", "NOS", "FLG"),
    ("Flange", "Slipon Flange 80mm PN16", "80 NB, PN16, MS", "NOS", "FLG"),
    # Fasteners/Gaskets (5)
    ("Fastener", "Hex Bolt M20x80 8.8 HDG", "M20x80, Gr 8.8, HDG+nut", "SET", "FST"),
    ("Gasket", "Spiral Wound Gasket 4in 150#", "4in, 150#, SS316+Graphite", "NOS", "GSK"),
    ("Gasket", "Ring Joint Gasket R37 SS316", "R37, Octagonal, SS316", "NOS", "GSK"),
]

# Per-CPSE description styles to create realistic variations
def style_description(cpse: str, canonical: str, cat: str) -> str:
    c = canonical
    if cpse == "ONGC":
        return c.replace("mm", "MM").upper().replace("CLASS", "CL")
    if cpse == "IOCL":
        # inch-style + long form
        rep = (c.replace("100mm", "4 Inch").replace("50mm", "2 Inch")
                 .replace("80mm", "3 Inch").replace("150mm", "6 Inch")
                 .replace("200mm", "8 Inch").replace("CS", "Carbon Steel"))
        return rep
    if cpse == "CPCL":
        return (c.replace("mm", " MM").replace("Class", "CL").replace("  ", " "))
    if cpse == "NTPC":
        return c + " RF" if "Flanged" in c or "Valve" in cat else c
    if cpse == "SAIL":
        return c.replace("SS316", "AISI 316").replace("SS304", "AISI 304")
    if cpse == "CIL":
        # abbreviation-heavy + occasional typo injection handled later
        return (c.replace("Valve", "VLV").replace("Gate", "GATE")
                 .replace("Ball", "BALL").replace("Bearing", "BRG"))
    return c

UOM_VARIANTS = {"EA": ["EA", "NOS", "PCS"], "NOS": ["NOS", "EA", "PCS"],
                "SET": ["SET", "EA"], "MTR": ["MTR", "M", "NOS"], "PCS": ["PCS", "NOS", "EA"]}

CPSE_CODES = {c: 1000 for c, _, _, _ in CPSES}

def legacy_code(cpse: str, prefix: str) -> str:
    CPSE_CODES[cpse] += random.randint(1, 7)
    sep = random.choice(["-", "/", "_"])
    return f"{cpse}{sep}{prefix}{sep}{CPSE_CODES[cpse]}"

def main():
    # 1. CPSE master
    with open(FIXTURES / "cpse_master.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["cpse", "sector", "ministry", "status", "note"])
        for c, sector, ministry, status in CPSES:
            w.writerow([c, sector, ministry, status, "DEMO / SIMULATED"])

    # 2. Material master ~1500 rows
    rows = []
    target_total = 1500
    # repeat base concepts with weights: valves heavier
    weights = []
    for i, (cat, canon, spec, uom, prefix) in enumerate(BASE_CONCEPTS):
        w = 3 if cat in ("Valve", "Pump") else 2
        weights.append(w)
    # expand until target
    idx = 0
    concept_cycle = []
    for i, bc in enumerate(BASE_CONCEPTS):
        for _ in range(weights[i] * 6):
            concept_cycle.append((i, bc))
    random.shuffle(concept_cycle)
    n = 0
    ci = 0
    while n < target_total:
        i, (cat, canon, spec, uom, prefix) = concept_cycle[ci % len(concept_cycle)]
        ci += 1
        cpse = random.choice([c for c, _, _, _ in CPSES])
        desc = style_description(cpse, canon, cat)
        # inject noise: 6% typos, 8% extra spaces/punct
        r = random.random()
        if r < 0.06:
            desc = desc.replace("Valve", "Vlve").replace("VALVE", "VALV").replace("Bearing", "Bearng")
        elif r < 0.14:
            desc = desc.replace(" ", random.choice(["  ", " - ", ", "]), 1)
        code = legacy_code(cpse, prefix)
        # UOM variant
        uom_choices = UOM_VARIANTS.get(uom, [uom])
        uom_val = random.choice(uom_choices)
        # Data-quality injections: ~3% missing UOM, ~2% missing category, ~1% invalid code, ~2% dup
        if random.random() < 0.03:
            uom_val = ""
        cat_val = cat
        if random.random() < 0.02:
            cat_val = ""
        if random.random() < 0.01:
            code = "???"
        if rows and random.random() < 0.02:
            # duplicate a previous row's code+desc (same CPSE)
            dup = random.choice(rows)
            if dup[0] == cpse:
                code = dup[1]
        rows.append([cpse, code, desc, cat_val, spec, uom_val])
        n += 1

    with open(FIXTURES / "material_master.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["cpse", "legacy_code", "description", "category", "specification", "uom"])
        w.writerows(rows)

    # 3. Procurement history (sample 300 rows for analytics/savings)
    with open(FIXTURES / "procurement_history.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["cpse", "legacy_code", "qty", "unit_price_inr", "year", "note"])
        sample = random.sample(rows, min(300, len(rows)))
        for cpse, code, desc, cat, spec, uom in sample:
            qty = random.randint(5, 500)
            price = random.randint(800, 250000)
            year = random.choice([2023, 2024, 2025, 2026])
            w.writerow([cpse, code, qty, price, year, "DEMO / SIMULATED"])

    # 4. Matching labels (hand-picked examples)
    with open(FIXTURES / "matching_labels.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["desc_a", "desc_b", "label", "note"])
        w.writerows([
            ["SS316 GATE VALVE 50MM PN40 FLANGED", "VALVE, GATE, FLANGED, 50 NB, SS316, CLASS 300", "functional_equivalent", "Same job, equivalent spec — needs tech check"],
            ["GATE VALVE SS316 50MM", "SS 316 GATE VALVE 50 MM", "near_duplicate", "Spacing/abbrev only"],
            ["Gate Valve 100mm CS 150#", "Gate Valve 100mm CS 150#", "identical", "Exact"],
            ["Gate Valve 100mm CS 150#", "Globe Valve 100mm CS 150#", "different", "Different valve type — must NOT match"],
            ["Deep Groove Ball Bearing 6205", "BRG 6205 25x52x15", "near_duplicate", "Abbrev + dims"],
            ["Stainless Steel Gate Valve", "AISI 316 Gate Valve", "functional_equivalent", "Grade synonym"],
            ["VALVE", "VLVE", "near_duplicate", "Typo"],
            ["MS Pipe 100mm NB ERW", "SS316 Pipe 100mm NB ERW", "different", "Different metallurgy — critical conflict"],
        ])

    with open(FIXTURES / "README.md", "w", encoding="utf-8") as f:
        f.write(
            "# MATRIXONE Prototype Datasets — DEMO / SIMULATED\n\n"
            "No real CPSE SAP/ERP data is included. All rows are synthetic with\n"
            "realistic Indian procurement terminology for SIH demo only.\n\n"
            "- `cpse_master.csv` — 6 CPSEs (ONGC/IOCL/CPCL/NTPC/SAIL/CIL)\n"
            "- `material_master.csv` — ~1500 rows, intentionally overlapping across CPSEs\n"
            "- `procurement_history.csv` — 300 sample rows for savings/analytics\n"
            "- `matching_labels.csv` — 8 labelled pairs (identical/near/equivalent/different)\n"
        )
    print(f"Wrote {len(rows)} material rows to {FIXTURES / 'material_master.csv'}")

if __name__ == "__main__":
    main()
