import { create } from 'zustand';
import { 
  INITIAL_STATS, 
  MOCK_MATCH_PAIRS, 
  MOCK_RAW_MATERIALS, 
  MOCK_AUDIT_LOGS,
  CPSE_PARTNERS
} from '../mockData/materials';
import { generateCNMC } from '../utils/helpers';

export const useMaterialStore = create((set, get) => ({
  stats: INITIAL_STATS,
  cpsePartners: CPSE_PARTNERS,
  matchPairs: MOCK_MATCH_PAIRS,
  activeMatchPairId: MOCK_MATCH_PAIRS[0]?.id || null,
  rawMaterials: MOCK_RAW_MATERIALS,
  auditLogs: MOCK_AUDIT_LOGS,
  mintedCNMCs: [
    {
      cnmc: 'CNMC-PETRO-VLV-44021',
      noun: 'VALVE',
      modifier: 'GATE',
      spec: 'SS316,DN50,PN138/CL800,FLANGED RF',
      unspsc: '40141602',
      hsn: '84818030',
      mappedCount: 4,
      cpses: ['CPCL', 'ONGC', 'NTPC', 'SAIL'],
      annualSavingsCr: 14.2,
      mintedAt: '2026-09-15'
    },
    {
      cnmc: 'CNMC-MECH-PMP-55104',
      noun: 'IMPELLER',
      modifier: 'PUMP,CENTRIFUGAL',
      spec: 'MONEL400,DIA450MM,CW,SHAFT65MM',
      unspsc: '40151500',
      hsn: '84139190',
      mappedCount: 2,
      cpses: ['IOCL', 'GAIL'],
      annualSavingsCr: 8.6,
      mintedAt: '2026-09-14'
    },
    {
      cnmc: 'CNMC-STEEL-PIP-10294',
      noun: 'PIPE',
      modifier: 'SEAMLESS',
      spec: 'CARBON STEEL,ASTM A106 GR B,6INCH/150NB,SCH40',
      unspsc: '40171501',
      hsn: '73041910',
      mappedCount: 3,
      cpses: ['SAIL', 'ONGC', 'BHEL'],
      annualSavingsCr: 21.5,
      mintedAt: '2026-09-12'
    }
  ],
  selectedCPSE: 'ALL',
  isIngesting: false,
  ingestionProgress: 0,

  setSelectedCPSE: (cpse) => set({ selectedCPSE: cpse }),

  setActiveMatchPair: (id) => set({ activeMatchPairId: id }),

  // Actions
  confirmMerge: (pairId) => {
    const pair = get().matchPairs.find(p => p.id === pairId);
    if (!pair) return null;

    const newCNMC = pair.proposedCNMC || generateCNMC();
    
    // Add to minted CNMCs
    const newMint = {
      cnmc: newCNMC,
      noun: 'VALVE',
      modifier: 'GATE',
      spec: pair.canonicalTitle,
      unspsc: '40141602',
      hsn: '84818030',
      mappedCount: 2,
      cpses: [pair.materialA.cpseCode, pair.materialB.cpseCode],
      annualSavingsCr: 14.2,
      mintedAt: new Date().toISOString().split('T')[0]
    };

    // Update stats
    set((state) => ({
      stats: {
        ...state.stats,
        cnmcMinted: state.stats.cnmcMinted + 1,
        crossCPSEDuplicates: state.stats.crossCPSEDuplicates + 1,
        projectedSavingsCr: Number((state.stats.projectedSavingsCr + 14.2).toFixed(1))
      },
      mintedCNMCs: [newMint, ...state.mintedCNMCs],
      matchPairs: state.matchPairs.map(p => 
        p.id === pairId ? { ...p, status: 'APPROVED', mintedCNMC: newCNMC } : p
      ),
      auditLogs: [
        {
          id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          action: 'MINT_CNMC',
          actor: 'Operations Officer (CPSE Central Command)',
          entityType: 'PAIR_MATCH',
          entityId: pairId,
          details: `Harmonized & minted sovereign code ${newCNMC} across ${pair.materialA.cpseCode} and ${pair.materialB.cpseCode}`,
          sha256: Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
          status: 'VERIFIED'
        },
        ...state.auditLogs
      ]
    }));

    return newCNMC;
  },

  rejectMatch: (pairId, reason = 'Marked Unique Catalog Item') => {
    set((state) => ({
      matchPairs: state.matchPairs.map(p => 
        p.id === pairId ? { ...p, status: 'REJECTED' } : p
      ),
      auditLogs: [
        {
          id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          action: 'REJECT_PAIR',
          actor: 'Operations Officer',
          entityType: 'PAIR_MATCH',
          entityId: pairId,
          details: `Rejected merge for pair ${pairId}. Reason: ${reason}`,
          sha256: Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
          status: 'VERIFIED'
        },
        ...state.auditLogs
      ]
    }));
  },

  escalateToReview: (pairId, notes = 'Escalated to L2 Metallurgy Governance Committee') => {
    set((state) => ({
      matchPairs: state.matchPairs.map(p => 
        p.id === pairId ? { ...p, status: 'L2_REVIEW' } : p
      ),
      auditLogs: [
        {
          id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          action: 'ESCALATE_L2',
          actor: 'Operations Officer',
          entityType: 'PAIR_MATCH',
          entityId: pairId,
          details: `Escalated pair ${pairId} to L2 Technical Review. Notes: ${notes}`,
          sha256: Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
          status: 'VERIFIED'
        },
        ...state.auditLogs
      ]
    }));
  },

  simulateIngestion: (cpseCode) => {
    set({ isIngesting: true, ingestionProgress: 10 });
    const interval = setInterval(() => {
      const current = get().ingestionProgress;
      if (current >= 100) {
        clearInterval(interval);
        set((state) => ({
          isIngesting: false,
          ingestionProgress: 100,
          stats: {
            ...state.stats,
            totalCataloged: state.stats.totalCataloged + 2450
          }
        }));
      } else {
        set({ ingestionProgress: current + 20 });
      }
    }, 400);
  },

  mintCustomCNMC: (newMint) => {
    set((state) => ({
      stats: {
        ...state.stats,
        cnmcMinted: state.stats.cnmcMinted + 1,
        projectedSavingsCr: Number((state.stats.projectedSavingsCr + (newMint.annualSavingsCr || 14.2)).toFixed(1))
      },
      mintedCNMCs: [newMint, ...state.mintedCNMCs],
      auditLogs: [
        {
          id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          action: 'MINT_CNMC',
          actor: 'Operations Officer (CPSE Central Command)',
          entityType: 'CANONICAL_MINT',
          entityId: newMint.cnmc,
          details: `Synthesized & minted sovereign code ${newMint.cnmc} for ${newMint.noun || 'MATERIAL'} (${newMint.modifier || 'STANDARD'})`,
          sha256: Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
          status: 'VERIFIED'
        },
        ...state.auditLogs
      ]
    }));
  },

  addRawMaterials: (items) => {
    set((state) => ({
      rawMaterials: [...items, ...state.rawMaterials],
      stats: {
        ...state.stats,
        totalCataloged: state.stats.totalCataloged + items.length
      }
    }));
  }
}));

