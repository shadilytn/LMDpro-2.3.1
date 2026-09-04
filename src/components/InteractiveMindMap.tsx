import React from "react";
import { motion } from "motion/react";
import {
  Network,
  Plus,
  Trash2,
  Download,
  Save,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  CheckCircle2,
  Sparkles,
  FileText,
  ArrowRight,
} from "lucide-react";

interface MindMapNode {
  id: string;
  label: string;
  x: number;
  y: number;
  category: "core" | "concept" | "subconcept" | "note";
  color?: string;
}

interface MindMapEdge {
  from: string;
  to: string;
}

interface InteractiveMindMapProps {
  lessonTitle?: string;
  onSaveToProfile?: (mindMapData: {
    nodes: MindMapNode[];
    edges: MindMapEdge[];
  }) => void;
}

export const InteractiveMindMap: React.FC<InteractiveMindMapProps> = ({
  lessonTitle = "Advanced Neural & Quantum Mechanics",
  onSaveToProfile,
}) => {
  const [nodes, setNodes] = React.useState<MindMapNode[]>([
    {
      id: "1",
      label: lessonTitle,
      x: 380,
      y: 220,
      category: "core",
      color: "#22d3ee",
    },
    {
      id: "2",
      label: "Gradient Descent Optimization",
      x: 180,
      y: 120,
      category: "concept",
      color: "#38bdf8",
    },
    {
      id: "3",
      label: "Token Self-Attention Matrix",
      x: 580,
      y: 120,
      category: "concept",
      color: "#2dd4bf",
    },
    {
      id: "4",
      label: "Qubit Bloch Sphere",
      x: 220,
      y: 340,
      category: "subconcept",
      color: "#a78bfa",
    },
    {
      id: "5",
      label: "Loss Landscape Convergence",
      x: 540,
      y: 340,
      category: "subconcept",
      color: "#f472b6",
    },
  ]);

  const [edges, setEdges] = React.useState<MindMapEdge[]>([
    { from: "1", to: "2" },
    { from: "1", to: "3" },
    { from: "1", to: "4" },
    { from: "1", to: "5" },
    { from: "2", to: "5" },
  ]);

  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>("1");
  const [newNodeLabel, setNewNodeLabel] = React.useState("");
  const [isSaved, setIsSaved] = React.useState(false);
  const svgRef = React.useRef<SVGSVGElement>(null);

  const handleAddNode = () => {
    if (!newNodeLabel.trim()) return;
    const newNode: MindMapNode = {
      id: `node-${Date.now()}`,
      label: newNodeLabel.trim(),
      x: 350 + (Math.random() * 100 - 50),
      y: 200 + (Math.random() * 100 - 50),
      category: "concept",
      color: "#38bdf8",
    };

    setNodes((prev) => [...prev, newNode]);
    if (selectedNodeId) {
      setEdges((prev) => [...prev, { from: selectedNodeId, to: newNode.id }]);
    }
    setNewNodeLabel("");
  };

  const handleDeleteNode = (id: string) => {
    if (nodes.length <= 1) return;
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.from !== id && e.to !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const handleSave = () => {
    setIsSaved(true);
    if (onSaveToProfile) {
      onSaveToProfile({ nodes, edges });
    }
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleExportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify({ nodes, edges, lessonTitle }, null, 2),
      );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `mindmap_${lessonTitle.toLowerCase().replace(/\s+/g, "_")}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportSVG = () => {
    if (!svgRef.current) return;
    const svgContent = svgRef.current.outerHTML;
    const blob = new Blob([svgContent], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = url;
    downloadAnchor.download = `mindmap_${lessonTitle.toLowerCase().replace(/\s+/g, "_")}.svg`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-[#080808] border border-white/10 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Concept Mind Mapper</span>
          </div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-white">
            Visual Knowledge Graph: {lessonTitle}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Build, connect, and organize conceptual relationships in real time.
            Export directly to JSON or SVG.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
          >
            {isSaved ? (
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaved ? "Saved to Profile!" : "Save Map"}</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 text-xs font-bold transition-all"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleExportSVG}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 text-xs font-bold transition-all"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Export SVG</span>
          </button>
        </div>
      </div>

      {/* Add Concept Control Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex-1 w-full flex items-center gap-2">
          <input
            type="text"
            value={newNodeLabel}
            onChange={(e) => setNewNodeLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddNode()}
            placeholder={
              selectedNodeId
                ? "Add child concept connected to selected node..."
                : "Add new concept node..."
            }
            className="flex-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={handleAddNode}
            disabled={!newNodeLabel.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 disabled:opacity-40 text-white text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Node</span>
          </button>
        </div>

        {selectedNodeId && (
          <div className="text-[11px] text-cyan-300 bg-cyan-950/40 px-3 py-1.5 rounded-xl border border-cyan-500/30 flex items-center gap-2">
            <span>
              Selected:{" "}
              <strong>
                {nodes.find((n) => n.id === selectedNodeId)?.label}
              </strong>
            </span>
            <button
              onClick={() => handleDeleteNode(selectedNodeId)}
              className="p-1 hover:text-cyan-400 transition-colors"
              title="Delete Selected Node"
            >
              <Trash2 className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        )}
      </div>

      {/* Interactive Mind Map Canvas */}
      <div className="relative w-full h-[450px] bg-[#030303] rounded-2xl border border-white/10 overflow-hidden shadow-inner flex items-center justify-center">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />

        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-auto"
        >
          <defs>
            <linearGradient
              id="edgeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Render Edges (Connecting Lines) */}
          {edges.map((edge, idx) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            return (
              <g key={idx}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="url(#edgeGradient)"
                  strokeWidth="2.5"
                  strokeDasharray="4"
                  className="animate-pulse"
                />
              </g>
            );
          })}
        </svg>

        {/* Render Interactive Nodes */}
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const isCore = node.category === "core";

          return (
            <motion.div
              key={node.id}
              drag
              dragConstraints={{
                left: -100,
                right: 100,
                top: -100,
                bottom: 100,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedNodeId(node.id);
              }}
              style={{ left: node.x, top: node.y }}
              className={`absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xl flex items-center gap-2 border ${
                isCore
                  ? "bg-gradient-to-r from-cyan-600 to-cyan-600 border-cyan-400 text-white shadow-cyan-500/30"
                  : isSelected
                    ? "bg-[#182a36] border-cyan-400 text-cyan-200 shadow-cyan-500/20 ring-2 ring-cyan-400/40"
                    : "bg-[#0f171d] border-white/20 text-gray-200 hover:border-white/40"
              }`}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: node.color || "#22d3ee" }}
              />
              <span className="max-w-[140px] truncate">{node.label}</span>
              {nodes.length > 1 && !isCore && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNode(node.id);
                  }}
                  className="text-gray-400 hover:text-cyan-400 ml-1 transition-colors"
                >
                  ×
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] text-gray-400 px-2">
        <span>
          💡 Tip: Drag nodes around the canvas to reposition relationships.
          Click any node to select or delete it.
        </span>
        <span className="font-mono">
          Total Nodes: {nodes.length} | Edges: {edges.length}
        </span>
      </div>
    </div>
  );
};
