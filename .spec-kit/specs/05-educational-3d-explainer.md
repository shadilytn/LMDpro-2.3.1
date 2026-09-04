# SPEC-KIT: 05-EDUCATIONAL-3D-EXPLAINER

## 1. Feature Overview
The **Interactive 3D Explainer** system brings abstract physical, mechanical, and mathematical concepts to life. Modeled after high-end explainer documentaries (e.g., Jared Owen, Animagraffs), it renders physical models, rigs mechanical components, and overlays kinetic vector forces inside the client browser.

---

## 2. Problem Statement & Target Persona
Executive students find it difficult to conceptualize physical motions (such as orbital mechanics or cipher machine gears) through two-dimensional charts or text descriptions. A physical, rotatable 3D workspace allows learners to interact directly with variables and observe immediate kinetic responses.

---

## 3. Object-Oriented Technical Architecture

### 3.1 Class & Component Interface Blueprint

```typescript
interface IVectorForce {
  id: string;
  direction: [number, number, number];
  magnitude: number;
  color: string;
}

interface IRiggedComponent {
  meshId: string;
  rotationAxis: [number, number, number];
  pivotPoint: [number, number, number];
  currentAngle: number;
}

class ThreeExplainerEngine {
  private containerElement: HTMLElement;
  private activeForces: IVectorForce[] = [];
  private riggedComponents: IRiggedComponent[] = [];

  constructor(container: HTMLElement) {
    this.containerElement = container;
    this.initializeScene();
  }

  private initializeScene(): void {
    // Standard Three.js / WebGL context bootstrapping
  }

  public applyVectorForce(force: IVectorForce): void {
    this.activeForces.push(force);
    this.renderForceVectorArrow(force);
  }

  public updateComponentRotation(meshId: string, deltaAngle: number): void {
    const comp = this.riggedComponents.find(c => c.meshId === meshId);
    if (comp) {
      comp.currentAngle += deltaAngle;
      this.applyTransformationMatrix(comp);
    }
  }

  private applyTransformationMatrix(component: IRiggedComponent): void {
    // Affine matrix calculations for localized rotation around pivot points
  }
}
```

### 3.2 Component Manifest
- **`AnimagraphTechnicalExplainer.tsx`**: Host WebGL view for complex engineering animations.
- **`CinematicVideoVisualizer.tsx`**: Dynamic multi-stage presenter rendering atmospheric scattering, volumetric lighting, and keyframe transitions.
- **`InteractiveExplainer.tsx`**: Interface overlay adding speed sliders, play/pause controls, and coordinate inspect tools.

---

## 4. User Stories & Acceptance Criteria

### User Story 1: Rotatable Mechanical Assembly
> **As an** aerospace engineering student,  
> **I want to** rotate and inspect the internal compressor blades of a turbofan engine,  
> **So that** I understand how structural pressure distributes across components.

- **Acceptance Criterion 1.1**: The 3D stage must support smooth orbit controls (left click drag to rotate, right click drag to pan, scroll to zoom).
- **Acceptance Criterion 1.2**: Compressor blades must rotate around their central axes of kinematics parameterization.
- **Acceptance Criterion 1.3**: Materials must render under standard PBR rules to reflect light realistically.

### User Story 2: Parametric Stress Overlay
> **As an** architectural engineering student,  
> **I want to** adjust the simulated payload stress applied to a space truss using a slider,  
> **So that** I can observe force distribution and structural compression points.

- **Acceptance Criterion 2.1**: Adjusting the load slider must dynamically update vector arrows representing tension and compression.
- **Acceptance Criterion 2.2**: High-stress components must transition color dynamically (e.g., green to glowing red) to highlight stress failures.

---

## 5. Automated Verification & QA
- **Canvas Sizing Rule**: Never use hardcoded dimensions (`window.innerWidth - 200`). Integrate a `ResizeObserver` on the parent container to scale WebGL viewports fluidly.
- **AST Code Policy**: All dynamically compiled simulation equations must pass strict static parser validation on the backend before browser evaluation.
