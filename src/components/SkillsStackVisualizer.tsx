import React from "react";
import {
  Layers,
  Award,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  Target,
  ChevronRight,
  TrendingUp,
  Cpu,
  Brain,
  ShieldCheck,
  Globe,
  Star,
} from "lucide-react";
import { UserProfile } from "../shared/types";

export interface MicroCredential {
  id: string;
  domain: string;
  title: string;
  issuedBy: string;
  unlockedAt: string;
  level: "Novice" | "Practitioner" | "Advanced" | "Master Architect";
  verificationHash: string;
  skillsAcquired: string[];
  courseOrigin: string;
  icon: string;
}

export interface TechnicalDomainMastery {
  domainId: string;
  domainName: string;
  icon: React.ReactNode;
  levelTitle: string;
  masteryPercent: number; // 0-100
  totalBadges: number;
  unlockedBadges: number;
  color: string;
  borderColor: string;
  badgeList: MicroCredential[];
}

interface SkillsStackVisualizerProps {
  user: UserProfile;
}

export const SkillsStackVisualizer: React.FC<SkillsStackVisualizerProps> = ({
  user,
}) => {
  const [activeDomainId, setActiveDomainId] = React.useState<string>("ai-models");

  const domainMasteryList: TechnicalDomainMastery[] = [
    {
      domainId: "ai-models",
      domainName: "Transformer LLMs & Multi-Agent Swarms",
      icon: <Brain className="w-5 h-5 text-cyan-400" />,
      levelTitle: "Master Architect",
      masteryPercent: 88,
      totalBadges: 5,
      unlockedBadges: 4,
      color: "bg-cyan-500/20 text-cyan-300",
      borderColor: "border-cyan-500/40",
      badgeList: [
        {
          id: "mc-1",
          domain: "AI Models",
          title: "Transformer Self-Attention Mechanics",
          issuedBy: "Zalamati AI Academic Labs",
          unlockedAt: "July 2026",
          level: "Master Architect",
          verificationHash: "0x8f9a...3b21",
          skillsAcquired: [
            "Multi-Head Attention",
            "QKV Projection",
            "Positional Embedding",
          ],
          courseOrigin: "M.S. Artificial Intelligence & Cognitive Architecture",
          icon: "🤖",
        },
        {
          id: "mc-2",
          domain: "AI Models",
          title: "Persistent Vector Memory & RAG Retrieval",
          issuedBy: "DeepMind Partner Labs",
          unlockedAt: "June 2026",
          level: "Advanced",
          verificationHash: "0x3c7e...9a41",
          skillsAcquired: [
            "Vector Caching",
            "Gemini Embedding 2",
            "Cosine Similarity",
          ],
          courseOrigin: "AI301 Transformer Models",
          icon: "⚡",
        },
        {
          id: "mc-3",
          domain: "AI Models",
          title: "Multi-Agent Swarm Orchestration",
          issuedBy: "Antigravity Autonomous Platform",
          unlockedAt: "May 2026",
          level: "Advanced",
          verificationHash: "0x1d4a...5f89",
          skillsAcquired: ["Agent Loops", "Tool Calling", "State Handoff"],
          courseOrigin: "AI401 Multi-Agent Swarms",
          icon: "🌐",
        },
      ],
    },
    {
      domainId: "dist-sys",
      domainName: "Distributed Systems & Consensus",
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      levelTitle: "Advanced Practitioner",
      masteryPercent: 76,
      totalBadges: 4,
      unlockedBadges: 3,
      color: "bg-cyan-500/20 text-cyan-300",
      borderColor: "border-cyan-500/40",
      badgeList: [
        {
          id: "mc-4",
          domain: "Distributed Systems",
          title: "Raft Consensus Leader Election & Quorums",
          issuedBy: "Zalamati Engineering Board",
          unlockedAt: "April 2026",
          level: "Advanced",
          verificationHash: "0x7e21...0c48",
          skillsAcquired: [
            "Leader Election",
            "Log Replication",
            "Split-Vote Resolution",
          ],
          courseOrigin: "DS201 Distributed Consensus",
          icon: "🛡️",
        },
        {
          id: "mc-5",
          domain: "Distributed Systems",
          title: "Concurrent Async I/O Event Loops",
          issuedBy: "Zalamati Systems Academy",
          unlockedAt: "March 2026",
          level: "Practitioner",
          verificationHash: "0x9b12...4d76",
          skillsAcquired: [
            "Lock-free Queues",
            "Epoll/Kqueue",
            "Non-blocking Sockets",
          ],
          courseOrigin: "DS101 Concurrent Programming",
          icon: "⚡",
        },
      ],
    },
    {
      domainId: "edge-gpu",
      domainName: "Zero-Latency WebGPU Compute Shaders",
      icon: <Zap className="w-5 h-5 text-cyan-400" />,
      levelTitle: "Practitioner",
      masteryPercent: 60,
      totalBadges: 3,
      unlockedBadges: 2,
      color: "bg-cyan-500/20 text-cyan-300",
      borderColor: "border-cyan-500/40",
      badgeList: [
        {
          id: "mc-6",
          domain: "WebGPU",
          title: "WGSL Matrix Multiplication Shaders",
          issuedBy: "W3C WebGPU Standards Group",
          unlockedAt: "February 2026",
          level: "Practitioner",
          verificationHash: "0x4f89...2e10",
          skillsAcquired: [
            "WGSL Shaders",
            "Workgroup Alignment",
            "GPU Memory Buffers",
          ],
          courseOrigin: "DS301 WebGPU Shaders",
          icon: "💎",
        },
      ],
    },
  ];

  const activeDomain =
    domainMasteryList.find((d) => d.domainId === activeDomainId) ||
    domainMasteryList[0];

  return (
    <div className="p-5 rounded-2xl bg-[#0d1e27] border border-[#1a3848] space-y-5 shadow-xl">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#183646] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold uppercase">
              Verified Credential Stack
            </span>
            <span className="text-xs text-[#789cae]">
              Micro-Badge & Domain Mastery Engine
            </span>
          </div>
          <h3 className="text-base font-black text-white mt-0.5 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Granular Technical Skills Stack</span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-[#08151c] border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
            Total Badges:{" "}
            {domainMasteryList.reduce((acc, d) => acc + d.unlockedBadges, 0)}{" "}
            Unlocked
          </span>
        </div>
      </div>

      {/* Domain Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {domainMasteryList.map((domain) => {
          const isSelected = domain.domainId === activeDomainId;

          return (
            <div
              key={domain.domainId}
              onClick={() => setActiveDomainId(domain.domainId)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 space-y-3 shadow-md ${
                isSelected
                  ? "bg-[#091b26] border-cyan-400 ring-1 ring-cyan-400/40"
                  : "bg-[#08151c] border-[#1b3b4a] hover:border-cyan-500/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-[#0c202d] border border-[#1c3e52]">
                  {domain.icon}
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${domain.color} ${domain.borderColor}`}
                >
                  {domain.levelTitle}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-xs text-white leading-snug">
                  {domain.domainName}
                </h4>
                <p className="text-[10px] text-[#789cae] mt-0.5 font-mono">
                  {domain.unlockedBadges}/{domain.totalBadges} Badges Unlocked
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400">Mastery Depth</span>
                  <span className="text-cyan-300 font-mono font-bold">
                    {domain.masteryPercent}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[#040e13] overflow-hidden border border-[#1b3b4a]">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-cyan-400 transition-all duration-500"
                    style={{ width: `${domain.masteryPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Domain Micro-Credentials Details */}
      <div className="p-4 rounded-xl bg-[#08151c] border border-[#1b3b4a] space-y-3">
        <div className="flex items-center justify-between border-b border-[#183646] pb-2">
          <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>
              Unlocked Micro-Credentials for {activeDomain.domainName}
            </span>
          </h4>
          <span className="text-[10px] font-mono text-cyan-400">
            Cryptographically Verified on Zalamati Ledger
          </span>
        </div>

        <div className="space-y-2.5">
          {activeDomain.badgeList.map((badge) => (
            <div
              key={badge.id}
              className="p-3.5 rounded-xl bg-[#0c1f2a] border border-[#1a3848] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 rounded-xl bg-[#08151c] border border-cyan-500/30 shrink-0">
                  {badge.icon}
                </span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-white text-xs">
                      {badge.title}
                    </h5>
                    <span className="px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[9px] font-mono">
                      {badge.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#789cae]">
                    {badge.courseOrigin}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {badge.skillsAcquired.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[9px]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-right sm:shrink-0 font-mono text-[10px] space-y-1 border-t sm:border-t-0 border-[#183646] pt-2 sm:pt-0">
                <div className="text-cyan-400 flex items-center gap-1 justify-end">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{badge.unlockedAt}</span>
                </div>
                <div className="text-[#597e90]">
                  Hash: {badge.verificationHash}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
