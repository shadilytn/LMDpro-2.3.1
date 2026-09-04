export interface ParsedKnowledgeItem {
  id: string;
  category: string;
  title: string;
  content: string;
  keywords: string[];
}

export const PARSED_PLATFORM_KNOWLEDGE: ParsedKnowledgeItem[] = [
  {
    id: 'ai-tutor-core',
    category: 'ai_engine',
    title: 'Socratic AI Tutor Engine Specifications',
    content: 'Integrates Gemini 3.1 Pro and Gemini 3.5 Flash for step-by-step Socratic guidance, code generation, error diagnostics, and multimodal breakdown.',
    keywords: ['gemini', 'socratic', 'tutor', 'ai', 'diagnostics']
  },
  {
    id: 'bachelor-cs',
    category: 'curriculum',
    title: 'Bachelor of Science in Computer Science & Artificial Intelligence',
    content: 'Accredited 4-year undergraduate curriculum covering Discrete Math, Data Structures, Operating Systems, Machine Learning, Deep Neural Networks, and Distributed Systems.',
    keywords: ['bachelor', 'computer science', 'ai', 'degree', 'accredited']
  },
  {
    id: 'master-qml',
    category: 'curriculum',
    title: 'Master of Science in Quantum Machine Learning & Cybernetics',
    content: 'Graduate 2-year research pathway covering Quantum Circuits, Variational Quantum Eigensolvers, Qiskit, Quantum Neural Networks, and Cryptographic Security.',
    keywords: ['master', 'quantum', 'qml', 'cybernetics', 'advanced']
  },
  {
    id: 'enterprise-tier',
    category: 'licensing',
    title: 'LMDpro Institutional & Enterprise Infrastructure',
    content: 'Full SSO, FERPA compliance, private Cloud Run deployments, custom model fine-tuning, team analytics dashboards, and SLA support.',
    keywords: ['enterprise', 'institutional', 'ferpa', 'sso', 'pricing']
  }
];
