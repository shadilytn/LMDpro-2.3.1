import React from "react";
import { LazyRender } from './LazyRender';
import {
  Course,
  Lesson,
  StudentProgress,
  AdaptiveLevel,
  LanguageCode,
  UserProfile,
} from "../shared/types";
import { ApiService } from "../shared/api.service";
import { WorkspaceService } from "../shared/workspace.service";
import { ConversationalBridgeService } from "../shared/conversational.bridge.service";
import { GamificationEngine } from "../shared/gamification.engine";
import { getAccessToken, googleSignIn } from "../services/firebase";
import { QuizEngine } from "../services/QuizEngine";
import { toastService } from "../services/toastService";
import confetti from "canvas-confetti";
import { StudyWorkbenchDrawer } from "./StudyWorkbenchDrawer";
import { InteractiveExplainer } from "./InteractiveExplainer";
import { NotebookLMMindMap } from "./NotebookLMMindMap";
import { SocialLearningHub } from "./SocialLearningHub";
import { CinematicVideoVisualizer } from "./CinematicVideoVisualizer";
import { ProjectSimulationsList } from "./ProjectSimulationsList";
import { ProjectSimulationStudio } from "./ProjectSimulationStudio";
import { ProjectSimulation } from "../shared/simulation.types";
import { AIPeerReviewModal } from "./AIPeerReviewModal";
import { SessionSummaryModal } from "./SessionSummaryModal";
import { ParagraphAnnotationOverlay } from "./ParagraphAnnotationOverlay";
import { QuickNoteCaptureModal, LessonNote } from "./QuickNoteCaptureModal";
import { AdaptiveQuizEngine } from "./AdaptiveQuizEngine";
import { InteractiveLearningRoadmap } from "./InteractiveLearningRoadmap";
import { CourseFocusTimer } from "./CourseFocusTimer";
import { LessonSummaryVoiceTool } from "./LessonSummaryVoiceTool";
import { AnnotationService } from "../services/annotationService";
import { OfflineStorageService } from "../services/offlineStorage";
import { bookmarkService } from "../services/bookmarkService";
import {
  ArrowLeft,
  ChevronLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  CheckCircle2,
  Brain,
  HelpCircle,
  Sparkles,
  Globe,
  Download,
  Award,
  ChevronRight,
  BookOpen,
  RotateCcw,
  Zap,
  Sliders,
  Check,
  Code2,
  PanelRightOpen,
  FolderSync,
  ExternalLink,
  MessageSquare,
  FileText,
  RefreshCw,
  X,
  Search,
  Square,
  Briefcase,
  Settings2,
  Headphones,
  Mic,
  FastForward,
  Radio,
  SlidersHorizontal,
  AudioLines,
  Gauge,
  StickyNote,
  MapPin,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";

interface CourseViewerProps {
  course: Course;
  studentProgress?: StudentProgress;
  user?: UserProfile;
  onUpdateProgress: (courseId: string, progress: StudentProgress) => void;
  onBack: () => void;
  onOpenAITutorWithContext: (
    lessonTitle: string,
    lessonContent: string,
  ) => void;
  onCourseCompleted: (course: Course) => void;
}

export const CourseViewer: React.FC<CourseViewerProps> = ({
  course,
  studentProgress,
  user,
  onUpdateProgress,
  onBack,
  onOpenAITutorWithContext,
  onCourseCompleted,
}) => {
  // Adaptive Difficulty State & Metric Calculations
  const [isAdaptiveEngineEnabled, setIsAdaptiveEngineEnabled] = React.useState(
    user?.adaptiveDifficulty ?? true,
  );

  // Compute performance metrics from studentProgress?.quizResults
  const quizResults = studentProgress?.quizResults
    ? (Object.values(studentProgress.quizResults) as {
        score: number;
        percentage: number;
      }[])
    : [];
  const totalQuizScore = quizResults.reduce(
    (acc, q) => acc + (q.percentage || 0),
    0,
  );
  const avgQuizScore =
    quizResults.length > 0
      ? Math.round(totalQuizScore / quizResults.length)
      : 82;

  const adaptiveTier =
    avgQuizScore >= 80
      ? "Mastery / Challenge"
      : avgQuizScore < 50
        ? "Foundational / Guided"
        : "Standard Adaptive";
  const adaptiveTierColor =
    avgQuizScore >= 80
      ? "text-cyan-300 border-cyan-500/40 bg-cyan-500/10"
      : avgQuizScore < 50
        ? "text-cyan-400 border-cyan-500/40 bg-cyan-500/10"
        : "text-blue-400 border-blue-500/40 bg-blue-500/10";
  // Navigation State
  const [activeModuleIndex, setActiveModuleIndex] = React.useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = React.useState(0);

  const activeModule = course.modules[activeModuleIndex] || course.modules[0];
  const activeLesson: Lesson =
    activeModule?.lessons[activeLessonIndex] || activeModule?.lessons[0];

  // Mobile Swipe Gesture Navigation
  const touchStartCoords = React.useRef<{ x: number; y: number } | null>(null);
  const [swipeFeedback, setSwipeFeedback] = React.useState<"prev" | "next" | null>(null);

  const hasPreviousLesson = activeLessonIndex > 0 || activeModuleIndex > 0;
  const hasNextLesson =
    activeLessonIndex < (activeModule?.lessons.length || 0) - 1 ||
    activeModuleIndex < course.modules.length - 1;

  const goToPreviousLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (activeModuleIndex > 0) {
      const prevModIdx = activeModuleIndex - 1;
      setActiveModuleIndex(prevModIdx);
      setActiveLessonIndex(course.modules[prevModIdx].lessons.length - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToNextLesson = () => {
    if (activeLessonIndex < (activeModule?.lessons.length || 0) - 1) {
      setActiveLessonIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (activeModuleIndex < course.modules.length - 1) {
      setActiveModuleIndex((prev) => prev + 1);
      setActiveLessonIndex(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartCoords.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartCoords.current) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartCoords.current.x;
    const deltaY = touch.clientY - touchStartCoords.current.y;
    touchStartCoords.current = null;

    // Only trigger if horizontal swipe is dominant and exceeds 55px
    if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0 && hasNextLesson) {
        // Swipe Left -> Next Lesson
        setSwipeFeedback("next");
        setTimeout(() => setSwipeFeedback(null), 1200);
        goToNextLesson();
      } else if (deltaX > 0 && hasPreviousLesson) {
        // Swipe Right -> Previous Lesson
        setSwipeFeedback("prev");
        setTimeout(() => setSwipeFeedback(null), 1200);
        goToPreviousLesson();
      }
    }
  };

  // Translation State
  const [activeLanguage, setActiveLanguage] = React.useState<LanguageCode>("en");
  const [translatedContent, setTranslatedContent] = React.useState<string | null>(
    null,
  );
  const [isTranslating, setIsTranslating] = React.useState(false);

  // Helper to verify if all lessons in a given module are completed
  const checkIsModuleCompleted = (
    moduleIdx: number,
    completedList: string[] = completedLessonIds
  ) => {
    const targetModule = course.modules[moduleIdx];
    if (!targetModule || !targetModule.lessons || targetModule.lessons.length === 0) return false;
    return targetModule.lessons.every((les) => completedList.includes(les.id));
  };

  // Trigger high-fidelity canvas-confetti celebration sequences for rewarding feedback loops
  const triggerConfettiCelebration = (
    type: "lesson" | "module" | "final_module" | "course" = "final_module"
  ) => {
    if (typeof window === "undefined" || !confetti) return;

    if (type === "lesson") {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#22d3ee", "#38bdf8", "#0ea5e9", "#1d4ed8"],
      });
    } else if (type === "module") {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.65 },
        colors: ["#22d3ee", "#38bdf8", "#0ea5e9", "#1d4ed8", "#1e40af"],
        startVelocity: 35,
      });
    } else {
      // "final_module" or "course" - Multi-phase celebratory fireworks & lateral cannons
      const duration = 2800;
      const animationEnd = Date.now() + duration;
      const palette = [
        "#22d3ee",
        "#38bdf8",
        "#0ea5e9",
        "#1d4ed8",
        "#1e40af",
        "#1e3a8a",
        "#0c4a6e",
        "#075985",
      ];

      // Central initial blast
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.55 },
        colors: palette,
        startVelocity: 45,
        ticks: 350,
        scalar: 1.2,
      });

      // Continuous dual-angle side cannons
      const frameInterval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          clearInterval(frameInterval);
          return;
        }

        const particleRatio = Math.max(0.3, timeLeft / duration);
        confetti({
          particleCount: Math.floor(30 * particleRatio),
          angle: 60,
          spread: 65,
          origin: { x: 0, y: 0.65 },
          colors: palette,
        });
        confetti({
          particleCount: Math.floor(30 * particleRatio),
          angle: 120,
          spread: 65,
          origin: { x: 1, y: 0.65 },
          colors: palette,
        });
      }, 250);
    }
  };

  // Audio Narration State
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);
  const [isAudioPaused, setIsAudioPaused] = React.useState(false);
  const [audioSpeed, setAudioSpeed] = React.useState(1);
  const [voicePersona, setVoicePersona] = React.useState<"dual" | "petra" | "nashmi" | "zalamati" | "system">("dual");
  const [voiceStyle, setVoiceStyle] = React.useState<"lecturer" | "casual" | "dramatic">("lecturer");
  const [narrationMode, setNarrationMode] = React.useState<"podcast" | "full_text" | "summary">("podcast");
  const [selectedVoiceURI, setSelectedVoiceURI] = React.useState<string>("");
  const [availableVoices, setAvailableVoices] = React.useState<SpeechSynthesisVoice[]>([]);
  const [audioPitch, setAudioPitch] = React.useState<number>(1.0);
  const [showVoiceSettings, setShowVoiceSettings] = React.useState(false);
  const [audioProgress, setAudioProgress] = React.useState<{
    currentSentence: number;
    totalSentences: number;
    currentText: string;
    currentSpeaker?: string;
  } | null>(null);
  const [audioDataUri, setAudioDataUri] = React.useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Flashcards state
  const [activeFlashcardIndex, setActiveFlashcardIndex] = React.useState(0);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = React.useState(false);

  // Quiz Modal State
  const [showQuizModal, setShowQuizModal] = React.useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = React.useState<string | null>(null);
  const [isEvaluatingQuiz, setIsEvaluatingQuiz] = React.useState(false);
  const [quizScore, setQuizScore] = React.useState(0);

  // Dynamic AI Quiz Engine State
  const [dynamicQuizzes, setDynamicQuizzes] = React.useState<any[]>([]);
  const [isGeneratingDynamicQuiz, setIsGeneratingDynamicQuiz] = React.useState(false);
  const [activeQuizType, setActiveQuizType] = React.useState<"standard" | "ai">("standard");
  const [dynamicQuizScore, setDynamicQuizScore] = React.useState(0);
  const [currentDynamicQuizIndex, setCurrentDynamicQuizIndex] = React.useState(0);
  const [dynamicSelectedOption, setDynamicSelectedOption] = React.useState<number | null>(null);
  const [dynamicQuizFeedback, setDynamicQuizFeedback] = React.useState<string | null>(null);
  const [isEvaluatingDynamicQuiz, setIsEvaluatingDynamicQuiz] = React.useState(false);

  // Local Completed Lessons set
  const [completedLessonIds, setCompletedLessonIds] = React.useState<string[]>(
    studentProgress?.completedLessonIds || [],
  );

  const [currentAdaptiveLevel, setCurrentAdaptiveLevel] =
    React.useState<AdaptiveLevel>(studentProgress?.adaptiveLevel || "standard");

  // Real-World Project Simulation State
  const [selectedSimulation, setSelectedSimulation] = React.useState<ProjectSimulation | null>(null);
  const [isSimulationView, setIsSimulationView] = React.useState(false);

  // Retractable Workbench Drawer State
  const [isWorkbenchDrawerOpen, setIsWorkbenchDrawerOpen] = React.useState(false);

  // Shared Annotation Overlay State (Virtual Study Room)
  const [isAnnotationDrawerOpen, setIsAnnotationDrawerOpen] = React.useState(false);
  const [selectedAnnotationParagraph, setSelectedAnnotationParagraph] = React.useState<number | null>(null);
  const [selectedParagraphSnippet, setSelectedParagraphSnippet] = React.useState<string>("");
  const [paragraphNoteCounts, setParagraphNoteCounts] = React.useState<Record<number, number>>({});

  React.useEffect(() => {
    const updateCounts = () => {
      if (!activeLesson) return;
      const notes = AnnotationService.getAnnotationsForLesson(course.id, activeLesson.id);
      const counts: Record<number, number> = {};
      notes.forEach((n) => {
        counts[n.paragraphIndex] = (counts[n.paragraphIndex] || 0) + 1;
      });
      setParagraphNoteCounts(counts);
    };
    updateCounts();
    window.addEventListener("ANNOTATIONS_UPDATED", updateCounts);
    window.addEventListener("STUDY_ROOM_CHANGED", updateCounts);
    return () => {
      window.removeEventListener("ANNOTATIONS_UPDATED", updateCounts);
      window.removeEventListener("STUDY_ROOM_CHANGED", updateCounts);
    };
  }, [course.id, activeLesson?.id]);
  const [showPeerReviewModal, setShowPeerReviewModal] = React.useState(false);

  // Floating Action Button Quick Notes State
  const [isQuickNoteModalOpen, setIsQuickNoteModalOpen] = React.useState(false);
  const [lessonNoteCount, setLessonNoteCount] = React.useState<number>(0);
  const [isPathMapView, setIsPathMapView] = React.useState<boolean>(false);

  // Lesson Bookmarking State
  const [isLessonBookmarked, setIsLessonBookmarked] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!activeLesson) return;
    setIsLessonBookmarked(bookmarkService.isBookmarked(course.id, activeLesson.id));
    const unsub = bookmarkService.subscribe(() => {
      setIsLessonBookmarked(bookmarkService.isBookmarked(course.id, activeLesson.id));
    });
    return () => unsub();
  }, [course.id, activeLesson?.id]);

  const handleToggleBookmark = (targetLesson?: typeof activeLesson, targetModule?: typeof activeModule) => {
    const les = targetLesson || activeLesson;
    const mod = targetModule || activeModule;
    if (!les || !mod) return;

    const isNow = bookmarkService.toggleBookmark({
      courseId: course.id,
      courseTitle: course.title,
      moduleId: mod.id,
      moduleTitle: mod.title,
      lessonId: les.id,
      lessonTitle: les.title,
      category: course.category,
      topicSummary: les.keyTakeaways?.[0] || les.content.slice(0, 140) + "...",
      keyTakeaways: les.keyTakeaways,
    });
    setIsLessonBookmarked(isNow);
    if (isNow) {
      toastService.success(`Bookmarked "${les.title}" for quick access in My Bookmarks!`);
    } else {
      toastService.info(`Removed bookmark for "${les.title}".`);
    }
  };

  React.useEffect(() => {
    const checkNotes = () => {
      if (!activeLesson) return;
      try {
        const storageKey = `lmdpro_notes_${course.id}`;
        const existing = localStorage.getItem(storageKey);
        if (existing) {
          const notes: LessonNote[] = JSON.parse(existing);
          const count = notes.filter((n) => n.lessonId === activeLesson.id).length;
          setLessonNoteCount(count);
        } else {
          setLessonNoteCount(0);
        }
      } catch {
        setLessonNoteCount(0);
      }
    };
    checkNotes();
  }, [course.id, activeLesson?.id, isQuickNoteModalOpen]);

  // Session Summary Tracking States
  const [sessionStartTime] = React.useState<number>(Date.now());
  const [sessionXp, setSessionXp] = React.useState<number>(0);
  const [sessionCompletedLessons, setSessionCompletedLessons] = React.useState<{ id: string; title: string; moduleTitle: string }[]>([]);
  const [showSessionSummary, setShowSessionSummary] = React.useState<boolean>(false);

  // Subscribe to GamificationEngine to capture XP earned during active session
  React.useEffect(() => {
    const unsubscribe = GamificationEngine.subscribe((event) => {
      setSessionXp((prev) => prev + event.xpEarned);
    });
    return () => unsubscribe();
  }, []);

  // Background AI Executive Summary State
  const [moduleSummaries, setModuleSummaries] = React.useState<
    Record<string, string>
  >({});
  const [isGeneratingSummary, setIsGeneratingSummary] = React.useState(false);

  // Google Drive Export State
  const [isExportingDrive, setIsExportingDrive] = React.useState(false);
  const [exportSuccessMsg, setExportSuccessMsg] = React.useState<string | null>(null);
  const [exportedFolderUrl, setExportedFolderUrl] = React.useState<string | null>(
    null,
  );
  const [syncJournalSuccess, setSyncJournalSuccess] = React.useState<string | null>(null);

  const handleSyncToLabJournal = () => {
    try {
      const existingVault = localStorage.getItem("lmdpro_obsidian_vault");
      let vault: any[] = [];
      if (existingVault) {
        try {
          vault = JSON.parse(existingVault);
        } catch (e) {}
      }

      const currentLesson = activeModule.lessons[activeLessonIndex];
      const sourceLink = `[Course: ${course.title} > Module: ${activeModule.title} > Lesson: ${currentLesson?.title || "Overview"}]`;
      const newNote = {
        id: "note_" + Date.now(),
        title: `${activeModule.title}: ${currentLesson?.title || "Study Notes"}`,
        content: `# ${activeModule.title}\n## Lesson: ${currentLesson?.title || "Overview"}\n\n${currentLesson?.content || moduleSummaries[activeModule.id] || activeModule.executiveSummary || ""}\n\n---\n**Source Reference**: ${sourceLink}\n*Synced automatically from LMDpro Academy Course Viewer with persistent link*`,
        tags: ["course-sync", course.category || "academy", "lab-journal"],
        folder: "Course Notes",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vault.unshift(newNote);
      localStorage.setItem("lmdpro_obsidian_vault", JSON.stringify(vault));
      setSyncJournalSuccess("Successfully synced to Lab Journal with persistent source metadata link!");
      setTimeout(() => setSyncJournalSuccess(null), 4500);
    } catch (err) {
      console.error("Sync to journal error:", err);
    }
  };

  // Automatic Background AI Service: Generate ~200-word executive summary for active module
  React.useEffect(() => {
    if (!activeModule) return;
    if (!moduleSummaries[activeModule.id] && !activeModule.executiveSummary) {
      setIsGeneratingSummary(true);
      ApiService.generateModuleExecutiveSummary(
        activeModule.title,
        activeModule.description,
        activeModule.lessons.map((l) => l.title),
      )
        .then((summary) => {
          setModuleSummaries((prev) => ({
            ...prev,
            [activeModule.id]: summary,
          }));
        })
        .catch((err) =>
          console.error("Error generating executive summary:", err),
        )
        .finally(() => setIsGeneratingSummary(false));
    }
  }, [activeModuleIndex, activeModule]);

  // Handle Export Course Notes & AI Explainers to 'LMDpro Academy' Folder in Google Drive
  const handleExportToLMDproDrive = async () => {
    setIsExportingDrive(true);
    setExportSuccessMsg(null);
    try {
      let token = getAccessToken();
      if (!token) {
        const authRes = await googleSignIn();
        token = authRes?.accessToken || null;
      }

      if (!token) {
        setExportSuccessMsg(
          "Google Drive authentication required. Please sign in.",
        );
        return;
      }

      const activeSummary =
        moduleSummaries[activeModule.id] ||
        activeModule.executiveSummary ||
        "Module executive summary generated via Zalamati AI Engine.";

      const fileContent = `# ${course.title}
## ${activeModule.title} - Executive Summary & Quick Review

${activeSummary}

---
### Active Lesson Notes: ${activeLesson.title}

${activeLesson.content}

### Key Takeaways
${activeLesson.keyTakeaways?.map((k) => `- ${k}`).join("\n") || "- Master core principles and execution loops."}

---
*Exported directly to LMDpro Academy Drive Folder via Zalamati eLearning Platform*
`;

      const safeCourseTitle = course.title.replace(/[^a-zA-Z0-9 ]/g, "").trim();
      const safeModuleTitle = activeModule.title
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .trim();
      const fileName = `${safeCourseTitle} - ${safeModuleTitle} Notes.md`;

      const result = await WorkspaceService.exportToLMDproAcademyFolder(
        token,
        fileName,
        fileContent,
        "text/markdown",
      );

      if (result) {
        setExportedFolderUrl(result.folderUrl);
        setExportSuccessMsg(
          `Successfully saved "${fileName}" to 'LMDpro Academy' folder in Google Drive!`,
        );
      } else {
        setExportSuccessMsg("Drive export failed. Please verify permissions.");
      }
    } catch (e) {
      console.error("Drive export error:", e);
      setExportSuccessMsg("Export error occurred.");
    } finally {
      setIsExportingDrive(false);
    }
  };

  // Handle lesson change
  React.useEffect(() => {
    setTranslatedContent(null);
    setIsPlayingAudio(false);
    ConversationalBridgeService.stopLessonTts();
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setActiveFlashcardIndex(0);
    setIsFlashcardFlipped(false);
  }, [activeModuleIndex, activeLessonIndex]);

  // Load available speech synthesis voices
  React.useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          setAvailableVoices(voices);
        }
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Sync isPlayingAudio and isAudioPaused with background service
  React.useEffect(() => {
    const unsubscribe = ConversationalBridgeService.subscribeLessonTts(
      (event: any) => {
        if (event.isPlaying !== undefined) {
          setIsPlayingAudio(event.isPlaying);
        }
        if (event.isPaused !== undefined) {
          setIsAudioPaused(event.isPaused);
        }
        if (!event.isPlaying) {
          setAudioProgress(null);
        }
      },
    );
    return () => {
      unsubscribe();
      ConversationalBridgeService.stopLessonTts();
    };
  }, []);

  // Handle Translation
  const handleTranslate = async (lang: LanguageCode) => {
    setActiveLanguage(lang);
    if (lang === "en") {
      setTranslatedContent(null);
      return;
    }
    setIsTranslating(true);
    try {
      const translated = await ApiService.translateText(
        activeLesson.content,
        lang,
      );
      setTranslatedContent(translated);
    } catch (err) {
      console.error("Translation error:", err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Enhanced Audio Playback & Voice Narration Controls
  const handleToggleAudio = async () => {
    if (isPlayingAudio) {
      if (isAudioPaused) {
        ConversationalBridgeService.resumeLessonTts();
        setIsAudioPaused(false);
      } else {
        ConversationalBridgeService.pauseLessonTts();
        setIsAudioPaused(true);
      }
      return;
    }

    setIsLoadingAudio(true);
    try {
      ConversationalBridgeService.setGlobalPlaybackRate(audioSpeed);
      await ConversationalBridgeService.playLessonTts(
        activeLesson.title,
        translatedContent || activeLesson.content,
        {
          voicePersona,
          voiceStyle,
          customVoiceURI: selectedVoiceURI || undefined,
          customPitch: audioPitch,
          narrationMode,
          playbackRate: audioSpeed,
          lang: activeLanguage,
          summaryText: activeLesson.audioScript,
          onProgress: (prog) => {
            setAudioProgress(prog);
          }
        }
      );
    } catch (err) {
      console.error("[CourseViewer] Lesson TTS error:", err);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const handleStopAudio = () => {
    ConversationalBridgeService.stopLessonTts();
    setIsPlayingAudio(false);
    setIsAudioPaused(false);
    setAudioProgress(null);
  };

  const handleSpeedChange = (speed: number) => {
    setAudioSpeed(speed);
    ConversationalBridgeService.setGlobalPlaybackRate(speed);
  };

  // Submit Quiz Question
  const handleAnswerSubmit = async (optionIndex: number) => {
    setSelectedOption(optionIndex);
    const quiz = activeLesson.quizzes[currentQuizIndex];
    if (!quiz) return;

    setIsEvaluatingQuiz(true);

    const evalResult = await ApiService.evaluateQuizResponse({
      question: quiz.question,
      studentAnswer: quiz.options[optionIndex],
      correctAnswer: quiz.options[quiz.correctAnswerIndex],
      explanation: quiz.explanation,
      currentAdaptiveLevel: currentAdaptiveLevel,
    });

    setIsEvaluatingQuiz(false);
    setQuizFeedback(evalResult.feedback);
    if (evalResult.isCorrect) {
      setQuizScore((prev) => prev + 1);
      // Award XP dynamically for correct answer
      GamificationEngine.awardXP(
        50,
        `Correct Answer: Question ${currentQuizIndex + 1}`,
        { courseId: course.id },
      );
    }
    if (evalResult.newAdaptiveLevel) {
      setCurrentAdaptiveLevel(evalResult.newAdaptiveLevel);
    }
  };

  // Dynamic AI Quiz Engine Generators & Handlers
  const handleGenerateAIQuiz = async () => {
    setIsGeneratingDynamicQuiz(true);
    try {
      const generated = await QuizEngine.generateQuiz(
        activeLesson.title,
        activeLesson.content,
        currentAdaptiveLevel
      );
      setDynamicQuizzes(generated);
      setCurrentDynamicQuizIndex(0);
      setDynamicSelectedOption(null);
      setDynamicQuizFeedback(null);
      setDynamicQuizScore(0);
      setActiveQuizType("ai");
      setShowQuizModal(true);
      
      toastService.show({
        type: "success",
        title: "AI Quiz Generated! 🧠",
        message: "Dynamic multiple-choice questions custom-tailored to this lesson have been synthesized.",
        duration: 3000
      });
    } catch (err) {
      console.error("AI quiz generation error:", err);
      toastService.show({
        type: "warning",
        title: "AI Generation Error",
        message: "Failed to construct custom quiz. Falling back to default psychometrics quiz.",
        duration: 3000
      });
    } finally {
      setIsGeneratingDynamicQuiz(false);
    }
  };

  const handleDynamicAnswerSubmit = (optionIndex: number) => {
    setDynamicSelectedOption(optionIndex);
    const quiz = dynamicQuizzes[currentDynamicQuizIndex];
    if (!quiz) return;

    setIsEvaluatingDynamicQuiz(true);
    const result = QuizEngine.evaluateAnswer(
      optionIndex,
      quiz.correctAnswerIndex,
      quiz.explanation,
      currentAdaptiveLevel
    );

    setIsEvaluatingDynamicQuiz(false);
    setDynamicQuizFeedback(result.feedback);
    if (result.isCorrect) {
      setDynamicQuizScore((prev) => prev + 1);
      GamificationEngine.awardXP(
        60,
        `AI Quiz Answer Correct: Q${currentDynamicQuizIndex + 1}`,
        { courseId: course.id }
      );
    }
    if (result.newAdaptiveLevel) {
      setCurrentAdaptiveLevel(result.newAdaptiveLevel);
    }
  };

  const handleNextDynamicQuizQuestion = () => {
    if (currentDynamicQuizIndex + 1 < dynamicQuizzes.length) {
      setCurrentDynamicQuizIndex((prev) => prev + 1);
      setDynamicSelectedOption(null);
      setDynamicQuizFeedback(null);
    } else {
      const finalScore = dynamicQuizScore;
      const totalQuestions = dynamicQuizzes.length;
      const isPerfect = finalScore >= totalQuestions;

      GamificationEngine.awardXP(
        isPerfect ? 300 : 150,
        `Completed Custom AI Quiz for ${activeLesson.title} (${finalScore}/${totalQuestions})`,
        { courseId: course.id, quizScore: finalScore, perfectScore: isPerfect }
      );

      toastService.show({
        type: "success",
        title: "AI Quiz Complete! 🏆",
        message: `Outstanding! You scored ${finalScore}/${totalQuestions} on your custom-generated quiz.`,
        duration: 4000
      });

      setShowQuizModal(false);
      setActiveQuizType("standard");
    }
  };

  const handleNextQuizQuestion = () => {
    if (currentQuizIndex + 1 < activeLesson.quizzes.length) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setQuizFeedback(null);
    } else {
      // Quiz finished for this lesson!
      const finalScore = quizScore;
      const totalQuestions = activeLesson.quizzes.length;
      const isPerfect = finalScore >= totalQuestions;

      // Award XP for completing quiz
      GamificationEngine.awardXP(
        isPerfect ? 250 : 120,
        `Completed Quiz for ${activeLesson.title} (${finalScore}/${totalQuestions})`,
        { courseId: course.id, quizScore: finalScore, perfectScore: isPerfect },
      );

      const isLessonComplete = !completedLessonIds.includes(activeLesson.id);
      let updatedCompleted = completedLessonIds;
      if (isLessonComplete) {
        updatedCompleted = [...completedLessonIds, activeLesson.id];
        setCompletedLessonIds(updatedCompleted);
        setSessionCompletedLessons((prev) => [
          ...prev,
          {
            id: activeLesson.id,
            title: activeLesson.title,
            moduleTitle: activeModule.title,
          },
        ]);
      }

      // Check if module or final course module completed with this quiz
      const isNowModComplete = checkIsModuleCompleted(activeModuleIndex, updatedCompleted);
      const wasModCompleteBefore = checkIsModuleCompleted(activeModuleIndex, completedLessonIds);
      const isFinalMod = activeModuleIndex === course.modules.length - 1;

      if (isNowModComplete && !wasModCompleteBefore) {
        if (isFinalMod) {
          triggerConfettiCelebration("final_module");
          GamificationEngine.awardXP(300, `Final Course Module Mastered: ${activeModule.title}`, {
            courseId: course.id,
          });
          toastService.show({
            type: "success",
            title: "🎓 Final Course Module Mastered! 🎉",
            message: `Magnificent achievement! You have completed the final module "${activeModule.title}" and earned +300 bonus XP!`,
            duration: 5000,
          });
        } else {
          triggerConfettiCelebration("module");
          GamificationEngine.awardXP(150, `Completed Module ${activeModuleIndex + 1}: ${activeModule.title}`, {
            courseId: course.id,
          });
          toastService.show({
            type: "success",
            title: `Module ${activeModuleIndex + 1} Mastered! 🌟`,
            message: `Great job! You completed all lessons in "${activeModule.title}" (+150 Bonus XP).`,
            duration: 4000,
          });
        }
      }

      // Calculate total progress
      const totalCourseLessons = course.modules.reduce(
        (acc, m) => acc + m.lessons.length,
        0,
      );
      const progressPercentage = Math.round(
        (updatedCompleted.length / totalCourseLessons) * 100,
      );

      const updatedProgress: StudentProgress = {
        userId: "usr-student-01",
        courseId: course.id,
        completedLessonIds: updatedCompleted,
        quizResults: {
          ...(studentProgress?.quizResults || {}),
          [activeLesson.id]: {
            courseId: course.id,
            lessonId: activeLesson.id,
            score: quizScore + 1,
            totalQuestions: activeLesson.quizzes.length,
            percentage: Math.round(
              ((quizScore + 1) / activeLesson.quizzes.length) * 100,
            ),
            passed: true,
            feedback: "Quiz Completed!",
            completedAt: new Date().toISOString(),
            adaptiveLevelAdjusted: currentAdaptiveLevel,
          },
        },
        overallProgressPercentage: progressPercentage,
        adaptiveLevel: currentAdaptiveLevel,
        lastAccessedAt: new Date().toISOString(),
        timeSpentMinutes:
          (studentProgress?.timeSpentMinutes || 0) +
          activeLesson.durationMinutes,
      };

      onUpdateProgress(course.id, updatedProgress);
      setShowQuizModal(false);

      // Check if course completed 100%
      if (progressPercentage >= 100) {
        triggerConfettiCelebration("course");
        onCourseCompleted(course);
      }
    }
  };

  const handleToggleLessonCompletion = () => {
    const isCurrentlyCompleted = completedLessonIds.includes(activeLesson.id);
    let updatedCompleted: string[];

    if (isCurrentlyCompleted) {
      updatedCompleted = completedLessonIds.filter((id) => id !== activeLesson.id);
      setCompletedLessonIds(updatedCompleted);
      toastService.show({
        type: "info",
        title: "Lesson Unmarked",
        message: `Lesson "${activeLesson.title}" marked as incomplete.`,
        duration: 2500,
      });
    } else {
      updatedCompleted = [...completedLessonIds, activeLesson.id];
      setCompletedLessonIds(updatedCompleted);
      setSessionCompletedLessons((prev) => [
        ...prev,
        {
          id: activeLesson.id,
          title: activeLesson.title,
          moduleTitle: activeModule.title,
        },
      ]);
      GamificationEngine.awardXP(100, `Completed Lesson: ${activeLesson.title}`, {
        courseId: course.id,
      });

      // Check if completing this lesson completes the current module or final course module
      const isNowModComplete = checkIsModuleCompleted(activeModuleIndex, updatedCompleted);
      const wasModCompleteBefore = checkIsModuleCompleted(activeModuleIndex, completedLessonIds);
      const isFinalMod = activeModuleIndex === course.modules.length - 1;

      if (isNowModComplete && !wasModCompleteBefore) {
        if (isFinalMod) {
          // Fire the multi-cannon canvas-confetti celebration for final course module completion!
          triggerConfettiCelebration("final_module");
          GamificationEngine.awardXP(300, `Final Course Module Mastered: ${activeModule.title}`, {
            courseId: course.id,
          });
          toastService.show({
            type: "success",
            title: "🎓 Final Course Module Mastered! 🎉",
            message: `Outstanding achievement! You have mastered the final module "${activeModule.title}"! (+300 Bonus XP)`,
            duration: 5000,
          });
        } else {
          // Regular module completed
          triggerConfettiCelebration("module");
          GamificationEngine.awardXP(150, `Completed Module ${activeModuleIndex + 1}: ${activeModule.title}`, {
            courseId: course.id,
          });
          toastService.show({
            type: "success",
            title: `Module ${activeModuleIndex + 1} Mastered! 🌟`,
            message: `Great job! You completed all lessons in "${activeModule.title}" (+150 Bonus XP).`,
            duration: 4000,
          });
        }
      } else {
        // Individual lesson celebration
        triggerConfettiCelebration("lesson");
        toastService.show({
          type: "success",
          title: "Lesson Completed! 🎉",
          message: `Great job! You completed "${activeLesson.title}" and earned +100 XP.`,
          duration: 3500,
        });
      }
    }

    const totalCourseLessons = course.modules.reduce(
      (acc, m) => acc + m.lessons.length,
      0
    );
    const progressPercentage = Math.round(
      (updatedCompleted.length / (totalCourseLessons || 1)) * 100
    );

    const updatedProgress: StudentProgress = {
      userId: user?.id || "usr-student-01",
      courseId: course.id,
      completedLessonIds: updatedCompleted,
      quizResults: studentProgress?.quizResults || {},
      overallProgressPercentage: progressPercentage,
      adaptiveLevel: currentAdaptiveLevel,
      lastAccessedAt: new Date().toISOString(),
      timeSpentMinutes: (studentProgress?.timeSpentMinutes || 0) + (activeLesson.durationMinutes || 15),
    };

    onUpdateProgress(course.id, updatedProgress);

    if (progressPercentage >= 100 && !isCurrentlyCompleted) {
      triggerConfettiCelebration("course");
      onCourseCompleted(course);
    }
  };

  const startQuizForLesson = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setQuizFeedback(null);
    setQuizScore(0);
    setShowQuizModal(true);
  };

  if (selectedSimulation) {
    return (
      <ProjectSimulationStudio
        simulation={selectedSimulation}
        user={user}
        onBack={() => setSelectedSimulation(null)}
        onCompleted={(earnedXp) => {
          GamificationEngine.awardXP(earnedXp, 'Project Simulation Mastered');
        }}
      />
    );
  }

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="space-y-6 pb-16 relative"
    >
      {/* Mobile Swipe Feedback Toast Indicator */}
      {swipeFeedback && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce">
          {swipeFeedback === "next" ? (
            <>
              <span>Navigating to Next Lesson</span>
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            </>
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 text-cyan-400" />
              <span>Navigating to Previous Lesson</span>
            </>
          )}
        </div>
      )}

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlayingAudio(false)}
        className="hidden"
      />

      {/* Top Bar with Back Button & Adaptive Level Tag */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <button
          onClick={() => setShowSessionSummary(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0e212b] hover:bg-[#153140] text-slate-300 text-xs font-semibold border border-[#1b3b4a] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>End Study Session</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          {/* Active Study Focus Timer with Progress Ring & Micro-Break Notification */}
          <CourseFocusTimer user={user} />

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold">
            <Brain className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Adaptive Level:{" "}
              <strong className="capitalize">{currentAdaptiveLevel}</strong>
            </span>
          </div>

          <button
            onClick={() => {
              setIsPathMapView(!isPathMapView);
              if (selectedSimulation) setSelectedSimulation(null);
              if (isSimulationView) setIsSimulationView(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95 ${
              isPathMapView
                ? "bg-cyan-500 text-slate-950 font-bold border border-cyan-300 shadow-cyan-500/30"
                : "bg-[#0e222f] hover:bg-[#183648] text-cyan-300 border border-cyan-500/30"
            }`}
            title="Interactive Learning Roadmap & Milestone Dependencies"
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isPathMapView ? "Back to Lessons" : "Interactive Roadmap"}</span>
          </button>

          <button
            onClick={() => {
              setIsSimulationView(!isSimulationView);
              if (selectedSimulation) setSelectedSimulation(null);
              if (isPathMapView) setIsPathMapView(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95 ${
              isSimulationView || selectedSimulation
                ? "bg-cyan-500 text-slate-950 font-bold border border-cyan-300 shadow-cyan-500/30"
                : "bg-gradient-to-r from-blue-700/80 to-cyan-700/80 hover:from-blue-600 hover:to-cyan-600 text-white border border-cyan-400/40"
            }`}
            title="Real-World Project Simulations"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>{isSimulationView || selectedSimulation ? "Back to Lessons" : "Project Simulations"}</span>
          </button>

          <button
            onClick={() => setShowPeerReviewModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-semibold shadow-md shadow-blue-600/30 hover:opacity-90 transition-all active:scale-95"
            title="Submit work for AI Peer Review & Rubric Evaluation"
          >
            <Award className="w-3.5 h-3.5" />
            <span>AI Peer Review</span>
          </button>

          <button
            onClick={() =>
              onOpenAITutorWithContext(activeLesson.title, activeLesson.content)
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-semibold shadow-md shadow-cyan-600/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tutor Context</span>
          </button>

          <button
            onClick={() => setIsWorkbenchDrawerOpen(!isWorkbenchDrawerOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0e222f] hover:bg-[#183648] text-cyan-300 text-xs font-bold border border-cyan-500/30 shadow-md transition-all active:scale-95"
            title="Open Slim Right Study Workbench Sidebar"
          >
            <PanelRightOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Study Workbench</span>
          </button>
        </div>
      </div>

      {/* Course Player Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Module & Lesson Sidebar with Advanced Table of Contents and Progress Visuals */}
        <div className="lg:col-span-1 space-y-4 bg-[#0a1a24]/90 backdrop-blur-xl border border-[#1b3b4a] rounded-2xl p-5 h-fit">
          <div className="border-b border-[#1b3b4a] pb-3 space-y-3">
            <div>
              <h3 className="font-extrabold text-white text-sm line-clamp-1 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>{course.title}</span>
              </h3>
              <p className="text-[10px] text-[#789cae] uppercase tracking-wider font-bold mt-0.5">
                {course.category}
              </p>
            </div>

            {/* Visual Course Progress Bar */}
            {(() => {
              const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
              const completedCount = course.modules.reduce((sum, m) => 
                sum + m.lessons.filter(l => completedLessonIds.includes(l.id)).length, 0
              );
              const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
              return (
                <div className="space-y-1 bg-[#051117] p-2.5 rounded-xl border border-[#143140]">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-400 font-bold">Course Completed</span>
                    <span className="text-cyan-400 font-black">{percent}% ({completedCount}/{totalLessons})</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#122430] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Quick search filter for Table of Contents */}
            <div className="relative">
              <input 
                type="text"
                placeholder="Filter Table of Contents..."
                id="toc_search_input"
                onChange={(e) => {
                  const val = e.target.value.toLowerCase();
                  const btns = document.querySelectorAll(".toc-lesson-btn");
                  btns.forEach((btn) => {
                    const txt = btn.getAttribute("data-title")?.toLowerCase() || "";
                    if (txt.includes(val)) {
                      (btn as HTMLElement).style.display = "flex";
                    } else {
                      (btn as HTMLElement).style.display = "none";
                    }
                  });
                }}
                className="w-full px-3 py-1.5 pl-7 rounded-lg bg-[#040d12] border border-[#143241] text-[11px] text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              />
              <Search className="absolute left-2 top-2 w-3.5 h-3.5 text-gray-500" />
            </div>
          </div>

          <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
            {course.modules.map((mod, mIdx) => {
              const totalModLessons = mod.lessons.length;
              const completedModLessons = mod.lessons.filter(l => completedLessonIds.includes(l.id)).length;
              const isModCompleted = completedModLessons === totalModLessons;
              const modProgressPercent = totalModLessons > 0 ? Math.round((completedModLessons / totalModLessons) * 100) : 0;

              return (
<LazyRender key={mod.id} height="200px">
                <div className="space-y-2 border-b border-[#122b38] last:border-0 pb-3 last:pb-0">
                  <div className="text-xs font-black text-cyan-300 flex items-center justify-between uppercase tracking-wider">
                    <span className="truncate max-w-[70%]">
                      Mod {mIdx + 1}: {mod.title}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                      isModCompleted ? "bg-cyan-950 text-cyan-300 border border-cyan-500/30" : "bg-cyan-950/40 text-[#7bb0c8]"
                    }`}>
                      {completedModLessons}/{totalModLessons}
                    </span>
                  </div>

                  {/* Module progress tick bar */}
                  <div className="w-full h-1 bg-[#122430] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                      style={{ width: `${modProgressPercent}%` }}
                    />
                  </div>

                  <div className="space-y-1 pt-1">
                    {mod.lessons.map((les, lIdx) => {
                      const isSelected = mIdx === activeModuleIndex && lIdx === activeLessonIndex;
                      const isCompleted = completedLessonIds.includes(les.id);
                      const isLesBookmarked = bookmarkService.isBookmarked(course.id, les.id);

                      return (
                        <div
                          key={les.id}
                          className="group/les flex items-center justify-between gap-1"
                        >
                          <button
                            onClick={() => {
                              setActiveModuleIndex(mIdx);
                              setActiveLessonIndex(lIdx);
                            }}
                            data-title={les.title}
                            className={`flex-1 flex items-center justify-between p-2.5 rounded-xl text-left transition-all text-xs toc-lesson-btn ${
                              isSelected
                                ? "bg-gradient-to-r from-cyan-950/60 to-cyan-950/60 text-cyan-200 border border-cyan-500/50 font-semibold shadow-md"
                                : "text-[#82a3b2] hover:bg-[#0e212b] hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-[#1b3b4a] shrink-0" />
                              )}
                              <span className="truncate">{les.title}</span>
                            </div>
                            <span className="text-[10px] text-[#567a8b] shrink-0 ml-1">
                              {les.durationMinutes}m
                            </span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleBookmark(les, mod);
                            }}
                            className={`p-1.5 rounded-lg transition-all ${
                              isLesBookmarked
                                ? "text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border border-cyan-500/30"
                                : "text-gray-500 hover:text-cyan-300 opacity-0 group-hover/les:opacity-100 hover:bg-cyan-500/10"
                            }`}
                            title={isLesBookmarked ? "Remove Bookmark" : "Bookmark Lesson"}
                          >
                            {isLesBookmarked ? (
                              <BookmarkCheck className="w-3.5 h-3.5 fill-cyan-400" />
                            ) : (
                              <Bookmark className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
</LazyRender>
              );
            })}
          </div>
        </div>

        {/* Main Content Area: Project Simulation Studio, Project Simulation List, Visual Learning Path, or Lesson Content */}
        {selectedSimulation ? (
          <div className="lg:col-span-3">
            <ProjectSimulationStudio
              simulation={selectedSimulation}
              user={user}
              onBack={() => setSelectedSimulation(null)}
              onCompleted={(earnedXp) => {
                toastService.success(`Simulation Completed! Earned +${earnedXp || 150} XP!`);
                const currentXP = user.xpPoints || 0;
                const newXP = currentXP + (earnedXp || 150);
                const updatedUser = { ...user, xpPoints: newXP };
                OfflineStorageService.saveProfile(updatedUser);
              }}
            />
          </div>
        ) : isSimulationView ? (
          <div className="lg:col-span-3">
            <ProjectSimulationsList
              courseId={course.id}
              courseTitle={course.title}
              user={user}
              courses={[course]}
              onSelectSimulation={(sim) => setSelectedSimulation(sim)}
            />
          </div>
        ) : isPathMapView ? (
          <div className="lg:col-span-3">
            <InteractiveLearningRoadmap
              course={course}
              activeLessonId={activeLesson.id}
              completedLessonIds={completedLessonIds}
              onSelectLesson={(lessonId, moduleId) => {
                const mIdx = course.modules.findIndex((m) => m.id === moduleId);
                if (mIdx !== -1) {
                  const lIdx = course.modules[mIdx].lessons.findIndex((l) => l.id === lessonId);
                  if (lIdx !== -1) {
                    setActiveModuleIndex(mIdx);
                    setActiveLessonIndex(lIdx);
                    setIsPathMapView(false);
                  }
                }
              }}
              onSelectModule={(moduleId) => {
                const mIdx = course.modules.findIndex((m) => m.id === moduleId);
                if (mIdx !== -1) {
                  setActiveModuleIndex(mIdx);
                  setActiveLessonIndex(0);
                  setIsPathMapView(false);
                }
              }}
            />
          </div>
        ) : (
          <div className="lg:col-span-3 space-y-6">
          {/* Enhanced Audio Narration & Voice Reader Suite */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#071620] via-[#0b212d] to-[#06141c] border border-[#1b3b4a] shadow-xl space-y-3.5 transition-all">
            {/* Top Row: Playback Action, Track Status, Live Waveform, Stop, and Settings Toggle */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              {/* Left: Play/Pause/Stop Buttons & Live Persona Avatar */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleAudio}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shadow-lg transition-all hover:scale-105 shrink-0 ${
                      isPlayingAudio
                        ? isAudioPaused
                          ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20 animate-pulse"
                          : "bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-400/30 ring-2 ring-cyan-400/50"
                        : "bg-cyan-500 hover:bg-cyan-400 text-[#08151c] shadow-cyan-500/20"
                    }`}
                    title={isPlayingAudio ? (isAudioPaused ? "Resume Narration" : "Pause Narration") : "Start Audio Narration"}
                  >
                    {isLoadingAudio ? (
                      <div className="w-5 h-5 border-2 border-[#08151c] border-t-transparent rounded-full animate-spin" />
                    ) : isPlayingAudio ? (
                      isAudioPaused ? (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      ) : (
                        <Pause className="w-5 h-5 fill-current" />
                      )
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </button>

                  {isPlayingAudio && (
                    <button
                      onClick={handleStopAudio}
                      className="w-9 h-9 rounded-xl bg-[#0e222e] hover:bg-cyan-950/40 text-[#82a3b2] hover:text-cyan-400 border border-[#1b3b4a] hover:border-cyan-500/30 flex items-center justify-center transition-all shrink-0"
                      title="Stop Audio Narration"
                    >
                      <Square className="w-4 h-4 fill-current" />
                    </button>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Headphones className="w-3.5 h-3.5 text-cyan-400" />
                      AI Audio Narration
                    </span>
                    
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                      {voicePersona === 'petra' ? '👩‍🏫 Petra' : voicePersona === 'nashmi' ? '👨‍💼 Nashmi' : voicePersona === 'zalamati' ? '🤖 Zalamati' : '🎙️ Dual Host'}
                    </span>

                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {narrationMode === 'full_text' ? 'Full Text' : narrationMode === 'summary' ? 'Quick Summary' : 'Podcast Breakdown'}
                    </span>

                    {/* Animated Audio Equalizer Waveform */}
                    {isPlayingAudio && !isAudioPaused && (
                      <div className="flex items-end gap-0.5 h-3.5 px-1 py-0.5 bg-cyan-950/40 border border-cyan-500/20 rounded">
                        <span className="w-0.5 bg-cyan-400 rounded-full animate-[bounce_0.6s_infinite_100ms] h-2" />
                        <span className="w-0.5 bg-cyan-300 rounded-full animate-[bounce_0.8s_infinite_200ms] h-3.5" />
                        <span className="w-0.5 bg-cyan-400 rounded-full animate-[bounce_0.5s_infinite_300ms] h-1.5" />
                        <span className="w-0.5 bg-cyan-200 rounded-full animate-[bounce_0.7s_infinite_150ms] h-3" />
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-[#7ba4b8] truncate mt-0.5">
                    {audioProgress?.currentText ? audioProgress.currentText : (activeLesson.audioScript || activeLesson.title)}
                  </p>
                </div>
              </div>

              {/* Right Controls: Playback Speed Selector & Voice Settings Toggle */}
              <div className="flex items-center gap-3 self-end md:self-center border-t md:border-t-0 md:border-l border-[#1b3b4a] pt-3 md:pt-0 md:pl-4 w-full md:w-auto justify-between md:justify-end">
                {/* Speed Controls */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-[#7ba4b8] font-medium flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                    Speed:
                  </span>
                  <div className="flex items-center gap-1 bg-[#091b26] p-1 rounded-xl border border-[#1b3b4a]">
                    {[0.75, 1, 1.25, 1.5, 1.75, 2].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSpeedChange(s)}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                          audioSpeed === s
                            ? "bg-cyan-500 text-[#08151c] shadow-sm shadow-cyan-500/30"
                            : "text-[#82a3b2] hover:text-white hover:bg-[#132c38]"
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Voice & Persona Settings Button */}
                <button
                  onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                    showVoiceSettings
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm"
                      : "bg-[#0e212b] text-[#82a3b2] hover:text-white hover:bg-[#152e3b] border-[#1b3b4a]"
                  }`}
                  title="Audio Narration Settings"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Voice & Mode</span>
                </button>
              </div>
            </div>

            {/* Expandable Voice & Narration Options Drawer */}
            {showVoiceSettings && (
              <div className="p-4 rounded-xl bg-[#08151c]/95 border border-cyan-500/30 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Voice Persona Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5" />
                      Voice Persona
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'dual', label: '🎙️ Dual Host', desc: 'Petra & Nashmi' },
                        { id: 'petra', label: '👩‍🏫 Petra', desc: 'Academic Host' },
                        { id: 'nashmi', label: '👨‍💼 Nashmi', desc: 'Documentary' },
                        { id: 'zalamati', label: '🤖 Zalamati', desc: 'System AI' }
                      ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setVoicePersona(p.id as any)}
                          className={`p-2 rounded-lg text-left transition-all border text-xs ${
                            voicePersona === p.id
                              ? "bg-cyan-950/60 text-cyan-200 border-cyan-400 font-bold shadow-sm"
                              : "bg-[#0c1e28] text-slate-300 border-[#1b3b4a] hover:bg-[#132c38]"
                          }`}
                        >
                          <div className="font-semibold text-[11px] truncate">{p.label}</div>
                          <div className="text-[9px] text-[#7ba4b8] truncate">{p.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Voice Style Atmosphere Selector (Lecturer, Casual, Dramatic) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5" />
                      Atmosphere Style
                    </label>
                    <div className="space-y-1.5">
                      {[
                        { id: 'lecturer', label: '🎓 Lecturer', desc: 'Measured & Scholarly' },
                        { id: 'casual', label: '☕ Casual', desc: 'Upbeat & Friendly' },
                        { id: 'dramatic', label: '🎭 Dramatic', desc: 'Expressive Storyteller' }
                      ].map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setVoiceStyle(s.id as any)}
                          className={`w-full p-2 rounded-lg text-left transition-all border text-xs ${
                            voiceStyle === s.id
                              ? "bg-cyan-950/60 text-cyan-200 border-cyan-400 font-bold shadow-sm"
                              : "bg-[#0c1e28] text-slate-300 border-[#1b3b4a] hover:bg-[#132c38]"
                          }`}
                        >
                          <div className="font-semibold text-[11px]">{s.label}</div>
                          <div className="text-[9px] text-[#7ba4b8]">{s.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Narration Mode Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5" />
                      Narration Mode
                    </label>
                    <div className="space-y-1.5">
                      {[
                        { id: 'podcast', title: '🎙️ Podcast Breakdown', desc: 'Co-host dialogue' },
                        { id: 'full_text', title: '📖 Full Lesson Reading', desc: 'Sentence-by-sentence' },
                        { id: 'summary', title: '⚡ Executive Brief', desc: 'Key takeaways' }
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setNarrationMode(m.id as any)}
                          className={`w-full p-2 rounded-lg text-left transition-all border text-xs ${
                            narrationMode === m.id
                              ? "bg-cyan-950/60 text-cyan-200 border-cyan-400 font-bold shadow-sm"
                              : "bg-[#0c1e28] text-slate-300 border-[#1b3b4a] hover:bg-[#132c38]"
                          }`}
                        >
                          <div className="font-semibold text-[11px]">{m.title}</div>
                          <div className="text-[9px] text-[#7ba4b8]">{m.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Browser Voice & Pitch Settings */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <AudioLines className="w-3.5 h-3.5" />
                      Synthesizer & Pitch
                    </label>
                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] text-[#7ba4b8] block mb-1">Installed Browser Engine:</span>
                        <select
                          value={selectedVoiceURI}
                          onChange={(e) => setSelectedVoiceURI(e.target.value)}
                          className="w-full bg-[#0c1e28] border border-[#1b3b4a] text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-cyan-400"
                        >
                          <option value="">Default AI Neural Voice</option>
                          {availableVoices.map((v) => (
                            <option key={v.voiceURI} value={v.voiceURI}>
                              {v.name} ({v.lang})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-[10px] text-[#7ba4b8] mb-1">
                          <span>Vocal Pitch Tuning:</span>
                          <span className="text-cyan-300 font-bold">{audioPitch}x</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setAudioPitch(0.85)}
                            className={`px-2 py-1 text-[10px] rounded border ${audioPitch === 0.85 ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400' : 'bg-[#0c1e28] text-slate-300 border-[#1b3b4a]'}`}
                          >
                            Deep
                          </button>
                          <button
                            onClick={() => setAudioPitch(1.0)}
                            className={`px-2 py-1 text-[10px] rounded border ${audioPitch === 1.0 ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400' : 'bg-[#0c1e28] text-slate-300 border-[#1b3b4a]'}`}
                          >
                            Balanced
                          </button>
                          <button
                            onClick={() => setAudioPitch(1.2)}
                            className={`px-2 py-1 text-[10px] rounded border ${audioPitch === 1.2 ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400' : 'bg-[#0c1e28] text-slate-300 border-[#1b3b4a]'}`}
                          >
                            High
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Live Speech Progress & Spoken Text Subtitle Bar */}
            {audioProgress && isPlayingAudio && (
              <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-2.5 animate-in fade-in duration-150">
                <div className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold shrink-0">
                  {audioProgress.currentSpeaker || 'Live Audio'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[10px] text-cyan-400 mb-0.5 font-medium">
                    <span>Step {audioProgress.currentSentence} of {audioProgress.totalSentences}</span>
                    <span>{Math.round((audioProgress.currentSentence / audioProgress.totalSentences) * 100)}% Complete</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium line-clamp-2">
                    "{audioProgress.currentText}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Lesson View Panel with Touch Swipe Gestures for Mobile */}
          <div 
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="bg-[#0a1a24]/90 backdrop-blur-xl border border-[#1b3b4a] rounded-2xl p-4 sm:p-6 md:p-8 space-y-6 relative overflow-x-hidden select-text"
          >
            {/* Mobile Gesture Navigation Hint */}
            <div className="flex sm:hidden items-center justify-between px-3 py-1.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[10px] text-cyan-300">
              <span className="flex items-center gap-1">
                <ChevronLeft className="w-3 h-3 text-cyan-400" /> Swipe right: Prev
              </span>
              <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-1.5 py-0.5 rounded">
                Touch Swipe
              </span>
              <span className="flex items-center gap-1">
                Swipe left: Next <ChevronRight className="w-3 h-3 text-cyan-400" />
              </span>
            </div>

            {/* Swipe Active Visual Indicator */}
            {swipeFeedback && (
              <div className="fixed inset-x-4 top-24 z-50 flex items-center justify-center pointer-events-none animate-bounce">
                <div className="px-4 py-2 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 border border-white/20">
                  {swipeFeedback === "prev" ? (
                    <>
                      <ChevronLeft className="w-4 h-4" />
                      <span>Navigating to Previous Lesson...</span>
                    </>
                  ) : (
                    <>
                      <span>Navigating to Next Lesson...</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </div>
              </div>
            )}
            {/* Header Title & Translation selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1b3b4a] pb-5">
              <div className="space-y-1">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {activeModule.title}
                </span>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  {activeLesson.title}
                </h1>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Lesson Bookmark Toggle Button */}
                <button
                  onClick={() => handleToggleBookmark()}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                    isLessonBookmarked
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-cyan-950/40"
                      : "bg-[#0e222f] hover:bg-[#183648] text-gray-300 hover:text-white border-[#1b3b4a]"
                  }`}
                  title={isLessonBookmarked ? "Remove Bookmark" : "Save to My Bookmarks"}
                >
                  {isLessonBookmarked ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                      <span className="text-cyan-300">Bookmarked</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4 text-gray-400 hover:text-cyan-300" />
                      <span>Bookmark Topic</span>
                    </>
                  )}
                </button>

                {/* Retractable Workbench Drawer Trigger */}
                <button
                  onClick={() => setIsWorkbenchDrawerOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 hover:bg-cyan-500/20 transition-all shadow-md"
                >
                  <PanelRightOpen className="w-4 h-4 text-cyan-400" />
                  <span>Study Workbench & Notes</span>
                </button>

                {/* Integrated Socratic Tutor button */}
                <button
                  onClick={() =>
                    onOpenAITutorWithContext(
                      activeLesson.title,
                      activeLesson.content,
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 hover:bg-cyan-500/20 transition-all shadow-md"
                  title="Ask Socratic Tutor about this lesson"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Socratic Tutor</span>
                </button>

                {/* Translate dropdown */}
                <div className="flex items-center gap-2 bg-[#08151c] p-1 rounded-xl border border-[#1b3b4a]">
                  <Globe className="w-4 h-4 text-cyan-400 ml-2" />
                  <select
                    value={activeLanguage}
                    onChange={(e) =>
                      handleTranslate(e.target.value as LanguageCode)
                    }
                    className="bg-transparent text-xs text-slate-200 font-semibold p-1 focus:outline-none cursor-pointer"
                  >
                    <option value="en" className="bg-[#08151c] text-white">
                      🇺🇸 English
                    </option>
                    <option value="es" className="bg-[#08151c] text-white">
                      🇪🇸 Español
                    </option>
                    <option value="fr" className="bg-[#08151c] text-white">
                      🇫🇷 Français
                    </option>
                    <option value="de" className="bg-[#08151c] text-white">
                      🇩🇪 Deutsch
                    </option>
                    <option value="ar" className="bg-[#08151c] text-white">
                      🇸🇦 العربية
                    </option>
                    <option value="ja" className="bg-[#08151c] text-white">
                      🇯🇵 日本語
                    </option>
                    <option value="zh" className="bg-[#08151c] text-white">
                      🇨🇳 中文
                    </option>
                    <option value="hi" className="bg-[#08151c] text-white">
                      🇮🇳 हिन्दी
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Review: Module Executive Summary Section */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0a1b26] via-[#0d2332] to-[#071722] border border-[#1b3e52] shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#143447]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-black text-white uppercase tracking-wider">
                        Quick Review
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[9px] font-mono border border-cyan-500/30">
                        Designed Themed Rich Text
                      </span>
                    </div>
                    <p className="text-[11px] text-[#789cae]">
                      Synthesized key conceptual overview for{" "}
                      {activeModule.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setSelectedAnnotationParagraph(null);
                      setSelectedParagraphSnippet("");
                      setIsAnnotationDrawerOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                    title="Open Virtual Study Room Collaborative Annotations"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Virtual Study Room Notes</span>
                  </button>

                  <button
                    onClick={handleSyncToLabJournal}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                    title="Sync current lesson & summary to Lab Journal with persistent source metadata links"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                    <span>Sync to Lab Journal</span>
                  </button>

                  <button
                    onClick={handleExportToLMDproDrive}
                    disabled={isExportingDrive}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                    title="Export Notes and Executive Summary to 'LMDpro Academy' Google Drive Folder"
                  >
                    {isExportingDrive ? (
                      <div className="w-3.5 h-3.5 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FolderSync className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                    <span>Export to 'LMDpro Academy' Drive</span>
                  </button>
                </div>
              </div>

              {exportSuccessMsg && (
                <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-200 text-xs flex items-center justify-between gap-2 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{exportSuccessMsg}</span>
                  </div>
                  {exportedFolderUrl && (
                    <a
                      href={exportedFolderUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-300 font-bold hover:underline flex items-center gap-1 text-[11px] shrink-0"
                    >
                      <span>Open Folder</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {syncJournalSuccess && (
                <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-500/30 text-blue-200 text-xs flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{syncJournalSuccess}</span>
                </div>
              )}

              <div className="text-xs text-gray-200 leading-relaxed bg-[#05131b] p-4 rounded-xl border border-[#123142]">
                {isGeneratingSummary ? (
                  <div className="flex items-center justify-center py-6 gap-2 text-cyan-300 text-xs font-semibold">
                    <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <span>Generating module summary...</span>
                  </div>
                ) : (
                  <div className="space-y-3 font-sans text-gray-200 text-xs leading-relaxed">
                    {(
                      moduleSummaries[activeModule.id] ||
                      activeModule.executiveSummary ||
                      "Executive summary ready for review."
                    )
                      .replace(/[#*_`]/g, "")
                      .split("\n\n")
                      .map((chunk, idx) => (
                        <p
                          key={idx}
                          className="whitespace-pre-line border-l-2 border-cyan-500/40 pl-3 py-0.5"
                        >
                          {chunk}
                        </p>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI Voice-to-Text Lesson Summary Tool */}
            <LessonSummaryVoiceTool
              lessonTitle={activeLesson.title}
              lessonContent={activeLesson.content}
              courseTitle={course.title}
              keyTakeaways={activeLesson.keyTakeaways || []}
              lessonId={activeLesson.id}
              onSaveNoteToJournal={(note) => {
                toastService.success("Note saved to your personal study journal!");
              }}
            />

            {/* Lesson Body Content */}
            <div className="max-w-none text-gray-300 text-sm leading-relaxed space-y-4 font-sans">
              {isTranslating ? (
                <div className="flex items-center justify-center py-12 text-blue-300 gap-2">
                  <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  <span>Translating lesson content...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {(translatedContent || activeLesson.content)
                    .replace(/[#*_`]/g, "")
                    .split("\n\n")
                    .filter((p) => p.trim().length > 0)
                    .map((paragraphText, pIdx) => {
                      const noteCount = paragraphNoteCounts[pIdx] || 0;
                      return (
                        <div
                          key={pIdx}
                          className="group relative bg-[#111e27]/40 p-4 sm:p-5 rounded-2xl border border-[#183647] hover:border-cyan-500/40 transition-all space-y-3"
                        >
                          <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">
                            {paragraphText}
                          </p>

                          {/* Localized Paragraph Annotation Trigger Bar */}
                          <div className="pt-2.5 border-t border-[#163445]/60 flex items-center justify-between gap-2 text-xs">
                            <span className="text-[10px] text-[#6d94a8] font-mono">
                              ¶ Section {pIdx + 1}
                            </span>
                            <div className="flex items-center gap-2">
                              {noteCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" />
                                  <span>
                                    {noteCount}{" "}
                                    {noteCount === 1 ? "Peer Note" : "Peer Notes"}
                                  </span>
                                </span>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedAnnotationParagraph(pIdx);
                                  setSelectedParagraphSnippet(paragraphText);
                                  setIsAnnotationDrawerOpen(true);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-[#0e2430] hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-[#1b3b4a] text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                                title="View or leave collaborative notes on this paragraph"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>{noteCount > 0 ? "Study Notes" : "+ Add Note"}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Key Takeaways */}
            {activeLesson.keyTakeaways &&
              activeLesson.keyTakeaways.length > 0 && (
                <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Key Takeaways
                  </h4>
                  <ul className="space-y-2 text-xs text-cyan-200">
                    {activeLesson.keyTakeaways.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Interactive Explainer (Brilliant Style) */}
            <InteractiveExplainer topicTitle={activeLesson.title} />

            {/* NotebookLM Grounded Concept Mind Map */}
            <NotebookLMMindMap
              course={course}
              onSelectLesson={(lessonId) => {
                course.modules.forEach((mod, mIdx) => {
                  const lIdx = mod.lessons.findIndex((l) => l.id === lessonId);
                  if (lIdx !== -1) {
                    setActiveModuleIndex(mIdx);
                    setActiveLessonIndex(lIdx);
                  }
                });
              }}
            />

            {/* Cinematic Video Visualizer & Veo Explainer */}
            <CinematicVideoVisualizer
              lessonTitle={activeLesson.title}
              lessonContent={activeLesson.content}
            />

            {/* Real-World Project Simulations Section */}
            <div className="pt-6 border-t border-[#1b3b4a]">
              <ProjectSimulationsList
                courseId={course.id}
                courseTitle={course.title}
                user={user}
                onSelectSimulation={(sim) => setSelectedSimulation(sim)}
              />
            </div>

            {/* Course Community Forum Section */}
            <div className="pt-6 border-t border-[#1b3b4a] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                    <span>Course Discussion & Scholar Forum</span>
                  </h3>
                  <p className="text-xs text-[#73A5AD]">
                    Discuss {course.code || course.id} concepts, ask questions, and share study resources with peers and faculty.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#091720] border border-[#1a384a]">
                <SocialLearningHub
                  user={user}
                  defaultCourseFilter={course.code || course.id}
                />
              </div>
            </div>

            {/* Flashcards Deck */}
            {activeLesson.flashcards && activeLesson.flashcards.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[#1b3b4a]">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    Spaced Repetition Flashcards ({activeFlashcardIndex + 1}/
                    {activeLesson.flashcards.length})
                  </h4>
                </div>

                <div
                  onClick={() => setIsFlashcardFlipped(!isFlashcardFlipped)}
                  className="p-8 rounded-2xl bg-[#0e212b] border border-[#1b3b4a] hover:border-cyan-500/50 cursor-pointer text-center min-h-[140px] flex flex-col items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    {isFlashcardFlipped
                      ? "Answer (Click to Flip)"
                      : "Question (Click to Flip)"}
                  </span>
                  <p className="text-sm font-semibold text-white">
                    {isFlashcardFlipped
                      ? activeLesson.flashcards[activeFlashcardIndex]?.back
                      : activeLesson.flashcards[activeFlashcardIndex]?.front}
                  </p>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <button
                    onClick={() => {
                      setIsFlashcardFlipped(false);
                      setActiveFlashcardIndex((prev) => Math.max(0, prev - 1));
                    }}
                    disabled={activeFlashcardIndex === 0}
                    className="px-3 py-1.5 rounded-lg bg-white/5 disabled:opacity-30 text-gray-300"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => {
                      setIsFlashcardFlipped(false);
                      setActiveFlashcardIndex((prev) =>
                        Math.min(activeLesson.flashcards.length - 1, prev + 1),
                      );
                    }}
                    disabled={
                      activeFlashcardIndex ===
                      activeLesson.flashcards.length - 1
                    }
                    className="px-3 py-1.5 rounded-lg bg-white/5 disabled:opacity-30 text-gray-300"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Action Bar: Take Interactive Quiz */}
            {activeLesson.quizzes && activeLesson.quizzes.length > 0 && (
              <div className="pt-6 border-t border-white/10 space-y-3">
                <div className="p-3 rounded-2xl bg-[#091822] border border-[#1b3d4f] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${adaptiveTierColor}`}
                    >
                      Adaptive Difficulty Engine: {adaptiveTier}
                    </span>
                    <span className="text-[#81a5b6] text-[11px]">
                      Avg Quiz Accuracy:{" "}
                      <strong className="text-white">{avgQuizScore}%</strong>
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      setIsAdaptiveEngineEnabled(!isAdaptiveEngineEnabled)
                    }
                    className="text-[10px] text-cyan-300 underline font-semibold hover:text-white"
                  >
                    {isAdaptiveEngineEnabled
                      ? "Disable Engine"
                      : "Enable Adaptive Difficulty"}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                  <div className="text-xs text-gray-400">
                    Questions dynamically adjust complexity based on your
                    real-time quiz performance ({avgQuizScore}% score).
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={handleGenerateAIQuiz}
                      disabled={isGeneratingDynamicQuiz}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-xl shadow-cyan-500/20 transition-all hover:scale-[1.02] w-full sm:w-auto justify-center"
                    >
                      {isGeneratingDynamicQuiz ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                      )}
                      <span>
                        {isGeneratingDynamicQuiz ? "Synthesizing AI Quiz..." : "Synthesize AI Quiz (3 Qs)"}
                      </span>
                    </button>

                    <button
                      onClick={startQuizForLesson}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-xl shadow-cyan-500/20 transition-all hover:scale-[1.02] w-full sm:w-auto justify-center"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>
                        Start Interactive Quiz ({activeLesson.quizzes.length} Qs)
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Final Course Module Completion Milestone Card */}
            {activeModuleIndex === course.modules.length - 1 &&
              checkIsModuleCompleted(activeModuleIndex) && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-cyan-500/15 to-blue-600/10 border border-cyan-400/40 shadow-xl shadow-cyan-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 text-lg shadow-inner">
                      🏆
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-cyan-300 tracking-wide uppercase">
                          Final Course Module Mastered
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          100% Complete
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        You have successfully conquered the curriculum in "{activeModule.title}" (+300 XP awarded).
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => triggerConfettiCelebration("final_module")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Celebrate Milestone 🎉</span>
                  </button>
                </div>
              )}

            {/* Bottom Lesson Navigation Bar */}
            <div className="pt-6 border-t border-[#1b3b4a] flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={goToPreviousLesson}
                disabled={!hasPreviousLesson}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0e212b] hover:bg-[#163444] disabled:opacity-30 disabled:pointer-events-none text-slate-200 border border-[#1b3b4a] text-xs font-bold transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-cyan-400" />
                <span>Previous Lesson</span>
              </button>

              <button
                onClick={handleToggleLessonCompletion}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
                  completedLessonIds.includes(activeLesson.id)
                    ? "bg-blue-600/30 text-blue-300 border border-blue-500/50 hover:bg-blue-600/40"
                    : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-900/30"
                }`}
              >
                <Check className={`w-4 h-4 ${completedLessonIds.includes(activeLesson.id) ? "text-blue-400" : "text-white"}`} />
                <span>
                  {completedLessonIds.includes(activeLesson.id)
                    ? "Lesson Completed (100 XP Earned)"
                    : "Mark Lesson Complete (+100 XP)"}
                </span>
              </button>

              <button
                onClick={goToNextLesson}
                disabled={!hasNextLesson}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold transition-all shadow-lg shadow-cyan-950/40"
              >
                <span>Next Lesson</span>
                <ChevronRight className="w-4 h-4 text-cyan-200" />
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Interactive Adaptive Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <AdaptiveQuizEngine
            courseTitle={course.title}
            lessonTitle={activeLesson.title}
            lessonContent={activeLesson.content}
            initialQuestions={activeQuizType === "ai" ? dynamicQuizzes : (activeLesson.quizzes || [])}
            initialAdaptiveLevel={currentAdaptiveLevel}
            onCompleteQuiz={(results) => {
              GamificationEngine.awardXP(results.earnedXp, `Adaptive Quiz: ${activeLesson.title}`);
              if (!completedLessonIds.includes(activeLesson.id)) {
                handleToggleLessonCompletion();
              }
              toastService.success(`Adaptive Quiz Complete! Score: ${results.percentage}%. Earned +${results.earnedXp} XP!`);
              setShowQuizModal(false);
            }}
            onClose={() => setShowQuizModal(false)}
          />
        </div>
      )}

      {/* Retractable Study Workbench Drawer */}
      <StudyWorkbenchDrawer
        isOpen={isWorkbenchDrawerOpen}
        onClose={() => setIsWorkbenchDrawerOpen(false)}
        lessonContext={activeLesson?.content}
      />

      {/* AI Peer Review & Rubric Evaluation Modal */}
      <AIPeerReviewModal
        isOpen={showPeerReviewModal}
        onClose={() => setShowPeerReviewModal(false)}
        lessonTitle={activeLesson?.title || ""}
        lessonContent={activeLesson?.content || ""}
      />

      {/* Session Summary Recapping Progress */}
      <SessionSummaryModal
        isOpen={showSessionSummary}
        onClose={() => {
          setShowSessionSummary(false);
          onBack();
        }}
        xpEarned={sessionXp}
        timeSpentSeconds={Math.round((Date.now() - sessionStartTime) / 1000)}
        completedLessons={sessionCompletedLessons}
        courseTitle={course.title}
      />

      {/* Shared Paragraph Annotation Overlay (Virtual Study Room) */}
      <ParagraphAnnotationOverlay
        courseId={course.id}
        courseTitle={course.title}
        moduleId={activeModule?.id || "m1"}
        lessonId={activeLesson?.id || "l1"}
        lessonTitle={activeLesson?.title || ""}
        activeParagraphIndex={selectedAnnotationParagraph}
        paragraphText={selectedParagraphSnippet}
        user={user}
        isOpen={isAnnotationDrawerOpen}
        onClose={() => setIsAnnotationDrawerOpen(false)}
        onOpenSocraticTutor={(context) => {
          setIsWorkbenchDrawerOpen(true);
        }}
      />
      {/* Floating Action Button (FAB) for Quick Text/Voice Note Capture */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <button
          id="course-viewer-quick-note-fab"
          onClick={() => setIsQuickNoteModalOpen(true)}
          className="group relative flex items-center justify-center p-3.5 sm:px-4 sm:py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-black shadow-2xl shadow-cyan-950/60 border border-cyan-300/40 hover:scale-105 active:scale-95 transition-all duration-200"
          title="Capture Quick Lesson Note / Voice Memo"
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <StickyNote className="w-5 h-5 text-slate-950" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 border border-slate-950 animate-pulse" />
            </div>
            <span className="hidden sm:inline text-xs font-black tracking-wide">
              Take Note
            </span>
          </div>

          {/* Note count badge */}
          {lessonNoteCount > 0 && (
            <span className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-[20px] text-center rounded-full bg-slate-950 text-cyan-300 border border-cyan-400 text-[10px] font-black shadow-md">
              {lessonNoteCount}
            </span>
          )}

          {/* Floating Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-950/90 text-cyan-200 border border-cyan-500/30 text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg">
            Quick Note / Voice Memo ({lessonNoteCount} saved)
          </div>
        </button>
      </div>

      {/* Quick Text / Voice Note Capture Modal */}
      <QuickNoteCaptureModal
        isOpen={isQuickNoteModalOpen}
        onClose={() => setIsQuickNoteModalOpen(false)}
        courseId={course.id}
        courseTitle={course.title}
        lessonId={activeLesson?.id || "lesson-1"}
        lessonTitle={activeLesson?.title || "Current Lesson"}
        onNoteSaved={() => {
          // Trigger local note count refresh
          const storageKey = `lmdpro_notes_${course.id}`;
          const existing = localStorage.getItem(storageKey);
          if (existing && activeLesson) {
            const notes: LessonNote[] = JSON.parse(existing);
            const count = notes.filter((n) => n.lessonId === activeLesson.id).length;
            setLessonNoteCount(count);
          }
        }}
      />
    </div>
  );
};
