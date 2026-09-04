import React from "react";
import { UserProfile, UserRole, LanguageCode, Course } from "../shared/types";
import {
  Search,
  Settings,
  X,
  BookOpen,
  ArrowRight,
  Zap,
  Award,
  Flame,
  CheckCircle2,
  Star,
  Menu,
  LayoutGrid,
  Calculator,
  Globe,
  StickyNote,
  Code2,
  PenTool,
  Clock,
  Cpu,
  HelpCircle,
  Network,
  Database,
  FolderGit2,
  Sparkles,
  Mic,
  Cloud,
  RefreshCw,
  Sun,
  Moon,
  Languages,
  Save,
  HardDrive,
  Check,
  User,
} from "lucide-react";
import { getTranslation } from "../shared/localization";
import { ToolType } from "./ToolModalOverlay";
import { offlineSyncService } from "../services/offlineSyncService";
import { autoSaveService, AutoSaveState } from "../services/autoSaveService";
import { Tooltip } from "./Tooltip";

import { useTheme } from "./theme/ThemeProvider";

interface HeaderProps {
  user: UserProfile;
  courses?: Course[];
  onSelectCourse?: (course: Course) => void;
  onRoleChange: (role: UserRole) => void;
  onLanguageChange: (lang: LanguageCode) => void;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  onOpenCourseGenerator: () => void;
  onOpenAITutor: () => void;
  onOpenClassroomModal: () => void;
  onOpenAgentInspector?: () => void;
  onOpenRagIndexer?: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenSearch: () => void;
  onOpenLegalModal?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onToggleSidebar?: () => void;
  onOpenTool?: (tool: ToolType) => void;
  onOpenQuickKeyModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  courses = [],
  onSelectCourse,
  onLanguageChange,
  onUpdateUser,
  isOffline,
  onToggleOffline,
  onOpenProfile,
  onOpenSettings,
  onOpenSearch,
  onToggleSidebar,
  onOpenTool,
  onOpenQuickKeyModal,
}) => {
  const [isSyncingState, setIsSyncingState] = React.useState(false);
  const [queuedCount, setQueuedCount] = React.useState(0);
  const [lastSyncedAt, setLastSyncedAt] = React.useState<number | null>(null);
  const [autoSaveState, setAutoSaveState] = React.useState<AutoSaveState>(autoSaveService.getState());
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [showLevelModal, setShowLevelModal] = React.useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = React.useState(false);
  const [isQuickStudyActive, setIsQuickStudyActive] = React.useState(false);
  const langDropdownRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const profileDropdownRef = React.useRef<HTMLDivElement>(null);
  const t = getTranslation(user.language);
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
    const unsubscribe = offlineSyncService.subscribe((isSyncing, count, lastSynced) => {
      setIsSyncingState(isSyncing);
      setQueuedCount(count);
      setLastSyncedAt(lastSynced);
    });
    const unsubAutoSave = autoSaveService.subscribe((state) => {
      setAutoSaveState(state);
    });
    return () => {
      unsubscribe();
      unsubAutoSave();
    };
  }, []);

  const formatSyncTime = (ts: number | null) => {
    if (!ts) return t.synced || "Cloud Synced";
    const date = new Date(ts);
    return `${t.synced || "Synced"} (${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
  };

  // Auto-complete suggestions logic
  const filteredCourses =
    searchQuery.trim() === ""
      ? []
      : courses
          .filter(
            (c) =>
              c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (c.tags &&
                c.tags.some((tag) =>
                  tag.toLowerCase().includes(searchQuery.toLowerCase()),
                )),
          )
          .slice(0, 5);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCourseClick = (course: Course) => {
    if (onSelectCourse) {
      onSelectCourse(course);
    }
    setSearchQuery("");
    setIsSearchFocused(false);
  };

  const languageLabels: Record<LanguageCode, { label: string; short: string; flag: string }> = {
    en: { label: "English", short: "EN", flag: "🇺🇸" },
    ar: { label: "العربية", short: "AR", flag: "🇸🇦" },
    fr: { label: "Français", short: "FR", flag: "🇫🇷" },
    es: { label: "Español", short: "ES", flag: "🇪🇸" },
    de: { label: "Deutsch", short: "DE", flag: "🇩🇪" },
    ja: { label: "日本語", short: "JA", flag: "🇯🇵" },
    zh: { label: "中文", short: "ZH", flag: "🇨🇳" },
    hi: { label: "हिन्दी", short: "HI", flag: "🇮🇳" },
  };

  return (
    <div className="relative z-30 flex items-center px-2 sm:px-4 pt-2 w-full min-w-0">
      {/* Separated Floating Hamburger Button relative to header */}
      {onToggleSidebar && (
        <Tooltip
          title={user.language === "ar" ? "قائمة التنقل" : "Navigation Menu"}
          description={user.language === "ar" ? "فتح أو إغلاق الشريط الجانبي الرئيسي" : "Toggle main navigation sidebar"}
          shortcut="⌘B"
          position="bottom"
        >
            <button
            onClick={onToggleSidebar}
            className="lg:hidden mr-2 p-2.5 rounded-2xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-[var(--accent-turquoise)] hover:text-white flex items-center justify-center w-10 h-10 shadow-lg shrink-0 transition-all backdrop-blur-md active:scale-95"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        </Tooltip>
      )}

      {/* Floating Header Card with round edges and slight padding */}
      <header className="flex-1 min-w-0 mx-1 sm:mx-0 my-2 rounded-2xl bg-[var(--bg-surface)] dark:bg-[var(--bg-surface)] backdrop-blur-xl border border-[var(--border-color)] shadow-xl px-2 sm:px-4 py-2.5 flex items-center justify-between transition-all gap-2 sm:gap-3">
        {/* Desktop Hamburger Button or MOOC Standards Tag */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {onToggleSidebar && (
            <Tooltip
              title={user.language === "ar" ? "الشريط الجانبي" : "Sidebar Toggle"}
              description={user.language === "ar" ? "طي أو توسيع شريط التنقل" : "Collapse or expand sidebar navigation"}
              shortcut="⌘B"
              position="bottom"
            >
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-xl bg-[var(--bg-canvas-start)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-[var(--accent-turquoise)] hover:text-white flex items-center justify-center w-8 h-8 shadow-sm transition-all"
                aria-label="Toggle Sidebar"
              >
                <Menu className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </Tooltip>
          )}
          <span className="text-[10px] text-[var(--text-muted-custom)] font-mono tracking-wider hidden xl:inline-block bg-[var(--bg-canvas-start)]/80 px-2 py-1 rounded-lg border border-[var(--border-color)]">
            Global University & Academic Standards
          </span>
        </div>

        {/* Refined Search Bar Trigger with ⌘K Popup Modal Option */}
        <div
          className="relative flex-1 min-w-0 max-w-xl mx-1 md:mx-2 flex items-center"
          ref={searchRef}
        >
          <Tooltip
            title={user.language === "ar" ? "البحث الشامل" : "Global Search"}
            description={user.language === "ar" ? "ابحث عن الدرجات والمساقات والأوراق البحثية والأدوات" : "Search degree catalog, courses, notes, and academic papers"}
            shortcut="⌘K"
            position="bottom"
            wrapperClassName="w-full"
          >
            <div className="relative w-full min-w-0">
              <div 
                onClick={() => onOpenSearch && onOpenSearch()}
                className="relative flex items-center cursor-pointer group"
              >
                <Search className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[var(--accent-turquoise)]/80 absolute left-3 pointer-events-none group-hover:text-[var(--accent-turquoise)] transition-colors" />
                <input
                  type="text"
                  readOnly
                  onClick={() => onOpenSearch && onOpenSearch()}
                  placeholder={
                    user.language === "ar"
                      ? "ابحث عن المقررات والأوراق..."
                      : "Search courses, degrees, papers..."
                  }
                  className="w-full pl-8 sm:pl-10 pr-4 sm:pr-14 py-1.5 sm:py-2 rounded-xl bg-[var(--bg-canvas-start)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] hover:border-[var(--accent-turquoise)]/40 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted-custom)] cursor-pointer transition-all shadow-inner select-none h-9 sm:h-10 truncate"
                />
                <div className="absolute right-2 sm:right-3 flex items-center gap-1">
                  <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold text-[var(--text-muted-custom)] bg-[var(--bg-canvas-start)] border border-[var(--border-color)] rounded">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>
          </Tooltip>
        </div>

      {/* Right Controls: Cleaned up and streamlined */}
      <div
        className="flex items-center gap-1.5 sm:gap-2.5 shrink-0"
        role="toolbar"
        aria-label="Header Tools and Controls"
      >
        {/* Subtle Auto-Save & Cloud Sync Status Indicator */}
        <Tooltip
          title={isOffline ? (user.language === "ar" ? "الوضع غير المتصل نشط" : "Offline Mode Active") : (user.language === "ar" ? "محرك الحفظ التلقائي والمزامنة" : "Auto-Save & Cloud Sync Engine")}
          description={
            isOffline
              ? (user.language === "ar" ? "أنت في وضع عدم الاتصال. سيتم حفظ التغييرات محلياً ومزامنتها لاحقاً." : "You are working offline. Changes are saved locally and will sync when reconnected.")
              : autoSaveState.status === 'saving' || isSyncingState || autoSaveState.isBlinking
              ? (user.language === "ar" ? "جارٍ حفظ التغييرات وتأمينها في التخزين المحلي والسحابي..." : "Syncing recent course progress, notes, and profile state...")
              : lastSyncedAt
              ? `${user.language === "ar" ? "تم الحفظ تلقائياً • آخر مزامنة سحابية" : "Auto-saved • Last cloud sync"}: ${new Date(lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${queuedCount > 0 ? ` (${queuedCount} ${user.language === "ar" ? "قيد الانتظار" : "pending"})` : ""}`
              : (user.language === "ar" ? "تم الحفظ تلقائياً في التخزين المحلي المشفر • السحابة متصلة" : "Auto-saved locally with AES/XOR encryption • Cloud connected")
          }
          variant={isOffline ? "amber" : (autoSaveState.isBlinking || autoSaveState.status === 'saving' || isSyncingState ? "cyan" : "cyan")}
          position="bottom"
        >
          <button
            onClick={() => {
              if (isOffline) {
                onToggleOffline();
              } else {
                offlineSyncService.syncQueueToFirebase();
                autoSaveService.triggerSaving('all', 1200, user.language === "ar" ? "مزامنة سريعة..." : "Syncing changes...");
              }
            }}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs shadow-sm transition-all h-9 cursor-pointer group active:scale-95 ${
              isOffline
                ? "bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20"
                : autoSaveState.isBlinking || autoSaveState.status === 'saving' || isSyncingState
                ? "bg-[var(--accent-navy)] border-[var(--accent-turquoise)]/60 shadow-[0_0_12px_rgba(64,224,208,0.25)]"
                : queuedCount > 0
                ? "bg-[var(--bg-canvas-start)] border-[var(--accent-turquoise)]/50 hover:border-[var(--accent-turquoise)] text-[var(--accent-turquoise)]"
                : "bg-[var(--bg-canvas-start)] border-[var(--border-color)] hover:border-[var(--accent-turquoise)]/40 text-[var(--accent-turquoise)]"
            }`}
            aria-label={isOffline ? "Offline mode indicator" : "Auto-save status and sync engine"}
          >
            {isOffline ? (
              <>
                <HardDrive className="w-3.5 h-3.5" />
                <span className="font-medium tracking-tight hidden lg:inline">
                  {user.language === "ar" ? "وضع غير متصل" : "Offline"}
                </span>
              </>
            ) : autoSaveState.isBlinking || autoSaveState.status === 'saving' || isSyncingState ? (
              <>
                {/* Blinking Live Indicator Beacon */}
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-turquoise)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-turquoise)]"></span>
                </span>
                <RefreshCw className="w-3.5 h-3.5 text-[var(--accent-turquoise)] animate-spin shrink-0" />
                <span className="text-[var(--accent-turquoise)] font-medium tracking-tight animate-pulse hidden lg:inline">
                  {autoSaveState.message || (user.language === "ar" ? "جارٍ الحفظ..." : "Auto-saving...")}
                </span>
              </>
            ) : queuedCount > 0 ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-turquoise)]"></span>
                </span>
                <Cloud className="w-3.5 h-3.5 text-[var(--accent-turquoise)] shrink-0" />
                <span className="text-[var(--accent-turquoise)] font-medium tracking-tight hidden lg:inline">
                  {queuedCount} {user.language === "ar" ? "بالانتظار" : "pending"}
                </span>
              </>
            ) : (
              <>
                {/* Steady saved indicator */}
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-turquoise)] shadow-[0_0_6px_rgba(64,224,208,0.7)]"></span>
                </span>
                <Check className="w-3.5 h-3.5 text-[var(--accent-turquoise)] shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-[var(--accent-turquoise)]/90 font-medium tracking-tight hidden lg:inline">
                  {user.language === "ar" ? "تم الحفظ تلقائياً" : "Auto-saved"}
                </span>
              </>
            )}
          </button>
        </Tooltip>

        {/* Squared Language Selector Button (EN, AR, FR, ES, etc.) */}
        <div className="relative" ref={langDropdownRef}>
          <Tooltip
            title={user.language === "ar" ? "تغيير اللغة" : "Select Language"}
            description={user.language === "ar" ? "اختر من بين 8 لغات مدعومة للواجهة" : "Switch between English, Arabic, French, and other locales"}
            position="bottom"
          >
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--bg-canvas-start)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] hover:border-[var(--accent-turquoise)]/50 text-[var(--accent-turquoise)] hover:text-white transition-all shadow-sm group active:scale-95 shrink-0"
              aria-label="Toggle Language Menu"
            >
              <div className="w-6 h-6 rounded-lg bg-[var(--bg-surface)] border border-[var(--accent-turquoise)]/30 group-hover:border-[var(--accent-turquoise)] flex items-center justify-center text-[10px] font-bold font-mono tracking-tight text-[var(--accent-turquoise)] group-hover:text-white transition-all shadow-inner">
                {languageLabels[user.language]?.short || "EN"}
              </div>
            </button>
          </Tooltip>

          {isLangDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-[#0d1f29] border border-[#1b3e50] rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in p-1.5 space-y-0.5 text-xs backdrop-blur-xl">
              {(["en", "ar", "fr", "es", "de", "ja", "zh", "hi"] as LanguageCode[]).map((code) => (
                <button
                  key={code}
                  onClick={() => {
                    if (onLanguageChange) onLanguageChange(code);
                    if (onUpdateUser) onUpdateUser({ language: code });
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between transition-colors ${
                    user.language === code
                      ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30"
                      : "text-[#9fc5d8] hover:bg-[#163647] hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-[#08151c] border border-white/10 flex items-center justify-center text-[10px] font-mono font-bold text-cyan-300">
                      {languageLabels[code]?.short}
                    </span>
                    <span className="truncate">{languageLabels[code]?.label}</span>
                  </span>
                  {user.language === code && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Theme Toggle (True Black Dark / High Contrast Light) */}
        <Tooltip
          title={theme === "light" ? (user.language === "ar" ? "الوضع الليلي" : "Dark Theme") : (user.language === "ar" ? "الوضع النهاري" : "Light Theme")}
          description={theme === "light" ? (user.language === "ar" ? "التحويل إلى ثيم السائل الزجاجي الداكن" : "Switch to Liquid Glass True Black mode") : (user.language === "ar" ? "التحويل إلى الثيم النهاري عالي التباين" : "Switch to High-Contrast Clean Light mode")}
          position="bottom"
        >
          <button
            onClick={() => {
              const nextTheme = theme === "light" ? "dark" : "light";
              setTheme(nextTheme);
              if (onUpdateUser) onUpdateUser({ theme: nextTheme });
            }}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--bg-canvas-start)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-[var(--accent-turquoise)] hover:text-white transition-all shadow-sm active:scale-95 shrink-0"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4 text-cyan-300" />
            ) : (
              <Sun className="w-4 h-4 text-[var(--accent-turquoise)]" />
            )}
          </button>
        </Tooltip>

        {/* Comprehensive Tools Menu (contains Nashmi AI, Quick Study, Shortcuts, etc.) */}
        <div className="relative" ref={profileDropdownRef}>
          <Tooltip
            title={user.language === "ar" ? "أدوات منصة الدراسة" : "Study Workbench & Tools"}
            description={user.language === "ar" ? "فتح أدوات الذكاء الاصطناعي والمؤقتات والملاحظات والآلة الحاسبة" : "Access Nashmi AI, Pomodoro, Knowledge Graph, Code Compiler & Notes"}
            position="bottom"
          >
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--bg-canvas-start)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] transition-all text-[var(--accent-turquoise)] hover:text-white shadow-sm"
              aria-label="Open Study Tools Menu"
              aria-haspopup="menu"
              aria-expanded={isProfileDropdownOpen}
            >
              <LayoutGrid className="w-4 h-4 text-[var(--accent-turquoise)]" strokeWidth={1.5} />
            </button>
          </Tooltip>

          {isProfileDropdownOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-64 bg-[#0d1f29] border border-[#1b3e50] rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in p-1.5 space-y-1 text-xs max-h-[80vh] overflow-y-auto custom-scrollbar"
              role="menu"
              aria-label="Study Tools Dropdown"
            >
              {/* Featured AI Companion */}
              <button
                role="menuitem"
                onClick={() => {
                  setIsProfileDropdownOpen(false);
                  window.dispatchEvent(new CustomEvent("TOGGLE_NASHMI_OVERLAY"));
                }}
                className="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-cyan-500/20 hover:from-cyan-500/30 hover:to-cyan-500/30 border border-cyan-500/40 text-cyan-300 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <div>
                    <div className="font-bold text-xs text-white">Nashmi AI Assistant</div>
                    <div className="text-[10px] text-cyan-300/80">Socratic Companion & Tutor</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Quick Study Session */}
              <button
                role="menuitem"
                onClick={() => {
                  setIsProfileDropdownOpen(false);
                  window.dispatchEvent(new CustomEvent("TOGGLE_QUICK_STUDY"));
                }}
                className="w-full text-left p-2 rounded-xl hover:bg-[#163647] text-white transition-all flex items-center gap-2.5"
              >
                <Clock className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="font-medium text-xs text-[#d3e5ef]">Quick Study Mode</div>
                  <div className="text-[10px] text-[#789cae]">Bite-sized under 10 min sprints</div>
                </div>
              </button>

              {/* Keyboard Shortcuts (?) */}
              <button
                role="menuitem"
                onClick={() => {
                  setIsProfileDropdownOpen(false);
                  if (onOpenQuickKeyModal) onOpenQuickKeyModal();
                }}
                className="w-full text-left p-2 rounded-xl hover:bg-[#163647] text-white transition-all flex items-center gap-2.5"
              >
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="font-medium text-xs text-[#d3e5ef]">Keyboard Shortcuts (?)</div>
                  <div className="text-[10px] text-[#789cae]">Press ? or ⌘K for rapid access</div>
                </div>
              </button>

              <div className="border-t border-[#163647] my-1" />
              {[
                {
                  id: "nashmi",
                  label: "Nashmi Socratic AI Companion",
                  icon: Sparkles,
                  color: "text-cyan-400",
                },
                {
                  id: "voice",
                  label: "Voice Control & Acoustic Settings",
                  icon: Mic,
                  color: "text-cyan-400",
                },
                {
                  id: "settings",
                  label: "Settings & Workspace Keys",
                  icon: Settings,
                  color: "text-cyan-400",
                },
                {
                  id: "obsidian",
                  label: "Knowledge Graph Vault",
                  icon: Network,
                  color: "text-cyan-400",
                },
                {
                  id: "office",
                  label: "Structured Database Connector",
                  icon: Database,
                  color: "text-blue-400",
                },
                {
                  id: "workspace",
                  label: "Workspace Document Sync",
                  icon: FolderGit2,
                  color: "text-cyan-400",
                },
                {
                  id: "calculator",
                  label: "Computation Engine",
                  icon: Calculator,
                  color: "text-cyan-400",
                },
                {
                  id: "browser",
                  label: "Integrated Web Sandbox",
                  icon: Globe,
                  color: "text-cyan-400",
                },
                {
                  id: "notes",
                  label: "Active Sketchpad",
                  icon: StickyNote,
                  color: "text-cyan-400",
                },
                {
                  id: "code",
                  label: "Interactive Code Compiler",
                  icon: Code2,
                  color: "text-cyan-400",
                },
                {
                  id: "whiteboard",
                  label: "Visual Canvas Board",
                  icon: PenTool,
                  color: "text-cyan-400",
                },
                {
                  id: "pomodoro",
                  label: "Temporal Rhythm Sequencer",
                  icon: Clock,
                  color: "text-cyan-400",
                },
              ].map((tool) => {
                const IconComp = tool.icon;
                return (
                  <button
                    key={tool.id}
                    role="menuitem"
                    aria-label={`Open ${tool.label} Tool`}
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      if (tool.id === "nashmi") {
                        window.dispatchEvent(
                          new CustomEvent("TOGGLE_NASHMI_OVERLAY"),
                        );
                      } else if (tool.id === "settings" || tool.id === "voice") {
                        onOpenSettings();
                      } else if (tool.id === "profile") {
                        if (onOpenProfile) onOpenProfile();
                      } else if (onOpenTool) {
                        onOpenTool(tool.id as ToolType);
                      }
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-[#163647] text-white transition-all flex items-center gap-2.5"
                  >
                    <IconComp className={`w-4 h-4 ${tool.color}`} />
                    <span className="font-medium text-xs text-[#d3e5ef]">
                      {tool.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Level Breakdown Modal */}
      {showLevelModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0b1b24] border border-[#1b3e50] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 relative">
            <button
              onClick={() => setShowLevelModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Scholar Level Roadmap
                </h3>
                <p className="text-xs text-[#789cae]">
                  Current: Level {user.level || 2} • {user.xp || 1450} XP Earned
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  level: 1,
                  title: "Novice Explorer",
                  xpRequired: "0 - 999 XP",
                  current: (user.level || 2) === 1,
                  unlocked: true,
                },
                {
                  level: 2,
                  title: "Advanced Agentic Scholar",
                  xpRequired: "1,000 - 2,499 XP",
                  current: (user.level || 2) === 2,
                  unlocked: true,
                },
                {
                  level: 3,
                  title: "Autonomous Master",
                  xpRequired: "2,500 - 4,999 XP",
                  current: (user.level || 2) === 3,
                  unlocked: (user.level || 2) >= 3,
                },
                {
                  level: 4,
                  title: "Principal Systems Architect",
                  xpRequired: "5,000+ XP",
                  current: (user.level || 2) >= 4,
                  unlocked: (user.level || 2) >= 4,
                },
              ].map((lvl) => (
                <div
                  key={lvl.level}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                    lvl.current
                      ? "bg-cyan-500/10 border-cyan-400/50 shadow-md shadow-cyan-500/10"
                      : lvl.unlocked
                        ? "bg-[#0f2430] border-[#1d4257]"
                        : "bg-[#061118] border-[#132c3a] opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        lvl.unlocked
                          ? "bg-cyan-500 text-black"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      {lvl.level}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{lvl.title}</span>
                        {lvl.current && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#789cae]">
                        {lvl.xpRequired}
                      </div>
                    </div>
                  </div>
                  {lvl.unlocked && (
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  )}
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-[#061118] border border-[#163647] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-gray-300 font-medium">
                  Active Study Sessions
                </span>
              </div>
              <span className="text-xs font-bold text-cyan-300">
                LMDpro Verified
              </span>
            </div>

            <button
              onClick={() => setShowLevelModal(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-500 hover:from-cyan-400 hover:to-cyan-400 text-black text-xs font-bold shadow-lg transition-all"
            >
              Close Level Matrix
            </button>
          </div>
        </div>
      )}
    </header>
    </div>
  );
};
