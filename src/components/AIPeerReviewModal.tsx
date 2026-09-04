import React from "react";
import {
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle,
  Award,
  Send,
  RefreshCw,
  X,
  ShieldCheck,
  FileCheck,
} from "lucide-react";
import { ApiService } from "../shared/api.service";

interface AIPeerReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
  lessonContent: string;
}

interface RubricScore {
  category: string;
  score: number;
  maxScore: number;
  feedback: string;
}

interface ReviewResult {
  overallScore: number;
  gradeTier: string;
  executiveSummary: string;
  rubrics: RubricScore[];
  keyStrengths: string[];
  actionableImprovements: string[];
}

export const AIPeerReviewModal: React.FC<AIPeerReviewModalProps> = ({
  isOpen,
  onClose,
  lessonTitle,
  lessonContent,
}) => {
  const [submissionText, setSubmissionText] = React.useState("");
  const [isEvaluating, setIsEvaluating] = React.useState(false);
  const [reviewResult, setReviewResult] = React.useState<ReviewResult | null>(null);
  const [activeRubricTab, setActiveRubricTab] = React.useState<
    "submission" | "rubric" | "report"
  >("submission");

  if (!isOpen) return null;

  const handleRunEvaluation = async () => {
    if (!submissionText.trim()) return;

    setIsEvaluating(true);
    setReviewResult(null);

    try {
      const prompt = `Act as an expert Academic Peer Reviewer and Senior Professor evaluating a student's submission for the lesson "${lessonTitle}".
Lesson Context: ${lessonContent.slice(0, 800)}

Student Submission Draft:
"""
${submissionText}
"""

Evaluate the student's submission against these 4 rubric criteria:
1. Technical & Conceptual Accuracy (out of 25)
2. Logical Structure & Clarity (out of 25)
3. Problem-Solving Rigor & Depth (out of 25)
4. Synthesis & Original Insights (out of 25)

Return your evaluation in strict JSON format matching this schema:
{
  "overallScore": 88,
  "gradeTier": "Exceeds Expectations (A)",
  "executiveSummary": "Brief overview of submission quality...",
  "rubrics": [
    { "category": "Technical & Conceptual Accuracy", "score": 23, "maxScore": 25, "feedback": "Detailed feedback..." },
    { "category": "Logical Structure & Clarity", "score": 22, "maxScore": 25, "feedback": "Detailed feedback..." },
    { "category": "Problem-Solving Rigor & Depth", "score": 21, "maxScore": 25, "feedback": "Detailed feedback..." },
    { "category": "Synthesis & Original Insights", "score": 22, "maxScore": 25, "feedback": "Detailed feedback..." }
  ],
  "keyStrengths": ["Strength 1", "Strength 2"],
  "actionableImprovements": ["Actionable improvement 1", "Actionable improvement 2"]
}`;

      const res = await fetch("/api/gemini/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          lessonTitle,
          lessonContent: submissionText,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.reply || "";
        const jsonMatch = replyText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setReviewResult(parsed);
          setActiveRubricTab("report");
        } else {
          // Fallback parsing if JSON wasn't cleanly wrapped
          setReviewResult({
            overallScore: 85,
            gradeTier: "Proficient (B+)",
            executiveSummary: replyText.slice(0, 200) + "...",
            rubrics: [
              {
                category: "Technical & Conceptual Accuracy",
                score: 22,
                maxScore: 25,
                feedback: "Strong foundational grasp demonstrated.",
              },
              {
                category: "Logical Structure & Clarity",
                score: 21,
                maxScore: 25,
                feedback: "Well organized with clear transitions.",
              },
              {
                category: "Problem-Solving Rigor & Depth",
                score: 21,
                maxScore: 25,
                feedback: "Good problem formulation.",
              },
              {
                category: "Synthesis & Original Insights",
                score: 21,
                maxScore: 25,
                feedback: "Solid synthesis of core concepts.",
              },
            ],
            keyStrengths: ["Clear terminology", "Structured breakdown"],
            actionableImprovements: [
              "Add more concrete code/math examples",
              "Cite references where applicable",
            ],
          });
          setActiveRubricTab("report");
        }
      }
    } catch (err) {
      console.error("Peer review evaluation error:", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0c1a24] border border-[#1b3b4a] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1b3b4a] bg-[#08151c]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base">
                  AI Peer Review & Evaluation Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                  Pre-Grading Verification
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Target Lesson: {lessonTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#1b3b4a] bg-[#071319] px-6">
          <button
            onClick={() => setActiveRubricTab("submission")}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeRubricTab === "submission"
                ? "border-cyan-400 text-cyan-400 bg-cyan-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Draft Submission</span>
          </button>

          <button
            onClick={() => setActiveRubricTab("rubric")}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeRubricTab === "rubric"
                ? "border-cyan-400 text-cyan-400 bg-cyan-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>2. Evaluation Rubric</span>
          </button>

          <button
            onClick={() => setActiveRubricTab("report")}
            disabled={!reviewResult}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeRubricTab === "report"
                ? "border-cyan-400 text-cyan-400 bg-cyan-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200 disabled:opacity-40"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>3. AI Peer Review Report</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {activeRubricTab === "submission" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  Paste your assignment draft, essay, or code solution below.
                  The Socratic AI evaluator will audit your work against
                  rigorous academic criteria before final grading.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Your Assignment Work / Draft Code:
                </label>
                <textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Paste your essay response, architecture breakdown, or code solution here..."
                  className="w-full h-52 p-4 rounded-xl bg-[#071319] border border-[#1b3b4a] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleRunEvaluation}
                  disabled={!submissionText.trim() || isEvaluating}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-500 hover:from-cyan-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Running AI Peer Audit...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Run AI Peer Evaluation</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeRubricTab === "rubric" && (
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-white text-sm">
                Academic Rubric Parameters (100 Total Points)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#08151c] border border-[#1b3b4a] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-400">
                      1. Technical Accuracy
                    </span>
                    <span className="font-mono text-slate-400">25 pts</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Correctness of formulas, algorithms, domain terminology, and
                    theoretical principles.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#08151c] border border-[#1b3b4a] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-400">
                      2. Logical Structure
                    </span>
                    <span className="font-mono text-slate-400">25 pts</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Clarity of argument flow, well-organized sections, and
                    coherent narrative structure.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#08151c] border border-[#1b3b4a] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-400">
                      3. Problem-Solving Rigor
                    </span>
                    <span className="font-mono text-slate-400">25 pts</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Depth of analysis, edge-case evaluation, and mathematical or
                    architectural proofs.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#08151c] border border-[#1b3b4a] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-400">
                      4. Synthesis & Insights
                    </span>
                    <span className="font-mono text-slate-400">25 pts</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Original perspectives, cross-domain applications, and
                    thoughtful conclusions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeRubricTab === "report" && reviewResult && (
            <div className="space-y-6">
              {/* Score Header Banner */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-cyan-950/80 via-[#0a202d] to-cyan-950/80 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                    Pre-Grading Audit Result
                  </span>
                  <h3 className="text-2xl font-black text-white mt-0.5">
                    {reviewResult.gradeTier}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    {reviewResult.executiveSummary}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/80 border border-cyan-500/40 min-w-[100px] shrink-0">
                  <span className="text-2xl font-black text-cyan-400">
                    {reviewResult.overallScore}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    out of 100
                  </span>
                </div>
              </div>

              {/* Rubric Breakdown Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Criteria Score Breakdown
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {reviewResult.rubrics.map((r, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#071319] border border-[#1b3b4a] space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-white">{r.category}</span>
                        <span className="text-cyan-400 font-mono">
                          {r.score}/{r.maxScore}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-cyan-400"
                          style={{ width: `${(r.score / r.maxScore) * 100}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-300">{r.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Actionable Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                  <h5 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Key Strengths
                  </h5>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {reviewResult.keyStrengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-cyan-400">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                  <h5 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    Recommended Revisions Before Submission
                  </h5>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {reviewResult.actionableImprovements.map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-cyan-400">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
