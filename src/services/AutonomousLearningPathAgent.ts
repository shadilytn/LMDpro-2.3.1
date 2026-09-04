import { OfflineStorageService } from './offlineStorage';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export interface LearningPathNode {
  moduleId: string;
  moduleTitle: string;
  recommendedOrder: number;
  adaptiveDifficulty: 'foundational' | 'intermediate' | 'advanced' | 'mastery';
  estimatedHours: number;
  priorityScore: number;
  status: 'locked' | 'recommended' | 'in_progress' | 'completed';
  remedialSuggested: boolean;
}

export interface StudentLearningPathState {
  userId: string;
  lastRecalculatedAt: string;
  overallMasteryLevel: string;
  recommendedNextModules: LearningPathNode[];
  remedialTopics: string[];
  totalXp: number;
}

class AutonomousLearningPathAgentService {
  private isProcessing = false;
  private intervalId: NodeJS.Timeout | null = null;

  public start() {
    if (this.intervalId) return;

    // Initial immediate silent run
    setTimeout(() => {
      this.recalculateLearningPath();
    }, 3000);

    // Set and forget cycle every 45 seconds
    this.intervalId = setInterval(() => {
      this.recalculateLearningPath();
    }, 45000);
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Autonomous background recalculation engine
   */
  public async recalculateLearningPath(): Promise<StudentLearningPathState | null> {
    if (this.isProcessing) return null;
    this.isProcessing = true;

    try {
      const profile = OfflineStorageService.getProfile();
      const progressMap = OfflineStorageService.getProgressMap();
      const courses = OfflineStorageService.getCourses();

      const userId = auth.currentUser?.uid || profile.id || 'anonymous-user';

      // Aggregate student stats
      let totalCompletedLessons = 0;
      let totalXp = 0;
      const completedCourseIds = new Set<string>();

      Object.values(progressMap).forEach((prog) => {
        totalCompletedLessons += prog.completedLessonIds.length;
        totalXp += (prog.xp || prog.completedLessonIds.length * 50);
        if (prog.completedLessonIds.length >= 5) {
          completedCourseIds.add(prog.courseId);
        }
      });

      // Analyze quiz performance & calculate mastery
      let overallMastery: 'foundational' | 'intermediate' | 'advanced' | 'mastery' = 'foundational';
      if (totalXp > 2000) {
        overallMastery = 'mastery';
      } else if (totalXp > 1000) {
        overallMastery = 'advanced';
      } else if (totalXp > 400) {
        overallMastery = 'intermediate';
      }

      // Generate dynamic recommended modules from available courses
      const recommendedNextModules: LearningPathNode[] = [];
      const remedialTopics: string[] = [];

      courses.forEach((course, idx) => {
        const prog = progressMap[course.id];
        const isCompleted = completedCourseIds.has(course.id);
        const inProgress = prog && prog.completedLessonIds.length > 0 && !isCompleted;

        let status: LearningPathNode['status'] = 'recommended';
        if (isCompleted) {
          status = 'completed';
        } else if (inProgress) {
          status = 'in_progress';
        } else if (idx > 4 && totalXp < 200) {
          status = 'locked';
        }

        const priorityScore = isCompleted ? 0 : inProgress ? 100 - idx * 2 : 80 - idx * 5;
        const currentProgXp = prog ? (prog.xp || prog.completedLessonIds.length * 50) : 0;
        const remedialSuggested = prog ? prog.completedLessonIds.length < 2 && currentProgXp < 50 : false;

        if (remedialSuggested) {
          remedialTopics.push(course.category || 'Foundational Principles');
        }

        recommendedNextModules.push({
          moduleId: course.id,
          moduleTitle: course.title,
          recommendedOrder: idx + 1,
          adaptiveDifficulty: overallMastery,
          estimatedHours: course.durationHours || 12,
          priorityScore,
          status,
          remedialSuggested
        });
      });

      // Sort by priority score
      recommendedNextModules.sort((a, b) => b.priorityScore - a.priorityScore);

      const pathState: StudentLearningPathState = {
        userId,
        lastRecalculatedAt: new Date().toISOString(),
        overallMasteryLevel: overallMastery,
        recommendedNextModules: recommendedNextModules.slice(0, 10),
        remedialTopics: Array.from(new Set(remedialTopics)),
        totalXp
      };

      // 1. Silent persist to local storage cache
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('zalamati_autonomous_learning_path', JSON.stringify(pathState));
        } catch (e) {
          // Silent catch
        }
      }

      // 2. Silent persist to Firestore if online & authenticated
      if (auth.currentUser && navigator.onLine) {
        const path = `users/${userId}/learning_path/current`;
        try {
          const docRef = doc(db, 'users', userId, 'learning_path', 'current');
          await setDoc(docRef, {
            ...pathState,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, path);
        }
      }

      return pathState;
    } catch (err) {
      console.warn('[AutonomousLearningPathAgent] Silent calculation cycle caught exception:', err);
      return null;
    } finally {
      this.isProcessing = false;
    }
  }
}

export const AutonomousLearningPathAgent = new AutonomousLearningPathAgentService();
