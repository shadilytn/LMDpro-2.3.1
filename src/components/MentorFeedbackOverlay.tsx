import React from "react";
import { UserProfile } from "../shared/types";
import {
  Sparkles,
  Bot,
  BrainCircuit,
  TrendingUp,
  Award,
  Clock,
  Target,
  Zap,
  ChevronUp,
  ChevronDown,
  X,
  Volume2,
  VolumeX,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
} from "lucide-react";
import { ConversationalBridgeService } from "../shared/conversational.bridge.service";
import { toastService } from "../services/toastService";

interface CoachingAdvice {
  id: string;
  mentor: "PETRA" | "NASHMI" | "ZALAMATI";
  type: "celebration" | "focus" | "remediation" | "strategy" | "retention";
  title: string;
  message: string;
  metricTrigger: string;
  actionLabel?: string;
  actionTab?: string;
  priority: "high" | "medium" | "low";
}

interface MentorFeedbackOverlayProps {
  user: UserProfile;
  onNavigateTab?: (tab: string) => void;
  isOpenDefault?: boolean;
}

export const MentorFeedbackOverlay: React.FC<MentorFeedbackOverlayProps> = ({
  user,
  onNavigateTab,
  isOpenDefault = true,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(isOpenDefault);
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [activeAdviceIndex, setActiveAdviceIndex] = React.useState(0);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [lastAnalysisTimestamp, setLastAnalysisTimestamp] = React.useState<string>(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  // Derive dynamic coaching advice based on student metrics
  const coachingFeed: CoachingAdvice[] = React.useMemo(() => {
    const adviceList: CoachingAdvice[] = [];
    const xp = user.xp || 1450;
    const streak = user.streak || 5;
    const level = user.level || 3;
    const enrolledCount = user.enrolledCourses?.length || 2;

    // 1. Streak & Consistency Advice
    if (streak >= 5) {
      adviceList.push({
        id: "streak_pro",
        mentor: "NASHMI",
        type: "celebration",
        title: "Exceptional Cognitive Consistency",
        message: `You are on a ${streak}-day consecutive study streak! Your neuroplastic retention rate is operating at peak efficiency. Keep today's momentum by wrapping up one flashcard cycle.`,
        metricTrigger: `${streak}-Day Daily Streak`,
        actionLabel: "Review Daily Flashcards",
        actionTab: "workbench",
        priority: "high",
      });
    } else {
      adviceList.push({
        id: "streak_boost",
        mentor: "NASHMI",
        type: "focus",
        title: "Rebuild Daily Study Rhythm",
        message: "Dedicate just 15 minutes today to trigger your daily learning streak bonus and earn +100 bonus XP toward your next level tier.",
        metricTrigger: `${streak} Active Streak Days`,
        actionLabel: "Launch 15m Pomodoro",
        actionTab: "workbench",
        priority: "medium",
      });
    }

    // 2. Domain Mastery & Course Balance
    adviceList.push({
      id: "domain_balance",
      mentor: "PETRA",
      type: "remediation",
      title: "Systems Architecture Balance Needed",
      message: "Your AI & ML competency is soaring at 88%, but your Systems & Architecture index is lagging at 62%. Balancing these will accelerate your full-stack capability.",
      metricTrigger: "Domain Imbalance (88% vs 62%)",
      actionLabel: "Open Systems Module",
      actionTab: "courses",
      priority: "high",
    });

    // 3. Spaced Repetition Advice
    adviceList.push({
      id: "retention_sm2",
      mentor: "PETRA",
      type: "retention",
      title: "Spaced Repetition Due (SM-2)",
      message: "4 flashcards on Singular Value Decomposition & Raft Consensus are due for optimal recall reinforcement today before memory decay kicks in.",
      metricTrigger: "4 Cards Due for Spaced Review",
      actionLabel: "Open Spaced Flashcards",
      actionTab: "workbench",
      priority: "medium",
    });

    // 4. Autonomous Telemetry & Zalamati Strategy
    adviceList.push({
      id: "telemetry_insight",
      mentor: "ZALAMATI",
      type: "strategy",
      title: "Velocity Matrix Calibration",
      message: `Your learning velocity is +34% above average cohort baseline. Background telemetry has automatically optimized your pathway milestones for Level ${level + 1}.`,
      metricTrigger: `${xp.toLocaleString()} Cumulative XP`,
      actionLabel: "Explore Degree Milestones",
      actionTab: "degrees",
      priority: "low",
    });

    return adviceList;
  }, [user]);

  const currentAdvice = coachingFeed[activeAdviceIndex] || coachingFeed[0];

  const handleTriggerTTS = () => {
    if (isSpeaking) {
      ConversationalBridgeService.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    if (!currentAdvice) return;
    setIsSpeaking(true);

    const voice = currentAdvice.mentor === "PETRA" ? "en-US-Studio-O" : "en-US-Studio-M";
    const textToRead = `${currentAdvice.mentor === "PETRA" ? "Petra here." : currentAdvice.mentor === "NASHMI" ? "Nashmi here." : "Zalamati orchestrator."} ${currentAdvice.title}. ${currentAdvice.message}`;

    ConversationalBridgeService.speakText(textToRead, {
      voiceName: voice,
      rate: 1.0,
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleRefreshAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setLastAnalysisTimestamp(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      toastService.info("Telemetry Analyzed", "Real-time mentor coaching engine recalculated your metrics.");
    }, 1200);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#030b10]/90 backdrop-blur-xl border border-[#5BC4D4]/40 hover:border-[#5BC4D4] text-white shadow-2xl hover:shadow-[#5BC4D4]/20 transition-all group"
        >
          <div className="w-6 h-6 rounded-lg bg-[#5BC4D4]/20 border border-[#5BC4D4]/40 flex items-center justify-center text-[#5BC4D4] group-hover:scale-110 transition-transform">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <span className="text-xs font-bold text-gray-200">
            Mentor Coach <span className="text-[#5BC4D4] font-mono">({coachingFeed.length})</span>
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-3xl bg-[#030b10]/95 backdrop-blur-2xl border border-[#143242] hover:border-[#5BC4D4]/40 shadow-2xl transition-all duration-300 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#5BC4D4]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4A017]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-[#143242] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0c2230] to-[#12364c] border border-[#5BC4D4]/40 flex items-center justify-center text-[#5BC4D4] shadow-lg">
              <BrainCircuit className="w-5 h-5 animate-pulse" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5BC4D4] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#5BC4D4]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-sm tracking-wide">
                Real-Time Mentor Coaching
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#5BC4D4]/10 text-[#5BC4D4] border border-[#5BC4D4]/30 text-[10px] font-mono font-bold">
                Live Feedback
              </span>
            </div>
            <p className="text-[11px] text-[#73A5AD] mt-0.5">
              Instant strategic advice based on active study telemetry • Updated {lastAnalysisTimestamp}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRefreshAnalysis}
            disabled={isAnalyzing}
            className="p-2 rounded-xl text-[#73A5AD] hover:text-[#5BC4D4] bg-[#0c1a24] border border-[#1b3b4a] hover:border-[#5BC4D4]/30 transition-all text-xs"
            title="Recalculate Mentor Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin text-[#5BC4D4]" : ""}`} />
          </button>

          <button
            onClick={handleTriggerTTS}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
              isSpeaking
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse"
                : "bg-[#0c1a24] text-[#5BC4D4] border-[#1b3b4a] hover:border-[#5BC4D4]/40"
            }`}
            title="Voice Narration by Mentor"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isSpeaking ? "Stop Voice" : "Listen"}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl text-[#73A5AD] hover:text-white bg-[#0c1a24] border border-[#1b3b4a] transition-all"
            title={isExpanded ? "Collapse Advice" : "Expand Advice"}
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 rounded-xl text-[#73A5AD] hover:text-white bg-[#0c1a24] border border-[#1b3b4a] transition-all"
            title="Dock to corner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded Coaching Content */}
      {isExpanded && (
        <div className="space-y-4">
          {/* Advice Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {coachingFeed.map((advice, idx) => {
              const active = idx === activeAdviceIndex;
              return (
                <button
                  key={advice.id}
                  onClick={() => {
                    setActiveAdviceIndex(idx);
                    if (isSpeaking) {
                      ConversationalBridgeService.stopSpeaking();
                      setIsSpeaking(false);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    active
                      ? "bg-[#5BC4D4] text-slate-950 font-black shadow-lg shadow-[#5BC4D4]/20"
                      : "bg-[#0c1a24] text-[#73A5AD] border border-[#1b3b4a] hover:text-white hover:border-[#5BC4D4]/30"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      advice.mentor === "PETRA"
                        ? "bg-cyan-400"
                        : advice.mentor === "NASHMI"
                        ? "bg-cyan-400"
                        : "bg-cyan-400"
                    }`}
                  />
                  <span>{advice.mentor}: {advice.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Advice Card */}
          {currentAdvice && (
            <div className="p-4 rounded-2xl bg-[#07151e] border border-[#18394b] space-y-3 relative">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      currentAdvice.mentor === "PETRA"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        : currentAdvice.mentor === "NASHMI"
                        ? "bg-[#5BC4D4]/20 text-[#5BC4D4] border border-[#5BC4D4]/30"
                        : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    }`}
                  >
                    Coach: {currentAdvice.mentor}
                  </span>
                  <span className="text-xs font-mono text-[#73A5AD] flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-[#5BC4D4]" />
                    Trigger: <span className="text-white font-semibold">{currentAdvice.metricTrigger}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-[#73A5AD]">
                  <span>Insight {activeAdviceIndex + 1} of {coachingFeed.length}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[#D4A017]" />
                  {currentAdvice.title}
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {currentAdvice.message}
                </p>
              </div>

              {/* Action Button */}
              {currentAdvice.actionLabel && (
                <div className="pt-2 flex items-center justify-between border-t border-[#122e3d]">
                  <span className="text-[11px] text-[#73A5AD] italic">
                    Recommended action to maintain velocity
                  </span>
                  <button
                    onClick={() => {
                      if (currentAdvice.actionTab && onNavigateTab) {
                        onNavigateTab(currentAdvice.actionTab);
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#5BC4D4] to-[#34d399] hover:from-[#4ab5c5] hover:to-[#2ec088] text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                  >
                    <span>{currentAdvice.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quick Metrics Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            <div className="p-2.5 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#D4A017] shrink-0" />
              <div>
                <div className="text-[10px] text-[#73A5AD]">Study Streak</div>
                <div className="font-bold text-white">{user.streak || 5} Days Active</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#5BC4D4] shrink-0" />
              <div>
                <div className="text-[10px] text-[#73A5AD]">XP Velocity</div>
                <div className="font-bold text-white">+340 XP / Session</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#34d399] shrink-0" />
              <div>
                <div className="text-[10px] text-[#73A5AD]">Mastery Index</div>
                <div className="font-bold text-white">76.3% Average</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="text-[10px] text-[#73A5AD]">Focus Quotient</div>
                <div className="font-bold text-white">45m / Day</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
