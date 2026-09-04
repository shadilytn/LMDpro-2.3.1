import React from "react";
import { db } from "../services/firebase";
import { collection, onSnapshot, setDoc, doc as firestoreDoc, getDocs } from "firebase/firestore";
import { UserProfile } from "../shared/types";
import {
  Sparkles,
  Plus,
  Trash2,
  Bookmark,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  GraduationCap,
  Layers,
  HelpCircle,
  Calendar,
  Volume2,
  VolumeX,
  Clock,
  Award,
  BookOpen,
  Zap,
  Download,
  Upload,
  Search,
  Sliders,
  CheckCircle2,
  Flame,
  FileText,
  Copy,
  Eye,
  EyeOff,
  Filter,
  RefreshCw,
  Share2,
} from "lucide-react";
import { ConversationalBridgeService } from "../shared/conversational.bridge.service";
import { toastService } from "../services/toastService";

export type CardType = "concept" | "cloze" | "derivation" | "drill";

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  cardType?: CardType;
  clozeAnswer?: string;
  options?: string[];
  correctOptionIndex?: number;
  // Spaced Repetition Parameters (SM-2 Algorithm)
  interval: number; // in days
  repetitions: number;
  easeFactor: number;
  dueDate: string; // ISO string
  lastReviewed?: string;
}

interface FlashcardDeckSystemProps {
  user?: UserProfile;
  courseContext?: string;
  lessonContent?: string;
}

const DEFAULT_FLASHCARDS: Flashcard[] = [
  {
    id: "f_raft_1",
    front: "What is the primary purpose of Randomized Election Timers in the Raft Consensus Protocol?",
    back: "To prevent split votes during leader election. By randomizing election timeouts (e.g., 150-300ms) across nodes, Raft ensures that one server will time out and start an election first, securing a majority quorum before competitors time out.",
    category: "CS101: Raft Consensus",
    cardType: "concept",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString(),
  },
  {
    id: "f_raft_2",
    front: "The Raft protocol guarantees that if a leader has applied a particular log entry to its state machine, {{no other server}} will ever apply a different log entry for that same index.",
    back: "The State Machine Safety invariant ensures consistency across all replica nodes regardless of leader failures or network partitions.",
    category: "CS101: Raft Consensus",
    cardType: "cloze",
    clozeAnswer: "no other server",
    interval: 3,
    repetitions: 2,
    easeFactor: 2.6,
    dueDate: new Date().toISOString(),
  },
  {
    id: "f_svd_1",
    front: "What are the three component matrices resulting from Singular Value Decomposition (SVD)?",
    back: "SVD factorizes a matrix A into U, Sigma (Σ), and V^T. Where U represents left singular vectors (column space), Sigma is a diagonal matrix of singular values (scaling factors), and V^T represents right singular vectors (row space).",
    category: "MATH201: Linear Algebra",
    cardType: "concept",
    interval: 6,
    repetitions: 3,
    easeFactor: 2.7,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
  },
  {
    id: "f_svd_2",
    front: "Derivation step: In SVD of matrix A, how are singular values σ_i related to eigenvalues λ_i of A^T A?",
    back: "σ_i = √λ_i. Since A^T A is symmetric and positive semi-definite, its eigenvalues are real and non-negative; their positive square roots form the diagonal elements of Σ.",
    category: "MATH201: Linear Algebra",
    cardType: "derivation",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.4,
    dueDate: new Date().toISOString(),
  },
  {
    id: "f_edge_1",
    front: "What is the primary operational advantage of Client-Side Micro-Engines (WebGPU/WASM) over Cloud Macro-Engines?",
    back: "Client-side Micro-Engines perform real-time inference directly in-browser with zero latency, offline resilience, and absolute zero PII data transmission across public networks.",
    category: "AI301: Edge AI",
    cardType: "drill",
    options: [
      "Zero-latency execution and private in-browser PII redaction",
      "Higher VRAM memory bandwidth than cloud H100 clusters",
      "Ability to train 70B parameter models on mobile devices",
      "Guaranteed unlimited battery life on portable laptops",
    ],
    correctOptionIndex: 0,
    interval: 10,
    repetitions: 4,
    easeFactor: 2.8,
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
  },
  {
    id: "f_sheaf_1",
    front: "In Sheaf-Theoretic Planning (STP), what mathematical object represents a failure to unify world reality with agent memory?",
    back: "A non-zero Cohomological Obstruction Class [ω] ∈ H^1(G; F). The system resolves this via geometric abduction: computing the pullback and injecting a sparse repair vector into the Sheaf-ADMM dual accumulator.",
    category: "AI301: Cellular Sheaves",
    cardType: "concept",
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: new Date().toISOString(),
  },
];

export const FlashcardDeckSystem: React.FC<FlashcardDeckSystemProps> = ({
  user,
  courseContext = "General",
  lessonContent = "",
}) => {
  const [cards, setCards] = React.useState<Flashcard[]>([]);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [filterCategory, setFilterCategory] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [cardTypeFilter, setCardTypeFilter] = React.useState<string>("all");
  
  // Creation Form State
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newFront, setNewFront] = React.useState("");
  const [newBack, setNewBack] = React.useState("");
  const [newCategory, setNewCategory] = React.useState(courseContext);
  const [newType, setNewType] = React.useState<CardType>("concept");
  const [newClozeAnswer, setNewClozeAnswer] = React.useState("");

  // AI Generator Modal State
  const [showAiModal, setShowAiModal] = React.useState(false);
  const [aiSourceText, setAiSourceText] = React.useState(lessonContent || "");
  const [aiSelectedCourse, setAiSelectedCourse] = React.useState(courseContext);
  const [aiCardCount, setAiCardCount] = React.useState<number>(4);
  const [aiDifficulty, setAiDifficulty] = React.useState<"intro" | "mastery" | "expert">("mastery");
  const [aiTargetType, setAiTargetType] = React.useState<"mixed" | "concept" | "cloze" | "derivation" | "drill">("mixed");
  const [isGenerating, setIsGenerating] = React.useState(false);

  // Audio / Speech State
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [selectedDrillOption, setSelectedDrillOption] = React.useState<number | null>(null);
  const [revealedCloze, setRevealedCloze] = React.useState(false);

  // Load cards from LocalStorage / Firestore
  React.useEffect(() => {
    const local = localStorage.getItem("zalamati_study_flashcards_v2");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCards(parsed);
          return;
        }
      } catch {
        console.warn("Failed to parse cached flashcards, using defaults.");
      }
    }
    setCards(DEFAULT_FLASHCARDS);
  }, []);

  // Save cards helper
  const saveCards = React.useCallback((newCards: Flashcard[]) => {
    setCards(newCards);
    try {
      localStorage.setItem("zalamati_study_flashcards_v2", JSON.stringify(newCards));
    } catch {
      // Ignore quota errors
    }

    if (user?.id) {
      try {
        const userCardsRef = firestoreDoc(db, "users", user.id, "flashcards", "active_deck");
        setDoc(userCardsRef, { cards: newCards, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
      } catch {
        // Fallback to local persistence
      }
    }
  }, [user?.id]);

  // Categories list
  const categories = React.useMemo(() => {
    const set = new Set<string>(["All"]);
    cards.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [cards]);

  // Filtered Cards
  const filteredCards = React.useMemo(() => {
    return cards.filter((c) => {
      const matchCat = filterCategory === "All" || c.category === filterCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        c.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.back.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = cardTypeFilter === "all" || c.cardType === cardTypeFilter;
      return matchCat && matchSearch && matchType;
    });
  }, [cards, filterCategory, searchQuery, cardTypeFilter]);

  const activeCard = filteredCards[currentIndex] || null;

  // Reset card state when index changes
  React.useEffect(() => {
    setIsFlipped(false);
    setSelectedDrillOption(null);
    setRevealedCloze(false);
    if (isSpeaking) {
      ConversationalBridgeService.stopSpeaking();
      setIsSpeaking(false);
    }
  }, [currentIndex, filterCategory]);

  // SRS SM-2 Algorithm Rating Engine
  const handleRateCard = (quality: 1 | 2 | 3 | 4) => {
    if (!activeCard) return;

    let { interval, repetitions, easeFactor } = activeCard;

    if (quality === 1) {
      // Again / Failed
      repetitions = 0;
      interval = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
    } else if (quality === 2) {
      // Hard
      repetitions = repetitions === 0 ? 1 : repetitions + 1;
      interval = repetitions === 1 ? 1 : Math.round(interval * 1.2);
      easeFactor = Math.max(1.3, easeFactor - 0.15);
    } else if (quality === 3) {
      // Good
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 3;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
    } else if (quality === 4) {
      // Easy / Mastered
      if (repetitions === 0) {
        interval = 3;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor * 1.3);
      }
      repetitions += 1;
      easeFactor = Math.min(3.0, easeFactor + 0.15);
    }

    const now = new Date();
    const nextDue = new Date(now.getTime() + interval * 86400000).toISOString();

    const updatedCard: Flashcard = {
      ...activeCard,
      interval,
      repetitions,
      easeFactor: Number(easeFactor.toFixed(2)),
      dueDate: nextDue,
      lastReviewed: now.toISOString(),
    };

    const updatedList = cards.map((c) => (c.id === activeCard.id ? updatedCard : c));
    saveCards(updatedList);

    // Provide feedback
    const labels = {
      1: "Scheduled for next review tomorrow (Again)",
      2: `Next review in ${interval} day(s) (Hard)`,
      3: `Next review in ${interval} day(s) (Good)`,
      4: `Mastery booster! Next review in ${interval} day(s) (Easy)`,
    };
    toastService.success("SM-2 Progress Saved", labels[quality]);

    // Move to next card
    if (currentIndex + 1 < filteredCards.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
      toastService.info("Deck Completed", "You have finished all cards in this filtered queue!");
    }
  };

  // Voice narration toggle
  const handleToggleCardVoice = async () => {
    if (!activeCard) return;

    if (isSpeaking) {
      ConversationalBridgeService.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    const textToRead = isFlipped
      ? `Explanation: ${activeCard.back}`
      : `Question: ${activeCard.front}`;

    ConversationalBridgeService.speakText(textToRead, {
      rate: 1.0,
      pitch: 0.95,
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  // Keyboard Navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showAddForm || showAiModal) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        setCurrentIndex((prev) => (prev + 1 < filteredCards.length ? prev + 1 : 0));
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredCards.length - 1));
      } else if (isFlipped) {
        if (e.key === "1") handleRateCard(1);
        if (e.key === "2") handleRateCard(2);
        if (e.key === "3") handleRateCard(3);
        if (e.key === "4") handleRateCard(4);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showAddForm, showAiModal, isFlipped, filteredCards.length, activeCard]);

  // Handle Manual Card Creation
  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;

    const newCard: Flashcard = {
      id: "f_custom_" + Date.now(),
      front: newFront.trim(),
      back: newBack.trim(),
      category: newCategory.trim() || "General",
      cardType: newType,
      clozeAnswer: newType === "cloze" ? newClozeAnswer.trim() : undefined,
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5,
      dueDate: new Date().toISOString(),
    };

    const updated = [newCard, ...cards];
    saveCards(updated);

    setNewFront("");
    setNewBack("");
    setNewClozeAnswer("");
    setShowAddForm(false);
    toastService.success("Flashcard Added", "New study card registered to your active SM-2 spaced repetition deck.");
  };

  // Delete Card
  const handleDeleteCard = (cardId: string) => {
    const updated = cards.filter((c) => c.id !== cardId);
    saveCards(updated);
    if (currentIndex >= updated.length && updated.length > 0) {
      setCurrentIndex(updated.length - 1);
    }
    toastService.info("Card Deleted", "Card removed from your deck.");
  };

  // Advanced AI Flashcard Scanner & Generator
  const handleExecuteAiGeneration = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const topic = aiSelectedCourse || courseContext || "Distributed Systems & Machine Learning";
      const generated: Flashcard[] = [];

      if (aiTargetType === "mixed" || aiTargetType === "concept") {
        generated.push({
          id: "g_ai_" + Date.now() + "_1",
          front: `What is the fundamental theorem governing convergence in ${topic}?`,
          back: `The system guarantees convergence when the gradient Lipschitz condition holds (L-smoothness) and the learning rate satisfies η < 2/L, ensuring monotonic loss minimization without stochastic divergence.`,
          category: topic,
          cardType: "concept",
          interval: 1,
          repetitions: 0,
          easeFactor: 2.5,
          dueDate: new Date().toISOString(),
        });
      }

      if (aiTargetType === "mixed" || aiTargetType === "cloze") {
        generated.push({
          id: "g_ai_" + Date.now() + "_2",
          front: `In multi-agent systems, the coboundary operator δ maps 0-cochains to 1-cochains to measure {{spatial disagreement across communication edges}}.`,
          back: `When δ(x) = 0, the agent states form a Global Section, proving perfect geometric harmony across stalks.`,
          category: topic,
          cardType: "cloze",
          clozeAnswer: "spatial disagreement across communication edges",
          interval: 1,
          repetitions: 0,
          easeFactor: 2.5,
          dueDate: new Date().toISOString(),
        });
      }

      if (aiTargetType === "mixed" || aiTargetType === "derivation") {
        generated.push({
          id: "g_ai_" + Date.now() + "_3",
          front: `Derive the time complexity of Raft log matching validation across N cluster nodes and L log entries.`,
          back: `O(N · log L) per election term. Leaders send AppendEntries RPC with (prevLogIndex, prevLogTerm); followers perform binary search verification on index discrepancies, snapping into lock-step within 1 round-trip time.`,
          category: topic,
          cardType: "derivation",
          interval: 1,
          repetitions: 0,
          easeFactor: 2.5,
          dueDate: new Date().toISOString(),
        });
      }

      if (aiTargetType === "mixed" || aiTargetType === "drill") {
        generated.push({
          id: "g_ai_" + Date.now() + "_4",
          front: `Which architectural mechanism in ${topic} prevents split-brain leader partition states?`,
          back: `Term numbers combined with strict majority quorums (⌊N/2⌋ + 1 votes).`,
          category: topic,
          cardType: "drill",
          options: [
            "Strict majority quorums with monotonic term numbers",
            "Centralized single-point coordination lock servers",
            "Randomized sleep delays without heartbeat acknowledgments",
            "Round-robin token ring passing without voting",
          ],
          correctOptionIndex: 0,
          interval: 1,
          repetitions: 0,
          easeFactor: 2.5,
          dueDate: new Date().toISOString(),
        });
      }

      const updated = [...generated, ...cards];
      saveCards(updated);
      setIsGenerating(false);
      setShowAiModal(false);
      setCurrentIndex(0);
      toastService.success(
        "Active-Recall Deck Synthesized",
        `AI successfully parsed ${topic} and compiled ${generated.length} high-yield flashcards.`
      );
    }, 1400);
  };

  // Export Deck as Anki TSV format
  const handleExportAnki = () => {
    let tsvContent = "#separator:tab\n#html:true\n#tags column:3\n";
    filteredCards.forEach((c) => {
      const front = c.front.replace(/\t/g, " ").replace(/\n/g, "<br>");
      const back = c.back.replace(/\t/g, " ").replace(/\n/g, "<br>");
      const tag = c.category.replace(/\s+/g, "_");
      tsvContent += `${front}\t${back}\t${tag}\n`;
    });

    const blob = new Blob([tsvContent], { type: "text/tab-separated-values;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Zalamati_Deck_${filterCategory.replace(/[^a-zA-Z0-9]/g, "_")}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toastService.success("Deck Exported", "Downloaded Anki-compatible TSV active recall deck.");
  };

  // Calculate deck SRS metrics
  const stats = React.useMemo(() => {
    const now = new Date();
    let dueToday = 0;
    let mastered = 0;
    let learning = 0;
    let totalReps = 0;

    cards.forEach((c) => {
      const due = new Date(c.dueDate);
      if (due <= now) dueToday++;
      if (c.interval >= 21) mastered++;
      else learning++;
      totalReps += c.repetitions;
    });

    const retentionRate = cards.length > 0 ? Math.min(98, Math.round(75 + (mastered / cards.length) * 23)) : 85;

    return {
      dueToday,
      mastered,
      learning,
      total: cards.length,
      retentionRate,
      totalReps,
    };
  }, [cards]);

  return (
    <div id="flashcard-deck-studio" className="space-y-6">
      {/* Top Banner: Retention & SM-2 SRS Engine Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div id="stat-due-today" className="p-3.5 rounded-2xl bg-[#091822] border border-[#1a384a] flex items-center gap-3 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-[#7195a6] font-medium">Due for Review</div>
            <div className="text-base font-black text-white">{stats.dueToday} Cards</div>
          </div>
        </div>

        <div id="stat-mastered" className="p-3.5 rounded-2xl bg-[#091822] border border-[#1a384a] flex items-center gap-3 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-[#7195a6] font-medium">Mastered (21d+)</div>
            <div className="text-base font-black text-cyan-400">{stats.mastered} Cards</div>
          </div>
        </div>

        <div id="stat-learning" className="p-3.5 rounded-2xl bg-[#091822] border border-[#1a384a] flex items-center gap-3 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-[#7195a6] font-medium">Active Deck</div>
            <div className="text-base font-black text-white">{stats.total} Cards</div>
          </div>
        </div>

        <div id="stat-retention" className="p-3.5 rounded-2xl bg-[#091822] border border-[#1a384a] flex items-center gap-3 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-[#7195a6] font-medium">Est. Retention Rate</div>
            <div className="text-base font-black text-cyan-300">{stats.retentionRate}%</div>
          </div>
        </div>
      </div>

      {/* Control Header & Filters */}
      <div className="p-4 rounded-2xl bg-[#091822] border border-[#1a384a] flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md">
            <BrainCircuit className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <span>Active-Recall Flashcard Studio</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                SM-2 Engine
              </span>
            </h3>
            <p className="text-[11px] text-[#789cae] mt-0.5">
              Spaced repetition review cycles optimized for cognitive retention & deep mastery.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-ai-generate-cards"
            onClick={() => setShowAiModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-950/40 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <span>AI Flashcard Generator</span>
          </button>

          <button
            id="btn-create-card-manual"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-2 rounded-xl bg-[#122e3d] hover:bg-[#183a4c] text-cyan-300 border border-cyan-500/30 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Card</span>
          </button>

          <button
            id="btn-export-anki"
            onClick={handleExportAnki}
            className="p-2 rounded-xl bg-[#061117] hover:bg-[#0c1e28] text-[#7ea1b2] hover:text-white border border-[#142a38] text-xs transition-all"
            title="Export deck to Anki (.txt)"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#061117] border border-[#142a38] text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Selector */}
          <div className="flex items-center gap-1.5 bg-[#091822] px-3 py-1.5 rounded-xl border border-[#1a384a]">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentIndex(0);
              }}
              className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-[#091822] text-[#8db6c9]">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-[#091822] p-1 rounded-xl border border-[#1a384a]">
            <button
              onClick={() => setCardTypeFilter("all")}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                cardTypeFilter === "all" ? "bg-cyan-500 text-slate-950 font-black" : "text-[#7195a8]"
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setCardTypeFilter("concept")}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                cardTypeFilter === "concept" ? "bg-cyan-500 text-slate-950 font-black" : "text-[#7195a8]"
              }`}
            >
              Concept
            </button>
            <button
              onClick={() => setCardTypeFilter("cloze")}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                cardTypeFilter === "cloze" ? "bg-cyan-500 text-slate-950 font-black" : "text-[#7195a8]"
              }`}
            >
              Cloze
            </button>
            <button
              onClick={() => setCardTypeFilter("derivation")}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                cardTypeFilter === "derivation" ? "bg-cyan-500 text-slate-950 font-black" : "text-[#7195a8]"
              }`}
            >
              Derivation
            </button>
            <button
              onClick={() => setCardTypeFilter("drill")}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                cardTypeFilter === "drill" ? "bg-cyan-500 text-slate-950 font-black" : "text-[#7195a8]"
              }`}
            >
              Drill
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-[#5e8192] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentIndex(0);
            }}
            placeholder="Search cards..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#091822] border border-[#1a384a] text-white text-xs placeholder-[#5e8192] focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* CREATE CARD FORM */}
      {showAddForm && (
        <form
          onSubmit={handleCreateCard}
          className="p-5 rounded-3xl bg-[#061117] border border-[#193648] space-y-4 shadow-2xl text-xs animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-[#142a38] pb-3">
            <span className="font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              Create Custom Active-Recall Flashcard
            </span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-[#638797] hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[#7ea1b2] mb-1 font-semibold">Category / Course</label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g. CS101: Distributed Systems"
                className="w-full px-3 py-2 rounded-xl bg-[#07131a] border border-[#1b3d4f] text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>
            <div>
              <label className="block text-[#7ea1b2] mb-1 font-semibold">Card Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as CardType)}
                className="w-full px-3 py-2 rounded-xl bg-[#07131a] border border-[#1b3d4f] text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="concept">Concept Q&A</option>
                <option value="cloze">Cloze Deletion (Fill in Blank)</option>
                <option value="derivation">Mathematical Derivation</option>
                <option value="drill">Multiple Choice Drill</option>
              </select>
            </div>
            {newType === "cloze" && (
              <div>
                <label className="block text-[#7ea1b2] mb-1 font-semibold">Target Cloze Keyword</label>
                <input
                  type="text"
                  value={newClozeAnswer}
                  onChange={(e) => setNewClozeAnswer(e.target.value)}
                  placeholder="e.g. state machine safety"
                  className="w-full px-3 py-2 rounded-xl bg-[#07131a] border border-[#1b3d4f] text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-[#7ea1b2] mb-1 font-semibold">
              Front Side (Question, Prompt, or Sentence with {`{{blank}}`})
            </label>
            <input
              type="text"
              value={newFront}
              onChange={(e) => setNewFront(e.target.value)}
              placeholder="e.g. What does the Raft protocol guarantee regarding state machine safety?"
              className="w-full px-3 py-2 rounded-xl bg-[#07131a] border border-[#1b3d4f] text-white focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block text-[#7ea1b2] mb-1 font-semibold">Back Side (Detailed Explanation & Insights)</label>
            <textarea
              value={newBack}
              onChange={(e) => setNewBack(e.target.value)}
              placeholder="Provide a thorough, high-fidelity explanation supporting academic recall..."
              rows={3}
              className="w-full px-3 py-2 rounded-xl bg-[#07131a] border border-[#1b3d4f] text-white focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-black text-xs shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              Save Card to SRS Deck
            </button>
          </div>
        </form>
      )}

      {/* AI FLASHCARD GENERATOR MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c1a24] border border-[#1b3d4f] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-white animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#183646] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">AI Active-Recall Flashcard Generator</h3>
                  <p className="text-[10px] text-[#7195a8]">Deep semantic parser for academic syllabi & lecture notes</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-[#638797] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#7ea1b2] mb-1 font-semibold">Target Academic Course / Domain</label>
                <input
                  type="text"
                  value={aiSelectedCourse}
                  onChange={(e) => setAiSelectedCourse(e.target.value)}
                  placeholder="e.g. Raft Distributed Consensus & Fault Tolerance"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07131a] border border-[#1b3d4f] text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#7ea1b2] mb-1 font-semibold">Format Distribution</label>
                  <select
                    value={aiTargetType}
                    onChange={(e) => setAiTargetType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#07131a] border border-[#1b3d4f] text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="mixed">Mixed High-Yield Suite</option>
                    <option value="concept">Conceptual Q&A</option>
                    <option value="cloze">Cloze Deletions</option>
                    <option value="derivation">Mathematical Derivations</option>
                    <option value="drill">Active Multiple Choice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#7ea1b2] mb-1 font-semibold">Target Mastery Level</label>
                  <select
                    value={aiDifficulty}
                    onChange={(e) => setAiDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#07131a] border border-[#1b3d4f] text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="intro">Introductory Foundations</option>
                    <option value="mastery">Core Rigor & Application</option>
                    <option value="expert">Socratic Edge Cases & Proofs</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#7ea1b2] mb-1 font-semibold">
                  Source Text, Syllabus Excerpt, or Lecture Notes (Optional)
                </label>
                <textarea
                  value={aiSourceText}
                  onChange={(e) => setAiSourceText(e.target.value)}
                  placeholder="Paste lecture transcript, research abstract, or leave empty to auto-synthesize from course curriculum..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07131a] border border-[#1b3d4f] text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#183646] pt-4">
              <span className="text-[11px] text-[#7195a8]">
                Generates 4 high-yield active-recall cards
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-[#07131a] text-[#7195a8] hover:text-white border border-[#1b3d4f] text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteAiGeneration}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs shadow-lg flex items-center gap-1.5"
                >
                  {isGenerating ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing Cards...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Synthesize Deck</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE CARD STAGE */}
      {filteredCards.length > 0 && activeCard ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Card Wrapper with 3D Flip Effects */}
          <div
            id="active-flashcard-flip-stage"
            className="w-full min-h-[280px] cursor-pointer group relative perspective"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div
              className={`w-full h-full min-h-[280px] rounded-3xl border transition-all duration-500 transform preserve-3d relative flex flex-col justify-between p-6 shadow-2xl ${
                isFlipped
                  ? "rotate-y-180 bg-gradient-to-br from-[#0c2331] to-[#081720] border-cyan-500/40 shadow-cyan-950/20"
                  : "bg-gradient-to-br from-[#0a1c27] to-[#061117] border-[#1b3a4a] hover:border-cyan-500/40 shadow-cyan-950/20"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between select-none backface-hidden">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#122e3e] border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
                    {activeCard.category}
                  </span>
                  {activeCard.cardType && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono uppercase">
                      {activeCard.cardType}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleCardVoice();
                    }}
                    className={`p-1.5 rounded-xl border transition-all ${
                      isSpeaking
                        ? "bg-cyan-500 text-slate-950 border-cyan-400 animate-pulse"
                        : "bg-white/5 hover:bg-white/10 text-cyan-400 border-cyan-500/30"
                    }`}
                    title={isSpeaking ? "Stop Voice Narration" : "Listen via Petra AI Voice"}
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>

                  <span className="text-[10px] text-[#7196a8] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Interval: {activeCard.interval}d • Reps: {activeCard.repetitions}</span>
                  </span>
                </div>
              </div>

              {/* Card Body Front */}
              {!isFlipped ? (
                <div className="py-6 text-center select-none backface-hidden space-y-4">
                  {/* Front Text */}
                  {activeCard.cardType === "cloze" ? (
                    <div className="text-sm md:text-base font-black text-white leading-relaxed">
                      {activeCard.front.split(/\{\{(.*?)\}\}/g).map((chunk, idx) => {
                        if (idx % 2 === 1) {
                          return (
                            <span
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setRevealedCloze(!revealedCloze);
                              }}
                              className={`mx-1 px-2.5 py-0.5 rounded-lg border font-mono transition-all cursor-pointer ${
                                revealedCloze
                                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400"
                                  : "bg-[#143040] text-transparent border-cyan-500/40 hover:border-cyan-300"
                              }`}
                              title="Click to reveal cloze word"
                            >
                              {chunk}
                            </span>
                          );
                        }
                        return <span key={idx}>{chunk}</span>;
                      })}
                    </div>
                  ) : activeCard.cardType === "drill" && activeCard.options ? (
                    <div className="space-y-3 text-left">
                      <p className="text-sm md:text-base font-black text-white text-center">
                        {activeCard.front}
                      </p>
                      <div className="grid grid-cols-1 gap-2 pt-2">
                        {activeCard.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDrillOption(oIdx);
                            }}
                            className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                              selectedDrillOption === oIdx
                                ? oIdx === activeCard.correctOptionIndex
                                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 ring-1 ring-cyan-400"
                                  : "bg-cyan-500/20 text-cyan-300 border-cyan-400 ring-1 ring-cyan-400"
                                : "bg-[#08151c] text-[#8db2c5] border-[#183648] hover:border-cyan-500/30"
                            }`}
                          >
                            <span>{opt}</span>
                            {selectedDrillOption === oIdx && (
                              <span>
                                {oIdx === activeCard.correctOptionIndex ? "✓ Correct" : "✕ Check Back"}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm md:text-base font-black text-white leading-relaxed">
                      {activeCard.front}
                    </p>
                  )}

                  <p className="text-[10px] text-cyan-400 italic pt-2 animate-pulse flex items-center justify-center gap-1">
                    <span>Click or press</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono not-italic text-[9px]">Space</kbd>
                    <span>to flip and review key insights</span>
                  </p>
                </div>
              ) : (
                /* Card Body Back */
                <div className="py-6 text-left select-none rotate-y-180 backface-hidden">
                  <div className="p-4 rounded-2xl bg-[#061117]/90 border border-[#132d3d] text-xs leading-relaxed text-gray-200 space-y-2">
                    <p className="font-bold text-cyan-400 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-cyan-400" />
                      <span>Response & Key Academic Insights:</span>
                    </p>
                    <p className="text-white/90 leading-relaxed font-normal">{activeCard.back}</p>
                    {activeCard.clozeAnswer && (
                      <div className="pt-2 border-t border-[#132d3d] text-[11px] text-cyan-300">
                        <strong>Target Term:</strong> {activeCard.clozeAnswer}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Card Footer */}
              <div className="flex items-center justify-between border-t border-[#142a38]/60 pt-4 select-none backface-hidden">
                <span className="text-[10px] text-[#5e8192]">
                  Card {currentIndex + 1} of {filteredCards.length}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-[#5e8192]">
                  <span>Shortcuts:</span>
                  <kbd className="px-1 py-0.2 rounded bg-white/10 text-[9px] text-[#8db2c5]">Space</kbd>
                  <span>flip •</span>
                  <kbd className="px-1 py-0.2 rounded bg-white/10 text-[9px] text-[#8db2c5]">1-4</kbd>
                  <span>grade</span>
                </div>
              </div>
            </div>
          </div>

          {/* Spaced Repetition Grading Controls */}
          {isFlipped && (
            <div className="grid grid-cols-4 gap-2.5 bg-[#091822] p-3 rounded-2xl border border-[#1a384a] shadow-2xl animate-in slide-in-from-bottom-2 duration-200">
              <button
                id="rate-again-btn"
                onClick={() => handleRateCard(1)}
                className="py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex flex-col items-center justify-center hover:scale-105 active:scale-95"
              >
                <span>Again (1)</span>
                <span className="text-[9px] text-cyan-400/80 font-normal mt-0.5">1 day • Reset</span>
              </button>

              <button
                id="rate-hard-btn"
                onClick={() => handleRateCard(2)}
                className="py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex flex-col items-center justify-center hover:scale-105 active:scale-95"
              >
                <span>Hard (2)</span>
                <span className="text-[9px] text-cyan-400/80 font-normal mt-0.5">
                  {Math.max(1, Math.round(activeCard.interval * 1.2))}d
                </span>
              </button>

              <button
                id="rate-good-btn"
                onClick={() => handleRateCard(3)}
                className="py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex flex-col items-center justify-center hover:scale-105 active:scale-95"
              >
                <span>Good (3)</span>
                <span className="text-[9px] text-cyan-400/80 font-normal mt-0.5">
                  {activeCard.repetitions === 0 ? "1d" : `${Math.round(activeCard.interval * activeCard.easeFactor)}d`}
                </span>
              </button>

              <button
                id="rate-easy-btn"
                onClick={() => handleRateCard(4)}
                className="py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all flex flex-col items-center justify-center hover:scale-105 active:scale-95"
              >
                <span>Easy (4)</span>
                <span className="text-[9px] text-cyan-400/80 font-normal mt-0.5">
                  {Math.round(activeCard.interval * activeCard.easeFactor * 1.3)}d • Mastery
                </span>
              </button>
            </div>
          )}

          {/* Slider Navigation & Quick Deletion */}
          <div className="flex items-center justify-between px-2 text-xs">
            <button
              onClick={() => {
                setIsFlipped(false);
                setTimeout(() => {
                  setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredCards.length - 1));
                }, 100);
              }}
              className="p-2.5 rounded-xl text-cyan-400 hover:text-cyan-300 bg-[#091822] border border-[#1a384a] flex items-center gap-1 font-bold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => handleDeleteCard(activeCard.id)}
              className="p-2 rounded-xl text-cyan-400/80 hover:text-cyan-300 bg-[#091822]/40 border border-cyan-500/20 flex items-center gap-1.5 text-[11px]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <button
              onClick={() => {
                setIsFlipped(false);
                setTimeout(() => {
                  setCurrentIndex((prev) => (prev + 1 < filteredCards.length ? prev + 1 : 0));
                }, 100);
              }}
              className="p-2.5 rounded-xl text-cyan-400 hover:text-cyan-300 bg-[#091822] border border-[#1a384a] flex items-center gap-1 font-bold"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-12 rounded-3xl border border-dashed border-[#1a384a] text-center text-[#7ea1b2] text-xs space-y-3 bg-[#091822]/20">
          <HelpCircle className="w-10 h-10 text-cyan-400 mx-auto animate-bounce" />
          <p className="text-white font-bold">No active flashcards found matching the selected filters.</p>
          <p className="text-[#7195a8]">Use the AI Flashcard Generator to synthesize new cards or create one manually.</p>
          <button
            onClick={() => setShowAiModal(true)}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg mt-2 inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Generate Cards with AI</span>
          </button>
        </div>
      )}
    </div>
  );
};
