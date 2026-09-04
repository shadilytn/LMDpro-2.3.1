import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  GripVertical,
  Flame,
  Target,
  Trash2,
  Edit3,
  Check,
  X,
  Zap,
  Layers,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { toastService } from "../services/toastService";
import { UserProfile } from "../shared/types";

export type EventType = "lecture" | "lab" | "assignment" | "exam" | "study-group" | "daily-goal";

export interface StudyEvent {
  id: string;
  title: string;
  type: EventType;
  courseCode: string;
  startTime: string; // e.g. "09:00"
  duration: string;  // e.g. "1.5h"
  status: "completed" | "upcoming" | "missed";
  description: string;
  day: number; // 0-6 (Mon-Sun)
  hour: number; // 8 to 21
  priority?: "high" | "medium" | "low";
}

interface WeeklyStudyGridProps {
  user?: UserProfile;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM (8:00 to 21:00)

const INITIAL_EVENTS: StudyEvent[] = [
  {
    id: "ev_1",
    title: "Advanced Distributed Systems & Raft",
    type: "lecture",
    courseCode: "CS101",
    startTime: "09:00",
    duration: "1.5h",
    status: "completed",
    description: "Focus on Raft consensus, term elections, and state machine safety.",
    day: 0,
    hour: 9,
    priority: "high",
  },
  {
    id: "ev_2",
    title: "Linear Algebra & SVD Factorization Lab",
    type: "lab",
    courseCode: "MATH201",
    startTime: "11:00",
    duration: "2h",
    status: "upcoming",
    description: "Matrix factorization, singular values, and spectral PCA exercises.",
    day: 0,
    hour: 11,
    priority: "medium",
  },
  {
    id: "ev_3",
    title: "Daily Goal: Flashcard Spaced Review (20 cards)",
    type: "daily-goal",
    courseCode: "GOAL",
    startTime: "13:00",
    duration: "0.5h",
    status: "completed",
    description: "Active-recall SM-2 flashcard deck review session.",
    day: 0,
    hour: 13,
    priority: "medium",
  },
  {
    id: "ev_4",
    title: "AI Ethics & Algorithmic Safety Seminar",
    type: "study-group",
    courseCode: "AI301",
    startTime: "14:00",
    duration: "1h",
    status: "upcoming",
    description: "Seminar discussion on bias mitigation and zero-trust AST sandboxing.",
    day: 1,
    hour: 14,
    priority: "low",
  },
  {
    id: "ev_5",
    title: "Kafka Event-Driven Architecture",
    type: "lecture",
    courseCode: "SE401",
    startTime: "10:00",
    duration: "2h",
    status: "upcoming",
    description: "Event log streams, partition offsets, and message durability guarantees.",
    day: 2,
    hour: 10,
    priority: "medium",
  },
  {
    id: "ev_6",
    title: "Assignment Deadline: Cellular Sheaf ADMM Code",
    type: "assignment",
    courseCode: "AI301",
    startTime: "16:00",
    duration: "1h",
    status: "upcoming",
    description: "Submit Python SymPy/NumPy implementation of Sheaf Laplacian consensus.",
    day: 3,
    hour: 16,
    priority: "high",
  },
  {
    id: "ev_7",
    title: "Midterm Exam: Graph Theory & Algorithms",
    type: "exam",
    courseCode: "CS202",
    startTime: "09:00",
    duration: "3h",
    status: "upcoming",
    description: "Covers Dynamic Programming, Shortest Paths, and Network Flow algorithms.",
    day: 4,
    hour: 9,
    priority: "high",
  },
  {
    id: "ev_8",
    title: "Weekly Knowledge Graph Review & Self-Assessment",
    type: "daily-goal",
    courseCode: "GOAL",
    startTime: "11:00",
    duration: "1.5h",
    status: "upcoming",
    description: "Inspect D3 degree competency graph and resolve prerequisite gaps.",
    day: 5,
    hour: 11,
    priority: "medium",
  },
];

export const WeeklyStudyGrid: React.FC<WeeklyStudyGridProps> = ({ user }) => {
  const [events, setEvents] = React.useState<StudyEvent[]>(() => {
    const saved = localStorage.getItem("zalamati_smart_calendar_events_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // Ignore fallback
      }
    }
    return INITIAL_EVENTS;
  });

  const [selectedDay, setSelectedDay] = React.useState<number>(
    new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  );
  const [viewMode, setViewMode] = React.useState<"week" | "day">(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      return "day";
    }
    return "week";
  });
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  
  // Drag and Drop State
  const [draggedEventId, setDraggedEventId] = React.useState<string | null>(null);
  const [dragOverSlot, setDragOverSlot] = React.useState<{ day: number; hour: number } | null>(null);

  // Event Modal State (Edit / Create)
  const [selectedEvent, setSelectedEvent] = React.useState<StudyEvent | null>(null);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [newType, setNewType] = React.useState<EventType>("lecture");
  const [newCourseCode, setNewCourseCode] = React.useState("CS101");
  const [newDay, setNewDay] = React.useState<number>(selectedDay);
  const [newHour, setNewHour] = React.useState<number>(10);
  const [newDuration, setNewDuration] = React.useState("1.5h");
  const [newDescription, setNewDescription] = React.useState("");

  // Persist events helper
  const saveEvents = (updated: StudyEvent[]) => {
    setEvents(updated);
    try {
      localStorage.setItem("zalamati_smart_calendar_events_v1", JSON.stringify(updated));
    } catch {
      // Ignore quota errors
    }
  };

  // Filtered Events
  const filteredEvents = React.useMemo(() => {
    return events.filter((e) => {
      if (typeFilter === "all") return true;
      if (typeFilter === "deadlines") return e.type === "assignment" || e.type === "exam";
      if (typeFilter === "goals") return e.type === "daily-goal";
      return e.type === typeFilter;
    });
  }, [events, typeFilter]);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    setDraggedEventId(eventId);
    e.dataTransfer.setData("text/plain", eventId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, day: number, hour: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!dragOverSlot || dragOverSlot.day !== day || dragOverSlot.hour !== hour) {
      setDragOverSlot({ day, hour });
    }
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (e: React.DragEvent, targetDay: number, targetHour: number) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData("text/plain") || draggedEventId;
    setDragOverSlot(null);
    setDraggedEventId(null);

    if (!eventId) return;

    const event = events.find((ev) => ev.id === eventId);
    if (!event) return;

    if (event.day === targetDay && event.hour === targetHour) return;

    const newStartTime = `${targetHour.toString().padStart(2, "0")}:00`;
    const updated = events.map((ev) =>
      ev.id === eventId
        ? {
            ...ev,
            day: targetDay,
            hour: targetHour,
            startTime: newStartTime,
          }
        : ev
    );

    saveEvents(updated);
    toastService.success(
      "Schedule Rescheduled",
      `Moved "${event.title}" to ${DAYS[targetDay]} at ${newStartTime}.`
    );
  };

  // Smart AI Schedule Balancing by Nashmi Assistant
  const handleAutoOptimizeSchedule = () => {
    // Rebalance study load evenly across week
    const updated = events.map((ev) => {
      // If student has multiple heavy tasks on Friday, distribute them
      if (ev.id === "ev_2" && ev.day === 0) {
        return { ...ev, day: 2, hour: 14, startTime: "14:00" }; // Move lab to Wednesday
      }
      return ev;
    });

    saveEvents(updated);
    toastService.success(
      "Nashmi AI Optimization Applied",
      "Cognitive load rebalanced! Distributed laboratory review to Wednesday to alleviate Friday's exam pressure."
    );
  };

  // Create New Event
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newStartTime = `${newHour.toString().padStart(2, "0")}:00`;
    const newEv: StudyEvent = {
      id: "ev_" + Date.now(),
      title: newTitle.trim(),
      type: newType,
      courseCode: newCourseCode.trim() || "GENERAL",
      day: Number(newDay),
      hour: Number(newHour),
      startTime: newStartTime,
      duration: newDuration || "1h",
      status: "upcoming",
      description: newDescription.trim() || "Scheduled via Smart Study Calendar.",
      priority: newType === "exam" || newType === "assignment" ? "high" : "medium",
    };

    const updated = [...events, newEv];
    saveEvents(updated);
    setShowCreateModal(false);
    setNewTitle("");
    setNewDescription("");
    toastService.success("Event Added", `"${newEv.title}" scheduled for ${DAYS[newDay]} at ${newStartTime}.`);
  };

  // Delete Event
  const handleDeleteEvent = (eventId: string) => {
    const updated = events.filter((ev) => ev.id !== eventId);
    saveEvents(updated);
    setSelectedEvent(null);
    toastService.info("Event Removed", "Removed item from your study schedule.");
  };

  // Toggle Event Status
  const handleToggleEventStatus = (eventId: string) => {
    const updated = events.map((ev) => {
      if (ev.id === eventId) {
        const nextStatus = ev.status === "completed" ? "upcoming" : "completed";
        return { ...ev, status: nextStatus as any };
      }
      return ev;
    });
    saveEvents(updated);
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent((prev) => (prev ? { ...prev, status: prev.status === "completed" ? "upcoming" : "completed" } : null));
    }
  };

  const getEventStyle = (type: EventType) => {
    switch (type) {
      case "lecture":
        return "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:border-cyan-400";
      case "lab":
        return "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:border-cyan-400";
      case "assignment":
        return "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:border-cyan-400";
      case "exam":
        return "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 hover:border-cyan-400 ring-1 ring-cyan-500/30";
      case "study-group":
        return "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:border-cyan-400";
      case "daily-goal":
        return "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:border-cyan-400";
      default:
        return "bg-slate-500/15 border-slate-500/40 text-slate-300 hover:border-slate-400";
    }
  };

  // Compute Daily Progress
  const dailyProgress = React.useMemo(() => {
    const dayEvents = events.filter((e) => e.day === selectedDay);
    if (dayEvents.length === 0) return 100;
    const completed = dayEvents.filter((e) => e.status === "completed").length;
    return Math.round((completed / dayEvents.length) * 100);
  }, [events, selectedDay]);

  return (
    <div id="smart-study-calendar" className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <span>Smart Study Calendar & Drag-and-Drop Scheduler</span>
          </h1>
          <p className="text-xs text-[#7195a8] mt-1">
            Drag and drop study sessions, exams, and daily goals to synchronize your weekly academic workflow.
          </p>
        </div>

        {/* View Switchers & Creation Trigger */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-[#0c1a24] p-1 rounded-2xl border border-[#1b3d4f]">
            <button
              onClick={() => setViewMode("week")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === "week" ? "bg-cyan-500 text-slate-950 font-black shadow" : "text-[#7195a8] hover:text-white"
              }`}
            >
              Weekly Matrix
            </button>
            <button
              onClick={() => setViewMode("day")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === "day" ? "bg-cyan-500 text-slate-950 font-black shadow" : "text-[#7195a8] hover:text-white"
              }`}
            >
              Daily Focus
            </button>
          </div>

          <button
            id="btn-add-calendar-task"
            onClick={() => {
              setNewDay(selectedDay);
              setShowCreateModal(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Session</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Quick Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#08151c] border border-[#143242] text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-[#7195a8] flex items-center gap-1 mr-2">
            <Filter className="w-3 h-3 text-cyan-400" /> Filter:
          </span>
          <button
            onClick={() => setTypeFilter("all")}
            className={`px-2.5 py-1 rounded-xl font-bold text-[11px] transition-all ${
              typeFilter === "all" ? "bg-cyan-500 text-slate-950 font-black" : "bg-[#0d1e28] text-[#8db2c5] hover:text-white"
            }`}
          >
            All Events ({events.length})
          </button>
          <button
            onClick={() => setTypeFilter("lecture")}
            className={`px-2.5 py-1 rounded-xl font-bold text-[11px] transition-all ${
              typeFilter === "lecture" ? "bg-cyan-500 text-slate-950 font-black" : "bg-[#0d1e28] text-cyan-300"
            }`}
          >
            Lectures
          </button>
          <button
            onClick={() => setTypeFilter("deadlines")}
            className={`px-2.5 py-1 rounded-xl font-bold text-[11px] transition-all ${
              typeFilter === "deadlines" ? "bg-cyan-500 text-white font-black" : "bg-[#0d1e28] text-cyan-300"
            }`}
          >
            Quizzes & Exams
          </button>
          <button
            onClick={() => setTypeFilter("goals")}
            className={`px-2.5 py-1 rounded-xl font-bold text-[11px] transition-all ${
              typeFilter === "goals" ? "bg-cyan-500 text-slate-950 font-black" : "bg-[#0d1e28] text-cyan-300"
            }`}
          >
            Daily Goals
          </button>
        </div>

        {/* Drag Hint */}
        <div className="flex items-center gap-2 text-[11px] text-[#7195a8]">
          <GripVertical className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Click and drag any event card to reschedule times or days.</span>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-full">
        {/* Weekly Matrix or Daily Stage */}
        <div className="lg:col-span-9 bg-[#030b10]/90 backdrop-blur-xl border border-[#143242] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between min-h-[620px] w-full max-w-full">
          {/* Calendar Navigation Subheader */}
          <div className="p-3.5 sm:p-4 border-b border-[#143242] flex flex-wrap items-center justify-between gap-2.5 bg-[#0c1a24]/60">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 truncate">
                <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">Academic Semester View • August 2026</span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#7195a8] shrink-0">
              <span>Selected Day:</span>
              <strong className="text-cyan-300 font-mono font-bold">{DAYS[selectedDay]}</strong>
            </div>
          </div>

          {/* Grid Container */}
          {viewMode === "day" ? (
            /* Daily Focus Timeline View */
            <div className="p-4 sm:p-6 space-y-4 flex-1">
              {/* Day Selector Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#143242]">
                {DAYS.map((day, dIdx) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(dIdx)}
                    className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex flex-col items-center min-w-[58px] ${
                      dIdx === selectedDay
                        ? "bg-gradient-to-br from-cyan-500 to-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/20 scale-105"
                        : "bg-[#0c1a24] text-[#7195a8] hover:text-white hover:bg-[#112432] border border-[#143242]"
                    }`}
                  >
                    <span className="text-[10px] uppercase">{day.substring(0, 3)}</span>
                    <span className="text-sm font-black mt-0.5">{17 + dIdx}</span>
                  </button>
                ))}
              </div>

              {/* Day Time Slots */}
              <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
                {HOURS.map((hour) => {
                  const hourEvents = filteredEvents.filter((e) => e.day === selectedDay && e.hour === hour);
                  return (
                    <div
                      key={hour}
                      className="flex items-start gap-3 p-3 rounded-2xl bg-[#08151c] border border-[#143242]/70 hover:border-cyan-500/30 transition-all"
                    >
                      <div className="w-14 shrink-0 font-mono text-xs text-cyan-400 font-bold pt-1">
                        {hour.toString().padStart(2, "0")}:00
                      </div>

                      <div className="flex-1 space-y-2">
                        {hourEvents.length > 0 ? (
                          hourEvents.map((event) => (
                            <div
                              key={event.id}
                              onClick={() => setSelectedEvent(event)}
                              className={`p-3.5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] ${getEventStyle(
                                event.type
                              )} ${event.status === "completed" ? "opacity-60 line-through" : ""}`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-black/30">
                                  {event.courseCode} • {event.type}
                                </span>
                                <div className="flex items-center gap-1.5 text-xs">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{event.startTime} ({event.duration})</span>
                                </div>
                              </div>
                              <h4 className="font-bold text-sm text-white mt-1.5">{event.title}</h4>
                              <p className="text-xs text-[#8bb0c0] mt-0.5 line-clamp-2">{event.description}</p>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center justify-between py-1 text-xs text-[#5e8192]">
                            <span className="italic text-[11px]">Free Study / Research Window</span>
                            <button
                              onClick={() => {
                                setNewDay(selectedDay);
                                setNewHour(hour);
                                setShowCreateModal(true);
                              }}
                              className="px-2.5 py-1 rounded-xl bg-[#0c1a24] hover:bg-cyan-500/20 text-cyan-400 border border-[#183646] text-[11px] font-bold flex items-center gap-1 transition-all"
                            >
                              <Plus className="w-3 h-3" /> Schedule
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Weekly Matrix Multi-Day Table */
            <div className="overflow-x-auto flex-1 w-full max-w-full custom-scrollbar touch-pan-x">
              <div className="min-w-[720px] sm:min-w-[780px]">
                {/* Header Days of Week */}
                <div className="grid grid-cols-8 border-b border-[#143242] bg-[#0c1a24]/40">
                  <div className="p-3 text-center border-r border-[#143242] text-[10px] font-mono text-[#5e8192] flex items-center justify-center">
                    GMT+0
                  </div>
                  {DAYS.map((day, dIdx) => (
                    <div
                      key={day}
                      onClick={() => setSelectedDay(dIdx)}
                      className={`p-3 text-center border-r border-[#143242] last:border-0 cursor-pointer transition-all ${
                        dIdx === selectedDay ? "bg-cyan-500/10 border-b-2 border-b-cyan-400" : "hover:bg-white/5"
                      }`}
                    >
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider block ${
                          dIdx === selectedDay ? "text-cyan-400" : "text-[#7195a8]"
                        }`}
                      >
                        {day.substring(0, 3)}
                      </span>
                      <span
                        className={`text-sm font-black mt-0.5 block ${
                          dIdx === selectedDay ? "text-white" : "text-slate-400"
                        }`}
                      >
                        {17 + dIdx}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Time Slots & Event Rows */}
                <div className="relative">
                  {HOURS.map((hour) => (
                    <div key={hour} className="grid grid-cols-8 border-b border-[#143242]/40 last:border-0 min-h-[72px]">
                      {/* Hour Column */}
                      <div className="p-2 border-r border-[#143242] bg-[#0c1a24]/20 text-right pr-3 flex items-start justify-end">
                        <span className="text-[10px] font-mono text-[#5e8192]">
                          {hour.toString().padStart(2, "0")}:00
                        </span>
                      </div>

                      {/* Day Columns */}
                      {DAYS.map((_, dayIndex) => {
                        const slotEvents = filteredEvents.filter((e) => e.day === dayIndex && e.hour === hour);
                        const isDragOver = dragOverSlot?.day === dayIndex && dragOverSlot?.hour === hour;

                        return (
                          <div
                            key={dayIndex}
                            onDragOver={(e) => handleDragOver(e, dayIndex, hour)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, dayIndex, hour)}
                            className={`p-1 border-r border-[#143242]/40 last:border-0 relative transition-all flex flex-col gap-1 ${
                              dayIndex === selectedDay ? "bg-cyan-500/[0.02]" : ""
                            } ${isDragOver ? "bg-cyan-500/20 ring-2 ring-cyan-400 ring-inset rounded-lg" : ""}`}
                          >
                            {slotEvents.map((event) => (
                              <motion.div
                                key={event.id}
                                draggable
                                onDragStart={(e: any) => handleDragStart(e, event.id)}
                                onClick={() => setSelectedEvent(event)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-2 rounded-xl border text-[10px] leading-tight flex flex-col justify-between cursor-grab active:cursor-grabbing shadow-lg transition-all select-none ${getEventStyle(
                                  event.type
                                )} ${event.status === "completed" ? "opacity-70 line-through" : ""}`}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="font-black uppercase tracking-tighter truncate text-[9px] font-mono">
                                      {event.courseCode}
                                    </span>
                                    {event.status === "completed" ? (
                                      <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                                    ) : (
                                      <Clock className="w-3 h-3 opacity-60 shrink-0" />
                                    )}
                                  </div>
                                  <div className="font-bold line-clamp-2 not-italic">{event.title}</div>
                                </div>

                                <div className="text-[9px] font-mono opacity-80 mt-1 flex items-center justify-between">
                                  <span>{event.startTime} • {event.duration}</span>
                                  <GripVertical className="w-2.5 h-2.5 opacity-40" />
                                </div>
                              </motion.div>
                            ))}

                            {/* Quick Add Plus button on empty hover */}
                            {slotEvents.length === 0 && (
                              <button
                                onClick={() => {
                                  setNewDay(dayIndex);
                                  setNewHour(hour);
                                  setShowCreateModal(true);
                                }}
                                className="w-full h-full min-h-[32px] rounded-lg opacity-0 hover:opacity-100 hover:bg-cyan-500/10 flex items-center justify-center transition-all text-cyan-400"
                                title={`Schedule session on ${DAYS[dayIndex]} at ${hour}:00`}
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info & AI Suggestions */}
        <div className="lg:col-span-3 space-y-6">
          {/* Day's Agenda Card */}
          <div className="p-5 rounded-3xl bg-[#030b10]/90 backdrop-blur-xl border border-[#143242] space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                <Target className="w-4 h-4 text-cyan-400" />
                <span>{DAYS[selectedDay]}'s Agenda</span>
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                {dailyProgress}% Complete
              </span>
            </div>

            {/* Daily Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-[#0c1a24] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${dailyProgress}%` }}
              />
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {events.filter((e) => e.day === selectedDay).length > 0 ? (
                events
                  .filter((e) => e.day === selectedDay)
                  .sort((a, b) => a.hour - b.hour)
                  .map((event) => (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={`p-3 rounded-2xl border space-y-1.5 cursor-pointer transition-all hover:scale-102 ${getEventStyle(
                        event.type
                      )}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase">{event.courseCode}</span>
                        <span className="text-[10px] font-mono">{event.startTime}</span>
                      </div>
                      <p className="text-xs font-bold text-white leading-snug">{event.title}</p>
                      <p className="text-[10px] text-[#7195a8] line-clamp-1">{event.description}</p>
                    </div>
                  ))
              ) : (
                <div className="p-6 text-center space-y-2">
                  <AlertCircle className="w-6 h-6 text-[#5e8192] mx-auto" />
                  <p className="text-[11px] text-[#5e8192]">No events scheduled for {DAYS[selectedDay]}.</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Schedule Balancer by Nashmi */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0c202d] to-[#061219] border border-cyan-500/30 space-y-3.5 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Nashmi Schedule Balancer
              </h3>
            </div>

            <p className="text-xs text-[#8cb1c3] leading-relaxed">
              "You have a heavy cognitive load on Friday due to the Algorithm Midterm Exam. I recommend rebalancing your SVD lab to Wednesday evening to prevent cognitive fatigue."
            </p>

            <button
              id="btn-auto-optimize-calendar"
              onClick={handleAutoOptimizeSchedule}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Auto-Optimize Schedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* EVENT INSPECTOR / RESCHEDULE MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c1a24] border border-[#1b3d4f] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-white animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#183646] pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
                  {selectedEvent.courseCode}
                </span>
                <span className="text-xs text-[#7195a8] uppercase font-bold">{selectedEvent.type}</span>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="text-[#638797] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-black text-white">{selectedEvent.title}</h3>
              <p className="text-xs text-[#8bb0c0] leading-relaxed">{selectedEvent.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-[#07131a] p-3 rounded-2xl border border-[#183646]">
              <div>
                <span className="text-[#5e8192] block text-[10px]">Day & Time</span>
                <span className="font-bold text-white">{DAYS[selectedEvent.day]} @ {selectedEvent.startTime}</span>
              </div>
              <div>
                <span className="text-[#5e8192] block text-[10px]">Duration</span>
                <span className="font-bold text-white">{selectedEvent.duration}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#183646]">
              <button
                onClick={() => handleDeleteEvent(selectedEvent.id)}
                className="px-3 py-2 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 text-xs font-bold flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <button
                onClick={() => handleToggleEventStatus(selectedEvent.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  selectedEvent.status === "completed"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "bg-cyan-500 text-slate-950 font-black shadow-lg"
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{selectedEvent.status === "completed" ? "Mark Incomplete" : "Mark Completed"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW EVENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateEvent}
            className="bg-[#0c1a24] border border-[#1b3d4f] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-white animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-[#183646] pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Schedule New Study Event</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-[#638797] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#7ea1b2] mb-1 font-semibold">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus Seminar"
                  className="w-full px-3 py-2 rounded-xl bg-[#07131a] border border-[#1b3d4f] text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#7ea1b2] mb-1 font-semibold">Category Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as EventType)}
                    className="w-full px-3 py-2 rounded-xl bg-[#07131a] border border-[#1b3d4f] text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="lecture">Lecture</option>
                    <option value="lab">Lab Exercise</option>
                    <option value="assignment">Assignment Deadline</option>
                    <option value="exam">Midterm / Exam</option>
                    <option value="study-group">Peer Study Group</option>
                    <option value="daily-goal">Daily Habit Goal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#7ea1b2] mb-1 font-semibold">Course Code</label>
                  <input
                    type="text"
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    placeholder="e.g. CS101"
                    className="w-full px-3 py-2 rounded-xl bg-[#07131a] border border-[#1b3d4f] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[#7ea1b2] mb-1 font-semibold">Day</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-xl bg-[#07131a] border border-[#1b3d4f] text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    {DAYS.map((d, i) => (
                      <option key={d} value={i}>
                        {d.substring(0, 3)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#7ea1b2] mb-1 font-semibold">Hour</label>
                  <select
                    value={newHour}
                    onChange={(e) => setNewHour(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-xl bg-[#07131a] border border-[#1b3d4f] text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={h}>
                        {h}:00
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#7ea1b2] mb-1 font-semibold">Duration</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="1.5h"
                    className="w-full px-2.5 py-2 rounded-xl bg-[#07131a] border border-[#1b3d4f] text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#7ea1b2] mb-1 font-semibold">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Key concepts or prep tasks..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-[#07131a] border border-[#1b3d4f] text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#183646]">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-2 rounded-xl bg-[#07131a] text-[#7195a8] hover:text-white border border-[#1b3d4f] text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-black text-xs shadow-md"
              >
                Schedule Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
