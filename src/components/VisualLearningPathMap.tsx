import React from "react";
import {
  MapPin,
  CheckCircle2,
  Lock,
  PlayCircle,
  Sparkles,
  ChevronRight,
  BookOpen,
  Clock,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Zap,
  Target,
  Award,
  ArrowRight,
  Info,
  SlidersHorizontal,
} from "lucide-react";
import { Course, Lesson, Module } from "../shared/types";

export interface VisualLearningPathMapProps {
  course: Course;
  activeLessonId?: string;
  completedLessonIds?: string[];
  onSelectLesson?: (lessonId: string, moduleId: string) => void;
  onSelectModule?: (moduleId: string) => void;
  className?: string;
}

interface NodeData {
  id: string;
  lessonId: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  type: "concept" | "lab" | "quiz" | "capstone";
  durationMinutes: number;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  status: "completed" | "in-progress" | "available" | "locked";
  prerequisites: string[]; // IDs of prerequisite lessons
  x: number;
  y: number;
  tierIndex: number;
}

export const VisualLearningPathMap: React.FC<VisualLearningPathMapProps> = ({
  course,
  activeLessonId,
  completedLessonIds = [],
  onSelectLesson,
  onSelectModule,
  className = "",
}) => {
  const [selectedNode, setSelectedNode] = React.useState<NodeData | null>(null);
  const [zoomLevel, setZoomLevel] = React.useState<number>(1);
  const [panOffset, setPanOffset] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const [dragStart, setDragStart] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [filterMode, setFilterMode] = React.useState<"all" | "in-progress" | "completed" | "locked">("all");

  const containerRef = React.useRef<HTMLDivElement>(null);

  // Compute Layout Topology Nodes
  const { nodes, links, totalMinutes, completedCount } = React.useMemo(() => {
    const nodeList: NodeData[] = [];
    const linkList: Array<{ source: string; target: string; isCompleted: boolean; isActive: boolean }> = [];
    let previousNodeId: string | null = null;
    let completedCounter = 0;
    let totalMins = 0;

    let globalIndex = 0;
    const modules = course.modules || [];

    modules.forEach((mod, modIdx) => {
      const lessons = mod.lessons || [];
      lessons.forEach((les, lesIdx) => {
        const isCurrentActive = les.id === activeLessonId;
        const isCompleted = completedLessonIds.includes(les.id) || (les as any).completed || false;
        if (isCompleted) completedCounter++;
        totalMins += les.durationMinutes || 15;

        // Determine node status
        let status: "completed" | "in-progress" | "available" | "locked" = "locked";
        if (isCompleted) {
          status = "completed";
        } else if (isCurrentActive) {
          status = "in-progress";
        } else if (modIdx === 0 && lesIdx === 0) {
          status = "available";
        } else if (previousNodeId && nodeList.find((n) => n.id === previousNodeId)?.status === "completed") {
          status = "available";
        } else {
          // If first module or first lesson of completed prior module
          status = modIdx === 0 || isCurrentActive ? "available" : "locked";
        }

        // Layout coordinate calculation (Tiered Flow DAG)
        const colWidth = 260;
        const rowHeight = 140;
        const xPos = 80 + modIdx * colWidth + (lesIdx % 2 === 1 ? 40 : 0);
        const yPos = 80 + lesIdx * rowHeight;

        const prereqs = previousNodeId ? [previousNodeId] : [];

        const nodeObj: NodeData = {
          id: les.id,
          lessonId: les.id,
          moduleId: mod.id,
          moduleTitle: mod.title,
          title: les.title,
          type: les.title.toLowerCase().includes("quiz")
            ? "quiz"
            : les.title.toLowerCase().includes("lab")
            ? "lab"
            : les.title.toLowerCase().includes("capstone")
            ? "capstone"
            : "concept",
          durationMinutes: les.durationMinutes || 15,
          difficulty:
            modIdx === 0
              ? "beginner"
              : modIdx === 1
              ? "intermediate"
              : modIdx === 2
              ? "advanced"
              : "expert",
          status,
          prerequisites: prereqs,
          x: xPos,
          y: yPos,
          tierIndex: modIdx,
        };

        nodeList.push(nodeObj);

        if (previousNodeId) {
          linkList.push({
            source: previousNodeId,
            target: les.id,
            isCompleted: isCompleted,
            isActive: isCurrentActive,
          });
        }

        previousNodeId = les.id;
        globalIndex++;
      });
    });

    return {
      nodes: nodeList,
      links: linkList,
      totalMinutes: totalMins,
      completedCount: completedCounter,
    };
  }, [course, activeLessonId]);

  // Pan and drag mechanics
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof SVGElement || e.target === containerRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Filtered nodes
  const filteredNodes = React.useMemo(() => {
    if (filterMode === "all") return nodes;
    return nodes.filter((n) => n.status === filterMode);
  }, [nodes, filterMode]);

  // Dynamic status badges
  const statusBadges = {
    completed: {
      bg: "bg-cyan-600/20",
      border: "border-cyan-500/60",
      text: "text-cyan-300",
      icon: CheckCircle2,
      glow: "shadow-cyan-500/30",
    },
    "in-progress": {
      bg: "bg-cyan-500/30",
      border: "border-cyan-400",
      text: "text-cyan-200",
      icon: Zap,
      glow: "shadow-cyan-400/50 animate-pulse",
    },
    available: {
      bg: "bg-blue-500/15",
      border: "border-blue-500/40",
      text: "text-blue-300",
      icon: PlayCircle,
      glow: "shadow-blue-500/20",
    },
    locked: {
      bg: "bg-slate-900/40",
      border: "border-slate-700/50",
      text: "text-slate-500",
      icon: Lock,
      glow: "",
    },
  };

  const progressPercent = nodes.length > 0 ? Math.round((completedCount / nodes.length) * 100) : 0;

  return (
    <div
      className={`bg-[#08151c] text-slate-100 rounded-3xl border border-[#1b3b4a] shadow-2xl flex flex-col relative overflow-hidden h-[620px] select-none ${className}`}
    >
      {/* Header Toolbar */}
      <div className="p-4 bg-gradient-to-r from-[#0a1c27] via-[#0e2736] to-[#071620] border-b border-[#1b3b4a] flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-950/40">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                Interactive DAG Learning Path
              </span>
              <span className="text-xs text-[#7ba4b8] font-bold">
                {course.modules?.length || 0} Modules • {nodes.length} Key Milestones
              </span>
            </div>
            <h3 className="text-base font-black text-white mt-0.5">{course.title}</h3>
          </div>
        </div>

        {/* Filter Pills & Zoom Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center bg-[#071822] p-1 rounded-xl border border-[#1b3b4a]">
            {(["all", "in-progress", "completed", "locked"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  filterMode === mode
                    ? "bg-cyan-500 text-slate-950 shadow-sm"
                    : "text-[#7ba4b8] hover:text-white"
                }`}
              >
                {mode === "all" ? "All Nodes" : mode}
              </button>
            ))}
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center bg-[#071822] rounded-xl border border-[#1b3b4a] p-1">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.15))}
              className="p-1.5 hover:bg-[#112d3c] rounded-lg text-[#7ba4b8] hover:text-white transition-all"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-2 text-cyan-300 font-bold">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.15))}
              className="p-1.5 hover:bg-[#112d3c] rounded-lg text-[#7ba4b8] hover:text-white transition-all"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="p-1.5 hover:bg-[#112d3c] rounded-lg text-[#7ba4b8] hover:text-white transition-all ml-1 border-l border-[#1b3b4a]"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Strip */}
      <div className="px-6 py-2 bg-[#06131a] border-b border-[#142e3b] flex items-center justify-between text-xs text-[#7ba4b8] z-10">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200">Curriculum Mastery</span>
          <div className="w-36 h-2 bg-[#0d222e] rounded-full overflow-hidden border border-[#1b3b4a]">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-black text-cyan-400">{progressPercent}%</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span>{completedCount} / {nodes.length} Completed</span>
          <span>~{Math.round(totalMinutes / 60)} hrs total duration</span>
        </div>
      </div>

      {/* Interactive Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex-1 relative overflow-hidden bg-[#040e14] cursor-grab active:cursor-grabbing"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(34, 211, 238, 0.08) 1px, transparent 0),
            radial-gradient(circle at 20px 20px, rgba(52, 211, 153, 0.04) 1px, transparent 0)
          `,
          backgroundSize: "32px 32px",
        }}
      >
        {/* SVG Bezier Connection Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: "0 0",
          }}
        >
          <defs>
            <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <linearGradient id="completedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {links.map((link, idx) => {
            const src = nodes.find((n) => n.id === link.source);
            const tgt = nodes.find((n) => n.id === link.target);
            if (!src || !tgt) return null;

            // Compute smooth cubic bezier path
            const dx = tgt.x - src.x;
            const dy = tgt.y - src.y;
            const cx1 = src.x + dx * 0.5;
            const cy1 = src.y;
            const cx2 = src.x + dx * 0.5;
            const cy2 = tgt.y;
            const pathData = `M ${src.x + 100} ${src.y + 35} C ${cx1} ${cy1 + 35}, ${cx2} ${cy2 + 35}, ${tgt.x} ${tgt.y + 35}`;

            return (
              <g key={idx}>
                {/* Background Shadow Line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="#081b24"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                {/* Animated or Styled Stroke */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={
                    link.isActive
                      ? "url(#activeGradient)"
                      : link.isCompleted
                      ? "url(#completedGradient)"
                      : "#1b3b4a"
                  }
                  strokeWidth={link.isActive ? "3.5" : "2"}
                  strokeDasharray={link.isActive ? "6 6" : "none"}
                  filter={link.isActive ? "url(#glow)" : "none"}
                  className={link.isActive ? "animate-[dash_1s_linear_infinite]" : ""}
                />
              </g>
            );
          })}
        </svg>

        {/* Nodes Layer */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: "0 0",
          }}
        >
          {filteredNodes.map((node) => {
            const badge = statusBadges[node.status];
            const Icon = badge.icon;
            const isSelected = selectedNode?.id === node.id;
            const isCurrent = node.lessonId === activeLessonId;

            return (
              <div
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(node);
                }}
                className={`absolute w-56 p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-xl ${
                  badge.bg
                } ${badge.border} ${badge.glow} ${
                  isSelected
                    ? "ring-2 ring-cyan-400 scale-105 z-30"
                    : isCurrent
                    ? "ring-2 ring-cyan-400/80 z-20 scale-102"
                    : "hover:scale-102 hover:border-cyan-500/50 z-10"
                }`}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                }}
              >
                {/* Top Module Subtitle */}
                <div className="flex items-center justify-between text-[10px] text-[#7ba4b8] font-bold mb-1">
                  <span className="truncate max-w-[130px]">{node.moduleTitle}</span>
                  <span className="capitalize font-mono text-[9px] px-1.5 py-0.2 rounded bg-black/40 text-slate-300">
                    {node.difficulty}
                  </span>
                </div>

                {/* Lesson Title */}
                <h4 className="text-xs font-bold text-white leading-snug line-clamp-2 mb-2">
                  {node.title}
                </h4>

                {/* Bottom Node Meta */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
                  <div className="flex items-center gap-1 text-[#7ba4b8]">
                    <Clock className="w-3 h-3" />
                    <span>{node.durationMinutes}m</span>
                  </div>

                  <div className={`flex items-center gap-1 font-bold ${badge.text}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="capitalize">{node.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Node Detail Inspector Drawer */}
        {selectedNode && (
          <div className="absolute right-4 bottom-4 w-80 p-5 rounded-3xl bg-[#091b24]/95 backdrop-blur-xl border border-cyan-500/40 shadow-2xl space-y-4 animate-in slide-in-from-right-4 duration-200 z-40">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-black text-cyan-400">
                  Node Inspector
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5 leading-snug">
                  {selectedNode.title}
                </h4>
                <p className="text-[11px] text-[#7ba4b8]">{selectedNode.moduleTitle}</p>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1.5 rounded-lg bg-[#0d2633] hover:bg-[#153a4d] text-[#7ba4b8] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-[#071720] border border-[#1b3b4a]">
                <span className="text-[#7ba4b8] block text-[9px] uppercase font-bold">Duration</span>
                <span className="font-bold text-white">{selectedNode.durationMinutes} Minutes</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#071720] border border-[#1b3b4a]">
                <span className="text-[#7ba4b8] block text-[9px] uppercase font-bold">Status</span>
                <span className={`font-bold capitalize ${statusBadges[selectedNode.status].text}`}>
                  {selectedNode.status}
                </span>
              </div>
            </div>

            {/* Prerequisites Checklist */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-[#7ba4b8] block">
                Prerequisite Mastery Check
              </span>
              <div className="p-2.5 rounded-xl bg-[#06131a] border border-[#142e3b] text-xs space-y-1">
                {selectedNode.prerequisites.length > 0 ? (
                  selectedNode.prerequisites.map((prereqId, pIdx) => {
                    const prereqNode = nodes.find((n) => n.id === prereqId);
                    return (
                      <div key={pIdx} className="flex items-center gap-2 text-slate-300">
                        {prereqNode?.status === "completed" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-blue-500" />
                        )}
                        <span className="truncate">{prereqNode?.title || "Prerequisite lesson"}</span>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-cyan-400 font-semibold text-[11px]">
                    ✓ No prerequisites required. Direct access available!
                  </span>
                )}
              </div>
            </div>

            {/* Jump to lesson action */}
            <button
              onClick={() => {
                if (onSelectLesson) {
                  onSelectLesson(selectedNode.lessonId, selectedNode.moduleId);
                }
                setSelectedNode(null);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs transition-all shadow-lg hover:scale-102 flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Launch Milestone Lesson</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
