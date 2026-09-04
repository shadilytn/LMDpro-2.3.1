import React from "react";
import { UserProfile, LanguageCode, UserRole, VoiceSettings } from "../shared/types";
import {
  X,
  Settings,
  User,
  Cpu,
  Globe,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  Key,
  ShieldCheck,
  BookOpen,
  Check,
  Sliders,
  Sparkles,
  Layers,
  Bot,
  Mic,
  Terminal,
  PenTool,
  ArrowUpRight,
  Database,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Activity,
  RotateCw,
  Trash2,
  Plus,
  Volume2,
  Radio,
  MessageSquare,
  Ear,
  Compass,
  FileText,
  Lock,
} from "lucide-react";
import { getTranslation } from "../shared/localization";
import {
  OfflineStorageService,
  SyncAuditItem,
} from "../services/offlineStorage";
import { LiveVoiceAgent } from "./LiveVoiceAgent";
import { useTheme } from "./theme/ThemeProvider";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  isOffline: boolean;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onLanguageChange: (lang: LanguageCode) => void;
  onToggleOffline: () => void;
  onOpenWorkspaceAuth: () => void;
  onOpenClassroomModal: () => void;
  onNavigateTab?: (tab: string) => void;
  onOpenAITutor?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  isOffline,
  onUpdateUser,
  onLanguageChange,
  onToggleOffline,
  onOpenWorkspaceAuth,
  onOpenClassroomModal,
  onNavigateTab,
  onOpenAITutor,
}) => {
  const [activeTab, setActiveTab] = React.useState<
    "general" | "ai" | "integrations" | "privacy" | "syncAudit" | "voice"
  >("general");
  const [geminiKey, setGeminiKey] = React.useState(user.geminiApiKey || "");
  const [savedKeySuccess, setSavedKeySuccess] = React.useState(false);

  // Sync Audit Log state
  const [auditLogs, setAuditLogs] = React.useState<SyncAuditItem[]>([]);
  const [auditFilter, setAuditFilter] = React.useState<
    "all" | "queued" | "failed" | "synced"
  >("all");
  const [isRetryingSync, setIsRetryingSync] = React.useState(false);
  const [retrySummary, setRetrySummary] = React.useState<string | null>(null);
  const [isQuickStudyActive, setIsQuickStudyActive] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    const handleToggleQuickStudy = () => {
      setIsQuickStudyActive((prev) => !prev);
    };
    window.addEventListener("TOGGLE_QUICK_STUDY", handleToggleQuickStudy);
    return () => {
      window.removeEventListener("TOGGLE_QUICK_STUDY", handleToggleQuickStudy);
    };
  }, []);

  React.useEffect(() => {
    if (activeTab === "syncAudit") {
      loadAuditLogs();
    }
  }, [activeTab]);

  const loadAuditLogs = () => {
    const logs = OfflineStorageService.getSyncAuditLogs();
    setAuditLogs(logs);
  };

  const handleRetryFailed = async () => {
    setIsRetryingSync(true);
    setRetrySummary(null);
    const result = await OfflineStorageService.retryFailedSyncItems();
    loadAuditLogs();
    setIsRetryingSync(false);
    setRetrySummary(
      `Successfully retried ${result.retried} item(s) (${result.succeeded} synced).`,
    );
    setTimeout(() => setRetrySummary(null), 3500);
  };

  const handleAddSampleSyncItem = () => {
    OfflineStorageService.addSyncAuditItem({
      itemId: "quiz-cs101-manual",
      itemType: "QuizResult",
      courseId: "CS101",
      title: "Manual Quiz Submission Test",
      status: "queued",
      retryCount: 0,
    });
    loadAuditLogs();
  };

  const handleClearAuditLogs = () => {
    OfflineStorageService.clearSyncAuditLogs();
    loadAuditLogs();
  };

  const t = getTranslation(user.language);

  if (!isOpen) return null;

  const handleSaveApiKey = () => {
    onUpdateUser({ geminiApiKey: geminiKey });
    setSavedKeySuccess(true);
    setTimeout(() => setSavedKeySuccess(false), 2500);
  };

  const handleToggleTheme = (newTheme: "dark" | "light") => {
    setTheme(newTheme);
    onUpdateUser({ theme: newTheme });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-[#0b1820] border border-[#1b3a4a] text-white shadow-2xl flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-[#0d202b] border-b border-[#1c3e50] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Platform Settings & Configurations
              </h2>
              <p className="text-xs text-[#82a3b2]">
                Manage preferences, AI keys, integrations, and display themes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/40 hover:bg-black/70 text-gray-400 hover:text-white border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1c3e50] bg-[#09151c] px-6 text-xs font-medium text-[#82a3b2]">
          {[
            { id: "general", label: "General & Appearance", icon: Sliders },
            { id: "ai", label: "AI & Gemini Models", icon: Cpu },
            {
              id: "integrations",
              label: "Classroom & Workspace",
              icon: BookOpen,
            },
            {
              id: "privacy",
              label: "Privacy & PII Sanitizer",
              icon: ShieldCheck,
            },
            {
              id: "syncAudit",
              label: "Offline Sync Audit Log",
              icon: Activity,
            },
            { id: "voice", label: "Live Voice Agent", icon: Mic },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
                  isActive
                    ? "border-cyan-400 text-cyan-300 font-semibold bg-[#0d202b]/60"
                    : "border-transparent hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* TAB 1: GENERAL & APPEARANCE */}
          {activeTab === "general" && (
            <div className="space-y-5">
              {/* Theme Toggle Section */}
              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      Theme Mode Preference
                    </h3>
                    <p className="text-[#82a3b2]">
                      Choose between executive night dark mode or crisp daylight
                      mode
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => handleToggleTheme("dark")}
                    className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                      theme === "dark"
                        ? "bg-cyan-500/10 border-cyan-400 text-cyan-300 font-bold shadow-md"
                        : "bg-[#09151c] border-[#1a3848] text-gray-400 hover:text-white"
                    }`}
                  >
                    <Moon className="w-5 h-5 text-cyan-400" />
                    <div className="text-left">
                      <div className="text-xs font-bold">{t.themeDark}</div>
                      <div className="text-[10px] text-[#7193a2]">
                        Default Night Mode
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleToggleTheme("light")}
                    className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                      theme === "light"
                        ? "bg-cyan-500/10 border-cyan-400 text-cyan-300 font-bold shadow-md"
                        : "bg-[#09151c] border-[#1a3848] text-gray-400 hover:text-white"
                    }`}
                  >
                    <Sun className="w-5 h-5 text-cyan-400" />
                    <div className="text-left">
                      <div className="text-xs font-bold">{t.themeLight}</div>
                      <div className="text-[10px] text-[#7193a2]">
                        Crisp Daylight Mode
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Language Selection */}
              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      Platform Localization Language
                    </h3>
                    <p className="text-[#82a3b2]">
                      Translate degree curricula, AI tutoring, and system
                      actions into your preferred language
                    </p>
                  </div>
                  <Globe className="w-5 h-5 text-cyan-400" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { code: "en", flag: "🇺🇸", label: "English" },
                    { code: "es", flag: "🇪🇸", label: "Español" },
                    { code: "fr", flag: "🇫🇷", label: "Français" },
                    { code: "de", flag: "🇩🇪", label: "Deutsch" },
                    { code: "ar", flag: "🇸🇦", label: "العربية" },
                    { code: "ja", flag: "🇯🇵", label: "日本語" },
                    { code: "zh", flag: "🇨🇳", label: "中文" },
                    { code: "hi", flag: "🇮🇳", label: "हिन्दी" },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() =>
                        onLanguageChange(lang.code as LanguageCode)
                      }
                      className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                        user.language === lang.code
                          ? "bg-cyan-500/15 border-cyan-400 text-cyan-300 font-bold"
                          : "bg-[#09151c] border-[#1a3848] text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span className="text-xs">{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Offline Storage Toggle */}
              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">
                    Offline Storage & Offline Sync
                  </h3>
                  <p className="text-[#82a3b2]">
                    Cache entire degree courses, quizzes, and certificates in
                    local IndexedDB storage
                  </p>
                </div>
                <button
                  onClick={onToggleOffline}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                    isOffline
                      ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300"
                      : "bg-cyan-500/15 border-cyan-500/40 text-cyan-300"
                  }`}
                >
                  {isOffline ? (
                    <WifiOff className="w-4 h-4" />
                  ) : (
                    <Wifi className="w-4 h-4" />
                  )}
                  <span>
                    {isOffline ? "Offline Forced Active" : "Cloud Sync Active"}
                  </span>
                </button>
              </div>

              {/* Quick Study Mode & Focus Clock (Moved from Header) */}
              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">
                        Quick Study Mode & Focus Clock
                      </h3>
                      <p className="text-[#82a3b2]">
                        Micro-learning sprint filter (&lt;10 min) and daily study session timer preferences
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("TOGGLE_QUICK_STUDY"));
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                      isQuickStudyActive
                        ? "bg-cyan-500 text-black border-cyan-400 shadow-md font-bold"
                        : "bg-[#09151c] border-[#1a3848] text-gray-300 hover:text-white"
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>{isQuickStudyActive ? "Quick Mode ON (10m)" : "Standard Mode"}</span>
                  </button>
                </div>

                {/* Daily Target Focus Goal & Sprint Settings */}
                <div className="pt-2 border-t border-[#1a3848]/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#09151c] border border-[#1a3848] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">Daily Target Goal</span>
                      <span className="font-mono text-cyan-400 font-bold">{user.dailyStudyGoal || 60} min</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[30, 45, 60, 90, 120].map((mins) => (
                        <button
                          key={mins}
                          onClick={() => onUpdateUser({ dailyStudyGoal: mins })}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                            (user.dailyStudyGoal || 60) === mins
                              ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                              : "bg-[#0c1a24] text-gray-400 hover:text-white border border-[#1b3b4a]"
                          }`}
                        >
                          {mins}m
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#09151c] border border-[#1a3848] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">Focus Sprint Interval</span>
                      <span className="font-mono text-cyan-400 font-bold">25 min Focus</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {["15m Sprint", "25m Classic", "45m Deep", "50m Mastery"].map((label) => (
                        <span
                          key={label}
                          className="px-2 py-1 rounded-lg text-[10px] bg-[#0c1a24] text-[#82a3b2] border border-[#1b3b4a]"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reading Assistant Toggle */}
              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">
                    AI Reading Assistant
                  </h3>
                  <p className="text-[#82a3b2]">
                    Toggle the persistent reading assistant visibility.
                  </p>
                </div>
                <button
                  onClick={() =>
                    onUpdateUser({
                      isAssistantEnabled: !user.isAssistantEnabled,
                    })
                  }
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    user.isAssistantEnabled
                      ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300"
                      : "bg-cyan-500/15 border-cyan-500/40 text-cyan-300"
                  }`}
                >
                  {user.isAssistantEnabled ? "Enabled" : "Disabled"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: AI & GEMINI MODELS */}
          {activeTab === "ai" && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] space-y-4">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      Custom Gemini API Key
                    </h3>
                    <p className="text-[#82a3b2]">
                      Optionally enter your own Google AI Studio Gemini API Key
                      for zero-rate-limit tutoring and course generation
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#09151c] border border-[#1a3848] text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">
                      Key is encrypted and stored locally in memory/IndexedDB.
                    </span>
                    <button
                      onClick={handleSaveApiKey}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-all shadow-md flex items-center gap-1.5"
                    >
                      {savedKeySuccess ? (
                        <Check className="w-4 h-4 text-cyan-300" />
                      ) : (
                        <Key className="w-4 h-4" />
                      )}
                      <span>
                        {savedKeySuccess
                          ? "Key Saved Successfully!"
                          : "Save Gemini Key"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Active Model Roster & Cognitive Routing
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#09151c] border border-[#1a3848] space-y-1">
                    <span className="text-[10px] text-cyan-400 font-mono font-bold">
                      PRIMARY MACRO ENGINE
                    </span>
                    <h4 className="font-bold text-white">
                      Gemini 3.1 Pro & Flash
                    </h4>
                    <p className="text-[11px] text-[#7193a2]">
                      Used for complex curriculum generation, multimodal RAG,
                      and deep reasoning.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#09151c] border border-[#1a3848] space-y-1">
                    <span className="text-[10px] text-cyan-400 font-mono font-bold">
                      EDGE MICRO ENGINE
                    </span>
                    <h4 className="font-bold text-white">
                      Nano Banana Pro (Local WASM)
                    </h4>
                    <p className="text-[11px] text-[#7193a2]">
                      Zero-latency client inference, local DOM analysis, and
                      instant PII redaction.
                    </p>
                  </div>
                </div>
              </div>

              {/* Integrated Agentic AI Labs & Tools Suite */}
              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] space-y-4">
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Bot className="w-4 h-4 text-cyan-400" />
                    Integrated Agentic AI Tools & Configurations
                  </h3>
                  <p className="text-[#82a3b2]">
                    Launch and configure specialized AI features directly from
                    your system preferences settings
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#09151c] border border-[#1a3848] space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-cyan-300 font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                          Gemini 3.1 Pro
                        </span>
                        <Bot className="w-4 h-4 text-cyan-400" />
                      </div>
                      <h4 className="font-bold text-white text-xs">
                        AI Features Studio
                      </h4>
                      <p className="text-[11px] text-[#7193a2] mt-0.5">
                        Automated course generator, multimodal video breakdown,
                        and study quiz engine.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        if (onNavigateTab) onNavigateTab("ai_labs");
                      }}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Open AI Features Studio</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#09151c] border border-[#1a3848] space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-cyan-300 font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                          Real-Time
                        </span>
                        <Mic className="w-4 h-4 text-cyan-400" />
                      </div>
                      <h4 className="font-bold text-white text-xs">
                        Live Audio Voice Agent
                      </h4>
                      <p className="text-[11px] text-[#7193a2] mt-0.5">
                        Low-latency acoustic dialogue assistant with Gemini 3.1
                        Live API.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab("voice");
                      }}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Launch Voice Agent</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#09151c] border border-[#1a3848] space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-cyan-300 font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                          Diagnostics
                        </span>
                        <Terminal className="w-4 h-4 text-cyan-400" />
                      </div>
                      <h4 className="font-bold text-white text-xs">
                        Prompt Diagnostics & Studio
                      </h4>
                      <p className="text-[11px] text-[#7193a2] mt-0.5">
                        Token health inspector, system prompt override engine,
                        and accuracy auditing.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        if (onNavigateTab) onNavigateTab("prompt_diagnostics");
                      }}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Prompt Diagnostics</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#09151c] border border-[#1a3848] space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-cyan-300 font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                          Interactive
                        </span>
                        <PenTool className="w-4 h-4 text-cyan-400" />
                      </div>
                      <h4 className="font-bold text-white text-xs">
                        Socratic Workbench
                      </h4>
                      <p className="text-[11px] text-[#7193a2] mt-0.5">
                        Interactive code synthesis, step-by-step Socratic math &
                        logic tutor.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        if (onOpenAITutor) onOpenAITutor();
                        else if (onNavigateTab) onNavigateTab("workbench");
                      }}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Launch Socratic Tutor</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INTEGRATIONS */}
          {activeTab === "integrations" && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    Google Classroom Integration
                  </h3>
                  <p className="text-[#82a3b2]">
                    Sync active courses, student rosters, assignment grades, and
                    capstone submissions.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenClassroomModal();
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-md transition-all"
                >
                  Launch Classroom Sync
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    Google Workspace Services
                  </h3>
                  <p className="text-[#82a3b2]">
                    Google Drive, Sheets, Gmail, and Docs integration is active.
                  </p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-[#0d2532] border border-cyan-500/30 text-cyan-300 font-semibold text-xs">
                  Connected
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRIVACY */}
          {activeTab === "privacy" && (
            <div className="space-y-5">
              {/* Hardware Permissions Audit */}
              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] space-y-4">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Mic className="w-4 h-4 text-cyan-400" />
                  Hardware & Storage Permissions Audit
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#09151c] border border-[#1a3848] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Mic className="w-4 h-4 text-cyan-400" />
                        Microphone Access
                      </span>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                        Active / Allowed
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7193a2]">
                      Enables real-time acoustic dialogue and speech commands
                      for Nashmi AI.
                    </p>
                    <button
                      onClick={async () => {
                        try {
                          await navigator.mediaDevices.getUserMedia({
                            audio: true,
                          });
                          alert(
                            "Microphone permission verified and granted successfully!",
                          );
                        } catch (e) {
                          alert(
                            "Microphone access check failed. Please check browser permissions.",
                          );
                        }
                      }}
                      className="w-full py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold transition-all"
                    >
                      Test Microphone Input
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#09151c] border border-[#1a3848] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Database className="w-4 h-4 text-cyan-400" />
                        IndexedDB Cache Quota
                      </span>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                        Storage Healthy
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7193a2]">
                      Stores offline course progress, research vector
                      embeddings, and certs.
                    </p>
                    <button
                      onClick={() => {
                        const count = localStorage.length;
                        alert(
                          `Local Storage Cache verified: ${count} keys active.`,
                        );
                      }}
                      className="w-full py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold transition-all"
                    >
                      Audit Storage Space
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Client-Side PII Sanitizer & Data Health
                </h3>

                <div className="p-3.5 rounded-xl bg-[#09151c] border border-[#1a3848] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-cyan-300">
                      Data Health Monitor:
                    </span>
                    <span className="text-xs font-bold text-cyan-400">
                      Sync Healthy
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7193a2]">
                    Last Firebase sync: 2 hours ago.
                  </p>
                </div>

                <p className="text-[#82a3b2] text-xs">
                  All student data, queries, and uploaded documents pass through
                  an automated local edge sanitizer prior to external LLM
                  requests.
                </p>
                <div className="p-3.5 rounded-xl bg-[#09151c] border border-[#1a3848] space-y-2">
                  <div className="text-xs font-semibold text-cyan-300">
                    Active Redaction Filters:
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[#7193a2]">
                    <li>Automated email address & phone number masking</li>
                    <li>
                      SSN, credit card, and government identification stripping
                    </li>
                    <li>Local token hashing for vector store anonymity</li>
                  </ul>
                </div>
              </div>

              {/* Student Data Auto-Lock & Idle Session Security */}
              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm flex items-center gap-2">
                        <span>Student Data Auto-Lock & Inactivity Guard</span>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30">
                          FERPA & Zero-Trust
                        </span>
                      </h3>
                      <p className="text-[#82a3b2] text-xs">
                        Automatically locks the workspace and requires biometric or workspace re-authentication after idle inactivity, protecting student records, quizzes, and personal data.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      onUpdateUser({
                        autoLockEnabled: user.autoLockEnabled === undefined ? false : !user.autoLockEnabled,
                      })
                    }
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 shrink-0 ${
                      user.autoLockEnabled !== false
                        ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-sm"
                        : "bg-[#09151c] border-[#1a3848] text-gray-400 hover:text-white"
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{user.autoLockEnabled !== false ? "Auto-Lock Active" : "Auto-Lock Disabled"}</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-[#1a3848]/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Timeout Threshold Selector */}
                  <div className="p-3.5 rounded-xl bg-[#09151c] border border-[#1a3848] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">Inactivity Lock Threshold</span>
                      <span className="font-mono text-cyan-400 font-bold">
                        {user.autoLockMinutes || 60} minutes ({(user.autoLockMinutes || 60) >= 60 ? `${(user.autoLockMinutes || 60) / 60} Hour${(user.autoLockMinutes || 60) > 60 ? 's' : ''}` : `${user.autoLockMinutes || 60}m`})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[15, 30, 60, 90, 120].map((mins) => (
                        <button
                          key={mins}
                          onClick={() => onUpdateUser({ autoLockMinutes: mins, autoLockEnabled: true })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                            (user.autoLockMinutes || 60) === mins && user.autoLockEnabled !== false
                              ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm"
                              : "bg-[#0c1a24] text-gray-400 hover:text-white border border-[#1b3b4a]"
                          }`}
                        >
                          {mins >= 60 ? `${mins / 60}h` : `${mins}m`} {mins === 60 ? "(Standard - 1h)" : ""}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-[#7193a2]">
                      Triggers instant biometric or PIN re-entry if keyboard, touch, or mouse actions remain idle.
                    </p>
                  </div>

                  {/* Manual Lock Action & Security Status */}
                  <div className="p-3.5 rounded-xl bg-[#09151c] border border-[#1a3848] flex flex-col justify-between space-y-2.5">
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">Immediate Session Lock</span>
                        <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">
                          Secured
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7193a2] mt-1">
                        Instantly lock the display when stepping away from the device without closing tabs.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        window.dispatchEvent(new CustomEvent("LOCK_APP_SESSION"));
                      }}
                      className="w-full py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Lock Workspace Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: OFFLINE SYNC AUDIT LOG */}
          {activeTab === "syncAudit" && (
            <div className="space-y-5">
              {/* Header Overview Card */}
              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      OfflineStorageService Sync Audit Engine
                    </h3>
                    <p className="text-[#82a3b2]">
                      Real-time monitor tracking queued, failed, and
                      successfully synchronized student progress items.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRetryFailed}
                      disabled={isRetryingSync}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center gap-1.5 text-xs transition-all shadow-md disabled:opacity-50"
                    >
                      <RotateCw
                        className={`w-3.5 h-3.5 ${isRetryingSync ? "animate-spin" : ""}`}
                      />
                      <span>
                        {isRetryingSync ? "Syncing..." : "Retry Failed Items"}
                      </span>
                    </button>
                    <button
                      onClick={handleAddSampleSyncItem}
                      className="p-1.5 rounded-xl bg-[#0d2532] hover:bg-[#143243] text-cyan-300 border border-cyan-500/30 transition-all"
                      title="Simulate Queue Item"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleClearAuditLogs}
                      className="p-1.5 rounded-xl bg-[#231215] hover:bg-[#34161b] text-cyan-400 border border-cyan-500/30 transition-all"
                      title="Clear Audit Logs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {retrySummary && (
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-medium text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{retrySummary}</span>
                  </div>
                )}

                {/* Metrics Badges */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-[#09151c] border border-[#1a3848] text-center space-y-1">
                    <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                      Queued for Sync
                    </div>
                    <div className="text-xl font-extrabold text-cyan-300">
                      {auditLogs.filter((l) => l.status === "queued").length}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#09151c] border border-[#1a3848] text-center space-y-1">
                    <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                      Synced Successfully
                    </div>
                    <div className="text-xl font-extrabold text-cyan-300">
                      {auditLogs.filter((l) => l.status === "synced").length}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#09151c] border border-[#1a3848] text-center space-y-1">
                    <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                      Failed / Retrying
                    </div>
                    <div className="text-xl font-extrabold text-cyan-300">
                      {auditLogs.filter((l) => l.status === "failed").length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#82a3b2]">
                  Filter Log:
                </span>
                {(["all", "queued", "failed", "synced"] as const).map(
                  (filter) => (
                    <button
                      key={filter}
                      onClick={() => setAuditFilter(filter)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border capitalize transition-all ${
                        auditFilter === filter
                          ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                          : "bg-[#09151c] border-[#1a3848] text-[#82a3b2] hover:text-white"
                      }`}
                    >
                      {filter}
                    </button>
                  ),
                )}
              </div>

              {/* Items List */}
              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {auditLogs
                  .filter(
                    (log) =>
                      auditFilter === "all" || log.status === auditFilter,
                  )
                  .map((item) => {
                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${
                          item.status === "synced"
                            ? "bg-[#091821] border-[#183a4c]"
                            : item.status === "queued"
                              ? "bg-[#1c180a] border-[#3f3412]"
                              : "bg-[#220d11] border-[#4d1a21]"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {item.status === "synced" && (
                              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                            )}
                            {item.status === "queued" && (
                              <Clock className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
                            )}
                            {item.status === "failed" && (
                              <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                            )}

                            <span className="font-bold text-white text-xs">
                              {item.title}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-black/40 text-[#7193a2] font-mono text-[10px]">
                              {item.courseId || "Global"}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-[#7193a2] pl-6">
                            <span>Type: {item.itemType}</span>
                            <span>•</span>
                            <span>
                              {new Date(item.timestamp).toLocaleTimeString()}
                            </span>
                            {item.retryCount > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-cyan-400">
                                  Retries: {item.retryCount}
                                </span>
                              </>
                            )}
                          </div>

                          {item.lastError && (
                            <div className="pl-6 text-[11px] text-cyan-300 font-mono bg-cyan-500/10 p-1.5 rounded-lg border border-cyan-500/20 mt-1">
                              Error: {item.lastError}
                            </div>
                          )}
                        </div>

                        <div className="shrink-0 self-end sm:self-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              item.status === "synced"
                                ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
                                : item.status === "queued"
                                  ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
                                  : "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                {auditLogs.filter(
                  (log) => auditFilter === "all" || log.status === auditFilter,
                ).length === 0 && (
                  <div className="p-8 text-center text-[#7193a2] bg-[#09151c] rounded-2xl border border-[#1a3848]">
                    No sync audit items match the selected filter ({auditFilter}
                    ).
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: VOICE & ACOUSTIC AGENT */}
          {activeTab === "voice" && (
            <div className="space-y-5">
              {/* Voice Engine Header */}
              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Mic className="w-4 h-4 text-cyan-400" />
                    <span>Voice Command Engine & Speech Configuration</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30">
                    Nashmi & Petra Voice Core
                  </span>
                </div>
                <p className="text-xs text-[#82a3b2]">
                  Configure speech recognition sensitivity, language engine models, and hands-free voice feature toggles for the LMDpro workspace.
                </p>
              </div>

              {/* 1. Voice Command Sensitivity */}
              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-xs flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-cyan-400" />
                      <span>Voice Command Sensitivity</span>
                    </h4>
                    <p className="text-[11px] text-[#7193a2]">
                      Adjust detection confidence threshold for noisy or quiet environments
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-[#09151c] text-cyan-300 font-bold uppercase text-[10px] border border-[#1a3848]">
                    {user.voiceSettings?.sensitivity || "medium"} Sensitivity
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  {[
                    { id: "low", label: "Low Sensitivity", desc: "Strict / Quiet Rooms (80% confidence)", badge: "Quiet" },
                    { id: "medium", label: "Medium (Recommended)", desc: "Balanced daily study (60% confidence)", badge: "Optimal" },
                    { id: "high", label: "High Sensitivity", desc: "Noisy environments (40% confidence)", badge: "Sensitive" },
                  ].map((level) => {
                    const currentSens = user.voiceSettings?.sensitivity || "medium";
                    const isSelected = currentSens === level.id;
                    return (
                      <button
                        key={level.id}
                        onClick={() => {
                          const current = user.voiceSettings || {
                            sensitivity: "medium",
                            speechEngineLanguage: user.language || "en",
                            voiceNavigationEnabled: true,
                            socraticAudioEnabled: true,
                            wakeWordEnabled: true,
                            autoReadEnabled: true,
                            continuousListeningEnabled: false,
                          };
                          onUpdateUser({
                            voiceSettings: { ...current, sensitivity: level.id as any },
                          });
                        }}
                        className={`p-3 rounded-xl border text-left transition-all space-y-1 ${
                          isSelected
                            ? "bg-cyan-500/15 border-cyan-400 text-white shadow-md"
                            : "bg-[#09151c] border-[#1a3848] text-[#82a3b2] hover:text-white"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>{level.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                        </div>
                        <p className="text-[10px] text-[#7193a2] leading-tight">{level.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Language Selection for Speech Engine */}
              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-xs flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span>Speech Engine Language Selection</span>
                    </h4>
                    <p className="text-[11px] text-[#7193a2]">
                      Target spoken language for speech recognition and TTS narration models
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { code: "en", flag: "🇺🇸", label: "English (US/UK)" },
                    { code: "es", flag: "🇪🇸", label: "Español" },
                    { code: "fr", flag: "🇫🇷", label: "Français" },
                    { code: "de", flag: "🇩🇪", label: "Deutsch" },
                    { code: "ar", flag: "🇸🇦", label: "العربية" },
                    { code: "ja", flag: "🇯🇵", label: "日本語" },
                    { code: "zh", flag: "🇨🇳", label: "中文" },
                    { code: "hi", flag: "🇮🇳", label: "हिन्दी" },
                  ].map((lang) => {
                    const currentLang = user.voiceSettings?.speechEngineLanguage || user.language || "en";
                    const isSelected = currentLang === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          const current = user.voiceSettings || {
                            sensitivity: "medium",
                            speechEngineLanguage: user.language || "en",
                            voiceNavigationEnabled: true,
                            socraticAudioEnabled: true,
                            wakeWordEnabled: true,
                            autoReadEnabled: true,
                            continuousListeningEnabled: false,
                          };
                          onUpdateUser({
                            voiceSettings: { ...current, speechEngineLanguage: lang.code as any },
                          });
                        }}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                          isSelected
                            ? "bg-cyan-500/15 border-cyan-400 text-cyan-300 font-bold"
                            : "bg-[#09151c] border-[#1a3848] text-gray-300 hover:bg-white/5"
                        }`}
                      >
                        <span className="text-base">{lang.flag}</span>
                        <span className="text-xs">{lang.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Voice-Controlled Feature Toggles */}
              <div className="p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] space-y-3">
                <h4 className="font-bold text-white text-xs flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <span>Voice-Controlled Feature Toggles</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    {
                      key: "voiceNavigationEnabled",
                      title: "Voice Navigation Commands",
                      desc: "Say 'Navigate to courses' or 'Open study workbench' to change tabs hands-free.",
                      icon: Compass,
                    },
                    {
                      key: "socraticAudioEnabled",
                      title: "Socratic Spoken Feedback",
                      desc: "Petra reads audio explanations and quiz breakdowns aloud during study sessions.",
                      icon: MessageSquare,
                    },
                    {
                      key: "wakeWordEnabled",
                      title: "Wake Word Listener ('Hey Nashmi')",
                      desc: "Listen continuously for 'Hey Nashmi' or 'Hey Petra' wake word prompts.",
                      icon: Ear,
                    },
                    {
                      key: "autoReadEnabled",
                      title: "Auto-Read Page Reader",
                      desc: "Automatically synthesize audio narration for newly opened lesson paragraphs.",
                      icon: FileText,
                    },
                    {
                      key: "continuousListeningEnabled",
                      title: "Continuous Listening Mode",
                      desc: "Keep the speech recognition channel open across workspace navigation.",
                      icon: Mic,
                    },
                  ].map((feat) => {
                    const Icon = feat.icon;
                    const currentSettings = user.voiceSettings || {
                      sensitivity: "medium",
                      speechEngineLanguage: user.language || "en",
                      voiceNavigationEnabled: true,
                      socraticAudioEnabled: true,
                      wakeWordEnabled: true,
                      autoReadEnabled: true,
                      continuousListeningEnabled: false,
                    };
                    const isEnabled = (currentSettings as any)[feat.key] ?? true;

                    return (
                      <div
                        key={feat.key}
                        className="p-3.5 rounded-xl bg-[#09151c] border border-[#1a3848] space-y-2 flex flex-col justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white flex items-center gap-1.5">
                              <Icon className="w-3.5 h-3.5 text-cyan-400" />
                              {feat.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#7193a2] leading-snug">{feat.desc}</p>
                        </div>

                        <button
                          onClick={() => {
                            onUpdateUser({
                              voiceSettings: {
                                ...currentSettings,
                                [feat.key]: !isEnabled,
                              },
                            });
                          }}
                          className={`mt-1 py-1.5 px-3 rounded-lg border text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 ${
                            isEnabled
                              ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300"
                              : "bg-[#14222b] border-[#203c4a] text-gray-400 hover:text-white"
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${isEnabled ? "bg-cyan-400 animate-pulse" : "bg-gray-500"}`} />
                          <span>{isEnabled ? "Feature Active" : "Feature Disabled"}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Audio Assistant Sandbox */}
              <div className="p-4 rounded-2xl bg-[#09151c] border border-[#1a3848] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                    <span>Interactive Live Acoustic Agent</span>
                  </h4>
                  <span className="text-[10px] text-gray-400">Gemini 3.1 Live API</span>
                </div>
                <LiveVoiceAgent onClose={() => setActiveTab("general")} />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#08131a] border-t border-[#1c3e50] flex justify-end gap-2 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#142e3b] hover:bg-[#1a3a4b] text-cyan-300 font-semibold transition-all border border-cyan-500/20"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
