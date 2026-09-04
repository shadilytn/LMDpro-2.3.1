export type UserRole = 'student' | 'teacher' | 'school' | 'team' | 'enterprise';

export type AdaptiveLevel = 'remedial' | 'standard' | 'accelerated' | 'mastery';

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'ar' | 'ja' | 'zh' | 'hi';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  dateUnlocked?: string;
  category: 'learning' | 'ai' | 'mastery' | 'streak';
}

export interface Milestone {
  id: string;
  title: string;
  targetXP: number;
  achieved: boolean;
  reward: string;
}

export interface ReadingPreferences {
  contrast: 'normal' | 'high';
  lineSpacing: 'normal' | 'loose' | 'extra-loose';
  fontSize: 'small' | 'medium' | 'large';
}

export interface VoiceSettings {
  sensitivity: 'low' | 'medium' | 'high';
  speechEngineLanguage: LanguageCode;
  voiceNavigationEnabled: boolean;
  socraticAudioEnabled: boolean;
  wakeWordEnabled: boolean;
  autoReadEnabled: boolean;
  continuousListeningEnabled: boolean;
}

export interface ToolState {
  calculatorOpen: boolean;
  whiteboardOpen: boolean;
  codeEditorOpen: boolean;
  notesOpen: boolean;
  browserOpen: boolean;
}

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  visible: boolean;
  order: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  organization?: string;
  language: LanguageCode;
  learningLevel: AdaptiveLevel;
  xpPoints: number;
  xp?: number;
  totalFocusMinutes?: number;
  careerRole?: string;
  targetTrajectory?: string;
  experiences?: any[];
  level: number;
  streakDays: number;
  streak?: number;
  offlineSyncEnabled: boolean;
  completedCourseIds: string[];
  enrolledCourseIds: string[];
  enrolledCourses?: string[];
  badges: Badge[];
  milestones: Milestone[];
  geminiApiKey?: string;
  adaptiveDifficulty?: boolean;
  linkedInConnected?: boolean;
  linkedInHeadline?: string;
  linkedInProfileUrl?: string;
  skills?: string[];
  achievements?: string[];
  discussionTopics?: string[];
  workspaceConnected?: boolean;
  workspaceEmail?: string;
  permissionsGranted?: boolean;
  scopesGranted?: string[];
  theme?: 'dark' | 'light';
  bio?: string;
  dailyStudyGoal?: number; // Target study time in minutes per day
  readingPreferences?: ReadingPreferences;
  toolState?: ToolState;
  isAssistantEnabled?: boolean;
  reducedMotion?: boolean;
  passkeyRegistered?: boolean;
  passkeyCredentialId?: string;
  voiceSettings?: VoiceSettings;
  dashboardWidgets?: DashboardWidgetConfig[];
  autoLockEnabled?: boolean;
  autoLockMinutes?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hint?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  duration?: number;
  content: string;
  keyTakeaways: string[];
  audioScript: string;
  audioUrl?: string; // Generated TTS audio data URI or URL
  videoUrl?: string;
  interactiveType?: string;
  quizzes: QuizQuestion[];
  flashcards: Flashcard[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  executiveSummary?: string;
}

export type CourseModule = Module;

export interface Course {
  id: string;
  code?: string;
  title: string;
  category: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  coverImage: string;
  author: string;
  rating: number;
  durationHours: number;
  estimatedHours?: number;
  modules: Module[];
  lessons?: Lesson[];
  quizzes?: QuizQuestion[];
  tags: string[];
  isAiGenerated?: boolean;
  language?: LanguageCode;
  degreeMetadata?: any;
}

export interface QuizResult {
  courseId: string;
  lessonId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  feedback: string;
  completedAt: string;
  adaptiveLevelAdjusted?: AdaptiveLevel;
}

export interface Certificate {
  id: string;
  verificationId: string;
  studentName: string;
  courseTitle: string;
  issuedDate: string;
  score: number;
  instructorName: string;
  institutionName: string;
  skillsAcquired: string[];
  badgeUrl?: string;
}

export interface StudentProgress {
  userId: string;
  courseId: string;
  completedLessonIds: string[];
  quizResults: Record<string, QuizResult>; // lessonId -> QuizResult
  overallProgressPercentage: number;
  adaptiveLevel: AdaptiveLevel;
  lastAccessedAt: string;
  timeSpentMinutes: number;
  xp?: number;
}

export interface AnalyticsMetric {
  date: string;
  activeStudents: number;
  completionRate: number;
  avgQuizScore: number;
  studyHours: number;
}

export interface SkillMatrixItem {
  skillName: string;
  category: string;
  masteryPercentage: number;
  studentsTargeted: number;
}

export interface StudyGroupMember {
  id?: string;
  name: string;
  avatar: string;
  role: string;
  email?: string;
  xp?: number;
  joinedAt?: string;
}

export interface VirtualStudyGroup {
  id: string;
  title: string;
  courseCode: string;
  courseTitle?: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  nextMeetingTime: string;
  targetGoal: string;
  tags: string[];
  isJoined?: boolean;
  createdBy?: string;
  members: StudyGroupMember[];
  collabLink?: string;
  collabType?: 'jitsi' | 'zalamati' | 'google-meet';
  sharedNotes?: { id: string; title: string; url?: string; author: string; addedAt: string }[];
  agendaMilestones?: string[];
  createdAt?: string;
}

export interface ForumReply {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  authorId?: string;
  text: string;
  createdAt: string;
  isAiTutor?: boolean;
  upvotes: number;
  userUpvoted?: boolean;
}

export interface ForumThread {
  id: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  authorId?: string;
  createdAt: string;
  tags: string[];
  upvotes: number;
  userUpvoted?: boolean;
  replyCount: number;
  isSolved: boolean;
  content: string;
  replies: ForumReply[];
  aiModeration?: {
    status: 'approved' | 'flagged' | 'guided';
    relevanceScore: number;
    toneAnalysis: string;
    socraticHint?: string;
    suggestedModule?: string;
    moderatedAt: string;
  };
}

export interface SharedPeerResource {
  id: string;
  title: string;
  courseCode: string;
  courseTitle: string;
  description: string;
  resourceType: 'notes' | 'cheatsheet' | 'code' | 'diagram' | 'flashcards' | 'drive_doc';
  content: string;
  authorName: string;
  authorAvatar: string;
  authorId: string;
  createdAt: string;
  upvotes: number;
  userUpvoted?: boolean;
  downloads: number;
  tags: string[];
  driveUrl?: string;
  aiSummary?: string;
  aiKeyConcepts?: string[];
}

export interface PeerMatchRecommendation {
  id: string;
  peerName: string;
  peerAvatar: string;
  peerRole: string;
  matchScore: number;
  sharedCourses: string[];
  complementarySkills: string[];
  studyHabits: string;
  reason: string;
  targetGoals: string[];
  commonRoadblocks?: string[];
  status: 'suggested' | 'connected' | 'invited';
  email?: string;
}

export interface ContentRecommendation {
  id: string;
  title: string;
  type: 'internal_course' | 'external_article' | 'research_paper' | 'practice_drill' | 'video_lecture';
  category: string;
  description: string;
  relevanceScore: number; // e.g. 98 for 98% match
  reason: string; // e.g. "Triggered by <70% Sheaf-ADMM quiz performance"
  matchTags: string[];
  url?: string;
  courseId?: string;
  lessonId?: string;
  estimatedMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery';
  authorOrSource?: string;
  isBookmarked?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  role: string;
  majorOrField: string;
  xp: number;
  level: number;
  streakDays: number;
  badgesCount: number;
  recentAchievement?: string;
  isCurrentUser?: boolean;
}

export interface ComplementaryPeerMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  email?: string;
  primaryStrength: string;
  growthArea: string;
  progressPct: number;
  xp: number;
  studyHabit: string;
  isCurrentUser?: boolean;
}

export interface SkillSynergyRelation {
  mentorName: string;
  learnerName: string;
  domain: string;
  synergyDetail: string;
}

export interface SocraticGroupMessage {
  id: string;
  sender: string;
  senderType: 'socratic_ai' | 'peer' | 'student';
  avatar: string;
  text: string;
  time: string;
  isSocraticPrompt?: boolean;
  socraticHint?: string;
  challengeData?: {
    title: string;
    question: string;
    starterCode?: string;
    solutionHint?: string;
  };
}

export interface SocraticAgendaMilestone {
  id: string;
  timeMinutes: number;
  title: string;
  objective: string;
  isCompleted: boolean;
  socraticInquiry: string;
}

export interface AiFacilitatedStudyGroup {
  id: string;
  title: string;
  courseCode: string;
  courseTitle: string;
  targetMilestone: string;
  synergyScore: number;
  description: string;
  status: 'active' | 'scheduled' | 'completed';
  nextMeetingTime: string;
  suggestedMeetingTimes?: string[];
  sharedSkillInterests?: string[];
  socraticFacilitator: {
    name: string;
    avatar: string;
    personality: string;
    currentInquiry: string;
    activeTopic: string;
  };
  members: ComplementaryPeerMember[];
  synergyRelations: SkillSynergyRelation[];
  agenda: SocraticAgendaMilestone[];
  chatFeed: SocraticGroupMessage[];
  whiteboardNotes: string;
  collabLink: string;
  collabType: 'jitsi' | 'google-meet' | 'zalamati';
  earnedGroupXp: number;
  createdAt: string;
}

export * from './simulation.types';
