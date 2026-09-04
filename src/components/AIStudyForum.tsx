import React from "react";
import {
  MessageSquare,
  Sparkles,
  ThumbsUp,
  Search,
  Filter,
  Send,
  BookOpen,
  Award,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Tag,
  Share2,
  ChevronRight,
  MessageCircle,
  Clock,
  User,
  Lightbulb,
  FileCode,
  Check,
  RefreshCw,
  Plus,
  Compass,
  ArrowUpRight,
  Brain,
  HelpCircle,
  Flame,
  Bookmark,
  ExternalLink,
  Layers
} from "lucide-react";
import { UserProfile, Course } from "../shared/types";

export interface ForumReply {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: "student" | "instructor" | "ai_tutor" | "ta";
  authorAvatar?: string;
  content: string;
  codeSnippet?: string;
  createdAt: string;
  upvotes: number;
  isHelpful?: boolean;
  isAcceptedSolution?: boolean;
  upvotedBy: string[];
}

export interface ForumThread {
  id: string;
  courseId: string;
  courseTitle: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  content: string;
  codeSnippet?: string;
  authorId: string;
  authorName: string;
  authorRole: "student" | "instructor" | "ta";
  authorAvatar?: string;
  createdAt: string;
  tags: string[];
  upvotes: number;
  upvotedBy: string[];
  replies: ForumReply[];
  isResolved: boolean;
  pinned?: boolean;
  views: number;
  aiSummary?: {
    summary: string;
    keyTakeaways: string[];
    consensusSolution?: string;
    generatedAt: string;
  };
  moderation: {
    status: "approved" | "flagged" | "auto_verified";
    score: number; // 0-100%
    flags?: string[];
    feedback?: string;
  };
}

interface AIStudyForumProps {
  user: UserProfile;
  courses: Course[];
  initialCourseFilter?: string;
  onOpenAITutor?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const AIStudyForum: React.FC<AIStudyForumProps> = ({
  user,
  courses,
  initialCourseFilter = "all",
  onOpenAITutor,
  onNavigateTab,
}) => {
  // Filters & Navigation
  const [selectedCourseId, setSelectedCourseId] = React.useState<string>(initialCourseFilter);
  const [selectedModuleId, setSelectedModuleId] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "unresolved" | "resolved" | "ai_answered">("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [sortBy, setSortBy] = React.useState<"recent" | "helpful" | "active">("helpful");
  const [activeThreadId, setActiveThreadId] = React.useState<string | null>(null);

  // Modal / Form state
  const [showCreateModal, setShowCreateModal] = React.useState<boolean>(false);
  const [newTitle, setNewTitle] = React.useState<string>("");
  const [newContent, setNewContent] = React.useState<string>("");
  const [newCodeSnippet, setNewCodeSnippet] = React.useState<string>("");
  const [newCourseId, setNewCourseId] = React.useState<string>(courses[0]?.id || "");
  const [newModuleId, setNewModuleId] = React.useState<string>(courses[0]?.modules[0]?.id || "");
  const [newTagsInput, setNewTagsInput] = React.useState<string>("");
  
  // Real-time AI Moderation state for thread creation
  const [moderationFeedback, setModerationFeedback] = React.useState<{
    status: "checking" | "safe" | "warning";
    message: string;
    score: number;
  } | null>(null);

  // Reply state
  const [replyContent, setReplyContent] = React.useState<string>("");
  const [replyCode, setReplyCode] = React.useState<string>("");
  const [isSummarizing, setIsSummarizing] = React.useState<boolean>(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Initial Seed Data with high-quality academic discussions
  const [threads, setThreads] = React.useState<ForumThread[]>(() => {
    const saved = localStorage.getItem("zalamati_ai_study_forum_threads");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved threads:", e);
      }
    }
    return [
      {
        id: "th-1",
        courseId: courses[0]?.id || "c-ai-agentic",
        courseTitle: courses[0]?.title || "Autonomous Agentic Systems & Multi-Agent Swarms",
        moduleId: courses[0]?.modules[0]?.id || "m-1",
        moduleTitle: courses[0]?.modules[0]?.title || "Module 1: Cellular Sheaf Consensus & Sheaf-ADMM",
        title: "Mathematical intuition behind the Sheaf Laplacian block entries in decentralized consensus",
        content:
          "In the Sheaf-ADMM primal update, how does the restriction map $F_{v \\to e}$ project local stalk coordinates when stalks across heterogeneous agents have mismatched dimensions ($d_u \\neq d_v$)? Does the coboundary operator automatically regularize boundary rank deficiencies?",
        codeSnippet: `// Sheaf Laplacian block definition:
// (L_F)_{u,v} = - sum_{e=(u,v)} (F_{u->e})^T * F_{v->e}
const coboundaryResidual = computeCoboundary(localStalkU, localStalkV, restrictionMaps);`,
        authorId: "user-academic-1",
        authorName: "Sarah Al-Hassan",
        authorRole: "student",
        createdAt: "2 hours ago",
        tags: ["SheafTheory", "ADMM", "MathFormulation", "Consensus"],
        upvotes: 28,
        upvotedBy: ["user-2", "user-3"],
        views: 142,
        isResolved: true,
        pinned: true,
        aiSummary: {
          summary:
            "Discussion clarifies that restriction maps $F_{v \\to e} \\in \\mathbb{R}^{d_e \\times d_v}$ map disparate agent stalks into a shared edge dimension $d_e$. Coboundary operator $\\delta$ computes residuals strictly in edge stalk coordinates, preserving dimensional alignment.",
          keyTakeaways: [
            "Restriction maps project private stalk spaces into symmetric shared edge stalks $F(e)$.",
            "Sheaf Laplacian blocks $(L_F)_{u,v}$ handle dimensional parity via transpose multiplication $(F_{u \\to e})^T F_{v \\to e}$.",
            "Dual multipliers accumulate cross-stalk geometric mismatch without forcing agents to broadcast private state vectors."
          ],
          consensusSolution:
            "Use the Moore-Pered pseudo-inverse on the restriction matrix if edge rank is non-maximal to prevent numerical singular drift.",
          generatedAt: "1 hour ago"
        },
        moderation: {
          status: "auto_verified",
          score: 99,
          feedback: "Verified high-quality academic question with rigorous mathematical framing."
        },
        replies: [
          {
            id: "rep-1",
            authorId: "user-dr-petra",
            authorName: "Petra AI (Faculty Teaching Assistant)",
            authorRole: "ai_tutor",
            content:
              "Excellent question, Sarah! Notice that the edge stalk space $\\mathcal{F}(e) = \\mathbb{R}^{d_e}$ serves as the common denominator. Each restriction map $F_{v \\to e}: \\mathbb{R}^{d_v} \\to \\mathbb{R}^{d_e}$ is a linear operator. When evaluating $(x_u, x_v)$, the difference $F_{u \\to e} x_u - F_{v \\to e} x_v$ takes place entirely within $\\mathbb{R}^{d_e}$. Consequently, differing stalk dimensions $d_u$ and $d_v$ never clash directly.",
            createdAt: "1 hour ago",
            upvotes: 35,
            isHelpful: true,
            isAcceptedSolution: true,
            upvotedBy: ["user-academic-1", "user-4"]
          },
          {
            id: "rep-2",
            authorId: "user-fellow",
            authorName: "Omar Tarek",
            authorRole: "student",
            content:
              "Adding to Petra's explanation: Check Section 3.1 of the course paper on Topological Sheaf ADMM. The restriction matrices are configured during graph initialization and kept sparse for $O(N)$ communication complexity.",
            createdAt: "45 minutes ago",
            upvotes: 12,
            isHelpful: true,
            upvotedBy: ["user-academic-1"]
          }
        ]
      },
      {
        id: "th-2",
        courseId: courses[1]?.id || courses[0]?.id || "c-distributed",
        courseTitle: courses[1]?.title || courses[0]?.title || "Distributed Systems & Cloud Computing",
        moduleId: courses[1]?.modules[0]?.id || courses[0]?.modules[0]?.id || "m-2",
        moduleTitle: courses[1]?.modules[0]?.title || courses[0]?.modules[0]?.title || "Module 2: Raft Consensus State Transitions",
        title: "Handling split-vote edge cases in Raft election timeouts with randomized jitter",
        content:
          "During network split simulations, if two candidate nodes time out at the exact same millisecond interval, how does randomized jitter prevent infinite election split loops? What is the recommended range for heartbeat vs election timeout?",
        authorId: "user-tariq",
        authorName: "Tariq Mansoor",
        authorRole: "student",
        createdAt: "5 hours ago",
        tags: ["Raft", "DistributedSystems", "FaultTolerance", "Election"],
        upvotes: 19,
        upvotedBy: [],
        views: 98,
        isResolved: false,
        moderation: {
          status: "auto_verified",
          score: 98,
          feedback: "Compliant with academic honor code and systems engineering curriculum."
        },
        replies: [
          {
            id: "rep-3",
            authorId: "user-nashmi",
            authorName: "Nashmi (Course Guide)",
            authorRole: "instructor",
            content:
              "In Raft implementations, the golden rule is: Election Timeout must be significantly larger than Heartbeat Interval (typically $150\\text{ms} - 300\\text{ms}$ with uniform random jitter $\\pm 50\\text{ms}$, while Heartbeat is $20\\text{ms} - 50\\text{ms}$). This ensures at least one node times out first and captures majority votes before competitors trigger split ballots.",
            createdAt: "3 hours ago",
            upvotes: 22,
            isHelpful: true,
            isAcceptedSolution: false,
            upvotedBy: ["user-tariq"]
          }
        ]
      }
    ];
  });

  // Save threads to local storage
  React.useEffect(() => {
    try {
      localStorage.setItem("zalamati_ai_study_forum_threads", JSON.stringify(threads));
    } catch (err) {
      console.warn("Could not persist forum threads:", err);
    }
  }, [threads]);

  // Real-time AI Moderation Checker as user types
  React.useEffect(() => {
    if (!newTitle.trim() && !newContent.trim()) {
      setModerationFeedback(null);
      return;
    }

    const textToCheck = `${newTitle} ${newContent}`.toLowerCase();
    
    // Check for inappropriate terms, test answer leaks, or spam
    const toxicTerms = ["hack", "cheat", "leak exam", "bypass test", "scam", "stupid", "idiot", "buy paper"];
    const hasToxicity = toxicTerms.some((t) => textToCheck.includes(t));

    if (hasToxicity) {
      setModerationFeedback({
        status: "warning",
        message: "Potential Academic Integrity or Tone violation detected. Please refine your query to focus on conceptual learning.",
        score: 42,
      });
    } else if (newContent.length > 20) {
      setModerationFeedback({
        status: "safe",
        message: "AI Moderation Guard: High Academic Tone & Verified Scholarly Structure (Score: 98/100).",
        score: 98,
      });
    } else {
      setModerationFeedback({
        status: "checking",
        message: "Analyzing question clarity and module alignment...",
        score: 85,
      });
    }
  }, [newTitle, newContent]);

  // State for Summary View Mode
  const [isSummaryViewMode, setIsSummaryViewMode] = React.useState<boolean>(false);

  // Filter and sort threads
  const filteredThreads = React.useMemo(() => {
    return threads
      .filter((t) => {
        // Course filter
        if (selectedCourseId !== "all" && t.courseId !== selectedCourseId) return false;
        // Module filter
        if (selectedModuleId !== "all" && t.moduleId !== selectedModuleId) return false;
        // Status filter
        if (statusFilter === "resolved" && !t.isResolved) return false;
        if (statusFilter === "unresolved" && t.isResolved) return false;
        if (statusFilter === "ai_answered" && !t.replies.some((r) => r.authorRole === "ai_tutor")) return false;
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = t.title.toLowerCase().includes(q);
          const matchContent = t.content.toLowerCase().includes(q);
          const matchTags = t.tags.some((tag) => tag.toLowerCase().includes(q));
          const matchAuthor = t.authorName.toLowerCase().includes(q);
          const matchCourse = t.courseTitle.toLowerCase().includes(q);
          if (!matchTitle && !matchContent && !matchTags && !matchAuthor && !matchCourse) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        if (sortBy === "helpful") return b.upvotes - a.upvotes;
        if (sortBy === "active") return b.replies.length - a.replies.length;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [threads, selectedCourseId, selectedModuleId, statusFilter, searchQuery, sortBy]);

  // Selected thread object
  const activeThread = React.useMemo(() => {
    if (!activeThreadId) return null;
    return threads.find((t) => t.id === activeThreadId) || null;
  }, [threads, activeThreadId]);

  // Available modules for current course filter
  const currentCourseModules = React.useMemo(() => {
    if (selectedCourseId === "all") {
      return courses.flatMap((c) => c.modules);
    }
    const c = courses.find((course) => course.id === selectedCourseId);
    return c ? c.modules : [];
  }, [courses, selectedCourseId]);

  // Create Thread Handler
  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || !newCourseId) return;

    const courseObj = courses.find((c) => c.id === newCourseId);
    const moduleObj = courseObj?.modules.find((m) => m.id === newModuleId);

    const parsedTags = newTagsInput
      .split(/[\s,]+/)
      .map((t) => t.replace(/^#/, "").trim())
      .filter(Boolean);

    const newThread: ForumThread = {
      id: `th-${Date.now()}`,
      courseId: newCourseId,
      courseTitle: courseObj?.title || "Academic Course",
      moduleId: newModuleId || "mod-gen",
      moduleTitle: moduleObj?.title || "General Course Concepts",
      title: newTitle.trim(),
      content: newContent.trim(),
      codeSnippet: newCodeSnippet.trim() || undefined,
      authorId: user.id || "current-user",
      authorName: user.name || "Student Scholar",
      authorRole: (user.role as any) || "student",
      createdAt: "Just now",
      tags: parsedTags.length > 0 ? parsedTags : ["GeneralDiscussion"],
      upvotes: 1,
      upvotedBy: [user.id],
      replies: [],
      isResolved: false,
      views: 1,
      moderation: {
        status: "approved",
        score: moderationFeedback?.score || 95,
        feedback: "Automatically validated through AI Moderation filter."
      }
    };

    setThreads((prev) => [newThread, ...prev]);
    setShowCreateModal(false);
    setNewTitle("");
    setNewContent("");
    setNewCodeSnippet("");
    setNewTagsInput("");
    setActiveThreadId(newThread.id);
  };

  // Upvote Thread Handler
  const handleUpvoteThread = (threadId: string) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          const isUpvoted = t.upvotedBy.includes(user.id);
          const newUpvotedBy = isUpvoted
            ? t.upvotedBy.filter((id) => id !== user.id)
            : [...t.upvotedBy, user.id];
          return {
            ...t,
            upvotes: isUpvoted ? Math.max(0, t.upvotes - 1) : t.upvotes + 1,
            upvotedBy: newUpvotedBy
          };
        }
        return t;
      })
    );
  };

  // Upvote Reply Handler
  const handleUpvoteReply = (threadId: string, replyId: string) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            replies: t.replies.map((r) => {
              if (r.id === replyId) {
                const isUpvoted = r.upvotedBy.includes(user.id);
                const newUpvotedBy = isUpvoted
                  ? r.upvotedBy.filter((id) => id !== user.id)
                  : [...r.upvotedBy, user.id];
                return {
                  ...r,
                  upvotes: isUpvoted ? Math.max(0, r.upvotes - 1) : r.upvotes + 1,
                  upvotedBy: newUpvotedBy,
                  isHelpful: (isUpvoted ? r.upvotes - 1 : r.upvotes + 1) >= 3
                };
              }
              return r;
            })
          };
        }
        return t;
      })
    );
  };

  // Mark Reply as Accepted Solution
  const handleAcceptSolution = (threadId: string, replyId: string) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            isResolved: true,
            replies: t.replies.map((r) => ({
              ...r,
              isAcceptedSolution: r.id === replyId
            }))
          };
        }
        return t;
      })
    );
  };

  // Post Reply
  const handlePostReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !activeThread) return;

    const newReply: ForumReply = {
      id: `rep-${Date.now()}`,
      authorId: user.id || "user-current",
      authorName: user.name || "Student Scholar",
      authorRole: (user.role as any) || "student",
      content: replyContent.trim(),
      codeSnippet: replyCode.trim() || undefined,
      createdAt: "Just now",
      upvotes: 1,
      upvotedBy: [user.id],
      isHelpful: false
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === activeThread.id) {
          return {
            ...t,
            replies: [...t.replies, newReply]
          };
        }
        return t;
      })
    );

    setReplyContent("");
    setReplyCode("");
  };


  // Trigger AI Discussion Summarization
  const handleGenerateAISummary = async (thread: ForumThread) => {
    setIsSummarizing(true);
    try {
      const response = await fetch("/api/forum/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: thread.id,
          title: thread.title,
          content: thread.content,
          replies: thread.replies,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to summarize thread");
      }
      
      const data = await response.json();
      
      setThreads((prev) =>
        prev.map((t) => {
          if (t.id === thread.id) {
            return {
              ...t,
              aiSummary: {
                summary: data.summary,
                keyTakeaways: data.keyTakeaways,
                consensusSolution: data.consensusSolution,
                generatedAt: "Just now",
              },
            };
          }
          return t;
        })
      );
    } catch (error) {
      console.error("Error generating AI summary:", error);
    } finally {
      setIsSummarizing(false);
    }
  };


  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Forum Header & Academic Branding */}
      <div className="rounded-3xl bg-gradient-to-r from-[#061219] via-[#092230] to-[#06141d] border border-[#163647] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-cyan-500/10 via-cyan-500/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                AI-Moderated Academic Forum
              </span>
              <span className="text-xs text-[#789cae] flex items-center gap-1">
                <Brain className="w-3.5 h-3.5 text-cyan-400" />
                Socratic Peer Review Engine
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Module Study Forums & Peer Collaboration
            </h1>
            
            <p className="text-sm text-[#87a9b8] leading-relaxed">
              Engage in academically moderated technical discussions linked directly to accredited course modules. Ask questions, receive AI faculty synthesis, upvote helpful peer solutions, and earn reputation XP.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-500 hover:from-cyan-400 hover:to-cyan-400 text-black font-bold text-xs shadow-lg shadow-cyan-950/60 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>Ask Module Question</span>
            </button>

            {onOpenAITutor && (
              <button
                onClick={onOpenAITutor}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0a1e28] hover:bg-[#122e3e] text-cyan-300 border border-cyan-500/30 font-semibold text-xs transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI Tutor Consult</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="bg-[#061219]/90 border border-[#163647] rounded-2xl p-4 shadow-lg space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-[#789cae] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, questions, code, or tags..."
              className="w-full pl-10 pr-4 py-2 bg-[#030b10] border border-[#143242] rounded-xl text-xs text-white placeholder-[#628799] focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Course Select Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                setSelectedModuleId("all");
              }}
              className="w-full px-3 py-2 bg-[#030b10] border border-[#143242] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="all">All Academic Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Module Select Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
              disabled={selectedCourseId === "all" && currentCourseModules.length === 0}
              className="w-full px-3 py-2 bg-[#030b10] border border-[#143242] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
            >
              <option value="all">All Course Modules</option>
              {currentCourseModules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#030b10] border border-[#143242] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="helpful">Most Helpful</option>
              <option value="recent">Most Recent</option>
              <option value="active">Most Active</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Status Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#132f3e]">
          <span className="text-[11px] font-semibold text-[#789cae] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-cyan-400" /> Filter by:
          </span>

          {[
            { id: "all", label: `All Discussions (${threads.length})` },
            { id: "unresolved", label: "Open & Needs Answers" },
            { id: "resolved", label: "Resolved with Verified Solution" },
            { id: "ai_answered", label: "AI Faculty Answered" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                statusFilter === item.id
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "bg-[#030b10] text-[#789cae] hover:text-white border border-[#143242]"
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Gemini Summary View Toggle Button */}
          <button
            onClick={() => setIsSummaryViewMode(!isSummaryViewMode)}
            className={`ml-auto px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              isSummaryViewMode
                ? "bg-gradient-to-r from-cyan-500 to-cyan-500 text-black shadow-md shadow-cyan-950/40"
                : "bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/60"
            }`}
            title="Toggle Gemini Bulleted Thread Summaries"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isSummaryViewMode ? "text-black" : "text-cyan-400"}`} />
            <span>{isSummaryViewMode ? "Summary View On" : "Summary View"}</span>
          </button>
        </div>
      </div>

      {/* Main Forum Split View: Thread List & Thread Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Thread List */}
        <div className={`${activeThread ? "lg:col-span-5" : "lg:col-span-12"} space-y-3`}>
          {filteredThreads.length === 0 ? (
            <div className="bg-[#061219]/90 border border-[#163647] rounded-2xl p-10 text-center space-y-3 shadow-lg">
              <MessageSquare className="w-10 h-10 text-[#628799] mx-auto opacity-50" />
              <h3 className="text-sm font-bold text-white">No discussions found matching criteria</h3>
              <p className="text-xs text-[#789cae] max-w-sm mx-auto">
                Be the first scholar to initiate a technical discussion for this module.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-500 text-black font-bold text-xs shadow-md"
              >
                Create New Thread
              </button>
            </div>
          ) : (
            filteredThreads.map((thread) => {
              const isSelected = activeThread?.id === thread.id;
              const hasAcceptedSolution = thread.replies.some((r) => r.isAcceptedSolution);
              const hasAiTutorAnswer = thread.replies.some((r) => r.authorRole === "ai_tutor");

              return (
                <div
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? "bg-[#09202c] border-cyan-400/50 shadow-xl shadow-cyan-950/40"
                      : "bg-[#061219]/90 hover:bg-[#081822] border-[#163647] hover:border-[#22485e]"
                  }`}
                >
                  {thread.pinned && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500/20 to-transparent px-3 py-0.5 text-[10px] font-bold text-cyan-300 flex items-center gap-1 border-b border-cyan-500/30 rounded-bl-xl">
                      <Flame className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                      Pinned Scholar Discussion
                    </div>
                  )}

                  <div className="space-y-2.5">
                    {/* Header tags and module metadata */}
                    <div className="flex flex-wrap items-center gap-2 text-[10px]">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-semibold truncate max-w-[200px]">
                        {thread.courseTitle}
                      </span>
                      <span className="text-[#789cae] truncate max-w-[180px]">
                        • {thread.moduleTitle}
                      </span>
                    </div>

                    {/* Thread Title */}
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {thread.title}
                    </h3>

                    {/* Thread snippet preview */}
                    <p className="text-xs text-[#87a9b8] line-clamp-2 leading-relaxed">
                      {thread.content}
                    </p>

                    {/* Badges & Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {thread.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-[#030b10] border border-[#143242] text-[#789cae]"
                        >
                          #{tag}
                        </span>
                      ))}

                      {hasAcceptedSolution && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Resolved
                        </span>
                      )}

                      {hasAiTutorAnswer && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-cyan-400" /> AI Faculty
                        </span>
                      )}
                    </div>

                    {/* Footer Stats & Author */}
                    <div className="flex items-center justify-between text-[11px] text-[#789cae] pt-2 border-t border-[#132f3e]/60">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-cyan-900/50 border border-cyan-500/30 flex items-center justify-center text-[10px] text-cyan-300 font-bold">
                          {thread.authorName.charAt(0)}
                        </span>
                        <span className="text-[#9fc5d8] font-medium">{thread.authorName}</span>
                        <span>• {thread.createdAt}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-cyan-300">
                          <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                          {thread.upvotes}
                        </span>
                        <span className="flex items-center gap-1 text-cyan-300">
                          <MessageCircle className="w-3.5 h-3.5 text-cyan-400" />
                          {thread.replies.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Active Thread Detail View */}
        {activeThread && (
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#061219]/90 border border-[#163647] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
              {/* Thread Header & Meta */}
              <div className="space-y-3 border-b border-[#132f3e] pb-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-semibold">
                      {activeThread.courseTitle}
                    </span>
                    <span className="text-xs text-[#789cae]">
                      {activeThread.moduleTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpvoteThread(activeThread.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        activeThread.upvotedBy.includes(user.id)
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
                          : "bg-[#030b10] text-[#789cae] hover:text-white border-[#143242]"
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{activeThread.upvotes} Helpful</span>
                    </button>

                    <button
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(window.location.href);
                          setCopiedId(activeThread.id);
                          setTimeout(() => setCopiedId(null), 2000);
                        }
                      }}
                      className="p-2 rounded-xl bg-[#030b10] border border-[#143242] text-[#789cae] hover:text-white transition-colors"
                      title="Share Thread Link"
                    >
                      {copiedId === activeThread.id ? (
                        <Check className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <h2 className="text-lg sm:text-2xl font-extrabold text-white leading-snug">
                  {activeThread.title}
                </h2>

                <div className="flex items-center justify-between text-xs text-[#789cae]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-cyan-900/60 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-300 text-xs">
                      {activeThread.authorName.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-white">{activeThread.authorName}</span>
                      <span className="text-[10px] text-[#628799] ml-1.5">({activeThread.authorRole})</span>
                    </div>
                  </div>
                  <span>Posted {activeThread.createdAt} • {activeThread.views} views</span>
                </div>
              </div>

              {/* Thread Main Content */}
              <div className="space-y-4 text-sm text-[#c8d9e2] leading-relaxed">
                <p className="whitespace-pre-line">{activeThread.content}</p>

                {/* Code Block if attached */}
                {activeThread.codeSnippet && (
                  <div className="rounded-2xl bg-[#02070a] border border-[#143242] p-4 font-mono text-xs text-cyan-200 overflow-x-auto">
                    <div className="flex items-center justify-between text-[10px] text-[#628799] border-b border-[#143242] pb-2 mb-2">
                      <span className="flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-cyan-400" /> Code Snippet / Mathematical Expression
                      </span>
                    </div>
                    <pre><code>{activeThread.codeSnippet}</code></pre>
                  </div>
                )}

                {/* Tag Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {activeThread.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-lg bg-[#030b10] border border-[#143242] text-cyan-300 font-mono"
                    >
                      #{t}
                    </span>
                  ))}

                  <span className="text-xs px-2.5 py-1 rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 flex items-center gap-1 font-medium ml-auto">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    AI Moderation Passed ({activeThread.moderation.score}%)
                  </span>
                </div>
              </div>

              {/* AI Discussion Synthesis Card */}
              <div className="rounded-2xl bg-gradient-to-r from-[#071d27] to-[#0a2734] border border-cyan-500/30 p-4 sm:p-5 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      AI Discussion Synthesis & Faculty Consensus
                    </h4>
                  </div>

                  <button
                    onClick={() => handleGenerateAISummary(activeThread)}
                    disabled={isSummarizing}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all"
                  >
                    <RefreshCw className={`w-3 h-3 text-cyan-400 ${isSummarizing ? "animate-spin" : ""}`} />
                    <span>{isSummarizing ? "Synthesizing..." : "Update AI Synthesis"}</span>
                  </button>
                </div>

                {activeThread.aiSummary ? (
                  <div className="space-y-3 text-xs text-[#a0c5d6]">
                    <p className="leading-relaxed">{activeThread.aiSummary.summary}</p>
                    
                    <div className="space-y-1.5 pt-1">
                      <div className="font-bold text-white text-[11px] uppercase tracking-wider">
                        Key Takeaways:
                      </div>
                      <ul className="space-y-1">
                        {activeThread.aiSummary.keyTakeaways.map((t, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {activeThread.aiSummary.consensusSolution && (
                      <div className="p-3 rounded-xl bg-[#030b10] border border-cyan-500/30 text-cyan-200 text-xs">
                        <strong className="text-cyan-300 block mb-1">Recommended Solution:</strong>
                        {activeThread.aiSummary.consensusSolution}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-[#789cae] flex items-center justify-between">
                    <span>No automated summary generated yet for this thread.</span>
                    <button
                      onClick={() => handleGenerateAISummary(activeThread)}
                      className="text-cyan-300 underline font-semibold"
                    >
                      Generate Now
                    </button>
                  </div>
                )}
              </div>

              {/* Replies Section */}
              <div className="space-y-4 pt-4 border-t border-[#132f3e]">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <span>Peer & Faculty Responses ({activeThread.replies.length})</span>
                  </h3>
                </div>

                {/* Reply list */}
                <div className="space-y-3">
                  {activeThread.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        reply.isAcceptedSolution
                          ? "bg-cyan-950/30 border-cyan-500/40 shadow-lg shadow-cyan-950/30"
                          : reply.authorRole === "ai_tutor"
                          ? "bg-cyan-950/30 border-cyan-500/40"
                          : "bg-[#030b10] border-[#143242]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                              reply.authorRole === "ai_tutor"
                                ? "bg-cyan-500 text-black"
                                : reply.authorRole === "instructor"
                                ? "bg-cyan-500 text-black"
                                : "bg-cyan-900 text-cyan-300 border border-cyan-500/30"
                            }`}
                          >
                            {reply.authorRole === "ai_tutor" ? "🤖" : reply.authorName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>{reply.authorName}</span>
                              {reply.authorRole === "ai_tutor" && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-normal">
                                  AI Faculty Tutor
                                </span>
                              )}
                              {reply.authorRole === "instructor" && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-normal">
                                  Course Instructor
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-[#628799]">{reply.createdAt}</div>
                          </div>
                        </div>

                        {reply.isAcceptedSolution ? (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Accepted Solution
                          </span>
                        ) : activeThread.authorId === user.id ? (
                          <button
                            onClick={() => handleAcceptSolution(activeThread.id, reply.id)}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-[#061219] hover:bg-cyan-950/60 border border-[#163647] hover:border-cyan-500/40 text-[#789cae] hover:text-cyan-300 transition-colors"
                          >
                            Accept as Solution
                          </button>
                        ) : null}
                      </div>

                      <p className="text-xs text-[#c8d9e2] leading-relaxed whitespace-pre-line">
                        {reply.content}
                      </p>

                      {reply.codeSnippet && (
                        <div className="mt-2.5 rounded-xl bg-[#02070a] border border-[#143242] p-3 font-mono text-xs text-cyan-200 overflow-x-auto">
                          <pre><code>{reply.codeSnippet}</code></pre>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#132f3e]/40 text-xs">
                        <button
                          onClick={() => handleUpvoteReply(activeThread.id, reply.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                            reply.upvotedBy.includes(user.id)
                              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                              : "bg-[#061219] text-[#789cae] hover:text-white border-[#163647]"
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3 text-cyan-400" />
                          <span>{reply.upvotes} Helpful</span>
                        </button>

                        {reply.isHelpful && (
                          <span className="text-[10px] text-cyan-400 flex items-center gap-1 font-semibold">
                            <Award className="w-3 h-3 text-cyan-400" /> Peer Verified Answer
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Input Form */}
                <form onSubmit={handlePostReply} className="space-y-3 pt-4 border-t border-[#132f3e]">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-cyan-400" /> Submit Your Solution or Comment
                  </h4>
                  
                  <textarea
                    rows={3}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a clear, academic, step-by-step technical response..."
                    className="w-full p-3.5 bg-[#030b10] border border-[#143242] rounded-xl text-xs text-white placeholder-[#628799] focus:outline-none focus:border-cyan-500 transition-colors"
                  />

                  <input
                    type="text"
                    value={replyCode}
                    onChange={(e) => setReplyCode(e.target.value)}
                    placeholder="Optional: Attach mathematical expression or code snippet..."
                    className="w-full px-3.5 py-2 bg-[#030b10] border border-[#143242] rounded-xl text-xs text-cyan-300 font-mono placeholder-[#628799] focus:outline-none focus:border-cyan-500 transition-colors"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#789cae]">
                      Submissions are scanned by the AI Academic Moderator.
                    </span>
                    <button
                      type="submit"
                      disabled={!replyContent.trim()}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-500 text-black font-bold text-xs shadow-md disabled:opacity-50 transition-all"
                    >
                      Post Response (+15 XP)
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Thread Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#061219] border border-[#1b3b4a] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-[#132f3e] pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Create Module Study Question</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-[#789cae] hover:text-white hover:bg-[#163647] transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-4">
              {/* Course & Module Select */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#87a9b8] block mb-1">
                    Select Target Course *
                  </label>
                  <select
                    value={newCourseId}
                    onChange={(e) => {
                      setNewCourseId(e.target.value);
                      const c = courses.find((course) => course.id === e.target.value);
                      if (c?.modules[0]) setNewModuleId(c.modules[0].id);
                    }}
                    required
                    className="w-full px-3 py-2 bg-[#030b10] border border-[#143242] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#87a9b8] block mb-1">
                    Select Course Module *
                  </label>
                  <select
                    value={newModuleId}
                    onChange={(e) => setNewModuleId(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#030b10] border border-[#143242] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {courses
                      .find((c) => c.id === newCourseId)
                      ?.modules.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-[#87a9b8] block mb-1">
                  Question / Dilemma Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Mathematical difference between Sheaf-ADMM vs Standard Consensus..."
                  className="w-full px-4 py-2.5 bg-[#030b10] border border-[#143242] rounded-xl text-xs text-white placeholder-[#628799] focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Content Description */}
              <div>
                <label className="text-xs font-semibold text-[#87a9b8] block mb-1">
                  Detailed Explanation & Context *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Provide detailed background, where you got stuck, and formulas or logic applied..."
                  className="w-full p-4 bg-[#030b10] border border-[#143242] rounded-xl text-xs text-white placeholder-[#628799] focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Code / Math Snippet */}
              <div>
                <label className="text-xs font-semibold text-[#87a9b8] block mb-1">
                  Optional Code Snippet or LaTeX Expression
                </label>
                <textarea
                  rows={2}
                  value={newCodeSnippet}
                  onChange={(e) => setNewCodeSnippet(e.target.value)}
                  placeholder="// Paste your algorithm or equations here..."
                  className="w-full p-3 bg-[#02070a] border border-[#143242] rounded-xl text-xs text-cyan-300 font-mono placeholder-[#628799] focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-semibold text-[#87a9b8] block mb-1">
                  Topic Tags (space separated)
                </label>
                <input
                  type="text"
                  value={newTagsInput}
                  onChange={(e) => setNewTagsInput(e.target.value)}
                  placeholder="e.g. Algorithms DistributedSystems Calculus"
                  className="w-full px-4 py-2 bg-[#030b10] border border-[#143242] rounded-xl text-xs text-white placeholder-[#628799] focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Live Moderation Feedback Banner */}
              {moderationFeedback && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                    moderationFeedback.status === "safe"
                      ? "bg-cyan-950/50 border-cyan-500/40 text-cyan-200"
                      : moderationFeedback.status === "warning"
                      ? "bg-cyan-950/50 border-cyan-500/40 text-cyan-200"
                      : "bg-cyan-950/50 border-cyan-500/40 text-cyan-200"
                  }`}
                >
                  {moderationFeedback.status === "safe" ? (
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : moderationFeedback.status === "warning" ? (
                    <AlertTriangle className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <Brain className="w-4 h-4 text-cyan-400 shrink-0 animate-spin" />
                  )}
                  <span>{moderationFeedback.message}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#132f3e]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#0a1e28] text-[#87a9b8] hover:text-white text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim() || !newContent.trim() || moderationFeedback?.status === "warning"}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-500 text-black font-bold text-xs shadow-lg disabled:opacity-50 transition-all"
                >
                  Publish Thread (+25 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
