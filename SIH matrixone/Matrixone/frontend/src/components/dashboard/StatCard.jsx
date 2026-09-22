import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const StatCard = ({ title, value, subtitle, change, trend = 'up', icon: Icon, accent = 'cyan' }) => {
  const accentClasses = {
    cyan: {
      border: 'border-seam-border hover:border-telemetry-cyan',
      text: 'text-telemetry-cyan',
      bgIcon: 'bg-telemetry-cyan/10 text-telemetry-cyan',
      pill: 'bg-telemetry-cyan/10 text-telemetry-cyan border-telemetry-cyan/25'
    },
    emerald: {
      border: 'border-seam-border hover:border-telemetry-emerald',
      text: 'text-telemetry-emerald',
      bgIcon: 'bg-telemetry-emerald/10 text-telemetry-emerald',
      pill: 'bg-telemetry-emerald/10 text-telemetry-emerald border-telemetry-emerald/25'
    },
    amber: {
      border: 'border-seam-border hover:border-telemetry-amber',
      text: 'text-telemetry-amber',
      bgIcon: 'bg-telemetry-amber/10 text-telemetry-amber',
      pill: 'bg-telemetry-amber/10 text-telemetry-amber border-telemetry-amber/25'
    }
  }[accent] || {
    border: 'border-seam-border hover:border-telemetry-cyan',
    text: 'text-telemetry-cyan',
    bgIcon: 'bg-telemetry-cyan/10 text-telemetry-cyan',
    pill: 'bg-telemetry-cyan/10 text-telemetry-cyan border-telemetry-cyan/25'
  };

  return (
    <div className={`p-5 rounded-xl bg-surface border ${accentClasses.border} transition-all shadow-card flex flex-col justify-between group`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider font-mono text-ink-muted flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-sm bg-current opacity-75"></span>
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold font-mono text-ink-primary mt-1.5 tracking-tight">
            {value}
          </h3>
        </div>

        {Icon && (
          <div className={`w-9 h-9 rounded-lg ${accentClasses.bgIcon} flex items-center justify-center border border-seam-border shrink-0`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-seam-border flex items-center justify-between text-xs">
        <span className="text-ink-secondary text-[11px] truncate max-w-[180px]">{subtitle}</span>
        {change && (
          <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border flex items-center gap-0.5 ${accentClasses.pill}`}>
            <ArrowUpRight className="w-3 h-3" />
            {change}
          </span>
        )}
      </div>
    </div>
  );
};
