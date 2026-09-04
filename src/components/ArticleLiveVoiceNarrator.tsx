import React from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  Bot,
  User,
  Radio,
  RotateCcw,
  Headphones,
  Zap,
  MessageSquare,
  Send,
  Tag,
} from "lucide-react";
import { useTTSVoice } from "../hooks/useTTSVoice";

interface ArticleLiveVoiceNarratorProps {
  lessonTitle: string;
  lessonContent: string;
}

export const ArticleLiveVoiceNarrator: React.FC<
  ArticleLiveVoiceNarratorProps
> = ({ lessonTitle, lessonContent }) => {
  const [isLiveDiscussionActive, setIsLiveDiscussionActive] = React.useState(false);
  const [isMicMuted, setIsMicMuted] = React.useState(false);
  const [userInput, setUserInput] = React.useState("");
  const [audioLevel, setAudioLevel] = React.useState(20);

  const { speak, stop, isPlaying } = useTTSVoice();

  // Dynamically extract article topics from lesson content
  const extractArticleTopics = (content: string, title: string): string[] => {
    const topics: string[] = [];
    const lines = content.split("\n");
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (
        trimmed.startsWith("#") ||
        trimmed.startsWith("##") ||
        trimmed.startsWith("###")
      ) {
        const headingText = trimmed.replace(/^#+\s*/, "").replace(/[*_]/g, "");
        if (headingText && headingText.length > 3 && headingText.length < 50) {
          topics.push(headingText);
        }
      }
    });

    if (topics.length < 3) {
      const boldMatches = content.match(/\*\*([^*]+)\*\*/g);
      if (boldMatches) {
        boldMatches.forEach((m) => {
          const clean = m.replace(/\*/g, "").trim();
          if (
            clean.length > 3 &&
            clean.length < 40 &&
            !topics.includes(clean)
          ) {
            topics.push(clean);
          }
        });
      }
    }

    if (topics.length === 0) {
      topics.push(
        `${title} Foundations`,
        `Core Principles of ${title}`,
        `Practical Applications`,
      );
    }

    return Array.from(new Set(topics)).slice(0, 4);
  };

  const articleTopics = extractArticleTopics(lessonContent, lessonTitle);

  const [messages, setMessages] = React.useState<
    Array<{ sender: "agent" | "user"; text: string }>
  >([
    {
      sender: "agent",
      text: `Hello! I am your Socratic AI Voice Agent for "${lessonTitle}". Select a topic from this article or click 'Start Live Voice' to begin our interactive session!`,
    },
  ]);

  // Audio wave pulsing effect
  React.useEffect(() => {
    let interval: any;
    if (isLiveDiscussionActive || isPlaying) {
      interval = setInterval(() => {
        setAudioLevel(Math.floor(Math.random() * 60) + 30);
      }, 150);
    } else {
      setAudioLevel(15);
    }
    return () => clearInterval(interval);
  }, [isLiveDiscussionActive, isPlaying]);

  const handleStartVoice = () => {
    setIsLiveDiscussionActive(true);
    const narrationIntro = `Starting interactive live voice session for "${lessonTitle}". Today's topics include ${articleTopics.join(", ")}. Let's explore!`;
    speak(narrationIntro);
  };

  const handleStopVoice = () => {
    setIsLiveDiscussionActive(false);
    stop();
  };

  const handleTopicClick = (topic: string) => {
    setIsLiveDiscussionActive(true);
    const prompt = `Let's discuss the topic: "${topic}"`;
    setMessages((prev) => [...prev, { sender: "user", text: prompt }]);

    const response = `Excellent choice! "${topic}" is central to ${lessonTitle}. In this article, it demonstrates how structured parameters ensure reliable processing and high academic standards.`;
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "agent", text: response }]);
      speak(response);
    }, 500);
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    const text = userInput;
    setUserInput("");
    setMessages((prev) => [...prev, { sender: "user", text }]);

    setTimeout(() => {
      const response = `Regarding "${text}" in ${lessonTitle}: The key mechanism involves balancing computational parameters and adaptive routing nodes to achieve maximum precision.`;
      setMessages((prev) => [...prev, { sender: "agent", text: response }]);
      speak(response);
    }, 600);
  };

  return (
    <div className="mb-6 rounded-3xl bg-gradient-to-r from-[#0a1c26] via-[#0d2432] to-[#07131a] border border-[#1b3d4f] p-5 shadow-2xl space-y-4">
      {/* Live Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-cyan-400 to-cyan-300 flex items-center justify-center text-slate-950 font-black shadow-lg">
              <Headphones className="w-5 h-5 text-slate-950" />
            </div>
            {isLiveDiscussionActive && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-[#0a1c26] animate-ping" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                Article Voice Agent
              </span>
              <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse" /> Socratic Engine
                Active
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-white mt-0.5">
              {lessonTitle}
            </h3>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2">
          {!isLiveDiscussionActive ? (
            <button
              onClick={handleStartVoice}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-500 to-cyan-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Start Live Voice</span>
            </button>
          ) : (
            <button
              onClick={handleStopVoice}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold text-xs flex items-center gap-2 hover:bg-cyan-500/30 transition-all"
            >
              <Square className="w-3.5 h-3.5 fill-cyan-300" />
              <span>Pause Session</span>
            </button>
          )}

          <button
            onClick={() => setIsMicMuted(!isMicMuted)}
            className={`p-2 rounded-xl border transition-all ${
              isMicMuted
                ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                : "bg-[#091b24] border-[#1b3d4f] text-[#81a2b2] hover:text-white"
            }`}
            title={isMicMuted ? "Unmute Mic" : "Mute Mic"}
          >
            {isMicMuted ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Extracted Article Topic Chips */}
      <div className="space-y-1.5 pt-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#638799] flex items-center gap-1">
          <Tag className="w-3 h-3 text-cyan-400" />
          <span>Extracted Article Topics to Discuss:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {articleTopics.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => handleTopicClick(topic)}
              className="px-3 py-1 rounded-xl bg-[#091d28] hover:bg-[#123142] border border-[#1c3e50] hover:border-cyan-400/50 text-cyan-300 text-xs font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-cyan-300" />
              <span>{topic}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Audio Visualization Bar */}
      <div className="h-7 bg-[#040d12] rounded-xl border border-[#14313f] flex items-center justify-center gap-1.5 px-4 overflow-hidden">
        {[...Array(24)].map((_, i) => {
          const heightPct =
            isLiveDiscussionActive || isPlaying
              ? Math.max(15, Math.sin((i + audioLevel) * 0.5) * 80 + 20)
              : 15;
          return (
            <div
              key={i}
              className="w-1.5 rounded-full bg-gradient-to-t from-cyan-600 via-cyan-400 to-cyan-300 transition-all duration-150"
              style={{ height: `${heightPct}%` }}
            />
          );
        })}
      </div>

      {/* Interactive Transcript & Query Bar */}
      {isLiveDiscussionActive && (
        <div className="space-y-3 pt-2">
          <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl text-xs leading-relaxed flex items-start gap-2 ${
                  m.sender === "agent"
                    ? "bg-[#081720] border border-[#163647] text-cyan-200"
                    : "bg-[#102b38] border border-[#1f4a5f] text-white ml-6"
                }`}
              >
                {m.sender === "agent" ? (
                  <Bot className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                ) : (
                  <User className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                )}
                <span>{m.text}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask Kudo Voice Agent a question about this article..."
              className="flex-1 px-3 py-2 rounded-xl bg-[#040d12] border border-[#183848] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
