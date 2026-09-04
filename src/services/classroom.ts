import { WorkspaceService } from '../shared/workspace.service';

export interface ClassroomCourse {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  ownerId?: string;
  courseState?: string;
  alternateLink?: string;
  creationTime?: string;
}

export interface ClassroomCourseWork {
  id: string;
  title: string;
  description?: string;
  state?: string;
  alternateLink?: string;
  maxPoints?: number;
  workType?: string;
  dueDate?: { year: number; month: number; day: number };
}

export interface ClassroomStudent {
  userId: string;
  profile: {
    id: string;
    name: {
      fullName: string;
      givenName?: string;
      familyName?: string;
    };
    emailAddress?: string;
    photoUrl?: string;
  };
}

export interface ClassroomAnnouncement {
  id: string;
  text: string;
  alternateLink?: string;
  creationTime?: string;
}

export class ClassroomService {
  static async fetchCourses(accessToken: string): Promise<ClassroomCourse[]> {
    const res = await WorkspaceService.proxyFetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Google Classroom API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    return data.courses || [];
  }

  static async fetchCourseWork(accessToken: string, courseId: string): Promise<ClassroomCourseWork[]> {
    const res = await WorkspaceService.proxyFetch(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      if (res.status === 404) return [];
      const errText = await res.text();
      throw new Error(`Google Classroom CourseWork error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    return data.courseWork || [];
  }

  static async fetchStudents(accessToken: string, courseId: string): Promise<ClassroomStudent[]> {
    const res = await WorkspaceService.proxyFetch(`https://classroom.googleapis.com/v1/courses/${courseId}/students`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      if (res.status === 404 || res.status === 403) return [];
      const errText = await res.text();
      throw new Error(`Google Classroom Students error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    return data.students || [];
  }

  static async fetchAnnouncements(accessToken: string, courseId: string): Promise<ClassroomAnnouncement[]> {
    const res = await WorkspaceService.proxyFetch(`https://classroom.googleapis.com/v1/courses/${courseId}/announcements`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      if (res.status === 404) return [];
      const errText = await res.text();
      throw new Error(`Google Classroom Announcements error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    return data.announcements || [];
  }
}
