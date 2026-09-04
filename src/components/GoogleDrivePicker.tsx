import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Folder,
  FileText,
  Search,
  X,
  ExternalLink,
  RefreshCw,
  FolderOpen,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  FileImage,
  Video,
  FileUp,
  Download,
} from "lucide-react";
import { WorkspaceService, DriveFile } from "../shared/workspace.service";

interface GoogleDrivePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFile: (file: DriveFile) => void;
}

export const GoogleDrivePicker: React.FC<GoogleDrivePickerProps> = ({
  isOpen,
  onClose,
  onSelectFile,
}) => {
  const [token, setToken] = React.useState<string | null>(null);
  const [files, setFiles] = React.useState<DriveFile[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      const activeToken = localStorage.getItem("g_access_token");
      setToken(activeToken);
      if (activeToken) {
        fetchFiles(activeToken);
      }
    }
  }, [isOpen]);

  const fetchFiles = async (accessToken: string, queryStr: string = "") => {
    setLoading(true);
    setError(null);
    try {
      let q = "trashed = false";
      if (queryStr.trim()) {
        const escapedQuery = queryStr
          .replace(/\\/g, "\\\\")
          .replace(/'/g, "\\'")
          .replace(/"/g, '\\"')
          .replace(/[\0\n\r\v\t\b\f]/g, " ")
          .trim();
        q += ` and name contains '${escapedQuery}'`;
      }
      const data = await WorkspaceService.listDriveFiles(accessToken, q);
      setFiles(data);
    } catch (err: any) {
      console.error("Error fetching drive files:", err);
      setError(
        "Failed to list files from Google Drive. Please verify API configuration or token.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      fetchFiles(token, searchQuery);
    }
  };

  const handleRefresh = () => {
    if (token) {
      fetchFiles(token, searchQuery);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes("folder"))
      return <Folder className="w-4 h-4 text-cyan-400" />;
    if (
      mimeType.includes("document") ||
      mimeType.includes("pdf") ||
      mimeType.includes("text")
    ) {
      return <FileText className="w-4 h-4 text-blue-400" />;
    }
    if (mimeType.includes("spreadsheet") || mimeType.includes("sheet")) {
      return <FileSpreadsheet className="w-4 h-4 text-cyan-400" />;
    }
    if (mimeType.includes("image"))
      return <FileImage className="w-4 h-4 text-cyan-400" />;
    if (mimeType.includes("video"))
      return <Video className="w-4 h-4 text-cyan-400" />;
    return <FileText className="w-4 h-4 text-cyan-400" />;
  };

  const handleSelect = (file: DriveFile) => {
    setSelectedFileId(file.id);
    onSelectFile(file);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl bg-[#08151ca8] backdrop-blur-xl border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[520px] text-white"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#1b3b4a] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FolderOpen className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="font-extrabold text-sm tracking-wide">
                  Workspace Drive Picker
                </h3>
                <span className="text-[10px] text-cyan-400/80 font-mono uppercase tracking-wider">
                  Secure Background Connector
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#82a3b2] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar & controls */}
          {token && (
            <div className="p-4 bg-[#03090cf0] border-b border-[#1b3b4a] flex flex-col sm:flex-row items-center gap-3">
              <form onSubmit={handleSearch} className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-cyan-400/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search file name or extension inside Google Drive..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#08151c] border border-[#1b3b4a] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                />
              </form>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="p-2.5 rounded-xl bg-[#08151c] hover:bg-[#153342] border border-[#1b3b4a] text-cyan-400 transition-colors disabled:opacity-45 shrink-0"
                  title="Refresh File List"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Body content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!token ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">
                    Google Drive Credentials Not Found
                  </h4>
                  <p className="text-xs text-[#789cae] max-w-sm">
                    Please authorize Google Drive access by completing the
                    verification flow in settings.
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-cyan-400" />
                </div>
                <p className="text-xs text-cyan-300 max-w-md">{error}</p>
                <button
                  onClick={() => fetchFiles(token, searchQuery)}
                  className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all"
                >
                  Retry Connection
                </button>
              </div>
            ) : loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-3">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                <span className="text-xs text-cyan-300/80 font-mono uppercase tracking-widest">
                  Querying Cloud Files...
                </span>
              </div>
            ) : files.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
                <FileUp className="w-10 h-10 text-cyan-500/30" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    No Files Accessible
                  </h4>
                  <p className="text-[11px] text-[#789cae] mt-1">
                    Upload documents to your Drive first, or grant the requested
                    scopes.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {files.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => handleSelect(file)}
                    className={`p-3.5 rounded-2xl bg-[#0c1a24] border hover:border-cyan-400/40 text-left transition-all flex items-center justify-between gap-3 group relative ${
                      selectedFileId === file.id
                        ? "border-cyan-400 ring-1 ring-cyan-400/30 bg-[#122c3c]"
                        : "border-[#1b3b4a]"
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-[#03090cf0] border border-[#1b3b4a] flex items-center justify-center shrink-0 group-hover:scale-105 transition-all">
                        {getFileIcon(file.mimeType)}
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-bold text-white truncate block group-hover:text-cyan-300 transition-colors">
                          {file.name}
                        </span>
                        <span className="text-[9px] text-[#789cae] truncate block font-mono">
                          {file.mimeType.split(".").pop() || "Drive Document"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {selectedFileId === file.id ? (
                        <CheckCircle className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Download className="w-3.5 h-3.5 text-cyan-400/60 group-hover:text-cyan-300 transition-all" />
                      )}
                      {file.webViewLink && (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 rounded bg-[#03090c] border border-[#1b3b4a] text-gray-400 hover:text-white hover:border-[#22d3ee] transition-all"
                          title="Open in Drive"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-[#1b3b4a] bg-[#03090cf0] flex items-center justify-between text-[10px] text-gray-500 font-mono">
            <span>SCOPE: DRIVE.FILE & DRIVE.METADATA</span>
            <span>SECURE HTTPS TRANSPORT</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
