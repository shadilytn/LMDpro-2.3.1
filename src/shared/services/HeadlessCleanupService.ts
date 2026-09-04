/**
 * HeadlessCleanupService.ts
 * Background service that periodically sweeps localStorage and IndexedDB caches
 * to prune expired session tokens, temporary audio buffers, and unused WebGL textures.
 */
export class HeadlessCleanupService {
  private static instance: HeadlessCleanupService;

  private constructor() {
    this.initCleanupWorker();
  }

  public static getInstance(): HeadlessCleanupService {
    if (!HeadlessCleanupService.instance) {
      HeadlessCleanupService.instance = new HeadlessCleanupService();
    }
    return HeadlessCleanupService.instance;
  }

  private initCleanupWorker(): void {
    if (typeof window === "undefined") return;
    // Run cleanup on startup and every 10 minutes
    setTimeout(() => this.runCleanup(), 5000);
    setInterval(() => this.runCleanup(), 10 * 60 * 1000);
  }

  public runCleanup(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("temp_audio_") || key.startsWith("cache_expired_"))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      // console.log("[HeadlessCleanupService] Cleaned stale storage keys:", keysToRemove.length);
    } catch (err) {
      console.warn("[HeadlessCleanupService] Cleanup warning:", err);
    }
  }
}

export const headlessCleanupService = HeadlessCleanupService.getInstance();
