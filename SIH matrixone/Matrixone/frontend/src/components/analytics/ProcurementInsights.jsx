import React from 'react';
import { Lightbulb, ArrowUpRight } from 'lucide-react';

export const ProcurementInsights = () => {
  const insights = [
    {
      type: 'OPPORTUNITY',
      title: 'Bulk RFQ Consolidation: SS316 High-Pressure Valves',
      desc: 'ONGC, CPCL, and NTPC have combined upcoming tender requirements for 3,400 units of DN50 Class 800 Gate Valves. Aggregating into a single GeM reverse-auction tender is projected to yield a 26% unit-rate concession.',
      impact: '₹14.2 Cr',
      urgency: 'HIGH'
    },
    {
      type: 'ANOMALY',
      title: 'Unit Rate Divergence: Seamless Boiler Piping',
      desc: 'BHEL pays ₹5,600/m for ASTM A106 Gr B 150 NB piping, whereas SAIL procures equivalent spec at ₹4,200/m (33.3% variance). Rate harmonization recommended.',
      impact: '₹21.5 Cr',
      urgency: 'CRITICAL'
    },
    {
      type: 'COMPLIANCE',
      title: 'UNSPSC Taxonomy Alignment Progress',
      desc: '92.4% of cataloged mechanical spares successfully mapped to standard UNSPSC segment 40 (Fluid & Industrial Equipment). Remaining 7.6% undergoing rule-based categorization.',
      impact: '92.4% Aligned',
      urgency: 'NOMINAL'
    }
  ];

  return (
    <div className="p-6 rounded-xl bg-surface border border-seam-border shadow-card space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-seam-border">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-telemetry-amber" />
          <h4 className="text-sm font-semibold text-ink-primary tracking-wide">
            AI PROCUREMENT INTELLIGENCE &amp; INSIGHTS
          </h4>
        </div>
        <span className="text-[10px] text-ink-muted uppercase">Updated 4 mins ago</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {insights.map((ins, idx) => (
          <div key={idx} className="p-4 rounded-lg bg-surface-subtle border border-seam-border space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  ins.urgency === 'CRITICAL' ? 'bg-telemetry-crimson/10 text-telemetry-crimson border-telemetry-crimson/25' :
                  ins.urgency === 'HIGH' ? 'bg-telemetry-amber/10 text-telemetry-amber border-telemetry-amber/25' :
                  'bg-telemetry-emerald/10 text-telemetry-emerald border-telemetry-emerald/25'
                }`}>
                  {ins.type} &bull; {ins.urgency}
                </span>
                <span className="text-telemetry-emerald font-bold">{ins.impact}</span>
              </div>
              <h5 className="text-ink-primary font-semibold text-xs leading-snug mt-1">{ins.title}</h5>
              <p className="text-ink-muted text-[11px] mt-1.5 leading-relaxed">{ins.desc}</p>
            </div>

            <button className="flex items-center space-x-1 text-telemetry-cyan text-[11px] hover:underline pt-2 border-t border-seam-border font-semibold">
              <span>View Executive Brief</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
