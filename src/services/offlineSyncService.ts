import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toastService } from './toastService';
import { WorkspaceService } from '../shared/workspace.service';
import { autoSaveService } from './autoSaveService';

export type SyncItemDataType = 'critical_progress' | 'user_profile' | 'quiz_result' | 'telemetry';

export interface OfflineSyncQueueItem {
  id: string;
  userId: string;
  courseId: string;
  completedLessonIds: string[];
  xp: number;
  adaptiveLevel: string;
  updatedAt: string;
  dataType?: SyncItemDataType;
  priority?: number; // 1 = highest (critical_progress), 4 = lowest (telemetry)
  payload?: any;
  retryCount?: number;
  nextRetryTimestamp?: number;
}

const STORAGE_KEY = 'zalamati_offline_sync_queue';

class OfflineSyncService {
  private queue: OfflineSyncQueueItem[] = [];
  private syncListeners: Array<(isSyncing: boolean, queuedCount: number, lastSyncedAt: number | null) => void> = [];
  private isSyncing = false;
  private lastSyncedAt: number | null = null;

  constructor() {
    this.loadLastSyncedAt();
    this.loadQueue();
    this.setupNetworkListeners();
    this.registerServiceWorker();
  }

  private loadLastSyncedAt() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('zalamati_last_synced_at');
        if (saved) {
          const parsed = Number(saved);
          if (!isNaN(parsed) && parsed > 0) {
            this.lastSyncedAt = parsed;
          }
        }
      } catch (e) {
        console.error('Failed to load lastSyncedAt:', e);
      }
    }
  }

  private loadQueue() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          this.queue = JSON.parse(saved);
        }
      } catch (e) {
        console.error('Failed to load offline sync queue:', e);
        this.queue = [];
      }
    }
  }

  private saveQueue() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.queue));
        this.notifyListeners();
      } catch (e) {
        console.error('Failed to save offline sync queue:', e);
      }
    }
  }

  private setupNetworkListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.syncQueueToFirebase();
      });

      window.addEventListener('offline', () => {
        this.notifyListeners();
      });

      // Periodically trigger a sync run as a background fallback in case event is missed
      setInterval(() => {
        if (navigator.onLine && this.queue.length > 0) {
          this.syncQueueToFirebase();
        }
      }, 20000);
    }
  }

  public registerServiceWorker() {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            // Listen for background sync trigger messages from Service Worker
            navigator.serviceWorker.addEventListener('message', (event) => {
              if (event.data && event.data.type === 'TRIGGER_OFFLINE_SYNC') {
                this.syncQueueToFirebase();
              }
            });
          })
          .catch((err) => {
            console.warn('[OfflineSync] Service Worker registration failed:', err);
          });
      });
    }
  }

  /**
   * Determine numerical priority from dataType
   */
  private getPriorityForType(dataType?: SyncItemDataType): number {
    switch (dataType) {
      case 'critical_progress':
        return 1;
      case 'user_profile':
        return 2;
      case 'quiz_result':
        return 3;
      case 'telemetry':
      default:
        return 4;
    }
  }

  /**
   * Enqueue a new student progress update with priority weighting
   */
  public async enqueueProgress(
    courseId: string,
    completedLessonIds: string[],
    xp: number,
    adaptiveLevel: string,
    dataType: SyncItemDataType = 'critical_progress',
    payload?: any
  ): Promise<boolean> {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.warn('[OfflineSync] Cannot queue progress: No authenticated user.');
      return false;
    }

    const priority = this.getPriorityForType(dataType);

    const newItem: OfflineSyncQueueItem = {
      id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      courseId,
      completedLessonIds,
      xp,
      adaptiveLevel,
      updatedAt: new Date().toISOString(),
      dataType,
      priority,
      payload
    };

    // If online, attempt direct save first
    if (navigator.onLine) {
      autoSaveService.triggerSaving('cloud', 1500, 'Syncing progress...');
      try {
        const success = await this.saveToFirestore(newItem);
        if (success) {
          autoSaveService.notifySaved('Progress synced');
          return true;
        }
      } catch (err) {
        console.warn('[OfflineSync] Direct sync failed. Enqueueing progress for later.', err);
      }
    } else {
      autoSaveService.triggerSaving('progress', 1000, 'Saved offline');
    }

    // Add to local offline queue
    // De-duplicate: if there's already an item for the same courseId, overwrite it with the latest progress
    const existingIndex = this.queue.findIndex(item => item.courseId === courseId && item.userId === userId);
    if (existingIndex >= 0) {
      this.queue[existingIndex] = newItem;
    } else {
      this.queue.push(newItem);
    }

    this.saveQueue();
    return false;
  }

  /**
   * Dispatch summary of study achievements to connected Google Drive account
   */
  private async dispatchDriveProgressLog(item: OfflineSyncQueueItem): Promise<void> {
    try {
      if (typeof window === 'undefined') return;
      const token = localStorage.getItem('google_oauth_token') || sessionStorage.getItem('google_oauth_token');
      if (!token) return;

      const dateStr = new Date().toISOString().split('T')[0];
      const fileName = `Progress_Log_${item.courseId}_${dateStr}.md`;
      const content = `# LMDpro Executive Learning Progress Log\n\n` +
        `**Course ID:** ${item.courseId}\n` +
        `**User ID:** ${item.userId}\n` +
        `**XP Earned:** ${item.xp}\n` +
        `**Adaptive Level:** ${item.adaptiveLevel}\n` +
        `**Completed Lessons:** ${item.completedLessonIds.join(', ') || 'None'}\n` +
        `**Timestamp:** ${item.updatedAt}\n\n` +
        `*Automatically generated by Zalamati OfflineSyncService & Google Workspace Engine.*`;

      await WorkspaceService.exportToLMDproAcademyFolder(
        token,
        fileName,
        content,
        'text/markdown'
      );
    } catch (err) {
      console.warn('[OfflineSync] Background Google Drive progress log dispatch skipped:', err);
    }
  }

  /**
   * Send single item to Firestore
   */
  private async saveToFirestore(item: OfflineSyncQueueItem): Promise<boolean> {
    const path = `users/${item.userId}/progress/${item.courseId}`;
    try {
      const docRef = doc(db, 'users', item.userId, 'progress', item.courseId);
      await setDoc(docRef, {
        userId: item.userId,
        courseId: item.courseId,
        completedLessonIds: item.completedLessonIds,
        xp: item.xp,
        adaptiveLevel: item.adaptiveLevel,
        updatedAt: item.updatedAt,
        dataType: item.dataType || 'critical_progress',
        payload: item.payload || null
      });

      // Update timestamp of last successful Firebase synchronization event
      this.lastSyncedAt = Date.now();
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('zalamati_last_synced_at', String(this.lastSyncedAt));
        } catch (e) {
          // ignore storage error
        }
      }

      // Dispatch automated Google Drive study achievement progress log
      this.dispatchDriveProgressLog(item);

      return true;
    } catch (error) {
      console.warn(`[OfflineSync] Write to Firestore at ${path} deferred:`, error);
      return false;
    }
  }

  /**
   * Sync the whole local queue to Firebase prioritized by critical urgency
   */
  public async syncQueueToFirebase(): Promise<void> {
    if (this.isSyncing || this.queue.length === 0) return;
    if (!navigator.onLine) {
      return;
    }

    this.isSyncing = true;
    autoSaveService.triggerSaving('cloud', 2000, 'Syncing queue to cloud...');
    this.notifyListeners();

    // Sort queue by priority ascending (1 = highest / critical_progress first)
    const sortedQueue = [...this.queue].sort((a, b) => {
      const pA = a.priority || this.getPriorityForType(a.dataType);
      const pB = b.priority || this.getPriorityForType(b.dataType);
      return pA - pB;
    });

    const failedItems: OfflineSyncQueueItem[] = [];
    const now = Date.now();

    for (const item of sortedQueue) {
      // Respect Exponential Backoff window if scheduled for later retry
      if (item.nextRetryTimestamp && now < item.nextRetryTimestamp) {
        failedItems.push(item);
        continue;
      }

      // Check if user is still the current active user
      if (auth.currentUser && auth.currentUser.uid !== item.userId) {
        failedItems.push(item);
        continue;
      }

      const success = await this.saveToFirestore(item);
      if (!success) {
        const currentRetry = (item.retryCount || 0) + 1;
        // Exponential backoff delay calculation: 1s, 2s, 4s, 8s... capped at 60s
        const backoffMs = Math.min(1000 * Math.pow(2, currentRetry), 60000);
        
        const updatedFailedItem: OfflineSyncQueueItem = {
          ...item,
          retryCount: currentRetry,
          nextRetryTimestamp: Date.now() + backoffMs
        };

        // Headless telemetry logging of sync failure count
        try {
          if (navigator.onLine) {
            const colRef = doc(db, 'telemetry_failures', `sync_failure_${item.id}`);
            await setDoc(colRef, {
              itemId: item.id,
              courseId: item.courseId,
              userId: item.userId,
              retryCount: currentRetry,
              nextRetryInMs: backoffMs,
              dataType: item.dataType || 'critical_progress',
              failedAt: new Date().toISOString()
            }, { merge: true });
          }
        } catch (telemetryErr) {
          console.warn('[OfflineSync] Telemetry failure log buffered locally:', telemetryErr);
        }

        failedItems.push(updatedFailedItem);
      }
    }

    this.queue = failedItems;
    this.saveQueue();
    this.isSyncing = false;
    this.notifyListeners();
  }

  public getQueueLength(): number {
    return this.queue.length;
  }

  public getQueue(): OfflineSyncQueueItem[] {
    return [...this.queue];
  }

  public getLastSyncedAt(): number | null {
    return this.lastSyncedAt;
  }

  public subscribe(listener: (isSyncing: boolean, queuedCount: number, lastSyncedAt: number | null) => void) {
    this.syncListeners.push(listener);
    // Initial emission
    listener(this.isSyncing, this.queue.length, this.lastSyncedAt);
    return () => {
      this.syncListeners = this.syncListeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.syncListeners.forEach(listener => listener(this.isSyncing, this.queue.length, this.lastSyncedAt));
  }
}

export const offlineSyncService = new OfflineSyncService();
