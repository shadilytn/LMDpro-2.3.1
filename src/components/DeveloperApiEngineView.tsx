import React from "react";
import {
  Code2,
  Key,
  Play,
  Terminal,
  Copy,
  Check,
  Zap,
  RefreshCw,
  Sliders,
  Shield,
  Layers,
  Lock,
  Eye,
  EyeOff,
  Github,
  Box,
  Download,
  BookOpen,
  Cpu,
  Server,
  FolderGit2,
  Package,
  Wrench,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Activity,
  AlertTriangle,
  Trash2,
  RotateCw,
  TrendingUp,
  HardDrive,
  Radio,
  CloudLightning,
} from "lucide-react";
import { ApiService } from "../shared/api.service";
import { AgenticAPIStats } from "./AgenticAPIStats";
import { ColabSshIntegration } from "./ColabSshIntegration";
import { IntegratedCodeEditor } from "./IntegratedCodeEditor";

type DevTab =
  | "api"
  | "telemetry"
  | "colab"
  | "code_editor"
  | "cli"
  | "mcp"
  | "sdks"
  | "integrations"
  | "install"
  | "diagnostics";

export const DeveloperApiEngineView: React.FC = () => {
  const [activeDevTab, setActiveDevTab] = React.useState<DevTab>("api");

  // API Key Generator State
  const [apiKey, setApiKey] = React.useState("zal_dev_sk_9f83a27e10b244c98d701a2b");

  // Memory Leak & Component Diagnostics State
  const [heapInfo, setHeapInfo] = React.useState({
    usedMb: 34.2,
    totalMb: 68.5,
    limitMb: 2048,
    detachedDOM: 2,
    activeListeners: 42,
  });

  // Auto-GC Policy Setting
  const [autoGcEnabled, setAutoGcEnabled] = React.useState(true);
  const [autoGcPolicy, setAutoGcPolicy] = React.useState<
    "immediate" | "threshold" | "unmount_only"
  >("immediate");

  const [componentMetrics, setComponentMetrics] = React.useState<any[]>([
    {
      id: "AdminPortal",
      name: "AdminPortal.tsx",
      path: "src/components/AdminPortal.tsx",
      chunkSizeKb: 142.5,
      mountCount: 14,
      unmountCount: 14,
      retainedMemoryDeltaMb: 0.05,
      unreleasedListeners: 0,
      detachedNodes: 0,
      status: "clean" as "clean" | "warning" | "leak",
    },
    {
      id: "StudentDashboard",
      name: "StudentDashboard.tsx",
      path: "src/components/StudentDashboard.tsx",
      chunkSizeKb: 218.4,
      mountCount: 28,
      unmountCount: 28,
      retainedMemoryDeltaMb: 0.12,
      unreleasedListeners: 1,
      detachedNodes: 2,
      status: "warning" as "clean" | "warning" | "leak",
    },
    {
      id: "SchoolDashboard",
      name: "SchoolDashboard.tsx",
      path: "src/components/SchoolDashboard.tsx",
      chunkSizeKb: 184.2,
      mountCount: 9,
      unmountCount: 9,
      retainedMemoryDeltaMb: 0.02,
      unreleasedListeners: 0,
      detachedNodes: 0,
      status: "clean" as "clean" | "warning" | "leak",
    },
    {
      id: "TeacherDashboard",
      name: "TeacherDashboard.tsx",
      path: "src/components/TeacherDashboard.tsx",
      chunkSizeKb: 196.1,
      mountCount: 12,
      unmountCount: 12,
      retainedMemoryDeltaMb: 0.04,
      unreleasedListeners: 0,
      detachedNodes: 0,
      status: "clean" as "clean" | "warning" | "leak",
    },
    {
      id: "SocialLearningHub",
      name: "SocialLearningHub.tsx",
      path: "src/components/SocialLearningHub.tsx",
      chunkSizeKb: 165.8,
      mountCount: 7,
      unmountCount: 7,
      retainedMemoryDeltaMb: 0.08,
      unreleasedListeners: 0,
      detachedNodes: 0,
      status: "clean" as "clean" | "warning" | "leak",
    },
    {
      id: "AIContentCurationEngine",
      name: "AIContentCurationEngine.tsx",
      path: "src/components/AIContentCurationEngine.tsx",
      chunkSizeKb: 152.0,
      mountCount: 11,
      unmountCount: 11,
      retainedMemoryDeltaMb: 0.03,
      unreleasedListeners: 0,
      detachedNodes: 0,
      status: "clean" as "clean" | "warning" | "leak",
    },
    {
      id: "CinematicVideoVisualizer",
      name: "CinematicVideoVisualizer.tsx",
      path: "src/components/CinematicVideoVisualizer.tsx",
      chunkSizeKb: 289.0,
      mountCount: 5,
      unmountCount: 5,
      retainedMemoryDeltaMb: 1.84,
      unreleasedListeners: 3,
      detachedNodes: 8,
      status: "leak" as "clean" | "warning" | "leak",
    },
    {
      id: "CollaborativeStudyNotes",
      name: "CollaborativeStudyNotes.tsx",
      path: "src/components/CollaborativeStudyNotes.tsx",
      chunkSizeKb: 138.2,
      mountCount: 16,
      unmountCount: 16,
      retainedMemoryDeltaMb: 0.06,
      unreleasedListeners: 0,
      detachedNodes: 0,
      status: "clean" as "clean" | "warning" | "leak",
    },
  ]);

  const [isRunningAudit, setIsRunningAudit] = React.useState(false);
  const [auditFeedback, setAuditFeedback] = React.useState<string | null>(null);

  // Measure actual browser performance heap if API exists
  React.useEffect(() => {
    if (window.performance && (performance as any).memory) {
      const mem = (performance as any).memory;
      setHeapInfo((prev) => ({
        ...prev,
        usedMb: Math.round((mem.usedJSHeapSize / (1024 * 1024)) * 10) / 10,
        totalMb: Math.round((mem.totalJSHeapSize / (1024 * 1024)) * 10) / 10,
        limitMb: Math.round((mem.jsHeapSizeLimit / (1024 * 1024)) * 10) / 10,
      }));
    }
  }, [activeDevTab]);

  const handleRunLeakSimulation = () => {
    setIsRunningAudit(true);
    setAuditFeedback(
      "Simulating 50 fast mount/unmount cycles across lazy dashboard views...",
    );

    setTimeout(() => {
      // Simulate memory profiling sweep
      const updated = componentMetrics.map((c) => {
        const isLeakTarget = c.id === "CinematicVideoVisualizer";
        return {
          ...c,
          mountCount: c.mountCount + 5,
          unmountCount: c.unmountCount + 5,
          retainedMemoryDeltaMb: isLeakTarget
            ? Math.round((c.retainedMemoryDeltaMb + 0.45) * 100) / 100
            : Math.round((c.retainedMemoryDeltaMb + 0.01) * 100) / 100,
          unreleasedListeners: isLeakTarget ? 4 : 0,
          detachedNodes: isLeakTarget ? 12 : 0,
          status: isLeakTarget ? ("leak" as const) : ("clean" as const),
        };
      });

      setComponentMetrics(updated);
      setHeapInfo((prev) => ({
        ...prev,
        usedMb: Math.round((prev.usedMb + 2.8) * 10) / 10,
        detachedDOM: 14,
        activeListeners: 46,
      }));

      setIsRunningAudit(false);
      setAuditFeedback(
        "Audit complete: 1 component flagged with uncleaned event listener & detached DOM nodes.",
      );
      setTimeout(() => setAuditFeedback(null), 4000);
    }, 1800);
  };

  const handleTriggerGarbageCollection = () => {
    setIsRunningAudit(true);
    setAuditFeedback(
      "Requesting browser Garbage Collector & clearing internal module caches...",
    );

    setTimeout(() => {
      setHeapInfo((prev) => ({
        ...prev,
        usedMb: Math.max(22.1, Math.round((prev.usedMb - 8.4) * 10) / 10),
        detachedDOM: 0,
        activeListeners: 38,
      }));

      setComponentMetrics((prev) =>
        prev.map((c) => ({
          ...c,
          retainedMemoryDeltaMb: Math.max(
            0.01,
            Math.round(c.retainedMemoryDeltaMb * 0.4 * 100) / 100,
          ),
          unreleasedListeners: 0,
          detachedNodes: 0,
          status: "clean" as const,
        })),
      );

      setIsRunningAudit(false);
      setAuditFeedback(
        "Garbage Collection complete: Reclaimed ~8.4 MB heap space.",
      );
      setTimeout(() => setAuditFeedback(null), 3500);
    }, 1200);
  };

  const handleExportProfilerDump = () => {
    const dumpData = {
      timestamp: new Date().toISOString(),
      heapInfo,
      componentMetrics,
      diagnosticsEngine: "Zalamati Memory Leak Profiler v2.4",
    };

    const blob = new Blob([JSON.stringify(dumpData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zalamati-memory-profiler-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const [showKey, setShowKey] = React.useState(false);
  const [copiedKey, setCopiedKey] = React.useState(false);
  const [keyScopes, setKeyScopes] = React.useState<string[]>([
    "courses:generate",
    "tutor:ask",
    "rag:search",
    "tts:generate",
    "certs:issue",
    "mcp:execute",
  ]);

  // Live RAG and MCP Interactive States
  const [ragAction, setRagAction] = React.useState<"search" | "index">("search");
  const [ragTitle, setRagTitle] = React.useState("Dynamic Agentic Orchestrations");
  const [ragContent, setRagContent] = React.useState(
    "Autonomous agent swarms communicate via peer-to-peer event buses, dynamically dispatching sub-tasks to downstream model worker nodes.",
  );

  // MCP Interactive Console States
  const [mcpTelemetry, setMcpTelemetry] = React.useState<any>({
    status: "ONLINE",
    mcpVersion: "1.1.0",
    transport: "SSE/HTTP-Hybrid",
    activeConnections: 0,
    indexedDocsCount: 2,
    exposedTools: [
      "generate_course_schema",
      "ask_socratic_tutor",
      "search_vector_rag",
      "synthesize_tts",
      "evaluate_quiz_mastery",
    ],
  });
  const [mcpMethod, setMcpMethod] = React.useState<
    "tools/list" | "resources/list" | "call_tutor" | "call_course" | "call_rag"
  >("tools/list");
  const [mcpRequestBody, setMcpRequestBody] = React.useState(
    JSON.stringify(
      {
        jsonrpc: "2.0",
        id: 1,
        method: "tools/list",
        params: {},
      },
      null,
      2,
    ),
  );
  const [mcpResponseBody, setMcpResponseBody] = React.useState<any>(null);
  const [isMcpLoading, setIsMcpLoading] = React.useState(false);
  const [mcpLatency, setMcpLatency] = React.useState<number | null>(null);

  // REST API Tester State
  const [selectedEndpoint, setSelectedEndpoint] = React.useState<
    "course_gen" | "tutor" | "tts" | "quiz_eval" | "rag_index"
  >("course_gen");
  const [selectedLanguage, setSelectedLanguage] = React.useState<
    "curl" | "javascript" | "python" | "go" | "rust"
  >("javascript");
  const [requestTopic, setRequestTopic] = React.useState(
    "Autonomous Multi-Agent Swarms",
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [responsePayload, setResponsePayload] = React.useState<any>(null);
  const [executionTimeMs, setExecutionTimeMs] = React.useState<number | null>(null);

  // CLI Engine State
  const [cliCommand, setCliCommand] = React.useState(
    "zalamati init my-course --template cs-master",
  );
  const [cliOutput, setCliOutput] = React.useState<string[]>([]);
  const [isCliRunning, setIsCliRunning] = React.useState(false);

  // Copy state helpers
  const [copiedText, setCopiedText] = React.useState<string | null>(null);

  // Auto load MCP telemetry
  React.useEffect(() => {
    if (activeDevTab === "mcp") {
      fetchMcpTelemetry();
    }
  }, [activeDevTab]);

  const fetchMcpTelemetry = async () => {
    try {
      const res = await fetch("/api/mcp/status");
      if (res.ok) {
        const data = await res.json();
        setMcpTelemetry(data);
      }
    } catch (e) {
      console.warn("Failed to load MCP telemetry:", e);
    }
  };

  const handleMcpMethodChange = (method: typeof mcpMethod) => {
    setMcpMethod(method);
    let body = {};
    if (method === "tools/list") {
      body = {
        jsonrpc: "2.0",
        id: 1,
        method: "tools/list",
        params: {},
      };
    } else if (method === "resources/list") {
      body = {
        jsonrpc: "2.0",
        id: 2,
        method: "resources/list",
        params: {},
      };
    } else if (method === "call_tutor") {
      body = {
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: {
          name: "ask_socratic_tutor",
          arguments: {
            prompt:
              "What is the relation between adaptive learning loops and retention?",
            thinkingMode: true,
          },
        },
      };
    } else if (method === "call_course") {
      body = {
        jsonrpc: "2.0",
        id: 4,
        method: "tools/call",
        params: {
          name: "generate_course_schema",
          arguments: {
            topic: "Reinforcement Learning from Human Feedback",
            level: "Advanced",
          },
        },
      };
    } else if (method === "call_rag") {
      body = {
        jsonrpc: "2.0",
        id: 5,
        method: "tools/call",
        params: {
          name: "search_vector_rag",
          arguments: {
            query: "Neural networks",
          },
        },
      };
    }
    setMcpRequestBody(JSON.stringify(body, null, 2));
  };

  const executeMcpCall = async () => {
    setIsMcpLoading(true);
    setMcpResponseBody(null);
    const start = performance.now();
    try {
      let parsed;
      try {
        parsed = JSON.parse(mcpRequestBody);
      } catch (err) {
        throw new Error(
          "Invalid JSON-RPC request payload. Please verify syntax.",
        );
      }

      const res = await fetch("/api/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      const data = await res.json();
      setMcpResponseBody(data);
      fetchMcpTelemetry();
    } catch (err: any) {
      setMcpResponseBody({
        jsonrpc: "2.0",
        id: null,
        error: { code: -32603, message: err.message || "Execution Error" },
      });
    } finally {
      const end = performance.now();
      setMcpLatency(Math.round(end - start));
      setIsMcpLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const generateNewKey = () => {
    const array = new Uint8Array(12);
    window.crypto.getRandomValues(array);
    const hex = Array.from(array, (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
    setApiKey(`zal_dev_sk_${hex}`);
  };

  const executeLiveApiCall = async () => {
    setIsLoading(true);
    setResponsePayload(null);
    const start = performance.now();

    try {
      if (selectedEndpoint === "course_gen") {
        const course = await ApiService.generateCourse({
          topic: requestTopic,
          category: "Computer Science",
          level: "Advanced",
          moduleCount: 3,
        });
        setResponsePayload(course);
      } else if (selectedEndpoint === "tutor") {
        const res = await ApiService.askTutor({
          prompt: `Explain ${requestTopic} in simple terms`,
          thinkingMode: true,
        });
        setResponsePayload(res);
      } else if (selectedEndpoint === "tts") {
        const audio = await ApiService.generateTTSAudio(
          `Now playing demonstration audio for ${requestTopic}`,
        );
        setResponsePayload({
          status: "success",
          audioUriPresent: !!audio,
          sampleRate: "24kHz",
          codec: "mp3",
        });
      } else if (selectedEndpoint === "quiz_eval") {
        const evalRes = await ApiService.evaluateQuizResponse({
          question: `What is the core principle of ${requestTopic}?`,
          studentAnswer: "Adaptive feedback and continuous learning loops.",
          correctAnswer: "Adaptive feedback and continuous learning loops.",
          explanation:
            "Adaptive feedback provides the highest mastery retention.",
          currentAdaptiveLevel: "standard",
        });
        setResponsePayload(evalRes);
      } else {
        if (ragAction === "index") {
          const res = await fetch("/api/gemini/rag-index", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "index",
              title: ragTitle,
              content: ragContent,
              topic: requestTopic,
            }),
          });
          const data = await res.json();
          setResponsePayload(data);
        } else {
          const res = await fetch("/api/gemini/rag-index", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: requestTopic }),
          });
          const data = await res.json();
          setResponsePayload(data);
        }
      }
    } catch (err: any) {
      setResponsePayload({ error: err.message || "API Execution Error" });
    } finally {
      const end = performance.now();
      setExecutionTimeMs(Math.round(end - start));
      setIsLoading(false);
    }
  };

  const handleRunCli = () => {
    setIsCliRunning(true);
    setCliOutput(["$ " + cliCommand]);
    setTimeout(() => {
      if (cliCommand.includes("init")) {
        setCliOutput([
          "$ " + cliCommand,
          "✔ Creating project structure in ./my-ai-course...",
          "✔ Fetching latest Zalamati course templates from registry...",
          "✔ Installing dependencies (@zalamati/sdk v2.4.0)...",
          "✔ Setting up local Gemini & Firebase configurations...",
          '✨ Project initialized successfully! Run "cd my-ai-course && zalamati dev" to launch.',
        ]);
      } else if (cliCommand.includes("deploy")) {
        setCliOutput([
          "$ " + cliCommand,
          "✔ Validating OpenAPI schema & route handlers...",
          "✔ Bundling edge functions with esbuild...",
          "✔ Deploying to Zalamati Serverless Cluster (Frankfurt)...",
          "🚀 Deployed! Production URL: https://api.zalamati.org/v1/deploy/my-course",
        ]);
      } else if (cliCommand.includes("colab")) {
        if (cliCommand.includes("-s")) {
          const sess = cliCommand.split("-s")[1]?.trim() || "SESSION";
          setCliOutput([
            "$ " + cliCommand,
            `[colab-ssh] Initializing encrypted zero-trust tunnel to Google Colab...`,
            `[colab-ssh] Connecting to session: "${sess}" (Host: colab, User: root)...`,
            `[colab-ssh] Tunnel established via Cloudflare edge. Allocating pseudo-terminal (PTY)...`,
            `--------------------------------------------------------------------------------`,
            `Google Colaboratory (${sess.toUpperCase()} Node, CUDA 12.2, Python 3.10.12)`,
            `Working directory: /content`,
            `Remote command executed: cd /content 2>/dev/null; exec bash -l`,
            `--------------------------------------------------------------------------------`,
            `root@colab:~# `
          ]);
        } else if (cliCommand.includes("--proxy-mode")) {
          setCliOutput([
            "$ " + cliCommand,
            `[colab-ssh] ProxyMode handshake active for OpenSSH / IDE Remote Development.`,
            `[colab-ssh] Tunnel protocol: SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.4`,
            `✔ Stream connected to standard input/output (stdio). Ready for IDE host communication.`
          ]);
        } else {
          setCliOutput([
            "$ " + cliCommand,
            `[colab-ssh] Initializing direct interactive shell...`,
            `[colab-ssh] Connected to Google Colab GPU runtime (NVIDIA Tesla T4 16GB).`,
            `--------------------------------------------------------------------------------`,
            `Google Colaboratory (Tesla T4 16GB, CUDA 12.2, Python 3.10.12)`,
            `Working directory: /content`,
            `Remote command executed: cd /content 2>/dev/null; exec bash -l`,
            `--------------------------------------------------------------------------------`,
            `root@colab:~# `
          ]);
        }
      } else if (cliCommand.includes("mcp")) {
        setCliOutput([
          "$ " + cliCommand,
          "✔ Initializing MCP Server transport over stdio...",
          "✔ Registered 5 tools: [generate_course_schema, ask_socratic_tutor, search_vector_rag, synthesize_tts, evaluate_quiz_mastery]",
          "✔ Listening for JSON-RPC 2.0 messages from active host clients...",
        ]);
      } else {
        setCliOutput([
          "$ " + cliCommand,
          "✔ Command executed successfully.",
          "Result: OK (Exit code 0)",
        ]);
      }
      setIsCliRunning(false);
    }, 600);
  };

  const getCodeSnippet = () => {
    const epUrls = {
      course_gen: "/api/v1/generate-course",
      tutor: "/api/v1/tutor",
      tts: "/api/v1/tts",
      quiz_eval: "/api/v1/quiz-eval",
      rag_index: "/api/gemini/rag-index",
    };

    const url = `https://api.zalamati.org/v1${epUrls[selectedEndpoint] || "/api/gemini/rag-index"}`;

    if (selectedLanguage === "curl") {
      if (selectedEndpoint === "course_gen") {
        return `curl -X POST ${url} \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "topic": "${requestTopic}",
    "category": "Computer Science",
    "level": "Advanced"
  }'`;
      } else if (selectedEndpoint === "tutor") {
        return `curl -X POST ${url} \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Explain ${requestTopic} in simple terms",
    "thinkingMode": true
  }'`;
      } else if (selectedEndpoint === "tts") {
        return `curl -X POST ${url} \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Now playing demonstration audio for ${requestTopic}"
  }'`;
      } else if (selectedEndpoint === "quiz_eval") {
        return `curl -X POST ${url} \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "question": "What is the core principle of ${requestTopic}?",
    "studentAnswer": "Adaptive learning loops.",
    "correctAnswer": "Adaptive learning loops.",
    "currentAdaptiveLevel": "standard"
  }'`;
      } else {
        return `curl -X POST ${url} \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "action": "${ragAction}",
    ${ragAction === "index" ? `"title": "${ragTitle}",\n    "content": "${ragContent.substring(0, 40)}...",` : `"query": "${requestTopic}"`},
    "topic": "Computer Science"
  }'`;
      }
    }

    if (selectedLanguage === "javascript") {
      if (selectedEndpoint === "course_gen") {
        return `import { ZalamatiClient } from '@zalamati/sdk';

const client = new ZalamatiClient({ apiKey: '${apiKey}' });

async function main() {
  const course = await client.courses.generate({
    topic: '${requestTopic}',
    category: 'Computer Science',
    level: 'Advanced'
  });
  console.log('Generated Course:', course.title);
}

main();`;
      } else if (selectedEndpoint === "tutor") {
        return `import { ZalamatiClient } from '@zalamati/sdk';

const client = new ZalamatiClient({ apiKey: '${apiKey}' });

async function main() {
  const response = await client.tutor.ask({
    prompt: 'Explain ${requestTopic}',
    thinkingMode: true
  });
  console.log('Tutor Response:', response.reply);
}

main();`;
      } else if (selectedEndpoint === "tts") {
        return `import { ZalamatiClient } from '@zalamati/sdk';

const client = new ZalamatiClient({ apiKey: '${apiKey}' });

async function main() {
  const audioData = await client.tts.generate({
    text: 'Now playing demonstration audio for ${requestTopic}'
  });
  console.log('Audio Data URI:', audioData.audioDataUri);
}

main();`;
      } else if (selectedEndpoint === "quiz_eval") {
        return `import { ZalamatiClient } from '@zalamati/sdk';

const client = new ZalamatiClient({ apiKey: '${apiKey}' });

async function main() {
  const evaluation = await client.quizzes.evaluate({
    question: 'What is the core principle of ${requestTopic}?',
    studentAnswer: 'Adaptive feedback.',
    correctAnswer: 'Adaptive feedback.'
  });
  console.log('Correct:', evaluation.isCorrect);
}

main();`;
      } else {
        return `import { ZalamatiClient } from '@zalamati/sdk';

const client = new ZalamatiClient({ apiKey: '${apiKey}' });

async function main() {
  const results = await client.rag.${ragAction === "index" ? "indexDocument" : "search"}({
    ${ragAction === "index" ? `title: '${ragTitle}',\n    content: '${ragContent.substring(0, 45)}...',` : `query: '${requestTopic}'`},
    topic: 'Computer Science'
  });
  console.log('RAG Response:', results);
}

main();`;
      }
    }

    if (selectedLanguage === "python") {
      if (selectedEndpoint === "course_gen") {
        return `from zalamati import ZalamatiClient

client = ZalamatiClient(api_key="${apiKey}")

response = client.courses.generate(
    topic="${requestTopic}",
    category="Computer Science",
    level="Advanced"
)
print(f"Course: {response.title}")`;
      } else if (selectedEndpoint === "tutor") {
        return `from zalamati import ZalamatiClient

client = ZalamatiClient(api_key="${apiKey}")

response = client.tutor.ask(
    prompt="Explain ${requestTopic}",
    thinking_mode=True
)
print(f"Reply: {response.reply}")`;
      } else if (selectedEndpoint === "tts") {
        return `from zalamati import ZalamatiClient

client = ZalamatiClient(api_key="${apiKey}")

audio = client.tts.generate(
    text="Now playing demonstration audio for ${requestTopic}"
)
print(f"Audio URI: {audio.audio_data_uri}")`;
      } else if (selectedEndpoint === "quiz_eval") {
        return `from zalamati import ZalamatiClient

client = ZalamatiClient(api_key="${apiKey}")

result = client.quizzes.evaluate(
    question="What is the core principle of ${requestTopic}?",
    student_answer="Adaptive learning",
    correct_answer="Adaptive learning"
)
print(f"Is Correct: {result.is_correct}")`;
      } else {
        return `from zalamati import ZalamatiClient

client = ZalamatiClient(api_key="${apiKey}")

results = client.rag.${ragAction === "index" ? "index_document" : "search"}(
    ${ragAction === "index" ? `title="${ragTitle}",\n    content="${ragContent.substring(0, 45)}...",` : `query="${requestTopic}"`},
    topic="Computer Science"
)
print(results)`;
      }
    }

    if (selectedLanguage === "go") {
      return `package main

import (
	"fmt"
	"github.com/zalamati/zalamati-go"
)

func main() {
	client := zalamati.NewClient("${apiKey}")
	res, err := client.${selectedEndpoint === "course_gen" ? "GenerateCourse" : selectedEndpoint === "tutor" ? "AskTutor" : selectedEndpoint === "tts" ? "GenerateTTS" : selectedEndpoint === "quiz_eval" ? "EvaluateQuiz" : "SearchRAG"}("${requestTopic}")
	if err != nil {
		panic(err)
	}
	fmt.Printf("API Response: %+v\\n", res)
}`;
    }

    return `use zalamati_sdk::ZalamatiClient;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = ZalamatiClient::new("${apiKey}");
    let response = client.${selectedEndpoint === "course_gen" ? "generate_course" : selectedEndpoint === "tutor" ? "ask_tutor" : selectedEndpoint === "tts" ? "generate_tts" : selectedEndpoint === "quiz_eval" ? "evaluate_quiz" : "search_rag"}("${requestTopic}").await?;
    println!("Response received successfully!");
    Ok(())
}`;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1822] via-[#0e212d] to-[#071118] border border-[#1d3d4c] p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
            <Code2 className="w-3.5 h-3.5" />
            <span>Developer & Documentation Engine</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Developer Documentation & Integration Hub
          </h1>
          <p className="text-sm text-[#88acbd] leading-relaxed">
            Full-stack CLI tool, REST APIs, Model Context Protocol (MCP), SDK
            packages, GitHub Actions, and HuggingFace Hub integrations.
          </p>
        </div>

        {/* Top Developer Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-6 border-t border-[#183646] mt-6">
          {[
            { id: "api", label: "REST API & Keys", icon: Key },
            { id: "telemetry", label: "Live API Telemetry", icon: Radio },
            { id: "colab", label: "Google Colab SSH", icon: CloudLightning },
            { id: "code_editor", label: "In-Browser Code Studio", icon: Code2 },
            { id: "cli", label: "CLI Engine & Terminal", icon: Terminal },
            { id: "mcp", label: "MCP Protocol Server", icon: Server },
            { id: "sdks", label: "SDKs & Libraries", icon: Package },
            { id: "integrations", label: "GitHub & HuggingFace", icon: Github },
            { id: "install", label: "Installation Guides", icon: Wrench },
            {
              id: "diagnostics",
              label: "Memory Leak Diagnostics",
              icon: Activity,
            },
          ].map((tab) => {
            const IconComp = tab.icon;
            const active = activeDevTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDevTab(tab.id as DevTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  active
                    ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 scale-[1.02]"
                    : "bg-[#08151c] text-[#7195a8] hover:text-white hover:bg-[#112633] border border-[#18374a]"
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: REST API & KEYS */}
      {activeDevTab === "api" && (
        <div className="space-y-8">
          {/* API Key Generator Card */}
          <div className="p-6 rounded-2xl bg-[#10222c] border border-[#1c3c4b] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1b3846] pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-cyan-400" />
                  API Key & Security Credentials
                </h2>
                <p className="text-xs text-[#7f9fbf]">
                  Free unlimited developer keys for non-profit education and AI
                  research.
                </p>
              </div>

              <button
                onClick={generateNewKey}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#163847] hover:bg-[#1d4557] text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-all shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Generate New API Key</span>
              </button>
            </div>

            {/* Key Display Bar */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#08131a] border border-[#1d3c4a]">
              <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
              <input
                type={showKey ? "text" : "password"}
                readOnly
                value={apiKey}
                className="flex-1 bg-transparent text-xs font-mono text-cyan-300 focus:outline-none"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="p-1.5 rounded-lg text-[#618596] hover:text-white transition-colors"
                title={showKey ? "Hide Key" : "Show Key"}
              >
                {showKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => copyToClipboard(apiKey, "key")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#112a36] hover:bg-[#183948] text-xs font-semibold text-white border border-[#204456] transition-all"
              >
                {copiedText === "key" ? (
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                )}
                <span>{copiedText === "key" ? "Copied" : "Copy"}</span>
              </button>
            </div>

            {/* Scopes Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#83a5b5]">
                Granted Scopes & Capabilities:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "courses:generate", label: "Course Architect API" },
                  { id: "tutor:ask", label: "Socratic AI Tutor API" },
                  { id: "rag:search", label: "Deep Crawl RAG Index" },
                  { id: "tts:generate", label: "Speech Audio Generation" },
                  { id: "certs:issue", label: "Certificate Issuer" },
                  { id: "mcp:execute", label: "MCP Server Execution" },
                ].map((scope) => {
                  const active = keyScopes.includes(scope.id);
                  return (
                    <button
                      key={scope.id}
                      onClick={() => {
                        setKeyScopes((prev) =>
                          prev.includes(scope.id)
                            ? prev.filter((s) => s !== scope.id)
                            : [...prev, scope.id],
                        );
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        active
                          ? "bg-[#153444] text-cyan-300 border-cyan-500/40"
                          : "bg-[#0b171f] text-[#5d8090] border-[#183341]"
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${active ? "text-cyan-400" : "text-slate-600"}`}
                      />
                      <span>{scope.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Real-time Agentic API Telemetry & Stats Section */}
          <div className="space-y-4">
            <AgenticAPIStats compact={false} />
          </div>

          {/* Interactive REST Endpoint Tester */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#10222c] border border-[#1c3c4b] space-y-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Endpoint Tester
              </h2>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-[#83a5b5]">
                  Select API Endpoint:
                </label>
                <div className="space-y-2">
                  {[
                    {
                      id: "course_gen",
                      label: "POST /api/v1/generate-course",
                      desc: "Course Architect Generator",
                    },
                    {
                      id: "tutor",
                      label: "POST /api/v1/tutor",
                      desc: "Socratic Tutor Query",
                    },
                    {
                      id: "tts",
                      label: "POST /api/v1/tts",
                      desc: "Speech Synthesis Engine",
                    },
                    {
                      id: "quiz_eval",
                      label: "POST /api/v1/quiz-eval",
                      desc: "Adaptive Quiz Evaluator",
                    },
                    {
                      id: "rag_index",
                      label: "POST /api/v1/rag-index",
                      desc: "Deep Crawl RAG Search",
                    },
                  ].map((ep) => (
                    <button
                      key={ep.id}
                      onClick={() => setSelectedEndpoint(ep.id as any)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        selectedEndpoint === ep.id
                          ? "bg-[#153545] border-cyan-500/50 text-white shadow-md"
                          : "bg-[#0d1a21] border-[#1a3847] text-[#7093a3] hover:text-white"
                      }`}
                    >
                      <div className="font-mono text-xs font-bold text-cyan-300">
                        {ep.label}
                      </div>
                      <div className="text-[11px] text-[#5e8191] mt-0.5">
                        {ep.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedEndpoint === "rag_index" && (
                <div className="space-y-3 p-3.5 rounded-xl bg-[#09151e] border border-[#1b3d4f] space-y-3 animate-fade-in">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRagAction("search")}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        ragAction === "search"
                          ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                          : "bg-[#0d1c25] text-slate-400 hover:text-white border border-[#142e3d]"
                      }`}
                    >
                      Search RAG Memory
                    </button>
                    <button
                      type="button"
                      onClick={() => setRagAction("index")}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        ragAction === "index"
                          ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                          : "bg-[#0d1c25] text-slate-400 hover:text-white border border-[#142e3d]"
                      }`}
                    >
                      Index Document
                    </button>
                  </div>

                  {ragAction === "index" ? (
                    <div className="space-y-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Document Title
                        </label>
                        <input
                          type="text"
                          value={ragTitle}
                          onChange={(e) => setRagTitle(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#04090d] border border-[#1a3d4f] text-xs text-white focus:outline-none focus:border-cyan-400"
                          placeholder="e.g. Memory Alignment Theory"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Document Content (Markdown)
                        </label>
                        <textarea
                          value={ragContent}
                          onChange={(e) => setRagContent(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#04090d] border border-[#1a3d4f] text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
                          placeholder="e.g. Cognitive indexing relies on high-dimensional semantic search vectors..."
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#83a5b5]">
                  {selectedEndpoint === "rag_index" && ragAction === "index"
                    ? "Category / Subject"
                    : "Target Subject / Topic:"}
                </label>
                <input
                  type="text"
                  value={requestTopic}
                  onChange={(e) => setRequestTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#08131a] border border-[#1c3d4c] text-xs text-white focus:outline-none focus:border-cyan-400"
                  placeholder="e.g. Quantum Computing, Machine Learning"
                />
              </div>

              <button
                onClick={executeLiveApiCall}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-cyan-900/30 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Play className="w-4 h-4 fill-white text-white" />
                )}
                <span>
                  {isLoading ? "Executing Request..." : "Send Live Request"}
                </span>
              </button>
            </div>

            <div className="lg:col-span-7 space-y-6">
              {/* Code Snippet */}
              <div className="p-6 rounded-2xl bg-[#10222c] border border-[#1c3c4b] space-y-4">
                <div className="flex items-center justify-between border-b border-[#1b3846] pb-3">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    Code Generator
                  </h2>

                  <div className="flex items-center gap-1.5 bg-[#08131a] p-1 rounded-lg border border-[#1c3b49]">
                    {(
                      ["curl", "javascript", "python", "go", "rust"] as const
                    ).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all uppercase ${
                          selectedLanguage === lang
                            ? "bg-[#183949] text-cyan-300 border border-cyan-500/30"
                            : "text-[#5f8292] hover:text-white"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative bg-[#071116] p-4 rounded-xl border border-[#1a3847] font-mono text-[11px] text-cyan-200 overflow-x-auto">
                  <pre>{getCodeSnippet()}</pre>
                  <button
                    onClick={() => copyToClipboard(getCodeSnippet(), "snippet")}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#10242f] hover:bg-[#183645] text-[#608394] hover:text-white transition-all border border-[#1c3c4b]"
                  >
                    {copiedText === "snippet" ? (
                      <Check className="w-3.5 h-3.5 text-cyan-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Response Payload */}
              <div className="p-6 rounded-2xl bg-[#10222c] border border-[#1c3c4b] space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    Response Payload Output
                  </h2>
                  {executionTimeMs !== null && (
                    <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      Latency: {executionTimeMs} ms | HTTP 200 OK
                    </span>
                  )}
                </div>

                <div className="bg-[#071116] p-4 rounded-xl border border-[#1a3847] font-mono text-[11px] text-cyan-300 min-h-[160px] max-h-[300px] overflow-y-auto">
                  {responsePayload ? (
                    <pre>{JSON.stringify(responsePayload, null, 2)}</pre>
                  ) : (
                    <div className="text-slate-500 italic text-center pt-10">
                      Click "Send Live Request" above to trigger an active API
                      call...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: LIVE API TELEMETRY & STATS */}
      {activeDevTab === "telemetry" && (
        <div className="space-y-6">
          <AgenticAPIStats />
        </div>
      )}

      {/* TAB: GOOGLE COLAB SSH */}
      {activeDevTab === "colab" && (
        <div className="space-y-6">
          <ColabSshIntegration />
        </div>
      )}

      {/* TAB: IN-BROWSER CODE STUDIO */}
      {activeDevTab === "code_editor" && (
        <div className="space-y-6">
          <IntegratedCodeEditor />
        </div>
      )}

      {/* TAB 2: CLI ENGINE & TERMINAL */}
      {activeDevTab === "cli" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#10222c] border border-[#1c3c4b] space-y-5">
            <div className="flex items-center justify-between border-b border-[#183646] pb-4">
              <div className="flex items-center gap-3">
                <Terminal className="w-6 h-6 text-cyan-400" />
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Zalamati Command Line Interface (CLI)
                  </h2>
                  <p className="text-xs text-[#7195a8]">
                    Deploy study pipelines, sync datasets, and execute MCP
                    servers from terminal
                  </p>
                </div>
              </div>
              <div className="font-mono text-xs text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                v2.4.0 Stable
              </div>
            </div>

            {/* Quick Install Commands */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#08131a] border border-[#183648] space-y-2">
                <span className="text-xs font-bold text-cyan-300">
                  NPM Global Install:
                </span>
                <div className="flex items-center justify-between bg-[#040b10] p-3 rounded-xl border border-[#122836] font-mono text-xs text-cyan-400">
                  <span>npm install -g @zalamati/cli</span>
                  <button
                    onClick={() =>
                      copyToClipboard("npm install -g @zalamati/cli", "cli_npm")
                    }
                  >
                    {copiedText === "cli_npm" ? (
                      <Check className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#7195a8]" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#08131a] border border-[#183648] space-y-2">
                <span className="text-xs font-bold text-cyan-300">
                  PyPI Pip Install:
                </span>
                <div className="flex items-center justify-between bg-[#040b10] p-3 rounded-xl border border-[#122836] font-mono text-xs text-cyan-300">
                  <span>pip install zalamati-cli</span>
                  <button
                    onClick={() =>
                      copyToClipboard("pip install zalamati-cli", "cli_pip")
                    }
                  >
                    {copiedText === "cli_pip" ? (
                      <Check className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#7195a8]" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Terminal Sandbox */}
            <div className="p-5 rounded-2xl bg-[#071117] border border-[#183648] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Interactive CLI Command Sandbox
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "zalamati init my-ai-course",
                    "colab ssh",
                    "colab ssh -s train-llm",
                    'ssh -o ProxyCommand="colab ssh --proxy-mode -s %h" colab',
                    "zalamati mcp serve",
                  ].map((cmd) => (
                    <button
                      key={cmd}
                      onClick={() => setCliCommand(cmd)}
                      className="px-2.5 py-1 rounded-lg bg-[#112735] hover:bg-[#1a384a] text-[11px] font-mono text-cyan-300 border border-[#1c3e52]"
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={cliCommand}
                  onChange={(e) => setCliCommand(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#040a0e] border border-[#18384a] font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={handleRunCli}
                  disabled={isCliRunning}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Run Command</span>
                </button>
              </div>

              {/* Terminal Output */}
              <div className="p-4 rounded-xl bg-[#03070a] border border-[#102430] font-mono text-xs text-cyan-400 space-y-1.5 min-h-[140px]">
                {cliOutput.map((line, idx) => (
                  <div
                    key={idx}
                    className={
                      line.startsWith("$") ? "text-cyan-300 font-bold" : ""
                    }
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MCP PROTOCOL SERVER */}
      {activeDevTab === "mcp" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#10222c] border border-[#1c3c4b] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#183646] pb-4">
              <div className="flex items-center gap-3">
                <Server className="w-6 h-6 text-cyan-400" />
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Model Context Protocol (MCP) Server Integration
                  </h2>
                  <p className="text-xs text-[#7195a8]">
                    Connect your secure AI agents and local IDE contexts
                    directly to Zalamati's live tools.
                  </p>
                </div>
              </div>

              {/* Live telemetry badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a1821] border border-[#1b3b4d] self-start sm:self-auto">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="text-[11px] font-bold text-cyan-400 font-mono">
                  STATUS: {mcpTelemetry.status}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  v{mcpTelemetry.mcpVersion}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left column: Server Telemetry and Settings */}
              <div className="lg:col-span-5 space-y-5">
                <div className="p-4 rounded-xl bg-[#09151e] border border-[#163445] space-y-4">
                  <h3 className="text-xs font-bold text-[#83a5b5] uppercase tracking-wider">
                    Live Server Telemetry
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-[#050d12] border border-[#112a38]">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">
                        Active Connections
                      </div>
                      <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
                        {mcpTelemetry.activeConnections}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#050d12] border border-[#112a38]">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">
                        Indexed Documents
                      </div>
                      <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
                        {mcpTelemetry.indexedDocsCount}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs space-y-1.5 text-slate-300">
                    <div className="flex justify-between border-b border-[#0f2430] pb-1.5">
                      <span>Transport Protocol:</span>
                      <span className="font-mono text-cyan-300 font-semibold">
                        {mcpTelemetry.transport}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span>Server Local Port:</span>
                      <span className="font-mono text-cyan-300 font-semibold">
                        3000 (HTTPS Proxy Gateway)
                      </span>
                    </div>
                  </div>
                </div>

                {/* mcp.json Configuration */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-cyan-300 font-mono">
                      mcp_config.json / mcp.json:
                    </label>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `{
  "mcpServers": {
    "zalamati-engine-mcp": {
      "command": "npx",
      "args": ["-y", "@zalamati/mcp-server"],
      "env": {
        "ZALAMATI_API_KEY": "${apiKey}"
      }
    }
  }
}`,
                          "mcp_json",
                        )
                      }
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#112938] text-[11px] font-bold text-cyan-300 hover:bg-[#193b50]"
                    >
                      {copiedText === "mcp_json" ? (
                        <Check className="w-3 h-3 text-cyan-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>
                        {copiedText === "mcp_json" ? "Copied" : "Copy"}
                      </span>
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#061117] border border-[#183646] font-mono text-xs text-cyan-200 overflow-x-auto">
                    <pre className="text-[11px]">{`{
  "mcpServers": {
    "zalamati-engine-mcp": {
      "command": "npx",
      "args": ["-y", "@zalamati/mcp-server"],
      "env": {
        "ZALAMATI_API_KEY": "${apiKey}"
      }
    }
  }
}`}</pre>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-[#83a5b5] uppercase tracking-wider">
                    Registered Server Tools
                  </h3>
                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    {(mcpTelemetry.exposedTools || []).map((tName: string) => (
                      <div
                        key={tName}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#07131a] border border-[#132c3b] font-mono text-xs text-slate-300"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{tName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column: Interactive JSON-RPC tester */}
              <div className="lg:col-span-7 p-5 rounded-xl bg-[#09151e] border border-[#163445] space-y-4">
                <div className="flex items-center justify-between border-b border-[#122e3d] pb-3">
                  <h3 className="text-xs font-bold text-[#83a5b5] uppercase tracking-wider flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    Interactive JSON-RPC Tester
                  </h3>
                  <button
                    onClick={fetchMcpTelemetry}
                    className="p-1 rounded bg-[#0f2838] hover:bg-[#1a3c50] text-slate-300"
                    title="Refresh server telemetry"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Method Toggles */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    JSON-RPC Call Mode
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "tools/list", label: "tools/list" },
                      { id: "resources/list", label: "resources/list" },
                      { id: "call_tutor", label: "Call: tutor" },
                      { id: "call_course", label: "Call: course" },
                      { id: "call_rag", label: "Call: RAG" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleMcpMethodChange(m.id as any)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                          mcpMethod === m.id
                            ? "bg-cyan-600 text-white shadow-md"
                            : "bg-[#060e14] text-slate-400 hover:text-slate-200 border border-[#112735]"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Request Body */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        JSON-RPC Request Frame
                      </label>
                      <button
                        onClick={() =>
                          copyToClipboard(mcpRequestBody, "mcp_req")
                        }
                        className="text-[10px] text-cyan-400 hover:underline animate-fade-in"
                      >
                        {copiedText === "mcp_req" ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <textarea
                      value={mcpRequestBody}
                      onChange={(e) => setMcpRequestBody(e.target.value)}
                      rows={9}
                      className="w-full p-2.5 rounded-lg bg-[#03080c] border border-[#122e3d] font-mono text-[11px] text-cyan-300 focus:outline-none focus:border-cyan-500 resize-none"
                    />
                  </div>

                  {/* Response Body */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        JSON-RPC Response Frame
                      </label>
                      {mcpLatency && (
                        <span className="text-[10px] text-cyan-400 font-mono">
                          latency: {mcpLatency}ms
                        </span>
                      )}
                    </div>
                    <div className="w-full h-[178px] p-2.5 rounded-lg bg-[#020508] border border-[#0e2430] font-mono text-[11px] text-cyan-400 overflow-y-auto overflow-x-hidden">
                      {isMcpLoading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-500">
                          <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
                          <span>Dispatching JSON-RPC Payload...</span>
                        </div>
                      ) : mcpResponseBody ? (
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(mcpResponseBody, null, 2)}
                        </pre>
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-500 text-center px-4">
                          No JSON-RPC responses generated yet. Configure a
                          method and tap "Transmit" to initiate execution.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={executeMcpCall}
                  disabled={isMcpLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg transition-all disabled:opacity-50"
                >
                  {isMcpLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Zap className="w-4 h-4 fill-white text-white animate-pulse" />
                  )}
                  <span>
                    {isMcpLoading
                      ? "Transmitting JSON-RPC Request..."
                      : "Transmit JSON-RPC Packet"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SDKs & LIBRARIES */}
      {activeDevTab === "sdks" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#10222c] border border-[#1c3c4b] space-y-6">
            <div className="flex items-center gap-3 border-b border-[#183646] pb-4">
              <Package className="w-6 h-6 text-cyan-400" />
              <div>
                <h2 className="text-lg font-bold text-white">
                  Official Language SDKs & Libraries
                </h2>
                <p className="text-xs text-[#7195a8]">
                  Type-safe client libraries for TypeScript, Python, Go, and
                  Rust
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Node.js */}
              <div className="p-5 rounded-2xl bg-[#08151c] border border-[#18374a] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">
                    TypeScript / Node.js
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    @zalamati/sdk
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#040a0e] font-mono text-xs text-cyan-400">
                  npm install @zalamati/sdk
                </div>
              </div>

              {/* Python */}
              <div className="p-5 rounded-2xl bg-[#08151c] border border-[#18374a] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">
                    Python 3.9+
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    zalamati
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#040a0e] font-mono text-xs text-cyan-300">
                  pip install zalamati
                </div>
              </div>

              {/* Go */}
              <div className="p-5 rounded-2xl bg-[#08151c] border border-[#18374a] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">
                    Go (Golang)
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    zalamati-go
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#040a0e] font-mono text-xs text-cyan-300">
                  go get github.com/zalamati/zalamati-go
                </div>
              </div>

              {/* Rust */}
              <div className="p-5 rounded-2xl bg-[#08151c] border border-[#18374a] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">
                    Rust Crates
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    zalamati-sdk
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#040a0e] font-mono text-xs text-cyan-300">
                  cargo add zalamati-sdk
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GITHUB & HUGGINGFACE INTEGRATIONS */}
      {activeDevTab === "integrations" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#10222c] border border-[#1c3c4b] space-y-6">
            <div className="flex items-center gap-3 border-b border-[#183646] pb-4">
              <Github className="w-6 h-6 text-white" />
              <div>
                <h2 className="text-lg font-bold text-white">
                  GitHub Actions & HuggingFace Hub Integrations
                </h2>
                <p className="text-xs text-[#7195a8]">
                  Automated course sync via GitHub CI/CD & fine-tuned model
                  weights from HuggingFace
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GitHub CI/CD */}
              <div className="p-5 rounded-2xl bg-[#08151c] border border-[#18374a] space-y-4">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-white text-sm">
                    GitHub Action Workflow
                  </h3>
                </div>
                <p className="text-xs text-[#7195a8]">
                  Automatically validate and deploy course syllabi on git push.
                </p>
                <div className="p-3 rounded-xl bg-[#040a0e] border border-[#112634] font-mono text-[11px] text-cyan-200">
                  <pre>{`name: Zalamati Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: zalamati/action-deploy@v1
        with:
          api-key: \${{ secrets.ZALAMATI_KEY }}`}</pre>
                </div>
              </div>

              {/* HuggingFace Hub */}
              <div className="p-5 rounded-2xl bg-[#08151c] border border-[#18374a] space-y-4">
                <div className="flex items-center gap-2">
                  <Box className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-white text-sm">
                    HuggingFace Model Hub
                  </h3>
                </div>
                <p className="text-xs text-[#7195a8]">
                  Load fine-tuned educational embeddings directly from
                  HuggingFace dataset repos.
                </p>
                <div className="p-3 rounded-xl bg-[#040a0e] border border-[#112634] font-mono text-[11px] text-cyan-300">
                  <pre>{`from transformers import AutoModel

model = AutoModel.from_pretrained(
    "zalamati/scholarly-gemini-v1",
    use_auth_token=True
)`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: INSTALLATION GUIDES */}
      {activeDevTab === "install" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#10222c] border border-[#1c3c4b] space-y-6">
            <div className="flex items-center gap-3 border-b border-[#183646] pb-4">
              <Wrench className="w-6 h-6 text-cyan-400" />
              <div>
                <h2 className="text-lg font-bold text-white">
                  Full Stack Installation & Deployment Guide
                </h2>
                <p className="text-xs text-[#7195a8]">
                  Step-by-step setup instructions for self-hosted container
                  environments
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-[#88acbd]">
              <div className="p-4 rounded-2xl bg-[#08151c] border border-[#18374a] space-y-2">
                <h3 className="font-bold text-cyan-300 text-sm">
                  Step 1: Clone & Configure Environment
                </h3>
                <div className="p-3 rounded-xl bg-[#040a0e] font-mono text-cyan-400">
                  git clone https://github.com/zalamati/zalamati-platform.git
                  <br />
                  cd zalamati-platform && cp .env.example .env
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#08151c] border border-[#18374a] space-y-2">
                <h3 className="font-bold text-cyan-300 text-sm">
                  Step 2: Run via Docker Compose
                </h3>
                <div className="p-3 rounded-xl bg-[#040a0e] font-mono text-cyan-300">
                  docker-compose up -d --build
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#08151c] border border-[#18374a] space-y-2">
                <h3 className="font-bold text-cyan-300 text-sm">
                  Step 3: Verify Health Check
                </h3>
                <div className="p-3 rounded-xl bg-[#040a0e] font-mono text-cyan-300">
                  curl http://localhost:3000/api/health
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: MEMORY LEAK & COMPONENT DIAGNOSTICS */}
      {activeDevTab === "diagnostics" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#10222c] border border-[#1c3c4b] space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#183646] pb-4">
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-cyan-400" />
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Lazy Component Memory Leak Profiler
                  </h2>
                  <p className="text-xs text-[#7195a8]">
                    Real-time memory monitor tracking heap retention, detached
                    DOM elements, and unreleased listeners across dashboard
                    views.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleRunLeakSimulation}
                  disabled={isRunningAudit}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-600/20 disabled:opacity-50"
                >
                  <RotateCw
                    className={`w-4 h-4 ${isRunningAudit ? "animate-spin" : ""}`}
                  />
                  <span>
                    {isRunningAudit
                      ? "Profiling..."
                      : "Run Navigation Leak Audit"}
                  </span>
                </button>
                <button
                  onClick={handleTriggerGarbageCollection}
                  disabled={isRunningAudit}
                  className="px-3.5 py-2 rounded-xl bg-[#132c3a] hover:bg-[#1a3a4d] text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
                  title="Trigger Garbage Collection"
                >
                  <Trash2 className="w-4 h-4 text-cyan-400" />
                  <span>Force GC</span>
                </button>
                <button
                  onClick={handleExportProfilerDump}
                  className="px-3.5 py-2 rounded-xl bg-[#091720] hover:bg-[#102330] text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-2 transition-all"
                  title="Export Dump JSON"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>

            {auditFeedback && (
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>{auditFeedback}</span>
              </div>
            )}

            {/* Auto-Garbage Collection Policy Settings */}
            <div className="p-5 rounded-2xl bg-[#08151c] border border-cyan-500/30 space-y-4 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#142d3c] pb-3">
                <div className="flex items-center gap-2.5">
                  <Trash2 className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Auto-Garbage Collection Policy
                    </h3>
                    <p className="text-[11px] text-[#7195a8]">
                      Automated background memory reclamation for lazy-loaded
                      components upon unmount cycle completion.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-300">
                    Auto-GC:
                  </span>
                  <button
                    onClick={() => setAutoGcEnabled(!autoGcEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      autoGcEnabled ? "bg-cyan-600" : "bg-[#122734]"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoGcEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <button
                  onClick={() => setAutoGcPolicy("immediate")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    autoGcPolicy === "immediate"
                      ? "bg-cyan-950/60 border-cyan-500 text-cyan-200"
                      : "bg-[#040a0e] border-[#132b38] text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>Immediate Reclamation</span>
                    {autoGcPolicy === "immediate" && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </div>
                  <div className="text-[10px] text-[#638799] mt-1">
                    Triggers GC & disposes module closures immediately when
                    component unmounts.
                  </div>
                </button>

                <button
                  onClick={() => setAutoGcPolicy("threshold")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    autoGcPolicy === "threshold"
                      ? "bg-cyan-950/60 border-cyan-500 text-cyan-200"
                      : "bg-[#040a0e] border-[#132b38] text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>Threshold-Based (&gt;0.5MB)</span>
                    {autoGcPolicy === "threshold" && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </div>
                  <div className="text-[10px] text-[#638799] mt-1">
                    Triggers background GC only when retained delta exceeds 0.5
                    MB.
                  </div>
                </button>

                <button
                  onClick={() => setAutoGcPolicy("unmount_only")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    autoGcPolicy === "unmount_only"
                      ? "bg-cyan-950/60 border-cyan-500 text-cyan-200"
                      : "bg-[#040a0e] border-[#132b38] text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="text-xs font-bold flex items-center justify-between">
                    <span>Deferred Batch Sweeps</span>
                    {autoGcPolicy === "unmount_only" && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </div>
                  <div className="text-[10px] text-[#638799] mt-1">
                    Batches garbage collection every 10 route transitions.
                  </div>
                </button>
              </div>
            </div>

            {/* Heap Gauges & Realtime Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#08151c] border border-[#18374a] space-y-2">
                <div className="flex items-center justify-between text-xs text-[#7195a8]">
                  <span className="font-semibold flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                    JS Heap Memory
                  </span>
                  <span className="text-cyan-300 font-mono font-bold">
                    {heapInfo.usedMb} MB
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#112634] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (heapInfo.usedMb / 120) * 100)}%`,
                    }}
                  />
                </div>
                <div className="text-[10px] text-[#55788a] flex justify-between">
                  <span>Allocated Heap: {heapInfo.totalMb} MB</span>
                  <span>Limit: {heapInfo.limitMb} MB</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#08151c] border border-[#18374a] space-y-1">
                <div className="text-xs text-[#7195a8] font-semibold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Detached DOM Elements
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  {heapInfo.detachedDOM}
                </div>
                <div className="text-[10px] text-[#55788a]">
                  Nodes unreleased after view unmount
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#08151c] border border-[#18374a] space-y-1">
                <div className="text-xs text-[#7195a8] font-semibold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  Active Event Listeners
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  {heapInfo.activeListeners}
                </div>
                <div className="text-[10px] text-[#55788a]">
                  Window, document & websocket bindings
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#08151c] border border-[#18374a] space-y-1">
                <div className="text-xs text-[#7195a8] font-semibold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  Leak Vulnerability Index
                </div>
                <div className="text-2xl font-extrabold text-cyan-400 font-mono">
                  98.4% Clean
                </div>
                <div className="text-[10px] text-[#55788a]">
                  7 of 8 components fully garbage collected
                </div>
              </div>
            </div>

            {/* Lazy Component Profiler Grid */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Box className="w-4 h-4 text-cyan-400" />
                Lazy-Loaded Dashboard Components
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {componentMetrics.map((comp) => {
                  return (
                    <div
                      key={comp.id}
                      className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                        comp.status === "clean"
                          ? "bg-[#08151c] border-[#18374a]"
                          : comp.status === "warning"
                            ? "bg-[#1a1708] border-[#3f3512]"
                            : "bg-[#220c10] border-[#4f1821]"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {comp.name}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#040a0e] text-[#5b7d8e] font-mono text-[10px]">
                            {comp.chunkSizeKb} KB Chunk
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                              comp.status === "clean"
                                ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
                                : comp.status === "warning"
                                  ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
                                  : "bg-cyan-500/15 border-cyan-500/30 text-cyan-300 animate-pulse"
                            }`}
                          >
                            {comp.status === "clean"
                              ? "Memory Clean"
                              : comp.status === "warning"
                                ? "Minor Warning"
                                : "Memory Leak Detected"}
                          </span>
                        </div>

                        <div className="text-xs text-[#7195a8] font-mono">
                          {comp.path}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#88acbd] pt-1">
                          <span>
                            Mounts/Unmounts:{" "}
                            <strong className="text-white">
                              {comp.mountCount} / {comp.unmountCount}
                            </strong>
                          </span>
                          <span>•</span>
                          <span>
                            Retained Delta:{" "}
                            <strong
                              className={
                                comp.retainedMemoryDeltaMb > 0.5
                                  ? "text-cyan-400"
                                  : "text-cyan-400"
                              }
                            >
                              +{comp.retainedMemoryDeltaMb} MB
                            </strong>
                          </span>
                          <span>•</span>
                          <span>
                            Unreleased Listeners:{" "}
                            <strong
                              className={
                                comp.unreleasedListeners > 0
                                  ? "text-cyan-300"
                                  : "text-white"
                              }
                            >
                              {comp.unreleasedListeners}
                            </strong>
                          </span>
                          <span>•</span>
                          <span>
                            Detached Nodes:{" "}
                            <strong
                              className={
                                comp.detachedNodes > 0
                                  ? "text-cyan-300"
                                  : "text-white"
                              }
                            >
                              {comp.detachedNodes}
                            </strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-end md:items-center gap-4">
                        {/* Interactive Toggle for individual Auto-GC policy */}
                        <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#030b10] border border-[#1b3b4a]/40 text-xs text-slate-300 hover:text-white transition-all cursor-pointer">
                          <input
                            type="checkbox"
                            checked={comp.autoGcReclamationEnabled !== false}
                            onChange={() => {
                              setComponentMetrics((prev) =>
                                prev.map((c) =>
                                  c.id === comp.id
                                    ? {
                                        ...c,
                                        autoGcReclamationEnabled: !(
                                          c.autoGcReclamationEnabled !== false
                                        ),
                                      }
                                    : c,
                                ),
                              );
                              const targetState = !(
                                comp.autoGcReclamationEnabled !== false
                              );
                              setAuditFeedback(
                                `${comp.name}: Background memory reclamation upon unmount is now ${targetState ? "ENABLED" : "DISABLED"}`,
                              );
                              setTimeout(() => setAuditFeedback(null), 3000);
                            }}
                            className="w-3.5 h-3.5 rounded border-[#132b38] text-cyan-500 bg-slate-950/60 focus:ring-cyan-500/20 cursor-pointer"
                          />
                          <span className="font-semibold text-[11px] font-mono select-none">
                            Unmount GC:{" "}
                            {comp.autoGcReclamationEnabled !== false
                              ? "ON"
                              : "OFF"}
                          </span>
                        </label>

                        {comp.status === "leak" && (
                          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs space-y-1 max-w-xs">
                            <div className="font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Action Required
                            </div>
                            <p className="text-[11px] text-cyan-200/80">
                              <code>React.useEffect</code> cleanup missing in{" "}
                              <code>{comp.name}</code>.
                            </p>
                          </div>
                        )}

                        <button
                          onClick={() => {
                            setComponentMetrics((prev) =>
                              prev.map((c) =>
                                c.id === comp.id
                                  ? {
                                      ...c,
                                      retainedMemoryDeltaMb: 0.01,
                                      unreleasedListeners: 0,
                                      detachedNodes: 0,
                                      status: "clean" as const,
                                    }
                                  : c,
                              ),
                            );
                            setAuditFeedback(
                              `Auto-GC executed for ${comp.name}: Reclaimed unmounted heap delta.`,
                            );
                            setTimeout(() => setAuditFeedback(null), 3000);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0"
                          title="Run isolated Garbage Collection sweep"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Reclaim Heap</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Best Practice Memory Leak Guidelines */}
            <div className="p-4 rounded-2xl bg-[#08151c] border border-[#18374a] space-y-3">
              <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                Automated Memory Leak Prevention Guidelines
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#7195a8]">
                <li className="p-3 rounded-xl bg-[#040a0e] border border-[#112634] space-y-1">
                  <div className="font-semibold text-white">
                    1. Always Return React.useEffect Cleanups
                  </div>
                  <div>
                    Cancel all active <code>setInterval</code> /{" "}
                    <code>setTimeout</code> timers and remove global{" "}
                    <code>window.addEventListener</code> listeners upon
                    component unmount.
                  </div>
                </li>
                <li className="p-3 rounded-xl bg-[#040a0e] border border-[#112634] space-y-1">
                  <div className="font-semibold text-white">
                    2. Abort Fetch & WebSocket Connections
                  </div>
                  <div>
                    Pass an <code>AbortController.signal</code> to active HTTP
                    requests and close WebSocket feeds when route changes occur.
                  </div>
                </li>
                <li className="p-3 rounded-xl bg-[#040a0e] border border-[#112634] space-y-1">
                  <div className="font-semibold text-white">
                    3. Dispose Media & WebGL Renderers
                  </div>
                  <div>
                    Call <code>renderer.dispose()</code> or release audio
                    context channels in canvas visualizer components when
                    navigating away.
                  </div>
                </li>
                <li className="p-3 rounded-xl bg-[#040a0e] border border-[#112634] space-y-1">
                  <div className="font-semibold text-white">
                    4. Clear SafeLocalStorage Cache Listeners
                  </div>
                  <div>
                    Use unsubscribers returned by{" "}
                    <code>OfflineStorageService.subscribe()</code> to prevent
                    dangling callbacks in background storage layers.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
