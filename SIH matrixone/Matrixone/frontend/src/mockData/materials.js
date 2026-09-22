/**
 * Sovereign Master Datasets for MATRIXONE (SIH 2026 PS ID: 26099)
 * Real CPSE item records across CPCL, ONGC, NTPC, SAIL
 */

export const INITIAL_STATS = {
  totalCataloged: 1248590,
  crossCPSEDuplicates: 412300,
  duplicatePercentage: 33.0,
  cnmcMinted: 186420,
  projectedSavingsCr: 4820.5,
  activeNodes: 12,
  syncLatencyMs: 12,
  ingestionRatePerSec: 1850
};

export const CPSE_PARTNERS = [
  { id: 'CPCL', name: 'Chennai Petroleum Corporation Ltd', sector: 'Refinery & Petrochem', erp: 'SAP S/4HANA', status: 'ONLINE', latency: '12ms', itemsCount: 184500, duplicateRate: '34.2%' },
  { id: 'ONGC', name: 'Oil and Natural Gas Corporation', sector: 'Upstream Oil & Gas', erp: 'SAP ECC 6.0', status: 'ONLINE', latency: '14ms', itemsCount: 342000, duplicateRate: '38.6%' },
  { id: 'NTPC', name: 'NTPC Limited', sector: 'Power Generation', erp: 'SAP ERP 6.0', status: 'ONLINE', latency: '11ms', itemsCount: 298000, duplicateRate: '29.4%' },
  { id: 'SAIL', name: 'Steel Authority of India Ltd', sector: 'Metals & Mining', erp: 'Oracle EBS / Baan', status: 'ONLINE', latency: '15ms', itemsCount: 254000, duplicateRate: '31.8%' },
  { id: 'IOCL', name: 'Indian Oil Corporation Ltd', sector: 'Downstream Refining', erp: 'SAP S/4HANA', status: 'ONLINE', latency: '10ms', itemsCount: 389000, duplicateRate: '41.1%' },
  { id: 'GAIL', name: 'GAIL (India) Limited', sector: 'Gas Transmission', erp: 'SAP ERP', status: 'ONLINE', latency: '13ms', itemsCount: 145000, duplicateRate: '27.5%' },
  { id: 'BHEL', name: 'Bharat Heavy Electricals Ltd', sector: 'Heavy Engineering', erp: 'SAP ERP', status: 'ONLINE', latency: '16ms', itemsCount: 210000, duplicateRate: '33.5%' }
];

export const DUPLICATE_HEATMAP_DATA = [
  { cpse1: 'ONGC', cpse2: 'CPCL', overlap: 48.2, duplicateCount: 34200, potentialSavingsCr: 420 },
  { cpse1: 'IOCL', cpse2: 'CPCL', overlap: 52.1, duplicateCount: 46800, potentialSavingsCr: 580 },
  { cpse1: 'NTPC', cpse2: 'SAIL', overlap: 39.5, duplicateCount: 28900, potentialSavingsCr: 340 },
  { cpse1: 'ONGC', cpse2: 'GAIL', overlap: 46.1, duplicateCount: 24100, potentialSavingsCr: 295 },
  { cpse1: 'SAIL', cpse2: 'BHEL', overlap: 41.8, duplicateCount: 31500, potentialSavingsCr: 390 },
  { cpse1: 'IOCL', cpse2: 'ONGC', overlap: 49.7, duplicateCount: 51200, potentialSavingsCr: 640 },
  { cpse1: 'NTPC', cpse2: 'BHEL', overlap: 44.3, duplicateCount: 33400, potentialSavingsCr: 410 },
  { cpse1: 'GAIL', cpse2: 'IOCL', overlap: 37.8, duplicateCount: 21900, potentialSavingsCr: 260 }
];

export const MATERIAL_FLOW_STAGES = [
  { stage: '1. Raw ERP Ingestion', count: 1248590, drop: '0%', rate: '1,850 rec/s', desc: 'Ingested raw legacy material catalogs from 12 CPSEs' },
  { stage: '2. Normalization & Cleansing', count: 1085200, drop: '-13.1%', rate: '1,620 rec/s', desc: 'Token regex cleansing, casing, stopword stripping' },
  { stage: '3. Hybrid Vector Clustered', count: 640000, drop: '-41.0%', rate: '1,200 rec/s', desc: 'BERT 384-dim domain embeddings & nearest neighbors' },
  { stage: '4. Verified Duplicate Pairs', count: 412300, drop: '-35.6%', rate: '940 rec/s', desc: 'Levenshtein + technical parameter spec reconciliation' },
  { stage: '5. Minted National CNMC', count: 186420, drop: '-54.8%', rate: '520 rec/s', desc: 'Canonical sovereign codes minted to master ledger' }
];

export const PROCUREMENT_DISPARITIES = [
  {
    itemTitle: 'Gate Valve SS316 DN50 Class 800 Flanged RF',
    category: 'Valves',
    benchmarkPrice: 18400,
    disparities: [
      { cpse: 'ONGC', price: 18400, qty: 1080, totalSpend: 19872000 },
      { cpse: 'NTPC', price: 21200, qty: 640, totalSpend: 13568000 },
      { cpse: 'CPCL', price: 24800, qty: 340, totalSpend: 8432000 }
    ],
    maxVariancePercent: 34.8,
    potentialSavingsCr: 14.2
  },
  {
    itemTitle: 'Centrifugal Pump Impeller Monel 400 (450mm Dia)',
    category: 'Pumps & Rotating',
    benchmarkPrice: 142000,
    disparities: [
      { cpse: 'IOCL', price: 142000, qty: 85, totalSpend: 12070000 },
      { cpse: 'CPCL', price: 168000, qty: 42, totalSpend: 7056000 },
      { cpse: 'GAIL', price: 188000, qty: 60, totalSpend: 11280000 }
    ],
    maxVariancePercent: 32.4,
    potentialSavingsCr: 8.6
  },
  {
    itemTitle: 'Seamless Carbon Steel Pipe ASTM A106 Gr B 6" SCH 40',
    category: 'Piping',
    benchmarkPrice: 4200,
    disparities: [
      { cpse: 'SAIL', price: 4200, qty: 15000, totalSpend: 63000000 },
      { cpse: 'ONGC', price: 4850, qty: 22000, totalSpend: 106700000 },
      { cpse: 'BHEL', price: 5600, qty: 12000, totalSpend: 67200000 }
    ],
    maxVariancePercent: 33.3,
    potentialSavingsCr: 21.5
  }
];

export const MOCK_MATCH_PAIRS = [
  {
    id: 'MP-26099-8942',
    cluster: 'Valves, Flanges & High-Pressure Fluid Handling (DN50)',
    confidenceScore: 96.2,
    semanticScore: 97.4,
    fuzzyScore: 94.8,
    attributeScore: 96.0,
    matchType: 'IDENTICAL',
    status: 'PENDING',
    reasoning: 'High semantic and physical equivalence detected. CPCL uses Imperial (2 INCH 800#) while ONGC uses Metric (DN50 CL800). Metallurgy ASTM A182 F316 is the forged standard equivalent of wrought SS316. Zero functional divergence.',
    proposedCNMC: 'CNMC-PETRO-VLV-44021',
    canonicalTitle: 'VALVE,GATE,SS316,DN50,PN138/CL800,FLANGED RF',
    materialA: {
      cpseCode: 'CPCL',
      plant: 'Manali Refinery, Chennai',
      erpCode: 'CPCL-MAT-042891',
      erpSystem: 'SAP S/4HANA',
      rawDescription: 'VALVE GATE 2 INCH 800# SS316 RF',
      materialGroup: '44-VALVES-GATE-HP',
      uom: 'NOS',
      unitPrice: 24800,
      stockOnHand: 340,
      specs: {
        nominalBore: '2 Inch',
        pressureClass: '800#',
        materialGrade: 'SS316',
        endConnection: 'RF (Raised Face)',
        valveType: 'GATE',
        standard: 'ASME B16.34',
        trim: 'SS316 Trim'
      }
    },
    materialB: {
      cpseCode: 'ONGC',
      plant: 'Mumbai High Offshore Platform',
      erpCode: 'ONGC-MAT-78902',
      erpSystem: 'SAP ECC 6.0',
      rawDescription: 'GATE VLV DN50 CL800 FLANGED ASTM A182 F316',
      materialGroup: 'MECH-VALVE-FORGED-SS',
      uom: 'EA',
      unitPrice: 18400,
      stockOnHand: 1080,
      specs: {
        nominalBore: 'DN50 (50mm)',
        pressureClass: 'CL800 (Class 800)',
        materialGrade: 'ASTM A182 F316',
        endConnection: 'FLANGED (Raised Face RF)',
        valveType: 'GATE VLV',
        standard: 'API 602 / BS 5352',
        trim: 'Stellite Trim 10'
      }
    },
    specComparison: [
      { attribute: 'Nominal Bore (NB)', valA: '2 Inch', valB: 'DN50 (50mm)', match: true, note: '100% Identical (Metric/Imperial Eqv)' },
      { attribute: 'Pressure Rating', valA: '800#', valB: 'CL800', match: true, note: '100% Identical' },
      { attribute: 'Material Grade (MOC)', valA: 'SS316', valB: 'ASTM A182 F316', match: true, note: '98% Compliant (Forged/Wrought Eqv)' },
      { attribute: 'End Connection', valA: 'RF (Raised Face)', valB: 'FLANGED RF', match: true, note: '96% Match' },
      { attribute: 'Valve Type', valA: 'GATE', valB: 'GATE VLV', match: true, note: '100% Exact' },
      { attribute: 'Governing Standard', valA: 'ASME B16.34', valB: 'API 602 / BS 5352', match: true, note: '95% Harmonized' },
      { attribute: 'Trim Metallurgy', valA: 'SS316 Trim', valB: 'Stellite Trim 10', match: false, note: 'Trim Variant (+2% cost delta, compatible)' }
    ]
  },
  {
    id: 'MP-26099-8943',
    cluster: 'Rotary Pumps & Impellers (Alloy Metallurgy)',
    confidenceScore: 94.4,
    semanticScore: 96.1,
    fuzzyScore: 92.5,
    attributeScore: 94.0,
    matchType: 'NEAR_DUPLICATE',
    status: 'PENDING',
    reasoning: 'Impeller dimensions and metallurgy Monel 400 match across IOCL and GAIL. IOCL lists metric 450mm diameter while GAIL lists 17.7 inch. Keyway dimensions identical.',
    proposedCNMC: 'CNMC-MECH-PMP-55104',
    canonicalTitle: 'IMPELLER,PUMP,CENTRIFUGAL,MONEL400,DIA450MM,CW',
    materialA: {
      cpseCode: 'IOCL',
      plant: 'Paradip Refinery',
      erpCode: 'IOCL-PMP-11092',
      erpSystem: 'SAP S/4HANA',
      rawDescription: 'CENTRIFUGAL PUMP IMPELLER MONEL 400 DIA 450MM',
      materialGroup: 'PUMP-ROTARY-IMP',
      uom: 'NOS',
      unitPrice: 142000,
      stockOnHand: 85,
      specs: {
        diameter: '450mm',
        metallurgy: 'Monel 400',
        rotation: 'Clockwise (CW)',
        shaftDia: '65mm',
        vanesCount: '6'
      }
    },
    materialB: {
      cpseCode: 'GAIL',
      plant: 'Vijaipur Gas Processing Plant',
      erpCode: 'GAIL-ROT-40911',
      erpSystem: 'SAP ERP',
      rawDescription: 'IMPELLER PUMP CENTR MNL-400 17.7INCH CW ROT',
      materialGroup: 'ROTATING-SPARES',
      uom: 'EA',
      unitPrice: 188000,
      stockOnHand: 60,
      specs: {
        diameter: '17.7 Inch (449.6mm)',
        metallurgy: 'MNL-400 (Monel 400)',
        rotation: 'CW',
        shaftDia: '65mm',
        vanesCount: '6'
      }
    },
    specComparison: [
      { attribute: 'Diameter', valA: '450mm', valB: '17.7 Inch (~450mm)', match: true, note: '100% Metric/Imperial match' },
      { attribute: 'Metallurgy', valA: 'Monel 400', valB: 'MNL-400', match: true, note: '100% Alloy Match' },
      { attribute: 'Rotation', valA: 'CW', valB: 'CW', match: true, note: 'Identical' },
      { attribute: 'Shaft Bore', valA: '65mm', valB: '65mm', match: true, note: 'Identical' }
    ]
  },
  {
    id: 'MP-26099-8944',
    cluster: 'High-Temperature Seamless Piping Spares',
    confidenceScore: 95.8,
    semanticScore: 98.0,
    fuzzyScore: 93.2,
    attributeScore: 96.5,
    matchType: 'IDENTICAL',
    status: 'PENDING',
    reasoning: 'Standard carbon steel seamless pipe ASTM A106 Grade B. 6 inch Nominal Bore is 150 NB. Schedule 40 standard wall thickness. Inter-CPSE procurement rate disparity is 33.3%.',
    proposedCNMC: 'CNMC-STEEL-PIP-10294',
    canonicalTitle: 'PIPE,SEAMLESS,CARBON STEEL,ASTM A106 GR B,6INCH/150NB,SCH40',
    materialA: {
      cpseCode: 'SAIL',
      plant: 'Bhilai Steel Plant',
      erpCode: 'SAIL-PIP-77312',
      erpSystem: 'Oracle EBS',
      rawDescription: 'SEAMLESS CS PIPE ASTM A106 GR B 6 INCH SCH 40',
      materialGroup: 'PIPE-SEAMLESS-CS',
      uom: 'MTR',
      unitPrice: 4200,
      stockOnHand: 15000,
      specs: {
        pipeType: 'Seamless',
        material: 'ASTM A106 Gr B',
        nominalSize: '6 Inch',
        schedule: 'SCH 40',
        length: '6 Meter Standard'
      }
    },
    materialB: {
      cpseCode: 'BHEL',
      plant: 'Tiruchirappalli Boiler Aux Plant',
      erpCode: 'BHEL-MAT-30981',
      erpSystem: 'SAP ERP',
      rawDescription: 'PIPE CS SMLS 150NB SCH40 A106-B 6M',
      materialGroup: 'PIPING-BOILER',
      uom: 'MTR',
      unitPrice: 5600,
      stockOnHand: 12000,
      specs: {
        pipeType: 'SMLS (Seamless)',
        material: 'A106-B',
        nominalSize: '150 NB',
        schedule: 'SCH 40',
        length: '6M'
      }
    },
    specComparison: [
      { attribute: 'Material Grade', valA: 'ASTM A106 Gr B', valB: 'A106-B', match: true, note: '100% Exact Standard' },
      { attribute: 'Nominal Bore', valA: '6 Inch', valB: '150 NB', match: true, note: '100% Equivalent' },
      { attribute: 'Schedule/Wall', valA: 'SCH 40', valB: 'SCH40', match: true, note: '100% Exact' },
      { attribute: 'Type', valA: 'Seamless', valB: 'SMLS', match: true, note: '100% Exact' }
    ]
  },
  {
    id: 'MP-26099-8945',
    cluster: 'Sealing Elements & Spiral Wound Gaskets',
    confidenceScore: 91.2,
    semanticScore: 93.0,
    fuzzyScore: 89.0,
    attributeScore: 92.0,
    matchType: 'NEAR_DUPLICATE',
    status: 'PENDING',
    reasoning: 'Spiral wound gasket with graphite filler, 4 inch (DN100) Class 300. Minor notation differences between NTPC and IOCL.',
    proposedCNMC: 'CNMC-SEAL-GSK-33821',
    canonicalTitle: 'GASKET,SPIRAL WOUND,SS316/GRAPHITE,DN100/4INCH,CL300',
    materialA: {
      cpseCode: 'NTPC',
      plant: 'Ramagundam Super Thermal Power Station',
      erpCode: 'NTPC-GSK-88120',
      erpSystem: 'SAP ERP',
      rawDescription: 'SPIRAL WOUND GASKET 4 INCH 300# GRAPHITE FILLER SS316',
      materialGroup: 'GASKET-SW',
      uom: 'NOS',
      unitPrice: 850,
      stockOnHand: 2400,
      specs: {
        type: 'Spiral Wound',
        size: '4 Inch',
        rating: '300#',
        winding: 'SS316',
        filler: 'Flexible Graphite'
      }
    },
    materialB: {
      cpseCode: 'IOCL',
      plant: 'Mathura Refinery',
      erpCode: 'IOCL-GSK-00912',
      erpSystem: 'SAP S/4HANA',
      rawDescription: 'GASKET SP WOUND CL300 DN100 CS/GRAPHITE/SS316 INNER',
      materialGroup: 'STATIC-SEALS',
      uom: 'EA',
      unitPrice: 940,
      stockOnHand: 1800,
      specs: {
        type: 'SP WOUND',
        size: 'DN100',
        rating: 'CL300',
        winding: 'SS316 with Inner Ring',
        filler: 'Graphite'
      }
    },
    specComparison: [
      { attribute: 'Gasket Type', valA: 'Spiral Wound', valB: 'SP WOUND', match: true, note: '100% Equivalent' },
      { attribute: 'Size', valA: '4 Inch', valB: 'DN100', match: true, note: '100% Equivalent' },
      { attribute: 'Pressure Class', valA: '300#', valB: 'CL300', match: true, note: '100% Equivalent' },
      { attribute: 'Inner Ring Config', valA: 'Standard Winding', valB: 'Inner Ring Added', match: false, note: 'Inner Ring Variant (+10% cost delta)' }
    ]
  }
];

export const MOCK_AUDIT_LOGS = [
  {
    id: 'AUD-99812',
    timestamp: '2026-09-15 18:24:02 UTC',
    action: 'AUTO_HARMONIZE',
    actor: 'Bharat-MatVector Engine v3.4',
    entityType: 'PAIR_MATCH',
    entityId: 'MP-26099-8942',
    details: 'Federated CPCL valve CPCL-MAT-042891 with ONGC valve ONGC-MAT-78902. Composite score 96.2%.',
    sha256: '9f8a3c8e42b107e3810f5462837bc991a0df914e6b2c89f5a0134a6e038db4f1',
    status: 'VERIFIED'
  },
  {
    id: 'AUD-99811',
    timestamp: '2026-09-15 18:19:40 UTC',
    action: 'MINT_CNMC',
    actor: 'Dr. S. K. Sharma (MoPNG National Master Authority)',
    entityType: 'CNMC_REGISTRY',
    entityId: 'CNMC-PETRO-VLV-44021',
    details: 'Minted sovereign CNMC code for DN50 Class 800 Gate Valve. Broadcasted to GeM procurement pipeline.',
    sha256: 'a12b489f0714c6e28f3a9e10842db17c80ef4219b3a561c7e9014b2d6a78f302',
    status: 'VERIFIED'
  },
  {
    id: 'AUD-99810',
    timestamp: '2026-09-15 18:12:15 UTC',
    action: 'INGEST_BATCH',
    actor: 'CPCL Automated Data Gateway',
    entityType: 'INGESTION_JOB',
    entityId: 'JOB-CPCL-2026-09-BATCH4',
    details: 'Ingested 28,400 raw material lines from SAP S/4HANA. Parsed 99.8% cleanly.',
    sha256: 'c37a19e830b42f15d78a9c2014ef83b5190ad364c718b209e56f4a812b07e934',
    status: 'VERIFIED'
  },
  {
    id: 'AUD-99809',
    timestamp: '2026-09-15 17:58:33 UTC',
    action: 'HITL_OVERRIDE',
    actor: 'Metallurgy Lead (NTPC Corporate HQ)',
    entityType: 'SPEC_RECONCILIATION',
    entityId: 'MP-26099-8938',
    details: 'Overrode Stellite Trim discrepancy for high temperature boiler gasket assembly.',
    sha256: '8b7f21a49e03d5c6b81a7f042e93b16c50ef2849a1d357e8f4026b9a8c17e450',
    status: 'VERIFIED'
  }
];

export const MOCK_RAW_MATERIALS = [
  { id: 'RM-101', cpse: 'CPCL', code: 'CPCL-MAT-042891', desc: 'VALVE GATE 2 INCH 800# SS316 RF', uom: 'NOS', price: 24800, stock: 340, category: 'Valves', status: 'MATCHED' },
  { id: 'RM-102', cpse: 'ONGC', code: 'ONGC-MAT-78902', desc: 'GATE VLV DN50 CL800 FLANGED ASTM A182 F316', uom: 'EA', price: 18400, stock: 1080, category: 'Valves', status: 'MATCHED' },
  { id: 'RM-103', cpse: 'NTPC', code: 'NTPC-MAT-30988', desc: '50MM GATE VALVE SS316 CLASS 800 RF TRIM 10', uom: 'NOS', price: 21200, stock: 640, category: 'Valves', status: 'PENDING_MATCH' },
  { id: 'RM-104', cpse: 'SAIL', code: 'SAIL-MAT-99812', desc: 'SS316 GATE VALVE 50 NB CL-800 FLG', uom: 'PC', price: 22000, stock: 290, category: 'Valves', status: 'PENDING_MATCH' },
  { id: 'RM-105', cpse: 'IOCL', code: 'IOCL-PMP-11092', desc: 'CENTRIFUGAL PUMP IMPELLER MONEL 400 DIA 450MM', uom: 'NOS', price: 142000, stock: 85, category: 'Pumps', status: 'MATCHED' },
  { id: 'RM-106', cpse: 'GAIL', code: 'GAIL-ROT-40911', desc: 'IMPELLER PUMP CENTR MNL-400 17.7INCH CW ROT', uom: 'EA', price: 188000, stock: 60, category: 'Pumps', status: 'MATCHED' },
  { id: 'RM-107', cpse: 'SAIL', code: 'SAIL-PIP-77312', desc: 'SEAMLESS CS PIPE ASTM A106 GR B 6 INCH SCH 40', uom: 'MTR', price: 4200, stock: 15000, category: 'Piping', status: 'MATCHED' },
  { id: 'RM-108', cpse: 'BHEL', code: 'BHEL-MAT-30981', desc: 'PIPE CS SMLS 150NB SCH40 A106-B 6M', uom: 'MTR', price: 5600, stock: 12000, category: 'Piping', status: 'MATCHED' },
  { id: 'RM-109', cpse: 'NTPC', code: 'NTPC-GSK-88120', desc: 'SPIRAL WOUND GASKET 4 INCH 300# GRAPHITE FILLER SS316', uom: 'NOS', price: 850, stock: 2400, category: 'Gaskets', status: 'MATCHED' },
  { id: 'RM-110', cpse: 'IOCL', code: 'IOCL-GSK-00912', desc: 'GASKET SP WOUND CL300 DN100 CS/GRAPHITE/SS316 INNER', uom: 'EA', price: 940, stock: 1800, category: 'Gaskets', status: 'MATCHED' }
];
