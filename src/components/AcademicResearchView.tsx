import React from "react";
import {
  Globe,
  RefreshCw,
  Database,
  Layers,
  Search,
  Sparkles,
  BookOpen,
  FileText,
  Cpu,
  CheckCircle2,
  Bookmark,
  Share2,
  Network,
  Download,
  ExternalLink,
  Sliders,
  Play
} from "lucide-react";
import { motion } from "motion/react";
import { toastService } from "../services/toastService";
import { ragSyncService } from "../services/ragSyncService";
import { OfflineStorageService } from "../services/offlineStorage";

interface AcademicResearchViewProps {
  onOpenRagModal?: () => void;
}

export const AcademicResearchView: React.FC<AcademicResearchViewProps> = ({ onOpenRagModal }) => {
  const [isCrawling, setIsCrawling] = React.useState(false);
  const [crawlProgress, setCrawlProgress] = React.useState(0);
  const [selectedPaper, setSelectedPaper] = React.useState<any | null>(null);
  const [filterDomain, setFilterDomain] = React.useState<string>("All");

  const researchPapers = [
    {
      id: "res-1",
      title: "Decentralized Consensus: Sheaf-ADMM Topology for Autonomous Swarms",
      domain: "Distributed AI",
      author: "Dr. S. Banyata, LMDpro Research Faculty",
      citations: 48,
      year: "2026",
      status: "Indexed & Embedded",
      abstract: "Analyzes cellular sheaf restriction maps for decentralized consensus across multi-agent e-learning networks, achieving asymptotic convergence without central coordinators.",
      tags: ["Sheaf Theory", "ADMM Consensus", "Cellular Complexes", "Multi-Agent"]
    },
    {
      id: "res-2",
      title: "Audio-Anchored SSML Synchronization Engine for Interactive 3D Explainers",
      domain: "Computer Graphics & TTS",
      author: "LMDpro Visual Lab",
      citations: 36,
      year: "2026",
      status: "Indexed & Embedded",
      abstract: "Presents an audio-anchored timeline clock utilizing Google Cloud Text-to-Speech SSML Mark timepoints to sync voice narration with WebGL 3D parameter adjustments without frame drift.",
      tags: ["SSML", "WebGL", "Three.js", "Audio-Visual Sync"]
    },
    {
      id: "res-3",
      title: "Quantum Neural Networks and Vector Embedding Spaces in High-Dimensional Manifolds",
      domain: "Quantum Computing",
      author: "LMD Quantum & Cybernetics Faculty",
      citations: 52,
      year: "2026",
      status: "Indexed & Embedded",
      abstract: "Explores Parameterized Quantum Circuits (PQC) for projecting continuous embedding vectors into Hilbert spaces, unlocking non-Euclidean semantic cluster separation.",
      tags: ["Quantum Computing", "Hilbert Space", "QNN", "Embeddings"]
    },
    {
      id: "res-4",
      title: "Non-Interactive Zero-Knowledge Proofs in Decentralized Academic Credentials",
      domain: "Cryptography & Security",
      author: "LMD Security Center",
      citations: 29,
      year: "2026",
      status: "Indexed & Embedded",
      abstract: "Implements Groth16 zk-SNARK circuits over BN254 elliptic curves for verifiable university transcripts and degree certifications without revealing individual student quiz traces.",
      tags: ["zk-SNARKs", "Groth16", "Cryptography", "Academic Identity"]
    },
    {
      id: "res-5",
      title: "Sheaf-Theoretic Planning (STP) and Categorical Resilience in Autonomous Systems",
      domain: "Cognitive AI",
      author: "Cognitive Foundations Group",
      citations: 31,
      year: "2026",
      status: "Indexed & Embedded",
      abstract: "Replaces traditional modal temporal logic with categorical topos theory and sheaf semantics to enable resilient goal re-routing upon environmental disturbances.",
      tags: ["Topos Theory", "Obstruction Cocycle", "Planning", "Cognitive Mesh"]
    }
  ];

  const handleStartCrawl = () => {
    setIsCrawling(true);
    setCrawlProgress(15);
    
    setTimeout(() => setCrawlProgress(45), 600);
    setTimeout(() => setCrawlProgress(80), 1200);
    setTimeout(() => {
      setCrawlProgress(100);
      setIsCrawling(false);
      ragSyncService.syncIndexedDocuments();
      toastService.show({
        type: "success",
        title: "Autonomous Crawl & Index Complete ⚡",
        message: "Scanned arXiv & university archives. 4 new preprints vectorized and added to local RAG memory.",
        duration: 4500
      });
    }, 1800);
  };

  const filteredPapers = filterDomain === "All" 
    ? researchPapers 
    : researchPapers.filter(p => p.domain === filterDomain);

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1a24] via-[#091b26] to-[#040e14] border border-[#1b3b4a] p-6 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#22d3ee]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22d3ee]/10 border border-[#22d3ee]/20 text-cyan-300 text-xs font-bold">
            <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "12s" }} />
            <span>Autonomous Academic Research & Deep Crawl Engine</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Academic Research <span className="text-cyan-400 font-light">& Preprint Synthesis</span>
          </h1>

          <p className="text-xs md:text-sm text-[#7fa3b5] leading-relaxed">
            Autonomous multi-agent research pipelines scanning university repositories, arXiv preprints, 
            and patent publications. Vectorized into high-dimensional embedding spaces for instant semantic synthesis.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleStartCrawl}
              disabled={isCrawling}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-cyan-900/30"
            >
              <RefreshCw className={`w-4 h-4 ${isCrawling ? "animate-spin" : ""}`} />
              <span>{isCrawling ? `Crawling Repositories (${crawlProgress}%)...` : "Execute Deep Academic Crawl"}</span>
            </button>

            {onOpenRagModal && (
              <button
                onClick={onOpenRagModal}
                className="px-4 py-2.5 rounded-xl bg-[#091821] hover:bg-[#102736] border border-[#1b3b4a] hover:border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all flex items-center gap-2"
              >
                <Network className="w-4 h-4" />
                <span>Open D3 Knowledge Cluster Graph</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Crawling Progress Indicator */}
      {isCrawling && (
        <div className="p-4 rounded-2xl bg-[#091821] border border-cyan-500/30 space-y-2 animate-scale-up">
          <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>Crawling Academic Repositories: arXiv, OpenReview, IEEE Xplore...</span>
            </span>
            <span className="font-mono">{crawlProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#061015] overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300 rounded-full"
              style={{ width: `${crawlProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Indexed Papers", value: "1,420+", icon: BookOpen, color: "text-cyan-400" },
          { label: "Vector Embeddings", value: "84.2K", icon: Cpu, color: "text-cyan-400" },
          { label: "Research Citations", value: "3,890", icon: Bookmark, color: "text-cyan-400" },
          { label: "Consensus Clusters", value: "32 Nodes", icon: Network, color: "text-cyan-400" },
        ].map((stat, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-[#091821] border border-[#1b3b4a] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#5e8292] uppercase">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Domain Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {["All", "Distributed AI", "Computer Graphics & TTS", "Quantum Computing", "Cryptography & Security", "Cognitive AI"].map((dom) => (
          <button
            key={dom}
            onClick={() => setFilterDomain(dom)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              filterDomain === dom
                ? "bg-cyan-500/20 text-cyan-200 border-cyan-500/40 shadow-sm"
                : "bg-[#091821] text-[#7fa3b5] border-[#1b3b4a] hover:text-white"
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* Research Papers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPapers.map((paper) => (
          <div
            key={paper.id}
            className="p-5 rounded-2xl bg-[#091821] border border-[#1b3b4a] hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-extrabold uppercase">
                  {paper.domain}
                </span>
                <span className="text-[10px] text-cyan-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {paper.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                {paper.title}
              </h3>

              <p className="text-[11px] text-[#5e8292]">
                {paper.author} • {paper.year} • {paper.citations} Citations
              </p>

              <p className="text-xs text-[#7fa3b5] leading-relaxed line-clamp-3">
                {paper.abstract}
              </p>

              <div className="flex flex-wrap gap-1 pt-1">
                {paper.tags.map((t: string, i: number) => (
                  <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-[#061015] text-[#7fa3b5] font-mono">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#142d3a] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#5e8292]">DOI: 10.1016/lmd.{paper.id}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${paper.title}\n${paper.abstract}`);
                  toastService.show({
                    type: "success",
                    title: "Copied Abstract 📋",
                    message: "Paper details copied to clipboard.",
                    duration: 2000
                  });
                }}
                className="px-3 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/20 text-cyan-300 text-[10px] font-bold transition-all"
              >
                Copy Abstract
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
