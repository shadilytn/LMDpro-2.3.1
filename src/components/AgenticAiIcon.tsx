import React from "react";

interface AgenticAiIconProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export const AgenticAiIcon: React.FC<AgenticAiIconProps> = ({
  className = "w-5 h-5",
  size = 20,
  animated = true,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
    >
      {/* Outer Glow Aura */}
      <div
        className={`absolute inset-0 rounded-full bg-cyan-400/30 blur-md ${animated ? "animate-pulse" : ""}`}
      />

      {/* Core SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
      >
        {/* Outer Orbit Ring */}
        <circle
          cx="16"
          cy="16"
          r="13"
          stroke="url(#agentic-ring-grad)"
          strokeWidth="1.5"
          strokeDasharray="4 2"
          className={animated ? "animate-[spin_10s_linear_infinite]" : ""}
        />

        {/* Inner Tri-Node Diamond Network */}
        <path
          d="M16 6L24 16L16 26L8 16L16 6Z"
          stroke="url(#agentic-core-grad)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Neural Synapse Cross Paths */}
        <path
          d="M16 6V26"
          stroke="rgba(34,211,238,0.5)"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <path
          d="M8 16H24"
          stroke="rgba(34,211,238,0.5)"
          strokeWidth="1"
          strokeDasharray="2 2"
        />

        {/* Illuminated Nodes */}
        <circle
          cx="16"
          cy="6"
          r="2"
          fill="#22d3ee"
          className={animated ? "animate-ping" : ""}
        />
        <circle cx="24" cy="16" r="2" fill="#22d3ee" />
        <circle cx="16" cy="26" r="2" fill="#22d3ee" />
        <circle cx="8" cy="16" r="2" fill="#22d3ee" />

        {/* Glowing Center Core Nucleus */}
        <circle cx="16" cy="16" r="3.5" fill="url(#agentic-nucleus)" />
        <circle cx="16" cy="16" r="1.5" fill="#ffffff" />

        <defs>
          <linearGradient
            id="agentic-ring-grad"
            x1="3"
            y1="3"
            x2="29"
            y2="29"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#22d3ee" />
            <stop offset="0.5" stopColor="#14b8a6" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>

          <linearGradient
            id="agentic-core-grad"
            x1="8"
            y1="6"
            x2="24"
            y2="26"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#38bdf8" />
            <stop offset="1" stopColor="#2dd4bf" />
          </linearGradient>

          <radialGradient
            id="agentic-nucleus"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(16 16) scale(3.5)"
          >
            <stop stopColor="#ffffff" />
            <stop offset="0.6" stopColor="#22d3ee" />
            <stop offset="1" stopColor="#0f766e" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};
