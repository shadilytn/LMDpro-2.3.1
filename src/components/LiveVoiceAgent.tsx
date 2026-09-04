import React from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  MessageSquare,
  Bot,
  User,
  Radio,
  Sliders,
  ChevronRight,
  BrainCircuit,
  Headphones,
  RotateCcw,
  Zap,
  BookOpen,
} from "lucide-react";
import { ConversationalBridgeService, ConversationalEvent, DiscussionMode } from "../shared/conversational.bridge.service";

interface LiveVoiceAgentProps {
  initialTopic?: string;
  onClose?: () => void;
}

export const LiveVoiceAgent: React.FC<LiveVoiceAgentProps> = ({
  initialTopic = "LMD Degree Pathways & Modern Computer Science",
  onClose,
}) => {
  const [topic, setTopic] = React.useState(ConversationalBridgeService.getCurrentTopic());
  const [isLiveSessionActive, setIsLiveSessionActive] = React.useState(false);
  const [isMicMuted, setIsMicMuted] = React.useState(false);
  const [discussionMode, setDiscussionMode] = React.useState<DiscussionMode>(ConversationalBridgeService.getDiscussionMode());
  const [studentInput, setStudentInput] = React.useState("");
  const [audioLevel, setAudioLevel] = React.useState(15);
  const [transcript, setTranscript] = React.useState(ConversationalBridgeService.getHistory());
  const [isPlaying, setIsPlaying] = React.useState(ConversationalBridgeService.getIsProcessingTTS());
  const [playbackRate, setPlaybackRate] = React.useState(1.0);

  const transcriptEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const unsubscribe = ConversationalBridgeService.subscribe((event) => {
      setTranscript([...ConversationalBridgeService.getHistory()]);
      setIsPlaying(ConversationalBridgeService.getIsProcessingTTS());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Audio wave pulsing effect
  React.useEffect(() => {
    let interval: any;
    if (isLiveSessionActive || isPlaying) {
      interval = setInterval(() => {
        setAudioLevel(Math.floor(Math.random() * 70) + 30);
      }, 150);
    } else {
      setAudioLevel(15);
    }
    return () => clearInterval(interval);
  }, [isLiveSessionActive, isPlaying]);

  const presetTopics = [
    "LMD Accreditation & Semester Credit System (ECTS)",
    "Distributed Systems & Consensus Protocols (Raft/Paxos)",
    "Quantum Computing: Qubits & Superposition",
    "Neural Network Optimization & Gradient Descent",
    "Ethical Governance in Autonomous AI Systems",
  ];

  const handleStartSession = () => {
    setIsLiveSessionActive(true);
    ConversationalBridgeService.setTopic(topic);
    ConversationalBridgeService.speak("ZALAMATI", `Live Socratic Voice Discussion initialized for topic: "${topic}". Ask your first question or state a premise to explore!`);
  };

  const handleEndSession = () => {
    setIsLiveSessionActive(false);
    ConversationalBridgeService.stop();
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || studentInput;
    if (!text.trim()) return;
    
    ConversationalBridgeService.sendMessage(text);
    if (!textToSend) setStudentInput("");
  };

  const handleModeChange = (mode: DiscussionMode) => {
    setDiscussionMode(mode);
    ConversationalBridgeService.setDiscussionMode(mode);
  };


  return (
    <div className="bg-[#0b1820] border border-[#1b3d4f] rounded-3xl p-5 md:p-6 text-white space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full filter blur-3xl pointer-events-none" />

      {/* Intricate Degrees Geometry Lines Background Accent */}
      <svg
        className="absolute inset-0 w-full h-full text-cyan-400/5 pointer-events-none"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
      >
        <line
          x1="0"
          y1="0"
          x2="400"
          y2="200"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <line
          x1="400"
          y1="0"
          x2="0"
          y2="200"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <circle
          cx="200"
          cy="100"
          r="80"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          strokeDasharray="4 4"
        />
        <circle
          cx="200"
          cy="100"
          r="120"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
        />
      </svg>

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#183747] relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#22d3ee] via-[#34d399] to-[#f59e0b] text-slate-950 font-black shadow-lg shadow-cyan-900/50">
            <Headphones className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-lg tracking-tight">
                Petra & Nashmi Socratic Discussion
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-widest font-mono">
                GOOGLE AI MULTI-HOST VOICE
              </span>
            </div>
            <p className="text-xs text-[#7ea1b2]">
              Engage in real-time co-narrated Socratic debate with Petra
              (Teacher) and Nashmi (UI/UX specialist)
            </p>
          </div>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-2">
          {isLiveSessionActive ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>LIVE AUDIO SESSION ACTIVE</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#122834] border border-[#1e3e50] text-[#7ea1b2] text-xs font-medium">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>Voice Agent Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Discussion Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Left Col: Topic Selection & Discussion Controls */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#0d1d26] border border-[#1b3d4f] space-y-3">
            <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Discussion Topic</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic or academic lesson..."
              className="w-full px-3 py-2 rounded-xl bg-[#07131a] border border-[#1a3848] text-white text-xs focus:outline-none focus:border-cyan-400"
            />

            <div className="space-y-1.5">
              <span className="text-[10px] text-[#638797] font-semibold">
                Preset Topics:
              </span>
              <div className="space-y-1">
                {presetTopics.map((pt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTopic(pt)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg bg-[#09161e] hover:bg-[#122a38] text-[11px] text-[#86a8b7] hover:text-white transition-colors truncate block border border-white/5"
                  >
                    {pt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Discussion Mode Selector */}
          <div className="p-4 rounded-2xl bg-[#0d1d26] border border-[#1b3d4f] space-y-2.5">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Pedagogical Discussion Depth</span>
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  id: "socratic",
                  label: "Socratic Discovery",
                  desc: "Guiding questions",
                },
                {
                  id: "deep_dive",
                  label: "Academic Deep Dive",
                  desc: "Rigorous breakdown",
                },
                {
                  id: "oral_exam",
                  label: "Oral Exam Prep",
                  desc: "Interactive defense",
                },
                {
                  id: "clarification",
                  label: "Quick Explanation",
                  desc: "Step-by-step summary",
                },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setDiscussionMode(m.id as any)}
                  className={`p-2 rounded-xl text-left transition-all border ${
                    discussionMode === m.id
                      ? "bg-cyan-500/20 text-cyan-200 border-cyan-500/40 font-bold shadow-md"
                      : "bg-[#09161e] text-[#7ea1b2] border-[#183646] hover:bg-white/5"
                  }`}
                >
                  <p className="text-xs">{m.label}</p>
                  <p className="text-[9px] opacity-75">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Session Launch & Audio Control Panel */}
          <div className="p-4 rounded-2xl bg-[#0d1d26] border border-[#1b3d4f] space-y-3">
            {!isLiveSessionActive ? (
              <button
                onClick={handleStartSession}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-cyan-500 to-cyan-500 hover:from-cyan-400 hover:to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-900/40 active:scale-95 transition-all"
              >
                <Mic className="w-4 h-4" />
                <span>Start Live Voice Discussion</span>
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handleEndSession}
                  className="w-full py-2.5 px-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40 transition-all"
                >
                  <Square className="w-4 h-4" />
                  <span>End Live Session</span>
                </button>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#183646]">
                  <button
                    onClick={() => setIsMicMuted(!isMicMuted)}
                    className={`flex-1 py-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                      isMicMuted
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    }`}
                  >
                    {isMicMuted ? (
                      <MicOff className="w-3.5 h-3.5" />
                    ) : (
                      <Mic className="w-3.5 h-3.5" />
                    )}
                    <span>{isMicMuted ? "Muted" : "Mic On"}</span>
                  </button>

                  <div className="flex items-center gap-1 bg-[#07131a] p-1 rounded-xl border border-[#1b3d4f] text-[10px]">
                    {[0.8, 1.0, 1.25, 1.5].map((s) => (
                      <button
                        key={s}
                        onClick={() => setPlaybackRate(s)}
                        className={`px-1.5 py-0.5 rounded font-mono font-bold ${
                          playbackRate === s
                            ? "bg-cyan-500 text-slate-950"
                            : "text-[#7ea0b1]"
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center & Right Col: Live Waveform Visualizer & Interactive Transcript */}
        <div className="lg:col-span-2 space-y-4 flex flex-col justify-between">
          {/* Animated Waveform Visualizer */}
          <div className="p-5 rounded-2xl bg-[#0d1d26] border border-[#1b3d4f] flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
            <div className="flex items-center justify-center gap-1.5 h-20 w-full px-4">
              {Array.from({ length: 24 }).map((_, i) => {
                const heightVal =
                  isLiveSessionActive || isPlaying
                    ? Math.max(
                        10,
                        (Math.sin(i + audioLevel) + 1) * 35 +
                          Math.random() * 20,
                      )
                    : 8;

                return (
                  <div
                    key={i}
                    className="w-2 rounded-full transition-all duration-150 bg-gradient-to-t from-cyan-600 via-cyan-400 to-cyan-300"
                    style={{ height: `${heightVal}px` }}
                  />
                );
              })}
            </div>

            <p className="text-xs font-semibold text-[#82a4b3] mt-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {isPlaying
                  ? "Petra (Teacher Guide) & Nashmi (UI/UX) Co-narrating..."
                  : isLiveSessionActive
                    ? "Dual-hosts Listening for student input..."
                    : 'Click "Start Live Voice Discussion" to initiate Petra & Nashmi hosts'}
              </span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#08131a] border border-[#183646] h-[280px] overflow-y-auto space-y-3 text-xs leading-relaxed">
            {transcript.map((msg, idx) => {
              const isUser = msg.agent === "ZALAMATI" && msg.text.startsWith("Student:");
              const displayName = msg.agent === "ZALAMATI" 
                ? (msg.text.startsWith("Student:") ? "You" : "Zalamati (Orchestrator)")
                : `${msg.agent.charAt(0) + msg.agent.slice(1).toLowerCase()} (Host)`;
              
              return (
                <div
                  key={idx}
                  className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-3 rounded-2xl space-y-1 ${
                      isUser
                        ? "bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-tr-none"
                        : "bg-[#0e212c] border border-[#1c3d4f] text-gray-200 rounded-tl-none"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[10px] text-cyan-200/70 font-semibold">
                      <span>
                        {displayName}
                      </span>
                      <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p>{msg.text.replace("Student: ", "")}</p>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={transcriptEndRef} />
          </div>

          {/* Quick Voice Prompt / Text Input */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={studentInput}
              onChange={(e) => setStudentInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type or speak your question to Petra & Nashmi..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#0a171f] border border-[#1b3e50] text-white text-xs focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={() => handleSendMessage()}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
            >
              <span>Speak</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
