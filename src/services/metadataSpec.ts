/**
 * LMDpro Centralized Metadata & OGP Specification Kit
 * Provides consistent OpenGraph (OGP), Twitter Cards, SEO, and PWA Manifest metadata
 * across all dashboard routes, learning modes, and localized viewports.
 */

export interface RouteMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogType: 'website' | 'article' | 'profile';
  ogImage?: string;
  twitterCard: 'summary' | 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  themeColor: string;
  category?: string;
}

export const PLATFORM_BASE_URL = 'https://lmdpro.app';
export const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop';
export const PLATFORM_NAME = 'LMDpro';
export const DEFAULT_THEME_COLOR = '#071319';

export const ROUTE_METADATA_REGISTRY: Record<string, RouteMetadata> = {
  dashboard: {
    title: 'Dashboard | LMDpro Autonomous AI Learning',
    description: 'Track real-time academic progress, interactive learning roadmaps, XP metrics, and AI Socratic recommendations.',
    keywords: ['student dashboard', 'adaptive learning', 'academic progress', 'learning roadmap', 'xp rewards', 'socratic ai'],
    ogTitle: 'LMDpro Student Dashboard — Autonomous AI Learning',
    ogDescription: 'Real-time adaptive learning roadmaps, AI tutor guidance, and progress tracking.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    twitterTitle: 'LMDpro Student Dashboard',
    twitterDescription: 'Track active study milestones and interact with your Socratic AI companion.',
    themeColor: DEFAULT_THEME_COLOR,
    category: 'Dashboard',
  },
  courses: {
    title: 'Courses & Degree Curriculum | LMDpro',
    description: 'Explore multi-module adaptive courses across Computer Science, Artificial Intelligence, Distributed Systems, and Advanced Engineering.',
    keywords: ['courses', 'degree programs', 'curriculum', 'higher education', 'computer science', 'ai courses'],
    ogTitle: 'LMDpro Academic Course Catalog & Curriculum',
    ogDescription: 'Accredited modular degree curricula with interactive animations, quizzes, and real-time voice tutoring.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    twitterTitle: 'LMDpro Academic Courses',
    twitterDescription: 'Explore AI-verified university-grade courses with real-time Socratic feedback.',
    themeColor: DEFAULT_THEME_COLOR,
    category: 'Curriculum',
  },
  course_viewer: {
    title: 'Interactive Course Viewer | LMDpro',
    description: 'Immersive lesson viewer with Socratic AI companion, synchronized voice narration, interactive roadmaps, and adaptive quizzes.',
    keywords: ['lesson viewer', 'interactive learning', 'voice narration', 'socratic tutor', 'flashcards'],
    ogTitle: 'LMDpro Interactive Lesson Viewer',
    ogDescription: 'Engage with dynamic lesson notes, code execution, and AI-powered Socratic reflection.',
    ogType: 'article',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    twitterTitle: 'LMDpro Interactive Lesson Viewer',
    twitterDescription: 'Immersive multi-modal study experience with real-time voice tutoring and code execution.',
    themeColor: DEFAULT_THEME_COLOR,
    category: 'Courseware',
  },
  degree_programs: {
    title: 'Degree Programs & Academic Specializations | LMDpro',
    description: 'Structured Bachelor, Master, and Doctorate level degree pathways with ECTS credit mapping and verified credentials.',
    keywords: ['degree pathways', 'bachelor', 'master', 'phd', 'academic degrees', 'ects credits'],
    ogTitle: 'LMDpro Degree Pathways & Specializations',
    ogDescription: 'Comprehensive academic curricula mapped to international ECTS university standards.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    twitterTitle: 'LMDpro Degree Programs',
    twitterDescription: 'Structured academic degree pathways with ECTS credit mapping.',
    themeColor: DEFAULT_THEME_COLOR,
    category: 'Degree Pathways',
  },
  study_rooms: {
    title: 'Collaborative Study Rooms & P2P Whiteboard | LMDpro',
    description: 'Join peer-to-peer collaborative study rooms with synchronized whiteboards, Pomodoro focus timers, and group notes.',
    keywords: ['study rooms', 'virtual classroom', 'p2p study', 'collaborative whiteboard', 'pomodoro timer'],
    ogTitle: 'LMDpro Virtual Study Rooms & Whiteboards',
    ogDescription: 'Collaborate live with peers across the globe using interactive whiteboards and AI study squads.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    twitterTitle: 'LMDpro Collaborative Study Rooms',
    twitterDescription: 'Live peer study sessions with synchronized whiteboards and voice discussions.',
    themeColor: DEFAULT_THEME_COLOR,
    category: 'Collaboration',
  },
  social_learning: {
    title: 'Social Learning Hub & AI Study Squads | LMDpro',
    description: 'Connect with academic peers, join AI-facilitated study groups, share annotated resources, and participate in Socratic discussions.',
    keywords: ['social learning', 'study groups', 'peer learning', 'academic network', 'ai squad'],
    ogTitle: 'LMDpro Social Learning & AI Study Squads',
    ogDescription: 'AI-matched peer study squads designed for deep intellectual synergy and group mastery.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    twitterTitle: 'LMDpro Social Learning Hub',
    twitterDescription: 'AI-matched peer study squads designed for deep intellectual synergy.',
    themeColor: DEFAULT_THEME_COLOR,
    category: 'Community',
  },
  study_buddy: {
    title: 'AI Socratic Study Buddy | LMDpro',
    description: 'Solve complex problem sets step-by-step with tiered hints, conceptual analogies, and real-time knowledge verification.',
    keywords: ['study buddy', 'homework helper', 'problem solver', 'socratic hints', 'adaptive explanation'],
    ogTitle: 'LMDpro AI Socratic Study Buddy',
    ogDescription: 'Get directional nudges and step-by-step pedagogical hints without spoiling answers.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    twitterTitle: 'LMDpro AI Study Buddy',
    twitterDescription: 'Pedagogical AI companion offering tiered hints and concept breakdowns.',
    themeColor: DEFAULT_THEME_COLOR,
    category: 'AI Assistant',
  },
  interactive_tools: {
    title: 'Interactive Study Tools & Labs | LMDpro',
    description: 'High-performance interactive simulations, Flashcard Leitner decks, Pomodoro focus timers, and code sandboxes.',
    keywords: ['interactive tools', 'flashcards', 'pomodoro', 'simulations', 'code editor', 'leitner system'],
    ogTitle: 'LMDpro Interactive Academic Study Tools',
    ogDescription: 'Sharpen comprehension with dynamic flashcards, focus timers, and interactive visualizers.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    twitterTitle: 'LMDpro Interactive Study Tools',
    twitterDescription: 'Comprehensive study toolkit with Leitner flashcard system and focus timers.',
    themeColor: DEFAULT_THEME_COLOR,
    category: 'Tools',
  },
  educational_materials: {
    title: 'Educational Materials Studio | LMDpro',
    description: 'Author, generate, and explore interactive animations, slides, multi-agent explainers, and audio podcasts.',
    keywords: ['educational studio', 'lesson generator', 'multimodal explainer', 'audio podcast', 'interactive slides'],
    ogTitle: 'LMDpro Educational Materials Studio',
    ogDescription: 'Produce rich multi-modal learning assets with Gemini 3.x and neural TTS.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    twitterTitle: 'LMDpro Educational Studio',
    twitterDescription: 'Next-generation authoring studio for interactive visual explainers.',
    themeColor: DEFAULT_THEME_COLOR,
    category: 'Studio',
  },
  ai_features: {
    title: 'AI Intelligence & Agent Studio | LMDpro',
    description: 'Inspect multi-agent cognitive loops, vector RAG embeddings, search grounding telemetry, and real-time voice streaming.',
    keywords: ['ai studio', 'gemini 3', 'vector embeddings', 'rag memory', 'search grounding', 'voice agent'],
    ogTitle: 'LMDpro AI Intelligence & Agent Studio',
    ogDescription: 'Explore autonomous multi-agent swarms, RAG synchronization, and live neural voice processing.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    twitterTitle: 'LMDpro AI Studio',
    twitterDescription: 'Inspect multi-agent cognitive loops and live neural voice processing.',
    themeColor: DEFAULT_THEME_COLOR,
    category: 'AI Ecosystem',
  },
  learning_analytics: {
    title: 'Learning Analytics & Cognitive Retention | LMDpro',
    description: 'Comprehensive data visualizers tracking study velocity, concept mastery heatmaps, quiz accuracy, and retention curves.',
    keywords: ['learning analytics', 'mastery heatmap', 'retention curve', 'study statistics', 'performance metrics'],
    ogTitle: 'LMDpro Learning Analytics & Mastery Dashboard',
    ogDescription: 'Data-driven insights on study velocity, cognitive retention, and learning milestones.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    twitterTitle: 'LMDpro Learning Analytics',
    twitterDescription: 'Data-driven insights on study velocity and cognitive retention.',
    themeColor: DEFAULT_THEME_COLOR,
    category: 'Analytics',
  },
  leaderboard: {
    title: 'Global Academic Leaderboard & Competitions | LMDpro',
    description: 'Compete with scholars globally, earn mastery badges, and climb competitive seasonal academic tiers.',
    keywords: ['leaderboard', 'academic competition', 'xp ranks', 'badges', 'gamification'],
    ogTitle: 'LMDpro Academic Leaderboard',
    ogDescription: 'Global rankings for scholar achievements, study streaks, and quiz masteries.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    twitterTitle: 'LMDpro Global Leaderboard',
    twitterDescription: 'Climb the academic rankings through active recall and study streaks.',
    themeColor: DEFAULT_THEME_COLOR,
    category: 'Gamification',
  },
  achievements: {
    title: 'Achievements & Verified Credentials | LMDpro',
    description: 'View unlocked academic milestones, competency certificates, and cryptographic verification IDs.',
    keywords: ['achievements', 'certificates', 'credentials', 'milestones', 'badges'],
    ogTitle: 'LMDpro Achievements & Verified Credentials',
    ogDescription: 'Cryptographically verifiable certificates of completion and skill milestone badges.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    twitterTitle: 'LMDpro Achievements',
    twitterDescription: 'Cryptographically verifiable academic credentials and badges.',
    themeColor: DEFAULT_THEME_COLOR,
    category: 'Credentials',
  },
  knowledge_base: {
    title: 'Knowledge Base & Research Wiki | LMDpro',
    description: 'Searchable academic library indexing deep technical papers, mathematical proofs, and architectural blueprints.',
    keywords: ['knowledge base', 'research wiki', 'academic library', 'technical papers', 'glossary'],
    ogTitle: 'LMDpro Academic Knowledge Base',
    ogDescription: 'Comprehensive searchable repository of technical papers and foundational concepts.',
    ogType: 'article',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    twitterTitle: 'LMDpro Knowledge Base',
    twitterDescription: 'Searchable academic repository of technical papers and proofs.',
    themeColor: DEFAULT_THEME_COLOR,
    category: 'Knowledge',
  },
  workspace_integration: {
    title: 'Google Workspace & Cloud Sync | LMDpro',
    description: 'Seamless integration with Google Drive, Docs, Sheets, and Classroom for study note export and homework sync.',
    keywords: ['google workspace', 'google drive', 'google classroom', 'docs export', 'sheets sync'],
    ogTitle: 'LMDpro Google Workspace Integration',
    ogDescription: 'Sync notes, study schedules, and research reports directly to Google Drive and Classroom.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary_large_image',
    twitterTitle: 'LMDpro Workspace Sync',
    twitterDescription: 'Export study notes and certificates directly to Google Workspace.',
    themeColor: DEFAULT_THEME_COLOR,
    category: 'Integrations',
  },
  admin: {
    title: 'Enterprise Administration Portal | LMDpro',
    description: 'Manage institutional users, role-based access control (RBAC), academic licensing, and telemetry audits.',
    keywords: ['admin portal', 'rbac', 'institution management', 'telemetry', 'audit logs'],
    ogTitle: 'LMDpro Enterprise Administration Portal',
    ogDescription: 'Institutional management portal for educators, administrators, and team leaders.',
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    twitterCard: 'summary',
    twitterTitle: 'LMDpro Admin Portal',
    twitterDescription: 'Enterprise administration and RBAC governance portal.',
    themeColor: DEFAULT_THEME_COLOR,
    category: 'Admin',
  },
};

/**
 * Dynamically updates document title, OGP tags, Twitter card tags, and theme-color in the active DOM.
 */
export function updateDocumentMetadata(route: string, custom?: { title?: string; description?: string; lang?: string }): void {
  if (typeof document === 'undefined') return;

  const spec = ROUTE_METADATA_REGISTRY[route] || ROUTE_METADATA_REGISTRY.dashboard;
  const finalTitle = custom?.title || spec.title;
  const finalDesc = custom?.description || spec.description;

  // Title
  document.title = finalTitle;

  // Helper function to set or create meta tag
  const setMeta = (nameAttr: 'name' | 'property', attrValue: string, content: string) => {
    let el = document.querySelector(`meta[${nameAttr}="${attrValue}"]`) as HTMLMetaElement;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(nameAttr, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Standard Meta Tags
  setMeta('name', 'description', finalDesc);
  if (spec.keywords.length > 0) {
    setMeta('name', 'keywords', spec.keywords.join(', '));
  }

  // Open Graph / Facebook / LinkedIn
  setMeta('property', 'og:title', custom?.title || spec.ogTitle);
  setMeta('property', 'og:description', finalDesc);
  setMeta('property', 'og:type', spec.ogType);
  setMeta('property', 'og:image', spec.ogImage || DEFAULT_OG_IMAGE);
  setMeta('property', 'og:site_name', PLATFORM_NAME);

  // Twitter Cards
  setMeta('name', 'twitter:card', spec.twitterCard);
  setMeta('name', 'twitter:title', custom?.title || spec.twitterTitle);
  setMeta('name', 'twitter:description', finalDesc);
  setMeta('name', 'twitter:image', spec.ogImage || DEFAULT_OG_IMAGE);

  // Theme Color
  setMeta('name', 'theme-color', spec.themeColor);

  // Language attribute if provided
  if (custom?.lang) {
    document.documentElement.setAttribute('lang', custom.lang);
    document.documentElement.setAttribute('dir', custom.lang === 'ar' ? 'rtl' : 'ltr');
  }
}
