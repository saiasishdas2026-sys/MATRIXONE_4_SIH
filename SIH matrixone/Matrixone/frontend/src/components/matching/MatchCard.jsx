import React from 'react';
import { ChevronRight } from 'lucide-react';
import { getConfidenceBadge } from '../../utils/helpers';

export const MatchCard = ({ pair, isActive, onSelect }) => {
  const badge = getConfidenceBadge(pair.confidenceScore);

  return (
    <div 
      onClick={() => onSelect(pair.id)}
      className={`p-3.5 rounded-lg border transition-all cursor-pointer font-mono text-xs ${
        isActive 
          ? 'bg-surface-active border-telemetry-cyan shadow-sm text-ink-primary font-medium' 
          : 'bg-surface border-seam-border hover:border-telemetry-cyan/40 text-ink-secondary hover:text-ink-primary'
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-subtle text-ink-muted border border-seam-border">
            {pair.id}
          </span>
          <span className="text-ink-primary font-semibold truncate max-w-[160px]">
            {pair.materialA.cpseCode} ⟷ {pair.materialB.cpseCode}
          </span>
        </div>

        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${badge.bg} ${badge.color}`}>
          {pair.confidenceScore}%
        </span>
      </div>

      <p className="text-[11px] text-ink-secondary line-clamp-1">
        {pair.canonicalTitle}
      </p>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-seam-border text-[10px] text-ink-muted">
        <span>{pair.cluster.split(' ')[0]}</span>
        <span className="flex items-center text-telemetry-cyan font-semibold">
          <span>Inspect</span>
          <ChevronRight className="w-3 h-3 ml-0.5" />
        </span>
      </div>
    </div>
  );
};
