import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Zap,
  Award,
  Flame,
  Trophy,
  Star,
  ChevronUp,
} from "lucide-react";
import { GamificationEngine, PointEvent } from "../shared/gamification.engine";

interface FloatingFloater {
  id: string;
  xpEarned: number;
  reason: string;
  multiplier: number;
  levelUp: boolean;
  newLevel: number;
  badgeName?: string;
  xOffset: number;
}

export const LivePointPreviewSystem: React.FC = () => {
  const [floaters, setFloaters] = React.useState<FloatingFloater[]>([]);
  const [levelUpOverlay, setLevelUpOverlay] = React.useState<{
    show: boolean;
    level: number;
  } | null>(null);

  React.useEffect(() => {
    const unsubscribe = GamificationEngine.subscribe((event: PointEvent) => {
      const xOffset = Math.floor(Math.random() * 80) - 40; // slight horizontal float variation
      const newFloater: FloatingFloater = {
        id: event.id,
        xpEarned: event.xpEarned,
        reason: event.reason,
        multiplier: event.multiplier,
        levelUp: event.levelUp,
        newLevel: event.newLevel,
        badgeName: event.unlockedBadges[0]?.name,
        xOffset,
      };

      setFloaters((prev) => [newFloater, ...prev].slice(0, 4));

      if (event.levelUp) {
        setLevelUpOverlay({ show: true, level: event.newLevel });
        setTimeout(() => setLevelUpOverlay(null), 4000);
      }

      // Auto dismiss individual floaters after 3.2 seconds
      setTimeout(() => {
        setFloaters((prev) => prev.filter((f) => f.id !== event.id));
      }, 3200);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {/* Floating Active Points Preview Popup Stack (Bottom Right / Floating Center) */}
      <div className="fixed bottom-20 right-6 z-[9999] pointer-events-none flex flex-col items-end gap-3">
        <AnimatePresence>
          {floaters.map((floater) => (
            <motion.div
              key={floater.id}
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              style={{ x: floater.xOffset }}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-[#0c2330]/95 via-[#0e2c3d]/95 to-[#081a24]/95 border border-cyan-400/50 shadow-[0_0_25px_rgba(34,211,238,0.35)] backdrop-blur-xl flex items-center gap-3 text-white pointer-events-auto"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-cyan-400 p-0.5 shadow-lg shrink-0 flex items-center justify-center text-slate-950 font-black text-xs">
                <Zap className="w-5 h-5 text-slate-950 fill-slate-950 animate-pulse" />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-cyan-300 font-mono tracking-tight">
                    +{floater.xpEarned} XP
                  </span>
                  {floater.multiplier > 1 && (
                    <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                      {floater.multiplier}x Streak
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#9fc0d1] font-medium leading-tight">
                  {floater.reason}
                </p>
                {floater.badgeName && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-cyan-300 font-bold">
                    <Award className="w-3 h-3 text-cyan-400" /> Badge:{" "}
                    {floater.badgeName}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Fullscreen Level Up Celebration Overlay Modal */}
      <AnimatePresence>
        {levelUpOverlay?.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.7, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: -20 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="max-w-md w-full bg-gradient-to-b from-[#0c1e28] via-[#091720] to-[#050e14] border-2 border-cyan-400/60 p-8 rounded-3xl text-center space-y-6 shadow-[0_0_60px_rgba(34,211,238,0.3)] relative overflow-hidden text-white"
            >
              {/* Background Ray Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.15)_0%,transparent_70%)] pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-cyan-500 via-cyan-400 to-cyan-500 text-slate-950 shadow-xl shadow-cyan-500/30 animate-bounce">
                  <Trophy className="w-12 h-12 text-slate-950" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-300">
                    Academic Rank Promotion
                  </span>
                  <h2 className="text-3xl font-black text-white tracking-tight">
                    Level {levelUpOverlay.level} Unlocked!
                  </h2>
                </div>

                <p className="text-xs text-[#8cb0c2] leading-relaxed max-w-sm mx-auto">
                  Your academic velocity has elevated you to Level{" "}
                  {levelUpOverlay.level}. New degree specialization electives
                  and research tools are now unlocked.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => setLevelUpOverlay(null)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-cyan-500 to-cyan-500 hover:from-cyan-400 hover:to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all"
                  >
                    Claim Promotion & Continue
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
