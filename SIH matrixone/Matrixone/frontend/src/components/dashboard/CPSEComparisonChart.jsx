import React, { useState } from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { PROCUREMENT_DISPARITIES } from '../../mockData/materials';

export const CPSEComparisonChart = () => {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const activeItem = PROCUREMENT_DISPARITIES[activeItemIndex];

  return (
    <div className="p-6 rounded-xl bg-surface border border-seam-border shadow-card space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-seam-border gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-telemetry-amber"></div>
          <div>
            <h4 className="text-sm font-semibold font-mono text-ink-primary tracking-wide">
              CROSS-CPSE PROCUREMENT RATE DISPARITY AUDIT
            </h4>
            <p className="text-xs text-ink-muted mt-0.5">
              Unit price divergence across CPSEs for functionally identical technical specifications
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {PROCUREMENT_DISPARITIES.map((item, idx) => (
            <button
              key={item.category}
              onClick={() => setActiveItemIndex(idx)}
              className={`px-3 py-1 rounded text-xs font-mono transition ${
                activeItemIndex === idx
                  ? 'bg-telemetry-cyan text-white font-bold shadow-xs'
                  : 'bg-surface-subtle text-ink-secondary hover:text-ink-primary border border-seam-border'
              }`}
            >
              {item.category}
            </button>
          ))}
        </div>
      </div>

      {/* Active Item Overview */}
      <div className="p-4 rounded-lg bg-surface-subtle border border-seam-border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono">
        <div>
          <span className="text-[10px] text-telemetry-cyan font-bold uppercase block tracking-wider">
            SELECTED SPECIFICATION AUDIT:
          </span>
          <h5 className="text-ink-primary font-semibold text-sm mt-0.5">{activeItem.itemTitle}</h5>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="text-[10px] text-ink-muted block uppercase">Max Variance</span>
            <span className="text-sm font-bold text-telemetry-amber">+{activeItem.maxVariancePercent}%</span>
          </div>
          <div className="text-right pl-4 border-l border-seam-border">
            <span className="text-[10px] text-ink-muted block uppercase">Consolidated Savings</span>
            <span className="text-sm font-bold text-telemetry-emerald">₹{activeItem.potentialSavingsCr} Cr</span>
          </div>
        </div>
      </div>

      {/* Disparity Bar Graph */}
      <div className="space-y-3 font-mono">
        {activeItem.disparities.map((disp) => {
          const maxPrice = Math.max(...activeItem.disparities.map(d => d.price));
          const percentage = (disp.price / maxPrice) * 100;
          const isLowest = disp.price === activeItem.benchmarkPrice;

          return (
            <div key={disp.cpse} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-ink-primary flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-surface text-[10px] text-telemetry-cyan border border-seam-border font-bold">
                    {disp.cpse}
                  </span>
                  <span>Annual Demand: {disp.qty.toLocaleString()} units</span>
                </span>

                <div className="flex items-center space-x-2">
                  {isLowest && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-telemetry-emerald/10 text-telemetry-emerald border border-telemetry-emerald/25 font-semibold">
                      BENCHMARK RATE
                    </span>
                  )}
                  <span className="text-ink-primary font-bold">₹{disp.price.toLocaleString()}/unit</span>
                  <span className="text-ink-muted text-[11px]">(Spend: ₹{(disp.totalSpend / 10000000).toFixed(1)} Cr)</span>
                </div>
              </div>

              {/* Bar */}
              <div className="w-full bg-surface-subtle h-6 rounded overflow-hidden flex items-center p-0.5 border border-seam-border">
                <div 
                  className={`h-full rounded transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-bold ${
                    isLowest 
                      ? 'bg-telemetry-emerald text-white' 
                      : 'bg-telemetry-amber text-white'
                  }`}
                  style={{ width: `${Math.max(15, percentage)}%` }}
                >
                  {isLowest ? 'Lowest CPSE Unit Rate' : `+${(((disp.price - activeItem.benchmarkPrice) / activeItem.benchmarkPrice) * 100).toFixed(1)}%`}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-seam-border flex items-center justify-between text-xs font-mono">
        <span className="text-ink-muted flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-telemetry-amber" />
          <span>Unified GeM Bulk Procurement Tender recommended for this cluster</span>
        </span>

        <a 
          href="/analytics" 
          className="flex items-center space-x-1 text-telemetry-cyan hover:underline font-semibold"
        >
          <span>Open Savings Simulator</span>
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
