import { UserProfile, Badge, Milestone } from './types';
import { OfflineStorageService } from '../services/offlineStorage';
import { offlineSyncService } from '../services/offlineSyncService';
import { toastService } from '../services/toastService';

export interface PointEvent {
  id: string;
  xpEarned: number;
  baseXp: number;
  multiplier: number;
  reason: string;
  timestamp: string;
  newTotalXp: number;
  oldLevel: number;
  newLevel: number;
  levelUp: boolean;
  unlockedBadges: Badge[];
}

type PointEventListener = (event: PointEvent) => void;

class GamificationEngineService {
  private listeners: PointEventListener[] = [];

  /**
   * Subscribe to live point preview animation events
   */
  public subscribe(listener: PointEventListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(event: PointEvent) {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (e) {
        console.warn('[GamificationEngine] Listener error:', e);
      }
    });
  }

  /**
   * Award points (XP) dynamically with live animation event feedback
   */
  public awardXP(
    baseXp: number,
    reason: string,
    optionalContext?: { courseId?: string; quizScore?: number; perfectScore?: boolean }
  ): PointEvent {
    const profile = OfflineStorageService.getProfile();
    const currentXp = profile.xpPoints || profile.xp || 0;
    const oldLevel = profile.level || Math.floor(currentXp / 1000) + 1;

    // Calculate streak multiplier
    const streakDays = profile.streakDays || 7;
    let multiplier = 1.0;
    if (streakDays >= 14) multiplier = 1.5;
    else if (streakDays >= 7) multiplier = 1.25;

    const totalEarnedXp = Math.round(baseXp * multiplier);
    const newTotalXp = currentXp + totalEarnedXp;
    const newLevel = Math.floor(newTotalXp / 1000) + 1;
    const levelUp = newLevel > oldLevel;

    // Check Badge Unlocks
    const existingBadges = profile.badges || [];
    const unlockedBadges: Badge[] = [];

    const checkAndAddBadge = (badge: Badge) => {
      if (!existingBadges.some((b) => b.id === badge.id)) {
        unlockedBadges.push(badge);
        existingBadges.push(badge);
      }
    };

    // 1. Level up badge
    if (newLevel >= 2) {
      checkAndAddBadge({
        id: 'b-level2',
        name: 'Master Systems Architect',
        icon: '⚡',
        description: 'Advanced to Level 2 in LMDpro Academy',
        category: 'mastery',
        dateUnlocked: new Date().toLocaleDateString()
      });
    }

    // 2. High XP badge
    if (newTotalXp >= 1000) {
      checkAndAddBadge({
        id: 'b-1k-xp',
        name: '1K XP Scholar',
        icon: '🏆',
        description: 'Earned 1,000+ total academic XP',
        category: 'learning',
        dateUnlocked: new Date().toLocaleDateString()
      });
    }

    // 3. Quiz perfectionist badge
    if (optionalContext?.perfectScore) {
      checkAndAddBadge({
        id: 'b-perfect-quiz',
        name: 'Consensus Perfectionist',
        icon: '🎯',
        description: 'Achieved 100% accuracy on a comprehensive quiz',
        category: 'mastery',
        dateUnlocked: new Date().toLocaleDateString()
      });
    }

    // Update milestones
    const updatedMilestones = (profile.milestones || []).map((m) => {
      if (!m.achieved && newTotalXp >= m.targetXP) {
        return { ...m, achieved: true };
      }
      return m;
    });

    // Save updated profile
    const updatedProfile: UserProfile = {
      ...profile,
      xpPoints: newTotalXp,
      xp: newTotalXp,
      level: newLevel,
      badges: existingBadges,
      milestones: updatedMilestones
    };

    OfflineStorageService.saveProfile(updatedProfile);

    // Enqueue cloud sync
    if (optionalContext?.courseId) {
      const prog = OfflineStorageService.getProgress(optionalContext.courseId);
      if (prog) {
        offlineSyncService.enqueueProgress(
          optionalContext.courseId,
          prog.completedLessonIds,
          newTotalXp,
          profile.learningLevel || 'standard'
        );
      }
    }

    const event: PointEvent = {
      id: `pe-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      xpEarned: totalEarnedXp,
      baseXp,
      multiplier,
      reason,
      timestamp: new Date().toISOString(),
      newTotalXp,
      oldLevel,
      newLevel,
      levelUp,
      unlockedBadges
    };

    // Trigger toast notification
    if (levelUp) {
      toastService.show({
        type: 'success',
        title: `🎉 LEVEL UP! Level ${newLevel}`,
        message: `Congratulations! You've advanced to Level ${newLevel} (${newTotalXp} XP total). Keep ascending!`,
        duration: 6000
      });
    } else if (unlockedBadges.length > 0) {
      unlockedBadges.forEach((b) => {
        toastService.show({
          type: 'success',
          title: `🏅 Badge Unlocked: ${b.name}`,
          message: `${b.description} (+${totalEarnedXp} XP)`,
          duration: 5000
        });
      });
    }

    this.notify(event);
    return event;
  }
}

export const GamificationEngine = new GamificationEngineService();
