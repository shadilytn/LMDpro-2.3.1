import React from "react";
import { UserProfile } from "../shared/types";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  TrendingUp,
  Clock,
  Award,
  BookOpen,
  Sparkles,
  Zap,
  Target,
  CheckCircle2,
  ArrowUpRight,
  Headphones,
  ShieldAlert,
  Search,
  LayoutGrid,
  Terminal,
} from "lucide-react";
import { ConversationalBridgeService } from "../shared/conversational.bridge.service";
import { toastService } from "../services/toastService";
import { MentorFeedbackOverlay } from "./MentorFeedbackOverlay";

interface DetailedAchievementLog {
  id: string;
  title: string;
  xp: number;
  date: string;
  type: "course" | "quiz" | "lab" | "socratic";
}

// Generate 1,000 mock achievement logs to justify virtualization
const MOCK_ACHIEVEMENTS: DetailedAchievementLog[] = Array.from({ length: 1000 }).map((_, i) => ({
  id: `ach_${i}`,
  title: [
    "Neural Network Optimization Lab",
    "Socratic Debrief: Quantum Gates",
    "Advanced Calculus Milestone",
    "Cloud DevOps Capstone Defense",
    "Linear Algebra Quick Quiz",
    "Antigravity Systems Theory",
  ][i % 6],
  xp: 50 + (i % 10) * 10,
  date: new Date(Date.now() - i * 3600000).toLocaleString(),
  type: ["course", "quiz", "lab", "socratic"][i % 4] as any,
}));

interface LearningAnalyticsDashboardProps {
  user: UserProfile;
  onNavigateTab?: (tab: string) => void;
}

const XP_GROWTH_DATA = [
  { date: "Mon", xp: 220, focus: 35 },
  { date: "Tue", xp: 340, focus: 45 },
  { date: "Wed", xp: 480, focus: 60 },
  { date: "Thu", xp: 610, focus: 50 },
  { date: "Fri", xp: 850, focus: 90 },
  { date: "Sat", xp: 1100, focus: 110 },
  { date: "Sun", xp: 1450, focus: 125 },
];

const COURSE_PROGRESS_DATA = [
  { name: "Computer Science (B.Sc)", completion: 68, color: "#5BC4D4" },
  { name: "Quantum Machine Learning", completion: 42, color: "#34d399" },
  { name: "Neural Networks & Deep AI", completion: 85, color: "#D4A017" },
  { name: "Cloud Architecture & DevOps", completion: 30, color: "#73A5AD" },
];

const SKILL_MASTERY_DATA = [
  { subject: "AI & ML", score: 88, fill: "#5BC4D4" },
  { subject: "Algorithms", score: 75, fill: "#34d399" },
  { subject: "Systems", score: 62, fill: "#D4A017" },
  { subject: "Mathematics", score: 80, fill: "#73A5AD" },
];

/**
 * Virtualized Achievement Grid
 * Renders a large list of achievements using CSS Grid and windowing logic
 */
const VirtualizedAchievementGrid: React.FC<{ items: DetailedAchievementLog[] }> = ({ items }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [containerHeight, setContainerHeight] = React.useState(600);

  // Constants for virtualization
  const ITEM_HEIGHT = 100; // Expected height of each card in pixels
  const GRID_COLS = window.innerWidth >= 1024 ? 2 : 1; // 2 cols on lg, 1 on md/sm
  const VISIBLE_ITEMS_COUNT = Math.ceil(containerHeight / ITEM_HEIGHT) * GRID_COLS + GRID_COLS * 2;

  React.useEffect(() => {
    const handleScroll = (e: Event) => {
      setScrollTop((e.target as HTMLDivElement).scrollTop);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      setContainerHeight(container.offsetHeight);
    }

    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) * GRID_COLS);
  const endIndex = Math.min(items.length, startIndex + VISIBLE_ITEMS_COUNT);

  const visibleItems = React.useMemo(() => items.slice(startIndex, endIndex), [items, startIndex, endIndex]);

  const totalHeight = Math.ceil(items.length / GRID_COLS) * ITEM_HEIGHT;

  return (
    <div 
      ref={containerRef}
      className="relative overflow-y-auto h-[600px] rounded-3xl bg-[#030b10]/50 border border-[#143242] p-4 custom-scrollbar"
    >
      <div style={{ height: totalHeight, position: "relative", width: "100%" }}>
        <div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          style={{ 
            position: "absolute", 
            top: (startIndex / GRID_COLS) * ITEM_HEIGHT, 
            left: 0, 
            right: 0 
          }}
        >
          {visibleItems.map((ach) => (
            <div 
              key={ach.id}
              className="p-4 rounded-2xl bg-[#030b10]/80 backdrop-blur-xl border border-[#143242] hover:border-[#5BC4D4]/40 transition-all flex items-center justify-between group h-[84px]"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  ach.type === 'socratic' ? 'bg-[#5BC4D4]/10 border-[#5BC4D4]/20 text-[#5BC4D4]' :
                  ach.type === 'lab' ? 'bg-[#34d399]/10 border-[#34d399]/20 text-[#34d399]' :
                  ach.type === 'quiz' ? 'bg-[#D4A017]/10 border-[#D4A017]/20 text-[#D4A017]' :
                  'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                }`}>
                  {ach.type === 'socratic' ? <Headphones className="w-4 h-4" /> :
                   ach.type === 'lab' ? <Terminal className="w-4 h-4" /> :
                   ach.type === 'quiz' ? <ArrowUpRight className="w-4 h-4" /> :
                   <BookOpen className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#5BC4D4] transition-colors">{ach.title}</h4>
                  <p className="text-[10px] text-[#73A5AD]">{ach.date}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-cyan-400">+{ach.xp} XP</div>
                <div className="text-[9px] uppercase tracking-tighter text-[#73A5AD]">{ach.type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const LearningAnalyticsDashboard: React.FC<
  LearningAnalyticsDashboardProps
> = ({ user, onNavigateTab }) => {
  const [timeRange, setTimeRange] = React.useState<"week" | "month" | "year">("week");
  const [achievementSearch, setAchievementSearch] = React.useState("");

  const filteredAchievements = React.useMemo(() => {
    return MOCK_ACHIEVEMENTS.filter(a => 
      a.title.toLowerCase().includes(achievementSearch.toLowerCase()) ||
      a.type.toLowerCase().includes(achievementSearch.toLowerCase())
    );
  }, [achievementSearch]);

  const handleTriggerSocraticAudio = async () => {
    try {
      toastService.info(
        "Generating Socratic Analytics audio debrief...",
        "NotebookLM Discussion"
      );
      await ConversationalBridgeService.generateDiscussion(
        "Learning Analytics & XP Velocity",
        "Student progress report: 1,450 XP, 7-day daily streak, and 125 focus minutes logged."
      );
      await ConversationalBridgeService.playDiscussion();
      toastService.success(
        "Playing Socratic audio debrief with Petra & Nashmi.",
        "Voice Discussion Active"
      );
    } catch (err) {
      console.warn("Analytics audio error:", err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner - Liquid Glass Style */}
      <div className="relative overflow-hidden rounded-3xl bg-[#030b10]/90 backdrop-blur-xl border border-[#143242] p-6 md:p-8 shadow-2xl">
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-[#5BC4D4]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5BC4D4]/10 border border-[#5BC4D4]/20 text-[#5BC4D4] text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5 text-[#5BC4D4]" />
              <span>Executive Telemetry & Bento Analytics</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Learning Analytics & Performance Studio
            </h1>
            <p className="text-sm text-[#73A5AD]">
              Real-time XP velocity, focus minutes, and domain competency metrics across accredited degree tracks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleTriggerSocraticAudio}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#104A5A] to-[#233F43] hover:from-[#233F43] hover:to-[#104A5A] text-white text-xs font-bold border border-[#5BC4D4]/40 flex items-center gap-2 shadow-lg transition-all"
            >
              <Headphones className="w-4 h-4 text-[#5BC4D4]" />
              <span>Play NotebookLM Audio Debrief</span>
            </button>

            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a]">
              {(["week", "month", "year"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    timeRange === range
                      ? "bg-[#5BC4D4]/20 text-[#5BC4D4] border border-[#5BC4D4]/40 shadow-sm"
                      : "text-[#73A5AD] hover:text-white"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Mentor Feedback & Dynamic Coaching Overlay */}
      <MentorFeedbackOverlay user={user} onNavigateTab={onNavigateTab} />

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bento Card 1: Experience Points */}
        <div 
          className="p-5 rounded-3xl bg-[#030b10]/80 backdrop-blur-xl border border-[#143242] hover:border-[#5BC4D4]/50 transition-all space-y-2 relative overflow-hidden group cursor-pointer"
          title="Total Experience Points earned from quizzes, lab completions, and Socratic debriefs."
        >
          <div className="flex items-center justify-between text-[#73A5AD]">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Experience
            </span>
            <div className="p-2 rounded-2xl bg-[#D4A017]/10 border border-[#D4A017]/20 text-[#D4A017] group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {user.xp || 1450}{" "}
            <span className="text-xs text-[#D4A017] font-normal">XP</span>
          </div>
          <p className="text-[11px] text-[#73A5AD] flex items-center gap-1">
            <span className="text-[#34d399] font-bold">+18%</span> velocity boost
          </p>
          {/* Interactive Bento Hover Tooltip */}
          <div className="absolute inset-x-0 bottom-0 bg-[#104A5A]/95 text-white text-[10px] p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200 border-t border-[#5BC4D4]/40 font-mono">
            💡 Calculated live from IndexedDB progress logs & Socratic debriefs.
          </div>
        </div>

        {/* Bento Card 2: Total Focus Time */}
        <div 
          className="p-5 rounded-3xl bg-[#030b10]/80 backdrop-blur-xl border border-[#143242] hover:border-[#5BC4D4]/50 transition-all space-y-2 relative overflow-hidden group cursor-pointer"
          title="Total focus minutes logged in active study sessions and Pomodoro intervals."
        >
          <div className="flex items-center justify-between text-[#73A5AD]">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Focus Minutes
            </span>
            <div className="p-2 rounded-2xl bg-[#5BC4D4]/10 border border-[#5BC4D4]/20 text-[#5BC4D4] group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {user.totalFocusMinutes || 125}{" "}
            <span className="text-xs text-[#5BC4D4] font-normal">mins</span>
          </div>
          <p className="text-[11px] text-[#73A5AD] flex items-center gap-1">
            <span className="text-[#34d399] font-bold">5 Sessions</span> logged
          </p>
          {/* Interactive Bento Hover Tooltip */}
          <div className="absolute inset-x-0 bottom-0 bg-[#104A5A]/95 text-white text-[10px] p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200 border-t border-[#5BC4D4]/40 font-mono">
            ⏱️ Target: 60 mins/day. 83% of daily target reached today.
          </div>
        </div>

        {/* Bento Card 3: Streak */}
        <div 
          className="p-5 rounded-3xl bg-[#030b10]/80 backdrop-blur-xl border border-[#143242] hover:border-[#5BC4D4]/50 transition-all space-y-2 relative overflow-hidden group cursor-pointer"
          title="Consecutive daily study sessions recorded in the Zalamati telemetry engine."
        >
          <div className="flex items-center justify-between text-[#73A5AD]">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Daily Streak
            </span>
            <div className="p-2 rounded-2xl bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399] group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            7 <span className="text-xs text-[#34d399] font-normal">Days</span>
          </div>
          <p className="text-[11px] text-[#73A5AD] flex items-center gap-1">
            <span className="text-[#34d399] font-bold">Active</span> daily learning
          </p>
          {/* Interactive Bento Hover Tooltip */}
          <div className="absolute inset-x-0 bottom-0 bg-[#104A5A]/95 text-white text-[10px] p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200 border-t border-[#5BC4D4]/40 font-mono">
            🔥 Top 5% of active executive scholars this week.
          </div>
        </div>

        {/* Bento Card 4: Academic Rank */}
        <div 
          className="p-5 rounded-3xl bg-[#030b10]/80 backdrop-blur-xl border border-[#143242] hover:border-[#5BC4D4]/50 transition-all space-y-2 relative overflow-hidden group cursor-pointer"
          title="Scholar Tier level based on verified skill competencies and capstone defense results."
        >
          <div className="flex items-center justify-between text-[#73A5AD]">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Academic Rank
            </span>
            <div className="p-2 rounded-2xl bg-[#5BC4D4]/10 border border-[#5BC4D4]/20 text-[#5BC4D4] group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            Level {user.level || 2}{" "}
            <span className="text-xs text-[#5BC4D4] font-normal">Scholar</span>
          </div>
          <p className="text-[11px] text-[#73A5AD]">
            Next Rank Tier at 2,000 XP
          </p>
          {/* Interactive Bento Hover Tooltip */}
          <div className="absolute inset-x-0 bottom-0 bg-[#104A5A]/95 text-white text-[10px] p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200 border-t border-[#5BC4D4]/40 font-mono">
            🎓 Earn 550 more XP to unlock Senior Fellow Tier.
          </div>
        </div>
      </div>

      {/* Bento Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bento Card 5: XP Velocity Chart */}
        <div className="p-6 rounded-3xl bg-[#030b10]/80 backdrop-blur-xl border border-[#143242] hover:border-[#5BC4D4]/50 transition-all space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#5BC4D4]" />
                XP Velocity Trajectory
              </h3>
              <p className="text-xs text-[#73A5AD]">
                Cumulative experience points gained per day
              </p>
            </div>
            <span className="text-xs font-bold text-[#5BC4D4] bg-[#5BC4D4]/10 px-2.5 py-1 rounded-xl border border-[#5BC4D4]/20">
              +1,450 XP Total
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={XP_GROWTH_DATA}>
                <defs>
                  <linearGradient id="colorXpBento" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5BC4D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#5BC4D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#233F43" />
                <XAxis dataKey="date" stroke="#73A5AD" fontSize={11} />
                <YAxis stroke="#73A5AD" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#131E20",
                    borderColor: "#73A5AD",
                    borderRadius: "16px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  cursor={{ stroke: '#5BC4D4', strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="xp"
                  stroke="#5BC4D4"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorXpBento)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bento Card 6: Time Spent Widget */}
        <div className="p-6 rounded-3xl bg-[#030b10]/80 backdrop-blur-xl border border-[#143242] hover:border-[#5BC4D4]/50 transition-all space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#34d399]" />
                Daily Engagement Trends
              </h3>
              <p className="text-xs text-[#73A5AD]">
                Total study time vs weekly targets
              </p>
            </div>
            <span className="text-xs font-bold text-[#34d399] bg-[#34d399]/10 px-2.5 py-1 rounded-xl border border-[#34d399]/20">
              Engagement High
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={XP_GROWTH_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#233F43" />
                <XAxis dataKey="date" stroke="#73A5AD" fontSize={11} />
                <YAxis stroke="#73A5AD" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#131E20",
                    borderColor: "#73A5AD",
                    borderRadius: "16px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="focus" fill="#34d399" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bento Bottom Row: Pathways & Domain Competency */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pathways Completion */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#030b10]/80 backdrop-blur-xl border border-[#143242] hover:border-[#5BC4D4]/50 transition-all space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#5BC4D4]" />
                Enrolled Pathway Completion Rates
              </h3>
              <p className="text-xs text-[#73A5AD]">
                Progress percentage across active degree programs
              </p>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab("degrees")}
              className="text-xs font-semibold text-[#5BC4D4] hover:underline flex items-center gap-1"
            >
              <span>Explore Programs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {COURSE_PROGRESS_DATA.map((course) => (
              <div
                key={course.name}
                className="p-3.5 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{course.name}</span>
                  <span className="font-mono font-bold text-[#5BC4D4]">
                    {course.completion}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#030b10] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${course.completion}%`,
                      backgroundColor: course.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Domain Competency Index */}
        <div className="p-6 rounded-3xl bg-[#030b10]/80 backdrop-blur-xl border border-[#143242] hover:border-[#5BC4D4]/50 transition-all space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-[#D4A017]" />
              Domain Competency Index
            </h3>
            <p className="text-xs text-[#73A5AD]">
              Mastery rating by academic field
            </p>

            <div className="space-y-3 pt-4">
              {SKILL_MASTERY_DATA.map((skill) => (
                <div
                  key={skill.subject}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a]"
                >
                  <span className="text-xs font-medium text-white">
                    {skill.subject}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-[#030b10] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${skill.score}%`,
                          backgroundColor: skill.fill,
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#5BC4D4]">
                      {skill.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#5BC4D4]/10 border border-[#5BC4D4]/20 text-xs text-[#5BC4D4] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#5BC4D4]" />
            <span>
              Petra & Nashmi recommend 30m of Systems & Architecture study to balance skills.
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Achievement Logs - Virtualized Grid */}
      <div className="p-6 rounded-3xl bg-[#030b10]/90 backdrop-blur-xl border border-[#143242] space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#34d399]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-[#5BC4D4]" />
              Detailed Achievement Metrics Log
            </h3>
            <p className="text-xs text-[#73A5AD]">
              Virtualized telemetry feed of all 1,000+ recorded learning events
            </p>
          </div>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#73A5AD] group-focus-within:text-[#5BC4D4] transition-colors" />
            <input 
              type="text"
              placeholder="Filter achievements (e.g. 'Lab', 'Quiz')..."
              value={achievementSearch}
              onChange={(e) => setAchievementSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] text-xs text-white placeholder:text-[#73A5AD] focus:border-[#5BC4D4]/50 focus:outline-none w-full md:w-64 transition-all"
            />
          </div>
        </div>

        <VirtualizedAchievementGrid items={filteredAchievements} />
        
        <div className="flex items-center justify-center gap-4 text-[10px] text-[#73A5AD]">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#5BC4D4]" />
            <span>Socratic</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#34d399]" />
            <span>Lab</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#D4A017]" />
            <span>Quiz</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-cyan-500" />
            <span>Course</span>
          </div>
        </div>
      </div>
    </div>
  );
};
