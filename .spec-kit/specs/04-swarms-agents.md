# SPEC-KIT: 04-SWARMS-AGENTS

## 1. Feature Overview
The **Triadic Swarm Architecture** decouples backend autonomous workflows from the human-computer interface. By separating cognitive roles into **Zalamati** (orchestration & security), **Nashmi** (navigation & layouts), and **Petra** (pedagogy & vocal narration), LMDpro provides a stateful, interactive ecosystem.

---

## 2. Problem Statement & Target Persona
Monolithic agent architectures cause high-latency, context-pollution, and fragile UI generation. Executive learners require dedicated, specialized personas that excel at their targeted domains without competing for state or bandwidth.

---

## 3. Object-Oriented Technical Architecture

### 3.1 Class & Component Interface Blueprint

```typescript
type AgentRole = "ZALAMATI" | "NASHMI" | "PETRA";

interface IAgentTask {
  id: string;
  role: AgentRole;
  command: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  timestamp: number;
}

interface IAgentState {
  isActive: boolean;
  activeTaskId?: string;
  conversationalTone: string;
  accumulatedContext: string[];
}

class TriadicSwarmOrchestrator {
  private agentStates: Record<AgentRole, IAgentState>;
  private taskQueue: IAgentTask[] = [];

  constructor() {
    this.agentStates = {
      ZALAMATI: { isActive: false, conversationalTone: "silent_deterministic", accumulatedContext: [] },
      NASHMI: { isActive: false, conversationalTone: "young_calm_documentary", accumulatedContext: [] },
      PETRA: { isActive: false, conversationalTone: "authoritative_female_educator", accumulatedContext: [] }
    };
  }

  public dispatchTask(task: Omit<IAgentTask, "id" | "status" | "timestamp">): string {
    const taskId = `task-${Date.now()}`;
    const newTask: IAgentTask = {
      ...task,
      id: taskId,
      status: "PENDING",
      timestamp: Date.now()
    };
    this.taskQueue.push(newTask);
    this.executeNextTask();
    return taskId;
  }

  private executeNextTask(): void {
    const next = this.taskQueue.find(t => t.status === "PENDING");
    if (!next) return;

    next.status = "RUNNING";
    this.agentStates[next.role].isActive = true;
    this.agentStates[next.role].activeTaskId = next.id;

    // Orchestrator coordinates execution handoffs
  }

  public handleTaskCompletion(taskId: string, resultContext: string): void {
    const task = this.taskQueue.find(t => t.id === taskId);
    if (task) {
      task.status = "COMPLETED";
      this.agentStates[task.role].isActive = false;
      this.agentStates[task.role].accumulatedContext.push(resultContext);
    }
    this.executeNextTask();
  }
}
```

### 3.2 Component Manifest
- **`NashmiFloatingOverlay.tsx`**: High-performance UI widget floating on panels, visualizing Nashmi's textual and spoken UI-accompaniment tips.
- **`LiveVoiceAgent.tsx`**: Dynamic acoustic dialogue visualizer driving Petra's voice interactive sessions.
- **`AgentInspectorModal.tsx`**: Operational debugging console showcasing active Swarm context pipelines and telemetry metrics (hidden from standard executive view).

---

## 4. User Stories & Acceptance Criteria

### User Story 1: Intelligent Navigation and Assistance
> **As an** executive student exploring structural matrices,  
> **I want** Nashmi to guide me through active dashboards and layout changes,  
> **So that** I don't get lost in complex technical views.

- **Acceptance Criterion 1.1**: Nashmi's advice must be triggered in the background upon switching pages or encountering challenging concepts.
- **Acceptance Criterion 1.2**: Nashmi's visual overlay must adapt to both English and Arabic configurations.
- **Acceptance Criterion 1.3**: Visual soundwave indicators must trigger on Nashmi's floating window during TTS playback.

### User Story 2: Immersive Learning Dialogues with Petra
> **As an** advanced student preparing for aerospace defense certifications,  
> **I want to** engage in a verbal, socratic debate with Petra regarding aerodynamic thrust,  
> **So that** my conceptual gaps are diagnosed through interactive conversations.

- **Acceptance Criterion 2.1**: Petra must trigger interactive voice dialogues with socratic questions mapped to textbook concepts.
- **Acceptance Criterion 2.2**: Student verbal inputs must be transcribed and evaluated through backend LLM grading.

---

## 5. Automated Verification & QA
- **Swarm Handoff Verification**: Assert that completing a crawler task on Zalamati triggers a UI re-evaluation loop on Nashmi cleanly.
- **Silence Constraint**: Verify that Zalamati's background processes never emit unrequested user-facing UI notifications or conversational text blocks.
