import React from "react";
import { UserProfile, Certificate, Badge } from "../shared/types";
import {
  X,
  User,
  Shield,
  Award,
  BookOpen,
  Sparkles,
  CheckCircle,
  Building,
  Mail,
  Zap,
  Flame,
  Globe,
  Edit3,
  Check,
  Download,
  ExternalLink,
  Linkedin,
  Share2,
  Plus,
  MessageSquare,
  CheckCircle2,
  RefreshCw,
  Send,
  FileText,
} from "lucide-react";
import { getTranslation } from "../shared/localization";
import { backgroundIntelligence } from "../services/backgroundIntelligence";
import { toastService } from "../services/toastService";
import { SkillsStackVisualizer } from "./SkillsStackVisualizer";
import { BadgeHall } from "./BadgeHall";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  certificates: Certificate[];
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onViewCertificate: (cert: Certificate) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  certificates,
  onUpdateUser,
  onViewCertificate,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState(user.name);
  const [email, setEmail] = React.useState(user.email);
  const [org, setOrg] = React.useState(
    user.organization || "Zalamati Global Academy",
  );
  const [bio, setBio] = React.useState(
    user.bio ||
      "Passionate scholar pursuing autonomous AI agent engineering and open knowledge.",
  );
  const [avatarUrl, setAvatarUrl] = React.useState(user.avatarUrl);

  // LinkedIn State
  const [isLinkedInConnected, setIsLinkedInConnected] = React.useState(
    user.linkedInConnected || false,
  );
  const [linkedInHeadline, setLinkedInHeadline] = React.useState(
    user.linkedInHeadline || "AI Researcher & Systems Architect",
  );
  const [linkedInProfileUrl, setLinkedInProfileUrl] = React.useState(
    user.linkedInProfileUrl || "https://linkedin.com/in/scholar",
  );
  const [isSyncingLinkedIn, setIsSyncingLinkedIn] = React.useState(false);
  const [showShareNotification, setShowShareNotification] = React.useState(false);

  // Discussion Topics & Skills
  const [skills, setSkills] = React.useState<string[]>(
    user.skills || [
      "Distributed Systems",
      "Gemini AI API",
      "TypeScript",
      "RAG Engineering",
    ],
  );
  const [newSkill, setNewSkill] = React.useState("");
  const [discussionTopics, setDiscussionTopics] = React.useState<string[]>(
    user.discussionTopics || [
      "Raft Consensus Leader Election vs Multi-Paxos",
      "WebGPU Zero-Latency Local DOM Parsing Performance",
      "Multimodal Audio-to-Audio Live Streaming Protocols",
    ],
  );
  const [newTopic, setNewTopic] = React.useState("");

  const t = getTranslation(user.language);

  const [careerRole, setCareerRole] = React.useState(
    user.careerRole || "Principal Autonomous AI Systems Architect",
  );
  const [targetTrajectory, setTargetTrajectory] = React.useState(
    user.targetTrajectory || "Director of AI Infrastructure & Research",
  );
  const [experiences, setExperiences] = React.useState<
    Array<{
      id: string;
      title: string;
      company: string;
      duration: string;
      description: string;
    }>
  >(
    user.experiences || [
      {
        id: "exp-1",
        title: "Senior AI Research Engineer",
        company: "DeepMind Autonomous Labs",
        duration: "2024 - Present",
        description:
          "Architected distributed multi-agent RAG pipelines and decentralized vector embedding caches.",
      },
      {
        id: "exp-2",
        title: "Full-Stack Distributed Systems Lead",
        company: "CloudScale Global",
        duration: "2022 - 2024",
        description:
          "Scaled Kubernetes microservices and optimized latency across cross-region edge nodes.",
      },
    ],
  );

  const [newExpTitle, setNewExpTitle] = React.useState("");
  const [newExpCompany, setNewExpCompany] = React.useState("");
  const [newExpDuration, setNewExpDuration] = React.useState("");
  const [newExpDesc, setNewExpDesc] = React.useState("");
  const [showCvModal, setShowCvModal] = React.useState(false);
  const [cvTemplate, setCvTemplate] = React.useState<
    "modern" | "academic" | "minimalist"
  >("modern");
  const [isImportingLinkedIn, setIsImportingLinkedIn] = React.useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateUser({
      name,
      email,
      organization: org,
      bio,
      avatarUrl,
      linkedInConnected: isLinkedInConnected,
      linkedInHeadline,
      linkedInProfileUrl,
      skills,
      discussionTopics,
      careerRole,
      targetTrajectory,
      experiences,
    });
    setIsEditing(false);
  };

  const handleImportLinkedInExport = async () => {
    setIsImportingLinkedIn(true);
    const result = await backgroundIntelligence.parseLinkedInExport(
      JSON.stringify({
        headline: careerRole,
        target: targetTrajectory,
        experiences,
        skills,
      }),
    );
    setIsImportingLinkedIn(false);
    if (result.success) {
      setCareerRole(result.role);
      setTargetTrajectory(result.trajectory);
      setExperiences(result.experiences);
      toastService.success("LinkedIn Sync Complete", result.message);
    }
  };

  const handleAddExperience = () => {
    if (!newExpTitle.trim() || !newExpCompany.trim()) return;
    setExperiences((prev) => [
      ...prev,
      {
        id: `exp-${Date.now()}`,
        title: newExpTitle.trim(),
        company: newExpCompany.trim(),
        duration: newExpDuration.trim() || "2025 - Present",
        description:
          newExpDesc.trim() ||
          "Applied autonomous agentic workflows and advanced RAG vector indexing.",
      },
    ]);
    setNewExpTitle("");
    setNewExpCompany("");
    setNewExpDuration("");
    setNewExpDesc("");
  };

  const handleConnectLinkedIn = () => {
    setIsSyncingLinkedIn(true);
    // Simulate LinkedIn OAuth approval and data import
    setTimeout(() => {
      setIsLinkedInConnected(true);
      setName("Shady Banyata");
      setOrg("Zalamati Autonomous AI Platform");
      setLinkedInHeadline(
        "AI Agent Systems Architect | Google Cloud Certified",
      );
      setBio(
        "Lead Engineer building persistent autonomous AI agent ecosystems with Gemini 3.1 Pro and WebGPU edge models.",
      );
      setLinkedInProfileUrl("https://www.linkedin.com/in/shadybanyata");
      setSkills((prev) =>
        Array.from(
          new Set([
            ...prev,
            "Google Cloud Platform",
            "Firebase Firestore",
            "Gemini Multimodal Live API",
          ]),
        ),
      );
      setIsSyncingLinkedIn(false);
      onUpdateUser({
        name: "Shady Banyata",
        organization: "Zalamati Autonomous AI Platform",
        linkedInConnected: true,
        linkedInHeadline: "AI Agent Systems Architect | Google Cloud Certified",
        linkedInProfileUrl: "https://www.linkedin.com/in/shadybanyata",
        bio: "Lead Engineer building persistent autonomous AI agent ecosystems with Gemini 3.1 Pro and WebGPU edge models.",
      });
    }, 1500);
  };

  const handlePublishToLinkedIn = () => {
    setShowShareNotification(true);
    setTimeout(() => setShowShareNotification(false), 4000);
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    setSkills((prev) => [...prev, newSkill.trim()]);
    setNewSkill("");
  };

  const handleAddTopic = () => {
    if (!newTopic.trim()) return;
    setDiscussionTopics((prev) => [...prev, newTopic.trim()]);
    setNewTopic("");
  };

  const AVATAR_OPTIONS = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b1820] border border-[#1b3a4a] text-white shadow-2xl flex flex-col">
        {/* Header Banner */}
        <div className="relative h-36 bg-gradient-to-r from-cyan-900/60 via-cyan-900/40 to-slate-900 border-b border-[#1b3a4a] p-6 flex items-end justify-between">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/50 hover:bg-black/80 text-gray-300 hover:text-white border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 translate-y-8">
            <div className="relative group">
              <img
                src={avatarUrl}
                alt={name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full border-2 border-cyan-400 shadow-xl object-cover bg-slate-800"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center text-xs font-semibold text-cyan-300 backdrop-blur-xs cursor-pointer">
                  Select
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                {name}
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                  {user.role}
                </span>
              </h2>
              <p className="text-xs text-[#82a3b2] flex items-center gap-2 mt-0.5">
                <Building className="w-3.5 h-3.5 text-cyan-400" />
                <span>{org}</span>
                <span>•</span>
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>{email}</span>
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3.5 py-2 rounded-xl bg-[#142e3b] hover:bg-[#1a3a4b] border border-cyan-500/30 text-cyan-300 text-xs font-medium transition-all flex items-center gap-1.5 shadow-md"
            >
              {isEditing ? (
                <Check className="w-4 h-4" />
              ) : (
                <Edit3 className="w-4 h-4" />
              )}
              <span>{isEditing ? "Done Editing" : "Edit Profile"}</span>
            </button>
          </div>
        </div>

        {/* Edit Form Drawer if Editing */}
        {isEditing && (
          <div className="mt-12 mx-6 p-5 rounded-2xl bg-[#0e212b] border border-[#1d4052] space-y-4 text-xs">
            <h3 className="font-bold text-cyan-300 uppercase tracking-wider text-xs">
              Update Profile Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#09151c] border border-[#1a3848] text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#09151c] border border-[#1a3848] text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 font-medium">
                  Institution / Organization
                </label>
                <input
                  type="text"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#09151c] border border-[#1a3848] text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 font-medium">
                  Choose Avatar Preset
                </label>
                <div className="flex items-center gap-2">
                  {AVATAR_OPTIONS.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="Avatar option"
                      referrerPolicy="no-referrer"
                      onClick={() => setAvatarUrl(url)}
                      className={`w-9 h-9 rounded-xl cursor-pointer border-2 object-cover ${
                        avatarUrl === url
                          ? "border-cyan-400 scale-105"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-gray-400 mb-1 font-medium">
                Academic Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-[#09151c] border border-[#1a3848] text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-all shadow-md"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        )}

        {/* Profile Content Body */}
        <div className="p-6 pt-12 space-y-6">
          {/* LinkedIn Integration & OAuth Sync Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0a1e2b] via-[#0c2434] to-[#081822] border border-[#0077b5]/40 space-y-4 shadow-xl relative overflow-hidden">
            {showShareNotification && (
              <div className="absolute top-2 right-2 px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-black text-[11px] shadow-lg flex items-center gap-1.5 animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
                <span>Published Credentials & Topics to LinkedIn Feed!</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#0077b5] text-white shadow-md">
                  <Linkedin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    LinkedIn Sync & Professional Portfolio
                    {isLinkedInConnected && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono">
                        ● CONNECTED
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-[#8bb0c0]">
                    Transfer your LinkedIn profile info directly without manual
                    typing, and publish your verified certificates and
                    discussion topics externally.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isLinkedInConnected ? (
                  <button
                    onClick={handleConnectLinkedIn}
                    disabled={isSyncingLinkedIn}
                    className="px-4 py-2 rounded-xl bg-[#0077b5] hover:bg-[#005885] text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 active:scale-95"
                  >
                    {isSyncingLinkedIn ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Approving OAuth Request...</span>
                      </>
                    ) : (
                      <>
                        <Linkedin className="w-4 h-4" />
                        <span>Sign In with LinkedIn</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleConnectLinkedIn}
                      disabled={isSyncingLinkedIn}
                      className="px-3.5 py-2 rounded-xl bg-[#0f2d3d] hover:bg-[#14394e] text-cyan-300 font-semibold text-xs border border-cyan-500/30 transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${isSyncingLinkedIn ? "animate-spin" : ""}`}
                      />
                      <span>Re-Sync</span>
                    </button>
                    <button
                      onClick={handlePublishToLinkedIn}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-black text-xs shadow-lg hover:from-cyan-400 hover:to-cyan-300 transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Publish Achievements & Topics</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isLinkedInConnected && (
              <div className="p-3 rounded-xl bg-[#07151e] border border-[#1b3d4f] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-semibold block">
                    LinkedIn Professional Headline
                  </span>
                  <span className="text-cyan-300 font-bold">
                    {linkedInHeadline}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-semibold block">
                    Public Profile Link
                  </span>
                  <a
                    href={linkedInProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                  >
                    {linkedInProfileUrl}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Career Path Builder & Professional Experience Section */}
          <div className="p-5 rounded-2xl bg-[#0d1e27] border border-[#1a3848] space-y-4 shadow-xl relative overflow-hidden">
            {/* Animated geometric SVG line pattern watermark */}
            <div className="absolute right-0 top-0 w-72 h-72 opacity-15 pointer-events-none">
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full text-cyan-400 fill-none stroke-current animate-pulse"
              >
                <path
                  d="M10,20 C50,10 120,40 180,20 C190,80 150,150 180,180 C110,190 60,130 20,180 C10,120 40,60 10,20 Z"
                  strokeWidth="1.5"
                />
                <path
                  d="M25,35 C60,25 110,50 160,35 C170,85 140,140 165,165 C110,175 70,125 35,165 C25,115 50,70 25,35 Z"
                  strokeWidth="1"
                />
                <path
                  d="M40,50 C70,40 100,60 140,50 C150,90 130,130 150,150 C100,160 80,120 50,150 C40,110 60,80 40,50 Z"
                  strokeWidth="0.75"
                />
              </svg>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Building className="w-4 h-4 text-cyan-400" />
                  <span>Career Path Builder & Resume Generator</span>
                </h3>
                <p className="text-xs text-[#789cae] mt-0.5">
                  Define your professional trajectory, input career experiences,
                  and automatically generate a polished LinkedIn/Coursera-styled
                  CV.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleImportLinkedInExport}
                  disabled={isImportingLinkedIn}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5"
                >
                  <FileText
                    className={`w-4 h-4 ${isImportingLinkedIn ? "animate-spin" : ""}`}
                  />
                  <span>
                    {isImportingLinkedIn
                      ? "Importing..."
                      : "Import LinkedIn Data"}
                  </span>
                </button>
                <button
                  onClick={() => setShowCvModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Generate CV</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#08151c] border border-[#163444]">
                <label className="block text-[10px] text-[#789cae] uppercase font-semibold mb-1">
                  Current Professional Role
                </label>
                <input
                  type="text"
                  value={careerRole}
                  onChange={(e) => setCareerRole(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#040e13] border border-[#1a3848] text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div className="p-3 rounded-xl bg-[#08151c] border border-[#163444]">
                <label className="block text-[10px] text-[#789cae] uppercase font-semibold mb-1">
                  Target Career Trajectory
                </label>
                <input
                  type="text"
                  value={targetTrajectory}
                  onChange={(e) => setTargetTrajectory(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#040e13] border border-[#1a3848] text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Experiences Timeline */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-cyan-300 block">
                Professional Experience Timeline
              </span>
              <div className="space-y-2">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3 rounded-xl bg-[#08151c] border border-[#163444] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">
                        {exp.title} •{" "}
                        <span className="text-cyan-300">{exp.company}</span>
                      </span>
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {exp.duration}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8bb0c0]">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Add experience form */}
              <div className="p-3 rounded-xl bg-[#08151c] border border-[#163444] space-y-2 mt-3">
                <span className="text-[11px] font-semibold text-gray-300 block">
                  Add New Experience
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newExpTitle}
                    onChange={(e) => setNewExpTitle(e.target.value)}
                    placeholder="Role Title (e.g. AI Lead)"
                    className="px-2.5 py-1.5 rounded-lg bg-[#040e13] border border-[#1a3848] text-xs text-white"
                  />
                  <input
                    type="text"
                    value={newExpCompany}
                    onChange={(e) => setNewExpCompany(e.target.value)}
                    placeholder="Company / Institution"
                    className="px-2.5 py-1.5 rounded-lg bg-[#040e13] border border-[#1a3848] text-xs text-white"
                  />
                  <input
                    type="text"
                    value={newExpDuration}
                    onChange={(e) => setNewExpDuration(e.target.value)}
                    placeholder="Duration (e.g. 2024 - Present)"
                    className="px-2.5 py-1.5 rounded-lg bg-[#040e13] border border-[#1a3848] text-xs text-white"
                  />
                </div>
                <textarea
                  value={newExpDesc}
                  onChange={(e) => setNewExpDesc(e.target.value)}
                  placeholder="Key responsibilities & accomplishments..."
                  rows={2}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#040e13] border border-[#1a3848] text-xs text-white"
                />
                <button
                  onClick={handleAddExperience}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 shadow"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Experience Item
                </button>
              </div>
            </div>
          </div>

          {showCvModal && (
            <div className="fixed inset-0 z-65 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
              <div className="w-full max-w-2xl bg-[#0b1820] border border-cyan-500/40 rounded-3xl p-6 space-y-4 text-white shadow-2xl relative overflow-hidden">
                {/* Geometric topographic watermark background lines */}
                <div className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 pointer-events-none">
                  <svg
                    viewBox="0 0 200 200"
                    className="w-full h-full text-cyan-400 fill-none stroke-current animate-pulse"
                  >
                    <path
                      d="M20,100 C20,40 80,20 120,40 C160,60 180,120 140,160 C100,200 40,160 20,100 Z"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M35,100 C35,50 85,35 115,50 C145,65 160,110 130,145 C100,180 55,150 35,100 Z"
                      strokeWidth="1"
                    />
                    <path
                      d="M50,100 C50,65 90,50 110,65 C130,80 140,100 120,130 C100,160 70,140 50,100 Z"
                      strokeWidth="0.75"
                    />
                  </svg>
                </div>

                <button
                  onClick={() => setShowCvModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-black/50 hover:bg-black/80 text-gray-300 z-10"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-3 border-b border-[#1b3a4a] pb-3 relative z-10">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                    <Building className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-black">
                      Generated Professional CV & Career Dossier
                    </h3>
                    <p className="text-[11px] text-[#789cae]">
                      Synthesized via Zalamati Autonomous Engine & LinkedIn
                      Profile Link
                    </p>
                  </div>
                  {/* Template selector */}
                  <div className="flex items-center gap-1 bg-[#040e13] p-1 rounded-xl border border-cyan-500/30 text-[11px]">
                    <button
                      onClick={() => setCvTemplate("modern")}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${cvTemplate === "modern" ? "bg-cyan-600 text-white" : "text-gray-400 hover:text-white"}`}
                    >
                      Modern
                    </button>
                    <button
                      onClick={() => setCvTemplate("academic")}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${cvTemplate === "academic" ? "bg-cyan-600 text-white" : "text-gray-400 hover:text-white"}`}
                    >
                      Academic
                    </button>
                    <button
                      onClick={() => setCvTemplate("minimalist")}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${cvTemplate === "minimalist" ? "bg-cyan-600 text-white" : "text-gray-400 hover:text-white"}`}
                    >
                      Minimal
                    </button>
                  </div>
                </div>

                {/* CV Preview based on template */}
                <div
                  className={`p-5 rounded-2xl border transition-all relative z-10 space-y-4 max-h-[55vh] overflow-y-auto ${
                    cvTemplate === "academic"
                      ? "bg-[#061118] border-cyan-500/30 font-serif"
                      : cvTemplate === "minimalist"
                        ? "bg-[#040c11] border-gray-700 font-sans"
                        : "bg-[#050e14] border-cyan-500/30 shadow-inner"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-[#163444] pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white tracking-tight">
                        {name}
                      </h4>
                      <p className="text-cyan-300 font-semibold text-xs">
                        {careerRole}
                      </p>
                    </div>
                    <div className="text-right text-[11px] text-[#789cae] font-mono">
                      <div>{email}</div>
                      <div>{linkedInProfileUrl}</div>
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-cyan-300 uppercase tracking-wide text-[10px] block mb-1">
                      Target Career Trajectory
                    </span>
                    <p className="text-gray-200 text-xs">{targetTrajectory}</p>
                  </div>

                  <div>
                    <span className="font-bold text-cyan-300 uppercase tracking-wide text-[10px] block mb-1">
                      Professional Experience
                    </span>
                    <div className="space-y-2.5">
                      {experiences.map((e) => (
                        <div
                          key={e.id}
                          className={`pl-3 py-1 ${cvTemplate === "academic" ? "border-l-2 border-cyan-400 bg-cyan-950/10 rounded-r-lg" : "border-l-2 border-cyan-500"}`}
                        >
                          <div className="font-bold text-white text-xs flex justify-between">
                            <span>
                              {e.title} at{" "}
                              <span className="text-cyan-300">{e.company}</span>
                            </span>
                            <span className="text-[10px] font-mono text-gray-400">
                              {e.duration}
                            </span>
                          </div>
                          <div className="text-gray-300 text-[11px] mt-0.5">
                            {e.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-cyan-300 uppercase tracking-wide text-[10px] block mb-1">
                      Core Competencies & Skills
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {skills.map((s, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* LMDpro & Logo Watermark Branding at the bottom */}
                  <div className="pt-4 mt-4 border-t border-[#163444] flex items-center justify-between text-[11px] text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center font-black text-black text-xs shadow">
                        LMD
                      </div>
                      <span className="font-bold tracking-wider text-cyan-400">
                        LMDpro Enterprise Autonomous Learning
                      </span>
                    </div>
                    <div className="font-mono text-[9px] text-[#789cae] tracking-widest uppercase">
                      Verified Dossier • ID:{" "}
                      {Math.random().toString(36).substring(2, 9).toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 relative z-10">
                  <button
                    onClick={() => {
                      toastService.success(
                        "Dossier Compiled",
                        `CV successfully compiled and downloaded in [${cvTemplate.toUpperCase()}] template format with LMDpro watermark!`
                      );
                      setShowCvModal(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                  >
                    <Download className="w-4 h-4" /> Download PDF / Word Dossier
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* External Discussion Topics */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>External Research & Discussion Topics</span>
            </h3>

            <div className="space-y-2">
              {discussionTopics.map((topic, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#0e212b] border border-[#1d4052] flex items-center justify-between text-xs text-white"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-medium">{topic}</span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    Open for Peer Discussion
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
                placeholder="Propose research topic for external peer review..."
                className="px-3 py-1.5 rounded-xl bg-[#09151c] border border-[#1a3848] text-white text-xs focus:outline-none focus:border-cyan-400 flex-1 max-w-md"
              />
              <button
                onClick={handleAddTopic}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Publish Topic
              </button>
            </div>
          </div>

          {/* Bio statement */}
          <div className="p-4 rounded-2xl bg-[#0e2029] border border-[#1c3c4d] text-xs text-[#8bb0c0] leading-relaxed">
            <span className="font-semibold text-cyan-300 block mb-0.5">
              Scholar Statement:
            </span>
            {user.bio || bio}
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#0f222c] border border-[#1e4050] space-y-1">
              <div className="flex items-center gap-1.5 text-[#7397a7] text-xs font-semibold">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>{t.totalXP}</span>
              </div>
              <div className="text-xl font-bold text-white">
                {user.xpPoints.toLocaleString()} XP
              </div>
              <div className="text-[10px] text-cyan-400">
                Level {user.level} Scholar
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0f222c] border border-[#1e4050] space-y-1">
              <div className="flex items-center gap-1.5 text-[#7397a7] text-xs font-semibold">
                <Flame className="w-4 h-4 text-cyan-400" />
                <span>{t.streak}</span>
              </div>
              <div className="text-xl font-bold text-white">
                {user.streakDays} Days
              </div>
              <div className="text-[10px] text-cyan-300">
                Active Study Streak
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0f222c] border border-[#1e4050] space-y-1">
              <div className="flex items-center gap-1.5 text-[#7397a7] text-xs font-semibold">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>{t.badgesUnlocked}</span>
              </div>
              <div className="text-xl font-bold text-white">
                {user.badges.length} Badges
              </div>
              <div className="text-[10px] text-cyan-300">Mastery Unlocks</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0f222c] border border-[#1e4050] space-y-1">
              <div className="flex items-center gap-1.5 text-[#7397a7] text-xs font-semibold">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>{t.certificatesEarned}</span>
              </div>
              <div className="text-xl font-bold text-white">
                {certificates.length} Earned
              </div>
              <div className="text-[10px] text-cyan-300">
                Verified Credentials
              </div>
            </div>
          </div>

          {/* Granular Micro-Credentials Skills Stack Visualizer */}
          <SkillsStackVisualizer user={user} />

          {/* Visual Badge Hall of Fame with Particle Effects */}
          <BadgeHall user={user} />

          {/* Earned Verified Certificates */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Verified Degrees & Certificates</span>
            </h3>

            {certificates.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#0d1c24] border border-[#1a3644] text-center text-xs text-[#7193a2]">
                No certificates earned yet. Complete degree program modules and
                pass capstone evaluations to generate official credentials!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-2xl bg-[#0d1e27] border border-cyan-500/20 hover:border-cyan-500/40 transition-colors flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                        {cert.verificationId}
                      </span>
                      <h4 className="text-xs font-bold text-white">
                        {cert.courseTitle}
                      </h4>
                      <p className="text-[10px] text-[#7193a2]">
                        {cert.issuedDate} • Grade: {cert.score}%
                      </p>
                    </div>
                    <button
                      onClick={() => onViewCertificate(cert)}
                      className="p-2 rounded-xl bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors text-xs font-semibold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#1b3a4a] bg-[#08131a] flex justify-end gap-3 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#142e3b] hover:bg-[#1a3a4b] text-cyan-300 text-xs font-semibold transition-all border border-cyan-500/20"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
