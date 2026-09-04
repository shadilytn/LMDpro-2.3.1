# SPEC-KIT: 01-BENTO-GRID-DASHBOARD

## 1. Feature Overview
The **Bento-Grid Dashboard** serves as the primary executive-suite entry point for LMDpro learners. Inspired by high-end engineering consoles (e.g., lmdpro.app), it arranges complex educational data, schedules, active coursework, study streaks, and progress metrics into an adaptive, responsive grid.

---

## 2. Problem Statement & Target Persona
Traditional educational dashboards are cluttered with duplications, high-frequency colors, and rigid lists. Executive learners require a calm, consolidated, high-density visualization tool where every piece of data lives in exactly one dedicated, logical card.

---

## 3. Object-Oriented Technical Architecture

### 3.1 Class & Component Interface Blueprint

```typescript
interface IBentoWidget {
  id: string;
  title: string;
  visible: boolean;
  order: number;
  gridSpanClass: string; // e.g. "col-span-12 md:col-span-6 lg:col-span-4"
}

interface IStudentProgressMetrics {
  totalXp: number;
  streakDays: number;
  completedLessonsCount: number;
  savedBookmarksCount: number;
  weeklyEngagementHours: number[]; // Index corresponds to [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
}

class DashboardEngine {
  private activeWidgets: IBentoWidget[];
  private progressMetrics: IStudentProgressMetrics;

  constructor(widgets: IBentoWidget[], metrics: IStudentProgressMetrics) {
    this.activeWidgets = this.sortWidgets(widgets);
    this.progressMetrics = metrics;
  }

  private sortWidgets(widgets: IBentoWidget[]): IBentoWidget[] {
    return [...widgets].sort((a, b) => a.order - b.order);
  }

  public getVisibleWidgets(): IBentoWidget[] {
    return this.activeWidgets.filter(w => w.visible);
  }

  public recalculateLayout(screenWidth: number): void {
    // Dynamic resizing rules for mobile vs. tablet vs. desktop
  }
}
```

### 3.2 Component Manifest
- **`StudentDashboard.tsx`**: Host bento grid component, orchestrating layout state.
- **`LearningAnalyticsDashboard.tsx`**: Renders analytical metrics (XP, streak counts, course completions) with interactive tooltips and Recharts visualizations.
- **`WeeklyStudyGrid.tsx`**: Standard-aligned grid mapping course assignments against current deadlines (no duplication on main hub).

---

## 4. User Stories & Acceptance Criteria

### User Story 1: Responsive Bento Arrangements
> **As an** executive student,  
> **I want to** view my metrics structured in a mathematical grid,  
> **So that** I can scan my achievements instantly on mobile, tablet, or wide screen.

- **Acceptance Criterion 1.1**: The main layout must wrap in a CSS grid (`grid grid-cols-12 gap-6`).
- **Acceptance Criterion 1.2**: Cards must support flexible col-spans (`col-span-12`, `md:col-span-6`, `lg:col-span-4`).
- **Acceptance Criterion 1.3**: Zero horizontal overflows on ultra-wide screens using max-width boundary controls (`w-full max-w-7xl mx-auto`).

### User Story 2: Elimination of Duplicated Content
> **As an** executive learner,  
> **I want** each analytical data point and scheduler component to reside in exactly one primary view,  
> **So that** my dashboard interface remains uncluttered and clean.

- **Acceptance Criterion 2.1**: The weekly calendar/planner must reside strictly on its dedicated Planner page, rather than duplicated on the main dashboard cards.
- **Acceptance Criterion 2.2**: Academic course filters must reside cleanly within the course-explorer view.

---

## 5. Automated Verification & QA
- **Linter Check**: Validate that all imports mapping to the `shared` directory parse successfully.
- **Responsive Fluidity**: Ensure the container scales dynamically across screen boundary triggers ($320\text{px}$, $768\text{px}$, $1024\text{px}$, $1440\text{px}$).
- **Accessibility AA Check**: Color contrast between deep slate card backgrounds and neon cyan/amber labels must exceed $4.5:1$.
