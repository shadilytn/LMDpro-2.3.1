import React from "react";
import { db } from "../services/firebase";
import { doc as firestoreDoc, onSnapshot, setDoc } from "firebase/firestore";
import { UserProfile } from "../shared/types";
import {
  Sparkles,
  Users,
  Trash2,
  Download,
  Check,
  RefreshCw,
  Palette,
  Sliders,
  PenTool,
  Eraser,
  HelpCircle,
  Undo2,
  Music,
  Play,
  Pause,
} from "lucide-react";

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  width: number;
}

interface CollaborativeWhiteboardProps {
  roomId: string;
  roomTitle: string;
  courseCode: string;
  topic: string;
  user?: UserProfile;
}

export const CollaborativeWhiteboard: React.FC<CollaborativeWhiteboardProps> = ({
  roomId,
  roomTitle,
  courseCode,
  topic,
  user,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = React.useState<string>("#22d3ee"); // Default Neon Cyan
  const [lineWidth, setLineWidth] = React.useState<number>(3);
  const [tool, setTool] = React.useState<"pen" | "eraser">("pen");
  const [strokes, setStrokes] = React.useState<Stroke[]>([]);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [activePeers, setActivePeers] = React.useState<number>(2);
  const [exportSaved, setExportSaved] = React.useState(false);
  const [lastSyncedTime, setLastSyncedTime] = React.useState<string>("Just now");
  const [isMusicPlaying, setIsMusicPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const colors = [
    { name: "Cyan", value: "#22d3ee" },
    { name: "Emerald", value: "#34d399" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Pink", value: "#f43f5e" },
    { name: "Indigo", value: "#6366f1" },
    { name: "White", value: "#ffffff" },
  ];

  // Initialize and load canvas dimensions and database subscription
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Adjust canvas resolution for high-DPI screens
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(2, 2);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }

    // Load initial drawing from Firestore and subscribe to real-time updates
    let unsubscribeFirestore: (() => void) | null = null;
    try {
      const whiteboardRef = firestoreDoc(
        db,
        "study_rooms",
        roomId,
        "whiteboard",
        "canvas_data"
      );

      unsubscribeFirestore = onSnapshot(whiteboardRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.strokes && Array.isArray(data.strokes)) {
            setStrokes(data.strokes);
            setLastSyncedTime(
              new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            );
          }
        }
      });
    } catch (e) {
      console.warn("[Whiteboard] Firestore snapshot subscription failed:", e);
    }

    // Active peers simulation
    setActivePeers(Math.floor(Math.random() * 2) + 2);

    return () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, [roomId]);

  // Redraw canvas whenever strokes change
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas before redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokes.forEach((stroke) => {
      if (stroke.points.length < 1) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      
      const firstPoint = stroke.points[0];
      ctx.moveTo(firstPoint.x, firstPoint.y);

      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });
  }, [strokes]);

  // Get canvas cursor coordinate relative to scaling
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleStartDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coord = getCoordinates(e);
    if (!coord) return;

    setIsDrawing(true);
    const newStroke: Stroke = {
      points: [coord],
      color: tool === "eraser" ? "#061117" : color,
      width: tool === "eraser" ? lineWidth * 4 : lineWidth,
    };

    setStrokes((prev) => [...prev, newStroke]);
  };

  const handleDrawingMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coord = getCoordinates(e);
    if (!coord) return;

    setStrokes((prev) => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      const activeStroke = { ...updated[updated.length - 1] };
      activeStroke.points = [...activeStroke.points, coord];
      updated[updated.length - 1] = activeStroke;
      return updated;
    });
  };

  const handleEndDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    syncWithDatabase(strokes);
  };

  const syncWithDatabase = async (currentStrokes: Stroke[]) => {
    setIsSyncing(true);
    try {
      const whiteboardRef = firestoreDoc(
        db,
        "study_rooms",
        roomId,
        "whiteboard",
        "canvas_data"
      );
      await setDoc(
        whiteboardRef,
        {
          strokes: currentStrokes,
          updatedBy: user?.name || "Scholar",
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      setLastSyncedTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    } catch (err) {
      console.warn("[Whiteboard] Database syncing error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUndo = () => {
    if (strokes.length === 0) return;
    const updated = strokes.slice(0, -1);
    setStrokes(updated);
    syncWithDatabase(updated);
  };

  const handleClear = () => {
    setStrokes([]);
    syncWithDatabase([]);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${courseCode}_Whiteboard_${roomId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportSaved(true);
      setTimeout(() => setExportSaved(false), 2000);
    } catch (err) {
      console.error("Failed to export whiteboard image:", err);
    }
  };

  // Generate a procedural study diagram to simulate collaborative brainstorming
  const handleProceduralSketch = (diagramType: "raft" | "neural" | "binary") => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width / 2;
    const height = canvas.height / 2;

    const generatedStrokes: Stroke[] = [...strokes];

    if (diagramType === "raft") {
      // Draw 3 Raft Nodes
      const nodes = [
        { x: width * 0.25, y: height * 0.5, label: "Leader (Node 1)" },
        { x: width * 0.75, y: height * 0.3, label: "Follower (Node 2)" },
        { x: width * 0.75, y: height * 0.7, label: "Follower (Node 3)" },
      ];

      // Draw nodes as circular outlines
      nodes.forEach((n, idx) => {
        const points: Point[] = [];
        const radius = 35;
        const colorVal = idx === 0 ? "#34d399" : "#22d3ee"; // Emerald for leader, Cyan for follower
        
        for (let angle = 0; angle <= Math.PI * 2 + 0.1; angle += 0.2) {
          points.push({
            x: n.x + Math.cos(angle) * radius,
            y: n.y + Math.sin(angle) * radius,
          });
        }
        generatedStrokes.push({ points, color: colorVal, width: 3 });
      });

      // Draw heartbeat arrows from Leader to Followers
      const leader = nodes[0];
      const followers = [nodes[1], nodes[2]];
      followers.forEach((f) => {
        const points: Point[] = [
          { x: leader.x + 35, y: leader.y },
          { x: (leader.x + f.x) / 2, y: (leader.y + f.y) / 2 - 15 },
          { x: f.x - 30, y: f.y },
        ];
        generatedStrokes.push({ points, color: "#f59e0b", width: 2 }); // Amber lines
      });
    } else if (diagramType === "neural") {
      // Draw standard 3-layer feedforward network
      const layers = [3, 4, 2];
      const layerSpacing = width / (layers.length + 1);
      const neuronRadius = 10;

      const layerNodes: Point[][] = [];

      layers.forEach((count, lIdx) => {
        const layerX = layerSpacing * (lIdx + 1);
        const ySpacing = height / (count + 1);
        const pointsArr: Point[] = [];

        for (let i = 1; i <= count; i++) {
          const neuronY = ySpacing * i;
          pointsArr.push({ x: layerX, y: neuronY });

          // Draw neuron circle
          const circ: Point[] = [];
          for (let angle = 0; angle <= Math.PI * 2 + 0.1; angle += 0.4) {
            circ.push({
              x: layerX + Math.cos(angle) * neuronRadius,
              y: neuronY + Math.sin(angle) * neuronRadius,
            });
          }
          generatedStrokes.push({ points: circ, color: "#22d3ee", width: 2 });
        }
        layerNodes.push(pointsArr);
      });

      // Draw connection synapses
      for (let l = 0; l < layerNodes.length - 1; l++) {
        const currLayer = layerNodes[l];
        const nextLayer = layerNodes[l + 1];

        currLayer.forEach((currNeuron) => {
          nextLayer.forEach((nextNeuron) => {
            generatedStrokes.push({
              points: [currNeuron, nextNeuron],
              color: "#34d39922", // Very thin cyan transparency representation
              width: 1,
            });
          });
        });
      }
    } else {
      // Draw Binary Search Tree
      const treeNodes = [
        { x: width * 0.5, y: height * 0.2, left: 1, right: 2 }, // Root 50
        { x: width * 0.3, y: height * 0.45, left: 3, right: null }, // Left 30
        { x: width * 0.7, y: height * 0.45, left: null, right: 4 }, // Right 70
        { x: width * 0.15, y: height * 0.7, left: null, right: null }, // Left-Left 15
        { x: width * 0.85, y: height * 0.7, left: null, right: null }, // Right-Right 85
      ];

      treeNodes.forEach((node) => {
        // Draw circle
        const circlePoints: Point[] = [];
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.3) {
          circlePoints.push({
            x: node.x + Math.cos(a) * 15,
            y: node.y + Math.sin(a) * 15,
          });
        }
        generatedStrokes.push({ points: circlePoints, color: "#f43f5e", width: 2 });

        // Draw child branches
        if (node.left !== null) {
          const target = treeNodes[node.left];
          generatedStrokes.push({
            points: [
              { x: node.x - 10, y: node.y + 10 },
              { x: target.x + 10, y: target.y - 10 },
            ],
            color: "#6366f1",
            width: 2,
          });
        }
        if (node.right !== null) {
          const target = treeNodes[node.right];
          generatedStrokes.push({
            points: [
              { x: node.x + 10, y: node.y + 10 },
              { x: target.x - 10, y: target.y - 10 },
            ],
            color: "#6366f1",
            width: 2,
          });
        }
      });
    }

    setStrokes(generatedStrokes);
    syncWithDatabase(generatedStrokes);
  };

  const handleToggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  return (
    <div className="space-y-4 py-2">
      <audio 
        ref={audioRef} 
        loop 
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
      />
      {/* Control Toolbar */}
      <div className="p-4 rounded-2xl bg-[#091822] border border-[#1a384a] flex flex-wrap items-center justify-between gap-4 shadow-lg">
        {/* Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTool("pen")}
            className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              tool === "pen"
                ? "bg-cyan-500 text-slate-950 font-black shadow-md"
                : "text-[#789cae] hover:text-white bg-[#061117] border border-[#142a38]"
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span className="hidden sm:inline">Pencil</span>
          </button>

          <button
            onClick={() => setTool("eraser")}
            className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              tool === "eraser"
                ? "bg-cyan-500 text-slate-950 font-black shadow-md"
                : "text-[#789cae] hover:text-white bg-[#061117] border border-[#142a38]"
            }`}
          >
            <Eraser className="w-4 h-4" />
            <span className="hidden sm:inline">Eraser</span>
          </button>

          <div className="h-6 w-[1px] bg-[#1a384a]" />

          {/* Color Palette */}
          {tool === "pen" && (
            <div className="flex items-center gap-1.5 bg-[#061117] p-1.5 rounded-xl border border-[#142a38]">
              {colors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  style={{ backgroundColor: c.value }}
                  className={`w-5 h-5 rounded-lg border-2 transition-transform ${
                    color === c.value ? "border-white scale-110" : "border-transparent"
                  }`}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thickness, Undo, Clear */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#061117] px-3 py-1.5 rounded-xl border border-[#142a38] text-[11px] text-[#789cae]">
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Weight: {lineWidth}px</span>
            <input
              type="range"
              min="1"
              max="15"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-16 accent-cyan-500 h-1 bg-[#1a384a] rounded"
            />
          </div>

          <button
            onClick={handleUndo}
            disabled={strokes.length === 0}
            className="p-2.5 rounded-xl text-xs font-bold text-[#789cae] hover:text-white bg-[#061117] border border-[#142a38] disabled:opacity-40 transition-all"
            title="Undo stroke"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleClear}
            disabled={strokes.length === 0}
            className="p-2.5 rounded-xl text-xs font-bold text-cyan-400 hover:text-cyan-300 bg-[#061117] border border-[#142a38] disabled:opacity-40 transition-all"
            title="Clear canvas"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Brainstorm / Draw Simulation & Sync Status */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleToggleMusic}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md border ${
              isMusicPlaying
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
                : "bg-[#061117] text-[#789cae] border-[#142a38] hover:text-white"
            }`}
            title="Shared Lo-Fi Playlist"
          >
            <Music className="w-4 h-4" />
            <span className="hidden sm:inline">Lo-Fi Sync</span>
            {isMusicPlaying ? <Pause className="w-3 h-3 ml-1" /> : <Play className="w-3 h-3 ml-1" />}
          </button>

          <div className="relative group">
            <button
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md hover:from-cyan-500 hover:to-blue-500 transition-all"
              title="Procedurally sketch conceptual charts to brainstorm with your room peers"
            >
              <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
              <span>Simulate Diagram</span>
            </button>
            
            {/* Dropdown for diagrams */}
            <div className="absolute right-0 top-11 hidden group-hover:block bg-[#091822] border border-[#1a384a] p-2 rounded-xl shadow-2xl z-20 w-44 space-y-1">
              <button
                onClick={() => handleProceduralSketch("raft")}
                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#122e3e] text-xs text-[#8bb0c0] hover:text-white"
              >
                Raft Consensus Nodes
              </button>
              <button
                onClick={() => handleProceduralSketch("neural")}
                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#122e3e] text-xs text-[#8bb0c0] hover:text-white"
              >
                Neural Net Topology
              </button>
              <button
                onClick={() => handleProceduralSketch("binary")}
                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#122e3e] text-xs text-[#8bb0c0] hover:text-white"
              >
                Binary Search Tree
              </button>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            {exportSaved ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{exportSaved ? "Saved" : "Export Sketch"}</span>
          </button>
        </div>
      </div>

      {/* Canvas Box */}
      <div className="relative rounded-2xl bg-[#061117] border border-[#193648] shadow-2xl overflow-hidden min-h-[400px]">
        {/* Sync Metadata */}
        <div className="absolute top-3 left-3 bg-[#091822]/80 backdrop-blur-sm border border-[#1a384a] px-3 py-1.5 rounded-xl flex items-center gap-2 text-[10px] font-mono text-[#6d90a1]">
          <PenTool className="w-3.5 h-3.5 text-cyan-400" />
          <span>Active Drawing Layer ({strokes.length} strokes)</span>
          <span className="text-[#1a384a]">|</span>
          <span>Last Merge: {lastSyncedTime}</span>
          {isSyncing && (
            <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" />
          )}
        </div>

        <div className="absolute top-3 right-3 bg-[#091822]/80 backdrop-blur-sm border border-[#1a384a] px-3 py-1.5 rounded-xl flex items-center gap-2 text-[10px] font-mono text-cyan-400">
          <Users className="w-3.5 h-3.5" />
          <span>{activePeers} Peer Brainstormers sketch live</span>
        </div>

        <canvas
          ref={canvasRef}
          onMouseDown={handleStartDrawing}
          onMouseMove={handleDrawingMove}
          onMouseUp={handleEndDrawing}
          onMouseLeave={handleEndDrawing}
          onTouchStart={handleStartDrawing}
          onTouchMove={handleDrawingMove}
          onTouchEnd={handleEndDrawing}
          className="w-full h-[400px] block cursor-crosshair"
        />
      </div>
    </div>
  );
};
