import React from "react";
import { UserProfile } from "../shared/types";
import {
  Briefcase,
  Globe2,
  Server,
  ShieldAlert,
  Cpu,
  Radio,
  Zap,
  Activity,
  Key,
  Bot,
  Brain,
  ShieldCheck,
  Sparkles,
  Lock,
  Layers,
  Terminal,
  CheckCircle2,
  RefreshCw,
  Sliders,
  FileCode,
} from "lucide-react";

interface EnterpriseDashboardProps {
  user: UserProfile;
  onOpenAITutor?: () => void;
  onOpenSubscriptions?: () => void;
  onOpenAgentInspector?: () => void;
}

export const EnterpriseDashboard: React.FC<EnterpriseDashboardProps> = ({
  user,
  onOpenAITutor,
  onOpenSubscriptions,
  onOpenAgentInspector,
}) => {
  const [activeTab, setActiveTab] = React.useState<
    | "swarms"
    | "private_rag"
    | "blueprint"
    | "sso_security"
    | "iam"
    | "deployments"
  >("swarms");

  // Custom Blueprint State
  const [systemBlueprint, setSystemBlueprint] =
    React.useState(`You are Zalamati Enterprise Copilot, representing the Global AI & Tech Academy.
- Enforce strict SOC2 Type II data privacy and zero PII leakage.
- Provide step-by-step mathematical reasoning and executable TypeScript/Python code snippets.
- Tailor explanations to enterprise software engineering standards.`);
  const [blueprintSaved, setBlueprintSaved] = React.useState(false);

  // IAM Access Rules State
  const [iamUsers, setIamUsers] = React.useState([
    {
      id: "usr-1",
      name: "Alexander Wright",
      email: "a.wright@enterprise.com",
      role: "Super Admin",
      status: "Active",
      scope: "Global Access",
    },
    {
      id: "usr-2",
      name: "Sophia Chen",
      email: "s.chen@enterprise.com",
      role: "Security Auditor",
      status: "Active",
      scope: "ReadOnly Logs",
    },
    {
      id: "usr-3",
      name: "Marcus Vance",
      email: "m.vance@enterprise.com",
      role: "Developer",
      status: "Active",
      scope: "API & RAG Keys",
    },
    {
      id: "usr-4",
      name: "Elena Rostova",
      email: "e.rostova@enterprise.com",
      role: "Group Leader",
      status: "Inactive",
      scope: "Department Analytics",
    },
  ]);
  const [customRoles, setCustomRoles] = React.useState([
    {
      name: "DevOps Architect",
      permissions: ["Deploy Clusters", "Configure VPC", "Rotate Keys"],
    },
    {
      name: "Security Auditor",
      permissions: ["Access SOC2 Logs", "Verify Compliance"],
    },
  ]);
  const [newRoleName, setNewRoleName] = React.useState("");
  const [newRolePerms, setNewRolePerms] = React.useState<string>(
    "Deploy Clusters, Rotate Keys",
  );

  // Multi-Region Global Deployments State
  const [activeClusters, setActiveClusters] = React.useState([
    {
      id: "cl-1",
      region: "us-central1 (Iowa)",
      status: "Optimal",
      instances: "24 active / Max 100",
      load: "1.24s avg latency",
      ingress: "HTTPS VPC Peer",
    },
    {
      id: "cl-2",
      region: "europe-west3 (Frankfurt)",
      status: "Optimal",
      instances: "18 active / Max 100",
      load: "1.45s avg latency",
      ingress: "HTTPS Direct",
    },
    {
      id: "cl-3",
      region: "asia-east1 (Taiwan)",
      status: "Optimal",
      instances: "12 active / Max 100",
      load: "1.82s avg latency",
      ingress: "Private VPC Hub",
    },
  ]);
  const [deployingZone, setDeployingZone] = React.useState<string | null>(null);
  const [deploymentLog, setDeploymentLog] = React.useState<string[]>([
    "VPC Traffic Rules Verified successfully.",
    "SAML Security Assertion Validated.",
    "Docker Engine Base Layer cached - cold start optimized.",
    "Deploy initialized on 3 global zones simultaneously.",
  ]);

  // Agent Swarm Log State
  const [swarmLogs, setSwarmLogs] = React.useState([
    {
      id: "1",
      agent: "Deep RAG Vectorizer Swarm",
      status: "Active",
      load: "1,420 vectors/sec",
      node: "Cloud Run us-central1",
    },
    {
      id: "2",
      agent: "SOC2 PII Redaction Audit Agent",
      status: "Active",
      load: "0.2ms latency",
      node: "Nano Banana Pro Edge",
    },
    {
      id: "3",
      agent: "Automated Competency Evaluation Swarm",
      status: "Active",
      load: "240 tests/min",
      node: "Gemini 3.1 Flash",
    },
    {
      id: "4",
      agent: "Enterprise SAML SSO Gateway Guard",
      status: "Active",
      font: "Okta / Azure AD",
      node: "Security Boundary",
    },
  ]);

  const handleSaveBlueprint = () => {
    setBlueprintSaved(true);
    setTimeout(() => setBlueprintSaved(false), 2500);
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    setCustomRoles((prev) => [
      ...prev,
      {
        name: newRoleName,
        permissions: newRolePerms.split(",").map((p) => p.trim()),
      },
    ]);
    setNewRoleName("");
  };

  const handleTriggerDeploy = (region: string) => {
    setDeployingZone(region);
    const logMsg = `Canary Rollout started for ${region} cluster...`;
    setDeploymentLog((prev) => [logMsg, ...prev]);
    setTimeout(() => {
      setDeployingZone(null);
      setDeploymentLog((prev) => [
        `✓ Canary Rollout completed for ${region}. Cluster is healthy!`,
        ...prev,
      ]);
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Enterprise Tier Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d2a38] via-[#0a1820] to-[#0a1820] border border-cyan-400/50 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                Enterprise Global Tier ($1,299/mo)
              </span>
              <span className="text-xs text-[#82a4b3] bg-[#071319] px-2.5 py-0.5 rounded-full border border-[#1b3a49]">
                Seats: <strong>25,000 / Unlimited</strong>
              </span>
              <span className="text-xs text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/30 font-mono">
                99.99% SLA Active
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise Global AI Command Center
            </h1>

            <p className="text-xs sm:text-sm text-[#8bb1c2] leading-relaxed">
              Full control plane for Antigravity multi-agent swarms, private
              document RAG vector vaults, custom AI prompt blueprints, SAML 2.0
              SSO, and SOC2 audit logging.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
            <button
              onClick={onOpenSubscriptions}
              className="px-4 py-2.5 rounded-xl bg-[#142a35] hover:bg-[#1c3846] text-white text-xs font-semibold border border-[#1e3e4f] transition-all"
            >
              Manage Tier Plan
            </button>
            {onOpenAgentInspector && (
              <button
                onClick={onOpenAgentInspector}
                className="px-4 py-2.5 rounded-xl bg-[#0f6674] hover:bg-[#137b8c] text-white text-xs font-semibold shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2"
              >
                <Bot className="w-3.5 h-3.5 text-cyan-300" />
                <span>Inspect Agent Swarms</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Key Enterprise KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-1">
          <div className="flex justify-between text-[#82a4b3] text-xs">
            <span>Global Active Seats</span>
            <Globe2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            25,000 / Unlimited
          </div>
          <p className="text-[11px] text-cyan-400">
            Multi-Region Enterprise Tier
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-1">
          <div className="flex justify-between text-[#82a4b3] text-xs">
            <span>Gemini Token Throughput</span>
            <Cpu className="w-4 h-4 text-cyan-300" />
          </div>
          <div className="text-2xl font-extrabold text-white">4.2M / day</div>
          <p className="text-[11px] text-cyan-400">Zero Throttling Enforced</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-1">
          <div className="flex justify-between text-[#82a4b3] text-xs">
            <span>Cluster Health & SLA</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-300">
            99.99% SLA
          </div>
          <p className="text-[11px] text-cyan-400">
            Cloud Run Multi-Zone Active
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-1">
          <div className="flex justify-between text-[#82a4b3] text-xs">
            <span>Security & Compliance</span>
            <ShieldAlert className="w-4 h-4 text-cyan-300" />
          </div>
          <div className="text-2xl font-extrabold text-white">SOC2 Type II</div>
          <p className="text-[11px] text-cyan-400">Zero PII Leakage Verified</p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1c3c4d] pb-2 overflow-x-auto text-xs">
        {[
          { id: "swarms", label: "Antigravity Multi-Agent Swarms", icon: Bot },
          {
            id: "private_rag",
            label: "Private RAG Vector Vault & IP Isolation",
            icon: Lock,
          },
          {
            id: "blueprint",
            label: "Enterprise AI System Blueprint",
            icon: Sliders,
          },
          {
            id: "sso_security",
            label: "SAML 2.0 SSO & Security Logs",
            icon: Key,
          },
          {
            id: "iam",
            label: "IAM, Roles & Admin Access Control",
            icon: ShieldCheck,
          },
          {
            id: "deployments",
            label: "Global Cloud Deployments",
            icon: Server,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all shrink-0 ${
                isActive
                  ? "bg-[#0f6674] text-white shadow-md shadow-cyan-950/40 border border-cyan-500/40"
                  : "bg-[#0a1820] text-[#7ea1b2] hover:text-white hover:bg-[#122631] border border-[#1c3c4d]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: Antigravity Multi-Agent Swarms */}
      {activeTab === "swarms" && (
        <div className="p-6 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                Antigravity Multi-Agent Background Swarm Mesh
              </h2>
              <p className="text-xs text-[#82a4b3] mt-1">
                Monitors real-time autonomous background processes handling RAG
                indexing, code verification, and security compliance.
              </p>
            </div>

            {onOpenAgentInspector && (
              <button
                onClick={onOpenAgentInspector}
                className="px-4 py-2 rounded-xl bg-[#0f6674] hover:bg-[#137b8c] text-white text-xs font-semibold flex items-center gap-2"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-300" />
                <span>Open Swarm Terminal</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {swarmLogs.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-xl bg-[#08131a] border border-[#1d3d4c] space-y-2"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">{s.agent}</span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-[10px]">
                    {s.status}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[#81a4b4]">
                  <span>
                    Load: <strong className="text-cyan-300">{s.load}</strong>
                  </span>
                  <span>
                    Node: <strong className="text-white">{s.node}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: Private RAG Vector Vault */}
      {activeTab === "private_rag" && (
        <div className="p-6 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyan-400" />
              Private Document Vault & IP Isolation RAG Engine
            </h2>
            <p className="text-xs text-[#82a4b3] mt-1">
              Store sensitive enterprise documentation, proprietary software
              codebases, and compliance standards. Vectors are isolated to your
              enterprise tenant with zero model retraining.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#08131a] border border-[#1d3d4c] space-y-2">
              <div className="font-semibold text-white">Indexed Documents</div>
              <div className="text-2xl font-bold text-cyan-300">
                148,200 Files
              </div>
              <p className="text-[11px] text-[#7193a3]">
                Gemini Embedding 2 Vectorized
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#08131a] border border-[#1d3d4c] space-y-2">
              <div className="font-semibold text-white">
                Data Leakage Prevention
              </div>
              <div className="text-2xl font-bold text-cyan-300">
                100% Isolated
              </div>
              <p className="text-[11px] text-[#7193a3]">
                Zero public training fallback
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#08131a] border border-[#1d3d4c] space-y-2">
              <div className="font-semibold text-white">
                Search Retrieval Latency
              </div>
              <div className="text-2xl font-bold text-white">18 ms Avg</div>
              <p className="text-[11px] text-[#7193a3]">HNSW Vector Indexing</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: Enterprise AI System Blueprint */}
      {activeTab === "blueprint" && (
        <div className="p-6 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              Custom Enterprise System Prompt Blueprint
            </h2>
            <p className="text-xs text-[#82a4b3] mt-1">
              Configure system instructions enforced across all 25,000 employee
              seats and AI Tutor sessions.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <textarea
              value={systemBlueprint}
              onChange={(e) => setSystemBlueprint(e.target.value)}
              className="w-full h-36 p-3.5 rounded-xl bg-[#08131a] border border-[#1d3d4c] text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
            />

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveBlueprint}
                className="px-5 py-2.5 rounded-xl bg-[#0f6674] hover:bg-[#137b8c] text-white font-semibold text-xs shadow-md shadow-cyan-950/50 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                <span>Save Blueprint Instruction</span>
              </button>

              {blueprintSaved && (
                <span className="text-xs text-cyan-300 font-semibold animate-fade-in">
                  Blueprint updated across all enterprise seats!
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: SAML 2.0 SSO & Security Logs */}
      {activeTab === "sso_security" && (
        <div className="p-6 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-cyan-400" />
              SAML 2.0 / Okta SSO & Security Audit Trail
            </h2>
            <p className="text-xs text-[#82a4b3] mt-1">
              Enterprise Identity Provider integration status and real-time
              security logs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#08131a] border border-[#1d3d4c] space-y-2">
              <div className="font-semibold text-white">
                Identity Provider (IdP):
              </div>
              <div className="text-sm font-bold text-cyan-300">
                Okta / Azure AD Connected
              </div>
              <p className="text-[11px] text-[#7193a3]">
                SAML 2.0 Single Sign-On Enforced
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#08131a] border border-[#1d3d4c] space-y-2">
              <div className="font-semibold text-white">SOC2 Audit Logging</div>
              <div className="text-sm font-bold text-cyan-300">
                Continuous Logging Active
              </div>
              <p className="text-[11px] text-[#7193a3]">
                Exportable to Splunk & Datadog
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: IAM, Roles & Admin Access Control */}
      {activeTab === "iam" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
            {/* Left: User access list */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  IAM Identity & Granular Role Governance
                </h2>
                <p className="text-xs text-[#82a4b3] mt-1">
                  Manage active administrator identities, assign scopes, and
                  audit authorization status.
                </p>
              </div>

              <div className="space-y-3">
                {iamUsers.map((usr) => (
                  <div
                    key={usr.id}
                    className="p-4 rounded-xl bg-[#08131a] border border-[#1d3d4c] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {usr.name}
                        </span>
                        <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/20 font-mono">
                          {usr.role}
                        </span>
                      </div>
                      <p className="text-[#81a4b4] text-[11px] font-mono">
                        {usr.email} • scope: {usr.scope}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 justify-between sm:justify-end">
                      <button
                        onClick={() => {
                          setIamUsers((prev) =>
                            prev.map((u) =>
                              u.id === usr.id
                                ? {
                                    ...u,
                                    status:
                                      u.status === "Active"
                                        ? "Suspended"
                                        : "Active",
                                  }
                                : u,
                            ),
                          );
                        }}
                        className={`px-3 py-1.5 rounded-lg font-bold text-[10px] border transition-all ${
                          usr.status === "Active"
                            ? "bg-[#153123] text-cyan-400 border-cyan-500/35 hover:bg-[#1a3d2c]"
                            : "bg-[#3b1212] text-cyan-400 border-cyan-500/35 hover:bg-[#4a1717]"
                        }`}
                      >
                        {usr.status === "Active" ? "Active ✓" : "Suspended ✗"}
                      </button>

                      <select
                        value={usr.role}
                        onChange={(e) => {
                          const newRole = e.target.value;
                          setIamUsers((prev) =>
                            prev.map((u) =>
                              u.id === usr.id ? { ...u, role: newRole } : u,
                            ),
                          );
                        }}
                        className="bg-[#0f2029] text-white border border-[#1d3d4c] rounded-lg p-1 text-[11px] focus:outline-none focus:border-cyan-400"
                      >
                        <option value="Super Admin">Super Admin</option>
                        <option value="Group Leader">Group Leader</option>
                        <option value="Developer">Developer</option>
                        <option value="Security Auditor">Auditor</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Custom Role Policy Builder */}
            <div className="p-6 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Define Role Policy
                </h3>
                <p className="text-[11px] text-[#82a4b3]">
                  Draft security policies and instantiate custom RBAC roles.
                </p>
              </div>

              <form onSubmit={handleCreateRole} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-slate-300 font-semibold text-[11px]">
                    Role Identifier:
                  </label>
                  <input
                    type="text"
                    required
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="e.g. Compliance Officer"
                    className="w-full p-2.5 rounded-xl bg-[#08131a] border border-[#1d3d4c] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-300 font-semibold text-[11px]">
                    Grants / Scopes (comma-separated):
                  </label>
                  <input
                    type="text"
                    required
                    value={newRolePerms}
                    onChange={(e) => setNewRolePerms(e.target.value)}
                    placeholder="Deploy Clusters, Access Logs, RAG Index"
                    className="w-full p-2.5 rounded-xl bg-[#08131a] border border-[#1d3d4c] text-white focus:outline-none focus:border-cyan-400 font-mono text-[11px]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-[#0f6674] hover:bg-[#137b8c] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Instantiate Role</span>
                </button>
              </form>

              <div className="border-t border-[#1c3c4d] pt-3 space-y-2">
                <div className="text-[10px] text-[#7da4b8] uppercase font-bold tracking-wider">
                  Active Custom Policies:
                </div>
                <div className="space-y-1.5 font-mono text-[10px]">
                  {customRoles.map((role, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[#08131a] border border-[#1d3d4c] space-y-1"
                    >
                      <div className="text-cyan-300 font-bold">{role.name}</div>
                      <div className="text-slate-400 text-[9px]">
                        Permissions: {role.permissions.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: Multi-Region Global Deployments */}
      {activeTab === "deployments" && (
        <div className="space-y-6 animate-fade-in text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Global cluster status */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-cyan-400" />
                  Global Cluster Deployments & Autoscaling
                </h2>
                <p className="text-xs text-[#82a4b3] mt-1">
                  Orchestrate serverless node clusters powered by Cloud Run and
                  protected by secure VPC ingress.
                </p>
              </div>

              <div className="space-y-3">
                {activeClusters.map((cl) => (
                  <div
                    key={cl.id}
                    className="p-4 rounded-xl bg-[#08131a] border border-[#1d3d4c] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-sm">
                          {cl.region}
                        </span>
                        <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded-full font-bold">
                          {cl.status}
                        </span>
                      </div>
                      <p className="text-[#81a4b4] text-[11px] font-mono">
                        Ingress Rules: {cl.ingress} • load: {cl.load}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right shrink-0">
                        <div className="text-[#81a4b4] text-[10px]">
                          Autoscaling Scale
                        </div>
                        <div className="font-bold text-slate-200">
                          {cl.instances}
                        </div>
                      </div>

                      <button
                        onClick={() => handleTriggerDeploy(cl.region)}
                        disabled={deployingZone !== null}
                        className="px-3 py-2 rounded-xl bg-[#112a36] hover:bg-[#183a4a] text-cyan-300 text-[11px] font-bold border border-cyan-500/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        {deployingZone === cl.region ? (
                          <>
                            <div className="w-3 h-3 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin" />
                            <span>Deploying...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Canary Rollout</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cloud Deploy logs Terminal */}
            <div className="p-6 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-3">
              <h3 className="font-bold text-white flex items-center gap-1.5 text-base">
                <Terminal className="w-4 h-4 text-cyan-400" />
                Live Deployment Stream
              </h3>
              <p className="text-[11px] text-[#7fa4b8]">
                Real-time compilation logs for cloud-deployed agentic services.
              </p>

              <div className="bg-[#071116] p-4 rounded-xl border border-[#1a3847] font-mono text-[10px] text-cyan-300 h-64 overflow-y-auto space-y-1.5">
                {deploymentLog.map((log, idx) => (
                  <div key={idx} className="leading-normal">
                    <span className="text-[#5b8091] select-none">
                      [{new Date().toLocaleTimeString()}]
                    </span>{" "}
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
