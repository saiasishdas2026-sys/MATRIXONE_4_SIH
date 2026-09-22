import React from 'react';
import { Zap } from 'lucide-react';
import { MATERIAL_FLOW_STAGES } from '../../mockData/materials';

export const MaterialFlowChart = () => {
  const maxCount = MATERIAL_FLOW_STAGES[0].count;

  return (
    <div className="p-6 rounded-xl bg-surface border border-seam-border shadow-card space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-seam-border">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-telemetry-cyan"></div>
          <div>
            <h4 className="text-sm font-semibold font-mono text-ink-primary tracking-wide">
              AI DE-DUPLICATION TELEMETRY PIPELINE FUNNEL
            </h4>
            <p className="text-xs text-ink-muted mt-0.5">
              End-to-end material record ingestion, fuzzy-vector resolution &amp; canonical CNMC synthesis
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-telemetry-cyan font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>Throughput: 1,850 rec/sec</span>
        </div>
      </div>

      {/* Funnel Rows */}
      <div className="space-y-3 font-mono">
        {MATERIAL_FLOW_STAGES.map((stage, idx) => {
          const widthPercent = Math.max(18, (stage.count / maxCount) * 100);
          const isFinal = idx === MATERIAL_FLOW_STAGES.length - 1;

          return (
            <div key={stage.stage} className="relative group">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-ink-primary font-medium flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-surface-subtle border border-seam-border flex items-center justify-center text-[10px] text-telemetry-cyan font-bold">
                    {idx + 1}
                  </span>
                  {stage.stage}
                </span>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-ink-muted text-[11px]">{stage.rate}</span>
                  <span className="text-ink-primary font-bold">{stage.count.toLocaleString()}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                    idx === 0 
                      ? 'bg-surface-subtle text-ink-muted border-seam-border' 
                      : isFinal 
                      ? 'bg-telemetry-emerald/10 text-telemetry-emerald border-telemetry-emerald/25 font-semibold' 
                      : 'bg-telemetry-amber/10 text-telemetry-amber border-telemetry-amber/25'
                  }`}>
                    {stage.drop}
                  </span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full bg-surface-subtle h-6 rounded border border-seam-border overflow-hidden flex items-center p-0.5">
                <div 
                  className={`h-full rounded transition-all duration-700 flex items-center justify-between px-2 text-[10px] ${
                    isFinal 
                      ? 'bg-telemetry-emerald text-white font-bold' 
                      : 'bg-telemetry-cyan text-white font-mono font-medium'
                  }`}
                  style={{ width: `${widthPercent}%` }}
                >
                  <span className="truncate">{stage.desc}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
