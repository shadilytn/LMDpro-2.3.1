// Performance Monitoring & Bottleneck Tracking Service
export interface BottleneckLog {
  id: string;
  timestamp: string;
  type: 'FPS_DROP' | 'MEMORY_SPIKE' | 'BACKGROUND_LATENCY' | 'RUNTIME_ERROR';
  metricValue: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

class PerformanceMonitorManager {
  private logs: BottleneckLog[] = [];
  private listeners: Array<() => void> = [];
  private fps: number = 60;
  private memoryUsedMB: number = 0;

  constructor() {
    // Initial dummy baseline log for diagnostics initialization
    this.addLog({
      type: 'BACKGROUND_LATENCY',
      metricValue: '42ms',
      message: 'Background Smart Curation & Frame Engine initialized seamlessly.',
      severity: 'low'
    });
  }

  public addLog(log: Omit<BottleneckLog, 'id' | 'timestamp'>) {
    const newLog: BottleneckLog = {
      ...log,
      id: 'log_' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
    };
    this.logs = [newLog, ...this.logs].slice(0, 20); // Keep last 20
    this.notify();
  }

  public getLogs(): BottleneckLog[] {
    return this.logs;
  }

  public getMetrics() {
    return { fps: this.fps, memoryUsedMB: this.memoryUsedMB };
  }

  public updateMetrics(fps: number, memoryUsedMB: number) {
    this.fps = fps;
    this.memoryUsedMB = memoryUsedMB;

    if (fps < 30) {
      this.addLog({
        type: 'FPS_DROP',
        metricValue: `${Math.round(fps)} FPS`,
        message: 'Frame rate dropped below 30 FPS. Render optimization active.',
        severity: fps < 15 ? 'high' : 'medium'
      });
    }

    if (memoryUsedMB > 120) {
      this.addLog({
        type: 'MEMORY_SPIKE',
        metricValue: `${Math.round(memoryUsedMB)} MB`,
        message: 'Memory heap usage exceeded 120MB threshold. Memory garbage collection recommended.',
        severity: memoryUsedMB > 200 ? 'high' : 'medium'
      });
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }
}

export const PerformanceMonitor = new PerformanceMonitorManager();
