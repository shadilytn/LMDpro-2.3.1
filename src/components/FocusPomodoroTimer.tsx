import React from "react";
import confetti from "canvas-confetti";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Flame,
  Sparkles,
  CheckCircle2,
  Clock,
  Zap,
} from "lucide-react";
import { UserProfile } from "../shared/types";

interface FocusPomodoroTimerProps {
  user?: UserProfile;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
  compact?: boolean;
}

type TimerMode = "focus" | "shortBreak" | "longBreak";

const MODE_TIMES: Record<TimerMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const FocusPomodoroTimer: React.FC<FocusPomodoroTimerProps> = ({
  user,
  onUpdateUser,
  compact = false,
}) => {
  const [mode, setMode] = React.useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = React.useState<number>(MODE_TIMES.focus);
  const [isRunning, setIsRunning] = React.useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = React.useState<number>(0);

  const intervalRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode]);

  const handleTimerComplete = () => {
    setIsRunning(false);

    // Confetti effect!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // fallback
    }

    if (mode === "focus") {
      const minutesEarned = 25;
      const xpEarned = 50;
      setCompletedSessions((prev) => prev + 1);

      if (onUpdateUser && user) {
        onUpdateUser({
          xp: (user.xp || 0) + xpEarned,
          totalFocusMinutes: (user.totalFocusMinutes || 0) + minutesEarned,
        });
      }

      // Switch to short break or long break
      if ((completedSessions + 1) % 4 === 0) {
        switchMode("longBreak");
      } else {
        switchMode("shortBreak");
      }
    } else {
      switchMode("focus");
    }
  };

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODE_TIMES[newMode]);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODE_TIMES[mode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const totalModeTime = MODE_TIMES[mode];
  const progressPercent = Math.min(
    100,
    Math.max(0, ((totalModeTime - timeLeft) / totalModeTime) * 100),
  );

  if (compact) {
    return (
      <div className="p-3 rounded-2xl bg-[#09151c] border border-[#1b3d4f] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className={`p-2 rounded-xl ${mode === "focus" ? "bg-cyan-500/20 text-cyan-400" : "bg-cyan-500/20 text-cyan-400"}`}
          >
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-[#7193a2] font-semibold uppercase tracking-wider">
              {mode === "focus"
                ? "Focus Session"
                : mode === "shortBreak"
                  ? "Short Break"
                  : "Long Break"}
            </div>
            <div className="text-sm font-black text-white font-mono">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`p-2 rounded-xl transition-all ${
              isRunning
                ? "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30"
                : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
            }`}
            title={isRunning ? "Pause" : "Start Focus"}
          >
            {isRunning ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={resetTimer}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#82a3b2] hover:text-white transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0e212b] to-[#09151c] border border-[#1e3e4f] shadow-2xl text-white space-y-6 relative overflow-hidden">
      {/* Background Glow */}
      <div
        className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
          mode === "focus" ? "bg-cyan-500/10" : "bg-cyan-500/10"
        }`}
      />

      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-[#061217] border border-[#163445]">
        <button
          onClick={() => switchMode("focus")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === "focus"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md"
              : "text-[#7193a2] hover:text-white hover:bg-white/5"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-cyan-400" />
            <span>Focus (25m)</span>
          </span>
        </button>
        <button
          onClick={() => switchMode("shortBreak")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === "shortBreak"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md"
              : "text-[#7193a2] hover:text-white hover:bg-white/5"
          }`}
        >
          <span>Short Break (5m)</span>
        </button>
        <button
          onClick={() => switchMode("longBreak")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === "longBreak"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md"
              : "text-[#7193a2] hover:text-white hover:bg-white/5"
          }`}
        >
          <span>Long Break (15m)</span>
        </button>
      </div>

      {/* Timer Display */}
      <div className="flex flex-col items-center justify-center space-y-4 py-4">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* SVG Progress Circle */}
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-[#102733]"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className={`transition-all duration-1000 ease-linear ${
                mode === "focus"
                  ? "stroke-cyan-400"
                  : mode === "shortBreak"
                    ? "stroke-cyan-400"
                    : "stroke-cyan-400"
              }`}
              strokeWidth="6"
              strokeDasharray="276.46"
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Time & Session Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-black font-mono tracking-tight text-white drop-shadow-md">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[11px] font-semibold text-[#82a3b2] mt-1 flex items-center gap-1">
              {mode === "focus" ? (
                <>
                  <Zap className="w-3 h-3 text-cyan-400" />
                  <span>Deep Work</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                  <span>Rest & Recharge</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6 text-xs text-[#82a3b2] font-medium pt-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Completed:{" "}
              <strong className="text-white">{completedSessions}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Focus Time:{" "}
              <strong className="text-white">
                {user?.totalFocusMinutes || 0}m
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={resetTimer}
          className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-[#82a3b2] hover:text-white transition-all transform active:scale-95"
          title="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-8 py-3.5 rounded-2xl font-extrabold text-sm transition-all transform active:scale-95 flex items-center gap-2 shadow-lg ${
            isRunning
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30"
              : "bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 hover:brightness-110 shadow-cyan-500/20"
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Focus</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Start Focus</span>
            </>
          )}
        </button>

        <button
          onClick={handleTimerComplete}
          className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-[#82a3b2] hover:text-white transition-all transform active:scale-95"
          title="Skip to Next"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
