import React, { useState } from 'react';
import { Check, ShieldAlert, XCircle, Sparkles, CheckCircle, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useMaterialStore } from '../../store/materialStore';

export const ApprovalWorkflow = ({ pair }) => {
  const { confirmMerge, rejectMatch, escalateToReview } = useMaterialStore();
  const [mintedCode, setMintedCode] = useState(pair?.mintedCNMC || null);
  const [copied, setCopied] = useState(false);

  if (!pair) return null;

  const handleMerge = () => {
    const code = confirmMerge(pair.id);
    setMintedCode(code);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 rounded-xl bg-surface border border-seam-border shadow-card space-y-4">
      {/* Proposed CNMC Canonical Card */}
      <div className="p-4 rounded-lg bg-surface-subtle border border-telemetry-cyan/30 space-y-3 font-mono text-xs shadow-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-telemetry-cyan font-bold uppercase text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            PROPOSED SOVEREIGN CANONICAL SYNTHESIS (CNMC):
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-telemetry-emerald/10 text-telemetry-emerald border border-telemetry-emerald/25 font-semibold">
            CAG &amp; GeM COMPLIANT
          </span>
        </div>

        <div className="flex items-center justify-between bg-surface p-3 rounded-md border border-seam-border">
          <div>
            <span className="text-[10px] text-ink-muted uppercase block font-semibold">Sovereign Material Code</span>
            <span className="text-base sm:text-lg font-bold text-telemetry-cyan select-all">
              {mintedCode || pair.proposedCNMC}
            </span>
          </div>

          <button
            onClick={() => handleCopy(mintedCode || pair.proposedCNMC)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md bg-surface-subtle hover:bg-surface-active text-ink-primary border border-seam-border text-[11px] font-semibold transition"
          >
            <Copy className="w-3 h-3 text-telemetry-cyan" />
            <span>{copied ? 'COPIED' : 'COPY'}</span>
          </button>
        </div>

        <div>
          <span className="text-[10px] text-ink-muted uppercase block font-semibold">Standardized Title (Noun-Modifier-Spec)</span>
          <p className="text-ink-primary font-semibold text-xs mt-0.5">
            {pair.canonicalTitle}
          </p>
        </div>

        <div className="pt-2 border-t border-seam-border flex items-center justify-between text-[11px]">
          <span className="text-ink-muted">Consolidated Procurement Impact:</span>
          <span className="text-telemetry-emerald font-bold">
            ₹14.20 Cr Projected Annual Savings via Unified RFQ
          </span>
        </div>
      </div>

      {/* Decision Action Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="text-xs font-mono text-ink-muted">
          <span>Clearance Status:</span>
          <span className="text-ink-primary ml-1.5 font-semibold">
            {pair.status === 'APPROVED' ? 'MINTED & FEDERATED' : 'AWAITING AUTHORIZED ACTION'}
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {pair.status !== 'APPROVED' ? (
            <>
              {/* Confirm Merge (Primary Action) */}
              <button
                onClick={handleMerge}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-md bg-telemetry-cyan hover:bg-telemetry-cyan-bright text-white font-bold text-xs transition shadow-sm"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirm Merge &amp; Mint CNMC</span>
                <kbd className="ml-1 text-[9px] bg-black/20 px-1 py-0.5 rounded text-white font-mono">M</kbd>
              </button>

              {/* Escalate to L2 Review (Secondary Action) */}
              <button
                onClick={() => escalateToReview(pair.id)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-md bg-surface border border-telemetry-amber/40 text-telemetry-amber hover:bg-telemetry-amber/10 font-mono text-xs font-semibold transition"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>L2 CPSE Review</span>
                <kbd className="ml-1 text-[9px] bg-telemetry-amber/20 px-1 py-0.5 rounded text-telemetry-amber font-mono">E</kbd>
              </button>

              {/* Reject / Mark Unique (Tertiary Action) */}
              <button
                onClick={() => rejectMatch(pair.id)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-md bg-surface border border-telemetry-crimson/40 text-telemetry-crimson hover:bg-telemetry-crimson/10 font-mono text-xs font-semibold transition"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject / Distinct</span>
                <kbd className="ml-1 text-[9px] bg-telemetry-crimson/20 px-1 py-0.5 rounded text-telemetry-crimson font-mono">R</kbd>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2 text-telemetry-emerald font-mono text-xs font-bold px-3 py-2 rounded-md bg-telemetry-emerald/10 border border-telemetry-emerald/25">
              <CheckCircle className="w-4 h-4" />
              <span>SOVEREIGN CNMC MINTED &amp; FEDERATED TO GeM MESH</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
