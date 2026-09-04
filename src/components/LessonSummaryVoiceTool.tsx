import React from "react";
import {
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Mic,
  MicOff,
  Copy,
  Check,
  Download,
  BookOpen,
  HelpCircle,
  FileText,
  Lightbulb,
  Zap,
  Bookmark,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Sliders,
  Send,
  Trash2,
} from "lucide-react";
import { ApiService } from "../shared/api.service";
import { toastService } from "../services/toastService";

export interface LessonSummaryVoiceToolProps {
  lessonTitle: string;
  lessonContent?: string;
  courseTitle?: string;
  keyTakeaways?: string[];
  lessonId: string;
  onSaveNoteToJournal?: (note: string) => void;
  className?: string;
}

interface SummaryData {
  lessonTitle: string;
  courseTitle: string;
  executiveTLDR: string;
  coreConcepts: string[];
  keyMechanisms: string[];
  strategicTakeaways: string[];
  socraticReflection: string;
  fullMarkdown: string;
}

export const LessonSummaryVoiceTool: React.FC<LessonSummaryVoiceToolProps> = ({
  lessonTitle,
  lessonContent = "",
  courseTitle = "Course",
  keyTakeaways = [],
  lessonId,
  onSaveNoteToJournal,
  className = "",
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [summaryData, setSummaryData] = React.useState<SummaryData | null>(null);
  const [copied, setCopied] = React.useState<boolean>(false);

  // Audio Playback State
  const [isPlayingAudio, setIsPlayingAudio] = React.useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = React.useState<number>(1.0);
  const [voicePersona, setVoicePersona] = React.useState<"petra" | "nashmi">("petra");
  const [activeSpeechSegment, setActiveSpeechSegment] = React.useState<number>(-1);

  // Voice Note Dictation / STT
  const [isRecordingVoiceNote, setIsRecordingVoiceNote] = React.useState<boolean>(false);
  const [dictatedVoiceNote, setDictatedVoiceNote] = React.useState<string>("");
  const recognitionRef = React.useRef<any>(null);

  // Auto-generate summary when lesson changes
  React.useEffect(() => {
    fetchLessonSummary();
    return () => {
      stopAudio();
      stopVoiceRecording();
    };
  }, [lessonTitle, lessonId]);

  const fetchLessonSummary = async () => {
    setIsLoading(true);
    stopAudio();
    try {
      const data = await ApiService.generateLessonSummary({
        lessonTitle,
        lessonContent,
        courseTitle,
        keyTakeaways,
      });
      setSummaryData(data);
    } catch (err) {
      console.warn("Summary generation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Web Speech API - Text-to-Speech
  const startAudioNarration = () => {
    if (!summaryData) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toastService.warning("Speech synthesis is not supported on this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const script = `
      Executive Summary for ${summaryData.lessonTitle}.
      ${summaryData.executiveTLDR}.
      Key Core Concepts: ${summaryData.coreConcepts.join(". ")}.
      Key Mechanisms: ${summaryData.keyMechanisms.join(". ")}.
      Strategic Takeaways: ${summaryData.strategicTakeaways.join(". ")}.
      Socratic Reflection Question: ${summaryData.socraticReflection}
    `.replace(/[*#`_]/g, "");

    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = playbackSpeed;
    utterance.pitch = voicePersona === "petra" ? 1.05 : 0.95;

    // Pick appropriate system voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (voicePersona === "petra") {
        const femaleVoice = voices.find((v) =>
          v.name.includes("Female") || v.name.includes("Samantha") || v.name.includes("Victoria") || v.name.includes("Google UK English Female")
        );
        if (femaleVoice) utterance.voice = femaleVoice;
      } else {
        const maleVoice = voices.find((v) =>
          v.name.includes("Male") || v.name.includes("Alex") || v.name.includes("Daniel") || v.name.includes("Google UK English Male")
        );
        if (maleVoice) utterance.voice = maleVoice;
      }
    }

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  // Web Speech API - Speech-to-Text / Voice Note Dictation
  const toggleVoiceRecording = () => {
    if (isRecordingVoiceNote) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const startVoiceRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toastService.warning("Speech recognition is not supported in this browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setDictatedVoiceNote((prev) => (prev ? prev + " " + transcript : transcript));
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsRecordingVoiceNote(false);
      };

      recognition.onend = () => {
        setIsRecordingVoiceNote(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecordingVoiceNote(true);
      toastService.info("Listening... Speak your lesson reflections or questions.");
    } catch (err) {
      console.warn("Mic start error:", err);
      toastService.warning("Could not access microphone.");
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsRecordingVoiceNote(false);
  };

  const handleCopySummary = () => {
    if (!summaryData) return;
    navigator.clipboard.writeText(summaryData.fullMarkdown);
    setCopied(true);
    toastService.success("Summary copied to clipboard in markdown format!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveDictation = () => {
    if (!dictatedVoiceNote.trim()) return;
    const finalNote = `[Voice Note on ${lessonTitle} - ${new Date().toLocaleTimeString()}]:\n${dictatedVoiceNote}`;
    
    // Save to local storage note attached to lesson
    const storageKey = `lesson_notes_${lessonId}`;
    const existing = localStorage.getItem(storageKey) || "";
    const updated = existing ? existing + "\n\n" + finalNote : finalNote;
    localStorage.setItem(storageKey, updated);

    if (onSaveNoteToJournal) {
      onSaveNoteToJournal(finalNote);
    }

    toastService.success("Voice note saved to Study Journal!");
    setDictatedVoiceNote("");
  };

  return (
    <div
      className={`bg-[#08151c] text-slate-100 rounded-3xl border border-[#1b3b4a] shadow-2xl p-6 space-y-6 animate-in fade-in duration-200 ${className}`}
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1b3b4a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-950/40">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                Gemini Multi-Modal Synthesizer
              </span>
              <span className="text-xs text-[#7ba4b8] font-bold">Real-Time Audio & Text</span>
            </div>
            <h3 className="text-base font-black text-white mt-0.5">
              Executive Lesson Takeaways: {lessonTitle}
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Refresh Summary */}
          <button
            onClick={fetchLessonSummary}
            disabled={isLoading}
            className="p-2 rounded-xl bg-[#0e222e] hover:bg-[#153444] text-[#7ba4b8] hover:text-white border border-[#1b3b4a] transition-all disabled:opacity-50"
            title="Regenerate Executive Summary"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-cyan-400" : ""}`} />
          </button>

          {/* Copy Markdown */}
          <button
            onClick={handleCopySummary}
            disabled={!summaryData}
            className="p-2 rounded-xl bg-[#0e222e] hover:bg-[#153444] text-[#7ba4b8] hover:text-white border border-[#1b3b4a] transition-all"
            title="Copy Markdown Summary"
          >
            {copied ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Audio Narration Bar */}
      <div className="p-4 rounded-2xl bg-[#06141c] border border-[#142e3b] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={isPlayingAudio ? stopAudio : startAudioNarration}
            disabled={!summaryData || isLoading}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold transition-all shadow-lg ${
              isPlayingAudio
                ? "bg-cyan-500 text-white shadow-cyan-950/50 hover:bg-cyan-600"
                : "bg-gradient-to-tr from-cyan-500 to-cyan-400 text-slate-950 shadow-cyan-950/50 hover:scale-105 active:scale-95"
            }`}
          >
            {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                {isPlayingAudio ? "Streaming Neural Narration..." : "Listen to Lesson Audio Brief"}
              </span>
              {isPlayingAudio && (
                <span className="flex items-center gap-0.5 h-3">
                  <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_0.6s_infinite_100ms] h-full" />
                  <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_0.6s_infinite_200ms] h-full" />
                  <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_0.6s_infinite_300ms] h-full" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#7ba4b8]">
              Narrated by {voicePersona === "petra" ? "Petra (Hostess)" : "Nashmi (Advisor)"}
            </p>
          </div>
        </div>

        {/* Voice Persona & Speed Adjusters */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Persona Switch */}
          <div className="flex items-center bg-[#0a1f2b] p-1 rounded-xl border border-[#1b3b4a]">
            <button
              onClick={() => {
                setVoicePersona("petra");
                if (isPlayingAudio) stopAudio();
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                voicePersona === "petra"
                  ? "bg-cyan-500 text-slate-950"
                  : "text-[#7ba4b8] hover:text-white"
              }`}
            >
              👩‍🏫 Petra
            </button>
            <button
              onClick={() => {
                setVoicePersona("nashmi");
                if (isPlayingAudio) stopAudio();
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                voicePersona === "nashmi"
                  ? "bg-cyan-500 text-slate-950"
                  : "text-[#7ba4b8] hover:text-white"
              }`}
            >
              👨‍💼 Nashmi
            </button>
          </div>

          {/* Speed Selector */}
          <select
            value={playbackSpeed}
            onChange={(e) => {
              setPlaybackSpeed(parseFloat(e.target.value));
              if (isPlayingAudio) stopAudio();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-[#0a1f2b] border border-[#1b3b4a] text-xs font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="0.75">0.75x</option>
            <option value="1.0">1.0x Normal</option>
            <option value="1.25">1.25x Fast</option>
            <option value="1.5">1.5x Accelerated</option>
            <option value="2.0">2.0x Rapid</option>
          </select>
        </div>
      </div>

      {/* Main Content Body */}
      {isLoading ? (
        <div className="p-12 text-center space-y-3">
          <div className="w-9 h-9 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-cyan-300 font-semibold">
            Distilling high-yield concepts & mechanisms with Gemini...
          </p>
        </div>
      ) : summaryData ? (
        <div className="space-y-6">
          {/* Executive TLDR Banner */}
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 block">
              📌 Executive TL;DR
            </span>
            <p className="text-sm font-semibold text-slate-100 leading-relaxed">
              {summaryData.executiveTLDR}
            </p>
          </div>

          {/* Structured Key Insight Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Core Concepts */}
            <div className="p-4 rounded-2xl bg-[#091b24] border border-[#1b3b4a] space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-cyan-400" />
                <span>Core Concepts</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-200">
                {summaryData.coreConcepts.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Mechanisms */}
            <div className="p-4 rounded-2xl bg-[#091b24] border border-[#1b3b4a] space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Key Mechanisms</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-200">
                {summaryData.keyMechanisms.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Strategic Action Steps */}
          <div className="p-4 rounded-2xl bg-[#091b24] border border-[#1b3b4a] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Strategic Takeaways & Practical Action Steps</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-200">
              {summaryData.strategicTakeaways.map((item, idx) => (
                <li
                  key={idx}
                  className="p-3 rounded-xl bg-[#06141c] border border-[#142e3b] leading-relaxed flex items-start gap-2"
                >
                  <span className="font-bold text-cyan-400 shrink-0">{idx + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Socratic Reflection Box */}
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Socratic Reflection Prompt</span>
            </div>
            <p className="text-xs text-cyan-100 font-medium italic leading-relaxed">
              "{summaryData.socraticReflection}"
            </p>
          </div>
        </div>
      ) : null}

      {/* Voice-to-Text Dictation & Journal Pad */}
      <div className="pt-4 border-t border-[#1b3b4a] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Voice Study Journal & Question Pad
            </span>
          </div>
          <button
            onClick={toggleVoiceRecording}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              isRecordingVoiceNote
                ? "bg-cyan-500 text-white border-cyan-400 animate-pulse shadow-lg shadow-cyan-950/50"
                : "bg-[#0e222e] hover:bg-[#153444] text-cyan-300 border-[#1b3b4a]"
            }`}
          >
            {isRecordingVoiceNote ? (
              <>
                <MicOff className="w-3.5 h-3.5" />
                <span>Stop Recording</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" />
                <span>Dictate Voice Note</span>
              </>
            )}
          </button>
        </div>

        {/* Dictation Input / Editor */}
        <div className="relative">
          <textarea
            value={dictatedVoiceNote}
            onChange={(e) => setDictatedVoiceNote(e.target.value)}
            placeholder="Click 'Dictate Voice Note' to speak, or type your custom lesson insights..."
            rows={2}
            className="w-full p-3.5 rounded-2xl bg-[#06141c] border border-[#163342] text-xs text-slate-100 placeholder-[#4f7082] focus:outline-none focus:border-cyan-400 resize-none"
          />
          {dictatedVoiceNote && (
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button
                onClick={() => setDictatedVoiceNote("")}
                className="p-1 rounded-lg text-slate-500 hover:text-cyan-400"
                title="Clear"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleSaveDictation}
                className="px-3 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md"
              >
                <Send className="w-3 h-3" />
                <span>Save to Journal</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
