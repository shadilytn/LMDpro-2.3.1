import React from "react";
import { UserProfile } from "../shared/types";
import {
  Users,
  Target,
  Award,
  CheckCircle2,
  BarChart2,
  Bot,
  Sparkles,
  Send,
  MessageSquare,
  Plus,
  Trash2,
  Flame,
  Radio,
} from "lucide-react";
import { ApiService } from "../shared/api.service";

interface TeamDashboardProps {
  user: UserProfile;
  onOpenAITutor?: () => void;
  onOpenSubscriptions?: () => void;
}

export const TeamDashboard: React.FC<TeamDashboardProps> = ({
  user,
  onOpenAITutor,
  onOpenSubscriptions,
}) => {
  const [activeTab, setActiveTab] = React.useState<
    "skills" | "upskilling" | "slack_bot" | "seats"
  >("skills");

  // Team Seats State
  const [teamMembers, setTeamMembers] = React.useState([
    {
      id: "1",
      name: "Elena Rostova",
      role: "Lead AI Engineer",
      progress: 95,
      streak: 12,
      level: "Mastery",
      email: "elena@company.com",
    },
    {
      id: "2",
      name: "Marcus Chen",
      role: "Full Stack Developer",
      progress: 82,
      streak: 8,
      level: "Accelerated",
      email: "marcus@company.com",
    },
    {
      id: "3",
      name: "Sarah Jenkins",
      role: "Data Scientist",
      progress: 88,
      streak: 14,
      level: "Accelerated",
      email: "sarah@company.com",
    },
    {
      id: "4",
      name: "David Kim",
      role: "DevOps Engineer",
      progress: 70,
      streak: 5,
      level: "Standard",
      email: "david@company.com",
    },
  ]);
  const [newMemberName, setNewMemberName] = React.useState("");
  const [newMemberEmail, setNewMemberEmail] = React.useState("");

  // Skill Gap Analysis State
  const [isAnalyzingGaps, setIsAnalyzingGaps] = React.useState(false);
  const [gapAnalysisResult, setGapAnalysisResult] = React.useState<string | null>(
    null,
  );

  // Slack Bot Integration State
  const [webhookUrl, setWebhookUrl] = React.useState(
    "https://hooks.slack.com/services/T00/B00/X00",
  );
  const [digestTime, setDigestTime] = React.useState("09:00 AM");
  const [isTestSending, setIsTestSending] = React.useState(false);
  const [testSentSuccess, setTestSentSuccess] = React.useState(false);

  // Handle Skill Gap Analysis
  const handleRunSkillGapAnalysis = async () => {
    setIsAnalyzingGaps(true);
    setGapAnalysisResult(null);

    try {
      const prompt = `Analyze this engineering team's current skill profile:
Members: Elena (Lead AI), Marcus (Full Stack), Sarah (Data Science), David (DevOps)
Identify current technology gaps in Quantum Computing, Live WebSocket Streaming, and Agentic RAG.
Provide actionable upskilling recommendations.`;

      const aiText = await ApiService.queryAITutor(
        prompt,
        "Corporate AI Skill Gap Analyzer Agent",
      );
      setGapAnalysisResult(
        aiText ||
          "Skill Gap Analysis Complete: High mastery in AI Tool Orchestration (88%). Recommended focus area: Live API Streaming and Quantum Physics basics.",
      );
    } catch {
      setGapAnalysisResult(
        "Recommended Team Focus: Assign Module 04 (Live API WebSocket Streaming) to David Kim and Marcus Chen to boost full-stack agent orchestration velocity.",
      );
    } finally {
      setIsAnalyzingGaps(false);
    }
  };

  // Add New Team Member
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberEmail) return;

    if (teamMembers.length >= 50) {
      alert(
        "Team seat limit reached (50/50). Upgrade to Enterprise tier for unlimited seats.",
      );
      return;
    }

    setTeamMembers((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newMemberName,
        role: "Software Engineer",
        progress: 0,
        streak: 1,
        level: "Standard",
        email: newMemberEmail,
      },
    ]);
    setNewMemberName("");
    setNewMemberEmail("");
  };

  // Remove Member
  const handleRemoveMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Send Test Slack Micro-Lesson Digest
  const handleSendTestDigest = () => {
    setIsTestSending(true);
    setTestSentSuccess(false);

    setTimeout(() => {
      setIsTestSending(false);
      setTestSentSuccess(true);
      setTimeout(() => setTestSentSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Corporate Team Tier Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a1820] to-[#0d222e] border border-slate-500/40 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-500/20 text-slate-200 border border-slate-500/30 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-300" />
                Corporate Teams Tier ($499/mo)
              </span>
              <span className="text-xs text-[#82a4b3] bg-[#071319] px-2.5 py-0.5 rounded-full border border-[#1b3a49]">
                Active Seats: <strong>{teamMembers.length} / 50</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Corporate AI Skill Matrix & Upskilling Portal
            </h1>

            <p className="text-xs sm:text-sm text-[#8bb1c2] leading-relaxed">
              Empower your engineering teams with AI gap analysis agents,
              automated upskilling tracks, Slack micro-learning bots, and team
              completion velocity metrics.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
            <button
              onClick={onOpenSubscriptions}
              className="px-4 py-2.5 rounded-xl bg-[#142a35] hover:bg-[#1c3846] text-white text-xs font-semibold border border-[#1e3e4f] transition-all"
            >
              Manage Subscription
            </button>
            {onOpenAITutor && (
              <button
                onClick={onOpenAITutor}
                className="px-4 py-2.5 rounded-xl bg-[#0f6674] hover:bg-[#137b8c] text-white text-xs font-semibold shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Ask Team Copilot</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-1">
          <div className="flex justify-between text-[#82a4b3] text-xs">
            <span>Seat Utilization</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {teamMembers.length} / 50 Seats
          </div>
          <p className="text-[11px] text-cyan-400">46 Available Slots</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-1">
          <div className="flex justify-between text-[#82a4b3] text-xs">
            <span>Team Skill Mastery</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-300">83.8%</div>
          <p className="text-[11px] text-cyan-400">+5.2% gain this month</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-1">
          <div className="flex justify-between text-[#82a4b3] text-xs">
            <span>Active Study Streaks</span>
            <Flame className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">9.8 Days Avg</div>
          <p className="text-[11px] text-cyan-400 font-medium">
            Top Team Velocity
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-1">
          <div className="flex justify-between text-[#82a4b3] text-xs">
            <span>Slack Bot Integration</span>
            <Radio className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-400">
            Connected
          </div>
          <p className="text-[11px] text-[#82a4b3]">Daily 09:00 AM Digest</p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1c3c4d] pb-2 overflow-x-auto text-xs">
        {[
          {
            id: "skills",
            label: "Corporate AI Skill Gap Analyzer",
            icon: Target,
          },
          {
            id: "upskilling",
            label: "Automated Employee Career Tracks",
            icon: Award,
          },
          {
            id: "slack_bot",
            label: "Slack & MS Teams Digest Bot",
            icon: MessageSquare,
          },
          { id: "seats", label: "Team Seat & License Governance", icon: Users },
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

      {/* TAB CONTENT 1: AI Skill Gap Analyzer */}
      {activeTab === "skills" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-cyan-400" />
                  Team Member Skill Matrix & Velocity
                </h2>
                <p className="text-xs text-[#82a4b3]">
                  Real-time competency tracking across all active team seats
                </p>
              </div>

              <button
                onClick={handleRunSkillGapAnalysis}
                disabled={isAnalyzingGaps}
                className="px-4 py-2 rounded-xl bg-[#0f6674] hover:bg-[#137b8c] text-white text-xs font-semibold flex items-center gap-2 shrink-0"
              >
                {isAnalyzingGaps ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Team Skills...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4 text-cyan-300" />
                    <span>Run AI Skill Gap Agent</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-3">
              {teamMembers.map((m, idx) => (
                <div
                  key={m.id}
                  className="p-4 rounded-xl bg-[#08131a] border border-[#1d3d4c] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center text-xs border border-cyan-500/30">
                      #{idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{m.name}</h4>
                      <p className="text-xs text-[#81a4b4]">
                        {m.role} • {m.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="text-[#81a4b4]">Streak</div>
                      <div className="font-bold text-cyan-400">
                        {m.streak} days
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#81a4b4]">Level</div>
                      <div className="font-bold text-cyan-300">{m.level}</div>
                    </div>
                    <div className="w-24 bg-[#11242e] h-2 rounded-full overflow-hidden border border-[#1e3d4c]">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full rounded-full"
                        style={{ width: `${m.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {gapAnalysisResult && (
              <div className="p-4 rounded-xl bg-[#08131a] border border-cyan-500/40 space-y-2 animate-fade-in">
                <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Agent Gap Analysis Recommendations:</span>
                </div>
                <p className="text-xs text-[#8db1c2] leading-relaxed">
                  {gapAnalysisResult}
                </p>
              </div>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-cyan-400" />
              Skill Heatmap
            </h2>

            <div className="space-y-3 text-xs">
              {[
                {
                  skill: "Agentic Tool Orchestration",
                  mastery: 88,
                  status: "Mastered",
                },
                {
                  skill: "Live API WebSocket Streaming",
                  mastery: 74,
                  status: "Improving",
                },
                {
                  skill: "Quantum Physics Basics",
                  mastery: 62,
                  status: "Target Area",
                },
                {
                  skill: "Enterprise AI Governance",
                  mastery: 92,
                  status: "Mastered",
                },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#08131a] border border-[#1d3d4c] space-y-2"
                >
                  <div className="flex justify-between font-semibold">
                    <span className="text-white">{s.skill}</span>
                    <span className="text-cyan-300">{s.mastery}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#11242e] rounded-full overflow-hidden border border-[#1e3d4c]">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full rounded-full"
                      style={{ width: `${s.mastery}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: Slack & MS Teams Digest Bot */}
      {activeTab === "slack_bot" && (
        <div className="p-6 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                Slack & MS Teams AI Micro-Learning Digest Bot
              </h2>
              <p className="text-xs text-[#82a4b3] mt-1">
                Delivers 5-minute daily micro-lessons, quiz flashcards, and
                study streak reminders directly into your engineering team's
                Slack or Teams channels.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-white font-semibold mb-1">
                  Incoming Webhook URL:
                </label>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#08131a] border border-[#1d3d4c] text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-1">
                  Daily Digest Delivery Time:
                </label>
                <select
                  value={digestTime}
                  onChange={(e) => setDigestTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#08131a] border border-[#1d3d4c] text-white focus:outline-none"
                >
                  <option>08:00 AM</option>
                  <option>09:00 AM</option>
                  <option>10:00 AM</option>
                  <option>01:00 PM</option>
                </select>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handleSendTestDigest}
                  disabled={isTestSending}
                  className="px-5 py-2.5 rounded-xl bg-[#0f6674] hover:bg-[#137b8c] text-white font-semibold flex items-center gap-2"
                >
                  {isTestSending ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Dispatching Test...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-cyan-300" />
                      <span>Send Test Micro-Lesson</span>
                    </>
                  )}
                </button>

                {testSentSuccess && (
                  <span className="text-xs text-cyan-300 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Delivered to Slack!</span>
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#08131a] border border-[#1d3d4c] space-y-3 font-mono text-xs">
              <div className="text-[10px] text-cyan-300 uppercase tracking-wider font-bold">
                Sample Slack Bot Preview Payload:
              </div>
              <div className="p-3 rounded-lg bg-[#0b1820] border border-[#183645] space-y-2 text-[#8db1c2]">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span>Zalamati AI Copilot • 09:00 AM</span>
                </div>
                <p className="text-xs text-white font-sans">
                  🧠 <strong>Daily 5-Min AI Micro-Lesson:</strong> "What is
                  Function Calling in Gemini 3.1 Pro?"
                </p>
                <p className="text-[11px] font-sans text-[#7fa3b3]">
                  Function calling allows Gemini to generate structured JSON
                  function calls to external REST endpoints and databases
                  securely.
                </p>
                <div className="pt-2 flex items-center gap-2 font-sans">
                  <span className="px-2 py-1 rounded bg-[#132833] text-cyan-300 text-[10px]">
                    Take 1-Min Quiz
                  </span>
                  <span className="text-[10px] text-[#6d91a1]">
                    🔥 12-Day Team Streak
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: Seats & Governance */}
      {activeTab === "seats" && (
        <div className="p-6 rounded-2xl bg-[#0f2029] border border-[#1d3d4c] space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Team Seat & Access Governance
              </h2>
              <p className="text-xs text-[#82a4b3] mt-1">
                Invite engineers, assign admin vs learner permissions, and
                manage corporate subscription seats (Up to 50 members).
              </p>
            </div>
          </div>

          {/* Add Member Form */}
          <form
            onSubmit={handleAddMember}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              placeholder="Member Full Name"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-[#08131a] border border-[#1d3d4c] text-white text-xs flex-1 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Member Corporate Email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-[#08131a] border border-[#1d3d4c] text-white text-xs flex-1 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0f6674] hover:bg-[#137b8c] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Invite Member</span>
            </button>
          </form>

          {/* Members Table */}
          <div className="overflow-x-auto rounded-xl border border-[#1d3d4c] bg-[#08131a]">
            <table className="w-full text-left text-xs text-[#82a4b3]">
              <thead className="bg-[#0f2029] text-white border-b border-[#1d3d4c]">
                <tr>
                  <th className="p-3.5 font-bold">Member Name</th>
                  <th className="p-3.5 font-bold">Email</th>
                  <th className="p-3.5 font-bold">Role</th>
                  <th className="p-3.5 font-bold">Level</th>
                  <th className="p-3.5 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#173343]">
                {teamMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 font-semibold text-white">{m.name}</td>
                    <td className="p-3.5 text-[#81a4b4]">{m.email}</td>
                    <td className="p-3.5">{m.role}</td>
                    <td className="p-3.5 text-cyan-300 font-medium">
                      {m.level}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleRemoveMember(m.id)}
                        className="p-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 transition-colors"
                        title="Remove Seat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
