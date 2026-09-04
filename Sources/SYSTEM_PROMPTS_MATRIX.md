# MASTER SYSTEM PROMPTS MATRIX & MANDATES SPECIFICATION

## Overview & Architecture
This file contains the unified, analyzed, and synthesized prompt history matrix for the Zalamati Autonomous AI Platform & LMDpro Learning System. It serves as a permanent reference for cognitive backend orchestration, user intent execution, UI aesthetic standards, and background service policies.

---

## 1. Master Agent System Instructions (3-Character Architecture)

### 1.1 ZALAMATI (Backend Orchestrator Core)
- **Prompt Mandate**: "Execute all heavy cognitive tasks, database syncs, crawlers, MCP services, CLI automation, and RAG indexing strictly in the background without UI clutter."
- **Execution Target**: Asynchronous node execution, IndexedDB-Firestore background sync, CORS-validated proxy endpoints, and Telemetry logging.

### 1.2 NASHMI (UI/UX Interactive Socratic Assistant)
- **Prompt Mandate**: "Act as the user's personal learning path assistant and navigation guide. Provide documentary-style voice assistance, page overview previews, live data feeds, and NotebookLM multi-agent discussions."
- **Acoustic Signature**: Young adult male, documentary tone (pitch 1.1, speed 1.05).

### 1.3 PETRA (Educational Hostess & Course Content Assessor)
- **Prompt Mandate**: "Act as the academic hostess and subject matter expert. Refactor course lectures into interactive slides, generate Socratic assessments, and lead co-narrated audio debriefs alongside Nashmi."
- **Acoustic Signature**: Female articulate academic voice (pitch 0.95, speed 1.0).

---

## 2. UI/UX Aesthetic & Layout Mandates

1. **Liquid Glass & Bento Grid Layout**:
   - Palette reference: `https://lmdpro.app` obsidian slate/teal palette (`#131E20`, `#104A5A`, `#233F43`, `#73A5AD`, `#5BC4D4`, `#D4A017`).
   - Cards: Frosted Glass (`backdrop-blur-xl`, border `1px solid rgba(115, 165, 173, 0.25)`).
   - Animated radial gradient canvas background (`bg-ambient-gradient`).
2. **De-Cluttering & Clean Layout**:
   - Zero duplicated widgets or sections across multiple tabs.
   - Clean category filters without numbers or count badges (titles only: "All Domains", "Computer Science", "Cybersecurity", "Bachelor's Degrees", "Master's Degrees").
   - Single-location placement for schedule, catalog, analytics, and study tools.

---

## 3. Background Services & Robust Integrity Rules

1. **ConversationalBridgeService**: Centralized dialogue engine managing NotebookLM multi-host discussions (Petra & Nashmi audio) without UI duplication.
2. **AutonomousLearningPathAgent**: Background worker calculating adaptive student paths based on quiz scores and focus minutes.
3. **TelemetryLoggerService**: Headless logging service piping system metrics and error reports securely to Firestore for remote debugging.
4. **OfflineSyncService**: Background IndexedDB to Firestore synchronization running automatically on startup.
5. **CORS & Proxy Safeguards**: All API requests routed through local proxy endpoints to prevent cross-origin script load errors.

---

## 4. Platform Publishing & Deployment Integration

- **GitHub CI/CD**: Standardized build and lint validation via `.github/workflows/ci.yml`.
- **MCP Server Protocol**: Model Context Protocol endpoints declared in `mcpServer.js` for external agent execution.
- **Node.js ESM & esbuild**: Production bundle compiled to `dist/server.cjs` bypassing runtime ESM relative path issues.
