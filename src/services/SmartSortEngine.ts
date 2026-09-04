import { UserProfile, Course, StudentProgress, DashboardWidgetConfig } from '../shared/types';

export type SmartSortMode = 'ai_priority' | 'deadline_urgency' | 'deadlines' | 'engagement' | 'custom' | 'manual';

export interface SmartSortScoreResult {
  widgetId: string;
  title: string;
  score: number;
  priorityReason: string;
  category: 'deadline' | 'engagement' | 'progress' | 'analytics' | 'discovery';
}

export interface UpcomingDeadlineItem {
  id: string;
  title: string;
  courseTitle: string;
  dueInDays: number;
  type: 'capstone' | 'quiz' | 'exam' | 'assignment';
  urgent: boolean;
}

export class SmartSortEngine {
  /**
   * Mock / derived dynamic deadlines based on enrolled courses and student progress
   */
  public static getUpcomingDeadlines(courses: Course[], user: UserProfile): UpcomingDeadlineItem[] {
    const deadlines: UpcomingDeadlineItem[] = [];

    const enrolled = courses.filter((c) => user.enrolledCourseIds.includes(c.id));
    const targetCourses = enrolled.length > 0 ? enrolled : courses.slice(0, 3);

    targetCourses.forEach((course, idx) => {
      if (idx === 0) {
        deadlines.push({
          id: `dl-${course.id}-capstone`,
          title: `${course.title} — Capstone Defense & Technical Thesis`,
          courseTitle: course.title,
          dueInDays: 2,
          type: 'capstone',
          urgent: true,
        });
      } else if (idx === 1) {
        deadlines.push({
          id: `dl-${course.id}-midterm`,
          title: `${course.title} — Formal Verification & Midterm Assessment`,
          courseTitle: course.title,
          dueInDays: 5,
          type: 'exam',
          urgent: false,
        });
      } else {
        deadlines.push({
          id: `dl-${course.id}-lab`,
          title: `${course.title} — Algorithmic Lab Synthesis & Code Submission`,
          courseTitle: course.title,
          dueInDays: 7,
          type: 'assignment',
          urgent: false,
        });
      }
    });

    return deadlines;
  }

  /**
   * Computes dynamic priority scores for all dashboard widgets
   */
  public static computeWidgetScores(
    user: UserProfile,
    courses: Course[],
    progressMap: Record<string, StudentProgress>,
    mode: SmartSortMode = 'ai_priority'
  ): SmartSortScoreResult[] {
    const deadlines = this.getUpcomingDeadlines(courses, user);
    const hasUrgentDeadline = deadlines.some((d) => d.dueInDays <= 3);

    // Engagement metrics
    const dailyGoalMinutes = user.dailyStudyGoal || 60;
    const focusMinutes = user.totalFocusMinutes || 45;
    const goalRemaining = Math.max(0, dailyGoalMinutes - (focusMinutes % dailyGoalMinutes));
    const isGoalPending = goalRemaining > 0;
    const streakDays = user.streakDays || user.streak || 7;

    // Progress metrics
    let totalCompletedLessons = 0;
    Object.values(progressMap).forEach((p) => {
      totalCompletedLessons += p?.completedLessonIds?.length || 0;
    });

    const isRemedial = user.learningLevel === 'remedial';
    const isAccelerated = user.learningLevel === 'accelerated' || user.learningLevel === 'mastery';

    const scores: SmartSortScoreResult[] = [
      {
        widgetId: 'quick_stats',
        title: user.language === 'ar' ? 'شريط الإحصائيات والمقاييس السريعة' : 'Quick Stats & Metrics Bar',
        score: 50,
        priorityReason: user.language === 'ar' ? 'لوحة القياس الأساسية والأداء العام' : 'Fundamental academic metrics overview',
        category: 'analytics',
      },
      {
        widgetId: 'streak_counter',
        title: user.language === 'ar' ? 'عداد الأيام والهدف اليومي' : 'Streak Counter & Daily Goal',
        score: isGoalPending ? 92 : 65,
        priorityReason: isGoalPending
          ? user.language === 'ar'
            ? `متبقي ${goalRemaining} دقيقة لتحقيق هدف اليوم والحفاظ على سلسلة ${streakDays} أيام`
            : `${goalRemaining} mins remaining to hit daily study goal and preserve ${streakDays}-day streak`
          : user.language === 'ar'
          ? 'تم تحقيق هدف اليوم بنجاح!'
          : 'Daily study goal completed for today!',
        category: 'engagement',
      },
      {
        widgetId: 'upcoming_deadlines',
        title: user.language === 'ar' ? 'المواعيد والمهام القادمة' : 'Upcoming Deadlines & Schedule',
        score: hasUrgentDeadline ? 98 : 70,
        priorityReason: hasUrgentDeadline
          ? user.language === 'ar'
            ? '⚠️ موعد نهائي حرج مستحق خلال أقل من 48 ساعة'
            : '⚠️ Critical project milestone due in less than 48 hours'
          : user.language === 'ar'
          ? 'جدول المواعيد المنتظم للأسبوع القادم'
          : 'Regular schedule for next week',
        category: 'deadline',
      },
      {
        widgetId: 'challenge_arena',
        title: user.language === 'ar' ? 'ساحة التحديات والمنافسة الأكاديمية' : 'Challenge Arena',
        score: hasUrgentDeadline ? 86 : 60,
        priorityReason: user.language === 'ar' ? 'حدث مباشر وتحدي خوارزميات ينتهي قريباً' : 'Live algorithmic challenge ending soon with bonus XP',
        category: 'engagement',
      },
      {
        widgetId: 'ai_recommendations',
        title: user.language === 'ar' ? 'محرك التوصيات الأكاديمية بالذكاء الاصطناعي' : 'AI Personalized Recommendation Engine',
        score: isRemedial ? 94 : isAccelerated ? 88 : 80,
        priorityReason: isRemedial
          ? user.language === 'ar'
            ? 'تم توليد مسار دعم فوري لتعزيز المفاهيم الرياضية'
            : 'Remedial boost recommendations tailored to reinforce core concepts'
          : user.language === 'ar'
          ? 'توصيات ذكية متقدمة مبنية على معدل استيعابك'
          : 'High-affinity advanced modules generated for your pace',
        category: 'progress',
      },
      {
        widgetId: 'enrolled_courses',
        title: user.language === 'ar' ? 'شبكة المقررات المسجلة والموصى بها' : 'Enrolled & Recommended Courses Grid',
        score: 85,
        priorityReason: user.language === 'ar' ? 'الوصول المباشر إلى الوحدات والمحاضرات النشطة' : 'Direct access to your active enrolled coursework',
        category: 'progress',
      },
      {
        widgetId: 'gamification_hub',
        title: user.language === 'ar' ? 'مركز التحفيز والإنجازات واللوحة التنافسية' : 'Gamification, Points & Leaderboard Hub',
        score: 72,
        priorityReason: user.language === 'ar' ? 'ترتيبك الأكاديمي والشارات القابلة للفتح' : 'Academic leaderboard ranking & unlockable badges',
        category: 'engagement',
      },
      {
        widgetId: 'd3_learning_path',
        title: user.language === 'ar' ? 'خريطة مسارات التعلم التفاعلية D3' : 'D3 Interactive Learning Path Map',
        score: 78,
        priorityReason: user.language === 'ar' ? 'استكشاف خريطة التبعيات الأكاديمية والتسلسل' : 'Interactive topological visual curriculum map',
        category: 'discovery',
      },
      {
        widgetId: 'ai_discovery_feed',
        title: user.language === 'ar' ? 'موجز الاكتشافات الأكاديمية وسد الفجوات المعرفية' : 'AI Academic Discovery Feed & Knowledge Gaps',
        score: isRemedial ? 89 : 74,
        priorityReason: user.language === 'ar' ? 'سد الفجوات المفاهيمية ومراجعة المقالات العلمية' : 'Curated external research and knowledge gap patches',
        category: 'discovery',
      },
      {
        widgetId: 'recent_activity',
        title: user.language === 'ar' ? 'النشاط الأخير ومتابعة الدروس' : 'Recent Activity & Lesson Progress',
        score: totalCompletedLessons > 0 ? 76 : 40,
        priorityReason: user.language === 'ar' ? 'متابعة آخر الدروس المنجزة وسجلات الإتمام' : 'Resume last completed module and milestones',
        category: 'analytics',
      },
      {
        widgetId: 'weekly_summary',
        title: user.language === 'ar' ? 'ملخص التعلم الأسبوعي' : 'Weekly Learning Summary',
        score: 68,
        priorityReason: user.language === 'ar' ? 'تقرير اتجاهات التركيز ومعدل استبقاء المعرفة' : 'Weekly focus trend and retention analytics',
        category: 'analytics',
      },
      {
        widgetId: 'google_workspace',
        title: user.language === 'ar' ? 'مساحة عمل Google والملفات السحابية' : 'Google Workspace & Cloud Files',
        score: user.workspaceConnected ? 82 : 45,
        priorityReason: user.workspaceConnected 
          ? user.language === 'ar' ? 'مزامنة نشطة مع ملفاتك ومهامك الدراسية' : 'Active synchronization with your study files & tasks'
          : user.language === 'ar' ? 'اربط حساب Google للوصول للملفات' : 'Connect Google account to access study workspace',
        category: 'discovery',
      },
    ];

    // Mode-specific weight adjustments
    if (mode === 'deadline_urgency' || mode === 'deadlines') {
      scores.forEach((s) => {
        if (s.category === 'deadline') s.score += 50;
        if (s.category === 'progress') s.score += 20;
      });
    } else if (mode === 'engagement') {
      scores.forEach((s) => {
        if (s.category === 'engagement') s.score += 40;
        if (s.category === 'progress') s.score += 25;
      });
    }

    return scores.sort((a, b) => b.score - a.score);
  }

  /**
   * Sorts user widget configurations using smart ranking
   */
  public static getSmartOrderedWidgets(
    userWidgets: DashboardWidgetConfig[],
    user: UserProfile,
    courses: Course[],
    progressMap: Record<string, StudentProgress>,
    mode: SmartSortMode = 'ai_priority',
    enabled: boolean = true
  ): { widgets: DashboardWidgetConfig[]; scoresMap: Map<string, SmartSortScoreResult> } {
    const scores = this.computeWidgetScores(user, courses, progressMap, mode);
    const scoresMap = new Map<string, SmartSortScoreResult>();
    scores.forEach((s) => scoresMap.set(s.widgetId, s));

    if (!enabled || mode === 'custom' || mode === 'manual') {
      // Use user's manual order
      const sorted = [...userWidgets].sort((a, b) => a.order - b.order);
      return { widgets: sorted, scoresMap };
    }

    // Sort by computed priority score descending
    const sorted = [...userWidgets].sort((a, b) => {
      const scoreA = scoresMap.get(a.id)?.score ?? 0;
      const scoreB = scoresMap.get(b.id)?.score ?? 0;
      return scoreB - scoreA;
    });

    return { widgets: sorted, scoresMap };
  }

  /**
   * Smart sort for course catalog items
   */
  public static sortCourses(
    courses: Course[],
    user: UserProfile,
    progressMap: Record<string, StudentProgress>,
    sortBy: 'smart' | 'progress' | 'rating' | 'duration' | 'alphabetical'
  ): Course[] {
    const list = [...courses];

    if (sortBy === 'progress') {
      return list.sort((a, b) => {
        const progA = progressMap[a.id]?.completedLessonIds?.length || 0;
        const progB = progressMap[b.id]?.completedLessonIds?.length || 0;
        return progB - progA;
      });
    }

    if (sortBy === 'rating') {
      return list.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
    }

    if (sortBy === 'duration') {
      return list.sort((a, b) => a.durationHours - b.durationHours);
    }

    if (sortBy === 'alphabetical') {
      return list.sort((a, b) => a.title.localeCompare(b.title));
    }

    // Default 'smart': Enrolled & In-progress first, then AI generated, then high rating
    return list.sort((a, b) => {
      const isEnrolledA = user.enrolledCourseIds.includes(a.id) ? 1 : 0;
      const isEnrolledB = user.enrolledCourseIds.includes(b.id) ? 1 : 0;

      if (isEnrolledA !== isEnrolledB) return isEnrolledB - isEnrolledA;

      const progA = progressMap[a.id]?.completedLessonIds?.length || 0;
      const progB = progressMap[b.id]?.completedLessonIds?.length || 0;
      if (progA !== progB) return progB - progA;

      return (b.rating || 4.5) - (a.rating || 4.5);
    });
  }
}
