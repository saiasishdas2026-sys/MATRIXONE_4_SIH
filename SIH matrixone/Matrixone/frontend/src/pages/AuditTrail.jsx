import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { AuditTimeline } from '../components/audit/AuditTimeline';
import { GovernancePanel } from '../components/audit/GovernancePanel';

export const AuditTrail = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-seam-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-ink-primary tracking-wide">
            SOVEREIGN AUDIT TRAIL &amp; GOVERNANCE LEDGER
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Immutable SHA-256 event provenance ensuring full compliance with Comptroller and Auditor General (CAG) standards
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs shrink-0">
          <span className="px-3 py-1.5 rounded-md bg-telemetry-emerald/10 text-telemetry-emerald border border-telemetry-emerald/25 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Cryptographic Chain: Healthy</span>
          </span>
        </div>
      </div>

      {/* Governance Standards Overview */}
      <GovernancePanel />

      {/* Full Audit Timeline */}
      <AuditTimeline />
    </div>
  );
};

export default AuditTrail;
