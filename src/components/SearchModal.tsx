import React from "react";
import { Course } from "../shared/types";
import { getApiHeaders } from "../shared/apiHelper";
import {
  Search,
  X,
  GraduationCap,
  BookOpen,
  FileText,
  ArrowRight,
  Sparkles,
  Database,
  ShieldAlert,
  MessageSquare,
  HardHat,
  CheckCircle2,
  ThumbsUp,
  Flame,
  Zap,
} from "lucide-react";
import { DEGREE_PROGRAMS } from "../data/degreePrograms";
import { OfflineStorageService } from "../services/offlineStorage";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onSelectProgram: (course: Course) => void;
  onSelectTab: (tab: string) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  courses,
  onSelectProgram,
  onSelectTab,
}: SearchModalProps) {
  const [query, setQuery] = React.useState("");
  const [ragDocs, setRagDocs] = React.useState<any[]>([]);
  const [forumThreads, setForumThreads] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [deepSearchResults, setDeepSearchResults] = React.useState<any[]>([]);
  const [activeFilter, setActiveFilter] = React.useState<"all" | "courses" | "safety" | "forums" | "degrees" | "docs">("all");
  const [sortBy, setSortBy] = React.useState<"relevance" | "date_updated" | "course_duration">("relevance");
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      const docs = OfflineStorageService.getCachedLibraryDocs();
      setRagDocs(docs);

      // Load recent searches from localStorage
      try {
        const savedRecent = localStorage.getItem("zalamati_recent_searches");
        if (savedRecent) {
          setRecentSearches(JSON.parse(savedRecent));
        }
      } catch (err) {
        console.warn("Could not load recent searches", err);
      }
      
      // Load forum threads from local persistence or defaults
      try {
        const savedThreads = localStorage.getItem("zalamati_forum_threads");
        if (savedThreads) {
          setForumThreads(JSON.parse(savedThreads));
        } else {
          setForumThreads([
            {
              id: "thread-1",
              courseTitle: "Distributed Systems & Raft Consensus",
              title: "How does Raft maintain log safety during simultaneous leader election split votes?",
              authorName: "Sarah Chen",
              tags: ["CS101", "Raft", "Consensus"],
              upvotes: 14,
              replyCount: 3,
              isSolved: true,
              dateUpdated: "2026-08-15",
              content: "Randomized election timers prevent split-vote deadlocks and quorum intersection invariants ensure safety."
            },
            {
              id: "thread-safety-1",
              courseTitle: "Industrial Health & Workspace Safety Protocols",
              title: "Best practices for LOTO (Lockout/Tagout) verification before electrical maintenance?",
              authorName: "Eng. Tariq Mansoor",
              tags: ["Safety", "LOTO", "OSHA", "Industrial"],
              upvotes: 21,
              replyCount: 5,
              isSolved: true,
              dateUpdated: "2026-08-18",
              content: "Step 6 of LOTO requires zero-energy state verification using calibrated multimeters before any contact."
            },
            {
              id: "thread-safety-2",
              courseTitle: "Heavy Machinery Operation & Forklift Defense",
              title: "Center of Gravity and Stability Triangle shifts during high-mast load transport",
              authorName: "Layla Al-Khatib",
              tags: ["Heavy Machinery", "Forklift", "Physics", "Safety"],
              upvotes: 18,
              replyCount: 4,
              isSolved: true,
              dateUpdated: "2026-08-12",
              content: "Keeping the forks 15-20cm off the ground while in motion prevents longitudinal rollover on inclines."
            },
            {
              id: "thread-2",
              courseTitle: "Edge AI & WebGPU Quantization",
              title: "Optimizing 4-bit AWQ weight unpacking in WGSL Compute Shaders",
              authorName: "Elena Rostova",
              tags: ["AI301", "WebGPU", "Quantization"],
              upvotes: 9,
              replyCount: 2,
              isSolved: false,
              dateUpdated: "2026-08-17",
              content: "WGSL bitwise shift optimizations for unpacking INT4 weights to FP16 inside uniform workgroups."
            }
          ]);
        }
      } catch (err) {
        console.warn("Could not load forum threads for search modal", err);
      }

      setDeepSearchResults([]);
      setQuery("");
      setActiveFilter("all");
    }
  }, [isOpen]);

  const saveRecentSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    try {
      const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("zalamati_recent_searches", JSON.stringify(updated));
    } catch (err) {
      console.warn("Could not save recent search", err);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("zalamati_recent_searches");
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleDeepSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      setIsSearching(true);
      try {
        const response = await fetch('/api/gemini/rag-index', {
          method: 'POST',
          headers: getApiHeaders(),
          body: JSON.stringify({ action: 'search', query: query })
        });
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.results)) {
            setDeepSearchResults(data.results);
          }
        }
      } catch (err) {
        console.warn('Deep RAG search failed', err);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleIndexContent = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch('/api/gemini/rag-index', {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({ 
          action: 'index', 
          title: `On-demand Research: ${query}`, 
          content: `DeepCrawl agentic research finding for the query: ${query}. This document represents the current synthesized state of knowledge regarding ${query}, indexed dynamically for the user session.`,
          topic: 'Dynamically Indexed'
        })
      });
      if (response.ok) {
        const data = await response.json();
        const docs = OfflineStorageService.getCachedLibraryDocs();
        setRagDocs([...docs, data.document]);
        setQuery("");
        setDeepSearchResults([]);
        alert("Topic successfully indexed into RAG memory bank.");
      }
    } catch (err) {
      console.error('Indexing failed', err);
    } finally {
      setIsSearching(false);
    }
  };

  if (!isOpen) return null;

  const sortItems = <T extends any>(items: T[]): T[] => {
    if (sortBy === "date_updated") {
      return [...items].sort((a: any, b: any) => (b.dateUpdated || b.updatedAt || "").localeCompare(a.dateUpdated || a.updatedAt || ""));
    }
    if (sortBy === "course_duration") {
      return [...items].sort((a: any, b: any) => (b.durationWeeks || b.duration || 0) - (a.durationWeeks || a.duration || 0));
    }
    return items;
  };

  const queryLower = query.toLowerCase();

  // Filter Programs
  const filteredPrograms = sortItems(DEGREE_PROGRAMS.filter(
    (item) =>
      item.title.toLowerCase().includes(queryLower) ||
      item.description.toLowerCase().includes(queryLower) ||
      item.category.toLowerCase().includes(queryLower),
  ));

  // Filter Courses
  const filteredCourses = sortItems(courses.filter(
    (c) =>
      c.title.toLowerCase().includes(queryLower) ||
      c.description.toLowerCase().includes(queryLower) ||
      c.tags.some((t) => t.toLowerCase().includes(queryLower)) ||
      c.modules?.some(m => m.title.toLowerCase().includes(queryLower) || m.lessons.some(l => l.title.toLowerCase().includes(queryLower)))
  ));

  // Filter Safety Modules & Content
  const safetyKeywords = ["safety", "hazard", "loto", "ghs", "osha", "emergency", "fire", "machinery", "heavy machinery", "protective", "ppe", "risk", "hira", "pass", "toxic", "crane", "forklift", "protocol", "industrial health", "سلامة", "أمان", "مخاطر", "صناعي", "إطفاء"];
  const isSafetyItem = (title: string, desc: string, tags: string[] = []) => {
    const text = `${title} ${desc} ${tags.join(" ")}`.toLowerCase();
    return safetyKeywords.some(kw => text.includes(kw));
  };

  const filteredSafetyCourses = sortItems(courses.filter((c) => {
    const matchesSafetyCategory = isSafetyItem(c.title, c.description, c.tags);
    if (!query) return matchesSafetyCategory;
    return matchesSafetyCategory && (
      c.title.toLowerCase().includes(queryLower) ||
      c.description.toLowerCase().includes(queryLower) ||
      c.tags.some(t => t.toLowerCase().includes(queryLower))
    );
  }));

  // Filter Forums
  const filteredForums = sortItems(forumThreads.filter((t) => {
    if (!query) return true;
    return (
      t.title.toLowerCase().includes(queryLower) ||
      (t.content && t.content.toLowerCase().includes(queryLower)) ||
      (t.courseTitle && t.courseTitle.toLowerCase().includes(queryLower)) ||
      (t.tags && t.tags.some((tag: string) => tag.toLowerCase().includes(queryLower)))
    );
  }));

  // Filter RAG Docs
  const filteredRagDocs = sortItems(ragDocs.filter(
    (doc) =>
      doc.title.toLowerCase().includes(queryLower) ||
      (doc.content && doc.content.toLowerCase().includes(queryLower)) ||
      (doc.topic && doc.topic.toLowerCase().includes(queryLower))
  ));

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex flex-col md:items-center md:justify-center md:pt-20 px-0 md:px-3 bg-black/95 md:bg-black/85 backdrop-blur-xl animate-fade-in h-[100dvh] md:h-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Global Educational Search and Discovery"
    >
      <div className="relative w-full h-full md:h-auto md:max-h-[85vh] md:max-w-2xl bg-[#000000] border-0 md:border md:border-[#1b3b4a]/70 text-white rounded-none md:rounded-3xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col">
        {/* Search Input Bar with Mobile-Friendly Touch Sizing */}
        <div className="p-4 md:p-3.5 bg-[#050e14] border-b border-[#143242] flex items-center gap-3 shrink-0">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search courses, safety protocols, forums, RAG docs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleDeepSearch}
            className="w-full bg-transparent text-base md:text-sm text-white focus:outline-none placeholder:text-[#5d8293] py-2"
          />
          {isSearching && (
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
          )}
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-2 text-gray-400 hover:text-white rounded-lg active:bg-white/10"
              aria-label="Clear Search"
            >
              <X className="w-5 h-5 md:w-4 md:h-4" />
            </button>
          )}
          {query.length > 3 && (
            <button
              onClick={handleIndexContent}
              disabled={isSearching}
              className="px-2.5 py-1.5 text-[11px] font-bold bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 rounded-lg border border-cyan-500/30 flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
              title="Index this search topic into RAG Memory"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Index Topic</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-mono font-semibold bg-[#0c1a24] text-gray-300 hover:text-white rounded-xl border border-[#1b3b4a] shrink-0 active:scale-95 flex items-center justify-center min-h-[36px]"
          >
            <span className="hidden md:inline">ESC</span>
            <span className="md:hidden">Close</span>
          </button>
        </div>

        {/* Quick-Filter Pills Bar */}
        <div className="px-4 py-2.5 bg-[#08151c] border-b border-[#122834] flex items-center gap-2 overflow-x-auto custom-scrollbar text-xs shrink-0">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all shrink-0 text-xs min-h-[32px] flex items-center ${
              activeFilter === "all"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm"
                : "text-[#789cae] hover:text-white hover:bg-[#122834] border border-transparent"
            }`}
          >
            All Results
          </button>

          <button
            onClick={() => setActiveFilter("courses")}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all shrink-0 flex items-center gap-1.5 text-xs min-h-[32px] ${
              activeFilter === "courses"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm"
                : "text-[#789cae] hover:text-white hover:bg-[#122834] border border-transparent"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Courses ({filteredCourses.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter("safety")}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all shrink-0 flex items-center gap-1.5 text-xs min-h-[32px] ${
              activeFilter === "safety"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm"
                : "text-[#789cae] hover:text-white hover:bg-[#122834] border border-transparent"
            }`}
          >
            <HardHat className="w-3.5 h-3.5 text-cyan-400" />
            <span>Safety ({filteredSafetyCourses.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter("forums")}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all shrink-0 flex items-center gap-1.5 text-xs min-h-[32px] ${
              activeFilter === "forums"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm"
                : "text-[#789cae] hover:text-white hover:bg-[#122834] border border-transparent"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Forums ({filteredForums.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter("degrees")}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 flex items-center gap-1.5 text-xs min-h-[32px] ${
              activeFilter === "degrees"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-[#789cae] hover:text-white hover:bg-[#122834] border border-transparent"
            }`}
          >
            <GraduationCap className="w-3 h-3 text-cyan-400" />
            <span>Degrees ({filteredPrograms.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter("docs")}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 flex items-center gap-1.5 text-xs min-h-[32px] ${
              activeFilter === "docs"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-[#789cae] hover:text-white hover:bg-[#122834] border border-transparent"
            }`}
          >
            <Database className="w-3 h-3 text-cyan-400" />
            <span>RAG Docs ({filteredRagDocs.length})</span>
          </button>
        </div>

        {/* Sorting & Filter Options Bar */}
        <div className="px-4 py-2 bg-[#061017] border-b border-[#143242] flex items-center justify-between text-xs text-[#789cae] shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0c1a24] text-white border border-[#1b3b4a] rounded-lg px-2.5 py-1 text-xs focus:outline-none"
            >
              <option value="relevance">Relevance</option>
              <option value="date_updated">Date Updated</option>
              <option value="course_duration">Course Duration</option>
            </select>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">
            {filteredCourses.length + filteredSafetyCourses.length + filteredForums.length + filteredPrograms.length + filteredRagDocs.length} matches
          </span>
        </div>

        {/* Recent Searches Bar */}
        {recentSearches.length > 0 && (
          <div className="px-4 py-2 bg-[#08151c]/80 border-b border-[#122834] flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar">
              <span className="text-[#65899a] font-semibold shrink-0">Recent:</span>
              {recentSearches.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(s);
                    saveRecentSearch(s);
                  }}
                  className="px-2.5 py-0.5 rounded-md bg-[#030b10] text-cyan-300 border border-[#1b3b4a] hover:bg-[#0c1e28] transition-all shrink-0 text-[11px]"
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={clearRecentSearches}
              className="text-[10px] text-gray-400 hover:text-white shrink-0 ml-3 underline"
            >
              Clear
            </button>
          </div>
        )}

        {/* Results List Viewport */}
        <div className="p-4 md:p-4 overflow-y-auto space-y-4 text-xs custom-scrollbar flex-1">
          {/* Section: Safety Modules & Protocols */}
          {(activeFilter === "all" || activeFilter === "safety") && filteredSafetyCourses.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <HardHat className="w-4 h-4 text-cyan-400" />
                <span>
                  Industrial Workspace & Machinery Safety Modules ({filteredSafetyCourses.length})
                </span>
              </div>
              <div className="space-y-2">
                {filteredSafetyCourses.map((course) => (
                  <div
                    key={`safety-${course.id}`}
                    onClick={() => {
                      onSelectProgram(course);
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl bg-[#08151c] border border-cyan-500/30 hover:border-cyan-400/60 hover:bg-[#0c1e28] transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-cyan-400" />
                          Safety Certified
                        </span>
                        <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors text-sm">
                          {course.title}
                        </h4>
                      </div>
                      <p className="text-xs text-[#8cb0c2] line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {course.tags.slice(0, 4).map((tag, tIdx) => (
                          <span key={tIdx} className="text-[10px] text-cyan-200/80 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-cyan-400/60 group-hover:text-cyan-300 transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: AI-Moderated Forums & Discussions */}
          {(activeFilter === "all" || activeFilter === "forums") && filteredForums.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>
                  Study Forums & Academic Discussions ({filteredForums.length})
                </span>
              </div>
              <div className="space-y-2">
                {filteredForums.slice(0, 4).map((thread) => (
                  <div
                    key={`forum-${thread.id}`}
                    onClick={() => {
                      onSelectTab("social_hub");
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl bg-[#08151c] border border-cyan-500/30 hover:border-cyan-400/60 hover:bg-[#0c1e28] transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-cyan-400" />
                          {thread.courseTitle ? thread.courseTitle.slice(0, 24) : "Forum"}
                        </span>
                        {thread.isSolved && (
                          <span className="text-[10px] font-bold text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Solved
                          </span>
                        )}
                        <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors text-xs md:text-sm">
                          {thread.title}
                        </h4>
                      </div>
                      <p className="text-xs text-[#8cb0c2] line-clamp-1">
                        {thread.content}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-[#789cae] pt-0.5">
                        <span>By {thread.authorName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-cyan-300">
                          <ThumbsUp className="w-3 h-3" /> {thread.upvotes || 0}
                        </span>
                        <span>•</span>
                        <span>{thread.replyCount || 0} replies</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-cyan-400/60 group-hover:text-cyan-300 transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Active Courses */}
          {(activeFilter === "all" || activeFilter === "courses") && filteredCourses.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>
                  Active Executive Courses ({filteredCourses.length})
                </span>
              </div>
              <div className="space-y-2">
                {filteredCourses.slice(0, 4).map((course) => (
                  <div
                    key={`course-${course.id}`}
                    onClick={() => {
                      onSelectProgram(course);
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl bg-[#08151c] border border-[#143242] hover:border-cyan-400/50 hover:bg-[#0c1e28] transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                          {course.category}
                        </span>
                        <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors text-xs md:text-sm">
                          {course.title}
                        </h4>
                      </div>
                      <p className="text-xs text-[#789cae] line-clamp-1">
                        {course.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#527788] group-hover:text-cyan-400 transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Degree Programs */}
          {(activeFilter === "all" || activeFilter === "degrees") && filteredPrograms.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span>
                  Accredited Degree Programs ({filteredPrograms.length})
                </span>
              </div>
              <div className="space-y-2">
                {filteredPrograms.slice(0, 4).map((item) => (
                  <div
                    key={`degree-${item.id}`}
                    onClick={() => {
                      onSelectProgram(item);
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl bg-[#08151c] border border-[#143242] hover:border-cyan-400/50 hover:bg-[#0c1e28] transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                          {item.category || "Degree"}
                        </span>
                        <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors text-xs md:text-sm">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-xs text-[#789cae] line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#527788] group-hover:text-cyan-400 transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: RAG Indexed Papers & Documentation */}
          {(activeFilter === "all" || activeFilter === "docs") && filteredRagDocs.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>
                  RAG Vector Index Papers & Docs ({filteredRagDocs.length})
                </span>
              </div>
              <div className="space-y-2">
                {filteredRagDocs.slice(0, 4).map((doc) => (
                  <div
                    key={`doc-${doc.id}`}
                    onClick={() => {
                      onSelectTab("knowledge_base");
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl bg-[#08151c] border border-[#143242] hover:border-cyan-400/50 hover:bg-[#0c1e28] transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                          {doc.topic || "RAG Index"}
                        </span>
                        <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors text-xs md:text-sm">
                          {doc.title}
                        </h4>
                      </div>
                      <p className="text-xs text-[#789cae] line-clamp-1">
                        {doc.content || "DeepCrawl RAG indexed vector document"}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#527788] group-hover:text-cyan-400 transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Deep RAG Search Results */}
          {deepSearchResults.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>
                  Deep RAG Search Results ({deepSearchResults.length})
                </span>
              </div>
              <div className="space-y-2">
                {deepSearchResults.map((doc: any) => (
                  <div
                    key={doc.id || `rag-${Math.random()}`}
                    onClick={() => {
                      onSelectTab("knowledge_base");
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl bg-[#08151c] border border-cyan-500/20 hover:border-cyan-400/50 hover:bg-[#0c1e28] transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                          {doc.topic || "Deep RAG Insight"}
                        </span>
                        <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors text-xs md:text-sm">
                          {doc.title || "Research Finding"}
                        </h4>
                      </div>
                      <p className="text-xs text-[#789cae] line-clamp-1">
                        {doc.content || "Contextual knowledge graph hit..."}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#527788] group-hover:text-cyan-400 transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results message */}
          {filteredCourses.length === 0 && filteredSafetyCourses.length === 0 && filteredForums.length === 0 && filteredPrograms.length === 0 && filteredRagDocs.length === 0 && (
            <div className="py-12 px-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#08151c] border border-[#143242] flex items-center justify-center mx-auto text-cyan-400">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-sm">No matches found for "{query}"</h4>
              <p className="text-xs text-[#789cae] max-w-xs mx-auto">
                Try searching for general keywords like "Safety", "LOTO", "Algorithms", "AI", or press "Index Topic" to scrape and index new research dynamically.
              </p>
            </div>
          )}

          {/* Quick Shortcuts */}
          <div className="pt-2 border-t border-[#1c3e50] flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => {
                onSelectTab("social_hub");
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl bg-[#0e212b] border border-[#1d4052] hover:bg-[#15313f] text-[#82a3b2] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Explore All Forums & Study Groups</span>
            </button>
            <button
              onClick={() => {
                onSelectTab("knowledge_base");
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl bg-[#0e212b] border border-[#1d4052] hover:bg-[#15313f] text-[#82a3b2] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Browse Knowledge Base & Drive</span>
            </button>
            <button
              onClick={() => {
                onSelectTab("api_engine");
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl bg-[#0e212b] border border-[#1d4052] hover:bg-[#15313f] text-[#82a3b2] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Open Developer API Console</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



