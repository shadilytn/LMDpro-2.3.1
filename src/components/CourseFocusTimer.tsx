import React from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Sparkles,
  Zap,
  CheckCircle2,
  ChevronDown,
  Volume2,
  VolumeX,
  Eye,
  Activity,
  Smile,
  X,
  Clock,
} from "lucide-react";
import { toastService } from "../services/toastService";
import { GamificationEngine } from "../shared/gamification.engine";
import { UserProfile } from "../shared/types";

export interface CourseFocusTimerProps {
  user?: UserProfile;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
  onSessionComplete?: (focusMinutes: number) => void;
  className?: string;
}

const FOCUS_CYCLE_SECONDS = 25 * 60; // 25 minutes
const BREAK_CYCLE_SECONDS = 5 * 60; // 5 minutes

export const CourseFocusTimer: React.FC<CourseFocusTimerProps> = ({
  user,
  onUpdateUser,
  onSessionComplete,
  className = "",
}) => {
  const [mode, setMode] = React.useState<"focus" | "break">("focus");
  const [activeSeconds, setActiveSeconds] = React.useState<number>(0);
  const [breakSeconds, setBreakSeconds] = React.useState<number>(BREAK_CYCLE_SECONDS);
  const [isRunning, setIsRunning] = React.useState<boolean>(true);
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  const [completedPomodoros, setCompletedPomodoros] = React.useState<number>(0);
  const [showMicroBreakModal, setShowMicroBreakModal] = React.useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = React.useState<boolean>(true);

  const lastNotifiedMilestone = React.useRef<number>(0);

  // Play audio chime using Web Audio API
  const playChime = React.useCallback((type: "break" | "focus") => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      const now = ctx.currentTime;

      if (type === "break") {
        // Uplifting gentle arpeggio
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.35); // G5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      } else {
        // Focus chime
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.85);
    } catch (e) {
      // Ignore audio failure if permissions blocked
    }
  }, [soundEnabled]);

  // Main active focus & break interval loop
  React.useEffect(() => {
    let interval: any = null;

    if (isRunning) {
      interval = setInterval(() => {
        if (mode === "focus") {
          setActiveSeconds((prev) => {
            const nextSec = prev + 1;
            // Check for 25-minute continuous milestones (every 1500 seconds)
            const currentMilestones = Math.floor(nextSec / FOCUS_CYCLE_SECONDS);
            if (currentMilestones > lastNotifiedMilestone.current && currentMilestones > 0) {
              lastNotifiedMilestone.current = currentMilestones;
              handleMilestoneReached(currentMilestones);
            }
            return nextSec;
          });
        } else {
          // Break mode countdown
          setBreakSeconds((prev) => {
            if (prev <= 1) {
              handleBreakFinished();
              return BREAK_CYCLE_SECONDS;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, mode]);

  // Handle reaching 25 minutes of continuous study
  const handleMilestoneReached = (milestoneCount: number) => {
    setCompletedPomodoros((prev) => prev + 1);
    playChime("break");

    // Award Focus XP
    GamificationEngine.awardXP(35, `25-Min Continuous Focus Milestone #${milestoneCount}`);
    if (onUpdateUser && user) {
      onUpdateUser({
        totalFocusMinutes: (user.totalFocusMinutes || 0) + 25,
      });
    }

    // Trigger Notification
    toastService.show({
      type: "success",
      title: "☕ 25-Minute Focus Milestone Reached!",
      message: "Outstanding dedication! You've sustained 25 minutes of continuous study. We recommend a 5-minute micro-break.",
      duration: 6000,
    });

    // Show suggestion modal
    setShowMicroBreakModal(true);
  };

  // Start 5-min micro break
  const startMicroBreak = () => {
    setShowMicroBreakModal(false);
    setMode("break");
    setBreakSeconds(BREAK_CYCLE_SECONDS);
    setIsRunning(true);
    toastService.show({
      type: "info",
      title: "🧘 Micro-Break Started (5 Mins)",
      message: "Rest your eyes (20-20-20 rule), stretch, and breathe gently. We'll alert you when break concludes.",
      duration: 4000,
    });
  };

  // Handle completion of micro-break
  const handleBreakFinished = () => {
    playChime("focus");
    setMode("focus");
    toastService.show({
      type: "info",
      title: "⚡ Micro-Break Complete",
      message: "Ready to resume deep work? Back to your course module with refreshed focus.",
      duration: 4000,
    });
  };

  // Skip or continue study without break
  const continueStudying = () => {
    setShowMicroBreakModal(false);
    setMode("focus");
    setIsRunning(true);
  };

  // Reset focus session
  const handleResetSession = () => {
    setActiveSeconds(0);
    lastNotifiedMilestone.current = 0;
    setMode("focus");
  };

  // Time format calculations
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Progress ring math
  // For focus: progress towards current 25-min interval
  const currentIntervalSeconds = activeSeconds % FOCUS_CYCLE_SECONDS;
  const progressFraction =
    mode === "focus"
      ? currentIntervalSeconds / FOCUS_CYCLE_SECONDS
      : (BREAK_CYCLE_SECONDS - breakSeconds) / BREAK_CYCLE_SECONDS;

  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressFraction * circumference;

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Compact Focus Pill Button */}
      <div
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm ${
          mode === "break"
            ? "bg-amber-500/15 border-amber-400/50 text-amber-300"
            : isRunning
            ? "bg-[#0b1f2b] border-cyan-500/40 text-cyan-300 shadow-cyan-500/10 hover:border-cyan-400"
            : "bg-[#091720] border-slate-700/50 text-slate-400 hover:border-slate-600"
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
        title="Focus Timer: Tracks active study time with micro-break suggestions"
      >
        {/* Circular Progress Ring */}
        <div className="relative w-8 h-8 flex items-center justify-center">
          <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r={radius}
              fill="none"
              stroke="#142c38"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r={radius}
              fill="none"
              stroke={mode === "break" ? "#f59e0b" : "#22d3ee"}
              strokeWidth="3.2"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </svg>

          {/* Center Play/Pause state icon */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {mode === "break" ? (
              <Coffee className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            ) : isRunning ? (
              <Zap className="w-3 h-3 text-cyan-400" />
            ) : (
              <Pause className="w-3 h-3 text-slate-400" />
            )}
          </div>
        </div>

        {/* Time and Label */}
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-center gap-1">
            <span className="font-mono text-xs font-bold text-white tracking-tight">
              {mode === "focus" ? formatTime(activeSeconds) : formatTime(breakSeconds)}
            </span>
            {completedPomodoros > 0 && (
              <span className="text-[9px] px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                {completedPomodoros}★
              </span>
            )}
          </div>
          <span className="text-[9px] font-semibold text-[#6ea1b5] mt-0.5 uppercase tracking-wider">
            {mode === "break" ? "Micro-Break" : isRunning ? "Active Study" : "Paused"}
          </span>
        </div>

        {/* Play/Pause Quick Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsRunning(!isRunning);
          }}
          className={`p-1 rounded-lg transition-colors ml-1 ${
            isRunning
              ? "hover:bg-cyan-500/20 text-cyan-400"
              : "hover:bg-slate-700/50 text-slate-300"
          }`}
          title={isRunning ? "Pause Focus Timer" : "Start Focus Timer"}
        >
          {isRunning ? (
            <Pause className="w-3.5 h-3.5" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
        </button>

        <ChevronDown
          className={`w-3 h-3 text-[#6ea1b5] transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Expanded Popover HUD */}
      {isExpanded && (
        <div className="absolute right-0 top-full mt-2 w-72 p-4 rounded-2xl bg-[#091b24]/95 backdrop-blur-xl border border-cyan-500/40 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3.5 text-slate-200">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-extrabold text-white">Focus & Micro-Break Engine</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-1 rounded-lg text-xs ${
                  soundEnabled ? "text-cyan-400 hover:bg-cyan-950/40" : "text-slate-500 hover:bg-slate-800"
                }`}
                title={soundEnabled ? "Mute Chimes" : "Enable Chimes"}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Large Progress Ring in HUD */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-[#06141c] border border-[#143140]">
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="#122530" strokeWidth="3.5" />
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke={mode === "break" ? "#f59e0b" : "#22d3ee"}
                  strokeWidth="3.8"
                  strokeDasharray={2 * Math.PI * 18}
                  strokeDashoffset={2 * Math.PI * 18 * (1 - progressFraction)}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-black font-mono text-cyan-300">
                {Math.round(progressFraction * 100)}%
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-black text-white font-mono">
                {mode === "focus" ? formatTime(activeSeconds) : formatTime(breakSeconds)}
              </div>
              <p className="text-[11px] text-[#78a2b5]">
                {mode === "focus"
                  ? `${Math.max(0, Math.ceil((FOCUS_CYCLE_SECONDS - currentIntervalSeconds) / 60))}m until next micro-break`
                  : "Micro-break in progress"}
              </p>
            </div>
          </div>

          {/* 25-Minute Interval Markers */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-[#78a2b5] font-semibold">
              <span>Current Cycle Milestones</span>
              <span>{completedPomodoros * 25} Total Mins</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 1, 2, 3].map((slot) => {
                const isPassed = completedPomodoros > slot;
                const isCurrent = completedPomodoros % 4 === slot && isRunning;
                return (
                  <div
                    key={slot}
                    className={`h-2 rounded-full transition-all ${
                      isPassed
                        ? "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                        : isCurrent
                        ? "bg-cyan-500/40 animate-pulse"
                        : "bg-[#142d3b]"
                    }`}
                    title={`Milestone ${slot + 1}: ${(slot + 1) * 25}m`}
                  />
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                isRunning
                  ? "bg-[#102b3a] hover:bg-[#183d52] text-cyan-300 border border-cyan-500/30"
                  : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/20"
              }`}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isRunning ? "Pause Study" : "Resume Study"}</span>
            </button>

            <button
              onClick={() => {
                if (mode === "focus") {
                  startMicroBreak();
                } else {
                  continueStudying();
                }
              }}
              className="py-2 px-3 rounded-xl text-xs font-bold bg-[#0f2430] hover:bg-[#153445] text-amber-300 border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>{mode === "focus" ? "Take Break" : "End Break"}</span>
            </button>
          </div>

          <button
            onClick={handleResetSession}
            className="w-full py-1 text-[10px] text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Active Session Counter</span>
          </button>
        </div>
      )}

      {/* Micro-Break Suggestion Modal Notification */}
      {showMicroBreakModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#091b24] border border-cyan-500/50 shadow-2xl space-y-4 text-center">
            {/* Celebration Icon */}
            <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/20 animate-bounce">
              <Coffee className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>25 Minutes of Continuous Study Completed!</span>
              </div>
              <h3 className="text-lg font-black text-white">Time for a 5-Minute Micro-Break</h3>
              <p className="text-xs text-[#8ab2c4] max-w-sm mx-auto leading-relaxed">
                Research shows taking brief micro-breaks every 25 minutes enhances retention by up to 34% and prevents cognitive fatigue.
              </p>
            </div>

            {/* Quick 3-step micro break suggestions */}
            <div className="grid grid-cols-3 gap-2 text-left">
              <div className="p-2.5 rounded-xl bg-[#06141c] border border-[#143140] space-y-1">
                <Eye className="w-4 h-4 text-cyan-400" />
                <div className="text-[11px] font-bold text-white">20-20-20 Rule</div>
                <div className="text-[9px] text-[#78a2b5]">Look 20 feet away for 20 seconds.</div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#06141c] border border-[#143140] space-y-1">
                <Activity className="w-4 h-4 text-emerald-400" />
                <div className="text-[11px] font-bold text-white">Physical Reset</div>
                <div className="text-[9px] text-[#78a2b5]">Stand, stretch shoulders and neck.</div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#06141c] border border-[#143140] space-y-1">
                <Smile className="w-4 h-4 text-amber-400" />
                <div className="text-[11px] font-bold text-white">Hydrate</div>
                <div className="text-[9px] text-[#78a2b5]">Sip water and take 3 deep breaths.</div>
              </div>
            </div>

            {/* Micro-break Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={startMicroBreak}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all"
              >
                <Coffee className="w-4 h-4" />
                <span>Start 5-Minute Micro-Break</span>
              </button>

              <button
                onClick={continueStudying}
                className="w-full py-2.5 rounded-xl bg-[#0e2430] hover:bg-[#143344] text-[#8ab2c4] hover:text-white font-bold text-xs border border-[#1b3b4a] transition-colors"
              >
                Continue Studying (+35 Focus XP Awarded)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
