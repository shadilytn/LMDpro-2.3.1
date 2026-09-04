/**
 * AutoSaveService
 * Centralized coordination for student progress auto-saving,
 * local storage persistence, and cloud synchronization events.
 */

export type AutoSaveStatus = 'saved' | 'saving' | 'offline' | 'error';

export interface AutoSaveState {
  status: AutoSaveStatus;
  target?: 'local' | 'cloud' | 'progress' | 'profile' | 'notes' | 'all';
  lastSavedAt: number;
  message?: string;
  isBlinking: boolean;
}

type AutoSaveListener = (state: AutoSaveState) => void;

class AutoSaveService {
  private state: AutoSaveState = {
    status: 'saved',
    lastSavedAt: Date.now(),
    isBlinking: false,
    message: 'All changes saved',
  };

  private listeners: Set<AutoSaveListener> = new Set();
  private saveTimeout: any = null;
  private blinkResetTimeout: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedTs = localStorage.getItem('zalamati_last_auto_save_at');
        if (savedTs) {
          const ts = Number(savedTs);
          if (!isNaN(ts) && ts > 0) {
            this.state.lastSavedAt = ts;
          }
        }
      } catch (e) {
        // ignore
      }

      window.addEventListener('storage', (event) => {
        if (event.key && event.key.startsWith('zalamati_')) {
          this.triggerSaving('local', 800);
        }
      });
    }
  }

  public getState(): AutoSaveState {
    return { ...this.state };
  }

  public subscribe(listener: AutoSaveListener): () => void {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const currentState = { ...this.state };
    this.listeners.forEach((listener) => {
      try {
        listener(currentState);
      } catch (e) {
        console.error('[AutoSaveService] Listener error:', e);
      }
    });
  }

  /**
   * Trigger an active auto-save event.
   * Blinks the status indicator and schedules automatic transition to 'saved'.
   */
  public triggerSaving(
    target: AutoSaveState['target'] = 'local',
    activeDurationMs: number = 1200,
    customMessage?: string
  ): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    if (this.blinkResetTimeout) {
      clearTimeout(this.blinkResetTimeout);
    }

    this.state = {
      status: 'saving',
      target,
      lastSavedAt: this.state.lastSavedAt,
      isBlinking: true,
      message: customMessage || (target === 'cloud' ? 'Syncing to cloud...' : 'Auto-saving...'),
    };
    this.notify();

    // After active duration, transition to saved
    this.saveTimeout = setTimeout(() => {
      const now = Date.now();
      this.state = {
        status: !navigator.onLine ? 'offline' : 'saved',
        target,
        lastSavedAt: now,
        isBlinking: false,
        message: !navigator.onLine ? 'Saved offline' : 'Auto-saved',
      };

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('zalamati_last_auto_save_at', String(now));
        } catch (e) {
          // ignore
        }
      }

      this.notify();
    }, activeDurationMs);
  }

  /**
   * Directly notify completion of a save/sync operation.
   */
  public notifySaved(message?: string): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    const now = Date.now();
    this.state = {
      status: !navigator.onLine ? 'offline' : 'saved',
      lastSavedAt: now,
      isBlinking: false,
      message: message || (!navigator.onLine ? 'Saved locally' : 'All changes saved'),
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('zalamati_last_auto_save_at', String(now));
      } catch (e) {
        // ignore
      }
    }

    this.notify();
  }
}

export const autoSaveService = new AutoSaveService();
