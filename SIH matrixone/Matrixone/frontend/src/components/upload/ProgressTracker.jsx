import React from 'react';
import { CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

export const ProgressTracker = () => {
  const steps = [
    { title: 'Payload Decryption & Auth Token Check', status: 'COMPLETE', time: '4ms' },
    { title: 'Schema Normalization (Noun-Modifier Extractor)', status: 'COMPLETE', time: '12ms' },
    { title: 'Multilingual & Metric Conversion (Inch to DN, PSI to Class)', status: 'COMPLETE', time: '18ms' },
    { title: 'Dense Vector Embedding Generation (384-dim BERT)', status: 'COMPLETE', time: '22ms' },
    { title: 'ChromaDB HNSW Indexing & Cross-CPSE Matching', status: 'ACTIVE', time: 'LIVE' },
  ];

  return (
    <div className="p-6 rounded-xl bg-surface border border-seam-border shadow-card space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-seam-border">
        <h4 className="text-sm font-semibold font-mono text-ink-primary tracking-wide">
          INGESTION VALIDATION &amp; TELEMETRY CHECKLIST
        </h4>
        <span className="text-[10px] font-mono text-telemetry-emerald flex items-center gap-1 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Zero Data Leakage Guaranteed
        </span>
      </div>

      <div className="space-y-2.5 font-mono text-xs">
        {steps.map((step, idx) => (
          <div 
            key={idx}
            className="flex items-center justify-between p-3 rounded-lg bg-surface-subtle border border-seam-border"
          >
            <div className="flex items-center space-x-2.5">
              {step.status === 'COMPLETE' ? (
                <CheckCircle2 className="w-4 h-4 text-telemetry-emerald shrink-0" />
              ) : (
                <Clock className="w-4 h-4 text-telemetry-cyan animate-spin shrink-0" />
              )}
              <span className={step.status === 'COMPLETE' ? 'text-ink-primary font-medium' : 'text-telemetry-cyan font-semibold'}>
                {step.title}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-[10px]">
              <span className="text-ink-muted">{step.time}</span>
              <span className={`px-2 py-0.5 rounded border font-semibold ${
                step.status === 'COMPLETE' 
                  ? 'bg-telemetry-emerald/10 text-telemetry-emerald border-telemetry-emerald/25' 
                  : 'bg-telemetry-cyan/10 text-telemetry-cyan border-telemetry-cyan/25'
              }`}>
                {step.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
