import React from 'react';
import { MatrixAIChat } from '../components/ai-chat/MatrixAIChat';

export const AIChat = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-seam-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-ink-primary tracking-wide">
            MATRIXAI // SOVEREIGN MATERIAL INTELLIGENCE ASSISTANT
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Conversational RAG assistant grounded on 1.25M Indian CPSE material masters &amp; UNSPSC taxonomy
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs shrink-0">
          <span className="px-3 py-1.5 rounded-md bg-telemetry-cyan/10 text-telemetry-cyan border border-telemetry-cyan/25 font-semibold">
            LLM: Gemini 1.5 Pro + LLaMA 3.1 Fallback
          </span>
        </div>
      </div>

      {/* Main Chat Interface */}
      <MatrixAIChat />
    </div>
  );
};

export default AIChat;
