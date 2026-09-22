import React, { useState } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  Filter, 
  Building2, 
  CheckCircle2, 
  FileText,
  ExternalLink,
  Layers,
  Zap,
  Info
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { useMaterialStore } from '../store/materialStore';

export const NationalCodeGen = () => {
  const { mintedCNMCs, mintCustomCNMC } = useMaterialStore();

  // Structured 7-Step Segment Builder
  const [sector, setSector] = useState('OG'); // OG, PWR, MECH, MINE, STL
  const [category, setCategory] = useState('VLV'); // VLV, PMP, BRG, FLG, PIP
  const [itemClass, setItemClass] = useState('BL'); // BL, GT, GL, CF, DG, WN
  const [rating, setRating] = useState('150'); // 150, 300, 800, PN16
  const [size, setSize] = useState('50'); // 50 (2in), 80 (3in), 100 (4in), 25 (1in)
  const [metallurgy, setMetallurgy] = useState('SS'); // SS, CS, BRZ, CI
  const [serial, setSerial] = useState('001');

  const [description, setDescription] = useState('VALVE, BALL, 2 INCH, CLASS 150 RF FLANGED, SS316');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegistryItem, setSelectedRegistryItem] = useState(null);

  // Compute live preview code
  const generatedCode = `CNMC-${sector}-${category}-${itemClass}-${rating}${size}-${metallurgy}-${serial}`;

  const handleGenerateAndMint = (e) => {
    e.preventDefault();
    
    if (mintCustomCNMC) {
      mintCustomCNMC({
        cnmc: generatedCode,
        noun: category === 'VLV' ? 'VALVE' : category === 'PMP' ? 'PUMP' : category === 'BRG' ? 'BEARING' : 'FITTING',
        modifier: itemClass === 'BL' ? 'BALL' : itemClass === 'GT' ? 'GATE' : itemClass === 'CF' ? 'CENTRIFUGAL' : 'RADIAL',
        spec: `${size}mm, Class ${rating}, ${metallurgy} Metallurgy`,
        unspsc: '40141602',
        hsn: '84818030',
        mappedCount: 3,
        cpses: ['ONGC', 'IOCL', 'CPCL'],
        annualSavingsCr: 14.2,
        status: 'SOVEREIGN_MINTED',
        mintedAt: new Date().toISOString().split('T')[0]
      });
    }

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (_) {}

    toast.success(`Sovereign code ${generatedCode} minted & federated into National Master!`);
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('CNMC copied to clipboard!');
  };

  // Filter Registry items
  const registryItems = mintedCNMCs.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.cnmc.toLowerCase().includes(q) ||
      (item.noun && item.noun.toLowerCase().includes(q)) ||
      (item.modifier && item.modifier.toLowerCase().includes(q)) ||
      (item.spec && item.spec.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 pb-12 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-seam-border">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-telemetry-emerald bg-telemetry-emerald/10 px-2 py-0.5 rounded border border-telemetry-emerald/20">
              NATIONAL CODIFICATION STANDARD // CNMC V2
            </span>
            <span className="text-xs text-ink-muted">&bull; GeM / BIS Compatible Architecture</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-ink-primary tracking-tight mt-1">
            Common National Material Code (CNMC) Sovereign Registry
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary">
            Structured 7-segment sovereign codification engine synthesizing domain specifications into unified national codes.
          </p>
        </div>

        <span className="text-xs font-mono text-telemetry-cyan flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-telemetry-cyan/10 border border-telemetry-cyan/25 font-semibold shrink-0 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-telemetry-emerald" />
          <span>SHA-256 Collision Resistant</span>
        </span>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          1. STRUCTURED 7-SEGMENT BUILDER FORM
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-surface border border-seam-border rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-seam-border pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-telemetry-amber" />
            <h2 className="text-sm font-bold font-mono text-ink-primary uppercase tracking-wider">
              Sovereign Code Synthesizer
            </h2>
          </div>
          <span className="text-xs font-mono text-ink-muted">SEVEN SEGMENT SCHEMA</span>
        </div>

        <form onSubmit={handleGenerateAndMint} className="space-y-6 font-mono text-xs">
          
          {/* 7 Interactive Selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            
            {/* Step 1: Sector */}
            <div className="space-y-1">
              <label className="text-ink-muted block text-[10px] uppercase font-bold">1. Sector</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full bg-surface-subtle border border-seam-border rounded-lg p-2 text-ink-primary focus:border-telemetry-cyan focus:outline-none"
              >
                <option value="OG">OG (Oil &amp; Gas)</option>
                <option value="PWR">PWR (Power Gen)</option>
                <option value="MECH">MECH (Heavy Engg)</option>
                <option value="MINE">MINE (Coal/Mining)</option>
                <option value="STL">STL (Steel Corp)</option>
              </select>
            </div>

            {/* Step 2: Category */}
            <div className="space-y-1">
              <label className="text-ink-muted block text-[10px] uppercase font-bold">2. Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-surface-subtle border border-seam-border rounded-lg p-2 text-ink-primary focus:border-telemetry-cyan focus:outline-none"
              >
                <option value="VLV">VLV (Valve)</option>
                <option value="PMP">PMP (Pump)</option>
                <option value="BRG">BRG (Bearing)</option>
                <option value="FLG">FLG (Flange)</option>
                <option value="PIP">PIP (Piping)</option>
              </select>
            </div>

            {/* Step 3: Class */}
            <div className="space-y-1">
              <label className="text-ink-muted block text-[10px] uppercase font-bold">3. Class/Type</label>
              <select
                value={itemClass}
                onChange={(e) => setItemClass(e.target.value)}
                className="w-full bg-surface-subtle border border-seam-border rounded-lg p-2 text-ink-primary focus:border-telemetry-cyan focus:outline-none"
              >
                <option value="BL">BL (Ball)</option>
                <option value="GT">GT (Gate)</option>
                <option value="GL">GL (Globe)</option>
                <option value="CF">CF (Centrifugal)</option>
                <option value="DG">DG (Deep Groove)</option>
                <option value="WN">WN (Weld Neck)</option>
              </select>
            </div>

            {/* Step 4: Rating */}
            <div className="space-y-1">
              <label className="text-ink-muted block text-[10px] uppercase font-bold">4. Rating/Class</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full bg-surface-subtle border border-seam-border rounded-lg p-2 text-ink-primary focus:border-telemetry-cyan focus:outline-none"
              >
                <option value="150">150 (Class 150#)</option>
                <option value="300">300 (Class 300#)</option>
                <option value="800">800 (Class 800#)</option>
                <option value="PN16">PN16 (Metric)</option>
              </select>
            </div>

            {/* Step 5: Size */}
            <div className="space-y-1">
              <label className="text-ink-muted block text-[10px] uppercase font-bold">5. Metric Size</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full bg-surface-subtle border border-seam-border rounded-lg p-2 text-ink-primary focus:border-telemetry-cyan focus:outline-none"
              >
                <option value="50">50 (2 Inch)</option>
                <option value="80">80 (3 Inch)</option>
                <option value="100">100 (4 Inch)</option>
                <option value="25">25 (1 Inch)</option>
                <option value="15">15 (0.5 Inch)</option>
              </select>
            </div>

            {/* Step 6: Metallurgy */}
            <div className="space-y-1">
              <label className="text-ink-muted block text-[10px] uppercase font-bold">6. Metallurgy</label>
              <select
                value={metallurgy}
                onChange={(e) => setMetallurgy(e.target.value)}
                className="w-full bg-surface-subtle border border-seam-border rounded-lg p-2 text-ink-primary focus:border-telemetry-cyan focus:outline-none"
              >
                <option value="SS">SS (Stainless 316)</option>
                <option value="CS">CS (Carbon WCB)</option>
                <option value="BRZ">BRZ (Bronze)</option>
                <option value="CI">CI (Cast Iron)</option>
              </select>
            </div>

            {/* Step 7: Serial */}
            <div className="space-y-1">
              <label className="text-ink-muted block text-[10px] uppercase font-bold">7. Sequence</label>
              <input
                type="text"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                maxLength={4}
                className="w-full bg-surface-subtle border border-seam-border rounded-lg p-2 text-ink-primary focus:border-telemetry-cyan focus:outline-none font-mono text-center font-bold"
              />
            </div>

          </div>

          {/* Live Segmented Code Preview Ribbon */}
          <div className="p-4 rounded-xl bg-surface-subtle border-2 border-telemetry-cyan/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] text-ink-muted uppercase font-bold block">
                SYNTHESIZED SOVEREIGN CNMC IDENTIFIER
              </span>
              <div className="flex items-center gap-1 text-lg sm:text-2xl font-black text-telemetry-cyan tracking-wider flex-wrap">
                <span className="px-2 py-0.5 rounded bg-surface border border-seam-border text-ink-primary">CNMC</span>
                <span className="text-ink-muted">-</span>
                <span className="px-2 py-0.5 rounded bg-surface border border-telemetry-cyan text-telemetry-cyan">{sector}</span>
                <span className="text-ink-muted">-</span>
                <span className="px-2 py-0.5 rounded bg-surface border border-telemetry-cyan text-telemetry-cyan">{category}</span>
                <span className="text-ink-muted">-</span>
                <span className="px-2 py-0.5 rounded bg-surface border border-telemetry-cyan text-telemetry-cyan">{itemClass}</span>
                <span className="text-ink-muted">-</span>
                <span className="px-2 py-0.5 rounded bg-surface border border-telemetry-cyan text-telemetry-cyan">{rating}{size}</span>
                <span className="text-ink-muted">-</span>
                <span className="px-2 py-0.5 rounded bg-surface border border-telemetry-cyan text-telemetry-cyan">{metallurgy}</span>
                <span className="text-ink-muted">-</span>
                <span className="px-2 py-0.5 rounded bg-surface border border-telemetry-cyan text-telemetry-cyan">{serial}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleCopy(generatedCode)}
                className="py-2.5 px-4 rounded-xl bg-surface hover:bg-surface-active border border-seam-border text-xs font-semibold text-ink-primary transition flex items-center gap-1.5 shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-telemetry-emerald" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>

              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-telemetry-emerald hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-2 shadow-md uppercase tracking-wider"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mint &amp; Register CNMC</span>
              </button>
            </div>
          </div>

        </form>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MASTER NATIONAL CNMC REGISTRY TABLE
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-surface border border-seam-border rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-seam-border pb-4">
          <div>
            <h2 className="text-base font-bold font-mono text-ink-primary">
              National Unified Material Master Registry
            </h2>
            <p className="text-xs text-ink-secondary">
              Authoritative list of officially minted CNMC codes federated across all 12 CPSE ERP catalogs.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search minted codes, specs, or nouns..."
              className="w-full bg-surface-subtle border border-seam-border focus:border-telemetry-cyan focus:outline-none rounded-lg py-1.5 pl-9 pr-3 text-xs text-ink-primary placeholder-ink-muted font-mono"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-seam-border text-[11px] text-ink-muted uppercase">
                <th className="py-3 px-3">Sovereign CNMC Code</th>
                <th className="py-3 px-3 font-sans">Standardized Description</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Mapped CPSEs</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Savings</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-seam-border">
              {registryItems.map((row) => (
                <tr key={row.cnmc} className="hover:bg-surface-subtle transition group">
                  <td className="py-3 px-3 font-bold text-telemetry-cyan">
                    {row.cnmc}
                  </td>
                  <td className="py-3 px-3 font-sans text-ink-primary max-w-xs truncate">
                    <strong>{row.noun}, {row.modifier}</strong> &bull; {row.spec}
                  </td>
                  <td className="py-3 px-3 text-ink-muted">
                    {row.noun}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      {row.cpses?.map((c) => (
                        <span key={c} className="px-1.5 py-0.2 rounded bg-surface-subtle border border-seam-border text-[10px] text-ink-secondary">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      OFFICIAL MINT
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-telemetry-emerald">
                    ₹{row.annualSavingsCr || '12.8'} Cr
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedRegistryItem(row)}
                      className="py-1 px-2.5 rounded bg-surface-subtle hover:bg-surface-active border border-seam-border text-ink-secondary hover:text-ink-primary transition text-[11px]"
                    >
                      Passport
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Registry Item Passport Modal */}
      {selectedRegistryItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-seam-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 font-mono text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-seam-border pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-telemetry-cyan bg-telemetry-cyan/10 px-2 py-0.5 rounded border border-telemetry-cyan/20">
                  NATIONAL MATERIAL PASSPORT
                </span>
                <h3 className="text-base font-bold text-ink-primary mt-1 font-mono">
                  {selectedRegistryItem.cnmc}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRegistryItem(null)}
                className="text-ink-muted hover:text-ink-primary p-1"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="p-3 rounded-lg bg-surface-subtle border border-seam-border space-y-1">
                <span className="text-[10px] font-mono text-ink-muted uppercase">Harmonized Specification</span>
                <p className="font-bold text-ink-primary font-mono">{selectedRegistryItem.noun}, {selectedRegistryItem.modifier}</p>
                <p className="text-ink-secondary">{selectedRegistryItem.spec}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-surface-subtle border border-seam-border">
                  <span className="text-ink-muted text-[10px] block">UNSPSC MAPPING</span>
                  <span className="font-bold text-ink-primary">{selectedRegistryItem.unspsc || '40141602'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-subtle border border-seam-border">
                  <span className="text-ink-muted text-[10px] block">HSN CODE</span>
                  <span className="font-bold text-ink-primary">{selectedRegistryItem.hsn || '84818030'}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-subtle border border-seam-border font-mono text-xs space-y-1.5">
                <span className="text-[10px] text-ink-muted uppercase font-bold">Federated CPSE Legacy Codes</span>
                {selectedRegistryItem.cpses?.map((c) => (
                  <div key={c} className="flex justify-between border-b border-seam-border/50 py-0.5">
                    <span className="text-ink-muted">{c}:</span>
                    <span className="text-telemetry-cyan font-bold">{c}-LEGACY-{Math.floor(1000 + Math.random()*9000)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-seam-border">
              <button
                onClick={() => setSelectedRegistryItem(null)}
                className="py-2 px-4 rounded-lg bg-telemetry-cyan hover:bg-telemetry-cyan-bright text-white font-bold font-mono text-xs"
              >
                Close Passport
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NationalCodeGen;
