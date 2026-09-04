import React from "react";
import { UserProfile, UserRole } from "../shared/types";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  GraduationCap,
  BookOpen,
  Calendar,
  Compass,
  FolderSync,
  FileText,
  Shield,
  ShieldCheck,
  Users,
  Folder,
  Database,
  BarChart2,
  Award,
  Settings,
  Zap,
  MessageSquare,
  Sparkles,
  Trophy,
  Layers,
  Briefcase,
  Bookmark,
} from "lucide-react";
import { LMDproLogo } from "./LMDproLogo";
import { getTranslation } from "../shared/localization";
import { Tooltip } from "./Tooltip";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  onOpenAuthModal: () => void;
  onOpenSettings?: () => void;
  onOpenProfile?: () => void;
  user: UserProfile;
  xpPoints: number;
  level: number;
  onOpenAITutor?: () => void;
  onOpenLegalModal?: () => void;
}

// Memoized icon lookup map
const ICON_LOOKUP = {
  dashboard: LayoutGrid,
  courses: BookOpen,
  degrees: GraduationCap,
  knowledge_base: FolderSync,
  analytics: BarChart2,
  social_forums: MessageSquare,
  leaderboard: Trophy,
  study_rooms: Users,
  achievements: Award,
  bookmarks: Bookmark,
  teacher_dashboard: GraduationCap,
  api_engine: Database,
  admin_portal: Shield,
  settings: Settings,
  about: Sparkles,
  donate: FileText,
};

const MemoizedIcon = React.memo(({ icon: Icon, className }: { icon: any; className?: string }) => {
  return <Icon className={className} strokeWidth={1.5} aria-hidden="true" />;
});

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  activeTab,
  setActiveTab,
  onOpenSettings,
  onOpenProfile,
  onOpenLegalModal,
  user,
  xpPoints,
  level,
}) => {
  const [clickedId, setClickedId] = React.useState<string | null>(null);
  const t = getTranslation(user.language);

  const handleItemClick = (id: string, action?: () => void) => {
    setClickedId(id);
    setTimeout(() => setClickedId(null), 300);
    if (window.innerWidth < 1024 && isOpen) {
      onToggle();
    }
    if (action) {
      action();
    } else {
      setActiveTab(id);
    }
  };

  const primaryItems = React.useMemo(
    () => [
      { id: "dashboard", label: t.hub || (user.language === "ar" ? "الرئيسية" : "Hub"), desc: user.language === "ar" ? "لوحة التحكم الرئيسية ومؤشرات التقدم الدراسي" : "Personalized study metrics, continuous progress & active courses", icon: ICON_LOOKUP.dashboard },
      { id: "courses", label: t.courses || (user.language === "ar" ? "الدورات التدريبية" : "Courses"), desc: user.language === "ar" ? "استعراض المساقات الجامعية التفاعلية والمناهج" : "Browse university-grade interactive courses and syllabus tracks", icon: ICON_LOOKUP.courses },
      { id: "study_buddy", label: user.language === "ar" ? "رفيق الدراسة الذكي" : "AI Study Buddy", desc: user.language === "ar" ? "شروحات تفاعلية، تلميحات تدريجية واختبارات تدريبية مخصصة" : "Socratic hints, interactive Q&A, custom practice quizzes & concept simplifier", icon: Sparkles },
      { id: "bookmarks", label: user.language === "ar" ? "علاماتي المرجعية" : "My Bookmarks", desc: user.language === "ar" ? "الدروس والمواضيع المحفوظة والملاحظات السريعة" : "Saved lessons, bookmarked topics & revision notes", icon: ICON_LOOKUP.bookmarks },
      { id: "curation", label: t.ai_curation || (user.language === "ar" ? "التنظيم الذكي والفجوات" : "AI Curation & Gaps"), desc: user.language === "ar" ? "تشخيص فجوات التعلم والتوصيات المعرفية المخصصة" : "Diagnostic skill gaps, personalized remedial drills & curated resources", icon: Sparkles },
      { id: "degrees", label: t.degrees || (user.language === "ar" ? "البرامج الأكاديمية" : "Degrees"), desc: user.language === "ar" ? "البرامج الأكاديمية وشهادات التخصص المعتمدة" : "Accredited multi-year degree curricula and specialized tracks", icon: ICON_LOOKUP.degrees },
      { id: "career_advisor", label: t.career_advisor || (user.language === "ar" ? "المستشار المهني الذكي" : "Career AI Advisor"), desc: user.language === "ar" ? "تحليل المسارات الوظيفية ورادار المهارات المهنية" : "Market-aligned career pathways and skill radar benchmarks", icon: Compass },
      { id: "educational_materials", label: t.educational_studio || (user.language === "ar" ? "الاستوديو التعليمي" : "Educational Studio"), desc: user.language === "ar" ? "استوديو العروض التقديمية والخرائط الذهنية والفيديوهات" : "Interactive slide decks, video overviews & auto mind maps", icon: Sparkles },
      { id: "project_simulations", label: user.language === "ar" ? "محاكاة المشاريع التطبيقية" : "Project Simulations", desc: user.language === "ar" ? "مختبرات تطبيقية لمحاكاة المشاريع البرمجية والهندسية" : "Hands-on technical lab simulations and applied architecture drills", icon: Briefcase },
      { id: "knowledge_base", label: t.knowledge_base || (user.language === "ar" ? "مستندات Drive" : "Drive"), desc: user.language === "ar" ? "تكامل المستندات والمكتبات السحابية Google Drive" : "Google Drive & Workspace integration for research docs & notes", icon: ICON_LOOKUP.knowledge_base },
      { id: "collections", label: user.language === "ar" ? "المجموعات المنسقة" : "Curated Collections", desc: user.language === "ar" ? "مجموعات معرفية منتقاة وأدوات تخصصية" : "Thematic multi-disciplinary knowledge collections and toolkits", icon: Layers },
    ],
    [t, user.language]
  );

  const secondaryItems = React.useMemo(
    () => [
      { id: "analytics", label: t.analytics || (user.language === "ar" ? "التحليلات ومستوى التقدم" : "Analytics"), desc: user.language === "ar" ? "تحليلات الأداء ومعدل سرعة الدراسة وإتقان المفاهيم" : "Deep-dive radar charts, study velocity and mastery trends", icon: ICON_LOOKUP.analytics },
      { id: "social_forums", label: t.social_forums || (user.language === "ar" ? "المنتديات والنقاشات" : "Social Forums & Q&A"), desc: user.language === "ar" ? "منتديات الأسئلة ونقاشات الزملاء الموجهة بالذكاء الاصطناعي" : "Peer Q&A, AI-assisted explanations & collaborative study notes", icon: ICON_LOOKUP.social_forums },
      { id: "leaderboard", label: t.leaderboard || (user.language === "ar" ? "لوحة الشرف والنقاط" : "Leaderboard & Points"), desc: user.language === "ar" ? "ترتيب النقاط الأسبوعي والمستوى وسلاسل الاستمرار" : "Weekly rank tiers, global standing & streak multiplier boards", icon: ICON_LOOKUP.leaderboard },
      { id: "study_rooms", label: t.study_rooms || (user.language === "ar" ? "غرف الدراسة التفاعلية" : "Study Rooms & Voice"), desc: user.language === "ar" ? "غرف الدراسة الصوتية واللوحات التعاونية الحية" : "Virtual study pods, live voice discussions & shared whiteboards", icon: ICON_LOOKUP.study_rooms },
      { id: "achievements", label: t.achievements || (user.language === "ar" ? "الشارات والشهادات" : "Badges & Certificates"), desc: user.language === "ar" ? "استعراض شارات التميز وإصدار الشهادات الأكاديمية" : "Milestone badges, credential verification & certificates", icon: ICON_LOOKUP.achievements },
      { id: "teacher_dashboard", label: t.teacher_dashboard || (user.language === "ar" ? "استوديو المعلمين" : "Teacher & Faculty Studio"), desc: user.language === "ar" ? "أدوات إعداد المناهج وإدارة فصول الطلاب" : "Curriculum authoring tools and cohort performance oversight", icon: ICON_LOOKUP.teacher_dashboard },
      { id: "api_engine", label: t.api_engine || (user.language === "ar" ? "محرك واجهات البرمجة" : "Developer API Engine"), desc: user.language === "ar" ? "واجهات برمجة التطبيقات وسجلات MCP" : "Autonomous agent APIs, OpenAPI specs & MCP socket bridges", icon: ICON_LOOKUP.api_engine },
      { id: "admin_portal", label: t.admin_portal || (user.language === "ar" ? "بوابة الإدارة والأمان" : "Admin Portal & IAM"), desc: user.language === "ar" ? "إدارة الصلاحيات والأمان وسجلات AST" : "System security controls, AST sandboxing & user permissions", icon: ICON_LOOKUP.admin_portal },
      { id: "settings", label: t.settings || (user.language === "ar" ? "إعدادات المنصة" : "Platform Settings"), desc: user.language === "ar" ? "تفضيلات الذكاء الاصطناعي ومفاتيح API والمظهر" : "Audio synthesis config, model API keys & workspace settings", icon: ICON_LOOKUP.settings, action: onOpenSettings },
      { id: "about", label: t.about || (user.language === "ar" ? "عن المشروع" : "About Project"), desc: user.language === "ar" ? "نظرة عامة على منظومة Zalamati-Nashmi-Petra" : "Zalamati-Nashmi-Petra triadic autonomous agent architecture", icon: ICON_LOOKUP.about },
      { id: "donate", label: t.donate || (user.language === "ar" ? "التوثيق والمراجع" : "Documentation"), desc: user.language === "ar" ? "دليل الاستخدام والتوثيق التقني الشامل" : "Comprehensive operational guides and technical documentation", icon: ICON_LOOKUP.donate },
    ],
    [t, user.language, onOpenSettings]
  );

  return (
    <>
      {/* Mobile Backdrop Overlay when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onToggle}
        />
      )}

      {/* Retractable Bento Executive Sidebar with top clearance for floating header */}
      <aside
        id="main-sidebar"
        className={`fixed top-0 start-0 bottom-0 h-screen max-h-screen h-[100dvh] z-40 bg-[var(--bg-surface)] backdrop-blur-xl border-e border-[var(--border-color)] transition-all duration-300 flex flex-col pt-2 lg:pt-1 ${
          isOpen
            ? "translate-x-0 w-64 shadow-2xl"
            : "-translate-x-full lg:translate-x-0 lg:w-16 rtl:translate-x-full rtl:lg:translate-x-0"
        }`}
        aria-label="Sidebar Platform Navigation"
      >
        {/* Top Header Profile & Toggle */}
        <div className="h-16 flex items-center justify-between shrink-0 px-2.5 border-b border-[var(--border-color)] bg-[var(--bg-surface)] mt-1">
          <Tooltip
            title={user.name}
            description={user.language === "ar" ? `المستوى ${level || 1} • ${xpPoints || 1450} نقطة خبرة XP` : `Scholar Level ${level || 1} • ${xpPoints || 1450} Total XP`}
            position="right"
            delay={200}
            wrapperClassName="flex-1 min-w-0"
          >
            <button
              onClick={onOpenProfile}
              className={`w-full flex items-center gap-2 p-1.5 rounded-xl hover:bg-[var(--bg-surface-hover)] transition-all text-left group ${
                !isOpen && "justify-center"
              }`}
            >
              <div className="relative shrink-0">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full border border-[var(--accent-turquoise)]/30 object-cover group-hover:border-[var(--accent-turquoise)] transition-all"
                />
                <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-full bg-[var(--accent-turquoise)] text-[8px] font-bold text-black border border-[var(--bg-canvas-start)]">
                  L{level || 1}
                </span>
              </div>
              {isOpen && (
                <div className="overflow-hidden flex-1 min-w-0">
                  <div className="text-xs font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--accent-turquoise)]">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-[var(--accent-turquoise)] font-mono flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 fill-[var(--accent-turquoise)] text-[var(--accent-turquoise)] shrink-0" />
                    <span>{xpPoints || 1450} XP</span>
                  </div>
                </div>
              )}
            </button>
          </Tooltip>
          <Tooltip
            title={isOpen ? (user.language === "ar" ? "طي القائمة" : "Collapse Sidebar") : (user.language === "ar" ? "توسيع القائمة" : "Expand Sidebar")}
            description={user.language === "ar" ? "تغيير عرض الشريط الجانبي للتنقل" : "Toggle icon-only mode or expanded labels view"}
            position="right"
            delay={200}
          >
            <button
              onClick={onToggle}
              className="p-1.5 rounded-md bg-[var(--bg-canvas-start)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-white transition-all transform active:scale-90 shrink-0 ml-1"
              aria-label="Toggle Navigation Sidebar"
              aria-controls="main-sidebar"
              aria-expanded={isOpen}
            >
              {isOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </Tooltip>
        </div>

        {/* Primary Bento Navigation Grid prioritizing high-traffic routes with robust active-state highlighting */}
        <nav
          className="flex-1 overflow-y-auto py-3 px-2 custom-scrollbar"
          aria-label="Main Directory"
        >
          <div
            className={`grid gap-2 p-1 ${isOpen ? "grid-cols-2" : "grid-cols-1"}`}
            role="group"
          >
            {primaryItems.map((item) => {
              const isActive = activeTab === item.id || (item.id === "dashboard" && activeTab === "home");
              const isClicked = clickedId === item.id;
              const Icon = item.icon;

              return (
                <Tooltip
                  key={item.id}
                  title={item.label}
                  description={item.desc}
                  position="right"
                  delay={150}
                  wrapperClassName="w-full"
                >
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-150 transform active:scale-95 ${
                      isClicked
                        ? "bg-[var(--accent-turquoise)]/20 text-[var(--accent-turquoise)] border border-[var(--accent-turquoise)] scale-95 shadow-[0_0_15px_rgba(64,224,208,0.3)]"
                        : isActive
                          ? "bg-[var(--accent-navy)] text-white font-bold border-2 border-[var(--accent-turquoise)] shadow-[0_0_20px_rgba(64,224,208,0.25)] backdrop-blur-md ring-2 ring-[var(--accent-turquoise)]/10"
                          : "text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-surface-hover)] border border-transparent"
                    } ${!isOpen && "aspect-square"}`}
                    aria-label={item.label}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <div
                      className={`p-2 rounded-xl mb-1 ${
                        isActive
                          ? "bg-[var(--accent-turquoise)]/20 text-[var(--accent-turquoise)] shadow-sm"
                          : "bg-[var(--bg-canvas-start)] text-[var(--text-secondary)]"
                      } transition-colors shrink-0`}
                    >
                      <MemoizedIcon icon={Icon} className="w-5 h-5" />
                    </div>
                    {isOpen && (
                      <span className="text-[10px] text-center font-medium leading-tight">
                        {item.label}
                      </span>
                    )}
                  </button>
                </Tooltip>
              );
            })}
          </div>

          {/* Secondary Navigation (More Suite with Horizontal Scroll) */}
          <div className="mt-4 pt-3 border-t border-[var(--border-color)]">
            {isOpen && (
              <div className="px-2.5 mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold text-[var(--accent-turquoise)] uppercase tracking-wider">
                  More Suite
                </span>
                <span className="text-[9px] text-[var(--text-muted-custom)] font-mono">
                  Scroll →
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 px-2 scrollbar-none max-w-full">
              {secondaryItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <Tooltip
                    key={item.id}
                    title={item.label}
                    description={item.desc}
                    position="top"
                    delay={150}
                    wrapperClassName="shrink-0"
                  >
                    <button
                      onClick={() => handleItemClick(item.id, (item as any).action)}
                      className={`flex flex-col items-center justify-center rounded-xl text-xs transition-all w-16 h-16 shrink-0 active:scale-95 ${
                        isActive
                          ? "bg-[var(--accent-navy)] text-white font-bold border border-[var(--accent-turquoise)]/40 shadow-md shadow-[var(--accent-turquoise)]/5"
                          : "bg-[var(--bg-canvas-start)] text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-surface-hover)] border border-[var(--border-color)]"
                      }`}
                    >
                      <div className={`p-1 rounded-lg shrink-0 ${isActive ? "bg-[var(--bg-surface-hover)]" : "bg-[var(--bg-canvas-start)]"}`}>
                        <MemoizedIcon icon={Icon} className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9px] truncate w-full text-center mt-1 leading-none font-medium px-1">
                        {item.label}
                      </span>
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Bottom Section: Legal & Links */}
        <div
          className="p-2.5 border-t border-[var(--border-color)] shrink-0 bg-[var(--bg-surface)]"
          role="contentinfo"
          aria-label="Legal and Platform Links"
        >
          {isOpen ? (
            <div className="text-center flex items-center justify-center gap-2 text-[10px] text-[var(--text-muted-custom)]">
              <button
                onClick={() => handleItemClick("legal", onOpenLegalModal)}
                className="hover:text-[var(--accent-turquoise)] transition-colors flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3 text-[var(--accent-turquoise)]" />
                <span>Privacy & Terms</span>
              </button>
              <span>•</span>
              <a
                href="https://lmdpro.app/"
                target="_self"
                className="hover:text-[var(--accent-turquoise)] transition-colors"
              >
                lmdpro.app
              </a>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={() => handleItemClick("legal", onOpenLegalModal)}
                className="p-1.5 rounded-lg bg-[var(--bg-canvas-start)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)]"
                title="Privacy & Terms"
              >
                <ShieldCheck className="w-4 h-4 text-[var(--accent-turquoise)]" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
