import React from "react";
import {
  Users,
  Mic,
  MicOff,
  Volume2,
  Send,
  Plus,
  Sparkles,
  Code2,
  Radio,
  BookOpen,
  PhoneOff,
  Video,
  ExternalLink,
} from "lucide-react";
import { UserProfile } from "../shared/types";
import { db, getAccessToken, googleSignIn } from "../services/firebase";
import { WorkspaceService } from "../shared/workspace.service";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { CollaborativeStudyNotes } from "./CollaborativeStudyNotes";
import { CollaborativeWhiteboard } from "./CollaborativeWhiteboard";
import { SynchronizedContentViewer } from "./SynchronizedContentViewer";

interface StudyRoomMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  senderRole: string;
  text: string;
  timestamp: string;
  isAiAgent?: boolean;
  codeSnippet?: string;
}

interface RoomParticipant {
  id: string;
  name: string;
  avatar: string;
  role: string;
  isSpeaking: boolean;
  isMuted: boolean;
  activeTopic?: string;
}

interface StudyRoom {
  id: string;
  title: string;
  courseCode: string;
  moduleName: string;
  participantCount: number;
  activeVoiceUsers: number;
  tags: string[];
  description: string;
  topic: string;
}

const DEFAULT_ROOMS: StudyRoom[] = [
  {
    id: "room_cs101",
    title: "Distributed Consensus & Raft Deep Dive",
    courseCode: "CS101",
    moduleName: "Module 3: Fault Tolerance Protocols",
    participantCount: 14,
    activeVoiceUsers: 5,
    tags: ["Distributed Systems", "Raft", "Go/Rust"],
    description:
      "Collaborative study group dissecting leader election timers and log replication quorums.",
    topic: "Math Proof of Leader Completeness Property",
  },
  {
    id: "room_ai301",
    title: "Gemini Multimodal Live API & WebGPU Studio",
    courseCode: "AI301",
    moduleName: "Module 4: Edge Agent Architecture",
    participantCount: 22,
    activeVoiceUsers: 8,
    tags: ["Gemini 3.1 Pro", "WebGPU", "Edge AI"],
    description:
      "Building zero-latency local DOM parsing & streaming audio-to-audio WebSockets.",
    topic: "Optimizing Nano Banana Pro WebGPU model execution",
  },
  {
    id: "room_math201",
    title: "Matrix Factorization & Linear Algebra Workshop",
    courseCode: "MATH201",
    moduleName: "Module 2: Eigenvalues & SVD",
    participantCount: 9,
    activeVoiceUsers: 3,
    tags: ["Mathematics", "SVD", "ML Fundamentals"],
    description:
      "Solving complex singular value decomposition problems for latent semantic indexing.",
    topic: "Exercise 4.2: Computing Orthogonal Basis Vectors",
  },
  {
    id: "room_se401",
    title: "Microservices & Event-Driven Message Buses",
    courseCode: "SE401",
    moduleName: "Module 1: Kafka & RabbitMQ Engine",
    participantCount: 17,
    activeVoiceUsers: 6,
    tags: ["Software Eng", "Kafka", "Architecture"],
    description:
      "Discussing idempotent message processing and distributed transaction sagas.",
    topic: "Saga Pattern vs Two-Phase Commit in High Scale Systems",
  },
];

interface StudyRoomsProps {
  user?: UserProfile;
}

export const StudyRooms: React.FC<StudyRoomsProps> = ({ user }) => {
  const [rooms, setRooms] = React.useState<StudyRoom[]>(DEFAULT_ROOMS);
  const [selectedRoom, setSelectedRoom] = React.useState<StudyRoom>(DEFAULT_ROOMS[0]);
  const [messages, setMessages] = React.useState<StudyRoomMessage[]>([
    {
      id: "m1",
      senderName: "Prof. Marcus Vance",
      senderAvatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      senderRole: "Lead Academic Chair",
      text: "Welcome to the Raft Consensus live study session! We are analyzing term-based randomized election timers.",
      timestamp: "10:42 AM",
    },
    {
      id: "m2",
      senderName: "Socratic AI Research Tutor",
      senderAvatar:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
      senderRole: "AI Agent Engine",
      text: "Note: Raft guarantees state machine safety. If a server has applied a log entry at a given index, no other server will ever apply a different log entry for that index.",
      timestamp: "10:43 AM",
      isAiAgent: true,
      codeSnippet: `// Raft Leader Heartbeat Interval Test
function sendHeartbeat(leaderId, term, followers) {
  return followers.map(f => f.appendEntries({ term, leaderId }));
}`,
    },
    {
      id: "m3",
      senderName: user?.name || "Alex Mercer",
      senderAvatar:
        user?.avatarUrl ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      senderRole: "Scholar",
      text: "Has anyone worked out the quorum formula for N=7 nodes? Is it 4 nodes required?",
      timestamp: "10:45 AM",
    },
  ]);

  const [inputMsg, setInputMsg] = React.useState("");
  const [isMicActive, setIsMicActive] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isAudioRoomConnected, setIsAudioRoomConnected] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<"chat" | "audio" | "board" | "whiteboard" | "sync">(
    "chat",
  );
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [newRoomTitle, setNewRoomTitle] = React.useState("");
  const [newRoomCourse, setNewRoomCourse] = React.useState("CS101");
  const [newRoomTopic, setNewRoomTopic] = React.useState("");
  const [isLaunchingMeet, setIsLaunchingMeet] = React.useState(false);
  const [meetLink, setMeetLink] = React.useState<string | null>(null);

  const handleLaunchGoogleMeet = async () => {
    setIsLaunchingMeet(true);
    try {
      let token = getAccessToken();
      if (!token) {
        const authRes = await googleSignIn();
        token = authRes?.accessToken || null;
      }
      if (!token) {
        alert("Google Authentication required to create Google Meet space.");
        setIsLaunchingMeet(false);
        return;
      }
      const space = await WorkspaceService.createGoogleMeetSpace(token);
      if (space && space.meetingUri) {
        setMeetLink(space.meetingUri);
        window.open(space.meetingUri, "_blank", "noopener,noreferrer");
      } else {
        alert(
          "Failed to create Google Meet space. Please verify OAuth permissions for Google Meet.",
        );
      }
    } catch (e) {
      console.error("Google Meet launch error:", e);
      alert("Error launching Google Meet.");
    } finally {
      setIsLaunchingMeet(false);
    }
  };

  const [participants] = React.useState<RoomParticipant[]>([
    {
      id: "p1",
      name: user?.name || "Alex Mercer",
      avatar:
        user?.avatarUrl ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      role: "Student (You)",
      isSpeaking: isMicActive,
      isMuted: isMuted,
      activeTopic: "Quorum Calculations",
    },
    {
      id: "p2",
      name: "Elena Rostova",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      role: "Graduate Researcher",
      isSpeaking: true,
      isMuted: false,
      activeTopic: "Leader Election Timers",
    },
    {
      id: "p3",
      name: "Dr. Hiroshi Tanaka",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      role: "Peer Reviewer",
      isSpeaking: false,
      isMuted: true,
      activeTopic: "Log Matching Invariant",
    },
    {
      id: "p4",
      name: "Zalamati Socratic Agent",
      avatar:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
      role: "AI Study Assistant",
      isSpeaking: false,
      isMuted: false,
      activeTopic: "Auto-Grading Code Examples",
    },
  ]);

  const chatBottomRef = React.useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom
  React.useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Firestore Real-Time Message Listener setup
  React.useEffect(() => {
    if (!selectedRoom?.id) return;

    try {
      const roomMsgsRef = collection(
        db,
        "study_rooms",
        selectedRoom.id,
        "messages",
      );
      const q = query(roomMsgsRef, orderBy("createdAt", "asc"), limit(50));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched: StudyRoomMessage[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              fetched.push({
                id: doc.id,
                senderName: data.senderName || "Anonymous Scholar",
                senderAvatar:
                  data.senderAvatar ||
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                senderRole: data.senderRole || "Student",
                text: data.text || "",
                timestamp:
                  data.timestamp ||
                  new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                isAiAgent: data.isAiAgent || false,
                codeSnippet: data.codeSnippet || undefined,
              });
            });
            if (fetched.length > 0) {
              setMessages(fetched);
            }
          }
        },
        (error) => {
          console.info(
            "Firestore StudyRooms sync fallback to local memory:",
            error.message,
          );
        },
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn(
        "Firestore real-time room sync unavailable, utilizing local state:",
        err,
      );
    }
  }, [selectedRoom?.id]);

  const handleSendMessage = async () => {
    if (!inputMsg.trim()) return;

    const newMsg: StudyRoomMessage = {
      id: "msg_" + Date.now(),
      senderName: user?.name || "Alex Mercer",
      senderAvatar:
        user?.avatarUrl ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      senderRole: user?.role
        ? `${user.role.toUpperCase()} Scholar`
        : "Student Scholar",
      text: inputMsg,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMsg]);
    const currentText = inputMsg;
    setInputMsg("");

    // Save to Firestore if connected
    try {
      const roomMsgsRef = collection(
        db,
        "study_rooms",
        selectedRoom.id,
        "messages",
      );
      await addDoc(roomMsgsRef, {
        senderName: newMsg.senderName,
        senderAvatar: newMsg.senderAvatar,
        senderRole: newMsg.senderRole,
        text: currentText,
        createdAt: serverTimestamp(),
        timestamp: newMsg.timestamp,
      });
    } catch (e) {
      // Local state fallback already updated
    }

    // Simulate Socratic AI Assistant Response if message asks a question
    if (
      currentText.includes("?") ||
      currentText.toLowerCase().includes("help") ||
      currentText.toLowerCase().includes("explain")
    ) {
      setTimeout(() => {
        const aiResponse: StudyRoomMessage = {
          id: "ai_resp_" + Date.now(),
          senderName: "Socratic AI Research Tutor",
          senderAvatar:
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
          senderRole: "AI Agent Engine",
          text: `Great inquiry regarding ${selectedRoom.topic}! In distributed systems, consensus requires $Q = \\lfloor N/2 \\rfloor + 1$ nodes to ensure non-overlapping majorities.`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isAiAgent: true,
          codeSnippet: `// Consensus Majority Check
function hasMajorityQuorum(nodesAcknowledged, totalClusterNodes) {
  const quorumThreshold = Math.floor(totalClusterNodes / 2) + 1;
  return nodesAcknowledged >= quorumThreshold;
}`,
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1200);
    }
  };

  const handleCreateRoom = () => {
    if (!newRoomTitle.trim()) return;

    const created: StudyRoom = {
      id: "room_" + Date.now(),
      title: newRoomTitle,
      courseCode: newRoomCourse,
      moduleName: `Module 1: ${newRoomTitle}`,
      participantCount: 1,
      activeVoiceUsers: 1,
      tags: [newRoomCourse, "Live Study", "Collaborative"],
      description: `Student created live workspace for ${newRoomTitle}.`,
      topic: newRoomTopic || "Open Topic Discussion",
    };

    setRooms((prev) => [created, ...prev]);
    setSelectedRoom(created);
    setShowCreateModal(false);
    setNewRoomTitle("");
    setNewRoomTopic("");
  };

  return (
    <div className="p-4 md:p-6 rounded-3xl bg-[#0b1820] border border-[#1b3d4f] text-white space-y-6 shadow-2xl">
      {/* Top Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#183646] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              Real-Time Collaboration Mesh
            </span>
            <span className="text-[11px] text-[#7ea1b2]">
              Firestore & Audio Voice Signaling Active
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1">
            Academic Study Rooms & Voice Channels
          </h2>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Study Room</span>
        </button>
      </div>

      {/* Main Grid: Rooms List Sidebar + Live Session View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Rooms Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              Active Course Rooms ({rooms.length})
            </span>
            <span className="text-[10px] text-cyan-400 font-mono font-bold">
              ● LIVE
            </span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {rooms.map((room) => {
              const isSelected = selectedRoom.id === room.id;
              return (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? "bg-gradient-to-r from-[#0d2736] to-[#0a1e2a] border-cyan-400 shadow-xl shadow-cyan-950/50 scale-[1.01]"
                      : "bg-[#07131a] border-[#1b3d4f] hover:border-[#27566f] hover:bg-[#091a24]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
                      {room.courseCode}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-[#7ea1b2]">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-cyan-400" />
                        {room.participantCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mic className="w-3 h-3 text-cyan-400" />
                        {room.activeVoiceUsers}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-1">
                    {room.title}
                  </h3>
                  <p className="text-[11px] text-[#7ea1b2] line-clamp-2">
                    {room.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {room.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-full bg-[#122e3e] text-[#8db6c9] text-[9px] font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Room Main Stage */}
        <div className="lg:col-span-8 bg-[#07131a] border border-[#1b3d4f] rounded-3xl p-5 md:p-6 space-y-5 flex flex-col justify-between min-h-[600px]">
          {/* Room Header Info */}
          <div className="space-y-3 border-b border-[#183646] pb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
                    {selectedRoom.courseCode}
                  </span>
                  <span className="text-xs text-[#7ea1b2]">
                    {selectedRoom.moduleName}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-white mt-1">
                  {selectedRoom.title}
                </h2>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex flex-wrap items-center gap-1 bg-[#0d212c] p-1 rounded-2xl border border-[#1c3e50]">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "chat"
                      ? "bg-cyan-500 text-slate-950 font-black shadow"
                      : "text-[#81a5b6] hover:text-white"
                  }`}
                >
                  Text Chat
                </button>
                <button
                  onClick={() => setActiveTab("audio")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "audio"
                      ? "bg-cyan-500 text-slate-950 font-black shadow"
                      : "text-[#81a5b6] hover:text-white"
                  }`}
                >
                  Voice Mesh
                </button>
                <button
                  onClick={() => setActiveTab("board")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "board"
                      ? "bg-cyan-500 text-slate-950 font-black shadow"
                      : "text-[#81a5b6] hover:text-white"
                  }`}
                >
                  Topic Notes
                </button>
                <button
                  onClick={() => setActiveTab("whiteboard")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "whiteboard"
                      ? "bg-cyan-500 text-slate-950 font-black shadow"
                      : "text-[#81a5b6] hover:text-white"
                  }`}
                >
                  Interactive Whiteboard
                </button>
                <button
                  onClick={() => setActiveTab("sync")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === "sync"
                      ? "bg-gradient-to-r from-cyan-400 to-cyan-400 text-slate-950 font-black shadow-lg"
                      : "text-cyan-300 hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sync Content</span>
                </button>
              </div>
            </div>

            {/* Current Discussion Topic Badge */}
            <div className="p-3 rounded-2xl bg-[#0e222e] border border-[#1d4256] flex items-center justify-between text-xs text-[#8bb0c0]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  <strong className="text-white">
                    Active Discussion Topic:
                  </strong>{" "}
                  {selectedRoom.topic}
                </span>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono font-bold shrink-0">
                Socratic AI Online
              </span>
            </div>
          </div>

          {/* TAB CONTENT 1: TEXT CHAT */}
          {activeTab === "chat" && (
            <div className="flex-1 flex flex-col justify-between space-y-4">
              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto max-h-[380px] space-y-3.5 pr-1 font-sans text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-2xl border space-y-1.5 transition-all ${
                      msg.isAiAgent
                        ? "bg-gradient-to-r from-cyan-950/40 to-blue-950/30 border-cyan-500/40"
                        : "bg-[#0d1f2a] border-[#1b3d4f]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={msg.senderAvatar}
                          alt={msg.senderName}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-xl object-cover border border-cyan-400/40"
                        />
                        <div>
                          <span className="font-bold text-white text-xs flex items-center gap-1.5">
                            {msg.senderName}
                            {msg.isAiAgent && (
                              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono border border-cyan-500/30">
                                AI
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-[#7196a8]">
                            {msg.senderRole}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#5e8192] font-mono">
                        {msg.timestamp}
                      </span>
                    </div>

                    <p className="text-gray-200 text-xs leading-relaxed">
                      {msg.text}
                    </p>

                    {msg.codeSnippet && (
                      <div className="p-3 rounded-xl bg-[#061016] border border-[#1a3848] font-mono text-[11px] text-cyan-300 overflow-x-auto">
                        <pre>{msg.codeSnippet}</pre>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input Controls */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#183646]">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder={`Discuss ${selectedRoom.topic}...`}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-[#0a1820] border border-[#1b3d4f] text-white text-xs focus:outline-none focus:border-cyan-400 shadow-inner"
                />

                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-black text-xs shadow-md hover:from-cyan-400 hover:to-cyan-300 transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB CONTENT 2: VOICE MESH */}
          {activeTab === "audio" && (
            <div className="space-y-6 py-2">
              {/* Audio Controls Bar */}
              <div className="p-4 rounded-2xl bg-[#0d222e] border border-[#1d4256] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isAudioRoomConnected
                        ? "bg-cyan-400 animate-ping"
                        : "bg-cyan-500"
                    }`}
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {isAudioRoomConnected
                        ? "Voice Mesh Channel Active"
                        : "Voice Disconnected"}
                    </span>
                    <span className="text-[10px] text-[#789cb0]">
                      WebRTC Low-Latency Signaling • {participants.length}{" "}
                      Online
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isMuted
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                        : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    }`}
                  >
                    {isMuted ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                    <span>{isMuted ? "Muted" : "Unmuted"}</span>
                  </button>

                  <button
                    onClick={() => setIsMicActive(!isMicActive)}
                    className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isMicActive
                        ? "bg-cyan-500 text-slate-950 font-black"
                        : "bg-[#122e3d] text-cyan-300 border border-cyan-500/30"
                    }`}
                  >
                    <Radio className="w-4 h-4" />
                    <span>Push to Talk</span>
                  </button>

                  <button
                    onClick={() =>
                      setIsAudioRoomConnected(!isAudioRoomConnected)
                    }
                    className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>
                      {isAudioRoomConnected ? "Leave Voice" : "Join Voice"}
                    </span>
                  </button>

                  <button
                    onClick={handleLaunchGoogleMeet}
                    disabled={isLaunchingMeet}
                    className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                    title="Create & Launch Google Meet Video Space"
                  >
                    <Video className="w-4 h-4 text-cyan-200" />
                    <span>
                      {isLaunchingMeet ? "Launching..." : "Google Meet"}
                    </span>
                  </button>
                </div>
              </div>

              {meetLink && (
                <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <Video className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-cyan-200 font-mono truncate">
                      {meetLink}
                    </span>
                  </div>
                  <a
                    href={meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-all flex items-center gap-1 shrink-0"
                  >
                    <span>Open Meet</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Participants Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {participants.map((p) => (
                  <div
                    key={p.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      p.isSpeaking
                        ? "bg-cyan-950/20 border-cyan-500/50 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400/30"
                        : "bg-[#0d1e27] border-[#1b3a4a]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-2xl object-cover border border-cyan-400/40"
                        />
                        {p.isSpeaking && (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 border-2 border-[#0d1e27] flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          {p.name}
                        </h4>
                        <span className="text-[10px] text-[#7297a8] block">
                          {p.role}
                        </span>
                        <span className="text-[9px] text-cyan-400 italic">
                          Topic: {p.activeTopic}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      {p.isMuted ? (
                        <span className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 text-[10px] font-mono border border-cyan-500/30 flex items-center gap-1">
                          <MicOff className="w-3 h-3" /> Muted
                        </span>
                      ) : p.isSpeaking ? (
                        <span className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/40 flex items-center gap-1 animate-pulse">
                          <Volume2 className="w-3 h-3" /> Speaking
                        </span>
                      ) : (
                        <span className="p-1.5 rounded-xl bg-slate-800 text-slate-400 text-[10px] font-mono">
                          Listening
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT 3: TOPIC NOTES */}
          {activeTab === "board" && (
            <CollaborativeStudyNotes
              roomId={selectedRoom.id}
              roomTitle={selectedRoom.title}
              courseCode={selectedRoom.courseCode}
              topic={selectedRoom.topic}
              user={user}
            />
          )}

          {/* TAB CONTENT 4: COLLABORATIVE WHITEBOARD */}
          {activeTab === "whiteboard" && (
            <CollaborativeWhiteboard
              roomId={selectedRoom.id}
              roomTitle={selectedRoom.title}
              courseCode={selectedRoom.courseCode}
              topic={selectedRoom.topic}
              user={user}
            />
          )}

          {/* TAB CONTENT 5: SYNCHRONIZED CONTENT VIEWER */}
          {activeTab === "sync" && (
            <SynchronizedContentViewer
              roomId={selectedRoom.id}
              roomTitle={selectedRoom.title}
              courseCode={selectedRoom.courseCode}
              topic={selectedRoom.topic}
              user={user}
            />
          )}
        </div>
      </div>

      {/* CREATE ROOM MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c1a24] border border-[#1b3d4f] rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-white">
            <h3 className="text-lg font-black text-white">
              Create New Academic Study Room
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#7ea1b2] mb-1 font-semibold">
                  Course Module Code
                </label>
                <select
                  value={newRoomCourse}
                  onChange={(e) => setNewRoomCourse(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#07131a] border border-[#1b3d4f] text-cyan-300 font-mono font-bold focus:outline-none"
                >
                  <option value="CS101">CS101 - Distributed Systems</option>
                  <option value="AI301">AI301 - Edge AI Architecture</option>
                  <option value="MATH201">MATH201 - Advanced Calculus</option>
                  <option value="SE401">
                    SE401 - Microservices Architecture
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-[#7ea1b2] mb-1 font-semibold">
                  Room Session Title
                </label>
                <input
                  type="text"
                  value={newRoomTitle}
                  onChange={(e) => setNewRoomTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus Workshop..."
                  className="w-full px-3 py-2 rounded-xl bg-[#07131a] border border-[#1b3d4f] text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[#7ea1b2] mb-1 font-semibold">
                  Primary Discussion Topic
                </label>
                <input
                  type="text"
                  value={newRoomTopic}
                  onChange={(e) => setNewRoomTopic(e.target.value)}
                  placeholder="e.g. Raft Leader Election Timers..."
                  className="w-full px-3 py-2 rounded-xl bg-[#07131a] border border-[#1b3d4f] text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#183646]">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl bg-[#122a36] text-[#7ea1b2] hover:text-white font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRoom}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-black text-xs shadow-md"
              >
                Launch Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
