import { auth } from './firebase';
import { User } from 'firebase/auth';

export interface AuthenticatedSession {
  user: User | null;
  idToken: string | null;
  role: 'admin' | 'teacher' | 'student' | 'guest';
  isAuthenticated: boolean;
  isValidated: boolean;
}

/**
 * Validates the current Firebase ID token globally.
 */
export async function validateFirebaseToken(user: User | null): Promise<string | null> {
  if (!user) return null;
  try {
    const idToken = await user.getIdToken(/* forceRefresh */ false);
    return idToken;
  } catch (error) {
    console.error('[authMiddleware] Token validation error:', error);
    return null;
  }
}

/**
 * Middleware checker for restricted routes and dashboard access.
 */
export async function checkRoutePermission(
  requiredRole: 'admin' | 'teacher' | 'student' | 'any' = 'any'
): Promise<AuthenticatedSession> {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return {
      user: null,
      idToken: null,
      role: 'guest',
      isAuthenticated: false,
      isValidated: false
    };
  }

  const token = await validateFirebaseToken(currentUser);
  if (!token) {
    return {
      user: currentUser,
      idToken: null,
      role: 'guest',
      isAuthenticated: false,
      isValidated: false
    };
  }

  // Derive role based on user claims or metadata fallback
  let userRole: 'admin' | 'teacher' | 'student' = 'student';
  try {
    const tokenResult = await currentUser.getIdTokenResult();
    if (tokenResult.claims.admin || currentUser.email?.endsWith('@lmdpro.edu') || currentUser.email === 'shillann.b@gmail.com') {
      userRole = 'admin';
    } else if (tokenResult.claims.teacher) {
      userRole = 'teacher';
    }
  } catch (e) {
    console.warn('[authMiddleware] Could not read custom user claims:', e);
  }

  const isPermitted =
    requiredRole === 'any' ||
    userRole === 'admin' ||
    userRole === requiredRole;

  return {
    user: currentUser,
    idToken: token,
    role: userRole,
    isAuthenticated: true,
    isValidated: isPermitted
  };
}
