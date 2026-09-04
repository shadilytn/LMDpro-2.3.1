import React from "react";
import {
  Network,
  BookOpen,
  Sparkles,
  Volume2,
  Download,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronRight,
  Layers,
  HelpCircle,
  X,
  Plus,
  Zap,
  CheckCircle2,
  Quote,
} from "lucide-react";
import { Course, CourseModule } from "../shared/types";
import { ApiService } from "../shared/api.service";

export interface MindMapNode {
  id: string;
  label: string;
  category: "course" | "module" | "lesson" | "concept" | "formula" | "quote";
  sourceQuote?: string;
  takeaway?: string;
  mathEquation?: string;
  lessonTitle?: string;
  parentId?: string;
  children?: string[];
  x?: number;
  y?: number;
}

interface NotebookLMMindMapProps {
  course?: Course;
  onSelectLesson?: (lessonId: string) => void;
}

export const NotebookLMMindMap: React.FC<NotebookLMMindMapProps> = ({
  course,
  onSelectLesson,
}) => {
  // Build initial Mind Map tree from Course prop or fallback default
  const [nodes, setNodes] = React.useState<MindMapNode[]>(() => {
    if (course) {
      const rootNode: MindMapNode = {
        id: "root-course",
        label: course.title,
        category: "course",
        takeaway: course.description,
        sourceQuote: `Master syllabus for ${course.title}. Domain: ${course.category || "CS & Engineering"}. Level: ${course.level}.`,
        x: 350,
        y: 200,
      };

      const moduleNodes: MindMapNode[] = [];
      const lessonNodes: MindMapNode[] = [];

      (course.modules || []).forEach((mod, mIdx) => {
        const modId = `mod-${mod.id || mIdx}`;
        const modAngle = (mIdx / Math.max(1, course.modules.length)) * 2 * Math.PI;
        const modRadius = 140;
        const mx = 350 + Math.cos(modAngle) * modRadius;
        const my = 200 + Math.sin(modAngle) * modRadius;

        moduleNodes.push({
          id: modId,
          label: mod.title,
          category: "module",
          parentId: "root-course",
          takeaway: `Module ${mIdx + 1}: ${mod.description || "Core syllabus module"}`,
          sourceQuote: `Official course module covering ${mod.lessons?.length || 0} key topics.`,
          x: mx,
          y: my,
        });

        (mod.lessons || []).forEach((les, lIdx) => {
          const lesAngle = modAngle + (lIdx - 0.5) * 0.4;
          const lesRadius = 240;
          const lx = 350 + Math.cos(lesAngle) * lesRadius;
          const ly = 200 + Math.sin(lesAngle) * lesRadius;

          lessonNodes.push({
            id: `les-${les.id || lIdx}`,
            label: les.title,
            category: "lesson",
            parentId: modId,
            lessonTitle: les.title,
            takeaway: `Lesson duration: ${les.durationMinutes || les.duration || "20"} mins. Key focus: ${les.title}`,
            sourceQuote: les.content ? les.content.slice(0, 180) + "..." : "Interactive lesson content with source citations.",
            x: lx,
            y: ly,
          });
        });
      });

      return [rootNode, ...moduleNodes, ...lessonNodes];
    }

    // Default Fallback Mind Map for Distributed Systems
    return [
      {
        id: "node-root",
        label: "CS101 Distributed Systems",
        category: "course",
        takeaway: "Core principles of fault-tolerant, scalable distributed systems.",
        sourceQuote: "Distributed systems compile concurrent nodes across unreliable network links into coherent global execution.",
        x: 350,
        y: 200,
      },
      {
        id: "node-m1",
        label: "Module 1: Time & Ordering",
        category: "module",
        parentId: "node-root",
        takeaway: "Lamport clocks and vector clocks establish partial ordering.",
        sourceQuote: "Logical clocks allow nodes to agree on event causality without synchronized physical hardware clocks.",
        x: 200,
        y: 110,
      },
      {
        id: "node-m2",
        label: "Module 2: Consensus Protocols",
        category: "module",
        parentId: "node-root",
        takeaway: "Raft, Paxos, and BFT solve state machine replication.",
        sourceQuote: "Consensus ensures all non-faulty nodes agree on the same sequence of state transitions over term majorities.",
        x: 500,
        y: 110,
      },
      {
        id: "node-m3",
        label: "Module 3: Fault Tolerance",
        category: "module",
        parentId: "node-root",
        takeaway: "Quorum intersection and Byzantine resilience.",
        sourceQuote: "Quorum size Q = floor(N/2) + 1 guarantees any two majorities overlap by at least one node.",
        x: 350,
        y: 330,
      },
      {
        id: "node-c1",
        label: "Raft Consensus Algorithm",
        category: "lesson",
        parentId: "node-m2",
        takeaway: "Strong leader, log replication, safety invariants.",
        sourceQuote: "Raft decomposes consensus into Leader Election, Log Replication, and Safety Invariants.",
        mathEquation: "Q = \\lfloor N / 2 \\rfloor + 1",
        x: 620,
        y: 80,
      },
      {
        id: "node-c2",
        label: "Vector Clocks",
        category: "lesson",
        parentId: "node-m1",
        takeaway: "Vector clock arrays track causal dependencies $V(a) < V(b)$.",
        sourceQuote: "An event A causally precedes B if V(A)[k] <= V(B)[k] for all k.",
        mathEquation: "V_i[i] = V_i[i] + 1",
        x: 80,
        y: 80,
      },
    ];
  });

  const [selectedNodeId, setSelectedNodeId] = React.useState<string>(nodes[0]?.id || "");
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isExpandingNode, setIsExpandingNode] = React.useState(false);
  const [audioSynthesizing, setAudioSynthesizing] = React.useState(false);
  const [audioActive, setAudioActive] = React.useState(false);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  // AI Concept Expansion
  const handleExpandNodeAI = async () => {
    if (!selectedNode) return;
    setIsExpandingNode(true);
    try {
      const prompt = `Given the course concept "${selectedNode.label}" in the domain "${
        course?.title || "Computer Science"
      }", generate 3 key sub-concepts or key takeaways for a mind map. Return a valid JSON array of objects with keys "label", "takeaway", "sourceQuote", "mathEquation".`;

      const aiRes = await ApiService.queryAITutor(prompt, "NotebookLM Mind Map Expander");
      const jsonMatch = aiRes.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const parentX = selectedNode.x || 350;
        const parentY = selectedNode.y || 200;

        const newChildNodes: MindMapNode[] = parsed.map((item: any, idx: number) => {
          const angle = (idx / parsed.length) * Math.PI - Math.PI / 2;
          const radius = 90;
          return {
            id: `expanded-${Date.now()}-${idx}`,
            label: item.label || `Subconcept ${idx + 1}`,
            category: "concept",
            parentId: selectedNode.id,
            takeaway: item.takeaway || "AI Generated Sub-concept takeaway.",
            sourceQuote: item.sourceQuote || "Grounded in course curriculum materials.",
            mathEquation: item.mathEquation,
            x: parentX + Math.cos(angle) * radius,
            y: parentY + Math.sin(angle) * radius,
          };
        });

        setNodes((prev) => [...prev, ...newChildNodes]);
      }
    } catch (e) {
      console.warn("Error expanding mindmap node:", e);
    } finally {
      setIsExpandingNode(false);
    }
  };

  // Synthesize Socratic Audio Explainer for Node
  const handleSynthesizeAudio = () => {
    if (!selectedNode) return;
    setAudioSynthesizing(true);
    setTimeout(() => {
      setAudioSynthesizing(false);
      setAudioActive(true);
      // Play speech utterance using Web Speech API as fallback
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const text = `NotebookLM Audio Summary for ${selectedNode.label}. ${
          selectedNode.takeaway || ""
        }. Quote: ${selectedNode.sourceQuote || ""}`;
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate = 1.0;
        utt.pitch = 1.0;
        utt.onend = () => setAudioActive(false);
        window.speechSynthesis.speak(utt);
      }
    }, 800);
  };

  // Filter nodes by search
  const filteredNodes = nodes.filter((n) =>
    n.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#08151c] border border-[#1b3b4a] rounded-3xl p-5 md:p-6 text-white space-y-6 shadow-2xl overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#183646] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5" /> NotebookLM Grounded Mind Map
            </span>
            <span className="text-[11px] text-[#7ea1b2]">
              Source-Grounded Course Syllabus Graph & Interactive Citations
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2">
            <span>{course?.title || "Syllabus Mind Map & Source Inspector"}</span>
          </h2>
        </div>

        {/* Toolbar controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#5f8496] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts..."
              className="bg-[#051117] border border-[#1b3d4f] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#5f8496] focus:outline-none focus:border-cyan-400 w-44"
            />
          </div>

          <button
            onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.15))}
            className="p-2 rounded-xl bg-[#051117] border border-[#1b3d4f] text-cyan-300 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.15))}
            className="p-2 rounded-xl bg-[#051117] border border-[#1b3d4f] text-cyan-300 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="px-3 py-1.5 rounded-xl bg-[#051117] border border-[#1b3d4f] text-xs font-bold text-gray-300"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Workspace Layout: SVG Canvas + Source Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive SVG Mind Map Canvas */}
        <div className="lg:col-span-8 bg-[#030a0f] rounded-2xl border border-[#143140] p-4 relative min-h-[460px] flex items-center justify-center overflow-hidden">
          <svg
            className="w-full h-[440px] cursor-grab active:cursor-grabbing"
            viewBox="0 0 700 420"
            style={{
              transform: `scale(${zoomLevel})`,
              transition: "transform 0.2s ease",
            }}
          >
            {/* Draw Parent-Child Connection Lines */}
            {nodes.map((node) => {
              if (!node.parentId) return null;
              const parentNode = nodes.find((p) => p.id === node.parentId);
              if (!parentNode) return null;

              return (
                <line
                  key={`link-${node.id}`}
                  x1={parentNode.x || 350}
                  y1={parentNode.y || 200}
                  x2={node.x || 350}
                  y2={node.y || 200}
                  stroke={
                    node.category === "module"
                      ? "#22d3ee"
                      : node.category === "lesson"
                      ? "#34d399"
                      : "#a855f7"
                  }
                  strokeWidth={2}
                  strokeOpacity={0.6}
                />
              );
            })}

            {/* Render Mind Map Nodes */}
            {filteredNodes.map((node) => {
              const isSelected = node.id === selectedNodeId;
              const radius =
                node.category === "course"
                  ? 28
                  : node.category === "module"
                  ? 22
                  : 18;

              const fillColor =
                node.category === "course"
                  ? "#22d3ee"
                  : node.category === "module"
                  ? "#0284c7"
                  : node.category === "lesson"
                  ? "#059669"
                  : "#7c3aed";

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer group"
                >
                  <circle
                    cx={node.x || 350}
                    cy={node.y || 200}
                    r={radius}
                    fill={fillColor}
                    stroke={isSelected ? "#ffffff" : "#22d3ee"}
                    strokeWidth={isSelected ? 3.5 : 1.5}
                    className="transition-all duration-200 hover:scale-125 shadow-lg"
                  />
                  <text
                    x={node.x || 350}
                    y={(node.y || 200) + radius + 14}
                    textAnchor="middle"
                    fill={isSelected ? "#22d3ee" : "#e2e8f0"}
                    fontSize={node.category === "course" ? 12 : 10}
                    fontWeight={isSelected ? "bold" : "medium"}
                    className="pointer-events-none select-none font-sans"
                  >
                    {node.label.length > 22
                      ? node.label.slice(0, 20) + "..."
                      : node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Canvas Legend Overlay */}
          <div className="absolute bottom-3 left-3 p-3 rounded-xl bg-[#08151c]/90 border border-[#1b3d4f] text-[10px] space-y-1 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-gray-300">Course Master</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-sky-600" />
              <span className="text-gray-300">Syllabus Module</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
              <span className="text-gray-300">Lesson Topic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
              <span className="text-gray-300">Deep-Dive Concept</span>
            </div>
          </div>
        </div>

        {/* Right NotebookLM Source Inspector Panel */}
        <div className="lg:col-span-4 bg-[#051117] rounded-2xl border border-[#163646] p-4 space-y-4 flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-4">
              {/* Concept Header */}
              <div className="border-b border-[#163646] pb-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
                    {selectedNode.category} Node
                  </span>
                  {selectedNode.lessonTitle && (
                    <span className="text-[10px] text-[#638797] font-mono">
                      {selectedNode.lessonTitle}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-extrabold text-white">
                  {selectedNode.label}
                </h3>
              </div>

              {/* Source Grounded Quote Box */}
              <div className="p-3 rounded-xl bg-[#08151c] border border-[#1b3d4f] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                  <Quote className="w-3.5 h-3.5 text-cyan-400" />
                  <span>NotebookLM Grounded Source Citation</span>
                </div>
                <p className="text-xs text-gray-300 italic leading-relaxed">
                  "{selectedNode.sourceQuote || "Source content reference."}"
                </p>
              </div>

              {/* Key Takeaway */}
              {selectedNode.takeaway && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#7ea1b2] uppercase tracking-wider">
                    Core Pedagogical Takeaway
                  </span>
                  <p className="text-xs text-cyan-200 bg-cyan-950/30 p-2.5 rounded-xl border border-cyan-500/30 leading-relaxed">
                    {selectedNode.takeaway}
                  </p>
                </div>
              )}

              {/* Math Equation */}
              {selectedNode.mathEquation && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#7ea1b2] uppercase tracking-wider">
                    Mathematical Formulation
                  </span>
                  <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 font-mono text-xs text-cyan-200">
                    ${selectedNode.mathEquation}$
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-gray-500">
              Click any node on the graph to inspect its grounded source citation.
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-3 border-t border-[#143140]">
            <button
              onClick={handleExpandNodeAI}
              disabled={isExpandingNode}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
            >
              {isExpandingNode ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Expand Concept with AI</span>
            </button>

            <button
              onClick={handleSynthesizeAudio}
              disabled={audioSynthesizing}
              className={`w-full py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                audioActive
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 animate-pulse"
                  : "bg-[#08151c] text-cyan-300 border-[#1b3d4f] hover:bg-cyan-500/10"
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {audioSynthesizing
                  ? "Synthesizing Audio..."
                  : audioActive
                  ? "Playing Socratic Explanation"
                  : "Synthesize Audio Explainer"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
