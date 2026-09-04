import React from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Brain,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  Zap,
  Activity,
  Info,
  HelpCircle,
} from "lucide-react";
import { TTSPlayer } from "./TTSPlayer";
import { GamificationEngine } from "../shared/gamification.engine";

interface InteractiveExplainerProps {
  topicTitle?: string;
  initialParams?: {
    learningRate?: number;
    complexity?: number;
    depth?: number;
  };
}

export const InteractiveExplainer: React.FC<InteractiveExplainerProps> = ({
  topicTitle = "Advanced Neural & Quantum Mechanics",
  initialParams = { learningRate: 0.05, complexity: 3, depth: 4 },
}) => {
  const [learningRate, setLearningRate] = React.useState<number>(
    initialParams.learningRate || 0.05,
  );
  const [complexity, setComplexity] = React.useState<number>(
    initialParams.complexity || 3,
  );
  const [depth, setDepth] = React.useState<number>(initialParams.depth || 4);
  const [activeTab, setActiveTab] = React.useState<
    "gradient_descent" | "attention_weights" | "quantum_states"
  >("gradient_descent");
  const [isRunningAnimation, setIsRunningAnimation] = React.useState<boolean>(true);
  const [selectedQuizOption, setSelectedQuizOption] = React.useState<number | null>(
    null,
  );
  const [isAnswerCorrect, setIsAnswerCorrect] = React.useState<boolean | null>(null);

  // Calculated metrics for visualization
  const lossValue = Math.max(
    0.02,
    Math.exp(-learningRate * 12) * (1 / complexity) + 0.05 * Math.sin(depth),
  );
  const accuracyValue = Math.min(
    99.4,
    70 + learningRate * 150 - complexity * 1.5 + depth * 2,
  );

  const handleQuizCheck = (optionIndex: number, correctIndex: number) => {
    setSelectedQuizOption(optionIndex);
    const correct = optionIndex === correctIndex;
    setIsAnswerCorrect(correct);
    if (correct) {
      GamificationEngine.awardXP(
        40,
        `Intuition Mastery: ${activeTab.replace("_", " ")}`,
      );
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#0c1c24] via-[#0f2430] to-[#09151c] border border-[#1b3e4f] rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6">
      {/* Magazine-style Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#183645] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Brilliant.org Style Interactive Visualization</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-white">
            {topicTitle}
          </h2>
          <p className="text-sm text-[#87a9b8] mt-1 font-sans">
            Manipulate parameters in real time with Framer Motion animations to
            build deep geometric and mathematical intuition.
          </p>
        </div>

        {/* Module Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#091720] p-1.5 rounded-2xl border border-[#1a3848]">
          {[
            { id: "gradient_descent", label: "Gradient Descent" },
            { id: "attention_weights", label: "Self-Attention Matrix" },
            { id: "quantum_states", label: "Quantum Entanglement" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedQuizOption(null);
                setIsAnswerCorrect(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-cyan-600 to-cyan-600 text-white shadow-lg"
                  : "text-[#81a2b2] hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Sliders & Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-5 space-y-5 bg-[#0a1820] p-5 rounded-2xl border border-[#1b3c4d]"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Live Parameter Injection</span>
            </h3>
            <button
              onClick={() => setIsRunningAnimation(!isRunningAnimation)}
              className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isRunningAnimation
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              }`}
            >
              <Play
                className={`w-3 h-3 ${isRunningAnimation ? "fill-cyan-300" : ""}`}
              />
              <span>{isRunningAnimation ? "Live Animating" : "Paused"}</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Slider 1: Learning Rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold text-gray-200">
                <span>Learning Rate (α):</span>
                <span className="font-mono text-cyan-300">
                  {learningRate.toFixed(3)}
                </span>
              </div>
              <input
                type="range"
                min="0.001"
                max="0.2"
                step="0.005"
                value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <p className="text-[11px] text-[#7a9bb0]">
                Controls step size during optimization. Too high causes
                divergence; too low slows convergence.
              </p>
            </div>

            {/* Slider 2: Model Complexity */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold text-gray-200">
                <span>Network Complexity (Layers):</span>
                <span className="font-mono text-cyan-300">{complexity}</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={complexity}
                onChange={(e) => setComplexity(parseInt(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <p className="text-[11px] text-[#7a9bb0]">
                Higher layers capture intricate non-linear patterns but risk
                overfitting.
              </p>
            </div>

            {/* Slider 3: Attention Depth */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold text-gray-200">
                <span>Context Depth (Attention Heads):</span>
                <span className="font-mono text-cyan-300">{depth}</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={depth}
                onChange={(e) => setDepth(parseInt(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <p className="text-[11px] text-[#7a9bb0]">
                Enables simultaneous multi-perspective token relationship
                modeling.
              </p>
            </div>
          </div>

          {/* Real-time Dynamic Metrics Summary */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#173544]">
            <div className="p-3 rounded-xl bg-[#0e222d] border border-[#1b3e4f]">
              <span className="text-[11px] text-[#7a9bb0] block">
                Estimated Loss (J):
              </span>
              <span className="text-lg font-mono font-extrabold text-cyan-300">
                {lossValue.toFixed(4)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#0e222d] border border-[#1b3e4f]">
              <span className="text-[11px] text-[#7a9bb0] block">
                Validation Accuracy:
              </span>
              <span className="text-lg font-mono font-extrabold text-cyan-400">
                {accuracyValue.toFixed(1)}%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Framer Motion Animated Canvas & Intuition Check */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-7 space-y-5"
        >
          {/* Animated Visual Canvas */}
          <div className="p-6 rounded-2xl bg-[#09151c] border border-[#1a3848] flex flex-col items-center justify-center relative min-h-[320px] overflow-hidden shadow-inner">
            {/* Background grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#112733_1px,transparent_1px),linear-gradient(to_bottom,#112733_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />

            {activeTab === "gradient_descent" && (
              <div className="relative z-10 w-full flex flex-col items-center space-y-6">
                <div className="text-center">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">
                    Loss Landscape Convergence
                  </span>
                  <p className="text-xs text-[#81a2b2] mt-1">
                    Watch gradient descent descend into global minima based on
                    learning rate.
                  </p>
                </div>

                {/* Animated SVG Loss Basin */}
                <svg viewBox="0 0 400 160" className="w-full max-w-md h-auto">
                  <path
                    d="M 20 140 Q 200 10 380 140"
                    fill="none"
                    stroke="#1e3a48"
                    strokeWidth="3"
                  />
                  <path
                    d="M 20 140 Q 200 10 380 140"
                    fill="none"
                    stroke="url(#gradientCurve)"
                    strokeWidth="4"
                    strokeDasharray="380"
                    strokeDashoffset={Math.max(
                      0,
                      380 - (learningRate * 1500 + depth * 10),
                    )}
                    className="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient
                      id="gradientCurve"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="50%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#2dd4bf" />
                    </linearGradient>
                  </defs>

                  {/* Animated Ball Position */}
                  <motion.circle
                    animate={{
                      cx: [100, 200, 260, 200],
                      cy: [40, 110, 125, 110],
                    }}
                    transition={{
                      duration: Math.max(1, 4 - learningRate * 10),
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                    r="10"
                    fill="#22d3ee"
                    stroke="#ffffff"
                    strokeWidth="2"
                    filter="drop-shadow(0px 0px 8px rgba(34, 211, 238, 0.8))"
                  />
                </svg>
              </div>
            )}

            {activeTab === "attention_weights" && (
              <div className="relative z-10 w-full flex flex-col items-center space-y-4">
                <div className="text-center">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">
                    Token Self-Attention Heatmap
                  </span>
                  <p className="text-xs text-[#81a2b2] mt-1">
                    Multi-head attention score distribution across sentence
                    tokens.
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-2 w-full max-w-sm">
                  {["Attention", "Weights", "Compute", "Insight"].map(
                    (token, idx) => (
                      <motion.div
                        key={token}
                        animate={{
                          backgroundColor:
                            idx === 0 || idx === 2
                              ? `rgba(13, 148, 136, ${0.3 + depth * 0.05})`
                              : `rgba(15, 35, 46, 0.9)`,
                          scale: [1, 1.03, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: idx * 0.3,
                        }}
                        className="p-3 rounded-xl border border-[#1e3e4f] text-center"
                      >
                        <span className="text-[11px] font-bold text-white block">
                          {token}
                        </span>
                        <span className="text-[10px] font-mono text-cyan-300">
                          {(0.25 * depth * (idx + 1) * 0.2).toFixed(2)}
                        </span>
                      </motion.div>
                    ),
                  )}
                </div>
              </div>
            )}

            {activeTab === "quantum_states" && (
              <div className="relative z-10 w-full flex flex-col items-center space-y-4">
                <div className="text-center">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">
                    Qubit Bloch Sphere Superposition
                  </span>
                  <p className="text-xs text-[#81a2b2] mt-1">
                    Probability amplitude vector rotation across Hilbert space.
                  </p>
                </div>

                <div className="relative w-36 h-36 rounded-full border-2 border-cyan-500/40 flex items-center justify-center bg-cyan-950/20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute w-full h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-400"
                  />
                  <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] z-10" />
                </div>
              </div>
            )}

            {/* Audio narrator for interactive explanation */}
            <div className="w-full mt-4 pt-3 border-t border-[#183544]">
              <TTSPlayer
                text={`Currently exploring ${activeTab.replace("_", " ")}. With learning rate ${learningRate.toFixed(3)}, complexity ${complexity}, and attention depth ${depth}, the estimated loss is ${lossValue.toFixed(4)} and validation accuracy is ${accuracyValue.toFixed(1)} percent.`}
                title="Listen to Interactive Intuition Narration"
                compact={true}
              />
            </div>
          </div>

          {/* Intuition Check Quiz Card */}
          <div className="p-5 rounded-2xl bg-[#0a1820] border border-[#1b3c4d] space-y-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Brilliant Intuition Check: What happens if α is set extremely
                high?
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                "Loss smoothly converges to zero instantly",
                "Optimizer overshoots minima and diverges",
                "Model architecture collapses into linear regression",
                "Attention weights normalize automatically",
              ].map((opt, idx) => {
                const isSelected = selectedQuizOption === idx;
                const isCorrect = idx === 1;
                let btnStyle =
                  "bg-[#0f232e] border-[#1d3d4e] text-gray-300 hover:border-cyan-400";
                if (isSelected) {
                  if (isCorrect)
                    btnStyle =
                      "bg-cyan-600/20 border-cyan-400 text-cyan-200 font-bold";
                  else
                    btnStyle =
                      "bg-cyan-600/20 border-cyan-400 text-cyan-200 font-bold";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleQuizCheck(idx, 1)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isSelected &&
                      (isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : (
                        <span className="text-cyan-400 text-xs font-bold">
                          ✕
                        </span>
                      ))}
                  </button>
                );
              })}
            </div>

            {selectedQuizOption !== null && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold ${isAnswerCorrect ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300" : "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300"}`}
              >
                {isAnswerCorrect
                  ? "Correct! An excessively high learning rate causes gradient updates to bounce across the valley without settling into the global minimum."
                  : "Not quite. Try thinking about what happens when you take giant steps across a rugged mountain terrain."}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
