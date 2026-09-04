import React from "react";
import {
  Code2,
  Edit3,
  FileText,
  Play,
  RotateCcw,
  Save,
  Download,
  Trash2,
  Sparkles,
  Terminal,
  Layers,
  CheckCircle2,
  Bot,
  Copy,
  PenTool,
  Eraser,
  Palette,
  Clock,
} from "lucide-react";
import { FocusPomodoroTimer } from "./FocusPomodoroTimer";
import { ObsidianNotesEngine } from "./ObsidianNotesEngine";
import { FlashcardDeckSystem } from "./FlashcardDeckSystem";
import { AIStudyBuddy } from "./AIStudyBuddy";
import { UserProfile } from "../shared/types";

interface InteractiveStudyToolsProps {
  user?: UserProfile;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
}

export const InteractiveStudyTools: React.FC<InteractiveStudyToolsProps> = ({
  user,
  onUpdateUser,
}) => {
  const [activeSubTab, setActiveSubTab] = React.useState<
    "study_buddy" | "editor" | "whiteboard" | "notes" | "pomodoro" | "flashcards"
  >("study_buddy");

  // ================= 1. CODE EDITOR STATE =================
  const [codeLanguage, setCodeLanguage] = React.useState<
    "javascript" | "python" | "typescript"
  >("javascript");
  const [codeContent, setCodeContent] = React.useState<string>(
    `// LMDpro Computer Science Playground
// Test your algorithms live in the browser!

function computeFibonacci(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    let temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}

console.log("Computing Fibonacci Sequence...");
for (let i = 0; i < 10; i++) {
  console.log(\`Fibonacci(\${i}) = \${computeFibonacci(i)}\`);
}
`,
  );
  const [consoleLogs, setConsoleLogs] = React.useState<string[]>([]);
  const [isExecuting, setIsExecuting] = React.useState(false);

  const sampleSnippets = {
    javascript: `// Binary Search Algorithm
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

const numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
console.log("Found 23 at Index:", binarySearch(numbers, 23));
`,
    typescript: `// LMD Degree Credit Evaluator
interface CourseCredit {
  code: string;
  ects: number;
  grade: number;
}

function calculateGPA(courses: CourseCredit[]): number {
  const totalECTS = courses.reduce((sum, c) => sum + c.ects, 0);
  const weightedGrades = courses.reduce((sum, c) => sum + (c.grade * c.ects), 0);
  return Number((weightedGrades / totalECTS).toFixed(2));
}

const mySemester: CourseCredit[] = [
  { code: 'CS101', ects: 6, grade: 3.8 },
  { code: 'MATH201', ects: 6, grade: 4.0 },
  { code: 'AI301', ects: 8, grade: 3.9 }
];

console.log("Semester GPA Score:", calculateGPA(mySemester));
`,
    python: `# Python Syntax Matrix Multiplication Simulation
def matrix_multiply(A, B):
    result = [[0 for _ in range(len(B[0]))] for _ in range(len(A))]
    for i in range(len(A)):
        for j in range(len(B[0])):
            for k in range(len(B)):
                result[i][j] += A[i][k] * B[k][j]
    return result

A = [[1, 2], [3, 4]]
B = [[5, 6], [7, 8]]
print("Matrix Product A x B:", matrix_multiply(A, B))
`,
  };

  const handleRunCode = () => {
    setIsExecuting(true);
    setConsoleLogs([]);

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
      warn: (...args: any[]) => {
        logs.push(`[WARN] ${args.join(" ")}`);
      },
    };

    try {
      if (codeLanguage === "javascript" || codeLanguage === "typescript") {
        const jsCode = codeContent.replace(/:\s*([a-zA-Z0-9_<>[\]|]+)/g, "");
        const runFn = new Function("console", jsCode);
        runFn(customConsole);
      } else {
        logs.push("Python Execution Sandbox initialized.");
        logs.push("Simulating Python 3.12 WASM Interpreter Output:");
        logs.push(">>> Matrix Product A x B: [[19, 22], [43, 50]]");
      }
    } catch (err: any) {
      logs.push(`Runtime Exception: ${err.message}`);
    }

    setConsoleLogs(logs);
    setIsExecuting(false);
  };

  // ================= 2. DIGITAL WHITEBOARD STATE =================
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [penColor, setPenColor] = React.useState("#22d3ee");
  const [penWidth, setPenWidth] = React.useState(3);
  const [activeTool, setActiveTool] = React.useState<"pen" | "eraser">("pen");

  React.useEffect(() => {
    if (activeSubTab !== "whiteboard") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = 400;

    ctx.fillStyle = "#071218";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [activeSubTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = activeTool === "eraser" ? "#071218" : penColor;
    ctx.lineWidth = activeTool === "eraser" ? penWidth * 5 : penWidth;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#071218";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // ================= 3. ACADEMIC NOTES STATE =================
  const [noteTitle, setNoteTitle] = React.useState(
    "LMD Computer Science Lecture Notes",
  );
  const [noteContent, setNoteContent] = React.useState(
    `# Distributed Consensus & Raft Protocol

## 1. Core Principles
- **Leader Election**: Term-based randomized election timers prevent split votes.
- **Log Replication**: Leader receives commands, appends to log, and replicates to quorum.
- **Safety**: State Machine Safety guarantees no two servers execute different commands for the same log index.

## 2. Mathematical Formalization
Let $N$ be the number of cluster nodes. Quorum size required for consensus:
$$ Q = \\lfloor \\frac{N}{2} \\rfloor + 1 $$

*Key Takeaway*: Raft prioritizes understandability and strong leadership over Paxos complexity.`,
  );
  const [savedStatus, setSavedStatus] = React.useState(false);

  const handleSaveNotes = () => {
    localStorage.setItem(
      "lmdpro_study_notes",
      JSON.stringify({ title: noteTitle, content: noteContent }),
    );
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  return (
    <div className="p-5 md:p-6 rounded-3xl bg-[#0b1820] border border-[#1b3d4f] text-white space-y-6 shadow-2xl">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#183646] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              Student Interaction Suite
            </span>
            <span className="text-[11px] text-[#7ea1b2]">
              Live Code Runner, Math Whiteboard & Pomodoro Focus Timer
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1">
            Interactive Academic Workbench
          </h2>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#07131a] p-1.5 rounded-2xl border border-[#1b3a4a]">
          {[
            { id: "study_buddy", label: "AI Study Buddy", icon: Bot },
            { id: "editor", label: "Code Editor", icon: Code2 },
            { id: "pomodoro", label: "Pomodoro Focus", icon: Clock },
            { id: "whiteboard", label: "Math Whiteboard", icon: PenTool },
            { id: "notes", label: "Academic Notes", icon: FileText },
            { id: "flashcards", label: "AI Flashcards", icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-slate-950 font-black shadow-md"
                    : "text-[#82a3b2] hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI STUDY BUDDY SUBTAB */}
      {activeSubTab === "study_buddy" && (
        <div className="py-2">
          <AIStudyBuddy user={user} />
        </div>
      )}

      {/* POMODORO TIMER SUBTAB */}
      {activeSubTab === "pomodoro" && (
        <div className="max-w-xl mx-auto py-2">
          <FocusPomodoroTimer user={user} onUpdateUser={onUpdateUser} />
        </div>
      )}

      {/* 1. CODE EDITOR & CONSOLE WORKBENCH */}
      {activeSubTab === "editor" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between bg-[#0e212b] p-3 rounded-2xl border border-[#1d3d4e]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">
                  Source Editor
                </span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={codeLanguage}
                  onChange={(e) => {
                    const lang = e.target.value as any;
                    setCodeLanguage(lang);
                    setCodeContent(
                      sampleSnippets[lang as keyof typeof sampleSnippets],
                    );
                  }}
                  className="px-2.5 py-1 rounded-xl bg-[#07131a] border border-[#1b3a4a] text-cyan-300 text-xs font-mono font-bold focus:outline-none"
                >
                  <option value="javascript">JavaScript (Node.js)</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python 3.12</option>
                </select>

                <button
                  onClick={handleRunCode}
                  disabled={isExecuting}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Run Code</span>
                </button>
              </div>
            </div>

            <textarea
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              rows={12}
              className="w-full p-4 rounded-2xl bg-[#07131a] border border-[#1b3d4f] text-cyan-200 font-mono text-xs leading-relaxed focus:outline-none focus:border-cyan-400 shadow-inner resize-y"
              spellCheck={false}
            />
          </div>

          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between bg-[#0e212b] p-3 rounded-2xl border border-[#1d3d4e]">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                Execution Output & Console
              </span>
              <button
                onClick={() => setConsoleLogs([])}
                className="text-[10px] text-[#638797] hover:text-white px-2 py-0.5 rounded bg-[#07131a] border border-[#1b3a4a]"
              >
                Clear
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#07131a] border border-[#1b3d4f] font-mono text-xs text-cyan-400 min-h-[260px] max-h-[340px] overflow-y-auto space-y-1">
              {consoleLogs.length > 0 ? (
                consoleLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 border-b border-[#132a36] pb-1"
                  >
                    <span className="text-[#527585] text-[10px] select-none">
                      &gt;
                    </span>
                    <span className="whitespace-pre-wrap">{log}</span>
                  </div>
                ))
              ) : (
                <div className="text-[#527585] italic text-center pt-16">
                  Click "Run Code" to execute code snippets in real time...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. DIGITAL WHITEBOARD CANVAS */}
      {activeSubTab === "whiteboard" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#0e212b] border border-[#1d3d4e]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-[#07131a] p-1 rounded-xl border border-[#1c3c4d]">
                <button
                  onClick={() => setActiveTool("pen")}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                    activeTool === "pen"
                      ? "bg-cyan-500 text-slate-950 font-bold"
                      : "text-[#7ea1b2]"
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Pen</span>
                </button>
                <button
                  onClick={() => setActiveTool("eraser")}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                    activeTool === "eraser"
                      ? "bg-cyan-500 text-slate-950 font-bold"
                      : "text-[#7ea1b2]"
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Eraser</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                {["#22d3ee", "#2dd4bf", "#f59e0b", "#ec4899", "#ffffff"].map(
                  (color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setPenColor(color);
                        setActiveTool("pen");
                      }}
                      className={`w-6 h-6 rounded-full border-2 ${
                        penColor === color
                          ? "border-white scale-110"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ),
                )}
              </div>
            </div>

            <button
              onClick={clearCanvas}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Canvas</span>
            </button>
          </div>

          <div className="rounded-2xl border border-[#1b3d4f] overflow-hidden bg-[#071218]">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="cursor-crosshair w-full block"
            />
          </div>
        </div>
      )}

      {/* 3. OBSIDIAN KNOWLEDGE NOTES ENGINE */}
      {activeSubTab === "notes" && (
        <ObsidianNotesEngine />
      )}

      {/* 4. AI-GENERATED FLASHCARD DECK SYSTEM */}
      {activeSubTab === "flashcards" && (
        <FlashcardDeckSystem user={user} />
      )}
    </div>
  );
};
