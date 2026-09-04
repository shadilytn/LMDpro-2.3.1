import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Award,
  Clock,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Zap,
} from "lucide-react";

interface SessionSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  xpEarned: number;
  timeSpentSeconds: number;
  completedLessons: { id: string; title: string; moduleTitle: string }[];
  courseTitle: string;
}

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({
  isOpen,
  onClose,
  xpEarned,
  timeSpentSeconds,
  completedLessons,
  courseTitle,
}) => {
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins === 0) {
      return `${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#040a0f]/80 backdrop-blur-md"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[#0c1a24]/95 border border-[#1b3b4a]/80 rounded-3xl p-6 shadow-2xl overflow-hidden text-white"
          >
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#789cae] hover:text-white transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-2 mt-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Session Complete</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">
                Great Work Today!
              </h2>
              <p className="text-xs text-[#789cae] max-w-xs mx-auto">
                You've completed your study session for{" "}
                <span className="text-white font-bold">{courseTitle}</span>
              </p>
            </div>

            {/* Bento Grid Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {/* XP Card */}
              <div className="bg-[#08151c]/70 border border-[#1b3b4a]/60 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#789cae]">
                    XP Earned
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                    <Zap className="w-4 h-4 fill-cyan-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-black text-white">
                    +{xpEarned}
                  </span>
                  <span className="text-xs text-cyan-400 block font-semibold mt-0.5">
                    Academic Points
                  </span>
                </div>
              </div>

              {/* Time Card */}
              <div className="bg-[#08151c]/70 border border-[#1b3b4a]/60 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#789cae]">
                    Study Time
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-black text-white">
                    {formatTime(timeSpentSeconds)}
                  </span>
                  <span className="text-xs text-cyan-400 block font-semibold mt-1">
                    Active Learning
                  </span>
                </div>
              </div>
            </div>

            {/* Module Breakdown */}
            <div className="mt-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#789cae] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Modules / Lessons Completed ({completedLessons.length})</span>
              </h3>

              <div className="bg-[#051118] border border-[#1b3b4a]/40 rounded-2xl p-3 max-h-40 overflow-y-auto space-y-2">
                {completedLessons.length === 0 ? (
                  <div className="text-center py-4 text-xs text-[#5e8091]">
                    No new lessons fully completed this session. Keep studying
                    to unlock quizzes!
                  </div>
                ) : (
                  completedLessons.map((les, idx) => (
                    <div
                      key={les.id || idx}
                      className="flex items-start gap-2.5 p-2 rounded-xl bg-[#08151c]/60 border border-[#132d3a] hover:border-cyan-500/20 transition-all"
                    >
                      <div className="w-5 h-5 rounded-md bg-cyan-500/10 flex items-center justify-center text-[10px] font-bold text-cyan-400 border border-cyan-500/20 mt-0.5 shrink-0">
                        {idx + 1}
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-xs font-black text-white block truncate">
                          {les.title}
                        </span>
                        <span className="text-[10px] text-cyan-300/70 block truncate">
                          {les.moduleTitle}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Action Footer */}
            <div className="mt-8">
              <button
                onClick={onClose}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-500 to-cyan-500 text-white text-sm font-black tracking-wide shadow-lg shadow-cyan-950/50 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span>Complete Study Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
