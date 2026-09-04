import React from "react";
import {
  X,
  Command,
  Keyboard,
  Search,
  MessageSquare,
  Settings,
  Layout,
  HelpCircle,
  Mic,
} from "lucide-react";

interface QuickKeyModalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickKeyModalOverlay: React.FC<QuickKeyModalOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcutGroups = [
    {
      category: "General Navigation",
      items: [
        {
          keys: ["Ctrl", "K"],
          label: "Global Course & Knowledge Search",
          icon: Search,
        },
        {
          keys: ["Ctrl", "S"],
          label: "Open Settings & Preferences",
          icon: Settings,
        },
        {
          keys: ["Ctrl", "V"],
          label: "Voice Navigation & Acoustic Control",
          icon: Mic,
        },
        {
          keys: ["Ctrl", "B"],
          label: "Toggle Sidebar Navigation",
          icon: Layout,
        },
        { keys: ["?"], label: "Toggle Quick-Key Overlay", icon: HelpCircle },
        { keys: ["Esc"], label: "Dismiss Active Overlay or Modal", icon: X },
      ],
    },
    {
      category: "Study & Knowledge Tools",
      items: [
        {
          keys: ["Ctrl", "O"],
          label: "Obsidian Notes Vault & Knowledge Graph",
          icon: Command,
        },
        {
          keys: ["Ctrl", "A"],
          label: "Microsoft Access DB & Office Suite",
          icon: Command,
        },
        {
          keys: ["Ctrl", "W"],
          label: "Google Workspace Cloud Sync Hub",
          icon: Command,
        },
        {
          keys: ["Ctrl", "T"],
          label: "Launch Socratic Tutor",
          icon: MessageSquare,
        },
        {
          keys: ["Ctrl", "N"],
          label: "Open Quick Scratchpad & Notes",
          icon: Command,
        },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickkey-modal-title"
      aria-label="Keyboard Shortcuts Overlay Modal"
    >
      <div
        className="w-full max-w-lg bg-[#0a1218] border border-[#1b3e52] rounded-3xl shadow-2xl overflow-hidden p-6 text-white space-y-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#183648] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="quickkey-modal-title"
                className="text-base font-bold text-white"
              >
                Platform Keyboard Shortcuts
              </h2>
              <p className="text-xs text-[#7195a8]">
                Quick commands for seamless keyboard navigation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close keyboard shortcuts overlay"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#7195a8] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
          {shortcutGroups.map((group, idx) => (
            <div key={idx} className="space-y-2.5">
              <h3 className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider font-mono">
                {group.category}
              </h3>
              <div className="space-y-1.5">
                {group.items.map((item, itemIdx) => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={itemIdx}
                      className="p-3 rounded-2xl bg-[#0e1d27] border border-[#18374a] flex items-center justify-between transition-colors hover:border-cyan-500/30"
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComp className="w-4 h-4 text-[#7195a8]" />
                        <span className="text-xs font-medium text-[#d3e5ef]">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 font-mono">
                        {item.keys.map((k, kIdx) => (
                          <kbd
                            key={kIdx}
                            className="px-2 py-1 text-[10px] font-bold text-cyan-300 bg-[#07131b] border border-[#1c4056] rounded-lg shadow-inner"
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-[#183648] flex items-center justify-between text-[11px] text-[#6e90a1]">
          <span>
            Press{" "}
            <kbd className="px-1.5 py-0.5 bg-[#122b3a] rounded text-cyan-300">
              Esc
            </kbd>{" "}
            anytime to exit
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all"
            aria-label="Dismiss Shortcuts Overlay"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
