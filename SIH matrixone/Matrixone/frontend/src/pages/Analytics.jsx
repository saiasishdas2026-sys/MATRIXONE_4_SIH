import React from 'react';
import { Download } from 'lucide-react';
import { SavingsCalculator } from '../components/analytics/SavingsCalculator';
import { InventoryOptimizer } from '../components/analytics/InventoryOptimizer';
import { ProcurementInsights } from '../components/analytics/ProcurementInsights';

export const Analytics = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-seam-border">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-ink-primary tracking-wide">
              NATIONAL PROCUREMENT &amp; INVENTORY SAVINGS ANALYTICS
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-telemetry-amber/10 text-telemetry-amber font-mono border border-telemetry-amber/25 font-semibold">
              SIMULATED &amp; CALCULATED MODELS
            </span>
          </div>
          <p className="text-xs text-ink-muted mt-1">
            Macroeconomic impact forecasting, bulk RFQ volume aggregation &amp; surplus liquidation intelligence
          </p>
        </div>

        <button className="flex items-center space-x-1.5 px-3.5 py-2 rounded-md bg-surface-subtle hover:bg-surface-active text-ink-primary border border-seam-border font-mono text-xs transition shadow-xs shrink-0">
          <Download className="w-3.5 h-3.5 text-telemetry-cyan" />
          <span>Download Fiscal Report</span>
        </button>
      </div>

      {/* Interactive Savings Calculator */}
      <SavingsCalculator />

      {/* Secondary Grid: Surplus Inventory Re-routing + Procurement Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <InventoryOptimizer />
        </div>
        <div className="lg:col-span-6">
          <ProcurementInsights />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
