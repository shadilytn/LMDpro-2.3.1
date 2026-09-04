# Unified Technical System Specification: Autonomous Agentic AI Framework (Zalamati-Nashmi-Petra Stack)

This specification defines the runtime architectures, multi-character state definitions, mathematical coordinate parameterization, operational security boundaries, and frame-accurate synchronization standards for the Nexus and LMDpro multi-agent ecosystem.

---

## 1. Multi-Character Agentic Orchestration Loop

The platform implements a three-character agentic swarm (Zalamati, Nashmi, Petra) to decouple reasoning from presentation.

---

## 2. Infrastructure Layout & Model Stratification

| Model Identifier | Primary Workspace Profile | Context Window | Native Logic Configuration | Target Tasks |
| :--- | :--- | :--- | :--- | :--- |
| **`gemini-3.6-flash`** | High-Frequency Micro-Agent | 1,000,000 / 65k | `MEDIUM` (Default) | Long-horizon coding tasks, Terminal-Bench execution, unified tool usage. |
| **`gemini-3.5-flash-lite`** | Low-Latency High-Volume Ingestion | 1,000,000 / 64k | `MINIMAL` | DOM parsing, feature extraction, routing, classification. |
| **`gemini-3.1-pro-preview`** | Strategic Logic Coordinator | 1,000,000 / 64k | `HIGH` (Deep reasoning) | Complex mathematics, Abstract Syntax Tree compilation, structural mapping. |
| **`gemini-3-pro-image`** | Native Visual Engine | 65k / 32k | N/A | High-fidelity image and diagram generation, visual assets. |

---

## 3. Strict Reasoning Response Format & Parsed Layout

To ensure client-side loggers and UI streams parse incoming tokens instantaneously, models force structured outputs using uppercase markers:
- Component A: `[DECISION] BUY`, `[DECISION] SELL`, or `[DECISION] HOLD`
- Component B: Quantitative Logic (technical signals & indicators analyzed)
- Component C: Action Target Mapping (coordinates & selectors)

---

## 4. Operational Security & AST Validation Harness

All agent-generated scripts for Blender MCP or Pyodide execution pass through static analysis using Python's `ast` module (`SafeCodeValidator`) before execution in sandboxed namespaces.

---

## 5. Liquid Glass Design Tokens & Global Dark Theme

CSS Token Variables:
```css
:root {
  --color-dark-bg: #131E20;
  --color-teal-deep: #104A5A;
  --color-teal-mid: #233F43;
  --color-teal-light: #73A5AD;
  --color-accent-cyan: #5BC4D4;
  --color-accent-gold: #D4A017;
  --grad-primary: linear-gradient(135deg, #73A5AD, #233F43);
  --grad-secondary: linear-gradient(135deg, #104A5A, #73A5AD);
  --grad-dark-canvas: linear-gradient(135deg, #131E20, #104A5A);
  --glass-background: rgba(19, 30, 32, 0.72);
  --glass-border: 1px solid rgba(115, 165, 173, 0.25);
  --glass-blur: blur(20px) saturate(160%);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```
