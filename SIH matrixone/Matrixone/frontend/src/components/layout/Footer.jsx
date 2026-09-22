import React from 'react';
import { ShieldCheck, Cpu, GitBranch } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-seam-border bg-surface-subtle px-6 py-4 text-xs font-mono text-ink-muted flex flex-col md:flex-row items-center justify-between gap-3 transition-colors duration-200">
      <div className="flex items-center space-x-3 flex-wrap justify-center md:justify-start gap-y-1">
        <span className="flex items-center text-ink-primary space-x-1.5 font-bold">
          <ShieldCheck className="w-4 h-4 text-telemetry-emerald" />
          <span>MATRIXONE PLATFORM</span>
        </span>
        <span>&bull;</span>
        <span>Smart India Hackathon 2026 // PS ID: 26099</span>
        <span>&bull;</span>
        <span className="text-ink-secondary">One Nation, One Material Code</span>
      </div>

      <div className="flex items-center space-x-4 text-[11px] flex-wrap justify-center gap-y-1">
        <span className="flex items-center gap-1.5 text-telemetry-cyan font-medium">
          <Cpu className="w-3.5 h-3.5" />
          <span>Ensemble Embeddings (BERT + RapidFuzz + Spec Parser)</span>
        </span>
        <span className="hidden sm:inline">&bull;</span>
        <span className="flex items-center gap-1.5 text-telemetry-emerald font-medium">
          <GitBranch className="w-3.5 h-3.5" />
          <span>SHA-256 Ledger Live</span>
        </span>
      </div>
    </footer>
  );
};
