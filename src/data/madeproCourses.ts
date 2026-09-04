import { Course } from "../shared/types";

export const madeproCourses: Course[] = [
  {
    id: "course-madepro-fundamentals",
    title: "Madepro: The Fundamentals of Leadership",
    category: "Management & Leadership",
    description: "An executive-level mastery course based on the Madepro framework by Shady BA. Master core management principles and strategic leadership.",
    level: "Advanced",
    coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
    author: "Shady BA",
    rating: 5.0,
    durationHours: 12,
    tags: ["Leadership", "Management", "Madepro", "Strategy"],
    isAiGenerated: false,
    modules: [
      {
        id: "mod-mp-1",
        title: "Core Management Principles",
        description: "Understanding the foundational pillars of effective management.",
        lessons: [
          {
            id: "les-mp-1-1",
            title: "The Pillars of Management Excellence",
            durationMinutes: 45,
            content: `# The Pillars of Management Excellence\n\nManagement is not just about oversight; it's about creating an environment where excellence is inevitable. In the Madepro framework, we focus on four primary pillars:\n\n1. **Strategic Foresight**: Anticipating shifts and planning for long-term impact.\n2. **Operational Excellence**: Streamlining processes without sacrificing quality.\n3. **Human Capital Stewardship**: Investing in people as the primary source of organizational value.\n4. **Ethical Leadership**: Maintaining a core of integrity in all decisions.\n\n### Business Acumen\nDeveloping acumen requires more than just knowing the numbers; it requires understanding the *dynamics* of the market and the *interconnectedness* of functional areas.`,
            keyTakeaways: ["Define the 4 pillars of Madepro management", "Understand the role of strategic foresight", "Apply human capital stewardship principles"],
            audioScript: "Welcome to the first module of the Madepro Leadership Program. Today we dive into the four pillars of management excellence...",
            quizzes: [
              {
                id: "q-mp-1-1-1",
                question: "What is the primary focus of Human Capital Stewardship in the Madepro framework?",
                options: [
                  "Maximizing short-term labor output",
                  "Investing in people as the primary source of organizational value",
                  "Automating all human interactions",
                  "Reducing payroll costs at all levels"
                ],
                correctAnswerIndex: 1,
                explanation: "Madepro views human capital as the core value driver of any sustainable organization.",
                hint: "Think about long-term value vs short-term gain."
              }
            ],
            flashcards: [
              {
                id: "fc-mp-1-1-1",
                front: "Strategic Foresight",
                back: "The ability to anticipate future trends and prepare the organization for long-term success."
              }
            ]
          }
        ]
      },
      {
        id: "mod-mp-2",
        title: "Leading High-Performance Teams",
        description: "Strategies for influencing and developing elite organizational talent.",
        lessons: [
          {
            id: "les-mp-2-1",
            title: "Influencing at All Levels",
            durationMinutes: 50,
            content: `# Influencing at All Levels\n\nTrue leadership is not granted by title; it is earned through influence. Effective managers must be able to influence upwards (executives), sideways (peers), and downwards (direct reports).\n\n### Key Competencies\n- **Empathetic Listening**: Understanding the core motivations of stakeholders.\n- **Bayesian Decision Science**: Updating your leadership approach based on new evidence.\n- **Psychological Safety**: Creating an environment where teams feel safe to innovate and fail.`,
            keyTakeaways: ["Master the art of 360-degree influence", "Implement Bayesian decision dynamics", "Foster psychological safety in high-stakes environments"],
            audioScript: "Leadership is influence. In this lesson, we explore how to develop that influence across all organizational levels...",
            quizzes: [
              {
                id: "q-mp-2-1-1",
                question: "Which competency is essential for creating an environment of innovation according to Madepro?",
                options: [
                  "Strict hierarchical control",
                  "Psychological safety",
                  "Micromanagement",
                  "Eliminating all feedback loops"
                ],
                correctAnswerIndex: 1,
                explanation: "Psychological safety allows teams to take risks and innovate without fear of retribution.",
                hint: "What makes a team feel 'safe' to share ideas?"
              }
            ],
            flashcards: [
              {
                id: "fc-mp-2-1-1",
                front: "Psychological Safety",
                back: "A shared belief that the team is safe for interpersonal risk-taking."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "course-lmd-public-sector",
    title: "LMD in the Public Sector: A Data-Driven Approach",
    category: "Public Administration",
    description: "Insights and strategic frameworks for Leadership and Management Development (LMD) in public sector organizations, grounded in Harvard Dataverse research.",
    level: "Advanced",
    coverImage: "https://images.unsplash.com/photo-1521791136064-7986c2959213?q=80&w=800&auto=format&fit=crop",
    author: "Zalamati Research",
    rating: 4.8,
    durationHours: 15,
    tags: ["Public Sector", "LMD", "Dataverse", "Public Policy"],
    isAiGenerated: false,
    modules: [
      {
        id: "mod-lmd-1",
        title: "Quantitative LMD Benchmarks",
        description: "Analyzing the empirical data from Harvard Dataverse (doi:10.7910/DVN/VUT1T2).",
        lessons: [
          {
            id: "les-lmd-1-1",
            title: "Fidelity and Alignment Metrics",
            durationMinutes: 40,
            content: `# Fidelity and Alignment Metrics\n\nResearch from the Harvard Dataverse dataset (doi:10.7910/DVN/VUT1T2) highlights the critical importance of the Strategic Alignment Index (SAI) in public sector LMD.\n\n### Empirical Findings\n- Organizations with an SAI > 0.88 show a 1.75x increase in annualized growth.\n- Decision Latency (DLEQ) is a key predictor of epistemic quality.\n- High-reliability organizing (HRO) is essential for maintaining service continuity.`,
            keyTakeaways: ["Understand the Strategic Alignment Index", "Identify key predictors of management quality", "Apply data-driven LMD strategies"],
            audioScript: "Data tells the story of success. Let's examine the empirical benchmarks discovered in our public sector research...",
            quizzes: [
              {
                id: "q-lmd-1-1-1",
                question: "What does the Strategic Alignment Index (SAI) measure?",
                options: [
                  "The speed of organizational decision making",
                  "The fidelity of leadership strategy with organizational goals",
                  "The number of employees in a department",
                  "The total budget of an LMD program"
                ],
                correctAnswerIndex: 1,
                explanation: "SAI measures how well leadership actions align with the core mission and goals.",
                hint: "Aligning strategy with..."
              }
            ],
            flashcards: [
              {
                id: "fc-lmd-1-1-1",
                front: "Strategic Alignment Index (SAI)",
                back: "A metric measuring the consistency between strategic intent and operational execution."
              }
            ]
          }
        ]
      }
    ]
  }
];
