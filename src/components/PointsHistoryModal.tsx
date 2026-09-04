import React from 'react';
import { UserProfile } from '../shared/types';
import { getTranslation } from '../shared/localization';
import {
  X,
  Zap,
  TrendingUp,
  BarChart2,
  BookOpen,
  Award,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PointsHistoryModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export interface XPActivityCategory {
  id: string;
  nameEn: string;
  nameAr: string;
  points: number;
  percentage: number;
  color: string;
  bgGlow: string;
  icon: React.ReactNode;
}

export interface XPTransaction {
  id: string;
  titleEn: string;
  titleAr: string;
  category: 'quizzes' | 'lessons' | 'forum' | 'practice';
  xp: number;
  date: string;
}

export const PointsHistoryModal: React.FC<PointsHistoryModalProps> = ({ user, isOpen, onClose }) => {
  const lang = user.language || 'en';
  const isAr = lang === 'ar';
  const t = getTranslation(lang);

  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  if (!isOpen) return null;

  const totalXp = user.xpPoints || user.xp || 1450;

  // Breakdown of XP by activity type
  const categories: XPActivityCategory[] = [
    {
      id: 'quizzes',
      nameEn: 'Quizzes & Exams',
      nameAr: 'الاختبارات والتقييمات',
      points: Math.round(totalXp * 0.38),
      percentage: 38,
      color: 'bg-cyan-400',
      bgGlow: 'from-cyan-500/20 to-cyan-500/10',
      icon: <Award className="w-4 h-4 text-cyan-400" />
    },
    {
      id: 'lessons',
      nameEn: 'Lessons & Modules',
      nameAr: 'الدروس والوحدات',
      points: Math.round(totalXp * 0.32),
      percentage: 32,
      color: 'bg-cyan-400',
      bgGlow: 'from-cyan-500/20 to-cyan-500/10',
      icon: <BookOpen className="w-4 h-4 text-cyan-400" />
    },
    {
      id: 'forum',
      nameEn: 'Forum & Discussions',
      nameAr: 'المنتدى والمناقشات',
      points: Math.round(totalXp * 0.16),
      percentage: 16,
      color: 'bg-cyan-400',
      bgGlow: 'from-cyan-500/20 to-cyan-500/10',
      icon: <MessageSquare className="w-4 h-4 text-cyan-400" />
    },
    {
      id: 'practice',
      nameEn: 'Extra Practice & Booster',
      nameAr: 'التدريب الإضافي والتسريع',
      points: Math.round(totalXp * 0.14),
      percentage: 14,
      color: 'bg-cyan-400',
      bgGlow: 'from-cyan-500/20 to-blue-500/10',
      icon: <Zap className="w-4 h-4 text-cyan-400" />
    }
  ];

  // Recent XP transactions log
  const transactions: XPTransaction[] = [
    {
      id: 't-1',
      titleEn: 'Completed Socratic Practice Drill on Sheaf Laplacian',
      titleAr: 'إكمال تدريب سقراطي تفاعلي حول مؤثر الشيف',
      category: 'practice',
      xp: 150,
      date: '2026-08-23 05:30'
    },
    {
      id: 't-2',
      titleEn: '100% Mastery Score on Autonomous Agent Systems Quiz',
      titleAr: 'درجة إتقان 100% في اختبار أنظمة الوكلاء المستقلة',
      category: 'quizzes',
      xp: 250,
      date: '2026-08-22 14:15'
    },
    {
      id: 't-3',
      titleEn: 'Finished Lesson: Cellular Sheaf Consensus (ADMM)',
      titleAr: 'إكمال درس: التوافق في الشيف الخلوي (ADMM)',
      category: 'lessons',
      xp: 180,
      date: '2026-08-21 09:40'
    },
    {
      id: 't-4',
      titleEn: 'Answered Peer Query on Vector Embeddings Forum',
      titleAr: 'الإجابة على استفسار زملائي في منتدى التضمينات الاتجاهية',
      category: 'forum',
      xp: 80,
      date: '2026-08-20 18:20'
    },
    {
      id: 't-5',
      titleEn: 'Completed Interactive Slide Deck: Quantum Qubits',
      titleAr: 'إكمال العرض التقديمي التفاعلي: الكيوبتات الكمومية',
      category: 'lessons',
      xp: 120,
      date: '2026-08-19 11:05'
    },
    {
      id: 't-6',
      titleEn: 'Weekly 7-Day Focus Streak Bonus',
      titleAr: 'مكافأة السلسلة الأسبوعية (7 أيام متتالية)',
      category: 'practice',
      xp: 200,
      date: '2026-08-18 20:00'
    }
  ];

  const filteredTransactions = selectedCategory === 'all'
    ? transactions
    : transactions.filter(t => t.category === selectedCategory);

  const maxCategoryPoints = Math.max(...categories.map(c => c.points));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-lg overflow-y-auto min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl bg-[#07151e] border border-[#1b3b4a] rounded-3xl p-4 sm:p-7 space-y-6 shadow-2xl relative my-auto min-w-0"
        >
          {/* Top Bar */}
          <div className="flex items-start justify-between gap-3 border-b border-[#163647] pb-4 min-w-0">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white rtl-fluid-text truncate">
                  {isAr ? 'سجل نقاط الخبرة الأكاديمية (XP)' : 'XP Points History & Analytics'}
                </h2>
              </div>
              <p className="text-xs text-[#82a4b3] rtl-fluid-text">
                {isAr
                  ? 'تصنيف ومتابعة النقاط المكتسبة حسب نوع النشاط الأكاديمي والمهام'
                  : 'Detailed breakdown of earned XP categorized by learning activities and milestones'}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#0c1a24] hover:bg-[#142e3d] text-slate-400 hover:text-white border border-[#163647] transition-all shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Total XP Summary Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#081822] via-[#0d2636] to-[#081822] border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 min-w-0">
            <div className="space-y-1 text-center sm:text-right min-w-0">
              <span className="text-xs font-mono font-medium text-[#73A5AD]">
                {isAr ? 'إجمالي النقاط المكتسبة' : 'Total Earned XP'}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-center justify-center sm:justify-start gap-2">
                <span>{totalXp.toLocaleString()}</span>
                <span className="text-xs font-sans text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30">
                  +{user.streakDays || 7}d {isAr ? 'سلسلة' : 'Streak'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-center min-w-0">
              <div className="text-center px-3.5 py-2 rounded-xl bg-[#030b10] border border-[#143242] shrink-0">
                <span className="text-[10px] font-mono text-[#82a4b3] block">{isAr ? 'الأنشطة المكتملة' : 'Activities'}</span>
                <span className="font-mono font-bold text-sm text-cyan-300">24 {isAr ? 'نشاطاً' : 'Total'}</span>
              </div>
              <div className="text-center px-3.5 py-2 rounded-xl bg-[#030b10] border border-[#143242] shrink-0">
                <span className="text-[10px] font-mono text-[#82a4b3] block">{isAr ? 'متوسط يومي' : 'Daily Avg'}</span>
                <span className="font-mono font-bold text-sm text-cyan-400">+125 XP</span>
              </div>
            </div>
          </div>

          {/* Categorized Bar Chart */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>{isAr ? 'توزيع النقاط حسب نوع النشاط' : 'XP Distribution by Activity Type'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
              {categories.map((cat) => {
                const barWidthPercent = Math.max(10, Math.round((cat.points / maxCategoryPoints) * 100));

                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer min-w-0 ${
                      selectedCategory === cat.id
                        ? 'bg-[#0d2636] border-cyan-400 shadow-lg'
                        : 'bg-[#051119] border-[#143242] hover:border-[#1e485e]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="p-1.5 rounded-lg bg-[#030b10] border border-[#143242] shrink-0">
                          {cat.icon}
                        </div>
                        <span className="font-semibold text-xs text-white rtl-fluid-text truncate">
                          {isAr ? cat.nameAr : cat.nameEn}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-xs text-cyan-300 shrink-0">
                        {cat.points} XP <span className="text-[10px] text-[#82a4b3]">({cat.percentage}%)</span>
                      </span>
                    </div>

                    {/* Simple Bar */}
                    <div className="w-full h-2.5 bg-[#030b10] rounded-full overflow-hidden border border-[#143242]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidthPercent}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className={`h-full ${cat.color} rounded-full`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Category Filter Tabs & Log */}
          <div className="space-y-3 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap border-b border-[#143242] pb-2 min-w-0">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>{isAr ? 'سجل العمليات والمهام المنجزة' : 'Recent Activity Transactions'}</span>
              </h3>

              {/* Filter Buttons */}
              <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar py-1 min-w-0">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 ${
                    selectedCategory === 'all'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                      : 'text-[#82a4b3] hover:text-white'
                  }`}
                >
                  {isAr ? 'الكل' : 'All'}
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 ${
                      selectedCategory === c.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                        : 'text-[#82a4b3] hover:text-white'
                    }`}
                  >
                    {isAr ? c.nameAr : c.nameEn}
                  </button>
                ))}
              </div>
            </div>

            {/* List of transactions */}
            <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1 min-w-0">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl bg-[#030b10]/80 border border-[#143242] hover:border-[#1a445a] flex items-center justify-between gap-3 transition-all min-w-0"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-lg bg-[#081822] border border-[#163647] shrink-0 text-cyan-400">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <h4 className="font-semibold text-xs text-white rtl-fluid-text truncate">
                        {isAr ? tx.titleAr : tx.titleEn}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-[#7195a4] font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#7195a4]" />
                          {tx.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="font-mono font-extrabold text-xs text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-500/30 shrink-0">
                    +{tx.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end pt-2 border-t border-[#143242] min-w-0">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
            >
              {isAr ? 'تم والإغلاق' : 'Done & Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
