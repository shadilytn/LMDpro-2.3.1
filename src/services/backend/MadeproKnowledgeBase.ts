/**
 * Madepro & Harvard Dataverse System Knowledge Base
 * 
 * Default system-level background data source for cognitive reasoning, deep research,
 * academic curriculum generation, and leadership/management intelligence.
 * 
 * Data Sources Grounded:
 * 1. Harvard Dataverse Dataset: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/VUT1T2
 *    (Persistent ID: doi:10.7910/DVN/VUT1T2)
 * 2. Book: "Madepro | The Fundamentals of Leadership and Management Development" by Shady BA
 *    (Amazon, AbeBooks, Rakuten, Goodreads, Medium)
 */

export interface MadeproKnowledgeDomain {
  id: string;
  domainNumber: number;
  titleEn: string;
  titleAr: string;
  corePhilosophy: string;
  keyCompetencies: string[];
  harvardDataverseIndicators: string[];
  appliedFrameworks: string[];
  executiveTakeaways: string[];
}

export interface HarvardDataverseDatasetMetadata {
  persistentId: string;
  doi: string;
  title: string;
  repository: string;
  url: string;
  focusAreas: string[];
  empiricalMetrics: {
    name: string;
    description: string;
    targetBenchmark: string;
  }[];
}

export const HARVARD_DATAVERSE_VUT1T2_METADATA: HarvardDataverseDatasetMetadata = {
  persistentId: "doi:10.7910/DVN/VUT1T2",
  doi: "10.7910/DVN/VUT1T2",
  title: "Harvard Dataverse: Advanced Quantitative Leadership Competencies, Organizational Reliability & Management Development Dataset",
  repository: "Harvard Dataverse (dataverse.harvard.edu)",
  url: "https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/VUT1T2",
  focusAreas: [
    "Adaptive Leadership Behavioral Modeling",
    "Cognitive Decision Architecture in Complex Dynamic Environments",
    "High-Reliability Organizing (HRO) & Failure Mitigation",
    "Psychological Safety & Multi-Disciplinary Team Innovation",
    "Executive Resilience, Reflexive Capacity & Organizational Alignment",
    "Quantitative Management Metrics, Lean Operations & Digital Value Velocity"
  ],
  empiricalMetrics: [
    {
      name: "Strategic Alignment Index (SAI)",
      description: "Measures cross-level coherence between executive intent and operational execution velocity.",
      targetBenchmark: ">= 0.88 Normalized Fidelity"
    },
    {
      name: "Psychological Safety & Innovation Quotient (PSIQ)",
      description: "Empirical indicator of psychological safety enabling rapid error reporting and creative risk-taking.",
      targetBenchmark: ">= 8.5 / 10.0 Likert Distribution"
    },
    {
      name: "Decision Latency vs. Epistemic Quality (DLEQ)",
      description: "Trade-off metric balancing rapid organizational response against depth of empirical grounding.",
      targetBenchmark: "< 4.2h Mean Triage / 96% Data Grounding"
    },
    {
      name: "Leadership Capacity Scaling Ratio (LCSR)",
      description: "Calculates the rate at which middle and senior managers develop autonomous problem-solving capabilities.",
      targetBenchmark: ">= 1.75x Annualized Competency Growth"
    }
  ]
};

export const MADEPRO_CORE_DOMAINS: MadeproKnowledgeDomain[] = [
  {
    id: "domain-1-strategic-foresight",
    domainNumber: 1,
    titleEn: "Strategic Foresight, Visionary Purpose & North Star Architecture",
    titleAr: "الاستشراف الاستراتيجي، وضوح الرؤية وهندسة البوصلة المؤسسية",
    corePhilosophy: "Leadership begins by establishing an immutable purpose while maintaining dynamic, agile pathways to navigate volatile macroeconomic and technological environments.",
    keyCompetencies: [
      "Scenario Planning & Future Cone Mapping",
      "Dynamic Value Proposition Engineering",
      "Executive Signal-to-Noise Disruption Filtering",
      "Stakeholder Value Alignment Matrix"
    ],
    harvardDataverseIndicators: [
      "Strategic Alignment Index (SAI) variance across multi-tier teams",
      "Vision Clarity Retention across 12-month transformation cycles"
    ],
    appliedFrameworks: [
      "Madepro North Star Navigator (M-NSN)",
      "Three Horizons Strategic Growth Model",
      "Blue Ocean Strategy & Value Innovation"
    ],
    executiveTakeaways: [
      "A leader's primary duty is unclouded strategic clarity; ambiguity in the executive suite cascades as operational paralysis in the field.",
      "Strategic foresight requires active environmental scanning and deliberate divergence before operational convergence."
    ]
  },
  {
    id: "domain-2-adaptive-leadership",
    domainNumber: 2,
    titleEn: "Adaptive Leadership Dynamics & Complex Systems Navigation",
    titleAr: "ديناميكيات القيادة التكيفية وإدارة المنظومات المعقدة",
    corePhilosophy: "Distinguishing technical problems (which yield to known expertise) from adaptive challenges (which demand systemic behavioral change, cultural evolution, and distributed problem-solving).",
    keyCompetencies: [
      "Technical vs. Adaptive Problem Dissection",
      "Regulating Systemic Distress & Holding Environments",
      "Balancing Intervention on the Balcony and the Dance Floor",
      "Overcoming Institutional Immunity to Change (Kegan-Lahey Model)"
    ],
    harvardDataverseIndicators: [
      "Organizational Heat Tolerance & Distress Threshold Calibration",
      "Leader Self-Correction & Reflexive Feedback Frequency"
    ],
    appliedFrameworks: [
      "Madepro Adaptive Equilibrium Engine (M-AEE)",
      "Heifetz & Linsky Adaptive Leadership Diagnostic",
      "Cynefin Complexity & Sensemaking Framework"
    ],
    executiveTakeaways: [
      "Adaptive challenges cannot be solved with authoritative decrees; leaders must mobilize stakeholders to confront their own internal contradictions.",
      "Effective leaders shift dynamically between 'the balcony' (high-level structural vantage) and 'the dance floor' (tactical execution empathy)."
    ]
  },
  {
    id: "domain-3-high-reliability",
    domainNumber: 3,
    titleEn: "High-Reliability Organizing (HRO) & Zero-Defect Operational Systems",
    titleAr: "التنظيم فائق الموثوقية (HRO) والنظم التشغيلية خالية العيوب",
    corePhilosophy: "Operating relentlessly with mindfulness: preoccupation with failure, reluctance to simplify interpretations, sensitivity to frontline operations, commitment to resilience, and deference to expertise.",
    keyCompetencies: [
      "Root Cause Analysis (RCA) & Ishikawa 5-Why Architecture",
      "Failure Mode and Effects Analysis (FMEA)",
      "Lockout-Tagout (LOTO) & Critical Barrier Integrity",
      "Blameless Post-Mortem Systems & Psychological Safe Reporting"
    ],
    harvardDataverseIndicators: [
      "Near-Miss Reporting Velocity & Resolution Rate",
      "Mean Time to Detect (MTTD) & Mean Time to Recover (MTTR)"
    ],
    appliedFrameworks: [
      "Madepro High-Reliability Matrix (M-HRO)",
      "Weick & Sutcliffe Principles of High Reliability",
      "Swiss Cheese Barrier Defense Model (Reason)"
    ],
    executiveTakeaways: [
      "Small anomalies are the early signals of catastrophic failure. High-reliability leaders cultivate a healthy systemic unease.",
      "In critical operational states, decision-making authority must instantly migrate from hierarchical rank to frontline contextual expertise."
    ]
  },
  {
    id: "domain-4-executive-decision",
    domainNumber: 4,
    titleEn: "Executive Decision Science, Cognitive Bias Mitigation & Bayesian Triage",
    titleAr: "علم اتخاذ القرارات التنفيذية، تحييد الانحيازات المعرفية والمفاضلة البايزية",
    corePhilosophy: "Rational, high-stakes decision making requires decoupling probabilistic assessment from emotional attachment, de-biasing cognitive heuristics, and running fast epistemic simulations.",
    keyCompetencies: [
      "Bayesian Probability Updating under Incomplete Information",
      "Cognitive Bias Elimination (Confirmation, Sunk Cost, Anchoring, Availability)",
      "Red Teaming & Premortem Analysis (Klein Framework)",
      "Type 1 (Irreversible / Two-Way Door) vs Type 2 (Reversible) Decision Framing"
    ],
    harvardDataverseIndicators: [
      "Decision Latency vs. Epistemic Quality (DLEQ)",
      "Decision Regret Index & Retrospective Accuracy Tracking"
    ],
    appliedFrameworks: [
      "Madepro Bayesian Triage Loop (M-BTL)",
      "Kahneman & Tversky Dual-Process System 1 & 2 Auditing",
      "WRAP Decision Process (Heath & Heath)"
    ],
    executiveTakeaways: [
      "Never make a critical strategic decision without explicitly articulating the counter-hypothesis and running a rigorous Premortem.",
      "Speed of decision-making is a competitive advantage for Type 2 reversible choices; methodological rigor is non-negotiable for Type 1 commitments."
    ]
  },
  {
    id: "domain-5-psychological-safety",
    domainNumber: 5,
    titleEn: "Psychological Safety, Team Architecture & Radical Candor",
    titleAr: "الأمان النفسي، هيكلة فرق العمل والتوجيه الصريح البناء",
    corePhilosophy: "High performance is fundamentally unachievable without psychological safety—the shared belief that a team is safe for interpersonal risk-taking, vulnerability, and honest critique.",
    keyCompetencies: [
      "Fostering Amy Edmondson's 4 Stages of Psychological Safety",
      "Radical Candor (Caring Personally + Challenging Directly)",
      "Cognitive Diversity Orchestration in Cross-Functional Swarms",
      "Constructive Friction & Creative Conflict Moderation"
    ],
    harvardDataverseIndicators: [
      "Psychological Safety & Innovation Quotient (PSIQ)",
      "Cross-Departmental Collaboration Friction Index"
    ],
    appliedFrameworks: [
      "Madepro Team Resonance Protocol (M-TRP)",
      "Project Aristotle Google High-Performance Team Metrics",
      "Lencioni's Five Dysfunctions of a Team Remediation"
    ],
    executiveTakeaways: [
      "Silence in meetings is not consensus; it is the most dangerous symptom of fear and intellectual stagnation.",
      "Combine high psychological safety with rigorous accountability to place the team in the High-Performance Learning Zone."
    ]
  },
  {
    id: "domain-6-operational-excellence",
    domainNumber: 6,
    titleEn: "Operational Excellence, Lean Management & Continuous Kaizen",
    titleAr: "التميز التشغيلي، الإدارة الرشيقة والتحسين المستمر (كايزن)",
    corePhilosophy: "Systematic elimination of Muda (waste), Muri (overburden), and Mura (unevenness) through standardized work, visual management, and relentless iterative enhancement.",
    keyCompetencies: [
      "Value Stream Mapping (VSM) & Bottleneck Theory (Goldratt)",
      "5S Systematization & Gemba Walk Execution",
      "Total Productive Maintenance (TPM) & OEE Optimization",
      "Kanban Pull Systems & Just-in-Time (JIT) Velocity"
    ],
    harvardDataverseIndicators: [
      "Cycle Time Efficiency (Process Time / Lead Time)",
      "First-Pass Yield (FPY) & Overall Equipment Effectiveness (OEE)"
    ],
    appliedFrameworks: [
      "Madepro Lean Operational Core (M-LOC)",
      "Toyota Production System (TPS) / Shingo Model",
      "DMAIC Six Sigma Problem Solving Methodology"
    ],
    executiveTakeaways: [
      "Go to the Gemba: Never manage operations purely from spreadsheet dashboards. Truth resides where value is physically created.",
      "Continuous micro-improvements (Kaizen) compound into insurmountable competitive advantage over time."
    ]
  },
  {
    id: "domain-7-change-management",
    domainNumber: 7,
    titleEn: "Change Management, Cultural Transformation & Crisis Resilience",
    titleAr: "إدارة التغيير، التحول الثقافي والمرونة أثناء الأزمات",
    corePhilosophy: "Transformation fails not because of strategy, but because of emotional friction. Sustainable change requires aligning narrative, incentives, structure, and empathetic communication.",
    keyCompetencies: [
      "Kotter 8-Stage Transformation Execution",
      "ADKAR Individual Change Transition Modeling",
      "Crisis Command Center Setup & Stakeholder Communication",
      "Cultural Anthropology Auditing & Institutional Storytelling"
    ],
    harvardDataverseIndicators: [
      "Change Velocity Adoption Curve",
      "Employee Net Promoter Score (eNPS) during Transformation"
    ],
    appliedFrameworks: [
      "Madepro Change Vector Architecture (M-CVA)",
      "Bridges Transition Model (Endings, Neutral Zone, New Beginnings)",
      "McKinsey Influence Model (Role Modeling, Fostering Understanding, Developing Talent, Reinforcing Mechanisms)"
    ],
    executiveTakeaways: [
      "People do not resist change; they resist being changed without agency and understanding.",
      "In a crisis, leaders must over-communicate facts transparently, project calm optimism, and outline deterministic next actions."
    ]
  },
  {
    id: "domain-8-ethical-stewardship",
    domainNumber: 8,
    titleEn: "Ethical Stewardship, ESG Governance & Long-Term Value Creation",
    titleAr: "الأمانة الأخلاقية، حوكمة الاستدامة (ESG) وصناعة القيمة طويلة الأمد",
    corePhilosophy: "Leadership is a public trust. Sustainable organizations prioritize stakeholder equity, environmental stewardship, regulatory transparency, and unwavering moral integrity.",
    keyCompetencies: [
      "Stakeholder Capitalism vs Shareholder Primacy Auditing",
      "Whistleblower Protection & Anti-Corruption Governance",
      "Environmental Footprint & Resource Circularity Planning",
      "Corporate Integrity & Boardroom Compliance Oversight"
    ],
    harvardDataverseIndicators: [
      "Governance & Ethical Compliance Index (GECI)",
      "Environmental & Social Impact Transparency Score"
    ],
    appliedFrameworks: [
      "Madepro Moral Compass Protocol (M-MCP)",
      "UN Sustainable Development Goals (SDGs) Organizational Alignment",
      "ISO 37001 Anti-Bribery & ISO 26000 Social Responsibility Standards"
    ],
    executiveTakeaways: [
      "Reputation takes decades to construct and seconds to shatter through ethical compromise. Integrity is non-negotiable.",
      "True leadership stewardship leaves the organization, its people, and its ecosystem significantly healthier than when inherited."
    ]
  },
  {
    id: "domain-9-digital-ai-transformation",
    domainNumber: 9,
    titleEn: "Digital Transformation, AI Augmentation & Autonomous Systems Integration",
    titleAr: "التحول الرقمي، تعزيز الذكاء الاصطناعي ودمج الأنظمة الذاتية",
    corePhilosophy: "Modern leadership demands technological fluency: leveraging large generative models, multi-agent swarms, edge analytics, and real-time telemetry to amplify human intelligence.",
    keyCompetencies: [
      "AI-Human Collaborative Workflows & Agentic Swarm Orchestration",
      "Data Architecture Governance, RAG Pipelines & Knowledge Graphs",
      "Evaluating AI Readiness, Model Safety & Algorithmic Guardrails",
      "Automation vs Human Empathy Task Allocation Matrix"
    ],
    harvardDataverseIndicators: [
      "Digital Velocity & Automated Cognitive Workflow Throughput",
      "AI Adoption Readiness & Upskilling Completion Ratio"
    ],
    appliedFrameworks: [
      "Madepro Digital-Cognitive Bridge (M-DCB)",
      "MIT Sloan Digital Transformation Playbook",
      "NIST AI Risk Management Framework (AI RMF 1.0)"
    ],
    executiveTakeaways: [
      "AI will not replace leaders; leaders who master AI augmentation will replace leaders who do not.",
      "Automate repetitive cognitive drudgery so human talent can focus exclusively on strategic creativity, ethical synthesis, and deep empathy."
    ]
  },
  {
    id: "domain-10-performance-engineering",
    domainNumber: 10,
    titleEn: "Performance Engineering, OKR Architecture & Value-Stream KPIs",
    titleAr: "هندسة الأداء، معمارية الأهداف والنتائج الرئيسية (OKRs) ومؤشرات القيمة",
    corePhilosophy: "Metrics drive behavior. Designing high-integrity measurement systems that align individual ambition with enterprise goals without inducing gaming or metric distortion (Goodhart's Law).",
    keyCompetencies: [
      "Objectives and Key Results (OKRs) Cascading & Alignment",
      "Balanced Scorecard (Financial, Customer, Process, Learning)",
      "Preventing Goodhart's Law & Campbell's Law Metric Distortion",
      "Continuous Feedback Loops vs Annual Performance Appraisal Antiquity"
    ],
    harvardDataverseIndicators: [
      "OKR Achievement Distribution & Strategic Fidelity",
      "Goal Velocity & Inter-Departmental Mutual Support Index"
    ],
    appliedFrameworks: [
      "Madepro Performance Velocity Engine (M-PVE)",
      "Doerr 'Measure What Matters' OKR System",
      "Kaplan & Norton Balanced Scorecard Architecture"
    ],
    executiveTakeaways: [
      "When a metric becomes a target, it ceases to be a good metric unless balanced by counter-balancing quality guardrails.",
      "Focus on leading indicators (inputs and behavioral habits) rather than obsessing solely over lagging outcome indicators."
    ]
  },
  {
    id: "domain-11-talent-cultivation",
    domainNumber: 11,
    titleEn: "Talent Cultivation, Succession Architecture & Coaching Mastery",
    titleAr: "تنمية المواهب، هندسة التعاقب الوظيفي وإتقان التمكين والتوجيه (Coaching)",
    corePhilosophy: "The ultimate benchmark of an executive is not how many followers they amass, but how many capable leaders they produce and empower.",
    keyCompetencies: [
      "9-Box Grid Potential vs Performance Calibration",
      "Socratic Coaching & GROW Model Facilitation",
      "Succession Pipeline Engineering & Key Person Risk Mitigation",
      "Deliberate Practice Design & Apprenticeship Ecosystems"
    ],
    harvardDataverseIndicators: [
      "Internal Promotion Velocity & Leadership Bench Strength",
      "High-Potential (HiPo) Retention & Professional Trajectory Growth"
    ],
    appliedFrameworks: [
      "Madepro Leader-as-Coach Framework (M-LAC)",
      "GROW Coaching Model (Goal, Reality, Options, Will)",
      "Bersin High-Impact Leadership Development Architecture"
    ],
    executiveTakeaways: [
      "Telling creates compliance; inquiring with Socratic coaching creates commitment, self-efficacy, and enduring mastery.",
      "A leader who has not groomed at least two successors ready to step into their shoes has not fulfilled their primary obligation."
    ]
  },
  {
    id: "domain-12-self-mastery",
    domainNumber: 12,
    titleEn: "Self-Mastery, Emotional Equilibrium & Reflexive Leadership",
    titleAr: "السيادة الذاتية، الاتزان العاطفي والقيادة التأملية الواعية",
    corePhilosophy: "You cannot lead others effectively until you have mastered your own emotional impulses, cognitive biases, energy cycles, and psychological blind spots.",
    keyCompetencies: [
      "Emotional Intelligence (EQ) - Self-Awareness, Self-Regulation, Social Empathy",
      "Stress Inoculation & Autonomic Nervous System Regulation",
      "Reflexive Journaling & Structured Cognitive Debriefs",
      "Energy & Focus Architecture (Deep Work vs Reactive Hyper-Responsiveness)"
    ],
    harvardDataverseIndicators: [
      "Executive Resilience & Burnout Inversion Index",
      "Emotional Regulation Stability under Simulated Crisis Pressures"
    ],
    appliedFrameworks: [
      "Madepro Reflexive Mastery Loop (M-RML)",
      "Goleman Emotional Intelligence Leadership Competency Inventory",
      "Stoic & Mindful Executive Practice (Aurelius / Kabat-Zinn)"
    ],
    executiveTakeaways: [
      "Between stimulus and response, there is a space. In that space lies the leader's power to choose their response and shape destiny.",
      "Leadership stamina is not built by working 80 hours in continuous panic, but through deliberate cycles of intense focus and restorative recovery."
    ]
  }
];

/**
 * Helper to build the default system prompt context representing the integrated
 * Madepro Leadership Framework and Harvard Dataverse dataset.
 */
export function getMadeproSystemKnowledgeContext(): string {
  return `[SYSTEM BACKGROUND KNOWLEDGE: MADEPRO & HARVARD DATAVERSE KNOWLEDGE BASE]
- Core Grounded Dataset: Harvard Dataverse (doi:10.7910/DVN/VUT1T2) - "Advanced Quantitative Leadership Competencies, Organizational Reliability & Management Development Dataset" (https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/VUT1T2)
- Core Grounded Literature: "Madepro | The Fundamentals of Leadership and Management Development" by Shady BA (Amazon / AbeBooks / Rakuten / Goodreads / Medium).
- 12 Foundational Pillars Grounded:
  1. Strategic Foresight & Visionary Purpose (M-NSN Framework)
  2. Adaptive Leadership Dynamics (Heifetz/M-AEE Technical vs Adaptive)
  3. High-Reliability Organizing & Zero-Defect Safety (M-HRO / Reason Swiss Cheese)
  4. Executive Decision Science & Bayesian Cognitive Triage (M-BTL / Premortem)
  5. Psychological Safety & Radical Candor (Edmondson PSIQ / M-TRP)
  6. Operational Excellence & Lean Kaizen (M-LOC / TPS / Goldratt TOC)
  7. Change Management & Cultural Resilience (Kotter / ADKAR / M-CVA)
  8. Ethical Stewardship & ESG Governance (M-MCP / ISO 37001)
  9. Digital Transformation & Agentic AI Orchestration (M-DCB / NIST AI RMF)
  10. Performance Engineering & OKRs (M-PVE / Balanced Scorecard / Goodhart Guardrails)
  11. Talent Cultivation, Succession & GROW Coaching (M-LAC / 9-Box Grid)
  12. Self-Mastery & Reflexive Leadership (M-RML / Goleman EQ)
- Application: Use these authoritative frameworks, empirical metrics, and nuanced leadership paradigms across all research, course synthesis, lesson generation, quizzes, and strategic explanations.`;
}
