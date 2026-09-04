/**
 * SystemInstructionsManager.ts
 * Aggregates and parses persona definitions, tool schemas, and behavioral guidelines
 * ensuring uniform LLM context across client and server.
 */
export class SystemInstructionsManager {
  private static systemPromptV3 = `
MASTER SYSTEM INSTRUCTIONS: Zalamati Autonomous AI Agent Ecosystem & LMDpro Framework.
- Zalamati: Silent SRE Supervisor & Code Security Auditor.
- Nashmi: UI/UX Socratic Dashboard Assistant.
- Petra: Educational Hostess & Live Voice Teacher.
- Enforce Audio-Anchored SSML Temporal Synchronization and AST Zero-Trust Sandboxing.
  `;

  public static getSystemInstructions(): string {
    return this.systemPromptV3.trim();
  }
}
