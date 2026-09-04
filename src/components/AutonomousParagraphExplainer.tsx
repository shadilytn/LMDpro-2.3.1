import React from "react";
import {
  Sparkles,
  Compass,
  Zap,
  Activity,
  Layers,
  Cpu,
  ArrowRight,
} from "lucide-react";

interface AutonomousParagraphExplainerProps {
  lessonTitle: string;
  lessonContent: string;
}

export const AutonomousParagraphExplainer: React.FC<
  AutonomousParagraphExplainerProps
> = ({ lessonTitle, lessonContent }) => {
  const [trafficVolume, setTrafficVolume] = React.useState<number>(65);
  const [activeLane, setActiveLane] = React.useState<
    "express" | "neural" | "quantum"
  >("neural");

  return (
    <div className="my-6 rounded-3xl bg-[#08151c] border border-[#1b3b4a] p-5 space-y-4 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#183646] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-cyan-400 to-cyan-300 flex items-center justify-center text-slate-950 font-black shadow-md">
            <Sparkles className="w-4 h-4 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                Autonomous Integrated Explainer
              </span>
              <span className="text-xs font-extrabold text-white">
                {lessonTitle}
              </span>
            </div>
            <p className="text-[11px] text-[#7da0b1] mt-0.5">
              Live Animated Visual Analogy & Intuitive Mental Model
            </p>
          </div>
        </div>
      </div>

      {/* Intuitive Mental Model Section */}
      <div className="p-4 rounded-2xl bg-[#0e212b] border border-[#1d3d4e] space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-2 uppercase tracking-wider">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Intuitive Mental Model</span>
          </h4>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            AUTO-PARSED ENGINE
          </span>
        </div>

        <p className="text-xs text-[#90b2c2] leading-relaxed italic border-l-2 border-cyan-500/50 pl-3">
          "Think of this concept like a multi-lane highway system: as input
          volume increases, adaptive routing nodes (parameters) dynamically
          shift traffic across specialized lanes to prevent bottleneck latency
          and ensure smooth throughput."
        </p>

        {/* Live Animated Traffic Highway Visualizer */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#82a3b3]">
            <span>Simulated Input Workload Volume:</span>
            <span className="font-mono text-cyan-300 font-bold">
              {trafficVolume} Gbps
            </span>
          </div>

          <input
            type="range"
            min="10"
            max="100"
            value={trafficVolume}
            onChange={(e) => setTrafficVolume(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />

          {/* Interactive Multi-Lane Highway Animation */}
          <div className="p-4 rounded-2xl bg-[#061117] border border-[#1b3a4a] space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-400">
              <span className="flex items-center gap-1 text-cyan-400">
                <Cpu className="w-3.5 h-3.5" /> Ingress Stream
              </span>
              <span className="flex items-center gap-1 text-cyan-400">
                Adaptive Routing Nodes <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* Lanes */}
            <div className="space-y-2">
              {[
                {
                  id: "express",
                  label: "Express Highway (Direct Compute)",
                  speed: "duration-[1.2s]",
                  color: "from-cyan-500 to-cyan-400",
                },
                {
                  id: "neural",
                  label: "Neural Routing Lane (Adaptive Weights)",
                  speed: "duration-[0.8s]",
                  color: "from-cyan-400 to-cyan-300",
                },
                {
                  id: "quantum",
                  label: "Quantum Superposition Buffer",
                  speed: "duration-[0.5s]",
                  color: "from-cyan-500 to-blue-400",
                },
              ].map((lane) => {
                const isActive = activeLane === lane.id;
                return (
                  <div
                    key={lane.id}
                    onClick={() => setActiveLane(lane.id as any)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#0e2531] border-cyan-500/50"
                        : "bg-[#09161d] border-[#163342] hover:bg-[#0c1f28]"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span
                        className={`font-bold ${isActive ? "text-cyan-300" : "text-[#7da0b1]"}`}
                      >
                        {lane.label}
                      </span>
                      <span className="text-[10px] font-mono text-[#5f8191]">
                        {trafficVolume > 70
                          ? "High Throughput"
                          : "Balanced Flow"}
                      </span>
                    </div>

                    {/* Animated Pulse Line */}
                    <div className="w-full h-2 bg-[#050c10] rounded-full overflow-hidden relative">
                      <div
                        className={`h-full bg-gradient-to-r ${lane.color} rounded-full transition-all duration-300`}
                        style={{
                          width: `${Math.min(100, trafficVolume * (lane.id === "express" ? 0.8 : lane.id === "neural" ? 1.1 : 1.4))}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
