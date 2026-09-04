import React from "react";
import {
  Trophy,
  Award,
  Zap,
  Flame,
  Star,
  Target,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Crown,
  Medal,
  Users,
  ChevronRight,
  CheckCircle2,
  Lock,
  Layers,
  Clock,
  Gift,
  Check,
  Radio,
} from "lucide-react";
import { UserProfile, Badge, Milestone } from "../shared/types";
import { triggerConfetti } from "../utils/confetti";

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
  cohort: string;
  xpPoints: number;
  level: number;
  streakDays: number;
  badgesCount: number;
  topSkill: string;
  isCurrentUser?: boolean;
}

export interface GamificationChallenge {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly";
  xpReward: number;
  currentProgress: number;
  targetProgress: number;
  unit: string;
  isCompleted: boolean;
  isClaimed: boolean;
  expiresIn: string;
}

interface LeaderboardPanelProps {
  user: UserProfile;
}

export const LeaderboardPanel: React.FC<LeaderboardPanelProps> = ({ user }) => {
  const [timeframe, setTimeframe] = React.useState<"weekly" | "monthly" | "allTime">("weekly");
  const [selectedCohort, setSelectedCohort] = React.useState<string>("all");
  const [activeTab, setActiveTab] = React.useState<"leaderboard" | "challenges" | "badges" | "pointsSystem">("leaderboard");
  const [claimedNotice, setClaimedNotice] = React.useState<string | null>(null);

  // Challenges state
  const [challenges, setChallenges] = React.useState<GamificationChallenge[]>([
    {
      id: "ch-1",
      title: "Daily Socratic Scholar",
      description: "Complete 2 interactive lessons or AI tutoring questions today.",
      type: "daily",
      xpReward: 100,
      currentProgress: 2,
      targetProgress: 2,
      unit: "lessons",
      isCompleted: true,
      isClaimed: false,
      expiresIn: "8h 24m",
    },
    {
      id: "ch-2",
      title: "Perfect Score Mastery",
      description: "Achieve a 100% score on any course or module quiz.",
      type: "daily",
      xpReward: 150,
      currentProgress: 1,
      targetProgress: 1,
      unit: "quiz",
      isCompleted: true,
      isClaimed: false,
      expiresIn: "8h 24m",
    },
    {
      id: "ch-3",
      title: "Knowledge Gap Conqueror",
      description: "Review and resolve 1 AI-diagnosed conceptual knowledge gap.",
      type: "daily",
      xpReward: 120,
      currentProgress: 0,
      targetProgress: 1,
      unit: "gap",
      isCompleted: false,
      isClaimed: false,
      expiresIn: "8h 24m",
    },
    {
      id: "ch-4",
      title: "Weekly Deep Dive Sprint",
      description: "Log at least 5 hours of verified active study this week.",
      type: "weekly",
      xpReward: 450,
      currentProgress: 3.8,
      targetProgress: 5,
      unit: "hours",
      isCompleted: false,
      isClaimed: false,
      expiresIn: "3 days",
    },
    {
      id: "ch-5",
      title: "Collaborative Peer Champion",
      description: "Answer 3 student questions in the academic discussion forum.",
      type: "weekly",
      xpReward: 300,
      currentProgress: 3,
      targetProgress: 3,
      unit: "answers",
      isCompleted: true,
      isClaimed: false,
      expiresIn: "3 days",
    },
  ]);

  // Academy Leaderboard Data sorted dynamically by XP
  const rawUsers = [
    {
      id: "usr-1",
      name: "Dr. Elena Rostova",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop",
      role: "Graduate Researcher",
      cohort: "Autonomous AI",
      xpPoints: 4850,
      level: 5,
      streakDays: 28,
      badgesCount: 12,
      topSkill: "Distributed Consensus",
    },
    {
      id: "usr-2",
      name: "David Chen",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop",
      role: "AI Engineer",
      cohort: "Computer Science",
      xpPoints: 4120,
      level: 4,
      streakDays: 21,
      badgesCount: 9,
      topSkill: "WebGPU Compute Shaders",
    },
    {
      id: "usr-3",
      name: user.name || "Alex Mercer",
      avatarUrl:
        user.avatarUrl ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
      role: "Scholar (You)",
      cohort: "Autonomous AI",
      xpPoints: user.xpPoints || user.xp || 2710,
      level: user.level || 3,
      streakDays: user.streakDays || 14,
      badgesCount: (user.badges || []).length || 6,
      topSkill: "Agentic Architect",
      isCurrentUser: true,
    },
    {
      id: "usr-4",
      name: "Prof. Marcus Vance",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
      role: "Lead Chair",
      cohort: "Distributed Systems",
      xpPoints: 2450,
      level: 3,
      streakDays: 12,
      badgesCount: 8,
      topSkill: "Fault Tolerance",
    },
    {
      id: "usr-5",
      name: "Sarah Jenkins",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop",
      role: "Student",
      cohort: "Quantum Physics",
      xpPoints: 1980,
      level: 2,
      streakDays: 9,
      badgesCount: 5,
      topSkill: "Quantum Computing",
    },
    {
      id: "usr-6",
      name: "Tariq Al-Mansoor",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop",
      role: "Scholar",
      cohort: "Computer Science",
      xpPoints: 1820,
      level: 2,
      streakDays: 8,
      badgesCount: 4,
      topSkill: "Python & Algorithms",
    },
  ];

  const filteredUsers = rawUsers.filter((u) => {
    if (selectedCohort === "all") return true;
    return u.cohort === selectedCohort;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => b.xpPoints - a.xpPoints);
  const leaderboardUsers: LeaderboardUser[] = sortedUsers.map((u, idx) => ({
    ...u,
    rank: idx + 1,
  }));

  const currentUserRank = leaderboardUsers.find((u) => u.isCurrentUser)?.rank || 3;

  // Handle claiming challenge XP
  const handleClaimChallenge = (id: string, xpReward: number) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isClaimed: true } : c))
    );
    try {
      triggerConfetti();
    } catch {
      // safe fallback
    }
    setClaimedNotice(`+${xpReward} XP Claimed! Challenge Completed 🎉`);
    setTimeout(() => setClaimedNotice(null), 3500);
  };

  // Badges Data
  const allBadges: Badge[] = [
    {
      id: "b1",
      name: "AI Architect",
      icon: "🤖",
      description: "Mastered 3 Gemini & Edge Agentic Course Modules",
      category: "ai",
      dateUnlocked: "Unlocked",
    },
    {
      id: "b2",
      name: "14-Day Streak Master",
      icon: "🔥",
      description: "Maintained 14 consecutive days of active academic study",
      category: "streak",
      dateUnlocked: "Unlocked",
    },
    {
      id: "b3",
      name: "Consensus Defender",
      icon: "🛡️",
      description: "Achieved 100% quiz score on Raft & Paxos Distributed Systems",
      category: "mastery",
      dateUnlocked: "Unlocked",
    },
    {
      id: "b4",
      name: "WebGPU Shader Expert",
      icon: "⚡",
      description: "Executed client WGSL compute shader matrix evaluation",
      category: "learning",
      dateUnlocked: "In Progress (80%)",
    },
    {
      id: "b5",
      name: "Socratic Scholar",
      icon: "🎓",
      description: "Asked 20 pedagogical questions in the AI Tutor & Q&A Portal",
      category: "ai",
      dateUnlocked: "Locked",
    },
    {
      id: "b6",
      name: "Peer Forum Legend",
      icon: "💬",
      description: "Received 50 upvotes on course discussion forum answers",
      category: "mastery",
      dateUnlocked: "Locked",
    },
  ];

  return (
    <div className="rounded-3xl bg-[#0c1a24] border border-[#1b3b4a] p-6 md:p-8 space-y-6 text-white shadow-2xl animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#183646] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-cyan-400" />
              Academic Gamification & Leaderboard
            </span>
            <span className="text-xs text-[#789cae]">
              XP Points • Badges • Daily Challenges
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1">
            Global Scholar Leaderboard & Achievement Arenas
          </h2>
        </div>

        {/* User Rank Quick Card */}
        <div className="p-3.5 rounded-2xl bg-[#08151c] border border-cyan-500/30 flex items-center gap-4 shadow-lg">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-[#789cae] uppercase font-bold">
              Your Current Rank
            </div>
            <div className="text-base font-black text-white flex items-center gap-2">
              <span>Rank #{currentUserRank}</span>
              <span className="text-xs font-semibold text-cyan-300 font-mono">
                ({user.xpPoints || user.xp || 2710} XP)
              </span>
            </div>
          </div>
        </div>
      </div>

      {claimedNotice && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-cyan-500/20 border border-cyan-400/40 text-cyan-200 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-lg">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{claimedNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#183646] pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "leaderboard"
                ? "bg-cyan-400 text-slate-950 font-black shadow"
                : "bg-[#08151c] text-[#789cae] border border-[#1b3b4a] hover:text-white"
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={() => setActiveTab("challenges")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "challenges"
                ? "bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-black shadow"
                : "bg-[#08151c] text-[#789cae] border border-[#1b3b4a] hover:text-white"
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Daily & Weekly Challenges ({challenges.filter((c) => c.isCompleted && !c.isClaimed).length} Ready)</span>
          </button>

          <button
            onClick={() => setActiveTab("badges")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "badges"
                ? "bg-cyan-500 text-slate-950 font-black shadow"
                : "bg-[#08151c] text-[#789cae] border border-[#1b3b4a] hover:text-white"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Mastery Badges ({allBadges.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("pointsSystem")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "pointsSystem"
                ? "bg-cyan-400 text-slate-950 font-black shadow"
                : "bg-[#08151c] text-[#789cae] border border-[#1b3b4a] hover:text-white"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Point System Rules</span>
          </button>
        </div>

        {/* Filter Controls for Leaderboard */}
        {activeTab === "leaderboard" && (
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#08151c] border border-[#1b3b4a] text-xs text-cyan-300 font-semibold focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Academic Cohorts</option>
              <option value="Autonomous AI">Autonomous AI</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Distributed Systems">Distributed Systems</option>
              <option value="Quantum Physics">Quantum Physics</option>
            </select>

            <div className="flex items-center gap-1 bg-[#08151c] p-1 rounded-xl border border-[#1b3b4a]">
              {(["weekly", "monthly", "allTime"] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                    timeframe === tf
                      ? "bg-cyan-400 text-slate-950 font-black shadow"
                      : "text-[#789cae] hover:text-white"
                  }`}
                >
                  {tf === "allTime" ? "All-Time" : tf}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* TAB 1: LEADERBOARD */}
      {activeTab === "leaderboard" && (
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-2.5">
            {leaderboardUsers.map((u) => {
              const isTop3 = u.rank <= 3;
              return (
                <div
                  key={u.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 shadow-lg ${
                    u.isCurrentUser
                      ? "bg-gradient-to-r from-[#0e2736] to-[#0a1f2b] border-cyan-400 ring-1 ring-cyan-400/40"
                      : isTop3
                      ? "bg-[#081720] border-cyan-500/30"
                      : "bg-[#08151c] border-[#1b3b4a]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Badge */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                        u.rank === 1
                          ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/40"
                          : u.rank === 2
                          ? "bg-slate-300 text-slate-950 shadow-md"
                          : u.rank === 3
                          ? "bg-cyan-700 text-white"
                          : "bg-[#122a36] text-[#789cae]"
                      }`}
                    >
                      {u.rank === 1 ? <Crown className="w-5 h-5 fill-current" /> : `#${u.rank}`}
                    </div>

                    {/* Avatar & User Details */}
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl object-cover border border-cyan-400/40 shrink-0"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-white flex items-center gap-2">
                          <span>{u.name}</span>
                          {u.isCurrentUser && (
                            <span className="px-2 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                              YOU
                            </span>
                          )}
                        </h3>
                        <div className="text-[11px] text-[#789cae] flex items-center gap-2">
                          <span>{u.role}</span>
                          <span>•</span>
                          <span className="text-cyan-300 font-medium">Cohort: {u.cohort}</span>
                          <span>•</span>
                          <span className="text-cyan-300 font-medium">Top: {u.topSkill}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* XP & Stats Right */}
                  <div className="flex items-center gap-6 text-right">
                    <div className="hidden sm:block">
                      <div className="text-xs font-bold text-cyan-400 flex items-center gap-1 justify-end">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        <span>{u.streakDays} Days</span>
                      </div>
                      <div className="text-[10px] text-[#789cae]">Study Streak</div>
                    </div>

                    <div className="hidden sm:block">
                      <div className="text-xs font-bold text-cyan-300 flex items-center gap-1 justify-end">
                        <Award className="w-3.5 h-3.5" />
                        <span>{u.badgesCount} Badges</span>
                      </div>
                      <div className="text-[10px] text-[#789cae]">Unlocked</div>
                    </div>

                    <div className="bg-[#051117] border border-[#183a4c] px-4 py-2 rounded-xl text-center shrink-0">
                      <div className="text-sm font-black text-cyan-300 font-mono">
                        {u.xpPoints.toLocaleString()} XP
                      </div>
                      <div className="text-[9px] text-[#638799] uppercase font-bold">
                        Level {u.level}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: DAILY & WEEKLY CHALLENGES */}
      {activeTab === "challenges" && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#14081c] to-[#08151c] border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-cyan-400" />
                <span>Daily Quests & Weekly Milestone Challenges</span>
              </h3>
              <p className="text-xs text-[#7fa3b5] max-w-xl">
                Consistent daily study triggers streak multipliers (up to 2.0x XP). Complete challenges before reset to climb the global leaderboard.
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-cyan-300 shrink-0">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Resets in 8h 24m</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map((ch) => {
              const pct = Math.min(100, Math.round((ch.currentProgress / ch.targetProgress) * 100));

              return (
                <div
                  key={ch.id}
                  className={`p-5 rounded-2xl bg-[#08151c] border transition-all flex flex-col justify-between space-y-4 shadow-lg ${
                    ch.isClaimed
                      ? "border-cyan-500/30 opacity-75"
                      : ch.isCompleted
                      ? "border-cyan-400/60 ring-1 ring-cyan-400/30"
                      : "border-[#1b3b4a]"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          ch.type === "daily"
                            ? "bg-cyan-950/80 border border-cyan-500/40 text-cyan-300"
                            : "bg-cyan-950/80 border border-cyan-500/40 text-cyan-300"
                        }`}
                      >
                        {ch.type === "daily" ? "Daily Quest" : "Weekly Master Challenge"}
                      </span>

                      <span className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-cyan-400 fill-current" />
                        +{ch.xpReward} XP
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-white">{ch.title}</h4>
                    <p className="text-xs text-[#7fa3b5] leading-relaxed">{ch.description}</p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#7397aa]">
                          Progress: {ch.currentProgress} / {ch.targetProgress} {ch.unit}
                        </span>
                        <span className="text-cyan-400 font-bold">{pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#0c1a24] overflow-hidden border border-[#1b3b4a]">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-2 border-t border-[#183646] flex items-center justify-between">
                    <span className="text-[11px] text-[#7397aa] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      Expires in {ch.expiresIn}
                    </span>

                    {ch.isClaimed ? (
                      <span className="px-3 py-1 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-cyan-400" /> Claimed
                      </span>
                    ) : ch.isCompleted ? (
                      <button
                        onClick={() => handleClaimChallenge(ch.id, ch.xpReward)}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-400 hover:from-cyan-300 hover:to-cyan-300 text-slate-950 font-black text-xs shadow flex items-center gap-1.5 active:scale-95 transition-all"
                      >
                        <Gift className="w-3.5 h-3.5 text-slate-950" />
                        <span>Claim +{ch.xpReward} XP</span>
                      </button>
                    ) : (
                      <span className="text-xs text-[#7397aa] font-semibold">In Progress</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: MASTERY BADGES LOCKER */}
      {activeTab === "badges" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in">
          {allBadges.map((badge) => {
            const isUnlocked = badge.dateUnlocked === "Unlocked";
            return (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border space-y-3 flex flex-col justify-between transition-all shadow-lg ${
                  isUnlocked
                    ? "bg-[#081720] border-cyan-500/40 hover:border-cyan-400"
                    : "bg-[#08151c] border-[#1b3b4a] opacity-75"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{badge.icon}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isUnlocked
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      {badge.dateUnlocked}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white">{badge.name}</h3>
                  <p className="text-xs text-[#789cae] leading-relaxed">{badge.description}</p>
                </div>

                <div className="pt-2 border-t border-[#183646] flex items-center justify-between text-[11px] text-cyan-300">
                  <span className="capitalize font-mono">Category: {badge.category}</span>
                  {isUnlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: POINT SYSTEM RULES */}
      {activeTab === "pointsSystem" && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-6 rounded-2xl bg-[#08151c] border border-[#1b3b4a] space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400" />
              <span>How Points (XP), Badges, & Rank Multipliers Work</span>
            </h3>

            <p className="text-xs text-[#789cae] leading-relaxed">
              Earn XP points by actively learning, passing adaptive quizzes, participating in peer discussions, resolving conceptual knowledge gaps, and maintaining daily study streaks. Higher XP unlocks scholar levels and badges!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#0c1f2a] border border-[#1b3b4a] space-y-1 text-center">
                <div className="text-lg font-black text-cyan-300">+100 XP</div>
                <div className="text-xs font-bold text-white">Complete Lesson</div>
                <div className="text-[10px] text-[#6d91a2]">Finish reading, code, & audio</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0c1f2a] border border-[#1b3b4a] space-y-1 text-center">
                <div className="text-lg font-black text-cyan-300">+150 XP</div>
                <div className="text-xs font-bold text-white">100% Quiz Score</div>
                <div className="text-[10px] text-[#6d91a2]">Perfect score on module checks</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0c1f2a] border border-[#1b3b4a] space-y-1 text-center">
                <div className="text-lg font-black text-cyan-300">+120 XP</div>
                <div className="text-xs font-bold text-white">Knowledge Gap Remedy</div>
                <div className="text-[10px] text-[#6d91a2]">Mastering diagnosed gap concept</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0c1f2a] border border-[#1b3b4a] space-y-1 text-center">
                <div className="text-lg font-black text-cyan-400">+100-450 XP</div>
                <div className="text-xs font-bold text-white">Challenges</div>
                <div className="text-[10px] text-[#6d91a2]">Daily quests & weekly milestones</div>
              </div>
            </div>

            {/* Streak Multiplier Table */}
            <div className="p-4 rounded-xl bg-[#030b10] border border-[#143242] space-y-2">
              <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-cyan-400" />
                <span>Streak Boost Multipliers:</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#7fa3b5]">
                <div className="p-2 rounded-lg bg-[#08151c] border border-[#1b3b4a]">
                  <span className="font-bold text-white">3 Days:</span> 1.1x XP
                </div>
                <div className="p-2 rounded-lg bg-[#08151c] border border-[#1b3b4a]">
                  <span className="font-bold text-white">7 Days:</span> 1.25x XP
                </div>
                <div className="p-2 rounded-lg bg-[#08151c] border border-[#1b3b4a]">
                  <span className="font-bold text-white">14 Days:</span> 1.5x XP
                </div>
                <div className="p-2 rounded-lg bg-[#08151c] border border-[#1b3b4a]">
                  <span className="font-bold text-white">30+ Days:</span> 2.0x XP Max
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
