# LMDpro | Autonomous AI Agentic Global eLearning Ecosystem

[![Build Status](https://img.shields.io/badge/Build-Passing-emerald)](https://github.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-cyan)](https://react.dev/)
[![Gemini 3.1 Pro](https://img.shields.io/badge/Gemini_3.1-Pro_%26_Flash-teal)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-purple)](LICENSE)

An advanced, open-source, non-profit, agentic AI educational platform engineered for accredited higher education degree programs, interactive Socratic tutoring, real-time audio voice discussions, and seamless Google Workspace synchronization.

---

## 🌟 Architectural Features & Highlights

### 🎓 1. Learning Studio (3 Main Featured Pages)
- **Accredited Degree Programs**: B.S. & M.S. degree curricula in Autonomous AI Systems, Quantum Computing, Zero-Trust Cybernetics, and Generative Swarms.
- **Interactive Course Player**: Socratic paragraph explainers, voice narration, interactive quizzes, flashcards, and automated AI executive summaries.
- **Course Completion & Velocity Analytics**: 7-day XP trend chart rendered with Recharts and interactive daily study goal progress ring.
- **Verified Certificate Locker**: Cryptographically generated academic certificates saved to offline storage and Firebase Firestore.

### 🤖 2. Agentic AI Labs & Live Voice
- **Live Audio/Voice Agent**: Bidirectional acoustic dialogue powered by Gemini 3.1 Live API with numerical precision and steerable voice narration tags.
- **Kudo Socratic AI Tutor**: Autonomous Socratic assistant providing real-time feedback, code evaluation, and concept decomposition.
- **Deep Research & Crawl RAG Agent**: Multi-source web crawling and vector embedding synthesis for academic citations.
- **Prompt Diagnostics Studio**: Real-time prompt health inspection, token estimation, and system prompt optimization.
- **AI Course Architect**: Generates complete multi-module course structures with lectures, labs, and quizzes on demand.

### 📁 3. Workspace & Knowledge Base
- **Google Drive Export**: Auto-exports course notes, AI summaries, and research papers directly into the **'LMDpro Academy'** folder in Google Drive.
- **Google Tasks & Calendar**: Drag-and-drop study task management and study schedule planning.
- **Google Classroom & Keep**: Sync enrolled courses with Google Classroom and save notes to Google Keep.
- **Open-Source Developer Console**: Programmatic REST API endpoints, curl snippets, and interactive API documentation.

---

## 🛠️ Tech Stack & Engine Roster

- **Frontend**: React 19, TypeScript 5.8, Tailwind CSS v4, Lucide Icons, Recharts, Motion (framer-motion).
- **Backend / Dev Server**: Express.js, Node.js, esbuild, tsx.
- **Cognitive AI Core**:
  - **Gemini 3.1 Pro & 3.5 Flash**: Complex reasoning, code generation, and Socratic evaluation.
  - **Gemini 3.1 Live API**: Low-latency bidirectional live audio speech discussions.
  - **Antigravity Agent Engine**: Sandboxed container execution and tool orchestration.
- **Storage & State**: Firebase Firestore, Firebase Auth, Browser LocalStorage / IndexedDB.

---

## 🚀 Quick Start & Installation

```bash
# 1. Clone Repository
git clone https://github.com/zalamati/lmdpro-academy.git
cd lmdpro-academy

# 2. Install Dependencies
npm install

# 3. Configure Environment
cp .env.example .env
# Add your GEMINI_API_KEY in .env

# 4. Start Development Server
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---

## 📦 Production Build & Deployment

```bash
# Build production bundle with Vite and esbuild
npm run build

# Start production Node server
npm start
```

### Vercel & Netlify Compatibility
Configurations are pre-included in `vercel.json` and `netlify.toml` for zero-config one-click deployments.

---

## 📜 Governance & Licensing

Built with ❤️ by the **Zalamati AI Research Lab** and **LMDpro Open-Source Academy**. Released under the MIT License. Universal non-profit educational platform for global learners.
