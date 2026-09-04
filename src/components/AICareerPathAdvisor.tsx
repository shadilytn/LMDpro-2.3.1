import React from "react";
import {
  Compass,
  Sparkles,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Target,
  Briefcase,
  DollarSign,
  Building,
  CheckCircle2,
  Brain,
  Shield,
  Zap,
  BarChart3,
  Flame,
  FileCheck,
  ChevronRight,
  Search,
  Layers,
  GraduationCap
} from "lucide-react";
import { UserProfile, Course } from "../shared/types";
import { ThemedCourseImage } from "./ThemedCourseImage";

interface AICareerPathAdvisorProps {
  user: UserProfile;
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
}

export interface CareerPath {
  id: string;
  title: string;
  category: string;
  matchScore: number;
  salaryRange: string;
  growthRate: string;
  industryDemand: "High" | "Extremely High" | "Critical";
  summary: string;
  requiredSkills: { name: string; level: number; acquired: boolean }[];
  recommendedCourseIds: string[];
  certifications: string[];
  keyIndustries: string[];
  practicalExamScenario: string;
}

export const AICareerPathAdvisor: React.FC<AICareerPathAdvisorProps> = ({
  user,
  courses,
  onSelectCourse,
  onUpdateUser,
}) => {
  const [selectedCareerId, setSelectedCareerId] = React.useState<string>("ai_architect");
  const [isGeneratingCustomPlan, setIsGeneratingCustomPlan] = React.useState(false);
  const [customPlanOutput, setCustomPlanOutput] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<"paths" | "skills" | "roadmap" | "exam">("paths");

  // Completed courses
  const completedCoursesCount = user.completedCourseIds?.length || 0;
  const userXp = user.xpPoints || 1250;
  const userLevel = user.level || Math.floor(userXp / 1000) + 1;

  // Career Paths Catalogue with AI matching logic
  const careerPaths: CareerPath[] = React.useMemo(() => [
    {
      id: "ai_architect",
      title: "Autonomous AI & Agentic Systems Architect",
      category: "Artificial Intelligence",
      matchScore: Math.min(98, 72 + completedCoursesCount * 5),
      salaryRange: "$175,000 - $265,000 / yr",
      growthRate: "+38% (Next 5 Years)",
      industryDemand: "Critical",
      summary:
        "Design, coordinate, and supervise multi-agent cognitive ecosystems using Gemini, Cellular Sheaves, and zero-trust AST execution engines.",
      requiredSkills: [
        { name: "Multi-Agent DAGs & Swarm Consensus", level: 92, acquired: true },
        { name: "Interactions API & Thought Signatures", level: 88, acquired: true },
        { name: "Sheaf Laplacian & Topological Alignment", level: 80, acquired: completedCoursesCount >= 2 },
        { name: "AST Sandboxing & Code Security", level: 85, acquired: true },
        { name: "Vector Indexing & RAG Memory Banks", level: 90, acquired: true },
      ],
      recommendedCourseIds: ["cs-101", "cs-201", "ds-301"],
      certifications: [
        "Certified Autonomous Agent Architect (CAAA)",
        "Advanced GenAI Systems Specialist",
      ],
      keyIndustries: ["Robotics & Automation", "Autonomous FinTech", "Enterprise Software"],
      practicalExamScenario:
        "Architect a bifurcated agent swarm connecting a client-side WebGPU micro-engine with a cloud-hosted Gemini 3.1 Pro orchestrator. Enforce AST safety sandboxes and verify mathematical consensus over cellular stalks.",
    },
    {
      id: "dist_systems",
      title: "Distributed Systems & Cloud Infrastructure Lead",
      category: "Systems Engineering",
      matchScore: Math.min(94, 68 + completedCoursesCount * 6),
      salaryRange: "$160,000 - $240,000 / yr",
      growthRate: "+27% (Next 5 Years)",
      industryDemand: "Extremely High",
      summary:
        "Architect globally replicated, Byzantine fault-tolerant distributed networks, consensus engines, and serverless edge computing runtimes.",
      requiredSkills: [
        { name: "Raft & Paxos Consensus Protocols", level: 90, acquired: true },
        { name: "Kubernetes & Container Orchestration", level: 86, acquired: completedCoursesCount >= 1 },
        { name: "Event-Driven Microservices & WebSockets", level: 88, acquired: true },
        { name: "High-Throughput Distributed KV Stores", level: 82, acquired: false },
      ],
      recommendedCourseIds: ["cs-301", "cs-101"],
      certifications: [
        "Cloud Native Distributed Systems Master",
        "Certified Kubernetes Administrator (CKA)",
      ],
      keyIndustries: ["Cloud Infrastructure", "Global Telecommunications", "Fintech Trading"],
      practicalExamScenario:
        "Implement a partitioned vector store with automatic linearizable read leases and dynamic leader failover recovery within 200ms latency limits.",
    },
    {
      id: "quantum_eng",
      title: "Quantum Computing & Algorithms Specialist",
      category: "Quantum Technologies",
      matchScore: Math.min(91, 60 + completedCoursesCount * 7),
      salaryRange: "$180,000 - $280,000 / yr",
      growthRate: "+45% (High Growth)",
      industryDemand: "High",
      summary:
        "Formulate quantum algorithms (Shor, Grover, VQE), execute quantum circuit simulations, and design post-quantum cryptographic schemes.",
      requiredSkills: [
        { name: "Qiskit & Quantum Circuit Synthesis", level: 85, acquired: completedCoursesCount >= 2 },
        { name: "Linear Algebra & Hilbert Spaces", level: 94, acquired: true },
        { name: "Variational Quantum Eigensolvers (VQE)", level: 78, acquired: false },
        { name: "Post-Quantum Cryptography (Lattice-Based)", level: 84, acquired: false },
      ],
      recommendedCourseIds: ["qc-401", "ds-301"],
      certifications: ["IBM Quantum Developer", "Certified Quantum Algorithmicist"],
      keyIndustries: ["Pharmaceutical Discovery", "Cryptographic Defense", "Energy Modeling"],
      practicalExamScenario:
        "Simulate molecular ground-state energy minimization using VQE on noisy intermediate-scale quantum (NISQ) circuits with error mitigation filters.",
    },
    {
      id: "cyber_sec",
      title: "Zero-Trust Cybersecurity & Cryptographic Auditor",
      category: "Cybersecurity",
      matchScore: Math.min(96, 75 + completedCoursesCount * 4),
      salaryRange: "$150,000 - $225,000 / yr",
      growthRate: "+32% (Next 5 Years)",
      industryDemand: "Critical",
      summary:
        "Protect critical software supply chains, perform static AST code security audits, and enforce cryptographic zero-trust identity architectures.",
      requiredSkills: [
        { name: "Static AST Code Analysis & Sandboxing", level: 95, acquired: true },
        { name: "Zero-Trust ABAC & Identity Federation", level: 89, acquired: true },
        { name: "Cryptographic Hash Chains & Merkle Trees", level: 91, acquired: true },
        { name: "Threat Modeling & Penetration Testing", level: 83, acquired: completedCoursesCount >= 1 },
      ],
      recommendedCourseIds: ["sec-201", "cs-101"],
      certifications: ["CISSP", "Certified Zero-Trust Security Specialist"],
      keyIndustries: ["Defense & Aerospace", "National Banking", "Health Informatics"],
      practicalExamScenario:
        "Audit an agentic Python code execution module against remote code execution (RCE) and reflection attacks using AST node traversal policies.",
    },
  ], [completedCoursesCount]);

  const activeCareer = careerPaths.find((c) => c.id === selectedCareerId) || careerPaths[0];

  const handleGeneratePlan = () => {
    setIsGeneratingCustomPlan(true);
    setTimeout(() => {
      setCustomPlanOutput(
        `### Personalized AI Career Acceleration Plan for ${user.name || "Scholar"}
**Target Role:** ${activeCareer.title}
**Estimated Readiness:** ${activeCareer.matchScore}% Match

#### Phase 1: Core Competency Mastery (Weeks 1 - 4)
- Complete prerequisite modules in **${courses.find(c => activeCareer.recommendedCourseIds.includes(c.id))?.title || "Agentic Architectures"}**.
- Master **${activeCareer.requiredSkills.find(s => !s.acquired)?.name || "Advanced Consensus"}** through hands-on laboratory exercises.

#### Phase 2: Capstone Project & Practical Exam (Weeks 5 - 8)
- Implement practical exam scenario: *${activeCareer.practicalExamScenario}*
- Benchmark execution latency and verify with automated AST static analysis.

#### Phase 3: Industry Portfolio & Certification (Weeks 9 - 12)
- Publish capstone paper and open-source GitHub repository.
- Complete official **${activeCareer.certifications[0]}** evaluation defense.`
      );
      setIsGeneratingCustomPlan(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-[#030b10]/90 backdrop-blur-xl border border-[#143242] relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Cognitive Career Intelligence
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-widest">
              Level {userLevel} Scholar
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            AI Career Path & <span className="text-cyan-400">Industry Insights</span>
          </h1>
          <p className="text-[#73A5AD] text-sm leading-relaxed">
            Our autonomous evaluation engine continuously analyzes your course completions, quiz accuracies, and lab submissions to chart optimal high-impact career pathways.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={handleGeneratePlan}
            disabled={isGeneratingCustomPlan}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 text-white font-bold text-xs shadow-xl shadow-cyan-950/50 transition-all hover:scale-[1.02]"
          >
            {isGeneratingCustomPlan ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Brain className="w-4 h-4 text-cyan-200" />
            )}
            <span>Generate 12-Week Roadmap</span>
          </button>
        </div>

        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#143242] pb-3 overflow-x-auto">
        {[
          { id: "paths", label: "Matched Career Paths", icon: Compass },
          { id: "skills", label: "Competency Radar", icon: Target },
          { id: "roadmap", label: "12-Week Action Roadmap", icon: TrendingUp },
          { id: "exam", label: "Practical Exam Scenario", icon: FileCheck },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                : "text-[#73A5AD] hover:text-white bg-[#030b10]/60 border border-[#143242]"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Areas */}
      {activeTab === "paths" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Career List (Left Column) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#73A5AD] flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Recommended Pathways ({careerPaths.length})</span>
            </h3>

            <div className="space-y-3">
              {careerPaths.map((career) => {
                const isSelected = career.id === selectedCareerId;
                return (
                  <div
                    key={career.id}
                    onClick={() => setSelectedCareerId(career.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? "bg-[#0c1e2b] border-cyan-500 shadow-xl shadow-cyan-950/40 scale-[1.01]"
                        : "bg-[#030b10]/70 border-[#143242] hover:border-cyan-500/40 hover:bg-[#071720]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                          {career.category}
                        </span>
                        <h4 className="text-base font-bold text-white mt-0.5">
                          {career.title}
                        </h4>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-black">
                          {career.matchScore}% Match
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#143242]/80 flex items-center justify-between text-xs text-[#73A5AD]">
                      <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                        <DollarSign className="w-3.5 h-3.5" />
                        {career.salaryRange}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                        {career.growthRate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Selected Career View (Right Column) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c1e2b]/90 border border-cyan-500/40 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1b3b4a] pb-5">
                <div>
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                    Role Focus • {activeCareer.category}
                  </span>
                  <h2 className="text-2xl font-black text-white mt-1">
                    {activeCareer.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
                    Demand: {activeCareer.industryDemand}
                  </span>
                </div>
              </div>

              <p className="text-sm text-cyan-100 leading-relaxed">
                {activeCareer.summary}
              </p>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-[#030b10] border border-[#143242]">
                  <div className="text-[10px] text-[#73A5AD] uppercase font-bold">Salary Range</div>
                  <div className="text-sm font-black text-cyan-400 mt-1">{activeCareer.salaryRange}</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#030b10] border border-[#143242]">
                  <div className="text-[10px] text-[#73A5AD] uppercase font-bold">5-Yr Growth Rate</div>
                  <div className="text-sm font-black text-cyan-300 mt-1">{activeCareer.growthRate}</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#030b10] border border-[#143242] col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-[#73A5AD] uppercase font-bold">Key Industries</div>
                  <div className="text-xs font-semibold text-white mt-1 truncate">
                    {activeCareer.keyIndustries.join(", ")}
                  </div>
                </div>
              </div>

              {/* Required Competencies & Acquired Status */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  <span>Competency Breakdown</span>
                </h4>

                <div className="space-y-2.5">
                  {activeCareer.requiredSkills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#040e15] border border-[#143242] flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        {skill.acquired ? (
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-cyan-500/40 shrink-0" />
                        )}
                        <div>
                          <div className="text-xs font-bold text-white">{skill.name}</div>
                          <div className="text-[10px] text-[#73A5AD]">Target Proficiency: {skill.level}%</div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          skill.acquired
                            ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                            : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                        }`}
                      >
                        {skill.acquired ? "Acquired" : "In Progress"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Next Courses */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Recommended Academy Courses</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {courses
                    .filter((c) => activeCareer.recommendedCourseIds.includes(c.id))
                    .map((course) => (
                      <div
                        key={course.id}
                        onClick={() => onSelectCourse(course)}
                        className="p-3.5 rounded-2xl bg-[#040e15] border border-[#143242] hover:border-cyan-400/60 transition-all cursor-pointer group flex flex-col justify-between"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl bg-cyan-950/40 border border-cyan-500/20 shrink-0 overflow-hidden">
                            <ThemedCourseImage
                              src={course.coverImage}
                              alt={course.title}
                              category={course.category}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] font-bold uppercase text-cyan-400">
                              {course.level}
                            </span>
                            <h5 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                              {course.title}
                            </h5>
                            <p className="text-[10px] text-[#73A5AD] line-clamp-1 mt-0.5">
                              {course.description}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-[#143242] flex items-center justify-between text-[10px] text-cyan-400 font-bold">
                          <span>Launch Course</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skills Radar Tab */}
      {activeTab === "skills" && (
        <div className="p-8 rounded-3xl bg-[#030b10]/90 border border-[#143242] space-y-6">
          <div className="max-w-xl space-y-2">
            <h3 className="text-xl font-bold text-white">Competency Alignment Radar</h3>
            <p className="text-xs text-[#73A5AD]">
              Multi-dimensional evaluation comparing your current demonstrated capability against top global industry requirements for <strong>{activeCareer.title}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              {activeCareer.requiredSkills.map((skill, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{skill.name}</span>
                    <span className="font-mono text-cyan-400">{skill.level}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#0c1e2b] border border-[#1b3b4a] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        skill.acquired
                          ? "bg-gradient-to-r from-cyan-500 to-cyan-400"
                          : "bg-gradient-to-r from-cyan-500 to-blue-500"
                      }`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-[#0c1e2b]/60 border border-cyan-500/20 space-y-4 text-center">
              <Award className="w-12 h-12 text-cyan-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Ready for Industry Certification</h4>
              <p className="text-xs text-[#73A5AD]">
                You have demonstrated mastery in {activeCareer.requiredSkills.filter(s => s.acquired).length} of {activeCareer.requiredSkills.length} requisite competencies.
              </p>
              <div className="pt-2">
                <span className="inline-block px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs">
                  Target: {activeCareer.certifications[0]}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Roadmap Tab */}
      {activeTab === "roadmap" && (
        <div className="p-8 rounded-3xl bg-[#030b10]/90 border border-[#143242] space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">12-Week AI Career Roadmap</h3>
              <p className="text-xs text-[#73A5AD]">
                Structured milestones crafted by the cognitive orchestrator to advance you into <strong>{activeCareer.title}</strong>.
              </p>
            </div>
            <button
              onClick={handleGeneratePlan}
              disabled={isGeneratingCustomPlan}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
            >
              {isGeneratingCustomPlan ? "Synthesizing..." : "Refresh Strategy"}
            </button>
          </div>

          {customPlanOutput ? (
            <div className="p-6 rounded-2xl bg-[#0c1e2b] border border-cyan-500/30 text-xs text-cyan-100 whitespace-pre-line leading-relaxed">
              {customPlanOutput}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { week: "Weeks 1 - 4", title: "Foundations & Prerequisite Modules", desc: "Complete Core Distributed & Cognitive Architectures" },
                { week: "Weeks 5 - 8", title: "Laboratory Projects & AST Sandboxing", desc: "Build verifiable multi-agent communication pipelines" },
                { week: "Weeks 9 - 12", title: "Capstone Defense & Certification", desc: "Defend capstone submission before the automated rubric" },
              ].map((step, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#0c1e2b] border border-[#1b3b4a] space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">{step.week}</span>
                  <h4 className="text-sm font-bold text-white">{step.title}</h4>
                  <p className="text-xs text-[#73A5AD]">{step.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Practical Exam Tab */}
      {activeTab === "exam" && (
        <div className="p-8 rounded-3xl bg-[#030b10]/90 border border-[#143242] space-y-6">
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
              Simulated Technical Capstone Assessment
            </span>
            <h3 className="text-2xl font-bold text-white">{activeCareer.title} - Practical Examination</h3>
            <p className="text-xs text-[#73A5AD]">
              Industry-grade scenario designed to validate your practical skills under production conditions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c1e2b] border border-cyan-500/30 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              <span>Assessment Objective</span>
            </h4>
            <p className="text-xs text-cyan-100 leading-relaxed font-mono bg-[#030b10] p-4 rounded-xl border border-[#143242]">
              {activeCareer.practicalExamScenario}
            </p>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#73A5AD]">Estimated Time: 90 Minutes • Auto-Graded by AI Rubric</span>
              <button
                onClick={() => {
                  const targetCourse = courses.find((c) => activeCareer.recommendedCourseIds.includes(c.id));
                  if (targetCourse) onSelectCourse(targetCourse);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-600 hover:from-cyan-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/40"
              >
                Begin Practical Exam Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
