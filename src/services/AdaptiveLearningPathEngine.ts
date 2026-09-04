import { Course, Module, Lesson, StudentProgress, QuizResult, UserProfile, AdaptiveLevel } from '../shared/types';

export interface RemedialModule {
  id: string;
  courseId: string;
  courseTitle: string;
  moduleId: string;
  moduleTitle: string;
  lessonId: string;
  lessonTitle: string;
  scorePercentage: number;
  reason: string;
  recommendedAction: 'diagnostic_drill' | 'concept_review' | 'socratic_session' | 'prerequisite_bridge';
  actionTitle: string;
  actionDescription: string;
  estimatedMinutes: number;
  targetCompetencies: string[];
  remedialLessonPayload?: Lesson;
}

export interface AdaptivePathRecommendation {
  overallMasteryPercentage: number;
  recommendedAdaptiveLevel: AdaptiveLevel;
  remedialModulesNeeded: RemedialModule[];
  reorderedLessonQueue: {
    courseId: string;
    courseTitle: string;
    lesson: Lesson;
    isRemedial: boolean;
    reason: string;
    priorityOrder: number;
  }[];
  strengthAreas: string[];
  growthAreas: string[];
  readinessScore: number; // 0-100
  aiTutorFocusTopics: string[];
}

export class AdaptiveLearningPathEngine {
  public static readonly MASTERY_THRESHOLD = 70; // 70% is standard threshold for remediation
  public static readonly ACCELERATED_THRESHOLD = 88;
  public static readonly MASTERY_TOP_THRESHOLD = 95;

  /**
   * Analyze student quiz records and evaluate whether remedial modules or adaptive reordering are required
   */
  public static analyzeLearningPath(
    courses: Course[],
    progressMap: Record<string, StudentProgress>,
    user?: UserProfile
  ): AdaptivePathRecommendation {
    const remedialList: RemedialModule[] = [];
    const strengthAreas: string[] = [];
    const growthAreas: string[] = [];
    const allScores: number[] = [];
    const aiTutorFocusTopics: string[] = [];

    // Map through each enrolled/attempted course
    courses.forEach((course) => {
      const progress = progressMap[course.id];
      if (!progress || !progress.quizResults) return;

      const quizKeys = Object.keys(progress.quizResults);
      if (quizKeys.length === 0) return;

      quizKeys.forEach((lessonId) => {
        const result: QuizResult = progress.quizResults[lessonId];
        if (typeof result.percentage !== 'number') return;

        allScores.push(result.percentage);

        // Find module & lesson info
        let matchingModule: Module | undefined;
        let matchingLesson: Lesson | undefined;

        for (const mod of course.modules || []) {
          const l = mod.lessons?.find((less) => less.id === lessonId);
          if (l) {
            matchingModule = mod;
            matchingLesson = l;
            break;
          }
        }

        const lessonTitle = matchingLesson?.title || `Lesson ${lessonId}`;
        const moduleTitle = matchingModule?.title || 'Core Syllabus';

        // Check if under 70% mastery
        if (result.percentage < this.MASTERY_THRESHOLD) {
          growthAreas.push(`${lessonTitle} (${result.percentage.toFixed(0)}%)`);
          aiTutorFocusTopics.push(lessonTitle);

          // Generate synthetic remedial module
          remedialList.push({
            id: `rem-${course.id}-${lessonId}`,
            courseId: course.id,
            courseTitle: course.title,
            moduleId: matchingModule?.id || 'm-default',
            moduleTitle,
            lessonId,
            lessonTitle,
            scorePercentage: result.percentage,
            reason: `Mastery scored ${result.percentage.toFixed(0)}% (below ${this.MASTERY_THRESHOLD}% benchmark). Key concepts require reinforcement before advancing.`,
            recommendedAction:
              result.percentage < 45
                ? 'prerequisite_bridge'
                : result.percentage < 60
                ? 'diagnostic_drill'
                : 'socratic_session',
            actionTitle: `Remedial Sprint: ${lessonTitle} Foundations`,
            actionDescription: `Targeted 10-minute conceptual reinforcement focusing on core equations, common misconceptions, and guided diagnostic practice.`,
            estimatedMinutes: 10,
            targetCompetencies: matchingLesson?.keyTakeaways?.slice(0, 3) || ['Foundational Theorems', 'Practical Calculations', 'Edge Cases'],
            remedialLessonPayload: this.generateSyntheticRemedialLesson(course, matchingModule, matchingLesson, result.percentage),
          });
        } else {
          strengthAreas.push(`${lessonTitle} (${result.percentage.toFixed(0)}%)`);
        }
      });
    });

    // Calculate Overall Mastery
    const overallMastery =
      allScores.length > 0
        ? allScores.reduce((acc, curr) => acc + curr, 0) / allScores.length
        : 85;

    // Determine Adaptive Level
    let recommendedLevel: AdaptiveLevel = 'standard';
    if (overallMastery < this.MASTERY_THRESHOLD || remedialList.length >= 2) {
      recommendedLevel = 'remedial';
    } else if (overallMastery >= this.MASTERY_TOP_THRESHOLD) {
      recommendedLevel = 'mastery';
    } else if (overallMastery >= this.ACCELERATED_THRESHOLD) {
      recommendedLevel = 'accelerated';
    }

    // Build Reordered Lesson Queue
    const reorderedQueue = this.computeAdaptedLessonQueue(courses, progressMap, remedialList);

    return {
      overallMasteryPercentage: Math.round(overallMastery),
      recommendedAdaptiveLevel: recommendedLevel,
      remedialModulesNeeded: remedialList,
      reorderedLessonQueue: reorderedQueue,
      strengthAreas: Array.from(new Set(strengthAreas)).slice(0, 5),
      growthAreas: Array.from(new Set(growthAreas)).slice(0, 5),
      readinessScore: Math.min(100, Math.max(20, Math.round(overallMastery * 0.9 + (remedialList.length === 0 ? 10 : -remedialList.length * 5)))),
      aiTutorFocusTopics: Array.from(new Set(aiTutorFocusTopics)).slice(0, 4),
    };
  }

  /**
   * Adjust lesson ordering: prioritize pending remedial modules before subsequent advanced lessons
   */
  private static computeAdaptedLessonQueue(
    courses: Course[],
    progressMap: Record<string, StudentProgress>,
    remedialList: RemedialModule[]
  ) {
    const queue: {
      courseId: string;
      courseTitle: string;
      lesson: Lesson;
      isRemedial: boolean;
      reason: string;
      priorityOrder: number;
    }[] = [];

    let priority = 1;

    // 1. Remedial modules get highest priority (Order 1..N)
    remedialList.forEach((rem) => {
      if (rem.remedialLessonPayload) {
        queue.push({
          courseId: rem.courseId,
          courseTitle: rem.courseTitle,
          lesson: rem.remedialLessonPayload,
          isRemedial: true,
          reason: `Remedial Module: Recent score ${rem.scorePercentage.toFixed(0)}% < 70% threshold. Complete this booster first.`,
          priorityOrder: priority++,
        });
      }
    });

    // 2. Next uncompleted standard lessons in enrolled courses
    courses.forEach((course) => {
      const progress = progressMap[course.id];
      const completed = progress?.completedLessonIds || [];

      (course.modules || []).forEach((mod) => {
        (mod.lessons || []).forEach((less) => {
          if (!completed.includes(less.id)) {
            // Check if not already in remedial queue
            const isAlreadyRemedial = remedialList.some((r) => r.lessonId === less.id);
            if (!isAlreadyRemedial && queue.length < 8) {
              queue.push({
                courseId: course.id,
                courseTitle: course.title,
                lesson: less,
                isRemedial: false,
                reason: 'Standard Syllabus Progression',
                priorityOrder: priority++,
              });
            }
          }
        });
      });
    });

    return queue;
  }

  /**
   * Generates a targeted synthetic remedial lesson
   */
  private static generateSyntheticRemedialLesson(
    course: Course,
    mod?: Module,
    lesson?: Lesson,
    scorePercentage: number = 55
  ): Lesson {
    const title = lesson ? `[Remedial Booster] ${lesson.title}` : `[Remedial Booster] ${course.title} Foundations`;
    const baseId = lesson ? lesson.id : 'rem-base';

    return {
      id: `rem-gen-${baseId}`,
      title,
      durationMinutes: 10,
      content: `## 🎯 Targeted Remedial Booster: ${lesson?.title || course.title}

### 1. Diagnostic Summary & Identified Gap
During your recent checkpoint evaluation, comprehension of this topic was calculated at **${scorePercentage.toFixed(0)}%**, which is below our **70% mastery standard**.

This remedial module isolates the core failure modes and reinforces the fundamental mechanisms with simplified intuition, step-by-step mathematical proof, and immediate guided feedback.

---

### 2. Core Concepts & First Principles Refresher
1. **Mathematical Invariant**: Ensure all boundary conditions and state constraints are verified prior to transformation.
2. **Step-by-Step Execution**: Deconstruct the algorithm into atomic operations. Avoid skipping intermediate algebraic steps.
3. **Common Pitfall**: Misinterpreting asymptotic notation or confusing local convergence with global consensus.

---

### 3. Socratic Drill & Guided Example
Walk through the canonical proof example below:
- **Given**: State $x_0 \\in \\mathcal{F}(v)$ and restriction map $F_{v \\to e}$.
- **Operation**: Compute $\\delta_{\\mathcal{F}}(x) = F_{v \\to e}(x_v) - F_{u \\to e}(x_u)$.
- **Verification**: If $\\delta_{\\mathcal{F}}(x) = 0$, both nodes are in harmonic agreement!

Complete the practice quiz below to restore full mastery status and unlock subsequent advanced modules.`,
      keyTakeaways: [
        'Master the fundamental mathematical invariant and boundary conditions',
        'Verify intermediate states before applying global transformations',
        'Apply Socratic deconstruction to solve diagnostic edge cases with 100% precision',
      ],
      audioScript: `Welcome to your personalized Remedial Booster for ${lesson?.title || 'this module'}. In the next few minutes, we will systematically resolve every area of uncertainty from your previous quiz.`,
      quizzes: [
        {
          id: `rem-q-1-${baseId}`,
          question: `In the context of ${lesson?.title || 'this topic'}, what is the primary prerequisite for achieving consistent convergence?`,
          options: [
            'Verifying all stalk restriction maps and boundary invariants',
            'Increasing random parameter noise without constraints',
            'Skipping primal updates and jumping to global termination',
            'Ignoring intermediate edge variables completely',
          ],
          correctAnswerIndex: 0,
          explanation: 'Verifying all stalk restriction maps and boundary invariants guarantees mathematical consistency and prevents divergence.',
          hint: 'Look for the option that emphasizes structural consistency and boundary verification.',
        },
        {
          id: `rem-q-2-${baseId}`,
          question: 'When a metric falls below the 70% threshold, what is the best remedial practice?',
          options: [
            'Immediate step-by-step deconstruction of core first principles',
            'Skipping to the highest difficulty final capstone exam',
            'Disabling telemetry tracking and logging',
            'Deleting previous study notes',
          ],
          correctAnswerIndex: 0,
          explanation: 'Deconstructing the problem into atomic first principles allows rapid resolution of specific knowledge gaps.',
        }
      ],
      flashcards: [
        {
          id: `rem-fc-1-${baseId}`,
          front: 'What is the minimum passing mastery threshold for advancing to capstone modules?',
          back: '70% score on diagnostic quizzes and module assessments.',
        },
        {
          id: `rem-fc-2-${baseId}`,
          front: 'How does the Adaptive Learning Path Engine handle scores < 70%?',
          back: 'It dynamically prioritizes targeted remedial modules and adjusts lesson ordering until full mastery is verified.',
        }
      ],
    };
  }
}
