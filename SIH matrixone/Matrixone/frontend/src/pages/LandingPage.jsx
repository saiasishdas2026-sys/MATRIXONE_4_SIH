import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  Database, 
  FileCode2, 
  Server, 
  Sparkles, 
  Radio, 
  Building2, 
  CheckSquare, 
  History, 
  Zap, 
  Bot, 
  Search,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Lock,
  Activity
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  const cpseNodes = [
    { name: 'ONGC', sector: 'Upstream Oil & Gas', x: 70, y: 70, color: '#f59e0b', code: 'VLV-BL-150-SS-002', desc: 'VALVE, BALL, 2IN, CL150, FLG' },
    { name: 'IOCL', sector: 'Refining & Marketing', x: 430, y: 70, color: '#3b82f6', code: '312-99-VAL-B-150', desc: 'SS-316 BALL VALVE 2" 150# RF' },
    { name: 'GAIL', sector: 'Gas Transmission', x: 450, y: 350, color: '#10b981', code: 'G-VALVE-BL-50MM', desc: '2 INCH 150# BALL VALVE SS' },
    { name: 'BHEL', sector: 'Heavy Engineering', x: 50, y: 350, color: '#8b5cf6', code: 'BHEL-M-99412', desc: 'VALVE BALL DN50 CL150 WCB/316' },
    { name: 'NTPC', sector: 'Thermal Power', x: 250, y: 30, color: '#ec4899', code: 'NTPC-GEN-V-02', desc: 'BALL VALVE 2" CLASS 150 FLANGED' },
    { name: 'CIL', sector: 'Coal Mining', x: 250, y: 390, color: '#64748b', code: 'CIL-MINE-VLV-50', desc: 'VALVE BALL 50MM 150 LBS RF' },
  ];

  const workflowSteps = [
    {
      num: '01',
      title: 'INGEST',
      subtitle: 'CPSE Material Data',
      desc: 'Seamlessly ingest siloed catalogs from SAP MM, Oracle EBS, and legacy ERP dumps with automatic schema normalization.',
      icon: Database,
      tag: 'Multi-CPSE ERP'
    },
    {
      num: '02',
      title: 'UNDERSTAND',
      subtitle: 'AI Specification Extraction',
      desc: 'Deep extraction of nouns, modifiers, metallurgy grades (SS316, WCB), pressure classes (150#, 300#), and metric dimensions.',
      icon: BrainCircuitIcon,
      tag: 'NLP Entity Parser'
    },
    {
      num: '03',
      title: 'MATCH',
      subtitle: 'Tri-Modal AI Engine',
      desc: 'Simultaneous 3-layer scoring: RapidFuzz lexical matching + SBERT semantic embeddings + regex technical spec concordance.',
      icon: Cpu,
      tag: 'Tri-Modal Scoring'
    },
    {
      num: '04',
      title: 'REVIEW',
      subtitle: 'Human-in-the-Loop Governance',
      desc: 'Borderline matches (70-90% confidence) routed to certified CPSE engineering officers with visual spec diff comparison.',
      icon: CheckSquare,
      tag: 'HITL Verification'
    },
    {
      num: '05',
      title: 'STANDARDIZE',
      subtitle: 'Generate Sovereign CNMC',
      desc: 'Mint a structured Central National Material Code (CNMC) encoding Sector, Class, Rating, Metallurgy, and Serial.',
      icon: FileCode2,
      tag: 'CNMC Minting'
    },
    {
      num: '06',
      title: 'FEDERATE',
      subtitle: 'National Material Master',
      desc: 'Publish verified mapping to the Bharat Sovereign Mesh for cross-CPSE virtual inventory pooling and unified rate contracts.',
      icon: Server,
      tag: 'National Mesh'
    }
  ];

  function BrainCircuitIcon(props) {
    return <Sparkles {...props} />;
  }

  return (
    <div className="space-y-16 pb-16 font-sans">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (Split Layout)
          ───────────────────────────────────────────────────────────── */}
      <section className="pt-6 sm:pt-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT: Core Narrative & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-telemetry-cyan/10 text-telemetry-cyan border border-telemetry-cyan/25 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-telemetry-cyan animate-pulse"></span>
              <span>NATIONAL MATERIAL INTELLIGENCE PLATFORM</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-ink-primary font-mono leading-[1.05]">
                ONE NATION<br />
                <span className="text-telemetry-cyan">ONE MATERIAL</span><br />
                CODE.
              </h1>
            </div>

            <p className="text-sm sm:text-base text-ink-secondary leading-relaxed max-w-xl">
              AI-driven standardization, harmonization, and intelligent matching of material masters across India's CPSE ecosystem. Eliminating duplicate inventories and unlocking hundreds of crores in frozen working capital.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="py-3 px-6 rounded-xl bg-telemetry-cyan hover:bg-telemetry-cyan-bright text-white font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 shadow-lg shadow-telemetry-cyan/20 transition group font-mono"
              >
                <span>{isAuthenticated ? "ENTER COMMAND CENTER" : "ENTER MATRIXONE"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>

              <a
                href="#workflow"
                className="py-3 px-5 rounded-xl bg-surface border border-seam-border hover:bg-surface-subtle text-xs sm:text-sm font-semibold text-ink-primary transition flex items-center gap-2 font-mono shadow-xs"
              >
                <span>EXPLORE HOW IT WORKS</span>
                <ChevronRight className="w-4 h-4 text-ink-muted" />
              </a>
            </div>

            {/* Micro Pillars */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-seam-border text-left font-mono">
              <div>
                <p className="text-lg sm:text-xl font-bold text-ink-primary">1.25M+</p>
                <p className="text-[10px] text-ink-muted uppercase">Harmonized Specs</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-telemetry-emerald">24.7%</p>
                <p className="text-[10px] text-ink-muted uppercase">Duplicate Rate</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-telemetry-cyan">₹4,820 Cr</p>
                <p className="text-[10px] text-ink-muted uppercase">Savings Modeled</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Material Intelligence Network SVG Visualization */}
          <div className="lg:col-span-6">
            <div className="bg-surface border border-seam-border rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
              
              {/* Header inside visualization */}
              <div className="flex items-center justify-between border-b border-seam-border pb-3 mb-2 font-mono text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-telemetry-emerald animate-ping"></span>
                  <span className="font-bold text-ink-primary">BHARAT CPSE FEDERATION TOPOLOGY</span>
                </div>
                <span className="text-ink-muted">AI CLUSTER ENGINE ACTIVE</span>
              </div>

              {/* Interactive SVG Diagram */}
              <div className="relative w-full aspect-square max-w-[480px] mx-auto flex items-center justify-center">
                <svg viewBox="0 0 500 460" className="w-full h-full">
                  <defs>
                    {/* Glowing Filter */}
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    {/* Linear Gradients for Connector Lines */}
                    <linearGradient id="flowLine" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>

                  {/* Concentric Radar Rings */}
                  <circle cx="250" cy="220" r="180" fill="none" stroke="currentColor" strokeOpacity="0.07" strokeDasharray="4,4" />
                  <circle cx="250" cy="220" r="120" fill="none" stroke="currentColor" strokeOpacity="0.1" />
                  <circle cx="250" cy="220" r="60" fill="none" stroke="currentColor" strokeOpacity="0.15" />

                  {/* Data Flow Lines from CPSE Nodes to Center */}
                  {cpseNodes.map((node, i) => (
                    <g key={`line-${node.name}`}>
                      <line
                        x1={node.x}
                        y1={node.y}
                        x2="250"
                        y2="220"
                        stroke={node.color}
                        strokeWidth="1.5"
                        strokeOpacity="0.4"
                        strokeDasharray="6,4"
                      />
                      {/* Animated Pulse Particle */}
                      <circle cx="250" cy="220" r="3" fill={node.color}>
                        <animate
                          attributeName="cx"
                          values={`${node.x};250`}
                          dur={`${2.5 + i * 0.4}s`}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="cy"
                          values={`${node.y};220`}
                          dur={`${2.5 + i * 0.4}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  ))}

                  {/* Center Node: MATRIXONE Tri-Modal AI Engine */}
                  <g transform="translate(250, 220)">
                    <circle r="44" fill="#0f172a" stroke="#06b6d4" strokeWidth="2.5" filter="url(#glow)" />
                    <circle r="36" fill="#0284c7" fillOpacity="0.2" />
                    <text textAnchor="middle" y="-6" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">
                      MATRIXONE
                    </text>
                    <text textAnchor="middle" y="8" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace">
                      AI ENGINE
                    </text>
                    <text textAnchor="middle" y="20" fill="#94a3b8" fontSize="7" fontFamily="monospace">
                      TRI-MODAL
                    </text>
                  </g>

                  {/* Outer CPSE Nodes */}
                  {cpseNodes.map((node) => (
                    <g key={`node-${node.name}`} transform={`translate(${node.x}, ${node.y})`}>
                      <circle r="24" fill="#1e293b" stroke={node.color} strokeWidth="2" />
                      <circle r="4" cy="-12" fill={node.color} />
                      <text textAnchor="middle" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">
                        {node.name}
                      </text>
                      <text textAnchor="middle" y="35" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                        {node.sector.split(' ')[0]}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              {/* Data Flow Indicator Ribbon */}
              <div className="mt-3 p-2.5 rounded-lg bg-surface-subtle border border-seam-border flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-ink-muted">DATA FLOW:</span>
                  <span className="text-ink-primary font-bold">CPSE ERP</span>
                  <span className="text-ink-muted">&rarr;</span>
                  <span className="text-telemetry-cyan font-bold">AI EXTRACTION</span>
                  <span className="text-ink-muted">&rarr;</span>
                  <span className="text-telemetry-emerald font-bold">CNMC MASTER</span>
                </div>
                <span className="text-telemetry-emerald font-semibold hidden sm:inline">100% AUTOMATED</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. LIVE SYSTEM STRIP (Clearly Labeled Demo/Simulated)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-surface border border-seam-border rounded-xl p-4 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-telemetry-emerald/10 text-telemetry-emerald font-mono text-xs font-bold border border-telemetry-emerald/20">
                <span className="w-2 h-2 rounded-full bg-telemetry-emerald animate-pulse"></span>
                <span>MATRIXONE NETWORK // OPERATIONAL</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">
                DEMO / SIMULATED DATA
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
              <div className="border-l border-seam-border pl-3">
                <p className="text-ink-muted text-[10px]">MATERIAL RECORDS</p>
                <p className="font-bold text-ink-primary">1,248,840</p>
              </div>
              <div className="border-l border-seam-border pl-3">
                <p className="text-ink-muted text-[10px]">AI MATCH ACCURACY</p>
                <p className="font-bold text-telemetry-emerald">98.4%</p>
              </div>
              <div className="border-l border-seam-border pl-3">
                <p className="text-ink-muted text-[10px]">HARMONIZED CODES</p>
                <p className="font-bold text-telemetry-cyan">186,431</p>
              </div>
              <div className="border-l border-seam-border pl-3">
                <p className="text-ink-muted text-[10px]">CPSE NODES ACTIVE</p>
                <p className="font-bold text-ink-primary">12 OF 12</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. CORE WORKFLOW: 01 INGEST → 06 FEDERATE (Connected Steps)
          ───────────────────────────────────────────────────────────── */}
      <section id="workflow" className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-telemetry-cyan bg-telemetry-cyan/10 px-2.5 py-0.5 rounded border border-telemetry-cyan/20">
            SOVEREIGN PROCESSING LIFECYCLE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink-primary">
            Connected 6-Step National Harmonization
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary">
            From raw, un-standardized legacy ERP entries to officially minted sovereign material codes.
          </p>
        </div>

        {/* The 6 Connected Workflow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            const isHovered = activeWorkflowStep === idx;

            return (
              <div
                key={step.num}
                onMouseEnter={() => setActiveWorkflowStep(idx)}
                className={`bg-surface border rounded-xl p-5 transition duration-200 flex flex-col justify-between shadow-xs relative group ${
                  isHovered ? 'border-telemetry-cyan shadow-md' : 'border-seam-border hover:border-telemetry-cyan/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black font-mono text-ink-muted/50 group-hover:text-telemetry-cyan transition">
                      {step.num}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-surface-subtle border border-seam-border text-ink-secondary">
                      {step.tag}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-subtle border border-seam-border flex items-center justify-center text-telemetry-cyan shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-ink-primary">{step.title}</h3>
                      <p className="text-[11px] text-ink-muted font-mono">{step.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-xs text-ink-secondary leading-relaxed mt-2">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-seam-border flex items-center justify-between text-[11px] font-mono text-ink-muted">
                  <span>STAGE {step.num}/06</span>
                  <span className="text-telemetry-cyan flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                    VERIFIED &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. PROBLEM → SOLUTION VISUAL COMPARISON
          ───────────────────────────────────────────────────────────── */}
      <section id="problem" className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <div className="bg-surface border border-seam-border rounded-2xl p-6 sm:p-10 shadow-sm space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
              NATIONAL PROBLEM VS SOVEREIGN RESOLUTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink-primary">
              The Cost of Fragmented CPSE Catalogs
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary">
              Identical industrial spare parts are purchased under different nomenclature, creating redundant inventory silos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* BEFORE: Fragmented Silos */}
            <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-red-500/20 pb-3 mb-4">
                  <span className="text-xs font-mono font-bold text-red-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    BEFORE MATRIXONE // SILOED FRAGMENTATION
                  </span>
                  <span className="text-[10px] font-mono text-ink-muted">3 SEPARATE TENDERS</span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-surface border border-seam-border space-y-1">
                    <div className="flex justify-between text-ink-muted">
                      <span className="font-bold text-ink-primary">ONGC (SAP MM)</span>
                      <span>Code: VLV-BL-150-SS-002</span>
                    </div>
                    <p className="text-ink-secondary font-sans text-xs">"VALVE, BALL, 2IN, CL150, FLG, SS316"</p>
                    <p className="text-[10px] text-red-500 font-bold">Unit Price: ₹14,800 &bull; Stock: 120 Units</p>
                  </div>

                  <div className="p-3 rounded-lg bg-surface border border-seam-border space-y-1">
                    <div className="flex justify-between text-ink-muted">
                      <span className="font-bold text-ink-primary">IOCL (Oracle ERP)</span>
                      <span>Code: 312-99-VAL-B-150</span>
                    </div>
                    <p className="text-ink-secondary font-sans text-xs">"SS-316 BALL VALVE 2" 150# RF FLANGED"</p>
                    <p className="text-[10px] text-red-500 font-bold">Unit Price: ₹16,200 &bull; Stock: 85 Units</p>
                  </div>

                  <div className="p-3 rounded-lg bg-surface border border-seam-border space-y-1">
                    <div className="flex justify-between text-ink-muted">
                      <span className="font-bold text-ink-primary">GAIL (Maximo)</span>
                      <span>Code: G-VALVE-BL-50MM</span>
                    </div>
                    <p className="text-ink-secondary font-sans text-xs">"2 INCH 150# BALL VALVE SS BODY LEVER"</p>
                    <p className="text-[10px] text-red-500 font-bold">Unit Price: ₹13,900 &bull; Stock: 60 Units</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-xs font-mono flex items-center gap-2">
                <TrendingDown className="w-4 h-4 shrink-0" />
                <span>Impact: ₹42.8 Cr in dead inventory &bull; Delayed emergency procurement</span>
              </div>
            </div>

            {/* AFTER: Harmonized via MATRIXONE */}
            <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3 mb-4">
                  <span className="text-xs font-mono font-bold text-telemetry-emerald flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    AFTER MATRIXONE // SOVEREIGN HARMONIZATION
                  </span>
                  <span className="text-[10px] font-mono text-telemetry-cyan font-bold">AI MATCH: 96.4%</span>
                </div>

                {/* Central Sovereign Code */}
                <div className="p-4 rounded-xl bg-surface border-2 border-telemetry-emerald/40 space-y-2 mb-4 font-mono">
                  <span className="text-[10px] uppercase font-bold text-telemetry-emerald">
                    NATIONAL UNIFIED CODE (CNMC)
                  </span>
                  <p className="text-lg font-bold text-ink-primary tracking-wider">
                    CNMC-OG-VLV-BL-150-SS-001
                  </p>
                  <p className="text-xs font-sans text-ink-secondary">
                    Standardized Noun/Modifier: <strong>VALVE, BALL</strong> &bull; 2" Class 150 RF Flanged SS316
                  </p>
                </div>

                {/* Federated CPSE Cross-Mapping */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface border border-seam-border">
                    <span className="text-ink-muted">ONGC VLV-BL-150-SS-002</span>
                    <span className="text-telemetry-emerald font-bold">&rarr; MAPPED TO CNMC</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface border border-seam-border">
                    <span className="text-ink-muted">IOCL 312-99-VAL-B-150</span>
                    <span className="text-telemetry-emerald font-bold">&rarr; MAPPED TO CNMC</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface border border-seam-border">
                    <span className="text-ink-muted">GAIL G-VALVE-BL-50MM</span>
                    <span className="text-telemetry-emerald font-bold">&rarr; MAPPED TO CNMC</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 text-telemetry-emerald text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Result: Virtual Pool of 265 Units &bull; Unified GeM Rate Contract @ ₹13,900</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. FAST DEMO LAUNCH BAR FOR JUDGES
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-surface-subtle border border-seam-border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-bold text-ink-primary font-mono">
              Ready to explore the MATRIXONE Command Center?
            </h3>
            <p className="text-xs sm:text-sm text-ink-secondary">
              Experience the live Tri-Modal AI Matching Studio, National Sovereign Code Minting, and Audit Trail.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/matching"
              className="py-2.5 px-4 rounded-xl bg-surface border border-seam-border hover:border-telemetry-cyan text-xs font-semibold text-ink-primary transition flex items-center gap-1.5 font-mono shadow-xs"
            >
              <Cpu className="w-3.5 h-3.5 text-telemetry-cyan" />
              <span>AI Match Studio</span>
            </Link>

            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              className="py-2.5 px-5 rounded-xl bg-telemetry-cyan hover:bg-telemetry-cyan-bright text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition shadow-sm"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
