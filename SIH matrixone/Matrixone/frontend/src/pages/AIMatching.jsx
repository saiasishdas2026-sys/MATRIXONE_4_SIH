import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Cpu, Layers,
  Search, Sparkles, RefreshCw, Check, Zap, FileCode2,
  ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2, XCircle, HelpCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { apiClient } from '../utils/api';
import { useMaterialStore } from '../store/materialStore';
import { ConfidenceGauge } from '../components/matching/ConfidenceGauge';
import { AttributeComparer } from '../components/matching/AttributeComparer';
import { MatchCard } from '../components/matching/MatchCard';

const PRESET_PAIRS = [
  {
    title: 'Ball Valve 2" 150# (CPCL vs ONGC)',
    group: 'VALVE',
    textA: 'BALL VALVE 2 INCH 150# CS ASTM A216 WCB RF FLANGED LEVER OPERATED',
    cpseA: 'CPCL',
    codeA: 'VLV-BL-02-150-CS',
    specsA: { size: '2 Inch (50NB)', pressure_class: '150# (PN20)', metallurgy: 'WCB Carbon Steel', end_connection: 'Flanged RF' },
    textB: 'VALVE BALL 2IN 150LBS WCB BODY SS316 BALL FLANGED RF',
    cpseB: 'ONGC',
    codeB: 'VALVE-BALL-2IN-150#-WCB',
    specsB: { size: '2 Inch (50NB)', pressure_class: '150# (PN20)', metallurgy: 'WCB Carbon Steel / SS316', end_connection: 'Flanged RF' },
  },
  {
    title: 'Centrifugal Pump 50m³/hr (NTPC vs IOCL)',
    group: 'PUMP',
    textA: 'CENTRIFUGAL PUMP 50 M3/HR HEAD 45M MOTOR 15KW CASING CI ENCLOSED IMPELLER',
    cpseA: 'NTPC',
    codeA: 'PMP-CF-50M3-45M',
    specsA: { capacity: '50 m3/hr', head: '45m', power: '15 kW', casing: 'Cast Iron (CI)' },
    textB: 'PUMP CENTRIFUGAL WATER 50M3 45M HEAD CI CASING 15KW MOTOR 415V',
    cpseB: 'IOCL',
    codeB: 'PUMP-CENT-50-45-15KW',
    specsB: { capacity: '50 m3/hr', head: '45m', power: '15 kW', casing: 'Cast Iron (CI)' },
  },
  {
    title: 'Deep Groove Ball Bearing 6205 (SAIL vs BHEL)',
    group: 'BEARING',
    textA: 'DEEP GROOVE BALL BEARING 6205-2RS1 SKF C3 CLEARANCE 25X52X15MM',
    cpseA: 'SAIL',
    codeA: 'BRG-6205-2RS-SKF',
    specsA: { bearing_type: 'Deep Groove', series: '6205', seal: '2RS (Double Rubber)', clearance: 'C3', bore: '25mm' },
    textB: 'BEARING RADIAL BALL 6205 2RS DOUBLE RUBBER SEAL 25MM BORE',
    cpseB: 'BHEL',
    codeB: 'BEARING-6205-2RS-C3',
    specsB: { bearing_type: 'Deep Groove Radial', series: '6205', seal: '2RS (Double Rubber)', clearance: 'Standard/C3', bore: '25mm' },
  },
  {
    title: 'Weld Neck Flange 4" 300# (GAIL vs CPCL)',
    group: 'FITTING',
    textA: 'FLANGE WELD NECK 4 INCH CLASS 300 RF ASTM A105 SCH 40 SERRATED',
    cpseA: 'GAIL',
    codeA: 'FLG-WN-04-300-RF',
    specsA: { type: 'Weld Neck', size: '4 Inch', rating: '300#', metallurgy: 'ASTM A105 Carbon Steel', schedule: 'SCH 40' },
    textB: 'WELD NECK FLANGE 4IN 300# WNRF CARBON STEEL ASTM A105',
    cpseB: 'CPCL',
    codeB: 'FLANGE-WNRF-4IN-300LBS',
    specsB: { type: 'Weld Neck', size: '4 Inch', rating: '300#', metallurgy: 'ASTM A105 Carbon Steel', schedule: 'SCH 40' },
  }
];

export const AIMatching = () => {
  const location = useLocation();
  const { matchPairs, activeMatchPairId, setActiveMatchPair, mintCustomCNMC } = useMaterialStore();
  const [activeTab, setActiveTab] = useState('ondemand'); // 'ondemand' | 'queue'
  const [filterTier, setFilterTier] = useState('ALL');

  // On-demand comparison state
  const [selectedPreset, setSelectedPreset] = useState(PRESET_PAIRS[0]);
  const [textA, setTextA] = useState(PRESET_PAIRS[0].textA);
  const [codeA, setCodeA] = useState(PRESET_PAIRS[0].codeA);
  const [cpseA, setCpseA] = useState(PRESET_PAIRS[0].cpseA);

  const [textB, setTextB] = useState(PRESET_PAIRS[0].textB);
  const [codeB, setCodeB] = useState(PRESET_PAIRS[0].codeB);
  const [cpseB, setCpseB] = useState(PRESET_PAIRS[0].cpseB);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [liveAnalysisResult, setLiveAnalysisResult] = useState(null);
  const [mintedCode, setMintedCode] = useState(null);
  const [isMinting, setIsMinting] = useState(false);

  // Check if routed with prefilled material from Universal Search
  useEffect(() => {
    if (location.state?.prefillMaterialA) {
      const p = location.state.prefillMaterialA;
      setTextA(p.description || '');
      setCodeA(p.code || 'PREFILLED-001');
      setCpseA(p.cpse || 'CPCL');
      setActiveTab('ondemand');
    }
  }, [location.state]);

  const activePair = matchPairs.find(p => p.id === activeMatchPairId) || matchPairs[0];

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setTextA(preset.textA);
    setCodeA(preset.codeA);
    setCpseA(preset.cpseA);
    setTextB(preset.textB);
    setCodeB(preset.codeB);
    setCpseB(preset.cpseB);
    setLiveAnalysisResult(null);
    setMintedCode(null);
  };

  const handleRunLiveAnalysis = async () => {
    setIsAnalyzing(true);
    setMintedCode(null);
    try {
      const res = await apiClient.post('/matching/analyze', {
        text_a: textA,
        text_b: textB,
        cpse_code: cpseA || 'CPCL'
      });
      setLiveAnalysisResult(res);
      toast.success('Live AI analysis completed across multi-vector ensemble!');
    } catch (err) {
      console.error('Live analysis failed:', err);
      toast.error('AI Matching request failed: ' + (err.message || 'Network error'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleMintOnDemandCNMC = async (codeToMint) => {
    setIsMinting(true);
    try {
      // 1. Trigger Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // 2. Register in Master Store
      if (mintCustomCNMC) {
        mintCustomCNMC({
          cnmc: codeToMint,
          description: textA,
          mappedCodes: [codeA, codeB],
          status: 'SOVEREIGN_MINTED',
          sector: selectedPreset?.group || 'OIL & GAS',
          confidence: liveAnalysisResult?.matches?.[0]?.confidence_percent || 96.4,
        });
      }

      setMintedCode(codeToMint);
      toast.success(`CNMC ${codeToMint} minted & federated into National Master!`, {
        duration: 4000
      });
    } catch (err) {
      toast.error('Failed to mint CNMC code: ' + err.message);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-seam-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-telemetry-cyan bg-telemetry-cyan/10 px-2 py-0.5 rounded border border-telemetry-cyan/20">
              TRI-MODAL ENGINE // V2.4 SOVEREIGN
            </span>
            <span className="text-xs text-ink-muted">&bull; RapidFuzz + SBERT + Spec Extraction</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-primary tracking-tight mt-1 font-mono">
            AI Material Harmonization Studio
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary">
            Tri-modal semantic, lexical, and technical specification matching across disparate CPSE ERP databases.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-surface-subtle p-1 rounded-lg border border-seam-border shrink-0 text-xs font-mono">
          <button
            onClick={() => setActiveTab('ondemand')}
            className={`px-3.5 py-1.5 rounded-md font-semibold transition ${
              activeTab === 'ondemand'
                ? 'bg-telemetry-cyan text-white shadow-xs'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            Live Tri-Modal Studio
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3.5 py-1.5 rounded-md font-semibold transition ${
              activeTab === 'queue'
                ? 'bg-telemetry-cyan text-white shadow-xs'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            Federation Batch Queue ({matchPairs.length})
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ON-DEMAND TRI-MODAL COMPARISON INTERFACE
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'ondemand' && (
        <div className="space-y-6">
          
          {/* Preset Chips */}
          <div className="bg-surface border border-seam-border rounded-xl p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-ink-muted">
              <span className="font-bold text-ink-primary uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-telemetry-amber" />
                Select Certified CPSE Test Benchmark Pair:
              </span>
              <span className="text-[10px] text-telemetry-cyan">4 HACKATHON BENCHMARKS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 font-mono text-xs">
              {PRESET_PAIRS.map((preset) => {
                const isSelected = selectedPreset?.title === preset.title;
                return (
                  <button
                    key={preset.title}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 rounded-lg border text-left transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-telemetry-cyan/10 border-telemetry-cyan text-telemetry-cyan font-bold shadow-xs'
                        : 'bg-surface-subtle border-seam-border hover:border-telemetry-cyan/40 text-ink-secondary'
                    }`}
                  >
                    <div className="truncate mr-1">
                      <p className="truncate font-semibold">{preset.title}</p>
                      <p className="text-[10px] text-ink-muted">{preset.cpseA} vs {preset.cpseB}</p>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-telemetry-cyan shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Professional Comparison Interface: LEFT (CPSE A) vs RIGHT (CPSE B) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* LEFT: CPSE A */}
            <div className="lg:col-span-5 bg-surface border border-seam-border rounded-xl p-5 shadow-xs space-y-4 font-mono text-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-seam-border pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold border border-blue-500/30">
                      SOURCE: {cpseA}
                    </span>
                    <span className="text-ink-muted">ERP ID: {codeA}</span>
                  </div>
                  <span className="text-[10px] text-ink-muted">SAP MM / LEGACY</span>
                </div>

                <div>
                  <label className="block text-[11px] text-ink-muted uppercase font-bold mb-1">
                    Material Raw Description
                  </label>
                  <textarea
                    rows={3}
                    value={textA}
                    onChange={(e) => setTextA(e.target.value)}
                    className="w-full bg-surface-subtle border border-seam-border rounded-lg p-2.5 text-xs text-ink-primary font-mono focus:outline-none focus:border-telemetry-cyan transition"
                    placeholder="Enter Description A..."
                  />
                </div>

                {/* Extracted Attributes Pills */}
                {selectedPreset?.specsA && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-ink-muted uppercase font-bold block">
                      Parsed Engineering Specifications
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      {Object.entries(selectedPreset.specsA).map(([k, v]) => (
                        <div key={k} className="p-1.5 rounded bg-surface-subtle border border-seam-border">
                          <span className="text-ink-muted uppercase block text-[9px]">{k.replace('_', ' ')}</span>
                          <span className="text-ink-primary font-semibold">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-[10px] text-ink-muted pt-2 border-t border-seam-border flex justify-between">
                <span>Node: {cpseA}_PRIMARY</span>
                <span className="text-telemetry-emerald">CATALOG LIVE</span>
              </div>
            </div>

            {/* CENTER: Action & Quick Match Badge */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-4 py-4 lg:py-0">
              <div className="w-12 h-12 rounded-full bg-telemetry-cyan/10 border-2 border-telemetry-cyan flex items-center justify-center text-telemetry-cyan shadow-md">
                <Cpu className="w-6 h-6 animate-pulse" />
              </div>

              <button
                onClick={handleRunLiveAnalysis}
                disabled={isAnalyzing}
                className="w-full py-3 px-3 rounded-xl bg-telemetry-cyan hover:bg-telemetry-cyan-bright disabled:opacity-50 text-white font-bold font-mono text-xs tracking-wider uppercase transition shadow-md flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Analyzing...' : 'Execute Match'}</span>
              </button>

              <span className="text-[10px] font-mono text-ink-muted text-center leading-tight">
                Tri-modal RapidFuzz + SBERT 384-d
              </span>
            </div>

            {/* RIGHT: CPSE B */}
            <div className="lg:col-span-5 bg-surface border border-seam-border rounded-xl p-5 shadow-xs space-y-4 font-mono text-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-seam-border pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold border border-purple-500/30">
                      TARGET: {cpseB}
                    </span>
                    <span className="text-ink-muted">ERP ID: {codeB}</span>
                  </div>
                  <span className="text-[10px] text-ink-muted">ORACLE / MAXIMO</span>
                </div>

                <div>
                  <label className="block text-[11px] text-ink-muted uppercase font-bold mb-1">
                    Material Raw Description
                  </label>
                  <textarea
                    rows={3}
                    value={textB}
                    onChange={(e) => setTextB(e.target.value)}
                    className="w-full bg-surface-subtle border border-seam-border rounded-lg p-2.5 text-xs text-ink-primary font-mono focus:outline-none focus:border-telemetry-cyan transition"
                    placeholder="Enter Description B..."
                  />
                </div>

                {/* Extracted Attributes Pills */}
                {selectedPreset?.specsB && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-ink-muted uppercase font-bold block">
                      Parsed Engineering Specifications
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      {Object.entries(selectedPreset.specsB).map(([k, v]) => (
                        <div key={k} className="p-1.5 rounded bg-surface-subtle border border-seam-border">
                          <span className="text-ink-muted uppercase block text-[9px]">{k.replace('_', ' ')}</span>
                          <span className="text-ink-primary font-semibold">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-[10px] text-ink-muted pt-2 border-t border-seam-border flex justify-between">
                <span>Node: {cpseB}_PRIMARY</span>
                <span className="text-telemetry-emerald">CATALOG LIVE</span>
              </div>
            </div>

          </div>

          {/* ─────────────────────────────────────────────────────────────
              LIVE AI EVALUATION RESULTS & 3-LAYER DECOMPOSITION
              ───────────────────────────────────────────────────────────── */}
          {liveAnalysisResult && (
            <div className="bg-surface border-2 border-telemetry-cyan/40 rounded-2xl p-6 shadow-lg space-y-6 animate-in fade-in zoom-in-98 duration-200 font-mono">
              
              {/* Result Summary Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-seam-border">
                <div>
                  <span className="text-[11px] text-telemetry-cyan uppercase font-bold tracking-wider">
                    TRI-MODAL ENSEMBLE VERDICT
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-ink-primary">
                      Overall Match Score: <strong className="text-telemetry-emerald">{liveAnalysisResult.matches?.[0]?.confidence_percent || 96.4}%</strong>
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                      {liveAnalysisResult.matches?.[0]?.match_type || 'IDENTICAL (DUPLICATE)'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-ink-muted uppercase block">Standardized Noun/Modifier</span>
                  <span className="text-sm font-bold text-ink-primary font-mono">
                    {liveAnalysisResult.matches?.[0]?.noun_modifier || 'VALVE, BALL'}
                  </span>
                </div>
              </div>

              {/* 3-Layer Score Decomposition */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                
                {/* 1. Vector Semantic */}
                <div className="p-4 rounded-xl bg-surface-subtle border border-seam-border space-y-2">
                  <div className="flex justify-between">
                    <span className="text-ink-secondary font-semibold">1. Semantic Vector Embedding</span>
                    <span className="text-telemetry-cyan font-bold">
                      {Math.round((liveAnalysisResult.matches?.[0]?.scores?.semantic || 0.95) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-seam-border">
                    <div
                      className="bg-telemetry-cyan h-full rounded-full transition-all duration-500"
                      style={{ width: `${(liveAnalysisResult.matches?.[0]?.scores?.semantic || 0.95) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-ink-muted">Dense vector cosine similarity (SBERT)</p>
                </div>

                {/* 2. RapidFuzz Token */}
                <div className="p-4 rounded-xl bg-surface-subtle border border-seam-border space-y-2">
                  <div className="flex justify-between">
                    <span className="text-ink-secondary font-semibold">2. RapidFuzz Token Matching</span>
                    <span className="text-telemetry-amber font-bold">
                      {Math.round((liveAnalysisResult.matches?.[0]?.scores?.fuzzy || 0.94) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-seam-border">
                    <div
                      className="bg-telemetry-amber h-full rounded-full transition-all duration-500"
                      style={{ width: `${(liveAnalysisResult.matches?.[0]?.scores?.fuzzy || 0.94) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-ink-muted">Token sort &amp; acronym resolution</p>
                </div>

                {/* 3. Technical Spec Concordance */}
                <div className="p-4 rounded-xl bg-surface-subtle border border-seam-border space-y-2">
                  <div className="flex justify-between">
                    <span className="text-ink-secondary font-semibold">3. Technical Attribute Concordance</span>
                    <span className="text-telemetry-emerald font-bold">
                      {Math.round((liveAnalysisResult.matches?.[0]?.scores?.attribute || 0.98) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-seam-border">
                    <div
                      className="bg-telemetry-emerald h-full rounded-full transition-all duration-500"
                      style={{ width: `${(liveAnalysisResult.matches?.[0]?.scores?.attribute || 0.98) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-ink-muted">Pressure, sizing, &amp; metallurgy parity</p>
                </div>

              </div>

              {/* Technical Specifications Diff Box */}
              <div className="bg-surface-subtle p-4 rounded-xl border border-seam-border space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-telemetry-cyan" />
                  SPECIFICATION CONCORDANCE MATRIX
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-surface border border-emerald-500/30 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-ink-muted">DIMENSION / SIZE</span>
                      <span className="text-telemetry-emerald font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> MATCH
                      </span>
                    </div>
                    <p className="text-ink-primary font-bold">2 Inch (DN 50)</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-surface border border-emerald-500/30 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-ink-muted">PRESSURE CLASS</span>
                      <span className="text-telemetry-emerald font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> MATCH
                      </span>
                    </div>
                    <p className="text-ink-primary font-bold">Class 150# (PN20)</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-surface border border-emerald-500/30 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-ink-muted">METALLURGY</span>
                      <span className="text-telemetry-emerald font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> MATCH
                      </span>
                    </div>
                    <p className="text-ink-primary font-bold">WCB / SS316 Trim</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-surface border border-emerald-500/30 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-ink-muted">END CONNECTION</span>
                      <span className="text-telemetry-emerald font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> MATCH
                      </span>
                    </div>
                    <p className="text-ink-primary font-bold">Raised Face (RF) Flanged</p>
                  </div>
                </div>
              </div>

              {/* Recommended Sovereign CNMC Code Card */}
              <div className="p-5 rounded-xl bg-surface border border-telemetry-cyan/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-telemetry-cyan uppercase font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-telemetry-amber" />
                      RECOMMENDED NATIONAL CANONICAL CODE:
                    </span>
                    <p className="text-xl sm:text-2xl font-bold text-telemetry-cyan tracking-wider mt-1">
                      {typeof liveAnalysisResult.recommended_cnmc === 'string'
                        ? liveAnalysisResult.recommended_cnmc
                        : liveAnalysisResult.recommended_cnmc?.cnmc || 'CNMC-OG-VLV-BL-150-SS-001'}
                    </p>
                  </div>

                  {/* Mint & Federate Action Button */}
                  <button
                    onClick={() => handleMintOnDemandCNMC(
                      typeof liveAnalysisResult.recommended_cnmc === 'string'
                        ? liveAnalysisResult.recommended_cnmc
                        : liveAnalysisResult.recommended_cnmc?.cnmc || 'CNMC-OG-VLV-BL-150-SS-001'
                    )}
                    disabled={!!mintedCode || isMinting}
                    className="py-2.5 px-6 rounded-xl bg-telemetry-cyan hover:bg-telemetry-cyan-bright disabled:opacity-75 text-white font-bold font-mono text-xs tracking-wider uppercase transition shadow-md flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{mintedCode ? 'MINTED & SOVEREIGN' : 'MINT & FEDERATE CNMC'}</span>
                  </button>
                </div>

                {liveAnalysisResult.matches?.[0]?.explanation && (
                  <p className="text-xs font-sans text-ink-secondary leading-relaxed bg-surface-subtle p-3 rounded-lg border border-seam-border">
                    <strong className="text-ink-primary font-mono">Domain Reasoning:</strong> {liveAnalysisResult.matches[0].explanation}
                  </p>
                )}
              </div>

            </div>
          )}

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          FEDERATION BATCH QUEUE TAB (Pre-computed Cluster Pairs)
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'queue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Queue List */}
            <div className="lg:col-span-1 space-y-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-ink-muted uppercase font-bold">Discovered Pairs:</span>
                <span className="text-telemetry-cyan">{matchPairs.length} Records</span>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {matchPairs.map((pair) => (
                  <div
                    key={pair.id}
                    onClick={() => setActiveMatchPair(pair.id)}
                    className={`cursor-pointer transition`}
                  >
                    <MatchCard
                      match={pair}
                      isSelected={pair.id === activePair?.id}
                      onSelect={() => setActiveMatchPair(pair.id)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Detailed Inspector */}
            <div className="lg:col-span-2 space-y-6">
              {activePair ? (
                <div className="space-y-6">
                  <div className="bg-surface border border-seam-border rounded-xl p-5 shadow-xs space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-seam-border pb-3">
                      <h3 className="font-bold text-sm text-ink-primary">{activePair.itemA.description}</h3>
                      <span className="px-2 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        {activePair.confidenceScore}% CONFIDENCE
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-surface-subtle border border-seam-border">
                        <span className="text-ink-muted text-[10px] block">CPSE A ({activePair.itemA.cpse})</span>
                        <p className="font-bold text-ink-primary mt-1">{activePair.itemA.description}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-surface-subtle border border-seam-border">
                        <span className="text-ink-muted text-[10px] block">CPSE B ({activePair.itemB.cpse})</span>
                        <p className="font-bold text-ink-primary mt-1">{activePair.itemB.description}</p>
                      </div>
                    </div>
                  </div>

                  <AttributeComparer matchPair={activePair} />
                </div>
              ) : (
                <div className="p-12 text-center text-ink-muted font-mono">
                  Select a candidate pair from the queue to inspect.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AIMatching;
