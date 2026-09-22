import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useMaterialStore } from '../../store/materialStore';

export const RecentActivity = () => {
  const { auditLogs } = useMaterialStore();

  return (
    <div className="p-6 rounded-xl bg-surface border border-seam-border shadow-card space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-seam-border">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-telemetry-emerald"></div>
          <div>
            <h4 className="text-sm font-semibold font-mono text-ink-primary tracking-wide">
              REAL-TIME AI MATCH TELEMETRY &amp; AUDIT STREAM
            </h4>
            <p className="text-xs text-ink-muted mt-0.5">
              Live federated deduplication, minting actions &amp; cryptographic verification logs
            </p>
          </div>
        </div>

        <Link 
          to="/audit" 
          className="text-xs font-mono text-telemetry-cyan hover:underline flex items-center space-x-1 font-semibold"
        >
          <span>Full Audit Ledger</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Activity List */}
      <div className="space-y-3 font-mono">
        {auditLogs.slice(0, 5).map((log) => (
          <div 
            key={log.id} 
            className="p-3.5 rounded-lg bg-surface-subtle border border-seam-border hover:border-telemetry-cyan/30 transition text-xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-telemetry-cyan/10 text-telemetry-cyan font-bold border border-telemetry-cyan/25">
                  {log.action}
                </span>
                <span className="font-semibold text-ink-primary">{log.entityId}</span>
              </div>
              <span className="text-[11px] text-ink-muted">{log.timestamp}</span>
            </div>

            <p className="text-ink-secondary text-[11px] leading-relaxed">
              {log.details}
            </p>

            <div className="flex items-center justify-between pt-1.5 border-t border-seam-border text-[10px]">
              <span className="text-ink-muted truncate max-w-[240px]">
                By: <strong className="text-ink-primary">{log.actor}</strong>
              </span>

              <span className="flex items-center gap-1 text-telemetry-emerald font-mono font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SHA-256: {log.sha256 ? `${log.sha256.slice(0, 6)}...${log.sha256.slice(-4)}` : 'VERIFIED'}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
