export interface DocSection {
  id: string;
  title: string;
  category: 'overview' | 'architecture' | 'academics' | 'apis' | 'setup' | 'security';
  summary: string;
  badgeText: string;
  contentMarkdown: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export const COMPREHENSIVE_DOCUMENTATION_DATA: DocSection[] = [
  {
    id: 'mission-overview',
    title: 'LMDpro Global Non-Profit Mission & Universal Open-Source Degree Framework',
    category: 'overview',
    summary: 'Universal access to accredited higher education, zero tuition fees, and open-source curriculum democratization powered by European ECTS credit standards and Gemini AI tutoring.',
    badgeText: 'Non-Profit Blueprint',
    contentMarkdown: `
# Executive Mission & Philosophy

Higher education is a fundamental human right, yet millions of global learners face astronomical tuition barriers, institutional gatekeeping, and geographical boundaries. LMDpro is a non-profit, 100% free, open-source educational infrastructure platform engineered to democratize access to accredited Bachelor's, Master's, and Doctorate degree pathways.

### The Three Pillars of LMDpro Infrastructure

1. Zero Financial Paywalls: All degree curricula, course materials, interactive AI tutoring, and ECTS credit evaluations are completely free for all global students.
2. Standardized ECTS Credit Transferability: Curricula are strictly aligned with the European Credit Transfer and Accumulation System (ECTS), where 1 academic year equals 60 ECTS credits (1,500 to 1,800 workload hours).
3. Kudo Agent Socratic AI Tutoring: Every student receives 24/7 personalized, adaptive Socratic guidance, real-time live voice discussions, and interactive animated mental models powered by Google's Gemini 3.1 Pro and Gemma 4 model families.

---

### Global Impact & Academic Accreditation Standard

LMDpro operates under a transparent open-governance model. Institutions and university partners can inspect, fork, and verify the platform's open-source repositories, ensuring cryptographically verifiable academic transcripts via Firebase persistent cloud ledgers.
`
  },
  {
    id: 'ects-academic-framework',
    title: 'European Credit Transfer & Accumulation System (ECTS) Implementation',
    category: 'academics',
    summary: 'Detailed mathematical breakdown of ECTS credit calculation, student workload hours, grading scales, and cross-border university credit recognition.',
    badgeText: 'ECTS Standards',
    contentMarkdown: `
# ECTS Credit Architecture & Workload Calculation

The European Credit Transfer and Accumulation System (ECTS) is a tool of the European Higher Education Area for making studies and courses more transparent. It helps students to move between countries and to have their academic qualifications and study periods abroad recognized.

### ECTS Workload Formula

In the LMDpro framework, 1 ECTS credit point corresponds to 25 to 30 hours of total student workload. Total workload includes direct lecture viewing, interactive study workbench exercises, reading assignments, and AI Socratic evaluations.

Total ECTS = Sum( (Lecture Hours + Practice Hours + Assessment Hours) / 28 )

### Degree Level Breakdowns

- Bachelor of Science (B.Sc.): 180 - 240 ECTS | 3 - 4 Years | 4,500 - 7,200 Workload Hours
- Master of Science (M.Sc.): 90 - 120 ECTS | 1 - 2 Years | 2,700 - 3,600 Workload Hours
- Doctor of Philosophy (Ph.D.): 180 - 240 ECTS | 3 - 4 Years | Research & Dissertation Defense

---

### Grade Point Average (GPA) & ECTS Grading Scale

LMDpro dynamically maps student performance across standard numerical and ECTS relative grading bands:

- ECTS Grade A (Top 10%): Outstanding performance with minimal errors (4.0 GPA equivalent).
- ECTS Grade B (Next 25%): Above average standard but with some errors (3.5 GPA equivalent).
- ECTS Grade C (Next 30%): Generally sound work with a number of errors (3.0 GPA equivalent).
- ECTS Grade D (Next 25%): Fair but with significant shortcomings (2.5 GPA equivalent).
- ECTS Grade E (Next 10%): Performance meets minimum criteria (2.0 GPA equivalent).
- ECTS Grade FX/F (Fail): Further work required before credit can be awarded.
`
  },
  {
    id: 'hybrid-ai-architecture',
    title: 'Hybrid Agentic AI Architecture: Dual-Tier Execution Engine',
    category: 'architecture',
    summary: 'Comprehensive specification of the bifurcated Cloud/Edge AI engine combining Gemini 3.1 Flash-Lite, Nano Banana Pro, Steel.dev Playwright automation, and Rover SDK.',
    badgeText: 'Zalamati Cognitive Engine',
    contentMarkdown: `
# Hybrid Agentic Engine Architecture

To solve the dual challenges of Privacy vs. Autonomy and Latency vs. Compute Capacity, LMDpro deploys the Zalamati Hybrid Agentic Engine Architecture. Workloads are dynamically routed between Cloud-side macro intelligence and Edge-side client execution.

Architecture Flow:
[ User Interface (React 19 + Liquid Glass Bento Layout) ]
                        |
            [ Router & PII Redaction Shield ]
                        |
        +---------------+---------------+
        |                               |
        v                               v
[ CLOUD MACRO-ENGINE ]        [ EDGE MICRO-ENGINE ]
Gemini 3.1 Flash-Lite          Nano Banana Pro (WASM)
Steel.dev Remote Scraper       Rover SDK (Local Browser)
Vertex AI Memory Bank          Local Privacy Redaction

### 1. The Cognitive Layer

- Cloud Macro-Engine (Gemini 3.1 Flash-Lite): Serves as the primary task planner, generating execution graphs, synthesizing academic research papers, and generating course modules.
- Edge Micro-Engine (Nano Banana Pro): Runs zero-latency local inference inside the user browser via WebGPU/WASM. Handles real-time DOM matching, text tokenization, and PII sanitization.

### 2. The Action & Automation Layer

- Server-Side Remote Execution (Steel.dev / Playwright): Operates containerized headless browsers for large-scale public data ingestion and web searches.
- Client-Side Domestic Execution (Rover SDK): Operates directly inside the client's browser context using existing authenticated cookies and local IP to bypass anti-bot walls safely.
`,
    codeSnippet: {
      language: 'typescript',
      code: `// Bifurcated Router Logic (src/services/agentRouter.ts)
export async function routeAgentTask(task: AgentTask): Promise<ExecutionResult> {
  // Step 1: Perform Edge-side PII Redaction
  const sanitizedInput = await NanoBananaPro.redactPII(task.payload);

  // Step 2: Determine execution target
  if (task.requiresLocalAuth || task.containsPrivateData) {
    console.log('[Router] Deploying Client-Side Rover SDK Operator');
    return await RoverSDK.executeLocalSession(sanitizedInput);
  }

  // Step 3: Route to Cloud Gemini 3.1
  console.log('[Router] Dispatching to Cloud Gemini 3.1 Flash-Lite');
  return await GeminiCloudService.processTask(sanitizedInput);
}`
    }
  },
  {
    id: 'api-specifications',
    title: 'Developer REST & Real-Time WebSocket API Reference',
    category: 'apis',
    summary: 'Full API documentation for course generation, live voice streaming, user progress synchronization, and ECTS transcript verification.',
    badgeText: 'REST & WS Spec',
    contentMarkdown: `
# LMDpro Developer API Specification

All API endpoints are served via Express on port 3000 behind an Nginx reverse proxy. Secure JWT authentication headers or Firebase Auth ID tokens are required for write operations.

### 1. Course Generation API

POST /api/courses/generate

Request Body:
{
  "topic": "Quantum Computing & Vector Spaces",
  "targetLevel": "master",
  "language": "en",
  "ectsCredits": 5
}

Response (200 OK):
{
  "success": true,
  "course": {
    "id": "course-qc-101",
    "title": "Advanced Quantum Vector Mechanics",
    "ects": 5,
    "modules": [...]
  }
}

---

### 2. Real-Time Voice Discussion Socket

WebSocket Connection: wss://domain/api/voice/live-stream

Supported Protocol Events:
- stream:start: Handshake to initialize Gemini 3.1 Flash Live voice session.
- audio:chunk: Transmits PCM 16kHz audio buffer from client microphone.
- agent:speech: Audio stream received from Kudo Narrator agent.
`,
    codeSnippet: {
      language: 'bash',
      code: `# Test Course Health Check via cURL
curl -X GET https://localhost:3000/api/health \\
  -H "Accept: application/json"`
    }
  },
  {
    id: 'developer-setup',
    title: 'Environment Setup, Build Instructions & CLI Commands',
    category: 'setup',
    summary: 'Step-by-step developer setup guide for running LMDpro locally, configuring environment variables, bundling with ESBuild, and deploying to Cloud Run.',
    badgeText: 'Dev Setup',
    contentMarkdown: `
# Developer Setup & Local Deployment Guide

### Prerequisites
- Node.js 20+ (ES Module support)
- npm 10+
- Google Gemini API Key

### 1. Environment Configuration

Create a .env file in the root workspace (declared in .env.example):

GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=development

### 2. Development Execution

Run the unified Vite + Express TypeScript dev server:

npm run dev

### 3. Production ESBuild Compilation

Compile the React frontend static assets and bundle the server into a single CommonJS file:

npm run build
npm start
`,
    codeSnippet: {
      language: 'json',
      code: `// package.json script declarations
{
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs",
    "lint": "tsc --noEmit"
  }
}`
    }
  },
  {
    id: 'security-privacy-shield',
    title: 'Security Auditing, Zero-Trust Architecture & PII Shielding',
    category: 'security',
    summary: 'In-depth breakdown of client-side zero-latency regex and semantic PII sanitization, Firebase Security Rules, and WCAG 2.1 AA accessibility standards.',
    badgeText: 'Security Shield',
    contentMarkdown: `
# Security & Privacy Architecture

LMDpro enforces a Zero-Trust Security Model. User credentials, personal email addresses, financial records, and private chat histories are never transmitted to unauthenticated third-party services.

### 1. Client-Side PII Redaction Pipeline

Before any student query or document fragment is sent to the Gemini API, the local WASM PII Shield executes three sanitization passes:

1. Regex Sanitization: Strips SSNs, credit card numbers, phone numbers, and email patterns.
2. Semantic NER Pass: Named-Entity Recognition identifies real-world personal names and addresses, replacing them with generic tokens ([REDACTED_USER], [REDACTED_LOCATION]).
3. Entropy Audit: Blocks random cryptographic keys or access tokens from leaking into prompts.

---

### 2. Firebase Firestore Security Rules

Data access is restricted at the database rule layer:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}
`
  },
  {
    id: 'mcp-specification',
    title: 'Model Context Protocol (MCP) Standard & Vector RAG Specification',
    category: 'apis',
    summary: 'Full architectural manual of LMDpro\'s native JSON-RPC Model Context Protocol (MCP) server endpoints, registered tools, and dynamic schema resources.',
    badgeText: 'MCP Core Spec',
    contentMarkdown: `
# Model Context Protocol (MCP) Standard Specification

LMDpro integrates a production-grade implementation of the **Model Context Protocol (MCP)**, an open standard designed to establish safe, structured, and bi-directional communication streams between LLM cores and contextual source databases.

### Standard Endpoints & Handshake

Our backend exposes a secure JSON-RPC 2.0 interface at \`/api/mcp\` with built-in schema compliance.

### 1. Register and List Available Tools (\`tools/list\`)
Returns the complete list of tools that the connected agent can dynamically trigger based on student requirements.

#### Request Schema:
\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
\`\`\`

#### Response:
Provides five high-precision registered tools:
1. \`generate_course_schema\`: Synthesizes modules, ECTS credits, and syllabus data.
2. \`ask_socratic_tutor\`: Resolves technical topics via rigorous chain-of-thought socratic reasoning.
3. \`search_vector_rag\`: Performs semantic queries over academic textbooks.
4. \`synthesize_tts\`: Generates low-latency voice narration scripts.
5. \`evaluate_quiz_mastery\`: Evaluates exam answers and calculates reward increments.

---

### 2. Socratic Content Resources (\`resources/list\` and \`resources/read\`)
Exposes static and dynamic textbooks and RAG document contexts as uniform resource identifiers (\`mcp-resource://rag/doc-id\`).

#### Example URI Format:
\`mcp-resource://rag/rag-1\` - Neural net synaptic weight adjustment.
\`mcp-resource://rag/rag-2\` - MCP Protocol core architecture manual.
`
  }
];
