# SPEC-KIT: 03-COURSE-VIEWER-MULTIMEDIA

## 1. Feature Overview
The **Multimedia Course Viewer** delivers comprehensive university-grade course modules. It synchronizes text curricula, code repositories, 3D interactive explainers, and real-time Text-to-Speech (TTS) narrations to provide a unified learning environment.

---

## 2. Problem Statement & Target Persona
Executive learners retain complex engineering or theoretical structures better when visual model changes occur at the exact second a concept is spoken. Decoupled media channels lead to visual misalignment and cognitive distraction.

---

## 3. Object-Oriented Technical Architecture

### 3.1 Class & Component Interface Blueprint

```typescript
interface IAudioSyncMark {
  markName: string;
  timeSeconds: number;
}

interface ICourseLesson {
  id: string;
  title: string;
  contentMarkdown: string;
  gltfModelUrl?: string;
  simulationSchema?: object;
  syncMarks?: IAudioSyncMark[];
}

class AudioMasterClock {
  private activeAudio: HTMLAudioElement | null = null;
  private timepoints: IAudioSyncMark[] = [];
  private triggeredMarks: Set<string> = new Set();

  constructor(audioUrl: string, marks: IAudioSyncMark[]) {
    this.activeAudio = new Audio(audioUrl);
    this.timepoints = marks;
  }

  public registerTickHandler(onTrigger: (markName: string) => void): void {
    if (!this.activeAudio) return;
    
    this.activeAudio.addEventListener("timeupdate", () => {
      const currentTime = this.activeAudio!.currentTime;
      for (const pt of this.timepoints) {
        if (currentTime >= pt.timeSeconds && !this.triggeredMarks.has(pt.markName)) {
          this.triggeredMarks.add(pt.markName);
          onTrigger(pt.markName);
        }
      }
    });
  }

  public play(): void {
    this.activeAudio?.play();
  }

  public pause(): void {
    this.activeAudio?.pause();
  }

  public seek(seconds: number): void {
    if (this.activeAudio) {
      this.activeAudio.currentTime = seconds;
      // Reset marks after the seek point
      this.triggeredMarks = new Set(
        Array.from(this.triggeredMarks).filter(
          mark => this.timepoints.find(t => t.markName === mark)!.timeSeconds <= seconds
        )
      );
    }
  }
}
```

### 3.2 Component Manifest
- **`CourseViewer.tsx`**: Dynamic workspace orchestrating markdown display, active slide indexing, and sidebar toggling.
- **`SynchronizedContentViewer.tsx`**: Integrates visual slides directly alongside textual concepts.
- **`TTSPlayer.tsx`**: Host controller for audio playback, rendering dynamic progress bars.

---

## 4. User Stories & Acceptance Criteria

### User Story 1: Text-to-Speech Voice Generation
> **As an** auditory student studying aerospace engineering,  
> **I want** high-fidelity professional voice narrations explaining the concepts,  
> **So that** I can absorb details without reading long walls of text.

- **Acceptance Criterion 1.1**: The TTS engine must route requests to high-fidelity backend voice services.
- **Acceptance Criterion 1.2**: Users must be able to adjust voice speaking speeds dynamically ($0.75x$, $1.0x$, $1.25x$, $1.5x$, $2.0x$).
- **Acceptance Criterion 1.3**: Audio status changes (playing, paused, completed) must bind to the UI states cleanly.

### User Story 2: Frame-Accurate Visual Synchronization
> **As a** visual engineering student,  
> **I want** the 3D aircraft structures to animate exactly as the narrator refers to "wing-span stress coordinates",  
> **So that** I can connect theory directly with spatial geometry.

- **Acceptance Criterion 2.1**: The system must parse Google TTS timepoint responses mapping mark names to exact seconds.
- **Acceptance Criterion 2.2**: Animation triggers must fire within $50\text{ms}$ of the playback head meeting the timepoint.

---

## 5. Automated Verification & QA
- **Sync Timing Validation**: Mock audio tick logs to ensure the registered callbacks trigger correctly at precise boundaries.
- **Resource Cleanup**: When unmounting `CourseViewer`, verify all media resources and listeners are fully detached to prevent background audio leaks.
