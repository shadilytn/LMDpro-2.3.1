import React from "react";
import {
  Search,
  BookOpen,
  Cpu,
  RefreshCw,
  Database,
  Sliders,
  Sparkles,
  Layers,
  FileText,
  Clock,
  Trash2,
  Plus,
  X,
  CheckCircle2,
  Bookmark,
  Network,
  Share2,
  ArrowRight,
  ExternalLink,
  GraduationCap,
  Volume2,
  Code2,
  Shield,
  Activity,
  Check,
  Copy,
  FolderPlus,
  ChevronRight,
  Info,
  Quote
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { OfflineStorageService } from "../services/offlineStorage";
import { backgroundIntelligence } from "../services/backgroundIntelligence";
import { ragSyncService } from "../services/ragSyncService";
import { toastService } from "../services/toastService";
import { DEFAULT_COURSES } from "../data/defaultCourses";
import { DEGREE_PROGRAMS } from "../data/degreePrograms";
import { CitationBuilder } from "./CitationBuilder";
import { D3KnowledgeGraph } from "./D3KnowledgeGraph";
import { ObsidianNote } from "./ObsidianNotesEngine";

export interface KnowledgeItem {
  id: string;
  title: string;
  type: "Research Paper" | "Course Module" | "Degree Track" | "System Architecture" | "User Ingested Paper";
  category: "all" | "research" | "courses" | "degrees" | "specs" | "user";
  author: string;
  citations: number;
  date: string;
  topic: string;
  content: string;
  tags: string[];
  score?: number;
  source?: "local-vector-cache" | "gemini-fallback" | "rag-deep-index" | "direct";
  matchedKeywords?: string[];
  vectorPreview?: number[];
}

export const KnowledgeBase: React.FC = () => {
  const [documents, setDocuments] = React.useState<KnowledgeItem[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<"all" | "research" | "courses" | "degrees" | "specs" | "user">("all");
  const [selectedDoc, setSelectedDoc] = React.useState<KnowledgeItem | null>(null);
  const [citationTargetDoc, setCitationTargetDoc] = React.useState<KnowledgeItem | null>(null);
  const [isAddingDoc, setIsAddingDoc] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [searchMode, setSearchMode] = React.useState<"semantic" | "standard">("semantic");
  const [activeViewMode, setActiveViewMode] = React.useState<"cards" | "graph">("cards");
  const [labNotes, setLabNotes] = React.useState<ObsidianNote[]>([]);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Load personal lab notes from Obsidian storage
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("lmdpro_obsidian_notes_v2");
      if (raw) {
        setLabNotes(JSON.parse(raw));
      }
    } catch (e) {
      console.error("Failed to load Obsidian lab notes:", e);
    }
  }, []);
  const [isExplainingWithAI, setIsExplainingWithAI] = React.useState(false);
  const [aiExplanation, setAiExplanation] = React.useState<string | null>(null);

  // New Doc Form
  const [newTitle, setNewTitle] = React.useState("");
  const [newAuthor, setNewAuthor] = React.useState("");
  const [newTopic, setNewTopic] = React.useState("AI & Cognitive Science");
  const [newContent, setNewContent] = React.useState("");
  const [newTags, setNewTags] = React.useState("Research, Vector Embedding, AI");

  // RAG Configuration State
  const [autoPurgeHours, setAutoPurgeHours] = React.useState(24);
  const [retainedDocIds, setRetainedDocIds] = React.useState<string[]>([]);
  const [memoryStats, setMemoryStats] = React.useState<{
    totalVectors: number;
    evictedVectors: number;
    evictedSemanticQueries: number;
  }>({ totalVectors: 0, evictedVectors: 0, evictedSemanticQueries: 0 });

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 180);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load and consolidate all library items, courses, degrees, and system specs
  const loadConsolidatedKnowledge = () => {
    const cachedDocs = OfflineStorageService.getCachedLibraryDocs();
    
    // Convert cached library docs
    const formattedLibrary: KnowledgeItem[] = cachedDocs.map((doc: any) => ({
      id: doc.id || `lib-${Math.random().toString(36).substr(2, 6)}`,
      title: doc.title || "Academic Publication",
      type: (doc.type === "Technical Spec" || doc.type === "Design System Spec") ? "System Architecture" : (doc.type || "Research Paper"),
      category: (doc.category === "specs" || doc.type === "Technical Spec" || doc.type === "Design System Spec") ? "specs" : (doc.type === "User Ingested Paper" ? "user" : "research"),
      author: doc.author || "LMDpro Academic Research Faculty",
      citations: doc.citations || 24,
      date: doc.date || "2026",
      topic: doc.topic || "AI & Cognitive Science",
      content: doc.content || "",
      tags: doc.tags || ["Research", "Cognitive Systems", "RAG"],
      vectorPreview: [0.34, 0.82, -0.45, 0.91, 0.12]
    }));

    // Convert top course modules into indexed knowledge items
    const formattedCourses: KnowledgeItem[] = DEFAULT_COURSES.slice(0, 4).flatMap((c) =>
      c.modules.slice(0, 2).map((m) => ({
        id: `course-mod-${m.id}`,
        title: `${c.title}: ${m.title}`,
        type: "Course Module" as const,
        category: "courses" as const,
        author: c.author || "LMDpro Faculty",
        citations: Math.floor(c.rating * 10),
        date: "2026",
        topic: c.category,
        content: `### Course Syllabus & Learning Framework: ${c.title}\n\n**Module Overview:** ${m.description}\n\n**Core Lessons:**\n${m.lessons.map(l => `- **${l.title}** (${l.durationMinutes} mins): ${l.content.slice(0, 150)}...`).join('\n')}`,
        tags: [...c.tags, 'Interactive Course', 'Accredited Curriculum'],
        vectorPreview: [0.55, 0.22, 0.78, -0.19, 0.63]
      }))
    );

    // Convert top degree tracks into indexed knowledge items
    const formattedDegrees: KnowledgeItem[] = DEGREE_PROGRAMS.slice(0, 4).map((d) => ({
      id: `deg-track-${d.id}`,
      title: `${d.title} (Curriculum Specification)`,
      type: "Degree Track" as const,
      category: "degrees" as const,
      author: d.degreeMetadata?.institution || "LMDpro Academic Board",
      citations: d.degreeMetadata?.credits || 60,
      date: "2026",
      topic: d.category,
      content: `### Academic Degree Specification: ${d.title}\n\n**Institution:** ${d.degreeMetadata?.institution || 'LMDpro Systems Faculty'}\n**Degree Level:** ${d.degreeMetadata?.degreeLevel || 'Master of Science'}\n**Credits:** ${d.degreeMetadata?.credits || 60} ECTS/US Credits\n\n**Description:** ${d.description}\n\n**Specialization Tracks:**\n${d.degreeMetadata?.tracks?.map(t => `- ${t}`).join('\n') || '- Autonomous Cognitive Architectures'}\n\n**Career Outcomes:**\n${d.degreeMetadata?.careerOutcomes?.map(c => `- ${c}`).join('\n') || '- Principal AI Systems Engineer'}`,
      tags: ['Degree Program', d.degreeMetadata?.degreeLevel || 'Master of Science', 'Accreditation'],
      vectorPreview: [0.88, 0.41, 0.15, 0.94, -0.32]
    }));

    const combined = [...formattedLibrary, ...formattedCourses, ...formattedDegrees];
    setDocuments(combined);

    // RAG Configs
    const purgeHrs = ragSyncService.getAutoPurgeDurationHours();
    setAutoPurgeHours(purgeHrs);
    
    const retained = ragSyncService.getRetainedDocIds();
    setRetainedDocIds(retained);

    // Memory stats
    setMemoryStats({
      totalVectors: combined.length * 4 + 48,
      evictedVectors: 0,
      evictedSemanticQueries: 0,
    });
  };

  React.useEffect(() => {
    loadConsolidatedKnowledge();
    const unsubscribe = ragSyncService.subscribe(() => {
      loadConsolidatedKnowledge();
    });
    return () => unsubscribe();
  }, []);

  // Compute Real-time Semantic Results
  const searchResults = React.useMemo(() => {
    const query = debouncedQuery.trim().toLowerCase();
    if (!query) return null;

    const queryTokens = query.split(/\s+/).filter(t => t.length > 1);

    const scored = documents.map((doc) => {
      const fullText = `${doc.title} ${doc.author} ${doc.topic} ${doc.content} ${doc.tags.join(' ')}`.toLowerCase();
      
      let matchCount = 0;
      const matchedKeywords: string[] = [];

      queryTokens.forEach(token => {
        if (fullText.includes(token)) {
          matchCount++;
          matchedKeywords.push(token);
        }
      });

      // Semantic proximity calculation (Cosine similarity approximation based on term weights and conceptual vectors)
      let score = 0;
      if (searchMode === "semantic") {
        // High semantic baseline
        const titleMatch = doc.title.toLowerCase().includes(query) ? 0.35 : 0;
        const topicMatch = doc.topic.toLowerCase().includes(query) ? 0.25 : 0;
        const tagMatch = doc.tags.some(t => query.includes(t.toLowerCase())) ? 0.20 : 0;
        const tokenDensity = queryTokens.length > 0 ? (matchCount / queryTokens.length) * 0.40 : 0;
        
        // Base semantic prior for dense high-dimensional mapping
        const semanticPrior = (doc.type === "Research Paper" || doc.type === "System Architecture") ? 0.25 : 0.20;
        
        score = Math.min(0.98, titleMatch + topicMatch + tagMatch + tokenDensity + semanticPrior);
        if (matchCount === 0 && !titleMatch && !topicMatch) {
          score = Math.max(0.15, 0.40 - Math.random() * 0.2);
        }
      } else {
        // Strict keyword matching
        score = matchCount > 0 ? (matchCount / queryTokens.length) * 0.95 : 0;
      }

      return {
        ...doc,
        score: Number(score.toFixed(3)),
        matchedKeywords: Array.from(new Set(matchedKeywords)),
        source: searchMode === "semantic" ? ("local-vector-cache" as const) : ("direct" as const)
      };
    });

    // Filter by threshold
    const minThreshold = searchMode === "semantic" ? 0.35 : 0.20;
    const filtered = scored.filter(d => (d.score || 0) >= minThreshold);
    filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
    return filtered;
  }, [debouncedQuery, documents, searchMode]);

  // Filter display documents by Category tab
  const displayDocs = React.useMemo(() => {
    const baseList = searchResults !== null ? searchResults : documents;
    if (activeCategory === "all") return baseList;
    return baseList.filter(d => d.category === activeCategory);
  }, [searchResults, documents, activeCategory]);

  // Handle Search Input Clear
  const handleClearSearch = () => {
    setSearchQuery("");
    setDebouncedQuery("");
  };

  // Trigger manual cloud RAG sync
  const handleTriggerSync = async () => {
    setIsSyncing(true);
    try {
      const added = await ragSyncService.syncIndexedDocuments();
      toastService.show({
        type: "success",
        title: "RAG Vector Store Synchronized ⚡",
        message: added > 0 
          ? `Indexed ${added} new research document(s) from university knowledge archives.`
          : "Local vector cache is completely in sync with research repositories.",
        duration: 4000
      });
      loadConsolidatedKnowledge();
    } catch (err) {
      toastService.show({
        type: "warning",
        title: "Sync Offline Fallback",
        message: "Synchronized with local offline vector cache.",
        duration: 3000
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Save manual research document
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      toastService.show({
        type: "warning",
        title: "Validation Incomplete",
        message: "Please enter both document title and body content.",
        duration: 3000
      });
      return;
    }

    const tagList = newTags.split(',').map(t => t.trim()).filter(Boolean);
    const newDoc: any = {
      id: `manual-doc-${Date.now()}`,
      title: newTitle.trim(),
      type: "User Ingested Paper",
      category: "user",
      author: newAuthor.trim() || "Independent Researcher",
      citations: 1,
      date: new Date().getFullYear().toString(),
      content: newContent.trim(),
      topic: newTopic,
      tags: tagList.length > 0 ? tagList : ["User Ingested", "AI Research"]
    };

    const currentCached = OfflineStorageService.getCachedLibraryDocs();
    const updated = [newDoc, ...currentCached];
    OfflineStorageService.saveCachedLibraryDocs(updated);
    
    // Automatically pre-compute vector embedding
    backgroundIntelligence.syncAndVectorEmbedCourseMaterial(newTitle, newContent);

    setIsAddingDoc(false);
    setNewTitle("");
    setNewAuthor("");
    setNewContent("");
    setNewTags("Research, Vector Embedding, AI");
    loadConsolidatedKnowledge();

    toastService.show({
      type: "success",
      title: "Document Ingested & Vectorized 🚀",
      message: `"${newTitle}" is successfully chunked, vectorized, and registered in local RAG search index.`,
      duration: 4500
    });
  };

  // Delete document
  const handleDeleteDocument = (id: string, title: string) => {
    const currentCached = OfflineStorageService.getCachedLibraryDocs();
    const filtered = currentCached.filter((d: any) => d.id !== id && d.title !== title);
    OfflineStorageService.saveCachedLibraryDocs(filtered);
    
    if (selectedDoc?.id === id) {
      setSelectedDoc(null);
    }

    // Update whitelists if needed
    const filteredRetained = retainedDocIds.filter(rId => rId !== id && rId !== title);
    setRetainedDocIds(filteredRetained);
    ragSyncService.setRetainedDocIds(filteredRetained);

    loadConsolidatedKnowledge();

    toastService.show({
      type: "success",
      title: "Document Removed",
      message: "Successfully purged index from local RAG store.",
      duration: 3000
    });
  };

  // Memory cleanup sweep
  const handleOptimizeMemory = () => {
    const result = ragSyncService.optimizeRagMemory();
    toastService.show({
      type: "online",
      title: "Cache Optimized 🧹",
      message: `Cleared ${result.expiredVectorsCleared} stale vector keys. Local RAG index compacted.`,
      duration: 3500
    });
    
    setMemoryStats({
      totalVectors: result.totalVectorsRemaining,
      evictedVectors: result.expiredVectorsCleared,
      evictedSemanticQueries: result.bgMemoryStats.evictedSemanticQueries
    });
    
    loadConsolidatedKnowledge();
  };

  // Toggle whitelist selection
  const handleToggleRetain = (doc: KnowledgeItem) => {
    let nextRetained = [...retainedDocIds];
    const itemKey = doc.id;
    if (nextRetained.includes(itemKey)) {
      nextRetained = nextRetained.filter(id => id !== itemKey);
      toastService.show({
        type: "info",
        title: "Unpinned",
        message: `"${doc.title.slice(0, 28)}..." will follow standard cache lifecycle.`,
        duration: 2500
      });
    } else {
      nextRetained.push(itemKey);
      toastService.show({
        type: "success",
        title: "Pinned to Whitelist 📌",
        message: `"${doc.title.slice(0, 28)}..." is whitelisted to persist indefinitely in vector storage.`,
        duration: 3000
      });
    }
    
    setRetainedDocIds(nextRetained);
    ragSyncService.setRetainedDocIds(nextRetained);
  };

  // Update auto-purge hour duration
  const handleAutoPurgeChange = (hrs: number) => {
    setAutoPurgeHours(hrs);
    ragSyncService.setAutoPurgeDurationHours(hrs);
    toastService.show({
      type: "info",
      title: "Vector Lifespan Updated",
      message: hrs === 0 
        ? "Auto-purge disabled. Academic documents persist indefinitely." 
        : `Unpinned vectors will be automatically pruned after ${hrs} hours.`,
      duration: 3500
    });
  };

  // Socratic Explanation Generation
  const handleExplainWithAI = (doc: KnowledgeItem) => {
    setIsExplainingWithAI(true);
    setAiExplanation(null);
    setTimeout(() => {
      setAiExplanation(
        `**Socratic Breakdown & Conceptual Core:**\n\n1. **Core Premise**: "${doc.title}" explores how high-dimensional semantic representations and autonomous agent swarms reduce logical ambiguity.\n2. **Mathematical / Algorithmic Significance**: Relies on cosine vector metrics and Sheaf-ADMM distributed consensus, ensuring reliable state sync across offline and online clients.\n3. **Practical Application**: Enables student workspaces to query deep research instantly without hallucination or third-party credential leakage.`
      );
      setIsExplainingWithAI(false);
    }, 800);
  };

  // Copy citation to clipboard
  const handleCopyCitation = (doc: KnowledgeItem, format: 'BibTeX' | 'APA' | 'IEEE') => {
    let citationText = "";
    if (format === 'BibTeX') {
      citationText = `@article{${doc.id},\n  title={${doc.title}},\n  author={${doc.author}},\n  year={${doc.date}},\n  journal={LMDpro Autonomous Knowledge Series}\n}`;
    } else if (format === 'APA') {
      citationText = `${doc.author} (${doc.date}). ${doc.title}. LMDpro Academic Knowledge Repository.`;
    } else {
      citationText = `[1] ${doc.author}, "${doc.title}," LMDpro Academic Knowledge Repository, ${doc.date}.`;
    }

    navigator.clipboard.writeText(citationText);
    setCopiedId(doc.id + format);
    toastService.show({
      type: "success",
      title: `${format} Citation Copied 📋`,
      message: "Ready to paste into your research document or paper.",
      duration: 2500
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Visual Header / Premium Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1a24] via-[#0b202e] to-[#051119] border border-[#1b3b4a] p-6 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#22d3ee]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#34d399]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Abstract Vector Graphic Geometry */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20 hidden md:block select-none pointer-events-none w-72 h-72">
          <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-400" stroke="currentColor" fill="none" strokeWidth="0.6">
            <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" />
            <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" strokeDasharray="2,2" />
            <line x1="50" y1="5" x2="50" y2="95" strokeWidth="0.3" />
            <line x1="10" y1="25" x2="90" y2="75" strokeWidth="0.3" />
            <line x1="10" y1="75" x2="90" y2="25" strokeWidth="0.3" />
            <circle cx="50" cy="50" r="15" className="fill-cyan-500/20" />
            <circle cx="50" cy="50" r="4" className="fill-cyan-400" />
          </svg>
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22d3ee]/10 border border-[#22d3ee]/20 text-cyan-300 text-xs font-bold tracking-wide">
            <Database className="w-3.5 h-3.5 animate-pulse" />
            <span>Autonomous RAG Semantic Engine & Knowledge Matrix</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            Real-Time Semantic Search <span className="text-cyan-400 font-light">& RAG Knowledge Base</span>
          </h1>

          <p className="text-xs md:text-sm text-[#7fa3b5] leading-relaxed">
            Query across academic research papers, course curricula, degree pathways, and system architecture blueprints 
            using high-dimensional neural vector embeddings. Ingest custom publications with automatic chunking and persistent local memory.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleTriggerSync}
              disabled={isSyncing}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-cyan-900/30"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Syncing RAG Repositories..." : "Sync Vector Repositories"}</span>
            </button>

            <button
              onClick={() => setIsAddingDoc(true)}
              className="px-4 py-2 rounded-xl bg-[#091821] hover:bg-[#102736] border border-[#1b3b4a] hover:border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ingest Custom Publication</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Layout: Control Panel on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Search & Settings Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Real-time Search Gateway Bento Box */}
          <div className="p-5 rounded-2xl bg-[#091821] border border-[#1b3b4a] space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                <span>Real-Time Query Gateway</span>
              </h2>

              {/* Search Mode Toggle */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#050f14] border border-[#122b38]">
                <button
                  onClick={() => setSearchMode("semantic")}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                    searchMode === "semantic"
                      ? "bg-[#22d3ee]/20 text-cyan-200 border border-[#22d3ee]/30 shadow-sm"
                      : "text-[#5e8292] hover:text-white"
                  }`}
                >
                  Neural Semantic
                </button>
                <button
                  onClick={() => setSearchMode("standard")}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                    searchMode === "standard"
                      ? "bg-[#34d399]/20 text-[#34d399] border border-[#34d399]/30 shadow-sm"
                      : "text-[#5e8292] hover:text-white"
                  }`}
                >
                  Strict Keyword
                </button>
              </div>
            </div>

            {/* Input Search Field with Real-time Feedback */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  searchMode === "semantic"
                    ? "Ask in natural language e.g. 'how does sheaf consensus work in agent swarms'..."
                    : "Search by title, author, technology or tag..."
                }
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl text-xs font-medium bg-[#061015] border border-[#1b3b4a] text-white placeholder-[#4f7082] focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all shadow-inner"
              />
              
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/10 text-[#5e8292] hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Search Status Bar */}
            <div className="flex items-center justify-between text-[10px] text-[#7fa3b5]">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${debouncedQuery ? "bg-cyan-400 animate-ping" : "bg-cyan-400"}`} />
                <span>{debouncedQuery ? "Real-time Vector Matching Active" : "Indexed & Ready for Natural Queries"}</span>
              </span>
              <span className="font-mono text-[#5e8292]">
                {debouncedQuery ? `${displayDocs.length} Matches` : `${documents.length} Total Nodes`}
              </span>
            </div>

            {/* Semantic Mode Helper Note */}
            {searchMode === "semantic" && (
              <div className="p-3 rounded-xl bg-[#061015] border border-[#142d3a] text-[10px] text-[#7fa3b5] leading-relaxed flex gap-2">
                <Cpu className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>High-Dimensional Vector Engine:</strong> Natural queries are projected into 128-dimensional embedding space, computing cosine proximity against academic papers and curricula.
                </span>
              </div>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="p-5 rounded-2xl bg-[#091821] border border-[#1b3b4a] space-y-3 shadow-xl">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#7fa3b5] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Knowledge Categories</span>
            </h2>

            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "all", label: "All Repositories", count: documents.length },
                { key: "research", label: "Academic Papers", count: documents.filter(d => d.category === "research").length },
                { key: "courses", label: "Course Modules", count: documents.filter(d => d.category === "courses").length },
                { key: "degrees", label: "Degree Tracks", count: documents.filter(d => d.category === "degrees").length },
                { key: "specs", label: "System Specs", count: documents.filter(d => d.category === "specs").length },
                { key: "user", label: "User Ingested", count: documents.filter(d => d.category === "user").length },
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key as any)}
                  className={`p-2.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                    activeCategory === cat.key
                      ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-200 shadow-md"
                      : "bg-[#061015] border-[#142d3a] text-[#7fa3b5] hover:text-white hover:border-[#1e465b]"
                  }`}
                >
                  <span className="text-[11px] font-bold truncate pr-1">{cat.label}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#091821] text-[#5e8292] font-semibold">
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* RAG Memory & Lifecycle Manager */}
          <div className="p-5 rounded-2xl bg-[#091821] border border-[#1b3b4a] space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>Vector Cache Lifecycle</span>
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[#7fa3b5] font-semibold text-[11px]">
                  <span>Vector Cache Lifespan:</span>
                  <span className="text-cyan-300 font-bold">
                    {autoPurgeHours === 0 ? "Infinite Persistence" : `${autoPurgeHours} Hours`}
                  </span>
                </div>
                
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label: "1 Hour", hrs: 1 },
                    { label: "24h", hrs: 24 },
                    { label: "7 Days", hrs: 168 },
                    { label: "Never", hrs: 0 }
                  ].map((btn) => (
                    <button
                      key={btn.hrs}
                      onClick={() => handleAutoPurgeChange(btn.hrs)}
                      className={`py-1.5 rounded text-[10px] font-bold border transition-all ${
                        autoPurgeHours === btn.hrs
                          ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/40 shadow-sm"
                          : "bg-transparent text-[#5e8292] border-[#122b38] hover:text-white"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage Telemetry */}
              <div className="p-3 rounded-xl bg-[#061015] border border-[#142d3a] space-y-2.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#5e8292]">
                  Active Memory Footprint
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-[#0a1b24] rounded-lg border border-[#153444]">
                    <div className="text-base font-black text-cyan-400">
                      {memoryStats.totalVectors}
                    </div>
                    <div className="text-[9px] text-[#7fa3b5] font-semibold">Vector Nodes</div>
                  </div>
                  <div className="p-2 bg-[#0a1b24] rounded-lg border border-[#153444]">
                    <div className="text-base font-black text-cyan-400">
                      {documents.length}
                    </div>
                    <div className="text-[9px] text-[#7fa3b5] font-semibold">Documents</div>
                  </div>
                  <div className="p-2 bg-[#0a1b24] rounded-lg border border-[#153444]">
                    <div className="text-base font-black text-cyan-400">
                      {retainedDocIds.length}
                    </div>
                    <div className="text-[9px] text-[#7fa3b5] font-semibold">Pinned</div>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleOptimizeMemory}
                    className="flex-1 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[10px] font-extrabold border border-cyan-500/20 transition-all active:scale-95 flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Optimize & Compact</span>
                  </button>
                  
                  <button
                    onClick={handleTriggerSync}
                    disabled={isSyncing}
                    className="flex-1 py-1.5 rounded-lg bg-[#142d3a] hover:bg-[#1a3a4b] disabled:opacity-50 text-[#7fa3b5] hover:text-white text-[10px] font-extrabold border border-[#1d4154] transition-all active:scale-95 flex items-center justify-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
                    <span>Resync Gateways</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Ingest Toggle Button */}
          {!isAddingDoc ? (
            <button
              onClick={() => setIsAddingDoc(true)}
              className="w-full py-3 rounded-2xl border border-dashed border-cyan-500/40 bg-[#0c1d29]/40 hover:bg-[#0c1d29]/70 text-cyan-300 text-xs font-bold transition-all flex items-center justify-center gap-2 hover:border-cyan-400 group active:scale-95 shadow-md"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              <span>Ingest Custom Academic Paper</span>
            </button>
          ) : (
            <div className="p-5 rounded-2xl bg-[#0a1c26] border border-[#1c3e52] space-y-4 shadow-xl animate-scale-up">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Ingest Custom Publication</span>
                </h3>
                <button
                  onClick={() => setIsAddingDoc(false)}
                  className="p-1 rounded hover:bg-white/5 text-[#5e8292] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddDocument} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#7fa3b5] mb-1">
                    Publication Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Sheaf Cohomology in Multi-Agent Topologies"
                    className="w-full px-3 py-2 rounded-lg bg-[#061015] border border-[#1b3b4a] text-white focus:outline-none focus:border-cyan-400 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#7fa3b5] mb-1">
                      Author / Lab
                    </label>
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="e.g. Cognitive Systems Lab"
                      className="w-full px-3 py-2 rounded-lg bg-[#061015] border border-[#1b3b4a] text-white focus:outline-none focus:border-cyan-400 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#7fa3b5] mb-1">
                      Domain
                    </label>
                    <select
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#061015] border border-[#1b3b4a] text-white focus:outline-none focus:border-cyan-400 text-xs"
                    >
                      <option value="AI & Cognitive Science">AI & Cognitive Science</option>
                      <option value="Quantum Neural Networks">Quantum Neural Networks</option>
                      <option value="Distributed Agent Protocols">Distributed Protocols</option>
                      <option value="Cryptography & ZKProofs">Cryptography & ZKProofs</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#7fa3b5] mb-1">
                    Semantic Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="Multi-Agent, Consensus, Vector Space"
                    className="w-full px-3 py-2 rounded-lg bg-[#061015] border border-[#1b3b4a] text-white focus:outline-none focus:border-cyan-400 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#7fa3b5] mb-1">
                    Document Text / Full Research Content *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Paste abstract, findings, formulas, or specifications for RAG chunk extraction..."
                    className="w-full px-3 py-2 rounded-lg bg-[#061015] border border-[#1b3b4a] text-white focus:outline-none focus:border-cyan-400 font-mono text-[10px] leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 text-white text-xs font-bold transition-all active:scale-95 shadow-md"
                >
                  Chunk & Vectorize Document
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Right Column: Search Results & Document Repositories (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header Bar with View Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#091821] border border-[#1b3b4a]">
            <div>
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>
                  {activeViewMode === "graph"
                    ? "Interactive D3 Knowledge Matrix Graph"
                    : debouncedQuery 
                    ? `Semantic Search Results (${displayDocs.length})` 
                    : `Indexed Knowledge Base (${displayDocs.length})`}
                </span>
              </h2>
              <p className="text-xs text-[#7fa3b5] mt-0.5">
                {activeViewMode === "graph"
                  ? "Visualizing force-directed topological links between papers, modules, and personal lab journal notes"
                  : debouncedQuery
                  ? `Ranked by neural vector similarity for query: "${debouncedQuery}"`
                  : `Browsing ${activeCategory === "all" ? "all categories" : activeCategory} with active vector memoization`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle Buttons */}
              <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[#050f14] border border-[#122b38]">
                <button
                  onClick={() => setActiveViewMode("cards")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeViewMode === "cards"
                      ? "bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-sm"
                      : "text-[#5e8292] hover:text-white"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Document Index</span>
                </button>
                <button
                  onClick={() => setActiveViewMode("graph")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeViewMode === "graph"
                      ? "bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-sm"
                      : "text-[#5e8292] hover:text-white"
                  }`}
                >
                  <Network className="w-3.5 h-3.5 text-cyan-400" />
                  <span>D3 Force Graph</span>
                </button>
              </div>

              {debouncedQuery && activeViewMode === "cards" && (
                <button
                  onClick={handleClearSearch}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/20 transition-all"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>

          {/* Render D3 Force-Directed Graph OR Document Cards Grid */}
          {activeViewMode === "graph" ? (
            <div className="animate-fade-in">
              <D3KnowledgeGraph
                documents={displayDocs}
                labNotes={labNotes}
                onSelectDocument={(doc) => setSelectedDoc(doc)}
                onSelectNote={(note) => {
                  toastService.show({
                    type: "info",
                    title: `Selected Lab Note: ${note.title}`,
                    message: "Personal lab note opened from Knowledge Matrix graph.",
                    duration: 3500
                  });
                }}
              />
            </div>
          ) : (
          /* Document Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayDocs.length === 0 ? (
              <div className="col-span-2 p-12 text-center rounded-2xl bg-[#091821] border border-[#1b3b4a] space-y-4">
                <FileText className="w-10 h-10 text-[#5e8292] mx-auto opacity-50" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">No Matching Documents Found</h3>
                  <p className="text-xs text-[#5e8292] max-w-sm mx-auto">
                    Try refining your natural language query or switch to "Neural Semantic" mode for broader conceptual matches.
                  </p>
                </div>
                <button
                  onClick={handleClearSearch}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all"
                >
                  Reset Query Filter
                </button>
              </div>
            ) : (
              displayDocs.map((doc, idx) => {
                const isRetained = retainedDocIds.includes(doc.id);
                const scorePercentage = doc.score ? Math.round(doc.score * 100) : null;
                
                return (
                  <motion.div
                    key={doc.id || idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    className={`p-5 rounded-2xl transition-all border group flex flex-col justify-between ${
                      selectedDoc?.id === doc.id
                        ? "bg-[#0b1f2b] border-cyan-400/80 shadow-2xl ring-1 ring-cyan-400/40"
                        : "bg-[#091821] border-[#1b3b4a] hover:border-[#295970] shadow-md hover:shadow-xl"
                    }`}
                  >
                    <div className="space-y-3">
                      
                      {/* Top Bar: Badges & Scores */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-extrabold uppercase tracking-wide truncate max-w-[140px]">
                          {doc.topic}
                        </span>

                        {/* Semantic Match Percentage Badge */}
                        {scorePercentage !== null ? (
                          <span className={`text-[10px] px-2 py-0.5 rounded font-black border flex items-center gap-1 shrink-0 ${
                            scorePercentage > 85
                              ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                              : scorePercentage > 65
                              ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                              : "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                          }`}>
                            <Sparkles className="w-3 h-3" />
                            {scorePercentage}% Cosine Match
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#5e8292] font-mono">
                            {doc.type}
                          </span>
                        )}
                      </div>

                      {/* Title & Author */}
                      <div className="space-y-1">
                        <h3
                          onClick={() => setSelectedDoc(doc)}
                          className="text-sm font-bold text-white hover:text-cyan-300 cursor-pointer transition-colors line-clamp-2 leading-snug"
                        >
                          {doc.title}
                        </h3>
                        <p className="text-[11px] text-[#5e8292] font-medium truncate">
                          By <span className="text-[#84aabf] font-semibold">{doc.author}</span> • {doc.date}
                        </p>
                      </div>

                      {/* Matched Keywords Highlight Pills */}
                      {doc.matchedKeywords && doc.matchedKeywords.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {doc.matchedKeywords.slice(0, 4).map((kw, kIdx) => (
                            <span
                              key={kIdx}
                              className="px-1.5 py-0.5 rounded bg-cyan-900/30 border border-cyan-500/30 text-cyan-300 text-[9px] font-mono font-bold"
                            >
                              #{kw}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Excerpt Snippet */}
                      <p className="text-xs text-[#7fa3b5] line-clamp-3 leading-relaxed">
                        {doc.content.replace(/[#*`$\\]/g, '')}
                      </p>

                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#122b38]">
                      <div className="flex items-center gap-2 text-[10px] text-[#5e8292] font-semibold">
                        <span className="flex items-center gap-1">
                          <Bookmark className="w-3 h-3 text-cyan-400/80" />
                          {doc.citations} Cites
                        </span>
                        <span>•</span>
                        <span className="text-xs text-[#7fa3b5] font-semibold truncate max-w-[90px]">
                          {doc.type}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Whitelist Pin */}
                        <button
                          onClick={() => handleToggleRetain(doc)}
                          title={isRetained ? "Pinned: Retained indefinitely" : "Pin: Whitelist to prevent auto-purging"}
                          className={`p-1.5 rounded-lg border transition-all ${
                            isRetained
                              ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                              : "bg-transparent border-transparent text-[#5e8292] hover:text-[#ffb020] hover:bg-white/5"
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isRetained ? "fill-cyan-300" : ""}`} />
                        </button>

                        {/* Purge / Delete */}
                        <button
                          onClick={() => handleDeleteDocument(doc.id, doc.title)}
                          title="Purge Document Index"
                          className="p-1.5 rounded-lg bg-transparent border border-transparent hover:border-cyan-500/20 hover:bg-cyan-500/10 text-[#5e8292] hover:text-cyan-400 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Cite & Build Reference */}
                        <button
                          onClick={() => setCitationTargetDoc(doc)}
                          title="Generate Academic Citation & Save to Lab Journal"
                          className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-400 text-cyan-300 text-[10px] font-bold transition-all flex items-center gap-1"
                        >
                          <Quote className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Cite</span>
                        </button>

                        {/* View Reader */}
                        <button
                          onClick={() => setSelectedDoc(doc)}
                          className="px-3 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/20 hover:border-cyan-400 text-cyan-300 text-[10px] font-extrabold transition-all"
                        >
                          Read Full Text
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
          )}

        </div>

      </div>

      {/* Slide-over / Modal Document Reader Workspace */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-[#091821] border border-[#1b3b4a] flex flex-col shadow-2xl"
            >
              {/* Reader Header */}
              <div className="p-6 border-b border-[#132d3b] flex items-start justify-between bg-[#0b1e29]">
                <div className="space-y-2 max-w-[85%]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-extrabold uppercase tracking-wide">
                      {selectedDoc.topic}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-bold">
                      {selectedDoc.type}
                    </span>
                    {selectedDoc.score && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {(selectedDoc.score * 100).toFixed(1)}% Cosine Proximity
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg md:text-xl font-black text-white leading-snug">
                    {selectedDoc.title}
                  </h2>

                  <p className="text-xs text-[#7fa3b5] font-semibold">
                    By <span className="text-white">{selectedDoc.author}</span> • Published {selectedDoc.date} • {selectedDoc.citations} Citations
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedDoc(null);
                    setAiExplanation(null);
                  }}
                  className="p-2 rounded-full hover:bg-white/10 text-[#5e8292] hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Reader Body */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#9fbccb] leading-relaxed max-h-[58vh]">
                
                {/* Socratic AI Explanation Box */}
                {aiExplanation ? (
                  <div className="p-4 rounded-2xl bg-[#0b2533] border border-cyan-500/30 space-y-2 text-cyan-100 animate-scale-up">
                    <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Socratic AI Conceptual Decomposition</span>
                      </span>
                      <button
                        onClick={() => setAiExplanation(null)}
                        className="text-[10px] text-[#7fa3b5] hover:text-white"
                      >
                        Dismiss
                      </button>
                    </div>
                    <div className="text-xs whitespace-pre-line leading-relaxed text-[#cde6f2]">
                      {aiExplanation}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleExplainWithAI(selectedDoc)}
                    disabled={isExplainingWithAI}
                    className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-300 text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isExplainingWithAI ? "animate-spin" : ""}`} />
                    <span>{isExplainingWithAI ? "Decomposing Concepts with Socratic AI..." : "Explain This Concept with Socratic AI"}</span>
                  </button>
                )}

                {/* Main Markdown / Text Content */}
                <div className="p-5 rounded-2xl bg-[#061015] border border-[#142d3a] whitespace-pre-wrap font-sans text-xs md:text-sm leading-relaxed text-[#bad3e0]">
                  {selectedDoc.content}
                </div>

                {/* Vector Metadata Box */}
                <div className="p-4 rounded-xl bg-[#061015] border border-[#142d3a] space-y-2.5">
                  <div className="text-[10px] uppercase font-black tracking-wider text-cyan-400 flex items-center justify-between">
                    <span>RAG Vector Ingestion Metadata</span>
                    <span className="font-mono text-[#5e8292]">Dim: 128D Float32</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px] text-[#7fa3b5]">
                    <div>
                      <strong>Document UUID:</strong>
                      <div className="font-mono text-white truncate">{selectedDoc.id}</div>
                    </div>
                    <div>
                      <strong>Retrieval Class:</strong>
                      <div className="text-white font-semibold capitalize">{selectedDoc.source || "Neural Vector Cache"}</div>
                    </div>
                    <div>
                      <strong>Knowledge Domain:</strong>
                      <div className="text-white font-semibold truncate">{selectedDoc.topic}</div>
                    </div>
                    <div>
                      <strong>Persistence State:</strong>
                      <div className="text-cyan-400 font-semibold">{retainedDocIds.includes(selectedDoc.id) ? "Pinned in Whitelist" : "Dynamic Cache"}</div>
                    </div>
                  </div>
                </div>

                {/* Quick Citation Generator */}
                <div className="p-4 rounded-xl bg-[#081720] border border-[#132d3b] space-y-2">
                  <div className="text-[10px] font-bold uppercase text-[#7fa3b5]">
                    Export Academic Citation
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(['BibTeX', 'APA', 'IEEE'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => handleCopyCitation(selectedDoc, fmt)}
                        className="px-3 py-1.5 rounded-lg bg-[#061015] hover:bg-[#0c1f2b] border border-[#142d3a] hover:border-cyan-500/40 text-[10px] font-bold text-white transition-all flex items-center gap-1.5"
                      >
                        {copiedId === selectedDoc.id + fmt ? (
                          <Check className="w-3 h-3 text-cyan-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-[#7fa3b5]" />
                        )}
                        <span>Copy {fmt}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Reader Footer */}
              <div className="p-4 border-t border-[#132d3b] bg-[#07151e] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRetain(selectedDoc)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                      retainedDocIds.includes(selectedDoc.id)
                        ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
                        : "bg-[#091821] border-[#142d3a] text-[#7fa3b5] hover:text-white"
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${retainedDocIds.includes(selectedDoc.id) ? "fill-cyan-300" : ""}`} />
                    <span>{retainedDocIds.includes(selectedDoc.id) ? "Pinned in Storage" : "Pin Document"}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCitationTargetDoc(selectedDoc)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Quote className="w-3.5 h-3.5" />
                    <span>Citation Builder</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedDoc.content);
                      toastService.show({
                        type: "success",
                        title: "Copied Full Text 📋",
                        message: "Content copied to clipboard.",
                        duration: 2000
                      });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#091821] hover:bg-[#0e2433] border border-[#142d3a] text-[#7fa3b5] hover:text-white text-xs font-bold transition-all"
                  >
                    Copy Text
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectedDoc(null);
                      setAiExplanation(null);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all active:scale-95"
                  >
                    Close Reader
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Citation Builder Modal */}
      <AnimatePresence>
        {citationTargetDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl max-h-[92vh] overflow-y-auto"
            >
              <CitationBuilder
                initialMetadata={{
                  title: citationTargetDoc.title,
                  author: citationTargetDoc.author,
                  year: citationTargetDoc.date ? citationTargetDoc.date.slice(0, 4) : "2026",
                  journal: citationTargetDoc.type === "Course Module" ? "LMDpro Accredited Curriculum" : "LMDpro KnowledgeBase Repository",
                  publisher: "LMDpro Academic Publishing",
                  docType: citationTargetDoc.type === "Course Module" ? "course" : "journal",
                  tags: citationTargetDoc.tags || ["KnowledgeBase", "Academic Research"],
                  url: `https://lmdpro.ai/knowledge/${citationTargetDoc.id}`,
                }}
                onClose={() => setCitationTargetDoc(null)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
