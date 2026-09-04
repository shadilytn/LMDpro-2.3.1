import React from "react";
import {
  X,
  Calculator,
  Globe,
  StickyNote,
  Code2,
  PenTool,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Save,
  Search,
  ExternalLink,
  Check,
  Database,
  FileSpreadsheet,
  FileText,
  FolderGit2,
  Share2,
  Network,
  Plus,
  Folder,
  Calendar,
  Layers,
  Table,
  Presentation,
  HardDrive,
} from "lucide-react";

export type ToolType =
  | "calculator"
  | "browser"
  | "notes"
  | "code"
  | "whiteboard"
  | "pomodoro"
  | "obsidian"
  | "office"
  | "workspace"
  | null;

interface ToolModalOverlayProps {
  activeTool: ToolType;
  onClose: () => void;
}

export const ToolModalOverlay: React.FC<ToolModalOverlayProps> = ({
  activeTool,
  onClose,
}) => {
  if (!activeTool) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-4xl bg-[#0b1820] border border-[#1c3d4f] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-white">
        {/* Header */}
        <div className="p-4 px-6 border-b border-[#183646] flex items-center justify-between bg-[#08131a]">
          <div className="flex items-center gap-2.5">
            {activeTool === "calculator" && (
              <Calculator className="w-5 h-5 text-cyan-400" />
            )}
            {activeTool === "browser" && (
              <Globe className="w-5 h-5 text-cyan-400" />
            )}
            {activeTool === "notes" && (
              <StickyNote className="w-5 h-5 text-cyan-400" />
            )}
            {activeTool === "code" && (
              <Code2 className="w-5 h-5 text-cyan-400" />
            )}
            {activeTool === "whiteboard" && (
              <PenTool className="w-5 h-5 text-cyan-400" />
            )}
            {activeTool === "pomodoro" && (
              <Clock className="w-5 h-5 text-cyan-400" />
            )}
            {activeTool === "obsidian" && (
              <Network className="w-5 h-5 text-cyan-400" />
            )}
            {activeTool === "office" && (
              <Database className="w-5 h-5 text-blue-400" />
            )}
            {activeTool === "workspace" && (
              <FolderGit2 className="w-5 h-5 text-cyan-400" />
            )}
            <h3 className="font-bold text-white text-base capitalize">
              {activeTool === "calculator" && "Scientific Calculator"}
              {activeTool === "browser" && "Academic Web Research Browser"}
              {activeTool === "notes" && "Quick Scratchpad & Notes"}
              {activeTool === "code" && "Live Code Execution Sandbox"}
              {activeTool === "whiteboard" && "Math & Sketch Whiteboard"}
              {activeTool === "pomodoro" && "Focus Pomodoro Timer"}
              {activeTool === "obsidian" &&
                "Obsidian Knowledge Vault & Graph Editor"}
              {activeTool === "office" &&
                "Microsoft Office & Access Database Suite"}
              {activeTool === "workspace" &&
                "Google Workspace Suite (Docs, Sheets, Drive)"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#7a9bb0] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTool === "calculator" && <CalculatorView />}
          {activeTool === "browser" && <BrowserView />}
          {activeTool === "notes" && <NotesView />}
          {activeTool === "code" && <CodeView />}
          {activeTool === "whiteboard" && <WhiteboardView />}
          {activeTool === "pomodoro" && <PomodoroView />}
          {activeTool === "obsidian" && <ObsidianNotesView />}
          {activeTool === "office" && <OfficeSuiteView />}
          {activeTool === "workspace" && <WorkspaceSuiteView />}
        </div>
      </div>
    </div>
  );
};

/* 1. CALCULATOR TOOL */
const CalculatorView: React.FC = () => {
  const [display, setDisplay] = React.useState("0");
  const [equation, setEquation] = React.useState("");

  const handleBtn = (val: string) => {
    if (val === "C") {
      setDisplay("0");
      setEquation("");
      return;
    }
    if (val === "=") {
      try {
        const sanitized = display.replace(/×/g, "*").replace(/÷/g, "/");
        const res = Function(`"use strict"; return (${sanitized})`)();
        setEquation(`${display} =`);
        setDisplay(String(res));
      } catch (err) {
        setDisplay("Error");
      }
      return;
    }
    if (display === "0" || display === "Error") {
      setDisplay(val);
    } else {
      setDisplay(display + val);
    }
  };

  const buttons = [
    "C",
    "(",
    ")",
    "÷",
    "7",
    "8",
    "9",
    "×",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "+",
    "0",
    ".",
    "=",
  ];

  return (
    <div className="max-w-xs mx-auto space-y-4">
      <div className="p-4 rounded-2xl bg-[#061117] border border-[#183646] text-right space-y-1">
        <div className="text-xs text-[#6e91a3] h-4 font-mono">{equation}</div>
        <div className="text-2xl font-black text-cyan-300 font-mono truncate">
          {display}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => handleBtn(btn)}
            className={`p-3.5 rounded-2xl font-bold text-sm transition-all ${
              btn === "="
                ? "col-span-2 bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-black"
                : ["÷", "×", "-", "+", "C"].includes(btn)
                  ? "bg-[#122e3d] text-cyan-300 hover:bg-[#1b4357]"
                  : "bg-[#0e212b] text-white hover:bg-[#163445]"
            }`}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

/* 2. BROWSER RESEARCH TOOL */
const BrowserView: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setResults([
        {
          title: `Academic Research Papers on "${query}"`,
          url: `https://arxiv.org/search/?query=${encodeURIComponent(query)}`,
          snippet: `Peer-reviewed papers, arXiv preprints, and open-access journals related to ${query} in computer science, robotics, and mathematics.`,
        },
        {
          title: `Wikipedia Overview: ${query}`,
          url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`,
          snippet: `Encyclopedia article covering historical origins, theoretical definitions, and core properties of ${query}.`,
        },
        {
          title: `MIT OpenCourseWare Guide for ${query}`,
          url: `https://ocw.mit.edu/search/?q=${encodeURIComponent(query)}`,
          snippet: `Lecture notes, problem sets, and syllabus modules from MIT OCW computer science and engineering curriculum.`,
        },
      ]);
      setIsSearching(false);
    }, 600);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6e90a1]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search academic papers, topics, documentation..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#061117] border border-[#183646] text-white text-xs outline-none focus:border-cyan-400"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all"
        >
          Search
        </button>
      </form>

      <div className="space-y-3 min-h-[220px]">
        {isSearching ? (
          <div className="text-center py-10 text-xs text-[#7195a8] animate-pulse">
            Querying academic databases...
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#6e90a1]">
            Enter a topic above to search live academic sources and
            documentation.
          </div>
        ) : (
          results.map((res, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-[#091720] border border-[#183646] space-y-1 hover:border-cyan-500/40 transition-all"
            >
              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-cyan-300 text-xs hover:underline flex items-center gap-1.5"
              >
                <span>{res.title}</span>
                <ExternalLink className="w-3 h-3 text-[#6e90a1]" />
              </a>
              <p className="text-[11px] text-[#789cae] leading-relaxed">
                {res.snippet}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* 3. QUICK NOTES TOOL */
const NotesView: React.FC = () => {
  const [note, setNote] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem("quick_tools_note");
    if (saved) setNote(saved);
  }, []);

  const handleSave = () => {
    localStorage.setItem("quick_tools_note", note);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={8}
        placeholder="Type study notes, formula derivations, key takeaways..."
        className="w-full p-4 rounded-2xl bg-[#061117] border border-[#183646] text-white text-xs outline-none focus:border-cyan-400 leading-relaxed"
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-2"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{copied ? "Saved!" : "Save Notes"}</span>
        </button>
      </div>
    </div>
  );
};

/* 4. CODE PLAYGROUND TOOL */
const CodeView: React.FC = () => {
  const [code, setCode] = React.useState(
    `console.log("Hello, Agentic Scholar!");\nconst sum = [1, 2, 3, 4, 5].reduce((a, b) => a + b, 0);\nconsole.log("Calculated Sum:", sum);`,
  );
  const [output, setOutput] = React.useState<string[]>([]);

  const handleRun = () => {
    const logs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => logs.push(args.join(" ")),
      error: (...args: any[]) => logs.push(`[ERROR] ${args.join(" ")}`),
    };
    try {
      const fn = new Function("console", code);
      fn(customConsole);
    } catch (err: any) {
      logs.push(`Error: ${err.message}`);
    }
    setOutput(logs);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#7195a8]">
          JavaScript Sandbox
        </label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={6}
          className="w-full p-3 font-mono text-xs rounded-2xl bg-[#061117] border border-[#183646] text-cyan-300 outline-none focus:border-cyan-400"
        />
      </div>
      <button
        onClick={handleRun}
        className="px-5 py-2 rounded-xl bg-cyan-500 text-white font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-1.5"
      >
        <Play className="w-3.5 h-3.5" />
        <span>Run Code</span>
      </button>

      {output.length > 0 && (
        <div className="p-3 rounded-2xl bg-[#040a0e] border border-[#153140] font-mono text-[11px] text-cyan-300 space-y-1">
          <div className="text-[10px] text-[#618598] font-bold uppercase">
            Console Output:
          </div>
          {output.map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
};

/* 5. WHITEBOARD TOOL */
const WhiteboardView: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [penColor, setPenColor] = React.useState("#22d3ee");

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.parentElement?.clientWidth || 500;
    canvas.height = 250;
    ctx.fillStyle = "#061117";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

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
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#061117";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {["#22d3ee", "#34d399", "#f59e0b", "#f43f5e", "#ffffff"].map((c) => (
            <button
              key={c}
              onClick={() => setPenColor(c)}
              style={{ backgroundColor: c }}
              className={`w-6 h-6 rounded-full border-2 ${penColor === c ? "border-white scale-110" : "border-transparent"}`}
            />
          ))}
        </div>
        <button
          onClick={clear}
          className="px-3 py-1 rounded-xl bg-[#132c3a] text-xs font-bold text-[#7195a8] hover:text-white"
        >
          Clear Canvas
        </button>
      </div>

      <div className="rounded-2xl border border-[#183646] overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={() => setIsDrawing(false)}
          onMouseLeave={() => setIsDrawing(false)}
          className="w-full cursor-crosshair block"
        />
      </div>
    </div>
  );
};

/* 6. POMODORO TIMER TOOL */
const PomodoroView: React.FC = () => {
  const [seconds, setSeconds] = React.useState(25 * 60);
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  return (
    <div className="text-center py-6 space-y-6">
      <div className="text-5xl font-black text-cyan-300 font-mono tracking-wider">
        {formatted}
      </div>
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setIsActive(!isActive)}
          className="px-6 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-black text-xs hover:bg-cyan-400 transition-all flex items-center gap-2"
        >
          {isActive ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span>{isActive ? "Pause Session" : "Start Focus"}</span>
        </button>
        <button
          onClick={() => {
            setIsActive(false);
            setSeconds(25 * 60);
          }}
          className="px-4 py-3 rounded-2xl bg-[#122e3d] text-cyan-300 font-bold text-xs hover:bg-[#1b4357] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/* 7. OBSIDIAN KNOWLEDGE VAULT TOOL */
const ObsidianNotesView: React.FC = () => {
  const [notes, setNotes] = React.useState<
    Array<{
      id: string;
      title: string;
      folder: string;
      tags: string[];
      content: string;
    }>
  >([
    {
      id: "1",
      title: "Autonomous Swarms & Multi-Agent Design.md",
      folder: "AI Systems",
      tags: ["#agentic", "#swarms", "#ai"],
      content: `# Autonomous Swarms & Multi-Agent Design

Key Concepts:
- Decentralized task delegation using [[Gemini Flash]] and [[Antigravity Engine]].
- High-dimensional vector embeddings stored in [[Memory Bank]].
- Continuous sync with [[Access Database]] and [[Google Workspace]].

## Connected Links
- [[Socratic AI Tutor]]
- [[RAG Vector Architecture]]
- #research #knowledge
`,
    },
    {
      id: "2",
      title: "Socratic AI Tutor & Cognitive Loops.md",
      folder: "Pedagogy",
      tags: ["#pedagogy", "#socratic", "#learning"],
      content: `# Socratic AI Tutor & Cognitive Loops

Principles:
1. Never give flat answers; lead with probing questions.
2. Link concepts directly to [[Autonomous Swarms]].
3. Sync notes automatically to Microsoft Word (.docx) and Google Docs.
`,
    },
    {
      id: "3",
      title: "RAG Vector Architecture & Embeddings.md",
      folder: "Infrastructure",
      tags: ["#rag", "#embeddings", "#database"],
      content: `# RAG Vector Architecture

Components:
- Cosine distance similarity calculation.
- Table sync with [[Access Database]] and [[Google Sheets]].
`,
    },
  ]);

  const [activeNoteId, setActiveNoteId] = React.useState("1");
  const [activeTab, setActiveTab] = React.useState<
    "editor" | "graph" | "office_sync" | "workspace_sync"
  >("editor");
  const [exportMsg, setExportMsg] = React.useState<string | null>(null);

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const handleContentChange = (newContent: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeNoteId ? { ...n, content: newContent } : n,
      ),
    );
  };

  const createNewNote = () => {
    const newId = String(Date.now());
    const newNote = {
      id: newId,
      title: `Untitled Note ${notes.length + 1}.md`,
      folder: "General",
      tags: ["#newnote"],
      content: `# New Obsidian Vault Note\n\nStart typing with [[Backlinks]] and #tags...`,
    };
    setNotes([...notes, newNote]);
    setActiveNoteId(newId);
  };

  const triggerExport = (destination: string) => {
    setExportMsg(`Exporting "${activeNote.title}" to ${destination}...`);
    setTimeout(() => {
      setExportMsg(
        `Successfully synced "${activeNote.title}" to ${destination}!`,
      );
      setTimeout(() => setExportMsg(null), 3000);
    }, 800);
  };

  return (
    <div className="space-y-4">
      {/* Top Navigation Bar for Obsidian Vault */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#183646] pb-3">
        <div className="flex items-center gap-1.5 bg-[#061117] p-1 rounded-xl border border-[#183646]">
          {[
            { id: "editor", label: "Vault Editor", icon: FileText },
            {
              id: "graph",
              label: "Interactive Knowledge Graph",
              icon: Network,
            },
            {
              id: "office_sync",
              label: "Microsoft Access & Office",
              icon: Database,
            },
            {
              id: "workspace_sync",
              label: "Google Workspace Sync",
              icon: HardDrive,
            },
          ].map((tab) => {
            const IconComp = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-md"
                    : "text-[#6e90a1] hover:text-white hover:bg-[#122835]"
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={createNewNote}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#112938] hover:bg-[#183a4f] text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Note</span>
        </button>
      </div>

      {/* Sync Banner Status */}
      {exportMsg && (
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-cyan-400" />
          <span>{exportMsg}</span>
        </div>
      )}

      {/* VIEW 1: EDITOR */}
      {activeTab === "editor" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Note List Sidebar */}
          <div className="md:col-span-4 p-3 rounded-2xl bg-[#061117] border border-[#183646] space-y-2 max-h-[380px] overflow-y-auto">
            <div className="text-[11px] font-bold text-[#6a8c9e] uppercase tracking-wider px-2">
              Obsidian Vault Notes ({notes.length})
            </div>
            {notes.map((note) => (
              <button
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                  activeNoteId === note.id
                    ? "bg-[#122b39] border-cyan-500/50 text-white"
                    : "bg-[#091720] border-transparent text-[#7092a4] hover:text-white hover:bg-[#0f232f]"
                }`}
              >
                <div className="font-semibold text-xs truncate text-cyan-200">
                  {note.title}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#5e8192] mt-1">
                  <Folder className="w-3 h-3 text-cyan-400" />
                  <span>{note.folder}</span>
                  <span className="ml-auto text-cyan-400 font-mono">
                    {note.tags[0]}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Markdown Content Editor */}
          <div className="md:col-span-8 space-y-3">
            <input
              type="text"
              value={activeNote.title}
              onChange={(e) => {
                const newTitle = e.target.value;
                setNotes((prev) =>
                  prev.map((n) =>
                    n.id === activeNoteId ? { ...n, title: newTitle } : n,
                  ),
                );
              }}
              className="w-full px-3 py-2 rounded-xl bg-[#061117] border border-[#183646] font-mono text-xs font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
            />

            <textarea
              value={activeNote.content}
              onChange={(e) => handleContentChange(e.target.value)}
              rows={12}
              className="w-full p-4 rounded-2xl bg-[#040a0e] border border-[#183646] font-mono text-xs text-[#d5e7f2] outline-none focus:border-cyan-400 leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* VIEW 2: INTERACTIVE KNOWLEDGE GRAPH */}
      {activeTab === "graph" && (
        <div className="p-6 rounded-2xl bg-[#061117] border border-[#183646] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Network className="w-4 h-4 text-cyan-400" />
                Obsidian Graph Link Visualization
              </h4>
              <p className="text-xs text-[#6e90a1]">
                Simulated neural note connections and bi-directional links
              </p>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/30">
              {notes.length} Vault Nodes Connected
            </span>
          </div>

          <div className="relative w-full h-[280px] bg-[#03080c] rounded-2xl border border-[#112633] overflow-hidden flex items-center justify-center">
            {/* SVG Link lines */}
            <svg className="absolute inset-0 w-full h-full">
              <line
                x1="20%"
                y1="30%"
                x2="50%"
                y2="50%"
                stroke="#22d3ee"
                strokeWidth="2"
                strokeDasharray="4"
              />
              <line
                x1="80%"
                y1="30%"
                x2="50%"
                y2="50%"
                stroke="#a855f7"
                strokeWidth="2"
                strokeDasharray="4"
              />
              <line
                x1="50%"
                y1="50%"
                x2="50%"
                y2="80%"
                stroke="#34d399"
                strokeWidth="2"
                strokeDasharray="4"
              />
            </svg>

            {/* Graph Nodes */}
            <div className="absolute top-[22%] left-[12%] p-3 rounded-2xl bg-[#0b1f2b] border border-cyan-400 text-center shadow-lg shadow-cyan-500/20 cursor-pointer hover:scale-105 transition-all">
              <div className="text-xs font-bold text-cyan-300">
                Autonomous Swarms
              </div>
              <div className="text-[9px] text-[#638799] font-mono">
                3 Backlinks
              </div>
            </div>

            <div className="absolute top-[22%] right-[12%] p-3 rounded-2xl bg-[#1b0d2b] border border-cyan-400 text-center shadow-lg shadow-cyan-500/20 cursor-pointer hover:scale-105 transition-all">
              <div className="text-xs font-bold text-cyan-300">
                Socratic AI Tutor
              </div>
              <div className="text-[9px] text-[#866399] font-mono">
                2 Backlinks
              </div>
            </div>

            <div className="absolute top-[42%] left-[40%] p-4 rounded-2xl bg-[#092218] border border-cyan-400 text-center shadow-xl shadow-cyan-500/20 cursor-pointer hover:scale-105 transition-all">
              <div className="text-xs font-bold text-cyan-300">
                RAG Vector Index
              </div>
              <div className="text-[9px] text-[#63997b] font-mono">
                Central Knowledge Hub
              </div>
            </div>

            <div className="absolute bottom-[12%] left-[40%] p-3 rounded-2xl bg-[#231a08] border border-cyan-400 text-center shadow-lg shadow-cyan-500/20 cursor-pointer hover:scale-105 transition-all">
              <div className="text-xs font-bold text-cyan-300">
                Microsoft Access DB
              </div>
              <div className="text-[9px] text-[#998163] font-mono">
                External Relational Sync
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: MICROSOFT ACCESS & OFFICE SYNC */}
      {activeTab === "office_sync" && (
        <div className="p-6 rounded-2xl bg-[#061117] border border-[#183646] space-y-5">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-blue-400" />
            <div>
              <h4 className="font-bold text-sm text-white">
                Microsoft Access & Office Integration Suite
              </h4>
              <p className="text-xs text-[#7195a8]">
                Sync Obsidian vault markdown directly with Word, Access DB,
                Excel, and PowerPoint
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() =>
                triggerExport("Microsoft Access Database (.accdb)")
              }
              className="p-4 rounded-2xl bg-[#0a1b26] border border-[#183a4f] text-left hover:border-cyan-400 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-blue-300 flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-400" />
                  Access DB Relational Table Sync
                </span>
                <Share2 className="w-3.5 h-3.5 text-[#5e8192] group-hover:text-cyan-300" />
              </div>
              <p className="text-[11px] text-[#6d91a3]">
                Convert note sections into structured Access SQL tables and
                schemas.
              </p>
            </button>

            <button
              onClick={() => triggerExport("Microsoft Word Document (.docx)")}
              className="p-4 rounded-2xl bg-[#0a1b26] border border-[#183a4f] text-left hover:border-cyan-400 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-cyan-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  Microsoft Word Document Export
                </span>
                <Share2 className="w-3.5 h-3.5 text-[#5e8192] group-hover:text-cyan-300" />
              </div>
              <p className="text-[11px] text-[#6d91a3]">
                Compile active vault note into styled Word .docx formatted
                report.
              </p>
            </button>

            <button
              onClick={() => triggerExport("Microsoft Excel Workbook (.xlsx)")}
              className="p-4 rounded-2xl bg-[#0a1b26] border border-[#183a4f] text-left hover:border-cyan-400 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-cyan-300 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                  Microsoft Excel Workbook
                </span>
                <Share2 className="w-3.5 h-3.5 text-[#5e8192] group-hover:text-cyan-300" />
              </div>
              <p className="text-[11px] text-[#6d91a3]">
                Extract markdown tables into Excel calculation spreadsheets.
              </p>
            </button>

            <button
              onClick={() =>
                triggerExport("Microsoft PowerPoint Presentation (.pptx)")
              }
              className="p-4 rounded-2xl bg-[#0a1b26] border border-[#183a4f] text-left hover:border-cyan-400 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-cyan-300 flex items-center gap-2">
                  <Presentation className="w-4 h-4 text-cyan-400" />
                  Microsoft PowerPoint Slide Deck
                </span>
                <Share2 className="w-3.5 h-3.5 text-[#5e8192] group-hover:text-cyan-300" />
              </div>
              <p className="text-[11px] text-[#6d91a3]">
                Auto-generate slide deck presentation outline from note
                headings.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 4: GOOGLE WORKSPACE SYNC */}
      {activeTab === "workspace_sync" && (
        <div className="p-6 rounded-2xl bg-[#061117] border border-[#183646] space-y-5">
          <div className="flex items-center gap-3">
            <HardDrive className="w-5 h-5 text-cyan-400" />
            <div>
              <h4 className="font-bold text-sm text-white">
                Google Workspace Cloud Integration
              </h4>
              <p className="text-xs text-[#7195a8]">
                Seamless bi-directional sync with Google Docs, Sheets, Drive,
                Slides & Calendar
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => triggerExport("Google Docs")}
              className="p-4 rounded-2xl bg-[#0a1b26] border border-[#183a4f] text-left hover:border-cyan-400 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-cyan-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  Sync to Google Docs
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-[#5e8192] group-hover:text-cyan-300" />
              </div>
              <p className="text-[11px] text-[#6d91a3]">
                Push note content to Google Docs collaborative cloud document.
              </p>
            </button>

            <button
              onClick={() => triggerExport("Google Sheets")}
              className="p-4 rounded-2xl bg-[#0a1b26] border border-[#183a4f] text-left hover:border-cyan-400 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-cyan-300 flex items-center gap-2">
                  <Table className="w-4 h-4 text-cyan-400" />
                  Export to Google Sheets
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-[#5e8192] group-hover:text-cyan-300" />
              </div>
              <p className="text-[11px] text-[#6d91a3]">
                Export structured tabular note data to Google Sheets
                spreadsheet.
              </p>
            </button>

            <button
              onClick={() => triggerExport("Google Drive Folder")}
              className="p-4 rounded-2xl bg-[#0a1b26] border border-[#183a4f] text-left hover:border-cyan-400 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-cyan-300 flex items-center gap-2">
                  <Folder className="w-4 h-4 text-cyan-400" />
                  Backup Vault to Google Drive
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-[#5e8192] group-hover:text-cyan-300" />
              </div>
              <p className="text-[11px] text-[#6d91a3]">
                Save entire Obsidian vault backup zip directly to Google Drive
                storage.
              </p>
            </button>

            <button
              onClick={() => triggerExport("Google Calendar Study Event")}
              className="p-4 rounded-2xl bg-[#0a1b26] border border-[#183a4f] text-left hover:border-cyan-400 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-cyan-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  Create Google Calendar Review
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-[#5e8192] group-hover:text-cyan-300" />
              </div>
              <p className="text-[11px] text-[#6d91a3]">
                Schedule spaced-repetition study review event on Google
                Calendar.
              </p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* 8. MICROSOFT OFFICE & ACCESS SUITE TOOL */
const OfficeSuiteView: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<
    "access" | "word" | "excel" | "powerpoint"
  >("access");
  const [sqlQuery, setSqlQuery] = React.useState(
    "SELECT * FROM StudentRecords WHERE gpa >= 3.8 ORDER BY credits DESC;",
  );
  const [queryResults, setQueryResults] = React.useState([
    {
      id: "STU-101",
      name: "Alex Johnson",
      major: "Computer Science",
      gpa: 3.95,
      credits: 112,
    },
    {
      id: "STU-102",
      name: "Sophia Chen",
      major: "Artificial Intelligence",
      gpa: 3.98,
      credits: 120,
    },
    {
      id: "STU-103",
      name: "Marcus Vance",
      major: "Robotics Engineering",
      gpa: 3.88,
      credits: 98,
    },
  ]);

  return (
    <div className="space-y-4">
      {/* Office Suite Sub-navigation */}
      <div className="flex items-center gap-1.5 bg-[#061117] p-1 rounded-xl border border-[#183646]">
        {[
          {
            id: "access",
            label: "Access Database SQL",
            icon: Database,
            color: "text-blue-400",
          },
          {
            id: "word",
            label: "Word Document",
            icon: FileText,
            color: "text-cyan-400",
          },
          {
            id: "excel",
            label: "Excel Spreadsheet",
            icon: FileSpreadsheet,
            color: "text-cyan-400",
          },
          {
            id: "powerpoint",
            label: "PowerPoint Deck",
            icon: Presentation,
            color: "text-cyan-400",
          },
        ].map((tab) => {
          const IconComp = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                active
                  ? "bg-[#143242] text-white border border-cyan-500/40"
                  : "text-[#6e90a1] hover:text-white"
              }`}
            >
              <IconComp className={`w-3.5 h-3.5 ${tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "access" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#061117] border border-[#183646] space-y-3">
            <label className="text-xs font-bold text-blue-300 font-mono">
              Microsoft Access SQL Query Runner:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-[#03080c] border border-[#122836] font-mono text-xs text-cyan-300 focus:outline-none"
              />
              <button
                onClick={() => {
                  setQueryResults([
                    ...queryResults,
                    {
                      id: `STU-${Math.floor(Math.random() * 900 + 100)}`,
                      name: "New Student Record",
                      major: "Data Science",
                      gpa: 3.9,
                      credits: 88,
                    },
                  ]);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Execute SQL
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#061117] border border-[#183646] overflow-x-auto">
            <table className="w-full text-left font-mono text-xs text-[#cde1ee]">
              <thead className="bg-[#0b1f2b] text-cyan-300 border-b border-[#183646]">
                <tr>
                  <th className="p-2.5">ID</th>
                  <th className="p-2.5">Student Name</th>
                  <th className="p-2.5">Major</th>
                  <th className="p-2.5">GPA</th>
                  <th className="p-2.5">Credits</th>
                </tr>
              </thead>
              <tbody>
                {queryResults.map((r, i) => (
                  <tr
                    key={i}
                    className="border-b border-[#0f2533] hover:bg-[#0c1f2b]"
                  >
                    <td className="p-2.5 text-cyan-400">{r.id}</td>
                    <td className="p-2.5 font-bold text-white">{r.name}</td>
                    <td className="p-2.5">{r.major}</td>
                    <td className="p-2.5 text-cyan-400 font-bold">
                      {r.gpa}
                    </td>
                    <td className="p-2.5">{r.credits} hrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "word" && (
        <div className="p-6 rounded-2xl bg-[#061117] border border-[#183646] space-y-3">
          <h4 className="text-xs font-bold text-cyan-300">
            Microsoft Word Document Composer
          </h4>
          <textarea
            rows={10}
            defaultValue={`Executive Educational Summary\n\nThis academic document compiles coursework, research abstracts, and Socratic tutor notes. Ready to export to .docx or sync with Google Docs.`}
            className="w-full p-4 rounded-xl bg-[#03080c] border border-[#122836] font-sans text-xs text-white leading-relaxed focus:outline-none"
          />
        </div>
      )}

      {activeTab === "excel" && (
        <div className="p-6 rounded-2xl bg-[#061117] border border-[#183646] space-y-3">
          <h4 className="text-xs font-bold text-cyan-300">
            Microsoft Excel Calculation Grid
          </h4>
          <div className="grid grid-cols-4 gap-2 font-mono text-xs">
            {["Module", "Assignments", "Score", "Weight"].map((h, i) => (
              <div
                key={i}
                className="p-2 bg-[#0c202c] font-bold text-cyan-300 rounded-lg text-center"
              >
                {h}
              </div>
            ))}
            {["Module 1", "Quiz & Lab", "98%", "25%"].map((val, i) => (
              <div
                key={i}
                className="p-2 bg-[#040a0e] text-white rounded-lg text-center border border-[#112634]"
              >
                {val}
              </div>
            ))}
            {["Module 2", "Midterm Exam", "94%", "35%"].map((val, i) => (
              <div
                key={i}
                className="p-2 bg-[#040a0e] text-white rounded-lg text-center border border-[#112634]"
              >
                {val}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "powerpoint" && (
        <div className="p-6 rounded-2xl bg-[#061117] border border-[#183646] space-y-3 text-center">
          <Presentation className="w-8 h-8 text-cyan-400 mx-auto" />
          <h4 className="text-sm font-bold text-white">
            PowerPoint Slide Deck Generator
          </h4>
          <p className="text-xs text-[#7195a8]">
            Slide 1: Autonomous AI Systems Architecture & Research Synthesizer
          </p>
        </div>
      )}
    </div>
  );
};

/* 9. GOOGLE WORKSPACE SUITE TOOL */
const WorkspaceSuiteView: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl bg-[#061117] border border-[#183646] space-y-5">
      <div className="flex items-center justify-between border-b border-[#183646] pb-3">
        <div className="flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-cyan-400" />
          <h4 className="font-bold text-sm text-white">Google Workspace Hub</h4>
        </div>
        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/30">
          OAuth Connected
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: "Google Docs",
            desc: "Sync live notes & research drafts",
            icon: FileText,
            color: "text-cyan-400",
          },
          {
            title: "Google Sheets",
            desc: "Export student grades & analytics",
            icon: Table,
            color: "text-cyan-400",
          },
          {
            title: "Google Drive",
            desc: "Backup Obsidian vaults & assets",
            icon: HardDrive,
            color: "text-cyan-400",
          },
          {
            title: "Google Calendar",
            desc: "Schedule exam preparation alerts",
            icon: Calendar,
            color: "text-cyan-400",
          },
          {
            title: "Google Forms",
            desc: "Create interactive quiz evaluations",
            icon: Layers,
            color: "text-cyan-400",
          },
          {
            title: "Google Slides",
            desc: "Present course defense slide decks",
            icon: Presentation,
            color: "text-cyan-400",
          },
        ].map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#0a1a24] border border-[#18394d] space-y-2 hover:border-cyan-400 transition-all"
            >
              <div className="flex items-center gap-2">
                <IconComp className={`w-4 h-4 ${item.color}`} />
                <span className="font-bold text-xs text-white">
                  {item.title}
                </span>
              </div>
              <p className="text-[11px] text-[#6d91a3]">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
