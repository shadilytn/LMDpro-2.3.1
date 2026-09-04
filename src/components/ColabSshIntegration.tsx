import React from "react";
import {
  Terminal,
  Cpu,
  Server,
  Copy,
  Check,
  Download,
  Play,
  CloudLightning,
  ShieldCheck,
  Radio,
  ExternalLink,
  Code2,
  FolderCode,
  Laptop,
  Layers,
  ChevronRight,
  Info,
  RefreshCw,
  Plus
} from "lucide-react";
import { colabService, ColabSession, DEFAULT_COLAB_SESSIONS } from "../services/colabService";
import { colabRemoteService, ColabConnectionState } from "../services/ColabRemoteService";
import { IntegratedCodeEditor } from "./IntegratedCodeEditor";

interface ColabSshIntegrationProps {
  onSessionSelect?: (session: string) => void;
}

export const ColabSshIntegration: React.FC<ColabSshIntegrationProps> = ({
  onSessionSelect,
}) => {
  const [sessions, setSessions] = React.useState<ColabSession[]>(DEFAULT_COLAB_SESSIONS);
  const [selectedSession, setSelectedSession] = React.useState<string>("colab");
  const [customSessionName, setCustomSessionName] = React.useState<string>("colab");
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  // ColabRemoteService state
  const [connectionState, setConnectionState] = React.useState<ColabConnectionState>(
    colabRemoteService.getState()
  );
  const [reconnectAlert, setReconnectAlert] = React.useState<string | null>(null);

  // Terminal state
  const [terminalCommand, setTerminalCommand] = React.useState<string>("colab ssh");
  const [terminalOutput, setTerminalOutput] = React.useState<string[]>([
    "[colab-ssh] Ready to connect to Google Colaboratory instances.",
    `[colab-ssh] Default session: "${selectedSession}" | Host: colab | User: root`,
    'Type "colab ssh", "nvidia-smi", or select a command above to execute.'
  ]);
  const [isExecuting, setIsExecuting] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<"quickstart" | "config" | "terminal" | "editor" | "sessions" | "ide">("quickstart");

  React.useEffect(() => {
    colabService.fetchStatus().then((res) => {
      if (res.sessions && res.sessions.length > 0) {
        setSessions(res.sessions);
      }
    });

    const unsubscribe = colabRemoteService.subscribe((event) => {
      setConnectionState(event.state);
      if (event.type === "reconnect_attempt") {
        setReconnectAlert(event.message || "Reconnecting...");
      } else if (event.type === "reconnect_success" || event.state === "CONNECTED") {
        setReconnectAlert(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const currentSessionName = customSessionName.trim() || selectedSession || "colab";
  const sshConfigText = colabService.getSshConfig(currentSessionName);
  const directCommand = colabService.getDirectCommand();
  const namedSessionCommand = colabService.getNamedSessionCommand(currentSessionName);
  const proxyCommand = colabService.getOpenSshProxyCommand(currentSessionName);

  const handleRunCommand = async (cmdToRun?: string) => {
    const cmd = cmdToRun || terminalCommand;
    if (!cmd.trim()) return;

    setIsExecuting(true);
    setTerminalOutput((prev) => [...prev, `$ ${cmd}`, "Executing through Google Colab Bridge..."]);

    const res = await colabService.executeCommand(cmd, currentSessionName);
    setTerminalOutput((prev) => [...prev.slice(0, -1), ...res.output]);
    setIsExecuting(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#07131b] via-[#0b1d28] to-[#040b10] border border-[#16384c] p-6 md:p-8 shadow-xl">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
                <CloudLightning className="w-3.5 h-3.5 text-cyan-400" />
                <span>Google Colab SSH Engine & Remote IDE Bridge</span>
              </div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#081822] border border-[#16364a] text-xs font-mono">
                <span
                  className={`w-2 h-2 rounded-full ${
                    connectionState === "CONNECTED"
                      ? "bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400"
                      : connectionState === "RECONNECTING"
                      ? "bg-amber-400 animate-ping"
                      : "bg-cyan-400"
                  }`}
                />
                <span className="text-[#84a9be]">
                  State:{" "}
                  <strong
                    className={
                      connectionState === "CONNECTED"
                        ? "text-emerald-400"
                        : connectionState === "RECONNECTING"
                        ? "text-amber-400"
                        : "text-cyan-300"
                    }
                  >
                    {connectionState}
                  </strong>
                </span>
              </div>
              {reconnectAlert && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>{reconnectAlert}</span>
                </div>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Interactive Colab Shell, Named Sessions & OpenSSH ProxyCommand
            </h2>
            <p className="text-xs md:text-sm text-[#82a6ba] max-w-3xl leading-relaxed">
              Connect local IDEs (VS Code, Cursor, JetBrains) directly into active Google Colab GPU runtimes.
              Features full zero-trust tunneling, pseudo-terminal allocation, and automatic SSH configuration.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab("editor")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#092130] hover:bg-[#103248] border border-cyan-500/30 text-xs font-bold text-cyan-300 transition-all shadow-md active:scale-95"
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Open Code Editor</span>
            </button>
            <button
              onClick={() => colabService.downloadSshConfigFile(currentSessionName)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0e2432] hover:bg-[#16394e] border border-[#1d465e] text-xs font-bold text-[#89b1c9] hover:text-white transition-all shadow-md active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>~/.ssh/config</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("terminal");
                handleRunCommand("colab ssh");
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Connect Shell</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Bar */}
        <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-[#132c3c]">
          {[
            { id: "quickstart", label: "Quick Connect Commands", icon: CloudLightning },
            { id: "editor", label: "In-Browser Code Editor (/content)", icon: Code2 },
            { id: "config", label: "~/.ssh/config Setup", icon: Server },
            { id: "terminal", label: "Interactive Shell Sandbox", icon: Terminal },
            { id: "ide", label: "IDE Remote Guide (VS Code / JetBrains)", icon: Laptop },
            { id: "sessions", label: "GPU Runtimes & Sessions", icon: Cpu }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "bg-[#091720] text-[#7195a8] hover:text-white hover:bg-[#102432] border border-[#163548]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 0: IN-BROWSER CODE EDITOR */}
      {activeTab === "editor" && (
        <div className="space-y-4">
          <IntegratedCodeEditor />
        </div>
      )}

      {/* TAB 1: QUICK CONNECT COMMANDS */}
      {activeTab === "quickstart" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* 1. Direct Interactive Shell */}
            <div className="p-5 rounded-2xl bg-[#09151e] border border-[#17374b] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                    Direct Shell
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-[10px] text-cyan-300 font-mono">
                    Standard
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">Direct Interactive Shell</h3>
                <p className="text-xs text-[#7195a8]">
                  Launches an immediate zero-trust pseudo-terminal directly into the default Colab runtime.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between bg-[#040a0e] p-3 rounded-xl border border-[#112634] font-mono text-xs text-cyan-300">
                  <span className="truncate">colab ssh</span>
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={() => handleCopy(directCommand, "direct_cmd")}
                      className="p-1 hover:text-white transition-colors"
                      title="Copy command"
                    >
                      {copiedKey === "direct_cmd" ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-[#7195a8]" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab("terminal");
                    setTerminalCommand("colab ssh");
                    handleRunCommand("colab ssh");
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#0f2838] hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 text-xs font-bold transition-all border border-[#1a445d]"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Launch in Terminal Sandbox</span>
                </button>
              </div>
            </div>

            {/* 2. Connect to a Named Session */}
            <div className="p-5 rounded-2xl bg-[#09151e] border border-[#17374b] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                    Named Session
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] text-emerald-300 font-mono">
                    Multi-Tenant
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">Connect to a Named Session</h3>
                <p className="text-xs text-[#7195a8]">
                  Target an isolated Colab session or persistent GPU workspace node by session identifier.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSessionName}
                    onChange={(e) => setCustomSessionName(e.target.value)}
                    placeholder="SESSION_NAME"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#040a0e] border border-[#17374b] text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center justify-between bg-[#040a0e] p-3 rounded-xl border border-[#112634] font-mono text-xs text-emerald-300">
                  <span className="truncate">{namedSessionCommand}</span>
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={() => handleCopy(namedSessionCommand, "named_cmd")}
                      className="p-1 hover:text-white transition-colors"
                      title="Copy command"
                    >
                      {copiedKey === "named_cmd" ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-[#7195a8]" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab("terminal");
                    setTerminalCommand(namedSessionCommand);
                    handleRunCommand(namedSessionCommand);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#0f2838] hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 text-xs font-bold transition-all border border-[#1a445d]"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Connect Session</span>
                </button>
              </div>
            </div>

            {/* 3. OpenSSH ProxyCommand for IDEs */}
            <div className="p-5 rounded-2xl bg-[#09151e] border border-[#17374b] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                    IDE Remote
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-[10px] text-amber-300 font-mono">
                    ProxyCommand
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">OpenSSH ProxyCommand</h3>
                <p className="text-xs text-[#7195a8]">
                  Used for IDE remote development (VS Code, JetBrains, Cursor) without external port exposure.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between bg-[#040a0e] p-3 rounded-xl border border-[#112634] font-mono text-[11px] text-amber-300">
                  <span className="truncate">{proxyCommand}</span>
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={() => handleCopy(proxyCommand, "proxy_cmd")}
                      className="p-1 hover:text-white transition-colors"
                      title="Copy command"
                    >
                      {copiedKey === "proxy_cmd" ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-[#7195a8]" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("config")}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#0f2838] hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-xs font-bold transition-all border border-[#1a445d]"
                >
                  <Server className="w-3.5 h-3.5" />
                  <span>View ~/.ssh/config Config</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Setup in Colab Notebook Cell */}
          <div className="p-6 rounded-2xl bg-[#07131b] border border-[#16384c] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  Step 1: Run This In Your Google Colab Notebook Cell
                </h3>
              </div>
              <button
                onClick={() =>
                  handleCopy(
                    `!pip install colab-ssh --upgrade -q\nfrom colab_ssh import launch_ssh_cloudflared\nlaunch_ssh_cloudflared(password="zalamati-2026")`,
                    "colab_cell_code"
                  )
                }
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0f2838] hover:bg-[#15364b] text-xs font-mono text-cyan-300 border border-[#1a445d]"
              >
                {copiedKey === "colab_cell_code" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Cell Code</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-[#03080c] border border-[#0f2330] font-mono text-xs text-cyan-300 overflow-x-auto">
              <code>{`# Run this block in your Google Colab cell to initialize the tunnel
!pip install colab-ssh --upgrade -q
from colab_ssh import launch_ssh_cloudflared
launch_ssh_cloudflared(password="zalamati-2026")`}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: ~/.ssh/config CONFIGURATION */}
      {activeTab === "config" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#09151e] border border-[#16364a] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#143142] pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-cyan-400" />
                  <span>OpenSSH Configuration (~/.ssh/config)</span>
                </h3>
                <p className="text-xs text-[#7195a8] mt-1">
                  Add this block to your local SSH configuration file to enable 1-click IDE and terminal access.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(sshConfigText, "ssh_config_block")}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md"
                >
                  {copiedKey === "ssh_config_block" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-950" />
                      <span>Copied Config!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy ~/.ssh/config</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => colabService.downloadSshConfigFile(currentSessionName)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0f2838] hover:bg-[#183d54] text-cyan-300 font-bold text-xs transition-all border border-[#1a445d]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
              </div>
            </div>

            {/* Config Snippet Box */}
            <div className="relative">
              <pre className="p-5 rounded-xl bg-[#03070b] border border-[#102432] font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
                <code>{sshConfigText}</code>
              </pre>
            </div>

            {/* Quick Append Commands for OS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#050c12] border border-[#102432] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                    Linux & macOS Append
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(colabService.getBashAppendConfigCommand(currentSessionName), "bash_append")
                    }
                    className="text-xs font-mono text-cyan-300 hover:text-white flex items-center gap-1"
                  >
                    {copiedKey === "bash_append" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="p-2.5 rounded-lg bg-[#020508] border border-[#0d1e2a] font-mono text-[11px] text-[#86aac0] overflow-x-auto">
                  <code>{colabService.getBashAppendConfigCommand(currentSessionName)}</code>
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-[#050c12] border border-[#102432] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-amber-400" />
                    Windows PowerShell Append
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(colabService.getPowerShellAppendConfigCommand(currentSessionName), "ps_append")
                    }
                    className="text-xs font-mono text-amber-300 hover:text-white flex items-center gap-1"
                  >
                    {copiedKey === "ps_append" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="p-2.5 rounded-lg bg-[#020508] border border-[#0d1e2a] font-mono text-[11px] text-[#86aac0] overflow-x-auto">
                  <code>{colabService.getPowerShellAppendConfigCommand(currentSessionName)}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INTERACTIVE TERMINAL SANDBOX */}
      {activeTab === "terminal" && (
        <div className="p-6 rounded-2xl bg-[#09151e] border border-[#16364a] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#143142] pb-4">
            <div className="flex items-center gap-2.5">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Interactive Colab Terminal Sandbox</h3>
                <p className="text-xs text-[#7195a8]">
                  Run commands directly against the simulated or connected Google Colaboratory environment.
                </p>
              </div>
            </div>

            {/* Quick Command Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                "colab ssh",
                `colab ssh -s ${currentSessionName}`,
                "colab status",
                "nvidia-smi",
                "python3 -c \"import torch; print(torch.cuda.is_available())\"",
                "ls -la /content"
              ].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => {
                    setTerminalCommand(cmd);
                    handleRunCommand(cmd);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#061017] hover:bg-[#102534] text-[11px] font-mono text-cyan-300 border border-[#143244] transition-all"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>

          {/* Command Input Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-2.5 text-xs font-mono text-cyan-400 font-bold">$</span>
              <input
                type="text"
                value={terminalCommand}
                onChange={(e) => setTerminalCommand(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRunCommand()}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#040a0e] border border-[#16384c] font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-400"
                placeholder="colab ssh -s SESSION"
              />
            </div>
            <button
              onClick={() => handleRunCommand()}
              disabled={isExecuting}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-all flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isExecuting ? "Executing..." : "Run"}</span>
            </button>
          </div>

          {/* Terminal Screen Output */}
          <div className="p-4 rounded-xl bg-[#020508] border border-[#0d1f2b] font-mono text-xs text-cyan-400 space-y-1 min-h-[260px] max-h-[400px] overflow-y-auto">
            {terminalOutput.map((line, idx) => (
              <div
                key={idx}
                className={
                  line.startsWith("$")
                    ? "text-cyan-300 font-bold"
                    : line.includes("ERROR") || line.includes("failed")
                    ? "text-red-400"
                    : line.includes("root@colab")
                    ? "text-emerald-400 font-bold"
                    : "text-[#8cb1c4]"
                }
              >
                {line}
              </div>
            ))}
            {isExecuting && (
              <div className="flex items-center gap-2 text-cyan-400 animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Streaming response...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: IDE REMOTE GUIDE */}
      {activeTab === "ide" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-2xl bg-[#09151e] border border-[#16364a] space-y-3">
            <div className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Visual Studio Code / Cursor</h3>
            </div>
            <ol className="text-xs text-[#82a6ba] space-y-2 list-decimal list-inside leading-relaxed">
              <li>Install the official <strong className="text-white">Remote - SSH</strong> extension by Microsoft.</li>
              <li>
                Append the config snippet from the <span className="text-cyan-300 font-mono">~/.ssh/config</span> tab into your local configuration.
              </li>
              <li>
                Open the Command Palette (<kbd className="px-1.5 py-0.5 rounded bg-[#040a0e] text-cyan-300 font-mono text-[10px]">Ctrl+Shift+P</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-[#040a0e] text-cyan-300 font-mono text-[10px]">Cmd+Shift+P</kbd>).
              </li>
              <li>Type <strong className="text-white">Remote-SSH: Connect to Host...</strong> and select <span className="text-cyan-300 font-mono">colab</span>.</li>
              <li>Open directory <span className="text-cyan-300 font-mono">/content</span> to access your notebooks, datasets, and scripts with full GPU acceleration!</li>
            </ol>
          </div>

          <div className="p-5 rounded-2xl bg-[#09151e] border border-[#16364a] space-y-3">
            <div className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">JetBrains Gateway (PyCharm / IntelliJ)</h3>
            </div>
            <ol className="text-xs text-[#82a6ba] space-y-2 list-decimal list-inside leading-relaxed">
              <li>Launch <strong className="text-white">JetBrains Gateway</strong>.</li>
              <li>Under the <strong className="text-white">SSH</strong> section, select "New Connection".</li>
              <li>Choose the configured host alias <span className="text-amber-300 font-mono">colab</span> from your SSH configuration.</li>
              <li>Click "Check Connection and Continue". Gateway will automatically deploy the IDE backend into <span className="text-amber-300 font-mono">/content/.jb</span>.</li>
            </ol>
          </div>
        </div>
      )}

      {/* TAB 5: SESSIONS & HARDWARE DIAGNOSTICS */}
      {activeTab === "sessions" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sessions.map((sess) => {
              const isSelected = sess.id === currentSessionName;
              return (
                <div
                  key={sess.id}
                  onClick={() => {
                    setSelectedSession(sess.id);
                    setCustomSessionName(sess.id);
                    if (onSessionSelect) onSessionSelect(sess.id);
                  }}
                  className={`p-5 rounded-2xl transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-[#0b1f2b] border-cyan-400 shadow-lg shadow-cyan-500/10"
                      : "bg-[#07131b] border-[#143244] hover:bg-[#0c1f2c]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-300">{sess.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                        sess.status === "online"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {sess.status.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2">{sess.name}</h4>
                  <div className="text-xs text-[#7195a8] mt-1 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{sess.gpu}</span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#122e3e] space-y-1.5 text-[11px] text-[#7195a8] font-mono">
                    <div className="flex justify-between">
                      <span>Uptime:</span>
                      <span className="text-white">{sess.uptime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CUDA:</span>
                      <span className="text-cyan-300">{sess.cudaVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ports:</span>
                      <span className="text-white">
                        {sess.portForwarding.map((p) => p.localPort).join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
