# LMDpro Crawled Sources Directory: Open-Source Codebases & Third-Party Integrations
# Verified: Wednesday, August 5, 2026

This directory indexes scraped repository structures, crawled third-party authoring specifications, and API payload standards for the LMDpro open-source academic e-learning platform.

---

## 1. LMDpro GitHub Organization Index

```
LMDpro/
├── .github/workflows/          ← GitHub Actions CI/CD pipelines
├── .agents/
│   ├── AGENTS.md               ← Active system instructions (system_instructions-v3.md)
│   ├── SKILLS.md               ← Active tool & skill definitions (agentic_instructions-v3.md)
│   └── code_validator.py       ← Zalamati's static AST safety validator script
├── src/
│   ├── api/
│   │   ├── services/
│   │   │   ├── ConversationalBridgeService.ts  ← Petra & Nashmi TTS backend discussion bus
│   │   │   └── LearningPathRecalculator.ts    ← Background progress optimization worker
│   │   └── controllers/
│   │       └── mcp_listener_socket.ts          ← Socket listener for incoming Blender scripts
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── LearningHubDashboard.tsx        ← Cleaned, non-duplicated main shell
│   │   │   └── VisualSyncController.tsx        ← React Three Fiber / GSAP TTS audio syncer
│   │   └── theme/
│   │       └── GlobalTheme.css                 ← Liquid Glass Dark Cyber tokens and gradients
│   └── main.tsx
├── package.json
└── tsconfig.json
```

---

## 2. Crawled Third-Party Authoring Integration Specs

- **Rive Experience Engine**: GPU-accelerated real-time vector graphics at 120fps natively. State machine mapping via `@rive-app/canvas`.
- **We Are Learning**: Character-driven dialogue nodes with node-based branching pipelines and automatic lip-syncing/gesture triggers.

---

## 3. Headless VM Setup for Computer Use Execution

1. Virtual X11 Display Server (`Xvfb :99 -ac -screen 0 1024x768x24 &`)
2. Lightweight Window Manager (`mutter --replace &`)
3. Digital Interface Panel (`tint2 &`)
4. Stealth Browser Execution via Playwright over CDP to browserless GPU clusters.
