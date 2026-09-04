import React from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  FastForward,
  Rewind,
  Sparkles,
  Download,
  Share2,
  Radio,
  Sliders,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Headphones,
  Zap,
  BookOpen,
  HelpCircle,
  FileText
} from "lucide-react";
import { ConversationalBridgeService } from "../shared/conversational.bridge.service";

interface TTSPlayerProps {
  text: string;
  title?: string;
  compact?: boolean;
  onJumpToMark?: (mark: string) => void;
}

export interface DialogueTurn {
  id: string;
  speaker: "nashmi" | "petra";
  speakerName: string;
  role: string;
  tone: string;
  text: string;
  ssml?: string;
  durationSeconds: number;
  markAnchor?: string;
}

export interface AudioOverviewData {
  podcastId: string;
  title: string;
  format: "deep_dive" | "executive_brief" | "socratic_debate" | "full_text";
  durationMinutes: number;
  keyInsights: string[];
  hosts: Array<{ id: string; name: string; role: string; avatar: string }>;
  dialogue: DialogueTurn[];
}

export const TTSPlayer: React.FC<TTSPlayerProps> = ({
  text,
  title = "Interactive Audio Deep Dive",
  compact = false,
  onJumpToMark
}) => {
  const [narrationMode, setNarrationMode] = React.useState<"deep_dive" | "executive_brief" | "socratic_debate" | "full_text">("deep_dive");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [currentTurnIndex, setCurrentTurnIndex] = React.useState(0);
  const [playbackRate, setPlaybackRate] = React.useState(1.0);
  const [showTranscript, setShowTranscript] = React.useState(true);
  const [audioProgress, setAudioProgress] = React.useState(0);
  const [audioData, setAudioData] = React.useState<AudioOverviewData | null>(null);
  
  const timerRef = React.useRef<any>(null);
  const speechSynthRef = React.useRef<SpeechSynthesisUtterance | null>(null);

  // Default initial script fallback
  const generateFallbackOverview = (topicTitle: string, rawContent: string, format: string): AudioOverviewData => {
    const cleanContent = rawContent.replace(/[#*`_~]/g, " ").trim();
    const sentences = cleanContent.match(/[^.!?]+[.!?]+/g) || [cleanContent];
    const excerpt1 = sentences[0] || `${topicTitle} represents a cornerstone framework.`;
    const excerpt2 = sentences[1] || "Understanding the architectural balance allows for maximum reliability.";
    const excerpt3 = sentences[2] || "Applied properly, this eliminates common production pitfalls.";

    return {
      podcastId: `pod-${Date.now()}`,
      title: topicTitle,
      format: format as any,
      durationMinutes: 3,
      keyInsights: [
        `Core mechanism and purpose of ${topicTitle}`,
        "Key operational tradeoffs and edge cases",
        "Step-by-step mental models for exam and lab mastery"
      ],
      hosts: [
        {
          id: "petra",
          name: "Petra",
          role: "Lead Academic Teacher",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop"
        },
        {
          id: "nashmi",
          name: "Nashmi",
          role: "Interactive Co-Host",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop"
        }
      ],
      dialogue: [
        {
          id: "turn-1",
          speaker: "nashmi",
          speakerName: "Nashmi",
          role: "Interactive Co-Host",
          tone: "inquisitive",
          text: `Welcome everyone to our deep dive on "${topicTitle}". Today, Petra and I are breaking down the core principles so you can master this with zero ambiguity. Petra, where should we start?`,
          durationSeconds: 8,
          markAnchor: "evt_intro"
        },
        {
          id: "turn-2",
          speaker: "petra",
          speakerName: "Petra",
          role: "Lead Academic Teacher",
          tone: "academic_exploratory",
          text: `Thanks Nashmi! The essential breakthrough here is: ${excerpt1} When you understand how each component maintains local invariants, the entire system connects seamlessly.`,
          durationSeconds: 11,
          markAnchor: "evt_foundations"
        },
        {
          id: "turn-3",
          speaker: "nashmi",
          speakerName: "Nashmi",
          role: "Interactive Co-Host",
          tone: "practical",
          text: `That makes complete sense. And when students or engineers apply this in practical exercises, what is the biggest nuance they should watch out for?`,
          durationSeconds: 7,
          markAnchor: "evt_tradeoff"
        },
        {
          id: "turn-4",
          speaker: "petra",
          speakerName: "Petra",
          role: "Lead Academic Teacher",
          tone: "rigorous",
          text: `A critical nuance is: ${excerpt2} You must verify that your boundary constraints and data models are tightly scoped before scaling.`,
          durationSeconds: 10,
          markAnchor: "evt_nuance"
        },
        {
          id: "turn-5",
          speaker: "nashmi",
          speakerName: "Nashmi",
          role: "Interactive Co-Host",
          tone: "enthusiastic",
          text: `Brilliant breakdown! In summary: ${excerpt3} Review this lesson's key formulas and quiz yourself to cement your mastery!`,
          durationSeconds: 9,
          markAnchor: "evt_summary"
        }
      ]
    };
  };

  // Fetch or compile dynamic deep dive script from API
  const fetchAudioOverview = async (mode = narrationMode) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/audio-overview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: text.slice(0, 4000),
          format: mode
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAudioData(data);
      } else {
        setAudioData(generateFallbackOverview(title, text, mode));
      }
    } catch (e) {
      setAudioData(generateFallbackOverview(title, text, mode));
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAudioOverview(narrationMode);
  }, [title, text, narrationMode]);

  // Clean up speech on unmount
  React.useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  const stopPlayback = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsPlaying(false);
    setIsPaused(false);
    setAudioProgress(0);
  };

  // Speak a single turn with distinct voice parameters for Petra vs Nashmi
  const speakTurn = (turnIndex: number) => {
    if (!audioData || !audioData.dialogue[turnIndex]) {
      stopPlayback();
      return;
    }

    const currentTurn = audioData.dialogue[turnIndex];
    setCurrentTurnIndex(turnIndex);

    if (currentTurn.markAnchor && onJumpToMark) {
      onJumpToMark(currentTurn.markAnchor);
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(currentTurn.text);
      speechSynthRef.current = utterance;
      utterance.rate = playbackRate;

      const voices = window.speechSynthesis.getVoices();
      
      // Voice personality mapping:
      // Petra = Female voice / academic tone (pitch 0.95)
      // Nashmi = Male voice / inquisitive tone (pitch 1.08)
      if (currentTurn.speaker === "petra") {
        utterance.pitch = 0.95;
        const femaleVoice = voices.find(v => 
          (v.name.includes("Female") || v.name.includes("Zira") || v.name.includes("Samantha") || v.name.includes("Victoria") || v.name.includes("Google UK English Female") || v.name.includes("Google US English")) && v.lang.startsWith("en")
        );
        if (femaleVoice) utterance.voice = femaleVoice;
      } else {
        utterance.pitch = 1.08;
        const maleVoice = voices.find(v => 
          (v.name.includes("Male") || v.name.includes("David") || v.name.includes("Alex") || v.name.includes("Daniel") || v.name.includes("Google UK English Male")) && v.lang.startsWith("en")
        );
        if (maleVoice) utterance.voice = maleVoice;
      }

      utterance.onend = () => {
        if (turnIndex + 1 < audioData.dialogue.length) {
          // Progress to next host turn with a natural 400ms conversational breath
          setTimeout(() => {
            speakTurn(turnIndex + 1);
          }, 400);
        } else {
          stopPlayback();
        }
      };

      utterance.onerror = () => {
        if (turnIndex + 1 < audioData.dialogue.length) {
          speakTurn(turnIndex + 1);
        } else {
          stopPlayback();
        }
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      if (isPaused) {
        if (window.speechSynthesis) window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        if (window.speechSynthesis) window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      setIsPlaying(true);
      setIsPaused(false);
      speakTurn(currentTurnIndex);
    }
  };

  const handleJumpToTurn = (index: number) => {
    setCurrentTurnIndex(index);
    if (isPlaying) {
      speakTurn(index);
    }
  };

  const handleDownloadTranscript = () => {
    if (!audioData) return;
    const content = `# Audio Deep Dive Transcript: ${audioData.title}
Format: ${audioData.format.toUpperCase()}
Generated: ${new Date().toLocaleDateString()}

## Key Takeaways:
${audioData.keyInsights.map(i => `- ${i}`).join("\n")}

## Dialogue:
${audioData.dialogue.map(d => `**${d.speakerName} (${d.role})**: ${d.text}\n`).join("\n")}
`;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "_")}_audio_transcript.md`;
    a.click();
  };

  const currentTurn = audioData?.dialogue[currentTurnIndex];
  const activeHost = currentTurn?.speaker === "petra" ? audioData?.hosts[0] : audioData?.hosts[1];

  const rates = [0.75, 1.0, 1.25, 1.5, 2.0];

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#071620] to-[#0a202d] border border-[#1b3e50] text-xs text-cyan-200 shadow-md">
        <button
          onClick={handleTogglePlay}
          className="w-7 h-7 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center font-bold shadow transition-all active:scale-95"
          title={isPlaying ? (isPaused ? "Resume Audio" : "Pause Audio") : "Play Multi-Host Audio Deep Dive"}
        >
          {isPlaying && !isPaused ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          )}
        </button>
        <div className="flex flex-col">
          <span className="font-bold text-[11px] text-white truncate max-w-[140px]">
            {title}
          </span>
          <span className="text-[9px] text-[#7eb0c7] flex items-center gap-1">
            <Radio className="w-2.5 h-2.5 text-cyan-400" />
            Petra & Nashmi Audio
          </span>
        </div>
        {isPlaying && (
          <div className="flex items-center gap-0.5 ml-1">
            <span className="w-1 h-3 bg-cyan-400 animate-pulse rounded-full" />
            <span className="w-1 h-4 bg-cyan-300 animate-pulse delay-75 rounded-full" />
            <span className="w-1 h-2 bg-cyan-300 animate-pulse delay-150 rounded-full" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-gradient-to-r from-[#071620] via-[#092230] to-[#06141c] border border-[#1a3d4f] p-5 sm:p-6 shadow-2xl space-y-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-cyan-500/10 via-cyan-500/5 to-transparent pointer-events-none" />

      {/* Top Header Row: Badges, Co-Host Avatars, Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#143242] relative z-10">
        <div className="flex items-center gap-3">
          {/* Dual Co-Host Visual Pill */}
          <div className="flex items-center -space-x-2">
            <img
              src={audioData?.hosts[0]?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop"}
              alt="Petra"
              className={`w-9 h-9 rounded-full object-cover border-2 transition-all ${
                isPlaying && currentTurn?.speaker === "petra"
                  ? "border-cyan-400 ring-2 ring-cyan-400/50 scale-110 shadow-lg shadow-cyan-400/30"
                  : "border-[#143242] opacity-80"
              }`}
              title="Petra (Lead Academic Teacher)"
            />
            <img
              src={audioData?.hosts[1]?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop"}
              alt="Nashmi"
              className={`w-9 h-9 rounded-full object-cover border-2 transition-all ${
                isPlaying && currentTurn?.speaker === "nashmi"
                  ? "border-cyan-400 ring-2 ring-cyan-400/50 scale-110 shadow-lg shadow-cyan-400/30"
                  : "border-[#143242] opacity-80"
              }`}
              title="Nashmi (Interactive Co-Host)"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                NotebookLM Multi-Host Audio
              </span>
              {isPlaying && !isPaused && (
                <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-pulse" />
                  Live Dialogue
                </span>
              )}
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white mt-0.5 truncate max-w-sm sm:max-w-md">
              {title}
            </h3>
          </div>
        </div>

        {/* Format Selector Pills */}
        <div className="flex items-center gap-1 bg-[#040e14] p-1 rounded-xl border border-[#143242]">
          {(
            [
              { id: "deep_dive", label: "Deep Dive", icon: Headphones },
              { id: "executive_brief", label: "Briefing", icon: Zap },
              { id: "socratic_debate", label: "Debate", icon: HelpCircle },
              { id: "full_text", label: "Read Aloud", icon: BookOpen }
            ] as const
          ).map(mode => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  stopPlayback();
                  setNarrationMode(mode.id);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                  narrationMode === mode.id
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/50"
                    : "text-[#7ea0b1] hover:text-white hover:bg-[#0c1f2b]"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Speaker Spotlight Banner */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#040e14]/90 border border-[#143242] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-slate-950 shadow-lg ${
              currentTurn?.speaker === "petra"
                ? "bg-gradient-to-tr from-cyan-400 to-cyan-300"
                : "bg-gradient-to-tr from-cyan-400 to-cyan-300"
            }`}>
              {currentTurn?.speaker === "petra" ? "PE" : "NA"}
            </div>
            {isPlaying && !isPaused && (
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-[#040e14] animate-ping" />
            )}
          </div>

          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>{currentTurn?.speakerName || "Petra & Nashmi"}</span>
              <span className="text-[10px] text-[#7ea0b1] font-mono">
                ({currentTurn?.role || "Co-Hosts"})
              </span>
            </div>
            <div className="text-[11px] text-cyan-300/90 font-medium italic mt-0.5 line-clamp-2 max-w-lg">
              "{currentTurn?.text || "Click play to start the interactive multi-host discussion..."}"
            </div>
          </div>
        </div>

        {/* Live Audio Visualizer Wave */}
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#081720] border border-[#143242] shrink-0">
          {[...Array(12)].map((_, i) => {
            const h = isPlaying && !isPaused ? Math.max(15, (Math.sin((i + currentTurnIndex) * 1.5) * 50 + 50)) : 20;
            return (
              <div
                key={i}
                className="w-1 rounded-full bg-gradient-to-t from-cyan-500 to-cyan-300 transition-all duration-150"
                style={{ height: `${h}%` }}
              />
            );
          })}
        </div>
      </div>

      {/* Main Playback Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 relative z-10">
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleTogglePlay}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/60 active:scale-95 transition-all"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : isPlaying && !isPaused ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>{isPaused ? "Resume" : "Play Episode"}</span>
              </>
            )}
          </button>

          {(isPlaying || isPaused) && (
            <button
              onClick={stopPlayback}
              className="p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all"
              title="Stop Narration"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          )}

          {/* Turn step buttons */}
          <button
            onClick={() => handleJumpToTurn(Math.max(0, currentTurnIndex - 1))}
            disabled={currentTurnIndex === 0}
            className="p-2 rounded-xl bg-[#091b24] hover:bg-[#0f2c3b] text-[#7ea0b1] hover:text-white border border-[#163647] disabled:opacity-40"
            title="Previous Host Turn"
          >
            <Rewind className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleJumpToTurn(Math.min((audioData?.dialogue.length || 1) - 1, currentTurnIndex + 1))}
            disabled={!audioData || currentTurnIndex >= audioData.dialogue.length - 1}
            className="p-2 rounded-xl bg-[#091b24] hover:bg-[#0f2c3b] text-[#7ea0b1] hover:text-white border border-[#163647] disabled:opacity-40"
            title="Next Host Turn"
          >
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-[#040e14] p-1 rounded-xl border border-[#143242] text-[10px]">
          <span className="text-[#648797] font-mono px-1">Speed:</span>
          {rates.map(r => (
            <button
              key={r}
              onClick={() => setPlaybackRate(r)}
              className={`px-1.5 py-0.5 rounded-lg font-mono font-bold transition-colors ${
                playbackRate === r
                  ? "bg-cyan-500 text-slate-950 shadow-sm"
                  : "text-[#82a4b3] hover:text-white"
              }`}
            >
              {r}x
            </button>
          ))}
        </div>

        {/* Actions: Toggle Transcript & Download */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="px-3 py-1.5 rounded-xl bg-[#091b24] hover:bg-[#0f2c3b] border border-[#163647] text-[11px] font-bold text-cyan-300 flex items-center gap-1.5 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-300" />
            <span>Transcript</span>
            {showTranscript ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            onClick={handleDownloadTranscript}
            className="p-2 rounded-xl bg-[#091b24] hover:bg-[#0f2c3b] border border-[#163647] text-[#7ea0b1] hover:text-white transition-all"
            title="Export Script & Key Insights"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Dialogue Transcript Accordion */}
      {showTranscript && audioData && (
        <div className="space-y-3 pt-3 border-t border-[#143242] relative z-10">
          {/* Key Insights Chips */}
          <div className="flex flex-wrap gap-2">
            {audioData.keyInsights.map((insight, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/20 text-cyan-200 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                {insight}
              </span>
            ))}
          </div>

          {/* Dialogue Turns List with click-to-play */}
          <div className="max-h-48 sm:max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {audioData.dialogue.map((turn, idx) => {
              const isSelected = idx === currentTurnIndex;
              return (
                <div
                  key={turn.id}
                  onClick={() => handleJumpToTurn(idx)}
                  className={`p-3 rounded-2xl text-xs transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-[#0a2332] border-cyan-500/60 text-white shadow-md ring-1 ring-cyan-500/30"
                      : "bg-[#040e14]/60 hover:bg-[#071924] border-[#143242] text-[#8baec0]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                        turn.speaker === "petra"
                          ? "bg-cyan-950 text-cyan-300 border border-cyan-500/30"
                          : "bg-cyan-950 text-cyan-300 border border-cyan-500/30"
                      }`}>
                        {turn.speakerName}
                      </span>
                      <span className="text-[10px] text-[#638799] font-mono">
                        {turn.role}
                      </span>
                    </div>

                    {isSelected && isPlaying && (
                      <span className="text-[10px] font-mono text-cyan-400 animate-pulse">
                        SPEAKING NOW
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed">{turn.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

