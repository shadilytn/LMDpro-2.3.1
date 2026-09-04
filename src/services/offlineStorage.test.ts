import { describe, it, expect, beforeEach } from 'vitest';
import { OfflineStorageService } from './offlineStorage';
import { StudentProgress, UserProfile } from '../shared/types';

describe('OfflineStorageService', () => {
  beforeEach(() => {
    // Clear storage before each test if available
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch (e) {
      // ignore
    }
  });

  it('should save and retrieve user profile correctly', () => {
    const mockProfile: UserProfile = {
      id: 'usr_test_123',
      name: 'Alex Mercer',
      email: 'alex@example.com',
      role: 'student',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      xpPoints: 2400,
      streakDays: 12,
      language: 'en',
      learningLevel: 'standard',
      level: 2,
      offlineSyncEnabled: true,
      completedCourseIds: [],
      enrolledCourseIds: ['CS101'],
      badges: [],
      milestones: []
    };

    OfflineStorageService.saveUserProfile(mockProfile);
    const retrieved = OfflineStorageService.getUserProfile();

    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(mockProfile.id);
    expect(retrieved?.name).toBe(mockProfile.name);
    expect(retrieved?.role).toBe('student');
  });

  it('should save and retrieve student progress', () => {
    const mockProgress: StudentProgress = {
      userId: 'usr_test_123',
      courseId: 'CS101',
      completedLessonIds: ['lesson-1', 'lesson-2'],
      quizResults: {
        'lesson-1': {
          courseId: 'CS101',
          lessonId: 'lesson-1',
          score: 95,
          totalQuestions: 10,
          percentage: 95,
          passed: true,
          feedback: 'Great job!',
          completedAt: new Date().toISOString()
        }
      },
      overallProgressPercentage: 50,
      adaptiveLevel: 'standard',
      lastAccessedAt: new Date().toISOString(),
      timeSpentMinutes: 120
    };

    OfflineStorageService.saveProgress(mockProgress);
    const retrieved = OfflineStorageService.getProgress('CS101');

    expect(retrieved).not.toBeNull();
    expect(retrieved?.completedLessonIds).toContain('lesson-1');
    expect(retrieved?.quizResults['lesson-1'].score).toBe(95);
  });

  it('should toggle offline mode flag safely', () => {
    OfflineStorageService.setOfflineMode(true);
    expect(OfflineStorageService.isOfflineMode()).toBe(true);

    OfflineStorageService.setOfflineMode(false);
    expect(OfflineStorageService.isOfflineMode()).toBe(false);
  });

  it('should calculate estimated storage quota metrics', async () => {
    const storageInfo = await OfflineStorageService.getStorageUsageInfo();
    expect(storageInfo).toHaveProperty('usedBytes');
    expect(storageInfo).toHaveProperty('quotaEstimateMb');
    expect(typeof storageInfo.usedBytes).toBe('number');
  });
});
