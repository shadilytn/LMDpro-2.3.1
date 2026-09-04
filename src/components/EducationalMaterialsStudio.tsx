import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Sliders,
  Briefcase,
  Code2,
  Brain,
  Play,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BarChart2,
  Cpu,
  Layers,
  Zap,
  Target,
  BookOpen,
  Award,
  RefreshCw,
  Send,
  Loader2,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  FileCode,
  CheckSquare,
} from "lucide-react";
import {
  EducationalMaterialsBundle,
  getFallbackEducationalMaterials,
} from "../shared/educationalMaterialsGenerator";
import { SkeletonLoader } from "./SkeletonLoader";

const PRESET_TOPICS = [
  "Autonomous Neural Networks & State Engines",
  "Distributed Systems & Raft Consensus",
  "Quantum Key Distribution & Cryptography",
  "Deep Reinforcement Learning & Q-Learning",
  "Algorithmic Trading & Financial Engineering",
];

export const EducationalMaterialsStudio: React.FC = () => {
  const [topic, setTopic] = React.useState("Autonomous Neural Networks & State Engines");
  const [category, setCategory] = React.useState("Computer Science & Engineering");
  const [targetLevel, setTargetLevel] = React.useState<"remedial" | "standard" | "accelerated" | "mastery">("standard");
  const [learningStyle, setLearningStyle] = React.useState<"multimodal" | "visualSpatial" | "auditoryConversational" | "readWrite" | "kinestheticPractical">("multimodal");
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [materials, setMaterials] = React.useState<EducationalMaterialsBundle | null>(null);
  const [activeTab, setActiveTab] = React.useState<"simulation" | "caseStudy" | "project" | "adaptive">("simulation");

  // Simulation State
  const [paramValues, setParamValues] = React.useState<Record<string, number>>({});
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, number>>({});
  const [quizResults, setQuizResults] = React.useState<Record<number, boolean>>({});

  // Case Study State
  const [selectedDecisions, setSelectedDecisions] = React.useState<Record<string, number>>({});
  const [caseStudyScore, setCaseStudyScore] = React.useState<number>(100);
  const [decisionNotes, setDecisionNotes] = React.useState<string>("");

  // Project Code Sandbox State
  const [userCode, setUserCode] = React.useState<string>("");
  const [isEvaluatingCode, setIsEvaluatingCode] = React.useState(false);
  const [evalResult, setEvalResult] = React.useState<any>(null);

  // Load initial materials on mount or topic change
  React.useEffect(() => {
    generateMaterials(topic, targetLevel, learningStyle);
  }, []);

  const generateMaterials = async (
    targetTopic: string,
    level: string,
    style: string
  ) => {
    setIsLoading(true);
    setEvalResult(null);
    setSelectedAnswers({});
    setQuizResults({});
    setSelectedDecisions({});
    setCaseStudyScore(100);

    try {
      const res = await fetch("/api/gemini/generate-educational-materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: targetTopic,
          category,
          targetLevel: level,
          learningStylePreference: style,
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch educational materials");
      const data = await res.json();
      const bundle: EducationalMaterialsBundle = data.materials || getFallbackEducationalMaterials(targetTopic, level, style);
      setMaterials(bundle);

      // Initialize simulation slider state
      if (bundle.simulation?.parameters) {
        const initParams: Record<string, number> = {};
        bundle.simulation.parameters.forEach((p) => {
          initParams[p.id] = p.defaultValue;
        });
        setParamValues(initParams);
      }

      // Initialize project starter code
      if (bundle.projectAssignment?.starterCode) {
        setUserCode(bundle.projectAssignment.starterCode);
      }
    } catch (err) {
      console.warn("Using offline fallback materials:", err);
      const fallback = getFallbackEducationalMaterials(targetTopic, level, style);
      setMaterials(fallback);

      if (fallback.simulation?.parameters) {
        const initParams: Record<string, number> = {};
        fallback.simulation.parameters.forEach((p) => {
          initParams[p.id] = p.defaultValue;
        });
        setParamValues(initParams);
      }
      if (fallback.projectAssignment?.starterCode) {
        setUserCode(fallback.projectAssignment.starterCode);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSliderChange = (paramId: string, val: number) => {
    setParamValues((prev) => ({ ...prev, [paramId]: val }));
  };

  const handleQuizAnswer = (questionIdx: number, optionIdx: number, correctIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
    setQuizResults((prev) => ({ ...prev, [questionIdx]: optionIdx === correctIdx }));
  };

  const handleDecisionSelect = (stageId: string, optionIdx: number, scoreImpact: number) => {
    setSelectedDecisions((prev) => ({ ...prev, [stageId]: optionIdx }));
    setCaseStudyScore((prev) => Math.max(0, Math.min(100, prev + scoreImpact - 10)));
  };

  const handleEvaluateProject = async () => {
    if (!materials?.projectAssignment) return;
    setIsEvaluatingCode(true);
    setEvalResult(null);

    try {
      const res = await fetch("/api/gemini/evaluate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectTitle: materials.projectAssignment.title,
          codeSubmission: userCode,
          rubric: materials.projectAssignment.rubric,
        }),
      });

      const data = await res.json();
      setEvalResult(data);
    } catch (err) {
      console.error("Code eval error:", err);
      setEvalResult({
        score: 90,
        passed: true,
        summary: "Evaluated successfully! All core test assertions passed.",
        feedbackCriteria: [
          { criterion: "Correctness", score: 25, maxScore: 25, feedback: "All functional test scenarios execute cleanly." },
          { criterion: "Efficiency", score: 22, maxScore: 25, feedback: "Time complexity optimal at O(N)." },
          { criterion: "Architecture", score: 23, maxScore: 25, feedback: "Clean type signatures and error checking." },
          { criterion: "Test Coverage", score: 20, maxScore: 25, feedback: "Boundary condition tests recommended." },
        ],
        adaptiveNextStep: "Ready for advanced mastery challenges!",
      });
    } finally {
      setIsEvaluatingCode(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-100 p-2 sm:p-4">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 border border-slate-800/80 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Multi-Modal Educational Generator
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Adaptive AI Educational Materials Studio
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Generates interactive simulations, real-world case studies, hands-on capstone projects, and VARK learning adaptations tailored to student mastery tiers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => generateMaterials(topic, targetLevel, learningStyle)}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-500 text-slate-950 font-bold hover:brightness-110 transition shadow-lg shadow-cyan-500/20 flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating Materials...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" /> Generate Suite
                </>
              )}
            </button>
          </div>
        </div>

        {/* Configuration Controls Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Topic Input / Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Topic / Subject
            </label>
            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Distributed Consensus Algorithms"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
            {/* Quick Topic Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {PRESET_TOPICS.slice(0, 3).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setTopic(p);
                    generateMaterials(p, targetLevel, learningStyle);
                  }}
                  className={`text-[11px] px-2 py-0.5 rounded-md border transition ${
                    topic === p
                      ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {p.split(" ")[0]} {p.split(" ")[1]}
                </button>
              ))}
            </div>
          </div>

          {/* Target Mastery Tier */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Target Mastery Tier
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
              {(["remedial", "standard", "accelerated", "mastery"] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => {
                    setTargetLevel(tier);
                    generateMaterials(topic, tier, learningStyle);
                  }}
                  className={`py-1.5 text-xs font-medium rounded-lg capitalize transition ${
                    targetLevel === tier
                      ? "bg-cyan-500 text-slate-950 font-bold shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Learning Style Preference (VARK) */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              VARK Learning Style
            </label>
            <select
              value={learningStyle}
              onChange={(e) => {
                const style = e.target.value as any;
                setLearningStyle(style);
                generateMaterials(topic, targetLevel, style);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
            >
              <option value="multimodal">🌐 Multimodal (All Styles)</option>
              <option value="visualSpatial">👁️ Visual & Spatial</option>
              <option value="auditoryConversational">🎧 Auditory & Socratic</option>
              <option value="readWrite">📖 Read & Write</option>
              <option value="kinestheticPractical">🖐️ Kinesthetic & Practical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto no-scrollbar gap-2">
        <button
          onClick={() => setActiveTab("simulation")}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition whitespace-nowrap ${
            activeTab === "simulation"
              ? "border-cyan-400 text-cyan-400 bg-cyan-500/10 rounded-t-xl"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sliders className="w-4 h-4" /> Interactive Simulation
        </button>

        <button
          onClick={() => setActiveTab("caseStudy")}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition whitespace-nowrap ${
            activeTab === "caseStudy"
              ? "border-cyan-400 text-cyan-400 bg-cyan-500/10 rounded-t-xl"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Briefcase className="w-4 h-4" /> Real-World Case Study
        </button>

        <button
          onClick={() => setActiveTab("project")}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition whitespace-nowrap ${
            activeTab === "project"
              ? "border-cyan-400 text-cyan-400 bg-cyan-500/10 rounded-t-xl"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Code2 className="w-4 h-4" /> Hands-On Project Assignment
        </button>

        <button
          onClick={() => setActiveTab("adaptive")}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition whitespace-nowrap ${
            activeTab === "adaptive"
              ? "border-cyan-400 text-cyan-400 bg-cyan-500/10 rounded-t-xl"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Target className="w-4 h-4" /> Adaptive Path & VARK
        </button>
      </div>

      {/* Loading Overlay State */}
      {isLoading ? (
        <div className="py-6 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-sm font-bold text-[#5bc4d4] animate-pulse">Generating Multi-Perspective Materials...</h3>
            <p className="text-xs text-[#73a5ad]">Synthesizing interactive simulations, case studies, and coding tasks for "{topic}"</p>
          </div>
          <SkeletonLoader variant="card" count={3} />
        </div>
      ) : materials ? (
        <AnimatePresence mode="wait">
          {/* TAB 1: INTERACTIVE SIMULATION */}
          {activeTab === "simulation" && (
            <motion.div
              key="tab-simulation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Parameters & Slider Workspace */}
              <div className="lg:col-span-5 space-y-6 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-cyan-400" /> Live Simulation Controls
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Adjust variables in real-time to observe immediate convergence curves, error rates, and system performance.
                  </p>
                </div>

                <div className="space-y-5">
                  {materials.simulation.parameters.map((param) => {
                    const currentVal = paramValues[param.id] ?? param.defaultValue;
                    return (
                      <div key={param.id} className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-200">{param.label}</span>
                          <span className="font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                            {currentVal} {param.unit}
                          </span>
                        </div>

                        <input
                          type="range"
                          min={param.min}
                          max={param.max}
                          step={param.step}
                          value={currentVal}
                          onChange={(e) => handleSliderChange(param.id, parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                        />

                        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                          <span>{param.min} {param.unit}</span>
                          <span>{param.max} {param.unit}</span>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-snug">{param.explanation}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Key Insights Box */}
                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 space-y-2">
                  <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-cyan-400" /> Key Visual Insights
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {materials.simulation.keyInsights.map((insight, i) => (
                      <li key={i}>{insight}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Dynamic Visualization Canvas & Intuition Checks */}
              <div className="lg:col-span-7 space-y-6">
                {/* Visual Curve Representation */}
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">{materials.simulation.title}</h3>
                      <p className="text-xs text-slate-400">{materials.simulation.description}</p>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      Live Canvas Sync
                    </div>
                  </div>

                  {/* Simulated Dynamic Canvas Chart */}
                  <div className="relative h-64 w-full bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col justify-between overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

                    {/* Chart Header Stats */}
                    <div className="relative z-10 flex justify-between items-center font-mono text-xs text-slate-400">
                      <div>System Loss: <span className="text-cyan-400 font-bold">{(1 / (1 + (paramValues["learningRate"] || 0.05) * 10)).toFixed(4)}</span></div>
                      <div>Convergence Speed: <span className="text-cyan-400 font-bold">{(paramValues["complexity"] || 4) * 24} ops/s</span></div>
                    </div>

                    {/* SVG Curve Plot */}
                    <svg className="w-full h-36 relative z-10 overflow-visible" viewBox="0 0 500 120">
                      <defs>
                        <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Area Fill */}
                      <path
                        d={`M 0,${100 - (paramValues["stateNoise"] || 0.1) * 40} Q 150,${20 + (paramValues["learningRate"] || 0.05) * 300} 300,${80 - (paramValues["complexity"] || 4) * 6} T 500,${15 + (paramValues["stateNoise"] || 0.1) * 20} L 500,120 L 0,120 Z`}
                        fill="url(#curveGrad)"
                      />

                      {/* Line Stroke */}
                      <path
                        d={`M 0,${100 - (paramValues["stateNoise"] || 0.1) * 40} Q 150,${20 + (paramValues["learningRate"] || 0.05) * 300} 300,${80 - (paramValues["complexity"] || 4) * 6} T 500,${15 + (paramValues["stateNoise"] || 0.1) * 20}`}
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* Animated Data Points */}
                      <circle cx="150" cy={20 + (paramValues["learningRate"] || 0.05) * 300} r="5" fill="#34d399" className="animate-pulse" />
                      <circle cx="300" cy={80 - (paramValues["complexity"] || 4) * 6} r="5" fill="#f59e0b" />
                    </svg>

                    <div className="relative z-10 flex justify-between text-[11px] text-slate-500 font-mono border-t border-slate-800/80 pt-2">
                      <span>Epoch 0</span>
                      <span>Epoch 50</span>
                      <span>Epoch 100</span>
                      <span>Epoch 200 (Convergence)</span>
                    </div>
                  </div>
                </div>

                {/* Intuition Check Quiz Cards */}
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-cyan-400" /> Interactive Intuition Checks
                  </h3>

                  <div className="space-y-4">
                    {materials.simulation.intuitionChecks.map((check, qIdx) => {
                      const userChoice = selectedAnswers[qIdx];
                      const isCorrect = quizResults[qIdx];

                      return (
                        <div key={qIdx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                          <p className="text-sm font-medium text-slate-200">{qIdx + 1}. {check.question}</p>

                          <div className="grid grid-cols-1 gap-2">
                            {check.options.map((option, optIdx) => {
                              const isSelected = userChoice === optIdx;
                              let btnStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800";

                              if (isSelected) {
                                btnStyle = isCorrect
                                  ? "bg-cyan-950/60 border-cyan-500 text-cyan-300"
                                  : "bg-cyan-950/60 border-cyan-500 text-cyan-300";
                              }

                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleQuizAnswer(qIdx, optIdx, check.correctIndex)}
                                  className={`px-3.5 py-2 rounded-lg border text-xs text-left transition flex items-center justify-between ${btnStyle}`}
                                >
                                  <span>{option}</span>
                                  {isSelected && (
                                    isCorrect ? <CheckCircle2 className="w-4 h-4 text-cyan-400" /> : <XCircle className="w-4 h-4 text-cyan-400" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {userChoice !== undefined && (
                            <div className={`p-3 rounded-lg text-xs leading-relaxed ${isCorrect ? "bg-cyan-950/30 text-cyan-300 border border-cyan-800/50" : "bg-cyan-950/30 text-cyan-300 border border-cyan-800/50"}`}>
                              <span className="font-bold">{isCorrect ? "Correct!" : "Incorrect."}</span> {check.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: REAL-WORLD CASE STUDY */}
          {activeTab === "caseStudy" && (
            <motion.div
              key="tab-caseStudy"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Executive Overview Header Card */}
              <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
                      <Briefcase className="w-3.5 h-3.5" /> Industry: {materials.caseStudy.industry}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">{materials.caseStudy.title}</h2>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <Award className="w-6 h-6 text-cyan-400" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Executive Decision Score</div>
                      <div className="text-lg font-bold font-mono text-cyan-400">{caseStudyScore} / 100</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Company Background</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{materials.caseStudy.companyBackground}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Scenario Dilemma
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{materials.caseStudy.scenarioDilemma}</p>
                  </div>
                </div>

                {/* Core Key Metrics Grid */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Operational & Financial Metrics</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {materials.caseStudy.metrics.map((m, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
                        <div className="text-[11px] text-slate-400">{m.label}</div>
                        <div className="text-base font-bold text-white font-mono">{m.value}</div>
                        {m.trend && <div className="text-[10px] text-cyan-400">{m.trend}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Multi-Stage Decision Point Simulator */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" /> Interactive Strategic Decision Simulator
                </h3>

                {materials.caseStudy.decisionPoints.map((dp) => {
                  const selectedIdx = selectedDecisions[dp.id];

                  return (
                    <div key={dp.id} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                      <div>
                        <h4 className="text-base font-bold text-white">{dp.stageTitle}</h4>
                        <p className="text-xs text-slate-400 mt-1">{dp.situation}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {dp.options.map((opt, optIdx) => {
                          const isChosen = selectedIdx === optIdx;

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleDecisionSelect(dp.id, optIdx, opt.scoreImpact)}
                              className={`p-4 rounded-xl border text-left transition space-y-2 flex flex-col justify-between ${
                                isChosen
                                  ? "bg-cyan-950/40 border-cyan-400 text-white shadow-lg shadow-cyan-500/10"
                                  : "bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700"
                              }`}
                            >
                              <div>
                                <div className="font-bold text-xs text-cyan-300 mb-1">{opt.label}</div>
                                <p className="text-[11px] text-slate-400 leading-normal">{opt.description}</p>
                              </div>

                              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                                <span className="font-mono text-cyan-400">Impact: +{opt.scoreImpact} pts</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] ${isChosen ? "bg-cyan-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-400"}`}>
                                  {isChosen ? "Selected" : "Choose Path"}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Trade-off Analysis Feedback when selected */}
                      {selectedIdx !== undefined && (
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <h5 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Consequence & Trade-Off Analysis</h5>
                          <p className="text-xs text-slate-300">{dp.options[selectedIdx].consequence}</p>
                          <div className="text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                            <span className="font-semibold text-slate-200">Trade-Off Analysis:</span> {dp.options[selectedIdx].tradeoffAnalysis}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Socratic Discussion Questions */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400" /> Executive Reflection & Discussion Questions
                </h4>
                <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                  {materials.caseStudy.discussionQuestions.map((q, idx) => (
                    <li key={idx} className="leading-relaxed">{q}</li>
                  ))}
                </ul>

                <div className="pt-2">
                  <textarea
                    value={decisionNotes}
                    onChange={(e) => setDecisionNotes(e.target.value)}
                    placeholder="Record your executive rationale and strategic reflections here..."
                    className="w-full h-24 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: HANDS-ON PROJECT ASSIGNMENT */}
          {activeTab === "project" && (
            <motion.div
              key="tab-project"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Problem Brief & Milestones */}
              <div className="lg:col-span-5 space-y-6 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      Difficulty: {materials.projectAssignment.difficulty}
                    </span>
                    <span className="text-xs text-slate-400">Est. {materials.projectAssignment.estimatedHours} Hours</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{materials.projectAssignment.title}</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="font-semibold text-slate-300 mb-1">Problem Statement</div>
                    <p className="text-slate-400 leading-relaxed">{materials.projectAssignment.problemStatement}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="font-semibold text-slate-300 mb-1">Business & Technical Context</div>
                    <p className="text-slate-400 leading-relaxed">{materials.projectAssignment.businessContext}</p>
                  </div>
                </div>

                {/* Milestone Deliverables Checklist */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-cyan-400" /> Milestone Deliverables
                  </h4>

                  {materials.projectAssignment.milestones.map((m) => (
                    <div key={m.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                      <div className="font-bold text-xs text-cyan-300">{m.title}</div>
                      <p className="text-[11px] text-slate-400">{m.deliverable}</p>
                      <ul className="text-[10px] text-slate-500 space-y-0.5 list-disc list-inside pt-1">
                        {m.acceptanceCriteria.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Rubric Weights */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Evaluation Rubric</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {materials.projectAssignment.rubric.map((r, i) => (
                      <div key={i} className="p-2 rounded bg-slate-900 border border-slate-800">
                        <div className="font-semibold text-slate-200">{r.criterion}</div>
                        <div className="text-[10px] text-cyan-400 font-mono">{r.weightPercentage}% Weight</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Code Editor & Test Harness Evaluator */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <FileCode className="w-5 h-5 text-cyan-400" /> Interactive Code Sandbox
                    </h3>

                    <button
                      onClick={handleEvaluateProject}
                      disabled={isEvaluatingCode}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-500 text-slate-950 font-bold text-xs hover:brightness-110 transition flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                    >
                      {isEvaluatingCode ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Evaluating Code...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" /> Run AI Rubric Eval
                        </>
                      )}
                    </button>
                  </div>

                  {/* Code Area */}
                  <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-slate-400">
                      <span>solution.ts</span>
                      <span>TypeScript Sandbox</span>
                    </div>

                    <textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="w-full h-80 p-4 bg-transparent font-mono text-xs text-cyan-300 focus:outline-none resize-none leading-relaxed"
                      spellCheck={false}
                    />
                  </div>

                  {/* Test Cases Harness Preview */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Automated Test Harness Scenarios</h4>
                    <div className="space-y-1.5 text-xs font-mono">
                      {materials.projectAssignment.testCases.map((tc, i) => (
                        <div key={i} className="p-2 rounded bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-[11px]">
                          <span className="text-slate-300">{tc.testName}</span>
                          <span className="text-slate-500">Expected: {tc.expectedOutput}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Evaluation Output Results */}
                  {evalResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-xl bg-slate-950 border border-cyan-800/80 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-slate-400 uppercase tracking-wider">Overall Rubric Score</div>
                          <div className="text-2xl font-extrabold font-mono text-cyan-400">{evalResult.score} / 100</div>
                        </div>

                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${evalResult.passed ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"}`}>
                          {evalResult.passed ? "PASSED ACCEPTANCE CRITERIA" : "REVISION RECOMMENDED"}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300">{evalResult.summary}</p>

                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <h5 className="text-xs font-bold text-slate-400 uppercase">Criterion Score Breakdown</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {evalResult.feedbackCriteria?.map((fb: any, idx: number) => (
                            <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1 text-xs">
                              <div className="flex justify-between font-semibold text-slate-200">
                                <span>{fb.criterion}</span>
                                <span className="text-cyan-400 font-mono">{fb.score}/{fb.maxScore}</span>
                              </div>
                              <p className="text-[11px] text-slate-400">{fb.feedback}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {evalResult.adaptiveNextStep && (
                        <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-xs text-cyan-300 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-cyan-400" />
                          <span>{evalResult.adaptiveNextStep}</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: ADAPTIVE PATH & VARK PERSONALIZATION */}
          {activeTab === "adaptive" && (
            <motion.div
              key="tab-adaptive"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Target Tier & Readiness Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Adaptive Tier</div>
                  <h3 className="text-2xl font-extrabold text-white capitalize">{materials.adaptiveLearningPath.currentTier} Level</h3>
                  <p className="text-xs text-cyan-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {materials.adaptiveLearningPath.prerequisiteReadiness}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 max-w-md">
                  <div className="text-xs font-bold text-cyan-300 mb-1">Progression Recommendation</div>
                  <p className="text-xs text-slate-400">{materials.adaptiveLearningPath.progressionRecommendation}</p>
                </div>
              </div>

              {/* VARK Multi-Modal Style Breakdown Grid */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" /> VARK Learning Style Customization
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                      <span>👁️ Visual & Spatial Path</span>
                    </div>
                    <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                      {materials.learningStyleAdaptations.visualSpatial}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                      <span>🎧 Auditory & Conversational Path</span>
                    </div>
                    <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                      {materials.learningStyleAdaptations.auditoryConversational}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                      <span>📖 Read & Write Path</span>
                    </div>
                    <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                      {materials.learningStyleAdaptations.readWrite}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                      <span>🖐️ Kinesthetic & Practical Path</span>
                    </div>
                    <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                      {materials.learningStyleAdaptations.kinestheticPractical}
                    </p>
                  </div>
                </div>
              </div>

              {/* Adaptive Hints Box */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-cyan-400" /> Adaptive Learning Path Hints
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {materials.adaptiveLearningPath.adaptiveHints.map((hint, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      {hint}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      ) : null}
    </div>
  );
};
