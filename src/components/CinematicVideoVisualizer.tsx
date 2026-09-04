import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  RotateCcw,
  Film,
  Cpu,
  Sparkles,
  Terminal,
  Activity,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface CinematicVideoVisualizerProps {
  lessonTitle: string;
  lessonContent?: string;
}

export const CinematicVideoVisualizer: React.FC<
  CinematicVideoVisualizerProps
> = ({ lessonTitle, lessonContent = "" }) => {
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [currentTime, setCurrentTime] = React.useState(0);
  const duration = 24; // seconds for simulated cinematic loop

  React.useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => (prev >= duration ? 0 : prev + 0.5));
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, duration]);

  const progressPercent = (currentTime / duration) * 100;

  // Generate dynamic contextual visual steps based on lesson title
  const getStepInfo = (time: number) => {
    if (time < 6) {
      return {
        stage: "Phase 1: Conceptual Core & Vector Initialization",
        desc: `Synthesizing multidimensional embedding spaces for "${lessonTitle}".`,
        code: `import { GoogleGenAI } from '@google/genai';\nconst ai = new GoogleGenAI();\nconst embedding = await ai.models.embedContent({ model: 'text-embedding-004', content: '${lessonTitle}' });`,
        metric: "Vector Index: 1024-D",
      };
    } else if (time < 12) {
      return {
        stage: "Phase 2: Hybrid Agentic Engine Execution",
        desc: "Routing asynchronous execution between Cloud (Gemini 3.1 Flash) and Edge (Nano Banana Pro).",
        code: `async function executeHybridWorkflow(task) {\n  const edgeResult = await nanoBanana.redactPII(task);\n  return await geminiClient.synthesize(edgeResult);\n}`,
        metric: "Latency: <12ms (Edge)",
      };
    } else if (time < 18) {
      return {
        stage: "Phase 3: Real-Time Vector RAG & State Sync",
        desc: "Cross-referencing live knowledge graphs with secure WebSockets & Firestore state persistence.",
        code: `const snapshot = await firestore.collection('courses').doc(activeId).get();\nwsBus.emit('state_sync', snapshot.data());`,
        metric: "Sync Rate: 120 FPS",
      };
    } else {
      return {
        stage: "Phase 4: Cinematic Motion Graphics & Synthesis",
        desc: "Rendering high-fidelity educational animations and interactive sliders.",
        code: `export const RenderCinematicExplainer = () => {\n  return <motion.div animate={{ scale: [1, 1.05, 1] }} />;\n};`,
        metric: "Render Status: Optimized",
      };
    }
  };

  const currentStep = getStepInfo(currentTime);

  return (
    <div className="rounded-3xl bg-black border border-white/15 p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Film className="w-3.5 h-3.5 text-cyan-400" />
            <span>Gemini Veo & AI Code Execution Visualizer</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
            Cinematic Motion Graphics Explainer
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Generated background intelligence for:{" "}
            <span className="text-cyan-300 font-semibold">{lessonTitle}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-cyan-400 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>{currentStep.metric}</span>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            <span>{isPlaying ? "Pause" : "Play"}</span>
          </button>
        </div>
      </div>

      {/* Cinematic Animated Visualizer Stage */}
      <div className="relative w-full h-[280px] sm:h-[340px] bg-gradient-to-b from-[#050b0f] via-[#020508] to-black rounded-2xl border border-white/10 overflow-hidden flex flex-col items-center justify-center p-6 shadow-inner relative z-10">
        {/* Animated Background Vector Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

        {/* Dynamic Visual Elements based on time */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, 180, 360],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="w-72 h-72 rounded-full border border-cyan-500/30 blur-sm"
          />
          <motion.div
            animate={{
              scale: [1.1, 0.95, 1.1],
              rotate: [360, 180, 0],
              opacity: [0.15, 0.35, 0.15],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-96 h-96 rounded-full border border-cyan-500/20 blur-md"
          />
        </div>

        {/* Center Stage Card */}
        <div className="relative z-10 max-w-lg w-full bg-black/80 backdrop-blur-xl border border-white/15 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              {currentStep.stage}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-gray-300">
              {currentTime.toFixed(1)}s / {duration}.0s
            </span>
          </div>

          <p className="text-xs text-gray-200 leading-relaxed font-sans">
            {currentStep.desc}
          </p>

          {/* Simulated Code Execution Snippet */}
          <div className="bg-[#05070a] p-3 rounded-xl border border-white/10 font-mono text-[11px] text-cyan-300/95 overflow-x-auto">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10 text-[10px] text-gray-400">
              <span className="flex items-center gap-1">
                <Terminal className="w-3 h-3 text-cyan-400" />
                Background Execution Engine
              </span>
              <span className="text-cyan-400 font-semibold">● Active</span>
            </div>
            <pre className="whitespace-pre-wrap">{currentStep.code}</pre>
          </div>
        </div>
      </div>

      {/* Video Progress Bar & Timeline Scrubber */}
      <div className="space-y-2 relative z-10">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="font-mono text-cyan-300">
            Cinematic Progress Timeline
          </span>
          <span className="font-mono">{progressPercent.toFixed(0)}%</span>
        </div>

        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newTime = (clickX / rect.width) * duration;
            setCurrentTime(Math.max(0, Math.min(duration, newTime)));
          }}
          className="w-full h-2.5 rounded-full bg-white/10 cursor-pointer overflow-hidden relative"
        >
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
