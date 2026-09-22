import React, { useState } from 'react';
import { Cpu, ChevronDown, ChevronUp, Sparkles, Layers } from 'lucide-react';
import { getConfidenceBadge } from '../../utils/helpers';

export const ConfidenceGauge = ({ pair }) => {
  const [showBreakdown, setShowBreakdown] = useState(true);

  if (!pair) return null;

  const {
    confidenceScore,
    semanticScore,
    fuzzyScore,
    attributeScore,
    reasoning,
    canonicalTitle,
    materialA,
    materialB
  } = pair;

  const badge = getConfidenceBadge(confidenceScore);
  const strokeDashoffset = 440 - (440 * confidenceScore) / 100;

  return (
    <div className="p-6 rounded-xl bg-surface border border-seam-border shadow-card space-y-5">
      {/* 1. MATCH RESULT HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-seam-border gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-telemetry-cyan" />
            <h4 className="text-sm font-semibold font-mono text-ink-primary tracking-wide">
              AI ENSEMBLE MATCH RESULT &amp; CONFIDENCE ANALYSIS
            </h4>
          </div>
          <p className="text-xs text-ink-muted mt-0.5">
            Cross-enterprise reconciliation between <strong className="text-ink-primary">{materialA.cpseCode}</strong> and <strong className="text-ink-primary">{materialB.cpseCode}</strong>
          </p>
        </div>

        <span className={`text-[11px] font-mono px-2.5 py-1 rounded border flex items-center gap-1.5 font-semibold shrink-0 ${badge.bg} ${badge.color}`}>
          <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
          {badge.label} &bull; {badge.action}
        </span>
      </div>

      {/* 2. CONFIDENCE & WHY IT MATCHED (EXPLAINABLE AI INSIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radial Hero Gauge */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center py-2">
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              {/* Background Ring */}
              <circle
                cx="80"
                cy="80"
                r="70"
                className="text-surface-active"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="80"
                cy="80"
                r="70"
                className="text-telemetry-cyan transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray="440"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold font-mono text-ink-primary tracking-tight">
                {confidenceScore}%
              </span>
              <span className="text-[10px] font-mono uppercase text-ink-muted tracking-wider font-semibold">
                MATCH SCORE
              </span>
            </div>
          </div>
          <p className="text-[11px] font-mono text-ink-muted text-center mt-2">
            Multi-Vector Composite Evaluation
          </p>
        </div>

        {/* XAI Reasoning (Why It Matched) - Placed prominent in accordance with Section 14 */}
        <div className="lg:col-span-8 space-y-3">
          {reasoning && (
            <div className="p-4 rounded-lg bg-surface-subtle border border-seam-border flex items-start space-x-3 text-xs font-mono">
              <Sparkles className="w-4 h-4 text-telemetry-cyan shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold text-telemetry-cyan block tracking-wider">
                  WHY THIS PAIR MATCHED (EXPLAINABLE AI):
                </span>
                <p className="text-ink-secondary text-xs leading-relaxed mt-1">
                  {reasoning}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-mono text-ink-muted">
              Standardized Candidate: <strong className="text-ink-primary">{canonicalTitle}</strong>
            </span>
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="text-xs font-mono text-telemetry-cyan hover:underline flex items-center gap-1 font-semibold"
            >
              <span>{showBreakdown ? 'Hide Weight Breakdown' : 'Show Score Breakdown'}</span>
              {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. DETAILED SCORE BREAKDOWN (Progressive Disclosure) */}
      {showBreakdown && (
        <div className="pt-4 border-t border-seam-border space-y-3 font-mono text-xs">
          <div className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">
            Detailed Ensemble Score Breakdown (Tri-Modal Vectors):
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Metric 1: Semantic Embedding */}
            <div className="p-3.5 rounded-lg bg-surface-subtle border border-seam-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-ink-secondary text-[11px] flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-sm bg-telemetry-cyan"></span>
                  <span>1. Semantic (50%)</span>
                </span>
                <span className="text-ink-primary font-bold">{semanticScore}%</span>
              </div>
              <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-seam-border">
                <div 
                  className="bg-telemetry-cyan h-full rounded-full transition-all duration-700" 
                  style={{ width: `${semanticScore}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-ink-muted">
                384-dim Domain BERT Cosine Distance
              </p>
            </div>

            {/* Metric 2: Fuzzy String Matching */}
            <div className="p-3.5 rounded-lg bg-surface-subtle border border-seam-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-ink-secondary text-[11px] flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-sm bg-telemetry-emerald"></span>
                  <span>2. Fuzzy Token (25%)</span>
                </span>
                <span className="text-ink-primary font-bold">{fuzzyScore}%</span>
              </div>
              <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-seam-border">
                <div 
                  className="bg-telemetry-emerald h-full rounded-full transition-all duration-700" 
                  style={{ width: `${fuzzyScore}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-ink-muted">
                Token Sort &amp; Set Ratio with Stopword Filter
              </p>
            </div>

            {/* Metric 3: Technical Attribute Parity */}
            <div className="p-3.5 rounded-lg bg-surface-subtle border border-seam-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-ink-secondary text-[11px] flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-sm bg-telemetry-amber"></span>
                  <span>3. Spec Parity (25%)</span>
                </span>
                <span className="text-ink-primary font-bold">{attributeScore}%</span>
              </div>
              <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-seam-border">
                <div 
                  className="bg-telemetry-amber h-full rounded-full transition-all duration-700" 
                  style={{ width: `${attributeScore}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-ink-muted">
                Pressure, Metallurgy, Dimensional Parity
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
