import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  WifiOff,
  Wifi,
  Database,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  RefreshCw,
  Zap,
  ArrowRight,
} from "lucide-react";
import { toastService, ToastMessage } from "../services/toastService";

export const ToastNotificationSystem: React.FC = () => {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  React.useEffect(() => {
    const unsubscribe = toastService.subscribe((updatedToasts) => {
      setToasts(updatedToasts);
    });
    return () => unsubscribe();
  }, []);

  const getToastIcon = (type: ToastMessage["type"]) => {
    switch (type) {
      case "offline":
        return <WifiOff className="w-5 h-5 text-cyan-400" />;
      case "online":
        return <Wifi className="w-5 h-5 text-cyan-400" />;
      case "sync":
        return <Database className="w-5 h-5 text-cyan-400 animate-pulse" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-cyan-400" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-cyan-400" />;
      case "info":
      default:
        return <Info className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getToastBorderAndBg = (type: ToastMessage["type"]) => {
    switch (type) {
      case "offline":
        return "bg-[#140f06]/95 border-cyan-500/40 shadow-cyan-500/10 text-cyan-100";
      case "online":
        return "bg-[#05160d]/95 border-cyan-500/40 shadow-cyan-500/10 text-cyan-100";
      case "sync":
        return "bg-[#051824]/95 border-cyan-500/40 shadow-cyan-500/10 text-cyan-100";
      case "success":
        return "bg-[#05160d]/95 border-cyan-500/40 shadow-cyan-500/10 text-cyan-100";
      case "warning":
        return "bg-[#180709]/95 border-cyan-500/40 shadow-cyan-500/10 text-cyan-100";
      case "info":
      default:
        return "bg-[#0e0a1a]/95 border-cyan-500/40 shadow-cyan-500/10 text-cyan-100";
    }
  };

  return (
    <div
      className="fixed top-14 right-4 z-[999] flex flex-col gap-2.5 max-w-sm w-[calc(100vw-32px)] sm:w-96 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`p-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl pointer-events-auto flex items-start justify-between gap-3 overflow-hidden relative ${getToastBorderAndBg(
              toast.type,
            )}`}
          >
            {/* Ambient Background Glow Sheen */}
            <div className="absolute -left-10 -top-10 w-28 h-28 bg-white/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0 mt-0.5">
                {getToastIcon(toast.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-white tracking-wide truncate">
                    {toast.title}
                  </h4>
                  {toast.type === "sync" && (
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono font-bold uppercase shrink-0">
                      Syncing
                    </span>
                  )}
                  {toast.type === "offline" && (
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono font-bold uppercase shrink-0">
                      Local Cache
                    </span>
                  )}
                </div>

                <p className="text-[11px] leading-relaxed text-slate-300 opacity-90 break-words">
                  {toast.message}
                </p>

                {toast.actionLabel && toast.onAction && (
                  <button
                    onClick={() => {
                      toast.onAction?.();
                      toastService.dismiss(toast.id);
                    }}
                    className="mt-2 text-[11px] font-bold text-cyan-300 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>{toast.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => toastService.dismiss(toast.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
