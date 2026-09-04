import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Mail, 
  FileText, 
  Users, 
  CheckSquare, 
  ExternalLink, 
  RefreshCw,
  Plus,
  Layout,
  FileSpreadsheet,
  Presentation,
  MessageSquare,
  ClipboardList,
  ShieldCheck
} from 'lucide-react';
import { workspaceService, WorkspaceFile, CalendarEvent, GmailMessage, ClassroomCourse, WorkspaceTask } from '../services/workspace';
import { getAccessToken, googleSignIn } from '../services/firebase';
import { SkeletonLoader } from './SkeletonLoader';

interface WorkspaceDashboardProps {
  lang: string;
  isAr: boolean;
}

export const WorkspaceDashboard: React.FC<WorkspaceDashboardProps> = ({ lang, isAr }) => {
  const [activeTab, setActiveTab] = React.useState<'drive' | 'calendar' | 'gmail' | 'classroom' | 'tasks'>('drive');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isConnected, setIsConnected] = React.useState(!!getAccessToken());

  const [files, setFiles] = React.useState<WorkspaceFile[]>([]);
  const [events, setEvents] = React.useState<CalendarEvent[]>([]);
  const [emails, setEmails] = React.useState<GmailMessage[]>([]);
  const [courses, setCourses] = React.useState<ClassroomCourse[]>([]);
  const [tasks, setTasks] = React.useState<WorkspaceTask[]>([]);

  const fetchData = async () => {
    if (!getAccessToken()) {
      setIsConnected(false);
      return;
    }
    setIsConnected(true);
    setIsLoading(true);
    setError(null);
    try {
      switch (activeTab) {
        case 'drive':
          setFiles(await workspaceService.getRecentFiles());
          break;
        case 'calendar':
          setEvents(await workspaceService.getUpcomingEvents());
          break;
        case 'gmail':
          setEmails(await workspaceService.getRecentEmails());
          break;
        case 'classroom':
          setCourses(await workspaceService.getCourses());
          break;
        case 'tasks':
          setTasks(await workspaceService.getTasks());
          break;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [activeTab, isConnected]);

  const handleConnect = async () => {
    try {
      await googleSignIn();
      setIsConnected(true);
    } catch (err: any) {
      setError(err.message || 'Connection failed');
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-[#000000] border border-[#000080] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
        <div className="bg-[#40E0D0]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto border border-[#40E0D0]/20">
          <Layout className="w-10 h-10 text-[#40E0D0]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#FFFFFF]">
            {isAr ? 'ربط مساحة عمل Google' : 'Connect Google Workspace'}
          </h2>
          <p className="text-[#a1a1aa] max-w-md mx-auto text-sm">
            {isAr 
              ? 'قم بربط حسابك للوصول إلى الملفات والبريد الإلكتروني والتقويم والمهام مباشرة من لوحة التحكم.' 
              : 'Link your account to access files, emails, calendar, and tasks directly from your dashboard.'}
          </p>
        </div>
        <button
          onClick={handleConnect}
          className="bg-[#000080] hover:bg-[#000060] text-[#FFFFFF] px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-[#000080]/50 flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-5 h-5" />
          {isAr ? 'بدء الربط الآن' : 'Connect Now'}
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'drive', label: isAr ? 'الملفات' : 'Drive', icon: FileText },
    { id: 'calendar', label: isAr ? 'التقويم' : 'Calendar', icon: Calendar },
    { id: 'gmail', label: isAr ? 'البريد' : 'Gmail', icon: Mail },
    { id: 'classroom', label: isAr ? 'الفصول' : 'Classroom', icon: Users },
    { id: 'tasks', label: isAr ? 'المهام' : 'Tasks', icon: CheckSquare },
  ];

  return (
    <div className="bg-[#000000] border border-[#27272a] rounded-3xl overflow-hidden shadow-2xl flex flex-col min-h-[500px]">
      {/* Header & Tabs */}
      <div className="p-6 border-b border-[#27272a] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4 overflow-x-auto w-full md:w-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-[#40E0D0]/20 text-[#40E0D0] border border-[#40E0D0]/30 shadow-lg' 
                  : 'text-[#a1a1aa] hover:text-[#FFFFFF] hover:bg-[#111111]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button 
            onClick={fetchData}
            disabled={isLoading}
            className="p-2 rounded-lg bg-[#111111] hover:bg-[#1a1a1a] text-[#40E0D0] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#000080] hover:bg-[#000060] text-[#FFFFFF] text-xs font-bold transition-all shadow-md">
            <Plus className="w-4 h-4" />
            {isAr ? 'جديد' : 'New'}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 relative">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 p-6 overflow-hidden"
            >
              <SkeletonLoader variant="card" count={3} />
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center p-6 text-center"
            >
              <div className="space-y-4">
                <div className="text-[#a1a1aa] text-sm bg-[#1a1a1a] px-4 py-2 rounded-lg border border-[#27272a]">
                  {error}
                </div>
                <button onClick={fetchData} className="text-[#40E0D0] hover:underline text-xs font-bold">
                  {isAr ? 'إعادة المحاولة' : 'Try Again'}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {activeTab === 'drive' && files.map((file) => (
                <a 
                  key={file.id} 
                  href={file.webViewLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-4 rounded-2xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#40E0D0]/40 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-[#40E0D0]/10">
                        {file.mimeType.includes('spreadsheet') ? <FileSpreadsheet className="w-5 h-5 text-[#40E0D0]" /> :
                         file.mimeType.includes('presentation') ? <Presentation className="w-5 h-5 text-[#40E0D0]" /> :
                         file.mimeType.includes('document') ? <FileText className="w-5 h-5 text-[#40E0D0]" /> :
                         file.mimeType.includes('form') ? <ClipboardList className="w-5 h-5 text-[#40E0D0]" /> :
                         <FileText className="w-5 h-5 text-[#40E0D0]" />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-[#FFFFFF] truncate group-hover:text-[#40E0D0]">{file.name}</h4>
                        <p className="text-[10px] text-[#a1a1aa]">{new Date(file.modifiedTime!).toLocaleDateString(lang)}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#71717a] group-hover:text-[#40E0D0]" />
                  </div>
                </a>
              ))}

              {activeTab === 'calendar' && events.map((event) => (
                <a 
                  key={event.id} 
                  href={event.htmlLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-4 rounded-2xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#40E0D0]/40 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-[#40E0D0]/10 text-[#40E0D0]">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-[#FFFFFF] truncate group-hover:text-[#40E0D0]">{event.summary}</h4>
                        <p className="text-[10px] text-[#40E0D0]">
                          {event.start.dateTime ? new Date(event.start.dateTime).toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' }) : (isAr ? 'طوال اليوم' : 'All day')}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              ))}

              {activeTab === 'gmail' && emails.map((email) => (
                <div 
                  key={email.id} 
                  className="p-4 rounded-2xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#40E0D0]/40 transition-all group cursor-default"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#40E0D0]/10 text-[#40E0D0] shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-bold text-[#FFFFFF] truncate group-hover:text-[#40E0D0]">{email.subject || '(No Subject)'}</h4>
                        <span className="text-[10px] text-[#71717a] shrink-0">{new Date(email.date!).toLocaleDateString(lang)}</span>
                      </div>
                      <p className="text-xs text-[#40E0D0] font-medium truncate mb-1">{email.from}</p>
                      <p className="text-[10px] text-[#a1a1aa] line-clamp-2 leading-tight">{email.snippet}</p>
                    </div>
                  </div>
                </div>
              ))}

              {activeTab === 'classroom' && courses.map((course) => (
                <a 
                  key={course.id} 
                  href={course.alternateLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-4 rounded-2xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#40E0D0]/40 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#40E0D0]/10 text-[#40E0D0]">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#FFFFFF] truncate group-hover:text-[#40E0D0]">{course.name}</h4>
                      <p className="text-[10px] text-[#40E0D0] font-medium">{course.section}</p>
                    </div>
                  </div>
                </a>
              ))}

              {activeTab === 'tasks' && tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="p-4 rounded-2xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#40E0D0]/40 transition-all flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-1.5 rounded-md ${task.status === 'completed' ? 'bg-[#40E0D0]/20 text-[#40E0D0]' : 'bg-[#1a1a1a] text-[#71717a]'}`}>
                      <CheckSquare className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className={`text-sm font-bold text-[#FFFFFF] truncate ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}>{task.title}</h4>
                      {task.due && <p className="text-[10px] text-[#40E0D0]">{new Date(task.due).toLocaleDateString(lang)}</p>}
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty States */}
              {activeTab === 'drive' && files.length === 0 && <EmptyState isAr={isAr} />}
              {activeTab === 'calendar' && events.length === 0 && <EmptyState isAr={isAr} />}
              {activeTab === 'gmail' && emails.length === 0 && <EmptyState isAr={isAr} />}
              {activeTab === 'classroom' && courses.length === 0 && <EmptyState isAr={isAr} />}
              {activeTab === 'tasks' && tasks.length === 0 && <EmptyState isAr={isAr} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-[#111111] border-t border-[#27272a] flex justify-between items-center text-[10px] text-[#71717a]">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#40E0D0]" />
          {isAr ? 'اتصال آمن بمسحة عمل Google' : 'Securely connected to Google Workspace'}
        </span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-[#40E0D0]" />
            Chat Ready
          </span>
          <span className="flex items-center gap-1.5">
            <ClipboardList className="w-3.5 h-3.5 text-[#40E0D0]" />
            Forms Active
          </span>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ isAr }: { isAr: boolean }) => (
  <div className="col-span-full py-12 flex flex-col items-center justify-center text-center space-y-3 opacity-50">
    <RefreshCw className="w-10 h-10 text-[#71717a] animate-pulse" />
    <p className="text-sm text-[#a1a1aa]">{isAr ? 'لا توجد بيانات حالياً' : 'No data found'}</p>
  </div>
);
