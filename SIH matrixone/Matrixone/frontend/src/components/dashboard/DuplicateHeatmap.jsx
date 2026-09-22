import React, { useState } from 'react';
import { Layers, Info, Filter, ArrowRight } from 'lucide-react';
import { DUPLICATE_HEATMAP_DATA } from '../../mockData/materials';

export const DuplicateHeatmap = () => {
  const [selectedCell, setSelectedCell] = useState(DUPLICATE_HEATMAP_DATA[0]);
  const cpseList = ['ONGC', 'CPCL', 'IOCL', 'NTPC', 'SAIL', 'GAIL', 'BHEL'];

  const getCellData = (c1, c2) => {
    if (c1 === c2) return { overlap: 100, isSelf: true };
    const found = DUPLICATE_HEATMAP_DATA.find(
      d => (d.cpse1 === c1 && d.cpse2 === c2) || (d.cpse1 === c2 && d.cpse2 === c1)
    );
    return found || { overlap: Math.round(25 + ((c1.charCodeAt(0) + c2.charCodeAt(0)) % 25)), potentialSavingsCr: 180, duplicateCount: 12400 };
  };

  const getHeatColor = (overlap, isSelf) => {
    if (isSelf) return 'bg-surface-active text-ink-muted';
    if (overlap >= 50) return 'bg-telemetry-cyan/20 text-telemetry-cyan border border-telemetry-cyan/40 font-bold';
    if (overlap >= 40) return 'bg-telemetry-cyan/10 text-telemetry-cyan border border-telemetry-cyan/20 font-semibold';
    if (overlap >= 30) return 'bg-telemetry-emerald/10 text-telemetry-emerald border border-telemetry-emerald/20';
    return 'bg-surface-subtle text-ink-secondary border border-seam-border';
  };

  return (
    <div className="p-6 rounded-xl bg-surface border border-seam-border shadow-card space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-seam-border gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-telemetry-cyan"></div>
          <div>
            <h4 className="text-sm font-semibold font-mono text-ink-primary tracking-wide">
              CROSS-CPSE DUPLICATE OVERLAP HEATMAP MATRIX
            </h4>
            <p className="text-xs text-ink-muted mt-0.5">
              Pairwise inventory overlap analysis across major Indian Public Sector Enterprises
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-[11px] text-ink-muted">
            <span className="w-3 h-3 rounded bg-telemetry-cyan/20 border border-telemetry-cyan/40"></span> &gt;50% High
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-ink-muted">
            <span className="w-3 h-3 rounded bg-telemetry-cyan/10 border border-telemetry-cyan/20"></span> 40-50%
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-ink-muted">
            <span className="w-3 h-3 rounded bg-telemetry-emerald/10 border border-telemetry-emerald/20"></span> &lt;40%
          </span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-center border-collapse font-mono text-xs">
          <thead>
            <tr>
              <th className="p-2 text-left text-ink-muted font-normal text-[11px] border-b border-seam-border">CPSE</th>
              {cpseList.map((cpse) => (
                <th key={cpse} className="p-2 text-ink-secondary font-semibold border-b border-seam-border text-[11px]">
                  {cpse}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cpseList.map((rowCPSE) => (
              <tr key={rowCPSE} className="hover:bg-surface-subtle transition">
                <td className="p-2 text-left font-semibold text-ink-primary border-r border-seam-border text-[11px]">
                  {rowCPSE}
                </td>
                {cpseList.map((colCPSE) => {
                  const cell = getCellData(rowCPSE, colCPSE);
                  const isSelected = selectedCell && 
                    ((selectedCell.cpse1 === rowCPSE && selectedCell.cpse2 === colCPSE) ||
                     (selectedCell.cpse1 === colCPSE && selectedCell.cpse2 === rowCPSE));

                  return (
                    <td key={colCPSE} className="p-1">
                      <button
                        onClick={() => !cell.isSelf && setSelectedCell({ cpse1: rowCPSE, cpse2: colCPSE, ...cell })}
                        disabled={cell.isSelf}
                        className={`w-full py-2 px-1 rounded transition text-[11px] ${
                          cell.isSelf ? 'cursor-default' : 'cursor-pointer hover:scale-105'
                        } ${isSelected ? 'ring-2 ring-telemetry-cyan' : ''} ${getHeatColor(cell.overlap, cell.isSelf)}`}
                      >
                        {cell.isSelf ? '—' : `${cell.overlap}%`}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Cell Drill-Down Panel */}
      {selectedCell && !selectedCell.isSelf && (
        <div className="mt-4 p-4 rounded-lg bg-surface-subtle border border-seam-border flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center space-x-3">
            <div className="px-2.5 py-1 rounded bg-telemetry-cyan/10 text-telemetry-cyan font-bold border border-telemetry-cyan/25">
              {selectedCell.cpse1} ⟷ {selectedCell.cpse2}
            </div>
            <div>
              <p className="text-ink-primary font-medium">
                Overlap Density: <span className="text-telemetry-cyan font-bold">{selectedCell.overlap}%</span>
              </p>
              <p className="text-ink-muted text-[11px] mt-0.5">
                {selectedCell.duplicateCount?.toLocaleString()} Identical/Near-Duplicate items identified across inventories
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-[10px] text-ink-muted block uppercase">Annual RFQ Savings</span>
              <span className="text-sm font-bold text-telemetry-emerald">
                ₹{selectedCell.potentialSavingsCr || 420} Cr
              </span>
            </div>

            <a 
              href="/matching"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-telemetry-cyan hover:bg-telemetry-cyan-bright text-white font-semibold text-xs transition shadow-xs"
            >
              <span>Inspect Cluster</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
