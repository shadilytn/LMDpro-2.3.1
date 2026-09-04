export interface DegreeTrackResearch {
  id: string;
  degreeType: 'bachelor' | 'master' | 'doctorate' | 'executive';
  title: string;
  field: string;
  totalCredits: number;
  durationMonths: number;
  tieredDifficulty: {
    tier: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    modules: string[];
  }[];
  prerequisites: string[];
  careerOutcomes: string[];
  learningPathGraph: {
    stage: number;
    title: string;
    description: string;
    keySkills: string[];
  }[];
}

export const RESEARCHED_DEGREE_PATHWAYS: DegreeTrackResearch[] = [
  {
    id: 'bsc-cs-ai',
    degreeType: 'bachelor',
    title: 'Bachelor of Science in Computer Science & Artificial Intelligence',
    field: 'Computer Science & AI',
    totalCredits: 120,
    durationMonths: 36,
    tieredDifficulty: [
      {
        tier: 'Beginner',
        modules: ['Calculus & Linear Algebra', 'Python Programming', 'Discrete Mathematics', 'Introduction to Computing Systems']
      },
      {
        tier: 'Intermediate',
        modules: ['Data Structures & Algorithms', 'Database Systems & SQL', 'Computer Networks & Security', 'Object-Oriented Architecture']
      },
      {
        tier: 'Advanced',
        modules: ['Machine Learning Fundamentals', 'Deep Learning & PyTorch', 'Full-Stack Web Engineering', 'Operating Systems & Concurrency']
      },
      {
        tier: 'Expert',
        modules: ['Large Language Model Architectures', 'Autonomous Agentic Systems', 'CapStone Capstone Project & Peer Review']
      }
    ],
    prerequisites: ['High School Diploma or GED', 'Basic High School Mathematics'],
    careerOutcomes: ['AI Systems Engineer', 'Full-Stack Software Engineer', 'Data Scientist', 'Machine Learning Developer'],
    learningPathGraph: [
      {
        stage: 1,
        title: 'Foundations of Computation & Math',
        description: 'Build core mathematical rigor and computational thinking in Python.',
        keySkills: ['Python', 'Linear Algebra', 'Algorithms']
      },
      {
        stage: 2,
        title: 'Core Systems & Data Engineering',
        description: 'Master memory, databases, network protocols, and data structures.',
        keySkills: ['C++', 'SQL', 'OS', 'Networking']
      },
      {
        stage: 3,
        title: 'Applied Machine Learning & Neural Nets',
        description: 'Train supervised, unsupervised, and deep learning neural models.',
        keySkills: ['PyTorch', 'TensorFlow', 'Model Evaluation']
      },
      {
        stage: 4,
        title: 'Autonomous AI Agents & Enterprise Capstone',
        description: 'Architect multi-agent systems with vector search and memory banks.',
        keySkills: ['Gemini API', 'Vector DBs', 'System Architecture']
      }
    ]
  },
  {
    id: 'msc-qml',
    degreeType: 'master',
    title: 'Master of Science in Quantum Machine Learning & Cybernetics',
    field: 'Quantum Computing & AI',
    totalCredits: 60,
    durationMonths: 24,
    tieredDifficulty: [
      {
        tier: 'Intermediate',
        modules: ['Quantum Mechanics for Engineers', 'Complex Vector Spaces', 'Classical ML Review']
      },
      {
        tier: 'Advanced',
        modules: ['Quantum Gates & Circuit Design', 'Variational Quantum Eigensolvers', 'Qiskit & PennyLane SDKs']
      },
      {
        tier: 'Expert',
        modules: ['Quantum Neural Networks', 'Quantum Key Distribution & Cryptography', 'Thesis Research & Peer Paper Publication']
      }
    ],
    prerequisites: ['Bachelor\'s in STEM or Computer Science', 'Linear Algebra & Calculus proficiency'],
    careerOutcomes: ['Quantum Algorithm Researcher', 'Quantum Software Engineer', 'AI Research Scientist'],
    learningPathGraph: [
      {
        stage: 1,
        title: 'Quantum Mechanics & Hilbert Spaces',
        description: 'Mathematical foundation of qubits, superposition, and entanglement.',
        keySkills: ['Hilbert Spaces', 'Linear Operators', 'Qubits']
      },
      {
        stage: 2,
        title: 'Quantum Circuit Synthesis',
        description: 'Design and simulate quantum circuits on real IBM Quantum hardware.',
        keySkills: ['Qiskit', 'Quantum Gates', 'Noise Mitigation']
      },
      {
        stage: 3,
        title: 'Quantum Neural Networks & Optimization',
        description: 'Hybrid quantum-classical algorithms for optimization and generative AI.',
        keySkills: ['VQE', 'PennyLane', 'Parameterized Quantum Circuits']
      }
    ]
  }
];
