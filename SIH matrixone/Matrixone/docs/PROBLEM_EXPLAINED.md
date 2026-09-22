# Problem Explained

## Problem Statement ID: 26099

**Title:** AI-Driven Standardization and Harmonization of Material Codes Across CPSEs

**Organization:** Ministry of Petroleum & Natural Gas

**Department:** Chennai Petroleum Corporation Limited (CPCL)

**Category:** Software

**Theme:** Smart Automation

### The Problem

Different Central Public Sector Enterprises (CPSEs) maintain their own SAP/ERP material masters. The same underlying material can have different:

- **Local material codes** - e.g., CPCL-001, ONGC-201, NTPC-101 for the same valve
- **Descriptions and abbreviations** - "Gate Valve 100mm Flanged" vs "Valve 100mm Flanged End"
- **Technical specifications** - pressure ratings, body materials, connection types
- **Units of measurement** - mm, inches, nominal size, actual diameter
- **Classifications** - different classification systems across enterprises
- **Manufacturer and part-number representations** - different part numbering schemes

Conversely, two descriptions can look almost identical while referring to technically different materials (e.g., different pressure ratings or material grades).

### The Solution: MATRIXONE

MATRIXONE helps CPSEs agree on which materials are genuinely the same, understand which are merely similar, and maintain a trustworthy common identity without losing their existing ERP references.

**Tagline:** "One Nation. One Material Identity. Every Decision Traceable."

### Key Principles

1. **Correct material identification and prevention of unsafe merges** - Similarity alone must never override critical attribute conflicts
2. **Traceability, authorization, and trustworthy data** - Every decision must be traceable to an authorized reviewer
3. **A complete, persistent, end-to-end workflow** - From import through matching to publication
4. **Measurable AI performance and explainability** - Evaluated with proper train/validation/test splits
5. **Exceptional usability and purposeful visual polish** - Enterprise-grade command center
6. **Additional features only after the core works** - No decorative features without substance

### Non-Negotiable Engineering Rules

- Implement actual functionality behind every enabled UI action
- Do not leave `TODO`, `pass`, empty handlers, or fake implementations
- Do not silently substitute mock results when an API, model, or database fails
- Never invent accuracy, savings, customer counts, deployment scale, or processing statistics
- Show zero as zero. Show unavailable data as unavailable.
- Label synthetic datasets and simulated integrations clearly
- Do not describe a SAP emulator as a live SAP connection
- Do not use similarity scores as proof of engineering interchangeability
- Do not expose secrets in frontend bundles, repositories, logs, or screenshots
- Do not assume access to proprietary CPSE data or licensed standards
- Do not claim government endorsement or official approval
- Do not use `COUNT(*) + 1` for identifier generation
- Do not recycle deprecated codes
- Preserve merge, split, replacement, and supersession history

### Product Positioning

> MATRIXONE helps CPSEs agree on which materials are genuinely the same, understand which are merely similar, and maintain a trustworthy common identity without losing their existing ERP references.

The system implements a hybrid entity-resolution pipeline that combines lexical/fuzzy matching with embedding-based semantic similarity, enforced with critical attribute conflict detection to prevent unsafe merges.