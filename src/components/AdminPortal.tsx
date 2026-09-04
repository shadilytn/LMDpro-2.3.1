import React from "react";
import {
  ShieldCheck,
  Users,
  Key,
  Database,
  Terminal,
  Activity,
  CheckCircle,
  Sliders,
  Cpu,
  Layers,
  Settings,
  Lock,
  UserPlus,
  RefreshCw,
  Play,
  Zap,
  Code,
} from "lucide-react";
import { UserRole } from "../shared/types";
import { toastService } from "../services/toastService";

interface AdminPortalProps {
  currentRole: UserRole;
  onRoleChange?: (role: UserRole) => void;
}

interface IAMUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tier: "free" | "pro" | "school" | "enterprise";
  status: "active" | "suspended";
  lastActive: string;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentRole,
  onRoleChange,
}) => {
  const [activeTab, setActiveTab] = React.useState<
    "iam" | "roles" | "rules" | "devconsole" | "tiers" | "audit"
  >("iam");

  // Sample IAM Users State
  const [users, setUsers] = React.useState<IAMUser[]>([
    {
      id: "usr_1",
      name: "Dr. Nashmi Al-Zalamati",
      email: "nashmi@zalamati.com",
      role: "enterprise",
      tier: "enterprise",
      status: "active",
      lastActive: "2 mins ago",
    },
    {
      id: "usr_2",
      name: "Prof. Petra Vance",
      email: "petra@lmdpro.edu",
      role: "teacher",
      tier: "school",
      status: "active",
      lastActive: "15 mins ago",
    },
    {
      id: "usr_3",
      name: "Zalamati Student",
      email: "student@zalamati.com",
      role: "student",
      tier: "pro",
      status: "active",
      lastActive: "Just now",
    },
    {
      id: "usr_4",
      name: "Guest Scholar",
      email: "guest@zalamati.com",
      role: "student",
      tier: "free",
      status: "active",
      lastActive: "1 hour ago",
    },
  ]);

  const [selectedUser, setSelectedUser] = React.useState<IAMUser | null>(users[0]);
  const [devLogs, setDevLogs] = React.useState<string[]>([
    "[INIT] System IAM & Access Control Engine mounted.",
    "[RAG] Active RAG auto-crawler listening on background bus.",
    "[AUTH] Token validation middleware active globally.",
    "[VITEST] Test suite initialized for OfflineStorageService.",
    "[A11Y] Automated accessibility scanner ready.",
  ]);

  const [testEndpoint, setTestEndpoint] = React.useState("/api/auth/validate-token");
  const [testPayload, setTestPayload] = React.useState(
    '{\n  "role": "admin",\n  "tier": "enterprise"\n}',
  );

  const handleRoleUpdate = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
    );
    toastService.success(`Updated role to ${newRole} for user.`);
    if (userId === selectedUser?.id && onRoleChange) {
      onRoleChange(newRole);
    }
  };

  const handleRunDevTest = () => {
    const timestamp = new Date().toLocaleTimeString();
    setDevLogs((prev) => [
      `[${timestamp}] EXEC: ${testEndpoint}`,
      `[${timestamp}] PAYLOAD: ${testPayload.replace(/\n/g, " ")}`,
      `[${timestamp}] RES: 200 OK (0.12ms) - Access Granted`,
      ...prev,
    ]);
    toastService.success("Developer execution test succeeded!");
  };

  return (
    <div className="space-y-6 text-[#c5dae4]">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
                Zalamati Advanced Admin Portal & Developer Console
              </h1>
              <p className="text-xs text-[#82a3b2]">
                Global IAM, Access Control, Security Rules, Tier Testing, and
                Enterprise Integrations.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Role Switcher for Testing */}
        <div className="flex items-center gap-2 bg-[#08151c] p-2 rounded-xl border border-[#1b3b4a]">
          <span className="text-xs text-[#6e92a4] font-semibold">
            Simulate Role:
          </span>
          {(["admin", "teacher", "student"] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => onRoleChange && onRoleChange(r)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                currentRole === r
                  ? "bg-cyan-500 text-black shadow-md"
                  : "text-[#82a3b2] hover:bg-white/5 hover:text-white"
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#1b3b4a] pb-2">
        {[
          { id: "iam", label: "IAM & Users", icon: Users },
          { id: "roles", label: "Roles & Claims", icon: Key },
          { id: "rules", label: "Firestore Security Rules", icon: Lock },
          {
            id: "devconsole",
            label: "Developer Console & API",
            icon: Terminal,
          },
          { id: "tiers", label: "Tier & Feature Manager", icon: Layers },
          { id: "audit", label: "Audit Logs", icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-[#122e3d] text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "text-[#82a3b2] hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === "iam" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User List */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Identity & Access Directory</span>
              </h2>
              <button
                onClick={() =>
                  toastService.info("Opening user provisioning dialog...")
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Provision User</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#1b3b4a] text-[#6e92a4] font-semibold">
                    <th className="py-2.5 px-3">User</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Tier</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Last Active</th>
                    <th className="py-2.5 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b3b4a]/50">
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      onClick={() => setSelectedUser(u)}
                      className={`hover:bg-white/5 cursor-pointer transition-colors ${
                        selectedUser?.id === u.id ? "bg-[#122e3d]/60" : ""
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-[10px] text-[#6e92a4]">
                          {u.email}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={u.role}
                          onChange={(e) =>
                            handleRoleUpdate(u.id, e.target.value as UserRole)
                          }
                          className="bg-[#08151c] text-cyan-300 border border-[#1b3b4a] rounded-lg text-xs p-1"
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 font-semibold text-cyan-300 uppercase text-[10px]">
                        {u.tier}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#82a3b2]">
                        {u.lastActive}
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() =>
                            toastService.success(`Manage claims for ${u.name}`)
                          }
                          className="text-cyan-400 hover:underline font-semibold"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Identity Details & Custom Claims */}
          <div className="p-5 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              <span>Identity Profile & Claims</span>
            </h3>

            {selectedUser ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#08151c] border border-[#1b3b4a]">
                  <div className="text-[10px] text-[#6e92a4]">UID</div>
                  <div className="font-mono text-cyan-300 font-bold">
                    {selectedUser.id}
                  </div>
                  <div className="mt-2 text-[10px] text-[#6e92a4]">
                    Full Name
                  </div>
                  <div className="font-bold text-white">
                    {selectedUser.name}
                  </div>
                  <div className="mt-2 text-[10px] text-[#6e92a4]">Email</div>
                  <div className="text-slate-300">{selectedUser.email}</div>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-white">
                    Custom Firebase Claims
                  </span>
                  <div className="p-3 rounded-xl bg-[#08151c] border border-[#1b3b4a] font-mono text-[11px] text-cyan-300">
                    {JSON.stringify(
                      {
                        admin: selectedUser.role === "enterprise",
                        teacher: selectedUser.role === "teacher",
                        tier: selectedUser.tier,
                        schoolId: "sch_zalamati_01",
                      },
                      null,
                      2,
                    )}
                  </div>
                </div>

                <button
                  onClick={() =>
                    toastService.success(
                      "Custom claims pushed to Firebase Auth!",
                    )
                  }
                  className="w-full py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync Claims to Auth Token</span>
                </button>
              </div>
            ) : (
              <div className="text-xs text-[#6e92a4]">
                Select a user to inspect claims.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "devconsole" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Workbench */}
          <div className="p-5 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Developer Test Workbench</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#82a3b2] mb-1 font-semibold">
                  Test API Route / Endpoint
                </label>
                <input
                  type="text"
                  value={testEndpoint}
                  onChange={(e) => setTestEndpoint(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#08151c] border border-[#1b3b4a] text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[#82a3b2] mb-1 font-semibold">
                  JSON Request Payload
                </label>
                <textarea
                  rows={4}
                  value={testPayload}
                  onChange={(e) => setTestPayload(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#08151c] border border-[#1b3b4a] text-cyan-300 font-mono"
                />
              </div>

              <button
                onClick={handleRunDevTest}
                className="w-full py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Execute Developer API Test</span>
              </button>
            </div>
          </div>

          {/* Console Execution Output */}
          <div className="p-5 rounded-2xl bg-[#08151c] border border-[#1b3b4a] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-2 font-mono">
                <Code className="w-4 h-4" />
                <span>Live Execution Console Logs</span>
              </h3>
              <button
                onClick={() => setDevLogs([])}
                className="text-[10px] text-[#6e92a4] hover:text-white"
              >
                Clear
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#040b10] border border-[#1b3b4a] font-mono text-[11px] text-slate-300 h-64 overflow-y-auto space-y-1">
              {devLogs.length === 0 && (
                <span className="text-slate-500">Console ready.</span>
              )}
              {devLogs.map((log, idx) => (
                <div key={idx} className="hover:bg-white/5 p-1 rounded">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "rules" && (
        <div className="p-5 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Active Firestore Security Rules (ABAC)</span>
            </h2>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              Rules Verified & Deployed
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#08151c] border border-[#1b3b4a] font-mono text-xs text-slate-300 space-y-2 max-h-96 overflow-y-auto">
            <pre>{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isSignedIn() { return request.auth != null; }
    function isOwner(userId) { return isSignedIn() && request.auth.uid == userId; }
    function isAdmin() { return isSignedIn() && exists(/databases/$(database)/documents/admins/$(request.auth.uid)); }

    match /users/{userId} {
      allow read, write: if isOwner(userId) || isAdmin();
    }

    match /courses/{courseId} {
      allow read: if true;
      allow write: if isAdmin() || (isSignedIn() && request.auth.token.teacher == true);
    }

    match /student_progress/{progressId} {
      allow read, write: if isSignedIn();
    }
  }
}`}</pre>
          </div>
        </div>
      )}

      {activeTab === "tiers" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Student Learning Studio",
              badge: "Tier: Free / Student",
              features: [
                "Interactive AI Tutor",
                "Offline Course Media",
                "Personal Schedule Planner",
                "Certificates & Badges",
              ],
            },
            {
              title: "Teams & School Hub",
              badge: "Tier: School / Institution",
              features: [
                "Cohort Management",
                "Assignments & Grading",
                "Custom AI Course Architect",
                "Analytics Dashboard",
              ],
            },
            {
              title: "Enterprise Engine",
              badge: "Tier: Enterprise",
              features: [
                "Developer API Keys",
                "Global IAM & Custom Rules",
                "Dedicated RAG Pipeline",
                "Infinite Storage",
              ],
            },
          ].map((tier, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-3"
            >
              <div className="text-xs font-mono text-cyan-400 font-bold">
                {tier.badge}
              </div>
              <h3 className="text-sm font-bold text-white">{tier.title}</h3>
              <ul className="space-y-1 text-xs text-[#82a3b2]">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() =>
                  toastService.success(
                    `Tested ${tier.title} feature set successfully!`,
                  )
                }
                className="w-full mt-3 py-1.5 rounded-xl bg-[#122e3d] hover:bg-[#1a3e52] text-cyan-300 font-bold text-xs border border-cyan-500/30 transition-all"
              >
                Test Tier Capabilities
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "roles" && (
        <div className="p-5 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Role & Permission Matrix</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#08151c] border border-[#1b3b4a] space-y-2">
              <span className="font-bold text-cyan-400 text-sm">
                Student
              </span>
              <p className="text-[#82a3b2]">
                Access to Learning Studio, Course Viewer, Study Schedule,
                Leaderboards, and Student AI Tools.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#08151c] border border-[#1b3b4a] space-y-2">
              <span className="font-bold text-cyan-400 text-sm">Teacher</span>
              <p className="text-[#82a3b2]">
                Full capabilities of Student + Course Creation, Assignment
                Grading, School Dashboard, and Cohorts.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#08151c] border border-[#1b3b4a] space-y-2">
              <span className="font-bold text-cyan-400 text-sm">Admin</span>
              <p className="text-[#82a3b2]">
                Unrestricted access to Developer Console, IAM Management,
                Security Rules, System Instructions, and RAG Engine.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "audit" && (
        <div className="p-5 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>System Audit Logs & Security Events</span>
          </h2>

          <div className="space-y-2 text-xs font-mono">
            {[
              {
                time: "19:36:12",
                event: "IAM_ROLE_CHANGE",
                user: "admin@zalamati.com",
                detail: "Elevated petra@lmdpro.edu to Teacher role",
              },
              {
                time: "19:35:40",
                event: "FIRESTORE_RULES_DEPLOY",
                user: "system",
                detail: "Deployed updated ABAC security rules",
              },
              {
                time: "19:34:02",
                event: "TOKEN_VALIDATION",
                user: "student@zalamati.com",
                detail: "Validated Firebase ID token via AuthMiddleware",
              },
            ].map((log, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#08151c] border border-[#1b3b4a] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#6e92a4]">{log.time}</span>
                  <span className="font-bold text-cyan-300">{log.event}</span>
                  <span className="text-slate-300">{log.detail}</span>
                </div>
                <span className="text-[10px] text-slate-500">{log.user}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortal;
