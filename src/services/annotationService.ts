import { SafeLocalStorage } from './offlineStorage';

export interface ParagraphAnnotation {
  id: string;
  courseId: string;
  moduleId: string;
  lessonId: string;
  paragraphIndex: number;
  paragraphSnippet: string;
  roomId: string;
  roomName: string;
  authorId: string;
  authorName: string;
  authorRole: 'student' | 'teacher' | 'ta' | 'mentor' | 'ai_assistant';
  authorAvatar?: string;
  content: string;
  category: 'insight' | 'question' | 'citation' | 'difficulty' | 'exam_hint' | 'summary';
  highlightColor: 'cyan' | 'cyan' | 'cyan' | 'cyan' | 'cyan';
  createdAt: string;
  likes: number;
  likedBy: string[];
  replies: AnnotationReply[];
  isResolved?: boolean;
}

export interface AnnotationReply {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'student' | 'teacher' | 'ta' | 'mentor' | 'ai_assistant';
  content: string;
  createdAt: string;
  likes: number;
}

export interface VirtualStudyRoom {
  id: string;
  name: string;
  topic: string;
  activePeerCount: number;
  avatarList: string[];
  isPrivate?: boolean;
}

const STORAGE_KEY = 'zalamati_shared_annotations_v1';
const ACTIVE_ROOM_KEY = 'zalamati_active_study_room_v1';

export const DEFAULT_STUDY_ROOMS: VirtualStudyRoom[] = [
  {
    id: 'room-global',
    name: '🌐 Global Scholar Concourse',
    topic: 'Open Academic Forum for All Enrolled Scholars',
    activePeerCount: 42,
    avatarList: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop'],
  },
  {
    id: 'room-ai-swarms',
    name: '🤖 Multi-Agent & Swarm Cohort',
    topic: 'Sheaf-ADMM, Antigravity Runtimes & Autonomous Systems',
    activePeerCount: 18,
    avatarList: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop'],
  },
  {
    id: 'room-zk-crypto',
    name: '🔐 ZK-SNARKs & Quantum Defense Lab',
    topic: 'Post-Quantum Protocols, PLONK & Cryptographic Verifiers',
    activePeerCount: 12,
    avatarList: ['https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=60&auto=format&fit=crop'],
  },
  {
    id: 'room-bio-health',
    name: '🧬 Genomic & Neural Computing Pod',
    topic: 'CRISPR Data Science & Spiking Neuromorphic Networks',
    activePeerCount: 9,
    avatarList: ['https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&auto=format&fit=crop'],
  },
  {
    id: 'room-cloud-infra',
    name: '⚡ Distributed Cloud & Kubernetes Group',
    topic: 'High-Throughput Distributed Systems & Resilient SRE',
    activePeerCount: 15,
    avatarList: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&auto=format&fit=crop'],
  },
];

export class AnnotationService {
  private static getStoredAnnotations(): ParagraphAnnotation[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('[AnnotationService] Failed to read annotations from localStorage:', e);
    }
    return this.getSeedAnnotations();
  }

  private static saveStoredAnnotations(annotations: ParagraphAnnotation[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
      window.dispatchEvent(new CustomEvent('ANNOTATIONS_UPDATED', { detail: { count: annotations.length } }));
    } catch (e) {
      console.warn('[AnnotationService] Failed to save annotations:', e);
    }
  }

  private static getSeedAnnotations(): ParagraphAnnotation[] {
    const seed: ParagraphAnnotation[] = [
      {
        id: 'ann-seed-1',
        courseId: 'course-zk-snarks',
        moduleId: 'm1',
        lessonId: 'l1',
        paragraphIndex: 0,
        paragraphSnippet: 'Zero-Knowledge Proofs allow one party (the prover) to prove to another party (the verifier) that a statement is true...',
        roomId: 'room-global',
        roomName: '🌐 Global Scholar Concourse',
        authorId: 'usr-student-02',
        authorName: 'Elena Rostova',
        authorRole: 'student',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop',
        content: 'Crucial concept: The prover reveals ZERO knowledge about the secret witness itself, only that the mathematical evaluation holds!',
        category: 'insight',
        highlightColor: 'cyan',
        createdAt: '2 hours ago',
        likes: 7,
        likedBy: ['usr-student-01'],
        replies: [
          {
            id: 'rep-1',
            authorId: 'usr-ta-01',
            authorName: 'Dr. Tariq Al-Mansoor',
            authorRole: 'ta',
            content: 'Spot on Elena. Remember that soundness guarantees a cheating prover cannot convince an honest verifier with non-negligible probability.',
            createdAt: '1 hour ago',
            likes: 4,
          }
        ],
        isResolved: false
      },
      {
        id: 'ann-seed-2',
        courseId: 'course-zk-snarks',
        moduleId: 'm1',
        lessonId: 'l1',
        paragraphIndex: 1,
        paragraphSnippet: 'The three foundational properties required for any verifiable zero-knowledge system are Completeness, Soundness, and Zero-Knowledge...',
        roomId: 'room-zk-crypto',
        roomName: '🔐 ZK-SNARKs & Quantum Defense Lab',
        authorId: 'usr-student-03',
        authorName: 'Kareem Zahran',
        authorRole: 'student',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop',
        content: 'Will this be tested on the Midterm Capstone Evaluation? Any practical examples of non-interactive transformations (Fiat-Shamir)?',
        category: 'exam_hint',
        highlightColor: 'cyan',
        createdAt: '4 hours ago',
        likes: 5,
        likedBy: [],
        replies: [
          {
            id: 'rep-2',
            authorId: 'usr-ai-01',
            authorName: 'Petra Socratic Hostess',
            authorRole: 'ai_assistant',
            content: 'Yes Kareem! The Fiat-Shamir heuristic converts interactive sigma protocols into non-interactive proofs using cryptographic hash functions as random oracles.',
            createdAt: '3 hours ago',
            likes: 6,
          }
        ],
        isResolved: true
      },
      {
        id: 'ann-seed-3',
        courseId: 'course-bio-informatics',
        moduleId: 'm1',
        lessonId: 'l1',
        paragraphIndex: 0,
        paragraphSnippet: 'Next-Generation Sequencing (NGS) produces millions of short nucleotide fragments that require rapid algorithmic alignment...',
        roomId: 'room-global',
        roomName: '🌐 Global Scholar Concourse',
        authorId: 'usr-student-04',
        authorName: 'Dr. Maya Lin',
        authorRole: 'mentor',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&auto=format&fit=crop',
        content: 'Tip: For large genome indexing, Burrows-Wheeler Transform (BWT) combined with FM-index gives O(m) exact string matching in sub-gigabyte memory!',
        category: 'citation',
        highlightColor: 'cyan',
        createdAt: 'Yesterday',
        likes: 12,
        likedBy: ['usr-student-01'],
        replies: [],
        isResolved: false
      }
    ];
    return seed;
  }

  static getActiveRoomId(): string {
    try {
      return localStorage.getItem(ACTIVE_ROOM_KEY) || 'room-global';
    } catch {
      return 'room-global';
    }
  }

  static setActiveRoomId(roomId: string): void {
    try {
      localStorage.setItem(ACTIVE_ROOM_KEY, roomId);
      window.dispatchEvent(new CustomEvent('STUDY_ROOM_CHANGED', { detail: { roomId } }));
    } catch (e) {
      console.warn('[AnnotationService] Failed to set active room:', e);
    }
  }

  static getAnnotationsForLesson(courseId: string, lessonId: string, roomId?: string): ParagraphAnnotation[] {
    const all = this.getStoredAnnotations();
    const effectiveRoomId = roomId || this.getActiveRoomId();
    return all.filter((a) => {
      const matchLesson = (a.courseId === courseId || !a.courseId) && (a.lessonId === lessonId || !a.lessonId);
      const matchRoom = effectiveRoomId === 'all' || a.roomId === effectiveRoomId || a.roomId === 'room-global';
      return matchLesson && matchRoom;
    });
  }

  static getAnnotationsForParagraph(courseId: string, lessonId: string, paragraphIndex: number, roomId?: string): ParagraphAnnotation[] {
    const lessonNotes = this.getAnnotationsForLesson(courseId, lessonId, roomId);
    return lessonNotes.filter((a) => a.paragraphIndex === paragraphIndex);
  }

  static addAnnotation(annotation: Omit<ParagraphAnnotation, 'id' | 'createdAt' | 'likes' | 'likedBy' | 'replies'>): ParagraphAnnotation {
    const all = this.getStoredAnnotations();
    const newAnnotation: ParagraphAnnotation = {
      ...annotation,
      id: `ann-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: 'Just now',
      likes: 0,
      likedBy: [],
      replies: [],
      isResolved: false,
    };
    all.unshift(newAnnotation);
    this.saveStoredAnnotations(all);
    return newAnnotation;
  }

  static addReply(annotationId: string, reply: Omit<AnnotationReply, 'id' | 'createdAt' | 'likes'>): AnnotationReply | null {
    const all = this.getStoredAnnotations();
    const target = all.find((a) => a.id === annotationId);
    if (!target) return null;

    const newReply: AnnotationReply = {
      ...reply,
      id: `rep-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: 'Just now',
      likes: 0,
    };
    target.replies.push(newReply);
    this.saveStoredAnnotations(all);
    return newReply;
  }

  static toggleLike(annotationId: string, userId: string): boolean {
    const all = this.getStoredAnnotations();
    const target = all.find((a) => a.id === annotationId);
    if (!target) return false;

    const alreadyLiked = target.likedBy.includes(userId);
    if (alreadyLiked) {
      target.likedBy = target.likedBy.filter((id) => id !== userId);
      target.likes = Math.max(0, target.likes - 1);
    } else {
      target.likedBy.push(userId);
      target.likes += 1;
    }
    this.saveStoredAnnotations(all);
    return !alreadyLiked;
  }

  static toggleResolve(annotationId: string): boolean {
    const all = this.getStoredAnnotations();
    const target = all.find((a) => a.id === annotationId);
    if (!target) return false;

    target.isResolved = !target.isResolved;
    this.saveStoredAnnotations(all);
    return target.isResolved;
  }

  static deleteAnnotation(annotationId: string, userId: string): boolean {
    const all = this.getStoredAnnotations();
    const targetIndex = all.findIndex((a) => a.id === annotationId);
    if (targetIndex === -1) return false;
    
    // Only author or TA/admin can delete
    const target = all[targetIndex];
    if (target.authorId !== userId && target.authorRole !== 'teacher' && target.authorRole !== 'ta') {
      return false;
    }

    all.splice(targetIndex, 1);
    this.saveStoredAnnotations(all);
    return true;
  }

  static exportStudyNotesMarkdown(courseTitle: string, lessonTitle: string, roomId?: string): string {
    const annotations = this.getStoredAnnotations();
    const filtered = roomId ? annotations.filter((a) => a.roomId === roomId || a.roomId === 'room-global') : annotations;
    
    let md = `# Collaborative Study Notes & Annotations\n`;
    md += `**Course**: ${courseTitle}\n`;
    md += `**Lesson**: ${lessonTitle}\n`;
    md += `**Generated**: ${new Date().toLocaleString()}\n\n`;
    md += `---\n\n`;

    if (filtered.length === 0) {
      md += `*No annotations recorded for this study room yet.*\n`;
      return md;
    }

    filtered.forEach((ann, idx) => {
      md += `### ${idx + 1}. [Paragraph ${ann.paragraphIndex + 1}] - ${ann.category.toUpperCase()} (${ann.roomName})\n`;
      md += `> **Referenced Text**: "${ann.paragraphSnippet}"\n\n`;
      md += `**${ann.authorName}** (${ann.authorRole.toUpperCase()}): ${ann.content}\n\n`;
      if (ann.replies.length > 0) {
        md += `**Peer Responses**:\n`;
        ann.replies.forEach((rep) => {
          md += `- **${rep.authorName}**: ${rep.content} *(likes: ${rep.likes})*\n`;
        });
        md += `\n`;
      }
      md += `---\n\n`;
    });

    return md;
  }
}
