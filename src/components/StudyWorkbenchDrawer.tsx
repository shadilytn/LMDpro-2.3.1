import React from "react";
import {
  Code2,
  FileText,
  Play,
  Save,
  X,
  Maximize2,
  Minimize2,
  Sparkles,
  Zap,
  BrainCircuit,
  Timer,
} from "lucide-react";
import { FlashcardDeckSystem } from "./FlashcardDeckSystem";
import { FocusPomodoroTimer } from "./FocusPomodoroTimer";
import { UserProfile } from "../shared/types";

interface StudyWorkbenchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lessonContext?: string;
  user?: UserProfile;
}

export const StudyWorkbenchDrawer: React.FC<StudyWorkbenchDrawerProps> = ({
  isOpen,
  onClose,
  lessonContext = "",
  user,
}) => {
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [activeWorkbenchTab, setActiveWorkbenchTab] = React.useState<"scratchpad" | "flashcards" | "pomodoro">("scratchpad");

  // Combined Content Scratchpad
  const [content, setContent] = React.useState<string>(() => {
    return (
      localStorage.getItem("lmdpro_smart_scratchpad") ||
      `# Study Notes & Interactive Sandbox

Key Takeaways:
- Raft consensus divides time into arbitrary terms of logical clock ticks.
- Leaders handle log entry replication across majority nodes.

// Try running code directly in the same scratchpad!
function computeRaftQuorum(totalNodes) {
  const majority = Math.floor(totalNodes / 2) + 1;
  console.log("Required Raft Quorum Nodes:", majority);
  return majority;
}

computeRaftQuorum(5);`
    );
  });

  const [consoleLogs, setConsoleLogs] = React.useState<string[]>([]);
  const [savedMessage, setSavedMessage] = React.useState(false);

  // System auto-detection for Code vs Note
  const detectContentType = (text: string): "code" | "note" => {
    const codePatterns = [
      /function\s+\w+/,
      /const\s+\w+/,
      /let\s+\w+/,
      /var\s+\w+/,
      /import\s+.*from/,
      /class\s+\w+/,
      /console\.log\(/,
      /return\s+/,
      /def\s+\w+\(/,
      /public\s+static\s+void/,
      /#include\s*</,
      /<\/?[a-z][\s\S]*>/i,
      /=>/,
      /\bif\s*\(/,
      /\bfor\s*\(/,
      /\bwhile\s*\(/,
    ];

    const matchCount = codePatterns.reduce(
      (acc, pattern) => (pattern.test(text) ? acc + 1 : acc),
      0,
    );
    return matchCount >= 1 ? "code" : "note";
  };

  const detectedType = detectContentType(content);
  const [overrideType, setOverrideType] = React.useState<"auto" | "code" | "note">(
    "auto",
  );
  const activeType = overrideType === "auto" ? detectedType : overrideType;

  // Persistence
  React.useEffect(() => {
    localStorage.setItem("lmdpro_smart_scratchpad", content);
  }, [content]);

  // Code Execution
  const handleRunCode = () => {
    const logs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => {
        logs.push(
          args
            .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
            .join(" "),
        );
      },
      error: (...args: any[]) => {
        logs.push(`[ERROR] ${args.join(" ")}`);
      },
    };

    try {
      const runFn = new Function("console", content);
      runFn(customConsole);
    } catch (err: any) {
      logs.push(`Runtime Exception: ${err.message}`);
    }

    setConsoleLogs(logs);
  };

  const handleSaveNotes = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={drawerRef}
      className={`fixed top-14 right-0 bottom-0 bg-[#07131a] border-l border-[#1b3e4f] shadow-2xl z-50 flex flex-col transition-all duration-300 ${
        isExpanded
          ? "w-full md:w-[92vw] lg:w-[95vw]"
          : "w-full sm:w-[480px] md:w-[560px]"
      }`}
    >
      {/* Drawer Header */}
      <div className="p-3.5 bg-[#0a1b24] border-b border-[#183848] flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 via-cyan-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-sm shrink-0">
            <Sparkles className="w-4 h-4 fill-slate-950" />
          </div>
          <div className="truncate">
            <h3 className="text-xs font-extrabold text-white truncate">
              Smart Study Workbench
            </h3>
            <div className="flex items-center gap-2 text-[10px] text-[#688ca0]">
              <span>Bento Executive Workspace</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#7195a6] hover:text-white transition-all"
            title={isExpanded ? "Collapse Window" : "Expand to Window"}
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#7195a6] hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Tab Bar Navigation */}
      <div className="px-3 py-2 bg-[#050e12] border-b border-[#183848] flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveWorkbenchTab("scratchpad")}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeWorkbenchTab === "scratchpad"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-[#628494] hover:text-white hover:bg-white/5"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Scratchpad</span>
          </button>

          <button
            onClick={() => setActiveWorkbenchTab("flashcards")}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeWorkbenchTab === "flashcards"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-[#628494] hover:text-white hover:bg-white/5"
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Flashcards</span>
          </button>

          <button
            onClick={() => setActiveWorkbenchTab("pomodoro")}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeWorkbenchTab === "pomodoro"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-[#628494] hover:text-white hover:bg-white/5"
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Focus Timer</span>
          </button>
        </div>

        {activeWorkbenchTab === "scratchpad" && (
          <div className="flex items-center gap-1">
            {(["auto", "code", "note"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setOverrideType(mode)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold capitalize transition-all ${
                  overrideType === mode
                    ? "bg-cyan-500 text-slate-950 shadow-sm"
                    : "text-[#628494] hover:text-white hover:bg-white/5"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Tab Content Area */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#07131a] flex flex-col">
        {activeWorkbenchTab === "scratchpad" && (
          <div className="flex-1 flex flex-col space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                {activeType === "code" ? (
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                )}
                {activeType === "code"
                  ? "Code Sandbox Console"
                  : "Scratchpad Notes"}
              </span>

              <div className="flex items-center gap-2">
                {activeType === "code" && (
                  <button
                    onClick={handleRunCode}
                    className="px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition-transform"
                  >
                    <Play className="w-3 h-3 fill-slate-950" />
                    <span>Execute Code</span>
                  </button>
                )}

                <button
                  onClick={handleSaveNotes}
                  className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1"
                >
                  <Save className="w-3 h-3" />
                  <span>{savedMessage ? "Saved!" : "Save"}</span>
                </button>
              </div>
            </div>

            {/* Combined Text Editor Input */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={isExpanded ? 16 : 12}
              className={`w-full p-3.5 rounded-2xl bg-[#03090d] border border-[#1b3c4d] font-mono text-xs leading-relaxed focus:outline-none focus:border-cyan-400 shadow-inner resize-y transition-all ${
                activeType === "code" ? "text-cyan-200" : "text-slate-200"
              }`}
              placeholder="Type notes or paste code... System auto-detects functions, variables, and markdown."
              spellCheck={false}
            />

            {/* Execution Output Console (Active when code detected or executed) */}
            {activeType === "code" && (
              <div className="flex-1 p-3 rounded-2xl bg-[#03090d] border border-[#1b3c4d] font-mono text-xs text-cyan-400 space-y-1 min-h-[120px] max-h-[220px] overflow-y-auto">
                <div className="text-[10px] text-gray-500 font-bold border-b border-[#142c38] pb-1 mb-1 flex items-center justify-between">
                  <span>EXECUTION OUTPUT CONSOLE</span>
                  <button
                    onClick={() => setConsoleLogs([])}
                    className="text-gray-500 hover:text-cyan-400 text-[10px]"
                  >
                    Clear
                  </button>
                </div>
                {consoleLogs.length > 0 ? (
                  consoleLogs.map((log, idx) => <div key={idx}>&gt; {log}</div>)
                ) : (
                  <div className="text-gray-600 italic">
                    Click 'Execute Code' to run JS snippets...
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeWorkbenchTab === "flashcards" && (
          <div className="py-2">
            <FlashcardDeckSystem
              user={user}
              courseContext={lessonContext || "General"}
              lessonContent={content}
            />
          </div>
        )}

        {activeWorkbenchTab === "pomodoro" && (
          <div className="py-2">
            <FocusPomodoroTimer user={user} compact />
          </div>
        )}
      </div>
    </div>
  );
};

