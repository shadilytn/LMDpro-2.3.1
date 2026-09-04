import React, { Component, ErrorInfo } from "react";
import { AlertTriangle, RefreshCw, Terminal } from "lucide-react";
import { PerformanceMonitor } from "../services/performanceMonitor";
import { TelemetryLogger } from "../services/TelemetryLoggerService";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in application:", error, errorInfo);

    // Log runtime exceptions to PerformanceMonitor
    PerformanceMonitor.addLog({
      type: "RUNTIME_ERROR",
      metricValue: "EXCEPTION",
      message: `Fatal: ${error.message || "Unknown runtime error"}. Stack: ${errorInfo.componentStack?.substring(0, 120) || ""}`,
      severity: "high",
    });

    // Pipe stack trace directly to secured remote Firestore collection via TelemetryLogger
    TelemetryLogger.logException(error, errorInfo.componentStack || undefined);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B1015] text-[#e2e8f0] flex flex-col items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-[#141B22] border border-[#1b3b4a]/40 rounded-2xl p-6 shadow-2xl space-y-6 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  System Instability Detected
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  A background process or rendering cycle encountered an
                  unexpected runtime exception.
                </p>
              </div>
            </div>

            {/* Clean interface without developer-facing raw error diagnostics */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="text-[10px] text-[#5b7d8d]">
                Automated error resolved via silent background logs.
              </div>
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded-xl bg-[#0f6674] hover:bg-[#137b8c] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Recover Interface</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
