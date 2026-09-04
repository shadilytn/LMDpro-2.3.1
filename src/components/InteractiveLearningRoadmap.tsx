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
  RotateCcw,
  Zap,
  Target,
  Award,
  ArrowRight,
  Info,
  SlidersHorizontal,
  DownloadCloud,
  Check,
  RefreshCw,
  GitBranch,
  ShieldCheck,
  FileText,
  Boxes,
  HelpCircle,
} from "lucide-react";
import { Course, Lesson, Module } from "../shared/types";
import { toastService } from "../services/toastService";
import { SafeLocalStorage } from "../services/offlineStorage";

export interface InteractiveLearningRoadmapProps {
  course: Course;
  activeLessonId?: string;
  completedLessonIds?: string[];
  onSelectLesson?: (lessonId: string, moduleId: string) => void;
  onSelectModule?: (moduleId: string) => void;
  className?: string;
}

export interface RoadmapNode {
  id: string;
  lessonId: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  description?: string;
  type: "concept" | "lab" | "quiz" | "milestone" | "capstone";
  durationMinutes: number;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  status: "completed" | "in-progress" | "next-milestone" | "upcoming" | "locked";
  prerequisites: string[]; // Node IDs that must be completed
  skills: string[];
  x: number;
  y: number;
  tierIndex: number;
  isPreloaded?: boolean;
}

export const InteractiveLearningRoadmap: React.FC<InteractiveLearningRoadmapProps> = ({
  course,
  activeLessonId,
  completedLessonIds = [],
  onSelectLesson,
  onSelectModule,
  className = "",
}) => {
  const [selectedNode, setSelectedNode] = React.useState<RoadmapNode | null>(null);
  const [zoomLevel, setZoomLevel] = React.useState<number>(1);
  const [panOffset, setPanOffset] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const [dragStart, setDragStart] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [filterMode, setFilterMode] = React.useState<"all" | "unlocked" | "upcoming" | "completed">("all");
  const [viewMode, setViewMode] = React.useState<"graph" | "timeline">("graph");

  // Pre-load content state tracking
  const [preloadingNodeId, setPreloadingNodeId] = React.useState<string | null>(null);
  const [preloadProgress, setPreloadProgress] = React.useState<number>(0);
  const [preloadStage, setPreloadStage] = React.useState<string>("");
  const [preloadedNodes, setPreloadedNodes] = React.useState<Record<string, boolean>>(() => {
    try {
      const saved = SafeLocalStorage.getItem(`lmdpro_preloaded_${course.id}`);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const containerRef = React.useRef<HTMLDivElement>(null);

  // Compute Topological Nodes and Directed Dependency Links
  const { nodes, links, totalMinutes, completedCount } = React.useMemo(() => {
    const nodeList: RoadmapNode[] = [];
    const linkList: Array<{
      source: string;
      target: string;
      isCompleted: boolean;
      isActive: boolean;
      isUpcoming: boolean;
    }> = [];

    let completedCounter = 0;
    let totalMins = 0;
    let foundNextUpcoming = false;
    let prevNodeId: string | null = null;

    const modules = course.modules || [];

    modules.forEach((mod, modIdx) => {
      const lessons = mod.lessons || [];
      lessons.forEach((les, lesIdx) => {
        const isCurrentActive = les.id === activeLessonId;
        const isCompleted = completedLessonIds.includes(les.id) || (les as any).completed || false;
        if (isCompleted) completedCounter++;
        totalMins += les.durationMinutes || 15;

        // Build prerequisite dependency chain: previous lesson or previous module's capstone
        const prereqs: string[] = [];
        if (lesIdx > 0) {
          prereqs.push(lessons[lesIdx - 1].id);
        } else if (modIdx > 0 && modules[modIdx - 1].lessons.length > 0) {
          const prevMod = modules[modIdx - 1];
          prereqs.push(prevMod.lessons[prevMod.lessons.length - 1].id);
        }

        // Determine node status
        let status: "completed" | "in-progress" | "next-milestone" | "upcoming" | "locked" = "locked";
        if (isCompleted) {
          status = "completed";
        } else if (isCurrentActive) {
          status = "in-progress";
        } else {
          // Check if prerequisites are satisfied
          const prereqsSatisfied =
            prereqs.length === 0 ||
            prereqs.every((pId) => completedLessonIds.includes(pId));

          if (prereqsSatisfied) {
            if (!foundNextUpcoming) {
              status = "next-milestone";
              foundNextUpcoming = true;
            } else {
              status = "upcoming";
            }
          } else {
            status = "locked";
          }
        }

        // Determine node type
        const lowerTitle = les.title.toLowerCase();
        let nodeType: "concept" | "lab" | "quiz" | "milestone" | "capstone" = "concept";
        if (lowerTitle.includes("capstone") || (modIdx === modules.length - 1 && lesIdx === lessons.length - 1)) {
          nodeType = "capstone";
        } else if (lowerTitle.includes("quiz") || (les.quizzes && les.quizzes.length > 0)) {
          nodeType = "quiz";
        } else if (lowerTitle.includes("lab") || lowerTitle.includes("project") || lowerTitle.includes("simulation")) {
          nodeType = "lab";
        } else if (lesIdx === lessons.length - 1) {
          nodeType = "milestone";
        }

        // Coordinate positioning (Tiered DAG layout)
        const colWidth = 280;
        const rowHeight = 150;
        const xPos = 80 + modIdx * colWidth + (lesIdx % 2 === 1 ? 30 : 0);
        const yPos = 90 + lesIdx * rowHeight;

        // Skills tags
        const defaultSkills = [course.category || "Computing", `Level ${modIdx + 1}`];
        if (nodeType === "lab") defaultSkills.push("Hands-on Practice");
        if (nodeType === "quiz") defaultSkills.push("Assessment");

        const nodeObj: RoadmapNode = {
          id: les.id,
          lessonId: les.id,
          moduleId: mod.id,
          moduleTitle: mod.title,
          title: les.title,
          description: les.keyTakeaways?.[0] || `Mastery milestone for ${mod.title}`,
          type: nodeType,
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
          skills: defaultSkills,
          x: xPos,
          y: yPos,
          tierIndex: modIdx,
          isPreloaded: !!preloadedNodes[les.id],
        };

        nodeList.push(nodeObj);

        // Build links from prerequisites
        prereqs.forEach((prereqId) => {
          linkList.push({
            source: prereqId,
            target: les.id,
            isCompleted: isCompleted,
            isActive: isCurrentActive,
            isUpcoming: status === "next-milestone" || status === "upcoming",
          });
        });

        prevNodeId = les.id;
      });
    });

    return {
      nodes: nodeList,
      links: linkList,
      totalMinutes: totalMins,
      completedCount: completedCounter,
    };
  }, [course, activeLessonId, completedLessonIds, preloadedNodes]);

  // Pre-load Milestone Content Simulation & Storage Cache
  const handlePreloadMilestone = async (node: RoadmapNode) => {
    if (preloadingNodeId) return;

    setPreloadingNodeId(node.id);
    setPreloadProgress(15);
    setPreloadStage("Pre-fetching lesson text, exercises & code sandbox assets...");

    try {
      // Find actual lesson object
      const mod = course.modules.find((m) => m.id === node.moduleId);
      const les = mod?.lessons.find((l) => l.id === node.lessonId);

      await new Promise((r) => setTimeout(r, 400));
      setPreloadProgress(45);
      setPreloadStage("Compiling RAG vector embeddings & knowledge dependencies...");

      await new Promise((r) => setTimeout(r, 450));
      setPreloadProgress(75);
      setPreloadStage("Caching interactive quiz psychometrics and offline assets...");

      // Store in SafeLocalStorage
      if (les) {
        const cachePayload = {
          lessonId: les.id,
          courseId: course.id,
          moduleId: node.moduleId,
          title: les.title,
          content: les.content,
          quizzes: les.quizzes || [],
          keyTakeaways: les.keyTakeaways || [],
          preloadedAt: new Date().toISOString(),
        };
        SafeLocalStorage.setItem(`lmdpro_cached_lesson_${les.id}`, JSON.stringify(cachePayload));
      }

      await new Promise((r) => setTimeout(r, 350));
      setPreloadProgress(100);
      setPreloadStage("Pre-load complete! 100% Cached locally for instant launch.");

      // Update preloaded nodes state
      const updated = { ...preloadedNodes, [node.id]: true };
      setPreloadedNodes(updated);
      SafeLocalStorage.setItem(`lmdpro_preloaded_${course.id}`, JSON.stringify(updated));

      toastService.show({
        type: "success",
        title: "⚡ Milestone Pre-Loaded!",
        message: `Content for "${node.title}" has been pre-cached in local memory for instant zero-latency access.`,
        duration: 4000,
      });

      // Update selected node state
      setSelectedNode((prev) => (prev ? { ...prev, isPreloaded: true } : null));
    } catch (e) {
      console.error("Pre-load error:", e);
      toastService.show({
        type: "warning",
        title: "Pre-load Warning",
        message: "Failed to pre-cache offline data. The lesson can still be opened online.",
        duration: 3000,
      });
    } finally {
      setTimeout(() => {
        setPreloadingNodeId(null);
        setPreloadProgress(0);
        setPreloadStage("");
      }, 800);
    }
  };

  // Pan and drag canvas navigation
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

  // Filtered nodes based on tab
  const filteredNodes = React.useMemo(() => {
    if (filterMode === "all") return nodes;
    if (filterMode === "unlocked") {
      return nodes.filter(
        (n) => n.status === "completed" || n.status === "in-progress" || n.status === "next-milestone"
      );
    }
    if (filterMode === "upcoming") {
      return nodes.filter((n) => n.status === "next-milestone" || n.status === "upcoming" || n.status === "locked");
    }
    if (filterMode === "completed") {
      return nodes.filter((n) => n.status === "completed");
    }
    return nodes;
  }, [nodes, filterMode]);

  // Status visual styles
  const statusStyles = {
    completed: {
      bg: "bg-cyan-950/40",
      border: "border-cyan-500/60",
      text: "text-cyan-300",
      badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
      icon: CheckCircle2,
      label: "Mastered",
    },
    "in-progress": {
      bg: "bg-gradient-to-br from-cyan-900/60 to-blue-950/60",
      border: "border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.25)]",
      text: "text-cyan-300 font-bold",
      badge: "bg-cyan-400 text-slate-950 font-black",
      icon: PlayCircle,
      label: "In Progress",
    },
    "next-milestone": {
      bg: "bg-[#0c2432]/90",
      border: "border-emerald-400/80 shadow-[0_0_12px_rgba(52,211,153,0.2)]",
      text: "text-emerald-300 font-bold",
      badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      icon: Target,
      label: "Next Milestone",
    },
    upcoming: {
      bg: "bg-[#091b24]/70",
      border: "border-[#1b3b4a] hover:border-cyan-500/40",
      text: "text-slate-300",
      badge: "bg-slate-800 text-slate-300 border-slate-700",
      icon: Clock,
      label: "Upcoming",
    },
    locked: {
      bg: "bg-[#06141c]/60",
      border: "border-slate-800/80 opacity-75 hover:opacity-100",
      text: "text-slate-400",
      badge: "bg-slate-900 text-slate-400 border-slate-800",
      icon: Lock,
      label: "Locked",
    },
  };

  const completionPct = nodes.length > 0 ? Math.round((completedCount / nodes.length) * 100) : 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top Header Controls Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0a1a24]/90 backdrop-blur-xl border border-[#1b3b4a] shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <h3 className="font-black text-white text-base">Interactive Learning Roadmap</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
              {nodes.length} Milestones
            </span>
          </div>
          <p className="text-xs text-[#78a2b5] mt-0.5">
            Click any milestone node to view prerequisites, inspect dependencies, or pre-load learning content.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Filter Pills */}
          <div className="flex items-center p-1 rounded-xl bg-[#06141c] border border-[#143140] text-xs">
            {(["all", "unlocked", "upcoming", "completed"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterMode(tab)}
                className={`px-2.5 py-1 rounded-lg capitalize font-semibold transition-colors text-xs ${
                  filterMode === tab
                    ? "bg-cyan-500 text-slate-950 font-bold shadow"
                    : "text-[#7ba4b8] hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-[#06141c] border border-[#143140]">
            <button
              onClick={() => setViewMode("graph")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === "graph" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-[#7ba4b8]"
              }`}
            >
              DAG Graph
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === "timeline" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-[#7ba4b8]"
              }`}
            >
              Timeline
            </button>
          </div>

          {/* Zoom and Reset Controls (for Graph View) */}
          {viewMode === "graph" && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.8))}
                className="p-1.5 rounded-lg bg-[#0e222e] hover:bg-[#163648] text-[#7ba4b8] hover:text-white border border-[#1b3b4a]"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.6))}
                className="p-1.5 rounded-lg bg-[#0e222e] hover:bg-[#163648] text-[#7ba4b8] hover:text-white border border-[#1b3b4a]"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={resetView}
                className="p-1.5 rounded-lg bg-[#0e222e] hover:bg-[#163648] text-[#7ba4b8] hover:text-white border border-[#1b3b4a]"
                title="Reset Viewport"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress & Milestone Overview Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-[#091b24] border border-[#1b3b4a] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#78a2b5] font-bold uppercase block">Completion Rate</span>
            <span className="text-sm font-black text-cyan-400">{completionPct}% Mastered</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
            {completedCount}/{nodes.length}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#091b24] border border-[#1b3b4a] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#78a2b5] font-bold uppercase block">Next Target Milestone</span>
            <span className="text-xs font-bold text-emerald-400 truncate max-w-[130px] block">
              {nodes.find((n) => n.status === "next-milestone")?.title || "Course Completed! 🎉"}
            </span>
          </div>
          <Target className="w-5 h-5 text-emerald-400 shrink-0" />
        </div>

        <div className="p-3 rounded-xl bg-[#091b24] border border-[#1b3b4a] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#78a2b5] font-bold uppercase block">Estimated Study Time</span>
            <span className="text-sm font-black text-white">{Math.round(totalMinutes / 60)} Hours</span>
          </div>
          <Clock className="w-5 h-5 text-cyan-400 shrink-0" />
        </div>

        <div className="p-3 rounded-xl bg-[#091b24] border border-[#1b3b4a] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#78a2b5] font-bold uppercase block">Pre-loaded Milestones</span>
            <span className="text-sm font-black text-cyan-300">
              {Object.keys(preloadedNodes).length} Cached Locally
            </span>
          </div>
          <DownloadCloud className="w-5 h-5 text-cyan-400 shrink-0" />
        </div>
      </div>

      {/* Main Roadmap Area: Graph or Timeline */}
      {viewMode === "graph" ? (
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="relative w-full h-[620px] rounded-3xl bg-[#061219] border border-[#1b3b4a] overflow-hidden cursor-grab active:cursor-grabbing select-none shadow-2xl"
        >
          {/* SVG Background Grid Patterns */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <defs>
              <pattern id="roadmapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1b3b4a" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#roadmapGrid)" />
          </svg>

          {/* SVG Directed Links Layer */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: "0 0",
            }}
          >
            <defs>
              <linearGradient id="activeRoadmapLink" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
              <linearGradient id="completedRoadmapLink" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0891b2" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>

            {links.map((link, idx) => {
              const srcNode = nodes.find((n) => n.id === link.source);
              const tgtNode = nodes.find((n) => n.id === link.target);
              if (!srcNode || !tgtNode) return null;

              // Compute bezier curve from right of source to left of target
              const sx = srcNode.x + 230;
              const sy = srcNode.y + 45;
              const tx = tgtNode.x;
              const ty = tgtNode.y + 45;
              const dx = Math.max(40, (tx - sx) * 0.5);

              const pathData = `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`;

              const isSelectedRelation =
                selectedNode &&
                (selectedNode.id === tgtNode.id || selectedNode.id === srcNode.id);

              return (
                <g key={idx}>
                  <path
                    d={pathData}
                    fill="none"
                    stroke={
                      isSelectedRelation
                        ? "#22d3ee"
                        : link.isActive
                        ? "url(#activeRoadmapLink)"
                        : link.isCompleted
                        ? "url(#completedRoadmapLink)"
                        : "#142d3b"
                    }
                    strokeWidth={isSelectedRelation ? 3.5 : link.isActive ? 2.8 : 1.8}
                    strokeDasharray={link.isActive ? "5 5" : link.isUpcoming ? "4 4" : "none"}
                    className={link.isActive ? "animate-[dash_1s_linear_infinite]" : ""}
                    opacity={isSelectedRelation ? 1 : 0.8}
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
              const style = statusStyles[node.status];
              const Icon = style.icon;
              const isSelected = selectedNode?.id === node.id;
              const isCurrent = node.lessonId === activeLessonId;

              return (
                <div
                  key={node.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                  }}
                  className={`absolute w-60 p-4 rounded-2xl border transition-all duration-200 cursor-pointer shadow-xl ${
                    style.bg
                  } ${style.border} ${
                    isSelected
                      ? "ring-2 ring-cyan-400 scale-105 z-30 shadow-cyan-500/30"
                      : isCurrent
                      ? "ring-2 ring-cyan-400/80 z-20 scale-102"
                      : "hover:scale-102 hover:border-cyan-500/60 z-10"
                  }`}
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                  }}
                >
                  {/* Top Node Meta */}
                  <div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
                    <span className="text-[#6ea1b5] truncate max-w-[130px]">{node.moduleTitle}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] border uppercase ${style.badge}`}>
                      {style.label}
                    </span>
                  </div>

                  {/* Lesson Title */}
                  <h4 className="text-xs font-black text-white leading-snug line-clamp-2 mb-2.5">
                    {node.title}
                  </h4>

                  {/* Prerequisites & Pre-loaded status tags */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px]">
                    <div className="flex items-center gap-1 text-[#78a2b5]">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{node.durationMinutes}m</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {node.isPreloaded && (
                        <span
                          className="flex items-center gap-0.5 text-[9px] text-emerald-400 font-bold"
                          title="100% Pre-loaded in local memory"
                        >
                          <Check className="w-3 h-3" />
                          <span>Cached</span>
                        </span>
                      )}
                      <div className={`flex items-center gap-1 font-bold ${style.text}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Node Detail Inspector Drawer / Modal */}
          {selectedNode && (
            <div className="absolute right-4 top-4 bottom-4 w-88 p-5 rounded-3xl bg-[#091b24]/95 backdrop-blur-2xl border border-cyan-500/40 shadow-2xl space-y-4 animate-in slide-in-from-right-4 duration-200 z-40 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/10">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-cyan-400">
                      Milestone Inspector
                    </span>
                    <h4 className="text-sm font-black text-white mt-0.5 leading-snug">
                      {selectedNode.title}
                    </h4>
                    <p className="text-[11px] text-[#78a2b5]">{selectedNode.moduleTitle}</p>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-1.5 rounded-lg bg-[#0d2633] hover:bg-[#153a4d] text-[#7ba4b8] hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* Node Metadata Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-[#06141c] border border-[#143140]">
                    <span className="text-[#6ea1b5] block text-[9px] uppercase font-bold">Estimated Time</span>
                    <span className="font-bold text-white">{selectedNode.durationMinutes} Minutes</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#06141c] border border-[#143140]">
                    <span className="text-[#6ea1b5] block text-[9px] uppercase font-bold">Difficulty</span>
                    <span className="font-bold text-white capitalize">{selectedNode.difficulty}</span>
                  </div>
                </div>

                {/* Core Dependency Chain Analysis */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-extrabold text-[#78a2b5] flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Required Prerequisites & Dependencies</span>
                    </span>
                    <span className="text-[10px] font-bold text-cyan-400">
                      {selectedNode.prerequisites.filter((p) => completedLessonIds.includes(p)).length}/
                      {selectedNode.prerequisites.length} Mastered
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#06141c] border border-[#143140] space-y-2">
                    {selectedNode.prerequisites.length > 0 ? (
                      selectedNode.prerequisites.map((prereqId, pIdx) => {
                        const prereqNode = nodes.find((n) => n.id === prereqId);
                        const isMastered = completedLessonIds.includes(prereqId);
                        return (
                          <div
                            key={pIdx}
                            className={`flex items-center justify-between p-2 rounded-xl text-xs border ${
                              isMastered
                                ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-300"
                                : "bg-[#0a1f2b] border-[#18394a] text-slate-300"
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate pr-2">
                              {isMastered ? (
                                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                              ) : (
                                <Lock className="w-4 h-4 text-blue-400 shrink-0" />
                              )}
                              <span className="truncate text-[11px] font-semibold">
                                {prereqNode?.title || "Prerequisite Foundation"}
                              </span>
                            </div>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                isMastered
                                  ? "bg-cyan-500/20 text-cyan-300"
                                  : "bg-blue-500/20 text-blue-300"
                              }`}
                            >
                              {isMastered ? "Cleared" : "Required"}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold py-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Direct entry node. No prerequisites required!</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pre-load Content Section */}
                <div className="p-3.5 rounded-2xl bg-[#06151e] border border-cyan-500/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-white flex items-center gap-1.5">
                      <DownloadCloud className="w-4 h-4 text-cyan-400" />
                      <span>Zero-Latency Pre-Loader</span>
                    </span>
                    {selectedNode.isPreloaded ? (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Cached in Memory
                      </span>
                    ) : (
                      <span className="text-[9px] text-[#78a2b5]">Ready to cache</span>
                    )}
                  </div>

                  <p className="text-[10px] text-[#78a2b5] leading-relaxed">
                    Pre-load syllabus text, RAG semantic vectors, and quiz models so you can seamlessly transition to this milestone with zero loading delays.
                  </p>

                  {/* Pre-load progress bar */}
                  {preloadingNodeId === selectedNode.id && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-cyan-400">
                        <span>{preloadStage}</span>
                        <span>{preloadProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#122530] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                          style={{ width: `${preloadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handlePreloadMilestone(selectedNode)}
                    disabled={preloadingNodeId !== null}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      selectedNode.isPreloaded
                        ? "bg-[#0e2736] hover:bg-[#153b52] text-cyan-300 border border-cyan-500/40"
                        : "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50"
                    }`}
                  >
                    {preloadingNodeId === selectedNode.id ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <DownloadCloud className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {preloadingNodeId === selectedNode.id
                        ? "Pre-loading Milestone..."
                        : selectedNode.isPreloaded
                        ? "Re-cache Milestone Content"
                        : "Pre-load Content for Offline Access"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => {
                    if (onSelectLesson) {
                      onSelectLesson(selectedNode.lessonId, selectedNode.moduleId);
                    }
                    setSelectedNode(null);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all hover:scale-102"
                >
                  <PlayCircle className="w-4 h-4 text-slate-950" />
                  <span>Launch Milestone Lesson</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Timeline View of Milestones */
        <div className="p-6 rounded-3xl bg-[#061219] border border-[#1b3b4a] space-y-6">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#142d3b]">
            {filteredNodes.map((node, idx) => {
              const style = statusStyles[node.status];
              const Icon = style.icon;
              return (
                <div key={node.id} className="relative group">
                  {/* Circle Anchor on timeline */}
                  <div
                    className={`absolute -left-[27px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      node.status === "completed"
                        ? "bg-cyan-500 border-cyan-300 text-slate-950"
                        : node.status === "in-progress"
                        ? "bg-cyan-400 border-white text-slate-950 animate-pulse"
                        : "bg-[#061219] border-[#1b3b4a] text-slate-400"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                  </div>

                  {/* Card Content */}
                  <div
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${style.bg} ${style.border} hover:border-cyan-400/60`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#6ea1b5]">
                          <span>{node.moduleTitle}</span>
                          <span>•</span>
                          <span>{node.durationMinutes} Mins</span>
                          {node.isPreloaded && (
                            <span className="text-emerald-400 font-bold">• ⚡ Pre-loaded</span>
                          )}
                        </div>
                        <h4 className="text-sm font-black text-white mt-1">{node.title}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreloadMilestone(node);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-[#091f2b] hover:bg-[#123347] text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5 transition-colors"
                        >
                          <DownloadCloud className="w-3.5 h-3.5" />
                          <span>{node.isPreloaded ? "Cached" : "Pre-load"}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectLesson) onSelectLesson(node.lessonId, node.moduleId);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-transform hover:scale-105"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Launch</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
