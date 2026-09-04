import React from 'react';
import { UserProfile, Badge, LeaderboardEntry } from '../shared/types';
import { GamificationEngine, PointEvent } from '../shared/gamification.engine';
import { getTranslation } from '../shared/localization';
import { Tooltip } from './Tooltip';
import {
  Trophy,
  Award,
  Zap,
  Flame,
  Star,
  Users,
  Target,
  Crown,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Swords,
  Gift,
  CheckCircle2,
  Lock,
  TrendingUp,
  Brain,
  History,
  Check
} from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';
import { toastService } from '../services/toastService';
import { motion, AnimatePresence } from 'motion/react';
import { PointsHistoryModal } from './PointsHistoryModal';

interface GamificationDashboardProps {
  user: UserProfile;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
}

export const GamificationDashboard: React.FC<GamificationDashboardProps> = ({ user, onUpdateUser }) => {
  const lang = user.language || 'en';
  const isAr = lang === 'ar';
  const t = getTranslation(lang);

  const [activeLeaderboardTab, setActiveLeaderboardTab] = React.useState<'weekly' | 'global' | 'major'>('weekly');
  const [selectedBadge, setSelectedBadge] = React.useState<Badge | null>(null);
  const [liveXpAnimation, setLiveXpAnimation] = React.useState<number | null>(null);
  const [isPointsHistoryOpen, setIsPointsHistoryOpen] = React.useState<boolean>(false);
  const [celebratingBadgeId, setCelebratingBadgeId] = React.useState<string | null>(null);

  // Subscribe to Gamification Engine live events
  React.useEffect(() => {
    const unsubscribe = GamificationEngine.subscribe((event: PointEvent) => {
      setLiveXpAnimation(event.xpEarned);
      triggerConfetti();
      setTimeout(() => setLiveXpAnimation(null), 3000);

      if (event.unlockedBadges.length > 0) {
        setCelebratingBadgeId(event.unlockedBadges[0].id);
        setTimeout(() => setCelebratingBadgeId(null), 4000);
      }

      if (onUpdateUser) {
        onUpdateUser({
          xpPoints: event.newTotalXp,
          xp: event.newTotalXp,
          level: event.newLevel,
          badges: event.unlockedBadges.length > 0 ? [...user.badges, ...event.unlockedBadges] : user.badges
        });
      }
    });
    return unsubscribe;
  }, [user, onUpdateUser]);

  const currentXp = user.xpPoints || user.xp || 1450;
  const currentLevel = user.level || Math.floor(currentXp / 1000) + 1;
  const nextLevelXp = currentLevel * 1000;
  const prevLevelXp = (currentLevel - 1) * 1000;
  const levelProgressXp = currentXp - prevLevelXp;
  const levelProgressPercent = Math.min(100, Math.max(0, Math.round((levelProgressXp / 1000) * 100)));

  const streakDays = user.streakDays || user.streak || 7;
  const streakMultiplier = streakDays >= 14 ? 1.5 : streakDays >= 7 ? 1.25 : 1.0;

  // Catalog of all system badges (unlocked and available)
  const allBadges: Badge[] = [
    {
      id: 'b-welcome',
      name: isAr ? 'مستكشف الأكاديمية' : 'Academy Pioneer',
      icon: '🚀',
      description: isAr ? 'التسجيل وإكمال التوجيه الأكاديمي المبدئي' : 'Enrolled and completed initial orientation',
      category: 'learning',
      dateUnlocked: '2026-08-01'
    },
    {
      id: 'b-level2',
      name: isAr ? 'خبير المعماريات' : 'Master Systems Architect',
      icon: '⚡',
      description: isAr ? 'الوصول للمستوى الثاني في الأكاديمية' : 'Advanced to Level 2 in LMDpro Academy',
      category: 'mastery',
      dateUnlocked: currentLevel >= 2 ? '2026-08-15' : undefined
    },
    {
      id: 'b-1k-xp',
      name: isAr ? 'باحث 1K XP' : '1K XP Scholar',
      icon: '🏆',
      description: isAr ? 'تحقيق 1,000+ نقطة خبرة أكاديمية' : 'Earned 1,000+ total academic XP',
      category: 'learning',
      dateUnlocked: currentXp >= 1000 ? '2026-08-10' : undefined
    },
    {
      id: 'b-streak-7',
      name: isAr ? 'سلسلة 7 أيام' : '7-Day Focus Streak',
      icon: '🔥',
      description: isAr ? 'التعلم المستمر لمدة 7 أيام متتالية' : 'Maintained learning momentum for 7 consecutive days',
      category: 'streak',
      dateUnlocked: streakDays >= 7 ? '2026-08-20' : undefined
    },
    {
      id: 'b-perfect-quiz',
      name: isAr ? 'إتقان التوافق' : 'Consensus Perfectionist',
      icon: '🎯',
      description: isAr ? 'تحقيق 100% في اختبار معمارية الأنظمة' : 'Achieved 100% accuracy on a comprehensive quiz',
      category: 'mastery',
      dateUnlocked: '2026-08-18'
    },
    {
      id: 'b-ai-pioneer',
      name: isAr ? 'رائد الوكلاء الذكاء الاصطناعي' : 'AI Agent Pioneer',
      icon: '🧠',
      description: isAr ? 'بناء وتشغيل أول نموذج استدعاء أدوات مستقل' : 'Architected and deployed first autonomous tool caller',
      category: 'ai',
      dateUnlocked: '2026-08-22'
    },
    {
      id: 'b-quantum-master',
      name: isAr ? 'ماستر الكيوبت الكمومي' : 'Qubit Master',
      icon: '⚛️',
      description: isAr ? 'اجتياز جميع دروس الفيزياء الكمية والتشفير' : 'Passed all Quantum Physics & Cryptography modules',
      category: 'mastery',
      dateUnlocked: undefined
    },
    {
      id: 'b-streak-30',
      name: isAr ? 'أسطورة الالتزام 30 يوماً' : '30-Day Legend',
      icon: '👑',
      description: isAr ? 'سلسلة تعلم متواصلة لمدة 30 يوماً' : 'Maintained uninterrupted 30-day study streak',
      category: 'streak',
      dateUnlocked: undefined
    }
  ];

  const userBadgeIds = new Set((user.badges || []).map((b) => b.id));

  // Mock Leaderboard cohort
  const leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      id: 'u-1',
      name: isAr ? 'د. طارق السالم' : 'Dr. Tariq Al-Salem',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      role: 'Post-Doc Fellow',
      majorOrField: 'Multi-Agent Systems',
      xp: 3250,
      level: 4,
      streakDays: 21,
      badgesCount: 12,
      recentAchievement: 'Sheaf Laplacian Mastery'
    },
    {
      rank: 2,
      id: user.id || 'current-user',
      name: user.name || (isAr ? 'أنت (الطالب المتميز)' : 'You (Current Student)'),
      avatar: user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      role: user.careerRole || 'Graduate Scholar',
      majorOrField: 'AI Systems Architecture',
      xp: currentXp,
      level: currentLevel,
      streakDays: streakDays,
      badgesCount: (user.badges || []).length || 5,
      recentAchievement: 'Consensus Perfectionist',
      isCurrentUser: true
    },
    {
      rank: 3,
      id: 'u-3',
      name: isAr ? 'سارة المنصوري' : 'Sarah Al-Mansoori',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      role: 'Master Candidate',
      majorOrField: 'Quantum Computing',
      xp: 1380,
      level: 2,
      streakDays: 12,
      badgesCount: 7,
      recentAchievement: 'Qubit State Defense'
    },
    {
      rank: 4,
      id: 'u-4',
      name: isAr ? 'عمر الخالد' : 'Omar Al-Khaled',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      role: 'Research Assistant',
      majorOrField: 'Data Science',
      xp: 1120,
      level: 2,
      streakDays: 8,
      badgesCount: 4,
      recentAchievement: '1K XP Scholar'
    },
    {
      rank: 5,
      id: 'u-5',
      name: isAr ? 'لينا ناصر' : 'Lina Nasser',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
      role: 'Student Engineer',
      majorOrField: 'Cyber Security',
      xp: 950,
      level: 1,
      streakDays: 5,
      badgesCount: 3,
      recentAchievement: 'Academy Pioneer'
    }
  ];

  const handleTestAwardXP = () => {
    GamificationEngine.awardXP(150, isAr ? 'إكمال تدريب سقراطي تفاعلي' : 'Completed Socratic Practice Drill', {
      perfectScore: true
    });
  };

  const handleChallengePeer = (peerName: string) => {
    toastService.show({
      type: 'success',
      title: isAr ? '⚔️ تم إرسال التحدي الأكاديمي!' : '⚔️ Academic Challenge Sent!',
      message: isAr
        ? `تم تحدي ${peerName} في منافسة "أعلى XP أسبوعية" في معمارية الوكلاء.`
        : `Challenged ${peerName} to a 7-day XP sprint in AI Systems Architecture!`,
      duration: 5000
    });
  };

  return (
    <div className="glass-panel p-6 rounded-3xl bg-[#061219]/90 border border-[#163647] space-y-8 shadow-2xl relative overflow-hidden">
      {/* Animated Live XP Floating Banner */}
      {liveXpAnimation && (
        <div className="fixed top-20 right-10 z-50 animate-bounce p-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-extrabold shadow-2xl flex items-center gap-2 border-2 border-white">
          <Sparkles className="w-6 h-6 fill-current text-white" />
          <span className="text-lg">+{liveXpAnimation} XP EARNED!</span>
        </div>
      )}

      {/* Header Banner: Level & Points */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#031520] via-[#092232] to-[#041a27] border border-cyan-500/30 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* XP & Level Info */}
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-cyan-400" />
                {isAr ? `المستوى ${currentLevel}: خبير المعماريات` : `Level ${currentLevel}: Systems Architect`}
              </span>

              <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                {streakDays} {isAr ? 'أيام متتالية' : 'Day Streak'} ({streakMultiplier}x XP)
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <h1 className="text-3xl font-extrabold text-white font-mono tracking-tight">
                {currentXp.toLocaleString()} <span className="text-sm font-sans font-semibold text-cyan-400">XP</span>
              </h1>
              <span className="text-xs text-[#82a4b3] font-mono">
                {levelProgressXp} / 1,000 XP {isAr ? 'للمستوى التالي' : 'to Level'} {currentLevel + 1}
              </span>
            </div>

            {/* Level Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 bg-[#030b10] rounded-full overflow-hidden border border-[#143242]">
                <div
                  className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-blue-500 rounded-full transition-all duration-700 shadow-md"
                  style={{ width: `${levelProgressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#7195a4] font-mono">
                <span>{isAr ? 'التقدم الحالي' : 'Progress'} {levelProgressPercent}%</span>
                <span>{nextLevelXp - currentXp} XP {isAr ? 'متبقية' : 'remaining'}</span>
              </div>
            </div>
          </div>

          {/* Quick XP Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch lg:items-end gap-3 w-full lg:w-auto">
            <Tooltip
              title={isAr ? 'سجل النقاط وتحليل XP' : 'Points History & Analytics'}
              description={isAr ? 'عرض تفاصيل كافة نقاط الخبرة المكتسبة حسب التاريخ والنشاط' : 'View detailed breakdown of earned XP points by activity and date'}
              position="bottom"
              delay={150}
            >
              <button
                onClick={() => setIsPointsHistoryOpen(true)}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-[#081822] hover:bg-[#122c3c] text-cyan-300 font-bold text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 border border-cyan-500/30"
              >
                <History className="w-4 h-4 text-cyan-400" />
                <span>{isAr ? 'سجل النقاط وتحليل XP' : 'Points History & Analytics'}</span>
              </button>
            </Tooltip>

            <Tooltip
              title={isAr ? 'المطالبة بنقاط الخبرة اليومية' : 'Claim Daily XP Bonus'}
              description={isAr ? 'إجراء تدريب يومي سريع والحصول على مكافأة +150 نقطة خبرة' : 'Complete daily quick challenge drill to claim +150 XP bonus'}
              position="bottom"
              delay={150}
            >
              <button
                onClick={handleTestAwardXP}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 border border-cyan-400/40"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{isAr ? 'كسب +150 XP الآن' : 'Claim +150 Daily XP'}</span>
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Badges & Achievements Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#143242] pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-400" />
              {isAr ? 'وسامات الإنجاز والأوسمة الأكاديمية' : 'Academic Badges & Milestone Achievements'}
            </h2>
            <p className="text-xs text-[#82a4b3] rtl-fluid-text">
              {isAr
                ? 'إكمال الاختبارات، المحافظة على السلسلة، وإتقان المعماريات يفتح وسامات معتمدة'
                : 'Earn verified badges for quiz accuracy, study streaks, and architecture mastery'}
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-500/30">
            {allBadges.filter((b) => b.dateUnlocked || userBadgeIds.has(b.id)).length} / {allBadges.length} {isAr ? 'مكتمل' : 'Unlocked'}
          </span>
        </div>

        {/* Badge Cards Grid with motion/react micro-interactions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {allBadges.map((badge) => {
            const isUnlocked = Boolean(badge.dateUnlocked || userBadgeIds.has(badge.id));
            const isCelebrating = celebratingBadgeId === badge.id;

            return (
              <Tooltip
                key={badge.id}
                title={badge.name}
                description={badge.description}
                position="top"
                delay={150}
                wrapperClassName="w-full h-full"
              >
                <motion.div
                  onClick={() => setSelectedBadge(badge)}
                  whileHover={{ scale: isUnlocked ? 1.08 : 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  animate={
                    isCelebrating
                      ? {
                          scale: [1, 1.2, 1, 1.15, 1],
                          boxShadow: [
                            '0 0 0px rgba(34, 211, 238, 0)',
                            '0 0 25px rgba(34, 211, 238, 0.9)',
                            '0 0 10px rgba(34, 211, 238, 0.4)'
                          ]
                        }
                      : {}
                  }
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`p-3.5 rounded-2xl border text-center space-y-2 cursor-pointer transition-all duration-300 flex flex-col items-center justify-between group relative overflow-hidden h-full ${
                    isUnlocked
                      ? 'bg-[#030b10] border-cyan-500/40 shadow-lg hover:border-cyan-400'
                      : 'bg-[#030b10]/40 border-[#143242] opacity-50 hover:opacity-80'
                  }`}
                >
                  {/* Glowing Pulse Accent on Unlocked Badges */}
                  {isUnlocked && (
                    <motion.div
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 bg-cyan-500/5 pointer-events-none rounded-2xl"
                    />
                  )}

                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${
                      isUnlocked ? 'bg-cyan-950/80 border border-cyan-400/30' : 'bg-[#081822] border border-[#123040]'
                    }`}>
                      {badge.icon}
                    </div>
                    {!isUnlocked && (
                      <div className="absolute -top-1 -right-1 p-1 rounded-full bg-black/80 text-[#82a4b3] border border-[#143242]">
                        <Lock className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-0.5 relative z-10">
                    <h4 className="font-bold text-[11px] text-white group-hover:text-cyan-200 transition-colors line-clamp-1">
                      {badge.name}
                    </h4>
                    <span className="text-[9px] font-mono text-[#7195a4] block truncate">
                      {isUnlocked ? (isAr ? 'مفتوح' : 'Unlocked') : (isAr ? 'مغلق' : 'Locked')}
                    </span>
                  </div>
                </motion.div>
              </Tooltip>
            );
          })}
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#143242] pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-cyan-400" />
              {isAr ? 'لوحة الصدارة الأكاديمية والتصنيف التنافسي' : 'Academic Leaderboard & Peer Rankings'}
            </h2>
            <p className="text-xs text-[#82a4b3] rtl-fluid-text">
              {isAr ? 'تنافس مع زملائك في الدفعة الأسبوعية والمجلس الأكاديمي' : 'Friendly academic competition based on XP points, study streaks, and quiz accuracy'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#030b10] p-1 rounded-xl border border-[#143242]">
            {[
              { id: 'weekly', label: isAr ? 'الدفعة الأسبوعية' : 'Weekly Cohort' },
              { id: 'global', label: isAr ? 'التصنيف العالمي' : 'Global All-Time' },
              { id: 'major', label: isAr ? 'التخصص' : 'Specialty Major' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveLeaderboardTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeLeaderboardTab === tab.id
                    ? 'bg-[#122e3e] text-white shadow-md font-semibold border border-cyan-500/30'
                    : 'text-[#799db0] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="space-y-2">
          {leaderboardData.map((entry) => (
            <div
              key={entry.id}
              className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                entry.isCurrentUser
                  ? 'bg-gradient-to-r from-cyan-950/90 to-blue-950/90 border-cyan-400/50 shadow-xl shadow-cyan-950/30'
                  : 'bg-[#030b10]/90 border-[#143242] hover:border-[#1a445a]'
              }`}
            >
              {/* Rank & User Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-extrabold text-sm shrink-0 ${
                  entry.rank === 1
                    ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg'
                    : entry.rank === 2
                    ? 'bg-slate-300 text-black'
                    : entry.rank === 3
                    ? 'bg-blue-800 text-white'
                    : 'bg-[#081822] text-[#82a4b3] border border-[#143242]'
                }`}>
                  #{entry.rank}
                </div>

                <img
                  src={entry.avatar}
                  alt={entry.name}
                  className="w-10 h-10 rounded-xl object-cover border border-cyan-500/30 shrink-0"
                />

                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white truncate">{entry.name}</h4>
                    {entry.isCurrentUser && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                        {isAr ? 'أنت' : 'YOU'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#82a4b3] truncate">{entry.role} • {entry.majorOrField}</p>
                </div>
              </div>

              {/* Stats & Challenge Button */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="font-mono font-bold text-sm text-cyan-300">{entry.xp.toLocaleString()} XP</div>
                  <div className="text-[10px] text-[#7195a4] font-mono">{entry.streakDays}d streak • Lvl {entry.level}</div>
                </div>

                {!entry.isCurrentUser ? (
                  <button
                    onClick={() => handleChallengePeer(entry.name)}
                    className="p-2 rounded-xl bg-[#061822] hover:bg-[#0e2a3b] border border-cyan-500/30 text-cyan-300 hover:text-white transition-all active:scale-95"
                    title={isAr ? 'تحدَّ هذا الزميل' : 'Challenge Peer'}
                  >
                    <Swords className="w-4 h-4 text-cyan-400" />
                  </button>
                ) : (
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <Crown className="w-4 h-4 fill-current" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Badge Modal with Scale-up & Glowing Pulse Micro-interaction */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: [0.8, 1.1, 1],
                boxShadow: [
                  '0 0 0px rgba(34, 211, 238, 0)',
                  '0 0 40px rgba(34, 211, 238, 0.6)',
                  '0 0 20px rgba(34, 211, 238, 0.25)'
                ]
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 rounded-3xl bg-[#061219] border border-cyan-500/40 max-w-sm w-full space-y-4 text-center relative shadow-2xl min-w-0"
            >
              {/* Glowing Icon Container */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-20 h-20 mx-auto rounded-3xl bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-4xl shadow-2xl shadow-cyan-500/20"
              >
                {selectedBadge.icon}
              </motion.div>

              <div className="space-y-1">
                <h3 className="font-bold text-lg text-white rtl-fluid-text">{selectedBadge.name}</h3>
                <p className="text-xs text-[#82a4b3] rtl-fluid-text">{selectedBadge.description}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#030b10] border border-[#143242] text-xs text-cyan-300 font-mono">
                {selectedBadge.dateUnlocked
                  ? isAr ? `تاريخ الفتح: ${selectedBadge.dateUnlocked}` : `Unlocked on: ${selectedBadge.dateUnlocked}`
                  : isAr ? 'وسام مغلق - أكمل المعايير لفتحه' : 'Locked Badge - Complete criteria to unlock'}
              </div>

              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Points History Modal */}
      <PointsHistoryModal
        user={user}
        isOpen={isPointsHistoryOpen}
        onClose={() => setIsPointsHistoryOpen(false)}
      />
    </div>
  );
};
