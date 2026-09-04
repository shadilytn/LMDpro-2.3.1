export type SimulationDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type DeliverableType = 'code' | 'architecture_document' | 'configuration_yaml' | 'analytical_report';

export interface SimulationTask {
  id: string;
  taskNumber: number;
  title: string;
  description: string;
  requiredDeliverableType: DeliverableType;
  targetFilename?: string;
  starterTemplate?: string;
  validationCriteria: string[];
  hints: string[];
}

export interface RubricCriterion {
  id: string;
  title: string;
  weightPercentage: number;
  description: string;
}

export interface SimulationRubric {
  criteria: RubricCriterion[];
}

export interface SimulationStarterAssets {
  starterCode?: Record<string, string>; // filename -> code
  dataFiles?: Record<string, string>;   // filename -> JSON / CSV / YAML data
  configYaml?: string;
}

export interface ProjectSimulation {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string;
  domainRole: string; // e.g. "Principal Swarm Robotics Engineer"
  industryDomain: string; // e.g. "Autonomous Defense & Robotics"
  difficulty: SimulationDifficulty;
  estimatedHours: number;
  xpReward: number;
  scenario: string; // Markdown problem statement
  systemArchitectureOverview: string;
  prerequisites: string[];
  tasks: SimulationTask[];
  starterAssets: SimulationStarterAssets;
  rubric: SimulationRubric;
  isAiGenerated?: boolean;
  createdAt?: string;
}

export interface TaskFeedback {
  taskId: string;
  passed: boolean;
  score: number; // 0-100
  strengths: string[];
  improvements: string[];
  codeReviewNotes?: string;
}

export interface RubricScoreItem {
  criterionId: string;
  score: number;
  maxScore: number;
  comments: string;
}

export interface SimulationFeedback {
  overallScore: number; // 0 - 100
  grade: 'S' | 'A' | 'B' | 'C' | 'Needs Revision';
  passed: boolean;
  summary: string;
  rubricScores: Record<string, RubricScoreItem>;
  taskFeedbacks: Record<string, TaskFeedback>;
  architecturalCritique: string;
  nextStepsAndRecommendations: string[];
  earnedXp: number;
  evaluatedAt: string;
}

export interface SimulationSubmission {
  id: string;
  projectId: string;
  courseId: string;
  userId: string;
  status: 'draft' | 'submitted' | 'evaluating' | 'evaluated';
  deliverables: Record<string, string>; // taskId -> string content
  submittedAt?: string;
  feedback?: SimulationFeedback;
}
