import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Layers,
  Cpu,
  Zap,
  Activity,
  Maximize2,
  Minimize2,
  Sparkles,
  RefreshCw,
  Play,
  Pause,
  Sliders,
  Rotate3d,
  Compass,
  CheckCircle2,
  Volume2,
  Share2,
  Download,
  Terminal,
  Eye,
  Crosshair,
  ArrowRight,
  ShieldCheck,
  Flame,
  Wind
} from "lucide-react";
import { ApiService, AnimagraphExplainerResponse } from "../shared/api.service";

interface AnimagraphTechnicalExplainerProps {
  initialTopic?: string;
  className?: string;
}

const PRESET_TOPICS = [
  {
    id: "gpu_tensor_core",
    title: "GPU Tensor Core & Systolic Array Architecture",
    category: "Hardware & Semiconductor Engineering",
    description: "4x4 Matrix Multiply-Accumulate (MMA) pipeline with FP16 inputs and FP32 accumulation registers."
  },
  {
    id: "turbofan_jet_engine",
    title: "High-Bypass Turbofan Engine Internal Gas Flow",
    category: "Aerospace & Thermodynamics",
    description: "Multi-stage compression, annular combustion chamber, and counter-rotating turbine expansion."
  },
  {
    id: "quantum_transmon_qubit",
    title: "Superconducting Transmon Qubit & Microwave Cavity",
    category: "Quantum Information Science",
    description: "Josephson junction non-linear inductance coupled to coplanar waveguide resonator."
  },
  {
    id: "distributed_raft_consensus",
    title: "Distributed Raft Consensus & Log Replication Pipeline",
    category: "Distributed Systems",
    description: "Leader heartbeats, RPC quorum replication, and linearizable state machine transitions."
  }
];

export const AnimagraphTechnicalExplainer: React.FC<AnimagraphTechnicalExplainerProps> = ({
  initialTopic = "GPU Tensor Core & Systolic Array Architecture",
  className = ""
}) => {
  const [selectedTopic, setSelectedTopic] = React.useState(initialTopic);
  const [customTopic, setCustomTopic] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [explainerData, setExplainerData] = React.useState<AnimagraphExplainerResponse | null>(null);
  
  // Viewport & Interactive State
  const [activeStepIndex, setActiveStepIndex] = React.useState(0);
  const [selectedComponentId, setSelectedComponentId] = React.useState<string | null>(null);
  const [activeMode, setActiveMode] = React.useState<string>("isometric_cutaway");
  const [isPlayingFlow, setIsPlayingFlow] = React.useState(true);
  const [flowSpeed, setFlowSpeed] = React.useState(1.2);
  const [showWireframeGrid, setShowWireframeGrid] = React.useState(true);
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const [activeParameterValues, setActiveParameterValues] = React.useState<Record<string, number>>({});

  // Fetch or update explainer data
  const loadExplainer = async (topicToFetch: string) => {
    setIsLoading(true);
    try {
      const data = await ApiService.getAnimagraphExplainer({
        topic: topicToFetch,
        depthLevel: "ADVANCED"
      });
      setExplainerData(data);
      setActiveStepIndex(0);
      if (data.components?.length > 0) {
        setSelectedComponentId(data.components[0].id);
      }
      if (data.interactiveModes?.length > 0) {
        setActiveMode(data.interactiveModes[0].id);
      }
      // Initialize parameter values
      const initialParams: Record<string, number> = {};
      data.parameters?.forEach((p) => {
        initialParams[p.name] = p.default;
      });
      setActiveParameterValues(initialParams);
    } catch (err) {
      console.warn("Failed to fetch animagraph explainer:", err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadExplainer(selectedTopic);
  }, [selectedTopic]);

  const handleParamChange = (name: string, val: number) => {
    setActiveParameterValues((prev) => ({ ...prev, [name]: val }));
  };

  const currentStep = explainerData?.steps?.[activeStepIndex];
  const activeComponent = explainerData?.components?.find((c) => c.id === selectedComponentId);

  return (
    <div
      className={`bg-[#08151c] border border-[#1b3b4a] rounded-3xl p-5 sm:p-7 text-white shadow-2xl space-y-6 ${className}`}
    >
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#183646] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Rotate3d className="w-3.5 h-3.5 text-cyan-400" />
              Animagraph 3D Technical Infographics Engine
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
              60 FPS Vector Motion
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {explainerData?.title || selectedTopic}
          </h2>
          <p className="text-xs text-[#789cae] mt-1 max-w-2xl">
            {explainerData?.overview ||
              "Interactive exploded engineering cross-sections, internal particle flow simulations, and mathematical coordinate mappings."}
          </p>
        </div>

        {/* Preset Selector & Custom Input */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-[#0c1a24] border border-[#1b3b4a] text-xs text-white rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-cyan-400 font-sans"
            >
              {PRESET_TOPICS.map((t) => (
                <option key={t.id} value={t.title} className="bg-[#08151c] text-white">
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => loadExplainer(selectedTopic)}
            disabled={isLoading}
            className="p-2 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] hover:border-cyan-400 text-cyan-400 transition-all disabled:opacity-50"
            title="Regenerate Explainer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Interactive Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center: Interactive 3D Vector Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Visual Canvas Frame */}
          <div className="relative rounded-2xl bg-gradient-to-b from-[#050e14] via-[#091822] to-[#040b10] border border-[#1b3b4a] p-4 sm:p-6 overflow-hidden min-h-[380px] sm:min-h-[440px] flex flex-col justify-between shadow-inner">
            {/* Background Isometric Blueprint Grid Overlay */}
            {showWireframeGrid && (
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #22d3ee 1px, transparent 1px),
                    linear-gradient(to bottom, #22d3ee 1px, transparent 1px)
                  `,
                  backgroundSize: "32px 32px"
                }}
              />
            )}

            {/* Top Viewport Toolbar */}
            <div className="relative z-10 flex items-center justify-between flex-wrap gap-2">
              {/* Interactive Modes */}
              <div className="flex items-center gap-1.5 bg-[#08151c]/80 backdrop-blur-md p-1 rounded-xl border border-[#1b3b4a]">
                {explainerData?.interactiveModes?.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1 ${
                      activeMode === mode.id
                        ? "bg-cyan-500/25 border border-cyan-400 text-cyan-200 font-bold shadow"
                        : "text-[#789cae] hover:text-white"
                    }`}
                  >
                    {mode.id.includes("cutaway") && <Layers className="w-3 h-3 text-cyan-400" />}
                    {mode.id.includes("particle") && <Wind className="w-3 h-3 text-cyan-400" />}
                    {mode.id.includes("thermal") && <Flame className="w-3 h-3 text-cyan-400" />}
                    {mode.id.includes("wireframe") && <Crosshair className="w-3 h-3 text-cyan-400" />}
                    <span>{mode.label}</span>
                  </button>
                ))}
              </div>

              {/* Viewport Toggles */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsPlayingFlow(!isPlayingFlow)}
                  className={`p-1.5 rounded-lg border text-xs ${
                    isPlayingFlow
                      ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                      : "bg-[#08151c] border-[#1b3b4a] text-[#789cae]"
                  }`}
                  title={isPlayingFlow ? "Pause Dynamics" : "Play Dynamics"}
                >
                  {isPlayingFlow ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => setShowWireframeGrid(!showWireframeGrid)}
                  className={`px-2 py-1 rounded-lg border text-[10px] font-mono ${
                    showWireframeGrid
                      ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                      : "bg-[#08151c] border-[#1b3b4a] text-[#789cae]"
                  }`}
                >
                  Grid {showWireframeGrid ? "ON" : "OFF"}
                </button>
              </div>
            </div>

            {/* Central Animated Vector CAD / Exploded Isometric Diagram */}
            <div className="relative z-10 flex-1 my-4 flex items-center justify-center min-h-[240px]">
              {isLoading ? (
                <div className="flex flex-col items-center gap-3 text-cyan-400">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                  <span className="text-xs font-mono">Compiling 3D Coordinate Meshes & Flowpaths...</span>
                </div>
              ) : (
                <div className="w-full max-w-lg h-full flex flex-col items-center justify-center relative">
                  {/* SVG Animated Sketchup Visualization */}
                  <svg
                    viewBox="0 0 500 300"
                    className="w-full h-auto max-h-[280px] drop-shadow-2xl overflow-visible"
                  >
                    <defs>
                      <linearGradient id="amberGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#0891b2" stopOpacity="0.3" />
                      </linearGradient>
                      <linearGradient id="cyanStream" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#34d399" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="#34d399" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.3" />
                      </linearGradient>
                      <linearGradient id="cyanThermal" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.4" />
                      </linearGradient>
                    </defs>

                    {/* Isometric Base Plane */}
                    <polygon
                      points="250,50 430,140 250,230 70,140"
                      fill="#0c1a24"
                      fillOpacity="0.7"
                      stroke="#1b3b4a"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />

                    {/* Dynamic Component Blocks */}
                    {explainerData?.components?.map((comp, idx) => {
                      const isSelected = comp.id === selectedComponentId;
                      // Calculated isometric coordinate offsets
                      const baseX = 120 + (idx % 3) * 110;
                      const baseY = 90 + Math.floor(idx / 3) * 60;
                      const width = 80;
                      const height = 45;

                      return (
                        <g
                          key={comp.id}
                          onClick={() => setSelectedComponentId(comp.id)}
                          className="cursor-pointer transition-all duration-300"
                        >
                          {/* Isometric Prisms / Sketchup Nodes */}
                          <motion.polygon
                            points={`
                              ${baseX},${baseY} 
                              ${baseX + width / 2},${baseY - 15} 
                              ${baseX + width},${baseY} 
                              ${baseX + width / 2},${baseY + 15}
                            `}
                            fill={
                              isSelected
                                ? "url(#amberGlow)"
                                : activeMode === "thermal_profile"
                                ? "url(#cyanThermal)"
                                : "#0e2330"
                            }
                            stroke={isSelected ? "#22d3ee" : "#2a5468"}
                            strokeWidth={isSelected ? "2.5" : "1.5"}
                            whileHover={{ scale: 1.05 }}
                          />

                          <polygon
                            points={`
                              ${baseX},${baseY} 
                              ${baseX + width / 2},${baseY + 15} 
                              ${baseX + width / 2},${baseY + 15 + height} 
                              ${baseX},${baseY + height}
                            `}
                            fill={isSelected ? "#0891b2" : "#0a1924"}
                            fillOpacity="0.9"
                            stroke={isSelected ? "#22d3ee" : "#1b3b4a"}
                            strokeWidth="1"
                          />

                          <polygon
                            points={`
                              ${baseX + width / 2},${baseY + 15} 
                              ${baseX + width},${baseY} 
                              ${baseX + width},${baseY + height} 
                              ${baseX + width / 2},${baseY + 15 + height}
                            `}
                            fill={isSelected ? "#0e7490" : "#07131b"}
                            fillOpacity="0.9"
                            stroke={isSelected ? "#22d3ee" : "#1b3b4a"}
                            strokeWidth="1"
                          />

                          {/* Component Label Text */}
                          <text
                            x={baseX + width / 2}
                            y={baseY + 32}
                            textAnchor="middle"
                            fill={isSelected ? "#ffffff" : "#94b3c4"}
                            fontSize="9"
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            {comp.name.length > 14 ? comp.name.substring(0, 12) + ".." : comp.name}
                          </text>

                          {/* Pulsing Highlight Dot if selected */}
                          {isSelected && (
                            <circle
                              cx={baseX + width / 2}
                              cy={baseY}
                              r="4"
                              fill="#22d3ee"
                              className="animate-ping"
                            />
                          )}
                        </g>
                      );
                    })}

                    {/* Particle Stream Flow Line when flow is active */}
                    {isPlayingFlow && (
                      <motion.path
                        d="M 90,140 Q 250,80 410,140 T 250,210 Z"
                        fill="none"
                        stroke="url(#cyanStream)"
                        strokeWidth="3"
                        strokeDasharray="6 6"
                        animate={{ strokeDashoffset: [0, -48] }}
                        transition={{ repeat: Infinity, duration: 2 / flowSpeed, ease: "linear" }}
                      />
                    )}

                    {/* Central Target Focal Reticle */}
                    <circle
                      cx="250"
                      cy="140"
                      r="16"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="0.8"
                      strokeDasharray="3 3"
                      className="opacity-40"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Bottom Scrubber & Step Navigation */}
            <div className="relative z-10 bg-[#08151c]/90 backdrop-blur-md p-3 rounded-xl border border-[#183646] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-cyan-300 font-bold">
                  Stage {activeStepIndex + 1} of {explainerData?.steps?.length || 1}:{" "}
                  <span className="text-white">{currentStep?.title || "Mechanical State Initiation"}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeStepIndex === 0}
                    className="px-2.5 py-1 rounded bg-[#0c1a24] border border-[#1b3b4a] text-xs text-white hover:border-cyan-400 disabled:opacity-30"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() =>
                      setActiveStepIndex((prev) =>
                        Math.min((explainerData?.steps?.length || 1) - 1, prev + 1)
                      )
                    }
                    disabled={activeStepIndex >= (explainerData?.steps?.length || 1) - 1}
                    className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full bg-[#040b10] h-1.5 rounded-full overflow-hidden flex gap-1">
                {explainerData?.steps?.map((step, idx) => (
                  <div
                    key={step.stepNumber}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`h-full flex-1 cursor-pointer transition-all ${
                      idx === activeStepIndex
                        ? "bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
                        : idx < activeStepIndex
                        ? "bg-cyan-800"
                        : "bg-[#16303d]"
                    }`}
                  />
                ))}
              </div>

              {currentStep && (
                <p className="text-[11px] text-gray-300 leading-relaxed pt-1">
                  {currentStep.explanation}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Component Inspector & Parameter Tuning (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Component Card */}
          <div className="p-4 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#183646] pb-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <Crosshair className="w-3.5 h-3.5" />
                Component Inspector
              </span>
              {activeComponent && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                  {activeComponent.material || "Substrate"}
                </span>
              )}
            </div>

            {activeComponent ? (
              <div className="space-y-2 text-xs">
                <h4 className="text-base font-bold text-white">{activeComponent.name}</h4>
                <p className="text-gray-300 text-[11px] leading-relaxed">{activeComponent.function}</p>

                {activeComponent.technicalFormula && (
                  <div className="p-2.5 rounded-xl bg-[#08151c] border border-cyan-500/30 text-cyan-300 font-mono text-[10px] space-y-1">
                    <span className="text-[#648798] block text-[9px] uppercase font-sans font-bold">
                      Governing Formulation:
                    </span>
                    <code>{activeComponent.technicalFormula}</code>
                  </div>
                )}

                {activeComponent.tolerances && (
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#789cae] pt-1">
                    <span>Operating Tolerance:</span>
                    <span className="text-cyan-400 font-bold">{activeComponent.tolerances}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#789cae]">Click any component on the diagram to inspect properties.</p>
            )}
          </div>

          {/* Real-time Dynamic Parameter Modulation */}
          <div className="p-4 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#183646] pb-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" />
                Dynamic Variable Modulation
              </span>
            </div>

            <div className="space-y-3">
              {/* Flow Speed Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-300">Kinetic Flow Velocity</span>
                  <span className="font-mono text-cyan-300 font-bold">{flowSpeed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.1"
                  value={flowSpeed}
                  onChange={(e) => setFlowSpeed(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#08151c] rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Dynamic Extracted Parameters */}
              {explainerData?.parameters?.map((param) => {
                const curVal = activeParameterValues[param.name] ?? param.default;
                return (
                  <div key={param.name} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-300">{param.name}</span>
                      <span className="font-mono text-cyan-300 font-bold">
                        {curVal} {param.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={(param.max - param.min) / 20 || 1}
                      value={curVal}
                      onChange={(e) => handleParamChange(param.name, parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-[#08151c] rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Custom Concept Prompt */}
          <div className="p-3.5 rounded-2xl bg-[#0c1a24] border border-[#183646] space-y-2">
            <span className="text-[10px] font-mono text-[#789cae] uppercase">
              Render Custom Engineering Mechanism:
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customTopic.trim()) {
                    setSelectedTopic(customTopic.trim());
                    setCustomTopic("");
                  }
                }}
                placeholder="e.g. Scramjet inlet, LiDAR MEMS mirror..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-[#08151c] border border-[#1b3b4a] text-xs text-white placeholder:text-[#557585] focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={() => {
                  if (customTopic.trim()) {
                    setSelectedTopic(customTopic.trim());
                    setCustomTopic("");
                  }
                }}
                disabled={!customTopic.trim() || isLoading}
                className="p-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold disabled:opacity-40"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
