import React from "react";
import {
  Globe,
  GraduationCap,
  Sparkles,
  Award,
  BookOpen,
  Heart,
  CheckCircle,
  Brain,
  Layers,
  Building,
  Users,
} from "lucide-react";

export const AboutProjectView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1c26] via-[#0e2735] to-[#061219] border border-[#1d3d4c] p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5" />
            <span>Master Plan for Universal Free Education</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Building the Non-Profit Knowledge Engine for Humanity
          </h1>
          <p className="text-sm md:text-base text-[#88acbd] leading-relaxed">
            LMDpro was founded on a simple, uncompromising premise: high-quality
            higher education, accredited LMD degrees, and advanced Socratic Kudo
            Agent tutoring should be a fundamental human right available to all
            people on Earth for free.
          </p>
        </div>
      </div>

      {/* 4 Pillars of Universal Knowledge */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
        {[
          {
            icon: Heart,
            title: "100% Free & Zero Ads Ever",
            color: "text-cyan-400",
            desc: "Higher education should never be gated behind $50,000 university tuition fees or predatory student loan debts. Zalamati operates as a pure non-profit public utility.",
          },
          {
            icon: Brain,
            title: "Socratic AI Tutor in Every Pocket",
            color: "text-cyan-400",
            desc: "Every student receives a 24/7 personal Socratic AI tutor that adapts to their learning level, explains concepts in 8+ native languages, and breaks down complex mathematics step by step.",
          },
          {
            icon: GraduationCap,
            title: "Accredited Degree Pathways",
            color: "text-cyan-400",
            desc: "Modular degree tracks aligned with European Credit Transfer (ECTS), US Semester Credits, and UNESCO lifelong learning guidelines with verifiable cryptographic certificates.",
          },
          {
            icon: Globe,
            title: "Global Educational Equity",
            color: "text-cyan-400",
            desc: "Designed for low-bandwidth, offline-first execution so students in developing regions or remote areas can download complete degree modules and study offline uninterrupted.",
          },
        ].map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[#10222c] border border-[#1c3c4b] space-y-3 hover:border-cyan-500/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#08131a] border border-[#1d3d4c] flex items-center justify-center">
                <Icon className={`w-5 h-5 ${pillar.color}`} />
              </div>
              <h3 className="text-base font-bold text-white">{pillar.title}</h3>
              <p className="text-xs text-[#7e9fb0] leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Long Term Master Roadmap 2026-2030 */}
      <div className="p-6 rounded-2xl bg-[#10222c] border border-[#1c3c4b] space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          The 2026–2030 Universal Education Roadmap
        </h2>

        <div className="space-y-4">
          {[
            {
              phase: "Phase 1: Open Socratic Engine (2026)",
              status: "Active Release",
              desc: "Deploy Gemini 3.1 Pro Socratic tutoring, Google Workspace & Classroom bridge, and 8 accredited degree programs.",
            },
            {
              phase: "Phase 2: Global Offline Academic Mesh (2027)",
              status: "In Development",
              desc: "Distribute quantized Gemma 4 open-weight local models on mobile devices and WebGPU browsers for offline learning.",
            },
            {
              phase: "Phase 3: Universal University Accreditation (2028)",
              status: "Planned",
              desc: "Partner with 100+ global non-profit universities to cross-credit Zalamati degree modules into official university diplomas.",
            },
            {
              phase: "Phase 4: 1 Billion Scholars Empowered (2030)",
              status: "Vision Goal",
              desc: "Provide 100% free higher education, research tools, and career verification to over 1 billion students globally.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-[#0d1a21] border border-[#1a3847] flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-sm font-bold text-white">
                    {item.phase}
                  </span>
                </div>
                <p className="text-xs text-[#7398a8] pl-6">{item.desc}</p>
              </div>
              <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20 shrink-0 self-start md:self-center">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
