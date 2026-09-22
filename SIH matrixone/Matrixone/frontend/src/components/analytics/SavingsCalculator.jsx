import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

export const SavingsCalculator = () => {
  const [totalSpendCr, setTotalSpendCr] = useState(48000); // 48,000 Cr CPSE total procurement spend
  const [volumeDiscountPercent, setVolumeDiscountPercent] = useState(12);
  const [deadInventoryLiquidation, setDeadInventoryLiquidation] = useState(25);
  const [adminStandardizationGain, setAdminStandardizationGain] = useState(4);

  // Math:
  // 1. Bulk Procurement Aggregation Savings = TotalSpend * (Overlap% ~ 33%) * (VolumeDiscount%)
  const duplicateSpendPool = totalSpendCr * 0.33;
  const bulkSavings = duplicateSpendPool * (volumeDiscountPercent / 100);
  
  // 2. Dead Inventory Re-routing = Est. surplus stock (~6,000 Cr across CPSEs) * Liquidation%
  const deadStockSavings = 6000 * (deadInventoryLiquidation / 100);

  // 3. Admin & Catalog Maintenance reduction
  const adminSavings = totalSpendCr * (adminStandardizationGain / 100);

  const totalProjectedSavings = Math.round(bulkSavings + deadStockSavings + adminSavings);

  return (
    <div className="p-6 rounded-xl bg-surface border border-seam-border shadow-card space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-seam-border gap-3">
        <div className="flex items-center space-x-2.5">
          <Calculator className="w-5 h-5 text-telemetry-cyan" />
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-base font-semibold font-mono text-ink-primary tracking-wide">
                INTERACTIVE SOVEREIGN PROCUREMENT SAVINGS CALCULATOR
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-telemetry-amber/10 text-telemetry-amber border border-telemetry-amber/25 font-mono font-bold">
                SIMULATED SCENARIO MODEL
              </span>
            </div>
            <p className="text-xs text-ink-muted mt-0.5">
              Model cross-CPSE bulk GeM RFQ aggregation, dead inventory liquidation &amp; standard harmonization
            </p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-md bg-telemetry-emerald/10 border border-telemetry-emerald/25 text-xs font-mono text-telemetry-emerald font-bold shrink-0">
          EST. TOTAL SAVINGS: ₹{totalProjectedSavings.toLocaleString()} Cr / YEAR
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center font-mono">
        {/* Sliders Column */}
        <div className="lg:col-span-7 space-y-5">
          {/* Slider 1: Total Baseline Procurement Spend */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-ink-secondary">CPSE Total Materials Spend Pool:</span>
              <span className="text-ink-primary font-bold">₹{totalSpendCr.toLocaleString()} Cr</span>
            </div>
            <input 
              type="range"
              min="20000"
              max="100000"
              step="1000"
              value={totalSpendCr}
              onChange={(e) => setTotalSpendCr(Number(e.target.value))}
              className="w-full h-2 bg-surface-subtle border border-seam-border rounded-lg appearance-none cursor-pointer accent-telemetry-cyan"
            />
            <div className="flex justify-between text-[10px] text-ink-muted">
              <span>₹20k Cr</span>
              <span>₹100k Cr</span>
            </div>
          </div>

          {/* Slider 2: Bulk RFQ Volume Discount Leverage */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-ink-secondary">Unified GeM Bulk RFQ Discount Leverage:</span>
              <span className="text-telemetry-cyan font-bold">{volumeDiscountPercent}%</span>
            </div>
            <input 
              type="range"
              min="5"
              max="30"
              step="1"
              value={volumeDiscountPercent}
              onChange={(e) => setVolumeDiscountPercent(Number(e.target.value))}
              className="w-full h-2 bg-surface-subtle border border-seam-border rounded-lg appearance-none cursor-pointer accent-telemetry-cyan"
            />
            <div className="flex justify-between text-[10px] text-ink-muted">
              <span>5% (Conservative)</span>
              <span>30% (Max Aggregation)</span>
            </div>
          </div>

          {/* Slider 3: Surplus Stock Cross-CPSE Transfer */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-ink-secondary">Cross-CPSE Surplus Stock Re-routing / Liquidation:</span>
              <span className="text-telemetry-emerald font-bold">{deadInventoryLiquidation}%</span>
            </div>
            <input 
              type="range"
              min="10"
              max="50"
              step="5"
              value={deadInventoryLiquidation}
              onChange={(e) => setDeadInventoryLiquidation(Number(e.target.value))}
              className="w-full h-2 bg-surface-subtle border border-seam-border rounded-lg appearance-none cursor-pointer accent-telemetry-emerald"
            />
            <div className="flex justify-between text-[10px] text-ink-muted">
              <span>10% Transfer</span>
              <span>50% Optimized</span>
            </div>
          </div>
        </div>

        {/* Savings Breakdown Display */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-surface-subtle border border-seam-border space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-telemetry-cyan font-bold uppercase tracking-wider">
              PROJECTED ECONOMIC HARMONIZATION IMPACT:
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface border border-seam-border text-ink-muted font-bold">
              ESTIMATED
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-seam-border">
              <span className="text-ink-secondary">1. Bulk Tender Aggregation:</span>
              <span className="text-ink-primary font-bold">₹{Math.round(bulkSavings).toLocaleString()} Cr</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-seam-border">
              <span className="text-ink-secondary">2. Inter-CPSE Surplus Liquidation:</span>
              <span className="text-telemetry-emerald font-bold">₹{Math.round(deadStockSavings).toLocaleString()} Cr</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-seam-border">
              <span className="text-ink-secondary">3. Catalog Administration Gain:</span>
              <span className="text-ink-primary font-bold">₹{Math.round(adminSavings).toLocaleString()} Cr</span>
            </div>
          </div>

          <div className="pt-2 border-t border-seam-border flex items-center justify-between">
            <span className="font-semibold text-ink-primary">Total National Dividend:</span>
            <span className="text-lg font-bold text-telemetry-emerald">
              ₹{totalProjectedSavings.toLocaleString()} Cr
            </span>
          </div>

          <div className="p-3 rounded-md bg-surface border border-seam-border text-[11px] text-ink-muted leading-relaxed">
            Equivalent to saving <strong className="text-ink-primary">~{((totalProjectedSavings / totalSpendCr) * 100).toFixed(1)}%</strong> of total public sector material procurement annually.
          </div>
        </div>
      </div>
    </div>
  );
};
