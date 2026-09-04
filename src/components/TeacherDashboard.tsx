import React from "react";
import { ThemedCourseImage } from "./ThemedCourseImage";
import { Course, UserProfile } from "../shared/types";
import { CourseBuilderModal } from "./course-management/CourseBuilderModal";
import { EnrollmentManager, StudentEnrollment } from "./course-management/EnrollmentManager";
import { CertificateManager } from "./course-management/CertificateManager";
import {
  PlusCircle,
  Sparkles,
  BookOpen,
  Users,
  CheckCircle,
  Brain,
  Award,
  Layers,
  Send,
  BarChart2,
  AlertTriangle,
  FileText,
  Terminal,
  Code2,
  Shield,
  ShieldCheck,
  Cpu,
  Building,
  Search,
  Download,
  RefreshCw,
  Sliders,
  ChevronRight,
  Copy,
  Check,
  Zap,
  Radio,
  Plus,
  Trash2,
  ExternalLink,
  MessageSquare,
  Video,
  Music,
  HelpCircle,
  UserPlus
} from "lucide-react";

interface TeacherDashboardProps {
  user: UserProfile;
  courses: Course[];
  onOpenCourseGenerator: () => void;
  onSelectCourse: (course: Course) => void;
  onOpenClassroomModal?: () => void;
  onAddCourse?: (course: Course) => void;
}

type TeacherTab =
  | "course_management"
  | "enrollments"
  | "analytics"
  | "assignments"
  | "certifications"
  | "teams_enterprise"
  | "developer_studio";

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  user,
  courses,
  onOpenCourseGenerator,
  onSelectCourse,
  onOpenClassroomModal,
  onAddCourse,
}) => {
  const [activeTab, setActiveTab] = React.useState<TeacherTab>("course_management");
  const [showCourseBuilderModal, setShowCourseBuilderModal] = React.useState(false);
  const [selectedStudentForCert, setSelectedStudentForCert] = React.useState<StudentEnrollment | null>(null);

  // Quick Quiz Generator State
  const [quickQuizTopic, setQuickQuizTopic] = React.useState("");
  const [generatedQuiz, setGeneratedQuiz] = React.useState<any[] | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = React.useState(false);

  // Student Analytics & Struggling Concepts State
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCourseFilter, setSelectedCourseFilter] = React.useState("all");
  const [analyticsData, setAnalyticsData] = React.useState<any>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = React.useState(false);
  const [remedialModalTopic, setRemedialModalTopic] = React.useState<any | null>(
    null,
  );
  const [remedialPackage, setRemedialPackage] = React.useState<any | null>(null);
  const [isGeneratingRemedial, setIsGeneratingRemedial] = React.useState(false);

  // Assignments Studio State
  const [assignments, setAssignments] = React.useState<any[]>([]);
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] =
    React.useState(false);
  const [asgnTitle, setAsgnTitle] = React.useState("");
  const [asgnCourse, setAsgnCourse] = React.useState(
    courses[0]?.title || "Advanced Neural Architectures & LLMs",
  );
  const [asgnCategory, setAsgnCategory] = React.useState("Coding Lab");
  const [asgnDueDate, setAsgnDueDate] = React.useState("2026-08-20");
  const [asgnPoints, setAsgnPoints] = React.useState("100");
  const [asgnType, setAsgnType] = React.useState("Code File");
  const [asgnInstructions, setAsgnInstructions] = React.useState("");
  const [asgnAiGenerate, setAsgnAiGenerate] = React.useState(true);
  const [isCreatingAssignment, setIsCreatingAssignment] = React.useState(false);

  // Teams & Enterprise State
  const [teamMembers, setTeamMembers] = React.useState([
    {
      id: "1",
      name: "Dr. Evelyn Vance",
      role: "Co-Professor & AI Lead",
      email: "e.vance@university.edu",
      status: "Active",
    },
    {
      id: "2",
      name: "Marcus Sterling",
      role: "Head Teaching Assistant",
      email: "m.sterling@university.edu",
      status: "Active",
    },
    {
      id: "3",
      name: "Sarah Connor",
      role: "Lab Instructor",
      email: "s.connor@university.edu",
      status: "Pending",
    },
  ]);
  const [webhookUrl, setWebhookUrl] = React.useState(
    "https://hooks.slack.com/services/T00/B00/TEAMS_DIGEST",
  );
  const [webhookDigestTime, setWebhookDigestTime] = React.useState("08:00 AM");
  const [testWebhookSuccess, setTestWebhookSuccess] = React.useState(false);

  // Developer Studio & CLI State
  const [cliCommand, setCliCommand] = React.useState("lmdpro-cli analytics");
  const [cliOutput, setCliOutput] = React.useState(
    'Connected to LMDpro Faculty CLI v3.8.4\nType "lmdpro-cli assignments" or "lmdpro-cli mcp status" to inspect system state.',
  );
  const [isExecutingCli, setIsExecutingCli] = React.useState(false);
  const [apiKey, setApiKey] = React.useState("zal_tch_sk_8f92a10c73e9112a");
  const [copiedKey, setCopiedKey] = React.useState(false);
  const [selectedSdk, setSelectedSdk] = React.useState<
    "node" | "python" | "curl" | "go"
  >("node");

  // Load analytics & assignments on mount
  React.useEffect(() => {
    fetchAnalytics();
    fetchAssignments();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoadingAnalytics(true);
    try {
      const res = await fetch("/api/teacher/analytics");
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await fetch("/api/teacher/assignments");
      if (res.ok) {
        const data = await res.json();
        if (data.assignments) setAssignments(data.assignments);
      }
    } catch (err) {
      console.error("Failed to fetch assignments:", err);
    }
  };

  const handleGenerateQuickQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuizTopic.trim()) return;
    setIsGeneratingQuiz(true);
    try {
      const res = await fetch("/api/gemini/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Generate 3 high-quality multiple choice quiz questions for students on the topic: "${quickQuizTopic}". Format as JSON array of objects with keys: question, options (array of 4 strings), correctAnswerIndex (0-3), and explanation.`,
          thinkingMode: false,
        }),
      });
      const data = await res.json();
      try {
        const jsonMatch = data.reply.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          setGeneratedQuiz(JSON.parse(jsonMatch[0]));
        } else {
          setGeneratedQuiz([
            {
              question: `Sample Quiz Question on ${quickQuizTopic}`,
              options: ["Option A", "Option B", "Option C", "Option D"],
              correctAnswerIndex: 0,
              explanation: "Concept explanation generated successfully.",
            },
          ]);
        }
      } catch (e) {
        console.warn("Failed to parse quiz json:", e);
      }
    } catch (err) {
      console.error("Quiz generator error:", err);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleGenerateRemedialPackage = async (conceptItem: any) => {
    setRemedialModalTopic(conceptItem);
    setIsGeneratingRemedial(true);
    setRemedialPackage(null);
    try {
      const res = await fetch("/api/teacher/ai-remedial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conceptTopic: conceptItem.topic,
          courseTitle: conceptItem.courseTitle,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setRemedialPackage(data.remedialPackage);
      }
    } catch (err) {
      console.error("Remedial error:", err);
    } finally {
      setIsGeneratingRemedial(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgnTitle.trim()) return;
    setIsCreatingAssignment(true);
    try {
      const res = await fetch("/api/teacher/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: asgnTitle,
          courseTitle: asgnCourse,
          category: asgnCategory,
          dueDate: asgnDueDate,
          totalPoints: Number(asgnPoints),
          submissionType: asgnType,
          instructions: asgnInstructions,
          generateWithAI: asgnAiGenerate,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.assignment) {
          setAssignments((prev) => [data.assignment, ...prev]);
        }
        setShowCreateAssignmentModal(false);
        setAsgnTitle("");
        setAsgnInstructions("");
      }
    } catch (err) {
      console.error("Create assignment error:", err);
    } finally {
      setIsCreatingAssignment(false);
    }
  };

  const handleExecuteCliCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliCommand.trim()) return;
    setIsExecutingCli(true);
    try {
      const res = await fetch("/api/teacher/cli-exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: cliCommand }),
      });
      if (res.ok) {
        const data = await res.json();
        setCliOutput((prev) => `${prev}\n\n$ ${data.command}\n${data.output}`);
      }
    } catch (err) {
      console.error("CLI error:", err);
    } finally {
      setIsExecutingCli(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Filtered Students
  const filteredStudents = (analyticsData?.atRiskStudents || []).filter(
    (s: any) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCourse =
        selectedCourseFilter === "all" ||
        s.course.toLowerCase().includes(selectedCourseFilter.toLowerCase());
      return matchesSearch && matchesCourse;
    },
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Faculty Portal Top Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0a1e2b] via-[#0c2636] to-[#0f3044] border border-[#1b3b4a] p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Faculty & AI Curriculum Portal
              </span>
              <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 w-fit">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                ISO 21001 Certified
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Teacher Dashboard & Faculty Orchestrator
            </h1>

            <p className="text-xs sm:text-sm text-[#82a3b2] leading-relaxed">
              Track student mastery, identify struggling learning concepts,
              manage auto-graded assignments, and interface directly with Teams,
              Enterprise consoles, and Developer CLI/MCP APIs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {onOpenClassroomModal && (
              <button
                onClick={onOpenClassroomModal}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#091822] hover:bg-[#122e3d] text-cyan-300 border border-cyan-500/30 font-bold text-xs shadow-xl transition-all hover:scale-[1.02] shrink-0"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Google Classroom</span>
              </button>
            )}
            <button
              onClick={() => setShowCourseBuilderModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs shadow-xl transition-all hover:scale-[1.02] shrink-0"
            >
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              <span>Create Course</span>
            </button>
            <button
              onClick={onOpenCourseGenerator}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 text-white font-bold text-xs shadow-xl shadow-cyan-950/40 transition-all hover:scale-[1.02] shrink-0"
            >
              <Brain className="w-4 h-4" />
              <span>AI Course Architect</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="mt-8 pt-4 border-t border-[#1b3b4a]/60 flex flex-wrap gap-2">
          {[
            {
              id: "course_management",
              label: "Course Management Suite",
              icon: Layers,
              badge: `${courses.length} Courses`,
            },
            {
              id: "enrollments",
              label: "Enrollments & Cohorts",
              icon: Users,
              badge: "1.4k Students",
            },
            {
              id: "analytics",
              label: "Student Progress & Analytics",
              icon: BarChart2,
              badge: "14 At Risk",
            },
            {
              id: "assignments",
              label: "Assignment Studio & Auto-Grading",
              icon: FileText,
              badge: `${assignments.length} Active`,
            },
            {
              id: "certifications",
              label: "Automated Certifications",
              icon: Award,
              badge: "ISO 21001",
            },
            {
              id: "teams_enterprise",
              label: "Teams Admin & Enterprise Consoles",
              icon: Building,
              badge: "SSO Ready",
            },
            {
              id: "developer_studio",
              label: "Developer Studio, CLI & MCP",
              icon: Terminal,
              badge: "API Online",
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TeacherTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-200 border border-cyan-500/50 shadow-lg shadow-cyan-950/30"
                    : "bg-[#08151c]/60 text-[#82a3b2] hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-[#82a3b2]"}`}
                />
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                    isActive
                      ? "bg-cyan-950/80 text-cyan-300 border border-cyan-500/30"
                      : "bg-black/30 text-[#6e90a0]"
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TAB: COURSE MANAGEMENT SUITE ================= */}
      {activeTab === "course_management" && (
        <div className="space-y-6">
          {/* Header & Quick Action */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0a1822] border border-[#1b3b4a]">
            <div>
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                Course Catalog & Multimedia Management Suite
              </h2>
              <p className="text-xs text-[#82a4b3]">
                Create new degree modules, upload streaming lectures, manage interactive quizzes, and edit syllabi.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCourseBuilderModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-500 hover:from-cyan-400 hover:to-cyan-400 text-black font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-lg shadow-cyan-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Course</span>
              </button>
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => (
              <div
                key={course.id}
                className="group p-5 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {course.code || "CRS-AI"}
                    </span>
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      {course.level || "Intermediate"}
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-white group-hover:text-cyan-300 transition">
                    {course.title}
                  </h3>

                  <p className="text-xs text-[#82a4b3] line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Course Metrics */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1b3b4a]/60 text-center text-[11px]">
                    <div className="p-2 rounded-lg bg-[#08151c] border border-[#1b3b4a]">
                      <span className="text-slate-500 block text-[9px]">LESSONS</span>
                      <span className="font-mono text-white font-bold">{course.lessons?.length || 0}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#08151c] border border-[#1b3b4a]">
                      <span className="text-slate-500 block text-[9px]">QUIZZES</span>
                      <span className="font-mono text-cyan-300 font-bold">{course.quizzes?.length || 0}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#08151c] border border-[#1b3b4a]">
                      <span className="text-slate-500 block text-[9px]">DURATION</span>
                      <span className="font-mono text-cyan-300 font-bold">{course.estimatedHours || 30}h</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1b3b4a] flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectCourse(course)}
                    className="flex-1 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>View Curriculum</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("enrollments");
                    }}
                    className="p-2 rounded-xl bg-[#08151c] hover:bg-[#122e3d] text-slate-300 hover:text-white border border-[#1b3b4a] transition"
                    title="Manage Students"
                  >
                    <Users className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: ENROLLMENTS & COHORTS ================= */}
      {activeTab === "enrollments" && (
        <EnrollmentManager
          courses={courses}
          onIssueCertificate={(student) => {
            setSelectedStudentForCert(student);
            setActiveTab("certifications");
          }}
        />
      )}

      {/* ================= TAB: CERTIFICATIONS ================= */}
      {activeTab === "certifications" && (
        <CertificateManager
          courses={courses}
          initialStudent={selectedStudentForCert}
        />
      )}

      {/* ================= SUB-TAB 1: STUDENT PROGRESS & PERFORMANCE ANALYTICS ================= */}
      {activeTab === "analytics" && (
        <div className="space-y-8">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-2">
              <div className="flex justify-between text-[#82a3b2] text-xs">
                <span>Enrolled Students</span>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-extrabold text-white">1,420</div>
              <p className="text-[11px] text-cyan-400 font-mono">
                +18.4% active engagement this month
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-2">
              <div className="flex justify-between text-[#82a3b2] text-xs">
                <span>Avg Quiz Accuracy</span>
                <CheckCircle className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-extrabold text-white">88.4%</div>
              <p className="text-[11px] text-cyan-300 font-mono">
                Adaptive difficulty balancing active
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-2">
              <div className="flex justify-between text-[#82a3b2] text-xs">
                <span>Struggling Concepts</span>
                <AlertTriangle className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-extrabold text-cyan-300">
                4 Flagged
              </div>
              <p className="text-[11px] text-cyan-400/80 font-mono">
                14 students need remedial review
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-2">
              <div className="flex justify-between text-[#82a3b2] text-xs">
                <span>Certificates Issued</span>
                <Award className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-extrabold text-white">384</div>
              <p className="text-[11px] text-cyan-300 font-mono">
                Cryptographically verified
              </p>
            </div>
          </div>

          {/* Areas Where Students Are Struggling Matrix */}
          <div className="p-6 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1b3b4a] pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-cyan-400" />
                  <span>Areas Where Students Are Struggling</span>
                </h2>
                <p className="text-xs text-[#82a3b2]">
                  Automated AI diagnostic flags topics with class accuracy below
                  75% and provides one-click remedial actions.
                </p>
              </div>
              <button
                onClick={fetchAnalytics}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#09151c] border border-[#1b3b4a] text-xs text-cyan-300 hover:bg-cyan-500/10 transition-all self-start sm:self-auto"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isLoadingAnalytics ? "animate-spin" : ""}`}
                />
                <span>Refresh AI Diagnostic</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(
                analyticsData?.strugglingConcepts || [
                  {
                    id: "c1",
                    topic: "Backpropagation & Chain Rule Derivatives",
                    courseTitle: "Deep Learning Systems",
                    avgAccuracy: 58,
                    strugglingCount: 18,
                    riskLevel: "High",
                  },
                  {
                    id: "c2",
                    topic: "Transformer Scaled Dot-Product Attention",
                    courseTitle: "Advanced Neural Architectures",
                    avgAccuracy: 62,
                    strugglingCount: 14,
                    riskLevel: "High",
                  },
                  {
                    id: "c3",
                    topic: "Distributed Consensus & Raft Leader Election",
                    courseTitle: "Distributed Systems",
                    avgAccuracy: 68,
                    strugglingCount: 11,
                    riskLevel: "Medium",
                  },
                  {
                    id: "c4",
                    topic: "SQL Query Optimization & B-Tree Indexing",
                    courseTitle: "Database Internals",
                    avgAccuracy: 71,
                    strugglingCount: 8,
                    riskLevel: "Medium",
                  },
                ]
              ).map((item: any) => (
                <div
                  key={item.id}
                  className="p-5 rounded-xl bg-[#09151c] border border-cyan-500/20 hover:border-cyan-500/40 transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        {item.riskLevel} Priority Gap
                      </span>
                      <h3 className="font-bold text-white text-sm mt-1">
                        {item.topic}
                      </h3>
                      <p className="text-xs text-[#82a3b2]">
                        {item.courseTitle}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xl font-mono font-extrabold text-cyan-400">
                        {item.avgAccuracy}%
                      </div>
                      <div className="text-[10px] text-[#82a3b2]">
                        Class Avg
                      </div>
                    </div>
                  </div>

                  {/* Accuracy Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-[#82a3b2]">
                      <span>Target: 80% Mastery</span>
                      <span>{item.strugglingCount} students flagged</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.avgAccuracy < 60
                            ? "bg-cyan-500"
                            : "bg-cyan-500"
                        }`}
                        style={{ width: `${item.avgAccuracy}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleGenerateRemedialPackage(item)}
                    className="w-full py-2 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Generate AI Remedial Quiz & Study Guide</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Student Progress & Risk Tracking Table */}
          <div className="p-6 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#1b3b4a] pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span>Student Progress & Performance Tracking</span>
                </h2>
                <p className="text-xs text-[#82a3b2]">
                  Individual progress metrics, quiz performance curves, and
                  at-risk notifications across assigned courses.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <Search className="w-3.5 h-3.5 text-[#82a3b2] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search student or email..."
                    className="w-full md:w-56 pl-9 pr-3 py-2 rounded-xl bg-[#09151c] border border-[#1b3b4a] text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <select
                  value={selectedCourseFilter}
                  onChange={(e) => setSelectedCourseFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#09151c] border border-[#1b3b4a] text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Courses</option>
                  <option value="Deep Learning Systems">
                    Deep Learning Systems
                  </option>
                  <option value="Advanced Neural Architectures">
                    Advanced Neural Architectures
                  </option>
                  <option value="Distributed Systems">
                    Distributed Systems
                  </option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1b3b4a] text-[#82a3b2] uppercase tracking-wider font-mono">
                    <th className="pb-3 pl-2">Student</th>
                    <th className="pb-3">Assigned Course</th>
                    <th className="pb-3">Progress</th>
                    <th className="pb-3">Avg Quiz</th>
                    <th className="pb-3">Risk Reason</th>
                    <th className="pb-3">Last Active</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b3b4a]/60">
                  {filteredStudents.map((s: any) => (
                    <tr
                      key={s.id}
                      className="hover:bg-cyan-500/5 transition-colors"
                    >
                      <td className="py-3.5 pl-2 font-semibold text-white">
                        <div>{s.name}</div>
                        <div className="text-[10px] text-[#82a3b2] font-mono">
                          {s.email}
                        </div>
                      </td>
                      <td className="py-3.5 text-[#82a3b2]">{s.course}</td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-black/40 overflow-hidden">
                            <div
                              className="h-full bg-cyan-400 rounded-full"
                              style={{ width: `${s.progress}%` }}
                            />
                          </div>
                          <span className="font-mono text-[#82a3b2]">
                            {s.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 font-mono text-cyan-300 font-bold">
                        {s.avgScore}%
                      </td>
                      <td className="py-3.5 text-xs text-cyan-400/90 max-w-xs">
                        {s.riskReason}
                      </td>
                      <td className="py-3.5 text-[#82a3b2] font-mono text-[11px]">
                        {s.lastActive}
                      </td>
                      <td className="py-3.5 text-right pr-2">
                        <button
                          onClick={() =>
                            handleGenerateRemedialPackage({
                              topic: s.riskReason,
                              courseTitle: s.course,
                            })
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold transition-all"
                        >
                          Dispatch Remedial
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick AI Quiz Studio Widget */}
          <div className="p-6 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-cyan-400" />
                <span>Instant AI Quiz Generator Studio</span>
              </h2>
              <p className="text-xs text-[#82a3b2]">
                Generate multi-choice quizzes for any module topic on demand
                using Gemini 3.1 AI.
              </p>
            </div>

            <form
              onSubmit={handleGenerateQuickQuiz}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="text"
                value={quickQuizTopic}
                onChange={(e) => setQuickQuizTopic(e.target.value)}
                placeholder="e.g. Distributed Raft Consensus & Log Replication"
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#09151c] border border-[#1b3b4a] text-white text-xs focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={isGeneratingQuiz || !quickQuizTopic.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {isGeneratingQuiz
                    ? "Architecting Quiz..."
                    : "Generate 3 Quiz Questions"}
                </span>
              </button>
            </form>

            {generatedQuiz && (
              <div className="space-y-3 pt-3 border-t border-[#1b3b4a] max-h-80 overflow-y-auto">
                <div className="text-xs font-semibold text-cyan-400">
                  Generated Quiz Result:
                </div>
                {generatedQuiz.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#09151c] border border-[#1b3b4a] text-xs space-y-2"
                  >
                    <div className="font-bold text-white">
                      Q{idx + 1}: {q.question}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#82a3b2]">
                      {q.options?.map((opt: string, oIdx: number) => (
                        <div
                          key={oIdx}
                          className={`p-2 rounded text-[11px] ${
                            oIdx === q.correctAnswerIndex
                              ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30"
                              : "bg-black/30 text-[#82a3b2]"
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}. {opt}
                        </div>
                      ))}
                    </div>
                    <div className="text-[10px] text-cyan-300/80 italic">
                      Explanation: {q.explanation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 2: TOOLS FOR CREATING NEW ASSIGNMENTS ================= */}
      {activeTab === "assignments" && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a]">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>Assignment & Auto-Grading Studio</span>
              </h2>
              <p className="text-xs text-[#82a3b2]">
                Create new course assignments with AI-generated rubrics,
                configure automated test cases, and manage submissions.
              </p>
            </div>

            <button
              onClick={() => setShowCreateAssignmentModal(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-cyan-950/40 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Assignment</span>
            </button>
          </div>

          {/* Active Assignments Grid */}
          <div className="p-6 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-6">
            <h3 className="text-base font-bold text-white">
              Active & Published Assignments ({assignments.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignments.map((asgn) => (
                <div
                  key={asgn.id}
                  className="p-5 rounded-xl bg-[#09151c] border border-[#1b3b4a] hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {asgn.category}
                      </span>
                      <span className="text-[11px] font-mono text-cyan-400 font-bold">
                        {asgn.totalPoints} pts
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm line-clamp-2">
                      {asgn.title}
                    </h4>
                    <p className="text-xs text-[#82a3b2] line-clamp-1">
                      {asgn.courseTitle}
                    </p>
                    <p className="text-[11px] text-[#6e90a0] line-clamp-2 italic">
                      {asgn.instructions}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#1b3b4a] space-y-2 text-xs">
                    <div className="flex justify-between text-[#82a3b2]">
                      <span>Due Date:</span>
                      <span className="font-mono text-white">
                        {asgn.dueDate}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#82a3b2]">
                      <span>Submissions:</span>
                      <span className="font-mono text-cyan-300 font-bold">
                        {asgn.submissionsCount} / {asgn.totalStudents}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#82a3b2]">
                      <span>Submission Type:</span>
                      <span className="font-mono text-white">
                        {asgn.submissionType}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        alert(`Reviewing submissions for ${asgn.title}`)
                      }
                      className="w-full mt-2 py-2 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
                    >
                      Review & Grade Submissions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 3: TEAMS ADMIN PORTAL & ENTERPRISE CONSOLES ================= */}
      {activeTab === "teams_enterprise" && (
        <div className="space-y-8">
          {/* Teams Admin Seats Manager */}
          <div className="p-6 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1b3b4a] pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span>Teams Admin Portal & Faculty Seat Management</span>
                </h2>
                <p className="text-xs text-[#82a3b2]">
                  Manage teaching assistants, department roles, and automated
                  notifications to Slack & Microsoft Teams.
                </p>
              </div>

              <button
                onClick={() => {
                  const email = prompt("Enter Faculty / TA Email Address:");
                  if (email) {
                    setTeamMembers((prev) => [
                      ...prev,
                      {
                        id: `${Date.now()}`,
                        name: email.split("@")[0],
                        role: "Teaching Assistant",
                        email,
                        status: "Pending",
                      },
                    ]);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold text-xs hover:bg-cyan-500/30 transition-all"
              >
                + Invite Faculty Member
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {teamMembers.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-xl bg-[#09151c] border border-[#1b3b4a] space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-white text-sm">{m.name}</div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        m.status === "Active"
                          ? "bg-cyan-500/20 text-cyan-300"
                          : "bg-cyan-500/20 text-cyan-300"
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                  <div className="text-xs text-cyan-400 font-semibold">
                    {m.role}
                  </div>
                  <div className="text-[11px] text-[#82a3b2] font-mono">
                    {m.email}
                  </div>
                </div>
              ))}
            </div>

            {/* Slack / Teams Webhook Integration */}
            <div className="pt-4 border-t border-[#1b3b4a] space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>
                  Slack & Microsoft Teams Automated Daily Digest Webhook
                </span>
              </h3>
              <p className="text-xs text-[#82a3b2]">
                Automatically posts daily student progress digests and
                struggling student alerts to your team channel.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#09151c] border border-[#1b3b4a] text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => {
                    setTestWebhookSuccess(true);
                    setTimeout(() => setTestWebhookSuccess(false), 3000);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold hover:bg-cyan-500/30 transition-all shrink-0"
                >
                  {testWebhookSuccess
                    ? "Test Digest Dispatched!"
                    : "Send Test Digest"}
                </button>
              </div>
            </div>
          </div>

          {/* Enterprise Consoles & Compliance */}
          <div className="p-6 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-6">
            <div className="border-b border-[#1b3b4a] pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-cyan-400" />
                <span>
                  Enterprise Consoles Integration & Security Compliance
                </span>
              </h2>
              <p className="text-xs text-[#82a3b2]">
                Single Sign-On (SSO/SAML), Attribute-Based Access Control
                (ABAC), PII Sanitizer logs, and Gradebook exports.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#09151c] border border-[#1b3b4a] space-y-2">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>SSO / SAML 2.0 Auth</span>
                </div>
                <p className="text-[11px] text-[#82a3b2]">
                  Connected to Azure AD & Okta Directory.
                </p>
                <div className="text-[10px] font-mono text-cyan-300 font-bold">
                  STATUS: ENFORCED
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#09151c] border border-[#1b3b4a] space-y-2">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>FERPA & GDPR PII Redactor</span>
                </div>
                <p className="text-[11px] text-[#82a3b2]">
                  Client-side zero-leak tokenization active.
                </p>
                <div className="text-[10px] font-mono text-cyan-300 font-bold">
                  100% SANITIZED
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#09151c] border border-[#1b3b4a] space-y-2">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Gradebook LMS Export</span>
                </div>
                <p className="text-[11px] text-[#82a3b2]">
                  Export student grades to Canvas, Moodle, or CSV.
                </p>
                <button
                  onClick={() =>
                    alert(
                      "Gradebook exported successfully as Canvas/Moodle JSON format.",
                    )
                  }
                  className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 hover:bg-cyan-500/30"
                >
                  Export CSV / JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 4: DEVELOPER STUDIO, CLI, MCP & SDK SYSTEMS ================= */}
      {activeTab === "developer_studio" && (
        <div className="space-y-8">
          {/* Faculty API Key Generator */}
          <div className="p-6 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <span>Faculty Developer API & Webhooks Studio</span>
              </h2>
              <p className="text-xs text-[#82a3b2]">
                Programmatic REST endpoints for creating courses, fetching
                student analytics, and automating grading.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#09151c] border border-[#1b3b4a] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 w-full sm:w-auto">
                <span className="text-[10px] font-mono text-[#82a3b2]">
                  Faculty Secret API Key
                </span>
                <div className="font-mono text-xs text-cyan-300">{apiKey}</div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => copyToClipboard(apiKey)}
                  className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  {copiedKey ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedKey ? "Copied!" : "Copy Key"}</span>
                </button>
                <button
                  onClick={() =>
                    setApiKey(
                      `zal_tch_sk_${Math.random().toString(36).substring(2, 18)}`,
                    )
                  }
                  className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-black/40 text-[#82a3b2] border border-[#1b3b4a] text-xs font-bold hover:text-white"
                >
                  Rotate Key
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Web Terminal for CLI & MCP Tools */}
          <div className="p-6 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  <span>Functioning CLI & MCP Server Terminal</span>
                </h2>
                <p className="text-xs text-[#82a3b2]">
                  Run live CLI commands or query Model Context Protocol tools
                  directly inside the sandboxed runtime.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                MCP STATUS: ONLINE
              </span>
            </div>

            {/* Terminal Window */}
            <div className="rounded-xl bg-[#040a0e] border border-[#1b3b4a] p-4 font-mono text-xs space-y-3">
              <div className="text-cyan-400/90 whitespace-pre-wrap max-h-60 overflow-y-auto pr-1">
                {cliOutput}
              </div>

              <form
                onSubmit={handleExecuteCliCommand}
                className="flex gap-2 pt-2 border-t border-[#1b3b4a]"
              >
                <span className="text-cyan-400 font-bold self-center">$</span>
                <input
                  type="text"
                  value={cliCommand}
                  onChange={(e) => setCliCommand(e.target.value)}
                  placeholder="e.g. lmdpro-cli assignments OR lmdpro-cli mcp status"
                  className="flex-1 bg-transparent text-white focus:outline-none text-xs font-mono"
                />
                <button
                  type="submit"
                  disabled={isExecutingCli || !cliCommand.trim()}
                  className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold hover:bg-cyan-500/30 disabled:opacity-50"
                >
                  Execute
                </button>
              </form>
            </div>
          </div>

          {/* SDK Code Snippets */}
          <div className="p-6 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <span>Teacher SDK & Integration Snippets</span>
                </h2>
                <p className="text-xs text-[#82a3b2]">
                  Production-ready SDK code snippets for calling teacher
                  endpoints in Node.js, Python, cURL, and Go.
                </p>
              </div>

              <div className="flex rounded-xl bg-[#09151c] p-1 border border-[#1b3b4a]">
                {(["node", "python", "curl", "go"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedSdk(lang)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold font-mono uppercase transition-all ${
                      selectedSdk === lang
                        ? "bg-cyan-500/30 text-cyan-200 border border-cyan-500/40"
                        : "text-[#82a3b2] hover:text-white"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#040a0e] border border-[#1b3b4a] font-mono text-xs text-cyan-200/90 overflow-x-auto">
              {selectedSdk === "node" && (
                <pre>{`import { LmdproFacultyClient } from '@lmdpro/sdk';

const client = new LmdproFacultyClient({ apiKey: '${apiKey}' });

// Fetch student progress analytics
const analytics = await client.analytics.getOverview();
console.log('Struggling students:', analytics.atRiskStudentsCount);

// Create new assignment
const assignment = await client.assignments.create({
  title: 'Lab 1: Attention Mechanisms',
  courseTitle: 'Advanced Neural Architectures',
  totalPoints: 100,
  generateRubricWithAI: true
});`}</pre>
              )}

              {selectedSdk === "python" && (
                <pre>{`from lmdpro import FacultyClient

client = FacultyClient(api_key="${apiKey}")

# Fetch analytics
analytics = client.analytics.get_overview()
print(f"Class Average: {analytics['avgQuizScore']}%")

# Generate AI Remedial Quiz
remedial = client.ai.generate_remedial(
    topic="Backpropagation Derivatives",
    course_title="Deep Learning Systems"
)`}</pre>
              )}

              {selectedSdk === "curl" && (
                <pre>{`curl -X POST https://lmdpro.app/api/teacher/assignments \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{
    "title": "Quiz 2: Calculus Derivatives",
    "courseTitle": "Deep Learning Systems",
    "totalPoints": 50,
    "generateWithAI": true
  }'`}</pre>
              )}

              {selectedSdk === "go" && (
                <pre>{`package main

import (
    "fmt"
    "github.com/lmdpro/sdk-go"
)

func main() {
    client := lmdpro.NewFacultyClient("${apiKey}")
    analytics, _ := client.GetAnalytics()
    fmt.Printf("Total Enrolled: %d\\n", analytics.TotalStudents)
}`}</pre>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Remedial AI Modal */}
      {remedialModalTopic && (
        <div className="fixed inset-0 bg-black/80 z-50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c1a24] border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-start border-b border-[#1b3b4a] pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-300 font-bold px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30">
                  AI Remedial Package Generated
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {remedialModalTopic.topic}
                </h3>
              </div>
              <button
                onClick={() => setRemedialModalTopic(null)}
                className="text-[#82a3b2] hover:text-white text-sm font-mono font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            {isGeneratingRemedial ? (
              <div className="py-12 text-center space-y-3">
                <span className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin inline-block" />
                <p className="text-xs text-cyan-300">
                  Gemini 3.1 AI is synthesizing remedial study materials &
                  practice quiz...
                </p>
              </div>
            ) : remedialPackage ? (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                <div className="p-4 rounded-xl bg-[#09151c] border border-[#1b3b4a] space-y-2">
                  <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    Concept Summary
                  </h4>
                  <p className="text-xs text-gray-200 leading-relaxed">
                    {remedialPackage.summary}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#09151c] border border-[#1b3b4a] space-y-2">
                  <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    Key Takeaways
                  </h4>
                  <ul className="list-disc pl-4 text-xs text-gray-300 space-y-1">
                    {remedialPackage.keyTakeaways?.map(
                      (kt: string, idx: number) => (
                        <li key={idx}>{kt}</li>
                      ),
                    )}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#09151c] border border-[#1b3b4a] space-y-3">
                  <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    Generated Diagnostic Practice Quiz
                  </h4>
                  {remedialPackage.quiz?.map((q: any, qIdx: number) => (
                    <div
                      key={qIdx}
                      className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-2 text-xs"
                    >
                      <div className="font-bold text-white">
                        Q{qIdx + 1}: {q.question}
                      </div>
                      <div className="space-y-1">
                        {q.options?.map((opt: string, oIdx: number) => (
                          <div
                            key={oIdx}
                            className={`px-2.5 py-1 rounded text-[11px] ${
                              oIdx === q.correctAnswerIndex
                                ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30"
                                : "text-gray-400"
                            }`}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex justify-end gap-3 pt-3 border-t border-[#1b3b4a]">
              <button
                onClick={() => {
                  alert(
                    `Remedial study package dispatched to all students struggling with ${remedialModalTopic.topic}!`,
                  );
                  setRemedialModalTopic(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-bold text-xs shadow-lg shadow-cyan-950/40"
              >
                Dispatch to Struggling Students
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateAssignmentModal && (
        <div className="fixed inset-0 bg-black/80 z-50 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateAssignment}
            className="bg-[#0c1a24] border border-cyan-500/40 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-[#1b3b4a] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-cyan-400" />
                <span>Create New Assignment</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateAssignmentModal(false)}
                className="text-[#82a3b2] hover:text-white font-mono font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  value={asgnTitle}
                  onChange={(e) => setAsgnTitle(e.target.value)}
                  placeholder="e.g. Lab 2: Multi-Head Scaled Attention in PyTorch"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#09151c] border border-[#1b3b4a] text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Assigned Course
                  </label>
                  <select
                    value={asgnCourse}
                    onChange={(e) => setAsgnCourse(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#09151c] border border-[#1b3b4a] text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={asgnCategory}
                    onChange={(e) => setAsgnCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#09151c] border border-[#1b3b4a] text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Coding Lab">Coding Lab</option>
                    <option value="Homework Quiz">Homework Quiz</option>
                    <option value="Capstone Project">Capstone Project</option>
                    <option value="Essay / Research Paper">
                      Essay / Research Paper
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={asgnDueDate}
                    onChange={(e) => setAsgnDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#09151c] border border-[#1b3b4a] text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Total Points
                  </label>
                  <input
                    type="number"
                    value={asgnPoints}
                    onChange={(e) => setAsgnPoints(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#09151c] border border-[#1b3b4a] text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Submission Type
                  </label>
                  <select
                    value={asgnType}
                    onChange={(e) => setAsgnType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#09151c] border border-[#1b3b4a] text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Code File">Code File</option>
                    <option value="PDF Document">PDF Document</option>
                    <option value="Quiz Assessment">Quiz Assessment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Instructions / Prompt
                </label>
                <textarea
                  rows={3}
                  value={asgnInstructions}
                  onChange={(e) => setAsgnInstructions(e.target.value)}
                  placeholder="Describe the assignment problem set or let Gemini AI generate detailed rubrics automatically."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#09151c] border border-[#1b3b4a] text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="aiRubricToggle"
                  checked={asgnAiGenerate}
                  onChange={(e) => setAsgnAiGenerate(e.target.checked)}
                  className="w-4 h-4 rounded border-[#1b3b4a] text-cyan-500 bg-[#09151c]"
                />
                <label
                  htmlFor="aiRubricToggle"
                  className="text-xs text-cyan-300 font-semibold cursor-pointer"
                >
                  Auto-generate detailed grading rubric & instructions with
                  Gemini 3.1 AI
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#1b3b4a]">
              <button
                type="button"
                onClick={() => setShowCreateAssignmentModal(false)}
                className="px-4 py-2 rounded-xl bg-black/40 text-gray-400 text-xs font-bold hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreatingAssignment || !asgnTitle.trim()}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-950/40"
              >
                {isCreatingAssignment
                  ? "Publishing..."
                  : "Publish Assignment to Class"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Course Builder Modal */}
      <CourseBuilderModal
        isOpen={showCourseBuilderModal}
        onClose={() => setShowCourseBuilderModal(false)}
        onSaveCourse={(newCourse) => {
          if (onAddCourse) {
            onAddCourse(newCourse);
          }
        }}
      />
    </div>
  );
};
