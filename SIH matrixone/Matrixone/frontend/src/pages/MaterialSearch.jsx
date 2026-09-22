import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Building2,
  Tag,
  Cpu,
  ExternalLink,
  Layers,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  Database,
  FileText,
  Trophy,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Crosshair
} from 'lucide-react';
import { apiClient } from '../utils/api';
import { useAuthStore } from '../store/authStore';

export const MaterialSearch = () => {
  const navigate = useNavigate();
  const { activeCPSEView } = useAuthStore();

  const [query, setQuery] = useState('valve');
  const [selectedCPSE, setSelectedCPSE] = useState('ALL');
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // ── Universal Top-5 AI candidates (anchor = ERP-ID) ──
  const [top5, setTop5] = useState(null); // { anchor, candidates, resolution, query, total_scored }
  const [top5Loading, setTop5Loading] = useState(false);
  const [top5Error, setTop5Error] = useState(null);
  const [top5Open, setTop5Open] = useState(true);
  // When an ERP anchor resolves with selected candidates, the search shows
  // ONLY the Top-5 panel — not the full record list — unless the user opts
  // out via the "Show all records" toggle below the panel.
  const [showFullList, setShowFullList] = useState(false);
  const top5Active = !top5Loading && !!top5 && (top5.candidates?.length || 0) > 0;
  const top5OnlyMode = top5Active && !showFullList;

  const fetchTop5 = async (erpCode) => {
    const q = (erpCode || '').trim();
    if (!q) {
      setTop5(null);
      setTop5Error(null);
      return;
    }
    setTop5Loading(true);
    setTop5Error(null);
    try {
      const data = await apiClient.get('/materials/universal-top5', { erp_id: q, limit: 5 });
      // Panel is ERP-ID-only: show it solely when the query exactly matched a
      // material code. Free-text searches (fuzzy fallback) use the normal list.
      if (data.resolution !== 'exact') {
        setTop5(null);
        setTop5Error(null);
        return;
      }
      setTop5(data);
      setTop5Open(true);
    } catch (err) {
      // 404 = no anchor found → silently hide panel (normal list still shows)
      if (err.status === 404) {
        setTop5(null);
        setTop5Error(null);
      } else {
        setTop5Error(err.message || 'Failed to load Top-5 candidates.');
      }
    } finally {
      setTop5Loading(false);
    }
  };

  const fetchSearchResults = async (searchQuery, cpse) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchQuery.trim()) params.query = searchQuery.trim();
      if (cpse && cpse !== 'ALL') params.cpse = cpse;

      const data = await apiClient.get('/materials/search', params);
      if (data && data.results) {
        setResults(data.results);
        setTotal(data.total || data.results.length);
      } else {
        setResults([]);
        setTotal(0);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search material repository.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults(query, selectedCPSE);
  }, [selectedCPSE]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowFullList(false);
    fetchSearchResults(query, selectedCPSE);
    fetchTop5(query);
  };

  const handleRunAIMatch = (material) => {
    // Navigate to AI matching page with this material pre-selected
    navigate('/matching', { 
      state: { 
        prefillMaterialA: {
          code: material.local_material_code,
          description: material.description,
          cpse: material.organization,
        }
      } 
    });
  };

  const handleShowTop5For = (erpCode) => {
    // Re-anchor from inside the Top-5 panel (the ONLY place Top-5 is triggered
    // besides the search box) and stay in Top-5-only mode.
    if (!erpCode) return;
    setQuery(erpCode);
    setShowFullList(false);
    fetchSearchResults(erpCode, selectedCPSE);
    fetchTop5(erpCode);
    document.getElementById('universal-top5-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const verdictStyle = (decision) => {
    switch (decision) {
      case 'EXACT_RECORD_DUPLICATE':
        return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/40';
      case 'SAME_MATERIAL_CANDIDATE':
        return 'bg-telemetry-cyan/10 text-telemetry-cyan border-telemetry-cyan/40';
      case 'NEAR_DUPLICATE_REVIEW':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/40';
      case 'CONFLICTING_SPECIFICATION':
        return 'bg-red-500/10 text-red-500 border-red-500/40';
      case 'INSUFFICIENT_EVIDENCE':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/40';
      default:
        return 'bg-surface-subtle text-ink-muted border-seam-border';
    }
  };

  const verdictIcon = (decision) => {
    if (decision === 'SAME_MATERIAL_CANDIDATE' || decision === 'EXACT_RECORD_DUPLICATE')
      return <CheckCircle2 className="w-3 h-3" />;
    if (decision === 'CONFLICTING_SPECIFICATION') return <XCircle className="w-3 h-3" />;
    if (decision === 'NEAR_DUPLICATE_REVIEW') return <AlertTriangle className="w-3 h-3" />;
    return <HelpCircle className="w-3 h-3" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-seam-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-telemetry-cyan bg-telemetry-cyan/10 px-2 py-0.5 rounded border border-telemetry-cyan/20">
              NATIONAL REPOSITORY EXPLORER
            </span>
            <span className="text-xs text-ink-muted">&bull; 1.25M Standardized Specifications</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-primary tracking-tight mt-1">
            Universal CPSE Material Search
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary">
            Cross-enterprise search across legacy SAP/Oracle MM databases and unified CNMC canonical codes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/matching')}
            className="py-2 px-3 rounded-lg bg-telemetry-cyan hover:bg-telemetry-cyan-bright text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Match Studio</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Control Bar */}
      <div className="bg-surface border border-seam-border rounded-xl p-4 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by description (e.g. ball valve 2 inch 150#), local ERP code, or CNMC..."
              className="w-full bg-surface-subtle border border-seam-border focus:border-telemetry-cyan focus:outline-none rounded-lg py-2.5 pl-10 pr-4 text-xs sm:text-sm text-ink-primary placeholder-ink-muted font-sans shadow-xs transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCPSE}
              onChange={(e) => setSelectedCPSE(e.target.value)}
              className="bg-surface-subtle border border-seam-border focus:border-telemetry-cyan focus:outline-none rounded-lg py-2.5 px-3 text-xs sm:text-sm text-ink-primary font-mono shadow-xs"
            >
              <option value="ALL">All CPSEs (National Mesh)</option>
              <option value="CPCL">CPCL — Chennai Petroleum</option>
              <option value="ONGC">ONGC — Oil & Natural Gas</option>
              <option value="IOCL">IOCL — Indian Oil Corp</option>
              <option value="NTPC">NTPC — Power Generation</option>
              <option value="SAIL">SAIL — Steel Authority</option>
              <option value="CIL">CIL — Coal India Ltd</option>
            </select>

            <button
              type="submit"
              disabled={isLoading}
              className="py-2.5 px-5 rounded-lg bg-surface-active hover:bg-telemetry-cyan hover:text-white border border-seam-border text-xs sm:text-sm font-semibold transition text-ink-primary font-mono shrink-0 shadow-xs"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono pt-1 text-ink-muted">
          <span className="shrink-0 text-[11px]">Quick Queries:</span>
          {['Ball Valve 2in 150#', 'Centrifugal Pump 50m3', 'Deep Groove Bearing 6205', 'Weld Neck Flange 4in', 'Gasket Spiral Wound'].map((s) => (
            <button
              key={s}
              onClick={() => { setQuery(s); setShowFullList(false); fetchSearchResults(s, selectedCPSE); fetchTop5(s); }}
              className="shrink-0 px-2 py-0.5 rounded-md bg-surface-subtle hover:bg-surface-active border border-seam-border hover:text-telemetry-cyan transition text-[11px]"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Universal Top-5 AI Candidates (anchor = ERP-ID) ── */}
      <div id="universal-top5-panel" className="bg-surface border-2 border-telemetry-cyan/30 rounded-xl shadow-sm overflow-hidden">
        <button
          onClick={() => setTop5Open((v) => !v)}
          className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 text-left hover:bg-surface-subtle/50 transition"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-lg bg-telemetry-cyan/10 border border-telemetry-cyan/30 flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4 text-telemetry-cyan" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-telemetry-cyan">
                {top5
                  ? `Universal Search // Top-${top5.candidates?.length || 0} Selected Candidates`
                  : 'Universal Search // Candidate Selector (Top-5)'}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-ink-primary truncate">
                {top5?.anchor
                  ? <>Anchor ERP <span className="font-mono text-telemetry-cyan">{top5.anchor.local_material_code}</span>
                    <span className="text-ink-muted font-normal"> — {top5.anchor.description?.slice(0, 80)}</span></>
                  : 'Type any CPCL (or any-CPSE) ERP-ID above and hit Search'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-ink-muted shrink-0">
            {top5Loading ? 'Scoring…' : top5Open ? 'Hide ▲' : `Show ▼${top5 ? ` (${top5.candidates?.length || 0})` : ''}`}
          </span>
        </button>

        {top5Open && (
          <div className="px-4 sm:px-5 pb-5 pt-1 space-y-4 border-t border-seam-border">
            {top5Loading && (
              <div className="space-y-2 pt-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 rounded-lg bg-surface-subtle border border-seam-border animate-pulse" />
                ))}
              </div>
            )}

            {!top5Loading && top5Error && (
              <p className="text-xs text-red-500 pt-3">Top-5 error: {top5Error}</p>
            )}

            {!top5Loading && !top5Error && !top5 && (
              <p className="text-xs text-ink-muted pt-3 leading-relaxed">
                No anchor resolved yet. Search an exact ERP code (e.g. <button onClick={() => { setQuery('CPCL-VLV-1168'); setShowFullList(false); fetchSearchResults('CPCL-VLV-1168', selectedCPSE); fetchTop5('CPCL-VLV-1168'); }} className="font-mono text-telemetry-cyan hover:underline">CPCL-VLV-1168</button>) to see the
                Top-5 selected equivalents with 3-layer criteria + categorical verdict. Only genuine candidates are selected — slots are never padded. Plain free-text searches use the normal records list below.
              </p>
            )}

            {!top5Loading && top5 && (
              <>
                {/* Anchor summary strip */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-ink-secondary pt-3">
                  <span className="px-2 py-0.5 rounded bg-surface-subtle border border-seam-border">
                    ANCHOR: <strong className="text-ink-primary">{top5.anchor.organization}</strong> · {top5.anchor.local_material_code}
                  </span>
                  {top5.anchor.national_code && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 font-bold">
                      CNMC: {top5.anchor.national_code}
                    </span>
                  )}
                  <span className="text-ink-muted">resolution: {top5.resolution} · scored {top5.total_scored} · qualified {top5.total_qualified ?? top5.candidates?.length ?? 0}</span>
                </div>

                {/* Selected candidates (qualified only — never padded) */}
                {(top5.candidates?.length || 0) === 0 ? (
                  <div className="rounded-xl border border-dashed border-seam-border bg-surface-subtle/40 p-6 text-center space-y-1.5">
                    <HelpCircle className="w-6 h-6 text-ink-muted mx-auto" />
                    <p className="text-xs font-semibold text-ink-primary">No qualifying candidates selected</p>
                    <p className="text-[11px] text-ink-muted max-w-md mx-auto leading-relaxed">
                      {top5.total_scored} materials were scored, but none were judged a genuine
                      equivalent (EXACT / SAME-MATERIAL / NEAR-DUPLICATE). Conflicting and
                      insufficient-evidence rows are excluded by design — slots are never
                      filled with non-candidates.
                    </p>
                  </div>
                ) : (
                <div className="space-y-3">
                  {top5.candidates.map((cand) => (
                    <div
                      key={cand.material.id}
                      className="rounded-xl border border-seam-border hover:border-telemetry-cyan/40 bg-surface-subtle/40 p-4 transition"
                    >
                      {/* Rank + verdict header */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono border ${
                          cand.rank === 1
                            ? 'bg-amber-500/15 text-amber-500 border-amber-500/40'
                            : 'bg-surface-active text-ink-secondary border-seam-border'
                        }`}>
                          {cand.rank}
                        </span>
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-surface-active border border-seam-border text-telemetry-cyan">
                          {cand.material.organization}
                        </span>
                        <button
                          onClick={() => handleShowTop5For(cand.material.local_material_code)}
                          title="Use as new anchor"
                          className="text-[11px] font-mono text-ink-secondary hover:text-telemetry-cyan transition"
                        >
                          ERP: <strong className="underline decoration-dotted">{cand.material.local_material_code}</strong>
                        </button>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border flex items-center gap-1 ${verdictStyle(cand.verdict.decision_category)}`}>
                          {verdictIcon(cand.verdict.decision_category)}
                          {cand.verdict.decision_category} · {cand.verdict.match_type}
                        </span>
                        <span className="ml-auto text-sm font-bold font-mono text-telemetry-emerald">
                          {cand.scores.confidence_percent}%
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-ink-primary leading-snug">
                        {cand.material.description}
                      </p>
                      {cand.material.national_code && (
                        <p className="text-[11px] font-mono text-emerald-500 mt-0.5">CNMC: {cand.material.national_code}</p>
                      )}

                      {/* 3-layer criteria bars */}
                      <div className="grid grid-cols-3 gap-2 mt-3 text-[10px] font-mono">
                        {[
                          { label: 'Semantic', v: cand.scores.semantic, c: 'bg-telemetry-cyan' },
                          { label: 'Text', v: cand.scores.text, c: 'bg-telemetry-amber' },
                          { label: 'Spec', v: cand.scores.spec, c: 'bg-telemetry-emerald' },
                        ].map((b) => (
                          <div key={b.label} className="p-2 rounded-lg bg-surface border border-seam-border">
                            <div className="flex justify-between text-ink-secondary font-semibold">
                              <span>{b.label}</span>
                              <span className="text-ink-primary">{Math.round((b.v || 0) * 100)}%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-surface-subtle overflow-hidden mt-1">
                              <div className={`${b.c} h-full rounded-full`} style={{ width: `${(b.v || 0) * 100}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Per-criterion review table */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 mt-2 text-[10px] font-mono">
                        {cand.criteria.map((cr) => (
                          <div
                            key={cr.key}
                            className={`p-1.5 rounded-lg border ${
                              cr.status === 'match'
                                ? 'bg-emerald-500/5 border-emerald-500/30'
                                : cr.status === 'conflict'
                                  ? 'bg-red-500/5 border-red-500/30'
                                  : 'bg-surface border-seam-border'
                            }`}
                            title={`Anchor: ${cr.anchor_value ?? '—'} vs Candidate: ${cr.candidate_value ?? '—'}`}
                          >
                            <span className="text-ink-muted uppercase block text-[9px]">{cr.criterion}</span>
                            <span className={`font-bold flex items-center gap-1 ${
                              cr.status === 'match' ? 'text-emerald-500' : cr.status === 'conflict' ? 'text-red-500' : 'text-ink-muted'
                            }`}>
                              {cr.status === 'match' ? <CheckCircle2 className="w-3 h-3" /> : cr.status === 'conflict' ? <XCircle className="w-3 h-3" /> : null}
                              {cr.candidate_value !== null && cr.candidate_value !== undefined && cr.candidate_value !== ''
                                ? String(cr.candidate_value) : '—'}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Categorical review + explanation */}
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] font-mono text-ink-secondary">
                        <span className={`px-2 py-0.5 rounded border ${cand.categorical_review.category_match ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-amber-500/10 text-amber-500 border-amber-500/30'}`}>
                          Category: {cand.categorical_review.anchor_category} {cand.categorical_review.category_match ? '≈' : '≠'} {cand.categorical_review.candidate_category}
                        </span>
                        {cand.categorical_review.same_organization && (
                          <span className="px-2 py-0.5 rounded bg-surface-active border border-seam-border">same-CPSE duplicate</span>
                        )}
                        {cand.scores.conflict > 0.3 && (
                          <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/30">
                            conflict {Math.round(cand.scores.conflict * 100)}%
                          </span>
                        )}
                      </div>
                      {cand.explanation?.length > 0 && (
                        <p className="text-[11px] text-ink-secondary leading-relaxed mt-2">
                          <strong className="text-ink-primary font-mono">Why:</strong> {cand.explanation.slice(0, 4).join(' · ')}
                        </p>
                      )}
                      {cand.verdict.recommendation && (
                        <p className="text-[11px] mt-1 text-ink-muted italic">→ {cand.verdict.recommendation}</p>
                      )}

                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => setSelectedItem({
                            organization: cand.material.organization,
                            local_material_code: cand.material.local_material_code,
                            national_code: cand.material.national_code,
                            description: cand.material.description,
                            uom: cand.material.uom,
                            parsed_specs: cand.material.parsed_specs,
                          })}
                          className="py-1.5 px-3 rounded-lg bg-surface hover:bg-surface-active border border-seam-border text-[11px] font-semibold text-ink-secondary hover:text-ink-primary transition font-mono flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Passport</span>
                        </button>
                        <button
                          onClick={() => handleRunAIMatch({
                            local_material_code: cand.material.local_material_code,
                            description: cand.material.description,
                            organization: cand.material.organization,
                          })}
                          className="py-1.5 px-3 rounded-lg bg-telemetry-cyan/10 hover:bg-telemetry-cyan text-telemetry-cyan hover:text-white border border-telemetry-cyan/30 text-[11px] font-semibold transition font-mono flex items-center gap-1"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>AI Match</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Top-5-only mode: search resolved to an ERP anchor, so the general
          record list stays hidden unless the user explicitly opts out. */}
      {top5Active && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowFullList((v) => !v)}
            className="py-1.5 px-3 rounded-lg bg-surface-subtle hover:bg-surface-active border border-seam-border text-[11px] font-semibold text-ink-secondary hover:text-ink-primary transition font-mono"
          >
            {showFullList
              ? '← Back to Top-5 selected candidates only'
              : `Show all ${total} matching records instead`}
          </button>
        </div>
      )}

      {!top5OnlyMode && (
      <>
      {/* Results Header / Stats */}
      <div className="flex items-center justify-between text-xs font-mono text-ink-secondary px-1">
        <div>
          Found <strong className="text-telemetry-cyan">{total}</strong> records matching "{query}"
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-telemetry-emerald">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Connected to Live SQLite Repository</span>
          </span>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-surface border border-seam-border animate-pulse"></div>
          ))}
        </div>
      )}

      {/* Error Banner */}
      {error && !isLoading && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs">
          <strong>Search Error:</strong> {error}
        </div>
      )}

      {/* Results List */}
      {!isLoading && !error && results.length > 0 && (
        <div className="space-y-3 font-sans">
          {results.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-surface border border-seam-border hover:border-telemetry-cyan/40 rounded-xl p-4 sm:p-5 transition shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              {/* Material Information */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-surface-subtle border border-seam-border text-telemetry-cyan">
                    {item.organization || 'CPCL'}
                  </span>
                  <button
                    onClick={() => handleShowTop5For(item.local_material_code || item.legacyCode)}
                    title="Show Top-5 AI candidates for this ERP-ID"
                    className="text-xs font-mono text-ink-muted hover:text-telemetry-cyan transition"
                  >
                    ERP ID: <strong className="text-ink-secondary underline decoration-dotted">{item.local_material_code || item.legacyCode}</strong>
                  </button>
                  {item.national_code ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      CNMC: {item.national_code}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-500 border border-amber-500/30">
                      UNMAPPED // CANDIDATE
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-ink-primary group-hover:text-telemetry-cyan transition">
                  {item.description}
                </h3>

                {/* Technical Specifications Pills */}
                {item.parsed_specs && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono">
                    {Object.entries(item.parsed_specs).map(([k, v]) => (
                      <span key={k} className="px-2 py-0.5 rounded bg-surface-subtle text-ink-secondary border border-seam-border">
                        <strong className="text-ink-muted uppercase">{k}:</strong> {String(v)}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => handleShowTop5For(item.local_material_code || item.legacyCode)}
                  title="Show Top-5 AI candidates for this ERP-ID"
                  className="py-1.5 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white border border-amber-500/30 text-xs font-semibold transition font-mono flex items-center gap-1 shadow-xs"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>Top 5</span>
                </button>
                <button
                  onClick={() => setSelectedItem(item)}
                  className="py-1.5 px-3 rounded-lg bg-surface-subtle hover:bg-surface-active border border-seam-border text-xs font-semibold text-ink-secondary hover:text-ink-primary transition font-mono flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Passport</span>
                </button>

                <button
                  onClick={() => handleRunAIMatch(item)}
                  className="py-1.5 px-3 rounded-lg bg-telemetry-cyan/10 hover:bg-telemetry-cyan text-telemetry-cyan hover:text-white border border-telemetry-cyan/30 text-xs font-semibold transition font-mono flex items-center gap-1 shadow-xs"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>AI Match</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && results.length === 0 && (
        <div className="bg-surface border border-seam-border rounded-xl p-12 text-center space-y-3">
          <Database className="w-10 h-10 text-ink-muted mx-auto" />
          <h3 className="text-base font-bold text-ink-primary">No Matching Material Records Found</h3>
          <p className="text-xs text-ink-secondary max-w-md mx-auto">
            Try adjusting your search query, clearing CPSE filters, or browsing by category above.
          </p>
          <button
            onClick={() => { setQuery(''); setShowFullList(false); fetchSearchResults('', 'ALL'); fetchTop5(''); }}
            className="py-2 px-4 rounded-lg bg-surface-subtle hover:bg-surface-active border border-seam-border text-xs font-semibold text-ink-primary font-mono transition mt-2"
          >
            Show All Ingested Materials
          </button>
        </div>
      )}
      </>
      )}

      {/* Material Passport Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-seam-border rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 font-sans animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-seam-border pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-telemetry-cyan bg-telemetry-cyan/10 px-2 py-0.5 rounded border border-telemetry-cyan/20">
                  DIGITAL MATERIAL PASSPORT
                </span>
                <h3 className="text-base font-bold text-ink-primary mt-1">
                  {selectedItem.description}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-ink-muted hover:text-ink-primary p-1 rounded-md"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-surface-subtle border border-seam-border">
                  <span className="text-ink-muted block text-[10px]">ORIGIN CPSE</span>
                  <span className="text-ink-primary font-bold">{selectedItem.organization || 'CPCL'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-subtle border border-seam-border">
                  <span className="text-ink-muted block text-[10px]">ERP MATERIAL ID</span>
                  <span className="text-ink-primary font-bold">{selectedItem.local_material_code}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-subtle border border-seam-border">
                  <span className="text-ink-muted block text-[10px]">SOVEREIGN CNMC</span>
                  <span className="text-telemetry-emerald font-bold">{selectedItem.national_code || 'PENDING'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-subtle border border-seam-border">
                  <span className="text-ink-muted block text-[10px]">UNIT OF MEASURE</span>
                  <span className="text-ink-primary font-bold">{selectedItem.uom || 'EA / NOS'}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-subtle border border-seam-border space-y-1.5">
                <span className="text-[10px] text-ink-muted uppercase font-bold">Extracted Engineering Specifications</span>
                {selectedItem.parsed_specs ? (
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    {Object.entries(selectedItem.parsed_specs).map(([k, v]) => (
                      <div key={k} className="flex justify-between border-b border-seam-border/50 py-0.5">
                        <span className="text-ink-muted capitalize">{k}:</span>
                        <span className="text-ink-primary font-semibold">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-ink-muted text-[11px]">No structured attributes recorded.</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-seam-border">
              <button
                onClick={() => setSelectedItem(null)}
                className="py-2 px-4 rounded-lg bg-surface-subtle hover:bg-surface-active border border-seam-border text-xs font-semibold text-ink-secondary"
              >
                Close Passport
              </button>
              <button
                onClick={() => { const item = selectedItem; setSelectedItem(null); handleRunAIMatch(item); }}
                className="py-2 px-4 rounded-lg bg-telemetry-cyan hover:bg-telemetry-cyan-bright text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Open in AI Matching Studio</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
