import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ArrowRightLeft, ChevronDown, ChevronUp } from 'lucide-react';

export const AttributeComparer = ({ pair }) => {
  const [showMatrix, setShowMatrix] = useState(true);

  if (!pair) return null;

  const { materialA, materialB, specComparison } = pair;

  return (
    <div className="p-6 rounded-xl bg-surface border border-seam-border shadow-card space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-seam-border">
        <div className="flex items-center space-x-2">
          <ArrowRightLeft className="w-4 h-4 text-telemetry-cyan" />
          <h4 className="text-sm font-semibold font-mono text-ink-primary tracking-wide">
            CROSS-CPSE ATTRIBUTE COMPARISON &amp; RECONCILIATION
          </h4>
        </div>
        <span className="text-[11px] font-mono text-ink-muted">
          Cluster: <strong className="text-ink-primary">{pair.cluster}</strong>
        </span>
      </div>

      {/* Side-by-Side Material Entity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Material A (e.g. CPCL) */}
        <div className="p-4 rounded-lg bg-surface-subtle border border-seam-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-300 font-bold border border-blue-500/25 text-[11px]">
              {materialA.cpseCode} &bull; {materialA.erpSystem}
            </span>
            <span className="text-ink-muted text-[10px] font-medium">{materialA.plant}</span>
          </div>

          <div>
            <span className="text-[10px] text-ink-muted uppercase block">Legacy ERP Item Code</span>
            <span className="text-ink-primary font-bold text-xs">{materialA.erpCode}</span>
          </div>

          <div>
            <span className="text-[10px] text-ink-muted uppercase block">Raw Ingested ERP Description</span>
            <p className="text-telemetry-cyan font-medium bg-surface p-2.5 rounded border border-seam-border text-[11px] select-all mt-1">
              "{materialA.rawDescription}"
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-seam-border text-[11px]">
            <div>
              <span className="text-ink-muted block text-[10px]">UoM</span>
              <strong className="text-ink-primary">{materialA.uom}</strong>
            </div>
            <div>
              <span className="text-ink-muted block text-[10px]">Unit Price</span>
              <strong className="text-ink-primary">₹{materialA.unitPrice.toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-ink-muted block text-[10px]">Stock Count</span>
              <strong className="text-telemetry-emerald">{materialA.stockOnHand} units</strong>
            </div>
          </div>
        </div>

        {/* Material B (e.g. ONGC) */}
        <div className="p-4 rounded-lg bg-surface-subtle border border-seam-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 font-bold border border-emerald-500/25 text-[11px]">
              {materialB.cpseCode} &bull; {materialB.erpSystem}
            </span>
            <span className="text-ink-muted text-[10px] font-medium">{materialB.plant}</span>
          </div>

          <div>
            <span className="text-[10px] text-ink-muted uppercase block">Legacy ERP Item Code</span>
            <span className="text-ink-primary font-bold text-xs">{materialB.erpCode}</span>
          </div>

          <div>
            <span className="text-[10px] text-ink-muted uppercase block">Raw Ingested ERP Description</span>
            <p className="text-telemetry-emerald font-medium bg-surface p-2.5 rounded border border-seam-border text-[11px] select-all mt-1">
              "{materialB.rawDescription}"
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-seam-border text-[11px]">
            <div>
              <span className="text-ink-muted block text-[10px]">UoM</span>
              <strong className="text-ink-primary">{materialB.uom}</strong>
            </div>
            <div>
              <span className="text-ink-muted block text-[10px]">Unit Price</span>
              <strong className="text-ink-primary">₹{materialB.unitPrice.toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-ink-muted block text-[10px]">Stock Count</span>
              <strong className="text-telemetry-emerald">{materialB.stockOnHand} units</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Spec Reconciliation Table */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2.5">
          <h5 className="text-xs font-mono font-semibold uppercase text-ink-muted tracking-wider">
            TECHNICAL PARAMETER RECONCILIATION MATRIX ({specComparison.length} PARAMETERS):
          </h5>
          <button
            onClick={() => setShowMatrix(!showMatrix)}
            className="text-xs font-mono text-telemetry-cyan hover:underline flex items-center gap-1 font-semibold"
          >
            <span>{showMatrix ? 'Collapse Table' : 'Expand Table'}</span>
            {showMatrix ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showMatrix && (
          <div className="overflow-x-auto rounded-lg border border-seam-border shadow-xs">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-surface-subtle text-ink-secondary text-[11px] border-b border-seam-border">
                  <th className="p-3 font-semibold">Attribute Dimension</th>
                  <th className="p-3 text-telemetry-cyan font-semibold">{materialA.cpseCode} Spec</th>
                  <th className="p-3 text-telemetry-emerald font-semibold">{materialB.cpseCode} Spec</th>
                  <th className="p-3 font-semibold">AI Reconciliation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-seam-border">
                {specComparison.map((spec, idx) => (
                  <tr key={idx} className="hover:bg-surface-subtle transition">
                    <td className="p-3 font-semibold text-ink-primary">{spec.attribute}</td>
                    <td className="p-3 text-ink-secondary">{spec.valA}</td>
                    <td className="p-3 text-ink-secondary">{spec.valB}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] border ${
                        spec.match 
                          ? 'bg-telemetry-emerald/10 text-telemetry-emerald border-telemetry-emerald/25 font-semibold' 
                          : 'bg-telemetry-amber/10 text-telemetry-amber border-telemetry-amber/25 font-medium'
                      }`}>
                        {spec.match ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {spec.note}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
