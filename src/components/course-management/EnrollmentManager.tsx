import React from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  Mail,
  CheckCircle,
  AlertCircle,
  Clock,
  Award,
  MoreVertical,
  Shield,
  Trash2,
  Send,
  FileSpreadsheet,
  Check,
  X
} from "lucide-react";
import { Course } from "../../shared/types";

export interface StudentEnrollment {
  id: string;
  name: string;
  email: string;
  studentId: string;
  enrolledCourseId: string;
  courseTitle: string;
  cohort: string;
  enrollmentDate: string;
  progressPercentage: number;
  avgQuizScore: number;
  status: "Active" | "Completed" | "At Risk" | "Paused";
  lastActive: string;
}

interface EnrollmentManagerProps {
  courses: Course[];
  onIssueCertificate?: (student: StudentEnrollment) => void;
}

export const EnrollmentManager: React.FC<EnrollmentManagerProps> = ({
  courses,
  onIssueCertificate,
}) => {
  const [enrollments, setEnrollments] = React.useState<StudentEnrollment[]>([
    {
      id: "enr-1",
      name: "Alex Rivera",
      email: "alex.rivera@techuni.edu",
      studentId: "STU-88219",
      enrolledCourseId: "crs-ai-ethics-10w",
      courseTitle: "Artificial Intelligence Ethics: Principles & Alignment",
      cohort: "Spring 2026 AI Fellows",
      enrollmentDate: "2026-08-01",
      progressPercentage: 100,
      avgQuizScore: 96.5,
      status: "Completed",
      lastActive: "2 hours ago",
    },
    {
      id: "enr-2",
      name: "Sophia Chen",
      email: "s.chen@stanford.edu",
      studentId: "STU-88220",
      enrolledCourseId: "crs-ai-ethics-10w",
      courseTitle: "Artificial Intelligence Ethics: Principles & Alignment",
      cohort: "Spring 2026 AI Fellows",
      enrollmentDate: "2026-08-02",
      progressPercentage: 78,
      avgQuizScore: 91.0,
      status: "Active",
      lastActive: "1 day ago",
    },
    {
      id: "enr-3",
      name: "Liam O'Connor",
      email: "liam.oc@mit.edu",
      studentId: "STU-88221",
      enrolledCourseId: "neural-architectures",
      courseTitle: "Advanced Neural Architectures & LLMs",
      cohort: "Enterprise AI Track",
      enrollmentDate: "2026-07-28",
      progressPercentage: 35,
      avgQuizScore: 68.2,
      status: "At Risk",
      lastActive: "5 days ago",
    },
    {
      id: "enr-4",
      name: "Maya Patel",
      email: "m.patel@oxford.ac.uk",
      studentId: "STU-88222",
      enrolledCourseId: "sheaf-learning",
      courseTitle: "Cellular Sheaves & Topological Multi-Agent Learning",
      cohort: "Spring 2026 AI Fellows",
      enrollmentDate: "2026-08-05",
      progressPercentage: 92,
      avgQuizScore: 94.8,
      status: "Active",
      lastActive: "30 mins ago",
    },
    {
      id: "enr-5",
      name: "Dmitri Volkov",
      email: "d.volkov@cmu.edu",
      studentId: "STU-88223",
      enrolledCourseId: "crs-ai-ethics-10w",
      courseTitle: "Artificial Intelligence Ethics: Principles & Alignment",
      cohort: "Accelerated Honors Group",
      enrollmentDate: "2026-08-10",
      progressPercentage: 100,
      avgQuizScore: 98.2,
      status: "Completed",
      lastActive: "Just now",
    },
  ]);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCourseFilter, setSelectedCourseFilter] = React.useState("all");
  const [selectedCohortFilter, setSelectedCohortFilter] = React.useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = React.useState("all");

  // Single Enrollment Modal
  const [showSingleModal, setShowSingleModal] = React.useState(false);
  const [newStudentName, setNewStudentName] = React.useState("");
  const [newStudentEmail, setNewStudentEmail] = React.useState("");
  const [newStudentCourse, setNewStudentCourse] = React.useState(courses[0]?.id || "");
  const [newStudentCohort, setNewStudentCohort] = React.useState("Spring 2026 AI Fellows");

  // Bulk Enrollment Modal
  const [showBulkModal, setShowBulkModal] = React.useState(false);
  const [bulkEmails, setBulkEmails] = React.useState("");
  const [bulkCourse, setBulkCourse] = React.useState(courses[0]?.id || "");
  const [bulkCohort, setBulkCohort] = React.useState("Spring 2026 AI Fellows");
  const [bulkSuccessMsg, setBulkSuccessMsg] = React.useState("");

  // Filtered Students
  const filteredStudents = enrollments.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCourse = selectedCourseFilter === "all" || s.enrolledCourseId === selectedCourseFilter;
    const matchCohort = selectedCohortFilter === "all" || s.cohort === selectedCohortFilter;
    const matchStatus = selectedStatusFilter === "all" || s.status === selectedStatusFilter;
    return matchSearch && matchCourse && matchCohort && matchStatus;
  });

  const handleEnrollSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentEmail.trim()) return;

    const courseObj = courses.find((c) => c.id === newStudentCourse) || courses[0];
    const newStudent: StudentEnrollment = {
      id: `enr-${Date.now()}`,
      name: newStudentName.trim(),
      email: newStudentEmail.trim(),
      studentId: `STU-${Math.floor(80000 + Math.random() * 19999)}`,
      enrolledCourseId: courseObj?.id || "general",
      courseTitle: courseObj?.title || "Custom Course",
      cohort: newStudentCohort,
      enrollmentDate: new Date().toISOString().split("T")[0],
      progressPercentage: 0,
      avgQuizScore: 0,
      status: "Active",
      lastActive: "Just enrolled",
    };

    setEnrollments([newStudent, ...enrollments]);
    setShowSingleModal(false);
    setNewStudentName("");
    setNewStudentEmail("");
  };

  const handleBulkEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkEmails.trim()) return;

    const emails = bulkEmails
      .split(/[\n,;]+/)
      .map((e) => e.trim())
      .filter((e) => e.length > 3 && e.includes("@"));

    const courseObj = courses.find((c) => c.id === bulkCourse) || courses[0];

    const newStudents: StudentEnrollment[] = emails.map((email, idx) => ({
      id: `enr-${Date.now()}-${idx}`,
      name: email.split("@")[0].replace(".", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      email: email,
      studentId: `STU-${Math.floor(80000 + Math.random() * 19999)}`,
      enrolledCourseId: courseObj?.id || "general",
      courseTitle: courseObj?.title || "Custom Course",
      cohort: bulkCohort,
      enrollmentDate: new Date().toISOString().split("T")[0],
      progressPercentage: 0,
      avgQuizScore: 0,
      status: "Active",
      lastActive: "Just enrolled",
    }));

    setEnrollments([...newStudents, ...enrollments]);
    setBulkSuccessMsg(`Successfully enrolled ${newStudents.length} students into ${courseObj?.title}!`);
    setTimeout(() => {
      setShowBulkModal(false);
      setBulkSuccessMsg("");
      setBulkEmails("");
    }, 1500);
  };

  const handleExportCSV = () => {
    const headers = "ID,Name,Email,StudentID,Course,Cohort,Progress,QuizAvg,Status,LastActive\n";
    const rows = enrollments
      .map(
        (s) =>
          `"${s.id}","${s.name}","${s.email}","${s.studentId}","${s.courseTitle}","${s.cohort}",${s.progressPercentage}%,${s.avgQuizScore}%,"${s.status}","${s.lastActive}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `LMDpro_Student_Enrollments_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0a1822] border border-[#1b3b4a]">
        <div>
          <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Student & Cohort Enrollment Management
          </h3>
          <p className="text-xs text-[#82a4b3]">
            Track individual progress, assign cohorts, perform bulk CSV imports, and trigger completion certificates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-[#030b10] hover:bg-[#0e222e] border border-[#1b3b4a] text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowBulkModal(true)}
            className="px-3.5 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Bulk Import</span>
          </button>
          <button
            onClick={() => setShowSingleModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-500 hover:from-cyan-400 hover:to-cyan-400 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-cyan-500/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enroll Student</span>
          </button>
        </div>
      </div>

      {/* Cohort Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0a1822] border border-[#1b3b4a] space-y-1">
          <span className="text-xs text-slate-400">Total Enrolled</span>
          <div className="text-2xl font-bold text-white">{enrollments.length}</div>
          <span className="text-[11px] text-cyan-400">100% active seats verified</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0a1822] border border-[#1b3b4a] space-y-1">
          <span className="text-xs text-slate-400">Completed Courses</span>
          <div className="text-2xl font-bold text-cyan-400">
            {enrollments.filter((s) => s.status === "Completed").length}
          </div>
          <span className="text-[11px] text-cyan-300">Eligible for certification</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0a1822] border border-[#1b3b4a] space-y-1">
          <span className="text-xs text-slate-400">Active Learners</span>
          <div className="text-2xl font-bold text-cyan-300">
            {enrollments.filter((s) => s.status === "Active").length}
          </div>
          <span className="text-[11px] text-cyan-200">On schedule</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0a1822] border border-[#1b3b4a] space-y-1">
          <span className="text-xs text-slate-400">At-Risk Interventions</span>
          <div className="text-2xl font-bold text-cyan-400">
            {enrollments.filter((s) => s.status === "At Risk").length}
          </div>
          <span className="text-[11px] text-cyan-300">Remedial packs ready</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-xl bg-[#0a1822] border border-[#1b3b4a] flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student by name, email, or Student ID..."
            className="w-full bg-[#030b10] border border-[#1b3b4a] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
          />
        </div>

        <select
          value={selectedCourseFilter}
          onChange={(e) => setSelectedCourseFilter(e.target.value)}
          className="bg-[#030b10] border border-[#1b3b4a] rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
        >
          <option value="all">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>

        <select
          value={selectedCohortFilter}
          onChange={(e) => setSelectedCohortFilter(e.target.value)}
          className="bg-[#030b10] border border-[#1b3b4a] rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
        >
          <option value="all">All Cohorts</option>
          <option value="Spring 2026 AI Fellows">Spring 2026 AI Fellows</option>
          <option value="Enterprise AI Track">Enterprise AI Track</option>
          <option value="Accelerated Honors Group">Accelerated Honors Group</option>
        </select>

        <select
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          className="bg-[#030b10] border border-[#1b3b4a] rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="At Risk">At Risk</option>
        </select>
      </div>

      {/* Enrolled Students Table */}
      <div className="overflow-x-auto rounded-xl border border-[#1b3b4a] bg-[#0a1822]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#071319] text-[#82a4b3] uppercase font-mono text-[10px] border-b border-[#1b3b4a]">
            <tr>
              <th className="p-3.5">Student Details</th>
              <th className="p-3.5">Enrolled Course</th>
              <th className="p-3.5">Cohort</th>
              <th className="p-3.5">Progress</th>
              <th className="p-3.5">Quiz Mastery</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1b3b4a]/60 text-slate-200">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-[#0c1e2b] transition">
                <td className="p-3.5">
                  <div className="font-bold text-white">{student.name}</div>
                  <div className="text-[11px] text-[#82a4b3]">{student.email}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{student.studentId}</div>
                </td>
                <td className="p-3.5">
                  <span className="font-medium text-cyan-200">{student.courseTitle}</span>
                  <div className="text-[10px] text-slate-500">Enrolled: {student.enrollmentDate}</div>
                </td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                    {student.cohort}
                  </span>
                </td>
                <td className="p-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-[#030b10] rounded-full h-1.5 overflow-hidden border border-[#1b3b4a]">
                      <div
                        className={`h-full rounded-full ${
                          student.progressPercentage === 100
                            ? "bg-cyan-400"
                            : student.progressPercentage < 40
                            ? "bg-cyan-400"
                            : "bg-cyan-400"
                        }`}
                        style={{ width: `${student.progressPercentage}%` }}
                      />
                    </div>
                    <span className="font-mono text-[11px]">{student.progressPercentage}%</span>
                  </div>
                </td>
                <td className="p-3.5">
                  <span
                    className={`font-mono font-bold ${
                      student.avgQuizScore >= 90
                        ? "text-cyan-400"
                        : student.avgQuizScore < 70
                        ? "text-cyan-400"
                        : "text-cyan-300"
                    }`}
                  >
                    {student.avgQuizScore}%
                  </span>
                </td>
                <td className="p-3.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      student.status === "Completed"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        : student.status === "At Risk"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {student.progressPercentage === 100 && onIssueCertificate && (
                      <button
                        onClick={() => onIssueCertificate(student)}
                        className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-[11px] font-bold flex items-center gap-1"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Issue Cert</span>
                      </button>
                    )}
                    <button
                      onClick={() =>
                        alert(`Reminder email notification dispatched to ${student.email}!`)
                      }
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
                      title="Send Reminder"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SINGLE ENROLLMENT MODAL */}
      {showSingleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#08151c] border border-[#1b3b4a] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1b3b4a] pb-3">
              <h4 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-cyan-400" />
                Enroll New Student
              </h4>
              <button
                onClick={() => setShowSingleModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEnrollSingle} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g. Jordan Lee"
                  className="w-full bg-[#030b10] border border-[#1b3b4a] rounded-lg p-2.5 text-xs text-white focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  placeholder="e.g. jordan.lee@university.edu"
                  className="w-full bg-[#030b10] border border-[#1b3b4a] rounded-lg p-2.5 text-xs text-white focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Assign Course</label>
                <select
                  value={newStudentCourse}
                  onChange={(e) => setNewStudentCourse(e.target.value)}
                  className="w-full bg-[#030b10] border border-[#1b3b4a] rounded-lg p-2.5 text-xs text-white focus:border-cyan-400 outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Cohort Group</label>
                <select
                  value={newStudentCohort}
                  onChange={(e) => setNewStudentCohort(e.target.value)}
                  className="w-full bg-[#030b10] border border-[#1b3b4a] rounded-lg p-2.5 text-xs text-white focus:border-cyan-400 outline-none"
                >
                  <option value="Spring 2026 AI Fellows">Spring 2026 AI Fellows</option>
                  <option value="Enterprise AI Track">Enterprise AI Track</option>
                  <option value="Accelerated Honors Group">Accelerated Honors Group</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#1b3b4a]">
                <button
                  type="button"
                  onClick={() => setShowSingleModal(false)}
                  className="px-4 py-2 bg-black/40 text-slate-400 text-xs font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-cyan-500 text-black font-bold text-xs rounded-lg shadow-lg shadow-cyan-500/20"
                >
                  Confirm Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BULK IMPORT MODAL */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#08151c] border border-[#1b3b4a] rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1b3b4a] pb-3">
              <h4 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                Bulk Student CSV / Email Import
              </h4>
              <button
                onClick={() => setShowBulkModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {bulkSuccessMsg ? (
              <div className="p-4 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {bulkSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleBulkEnroll} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Target Course:</label>
                  <select
                    value={bulkCourse}
                    onChange={(e) => setBulkCourse(e.target.value)}
                    className="w-full bg-[#030b10] border border-[#1b3b4a] rounded-lg p-2 text-xs text-white focus:border-cyan-400 outline-none"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Target Cohort:</label>
                  <input
                    type="text"
                    value={bulkCohort}
                    onChange={(e) => setBulkCohort(e.target.value)}
                    className="w-full bg-[#030b10] border border-[#1b3b4a] rounded-lg p-2 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">
                    Paste Student Emails (One per line or comma-separated):
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={bulkEmails}
                    onChange={(e) => setBulkEmails(e.target.value)}
                    placeholder="student1@university.edu&#10;student2@university.edu&#10;student3@tech.org"
                    className="w-full bg-[#030b10] border border-[#1b3b4a] rounded-lg p-3 text-xs text-white font-mono focus:border-cyan-400 outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#1b3b4a]">
                  <button
                    type="button"
                    onClick={() => setShowBulkModal(false)}
                    className="px-4 py-2 bg-black/40 text-slate-400 text-xs font-bold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-lg transition"
                  >
                    Execute Batch Enrollment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
