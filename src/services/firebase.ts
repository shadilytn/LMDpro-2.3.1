import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocFromServer,
  enableIndexedDbPersistence,
  Firestore
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const metaEnv = (import.meta as any).env || {};

const mergedConfig = {
  ...firebaseConfig,
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey,
  appId: metaEnv.VITE_FIREBASE_APP_ID || firebaseConfig.appId,
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
  firestoreDatabaseId: metaEnv.VITE_FIREBASE_FIRESTORE_DB_ID || (firebaseConfig as any).firestoreDatabaseId,
  oAuthClientId: metaEnv.VITE_FIREBASE_OAUTH_CLIENT_ID || (firebaseConfig as any).oAuthClientId,
};

const app = initializeApp(mergedConfig);

// Initialize Firestore with specific database ID and enhanced resilience settings for reliable iframe/container networking
const targetDbId: string | undefined = (mergedConfig as any).firestoreDatabaseId || undefined;

let firestoreInstance: Firestore;
try {
  firestoreInstance = targetDbId
    ? initializeFirestore(app, {
        experimentalForceLongPolling: true,
        experimentalAutoDetectLongPolling: true,
        ignoreUndefinedProperties: true
      }, targetDbId)
    : initializeFirestore(app, {
        experimentalForceLongPolling: true,
        experimentalAutoDetectLongPolling: true,
        ignoreUndefinedProperties: true
      });

  // Enable offline persistence if in browser environment
  if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(firestoreInstance).catch((err) => {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time.
        console.warn('[Firestore] Persistence failed: Multiple tabs open');
      } else if (err.code === 'unimplemented') {
        // The current browser does not support all of the features required to enable persistence
        console.warn('[Firestore] Persistence failed: Browser not supported');
      }
    });
  }
} catch (err) {
  console.warn('[Firestore] Advanced initialization failed, falling back to standard client:', err);
  firestoreInstance = targetDbId ? getFirestore(app, targetDbId) : getFirestore(app);
}

export const db = firestoreInstance;
export const auth = getAuth(app);

// In-memory token cache with automatic localStorage fallback
let cachedAccessToken: string | null = null;
try {
  if (typeof window !== 'undefined') {
    cachedAccessToken = localStorage.getItem('g_access_token') || sessionStorage.getItem('g_access_token');
  }
} catch (e) {
  console.warn('[Firebase Auth] LocalStorage or SessionStorage is blocked or disabled in this context:', e);
}
let isSigningIn = false;

// Error Handling Enum and Helper
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connectivity on initial load
export async function testFirestoreConnection() {
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Connection timeout')), 5000)
  );

  try {
    await Promise.race([
      getDocFromServer(doc(db, 'test', 'connection')),
      timeoutPromise
    ]);
    console.log('[Firestore] Connection verified.');
  } catch (error) {
    console.warn('Firebase Firestore is operating in offline mode or connecting:', error);
    // Explicitly enable network if it was disabled, or just log
  }
}

// Google Auth Provider with Google Workspace Scopes
export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.rosters.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
  'https://www.googleapis.com/auth/classroom.announcements.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/documents.readonly',
  'https://www.googleapis.com/auth/presentations.readonly',
  'https://www.googleapis.com/auth/tasks.readonly',
  'https://www.googleapis.com/auth/chat.messages.readonly',
  'https://www.googleapis.com/auth/forms.body.readonly',
  'https://www.googleapis.com/auth/forms.responses.readonly'
];

export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Automatically creates or updates the user profile in Firestore
 * and synchronizes their default preferences upon authentication.
 */
export const syncUserProfileToFirestore = async (
  user: User,
  additionalData: Record<string, any> = {}
) => {
  try {
    const profileDocRef = doc(db, 'users', user.uid, 'profile', 'main');
    const existingSnap = await getDoc(profileDocRef);
    let mergedData: Record<string, any>;

    const defaultPreferences = {
      theme: 'dark',
      aiModelPreference: 'gemini-3.7-flash',
      autoRagEnabled: true,
      voiceSpeed: 1.0,
      audioNarrationHost: 'nashmi',
      socraticFacilitation: true,
      notificationsEnabled: true,
      defaultRole: 'student',
      autoSyncGoogleDrive: true,
    };

    if (existingSnap.exists()) {
      const existing = existingSnap.data();
      mergedData = {
        ...existing,
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || existing.displayName || user.email?.split('@')[0] || 'LMDpro Scholar',
        photoURL: user.photoURL || existing.photoURL,
        lastLoginAt: new Date().toISOString(),
        preferences: {
          ...defaultPreferences,
          ...(existing.preferences || {}),
          ...(additionalData.preferences || {})
        },
        ...additionalData
      };
    } else {
      mergedData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'LMDpro Scholar',
        photoURL: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        role: 'student',
        xpPoints: 350,
        level: 1,
        enrolledCourses: ['course-ai-agentic-systems', 'course-executive-strategy'],
        completedLessons: [],
        preferences: defaultPreferences,
        ...additionalData
      };
    }

    await setDoc(profileDocRef, mergedData, { merge: true });

    // Also update root user document
    try {
      const userRootRef = doc(db, 'users', user.uid);
      await setDoc(userRootRef, {
        uid: user.uid,
        email: user.email,
        displayName: mergedData.displayName,
        photoURL: mergedData.photoURL,
        lastSeen: new Date().toISOString(),
        workspaceConnected: Boolean(mergedData.workspaceConnected),
        permissionsGranted: Boolean(mergedData.permissionsGranted)
      }, { merge: true });
    } catch {
      // Non-critical fallback
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('has_granted_workspace_permissions', 'true');
        localStorage.setItem('user_profile_synced', 'true');
      } catch (e) {
        console.warn('[Firebase Auth] Storage sync notice:', e);
      }
    }

    return mergedData;
  } catch (err) {
    console.warn('[Firebase Auth] Failed to sync profile to Firestore:', err);
    return null;
  }
};

/**
 * Silent Profile Hydration: Pre-fetches the user's latest curriculum progress and settings from Firestore immediately after login.
 * Refactored to ensure full mapping and eliminate race conditions with local state.
 */
export const silentProfileHydration = async (uid: string): Promise<any> => {
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Hydration timeout')), 8000)
  );

  console.log(`[ProfileHydration] Initiating silent hydration for UID: ${uid}`);

  try {
    const profileRef = doc(db, 'users', uid, 'profile', 'main');
    
    // Attempt high-priority server fetch for freshest data, with a race against timeout
    // Using getDocFromServer ensures we don't just get stale cache if network is available
    const snap = await Promise.race([
      getDocFromServer(profileRef).catch(err => {
        console.warn('[ProfileHydration] Server fetch failed, falling back to cache listener:', err);
        return getDoc(profileRef);
      }),
      timeoutPromise
    ]) as any;
    
    let profileData: any = null;
    
    if (snap && snap.exists()) {
      profileData = snap.data();
      console.log(`[ProfileHydration] Server/Fresh data retrieved for ${uid}`);
    } else {
      console.log(`[ProfileHydration] No fresh data on server for ${uid}, checking local cache...`);
      const cachedSnap = await getDoc(profileRef);
      if (cachedSnap.exists()) {
        profileData = cachedSnap.data();
        console.log(`[ProfileHydration] Cached data retrieved for ${uid}`);
      }
    }

    if (profileData) {
      // Robust mapping: Ensure all curriculum progress fields are initialized
      // This prevents UI glitches where arrays might be null or undefined
      return {
        ...profileData,
        uid: profileData.uid || uid,
        enrolledCourses: Array.isArray(profileData.enrolledCourses) ? profileData.enrolledCourses : [],
        completedLessons: Array.isArray(profileData.completedLessons) ? profileData.completedLessons : [],
        xpPoints: typeof profileData.xpPoints === 'number' ? profileData.xpPoints : (profileData.xpPoints ?? 350),
        level: typeof profileData.level === 'number' ? profileData.level : (profileData.level ?? 1),
        preferences: {
          theme: profileData.preferences?.theme || 'dark',
          language: profileData.preferences?.language || 'en',
          ...(profileData.preferences || {})
        },
        badges: Array.isArray(profileData.badges) ? profileData.badges : [],
        milestones: Array.isArray(profileData.milestones) ? profileData.milestones : [],
        hydratedAt: new Date().toISOString(),
        isFresh: snap && !snap.metadata?.fromCache
      };
    }

    console.warn(`[ProfileHydration] No profile document found for ${uid} in any layer.`);
    return null;
  } catch (err) {
    console.error('[ProfileHydration] Critical hydration failure:', err);
    // Final emergency fallback to local cache without timeout
    try {
      const profileRef = doc(db, 'users', uid, 'profile', 'main');
      const cachedSnap = await getDoc(profileRef);
      if (cachedSnap.exists()) {
        const data = cachedSnap.data();
        return {
          ...data,
          uid: data.uid || uid,
          enrolledCourses: Array.isArray(data.enrolledCourses) ? data.enrolledCourses : [],
          completedLessons: Array.isArray(data.completedLessons) ? data.completedLessons : [],
          isFallback: true
        };
      }
    } catch (cacheErr) {
      console.error('[ProfileHydration] Cache emergency fallback also failed:', cacheErr);
    }
    return null;
  }
};

/**
 * Explicit Google Workspace & Gemini OAuth Sign-In Helper
 * Requests 'gmail.readonly' and 'drive.file' (along with classroom & drive scopes)
 * Creates a user profile in Firestore and syncs default preferences
 */
export const signInWithGoogleWorkspace = async (): Promise<{
  user: User;
  accessToken: string | null;
  permissionsGranted: boolean;
  profileData: any;
} | null> => {
  try {
    isSigningIn = true;
    const provider = new GoogleAuthProvider();

    // Explicitly add 'gmail.readonly' and 'drive.file' as requested
    provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
    provider.addScope('https://www.googleapis.com/auth/drive.file');
    provider.addScope('https://www.googleapis.com/auth/drive.readonly');
    provider.addScope('https://www.googleapis.com/auth/classroom.courses.readonly');
    provider.addScope('https://www.googleapis.com/auth/classroom.rosters.readonly');
    provider.addScope('https://www.googleapis.com/auth/classroom.coursework.students.readonly');
    provider.addScope('https://www.googleapis.com/auth/calendar.events');

    provider.setCustomParameters({
      prompt: 'select_account consent',
      access_type: 'offline',
    });

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || null;

    if (cachedAccessToken && typeof window !== 'undefined') {
      try {
        localStorage.setItem('g_access_token', cachedAccessToken);
        sessionStorage.setItem('g_access_token', cachedAccessToken);
        localStorage.setItem('has_granted_workspace_permissions', 'true');
      } catch (e) {
        console.warn('[Firebase Auth] Failed to persist g_access_token to storage:', e);
      }
    }

    // Automatically create / sync user profile in Firestore with default preferences
    const profileData = await syncUserProfileToFirestore(result.user, {
      workspaceConnected: true,
      workspaceEmail: result.user.email,
      permissionsGranted: true,
      scopesGranted: [
        'gmail.readonly',
        'drive.file',
        'drive.readonly',
        'classroom.courses.readonly'
      ],
      xpPoints: 350
    });

    return {
      user: result.user,
      accessToken: cachedAccessToken,
      permissionsGranted: true,
      profileData
    };
  } catch (error: any) {
    console.error('Google Sign In with Workspace Scopes Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const hasGrantedWorkspacePermissions = (): boolean => {
  if (typeof window === 'undefined') return false;
  const granted = localStorage.getItem('has_granted_workspace_permissions') === 'true';
  const hasToken = Boolean(localStorage.getItem('g_access_token') || cachedAccessToken);
  const currentUser = auth.currentUser;
  return Boolean(currentUser && (granted || hasToken));
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string | null } | null> => {
  const result = await signInWithGoogleWorkspace();
  if (result) {
    return { user: result.user, accessToken: result.accessToken };
  }
  return null;
};

export const getAccessToken = (): string | null => {
  if (!cachedAccessToken && typeof window !== 'undefined') {
    try {
      cachedAccessToken = localStorage.getItem('g_access_token') || sessionStorage.getItem('g_access_token');
    } catch (e) {
      console.warn('[Firebase Auth] Failed to retrieve g_access_token from storage:', e);
    }
  }
  return cachedAccessToken;
};

export const setAccessToken = (token: string | null) => {
  cachedAccessToken = token;
  if (typeof window !== 'undefined') {
    try {
      if (token) {
        localStorage.setItem('g_access_token', token);
        sessionStorage.setItem('g_access_token', token);
      } else {
        localStorage.removeItem('g_access_token');
        sessionStorage.removeItem('g_access_token');
      }
    } catch (e) {
      console.warn('[Firebase Auth] Failed to modify g_access_token in storage:', e);
    }
  }
};

export const logout = async () => {
  await signOut(auth);
  setAccessToken(null);
};
