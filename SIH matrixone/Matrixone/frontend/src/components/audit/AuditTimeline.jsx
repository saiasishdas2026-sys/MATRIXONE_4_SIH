import React, { useState } from 'react';
import { History, ShieldCheck, Download, Copy, Check } from 'lucide-react';
import { useMaterialStore } from '../../store/materialStore';

export const AuditTimeline = () => {
  const { auditLogs } = useMaterialStore();
  const [filterAction, setFilterAction] = useState('ALL');
  const [copiedHash, setCopiedHash] = useState(null);

  const filteredLogs = filterAction === 'ALL' 
    ? auditLogs 
    : auditLogs.filter(l => l.action === filterAction);

  const handleCopy = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `MATRIXONE_CAG_AUDIT_LEDGER_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="p-6 rounded-xl bg-surface border border-seam-border shadow-card space-y-4 font-mono text-xs">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-seam-border gap-3">
        <div className="flex items-center space-x-2.5">
          <History className="w-5 h-5 text-telemetry-cyan" />
          <div>
            <h4 className="text-sm font-semibold text-ink-primary tracking-wide">
              IMMUTABLE SOVEREIGN AUDIT LEDGER (SHA-256 PROOFS)
            </h4>
            <p className="text-xs text-ink-muted mt-0.5">
              Tamper-proof compliance log complying with CAG &amp; CVC public procurement scrutiny standards
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Action Filter */}
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-surface-subtle border border-seam-border rounded-md px-3 py-1.5 text-xs text-ink-primary focus:outline-none focus:border-telemetry-cyan shadow-xs"
          >
            <option value="ALL">All Actions</option>
            <option value="MINT_CNMC">MINT_CNMC</option>
            <option value="AUTO_HARMONIZE">AUTO_HARMONIZE</option>
            <option value="INGEST_BATCH">INGEST_BATCH</option>
            <option value="HITL_OVERRIDE">HITL_OVERRIDE</option>
          </select>

          {/* Export Button */}
          <button
            onClick={exportJSON}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-surface-subtle hover:bg-surface-active text-ink-primary border border-seam-border transition shadow-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5 text-telemetry-cyan" />
            <span>Export CAG Dossier</span>
          </button>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-3">
        {filteredLogs.map((log) => (
          <div 
            key={log.id}
            className="p-4 rounded-lg bg-surface-subtle border border-seam-border hover:border-telemetry-cyan/30 transition space-y-2.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  log.action === 'MINT_CNMC' ? 'bg-telemetry-cyan/10 text-telemetry-cyan border-telemetry-cyan/25' :
                  log.action === 'AUTO_HARMONIZE' ? 'bg-telemetry-emerald/10 text-telemetry-emerald border-telemetry-emerald/25' :
                  log.action === 'HITL_OVERRIDE' ? 'bg-telemetry-amber/10 text-telemetry-amber border-telemetry-amber/25' :
                  'bg-surface text-ink-primary border-seam-border'
                }`}>
                  {log.action}
                </span>
                <span className="text-ink-primary font-bold">{log.entityId}</span>
                <span className="text-[10px] text-ink-muted">({log.entityType})</span>
              </div>

              <span className="text-ink-muted text-[11px]">{log.timestamp}</span>
            </div>

            <p className="text-ink-secondary text-[11px] leading-relaxed">
              {log.details}
            </p>

            <div className="flex flex-col md:flex-row md:items-center justify-between pt-2 border-t border-seam-border gap-2 text-[10px]">
              <span className="text-ink-muted">
                Actor: <strong className="text-ink-primary">{log.actor}</strong>
              </span>

              <div className="flex items-center space-x-2">
                <span className="flex items-center gap-1 text-telemetry-emerald font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {log.status}
                </span>
                <span className="text-ink-muted font-mono select-all bg-surface px-2 py-0.5 rounded border border-seam-border">
                  SHA: {log.sha256 ? `${log.sha256.slice(0, 10)}...${log.sha256.slice(-6)}` : 'GEN_VALID'}
                </span>
                <button
                  onClick={() => handleCopy(log.sha256)}
                  className="text-telemetry-cyan hover:underline ml-1"
                  title="Copy SHA-256 Digest"
                >
                  {copiedHash === log.sha256 ? <Check className="w-3 h-3 text-telemetry-emerald inline" /> : <Copy className="w-3 h-3 inline" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
