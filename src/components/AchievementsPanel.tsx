import React from "react";
import { motion } from "motion/react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { UserProfile, Badge, Milestone, Course } from "../shared/types";
import {
  Sparkles,
  Flame,
  Award,
  CheckCircle2,
  Gift,
  Zap,
  Shield,
  Star,
  ChevronRight,
  Trophy,
  Share2,
  Globe,
  MessageSquare,
  TrendingUp,
  Target,
} from "lucide-react";

interface AchievementsPanelProps {
  user: UserProfile;
  courses: Course[];
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({
  user,
  courses,
  onUpdateUser,
}) => {
  const [activeCategory, setActiveCategory] = React.useState<
    "all" | "ai" | "mastery" | "streak" | "learning"
  >("all");
  const [claimedRewards, setClaimedRewards] = React.useState<Record<string, boolean>>(
    {},
  );
  const [claimAnimation, setClaimAnimation] = React.useState<string | null>(null);
  const [hasSharedToday, setHasSharedToday] = React.useState(false);

  const xpPoints = user.xpPoints || 1250;
  const level = user.level || Math.floor(xpPoints / 1000) + 1;
  const currentLevelXP = xpPoints % 1000;
  const xpToNextLevel = 1000 - currentLevelXP;

  const handleShareToSocial = (platform: string) => {
    if (hasSharedToday) return;

    const shareText = encodeURIComponent(
      `I am advancing my Computer Science degree with LMDpro AI Tutor! Join the 100% free open-source degree movement: ${window.location.origin}`,
    );
    let shareUrl = "";

    if (platform === "twitter")
      shareUrl = `https://twitter.com/intent/tweet?text=${shareText}`;
    else if (platform === "linkedin")
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`;
    else
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`;

    window.open(shareUrl, "_blank", "width=600,height=400");

    // Grant Daily Share Bonus
    const bonusXP = 100;
    const newXP = user.xpPoints + bonusXP;
    const newLevel = Math.floor(newXP / 1000) + 1;

    setHasSharedToday(true);
    setClaimAnimation(`+${bonusXP} XP Daily Social Share Reward Claimed! 🎉`);

    onUpdateUser({
      xpPoints: newXP,
      level: newLevel,
    });

    setTimeout(() => setClaimAnimation(null), 3000);
  };

  const handleClaimReward = (milestone: Milestone) => {
    if (claimedRewards[milestone.id]) return;

    // Award bonus XP
    const rewardXP = 250;
    const newXP = user.xpPoints + rewardXP;
    const newLevel = Math.floor(newXP / 1000) + 1;

    setClaimedRewards((prev) => ({ ...prev, [milestone.id]: true }));
    setClaimAnimation(`+${rewardXP} XP Bonus Claimed! 🎉`);

    onUpdateUser({
      xpPoints: newXP,
      level: newLevel,
      milestones: user.milestones.map((m) =>
        m.id === milestone.id ? { ...m, achieved: true } : m,
      ),
    });

    setTimeout(() => setClaimAnimation(null), 3000);
  };

  const filteredBadges = (user.badges || []).filter((b) => {
    if (activeCategory === "all") return true;
    return b.category === activeCategory;
  });

  const completedCourses = courses.filter((c) =>
    user.completedCourseIds.includes(c.id)
  );

  const skillsMap: Record<string, number> = {};
  completedCourses.forEach((course) => {
    course.tags.forEach((tag) => {
      skillsMap[tag] = (skillsMap[tag] || 0) + 20;
      if (skillsMap[tag] > 100) skillsMap[tag] = 100;
    });
  });

  const radarData = Object.keys(skillsMap).map((skill) => ({
    subject: skill,
    A: skillsMap[skill],
    fullMark: 100,
  }));

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#0b1820] border border-[#1b3a4a] text-white shadow-2xl space-y-6">
      {/* Top Banner: Level, Streak, XP Bar */}
      <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r from-[#0d232f] via-[#112d3c] to-[#0e2735] border border-cyan-500/20 shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {claimAnimation && (
          <div className="absolute top-3 right-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-500 text-slate-950 font-black text-xs animate-bounce shadow-lg z-20">
            {claimAnimation}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Level Circle Badge */}
          <div className="md:col-span-4 flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-cyan-600 p-0.5 shadow-xl shadow-cyan-900/40 shrink-0">
              <div className="w-full h-full rounded-[14px] bg-[#09151c] flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">
                  Level
                </span>
                <span className="text-2xl font-black text-white">{level}</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                Scholar Engineer
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </h3>
              <p className="text-xs text-[#82a4b3]">
                Next Title:{" "}
                <strong className="text-cyan-300">
                  Master Systems Architect
                </strong>{" "}
                ({xpToNextLevel} XP needed)
              </p>
            </div>
          </div>

          {/* XP Progress Bar & Streak Flame */}
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="text-cyan-300 font-mono">
                  {currentLevelXP} / 1000 XP
                </span>
                <span className="text-[10px] text-[#7092a2]">
                  ({xpPoints} Total XP)
                </span>
              </div>

              {/* Animated Daily Streak Flame */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                <Flame className="w-4 h-4 text-cyan-400 animate-bounce" />
                <span className="font-black text-xs">
                  {user.streakDays || 7} Day Streak
                </span>
              </div>
            </div>

            {/* Visual Bar */}
            <div className="w-full h-3 bg-[#08131a] rounded-full p-0.5 border border-[#1b3d4f] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-400 rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${(currentLevelXP / 1000) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Badges Collection Showcase */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#183645] pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Unlocked Academic Badges
            </h3>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1 bg-[#0d1e28] p-1 rounded-xl border border-[#1b3d4f] text-xs">
            {[
              { id: "all", label: "All Badges" },
              { id: "ai", label: "Cognitive" },
              { id: "mastery", label: "Mastery" },
              { id: "streak", label: "Streak" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  activeCategory === cat.id
                    ? "bg-cyan-500 text-slate-950 font-bold shadow"
                    : "text-[#82a4b3] hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {filteredBadges.map((badge) => (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              animate={{
                boxShadow: [
                  "0 0 0px rgba(34, 211, 238, 0)",
                  "0 0 15px rgba(34, 211, 238, 0.3)",
                  "0 0 5px rgba(34, 211, 238, 0.15)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              className="p-3.5 rounded-xl bg-[#0e212b] border border-[#1d3d4e] hover:border-cyan-500/50 hover:shadow-cyan-950/40 transition-all flex items-center gap-3 group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-[#09151c] border border-cyan-500/30 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                {badge.icon}
              </div>
              <div className="space-y-0.5 overflow-hidden">
                <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                  {badge.name}
                </h4>
                <p className="text-[11px] text-[#7ea0b1] line-clamp-2">
                  {badge.description}
                </p>
                <span className="text-[10px] text-cyan-400 font-semibold block pt-0.5">
                  Unlocked {badge.dateUnlocked || "Recently"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Learning Analytics Radar */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-[#183645] pb-3">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Skill Mastery & Learning Focus
            </h3>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              Strengths
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              Gaps
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 p-4 rounded-xl bg-[#0b1b24] border border-[#1b3d4f] shadow-inner h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#1b3d4f" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#82a4b3", fontSize: 10 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: "#1b3d4f" }}
                />
                <Radar
                  name="Mastery"
                  dataKey="A"
                  stroke="#2dd4bf"
                  fill="#2dd4bf"
                  fillOpacity={0.4}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0b1b24",
                    borderColor: "#1b3d4f",
                    borderRadius: "12px",
                    fontSize: "11px",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-[#0b1b24] border border-[#1b3d4f] space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Top Identified Strengths
              </h4>
              <div className="space-y-2">
                {radarData
                  .sort((a, b) => b.A - a.A)
                  .slice(0, 3)
                  .map((skill) => (
                    <div key={skill.subject} className="flex items-center justify-between">
                      <span className="text-[11px] text-[#82a4b3]">{skill.subject}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-[#08131a] rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${skill.A}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-cyan-400">{skill.A}%</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#0b1b24] border border-[#1b3d4f] space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                Critical Knowledge Gaps
              </h4>
              <div className="space-y-2">
                {radarData
                  .sort((a, b) => a.A - b.A)
                  .slice(0, 3)
                  .map((skill) => (
                    <div key={skill.subject} className="flex items-center justify-between">
                      <span className="text-[11px] text-[#82a4b3]">{skill.subject}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-[#08131a] rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${skill.A}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-cyan-400">{skill.A}%</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Milestones & Claimable Rewards */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">
            Academic Milestones & XP Bonus Rewards
          </h3>
        </div>

        <div className="space-y-2">
          {/* Daily Social Media Share Reward Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#0b212d] to-[#0e2736] border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                <Share2 className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-white">
                    Daily Social Media Share Challenge
                  </h4>
                  <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/30">
                    +100 XP REWARD
                  </span>
                </div>
                <p className="text-[11px] text-[#7ea0b1] mt-0.5">
                  Share LMDpro's open-source degree movement on LinkedIn,
                  Twitter, or Facebook to earn 100 XP daily!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleShareToSocial("twitter")}
                disabled={hasSharedToday}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 ${
                  hasSharedToday
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 cursor-default"
                    : "bg-[#1da1f2]/20 border border-[#1da1f2]/40 text-[#1da1f2] hover:bg-[#1da1f2]/30"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>X / Twitter</span>
              </button>

              <button
                onClick={() => handleShareToSocial("linkedin")}
                disabled={hasSharedToday}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 ${
                  hasSharedToday
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 cursor-default"
                    : "bg-[#0a66c2]/20 border border-[#0a66c2]/40 text-[#0a66c2] hover:bg-[#0a66c2]/30"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </button>
            </div>
          </div>

          {(user.milestones || []).map((m) => {
            const isClaimed = claimedRewards[m.id] || m.achieved;
            return (
              <div
                key={m.id}
                className="p-3.5 rounded-xl bg-[#0e212b] border border-[#1d3d4e] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl border ${isClaimed ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"}`}
                  >
                    {isClaimed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Star className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{m.title}</h4>
                    <span className="text-[11px] text-[#7ea0b1]">
                      {m.reward}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleClaimReward(m)}
                  disabled={isClaimed}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 ${
                    isClaimed
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 cursor-default"
                      : "bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 text-white shadow-md active:scale-95"
                  }`}
                >
                  {isClaimed ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Claimed</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      <span>Claim +250 XP</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
