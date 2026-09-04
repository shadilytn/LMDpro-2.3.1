import React from "react";
import { ThemedCourseImage } from "./ThemedCourseImage";
import { D3LearningPathMap } from "./D3LearningPathMap";
import { AdaptiveLearningPathAdvisor } from "./AdaptiveLearningPathAdvisor";
import { DashboardCustomizerModal } from "./DashboardCustomizerModal";
import { AIDiscoveryFeed } from "./AIDiscoveryFeed";
import { GamificationDashboard } from "./GamificationDashboard";
import { AIRecommendationEngine } from "./AIRecommendationEngine";
import { MyBookmarksTab } from "./MyBookmarksTab";
import { Tooltip } from "./Tooltip";
import { WeeklyStudyGrid } from "./WeeklyStudyGrid";
import {
  Course,
  UserProfile,
  StudentProgress,
  Certificate,
  AdaptiveLevel,
  DashboardWidgetConfig,
} from "../shared/types";
import { triggerConfetti } from "../utils/confetti";
import { QuickNotesOverlay } from "./QuickNotesOverlay";
import { StreakCounter } from "./StreakCounter";
import { DashboardCardGrid, DashboardCard } from "./DashboardCard";
import { getTranslation, getLocalizedCourse, localizeText } from "../shared/localization";
import { SmartSortEngine, SmartSortMode, SmartSortScoreResult } from "../services/SmartSortEngine";
import {
  BookOpen,
  Play,
  CheckCircle2,
  Award,
  Sparkles,
  Zap,
  TrendingUp,
  Brain,
  Download,
  Clock,
  ChevronRight,
  ShieldCheck,
  Star,
  Target,
  Flame,
  FolderSync,
  FileText,
  CheckSquare,
  LayoutGrid,
  Compass,
  Activity,
  ArrowUpDown,
  SlidersHorizontal,
  Layers,
  AlertCircle,
  HelpCircle,
  Bookmark,
  Layout,
} from "lucide-react";
import { WorkspaceDashboard } from "./WorkspaceDashboard";

interface StudentDashboardProps {
  user: UserProfile;
  courses: Course[];
  progressMap: Record<string, StudentProgress>;
  certificates: Certificate[];
  onSelectCourse: (course: Course) => void;
  onOpenCertificate: (cert: Certificate) => void;
  onOpenAITutor: () => void;
  onOpenCourseGenerator: () => void;
  onOpenClassroomModal?: () => void;
  onOpenAuthModal?: () => void;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
  onNavigateTab?: (tab: string) => void;
  isAssistantEnabled: boolean;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  courses,
  progressMap,
  certificates,
  onSelectCourse,
  onOpenCertificate,
  onOpenAITutor,
  onOpenClassroomModal,
  onOpenAuthModal,
  onUpdateUser,
  onNavigateTab,
}) => {
  const lang = user.language || "en";
  const isAr = lang === "ar";
  const t = getTranslation(lang);

  const [filterCategory, setFilterCategory] = React.useState<string>("all");
  const [workspaceMsg, setWorkspaceMsg] = React.useState<string | null>(null);
  const [showGoalModal, setShowGoalModal] = React.useState(false);
  const [showCustomizer, setShowCustomizer] = React.useState(false);
  const [goalInput, setGoalInput] = React.useState<number>(user.dailyStudyGoal || 60);
  const [studyMinutesCompleted, setStudyMinutesCompleted] = React.useState(45);

  // Smart Sort state
  const [smartSortMode, setSmartSortMode] = React.useState<SmartSortMode>("ai_priority");
  const [smartSortEnabled, setSmartSortEnabled] = React.useState<boolean>(true);
  const [courseSortBy, setCourseSortBy] = React.useState<'smart' | 'progress' | 'rating' | 'duration' | 'alphabetical'>('smart');

  const dailyGoalMinutes = user.dailyStudyGoal || 60;

  // Localized courses list
  const localizedCourses = React.useMemo(() => {
    return courses.map((c) => getLocalizedCourse(c, lang));
  }, [courses, lang]);

  const defaultWidgets: DashboardWidgetConfig[] = [
    { id: "quick_stats", title: isAr ? "شريط الإحصائيات والمقاييس السريعة" : "Quick Stats & Metrics Bar", visible: true, order: 0 },
    { id: "streak_counter", title: isAr ? "عداد الأيام والهدف اليومي" : "Streak Counter & Daily Goal", visible: true, order: 1 },
    { id: "gamification_hub", title: isAr ? "مركز التحفيز والإنجازات واللوحة التنافسية" : "Gamification, Points & Leaderboard Hub", visible: true, order: 2 },
    { id: "ai_recommendations", title: isAr ? "محرك التوصيات الأكاديمية بالذكاء الاصطناعي" : "AI Personalized Recommendation Engine", visible: true, order: 3 },
    { id: "d3_learning_path", title: isAr ? "خريطة مسارات التعلم التفاعلية D3" : "D3 Interactive Learning Path Map", visible: true, order: 4 },
    { id: "ai_discovery_feed", title: isAr ? "موجز الاكتشافات الأكاديمية وسد الفجوات المعرفية" : "AI Academic Discovery Feed & Knowledge Gaps", visible: true, order: 5 },
    { id: "weekly_summary", title: isAr ? "ملخص التعلم الأسبوعي" : "Weekly Learning Summary", visible: true, order: 6 },
    { id: "challenge_arena", title: isAr ? "ساحة التحديات والمنافسة الأكاديمية" : "Challenge Arena", visible: true, order: 7 },
    { id: "recent_activity", title: isAr ? "النشاط الأخير ومتابعة الدروس" : "Recent Activity & Lesson Progress", visible: true, order: 8 },
    { id: "upcoming_deadlines", title: isAr ? "المواعيد والمهام القادمة" : "Upcoming Deadlines & Schedule", visible: true, order: 9 },
    { id: "my_bookmarks", title: isAr ? "علاماتي المرجعية والمحفوظات" : "My Bookmarked Lessons & Saved Topics", visible: true, order: 10 },
    { id: "enrolled_courses", title: isAr ? "شبكة المقررات المسجلة والموصى بها" : "Enrolled & Recommended Courses Grid", visible: true, order: 11 },
    { id: "google_workspace", title: isAr ? "مساحة عمل Google والملفات السحابية" : "Google Workspace & Cloud Files", visible: true, order: 12 },
  ];

  const widgetConfig = user.dashboardWidgets && user.dashboardWidgets.length > 0
    ? [...user.dashboardWidgets].sort((a, b) => a.order - b.order)
    : defaultWidgets;

  // Compute Smart Sort Order & Scores
  const { widgets: orderedWidgets, scoresMap } = React.useMemo(() => {
    return SmartSortEngine.getSmartOrderedWidgets(
      widgetConfig,
      user,
      courses,
      progressMap,
      smartSortMode,
      smartSortEnabled
    );
  }, [widgetConfig, user, courses, progressMap, smartSortMode, smartSortEnabled]);

  const topPriorityWidget = React.useMemo(() => {
    const top = orderedWidgets.find((w) => w.visible);
    return top ? scoresMap.get(top.id) : null;
  }, [orderedWidgets, scoresMap]);

  const isWidgetVisible = (id: string) => {
    const w = widgetConfig.find((item) => item.id === id);
    return w ? w.visible : true;
  };

  const handleExportWorkspace = (docType: "docs" | "sheets", title: string) => {
    setWorkspaceMsg(
      isAr
        ? `تم تصدير "${title}" إلى Google ${docType === "docs" ? "Docs" : "Sheets"} بنجاح!`
        : `Exported "${title}" to Google ${docType === "docs" ? "Docs" : "Sheets"}!`,
    );
    setTimeout(() => setWorkspaceMsg(null), 3000);
  };

  const filteredCourses = React.useMemo(() => {
    const base = localizedCourses.filter((c) => {
      if (filterCategory === "all") return true;
      if (filterCategory === "enrolled")
        return user.enrolledCourseIds.includes(c.id);
      if (filterCategory === "ai") return c.isAiGenerated;
      return c.category.toLowerCase().includes(filterCategory.toLowerCase());
    });
    return SmartSortEngine.sortCourses(base, user, progressMap, courseSortBy);
  }, [localizedCourses, filterCategory, user, progressMap, courseSortBy]);

  // Recent completed lessons collection with progress percentage
  const recentCompleted: { courseTitle: string; lessonTitle: string; percent: number }[] = [];
  Object.entries(progressMap).forEach(([courseId, prog]) => {
    const course = localizedCourses.find((c) => c.id === courseId);
    if (course && prog?.completedLessonIds) {
      const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
      const percent = totalLessons > 0 ? Math.round((prog.completedLessonIds.length / totalLessons) * 100) : 0;
      prog.completedLessonIds.forEach((lesId) => {
        for (const mod of course.modules) {
          const les = mod.lessons.find((l) => l.id === lesId);
          if (les) {
            recentCompleted.push({
              courseTitle: course.title,
              lessonTitle: les.title,
              percent,
            });
          }
        }
      });
    }
  });
  const last3CompletedLessons = recentCompleted.slice(-3).reverse();

  const getAdaptiveBadge = (level: AdaptiveLevel) => {
    switch (level) {
      case "remedial":
        return {
          label: isAr ? "مسار الدعم والتعزيز" : "Remedial Support Track",
          color: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
        };
      case "standard":
        return {
          label: isAr ? "المسار الأكاديمي القياسي" : "Standard Track",
          color: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
        };
      case "accelerated":
        return {
          label: isAr ? "المسار المتقدم المتسارع" : "Accelerated Pace",
          color: "bg-cyan-600/10 text-cyan-400 border-cyan-600/30",
        };
      case "mastery":
        return {
          label: isAr ? "مستوى التمكن والخبرة القصوى" : "Expert Mastery Level",
          color: "bg-cyan-700/10 text-cyan-500 border-cyan-700/30",
        };
      default:
        return {
          label: isAr ? "المسار الأكاديمي القياسي" : "Standard Track",
          color: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
        };
    }
  };

  const badgeInfo = getAdaptiveBadge(user.learningLevel);

  const defaultBadges = user.badges || [
    {
      id: "b1",
      name: "AI Scholar",
      icon: "🤖",
      description: "Mastered 3 AI & Agentic Modules",
      category: "ai",
      dateUnlocked: "Today",
    },
    {
      id: "b2",
      name: "7-Day Streak",
      icon: "🔥",
      description: "Maintained 7 consecutive daily study sessions",
      category: "streak",
      dateUnlocked: "Yesterday",
    },
    {
      id: "b3",
      name: "Degree Defender",
      icon: "🎓",
      description: "Passed capstone evaluation defense",
      category: "mastery",
      dateUnlocked: "2 days ago",
    },
  ];

  const defaultMilestones = user.milestones || [
    {
      id: "m1",
      title: "Earn 1,000 XP Points",
      targetXP: 1000,
      achieved: user.xpPoints >= 1000,
      reward: "Level 2 Unlocked",
    },
    {
      id: "m2",
      title: "Complete 5 Degree Modules",
      targetXP: 2500,
      achieved: user.xpPoints >= 2500,
      reward: "Golden Badge",
    },
    {
      id: "m3",
      title: "Publish Research Paper to Docs",
      targetXP: 5000,
      achieved: false,
      reward: "Academic Citation",
    },
  ];

  // Calculate aggregate progress / curriculum mastery percentage cleanly
  const calculatedMasteryRate = React.useMemo(() => {
    if (!courses || courses.length === 0) return 76;
    let totalLessons = 0;
    let completedLessons = 0;
    courses.forEach((c) => {
      if (user.enrolledCourseIds?.includes(c.id)) {
        const cProg = progressMap[c.id];
        const count = c.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
        totalLessons += count;
        completedLessons += cProg?.completedLessonIds?.length || 0;
      }
    });
    if (totalLessons === 0) return user.learningLevel === "accelerated" ? 88 : 76;
    return Math.round((completedLessons / totalLessons) * 100) || (user.learningLevel === "accelerated" ? 88 : 76);
  }, [courses, user.enrolledCourseIds, progressMap, user.learningLevel]);

  return (
    <div className="space-y-8 pb-12 animate-fade-in relative z-10">
      {/* 1. Welcome & Stats Overview Banner (Black Theme with 2-Color Gradient Glow) */}
      <div
        className="relative overflow-hidden rounded-3xl bg-[#061219]/90 backdrop-blur-xl border border-[#163647] p-6 md:p-8 shadow-2xl"
        role="region"
        aria-label="Scholar Profile Overview"
      >
        {/* Animated Geometrical Line Overlay in Card */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none hidden md:block">
          <svg className="w-full h-full" viewBox="0 0 400 300" fill="none">
            <polygon
              points="300,50 380,100 380,200 300,250 220,200 220,100"
              stroke="#06b6d4"
              strokeWidth="1"
              strokeDasharray="6 4"
            />
            <polygon
              points="300,80 350,110 350,180 300,210 250,180 250,110"
              stroke="#14b8a6"
              strokeWidth="1.5"
            />
            <circle
              cx="300"
              cy="150"
              r="30"
              stroke="#22d3ee"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full border ${badgeInfo.color}`}
              >
                {badgeInfo.label}
              </span>
              <span className="text-xs text-[#789cae] flex items-center gap-1">
                <Brain className="w-3.5 h-3.5 text-cyan-400" />
                {isAr ? "محرك الذكاء الاصطناعي المتكيف مفعّل" : "Adaptive AI Engine Active"}
              </span>
              {user.workspaceConnected && (
                <span className="text-xs text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  {isAr ? "متصل بـ Google Workspace" : "Google Workspace Linked"}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isAr ? "مرحباً بعودتك، " : "Welcome back, "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                {user.name}
              </span>
              !
            </h1>

            <p className="text-sm text-[#87a9b8] leading-relaxed">
              {isAr
                ? `المسار الأكاديمي مهيأ لمستوى الإتقان ${user.level || 1}. المرحلة المستهدفة:`
                : `Academic path configured for Level ${user.level || 1} mastery. Target milestone:`}{" "}
              <strong className="text-cyan-200">
                {isAr ? "الأنظمة المستقلة وسوارب الوكلاء المتعددين" : "Autonomous Agentic Systems & Multi-Agent Swarms"}
              </strong>
              .
            </p>

            {/* Horizontal Stats Row - Refined High-Contrast Accessible Bento Tiles without awkward truncation */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 pt-2">
              <Tooltip
                title={isAr ? "معدل الإتقان العام" : "Overall Mastery Rate"}
                description={isAr ? "نسبة إتمام الدروس والمفاهيم بناءً على أدائك في الاختبارات" : "Percentage of completed lessons and conceptual grasp based on quiz scores"}
                position="top"
                delay={150}
              >
                <div className="bg-[#030b10] border border-[#143242] p-2.5 sm:p-3 rounded-2xl flex flex-col justify-between min-w-0 shadow-sm cursor-help hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                    <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-extrabold font-mono tracking-tight">{calculatedMasteryRate}%</span>
                  </div>
                  <div className="text-[10px] sm:text-xs text-[#87a9b8] font-medium leading-none mt-1">
                    {isAr ? "معدل الإتقان" : "Mastery Rate"}
                  </div>
                </div>
              </Tooltip>

              <Tooltip
                title={isAr ? "المرتبة الأكاديمية" : "Academic Rank"}
                description={isAr ? `المستوى الحالي ${user.level || 1} • يمكنك رفع مستواك بإكمال المزيد من الأنشطة` : `Current tier Level ${user.level || 1} • Complete lessons and assessments to level up`}
                position="top"
                delay={150}
              >
                <div className="bg-[#030b10] border border-[#143242] p-2.5 sm:p-3 rounded-2xl flex flex-col justify-between min-w-0 shadow-sm cursor-help hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-extrabold font-mono tracking-tight">{isAr ? `المستوى ${user.level || 1}` : `Lvl ${user.level || 1}`}</span>
                  </div>
                  <div className="text-[10px] sm:text-xs text-[#87a9b8] font-medium leading-none mt-1">
                    {isAr ? "المرتبة الأكاديمية" : "Academic Rank"}
                  </div>
                </div>
              </Tooltip>

              <Tooltip
                title={isAr ? "الشهادات المكتسبة" : "Earned Certificates"}
                description={isAr ? `${certificates.length} شهادات موثقة متوفرة في خزنة الشهادات` : `${certificates.length} verified academic certificates in your credentials locker`}
                position="top"
                delay={150}
              >
                <div className="bg-[#030b10] border border-[#143242] p-2.5 sm:p-3 rounded-2xl flex flex-col justify-between min-w-0 shadow-sm cursor-help hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                    <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-extrabold font-mono tracking-tight">{certificates.length}</span>
                  </div>
                  <div className="text-[10px] sm:text-xs text-[#87a9b8] font-medium leading-none mt-1">
                    {isAr ? "الشهادات" : "Certificates"}
                  </div>
                </div>
              </Tooltip>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
              <Tooltip
                title={isAr ? "طباعة / تصدير التقرير" : "Export / Print Report"}
                description={isAr ? "تصدير وطباعة تقرير الأداء الأكاديمي الشامل بصيغة PDF" : "Print or save a formatted comprehensive PDF summary of your academic metrics"}
                position="bottom"
                delay={150}
              >
                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0a1e28] hover:bg-[#122e3e] text-white border border-[#183d52] font-medium text-xs shadow-md transition-all truncate"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{isAr ? "تصدير التقرير" : "Export Report"}</span>
                </button>
              </Tooltip>

              {onOpenAuthModal && (
                <Tooltip
                  title={isAr ? "مزامنة Google Workspace" : "Google Workspace Sync"}
                  description={isAr ? "ربط الحساب مع Google Drive و Docs لتصدير المذكرات وخطط الدراسة" : "Connect Google Drive & Docs to auto-export study notes and schedules"}
                  position="bottom"
                  delay={150}
                >
                  <button
                    onClick={onOpenAuthModal}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0a1e28] hover:bg-[#122e3e] text-white border border-[#183d52] font-medium text-xs shadow-md transition-all truncate"
                  >
                    <FolderSync className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{isAr ? "مزامنة مساحة العمل" : "Workspace Sync"}</span>
                  </button>
                </Tooltip>
              )}

              {onOpenClassroomModal && (
                <Tooltip
                  title={isAr ? "فصول Google Classroom" : "Google Classroom"}
                  description={isAr ? "مزامنة التكليفات والواجبات المدرسية مباشرة مع الفصول" : "Sync assignments and course materials with Google Classroom"}
                  position="bottom"
                  delay={150}
                >
                  <button
                    onClick={onOpenClassroomModal}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0a1e28] hover:bg-[#122e3e] text-cyan-300 border border-cyan-500/30 font-medium text-xs shadow-md transition-all truncate"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{isAr ? "الفصل الدراسي" : "Classroom"}</span>
                  </button>
                </Tooltip>
              )}

              {onNavigateTab && (
                <>
                  <Tooltip
                    title={isAr ? "التنسيق بالذكاء الاصطناعي" : "AI Curation"}
                    description={isAr ? "اكتشاف مصادر خارجية ومقالات ومقاطع فيديو منتقاة ذكياً" : "Discover AI-curated external articles, videos, and tutorials"}
                    position="bottom"
                    delay={150}
                  >
                    <button
                      onClick={() => onNavigateTab("curation")}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0a1e28] hover:bg-[#122e3e] text-cyan-300 border border-cyan-500/30 font-medium text-xs shadow-md transition-all truncate"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{isAr ? "التنسيق بالذكاء الاصطناعي" : "AI Curation"}</span>
                    </button>
                  </Tooltip>

                  <Tooltip
                    title={isAr ? "لوحة المتصدرين والتنافس" : "Gamification Leaderboard"}
                    description={isAr ? "استعرض ترتيبك بين الطلاب والشارات والتحديات اليومية" : "View your rank, badges, study streaks, and daily quests"}
                    position="bottom"
                    delay={150}
                  >
                    <button
                      onClick={() => onNavigateTab("leaderboard")}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0a1e28] hover:bg-[#122e3e] text-cyan-300 border border-cyan-500/30 font-medium text-xs shadow-md transition-all truncate"
                    >
                      <Award className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{isAr ? "لوحة المتصدرين" : "Leaderboard"}</span>
                    </button>
                  </Tooltip>
                </>
              )}
            </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 w-full lg:w-48 shrink-0">
            <Tooltip
              title={isAr ? "جلسة المعلم السقراطي الذكي" : "Socratic AI Tutor"}
              description={isAr ? "بدء محادثة صوتية أو نصية تفاعلية مع المعلم الذكي لحل المسائل والشرح" : "Launch live interactive dialogue with Petra & Nashmi to explore concepts"}
              position="left"
              delay={150}
              wrapperClassName="w-full"
            >
              <button
                onClick={onOpenAITutor}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-700 to-cyan-500 hover:from-cyan-600 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-950/50 transition-all active:scale-95 border border-cyan-400/30"
              >
                <Sparkles className="w-4 h-4 text-cyan-100" />
                <span>{isAr ? "جلسة المعلم الذكي" : "AI Tutor Session"}</span>
              </button>
            </Tooltip>

            <Tooltip
              title={isAr ? "تخصيص لوحة التحكم" : "Customize Dashboard"}
              description={isAr ? "إظهار أو إخفاء بطاقات لوحة التحكم وإعادة ترتيب العناصر" : "Toggle and rearrange widget cards on your personal dashboard"}
              position="left"
              delay={150}
              wrapperClassName="w-full"
            >
              <button
                onClick={() => setShowCustomizer(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#091b24] hover:bg-[#122e3d] text-cyan-300 border border-cyan-500/30 font-semibold text-xs shadow-md transition-all active:scale-95"
              >
                <LayoutGrid className="w-4 h-4 text-cyan-400" />
                <span>{isAr ? "تخصيص الواجهة" : "Customize View"}</span>
              </button>
            </Tooltip>
          </div>
        </div>
        </div>
      </div>

      {workspaceMsg && (
        <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-200 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{workspaceMsg}</span>
        </div>
      )}

      {/* Smart Sort & Layout Control Hub */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#061219]/90 border border-cyan-500/30 shadow-xl space-y-3.5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-950/90 text-cyan-300 border border-cyan-400/40">
                <span className="relative flex h-2 w-2">
                  {smartSortEnabled && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${smartSortEnabled ? "bg-cyan-400" : "bg-slate-500"}`}></span>
                </span>
                {isAr ? "محرك الترتيب الذكي المتكيف" : "Smart Sort AI Engine"}
              </span>
              <span className="text-[11px] text-cyan-400 font-mono">
                {smartSortEnabled
                  ? isAr ? "ترتيب ديناميكي حسب الأولويات" : "Dynamic Cognitive Ordering Active"
                  : isAr ? "ترتيب يدوي مخصص" : "Manual Layout Active"}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-cyan-400" />
              {isAr ? "الترتيب الذكي وتخصيص بطاقات لوحة التحكم" : "Smart Sort & Dashboard Prioritization"}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Smart Sort Enable/Disable Toggle */}
            <Tooltip
              title={smartSortEnabled ? (isAr ? "تعطيل الترتيب الذكي" : "Disable Smart Sort") : (isAr ? "تفعيل الترتيب الذكي" : "Enable Smart Sort")}
              description={isAr ? "إعادة ترتيب البطاقات تلقائياً استناداً لمعدلات الإنجاز والمواعيد النهائية والاحتفاظ المعرفي" : "Automatically reorder dashboard widgets based on deadlines, engagement, and learning gaps"}
              position="bottom"
              delay={150}
            >
              <button
                onClick={() => setSmartSortEnabled(!smartSortEnabled)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  smartSortEnabled
                    ? "bg-cyan-950/80 border-cyan-400/60 text-cyan-200 shadow-md shadow-cyan-950/50"
                    : "bg-[#091b24] border-[#163647] text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${smartSortEnabled ? "text-cyan-400" : "text-slate-400"}`} />
                <span>{smartSortEnabled ? (isAr ? "الترتيب الذكي: مفعّل" : "Smart Sort: ON") : (isAr ? "الترتيب الذكي: معطل" : "Smart Sort: OFF")}</span>
              </button>
            </Tooltip>

            {/* Customize Layout Modal Trigger */}
            <Tooltip
              title={isAr ? "تخصيص ترتيب وإخفاء البطاقات" : "Customize & Reorder Widgets"}
              description={isAr ? "فتح نافذة التخصيص الكاملة لتحديد العناصر المرئية ومستويات الترتيب" : "Open the full dashboard customizer modal to manage visibility and order"}
              position="bottom"
              delay={150}
            >
              <button
                onClick={() => setShowCustomizer(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#091b24] hover:bg-[#122e3d] text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all shadow-sm active:scale-95"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isAr ? "تخصيص الواجهة" : "Customize Layout"}</span>
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Mode Selector Pill Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#132f3e]">
          <span className="text-[11px] text-[#789cae] mr-1 hidden sm:inline-block">
            {isAr ? "نمط الترتيب:" : "Sort Mode:"}
          </span>
          {[
            {
              id: "ai_priority" as SmartSortMode,
              label: isAr ? "🤖 الأولوية الذكية (AI)" : "🤖 AI Priority",
              desc: isAr ? "موازنة شاملة بين المواعيد النهائية، أهداف الاستبقاء، وحالة السلسلة اليومية" : "Optimized multi-variable weighting (Deadlines, Gaps, Progress & Streak)",
            },
            {
              id: "deadlines" as SmartSortMode,
              label: isAr ? "⏳ المواعيد والمهام العاجلة" : "⏳ Deadline Urgency",
              desc: isAr ? "تقديم مشاريع التخرج والاختبارات القريبة إلى أعلى لوحة التحكم" : "Puts Capstones, quizzes, and urgent milestones at the very top",
            },
            {
              id: "engagement" as SmartSortMode,
              label: isAr ? "🔥 التفاعل والسلسلة اليومية" : "🔥 Daily Streak & Goals",
              desc: isAr ? "تقديم عداد الأيام ونقاط الخبرة واللوحة التنافسية للتحفيز" : "Puts daily study goals, streak counter, and gamification first",
            },
            {
              id: "manual" as SmartSortMode,
              label: isAr ? "⚙️ الترتيب اليدوي" : "⚙️ Custom Order",
              desc: isAr ? "الاعتماد التام على الترتيب المخصص الذي قمت بحفظه في لوحة التخصيص" : "Strictly follows your saved custom layout order",
            },
          ].map((modeItem) => (
            <Tooltip
              key={modeItem.id}
              title={modeItem.label}
              description={modeItem.desc}
              position="top"
              delay={200}
            >
              <button
                onClick={() => {
                  setSmartSortMode(modeItem.id);
                  if (!smartSortEnabled && modeItem.id !== "manual") {
                    setSmartSortEnabled(true);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  smartSortMode === modeItem.id && (smartSortEnabled || modeItem.id === "manual")
                    ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/50 shadow-sm font-semibold"
                    : "bg-[#030b10] text-[#799db0] hover:text-white hover:bg-white/5 border border-[#143242]"
                }`}
              >
                {modeItem.label}
              </button>
            </Tooltip>
          ))}
        </div>

        {/* Priority Reason Callout */}
        {smartSortEnabled && topPriorityWidget && (
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/25 text-xs text-cyan-200 animate-fade-in">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
            <div className="flex-1 min-w-0">
              <span className="font-bold text-cyan-300 mr-1.5">{isAr ? "التركيز الأبرز الآن:" : "AI Focus Priority:"}</span>
              <span className="text-[#a0c6d7]">{topPriorityWidget.priorityReason}</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 shrink-0">
              {isAr ? `نقاط: ${topPriorityWidget.score}` : `Score: ${topPriorityWidget.score}`}
            </span>
          </div>
        )}
      </div>

      {/* AI Career & Industry Insights Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#071822] via-[#092230] to-[#071924] border border-cyan-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />
        <div className="space-y-1.5 z-10 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
              {isAr ? "ذكاء المسار المهني" : "AI Career Intelligence"}
            </span>
            <span className="text-xs text-cyan-400 font-mono">
              {isAr ? "تطابق مهارات بنسبة 98%" : "98% Skill Match Detected"}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            {isAr ? "مهندس معماري لأنظمة الذكاء الاصطناعي المستقلة والوكلاء" : "Autonomous AI & Agentic Systems Architect"}
          </h3>
          <p className="text-xs text-[#8cb0c2] leading-relaxed">
            {isAr
              ? "يُظهر تقدمك في ذكاء الأسراب وفهرسة RAG كفاءة عالية في هندسة أنظمة الذكاء الاصطناعي للمؤسسات. استكشف خريطة المسار المهني ومعايير الرواتب والسيناريوهات التطبيقية."
              : "Your progress in Swarm Intelligence and RAG Indexing indicates high aptitude for enterprise AI Systems engineering. View career roadmap, salary benchmarks, and tailored practical exam scenarios."}
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0 w-full sm:w-auto">
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab("career_advisor")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-black font-bold text-xs shadow-lg shadow-cyan-950/60 transition-all active:scale-95"
            >
              <Compass className="w-4 h-4 text-black" />
              <span>{isAr ? "استكشاف المستشار المهني الذكي" : "Explore AI Career Advisor"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Ordered Widgets Loop */}
      {orderedWidgets
        .filter((w) => w.visible)
        .map((widget) => {
          switch (widget.id) {
            case "quick_stats":
              return (
                <DashboardCardGrid key={widget.id} cols={{ sm: 2, lg: 4 }} gap="sm" lang={user.language} className="dashboard-stats-grid">
                  <div className="p-3.5 sm:p-5 rounded-2xl bg-[#061219]/90 border border-[#163647] space-y-1 shadow-lg w-full min-w-0">
                    <div className="flex items-center justify-between text-[11px] sm:text-xs text-[#82a4b3]">
                      <span className="truncate">{isAr ? "مجموع نقاط الخبرة" : "Total XP"}</span>
                      <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
                    </div>
                    <div className="text-lg sm:text-2xl font-extrabold text-white font-mono truncate">
                      {user.xpPoints || user.xp || 1240} {isAr ? "نقطة" : "XP"}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-cyan-400 font-medium truncate">
                      {isAr ? "+180 نقطة اليوم" : "+180 XP today"}
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-5 rounded-2xl bg-[#061219]/90 border border-[#163647] space-y-1 shadow-lg w-full min-w-0">
                    <div className="flex items-center justify-between text-[11px] sm:text-xs text-[#82a4b3]">
                      <span className="truncate">{isAr ? "سلسلة الأيام المتتالية" : "Study Streak"}</span>
                      <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
                    </div>
                    <div className="text-lg sm:text-2xl font-extrabold text-white font-mono truncate">
                      {user.streakDays || 7} {isAr ? "أيام" : "Days"}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-cyan-400 font-medium truncate">
                      {isAr ? "الأفضل: 14 يوماً" : "Best: 14 Days"}
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-5 rounded-2xl bg-[#061219]/90 border border-[#163647] space-y-1 shadow-lg w-full min-w-0">
                    <div className="flex items-center justify-between text-[11px] sm:text-xs text-[#82a4b3]">
                      <span className="truncate">{isAr ? "وقت التركيز" : "Focus Time"}</span>
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
                    </div>
                    <div className="text-lg sm:text-2xl font-extrabold text-white font-mono truncate">
                      {user.totalFocusMinutes || 480}{isAr ? " د" : "m"}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-cyan-300 font-medium truncate">
                      {isAr ? "8 ساعات عمل عميق" : "8h deep work"}
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-5 rounded-2xl bg-[#061219]/90 border border-[#163647] space-y-1 shadow-lg w-full min-w-0">
                    <div className="flex items-center justify-between text-[11px] sm:text-xs text-[#82a4b3]">
                      <span className="truncate">{isAr ? "المسارات والمقررات" : "Programs"}</span>
                      <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
                    </div>
                    <div className="text-lg sm:text-2xl font-extrabold text-white font-mono truncate">
                      {user.enrolledCourseIds.length} {isAr ? "نشط" : "Active"}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-cyan-300 font-medium truncate">
                      {courses.length} {isAr ? "إجمالي" : "total"}
                    </div>
                  </div>
                </DashboardCardGrid>
              );

            case "streak_counter":
              return (
                <StreakCounter
                  key={widget.id}
                  user={user}
                  onUpdateUser={onUpdateUser}
                  onNavigateTab={onNavigateTab}
                />
              );

            case "gamification_hub":
              return (
                <GamificationDashboard
                  key={widget.id}
                  user={user}
                />
              );

            case "ai_recommendations":
              return (
                <AIRecommendationEngine
                  key={widget.id}
                  user={user}
                  courses={courses}
                  progressMap={progressMap}
                  onSelectCourse={onSelectCourse}
                  onLaunchBooster={(topic) => onOpenAITutor()}
                />
              );

            case "d3_learning_path":
              return (
                <D3LearningPathMap
                  key={widget.id}
                  courses={courses}
                  enrolledCourseIds={user.enrolledCourseIds}
                  onSelectCourse={onSelectCourse}
                />
              );

            case "ai_discovery_feed":
              return (
                <AIDiscoveryFeed
                  key={widget.id}
                  user={user}
                  courses={courses}
                  progressMap={progressMap}
                  onNavigateTab={onNavigateTab}
                  onOpenAITutor={onOpenAITutor}
                />
              );

            case "weekly_summary":
              return (
                <div key={widget.id} className="bg-[#061219]/90 border border-[#163647] rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#132f3e] pb-3">
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                        {isAr ? "ملخص التعلم الأسبوعي وتقرير النمو" : "Weekly Learning Summary & Growth Report"}
                      </h2>
                      <p className="text-[11px] sm:text-xs text-[#82a4b3]">
                        {isAr
                          ? "تحليل مدعوم بالذكاء الاصطناعي لعادات الدراسة ومعدل استبقاء المعرفة."
                          : "AI-generated analysis of your study habits and knowledge retention."}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#030b10] border border-[#163647] space-y-3">
                      <h3 className="text-xs sm:text-sm font-semibold text-white">{isAr ? "اتجاه التركيز" : "Focus Trend"}</h3>
                      <div className="h-20 sm:h-24 flex items-end justify-between gap-1.5 sm:gap-2 px-1 sm:px-2 pb-2 border-b border-[#143242]">
                        {[30, 45, 60, 20, 90, 120, 40].map((val, i) => (
                          <div key={i} className="w-full bg-cyan-900/40 rounded-t-sm relative group">
                            <div style={{ height: `${(val/120)*100}%` }} className="absolute bottom-0 w-full bg-cyan-400 rounded-t-sm transition-all group-hover:bg-cyan-300" />
                          </div>
                        ))}
                      </div>
                      <div className="text-[11px] sm:text-xs text-[#82a4b3] text-center">
                        {isAr ? "بلغ تركيزك ذروته يوم الجمعة (120 دقيقة)." : "Your focus peaked on Friday (120 mins)."}
                      </div>
                    </div>
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#030b10] border border-[#163647] space-y-3">
                      <h3 className="text-xs sm:text-sm font-semibold text-white">{isAr ? "استبقاء المعرفة" : "Knowledge Retention"}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] sm:text-xs">
                          <span className="text-cyan-300">{isAr ? "الاختبارات المجتازة" : "Quizzes Passed"}</span>
                          <span className="text-white font-mono">12 / 15</span>
                        </div>
                        <div className="w-full bg-[#143242] rounded-full h-1.5 sm:h-2">
                          <div className="bg-cyan-400 h-full rounded-full" style={{ width: '80%' }}></div>
                        </div>
                        <div className="flex justify-between text-[11px] sm:text-xs pt-1 sm:pt-2">
                          <span className="text-cyan-300">{isAr ? "البطاقات التعليمية المتقنة" : "Flashcards Mastered"}</span>
                          <span className="text-white font-mono">{isAr ? "48 بطاقة" : "48 cards"}</span>
                        </div>
                        <div className="w-full bg-[#143242] rounded-full h-1.5 sm:h-2">
                          <div className="bg-cyan-400 h-full rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );

            case "challenge_arena":
              return (
                <div key={widget.id} className="bg-[#061219]/90 border border-[#163647] rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#132f3e] pb-3">
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <Target className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                        {isAr ? "ساحة التحديات الأكاديمية" : "Challenge Arena"}
                      </h2>
                      <p className="text-[11px] sm:text-xs text-[#82a4b3]">
                        {isAr
                          ? "اختبارات تنافسية وتحديات برمجية محددة بوقت محدد."
                          : "Time-limited competitive academic quizzes and coding challenges."}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-[#0a1e28] to-[#030b10] border border-[#143242] space-y-3 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                        <Brain className="w-24 h-24 text-cyan-500" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start">
                          <span className="px-2 py-0.5 sm:py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                            {isAr ? "حدث مباشر" : "Live Event"}
                          </span>
                          <span className="text-[11px] sm:text-xs text-cyan-400 font-mono animate-pulse">
                            {isAr ? "ينتهي خلال ساعتين و15 دقيقة" : "Ends in 2h 15m"}
                          </span>
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-white mt-2 sm:mt-3">
                          {isAr ? "تحسينات الخوارزميات والتعقيد الحسابي" : "Algorithmic Optimizations"}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-[#82a4b3] mt-1 line-clamp-2">
                          {isAr
                            ? "تنافس ضد 240 باحثاً في تحديات الكفاءة الزمنية والمكانية في الوقت الفعلي."
                            : "Compete against 240 scholars in real-time space/time complexity challenges."}
                        </p>
                        <div className="mt-3 sm:mt-4 flex items-center justify-between">
                          <span className="text-[11px] sm:text-xs text-cyan-200 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {isAr ? "لقب الأستاذ الكبير" : "Grandmaster Title"}
                          </span>
                          <button
                            onClick={() => onNavigateTab ? onNavigateTab("educational_materials") : onOpenAITutor()}
                            className="px-3 sm:px-4 py-1 sm:py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors active:scale-95"
                          >
                            {isAr ? "دخول الساحة" : "Join Arena"}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#030b10] border border-[#143242] space-y-3 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                        <Sparkles className="w-24 h-24 text-cyan-500" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start">
                          <span className="px-2 py-0.5 sm:py-1 bg-[#143242] text-[#82a4b3] border border-[#1c3a47] rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                            {isAr ? "قريباً" : "Upcoming"}
                          </span>
                          <span className="text-[11px] sm:text-xs text-[#82a4b3] font-mono">
                            {isAr ? "يبدأ غداً" : "Starts Tomorrow"}
                          </span>
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-white mt-2 sm:mt-3">
                          {isAr ? "معماريات التعلم العميق المتقدمة" : "Deep Learning Architectures"}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-[#82a4b3] mt-1 line-clamp-2">
                          {isAr
                            ? "اختبر معرفتك في نماذج المحولات (Transformers) والشبكات الالتفافية والشبكات العصبية المتقدمة."
                            : "Test your knowledge on Transformers, CNNs, and advanced neural networks."}
                        </p>
                        <div className="mt-3 sm:mt-4 flex items-center justify-between">
                          <span className="text-[11px] sm:text-xs text-cyan-200 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {isAr ? "شارة المهندس العصبي" : "Neural Architect Badge"}
                          </span>
                          <button className="px-3 sm:px-4 py-1 sm:py-1.5 bg-[#143242] text-[#82a4b3] border border-[#1c3a47] rounded-lg text-[11px] sm:text-xs font-semibold cursor-not-allowed">
                            {isAr ? "تذكيري" : "Notify Me"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );

            case "upcoming_deadlines":
              return (
                <div key={widget.id} className="bg-[#061219]/90 border border-[#163647] rounded-3xl p-4 sm:p-6 space-y-5 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#132f3e] pb-3">
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                        {isAr ? "جدول الدراسة والمواعيد القادمة" : "Study Schedule & Upcoming Milestones"}
                      </h2>
                      <p className="text-[11px] sm:text-xs text-[#82a4b3]">
                        {isAr
                          ? "استعرض جدولك الأسبوعي والمواعيد النهائية والمهام المسجلة."
                          : "Your active milestones, scheduled lectures, and upcoming exams."}
                      </p>
                    </div>
                    {onNavigateTab && (
                      <button
                        onClick={() => onNavigateTab("schedule")}
                        className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5 group"
                      >
                        <span>{isAr ? "المخطط الأسبوعي الكامل" : "Open Full Weekly Matrix"}</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Urgent Deadlines & Exams */}
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>{isAr ? "مواعيد هامة عاجلة" : "Urgent Deadlines"}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">2 Due Soon</span>
                      </div>
                      <div
                        onClick={() => {
                          const algCourse = courses.find((c) => c.title.toLowerCase().includes("algorithm") || c.category.toLowerCase().includes("computer"));
                          if (algCourse) onSelectCourse(algCourse);
                          else if (onNavigateTab) onNavigateTab("educational_materials");
                        }}
                        className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-[#030b10] border border-cyan-500/20 flex items-center justify-between gap-3 cursor-pointer hover:border-cyan-400/50 transition-all hover:bg-cyan-950/20"
                      >
                        <div className="min-w-0">
                          <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                            {isAr ? "مستحق خلال يومين" : "Due in 2 days • CS-401"}
                          </span>
                          <h4 className="font-bold text-xs text-white truncate">
                            {isAr ? "مشروع التخرج في الخوارزميات" : "Algorithms Capstone Project"}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                            {isAr ? "تسليم النموذج الأولي للتحليل والرسومات البيانية" : "Submit bipartite matching algorithm & benchmark report"}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0" />
                      </div>
                      <div
                        onClick={() => {
                          const aiCourse = courses.find((c) => c.title.toLowerCase().includes("neural") || c.title.toLowerCase().includes("ai") || c.category.toLowerCase().includes("ai"));
                          if (aiCourse) onSelectCourse(aiCourse);
                          else if (onNavigateTab) onNavigateTab("educational_materials");
                        }}
                        className="p-3.5 rounded-2xl bg-[#030b10] border border-[#163647] flex items-center justify-between gap-3 cursor-pointer hover:border-cyan-400/50 transition-all hover:bg-[#0a1e28]"
                      >
                        <div className="min-w-0">
                          <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                            {isAr ? "مستحق خلال 5 أيام" : "Due in 5 days • AI-502"}
                          </span>
                          <h4 className="font-bold text-xs text-white truncate">
                            {isAr ? "الاختبار النصفي للشبكات العصبية" : "Neural Networks Midterm Assessment"}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                            {isAr ? "مراجعة مفاهيم Backprop و Transformer Attention" : "Review Backpropagation, Transformer Attention & Loss"}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0" />
                      </div>
                    </div>

                    {/* Today & Upcoming Schedule Sessions */}
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>{isAr ? "جلسات اليوم وجدول هذا الأسبوع" : "Today & Upcoming Sessions"}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">3 Active</span>
                      </div>
                      <div className="space-y-2">
                        <div className="p-3 rounded-2xl bg-[#030b10] border border-cyan-500/20 flex items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 animate-ping" />
                            <div className="min-w-0">
                              <span className="text-[9px] font-mono text-cyan-300 font-bold block">14:00 - 15:30 • Live Lecture</span>
                              <h4 className="font-bold text-xs text-white truncate">AI Ethics & Algorithmic Accountability</h4>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-lg bg-cyan-950 text-cyan-300 text-[10px] font-bold shrink-0">Today</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-[#030b10] border border-[#163647] flex items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                            <div className="min-w-0">
                              <span className="text-[9px] font-mono text-cyan-400 font-bold block">16:30 - 17:30 • Lab</span>
                              <h4 className="font-bold text-xs text-white truncate">SVD & Matrix Decomposition Workshop</h4>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-lg bg-[#0c1a24] text-slate-300 text-[10px] font-bold shrink-0">Tomorrow</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-[#030b10] border border-[#163647] flex items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                            <div className="min-w-0">
                              <span className="text-[9px] font-mono text-cyan-400 font-bold block">10:00 - 11:30 • Study Group</span>
                              <h4 className="font-bold text-xs text-white truncate">Distributed Sheaf Consensus Seminar</h4>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-lg bg-[#0c1a24] text-slate-300 text-[10px] font-bold shrink-0">Thursday</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );

            case "recent_activity":
              return (
                <div key={widget.id} className="bg-[#061219]/90 border border-[#163647] rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#132f3e] pb-3">
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <CheckSquare className="w-5 h-5 text-cyan-400" />
                        {isAr ? "النشاط الأخير ومتابعة الدروس" : "Recent Activity & Lesson Progress"}
                      </h2>
                      <p className="text-xs text-[#82a4b3]">
                        {isAr
                          ? "رؤية فورية لآخر الإنجازات التعليمية وتقدم المقررات"
                          : "Immediate visibility into your latest learning milestones and course progress"}
                      </p>
                    </div>
                  </div>

                  {last3CompletedLessons.length === 0 ? (
                    <div className="relative py-10 px-6 rounded-2xl bg-[#030b10] border border-[#143242] text-center space-y-4 overflow-hidden">
                      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
                        <svg className="w-64 h-64" viewBox="0 0 300 300" fill="none">
                          <polygon points="150,20 270,90 270,210 150,280 30,210 30,90" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="6 4" />
                          <circle cx="150" cy="150" r="40" stroke="#14b8a6" strokeWidth="1" strokeDasharray="3 3" />
                        </svg>
                      </div>
                      <div className="relative z-10 space-y-2">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                          <Clock className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-white text-sm">
                          {isAr ? "لم يتم إكمال أي دروس مؤخراً" : "No Recent Lessons Completed Yet"}
                        </h4>
                        <p className="text-xs text-[#789cae] max-w-sm mx-auto">
                          {isAr
                            ? "أكمل درسك التفاعلي الأول لتتبع مؤشرات النشاط والإنجازات هنا."
                            : "Complete your first interactive lesson to track recent activity milestones and progress indicators here."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {last3CompletedLessons.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-[#030b10] border border-[#163647] flex items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                              {item.courseTitle}
                            </span>
                            <h4 className="font-bold text-sm text-white">{item.lessonTitle}</h4>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs text-cyan-300 font-mono font-bold">
                              {item.percent}% {isAr ? "مكتمل" : "Course Complete"}
                            </span>
                            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );

            case "enrolled_courses":
              return (
                <div key={widget.id} className="space-y-6 pt-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#163647] pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-cyan-400" />
                        {isAr ? "الوحدات والمقررات الأكاديمية" : "Academic Modules & Degree Courses"}
                      </h2>
                      <p className="text-xs text-[#82a4b3]">
                        {isAr
                          ? "الوصول إلى جميع الدروس التفاعلية والاختبارات وأدوات الدراسة السقراطية"
                          : "Access all enrolled interactive lessons, quizzes, and Socratic study tools"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      {/* Course Smart Sorting Selector */}
                      <div className="flex items-center gap-1 bg-[#030b10] px-2.5 py-1 rounded-xl border border-[#143242] text-xs">
                        <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[#789cae] text-[11px] hidden md:inline">{isAr ? "ترتيب المقررات:" : "Sort:"}</span>
                        <select
                          value={courseSortBy}
                          onChange={(e) => setCourseSortBy(e.target.value as any)}
                          className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
                        >
                          <option value="smart" className="bg-[#061219] text-cyan-300">{isAr ? "🤖 مطابقة ذكية" : "🤖 Smart Match"}</option>
                          <option value="progress" className="bg-[#061219] text-white">{isAr ? "📈 نسبة الإنجاز" : "📈 Progress"}</option>
                          <option value="rating" className="bg-[#061219] text-white">{isAr ? "⭐ الأعلى تقييماً" : "⭐ Top Rated"}</option>
                          <option value="duration" className="bg-[#061219] text-white">{isAr ? "⏱️ مدة الدراسة" : "⏱️ Duration"}</option>
                          <option value="alphabetical" className="bg-[#061219] text-white">{isAr ? "🔤 أبجدياً (أ-ي)" : "🔤 Title (A-Z)"}</option>
                        </select>
                      </div>

                      {/* Category Filter Pills */}
                      <div className="flex items-center gap-1 bg-[#030b10] p-1 rounded-xl border border-[#143242] overflow-x-auto max-w-full">
                        {[
                          { id: "all", label: isAr ? "الكل" : "all", desc: isAr ? "عرض كافة المقررات المتاحة" : "View all available degree modules" },
                          { id: "enrolled", label: isAr ? "المسجلة" : "enrolled", desc: isAr ? "المقررات التي سجلت بها حالياً" : "Courses you are currently actively enrolled in" },
                          { id: "bookmarks", label: isAr ? "📑 علاماتي المرجعية" : "📑 Bookmarks", desc: isAr ? "عرض الدروس والمواضيع المحفوظة للمراجعة السريعة" : "View saved topics, bookmarked lessons & study notes" },
                          { id: "ai", label: isAr ? "✨ مولدة بالذكاء الاصطناعي" : "✨ AI Generated", desc: isAr ? "المناهج المولدة ذكياً بواسطة معمار المناهج" : "Curricula synthesized by the AI Course Architect" },
                          { id: "Computer Science", label: isAr ? "علوم الحاسوب" : "Computer Science", desc: isAr ? "هندسة البرمجيات والخوارزميات والأنظمة الموزعة" : "Software engineering, algorithms & distributed systems" },
                          { id: "Physics", label: isAr ? "الفيزياء" : "Physics", desc: isAr ? "الفيزياء النظرية وميكانيكا الكم والديناميكا" : "Theoretical physics, quantum mechanics & dynamics" },
                        ].map((catItem) => (
                          <Tooltip
                            key={catItem.id}
                            title={catItem.label}
                            description={catItem.desc}
                            position="top"
                            delay={200}
                          >
                            <button
                              onClick={() => setFilterCategory(catItem.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                filterCategory === catItem.id
                                  ? "bg-[#122e3e] text-white shadow-md font-semibold border border-cyan-500/30"
                                  : "text-[#799db0] hover:text-white hover:bg-white/5"
                              }`}
                            >
                              {catItem.label}
                            </button>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                  </div>

                  {filterCategory === "bookmarks" ? (
                    <div className="pt-2 animate-fade-in">
                      <MyBookmarksTab
                        courses={courses}
                        onOpenLesson={(courseId) => {
                          const target = courses.find((c) => c.id === courseId);
                          if (target) onSelectCourse(target);
                        }}
                      />
                    </div>
                  ) : filteredCourses.length === 0 ? (
                    <div className="py-16 px-6 rounded-3xl bg-[#061219]/90 border border-[#163647] text-center space-y-6 relative overflow-hidden shadow-2xl">
                      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
                        <svg className="w-96 h-96" viewBox="0 0 400 400" fill="none">
                          <polygon points="200,50 350,150 350,300 200,350 50,300 50,150" stroke="#22d3ee" strokeWidth="2" strokeDasharray="8 6" />
                          <polygon points="200,100 300,170 300,270 200,300 100,270 100,170" stroke="#14b8a6" strokeWidth="2" />
                          <circle cx="200" cy="200" r="50" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" />
                        </svg>
                      </div>
                      <div className="relative z-10 space-y-3 max-w-md mx-auto">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-xl">
                          <BookOpen className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-white">
                          {isAr ? "لم يتم العثور على مقررات في هذا التصنيف" : "No Modules Found in This Category"}
                        </h3>
                        <p className="text-xs text-[#82a4b3] leading-relaxed">
                          {isAr
                            ? "جرب تغيير تصنيف البحث أو قم بتوليد منهج دراسي مخصص بالذكاء الاصطناعي لبدء مسارك المنظم."
                            : "Try switching your category filter or generate a custom AI curriculum using the AI Course Architect to begin your structured learning path."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <DashboardCardGrid cols={3} gap="lg" lang={user.language}>
                      {filteredCourses.map((course) => {
                        const prog = progressMap[course.id];
                        const completedCount = prog?.completedLessonIds?.length || 0;
                        const totalLessons = course.modules.reduce(
                          (acc, m) => acc + m.lessons.length,
                          0,
                        );
                        const percent =
                          totalLessons > 0
                            ? Math.round((completedCount / totalLessons) * 100)
                            : 0;
                        const isEnrolled = user.enrolledCourseIds.includes(course.id);

                        return (
                          <div
                            key={course.id}
                            className="group bg-[#061219]/90 border border-[#163647] hover:border-cyan-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/20 flex flex-col justify-between w-full min-w-0"
                          >
                            <div>
                              {/* Image Header */}
                              <div className="relative h-40 overflow-hidden">
                                <ThemedCourseImage
                                  src={course.coverImage}
                                  alt={course.title}
                                  category={course.category}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#061219] via-transparent to-transparent" />

                                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/10">
                                    {course.level}
                                  </span>
                                  {course.isAiGenerated && (
                                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-cyan-950/90 backdrop-blur-md text-cyan-200 border border-cyan-400/30 flex items-center gap-1">
                                      <Sparkles className="w-3 h-3" />
                                      {isAr ? "معمارية ذكية" : "AI Architect"}
                                    </span>
                                  )}
                                </div>

                                <div className="absolute bottom-2 right-3 flex items-center gap-1 text-cyan-300 text-xs font-semibold bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                                  <Star className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                                  <span>{course.rating}</span>
                                </div>
                              </div>

                              {/* Details */}
                              <div className="p-5 space-y-3">
                                <div className="text-[11px] font-semibold text-cyan-400 tracking-wider uppercase">
                                  {course.category}
                                </div>

                                <h3 className="font-bold text-base text-white group-hover:text-cyan-200 transition-colors line-clamp-2">
                                  {course.title}
                                </h3>

                                <p className="text-xs text-[#82a4b3] line-clamp-2 leading-relaxed">
                                  {course.description}
                                </p>

                                <div className="flex items-center gap-4 text-xs text-[#7195a4] pt-1">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                                    {course.durationHours}{isAr ? " س إجمالي" : "h total"}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                                    {totalLessons} {isAr ? "درساً" : "lessons"}
                                  </span>
                                </div>

                                {isEnrolled && (
                                  <div className="space-y-1.5 pt-2">
                                    <div className="flex justify-between text-xs">
                                      <span className="text-[#82a4b3] font-medium">
                                        {isAr ? "التقدم الإجمالي" : "Progress"}
                                      </span>
                                      <span className="text-cyan-300 font-bold">
                                        {percent}%
                                      </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-[#030b10] rounded-full overflow-hidden border border-[#143242]">
                                      <div
                                        className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-500"
                                        style={{ width: `${percent}%` }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Card Footer Buttons */}
                            <div className="p-5 pt-0 space-y-2">
                              <Tooltip
                                title={isEnrolled ? (percent > 0 ? (isAr ? "متابعة دراسة المقرر" : "Continue Course") : (isAr ? "بدء دراسة المقرر" : "Start Course")) : (isAr ? "التسجيل وبدء التعلم" : "Enroll & Start Learning")}
                                description={isAr ? `الانتقال إلى وحدات ${course.title} والدروس التفاعلية` : `Jump directly into interactive lessons and exercises for ${course.title}`}
                                position="top"
                                delay={200}
                              >
                                <button
                                  onClick={() => onSelectCourse(course)}
                                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-md transition-all active:scale-95 border border-cyan-400/20"
                                >
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                  <span>
                                    {isEnrolled
                                      ? percent > 0
                                        ? isAr ? "متابعة المقرر" : "Continue Course"
                                        : isAr ? "بدء المقرر" : "Start Course"
                                      : isAr ? "التسجيل والبدء" : "Enroll & Learn"}
                                  </span>
                                </button>
                              </Tooltip>

                              <Tooltip
                                title={isAr ? "تصدير إلى Google Docs" : "Export to Google Docs"}
                                description={isAr ? "إنشاء مستند منظم يحتوي على مخطط المنهج والمواعيد ومسارات الدروس" : "Generate a formatted curriculum study plan in Google Docs"}
                                position="bottom"
                                delay={200}
                              >
                                <button
                                  onClick={() => handleExportWorkspace("docs", course.title)}
                                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#030b10] hover:bg-[#0a1e28] text-[#7195a4] hover:text-white text-[11px] border border-[#143242] transition-colors"
                                >
                                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                                  <span>{isAr ? "تصدير خطة الدراسة إلى Google Docs" : "Export Study Plan to Google Docs"}</span>
                                </button>
                              </Tooltip>
                            </div>
                          </div>
                        );
                      })}
                    </DashboardCardGrid>
                  )}
                </div>
              );

            case "my_bookmarks":
              return (
                <div key={widget.id} className="space-y-4 pt-2">
                  <div className="flex items-center justify-between border-b border-[#163647] pb-3">
                    <div>
                      <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        <Bookmark className="w-5 h-5 text-cyan-400" />
                        {isAr ? "علاماتي المرجعية وملاحظاتي المحفوظة" : "My Bookmarked Lessons & Quick Notes"}
                      </h2>
                      <p className="text-xs text-[#82a4b3]">
                        {isAr
                          ? "استرجاع ومتابعة الدروس المحفوظة للمراجعة السريعة والملاحظات الملخصة"
                          : "Quick retrieval of saved topics, key concepts, and annotated revision notes"}
                      </p>
                    </div>
                  </div>
                  <MyBookmarksTab
                    courses={courses}
                    onOpenLesson={(courseId) => {
                      const target = courses.find((c) => c.id === courseId);
                      if (target) onSelectCourse(target);
                    }}
                  />
                </div>
              );

            case "google_workspace":
              return (
                <div key={widget.id} className="space-y-4 pt-2">
                  <div className="flex items-center justify-between border-b border-[#163647] pb-3">
                    <div>
                      <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        <Layout className="w-5 h-5 text-cyan-400" />
                        {isAr ? "مساحة عمل Google والملفات السحابية" : "Google Workspace & Cloud Files"}
                      </h2>
                      <p className="text-xs text-[#82a4b3]">
                        {isAr
                          ? "إدارة الملفات والتقويم والمهام والبريد الإلكتروني الدراسي مباشرة من حسابك"
                          : "Manage study files, calendar, tasks, and academic emails directly from your account"}
                      </p>
                    </div>
                  </div>
                  <WorkspaceDashboard lang={lang} isAr={isAr} />
                </div>
              );

            default:
              return null;
          }
        })}

      {/* 2.5 Real-Time Adaptive Learning Path Recommendation Engine */}
      <AdaptiveLearningPathAdvisor
        courses={courses}
        progressMap={progressMap}
        user={user}
        onSelectCourse={onSelectCourse}
        onOpenSocraticTutor={(topic) => onOpenAITutor()}
      />

      {/* Dashboard Customizer Modal */}
      <DashboardCustomizerModal
        isOpen={showCustomizer}
        onClose={() => setShowCustomizer(false)}
        user={user}
        onUpdateUser={onUpdateUser || (() => {})}
      />

      {/* Verified Certificates Locker Section */}
      <div className="bg-[#061219]/90 border border-[#163647] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#132f3e] pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-400" />
              {isAr ? "الشهادات الأكاديمية المعتمدة" : "Verified Credentials & Academic Certificates"}
            </h2>
            <p className="text-xs text-[#82a4b3]">
              {isAr
                ? "الشهادات والاعتمادات الرسمية الصادرة عند إكمال وحدات الدرجات ومشاريع التخرج"
                : "Official credentials issued upon completing degree modules and capstone defenses"}
            </p>
          </div>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center py-8 text-[#789cae] text-xs border border-dashed border-[#163647] rounded-xl">
            {isAr
              ? "لم يتم الحصول على شهادات بعد. أكمل برنامجك الأول واجتز الاختبارات لتوليد شهادة رسمية موثقة!"
              : "No certificates earned yet. Complete your first program and pass quizzes to generate an official verified certificate!"}
          </div>
        ) : (
          <DashboardCardGrid cols={3} gap="sm" lang={user.language}>
            {certificates.map((cert) => (
              <div
                key={cert.id}
                onClick={() => onOpenCertificate(cert)}
                className="p-3.5 sm:p-4 rounded-xl bg-[#030b10] border border-cyan-500/30 hover:border-cyan-400 cursor-pointer transition-all hover:bg-[#0a1e28] flex items-start justify-between group w-full min-w-0"
              >
                <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-cyan-300 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
                    <span className="truncate">{isAr ? "شهادة معتمدة" : "Verified Certificate"}</span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-cyan-200 transition-colors truncate">
                    {cert.courseTitle}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-[#789cae] truncate">
                    {isAr ? `صادرة لـ ${cert.studentName} • ${cert.issuedDate}` : `Issued to ${cert.studentName} • ${cert.issuedDate}`}
                  </p>
                  <div className="text-[9px] sm:text-[10px] text-cyan-400 font-mono truncate">
                    ID: {cert.verificationId}
                  </div>
                </div>

                <div className="p-1.5 sm:p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0 ml-2">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
            ))}
          </DashboardCardGrid>
        )}
      </div>

      <QuickNotesOverlay />
    </div>
  );
};
