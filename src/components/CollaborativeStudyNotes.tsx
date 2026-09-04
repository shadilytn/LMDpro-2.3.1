import React from "react";
import * as Y from "yjs";
import { db } from "../services/firebase";
import { doc as firestoreDoc, onSnapshot, setDoc } from "firebase/firestore";
import { UserProfile } from "../shared/types";
import { ObsidianNotesEngine } from "./ObsidianNotesEngine";
import {
  Sparkles,
  Users,
  Copy,
  Check,
  FileText,
  Download,
  ShieldCheck,
  Zap,
  RefreshCw,
  Clock,
  Code2,
  BookOpen,
  Network,
} from "lucide-react";

interface CollaborativeStudyNotesProps {
  roomId: string;
  roomTitle: string;
  courseCode: string;
  topic: string;
  user?: UserProfile;
}

export const CollaborativeStudyNotes: React.FC<
  CollaborativeStudyNotesProps
> = ({ roomId, roomTitle, courseCode, topic, user }) => {
  const [content, setContent] = React.useState<string>("");
  const [copied, setCopied] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [crdtUpdateCount, setCrdtUpdateCount] = React.useState(0);
  const [activeEditors, setActiveEditors] = React.useState<number>(1);
  const [lastSyncedTime, setLastSyncedTime] = React.useState<string>("Just now");
  const [exportSaved, setExportSaved] = React.useState(false);
  const [noteEngineMode, setNoteEngineMode] = React.useState<"crdt" | "obsidian">("crdt");

  // References for Yjs CRDT Doc & Shared Text
  const ydocRef = React.useRef<Y.Doc | null>(null);
  const ytextRef = React.useRef<Y.Text | null>(null);
  const isApplyingRemoteRef = React.useRef<boolean>(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Initialize Yjs Document for this Room
  React.useEffect(() => {
    // 1. Instantiate new Yjs CRDT Document
    const ydoc = new Y.Doc();
    const ytext = ydoc.getText("collaborative_notes");
    ydocRef.current = ydoc;
    ytextRef.current = ytext;

    // Default template text if empty
    const defaultText = `# Collaborative Study Notes: ${roomTitle}
Course: ${courseCode}
Topic: ${topic}

## 1. Key Concepts & Principles
- Consensus safety invariant: At most one leader per term.
- Log Matching Property: If two logs contain an entry with same index and term, they are identical up to that index.
- Quorum calculation: Q = floor(N/2) + 1.

## 2. Participant Observations & Questions
- Scholar (${user?.name || "Alex"}): Reviewing term boundary transitions.
- Socratic AI: Log entries are committed when replicated on a majority of servers.

## 3. Real-Time CRDT Scratchpad
Start typing shared notes here with your room peers...`;

    // Initialize Yjs shared text with default template if blank
    if (ytext.toString().length === 0) {
      ytext.insert(0, defaultText);
      setContent(defaultText);
    } else {
      setContent(ytext.toString());
    }

    // 2. Yjs Text Observer: Sync local React state whenever Yjs text changes
    const textObserver = () => {
      if (ytextRef.current) {
        setContent(ytextRef.current.toString());
      }
    };
    ytext.observe(textObserver);

    // 3. Yjs Document Update Event Listener: Broadcast CRDT state update to Firestore
    const updateHandler = (update: Uint8Array, origin: any) => {
      setCrdtUpdateCount((prev) => prev + 1);

      // Ignore updates originated from remote Firestore sync to avoid infinite loop
      if (origin === "firestore-sync") return;

      setIsSyncing(true);

      try {
        // Encode state vector / full doc update to base64 for persistent Firestore storage
        const encodedUpdate = Y.encodeStateAsUpdate(ydoc);
        const base64Update = btoa(String.fromCharCode(...encodedUpdate));

        const crdtRef = firestoreDoc(
          db,
          "study_rooms",
          roomId,
          "crdt",
          "shared_notes",
        );
        setDoc(
          crdtRef,
          {
            encodedState: base64Update,
            updatedBy: user?.name || "Scholar",
            updatedAt: new Date().toISOString(),
            textSnippet: ytext.toString().slice(0, 200),
          },
          { merge: true },
        )
          .then(() => {
            setIsSyncing(false);
            setLastSyncedTime(
              new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
            );
          })
          .catch((err) => {
            console.warn(
              "[Yjs CRDT] Firestore sync fallback to local CRDT engine:",
              err,
            );
            setIsSyncing(false);
          });
      } catch (err) {
        console.warn("[Yjs CRDT] Update encoding error:", err);
        setIsSyncing(false);
      }
    };

    ydoc.on("update", updateHandler);

    // 4. Firestore Real-Time Subscription to receive CRDT remote updates from other students
    let unsubscribeFirestore: (() => void) | null = null;
    try {
      const crdtRef = firestoreDoc(
        db,
        "study_rooms",
        roomId,
        "crdt",
        "shared_notes",
      );
      unsubscribeFirestore = onSnapshot(crdtRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.encodedState && ydocRef.current) {
            try {
              const binaryStr = atob(data.encodedState);
              const bytes = new Uint8Array(binaryStr.length);
              for (let i = 0; i < binaryStr.length; i++) {
                bytes[i] = binaryStr.charCodeAt(i);
              }
              // Apply Yjs CRDT update with 'firestore-sync' origin tag
              isApplyingRemoteRef.current = true;
              Y.applyUpdate(ydocRef.current, bytes, "firestore-sync");
              isApplyingRemoteRef.current = false;
              setContent(ytext.toString());
              setLastSyncedTime(
                new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              );
            } catch (e) {
              console.warn(
                "[Yjs CRDT] Error merging remote CRDT update blob:",
                e,
              );
            }
          }
        }
      });
    } catch (e) {
      console.warn("[Yjs CRDT] Firestore snapshot subscription disabled:", e);
    }

    // Active peer presence simulation
    setActiveEditors(Math.floor(Math.random() * 3) + 2);

    return () => {
      ytext.unobserve(textObserver);
      ydoc.off("update", updateHandler);
      if (unsubscribeFirestore) unsubscribeFirestore();
      ydoc.destroy();
    };
  }, [roomId]);

  // Handle local text edits and calculate string diffs for Yjs CRDT
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    const oldText = content;
    setContent(newText);

    if (!ytextRef.current || isApplyingRemoteRef.current) return;

    const ytext = ytextRef.current;

    // Find common prefix length
    let commonPrefix = 0;
    while (
      commonPrefix < oldText.length &&
      commonPrefix < newText.length &&
      oldText[commonPrefix] === newText[commonPrefix]
    ) {
      commonPrefix++;
    }

    // Find common suffix length
    let commonSuffix = 0;
    while (
      commonSuffix < oldText.length - commonPrefix &&
      commonSuffix < newText.length - commonPrefix &&
      oldText[oldText.length - 1 - commonSuffix] ===
        newText[newText.length - 1 - commonSuffix]
    ) {
      commonSuffix++;
    }

    const deletedLength = oldText.length - commonPrefix - commonSuffix;
    const insertedText = newText.slice(
      commonPrefix,
      newText.length - commonSuffix,
    );

    // Apply CRDT operation on Yjs Shared Text
    ydocRef.current?.transact(() => {
      if (deletedLength > 0) {
        ytext.delete(commonPrefix, deletedLength);
      }
      if (insertedText.length > 0) {
        ytext.insert(commonPrefix, insertedText);
      }
    }, "local-user-input");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToWorkspace = () => {
    try {
      const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${courseCode}_Study_Notes_${roomId}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportSaved(true);
      setTimeout(() => setExportSaved(false), 2500);
    } catch (err) {
      console.error("Failed to export notes:", err);
    }
  };

  const handleInsertSocraticSummary = () => {
    if (!ytextRef.current || !ydocRef.current) return;

    const summaryBlock = `\n\n### 🤖 Socratic AI Auto-Summary (${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})\n- Key Consensus Concept: Raft maintains state safety via strict term monotonic incrementing.\n- Room Action Item: Practice computing quorum boundaries for odd vs even node clusters.\n`;

    ydocRef.current.transact(() => {
      ytextRef.current?.insert(ytextRef.current.length, summaryBlock);
    });
  };

  return (
    <div className="space-y-4 py-2">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between p-2 rounded-2xl bg-[#08151c] border border-[#1b3b4a]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setNoteEngineMode("crdt")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              noteEngineMode === "crdt"
                ? "bg-cyan-500 text-slate-950 font-black shadow-md"
                : "text-[#789cae] hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Realtime CRDT Pad</span>
          </button>

          <button
            onClick={() => setNoteEngineMode("obsidian")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              noteEngineMode === "obsidian"
                ? "bg-gradient-to-r from-cyan-500 to-cyan-500 text-white font-black shadow-md"
                : "text-[#789cae] hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Obsidian Knowledge Vault & Graph</span>
          </button>
        </div>

        <span className="text-[10px] text-cyan-400 font-mono hidden sm:inline">
          Room Context: {courseCode} - {topic}
        </span>
      </div>

      {/* OBSIDIAN ENGINE MODE */}
      {noteEngineMode === "obsidian" ? (
        <ObsidianNotesEngine courseContext={`${courseCode}: ${topic}`} />
      ) : (
        /* REALTIME CRDT MODE */
        <div className="space-y-4">
          {/* Real-Time CRDT Header Bar */}
          <div className="p-4 rounded-2xl bg-[#091822] border border-[#1a384a] flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Zap className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white">
                Yjs CRDT Collaborative Notes
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                Conflict-Free Sync
              </span>
            </div>
            <p className="text-[11px] text-[#789cae] mt-0.5">
              Multi-user state vector synced in real-time across all study room
              scholars.
            </p>
          </div>
        </div>

        {/* Status Indicators & Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-[#0d222f] border border-[#1b3e52] text-[11px] text-[#86a8b8] flex items-center gap-2 font-mono">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>{activeEditors} Co-Authors Online</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-[#0d222f] border border-[#1b3e52] text-[11px] text-[#86a8b8] flex items-center gap-2 font-mono">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Updates: {crdtUpdateCount}</span>
            {isSyncing && (
              <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" />
            )}
          </div>

          <button
            onClick={handleInsertSocraticSummary}
            className="px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-200 text-xs font-bold transition-all flex items-center gap-1.5"
            title="Inject AI Socratic Summary into CRDT Document"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Inject AI Summary</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-[#122b39] hover:bg-[#183648] border border-[#20465c] text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          <button
            onClick={handleSaveToWorkspace}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-black text-xs shadow-md hover:from-cyan-400 hover:to-cyan-300 transition-all flex items-center gap-1.5"
          >
            {exportSaved ? (
              <Check className="w-3.5 h-3.5 text-slate-950" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{exportSaved ? "Saved to Workspace" : "Export Notes"}</span>
          </button>
        </div>
      </div>

      {/* Editor Box */}
      <div className="relative rounded-2xl bg-[#061117] border border-[#193648] p-4 shadow-2xl space-y-2">
        <div className="flex items-center justify-between text-[11px] text-[#6d90a1] border-b border-[#142a38] pb-2 font-mono">
          <div className="flex items-center gap-2">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Document ID:{" "}
              <strong className="text-white">{roomId}_notes</strong>
            </span>
          </div>
          <span>Last CRDT State Merge: {lastSyncedTime}</span>
        </div>

        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleTextChange}
          rows={14}
          placeholder="Type collaborative notes here..."
          className="w-full bg-transparent text-cyan-100 font-mono text-xs leading-relaxed focus:outline-none resize-y min-h-[280px]"
        />
      </div>
    </div>
  )}
</div>
  );
};
