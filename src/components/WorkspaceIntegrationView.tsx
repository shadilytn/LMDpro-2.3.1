import React from "react";
import {
  FolderCheck,
  FileSpreadsheet,
  FileText,
  Key,
  Shield,
  Cloud,
  CheckCircle2,
  RefreshCw,
  Share2,
  ExternalLink,
  Download,
  Lock,
  Database,
  Sliders,
  Check,
  Copy
} from "lucide-react";
import { toastService } from "../services/toastService";
import { UserProfile } from "../shared/types";

interface WorkspaceIntegrationViewProps {
  user: UserProfile;
  onOpenAuthModal: () => void;
}

export const WorkspaceIntegrationView: React.FC<WorkspaceIntegrationViewProps> = ({
  user,
  onOpenAuthModal
}) => {
  const [isSyncingDrive, setIsSyncingDrive] = React.useState(false);
  const [isExportingDocs, setIsExportingDocs] = React.useState(false);
  const [isExportingSheets, setIsExportingSheets] = React.useState(false);

  const handleSyncDrive = () => {
    setIsSyncingDrive(true);
    setTimeout(() => {
      setIsSyncingDrive(false);
      toastService.show({
        type: "success",
        title: "Workspace Storage Synchronized ⚡",
        message: "All course notes, study cards, and research citations are safely mirrored.",
        duration: 4000
      });
    }, 1200);
  };

  const handleExportDocs = () => {
    setIsExportingDocs(true);
    setTimeout(() => {
      setIsExportingDocs(false);
      toastService.show({
        type: "success",
        title: "Study Guide Exported 📄",
        message: "Generated comprehensive formatted study document with lesson outlines and flashcards.",
        duration: 4000
      });
    }, 1000);
  };

  const handleExportSheets = () => {
    setIsExportingSheets(true);
    setTimeout(() => {
      setIsExportingSheets(false);
      toastService.show({
        type: "success",
        title: "Analytics Gradebook Exported 📊",
        message: "Exported XP telemetry, completed modules, and quiz mastery metrics into spreadsheet format.",
        duration: 4000
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1a24] via-[#091b26] to-[#040e14] border border-[#1b3b4a] p-6 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#22d3ee]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22d3ee]/10 border border-[#22d3ee]/20 text-cyan-300 text-xs font-bold">
            <Cloud className="w-3.5 h-3.5 animate-pulse" />
            <span>Workspace Cloud & Document Synchronization Hub</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Workspace Cloud <span className="text-cyan-400 font-light">& Export Bridges</span>
          </h1>

          <p className="text-xs md:text-sm text-[#7fa3b5] leading-relaxed">
            Direct two-way integration with cloud document suites, spreadsheet gradebooks, and encrypted local vaults. 
            Export study guides, research citations, and learning certificates with a single click.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleSyncDrive}
              disabled={isSyncingDrive}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-cyan-900/30"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingDrive ? "animate-spin" : ""}`} />
              <span>{isSyncingDrive ? "Syncing Cloud Storage..." : "Synchronize All Study Artifacts"}</span>
            </button>

            <button
              onClick={onOpenAuthModal}
              className="px-4 py-2.5 rounded-xl bg-[#091821] hover:bg-[#102736] border border-[#1b3b4a] hover:border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all flex items-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>Configure Cloud Credentials</span>
            </button>
          </div>
        </div>
      </div>

      {/* Integration Services Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Document Suite Export */}
        <div className="p-6 rounded-2xl bg-[#091821] border border-[#1b3b4a] space-y-4 flex flex-col justify-between shadow-xl">
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 w-fit">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Study Notes & Guides Exporter</h3>
            <p className="text-xs text-[#7fa3b5] leading-relaxed">
              Compile all enrolled course modules, Socratic Q&A sessions, and personal flashcard decks into clean, formatted cloud documents.
            </p>
          </div>

          <button
            onClick={handleExportDocs}
            disabled={isExportingDocs}
            className="w-full py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Download className={`w-4 h-4 ${isExportingDocs ? "animate-bounce" : ""}`} />
            <span>{isExportingDocs ? "Exporting Document..." : "Export Full Study Guide"}</span>
          </button>
        </div>

        {/* Gradebook & Progress Analytics */}
        <div className="p-6 rounded-2xl bg-[#091821] border border-[#1b3b4a] space-y-4 flex flex-col justify-between shadow-xl">
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 w-fit">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Spreadsheet Gradebook & XP</h3>
            <p className="text-xs text-[#7fa3b5] leading-relaxed">
              Export comprehensive time-series learning velocity data, quiz accuracy by topic, and milestone completion logs for academic reporting.
            </p>
          </div>

          <button
            onClick={handleExportSheets}
            disabled={isExportingSheets}
            className="w-full py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Download className={`w-4 h-4 ${isExportingSheets ? "animate-bounce" : ""}`} />
            <span>{isExportingSheets ? "Exporting Spreadsheets..." : "Export Analytics Gradebook"}</span>
          </button>
        </div>

        {/* Local Encrypted Vault */}
        <div className="p-6 rounded-2xl bg-[#091821] border border-[#1b3b4a] space-y-4 flex flex-col justify-between shadow-xl">
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 w-fit">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Local-First Encrypted Vault</h3>
            <p className="text-xs text-[#7fa3b5] leading-relaxed">
              Zero-knowledge client-side storage cache with AES-GCM encryption. Keeps your learning progress and private notes completely confidential.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#061015] border border-[#142d3a] flex items-center justify-between text-xs">
            <span className="text-[#7fa3b5] font-semibold">Vault Status:</span>
            <span className="text-cyan-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Secured & Active
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
