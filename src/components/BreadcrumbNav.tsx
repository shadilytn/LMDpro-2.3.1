import React from 'react';
import { ChevronRight, Home, BookOpen, Layers, MessageSquare, Sparkles, LayoutDashboard } from 'lucide-react';

interface BreadcrumbItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  action?: () => void;
}

interface BreadcrumbNavProps {
  currentTab: string;
  courseTitle?: string;
  moduleTitle?: string;
  lessonTitle?: string;
  subView?: string; // e.g. "quiz", "summary", "flashcards"
  onNavigateTab: (tab: string) => void;
}

export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  currentTab,
  courseTitle,
  moduleTitle,
  lessonTitle,
  subView,
  onNavigateTab,
}) => {
  const items: BreadcrumbItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-3.5 h-3.5 text-cyan-400" />,
      action: () => onNavigateTab('dashboard'),
    },
  ];

  switch (currentTab) {
    case 'dashboard':
      items.push({
        id: 'dashboard',
        label: 'Learning Dashboard',
        icon: <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />,
      });
      break;
    case 'courses':
    case 'catalog':
      items.push({
        id: 'courses',
        label: 'Course Catalog',
        icon: <BookOpen className="w-3.5 h-3.5 text-cyan-400" />,
        action: () => onNavigateTab('courses'),
      });
      break;
    case 'course_view':
    case 'viewer':
      items.push({
        id: 'courses',
        label: 'Course Catalog',
        icon: <BookOpen className="w-3.5 h-3.5 text-cyan-400" />,
        action: () => onNavigateTab('courses'),
      });
      if (courseTitle) {
        items.push({
          id: 'course_title',
          label: courseTitle,
        });
      }
      if (moduleTitle) {
        items.push({
          id: 'module_title',
          label: moduleTitle,
          icon: <Layers className="w-3.5 h-3.5 text-cyan-400" />,
        });
      }
      if (lessonTitle) {
        items.push({
          id: 'lesson_title',
          label: lessonTitle,
        });
      }
      if (subView) {
        items.push({
          id: 'sub_view',
          label: subView.toUpperCase(),
        });
      }
      break;
    case 'forum':
    case 'social':
      items.push({
        id: 'forum',
        label: 'AI Study Forum',
        icon: <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />,
      });
      break;
    case 'content_studio':
      items.push({
        id: 'content_studio',
        label: 'Educational Materials Studio',
        icon: <Sparkles className="w-3.5 h-3.5 text-[#22d3ee]" />,
      });
      break;
    default:
      items.push({
        id: currentTab,
        label: currentTab.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      });
      break;
  }

  return (
    <nav className="flex items-center gap-1.5 text-xs text-[#73A5AD] px-4 py-2 rounded-xl bg-[#08151c]/70 border border-[#1b3b4a]/50 backdrop-blur-md mb-4 overflow-x-auto custom-scrollbar whitespace-nowrap">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={item.id + idx}>
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#475569] shrink-0" />}
            {item.action && !isLast ? (
              <button
                onClick={item.action}
                className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors font-medium text-[#9fc5d8] focus:outline-none"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ) : (
              <span
                className={`flex items-center gap-1.5 font-semibold truncate ${
                  isLast ? 'text-white' : 'text-[#73A5AD]'
                }`}
              >
                {item.icon}
                <span className="truncate max-w-[200px]">{item.label}</span>
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default BreadcrumbNav;
