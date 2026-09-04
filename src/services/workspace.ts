import { getAccessToken } from './firebase';

export interface WorkspaceFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  modifiedTime?: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  htmlLink?: string;
}

export interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  subject?: string;
  from?: string;
  date?: string;
}

export interface ClassroomCourse {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  alternateLink?: string;
}

export interface WorkspaceTask {
  id: string;
  title: string;
  notes?: string;
  due?: string;
  status: string;
}

class WorkspaceService {
  private async fetchGoogleApi(endpoint: string, options: RequestInit = {}) {
    const token = getAccessToken();
    if (!token) throw new Error('No access token available. Please sign in.');

    const response = await fetch(`https://www.googleapis.com/${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown API error' } }));
      throw new Error(error.error?.message || `API error: ${response.status}`);
    }

    return response.json();
  }

  // Drive & Sheets & Docs & Slides & Forms
  async getRecentFiles(limit = 10): Promise<WorkspaceFile[]> {
    const data = await this.fetchGoogleApi(`drive/v3/files?pageSize=${limit}&fields=files(id,name,mimeType,webViewLink,modifiedTime)&orderBy=modifiedTime desc`);
    return data.files || [];
  }

  // Calendar
  async getUpcomingEvents(limit = 10): Promise<CalendarEvent[]> {
    const now = new Date().toISOString();
    const data = await this.fetchGoogleApi(`calendar/v3/calendars/primary/events?timeMin=${now}&maxResults=${limit}&singleEvents=true&orderBy=startTime`);
    return data.items || [];
  }

  // Gmail
  async getRecentEmails(limit = 5): Promise<GmailMessage[]> {
    const listData = await this.fetchGoogleApi(`gmail/v1/users/me/messages?maxResults=${limit}`);
    const messages = listData.messages || [];
    
    const detailedMessages = await Promise.all(
      messages.map(async (msg: { id: string }) => {
        const detail = await this.fetchGoogleApi(`gmail/v1/users/me/messages/${msg.id}`);
        const subject = detail.payload.headers.find((h: any) => h.name === 'Subject')?.value;
        const from = detail.payload.headers.find((h: any) => h.name === 'From')?.value;
        const date = detail.payload.headers.find((h: any) => h.name === 'Date')?.value;
        return {
          id: detail.id,
          threadId: detail.threadId,
          snippet: detail.snippet,
          subject,
          from,
          date
        };
      })
    );

    return detailedMessages;
  }

  // Classroom
  async getCourses(): Promise<ClassroomCourse[]> {
    const data = await this.fetchGoogleApi('classroom/v1/courses?courseStates=ACTIVE');
    return data.courses || [];
  }

  // Tasks
  async getTasks(limit = 10): Promise<WorkspaceTask[]> {
    const listsData = await this.fetchGoogleApi('tasks/v1/users/@me/lists');
    const primaryList = listsData.items?.[0];
    if (!primaryList) return [];

    const tasksData = await this.fetchGoogleApi(`tasks/v1/lists/${primaryList.id}/tasks?maxResults=${limit}`);
    return tasksData.items || [];
  }

  // Chat (Readonly)
  async getChatSpaces(): Promise<any[]> {
    const data = await this.fetchGoogleApi('chat/v1/spaces');
    return data.spaces || [];
  }
}

export const workspaceService = new WorkspaceService();
