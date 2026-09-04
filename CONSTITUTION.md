# SPEC-KIT CONSTITUTION: Zalamati Autonomous AI Agent Ecosystem & LMDpro

This Constitution serves as the immutable system prompt, style guide, and architectural contract for all Spec-Driven Development (SDD) processes. Every automated feature, agent action, and code generation loop is bound by the guidelines declared herein.

---

## 1. Prime Directive of Design: "Liquid Glass" Dark Mode

To prevent arbitrary layouts and aesthetic drift (known as "AI Slop"), all interface components must strictly use the unified **Black Theme / Liquid Glass** token engine:

- **Base Canvas**: Deep slate-black gradient (`#0c1a24` to `#08151c`).
- **Frosted Panels**: Frosted translucent surface controls with dynamic background blurs:
  - `backdrop-filter: blur(20px) saturate(160%);`
  - `background: rgba(19, 30, 32, 0.72);`
  - `border: 1px solid rgba(115, 165, 173, 0.25);`
- **Contrast Accents**: Neon Cyan (`#22d3ee` / `#5BC4D4`) for interactive triggers, Emerald (`#34d399`) for positive indicators, and Amber/Gold (`#f59e0b` / `#D4A017`) for active focal elements and certifications.
- **Rhythmic Negative Space**: Clean margins, balanced paddings (outer container padding $\ge$ inner child padding), and typography pairings (Playfair Display for headers, Plus Jakarta Sans for body).

---

## 2. Triadic Swarm Agent Specification

The platform utilizes a stateful, triadic directed graph loop to separate cognitive reasoning from visual presentation:

1. **ZALAMATI (The Backend Orchestrator)**:
   - *Role*: SRE-oriented background coordinator.
   - *Tasks*: File system maintenance, database synchronization, learning path math calculations, and static AST security auditing.
   - *Design Principle*: Non-visual, fully integrated backend-first operations.
2. **NASHMI (The UI/UX Assistant)**:
   - *Role*: Human-Computer Interface Guide.
   - *Tasks*: Active page analysis, step-by-step navigation help, and personalized dashboard widget customizing.
   - *Voice*: Young, calm, comfortable male-voice documentary cadence.
3. **PETRA (The Educational Hostess & Teacher)**:
   - *Role*: Pedagogical expert, live course dialogue, and interactive presentation host.
   - *Tasks*: Content restructuring, socratic reviews, quiz/exam generation, and vector-motion learning presentations.
   - *Voice*: Dynamic, authoritative, and engaging female-voice educator.

---

## 3. Bulletproof JSON API Contracts

To ensure uninterrupted API telemetry:
- **Zero-Trust Input Parsing**: All responses from LLMs must pass through a bulletproof boundary-recovery JSON parser (`safeJsonParse`) that strips markdown code blocks, repairs unescaped character sequences, strips trailing commas, and falls back to clean primitives without crashing.
- **Strict Response Schemas**: All generative routes (summarizers, simulation evaluators, study planners) must enforce specific response schemas matching the respective TypeScript interface.

---

## 4. Operation Security: AST Policy Sandboxing

Any dynamically generated script (Python/Pyodide/Node) must pass static Abstract Syntax Tree analysis before execution:
- **Permitted Modules**: `bpy`, `math`, `mathutils`, `bmesh`, `numpy`, `sympy`.
- **Forbidden Calls**: `os`, `sys`, `subprocess`, `socket`, `requests`, `exec`, `eval`, `compile`, `open`, `__import__`.
- **Harness Isolation**: Code is ran strictly inside sandboxed namespaces with restricted global contexts.

---

## 5. Temporal Audio-Visual Synchronization

Visual timelines (3D WebGL transformations, camera paths, shader stresses) are driven by the **audio narration stream** as the master clock:
- **SSML Anchor Points**: Custom `<mark name="evt_x"/>` elements are injected immediately prior to spoken concepts.
- **Microsecond Extractor**: The TTS response returns exact millisecond timepoints of marked words.
- **Frame-Accurate Tick**: Client-side render loops (`useFrame` / GSAP) match current playback offset with target marks to trigger transitions deterministically.
