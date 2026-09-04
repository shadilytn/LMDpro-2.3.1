import React from "react";
import {
  Presentation,
  Code2,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Radio,
  Lock,
  Unlock,
  Maximize2,
  MousePointer,
  FileCode,
  CheckCircle2,
  Play,
  RotateCcw,
  MessageSquare,
  Share2,
} from "lucide-react";
import { UserProfile } from "../shared/types";
import { toastService } from "../services/toastService";

interface SynchronizedContentViewerProps {
  roomId: string;
  roomTitle: string;
  courseCode: string;
  topic: string;
  user?: UserProfile;
}

interface SlideContent {
  id: number;
  title: string;
  subtitle: string;
  content: string[];
  codeSnippet?: string;
  diagramSvg?: React.ReactNode;
  keyTakeaway: string;
}

const SAMPLE_SLIDES: Record<string, SlideContent[]> = {
  default: [
    {
      id: 1,
      title: "Raft Consensus Protocol & Log Replication",
      subtitle: "State Machine Safety & Leader Election Mechanics",
      content: [
        "Raft decomposes consensus into Leader Election, Log Replication, and Safety Invariants.",
        "Only nodes with up-to-date logs can be elected as Leader (Election Restriction).",
        "A leader never overwrites its own log entries; it only appends new client entries.",
        "Leader logs are authoritative: followers replicate entries in strict sequential index order.",
      ],
      codeSnippet: `// Raft AppendEntries RPC Definition
type AppendEntriesArgs struct {
    Term         int        // Leader's current term
    LeaderId     string     // So follower can redirect clients
    PrevLogIndex int        // Index of log entry immediately preceding new ones
    PrevLogTerm  int        // Term of PrevLogIndex entry
    Entries      []LogEntry // Log entries to store (empty for heartbeat)
    LeaderCommit int        // Leader's commitIndex
}`,
      keyTakeaway:
        "Key Safety Guarantee: Leaders never commit log entries from previous terms by counting replicas; they only commit current term entries.",
    },
    {
      id: 2,
      title: "Cellular Sheaf Consensus & Sheaf-ADMM",
      subtitle: "Topological Agreement Across Decentralized Private Stalks",
      content: [
        "Assigns private state vector space F(v) = R^d to each agent vertex.",
        "Assigns agreement space F(e) to communication edges with restriction maps F_{v -> e}.",
        "The Coboundary Operator δ(x) evaluates spatial disagreement along channels.",
        "Sheaf-ADMM unrolls primal state optimization, edge consensus, and dual accumulator updates.",
      ],
      codeSnippet: `# Unrolled Sheaf-ADMM Primal Update Step
def primal_x_update(x_prev, z_e, u_e, rho, restriction_map):
    # Solves argmin f_i(x_i) + (rho/2) sum || F_{i->e} x_i - z_e + u_e ||^2
    F_T = restriction_map.T
    H = rho * (F_T @ restriction_map)
    grad = F_T @ (restriction_map @ x_prev - z_e + u_e)
    x_new = np.linalg.solve(H + 1e-4 * np.eye(H.shape[0]), H @ x_prev - grad)
    return x_new`,
      keyTakeaway:
        "Global consensus is achieved when the 0-cochain x lies in the kernel of the Coboundary Operator, forming a Global Section.",
    },
    {
      id: 3,
      title: "Singular Value Decomposition (SVD) in Machine Learning",
      subtitle: "Dimensionality Reduction, Low-Rank Approximations, and Spectral Graph Theory",
      content: [
        "Factorizes any m x n matrix A into U (m x m), Σ (m x n), and V^T (n x n).",
        "Singular values σ_i are the square roots of non-zero eigenvalues of A^T A.",
        "Eckart-Young-Mirsky Theorem: Truncated SVD provides the optimal rank-k approximation under Frobenius norm.",
        "Applied in latent semantic analysis, collaborative filtering, and PCA transformation.",
      ],
      codeSnippet: `import numpy as np

def compute_low_rank_svd(A: np.ndarray, k: int):
    # Compute full SVD
    U, S, Vt = np.linalg.svd(A, full_matrices=False)
    # Truncate to top k components
    U_k = U[:, :k]
    S_k = np.diag(S[:k])
    Vt_k = Vt[:k, :]
    # Reconstruct optimal low-rank matrix
    A_k = U_k @ S_k @ Vt_k
    return A_k, S[:k]`,
      keyTakeaway:
        "Energy Retention Formula: Sum of top k singular values squared divided by total Frobenius norm squared.",
    },
  ],
};

export const SynchronizedContentViewer: React.FC<SynchronizedContentViewerProps> = ({
  roomId,
  roomTitle,
  courseCode,
  topic,
  user,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const [isPresenterMode, setIsPresenterMode] = React.useState(false);
  const [presenterName, setPresenterName] = React.useState("Elena Rostova (Lead)");
  const [laserPosition, setLaserPosition] = React.useState<{ x: number; y: number } | null>({ x: 45, y: 38 });
  const [showCodeRunner, setShowCodeRunner] = React.useState(false);
  const [codeOutput, setCodeOutput] = React.useState<string | null>(null);
  const [isRunningCode, setIsRunningCode] = React.useState(false);
  const [activeReaction, setActiveReaction] = React.useState<string | null>(null);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const slides = SAMPLE_SLIDES.default;
  const activeSlide = slides[currentSlideIndex] || slides[0];

  // Handle laser pointer tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPresenterMode || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLaserPosition({ x, y });
  };

  // Switch slides
  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
      setCodeOutput(null);
      if (isPresenterMode) {
        toastService.info("Slide Broadcast", `Broadcasting slide ${currentSlideIndex} to all room participants.`);
      }
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex + 1 < slides.length) {
      setCurrentSlideIndex((prev) => prev + 1);
      setCodeOutput(null);
      if (isPresenterMode) {
        toastService.info("Slide Broadcast", `Broadcasting slide ${currentSlideIndex + 2} to all room participants.`);
      }
    }
  };

  // Run sandboxed code simulator
  const handleRunCode = () => {
    setIsRunningCode(true);
    setTimeout(() => {
      setIsRunningCode(false);
      if (currentSlideIndex === 0) {
        setCodeOutput(
          `[Raft Test Node Cluster initialized: 5 replicas]
Node 1 (Leader, Term 3) sending AppendEntries to Followers...
Replication Quorum achieved: 4/5 ACKs received.
Committed Index: 142 -> State machine updated safely.`
        );
      } else if (currentSlideIndex === 1) {
        setCodeOutput(
          `[Sheaf-ADMM Optimizer Convergence Test]
Iteration 1: Coboundary error ||δ(x)|| = 0.841
Iteration 4: Coboundary error ||δ(x)|| = 0.092
Iteration 8: Coboundary error ||δ(x)|| = 0.00001 (Global Section Reached).`
        );
      } else {
        setCodeOutput(
          `[SVD Low-Rank Approximation Engine]
Matrix shape: (1000, 500) | Full Frobenius Norm: 482.1
Top k=10 Singular Values: [142.4, 98.2, 64.1, 41.0, 28.3...]
Variance explained with k=10: 89.4%`
        );
      }
    }, 800);
  };

  const handleSendReaction = (emoji: string) => {
    setActiveReaction(emoji);
    toastService.success("Reaction Shared", `Shared ${emoji} with study peers.`);
    setTimeout(() => setActiveReaction(null), 2500);
  };

  return (
    <div
      id="synchronized-content-viewer"
      className="space-y-4 font-sans select-none"
    >
      {/* Top Sync Status Banner */}
      <div className="p-3.5 rounded-2xl bg-[#091822] border border-[#1a384a] flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white">
                Synchronized Lecture Viewer
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Live Sync Lock
              </span>
            </div>
            <p className="text-[11px] text-[#789cae] mt-0.5">
              {isPresenterMode
                ? "You are the Active Presenter. Page navigation & laser pointer are broadcasting in real-time."
                : `Synchronized with ${presenterName}. Following in lock-step.`}
            </p>
          </div>
        </div>

        {/* Presenter Toggle & Reactions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-[#061117] p-1 rounded-xl border border-[#142a38]">
            <button
              onClick={() => handleSendReaction("💡")}
              className="p-1.5 rounded-lg hover:bg-white/10 text-sm transition-all"
              title="Brilliant insight!"
            >
              💡
            </button>
            <button
              onClick={() => handleSendReaction("🔥")}
              className="p-1.5 rounded-lg hover:bg-white/10 text-sm transition-all"
              title="Mind blown!"
            >
              🔥
            </button>
            <button
              onClick={() => handleSendReaction("❓")}
              className="p-1.5 rounded-lg hover:bg-white/10 text-sm transition-all"
              title="Need clarification"
            >
              ❓
            </button>
            <button
              onClick={() => handleSendReaction("👏")}
              className="p-1.5 rounded-lg hover:bg-white/10 text-sm transition-all"
              title="Great explanation!"
            >
              👏
            </button>
          </div>

          <button
            onClick={() => {
              setIsPresenterMode(!isPresenterMode);
              if (!isPresenterMode) {
                toastService.success("Presenter Role Claimed", "You now control the presentation stream.");
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isPresenterMode
                ? "bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20"
                : "bg-[#122e3d] text-cyan-300 border border-cyan-500/30 hover:bg-[#183a4c]"
            }`}
          >
            {isPresenterMode ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{isPresenterMode ? "Release Presenter" : "Take Presenter"}</span>
          </button>
        </div>
      </div>

      {/* Main Slide Presentation Stage */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative bg-gradient-to-br from-[#0a1c27] via-[#07131a] to-[#040b10] border border-[#1b3a4a] rounded-3xl p-6 md:p-8 min-h-[420px] shadow-2xl overflow-hidden flex flex-col justify-between"
      >
        {/* Laser Pointer Overlay */}
        {laserPosition && (
          <div
            className="absolute pointer-events-none transition-all duration-75 z-30"
            style={{
              left: `${laserPosition.x}%`,
              top: `${laserPosition.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-500/80 shadow-[0_0_12px_#f43f5e] ring-2 ring-white/60 animate-pulse flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white" />
            </div>
            <span className="ml-4 px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-[9px] font-mono text-cyan-200 whitespace-nowrap">
              {isPresenterMode ? "Your Pointer" : "Presenter Laser"}
            </span>
          </div>
        )}

        {/* Floating Reaction Animation */}
        {activeReaction && (
          <div className="absolute top-6 right-8 text-4xl animate-bounce z-40">
            {activeReaction}
          </div>
        )}

        {/* Slide Header */}
        <div className="space-y-1.5 border-b border-[#183646] pb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
              {courseCode} • Slide {activeSlide.id} of {slides.length}
            </span>
            <span className="text-[11px] text-[#7195a8]">
              Topic: {topic}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
            {activeSlide.title}
          </h3>
          <p className="text-xs text-cyan-400 font-medium">{activeSlide.subtitle}</p>
        </div>

        {/* Slide Body */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
          {/* Key Bullet Points */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#8db6c9] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Core Mechanism & Theorems</span>
            </h4>
            <div className="space-y-2.5">
              {activeSlide.content.map((point, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#091822]/80 border border-[#1a384a] text-xs text-gray-200 leading-relaxed flex items-start gap-2.5 hover:border-cyan-500/30 transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Code / Formula Sandbox */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#8db6c9] uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Executable Implementation</span>
              </h4>
              <button
                onClick={handleRunCode}
                disabled={isRunningCode}
                className="px-2.5 py-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-md transition-all active:scale-95"
              >
                {isRunningCode ? (
                  <RotateCcw className="w-3 h-3 animate-spin" />
                ) : (
                  <Play className="w-3 h-3" />
                )}
                <span>{isRunningCode ? "Running..." : "Test Execute"}</span>
              </button>
            </div>

            <div className="rounded-2xl bg-[#040b10] border border-[#142a38] p-4 text-[11px] font-mono text-cyan-300 overflow-x-auto shadow-inner">
              <pre className="leading-relaxed whitespace-pre-wrap">{activeSlide.codeSnippet}</pre>
            </div>

            {/* Sandbox Execution Console Output */}
            {codeOutput && (
              <div className="p-3 rounded-2xl bg-[#03090e] border border-cyan-500/40 text-[11px] font-mono text-cyan-300 space-y-1 animate-in fade-in duration-200">
                <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-bold uppercase">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Execution Output:</span>
                </div>
                <pre className="text-[10px] text-gray-300 leading-snug whitespace-pre-wrap">
                  {codeOutput}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Slide Footer with Key Takeaway & Navigation */}
        <div className="space-y-4 border-t border-[#183646] pt-4">
          <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-center gap-2.5 text-xs text-cyan-200">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Key Takeaway:</strong> {activeSlide.keyTakeaway}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevSlide}
              disabled={currentSlideIndex === 0}
              className="px-3.5 py-2 rounded-xl bg-[#091822] text-cyan-400 hover:text-cyan-300 border border-[#1a384a] text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Slide</span>
            </button>

            <div className="flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentSlideIndex(idx);
                    setCodeOutput(null);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentSlideIndex
                      ? "w-6 bg-cyan-400 shadow-md shadow-cyan-500/50"
                      : "bg-[#183646] hover:bg-[#25526c]"
                  }`}
                  title={`Jump to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNextSlide}
              disabled={currentSlideIndex + 1 === slides.length}
              className="px-3.5 py-2 rounded-xl bg-[#091822] text-cyan-400 hover:text-cyan-300 border border-[#1a384a] text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all"
            >
              <span>Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
