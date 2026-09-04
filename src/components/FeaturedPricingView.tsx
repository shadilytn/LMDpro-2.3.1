import React from "react";
import {
  GraduationCap,
  Heart,
  Building2,
  Building,
  Sparkles,
  Check,
  ShieldCheck,
  Zap,
  ArrowRight,
  Send,
  Users,
  Briefcase,
  Globe,
} from "lucide-react";

interface FeaturedPricingViewProps {
  onOpenWorkspaceAuth?: () => void;
}

export const FeaturedPricingView: React.FC<FeaturedPricingViewProps> = ({
  onOpenWorkspaceAuth,
}) => {
  const TIERS = [
    {
      id: "student",
      name: "Students & Learners",
      badge: "Free Lifetime",
      badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
      price: "$0",
      period: "forever for verified students",
      description:
        "Full unhindered access to degree catalogs, Socratic AI tutor, Pomodoro study studio, and verified certificate pathways.",
      features: [
        "100% Free Lifetime Student Subscription",
        "Unlimited AI Course Generation & Socratic Tutor",
        "Pomodoro Focus Studio & Telemetry Logging",
        "Accredited Certificate Generation",
        "Google Workspace & Drive Integration",
      ],
      buttonText: "Start Learning Free",
      buttonClass:
        "bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold",
      action: () => (window.location.href = "https://lmdpro.app/"),
    },
    {
      id: "nonprofit",
      name: "Non-Profits & NGO Support",
      badge: "Supported Grant",
      badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
      price: "$0",
      period: "sponsocyan non-profit grant",
      description:
        "LMDpro empowers charitable and non-profit educational missions worldwide with free institutional licenses.",
      features: [
        "Full Non-Profit Grant & Zero Cost Access",
        "Unlimited Cohort Student Enrollments",
        "Custom Curriculum Uploads & Vector RAG",
        "Real-time Multilingual Arabic & Global Voices",
        "Dedicated Non-Profit Support Channel",
      ],
      buttonText: "Apply for Non-Profit Grant",
      buttonClass:
        "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold",
      action: () => (window.location.href = "https://lmdpro.app/nonprofit"),
    },
    {
      id: "academic",
      name: "Schools, Colleges & Universities",
      badge: "Academic License",
      badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
      price: "$29",
      period: "per educator seat / month",
      description:
        "Enterprise LMS integration, Canvas/Blackboard/Google Classroom sync, and AI curriculum authoring for faculties.",
      features: [
        "Google Classroom & LMS Synchronization",
        "Faculty AI Course Architect Studio",
        "Student Cohort Analytics & Plagiarism Auditing",
        "FERPA & GDPR Compliance Architecture",
        "Custom Domain & Branded Campus Portal",
      ],
      buttonText: "Request University Demo",
      buttonClass:
        "bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 font-extrabold hover:brightness-110",
      action: () => (window.location.href = "https://lmdpro.app/academic"),
    },
    {
      id: "enterprise",
      name: "Teams, Businesses & Enterprises",
      badge: "Full Suite",
      badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
      price: "$99",
      period: "per team / month",
      description:
        "Private Cloud Run containers, single sign-on (SSO), private vector knowledge bases, and custom fine-tuned Gemini models.",
      features: [
        "Private Dedicated Cloud Run Instance",
        "SAML / Okta / Google Workspace SSO",
        "Custom Gemini Model Fine-Tuning",
        "Enterprise Knowledge Base RAG Ingestion",
        "99.99% Uptime SLA & 24/7 Priority Support",
      ],
      buttonText: "Contact Enterprise Sales",
      buttonClass:
        "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold",
      action: () => (window.location.href = "https://lmdpro.app/enterprise"),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0e212b] via-[#102733] to-[#09151c] border border-[#1e3e4f] p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-extrabold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Universal Education Platform Architecture</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Plans & Institutional Tiers
          </h1>
          <p className="text-sm text-[#82a3b2] leading-relaxed">
            LMDpro provides 100% free lifetime access for all students and
            supported non-profits, alongside tailored enterprise solutions for
            universities, research centers, and global organizations.
          </p>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            className="rounded-3xl bg-[#0e212b] border border-[#1e3e4f] hover:border-cyan-500/40 p-6 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden group transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${tier.badgeColor}`}
                >
                  {tier.badge}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                <p className="text-xs text-[#7193a2] mt-1 leading-relaxed">
                  {tier.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#1a3848]">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">
                    {tier.price}
                  </span>
                  <span className="text-xs text-[#7193a2] font-medium">
                    {tier.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-2.5 pt-2 text-xs">
                {tier.features.map((feat, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-[#a2c1cf]"
                  >
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={tier.action}
              className={`w-full py-3 px-4 rounded-2xl text-xs transition-all transform active:scale-95 flex items-center justify-center gap-2 ${tier.buttonClass}`}
            >
              <span>{tier.buttonText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
