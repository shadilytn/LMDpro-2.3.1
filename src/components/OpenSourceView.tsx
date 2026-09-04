import React from "react";
import {
  Code2,
  GitBranch,
  Github,
  FileCode,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Layers,
  Terminal,
  Heart,
  Users,
  Copy,
  Check,
  Cpu,
} from "lucide-react";

export const OpenSourceView: React.FC = () => {
  const [copiedPatch, setCopiedPatch] = React.useState(false);
  const [selectedIssue, setSelectedIssue] = React.useState<number>(2557);

  const sslPatchText = `--- a/google/genai/_client.py
+++ b/google/genai/_client.py
@@ -142,5 +142,5 @@ class Client:
-        if http_options.verify:
+        if http_options.verify is not None:
             client_args['verify'] = http_options.verify`;

  const copyPatch = () => {
    navigator.clipboard.writeText(sslPatchText);
    setCopiedPatch(true);
    setTimeout(() => setCopiedPatch(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1e28] via-[#102733] to-[#07131a] border border-[#1d3d4c] p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
            <Github className="w-3.5 h-3.5" />
            <span>Open Source Hub & Community Repositories</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            100% Free & Open Source for Humanity
          </h1>
          <p className="text-sm md:text-base text-[#88acbd] leading-relaxed">
            Zalamati LMDpro is built completely in the open under MIT and Apache
            2.0 licenses. Every line of code, cognitive router, and AI agent
            pipeline is publicly auditable and community-owned.
          </p>
        </div>
      </div>

      {/* Repositories Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[
          {
            name: "googleapis/python-genai",
            stars: "4.8k",
            forks: "890",
            license: "Apache-2.0",
            description:
              "Official Google DeepMind Gemini Python SDK backing the Zalamati cognitive router.",
            link: "https://github.com/googleapis/python-genai",
          },
          {
            name: "zalamati-lmdpro-core",
            stars: "2.1k",
            forks: "340",
            license: "MIT License",
            description:
              "The primary web application platform, UI bento layouts, and Socratic tutoring frontend.",
            link: "https://github.com/shadilytn",
          },
          {
            name: "zalamati-rag-engine",
            stars: "1.4k",
            forks: "210",
            license: "Apache-2.0",
            description:
              "Multimodal vector search, academic PDF scraping, and citation verification engine.",
            link: "https://github.com/shadilytn",
          },
        ].map((repo, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-[#10222c] border border-[#1c3c4b] space-y-4 hover:border-cyan-500/40 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-300">
                  {repo.name}
                </span>
                <span className="text-[10px] text-[#5e8191] bg-[#071116] px-2 py-0.5 rounded border border-[#183544]">
                  {repo.license}
                </span>
              </div>
              <p className="text-xs text-[#7e9fb0] leading-relaxed">
                {repo.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#1a3847] flex items-center justify-between text-xs text-[#638797]">
              <div className="flex items-center gap-3 font-mono">
                <span>⭐ {repo.stars}</span>
                <span>🍴 {repo.forks}</span>
              </div>
              <a
                href={repo.link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-cyan-400 hover:underline font-semibold"
              >
                <span>View Repo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Autonomous Patching & Issue Diagnostic Center */}
      <div className="p-6 rounded-2xl bg-[#10222c] border border-[#1c3c4b] space-y-5">
        <div className="flex items-center justify-between border-b border-[#1b3846] pb-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              Autonomous GitHub Issue Patching Sandbox
            </h2>
            <p className="text-xs text-[#7d9fbe]">
              Inspect and apply real-time patch fixes for open SDK issues.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[2557, 2406].map((issueNum) => (
              <button
                key={issueNum}
                onClick={() => setSelectedIssue(issueNum)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                  selectedIssue === issueNum
                    ? "bg-[#153444] text-cyan-300 border border-cyan-500/40"
                    : "bg-[#09151c] text-[#5e8191] border border-[#183544]"
                }`}
              >
                Issue #{issueNum}
              </button>
            ))}
          </div>
        </div>

        {selectedIssue === 2557 ? (
          <div className="space-y-3">
            <div className="text-xs text-white font-semibold">
              Issue #2557:{" "}
              <span className="text-cyan-300">
                HttpOptions Overrides verify=False due to Truthiness Bug
              </span>
            </div>
            <p className="text-xs text-[#7e9fb0]">
              Passing <code>client_args=&#123;'verify': False&#125;</code> was
              being evaluated as falsy in Python, resetting SSL verification
              back to true in proxy environments.
            </p>

            <div className="relative bg-[#071116] p-4 rounded-xl border border-[#1a3847] font-mono text-[11px] text-cyan-300">
              <pre>{sslPatchText}</pre>
              <button
                onClick={copyPatch}
                className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded bg-[#112733] hover:bg-[#193747] text-[11px] text-cyan-300 border border-[#1f4254] transition-all"
              >
                {copiedPatch ? (
                  <Check className="w-3 h-3 text-cyan-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedPatch ? "Patch Copied" : "Copy .patch"}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs text-white font-semibold">
              Issue #2406:{" "}
              <span className="text-cyan-300">
                thought_signature Field Stripping in Gemini 3.1 Tools
              </span>
            </div>
            <p className="text-xs text-[#7e9fb0]">
              Gemini 3.1 reasoning models include a{" "}
              <code>thought_signature</code> during function calls. The SDK was
              dropping this field during response serialization, causing 400
              INVALID_ARGUMENT errors. Fixed in current release.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
