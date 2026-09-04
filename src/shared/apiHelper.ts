/**
 * apiHelper.ts
 * Centralized utility for consistent API request headers and context injection.
 */

export const getApiHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Inject user's custom Gemini API key if present in local storage
  try {
    const storedUser = localStorage.getItem('lmdpro_user_profile');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.geminiApiKey) {
        headers['x-gemini-api-key'] = user.geminiApiKey;
      }
    }
  } catch (err) {
    // Silent fail for non-blocking header injection
  }

  return headers;
};
