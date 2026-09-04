import { PerformanceMonitor, BottleneckLog } from './performanceMonitor';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export interface TelemetryBatch {
  userId: string;
  timestamp: string;
  metrics: {
    fps: number;
    memoryUsedMB: number;
    online: boolean;
    userAgent: string;
  };
  recentLogs: BottleneckLog[];
  uncaughtErrors: Array<{ message: string; stack?: string; timestamp: string }>;
}

class TelemetryLoggerService {
  private uncaughtErrors: Array<{ message: string; stack?: string; timestamp: string }> = [];
  private nonCriticalWarningBuffer: Array<{ message: string; category?: string; timestamp: string }> = [];
  private isFlushing = false;
  private intervalId: NodeJS.Timeout | null = null;
  private lastDailyReportDate: string = '';

  constructor() {
    this.setupErrorListeners();
  }

  public logNonCriticalWarning(message: string, category: string = 'background_event'): void {
    this.nonCriticalWarningBuffer.push({
      message,
      category,
      timestamp: new Date().toISOString()
    });
    if (this.nonCriticalWarningBuffer.length > 100) {
      this.nonCriticalWarningBuffer.shift();
    }
  }

  public start() {
    if (this.intervalId) return;

    // Periodic telemetry flush every 60 seconds scheduled during idle periods
    this.intervalId = setInterval(() => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          this.flushTelemetry();
        }, { timeout: 2000 });
      } else {
        setTimeout(() => {
          this.flushTelemetry();
        }, 0);
      }
    }, 60000);
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public async logException(error: Error, componentStack?: string): Promise<void> {
    const errorRecord = {
      message: error.message || 'Component Exception',
      name: error.name || 'Error',
      stack: error.stack || 'No stack trace',
      componentStack: componentStack || null,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
      userId: auth.currentUser?.uid || 'anonymous-user'
    };

    this.uncaughtErrors.push({
      message: errorRecord.message,
      stack: `${errorRecord.stack}\nComponentStack: ${componentStack || ''}`,
      timestamp: errorRecord.timestamp
    });

    if (navigator.onLine) {
      try {
        const colRef = collection(db, 'system_errors');
        await addDoc(colRef, errorRecord);
      } catch (e) {
        console.warn('[TelemetryLoggerService] Failed to pipe exception to remote Firestore:', e);
      }
    }
  }

  private setupErrorListeners() {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (event) => {
      this.uncaughtErrors.push({
        message: event.message || 'Window Error Event',
        stack: event.error?.stack || `${event.filename}:${event.lineno}`,
        timestamp: new Date().toISOString()
      });
      if (this.uncaughtErrors.length > 20) {
        this.uncaughtErrors.shift();
      }
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.uncaughtErrors.push({
        message: event.reason?.message || String(event.reason || 'Unhandled Promise Rejection'),
        stack: event.reason?.stack,
        timestamp: new Date().toISOString()
      });
      if (this.uncaughtErrors.length > 20) {
        this.uncaughtErrors.shift();
      }
    });
  }

  public async flushTelemetry(): Promise<void> {
    if (this.isFlushing || typeof window === 'undefined') return;
    this.isFlushing = true;

    try {
      const metrics = PerformanceMonitor.getMetrics();
      const logs = PerformanceMonitor.getLogs();
      const userId = auth.currentUser?.uid || 'anonymous-telemetry';

      const batch: TelemetryBatch = {
        userId,
        timestamp: new Date().toISOString(),
        metrics: {
          fps: metrics.fps,
          memoryUsedMB: metrics.memoryUsedMB,
          online: navigator.onLine,
          userAgent: navigator.userAgent
        },
        recentLogs: logs.slice(0, 5),
        uncaughtErrors: [...this.uncaughtErrors]
      };

      // Clear local buffer after capturing
      this.uncaughtErrors = [];

      // Pipe to Firestore if online
      if (navigator.onLine && auth.currentUser) {
        const path = `telemetry`;
        try {
          const colRef = collection(db, 'telemetry');
          await addDoc(colRef, {
            ...batch,
            createdAt: new Date().toISOString()
          });

          // Deliver batched daily health report if warnings accumulated or new day
          const todayStr = new Date().toISOString().split('T')[0];
          if (this.nonCriticalWarningBuffer.length > 0 && this.lastDailyReportDate !== todayStr) {
            const reportColRef = collection(db, 'daily_health_reports');
            await addDoc(reportColRef, {
              date: todayStr,
              userId,
              totalWarningsBuffered: this.nonCriticalWarningBuffer.length,
              warningsSummary: this.nonCriticalWarningBuffer.slice(0, 30),
              createdAt: new Date().toISOString()
            });
            this.nonCriticalWarningBuffer = [];
            this.lastDailyReportDate = todayStr;
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, path);
        }
      } else if (typeof localStorage !== 'undefined') {
        // Fallback: persist last telemetry snapshot locally
        try {
          localStorage.setItem('zalamati_telemetry_last_snapshot', JSON.stringify(batch));
        } catch (e) {
          // Silent catch
        }
      }
    } catch (err) {
      console.warn('[TelemetryLoggerService] Silent telemetry flush caught exception:', err);
    } finally {
      this.isFlushing = false;
    }
  }
}

export const TelemetryLogger = new TelemetryLoggerService();
