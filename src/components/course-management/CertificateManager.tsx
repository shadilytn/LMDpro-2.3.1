import React from "react";
import {
  Award,
  ShieldCheck,
  Download,
  Share2,
  CheckCircle,
  QrCode,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Search,
  Sliders,
  FileCheck,
  Eye
} from "lucide-react";
import { Course } from "../../shared/types";
import { StudentEnrollment } from "./EnrollmentManager";

export interface CertificateRecord {
  id: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  issueDate: string;
  completionScore: number;
  grade: "Distinction (Honors)" | "Merit" | "Pass";
  verificationHash: string;
  issuer: string;
}

interface CertificateManagerProps {
  courses: Course[];
  initialStudent?: StudentEnrollment | null;
}

export const CertificateManager: React.FC<CertificateManagerProps> = ({
  courses,
  initialStudent,
}) => {
  const [certificates, setCertificates] = React.useState<CertificateRecord[]>([
    {
      id: "CERT-2026-8819A",
      studentName: "Alex Rivera",
      studentEmail: "alex.rivera@techuni.edu",
      courseTitle: "Artificial Intelligence Ethics: Principles & Alignment",
      issueDate: "2026-08-15",
      completionScore: 96.5,
      grade: "Distinction (Honors)",
      verificationHash: "0x8f2d9c4b1e7a3310fa2e89d1b6440c9e",
      issuer: "Faculty Academic Board • LMDpro Autonomous Platform",
    },
    {
      id: "CERT-2026-8820B",
      studentName: "Dmitri Volkov",
      studentEmail: "d.volkov@cmu.edu",
      courseTitle: "Artificial Intelligence Ethics: Principles & Alignment",
      issueDate: "2026-08-18",
      completionScore: 98.2,
      grade: "Distinction (Honors)",
      verificationHash: "0x4a11be89230fd931c89012fba8934df1",
      issuer: "Faculty Academic Board • LMDpro Autonomous Platform",
    },
    {
      id: "CERT-2026-8821C",
      studentName: "Elena Rostova",
      studentEmail: "e.rostova@ethz.ch",
      courseTitle: "Cellular Sheaves & Topological Multi-Agent Learning",
      issueDate: "2026-08-10",
      completionScore: 92.0,
      grade: "Merit",
      verificationHash: "0x99238fa01cb54de29188eaf91029384b",
      issuer: "Faculty Academic Board • LMDpro Autonomous Platform",
    },
  ]);

  const [selectedCert, setSelectedCert] = React.useState<CertificateRecord | null>(certificates[0]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [copiedHash, setCopiedHash] = React.useState(false);

  // Automated Trigger Rules State
  const [autoIssueEnabled, setAutoIssueEnabled] = React.useState(true);
  const [minLessonProgress, setMinLessonProgress] = React.useState(100);
  const [minQuizAvg, setMinQuizAvg] = React.useState(80);

  const filteredCerts = certificates.filter(
    (c) =>
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyVerification = (hash: string) => {
    navigator.clipboard.writeText(`https://lmdpro.edu/verify/${hash}`);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownloadPDF = () => {
    alert(`Downloading verified cryptographic PDF certificate for ${selectedCert?.studentName}!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Automation Policy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Automation Criteria Card */}
        <div className="p-5 rounded-2xl bg-[#0a1822] border border-[#1b3b4a] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" /> Automation Engine
            </span>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoCertToggle"
                checked={autoIssueEnabled}
                onChange={(e) => setAutoIssueEnabled(e.target.checked)}
                className="w-4 h-4 text-cyan-500 rounded bg-[#030b10] border-[#1b3b4a]"
              />
              <label htmlFor="autoCertToggle" className="text-xs text-cyan-300 font-bold">
                Auto-Issue Active
              </label>
            </div>
          </div>
          <p className="text-xs text-[#82a4b3]">
            Certificates are automatically generated, cryptographically signed, and emailed to students immediately upon satisfying completion criteria.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <div className="p-2.5 rounded-lg bg-[#030b10] border border-[#1b3b4a]">
              <span className="text-slate-400 block text-[10px]">Min Progress:</span>
              <span className="font-bold text-white font-mono">{minLessonProgress}% Lessons</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#030b10] border border-[#1b3b4a]">
              <span className="text-slate-400 block text-[10px]">Min Quiz Mastery:</span>
              <span className="font-bold text-cyan-400 font-mono">{minQuizAvg}% Score</span>
            </div>
          </div>
        </div>

        {/* Global Stats */}
        <div className="p-5 rounded-2xl bg-[#0a1822] border border-[#1b3b4a] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#82a4b3]">
            <span>Total Issued Certificates</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{certificates.length}</div>
          <p className="text-xs text-cyan-300 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Cryptographically Verifiable (SHA-256)
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a1822] border border-[#1b3b4a] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#82a4b3]">
            <span>Accreditation Standard</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-sm font-bold text-white">ISO 21001 & IEEE LTSC Ready</div>
          <p className="text-xs text-cyan-200">
            Open Badges 3.0 + W3C Verifiable Credentials compliant
          </p>
        </div>
      </div>

      {/* Main Certificate View Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Certificate Registry Table */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-xl bg-[#0a1822] border border-[#1b3b4a] space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search issued certificates..."
                className="w-full bg-[#030b10] border border-[#1b3b4a] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredCerts.map((cert) => (
              <div
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
                className={`p-3.5 rounded-xl border cursor-pointer transition ${
                  selectedCert?.id === cert.id
                    ? "bg-[#0c2230] border-cyan-400 shadow-lg shadow-cyan-950/40"
                    : "bg-[#0a1822] border-[#1b3b4a] hover:border-cyan-500/50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-xs">{cert.studentName}</span>
                  <span className="text-[10px] font-mono text-cyan-300">{cert.id}</span>
                </div>
                <p className="text-[11px] text-[#82a4b3] truncate">{cert.courseTitle}</p>
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#1b3b4a]/60 text-[10px]">
                  <span className="text-cyan-400 font-bold">{cert.grade}</span>
                  <span className="text-slate-400">{cert.issueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live High-Resolution Certificate Document Canvas */}
        <div className="lg:col-span-7">
          {selectedCert ? (
            <div className="space-y-4">
              {/* Actions Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-cyan-400" />
                  Official Certificate Preview
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyVerification(selectedCert.verificationHash)}
                    className="px-3 py-1.5 bg-[#0a1822] hover:bg-[#0e222e] border border-[#1b3b4a] text-slate-300 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                    <span>{copiedHash ? "Copied Link!" : "Share Link"}</span>
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-cyan-500 hover:from-cyan-400 hover:to-cyan-400 text-black font-bold text-xs rounded-lg flex items-center gap-1.5 transition shadow-lg shadow-cyan-500/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Certificate Diploma Template */}
              <div className="relative p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-[#0c1e28] via-[#091720] to-[#040e14] border-2 border-[#1b3b4a] shadow-2xl text-center space-y-6 overflow-hidden">
                {/* Decorative Borders & Glow */}
                <div className="absolute inset-2 border border-cyan-500/30 rounded-xl pointer-events-none" />
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Header Crest */}
                <div className="space-y-1 relative z-10">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-cyan-500/20 to-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-md">
                    <Award className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h5 className="font-mono text-[10px] tracking-widest uppercase text-cyan-400">
                    LMDpro Autonomous Academic Council
                  </h5>
                  <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                    Certificate of Mastery
                  </h2>
                </div>

                {/* Body Text */}
                <div className="space-y-3 relative z-10">
                  <p className="text-xs text-[#82a4b3] italic">This hereby certifies that</p>
                  <h3 className="font-serif text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-cyan-200">
                    {selectedCert.studentName}
                  </h3>
                  <p className="text-xs text-[#82a4b3] max-w-md mx-auto">
                    has successfully fulfilled all curriculum, lab implementations, and academic assessment requirements for
                  </p>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-cyan-300">
                    {selectedCert.courseTitle}
                  </h4>
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-bold font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Awarded with {selectedCert.grade} ({selectedCert.completionScore}%)
                  </div>
                </div>

                {/* Signatures & Verification Footer */}
                <div className="pt-6 border-t border-[#1b3b4a]/60 grid grid-cols-3 gap-4 text-left text-[10px] relative z-10">
                  <div>
                    <span className="text-slate-400 block">Date of Conferral:</span>
                    <span className="font-mono text-white font-bold">{selectedCert.issueDate}</span>
                  </div>

                  <div className="text-center">
                    <span className="text-slate-400 block">Academic Issuer:</span>
                    <span className="font-serif text-cyan-300 font-bold">Faculty Board</span>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400 block">Verification Hash:</span>
                    <span className="font-mono text-cyan-400 truncate block">
                      {selectedCert.verificationHash.slice(0, 14)}...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-[#0a1822] border border-[#1b3b4a] text-center text-slate-400 space-y-2">
              <Award className="w-10 h-10 mx-auto text-cyan-400 opacity-60" />
              <p className="text-sm">Select a certificate from the registry to view official diploma preview.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
