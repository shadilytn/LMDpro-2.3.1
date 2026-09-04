import React from "react";
import {
  MessageSquare,
  Users,
  HelpCircle,
  Plus,
  ThumbsUp,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  Send,
  Calendar,
  Clock,
  Video,
  Award,
  BookOpen,
  Share2,
  Tag,
  ChevronRight,
  ExternalLink,
  Zap,
  Radio,
  Copy,
  Check,
  Trash2,
  ShieldAlert,
  FileText,
  Code2,
  FileCode,
  Download,
  UserPlus,
  Compass,
  ArrowUpRight,
  TrendingUp,
  Brain,
  Lightbulb,
  Layers,
  Flame,
  Bookmark,
  CheckCircle,
  RefreshCw,
  FolderPlus,
  Bot,
  Network,
  Target,
  Cpu,
  ShieldCheck,
  Activity
} from "lucide-react";
import {
  UserProfile,
  Course,
  VirtualStudyGroup,
  ForumThread,
  ForumReply,
  SharedPeerResource,
  PeerMatchRecommendation,
  StudyGroupMember,
  AiFacilitatedStudyGroup,
  ComplementaryPeerMember,
  SkillSynergyRelation,
  SocraticGroupMessage,
  SocraticAgendaMilestone
} from "../shared/types";
import { ApiService } from "../shared/api.service";

export interface QnAQuestion {
  id: string;
  courseTitle: string;
  questionText: string;
  askedBy: string;
  authorAvatar: string;
  createdAt: string;
  upvotes: number;
  isAnswered: boolean;
  aiAnswer?: {
    text: string;
    confidence: string;
    answeredAt: string;
  };
}

interface SocialLearningHubProps {
  user: UserProfile;
  courses?: Course[];
  onOpenAITutor?: () => void;
  defaultCourseFilter?: string;
  onNavigateTab?: (tab: string) => void;
}

export const SocialLearningHub: React.FC<SocialLearningHubProps> = ({
  user,
  courses = [],
  onOpenAITutor,
  defaultCourseFilter = "ALL",
  onNavigateTab
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = React.useState<"forums" | "groups" | "notes" | "matchmaker" | "qna">("forums");
  const [selectedCourseFilter, setSelectedCourseFilter] = React.useState<string>(defaultCourseFilter);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Forums State
  const [threads, setThreads] = React.useState<ForumThread[]>(() => {
    const saved = localStorage.getItem("zalamati_forum_threads");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn("Failed to parse saved forum threads", e);
      }
    }
    return [
      {
        id: "thread-1",
        courseCode: "CS101",
        courseTitle: "Distributed Systems & Raft Consensus",
        title: "How does Raft maintain log safety during simultaneous leader election split votes?",
        authorName: "Sarah Chen",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop",
        authorRole: "Mastery Scholar",
        authorId: "user-sarah",
        createdAt: "20m ago",
        tags: ["CS101", "Raft", "Consensus", "Distributed Systems"],
        upvotes: 14,
        userUpvoted: false,
        replyCount: 3,
        isSolved: true,
        content:
          "In section 4.2 of the Raft whitepaper, randomized election timers prevent split-vote deadlocks. But what happens if two candidates simultaneously gain majority in separate network partitions before the partition heals?",
        aiModeration: {
          status: "approved",
          relevanceScore: 98,
          toneAnalysis: "Rigorous and constructive academic systems inquiry.",
          socraticHint: "Remember the quorum intersection invariant: any two majorities of size N must intersect by at least one node.",
          suggestedModule: "CS101 - Module 3: Quorum Invariance & Partition Healing",
          moderatedAt: "18m ago"
        },
        replies: [
          {
            id: "rep-1",
            authorName: "Petra (AI Socratic Moderator)",
            authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
            authorRole: "AI Socratic Tutor",
            text: "Excellent observation Sarah! Since a majority requires ⌊N/2⌋ + 1 votes, two disjoint subsets of size N cannot both exceed N/2. The partition with fewer than ⌊N/2⌋+1 nodes will fail to elect a leader and remain in Candidate state with stepped back terms.",
            createdAt: "15m ago",
            isAiTutor: true,
            upvotes: 9
          },
          {
            id: "rep-2",
            authorName: "Marcus Vance",
            authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop",
            authorRole: "Research Fellow",
            text: "I ran a simulation using Jepsen tests last week. When the network partitions 3/2 on a 5-node cluster, the 2-node sub-cluster drops all writes and steps down as soon as heartbeats fail.",
            createdAt: "8m ago",
            upvotes: 4
          }
        ]
      },
      {
        id: "thread-2",
        courseCode: "AI301",
        courseTitle: "Edge AI & WebGPU Quantization",
        title: "Optimizing 4-bit AWQ weight unpacking in WGSL Compute Shaders",
        authorName: "Elena Rostova",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
        authorRole: "Algorithms Specialist",
        authorId: "user-elena",
        createdAt: "1h ago",
        tags: ["AI301", "WebGPU", "WGSL", "Quantization", "Shaders"],
        upvotes: 19,
        userUpvoted: true,
        replyCount: 2,
        isSolved: false,
        content:
          "I'm benchmarking matrix-vector multiplication for a 7B LLM running inside browser WebGPU. Unpacking 4-bit nibbles into `vec4<f32>` is currently memory-bandwidth bound. Has anyone tried bitwise shift packing in shared workgroup memory?",
        aiModeration: {
          status: "approved",
          relevanceScore: 96,
          toneAnalysis: "Highly practical engineering optimization discussion.",
          socraticHint: "Evaluate coalesced workgroup loads with `workgroupBarrier()` to avoid bank conflicts during nibble extraction.",
          suggestedModule: "AI301 - Module 4: Tensor Memory Coalescing",
          moderatedAt: "55m ago"
        },
        replies: [
          {
            id: "rep-3",
            authorName: "Tariq Al-Mansoor",
            authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
            authorRole: "AI Systems Scholar",
            text: "Yes! Use `bitcast<vec4<u32>>` to load 128 bits per thread into workgroup cache. You get a 2.4x throughput bump over naive global buffer loads.",
            createdAt: "35m ago",
            upvotes: 6
          }
        ]
      }
    ];
  });

  // Active Thread Modal & AI Discussion Moderation
  const [activeThread, setActiveThread] = React.useState<ForumThread | null>(null);
  const [replyInput, setReplyInput] = React.useState("");
  const [isAiReplying, setIsAiReplying] = React.useState(false);
  const [isSummarizingDiscussion, setIsSummarizingDiscussion] = React.useState(false);
  const [discussionSummary, setDiscussionSummary] = React.useState<{
    summary: string;
    keyConsensusPoints: string[];
    topPeerContribution: string;
    recommendedNextStep: string;
  } | null>(null);
  const [flaggedItems, setFlaggedItems] = React.useState<Set<string>>(new Set());
  const [flagFeedback, setFlagFeedback] = React.useState<string | null>(null);

  // New Thread Modal
  const [showNewThreadModal, setShowNewThreadModal] = React.useState(false);
  const [newThreadTitle, setNewThreadTitle] = React.useState("");
  const [newThreadContent, setNewThreadContent] = React.useState("");
  const [newThreadCourse, setNewThreadCourse] = React.useState("CS101");
  const [isModeratingNewThread, setIsModeratingNewThread] = React.useState(false);

  // Virtual Study Groups State
  const [studyGroups, setStudyGroups] = React.useState<VirtualStudyGroup[]>(() => {
    const saved = localStorage.getItem("zalamati_study_groups");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn("Failed to parse study groups", e);
      }
    }
    return [
      {
        id: "group-1",
        title: "Distributed Consensus & Raft Paper Study Group",
        courseCode: "CS101",
        courseTitle: "Distributed Systems",
        description:
          "Weekly deep dive reviewing consensus protocols, Byzantine fault tolerance, and implementing a 5-node raft cluster in TypeScript.",
        memberCount: 5,
        maxMembers: 8,
        nextMeetingTime: "Today at 6:00 PM UTC",
        targetGoal: "Implement leader election and state machine replication proofs",
        isJoined: true,
        tags: ["CS101", "Raft", "Consensus", "Whiteboard"],
        createdBy: "Alex Mercer",
        members: [
          { name: "Alex Mercer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop", role: "Group Lead", xp: 1450 },
          { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop", role: "Scholar", xp: 1820 },
          { name: "Marcus Vance", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop", role: "Peer Reviewer", xp: 1600 },
          { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop", role: "Scholar", xp: 1510 }
        ],
        collabLink: "https://meet.jit.si/zalamati-cs101-raft-study",
        collabType: "jitsi",
        sharedNotes: [
          { id: "note-1", title: "Raft TLA+ Invariants Cheat Sheet", author: "Sarah Chen", addedAt: "Yesterday" },
          { id: "note-2", title: "Cluster Failure Scenario Matrix", author: "Alex Mercer", addedAt: "3 days ago" }
        ],
        agendaMilestones: [
          "1. 10m: Review Invariants & Leader Heartbeats",
          "2. 25m: Whiteboard Simulation of Network Partitions",
          "3. 15m: Code Walkthrough of Log Compaction",
          "4. 10m: Q&A and Milestone Assignment"
        ]
      },
      {
        id: "group-2",
        title: "Edge AI Quantization & WebGPU Kernel Hackers",
        courseCode: "AI301",
        courseTitle: "Edge AI Architecture",
        description:
          "Collaborative workbench focusing on writing custom WGSL kernels for 4-bit MoE models running with zero latency on client devices.",
        memberCount: 4,
        maxMembers: 6,
        nextMeetingTime: "Tomorrow at 4:00 PM UTC",
        targetGoal: "Achieve 45 tokens/sec browser inference for Gemma 2B",
        isJoined: false,
        tags: ["AI301", "WebGPU", "WGSL", "Hackathon"],
        createdBy: "Elena Rostova",
        members: [
          { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop", role: "Group Lead", xp: 1510 },
          { name: "Tariq Al-Mansoor", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop", role: "Systems Specialist", xp: 1390 }
        ],
        collabLink: "https://meet.jit.si/zalamati-ai301-webgpu-hack",
        collabType: "jitsi",
        agendaMilestones: [
          "1. 10m: Review Matrix Benchmark Results",
          "2. 30m: Pair-Programming WGSL Bit-Unpacking Kernel",
          "3. 20m: Live Memory Profile on Mobile WebGPU"
        ]
      }
    ];
  });

  // Active Group Details Modal
  const [activeGroup, setActiveGroup] = React.useState<VirtualStudyGroup | null>(null);
  const [showNewGroupModal, setShowNewGroupModal] = React.useState(false);
  const [newGroupTitle, setNewGroupTitle] = React.useState("");
  const [newGroupDescription, setNewGroupDescription] = React.useState("");
  const [newGroupCourse, setNewGroupCourse] = React.useState("CS101");
  const [newGroupGoal, setNewGroupGoal] = React.useState("");
  const [newGroupMaxMembers, setNewGroupMaxMembers] = React.useState(6);
  const [newGroupCollabType, setNewGroupCollabType] = React.useState<"jitsi" | "google-meet" | "zalamati">("jitsi");
  const [isGeneratingAgenda, setIsGeneratingAgenda] = React.useState(false);
  const [generatedAgenda, setGeneratedAgenda] = React.useState<string[]>([]);
  const [copiedLink, setCopiedLink] = React.useState(false);

  // AI-Facilitated Study Groups State (Socratic Squads with Complementary Pairing)
  const [groupSubFilter, setGroupSubFilter] = React.useState<"all" | "ai_facilitated" | "standard">("all");
  const [aiStudyGroups, setAiStudyGroups] = React.useState<AiFacilitatedStudyGroup[]>(() => {
    const saved = localStorage.getItem("zalamati_ai_facilitated_groups");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn("Failed to parse ai study groups", e);
      }
    }
    return [
      {
        id: "ai-squad-cs101-raft",
        title: "CS101 Socratic Squad: Raft Invariants & Split-Vote Recovery",
        courseCode: "CS101",
        courseTitle: "Distributed Systems & Advanced Architectures",
        targetMilestone: "Module 3: Quorum Invariance & Fault Recovery",
        synergyScore: 98,
        description:
          "Autonomous AI-facilitated study squad paired by Petra. Complementary skill mapping across distributed proofs, shader parallelism, and kernel benchmarking with synchronized course progress (avg: 76%).",
        status: "active",
        nextMeetingTime: "Today at 7:30 PM UTC (Live Room Available)",
        socraticFacilitator: {
          name: "Petra (AI Socratic Facilitator)",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
          personality: "Socratic, inquisitive, encouraging, and academically rigorous",
          currentInquiry:
            "How do we ensure linearizability when an elected leader loses majority during a silent network partition?",
          activeTopic: "CS101 • Invariant Derivation & Peer Proofs"
        },
        members: [
          {
            id: "user-alex",
            name: "Alex Mercer",
            avatar:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
            role: "Student Lead",
            email: "alex.m@academy.edu",
            primaryStrength: "Full-Stack System Architecture & WebGL",
            growthArea: "Formal Verification of Distributed Quorums",
            progressPct: 74,
            xp: 1450,
            studyHabit: "Deep conceptual inquiry & Socratic review",
            isCurrentUser: true
          },
          {
            id: "peer-sarah-chen",
            name: "Sarah Chen",
            avatar:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop",
            role: "Mastery Scholar",
            email: "sarah.c@academy.edu",
            primaryStrength: "Distributed Consensus & Raft Invariants",
            growthArea: "WebGPU WGSL Shader Optimization",
            progressPct: 78,
            xp: 1820,
            studyHabit: "Rigorous proofs & whiteboard derivations"
          },
          {
            id: "peer-marcus-vance",
            name: "Marcus Vance",
            avatar:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop",
            role: "Research Fellow",
            email: "marcus.v@academy.edu",
            primaryStrength: "Quantized MoE & PyTorch Tensor Benchmarks",
            growthArea: "Byzantine Fault Tolerance Proofs",
            progressPct: 72,
            xp: 1600,
            studyHabit: "Empirical benchmarking & system profiling"
          },
          {
            id: "peer-elena-rostova",
            name: "Elena Rostova",
            avatar:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
            role: "Algorithms Specialist",
            email: "elena.r@academy.edu",
            primaryStrength: "WGSL Compute Shaders & Workgroup Memory",
            growthArea: "Distributed Vector RAG Indexing",
            progressPct: 82,
            xp: 1750,
            studyHabit: "Pair-programming & live code reviews"
          }
        ],
        synergyRelations: [
          {
            mentorName: "Sarah Chen",
            learnerName: "Alex Mercer",
            domain: "Distributed Consensus Proofs",
            synergyDetail:
              "Sarah's 98% mastery in Raft leader terms covers Alex's goal to verify quorum split-vote recovery."
          },
          {
            mentorName: "Alex Mercer",
            learnerName: "Elena Rostova",
            domain: "Full-Stack WebGL Topologies",
            synergyDetail:
              "Alex provides architectural feedback on browser-side shader buffers for Elena's WGSL benchmarks."
          },
          {
            mentorName: "Marcus Vance",
            learnerName: "Sarah Chen",
            domain: "Empirical Jepsen Fault Injection",
            synergyDetail:
              "Marcus brings empirical stress tests to validate Sarah's formal TLA+ invariants."
          }
        ],
        agenda: [
          {
            id: "m-1",
            timeMinutes: 10,
            title: "Socratic Concept Scoping & Prerequisite Align",
            objective: "Clarify baseline assumptions and isolate invariant bounds.",
            isCompleted: true,
            socraticInquiry: "What is the minimal set of conditions required to guarantee quorum overlap?"
          },
          {
            id: "m-2",
            timeMinutes: 25,
            title: "Collaborative Whiteboard Proof & Edge Case Simulation",
            objective: "Map out the state transition diagram for leader election split votes.",
            isCompleted: false,
            socraticInquiry:
              "Suppose node 3 experiences a transient partition. Walk through the AppendEntries RPC flow step-by-step."
          },
          {
            id: "m-3",
            timeMinutes: 15,
            title: "Code Walkthrough & Peer Critique",
            objective: "Review member implementation snippets and test against edge cases.",
            isCompleted: false,
            socraticInquiry:
              "Where in this code does state synchronization risk a deadlock under high packet drop rates?"
          },
          {
            id: "m-4",
            timeMinutes: 10,
            title: "Synthesis & Milestone XP Evaluation",
            objective: "Socratic AI awards collaboration XP and summarizes key takeaways.",
            isCompleted: false,
            socraticInquiry: "State the primary theorem we established today in one sentence."
          }
        ],
        chatFeed: [
          {
            id: "msg-0",
            sender: "Petra (AI Socratic Facilitator)",
            senderType: "socratic_ai",
            avatar:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
            text:
              "Welcome study squad! I am Petra, your autonomous Socratic Facilitator. I have paired you based on complementary masteries in Distributed Invariants, Shader Kernels, and Jepsen Benchmarks. Let's begin with Milestone 1!",
            time: "10m ago",
            isSocraticPrompt: true,
            socraticHint: "Remember: Do not hesitate to challenge assumptions and ask 'Why does this lemma hold?'"
          },
          {
            id: "msg-1",
            sender: "Sarah Chen",
            senderType: "peer",
            avatar:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop",
            text:
              "Hey everyone! I have the TLA+ state machine ready on the whiteboard. When the leader steps down, we check term increments.",
            time: "8m ago"
          },
          {
            id: "msg-2",
            sender: "Alex Mercer",
            senderType: "student",
            avatar:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
            text:
              "I was looking at the split-vote recovery latency. If randomized election timers are between 150ms-300ms, what is the probability of a second split vote?",
            time: "5m ago"
          },
          {
            id: "msg-3",
            sender: "Petra (AI Socratic Facilitator)",
            senderType: "socratic_ai",
            avatar:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
            text:
              "That is a pivotal inquiry, Alex. Marcus or Elena, consider: How does the heartbeat interval T_heartbeat relative to the randomized timeout spread delta T prevent collision recurrence?",
            time: "3m ago",
            isSocraticPrompt: true
          }
        ],
        whiteboardNotes: `# Socratic Collaborative Whiteboard: CS101\n## Focus: Quorum Invariance & Partition Healing\n\n### Formal Invariants:\n1. **Election Safety**: For any term T, at most one leader can be chosen.\n2. **Quorum Intersection**: Any two quorums Q1, Q2 intersect non-trivially.\n\n### Active Challenge:\n- Prove that when a 5-node cluster partitions into (3, 2), the 2-node sub-cluster cannot commit any log entry.`,
        collabLink: "https://meet.jit.si/zalamati-cs101-socratic-squad",
        collabType: "jitsi",
        earnedGroupXp: 350,
        createdAt: "Today"
      }
    ];
  });

  const [showAiPairingModal, setShowAiPairingModal] = React.useState(false);
  const [aiPairCourse, setAiPairCourse] = React.useState("CS101");
  const [aiPairMilestone, setAiPairMilestone] = React.useState("Module 3: Quorum Invariance & Fault Recovery");
  const [aiPairGroupSize, setAiPairGroupSize] = React.useState(4);
  const [aiPairProgress, setAiPairProgress] = React.useState(74);
  const [aiPairSkills, setAiPairSkills] = React.useState<string[]>([
    "Distributed Consensus",
    "Formal Verification",
    "WGSL Shaders"
  ]);
  const [aiPairCustomSkill, setAiPairCustomSkill] = React.useState("");
  const [isPairingAiGroup, setIsPairingAiGroup] = React.useState(false);

  // Active AI Group Room Modal & Interactive Socratic state
  const [activeAiGroup, setActiveAiGroup] = React.useState<AiFacilitatedStudyGroup | null>(null);
  const [aiRoomTab, setAiRoomTab] = React.useState<"workspace" | "synergy" | "agenda" | "whiteboard">("workspace");
  const [aiSquadChatMessage, setAiSquadChatMessage] = React.useState("");
  const [isSocraticIntervening, setIsSocraticIntervening] = React.useState(false);
  const [socraticInterventionNote, setSocraticInterventionNote] = React.useState<string | null>(null);

  React.useEffect(() => {
    localStorage.setItem("zalamati_ai_facilitated_groups", JSON.stringify(aiStudyGroups));
  }, [aiStudyGroups]);

  // Peer Notes & Resources State
  const [sharedResources, setSharedResources] = React.useState<SharedPeerResource[]>(() => {
    const saved = localStorage.getItem("zalamati_shared_resources");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn("Failed to parse shared resources", e);
      }
    }
    return [
      {
        id: "res-1",
        title: "Distributed Systems Capstone: Raft & Paxos Unified Cheat Sheet",
        courseCode: "CS101",
        courseTitle: "Distributed Systems",
        description:
          "Comprehensive 1-page condensed review comparing Raft state machine terms, log commit rules, Paxos phase 1/2 proposals, and Chubby lock service architecture.",
        resourceType: "cheatsheet",
        content:
          "# Distributed Consensus Unified Cheat Sheet\n\n## 1. Raft Invariants\n- **Election Safety**: At most one leader can be elected per term.\n- **Leader Append-Only**: A leader never overwrites or truncates its log; it only appends new entries.\n- **Log Matching**: If two logs contain an entry with the same index and term, they are identical up to that point.\n\n## 2. Quorum Calculation\nFor cluster size $N$, Quorum $Q = \\lfloor N/2 \\rfloor + 1$.\nIntersection property: $Q_1 \\cap Q_2 \\neq \\emptyset$.\n\n## 3. Log Replication RPC\n```typescript\ninterface AppendEntriesRPC {\n  term: number;\n  leaderId: string;\n  prevLogIndex: number;\n  prevLogTerm: number;\n  entries: LogEntry[];\n  leaderCommit: number;\n}\n```",
        authorName: "Sarah Chen",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop",
        authorId: "user-sarah",
        createdAt: "2 days ago",
        upvotes: 42,
        userUpvoted: true,
        downloads: 87,
        tags: ["CS101", "Cheatsheet", "Consensus", "ExamPrep"],
        aiSummary:
          "Exhaustive theoretical and practical cheatsheet covering Raft invariants, quorum mechanics, and TypeScript RPC definitions with proven mathematical rigor.",
        aiKeyConcepts: ["Election Safety", "Quorum Intersection", "Log Invariance", "AppendEntries Protocol"]
      },
      {
        id: "res-2",
        title: "WGSL Matrix Multiplications & 4-bit Quantization Kernel Notes",
        courseCode: "AI301",
        courseTitle: "Edge AI Architecture",
        description:
          "Detailed engineering notes explaining tiled matrix multiplication in WebGPU with workgroup memory caching and coalesced float4 loads.",
        resourceType: "code",
        content:
          "# WGSL Tiled MatMul Kernel\n\n```wgsl\n@group(0) @binding(0) var<storage, read> A: array<vec4<f32>>;\n@group(0) @binding(1) var<storage, read> B: array<vec4<f32>>;\n@group(0) @binding(2) var<storage, read_write> C: array<vec4<f32>>;\n\nvar<workgroup> tileA: array<vec4<f32>, 64>;\nvar<workgroup> tileB: array<vec4<f32>, 64>;\n\n@compute @workgroup_size(8, 8, 1)\nfn main(@builtin(local_invocation_id) local_id: vec3<u32>,\n        @builtin(global_invocation_id) global_id: vec3<u32>) {\n    // Load tiles into shared memory\n    workgroupBarrier();\n    // Multiply & accumulate\n}\n```",
        authorName: "Elena Rostova",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
        authorId: "user-elena",
        createdAt: "3 days ago",
        upvotes: 28,
        userUpvoted: false,
        downloads: 54,
        tags: ["AI301", "WebGPU", "WGSL", "Kernels"],
        aiSummary:
          "High-performance GPU shader code template implementing tiled GEMM in WGSL with workgroup barrier synchronization and 128-bit memory coalescing.",
        aiKeyConcepts: ["Workgroup Memory", "Coalesced Memory Access", "GEMM Shaders", "Barrier Synchronization"]
      }
    ];
  });

  // Resource Upload / View Modal
  const [selectedResource, setSelectedResource] = React.useState<SharedPeerResource | null>(null);
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [newResTitle, setNewResTitle] = React.useState("");
  const [newResCourse, setNewResCourse] = React.useState("CS101");
  const [newResType, setNewResType] = React.useState<"notes" | "cheatsheet" | "code" | "diagram" | "flashcards">("notes");
  const [newResDesc, setNewResDesc] = React.useState("");
  const [newResContent, setNewResContent] = React.useState("");
  const [isScanningResource, setIsScanningResource] = React.useState(false);
  const [scannedSummary, setScannedSummary] = React.useState<string | null>(null);
  const [scannedConcepts, setScannedConcepts] = React.useState<string[]>([]);
  const [resourceFilterType, setResourceFilterType] = React.useState<string>("ALL");

  // AI Peer Matchmaker State
  const [peerMatches, setPeerMatches] = React.useState<PeerMatchRecommendation[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = React.useState(false);
  const [invitedPeers, setInvitedPeers] = React.useState<Set<string>>(new Set());

  // Q&A State
  const [qnAs, setQnAs] = React.useState<QnAQuestion[]>([
    {
      id: "qna-1",
      courseTitle: "CS101: Distributed Systems",
      questionText: "What is the difference between linearizability and serializability in distributed storage?",
      askedBy: "Alex Mercer",
      authorAvatar: user?.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
      createdAt: "10m ago",
      upvotes: 8,
      isAnswered: true,
      aiAnswer: {
        text: "Linearizability is a real-time recency guarantee on single operations/objects (if op B starts after op A completes, B must see A's effect). Serializability is a multi-operation transactional guarantee where operations execute as if in some sequential order, but not necessarily respecting real-time clocks. Strict Serializability combines both!",
        confidence: "99.8% Grounded in Distributed Database Theory",
        answeredAt: "9m ago"
      }
    }
  ]);
  const [qnaInput, setQnaInput] = React.useState("");
  const [isAskingAi, setIsAskingAi] = React.useState(false);

  // Persistence side-effects
  React.useEffect(() => {
    localStorage.setItem("zalamati_forum_threads", JSON.stringify(threads));
  }, [threads]);

  React.useEffect(() => {
    localStorage.setItem("zalamati_study_groups", JSON.stringify(studyGroups));
  }, [studyGroups]);

  React.useEffect(() => {
    localStorage.setItem("zalamati_shared_resources", JSON.stringify(sharedResources));
  }, [sharedResources]);

  // Load AI Peer Matches on Mount or Trigger
  React.useEffect(() => {
    fetchPeerMatches();
  }, []);

  const fetchPeerMatches = async () => {
    setIsLoadingMatches(true);
    try {
      const matches = await ApiService.getPeerMatches({
        name: user.name,
        enrolledCourses: user.enrolledCourseIds || ["CS101", "AI301"],
        learningLevel: user.learningLevel || "standard",
        xp: user.xpPoints || 1450,
        skills: user.skills || ["Distributed Systems", "AI Architecture", "WebGPU", "TypeScript"]
      });
      setPeerMatches(matches);
    } catch (e) {
      console.warn("Failed to load peer matches:", e);
    } finally {
      setIsLoadingMatches(false);
    }
  };

  // ---------------- Handlers: Forums ---------------- //

  const handleUpvoteThread = (threadId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setThreads((list) =>
      list.map((t) => {
        if (t.id === threadId) {
          const nextVoted = !t.userUpvoted;
          return {
            ...t,
            userUpvoted: nextVoted,
            upvotes: t.upvotes + (nextVoted ? 1 : -1)
          };
        }
        return t;
      })
    );
    if (activeThread && activeThread.id === threadId) {
      setActiveThread((prev) =>
        prev
          ? {
              ...prev,
              userUpvoted: !prev.userUpvoted,
              upvotes: prev.upvotes + (!prev.userUpvoted ? 1 : -1)
            }
          : null
      );
    }
  };

  const handleToggleThreadSolved = (threadId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setThreads((list) =>
      list.map((t) => (t.id === threadId ? { ...t, isSolved: !t.isSolved } : t))
    );
    if (activeThread && activeThread.id === threadId) {
      setActiveThread((prev) => (prev ? { ...prev, isSolved: !prev.isSolved } : null));
    }
  };

  const handlePostReply = () => {
    if (!replyInput.trim() || !activeThread) return;

    const newReply: ForumReply = {
      id: `rep-${Date.now()}`,
      authorName: user?.name || "Alex Mercer",
      authorAvatar:
        user?.avatarUrl ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
      authorRole: user?.role === "teacher" ? "Instructor" : "Scholar",
      authorId: user?.id,
      text: replyInput,
      createdAt: "Just now",
      upvotes: 0,
      userUpvoted: false
    };

    const updated = {
      ...activeThread,
      replyCount: activeThread.replyCount + 1,
      replies: [...activeThread.replies, newReply]
    };

    setActiveThread(updated);
    setThreads((list) => list.map((t) => (t.id === activeThread.id ? updated : t)));
    setReplyInput("");
  };

  const handleRequestAiTutorReply = async () => {
    if (!activeThread) return;
    setIsAiReplying(true);

    try {
      const tutorResp = await ApiService.askTutor({
        prompt: `Provide a concise, academically rigorous Socratic peer response to this discussion thread: "${activeThread.title}" - ${activeThread.content}`,
        contextLessonTitle: activeThread.courseTitle
      });

      const aiReply: ForumReply = {
        id: `rep-ai-${Date.now()}`,
        authorName: "Petra (AI Socratic Moderator)",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
        authorRole: "AI Socratic Tutor",
        text: tutorResp.reply,
        createdAt: "Just now",
        isAiTutor: true,
        upvotes: 1
      };

      const updated = {
        ...activeThread,
        replyCount: activeThread.replyCount + 1,
        replies: [...activeThread.replies, aiReply]
      };

      setActiveThread(updated);
      setThreads((list) => list.map((t) => (t.id === activeThread.id ? updated : t)));
    } catch (e) {
      console.warn("AI Tutor reply failed:", e);
    } finally {
      setIsAiReplying(false);
    }
  };

  const handleUpvoteReply = (replyId: string) => {
    if (!activeThread) return;
    const updatedReplies = activeThread.replies.map((rep) => {
      if (rep.id === replyId) {
        const nextVoted = !rep.userUpvoted;
        return {
          ...rep,
          userUpvoted: nextVoted,
          upvotes: (rep.upvotes || 0) + (nextVoted ? 1 : -1)
        };
      }
      return rep;
    });

    const updatedThread = {
      ...activeThread,
      replies: updatedReplies
    };

    setActiveThread(updatedThread);
    setThreads((prev) => prev.map((t) => (t.id === activeThread.id ? updatedThread : t)));
  };

  const handleFlagContent = async (itemId: string, text: string, context: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await ApiService.flagContent({ text, context });
      setFlaggedItems((prev) => new Set([...prev, itemId]));
      if (res.isFlagged) {
        setFlagFeedback(`Content flagged by AI Safety Filter: ${res.reason} (Category: ${res.category})`);
      } else {
        setFlagFeedback("Review recorded: Content verified against academic standards.");
      }
      setTimeout(() => setFlagFeedback(null), 4500);
    } catch (e) {
      setFlaggedItems((prev) => new Set([...prev, itemId]));
      setFlagFeedback("Content flagged and forwarded to academic moderation queue.");
      setTimeout(() => setFlagFeedback(null), 3000);
    }
  };

  const handleSummarizeDiscussion = async () => {
    if (!activeThread) return;
    setIsSummarizingDiscussion(true);
    try {
      const res = await ApiService.summarizeDiscussion({
        threadTitle: activeThread.title,
        courseCode: activeThread.courseCode,
        content: activeThread.content,
        replies: activeThread.replies
      });
      setDiscussionSummary(res);
    } catch (e) {
      console.warn("Discussion summary failed:", e);
    } finally {
      setIsSummarizingDiscussion(false);
    }
  };

  const handleCreateThread = async () => {
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;
    setIsModeratingNewThread(true);

    try {
      const courseTitle =
        newThreadCourse === "CS101"
          ? "Distributed Systems"
          : newThreadCourse === "AI301"
            ? "Edge AI Architecture"
            : newThreadCourse === "MATH201"
              ? "Vector Calculus & Topology"
              : "Advanced Computer Science";

      // Call AI Moderation Endpoint
      const moderation = await ApiService.moderateThread({
        title: newThreadTitle,
        content: newThreadContent,
        courseCode: newThreadCourse,
        courseTitle
      });

      const created: ForumThread = {
        id: `thread-${Date.now()}`,
        courseCode: newThreadCourse,
        courseTitle,
        title: newThreadTitle,
        authorName: user?.name || "Alex Mercer",
        authorAvatar:
          user?.avatarUrl ||
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
        authorRole: user?.role === "teacher" ? "Faculty" : "Scholar",
        authorId: user?.id,
        createdAt: "Just now",
        tags: [newThreadCourse, "Discussion", "Peer Learning"],
        upvotes: 1,
        userUpvoted: true,
        replyCount: 0,
        isSolved: false,
        content: newThreadContent,
        aiModeration: moderation,
        replies: []
      };

      setThreads((prev) => [created, ...prev]);
      setShowNewThreadModal(false);
      setNewThreadTitle("");
      setNewThreadContent("");
    } catch (e) {
      console.warn("Thread creation error:", e);
    } finally {
      setIsModeratingNewThread(false);
    }
  };

  const handleDeleteThread = (threadId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this discussion thread?")) return;
    setThreads((prev) => prev.filter((t) => t.id !== threadId));
    if (activeThread?.id === threadId) {
      setActiveThread(null);
    }
  };

  // ---------------- Handlers: Virtual Study Groups ---------------- //

  const handleGenerateAgenda = async () => {
    if (!newGroupTitle.trim()) return;
    setIsGeneratingAgenda(true);
    try {
      const res = await ApiService.generateStudyGroupAgenda({
        groupTitle: newGroupTitle,
        courseCode: newGroupCourse,
        targetGoal: newGroupGoal || "Collaborative mastery and problem solving",
        memberCount: newGroupMaxMembers
      });
      setGeneratedAgenda(res.agendaMilestones);
    } catch (e) {
      console.warn("Failed to generate agenda:", e);
    } finally {
      setIsGeneratingAgenda(false);
    }
  };

  const handleCreateGroup = () => {
    if (!newGroupTitle.trim() || !newGroupDescription.trim()) return;

    const randomSuffix = Math.random().toString(36).substring(2, 8);
    let link = "";
    if (newGroupCollabType === "jitsi") {
      link = `https://meet.jit.si/zalamati-${newGroupCourse.toLowerCase()}-${randomSuffix}`;
    } else if (newGroupCollabType === "google-meet") {
      link = `https://meet.google.com/zal-${randomSuffix}`;
    } else {
      link = `${window.location.origin}/?tab=study_rooms&roomId=room_${newGroupCourse.toLowerCase()}`;
    }

    const newGroup: VirtualStudyGroup = {
      id: `group-${Date.now()}`,
      title: newGroupTitle,
      courseCode: newGroupCourse,
      courseTitle:
        newGroupCourse === "CS101"
          ? "Distributed Systems"
          : newGroupCourse === "AI301"
            ? "Edge AI Architecture"
            : "Core Curriculum",
      description: newGroupDescription,
      memberCount: 1,
      maxMembers: newGroupMaxMembers,
      nextMeetingTime: "Starts in 30 minutes",
      targetGoal: newGroupGoal || "Collaborative study and practice lab problem sets",
      isJoined: true,
      tags: [newGroupCourse, "Study Group", "Collaborative"],
      createdBy: user?.name || "Alex Mercer",
      members: [
        {
          name: user?.name || "Alex Mercer",
          avatar:
            user?.avatarUrl ||
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
          role: "Group Founder",
          xp: user?.xpPoints || 1450
        }
      ],
      collabLink: link,
      collabType: newGroupCollabType,
      agendaMilestones:
        generatedAgenda.length > 0
          ? generatedAgenda
          : [
              "1. 10m: Icebreaker & Objectives Scope",
              "2. 30m: Collaborative Problem Solving & Whiteboard Exercise",
              "3. 20m: Knowledge Verification & Action Plan"
            ]
    };

    setStudyGroups((prev) => [newGroup, ...prev]);
    setShowNewGroupModal(false);
    setNewGroupTitle("");
    setNewGroupDescription("");
    setNewGroupGoal("");
    setGeneratedAgenda([]);
  };

  const toggleJoinGroup = (groupId: string) => {
    setStudyGroups((list) =>
      list.map((g) => {
        if (g.id === groupId) {
          const nextJoined = !g.isJoined;
          const updatedMembers: StudyGroupMember[] = nextJoined
            ? [
                ...g.members,
                {
                  name: user?.name || "Alex Mercer",
                  avatar:
                    user?.avatarUrl ||
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
                  role: "Collaborator",
                  xp: user?.xpPoints || 1450
                }
              ]
            : g.members.filter((m) => m.name !== (user?.name || "Alex Mercer"));

          return {
            ...g,
            isJoined: nextJoined,
            memberCount: Math.max(1, g.memberCount + (nextJoined ? 1 : -1)),
            members: updatedMembers
          };
        }
        return g;
      })
    );
    if (activeGroup && activeGroup.id === groupId) {
      setActiveGroup((prev) => (prev ? { ...prev, isJoined: !prev.isJoined } : null));
    }
  };

  const handleCopyCollabLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // ---------------- Handlers: AI-Facilitated Study Groups ---------------- //

  const handleTriggerAiPairing = async () => {
    setIsPairingAiGroup(true);
    try {
      const courseTitle =
        aiPairCourse === "CS101"
          ? "Distributed Systems & Advanced Architectures"
          : aiPairCourse === "AI301"
            ? "Edge AI Architecture & WebGPU Kernels"
            : aiPairCourse === "MATH201"
              ? "Vector Calculus & Differential Geometry"
              : "Advanced Computer Science";

      const studentProfile = {
        id: user?.id || "user-alex",
        name: user?.name || "Alex Mercer",
        avatarUrl:
          user?.avatarUrl ||
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
        email: user?.email || "alex.m@academy.edu",
        role: user?.role === "teacher" ? "Faculty Mentor" : "Student Lead",
        primaryStrength:
          aiPairCourse === "CS101"
            ? "Full-Stack System Architecture & WebGL"
            : aiPairCourse === "AI301"
              ? "PyTorch Model Quantization"
              : "Multivariable Matrix Operations",
        growthArea:
          aiPairCourse === "CS101"
            ? "Formal Verification of Distributed Quorums"
            : aiPairCourse === "AI301"
              ? "WGSL Workgroup Shared Memory Barriers"
              : "Differential Forms & Stokes Invariants",
        progressPct: aiPairProgress,
        xpPoints: user?.xpPoints || 1450
      };

      const res = await ApiService.pairAiFacilitatedStudyGroup({
        studentProfile,
        courseCode: aiPairCourse,
        courseTitle,
        targetMilestone: aiPairMilestone,
        groupSize: aiPairGroupSize,
        completionPercentage: aiPairProgress,
        sharedSkillInterests: aiPairSkills
      });

      if (res.success && res.group) {
        setAiStudyGroups((prev) => [res.group, ...prev.filter((g) => g.id !== res.group.id)]);
        setShowAiPairingModal(false);
        setActiveAiGroup(res.group);
      }
    } catch (e) {
      console.warn("AI Pairing failed:", e);
    } finally {
      setIsPairingAiGroup(false);
    }
  };

  const handleSendAiSquadMessage = async () => {
    if (!aiSquadChatMessage.trim() || !activeAiGroup) return;

    const userMsg: SocraticGroupMessage = {
      id: `msg-${Date.now()}`,
      sender: user?.name || "Alex Mercer",
      senderType: "student",
      avatar:
        user?.avatarUrl ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
      text: aiSquadChatMessage.trim(),
      time: "Just now"
    };

    const updatedFeed = [...activeAiGroup.chatFeed, userMsg];
    const updatedGroup: AiFacilitatedStudyGroup = {
      ...activeAiGroup,
      chatFeed: updatedFeed
    };

    setActiveAiGroup(updatedGroup);
    setAiStudyGroups((prev) => prev.map((g) => (g.id === activeAiGroup.id ? updatedGroup : g)));
    setAiSquadChatMessage("");

    // Trigger smart Socratic AI response after user message
    try {
      setIsSocraticIntervening(true);
      const res = await ApiService.socraticInterveneGroup({
        actionType: "pose_question",
        groupContext: {
          title: activeAiGroup.title,
          courseCode: activeAiGroup.courseCode,
          targetMilestone: activeAiGroup.targetMilestone
        },
        lastMessages: updatedFeed.slice(-4),
        currentTopic: activeAiGroup.socraticFacilitator.activeTopic
      });

      if (res.reply) {
        const socraticMsg: SocraticGroupMessage = {
          id: `msg-ai-${Date.now()}`,
          sender: activeAiGroup.socraticFacilitator.name || "Petra (AI Socratic Facilitator)",
          senderType: "socratic_ai",
          avatar:
            activeAiGroup.socraticFacilitator.avatar ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
          text: res.reply,
          time: "Just now",
          isSocraticPrompt: true,
          socraticHint: res.socraticHint
        };

        const finalFeed = [...updatedFeed, socraticMsg];
        const finalGroup = { ...updatedGroup, chatFeed: finalFeed };
        setActiveAiGroup(finalGroup);
        setAiStudyGroups((prev) => prev.map((g) => (g.id === activeAiGroup.id ? finalGroup : g)));
      }
    } catch (e) {
      console.warn("Socratic AI response failed:", e);
    } finally {
      setIsSocraticIntervening(false);
    }
  };

  const handleTriggerSocraticAction = async (
    actionType: "pose_question" | "generate_challenge" | "synthesize_consensus" | "award_xp"
  ) => {
    if (!activeAiGroup) return;
    setIsSocraticIntervening(true);
    setSocraticInterventionNote(null);

    try {
      const res = await ApiService.socraticInterveneGroup({
        actionType,
        groupContext: {
          title: activeAiGroup.title,
          courseCode: activeAiGroup.courseCode,
          targetMilestone: activeAiGroup.targetMilestone
        },
        lastMessages: activeAiGroup.chatFeed.slice(-4),
        currentTopic: activeAiGroup.socraticFacilitator.activeTopic
      });

      let textContent = res.reply;
      if (res.challengeData) {
        textContent += `\n\n**${res.challengeData.title}**\n${res.challengeData.question}`;
        if (res.challengeData.starterCode) {
          textContent += `\n\`\`\`typescript\n${res.challengeData.starterCode}\n\`\`\``;
        }
      }
      if (res.keyTakeaways && res.keyTakeaways.length > 0) {
        textContent += `\n\n**Key Squad Takeaways:**\n` + res.keyTakeaways.map((t) => `• ${t}`).join("\n");
      }

      const socraticMsg: SocraticGroupMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: activeAiGroup.socraticFacilitator.name || "Petra (AI Socratic Facilitator)",
        senderType: "socratic_ai",
        avatar:
          activeAiGroup.socraticFacilitator.avatar ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
        text: textContent,
        time: "Just now",
        isSocraticPrompt: true,
        socraticHint: res.socraticHint
      };

      const newEarnedXp =
        (activeAiGroup.earnedGroupXp || 0) + (res.xpAwarded || (actionType === "award_xp" ? 150 : 25));
      const updatedGroup: AiFacilitatedStudyGroup = {
        ...activeAiGroup,
        earnedGroupXp: newEarnedXp,
        chatFeed: [...activeAiGroup.chatFeed, socraticMsg]
      };

      setActiveAiGroup(updatedGroup);
      setAiStudyGroups((prev) => prev.map((g) => (g.id === activeAiGroup.id ? updatedGroup : g)));

      if (actionType === "award_xp") {
        setSocraticInterventionNote(`⭐ Squad awarded +${res.xpAwarded || 150} Collaboration XP!`);
      } else if (actionType === "synthesize_consensus") {
        setSocraticInterventionNote("🎯 Socratic Consensus synthesized and posted to squad chat!");
      } else if (actionType === "generate_challenge") {
        setSocraticInterventionNote("🧩 Live Challenge generated and posted to squad chat!");
      } else {
        setSocraticInterventionNote("💡 Socratic inquiry posted to squad chat!");
      }

      setTimeout(() => setSocraticInterventionNote(null), 4000);
    } catch (e) {
      console.warn("Socratic action failed:", e);
    } finally {
      setIsSocraticIntervening(false);
    }
  };

  const handleToggleAgendaMilestone = (milestoneId: string) => {
    if (!activeAiGroup) return;
    const updatedAgenda = activeAiGroup.agenda.map((ag) => {
      if (ag.id === milestoneId) {
        return { ...ag, isCompleted: !ag.isCompleted };
      }
      return ag;
    });

    const isNewlyCompleted = !activeAiGroup.agenda.find((a) => a.id === milestoneId)?.isCompleted;
    const updatedXp = (activeAiGroup.earnedGroupXp || 0) + (isNewlyCompleted ? 50 : 0);

    const updatedGroup: AiFacilitatedStudyGroup = {
      ...activeAiGroup,
      agenda: updatedAgenda,
      earnedGroupXp: updatedXp
    };

    setActiveAiGroup(updatedGroup);
    setAiStudyGroups((prev) => prev.map((g) => (g.id === activeAiGroup.id ? updatedGroup : g)));
  };

  const handleDeleteAiStudyGroup = (groupId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to remove this AI-facilitated study squad?")) return;
    setAiStudyGroups((prev) => prev.filter((g) => g.id !== groupId));
    if (activeAiGroup?.id === groupId) {
      setActiveAiGroup(null);
    }
  };

  // ---------------- Handlers: Peer Notes & Resources ---------------- //

  const handleScanNewResource = async () => {
    if (!newResContent.trim()) return;
    setIsScanningResource(true);
    try {
      const summaryRes = await ApiService.summarizeSharedResource({
        title: newResTitle || "Study Note",
        courseCode: newResCourse,
        resourceType: newResType,
        content: newResContent
      });
      setScannedSummary(summaryRes.summary);
      setScannedConcepts(summaryRes.keyConcepts);
    } catch (e) {
      console.warn("Resource scan failed:", e);
    } finally {
      setIsScanningResource(false);
    }
  };

  const handlePublishResource = () => {
    if (!newResTitle.trim() || !newResContent.trim()) return;

    const newRes: SharedPeerResource = {
      id: `res-${Date.now()}`,
      title: newResTitle,
      courseCode: newResCourse,
      courseTitle:
        newResCourse === "CS101"
          ? "Distributed Systems"
          : newResCourse === "AI301"
            ? "Edge AI Architecture"
            : "Core Curriculum",
      description: newResDesc || "Peer-authored study guide and reference resource.",
      resourceType: newResType,
      content: newResContent,
      authorName: user?.name || "Alex Mercer",
      authorAvatar:
        user?.avatarUrl ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
      authorId: user?.id || "user-alex",
      createdAt: "Just now",
      upvotes: 1,
      userUpvoted: true,
      downloads: 0,
      tags: [newResCourse, newResType, "Peer Notes"],
      aiSummary: scannedSummary || "Peer shared note with key concept breakdown.",
      aiKeyConcepts: scannedConcepts.length > 0 ? scannedConcepts : ["Core Theory", "Key Equations", "Applied Patterns"]
    };

    setSharedResources((prev) => [newRes, ...prev]);
    setShowUploadModal(false);
    setNewResTitle("");
    setNewResDesc("");
    setNewResContent("");
    setScannedSummary(null);
    setScannedConcepts([]);
  };

  const handleUpvoteResource = (resId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSharedResources((list) =>
      list.map((r) => {
        if (r.id === resId) {
          const next = !r.userUpvoted;
          return {
            ...r,
            userUpvoted: next,
            upvotes: r.upvotes + (next ? 1 : -1)
          };
        }
        return r;
      })
    );
  };

  const handleDownloadResourceMarkdown = (res: SharedPeerResource) => {
    const blob = new Blob([res.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${res.title.replace(/[^a-zA-Z0-9]/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------------- Handlers: AI Peer Matchmaker ---------------- //

  const handleInvitePeer = (peerId: string) => {
    setInvitedPeers((prev) => new Set(prev).add(peerId));
  };

  // ---------------- Handlers: Real-Time AI Q&A ---------------- //

  const handleAskQnA = async () => {
    if (!qnaInput.trim() || isAskingAi) return;
    const questionText = qnaInput;
    setIsAskingAi(true);
    setQnaInput("");

    try {
      const aiReply = await ApiService.queryAITutor(
        questionText,
        "Social Learning Q&A Portal"
      );

      const newQnA: QnAQuestion = {
        id: `qna-${Date.now()}`,
        courseTitle: selectedCourseFilter !== "ALL" ? `${selectedCourseFilter} Question` : "General Curriculum & AI",
        questionText,
        askedBy: user?.name || "Alex Mercer",
        authorAvatar:
          user?.avatarUrl ||
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
        createdAt: "Just now",
        upvotes: 1,
        isAnswered: true,
        aiAnswer: {
          text: aiReply,
          confidence: "99.8% Grounded in Zalamati Neural Knowledge Base",
          answeredAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      };

      setQnAs((prev) => [newQnA, ...prev]);
    } catch (e) {
      console.warn("Q&A error:", e);
    } finally {
      setIsAskingAi(false);
    }
  };

  // Filtered Items
  const filteredThreads = threads.filter((t) => {
    const matchCourse = selectedCourseFilter === "ALL" || t.courseCode === selectedCourseFilter;
    const matchSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCourse && matchSearch;
  });

  const filteredGroups = studyGroups.filter((g) => {
    const matchCourse = selectedCourseFilter === "ALL" || g.courseCode === selectedCourseFilter;
    const matchSearch =
      !searchQuery ||
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCourse && matchSearch;
  });

  const filteredResources = sharedResources.filter((r) => {
    const matchCourse = selectedCourseFilter === "ALL" || r.courseCode === selectedCourseFilter;
    const matchType = resourceFilterType === "ALL" || r.resourceType === resourceFilterType;
    const matchSearch =
      !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCourse && matchType && matchSearch;
  });

  return (
    <div className="rounded-3xl bg-[#08151c] border border-[#1b3b4a] p-5 sm:p-7 md:p-8 space-y-6 text-white shadow-2xl">
      {/* Top Banner & Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#183646] pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              Peer-to-Peer Learning Mesh
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-mono">
              AI Moderated & Socratic Guided
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
            Collaborative Study Groups, Discussion Forums & Peer Resources
          </h2>
          <p className="text-xs sm:text-sm text-[#789cae]">
            Form virtual study rooms, engage in AI-moderated course forums, exchange peer notes, and find optimal study buddies.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {activeTab === "groups" && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowAiPairingModal(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 transition-all active:scale-95 border border-cyan-300/40"
              >
                <Bot className="w-4 h-4 text-slate-950" />
                <span>Pair with AI Socratic Squad</span>
              </button>

              <button
                onClick={() => {
                  setGeneratedAgenda([]);
                  setShowNewGroupModal(true);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] hover:border-cyan-400 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Standard Group</span>
              </button>
            </div>
          )}

          {activeTab === "forums" && (
            <button
              onClick={() => setShowNewThreadModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Discussion Thread</span>
            </button>
          )}

          {activeTab === "notes" && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs shadow-lg flex items-center gap-2 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Share Study Resource</span>
            </button>
          )}

          {activeTab === "matchmaker" && (
            <button
              onClick={fetchPeerMatches}
              disabled={isLoadingMatches}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-700 to-blue-700 hover:from-cyan-600 hover:to-blue-600 text-white font-black text-xs shadow-lg flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingMatches ? "animate-spin" : ""}`} />
              <span>Recalculate Peer Matches</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Switcher Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#183646] pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab("forums")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "forums"
                ? "bg-cyan-500 text-slate-950 font-black shadow-lg"
                : "bg-[#0c1a24] text-[#789cae] border border-[#1b3b4a] hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Discussion Forums ({threads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("groups")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "groups"
                ? "bg-cyan-600 text-white font-black shadow-lg"
                : "bg-[#0c1a24] text-[#789cae] border border-[#1b3b4a] hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Virtual Study Groups ({studyGroups.length + aiStudyGroups.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("notes")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "notes"
                ? "bg-blue-600 text-white font-black shadow-lg"
                : "bg-[#0c1a24] text-[#789cae] border border-[#1b3b4a] hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Peer Notes & Resources ({sharedResources.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("matchmaker")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "matchmaker"
                ? "bg-cyan-700 text-white font-black shadow-lg"
                : "bg-[#0c1a24] text-[#789cae] border border-[#1b3b4a] hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Peer Matchmaker ({peerMatches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("qna")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "qna"
                ? "bg-blue-800 text-white font-black shadow-lg"
                : "bg-[#0c1a24] text-[#789cae] border border-[#1b3b4a] hover:text-white"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Real-Time AI Q&A ({qnAs.length})</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Course Selector Filter */}
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Courses</option>
            <option value="CS101">CS101: Distributed Systems</option>
            <option value="AI301">AI301: Edge AI Architecture</option>
            <option value="MATH201">MATH201: Vector Calculus</option>
          </select>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#638799] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions & topics..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] text-xs text-white placeholder-[#5a7d8e] focus:outline-none focus:border-cyan-400 w-44 sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* ================= TAB 1: AI-MODERATED DISCUSSION FORUMS ================= */}
      {activeTab === "forums" && (
        <div className="space-y-4">
          {filteredThreads.length === 0 ? (
            <div className="p-8 text-center bg-[#0c1a24] rounded-2xl border border-[#1b3b4a] space-y-3">
              <MessageSquare className="w-10 h-10 text-cyan-400/40 mx-auto" />
              <h3 className="text-sm font-bold text-white">No discussions found</h3>
              <p className="text-xs text-[#789cae]">
                Be the first scholar to start a conversation in this topic area.
              </p>
              <button
                onClick={() => setShowNewThreadModal(true)}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs"
              >
                Start Discussion
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => setActiveThread(thread)}
                  className="p-5 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] hover:border-cyan-500/60 cursor-pointer transition-all duration-300 space-y-3 flex flex-col justify-between group shadow-lg relative overflow-hidden"
                >
                  <div className="space-y-2.5">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
                          {thread.courseCode}
                        </span>
                        {thread.isSolved ? (
                          <span className="px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                            Solved
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold">
                            In Discussion
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] text-[#638799] font-mono">
                        {thread.createdAt}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {thread.title}
                    </h3>

                    {/* Content Snippet */}
                    <p className="text-xs text-[#789cae] line-clamp-2 leading-relaxed">
                      {thread.content}
                    </p>

                    {/* AI Moderation Pill */}
                    {thread.aiModeration && (
                      <div className="p-2 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-300 flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">
                          <strong className="text-cyan-200">AI Socratic Hint:</strong> {thread.aiModeration.socraticHint}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer Stats & Author */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#183646] text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={thread.authorAvatar}
                        alt={thread.authorName}
                        className="w-6 h-6 rounded-full object-cover border border-[#1b3b4a]"
                      />
                      <span className="text-xs font-semibold text-gray-300">
                        {thread.authorName}
                      </span>
                      <span className="text-[10px] text-[#638799] hidden sm:inline">
                        • {thread.authorRole}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleUpvoteThread(thread.id, e)}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-all ${
                          thread.userUpvoted
                            ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                            : "bg-[#08151c] border-[#1b3b4a] text-[#789cae] hover:text-white"
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{thread.upvotes}</span>
                      </button>

                      <div className="flex items-center gap-1 text-[#789cae] text-xs">
                        <MessageCircle className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{thread.replyCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: VIRTUAL STUDY GROUPS & AI SOCRATIC SQUADS ================= */}
      {activeTab === "groups" && (
        <div className="space-y-5">
          {/* Sub-Filter Controls & AI Squad Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#08151c] p-3.5 rounded-2xl border border-[#1b3b4a]">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setGroupSubFilter("all")}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 whitespace-nowrap ${
                  groupSubFilter === "all"
                    ? "bg-cyan-500 text-slate-950 font-black shadow"
                    : "bg-[#0c1a24] text-[#789cae] border border-[#1b3b4a] hover:text-white"
                }`}
              >
                <span>All Groups ({studyGroups.length + aiStudyGroups.length})</span>
              </button>

              <button
                onClick={() => setGroupSubFilter("ai_facilitated")}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 whitespace-nowrap ${
                  groupSubFilter === "ai_facilitated"
                    ? "bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 font-black shadow"
                    : "bg-[#0c1a24] text-cyan-300 border border-cyan-500/40 hover:border-cyan-400"
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>AI Socratic Squads ({aiStudyGroups.length})</span>
              </button>

              <button
                onClick={() => setGroupSubFilter("standard")}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 whitespace-nowrap ${
                  groupSubFilter === "standard"
                    ? "bg-blue-600 text-white font-black shadow"
                    : "bg-[#0c1a24] text-[#789cae] border border-[#1b3b4a] hover:text-white"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Standard Peer Groups ({studyGroups.length})</span>
              </button>
            </div>

            <div className="text-[11px] font-mono text-[#789cae] flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Socratic Matchmaking Engine Active</span>
            </div>
          </div>

          {/* Section: AI-Facilitated Socratic Study Groups */}
          {(groupSubFilter === "all" || groupSubFilter === "ai_facilitated") && (
            <div className="space-y-3">
              {groupSubFilter === "all" && (
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-cyan-300 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-cyan-400" />
                    <span>AI-Facilitated Socratic Study Squads</span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono">
                      Complementary Skill Synergy & Autonomous Agenda
                    </span>
                  </h3>
                  <button
                    onClick={() => setShowAiPairingModal(true)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                  >
                    <span>+ New Squad Match</span>
                  </button>
                </div>
              )}

              {aiStudyGroups.length === 0 ? (
                <div className="p-6 text-center bg-[#0c1a24] rounded-2xl border border-dashed border-[#1b3b4a] space-y-2">
                  <Bot className="w-8 h-8 text-cyan-400/40 mx-auto" />
                  <p className="text-xs text-[#789cae]">No active AI Socratic squads yet.</p>
                  <button
                    onClick={() => setShowAiPairingModal(true)}
                    className="px-4 py-1.5 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs"
                  >
                    Pair with Socratic Squad
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiStudyGroups.map((group) => (
                    <div
                      key={group.id}
                      className="p-5 rounded-2xl bg-gradient-to-br from-[#0c1a24] via-[#091821] to-[#08151c] border border-cyan-500/40 hover:border-cyan-400 transition-all space-y-4 shadow-xl flex flex-col justify-between relative group"
                    >
                      {/* Top Header with Synergy Score */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 text-[10px] font-mono font-bold flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-cyan-400" />
                              {group.courseCode} • {group.synergyScore}% Skill Synergy
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">
                              ★ {group.earnedGroupXp || 0} XP
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-[#789cae] flex items-center gap-1">
                              <Clock className="w-3 h-3 text-cyan-400" />
                              {group.nextMeetingTime}
                            </span>
                            <button
                              onClick={(e) => handleDeleteAiStudyGroup(group.id, e)}
                              className="text-[#4b6978] hover:text-cyan-400 transition-colors p-1"
                              title="Delete Squad"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {/* Squad Title & Focus Milestone */}
                        <div>
                          <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                            {group.title}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1 text-xs text-cyan-400/90 font-medium">
                            <Target className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span className="line-clamp-1">{group.targetMilestone}</span>
                          </div>
                          <p className="text-xs text-[#789cae] mt-1.5 line-clamp-2 leading-relaxed">
                            {group.description}
                          </p>
                        </div>

                        {/* Socratic Facilitator Callout */}
                        <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                              <Bot className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{group.socraticFacilitator.name}</span>
                            </div>
                            <span className="text-[10px] font-mono text-[#638799]">
                              Active Inquiry
                            </span>
                          </div>
                          <p className="text-gray-200 text-[11px] italic leading-snug">
                            "{group.socraticFacilitator.currentInquiry}"
                          </p>
                        </div>

                        {/* Complementary Peer Squad Cards Preview */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] text-[#789cae]">
                            <span>Complementary Peer Roster ({group.members.length} Scholars)</span>
                            <span className="font-mono text-cyan-400 text-[10px]">
                              Avg Progress:{" "}
                              {Math.round(
                                group.members.reduce((acc, m) => acc + m.progressPct, 0) /
                                  group.members.length
                              )}
                              %
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {group.members.slice(0, 4).map((member) => (
                              <div
                                key={member.id}
                                className="p-2 rounded-xl bg-[#08151c] border border-[#1b3b4a] space-y-1 text-xs"
                              >
                                <div className="flex items-center gap-1.5">
                                  <img
                                    src={member.avatar}
                                    alt={member.name}
                                    className="w-6 h-6 rounded-full object-cover border border-cyan-400/40"
                                  />
                                  <div className="overflow-hidden">
                                    <div className="font-bold text-white text-[11px] truncate flex items-center gap-1">
                                      {member.name}
                                      {member.isCurrentUser && (
                                        <span className="text-[8px] bg-cyan-500/30 text-cyan-300 px-1 rounded">
                                          You
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[9px] text-[#638799] truncate font-mono">
                                      {member.progressPct}% done • {member.xp} XP
                                    </div>
                                  </div>
                                </div>
                                <div className="text-[9px] text-cyan-300/80 truncate font-mono">
                                  ⚡ {member.primaryStrength}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 4-Phase Socratic Agenda Progress */}
                        <div className="p-2.5 rounded-xl bg-[#08151c] border border-[#1b3b4a] space-y-1.5 text-xs">
                          <div className="flex items-center justify-between text-[10px] font-mono text-[#789cae]">
                            <span>Socratic Agenda Progress</span>
                            <span className="text-cyan-300">
                              {group.agenda.filter((a) => a.isCompleted).length}/{group.agenda.length} Milestones
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-[#0c1a24] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
                              style={{
                                width: `${
                                  (group.agenda.filter((a) => a.isCompleted).length /
                                    group.agenda.length) *
                                  100
                                }%`
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Squad Action Buttons */}
                      <div className="flex items-center gap-2 pt-3 border-t border-[#183646]">
                        <button
                          onClick={() => {
                            setActiveAiGroup(group);
                            setAiRoomTab("workspace");
                          }}
                          className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95"
                        >
                          <Bot className="w-4 h-4 text-slate-950" />
                          <span>Enter Socratic Study Room</span>
                        </button>

                        {group.collabLink && (
                          <a
                            href={group.collabLink}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2.5 rounded-xl bg-[#08151c] border border-[#1b3b4a] hover:border-cyan-400 text-cyan-300 hover:text-white transition-all"
                            title="Launch Video Conference"
                          >
                            <Video className="w-4 h-4" />
                          </a>
                        )}

                        <button
                          onClick={() => {
                            setActiveAiGroup(group);
                            setAiRoomTab("synergy");
                          }}
                          className="px-3 py-2.5 rounded-xl bg-[#08151c] border border-[#1b3b4a] hover:border-cyan-400 text-[#789cae] hover:text-cyan-300 font-bold text-xs"
                        >
                          Synergy Matrix
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section: Standard Study Groups */}
          {(groupSubFilter === "all" || groupSubFilter === "standard") && (
            <div className="space-y-3 pt-2">
              {groupSubFilter === "all" && (
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>Standard Peer Study Groups</span>
                  </h3>
                  <button
                    onClick={() => setShowNewGroupModal(true)}
                    className="text-xs text-[#789cae] hover:text-cyan-300 font-bold flex items-center gap-1"
                  >
                    <span>+ New Standard Group</span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    className="p-5 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] hover:border-cyan-500/50 transition-all space-y-4 shadow-lg flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Top Bar */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
                          {group.courseCode} • {group.courseTitle || "Study Group"}
                        </span>
                        <span className="text-[10px] font-mono text-[#789cae] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          {group.nextMeetingTime}
                        </span>
                      </div>

                      {/* Title & Goal */}
                      <div>
                        <h3 className="font-bold text-sm text-white">{group.title}</h3>
                        <p className="text-xs text-[#789cae] mt-1 leading-relaxed">
                          {group.description}
                        </p>
                      </div>

                      {/* Target Goal Banner */}
                      <div className="p-3 rounded-xl bg-[#08151c] border border-[#1b3b4a] space-y-1 text-xs">
                        <div className="text-[10px] uppercase tracking-wider text-cyan-400 font-mono font-bold flex items-center gap-1">
                          <Award className="w-3 h-3 text-cyan-400" />
                          Target Goal
                        </div>
                        <p className="text-gray-200">{group.targetGoal}</p>
                      </div>

                      {/* AI Agenda Milestones */}
                      {group.agendaMilestones && group.agendaMilestones.length > 0 && (
                        <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-1.5 text-xs">
                          <div className="text-[10px] font-mono font-bold text-cyan-300 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            AI-Structured 60m Study Agenda
                          </div>
                          <div className="space-y-1 text-[11px] text-gray-300">
                            {group.agendaMilestones.slice(0, 3).map((ms, idx) => (
                              <div key={idx} className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                                <span className="line-clamp-1">{ms}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Member Avatars & Capacity */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <div className="flex items-center gap-1.5">
                          <div className="flex -space-x-2">
                            {group.members.map((m, idx) => (
                              <img
                                key={idx}
                                src={m.avatar}
                                alt={m.name}
                                title={`${m.name} (${m.role})`}
                                className="w-7 h-7 rounded-full border-2 border-[#0c1a24] object-cover"
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-[#789cae] ml-2 font-mono">
                            {group.memberCount}/{group.maxMembers} Scholars
                          </span>
                        </div>

                        {group.isJoined && (
                          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                            ✓ Joined
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Collab Action Buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-[#183646]">
                      {group.collabLink ? (
                        <a
                          href={group.collabLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Launch Room</span>
                        </a>
                      ) : (
                        <button
                          onClick={() => toggleJoinGroup(group.id)}
                          className={`flex-1 px-3 py-2 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
                            group.isJoined
                              ? "bg-[#122a36] text-gray-300 hover:bg-cyan-950/40 hover:text-cyan-300"
                              : "bg-cyan-400 hover:bg-cyan-300 text-slate-950"
                          }`}
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>{group.isJoined ? "Leave Group" : "Join Study Group"}</span>
                        </button>
                      )}

                      {group.collabLink && (
                        <button
                          onClick={() => handleCopyCollabLink(group.collabLink!)}
                          className="p-2 rounded-xl bg-[#08151c] border border-[#1b3b4a] hover:border-cyan-400 text-[#789cae] hover:text-white transition-all"
                          title="Copy Meeting Link"
                        >
                          {copiedLink ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      )}

                      <button
                        onClick={() => setActiveGroup(group)}
                        className="px-3 py-2 rounded-xl bg-[#08151c] border border-[#1b3b4a] hover:border-cyan-400 text-cyan-300 font-bold text-xs"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: PEER NOTES & RESOURCES EXCHANGE ================= */}
      {activeTab === "notes" && (
        <div className="space-y-4">
          {/* Sub-Filter By Resource Type */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[#638799] font-mono text-[11px]">Type Filter:</span>
            {["ALL", "notes", "cheatsheet", "code", "diagram", "flashcards"].map((t) => (
              <button
                key={t}
                onClick={() => setResourceFilterType(t)}
                className={`px-3 py-1 rounded-lg capitalize text-xs font-semibold transition-all ${
                  resourceFilterType === t
                    ? "bg-cyan-400 text-slate-950 font-black"
                    : "bg-[#0c1a24] text-[#789cae] border border-[#1b3b4a] hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="p-5 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] hover:border-cyan-500/50 transition-all space-y-3 flex flex-col justify-between shadow-lg"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold uppercase">
                        {res.courseCode} • {res.resourceType}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#638799] font-mono">{res.createdAt}</span>
                  </div>

                  <h3 className="font-bold text-sm text-white hover:text-cyan-300 transition-colors">
                    {res.title}
                  </h3>

                  <p className="text-xs text-[#789cae] line-clamp-2 leading-relaxed">
                    {res.description}
                  </p>

                  {/* AI Key Concepts Extract */}
                  {res.aiKeyConcepts && res.aiKeyConcepts.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {res.aiKeyConcepts.map((concept, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#08151c] border border-[#1b3b4a] text-[#789cae] text-[10px]"
                        >
                          🏷️ {concept}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* AI Summary */}
                  {res.aiSummary && (
                    <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200/90 leading-relaxed">
                      <span className="font-bold text-cyan-300">✨ AI Synthesis: </span>
                      {res.aiSummary}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-3 border-t border-[#183646] text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={res.authorAvatar}
                      alt={res.authorName}
                      className="w-6 h-6 rounded-full object-cover border border-[#1b3b4a]"
                    />
                    <span className="text-xs font-semibold text-gray-300">{res.authorName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleUpvoteResource(res.id, e)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs transition-all ${
                        res.userUpvoted
                          ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                          : "bg-[#08151c] border-[#1b3b4a] text-[#789cae] hover:text-white"
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{res.upvotes}</span>
                    </button>

                    <button
                      onClick={() => handleDownloadResourceMarkdown(res)}
                      className="p-1.5 rounded-lg bg-[#08151c] border border-[#1b3b4a] hover:border-cyan-400 text-[#789cae] hover:text-white transition-all"
                      title="Download Markdown"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setSelectedResource(res)}
                      className="px-3 py-1 rounded-lg bg-cyan-400 text-slate-950 font-black text-xs"
                    >
                      Read Note
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: AI PEER MATCHMAKER (STUDY BUDDY NETWORK) ================= */}
      {activeTab === "matchmaker" && (
        <div className="space-y-6">
          {/* Matchmaker Concept Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#0c1a24] to-blue-950/40 border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-cyan-300 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-cyan-400" />
                Adaptive Cognitive Matchmaking Engine
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">
                Matching Score based on XP, Course Enrollments & Complementary Strengths
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Zalamati AI continuously analyzes your current roadblocks, active course modules, and study preferences to introduce compatible peers for collaborative labs and peer review sessions.
            </p>
          </div>

          {/* Peer Match Cards */}
          {isLoadingMatches ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-cyan-300 font-mono">Calculating multi-factor learning compatibility...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {peerMatches.map((peer) => {
                const isInvited = invitedPeers.has(peer.id);
                return (
                  <div
                    key={peer.id}
                    className="p-5 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] hover:border-cyan-500/50 transition-all space-y-4 shadow-xl flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Top Header: Peer Avatar, Name, Role & Match Score */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={peer.peerAvatar}
                            alt={peer.peerName}
                            className="w-11 h-11 rounded-full object-cover border-2 border-cyan-500/40 shadow"
                          />
                          <div>
                            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                              {peer.peerName}
                            </h3>
                            <span className="text-[11px] text-cyan-300 font-mono">
                              {peer.peerRole}
                            </span>
                          </div>
                        </div>

                        {/* Match Percentage Badge */}
                        <div className="text-right">
                          <span className="px-2.5 py-1 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-black font-mono text-xs shadow">
                            {peer.matchScore}% Match
                          </span>
                        </div>
                      </div>

                      {/* AI Match Reason */}
                      <div className="p-3 rounded-xl bg-[#08151c] border border-cyan-500/20 text-xs space-y-1">
                        <div className="text-[10px] uppercase font-mono font-bold text-cyan-300 flex items-center gap-1">
                          <Lightbulb className="w-3 h-3 text-cyan-400" />
                          Why You Match
                        </div>
                        <p className="text-gray-200 text-xs leading-relaxed">{peer.reason}</p>
                      </div>

                      {/* Shared Courses */}
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase font-mono text-[#638799]">
                          Shared Course Topics:
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {peer.sharedCourses.map((c, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Complementary Skills */}
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase font-mono text-[#638799]">
                          Complementary Strengths:
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {peer.complementarySkills.map((s, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-[10px]"
                            >
                              ✓ {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Study Habits */}
                      <div className="text-[11px] text-[#789cae] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>Habits: {peer.studyHabits}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-[#183646]">
                      <button
                        onClick={() => handleInvitePeer(peer.id)}
                        disabled={isInvited}
                        className={`flex-1 px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                          isInvited
                            ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 cursor-default"
                            : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow"
                        }`}
                      >
                        {isInvited ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Invitation Sent</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Invite to Study Group</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab("forums");
                          setShowNewThreadModal(true);
                          setNewThreadTitle(`Peer Review: Collaborative problem set with ${peer.peerName}`);
                        }}
                        className="px-3 py-2 rounded-xl bg-[#08151c] border border-[#1b3b4a] hover:border-cyan-400 text-cyan-300 text-xs font-bold"
                      >
                        Request Review
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 5: REAL-TIME AI Q&A PORTAL ================= */}
      {activeTab === "qna" && (
        <div className="space-y-6">
          {/* Ask AI Box */}
          <div className="p-5 rounded-2xl bg-[#0c1a24] border border-cyan-500/30 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Ask Real-Time AI Socratic Tutor Anything</span>
            </h3>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={qnaInput}
                onChange={(e) => setQnaInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskQnA()}
                placeholder="Ask any complex theorem, proof, or engineering challenge from your courses..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#08151c] border border-[#1b3b4a] text-xs text-white focus:outline-none focus:border-cyan-400"
              />

              <button
                onClick={handleAskQnA}
                disabled={isAskingAi}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>{isAskingAi ? "Synthesizing..." : "Ask AI Tutor"}</span>
              </button>
            </div>
          </div>

          {/* Q&A List */}
          <div className="space-y-4">
            {qnAs.map((q) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded">
                    {q.courseTitle}
                  </span>
                  <span className="text-[10px] text-[#789cae]">{q.createdAt}</span>
                </div>

                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{q.questionText}</span>
                </h3>

                {q.aiAnswer && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/30 to-cyan-950/20 border border-cyan-500/30 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-cyan-300 font-mono">
                      <span className="flex items-center gap-1 font-bold">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        Zalamati Socratic Response
                      </span>
                      <span>{q.aiAnswer.confidence}</span>
                    </div>

                    <p className="text-gray-200 leading-relaxed">{q.aiAnswer.text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL: ACTIVE THREAD VIEW ================= */}
      {activeThread && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#08151c] border border-[#1b3b4a] rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl text-white max-h-[90vh] flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#183646] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">
                    {activeThread.courseCode} Discussion Thread
                  </span>
                  {activeThread.isSolved && (
                    <span className="px-2 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                      ✓ Solved
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  {activeThread.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveThread(null)}
                className="text-[#789cae] hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Flag Feedback Notification */}
            {flagFeedback && (
              <div className="p-3 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2 animate-fade-in">
                <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{flagFeedback}</span>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              {/* Question Box */}
              <div className="p-4 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={activeThread.authorAvatar}
                      alt={activeThread.authorName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="font-semibold text-white">{activeThread.authorName}</span>
                    <span className="text-[10px] text-[#789cae]">({activeThread.authorRole})</span>
                    {flaggedItems.has(activeThread.id) && (
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold">
                        Under Review
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#789cae]">{activeThread.createdAt}</span>
                    <button
                      onClick={(e) => handleFlagContent(activeThread.id, activeThread.content, "Thread Question", e)}
                      title="Flag non-academic content"
                      className="text-[#648798] hover:text-cyan-400 transition-colors p-1"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-200 leading-relaxed text-xs">{activeThread.content}</p>

                {/* Moderation Box */}
                {activeThread.aiModeration && (
                  <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between text-cyan-300 font-mono font-bold">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        AI Moderation & Socratic Advisor
                      </span>
                      <span>Score: {activeThread.aiModeration.relevanceScore}%</span>
                    </div>
                    <p className="text-gray-300">{activeThread.aiModeration.socraticHint}</p>
                    {activeThread.aiModeration.suggestedModule && (
                      <div className="text-cyan-300 text-[10px] font-mono">
                        Suggested Reference: {activeThread.aiModeration.suggestedModule}
                      </div>
                    )}
                  </div>
                )}

                {/* AI Discussion Summary Box */}
                {discussionSummary && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/40 space-y-2 text-[11px] animate-fade-in shadow-xl">
                    <div className="flex items-center justify-between text-cyan-300 font-bold border-b border-cyan-500/20 pb-1.5">
                      <span className="flex items-center gap-1.5 font-mono">
                        <Brain className="w-4 h-4 text-cyan-400" />
                        AI-Synthesized Discussion Summary & Consensus
                      </span>
                      <button
                        onClick={() => setDiscussionSummary(null)}
                        className="text-cyan-400 hover:text-white text-xs px-1"
                      >
                        ✕
                      </button>
                    </div>

                    <p className="text-gray-200 leading-relaxed">{discussionSummary.summary}</p>

                    {discussionSummary.keyConsensusPoints?.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-cyan-300 font-semibold block text-[10px] uppercase font-mono">Key Consensus Points:</span>
                        <ul className="list-disc list-inside text-gray-300 space-y-0.5 pl-1">
                          {discussionSummary.keyConsensusPoints.map((pt, idx) => (
                            <li key={idx} className="leading-normal">{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {discussionSummary.topPeerContribution && (
                      <div className="p-2 rounded-lg bg-cyan-900/20 border border-cyan-500/20 text-cyan-200">
                        <strong className="text-cyan-400 font-mono">Peer Highlight:</strong> {discussionSummary.topPeerContribution}
                      </div>
                    )}

                    {discussionSummary.recommendedNextStep && (
                      <div className="text-cyan-300 text-[10px] font-mono flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3 text-cyan-400" />
                        <span>Action: {discussionSummary.recommendedNextStep}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Thread Action Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-[#183646] flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpvoteThread(activeThread.id)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg border text-xs transition-all ${
                        activeThread.userUpvoted
                          ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold"
                          : "bg-[#08151c] border-[#1b3b4a] text-[#789cae] hover:text-white"
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{activeThread.upvotes} Upvotes</span>
                    </button>

                    <button
                      onClick={() => handleToggleThreadSolved(activeThread.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        activeThread.isSolved
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                          : "bg-[#08151c] border border-[#1b3b4a] text-[#789cae] hover:text-white"
                      }`}
                    >
                      {activeThread.isSolved ? "✓ Solved" : "Mark Solved"}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSummarizeDiscussion}
                      disabled={isSummarizingDiscussion}
                      className="px-3 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center gap-1 hover:bg-cyan-500/30 transition-all disabled:opacity-50"
                    >
                      <Brain className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isSummarizingDiscussion ? "Summarizing..." : "AI Discussion Summary"}</span>
                    </button>

                    <button
                      onClick={handleRequestAiTutorReply}
                      disabled={isAiReplying}
                      className="px-3 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center gap-1 hover:bg-cyan-500/30 transition-all disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isAiReplying ? "Synthesizing..." : "Request AI Reply"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Replies List */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-cyan-300 text-xs flex items-center justify-between">
                  <span>Responses & Peer Solutions ({activeThread.replies.length})</span>
                  <span className="text-[10px] text-[#648798] font-normal">Upvote helpful answers below</span>
                </h4>

                {activeThread.replies.map((rep) => (
                  <div
                    key={rep.id}
                    className={`p-3.5 rounded-xl border space-y-2 ${
                      rep.isAiTutor
                        ? "bg-cyan-950/25 border-cyan-500/30"
                        : "bg-[#0c1a24] border-[#1b3b4a]"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        {rep.authorName}
                        {rep.isAiTutor && (
                          <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono">
                            AI Socratic Tutor
                          </span>
                        )}
                        {flaggedItems.has(rep.id) && (
                          <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold">
                            Flagged
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#648798]">{rep.createdAt}</span>
                        <button
                          onClick={(e) => handleFlagContent(rep.id, rep.text, "Peer Reply", e)}
                          title="Report content"
                          className="text-[#557585] hover:text-cyan-400 transition-colors p-0.5"
                        >
                          <ShieldAlert className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-200 leading-relaxed text-xs">{rep.text}</p>

                    {/* Reply Upvote Action */}
                    <div className="flex items-center justify-end pt-1 border-t border-[#183646]/60">
                      <button
                        onClick={() => handleUpvoteReply(rep.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-[11px] transition-all ${
                          rep.userUpvoted
                            ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300 font-bold"
                            : "bg-[#08151c] border-[#1b3b4a] text-[#789cae] hover:text-white"
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3 text-cyan-400" />
                        <span>Helpful ({rep.upvotes || 0})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Post Reply Input */}
            <div className="flex items-center gap-2 pt-3 border-t border-[#183646]">
              <input
                type="text"
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePostReply()}
                placeholder="Write your constructive peer response or proof..."
                className="flex-1 px-4 py-2 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={handlePostReply}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow transition-all active:scale-95"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: NEW THREAD CREATION ================= */}
      {showNewThreadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#08151c] border border-[#1b3b4a] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-white">
            <h3 className="text-base font-bold text-white">
              Start New Academic Discussion Thread
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#789cae] mb-1 font-semibold">Course Code</label>
                <select
                  value={newThreadCourse}
                  onChange={(e) => setNewThreadCourse(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] text-cyan-300 font-mono font-bold focus:outline-none"
                >
                  <option value="CS101">CS101 - Distributed Systems</option>
                  <option value="AI301">AI301 - Edge AI Architecture</option>
                  <option value="MATH201">MATH201 - Vector Calculus & Topology</option>
                </select>
              </div>

              <div>
                <label className="block text-[#789cae] mb-1 font-semibold">Topic / Question Title</label>
                <input
                  type="text"
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  placeholder="e.g. Question regarding Raft consensus timeouts..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[#789cae] mb-1 font-semibold">Details & Theoretical Context</label>
                <textarea
                  rows={4}
                  value={newThreadContent}
                  onChange={(e) => setNewThreadContent(e.target.value)}
                  placeholder="Explain your theoretical question, edge case, or hypothesis in detail..."
                  className="w-full p-3 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#183646]">
              <button
                onClick={() => setShowNewThreadModal(false)}
                className="px-4 py-2 rounded-xl bg-[#122a36] text-[#789cae] font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateThread}
                disabled={isModeratingNewThread}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs shadow flex items-center gap-1.5 disabled:opacity-50"
              >
                {isModeratingNewThread ? "AI Moderating..." : "Post with AI Verification"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE VIRTUAL STUDY GROUP ================= */}
      {showNewGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#08151c] border border-[#1b3b4a] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-white">
            <h3 className="text-base font-bold text-white">Create Virtual Study Group</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#789cae] mb-1 font-semibold">Course</label>
                <select
                  value={newGroupCourse}
                  onChange={(e) => setNewGroupCourse(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] text-cyan-300 font-mono font-bold focus:outline-none"
                >
                  <option value="CS101">CS101 - Distributed Systems</option>
                  <option value="AI301">AI301 - Edge AI Architecture</option>
                  <option value="MATH201">MATH201 - Vector Calculus</option>
                </select>
              </div>

              <div>
                <label className="block text-[#789cae] mb-1 font-semibold">Group Title</label>
                <input
                  type="text"
                  value={newGroupTitle}
                  onChange={(e) => setNewGroupTitle(e.target.value)}
                  placeholder="e.g. Raft Consensus Paper Deep-Dive"
                  className="w-full px-3 py-2 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[#789cae] mb-1 font-semibold">Description & Target Goal</label>
                <textarea
                  rows={3}
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="Describe the collaborative objective..."
                  className="w-full p-3 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#789cae] mb-1 font-semibold">Max Members</label>
                  <input
                    type="number"
                    min={2}
                    max={20}
                    value={newGroupMaxMembers}
                    onChange={(e) => setNewGroupMaxMembers(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#789cae] mb-1 font-semibold">Collaboration Space</label>
                  <select
                    value={newGroupCollabType}
                    onChange={(e) => setNewGroupCollabType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] text-white focus:outline-none"
                  >
                    <option value="jitsi">Jitsi Meet Space</option>
                    <option value="google-meet">Google Meet</option>
                    <option value="zalamati">Zalamati Live Study Room</option>
                  </select>
                </div>
              </div>

              {/* AI Agenda Generator Trigger */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleGenerateAgenda}
                  disabled={isGeneratingAgenda || !newGroupTitle.trim()}
                  className="w-full py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-500 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isGeneratingAgenda ? "Generating AI Agenda..." : "Generate AI Study Agenda & Milestones"}</span>
                </button>
              </div>

              {generatedAgenda.length > 0 && (
                <div className="p-3 rounded-xl bg-[#0c1a24] border border-cyan-500/30 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-300 font-bold">
                    Generated 60m Agenda:
                  </span>
                  <div className="space-y-0.5 text-[11px] text-gray-300">
                    {generatedAgenda.map((ag, i) => (
                      <div key={i}>{ag}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#183646]">
              <button
                onClick={() => setShowNewGroupModal(false)}
                className="px-4 py-2 rounded-xl bg-[#122a36] text-[#789cae] font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                className="px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs shadow"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: SHARE STUDY RESOURCE ================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#08151c] border border-[#1b3b4a] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-white">
            <h3 className="text-base font-bold text-white">Share Peer Study Resource</h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#789cae] mb-1 font-semibold">Course</label>
                  <select
                    value={newResCourse}
                    onChange={(e) => setNewResCourse(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] text-cyan-300 font-mono font-bold focus:outline-none"
                  >
                    <option value="CS101">CS101 - Distributed Systems</option>
                    <option value="AI301">AI301 - Edge AI Architecture</option>
                    <option value="MATH201">MATH201 - Vector Calculus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#789cae] mb-1 font-semibold">Resource Type</label>
                  <select
                    value={newResType}
                    onChange={(e) => setNewResType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] text-white focus:outline-none"
                  >
                    <option value="notes">Study Notes</option>
                    <option value="cheatsheet">Cheat Sheet</option>
                    <option value="code">Code / Shaders</option>
                    <option value="flashcards">Flashcards</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#789cae] mb-1 font-semibold">Title</label>
                <input
                  type="text"
                  value={newResTitle}
                  onChange={(e) => setNewResTitle(e.target.value)}
                  placeholder="e.g. Raft Consensus TLA+ State Proofs Cheat Sheet"
                  className="w-full px-3 py-2 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[#789cae] mb-1 font-semibold">Markdown Content / Notes</label>
                <textarea
                  rows={6}
                  value={newResContent}
                  onChange={(e) => setNewResContent(e.target.value)}
                  placeholder="# Enter your markdown notes, code snippets, or formulas..."
                  className="w-full p-3 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="button"
                onClick={handleScanNewResource}
                disabled={isScanningResource || !newResContent.trim()}
                className="w-full py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isScanningResource ? "Synthesizing Concepts..." : "AI Concept Scan & Summary"}</span>
              </button>

              {scannedSummary && (
                <div className="p-3 rounded-xl bg-[#0c1a24] border border-cyan-500/30 space-y-1">
                  <div className="text-[10px] font-mono text-cyan-300 font-bold">✨ AI Extracted Summary:</div>
                  <p className="text-[11px] text-gray-200">{scannedSummary}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#183646]">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl bg-[#122a36] text-[#789cae] font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handlePublishResource}
                className="px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs shadow"
              >
                Publish Resource
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: VIEW FULL NOTE / RESOURCE ================= */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#08151c] border border-[#1b3b4a] rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl text-white max-h-[85vh] flex flex-col justify-between">
            <div className="flex items-start justify-between border-b border-[#183646] pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-300 uppercase">
                  {selectedResource.courseCode} • {selectedResource.resourceType}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedResource.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedResource(null)}
                className="text-[#789cae] hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              <div className="p-4 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] font-mono text-gray-200 whitespace-pre-wrap leading-relaxed text-xs">
                {selectedResource.content}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#183646]">
              <button
                onClick={() => handleDownloadResourceMarkdown(selectedResource)}
                className="px-4 py-2 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] hover:border-cyan-400 text-cyan-300 font-bold text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Markdown (.md)</span>
              </button>

              <button
                onClick={() => setSelectedResource(null)}
                className="px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: AI-FACILITATED SOCRATIC STUDY ROOM ================= */}
      {activeAiGroup && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex items-center justify-center p-3 sm:p-5 animate-fade-in">
          <div className="bg-[#08151c] border border-cyan-500/40 rounded-3xl max-w-5xl w-full p-5 sm:p-6 space-y-4 shadow-2xl text-white max-h-[92vh] flex flex-col justify-between">
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#183646] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 text-[10px] font-mono font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    {activeAiGroup.courseCode} • {activeAiGroup.synergyScore}% Skill Synergy
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">
                    ★ {activeAiGroup.earnedGroupXp || 0} Squad XP
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    {activeAiGroup.socraticFacilitator.name} Active
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Bot className="w-5 h-5 text-cyan-400" />
                  <span>{activeAiGroup.title}</span>
                </h3>
              </div>

              {/* Navigation Tabs in Modal Header */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setAiRoomTab("workspace")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 whitespace-nowrap ${
                    aiRoomTab === "workspace"
                      ? "bg-cyan-500 text-slate-950 font-black shadow"
                      : "bg-[#0c1a24] text-[#789cae] border border-[#1b3b4a] hover:text-white"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Socratic Chat ({activeAiGroup.chatFeed.length})</span>
                </button>

                <button
                  onClick={() => setAiRoomTab("agenda")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 whitespace-nowrap ${
                    aiRoomTab === "agenda"
                      ? "bg-cyan-500 text-slate-950 font-black shadow"
                      : "bg-[#0c1a24] text-[#789cae] border border-[#1b3b4a] hover:text-white"
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>
                    Agenda ({activeAiGroup.agenda.filter((a) => a.isCompleted).length}/
                    {activeAiGroup.agenda.length})
                  </span>
                </button>

                <button
                  onClick={() => setAiRoomTab("synergy")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 whitespace-nowrap ${
                    aiRoomTab === "synergy"
                      ? "bg-cyan-500 text-slate-950 font-black shadow"
                      : "bg-[#0c1a24] text-[#789cae] border border-[#1b3b4a] hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Synergy Matrix</span>
                </button>

                <button
                  onClick={() => setAiRoomTab("whiteboard")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 whitespace-nowrap ${
                    aiRoomTab === "whiteboard"
                      ? "bg-cyan-500 text-slate-950 font-black shadow"
                      : "bg-[#0c1a24] text-[#789cae] border border-[#1b3b4a] hover:text-white"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Whiteboard</span>
                </button>

                <button
                  onClick={() => setActiveAiGroup(null)}
                  className="p-1.5 rounded-xl bg-[#0c1a24] text-[#789cae] hover:text-white border border-[#1b3b4a] ml-1"
                  title="Close Room"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* AI Facilitated Group Metadata & Suggested Times Bar */}
            <div className="bg-[#0c1f28] border border-[#183b4b] rounded-2xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                  <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="font-semibold">{activeAiGroup.nextMeetingTime}</span>
                </div>
                {activeAiGroup.sharedSkillInterests && activeAiGroup.sharedSkillInterests.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[10px] text-[#789cae] font-mono">Shared Focus:</span>
                    {activeAiGroup.sharedSkillInterests.map((skill, sIdx) => (
                      <span key={sIdx} className="px-2 py-0.5 rounded-lg bg-[#08151c] border border-[#1b3b4a] text-cyan-200 text-[10px] font-mono">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {activeAiGroup.suggestedMeetingTimes && activeAiGroup.suggestedMeetingTimes.length > 1 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#789cae] font-mono hidden sm:inline">Alternate Slots:</span>
                  <div className="flex items-center gap-1">
                    {activeAiGroup.suggestedMeetingTimes.slice(1).map((time, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded-lg bg-[#08151c] text-[#94b8cb] border border-[#183646] text-[10px] truncate max-w-[180px]" title={time}>
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Content Body */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              {/* ================= TAB 1: WORKSPACE & SOCRATIC CHAT ================= */}
              {aiRoomTab === "workspace" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Left Column: Socratic Facilitation Hub & Squad Roster */}
                  <div className="space-y-3 lg:col-span-1">
                    {/* Socratic Facilitator Card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-[#0c1a24] to-[#08151c] border border-cyan-500/40 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={activeAiGroup.socraticFacilitator.avatar}
                          alt={activeAiGroup.socraticFacilitator.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400 shadow-md shadow-cyan-500/20"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                            {activeAiGroup.socraticFacilitator.name}
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          </h4>
                          <span className="text-[10px] text-cyan-300/80 font-mono">
                            {activeAiGroup.socraticFacilitator.activeTopic}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#08151c]/90 border border-cyan-500/30 text-[11px] text-gray-200 italic leading-relaxed">
                        "{activeAiGroup.socraticFacilitator.currentInquiry}"
                      </div>

                      {/* Socratic Autonomous Trigger Buttons */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] uppercase tracking-wider text-[#789cae] font-mono font-bold block">
                          Socratic Interventions
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            disabled={isSocraticIntervening}
                            onClick={() => handleTriggerSocraticAction("pose_question")}
                            className="p-2 rounded-xl bg-[#08151c] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 font-bold text-[11px] text-left flex items-center gap-1.5 transition-all disabled:opacity-50"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>Inquiry</span>
                          </button>

                          <button
                            disabled={isSocraticIntervening}
                            onClick={() => handleTriggerSocraticAction("generate_challenge")}
                            className="p-2 rounded-xl bg-[#08151c] border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 font-bold text-[11px] text-left flex items-center gap-1.5 transition-all disabled:opacity-50"
                          >
                            <Target className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Challenge</span>
                          </button>

                          <button
                            disabled={isSocraticIntervening}
                            onClick={() => handleTriggerSocraticAction("synthesize_consensus")}
                            className="p-2 rounded-xl bg-[#08151c] border border-teal-500/30 hover:border-teal-400 text-teal-300 font-bold text-[11px] text-left flex items-center gap-1.5 transition-all disabled:opacity-50"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                            <span>Synthesize</span>
                          </button>

                          <button
                            disabled={isSocraticIntervening}
                            onClick={() => handleTriggerSocraticAction("award_xp")}
                            className="p-2 rounded-xl bg-[#08151c] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 font-bold text-[11px] text-left flex items-center gap-1.5 transition-all disabled:opacity-50"
                          >
                            <Award className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>Award XP</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Squad Member Complementary Roster */}
                    <div className="p-3.5 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-white">
                        <span>Squad Scholars ({activeAiGroup.members.length})</span>
                        <span className="text-[10px] font-mono text-cyan-400">
                          {activeAiGroup.synergyScore}% Synergy
                        </span>
                      </div>

                      <div className="space-y-2">
                        {activeAiGroup.members.map((m) => (
                          <div
                            key={m.id}
                            className="p-2.5 rounded-xl bg-[#08151c] border border-[#1b3b4a] space-y-1 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <img
                                  src={m.avatar}
                                  alt={m.name}
                                  className="w-7 h-7 rounded-full object-cover border border-cyan-400/40"
                                />
                                <div>
                                  <div className="font-bold text-white text-xs flex items-center gap-1">
                                    {m.name}
                                    {m.isCurrentUser && (
                                      <span className="text-[8px] bg-cyan-500/30 text-cyan-300 px-1 rounded">
                                        You
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-[#638799]">{m.role}</div>
                                </div>
                              </div>
                              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded">
                                {m.progressPct}% • {m.xp} XP
                              </span>
                            </div>
                            <div className="text-[10px] text-cyan-300/80 font-mono truncate">
                              ⚡ {m.primaryStrength}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Socratic Chat Feed & Input */}
                  <div className="lg:col-span-2 flex flex-col h-[520px] bg-[#0c1a24] rounded-2xl border border-[#1b3b4a] overflow-hidden">
                    {/* Chat Header */}
                    <div className="p-3 bg-[#08151c] border-b border-[#1b3b4a] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <Bot className="w-4 h-4 text-cyan-400" />
                        <span>Socratic Squad Discussion Stream</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#789cae]">
                        Synchronized with Socratic Engine
                      </span>
                    </div>

                    {/* Chat Messages Feed */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                      {activeAiGroup.chatFeed.map((msg) => {
                        const isAi = msg.senderType === "socratic_ai";
                        const isStudent = msg.senderType === "student";

                        return (
                          <div
                            key={msg.id}
                            className={`flex gap-2.5 ${isStudent ? "flex-row-reverse" : "flex-row"}`}
                          >
                            <img
                              src={msg.avatar}
                              alt={msg.sender}
                              className={`w-8 h-8 rounded-full object-cover shrink-0 border ${
                                isAi
                                  ? "border-cyan-400 shadow-md shadow-cyan-500/30"
                                  : "border-[#1b3b4a]"
                              }`}
                            />
                            <div
                              className={`max-w-[85%] space-y-1 ${
                                isStudent ? "items-end text-right" : "items-start text-left"
                              }`}
                            >
                              <div className="flex items-center gap-1.5 text-[10px] text-[#789cae]">
                                <span
                                  className={`font-bold ${isAi ? "text-cyan-300" : "text-white"}`}
                                >
                                  {msg.sender}
                                </span>
                                <span>•</span>
                                <span>{msg.time}</span>
                              </div>

                              <div
                                className={`p-3 rounded-2xl text-xs leading-relaxed ${
                                  isAi
                                    ? "bg-gradient-to-br from-cyan-950/60 to-[#08151c] border border-cyan-500/40 text-gray-100 shadow-lg"
                                    : isStudent
                                      ? "bg-cyan-500 text-slate-950 font-medium rounded-tr-none"
                                      : "bg-[#08151c] border border-[#1b3b4a] text-gray-200 rounded-tl-none"
                                }`}
                              >
                                <p className="whitespace-pre-wrap">{msg.text}</p>

                                {msg.socraticHint && (
                                  <div className="mt-2 pt-2 border-t border-cyan-500/30 text-[11px] text-cyan-300 flex items-start gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                                    <span>
                                      <strong>Socratic Hint:</strong> {msg.socraticHint}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {isSocraticIntervening && (
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-300 animate-pulse">
                          <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
                          <span>Petra is analyzing discussion and synthesizing a Socratic inquiry...</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Inquiry Triggers */}
                    <div className="px-3 py-2 bg-[#08151c] border-t border-[#183646] flex items-center gap-1.5 overflow-x-auto text-[10px]">
                      <span className="text-[#638799] font-mono shrink-0">Quick Prompts:</span>
                      <button
                        onClick={() => {
                          setAiSquadChatMessage("Can Petra clarify how leader heartbeats prevent election split votes?");
                        }}
                        className="px-2 py-1 rounded-lg bg-[#0c1a24] border border-[#1b3b4a] hover:border-cyan-400 text-gray-300 hover:text-white shrink-0"
                      >
                        Clarify Leader Heartbeats
                      </button>
                      <button
                        onClick={() => {
                          setAiSquadChatMessage("Let's derive the proof for quorum intersection invariance.");
                        }}
                        className="px-2 py-1 rounded-lg bg-[#0c1a24] border border-[#1b3b4a] hover:border-cyan-400 text-gray-300 hover:text-white shrink-0"
                      >
                        Derive Quorum Proof
                      </button>
                      <button
                        onClick={() => {
                          setAiSquadChatMessage("How should we divide the benchmark tests across our squad?");
                        }}
                        className="px-2 py-1 rounded-lg bg-[#0c1a24] border border-[#1b3b4a] hover:border-cyan-400 text-gray-300 hover:text-white shrink-0"
                      >
                        Divide Benchmark Tasks
                      </button>
                    </div>

                    {/* Message Input Bar */}
                    <div className="p-3 bg-[#08151c] border-t border-[#183646] flex items-center gap-2">
                      <input
                        type="text"
                        value={aiSquadChatMessage}
                        onChange={(e) => setAiSquadChatMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendAiSquadMessage();
                          }
                        }}
                        placeholder="Type response, question, or proof step for the squad and Petra..."
                        className="flex-1 bg-[#0c1a24] border border-[#1b3b4a] focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white placeholder-[#638799] outline-none"
                      />
                      <button
                        onClick={handleSendAiSquadMessage}
                        disabled={!aiSquadChatMessage.trim()}
                        className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all disabled:opacity-40"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 2: AUTONOMOUS SOCRATIC AGENDA ================= */}
              {aiRoomTab === "agenda" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-white flex items-center gap-2">
                          <Target className="w-4 h-4 text-cyan-400" />
                          <span>AI-Structured 60-Minute Socratic Study Agenda</span>
                        </h4>
                        <p className="text-xs text-[#789cae] mt-0.5">
                          Autonomous milestone phases managed by Petra. Check off milestones as
                          your squad solves them.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-xl border border-cyan-500/30">
                          {activeAiGroup.agenda.filter((a) => a.isCompleted).length} of{" "}
                          {activeAiGroup.agenda.length} Milestones Completed
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[#08151c] rounded-full overflow-hidden border border-[#1b3b4a]">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 transition-all duration-500"
                        style={{
                          width: `${
                            (activeAiGroup.agenda.filter((a) => a.isCompleted).length /
                              activeAiGroup.agenda.length) *
                            100
                          }%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Milestones Cards */}
                  <div className="space-y-3">
                    {activeAiGroup.agenda.map((milestone, idx) => (
                      <div
                        key={milestone.id}
                        className={`p-4 rounded-2xl border transition-all space-y-3 ${
                          milestone.isCompleted
                            ? "bg-emerald-950/20 border-emerald-500/40"
                            : "bg-[#0c1a24] border-[#1b3b4a] hover:border-cyan-500/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() =>
                                handleToggleAgendaMilestone(milestone.id)
                              }
                              className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                                milestone.isCompleted
                                  ? "bg-emerald-500 border-emerald-400 text-slate-950"
                                  : "border-[#1b3b4a] hover:border-cyan-400 text-transparent"
                              }`}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-[10px] text-cyan-400 font-bold">
                                  Phase {idx + 1} ({milestone.timeMinutes}m)
                                </span>
                                <h5
                                  className={`text-sm font-bold ${
                                    milestone.isCompleted
                                      ? "line-through text-[#789cae]"
                                      : "text-white"
                                  }`}
                                >
                                  {milestone.title}
                                </h5>
                              </div>
                              <p className="text-xs text-gray-300">{milestone.objective}</p>
                            </div>
                          </div>

                          <span
                            className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold shrink-0 ${
                              milestone.isCompleted
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                : "bg-cyan-950/60 text-cyan-300 border border-cyan-500/30"
                            }`}
                          >
                            {milestone.isCompleted ? "Completed" : "In Progress"}
                          </span>
                        </div>

                        {/* Socratic Inquiry for this Phase */}
                        <div className="p-3 rounded-xl bg-[#08151c] border border-cyan-500/20 space-y-1 text-xs">
                          <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 flex items-center gap-1">
                            <Bot className="w-3 h-3 text-cyan-400" />
                            Facilitator Socratic Inquiry:
                          </span>
                          <p className="text-gray-200 text-xs italic">
                            "{milestone.socraticInquiry}"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= TAB 3: SYNERGY MATRIX ================= */}
              {aiRoomTab === "synergy" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-2">
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>Pairwise Skill Complementarity & Synergy Matrix</span>
                    </h4>
                    <p className="text-xs text-[#789cae]">
                      Petra's matchmaking engine paired members whose individual strengths directly
                      fill the growth areas of their peers, achieving an aggregate {activeAiGroup.synergyScore}% synergy index.
                    </p>
                  </div>

                  {/* Pairwise Synergy Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeAiGroup.synergyRelations.map((rel, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#0c1a24] border border-cyan-500/30 space-y-3"
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-white">
                          <span className="text-cyan-300 flex items-center gap-1">
                            <span>{rel.mentorName}</span>
                            <span className="text-gray-400">➔</span>
                            <span>{rel.learnerName}</span>
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                            {rel.domain}
                          </span>
                        </div>

                        <p className="text-xs text-gray-200 leading-relaxed bg-[#08151c] p-3 rounded-xl border border-[#1b3b4a]">
                          {rel.synergyDetail}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Complete Roster Deep Breakdown */}
                  <div className="p-4 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] space-y-3">
                    <h5 className="font-bold text-xs text-white">
                      Scholar Growth & Mastery Breakdown
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeAiGroup.members.map((m) => (
                        <div
                          key={m.id}
                          className="p-3 rounded-xl bg-[#08151c] border border-[#1b3b4a] space-y-2 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={m.avatar}
                              alt={m.name}
                              className="w-8 h-8 rounded-full object-cover border border-cyan-400/50"
                            />
                            <div>
                              <div className="font-bold text-white text-xs">{m.name}</div>
                              <div className="text-[10px] text-[#789cae]">{m.studyHabit}</div>
                            </div>
                          </div>

                          <div className="space-y-1 text-[11px]">
                            <div className="text-emerald-300">
                              <strong>Primary Strength:</strong> {m.primaryStrength}
                            </div>
                            <div className="text-cyan-300">
                              <strong>Growth Focus:</strong> {m.growthArea}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 4: SHARED WHITEBOARD ================= */}
              {aiRoomTab === "whiteboard" && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#0c1a24] border border-[#1b3b4a] flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-cyan-400" />
                        <span>Squad Collaborative Scratchpad & Proofs</span>
                      </h4>
                      <p className="text-xs text-[#789cae]">
                        Synchronized markdown whiteboard for derivations, TLA+ invariants, and code sketches.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(activeAiGroup.whiteboardNotes);
                        alert("Whiteboard notes copied to clipboard!");
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#08151c] border border-cyan-500/40 text-cyan-300 font-bold text-xs hover:border-cyan-400 flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Notes</span>
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#08151c] border border-[#1b3b4a] font-mono text-gray-200 whitespace-pre-wrap leading-relaxed text-xs">
                    {activeAiGroup.whiteboardNotes}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#183646]">
              <div className="flex items-center gap-2">
                {activeAiGroup.collabLink && (
                  <a
                    href={activeAiGroup.collabLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg"
                  >
                    <Video className="w-4 h-4" />
                    <span>Launch Live Video Room (Jitsi)</span>
                  </a>
                )}

                {activeAiGroup.collabLink && (
                  <button
                    onClick={() => handleCopyCollabLink(activeAiGroup.collabLink!)}
                    className="p-2.5 rounded-xl bg-[#0c1a24] border border-[#1b3b4a] hover:border-cyan-400 text-cyan-300 transition-all"
                    title="Copy Meeting Link"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveAiGroup(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#122a36] hover:bg-[#183646] text-[#789cae] hover:text-white font-bold text-xs transition-all"
                >
                  Minimize Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: AI-FACILITATED STUDY GROUP PAIRING ================= */}
      {showAiPairingModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#08151c] border border-cyan-500/40 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl text-white max-h-[90vh] flex flex-col justify-between overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#183646] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-[10px] font-mono font-bold flex items-center gap-1">
                    <Bot className="w-3 h-3 text-cyan-400" />
                    AI Socratic Squad Engine
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono">
                    Progress & Skill Synergy
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-1">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>AI-Facilitated Study Group Pairing</span>
                </h3>
                <p className="text-xs text-[#94b8cb] leading-relaxed">
                  Pairs students based on course completion percentage and shared skill interests, automatically synthesizing consensus meeting schedules.
                </p>
              </div>
              <button
                onClick={() => setShowAiPairingModal(false)}
                className="text-[#789cae] hover:text-white p-1 rounded-lg hover:bg-[#0c1f28] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Form Body */}
            <div className="space-y-4 text-xs">
              {/* Target Course & Milestone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-[#94b8cb] flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Target Academic Course</span>
                  </label>
                  <select
                    value={aiPairCourse}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAiPairCourse(val);
                      if (val === "CS101") {
                        setAiPairMilestone("Module 3: Quorum Invariance & Fault Recovery");
                      } else if (val === "AI301") {
                        setAiPairMilestone("Module 4: WebGPU Quantized Attention Kernels");
                      } else if (val === "MATH201") {
                        setAiPairMilestone("Module 2: Multilinear Forms & Curvature");
                      }
                    }}
                    className="w-full bg-[#0c1f28] border border-[#183b4b] rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 text-xs"
                  >
                    <option value="CS101">CS101 • Distributed Systems & Architectures</option>
                    <option value="AI301">AI301 • Edge AI Architecture & WebGPU</option>
                    <option value="MATH201">MATH201 • Vector Calculus & Differential Forms</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-[#94b8cb] flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Target Milestone</span>
                  </label>
                  <input
                    type="text"
                    value={aiPairMilestone}
                    onChange={(e) => setAiPairMilestone(e.target.value)}
                    placeholder="e.g. Module 3: Quorum Invariance"
                    className="w-full bg-[#0c1f28] border border-[#183b4b] rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 text-xs placeholder-[#638799]"
                  />
                </div>
              </div>

              {/* Course Completion Percentage Slider */}
              <div className="p-4 rounded-2xl bg-[#0c1f28] border border-[#183b4b] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-white flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Your Course Completion Percentage</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={aiPairProgress}
                      onChange={(e) => setAiPairProgress(Math.max(0, Math.min(100, Number(e.target.value))))}
                      className="w-14 text-center bg-[#08151c] border border-cyan-500/40 rounded-lg px-1.5 py-0.5 text-cyan-300 font-mono font-bold text-xs outline-none"
                    />
                    <span className="text-cyan-400 font-mono font-bold">%</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={100}
                  value={aiPairProgress}
                  onChange={(e) => setAiPairProgress(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-[#122a36] rounded-lg"
                />

                <div className="flex items-center justify-between text-[10px] text-[#789cae] font-mono">
                  <span>0% Beginner</span>
                  <span className="text-emerald-300 font-medium">Pairs with peers within ±8% - 12% for synchronized pace</span>
                  <span>100% Mastery</span>
                </div>
              </div>

              {/* Shared Skill Interests */}
              <div className="p-4 rounded-2xl bg-[#0c1f28] border border-[#183b4b] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-white flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Shared Skill Interests & Specializations</span>
                  </label>
                  <span className="text-[10px] text-[#789cae] font-mono">{aiPairSkills.length} active tags</span>
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    "Distributed Consensus",
                    "Formal Verification",
                    "WGSL Shaders",
                    "PyTorch MoE",
                    "Kernel Optimization",
                    "Matrix Calculus",
                    "Vector RAG",
                    "Raft Invariants"
                  ].map((preset) => {
                    const isSelected = aiPairSkills.includes(preset);
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setAiPairSkills(aiPairSkills.filter((s) => s !== preset));
                          } else {
                            setAiPairSkills([...aiPairSkills, preset]);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all flex items-center gap-1 ${
                          isSelected
                            ? "bg-cyan-500/20 border border-cyan-400 text-cyan-200 font-bold"
                            : "bg-[#08151c] border border-[#183646] text-[#789cae] hover:text-white"
                        }`}
                      >
                        {isSelected ? <Check className="w-3 h-3 text-cyan-400" /> : <Plus className="w-3 h-3" />}
                        <span>{preset}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Skill Tag */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={aiPairCustomSkill}
                    onChange={(e) => setAiPairCustomSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && aiPairCustomSkill.trim()) {
                        e.preventDefault();
                        if (!aiPairSkills.includes(aiPairCustomSkill.trim())) {
                          setAiPairSkills([...aiPairSkills, aiPairCustomSkill.trim()]);
                        }
                        setAiPairCustomSkill("");
                      }
                    }}
                    placeholder="Add custom skill interest (e.g. Jepsen Analysis)..."
                    className="flex-1 bg-[#08151c] border border-[#183646] focus:border-cyan-400 rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#638799] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (aiPairCustomSkill.trim() && !aiPairSkills.includes(aiPairCustomSkill.trim())) {
                        setAiPairSkills([...aiPairSkills, aiPairCustomSkill.trim()]);
                        setAiPairCustomSkill("");
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#122a36] hover:bg-[#183646] text-cyan-300 font-bold text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Group Size & Consensus Meeting Schedule Notice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-[#94b8cb] flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Desired Squad Size</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[3, 4, 5, 6].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setAiPairGroupSize(size)}
                        className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          aiPairGroupSize === size
                            ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow font-black"
                            : "bg-[#0c1f28] border-[#183b4b] text-[#789cae] hover:text-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#0c1f28] border border-[#183b4b] space-y-1 text-[11px]">
                  <div className="font-bold text-cyan-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Auto Suggested Meeting Times</span>
                  </div>
                  <p className="text-[#94b8cb] text-[10px] leading-tight">
                    The engine computes timezone overlap across candidate peers and suggests 3 optimal consensus times upon squad generation.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#183646]">
              <button
                type="button"
                onClick={() => setShowAiPairingModal(false)}
                className="px-4 py-2 rounded-xl bg-[#0c1f28] hover:bg-[#122a36] text-[#789cae] hover:text-white font-semibold text-xs transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isPairingAiGroup}
                onClick={handleTriggerAiPairing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {isPairingAiGroup ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                    <span>Synthesizing Socratic Squad...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4 text-slate-950" />
                    <span>Synthesize AI Socratic Squad</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: STUDY GROUP DETAILS ================= */}
      {activeGroup && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#08151c] border border-[#1b3b4a] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-white max-h-[85vh] flex flex-col justify-between">
            <div className="flex items-start justify-between border-b border-[#183646] pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase">
                  {activeGroup.courseCode} Study Group
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {activeGroup.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveGroup(null)}
                className="text-[#789cae] hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              <p className="text-gray-300 leading-relaxed">{activeGroup.description}</p>

              {/* Roster */}
              <div className="space-y-2">
                <h4 className="font-bold text-cyan-300 text-xs">
                  Active Scholars ({activeGroup.members.length}/{activeGroup.maxMembers})
                </h4>
                <div className="space-y-1.5">
                  {activeGroup.members.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-[#0c1a24] border border-[#1b3b4a]"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold text-white text-xs">{m.name}</div>
                          <div className="text-[10px] text-[#789cae]">{m.role}</div>
                        </div>
                      </div>
                      {m.xp && (
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded">
                          {m.xp} XP
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Agenda */}
              {activeGroup.agendaMilestones && (
                <div className="space-y-1.5 p-3 rounded-xl bg-[#0c1a24] border border-cyan-500/30">
                  <h4 className="font-bold text-cyan-300 text-xs flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Structured Session Agenda
                  </h4>
                  <div className="space-y-1 text-[11px] text-gray-300">
                    {activeGroup.agendaMilestones.map((ms, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                        <span>{ms}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#183646]">
              {activeGroup.collabLink ? (
                <a
                  href={activeGroup.collabLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Live Meeting</span>
                </a>
              ) : (
                <button
                  onClick={() => toggleJoinGroup(activeGroup.id)}
                  className="px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs"
                >
                  {activeGroup.isJoined ? "Leave Group" : "Join Group"}
                </button>
              )}

              <button
                onClick={() => setActiveGroup(null)}
                className="px-4 py-2 rounded-xl bg-[#122a36] text-[#789cae] font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
