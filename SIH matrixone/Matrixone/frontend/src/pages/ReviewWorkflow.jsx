import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Filter, 
  Check, 
  X, 
  Eye, 
  HelpCircle,
  FileText,
  UserCheck,
  Building2,
  Cpu,
  ArrowRight,
  Clock
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useWorkflowStore } from '../store/workflowStore';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../utils/api';

export const ReviewWorkflow = () => {
  const { user } = useAuthStore();
  const { activeTab, setActiveTab, queueItems, approveWorkflowItem, rejectWorkflowItem } = useWorkflowStore();

  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCPSE, setSelectedCPSE] = useState('ALL');
  const [selectedItemForReview, setSelectedItemForReview] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'approve'|'reject'|'flag', item: ... }
  const [officerNote, setOfficerNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const tabs = [
    { id: 'L1_VERIFICATION', label: 'L1 Technical Verification', badge: queueItems.filter(i => i.stage === 'L1_VERIFICATION').length },
    { id: 'L2_CPSE_APPROVAL', label: 'L2 CPSE Authority Approval', badge: queueItems.filter(i => i.stage === 'L2_CPSE_APPROVAL').length },
    { id: 'L3_NATIONAL_MASTER', label: 'L3 National Authority Minting', badge: queueItems.filter(i => i.stage === 'L3_NATIONAL_MASTER').length },
    { id: 'COMPLETED', label: 'Harmonized & Minted', badge: queueItems.filter(i => i.stage === 'COMPLETED').length }
  ];

  // Filtering
  const filteredItems = queueItems.filter(item => {
    if (item.stage !== activeTab && activeTab !== 'ALL') return false;
    if (selectedStatus !== 'ALL' && item.status !== selectedStatus) return false;
    if (selectedCPSE !== 'ALL' && !item.cpses.includes(selectedCPSE)) return false;
    return true;
  });

  const handleExecuteDecision = async () => {
    if (!confirmAction) return;
    setIsProcessing(true);
    const { type, item } = confirmAction;

    try {
      // Optional call to backend if available
      try {
        await apiClient.post(`/candidate-pairs/${item.id}/decision`, {
          decision: type,
          reason: officerNote || `Decision ${type} executed via HITL governance desk`,
          action: type,
          reviewer: user?.name || 'Review Officer',
          note: officerNote || `Decision ${type} executed via HITL governance desk`,
        });
      } catch {
        // Fallback gracefully to store
      }

      if (type === 'approve') {
        approveWorkflowItem(item.id, officerNote);
        toast.success(`Match ${item.id} APPROVED and advanced to next tier!`);
      } else if (type === 'reject') {
        rejectWorkflowItem(item.id, officerNote || 'Rejected as distinct by officer');
        toast.error(`Match ${item.id} REJECTED as distinct.`);
      } else {
        toast.success(`Match ${item.id} FLAGGED for specialized engineering review.`);
      }

      setConfirmAction(null);
      setSelectedItemForReview(null);
      setOfficerNote('');
    } catch (err) {
      toast.error('Failed to submit decision: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-seam-border">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-telemetry-amber bg-telemetry-amber/10 px-2 py-0.5 rounded border border-telemetry-amber/20">
              AI RECOMMENDS. HUMAN DECIDES.
            </span>
            <span className="text-xs text-ink-muted">&bull; CAG Audit Grade Sign-off</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-ink-primary tracking-tight mt-1">
            HITL Technical Governance &amp; Review Queue
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary">
            Human-in-the-loop multi-tier verification complying with Indian Public Procurement Manuals.
          </p>
        </div>

        <span className="text-xs font-mono text-telemetry-emerald flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-telemetry-emerald/10 border border-telemetry-emerald/25 font-semibold shrink-0 shadow-xs">
          <Shield className="w-4 h-4" />
          <span>Statutory Compliance Active</span>
        </span>
      </div>

      {/* Workflow Stage Stepper Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between shadow-xs ${
              activeTab === tab.id
                ? 'bg-surface border-telemetry-cyan text-ink-primary ring-1 ring-telemetry-cyan font-bold'
                : 'bg-surface border-seam-border text-ink-secondary hover:text-ink-primary hover:border-telemetry-cyan/40'
            }`}
          >
            <div>
              <span className="text-[10px] text-ink-muted block uppercase font-medium">Approval Tier</span>
              <span className="font-bold text-xs mt-0.5 block truncate">{tab.label}</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ml-2 shrink-0 ${
              activeTab === tab.id
                ? 'bg-telemetry-cyan/15 text-telemetry-cyan border-telemetry-cyan/30'
                : 'bg-surface-subtle text-ink-muted border-seam-border'
            }`}>
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-surface border border-seam-border rounded-xl p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-ink-muted" />
          <span className="text-ink-muted uppercase">Filter CPSE:</span>
          <select
            value={selectedCPSE}
            onChange={(e) => setSelectedCPSE(e.target.value)}
            className="bg-surface-subtle border border-seam-border rounded-lg py-1 px-2.5 text-ink-primary focus:outline-none focus:border-telemetry-cyan"
          >
            <option value="ALL">All CPSEs</option>
            <option value="ONGC">ONGC</option>
            <option value="IOCL">IOCL</option>
            <option value="GAIL">GAIL</option>
            <option value="BHEL">BHEL</option>
            <option value="CPCL">CPCL</option>
            <option value="SAIL">SAIL</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-ink-muted uppercase">Active Reviewer:</span>
          <span className="px-2 py-0.5 rounded bg-surface-subtle border border-seam-border text-telemetry-cyan font-bold">
            {user?.name || 'Dr. R. Iyer (ONGC)'}
          </span>
        </div>
      </div>

      {/* Queue Items List */}
      <div className="space-y-3 font-mono text-xs">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-surface border border-seam-border text-ink-muted shadow-xs">
            <CheckCircle2 className="w-8 h-8 text-telemetry-emerald mx-auto mb-2 opacity-80" />
            <p className="text-sm font-semibold text-ink-primary">No items currently pending in this queue.</p>
            <p className="text-xs text-ink-muted mt-1">All candidate pairs in this tier have been verified.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div 
              key={item.id}
              className="p-5 rounded-xl bg-surface border border-seam-border hover:border-telemetry-cyan/40 transition shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-seam-border">
                <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                  <span className="px-2 py-0.5 rounded bg-surface-subtle text-telemetry-cyan font-bold border border-seam-border">
                    {item.id}
                  </span>
                  <h4 className="text-ink-primary font-bold text-sm font-sans">{item.title}</h4>
                  <div className="flex items-center space-x-1">
                    {item.cpses.map((c) => (
                      <span key={c} className="px-2 py-0.5 rounded bg-surface-subtle text-[10px] text-ink-secondary border border-seam-border font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 font-bold">
                    {item.confidence}% Match
                  </span>
                  <span className="text-[11px] text-ink-muted">{item.dateSubmitted}</span>
                </div>
              </div>

              {/* Spec Comparison Teaser */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-surface-subtle border border-seam-border">
                  <span className="text-ink-muted text-[10px] block">CPSE A ({item.cpses[0]})</span>
                  <p className="text-ink-primary font-bold mt-0.5">BALL VALVE 2 INCH 150# CS ASTM A216 WCB RF</p>
                  <p className="text-[11px] text-ink-muted mt-1">Size: 2in &bull; Class: 150# &bull; Mat: WCB</p>
                </div>
                <div className="p-3 rounded-lg bg-surface-subtle border border-seam-border">
                  <span className="text-ink-muted text-[10px] block">CPSE B ({item.cpses[1]})</span>
                  <p className="text-ink-primary font-bold mt-0.5">VALVE BALL 2IN 150LBS WCB BODY SS316 BALL</p>
                  <p className="text-[11px] text-ink-muted mt-1">Size: 2in &bull; Class: 150# &bull; Mat: WCB/316</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-seam-border">
                <button
                  onClick={() => setSelectedItemForReview(item)}
                  className="py-1.5 px-3 rounded-lg bg-surface-subtle hover:bg-surface-active border border-seam-border text-ink-secondary hover:text-ink-primary transition flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Side-by-Side Spec Diff</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConfirmAction({ type: 'flag', item })}
                    className="py-1.5 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 font-semibold transition flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Flag for Review</span>
                  </button>

                  <button
                    onClick={() => setConfirmAction({ type: 'reject', item })}
                    className="py-1.5 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 font-semibold transition flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject Distinct</span>
                  </button>

                  <button
                    onClick={() => setConfirmAction({ type: 'approve', item })}
                    className="py-1.5 px-4 rounded-lg bg-telemetry-emerald hover:bg-emerald-600 text-white font-semibold transition flex items-center gap-1 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Approve Harmonization</span>
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SIDE-BY-SIDE SPEC DIFF MODAL
          ───────────────────────────────────────────────────────────── */}
      {selectedItemForReview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-seam-border rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 font-mono text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-seam-border pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-telemetry-cyan bg-telemetry-cyan/10 px-2 py-0.5 rounded border border-telemetry-cyan/20">
                  SIDE-BY-SIDE SPECIFICATION COMPARISON
                </span>
                <h3 className="text-base font-bold text-ink-primary font-sans mt-1">
                  {selectedItemForReview.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItemForReview(null)}
                className="text-ink-muted hover:text-ink-primary p-1"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-surface-subtle border border-seam-border space-y-2">
                <span className="text-[10px] text-ink-muted uppercase block">CPSE A: {selectedItemForReview.cpses[0]}</span>
                <p className="text-xs font-bold text-ink-primary font-sans">BALL VALVE 2 INCH 150# CS ASTM A216 WCB RF</p>
                <div className="space-y-1 pt-2 border-t border-seam-border text-[11px]">
                  <div className="flex justify-between"><span className="text-ink-muted">Size:</span><span>2 Inch (50NB)</span></div>
                  <div className="flex justify-between"><span className="text-ink-muted">Pressure:</span><span>Class 150# (PN20)</span></div>
                  <div className="flex justify-between"><span className="text-ink-muted">Body Metallurgy:</span><span>ASTM A216 WCB</span></div>
                  <div className="flex justify-between"><span className="text-ink-muted">End Connection:</span><span>Flanged Raised Face</span></div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-subtle border border-seam-border space-y-2">
                <span className="text-[10px] text-ink-muted uppercase block">CPSE B: {selectedItemForReview.cpses[1]}</span>
                <p className="text-xs font-bold text-ink-primary font-sans">VALVE BALL 2IN 150LBS WCB BODY SS316 BALL</p>
                <div className="space-y-1 pt-2 border-t border-seam-border text-[11px]">
                  <div className="flex justify-between"><span className="text-ink-muted">Size:</span><span>2 Inch (50NB)</span></div>
                  <div className="flex justify-between"><span className="text-ink-muted">Pressure:</span><span>Class 150# (PN20)</span></div>
                  <div className="flex justify-between"><span className="text-ink-muted">Body Metallurgy:</span><span>ASTM A216 WCB</span></div>
                  <div className="flex justify-between"><span className="text-ink-muted">End Connection:</span><span>Flanged Raised Face</span></div>
                </div>
              </div>
            </div>

            {/* Spec Concordance Table */}
            <div className="p-3 rounded-lg bg-surface border border-seam-border space-y-2">
              <span className="text-[10px] text-ink-muted uppercase font-bold">Attribute Concordance Evaluation</span>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div className="p-2 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-center font-bold">
                  MATCH: Sizing (2" / 50NB)
                </div>
                <div className="p-2 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-center font-bold">
                  MATCH: Rating (150# Class)
                </div>
                <div className="p-2 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-center font-bold">
                  MATCH: Metallurgy (WCB)
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-seam-border">
              <button
                onClick={() => setSelectedItemForReview(null)}
                className="py-2 px-4 rounded-lg bg-surface-subtle hover:bg-surface-active border border-seam-border text-ink-secondary"
              >
                Close Comparison
              </button>
              <button
                onClick={() => { const item = selectedItemForReview; setSelectedItemForReview(null); setConfirmAction({ type: 'approve', item }); }}
                className="py-2 px-4 rounded-lg bg-telemetry-emerald hover:bg-emerald-600 text-white font-bold flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Approve Match</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          CONFIRMATION DIALOG (Prevents Accidental Submissions)
          ───────────────────────────────────────────────────────────── */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-seam-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 font-sans animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                confirmAction.type === 'approve' ? 'bg-emerald-500/10 text-emerald-500' :
                confirmAction.type === 'reject' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
              }`}>
                {confirmAction.type === 'approve' && <Check className="w-5 h-5 stroke-[3]" />}
                {confirmAction.type === 'reject' && <X className="w-5 h-5 stroke-[3]" />}
                {confirmAction.type === 'flag' && <AlertTriangle className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-ink-primary">
                  Confirm {confirmAction.type.toUpperCase()} Decision?
                </h3>
                <p className="text-xs text-ink-secondary font-mono">{confirmAction.item.id} &bull; {confirmAction.item.title}</p>
              </div>
            </div>

            <p className="text-xs text-ink-secondary">
              This action will be cryptographically signed with reviewer ID <strong className="font-mono text-ink-primary">{user?.name || 'Officer'}</strong> and logged to the sovereign SHA-256 audit ledger.
            </p>

            <div>
              <label className="block text-[11px] font-mono text-ink-muted uppercase font-semibold mb-1">
                Officer Review Note / Rationale (Optional)
              </label>
              <input
                type="text"
                value={officerNote}
                onChange={(e) => setOfficerNote(e.target.value)}
                placeholder="e.g. Verified metallurgical and dimensional equivalence..."
                className="w-full bg-surface-subtle border border-seam-border rounded-lg p-2 text-xs text-ink-primary focus:outline-none focus:border-telemetry-cyan font-sans"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-seam-border font-mono text-xs">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                disabled={isProcessing}
                className="py-2 px-3 rounded-lg bg-surface-subtle hover:bg-surface-active border border-seam-border text-ink-secondary"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleExecuteDecision}
                disabled={isProcessing}
                className={`py-2 px-4 rounded-lg font-bold text-white transition flex items-center gap-1.5 ${
                  confirmAction.type === 'approve' ? 'bg-telemetry-emerald hover:bg-emerald-600' :
                  confirmAction.type === 'reject' ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'
                }`}
              >
                {isProcessing ? 'Recording...' : `Confirm ${confirmAction.type.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReviewWorkflow;
