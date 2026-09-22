import React from 'react';
import { Shield, Lock, FileCheck, CheckCircle2 } from 'lucide-react';

export const GovernancePanel = () => {
  return (
    <div className="p-6 rounded-xl bg-surface border border-seam-border shadow-card space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-seam-border">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-telemetry-emerald" />
          <h4 className="text-sm font-semibold text-ink-primary tracking-wide">
            PUBLIC SECTOR GOVERNANCE &amp; CVC AUDIT MANDATES
          </h4>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-telemetry-emerald/10 text-telemetry-emerald border border-telemetry-emerald/25 font-bold">
          LEVEL 4 ENFORCED
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-lg bg-surface-subtle border border-seam-border space-y-1.5">
          <div className="flex items-center space-x-2 text-telemetry-cyan font-bold">
            <Lock className="w-4 h-4" />
            <span>Dual-Key Authorization</span>
          </div>
          <p className="text-ink-muted text-[11px] leading-relaxed">
            Minting any CNMC code affecting &gt;₹10 Cr spend requires simultaneous L2 CPSE approval and L3 National Authority digital signature.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-surface-subtle border border-seam-border space-y-1.5">
          <div className="flex items-center space-x-2 text-telemetry-emerald font-bold">
            <FileCheck className="w-4 h-4" />
            <span>CAG / CVC Automated Dossier</span>
          </div>
          <p className="text-ink-muted text-[11px] leading-relaxed">
            Every attribute merge and unit-rate harmonization event is cryptographically anchored with tamper-evident SHA-256 digests.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-surface-subtle border border-seam-border space-y-1.5">
          <div className="flex items-center space-x-2 text-telemetry-amber font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Sovereign GeM Federation</span>
          </div>
          <p className="text-ink-muted text-[11px] leading-relaxed">
            Canonical CNMC records synchronize with the Government e-Marketplace (GeM) national product taxonomy catalog via real-time webhooks.
          </p>
        </div>
      </div>
    </div>
  );
};
