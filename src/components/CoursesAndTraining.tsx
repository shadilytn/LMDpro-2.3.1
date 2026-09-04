import React from "react";
import { 
  BookOpen, 
  Search, 
  Filter, 
  Clock, 
  Award, 
  TrendingUp, 
  Play, 
  CheckCircle2, 
  Lock, 
  ArrowUpRight,
  Flame,
  Zap,
  Sparkles,
  Layers,
  GraduationCap
} from "lucide-react";
import { Course, StudentProgress, UserProfile } from "../shared/types";
import { ThemedCourseImage } from "./ThemedCourseImage";
import { AdaptiveLearningPathAdvisor } from "./AdaptiveLearningPathAdvisor";
import { getTranslation, getLocalizedCourses } from "../shared/localization";

interface CoursesAndTrainingProps {
  courses?: Course[];
  onSelectCourse?: (course: Course) => void;
  progressMap?: Record<string, StudentProgress>;
  user?: UserProfile;
}

export const CoursesAndTraining: React.FC<CoursesAndTrainingProps> = ({ 
  courses = [], 
  onSelectCourse,
  progressMap = {},
  user
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [selectedLevel, setSelectedLevel] = React.useState<string>("All");

  const lang = user?.language || "en";
  const isAr = lang === "ar";
  const t = getTranslation(lang);

  // Get localized courses list
  const localizedCoursesList = React.useMemo(() => {
    return getLocalizedCourses(courses, lang);
  }, [courses, lang]);

  const categories = React.useMemo(() => {
    const set = new Set<string>(["All"]);
    localizedCoursesList.forEach(c => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [localizedCoursesList]);

  const filteredCourses = React.useMemo(() => {
    return localizedCoursesList.filter((c) => {
      const matchSearch =
        searchQuery.trim() === "" ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.tags && c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      
      const matchCategory = selectedCategory === "All" || c.category === selectedCategory;
      const matchLevel = selectedLevel === "All" || c.level === selectedLevel;

      return matchSearch && matchCategory && matchLevel;
    });
  }, [localizedCoursesList, searchQuery, selectedCategory, selectedLevel]);

  // Difficulty badge styling helper
  const getDifficultyBadge = (level: string) => {
    switch (level?.toLowerCase()) {
      case "beginner":
      case "مبتدئ":
        return {
          bg: "bg-cyan-950/80 border-cyan-500/30 text-cyan-400",
          dot: "bg-cyan-400",
          label: isAr ? "مبتدئ" : "Beginner"
        };
      case "intermediate":
      case "متوسط":
        return {
          bg: "bg-cyan-950/80 border-cyan-500/30 text-cyan-300",
          dot: "bg-cyan-400",
          label: isAr ? "متوسط" : "Intermediate"
        };
      case "advanced":
      case "متقدم":
        return {
          bg: "bg-cyan-950/80 border-cyan-500/30 text-cyan-400",
          dot: "bg-cyan-400",
          label: isAr ? "متقدم" : "Advanced"
        };
      case "expert":
      case "خبير":
      case "all levels":
      default:
        return {
          bg: "bg-cyan-950/80 border-cyan-500/30 text-cyan-300",
          dot: "bg-cyan-400",
          label: level || (isAr ? "جميع المستويات" : "All Levels")
        };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#5BC4D4]/10 border border-[#5BC4D4]/30 text-[#5BC4D4] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              <GraduationCap className="w-3 h-3" />
              {isAr ? "أكاديمية LMDpro المستقلة" : "LMDpro Autonomous Academy"}
            </span>
            <span className="text-[10px] text-[#73A5AD] font-mono">Curriculum v3.0</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            {isAr ? "المساقات الأكاديمية و" : "Academic Courses & "}<span className="text-[#5BC4D4]">{isAr ? "التدريب التنفيذي" : "Executive Training"}</span>
          </h1>
          <p className="text-[#73A5AD] max-w-2xl text-sm leading-relaxed">
            {isAr
              ? "تعلم الهندسة المتقدمة، الإجماع الموزع، الحوسبة العصبية، وهياكل الذكاء الاصطناعي في بيئة مستقلة وموجهة بالوكلاء."
              : "Master high-degree engineering, distributed consensus, neuromorphic computing, and AI architectures in an autonomous, agent-guided ecosystem."}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#73A5AD] absolute start-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "ابحث عن المقررات والوسوم والمفاهيم..." : "Search courses, tags, concepts..."} 
              className="ps-9 pe-4 py-2 rounded-xl bg-[#030b10]/80 border border-[#143242] text-sm text-white placeholder-[#5e8292] focus:outline-none focus:border-[#5BC4D4] transition-all w-64"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#030b10]/80 border border-[#143242] text-xs text-[#73A5AD] focus:text-white focus:outline-none focus:border-[#5BC4D4] transition-all"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-[#0c1a24] text-white">
                {cat === "All" ? (isAr ? "جميع التصنيفات" : "All Categories") : cat}
              </option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#030b10]/80 border border-[#143242] text-xs text-[#73A5AD] focus:text-white focus:outline-none focus:border-[#5BC4D4] transition-all"
          >
            <option value="All" className="bg-[#0c1a24] text-white">{isAr ? "جميع المستويات" : "All Levels"}</option>
            <option value="Beginner" className="bg-[#0c1a24] text-white">{isAr ? "مبتدئ" : "Beginner"}</option>
            <option value="Intermediate" className="bg-[#0c1a24] text-white">{isAr ? "متوسط" : "Intermediate"}</option>
            <option value="Advanced" className="bg-[#0c1a24] text-white">{isAr ? "متقدم" : "Advanced"}</option>
          </select>
        </div>
      </div>

      {/* Stats Quick Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: isAr ? "المساقات المتاحة" : "Curated Courses", value: `${courses.length}+ ${isAr ? "وحدة" : "Modules"}`, icon: BookOpen, color: "text-[#5BC4D4]" },
          { label: isAr ? "الساعات الأكاديمية" : "Academic Hours", value: `${courses.reduce((acc, c) => acc + (c.durationHours || 8), 0)} ${isAr ? "ساعة" : "hrs"}`, icon: Clock, color: "text-[#34d399]" },
          { label: isAr ? "المهارات المعتمدة" : "Accredited Skills", value: isAr ? "48 كفاءة مهنية" : "48 Competencies", icon: Award, color: "text-[#a855f7]" },
          { label: isAr ? "الترتيب العام" : "Global Ranking", value: isAr ? "أعلى 1% سرب" : "Top 1% Swarm", icon: TrendingUp, color: "text-[#f59e0b]" },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-2xl bg-[#030b10]/60 backdrop-blur-md border border-[#143242] flex items-center gap-4 hover:border-cyan-500/30 transition-all">
            <div className={`p-2.5 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-[#73A5AD] uppercase font-bold tracking-wider">{stat.label}</div>
              <div className="text-lg font-black text-white">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Adaptive Learning Path Recommendation Engine */}
      <AdaptiveLearningPathAdvisor
        courses={courses}
        progressMap={progressMap}
        user={user}
        onSelectCourse={onSelectCourse}
      />

      {/* Main Course Grid (2 Columns Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => {
            const totalLessons = course.modules
              ? course.modules.reduce((acc, m) => acc + m.lessons.length, 0)
              : (course.lessons?.length || 10);
            
            const progress = progressMap[course.id];
            const completedCount = progress?.completedLessonIds?.length || 0;
            const progressPct = progress?.overallProgressPercentage !== undefined
              ? progress.overallProgressPercentage
              : totalLessons > 0
              ? Math.min(100, Math.round((completedCount / totalLessons) * 100))
              : 0;

            const hasStarted = progressPct > 0 || completedCount > 0;
            const isCompleted = progressPct >= 100;

            // Estimated time remaining or total time to complete
            const totalHours = course.durationHours || 8;
            const remainingHours = hasStarted
              ? Math.max(0.5, totalHours * (1 - progressPct / 100)).toFixed(1)
              : totalHours;

            const diffBadge = getDifficultyBadge(course.level);

            return (
              <div 
                key={course.id}
                onClick={() => onSelectCourse?.(course)}
                className="group relative rounded-3xl bg-[#030b10]/90 backdrop-blur-xl border border-[#143242] hover:border-[#5BC4D4]/60 transition-all overflow-hidden cursor-pointer flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10"
              >
                {/* Course Image / Themed Header Banner */}
                <div className="aspect-[21/9] w-full bg-[#0c1a24] relative overflow-hidden">
                  <ThemedCourseImage 
                    src={course.coverImage} 
                    alt={course.title}
                    category={course.category}
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030b10] via-[#030b10]/40 to-transparent opacity-95" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${diffBadge.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${diffBadge.dot}`} />
                        {diffBadge.label}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#030b10]/90 border border-[#143242] text-[10px] font-bold text-cyan-300">
                        {course.category}
                      </span>
                    </div>

                    {/* Time to Complete Estimate Badge */}
                    <div className="px-2.5 py-0.5 rounded-lg bg-[#030b10]/90 border border-cyan-500/30 text-[10px] font-mono text-cyan-200 font-bold flex items-center gap-1 shadow-md">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{hasStarted ? `${remainingHours} ${isAr ? "ساعة متبقية" : "h left"}` : `${totalHours} ${isAr ? "ساعة للإكمال" : "h to complete"}`}</span>
                    </div>
                  </div>

                  {/* Bottom Stats Overlay on Image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#030b10]/90 border border-[#143242] text-[10px] font-bold text-white">
                      <Play className="w-3 h-3 text-[#34d399] fill-current" />
                      <span>{totalLessons} {isAr ? "درس أكاديمي" : "Academic Lessons"}</span>
                    </div>
                    
                    {hasStarted && (
                      <span className="px-2.5 py-1 rounded-lg bg-cyan-950/90 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3 text-cyan-400" />
                        {progressPct}% {isAr ? "مكتمل" : "Completed"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar Overlay for Enrolled / In-Progress Students */}
                {hasStarted && (
                  <div className="w-full bg-[#08151c] border-b border-[#143242] px-6 py-2 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <span className="text-[#73A5AD]">{isAr ? "مستوى التقدم:" : "Course Progress:"}</span>
                      <span className="text-cyan-400 font-mono font-bold">{completedCount}/{totalLessons} {isAr ? "دروس" : "lessons"} ({progressPct}%)</span>
                    </div>
                    <div className="flex-1 max-w-[140px] h-1.5 rounded-full bg-[#143242] overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-cyan-400 transition-all duration-500 rounded-full"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Course Content */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#5BC4D4] uppercase tracking-widest font-mono">
                        {course.id}
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <div key={s} className={`w-1.5 h-1.5 rounded-full ${s <= (Math.round(course.rating || 5)) ? 'bg-[#5BC4D4]' : 'bg-[#143242]'}`} />
                        ))}
                        <span className="text-[10px] text-cyan-400 font-bold ml-1">{course.rating || 4.9}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-extrabold text-white text-lg group-hover:text-[#5BC4D4] transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    
                    <p className="text-xs text-[#73A5AD] line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Course Tags */}
                    {course.tags && course.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {course.tags.slice(0, 4).map((tag, tIdx) => (
                          <span key={tIdx} className="px-2 py-0.5 rounded-md bg-[#0a1b24] border border-[#1a3848] text-[10px] text-cyan-200/90 font-mono">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-[#143242]/50">
                    <div className="flex items-center -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className={`w-6 h-6 rounded-full border border-[#030b10] flex items-center justify-center text-[10px] font-bold text-white font-mono ${i === 1 ? 'bg-cyan-600' : i === 2 ? 'bg-cyan-600' : 'bg-cyan-600'}`}>
                          {i === 1 ? 'S' : i === 2 ? 'A' : 'M'}
                        </div>
                      ))}
                      <div className="w-6 h-6 rounded-full border border-[#030b10] bg-[#143242] flex items-center justify-center text-[8px] font-bold text-white font-mono">
                        +1.4k
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#34d399] group-hover:underline">
                        {isCompleted
                          ? (isAr ? "مراجعة المحتوى" : "Review Material")
                          : hasStarted
                          ? (isAr ? "متابعة المساق" : "Continue Course")
                          : (isAr ? "ابدأ التعلم الآن" : "Start Learning")}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-[#5BC4D4] transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full p-12 text-center rounded-3xl bg-[#030b10]/60 border border-[#143242] space-y-4">
            <BookOpen className="w-10 h-10 text-[#5e8292] mx-auto opacity-50" />
            <h3 className="text-base font-bold text-white">{isAr ? "لا توجد مساقات مطابقة للبحث" : "No Courses Matching Search"}</h3>
            <p className="text-xs text-[#73A5AD] max-w-sm mx-auto">
              {isAr
                ? `لم يتم العثور على وحدات أكاديمية لـ "${searchQuery}". جرّب اختيار "جميع التصنيفات" أو إعادة ضبط البحث.`
                : `No academic modules found for "${searchQuery}". Try selecting "All Categories" or reset your search.`}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedLevel("All");
              }}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all"
            >
              {isAr ? "إعادة ضبط التصفية" : "Reset Filters"}
            </button>
          </div>
        )}
      </div>

      {/* Featured / Specialized Training */}
      <div className="p-8 rounded-[40px] bg-gradient-to-br from-[#104A5A]/40 to-[#030b10] border border-[#143242] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5BC4D4]/5 blur-[120px] rounded-full" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#f59e0b] text-[10px] font-bold uppercase tracking-widest">
              <TrendingUp className="w-3 h-3" />
              High Demand Specialization
            </div>
            <h2 className="text-4xl font-black text-white leading-tight">
              Mastering <span className="text-[#5BC4D4]">Distributed Systems</span> & Consensus Protocols
            </h2>
            <p className="text-[#73A5AD] text-sm leading-relaxed max-w-md">
              Deep dive into the architecture of modern scalable systems. Learn Raft, Paxos, and byzantine fault tolerance in a rigorous, agent-guided environment.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => {
                  const distCourse = courses.find(c => c.id === "CS101" || c.title.toLowerCase().includes("distributed"));
                  if (distCourse) onSelectCourse?.(distCourse);
                }}
                className="px-6 py-3 rounded-2xl bg-[#5BC4D4] hover:bg-[#4ab3c3] text-black font-black text-xs shadow-xl shadow-[#5BC4D4]/20 transition-all active:scale-95"
              >
                Enroll Now (Free)
              </button>
              <button 
                onClick={() => {
                  const distCourse = courses.find(c => c.id === "CS101" || c.title.toLowerCase().includes("distributed"));
                  if (distCourse) onSelectCourse?.(distCourse);
                }}
                className="px-6 py-3 rounded-2xl bg-[#030b10]/60 border border-[#143242] text-white font-bold text-xs hover:bg-[#143242] transition-all"
              >
                View Syllabus
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Raft Algorithm", status: "Unlocked", icon: CheckCircle2 },
              { title: "Paxos Logic", status: "Unlocked", icon: CheckCircle2 },
              { title: "Vector Clocks", status: "In Progress", icon: Clock },
              { title: "Byzantine Safety", status: "Locked", icon: Lock },
            ].map((topic, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#030b10]/60 border border-[#143242] space-y-3">
                <div className={`p-2 rounded-lg bg-[#0c1a24] w-fit ${topic.status === 'Locked' ? 'text-gray-600' : 'text-[#5BC4D4]'}`}>
                  <topic.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{topic.title}</div>
                  <div className="text-[10px] text-[#73A5AD]">{topic.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
