import React from "react";
import * as d3 from "d3";
import { Course } from "../shared/types";
import {
  Sparkles,
  CheckCircle2,
  Lock,
  Play,
  Compass,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Brain,
  Activity,
  Sliders,
  Check,
  Pause,
} from "lucide-react";

interface D3LearningPathMapProps {
  courses: Course[];
  enrolledCourseIds: string[];
  onSelectCourse: (course: Course) => void;
  degreeTitle?: string;
}

export interface PathNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  tier: 1 | 2 | 3 | 4;
  tierLabel: string;
  category: string;
  status: "completed" | "in-progress" | "available" | "locked";
  description: string;
  durationHours: number;
  credits: number;
  prerequisites: string[];
  competencies: string[];
  isCapstone?: boolean;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface PathLink extends d3.SimulationLinkDatum<PathNode> {
  source: string | PathNode;
  target: string | PathNode;
  type: "prerequisite" | "core_track" | "elective";
  strength?: number;
}

export const D3LearningPathMap: React.FC<D3LearningPathMapProps> = ({
  courses,
  enrolledCourseIds,
  onSelectCourse,
  degreeTitle = "Autonomous AI & Software Engineering Degree",
}) => {
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const zoomBehaviorRef = React.useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const [selectedNode, setSelectedNode] = React.useState<PathNode | null>(null);
  const [hoveredNodeId, setHovecyanNodeId] = React.useState<string | null>(null);
  const [selectedDegree, setSelectedDegree] = React.useState<string>(degreeTitle);
  const [selectedTrack, setSelectedTrack] = React.useState<string>("all");
  const [isPhysicsActive, setIsPhysicsActive] = React.useState<boolean>(true);
  const [simulationInstance, setSimulationInstance] = React.useState<d3.Simulation<PathNode, PathLink> | null>(null);

  const degreeOptions = [
    { id: "ai_eng", title: "Autonomous Multi-Agent Swarms & Antigravity Reasoning", category: "Autonomous & Cognitive Systems", level: "Graduate Track", totalCredits: 36 },
    { id: "dist_sys", title: "Full-Stack Agentic Systems & Cloud Architecture", category: "Cloud Engineering & Distributed Systems", level: "Professional Track", totalCredits: 32 },
    { id: "cyber_sec", title: "Post-Quantum Cryptography & Zero-Trust Security", category: "Cybersecurity, Cryptography & Defense", level: "Specialist Track", totalCredits: 34 },
    { id: "data_sci", title: "Enterprise Data Science & Predictive Analytics", category: "Data Science, Analytics & Big Data", level: "Core Track", totalCredits: 32 },
    { id: "robotics", title: "Embodied Robotics & Autonomous Navigation (SLAM)", category: "Robotics, Embodied AI & IoT", level: "Engineering Track", totalCredits: 36 },
    { id: "quantum_ml", title: "Quantum Information Science & Quantum Algorithms", category: "Quantum Computing & Theoretical Physics", level: "Research Track", totalCredits: 38 },
    { id: "fintech", title: "Quantitative Finance & Algorithmic Trading Engines", category: "FinTech, Blockchain & Quantitative Finance", level: "Executive Track", totalCredits: 34 },
    { id: "bioinfo", title: "Computational Biology & Genomic Data Science", category: "Bioinformatics & Digital Healthcare Technology", level: "Research Track", totalCredits: 36 },
    { id: "ai_prod", title: "AI Product Management & Enterprise Strategy", category: "AI Product Leadership & Digital Business", level: "Leadership Track", totalCredits: 30 },
    { id: "aerospace", title: "Orbital Mechanics & Space Mission Systems", category: "Space Systems, Aerospace & Orbital Mechanics", level: "Engineering Track", totalCredits: 36 },
    { id: "renewable", title: "Smart Grid Architecture & Energy Storage Systems", category: "Renewable Energy & Climate Engineering", level: "Sustainability Track", totalCredits: 32 },
  ];

  // Derive graph nodes and hierarchical structure based on chosen degree program
  const { nodes, links } = React.useMemo(() => {
    const nodeMap = new Map<string, PathNode>();
    const linkList: PathLink[] = [];

    // Filter courses relevant to current catalog
    const baseCourses = courses.length > 0 ? courses : [];

    // Build 4 distinct academic tiers
    const tierMeta: Record<number, { label: string; offsetFactor: number }> = {
      1: { label: "Foundations & Mathematical Tooling", offsetFactor: 0.18 },
      2: { label: "Core Mechanisms & Domain Architecture", offsetFactor: 0.42 },
      3: { label: "Advanced Scalability & Formal Verification", offsetFactor: 0.68 },
      4: { label: "Capstone Defense & Production Deployment", offsetFactor: 0.90 },
    };

    // Synthesize tailored curriculum nodes per selected degree
    const currentOpt = degreeOptions.find((d) => d.title === selectedDegree) || degreeOptions[0];

    const generateDomainCurriculum = (opt: typeof degreeOptions[0]): PathNode[] => {
      const isAI = opt.id === "ai_eng" || opt.category.includes("Autonomous");
      const isCyber = opt.id === "cyber_sec";
      const isQuantum = opt.id === "quantum_ml";
      const isRobotics = opt.id === "robotics";
      const isFintech = opt.id === "fintech";
      const isBio = opt.id === "bioinfo";
      const isSpace = opt.id === "aerospace";
      const isEnergy = opt.id === "renewable";

      return [
        {
          id: `node_101_${opt.id}`,
          name: isQuantum ? "Linear Algebra & Hilbert Spaces" : isCyber ? "Discrete Mathematics & Group Theory" : isFintech ? "Stochastic Calculus & Probability Theory" : isBio ? "Biostatistical Foundations & Molecular Genomics" : isSpace ? "Classical Mechanics & Orbital Dynamics" : isEnergy ? "Thermodynamics & Electrical Circuit Theory" : "Discrete Mathematics & Proof Foundations",
          tier: 1,
          tierLabel: tierMeta[1].label,
          category: "Foundations",
          status: "completed",
          description: `Core mathematical formulation, theoretical proofs, and computational foundations for ${opt.title}.`,
          durationHours: 20,
          credits: 4,
          prerequisites: [],
          competencies: ["Mathematical Rigor", "Theoretical Modeling", "Formal Proofs"],
        },
        {
          id: `node_102_${opt.id}`,
          name: isQuantum ? "Quantum State Vectors & Qubit Gates" : isCyber ? "Cryptographic Algorithms & Ciphers" : isFintech ? "Time-Series Econometrics & Numerical Methods" : isBio ? "Genomic Sequence Alignment & BioPython" : isSpace ? "Astrodynamics & Coordinate Systems" : isEnergy ? "Power Electronics & Energy Modeling" : "Data Structures & Algorithmic Complexity",
          tier: 1,
          tierLabel: tierMeta[1].label,
          category: "Core Theory",
          status: enrolledCourseIds.length > 0 ? "completed" : "in-progress",
          description: `Algorithmic formulations, data structures, and computational benchmarks for ${opt.title}.`,
          durationHours: 24,
          credits: 4,
          prerequisites: [`node_101_${opt.id}`],
          competencies: ["Algorithmic Design", "State Representations", "Performance Benchmarking"],
        },
        {
          id: `node_201_${opt.id}`,
          name: isAI ? "Transformer Attention & Neural Representations" : isCyber ? "Zero-Trust Architecture & Identity Fabrics" : isQuantum ? "Quantum Circuits & Variational Algorithms" : isRobotics ? "Kinematic Chains & LiDAR Sensor Fusion" : isFintech ? "High-Frequency Matching Engines & Order Books" : isBio ? "Protein Folding Transformers & AlphaFold Mechanics" : isSpace ? "Propulsion Telemetry & Flight Guidance Systems" : "Domain Architecture & System Design",
          tier: 2,
          tierLabel: tierMeta[2].label,
          category: "Mechanisms",
          status: "in-progress",
          description: `In-depth structural engineering, component protocols, and system architecture for ${opt.title}.`,
          durationHours: 28,
          credits: 4,
          prerequisites: [`node_102_${opt.id}`],
          competencies: ["System Design", "Protocol Implementation", "Component Integration"],
        },
        {
          id: `node_202_${opt.id}`,
          name: isAI ? "Autonomous Agent Orchestration & Tool Calling" : isCyber ? "Threat Modeling & Penetration Testing" : isQuantum ? "Noise Mitigation & Error Mitigation Layers" : isRobotics ? "SLAM & Path Planning in Dynamic Environments" : isFintech ? "Quantitative Risk Models & Portfolio Optimization" : isBio ? "Single-Cell RNA Sequence Pipeline Automation" : isSpace ? "Autonomous Orbital Navigation & Attitude Control" : "Applied Frameworks & Automation",
          tier: 2,
          tierLabel: tierMeta[2].label,
          category: "Applied Engineering",
          status: "available",
          description: `Applied automation pipelines, real-time telemetry, and tooling workflows for ${opt.title}.`,
          durationHours: 30,
          credits: 4,
          prerequisites: [`node_201_${opt.id}`],
          competencies: ["Pipeline Automation", "Tool Calling", "Telemetry Monitoring"],
        },
        {
          id: `node_301_${opt.id}`,
          name: isAI ? "Distributed Consensus & Raft Replication" : isCyber ? "Zero-Knowledge Proofs & zk-SNARKs" : isQuantum ? "Fault-Tolerant Surface Codes & Quantum Memory" : isRobotics ? "Multi-Agent Robot Swarm Coordination" : isFintech ? "Ultra-Low Latency FPGA Trading Infrastructure" : isBio ? "Clinical Trial Data Pipelines & HIPAA Governance" : isSpace ? "Interplanetary Relay Networks & Space Mesh" : "Distributed Scalability",
          tier: 3,
          tierLabel: tierMeta[3].label,
          category: "Scalability",
          status: "available",
          description: `High-throughput distributed scalability, formal verification, and fault tolerance in ${opt.title}.`,
          durationHours: 32,
          credits: 4,
          prerequisites: [`node_102_${opt.id}`, `node_202_${opt.id}`],
          competencies: ["Distributed Resilience", "Fault Tolerance", "Formal Verification"],
        },
        {
          id: `node_302_${opt.id}`,
          name: isAI ? "Cellular Sheaves & Topological Multi-Agent ADMM" : isCyber ? "Post-Quantum Lattice Cryptography & Security Proofs" : isQuantum ? "Quantum Tensor Networks & Topological Phases" : isRobotics ? "Bipedal Locomotion & Non-Linear MPC Control" : isFintech ? "Causal Volatility Estimation & Dark Pool Routing" : isBio ? "Generative Molecular Design & Chemical AI" : isSpace ? "Deep Space Trajectory Optimization & Relativistic Sim" : "Advanced Mathematical Specialization",
          tier: 3,
          tierLabel: tierMeta[3].label,
          category: "Advanced Theory",
          status: "locked",
          description: `Cutting-edge mathematical and algorithmic paradigms driving state-of-the-art advances in ${opt.title}.`,
          durationHours: 36,
          credits: 4,
          prerequisites: [`node_202_${opt.id}`, `node_301_${opt.id}`],
          competencies: ["Advanced Mathematical Proofs", "Mathematical Cohomology", "SOTA Optimization"],
        },
        {
          id: `node_401_${opt.id}`,
          name: `Capstone: Production Defense in ${opt.title}`,
          tier: 4,
          tierLabel: tierMeta[4].label,
          category: "Capstone Mastery",
          status: "locked",
          description: `Comprehensive academic and industry capstone project demonstrating end-to-end working software, technical thesis write-up, and live defense before the LMD Academic Board.`,
          durationHours: 48,
          credits: 8,
          prerequisites: [`node_301_${opt.id}`, `node_302_${opt.id}`],
          competencies: ["End-to-End Delivery", "Academic Thesis Defense", "Production Architecture"],
          isCapstone: true,
        },
      ];
    };

    const generatedNodes: PathNode[] = generateDomainCurriculum(currentOpt);

    // Merge any actual catalog courses into matching nodes
    generatedNodes.forEach((node) => {
      const match = baseCourses.find(
        (c) =>
          c.title.toLowerCase().includes(node.name.toLowerCase().slice(0, 10)) ||
          c.category.toLowerCase() === node.category.toLowerCase()
      );
      if (match) {
        node.id = match.id;
        if (enrolledCourseIds.includes(match.id)) {
          node.status = "in-progress";
        }
      }
      nodeMap.set(node.id, node);
    });

    // Build Links based on prerequisites
    generatedNodes.forEach((node) => {
      node.prerequisites.forEach((preId) => {
        if (nodeMap.has(preId)) {
          linkList.push({
            source: preId,
            target: node.id,
            type: "prerequisite",
            strength: 1,
          });
        }
      });
    });

    // Add elective interconnects
    const firstTier2 = generatedNodes.find((n) => n.tier === 2);
    const firstTier3 = generatedNodes.find((n) => n.tier === 3);
    if (firstTier2 && firstTier3 && nodeMap.has(firstTier2.id) && nodeMap.has(firstTier3.id)) {
      linkList.push({
        source: firstTier2.id,
        target: firstTier3.id,
        type: "elective",
        strength: 0.5,
      });
    }

    return {
      nodes: Array.from(nodeMap.values()),
      links: linkList,
    };
  }, [courses, enrolledCourseIds, selectedDegree]);

  // Compute progress metrics
  const progressStats = React.useMemo(() => {
    const total = nodes.length;
    const completed = nodes.filter((n) => n.status === "completed").length;
    const inProgress = nodes.filter((n) => n.status === "in-progress").length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, pct };
  }, [nodes]);

  // Render D3 Graph
  React.useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = Math.max(containerRef.current.clientWidth || 1000, 1000);
    const height = 540;

    // Clear previous elements
    const rootSvg = d3.select(svgRef.current);
    rootSvg.selectAll("*").remove();

    rootSvg.attr("viewBox", [0, 0, width, height]);

    // Defs for glowing markers, gradients, and filters
    const defs = rootSvg.append("defs");

    // Glow filter for highlighted paths
    const filter = defs.append("filter").attr("id", "d3-path-glow");
    filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "4")
      .attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Arrow markers for links
    defs
      .append("marker")
      .attr("id", "arrow-active")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 26)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#22d3ee")
      .attr("d", "M0,-5L10,0L0,5");

    defs
      .append("marker")
      .attr("id", "arrow-dim")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 26)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#334155")
      .attr("d", "M0,-5L10,0L0,5");

    // Main graph group
    const g = rootSvg.append("g").attr("class", "graph-root");

    // Zoom setup
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2.5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    rootSvg.call(zoom);
    zoomBehaviorRef.current = zoom;

    // Draw background tier vertical swimlanes
    const tierGroup = g.append("g").attr("class", "tier-bands");
    const tierPositions = [0.12, 0.38, 0.65, 0.90];
    const tierLabels = [
      "TIER 1: FOUNDATIONS",
      "TIER 2: CORE ARCHITECTURE",
      "TIER 3: ADVANCED SCALABILITY",
      "TIER 4: CAPSTONE MASTERY",
    ];

    tierPositions.forEach((xFrac, i) => {
      const xPos = width * xFrac;
      tierGroup
        .append("line")
        .attr("x1", xPos)
        .attr("y1", 20)
        .attr("x2", xPos)
        .attr("y2", height - 20)
        .attr("stroke", "rgba(56, 189, 248, 0.08)")
        .attr("stroke-dasharray", "4 4");

      tierGroup
        .append("text")
        .attr("x", xPos)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("fill", "rgba(115, 165, 173, 0.6)")
        .attr("font-size", "10px")
        .attr("font-weight", "700")
        .attr("letter-spacing", "0.08em")
        .text(tierLabels[i]);
    });

    // Filter nodes if a specific category track is chosen
    const activeNodes =
      selectedTrack === "all"
        ? nodes
        : nodes.filter(
            (n) =>
              n.category.toLowerCase().includes(selectedTrack) ||
              n.tier === 1 ||
              n.isCapstone
          );

    const activeNodeIds = new Set(activeNodes.map((n) => n.id));
    const activeLinks = links.filter((l) => {
      const srcId = typeof l.source === "object" ? (l.source as PathNode).id : l.source;
      const tgtId = typeof l.target === "object" ? (l.target as PathNode).id : l.target;
      return activeNodeIds.has(srcId) && activeNodeIds.has(tgtId);
    });

    // Initialize initial positions along tier lanes
    activeNodes.forEach((node) => {
      const targetX = width * (tierPositions[node.tier - 1] || 0.5);
      if (!node.x) node.x = targetX + (Math.random() - 0.5) * 40;
      if (!node.y) node.y = height * 0.5 + (Math.random() - 0.5) * 160;
    });

    // D3 Force Simulation with gentle horizontal pinning
    const simulation = d3
      .forceSimulation<PathNode>(activeNodes)
      .force(
        "link",
        d3
          .forceLink<PathNode, PathLink>(activeLinks)
          .id((d) => d.id)
          .distance(130)
      )
      .force("charge", d3.forceManyBody().strength(-320))
      .force("collide", d3.forceCollide().radius(46))
      .force(
        "x",
        d3
          .forceX<PathNode>((d) => width * (tierPositions[d.tier - 1] || 0.5))
          .strength(0.8)
      )
      .force("y", d3.forceY(height * 0.52).strength(0.18));

    setSimulationInstance(simulation);

    if (!isPhysicsActive) {
      simulation.stop();
    }

    // Draw Links with smooth curved Bezier paths
    const linkGroup = g.append("g").attr("class", "links-layer");
    const linkElements = linkGroup
      .selectAll("path")
      .data(activeLinks)
      .join("path")
      .attr("fill", "none")
      .attr("stroke", (d) => (d.type === "prerequisite" ? "#22d3ee" : "#38bdf8"))
      .attr("stroke-width", (d) => (d.type === "prerequisite" ? 2.5 : 1.5))
      .attr("stroke-dasharray", (d) => (d.type === "elective" ? "4 4" : "none"))
      .attr("opacity", 0.7)
      .attr("marker-end", "url(#arrow-active)");

    // Draw Node Groups
    const nodeGroup = g.append("g").attr("class", "nodes-layer");
    const nodeElements = nodeGroup
      .selectAll<SVGGElement, PathNode>("g")
      .data(activeNodes)
      .join("g")
      .attr("class", "node-element cursor-pointer")
      .call(
        d3
          .drag<SVGGElement, PathNode>()
          .on("start", (event, d) => {
            if (!event.active && isPhysicsActive) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active && isPhysicsActive) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Node outer decorative rings
    nodeElements
      .append("circle")
      .attr("r", (d) => (d.isCapstone ? 32 : 24))
      .attr("fill", (d) => {
        if (d.status === "completed") return "#042f2e";
        if (d.status === "in-progress") return "#083344";
        if (d.status === "available") return "#0f172a";
        return "#090d16";
      })
      .attr("stroke", (d) => {
        if (d.status === "completed") return "#10b981";
        if (d.status === "in-progress") return "#06b6d4";
        if (d.status === "available") return "#64748b";
        return "#334155";
      })
      .attr("stroke-width", (d) => (d.isCapstone ? 3.5 : 2.5))
      .attr("filter", (d) => (d.status === "in-progress" ? "url(#d3-path-glow)" : "none"))
      .attr("class", "transition-transform duration-200");

    // Node Status Glyphs / Icons
    nodeElements
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", (d) => {
        if (d.status === "completed") return "#34d399";
        if (d.status === "in-progress") return "#22d3ee";
        if (d.status === "available") return "#94a3b8";
        return "#475569";
      })
      .attr("font-size", (d) => (d.isCapstone ? "14px" : "11px"))
      .attr("font-weight", "bold")
      .attr("pointer-events", "none")
      .text((d) => {
        if (d.isCapstone) return "★";
        if (d.status === "completed") return "✓";
        if (d.status === "in-progress") return "▶";
        if (d.status === "available") return "✦";
        return "🔒";
      });

    // Node Title Label (Formatted cleanly below node)
    nodeElements
      .append("text")
      .attr("dy", (d) => (d.isCapstone ? 46 : 38))
      .attr("text-anchor", "middle")
      .attr("fill", "#e2e8f0")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .attr("pointer-events", "none")
      .attr("class", "node-label")
      .text((d) => (d.name.length > 24 ? d.name.slice(0, 22) + "..." : d.name));

    // Secondary Category Tag
    nodeElements
      .append("text")
      .attr("dy", (d) => (d.isCapstone ? 58 : 50))
      .attr("text-anchor", "middle")
      .attr("fill", "#73A5AD")
      .attr("font-size", "9px")
      .attr("pointer-events", "none")
      .text((d) => `${d.category} • ${d.credits} Cr`);

    // Interactivity: Hover & Selection Handlers
    nodeElements
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
        const matchCourse = courses.find((c) => c.id === d.id);
        if (matchCourse && d.status !== "locked") {
          onSelectCourse(matchCourse);
        }
      })
      .on("mouseenter", function (event, d) {
        setHovecyanNodeId(d.id);
        d3.select(this)
          .select("circle")
          .transition()
          .duration(150)
          .attr("r", d.isCapstone ? 36 : 28)
          .attr("stroke", "#38bdf8")
          .attr("stroke-width", 3.5);
      })
      .on("mouseleave", function (event, d) {
        setHovecyanNodeId(null);
        d3.select(this)
          .select("circle")
          .transition()
          .duration(150)
          .attr("r", d.isCapstone ? 32 : 24)
          .attr("stroke", (node: any) => {
            const n = node as PathNode;
            if (n && n.status === "completed") return "#10b981";
            if (n && n.status === "in-progress") return "#06b6d4";
            if (n && n.status === "available") return "#64748b";
            return "#334155";
          })
          .attr("stroke-width", d.isCapstone ? 3.5 : 2.5);
      });

    // Simulation tick loop with curved cubic Bezier connectors
    simulation.on("tick", () => {
      linkElements.attr("d", (d: any) => {
        const sx = d.source.x;
        const sy = d.source.y;
        const tx = d.target.x;
        const ty = d.target.y;
        const dx = tx - sx;
        const control1X = sx + dx * 0.45;
        const control1Y = sy;
        const control2X = sx + dx * 0.55;
        const control2Y = ty;
        return `M ${sx} ${sy} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${tx} ${ty}`;
      });

      nodeElements.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, links, selectedTrack, isPhysicsActive, courses]);

  // Toolbar Actions
  const handleZoomIn = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(250).call(zoomBehaviorRef.current.scaleBy, 1.25);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(250).call(zoomBehaviorRef.current.scaleBy, 0.8);
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(350).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    }
  };

  return (
    <div className="p-4 sm:p-6 rounded-3xl bg-[#061219]/90 backdrop-blur-xl border border-[#163647] shadow-2xl space-y-4">
      {/* Header & Degree Track Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#143242] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
                <span>D3 Degree Learning Path & Prerequisite Matrix</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {progressStats.pct}% Complete
                </span>
              </h2>
              <p className="text-xs text-[#82a4b3]">
                Architectural DAG tracking dependencies, mathematical prerequisites, and capstone milestones.
              </p>
            </div>
          </div>
        </div>

        {/* Controls & Track Filter */}
        <div className="flex flex-wrap items-center gap-2 max-w-full">
          <select
            value={selectedDegree}
            onChange={(e) => setSelectedDegree(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#030b10] border border-[#163647] text-xs text-cyan-300 font-medium focus:outline-none focus:border-cyan-500 w-full sm:w-auto max-w-full text-ellipsis"
          >
            {degreeOptions.map((deg) => (
              <option key={deg.id} value={deg.title}>
                {deg.title} ({deg.totalCredits} Cr)
              </option>
            ))}
          </select>

          {/* Track Filter Buttons */}
          <div className="flex items-center bg-[#030b10] border border-[#163647] rounded-xl p-0.5">
            {[
              { id: "all", label: "All" },
              { id: "ai", label: "AI" },
              { id: "system", label: "Systems" },
              { id: "math", label: "Math" },
            ].map((trk) => (
              <button
                key={trk.id}
                onClick={() => setSelectedTrack(trk.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  selectedTrack === trk.id
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "text-[#82a4b3] hover:text-white"
                }`}
              >
                {trk.label}
              </button>
            ))}
          </div>

          {/* Physics Simulation Toggle */}
          <button
            onClick={() => setIsPhysicsActive(!isPhysicsActive)}
            className={`p-1.5 rounded-xl border text-xs transition-all ${
              isPhysicsActive
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                : "bg-[#030b10] text-[#82a4b3] border-[#163647]"
            }`}
            title={isPhysicsActive ? "Pause Physics Simulation" : "Resume Physics Simulation"}
          >
            {isPhysicsActive ? <Activity className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Zoom Toolbar */}
          <div className="flex items-center gap-1 bg-[#030b10] border border-[#163647] rounded-xl p-0.5">
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg text-[#82a4b3] hover:text-white hover:bg-[#143242] transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg text-[#82a4b3] hover:text-white hover:bg-[#143242] transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg text-[#82a4b3] hover:text-white hover:bg-[#143242] transition-colors"
              title="Reset View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* D3 Canvas Stage */}
      <div
        ref={containerRef}
        className="relative w-full h-[450px] sm:h-[540px] rounded-2xl bg-[#030b10] dark:bg-[#030b10] border border-[#143242] overflow-hidden flex items-center justify-center shadow-inner"
      >
        <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-pan-x touch-pan-y" />

        {/* Floating Legend */}
        <div className="absolute bottom-3 left-3 p-2.5 sm:p-3 rounded-2xl bg-[#061219]/95 backdrop-blur-md border border-[#163647] text-[10px] sm:text-[11px] text-[#82a4b3] space-y-1 shadow-xl pointer-events-none sm:pointer-events-auto max-w-[200px] sm:max-w-none">
          <div className="font-bold text-white flex items-center gap-1.5 text-xs pb-1 border-b border-[#143242]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Path Node Legend</span>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-400 shrink-0" />
            <span>Completed Module</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            <span>In-Progress (Active)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-slate-500 shrink-0" />
            <span>Available Prerequisite</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-slate-800 border border-slate-700 shrink-0" />
            <span>Locked Future Step</span>
          </div>
        </div>

        {/* Selected Node Inspector Drawer */}
        {selectedNode && (
          <div className="absolute bottom-3 sm:bottom-auto sm:top-3 left-3 sm:left-auto right-3 sm:w-80 max-h-[78%] sm:max-h-[92%] overflow-y-auto p-4 rounded-2xl bg-[#061219]/98 backdrop-blur-xl border border-cyan-500/40 shadow-2xl text-xs space-y-3 animate-in fade-in zoom-in duration-150 z-20">
            <div className="flex items-center justify-between">
              <span
                className={`px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider ${
                  selectedNode.status === "completed"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : selectedNode.status === "in-progress"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "bg-slate-800 text-slate-300 border border-slate-700"
                }`}
              >
                {selectedNode.status.replace("-", " ")}
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white text-base font-bold w-6 h-6 flex items-center justify-center rounded-lg hover:bg-[#143242]"
              >
                ×
              </button>
            </div>

            <div>
              <div className="text-[10px] text-cyan-400 font-mono font-semibold uppercase">
                {selectedNode.tierLabel}
              </div>
              <h3 className="font-bold text-white text-sm mt-0.5 leading-snug">
                {selectedNode.name}
              </h3>
            </div>

            <p className="text-[#82a4b3] text-[11px] leading-relaxed">
              {selectedNode.description}
            </p>

            {/* Meta Tags */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#143242] text-[11px]">
              <div>
                <span className="text-[#638799] block text-[10px]">Academic Credits</span>
                <span className="text-white font-mono font-semibold">{selectedNode.credits} Credits</span>
              </div>
              <div>
                <span className="text-[#638799] block text-[10px]">Estimated Effort</span>
                <span className="text-white font-mono font-semibold">{selectedNode.durationHours} Hours</span>
              </div>
            </div>

            {/* Competencies Acquired */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#82a4b3] block">
                Target Competencies
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedNode.competencies.map((comp, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-[#030b10] text-cyan-200 border border-[#163647] text-[10px]"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>

            {/* Launch / Workspace Action */}
            <div className="pt-2">
              {selectedNode.status !== "locked" ? (
                <button
                  onClick={() => {
                    const match = courses.find((c) => c.id === selectedNode.id);
                    if (match) onSelectCourse(match);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-500 hover:from-cyan-400 hover:to-cyan-400 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Course Workspace</span>
                </button>
              ) : (
                <div className="w-full py-2 px-3 rounded-xl bg-[#030b10] border border-[#163647] text-[#638799] text-center font-medium text-[11px] flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Complete Prerequisites to Unlock</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

