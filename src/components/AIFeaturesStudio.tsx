import React from "react";
import {
  Sparkles,
  Image as ImageIcon,
  Video,
  Music,
  Globe,
  MapPin,
  Brain,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  Sliders,
  Maximize2,
  FileSearch,
  Mic,
  Zap,
  Bot,
  BookOpen,
  Save,
  FileText,
  Trash2,
  Plus,
  History,
  Code,
  Rotate3d,
} from "lucide-react";
import { EducationalMaterialsStudio } from "./EducationalMaterialsStudio";
import { AnimagraphTechnicalExplainer } from "./AnimagraphTechnicalExplainer";

interface JournalEntry {
  id: string;
  timestamp: string;
  title: string;
  modelName: string;
  parameters: {
    temperature: number;
    maxTokens: number;
    topP: number;
  };
  codeSnippet: string;
  generatedOutput: string;
  type: "image" | "video" | "music" | "grounding" | "reasoning" | "custom";
}

const PRESET_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: "trial-001",
    timestamp: "2026-08-14 02:15 AM",
    title: "Quantum Mechanics Simulation Rig",
    modelName: "gemini-3.5-flash",
    parameters: { temperature: 0.2, maxTokens: 1024, topP: 0.95 },
    codeSnippet: `import google.generativeai as genai\n\nai = genai.GoogleGenAI(api_key="GEMINI_API_KEY")\nresponse = ai.models.generate_content(\n    model="gemini-3.5-flash",\n    contents="Generate parametric coordinates for standard quantum harmonic oscillator probability distributions in 3D."\n)`,
    generatedOutput: "Successfully compiled 3D coordinate matrices. Wave function amplitudes computed at discrete energy levels E_0, E_1, E_2. Visualized probability cloud clusters utilizing glowing cyan orbital nodes.",
    type: "custom",
  },
  {
    id: "trial-002",
    timestamp: "2026-08-13 11:40 PM",
    title: "Multi-Agent Consensus Protocol Debugging",
    modelName: "gemini-3.1-pro-preview",
    parameters: { temperature: 0.1, maxTokens: 2048, topP: 0.9 },
    codeSnippet: `from google import genai\nfrom google.genai import types\n\nclient = genai.Client()\nresponse = client.models.generate_content(\n    model="gemini-3.1-pro",\n    contents="Analyze Raft consensus failure mode when partition isolates Leader node with uncommitted log entries."\n)`,
    generatedOutput: "ANALYSIS COMPLETED: Under partition, isolated leader fails to receive heartbeats or commit logs from majority. Upon reconciliation, the partition with a higher term ID overwrites isolated log records, reverting stale states safely.",
    type: "reasoning",
  },
  {
    id: "trial-003",
    timestamp: "2026-08-13 09:10 PM",
    title: "Ambient Focus Sound Wave Synthesizer",
    modelName: "lyria-3-audio-core",
    parameters: { temperature: 0.7, maxTokens: 512, topP: 0.99 },
    codeSnippet: `# Dispatch synthesis request to Lyria-3 engine\nrequest = {\n  "prompt": "binaural beats overlay with deep space brownian noise at 40Hz",\n  "duration_seconds": 120\n}`,
    generatedOutput: "Audio stream rendered successfully. Sample rate 48KHz stereo. Deep 40Hz alpha wave synchronization pattern overlaid with high-altitude spatial pads to increase cognitive engagement and focus retention.",
    type: "music",
  }
];

export const AIFeaturesStudio: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<
    "educational" | "animagraph" | "creative" | "grounding" | "perception" | "chat" | "journal"
  >("educational");

  // Lab Journal State
  const [journalEntries, setJournalEntries] = React.useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem("zalamati_lab_journal");
    return saved ? JSON.parse(saved) : PRESET_JOURNAL_ENTRIES;
  });

  // State for adding a new trial entry manually
  const [newTitle, setNewTitle] = React.useState("");
  const [newModel, setNewModel] = React.useState("gemini-3.1-pro");
  const [newTemp, setNewTemp] = React.useState(0.4);
  const [newMaxTokens, setNewMaxTokens] = React.useState(1024);
  const [newCode, setNewCode] = React.useState("");
  const [newOutput, setNewOutput] = React.useState("");
  const [newType, setNewType] = React.useState<JournalEntry["type"]>("custom");

  React.useEffect(() => {
    localStorage.setItem("zalamati_lab_journal", JSON.stringify(journalEntries));
  }, [journalEntries]);

  const handleSaveJournalEntry = (entry: JournalEntry) => {
    setJournalEntries((prev) => [entry, ...prev]);
  };

  const handleDeleteEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleCreateManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const entry: JournalEntry = {
      id: `trial-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString(),
      title: newTitle,
      modelName: newModel,
      parameters: {
        temperature: newTemp,
        maxTokens: newMaxTokens,
        topP: 0.95,
      },
      codeSnippet: newCode || `# Custom Agent Execution Script\nprint("Executing custom pipeline using ${newModel}...")`,
      generatedOutput: newOutput || "Execution completed with status code 0. No exception caught.",
      type: newType,
    };

    handleSaveJournalEntry(entry);
    setNewTitle("");
    setNewCode("");
    setNewOutput("");
  };

  // Creative Studio State
  const [imagePrompt, setImagePrompt] = React.useState(
    "An futuristic AI research laboratory with liquid glass holographic monitors and glowing cyan energy nodes",
  );
  const [aspectRatio, setAspectRatio] = React.useState<string>("16:9");
  const [resolution, setResolution] = React.useState<string>("1K");
  const [isProImage, setIsProImage] = React.useState(false);
  const [generatedImage, setGeneratedImage] = React.useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = React.useState(false);

  // Veo Video State
  const [videoPrompt, setVideoPrompt] = React.useState(
    "Cinematic aerial flythrough of an autonomous neural network processing quantum data streams",
  );
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = React.useState(false);

  // Lyria Music State
  const [musicPrompt, setMusicPrompt] = React.useState(
    "Ambient lofi piano beat with soft vinyl crackle for deep focus study",
  );
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null);
  const [isGeneratingMusic, setIsGeneratingMusic] = React.useState(false);

  // Grounding State
  const [searchQuery, setSearchQuery] = React.useState(
    "Latest breakthroughs in autonomous agentic AI and multi-agent systems 2026",
  );
  const [searchResult, setSearchResult] = React.useState<string | null>(null);
  const [searchSources, setSearchSources] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);

  // Maps Grounding State
  const [mapsQuery, setMapsQuery] = React.useState(
    "Top computer science university research labs and quantum computing centers",
  );
  const [mapsResult, setMapsResult] = React.useState<string | null>(null);
  const [isMapsLoading, setIsMapsLoading] = React.useState(false);

  // Thinking Mode State
  const [thinkingPrompt, setThinkingPrompt] = React.useState(
    "Analyze the time complexity of Raft distributed consensus under network partition scenarios.",
  );
  const [thinkingResult, setThinkingResult] = React.useState<string | null>(null);
  const [isThinking, setIsThinking] = React.useState(false);

  // Chat State
  const [chatModel, setChatModel] = React.useState<"lite" | "pro">("lite");
  const [chatInput, setChatInput] = React.useState("");
  const [chatMessages, setChatMessages] = React.useState<
    Array<{ role: "user" | "assistant"; text: string }>
  >([
    {
      role: "assistant",
      text: "Hello! I am your Gemini 3.1 AI Assistant. How can I help you master your coursework today?",
    },
  ]);
  const [isChatLoading, setIsChatLoading] = React.useState(false);

  // Handlers
  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    setGeneratedImage(null);
    try {
      const res = await fetch("/api/gemini/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imagePrompt,
          aspectRatio,
          resolution,
          isPro: isProImage,
        }),
      });
      const data = await res.json();
      setGeneratedImage(data.imageUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateVideo = async () => {
    setIsGeneratingVideo(true);
    setVideoUrl(null);
    try {
      const res = await fetch("/api/gemini/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: videoPrompt, aspectRatio }),
      });
      const data = await res.json();
      setVideoUrl(data.videoUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleGenerateMusic = async () => {
    setIsGeneratingMusic(true);
    setAudioUrl(null);
    try {
      const res = await fetch("/api/gemini/generate-music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: musicPrompt }),
      });
      const data = await res.json();
      setAudioUrl(data.audioUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  const handleSearchGrounding = async () => {
    setIsSearching(true);
    setSearchResult(null);
    try {
      const res = await fetch("/api/gemini/search-grounding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      setSearchResult(data.result);
      setSearchSources(data.sources || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleMapsGrounding = async () => {
    setIsMapsLoading(true);
    setMapsResult(null);
    try {
      const res = await fetch("/api/gemini/maps-grounding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: mapsQuery }),
      });
      const data = await res.json();
      setMapsResult(data.result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMapsLoading(false);
    }
  };

  const handleHighThinking = async () => {
    setIsThinking(true);
    setThinkingResult(null);
    try {
      const res = await fetch("/api/gemini/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: thinkingPrompt, thinkingMode: true }),
      });
      const data = await res.json();
      setThinkingResult(data.reply);
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/gemini/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMsg,
          thinkingMode: chatModel === "pro",
        }),
      });
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="p-5 md:p-6 rounded-3xl bg-[#0a161f] border border-[#1b3b4a] text-white space-y-6 shadow-2xl animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#163240] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              Multimodal AI Studio
            </span>
            <span className="text-[11px] text-[#7195a6]">
              Powered by Gemini 3.1 Pro, Flash, Veo 3.1 & Lyria 3
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Zalamati Next-Gen AI Feature Studio
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#051117] p-1.5 rounded-2xl border border-[#183848]">
          {[
            { id: "educational", label: "Educational Suite", icon: BookOpen },
            { id: "animagraph", label: "Animagraph 3D Explainer", icon: Rotate3d },
            { id: "creative", label: "Creative Media", icon: Sparkles },
            { id: "grounding", label: "Grounding & Thinking", icon: Globe },
            { id: "chat", label: "Gemini Chatbot", icon: Bot },
            { id: "journal", label: "Lab Journal", icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? "bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-black shadow-md"
                    : "text-[#80a2b3] hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 0. EDUCATIONAL MATERIALS SUITE TAB */}
      {activeTab === "educational" && <EducationalMaterialsStudio />}

      {/* 0.5 ANIMAGRAPH 3D TECHNICAL EXPLAINER TAB */}
      {activeTab === "animagraph" && <AnimagraphTechnicalExplainer />}

      {/* 1. CREATIVE MEDIA TAB */}
      {activeTab === "creative" && (
        <div className="space-y-8">
          {/* Image & Video Generation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Generator Card */}
            <div className="p-5 rounded-2xl bg-[#0e1f2a] border border-[#1d3f50] space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#183848] pb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">
                    Gemini Image Generator
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsProImage(!isProImage)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                      isProImage
                        ? "bg-cyan-950 text-cyan-300 border-cyan-500/40"
                        : "bg-cyan-950 text-cyan-300 border-cyan-500/40"
                    }`}
                  >
                    {isProImage ? "Pro Image Model" : "Flash Image Model"}
                  </button>
                </div>
              </div>

              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-[#051117] border border-[#1a3848] text-xs text-white placeholder-[#5e8293] focus:outline-none focus:border-cyan-400"
                placeholder="Describe image to generate..."
              />

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-[#7297a8] uppercase">
                    Aspect Ratio
                  </label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-[#051117] border border-[#1a3848] text-cyan-300 font-bold focus:outline-none"
                  >
                    {[
                      "1:1",
                      "2:3",
                      "3:2",
                      "3:4",
                      "4:3",
                      "9:16",
                      "16:9",
                      "21:9",
                    ].map((ratio) => (
                      <option key={ratio} value={ratio}>
                        {ratio}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#7297a8] uppercase">
                    Resolution
                  </label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-[#051117] border border-[#1a3848] text-cyan-300 font-bold focus:outline-none"
                  >
                    {["1K", "2K", "4K"].map((res) => (
                      <option key={res} value={res}>
                        {res}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateImage}
                disabled={isGeneratingImage}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-2"
              >
                {isGeneratingImage ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>
                  {isGeneratingImage ? "Generating Image..." : "Generate Image"}
                </span>
              </button>

              {generatedImage && (
                <div className="rounded-xl overflow-hidden border border-[#1a3848] bg-[#051117] p-2">
                  <img
                    src={generatedImage}
                    alt="Generated AI preview"
                    className="w-full rounded-lg object-cover"
                  />
                </div>
              )}
            </div>

            {/* Veo Video Generator Card */}
            <div className="p-5 rounded-2xl bg-[#0e1f2a] border border-[#1d3f50] space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#183848] pb-3">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">
                    Veo Video Generator (`veo-3.1-fast-generate-preview`)
                  </h3>
                </div>
              </div>

              <textarea
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-[#051117] border border-[#1a3848] text-xs text-white placeholder-[#5e8293] focus:outline-none focus:border-cyan-400"
                placeholder="Describe video clip to generate..."
              />

              <button
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black text-xs shadow-md flex items-center justify-center gap-2"
              >
                {isGeneratingVideo ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Video className="w-4 h-4" />
                )}
                <span>
                  {isGeneratingVideo
                    ? "Rendering Veo Video..."
                    : "Generate Veo Video"}
                </span>
              </button>

              {videoUrl && (
                <div className="rounded-xl overflow-hidden border border-[#1a3848] bg-[#051117] p-2">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full rounded-lg"
                    autoPlay
                    loop
                    muted
                  />
                </div>
              )}
            </div>
          </div>

          {/* Lyria Music Generator */}
          <div className="p-5 rounded-2xl bg-[#0e1f2a] border border-[#1d3f50] space-y-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-[#183848] pb-3">
              <Music className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Lyria Music Generator (`lyria-3-clip-preview`)
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={musicPrompt}
                onChange={(e) => setMusicPrompt(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#051117] border border-[#1a3848] text-xs text-white placeholder-[#5e8293] focus:outline-none focus:border-cyan-400"
                placeholder="Describe music style or mood..."
              />

              <button
                onClick={handleGenerateMusic}
                disabled={isGeneratingMusic}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-2 shrink-0"
              >
                {isGeneratingMusic ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Music className="w-4 h-4" />
                )}
                <span>
                  {isGeneratingMusic ? "Synthesizing..." : "Generate Music"}
                </span>
              </button>
            </div>

            {audioUrl && (
              <div className="p-3 rounded-xl bg-[#051117] border border-cyan-500/30 flex items-center gap-4">
                <Music className="w-5 h-5 text-cyan-400 shrink-0" />
                <audio src={audioUrl} controls className="w-full" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. GROUNDING & THINKING TAB */}
      {activeTab === "grounding" && (
        <div className="space-y-6">
          {/* Google Search Grounding */}
          <div className="p-5 rounded-2xl bg-[#0e1f2a] border border-[#1d3f50] space-y-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-[#183848] pb-3">
              <Globe className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Google Search Grounding (`gemini-3.5-flash` + Search)
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#051117] border border-[#1a3848] text-xs text-white focus:outline-none focus:border-cyan-400"
              />

              <button
                onClick={handleSearchGrounding}
                disabled={isSearching}
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md flex items-center gap-2 shrink-0"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Globe className="w-4 h-4" />
                )}
                <span>Search Live Web</span>
              </button>
            </div>

            {searchResult && (
              <div className="p-4 rounded-xl bg-[#051117] border border-[#1a3848] text-xs text-[#a2c2d1] leading-relaxed space-y-3">
                <div>{searchResult}</div>
                {searchSources.length > 0 && (
                  <div className="pt-2 border-t border-[#122b38] flex flex-wrap gap-2 text-[10px]">
                    <span className="font-bold text-cyan-400">Sources:</span>
                    {searchSources.map((s, idx) => (
                      <a
                        key={idx}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-300 underline hover:text-white"
                      >
                        {s.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* High Thinking Mode */}
          <div className="p-5 rounded-2xl bg-[#0e1f2a] border border-[#1d3f50] space-y-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-[#183848] pb-3">
              <Brain className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                High Thinking Mode (`gemini-3.1-pro-preview` High Reasoning)
              </h3>
            </div>

            <textarea
              value={thinkingPrompt}
              onChange={(e) => setThinkingPrompt(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl bg-[#051117] border border-[#1a3848] text-xs text-white focus:outline-none focus:border-cyan-400"
            />

            <button
              onClick={handleHighThinking}
              disabled={isThinking}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md flex items-center gap-2"
            >
              {isThinking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Brain className="w-4 h-4" />
              )}
              <span>
                {isThinking ? "Thinking Deeply..." : "Execute Deep Reasoning"}
              </span>
            </button>

            {thinkingResult && (
              <div className="p-4 rounded-xl bg-[#051117] border border-cyan-500/30 text-xs text-cyan-200 leading-relaxed font-mono whitespace-pre-wrap">
                {thinkingResult}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. GEMINI CHATBOT TAB */}
      {activeTab === "chat" && (
        <div className="p-5 rounded-2xl bg-[#0e1f2a] border border-[#1d3f50] space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#183848] pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Gemini Multi-Turn AI Chatbot
              </h3>
            </div>

            <div className="flex items-center gap-1.5 bg-[#051117] p-1 rounded-xl border border-[#183848]">
              <button
                onClick={() => setChatModel("lite")}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  chatModel === "lite"
                    ? "bg-cyan-500 text-slate-950"
                    : "text-[#7297a8]"
                }`}
              >
                Flash-Lite
              </button>
              <button
                onClick={() => setChatModel("pro")}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  chatModel === "pro"
                    ? "bg-cyan-500 text-white"
                    : "text-[#7297a8]"
                }`}
              >
                Pro Thinking
              </button>
            </div>
          </div>

          <div className="min-h-[260px] max-h-[360px] overflow-y-auto p-4 rounded-xl bg-[#051117] border border-[#1a3848] space-y-3">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 text-xs leading-relaxed ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-cyan-600 text-white rounded-br-none"
                      : "bg-[#10222e] text-[#b0d2e0] border border-[#1c3e50] rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex items-center gap-2 text-xs text-cyan-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Gemini is thinking...</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
              placeholder="Ask Gemini anything about your courses..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#051117] border border-[#1a3848] text-xs text-white focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleSendChat}
              disabled={isChatLoading}
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. LAB JOURNAL TAB */}
      {activeTab === "journal" && (
        <div className="space-y-6">
          {/* Key Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#091e2b] border border-[#183f54] flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-300">Total Trials</span>
              <span className="text-2xl font-black mt-2 text-white">{journalEntries.length}</span>
              <span className="text-[10px] text-gray-400 mt-1">Durable in LocalStorage</span>
            </div>
            <div className="p-4 rounded-xl bg-[#091e2b] border border-[#183f54] flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-300">Avg Temperature</span>
              <span className="text-2xl font-black mt-2 text-white">
                {(journalEntries.reduce((acc, curr) => acc + curr.parameters.temperature, 0) / (journalEntries.length || 1)).toFixed(2)}
              </span>
              <span className="text-[10px] text-gray-400 mt-1">Target range: 0.1 - 0.7</span>
            </div>
            <div className="p-4 rounded-xl bg-[#091e2b] border border-[#183f54] flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-300">Primary Core</span>
              <span className="text-xl font-bold mt-2 text-white truncate">
                {journalEntries.length > 0 ? journalEntries[0].modelName : "N/A"}
              </span>
              <span className="text-[10px] text-gray-400 mt-1">Latest deployed model</span>
            </div>
            <div className="p-4 rounded-xl bg-[#091e2b] border border-[#183f54] flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-300">Core Engine</span>
              <span className="text-2xl font-black mt-2 text-cyan-400">ACTIVATED</span>
              <span className="text-[10px] text-gray-400 mt-1">Auto-logs API handshakes</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Create New Experiment Trial form */}
            <div className="p-5 rounded-2xl bg-[#0e1f2a] border border-[#1d3f50] space-y-4 shadow-xl h-fit lg:col-span-1">
              <div className="flex items-center gap-2 border-b border-[#183848] pb-3">
                <Plus className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Log Experiment Trial</h3>
              </div>

              <form onSubmit={handleCreateManualEntry} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-[#7297a8] uppercase mb-1">Experiment Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Raft Consensus Debugging"
                    required
                    className="w-full p-2.5 rounded-xl bg-[#051117] border border-[#1a3848] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-[#7297a8] uppercase mb-1">Model core</label>
                    <select
                      value={newModel}
                      onChange={(e) => setNewModel(e.target.value)}
                      className="w-full p-2 rounded-xl bg-[#051117] border border-[#1a3848] text-cyan-300 focus:outline-none"
                    >
                      <option value="gemini-3.1-pro">gemini-3.1-pro</option>
                      <option value="gemini-3.5-flash">gemini-3.5-flash</option>
                      <option value="lyria-3-audio">lyria-3-audio</option>
                      <option value="veo-3.1-video">veo-3.1-video</option>
                      <option value="custom-agent-v4">custom-agent-v4</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#7297a8] uppercase mb-1">Category</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full p-2 rounded-xl bg-[#051117] border border-[#1a3848] text-cyan-300 focus:outline-none"
                    >
                      <option value="custom">Custom</option>
                      <option value="reasoning">Reasoning</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="music">Music</option>
                      <option value="grounding">Grounding</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-[#7297a8] uppercase mb-1">Temp ({newTemp})</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={newTemp}
                      onChange={(e) => setNewTemp(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#7297a8] uppercase mb-1">Max tokens ({newMaxTokens})</label>
                    <input
                      type="range"
                      min="256"
                      max="4096"
                      step="256"
                      value={newMaxTokens}
                      onChange={(e) => setNewMaxTokens(parseInt(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold text-[#7297a8] uppercase">Code snippet (Python/JS)</label>
                    <Code className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <textarea
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    rows={4}
                    placeholder={`import google.generativeai as genai\n# custom parameters`}
                    className="w-full p-2.5 rounded-xl bg-[#051117] border border-[#1a3848] text-[11px] font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#7297a8] uppercase mb-1">Generated output / evaluation</label>
                  <textarea
                    value={newOutput}
                    onChange={(e) => setNewOutput(e.target.value)}
                    rows={3}
                    placeholder="Results or error metrics returned from execution..."
                    className="w-full p-2.5 rounded-xl bg-[#051117] border border-[#1a3848] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Trial Entry</span>
                </button>
              </form>
            </div>

            {/* Right: History List & Code Display */}
            <div className="space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Logged Agent Trials</h3>
                </div>
                <button
                  onClick={() => {
                    if (confirm("Clear all trial records?")) {
                      setJournalEntries([]);
                      localStorage.removeItem("zalamati_lab_journal");
                    }
                  }}
                  className="text-[10px] text-gray-500 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Wipe Log</span>
                </button>
              </div>

              {journalEntries.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#0e1f2a]/40 border border-[#1c3e50]/40 text-center space-y-2">
                  <FileText className="w-8 h-8 text-cyan-500/30 mx-auto animate-pulse" />
                  <p className="text-xs text-[#7195a6]">No experiment records indexed in this session.</p>
                  <p className="text-[10px] text-gray-500">Run some trials or add one using the parameters form on the left.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
                  {journalEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-5 rounded-xl bg-[#0a1822] border border-[#193a4d] hover:border-cyan-500/40 transition-colors space-y-4 relative group"
                    >
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/40 text-gray-400 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete trial record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="space-y-1">
                          <h4 className="text-sm font-extrabold text-white">{entry.title}</h4>
                          <div className="flex items-center gap-2 text-[10px] text-[#7195a6]">
                            <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/20">
                              {entry.modelName}
                            </span>
                            <span>•</span>
                            <span className="capitalize text-cyan-400">{entry.type}</span>
                            <span>•</span>
                            <span>{entry.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      {/* Code block & Parameters */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-[10px] text-[#a0c2d2] font-mono bg-[#030d12] px-2 py-1.5 rounded-lg border border-[#112d3c]">
                          <span>TEMP: <strong className="text-cyan-300">{entry.parameters.temperature}</strong></span>
                          <span>TOKENS: <strong className="text-cyan-300">{entry.parameters.maxTokens}</strong></span>
                          <span>TOP_P: <strong className="text-cyan-300">{entry.parameters.topP}</strong></span>
                        </div>

                        {entry.codeSnippet && (
                          <div className="relative">
                            <div className="absolute top-2 right-2 text-[10px] text-gray-500">python</div>
                            <pre className="p-3 rounded-lg bg-[#03090e] border border-[#132c3a] text-[10.5px] font-mono text-cyan-200 overflow-x-auto max-h-[140px] whitespace-pre-wrap leading-relaxed">
                              {entry.codeSnippet}
                            </pre>
                          </div>
                        )}
                      </div>

                      {/* Output section */}
                      {entry.generatedOutput && (
                        <div className="p-3 rounded-lg bg-[#0e1f2a] border-l-2 border-cyan-400 text-xs text-[#c1d8e2] leading-relaxed">
                          <div className="text-[10px] font-bold text-cyan-400 mb-1 uppercase tracking-wider">Generated Output & Trials Evaluation:</div>
                          <p>{entry.generatedOutput}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
