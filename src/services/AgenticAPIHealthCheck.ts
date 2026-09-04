import { ApiService } from "../shared/api.service";
import { db } from "./firebase";
import { doc, getDocFromServer } from "firebase/firestore";

export interface HealthCheckLog {
  id: string;
  timestamp: string;
  status: 'online' | 'degraded' | 'offline';
  latency: number;
  message: string;
}

export class AgenticAPIHealthCheck {
  private static logs: HealthCheckLog[] = [];
  private static checkInterval: NodeJS.Timeout | null = null;
  private static subscribers: ((logs: HealthCheckLog[]) => void)[] = [];

  static startMonitoring(intervalMs: number = 60000) {
    if (this.checkInterval) return;
    
    // Initial check
    this.performCheck();
    
    this.checkInterval = setInterval(() => {
      this.performCheck();
    }, intervalMs);
  }

  static stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  static subscribe(callback: (logs: HealthCheckLog[]) => void) {
    this.subscribers.push(callback);
    callback(this.logs);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== callback);
    };
  }

  static getLogs() {
    return this.logs;
  }

  private static async performCheck() {
    const start = performance.now();
    let status: 'online' | 'degraded' | 'offline' = 'online';
    let message = 'API systems operational';
    
    try {
      const res = await fetch('/api/health');
      const latency = Math.round(performance.now() - start);
      
      // Check Firestore connectivity with improved resilience
      let firestoreStatus: 'online' | 'offline' = 'online';
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('timeout')), 5000)
        );
        await Promise.race([
          getDocFromServer(doc(db, 'test', 'healthcheck')),
          timeoutPromise
        ]);
      } catch (err) {
        console.warn('[HealthCheck] Firestore probe failed:', err);
        firestoreStatus = 'offline';
      }

      if (!res.ok) {
        status = 'degraded';
        message = `API returned status ${res.status}`;
      } else {
        const data = await res.json();
        if (!data.hasGeminiKey) {
          status = 'degraded';
          message = 'API online but Gemini Key missing';
        } else if (firestoreStatus === 'offline') {
          status = 'degraded';
          message = 'API online but Firestore unreachable (Offline mode)';
        } else if (latency > 1000) {
          status = 'degraded';
          message = 'High latency detected';
        }
      }

      this.addLog({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        status,
        latency,
        message
      });
    } catch (err) {
      this.addLog({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'offline',
        latency: 0,
        message: 'Network error: Failed to reach API proxy'
      });
    }
  }

  private static addLog(log: HealthCheckLog) {
    this.logs = [log, ...this.logs].slice(0, 50); // Keep last 50
    this.subscribers.forEach(s => s(this.logs));
  }
}
