import React from "react";

export const AnimatedGeometricBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-ambient-gradient">
      {/* 2-Color Ambient Glowing Radial Gradients (Navy + Turquoise) */}
      <div
        className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full opacity-20 blur-[120px] animate-pulse"
        style={{
          background:
            "radial-gradient(circle, rgba(0,0,128,0.5) 0%, rgba(64,224,208,0.2) 50%, rgba(0,0,0,0) 80%)",
          animationDuration: "14s",
        }}
      />
      <div
        className="absolute top-[40%] -right-[15%] w-[65vw] h-[65vw] rounded-full opacity-15 blur-[140px] animate-pulse"
        style={{
          background:
            "radial-gradient(circle, rgba(64,224,208,0.4) 0%, rgba(0,0,128,0.2) 50%, rgba(0,0,0,0) 80%)",
          animationDuration: "18s",
        }}
      />
      <div
        className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full opacity-10 blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, rgba(0,0,128,0.4) 0%, rgba(64,224,208,0.1) 60%, rgba(0,0,0,0) 80%)",
        }}
      />

      {/* SVG Geometric Wireframe Contour Lines & Wave Curves */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="geomNavyTurquoise" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#000080" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#40E0D0" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="geomTurquoiseNavy" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#40E0D0" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#000080" stopOpacity="0.2" />
          </linearGradient>

          <pattern
            id="dotGridPattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="#40E0D0" opacity="0.1" />
          </pattern>
        </defs>

        {/* Subtle Background Dot Grid */}
        <rect width="100%" height="100%" fill="url(#dotGridPattern)" />

        {/* Large Concentric Topographic / Geometric Contour Lines (Right Center) */}
        <g transform="translate(850, 250)" className="animate-contour-pulse">
          {[...Array(14)].map((_, i) => {
            const size = (i + 1) * 48;
            return (
              <polygon
                key={i}
                points={`${size},0 ${size * 0.5},${size * 0.866} ${-size * 0.5},${size * 0.866} ${-size},0 ${-size * 0.5},${-size * 0.866} ${size * 0.5},${-size * 0.866}`}
                fill="none"
                stroke="url(#geomNavyTurquoise)"
                strokeWidth={i % 3 === 0 ? "1.5" : "0.75"}
                strokeDasharray={i % 2 === 0 ? "8 4" : "none"}
                opacity={0.8 - i * 0.05}
              />
            );
          })}
        </g>

        {/* Smooth Flowing Waves / Curved Lines (Top to Bottom) */}
        <path
          d="M -100,180 C 300,320 600,100 1100,280 C 1500,420 1800,200 2200,350"
          fill="none"
          stroke="url(#geomNavyTurquoise)"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <path
          d="M -100,220 C 320,360 620,140 1120,320 C 1520,460 1820,240 2220,390"
          fill="none"
          stroke="url(#geomNavyTurquoise)"
          strokeWidth="1"
          opacity="0.3"
        />
        <path
          d="M -100,260 C 340,400 640,180 1140,360 C 1540,500 1840,280 2240,430"
          fill="none"
          stroke="url(#geomTurquoiseNavy)"
          strokeWidth="0.75"
          strokeDasharray="6 6"
          opacity="0.2"
        />

        {/* Lower Sweeping Geometric Curves */}
        <path
          d="M -100,600 C 400,450 800,750 1300,580 C 1700,450 2000,650 2300,550"
          fill="none"
          stroke="url(#geomTurquoiseNavy)"
          strokeWidth="1.2"
          opacity="0.3"
        />
        <path
          d="M -100,640 C 420,490 820,790 1320,620 C 1720,490 2020,690 2320,590"
          fill="none"
          stroke="url(#geomNavyTurquoise)"
          strokeWidth="0.8"
          opacity="0.2"
        />

        {/* Decorative Wireframe Polygons & Accent Shapes */}
        <g opacity="0.3">
          <circle
            cx="180"
            cy="220"
            r="16"
            fill="none"
            stroke="#40E0D0"
            strokeWidth="1"
            strokeDasharray="4 2"
          />
          <line
            x1="160"
            y1="220"
            x2="200"
            y2="220"
            stroke="#000080"
            strokeWidth="0.75"
          />

          <rect
            x="120"
            y="580"
            width="24"
            height="24"
            fill="none"
            stroke="#40E0D0"
            strokeWidth="1"
            transform="rotate(25 132 592)"
          />

          <path
            d="M 920,120 L 940,150 L 900,150 Z"
            fill="none"
            stroke="#40E0D0"
            strokeWidth="1"
          />
        </g>
      </svg>
    </div>
  );
};
