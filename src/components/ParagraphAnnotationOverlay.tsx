import React from "react";
import {
  AnnotationService,
  ParagraphAnnotation,
  DEFAULT_STUDY_ROOMS,
  VirtualStudyRoom,
} from "../services/annotationService";
import { UserProfile } from "../shared/types";
import { toastService } from "../services/toastService";
import {
  MessageSquare,
  Sparkles,
  Heart,
  CornerDownRight,
  Send,
  Users,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  FileText,
  AlertTriangle,
  Download,
  X,
  Share2,
  BookOpen,
  Filter,
  Plus,
  Trash2,
} from "lucide-react";

interface ParagraphAnnotationOverlayProps {
  courseId: string;
  courseTitle: string;
  moduleId: string;
  lessonId: string;
  lessonTitle: string;
  activeParagraphIndex: number | null;
  paragraphText: string;
  user?: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onOpenSocraticTutor?: (context: string) => void;
}

export const ParagraphAnnotationOverlay: React.FC<ParagraphAnnotationOverlayProps> = ({
  courseId,
  courseTitle,
  moduleId,
  lessonId,
  lessonTitle,
  activeParagraphIndex,
  paragraphText,
  user,
  isOpen,
  onClose,
  onOpenSocraticTutor,
}) => {
  const [activeRoomId, setActiveRoomId] = React.useState<string>(
    AnnotationService.getActiveRoomId()
  );
  const [annotations, setAnnotations] = React.useState<ParagraphAnnotation[]>([]);
  const [newNoteText, setNewNoteText] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<
    "insight" | "question" | "citation" | "difficulty" | "exam_hint" | "summary"
  >("insight");
  const [selectedColor, setSelectedColor] = React.useState<
    "cyan" | "cyan" | "cyan" | "cyan" | "cyan"
  >("cyan");
  const [replyInputs, setReplyInputs] = React.useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = React.useState<string | null>(null);
  const [filterCategory, setFilterCategory] = React.useState<string>("all");

  const refreshAnnotations = () => {
    if (activeParagraphIndex === null) {
      setAnnotations(
        AnnotationService.getAnnotationsForLesson(courseId, lessonId, activeRoomId)
      );
    } else {
      setAnnotations(
        AnnotationService.getAnnotationsForParagraph(
          courseId,
          lessonId,
          activeParagraphIndex,
          activeRoomId
        )
      );
    }
  };

  React.useEffect(() => {
    refreshAnnotations();

    const handleUpdated = () => refreshAnnotations();
    const handleRoomChanged = (e: any) => {
      if (e.detail?.roomId) {
        setActiveRoomId(e.detail.roomId);
      }
    };

    window.addEventListener("ANNOTATIONS_UPDATED", handleUpdated);
    window.addEventListener("STUDY_ROOM_CHANGED", handleRoomChanged);
    return () => {
      window.removeEventListener("ANNOTATIONS_UPDATED", handleUpdated);
      window.removeEventListener("STUDY_ROOM_CHANGED", handleRoomChanged);
    };
  }, [courseId, lessonId, activeParagraphIndex, activeRoomId]);

  const handleRoomChange = (roomId: string) => {
    setActiveRoomId(roomId);
    AnnotationService.setActiveRoomId(roomId);
    toastService.show({
      type: "info",
      title: "Study Room Switched 👥",
      message: `Now viewing notes from ${
        DEFAULT_STUDY_ROOMS.find((r) => r.id === roomId)?.name || "Study Room"
      }`,
      duration: 2500,
    });
  };

  const handleCreateAnnotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || activeParagraphIndex === null) return;

    const currentRoom =
      DEFAULT_STUDY_ROOMS.find((r) => r.id === activeRoomId) ||
      DEFAULT_STUDY_ROOMS[0];

    const snippet =
      paragraphText.length > 140
        ? paragraphText.substring(0, 140) + "..."
        : paragraphText;

    AnnotationService.addAnnotation({
      courseId,
      moduleId,
      lessonId,
      paragraphIndex: activeParagraphIndex,
      paragraphSnippet: snippet,
      roomId: activeRoomId,
      roomName: currentRoom.name,
      authorId: user?.id || "usr-anon",
      authorName: user?.name || "Fellow Scholar",
      authorRole: (user?.role as any) || "student",
      authorAvatar: user?.avatarUrl,
      content: newNoteText.trim(),
      category: selectedCategory,
      highlightColor: selectedColor,
    });

    setNewNoteText("");
    toastService.show({
      type: "success",
      title: "Annotation Published! ✍️",
      message: "Your note is now visible to peers in this Virtual Study Room.",
      duration: 3000,
    });
    refreshAnnotations();
  };

  const handleAddReply = (annotationId: string) => {
    const text = replyInputs[annotationId]?.trim();
    if (!text) return;

    AnnotationService.addReply(annotationId, {
      authorId: user?.id || "usr-anon",
      authorName: user?.name || "Fellow Scholar",
      authorRole: (user?.role as any) || "student",
      content: text,
    });

    setReplyInputs((prev) => ({ ...prev, [annotationId]: "" }));
    setActiveReplyId(null);
    toastService.show({
      type: "success",
      title: "Reply Added 💬",
      message: "Your response has been added to the discussion thread.",
      duration: 2500,
    });
    refreshAnnotations();
  };

  const handleLike = (annotationId: string) => {
    AnnotationService.toggleLike(annotationId, user?.id || "usr-anon");
    refreshAnnotations();
  };

  const handleToggleResolve = (annotationId: string) => {
    const status = AnnotationService.toggleResolve(annotationId);
    toastService.show({
      type: "info",
      title: status ? "Question Resolved ✅" : "Thread Re-opened",
      message: status
        ? "This topic was marked as answered."
        : "Thread is open for active peer discussion.",
      duration: 2000,
    });
    refreshAnnotations();
  };

  const handleDelete = (annotationId: string) => {
    const success = AnnotationService.deleteAnnotation(
      annotationId,
      user?.id || "usr-anon"
    );
    if (success) {
      toastService.show({
        type: "info",
        title: "Note Removed",
        message: "Your annotation was removed from the study room.",
        duration: 2000,
      });
      refreshAnnotations();
    }
  };

  const handleExportMarkdown = () => {
    const md = AnnotationService.exportStudyNotesMarkdown(
      courseTitle,
      lessonTitle,
      activeRoomId
    );
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${courseTitle.replace(/\s+/g, "_")}_Study_Notes.md`;
    link.click();
    URL.revokeObjectURL(url);

    toastService.show({
      type: "success",
      title: "Study Guide Exported! 📄",
      message: "Markdown summary downloaded with all peer annotations.",
      duration: 3000,
    });
  };

  if (!isOpen) return null;

  const currentRoom =
    DEFAULT_STUDY_ROOMS.find((r) => r.id === activeRoomId) ||
    DEFAULT_STUDY_ROOMS[0];

  const filteredAnnotations =
    filterCategory === "all"
      ? annotations
      : annotations.filter((a) => a.category === filterCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm transition-all p-0 sm:p-4">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-in Drawer Container */}
      <div className="relative z-10 flex flex-col h-full sm:h-[94vh] w-full max-w-xl bg-[#08151c] text-white border-l sm:border border-[#1b3b4a] sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#1b3b4a] bg-[#0c1d27]/90 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-tight">
                  Collaborative Study Room
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                  Live Peer Notes
                </span>
              </div>
              <p className="text-xs text-[#73A5AD] truncate max-w-xs">
                {activeParagraphIndex !== null
                  ? `Paragraph ${activeParagraphIndex + 1} Annotations`
                  : `All Lesson Notes (${lessonTitle})`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportMarkdown}
              className="p-2 rounded-xl bg-[#0e222e] text-[#73A5AD] hover:text-white hover:bg-[#153444] border border-[#1b3b4a] transition-all"
              title="Export Annotations to Markdown"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#0e222e] text-slate-400 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-500/40 border border-[#1b3b4a] transition-all"
              title="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Study Room Selector & Active Peer Bar */}
        <div className="px-4 py-3 bg-[#0a1822] border-b border-[#163647] flex flex-wrap items-center justify-between gap-2.5 shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-[#88adc0] font-medium">Virtual Room:</span>
            <select
              value={activeRoomId}
              onChange={(e) => handleRoomChange(e.target.value)}
              className="bg-[#0e222e] text-cyan-200 border border-[#1b3b4a] rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-cyan-400"
            >
              {DEFAULT_STUDY_ROOMS.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} ({room.activePeerCount} online)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#73A5AD]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>{currentRoom.activePeerCount} peers active</span>
          </div>
        </div>

        {/* Selected Paragraph Reference Banner */}
        {activeParagraphIndex !== null && paragraphText && (
          <div className="px-4 py-2.5 bg-[#091924] border-b border-[#132c3a] shrink-0">
            <div className="flex items-start justify-between gap-2 text-xs text-[#9fc5d8]">
              <div className="space-y-0.5 line-clamp-2 italic text-[11px] border-l-2 border-cyan-400 pl-2.5 text-slate-300">
                "{paragraphText}"
              </div>
              {onOpenSocraticTutor && (
                <button
                  onClick={() => onOpenSocraticTutor(paragraphText)}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold flex items-center gap-1 hover:bg-cyan-500/30 transition-all"
                  title="Ask Socratic AI to break down this paragraph"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Ask AI</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filter Badges */}
        <div className="px-4 py-2 bg-[#061219] border-b border-[#132a38] flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-[#5e8294] shrink-0 mr-1" />
          {[
            { id: "all", label: "All Notes" },
            { id: "insight", label: "💡 Insights" },
            { id: "question", label: "❓ Questions" },
            { id: "citation", label: "📖 Citations" },
            { id: "exam_hint", label: "🎯 Exam Hints" },
            { id: "difficulty", label: "⚠️ Difficulties" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium transition-all ${
                filterCategory === cat.id
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                  : "bg-[#0b1b24] text-[#6d94a8] hover:text-white border border-[#132a38]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Scrollable Thread & Notes Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {filteredAnnotations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-[#6d94a8] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0d222e] border border-[#1b3b4a] flex items-center justify-center text-[#73A5AD]">
                <BookOpen className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white">
                No peer annotations in this study room yet
              </p>
              <p className="text-xs max-w-xs text-[#73A5AD]">
                Be the first to share an insight, pose a question, or attach a citation on this paragraph!
              </p>
            </div>
          ) : (
            filteredAnnotations.map((ann) => (
              <div
                key={ann.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  ann.isResolved
                    ? "bg-[#0a1822]/60 border-cyan-500/30"
                    : "bg-[#0b1c26] border-[#1b3b4a] hover:border-cyan-500/40"
                }`}
              >
                {/* Annotation Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {ann.authorAvatar ? (
                      <img
                        src={ann.authorAvatar}
                        alt={ann.authorName}
                        className="w-7 h-7 rounded-full object-cover border border-cyan-500/30"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-xs font-bold">
                        {ann.authorName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white">
                          {ann.authorName}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                            ann.authorRole === "teacher" || ann.authorRole === "ta"
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                              : ann.authorRole === "ai_assistant"
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                              : "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                          }`}
                        >
                          {ann.authorRole}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#6d94a8]">
                        {ann.createdAt} • {ann.roomName}
                      </span>
                    </div>
                  </div>

                  {/* Category Chip & Actions */}
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-[#07131a] text-cyan-300 text-[10px] font-medium border border-[#163647]">
                      {ann.category.replace("_", " ")}
                    </span>
                    {ann.isResolved && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Resolved
                      </span>
                    )}
                  </div>
                </div>

                {/* Annotation Body */}
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {ann.content}
                </p>

                {/* Action Bar (Likes, Replies, Resolve, Delete) */}
                <div className="flex items-center justify-between pt-2 border-t border-[#142e3d] text-xs text-[#73A5AD]">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleLike(ann.id)}
                      className={`flex items-center gap-1 text-xs font-semibold transition-all ${
                        ann.likedBy.includes(user?.id || "")
                          ? "text-cyan-400"
                          : "hover:text-cyan-300"
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          ann.likedBy.includes(user?.id || "")
                            ? "fill-current text-cyan-400"
                            : ""
                        }`}
                      />
                      <span>{ann.likes}</span>
                    </button>

                    <button
                      onClick={() =>
                        setActiveReplyId(
                          activeReplyId === ann.id ? null : ann.id
                        )
                      }
                      className="flex items-center gap-1 hover:text-cyan-300 transition-all text-xs font-semibold"
                    >
                      <CornerDownRight className="w-3.5 h-3.5" />
                      <span>
                        {ann.replies.length > 0
                          ? `${ann.replies.length} replies`
                          : "Reply"}
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleResolve(ann.id)}
                      className="text-[11px] hover:text-cyan-300 transition-all flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{ann.isResolved ? "Reopen" : "Mark Resolved"}</span>
                    </button>

                    {(ann.authorId === user?.id ||
                      user?.role === "teacher" ||
                      user?.role === "school") && (
                      <button
                        onClick={() => handleDelete(ann.id)}
                        className="text-[11px] hover:text-cyan-400 transition-all p-1"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Existing Replies List */}
                {ann.replies.length > 0 && (
                  <div className="pl-4 space-y-2 border-l-2 border-cyan-500/30 pt-2">
                    {ann.replies.map((rep) => (
                      <div
                        key={rep.id}
                        className="p-2.5 rounded-xl bg-[#07151e] border border-[#132a38] space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white">
                              {rep.authorName}
                            </span>
                            <span className="text-[9px] uppercase px-1 rounded bg-cyan-500/10 text-cyan-300">
                              {rep.authorRole}
                            </span>
                          </div>
                          <span className="text-[#6d94a8] text-[10px]">
                            {rep.createdAt}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">{rep.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input Box */}
                {activeReplyId === ann.id && (
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Write a peer response..."
                      value={replyInputs[ann.id] || ""}
                      onChange={(e) =>
                        setReplyInputs((prev) => ({
                          ...prev,
                          [ann.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddReply(ann.id);
                      }}
                      className="flex-1 bg-[#07131b] border border-[#183a4c] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#5e8294] focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      onClick={() => handleAddReply(ann.id)}
                      className="p-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Create Note Bottom Bar */}
        {activeParagraphIndex !== null && (
          <form
            onSubmit={handleCreateAnnotation}
            className="p-4 bg-[#0a1822] border-t border-[#1b3b4a] space-y-3 shrink-0"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                Add Note to Paragraph {activeParagraphIndex + 1}
              </span>

              {/* Category Selector */}
              <div className="flex items-center gap-1">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="bg-[#0e222e] text-cyan-200 border border-[#1b3b4a] rounded-lg px-2 py-1 text-xs font-medium focus:outline-none focus:border-cyan-400"
                >
                  <option value="insight">💡 Insight</option>
                  <option value="question">❓ Question</option>
                  <option value="citation">📖 Citation</option>
                  <option value="exam_hint">🎯 Exam Hint</option>
                  <option value="difficulty">⚠️ Difficult Concept</option>
                  <option value="summary">📝 Summary</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <textarea
                rows={2}
                placeholder="Share your thought or question with peers in this room..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="flex-1 bg-[#051118] border border-[#1b3b4a] rounded-xl p-2.5 text-xs text-white placeholder-[#5e8294] focus:outline-none focus:border-cyan-400 resize-none"
              />
              <button
                type="submit"
                disabled={!newNoteText.trim()}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg self-stretch"
              >
                <Send className="w-4 h-4" />
                <span>Post</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
