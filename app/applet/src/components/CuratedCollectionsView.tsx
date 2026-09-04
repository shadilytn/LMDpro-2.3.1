import React, { useState, useMemo } from "react";
import { 
  Sparkles, 
  BookOpen, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Clock, 
  Award, 
  CheckCircle2, 
  Layers, 
  Compass, 
  GraduationCap,
  Cpu,
  Globe,
  Database,
  Code,
  Server,
  ChevronRight,
  Star
} from "lucide-react";
import { Course, UserProfile } from "../shared/types";
import { ThemedCourseImage } from "./ThemedCourseImage";

interface CuratedCollectionsViewProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  user?: UserProfile;
}

interface CuratedCollection {
  id: string;
  title: string;
  theme: string;
  industry: string;
  skillLevel: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  description: string;
  estimatedHours: number;
  badgeColor: string;
  icon: any;
  courseIds: string[];
}

export const CuratedCollectionsView: React.FC<CuratedCollectionsViewProps> = ({
  courses,
  onSelectCourse,
  user
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<string>("All");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");

  // Define curated collections
  const collections: CuratedCollection[] = useMemo(() => [
    {
      id: "col-intro-ai",
      title: "Introduction to Artificial Intelligence & Machine Learning",
      theme: "Artificial Intelligence",
      industry: "AI & Cognitive Computing",
      skillLevel: "Beginner",
      description: "A comprehensive gateway into modern machine learning, neural networks, and prompt engineering. Designed for students starting their AI journey.",
      estimatedHours: 48,
      badgeColor: "from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/40",
      icon: Cpu,
      courseIds: courses.slice(0, 3).map(c => c.id)
    },
    {
      id: "col-web-bootcamp",
      title: "Full-Stack Web Development Bootcamp",
      theme: "Web Development",
      industry: "Software Engineering & Cloud",
      skillLevel: "Intermediate",
      description: "Master modern React 19, TypeScript, Tailwind CSS, Node.js REST APIs, and full-stack architecture through immersive hands-on projects.",
      estimatedHours: 72,
      badgeColor: "from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/40",
      icon: Code,
      courseIds: courses.slice(1, 4).map(c => c.id)
    },
    {
      id: "col-data-science",
      title: "Data Science Specialization & Big Data Analytics",
      theme: "Data Science",
      industry: "Data Intelligence & Statistics",
      skillLevel: "Intermediate",
      description: "Learn advanced statistical modeling, Python dataframes, D3.js visualization pipelines, and predictive machine learning models.",
      estimatedHours: 64,
      badgeColor: "from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/40",
      icon: Database,
      courseIds: courses.slice(2, 5).map(c => c.id)
    },
    {
      id: "col-autonomous-swarms",
      title: "Autonomous Systems & Multi-Agent Swarms",
      theme: "Autonomous Systems",
      industry: "Advanced Robotics & AI Swarms",
      skillLevel: "Advanced",
      description: "Explore Cellular Sheaves, Sheaf-ADMM optimization, decentralized agent coordination, and Antigravity execution runtimes.",
      estimatedHours: 90,
      badgeColor: "from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/40",
      icon: Sparkles,
      courseIds: courses.slice(0, 2).map(c => c.id)
    },
    {
      id: "col-cloud-devops",
      title: "Cloud Computing & Distributed Systems Architecture",
      theme: "Cloud & DevOps",
      industry: "Enterprise Infrastructure",
      skillLevel: "Advanced",
      description: "Master containerization, Kubernetes orchestration, serverless microservices, and secure CI/CD deployment pipelines on Cloud Run.",
      estimatedHours: 55,
      badgeColor: "from-teal-500/20 to-cyan-500/20 text-teal-300 border-teal-500/40",
      icon: Server,
      courseIds: courses.slice(1, 3).map(c => c.id)
    }
  ], [courses]);

  const themes = useMemo(() => {
    const set = new Set<string>(["All"]);
    collections.forEach(c => set.add(c.theme));
    return Array.from(set);
  }, [collections]);

  const filteredCollections = useMemo(() => {
    return collections.filter(col => {
      const matchSearch = 
        searchQuery.trim() === "" ||
        col.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        col.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        col.industry.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchTheme = selectedTheme === "All" || col.theme === selectedTheme;
      const matchLevel = selectedLevel === "All" || col.skillLevel === selectedLevel;

      return matchSearch && matchTheme && matchLevel;
    });
  }, [collections, searchQuery, selectedTheme, selectedLevel]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#071620] via-[#0b222f] to-[#06141c] border border-[#1b3b4a] shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Curated Educational Paths & Skill Bootcamps</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Curated Course Collections
          </h1>
          <p className="text-sm text-[#82a3b2] max-w-2xl leading-relaxed">
            Hand-picked multi-course learning tracks engineered by academic faculty and industry experts to accelerate your mastery in AI, Full-Stack Engineering, Data Science, and Autonomous Systems.
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#09151d] p-4 rounded-2xl border border-[#1b3b4a]">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5b7d8d]" />
          <input
            type="text"
            placeholder="Search collections by theme, title, or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#040d12] border border-[#1b3b4a] rounded-xl text-white placeholder-[#5b7d8d] text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Theme Filter */}
          <div className="flex items-center gap-1.5 bg-[#040d12] border border-[#1b3b4a] px-3 py-2 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
            >
              {themes.map(t => (
                <option key={t} value={t} className="bg-[#08151c] text-white">
                  Theme: {t}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-1.5 bg-[#040d12] border border-[#1b3b4a] px-3 py-2 rounded-xl">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-[#08151c] text-white">Level: All Levels</option>
              <option value="Beginner" className="bg-[#08151c] text-white">Beginner</option>
              <option value="Intermediate" className="bg-[#08151c] text-white">Intermediate</option>
              <option value="Advanced" className="bg-[#08151c] text-white">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="space-y-8">
        {filteredCollections.length === 0 ? (
          <div className="text-center py-16 bg-[#09151d] rounded-2xl border border-[#1b3b4a] space-y-3">
            <BookOpen className="w-10 h-10 text-cyan-400 mx-auto opacity-60" />
            <p className="text-sm text-white font-medium">No matching curated collections found</p>
            <p className="text-xs text-[#789cae]">Try adjusting your search query or theme filters.</p>
          </div>
        ) : (
          filteredCollections.map((col) => {
            const IconComp = col.icon;
            const includedCourses = courses.filter(c => col.courseIds.includes(c.id));

            return (
              <div 
                key={col.id} 
                className="bg-[#08151c] rounded-3xl border border-[#1b3b4a] overflow-hidden shadow-xl hover:border-cyan-500/40 transition-all duration-300"
              >
                {/* Collection Header */}
                <div className="p-6 sm:p-8 bg-gradient-to-r from-[#091822] via-[#0d2330] to-[#07151e] border-b border-[#1b3b4a] flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${col.badgeColor} flex items-center gap-1.5`}>
                        <IconComp className="w-3.5 h-3.5" />
                        {col.theme}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/50 text-[#82a3b2] border border-cyan-500/20">
                        {col.industry}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#122430] text-emerald-400 border border-emerald-500/30">
                        {col.skillLevel}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {col.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-[#82a3b2] leading-relaxed">
                      {col.description}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-3 bg-[#040d12]/80 p-4 rounded-2xl border border-[#1b3b4a] shrink-0">
                    <div className="flex items-center gap-2 text-xs text-[#82a3b2]">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span>Estimated: <strong className="text-white font-mono">{col.estimatedHours} Hours</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#82a3b2]">
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <span>Courses included: <strong className="text-white font-mono">{includedCourses.length}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Included Courses List */}
                <div className="p-6 sm:p-8 space-y-4 bg-[#06131a]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      <span>Curated Curriculum Courses ({includedCourses.length})</span>
                    </h3>
                    <span className="text-xs text-[#628597]">Click any course to launch interactive player</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {includedCourses.map((course, idx) => (
                      <div
                        key={course.id || idx}
                        onClick={() => onSelectCourse(course)}
                        className="group relative bg-[#091822] rounded-2xl p-4 border border-[#1b3b4a] hover:border-cyan-400/60 hover:bg-[#0d222e] transition-all cursor-pointer flex flex-col justify-between space-y-3 shadow-md"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase">
                              Course {idx + 1}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) * 15 || 45}m
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                            {course.title}
                          </h4>

                          <p className="text-xs text-[#789cae] line-clamp-2">
                            {course.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[#122b38] flex items-center justify-between text-xs">
                          <span className="text-emerald-400 font-medium">
                            {course.modules?.length || 3} Modules
                          </span>
                          <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                            <span>Start Learning</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
EOF,
IsDevDependency:false,
Overwrite:true,
toolAction:
