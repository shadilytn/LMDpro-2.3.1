# Specification: 07-Agentic & Multimodal Features (SDD-07)

This specification defines the architectural design, API endpoints, database schemas, and UX implementations for the agentic, multimodal, and search-grounded capabilities.

## 1. Objectives & User Stories
- **Auth & Database Persistence:** As a student, I can sign in securely with Google and have my progress, streak, bookmarks, and notes persisted in Firestore, preventing local data loss.
- **AI Image Generation:** As an educator or student, I can generate beautiful geometric custom badges and header backgrounds using text prompts.
- **Voice Agent & Transcription:** As an auditory learner, I can speak into my microphone, have my voice transcribed, and engage in real-time vocal learning with Petra and Nashmi.
- **Veo Video Generation:** As a visual learner, I can trigger high-fidelity educational video segments from text prompts or by animating uploaded images.
- **Search & Maps Grounding:** As a researcher, I can query modern topics and receive verified answers grounded in live Google Search and Google Maps data.
- **Multi-Model Chatbot:** As a curious learner, I can toggle between high-speed (Flash-Lite), standard (Flash), and deep-reasoning (Pro) intelligence levels for contextual study assistance.

## 2. Technical Design & Interfaces

### 2.1 Firebase Collections & Schemas
- `users`: `{ uid: string, email: string, displayName: string, photoURL: string, lastSignIn: number }`
- `progress`: `{ uid: string, completedLessons: string[], completedCourses: string[], currentStreak: number, lastActiveDate: string, xp: number }`
- `bookmarks`: `{ id: string, uid: string, lessonId: string, title: string, content: string, createdAt: number }`
- `notes`: `{ id: string, uid: string, lessonId: string, noteText: string, createdAt: number }`

### 2.2 Server-Side API Routing (`server.ts`)
To keep API keys perfectly secure, all external requests are proxied server-side:
- `/api/auth/session`: Validates session tokens and syncs with Firestore.
- `/api/generate-image`: Proxies prompt-to-image queries using the modern SDK.
- `/api/generate-video`: Triggers Veo 3 video generation.
- `/api/transcribe`: Accepts audio payloads and returns transcription.
- `/api/grounded-chat`: Performs search-grounded or maps-grounded chat requests using Gemini tools.
- `/api/chat`: Multi-model conversational router supporting `flash-lite`, `flash`, and `pro` switches.

## 3. Visual & Aesthetic Architecture
- **Unified Theme:** All interfaces sit inside the **"Liquid Glass" Dark Mode** system, maintaining deep slate backdrops and frosted translucent panels.
- **Refined Control States:** Custom toggle selectors, mic status icons, and audio wave animations are styled with Neon Cyan (`#22d3ee`), Emerald (`#34d399`), and Amber (`#f59e0b`) accents.
- **Mathematical Layout:** Consistent outer padding (24px) exceeding internal padding (16px) with math-derived container corner-radii.
