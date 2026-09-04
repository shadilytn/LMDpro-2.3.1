import React from "react";
import {
  AdaptiveLearningPathEngine,
  AdaptivePathRecommendation,
  RemedialModule,
} from "../services/AdaptiveLearningPathEngine";
import { Course, StudentProgress, UserProfile, Lesson } from "../shared/types";
import { toastService } from "../services/toastService";
import {
  Sparkles,
  AlertTriangle,
  Brain,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Zap,
  ChevronRight,
  ChevronLeft,
  Clock,
  BookOpen,
  Target,
  Flame,
  Award,
} from "lucide-react";
import { getTranslation, localizeText, getLocalizedCourse } from "../shared/localization";

interface AdaptiveLearningPathAdvisorProps {
  courses: Course[];
  progressMap: Record<string, StudentProgress>;
  user?: UserProfile;
  onSelectCourse?: (course: Course) => void;
  onLaunchRemedialLesson?: (courseId: string, lesson: Lesson) => void;
  onOpenSocraticTutor?: (topic: string) => void;
}

export const AdaptiveLearningPathAdvisor: React.FC<AdaptiveLearningPathAdvisorProps> = ({
  courses,
  progressMap,
  user,
  onSelectCourse,
  onLaunchRemedialLesson,
  onOpenSocraticTutor,
}) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const isAr = user?.language === "ar";
  const lang = user?.language || "en";
  const t = getTranslation(lang);

  const recommendation: AdaptivePathRecommendation = React.useMemo(() => {
    return AdaptiveLearningPathEngine.analyzeLearningPath(
      courses,
      progressMap,
      user
    );
  }, [courses, progressMap, user]);

  const hasRemedials = recommendation.remedialModulesNeeded.length > 0;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toastService.show({
        type: "success",
        title: isAr ? "تمت إعادة احتساب المسار التكيفي ⚡" : "Adaptive Path Recomputed ⚡",
        message: isAr
          ? "تم ضبط قائمة الدروس وأولوياتها بناءً على مؤشرات أحدث الاختبارات."
          : "Syllabus queue adjusted based on your latest quiz performance trends.",
        duration: 3000,
      });
    }, 600);
  };

  const handleLaunch = (rem: RemedialModule) => {
    if (rem.remedialLessonPayload && onLaunchRemedialLesson) {
      onLaunchRemedialLesson(rem.courseId, rem.remedialLessonPayload);
    } else {
      const targetCourse = courses.find((c) => c.id === rem.courseId);
      if (targetCourse && onSelectCourse) {
        onSelectCourse(targetCourse);
      }
    }
  };

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="w-full rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-[#091720]/90 border border-slate-200/90 dark:border-[#1b3b4a] shadow-lg dark:shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-300"
    >
      {/* Header Banner */}
      <div className="p-4 sm:p-6 border-b border-slate-200/80 dark:border-[#1b3b4a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-50 via-cyan-50/20 to-slate-50 dark:from-[#0c2230] dark:via-[#091d29] dark:to-[#08151c]">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border shadow-sm shrink-0 transition-transform hover:scale-105 ${
              hasRemedials
                ? "bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-cyan-400/40 dark:border-cyan-500/40 shadow-cyan-500/10"
                : "bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-cyan-400/40 dark:border-cyan-500/40 shadow-cyan-500/10"
            }`}
          >
            {hasRemedials ? (
              <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse text-cyan-500" />
            ) : (
              <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-500 dark:text-cyan-300" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                {isAr ? "محرك مسار التعلم التكيفي الذكي" : "Adaptive Learning Path Engine"}
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-xs ${
                  hasRemedials
                    ? "bg-cyan-100 text-cyan-900 dark:bg-cyan-500/25 dark:text-cyan-200 border-cyan-300 dark:border-cyan-500/50"
                    : "bg-cyan-100 text-cyan-900 dark:bg-cyan-500/25 dark:text-cyan-200 border-cyan-300 dark:border-cyan-500/50"
                }`}
              >
                {hasRemedials
                  ? (isAr ? "تعزيز علاجي نشط (<70%)" : "Remedial Reinforcement Active (<70%)")
                  : (isAr ? "على المسار الموصى به • مسار مستقر" : "On Track • Standard Path")}
              </span>
            </div>
            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-[#73A5AD] leading-relaxed break-words">
              {isAr
                ? "يعيد ترتيب قائمة الدروس ديناميكياً ويضخ تدريبات تعزيزية مستهدفة بناءً على مؤشرات الاختبارات المباشرة."
                : "Continuously adjusts lesson ordering and injects targeted boosters based on real-time quiz metrics."}
            </p>
          </div>
        </div>

        {/* Quick Stats & Refresh Button */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-slate-800">
          <div className="text-start sm:text-end">
            <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-[#73A5AD] uppercase font-bold tracking-wider block">
              {isAr ? "معدل الإتقان العام" : "Mastery Average"}
            </span>
            <div className="font-black text-lg sm:text-xl text-cyan-600 dark:text-cyan-400 font-mono">
              {recommendation.overallMasteryPercentage}%
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 sm:p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0e2430] dark:hover:bg-[#153444] border border-slate-300 dark:border-[#1b3b4a] text-slate-700 dark:text-[#73A5AD] hover:text-cyan-600 dark:hover:text-white transition-all shadow-xs active:scale-95 flex items-center gap-1.5"
            title={isAr ? "إعادة احتساب المسار" : "Recalculate Path"}
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin text-cyan-500 dark:text-cyan-400" : ""}`}
            />
            <span className="text-xs font-semibold sm:hidden">
              {isAr ? "تحديث المسار" : "Recalculate"}
            </span>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Remedial Alert Cards (Displayed when Mastery < 70%) */}
        {hasRemedials && (
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>
                  {isAr
                    ? "فجوات معرفية تم رصدها تتطلب تدعيماً علاجياً"
                    : "Identified Knowledge Gaps Requiring Remediation"}
                </span>
              </h4>
              <span className="text-xs font-bold text-cyan-700 dark:text-cyan-400">
                {recommendation.remedialModulesNeeded.length}{" "}
                {isAr ? "تدريب(ات) تعزيزية ذات أولوية" : "booster(s) prioritized"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {recommendation.remedialModulesNeeded.map((rem) => {
                const localizedCourseTitle = isAr
                  ? localizeText(rem.courseTitle, "ar")
                  : rem.courseTitle;
                const localizedActionTitle = isAr
                  ? localizeText(rem.actionTitle, "ar")
                  : rem.actionTitle;
                const localizedReason = isAr
                  ? localizeText(rem.reason, "ar")
                  : rem.reason;

                return (
                  <div
                    key={rem.id}
                    className="p-4 sm:p-5 rounded-2xl bg-cyan-500/10 dark:bg-cyan-950/25 border border-cyan-300/80 dark:border-cyan-500/40 flex flex-col justify-between gap-3 relative overflow-hidden group hover:border-cyan-400 transition-all shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-cyan-200 dark:bg-cyan-500/25 text-cyan-900 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-500/30">
                          {localizedCourseTitle}
                        </span>
                        <span className="text-xs font-black text-cyan-600 dark:text-cyan-400 font-mono">
                          {isAr ? "الدرجة:" : "Score:"} {rem.scorePercentage.toFixed(0)}%
                        </span>
                      </div>

                      <h5 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors leading-snug">
                        {localizedActionTitle}
                      </h5>
                      <p className="text-xs sm:text-[13px] text-slate-700 dark:text-[#9fc5d8] leading-relaxed">
                        {localizedReason}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-cyan-200/80 dark:border-cyan-500/20 text-xs">
                      <span className="flex items-center gap-1.5 text-slate-600 dark:text-[#73A5AD] font-medium">
                        <Clock className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                        <span>~{rem.estimatedMinutes} {isAr ? "دقيقة تدريب" : "min drill"}</span>
                      </span>

                      <button
                        onClick={() => handleLaunch(rem)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-900 to-cyan-600 hover:from-blue-800 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                      >
                        <span>{isAr ? "بدء التدريب المعزز" : "Launch Booster"}</span>
                        {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Adapted Lesson Queue (Reordered Priority) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span>
                {isAr
                  ? "قائمة الدروس المحسنة تكيفياً"
                  : "Optimized Adaptive Lesson Queue"}
              </span>
            </h4>
            <span className="text-xs text-slate-500 dark:text-[#73A5AD] font-medium">
              {isAr
                ? "ترتيب تلقائي لتعظيم استبقاء المعرفة"
                : "Auto-reordered for maximum retention"}
            </span>
          </div>

          {/* Responsive Adaptive Grid: 1 col on mobile, 2 cols on tablet/laptop, 3 cols on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {recommendation.reorderedLessonQueue.slice(0, 6).map((item, idx) => {
              const localizedCourse = isAr
                ? getLocalizedCourse(
                    courses.find((c) => c.id === item.courseId) || {
                      id: item.courseId,
                      title: item.courseTitle,
                      category: "",
                      description: "",
                      level: "Intermediate",
                      durationHours: 10,
                      rating: 4.9,
                      tags: [],
                      author: "",
                      modules: [],
                      coverImage: "",
                    },
                    "ar"
                  )
                : null;

              const displayCourseTitle = localizedCourse?.title || (isAr ? localizeText(item.courseTitle, "ar") : item.courseTitle);
              const displayLessonTitle = isAr
                ? localizeText(item.lesson.title, "ar")
                : item.lesson.title;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border flex items-start justify-between gap-3.5 transition-all duration-200 ${
                    item.isRemedial
                      ? "bg-cyan-500/10 dark:bg-cyan-950/25 border-cyan-300 dark:border-cyan-400/40 shadow-xs"
                      : "bg-slate-50/80 hover:bg-slate-100/90 dark:bg-[#0c1d27]/90 dark:hover:bg-[#102735] border-slate-200 dark:border-[#1b3b4a] hover:border-cyan-500/40 shadow-xs"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs sm:text-sm font-black shrink-0 mt-0.5 font-mono shadow-xs ${
                        item.isRemedial
                          ? "bg-cyan-500 text-white"
                          : "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30"
                      }`}
                    >
                      {item.priorityOrder}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] text-cyan-700 dark:text-cyan-400 font-semibold block line-clamp-2 text-wrap break-words mb-0.5">
                        {displayCourseTitle}
                      </span>
                      <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug break-words">
                        {displayLessonTitle}
                      </h5>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-500 dark:text-[#73A5AD] font-medium flex items-center gap-1">
                          {item.isRemedial ? (
                            <span className="text-cyan-700 dark:text-cyan-300 font-bold">
                              ⚠️ {isAr ? "تعزيز علاجي للمتطلبات" : "Prerequisite Booster"}
                            </span>
                          ) : (
                            <span className="text-slate-600 dark:text-[#82a4b3]">
                              📚 {isAr ? "المنهج القياسي" : "Standard Syllabus"}
                            </span>
                          )}
                        </span>
                        {item.lesson.durationMinutes && (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                            • {item.lesson.durationMinutes} {isAr ? "د" : "min"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const c = courses.find((x) => x.id === item.courseId);
                      if (c && onSelectCourse) onSelectCourse(c);
                    }}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-200/90 dark:bg-[#142e3d] hover:bg-cyan-500 text-slate-700 dark:text-cyan-300 hover:text-slate-950 transition-all shrink-0 mt-0.5 shadow-xs active:scale-95"
                    title={isAr ? "بدء الدرس" : "Start Lesson"}
                  >
                    {isAr ? (
                      <ArrowLeft className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Growth Areas & Socratic AI Focus Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#07151e] border border-slate-200 dark:border-[#163647] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-700 dark:text-[#73A5AD] font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
              {isAr ? "التركيز السقراطي:" : "Socratic Focus:"}
            </span>
            {recommendation.growthAreas.length > 0 ? (
              recommendation.growthAreas.map((area, i) => (
                <button
                  key={i}
                  onClick={() => onOpenSocraticTutor && onOpenSocraticTutor(area)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#0e222e] hover:bg-cyan-100 dark:hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30 text-[11px] font-semibold transition-all shadow-xs active:scale-95"
                  title={isAr ? "استشارة المعلم السقراطي لتوجيه فوري" : "Ask Socratic Tutor for immediate coaching"}
                >
                  {isAr ? localizeText(area, "ar") : area}
                </button>
              ))
            ) : (
              <span className="text-cyan-700 dark:text-cyan-400 font-semibold">
                {isAr
                  ? "كافة المفاهيم المكتملة أعلى من حاجز 70%! تقدم ممتاز."
                  : "All completed concepts above 70% threshold! Excellent progress."}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-600 dark:text-[#6d94a8] text-[11px] font-medium">
              {isAr ? "المستوى التكيفي:" : "Adaptive Level:"}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-bold uppercase text-[10px] border border-cyan-300 dark:border-cyan-500/30 font-mono">
              {recommendation.recommendedAdaptiveLevel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
