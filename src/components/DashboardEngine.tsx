import React from 'react';
import { LazyRender } from './LazyRender';
import {
  GraduationCap,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Brain,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  BarChart3,
  Layers,
  ArrowUpRight,
  Filter,
  RefreshCw,
  Plus,
  Zap,
  Target,
  Search,
  FileText,
} from 'lucide-react';
import { UserProfile, Course } from '../shared/types';

export interface DashboardEngineProps {
  user: UserProfile;
  onNavigateTab: (tab: string) => void;
  courses?: Course[];
  onOpenAITutor?: () => void;
}

interface MetricWidgetConfig {
  id: string;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface RoleDashboardConfig {
  roleName: string;
  badge: string;
  accentColor: string;
  heroGreeting: string;
  metrics: MetricWidgetConfig[];
  primaryWidgets: Array<{
    id: string;
    title: string;
    icon: React.ReactNode;
    type: 'course_progress' | 'analytics' | 'remedial' | 'team_skills' | 'compliance' | 'activity_feed';
  }>;
}

export const DashboardEngine: React.FC<DashboardEngineProps> = ({
  user,
  onNavigateTab,
  courses = [],
  onOpenAITutor,
}) => {
  const [selectedPeriod, setSelectedPeriod] = React.useState<'week' | 'month' | 'quarter'>('month');

  const normalizeRole = (role: string): string => {
    const r = role.toLowerCase();
    if (r.includes('teacher') || r.includes('instructor') || r.includes('faculty')) return 'teacher';
    if (r.includes('school') || r.includes('dean') || r.includes('academic')) return 'school_admin';
    if (r.includes('team') || r.includes('manager') || r.includes('lead')) return 'team_lead';
    if (r.includes('enterprise') || r.includes('corp') || r.includes('organization')) return 'enterprise_admin';
    return 'student';
  };

  const activeRole = normalizeRole(user.role || 'student');

  const getRoleConfig = (role: string): RoleDashboardConfig => {
    switch (role) {
      case 'teacher':
        return {
          roleName: 'Faculty & Educator Portal',
          badge: 'Professor Suite',
          accentColor: 'from-cyan-500 to-cyan-500',
          heroGreeting: `Welcome back, Prof. ${user.name}`,
          metrics: [
            {
              id: 'students',
              label: 'Active Students',
              value: '142',
              change: '+12% this term',
              changeType: 'positive',
              icon: <Users className="w-4 h-4 text-cyan-400" />,
              color: 'border-cyan-500/30 bg-cyan-950/20',
            },
            {
              id: 'grading',
              label: 'Pending Grading',
              value: '18',
              change: 'Requires review',
              changeType: 'neutral',
              icon: <CheckCircle className="w-4 h-4 text-cyan-400" />,
              color: 'border-cyan-500/30 bg-cyan-950/20',
            },
            {
              id: 'pass_rate',
              label: 'Avg Class Pass Rate',
              value: '91.4%',
              change: '+3.2%',
              changeType: 'positive',
              icon: <TrendingUp className="w-4 h-4 text-cyan-400" />,
              color: 'border-cyan-500/30 bg-cyan-950/20',
            },
            {
              id: 'remedial_rate',
              label: 'AI Remedial Triggers',
              value: '6 Students',
              change: 'Auto-flagged',
              changeType: 'negative',
              icon: <AlertTriangle className="w-4 h-4 text-cyan-400" />,
              color: 'border-cyan-500/30 bg-cyan-950/20',
            },
          ],
          primaryWidgets: [
            { id: 'remedial', title: 'AI Student Remedial & Intervention', icon: <Brain className="w-4 h-4 text-cyan-400" />, type: 'remedial' },
            { id: 'analytics', title: 'Class Mastery & Quiz Analytics', icon: <BarChart3 className="w-4 h-4 text-cyan-400" />, type: 'analytics' },
            { id: 'courses', title: 'Taught Courses & Syllabi', icon: <BookOpen className="w-4 h-4 text-cyan-400" />, type: 'course_progress' },
          ],
        };

      case 'school_admin':
        return {
          roleName: 'University & Academic Dean Portal',
          badge: 'Academic Senate',
          accentColor: 'from-cyan-500 to-blue-500',
          heroGreeting: `Academic Overview — ${(user as any).school || user.organization || 'Faculty of Engineering'}`,
          metrics: [
            {
              id: 'enrolled',
              label: 'Total Matriculated',
              value: '1,850',
              change: '100% Capacity',
              changeType: 'positive',
              icon: <GraduationCap className="w-4 h-4 text-cyan-400" />,
              color: 'border-cyan-500/30 bg-cyan-950/20',
            },
            {
              id: 'ects_audit',
              label: 'ECTS Compliance',
              value: '99.8%',
              change: 'Bologna Verified',
              changeType: 'positive',
              icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />,
              color: 'border-cyan-500/30 bg-cyan-950/20',
            },
            {
              id: 'faculty',
              label: 'Active Faculty',
              value: '38 Professors',
              change: 'Full quota',
              changeType: 'neutral',
              icon: <Users className="w-4 h-4 text-cyan-400" />,
              color: 'border-cyan-500/30 bg-cyan-950/20',
            },
            {
              id: 'accreditation',
              label: 'Accreditation Status',
              value: 'Grade A+',
              change: 'Audited 2026',
              changeType: 'positive',
              icon: <Award className="w-4 h-4 text-cyan-400" />,
              color: 'border-cyan-500/30 bg-cyan-950/20',
            },
          ],
          primaryWidgets: [
            { id: 'compliance', title: 'Bologna Process & ECTS Accreditation', icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />, type: 'compliance' },
            { id: 'analytics', title: 'Departmental Grade Distribution', icon: <BarChart3 className="w-4 h-4 text-cyan-400" />, type: 'analytics' },
          ],
        };

      case 'team_lead':
        return {
          roleName: 'Engineering & Team Lead Hub',
          badge: 'Squad Manager',
          accentColor: 'from-cyan-500 to-blue-500',
          heroGreeting: `Squad Performance Dashboard`,
          metrics: [
            {
              id: 'members',
              label: 'Team Members',
              value: (user as any).teamMembersCount || 8,
              change: '100% active',
              changeType: 'positive',
              icon: <Users className="w-4 h-4 text-cyan-400" />,
              color: 'border-cyan-500/30 bg-cyan-950/20',
            },
            {
              id: 'skill_index',
              label: 'Avg Skill Mastery',
              value: '88.5%',
              change: '+5.4% this month',
              changeType: 'positive',
              icon: <Target className="w-4 h-4 text-cyan-400" />,
              color: 'border-cyan-500/30 bg-cyan-950/20',
            },
            {
              id: 'completed_modules',
              label: 'Modules Finished',
              value: '64',
              change: 'On schedule',
              changeType: 'positive',
              icon: <CheckCircle className="w-4 h-4 text-cyan-400" />,
              color: 'border-cyan-500/30 bg-cyan-950/20',
            },
            {
              id: 'peer_reviews',
              label: 'Peer Code Reviews',
              value: '32 Verified',
              change: 'Active collaboration',
              changeType: 'neutral',
              icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
              color: 'border-cyan-500/30 bg-cyan-950/20',
            },
          ],
          primaryWidgets: [
            { id: 'team_skills', title: 'Member Skill Matrix & Competency Radar', icon: <Target className="w-4 h-4 text-cyan-400" />, type: 'team_skills' },
            { id: 'courses', title: 'Assigned Team Modules', icon: <BookOpen className="w-4 h-4 text-cyan-400" />, type: 'course_progress' },
          ],
        };

      case 'enterprise_admin':
        return {
          roleName: 'Enterprise L&D Management Console',
          badge: 'Organization Admin',
          accentColor: 'from-cyan-500 to-cyan-500',
          heroGreeting: `Enterprise Skill Intelligence — ${(user as any).company || user.organization || 'Global Corp'}`,
          metrics: [
            {
              id: 'seats',
              label: 'Licensed Seats',
              value: '450 / 500',
              change: '90% Utilization',
              changeType: 'positive',
              icon: <Users className="w-4 h-4 text-cyan-400" />,
              color: 'border-cyan-500/30 bg-cyan-950/20',
            },
            {
              id: 'roi',
              label: 'Est. Productivity ROI',
              value: '3.8x',
              change: '+18% YoY',
              changeType: 'positive',
              icon: <Zap className="w-4 h-4 text-cyan-400" />,
              color: 'border-cyan-500/30 bg-cyan-950/20',
            },
            {
              id: 'certifications',
              label: 'Issued Certificates',
              value: '1,280',
              change: 'ISO/Bologna Verified',
              changeType: 'positive',
              icon: <Award className="w-4 h-4 text-cyan-400" />,
              color: 'border-cyan-500/30 bg-cyan-950/20',
            },
            {
              id: 'security',
              label: 'SSO & Audit Status',
              value: 'SOC2 Compliant',
              change: 'Zero Alerts',
              changeType: 'positive',
              icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />,
              color: 'border-cyan-500/30 bg-cyan-950/20',
            },
          ],
          primaryWidgets: [
            { id: 'compliance', title: 'Organizational Skill Matrix & Compliance', icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />, type: 'compliance' },
            { id: 'analytics', title: 'Enterprise Learning ROI & Usage', icon: <BarChart3 className="w-4 h-4 text-cyan-400" />, type: 'analytics' },
          ],
        };

      default: // student
        return {
          roleName: 'Student Academic Portal',
          badge: 'Scholar Suite',
          accentColor: 'from-cyan-500 to-cyan-500',
          heroGreeting: `Welcome back, ${user.name}`,
          metrics: [
            {
              id: 'courses',
              label: 'Active Courses',
              value: courses.length || 4,
              change: 'In Progress',
              changeType: 'neutral',
              icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
              color: 'border-cyan-500/30 bg-cyan-950/20',
            },
            {
              id: 'ects',
              label: 'ECTS Credits',
              value: `${(user as any).ectsEarned || 24} / 60`,
              change: 'Annual Goal',
              changeType: 'positive',
              icon: <GraduationCap className="w-4 h-4 text-cyan-400" />,
              color: 'border-cyan-500/30 bg-cyan-950/20',
            },
            {
              id: 'xp',
              label: 'XP Points',
              value: user.xp || 2450,
              change: 'Top 5% Cohort',
              changeType: 'positive',
              icon: <Award className="w-4 h-4 text-cyan-400" />,
              color: 'border-cyan-500/30 bg-cyan-950/20',
            },
            {
              id: 'streak',
              label: 'Learning Streak',
              value: `${user.streakDays || 12} Days`,
              change: '🔥 Active',
              changeType: 'positive',
              icon: <Clock className="w-4 h-4 text-cyan-400" />,
              color: 'border-cyan-500/30 bg-cyan-950/20',
            },
          ],
          primaryWidgets: [
            { id: 'courses', title: 'My Enrolled Courses & Degree Progression', icon: <BookOpen className="w-4 h-4 text-cyan-400" />, type: 'course_progress' },
            { id: 'activity', title: 'Recent Academic Activity & Milestones', icon: <Clock className="w-4 h-4 text-cyan-400" />, type: 'activity_feed' },
          ],
        };
    }
  };

  const config = getRoleConfig(activeRole);

  return (
    <div className="space-y-6 animate-fade-in text-white pb-10">
      {/* Role Banner / Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#071720] via-[#0b2230] to-[#071822] border border-[#1b3d50] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-cyan-500/10 via-cyan-500/5 to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r ${config.accentColor} text-black font-bold`}>
                {config.badge}
              </span>
              <span className="text-xs text-[#7ea0b1] font-mono">
                Role: {config.roleName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {config.heroGreeting}
            </h1>
            <p className="text-xs sm:text-sm text-[#73A5AD] max-w-xl">
              Unified LMD Academic Engine & Dynamic Role Dashboard. Real-time metrics, AI tutoring, and curriculum analytics.
            </p>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex items-center gap-2 shrink-0">
            {onOpenAITutor && (
              <button
                onClick={onOpenAITutor}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-500 hover:from-cyan-400 hover:to-cyan-400 text-black font-extrabold text-xs shadow-lg flex items-center gap-2 transition-all active:scale-95"
              >
                <Brain className="w-4 h-4 text-black" />
                <span>Launch Socratic AI Tutor</span>
              </button>
            )}

            <button
              onClick={() => onNavigateTab('courses')}
              className="px-4 py-2.5 rounded-xl bg-[#0e2330] hover:bg-[#142d3e] text-cyan-300 border border-[#1b3e52] font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>View Catalog</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 dashboard-stats-grid">
        {config.metrics.map((metric) => (
          <div
            key={metric.id}
            className={`p-4 sm:p-5 rounded-2xl border ${metric.color} backdrop-blur-md shadow-lg space-y-2 relative overflow-hidden transition-all hover:border-cyan-500/40 mobile-compact-card`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#7ea0b1]">{metric.label}</span>
              <div className="p-2 rounded-xl bg-[#081822] border border-[#173748]">
                {metric.icon}
              </div>
            </div>

            <div className="text-2xl font-black text-white tracking-tight">
              {metric.value}
            </div>

            {metric.change && (
              <div className="flex items-center gap-1 text-[11px]">
                <span
                  className={
                    metric.changeType === 'positive'
                      ? 'text-cyan-400 font-semibold'
                      : metric.changeType === 'negative'
                      ? 'text-cyan-400 font-semibold'
                      : 'text-[#7ea0b1]'
                  }
                >
                  {metric.change}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Dynamic Role Widgets (Bento Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 dashboard-widget-grid">
        {/* Left / Center 2-Column Section */}
        <div className="lg:col-span-2 space-y-6">
          {config.primaryWidgets.map((widget) => (<LazyRender key={widget.id} height="300px">{(() => {
            if (widget.type === 'course_progress') {
              return (
                <div key={widget.id} className="p-6 rounded-3xl bg-[#071620]/90 border border-[#16384a] shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-[#143242] pb-3">
                    <div className="flex items-center gap-2">
                      {widget.icon}
                      <h3 className="text-base font-bold text-white">{widget.title}</h3>
                    </div>
                    <button
                      onClick={() => onNavigateTab('courses')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                    >
                      View All <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stats-card-grid">
                    {courses.slice(0, 4).map((course) => {
                      const ects = (course as any).ectsCredits || 6;
                      const progress = (course as any).progress || 65;
                      const instructor = (course as any).instructor || course.author || "Dr. Nashmi";

                      return (
                        <div
                          key={course.id}
                          onClick={() => onNavigateTab('courses')}
                          className="p-4 rounded-2xl bg-[#040e14] border border-[#143242] hover:border-cyan-500/50 cursor-pointer transition-all space-y-3 group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                                {course.level} • {ects} ECTS
                              </span>
                              <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                                {course.title}
                              </h4>
                            </div>
                            <span className="text-[11px] font-bold text-cyan-400 font-mono">
                              {progress}%
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full h-2 rounded-full bg-[#0d222e] overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-[#638799]">
                            <span>Instructor: {instructor}</span>
                            <span className="text-cyan-400 font-semibold group-hover:underline flex items-center gap-0.5">
                              Resume <ArrowUpRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            if (widget.type === 'remedial') {
              return (
                <div key={widget.id} className="p-6 rounded-3xl bg-[#071620]/90 border border-[#16384a] shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-[#143242] pb-3">
                    <div className="flex items-center gap-2">
                      {widget.icon}
                      <h3 className="text-base font-bold text-white">{widget.title}</h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-mono border border-cyan-500/20">
                      Auto-Remedial Active
                    </span>
                  </div>

                  <p className="text-xs text-[#73A5AD]">
                    AI Academic Sentinel identified 3 students requiring targeted review in "Distributed Sheaf Consensus":
                  </p>

                  <div className="space-y-2.5">
                    {[
                      { name: 'Alex Rivera', issue: 'Quiz score < 60% on Lesson 3', recommendation: 'Trigger AI Remedial Practice Deck' },
                      { name: 'Sofia Martinez', issue: 'Incomplete prerequisite lab', recommendation: 'Assign Socratic Review Session' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-[#040e14] border border-cyan-500/30 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <span className="font-bold text-white">{item.name}</span>
                          <p className="text-[11px] text-cyan-300">{item.issue}</p>
                        </div>
                        <button
                          onClick={onOpenAITutor}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-cyan-500/20 hover:from-cyan-500/30 text-cyan-200 border border-cyan-500/40 font-bold text-[11px]"
                        >
                          {item.recommendation}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            return null;
          })()}</LazyRender>))}
        </div>

        {/* Right Sidebar Widget Section */}
        <div className="space-y-6">
          {/* Quick Tools & AI Tutor Quick Access */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#081a24] to-[#040f17] border border-[#183a4c] shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-cyan-300 font-extrabold text-sm border-b border-[#143242] pb-3">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Academic Engine Quick Tools</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <button
                onClick={onOpenAITutor}
                className="w-full p-3 rounded-2xl bg-[#081822] hover:bg-[#0e2432] border border-[#183c50] hover:border-cyan-500/50 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white group-hover:text-cyan-300 block">Socratic AI Tutor</span>
                    <span className="text-[10px] text-[#638799]">Interactive source-grounded notebook</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#638799] group-hover:text-cyan-300" />
              </button>

              <button
                onClick={() => onNavigateTab('forum')}
                className="w-full p-3 rounded-2xl bg-[#081822] hover:bg-[#0e2432] border border-[#183c50] hover:border-cyan-500/50 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white group-hover:text-cyan-300 block">AI Study Forum</span>
                    <span className="text-[10px] text-[#638799]">Peer discussions & Thread Summarizer</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#638799] group-hover:text-cyan-300" />
              </button>

              <button
                onClick={() => onNavigateTab('content_studio')}
                className="w-full p-3 rounded-2xl bg-[#081822] hover:bg-[#0e2432] border border-[#183c50] hover:border-cyan-500/50 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white group-hover:text-cyan-300 block">Educational Studio</span>
                    <span className="text-[10px] text-[#638799]">Auto-generate outlines & quizzes</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#638799] group-hover:text-cyan-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEngine;
