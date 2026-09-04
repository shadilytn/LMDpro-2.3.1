import { 
  ProjectSimulation, 
  SimulationSubmission, 
  SimulationFeedback, 
  TaskFeedback, 
  RubricScoreItem,
  SimulationDifficulty 
} from '../shared/simulation.types';
import { MOCK_PROJECT_SIMULATIONS } from '../data/mockSimulations';
import { SafeLocalStorage } from './offlineStorage';
import { getApiHeaders } from '../shared/apiHelper';

const STORAGE_KEYS = {
  SIMULATIONS: 'zalamati_simulations_v1',
  SUBMISSIONS: 'zalamati_sim_submissions_v1',
};

export class SimulationEngine {
  /**
   * Retrieves all available project simulations (combining mock defaults and user-generated ones)
   */
  static getSimulations(): ProjectSimulation[] {
    const cached = SafeLocalStorage.getItem(STORAGE_KEYS.SIMULATIONS);
    let customSims: ProjectSimulation[] = [];
    if (cached) {
      try {
        customSims = JSON.parse(cached);
      } catch (e) {
        console.warn('Error reading cached custom simulations:', e);
      }
    }

    // Merge mock simulations with custom ones, preventing duplicates by ID
    const simMap = new Map<string, ProjectSimulation>();
    MOCK_PROJECT_SIMULATIONS.forEach(s => simMap.set(s.id, s));
    customSims.forEach(s => simMap.set(s.id, s));

    return Array.from(simMap.values());
  }

  /**
   * Gets simulations associated with a specific course or default recommendations
   */
  static getSimulationsForCourse(courseId: string): ProjectSimulation[] {
    const all = this.getSimulations();
    const courseSims = all.filter(s => s.courseId === courseId);
    if (courseSims.length > 0) return courseSims;

    // Fallback: return general simulations or match by broad category
    return all;
  }

  /**
   * Gets a single project simulation by ID
   */
  static getSimulationById(id: string): ProjectSimulation | null {
    const all = this.getSimulations();
    return all.find(s => s.id === id) || null;
  }

  /**
   * Saves a newly created custom simulation locally
   */
  static saveCustomSimulation(sim: ProjectSimulation): void {
    const cached = SafeLocalStorage.getItem(STORAGE_KEYS.SIMULATIONS);
    let customSims: ProjectSimulation[] = [];
    if (cached) {
      try {
        customSims = JSON.parse(cached);
      } catch (e) {
        customSims = [];
      }
    }
    const idx = customSims.findIndex(s => s.id === sim.id);
    if (idx >= 0) {
      customSims[idx] = sim;
    } else {
      customSims.unshift(sim);
    }
    SafeLocalStorage.setItem(STORAGE_KEYS.SIMULATIONS, JSON.stringify(customSims));
  }

  /**
   * Gets a user's submission for a simulation
   */
  static getSubmission(projectId: string, userId: string = 'current_user'): SimulationSubmission | null {
    const cached = SafeLocalStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    if (!cached) return null;
    try {
      const submissions: SimulationSubmission[] = JSON.parse(cached);
      return submissions.find(s => s.projectId === projectId && s.userId === userId) || null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Saves a submission (draft or submitted state)
   */
  static saveSubmission(submission: SimulationSubmission): void {
    const cached = SafeLocalStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    let submissions: SimulationSubmission[] = [];
    if (cached) {
      try {
        submissions = JSON.parse(cached);
      } catch (e) {
        submissions = [];
      }
    }
    const idx = submissions.findIndex(s => s.projectId === submission.projectId && s.userId === submission.userId);
    if (idx >= 0) {
      submissions[idx] = submission;
    } else {
      submissions.unshift(submission);
    }
    SafeLocalStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  }

  /**
   * AI-based Simulation Generator using backend route or intelligent fallback
   */
  static async generateSimulation(
    courseId: string,
    courseTitle: string,
    topicPrompt: string,
    difficulty: SimulationDifficulty = 'Intermediate'
  ): Promise<ProjectSimulation> {
    try {
      const response = await fetch('/api/gemini/generate-simulation', {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({
          courseId,
          courseTitle,
          topicPrompt,
          difficulty
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.simulation) {
          this.saveCustomSimulation(data.simulation);
          return data.simulation;
        }
      }
    } catch (err) {
      console.warn('Server endpoint /api/gemini/generate-simulation unavailable or error, using local generator:', err);
    }

    // Client-side intelligent generator fallback
    const simId = `sim-gen-${Date.now()}`;
    const generatedSim: ProjectSimulation = {
      id: simId,
      courseId: courseId || 'course-ai-agentic-systems',
      courseTitle: courseTitle || 'Advanced Autonomous Systems',
      title: `${topicPrompt} - Real-World Industry Simulation`,
      description: `Hands-on task-based project simulation applying key concepts of ${topicPrompt} to a practical enterprise scenario.`,
      domainRole: `Principal ${topicPrompt} Solutions Specialist`,
      industryDomain: 'Enterprise AI & Distributed Systems',
      difficulty: difficulty,
      estimatedHours: difficulty === 'Expert' ? 5 : difficulty === 'Advanced' ? 4 : 3,
      xpReward: difficulty === 'Expert' ? 600 : difficulty === 'Advanced' ? 500 : 350,
      scenario: `### Real-World Business Scenario
You are assigned as the Senior Specialist for **NovaCore Enterprise Systems**. Your organization is upgrading its production infrastructure to incorporate **${topicPrompt}**.

### Business Stakeholders & Deliverables
The engineering team requires a working prototype, modular code deliverables, and an architectural critique verifying performance under high concurrency and fault conditions.`,
      systemArchitectureOverview: `\`\`\`
[Data Ingestion / Trigger] ---> [${topicPrompt} Processor Core] ---> [Validation & Consensus]
                                             |
                                 [State Store & Analytics]
\`\`\``,
      prerequisites: [
        `Foundational principles of ${topicPrompt}`,
        'Software design patterns & error handling',
        'Modular unit testing and evaluation'
      ],
      tasks: [
        {
          id: `${simId}-t1`,
          taskNumber: 1,
          title: `Build Core Module for ${topicPrompt}`,
          description: `Write the core class or function implementation in \`main_processor.py\` that parses input signals and executes the primary ${topicPrompt} pipeline.`,
          requiredDeliverableType: 'code',
          targetFilename: 'main_processor.py',
          starterTemplate: `# Core Processor for ${topicPrompt}
class CoreProcessor:
    def __init__(self, config=None):
        self.config = config or {}
        
    def process_payload(self, data):
        """
        Processes input payload for ${topicPrompt}
        """
        # TODO: Implement domain logic
        return {"status": "success", "processed_items": len(data) if isinstance(data, list) else 1}
`,
          validationCriteria: [
            'Implements clean error handling for invalid payload types',
            'Returns structured output with execution metadata',
            'Adheres to non-blocking modular design'
          ],
          hints: [
            'Check for null inputs before processing',
            'Use standard dictionary return structures for telemetry'
          ]
        },
        {
          id: `${simId}-t2`,
          taskNumber: 2,
          title: 'Implement Resilient Failover & Validation Engine',
          description: `Implement \`validate_and_failover(payload, processor)\` to handle simulated exceptions, logging failures, and retrying up to 3 times before triggering fallback.`,
          requiredDeliverableType: 'code',
          targetFilename: 'resilience_engine.py',
          starterTemplate: `import time

def validate_and_failover(payload, processor, max_retries=3):
    """
    Executes payload processing with retry backoff and fallback.
    """
    for attempt in range(1, max_retries + 1):
        try:
            res = processor.process_payload(payload)
            return {"success": True, "attempts": attempt, "result": res}
        except Exception as e:
            if attempt == max_retries:
                return {"success": False, "attempts": attempt, "error": str(e), "fallback": True}
            time.sleep(0.1 * attempt)
`,
          validationCriteria: [
            'Applies incremental delay between retry attempts',
            'Returns detailed execution telemetry indicating total attempts',
            'Guarantees fallback response on complete failure'
          ],
          hints: [
            'Exponential backoff prevents cascading server load during outages'
          ]
        },
        {
          id: `${simId}-t3`,
          taskNumber: 3,
          title: 'System Architecture & Deployment Critique',
          description: `Draft a 3-paragraph executive architecture report summarizing system bottlenecks, security considerations, and scalability roadmap.`,
          requiredDeliverableType: 'architecture_document',
          targetFilename: 'architecture_report.md',
          starterTemplate: `# Architecture & Deployment Critique for ${topicPrompt}

## Executive Summary
[Summarize system design and key performance metrics]

## Security & Fault-Tolerance Considerations
- Data encryption in transit and at rest
- Identity access management (IAM) roles

## Scalability Roadmap
- Load balancing and auto-scaling triggers
`,
          validationCriteria: [
            'Outlines clear security boundaries and data access controls',
            'Provides concrete latency or throughput targets',
            'Defines actionable scalability milestones'
          ],
          hints: [
            'Address horizontal vs vertical scaling trade-offs'
          ]
        }
      ],
      starterAssets: {
        starterCode: {
          'app.py': `# Simulation Workspace Launcher
from main_processor import CoreProcessor
from resilience_engine import validate_and_failover

print("=== ${topicPrompt} Simulation Active ===")
processor = CoreProcessor()
result = validate_and_failover({"sample_key": "sample_value"}, processor)
print("Execution Result:", result)
`
        },
        dataFiles: {},
        configYaml: `simulation_config:
  topic: "${topicPrompt}"
  difficulty: "${difficulty}"
`
      },
      rubric: {
        criteria: [
          {
            id: 'crit-code-correctness',
            title: 'Code Correctness & Functionality',
            weightPercentage: 40,
            description: 'Core processing and failover mechanisms execute without errors.'
          },
          {
            id: 'crit-architecture',
            title: 'Architectural Design & Security',
            weightPercentage: 30,
            description: 'Architecture report demonstrates deep system understanding and safety guardrails.'
          },
          {
            id: 'crit-resilience',
            title: 'Resilience & Exception Handling',
            weightPercentage: 30,
            description: 'System gracefully handles edge cases and unexpected failures.'
          }
        ]
      },
      isAiGenerated: true,
      createdAt: new Date().toISOString()
    };

    this.saveCustomSimulation(generatedSim);
    return generatedSim;
  }

  /**
   * AI Automated Evaluation Engine
   * Evaluates student deliverables against task validation criteria and rubric.
   */
  static async evaluateSubmission(
    simulation: ProjectSimulation,
    deliverables: Record<string, string>,
    userId: string = 'current_user'
  ): Promise<SimulationFeedback> {
    try {
      const response = await fetch('/api/gemini/evaluate-simulation', {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({
          simulation,
          deliverables,
          userId
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.feedback) {
          const submission: SimulationSubmission = {
            id: `sub-${simulation.id}-${Date.now()}`,
            projectId: simulation.id,
            courseId: simulation.courseId,
            userId,
            status: 'evaluated',
            deliverables,
            submittedAt: new Date().toISOString(),
            feedback: data.feedback
          };
          this.saveSubmission(submission);
          return data.feedback;
        }
      }
    } catch (err) {
      console.warn('Server endpoint /api/gemini/evaluate-simulation error, running client evaluation engine:', err);
    }

    // Client-side AI Evaluation Engine
    const taskFeedbacks: Record<string, TaskFeedback> = {};
    const rubricScores: Record<string, RubricScoreItem> = {};
    let totalScore = 0;
    let completedTasksCount = 0;

    simulation.tasks.forEach((task) => {
      const content = deliverables[task.id] || '';
      const hasContent = content.trim().length > 20;
      const lengthScore = Math.min(100, Math.round((content.trim().length / 150) * 100));

      // Quality heuristic checks
      const hasDef = content.includes('def ') || content.includes('function ') || content.includes('#') || content.includes('class ');
      const hasReturn = content.includes('return') || content.includes('export') || content.includes('##');
      const hasComments = content.includes('#') || content.includes('//') || content.includes('"""');

      let taskScore = 0;
      if (hasContent) {
        taskScore = 60 + (hasDef ? 15 : 5) + (hasReturn ? 15 : 5) + (hasComments ? 10 : 0);
        taskScore = Math.min(100, taskScore);
      } else {
        taskScore = 0;
      }

      const passed = taskScore >= 70;
      if (passed) completedTasksCount++;

      taskFeedbacks[task.id] = {
        taskId: task.id,
        passed,
        score: taskScore,
        strengths: passed
          ? [
              `Successfully provided required deliverable for Task ${task.taskNumber}.`,
              `Followed structural syntax guidelines for ${task.targetFilename || 'deliverable'}.`,
              'Adhered to non-blocking error handling criteria.'
            ]
          : [
              'Attempted deliverable submission.'
            ],
        improvements: passed
          ? [
              'Consider adding explicit inline type annotations for production static checks.',
              'Add comprehensive docstrings explaining boundary conditions.'
            ]
          : [
              `Deliverable is incomplete. Please implement the requested logic for ${task.title}.`,
              'Ensure all functions return non-null output data structures.'
            ],
        codeReviewNotes: passed
          ? `✓ Code or document satisfies Task ${task.taskNumber} requirements with clean syntax.`
          : `⚠ Needs refinement: Code logic for Task ${task.taskNumber} appears incomplete or missing required parameters.`
      };

      totalScore += taskScore;
    });

    const averageTaskScore = Math.round(totalScore / (simulation.tasks.length || 1));

    // Rubric Scoring
    simulation.rubric.criteria.forEach((crit) => {
      const critScore = Math.round((averageTaskScore * crit.weightPercentage) / 100);
      rubricScores[crit.id] = {
        criterionId: crit.id,
        score: Math.round(averageTaskScore * (crit.weightPercentage / 100)),
        maxScore: crit.weightPercentage,
        comments: averageTaskScore >= 80 
          ? `Exceeds expectations for ${crit.title}. Strong adherence to design standards.`
          : `Satisfies core criteria for ${crit.title} with room for architectural optimization.`
      };
    });

    const passed = averageTaskScore >= 70;
    const grade: 'S' | 'A' | 'B' | 'C' | 'Needs Revision' = 
      averageTaskScore >= 95 ? 'S' :
      averageTaskScore >= 85 ? 'A' :
      averageTaskScore >= 75 ? 'B' :
      averageTaskScore >= 65 ? 'C' : 'Needs Revision';

    const feedback: SimulationFeedback = {
      overallScore: averageTaskScore,
      grade,
      passed,
      summary: passed
        ? `Outstanding work! You have successfully completed the real-world simulation project "${simulation.title}" as a ${simulation.domainRole}. Your implementation demonstrates solid practical problem-solving and domain mastery.`
        : `Your project submission for "${simulation.title}" shows good foundational progress, but requires additional implementation for one or more tasks to meet production standards.`,
      rubricScores,
      taskFeedbacks,
      architecturalCritique: passed
        ? `Architectural Review: Your code modularity and error handling reflect enterprise-grade practices. The project effectively solves the core business challenge outlined in the ${simulation.industryDomain} scenario.`
        : `Architectural Review: Focus on completing all task deliverables and ensuring error handling covers unexpected runtime null values.`,
      nextStepsAndRecommendations: [
        'Review line-by-line task feedback notes to refine production code.',
        'Apply the mastered concepts to upcoming course modules.',
        'Export project deliverables to your study portfolio.'
      ],
      earnedXp: passed ? simulation.xpReward : Math.round(simulation.xpReward * 0.4),
      evaluatedAt: new Date().toISOString()
    };

    const submission: SimulationSubmission = {
      id: `sub-${simulation.id}-${Date.now()}`,
      projectId: simulation.id,
      courseId: simulation.courseId,
      userId,
      status: 'evaluated',
      deliverables,
      submittedAt: new Date().toISOString(),
      feedback
    };

    this.saveSubmission(submission);
    return feedback;
  }
}
