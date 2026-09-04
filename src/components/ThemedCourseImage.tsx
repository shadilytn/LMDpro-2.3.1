import React from "react";
import { 
  Code2, 
  Cpu, 
  Brain, 
  Globe, 
  Database, 
  ShieldCheck, 
  Compass, 
  Layers, 
  Zap, 
  Sparkles, 
  GraduationCap, 
  Binary, 
  Activity, 
  Atom, 
  LineChart 
} from "lucide-react";

interface ThemedCourseImageProps {
  src?: string;
  alt: string;
  category?: string;
  className?: string;
  variant?: "course" | "degree" | "header" | "compact";
}

export const ThemedCourseImage: React.FC<ThemedCourseImageProps> = ({
  src,
  alt,
  category = "Computer Science",
  className = "w-full h-full object-cover",
  variant = "course",
}) => {
  const [imageError, setImageError] = React.useState(false);

  // Map category to a themed vector icon
  const getCategoryIcon = () => {
    const cat = category.toLowerCase();
    if (cat.includes("ai") || cat.includes("machine") || cat.includes("neural") || cat.includes("cognitive") || cat.includes("agent"))
      return Brain;
    if (cat.includes("data") || cat.includes("database") || cat.includes("analytics")) 
      return Database;
    if (cat.includes("cyber") || cat.includes("security") || cat.includes("crypt") || cat.includes("defense")) 
      return ShieldCheck;
    if (cat.includes("system") || cat.includes("hardware") || cat.includes("cpu") || cat.includes("chip")) 
      return Cpu;
    if (cat.includes("quantum") || cat.includes("physics") || cat.includes("energy")) 
      return Atom;
    if (cat.includes("finance") || cat.includes("trading") || cat.includes("market") || cat.includes("economic")) 
      return LineChart;
    if (cat.includes("bio") || cat.includes("health") || cat.includes("medical") || cat.includes("genomic")) 
      return Activity;
    if (cat.includes("web") || cat.includes("cloud") || cat.includes("network") || cat.includes("distributed")) 
      return Globe;
    if (cat.includes("degree") || cat.includes("phd") || cat.includes("master") || cat.includes("bachelor")) 
      return GraduationCap;
    return Code2;
  };

  const IconComponent = getCategoryIcon();

  // Draw customized high-fidelity geometric SVG vector shapes depending on the category
  const renderGeometrySVG = () => {
    const cat = category.toLowerCase();
    
    if (cat.includes("ai") || cat.includes("machine") || cat.includes("neural") || cat.includes("cognitive") || cat.includes("agent")) {
      // Neural Net Node Grid & Sheaf Stalk Matrix
      return (
        <>
          <line x1="20" y1="30" x2="60" y2="20" stroke="currentColor" strokeWidth="0.5" />
          <line x1="20" y1="30" x2="50" y2="60" stroke="currentColor" strokeWidth="0.5" />
          <line x1="60" y1="20" x2="100" y2="40" stroke="currentColor" strokeWidth="0.5" />
          <line x1="50" y1="60" x2="100" y2="40" stroke="currentColor" strokeWidth="0.5" />
          <line x1="50" y1="60" x2="80" y2="95" stroke="currentColor" strokeWidth="0.5" />
          <line x1="100" y1="40" x2="150" y2="30" stroke="currentColor" strokeWidth="0.5" />
          <line x1="100" y1="40" x2="140" y2="80" stroke="currentColor" strokeWidth="0.5" />
          <line x1="80" y1="95" x2="140" y2="80" stroke="currentColor" strokeWidth="0.5" />
          <line x1="150" y1="30" x2="180" y2="60" stroke="currentColor" strokeWidth="0.5" />
          <line x1="140" y1="80" x2="180" y2="60" stroke="currentColor" strokeWidth="0.5" />
          
          <circle cx="20" cy="30" r="3" className="fill-cyan-500 stroke-cyan-400" strokeWidth="0.5" />
          <circle cx="60" cy="20" r="4" className="fill-cyan-500 stroke-cyan-400" strokeWidth="0.5" />
          <circle cx="50" cy="60" r="3" className="fill-cyan-500 stroke-cyan-400" strokeWidth="0.5" />
          <circle cx="100" cy="40" r="6" className="fill-blue-950 stroke-cyan-400" strokeWidth="1" />
          <circle cx="80" cy="95" r="4" className="fill-cyan-500 stroke-cyan-400" strokeWidth="0.5" />
          <circle cx="150" cy="30" r="3" className="fill-cyan-500 stroke-cyan-400" strokeWidth="0.5" />
          <circle cx="140" cy="80" r="4" className="fill-cyan-500 stroke-cyan-400" strokeWidth="0.5" />
          <circle cx="180" cy="60" r="3" className="fill-cyan-500 stroke-cyan-400" strokeWidth="0.5" />

          {/* Glowing pulse rings */}
          <circle cx="100" cy="40" r="14" stroke="currentColor" strokeWidth="0.25" fill="none" strokeDasharray="2 2" />
          <circle cx="100" cy="40" r="24" stroke="currentColor" strokeWidth="0.25" fill="none" />
          <circle cx="100" cy="40" r="36" stroke="#22d3ee" strokeWidth="0.2" fill="none" opacity="0.4" strokeDasharray="4 2" />
        </>
      );
    }

    if (cat.includes("quantum") || cat.includes("physics") || cat.includes("energy")) {
      // Orbital Probability Clouds & Wave Packets
      return (
        <>
          <ellipse cx="100" cy="60" rx="65" ry="24" stroke="currentColor" strokeWidth="0.5" fill="none" transform="rotate(-30 100 60)" />
          <ellipse cx="100" cy="60" rx="65" ry="24" stroke="currentColor" strokeWidth="0.5" fill="none" transform="rotate(30 100 60)" />
          <ellipse cx="100" cy="60" rx="65" ry="24" stroke="#22d3ee" strokeWidth="0.5" fill="none" transform="rotate(90 100 60)" opacity="0.6" />
          <circle cx="100" cy="60" r="8" className="fill-cyan-500 stroke-cyan-300" strokeWidth="1" />
          <circle cx="50" cy="35" r="3" className="fill-cyan-400" />
          <circle cx="150" cy="85" r="3" className="fill-cyan-400" />
          <circle cx="145" cy="35" r="3" className="fill-cyan-400" />
          <circle cx="55" cy="85" r="3" className="fill-cyan-400" />
          <path d="M 10,60 Q 40,20 70,60 T 130,60 T 190,60" stroke="#34d399" strokeWidth="0.5" fill="none" opacity="0.4" strokeDasharray="2 2" />
        </>
      );
    }

    if (cat.includes("finance") || cat.includes("trading") || cat.includes("market") || cat.includes("economic")) {
      // Stochastic Waves & Volatility Candlestick Corridor
      return (
        <>
          <path d="M 10,95 L 40,75 L 70,85 L 100,45 L 130,60 L 160,25 L 190,35" stroke="#22d3ee" strokeWidth="1" fill="none" />
          <path d="M 10,95 L 40,75 L 70,85 L 100,45 L 130,60 L 160,25 L 190,35 L 190,115 L 10,115 Z" fill="url(#financeGrad)" opacity="0.15" />
          <line x1="40" y1="65" x2="40" y2="85" stroke="#34d399" strokeWidth="2" />
          <line x1="70" y1="75" x2="70" y2="95" stroke="#ef4444" strokeWidth="2" />
          <line x1="100" y1="35" x2="100" y2="55" stroke="#34d399" strokeWidth="2" />
          <line x1="130" y1="50" x2="130" y2="70" stroke="#ef4444" strokeWidth="2" />
          <line x1="160" y1="15" x2="160" y2="35" stroke="#34d399" strokeWidth="2" />
          <line x1="0" y1="100" x2="200" y2="100" stroke="currentColor" strokeWidth="0.25" strokeDasharray="3 3" />
        </>
      );
    }

    if (cat.includes("bio") || cat.includes("health") || cat.includes("medical") || cat.includes("genomic")) {
      // DNA Double Helix Lattice & Cellular Rings
      return (
        <>
          <path d="M 20,40 Q 60,80 100,40 T 180,40" stroke="#22d3ee" strokeWidth="0.75" fill="none" />
          <path d="M 20,80 Q 60,40 100,80 T 180,80" stroke="#34d399" strokeWidth="0.75" fill="none" />
          <line x1="40" y1="50" x2="40" y2="70" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1" />
          <line x1="60" y1="60" x2="60" y2="60" stroke="#f59e0b" strokeWidth="2" />
          <line x1="80" y1="50" x2="80" y2="70" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1" />
          <line x1="100" y1="40" x2="100" y2="80" stroke="#38bdf8" strokeWidth="1" />
          <line x1="120" y1="50" x2="120" y2="70" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1" />
          <line x1="140" y1="60" x2="140" y2="60" stroke="#f59e0b" strokeWidth="2" />
          <line x1="160" y1="50" x2="160" y2="70" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1" />
        </>
      );
    }

    if (cat.includes("data") || cat.includes("database") || cat.includes("analytics")) {
      // Concentric Segmented Rings & Radial Coordinate Rays
      return (
        <>
          <circle cx="100" cy="60" r="50" stroke="currentColor" strokeWidth="0.35" fill="none" strokeDasharray="4 2" />
          <circle cx="100" cy="60" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <circle cx="100" cy="60" r="25" stroke="currentColor" strokeWidth="0.35" fill="none" strokeDasharray="1 3" />
          <circle cx="100" cy="60" r="12" stroke="currentColor" strokeWidth="0.5" fill="none" />
          
          <line x1="100" y1="10" x2="100" y2="110" stroke="currentColor" strokeWidth="0.25" strokeDasharray="3 3" />
          <line x1="50" y1="60" x2="150" y2="60" stroke="currentColor" strokeWidth="0.25" strokeDasharray="3 3" />
          
          <path d="M 100,20 A 40,40 0 0,1 140,60" stroke="#22d3ee" strokeWidth="1.5" fill="none" />
          <path d="M 60,60 A 40,40 0 0,1 100,100" stroke="#34d399" strokeWidth="1.5" fill="none" />
          
          <rect x="98" y="18" width="4" height="4" className="fill-cyan-400" />
          <rect x="138" y="58" width="4" height="4" className="fill-cyan-400" />
          <rect x="98" y="98" width="4" height="4" className="fill-cyan-400" />
          <rect x="58" y="58" width="4" height="4" className="fill-cyan-400" />
        </>
      );
    }

    if (cat.includes("cyber") || cat.includes("security") || cat.includes("defense") || cat.includes("crypt")) {
      // Hexagonal Shield Grid Mapping
      return (
        <>
          <polygon points="100,15 145,40 145,90 100,115 55,90 55,40" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <polygon points="100,25 135,46 135,84 100,105 65,84 65,46" stroke="currentColor" strokeWidth="0.35" fill="none" strokeDasharray="3 3" />
          <polygon points="100,35 125,51 125,79 100,95 75,79 75,51" stroke="#22d3ee" strokeWidth="0.75" fill="none" opacity="0.3" />
          
          <line x1="100" y1="15" x2="100" y2="115" stroke="currentColor" strokeWidth="0.4" />
          <line x1="55" y1="40" x2="145" y2="90" stroke="currentColor" strokeWidth="0.4" />
          <line x1="55" y1="90" x2="145" y2="40" stroke="currentColor" strokeWidth="0.4" />

          <circle cx="100" cy="15" r="2.5" className="fill-cyan-400" />
          <circle cx="145" cy="40" r="2.5" className="fill-cyan-400" />
          <circle cx="145" cy="90" r="2.5" className="fill-cyan-400" />
          <circle cx="100" cy="115" r="2.5" className="fill-cyan-400" />
          <circle cx="55" cy="90" r="2.5" className="fill-cyan-400" />
          <circle cx="55" cy="40" r="2.5" className="fill-cyan-400" />
        </>
      );
    }

    if (cat.includes("system") || cat.includes("hardware") || cat.includes("cpu") || cat.includes("chip")) {
      // Silicon Circuit Traces & Microchip Nodes
      return (
        <>
          <rect x="75" y="35" width="50" height="50" rx="4" stroke="currentColor" strokeWidth="0.75" fill="none" />
          <rect x="80" y="40" width="40" height="40" rx="2" stroke="#22d3ee" strokeWidth="0.5" fill="none" strokeDasharray="2 1" />
          
          <line x1="75" y1="45" x2="40" y2="45" stroke="currentColor" strokeWidth="0.5" />
          <line x1="40" y1="45" x2="25" y2="30" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="25" cy="30" r="2" className="fill-cyan-400" />
          
          <line x1="75" y1="75" x2="45" y2="75" stroke="currentColor" strokeWidth="0.5" />
          <line x1="45" y1="75" x2="35" y2="85" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="35" cy="85" r="2" className="fill-cyan-400" />

          <line x1="125" y1="45" x2="160" y2="45" stroke="currentColor" strokeWidth="0.5" />
          <line x1="160" y1="45" x2="175" y2="60" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="175" cy="60" r="2" className="fill-cyan-400" />

          <line x1="125" y1="75" x2="155" y2="75" stroke="currentColor" strokeWidth="0.5" />
          <line x1="155" y1="75" x2="165" y2="65" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="165" cy="65" r="2" className="fill-cyan-400" />

          <line x1="100" y1="35" x2="100" y2="15" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="15" r="2" className="fill-cyan-400" />

          <line x1="100" y1="85" x2="100" y2="105" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="105" r="2" className="fill-cyan-400" />
        </>
      );
    }

    // Default: Abstract overlapping matrices, curves and grid lines
    return (
      <>
        <line x1="0" y1="0" x2="200" y2="120" stroke="currentColor" strokeWidth="0.4" />
        <line x1="200" y1="0" x2="0" y2="120" stroke="currentColor" strokeWidth="0.4" />
        <circle cx="100" cy="60" r="40" stroke="currentColor" strokeWidth="0.4" fill="none" strokeDasharray="3 3" />
        <circle cx="100" cy="60" r="60" stroke="currentColor" strokeWidth="0.4" fill="none" />
        <path d="M 0,20 Q 100,0 200,20" stroke="currentColor" strokeWidth="0.4" fill="none" />
        <path d="M 0,100 Q 100,120 200,100" stroke="currentColor" strokeWidth="0.4" fill="none" />
        <path d="M 30,60 Q 100,10 170,60" stroke="#22d3ee" strokeWidth="0.6" fill="none" opacity="0.6" />
        <path d="M 30,60 Q 100,110 170,60" stroke="#34d399" strokeWidth="0.6" fill="none" opacity="0.6" />
      </>
    );
  };

  // Fallback to a themed vector artwork matching LMDpro dark slate/cyan/cyan aesthetic
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-[#050c11] via-[#091822] to-[#02070a] flex flex-col items-center justify-center p-4 border border-cyan-500/20 ${className}`}
    >
      {/* Decorative background grid and glowing circles */}
      <div className="absolute inset-0 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Intricate Degrees Header Geometry Lines */}
      <svg
        className="absolute inset-0 w-full h-full text-cyan-500/15 pointer-events-none"
        viewBox="0 0 200 120"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="financeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {renderGeometrySVG()}
      </svg>

      <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

      {/* Center Vector Badge */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-2 max-w-[90%]">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#22d3ee] via-[#34d399] to-[#f59e0b] p-0.5 shadow-lg shadow-cyan-900/50">
          <div className="w-full h-full bg-[#050c11] rounded-[14px] flex items-center justify-center text-cyan-300">
            <IconComponent className="w-5 h-5" />
          </div>
        </div>
        <span className="text-xs font-black text-white tracking-tight line-clamp-1 px-2">
          {alt}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[9px] font-bold text-cyan-400/90 uppercase tracking-widest font-mono">
            {variant === "degree" ? "Accredited Academic Degree" : "LMDpro Core Pathway"}
          </span>
        </div>
      </div>
    </div>
  );
};

