import React from "react";
import {
  Code2,
  Play,
  Terminal,
  Save,
  Download,
  Copy,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  Maximize2,
  Minimize2,
  Cpu,
  CloudLightning,
  RefreshCw,
  FolderCode,
  FileCode,
  Sparkles,
  Layers,
  Settings2,
  Activity,
  AlertCircle
} from "lucide-react";
import {
  colabRemoteService,
  ColabConnectionState,
  ColabRemoteEvent
} from "../services/ColabRemoteService";

interface EditorFile {
  id: string;
  name: string;
  language: "python" | "typescript" | "sql" | "json" | "bash";
  path: string;
  content: string;
}

const DEFAULT_FILES: EditorFile[] = [
  {
    id: "main_py",
    name: "main.py",
    language: "python",
    path: "/content/main.py",
    content: `# Google Colab GPU Diagnostic & PyTorch Pipeline
import torch
import sys
import time

print("=" * 60)
print(f"Python Runtime: {sys.version.split()[0]}")
print(f"PyTorch Version: {torch.__version__}")

cuda_available = torch.cuda.is_available()
print(f"CUDA Hardware Acceleration: {cuda_available}")

if cuda_available:
    gpu_name = torch.cuda.get_device_name(0)
    device_count = torch.cuda.device_count()
    total_memory = torch.cuda.get_device_properties(0).total_memory / (1024 ** 3)
    print(f"Device Count: {device_count}")
    print(f"Active GPU: {gpu_name} ({total_memory:.2f} GB VRAM)")
    
    # Simple Matrix Multiplication on GPU
    print("\\n[Test] Running tensor multiplication on CUDA...")
    start_t = time.time()
    x = torch.randn(4096, 4096, device="cuda")
    y = torch.matmul(x, x)
    torch.cuda.synchronize()
    duration = (time.time() - start_t) * 1000
    print(f"Matrix Multiply (4096 x 4096) complete in: {duration:.2f} ms")
else:
    print("WARNING: CUDA is not active. Using CPU fallback.")

print("=" * 60)
print("Execution successfully verified on /content workspace!")
`
  },
  {
    id: "train_py",
    name: "train.py",
    language: "python",
    path: "/content/train.py",
    content: `# Autonomous Agentic Training & Fine-Tuning Loop
import time

def run_agentic_training():
    print("[Trainer] Preparing data batch loaders in /content/data...")
    epochs = 4
    for ep in range(1, epochs + 1):
        time.sleep(0.4)
        loss = round(0.48 / (ep ** 0.65), 4)
        acc = round(82.4 + (ep * 3.8), 2)
        print(f"Epoch [{ep}/{epochs}] | Train Loss: {loss} | Accuracy: {acc}% | GPU Temp: 49°C")

    print("[Trainer] Optimization complete. Model weights saved to /content/model.safetensors")

if __name__ == "__main__":
    run_agentic_training()
`
  },
  {
    id: "agent_ts",
    name: "agent.ts",
    language: "typescript",
    path: "/content/agent.ts",
    content: `// Zalamati Autonomous Agent Pipeline Driver
import { GoogleGenAI } from "@google/genai";

export interface AgentDecision {
  action: "RESEARCH" | "COMPILE" | "DEPLOY";
  targetNode: string;
  confidence: number;
}

export async function executeAutonomousStep(prompt: string): Promise<AgentDecision> {
  console.log("[Agent Core] Analyzing educational context:", prompt);
  return {
    action: "COMPILE",
    targetNode: "colab-gpu-worker-01",
    confidence: 0.984
  };
}
`
  },
  {
    id: "pipeline_sql",
    name: "schema.sql",
    language: "sql",
    path: "/content/schema.sql",
    content: `-- Zalamati Distributed Learning Schema
CREATE TABLE IF NOT EXISTS colab_runtimes (
    id VARCHAR(64) PRIMARY KEY,
    session_id VARCHAR(64) NOT NULL,
    gpu_type VARCHAR(128) NOT NULL,
    vram_allocated_gb NUMERIC(6, 2) DEFAULT 0,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO colab_runtimes (id, session_id, gpu_type, vram_allocated_gb, status)
VALUES ('node-1', 'colab', 'NVIDIA Tesla T4', 2.45, 'active')
ON CONFLICT (id) DO NOTHING;
`
  }
];

export const IntegratedCodeEditor: React.FC = () => {
  const [files, setFiles] = React.useState<EditorFile[]>(DEFAULT_FILES);
  const [activeFileId, setActiveFileId] = React.useState<string>("main_py");
  const [copied, setCopied] = React.useState<boolean>(false);
  const [savedStatus, setSavedStatus] = React.useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false);
  const [fontSize, setFontSize] = React.useState<number>(13);
  const [theme, setTheme] = React.useState<"vs-dark" | "monokai" | "liquid-cyan">("vs-dark");

  // Output terminal state
  const [consoleOutput, setConsoleOutput] = React.useState<string[]>([
    "Zalamati Integrated Code Editor & Colab Runtime v3.2",
    "Connected to workspace: /content",
    "Ready to execute code against Google Colab GPU or local sandbox."
  ]);
  const [isRunning, setIsRunning] = React.useState<boolean>(false);
  const [cursorPos, setCursorPos] = React.useState<{ line: number; col: number }>({ line: 1, col: 1 });

  // Colab connection state
  const [colabState, setColabState] = React.useState<ColabConnectionState>(colabRemoteService.getState());
  const [sessionId, setSessionId] = React.useState<string>(colabRemoteService.getSessionId());
  const [reconnectInfo, setReconnectInfo] = React.useState<string | null>(null);

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const outputRef = React.useRef<HTMLDivElement | null>(null);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  React.useEffect(() => {
    // Subscribe to Colab Remote Service lifecycle & automatic reconnection
    const unsubscribe = colabRemoteService.subscribe((event: ColabRemoteEvent) => {
      setColabState(event.state);
      setSessionId(event.sessionId);

      if (event.type === "reconnect_attempt") {
        setReconnectInfo(event.message || `Reconnecting attempt...`);
      } else if (event.type === "reconnect_success") {
        setReconnectInfo(null);
        setConsoleOutput((prev) => [
          ...prev,
          `✔ [colab-ssh] Connection to /content restored successfully.`
        ]);
      } else if (event.type === "state_change") {
        if (event.state === "CONNECTED") {
          setReconnectInfo(null);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Update cursor position on selection or keyup
  const handleCursorUpdate = () => {
    if (!textareaRef.current) return;
    const text = textareaRef.current.value;
    const selStart = textareaRef.current.selectionStart;
    const lines = text.substring(0, selStart).split("\n");
    setCursorPos({
      line: lines.length,
      col: lines[lines.length - 1].length + 1
    });
  };

  const handleCodeChange = (newCode: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFileId ? { ...f, content: newCode } : f))
    );
  };

  const handleSave = () => {
    colabRemoteService.saveFileContent(activeFile.path, activeFile.content);
    setSavedStatus("Saved to /content");
    setTimeout(() => setSavedStatus(null), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([activeFile.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleNewFile = () => {
    const name = prompt("Enter new filename (e.g., test.py, utils.ts):", "script.py");
    if (!name || !name.trim()) return;

    const ext = name.split(".").pop()?.toLowerCase();
    let lang: EditorFile["language"] = "python";
    if (ext === "ts" || ext === "tsx") lang = "typescript";
    else if (ext === "sql") lang = "sql";
    else if (ext === "json") lang = "json";
    else if (ext === "sh" || ext === "bash") lang = "bash";

    const newFile: EditorFile = {
      id: `file_${Date.now()}`,
      name: name.trim(),
      language: lang,
      path: `/content/${name.trim()}`,
      content: `# ${name.trim()}\nprint("Hello from ${name.trim()}!")\n`
    };

    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newFile.id);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    handleSave();

    setConsoleOutput((prev) => [
      ...prev,
      `--------------------------------------------------------------------------------`,
      `[colab-ssh] Executing ${activeFile.path} on session "${sessionId}"...`,
      `[colab-ssh] Target: Google Colaboratory (/content)`
    ]);

    try {
      const cmd =
        activeFile.language === "python"
          ? `python3 ${activeFile.path}`
          : activeFile.language === "bash"
          ? `bash ${activeFile.path}`
          : `node -e 'console.log("Compiling and running ${activeFile.name}...")'`;

      const result = await colabRemoteService.executeCommand(cmd);

      setConsoleOutput((prev) => [
        ...prev,
        ...result.stdout,
        ...(result.stderr.length > 0 ? result.stderr.map((e) => `[stderr] ${e}`) : []),
        `[Process completed with exit code ${result.exitCode}]`
      ]);
    } catch (err: any) {
      setConsoleOutput((prev) => [
        ...prev,
        `[ERROR] Execution failed: ${err.message || "Unknown error"}`
      ]);
    } finally {
      setIsRunning(false);
      // Auto-scroll output to bottom
      setTimeout(() => {
        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
      }, 50);
    }
  };

  // Support Tab key indentation inside textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;
      const tabSpaces = "    ";

      const updated = value.substring(0, start) + tabSpaces + value.substring(end);
      handleCodeChange(updated);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + tabSpaces.length;
        handleCursorUpdate();
      }, 0);
    } else if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      handleSave();
    } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleRunCode();
    }
  };

  const lineCount = activeFile.content.split("\n").length;

  return (
    <div
      className={`rounded-2xl border border-[#16384c] bg-[#06121a] overflow-hidden flex flex-col shadow-2xl transition-all ${
        isFullscreen ? "fixed inset-2 z-50 rounded-xl" : "min-h-[640px]"
      }`}
    >
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#091823] border-b border-[#143447] gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-cyan-400 font-black text-xs tracking-wide">
            <Code2 className="w-4 h-4" />
            <span>ZALAMATI CODE STUDIO</span>
          </div>

          {/* Colab Connection State Badge */}
          <div className="flex items-center gap-2 pl-3 border-l border-[#16364a]">
            <div
              className={`w-2 h-2 rounded-full ${
                colabState === "CONNECTED"
                  ? "bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400"
                  : colabState === "RECONNECTING"
                  ? "bg-amber-400 animate-ping"
                  : colabState === "CONNECTING"
                  ? "bg-cyan-400 animate-pulse"
                  : "bg-red-400"
              }`}
            />
            <span className="text-[11px] font-mono text-[#89acc2]">
              Colab SSH:{" "}
              <strong
                className={
                  colabState === "CONNECTED"
                    ? "text-emerald-400"
                    : colabState === "RECONNECTING"
                    ? "text-amber-400"
                    : "text-cyan-300"
                }
              >
                {colabState}
              </strong>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0b2130] text-cyan-300 font-mono border border-[#153a50]">
              {sessionId}
            </span>

            {reconnectInfo && (
              <span className="text-[10px] text-amber-300 font-mono animate-pulse flex items-center gap-1">
                <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                <span>{reconnectInfo}</span>
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {savedStatus && (
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>{savedStatus}</span>
            </span>
          )}

          <button
            onClick={handleSave}
            title="Save (Ctrl+S)"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0e2738] hover:bg-[#14364c] text-xs font-mono text-[#9cc0d6] border border-[#194059] transition-all"
          >
            <Save className="w-3 h-3" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            onClick={handleCopyCode}
            title="Copy code"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0e2738] hover:bg-[#14364c] text-xs font-mono text-[#9cc0d6] border border-[#194059] transition-all"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
          </button>

          <button
            onClick={handleDownloadFile}
            title="Download file"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0e2738] hover:bg-[#14364c] text-xs font-mono text-[#9cc0d6] border border-[#194059] transition-all"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Run Code Button */}
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-all shadow-md shadow-cyan-500/20 active:scale-95 ml-1"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Run in Colab (Ctrl+Enter)</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-[#0e2738] hover:bg-[#14364c] text-[#82a6ba] hover:text-white transition-all ml-1"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Tabs & File Navigation Bar */}
      <div className="flex items-center justify-between bg-[#040c12] px-3 py-1.5 border-b border-[#122c3c] overflow-x-auto">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {files.map((file) => {
            const isActive = file.id === activeFileId;
            return (
              <button
                key={file.id}
                onClick={() => setActiveFileId(file.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 ${
                  isActive
                    ? "bg-[#0c2230] text-cyan-300 border border-[#173f57] shadow-sm"
                    : "text-[#6f90a2] hover:text-[#a0c2d6] hover:bg-[#081720]"
                }`}
              >
                <FileCode
                  className={`w-3.5 h-3.5 ${
                    file.name.endsWith(".py")
                      ? "text-yellow-400"
                      : file.name.endsWith(".ts")
                      ? "text-blue-400"
                      : file.name.endsWith(".sql")
                      ? "text-orange-400"
                      : "text-cyan-400"
                  }`}
                />
                <span>{file.name}</span>
              </button>
            );
          })}

          <button
            onClick={handleNewFile}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-mono text-[#608294] hover:text-cyan-300 hover:bg-[#091b26] transition-all ml-1"
            title="Create new file"
          >
            <Plus className="w-3 h-3" />
            <span>New File</span>
          </button>
        </div>

        {/* Editor Settings (Theme, Font) */}
        <div className="hidden md:flex items-center gap-3 text-xs text-[#7195a8] font-mono shrink-0 pl-3">
          <div className="flex items-center gap-1.5">
            <span>Size:</span>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="bg-[#091924] border border-[#14364c] rounded px-1.5 py-0.5 text-cyan-300 text-xs focus:outline-none"
            >
              <option value={12}>12px</option>
              <option value={13}>13px</option>
              <option value={14}>14px</option>
              <option value={16}>16px</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Theme:</span>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as any)}
              className="bg-[#091924] border border-[#14364c] rounded px-1.5 py-0.5 text-cyan-300 text-xs focus:outline-none"
            >
              <option value="vs-dark">VS Dark</option>
              <option value="monokai">Monokai Pro</option>
              <option value="liquid-cyan">Liquid Glass</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Workspace: Code Area (Left/Top) and Terminal (Right/Bottom) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 bg-[#020609]">
        {/* Code Editor Area */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col border-b lg:border-b-0 lg:border-r border-[#122e3e] min-h-[340px]">
          <div className="relative flex-1 flex overflow-hidden">
            {/* Line Number Gutter */}
            <div className="w-12 select-none py-3 text-right pr-3 font-mono text-xs text-[#406173] bg-[#03090e] border-r border-[#0d212d] leading-6 overflow-hidden">
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Code Input Area */}
            <textarea
              ref={textareaRef}
              value={activeFile.content}
              onChange={(e) => {
                handleCodeChange(e.target.value);
                handleCursorUpdate();
              }}
              onSelect={handleCursorUpdate}
              onKeyUp={handleCursorUpdate}
              onClick={handleCursorUpdate}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              style={{ fontSize: `${fontSize}px`, lineHeight: "24px" }}
              className={`flex-1 p-3 bg-transparent font-mono resize-none focus:outline-none overflow-y-auto leading-6 ${
                theme === "monokai"
                  ? "text-[#f8f8f2] selection:bg-[#49483e]"
                  : theme === "liquid-cyan"
                  ? "text-cyan-200 selection:bg-cyan-900/60"
                  : "text-[#d4d4d4] selection:bg-[#264f78]"
              }`}
            />
          </div>

          {/* Bottom Editor Status Bar */}
          <div className="flex items-center justify-between px-3 py-1 bg-[#040c12] border-t border-[#0d222e] text-[11px] font-mono text-[#5c7e90]">
            <div className="flex items-center gap-3">
              <span>
                Ln {cursorPos.line}, Col {cursorPos.col}
              </span>
              <span>{lineCount} lines</span>
              <span>{activeFile.content.length} chars</span>
              <span>UTF-8</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="capitalize">{activeFile.language}</span>
              <span className="text-cyan-400">Google Colab Runtime</span>
            </div>
          </div>
        </div>

        {/* Live Terminal & Execution Console Area */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col bg-[#03080c] min-h-[220px]">
          <div className="flex items-center justify-between px-3 py-2 bg-[#050e14] border-b border-[#0f2430]">
            <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>COLAB OUTPUT & CONSOLE</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setConsoleOutput([])}
                className="text-[10px] font-mono text-[#678b9e] hover:text-white px-2 py-0.5 rounded hover:bg-[#0a1924] transition-all"
                title="Clear console output"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Terminal Screen */}
          <div
            ref={outputRef}
            className="flex-1 p-3 font-mono text-xs text-[#8cb1c4] overflow-y-auto space-y-1 select-text"
          >
            {consoleOutput.map((line, idx) => (
              <div
                key={idx}
                className={
                  line.startsWith("[colab-ssh]")
                    ? "text-cyan-300 font-semibold"
                    : line.startsWith("✔")
                    ? "text-emerald-400 font-semibold"
                    : line.startsWith("[ERROR]") || line.includes("WARNING")
                    ? "text-amber-400"
                    : line.includes("Epoch [")
                    ? "text-emerald-300"
                    : line.startsWith("=") || line.startsWith("-")
                    ? "text-[#395667]"
                    : "text-[#9bc0d5]"
                }
              >
                {line}
              </div>
            ))}
            {isRunning && (
              <div className="flex items-center gap-2 text-cyan-400 animate-pulse pt-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Executing in Colab GPU container...</span>
              </div>
            )}
          </div>

          {/* Quick Hardware Diagnostic Bar */}
          <div className="p-2.5 bg-[#050e14] border-t border-[#0f2430] flex items-center justify-between text-[11px] font-mono text-[#688a9c]">
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>NVIDIA Tesla T4 (16GB)</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-300">
              <span>CUDA 12.2</span>
              <span>•</span>
              <span>/content</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
