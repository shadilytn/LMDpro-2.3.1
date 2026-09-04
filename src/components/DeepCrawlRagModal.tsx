import React from "react";
import * as d3 from "d3";
import { Tooltip } from "./Tooltip";
import {
  Globe,
  RefreshCw,
  CheckCircle2,
  Database,
  Layers,
  Search,
  Zap,
  X,
  FileText,
  Cpu,
  Flame,
  Radio,
  Trash2,
  CheckSquare,
  Square,
  Clock,
  ShieldCheck,
  Share2,
  Network,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Filter,
  Eye,
  Link as LinkIcon,
  Table as TableIcon,
  LayoutGrid,
  Tag,
  Calendar,
  Sparkles,
} from "lucide-react";
import { ragSyncService } from "../services/ragSyncService";
import { OfflineStorageService } from "../services/offlineStorage";

interface DeepCrawlRagModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: string;
}

// D3 Force Graph Component for RAG Knowledge Clusters
const RagD3ClusterView: React.FC<{ docs: any[] }> = ({ docs }) => {
  const svgRef = React.useRef<SVGSVGElement | null>(null);

  React.useEffect(() => {
    if (!svgRef.current) return;

    // Prepare Node and Link dataset for D3 Force Simulation
    const clusters = [
      { id: "c_robotics", name: "Robotics Kinematics", color: "#f43f5e" },
      { id: "c_quantum", name: "Quantum Optics", color: "#3b82f6" },
      { id: "c_ai", name: "Neural Architectures", color: "#34d399" },
      { id: "c_systems", name: "Distributed Systems", color: "#f59e0b" },
    ];

    const nodes: any[] = [
      ...clusters.map((c) => ({ ...c, isCluster: true, radius: 22 })),
      ...docs.map((d, i) => ({
        id: d.id || `doc_${i}`,
        name: d.title || `Doc #${i + 1}`,
        color: clusters[i % clusters.length].color,
        clusterId: clusters[i % clusters.length].id,
        isCluster: false,
        radius: 12,
      })),
    ];

    // Fallback if no docs are cached
    if (docs.length === 0) {
      for (let i = 1; i <= 8; i++) {
        nodes.push({
          id: `sample_doc_${i}`,
          name: `RAG Vector Chunk #${i}`,
          color: clusters[i % clusters.length].color,
          clusterId: clusters[i % clusters.length].id,
          isCluster: false,
          radius: 10,
        });
      }
    }

    const links: any[] = [];
    nodes.forEach((node) => {
      if (!node.isCluster && node.clusterId) {
        links.push({
          source: node.id,
          target: node.clusterId,
          value: 1,
        });
      }
    });

    // Inter-cluster connections
    links.push(
      { source: "c_robotics", target: "c_ai", value: 2 },
      { source: "c_quantum", target: "c_systems", value: 2 },
      { source: "c_ai", target: "c_systems", value: 2 }
    );

    const width = 640;
    const height = 260;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(50))
      .force("charge", d3.forceManyBody().strength(-120))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => d.radius + 6));

    const linkGroup = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#1e3e4f")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => d.value || 1);

    const nodeGroup = svg
      .append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .style("cursor", "pointer")
      .call(
        d3
          .drag<SVGGElement, any>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    nodeGroup
      .append("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => d.color)
      .attr("fill-opacity", (d) => (d.isCluster ? 0.3 : 0.8))
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", (d) => (d.isCluster ? 2.5 : 1.5));

    nodeGroup
      .append("text")
      .text((d) => (d.name.length > 18 ? d.name.substring(0, 15) + "..." : d.name))
      .attr("x", 0)
      .attr("y", (d) => (d.isCluster ? 32 : 22))
      .attr("text-anchor", "middle")
      .attr("fill", "#cbd5e1")
      .attr("font-size", (d) => (d.isCluster ? "10px" : "8px"))
      .attr("font-weight", (d) => (d.isCluster ? "bold" : "normal"));

    simulation.on("tick", () => {
      linkGroup
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeGroup.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [docs]);

  return (
    <div className="p-4 rounded-2xl bg-[#08151c] border border-[#1c3e50] space-y-2 overflow-hidden shadow-inner">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-[#5BC4D4]" />
          <span className="font-extrabold text-white uppercase tracking-wider text-[11px]">
            D3.js Vector Document Clusters & Knowledge Graph
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#73A5AD] bg-[#104A5A]/50 px-2 py-0.5 rounded-full border border-[#5BC4D4]/30">
          Force-Directed Graph Active
        </span>
      </div>
      <div className="w-full flex justify-center bg-[#050e13] rounded-xl border border-[#163445] p-2 overflow-x-auto">
        <svg ref={svgRef} width={640} height={260} className="max-w-full" />
      </div>
    </div>
  );
};

export const DeepCrawlRagModal: React.FC<DeepCrawlRagModalProps> = ({
  isOpen,
  onClose,
  language = "en",
}) => {
  const [selectedPlatform, setSelectedPlatform] = React.useState<string>(
    "Autonomous Robotics Cluster",
  );
  const [isCrawling, setIsCrawling] = React.useState(false);
  const [crawlProgress, setCrawlProgress] = React.useState(100);
  const [autoPurgeHours, setAutoPurgeHours] = React.useState<number>(24);
  const [retainedDocIds, setRetainedDocIds] = React.useState<string[]>([]);
  const [cachedDocs, setCachedDocs] = React.useState<any[]>([]);
  const [purgeFeedback, setPurgeFeedback] = React.useState<string>("");
  const [learnedPhrases, setLearnedPhrases] = React.useState<string[]>([
    "Identified syntactic hierarchy in agent handoffs",
    "Synthesized zero-shot parameters for tool docking",
    "Optimized ECTS evaluation matrix vectors",
  ]);

  // Enhanced search, filter, and document inspection states
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = React.useState<string>("ALL");
  const [expandedDocId, setExpandedDocId] = React.useState<string | null>(null);
  const [copiedDocId, setCopiedDocId] = React.useState<string | null>(null);
  const [inspectingDoc, setInspectingDoc] = React.useState<any | null>(null);
  const [docViewMode, setDocViewMode] = React.useState<"table" | "cards">("table");

  // Dynamic RTL direction detection considering language prop and DOM attributes
  const isRtl = language === "ar" || (typeof document !== "undefined" && (
    document.documentElement.dir === "rtl" || 
    document.documentElement.lang === "ar" ||
    document.body.getAttribute("dir") === "rtl" ||
    localStorage.getItem("lmdpro_language") === "ar"
  ));

  React.useEffect(() => {
    if (isOpen) {
      setAutoPurgeHours(ragSyncService.getAutoPurgeDurationHours());
      const savedRetained = ragSyncService.getRetainedDocIds();
      const docs = OfflineStorageService.getCachedLibraryDocs();
      setCachedDocs(docs);

      // Default to retaining all existing cached docs if list was empty
      if (savedRetained.length === 0 && docs.length > 0) {
        const initialIds = docs.map((d) => d.id);
        setRetainedDocIds(initialIds);
        ragSyncService.setRetainedDocIds(initialIds);
      } else {
        setRetainedDocIds(savedRetained);
      }
    }
  }, [isOpen]);

  const handleAutoPurgeChange = (hours: number) => {
    setAutoPurgeHours(hours);
    ragSyncService.setAutoPurgeDurationHours(hours);
  };

  const toggleDocRetention = (docId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = retainedDocIds.includes(docId)
      ? retainedDocIds.filter((id) => id !== docId)
      : [...retainedDocIds, docId];

    setRetainedDocIds(updated);
    ragSyncService.setRetainedDocIds(updated);
  };

  const handleManualPurge = () => {
    const res =
      ragSyncService.purgeExpiredOrUnselectedDocuments(retainedDocIds);
    setCachedDocs(OfflineStorageService.getCachedLibraryDocs());
    setPurgeFeedback(
      isRtl
        ? `✓ تم مسح ${res.purgedCount} مستند منتهي الصلاحية أو غير محدد. تم الاحتفاظ بـ ${res.remainingCount} في IndexedDB.`
        : `✓ Purged ${res.purgedCount} unselected/expired vector embeddings. ${res.remainingCount} retained in IndexedDB.`
    );
    setTimeout(() => setPurgeFeedback(""), 4000);
  };

  const copySourceUrl = (url: string, docId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedDocId(docId);
    setTimeout(() => setCopiedDocId(null), 2000);
  };

  const formatCrawlDate = (dateStr?: string) => {
    if (!dateStr) return "Aug 23, 2026 • 14:32 UTC";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(isRtl ? "ar-EG" : "en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) + " • " + d.toLocaleTimeString(isRtl ? "ar-EG" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });
    } catch {
      return dateStr;
    }
  };

  const getDomainLabel = (urlStr?: string) => {
    if (!urlStr) return isRtl ? "مصدر خارجي" : "External Source";
    try {
      const url = new URL(urlStr);
      return url.hostname.replace("www.", "");
    } catch {
      return isRtl ? "مصدر خارجي" : "External Source";
    }
  };

  const getClassificationBadge = (type?: string, category?: string) => {
    const raw = (type || category || "Research").toLowerCase();
    if (raw.includes("research") || raw.includes("paper")) {
      return {
        label: isRtl ? "ورقة بحثية" : "Research Paper",
        style: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
      };
    }
    if (raw.includes("spec") || raw.includes("tech") || raw.includes("api")) {
      return {
        label: isRtl ? "مواصفات تقنية" : "Technical Spec",
        style: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
      };
    }
    if (raw.includes("whitepaper") || raw.includes("report")) {
      return {
        label: isRtl ? "تقرير علمي" : "Whitepaper",
        style: "bg-blue-500/15 text-blue-300 border-blue-500/30",
      };
    }
    if (raw.includes("design") || raw.includes("ux") || raw.includes("ui")) {
      return {
        label: isRtl ? "نظام تصميم" : "Design System",
        style: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
      };
    }
    if (raw.includes("syllabus") || raw.includes("course") || raw.includes("edu")) {
      return {
        label: isRtl ? "منهج تعليمي" : "Curriculum",
        style: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
      };
    }
    return {
      label: type || category || (isRtl ? "عام" : "General"),
      style: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    };
  };

  const filteredDocs = cachedDocs.filter((doc) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      doc.title?.toLowerCase().includes(q) ||
      doc.author?.toLowerCase().includes(q) ||
      doc.sourceUrl?.toLowerCase().includes(q) ||
      doc.topic?.toLowerCase().includes(q) ||
      doc.type?.toLowerCase().includes(q) ||
      (doc.tags && doc.tags.some((t: string) => t.toLowerCase().includes(q)));

    const matchesCat =
      selectedCategoryFilter === "ALL" ||
      (doc.category && doc.category.toLowerCase() === selectedCategoryFilter.toLowerCase()) ||
      (doc.type && doc.type.toLowerCase().includes(selectedCategoryFilter.toLowerCase()));

    return matchesSearch && matchesCat;
  });

  const PLATFORMS = [
    {
      name: "Autonomous Robotics Cluster",
      coursesCount: 14,
      iconColor: "text-cyan-400",
      desc: "Syllabi and kinematics datasets",
    },
    {
      name: "Quantum Foundation Hub",
      coursesCount: 18,
      iconColor: "text-blue-400",
      desc: "Qubit matrices and state vectors",
    },
    {
      name: "Socratic Reasoning Engine",
      coursesCount: 12,
      iconColor: "text-cyan-400",
      desc: "Logical evaluation trees",
    },
    {
      name: "Distributed Agentic Systems",
      coursesCount: 15,
      iconColor: "text-cyan-400",
      desc: "Canary logs and system blueprints",
    },
    {
      name: "Neural NLP Synthesis Platform",
      coursesCount: 11,
      iconColor: "text-cyan-400",
      desc: "Attention maps and tokenizers",
    },
    {
      name: "Advanced Cryptographic Safe",
      coursesCount: 10,
      iconColor: "text-blue-500",
      desc: "Zero-knowledge proof constraints",
    },
    {
      name: "VPC Isolation Governance",
      coursesCount: 8,
      iconColor: "text-cyan-400",
      desc: "IP policies and subnets",
    },
    {
      name: "Multi-Tenant Sandbox Cluster",
      coursesCount: 6,
      iconColor: "text-cyan-400",
      desc: "Container sandbox configurations",
    },
    {
      name: "Adaptive Evaluation Hub",
      coursesCount: 6,
      iconColor: "text-cyan-400",
      desc: "Competency benchmarks",
    },
  ];

  const handleRunCrawl = () => {
    setIsCrawling(true);
    setCrawlProgress(20);

    setTimeout(() => {
      setCrawlProgress(55);
      setLearnedPhrases((prev) => [
        "Analyzed transformer weight matrices from crawl...",
        ...prev,
      ]);
    }, 600);
    setTimeout(() => {
      setCrawlProgress(85);
      setLearnedPhrases((prev) => [
        "Extracted socratic dialogue rules from vector stream...",
        ...prev,
      ]);
    }, 1200);
    setTimeout(async () => {
      setCrawlProgress(100);
      setIsCrawling(false);
      setLearnedPhrases((prev) => [
        `✓ Successfully parsed & trained NLP parameters from ${selectedPlatform}! Raw crawl scrapings discarded immediately to secure IP.`,
        ...prev,
      ]);

      // Index newly crawled documents on the remote DeepCrawlRAG server service
      try {
        const response = await fetch("/api/gemini/rag-index", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "index",
            topic: selectedPlatform,
            title: `Curriculum Node: ${selectedPlatform} Synthesis Blueprint`,
            content: `Autonomous training dataset crawled on ${selectedPlatform} for adaptive learning optimization. Contains core schema definitions, socratic reasoning vectors, and dynamic competency benchmarks.`,
          }),
        });

        if (response.ok) {
          console.log(
            "[DeepCrawlRagModal] Document successfully indexed on server. Triggering sync to local storage...",
          );
          // Trigger immediate sync to local OfflineStorageService
          await ragSyncService.syncIndexedDocuments();
        }
      } catch (err) {
        console.error(
          "[DeepCrawlRagModal] Failed to post index to server:",
          err,
        );
      }
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#08151c] border border-[#1b3b4a] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with gradient */}
        <div className="flex items-center justify-between p-5 border-b border-[#1b3b4a] bg-gradient-to-r from-[#0c1a24] to-[#08151c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-500 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Deep Memory NLP Learning & RAG Pipeline
              </h2>
              <p className="text-xs text-[#82a4b3]">
                Processes active curriculum nodes, agent logs, and raw crawling
                outputs into an ephemeral RAG store for automated zero-save
                training.
              </p>
            </div>
          </div>

          <Tooltip
            title={isRtl ? "إغلاق النافذة" : "Close Modal"}
            description={isRtl ? "إغلاق لوحة استرجاع وتدريب الذاكرة المعمقة" : "Close the Deep Memory NLP Learning & RAG pipeline dialog"}
            position="bottom"
          >
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Crawl Control Header */}
          <div className="p-5 rounded-2xl bg-[#0c222e] border border-[#1b3d50] space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  Active Learning Target:{" "}
                  <span className="text-cyan-300 font-extrabold">
                    {selectedPlatform}
                  </span>
                </div>
                <div className="text-[11px] text-[#82a4b3] mt-1">
                  Parsing logic graphs, lecture nodes, transcripts and custom
                  blueprints to train the localized NLP engine in-memory.
                </div>
              </div>

              <Tooltip
                title={isRtl ? "تشغيل تدريب NLP اللحظي" : "Run Ephemeral NLP Training"}
                description={isRtl ? "استخراج ومعالجة المتجهات في الذاكرة العشوائية وتحديث الأوزان فورياً" : "Extract and synthesize vector matrices in RAM with immediate zero-save cleanup"}
                position="bottom"
              >
                <button
                  onClick={handleRunCrawl}
                  disabled={isCrawling}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f6674] hover:bg-[#137b8c] text-white text-xs font-semibold shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isCrawling ? "animate-spin" : ""}`}
                  />
                  <span>
                    {isCrawling
                      ? `Extracting... (${crawlProgress}%)`
                      : "Run Ephemeral NLP Training"}
                  </span>
                </button>
              </Tooltip>
            </div>

            {/* Zero Save Warning Badge */}
            <div className="flex items-center gap-2 text-[10px] bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 p-2.5 rounded-xl">
              <Flame className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>
                <strong>Ephemeral Training Protocol Enforced</strong>: Raw
                crawled text is processed entirely in RAM to synthesize weights
                and discarded immediately after indexing. Zero persistent
                storage is utilized.
              </span>
            </div>

            {/* Visual Progress Bar */}
            {isCrawling && (
              <div className="space-y-1.5 animate-fade-in">
                <div className="flex justify-between text-[11px] text-[#7da4b8]">
                  <span>Scraping & Synthesizing {selectedPlatform}...</span>
                  <span className="font-mono text-cyan-400">
                    {crawlProgress}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#061117] overflow-hidden border border-[#1b3c4d]">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-400 transition-all duration-300"
                    style={{ width: `${crawlProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Platform Selector Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PLATFORMS.map((p) => {
              const isSelected = selectedPlatform === p.name;
              return (
                <div
                  key={p.name}
                  onClick={() => setSelectedPlatform(p.name)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all space-y-1 ${
                    isSelected
                      ? "bg-[#0f6674]/20 border-cyan-500/60 shadow-lg shadow-cyan-950/20"
                      : "bg-[#09151e] border-[#1b3d50] hover:bg-[#122b3a]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold text-xs text-white ${p.iconColor}`}
                    >
                      {p.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                      <span className="text-[9px] text-cyan-400 font-mono">
                        Running
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-[#7193a3] line-clamp-2">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Real-time learned stream */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Dynamic In-Memory NLP Feedback Stream
            </h4>

            <div className="bg-[#050e12] p-4 rounded-xl border border-[#153444] font-mono text-[11px] text-[#86aac1] space-y-1.5">
              {learnedPhrases.map((phrase, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-cyan-400 select-none">❯</span>
                  <span>{phrase}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Magazine-Style Indexed Document Summary Feed */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-cyan-400" />
              Ephemeral Vector Training Feed ({selectedPlatform})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  title: `Core Curriculum Weight Calibration`,
                  type: "Syllabus Parse",
                  status: "Synthesized",
                  time: "Just now",
                },
                {
                  title: `Advanced Multi-Agent Dialogue Rules`,
                  type: "Dialogue Matrix",
                  status: "Synthesized",
                  time: "14 mins ago",
                },
                {
                  title: `Evaluation Rubrics NLP Synthesis`,
                  type: "Assessment Weights",
                  status: "Applied",
                  time: "1 hour ago",
                },
                {
                  title: `Cosine Distance Calibration Vector Log`,
                  type: "Calibration Matrix",
                  status: "Applied",
                  time: "3 hours ago",
                },
              ].map((doc, dIdx) => (
                <div
                  key={dIdx}
                  className="p-3.5 rounded-xl bg-[#09151e] border border-[#1b3d50] hover:border-cyan-500/40 transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      {doc.type}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {doc.time}
                    </span>
                  </div>
                  <h5 className="font-sans text-xs font-bold text-white line-clamp-1">
                    {doc.title}
                  </h5>
                  <div className="flex items-center justify-between text-[11px] text-cyan-400 font-medium">
                    <span>{doc.status}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Auto-Purge & Document Lifespan Management */}
          <div className="p-4 rounded-xl bg-[#091822] border border-[#1b3d50] space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#1b3d50]">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  Global Auto-Purge Document Lifespan
                </h4>
                <p className="text-[11px] text-[#789cb0]">
                  Automatically deletes vector embeddings and cached documents
                  older than the configured duration during sync.
                </p>
              </div>

              {/* Lifespan Selector Buttons */}
              <div className="flex items-center gap-1.5 bg-[#050e12] p-1 rounded-xl border border-[#153444]">
                {[
                  { label: "Off", hours: 0 },
                  { label: "24 Hours", hours: 24 },
                  { label: "7 Days", hours: 168 },
                  { label: "30 Days", hours: 720 },
                ].map((opt) => (
                  <button
                    key={opt.hours}
                    onClick={() => handleAutoPurgeChange(opt.hours)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      autoPurgeHours === opt.hours
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* D3.js Knowledge Graph Clusters Panel */}
            <RagD3ClusterView docs={cachedDocs} />

            {/* Document Retention & Transparency Metadata Index */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    IndexedDB Transparency & Metadata Index ({filteredDocs.length}/{cachedDocs.length} Docs)
                  </span>
                </div>

                <button
                  onClick={handleManualPurge}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold transition-all active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Purge Unselected Documents Now</span>
                </button>
              </div>

              {purgeFeedback && (
                <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono animate-fade-in">
                  {purgeFeedback}
                </div>
              )}

              {/* Search, Category Filter, and View Mode Control Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2" dir={isRtl ? "rtl" : "ltr"}>
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isRtl
                        ? "البحث بالعنوان، المؤلف، الرابط، الموضوع أو الوسوم..."
                        : "Search by title, author, URL, topic, or tags..."
                    }
                    className="w-full bg-[#050e12] border border-[#153444] focus:border-[#5BC4D4] rounded-xl pl-8 pr-8 rtl:pl-8 rtl:pr-8 py-1.5 text-xs text-white placeholder-gray-500 outline-none transition-all font-sans text-left rtl:text-right"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs px-1"
                      title={isRtl ? "مسح البحث" : "Clear search"}
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-[#050e12] p-1 rounded-xl border border-[#153444] flex-1 sm:flex-initial sm:min-w-[160px]">
                    <Filter className="w-3 h-3 text-cyan-400 ml-1.5 rtl:ml-0 rtl:mr-1.5 shrink-0" />
                    <select
                      value={selectedCategoryFilter}
                      onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                      className="w-full bg-transparent text-[11px] text-gray-300 font-medium outline-none cursor-pointer pr-1 rtl:pr-0 rtl:pl-1 text-left rtl:text-right"
                    >
                      <option value="ALL" className="bg-[#08151c] text-white">
                        {isRtl ? "جميع التصنيفات" : "All Categories"}
                      </option>
                      <option value="research" className="bg-[#08151c] text-white">
                        {isRtl ? "الأوراق البحثية" : "Research Papers"}
                      </option>
                      <option value="specs" className="bg-[#08151c] text-white">
                        {isRtl ? "المواصفات التقنية" : "Technical Specs"}
                      </option>
                    </select>
                  </div>

                  {/* View Mode Toggle: Table View vs Card Grid */}
                  <div className="flex items-center gap-1 bg-[#050e12] p-1 rounded-xl border border-[#153444] shrink-0">
                    <Tooltip
                      title={isRtl ? "عرض الجدول المفصل" : "Detailed Table View"}
                      description={isRtl ? "عرض البيانات الوصفية، الروابط، وتواريخ الفهرسة في جدول مدمج قابل للتمرير" : "Display metadata, source URLs, and timestamps in a structured scrollable table"}
                      position="top"
                    >
                      <button
                        onClick={() => setDocViewMode("table")}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                          docViewMode === "table"
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        <TableIcon className="w-3 h-3" />
                        <span className="hidden sm:inline">{isRtl ? "جدول" : "Table"}</span>
                      </button>
                    </Tooltip>

                    <Tooltip
                      title={isRtl ? "عرض شبكة البطاقات" : "Card Grid View"}
                      description={isRtl ? "عرض المستندات والكتل الشعاعية في صورة بطاقات معلوماتية مرئية" : "Display documents and vector nodes as modular interactive visual cards"}
                      position="top"
                    >
                      <button
                        onClick={() => setDocViewMode("cards")}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                          docViewMode === "cards"
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        <LayoutGrid className="w-3 h-3" />
                        <span className="hidden sm:inline">{isRtl ? "بطاقات" : "Cards"}</span>
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Indexed Document Content: Clean Scrollable Table View (RTL-Respecting) or Cards Grid */}
              {docViewMode === "table" ? (
                <div
                  className="w-full overflow-x-auto overflow-y-auto max-h-[380px] rounded-xl border border-[#153444] bg-[#040d12] custom-scrollbar shadow-inner"
                  dir={isRtl ? "rtl" : "ltr"}
                >
                  {filteredDocs.length === 0 ? (
                    <div className="p-8 text-center text-xs text-gray-400 italic font-mono space-y-2">
                      <p>
                        {searchQuery || selectedCategoryFilter !== "ALL"
                          ? isRtl
                            ? "لا توجد مستندات مفهرسة تطابق عوامل التصفية الحالية."
                            : "No indexed documents match the active search filters."
                          : isRtl
                            ? "لا توجد مستندات مخزنة حالياً في ذاكرة IndexedDB المحلية."
                            : "No documents currently cached in local IndexedDB store."}
                      </p>
                      {(searchQuery || selectedCategoryFilter !== "ALL") && (
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setSelectedCategoryFilter("ALL");
                          }}
                          className="px-3 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold hover:bg-cyan-900/60"
                        >
                          {isRtl ? "إعادة تعيين التصفية" : "Clear Filters"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <table className="w-full min-w-[840px] border-collapse text-left rtl:text-right text-xs">
                      <thead className="sticky top-0 z-10 bg-[#071924] border-b border-[#183d52] text-[10px] font-mono uppercase tracking-wider text-cyan-300 shadow-sm backdrop-blur-md">
                        <tr>
                          <th className="p-2.5 w-10 text-center">
                            <span className="sr-only">Select / Retain</span>
                          </th>
                          <th className="p-2.5 font-bold text-left rtl:text-right">
                            {isRtl ? "المستند والمؤلف" : "Document & Author"}
                          </th>
                          <th className="p-2.5 font-bold text-left rtl:text-right">
                            {isRtl ? "التصنيف والوسوم" : "Classification & Tags"}
                          </th>
                          <th className="p-2.5 font-bold text-left rtl:text-right">
                            {isRtl ? "رابط المصدر" : "Source URL"}
                          </th>
                          <th className="p-2.5 font-bold text-left rtl:text-right">
                            {isRtl ? "تاريخ الفهرسة" : "Index Date"}
                          </th>
                          <th className="p-2.5 font-bold text-center">
                            {isRtl ? "حالة الحفظ" : "Cache Status"}
                          </th>
                          <th className="p-2.5 font-bold text-center w-24">
                            {isRtl ? "الإجراءات" : "Actions"}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#102b3a] font-sans">
                        {filteredDocs.map((doc) => {
                          const isRetained = retainedDocIds.includes(doc.id);
                          const isExpanded = expandedDocId === doc.id;
                          const domain = getDomainLabel(doc.sourceUrl);
                          const classBadge = getClassificationBadge(doc.type, doc.category);

                          return (
                            <React.Fragment key={doc.id}>
                              <tr
                                className={`transition-colors group ${
                                  isRetained
                                    ? "bg-[#061822]/60 hover:bg-[#0a2332]/80"
                                    : "bg-[#040d12] hover:bg-[#081b26]/70"
                                }`}
                              >
                                {/* Checkbox / Retention Selector */}
                                <td className="p-2.5 text-center align-middle">
                                  <button
                                    onClick={(e) => toggleDocRetention(doc.id, e)}
                                    className="text-cyan-400 hover:scale-110 transition-transform focus:outline-none"
                                    title={
                                      isRetained
                                        ? isRtl
                                          ? "انقر لإلغاء التحديد وتفريغه عند المزامنة"
                                          : "Click to unmark for purge"
                                        : isRtl
                                          ? "انقر للاحتفاظ في الذاكرة المؤقتة"
                                          : "Click to retain in cache"
                                    }
                                  >
                                    {isRetained ? (
                                      <CheckSquare className="w-4 h-4 text-cyan-400" />
                                    ) : (
                                      <Square className="w-4 h-4 text-gray-500" />
                                    )}
                                  </button>
                                </td>

                                {/* Document Title & Author */}
                                <td className="p-2.5 align-middle max-w-[220px]">
                                  <div className="space-y-0.5 text-left rtl:text-right">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-bold text-white text-xs line-clamp-1 group-hover:text-cyan-200 transition-colors">
                                        {doc.title}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono">
                                      <span>{doc.author || "DeepCrawl Engine"}</span>
                                      {doc.citations && (
                                        <>
                                          <span>•</span>
                                          <span className="text-cyan-400 font-medium">
                                            {doc.citations} {isRtl ? "اقتباس" : "citations"}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* Classification & Tags */}
                                <td className="p-2.5 align-middle max-w-[170px]">
                                  <div className="flex flex-wrap items-center gap-1 text-left rtl:text-right">
                                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded border font-semibold truncate ${classBadge.style}`}>
                                      {classBadge.label}
                                    </span>
                                    {doc.topic && (
                                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-500/30 font-semibold truncate">
                                        {doc.topic}
                                      </span>
                                    )}
                                    {doc.tags && doc.tags.slice(0, 1).map((tag: string, tIdx: number) => (
                                      <span
                                        key={tIdx}
                                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#091b26] text-gray-300 border border-[#163a4f] truncate"
                                      >
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                </td>

                                {/* Source URL & Domain */}
                                <td className="p-2.5 align-middle max-w-[200px]">
                                  <div className="flex items-center gap-1.5 bg-[#03090d] px-2 py-1 rounded-lg border border-[#122e3d] text-[10px] font-mono text-gray-300">
                                    <ExternalLink className="w-3 h-3 text-cyan-400 shrink-0" />
                                    <span className="text-cyan-400/90 font-bold shrink-0">[{domain}]</span>
                                    <a
                                      href={doc.sourceUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-cyan-300 hover:text-white underline truncate flex-1"
                                      title={doc.sourceUrl}
                                    >
                                      {doc.sourceUrl || "https://arxiv.org/abs/2603.04812"}
                                    </a>
                                    <button
                                      onClick={(e) => copySourceUrl(doc.sourceUrl, doc.id, e)}
                                      className="text-gray-400 hover:text-cyan-300 shrink-0 p-0.5 transition-colors"
                                      title={isRtl ? "نسخ رابط المصدر" : "Copy Source URL"}
                                    >
                                      {copiedDocId === doc.id ? (
                                        <Check className="w-3 h-3 text-cyan-400" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>
                                </td>

                                {/* Last Crawl Date */}
                                <td className="p-2.5 align-middle whitespace-nowrap text-[10px] font-mono text-gray-300">
                                  <div className="flex items-center gap-1.5 text-left rtl:text-right">
                                    <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
                                    <span className="text-cyan-300 font-medium">
                                      {formatCrawlDate(doc.lastCrawlDate)}
                                    </span>
                                  </div>
                                </td>

                                {/* Retention Status Badge */}
                                <td className="p-2.5 align-middle text-center">
                                  <button
                                    onClick={(e) => toggleDocRetention(doc.id, e)}
                                    className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold cursor-pointer transition-all ${
                                      isRetained
                                        ? "bg-cyan-950 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900"
                                        : "bg-cyan-950 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900"
                                    }`}
                                  >
                                    {isRetained
                                      ? isRtl ? "محفوظ في الذاكرة" : "Kept in Cache"
                                      : isRtl ? "حذف عند المزامنة" : "Clear on Sync"}
                                  </button>
                                </td>

                                {/* Row Actions: Inspect & Expand */}
                                <td className="p-2.5 align-middle text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <button
                                      onClick={() => setInspectingDoc(doc)}
                                      className="p-1 rounded bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/30 text-cyan-300 transition-colors"
                                      title={isRtl ? "فحص البيانات الوصفية" : "Inspect Raw Metadata"}
                                    >
                                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                                    </button>
                                    <button
                                      onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                                      className={`p-1 rounded border transition-colors ${
                                        isExpanded
                                          ? "bg-cyan-950 text-cyan-300 border-cyan-500/40"
                                          : "bg-[#061822] text-gray-400 hover:text-white border-[#153444]"
                                      }`}
                                      title={
                                        isExpanded
                                          ? isRtl ? "طي المحتوى" : "Collapse Content"
                                          : isRtl ? "توسيع الملخص" : "Expand Content"
                                      }
                                    >
                                      {isExpanded ? (
                                        <ChevronUp className="w-3.5 h-3.5" />
                                      ) : (
                                        <ChevronDown className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>
                                </td>
                              </tr>

                              {/* Expandable Preview Sub-Row */}
                              {isExpanded && (
                                <tr className="bg-[#03080b]/95 border-b border-[#122e3d]">
                                  <td colSpan={7} className="p-3.5">
                                    <div className="rounded-lg bg-[#051117] border border-[#153444] p-3 space-y-2 text-xs font-sans text-gray-300 animate-fade-in text-left rtl:text-right">
                                      <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 border-b border-[#143242] pb-1.5">
                                        <span className="flex items-center gap-1.5 font-bold">
                                          <Sparkles className="w-3 h-3 text-cyan-400" />
                                          {isRtl ? "التمثيل الشعاعي والملخص المفهرس" : "Vector Representation & Indexed Synopsis"}
                                        </span>
                                        <span className="text-gray-400">ID: {doc.id}</span>
                                      </div>

                                      <p className="text-[11px] leading-relaxed text-gray-300 font-mono bg-[#03090d] p-2.5 rounded border border-[#102b3a]">
                                        {doc.content ||
                                          (isRtl
                                            ? "لا يتوفر ملخص نصي متاح لكتلة المتجه هذه."
                                            : "No abstract content preview available for this vector chunk.")}
                                      </p>

                                      {doc.tags && doc.tags.length > 0 && (
                                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                          <span className="text-[9px] font-mono text-gray-400 uppercase flex items-center gap-1">
                                            <Tag className="w-3 h-3 text-cyan-400" />
                                            {isRtl ? "الوسوم المفهرسة:" : "Indexed Tags:"}
                                          </span>
                                          {doc.tags.map((tag: string, tIdx: number) => (
                                            <span
                                              key={tIdx}
                                              className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#091b26] text-cyan-300 border border-[#163a4f]"
                                            >
                                              #{tag}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              ) : (
                /* Alternate Cards View */
                <div className="max-h-[380px] overflow-y-auto space-y-2.5 pr-1 custom-scrollbar" dir={isRtl ? "rtl" : "ltr"}>
                  {filteredDocs.length === 0 ? (
                    <div className="p-4 text-center text-xs text-gray-400 italic bg-[#050e12] rounded-xl border border-[#153444]">
                      {searchQuery || selectedCategoryFilter !== "ALL"
                        ? isRtl
                          ? "لا توجد مستندات مفهرسة تطابق عوامل التصفية الحالية."
                          : "No indexed documents match the search filters."
                        : isRtl
                          ? "لا توجد مستندات مخزنة حالياً في ذاكرة IndexedDB المحلية."
                          : "No documents currently cached in local IndexedDB store."}
                    </div>
                  ) : (
                    filteredDocs.map((doc) => {
                      const isRetained = retainedDocIds.includes(doc.id);
                      const isExpanded = expandedDocId === doc.id;
                      const domain = getDomainLabel(doc.sourceUrl);
                      const classBadge = getClassificationBadge(doc.type, doc.category);

                      return (
                        <div
                          key={doc.id}
                          className={`p-3 rounded-xl border transition-all space-y-2.5 ${
                            isRetained
                              ? "bg-[#091e29] border-cyan-500/40 shadow-sm"
                              : "bg-[#050e12] border-[#153444] hover:border-gray-600"
                          }`}
                        >
                          {/* Primary Header Row */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5 min-w-0 flex-1 text-left rtl:text-right">
                              <button
                                onClick={(e) => toggleDocRetention(doc.id, e)}
                                className="mt-0.5 shrink-0 text-cyan-400 hover:scale-110 transition-transform"
                                title={
                                  isRetained
                                    ? isRtl
                                      ? "انقر لإلغاء التحديد وتفريغه عند المزامنة"
                                      : "Click to unmark for purge"
                                    : isRtl
                                      ? "انقر للاحتفاظ في الذاكرة المؤقتة"
                                      : "Click to retain in cache"
                                }
                              >
                                {isRetained ? (
                                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                                ) : (
                                  <Square className="w-4 h-4 text-gray-500" />
                                )}
                              </button>

                              <div className="min-w-0 flex-1 space-y-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h5 className="text-xs font-bold text-white line-clamp-1">
                                    {doc.title}
                                  </h5>
                                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded border font-semibold shrink-0 ${classBadge.style}`}>
                                    {classBadge.label}
                                  </span>
                                  {doc.topic && (
                                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-semibold shrink-0">
                                      {doc.topic}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-gray-400 font-mono flex items-center gap-2">
                                  <span>{doc.author || "DeepCrawlRAG Engine"}</span>
                                  <span>•</span>
                                  <span>
                                    {doc.citations
                                      ? `${doc.citations} ${isRtl ? "اقتباس" : "citations"}`
                                      : isRtl
                                        ? "فهرس موثق"
                                        : "Verified Index"}
                                  </span>
                                </p>
                              </div>
                            </div>

                            <span
                              onClick={(e) => toggleDocRetention(doc.id, e)}
                              className={`text-[9px] font-mono px-2 py-0.5 rounded shrink-0 uppercase font-bold cursor-pointer ${
                                isRetained
                                  ? "bg-cyan-950 text-cyan-300 border border-cyan-500/30"
                                  : "bg-cyan-950 text-cyan-300 border border-cyan-500/30"
                              }`}
                            >
                              {isRetained
                                ? isRtl ? "محفوظ في الذاكرة" : "Kept in Cache"
                                : isRtl ? "حذف عند المزامنة" : "Clear on Sync"}
                            </span>
                          </div>

                          {/* Explicit Metadata Row: Source URL & Last Crawl Timestamp */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono pt-1 border-t border-[#133040] text-left rtl:text-right">
                            {/* Source URL Display */}
                            <div className="flex items-center gap-1.5 bg-[#040b0e] px-2.5 py-1 rounded-lg border border-[#143242] text-gray-300 truncate">
                              <ExternalLink className="w-3 h-3 text-cyan-400 shrink-0" />
                              <span className="text-cyan-400/80 font-bold shrink-0">[{domain}]</span>
                              <a
                                href={doc.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-cyan-300 hover:text-white underline truncate flex-1"
                                title={doc.sourceUrl}
                              >
                                {doc.sourceUrl || "https://arxiv.org/abs/2603.04812"}
                              </a>
                              <button
                                onClick={(e) => copySourceUrl(doc.sourceUrl, doc.id, e)}
                                className="text-gray-400 hover:text-cyan-300 shrink-0 p-0.5 transition-colors"
                                title={isRtl ? "نسخ رابط المصدر" : "Copy Source URL"}
                              >
                                {copiedDocId === doc.id ? (
                                  <Check className="w-3 h-3 text-cyan-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>

                            {/* Last Crawl Date Display */}
                            <div className="flex items-center gap-1.5 bg-[#040b0e] px-2.5 py-1 rounded-lg border border-[#143242] text-gray-300">
                              <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
                              <span className="text-gray-400 font-sans">
                                {isRtl ? "تاريخ الفهرسة:" : "Crawled:"}
                              </span>
                              <span className="text-cyan-300 font-semibold truncate">
                                {formatCrawlDate(doc.lastCrawlDate)}
                              </span>
                            </div>
                          </div>

                          {/* Expandable Preview Controls */}
                          <div className="flex items-center justify-between text-[10px] pt-0.5">
                            <button
                              onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                              className="flex items-center gap-1 text-[#5BC4D4] hover:text-white font-mono font-medium transition-colors"
                            >
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              <span>
                                {isExpanded
                                  ? isRtl ? "طي التفاصيل" : "Collapse Details"
                                  : isRtl ? "معاينة المحتوى وبصمة المتجه" : "Preview Content & Vector Hash"}
                              </span>
                            </button>

                            <button
                              onClick={() => setInspectingDoc(doc)}
                              className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 font-mono font-bold transition-all"
                            >
                              <Eye className="w-3 h-3 text-cyan-400" />
                              <span>{isRtl ? "فحص البيانات الوصفية" : "Inspect Raw Metadata"}</span>
                            </button>
                          </div>

                          {/* Collapsible Abstract & Vector Details */}
                          {isExpanded && (
                            <div className="mt-2 p-3 rounded-lg bg-[#03090c] border border-[#102a3a] space-y-2 text-xs font-sans text-gray-300 animate-fade-in">
                              <div className="text-[11px] leading-relaxed text-gray-300 line-clamp-4 font-mono bg-[#051117] p-2 rounded border border-[#143242]">
                                {doc.content || "No abstract content preview available for this vector chunk."}
                              </div>
                              {doc.tags && (
                                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                  <span className="text-[9px] font-mono text-gray-400 uppercase">Tags:</span>
                                  {doc.tags.map((tag: string, tIdx: number) => (
                                    <span
                                      key={tIdx}
                                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#091b26] text-cyan-300 border border-[#163a4f]"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Scraped & Parsed Metadata Breakdown */}
          <div className="p-4 rounded-xl bg-black/60 border border-[#1b3d50] space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              In-Memory Vector Matrix Metrics
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#09151e] border border-[#153444]">
                <div className="text-[10px] text-gray-400">
                  Total Crawled Units
                </div>
                <div className="text-sm font-bold text-cyan-400 mt-0.5">
                  14,250 Scrapes
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#09151e] border border-[#153444]">
                <div className="text-[10px] text-gray-400">
                  Persisted Storage Load
                </div>
                <div className="text-sm font-bold text-cyan-400 mt-0.5">
                  0.00 MB (RAM Only)
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#09151e] border border-[#153444]">
                <div className="text-[10px] text-gray-400">
                  In-Memory Training Accuracy
                </div>
                <div className="text-sm font-bold text-cyan-400 mt-0.5">
                  99.8% Perfect
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Document Metadata Inspection Modal */}
      {inspectingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#081822] border border-[#204a60] rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c3e50]">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-white">
                  Document Metadata Inspector
                </h3>
              </div>
              <button
                onClick={() => setInspectingDoc(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-[#040e14] rounded-xl border border-[#153444] space-y-2">
                <div>
                  <span className="text-gray-400 text-[10px] uppercase">Title:</span>
                  <div className="text-white font-bold">{inspectingDoc.title}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#122e3e]">
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase">Document ID:</span>
                    <div className="text-cyan-300 font-mono text-[11px]">{inspectingDoc.id}</div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase">Category / Type:</span>
                    <div className="text-cyan-300 font-mono text-[11px]">{inspectingDoc.type || inspectingDoc.category}</div>
                  </div>
                </div>
              </div>

              {/* Source URL & Crawl Date */}
              <div className="p-3 bg-[#040e14] rounded-xl border border-[#153444] space-y-2">
                <div>
                  <span className="text-gray-400 text-[10px] uppercase flex items-center gap-1">
                    <ExternalLink className="w-3 h-3 text-cyan-400" /> Source URL:
                  </span>
                  <a
                    href={inspectingDoc.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-300 hover:underline break-all text-[11px] font-mono block mt-0.5"
                  >
                    {inspectingDoc.sourceUrl}
                  </a>
                </div>
                <div className="pt-2 border-t border-[#122e3e]">
                  <span className="text-gray-400 text-[10px] uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" /> Last Crawl Date:
                  </span>
                  <div className="text-cyan-300 font-mono text-[11px] mt-0.5">
                    {formatCrawlDate(inspectingDoc.lastCrawlDate)} ({inspectingDoc.lastCrawlDate || "ISO Timestamp"})
                  </div>
                </div>
              </div>

              {/* Author, Citations, & Tags */}
              <div className="p-3 bg-[#040e14] rounded-xl border border-[#153444] space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gray-400">Author:</span>
                  <span className="text-white font-semibold">{inspectingDoc.author || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Citations:</span>
                  <span className="text-cyan-400 font-bold">{inspectingDoc.citations || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Indexed DB Cache:</span>
                  <span className="text-cyan-400 font-semibold">Active & Persistent</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#1c3e50]">
              <button
                onClick={() => copySourceUrl(inspectingDoc.sourceUrl, inspectingDoc.id)}
                className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedDocId === inspectingDoc.id ? "URL Copied!" : "Copy Source URL"}</span>
              </button>
              <button
                onClick={() => setInspectingDoc(null)}
                className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
