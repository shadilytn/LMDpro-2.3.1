/**
 * Lesson Bookmarking Service
 * Enables students to bookmark specific lessons and topics in CourseViewer,
 * with real-time reactive event synchronization and persistent storage.
 */

export interface LessonBookmark {
  id: string;
  courseId: string;
  courseTitle: string;
  moduleId: string;
  moduleTitle: string;
  lessonId: string;
  lessonTitle: string;
  category?: string;
  topicSummary?: string;
  keyTakeaways?: string[];
  bookmarkedAt: number;
  tags?: string[];
  notes?: string;
}

const STORAGE_KEY = "lmdpro_lesson_bookmarks";
const EVENT_NAME = "LMDPRO_BOOKMARKS_CHANGED";

class BookmarkService {
  private listeners: Set<(bookmarks: LessonBookmark[]) => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("storage", (e) => {
        if (e.key === STORAGE_KEY) {
          this.notifyListeners();
        }
      });
    }
  }

  public getBookmarks(): LessonBookmark[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("Failed to parse bookmarks from storage:", err);
      return [];
    }
  }

  public isBookmarked(courseId: string, lessonId: string): boolean {
    const bookmarks = this.getBookmarks();
    return bookmarks.some((b) => b.courseId === courseId && b.lessonId === lessonId);
  }

  public toggleBookmark(item: {
    courseId: string;
    courseTitle: string;
    moduleId: string;
    moduleTitle: string;
    lessonId: string;
    lessonTitle: string;
    category?: string;
    topicSummary?: string;
    keyTakeaways?: string[];
    tags?: string[];
    notes?: string;
  }): boolean {
    const bookmarks = this.getBookmarks();
    const existingIndex = bookmarks.findIndex(
      (b) => b.courseId === item.courseId && b.lessonId === item.lessonId
    );

    let isNowBookmarked = false;
    if (existingIndex >= 0) {
      bookmarks.splice(existingIndex, 1);
      isNowBookmarked = false;
    } else {
      const newBookmark: LessonBookmark = {
        id: `${item.courseId}_${item.lessonId}`,
        ...item,
        bookmarkedAt: Date.now(),
      };
      bookmarks.unshift(newBookmark);
      isNowBookmarked = true;
    }

    this.saveBookmarks(bookmarks);
    return isNowBookmarked;
  }

  public removeBookmark(courseId: string, lessonId: string): void {
    const bookmarks = this.getBookmarks().filter(
      (b) => !(b.courseId === courseId && b.lessonId === lessonId)
    );
    this.saveBookmarks(bookmarks);
  }

  public removeBookmarkById(id: string): void {
    const bookmarks = this.getBookmarks().filter((b) => b.id !== id);
    this.saveBookmarks(bookmarks);
  }

  public updateBookmarkNotes(id: string, notes: string): void {
    const bookmarks = this.getBookmarks().map((b) =>
      b.id === id ? { ...b, notes } : b
    );
    this.saveBookmarks(bookmarks);
  }

  public subscribe(listener: (bookmarks: LessonBookmark[]) => void): () => void {
    this.listeners.add(listener);
    // Initial emission
    listener(this.getBookmarks());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private saveBookmarks(bookmarks: LessonBookmark[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
      this.notifyListeners();
    } catch (err) {
      console.error("Failed to save bookmarks:", err);
    }
  }

  private notifyListeners(): void {
    const bookmarks = this.getBookmarks();
    this.listeners.forEach((fn) => fn(bookmarks));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: bookmarks }));
    }
  }
}

export const bookmarkService = new BookmarkService();
