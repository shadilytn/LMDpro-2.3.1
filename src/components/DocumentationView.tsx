import React from "react";
import { AutonomousParagraphExplainer } from "./AutonomousParagraphExplainer";
import { ArticleLiveVoiceNarrator } from "./ArticleLiveVoiceNarrator";
import { DeveloperApiEngineView } from "./DeveloperApiEngineView";
import { OpenSourceView } from "./OpenSourceView";
import { DonateSupportView } from "./DonateSupportView";
import {
  COMPREHENSIVE_DOCUMENTATION_DATA,
  DocSection,
} from "../data/comprehensiveDocumentation";
import {
  BookOpen,
  Code2,
  Cpu,
  Key,
  Database,
  Globe,
  Terminal,
  ShieldCheck,
  Zap,
  CheckCircle,
  Copy,
  Check,
  ChevronRight,
  Layers,
  Sparkles,
  Search,
  GraduationCap,
  FileText,
  Github,
  Heart,
} from "lucide-react";

interface DocumentationViewProps {
  initialSubTab?: "manual" | "api" | "opensource" | "donation";
}

export const DocumentationView: React.FC<DocumentationViewProps> = ({
  initialSubTab = "manual",
}) => {
  const [docSubTab, setDocSubTab] = React.useState<
    "manual" | "api" | "opensource" | "donation"
  >(initialSubTab);
  const [copiedSection, setCopiedSection] = React.useState<string | null>(null);
  const [activeCategory, setActiveCategory] = React.useState<
    | "all"
    | "overview"
    | "academics"
    | "architecture"
    | "apis"
    | "setup"
    | "security"
  >("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const copyCode = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const filteredDocs = COMPREHENSIVE_DOCUMENTATION_DATA.filter((doc) => {
    const matchesCategory =
      activeCategory === "all" || doc.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.contentMarkdown.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Documentation Sub-Tab Navigator */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#091821] border border-[#193949] w-fit">
        {[
          {
            id: "manual",
            label: "Platform Manual & Architecture",
            icon: FileText,
            badge: "Docs",
          },
          {
            id: "api",
            label: "Developer API Console",
            icon: Code2,
            badge: "APIs",
          },
          {
            id: "opensource",
            label: "Open Source Hub",
            icon: Github,
            badge: "GitHub",
          },
          {
            id: "donation",
            label: "Donation & Non-Profit Fund",
            icon: Heart,
            badge: "Support",
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = docSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setDocSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all transform active:scale-95 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg"
                  : "text-[#7e9fb0] hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : ""}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded border ${isActive ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-200" : "bg-[#061015] border-[#163647] text-[#5e8292]"}`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {docSubTab === "api" ? (
        <DeveloperApiEngineView />
      ) : docSubTab === "opensource" ? (
        <OpenSourceView />
      ) : docSubTab === "donation" ? (
        <DonateSupportView />
      ) : (
        <>
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0e212b] via-[#102733] to-[#0a171f] border border-[#1d3d4c] p-8 md:p-10 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Master Documentation & System Architecture Manual</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                LMD<span className="text-cyan-400 font-light">pro</span>{" "}
                Platform Architecture & Documentation
              </h1>
              <p className="text-sm md:text-base text-[#88acbd] leading-relaxed">
                Comprehensive developer manual and academic specification
                covering universal degree accreditation, ECTS credit
                transferability, Gemini 3.1 Pro cognitive architecture, edge PII
                redaction, non-profit open-source infrastructure, and developer
                REST APIs.
              </p>
            </div>
          </div>

          {/* Live Voice Discussion & Socratic Agent Bar */}
          <ArticleLiveVoiceNarrator
            lessonTitle="LMDpro Master Documentation & Architecture Specification"
            lessonContent="LMDpro is a 100% free, non-profit, open-source educational platform engineered to provide universal access to accredited degree pathways, personalized Kudo Agent AI tutoring, and adaptive skill development for every human being on Earth without financial paywalls."
          />

          {/* Search & Category Filter Navigation */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#091821] p-3 rounded-2xl border border-[#193949]">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#5e8292] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search documentation, ECTS credits, APIs, Gemini architecture..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#040e13] border border-[#163647] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: "all", label: "All Docs", icon: FileText },
                  { id: "overview", label: "Overview", icon: BookOpen },
                  {
                    id: "academics",
                    label: "Academic & ECTS",
                    icon: GraduationCap,
                  },
                  { id: "architecture", label: "Hybrid AI Engine", icon: Cpu },
                  { id: "apis", label: "APIs & WebSockets", icon: Code2 },
                  { id: "setup", label: "Setup & Keys", icon: Key },
                  {
                    id: "security",
                    label: "Security & PII",
                    icon: ShieldCheck,
                  },
                ].map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md"
                          : "text-[#7e9fb0] hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : ""}`}
                      />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dynamic Documentation Parsing Grid */}
          <div className="space-y-8">
            {filteredDocs.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#0b1a23] border border-[#1a3847] space-y-3">
                <Search className="w-8 h-8 text-[#517382] mx-auto animate-bounce" />
                <h3 className="text-sm font-bold text-white">
                  No documentation sections match your search query
                </h3>
                <p className="text-xs text-[#6e8f9f]">
                  Try searching for 'ECTS', 'Gemini', 'API', 'PII', or reset
                  your search filter.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-xs hover:bg-cyan-500/30"
                >
                  Reset Search Filter
                </button>
              </div>
            ) : (
              filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-3xl bg-gradient-to-b from-[#0b1a23] to-[#08131a] border border-[#1c3e4f] p-6 md:p-8 space-y-6 shadow-xl relative"
                >
                  {/* Header Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#163647] pb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/30">
                        {doc.badgeText}
                      </span>
                      <span className="text-xs font-mono text-[#6c8f9f]">
                        ID: {doc.id}
                      </span>
                    </div>
                    <button
                      onClick={() => copyCode(doc.contentMarkdown, doc.id)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#061015] border border-[#1b3d4f] text-[11px] font-bold text-cyan-300 hover:text-white transition-all"
                    >
                      {copiedSection === doc.id ? (
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {copiedSection === doc.id
                          ? "Copied"
                          : "Copy Section Markdown"}
                      </span>
                    </button>
                  </div>

                  {/* Title & Summary */}
                  <div className="space-y-2">
                    <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                      {doc.title}
                    </h2>
                    <p className="text-xs md:text-sm text-[#87a9b9] leading-relaxed">
                      {doc.summary}
                    </p>
                  </div>

                  {/* Parsed Markdown Body */}
                  <div className="pred pred-invert max-w-none text-xs md:text-sm text-gray-300 space-y-4 leading-relaxed whitespace-pre-line bg-[#051117] p-5 rounded-2xl border border-[#143242]">
                    {doc.contentMarkdown}
                  </div>

                  {/* Interactive Visual Explainer Model */}
                  <AutonomousParagraphExplainer
                    lessonTitle={doc.title}
                    lessonContent={doc.summary}
                  />

                  {/* Code Snippet Box if available */}
                  {doc.codeSnippet && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-[#5b7e8e]">
                        <span>
                          Code Specification ({doc.codeSnippet.language})
                        </span>
                        <button
                          onClick={() =>
                            copyCode(doc.codeSnippet!.code, `${doc.id}-code`)
                          }
                          className="text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          {copiedSection === `${doc.id}-code` ? (
                            <Check className="w-3 h-3 text-cyan-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>Copy Code</span>
                        </button>
                      </div>
                      <div className="bg-[#030a0e] p-4 rounded-xl border border-[#143140] font-mono text-xs text-cyan-200 overflow-x-auto">
                        <pre>{doc.codeSnippet.code}</pre>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};
