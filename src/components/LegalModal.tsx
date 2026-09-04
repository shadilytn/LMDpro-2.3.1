import React from "react";
import {
  X,
  ShieldCheck,
  FileText,
  Lock,
  Scale,
  CheckCircle,
} from "lucide-react";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "privacy" | "terms" | "license";
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  defaultTab = "privacy",
}) => {
  const [activeTab, setActiveTab] = React.useState<"privacy" | "terms" | "license">(
    defaultTab,
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in">
      <div className="bg-[#0b1820] border border-[#1b3d4f] rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-[#0a151b] via-[#0d202b] to-[#0a151b] border-b border-[#183646] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                LMDpro Legal & Governance
              </h3>
              <p className="text-xs text-[#7fa1b2]">
                Educational Data Protection & Institutional Policies
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy Selector Tabs */}
        <div className="flex items-center gap-1 bg-[#09141a] px-4 py-2 border-b border-[#16303d] text-xs">
          {[
            { id: "privacy", label: "Privacy Policy", icon: Lock },
            { id: "terms", label: "Terms of Service", icon: FileText },
            { id: "license", label: "Academic & Open License", icon: Scale },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "text-[#7e9faf] hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5 text-xs leading-relaxed text-gray-300">
          {activeTab === "privacy" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0e212b] border border-cyan-500/20 space-y-1">
                <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  Privacy Policy & Student Data Shield (FERPA & GDPR Compliant)
                </h4>
                <p className="text-[11px] text-[#82a4b3]">
                  Last Updated: July 2026 • LMDpro Global Academic Standards
                </p>
              </div>

              <section className="space-y-2">
                <h5 className="font-bold text-white text-xs">
                  1. Scope of Educational Privacy
                </h5>
                <p>
                  LMDpro is committed to providing universal education without
                  compromise. Your academic progress, quiz scores, project
                  submissions, and interaction logs with{" "}
                  <strong>Kudo Agent</strong> are stored securely in encrypted
                  local offline storage and isolated Cloud Firestore instances.
                </p>
              </section>

              <section className="space-y-2">
                <h5 className="font-bold text-white text-xs">
                  2. Zero Monetization of Student Data
                </h5>
                <p>
                  We strictly prohibit selling, renting, or transferring student
                  personal data or AI dialogue transcripts to third-party ad
                  networks or data brokers. All prompt evaluations with Kudo
                  Agent are sanitized using on-device edge PII redaction.
                </p>
              </section>

              <section className="space-y-2">
                <h5 className="font-bold text-white text-xs">
                  3. Local First & Offline Data Control
                </h5>
                <p>
                  You hold complete ownership of your academic certificates and
                  course notes. When offline mode is enabled, 100% of your
                  progress stays on your device inside IndexDB and LocalStorage
                  without reaching network servers.
                </p>
              </section>
            </div>
          )}

          {activeTab === "terms" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0e212b] border border-cyan-500/20 space-y-1">
                <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  Terms & Conditions of Academic Enrollment
                </h4>
                <p className="text-[11px] text-[#82a4b3]">
                  LMDpro Open Educational Charter
                </p>
              </div>

              <section className="space-y-2">
                <h5 className="font-bold text-white text-xs">
                  1. Open Access & Universal Right to Learn
                </h5>
                <p>
                  All degree pathways (Licence, Master, Doctorate) on LMDpro are
                  accessible without tuition paywalls. Learners from any region
                  or background are granted unrestricted enrollment access.
                </p>
              </section>

              <section className="space-y-2">
                <h5 className="font-bold text-white text-xs">
                  2. Academic Integrity & Capstone Verification
                </h5>
                <p>
                  Verified Certificates issued by LMDpro require passing
                  automated capstone evaluations, Socratic viva voce
                  examinations with Kudo Agent, and practical code/research
                  submissions.
                </p>
              </section>

              <section className="space-y-2">
                <h5 className="font-bold text-white text-xs">
                  3. Code of Conduct
                </h5>
                <p>
                  Learners and faculty agree to foster an inclusive, respectful
                  intellectual community, refraining from plagiarism, malicious
                  prompt injection attacks, or abusive automation.
                </p>
              </section>
            </div>
          )}

          {activeTab === "license" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0e212b] border border-cyan-500/20 space-y-1">
                <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-cyan-400" />
                  Academic License & Creative Commons (CC BY-SA 4.0)
                </h4>
                <p className="text-[11px] text-[#82a4b3]">
                  Open Source Intelligence & Open Courseware
                </p>
              </div>

              <section className="space-y-2">
                <h5 className="font-bold text-white text-xs">
                  1. Creative Commons ShareAlike
                </h5>
                <p>
                  All curriculum materials, interactive simulators, and degree
                  outlines generated by LMDpro are licensed under CC BY-SA 4.0.
                  You are free to share, adapt, and build upon these educational
                  materials provided appropriate credit is given.
                </p>
              </section>

              <section className="space-y-2">
                <h5 className="font-bold text-white text-xs">
                  2. Open Source Platform Engine
                </h5>
                <p>
                  The underlying React + TypeScript frontend and Gemini AI
                  backend integrations are distributed under the MIT License,
                  enabling universities and educators to self-host custom LMDpro
                  instances worldwide.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#09141a] border-t border-[#183646] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#7ea0b1]">
            <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>LMDpro Governance & Privacy Shield Active</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors shadow-md"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
