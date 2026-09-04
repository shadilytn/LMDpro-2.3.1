import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Award,
  Sparkles,
  Shield,
  Zap,
  Flame,
  Star,
  CheckCircle2,
  Lock,
  Search,
  Filter,
  Share2,
  ChevronRight,
  TrendingUp,
  Globe,
  Brain,
  Layers,
  Code2,
  Check,
  Copy,
} from "lucide-react";
import { UserProfile } from "../shared/types";
import { toastService } from "../services/toastService";
import confetti from "canvas-confetti";

export interface EnhancedBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "Academic" | "Architecture" | "Focus & Streak" | "Collaboration" | "Capstone";
  tier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond" | "Apex";
  rarity: string;
  xpReward: number;
  unlocked: boolean;
  progressPercent: number;
  requirements: string;
  dateUnlocked?: string;
}

interface BadgeHallProps {
  user: UserProfile;
  onSelectBadge?: (badge: EnhancedBadge) => void;
}

// Particle interface for canvas hover animation
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  life: number;
  maxLife: number;
}

const BADGE_CATALOG: EnhancedBadge[] = [
  {
    id: "b_genesis",
    name: "Architect Genesis",
    description: "Initiated the autonomous agent compiler ecosystem and configured workspace parameters.",
    icon: "⚡",
    dateUnlocked: "2026-08-01",
    category: "Architecture",
    tier: "Gold",
    rarity: "Top 4% of Scholars",
    xpReward: 500,
    unlocked: true,
    progressPercent: 100,
    requirements: "Initialize workspace environment and connect cognitive models.",
  },
  {
    id: "b_streak_master",
    name: "Unbroken Chronos",
    description: "Maintained a continuous 7+ day study streak across distributed learning modules.",
    icon: "🔥",
    dateUnlocked: "2026-08-15",
    category: "Focus & Streak",
    tier: "Diamond",
    rarity: "Top 2% of Scholars",
    xpReward: 750,
    unlocked: true,
    progressPercent: 100,
    requirements: "Complete daily study goals 7 consecutive days.",
  },
  {
    id: "b_raft_expert",
    name: "Consensus Quorum Master",
    description: "Proved state machine safety and leader completeness across Raft consensus modules.",
    icon: "🛡️",
    dateUnlocked: "2026-08-18",
    category: "Academic",
    tier: "Platinum",
    rarity: "Top 8% of Scholars",
    xpReward: 600,
    unlocked: true,
    progressPercent: 100,
    requirements: "Score 95%+ on the Raft Distributed Systems capstone exam.",
  },
  {
    id: "b_webgpu_speed",
    name: "Sub-Millisecond Neural Edge",
    description: "Compiled and executed local WebGPU neural models directly in-browser with zero latency.",
    icon: "🚀",
    dateUnlocked: "2026-08-20",
    category: "Architecture",
    tier: "Diamond",
    rarity: "Top 3% of Scholars",
    xpReward: 850,
    unlocked: true,
    progressPercent: 100,
    requirements: "Execute client-side WASM/WebGPU inference test.",
  },
  {
    id: "b_socratic_debater",
    name: "Socratic Inquisitor",
    description: "Completed 10 active-voice academic debates with Hostess Petra and Assistant Nashmi.",
    icon: "🎙️",
    dateUnlocked: "2026-08-21",
    category: "Collaboration",
    tier: "Gold",
    rarity: "Top 12% of Scholars",
    xpReward: 450,
    unlocked: true,
    progressPercent: 100,
    requirements: "Engage in 10 voice discussions via Live Voice Agent.",
  },
  {
    id: "b_spaced_rep",
    name: "Spaced Repetition Virtuoso",
    description: "Achieved 90%+ long-term retention across active recall flashcard decks for 30 days.",
    icon: "🧠",
    dateUnlocked: "2026-08-21",
    category: "Focus & Streak",
    tier: "Platinum",
    rarity: "Top 5% of Scholars",
    xpReward: 700,
    unlocked: true,
    progressPercent: 100,
    requirements: "Master 50+ flashcards in the SRS deck system.",
  },
  {
    id: "b_quantum_crypt",
    name: "Post-Quantum Cryptographer",
    description: "Implemented Lattice-based Kyber and Dilithium verification proofs.",
    icon: "🔐",
    dateUnlocked: "",
    category: "Academic",
    tier: "Apex",
    rarity: "Top 1% of Scholars",
    xpReward: 1200,
    unlocked: false,
    progressPercent: 65,
    requirements: "Complete all 4 modules of the Post-Quantum Cryptography track.",
  },
  {
    id: "b_whiteboard_sync",
    name: "Collaborative Synapse",
    description: "Hosted 5 real-time peer study sessions with synchronized whiteboard notes.",
    icon: "🎨",
    dateUnlocked: "",
    category: "Collaboration",
    tier: "Silver",
    rarity: "Top 18% of Scholars",
    xpReward: 350,
    unlocked: false,
    progressPercent: 40,
    requirements: "Participate in 5 Virtual Study Room whiteboard sessions.",
  },
  {
    id: "b_capstone_titan",
    name: "Autonomous Swarm Architect",
    description: "Designed, tested, and published an autonomous multi-agent Sheaf-ADMM solver.",
    icon: "👑",
    dateUnlocked: "",
    category: "Capstone",
    tier: "Apex",
    rarity: "Top 0.5% of Scholars",
    xpReward: 2000,
    unlocked: false,
    progressPercent: 80,
    requirements: "Pass the Master of Science Degree Capstone Evaluation with distinction.",
  },
];

export const BadgeHall: React.FC<BadgeHallProps> = ({ user, onSelectBadge }) => {
  const isAr = user.language === "ar";
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [hoveredBadgeId, setHovecyanBadgeId] = React.useState<string | null>(null);
  const [inspectBadge, setInspectBadge] = React.useState<EnhancedBadge | null>(null);
  const [celebratingBadgeId, setCelebratingBadgeId] = React.useState<string | null>(null);

  const handleSimulateUnlock = (badge: EnhancedBadge) => {
    setCelebratingBadgeId(badge.id);
    confetti();
    toastService.success(
      isAr ? "مبروك! تم فتح الوسام" : "Badge Unlocked!",
      isAr ? `لقد تم فتح وسام [${badge.name}] بنجاح!` : `You have successfully unlocked the [${badge.name}] badge!`
    );
    setTimeout(() => {
      setCelebratingBadgeId(null);
    }, 3500);
  };
  const [searchQuery, setSearchQuery] = React.useState("");
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const particlesRef = React.useRef<Particle[]>([]);
  const animationFrameRef = React.useRef<number | null>(null);

  // Arabic mappings for badges
  const AR_BADGES: Record<string, { name: string; description: string; requirements: string; category: string; tier: string; rarity: string }> = {
    b_genesis: {
      name: "مهندس التأسيس الأول",
      description: "تهيئة بيئة مترجم الوكلاء الذاتية المستقلة وضبط معايير مساحة العمل الأكاديمية.",
      requirements: "تهيئة بيئة مساحة العمل وربط النماذج الإدراكية.",
      category: "المعمارية وهندسة النظم",
      tier: "ذهبي",
      rarity: "أفضل 4% من الباحثين",
    },
    b_streak_master: {
      name: "حارس الاستمرارية الزمنية",
      description: "الحفاظ على سلسلة دراسة متصلة لأكثر من 7 أيام متتالية عبر الوحدات التعليمية.",
      requirements: "إنجاز الأهداف الدراسية اليومية لمدة 7 أيام متتالية.",
      category: "التركيز والمواظبة",
      tier: "ماسي",
      rarity: "أفضل 2% من الباحثين",
    },
    b_raft_expert: {
      name: "خبير إجماع وتوافق رافت",
      description: "إثبات أمان آلة الحالة واكتمال تنصيب القائد عبر خوارزميات التوافق الموزع.",
      requirements: "تحقيق 95%+ في اختبار النظم الموزعة وبروتوكول رافت.",
      category: "أكاديمي وبحثي",
      tier: "بلاتيني",
      rarity: "أفضل 8% من الباحثين",
    },
    b_webgpu_speed: {
      name: "حافة التسريع العصبي الفوري",
      description: "ترجمة وتشغيل النماذج العصبية المحلية بتقنية WebGPU في المتصفح بزمن استجابة فائق السرعة.",
      requirements: "إجراء اختبار استدلال WASM/WebGPU على طرفية العميل.",
      category: "المعمارية وهندسة النظم",
      tier: "ماسي",
      rarity: "أفضل 3% من الباحثين",
    },
    b_socratic_debater: {
      name: "المحاور السقراطي المتقدم",
      description: "إتمام 10 مناظرات أكاديمية حية وتفاعلية مع المعلمة بترا والمساعد نشمي.",
      requirements: "المشاركة في 10 محادثات صوتية عبر وكيل الصوت المباشر.",
      category: "العمل الجماعي والتفاعل",
      tier: "ذهبي",
      rarity: "أفضل 12% من الباحثين",
    },
    b_spaced_rep: {
      name: "أستاذ التكرار المتباعد الذكي",
      description: "تحقيق 90%+ نسبة استبقاء طويل الأمد عبر بطاقات التكرار المتباعد لمدة 30 يوماً.",
      requirements: "إتقان أكثر من 50 بطاقة في نظام الاستدعاء النشط.",
      category: "التركيز والمواظبة",
      tier: "بلاتيني",
      rarity: "أفضل 5% من الباحثين",
    },
    b_quantum_crypt: {
      name: "عالم التشفير ما بعد الكمي",
      description: "تطبيق براهين التحقق الشبكي لخوارزميات Kyber و Dilithium المنيعة ضد الحواسيب الكمية.",
      requirements: "إتمام جميع الوحدات الأربع في مسار التشفير ما بعد الكمي.",
      category: "أكاديمي وبحثي",
      tier: "القمة",
      rarity: "أفضل 1% من الباحثين",
    },
    b_whiteboard_sync: {
      name: "التناغم التعاوني الفوري",
      description: "استضافة 5 جلسات دراسة تعاونية عبر غرف الدراسة الافتراضية مع مزامنة اللوح الرقمي.",
      requirements: "المشاركة في 5 جلسات لوح رقمي مشترك في غرف الدراسة.",
      category: "العمل الجماعي والتفاعل",
      tier: "فضي",
      rarity: "أفضل 18% من الباحثين",
    },
    b_capstone_titan: {
      name: "كبير مهندسي أسراب الوكلاء",
      description: "تصميم واختبار ونشر حل توافق الخزم التوزيعية Sheaf-ADMM للأنظمة متعددة الوكلاء.",
      requirements: "اجتياز تقييم مشروع تخرج ماجستير العلوم بمرتبة الشرف.",
      category: "مشروع التخرج والاعتماد",
      tier: "القمة",
      rarity: "أفضل 0.5% من الباحثين",
    },
  };

  // Sync user's unlocked badges with catalog
  const badgesWithStatus = BADGE_CATALOG.map((item) => {
    const isUserBadge = user.badges.some((b) => b.name === item.name || b.id === item.id);
    const arInfo = AR_BADGES[item.id];
    return {
      ...item,
      name: isAr && arInfo ? arInfo.name : item.name,
      description: isAr && arInfo ? arInfo.description : item.description,
      requirements: isAr && arInfo ? arInfo.requirements : item.requirements,
      category: isAr && arInfo ? (arInfo.category as any) : item.category,
      rarity: isAr && arInfo ? arInfo.rarity : item.rarity,
      unlocked: item.unlocked || isUserBadge,
    };
  });

  const categories = isAr
    ? ["الكل", "أكاديمي وبحثي", "المعمارية وهندسة النظم", "التركيز والمواظبة", "العمل الجماعي والتفاعل", "مشروع التخرج والاعتماد"]
    : ["All", "Academic", "Architecture", "Focus & Streak", "Collaboration", "Capstone"];

  const filteredBadges = badgesWithStatus.filter((b) => {
    const matchesCategory =
      selectedCategory === "All" ||
      selectedCategory === "الكل" ||
      b.category === selectedCategory;
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalUnlocked = badgesWithStatus.filter((b) => b.unlocked).length;
  const completionRate = Math.round((totalUnlocked / badgesWithStatus.length) * 100);

  // Particle Engine for Interactive Hover Effects
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    const colors = ["#22d3ee", "#38bdf8", "#818cf8", "#34d399", "#fbbf24", "#f43f5e"];

    const renderLoop = () => {
      ctx.clearRect(0, 0, width, height);

      // Update & Draw Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.alpha = 1 - p.life / p.maxLife;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1);
        }
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Trigger Particle Explosion on Badge Card Hover
  const handleBadgeHover = (e: React.MouseEvent<HTMLDivElement>, badge: EnhancedBadge) => {
    setHovecyanBadgeId(badge.id);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tierColors: Record<string, string[]> = {
      Gold: ["#fbbf24", "#f59e0b", "#fde68a"],
      Diamond: ["#22d3ee", "#67e8f9", "#e0f2fe"],
      Platinum: ["#a78bfa", "#c084fc", "#f3e8ff"],
      Apex: ["#f43f5e", "#fb7185", "#38bdf8", "#fbbf24"],
      Silver: ["#94a3b8", "#cbd5e1", "#f8fafc"],
      Bronze: ["#d97706", "#b45309", "#fed7aa"],
    };

    const palette = tierColors[badge.tier] || ["#22d3ee", "#38bdf8"];

    // Spawn 16-24 particles
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        size: Math.random() * 3 + 1.5,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 1,
        decay: 0.02,
        life: 0,
        maxLife: Math.random() * 40 + 25,
      });
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Apex":
        return "from-cyan-500 via-cyan-400 to-cyan-400 text-cyan-300 border-cyan-500/40 bg-cyan-500/10";
      case "Diamond":
        return "from-cyan-400 to-blue-500 text-cyan-300 border-cyan-500/40 bg-cyan-500/10";
      case "Platinum":
        return "from-cyan-400 to-blue-500 text-cyan-300 border-cyan-500/40 bg-cyan-500/10";
      case "Gold":
        return "from-cyan-400 to-cyan-500 text-cyan-300 border-cyan-500/40 bg-cyan-500/10";
      case "Silver":
        return "from-slate-300 to-slate-400 text-slate-300 border-slate-400/40 bg-slate-500/10";
      default:
        return "from-cyan-700 to-cyan-800 text-cyan-600 border-cyan-700/40 bg-cyan-900/10";
    }
  };

  return (
    <div className="relative p-5 rounded-3xl bg-[#091720] border border-[#1b3e50] space-y-6 overflow-hidden shadow-2xl">
      {/* Background Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      />

      {/* Header Banner */}
      <div className="relative z-20 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1b3e50]/60 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>{isAr ? "الأوسمة والشارات التخصصية" : "Honors & Micro-Credentials"}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mt-0.5 flex items-center gap-3">
            <span>{isAr ? "قاعة الشارات والإنجازات البصرية" : "Visual Badge Hall of Fame"}</span>
            <span className="px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono border border-cyan-500/40">
              {isAr
                ? `${totalUnlocked} / ${badgesWithStatus.length} شارة مفتوحة`
                : `${totalUnlocked} / ${badgesWithStatus.length} Unlocked`}
            </span>
          </h2>
          <p className="text-xs text-[#82a3b2] mt-1">
            {isAr
              ? "أوسمة إثبات الإتقان الحتمي والإنجازات الأكاديمية. مرّر المؤشر فوق أي شارة لتفعيل محرك الجسيمات التوافقي."
              : "Deterministic proof-of-mastery badges and academic milestone achievements. Hover over any badge to activate harmonic particle resonance."}
          </p>
        </div>

        {/* Level Progression Summary */}
        <div className="flex items-center gap-4 bg-[#061219] p-3 rounded-2xl border border-[#163545]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center font-black text-slate-950 text-base shadow-lg shadow-cyan-500/20">
            {user.level}
          </div>
          <div>
            <div className="text-[10px] text-[#7195a6] uppercase font-bold tracking-wider">
              {isAr ? "مجموع نقاط الإتقان الكلي" : "Total Mastery Score"}
            </div>
            <div className="text-sm font-black text-white font-mono">
              {user.xpPoints.toLocaleString()} XP • {completionRate}% {isAr ? "مكتمل" : "Complete"}
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="relative z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "bg-[#061219] text-[#789cae] hover:text-white border border-[#163545] hover:border-cyan-500/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#789cae]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? "بحث في الشارات والمستويات..." : "Search milestone or tier..."}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#061219] border border-[#163545] text-xs text-white placeholder-[#5d8091] focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
      </div>

      {/* Badge Hall Grid */}
      <div className="relative z-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredBadges.map((badge) => {
          const isHovered = hoveredBadgeId === badge.id;
          const tierStyle = getTierColor(badge.tier);
          const isCelebrating = celebratingBadgeId === badge.id;

          return (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.96 }}
              animate={
                isCelebrating
                  ? {
                      scale: [1, 1.2, 1.05, 1.15, 1],
                      boxShadow: [
                        "0 0 0px rgba(34,211,238,0)",
                        "0 0 40px rgba(34,211,238,0.95)",
                        "0 0 15px rgba(34,211,238,0.4)"
                      ]
                    }
                  : {}
              }
              transition={{ duration: 0.6, ease: "easeOut" }}
              onMouseEnter={(e) => handleBadgeHover(e, badge)}
              onClick={() => {
                setInspectBadge(badge);
                if (onSelectBadge) onSelectBadge(badge);
              }}
              className={`relative p-4 rounded-2xl border transition-all cursor-pointer overflow-hidden group ${
                badge.unlocked
                  ? "bg-[#0a1c27] hover:bg-[#0f2838] border-[#1e4256] hover:border-cyan-400/60 shadow-lg"
                  : "bg-[#061017]/60 border-[#142936] opacity-60 hover:opacity-80"
              }`}
            >
              {/* Glowing Background Radial on Hover */}
              {isHovered && badge.unlocked && (
                <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none animate-pulse" />
              )}

              <div className="flex items-start gap-3.5 relative z-10">
                {/* Badge Icon Container */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 border relative transition-transform group-hover:rotate-6 shadow-inner ${
                    badge.unlocked
                      ? `bg-gradient-to-br ${tierStyle} shadow-lg`
                      : "bg-[#07131b] border-white/5 text-gray-600 grayscale"
                  }`}
                >
                  {badge.unlocked ? (
                    badge.icon
                  ) : (
                    <Lock className="w-5 h-5 text-gray-500" />
                  )}

                  {badge.unlocked && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 border border-black flex items-center justify-center text-[9px] text-black font-black shadow">
                      ✓
                    </div>
                  )}
                </div>

                {/* Badge Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-black text-white truncate group-hover:text-cyan-300 transition-colors">
                      {badge.name}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${tierStyle}`}
                    >
                      {badge.tier}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#789cae] line-clamp-2 leading-relaxed">
                    {badge.description}
                  </p>

                  <div className="pt-1.5 flex items-center justify-between text-[10px]">
                    {badge.unlocked ? (
                      <span className="text-cyan-400 font-semibold font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {isAr
                          ? `مفتوحة (${badge.dateUnlocked || "مؤخراً"})`
                          : `Unlocked ${badge.dateUnlocked || "Recently"}`}
                      </span>
                    ) : (
                      <div className="w-full space-y-1">
                        <div className="flex justify-between text-[9px] text-[#7195a6]">
                          <span>{isAr ? "نسبة التقدم" : "Progress"}</span>
                          <span className="font-mono">{badge.progressPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#040e14] overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                            style={{ width: `${badge.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Badge Inspection Modal */}
      <AnimatePresence>
        {inspectBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setInspectBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md p-6 rounded-3xl bg-[#091b24] border border-cyan-500/40 text-white shadow-2xl space-y-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-3xl shadow-xl">
                    {inspectBadge.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{inspectBadge.name}</h3>
                    <span className="text-xs text-cyan-400 font-mono font-bold">
                      {inspectBadge.tier} • {inspectBadge.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setInspectBadge(null)}
                  className="p-1.5 rounded-xl bg-black/40 hover:bg-black/80 text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#061219] border border-[#163545] space-y-2 text-xs">
                <div className="text-[#8bb0c0] leading-relaxed">
                  {inspectBadge.description}
                </div>
                <div className="pt-2 border-t border-[#163545] flex items-center justify-between text-[11px]">
                  <span className="text-gray-400">{isAr ? "تصنيف الندرة الأكاديمي:" : "Rarity Classification:"}</span>
                  <span className="font-mono text-cyan-300 font-bold">{inspectBadge.rarity}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-400">{isAr ? "مكافأة نقاط الخبرة:" : "XP Bounty Reward:"}</span>
                  <span className="font-mono text-cyan-400 font-bold">+{inspectBadge.xpReward} XP</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-400">{isAr ? "المتطلبات:" : "Requirements:"}</span>
                  <span className="text-white font-medium text-right max-w-[200px]">{inspectBadge.requirements}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <button
                  onClick={() => {
                    handleSimulateUnlock(inspectBadge);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-cyan-500/20 hover:from-cyan-500/30 hover:to-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
                  <span>{isAr ? "اختبار تأثير الفتح" : "Test Unlock Effect"}</span>
                </button>

                <button
                  onClick={() => {
                    const verificationHash = `ZALAMATI-BADGE-VERIFY-${inspectBadge.id}-${Date.now().toString(36).toUpperCase()}`;
                    navigator.clipboard?.writeText(verificationHash);
                    toastService.success(
                      isAr ? "تم نسخ كود التحقق" : "Verification Hash Copied",
                      isAr
                        ? `تم نسخ رمز توثيق شارة [${inspectBadge.name}] إلى الحافظة بنجاح.`
                        : `Badge [${inspectBadge.name}] credential hash copied to clipboard!`
                    );
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#0f2838] hover:bg-[#15394f] border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{isAr ? "تشارك التوثيق" : "Share"}</span>
                </button>

                <button
                  onClick={() => setInspectBadge(null)}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition-all shadow-lg"
                >
                  {isAr ? "إغلاق المعاينة" : "Close Showcase"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
