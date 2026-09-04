import React from "react";
import {
  Sparkles,
  Brain,
  CheckCircle2,
  RotateCcw,
  Zap,
  HelpCircle,
  Volume2,
  Compass,
  Layers,
  Activity,
} from "lucide-react";
import { TTSPlayer } from "./TTSPlayer";
import { GamificationEngine } from "../shared/gamification.engine";

type InteractiveModule =
  | "neural_activation"
  | "quantum_superposition"
  | "fourier_synthesis"
  | "vector_embeddings";

export const BrilliantExplainer: React.FC = () => {
  const [activeTab, setActiveTab] =
    React.useState<InteractiveModule>("neural_activation");

  // Interactive Neural Activation State
  const [weight, setWeight] = React.useState<number>(1.2);
  const [bias, setBias] = React.useState<number>(-0.5);
  const [inputSignal, setInputSignal] = React.useState<number>(1.0);
  const [activationType, setActivationType] = React.useState<
    "sigmoid" | "relu" | "gelu"
  >("sigmoid");

  // Calculate Neuron Activation Output
  const rawZ = weight * inputSignal + bias;
  let activationOutput = 0;
  if (activationType === "sigmoid") {
    activationOutput = 1 / (1 + Math.exp(-rawZ));
  } else if (activationType === "relu") {
    activationOutput = Math.max(0, rawZ);
  } else if (activationType === "gelu") {
    activationOutput =
      0.5 *
      rawZ *
      (1 +
        Math.tanh(
          Math.sqrt(2 / Math.PI) * (rawZ + 0.044715 * Math.pow(rawZ, 3)),
        ));
  }

  // Quiz / Intuition State
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [showFeedback, setShowFeedback] = React.useState<boolean>(false);

  // Quantum Superposition State
  const [alphaProb, setAlphaProb] = React.useState<number>(70); // % |0>
  const [isMeasured, setIsMeasured] = React.useState<boolean>(false);
  const [measuredState, setMeasuredState] = React.useState<"|0>" | "|1>" | null>(
    null,
  );

  // Fourier Signal State
  const [harmonicsCount, setHarmonicsCount] = React.useState<number>(3);
  const [fundamentalFreq, setFundamentalFreq] = React.useState<number>(1.5);

  // Vector Embedding Similarity State
  const [vectorA, setVectorA] = React.useState<[number, number]>([0.8, 0.6]);
  const [vectorB, setVectorB] = React.useState<[number, number]>([0.5, 0.86]);

  const dotProduct = vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];
  const magA = Math.sqrt(vectorA[0] ** 2 + vectorA[1] ** 2);
  const magB = Math.sqrt(vectorB[0] ** 2 + vectorB[1] ** 2);
  const cosineSim = (dotProduct / (magA * magB || 1)).toFixed(3);

  const handleMeasureQuantum = () => {
    setIsMeasured(true);
    const rand = Math.random() * 100;
    if (rand < alphaProb) {
      setMeasuredState("|0>");
    } else {
      setMeasuredState("|1>");
    }
  };

  const handleResetQuantum = () => {
    setIsMeasured(false);
    setMeasuredState(null);
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-[#0a1820] border border-[#1b3e4f] shadow-2xl space-y-6">
      {/* Brilliant Header Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#183544] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold tracking-wider uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Brilliant Socratic Philosophy
            </span>
            <span className="text-[11px] text-[#7fa1b2] font-semibold">
              Guided Active Discovery & Interactive Mental Models
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Concepts That Click — Visual Academic Mechanics
          </h2>
          <p className="text-xs text-[#82a4b3]">
            Play with mathematical parameters in real time to build true
            step-by-step intuition rather than passive memorization.
          </p>
        </div>

        {/* Module Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-[#0e212b] p-1 rounded-xl border border-[#1c3a48]">
          {[
            { id: "neural_activation", label: "Neural Activation" },
            { id: "quantum_superposition", label: "Quantum Superposition" },
            { id: "fourier_synthesis", label: "Fourier Decomposition" },
            { id: "vector_embeddings", label: "Vector Similarity" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as InteractiveModule);
                setSelectedAnswer(null);
                setShowFeedback(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md"
                  : "text-[#82a4b3] hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Module 1: Neural Activation Visualizer */}
      {activeTab === "neural_activation" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Controls & Equation */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-3.5 rounded-xl bg-[#0f232e] border border-[#1d3d4e] space-y-2">
              <h3 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-cyan-300" />
                Neuron Equation:{" "}
                <span className="font-mono text-white">z = (w · x) + b</span>
              </h3>
              <p className="text-[11px] text-[#81a2b2] leading-relaxed">
                Adjust the input signal (x), synaptic weight (w), and bias (b)
                to observe neuron activation response. Activation functions
                introduce non-linearity, enabling neural networks to learn
                arbitrary continuous functions.
              </p>
            </div>

            {/* Sliders */}
            <div className="space-y-3 bg-[#0d1e27] p-4 rounded-xl border border-[#183645] text-xs">
              <div>
                <div className="flex justify-between font-semibold text-gray-200 mb-1">
                  <span>Input Signal (x):</span>
                  <span className="font-mono text-cyan-300">
                    {inputSignal.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.1"
                  value={inputSignal}
                  onChange={(e) => setInputSignal(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-gray-200 mb-1">
                  <span>Synaptic Weight (w):</span>
                  <span className="font-mono text-blue-300">
                    {weight.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value))}
                  className="w-full accent-blue-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-gray-200 mb-1">
                  <span>Bias Term (b):</span>
                  <span className="font-mono text-blue-400">
                    {bias.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.1"
                  value={bias}
                  onChange={(e) => setBias(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-[#183645]">
                <span className="font-semibold text-gray-300 block mb-1">
                  Activation Function f(z):
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["sigmoid", "relu", "gelu"] as const).map((fn) => (
                    <button
                      key={fn}
                      onClick={() => setActivationType(fn)}
                      className={`py-1 rounded-lg text-[11px] font-mono font-bold uppercase transition-all ${
                        activationType === fn
                          ? "bg-cyan-500 text-slate-950 font-extrabold shadow"
                          : "bg-[#102530] text-[#81a2b2] hover:text-white"
                      }`}
                    >
                      {fn}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SVG Visual Neural Connection */}
          <div className="lg:col-span-7 p-4 rounded-xl bg-[#09151c] border border-[#1a3848] flex flex-col items-center justify-center relative min-h-[280px]">
            <svg viewBox="0 0 400 200" className="w-full h-auto max-w-md">
              <defs>
                <linearGradient
                  id="synapseGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    stopColor="#22d3ee"
                    stopOpacity={Math.abs(inputSignal) / 3}
                  />
                  <stop
                    offset="100%"
                    stopColor="#2dd4bf"
                    stopOpacity={activationOutput}
                  />
                </linearGradient>
              </defs>

              <circle
                cx="60"
                cy="100"
                r={20 + Math.abs(inputSignal) * 4}
                fill="#0284c7"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              <text
                x="60"
                y="104"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="12"
                fontWeight="bold"
              >
                x = {inputSignal.toFixed(1)}
              </text>

              <path
                d="M 85 100 Q 200 60 300 100"
                fill="none"
                stroke="url(#synapseGrad)"
                strokeWidth={Math.max(2, Math.abs(weight) * 3)}
                strokeDasharray="6 3"
                className="animate-[dash_10s_linear_infinite]"
              />

              <rect
                x="170"
                y="65"
                width="60"
                height="24"
                rx="6"
                fill="#0f2b38"
                stroke="#22d3ee"
                strokeWidth="1"
              />
              <text
                x="200"
                y="81"
                textAnchor="middle"
                fill="#22d3ee"
                fontSize="11"
                fontWeight="bold"
              >
                w = {weight.toFixed(1)}
              </text>

              <circle
                cx="320"
                cy="100"
                r={25 + activationOutput * 12}
                fill={activationOutput > 0.5 ? "#0284c7" : "#1e293b"}
                stroke={activationOutput > 0.5 ? "#22d3ee" : "#475569"}
                strokeWidth="3"
                className="transition-all duration-300"
              />
              <text
                x="320"
                y="104"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="13"
                fontWeight="bold"
              >
                a = {activationOutput.toFixed(2)}
              </text>
            </svg>

            <div className="w-full mt-2 p-3 rounded-xl bg-[#0e212b] border border-[#1d3d4e] flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-[#81a2b2]">Linear Combination (z): </span>
                <span className="font-mono text-cyan-300 font-bold">
                  {rawZ.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-[#81a2b2]">
                  Activated Output a = f(z):{" "}
                </span>
                <span className="font-mono text-cyan-400 font-bold text-sm">
                  {(activationOutput * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Module 2: Quantum Superposition Probability */}
      {activeTab === "quantum_superposition" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-3.5 rounded-xl bg-[#0f232e] border border-[#1d3d4e] space-y-2">
              <h3 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-blue-400" />
                Qubit Superposition:{" "}
                <span className="font-mono text-white">|Ψ⟩ = α|0⟩ + β|1⟩</span>
              </h3>
              <p className="text-[11px] text-[#81a2b2] leading-relaxed">
                Until measured, a quantum state exists in superposition on the
                Bloch sphere. Measurement collapses the wavefunction into a
                deterministic state 0 or 1 according to Born rule probabilities
                |α|² and |β|².
              </p>
            </div>

            <div className="space-y-3 bg-[#0d1e27] p-4 rounded-xl border border-[#183645] text-xs">
              <div className="flex justify-between font-semibold text-gray-200">
                <span>Probability of |0⟩:</span>
                <span className="font-mono text-cyan-300">{alphaProb}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={alphaProb}
                onChange={(e) => {
                  setAlphaProb(parseInt(e.target.value));
                  handleResetQuantum();
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-[#7ea0b1]">
                <span>
                  Probability of |1⟩:{" "}
                  <strong className="text-blue-300">
                    {100 - alphaProb}%
                  </strong>
                </span>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleMeasureQuantum}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-600 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-blue-950/40 active:scale-95 transition-all"
                >
                  ⚡ Perform Quantum Measurement
                </button>
                <button
                  onClick={handleResetQuantum}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300"
                  title="Reset Superposition"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 rounded-xl bg-[#09151c] border border-[#1a3848] flex flex-col items-center justify-center min-h-[280px]">
            {!isMeasured ? (
              <div className="text-center space-y-4">
                <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-700 animate-spin blur-md opacity-70" />
                  <div className="relative w-28 h-28 rounded-full bg-[#0a1820] border-2 border-cyan-400 flex items-center justify-center font-mono font-bold text-cyan-200 text-lg shadow-inner">
                    |Ψ⟩
                  </div>
                </div>
                <div className="text-xs text-cyan-300 font-semibold animate-pulse">
                  Quantum Superposition Active ({alphaProb}% |0⟩ /{" "}
                  {100 - alphaProb}% |1⟩)
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <div
                  className={`w-28 h-28 mx-auto rounded-2xl flex items-center justify-center text-3xl font-black shadow-2xl transition-all ${
                    measuredState === "|0>"
                      ? "bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 shadow-cyan-500/30"
                      : "bg-blue-500/20 border-2 border-blue-400 text-blue-300 shadow-blue-500/30"
                  }`}
                >
                  {measuredState}
                </div>
                <div className="text-xs font-bold text-white">
                  Wavefunction Collapsed into State{" "}
                  <span className="text-cyan-400">{measuredState}</span>!
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Module 3: Fourier Signal Decomposition */}
      {activeTab === "fourier_synthesis" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-3.5 rounded-xl bg-[#0f232e] border border-[#1d3d4e] space-y-2">
              <h3 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-400" />
                Fourier Series:{" "}
                <span className="font-mono text-white">
                  f(t) = ∑ Aₙ sin(nωt)
                </span>
              </h3>
              <p className="text-[11px] text-[#81a2b2] leading-relaxed">
                The Fourier Transform breaks any complex periodic signal or
                audio waveform down into a sum of pure sine wave harmonics. This
                is the foundation of digital signal processing, speech
                recognition, and modern MP3/JPEG compression algorithms.
              </p>
            </div>

            <div className="space-y-3 bg-[#0d1e27] p-4 rounded-xl border border-[#183645] text-xs">
              <div>
                <div className="flex justify-between font-semibold text-gray-200 mb-1">
                  <span>Harmonic Overtones (n):</span>
                  <span className="font-mono text-cyan-300">
                    {harmonicsCount} Harmonics
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  value={harmonicsCount}
                  onChange={(e) => setHarmonicsCount(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-gray-200 mb-1">
                  <span>Base Frequency (ω):</span>
                  <span className="font-mono text-cyan-300">
                    {fundamentalFreq.toFixed(1)} Hz
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={fundamentalFreq}
                  onChange={(e) =>
                    setFundamentalFreq(parseFloat(e.target.value))
                  }
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-4 rounded-xl bg-[#09151c] border border-[#1a3848] flex flex-col items-center justify-center min-h-[240px]">
            <svg viewBox="0 0 400 160" className="w-full h-auto max-w-md">
              <path
                d="M 0 80 L 400 80"
                stroke="#1f3d4d"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              <path
                d={Array.from({ length: 100 }).reduce<string>((acc, _, i) => {
                  const t = (i / 100) * Math.PI * 4;
                  let y = 0;
                  for (let h = 1; h <= harmonicsCount; h += 2) {
                    y +=
                      (4 / (Math.PI * h)) * Math.sin(h * fundamentalFreq * t);
                  }
                  const py = 80 - y * 35;
                  const px = (i / 100) * 400;
                  return `${acc} ${i === 0 ? "M" : "L"} ${px} ${py}`;
                }, "")}
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="2.5"
              />
            </svg>
            <p className="text-[11px] text-[#81a2b2] mt-2 font-mono">
              Square Wave Synthesis with {harmonicsCount} Fourier Harmonic
              Components
            </p>
          </div>
        </div>
      )}

      {/* Module 4: High-Dimensional Vector Embeddings */}
      {activeTab === "vector_embeddings" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-3.5 rounded-xl bg-[#0f232e] border border-[#1d3d4e] space-y-2">
              <h3 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-cyan-400" />
                Cosine Similarity:{" "}
                <span className="font-mono text-white">
                  cos(θ) = (A · B) / (||A|| ||B||)
                </span>
              </h3>
              <p className="text-[11px] text-[#81a2b2] leading-relaxed">
                Vector embeddings map words, concepts, and images into
                high-dimensional geometric space. The angle between vectors
                measures semantic similarity, enabling RAG search engines to
                find conceptual matches regardless of exact wording.
              </p>
            </div>

            <div className="space-y-3 bg-[#0d1e27] p-4 rounded-xl border border-[#183645] text-xs">
              <div>
                <span className="font-semibold text-gray-200 block mb-1">
                  Vector A Angle (Concept 1):
                </span>
                <input
                  type="range"
                  min="0"
                  max="1.57"
                  step="0.05"
                  value={Math.atan2(vectorA[1], vectorA[0])}
                  onChange={(e) => {
                    const angle = parseFloat(e.target.value);
                    setVectorA([Math.cos(angle), Math.sin(angle)]);
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <span className="font-semibold text-gray-200 block mb-1">
                  Vector B Angle (Concept 2):
                </span>
                <input
                  type="range"
                  min="0"
                  max="1.57"
                  step="0.05"
                  value={Math.atan2(vectorB[1], vectorB[0])}
                  onChange={(e) => {
                    const angle = parseFloat(e.target.value);
                    setVectorB([Math.cos(angle), Math.sin(angle)]);
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-4 rounded-xl bg-[#09151c] border border-[#1a3848] flex flex-col items-center justify-center min-h-[240px]">
            <svg viewBox="0 0 200 180" className="w-3/4 h-auto max-w-xs">
              <path d="M 20 160 L 180 160" stroke="#1c3b4a" strokeWidth="2" />
              <path d="M 20 160 L 20 20" stroke="#1c3b4a" strokeWidth="2" />

              {/* Vector A */}
              <line
                x1="20"
                y1="160"
                x2={20 + vectorA[0] * 120}
                y2={160 - vectorA[1] * 120}
                stroke="#38bdf8"
                strokeWidth="3"
              />
              <text
                x={30 + vectorA[0] * 120}
                y={155 - vectorA[1] * 120}
                fill="#38bdf8"
                fontSize="11"
                fontWeight="bold"
              >
                Vector A
              </text>

              {/* Vector B */}
              <line
                x1="20"
                y1="160"
                x2={20 + vectorB[0] * 120}
                y2={160 - vectorB[1] * 120}
                stroke="#0ea5e9"
                strokeWidth="3"
              />
              <text
                x={30 + vectorB[0] * 120}
                y={155 - vectorB[1] * 120}
                fill="#0ea5e9"
                fontSize="11"
                fontWeight="bold"
              >
                Vector B
              </text>
            </svg>

            <div className="mt-2 text-xs font-mono font-bold text-white bg-[#0e222d] px-4 py-2 rounded-xl border border-[#1d4052]">
              Cosine Similarity cos(θ) ={" "}
              <span className="text-cyan-300 text-sm">{cosineSim}</span>
            </div>
          </div>
        </div>
      )}

      {/* Step-by-Step Intuition Socratic Discovery Challenge */}
      <div className="p-4 rounded-xl bg-[#0e222d] border border-[#1d3f52] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
          <HelpCircle className="w-4 h-4 text-blue-400" />
          <span>Socratic Discovery Challenge: Test Your Intuition</span>
        </div>

        <p className="text-xs text-gray-200 font-medium">
          {activeTab === "neural_activation"
            ? "When bias (b) is set to a large negative number like -3.0, what happens to the neuron activation probability if input signal is weak?"
            : activeTab === "quantum_superposition"
              ? "If you set probability of |0⟩ to 100% and measure 50 times in a row, what will the measurement results be?"
              : activeTab === "fourier_synthesis"
                ? "What happens as you add higher frequency odd harmonics (n = 1, 3, 5, 7...) to a fundamental sine wave?"
                : "If two vector embeddings have a Cosine Similarity score of 1.0, what does this geometry signify?"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[
            activeTab === "neural_activation"
              ? "Neuron remains inactive (~0) unless input x is strong enough to overcome bias."
              : activeTab === "quantum_superposition"
                ? "Every single measurement will return |0⟩ deterministically."
                : activeTab === "fourier_synthesis"
                  ? "The wave converges rapidly toward an ideal sharp square wave pulse."
                  : "The two concepts are geometrically identical and point in the exact same direction.",
            activeTab === "neural_activation"
              ? "Neuron fires at maximum output 1.0 regardless of input x."
              : activeTab === "quantum_superposition"
                ? "Half of the measurements will return |1⟩ due to quantum noise."
                : activeTab === "fourier_synthesis"
                  ? "The wave cancels out to flat zero DC noise."
                  : "The two concepts are completely orthogonal and unrelated.",
          ].map((option, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedAnswer(idx);
                setShowFeedback(true);
                if (idx === 0) {
                  GamificationEngine.awardXP(
                    40,
                    `Brilliant Discovery: ${activeTab.replace("_", " ")}`,
                  );
                }
              }}
              className={`p-3 rounded-xl border text-left font-medium transition-all ${
                selectedAnswer === idx
                  ? idx === 0
                    ? "bg-cyan-500/20 border-cyan-500 text-cyan-200"
                    : "bg-blue-500/20 border-blue-500 text-blue-200"
                  : "bg-[#122834] border-[#1f4255] text-gray-300 hover:border-cyan-500/50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {showFeedback && (
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Concept Clicked! </span>
              {selectedAnswer === 0
                ? "Spot on! That is how deep activation thresholds, quantum collapses, signal synthesis, and high-dimensional semantic search function."
                : "Not quite. Try adjusting the interactive controls above and observe how the visual geometry responds!"}
            </div>
          </div>
        )}
      </div>

      {/* Integrated Audio Voice Narration for the Explainer */}
      <TTSPlayer
        text="Welcome to Brilliant Socratic active discovery. Every concept is visual and interactive. By playing with variables like weights, biases, quantum probabilities, and vector angles, you build step-by-step intuition that clicks permanently."
        title="Listen to Kudo Concept Audio Explainer"
      />
    </div>
  );
};
