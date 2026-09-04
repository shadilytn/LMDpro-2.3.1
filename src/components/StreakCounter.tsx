import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Flame,
  Zap,
  Target,
  Trophy,
  Award,
  Clock,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  RotateCcw,
  Plus,
  Settings,
  ChevronRight,
  Shield,
  Star,
} from "lucide-react";
import { UserProfile } from "../shared/types";
import { triggerConfetti } from "../utils/confetti";
import { offlineSyncService } from "../services/offlineSyncService";

interface StreakCounterProps {
  user: UserProfile;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
  onNavigateTab?: (tab: string) => void;
  compact?: boolean;
}

interface MilestoneConfig {
  id: string;
  percentage: number;
  label: string;
  subLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  bonusXP: number;
  color: string;
  glowColor: string;
}

const MILESTONES: MilestoneConfig[] = [
  {
    id: "m25",
    percentage: 25,
    label: "Ignition",
    subLabel: "Starting Strong",
    icon: Zap,
    bonusXP: 25,
    color: "from-cyan-400 to-cyan-400",
    glowColor: "rgba(34, 211, 238, 0.4)",
  },
  {
    id: "m50",
    percentage: 50,
    label: "Halfway Peak",
    subLabel: "Steady Momentum",
    icon: Flame,
    bonusXP: 50,
    color: "from-cyan-400 to-cyan-300",
    glowColor: "rgba(45, 212, 191, 0.4)",
  },
  {
    id: "m75",
    percentage: 75,
    label: "Final Sprint",
    subLabel: "Goal in Sight!",
    icon: TrendingUp,
    bonusXP: 75,
    color: "from-cyan-400 to-cyan-400",
    glowColor: "rgba(251, 191, 36, 0.5)",
  },
  {
    id: "m100",
    percentage: 100,
    label: "Mastery",
    subLabel: "Daily Goal Conquered!",
    icon: Trophy,
    bonusXP: 150,
    color: "from-cyan-400 to-cyan-300",
    glowColor: "rgba(52, 211, 153, 0.6)",
  },
];

export const StreakCounter: React.FC<StreakCounterProps> = ({
  user,
  onUpdateUser,
  onNavigateTab,
  compact = false,
}) => {
  const dailyGoalMinutes = user.dailyStudyGoal || 60;
  const [streakDays, setStreakDays] = React.useState<number>(user.streakDays || 7);
  const [showGoalModal, setShowGoalModal] = React.useState(false);
  const [goalInput, setGoalInput] = React.useState<number>(dailyGoalMinutes);
  const [recentMilestoneReached, setRecentMilestoneReached] = React.useState<MilestoneConfig | null>(null);

  // Read or initialize today's focus minutes from local storage or sensible default
  const [todayMinutes, setTodayMinutes] = React.useState<number>(() => {
    const todayKey = `lmdpro_study_mins_${new Date().toISOString().slice(0, 10)}`;
    const saved = localStorage.getItem(todayKey);
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      return isNaN(parsed) ? 45 : parsed;
    }
    return 45; // Default to 45m out of 60m (75% approaching milestone)
  });

  const prevMinutesRef = React.useRef(todayMinutes);
  const prevPercentRef = React.useRef(Math.round((todayMinutes / dailyGoalMinutes) * 100));

  // Sync to local storage
  React.useEffect(() => {
    const todayKey = `lmdpro_study_mins_${new Date().toISOString().slice(0, 10)}`;
    localStorage.setItem(todayKey, todayMinutes.toString());
  }, [todayMinutes]);

  // Sync streak from offline service if available
  React.useEffect(() => {
    const queue = offlineSyncService.getQueue();
    const baseStreak = user.streakDays || 7;
    const additionalActivity = queue.length > 0 ? 1 : 0;
    setStreakDays(baseStreak + additionalActivity);
  }, [user]);

  const progressPercent = Math.min(150, Math.round((todayMinutes / dailyGoalMinutes) * 100));
  const clampedDisplayPercent = Math.min(100, progressPercent);
  const remainingMinutes = Math.max(0, dailyGoalMinutes - todayMinutes);

  // Check if approaching 100% or other milestones
  const isApproachingGoal = progressPercent >= 70 && progressPercent < 100;
  const isGoalCompleted = progressPercent >= 100;
  const isOverachieved = progressPercent > 100;

  // Milestone triggers on change
  React.useEffect(() => {
    const currentPercent = Math.round((todayMinutes / dailyGoalMinutes) * 100);
    const prevPercent = prevPercentRef.current;

    // Detect if newly crossed 100%
    if (currentPercent >= 100 && prevPercent < 100) {
      triggerConfetti();
      const m100 = MILESTONES.find((m) => m.percentage === 100);
      if (m100) {
        setRecentMilestoneReached(m100);
        setTimeout(() => setRecentMilestoneReached(null), 6000);
      }
    } else {
      // Check other milestone crossings
      for (const m of MILESTONES) {
        if (currentPercent >= m.percentage && prevPercent < m.percentage) {
          setRecentMilestoneReached(m);
          setTimeout(() => setRecentMilestoneReached(null), 5000);
          break;
        }
      }
    }

    prevPercentRef.current = currentPercent;
    prevMinutesRef.current = todayMinutes;
  }, [todayMinutes, dailyGoalMinutes]);

  const addStudyMinutes = (mins: number) => {
    setTodayMinutes((prev) => {
      const next = Math.max(0, prev + mins);
      if (onUpdateUser && mins > 0) {
        // Also award incremental XP
        const xpEarned = mins * 2;
        onUpdateUser({
          totalFocusMinutes: (user.totalFocusMinutes || 0) + mins,
          xpPoints: (user.xpPoints || 0) + xpEarned,
        });
      }
      return next;
    });
  };

  const handleSaveGoal = (targetMins: number) => {
    setGoalInput(targetMins);
    setShowGoalModal(false);
    if (onUpdateUser) {
      onUpdateUser({ dailyStudyGoal: targetMins });
    }
  };

  const resetToday = () => {
    setTodayMinutes(0);
    prevPercentRef.current = 0;
  };

  // Dynamic progress bar gradient based on completion milestone
  const getProgressGradient = () => {
    if (isGoalCompleted) {
      return "from-cyan-500 via-cyan-400 to-cyan-300";
    }
    if (isApproachingGoal) {
      return "from-cyan-400 via-cyan-400 to-cyan-300";
    }
    if (progressPercent >= 50) {
      return "from-cyan-500 via-cyan-400 to-cyan-300";
    }
    return "from-cyan-500 via-cyan-400 to-cyan-300";
  };

  // Compact Pill mode (if rendered inside mini headers)
  if (compact) {
    return (
      <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-sm transition-all">
        <Flame className="w-4 h-4 text-cyan-400 animate-pulse" />
        <span className="font-bold text-xs">{streakDays} Day Streak</span>
        <div className="w-16 h-2 bg-[#040d12] rounded-full overflow-hidden border border-cyan-500/20">
          <motion.div
            className={`h-full bg-gradient-to-r ${getProgressGradient()}`}
            initial={{ width: 0 }}
            animate={{ width: `${clampedDisplayPercent}%` }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
          />
        </div>
        <span className="text-[10px] text-cyan-300 font-mono">{progressPercent}%</span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#06141c]/95 via-[#081b24]/90 to-[#040e14]/95 border border-[#163647] p-5 sm:p-6 shadow-2xl space-y-5">
      {/* Background ambient decorative glow */}
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none filter blur-3xl opacity-20 transition-all duration-700"
        style={{
          backgroundColor: isGoalCompleted ? "#10b981" : isApproachingGoal ? "#f59e0b" : "#06b6d4",
        }}
      />

      {/* Header section: Title, Streak Badge & Target Goal Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-cyan-400" />
              Daily Study Goal Tracker
            </span>
            {isGoalCompleted && (
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 animate-pulse flex items-center gap-1">
                <Trophy className="w-3 h-3 text-cyan-400" />
                Goal Completed!
              </span>
            )}
            {isApproachingGoal && (
              <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 animate-bounce flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Approaching Milestone!
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2.5">
            <span>{todayMinutes}m</span>
            <span className="text-xs sm:text-sm font-normal text-[#8cb0c2]">
              of <span className="font-semibold text-cyan-300">{dailyGoalMinutes}m Target</span>
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#0a2330] text-cyan-300 border border-cyan-500/20">
              {progressPercent}%
            </span>
          </h2>
        </div>

        {/* Right side: Streak and Goal Configuration */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Streak Counter Pill */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-950/60 to-cyan-950/40 border border-cyan-500/40 shadow-lg">
            <Flame className="w-4 h-4 text-cyan-400 animate-pulse" />
            <div className="text-left leading-tight">
              <div className="text-xs font-extrabold text-cyan-300 font-mono">
                {streakDays} Day Streak
              </div>
              <div className="text-[9px] text-cyan-400/80 font-medium">
                1.5x XP Boost Active
              </div>
            </div>
          </div>

          {/* Goal Adjustment Button */}
          <button
            onClick={() => setShowGoalModal(!showGoalModal)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#092230] hover:bg-[#0f3042] text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 text-xs font-semibold shadow-md transition-all active:scale-95"
            title="Adjust daily target minutes"
          >
            <Settings className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Set Goal</span>
          </button>
        </div>
      </div>

      {/* Goal Adjustment Selector Popover / Drawer */}
      <AnimatePresence>
        {showGoalModal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden p-4 rounded-xl bg-[#040e14]/90 border border-cyan-500/30 space-y-3"
          >
            <div className="flex items-center justify-between text-xs text-[#8cb0c2]">
              <span className="font-semibold text-white">Select Daily Study Target:</span>
              <span className="text-[11px] text-cyan-400">Current: {dailyGoalMinutes} min/day</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[30, 45, 60, 90, 120].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleSaveGoal(mins)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                    dailyGoalMinutes === mins
                      ? "bg-gradient-to-r from-cyan-500 to-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-950/60"
                      : "bg-[#091f2c] text-[#8cb0c2] hover:text-white hover:bg-[#0f2d3f] border-[#163647]"
                  }`}
                >
                  {mins} Minutes
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Animated Progress Bar Track */}
      <div className="space-y-3 relative z-10">
        <div className="relative pt-2 pb-1">
          {/* Progress Track Background */}
          <div className="w-full h-4 sm:h-5 bg-[#030c11] rounded-full overflow-hidden border border-[#163e54] p-0.5 shadow-inner relative">
            {/* Background subtle grid lines at 25%, 50%, 75% */}
            <div className="absolute inset-0 flex justify-between px-[25%] pointer-events-none opacity-20">
              <div className="w-px h-full bg-cyan-300" />
              <div className="w-px h-full bg-cyan-300" />
            </div>

            {/* Fluid Animated Progress Bar with Spring Transitions */}
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${getProgressGradient()} relative overflow-hidden shadow-lg`}
              initial={{ width: 0 }}
              animate={{ width: `${clampedDisplayPercent}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 14 }}
            >
              {/* Shimmer Light-Sweep Animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-12"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{
                  repeat: Infinity,
                  duration: 2.2,
                  ease: "easeInOut",
                }}
              />

              {/* Leading Tip Pulsing Glow Bulb */}
              {clampedDisplayPercent > 3 && (
                <motion.div
                  className="absolute right-0 top-0 bottom-0 w-3 bg-white rounded-full shadow-[0_0_12px_#ffffff]"
                  animate={{
                    opacity: [0.7, 1, 0.7],
                    scale: [0.95, 1.15, 0.95],
                  }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                />
              )}
            </motion.div>
          </div>

          {/* Milestone Pin Indicators along the Track */}
          <div className="relative w-full flex justify-between items-center mt-3 px-1">
            {MILESTONES.map((m) => {
              const isReached = progressPercent >= m.percentage;
              const isNear =
                !isReached &&
                progressPercent >= m.percentage - 15 &&
                progressPercent < m.percentage;
              const MilestoneIcon = m.icon;

              return (
                <div
                  key={m.id}
                  className="flex flex-col items-center group relative cursor-pointer"
                  onClick={() => addStudyMinutes(Math.round((dailyGoalMinutes * m.percentage) / 100) - todayMinutes)}
                  title={`Click to simulate ${m.percentage}% milestone (${Math.round((dailyGoalMinutes * m.percentage) / 100)} mins)`}
                >
                  {/* Pin Node */}
                  <motion.div
                    animate={
                      isNear
                        ? {
                            scale: [1, 1.25, 1],
                            boxShadow: [
                              `0 0 0px ${m.glowColor}`,
                              `0 0 14px ${m.glowColor}`,
                              `0 0 0px ${m.glowColor}`,
                            ],
                          }
                        : isReached
                        ? { scale: 1 }
                        : { scale: 0.9 }
                    }
                    transition={{
                      repeat: isNear ? Infinity : 0,
                      duration: 1.4,
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      isReached
                        ? "bg-gradient-to-br from-cyan-500 to-cyan-600 border-cyan-300 text-black shadow-lg shadow-cyan-950/80"
                        : isNear
                        ? "bg-gradient-to-br from-cyan-500/90 to-cyan-600/90 border-cyan-300 text-white animate-pulse shadow-md"
                        : "bg-[#05141c] border-[#163647] text-[#618596] hover:border-cyan-500/50 hover:text-cyan-300"
                    }`}
                  >
                    {isReached ? (
                      <CheckCircle2 className="w-4 h-4 text-black stroke-[2.5]" />
                    ) : (
                      <MilestoneIcon className="w-3.5 h-3.5" />
                    )}
                  </motion.div>

                  {/* Milestone Label */}
                  <div className="text-center mt-1.5 space-y-0.5">
                    <div
                      className={`text-[10px] sm:text-xs font-bold font-mono transition-colors ${
                        isReached
                          ? "text-cyan-300"
                          : isNear
                          ? "text-cyan-300 font-extrabold"
                          : "text-[#628597]"
                      }`}
                    >
                      {m.percentage}%
                    </div>
                    <div className="text-[9px] text-[#7198aa] hidden sm:block truncate max-w-[70px]">
                      {m.label}
                    </div>
                  </div>

                  {/* Floating Milestone Approaching Badge */}
                  {isNear && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-7 px-2 py-0.5 rounded-full bg-cyan-400 text-black text-[9px] font-black uppercase tracking-wider whitespace-nowrap shadow-lg shadow-cyan-950/60"
                    >
                      Near!
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Feedback Banner for Milestone Approached or Completed */}
      <AnimatePresence mode="wait">
        {isGoalCompleted ? (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/90 via-[#06241b] to-cyan-950/90 border border-cyan-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shrink-0">
                <Trophy className="w-6 h-6 text-cyan-400 animate-bounce" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span>Daily Study Goal Conquered!</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    +150 Bonus XP Earned
                  </span>
                </div>
                <p className="text-[11px] text-cyan-200/80 leading-relaxed">
                  Outstanding commitment! You completed all {todayMinutes}m of your daily focus plan. Your streak is safeguarded for tomorrow.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                onClick={() => triggerConfetti()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Celebrate</span>
              </button>
            </div>
          </motion.div>
        ) : isApproachingGoal ? (
          <motion.div
            key="approaching"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/80 via-[#26180a] to-cyan-950/80 border border-cyan-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shrink-0">
                <Flame className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span>Milestone Approaching! Almost at 100%</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    {remainingMinutes}m Remaining
                  </span>
                </div>
                <p className="text-[11px] text-cyan-200/80 leading-relaxed">
                  You are at {progressPercent}% of today's target. Study for just {remainingMinutes} more minutes to unlock your daily +150 XP mastery reward!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                onClick={() => addStudyMinutes(remainingMinutes)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-400 hover:from-cyan-300 hover:to-cyan-300 text-black font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Complete Goal (+{remainingMinutes}m)</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="standard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-3.5 rounded-xl bg-[#040e14]/70 border border-[#143444] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#8cb0c2] relative z-10"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                {todayMinutes === 0
                  ? "Start your first focus session today to build momentum towards your daily goal."
                  : `Great pace! You've logged ${todayMinutes}m. Reach ${Math.round(dailyGoalMinutes * 0.75)}m for the 75% final sprint milestone.`}
              </span>
            </div>

            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab("courses")}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold text-xs transition-colors shrink-0 self-end sm:self-auto"
              >
                <span>Jump into a Course</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Quick Add Focus Time & Simulation Actions */}
      <div className="pt-2 border-t border-[#122e3d] flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-[#6c8f9f] mr-1">Quick Log Time:</span>
          <button
            onClick={() => addStudyMinutes(5)}
            className="px-2.5 py-1 rounded-lg bg-[#081c26] hover:bg-[#0f2e3d] text-cyan-300 hover:text-cyan-200 border border-cyan-500/20 text-[11px] font-semibold transition-all active:scale-95 flex items-center gap-1"
          >
            <Plus className="w-3 h-3 text-cyan-400" />
            <span>+5m</span>
          </button>
          <button
            onClick={() => addStudyMinutes(15)}
            className="px-2.5 py-1 rounded-lg bg-[#081c26] hover:bg-[#0f2e3d] text-cyan-300 hover:text-cyan-200 border border-cyan-500/20 text-[11px] font-semibold transition-all active:scale-95 flex items-center gap-1"
          >
            <Plus className="w-3 h-3 text-cyan-400" />
            <span>+15m</span>
          </button>
          <button
            onClick={() => addStudyMinutes(30)}
            className="px-2.5 py-1 rounded-lg bg-[#081c26] hover:bg-[#0f2e3d] text-cyan-300 hover:text-cyan-200 border border-cyan-500/20 text-[11px] font-semibold transition-all active:scale-95 flex items-center gap-1"
          >
            <Plus className="w-3 h-3 text-cyan-400" />
            <span>+30m Boost</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetToday}
            className="p-1.5 rounded-lg bg-[#081c26] hover:bg-[#102a38] text-[#6d8e9e] hover:text-white border border-[#163647] text-[11px] transition-colors"
            title="Reset today's progress for testing"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="text-[10px] font-mono text-[#5b7d8d]">
            Updates in real-time
          </div>
        </div>
      </div>
    </div>
  );
};
