export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  modifiedTime?: string;
}

export interface GoogleTask {
  id: string;
  title: string;
  notes?: string;
  status: string;
  due?: string;
}

export interface GoogleForm {
  formId: string;
  info: {
    title: string;
    description?: string;
  };
  responderUri?: string;
}

export interface GoogleChatMessage {
  name: string;
  text?: string;
  createTime?: string;
  sender?: {
    displayName?: string;
  };
}

export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  htmlLink?: string;
  colorId?: string;
}

export class WorkspaceService {
  // Helper to fetch through server-side workspace-proxy to avoid CORS and sandbox blocks
  static async proxyFetch(url: string, options: any = {}): Promise<Response> {
    try {
      const { method = 'GET', headers = {}, body } = options;
      
      if (body && body instanceof FormData) {
        return fetch(url, options);
      }

      const res = await fetch('/api/workspace-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': headers['Authorization'] || headers['authorization'] || ''
        },
        body: JSON.stringify({
          url,
          method,
          headers,
          body
        })
      });
      return res;
    } catch (err) {
      console.warn('Workspace proxy error, falling back to direct fetch:', err);
      return fetch(url, options);
    }
  }

  // Google Drive & Picker
  static async listDriveFiles(accessToken: string, queryFilter: string = ''): Promise<DriveFile[]> {
    const q = encodeURIComponent(queryFilter || "trashed = false");
    const res = await this.proxyFetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,mimeType,webViewLink,iconLink,thumbnailLink,modifiedTime)&pageSize=20`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.files || [];
  }

  // Google Drive - Create Folder
  static async createDriveFolder(accessToken: string, folderName: string): Promise<{ id: string; url: string } | null> {
    try {
      const res = await this.proxyFetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder'
        })
      });
      if (!res.ok) return null;
      const data = await res.json();
      return {
        id: data.id,
        url: `https://drive.google.com/drive/folders/${data.id}`
      };
    } catch {
      return null;
    }
  }

  // Google Drive - Upload Text or JSON File (with optional parent folder)
  static async uploadTextFileToDrive(accessToken: string, fileName: string, content: string, mimeType: string = 'text/plain', parentFolderId?: string): Promise<{ id: string; url: string } | null> {
    try {
      const metadata: Record<string, any> = {
        name: fileName,
        mimeType
      };
      if (parentFolderId) {
        metadata.parents = [parentFolderId];
      }
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', new Blob([content], { type: mimeType }));

      const res = await this.proxyFetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: form
      });
      if (!res.ok) return null;
      const data = await res.json();
      return {
        id: data.id,
        url: `https://drive.google.com/file/d/${data.id}/view`
      };
    } catch {
      return null;
    }
  }

  // Google Drive - Export Course Notes / Explainers to 'LMDpro Academy' Folder
  static async exportToLMDproAcademyFolder(
    accessToken: string,
    fileName: string,
    content: string,
    mimeType: string = 'text/markdown'
  ): Promise<{ id: string; url: string; folderUrl: string } | null> {
    try {
      // 1. Search for existing 'LMDpro Academy' folder
      const folderQuery = encodeURIComponent("name = 'LMDpro Academy' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
      const searchRes = await this.proxyFetch(`https://www.googleapis.com/drive/v3/files?q=${folderQuery}&fields=files(id,name)`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      let folderId: string | null = null;
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.files && searchData.files.length > 0) {
          folderId = searchData.files[0].id;
        }
      }

      // 2. Create 'LMDpro Academy' folder if not found
      if (!folderId) {
        const newFolder = await this.createDriveFolder(accessToken, 'LMDpro Academy');
        if (newFolder) {
          folderId = newFolder.id;
        }
      }

      // 3. Upload file into the designated folder
      const uploaded = await this.uploadTextFileToDrive(accessToken, fileName, content, mimeType, folderId || undefined);
      if (!uploaded) return null;

      return {
        id: uploaded.id,
        url: uploaded.url,
        folderUrl: folderId ? `https://drive.google.com/drive/folders/${folderId}` : 'https://drive.google.com'
      };
    } catch (e) {
      console.error('Export to LMDpro Academy Drive Folder Error:', e);
      return null;
    }
  }

  // Google Sheets - Fetch Spreadsheet Metadata & Values
  static async fetchSheetValues(accessToken: string, spreadsheetId: string, range: string = 'A1:Z50'): Promise<string[][]> {
    const res = await this.proxyFetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.values || [];
  }

  // Gmail - Fetch Recent Messages
  static async fetchGmailMessages(accessToken: string, queryStr: string = 'subject:Classroom OR subject:Course'): Promise<any[]> {
    const res = await this.proxyFetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(queryStr)}&maxResults=10`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.messages) return [];

    const details = await Promise.all(
      data.messages.slice(0, 5).map(async (msg: { id: string }) => {
        const detailRes = await this.proxyFetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (!detailRes.ok) return null;
        return detailRes.json();
      })
    );

    return details.filter(Boolean);
  }

  // Google Docs - Read Document Content
  static async fetchDocContent(accessToken: string, documentId: string): Promise<string> {
    const res = await this.proxyFetch(`https://docs.googleapis.com/v1/documents/${documentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) return '';
    const data = await res.json();
    return data.title || 'Google Document';
  }

  // Google Docs - Create New Document with Study Plan / Course Content
  static async createDocument(accessToken: string, title: string, content: string): Promise<{ id: string; url: string } | null> {
    try {
      // 1. Create Blank Doc
      const res = await this.proxyFetch('https://docs.googleapis.com/v1/documents', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
      });
      if (!res.ok) return null;
      const doc = await res.json();
      const documentId = doc.documentId;

      // 2. Insert Content
      if (content) {
        await this.proxyFetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            requests: [
              {
                insertText: {
                  location: { index: 1 },
                  text: content
                }
              }
            ]
          })
        });
      }

      return {
        id: documentId,
        url: `https://docs.google.com/document/d/${documentId}/edit`
      };
    } catch {
      return null;
    }
  }

  // Google Sheets - Create New Spreadsheet for Study Progress
  static async createSpreadsheet(accessToken: string, title: string, headersRows: string[][]): Promise<{ id: string; url: string } | null> {
    try {
      const res = await this.proxyFetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: { title }
        })
      });
      if (!res.ok) return null;
      const sheet = await res.json();
      const spreadsheetId = sheet.spreadsheetId;

      if (headersRows && headersRows.length > 0) {
        await this.proxyFetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1?valueInputOption=USER_ENTERED`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values: headersRows
          })
        });
      }

      return {
        id: spreadsheetId,
        url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
      };
    } catch {
      return null;
    }
  }

  // Google Slides - Read Presentation Title
  static async fetchSlidesPresentation(accessToken: string, presentationId: string): Promise<string> {
    const res = await this.proxyFetch(`https://slides.googleapis.com/v1/presentations/${presentationId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) return '';
    const data = await res.json();
    return data.title || 'Google Presentation';
  }

  // Google Tasks - Fetch User Tasks
  static async fetchTasks(accessToken: string): Promise<GoogleTask[]> {
    try {
      const res = await this.proxyFetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists/@default/tasks?maxResults=20', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.items || [];
    } catch (e) {
      console.error('Fetch tasks error:', e);
      return [];
    }
  }

  // Google Tasks - Create Task
  static async createTask(accessToken: string, title: string, notes?: string, due?: string): Promise<GoogleTask | null> {
    try {
      const res = await this.proxyFetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists/@default/tasks', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          notes: notes || '',
          due: due || undefined
        })
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error('Create task error:', e);
      return null;
    }
  }

  // Google Tasks - Update Task (e.g., status: 'completed' or 'needsAction')
  static async updateTask(accessToken: string, taskId: string, taskData: Partial<GoogleTask>): Promise<GoogleTask | null> {
    try {
      const res = await this.proxyFetch(`https://tasks.googleapis.com/tasks/v1/users/@me/lists/@default/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error('Update task error:', e);
      return null;
    }
  }

  // Google Tasks - Delete Task
  static async deleteTask(accessToken: string, taskId: string): Promise<boolean> {
    try {
      const res = await this.proxyFetch(`https://tasks.googleapis.com/tasks/v1/users/@me/lists/@default/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return res.ok;
    } catch (e) {
      console.error('Delete task error:', e);
      return false;
    }
  }

  // Google Forms - Fetch Form Body
  static async fetchForm(accessToken: string, formId: string): Promise<GoogleForm | null> {
    const res = await this.proxyFetch(`https://forms.googleapis.com/v1/forms/${formId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) return null;
    return res.json();
  }

  // Google Calendar - Create Event
  static async createCalendarEvent(accessToken: string, event: GoogleCalendarEvent): Promise<GoogleCalendarEvent | null> {
    try {
      const res = await this.proxyFetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error('Google Calendar Create Event Error:', errText);
        return null;
      }
      return await res.json();
    } catch (err) {
      console.error('Calendar API Error:', err);
      return null;
    }
  }

  // Google Calendar - List Upcoming Events
  static async listCalendarEvents(accessToken: string, timeMin?: string, timeMax?: string): Promise<GoogleCalendarEvent[]> {
    try {
      const now = timeMin || new Date().toISOString();
      let url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(now)}&singleEvents=true&orderBy=startTime&maxResults=20`;
      if (timeMax) {
        url += `&timeMax=${encodeURIComponent(timeMax)}`;
      }
      const res = await this.proxyFetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.items || [];
    } catch (err) {
      console.error('List Calendar Events Error:', err);
      return [];
    }
  }

  // Google Meet - Create Space
  static async createGoogleMeetSpace(accessToken: string): Promise<{ name: string; meetingUri: string; meetingCode: string } | null> {
    try {
      const res = await this.proxyFetch('https://meet.googleapis.com/v2/spaces', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          config: {
            accessType: 'OPEN',
            entryPointAccess: 'ALL'
          }
        })
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error('Google Meet Create Space Error:', errText);
        return null;
      }
      return await res.json();
    } catch (err) {
      console.error('Google Meet API Error:', err);
      return null;
    }
  }
}
