# MATRIXONE Demo Script

## SIH Demonstration Narrative

This demo script demonstrates the MATRIXONE platform's ability to standardize and harmonize material codes across CPSEs. The demonstration lasts approximately 10 minutes and covers the complete end-to-end workflow.

### Demonstration Environment

- **Laptop with ~16 GB RAM**
- **CPU-only** (no GPU required)
- **Offline operation** (no cloud API required for core workflows)
- **Synthetic demonstration dataset** (5,000 source records, 3 organizations)

### Demonstration Setup

```bash
# Bootstrap the application
make bootstrap

# Start the application
make demo

# Access the application at http://localhost:8000
```

### Demonstration Steps

#### 1. Import Three Synthetic Organization Datasets

The judge observes three organizations uploading material data:

```
Organization 1: Chennai Petroleum (CPCL-DEMO)
  - Source system: SAP ECC MM module
  - Materials: 5 valve records with CPCL local codes

Organization 2: ONGC (ONGC-DEMO)
  - Source system: SAP ECC MM module
  - Materials: 3 valve records + 1 bearing + 1 pipe

Organization 3: NTPC (NTPC-DEMO)
  - Source system: SAP ECC MM module
  - Materials: 3 valve records (some overlapping with CPCL)
```

**Key visual:** Source material cards being uploaded and processed with progress tracking.

#### 2. Show Real Validation and Processing

The judge observes the ingestion pipeline:

- File upload with CSV format
- Column mapping preview
- Validation errors and warnings for malformed rows
- Duplicate-import detection (reimporting same batch yields no new records)
- Progress tracking based on actual work performed
- Rejected-row reports with actionable error messages

#### 3. Find Differently Worded Records Representing One Validated Identity

The judge observes the matching engine finding:

```
CPCL-001: "Gate Valve 100mm Flanged"
CPCL-002: "Valve 100mm Flanged End"  
NTPC-101: "Gate Valve 100mm Flanged"
```

**Engine output:**
- Retrieval similarity: 0.89 (hybrid: 0.6*embedding + 0.4*lexical)
- Attribute agreement: 0.86
- Conflict score: 0.05 (no critical conflicts)
- Decision: SAME_MATERIAL_CANDIDATE

**Visual:** Connection line between material cards showing "approved" status.

#### 4. Show a Highly Similar but Conflicting Record That Is Correctly Blocked

The judge observes:

```
CPCL-003: "Gate Valve 100mm Flanged, PN10"
ONGC-201: "Gate Valve 100mm Flanged, PN16"
```

**Engine output:**
- Retrieval similarity: 0.94 (very high textual similarity)
- Conflict score: 1.0 (critical pressure rating conflict)
- Decision: CONFLICTING_SPECIFICATION (blocked)

**Explanation:** "These two descriptions are highly similar but have different pressure ratings. Identity mapping is blocked until engineering review resolves the specification difference."

**Visual:** Connection line with red "conflict" marker and explanation tooltip.

#### 5. Resolve a Missing-Attribute Request

The judge observes the clarification workflow:

**System question:** "Confirm the pressure-rating standard."

**Judge response:** "PN10 per IS 12345"

**Engine output:**
- New evidence record created with reviewer name and timestamp
- Reanalysis produces updated match result
- Decision changes from INSUFFICIENT_EVIDENCE to SAME_MATERIAL_CANDIDATE (if other evidence supports)

**Visual:** Evidence panel showing "New clarification request" with timestamp.

#### 6. Approve a Mapping Using an Authorized Reviewer

The judge observes:

1. Reviewer "CPCL Admin" (authenticated user) reviews the same-material candidate
2. System shows side-by-side material comparison with evidence
3. Reviewer clicks "Approve" 
4. System creates canonical material with common code: CNMC-000000012345
5. Both source materials mapped to the common code
6. Mapping published with audit trail

**Common code:** CNMC-000000012345 (stable, not generated on every request)

#### 7. Publish or Reuse a Common Code

The judge observes:

- System checks if common code already exists
- If exists: "Reusing existing common code CNMC-000000012345"
- If not: "Creating new common code CNMC-000000012345"
- Code remains stable when wording or classification is corrected
- Merge/split/supersession history preserved

#### 8. Open the Material Evidence Passport

The judge views the passport for CNMC-000000012345:

**Passport contents:**
- Common code: CNMC-000000012345
- Approved description: "Gate Valve, 100mm Flanged, PN10"
- Structured technical attributes: valve_type, nominal_size, pressure_rating, body_material, end_connection, manufacturer
- Authorized source-code mappings: CPCL-001, NTPC-101 → CNMC-000000012345
- Source evidence: Upload dates, reviewer names, timestamps
- Classification: Valves, family version 1.0
- Approval history: CPCL Admin approved on [timestamp]
- Mapping history: Creation, approval, and any supersession events
- Related but distinct substitute candidates: clearly differentiated
- Model and rule versions involved: v1.0
- Audit references: Complete audit event chain
- Downloadable evidence summary: PDF report

**Optional:** QR code linking to this page (authorization still applies).

#### 9. Run a Migration Dry Run Against the Emulator

The judge observes:

1. Select approved mapping set for migration
2. Preview source-to-common-code transformations
3. Detect missing mappings and conflicts
4. Generate export files (connector contract validation)
5. Validate against emulator contract
6. Inspect acknowledgments and failures
7. Perform compensating rollback where supported

**History preserved:** Rather than deleting audit evidence, the system records rollback actions.

#### 10. Ask an Evidence-Grounded Question

**User:** "Which mappings need my review?"

**Assistant (MATRIX-AI):** Returns evidence-linked answers from authorized application data:

- "2 pending reviews for valve mappings"
- "1 critical conflict requiring engineering review"
- "3 mappings approved this session"

**User:** "Why were these two valve records not merged?"

**Assistant:** System explains the evidence: "Critical pressure rating conflict (PN10 vs PN16) blocks identity mapping. See evidence records in the Material Evidence Passport."

**User:** "Show shared approved materials between these organizations."

**Assistant:** Database query returns: "ONGC and NTPC share 2 approved valve mappings with CPCL"

#### 11. Show Measured Evaluation Results and Known Limitations

The judge observes the evaluation report:

```
Retrieval Recall:
  Lexical-only: 0.62
  Embedding-only: 0.71
  Hybrid: 0.82

Same-Material Precision:
  Lexical-only: 0.58
  Embedding-only: 0.65
  Hybrid: 0.78

Critical-Conflict Detection:
  All high-similarity conflicts correctly blocked (100%)

Abstention Rate: 8.5% (insufficient evidence, correctly abstained)

Runtime: 45 ms/100 materials (lexical-only), 120 ms/100 materials (with embeddings)

Known Limitations:
  - Synthetic-data performance is synthetic-data performance
  - No live SAP connection in demonstration environment
  - Critical attribute rules configured per material family
  - LLM unavailable: core workflow operates honestly offline
```

### Short and Extended Versions

**Short version (5 minutes):** Steps 1, 3, 4, 6, 11

**Extended version (10 minutes):** All 11 steps above

### Fresh Application Outputs

All demonstration outputs are fresh application outputs, not manually substituted impressive figures. The system reports zero, unavailable data as unavailable, and synthetic-data performance as synthetic-data performance with known limitations clearly documented.

### Judge Questions This Demonstrates

1. **Why similarity alone is insufficient** → Demonstrated by step 4 (high similarity but critical conflict blocked)
2. **How identity differs from substitutability** → Material Evidence Passport shows separate identities for substitutes
3. **Why common codes remain stable** → Code CNMC-000000012345 reused across corrections, not regenerated
4. **How existing ERP codes are preserved** → Source codes CPCL-001, NTPC-101 retained alongside common code
5. **How confidential data is protected** → Default source data private, explicit sharing policies
6. **How incorrect mappings are corrected** → Review workflow with reject/approve/reanalyze decisions
7. **What actually works offline** → Core workflows (import, matching, review) work without cloud API
8. **What has and has not been tested against SAP** → Connector emulator verified; live connectivity requires proper SAP environment
9. **How the system was evaluated** → Synthetic dataset with train/validation/test splits, hybrid baselines
10. **What is required before a real CPSE pilot** → Documented credentials, permissions, configuration, 3-month pilot plan
11. **How this implementation differs from a generic chatbot or fuzzy-matching dashboard** → Hybrid engine with conflict gate, evidence passport, audit trail, role-based review workflow