# SPEC-KIT: 02-BOOKMARKS-AND-NOTES-SYSTEM

## 1. Feature Overview
The **Lesson Bookmarking & Quick Note Capture** system provides students with instantaneous knowledge-capture tools. Learners can bookmark precise modules during active reading, dictate voiced notes via speech-to-text, or draft text reflections, with full local persistence.

---

## 2. Problem Statement & Target Persona
During intense socratic dialogue, students frequently encounter complex structural mechanisms, equations, or insights. Forcing users to leave the viewer to draft annotations ruins engagement. An context-aware overlay allows fast logging without breaking focus.

---

## 3. Object-Oriented Technical Architecture

### 3.1 Class & Component Interface Blueprint

```typescript
interface ILessonNote {
  id: string;
  courseId: string;
  moduleId: string;
  lessonId: string;
  noteText: string;
  timestamp: number;
  isVoiceTranscribed: boolean;
}

interface IBookmark {
  id: string;
  courseId: string;
  moduleId: string;
  lessonId: string;
  timestamp: number;
}

class BookmarkNotesManager {
  private notesKey = "lmdpro_lesson_notes";
  private bookmarksKey = "lmdpro_lesson_bookmarks";

  public saveNote(note: Omit<ILessonNote, "id" | "timestamp">): ILessonNote {
    const newNote: ILessonNote = {
      ...note,
      id: `note-${Date.now()}`,
      timestamp: Date.now()
    };
    const current = this.getAllNotes();
    current.push(newNote);
    localStorage.setItem(this.notesKey, JSON.stringify(current));
    return newNote;
  }

  public getAllNotes(): ILessonNote[] {
    const raw = localStorage.getItem(this.notesKey);
    return raw ? JSON.parse(raw) : [];
  }

  public addBookmark(bookmark: Omit<IBookmark, "id" | "timestamp">): IBookmark {
    const newBookmark: IBookmark = {
      ...bookmark,
      id: `bookmark-${Date.now()}`,
      timestamp: Date.now()
    };
    const current = this.getAllBookmarks();
    current.push(newBookmark);
    localStorage.setItem(this.bookmarksKey, JSON.stringify(current));
    return newBookmark;
  }

  public getAllBookmarks(): IBookmark[] {
    const raw = localStorage.getItem(this.bookmarksKey);
    return raw ? JSON.parse(raw) : [];
  }
}
```

### 3.2 Component Manifest
- **`MyBookmarksTab.tsx`**: Centralizes search, filtering, and review controls for bookmarked items.
- **`QuickNoteCaptureModal.tsx` / `QuickNotesOverlay.tsx`**: Dialog window triggering voice recording or quick-text logs.
- **Floating Action Button (FAB)**: Glassmorphic interactive action circle embedded inside the active layout.

---

## 4. User Stories & Acceptance Criteria

### User Story 1: Floating Contextual Capture
> **As an** active student exploring 3D mechanical models,  
> **I want to** click a single floating action button to capture my thoughts,  
> **So that** I don't lose my learning momentum.

- **Acceptance Criterion 1.1**: The FAB must float at the bottom right corner of the layout, with a clean visual transition when scrolling.
- **Acceptance Criterion 1.2**: Triggering the capture must automatically pre-populate the current `courseId`, `moduleId`, and `lessonId` attributes.
- **Acceptance Criterion 1.3**: The input modal must support text input or voice recording via the Web Speech API.

### User Story 2: Review and Navigation
> **As an** executive student preparing for a certified exam,  
> **I want to** filter my bookmarks and direct-link back to the active course,  
> **So that** I can review the core concept in its original visual workspace.

- **Acceptance Criterion 2.1**: Clicking a saved note or bookmark inside `MyBookmarksTab` must invoke the `onOpenLesson` callback to route the parent context back to that course viewer.
- **Acceptance Criterion 2.2**: Note lists must support quick text copy-to-clipboard and deletion commands.

---

## 5. Automated Verification & QA
- **Persistence Verification**: Assert that saving a note correctly populates the Local Storage key without mutating previous records.
- **Speech Synthesis Fallback**: If browser microphone permissions are denied, gracefully fallback to text input and alert the user without crashing.
