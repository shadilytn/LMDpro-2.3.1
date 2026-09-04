import React from "react";
import {
  Sparkles,
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  Clock,
  Bookmark,
  CheckCircle2,
  RefreshCw,
  Tag,
  Filter,
  Brain,
  TrendingUp,
  AlertTriangle,
  Target,
  Search,
  Zap,
  Activity,
  ArrowRight,
  ShieldCheck,
  Share2,
  ThumbsUp,
  Sliders,
  Sparkle,
  Layers,
  ChevronDown,
  Check,
  Compass,
} from "lucide-react";
import { UserProfile, Course, StudentProgress } from "../shared/types";

export interface DiscoveryResource {
  id: string;
  title: string;
  type: "paper" | "video" | "article" | "simulation";
  url: string;
  source: string;
  description: string;
  aiReasoning: string;
  estimatedTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  tags: string[];
  isBookmarked?: boolean;
  isCompleted?: boolean;
  upvotes: number;
  gapId?: string;
  scoreMatchPercentage: number;
  publishedYear?: string;
}

export interface KnowledgeGap {
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

interface AIDiscoveryFeedProps {
  user: UserProfile;
  courses?: Course[];
  progressMap?: Record<string, StudentProgress>;
  onNavigateTab?: (tab: string) => void;
  onOpenAITutor?: () => void;
}

export const AIDiscoveryFeed: React.FC<AIDiscoveryFeedProps> = ({
  user,
  courses = [],
  progressMap = {},
  onNavigateTab,
  onOpenAITutor,
}) => {
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [selectedScope, setSelectedScope] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);
  const [activeGapFilter, setActiveGapFilter] = React.useState<string | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Interest tags state
  const [activeInterests, setActiveInterests] = React.useState<string[]>([
    "Distributed Systems",
    "Transformer Attention",
    "Quantum Algorithms",
    "Differential Calculus",
    "AST Code Security",
  ]);
  const [newTagInput, setNewTagInput] = React.useState<string>("");
  const [showInterestEditor, setShowInterestEditor] = React.useState<boolean>(false);

  // Knowledge gaps detected from student quiz performance and enrolled courses
  const [knowledgeGaps, setKnowledgeGaps] = React.useState<KnowledgeGap[]>([
    {
      id: "gap-1",
      topic: "Distributed Systems & Consensus",
      concept: "Raft Consensus Log Replication & Quorum Election",
      severity: "critical",
      detectedFrom: "Low quiz score (58%) on Consensus Verification",
      confidenceScore: 94,
      diagnosis:
        "Student demonstrated uncertainty regarding split-brain partitioning and term number state transitions.",
      suggestedAction:
        "Review interactive simulation and visual step-through of Raft leader elections.",
      resolved: false,
      recommendedResourceIds: ["res-2", "res-6"],
    },
    {
      id: "gap-2",
      topic: "Calculus & Analysis",
      concept: "Integration by Parts: Selection of u and dv via LIATE rule",
      severity: "moderate",
      detectedFrom: "Struggled with logarithmic boundary integration exercises",
      confidenceScore: 88,
      diagnosis:
        "Misidentified choice of algebraic vs exponential terms when applying the tabular integration method.",
      suggestedAction:
        "Work through guided Socratic derivation and Harvard Math 1b problem sheets.",
      resolved: false,
      recommendedResourceIds: ["res-7"],
    },
    {
      id: "gap-3",
      topic: "Deep Learning Architectures",
      concept: "Multi-Head Attention Query-Key-Value Dot Products & Scaling Factor",
      severity: "minor",
      detectedFrom: "Flashcard retention lapse after 3 days",
      confidenceScore: 79,
      diagnosis:
        "Softmax variance explosion when dimension d_k scales up without square root scaling factor.",
      suggestedAction:
        "Read original Transformer paper Section 3.2.1 and review matrix dimension diagrams.",
      resolved: true,
      recommendedResourceIds: ["res-1", "res-5"],
    },
  ]);

  // Curated Academic Discovery Feed
  const [resources, setResources] = React.useState<DiscoveryResource[]>([
    {
      id: "res-1",
      title: "Attention Is All You Need (Vaswani et al.)",
      type: "paper",
      url: "https://arxiv.org/abs/1706.03762",
      source: "arXiv:1706.03762",
      description:
        "The foundational research paper introducing the Transformer architecture, replacing recurrent and convolutional layers with multi-head self-attention.",
      aiReasoning:
        "Matched with 98% affinity to your current Deep Learning path. Reinforces mathematical formulation of self-attention mechanisms.",
      estimatedTime: "25 min read",
      difficulty: "Advanced",
      tags: ["Transformers", "Attention", "Deep Learning", "NLP"],
      upvotes: 342,
      isBookmarked: true,
      gapId: "gap-3",
      scoreMatchPercentage: 98,
      publishedYear: "2017",
    },
    {
      id: "res-2",
      title: "The Secret Lives of Data: Raft Consensus Visual Simulation",
      type: "simulation",
      url: "https://raft.github.io/",
      source: "Raft Research Project",
      description:
        "Interactive step-by-step 2D visualizer demonstrating how leader election, log replication, and network partitions are handled deterministically.",
      aiReasoning:
        "Proactively recommended to bridge your detected Critical Knowledge Gap in Distributed Consensus algorithms.",
      estimatedTime: "15 min interact",
      difficulty: "Intermediate",
      tags: ["Distributed Systems", "Raft", "Consensus", "Fault Tolerance"],
      upvotes: 218,
      gapId: "gap-1",
      scoreMatchPercentage: 96,
      publishedYear: "2024",
    },
    {
      id: "res-3",
      title: "MIT 6.046J: Design and Analysis of Algorithms (Prof. Erik Demaine)",
      type: "video",
      url: "https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/",
      source: "MIT OpenCourseWare",
      description:
        "Comprehensive academic lecture series covering dynamic programming recurrence relations, amortized analysis, and network flows.",
      aiReasoning:
        "Directly complements your current active progress in Algorithms & Data Structures degree module.",
      estimatedTime: "50 min lecture",
      difficulty: "Advanced",
      tags: ["Algorithms", "MIT", "Dynamic Programming", "Complexity"],
      upvotes: 189,
      scoreMatchPercentage: 92,
      publishedYear: "2023",
    },
    {
      id: "res-4",
      title: "Cellular Sheaves for Network Consensus & Topological Data Analysis",
      type: "paper",
      url: "https://arxiv.org/abs/2012.01234",
      source: "Applied Topology Annals",
      description:
        "Rigorous formulation of Sheaf-ADMM optimization algorithms, Laplacian diffusion over stalks, and cohomological obstruction repair.",
      aiReasoning:
        "Advanced paper matching your custom interest in Sheaf-ADMM and decentralized multi-agent coordination.",
      estimatedTime: "30 min read",
      difficulty: "Expert",
      tags: ["Sheaf Theory", "Topology", "Multi-Agent", "Consensus"],
      upvotes: 124,
      scoreMatchPercentage: 95,
      publishedYear: "2025",
    },
    {
      id: "res-5",
      title: "The Illustrated Transformer: Visualizing Attention Step by Step",
      type: "article",
      url: "https://jalammar.github.io/illustrated-transformer/",
      source: "Jay Alammar Research",
      description:
        "Clear, high-contrast breakdown of encoder-decoder vectors, positional encodings, and feed-forward transformation matrices.",
      aiReasoning:
        "Intuitive visual accompaniment recommended for conceptual mastery of attention query/key/value mechanics.",
      estimatedTime: "20 min read",
      difficulty: "Intermediate",
      tags: ["Transformers", "Neural Networks", "NLP", "Visual Guide"],
      upvotes: 412,
      gapId: "gap-3",
      scoreMatchPercentage: 94,
      publishedYear: "2024",
    },
    {
      id: "res-6",
      title: "Stanford CS 244B: Distributed Systems Engineering Seminar",
      type: "video",
      url: "https://web.stanford.edu/class/cs244b/",
      source: "Stanford Engineering",
      description:
        "Deep exploration into Byzantine fault tolerance, Paxos quorums, state machine replication, and zero-trust verification.",
      aiReasoning:
        "Targeted remedial lecture surfacing real-world cluster failure traces to resolve your active gap.",
      estimatedTime: "45 min video",
      difficulty: "Advanced",
      tags: ["Distributed Systems", "Stanford", "Fault Tolerance", "Paxos"],
      upvotes: 156,
      gapId: "gap-1",
      scoreMatchPercentage: 91,
      publishedYear: "2024",
    },
    {
      id: "res-7",
      title: "Harvard Math 1b: Integration by Parts & LIATE Strategy",
      type: "article",
      url: "https://people.math.harvard.edu/~knill/",
      source: "Harvard Mathematics Dept",
      description:
        "Structured problem sets and step-by-step algorithmic guidance on choosing u and dv using the Logarithmic-Inverse-Algebraic-Trig-Exponential heuristic.",
      aiReasoning:
        "Tailored remediation resource addressing your specific Calculus II integration challenge.",
      estimatedTime: "18 min read",
      difficulty: "Beginner",
      tags: ["Calculus", "Integration", "Harvard", "Mathematics"],
      upvotes: 95,
      gapId: "gap-2",
      scoreMatchPercentage: 89,
      publishedYear: "2024",
    },
  ]);

  const [bookmarkedIds, setBookmarkedIds] = React.useState<Set<string>>(new Set(["res-1"]));
  const [completedIds, setCompletedIds] = React.useState<Set<string>>(new Set());
  const [upvotedIds, setUpvotedIds] = React.useState<Set<string>>(new Set(["res-1", "res-2"]));

  // Toggle Bookmark
  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Toggle Completed
  const toggleCompleted = (id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Toggle Upvote
  const toggleUpvote = (id: string) => {
    setUpvotedIds((prev) => {
      const next = new Set(prev);
      const isUpvoted = next.has(id);
      if (isUpvoted) next.delete(id);
      else next.add(id);

      setResources((resList) =>
        resList.map((r) =>
          r.id === id
            ? { ...r, upvotes: isUpvoted ? r.upvotes - 1 : r.upvotes + 1 }
            : r
        )
      );
      return next;
    });
  };

  // Resolve knowledge gap
  const handleResolveGap = (gapId: string) => {
    setKnowledgeGaps((prev) =>
      prev.map((g) => (g.id === gapId ? { ...g, resolved: !g.resolved } : g))
    );
  };

  // Copy shareable link
  const handleShareLink = (res: DiscoveryResource) => {
    navigator.clipboard.writeText(res.url);
    setCopiedId(res.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Add Interest Tag
  const handleAddInterest = () => {
    if (!newTagInput.trim()) return;
    if (!activeInterests.includes(newTagInput.trim())) {
      setActiveInterests([...activeInterests, newTagInput.trim()]);
    }
    setNewTagInput("");
  };

  // Remove Interest Tag
  const handleRemoveInterest = (tagToRemove: string) => {
    setActiveInterests(activeInterests.filter((t) => t !== tagToRemove));
  };

  // Trigger Live AI Adaptive Refresh
  const handleRefreshFeed = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1200);
  };

  // Filter resources
  const filteredResources = resources.filter((res) => {
    // Type Filter
    if (selectedType !== "all" && res.type !== selectedType) return false;

    // Knowledge Gap Filter
    if (activeGapFilter && res.gapId !== activeGapFilter) return false;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = res.title.toLowerCase().includes(q);
      const matchDesc = res.description.toLowerCase().includes(q);
      const matchTags = res.tags.some((t) => t.toLowerCase().includes(q));
      const matchSource = res.source.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTags && !matchSource) return false;
    }

    return true;
  });

  const unresolvedGaps = knowledgeGaps.filter((g) => !g.resolved);

  return (
    <div className="space-y-6">
      {/* 1. Feed Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#071924] via-[#092535] to-[#071722] border border-[#163647] p-6 sm:p-7 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-cyan-500/10 via-cyan-500/5 to-transparent pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Adaptive Recommendation Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono">
                {unresolvedGaps.length} Active Gaps Detected
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Compass className="w-6 h-6 text-cyan-400" />
              AI Academic Discovery Feed
            </h2>

            <p className="text-xs sm:text-sm text-[#82a4b3] leading-relaxed">
              Curated peer-reviewed research papers, university lecture series, technical articles, and interactive simulations tailored dynamically to your active learning path, quiz diagnostics, and stated topic interests.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowInterestEditor(!showInterestEditor)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                showInterestEditor
                  ? "bg-cyan-500/20 text-cyan-200 border-cyan-500/50"
                  : "bg-[#040e14] hover:bg-[#0a202d] text-[#82a4b3] hover:text-white border-[#163647]"
              }`}
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Customize Interests ({activeInterests.length})</span>
            </button>

            <button
              onClick={handleRefreshFeed}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-500 hover:from-cyan-400 hover:to-cyan-400 text-black font-bold text-xs shadow-lg shadow-cyan-950/50 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 text-black ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
              <span>{isRefreshing ? "Synthesizing Feed..." : "Re-Score Feed"}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Interest Tags Drawer */}
        {showInterestEditor && (
          <div className="mt-6 pt-5 border-t border-[#133040] space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                Active Knowledge Trajectory & Interest Tags:
              </span>
              <span className="text-[10px] text-[#7197a9]">
                Gemini uses these tags to surface cross-disciplinary literature
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {activeInterests.map((interest) => (
                <span
                  key={interest}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#06141c] border border-cyan-500/30 text-cyan-200 text-xs font-medium group"
                >
                  <span>{interest}</span>
                  <button
                    onClick={() => handleRemoveInterest(interest)}
                    className="text-gray-400 hover:text-cyan-400 transition-colors ml-0.5 text-sm leading-none"
                    title="Remove interest"
                  >
                    ×
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add custom topic (e.g. CUDA, Topology)..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddInterest()}
                  className="px-3 py-1.5 rounded-xl bg-[#040c11] border border-[#163647] text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-400 w-56"
                />
                <button
                  onClick={handleAddInterest}
                  className="px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-all"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Knowledge Gap Diagnostics & Remediation Center */}
      <div className="rounded-3xl bg-[#061219]/90 border border-[#163647] p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#132f3e] pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyan-400" />
              Proactive Knowledge Gap Detection
            </h3>
            <p className="text-xs text-[#82a4b3]">
              Diagnostic findings synthesized from your recent quiz errors, flashcard latencies, and challenge submissions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeGapFilter && (
              <button
                onClick={() => setActiveGapFilter(null)}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-medium"
              >
                Clear Gap Filter (Showing All)
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {knowledgeGaps.map((gap) => {
            const isSelected = activeGapFilter === gap.id;
            return (
              <div
                key={gap.id}
                className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                  gap.resolved
                    ? "bg-[#040e13]/60 border-[#122834] opacity-75"
                    : isSelected
                    ? "bg-[#0b2432] border-cyan-400 shadow-lg shadow-cyan-950/40"
                    : gap.severity === "critical"
                    ? "bg-gradient-to-b from-[#180e12] to-[#0a151d] border-cyan-500/30 hover:border-cyan-500/50"
                    : "bg-[#06141c] border-[#163647] hover:border-cyan-500/40"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        gap.resolved
                          ? "bg-cyan-950/80 text-cyan-300 border-cyan-500/30"
                          : gap.severity === "critical"
                          ? "bg-cyan-950/80 text-cyan-300 border-cyan-500/40 animate-pulse"
                          : gap.severity === "moderate"
                          ? "bg-cyan-950/80 text-cyan-300 border-cyan-500/40"
                          : "bg-cyan-950/80 text-cyan-300 border-cyan-500/40"
                      }`}
                    >
                      {gap.resolved ? "Resolved" : `${gap.severity} Gap`}
                    </span>

                    <span className="text-[10px] font-mono text-[#789cae]">
                      {gap.confidenceScore}% Confidence
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-white line-clamp-1">
                      {gap.concept}
                    </h4>
                    <span className="text-[11px] text-cyan-400 font-mono">
                      {gap.topic}
                    </span>
                  </div>

                  <p className="text-xs text-[#82a4b3] leading-relaxed line-clamp-3">
                    {gap.diagnosis}
                  </p>

                  <div className="p-2.5 rounded-xl bg-[#03090e] border border-[#142e3d] text-[11px] text-cyan-200/90 flex items-start gap-2">
                    <Target className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{gap.suggestedAction}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#132f3e] flex items-center justify-between gap-2 mt-4">
                  <button
                    onClick={() =>
                      setActiveGapFilter(isSelected ? null : gap.id)
                    }
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-cyan-500 text-black font-bold"
                        : "bg-[#0a1e2a] hover:bg-[#122e3d] text-cyan-300 border border-cyan-500/30"
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>{isSelected ? "Filtering Feed" : "Bridge Gap (Feed)"}</span>
                  </button>

                  <button
                    onClick={() => handleResolveGap(gap.id)}
                    title={gap.resolved ? "Mark Unresolved" : "Mark as Mastered"}
                    className={`p-2 rounded-xl border transition-all ${
                      gap.resolved
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                        : "bg-[#08151c] text-gray-400 hover:text-cyan-300 border-[#163647]"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Search and Type Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#061219]/90 border border-[#163647] p-4 rounded-2xl shadow-lg">
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: "all", label: "All Formats", icon: Sparkles },
            { id: "paper", label: "Research Papers", icon: FileText },
            { id: "video", label: "Lectures & Videos", icon: Video },
            { id: "article", label: "Deep-Dives", icon: BookOpen },
            { id: "simulation", label: "Simulations", icon: Zap },
          ].map((type) => {
            const Icon = type.icon;
            const active = selectedType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? "bg-gradient-to-r from-cyan-600 to-cyan-600 text-white shadow-md border border-cyan-400/40"
                    : "bg-[#030b10] text-[#7c9fb0] hover:text-white hover:bg-[#0a1e28] border border-[#143242]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{type.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Field */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search academic topics, authors, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#030b10] border border-[#163647] text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-bold"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* 4. Active Filter Indicator */}
      {activeGapFilter && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Targeted Remediation Mode: Showing resources bridging{" "}
              <strong>
                {knowledgeGaps.find((g) => g.id === activeGapFilter)?.concept}
              </strong>
            </span>
          </div>
          <button
            onClick={() => setActiveGapFilter(null)}
            className="text-xs text-white bg-cyan-900/80 hover:bg-cyan-800 px-3 py-1 rounded-lg border border-cyan-500/30 transition-all font-semibold"
          >
            Show All Resources
          </button>
        </div>
      )}

      {/* 5. Discovery Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="py-16 px-6 rounded-3xl bg-[#061219]/90 border border-[#163647] text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Curated Resources Match Your Filter</h3>
          <p className="text-xs text-[#82a4b3] max-w-md mx-auto">
            Try adjusting your search query, clearing active knowledge gap filters, or clicking "Re-Score Feed" to trigger a fresh synthesis pass.
          </p>
          <button
            onClick={() => {
              setSelectedType("all");
              setActiveGapFilter(null);
              setSearchQuery("");
            }}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredResources.map((res) => {
            const isBookmarked = bookmarkedIds.has(res.id);
            const isCompleted = completedIds.has(res.id);
            const isUpvoted = upvotedIds.has(res.id);
            const associatedGap = knowledgeGaps.find((g) => g.id === res.gapId);

            return (
              <div
                key={res.id}
                className={`group rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                  isCompleted
                    ? "bg-[#040e13]/70 border-[#122b37]"
                    : "bg-[#061219]/90 border-[#163647] hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/20"
                }`}
              >
                {/* Glow accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition-all" />

                <div className="space-y-4">
                  {/* Top Metadata Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                          res.type === "paper"
                            ? "bg-blue-950/80 text-blue-300 border-blue-500/30"
                            : res.type === "video"
                            ? "bg-cyan-950/80 text-cyan-300 border-cyan-500/30"
                            : res.type === "simulation"
                            ? "bg-cyan-950/80 text-cyan-300 border-cyan-500/30"
                            : "bg-cyan-950/80 text-cyan-300 border-cyan-500/30"
                        }`}
                      >
                        {res.type === "paper" && <FileText className="w-3 h-3" />}
                        {res.type === "video" && <Video className="w-3 h-3" />}
                        {res.type === "simulation" && <Zap className="w-3 h-3" />}
                        {res.type === "article" && <BookOpen className="w-3 h-3" />}
                        <span>{res.type}</span>
                      </span>

                      <span className="text-[11px] font-semibold text-[#7297a7] border border-[#163647] px-2 py-0.5 rounded-lg bg-[#030b10]">
                        {res.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-cyan-400 font-bold bg-cyan-950/50 border border-cyan-500/30 px-2 py-0.5 rounded-md">
                        {res.scoreMatchPercentage}% Match
                      </span>
                      <button
                        onClick={() => toggleBookmark(res.id)}
                        className={`p-2 rounded-xl border transition-all ${
                          isBookmarked
                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                            : "bg-[#030b10] text-gray-400 hover:text-white border-[#163647]"
                        }`}
                        title={isBookmarked ? "Remove Bookmark" : "Save for Later"}
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            isBookmarked ? "fill-cyan-400" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Title & Source */}
                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-cyan-200 transition-colors line-clamp-2 leading-snug">
                      {res.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-[#7195a4] mt-1">
                      <span className="font-semibold text-cyan-300">{res.source}</span>
                      {res.publishedYear && <span>• {res.publishedYear}</span>}
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {res.estimatedTime}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#82a4b3] leading-relaxed line-clamp-2">
                    {res.description}
                  </p>

                  {/* AI Rationale Box */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-[#030d14] to-[#04121a] border border-cyan-500/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-cyan-300 uppercase font-mono">
                      <Sparkle className="w-3 h-3 text-cyan-400" />
                      <span>Adaptive Recommendation Rationale</span>
                    </div>
                    <p className="text-[11px] text-[#9ac0d2] leading-relaxed">
                      {res.aiReasoning}
                    </p>
                  </div>

                  {/* Associated Gap Remediator Tag */}
                  {associatedGap && (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="line-clamp-1">
                        Bridges: <strong>{associatedGap.concept}</strong>
                      </span>
                    </div>
                  )}

                  {/* Topic Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {res.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-[#030b10] border border-[#143242] text-[#7195a4] text-[10px]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Controls & Link */}
                <div className="pt-5 border-t border-[#132f3e] flex items-center justify-between gap-3 mt-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleUpvote(res.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        isUpvoted
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                          : "bg-[#030b10] text-[#7195a4] hover:text-white border-[#163647]"
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{res.upvotes}</span>
                    </button>

                    <button
                      onClick={() => handleShareLink(res)}
                      className="p-2 rounded-xl bg-[#030b10] hover:bg-[#0a1e28] text-[#7195a4] hover:text-white border border-[#163647] transition-all"
                      title="Copy Resource Citation & URL"
                    >
                      {copiedId === res.id ? (
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => toggleCompleted(res.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        isCompleted
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                          : "bg-[#030b10] text-[#7195a4] hover:text-cyan-300 border-[#163647]"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isCompleted ? "Completed" : "Mark Read"}</span>
                    </button>
                  </div>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-md transition-all active:scale-95 border border-cyan-400/20 shrink-0"
                  >
                    <span>Open Resource</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
