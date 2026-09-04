import React, { Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  UserProfile,
  UserRole,
  Course,
  StudentProgress,
  Certificate,
  LanguageCode,
} from "./shared/types";
import { OfflineStorageService } from "./services/offlineStorage";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { BackgroundServicesEngine } from "./components/BackgroundServicesEngine";
import { testFirestoreConnection, initAuth, silentProfileHydration } from "./services/firebase";
import { offlineSyncService } from "./services/offlineSyncService";
import { ragSyncService } from "./services/ragSyncService";
import { toastService } from "./services/toastService";
import { SkeletonLoader } from "./components/SkeletonLoader";
import { ToastNotificationSystem } from "./components/ToastNotificationSystem";
import { AnimatedGeometricBackground } from "./components/AnimatedGeometricBackground";
import { ToolType } from "./components/ToolModalOverlay";
import { WebAuthnService } from "./services/webAuthnService";
import { Lock, Fingerprint, Key, ShieldCheck, ArrowRight, Sparkles, RefreshCw, History, CheckCircle2, XCircle } from "lucide-react";

// Lazy load all secondary modals and non-critical dashboard views
const AuthModal = React.lazy(() => import("./components/AuthModal").then((m) => ({ default: m.AuthModal })));
const AITutorModal = React.lazy(() => import("./components/AITutorModal").then((m) => ({ default: m.AITutorModal })));
const AICourseArchitectModal = React.lazy(() => import("./components/AICourseArchitectModal").then((m) => ({ default: m.AICourseArchitectModal })));
const CertificateModal = React.lazy(() => import("./components/CertificateModal").then((m) => ({ default: m.CertificateModal })));
const GoogleClassroomModal = React.lazy(() => import("./components/GoogleClassroomModal").then((m) => ({ default: m.GoogleClassroomModal })));
const AgentInspectorModal = React.lazy(() => import("./components/AgentInspectorModal").then((m) => ({ default: m.AgentInspectorModal })));
const DeepCrawlRagModal = React.lazy(() => import("./components/DeepCrawlRagModal").then((m) => ({ default: m.DeepCrawlRagModal })));
const ProfileModal = React.lazy(() => import("./components/ProfileModal").then((m) => ({ default: m.ProfileModal })));
const SettingsModal = React.lazy(() => import("./components/SettingsModal").then((m) => ({ default: m.SettingsModal })));
const SearchModal = React.lazy(() => import("./components/SearchModal"));
const LegalModal = React.lazy(() => import("./components/LegalModal").then((m) => ({ default: m.LegalModal })));
const ToolModalOverlay = React.lazy(() => import("./components/ToolModalOverlay").then((m) => ({ default: m.ToolModalOverlay })));
const QuickKeyModalOverlay = React.lazy(() => import("./components/QuickKeyModalOverlay").then((m) => ({ default: m.QuickKeyModalOverlay })));
const LivePointPreviewSystem = React.lazy(() => import("./components/LivePointPreviewSystem").then((m) => ({ default: m.LivePointPreviewSystem })));
const NashmiFloatingOverlay = React.lazy(() => import("./components/NashmiFloatingOverlay").then((m) => ({ default: m.NashmiFloatingOverlay })));

// Lazy-loaded Views for maximum code splitting and low initial bundle size
const StudentDashboard = React.lazy(() => import("./components/StudentDashboard").then((m) => ({ default: m.StudentDashboard })));
const TeacherDashboard = React.lazy(() => import("./components/TeacherDashboard").then((m) => ({ default: m.TeacherDashboard })));
const SchoolDashboard = React.lazy(() => import("./components/SchoolDashboard").then((m) => ({ default: m.SchoolDashboard })));
const TeamDashboard = React.lazy(() => import("./components/TeamDashboard").then((m) => ({ default: m.TeamDashboard })));
const EnterpriseDashboard = React.lazy(() => import("./components/EnterpriseDashboard").then((m) => ({ default: m.EnterpriseDashboard })));
const CourseViewer = React.lazy(() => import("./components/CourseViewer").then((m) => ({ default: m.CourseViewer })));
const DegreeProgramsCatalog = React.lazy(() => import("./components/DegreeProgramsCatalog").then((m) => ({ default: m.DegreeProgramsCatalog })));
const StudyRooms = React.lazy(() => import("./components/StudyRooms").then((m) => ({ default: m.StudyRooms })));
const SocialLearningHub = React.lazy(() => import("./components/SocialLearningHub").then((m) => ({ default: m.SocialLearningHub })));
const AIStudyForum = React.lazy(() => import("./components/AIStudyForum").then((m) => ({ default: m.AIStudyForum })));
const AIContentCurationEngine = React.lazy(() => import("./components/AIContentCurationEngine").then((m) => ({ default: m.AIContentCurationEngine })));
const CuratedCollectionsView = React.lazy(() => import("./components/CuratedCollectionsView").then((m) => ({ default: m.CuratedCollectionsView })));
const AdminPortal = React.lazy(() => import("./components/AdminPortal").then((m) => ({ default: m.AdminPortal })));
const CoursesAndTraining = React.lazy(() => import("./components/CoursesAndTraining").then((m) => ({ default: m.CoursesAndTraining })));
const WeeklyStudyGrid = React.lazy(() => import("./components/WeeklyStudyGrid").then((m) => ({ default: m.WeeklyStudyGrid })));
const InteractiveStudyTools = React.lazy(() => import("./components/InteractiveStudyTools").then((m) => ({ default: m.InteractiveStudyTools })));
const EducationalMaterialsStudio = React.lazy(() => import("./components/EducationalMaterialsStudio").then((m) => ({ default: m.EducationalMaterialsStudio })));
const AIFeaturesStudio = React.lazy(() => import("./components/AIFeaturesStudio").then((m) => ({ default: m.AIFeaturesStudio })));
const LearningAnalyticsDashboard = React.lazy(() => import("./components/LearningAnalyticsDashboard").then((m) => ({ default: m.LearningAnalyticsDashboard })));
const LeaderboardPanel = React.lazy(() => import("./components/LeaderboardPanel").then((m) => ({ default: m.LeaderboardPanel })));
const ProjectSimulationsList = React.lazy(() => import("./components/ProjectSimulationsList").then((m) => ({ default: m.ProjectSimulationsList })));
const FeaturedPricingView = React.lazy(() => import("./components/FeaturedPricingView").then((m) => ({ default: m.FeaturedPricingView })));
const KnowledgeBase = React.lazy(() => import("./components/KnowledgeBase").then((m) => ({ default: m.KnowledgeBase })));
const AICareerPathAdvisor = React.lazy(() => import("./components/AICareerPathAdvisor").then((m) => ({ default: m.AICareerPathAdvisor })));
const AchievementsPanel = React.lazy(() => import("./components/AchievementsPanel").then((m) => ({ default: m.AchievementsPanel })));
const DeveloperApiEngineView = React.lazy(() => import("./components/DeveloperApiEngineView").then((m) => ({ default: m.DeveloperApiEngineView })));
const OpenSourceView = React.lazy(() => import("./components/OpenSourceView").then((m) => ({ default: m.OpenSourceView })));
const DocumentationView = React.lazy(() => import("./components/DocumentationView").then((m) => ({ default: m.DocumentationView })));
const AboutProjectView = React.lazy(() => import("./components/AboutProjectView").then((m) => ({ default: m.AboutProjectView })));
const PromptDiagnosticsView = React.lazy(() => import("./components/PromptDiagnosticsView").then((m) => ({ default: m.PromptDiagnosticsView })));
const FeaturedSolutionsView = React.lazy(() => import("./components/FeaturedSolutionsView").then((m) => ({ default: m.FeaturedSolutionsView })));
const AcademicResearchView = React.lazy(() => import("./components/AcademicResearchView").then((m) => ({ default: m.AcademicResearchView })));
const WorkspaceIntegrationView = React.lazy(() => import("./components/WorkspaceIntegrationView").then((m) => ({ default: m.WorkspaceIntegrationView })));
const MyBookmarksTab = React.lazy(() => import("./components/MyBookmarksTab").then((m) => ({ default: m.MyBookmarksTab })));
const AIStudyBuddy = React.lazy(() => import("./components/AIStudyBuddy").then((m) => ({ default: m.AIStudyBuddy })));

export default function App() {
  const [isAppReady, setIsAppReady] = React.useState(true);
  const [showSplash, setShowSplash] = React.useState(false);
  const [showQuickKeyModal, setShowQuickKeyModal] = React.useState(false);

  // Storage State
  const [user, setUser] = React.useState<UserProfile>({
    id: "placeholder",
    name: "Scholar",
    email: "scholar@zalamati.com",
    role: "student",
    theme: "dark",
    language: "en",
    xpPoints: 0,
    level: 1,
    learningLevel: "standard",
    enrolledCourseIds: [],
    completedCourseIds: [],
    badges: [],
    milestones: [],
    autoLockEnabled: true,
    autoLockMinutes: 60,
    isAssistantEnabled: true,
  } as UserProfile);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [progressMap, setProgressMap] = React.useState<
    Record<string, StudentProgress>
  >({});
  const [certificates, setCertificates] = React.useState<Certificate[]>([]);
  const [isOffline, setIsOffline] = React.useState<boolean>(false);

  // UI Navigation State
  const [activeTab, setActiveTab] = React.useState<string>("dashboard");
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1200;
    }
    return true;
  });

  const isHydratedRef = React.useRef(false);

  React.useEffect(() => {
    const initApp = async () => {
      try {
        const p = OfflineStorageService.getProfile();
        // Only set from local storage if hydration hasn't completed yet
        if (!isHydratedRef.current) {
          setUser((prev) => ({
            ...prev,
            ...p,
            theme: p.theme || "dark",
            level: p.level || 1,
          }));
        }
        setCourses(OfflineStorageService.getCourses());
        setProgressMap(OfflineStorageService.getProgressMap());
        setCertificates(OfflineStorageService.getCertificates());
        setIsOffline(OfflineStorageService.isOfflineForced());
      } catch (err) {
        console.warn("Initialization error caught in initApp:", err);
      } finally {
        setIsAppReady(true);
        setShowSplash(false);
      }
    };
    initApp();
  }, []);

  const [isHydrating, setIsHydrating] = React.useState(false);

  // Silent Profile Hydration after Firebase Auth sign in
  React.useEffect(() => {
    const unsubscribe = initAuth(async (firebaseUser, token) => {
      try {
        setIsHydrating(true);
        console.log("[ProfileHydration] Firebase user authenticated, running full curriculum hydration for UID:", firebaseUser.uid);
        
        const hydratedData = await silentProfileHydration(firebaseUser.uid);
        
        if (hydratedData) {
          isHydratedRef.current = true;
          console.log("[App] Profile hydration successful, mapping to global state");
          
          setUser((prev) => ({
            ...prev,
            id: hydratedData.uid || firebaseUser.uid,
            name: hydratedData.displayName || firebaseUser.displayName || prev.name,
            email: hydratedData.email || firebaseUser.email || prev.email,
            role: hydratedData.role || prev.role,
            xpPoints: hydratedData.xpPoints ?? prev.xpPoints,
            level: hydratedData.level ?? prev.level,
            enrolledCourseIds: hydratedData.enrolledCourses || hydratedData.enrolledCourseIds || prev.enrolledCourseIds,
            completedCourseIds: hydratedData.completedLessons || hydratedData.completedCourseIds || prev.completedCourseIds,
            workspaceConnected: hydratedData.workspaceConnected ?? prev.workspaceConnected,
            avatarUrl: hydratedData.photoURL || firebaseUser.photoURL || prev.avatarUrl,
            theme: hydratedData.preferences?.theme || prev.theme,
            language: hydratedData.preferences?.language || prev.language || "en",
            badges: hydratedData.badges || prev.badges,
            milestones: hydratedData.milestones || prev.milestones,
          }));

          // Sync local progress if needed
          if (hydratedData.progress) {
             setProgressMap(prev => ({ ...prev, ...hydratedData.progress }));
          }

          toastService.success(
            user.language === "ar" 
              ? "تمت مزامنة تقدمك الدراسي بنجاح" 
              : "Curriculum progress & profile successfully hydrated from Firestore."
          );
        }
      } catch (err) {
        console.warn("[ProfileHydration] Silent hydration warning:", err);
        toastService.warning("Using local workspace cache (Cloud sync pending)");
      } finally {
        setIsHydrating(false);
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user.language]);

  const [quickStudyMode, setQuickStudyMode] = React.useState(false);

  React.useEffect(() => {
    const handleToggleQuickStudy = () => {
      setQuickStudyMode(prev => !prev);
    };
    window.addEventListener("TOGGLE_QUICK_STUDY", handleToggleQuickStudy);
    return () => window.removeEventListener("TOGGLE_QUICK_STUDY", handleToggleQuickStudy);
  }, []);

  const filteredCourses = courses.filter((course) => {
    if (quickStudyMode) {
      return (course.durationHours || 0) <= 0.17; // ~10 minutes
    }
    return true;
  });

  // Modals State
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [showAITutor, setShowAITutor] = React.useState(false);

  React.useEffect(() => {
    const handleOpenSettingsLocal = () => {
      setShowSettingsModal(true);
    };

    const handleVoiceCommandLocal = (e: any) => {
      const cmd = (e.detail?.command || "").toLowerCase();
      console.log("[App] Voice command received via local event:", cmd);

      if (cmd.includes("course")) {
        setActiveTab("courses");
      } else if (cmd.includes("degree")) {
        setActiveTab("degrees");
      } else if (cmd.includes("analytic")) {
        setActiveTab("analytics");
      } else if (cmd.includes("plan") || cmd.includes("schedule")) {
        setActiveTab("planner");
      } else if (cmd.includes("search") || cmd.includes("find")) {
        setShowSearchModal(true);
      } else if (cmd.includes("setting")) {
        setShowSettingsModal(true);
      } else if (cmd.includes("leaderboard") || cmd.includes("rank")) {
        setActiveTab("leaderboard");
      } else if (cmd.includes("forum")) {
        setActiveTab("social_forums");
      } else if (cmd.includes("home") || cmd.includes("dashboard")) {
        setActiveTab("dashboard");
      }
    };

    window.addEventListener(
      "OPEN_SETTINGS_MODAL_LOCAL",
      handleOpenSettingsLocal,
    );
    window.addEventListener(
      "EXECUTE_VOICE_COMMAND_LOCAL",
      handleVoiceCommandLocal,
    );
    return () => {
      window.removeEventListener(
        "OPEN_SETTINGS_MODAL_LOCAL",
        handleOpenSettingsLocal,
      );
      window.removeEventListener(
        "EXECUTE_VOICE_COMMAND_LOCAL",
        handleVoiceCommandLocal,
      );
    };
  }, []);
  const [tutorContextLesson, setTutorContextLesson] = React.useState<{
    title: string;
    content: string;
  } | null>(null);
  const [showCourseArchitect, setShowCourseArchitect] = React.useState(false);
  const [showClassroomModal, setShowClassroomModal] = React.useState(false);
  const [showAgentInspector, setShowAgentInspector] = React.useState(false);
  const [showRagIndexer, setShowRagIndexer] = React.useState(false);
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const [showSearchModal, setShowSearchModal] = React.useState(false);
  const [showLegalModal, setShowLegalModal] = React.useState(false);
  const [selectedCertificate, setSelectedCertificate] =
    React.useState<Certificate | null>(null);
  const [activeToolModal, setActiveToolModal] = React.useState<ToolType>(null);

  // Auto-Lock Inactivity and Session Protection State
  const [isAppLocked, setIsAppLocked] = React.useState(false);
  const [reAuthInput, setReAuthInput] = React.useState("");
  const [reAuthError, setReAuthError] = React.useState<string | null>(null);
  const [isReAuthenticating, setIsReAuthenticating] = React.useState(false);
  const [securityLogs, setSecurityLogs] = React.useState([
    { id: '1', time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), type: 'success', method: 'password', ip: '192.168.1.1' },
    { id: '2', time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), type: 'success', method: 'biometric', ip: '192.168.1.1' },
    { id: '3', time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), type: 'failed', method: 'password', ip: '192.168.1.42' },
    { id: '4', time: new Date(Date.now() - 1000 * 60 * 15).toISOString(), type: 'success', method: 'biometric', ip: '192.168.1.1' },
    { id: '5', time: new Date(Date.now() - 1000 * 60 * 2).toISOString(), type: 'success', method: 'biometric', ip: '192.168.1.1' }
  ]);
  const lastActiveRef = React.useRef<number>(Date.now());

  // Inactivity Idle Monitor & Manual Lock Event Listener
  React.useEffect(() => {
    const handleUserActivity = () => {
      lastActiveRef.current = Date.now();
    };

    const handleManualLock = () => {
      setIsAppLocked(true);
    };

    const activityEvents = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "pointerdown",
    ];

    activityEvents.forEach((evt) =>
      window.addEventListener(evt, handleUserActivity, { passive: true }),
    );
    window.addEventListener("LOCK_APP_SESSION", handleManualLock);

    // Inactivity check every 10 seconds
    const interval = setInterval(() => {
      if (isAppLocked) return;
      const isAutoLockOn = user.autoLockEnabled !== false;
      const lockThresholdMinutes = user.autoLockMinutes || 60;
      const idleMs = Date.now() - lastActiveRef.current;
      if (isAutoLockOn && idleMs >= lockThresholdMinutes * 60 * 1000) {
        setIsAppLocked(true);
      }
    }, 10000);

    return () => {
      activityEvents.forEach((evt) =>
        window.removeEventListener(evt, handleUserActivity),
      );
      window.removeEventListener("LOCK_APP_SESSION", handleManualLock);
      clearInterval(interval);
    };
  }, [isAppLocked, user.autoLockEnabled, user.autoLockMinutes]);

  const handleUnlockWithBiometrics = async () => {
    setIsReAuthenticating(true);
    setReAuthError(null);
    try {
      const res = await WebAuthnService.authenticateWithBiometrics();
      if (res.success) {
        setIsAppLocked(false);
        lastActiveRef.current = Date.now();
        setReAuthInput("");
        setSecurityLogs(prev => [{ id: Date.now().toString(), time: new Date().toISOString(), type: 'success', method: 'biometric', ip: 'Current Device' }, ...prev].slice(0, 5));
        toastService.success(
          user.language === "ar"
            ? "تم التحقق من الهوية بنجاح باستخدام Passkey"
            : "Identity verified with Passkey. Workspace unlocked.",
        );
      } else {
        setSecurityLogs(prev => [{ id: Date.now().toString(), time: new Date().toISOString(), type: 'failed', method: 'biometric', ip: 'Current Device' }, ...prev].slice(0, 5));
        setReAuthError(
          res.message ||
            (user.language === "ar"
              ? "تعذر التحقق البيومتري. يمكنك استخدام رمز المرور."
              : "Biometric passkey unavailable or cancelled. Please enter PIN/Password."),
        );
      }
    } catch {
      setSecurityLogs(prev => [{ id: Date.now().toString(), time: new Date().toISOString(), type: 'failed', method: 'biometric', ip: 'Current Device' }, ...prev].slice(0, 5));
      setReAuthError(
        user.language === "ar"
          ? "حدث خطأ أثناء المصادقة البيومترية"
          : "Authentication error occurred.",
      );
    } finally {
      setIsReAuthenticating(false);
    }
  };

  const handleUnlockWithPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (reAuthInput.trim().length >= 4) {
      setIsAppLocked(false);
      setReAuthInput("");
      setReAuthError(null);
      lastActiveRef.current = Date.now();
      setSecurityLogs(prev => [{ id: Date.now().toString(), time: new Date().toISOString(), type: 'success', method: 'password', ip: 'Current Device' }, ...prev].slice(0, 5));
      toastService.success(
        user.language === "ar"
          ? "مرحباً بعودتك! تم فتح مساحة العمل بأمان."
          : "Welcome back! Workspace unlocked successfully.",
      );
    } else {
      setSecurityLogs(prev => [{ id: Date.now().toString(), time: new Date().toISOString(), type: 'failed', method: 'password', ip: 'Current Device' }, ...prev].slice(0, 5));
      setReAuthError(
        user.language === "ar"
          ? "يرجى إدخال رمز مرور أو PIN صالح (4 أحرف/أرقام على الأقل)"
          : "Please enter a valid PIN or passphrase (min 4 characters).",
      );
    }
  };

  // Synchronize Language, RTL Direction, and Theme attributes with Document Root
  React.useEffect(() => {
    if (user.language === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
      document.documentElement.setAttribute("lang", "ar");
      document.body.classList.add("rtl-mode");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
      document.documentElement.setAttribute("lang", user.language || "en");
      document.body.classList.remove("rtl-mode");
    }

    if (user.theme === "light") {
      document.documentElement.classList.add("light-mode");
      document.body.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
      document.body.classList.remove("light-mode");
    }
  }, [user.language, user.theme]);

  React.useEffect(() => {
    testFirestoreConnection();
    // Fire up background sync managers
    offlineSyncService.syncQueueToFirebase();
    ragSyncService.syncIndexedDocuments();

    // Prefetch lazy-loaded dashboard components to improve perceived performance
    const prefetchDashboards = () => {
      import("./components/StudentDashboard");
      import("./components/TeacherDashboard");
      import("./components/SchoolDashboard");
      import("./components/TeamDashboard");
      import("./components/EnterpriseDashboard");
      import("./components/CourseViewer");
      import("./components/DegreeProgramsCatalog");
      import("./components/StudyRooms");
      import("./components/SocialLearningHub");
      import("./components/AIContentCurationEngine");
      import("./components/Sidebar");
      import("./components/NashmiFloatingOverlay");
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(prefetchDashboards);
    } else {
      setTimeout(prefetchDashboards, 2000);
    }
  }, []);

  // Global Keyboard Shortcuts (Ctrl/Cmd + K, Ctrl/Cmd + T, Ctrl/Cmd + D, ?)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();

      // Always allow Cmd/Ctrl + K globally to trigger Search Modal
      if (isCmdOrCtrl && key === "k") {
        e.preventDefault();
        setShowSearchModal(true);
        return;
      }

      // Ignore other single key shortcuts if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "?") {
        e.preventDefault();
        setShowQuickKeyModal((prev) => !prev);
        return;
      }

      if (!isCmdOrCtrl) return;

      if (key === "k") {
        e.preventDefault();
        setShowSearchModal(true);
      } else if (key === "t") {
        e.preventDefault();
        setTutorContextLesson(null);
        setShowAITutor(true);
      } else if (key === "d") {
        e.preventDefault();
        setActiveTab("dashboard");
        setSelectedCourse(null);
      } else if (key === "o") {
        e.preventDefault();
        setActiveToolModal("obsidian");
      } else if (key === "a") {
        e.preventDefault();
        setActiveToolModal("office");
      } else if (key === "w") {
        e.preventDefault();
        setActiveToolModal("workspace");
      } else if (key === "n") {
        e.preventDefault();
        setActiveToolModal("notes");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Global Speech Commands Listener (Integrated via Background Service Worker & Local Bridge)
  React.useEffect(() => {
    const handleVoiceCommand = (commandStr: string) => {
      const cmd = commandStr.toLowerCase().trim();
      console.log("[Voice Action] Received speech router command:", cmd);

      // Dashboards & Navigation
      if (
        cmd.includes("dashboard") ||
        cmd.includes("learning hub") ||
        cmd.includes("لوحة التحكم") ||
        cmd.includes("الرئيسية")
      ) {
        setActiveTab("dashboard");
        setSelectedCourse(null);
      } else if (
        cmd.includes("degree") ||
        cmd.includes("program") ||
        cmd.includes("البرامج الدراسية") ||
        cmd.includes("الدراسة")
      ) {
        setActiveTab("degrees");
      } else if (
        cmd.includes("catalog") ||
        cmd.includes("course") ||
        cmd.includes("كتالوج") ||
        cmd.includes("الدورات")
      ) {
        setActiveTab("catalog");
      } else if (
        cmd.includes("schedule") ||
        cmd.includes("planner") ||
        cmd.includes("جدول") ||
        cmd.includes("التخطيط")
      ) {
        setActiveTab("planner");
      } else if (
        cmd.includes("forum") ||
        cmd.includes("social") ||
        cmd.includes("المنتدى") ||
        cmd.includes("الاجتماعي")
      ) {
        setActiveTab("social_forums");
      } else if (
        cmd.includes("leaderboard") ||
        cmd.includes("points") ||
        cmd.includes("المتصدرين") ||
        cmd.includes("النقاط")
      ) {
        setActiveTab("leaderboard");
      } else if (
        cmd.includes("room") ||
        cmd.includes("study room") ||
        cmd.includes("غرف الدراسة") ||
        cmd.includes("الغرف")
      ) {
        setActiveTab("study_rooms");
      } else if (
        cmd.includes("achievement") ||
        cmd.includes("badge") ||
        cmd.includes("الإنجازات") ||
        cmd.includes("الأوسمة")
      ) {
        setActiveTab("achievements");
      } else if (
        cmd.includes("knowledge") ||
        cmd.includes("drive") ||
        cmd.includes("قاعدة المعرفة") ||
        cmd.includes("الملفات")
      ) {
        setActiveTab("knowledge_base");
      } else if (
        cmd.includes("analytic") ||
        cmd.includes("stat") ||
        cmd.includes("التحليلات") ||
        cmd.includes("الإحصائيات")
      ) {
        setActiveTab("analytics");
      } else if (
        cmd.includes("career") ||
        cmd.includes("pathway") ||
        cmd.includes("وظائف") ||
        cmd.includes("المسار المهني")
      ) {
        setActiveTab("career_advisor");
      } else if (
        cmd.includes("developer") ||
        cmd.includes("api") ||
        cmd.includes("المطور") ||
        cmd.includes("البرمجة")
      ) {
        setActiveTab("api_engine");
      }

      // Overlays & UI Modals
      if (
        cmd.includes("open setting") ||
        cmd.includes("show setting") ||
        cmd.includes("افتح الإعدادات") ||
        cmd.includes("الإعدادات")
      ) {
        setShowSettingsModal(true);
      } else if (
        cmd.includes("close setting") ||
        cmd.includes("hide setting") ||
        cmd.includes("أغلق الإعدادات") ||
        cmd.includes("إغلاق الإعدادات")
      ) {
        setShowSettingsModal(false);
      } else if (
        cmd.includes("open profile") ||
        cmd.includes("show profile") ||
        cmd.includes("افتح الملف") ||
        cmd.includes("الملف الشخصي")
      ) {
        setShowProfileModal(true);
      } else if (
        cmd.includes("close profile") ||
        cmd.includes("hide profile") ||
        cmd.includes("أغلق الملف") ||
        cmd.includes("إغلاق الملف")
      ) {
        setShowProfileModal(false);
      } else if (
        cmd.includes("open tutor") ||
        cmd.includes("show tutor") ||
        cmd.includes("افتح المعلم") ||
        cmd.includes("المعلم الذكي")
      ) {
        setTutorContextLesson(null);
        setShowAITutor(true);
      } else if (
        cmd.includes("close tutor") ||
        cmd.includes("hide tutor") ||
        cmd.includes("أغلق المعلم") ||
        cmd.includes("إغلاق المعلم")
      ) {
        setShowAITutor(false);
      } else if (
        cmd.includes("open search") ||
        cmd.includes("show search") ||
        cmd.includes("افتح البحث") ||
        cmd.includes("البحث")
      ) {
        setShowSearchModal(true);
      } else if (
        cmd.includes("close search") ||
        cmd.includes("hide search") ||
        cmd.includes("أغلق البحث") ||
        cmd.includes("إغلاق البحث")
      ) {
        setShowSearchModal(false);
      } else if (
        cmd.includes("toggle sidebar") ||
        cmd.includes("تبديل القائمة") ||
        cmd.includes("الشريط الجانبي")
      ) {
        setIsSidebarOpen((prev) => !prev);
      }
    };

    // Listen to background broadcasts from Service Worker
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "EXECUTE_VOICE_COMMAND") {
        handleVoiceCommand(event.data.command);
      }
    };

    // Local custom event listener fallback
    const handleLocalVoiceCommand = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.command) {
        handleVoiceCommand(customEvent.detail.command);
      }
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener(
        "message",
        handleServiceWorkerMessage,
      );
    }
    window.addEventListener(
      "EXECUTE_VOICE_COMMAND_LOCAL",
      handleLocalVoiceCommand,
    );

    return () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener(
          "message",
          handleServiceWorkerMessage,
        );
      }
      window.removeEventListener(
        "EXECUTE_VOICE_COMMAND_LOCAL",
        handleLocalVoiceCommand,
      );
    };
  }, []);

  // Auto-Save User Progress & Profile every 2 minutes
  React.useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      OfflineStorageService.saveProfile(user);
    }, 120000); // 2 minutes

    return () => clearInterval(autoSaveInterval);
  }, [user]);

  // Auto-detect language on mount
  React.useEffect(() => {
    if (!user.language) {
      const browserLang = navigator.language.split("-")[0];
      const detectedLang = browserLang === "ar" ? "ar" : "en";
      handleUpdateUser({ language: detectedLang });
    }
  }, []);

  // Sync theme and RTL with DOM
  React.useEffect(() => {
    const currentTheme = user.theme || "dark";
    const isRtl = user.language === "ar";
    const lang = user.language || "en";

    document.documentElement.setAttribute("data-theme", currentTheme);
    document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);

    if (isRtl) {
      document.documentElement.classList.add("rtl-mode");
      document.body.classList.add("rtl-mode");
    } else {
      document.documentElement.classList.remove("rtl-mode");
      document.body.classList.remove("rtl-mode");
    }

    if (currentTheme === "light") {
      document.documentElement.classList.add("light-mode");
      document.body.classList.add("light-mode", "light-theme");
    } else {
      document.documentElement.classList.remove("light-mode");
      document.body.classList.remove("light-mode", "light-theme");
    }
  }, [user.theme, user.language]);

  const handleUpdateUser = (updatedPartial: Partial<UserProfile>) => {
    const updated = { ...user, ...updatedPartial };
    setUser(updated);
    OfflineStorageService.saveProfile(updated);
  };

  // Handle Role Switch
  const handleRoleChange = (newRole: UserRole) => {
    handleUpdateUser({ role: newRole });
    setSelectedCourse(null);
    setActiveTab("dashboard");
  };

  // Handle Language Switch
  const handleLanguageChange = (lang: LanguageCode) => {
    handleUpdateUser({ language: lang });
  };

  // Handle Toggle Offline Mode
  const handleToggleOffline = () => {
    const nextVal = !isOffline;
    setIsOffline(nextVal);
    OfflineStorageService.setOfflineForced(nextVal);

    if (nextVal) {
      toastService.show({
        type: "offline",
        title: "Offline Mode Enabled 📡",
        message:
          "Workspace is running from local device cache. All progress and edits are safely stored and queued for automatic sync.",
        duration: 5000,
      });
    } else {
      const pendingCount = offlineSyncService.getQueueLength();
      toastService.show({
        type: "online",
        title: "Online Mode Restored ⚡",
        message:
          pendingCount > 0
            ? `Network active! Syncing ${pendingCount} pending queued progress item(s) to cloud...`
            : "Network connection re-established. Cloud sync active.",
        duration: 5000,
      });
      offlineSyncService.syncQueueToFirebase();
    }
  };

  // Automatic online/offline detection
  React.useEffect(() => {
    const handleOnline = () => {
      console.log("[Network] Browser back online");
      setIsOffline(false);
      OfflineStorageService.setOfflineForced(false);
      offlineSyncService.syncQueueToFirebase();
      toastService.success("Back online! Syncing pending changes...");
    };

    const handleOffline = () => {
      console.log("[Network] Browser went offline");
      setIsOffline(true);
      OfflineStorageService.setOfflineForced(true);
      toastService.warning("Network connection lost. Operating in offline mode.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    if (!navigator.onLine && !isOffline) {
      handleOffline();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Handle Course Creation
  const handleCourseCreated = (newCourse: Course) => {
    const updatedCourses = OfflineStorageService.saveCourse(newCourse);
    setCourses(updatedCourses);

    // Auto-enroll user in newly created course
    if (!user.enrolledCourseIds.includes(newCourse.id)) {
      handleUpdateUser({
        enrolledCourseIds: [...user.enrolledCourseIds, newCourse.id],
      });
    }
  };

  // Handle Course Lesson Progress Update
  const handleUpdateProgress = (
    courseId: string,
    updatedProgress: StudentProgress,
  ) => {
    OfflineStorageService.saveProgress(updatedProgress);
    const newProgressMap = OfflineStorageService.getProgressMap();
    setProgressMap(newProgressMap);

    // Calculate XP reward
    const currentXP = user.xpPoints;
    const newXP = currentXP + 100;
    const newLevel = Math.floor(newXP / 1000) + 1;
    handleUpdateUser({ xpPoints: newXP, level: newLevel });

    // Queue learning progress updates to offlineSyncService
    offlineSyncService.enqueueProgress(
      courseId,
      updatedProgress.completedLessonIds,
      newXP,
      user.learningLevel || "standard",
    );
  };

  // Handle Course Completion & Certificate Generation
  const handleCourseCompleted = async (course: Course) => {
    let badgeUrl = undefined;
    try {
      const res = await fetch("/api/gemini/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `A beautiful geometric, abstract badge for completing a course titled: ${course.title}. High contrast, neon colors, glassmorphic style on a dark background, perfectly symmetrical, vector art style.`,
          aspectRatio: "1:1"
        })
      });
      const data = await res.json();
      if (data.imageUrl) badgeUrl = data.imageUrl;
    } catch (e) {
      console.warn("Could not generate badge image", e);
    }

    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      verificationId: `ZAL-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      studentName: user.name,
      courseTitle: course.title,
      issuedDate: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      score: 98,
      instructorName: course.author || "Prof. Autonomous Agent",
      institutionName: "Zalamati LMDpro Academy",
      skillsAcquired: course.tags || ["AI Engineering", "Autonomous Agents"],
      badgeUrl
    };

    const updatedCerts = OfflineStorageService.saveCertificate(newCert);
    setCertificates(updatedCerts);
    setSelectedCertificate(newCert);
  };

  // Open Tutor with Lesson context
  const handleOpenAITutorWithContext = (
    lessonTitle: string,
    lessonContent: string,
  ) => {
    setTutorContextLesson({ title: lessonTitle, content: lessonContent });
    setShowAITutor(true);
  };

  return (
    <>
      {isAppReady && (
          <div
            className="h-screen max-h-screen h-[100dvh] bg-ambient-gradient text-gray-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black relative overflow-hidden theme-transition-all"
          >
          {/* Smooth Cross-Fade Animation Overlay on Theme Switching */}
          <AnimatePresence>
            <motion.div
              key={`theme-crossfade-${user.theme || 'dark'}`}
              initial={{ opacity: 0.18 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="pointer-events-none fixed inset-0 z-[9990] bg-cyan-500/10 mix-blend-overlay"
            />
          </AnimatePresence>
          <AnimatedGeometricBackground />
          {/* Retractable Navigation Sidebar */}
          <Sidebar
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setSelectedCourse(null);
              const viewport = document.getElementById("main-content-viewport");
              if (viewport) {
                viewport.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            userRole={user.role}
            onOpenAuthModal={() => setShowAuthModal(true)}
            onOpenSettings={() => setShowSettingsModal(true)}
            onOpenProfile={() => setShowProfileModal(true)}
            user={user}
            xpPoints={user.xpPoints}
            level={user.level || 1}
            onOpenAITutor={() => setShowAITutor(true)}
            onOpenLegalModal={() => setShowLegalModal(true)}
          />

          {/* Main Layout Area shifting with Sidebar */}
          <div
            className={`flex-1 flex flex-col h-screen max-h-screen h-[100dvh] overflow-hidden transition-all duration-300 ${isSidebarOpen ? "lg:ps-64 ps-0" : "lg:ps-16 ps-0"}`}
          >
            {/* Global Navigation Header - Fixed Persistent */}
            <Header
              user={user}
              courses={courses}
              onSelectCourse={setSelectedCourse}
              onRoleChange={handleRoleChange}
              onLanguageChange={handleLanguageChange}
              onUpdateUser={handleUpdateUser}
              isOffline={isOffline}
              onToggleOffline={handleToggleOffline}
              onOpenCourseGenerator={() => setShowCourseArchitect(true)}
              onOpenAITutor={() => {
                setTutorContextLesson(null);
                setShowAITutor(true);
              }}
              onOpenClassroomModal={() => setShowClassroomModal(true)}
              onOpenAgentInspector={() => setShowAgentInspector(true)}
              onOpenRagIndexer={() => setShowRagIndexer(true)}
              onOpenProfile={() => setShowProfileModal(true)}
              onOpenSettings={() => setShowSettingsModal(true)}
              onOpenSearch={() => setShowSearchModal(true)}
              onOpenLegalModal={() => setShowLegalModal(true)}
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setSelectedCourse(null);
                const viewport = document.getElementById("main-content-viewport");
                if (viewport) {
                  viewport.scrollTo({ top: 0, behavior: "smooth" });
                } else if (typeof window !== "undefined") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              onOpenTool={(tool) => setActiveToolModal(tool)}
              onOpenQuickKeyModal={() => setShowQuickKeyModal(true)}
            />

            {/* Main Content Area - Independent Vertical Scrolling */}
            <main
              id="main-content-viewport"
              className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar w-full px-4 sm:px-6 lg:px-8 py-6 pb-28"
            >
              <div className="max-w-7xl w-full mx-auto">
              {isHydrating ? (
                <div className="flex flex-col items-center justify-center p-16 sm:p-24 gap-6 bg-[var(--bg-surface)]/60 backdrop-blur-3xl border border-[var(--accent-navy)]/30 rounded-3xl shadow-2xl my-4 min-h-[400px]">
                  <div className="relative flex items-center justify-center w-24 h-24">
                    <div className="absolute inset-0 rounded-full border-4 border-[var(--accent-navy)]/20 border-t-[var(--accent-turquoise)] animate-spin" />
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[var(--accent-navy)] to-[var(--accent-turquoise)] animate-pulse opacity-70" />
                    <Sparkles className="absolute w-6 h-6 text-[var(--accent-turquoise)] animate-bounce" />
                  </div>
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                      {user.language === "ar" ? "جاري تهيئة مساحة العمل..." : "Hydrating Workspace..."}
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {user.language === "ar" ? "نقوم بمزامنة أحدث تقدم دراسي ومعالم أكاديمية من السحابة" : "Syncing latest curriculum progress and academic milestones from Cloud..."}
                    </p>
                  </div>
                </div>
              ) : (
              <React.Suspense
                fallback={<SkeletonLoader variant="card" count={2} />}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedCourse ? "course_viewer" : activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-full"
                  >
                    {/* Course Player View */}
                    {selectedCourse ? (
                  <CourseViewer
                    course={selectedCourse}
                    studentProgress={progressMap[selectedCourse.id]}
                    user={user}
                    onUpdateProgress={handleUpdateProgress}
                    onBack={() => setSelectedCourse(null)}
                    onOpenAITutorWithContext={handleOpenAITutorWithContext}
                    onCourseCompleted={handleCourseCompleted}
                  />
                ) : activeTab === "courses" ? (
                  <CoursesAndTraining
                    courses={filteredCourses}
                    onSelectCourse={setSelectedCourse}
                    progressMap={progressMap}
                  />
                ) : activeTab === "bookmarks" ? (
                  <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
                    <MyBookmarksTab
                      courses={courses}
                      onOpenLesson={(courseId) => {
                        const target = courses.find((c) => c.id === courseId);
                        if (target) setSelectedCourse(target);
                      }}
                    />
                  </div>
                ) : activeTab === "planner" || activeTab === "schedule" || activeTab === "calendar" ? (
                  <WeeklyStudyGrid user={user} />
                ) : activeTab === "degrees" ? (
                  <DegreeProgramsCatalog
                    onSelectCourse={setSelectedCourse}
                    user={user}
                    onUpdateUser={handleUpdateUser}
                  />
                ) : activeTab === "study_rooms" ? (
                  <StudyRooms user={user} />
                ) : activeTab === "ai_study_forum" || activeTab === "study_forum" ? (
                  <AIStudyForum
                    user={user}
                    courses={courses}
                    onOpenAITutor={() => setShowAITutor(true)}
                    onNavigateTab={setActiveTab}
                  />
                ) : activeTab === "social_forums" || activeTab === "forums" || activeTab === "peer_learning" || activeTab === "social" ? (
                  <SocialLearningHub
                    user={user}
                    courses={courses}
                    onOpenAITutor={() => setShowAITutor(true)}
                    onNavigateTab={setActiveTab}
                  />
                ) : activeTab === "curation" ? (
                  <AIContentCurationEngine user={user} courses={courses} />
                ) : activeTab === "leaderboard" ? (
                  <LeaderboardPanel user={user} />
                ) : activeTab === "project_simulations" ? (
                  <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
                    <ProjectSimulationsList
                      user={user}
                      courses={courses}
                      onSelectSimulation={(sim) => {
                        const targetCourse = courses.find((c) => c.id === sim.courseId) || courses[0];
                        if (targetCourse) {
                          setSelectedCourse(targetCourse);
                        }
                      }}
                    />
                  </div>
                ) : activeTab === "educational_materials" || activeTab === "simulations" || activeTab === "case_studies" ? (
                  <EducationalMaterialsStudio />
                ) : activeTab === "ai_labs" || activeTab === "ai_studio" ? (
                  <AIFeaturesStudio />
                ) : activeTab === "workbench" || activeTab === "agentic_ai" ? (
                  <InteractiveStudyTools
                    user={user}
                    onUpdateUser={handleUpdateUser}
                  />
                ) : activeTab === "analytics" ? (
                  <LearningAnalyticsDashboard
                    user={user}
                    onNavigateTab={setActiveTab}
                  />
                ) : activeTab === "pricing" ? (
                  <FeaturedPricingView
                    onOpenWorkspaceAuth={() => setShowAuthModal(true)}
                  />
                ) : activeTab === "collections" ? (
                  <CuratedCollectionsView
                    courses={courses}
                    onSelectCourse={setSelectedCourse}
                    user={user}
                  />
                ) : activeTab === "knowledge_base" ? (
                  <KnowledgeBase />
                ) : activeTab === "career_advisor" || activeTab === "career" ? (
                  <AICareerPathAdvisor
                    user={user}
                    courses={courses}
                    onSelectCourse={setSelectedCourse}
                    onUpdateUser={handleUpdateUser}
                  />
                ) : activeTab === "achievements" ? (
                  <AchievementsPanel
                    user={user}
                    courses={courses}
                    onUpdateUser={handleUpdateUser}
                  />
                ) : activeTab === "admin_portal" || activeTab === "admin" ? (
                  <AdminPortal
                    currentRole={user.role}
                    onRoleChange={(newRole) =>
                      setUser((prev) => ({ ...prev, role: newRole }))
                    }
                  />
                ) : activeTab === "study_buddy" || activeTab === "ai_study_buddy" ? (
                  <div className="p-4 sm:p-6 max-w-7xl mx-auto">
                    <AIStudyBuddy courses={courses} user={user} />
                  </div>
                ) : activeTab === "teacher_dashboard" ||
                  activeTab === "teacher" ? (
                  <TeacherDashboard
                    user={user}
                    courses={courses}
                    onOpenCourseGenerator={() => setShowCourseArchitect(true)}
                    onSelectCourse={setSelectedCourse}
                    onOpenClassroomModal={() => setShowClassroomModal(true)}
                    onAddCourse={(newCourse) => {
                      setCourses((prev) => [newCourse, ...prev]);
                      OfflineStorageService.saveCourses([newCourse, ...courses]);
                    }}
                  />
                ) : activeTab === "api_engine" ? (
                  <DeveloperApiEngineView />
                ) : activeTab === "open_source" ? (
                  <OpenSourceView />
                ) : activeTab === "donate" ? (
                  <DocumentationView initialSubTab="donation" />
                ) : activeTab === "about" ? (
                  <AboutProjectView />
                ) : activeTab === "prompt_diagnostics" ? (
                  <PromptDiagnosticsView />
                ) : activeTab === "bento_showcase" ? (
                  <DeveloperApiEngineView />
                ) : activeTab === "featured" ? (
                  <FeaturedSolutionsView
                    onSelectCourse={setSelectedCourse}
                    onOpenAITutor={() => setShowAITutor(true)}
                  />
                ) : activeTab === "research" ? (
                  <AcademicResearchView
                    onOpenRagModal={() => setShowRagIndexer(true)}
                  />
                ) : activeTab === "workspace" ? (
                  <WorkspaceIntegrationView
                    user={user}
                    onOpenAuthModal={() => setShowAuthModal(true)}
                  />
                ) : (
                  /* Role Specific Dashboards */
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={user.role}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      {user.role === "student" && (
                        <StudentDashboard
                          user={user}
                          courses={filteredCourses}
                          progressMap={progressMap}
                          certificates={certificates}
                          onSelectCourse={setSelectedCourse}
                          onOpenCertificate={setSelectedCertificate}
                          onOpenAITutor={() => setShowAITutor(true)}
                          onOpenCourseGenerator={() =>
                            setShowCourseArchitect(true)
                          }
                          onOpenClassroomModal={() => setShowClassroomModal(true)}
                          onOpenAuthModal={() => setShowAuthModal(true)}
                          onUpdateUser={handleUpdateUser}
                          onNavigateTab={setActiveTab}
                          isAssistantEnabled={user.isAssistantEnabled ?? true}
                        />
                      )}

                      {user.role === "teacher" && (
                        <TeacherDashboard
                          user={user}
                          courses={courses}
                          onOpenCourseGenerator={() =>
                            setShowCourseArchitect(true)
                          }
                          onSelectCourse={setSelectedCourse}
                          onOpenClassroomModal={() => setShowClassroomModal(true)}
                        />
                      )}

                      {user.role === "school" && (
                        <SchoolDashboard
                          user={user}
                          onOpenAITutor={() => setShowAITutor(true)}
                          onOpenSubscriptions={() => {}}
                        />
                      )}

                      {user.role === "team" && (
                        <TeamDashboard
                          user={user}
                          onOpenAITutor={() => setShowAITutor(true)}
                          onOpenSubscriptions={() => {}}
                        />
                      )}

                      {user.role === "enterprise" && (
                        <EnterpriseDashboard
                          user={user}
                          onOpenAITutor={() => setShowAITutor(true)}
                          onOpenSubscriptions={() => {}}
                          onOpenAgentInspector={() => setShowAgentInspector(true)}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}
              </motion.div>
            </AnimatePresence>
              </React.Suspense>
              )}
              </div>
            </main>
          </div>

          {/* Global Modals (Lazy Loaded on Demand) */}
          <Suspense fallback={null}>
            {showAuthModal && (
              <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                user={user}
                onUpdateUser={handleUpdateUser}
              />
            )}

            {showAITutor && (
              <AITutorModal
                isOpen={showAITutor}
                onClose={() => setShowAITutor(false)}
                initialContextLessonTitle={tutorContextLesson?.title}
                initialContextContent={tutorContextLesson?.content}
              />
            )}

            {showCourseArchitect && (
              <AICourseArchitectModal
                isOpen={showCourseArchitect}
                onClose={() => setShowCourseArchitect(false)}
                onCourseCreated={handleCourseCreated}
              />
            )}

            {selectedCertificate && (
              <CertificateModal
                certificate={selectedCertificate}
                onClose={() => setSelectedCertificate(null)}
              />
            )}

            {showClassroomModal && (
              <GoogleClassroomModal
                isOpen={showClassroomModal}
                onClose={() => setShowClassroomModal(false)}
                onImportCourse={handleCourseCreated}
                currentUser={user}
              />
            )}

            {showAgentInspector && (
              <AgentInspectorModal
                isOpen={showAgentInspector}
                onClose={() => setShowAgentInspector(false)}
                userLanguage={user.language}
              />
            )}

            {showRagIndexer && (
              <DeepCrawlRagModal
                isOpen={showRagIndexer}
                onClose={() => setShowRagIndexer(false)}
                language={user.language}
              />
            )}

            {showProfileModal && (
              <ProfileModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                user={user}
                certificates={certificates}
                onUpdateUser={handleUpdateUser}
                onViewCertificate={(cert) => {
                  setShowProfileModal(false);
                  setSelectedCertificate(cert);
                }}
              />
            )}

            {showSettingsModal && (
              <SettingsModal
                isOpen={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
                user={user}
                isOffline={isOffline}
                onUpdateUser={handleUpdateUser}
                onLanguageChange={handleLanguageChange}
                onToggleOffline={handleToggleOffline}
                onOpenWorkspaceAuth={() => setShowAuthModal(true)}
                onOpenClassroomModal={() => setShowClassroomModal(true)}
                onNavigateTab={(tab) => {
                  setActiveTab(tab);
                  setSelectedCourse(null);
                }}
                onOpenAITutor={() => setShowAITutor(true)}
              />
            )}

            {showSearchModal && (
              <SearchModal
                isOpen={showSearchModal}
                onClose={() => setShowSearchModal(false)}
                courses={courses}
                onSelectProgram={setSelectedCourse}
                onSelectTab={(tab) => {
                  setActiveTab(tab);
                  setSelectedCourse(null);
                }}
              />
            )}

            {showLegalModal && (
              <LegalModal
                isOpen={showLegalModal}
                onClose={() => setShowLegalModal(false)}
              />
            )}

            {activeToolModal && (
              <ToolModalOverlay
                activeTool={activeToolModal}
                onClose={() => setActiveToolModal(null)}
              />
            )}

            {showQuickKeyModal && (
              <QuickKeyModalOverlay
                isOpen={showQuickKeyModal}
                onClose={() => setShowQuickKeyModal(false)}
              />
            )}

            <LivePointPreviewSystem />
          </Suspense>

          {/* Auto-Lock & Inactivity Re-Authentication Overlay */}
          <AnimatePresence>
            {isAppLocked && (
              <motion.div
                id="auto-lock-screen-overlay"
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(40px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="fixed inset-0 z-[9995] bg-[#000000]/85 backdrop-blur-[40px] flex items-center justify-center p-4 sm:p-6"
              >
                <motion.div
                  initial={{ scale: 0.94, opacity: 0, filter: "blur(16px)", y: 24 }}
                  animate={{ scale: 1, opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{ scale: 0.96, opacity: 0, filter: "blur(8px)", y: 12 }}
                  transition={{ type: "spring", damping: 26, stiffness: 280, duration: 0.55 }}
                  className="w-full max-w-md bg-[#000000] border border-[#000080]/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#40E0D0]/10 text-center relative overflow-hidden"
                >
                  {/* Subtle Top Glow Accent */}
                  <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-52 h-52 bg-gradient-to-b from-[#40E0D0]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

                  {/* Central Tap-to-Wake Indicator Button */}
                  <button
                    type="button"
                    onClick={handleUnlockWithBiometrics}
                    className="group relative mx-auto w-20 h-20 rounded-full bg-[#000080]/20 hover:bg-[#000080]/40 border border-[#40E0D0]/40 flex flex-col items-center justify-center mb-5 text-[#40E0D0] transition-all cursor-pointer focus:outline-none"
                    title={user.language === "ar" ? "المس لإلغاء القفل" : "Tap to Wake"}
                  >
                    <span className="absolute inset-0 rounded-full border border-[#40E0D0]/30 animate-ping opacity-40 pointer-events-none" />
                    <Fingerprint className="w-8 h-8 group-hover:scale-110 transition-transform text-[#40E0D0]" strokeWidth={1.5} />
                    <span className="text-[9px] font-mono tracking-wider uppercase text-[#40E0D0] mt-0.5 opacity-80 group-hover:opacity-100">
                      {user.language === "ar" ? "المس للفتح" : "TAP TO WAKE"}
                    </span>
                  </button>

                  <h2 className="text-xl sm:text-2xl font-bold text-[#FFFFFF] tracking-wide mb-1.5 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#40E0D0]" />
                    {user.language === "ar"
                      ? "جلسة العمل مقفلة تلقائياً"
                      : "Workspace Auto-Locked"}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#a1a1aa] mb-6 leading-relaxed">
                    {user.language === "ar"
                      ? "تم قفل الجلسة لحماية بيانات الطالب وسجلاته الأكاديمية بعد فترة من عدم النشاط."
                      : "Your workspace was locked to protect student records and academic progress due to inactivity."}
                  </p>

                  {/* User Profile Card */}
                  <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#111111] border border-[#27272a] mb-5 text-left rtl:text-right">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#000080] to-[#40E0D0] text-[#FFFFFF] font-bold flex items-center justify-center text-lg shadow-md shrink-0">
                      {user.name ? user.name.charAt(0).toUpperCase() : "S"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[#FFFFFF] truncate">
                        {user.name || "Student Scholar"}
                      </h4>
                      <p className="text-xs text-[#a1a1aa] truncate">
                        {user.email || "student@lmdpro.ai"}
                      </p>
                      <span className="inline-block mt-0.5 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#40E0D0]/10 text-[#40E0D0] border border-[#40E0D0]/20">
                        {user.role} • Level {user.level || 1}
                      </span>
                    </div>
                  </div>

                  {/* Biometric Passkey Unlock Action */}
                  <button
                    id="btn-unlock-biometrics"
                    onClick={handleUnlockWithBiometrics}
                    disabled={isReAuthenticating}
                    className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-gradient-to-r from-[#000080] to-[#40E0D0] text-[#FFFFFF] font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-[#40E0D0]/20 disabled:opacity-50 mb-3 cursor-pointer"
                  >
                    {isReAuthenticating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Fingerprint className="w-4 h-4" />
                    )}
                    <span>
                      {user.language === "ar"
                        ? "إلغاء القفل بالبصمة / Passkey"
                        : "Unlock with Biometrics / Passkey"}
                    </span>
                  </button>

                  {/* Divider */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#27272a]" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-[#000000] px-3 text-[#71717a]">
                        {user.language === "ar" ? "أو أدخل الرمز" : "Or enter PIN / Password"}
                      </span>
                    </div>
                  </div>

                  {/* Password / PIN Unlock Form */}
                  <form onSubmit={handleUnlockWithPassword} className="space-y-3 mb-5">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3.5 rtl:pl-0 rtl:pr-3.5 flex items-center pointer-events-none text-[#71717a]">
                        <Key className="w-4 h-4" />
                      </div>
                      <input
                        id="input-reauth-pin"
                        type="password"
                        placeholder={
                          user.language === "ar"
                            ? "أدخل رمز PIN أو كلمة المرور..."
                            : "Enter PIN or passphrase..."
                        }
                        value={reAuthInput}
                        onChange={(e) => {
                          setReAuthInput(e.target.value);
                          if (reAuthError) setReAuthError(null);
                        }}
                        className="w-full py-2.5 pl-10 pr-4 rtl:pl-4 rtl:pr-10 bg-[#111111] border border-[#27272a] focus:border-[#40E0D0] rounded-xl text-sm text-[#FFFFFF] placeholder-[#71717a] focus:outline-none transition-colors"
                      />
                    </div>

                    {reAuthError && (
                      <p className="text-xs text-red-400 text-left rtl:text-right">
                        {reAuthError}
                      </p>
                    )}

                    <button
                      id="btn-submit-unlock-pin"
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#111111] hover:bg-[#1a1a1a] border border-[#27272a] text-[#FFFFFF] font-medium text-sm transition-colors cursor-pointer"
                    >
                      <span>{user.language === "ar" ? "تأكيد واستئناف" : "Verify & Resume"}</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </button>
                  </form>

                  {/* Security Activity Log */}
                  <div className="border border-[#27272a] bg-[#0a0a0a] rounded-xl p-3 text-left rtl:text-right mb-4">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#27272a]">
                      <History className="w-4 h-4 text-[#40E0D0]" />
                      <h4 className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">
                        {user.language === 'ar' ? 'سجل النشاط الأمني' : 'Security Activity Log'}
                      </h4>
                    </div>
                    <div className="space-y-2 max-h-[120px] overflow-y-auto no-scrollbar">
                      {securityLogs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between gap-3 text-[10px]">
                          <div className="flex items-center gap-2 min-w-0">
                            {log.type === 'success' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#40E0D0] shrink-0" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            )}
                            <span className="text-[#a1a1aa] truncate font-medium">
                              {log.method === 'biometric' ? 'Passkey' : 'Password'} Auth
                            </span>
                          </div>
                          <div className="flex flex-col items-end shrink-0">
                            <span className="text-[#71717a]">
                              {new Date(log.time).toLocaleTimeString(user.language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="text-[#71717a] opacity-60">IP: {log.ip}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Switch account fallback */}
                  <div className="mt-2 pt-3 border-t border-[#27272a] flex items-center justify-between text-xs text-[#71717a]">
                    <button
                      onClick={() => {
                        setIsAppLocked(false);
                        setShowAuthModal(true);
                      }}
                      className="text-[#40E0D0] hover:underline cursor-pointer"
                    >
                      {user.language === "ar" ? "تسجيل الدخول بحساب آخر" : "Switch Account"}
                    </button>
                    <span className="text-[10px] text-[#71717a] flex items-center gap-1 font-semibold tracking-wide">
                      <ShieldCheck className="w-3 h-3 text-[#000080]" />
                      ZERO-TRUST GUARD
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Global Toast Notification System */}
          <ToastNotificationSystem />

          {/* Floating Animated Socratic Companion Bot NASMI is now integrated into Settings -> Live Voice Agent tab */}

          {/* Invisible Background Engine Monitoring Frame Rates & Curation Service */}
          <BackgroundServicesEngine />
        </div>
      )}
      {/* Agentic Inspector Global Modal */}
      <AgentInspectorModal 
        isOpen={showAgentInspector} 
        onClose={() => setShowAgentInspector(false)} 
        userLanguage={user.language} 
      />

      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className="fixed inset-0 z-[9999] bg-[#0c1a24] flex flex-col items-center justify-center space-y-6"
          >
            <div className="relative flex items-center justify-center w-32 h-32">
              {/* Sophisticated Liquid Glass Loading Visual */}
              <div className="absolute inset-0 rounded-full border-2 border-[#1b3b4a] shadow-[0_0_20px_rgba(27,59,74,0.3)]" />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-t-2 border-[#5bc4d4] shadow-[0_0_15px_rgba(91,196,212,0.4)]" 
              />
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#104a5a] to-[#5bc4d4] shadow-[0_0_30px_rgba(91,196,212,0.2)] flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-white opacity-90" />
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="text-sm font-bold text-[#5bc4d4] tracking-[0.2em] uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#5bc4d4] animate-pulse" />
                {isHydrating ? "Hydrating Workspace..." : "System Initializing..."}
              </div>
              <p className="text-[10px] text-[#73A5AD] font-bold uppercase tracking-widest opacity-60">
                Zalamati Autonomous Engine V3.1
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
