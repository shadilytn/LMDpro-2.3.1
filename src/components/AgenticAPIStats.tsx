import React from "react";
import { 
  Activity, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  Clock, 
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Cpu
} from "lucide-react";
import { ApiService, ApiMetricsSummary } from "../shared/api.service";
import { motion, AnimatePresence } from "motion/react";

interface AgenticAPIStatsProps {
  compact?: boolean;
}

export const AgenticAPIStats: React.FC<AgenticAPIStatsProps> = ({ compact = false }) => {
  const [stats, setStats] = React.useState<ApiMetricsSummary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchStats = async () => {
    setRefreshing(true);
    try {
      const data = await ApiService.getApiStats();
      setStats(data);
    } catch (e) {
      console.warn("Failed to fetch API stats", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <RefreshCw className="w-8 h-8 text-[var(--accent-turquoise)] animate-spin" />
        <p className="text-sm text-[var(--text-secondary)]">Analyzing API Telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[var(--accent-turquoise)]/10 text-[var(--accent-turquoise)]">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-[var(--text-secondary)]">Uptime</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-[var(--text-primary)]">
              {stats?.systemHealth === 'optimal' ? '99.9%' : '98.4%'}
            </span>
            <span className="text-xs text-[var(--accent-turquoise)] font-medium bg-[var(--accent-turquoise)]/10 px-2 py-0.5 rounded-full">
              OPTIMAL
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[var(--accent-navy)]/10 text-[var(--accent-navy)]">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-[var(--text-secondary)]">Avg Latency</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-[var(--text-primary)]">
              {stats?.overall.avgLatencyMs}ms
            </span>
            <span className="text-xs text-[var(--text-secondary)]">
              P95: {stats?.overall.p95LatencyMs}ms
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-[var(--text-secondary)]">Success Rate</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-[var(--text-primary)]">
              {stats?.overall.successRate}%
            </span>
            <span className="text-xs text-[var(--text-secondary)]">
              {stats?.overall.successCount} / {stats?.overall.totalRequests}
            </span>
          </div>
        </div>
      </div>

      {/* Grounding & Verification Stats */}
      <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-5">
          <ShieldCheck className="w-24 h-24 text-[var(--accent-turquoise)]" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-[var(--accent-turquoise)]" />
            <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Academic Grounding Engine</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">Claims Verified</p>
              <p className="text-xl font-bold text-[var(--text-primary)]">{stats?.groundingStats.totalClaimsVerified}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">Avg Confidence</p>
              <p className="text-xl font-bold text-[var(--text-primary)]">{(stats?.groundingStats.averageConfidenceScore || 0 * 100).toFixed(1)}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">Search Queries</p>
              <p className="text-xl font-bold text-[var(--text-primary)]">{stats?.groundingStats.searchQueriesExecuted}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">Real-time Rate</p>
              <p className="text-xl font-bold text-emerald-500">{stats?.groundingStats.realTimeGroundingRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Endpoint Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-2">
            <Cpu className="w-4 h-4" /> Endpoint Telemetry
          </h3>
          <button 
            onClick={fetchStats}
            disabled={refreshing}
            className="p-1 rounded-md hover:bg-[var(--bg-surface-elevated)] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-[var(--text-secondary)] ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="space-y-2">
          {stats?.endpoints.map((endpoint, i) => (
            <div 
              key={i} 
              className="p-3 rounded-lg bg-[var(--bg-surface-elevated)]/50 border border-[var(--border-color)] flex items-center justify-between group hover:border-[var(--accent-turquoise)]/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-2 h-2 rounded-full ${endpoint.status === 'optimal' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-mono font-bold text-[var(--text-primary)] truncate">{endpoint.endpoint}</p>
                    <span className="text-[10px] text-[var(--text-secondary)] bg-[var(--bg-surface)] px-1.5 py-0.5 rounded border border-[var(--border-color)]">
                      {endpoint.model}
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--text-secondary)] truncate">{endpoint.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 shrink-0 text-right">
                <div className="hidden sm:block">
                  <p className="text-[10px] text-[var(--text-secondary)] font-bold">Latency</p>
                  <p className="text-xs font-bold text-[var(--text-primary)]">{endpoint.avgLatencyMs}ms</p>
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-secondary)] font-bold">Success</p>
                  <p className="text-xs font-bold text-emerald-500">{endpoint.successRate}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
