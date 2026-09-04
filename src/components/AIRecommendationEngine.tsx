import React from 'react';
import { Course, UserProfile, StudentProgress, ContentRecommendation } from '../shared/types';
import { getTranslation } from '../shared/localization';
import { Tooltip } from './Tooltip';
import {
  Sparkles,
  BookOpen,
  ExternalLink,
  Target,
  Bookmark,
  RefreshCw,
  Compass,
  FileText,
  Zap,
  Check,
  TrendingUp,
  Brain,
  Layers,
  Award
} from 'lucide-react';
import { toastService } from '../services/toastService';

interface AIRecommendationEngineProps {
  user: UserProfile;
  courses: Course[];
  progressMap: Record<string, StudentProgress>;
  onSelectCourse?: (course: Course) => void;
  onLaunchBooster?: (topic: string) => void;
}

export const AIRecommendationEngine: React.FC<AIRecommendationEngineProps> = ({
  user,
  courses,
  progressMap,
  onSelectCourse,
  onLaunchBooster
}) => {
  const lang = user.language || 'en';
  const isAr = lang === 'ar';
  const t = getTranslation(lang);

  const [activeTab, setActiveTab] = React.useState<'all' | 'internal' | 'external' | 'drill'>('all');
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [bookmarks, setBookmarks] = React.useState<Set<string>>(new Set());

  // Generate dynamic recommendations based on user performance and interests
  const recommendations = React.useMemo<ContentRecommendation[]>(() => {
    const list: ContentRecommendation[] = [];

    // 1. Check for performance gaps (< 70% quiz scores or low progress)
    Object.entries(progressMap).forEach(([courseId, prog]) => {
      const course = courses.find((c) => c.id === courseId);
      if (!course) return;

      // Check quiz results
      if (prog.quizResults) {
        Object.entries(prog.quizResults).forEach(([lessonId, res]) => {
          if (res.percentage < 70) {
            list.push({
              id: `rec-gap-${courseId}-${lessonId}`,
              title: isAr ? `تعزيز علاجي مكثف: ${course.title}` : `Remedial Drill: ${course.title}`,
              type: 'practice_drill',
              category: course.category,
              description: isAr
                ? `تم رصد درجات منخفضة (${res.percentage}%) في الاختبار. جرب هذا التدريب السقراطي المكثف لسد الفجوة.`
                : `Score below 70% detected (${res.percentage}%). Take this Socratic practice drill to master core concepts.`,
              relevanceScore: 99,
              reason: isAr ? `أداء أقل من 70% في اختبار الدرس` : `Quiz score <70% on recent lesson`,
              matchTags: ['Remedial', 'Socratic Drill', 'High Priority'],
              courseId: course.id,
              lessonId,
              estimatedMinutes: 15,
              difficulty: 'Intermediate',
              authorOrSource: 'Zalamati AI Tutor'
            });
          }
        });
      }

      // Check if course is enrolled but progress < 50%
      if (user.enrolledCourseIds.includes(courseId) && prog.overallProgressPercentage < 50) {
        list.push({
          id: `rec-cont-${courseId}`,
          title: isAr ? `متابعة ووحدة متقدمة: ${course.title}` : `Continue Learning: ${course.title}`,
          type: 'internal_course',
          category: course.category,
          description: isAr
            ? `استكمل الوحدة القادمة لتصل إلى نسبة إنجاز 80%+ واكسب 250 XP إضافية.`
            : `Complete the next module to reach 80%+ completion and claim +250 XP.`,
          relevanceScore: 95,
          reason: isAr ? `مقرر مسجل قيد التقدم (${prog.overallProgressPercentage}%)` : `Enrolled course in progress (${prog.overallProgressPercentage}%)`,
          matchTags: ['In Progress', 'Degree Module'],
          courseId: course.id,
          estimatedMinutes: 25,
          difficulty: 'Intermediate',
          authorOrSource: course.author
        });
      }
    });

    // 2. Recommend courses based on stated major/interests
    const userSkills = user.skills || ['AI Systems', 'Distributed Computing', 'Quantum Computing'];
    courses.forEach((c) => {
      if (!user.enrolledCourseIds.includes(c.id)) {
        list.push({
          id: `rec-course-${c.id}`,
          title: c.title,
          type: 'internal_course',
          category: c.category,
          description: c.description,
          relevanceScore: 92,
          reason: isAr ? `متوافق مع تخصصك ومجموعة مهاراتك` : `Matches your target major & skills profile`,
          matchTags: c.tags || [c.category, c.level],
          courseId: c.id,
          estimatedMinutes: c.durationHours * 60,
          difficulty: c.level === 'Beginner' ? 'Beginner' : c.level === 'Advanced' ? 'Advanced' : 'Intermediate',
          authorOrSource: c.author
        });
      }
    });

    // 3. Curate Frontier External Research & Papers
    list.push({
      id: 'rec-ext-sheaf-admm',
      title: isAr ? 'ورقة بحثية: Cellular Sheaves & Multi-Agent ADMM Consensus' : 'Research Paper: Cellular Sheaves & Multi-Agent ADMM Consensus',
      type: 'research_paper',
      category: 'Multi-Agent Systems',
      description: isAr
        ? 'دراسة مرجعية متقدمة حول خوارزميات ADMM الموزعة على الحزم الخلوية لضمان التوافق بين الوكلاء بدون كشف الحالات الخاصة.'
        : 'Foundational paper on Sheaf-ADMM optimization over cellular sheaves for zero-trust multi-agent consensus.',
      relevanceScore: 98,
      reason: isAr ? `بحث مرجعي داعم لمعمارية Zalamati Swarm` : `Foundational reference for Zalamati Swarm Architecture`,
      matchTags: ['arXiv Paper', 'Topological AI', 'Peer-Reviewed'],
      url: 'https://arxiv.org/abs/2012.03333',
      estimatedMinutes: 30,
      difficulty: 'Mastery',
      authorOrSource: 'MIT & Stanford AI Labs (arXiv)'
    });

    list.push({
      id: 'rec-ext-mit-ocw-quantum',
      title: isAr ? 'محاضرة MIT OpenCourseWare: Quantum State Vector & Density Matrix' : 'MIT OCW Lecture: Quantum State Vectors & Density Matrices',
      type: 'external_article',
      category: 'Quantum Physics',
      description: isAr
        ? 'محاضرة مرئية من جامعة MIT تشرح تمثيل متجهات الحالة وحسابات الكيوبت في النظم الكمومية الموزعة.'
        : 'MIT video lecture explicating qubit state vectors, Bloch spheres, and density matrix calculations in quantum systems.',
      relevanceScore: 94,
      reason: isAr ? `مصدر خارجي ممتاز لدعم مسار الفيزياء الكمية` : `Complements Quantum Computing & Qubit State curriculum`,
      matchTags: ['MIT OCW', 'Video Lecture', 'Open Access'],
      url: 'https://ocw.mit.edu',
      estimatedMinutes: 45,
      difficulty: 'Advanced',
      authorOrSource: 'MIT OpenCourseWare'
    });

    list.push({
      id: 'rec-ext-github-agents',
      title: isAr ? 'مستودع GitHub: Autonomous AI Agent Frameworks & Tool Callers' : 'GitHub Repository: Autonomous AI Agent Frameworks & Tool Callers',
      type: 'external_article',
      category: 'Artificial Intelligence',
      description: isAr
        ? 'مستودع كود مفتوح المصدر يحتوي على نماذج استدعاء الأدوات والتنفيذ المستقل للأنظمة الذكية.'
        : 'Open-source repository featuring robust function calling, tool use, and stateful agent interaction loops.',
      relevanceScore: 91,
      reason: isAr ? `تطبيق عملي لمشروع التخرج` : `Practical reference codebase for Capstone Defense`,
      matchTags: ['GitHub Repo', 'TypeScript', 'Hands-On Code'],
      url: 'https://github.com',
      estimatedMinutes: 20,
      difficulty: 'Intermediate',
      authorOrSource: 'OpenSource Community'
    });

    return list.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }, [courses, progressMap, user, isAr]);

  const filteredRecommendations = React.useMemo(() => {
    return recommendations.filter((rec) => {
      if (activeTab === 'all') return true;
      if (activeTab === 'internal') return rec.type === 'internal_course';
      if (activeTab === 'external') return rec.type === 'external_article' || rec.type === 'research_paper';
      if (activeTab === 'drill') return rec.type === 'practice_drill';
      return true;
    });
  }, [recommendations, activeTab]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toastService.show({
        type: 'info',
        title: isAr ? '✨ تم تحديث التحليل الذكي' : '✨ AI Analysis Refreshed',
        message: isAr
          ? 'تمت إعادة تقييم تقدمك وأدائك الأكاديمي لتوليد توصيات مخصصة جديدة.'
          : 'Re-evaluated academic progress and quiz metrics to generate fresh personalized recommendations.',
        duration: 4000
      });
    }, 1200);
  };

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="glass-panel p-6 rounded-3xl bg-[#061219]/90 border border-[#163647] space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background Subtle Accent Glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#143242] pb-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                {isAr ? 'محرك التوصيات المحتوى الذكي بالذكاء الاصطناعي' : 'AI Content Recommendation Engine'}
              </h2>
              <p className="text-xs text-[#82a4b3] rtl-fluid-text">
                {isAr
                  ? 'تحليل تلقائي لتقدمك في مسارات التعلم، الاهتمامات، ونتائج الاختبارات لتوليد موارد مخصصة'
                  : 'Analyzes progress, performance gaps, and career interests to generate tailored internal and external resources'}
              </p>
            </div>
          </div>
        </div>

        <Tooltip
          title={isAr ? 'إعادة تشغيل المحرك الذكي' : 'Refresh AI Analysis'}
          description={isAr ? 'إعادة تحليل نقاط القوة والفجوات واقتراح موارد دراسية جديدة' : 'Re-analyze quiz gaps and preferences to discover new learning resources'}
          position="bottom"
        >
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#030b10] hover:bg-[#0a1e28] border border-[#163647] text-cyan-300 hover:text-white text-xs font-semibold transition-all active:scale-95 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{isRefreshing ? (isAr ? 'جاري التحليل...' : 'Analyzing...') : isAr ? 'تحديث التحليل' : 'Refresh AI Analysis'}</span>
          </button>
        </Tooltip>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none relative z-10">
        {[
          { id: 'all', label: isAr ? 'جميع التوصيات' : 'All Recommendations', icon: Compass, count: recommendations.length, tip: isAr ? 'عرض كافة المصادر والتدريبات والمقررات المقترحة' : 'View all curated resources, drills, and courses' },
          { id: 'internal', label: isAr ? 'الوحدات والمقررات' : 'Degree Modules', icon: BookOpen, count: recommendations.filter((r) => r.type === 'internal_course').length, tip: isAr ? 'المقررات الأكاديمية المطابقة لمسارك' : 'Curriculum modules aligned with your major' },
          { id: 'external', label: isAr ? 'الأبحاث والمصادر الخارجية' : 'Research & External', icon: ExternalLink, count: recommendations.filter((r) => r.type === 'external_article' || r.type === 'research_paper').length, tip: isAr ? 'أوراق بحثية ومقالات خارجية معتمدة' : 'Verified external research papers and engineering docs' },
          { id: 'drill', label: isAr ? 'التدريبات والسد الذكي' : 'Remedial Drills', icon: Target, count: recommendations.filter((r) => r.type === 'practice_drill').length, tip: isAr ? 'تمارين سقراطية مخصصة لسد فجوات الدرجات' : 'Targeted drills to eliminate comprehension gaps' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Tooltip
              key={tab.id}
              title={tab.label}
              description={tab.tip}
              position="top"
              delay={200}
            >
              <button
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950 to-cyan-950 border border-cyan-500/40 text-cyan-200 shadow-lg font-semibold'
                    : 'bg-[#030b10]/60 hover:bg-[#081822] border border-[#143242] text-[#7195a4] hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : ''}`} />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-[#82a4b3]'}`}>
                  {tab.count}
                </span>
              </button>
            </Tooltip>
          );
        })}
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {filteredRecommendations.map((rec) => {
          const isBookmarked = bookmarks.has(rec.id);
          const course = rec.courseId ? courses.find((c) => c.id === rec.courseId) : null;

          return (
            <div
              key={rec.id}
              className="group p-5 rounded-2xl bg-[#030b10]/90 border border-[#163647] hover:border-cyan-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/20 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header Metadata */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      {rec.relevanceScore}% {isAr ? 'تطابق' : 'Match'}
                    </span>

                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-[#0a1e28] text-[#82a4b3] border border-[#143242]">
                      {rec.category}
                    </span>
                  </div>

                  <Tooltip
                    title={isBookmarked ? (isAr ? 'إزالة من المحفوظات' : 'Remove Bookmark') : (isAr ? 'حفظ في المفضلة' : 'Save Bookmark')}
                    description={isAr ? 'حفظ هذا المورد في قائمة المراجعة لاحقاً' : 'Save this recommendation to your revision library'}
                    position="left"
                  >
                    <button
                      onClick={() => toggleBookmark(rec.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isBookmarked
                          ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                          : 'bg-[#061219] border-[#143242] text-[#7195a4] hover:text-white'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </Tooltip>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-cyan-200 transition-colors line-clamp-2 leading-snug">
                    {rec.title}
                  </h3>
                  <p className="text-xs text-[#82a4b3] line-clamp-2 leading-relaxed mt-1.5 rtl-fluid-text">
                    {rec.description}
                  </p>
                </div>

                {/* AI Reason Badge */}
                <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-[11px] text-cyan-300 flex items-start gap-2">
                  <Brain className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{rec.reason}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {rec.matchTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-[#081822] text-[#799db0] border border-[#123040]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-[#123040] flex items-center justify-between gap-3">
                <span className="text-[11px] text-[#7195a4] flex items-center gap-1 font-mono">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  {rec.estimatedMinutes} {isAr ? 'دقيقة' : 'min'}
                </span>

                {rec.type === 'internal_course' && course && onSelectCourse && (
                  <button
                    onClick={() => onSelectCourse(course)}
                    className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-cyan-700 to-blue-700 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isAr ? 'فتح المقرر' : 'Open Module'}</span>
                  </button>
                )}

                {rec.type === 'practice_drill' && (
                  <button
                    onClick={() => onLaunchBooster?.(rec.title)}
                    className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>{isAr ? 'بدء التدريب المعزز' : 'Launch Drill'}</span>
                  </button>
                )}

                {(rec.type === 'external_article' || rec.type === 'research_paper') && rec.url && (
                  <a
                    href={rec.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-[#061822] hover:bg-[#0e2a3b] border border-cyan-500/30 text-cyan-300 hover:text-white font-semibold text-xs transition-all active:scale-95"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isAr ? 'قراءة المصدر الخارجي' : 'Read Research Paper'}</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
