import React from "react";
import { bookmarkService, LessonBookmark } from "../services/bookmarkService";
import { Course } from "../shared/types";
import { toastService } from "../services/toastService";
import {
  Bookmark,
  BookmarkCheck,
  Search,
  BookOpen,
  Trash2,
  ExternalLink,
  Edit3,
  Check,
  FileText,
  Download,
  Filter,
  Sparkles,
  Tag,
  Clock,
  Layers,
  StickyNote,
} from "lucide-react";

interface MyBookmarksTabProps {
  courses: Course[];
  onOpenLesson: (courseId: string, moduleId: string, lessonId: string) => void;
  className?: string;
}

export const MyBookmarksTab: React.FC<MyBookmarksTabProps> = ({
  courses,
  onOpenLesson,
  className = "",
}) => {
  const [bookmarks, setBookmarks] = React.useState<LessonBookmark[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [editingNoteId, setEditingNoteId] = React.useState<string | null>(null);
  const [noteDraft, setNoteDraft] = React.useState<string>("");

  React.useEffect(() => {
    setBookmarks(bookmarkService.getBookmarks());
    const unsub = bookmarkService.subscribe((updated) => {
      setBookmarks(updated);
    });
    return () => unsub();
  }, []);

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    bookmarks.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return Array.from(set);
  }, [bookmarks]);

  const filteredBookmarks = React.useMemo(() => {
    return bookmarks.filter((b) => {
      const matchesCategory =
        selectedCategory === "all" || b.category?.toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        b.lessonTitle.toLowerCase().includes(q) ||
        b.courseTitle.toLowerCase().includes(q) ||
        b.moduleTitle.toLowerCase().includes(q) ||
        (b.notes && b.notes.toLowerCase().includes(q)) ||
        (b.topicSummary && b.topicSummary.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [bookmarks, selectedCategory, searchQuery]);

  const handleRemove = (b: LessonBookmark) => {
    bookmarkService.removeBookmark(b.courseId, b.lessonId);
    toastService.info(`Removed bookmark for "${b.lessonTitle}"`);
  };

  const handleSaveNote = (id: string) => {
    bookmarkService.updateBookmarkNotes(id, noteDraft);
    setEditingNoteId(null);
    setNoteDraft("");
    toastService.success("Bookmark study note updated!");
  };

  const handleExportStudyGuide = () => {
    if (bookmarks.length === 0) {
      toastService.info("No bookmarks to export.");
      return;
    }
    let content = `# LMDpro Autonomous AI Learning Hub - My Bookmarked Topics Study Guide\n`;
    content += `Generated: ${new Date().toLocaleDateString()} | Total Bookmarks: ${bookmarks.length}\n\n---\n\n`;

    bookmarks.forEach((b, idx) => {
      content += `## ${idx + 1}. ${b.lessonTitle}\n`;
      content += `**Course:** ${b.courseTitle} | **Module:** ${b.moduleTitle}\n`;
      if (b.category) content += `**Category:** ${b.category}\n`;
      content += `**Saved On:** ${new Date(b.bookmarkedAt).toLocaleString()}\n\n`;
      if (b.topicSummary) {
        content += `### Key Summary\n${b.topicSummary}\n\n`;
      }
      if (b.keyTakeaways && b.keyTakeaways.length > 0) {
        content += `### Key Takeaways\n`;
        b.keyTakeaways.forEach((t) => {
          content += `- ${t}\n`;
        });
        content += `\n`;
      }
      if (b.notes) {
        content += `### Personal Student Notes\n> ${b.notes}\n\n`;
      }
      content += `---\n\n`;
    });

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `LMDpro_Bookmarked_Topics_Study_Guide_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toastService.success("Exported bookmarked study guide as Markdown!");
  };

  return (
    <div
      className={`p-6 rounded-2xl bg-[#0a1a24]/90 backdrop-blur-xl border border-[#1b3b4a] shadow-2xl space-y-6 ${className}`}
      id="my_bookmarks_tab_container"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#143343]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <BookmarkCheck className="w-5 h-5 fill-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-white tracking-tight">
                My Bookmarks & Saved Topics
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-mono font-bold">
                {bookmarks.length} {bookmarks.length === 1 ? "Topic" : "Topics"}
              </span>
            </div>
            <p className="text-xs text-[#789cae] mt-0.5">
              Quick access repository for bookmarked lesson chapters, critical mechanisms, and personal study annotations.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <button
            onClick={handleExportStudyGuide}
            disabled={bookmarks.length === 0}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-40"
            title="Download formatted Markdown study guide of all bookmarks"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Study Guide (.md)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved topics, lessons, key mechanisms, or personal notes..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#040d12] border border-[#143241] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/60 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-white text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {categories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3 text-cyan-400" />
              <span>Category:</span>
            </span>
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === "all"
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "bg-[#081720] text-gray-400 hover:text-white border border-[#143241]"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all capitalize ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-cyan-500 text-slate-950 font-bold"
                    : "bg-[#081720] text-gray-400 hover:text-white border border-[#143241]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bookmarks Grid / Empty State */}
      {filteredBookmarks.length === 0 ? (
        <div className="py-12 px-6 rounded-2xl bg-[#061219] border border-[#122c3b] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">
            {bookmarks.length === 0 ? "No Bookmarks Saved Yet" : "No Matching Bookmarks Found"}
          </h3>
          <p className="text-xs text-[#789cae] max-w-md mx-auto leading-relaxed">
            {bookmarks.length === 0
              ? "When studying lessons inside CourseViewer, click the 'Bookmark Topic' button to pin complex mechanisms and important chapters here for fast Socratic review."
              : "Try adjusting your search query or category filter to locate your saved lesson bookmarks."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBookmarks.map((b) => {
            const courseObj = courses.find((c) => c.id === b.courseId);
            const isEditingThisNote = editingNoteId === b.id;

            return (
              <div
                key={b.id}
                className="group relative p-4 rounded-xl bg-gradient-to-br from-[#0c1f2b] to-[#081620] border border-[#17384a] hover:border-cyan-500/40 shadow-lg hover:shadow-cyan-950/20 transition-all flex flex-col justify-between space-y-3"
              >
                {/* Card Top: Breadcrumbs & Remove */}
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider line-clamp-1">
                      {b.courseTitle}
                    </span>
                    <button
                      onClick={() => handleRemove(b)}
                      className="text-gray-500 hover:text-cyan-400 p-1 rounded-lg hover:bg-cyan-500/10 transition-all shrink-0"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors">
                    {b.lessonTitle}
                  </h4>

                  <div className="flex items-center gap-2 text-[10px] text-[#789cae] flex-wrap">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3 text-cyan-400" />
                      <span>{b.moduleTitle}</span>
                    </span>
                    {b.category && (
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20 text-cyan-300 font-mono text-[9px]">
                        {b.category}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{new Date(b.bookmarkedAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>

                {/* Card Middle: Summary or Takeaway */}
                {b.topicSummary && (
                  <p className="text-xs text-gray-300 leading-relaxed line-clamp-2 bg-[#051117] p-2 rounded-lg border border-[#122834]">
                    {b.topicSummary}
                  </p>
                )}

                {/* Card Middle: Personal Note */}
                {isEditingThisNote ? (
                  <div className="space-y-2 bg-[#040e14] p-2.5 rounded-lg border border-cyan-500/30">
                    <textarea
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      placeholder="Add personal study note or mnemonics for this bookmark..."
                      rows={2}
                      className="w-full p-2 bg-[#081720] border border-[#153444] rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingNoteId(null);
                          setNoteDraft("");
                        }}
                        className="px-2.5 py-1 rounded bg-[#102430] hover:bg-[#183444] text-[11px] text-gray-300 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveNote(b.id)}
                        className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-[11px] text-slate-950 font-bold flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Save Note</span>
                      </button>
                    </div>
                  </div>
                ) : b.notes ? (
                  <div className="p-2 rounded-lg bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200 flex items-start justify-between gap-2">
                    <div className="flex items-start gap-1.5">
                      <StickyNote className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <p className="line-clamp-2 text-[11px]">{b.notes}</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingNoteId(b.id);
                        setNoteDraft(b.notes || "");
                      }}
                      className="text-cyan-400 hover:text-white p-1 shrink-0"
                      title="Edit note"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                ) : null}

                {/* Card Bottom: Open Lesson Button & Note Trigger */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#122834]">
                  {!isEditingThisNote && !b.notes && (
                    <button
                      onClick={() => {
                        setEditingNoteId(b.id);
                        setNoteDraft("");
                      }}
                      className="text-[11px] text-gray-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>+ Add Note</span>
                    </button>
                  )}

                  <button
                    onClick={() => onOpenLesson(b.courseId, b.moduleId, b.lessonId)}
                    className="ml-auto px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                  >
                    <span>Launch Lesson</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
