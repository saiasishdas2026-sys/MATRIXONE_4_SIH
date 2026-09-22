import { create } from 'zustand';

export const useWorkflowStore = create((set, get) => ({
  activeTab: 'L1_VERIFICATION', // 'L1_VERIFICATION' | 'L2_CPSE_APPROVAL' | 'L3_NATIONAL_MASTER' | 'COMPLETED'
  queueItems: [
    {
      id: 'WF-1092',
      pairId: 'MP-26099-8942',
      title: 'DN50 Gate Valve Class 800 Harmonization',
      cpses: ['CPCL', 'ONGC'],
      stage: 'L1_VERIFICATION',
      confidence: 96.2,
      submittedBy: 'Bharat-MatVector Engine v3.4',
      assignedTo: 'S. K. Verma (L1 Engineering Analyst)',
      dateSubmitted: '2026-09-15 17:30',
      priority: 'HIGH',
      status: 'PENDING_APPROVAL'
    },
    {
      id: 'WF-1093',
      pairId: 'MP-26099-8943',
      title: 'Monel 400 Pump Impeller Divergence Triage',
      cpses: ['IOCL', 'GAIL'],
      stage: 'L2_CPSE_APPROVAL',
      confidence: 94.4,
      submittedBy: 'IOCL Refinery Data Unit',
      assignedTo: 'Dr. M. Ramanathan (Chief Metallurgist, IOCL)',
      dateSubmitted: '2026-09-14 14:15',
      priority: 'MEDIUM',
      status: 'IN_REVIEW'
    },
    {
      id: 'WF-1094',
      pairId: 'MP-26099-8944',
      title: 'Carbon Steel Seamless Pipe ASTM A106 Gr B',
      cpses: ['SAIL', 'BHEL'],
      stage: 'L3_NATIONAL_MASTER',
      confidence: 95.8,
      submittedBy: 'SAIL Central Procurement Board',
      assignedTo: 'National Master Data Authority (MoPNG)',
      dateSubmitted: '2026-09-13 09:45',
      priority: 'CRITICAL',
      status: 'AWAITING_NATIONAL_MINT'
    }
  ],

  setActiveTab: (tab) => set({ activeTab: tab }),

  approveWorkflowItem: (id, note = 'Approved by authorized officer') => {
    set((state) => ({
      queueItems: state.queueItems.map((item) => {
        if (item.id === id) {
          if (item.stage === 'L1_VERIFICATION') {
            return { ...item, stage: 'L2_CPSE_APPROVAL', status: 'IN_REVIEW', note };
          }
          if (item.stage === 'L2_CPSE_APPROVAL') {
            return { ...item, stage: 'L3_NATIONAL_MASTER', status: 'AWAITING_NATIONAL_MINT', note };
          }
          return { ...item, stage: 'COMPLETED', status: 'MINTED_SOVEREIGN_CODE', note };
        }
        return item;
      })
    }));
  },

  rejectWorkflowItem: (id, reason = 'Technical specifications mismatch') => {
    set((state) => ({
      queueItems: state.queueItems.map((item) => 
        item.id === id ? { ...item, status: 'REJECTED', reason } : item
      )
    }));
  }
}));
