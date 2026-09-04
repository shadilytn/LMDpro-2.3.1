import React from "react";
import * as d3 from "d3";
import { 
  Network, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  FileText, 
  BookOpen, 
  GraduationCap, 
  Sparkles, 
  Layers, 
  ExternalLink,
  Tag,
  Filter,
  Info,
  CheckCircle2
} from "lucide-react";
import { KnowledgeItem } from "./KnowledgeBase";
import { ObsidianNote } from "./ObsidianNotesEngine";

export interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  title: string;
  type: "paper" | "module" | "note" | "degree";
  category: string;
  topic: string;
  tags: string[];
  snippet: string;
  author?: string;
  date?: string;
  originalDoc?: KnowledgeItem;
  originalNote?: ObsidianNote;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  type: "citation" | "wikilink" | "shared_tag" | "curriculum";
  value: number;
}

interface D3KnowledgeGraphProps {
  documents: KnowledgeItem[];
  labNotes?: ObsidianNote[];
  onSelectDocument?: (doc: KnowledgeItem) => void;
  onSelectNote?: (note: ObsidianNote) => void;
}

export const D3KnowledgeGraph: React.FC<D3KnowledgeGraphProps> = ({
  documents,
  labNotes = [],
  onSelectDocument,
  onSelectNote,
}) => {
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  
  const [selectedNode, setSelectedNode] = React.useState<GraphNode | null>(null);
  const [filterType, setFilterType] = React.useState<"all" | "paper" | "module" | "note" | "degree">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [chargeStrength, setChargeStrength] = React.useState(-280);
  const [linkDistance, setLinkDistance] = React.useState(110);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Construct Nodes and Links from documents & personal lab notes
  const { nodes, links } = React.useMemo(() => {
    const nodeMap = new Map<string, GraphNode>();
    const linkList: GraphLink[] = [];

    // 1. Add KnowledgeBase Documents
    documents.forEach((doc) => {
      let nodeType: GraphNode["type"] = "paper";
      if (doc.type === "Course Module") nodeType = "module";
      else if (doc.type === "Degree Track") nodeType = "degree";
      else if (doc.type === "User Ingested Paper") nodeType = "paper";

      const node: GraphNode = {
        id: doc.id,
        title: doc.title,
        type: nodeType,
        category: doc.category,
        topic: doc.topic || "AI Research",
        tags: doc.tags || [],
        snippet: doc.content ? doc.content.slice(0, 160) + "..." : "",
        author: doc.author,
        date: doc.date,
        originalDoc: doc,
      };

      nodeMap.set(doc.id, node);
    });

    // 2. Add Personal Lab Journal Notes
    labNotes.forEach((note) => {
      const node: GraphNode = {
        id: `note-${note.id}`,
        title: note.title,
        type: "note",
        category: "lab-journal",
        topic: note.folder || "Personal Notes",
        tags: note.tags || ["Lab Journal", "Personal Note"],
        snippet: note.content ? note.content.slice(0, 160) + "..." : "",
        date: note.updatedAt ? new Date(note.updatedAt).getFullYear().toString() : "2026",
        originalNote: note,
      };

      nodeMap.set(`note-${note.id}`, node);
    });

    const nodeList = Array.from(nodeMap.values());

    // 3. Synthesize Connections / Links
    for (let i = 0; i < nodeList.length; i++) {
      for (let j = i + 1; j < nodeList.length; j++) {
        const a = nodeList[i];
        const b = nodeList[j];

        // Wikilink Connection check (e.g., Note content includes [[Title]] of document or other note)
        const aContent = (a.originalDoc?.content || a.originalNote?.content || "").toLowerCase();
        const bContent = (b.originalDoc?.content || b.originalNote?.content || "").toLowerCase();

        const aTitleLower = a.title.toLowerCase();
        const bTitleLower = b.title.toLowerCase();

        let isLinked = false;
        let linkType: GraphLink["type"] = "shared_tag";
        let weight = 1;

        if (aContent.includes(`[[${bTitleLower}]]`) || bContent.includes(`[[${aTitleLower}]]`) || aContent.includes(bTitleLower.slice(0, 15)) || bContent.includes(aTitleLower.slice(0, 15))) {
          isLinked = true;
          linkType = "wikilink";
          weight = 3;
        } else if (a.topic === b.topic && a.topic !== "General") {
          // Shared Topic
          isLinked = true;
          linkType = "curriculum";
          weight = 2;
        } else {
          // Shared Tags
          const commonTags = a.tags.filter((t) => b.tags.some((bt) => bt.toLowerCase() === t.toLowerCase()));
          if (commonTags.length > 0) {
            isLinked = true;
            linkType = "shared_tag";
            weight = commonTags.length;
          }
        }

        if (isLinked) {
          linkList.push({
            source: a.id,
            target: b.id,
            type: linkType,
            value: weight,
          });
        }
      }
    }

    return { nodes: nodeList, links: linkList };
  }, [documents, labNotes]);

  // Filter nodes based on active controls
  const filteredNodes = React.useMemo(() => {
    return nodes.filter((n) => {
      const matchType = filterType === "all" || n.type === filterType;
      const matchQuery =
        searchQuery.trim() === "" ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchType && matchQuery;
    });
  }, [nodes, filterType, searchQuery]);

  const filteredNodeIds = React.useMemo(() => new Set(filteredNodes.map((n) => n.id)), [filteredNodes]);

  const filteredLinks = React.useMemo(() => {
    return links.filter((l) => {
      const srcId = typeof l.source === "string" ? l.source : l.source.id;
      const tgtId = typeof l.target === "string" ? l.target : l.target.id;
      return filteredNodeIds.has(srcId) && filteredNodeIds.has(tgtId);
    });
  }, [links, filteredNodeIds]);

  // Main D3 Rendering Engine
  React.useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 900;
    const height = 560;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", "100%")
      .attr("height", "100%");

    // Gradient Definitions
    const defs = svg.append("defs");

    // Glow Filter
    const filter = defs.append("filter").attr("id", "glow").attr("x", "-30%").attr("y", "-30%").attr("width", "160%").attr("height", "160%");
    filter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Container Group for Zooming
    const g = svg.append("g").attr("class", "graph-container");

    // Zoom Behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    // Deep clones to prevent simulation mutation glitches
    const simNodes: GraphNode[] = filteredNodes.map((d) => ({ ...d }));
    const simLinks: GraphLink[] = filteredLinks.map((d) => ({ ...d }));

    // Force Simulation Setup
    const simulation = d3
      .forceSimulation<GraphNode>(simNodes)
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphLink>(simLinks)
          .id((d) => d.id)
          .distance(linkDistance)
      )
      .force("charge", d3.forceManyBody().strength(chargeStrength))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(32));

    // Draw Links
    const link = g
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(simLinks)
      .enter()
      .append("line")
      .attr("stroke", (d) => {
        if (d.type === "wikilink") return "#a855f7"; // Purple for wikilinks
        if (d.type === "curriculum") return "#34d399"; // Emerald for curriculum
        return "#14384a"; // Cyan/slate for default tag connections
      })
      .attr("stroke-opacity", (d) => (d.type === "wikilink" ? 0.8 : 0.45))
      .attr("stroke-width", (d) => (d.type === "wikilink" ? 2 : 1))
      .attr("stroke-dasharray", (d) => (d.type === "shared_tag" ? "4 3" : "none"));

    // Draw Node Groups
    const node = g
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(simNodes)
      .enter()
      .append("g")
      .attr("class", "node-group")
      .style("cursor", "pointer")
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended) as any
      );

    // Node Outer Glow Ring
    node
      .append("circle")
      .attr("r", (d) => (d.type === "degree" ? 22 : d.type === "note" ? 17 : 19))
      .attr("fill", "none")
      .attr("stroke", (d) => getNodeColor(d.type))
      .attr("stroke-opacity", 0.35)
      .attr("stroke-width", 1.5)
      .attr("filter", "url(#glow)");

    // Main Node Circle
    node
      .append("circle")
      .attr("r", (d) => (d.type === "degree" ? 16 : d.type === "note" ? 12 : 14))
      .attr("fill", (d) => getNodeColor(d.type))
      .attr("stroke", "#030b10")
      .attr("stroke-width", 2);

    // Node Type Symbol Accent
    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", "#030b10")
      .attr("font-size", "10px")
      .attr("font-weight", "900")
      .text((d) => {
        if (d.type === "paper") return "📄";
        if (d.type === "module") return "🎓";
        if (d.type === "note") return "📓";
        return "🏛️";
      });

    // Node Labels
    node
      .append("text")
      .attr("x", 0)
      .attr("y", (d) => (d.type === "degree" ? 28 : 24))
      .attr("text-anchor", "middle")
      .attr("fill", "#e2e8f0")
      .attr("font-size", "11px")
      .attr("font-weight", "700")
      .text((d) => (d.title.length > 22 ? d.title.slice(0, 20) + "..." : d.title))
      .style("pointer-events", "none")
      .style("text-shadow", "0 2px 4px rgba(0,0,0,0.9)");

    // Node Hover & Click Handlers
    node
      .on("mouseover", function (event, d) {
        d3.select(this).select("circle:nth-child(2)").transition().duration(200).attr("r", (d: any) => (d.type === "degree" ? 20 : 16));
        d3.select(this).select("circle:first-child").transition().duration(200).attr("stroke-opacity", 0.9);
      })
      .on("mouseout", function (event, d) {
        d3.select(this).select("circle:nth-child(2)").transition().duration(200).attr("r", (d: any) => (d.type === "degree" ? 16 : d.type === "note" ? 12 : 14));
        d3.select(this).select("circle:first-child").transition().duration(200).attr("stroke-opacity", 0.35);
      })
      .on("click", (event, d) => {
        setSelectedNode(d);
      });

    // Simulation Tick Listener
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag Helper Functions
    function dragstarted(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: GraphNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [filteredNodes, filteredLinks, chargeStrength, linkDistance]);

  const getNodeColor = (type: GraphNode["type"]) => {
    switch (type) {
      case "paper":
        return "#22d3ee"; // Cyan
      case "module":
        return "#34d399"; // Emerald
      case "note":
        return "#a855f7"; // Purple (Obsidian Note)
      case "degree":
      default:
        return "#f59e0b"; // Amber
    }
  };

  return (
    <div className={`space-y-4 ${isFullscreen ? "fixed inset-0 z-50 p-6 bg-[#030b10] overflow-hidden" : ""}`}>
      {/* Top Header & Interactive Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#08151c]/90 border border-[#143242] backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
            <Network className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              D3 Interactive Knowledge Matrix Graph
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
                {filteredNodes.length} Nodes • {filteredLinks.length} Connections
              </span>
            </h3>
            <p className="text-[11px] text-[#73A5AD]">
              Force-directed vector graph linking academic preprints, course modules, and personal Obsidian lab journal notes.
            </p>
          </div>
        </div>

        {/* Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Filter */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#73A5AD] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Highlight graph nodes..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#030b10] border border-[#143242] text-xs text-white placeholder-[#5e8292] focus:outline-none focus:border-cyan-400 transition-all w-48"
            />
          </div>

          {/* Node Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-[#030b10] border border-[#143242] text-xs text-[#73A5AD] focus:text-white focus:outline-none focus:border-cyan-400 transition-all"
          >
            <option value="all">All Node Types</option>
            <option value="paper">📄 Research Papers</option>
            <option value="module">🎓 Academic Modules</option>
            <option value="note">📓 Lab Journal Notes</option>
            <option value="degree">🏛️ Degree Pathways</option>
          </select>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-[#030b10] border border-[#143242] text-[#73A5AD] hover:text-white hover:border-cyan-500/40 transition-all"
            title="Toggle Fullscreen Canvas"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Graph Canvas Container */}
      <div
        ref={containerRef}
        className="relative w-full h-[560px] rounded-3xl bg-[#030b10] border border-[#143242] overflow-hidden flex items-center justify-center shadow-inner group"
      >
        {/* SVG Force Layout */}
        <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Legend Overlay */}
        <div className="absolute top-4 left-4 p-3 rounded-2xl bg-[#08151c]/90 backdrop-blur-md border border-[#143242] text-[11px] space-y-1.5 shadow-xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#73A5AD] mb-1">
            Graph Topology
          </div>
          <div className="flex items-center gap-2 text-cyan-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
            <span>Research Papers ({nodes.filter((n) => n.type === "paper").length})</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
            <span>Academic Modules ({nodes.filter((n) => n.type === "module").length})</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
            <span>Personal Lab Notes ({nodes.filter((n) => n.type === "note").length})</span>
          </div>
          <div className="flex items-center gap-2 text-cyan-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
            <span>Degree Tracks ({nodes.filter((n) => n.type === "degree").length})</span>
          </div>
        </div>

        {/* Instructions Overlay */}
        <div className="absolute bottom-4 left-4 p-3 rounded-2xl bg-[#08151c]/90 backdrop-blur-md border border-[#143242] text-[10px] text-[#73A5AD] flex items-center gap-2 shadow-xl">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Click any node to inspect details • Scroll to zoom • Drag nodes to reposition</span>
        </div>

        {/* Selected Node Inspector Drawer / Modal */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-80 max-h-[500px] overflow-y-auto p-5 rounded-3xl bg-[#08151c]/95 border border-cyan-500/40 backdrop-blur-xl text-white space-y-4 shadow-2xl animate-fade-in z-20">
            <div className="flex items-start justify-between gap-2 border-b border-[#143242] pb-3">
              <div className="space-y-1">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${getNodeColor(selectedNode.type)}20`,
                    borderColor: `${getNodeColor(selectedNode.type)}50`,
                    color: getNodeColor(selectedNode.type),
                  }}
                >
                  {selectedNode.type === "paper"
                    ? "Research Publication"
                    : selectedNode.type === "module"
                    ? "Academic Course Module"
                    : selectedNode.type === "note"
                    ? "Personal Lab Journal Note"
                    : "Degree Track"}
                </span>
                <h4 className="font-extrabold text-sm text-white leading-snug">
                  {selectedNode.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-[#73A5AD] hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-[#73A5AD] flex items-center justify-between">
                <span>Topic:</span>
                <span className="text-cyan-300 font-semibold">{selectedNode.topic}</span>
              </div>
              {selectedNode.author && (
                <div className="text-[#73A5AD] flex items-center justify-between">
                  <span>Author / Source:</span>
                  <span className="text-white font-medium">{selectedNode.author}</span>
                </div>
              )}
              {selectedNode.date && (
                <div className="text-[#73A5AD] flex items-center justify-between">
                  <span>Published / Saved:</span>
                  <span className="text-white font-mono">{selectedNode.date}</span>
                </div>
              )}
            </div>

            {/* Snippet Preview */}
            <div className="p-3 rounded-2xl bg-[#030b10] border border-[#143242] text-xs text-[#73A5AD] leading-relaxed">
              {selectedNode.snippet}
            </div>

            {/* Tags */}
            {selectedNode.tags && selectedNode.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-[#0c1a24] border border-[#1b3b4a] text-[10px] text-cyan-300/80 font-mono"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Direct Open Action Button */}
            <div className="pt-2">
              {selectedNode.originalDoc && (
                <button
                  onClick={() => {
                    onSelectDocument?.(selectedNode.originalDoc!);
                    setSelectedNode(null);
                  }}
                  className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Open Full Document</span>
                </button>
              )}

              {selectedNode.originalNote && (
                <button
                  onClick={() => {
                    onSelectNote?.(selectedNode.originalNote!);
                    setSelectedNode(null);
                  }}
                  className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-600/20"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Open Lab Note in Obsidian Vault</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
