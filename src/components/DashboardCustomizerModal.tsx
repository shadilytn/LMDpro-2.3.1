import React from "react";
import { UserProfile, DashboardWidgetConfig } from "../shared/types";
import { X, LayoutGrid, Eye, EyeOff, ArrowUp, ArrowDown, Sparkles, Check, Flame, Clock, Brain, Compass, Award } from "lucide-react";
import { SmartSortEngine, SmartSortMode } from "../services/SmartSortEngine";

interface DashboardCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  smartSortMode?: SmartSortMode;
  onSelectSmartSortMode?: (mode: SmartSortMode) => void;
  smartSortEnabled?: boolean;
  onToggleSmartSort?: () => void;
}

const DEFAULT_WIDGETS: DashboardWidgetConfig[] = [
  { id: "quick_stats", title: "Quick Stats & Metrics Bar", visible: true, order: 0 },
  { id: "streak_counter", title: "Streak Counter & Daily Goal", visible: true, order: 1 },
  { id: "gamification_hub", title: "Gamification, Points & Leaderboard Hub", visible: true, order: 2 },
  { id: "ai_recommendations", title: "AI Personalized Recommendation Engine", visible: true, order: 3 },
  { id: "d3_learning_path", title: "D3 Interactive Learning Path Map", visible: true, order: 4 },
  { id: "ai_discovery_feed", title: "AI Academic Discovery Feed & Knowledge Gaps", visible: true, order: 5 },
  { id: "weekly_summary", title: "Weekly Learning Summary", visible: true, order: 6 },
  { id: "challenge_arena", title: "Challenge Arena", visible: true, order: 7 },
  { id: "recent_activity", title: "Recent Activity & Lesson Progress", visible: true, order: 8 },
  { id: "upcoming_deadlines", title: "Upcoming Deadlines & Schedule", visible: true, order: 9 },
  { id: "enrolled_courses", title: "Enrolled & Recommended Courses Grid", visible: true, order: 10 },
  { id: "google_workspace", title: "Google Workspace & Cloud Files", visible: true, order: 11 },
];

export const DashboardCustomizerModal: React.FC<DashboardCustomizerModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  smartSortMode = 'ai_priority',
  onSelectSmartSortMode,
  smartSortEnabled = true,
  onToggleSmartSort,
}) => {
  if (!isOpen) return null;

  const isAr = user.language === 'ar';

  const currentWidgets: DashboardWidgetConfig[] =
    user.dashboardWidgets && user.dashboardWidgets.length > 0
      ? [...user.dashboardWidgets].sort((a, b) => a.order - b.order)
      : DEFAULT_WIDGETS;

  const handleToggleVisibility = (id: string) => {
    const updated = currentWidgets.map((w) =>
      w.id === id ? { ...w, visible: !w.visible } : w
    );
    onUpdateUser({ dashboardWidgets: updated });
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const newWidgets = [...currentWidgets];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newWidgets.length) return;

    // Swap
    const temp = newWidgets[index];
    newWidgets[index] = newWidgets[targetIndex];
    newWidgets[targetIndex] = temp;

    // Recalculate orders
    const reordered = newWidgets.map((w, idx) => ({ ...w, order: idx }));
    onUpdateUser({ dashboardWidgets: reordered });
  };

  const handleResetToDefault = () => {
    onUpdateUser({ dashboardWidgets: DEFAULT_WIDGETS });
  };

  const smartScores = React.useMemo(() => {
    return SmartSortEngine.computeWidgetScores(user, [], {}, smartSortMode);
  }, [user, smartSortMode]);

  const scoresMap = React.useMemo(() => {
    const map = new Map<string, number>();
    smartScores.forEach((s) => map.set(s.widgetId, s.score));
    return map;
  }, [smartScores]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0b171f] border border-[#1e3c4d] shadow-2xl p-5 sm:p-6 space-y-5 text-white max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#163647] pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <LayoutGrid className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                {isAr ? "مخصص وترتيب لوحة التحكم الذكي" : "Smart Dashboard Customizer & Layout"}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono">
                  Smart Sort AI
                </span>
              </h3>
              <p className="text-xs text-[#82a3b2]">
                {isAr
                  ? "تخصيص الترتيب التلقائي، مستوى الأولوية وإخفاء أو إظهار البطاقات."
                  : "Customize automated priority sorting, widget visibility, and drag sequence."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#122834] text-gray-400 hover:text-white transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Smart Sort Mode Switcher */}
        <div className="p-3.5 rounded-2xl bg-[#07151e] border border-cyan-500/30 space-y-2.5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white">
                {isAr ? "محرك الترتيب الذكي (Smart Sort)" : "Automated Smart Sort Algorithm"}
              </span>
            </div>
            {onToggleSmartSort && (
              <button
                onClick={onToggleSmartSort}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                  smartSortEnabled
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "bg-[#142834] text-gray-400 border border-gray-700"
                }`}
              >
                {smartSortEnabled ? (isAr ? "مفعّل" : "Active") : (isAr ? "معطّل" : "Disabled")}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
            {[
              { id: 'ai_priority', label: isAr ? "الأولوية الذكية" : "AI Priority", icon: Brain },
              { id: 'deadline_urgency', label: isAr ? "المواعيد الحرجة" : "Deadlines", icon: Clock },
              { id: 'engagement', label: isAr ? "التفاعل والسلسلة" : "Engagement", icon: Flame },
              { id: 'custom', label: isAr ? "ترتيب يدوي" : "Manual", icon: LayoutGrid },
            ].map((m) => {
              const Icon = m.icon;
              const isSelected = smartSortMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onSelectSmartSortMode && onSelectSmartSortMode(m.id as SmartSortMode)}
                  className={`p-2 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 border transition-all ${
                    isSelected
                      ? "bg-cyan-950/80 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-950/50"
                      : "bg-[#0c1c26] text-[#7da0b0] border-[#183647] hover:bg-[#102430] hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="truncate">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Widgets List */}
        <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 min-h-[220px]">
          {currentWidgets.map((widget, index) => {
            const score = scoresMap.get(widget.id) || 50;
            return (
              <div
                key={widget.id}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  widget.visible
                    ? "bg-[#0f232e] border-[#1f4559]"
                    : "bg-[#071319] border-[#132c38] opacity-60"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-[#071319] text-cyan-400 font-mono text-xs flex items-center justify-center border border-[#1a3848] shrink-0">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-white truncate">{widget.title}</h4>
                      {smartSortEnabled && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-500/30 shrink-0">
                          {score} pts
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#789cae] truncate">
                      {widget.visible ? (isAr ? "مرئي على لوحة التحكم" : "Visible on Dashboard") : (isAr ? "مخفي" : "Hidden from view")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleMove(index, "up")}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg bg-[#071319] text-gray-300 hover:text-white border border-[#1a3848] disabled:opacity-30 transition-all"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(index, "down")}
                    disabled={index === currentWidgets.length - 1}
                    className="p-1.5 rounded-lg bg-[#071319] text-gray-300 hover:text-white border border-[#1a3848] disabled:opacity-30 transition-all"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleToggleVisibility(widget.id)}
                    className={`px-2.5 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all ${
                      widget.visible
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        : "bg-[#182b36] text-gray-400 border border-[#244252]"
                    }`}
                  >
                    {widget.visible ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isAr ? "مُظهر" : "Shown"}</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>{isAr ? "مخفي" : "Hidden"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#163647] shrink-0">
          <button
            onClick={handleResetToDefault}
            className="text-xs text-cyan-400 hover:text-cyan-300 underline font-medium"
          >
            {isAr ? "استعادة التخطيط الافتراضي" : "Reset to Default Layout"}
          </button>

          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            {isAr ? "حفظ وتطبيق الترتيب" : "Save & Apply Layout"}
          </button>
        </div>
      </div>
    </div>
  );
};

