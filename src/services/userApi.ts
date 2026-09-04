import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { UserProfile, UserRole, StudentProgress } from '../shared/types';

/**
 * Role-Based Permissions Matrix
 */
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  student: [
    'course:read',
    'course:enroll',
    'quiz:take',
    'tutor:access',
    'forum:read',
    'forum:write',
    'profile:read',
    'profile:write_own',
  ],
  teacher: [
    'course:read',
    'course:create',
    'course:edit',
    'course:delete',
    'quiz:create',
    'quiz:take',
    'tutor:access',
    'forum:read',
    'forum:write',
    'forum:moderate',
    'content_studio:access',
    'analytics:class_read',
    'profile:read',
    'profile:write_own',
  ],
  school: [
    'course:read',
    'course:create',
    'course:edit',
    'content_studio:access',
    'analytics:school_read',
    'users:manage_students',
    'users:manage_teachers',
    'profile:read',
    'profile:write_own',
  ],
  team: [
    'course:read',
    'content_studio:access',
    'analytics:team_read',
    'team:manage_members',
    'profile:read',
    'profile:write_own',
  ],
  enterprise: [
    'course:read',
    'course:create',
    'content_studio:access',
    'analytics:enterprise_read',
    'users:manage_all',
    'sso:configure',
    'audit:read',
    'profile:read',
    'profile:write_own',
  ],
};

export class UserApiService {
  /**
   * Fetch a user profile by User ID from Firestore
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!userId) return null;
    try {
      const docRef = doc(db, 'users', userId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as UserProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${userId}`);
      return null;
    }
  }

  /**
   * Create or synchronize a user profile document in Firestore
   */
  static async createOrSyncUserProfile(
    profileData: Partial<UserProfile> & { id: string; email: string }
  ): Promise<UserProfile> {
    const userId = profileData.id;
    const docRef = doc(db, 'users', userId);

    try {
      const existing = await this.getUserProfile(userId);
      const defaultProfile: UserProfile = {
        id: userId,
        name: profileData.name || profileData.email.split('@')[0] || 'User',
        email: profileData.email,
        role: profileData.role || 'student',
        avatarUrl:
          profileData.avatarUrl ||
          `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userId)}`,
        language: profileData.language || 'en',
        learningLevel: profileData.learningLevel || 'standard',
        xpPoints: profileData.xpPoints || 150,
        level: profileData.level || 1,
        streakDays: profileData.streakDays || 1,
        offlineSyncEnabled: true,
        completedCourseIds: profileData.completedCourseIds || [],
        enrolledCourseIds: profileData.enrolledCourseIds || [],
        badges: profileData.badges || [],
        milestones: profileData.milestones || [],
        theme: profileData.theme || 'dark',
        dailyStudyGoal: profileData.dailyStudyGoal || 30,
        ...existing,
        ...profileData,
      };

      await setDoc(docRef, defaultProfile, { merge: true });
      return defaultProfile;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userId}`);
      throw error;
    }
  }

  /**
   * Update fields on an existing user profile
   */
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    if (!userId) return;
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  }

  /**
   * Delete a user profile document
   */
  static async deleteUserProfile(userId: string): Promise<void> {
    if (!userId) return;
    try {
      const docRef = doc(db, 'users', userId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${userId}`);
    }
  }

  /**
   * Retrieve all users under a given Role
   */
  static async getUsersByRole(role: UserRole): Promise<UserProfile[]> {
    try {
      const q = query(collection(db, 'users'), where('role', '==', role));
      const querySnapshot = await getDocs(q);
      const results: UserProfile[] = [];
      querySnapshot.forEach((docSnap) => {
        results.push({ id: docSnap.id, ...docSnap.data() } as UserProfile);
      });
      return results;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, `users?role=${role}`);
      return [];
    }
  }

  /**
   * Check if a given UserRole has permission for an action
   */
  static checkPermission(role: UserRole, action: string): boolean {
    const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.student;
    return permissions.includes(action) || permissions.includes('users:manage_all');
  }

  /**
   * Get Student Progress for one or all courses
   */
  static async getUserProgress(userId: string, courseId?: string): Promise<StudentProgress[] | StudentProgress | null> {
    if (!userId) return null;
    try {
      if (courseId) {
        const docRef = doc(db, 'users', userId, 'progress', courseId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          return { userId, courseId, ...snapshot.data() } as StudentProgress;
        }
        return null;
      } else {
        const q = collection(db, 'users', userId, 'progress');
        const querySnapshot = await getDocs(q);
        const results: StudentProgress[] = [];
        querySnapshot.forEach((docSnap) => {
          results.push({ userId, courseId: docSnap.id, ...docSnap.data() } as StudentProgress);
        });
        return results;
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${userId}/progress`);
      return null;
    }
  }

  /**
   * Update Student Progress
   */
  static async updateUserProgress(
    userId: string,
    courseId: string,
    progressUpdates: Partial<StudentProgress>
  ): Promise<void> {
    if (!userId || !courseId) return;
    try {
      const docRef = doc(db, 'users', userId, 'progress', courseId);
      await setDoc(
        docRef,
        {
          userId,
          courseId,
          lastAccessedAt: new Date().toISOString(),
          ...progressUpdates,
        },
        { merge: true }
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userId}/progress/${courseId}`);
    }
  }
}

export default UserApiService;
