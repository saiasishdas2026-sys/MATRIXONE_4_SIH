import React from 'react';
import { ArrowRightLeft, Truck } from 'lucide-react';

export const InventoryOptimizer = () => {
  const transferOpportunities = [
    {
      item: 'Centrifugal Pump Impeller Monel 400 (450mm)',
      fromCPSE: 'IOCL (Paradip)',
      surplusQty: 32,
      toCPSE: 'GAIL (Vijaipur)',
      deficitQty: 18,
      unitCost: 142000,
      savingsCr: 0.25,
      status: 'READY_FOR_RE_ROUTE'
    },
    {
      item: 'Gate Valve SS316 DN50 Class 800 RF',
      fromCPSE: 'ONGC (Mumbai High)',
      surplusQty: 420,
      toCPSE: 'CPCL (Manali)',
      deficitQty: 240,
      unitCost: 18400,
      savingsCr: 0.44,
      status: 'READY_FOR_RE_ROUTE'
    },
    {
      item: 'Seamless CS Pipe ASTM A106 Gr B 6" SCH 40',
      fromCPSE: 'SAIL (Bhilai)',
      surplusQty: 3800,
      toCPSE: 'BHEL (Trichy)',
      deficitQty: 2100,
      unitCost: 4200,
      savingsCr: 0.88,
      status: 'IN_TRANSIT'
    }
  ];

  return (
    <div className="p-6 rounded-xl bg-surface border border-seam-border shadow-card space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-seam-border">
        <div className="flex items-center space-x-2.5">
          <Truck className="w-4 h-4 text-telemetry-emerald" />
          <h4 className="text-sm font-semibold text-ink-primary tracking-wide">
            CROSS-CPSE SURPLUS INVENTORY RE-ROUTING RADAR
          </h4>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-telemetry-emerald/10 text-telemetry-emerald border border-telemetry-emerald/25 font-semibold">
          3 ACTIVE SURPLUS CHANNELS
        </span>
      </div>

      <div className="space-y-3">
        {transferOpportunities.map((op, idx) => (
          <div key={idx} className="p-4 rounded-lg bg-surface-subtle border border-seam-border space-y-2.5 transition hover:border-telemetry-cyan/30">
            <div className="flex items-center justify-between">
              <span className="text-ink-primary font-semibold">{op.item}</span>
              <span className="text-telemetry-emerald font-bold">Save ₹{(op.savingsCr * 100).toFixed(0)} Lakhs</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-ink-secondary bg-surface p-2.5 rounded-md border border-seam-border gap-2">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="px-2 py-0.5 rounded bg-telemetry-cyan/10 text-telemetry-cyan border border-telemetry-cyan/25 font-medium text-[11px]">
                  SURPLUS: {op.fromCPSE} ({op.surplusQty} units)
                </span>
                <ArrowRightLeft className="w-3.5 h-3.5 text-ink-muted shrink-0" />
                <span className="px-2 py-0.5 rounded bg-telemetry-amber/10 text-telemetry-amber border border-telemetry-amber/25 font-medium text-[11px]">
                  DEFICIT: {op.toCPSE} (Req: {op.deficitQty})
                </span>
              </div>

              <span className="text-telemetry-cyan font-bold text-[11px] self-end sm:self-auto">{op.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
