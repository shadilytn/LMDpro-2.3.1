import React from "react";
import {
  Plus,
  Trash2,
  Video,
  Music,
  FileText,
  HelpCircle,
  Sparkles,
  Layers,
  CheckCircle,
  X,
  Upload,
  Link,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Course, Lesson, QuizQuestion } from "../../shared/types";

interface CourseBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCourse: (newCourse: Course) => void;
}

export const CourseBuilderModal: React.FC<CourseBuilderModalProps> = ({
  isOpen,
  onClose,
  onSaveCourse,
}) => {
  const [activeStep, setActiveStep] = React.useState<"info" | "curriculum" | "media" | "quiz">("info");

  // Basic Info
  const [title, setTitle] = React.useState("");
  const [code, setCode] = React.useState("AI-");
  const [description, setDescription] = React.useState("");
  const [degreeProgram, setDegreeProgram] = React.useState("Artificial Intelligence & Autonomous Systems");
  const [level, setLevel] = React.useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [estimatedHours, setEstimatedHours] = React.useState(30);

  // Modules & Lessons
  const [modules, setModules] = React.useState<
    Array<{
      id: string;
      title: string;
      lessons: Array<{
        id: string;
        title: string;
        content: string;
        videoUrl?: string;
        audioUrl?: string;
        durationMinutes: number;
      }>;
    }>
  >([
    {
      id: "mod-1",
      title: "Module 1: Foundations & Core Principles",
      lessons: [
        {
          id: "les-1",
          title: "Introduction & Conceptual Overview",
          content: "Welcome to this course. In this lesson, we break down foundational definitions, historical context, and core mathematical mechanics.",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          audioUrl: "",
          durationMinutes: 45,
        },
      ],
    },
  ]);

  // Quizzes
  const [quizzes, setQuizzes] = React.useState<QuizQuestion[]>([
    {
      id: "q-1",
      question: "Which invariant guarantees mathematical consistency across decentralized nodes?",
      options: [
        "Sheaf Laplacian kernel zero-cochain agreement",
        "Unconstrained gradient divergence",
        "Random walk Markov boundary error",
        "Deterministic heuristic clipping",
      ],
      correctAnswerIndex: 0,
      explanation: "A state x is a global section if and only if x lies in the kernel of the coboundary operator delta, enforced via the Sheaf Laplacian.",
    },
  ]);

  if (!isOpen) return null;

  const handleAddModule = () => {
    const newModId = `mod-${modules.length + 1}`;
    setModules([
      ...modules,
      {
        id: newModId,
        title: `Module ${modules.length + 1}: New Topic`,
        lessons: [
          {
            id: `les-${Date.now()}`,
            title: "Lesson 1: Key Mechanisms",
            content: "Detailed instructional breakdown...",
            durationMinutes: 30,
          },
        ],
      },
    ]);
  };

  const handleAddLesson = (modIndex: number) => {
    const updated = [...modules];
    updated[modIndex].lessons.push({
      id: `les-${Date.now()}`,
      title: `Lesson ${updated[modIndex].lessons.length + 1}: Core Deep Dive`,
      content: "Lesson theory and problem sets...",
      durationMinutes: 40,
    });
    setModules(updated);
  };

  const handleRemoveLesson = (modIndex: number, lessonIndex: number) => {
    const updated = [...modules];
    updated[modIndex].lessons.splice(lessonIndex, 1);
    setModules(updated);
  };

  const handleAddQuizQuestion = () => {
    setQuizzes([
      ...quizzes,
      {
        id: `q-${Date.now()}`,
        question: "New Multiple Choice Assessment Question?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswerIndex: 0,
        explanation: "Pedagogical rationale explaining why Option A is correct.",
      },
    ]);
  };

  const handleSave = () => {
    if (!title.trim()) return;

    const allLessons: Lesson[] = [];
    const fullModules = modules.map((mod) => ({
      id: mod.id,
      title: mod.title,
      description: `Comprehensive module covering ${mod.title}`,
      lessons: mod.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        content: l.content,
        durationMinutes: l.durationMinutes || 30,
        keyTakeaways: [l.title, "Core principles and applications"],
        audioScript: l.content,
        videoUrl: l.videoUrl,
        audioUrl: l.audioUrl,
        quizzes: quizzes,
        flashcards: [
          {
            id: `fc-${l.id}`,
            front: `Core concept of ${l.title}`,
            back: "Key mechanism, definitions and practical implementation notes.",
          },
        ],
      })),
    }));

    fullModules.forEach((m) => {
      m.lessons.forEach((l) => allLessons.push(l));
    });

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title,
      code: code || `CRS-${Math.floor(100 + Math.random() * 900)}`,
      category: degreeProgram || "Computer Science",
      description,
      level,
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      author: "Faculty Curriculum Board",
      rating: 4.9,
      durationHours: estimatedHours,
      estimatedHours,
      modules: fullModules,
      lessons: allLessons,
      quizzes: quizzes,
      tags: ["AI", "Curriculum", "Accredited"],
    };

    onSaveCourse(newCourse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#08151c] border border-[#1b3b4a] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0a1822] border-b border-[#1b3b4a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Course Management Studio • New Course Creator
              </h3>
              <p className="text-xs text-[#82a4b3]">
                Upload videos, audio podcasts, interactive quizzes, and structured modules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Navigation */}
        <div className="flex border-b border-[#1b3b4a] bg-[#071319] px-6">
          {[
            { id: "info", label: "1. Course Overview & Metadata", icon: BookOpen },
            { id: "curriculum", label: "2. Modules & Lessons", icon: Layers },
            { id: "media", label: "3. Video & Audio Uploads", icon: Video },
            { id: "quiz", label: "4. Interactive Quizzes", icon: HelpCircle },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setActiveStep(st.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition ${
                activeStep === st.id
                  ? "border-cyan-400 text-cyan-300 bg-[#0a1822]"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <st.icon className="w-3.5 h-3.5" />
              <span>{st.label}</span>
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 max-h-[62vh] space-y-5">
          {/* STEP 1: Basic Information */}
          {activeStep === "info" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-300">Course Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Distributed Consensus in Multi-Agent AI Swarms"
                    className="w-full bg-[#030b10] border border-[#1b3b4a] rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-400 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Course Code *</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. AI-902"
                    className="w-full bg-[#030b10] border border-[#1b3b4a] rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-400 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Course Description & Learning Outcomes</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a comprehensive summary of topics covered, pedagogical goals, and target outcomes..."
                  className="w-full bg-[#030b10] border border-[#1b3b4a] rounded-xl p-3 text-sm text-white focus:border-cyan-400 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Affiliated Degree Program</label>
                  <select
                    value={degreeProgram}
                    onChange={(e) => setDegreeProgram(e.target.value)}
                    className="w-full bg-[#030b10] border border-[#1b3b4a] rounded-xl px-3 py-2.5 text-xs text-white focus:border-cyan-400 outline-none"
                  >
                    <option value="Artificial Intelligence & Autonomous Systems">
                      Artificial Intelligence & Autonomous Systems
                    </option>
                    <option value="AI Ethics, Governance & Policy">
                      AI Ethics, Governance & Policy
                    </option>
                    <option value="Machine Learning Engineering">
                      Machine Learning Engineering
                    </option>
                    <option value="Robotics & Spatial Computing">
                      Robotics & Spatial Computing
                    </option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Difficulty Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full bg-[#030b10] border border-[#1b3b4a] rounded-xl px-3 py-2.5 text-xs text-white focus:border-cyan-400 outline-none"
                  >
                    <option value="Introductory">Introductory</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Estimated Duration (Hours)</label>
                  <input
                    type="number"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(Number(e.target.value))}
                    className="w-full bg-[#030b10] border border-[#1b3b4a] rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-400 outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Modules & Lessons */}
          {activeStep === "curriculum" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Structured Modules & Lessons</h4>
                <button
                  onClick={handleAddModule}
                  className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Module</span>
                </button>
              </div>

              {modules.map((mod, mIdx) => (
                <div key={mod.id} className="p-4 rounded-xl bg-[#0a1822] border border-[#1b3b4a] space-y-3">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={mod.title}
                      onChange={(e) => {
                        const updated = [...modules];
                        updated[mIdx].title = e.target.value;
                        setModules(updated);
                      }}
                      className="bg-transparent text-sm font-bold text-cyan-300 border-b border-transparent hover:border-[#1b3b4a] focus:border-cyan-400 outline-none px-1"
                    />
                    <button
                      onClick={() => handleAddLesson(mIdx)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add Lesson
                    </button>
                  </div>

                  <div className="space-y-2 pl-3 border-l-2 border-cyan-500/30">
                    {mod.lessons.map((les, lIdx) => (
                      <div
                        key={les.id}
                        className="p-3 rounded-lg bg-[#030b10] border border-[#1b3b4a] flex flex-col md:flex-row gap-3 items-start md:items-center justify-between"
                      >
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            value={les.title}
                            onChange={(e) => {
                              const updated = [...modules];
                              updated[mIdx].lessons[lIdx].title = e.target.value;
                              setModules(updated);
                            }}
                            className="bg-transparent text-xs font-semibold text-white border-b border-transparent focus:border-cyan-400 outline-none w-full"
                          />
                          <input
                            type="text"
                            value={les.content}
                            onChange={(e) => {
                              const updated = [...modules];
                              updated[mIdx].lessons[lIdx].content = e.target.value;
                              setModules(updated);
                            }}
                            placeholder="Lesson summary / key concepts..."
                            className="bg-transparent text-[11px] text-slate-400 border-b border-transparent focus:border-cyan-400 outline-none w-full"
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-[11px] text-slate-400">
                            <span>Duration:</span>
                            <input
                              type="number"
                              value={les.durationMinutes}
                              onChange={(e) => {
                                const updated = [...modules];
                                updated[mIdx].lessons[lIdx].durationMinutes = Number(e.target.value);
                                setModules(updated);
                              }}
                              className="w-12 bg-black/40 border border-[#1b3b4a] rounded px-1.5 py-0.5 text-center text-white"
                            />
                            <span>min</span>
                          </div>

                          <button
                            onClick={() => handleRemoveLesson(mIdx, lIdx)}
                            className="p-1.5 text-cyan-400 hover:bg-cyan-500/20 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 3: Video & Audio Media */}
          {activeStep === "media" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0a1822] border border-[#1b3b4a] space-y-3">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <Video className="w-4 h-4" /> Video Lecture Streaming & Uploads
                </span>
                <p className="text-xs text-slate-400">
                  Provide MP4 URLs, Google Cloud Storage buckets, or YouTube/HLS video streams for each module.
                </p>

                {modules.map((mod, mIdx) => (
                  <div key={mod.id} className="space-y-2 p-3 bg-[#030b10] rounded-xl border border-[#1b3b4a]">
                    <span className="text-xs font-bold text-white">{mod.title}</span>
                    {mod.lessons.map((les, lIdx) => (
                      <div key={les.id} className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 w-32 truncate">{les.title}:</span>
                        <input
                          type="text"
                          value={les.videoUrl || ""}
                          onChange={(e) => {
                            const updated = [...modules];
                            updated[mIdx].lessons[lIdx].videoUrl = e.target.value;
                            setModules(updated);
                          }}
                          placeholder="https://storage.googleapis.com/... or video stream URL"
                          className="flex-1 bg-black/40 border border-[#1b3b4a] rounded-lg px-3 py-1.5 text-xs text-cyan-200 font-mono outline-none"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-[#0a1822] border border-[#1b3b4a] space-y-3">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <Music className="w-4 h-4" /> Audio Podcast Overviews & Socratic Debates
                </span>
                <p className="text-xs text-slate-400">
                  Attach synthesized audio streams or multi-host podcast overviews.
                </p>
                {modules.map((mod, mIdx) => (
                  <div key={mod.id} className="space-y-2 p-3 bg-[#030b10] rounded-xl border border-[#1b3b4a]">
                    <span className="text-xs font-bold text-white">{mod.title}</span>
                    {mod.lessons.map((les, lIdx) => (
                      <div key={les.id} className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 w-32 truncate">{les.title}:</span>
                        <input
                          type="text"
                          value={les.audioUrl || ""}
                          onChange={(e) => {
                            const updated = [...modules];
                            updated[mIdx].lessons[lIdx].audioUrl = e.target.value;
                            setModules(updated);
                          }}
                          placeholder="https://.../podcast.mp3 or Cloud TTS audio stream"
                          className="flex-1 bg-black/40 border border-[#1b3b4a] rounded-lg px-3 py-1.5 text-xs text-cyan-200 font-mono outline-none"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Interactive Quizzes */}
          {activeStep === "quiz" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Course Interactive Assessments & Quizzes</h4>
                <button
                  onClick={handleAddQuizQuestion}
                  className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Assessment Item</span>
                </button>
              </div>

              {quizzes.map((q, qIdx) => (
                <div key={qIdx} className="p-4 rounded-xl bg-[#0a1822] border border-[#1b3b4a] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300">Question {qIdx + 1}</span>
                    <button
                      onClick={() => setQuizzes(quizzes.filter((_, idx) => idx !== qIdx))}
                      className="text-cyan-400 hover:text-cyan-300 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => {
                      const updated = [...quizzes];
                      updated[qIdx].question = e.target.value;
                      setQuizzes(updated);
                    }}
                    placeholder="Enter question statement..."
                    className="w-full bg-[#030b10] border border-[#1b3b4a] rounded-lg p-2 text-xs text-white outline-none focus:border-cyan-400"
                  />

                  {/* Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`flex items-center gap-2 p-2 rounded-lg border ${
                          q.correctAnswerIndex === oIdx
                            ? "bg-cyan-500/10 border-cyan-500/40"
                            : "bg-[#030b10] border-[#1b3b4a]"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`correct-${qIdx}`}
                          checked={q.correctAnswerIndex === oIdx}
                          onChange={() => {
                            const updated = [...quizzes];
                            updated[qIdx].correctAnswerIndex = oIdx;
                            setQuizzes(updated);
                          }}
                          className="text-cyan-500"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const updated = [...quizzes];
                            updated[qIdx].options[oIdx] = e.target.value;
                            setQuizzes(updated);
                          }}
                          className="flex-1 bg-transparent text-xs text-slate-200 outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={q.explanation}
                    onChange={(e) => {
                      const updated = [...quizzes];
                      updated[qIdx].explanation = e.target.value;
                      setQuizzes(updated);
                    }}
                    placeholder="Pedagogical explanation for correct answer..."
                    className="w-full bg-[#030b10] border border-[#1b3b4a] rounded-lg p-2 text-[11px] text-slate-400 outline-none"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0a1822] border-t border-[#1b3b4a] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black/40 text-slate-400 hover:text-white rounded-xl text-xs font-bold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-500 hover:from-cyan-400 hover:to-cyan-400 disabled:opacity-50 text-black font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Publish & Save Course</span>
          </button>
        </div>
      </div>
    </div>
  );
};
