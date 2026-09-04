import React from "react";
import {
  Sparkles,
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  GraduationCap,
  Clock,
  Bookmark,
  CheckCircle2,
  RefreshCw,
  Tag,
  Filter,
  Brain,
  Layers,
  ChevronRight,
  TrendingUp,
  ThumbsUp,
  AlertTriangle,
  Target,
  Compass,
  Check,
  Search,
  Zap,
  Activity,
  ArrowRight,
  ShieldCheck,
  Share2,
} from "lucide-react";
import { UserProfile, Course } from "../shared/types";

export interface CuratedResource {
  id: string;
  title: string;
  type: "article" | "video" | "course" | "paper" | "simulation";
  url: string;
  source: string;
  description: string;
  reasoning: string;
  estimatedTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  tags: string[];
  isBookmarked?: boolean;
  isCompleted?: boolean;
  upvotes: number;
  gapId?: string; // Mapped to a detected conceptual gap
}

export interface ContentGap {
  id: string;
  topic: string;
  concept: string;
  severity: "critical" | "moderate" | "minor";
  detectedFrom: string;
  confidenceScore: number;
  diagnosis: string;
  suggestedAction: string;
  resolved: boolean;
  recommendedResourceIds: string[];
}

interface AIContentCurationEngineProps {
  user: UserProfile;
  currentCourse?: Course | null;
  courses?: Course[];
}

export const AIContentCurationEngine: React.FC<AIContentCurationEngineProps> = ({
  user,
  currentCourse,
  courses = [],
}) => {
  const [activeTab, setActiveTab] = React.useState<"recommendations" | "gaps" | "interests">("recommendations");
  const [filterType, setFilterType] = React.useState<"all" | "article" | "video" | "course" | "paper" | "simulation">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCourseId, setSelectedCourseId] = React.useState<string>(
    currentCourse?.id || courses[0]?.id || "default"
  );
  const [isCurating, setIsCurating] = React.useState<boolean>(false);
  const [isScanningGaps, setIsScanningGaps] = React.useState<boolean>(false);
  const [bookmarkedIds, setBookmarkedIds] = React.useState<Set<string>>(new Set(["res-1"]));
  const [completedIds, setCompletedIds] = React.useState<Set<string>>(new Set());
  const [upvotedIds, setUpvotedIds] = React.useState<Set<string>>(new Set(["res-1", "res-3"]));

  const activeCourse =
    courses.find((c) => c.id === selectedCourseId) ||
    currentCourse ||
    courses[0];

  // Default rich curated educational library
  const [curatedResources, setCuratedResources] = React.useState<CuratedResource[]>([
    {
      id: "res-1",
      title: "Attention Is All You Need: Transformers Architecture Explained",
      type: "paper",
      url: "https://arxiv.org/abs/1706.03762",
      source: "arXiv Research Archive",
      description: "The seminal research paper establishing multi-head self-attention mechanisms for modern LLMs.",
      reasoning: `Curated for your level (${(user.learningLevel || "advanced").toUpperCase()}) to strengthen mathematical foundations in Transformer architectures.`,
      estimatedTime: "25 min read",
      difficulty: "Advanced",
      tags: ["Transformers", "Deep Learning", "Attention"],
      upvotes: 142,
    },
    {
      id: "res-2",
      title: "Illustrated Guide to Raft Distributed Consensus Protocol",
      type: "simulation",
      url: "https://raft.github.io/",
      source: "Raft Research Visualizer",
      description: "Interactive visual breakdown of leader election, heartbeat timeouts, and log replication quorums.",
      reasoning: "Directly bridges your detected gap in Distributed State Consensus and fault tolerance.",
      estimatedTime: "15 min interact",
      difficulty: "Intermediate",
      tags: ["Consensus", "Raft", "Distributed Systems"],
      upvotes: 98,
      gapId: "gap-1",
    },
    {
      id: "res-3",
      title: "Stanford CS224N: Natural Language Processing with Deep Learning",
      type: "video",
      url: "https://www.youtube.com/watch?v=8rXD5-xhemo",
      source: "YouTube - Stanford Online",
      description: "Comprehensive lecture series covering word embeddings, recurrent neural nets, and contextual attention.",
      reasoning: `Recommended based on your declared interest in AI & Agentic Systems and current ${user.xpPoints || 1200} XP milestone.`,
      estimatedTime: "52 min video",
      difficulty: "Intermediate",
      tags: ["NLP", "Stanford", "Neural Nets"],
      upvotes: 215,
    },
    {
      id: "res-4",
      title: "MIT OpenCourseWare: Advanced Algorithms & Data Structures",
      type: "course",
      url: "https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/",
      source: "MIT OCW Portal",
      description: "Full degree-level course on dynamic programming, network flow, NP-completeness, and randomized algorithms.",
      reasoning: "Perfect fit to advance from your current academic rank to the next level.",
      estimatedTime: "12 hrs course",
      difficulty: "Expert",
      tags: ["Algorithms", "MIT", "Computer Science"],
      upvotes: 176,
    },
    {
      id: "res-5",
      title: "Building Zero-Latency WebGPU Shaders for Edge AI Inference",
      type: "article",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API",
      source: "MDN Web Docs & W3C",
      description: "Technical guide on WGSL compute shaders, memory buffer alignment, and client GPU acceleration.",
      reasoning: "Directly aligns with your platform experience with WebGPU and Gemini Edge Agents.",
      estimatedTime: "18 min read",
      difficulty: "Advanced",
      tags: ["WebGPU", "WGSL", "Performance"],
      upvotes: 84,
      gapId: "gap-3",
    },
    {
      id: "res-6",
      title: "Quantum Superposition & Wavefunction Collapse Interactive Sandbox",
      type: "simulation",
      url: "https://phet.colorado.edu/en/simulations/quantum-wave-interference",
      source: "PhET Interactive Simulations",
      description: "Real-time double slit particle emitter modeling wave-particle duality and probability density collapses.",
      reasoning: "Targets recent quiz struggle in Quantum Mechanics: Double-slit probability mechanics.",
      estimatedTime: "20 min lab",
      difficulty: "Beginner",
      tags: ["Quantum", "PhET", "Superposition"],
      upvotes: 130,
      gapId: "gap-2",
    },
  ]);

  // Detected knowledge gaps with proactive remediation suggestions
  const [contentGaps, setContentGaps] = React.useState<ContentGap[]>([
    {
      id: "gap-1",
      topic: "Distributed Systems & Consensus",
      concept: "Raft Log Replication & Split-Vote Resolution",
      severity: "critical",
      detectedFrom: "Quiz: Distributed State Machines (Score: 60%)",
      confidenceScore: 94,
      diagnosis: "Difficulty identifying how randomized election timeouts prevent split-vote deadlocks during leader elections.",
      suggestedAction: "Explore the interactive Raft protocol simulator and complete 3 failure-recovery scenarios.",
      resolved: false,
      recommendedResourceIds: ["res-2"],
    },
    {
      id: "gap-2",
      topic: "Quantum Mechanics",
      concept: "Wavefunction Collapse & Probability Current",
      severity: "moderate",
      detectedFrom: "Flashcard Deck: Quantum Foundations (Missed 2x)",
      confidenceScore: 88,
      diagnosis: "Confusion between classical deterministic trajectories and quantum probability amplitudes upon measurement.",
      suggestedAction: "Run the PhET double-slit interference simulation and complete the guided tutorial.",
      resolved: false,
      recommendedResourceIds: ["res-6"],
    },
    {
      id: "gap-3",
      topic: "High-Performance Edge AI",
      concept: "WGSL Workgroup Shared Memory Barrier Sync",
      severity: "minor",
      detectedFrom: "Code Exercise: WebGPU Compute Shaders",
      confidenceScore: 79,
      diagnosis: "Race conditions observed when syncing thread groups without workgroupBarrier() invocations.",
      suggestedAction: "Read the MDN WGSL Memory Alignment guide and benchmark sample matrix multiply shaders.",
      resolved: true,
      recommendedResourceIds: ["res-5"],
    },
  ]);

  // User declared and inferred interests
  const [userInterests, setUserInterests] = React.useState<string[]>([
    "Agentic AI Architecture",
    "Distributed Consensus",
    "Quantum Algorithms",
    "WebGPU Acceleration",
    "Neuro-Symbolic Reasoning",
    "Full-Stack TypeScript",
  ]);
  const [newInterestInput, setNewInterestInput] = React.useState("");

  // Auto-curate on mount and when course changes
  React.useEffect(() => {
    handleFetchAiCurations();
  }, [selectedCourseId]);

  const handleFetchAiCurations = async () => {
    setIsCurating(true);
    try {
      const targetTopic = activeCourse?.title || "Advanced AI & Software Systems";
      const targetCategory = activeCourse?.category || "Technology & Science";

      const res = await fetch("/api/gemini/curate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: targetTopic,
          category: targetCategory,
          level: user.learningLevel,
          skills: user.skills || [],
          interests: userInterests,
          unresolvedGaps: contentGaps.filter((g) => !g.resolved),
          progressPercentage: user.xpPoints
            ? Math.min(100, Math.floor((user.xpPoints % 1000) / 10))
            : 35,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.resources)) {
          setCuratedResources(data.resources);
        }
      }
    } catch (e) {
      console.warn("AI Content Curation fallback:", e);
    } finally {
      setIsCurating(false);
    }
  };

  const handleRunGapDiagnosis = async () => {
    setIsScanningGaps(true);
    setTimeout(() => {
      setIsScanningGaps(false);
    }, 1200);
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCompleted = (id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleUpvote = (id: string) => {
    setUpvotedIds((prev) => {
      const next = new Set(prev);
      const isUpvoted = next.has(id);
      if (isUpvoted) next.delete(id);
      else next.add(id);

      setCuratedResources((list) =>
        list.map((r) =>
          r.id === id ? { ...r, upvotes: r.upvotes + (isUpvoted ? -1 : 1) } : r
        )
      );
      return next;
    });
  };

  const toggleResolveGap = (gapId: string) => {
    setContentGaps((prev) =>
      prev.map((g) => (g.id === gapId ? { ...g, resolved: !g.resolved } : g))
    );
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterestInput.trim()) return;
    if (!userInterests.includes(newInterestInput.trim())) {
      setUserInterests([...userInterests, newInterestInput.trim()]);
    }
    setNewInterestInput("");
  };

  const handleRemoveInterest = (interest: string) => {
    setUserInterests(userInterests.filter((i) => i !== interest));
  };

  const filtered = curatedResources.filter((r) => {
    const matchesType = filterType === "all" || r.type === filterType;
    const matchesSearch =
      searchQuery.trim() === "" ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (type: CuratedResource["type"]) => {
    switch (type) {
      case "article":
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case "video":
        return <Video className="w-4 h-4 text-cyan-400" />;
      case "course":
        return <GraduationCap className="w-4 h-4 text-cyan-400" />;
      case "paper":
        return <BookOpen className="w-4 h-4 text-cyan-400" />;
      case "simulation":
        return <Zap className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getTypeBadge = (type: CuratedResource["type"]) => {
    switch (type) {
      case "article":
        return "bg-cyan-500/10 text-cyan-300 border-cyan-500/30";
      case "video":
        return "bg-cyan-500/10 text-cyan-300 border-cyan-500/30";
      case "course":
        return "bg-cyan-500/10 text-cyan-300 border-cyan-500/30";
      case "paper":
        return "bg-cyan-500/10 text-cyan-300 border-cyan-500/30";
      case "simulation":
        return "bg-cyan-500/10 text-cyan-300 border-cyan-500/30";
    }
  };

  const getSeverityBadge = (sev: ContentGap["severity"]) => {
    switch (sev) {
      case "critical":
        return "bg-cyan-950/80 border-cyan-500/40 text-cyan-300";
      case "moderate":
        return "bg-cyan-950/80 border-cyan-500/40 text-cyan-300";
      case "minor":
        return "bg-cyan-950/80 border-cyan-500/40 text-cyan-300";
    }
  };

  const unresolvedGapsCount = contentGaps.filter((g) => !g.resolved).length;

  return (
    <div className="rounded-3xl bg-[#0c1a24] border border-[#1b3b4a] p-6 md:p-8 space-y-6 text-white shadow-2xl animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#183646] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-cyan-400" />
              AI Recommendation & Gap Analysis
            </span>
            <span className="text-xs text-[#7397aa]">
              Autonomous Content Engine
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Adaptive Knowledge Curation</span>
          </h2>
          <p className="text-xs text-[#7fa3b5] max-w-2xl">
            Autonomous resource recommendations and proactive concept gap detection synthesized from your learning path, quiz error patterns, and declared academic goals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {courses.length > 0 && (
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#08151c] border border-[#1b3b4a] text-cyan-300 text-xs font-semibold focus:outline-none focus:border-cyan-400 max-w-[200px] truncate"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleFetchAiCurations}
            disabled={isCurating}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isCurating ? "animate-spin" : ""}`} />
            <span>{isCurating ? "Curating..." : "Refresh AI Feed"}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#183646] pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("recommendations")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "recommendations"
                ? "bg-cyan-500 text-slate-950 font-black shadow"
                : "bg-[#08151c] text-[#7397aa] border border-[#1b3b4a] hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Curated Resources ({curatedResources.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("gaps")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "gaps"
                ? "bg-cyan-400 text-slate-950 font-black shadow"
                : "bg-[#08151c] text-[#7397aa] border border-[#1b3b4a] hover:text-white"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>
              Knowledge Gaps ({unresolvedGapsCount} Active)
            </span>
          </button>

          <button
            onClick={() => setActiveTab("interests")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "interests"
                ? "bg-cyan-400 text-slate-950 font-black shadow"
                : "bg-[#08151c] text-[#7397aa] border border-[#1b3b4a] hover:text-white"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Stated Interests ({userInterests.length})</span>
          </button>
        </div>

        {activeTab === "recommendations" && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#7397aa] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search curated feed..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-[#08151c] border border-[#1b3b4a] text-xs text-white placeholder-[#5e8292] focus:outline-none focus:border-cyan-400 w-48"
              />
            </div>
          </div>
        )}
      </div>

      {/* TAB 1: CURATED RECOMMENDATIONS */}
      {activeTab === "recommendations" && (
        <div className="space-y-6">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
              {(["all", "article", "video", "paper", "simulation", "course"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all ${
                    filterType === t
                      ? "bg-cyan-500 text-slate-950 font-black shadow"
                      : "bg-[#08151c] text-[#7397aa] border border-[#1b3b4a] hover:text-white"
                  }`}
                >
                  {t === "all" ? "All Types" : t === "simulation" ? "Simulations / Labs" : `${t}s`}
                </button>
              ))}
            </div>

            <div className="text-xs text-[#7397aa] flex items-center gap-2">
              <span>Showing {filtered.length} curated resources</span>
              <span className="text-cyan-400 font-mono font-semibold">• Sourced & Grounded</span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item) => {
              const isBookmarked = bookmarkedIds.has(item.id);
              const isCompleted = completedIds.has(item.id);
              const isUpvoted = upvotedIds.has(item.id);

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl bg-[#08151c]/90 border transition-all duration-300 flex flex-col justify-between space-y-4 hover:border-cyan-500/50 shadow-lg ${
                    isCompleted ? "opacity-75 border-cyan-500/30" : "border-[#1b3b4a]"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${getTypeBadge(item.type)}`}>
                          {getTypeIcon(item.type)}
                          <span>{item.type}</span>
                        </span>
                        <span className="text-[11px] font-semibold text-[#7397aa] truncate max-w-[140px]">
                          {item.source}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded font-mono font-bold">
                          {item.difficulty}
                        </span>
                        <button
                          onClick={() => toggleBookmark(item.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isBookmarked
                              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                              : "bg-[#0c1a24] text-[#7397aa] border-[#1b3b4a] hover:text-white"
                          }`}
                          title={isBookmarked ? "Remove Bookmark" : "Bookmark Resource"}
                        >
                          <Bookmark className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#80a3b5] leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    {/* AI Reasoning Box */}
                    <div className="p-3 rounded-xl bg-[#0c202d] border border-cyan-500/20 text-[11px] text-cyan-200 space-y-1">
                      <div className="font-bold flex items-center gap-1 text-cyan-400 text-[10px] uppercase">
                        <Sparkles className="w-3 h-3 text-cyan-300" />
                        <span>Why AI Curated This For You</span>
                      </div>
                      <p className="leading-snug text-[#9cc0d2]">{item.reasoning}</p>
                    </div>

                    {/* Tags */}
                    {item.tags && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-md bg-[#0c1a24] border border-[#1b3b4a] text-[10px] text-cyan-300">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="pt-2 border-t border-[#183646] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#7397aa] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {item.estimatedTime}
                      </span>

                      <button
                        onClick={() => toggleUpvote(item.id)}
                        className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border transition-colors ${
                          isUpvoted
                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                            : "bg-[#0c1a24] text-[#7397aa] border-[#1b3b4a] hover:text-white"
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{item.upvotes}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCompleted(item.id)}
                        className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                          isCompleted
                            ? "bg-cyan-950 text-cyan-300 border-cyan-500/40"
                            : "bg-[#0c1a24] text-[#7397aa] border-[#1b3b4a] hover:text-white"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{isCompleted ? "Completed" : "Mark Done"}</span>
                      </button>

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-[#122e3d] hover:bg-[#193c4e] text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1 shadow transition-all"
                      >
                        <span>Explore</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PROACTIVE KNOWLEDGE GAP DETECTOR */}
      {activeTab === "gaps" && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-5 rounded-2xl bg-[#08151c] border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <span>AI Automated Knowledge Gap Diagnostic</span>
              </h3>
              <p className="text-xs text-[#7fa3b5] max-w-xl leading-relaxed">
                The agent parses your quiz accuracy, code evaluations, and flashcard hesitation timings to isolate specific conceptual gaps before exams and capstones.
              </p>
            </div>

            <button
              onClick={handleRunGapDiagnosis}
              disabled={isScanningGaps}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${isScanningGaps ? "animate-spin" : ""}`} />
              <span>{isScanningGaps ? "Scanning Quiz History..." : "Run AI Gap Scan"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {contentGaps.map((gap) => {
              const matchedResources = curatedResources.filter((r) =>
                gap.recommendedResourceIds.includes(r.id)
              );

              return (
                <div
                  key={gap.id}
                  className={`p-5 rounded-2xl bg-[#08151c] border transition-all ${
                    gap.resolved ? "border-cyan-500/30 opacity-80" : "border-[#1b3b4a] hover:border-cyan-500/40"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${getSeverityBadge(gap.severity)}`}>
                          {gap.severity} severity
                        </span>
                        <span className="text-xs text-[#7fa3b5] font-semibold">
                          {gap.topic}
                        </span>
                        <span className="text-[10px] text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded font-mono">
                          {gap.confidenceScore}% Confidence
                        </span>
                      </div>

                      <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                        <span>{gap.concept}</span>
                        {gap.resolved && (
                          <span className="text-xs text-cyan-400 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> (Resolved)
                          </span>
                        )}
                      </h4>

                      <p className="text-xs text-[#95b8c8] leading-relaxed">
                        <strong className="text-cyan-300">Diagnosis: </strong>
                        {gap.diagnosis}
                      </p>

                      <div className="p-3 rounded-xl bg-[#0c202d] border border-cyan-500/20 text-xs text-cyan-200 flex items-start gap-2">
                        <Target className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-cyan-300 text-[10px] uppercase">
                            Proactive Remediation Action
                          </div>
                          <div>{gap.suggestedAction}</div>
                        </div>
                      </div>

                      {/* Recommended Remedial Resources */}
                      {matchedResources.length > 0 && (
                        <div className="pt-2 space-y-2">
                          <div className="text-[10px] text-[#7397aa] font-bold uppercase tracking-wider">
                            Direct Remedy Resources:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {matchedResources.map((res) => (
                              <a
                                key={res.id}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-[#122e3d] hover:bg-[#193c4e] text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 shadow"
                              >
                                {getTypeIcon(res.type)}
                                <span className="max-w-[200px] truncate">{res.title}</span>
                                <ExternalLink className="w-3 h-3 text-cyan-400" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 flex md:flex-col items-center gap-2">
                      <button
                        onClick={() => toggleResolveGap(gap.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                          gap.resolved
                            ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40"
                            : "bg-[#102b3a] hover:bg-cyan-950 text-white hover:text-cyan-300 border border-[#1b3b4a]"
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        <span>{gap.resolved ? "Mark Unresolved" : "Mark Mastered"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: STATED INTERESTS & GOAL TARGETING */}
      {activeTab === "interests" && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-5 rounded-2xl bg-[#08151c] border border-cyan-500/30 space-y-3">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span>Personalized Research & Career Interests</span>
            </h3>
            <p className="text-xs text-[#7fa3b5] leading-relaxed">
              Add specific domains, algorithms, programming languages, or academic specialties. The Gemini Curation Engine uses these to tailor daily literature and interactive simulation feeds.
            </p>

            <form onSubmit={handleAddInterest} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newInterestInput}
                onChange={(e) => setNewInterestInput(e.target.value)}
                placeholder="e.g. Neuromorphic Computing, Reinforcement Learning, WebAssembly..."
                className="flex-1 px-4 py-2 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] text-xs text-white placeholder-[#5e8292] focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow"
              >
                Add Stated Interest
              </button>
            </form>
          </div>

          <div className="flex flex-wrap gap-2">
            {userInterests.map((interest) => (
              <div
                key={interest}
                className="px-3.5 py-2 rounded-xl bg-[#08151c] border border-[#1b3b4a] hover:border-cyan-500/40 text-xs font-semibold text-white flex items-center gap-2 group transition-all"
              >
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                <span>{interest}</span>
                <button
                  onClick={() => handleRemoveInterest(interest)}
                  className="text-[#7397aa] hover:text-cyan-400 ml-1"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
