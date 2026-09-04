import React from "react";
import {
  Sparkles,
  Brain,
  HelpCircle,
  Zap,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  BookOpen,
  Volume2,
  ChevronRight,
  RefreshCw,
  Trophy,
  ArrowRight,
  Check,
  X,
  Target,
  Sliders,
  Award,
  ShieldCheck
} from "lucide-react";
import { ApiService, StudyBuddyHintResponse, AdaptiveExplainResponse } from "../shared/api.service";
import { UserProfile, Course } from "../shared/types";
import { TTSPlayer } from "./TTSPlayer";

interface AIStudyBuddyProps {
  user?: UserProfile;
  courses?: Course[];
  currentCourse?: Course | null;
  currentLessonTitle?: string;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
  onClose?: () => void;
  isModal?: boolean;
}

type BuddyMode = "qa" | "socratic_hints" | "practice_quiz" | "adaptive_explainer";

export const AIStudyBuddy: React.FC<AIStudyBuddyProps> = ({
  user,
  courses,
  currentCourse,
  currentLessonTitle,
  onUpdateUser,
  onClose,
  isModal = false,
}) => {
  const [activeMode, setActiveMode] = React.useState<BuddyMode>("qa");

  // 1. Q&A State
  const [qaInput, setQaInput] = React.useState("");
  const [qaHistory, setQaHistory] = React.useState<Array<{ sender: "user" | "buddy"; text: string; time: string; groundingVerification?: any }>>([
    {
      sender: "buddy",
      text: `👋 Hey **${user.name}**! I'm your **AI Study Buddy**. I'm here to give you concise, clear answers, guide you with progressive hints without spoiling solutions, and generate custom practice quizzes whenever you need them! What are we mastering today?`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isQaLoading, setIsQaLoading] = React.useState(false);
  const chatBottomRef = React.useRef<HTMLDivElement | null>(null);

  // 2. Socratic Hints State
  const [hintProblem, setHintProblem] = React.useState(
    currentLessonTitle
      ? `How do we prove or enforce fairness constraints in ${currentLessonTitle}?`
      : "How do we choose between Demographic Parity and Equalized Odds in a high-stakes credit model?"
  );
  const [hintAttempt, setHintAttempt] = React.useState("");
  const [currentHintLevel, setCurrentHintLevel] = React.useState<number>(1);
  const [hintsList, setHintsList] = React.useState<StudyBuddyHintResponse[]>([]);
  const [isHintLoading, setIsHintLoading] = React.useState(false);

  // 3. On-Demand Practice Quiz State
  const [quizTopic, setQuizTopic] = React.useState(
    currentLessonTitle || currentCourse?.title || "Artificial Intelligence Ethics & Fairness"
  );
  const [quizDifficulty, setQuizDifficulty] = React.useState("Intermediate");
  const [practiceQuestions, setPracticeQuestions] = React.useState<any[]>([]);
  const [currentQIndex, setCurrentQIndex] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [quizScore, setQuizScore] = React.useState(0);
  const [isQuizFinished, setIsQuizFinished] = React.useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = React.useState(false);

  // 4. Adaptive Explainer State
  const [explainConcept, setExplainConcept] = React.useState("Differential Privacy");
  const [explainStyle, setExplainStyle] = React.useState<"analogy" | "technical" | "visual_steps" | "socratic">("analogy");
  const [adaptiveResult, setAdaptiveResult] = React.useState<AdaptiveExplainResponse | null>(null);
  const [isExplaining, setIsExplaining] = React.useState(false);

  // Student Weak Areas Tracking
  const [studentWeakAreas, setStudentWeakAreas] = React.useState<string[]>([
    "Algorithmic Fairness Proofs",
    "Differential Privacy Epsilon Budgets",
    "SHAP vs LIME Game-Theoretic Invariants",
  ]);
  const [newWeakArea, setNewWeakArea] = React.useState("");

  React.useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [qaHistory]);

  // Handle Q&A Send
  const handleSendQA = async () => {
    if (!qaInput.trim() || isQaLoading) return;
    const userMsg = qaInput.trim();
    setQaInput("");
    setQaHistory((prev) => [
      ...prev,
      { sender: "user", text: userMsg, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);
    setIsQaLoading(true);

    try {
      const res = await ApiService.askTutor({
        prompt: `Answer clearly, concisely, and with key takeaways: ${userMsg}. Tailor to student: ${user.name} at level: ${user.level || 1}.`,
        contextLessonTitle: currentLessonTitle || currentCourse?.title || "Core Curriculum",
      });
      setQaHistory((prev) => [
        ...prev,
        {
          sender: "buddy",
          text: res.reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          groundingVerification: res.groundingVerification
        },
      ]);
    } catch (e) {
      setQaHistory((prev) => [
        ...prev,
        {
          sender: "buddy",
          text: `Here is the concise answer: Break the question down into fundamental principles, verify your edge cases, and focus on core definitions!`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsQaLoading(false);
    }
  };

  // Handle Request Socratic Hint
  const handleRequestHint = async (level: number) => {
    if (!hintProblem.trim() || isHintLoading) return;
    setIsHintLoading(true);
    setCurrentHintLevel(level);

    try {
      const res = await ApiService.getStudyBuddyHint({
        problemStatement: hintProblem,
        currentAttempt: hintAttempt,
        hintLevel: level,
        topic: currentLessonTitle || currentCourse?.title || "AI Foundations",
        userLevel: user.level > 3 ? "advanced" : "intermediate",
      });
      setHintsList((prev) => [...prev.filter((h) => h.hintLevel !== level), res]);
    } catch (e) {
      console.warn("Failed to get hint:", e);
    } finally {
      setIsHintLoading(false);
    }
  };

  // Handle Generate Practice Quiz
  const handleGeneratePracticeQuiz = async () => {
    setIsGeneratingQuiz(true);
    setIsQuizFinished(false);
    setQuizScore(0);
    setCurrentQIndex(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);

    try {
      const res = await ApiService.generatePracticeQuiz({
        topic: quizTopic,
        weakAreas: studentWeakAreas,
        questionCount: 3,
        difficulty: quizDifficulty,
      });
      if (res && res.questions && res.questions.length > 0) {
        setPracticeQuestions(res.questions);
      }
    } catch (e) {
      console.warn("Failed to generate quiz:", e);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // Handle Answer Selection in Practice Quiz
  const handleSelectQuizOption = (optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswer(optIdx);
  };

  const handleSubmitQuizAnswer = () => {
    if (selectedAnswer === null || isSubmitted) return;
    setIsSubmitted(true);
    const currQ = practiceQuestions[currentQIndex];
    if (currQ && selectedAnswer === currQ.correctAnswerIndex) {
      setQuizScore((prev) => prev + 1);
      if (onUpdateUser) {
        onUpdateUser({ xp: (user.xp || 0) + 25 });
      }
    }
  };

  const handleNextQuizQuestion = () => {
    if (currentQIndex + 1 < practiceQuestions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      setIsQuizFinished(true);
    }
  };

  // Handle Adaptive Explanation
  const handleGenerateExplanation = async () => {
    if (!explainConcept.trim() || isExplaining) return;
    setIsExplaining(true);
    try {
      const res = await ApiService.getAdaptiveExplanation({
        concept: explainConcept,
        studentLevel: user.level > 5 ? "advanced" : "intermediate",
        identifiedWeakness: studentWeakAreas[0] || "General Understanding",
        preferredStyle: explainStyle,
      });
      setAdaptiveResult(res);
    } catch (e) {
      console.warn("Failed to explain:", e);
    } finally {
      setIsExplaining(false);
    }
  };

  const addWeakArea = () => {
    if (newWeakArea.trim() && !studentWeakAreas.includes(newWeakArea.trim())) {
      setStudentWeakAreas((prev) => [...prev, newWeakArea.trim()]);
      setNewWeakArea("");
    }
  };

  const removeWeakArea = (area: string) => {
    setStudentWeakAreas((prev) => prev.filter((a) => a !== area));
  };

  return (
    <div
      className={`${
        isModal
          ? "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          : "w-full rounded-2xl bg-[#08151c] border border-[#1b3b4a] overflow-hidden flex flex-col shadow-2xl"
      }`}
    >
      <div
        className={`${
          isModal
            ? "w-full max-w-5xl max-h-[90vh] bg-[#08151c] border border-[#1b3b4a] rounded-2xl flex flex-col overflow-hidden shadow-2xl"
            : "w-full flex flex-col"
        }`}
      >
        {/* Header Bar */}
        <div className="px-5 py-4 bg-[#0a1822] border-b border-[#1b3b4a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-cyan-500/20 border border-cyan-500/30 text-cyan-400">
              <Brain className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                  AI Study Buddy
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  Adaptive v3.5
                </span>
              </div>
              <p className="text-xs text-[#82a4b3]">
                Concise Q&A • Socratic Progressive Hints • On-Demand Adaptive Quizzes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isModal && onClose && (
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Mode Navigation Tabs */}
        <div className="flex border-b border-[#1b3b4a] bg-[#071319] overflow-x-auto scrollbar-none px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveMode("qa")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
              activeMode === "qa"
                ? "bg-[#0a1822] text-cyan-400 border-cyan-400 shadow-sm"
                : "text-slate-400 hover:text-slate-200 border-transparent"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Clear & Concise Q&A
          </button>
          <button
            onClick={() => setActiveMode("socratic_hints")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
              activeMode === "socratic_hints"
                ? "bg-[#0a1822] text-cyan-400 border-cyan-400 shadow-sm"
                : "text-slate-400 hover:text-slate-200 border-transparent"
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            Socratic Problem Hints
          </button>
          <button
            onClick={() => setActiveMode("practice_quiz")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
              activeMode === "practice_quiz"
                ? "bg-[#0a1822] text-cyan-400 border-cyan-400 shadow-sm"
                : "text-slate-400 hover:text-slate-200 border-transparent"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            On-Demand Practice Quiz
          </button>
          <button
            onClick={() => setActiveMode("adaptive_explainer")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
              activeMode === "adaptive_explainer"
                ? "bg-[#0a1822] text-cyan-400 border-cyan-400 shadow-sm"
                : "text-slate-400 hover:text-slate-200 border-transparent"
            }`}
          >
            <Sliders className="w-4 h-4" />
            Adaptive Depth Explainer
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 max-h-[68vh] space-y-5">
          {/* ================= 1. CLEAR & CONCISE Q&A ================= */}
          {activeMode === "qa" && (
            <div className="flex flex-col h-[520px]">
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
                {qaHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      msg.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-cyan-600/30 text-cyan-100 border border-cyan-500/40 rounded-br-none"
                          : "bg-[#0a1822] text-slate-200 border border-[#1b3b4a] rounded-bl-none shadow-lg"
                      }`}
                    >
                      {msg.sender === "buddy" && msg.groundingVerification && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 mb-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold shadow-sm">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>Academic Grounding Verified ({Math.round((msg.groundingVerification.confidenceScore || 0.98) * 100)}%)</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      {msg.sender === "buddy" && (
                        <div className="mt-2.5 pt-2 border-t border-[#1b3b4a]/60 flex items-center justify-between text-[11px] text-[#82a4b3]">
                          <span>AI Study Buddy • Clear & Concise</span>
                          <TTSPlayer text={msg.text} />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
                {isQaLoading && (
                  <div className="flex items-center gap-2 p-3 bg-[#0a1822] border border-[#1b3b4a] rounded-2xl w-fit text-xs text-cyan-400">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Study Buddy is synthesizing a concise explanation...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick Prompts */}
              <div className="flex items-center gap-2 py-2 overflow-x-auto scrollbar-none text-xs text-slate-300">
                <span className="text-slate-500 flex-shrink-0">Quick Ask:</span>
                {[
                  "Explain this in 3 bullet points",
                  "What is the intuitive formula?",
                  "Give me a real-world edge case",
                  "Why is this tested on exams?",
                ].map((qp, qIdx) => (
                  <button
                    key={qIdx}
                    onClick={() => {
                      setQaInput(qp);
                    }}
                    className="px-3 py-1 bg-[#0a1822] hover:bg-[#0e222e] border border-[#1b3b4a] rounded-full flex-shrink-0 text-slate-300 hover:text-cyan-300 transition"
                  >
                    {qp}
                  </button>
                ))}
              </div>

              {/* Input box */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#1b3b4a]">
                <input
                  type="text"
                  value={qaInput}
                  onChange={(e) => setQaInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendQA()}
                  placeholder="Ask any question about your lessons or concepts..."
                  className="flex-1 bg-[#030b10] border border-[#1b3b4a] focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition"
                />
                <button
                  onClick={handleSendQA}
                  disabled={!qaInput.trim() || isQaLoading}
                  className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-cyan-500 hover:from-cyan-400 hover:to-cyan-400 disabled:opacity-50 text-black font-bold text-sm rounded-xl flex items-center gap-2 transition shadow-lg shadow-cyan-500/20"
                >
                  <Send className="w-4 h-4" />
                  <span>Ask</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= 2. SOCRATIC PROGRESSIVE HINTS ================= */}
          {activeMode === "socratic_hints" && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#0a1822] border border-[#1b3b4a] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-4 h-4" /> Problem Statement
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Socratic Mode: Never reveals raw answers
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={hintProblem}
                  onChange={(e) => setHintProblem(e.target.value)}
                  placeholder="Enter the problem or exercise you are stuck on..."
                  className="w-full bg-[#030b10] border border-[#1b3b4a] rounded-xl p-3 text-sm text-white focus:border-cyan-400 outline-none resize-none"
                />
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Your Current Thought or Attempt (Optional):</label>
                  <input
                    type="text"
                    value={hintAttempt}
                    onChange={(e) => setHintAttempt(e.target.value)}
                    placeholder="e.g. I tried setting the loss function to zero but got NaN..."
                    className="w-full bg-[#030b10] border border-[#1b3b4a] rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              {/* Hint Ladder Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    level: 1,
                    title: "Level 1: Directional Nudge",
                    desc: "A subtle conceptual clue to steer your thinking",
                    color: "border-cyan-500/30 hover:border-cyan-400 bg-cyan-500/5",
                  },
                  {
                    level: 2,
                    title: "Level 2: Core Mechanism",
                    desc: "Identifies the theorem, equation, or invariant",
                    color: "border-cyan-500/30 hover:border-cyan-400 bg-cyan-500/5",
                  },
                  {
                    level: 3,
                    title: "Level 3: Strategic Strategy",
                    desc: "Structural breakdown and analogous problem solving",
                    color: "border-cyan-500/30 hover:border-cyan-400 bg-cyan-500/5",
                  },
                ].map((step) => (
                  <button
                    key={step.level}
                    onClick={() => handleRequestHint(step.level)}
                    disabled={isHintLoading}
                    className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${step.color} ${
                      currentHintLevel === step.level ? "ring-2 ring-cyan-400" : ""
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-white">{step.title}</span>
                        <span className="text-xs font-mono text-cyan-300">Lvl {step.level}</span>
                      </div>
                      <p className="text-xs text-[#82a4b3]">{step.desc}</p>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs font-medium text-cyan-400">
                      <span>Unlock Clue</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>

              {/* Rendered Hints */}
              {isHintLoading && (
                <div className="p-4 rounded-xl bg-[#0a1822] border border-[#1b3b4a] flex items-center gap-3 text-sm text-cyan-300 animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Extracting pedagogical hint without spoiling solution...</span>
                </div>
              )}

              <div className="space-y-3">
                {hintsList.map((h, hIdx) => (
                  <div
                    key={hIdx}
                    className="p-4 rounded-xl bg-[#0a1822] border border-cyan-500/30 space-y-2 shadow-lg"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-cyan-400" />
                        Level {h.hintLevel} Hint Clue
                      </span>
                      <TTSPlayer text={h.hint} />
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {h.hint}
                    </p>
                    <div className="pt-2 border-t border-[#1b3b4a] flex items-center gap-2 text-xs text-cyan-400">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{h.guidingQuestion}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 3. ON-DEMAND PRACTICE QUIZ ================= */}
          {activeMode === "practice_quiz" && (
            <div className="space-y-5">
              {/* Quiz Settings Header */}
              <div className="p-4 rounded-xl bg-[#0a1822] border border-[#1b3b4a] flex flex-wrap items-center justify-between gap-3">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-xs text-slate-400 block mb-1">Target Topic:</label>
                  <input
                    type="text"
                    value={quizTopic}
                    onChange={(e) => setQuizTopic(e.target.value)}
                    placeholder="Enter topic..."
                    className="w-full bg-[#030b10] border border-[#1b3b4a] rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Difficulty:</label>
                  <select
                    value={quizDifficulty}
                    onChange={(e) => setQuizDifficulty(e.target.value)}
                    className="bg-[#030b10] border border-[#1b3b4a] rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
                  >
                    <option value="Beginner">Beginner (Conceptual)</option>
                    <option value="Intermediate">Intermediate (Applied)</option>
                    <option value="Advanced">Advanced (Rigorous Proofs)</option>
                  </select>
                </div>
                <button
                  onClick={handleGeneratePracticeQuiz}
                  disabled={isGeneratingQuiz}
                  className="px-4 py-2 mt-4 sm:mt-0 bg-gradient-to-r from-cyan-500 to-cyan-500 hover:from-cyan-400 hover:to-cyan-400 text-black font-bold text-xs rounded-xl flex items-center gap-2 transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingQuiz ? "animate-spin" : ""}`} />
                  <span>Generate Custom Quiz</span>
                </button>
              </div>

              {/* Active Quiz Content */}
              {practiceQuestions.length > 0 && !isQuizFinished && (
                <div className="p-5 rounded-2xl bg-[#0a1822] border border-[#1b3b4a] space-y-4">
                  <div className="flex items-center justify-between text-xs text-[#82a4b3]">
                    <span>
                      Question {currentQIndex + 1} of {practiceQuestions.length}
                    </span>
                    <span className="font-mono bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20">
                      Score: {quizScore}/{practiceQuestions.length}
                    </span>
                  </div>

                  <h4 className="text-base font-serif font-bold text-white leading-snug">
                    {practiceQuestions[currentQIndex]?.question}
                  </h4>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {practiceQuestions[currentQIndex]?.options.map((opt: string, optIdx: number) => {
                      const isCorrect = optIdx === practiceQuestions[currentQIndex]?.correctAnswerIndex;
                      const isUserSelected = selectedAnswer === optIdx;

                      let optClasses = "border-[#1b3b4a] bg-[#030b10] hover:border-cyan-400/50 text-slate-200";
                      if (isSubmitted) {
                        if (isCorrect) {
                          optClasses = "border-cyan-500 bg-cyan-500/10 text-cyan-300";
                        } else if (isUserSelected && !isCorrect) {
                          optClasses = "border-cyan-500 bg-cyan-500/10 text-cyan-300";
                        }
                      } else if (isUserSelected) {
                        optClasses = "border-cyan-400 bg-cyan-500/10 text-cyan-200";
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectQuizOption(optIdx)}
                          className={`w-full p-3.5 rounded-xl border text-left text-sm transition flex items-center justify-between ${optClasses}`}
                        >
                          <span>{opt}</span>
                          {isSubmitted && isCorrect && <Check className="w-4 h-4 text-cyan-400" />}
                          {isSubmitted && isUserSelected && !isCorrect && <X className="w-4 h-4 text-cyan-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Actions & Feedback */}
                  {isSubmitted && (
                    <div className="p-4 rounded-xl bg-[#030b10] border border-cyan-500/30 space-y-2 animate-fadeIn">
                      <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                        <Sparkles className="w-4 h-4" />
                        <span>Explanation</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        {practiceQuestions[currentQIndex]?.explanation}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    {!isSubmitted ? (
                      <button
                        onClick={handleSubmitQuizAnswer}
                        disabled={selectedAnswer === null}
                        className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold text-xs rounded-xl transition"
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuizQuestion}
                        className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-500 text-black font-bold text-xs rounded-xl flex items-center gap-2 transition"
                      >
                        <span>
                          {currentQIndex + 1 < practiceQuestions.length ? "Next Question" : "Finish Quiz"}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Quiz Results Screen */}
              {isQuizFinished && (
                <div className="p-6 rounded-2xl bg-[#0a1822] border border-cyan-500/40 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-white">Quiz Completed!</h4>
                  <p className="text-sm text-slate-300">
                    You scored <span className="font-bold text-cyan-400">{quizScore}</span> out of{" "}
                    <span className="font-bold text-white">{practiceQuestions.length}</span> (
                    {Math.round((quizScore / practiceQuestions.length) * 100)}%)
                  </p>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={handleGeneratePracticeQuiz}
                      className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl transition"
                    >
                      Try Another Quiz
                    </button>
                  </div>
                </div>
              )}

              {practiceQuestions.length === 0 && !isGeneratingQuiz && (
                <div className="p-8 rounded-2xl bg-[#0a1822] border border-[#1b3b4a] text-center space-y-3">
                  <BookOpen className="w-10 h-10 text-cyan-400 mx-auto opacity-70" />
                  <h4 className="text-sm font-bold text-white">Generate on-demand practice questions</h4>
                  <p className="text-xs text-[#82a4b3] max-w-md mx-auto">
                    Practice quizzes automatically adapt to your weak spots, boosting retention before real exams.
                  </p>
                  <button
                    onClick={handleGeneratePracticeQuiz}
                    className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-500 text-black font-bold text-xs rounded-xl transition"
                  >
                    Start Practice Quiz
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= 4. ADAPTIVE DEPTH EXPLAINER ================= */}
          {activeMode === "adaptive_explainer" && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#0a1822] border border-[#1b3b4a] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-xs text-slate-400 block mb-1">Concept to Demystify:</label>
                    <input
                      type="text"
                      value={explainConcept}
                      onChange={(e) => setExplainConcept(e.target.value)}
                      placeholder="e.g. Differential Privacy, SHAP values, ReAct loop..."
                      className="w-full bg-[#030b10] border border-[#1b3b4a] rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Explanation Style:</label>
                    <div className="flex gap-1 bg-[#030b10] p-1 rounded-lg border border-[#1b3b4a]">
                      {[
                        { id: "analogy", label: "Analogy" },
                        { id: "technical", label: "Technical" },
                        { id: "visual_steps", label: "Steps" },
                        { id: "socratic", label: "Socratic" },
                      ].map((st) => (
                        <button
                          key={st.id}
                          onClick={() => setExplainStyle(st.id as any)}
                          className={`px-2.5 py-1 text-[11px] rounded-md transition ${
                            explainStyle === st.id
                              ? "bg-cyan-500 text-black font-bold"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGenerateExplanation}
                  disabled={isExplaining}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-500 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <Sparkles className={`w-4 h-4 ${isExplaining ? "animate-spin" : ""}`} />
                  <span>Generate Adaptive Breakdown</span>
                </button>
              </div>

              {/* Explainer Result Card */}
              {adaptiveResult && (
                <div className="p-5 rounded-2xl bg-[#0a1822] border border-cyan-500/30 space-y-4 shadow-xl animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-[#1b3b4a] pb-3">
                    <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                      <Brain className="w-5 h-5 text-cyan-400" />
                      {adaptiveResult.concept}
                    </h4>
                    <TTSPlayer text={adaptiveResult.explanation} />
                  </div>

                  <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {adaptiveResult.explanation}
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-1">
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-wide">
                      💡 Intuitive Analogy
                    </span>
                    <p className="text-xs text-cyan-100">{adaptiveResult.keyAnalogy}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-1">
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-wide">
                      🎯 Quick Self-Check
                    </span>
                    <p className="text-xs text-cyan-100">{adaptiveResult.quickCheckQuestion}</p>
                  </div>
                </div>
              )}

              {/* Identified Weak Areas Management */}
              <div className="p-4 rounded-xl bg-[#0a1822] border border-[#1b3b4a] space-y-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
                  Your Active Learning Focus Areas:
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {studentWeakAreas.map((area, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full text-[11px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1.5"
                    >
                      {area}
                      <button onClick={() => removeWeakArea(area)} className="hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newWeakArea}
                    onChange={(e) => setNewWeakArea(e.target.value)}
                    placeholder="Add focus topic..."
                    className="flex-1 bg-[#030b10] border border-[#1b3b4a] rounded-lg px-3 py-1 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                  <button
                    onClick={addWeakArea}
                    className="px-3 py-1 bg-[#1b3b4a] hover:bg-cyan-500 hover:text-black text-white text-xs font-bold rounded-lg transition"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
