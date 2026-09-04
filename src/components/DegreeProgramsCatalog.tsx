import React from "react";
import { DEGREE_PROGRAMS } from "../data/degreePrograms";
import { Course, UserProfile } from "../shared/types";
import { ThemedCourseImage } from "./ThemedCourseImage";
import { motion, AnimatePresence } from "motion/react";
import { toastService } from "../services/toastService";
import { getTranslation, getLocalizedDegree } from "../shared/localization";
import {
  GraduationCap,
  BookOpen,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  Award,
  ArrowRight,
  Brain,
  Compass,
  FileText,
  Bookmark,
  Scale,
  X,
  CheckCircle2,
  Sparkles,
  Layers,
  Filter,
  Shield,
  Code,
  Database,
  Server,
  Globe,
  Cpu,
  RefreshCw,
  Star,
} from "lucide-react";

interface DegreeProgramsCatalogProps {
  onSelectCourse: (course: Course) => void;
  user?: UserProfile;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
}

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (
    cat.includes("autonomous") ||
    cat.includes("cognitive") ||
    cat.includes("ai") ||
    cat.includes("agent")
  )
    return Brain;
  if (
    cat.includes("cyber") ||
    cat.includes("crypt") ||
    cat.includes("security") ||
    cat.includes("defense")
  )
    return Shield;
  if (
    cat.includes("cloud") ||
    cat.includes("distributed") ||
    cat.includes("server")
  )
    return Server;
  if (
    cat.includes("data") ||
    cat.includes("analytics") ||
    cat.includes("database")
  )
    return Database;
  if (
    cat.includes("software") ||
    cat.includes("development") ||
    cat.includes("code")
  )
    return Code;
  if (
    cat.includes("quantum") ||
    cat.includes("physics") ||
    cat.includes("hardware") ||
    cat.includes("cpu")
  )
    return Cpu;
  if (
    cat.includes("network") ||
    cat.includes("telecom") ||
    cat.includes("infrastructure")
  )
    return Globe;
  return Compass;
};

export const DegreeProgramsCatalog: React.FC<DegreeProgramsCatalogProps> = ({
  onSelectCourse,
  user,
  onUpdateUser,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDegreeLevel, setSelectedDegreeLevel] = React.useState<string>("All");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  const lang = user?.language || "en";
  const isAr = lang === "ar";
  const t = getTranslation(lang);

  // Localized degree programs
  const localizedPrograms = React.useMemo(() => {
    return DEGREE_PROGRAMS.map((prog) => getLocalizedDegree(prog, lang));
  }, [lang]);

  // Fallback state for bookmarked degrees if user context is missing
  const [savedLocalProgramIds, setSavedLocalProgramIds] = React.useState<string[]>(
    () => {
      try {
        const stored = localStorage.getItem("SavedDegrees");
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    },
  );

  const savedProgramIds = React.useMemo(() => {
    return (user as any)?.savedDegrees || savedLocalProgramIds;
  }, [user, savedLocalProgramIds]);

  const [showSavedOnly, setShowSavedOnly] = React.useState<boolean>(false);
  const [comparedPrograms, setComparedPrograms] = React.useState<Course[]>([]);
  const [showCompareModal, setShowCompareModal] = React.useState<boolean>(false);
  const [previewProgram, setPreviewProgram] = React.useState<Course | null>(null);

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    localizedPrograms.forEach((p) => set.add(p.category));
    return ["All", ...Array.from(set)];
  }, [localizedPrograms]);

  const toggleBookmark = (id: string) => {
    const isSaved = savedProgramIds.includes(id);
    const updated = isSaved
      ? savedProgramIds.filter((item: string) => item !== id)
      : [...savedProgramIds, id];

    if (onUpdateUser && user) {
      onUpdateUser({ savedDegrees: updated } as any);
    } else {
      setSavedLocalProgramIds(updated);
      try {
        localStorage.setItem("SavedDegrees", JSON.stringify(updated));
      } catch {}
    }

    if (isSaved) {
      toastService.info(
        isAr ? "تمت إزالة البرنامج من القائمة المحفوظة." : "Removed program from saved list.",
        isAr ? "تمت إزالة الحفظ" : "Bookmark Removed"
      );
    } else {
      toastService.success(
        isAr ? "تم حفظ البرنامج الأكاديمي بنجاح!" : "Degree program bookmarked successfully!",
        isAr ? "تم الحفظ لوقت لاحق" : "Saved for Later",
      );
    }
  };

  const toggleCompare = (prog: Course) => {
    setComparedPrograms((prev) => {
      const exists = prev.some((p) => p.id === prog.id);
      let updated: Course[] = [];
      if (exists) {
        updated = prev.filter((p) => p.id !== prog.id);
      } else {
        if (prev.length >= 3) {
          toastService.warning(
            isAr ? "يمكنك مقارنة ما يصل إلى 3 برامج في وقت واحد." : "You can compare up to 3 programs at once.",
            isAr ? "حد المقارنة" : "Comparison Limit",
          );
          return prev;
        }
        updated = [...prev, prog];
      }

      // Auto-open comparison slide-over panel when we have at least 2 programs compared
      if (updated.length >= 2) {
        setShowCompareModal(true);
      }
      return updated;
    });
  };

  const handleQuickEnroll = (prog: Course) => {
    if (user && onUpdateUser) {
      const isEnrolled = user.enrolledCourseIds.includes(prog.id);
      if (isEnrolled) {
        toastService.info(
          isAr ? `أنت مسجل بالفعل في ${prog.title}.` : `You are already enrolled in ${prog.title}.`,
          isAr ? "مسجل مسبقاً" : "Already Enrolled",
        );
        return;
      }
      const updatedEnrollments = [...user.enrolledCourseIds, prog.id];
      onUpdateUser({ enrolledCourseIds: updatedEnrollments });
      toastService.success(
        isAr ? `تم تسجيلك بنجاح في ${prog.title}!` : `You have successfully enrolled in ${prog.title}!`,
        isAr ? "نجاح التسجيل السريع" : "Quick Enroll Success",
      );
    } else {
      toastService.success(
        isAr ? `تم التسجيل بنجاح في ${prog.title}!` : `Successfully enrolled in ${prog.title}!`,
        isAr ? "تم التسجيل" : "Enrolled",
      );
    }
  };

  // Filter programs cleanly
  const filteredPrograms = React.useMemo(() => {
    return localizedPrograms.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLevel =
        selectedDegreeLevel === "All" ||
        (selectedDegreeLevel === "Master" &&
          (p.degreeMetadata.degreeLevel.includes("Master") || p.degreeMetadata.degreeLevel.includes("ماجستير"))) ||
        (selectedDegreeLevel === "Bachelor" &&
          (p.degreeMetadata.degreeLevel.includes("Bachelor") || p.degreeMetadata.degreeLevel.includes("بكالوريوس"))) ||
        (selectedDegreeLevel === "Doctorate" &&
          (p.degreeMetadata.degreeLevel.includes("Ph.D") ||
            p.degreeMetadata.degreeLevel.includes("Doctor") ||
            p.degreeMetadata.degreeLevel.includes("دكتوراه"))) ||
        (selectedDegreeLevel === "PostDoc" &&
          (p.degreeMetadata.degreeLevel.includes("Post-Doc") ||
            p.degreeMetadata.degreeLevel.includes("Research") ||
            p.degreeMetadata.degreeLevel.includes("أبحاث")));

      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;

      const matchesSaved = !showSavedOnly || savedProgramIds.includes(p.id);

      return matchesSearch && matchesLevel && matchesCategory && matchesSaved;
    });
  }, [
    localizedPrograms,
    searchQuery,
    selectedDegreeLevel,
    selectedCategory,
    showSavedOnly,
    savedProgramIds,
  ]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage) || 1;

  // Paginated items
  const currentPrograms = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPrograms.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPrograms, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 400, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* 1. Hero Section - Liquid Glass Slate Theme */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0c1a24] via-[#08151c] to-[#030b10] border border-[#1b3b4a] p-8 md:p-12 text-center shadow-2xl">
        <div className="absolute inset-0 bg-cyan-500/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isAr ? "المسارات الأكاديمية المعتمدة لـ LMD" : "Accredited LMD Academic Pathways"}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {isAr ? "دليل البرامج والدرجات الأكاديمية" : "Accredited Degree Pathways"}
          </h1>
          <p className="text-sm text-[#82a4b3] leading-relaxed max-w-2xl mx-auto">
            {isAr
              ? "تخصصات دراسية معتمدة كلياً عبر مجالات أكاديمية شاملة. استكشف الفصول الدراسية، المسارات التعليمية، الأدوات التخصصية، ومشاريع التخرج المحكمة علمياً."
              : "Fully accredited degree specializations across comprehensive academic domains. Explore structured semester modules, learning paths, specialized tools, capstone defenses, and peer-reviewed curricula."}
          </p>
        </div>
      </div>

      {/* 2. High-Fidelity Search & Filter Controls */}
      <div className="rounded-2xl bg-[#0c1a24]/40 backdrop-blur-xl border border-[#1b3b4a]/60 p-6 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-extrabold text-white">
                {isAr ? "دليل البرامج الأكاديمية" : "Academic Degree Catalog"}
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">
              {isAr
                ? "تصفح المناهج والمسارات المعتمدة من المجلس الأكاديمي لـ LMD"
                : "Browse curriculum pathways verified by LMD Academic Board"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {comparedPrograms.length > 0 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-semibold hover:bg-cyan-900/60 transition-colors"
              >
                <Scale className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>{isAr ? "مقارنة" : "Compare"}</span>
              </button>
            )}

            <button
              onClick={() => {
                setShowSavedOnly(!showSavedOnly);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                showSavedOnly
                  ? "bg-cyan-950/60 border-cyan-500/40 text-cyan-300"
                  : "bg-[#07030e]/60 border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Bookmark
                className={`w-3.5 h-3.5 ${showSavedOnly ? "text-cyan-400 fill-current" : "text-cyan-500"}`}
              />
              <span>{isAr ? "المحفوظات" : "Saved"}</span>
            </button>

            <span className="text-cyan-400 bg-cyan-950/40 px-3 py-2 rounded-xl border border-cyan-500/20 font-medium">
              {isAr ? "البرامج المتاحة" : "Academic Pathways"}
            </span>
          </div>
        </div>

        {/* Search Bar and Level Selection Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Enhanced Search Input */}
          <div className="relative md:col-span-2">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/80" />
            <input
              type="text"
              placeholder={isAr ? "ابحث عن التخصصات والمقررات والكلمات المفتاحية..." : "Search accredited degree titles, requirements, or keywords..."}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full ps-10 pe-10 py-3 rounded-xl bg-[#07030e]/80 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="absolute end-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                title={isAr ? "مسح البحث" : "Clear search"}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Level Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedDegreeLevel}
              onChange={(e) => {
                setSelectedDegreeLevel(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3.5 py-3 rounded-xl bg-[#07030e]/80 border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30 transition-all appearance-none cursor-pointer"
            >
              <option value="All">{isAr ? "جميع المستويات الأكاديمية" : "All Degree Levels"}</option>
              <option value="Bachelor">{isAr ? "درجات البكالوريوس" : "Bachelor's Degrees"}</option>
              <option value="Master">{isAr ? "درجات الماجستير" : "Master's Degrees"}</option>
              <option value="Doctorate">{isAr ? "الدكتوراه والبحوث المتقدمة" : "Doctorate & Ph.D. Level"}</option>
              <option value="PostDoc">{isAr ? "أبحاث ما بعد الدكتوراه" : "Post-Doctoral Research"}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 end-3.5 flex items-center text-slate-400">
              <ChevronRight className="w-4 h-4 transform rotate-90 rtl:-rotate-90" />
            </div>
          </div>
        </div>

        {/* Disciplines Bento Grid Filter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider px-1">
            <span className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isAr ? "تصفية حسب المجال الأكاديمي" : "Filter by Academic Domains"}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {categories.map((cat) => {
              const IconComponent = getCategoryIcon(cat);
              const isSelected = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[11px] font-semibold text-left transition-all ${
                    isSelected
                      ? "bg-cyan-600/20 border-cyan-500/60 text-cyan-200 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/20"
                      : "bg-[#07030e]/60 border-white/5 text-slate-400 hover:border-cyan-500/30 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <IconComponent
                    className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-cyan-400" : "text-[#8a79a8]"}`}
                  />
                  <span className="truncate flex-1">
                    {cat}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Clear Filters / Active Indicator */}
        {(searchQuery ||
          selectedDegreeLevel !== "All" ||
          selectedCategory !== "All" ||
          showSavedOnly) && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 text-cyan-200">
              <span className="font-semibold">Active Criteria:</span>
              {searchQuery && (
                <span className="px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-[10px] flex items-center gap-1 font-mono">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedDegreeLevel !== "All" && (
                <span className="px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-[10px] flex items-center gap-1 font-mono">
                  Level: {selectedDegreeLevel}
                  <button
                    onClick={() => {
                      setSelectedDegreeLevel("All");
                      setCurrentPage(1);
                    }}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== "All" && (
                <span className="px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-[10px] flex items-center gap-1 font-mono">
                  Domain: {selectedCategory}
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setCurrentPage(1);
                    }}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {showSavedOnly && (
                <span className="px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-[10px] flex items-center gap-1 font-mono">
                  Saved Only
                  <button
                    onClick={() => {
                      setShowSavedOnly(false);
                      setCurrentPage(1);
                    }}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDegreeLevel("All");
                setSelectedCategory("All");
                setShowSavedOnly(false);
                setCurrentPage(1);
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-500/30 hover:text-white transition-colors font-bold text-[10px] uppercase tracking-wider"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>



      {/* 6. Programs Grid View */}
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
        initial="hidden"
        animate="show"
        key={`${currentPage}-${searchQuery}-${selectedDegreeLevel}-${selectedCategory}-${showSavedOnly}`}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {currentPrograms.map((prog, index) => {
          const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
          const isMaster = prog.degreeMetadata?.degreeLevel?.includes("Master");
          const isDoctorate = prog.degreeMetadata?.degreeLevel?.includes("Ph.D") || prog.degreeMetadata?.degreeLevel?.includes("Doctor");
          const isSaved = savedProgramIds.includes(prog.id);
          const isCompared = comparedPrograms.some((p) => p.id === prog.id);
          const isEnrolled =
            user?.enrolledCourseIds?.includes(prog.id) || false;

          return (
            <motion.div
              key={prog.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 100, damping: 15 },
                },
              }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              onClick={() => setPreviewProgram(prog)}
              className="group relative rounded-3xl bg-[#0c1a24]/70 backdrop-blur-xl border border-[#1b3b4a]/70 hover:border-cyan-500/50 p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-950/30 flex flex-col justify-between h-full overflow-hidden cursor-pointer"
            >
              <div>
                {/* Compact Glass-morphic Banner with Image */}
                <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden mb-5 border border-white/10 shadow-inner">
                  <ThemedCourseImage
                    src={prog.coverImage}
                    alt={prog.title}
                    category={prog.category}
                    variant="degree"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08151c] via-[#08151c]/40 to-transparent" />

                  {/* Floating badges */}
                  <div className="absolute top-2.5 start-2.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono text-cyan-300 font-bold bg-[#0c1a24]/90 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg backdrop-blur-md">
                      {isAr ? "درجة معتمدة" : "Accredited Degree"}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border backdrop-blur-md ${
                        isDoctorate
                          ? "bg-cyan-950/90 border-cyan-500/40 text-cyan-200"
                          : isMaster
                          ? "bg-cyan-950/90 border-cyan-500/40 text-cyan-200"
                          : "bg-cyan-950/90 border-cyan-500/40 text-cyan-200"
                      }`}
                    >
                      {prog.degreeMetadata?.degreeLevel
                        ?.replace("Science (B.S.)", "B.S.")
                        .replace("Science (M.S.)", "M.S.")
                        .replace("Engineering (B.Eng.)", "B.Eng.")
                        .replace("Engineering (M.Eng.)", "M.Eng.") || (isAr ? "درجة" : "Degree")}
                    </span>
                  </div>

                  {/* Top-right floating controls: Compare Checkbox and Star Bookmark */}
                  <div className="absolute top-2.5 end-2.5 flex items-center gap-1.5">
                    {/* Compare Checkbox */}
                    <label
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0c1a24]/90 border border-[#1b3b4a] text-[10px] text-slate-300 font-bold hover:bg-[#10222b] cursor-pointer transition-all backdrop-blur-md select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isCompared}
                        onChange={() => toggleCompare(prog)}
                        className="w-3 h-3 rounded border-[#1b3b4a] text-cyan-500 focus:ring-cyan-500/20 bg-slate-950/60 cursor-pointer"
                      />
                      <span>{isAr ? "مقارنة" : "Compare"}</span>
                    </label>

                    {/* Star Bookmark */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(prog.id);
                      }}
                      className={`p-1.5 rounded-lg border backdrop-blur-md transition-all ${
                        isSaved
                          ? "bg-[#0c1a24]/90 border-cyan-500/50 text-cyan-400"
                          : "bg-[#0c1a24]/90 border-[#1b3b4a] text-slate-400 hover:text-white"
                      }`}
                      title={isSaved ? (isAr ? "إزالة الحفظ" : "Remove Bookmark") : (isAr ? "حفظ لوقت لاحق" : "Bookmark for Later")}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`}
                      />
                    </button>
                  </div>

                  {/* Academic Metrics at base of image */}
                  <div className="absolute bottom-2.5 start-2.5 end-2.5 flex items-center justify-between text-[11px] text-cyan-200 font-medium">
                    <span className="flex items-center gap-1.5 bg-[#08151c]/90 px-2.5 py-1 rounded-lg border border-cyan-500/20 backdrop-blur-md">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{prog.durationHours} {isAr ? "ساعة" : "Hours"}</span>
                    </span>
                    <span className="flex items-center gap-1.5 bg-[#08151c]/90 px-2.5 py-1 rounded-lg border border-cyan-500/20 backdrop-blur-md">
                      <Award className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{prog.degreeMetadata?.credits} {isAr ? "ساعة معتمدة" : "Credits"}</span>
                    </span>
                  </div>
                </div>

                {/* Domain & Title */}
                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                    {prog.category}
                  </div>
                  <h3 className="text-lg font-black text-white group-hover:text-cyan-200 transition-colors line-clamp-2 min-h-[3.25rem] leading-snug">
                    {prog.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4 mt-2">
                  {prog.description}
                </p>

                {/* Tag pill filters */}
                <div className="flex flex-wrap items-center gap-1.5 mb-5 mt-auto">
                  {prog.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-300 font-medium whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-2.5 pt-4 border-t border-[#1b3b4a]/60 mt-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewProgram(prog);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all"
                  title="View Program details & Curriculum"
                >
                  {isAr ? "عرض التفاصيل" : "View Details"}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickEnroll(prog);
                  }}
                  disabled={isEnrolled}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98] ${
                    isEnrolled
                      ? "bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 text-white shadow-lg shadow-cyan-950/30"
                  }`}
                >
                  {isEnrolled ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isAr ? "مسجل بالبرنامج" : "Enrolled"}</span>
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>{isAr ? "تسجيل سريع" : "Quick Enroll"}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* 7. Pagination Controls */}
      <div className="flex items-center justify-between pt-6 border-t border-white/5 text-xs">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#0c1a24] border border-[#1b3b4a]/80 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-cyan-950/30 hover:border-cyan-500/30 transition-all"
        >
          <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{isAr ? "السابق" : "Previous"}</span>
        </button>

        <span className="text-slate-400">
          {isAr ? "صفحة " : "Page "}<strong className="text-white font-mono">{currentPage}</strong>{" "}
          {isAr ? "من " : "of "}<strong className="text-white font-mono">{totalPages}</strong>
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#0c1a24] border border-[#1b3b4a]/80 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-cyan-950/30 hover:border-cyan-500/30 transition-all"
        >
          <span>{isAr ? "التالي" : "Next"}</span>
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      </div>

      {/* 8. Full-Screen Glass-Morphic Preview Modal */}
      <AnimatePresence>
        {previewProgram && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-5xl h-full md:h-[90vh] md:max-h-[900px] bg-[#07131b]/95 border md:border-[#1b3b4a] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white"
            >
              {/* Banner with absolute overlay */}
              <div className="relative h-60 sm:h-80 w-full shrink-0">
                <ThemedCourseImage
                  src={previewProgram.coverImage}
                  alt={previewProgram.title}
                  category={previewProgram.category}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07131b] via-[#07131b]/50 to-transparent" />

                {/* Header Action Buttons on top of image */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase bg-cyan-900/90 text-cyan-200 border border-cyan-500/40 px-3 py-1 rounded-full backdrop-blur-md">
                    {previewProgram.category}
                  </span>
                  <button
                    onClick={() => setPreviewProgram(null)}
                    className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 border border-white/10 text-gray-300 hover:text-white transition-all backdrop-blur-md"
                    title="Close Panel"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Academic Info Overlaid at bottom of banner */}
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase block mb-1">
                    {(previewProgram as any).degreeMetadata?.degreeLevel}{" "}
                    Academic Pathway
                  </span>
                  <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
                    {previewProgram.title}
                  </h2>
                </div>
              </div>

              {/* Scrollable contents split in two columns */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Summary and Curriculum */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                        Extended Program Information
                      </h3>
                      <p className="text-sm text-slate-200 leading-relaxed">
                        {previewProgram.description}
                      </p>
                    </div>

                    {/* Curriculum section */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                        <Layers className="w-4 h-4 text-cyan-400" />
                        <span>Interactive Curriculum Preview</span>
                      </h3>
                      <div className="space-y-3">
                        {previewProgram.modules.map((mod, idx) => (
                          <div
                            key={mod.id}
                            className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/10 transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                                Module 0{idx + 1}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {mod.lessons.length} structured chapters
                              </span>
                            </div>
                            <h4 className="text-sm font-extrabold text-white">
                              {mod.title}
                            </h4>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                              {mod.lessons.map((lesson) => (
                                <li
                                  key={lesson.id}
                                  className="flex items-center gap-1.5 bg-[#07030e]/40 p-2 rounded border border-white/5"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                  <span className="truncate">
                                    {lesson.title}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Structured Learning Path */}
                    {(previewProgram.degreeMetadata as any)?.learningPath && (
                      <div className="space-y-3 pt-2 border-t border-white/10">
                        <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                          <Compass className="w-4 h-4 text-cyan-400" />
                          <span>Structured Degree Learning Path</span>
                        </h3>
                        <div className="space-y-3">
                          {(
                            (previewProgram.degreeMetadata as any)
                              .learningPath as any[]
                          ).map((phaseItem, pIdx) => (
                            <div
                              key={pIdx}
                              className="p-4 rounded-xl bg-[#0c1a24]/80 border border-cyan-500/20 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                                  {phaseItem.phase}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {phaseItem.durationMonths} Months
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-white">
                                {phaseItem.title}
                              </h4>
                              <p className="text-xs text-slate-300">
                                {phaseItem.description}
                              </p>
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {(phaseItem.keyCompetencies as string[]).map(
                                  (comp, cIdx) => (
                                    <span
                                      key={cIdx}
                                      className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                                    >
                                      {comp}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommended Tools & Environment */}
                    {(previewProgram.degreeMetadata as any)
                      ?.recommendedTools && (
                      <div className="space-y-3 pt-2 border-t border-white/10">
                        <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-cyan-400" />
                          <span>Recommended Industry Tools & Stacks</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {(
                            (previewProgram.degreeMetadata as any)
                              .recommendedTools as any[]
                          ).map((tool, tIdx) => (
                            <div
                              key={tIdx}
                              className="p-3 rounded-xl bg-[#08151c] border border-cyan-500/20 space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <strong className="text-xs text-cyan-200">
                                  {tool.name}
                                </strong>
                                <span className="text-[9px] text-slate-400 font-mono px-1.5 py-0.5 bg-white/5 rounded">
                                  {tool.category}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-tight">
                                {tool.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Educational Materials & Reference Papers */}
                    {(previewProgram.degreeMetadata as any)
                      ?.educationalMaterials && (
                      <div className="space-y-3 pt-2 border-t border-white/10">
                        <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-cyan-400" />
                          <span>Educational Materials & References</span>
                        </h3>
                        <div className="space-y-2">
                          {(
                            (previewProgram.degreeMetadata as any)
                              .educationalMaterials as any[]
                          ).map((mat, mIdx) => (
                            <div
                              key={mIdx}
                              className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-cyan-200">
                                  {mat.title}
                                </span>
                                <span className="text-[9px] font-mono text-cyan-400 px-1.5 py-0.5 bg-cyan-500/10 rounded">
                                  {mat.type}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 block font-mono">
                                {mat.authorOrSource}
                              </span>
                              <p className="text-[11px] text-slate-300">
                                {mat.summary}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Outcomes, Accreditations & CTAs */}
                  <div className="space-y-6">
                    {/* Stats Box */}
                    <div className="p-5 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-3.5">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                        Key Metrics
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="bg-[#07030e] p-3 rounded-xl border border-white/5">
                          <span className="text-xs text-slate-400 block mb-1">
                            Duration
                          </span>
                          <strong className="text-xl font-bold font-mono text-cyan-300">
                            {previewProgram.durationHours}h
                          </strong>
                        </div>
                        <div className="bg-[#07030e] p-3 rounded-xl border border-white/5">
                          <span className="text-xs text-slate-400 block mb-1">
                            ECTS Credits
                          </span>
                          <strong className="text-xl font-bold font-mono text-cyan-300">
                            {(previewProgram as any).degreeMetadata?.credits}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Career Outcomes checklist */}
                    <div className="p-5 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-4">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                        Target Career Outcomes
                      </h4>
                      <div className="space-y-2.5">
                        {(
                          (previewProgram as any).degreeMetadata
                            ?.careerOutcomes || [
                            "AI System Architect",
                            "Distinguished Machine Learning Engineer",
                            "Lead Robotics Researcher",
                            "SaaS Engineering Specialist",
                          ]
                        ).map((outcome: string) => (
                          <div
                            key={outcome}
                            className="flex items-start gap-2 text-xs text-slate-200"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Accreditations Box */}
                    <div className="p-5 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-3">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                        Accreditations & Quality
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-slate-200">
                          <Shield className="w-4 h-4 text-cyan-400" />
                          <span>ISO 9001:2015 Educational Standard</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-200">
                          <Award className="w-4 h-4 text-cyan-400" />
                          <span>LMD Academic Framework Compatible</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer actions bar */}
              <div className="p-5 border-t border-[#1b3b4a] bg-[#0c1a24] flex items-center justify-between">
                <button
                  onClick={() => toggleBookmark(previewProgram.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#1b3b4a] text-xs font-bold hover:bg-white/5 text-slate-300 transition-all"
                >
                  <Star
                    className={`w-4 h-4 ${savedProgramIds.includes(previewProgram.id) ? "fill-cyan-400 text-cyan-400" : "text-slate-400"}`}
                  />
                  <span>
                    {savedProgramIds.includes(previewProgram.id)
                      ? "Saved"
                      : "Save for Later"}
                  </span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPreviewProgram(null)}
                    className="px-4 py-2.5 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white text-xs font-bold transition-all"
                  >
                    Close Preview
                  </button>
                  <button
                    onClick={() => {
                      const p = previewProgram;
                      setPreviewProgram(null);
                      handleQuickEnroll(p);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-extrabold shadow-lg shadow-cyan-950/40 transition-all flex items-center gap-1.5"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Enroll Now & Access</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9. Slide-Over Side Comparison Panel */}
      <AnimatePresence>
        {showCompareModal && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCompareModal(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Sliding Content Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-4xl h-full bg-[#07131b]/95 border-l border-[#1b3b4a] backdrop-blur-3xl shadow-2xl p-6 sm:p-8 flex flex-col space-y-6 overflow-y-auto text-white"
            >
              <div className="flex items-center justify-between border-b border-[#1b3b4a] pb-4">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white">
                      Compare Degree Pathways
                    </h3>
                    <p className="text-xs text-slate-400">
                      Comparing {comparedPrograms.length} of 3 selected programs
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all border border-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {comparedPrograms.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <Scale className="w-12 h-12 text-slate-500 animate-pulse" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-base">
                      No programs selected for comparison
                    </h4>
                    <p className="text-xs text-slate-400 max-w-md">
                      Select up to 3 programs using the checkboxes on each card
                      to compare their curriculums side-by-side.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto flex-1 pb-10">
                  {comparedPrograms.map((prog) => {
                    const isEnrolled =
                      user?.enrolledCourseIds?.includes(prog.id) || false;
                    return (
                      <div
                        key={prog.id}
                        className="p-5 rounded-2xl bg-[#0c1a24]/80 border border-[#1b3b4a]/80 shadow-lg space-y-4 flex flex-col justify-between hover:border-cyan-500/30 transition-all"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-bold px-2 py-0.5 rounded">
                              {(prog as any).degreeMetadata?.degreeLevel}
                            </span>
                            <button
                              onClick={() => toggleCompare(prog)}
                              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold"
                            >
                              Remove
                            </button>
                          </div>
                          <h4 className="text-sm font-extrabold text-white leading-snug">
                            {prog.title}
                          </h4>
                          <p className="text-[11px] text-slate-300 line-clamp-4">
                            {prog.description}
                          </p>

                          <div className="space-y-2 pt-3 border-t border-white/5 text-xs">
                            <div className="flex justify-between items-center py-1">
                              <span className="text-slate-400">
                                ECTS Credits:
                              </span>
                              <strong className="text-cyan-300 font-mono">
                                {(prog as any).degreeMetadata?.credits}
                              </strong>
                            </div>
                            <div className="flex justify-between items-center py-1">
                              <span className="text-slate-400">Duration:</span>
                              <strong className="text-cyan-300 font-mono">
                                {prog.durationHours} hrs
                              </strong>
                            </div>
                            <div className="flex justify-between items-center py-1">
                              <span className="text-slate-400">Domain:</span>
                              <strong className="text-slate-200 truncate max-w-[120px]">
                                {prog.category}
                              </strong>
                            </div>
                          </div>

                          <div className="space-y-2 pt-3 border-t border-white/5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Curriculum Modules:
                            </span>
                            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                              {prog.modules.map((mod, idx) => (
                                <div
                                  key={mod.id}
                                  className="text-[11px] bg-white/5 p-2 rounded border border-white/5 space-y-0.5"
                                >
                                  <span className="text-[9px] font-mono text-cyan-400 block">
                                    Module 0{idx + 1}
                                  </span>
                                  <span className="font-semibold text-white block line-clamp-1">
                                    {mod.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 pt-3 border-t border-white/5">
                          <button
                            onClick={() => {
                              setShowCompareModal(false);
                              handleQuickEnroll(prog);
                            }}
                            disabled={isEnrolled}
                            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                              isEnrolled
                                ? "bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 cursor-not-allowed"
                                : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-950/40"
                            }`}
                          >
                            {isEnrolled ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Enrolled</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                                <span>Quick Enroll</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => {
                              setShowCompareModal(false);
                              onSelectCourse(prog);
                            }}
                            className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 text-xs font-semibold transition-colors"
                          >
                            Open Full Degree
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
