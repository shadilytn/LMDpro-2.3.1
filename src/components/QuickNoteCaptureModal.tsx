import React from 'react';
import {
  StickyNote,
  Mic,
  MicOff,
  Save,
  Trash2,
  Copy,
  Download,
  X,
  Sparkles,
  Tag,
  Clock,
  Check,
  FileText,
  Volume2,
  Edit3,
  Bookmark,
  Search,
  Plus
} from 'lucide-react';
import { toastService } from '../services/toastService';

export interface LessonNote {
  id: string;
  courseId: string;
  courseTitle: string;
  lessonId: string;
  lessonTitle: string;
  content: string;
  tags: string[];
  type: 'text' | 'voice';
  timestamp: string;
  durationSeconds?: number;
}

interface QuickNoteCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  lessonId: string;
  lessonTitle: string;
  onNoteSaved?: (note: LessonNote) => void;
}

export const QuickNoteCaptureModal: React.FC<QuickNoteCaptureModalProps> = ({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  lessonId,
  lessonTitle,
  onNoteSaved,
}) => {
  const [content, setContent] = React.useState('');
  const [selectedTag, setSelectedTag] = React.useState<string>('Key Concept');
  const [customTagInput, setCustomTagInput] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'write' | 'saved_notes'>('write');
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordingTime, setRecordingTime] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [savedNotes, setSavedNotes] = React.useState<LessonNote[]>([]);
  const [copiedNoteId, setCopiedNoteId] = React.useState<string | null>(null);

  const recognitionRef = React.useRef<any>(null);
  const timerRef = React.useRef<any>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = React.useRef<number | null>(null);

  const predefinedTags = ['Key Concept', 'Question', 'Summary', 'Exam Prep', 'Action Item', 'Code Snippet'];

  // Load existing notes for this lesson
  React.useEffect(() => {
    if (!lessonId) return;
    try {
      const storageKey = `lmdpro_notes_${courseId}`;
      const existing = localStorage.getItem(storageKey);
      if (existing) {
        const allNotes: LessonNote[] = JSON.parse(existing);
        const lessonNotes = allNotes.filter((n) => n.lessonId === lessonId);
        setSavedNotes(lessonNotes);
      } else {
        setSavedNotes([]);
      }
    } catch (e) {
      console.error('Failed to load lesson notes:', e);
      setSavedNotes([]);
    }
  }, [courseId, lessonId, isOpen]);

  // Voice recording & Speech recognition setup
  React.useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setContent((prev) => (prev ? `${prev} ${transcript.trim()}` : transcript.trim()));
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          toastService.error('Microphone access denied. Please enable mic permissions.');
        }
        stopRecording();
      };

      recognition.onend = () => {
        if (isRecording) {
          setIsRecording(false);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  // Audio wave visualizer animation
  React.useEffect(() => {
    if (!isRecording || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 32;
      const barWidth = canvas.width / bars - 2;

      for (let i = 0; i < bars; i++) {
        const height = Math.sin(phase + i * 0.3) * 16 + Math.random() * 20 + 8;
        const x = i * (barWidth + 2);
        const y = (canvas.height - height) / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + height);
        grad.addColorStop(0, '#22d3ee');
        grad.addColorStop(1, '#06b6d4');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, height, 4);
        ctx.fill();
      }

      phase += 0.15;
      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRecording]);

  const startRecording = () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      toastService.info('Voice capture active. Speak clearly into your microphone.');
    } catch (e) {
      console.warn('Recognition start failed:', e);
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSaveNote = () => {
    if (!content.trim()) {
      toastService.error('Please enter or dictate a note before saving.');
      return;
    }

    if (isRecording) {
      stopRecording();
    }

    const finalTags = [selectedTag];
    if (customTagInput.trim() && !finalTags.includes(customTagInput.trim())) {
      finalTags.push(customTagInput.trim());
    }

    const newNote: LessonNote = {
      id: `note-${Date.now()}`,
      courseId,
      courseTitle,
      lessonId,
      lessonTitle,
      content: content.trim(),
      tags: finalTags,
      type: recordingTime > 0 ? 'voice' : 'text',
      timestamp: new Date().toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      durationSeconds: recordingTime > 0 ? recordingTime : undefined,
    };

    try {
      const storageKey = `lmdpro_notes_${courseId}`;
      const existing = localStorage.getItem(storageKey);
      const allNotes: LessonNote[] = existing ? JSON.parse(existing) : [];
      const updated = [newNote, ...allNotes];
      localStorage.setItem(storageKey, JSON.stringify(updated));

      // Also update general notes index
      const globalKey = 'lmdpro_all_student_notes';
      const globalExisting = localStorage.getItem(globalKey);
      const allGlobal: LessonNote[] = globalExisting ? JSON.parse(globalExisting) : [];
      localStorage.setItem(globalKey, JSON.stringify([newNote, ...allGlobal]));

      setSavedNotes((prev) => [newNote, ...prev]);
      setContent('');
      setRecordingTime(0);
      setCustomTagInput('');
      toastService.success(`Note saved for "${lessonTitle}"!`);
      if (onNoteSaved) onNoteSaved(newNote);
    } catch (e) {
      console.error('Failed to save note:', e);
      toastService.error('Error saving note to local storage.');
    }
  };

  const handleDeleteNote = (noteId: string) => {
    try {
      const storageKey = `lmdpro_notes_${courseId}`;
      const existing = localStorage.getItem(storageKey);
      if (existing) {
        const allNotes: LessonNote[] = JSON.parse(existing);
        const filtered = allNotes.filter((n) => n.id !== noteId);
        localStorage.setItem(storageKey, JSON.stringify(filtered));
        setSavedNotes((prev) => prev.filter((n) => n.id !== noteId));
        toastService.info('Note removed.');
      }
    } catch (e) {
      console.error('Failed to delete note:', e);
    }
  };

  const handleCopyNote = (note: LessonNote) => {
    navigator.clipboard.writeText(
      `[${note.tags.join(', ')}] ${note.lessonTitle} (${note.timestamp}):\n${note.content}`
    );
    setCopiedNoteId(note.id);
    setTimeout(() => setCopiedNoteId(null), 2000);
    toastService.success('Note copied to clipboard.');
  };

  const handleExportAllNotes = () => {
    if (savedNotes.length === 0) {
      toastService.info('No saved notes to export.');
      return;
    }
    const markdown = `# Notes: ${courseTitle}\nLesson: ${lessonTitle}\nExported: ${new Date().toLocaleString()}\n\n---\n\n` +
      savedNotes
        .map(
          (n, idx) =>
            `### Note ${idx + 1} (${n.timestamp})\n**Tags:** ${n.tags.join(', ')} | **Type:** ${n.type}\n\n${n.content}\n\n---`
        )
        .join('\n\n');

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${lessonId}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toastService.success('Notes exported as Markdown file.');
  };

  const appendMarkdownFormat = (prefix: string, suffix: string = '') => {
    setContent((prev) => `${prev} ${prefix}text${suffix} `);
  };

  const filteredNotes = savedNotes.filter(
    (n) =>
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <div
      id="quick-note-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl bg-[#0c1a24] border border-[#1b3b4a] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-[#09151d] border-b border-[#1b3b4a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <StickyNote className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white tracking-wide">Quick Lesson Notes & Voice Memo</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {savedNotes.length} saved
                </span>
              </div>
              <p className="text-xs text-[#789cae] truncate max-w-md">
                Attached to: <span className="text-cyan-300 font-semibold">{lessonTitle}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex p-1 rounded-xl bg-[#08151c] border border-[#1b3b4a]">
              <button
                onClick={() => setActiveTab('write')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'write'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-[#789cae] hover:text-white'
                }`}
              >
                Capture Note
              </button>
              <button
                onClick={() => setActiveTab('saved_notes')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'saved_notes'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-[#789cae] hover:text-white'
                }`}
              >
                <span>Saved ({savedNotes.length})</span>
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#789cae] hover:text-white hover:bg-[#1b3b4a] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'write' ? (
            <>
              {/* Category Tag Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#789cae] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Category Tag</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {predefinedTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                        selectedTag === tag
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/40'
                          : 'bg-[#08151c] border-[#1b3b4a] text-[#789cae] hover:text-slate-200 hover:border-cyan-500/40'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Formatting Helper Buttons */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-[#789cae] uppercase tracking-wider mr-1">Format:</span>
                <button
                  onClick={() => appendMarkdownFormat('**', '**')}
                  className="px-2 py-0.5 rounded-lg bg-[#08151c] border border-[#1b3b4a] text-[11px] text-[#789cae] hover:text-white"
                  title="Bold"
                >
                  <b>B</b>
                </button>
                <button
                  onClick={() => appendMarkdownFormat('`', '`')}
                  className="px-2 py-0.5 rounded-lg bg-[#08151c] border border-[#1b3b4a] text-[11px] text-[#789cae] hover:text-white"
                  title="Code snippet"
                >
                  &lt;/&gt;
                </button>
                <button
                  onClick={() => appendMarkdownFormat('\n- ')}
                  className="px-2 py-0.5 rounded-lg bg-[#08151c] border border-[#1b3b4a] text-[11px] text-[#789cae] hover:text-white"
                  title="Bullet item"
                >
                  • List
                </button>
                <button
                  onClick={() => appendMarkdownFormat('### ')}
                  className="px-2 py-0.5 rounded-lg bg-[#08151c] border border-[#1b3b4a] text-[11px] text-[#789cae] hover:text-white"
                  title="Heading"
                >
                  H3
                </button>
              </div>

              {/* Text Area */}
              <div className="relative">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type your notes, observations, formulas, or key takeaways for this lesson..."
                  className="w-full h-40 bg-[#08151c] border border-[#1b3b4a] rounded-2xl p-4 text-white text-sm focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none resize-none placeholder:text-slate-500 leading-relaxed"
                />
                {content && (
                  <button
                    onClick={() => setContent('')}
                    className="absolute top-3 right-3 text-xs text-[#789cae] hover:text-cyan-400"
                    title="Clear content"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Voice Note Visualizer & Dictation Banner */}
              {isRecording && (
                <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping" />
                    <span>Listening & Dictating ({recordingTime}s)...</span>
                  </div>
                  <canvas ref={canvasRef} width={280} height={40} className="w-full max-w-xs h-10" />
                </div>
              )}
            </>
          ) : (
            /* Saved Notes Tab */
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#789cae] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notes or tags..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#08151c] border border-[#1b3b4a] text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
                  />
                </div>
                {savedNotes.length > 0 && (
                  <button
                    onClick={handleExportAllNotes}
                    className="px-3 py-1.5 rounded-xl bg-[#1b3b4a] hover:bg-[#234d61] text-xs font-bold text-cyan-300 flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export (.md)</span>
                  </button>
                )}
              </div>

              {filteredNotes.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#122e3e] flex items-center justify-center mx-auto text-[#789cae]">
                    <StickyNote className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-300">No notes captured for this lesson yet.</p>
                  <p className="text-xs text-[#789cae] max-w-xs mx-auto">
                    Switch to the "Capture Note" tab to jot down notes or record a voice memo!
                  </p>
                  <button
                    onClick={() => setActiveTab('write')}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Create First Note
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-2xl bg-[#08151c] border border-[#1b3b4a] hover:border-cyan-500/40 transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          {note.tags.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800"
                            >
                              #{t}
                            </span>
                          ))}
                          {note.type === 'voice' && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1">
                              <Volume2 className="w-2.5 h-2.5" /> Voice
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[#789cae]">
                          <span className="text-[11px]">{note.timestamp}</span>
                          <button
                            onClick={() => handleCopyNote(note)}
                            className="p-1 rounded hover:text-white"
                            title="Copy Note"
                          >
                            {copiedNoteId === note.id ? (
                              <Check className="w-3.5 h-3.5 text-cyan-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-1 rounded hover:text-cyan-400"
                            title="Delete Note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {activeTab === 'write' && (
          <div className="p-4 bg-[#09151d] border-t border-[#1b3b4a] flex items-center justify-between gap-3">
            {/* Voice Dictation Toggle */}
            <button
              onClick={toggleRecording}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all border ${
                isRecording
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-950/40 animate-pulse'
                  : 'bg-[#08151c] border-[#1b3b4a] text-cyan-300 hover:border-cyan-400 hover:bg-cyan-950/20'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-4 h-4" /> Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" /> Voice Dictate
                </>
              )}
            </button>

            {/* Save Note Button */}
            <button
              onClick={handleSaveNote}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/50 hover:brightness-110 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" /> Save Note to Lesson
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
