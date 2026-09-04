import React from "react";
import confetti from "canvas-confetti";
import {
  Brain,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  Flame,
  Award,
  ChevronRight,
  Lightbulb,
  MessageSquare,
  Volume2,
  VolumeX,
  Gauge,
  Sliders,
  ShieldCheck,
  Check,
  X,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { AdaptiveLevel, QuizQuestion, Course, Lesson } from "../shared/types";
import { QuizEngine, GeneratedQuizQuestion } from "../services/QuizEngine";
import { toastService } from "../services/toastService";

export interface AdaptiveQuizEngineProps {
  courseTitle: string;
  lessonTitle: string;
  lessonContent?: string;
  initialQuestions?: QuizQuestion[];
  initialAdaptiveLevel?: AdaptiveLevel;
  onCompleteQuiz?: (results: {
    score: number;
    percentage: number;
    totalQuestions: number;
    correctCount: number;
    finalAdaptiveTier: AdaptiveLevel;
    earnedXp: number;
  }) => void;
  onClose?: () => void;
}

interface SocraticHintState {
  revealedLevel: number; // 0: none, 1: conceptual prompt, 2: elimination hint, 3: full breakdown
  hints: string[];
}

export const AdaptiveQuizEngine: React.FC<AdaptiveQuizEngineProps> = ({
  courseTitle,
  lessonTitle,
  lessonContent = "",
  initialQuestions = [],
  initialAdaptiveLevel = "standard",
  onCompleteQuiz,
  onClose,
}) => {
  // Adaptive State
  const [currentTier, setCurrentTier] = React.useState<AdaptiveLevel>(initialAdaptiveLevel);
  const [streak, setStreak] = React.useState<number>(0);
  const [highestStreak, setHighestStreak] = React.useState<number>(0);
  const [totalAnswered, setTotalAnswered] = React.useState<number>(0);
  const [correctAnswersCount, setCorrectAnswersCount] = React.useState<number>(0);
  const [earnedXp, setEarnedXp] = React.useState<number>(0);
  const [isGeneratingNext, setIsGeneratingNext] = React.useState<boolean>(false);

  // Question Bank & Flow
  const [questions, setQuestions] = React.useState<Array<QuizQuestion | GeneratedQuizQuestion>>([]);
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [isEvaluated, setIsEvaluated] = React.useState<boolean>(false);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);
  const [isQuizCompleted, setIsQuizCompleted] = React.useState<boolean>(false);

  // Socratic Hint Engine
  const [socraticState, setSocraticState] = React.useState<SocraticHintState>({
    revealedLevel: 0,
    hints: [],
  });
  const [showSocraticPanel, setShowSocraticPanel] = React.useState<boolean>(false);
  const [audioFeedbackEnabled, setAudioFeedbackEnabled] = React.useState<boolean>(true);

  // History tracking for review
  const [questionHistory, setQuestionHistory] = React.useState<
    Array<{
      question: string;
      selectedOption: number;
      correctAnswerIndex: number;
      isCorrect: boolean;
      difficulty: string;
      explanation: string;
      options: string[];
    }>
  >([]);

  // Initialize questions
  React.useEffect(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      setQuestions(initialQuestions);
    } else {
      // Seed default dynamic questions
      generateInitialBank();
    }
  }, [initialQuestions]);

  const generateInitialBank = async () => {
    setIsGeneratingNext(true);
    try {
      const generated = await QuizEngine.generateQuiz(lessonTitle, lessonContent, currentTier);
      setQuestions(generated);
    } catch (err) {
      console.warn("Quiz generation fallback used:", err);
    } finally {
      setIsGeneratingNext(false);
    }
  };

  const currentQuestion = questions[currentIndex];

  // Dynamic Tier Metadata
  const tierConfig: Record<
    AdaptiveLevel,
    { label: string; color: string; bg: string; border: string; multiplier: number; icon: string }
  > = {
    remedial: {
      label: "Foundational & Scaffolding",
      color: "text-blue-300",
      bg: "bg-blue-500/10",
      border: "border-blue-500/40",
      multiplier: 1.0,
      icon: "🌱",
    },
    standard: {
      label: "Core Conceptual",
      color: "text-cyan-300",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/40",
      multiplier: 1.5,
      icon: "🎯",
    },
    accelerated: {
      label: "Advanced Synthesis",
      color: "text-blue-400",
      bg: "bg-blue-600/10",
      border: "border-blue-600/40",
      multiplier: 2.0,
      icon: "⚡",
    },
    mastery: {
      label: "Expert Cognitive Challenge",
      color: "text-cyan-400",
      bg: "bg-cyan-600/10",
      border: "border-cyan-600/40",
      multiplier: 3.0,
      icon: "👑",
    },
  };

  // Generate Socratic hints based on question content & incorrect selection
  const buildSocraticHints = (q: QuizQuestion | GeneratedQuizQuestion, selectedIdx: number) => {
    const wrongText = q.options[selectedIdx] || "selected option";
    const correctIdx = q.correctAnswerIndex;
    const correctText = q.options[correctIdx];

    const hints = [
      `💡 **Socratic Clue 1 (Perspective Shift)**: Notice what makes "${wrongText}" tempting. Does it confuse a prerequisite symptom with the primary architectural cause?`,
      `🔍 **Socratic Clue 2 (Key Distinctions)**: Consider the boundary conditions in ${lessonTitle}. Look closely at the options: which one directly governs deterministic execution without side effects?`,
      `🎯 **Socratic Clue 3 (Guided Deduction)**: The correct principle relates to **${correctText.slice(0, 30)}...**. Think about how this aligns with the lesson's core takeaways.`,
    ];
    return hints;
  };

  // Voice narration of feedback / Socratic prompts
  const playVoiceFeedback = (text: string) => {
    if (!audioFeedbackEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#`]/g, ""));
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Audio speech ignocyan if blocked
    }
  };

  // Handle Option Selection & Real-Time Evaluation
  const handleSelectOption = (index: number) => {
    if (isEvaluated) return;
    setSelectedOption(index);
  };

  const handleEvaluateAnswer = () => {
    if (selectedOption === null || !currentQuestion || isEvaluated) return;

    const correct = selectedOption === currentQuestion.correctAnswerIndex;
    setIsEvaluated(true);
    setIsCorrect(correct);
    setTotalAnswered((prev) => prev + 1);

    // Record question in history
    setQuestionHistory((prev) => [
      ...prev,
      {
        question: currentQuestion.question,
        selectedOption,
        correctAnswerIndex: currentQuestion.correctAnswerIndex,
        isCorrect: correct,
        difficulty: currentTier,
        explanation: currentQuestion.explanation,
        options: currentQuestion.options,
      },
    ]);

    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > highestStreak) setHighestStreak(newStreak);
      setCorrectAnswersCount((prev) => prev + 1);

      // Compute dynamic XP with streak bonus & tier multiplier
      const basePoints = 50;
      const streakBonus = Math.min(newStreak * 10, 50);
      const pointsGained = Math.round((basePoints + streakBonus) * tierConfig[currentTier].multiplier);
      setEarnedXp((prev) => prev + pointsGained);

      // Check adaptive level promotion
      if (newStreak >= 2) {
        if (currentTier === "remedial") {
          setCurrentTier("standard");
          toastService.success("Difficulty Increased: Promoted to Core Conceptual Tier!");
        } else if (currentTier === "standard") {
          setCurrentTier("accelerated");
          toastService.success("Difficulty Increased: Promoted to Advanced Synthesis Tier! (2x XP)");
        } else if (currentTier === "accelerated") {
          setCurrentTier("mastery");
          toastService.success("Mastery Tier Unlocked! Maximum 3x XP multiplier active!");
        }
      }

      // Celebratory Confetti
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#22d3ee", "#0891b2", "#38bdf8", "#0e7490"],
      });

      playVoiceFeedback(`Correct! ${currentQuestion.explanation}`);
    } else {
      // Incorrect Answer Handling
      setStreak(0);
      const hints = buildSocraticHints(currentQuestion, selectedOption);
      setSocraticState({
        revealedLevel: 1,
        hints,
      });
      setShowSocraticPanel(true);

      // Adaptive difficulty relaxation if consecutive errors
      if (currentTier === "mastery") {
        setCurrentTier("accelerated");
      } else if (currentTier === "accelerated") {
        setCurrentTier("standard");
      } else if (currentTier === "standard") {
        setCurrentTier("remedial");
        toastService.info("Adaptive Scaffolding Activated: Simplifying upcoming concepts.");
      }

      playVoiceFeedback(
        `Let's analyze this with a Socratic hint. ${hints[0]}`
      );
    }
  };

  // Move to next question or generate next adaptive challenge
  const handleNextQuestion = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      resetQuestionState();
    } else {
      // Check if student wants more challenges or finish
      finishQuiz();
    }
  };

  const handleSynthesizeMoreQuestions = async () => {
    setIsGeneratingNext(true);
    try {
      const more = await QuizEngine.generateQuiz(lessonTitle, lessonContent, currentTier);
      setQuestions((prev) => [...prev, ...more]);
      setCurrentIndex((prev) => prev + 1);
      resetQuestionState();
      toastService.success(`Generated 3 new ${tierConfig[currentTier].label} questions!`);
    } catch (err) {
      toastService.info("Quiz completed! View your performance summary below.");
      finishQuiz();
    } finally {
      setIsGeneratingNext(false);
    }
  };

  const resetQuestionState = () => {
    setSelectedOption(null);
    setIsEvaluated(false);
    setIsCorrect(null);
    setShowSocraticPanel(false);
    setSocraticState({ revealedLevel: 0, hints: [] });
  };

  const finishQuiz = () => {
    setIsQuizCompleted(true);
    const finalAccuracy =
      totalAnswered > 0 ? Math.round((correctAnswersCount / totalAnswered) * 100) : 100;

    if (onCompleteQuiz) {
      onCompleteQuiz({
        score: correctAnswersCount,
        percentage: finalAccuracy,
        totalQuestions: totalAnswered,
        correctCount: correctAnswersCount,
        finalAdaptiveTier: currentTier,
        earnedXp,
      });
    }

    if (finalAccuracy >= 80) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#22d3ee", "#0891b2", "#38bdf8", "#0e7490"],
      });
    }
  };

  const accuracyPercent =
    totalAnswered > 0 ? Math.round((correctAnswersCount / totalAnswered) * 100) : 0;

  return (
    <div className="bg-[#08151c] text-slate-100 rounded-3xl border border-[#1b3b4a] shadow-2xl overflow-hidden flex flex-col max-w-3xl w-full mx-auto relative animate-in fade-in zoom-in-95 duration-200">
      {/* Top Header: Adaptive Status & Analytics Bar */}
      <div className="p-5 bg-gradient-to-r from-[#0a1c27] via-[#0e2736] to-[#071620] border-b border-[#1b3b4a] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-cyan-400" />
              Adaptive Psychometrics Engine
            </span>
            <span className="text-xs text-[#7ba4b8] font-semibold truncate max-w-[240px]">
              {courseTitle}
            </span>
          </div>
          <h2 className="text-lg font-black text-white mt-1 flex items-center gap-2">
            <span>{lessonTitle}</span>
          </h2>
        </div>

        {/* Real-time Metric Badges */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Dynamic Tier Indicator */}
          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-bold ${tierConfig[currentTier].bg} ${tierConfig[currentTier].border} ${tierConfig[currentTier].color}`}
            title="Real-time Adaptive Difficulty Level"
          >
            <span>{tierConfig[currentTier].icon}</span>
            <span className="hidden sm:inline">{tierConfig[currentTier].label}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 font-mono">
              {tierConfig[currentTier].multiplier}x XP
            </span>
          </div>

          {/* Streak Flame */}
          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold ${
              streak > 0
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20"
                : "bg-[#0a1b24] text-slate-400 border-[#1b3b4a]"
            }`}
          >
            <Flame className={`w-4 h-4 ${streak > 0 ? "text-cyan-400 fill-cyan-400 animate-pulse" : "text-slate-500"}`} />
            <span>{streak} Streak</span>
          </div>

          {/* Audio toggle */}
          <button
            onClick={() => setAudioFeedbackEnabled(!audioFeedbackEnabled)}
            className="p-2 rounded-xl bg-[#0e2430] hover:bg-[#153444] text-[#7ba4b8] hover:text-white border border-[#1b3b4a] transition-all"
            title={audioFeedbackEnabled ? "Mute Socratic Voice Feedback" : "Enable Socratic Voice Feedback"}
          >
            {audioFeedbackEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#0e2430] hover:bg-slate-900/40 text-[#7ba4b8] hover:text-slate-300 border border-[#1b3b4a] hover:border-slate-500/30 transition-all"
              title="Close Quiz"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress & Live Accuracy Strip */}
      <div className="px-6 py-2.5 bg-[#06131a] border-b border-[#163342] flex items-center justify-between text-xs text-[#7ba4b8]">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <div className="w-24 sm:w-36 h-2 bg-[#0d222e] rounded-full overflow-hidden border border-[#1b3b4a]">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300"
              style={{
                width: `${questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Accuracy: <strong className="text-white">{accuracyPercent}%</strong></span>
          </span>
          <span className="flex items-center gap-1.5 font-bold text-blue-300">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span>+{earnedXp} XP</span>
          </span>
        </div>
      </div>

      {/* Main Body: Active Question or Final Summary */}
      {!isQuizCompleted ? (
        currentQuestion ? (
          <div className="p-6 sm:p-8 space-y-6 flex-1">
            {/* Question Text */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#6b94a8]">
                <span className="uppercase font-bold tracking-wider">
                  Target Competency Check
                </span>
                <span className="capitalize font-medium">
                  Complexity: {"difficulty" in currentQuestion ? (currentQuestion as any).difficulty : currentTier}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                {currentQuestion.question}
              </h3>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOption = idx === currentQuestion.correctAnswerIndex;

                let optionStyle =
                  "bg-[#0e212b] border-[#1b3b4a] text-slate-200 hover:bg-[#142e3b] hover:border-cyan-500/40";

                if (isEvaluated) {
                  if (isCorrectOption) {
                    optionStyle =
                      "bg-cyan-950/60 border-cyan-500 text-cyan-100 ring-2 ring-cyan-500/40 font-bold shadow-lg shadow-cyan-950/40";
                  } else if (isSelected && !isCorrectOption) {
                    optionStyle =
                      "bg-slate-950/60 border-slate-500 text-slate-200 ring-1 ring-slate-500/50";
                  } else {
                    optionStyle = "bg-[#091720]/60 border-[#142e3a] text-slate-500 opacity-60";
                  }
                } else if (isSelected) {
                  optionStyle =
                    "bg-cyan-950/70 border-cyan-400 text-white ring-2 ring-cyan-400/40 font-semibold shadow-md shadow-cyan-950/40";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isEvaluated}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 text-sm ${optionStyle}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 mt-0.5 border ${
                        isEvaluated && isCorrectOption
                          ? "bg-cyan-500 text-slate-950 border-cyan-400"
                          : isEvaluated && isSelected && !isCorrectOption
                          ? "bg-slate-500 text-white border-slate-400"
                          : isSelected
                          ? "bg-cyan-400 text-slate-950 border-cyan-300"
                          : "bg-[#071720] text-[#7ba4b8] border-[#1b3b4a]"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="flex-1 leading-snug">{option}</span>
                    {isEvaluated && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    )}
                    {isEvaluated && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Real-time Feedback & Socratic Guidance Panel */}
            {isEvaluated && (
              <div
                className={`p-5 rounded-2xl border space-y-3.5 animate-in fade-in slide-in-from-bottom-3 duration-200 ${
                  isCorrect
                    ? "bg-cyan-950/30 border-cyan-500/40 text-cyan-200"
                    : "bg-blue-950/30 border-blue-500/40 text-blue-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-sm">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                        <span className="text-cyan-300">Spot On! Conceptual Mastery Verified</span>
                      </>
                    ) : (
                      <>
                        <Lightbulb className="w-5 h-5 text-blue-400 animate-pulse" />
                        <span className="text-blue-300">Socratic Guided Reflection</span>
                      </>
                    )}
                  </div>
                  {!isCorrect && (
                    <button
                      onClick={() => setShowSocraticPanel(!showSocraticPanel)}
                      className="text-xs font-bold text-cyan-300 underline hover:text-white"
                    >
                      {showSocraticPanel ? "Hide Hints" : "View Socratic Hints"}
                    </button>
                  )}
                </div>

                {/* Explanation */}
                <p className="text-xs leading-relaxed text-slate-200 bg-black/30 p-3.5 rounded-xl border border-white/5">
                  {currentQuestion.explanation}
                </p>

                {/* Socratic Multi-step Guidance for incorrect answers */}
                {!isCorrect && showSocraticPanel && socraticState.hints.length > 0 && (
                  <div className="space-y-2.5 pt-2 border-t border-cyan-500/20">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Socratic Clues & Discovery Path</span>
                    </div>

                    <div className="space-y-2">
                      {socraticState.hints.slice(0, socraticState.revealedLevel).map((hint, hIdx) => (
                        <div
                          key={hIdx}
                          className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-100 leading-relaxed font-sans"
                        >
                          <div dangerouslySetInnerHTML={{ __html: hint.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                        </div>
                      ))}
                    </div>

                    {socraticState.revealedLevel < socraticState.hints.length && (
                      <button
                        onClick={() =>
                          setSocraticState((prev) => ({
                            ...prev,
                            revealedLevel: Math.min(prev.hints.length, prev.revealedLevel + 1),
                          }))
                        }
                        className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Reveal Next Socratic Clue ({socraticState.revealedLevel + 1}/3)</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center space-y-4">
            <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-cyan-300 font-semibold">
              Synthesizing adaptive cognitive challenge...
            </p>
          </div>
        )
      ) : (
        /* Quiz Completed Summary View */
        <div className="p-8 sm:p-10 space-y-8 flex-1 animate-in fade-in duration-300">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-400 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/20 font-black text-2xl">
              <Award className="w-8 h-8 text-slate-950" />
            </div>
            <h3 className="text-2xl font-black text-white">Adaptive Evaluation Complete</h3>
            <p className="text-xs text-[#7ba4b8] max-w-md mx-auto">
              You achieved a final score of <strong>{correctAnswersCount} / {totalAnswered}</strong> in <strong>{lessonTitle}</strong>.
            </p>
          </div>

          {/* Performance Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#0b1e2a] border border-[#1b3b4a] text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#7ba4b8] block">Accuracy</span>
              <span className="text-2xl font-black text-cyan-400">{accuracyPercent}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0b1e2a] border border-[#1b3b4a] text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#7ba4b8] block">Adaptive Tier</span>
              <span className={`text-sm font-black ${tierConfig[currentTier].color} block mt-1`}>
                {tierConfig[currentTier].label}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0b1e2a] border border-[#1b3b4a] text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#7ba4b8] block">Best Streak</span>
              <span className="text-2xl font-black text-blue-400 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 fill-blue-400" />
                {highestStreak}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0b1e2a] border border-[#1b3b4a] text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#7ba4b8] block">XP Earned</span>
              <span className="text-2xl font-black text-cyan-400">+{earnedXp}</span>
            </div>
          </div>

          {/* Questions Review History Accordion */}
          <div className="space-y-3 pt-4 border-t border-[#1b3b4a]">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Cognitive Review Log ({questionHistory.length} items)
            </h4>
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {questionHistory.map((item, qIdx) => (
                <div
                  key={qIdx}
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    item.isCorrect
                      ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-200"
                      : "bg-slate-950/20 border-slate-500/30 text-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 font-semibold">
                    <span className="text-white">
                      {qIdx + 1}. {item.question}
                    </span>
                    {item.isCorrect ? (
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </div>
                  <div className="text-[11px] text-slate-300">
                    <strong>Your Choice:</strong> {item.options[item.selectedOption]}
                  </div>
                  {!item.isCorrect && (
                    <div className="text-[11px] text-cyan-300">
                      <strong>Correct Answer:</strong> {item.options[item.correctAnswerIndex]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="p-5 bg-[#06141c] border-t border-[#1b3b4a] flex items-center justify-between gap-4">
        {!isQuizCompleted ? (
          <>
            <div className="text-xs text-[#7ba4b8] hidden sm:block">
              {isEvaluated
                ? isCorrect
                  ? "Well done! Move forward to next challenge."
                  : "Review the Socratic hints and advance."
                : "Select an option to evaluate your understanding."}
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {!isEvaluated ? (
                <button
                  onClick={handleEvaluateAnswer}
                  disabled={selectedOption === null}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-30 disabled:pointer-events-none text-slate-950 font-black text-xs transition-all shadow-xl shadow-cyan-950/40 hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Submit & Verify</span>
                </button>
              ) : (
                <button
                  onClick={
                    currentIndex + 1 < questions.length
                      ? handleNextQuestion
                      : handleSynthesizeMoreQuestions
                  }
                  disabled={isGeneratingNext}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs transition-all shadow-xl shadow-cyan-950/40 hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  {isGeneratingNext ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span>
                    {currentIndex + 1 < questions.length
                      ? "Next Question"
                      : "Generate Next Adaptive Challenge"}
                  </span>
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setCorrectAnswersCount(0);
                setTotalAnswered(0);
                setStreak(0);
                setEarnedXp(0);
                setQuestionHistory([]);
                setIsQuizCompleted(false);
                resetQuestionState();
                generateInitialBank();
              }}
              className="px-5 py-2.5 rounded-xl bg-[#0e212b] hover:bg-[#163444] text-slate-200 border border-[#1b3b4a] text-xs font-bold flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>Retake Adaptive Quiz</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                Return to Course
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
