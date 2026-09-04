import React from "react";
import { Course } from "../shared/types";
import { DEFAULT_COURSES } from "../data/defaultCourses";
import { ThemedCourseImage } from "./ThemedCourseImage";
import {
  Sparkles,
  Award,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Star,
  GraduationCap,
  Layers,
  Zap,
  Play,
  Flame,
  CheckCircle2,
  Building,
  ShieldCheck,
} from "lucide-react";

interface FeaturedSolutionsViewProps {
  onSelectCourse?: (course: Course) => void;
  onOpenAITutor?: () => void;
}

export const FeaturedSolutionsView: React.FC<FeaturedSolutionsViewProps> = ({
  onSelectCourse,
  onOpenAITutor,
}) => {
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [sliderIndex, setSliderIndex] = React.useState(0);

  // Slider Programs / Degrees & Professional Pathways Data
  const degreePrograms = [
    {
      id: "deg-1",
      title: "M.S. in Autonomous AI Swarms & Antigravity Systems",
      institution: "LMDpro AI Research Institute",
      level: "Master of Science (M.S.)",
      duration: "2 Years • 60 Credits",
      tags: ["Agentic Workflows", "Multi-Agent Swarms", "Gemini 3.1 Pro"],
      badge: "Premier Degree",
      cover:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
      color: "from-cyan-500/20 to-cyan-500/10 border-cyan-500/30",
    },
    {
      id: "deg-2",
      title: "B.S. in Quantum Cloud & Distributed Microservices",
      institution: "LMDpro Systems Faculty",
      level: "Bachelor of Science (B.S.)",
      duration: "4 Years • 120 Credits",
      tags: ["Cloud Native", "Kubernetes", "Raft Consensus"],
      badge: "Accredited B.S.",
      cover:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
      color: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30",
    },
    {
      id: "deg-3",
      title: "Executive Certificate in Defense Cybersecurity & Zero Trust",
      institution: "LMDpro Cyber Defense Center",
      level: "Executive Certificate",
      duration: "6 Months • 24 Credits",
      tags: ["Zero Trust Architecture", "Post-Quantum Crypto", "eBPF"],
      badge: "Industry Cert",
      cover:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
      color: "from-cyan-500/20 to-cyan-500/10 border-cyan-500/30",
    },
    {
      id: "deg-4",
      title: "Postgraduate Diploma in Computational Genomics & BioAI",
      institution: "LMDpro Biotech Lab",
      level: "Postgraduate Diploma",
      duration: "1 Year • 36 Credits",
      tags: ["AlphaFold 3", "CRISPR Design", "Genomic Pipelines"],
      badge: "BioTech Specialization",
      cover:
        "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800&auto=format&fit=crop",
      color: "from-cyan-500/20 to-cyan-500/10 border-cyan-500/30",
    },
  ];

  const handlePrevSlide = () => {
    setSliderIndex((prev) =>
      prev === 0 ? degreePrograms.length - 1 : prev - 1,
    );
  };

  const handleNextSlide = () => {
    setSliderIndex((prev) =>
      prev === degreePrograms.length - 1 ? 0 : prev + 1,
    );
  };

  // Selection of Courses with varying layout grid spans for the "random-sized grid cards"
  const featuredGridCourses = DEFAULT_COURSES.map((course, index) => {
    // Varied sizing patterns: index 0 (Hero 2x2), index 1 (Tall 1x2), index 2 (Wide 2x1), index 3 (Standard 1x1)
    let gridSpan = "col-span-1 row-span-1";
    let cardHeight = "min-h-[280px]";

    if (index === 0) {
      gridSpan = "col-span-1 md:col-span-2 row-span-2";
      cardHeight = "min-h-[420px]";
    } else if (index === 1) {
      gridSpan = "col-span-1 md:col-span-1 row-span-2";
      cardHeight = "min-h-[420px]";
    } else if (index === 2) {
      gridSpan = "col-span-1 md:col-span-2 row-span-1";
      cardHeight = "min-h-[280px]";
    } else if (index === 3) {
      gridSpan = "col-span-1 md:col-span-1 row-span-1";
      cardHeight = "min-h-[300px]";
    }

    return { ...course, gridSpan, cardHeight };
  });

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Hero Solutions Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0c1a24] via-[#0e222f] to-[#08151c] border border-[#1b3e52] p-6 md:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Featured Educational Solutions</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Curated Academic Solutions & Degree Programs
          </h1>
          <p className="text-xs md:text-sm text-[#82a4b3] leading-relaxed">
            Explore industry-vetted solution modules featuring random-sized
            bento grid layouts, interactive degree sliders, and Socratic AI
            tutoring.
          </p>
        </div>
      </div>

      {/* 1. SLIDER: Degree Programs, Executive Certs, and Skill Pathways */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-cyan-400" />
              <span>Programs, Degrees & Training Pathways</span>
            </h2>
            <p className="text-xs text-[#7398aa]">
              Interactive slider displaying formal degree programs and
              certifications
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevSlide}
              className="p-2 rounded-xl bg-[#0e212b] border border-[#1c3e50] text-[#81a2b2] hover:text-white hover:border-cyan-400/50 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextSlide}
              className="p-2 rounded-xl bg-[#0e212b] border border-[#1c3e50] text-[#81a2b2] hover:text-white hover:border-cyan-400/50 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden rounded-3xl bg-[#091720] border border-[#1a3a4b] p-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Slide Cover Image */}
            <div className="md:col-span-5 relative h-60 rounded-2xl overflow-hidden border border-[#1d4154] shadow-lg group">
              <ThemedCourseImage
                src={degreePrograms[sliderIndex].cover}
                alt={degreePrograms[sliderIndex].title}
                category={degreePrograms[sliderIndex].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091720] via-transparent to-transparent opacity-80" />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-[10px] font-black uppercase tracking-wider">
                {degreePrograms[sliderIndex].badge}
              </div>
            </div>

            {/* Slide Content Details */}
            <div className="md:col-span-7 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                  <Building className="w-4 h-4" />
                  <span>{degreePrograms[sliderIndex].institution}</span>
                </div>
                <h3 className="text-xl font-black text-white leading-snug">
                  {degreePrograms[sliderIndex].title}
                </h3>
                <div className="text-xs text-[#779bac] font-medium">
                  {degreePrograms[sliderIndex].level} •{" "}
                  {degreePrograms[sliderIndex].duration}
                </div>
              </div>

              {/* Tag Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {degreePrograms[sliderIndex].tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-[#061218] border border-[#18394a] text-cyan-200 text-[11px] font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={onOpenAITutor}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Enroll & AI Advisory</span>
                </button>
                <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Accreditation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slide Indicator Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-6 pt-4 border-t border-[#143242]">
            {degreePrograms.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSliderIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  sliderIndex === idx
                    ? "w-8 bg-cyan-400"
                    : "w-2 bg-[#1b3d4f] hover:bg-[#28576f]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 2. FEATURED COURSES: Selected Number of Random Sized Grid Cards */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Featured Solutions Bento Grid</span>
            </h2>
            <p className="text-xs text-[#7398aa]">
              Random sized grid cards showcasing course solution architectures
            </p>
          </div>
        </div>

        {/* Bento Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredGridCourses.map((course, idx) => (
            <div
              key={course.id}
              className={`${course.gridSpan} rounded-3xl bg-[#091821] border border-[#1b3d4f] hover:border-cyan-400/50 p-5 shadow-2xl flex flex-col justify-between group transition-all duration-300 hover:shadow-cyan-950/30 relative overflow-hidden`}
            >
              <div className="space-y-3">
                {/* Card Header Metadata */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-[#061218] border border-[#18394a] text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
                    {course.category}
                  </span>
                  <div className="flex items-center gap-1 text-cyan-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-cyan-400" />
                    <span>{course.rating || 4.9}</span>
                  </div>
                </div>

                {/* Course Title & Cover */}
                <div className="space-y-2">
                  <h3 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-[#789cae] line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Tag list */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {course.tags.slice(0, 3).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] text-[#638799] bg-[#050f14] px-2 py-0.5 rounded-md border border-[#14303d]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 mt-3 border-t border-[#143242] flex items-center justify-between">
                <div className="text-[11px] text-[#628494] font-medium">
                  {course.durationHours} Hours • {course.modules.length} Modules
                </div>

                <button
                  onClick={() => onSelectCourse && onSelectCourse(course)}
                  className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/30 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Solution</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
