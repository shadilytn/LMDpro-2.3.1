import { auth } from './firebase';

export interface GeminiProxyOptions {
  prompt?: string;
  contents?: any;
  systemInstruction?: string;
  model?: string;
  config?: any;
  cacheKey?: string;
  cacheTtlMs?: number;
}

export interface GeminiProxyResult {
  success: boolean;
  text: string;
  modelUsed?: string;
  usageMetadata?: any;
  error?: string;
}

/**
 * Client-side interface to the secure server-side Gemini Proxy Route.
 * Automatically attaches authenticated user context and access tokens.
 * API keys remain strictly hidden and isolated on the backend server.
 */
export const GeminiProxyService = {
  async generate(options: GeminiProxyOptions): Promise<GeminiProxyResult> {
    try {
      const currentUser = auth.currentUser;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (currentUser) {
        headers['x-user-id'] = currentUser.uid;
        try {
          const idToken = await currentUser.getIdToken();
          if (idToken) {
            headers['Authorization'] = `Bearer ${idToken}`;
          }
        } catch {
          // fallback to cached token or uid
          const cached = localStorage.getItem('g_access_token');
          if (cached) {
            headers['Authorization'] = `Bearer ${cached}`;
          }
        }
      }

      const res = await fetch('/api/gemini/proxy', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt: options.prompt,
          contents: options.contents,
          systemInstruction: options.systemInstruction,
          model: options.model || 'gemini-3.7-flash',
          config: options.config,
          cacheKey: options.cacheKey,
          cacheTtlMs: options.cacheTtlMs,
          userId: currentUser?.uid,
        }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          const retryAfter = res.headers.get('Retry-After') || '60';
          return {
            success: false,
            text: '',
            error: `Rate limit exceeded. Please wait ${retryAfter}s before requesting again.`,
          };
        }
        const errJson = await res.json().catch(() => ({}));
        return {
          success: false,
          text: '',
          error: errJson.error || `Gemini proxy error HTTP ${res.status}`,
        };
      }

      const data = await res.json();
      return {
        success: Boolean(data.success),
        text: data.text || '',
        modelUsed: data.modelUsed,
        usageMetadata: data.usageMetadata,
      };
    } catch (err: any) {
      console.warn('[GeminiProxyService] Request exception:', err);
      return {
        success: false,
        text: '',
        error: err.message || 'Network error calling Gemini proxy',
      };
    }
  },
};
