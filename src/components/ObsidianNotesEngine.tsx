import React from "react";
import {
  FileText,
  Network,
  Plus,
  Search,
  Trash2,
  Tag,
  Link,
  Sparkles,
  Download,
  Copy,
  Check,
  Eye,
  Edit3,
  ExternalLink,
  BookOpen,
  Folder,
  Layers,
  Zap,
  ZoomIn,
  ZoomOut,
  Maximize2,
  HelpCircle,
} from "lucide-react";
import { ApiService } from "../shared/api.service";

export interface ObsidianNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  folder?: string;
  createdAt: string;
  updatedAt: string;
}

interface ObsidianNotesEngineProps {
  initialNotes?: ObsidianNote[];
  onNoteSelect?: (note: ObsidianNote) => void;
  courseContext?: string;
}

export const ObsidianNotesEngine: React.FC<ObsidianNotesEngineProps> = ({
  initialNotes,
  courseContext,
}) => {
  // Default Sample Vault
  const [notes, setNotes] = React.useState<ObsidianNote[]>(() => {
    const saved = localStorage.getItem("lmdpro_obsidian_vault");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn("Failed to parse obsidian vault:", e);
      }
    }
    return initialNotes || [
      {
        id: "note-1",
        title: "Distributed Consensus & Raft",
        content: `# Distributed Consensus & Raft
Course: [[CS101 Distributed Systems]]
Tags: #consensus #raft #fault-tolerance

## Overview
Raft is a consensus algorithm designed to be understandable. It decomposes consensus into 3 key subproblems:
1. Leader Election
2. Log Replication
3. [[Safety Invariants]]

> [!NOTE]
> Quorum Size: $Q = \\lfloor N/2 \\rfloor + 1$.
> For $N=5$ nodes, $Q=3$.

Related Concepts: [[Paxos Algorithm]], [[State Machine Replication]], [[Byzantine Fault Tolerance]].`,
        tags: ["consensus", "raft", "fault-tolerance"],
        folder: "Computer Science",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "note-2",
        title: "CS101 Distributed Systems",
        content: `# CS101 Distributed Systems
Course Master Index
Tags: #cs101 #index #curriculum

## Core Modules
- Module 1: Time, Clocks & Ordering
- Module 2: [[Distributed Consensus & Raft]]
- Module 3: [[Paxos Algorithm]]
- Module 4: [[Byzantine Fault Tolerance]]

Key textbook: [[State Machine Replication]] foundations.`,
        tags: ["cs101", "index", "curriculum"],
        folder: "Computer Science",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "note-3",
        title: "Paxos Algorithm",
        content: `# Paxos Algorithm
Tags: #paxos #consensus #theory

## Key Differences vs [[Distributed Consensus & Raft]]
- Paxos allows out-of-order log entries filled later with no-ops.
- Raft enforces strictly sequential in-order logs.
- Both preserve [[Safety Invariants]] across quorum majorities.`,
        tags: ["paxos", "consensus", "theory"],
        folder: "Computer Science",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "note-4",
        title: "Safety Invariants",
        content: `# Safety Invariants
Tags: #invariants #proofs #safety

## Properties
- Election Safety: At most one leader elected per term.
- Leader Append-Only: Leader never overwrites or truncates its own log.
- Log Matching: If two logs contain an entry with same index and term, they are identical.

Referenced in [[Distributed Consensus & Raft]] and [[Paxos Algorithm]].`,
        tags: ["invariants", "proofs", "safety"],
        folder: "Theory",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "note-5",
        title: "Byzantine Fault Tolerance",
        content: `# Byzantine Fault Tolerance (BFT)
Tags: #bft #security #cryptography

BFT accounts for arbitrary or malicious node failures (e.g., PBFT, Tendermint).
Requires $3f + 1$ total nodes to tolerate $f$ Byzantine faulty nodes.

Compare with crash fault-tolerant algorithms like [[Distributed Consensus & Raft]] and [[Paxos Algorithm]].`,
        tags: ["bft", "security", "cryptography"],
        folder: "Security",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  });

  const [activeNoteId, setActiveNoteId] = React.useState<string>(notes[0]?.id || "");
  const [viewMode, setViewMode] = React.useState<"editor" | "preview" | "split" | "graph">("split");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = React.useState<string | null>(null);
  const [showAutoLinkLoader, setShowAutoLinkLoader] = React.useState(false);
  const [copiedLink, setCopiedLink] = React.useState(false);

  // Wikilink Autocomplete State
  const [showWikilinkSuggest, setShowWikilinkSuggest] = React.useState(false);
  const [wikilinkFilter, setWikilinkFilter] = React.useState("");
  const [cursorPos, setCursorPos] = React.useState(0);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Graph Canvas Zoom/Pan State
  const [graphZoom, setGraphZoom] = React.useState(1);
  const [graphHovecyanNode, setGraphHovecyanNode] = React.useState<string | null>(null);

  // Active note object
  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  // Persist notes to localStorage
  React.useEffect(() => {
    localStorage.setItem("lmdpro_obsidian_vault", JSON.stringify(notes));
  }, [notes]);

  // Extract all unique tags across notes
  const allTags = Array.from(
    new Set(
      notes.flatMap((n) => {
        const hashTags = (n.content.match(/#[a-zA-Z0-9_-]+/g) || []).map((t) =>
          t.replace("#", "")
        );
        return [...n.tags, ...hashTags];
      })
    )
  );

  // Extract unique folders
  const allFolders = Array.from(
    new Set(notes.map((n) => n.folder || "General").filter(Boolean))
  );

  // Extract Wikilinks from content: [[Note Title]]
  const extractWikilinks = (content: string): string[] => {
    const matches = content.match(/\[\[(.*?)\]\]/g) || [];
    return matches.map((m) => m.slice(2, -2).trim());
  };

  // Compute backlinks: Notes that link TO the active note
  const getBacklinks = (targetNoteTitle: string): ObsidianNote[] => {
    if (!targetNoteTitle) return [];
    return notes.filter((n) => {
      if (n.title.toLowerCase() === targetNoteTitle.toLowerCase()) return false;
      const links = extractWikilinks(n.content);
      return links.some((l) => l.toLowerCase() === targetNoteTitle.toLowerCase());
    });
  };

  const backlinks = activeNote ? getBacklinks(activeNote.title) : [];

  // Handle creating a new note
  const handleCreateNote = () => {
    const newNote: ObsidianNote = {
      id: `note-${Date.now()}`,
      title: `Untitled Note ${notes.length + 1}`,
      content: `# Untitled Note ${notes.length + 1}\n\nStart typing with [[Wikilinks]] or #tags...`,
      tags: ["general"],
      folder: selectedFolder || "General",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  };

  // Delete note
  const handleDeleteNote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (notes.length <= 1) {
      alert("Vault must contain at least one note.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this note?")) {
      const remaining = notes.filter((n) => n.id !== id);
      setNotes(remaining);
      if (activeNoteId === id) {
        setActiveNoteId(remaining[0].id);
      }
    }
  };

  // Update active note title/content
  const handleUpdateNote = (field: "title" | "content" | "folder", value: string) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === activeNoteId) {
          const updated = {
            ...n,
            [field]: value,
            updatedAt: new Date().toISOString(),
          };
          if (field === "content") {
            const parsedTags = (value.match(/#[a-zA-Z0-9_-]+/g) || []).map((t) =>
              t.replace("#", "")
            );
            updated.tags = Array.from(new Set([...n.tags, ...parsedTags]));
          }
          return updated;
        }
        return n;
      })
    );
  };

  // Navigate to or auto-create note from a wikilink
  const handleNavigateWikilink = (linkTitle: string) => {
    const found = notes.find(
      (n) => n.title.toLowerCase() === linkTitle.toLowerCase()
    );
    if (found) {
      setActiveNoteId(found.id);
    } else {
      // Auto-create missing note!
      if (
        window.confirm(
          `Note "[[${linkTitle}]]" does not exist yet. Create it now?`
        )
      ) {
        const newNote: ObsidianNote = {
          id: `note-${Date.now()}`,
          title: linkTitle,
          content: `# ${linkTitle}\n\nAuto-created from [[${activeNote?.title}]].\n\nTags: #concept #linked`,
          tags: ["concept"],
          folder: activeNote?.folder || "General",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setNotes((prev) => [newNote, ...prev]);
        setActiveNoteId(newNote.id);
      }
    }
  };

  // Handle textarea typing & wikilink triggers
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const pos = e.target.selectionStart;
    setCursorPos(pos);
    handleUpdateNote("content", val);

    // Check if typing [[
    const beforeCursor = val.slice(0, pos);
    const wikilinkMatch = beforeCursor.match(/\[\[([^[\]]*)$/);
    if (wikilinkMatch) {
      setShowWikilinkSuggest(true);
      setWikilinkFilter(wikilinkMatch[1]);
    } else {
      setShowWikilinkSuggest(false);
    }
  };

  // Insert selected wikilink into content
  const insertWikilink = (targetTitle: string) => {
    if (!textareaRef.current || !activeNote) return;
    const val = activeNote.content;
    const beforeCursor = val.slice(0, cursorPos);
    const afterCursor = val.slice(cursorPos);

    const lastBracketsIdx = beforeCursor.lastIndexOf("[[");
    if (lastBracketsIdx !== -1) {
      const newBefore = beforeCursor.slice(0, lastBracketsIdx) + `[[${targetTitle}]]`;
      const updatedContent = newBefore + afterCursor;
      handleUpdateNote("content", updatedContent);
    }
    setShowWikilinkSuggest(false);
  };

  // AI Auto-Link Notes Feature
  const handleAIAutoLink = async () => {
    if (!activeNote) return;
    setShowAutoLinkLoader(true);
    try {
      const allTitles = notes.map((n) => n.title);
      const prompt = `Given this note text:\n"${activeNote.content}"\n\nAnd these available note titles in the vault:\n${JSON.stringify(
        allTitles
      )}\n\nIdentify key terms in the text that match any of the titles or relevant concepts and return the text with appropriate [[Note Title]] wikilinks inserted. Return ONLY the enhanced markdown text.`;

      const enhancedText = await ApiService.queryAITutor(
        prompt,
        "Obsidian Wikilink Auto-Linker"
      );
      if (enhancedText && enhancedText.trim().length > 10) {
        handleUpdateNote("content", enhancedText.trim());
      }
    } catch (e) {
      console.warn("AI Auto link error:", e);
    } finally {
      setShowAutoLinkLoader(false);
    }
  };

  // Render Markdown Text into Interactive HTML with Wikilinks
  const renderMarkdownWithWikilinks = (text: string) => {
    if (!text) return null;

    // Split text by lines
    const lines = text.split("\n");

    return lines.map((line, lIdx) => {
      // Heading level 1-3
      if (line.startsWith("# ")) {
        return (
          <h1 key={lIdx} className="text-xl font-extrabold text-white my-3 border-b border-[#1f3f52] pb-1">
            {renderLineWithWikilinks(line.replace("# ", ""))}
          </h1>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={lIdx} className="text-base font-bold text-cyan-300 my-2.5">
            {renderLineWithWikilinks(line.replace("## ", ""))}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={lIdx} className="text-sm font-semibold text-cyan-300 my-2">
            {renderLineWithWikilinks(line.replace("### ", ""))}
          </h3>
        );
      }
      // Callout box (> [!NOTE])
      if (line.startsWith("> [!")) {
        const calloutType = line.match(/> \[!(.*?)\]/)?.[1] || "NOTE";
        return (
          <div
            key={lIdx}
            className="my-3 p-3 rounded-xl bg-cyan-950/40 border-l-4 border-cyan-400 text-xs text-cyan-200 space-y-1"
          >
            <span className="font-bold uppercase tracking-wider text-[10px] text-cyan-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {calloutType}
            </span>
            <div>{renderLineWithWikilinks(line.replace(/> \[!(.*?)\]/, ""))}</div>
          </div>
        );
      }
      // Bullet items
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        return (
          <li key={lIdx} className="ml-4 text-xs text-gray-200 my-1 list-disc">
            {renderLineWithWikilinks(line.trim().slice(2))}
          </li>
        );
      }
      // Empty line
      if (line.trim() === "") {
        return <div key={lIdx} className="h-2" />;
      }
      // Paragraph
      return (
        <p key={lIdx} className="text-xs text-gray-300 leading-relaxed my-1.5">
          {renderLineWithWikilinks(line)}
        </p>
      );
    });
  };

  // Process a string line to parse [[Wikilinks]] and #tags into clickable React nodes
  const renderLineWithWikilinks = (line: string) => {
    const parts: (string | React.ReactNode)[] = [];
    const regex = /\[\[(.*?)\]\]|#([a-zA-Z0-9_-]+)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index));
      }

      if (match[1]) {
        // [[Wikilink]]
        const title = match[1];
        const exists = notes.some(
          (n) => n.title.toLowerCase() === title.toLowerCase()
        );
        parts.push(
          <button
            key={`wiki-${match.index}`}
            onClick={() => handleNavigateWikilink(title)}
            className={`inline-flex items-center gap-1 px-2 py-0.5 mx-0.5 rounded-lg text-[11px] font-mono font-bold transition-all shadow-sm ${
              exists
                ? "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 hover:scale-105"
                : "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 border-dashed"
            }`}
            title={exists ? `Jump to note: ${title}` : `Note missing. Click to create: ${title}`}
          >
            <Link className="w-3 h-3 text-cyan-400 shrink-0" />
            <span>{title}</span>
          </button>
        );
      } else if (match[2]) {
        // #tag
        const tagName = match[2];
        parts.push(
          <span
            key={`tag-${match.index}`}
            onClick={() => setSelectedTag(tagName === selectedTag ? null : tagName)}
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 mx-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono cursor-pointer hover:bg-cyan-500/30"
          >
            <Tag className="w-2.5 h-2.5 text-cyan-400" />
            <span>#{tagName}</span>
          </span>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }

    return parts;
  };

  // Filter notes list
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? note.tags.includes(selectedTag) : true;
    const matchesFolder = selectedFolder ? note.folder === selectedFolder : true;
    return matchesSearch && matchesTag && matchesFolder;
  });

  // Calculate Graph Network Data for Canvas / SVG
  const graphNodes = notes.map((note, index) => {
    const angle = (index / notes.length) * 2 * Math.PI;
    const radius = 160;
    const cx = 350 + Math.cos(angle) * radius;
    const cy = 220 + Math.sin(angle) * radius;
    const backlinksCount = getBacklinks(note.title).length;
    const size = Math.max(16, 20 + backlinksCount * 6);
    return {
      ...note,
      x: cx,
      y: cy,
      size,
      linkCount: extractWikilinks(note.content).length + backlinksCount,
    };
  });

  const graphEdges: { from: string; to: string; fromX: number; fromY: number; toX: number; toY: number }[] = [];
  graphNodes.forEach((node) => {
    const outgoing = extractWikilinks(node.content);
    outgoing.forEach((targetTitle) => {
      const targetNode = graphNodes.find(
        (gn) => gn.title.toLowerCase() === targetTitle.toLowerCase()
      );
      if (targetNode) {
        graphEdges.push({
          from: node.id,
          to: targetNode.id,
          fromX: node.x,
          fromY: node.y,
          toX: targetNode.x,
          toY: targetNode.y,
        });
      }
    });
  });

  return (
    <div className="bg-[#08151c] border border-[#1b3b4a] rounded-3xl p-5 md:p-6 text-white space-y-6 shadow-2xl overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#183646] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Obsidian Knowledge Vault
            </span>
            <span className="text-[11px] text-[#7ea1b2]">
              Bi-directional [[Wikilinks]], #Tags & Interactive Knowledge Graph View
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2">
            <span>Obsidian Personal Knowledge Management (PKM)</span>
          </h2>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#051117] p-1 rounded-2xl border border-[#183848]">
            <button
              onClick={() => setViewMode("split")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === "split"
                  ? "bg-cyan-500 text-slate-950 shadow-md font-black"
                  : "text-[#82a3b2] hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Split View</span>
            </button>

            <button
              onClick={() => setViewMode("editor")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === "editor"
                  ? "bg-cyan-500 text-slate-950 shadow-md font-black"
                  : "text-[#82a3b2] hover:text-white"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editor Only</span>
            </button>

            <button
              onClick={() => setViewMode("preview")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === "preview"
                  ? "bg-cyan-500 text-slate-950 shadow-md font-black"
                  : "text-[#82a3b2] hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>

            <button
              onClick={() => setViewMode("graph")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === "graph"
                  ? "bg-gradient-to-r from-cyan-500 to-cyan-500 text-white shadow-md font-black"
                  : "text-[#82a3b2] hover:text-white"
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Knowledge Graph</span>
            </button>
          </div>

          <button
            onClick={handleCreateNote}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Main Obsidian Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Vault Directory & Tags */}
        <div className="lg:col-span-3 space-y-4 bg-[#051117] p-4 rounded-2xl border border-[#163646] h-fit">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#5f8496] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vault notes..."
              className="w-full bg-[#08151c] border border-[#1b3d4f] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#5f8496] focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Folder Category Selectors */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-[#7ea1b2] uppercase tracking-wider flex items-center justify-between px-1">
              <span>Folders</span>
              <button
                onClick={() => setSelectedFolder(null)}
                className="text-cyan-400 hover:underline text-[9px]"
              >
                Clear Filter
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {allFolders.map((folder) => (
                <button
                  key={folder}
                  onClick={() =>
                    setSelectedFolder(selectedFolder === folder ? null : folder)
                  }
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-all ${
                    selectedFolder === folder
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "bg-[#08151c] text-[#7ea1b2] hover:text-white border border-[#163646]"
                  }`}
                >
                  <Folder className="w-3 h-3 text-cyan-400" />
                  <span>{folder}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags Cloud Filter */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-[#7ea1b2] uppercase tracking-wider flex items-center justify-between px-1">
              <span>Tags ({allTags.length})</span>
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-cyan-400 hover:underline text-[9px]"
                >
                  Clear #{selectedTag}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition-all ${
                    selectedTag === tag
                      ? "bg-cyan-500 text-white font-bold"
                      : "bg-[#08151c] text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Notes List */}
          <div className="space-y-2 pt-2 border-t border-[#143140]">
            <div className="text-[10px] font-bold text-[#7ea1b2] uppercase tracking-wider px-1 flex items-center justify-between">
              <span>Vault Notes ({filteredNotes.length})</span>
            </div>

            <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
              {filteredNotes.map((note) => {
                const isActive = note.id === activeNoteId;
                const linkCount = extractWikilinks(note.content).length;
                const backlinkCount = getBacklinks(note.title).length;

                return (
                  <div
                    key={note.id}
                    onClick={() => setActiveNoteId(note.id)}
                    className={`group p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-950/80 to-cyan-950/80 border-cyan-500/50 shadow-md"
                        : "bg-[#08151c] border border-[#163646] hover:border-[#1e485d] hover:bg-[#0c1f2a]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <FileText
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isActive ? "text-cyan-400" : "text-[#5a7d8e]"
                          }`}
                        />
                        <span
                          className={`text-xs font-bold truncate ${
                            isActive ? "text-cyan-200" : "text-gray-200"
                          }`}
                        >
                          {note.title}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleDeleteNote(note.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-cyan-400 transition-opacity"
                        title="Delete note"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-1 text-[10px] text-[#638797]">
                      <span className="truncate">{note.folder || "General"}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {linkCount > 0 && (
                          <span className="text-cyan-400 flex items-center gap-0.5">
                            <Link className="w-2.5 h-2.5" />
                            {linkCount}
                          </span>
                        )}
                        {backlinkCount > 0 && (
                          <span className="text-cyan-400 flex items-center gap-0.5">
                            <Layers className="w-2.5 h-2.5" />
                            {backlinkCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center / Main View Area */}
        <div className="lg:col-span-9 space-y-4">
          {/* GRAPH VIEW MODE */}
          {viewMode === "graph" ? (
            <div className="p-5 rounded-2xl bg-[#051117] border border-[#163646] space-y-4">
              <div className="flex items-center justify-between border-b border-[#163646] pb-3">
                <div className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Obsidian Interactive Knowledge Graph
                    </h3>
                    <p className="text-[11px] text-[#7ea1b2]">
                      Click nodes to open notes. Connections dynamically build from [[Wikilinks]].
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setGraphZoom((z) => Math.min(2, z + 0.2))}
                    className="p-1.5 rounded-lg bg-[#08151c] border border-[#1b3d4f] text-cyan-300 hover:text-white"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGraphZoom((z) => Math.max(0.5, z - 0.2))}
                    className="p-1.5 rounded-lg bg-[#08151c] border border-[#1b3d4f] text-cyan-300 hover:text-white"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGraphZoom(1)}
                    className="px-2.5 py-1 rounded-lg bg-[#08151c] border border-[#1b3d4f] text-xs font-bold text-gray-300"
                  >
                    Reset Zoom
                  </button>
                </div>
              </div>

              {/* Interactive Graph SVG Canvas */}
              <div className="relative w-full h-[450px] bg-[#030a0f] rounded-2xl border border-[#143140] overflow-hidden flex items-center justify-center">
                <svg
                  className="w-full h-full cursor-grab active:cursor-grabbing"
                  viewBox="0 0 700 440"
                  style={{ transform: `scale(${graphZoom})`, transition: "transform 0.2s ease" }}
                >
                  {/* Edges */}
                  {graphEdges.map((edge, idx) => (
                    <line
                      key={idx}
                      x1={edge.fromX}
                      y1={edge.fromY}
                      x2={edge.toX}
                      y2={edge.toY}
                      stroke="#22d3ee"
                      strokeWidth={1.5}
                      strokeOpacity={0.4}
                      strokeDasharray="4 2"
                    />
                  ))}

                  {/* Nodes */}
                  {graphNodes.map((node) => {
                    const isSelected = node.id === activeNoteId;
                    const isHovered = node.id === graphHovecyanNode;

                    return (
                      <g
                        key={node.id}
                        onClick={() => {
                          setActiveNoteId(node.id);
                          setViewMode("split");
                        }}
                        onMouseEnter={() => setGraphHovecyanNode(node.id)}
                        onMouseLeave={() => setGraphHovecyanNode(null)}
                        className="cursor-pointer group"
                      >
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.size}
                          fill={isSelected ? "#22d3ee" : isHovered ? "#a855f7" : "#0f374c"}
                          stroke={isSelected ? "#ffffff" : "#22d3ee"}
                          strokeWidth={isSelected ? 3 : 1.5}
                          className="transition-all duration-200 hover:scale-125"
                        />
                        <text
                          x={node.x}
                          y={node.y + node.size + 14}
                          textAnchor="middle"
                          fill={isSelected ? "#22d3ee" : "#e2e8f0"}
                          fontSize={11}
                          fontWeight={isSelected ? "bold" : "normal"}
                          className="pointer-events-none select-none font-sans"
                        >
                          {node.title}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Graph Legend Overlay */}
                <div className="absolute bottom-3 left-3 p-3 rounded-xl bg-[#08151c]/90 border border-[#1b3d4f] text-[10px] space-y-1 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <span className="text-gray-300">Active Note</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0f374c] border border-cyan-400" />
                    <span className="text-gray-300">Linked Note</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* EDITOR / PREVIEW / SPLIT MODE */
            <div className="space-y-4">
              {/* Note Metadata Header */}
              {activeNote && (
                <div className="p-4 rounded-2xl bg-[#051117] border border-[#163646] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <input
                      type="text"
                      value={activeNote.title}
                      onChange={(e) => handleUpdateNote("title", e.target.value)}
                      className="bg-transparent text-lg font-black text-white focus:outline-none focus:border-b focus:border-cyan-400 w-full md:w-1/2"
                      placeholder="Note Title..."
                    />

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleAIAutoLink}
                        disabled={showAutoLinkLoader}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                        title="Use AI to automatically insert [[Wikilinks]] to relevant vault notes"
                      >
                        {showAutoLinkLoader ? (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                        <span>AI Auto-Link Vault</span>
                      </button>
                    </div>
                  </div>

                  {/* Folder & Tags Bar */}
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 bg-[#08151c] px-2.5 py-1 rounded-xl border border-[#1b3d4f]">
                      <Folder className="w-3.5 h-3.5 text-cyan-400" />
                      <input
                        type="text"
                        value={activeNote.folder || "General"}
                        onChange={(e) => handleUpdateNote("folder", e.target.value)}
                        className="bg-transparent text-xs text-cyan-200 focus:outline-none w-24"
                        placeholder="Folder..."
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      {activeNote.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Editor & Preview Panes */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 min-h-[400px]">
                {/* Editor Pane */}
                {(viewMode === "editor" || viewMode === "split") && (
                  <div
                    className={`relative space-y-2 ${
                      viewMode === "split" ? "md:col-span-6" : "md:col-span-12"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-[#7ea1b2] px-1 font-bold">
                      <span>Markdown Editor</span>
                      <span className="text-[10px] text-cyan-400">
                        Tip: Type [[ to link notes, #tag for tags
                      </span>
                    </div>

                    <textarea
                      ref={textareaRef}
                      value={activeNote?.content || ""}
                      onChange={handleContentChange}
                      rows={16}
                      className="w-full p-4 rounded-2xl bg-[#051117] border border-[#163646] text-gray-200 font-mono text-xs leading-relaxed focus:outline-none focus:border-cyan-400 shadow-inner resize-y"
                      placeholder="Type your markdown study notes here..."
                    />

                    {/* Wikilink Auto-Complete Suggestions Dropdown */}
                    {showWikilinkSuggest && (
                      <div className="absolute left-6 bottom-12 z-20 w-64 bg-[#0c1a24] border border-[#1b3b4a] rounded-xl shadow-2xl p-2 space-y-1">
                        <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider px-2 py-1">
                          Link to Vault Note:
                        </div>
                        {notes
                          .filter((n) =>
                            n.title.toLowerCase().includes(wikilinkFilter.toLowerCase())
                          )
                          .slice(0, 5)
                          .map((n) => (
                            <button
                              key={n.id}
                              onClick={() => insertWikilink(n.title)}
                              className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-cyan-500/20 text-xs text-white flex items-center gap-2"
                            >
                              <Link className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span className="truncate">{n.title}</span>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Preview Pane */}
                {(viewMode === "preview" || viewMode === "split") && (
                  <div
                    className={`p-4 rounded-2xl bg-[#051117] border border-[#163646] space-y-3 overflow-y-auto max-h-[460px] ${
                      viewMode === "split" ? "md:col-span-6" : "md:col-span-12"
                    }`}
                  >
                    <div className="text-xs font-bold text-[#7ea1b2] border-b border-[#143140] pb-2 flex items-center justify-between">
                      <span>Live Markdown Preview</span>
                      <span className="text-[10px] text-cyan-400">
                        Interactive [[Wikilinks]] Active
                      </span>
                    </div>

                    <div className="space-y-1">
                      {activeNote ? (
                        renderMarkdownWithWikilinks(activeNote.content)
                      ) : (
                        <p className="text-xs text-gray-500">No active note selected.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Backlinks Inspector Panel */}
              <div className="p-4 rounded-2xl bg-[#051117] border border-[#163646] space-y-3">
                <div className="flex items-center justify-between border-b border-[#143140] pb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Backlinks Inspector ({backlinks.length})
                    </h4>
                  </div>
                  <span className="text-[10px] text-[#7ea1b2]">
                    Notes referencing [[{activeNote?.title}]]
                  </span>
                </div>

                {backlinks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {backlinks.map((blNote) => (
                      <div
                        key={blNote.id}
                        onClick={() => setActiveNoteId(blNote.id)}
                        className="p-3 rounded-xl bg-[#08151c] border border-[#1b3d4f] hover:border-cyan-500/50 cursor-pointer space-y-1 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-cyan-300">
                            {blNote.title}
                          </span>
                          <span className="text-[9px] text-[#638797]">
                            {blNote.folder}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 line-clamp-2">
                          {blNote.content.replace(/[#*_`]/g, "")}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-xs text-gray-500 italic">
                    No backlinks found linking to [[{activeNote?.title}]]. Mention this note in another note using [[{activeNote?.title}]]!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
