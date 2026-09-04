import React from "react";
import {
  BookOpen,
  Users,
  FileText,
  Bell,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X,
  RefreshCw,
  Download,
  Folder,
  Table,
  Mail,
  CheckSquare,
  FolderOpen,
} from "lucide-react";
import {
  googleSignIn,
  getAccessToken,
  logout,
  initAuth,
} from "../services/firebase";
import {
  ClassroomService,
  ClassroomCourse,
  ClassroomCourseWork,
  ClassroomStudent,
  ClassroomAnnouncement,
} from "../services/classroom";
import { WorkspaceService, DriveFile, GoogleTask } from "../shared/workspace.service";
import { Course, UserProfile } from "../shared/types";
import { User } from "firebase/auth";
import { GoogleDrivePicker } from "./GoogleDrivePicker";
import { OfflineStorageService } from "../services/offlineStorage";

interface GoogleClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportCourse: (course: Course) => void;
  currentUser: UserProfile;
}

export const GoogleClassroomModal: React.FC<GoogleClassroomModalProps> = ({
  isOpen,
  onClose,
  onImportCourse,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = React.useState<
    "classroom" | "drive" | "sheets" | "gmail" | "tasks"
  >("classroom");
  const [isPickerOpen, setIsPickerOpen] = React.useState(false);

  const [authUser, setAuthUser] = React.useState<User | null>(null);
  const [token, setToken] = React.useState<string | null>(getAccessToken());
  const [isLoadingAuth, setIsLoadingAuth] = React.useState(false);
  const [loadingError, setLoadingError] = React.useState<string | null>(null);

  // Classroom state
  const [courses, setCourses] = React.useState<ClassroomCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = React.useState(false);
  const [selectedClassroom, setSelectedClassroom] =
    React.useState<ClassroomCourse | null>(null);
  const [coursework, setCoursework] = React.useState<ClassroomCourseWork[]>([]);
  const [students, setStudents] = React.useState<ClassroomStudent[]>([]);
  const [announcements, setAnnouncements] = React.useState<ClassroomAnnouncement[]>(
    [],
  );
  const [loadingDetails, setLoadingDetails] = React.useState(false);

  // Workspace state
  const [driveFiles, setDriveFiles] = React.useState<DriveFile[]>([]);
  const [loadingDrive, setLoadingDrive] = React.useState(false);

  const [tasks, setTasks] = React.useState<GoogleTask[]>([]);
  const [loadingTasks, setLoadingTasks] = React.useState(false);

  const [emails, setEmails] = React.useState<any[]>([]);
  const [loadingEmails, setLoadingEmails] = React.useState(false);

  const [importingId, setImportingId] = React.useState<string | null>(null);
  const [importedSuccessMsg, setImportedSuccessMsg] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    const unsubscribe = initAuth(
      (u, tok) => {
        setAuthUser(u);
        if (tok) setToken(tok);
      },
      () => {
        setAuthUser(null);
        setToken(null);
      },
    );
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if (isOpen && token) {
      if (activeTab === "classroom" && courses.length === 0) loadCourses(token);
      if (activeTab === "drive" && driveFiles.length === 0)
        loadDriveFiles(token);
      if (activeTab === "tasks" && tasks.length === 0) loadTasks(token);
      if (activeTab === "gmail" && emails.length === 0) loadEmails(token);
    }
  }, [isOpen, token, activeTab]);

  const handleSignIn = async () => {
    setIsLoadingAuth(true);
    setLoadingError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setAuthUser(res.user);
        setToken(res.accessToken);
        if (res.accessToken) {
          await loadCourses(res.accessToken);
        }
      }
    } catch (err: any) {
      console.error("Google Sign In Error:", err);
      setLoadingError(
        err?.message || "Failed to sign in with Google Workspace",
      );
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setAuthUser(null);
    setToken(null);
    setCourses([]);
    setDriveFiles([]);
    setTasks([]);
    setEmails([]);
    setSelectedClassroom(null);
  };

  const loadCourses = async (accessToken: string) => {
    setLoadingCourses(true);
    setLoadingError(null);
    try {
      const fetchedCourses = await ClassroomService.fetchCourses(accessToken);
      setCourses(fetchedCourses);
      if (fetchedCourses.length > 0 && !selectedClassroom) {
        handleSelectCourse(fetchedCourses[0], accessToken);
      }
    } catch (err: any) {
      console.error("Failed to load Google Classroom courses:", err);
      setLoadingError(
        err?.message || "Error connecting to Google Classroom API",
      );
    } finally {
      setLoadingCourses(false);
    }
  };

  const loadDriveFiles = async (accessToken: string) => {
    setLoadingDrive(true);
    try {
      const files = await WorkspaceService.listDriveFiles(accessToken);
      setDriveFiles(files);
    } catch (err) {
      console.error("Drive fetch error:", err);
    } finally {
      setLoadingDrive(false);
    }
  };

  const loadTasks = async (accessToken: string) => {
    setLoadingTasks(true);
    try {
      const taskItems = await WorkspaceService.fetchTasks(accessToken);
      setTasks(taskItems);
    } catch (err) {
      console.error("Tasks fetch error:", err);
    } finally {
      setLoadingTasks(false);
    }
  };

  const loadEmails = async (accessToken: string) => {
    setLoadingEmails(true);
    try {
      const fetched = await WorkspaceService.fetchGmailMessages(accessToken);
      setEmails(fetched);
    } catch (err) {
      console.error("Gmail fetch error:", err);
    } finally {
      setLoadingEmails(false);
    }
  };

  const handleSelectCourse = async (
    course: ClassroomCourse,
    tok: string | null = token,
  ) => {
    setSelectedClassroom(course);
    if (!tok) return;

    setLoadingDetails(true);
    try {
      const [cw, st, ann] = await Promise.all([
        ClassroomService.fetchCourseWork(tok, course.id),
        ClassroomService.fetchStudents(tok, course.id),
        ClassroomService.fetchAnnouncements(tok, course.id),
      ]);
      setCoursework(cw);
      setStudents(st);
      setAnnouncements(ann);
    } catch (err: any) {
      console.error("Error loading course details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleImport = async (classroom: ClassroomCourse) => {
    setImportingId(classroom.id);
    setImportedSuccessMsg(null);

    try {
      const courseId = `classroom-import-${classroom.id}`;
      const lessons = coursework.map((cw, idx) => ({
        id: `les-${courseId}-${idx}`,
        title: cw.title || `Assignment ${idx + 1}`,
        durationMinutes: 20,
        content:
          cw.description ||
          `Synced Google Classroom Coursework.\n\n### Assignment Details:\n- **Type**: ${cw.workType || "Assignment"}\n- **Points**: ${cw.maxPoints || "Ungraded"}`,
        keyTakeaways: [
          `Review assignment: ${cw.title}`,
          `Understand key requirements and instructions`,
          `Submit deliverables on Google Classroom or Zalamati Portal`,
        ],
        audioScript: `Welcome to ${cw.title}. Please review the course assignment details.`,
        quizzes: [
          {
            id: `q-${courseId}-${idx}`,
            question: `What is the primary topic of ${cw.title}?`,
            options: [
              cw.title,
              "General Knowledge Overview",
              "Unassigned Reading",
              "Self-Evaluation Quiz",
            ],
            correctAnswerIndex: 0,
            explanation: `This lesson covers coursework item "${cw.title}".`,
            hint: "Select the exact assignment title.",
          },
        ],
        flashcards: [
          {
            id: `fc-${courseId}-${idx}`,
            front: cw.title,
            back: cw.description
              ? cw.description.slice(0, 150) + "..."
              : "Google Classroom Coursework Item",
          },
        ],
      }));

      // Fallback if coursework is empty
      if (lessons.length === 0) {
        lessons.push({
          id: `les-${courseId}-0`,
          title: `Welcome to ${classroom.name}`,
          durationMinutes: 15,
          content: `${classroom.descriptionHeading || classroom.section || "Imported Google Classroom Course"}.\n\nConnect with instructors and peers, access course materials, and track assignments seamlessly.`,
          keyTakeaways: [
            "Engage with course announcements and materials.",
            "Track your learning milestones.",
          ],
          audioScript: `Welcome to ${classroom.name}. Let us begin exploring your coursework!`,
          quizzes: [
            {
              id: `q-${courseId}-0`,
              question: `Which platform is synced with this course?`,
              options: ["Google Classroom", "Moodle", "Canvas", "Blackboard"],
              correctAnswerIndex: 0,
              explanation:
                "This course is directly synced from Google Classroom.",
              hint: "Look for Google Classroom.",
            },
          ],
          flashcards: [
            {
              id: `fc-${courseId}-0`,
              front: classroom.name,
              back: "Imported Google Classroom Course",
            },
          ],
        });
      }

      const newCourse: Course = {
        id: courseId,
        title: classroom.name,
        category: "Google Classroom",
        description:
          classroom.descriptionHeading ||
          classroom.section ||
          `Imported Google Classroom course with ${lessons.length} coursework items.`,
        level: "All Levels",
        coverImage:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
        author:
          authUser?.displayName ||
          currentUser.name ||
          "Google Classroom Instructor",
        rating: 4.9,
        durationHours: Math.ceil(lessons.length * 0.5) || 2,
        modules: [
          {
            id: `mod-${courseId}-1`,
            title: classroom.section
              ? `Section: ${classroom.section}`
              : "Google Classroom Curriculum",
            description:
              "Coursework, assignments, and study materials imported from Google Classroom.",
            lessons,
          },
        ],
        tags: ["Google Classroom", "Synced", classroom.section || "Classroom"],
        isAiGenerated: true,
      };

      onImportCourse(newCourse);
      setImportedSuccessMsg(
        `Successfully imported "${classroom.name}" into Zalamati Academy!`,
      );
    } catch (err: any) {
      console.error("Failed to import classroom course:", err);
    } finally {
      setImportingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#13131c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-cyan-900/30 via-blue-900/20 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                LMS Classroom Synchronizer
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium">
                  Verified API Gateway
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Sync courses, coursework, rosters, and announcements directly
                into your workspace
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Auth Banner */}
          {!token ? (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-950/40 via-cyan-950/20 to-black border border-blue-500/30 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Connect Your Classroom Account
                </h3>
                <p className="text-xs text-gray-400 max-w-md mt-1">
                  Authenticate with your institution's portal to grant
                  permission for reading your classroom courses, rosters,
                  coursework, and announcements.
                </p>
              </div>

              {/* Official Google Material Sign-In Button */}
              <button
                onClick={handleSignIn}
                disabled={isLoadingAuth}
                className="gsi-material-button inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-semibold text-sm shadow-lg transition-transform active:scale-95 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                <span>
                  {isLoadingAuth
                    ? "Connecting to portal..."
                    : "Authorize Secure Portal Integration"}
                </span>
              </button>

              {loadingError && (
                <div className="flex items-center gap-2 text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loadingError}</span>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Auth User Info & Disconnect */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {authUser?.displayName?.charAt(0) || "G"}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">
                      {authUser?.displayName || authUser?.email}
                    </div>
                    <div className="text-[10px] text-cyan-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Connected to Classroom Synchronizer
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => token && loadCourses(token)}
                    disabled={loadingCourses}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 transition-colors"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${loadingCourses ? "animate-spin" : ""}`}
                    />
                    <span>Refresh</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-xs text-cyan-400 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <button
                  onClick={() => setActiveTab("classroom")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === "classroom"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Classroom</span>
                </button>

                <button
                  onClick={() => setActiveTab("drive")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === "drive"
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Folder className="w-3.5 h-3.5" />
                  <span>Drive & Picker</span>
                </button>

                <button
                  onClick={() => setActiveTab("tasks")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === "tasks"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Tasks</span>
                </button>

                <button
                  onClick={() => setActiveTab("gmail")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === "gmail"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Gmail Digest</span>
                </button>
              </div>

              {importedSuccessMsg && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
                  <span>{importedSuccessMsg}</span>
                </div>
              )}

              {/* Tab Content 1: Google Classroom */}
              {activeTab === "classroom" && (
                <>
                  {loadingCourses ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                      <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
                      <p className="text-xs text-gray-400">
                        Fetching courses from Google Classroom API...
                      </p>
                    </div>
                  ) : courses.length === 0 ? (
                    <div className="py-10 text-center space-y-2">
                      <BookOpen className="w-10 h-10 text-gray-500 mx-auto" />
                      <p className="text-sm font-semibold text-gray-300">
                        No active Google Classroom courses found
                      </p>
                      <p className="text-xs text-gray-500">
                        Make sure your Google account has active enrolled or
                        taught courses in Google Classroom.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {/* Left Column: Courses List */}
                      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                          Your Classroom Courses ({courses.length})
                        </label>
                        {courses.map((c) => {
                          const isSelected = selectedClassroom?.id === c.id;
                          return (
                            <div
                              key={c.id}
                              onClick={() => handleSelectCourse(c)}
                              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                                isSelected
                                  ? "bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-cyan-500/50 shadow-md"
                                  : "bg-white/5 border-white/10 hover:bg-white/10"
                              }`}
                            >
                              <div className="font-semibold text-xs text-white line-clamp-1">
                                {c.name}
                              </div>
                              {c.section && (
                                <div className="text-[10px] text-cyan-300 mt-0.5">
                                  {c.section}
                                </div>
                              )}
                              <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-between">
                                <span>Status: {c.courseState || "ACTIVE"}</span>
                                {c.alternateLink && (
                                  <a
                                    href={c.alternateLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-blue-400 hover:underline flex items-center gap-0.5"
                                  >
                                    View{" "}
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Right Column: Selected Course Overview & Details */}
                      <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col space-y-4">
                        {selectedClassroom ? (
                          <>
                            <div className="flex items-start justify-between pb-3 border-b border-white/10">
                              <div>
                                <h4 className="font-bold text-sm text-white">
                                  {selectedClassroom.name}
                                </h4>
                                {selectedClassroom.section && (
                                  <p className="text-xs text-cyan-300">
                                    {selectedClassroom.section}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => handleImport(selectedClassroom)}
                                disabled={importingId === selectedClassroom.id}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95 disabled:opacity-50"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>
                                  {importingId === selectedClassroom.id
                                    ? "Importing..."
                                    : "Import to Zalamati Academy"}
                                </span>
                              </button>
                            </div>

                            {loadingDetails ? (
                              <div className="py-8 text-center space-y-2">
                                <RefreshCw className="w-6 h-6 text-blue-400 animate-spin mx-auto" />
                                <p className="text-xs text-gray-400">
                                  Loading coursework & roster details...
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-4 text-xs">
                                {/* Coursework Section */}
                                <div>
                                  <div className="flex items-center gap-1.5 font-semibold text-blue-300 mb-2">
                                    <FileText className="w-4 h-4" />
                                    <span>
                                      Coursework & Assignments (
                                      {coursework.length})
                                    </span>
                                  </div>
                                  {coursework.length === 0 ? (
                                    <p className="text-gray-500 text-[11px] italic">
                                      No assignments posted yet.
                                    </p>
                                  ) : (
                                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                                      {coursework.map((cw) => (
                                        <div
                                          key={cw.id}
                                          className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between"
                                        >
                                          <span className="font-medium text-gray-200">
                                            {cw.title}
                                          </span>
                                          <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                                            {cw.maxPoints
                                              ? `${cw.maxPoints} pts`
                                              : "Ungraded"}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Roster Section */}
                                <div>
                                  <div className="flex items-center gap-1.5 font-semibold text-cyan-300 mb-2">
                                    <Users className="w-4 h-4" />
                                    <span>
                                      Enrolled Students ({students.length})
                                    </span>
                                  </div>
                                  {students.length === 0 ? (
                                    <p className="text-gray-500 text-[11px] italic">
                                      No student rosters returned or restricted.
                                    </p>
                                  ) : (
                                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                                      {students.map((st) => (
                                        <span
                                          key={st.userId}
                                          className="px-2 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300"
                                        >
                                          {st.profile?.name?.fullName ||
                                            st.profile?.emailAddress ||
                                            "Student"}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Announcements Section */}
                                {announcements.length > 0 && (
                                  <div>
                                    <div className="flex items-center gap-1.5 font-semibold text-cyan-300 mb-2">
                                      <Bell className="w-4 h-4" />
                                      <span>
                                        Announcements ({announcements.length})
                                      </span>
                                    </div>
                                    <div className="space-y-1 max-h-24 overflow-y-auto">
                                      {announcements.map((ann) => (
                                        <div
                                          key={ann.id}
                                          className="p-2 rounded-lg bg-black/30 text-[11px] text-gray-300 line-clamp-2"
                                        >
                                          {ann.text}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="py-12 text-center text-gray-500">
                            Select a course from the list to view its details.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Tab Content 2: Google Drive & Picker */}
              {activeTab === "drive" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Google Drive & Picker Attachments
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsPickerOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-bold text-cyan-300 transition-all flex items-center gap-1.5"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Open Drive Picker</span>
                      </button>
                      <button
                        onClick={() => token && loadDriveFiles(token)}
                        disabled={loadingDrive}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-blue-300 transition-colors flex items-center gap-1"
                      >
                        <RefreshCw
                          className={`w-3.5 h-3.5 ${loadingDrive ? "animate-spin" : ""}`}
                        />
                        <span>Refresh Drive</span>
                      </button>
                    </div>
                  </div>

                  {loadingDrive ? (
                    <div className="py-8 text-center text-gray-400">
                      Loading Drive files...
                    </div>
                  ) : driveFiles.length === 0 ? (
                    <div className="py-8 text-center text-gray-500 text-xs">
                      No recent Drive files found or accessible.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                      {driveFiles.map((file) => (
                        <div
                          key={file.id}
                          className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/40 transition-all flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <Folder className="w-5 h-5 text-blue-400 shrink-0" />
                            <div className="truncate">
                              <div className="text-xs font-semibold text-white truncate">
                                {file.name}
                              </div>
                              <div className="text-[10px] text-gray-400 truncate">
                                {file.mimeType}
                              </div>
                            </div>
                          </div>
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs"
                              title="Open in Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab Content 3: Google Tasks */}
              {activeTab === "tasks" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Synced Google Tasks
                    </h3>
                    <button
                      onClick={() => token && loadTasks(token)}
                      disabled={loadingTasks}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-cyan-300 transition-colors flex items-center gap-1"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${loadingTasks ? "animate-spin" : ""}`}
                      />
                      <span>Refresh Tasks</span>
                    </button>
                  </div>

                  {loadingTasks ? (
                    <div className="py-8 text-center text-gray-400">
                      Loading Google Tasks...
                    </div>
                  ) : tasks.length === 0 ? (
                    <div className="py-8 text-center text-gray-500 text-xs">
                      No pending tasks found in your Google Tasks account.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {tasks.map((t) => (
                        <div
                          key={t.id}
                          className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <CheckSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                            <div>
                              <div className="text-xs font-semibold text-white">
                                {t.title}
                              </div>
                              {t.notes && (
                                <div className="text-[10px] text-gray-400">
                                  {t.notes}
                                </div>
                              )}
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {t.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab Content 4: Gmail Digest */}
              {activeTab === "gmail" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Recent Course Notifications (Gmail)
                    </h3>
                    <button
                      onClick={() => token && loadEmails(token)}
                      disabled={loadingEmails}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-cyan-300 transition-colors flex items-center gap-1"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${loadingEmails ? "animate-spin" : ""}`}
                      />
                      <span>Sync Gmail</span>
                    </button>
                  </div>

                  {loadingEmails ? (
                    <div className="py-8 text-center text-gray-400">
                      Scanning Gmail for course emails...
                    </div>
                  ) : emails.length === 0 ? (
                    <div className="py-8 text-center text-gray-500 text-xs">
                      No recent classroom or course emails retrieved.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {emails.map((msg, idx) => (
                        <div
                          key={msg.id || idx}
                          className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs"
                        >
                          <div className="font-semibold text-white truncate">
                            {msg.snippet || "Classroom Email Notification"}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1">
                            ID: {msg.id}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Embedded Google Drive Picker */}
      <GoogleDrivePicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelectFile={(file) => {
          try {
            const existingDocs = OfflineStorageService.getCachedLibraryDocs();
            const newDoc = {
              id: `drive-import-${file.id}`,
              title: file.name,
              type: "Google Drive Document",
              author: "User Imported",
              citations: 0,
              date: new Date().getFullYear().toString(),
              content: `Imported Google Drive Document metadata:\nName: ${file.name}\nID: ${file.id}\nMimeType: ${file.mimeType}\nURL: ${file.webViewLink || ""}\n\n[Active document awaiting secure background NLP optimization and embedding caching]`,
            };
            OfflineStorageService.saveCachedLibraryDocs([
              newDoc,
              ...existingDocs,
            ]);

            // Add to locally displayed files
            setDriveFiles((prev) => [file, ...prev]);
          } catch (e) {
            console.error("Failed to save imported drive file to library:", e);
          }
        }}
      />
    </div>
  );
};
