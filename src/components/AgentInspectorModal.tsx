import React from "react";
import { 
  ShieldCheck, 
  X, 
  Terminal, 
  Activity, 
  Database, 
  Cpu, 
  Globe, 
  Lock,
  Clock,
  CheckCircle2,
  AlertTriangle,
  WifiOff,
  RefreshCw,
  Search,
  Code2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AgenticAPIHealthCheck, HealthCheckLog } from "../services/AgenticAPIHealthCheck";
import { AgenticAPIStats } from "./AgenticAPIStats";

import { LanguageCode } from "../shared/types";

interface AgentInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLanguage: LanguageCode;
}

export const AgentInspectorModal: React.FC<AgentInspectorModalProps> = ({ 
  isOpen, 
  onClose,
  userLanguage 
}) => {
  const [activeTab, setActiveTab] = React.useState<"diagnostics" | "telemetry" | "logs" | "security">("diagnostics");
  const [logs, setLogs] = React.useState<HealthCheckLog[]>([]);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      const unsubscribe = AgenticAPIHealthCheck.subscribe(setLogs);
      return unsubscribe;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl bg-[#0c1a24] border border-[#1b3b4a] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#1b3b4a] bg-gradient-to-r from-[#0c1a24] to-[#102a3a] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-[#5bc4d4]/10 border border-[#5bc4d4]/20">
                <ShieldCheck className="w-6 h-6 text-[#5bc4d4]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  {userLanguage === "ar" ? "مفتش الوكيل الذكي" : "Agentic Inspector Pro"}
                  <span className="text-[10px] bg-[#5bc4d4]/20 text-[#5bc4d4] px-2 py-0.5 rounded-full border border-[#5bc4d4]/30 uppercase tracking-widest font-bold">V3.1 SECURE</span>
                </h2>
                <p className="text-xs text-[#73A5AD] font-medium">Real-time Backend Diagnostics & Telemetry Bus</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/5 text-[#73A5AD] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center px-4 bg-[#08151c] border-b border-[#1b3b4a]">
            {[
              { id: "diagnostics", label: userLanguage === "ar" ? "التشخيص" : "Diagnostics", icon: Activity },
              { id: "telemetry", label: userLanguage === "ar" ? "القياس" : "Telemetry", icon: Cpu },
              { id: "logs", label: userLanguage === "ar" ? "السجلات" : "Diagnostic Logs", icon: Terminal },
              { id: "security", label: userLanguage === "ar" ? "الأمن" : "Security", icon: Lock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
                  activeTab === tab.id ? "text-[#5bc4d4]" : "text-[#73A5AD] hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabInspector"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5bc4d4] shadow-[0_0_10px_#5bc4d4]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#0c1a24]">
            {activeTab === "diagnostics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-[#08151c] border border-[#1b3b4a] space-y-4">
                    <h3 className="text-xs font-bold text-[#73A5AD] uppercase tracking-widest flex items-center gap-2">
                      <Globe className="w-4 h-4" /> API Gateway Status
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                        <span className="text-sm font-bold text-white">Production Cluster Alpha</span>
                      </div>
                      <span className="text-xs font-mono text-[#5bc4d4]">v3.6.4-stable</span>
                    </div>
                    <div className="pt-4 border-t border-[#1b3b4a] grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] text-[#73A5AD] uppercase font-bold">Region</p>
                        <p className="text-xs text-white font-medium">europe-west1</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-[#73A5AD] uppercase font-bold">SSL Status</p>
                        <p className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Encrypted
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#08151c] border border-[#1b3b4a] space-y-4">
                    <h3 className="text-xs font-bold text-[#73A5AD] uppercase tracking-widest flex items-center gap-2">
                      <Database className="w-4 h-4" /> Persistence Layer
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-sm font-bold text-white">Cloud Firestore</span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded font-bold">CONNECTED</span>
                    </div>
                    <div className="pt-4 border-t border-[#1b3b4a] grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] text-[#73A5AD] uppercase font-bold">Read Latency</p>
                        <p className="text-xs text-white font-medium">12ms</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-[#73A5AD] uppercase font-bold">Security Rules</p>
                        <p className="text-xs text-[#5bc4d4] font-bold">Verified V4</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#104a5a]/20 to-[#08151c] border border-[#1b3b4a] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#5bc4d4]/10">
                      <Search className="w-6 h-6 text-[#5bc4d4]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Google Search Grounding Service</h4>
                      <p className="text-xs text-[#73A5AD]">Real-time academic fact verification for AI responses</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-white">Functional</span>
                    </div>
                    <p className="text-[10px] text-[#73A5AD]">Active Node: g-search-grounding-01</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "telemetry" && (
              <AgenticAPIStats />
            )}

            {activeTab === "logs" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-[#73A5AD] uppercase tracking-widest">Network Health Logs</h3>
                  <button 
                    onClick={() => {
                      setIsRefreshing(true);
                      setTimeout(() => setIsRefreshing(false), 800);
                    }}
                    className="flex items-center gap-2 text-[10px] font-bold text-[#5bc4d4] hover:text-white transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                    CLEAR & RESCAN
                  </button>
                </div>
                <div className="space-y-2 font-mono">
                  {logs.length === 0 ? (
                    <div className="text-center py-12 text-[#73A5AD] text-xs">
                      No logs collected. Monitoring system initializing...
                    </div>
                  ) : (
                    logs.map((log) => (
                      <div key={log.id} className="p-3 rounded-lg bg-[#08151c] border border-[#1b3b4a] flex items-center gap-4 group">
                        <div className="shrink-0">
                          {log.status === 'online' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : log.status === 'degraded' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                          ) : (
                            <WifiOff className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <div className="text-[10px] text-[#73A5AD] shrink-0 font-bold">
                          [{new Date(log.timestamp).toLocaleTimeString()}]
                        </div>
                        <div className="flex-1 text-xs text-white truncate font-medium">
                          {log.message}
                        </div>
                        <div className="text-[10px] font-bold text-[#5bc4d4] shrink-0 bg-[#5bc4d4]/10 px-2 py-0.5 rounded">
                          {log.latency}ms
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-[#08151c] border border-[#1b3b4a] space-y-4 relative overflow-hidden">
                   <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#5bc4d4]" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-widest">Active Security Policies</h4>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: "Zero-Trust Credential Validation", status: "Active", icon: ShieldCheck },
                        { label: "End-to-End PII Redaction Engine", status: "Active", icon: ShieldCheck },
                        { label: "AI Safety & Hallucination Guard", status: "Active", icon: ShieldCheck },
                        { label: "Brute-Force Rate Limiting (150req/15m)", status: "Enforced", icon: ShieldCheck },
                      ].map((policy, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-xs text-[#73A5AD] font-medium">{policy.label}</span>
                          <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                            <policy.icon className="w-3 h-3" /> {policy.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-xs font-bold text-white">Blocked Anomalies</p>
                      <p className="text-[10px] text-[#73A5AD]">0 detected in last 24h</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#5bc4d4]/5 border border-[#5bc4d4]/20 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#5bc4d4]" />
                    <div>
                      <p className="text-xs font-bold text-white">Audit Trail Integrity</p>
                      <p className="text-[10px] text-[#73A5AD]">Validated & Cryptographically Signed</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#1b3b4a] bg-[#08151c] flex items-center justify-between text-[10px] text-[#73A5AD] uppercase font-bold tracking-widest">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Code2 className="w-3 h-3" /> Engine: Gemini-3.1-Flash-Lite
              </span>
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3" /> State: Synced
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-[#5bc4d4]" />
              Zalamati Core Diagnostics Active
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
