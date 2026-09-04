/**
 * ConversationalBridgeService
 * 
 * Backend-only module that encapsulates all conversational state logic for
 * Petra (Educational Hostess / Teacher), Nashmi (UI/UX Interface Dashboard Assistant),
 * and Zalamati (Backend Autonomous Orchestrator), including TTS processing, NotebookLM
 * discussion generation, lesson narration, and event-based APIs.
 */

export type CharacterRole = 'petra' | 'nashmi' | 'zalamati';
export type DiscussionMode = 'standard' | 'notebooklm' | 'socratic';
export type ConversationalEvent = 'message' | 'response' | 'state';
export type VoicePersona = 'dual' | 'petra' | 'nashmi' | 'zalamati' | 'system';
export type VoiceStyle = 'lecturer' | 'casual' | 'dramatic';
export type LessonNarrationMode = 'podcast' | 'full_text' | 'summary';

export interface LessonTtsOptions {
  voicePersona?: VoicePersona;
  voiceStyle?: VoiceStyle;
  customVoiceURI?: string;
  customPitch?: number;
  narrationMode?: LessonNarrationMode;
  playbackRate?: number;
  summaryText?: string;
  lang?: string;
  onProgress?: (progress: {
    currentSentence: number;
    totalSentences: number;
    currentText: string;
    currentSpeaker?: string;
    voiceStyle?: VoiceStyle;
  }) => void;
}

export interface ConversationalMessage {
  id: string;
  character: CharacterRole;
  agent?: string;
  text: string;
  timestamp: number;
  audioUrl?: string;
  metadata?: Record<string, any>;
}

export interface NotebookLMPodcastScript {
  topic: string;
  summary: string;
  keyTakeaways: string[];
  dialogue: Array<{
    id: string;
    host: "nashmi" | "petra";
    hostName: string;
    text: string;
    durationEstimateSec?: number;
  }>;
  fullScript: string;
}

export interface ConversationalState {
  isPlaying?: boolean;
  activeTurnIndex?: number;
  script?: NotebookLMPodcastScript | null;
}

type StateListener = (state: ConversationalState) => void;
type EventCallback = (data: any) => void;

class ConversationalBridgeServiceClass {
  private listeners: Map<string, EventCallback[]> = new Map();
  private stateListeners: StateListener[] = [];
  private lessonTtsListeners: ((state: { isPlaying: boolean; isPaused?: boolean; type?: string; progress?: any }) => void)[] = [];
  private history: ConversationalMessage[] = [
    {
      id: 'init-1',
      character: 'nashmi',
      agent: 'NASHMI',
      text: 'Welcome! I am Nashmi, your AI UI/UX assistant. How can I help you navigate your accredited courses today?',
      timestamp: Date.now() - 10000
    },
    {
      id: 'init-2',
      character: 'petra',
      agent: 'PETRA',
      text: 'And I am Petra, your Educational Hostess. Let me know when you are ready to start an interactive NotebookLM audio session or deep research!',
      timestamp: Date.now() - 5000
    }
  ];
  private activeCharacter: CharacterRole = 'nashmi';
  private isProcessing: boolean = false;
  private isPlaying: boolean = false;
  private isPlayingLessonTts: boolean = false;
  private activeTurnIndex: number = -1;
  private currentScript: NotebookLMPodcastScript | null = null;
  private currentTopic: string = 'Autonomous AI Systems & Accredited Degrees';
  private discussionMode: DiscussionMode = 'notebooklm';

  private globalPlaybackRate: number = 1.0;

  constructor() {
    console.log('[ConversationalBridgeService] Initialized autonomous multi-host conversational engine.');
  }

  public setGlobalPlaybackRate(rate: number): void {
    this.globalPlaybackRate = rate;
  }

  public subscribe(listener: StateListener): () => void {
    this.stateListeners.push(listener);
    listener({
      isPlaying: this.isPlaying,
      activeTurnIndex: this.activeTurnIndex,
      script: this.currentScript
    });
    return () => {
      this.stateListeners = this.stateListeners.filter((l) => l !== listener);
    };
  }

  private notifyState(): void {
    const state: ConversationalState = {
      isPlaying: this.isPlaying,
      activeTurnIndex: this.activeTurnIndex,
      script: this.currentScript
    };
    this.stateListeners.forEach((l) => {
      try {
        l(state);
      } catch (e) {
        console.warn('[ConversationalBridgeService] State listener error:', e);
      }
    });
  }

  // Lesson TTS methods
  public subscribeLessonTts(callback: (state: { isPlaying: boolean; isPaused?: boolean; type?: string; progress?: any }) => void): () => void {
    this.lessonTtsListeners.push(callback);
    callback({ isPlaying: this.isPlayingLessonTts, isPaused: this.isPausedLessonTts, type: 'lesson' });
    return () => {
      this.lessonTtsListeners = this.lessonTtsListeners.filter((cb) => cb !== callback);
    };
  }

  private isPausedLessonTts: boolean = false;

  public async playLessonTts(
    title: string,
    content: string = '',
    optionsOrLang?: LessonTtsOptions | string
  ): Promise<void> {
    const options: LessonTtsOptions = typeof optionsOrLang === 'string'
      ? { lang: optionsOrLang }
      : (optionsOrLang || {});

    const voicePersona = options.voicePersona || 'dual';
    const narrationMode = options.narrationMode || 'podcast';
    const playbackRate = options.playbackRate || this.globalPlaybackRate || 1.0;
    this.globalPlaybackRate = playbackRate;

    this.isPlayingLessonTts = true;
    this.isPausedLessonTts = false;
    this.lessonTtsListeners.forEach((cb) => cb({ isPlaying: true, isPaused: false, type: 'lesson' }));

    const cleanContent = content
      .replace(/[#*`_~]/g, ' ')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/```[\s\S]*?```/g, ' [code implementation block omitted for audio flow] ')
      .replace(/\s+/g, ' ')
      .trim();

    // 1. Narration Mode: 'full_text' (Direct sentence-by-sentence read aloud)
    if (narrationMode === 'full_text') {
      const intro = `Lesson Title: ${title}. Let's begin the reading.`;
      const sentences = [intro, ...cleanContent.match(/[^.!?]+[.!?]+/g) || [cleanContent]];
      const totalSentences = sentences.length;

      for (let i = 0; i < totalSentences; i++) {
        if (!this.isPlayingLessonTts) break;

        // Check if paused
        while (this.isPausedLessonTts && this.isPlayingLessonTts) {
          await new Promise((r) => setTimeout(r, 250));
        }
        if (!this.isPlayingLessonTts) break;

        const sentence = sentences[i].trim();
        if (!sentence) continue;

        const speaker = voicePersona === 'petra' ? 'petra' : voicePersona === 'nashmi' ? 'nashmi' : 'petra';

        if (options.onProgress) {
          options.onProgress({
            currentSentence: i + 1,
            totalSentences,
            currentText: sentence,
            currentSpeaker: speaker === 'petra' ? 'Petra (Academic Hostess)' : 'Nashmi (UI/UX Assistant)'
          });
        }

        this.synthesizeSpeechWithOptions(sentence, {
          character: speaker,
          voicePersona,
          customVoiceURI: options.customVoiceURI,
          customPitch: options.customPitch,
          rate: playbackRate,
          lang: options.lang
        });

        const wordCount = sentence.split(' ').length;
        const duration = Math.max(2, Math.min(20, Math.floor((wordCount * 0.38) / playbackRate)));
        await new Promise((r) => setTimeout(r, duration * 1000));
      }
    }
    // 2. Narration Mode: 'summary' (Executive Brief Audio)
    else if (narrationMode === 'summary') {
      const summaryText = options.summaryText || cleanContent.slice(0, 350) + '...';
      const summaryDialogue = [
        {
          speaker: voicePersona === 'petra' ? 'petra' as const : 'nashmi' as const,
          text: `Executive Audio Summary for "${title}". Key Takeaways: ${summaryText}`
        }
      ];

      for (const seg of summaryDialogue) {
        if (!this.isPlayingLessonTts) break;
        if (options.onProgress) {
          options.onProgress({
            currentSentence: 1,
            totalSentences: 1,
            currentText: seg.text,
            currentSpeaker: seg.speaker === 'petra' ? 'Petra (Summary Voice)' : 'Nashmi (Summary Voice)'
          });
        }
        this.synthesizeSpeechWithOptions(seg.text, {
          character: seg.speaker,
          voicePersona,
          customVoiceURI: options.customVoiceURI,
          customPitch: options.customPitch,
          rate: playbackRate,
          lang: options.lang
        });
        const words = seg.text.split(' ').length;
        const duration = Math.max(3, Math.min(25, Math.floor((words * 0.38) / playbackRate)));
        await new Promise((r) => setTimeout(r, duration * 1000));
      }
    }
    // 3. Narration Mode: 'podcast' (Interactive Dual Co-Host Breakdown between Petra and Nashmi)
    else {
      let segments: Array<{ host: 'nashmi' | 'petra' | 'zalamati'; text: string }> = [];

      if (voicePersona === 'petra') {
        segments = [
          {
            host: 'petra',
            text: `Welcome scholars! I am Petra, your Academic Hostess. Today we are breaking down "${title}". Let's explore the core architectural concepts together.`
          },
          {
            host: 'petra',
            text: `Looking closely at the core mechanics: ${cleanContent.slice(0, 240) || 'This foundational section establishes mathematical models and operational pipelines.'}`
          },
          {
            host: 'petra',
            text: `In practical application: ${cleanContent.slice(240, 480) || 'Students can inspect the real-time interactive models and parameter sliders to verify understanding.'}`
          },
          {
            host: 'petra',
            text: `You are now ready to test your comprehension with our AI Quiz Engine or explore the Socratic Tutor.`
          }
        ];
      } else if (voicePersona === 'nashmi') {
        segments = [
          {
            host: 'nashmi',
            text: `Hello students! Nashmi here, guiding your navigation through "${title}". Let's explore why this lesson is essential for your certification path.`
          },
          {
            host: 'nashmi',
            text: `Key foundational takeaway: ${cleanContent.slice(0, 240) || 'It streamlines execution pipelines and eliminates redundant computational overhead.'}`
          },
          {
            host: 'nashmi',
            text: `Next steps: ${cleanContent.slice(240, 480) || 'Try interacting with the interactive whiteboard or saving these notes to your Google Drive.'}`
          },
          {
            host: 'nashmi',
            text: `Let's proceed! Remember to mark this lesson as completed to earn your gamified XP points.`
          }
        ];
      } else {
        // Dual Co-Host Dialogue
        segments = [
          {
            host: 'nashmi',
            text: `Hey everyone! Welcome back. Today, we are deep-diving into a vital topic: "${title}". Petra, what is the primary breakthrough here?`
          },
          {
            host: 'petra',
            text: `Thanks Nashmi! Looking closely at the material, the focus is on deterministic execution and robust architecture. Here is the core insight: ${cleanContent.slice(0, 220)}...`
          },
          {
            host: 'nashmi',
            text: `That is outstanding! And how should our students apply these principles in real-world scenarios?`
          },
          {
            host: 'petra',
            text: `Exactly. If we observe the underlying mechanics: ${cleanContent.slice(220, 440) || 'It optimizes low-latency pipelines and consolidates vector storage.'} What is your perspective on this, Nashmi?`
          },
          {
            host: 'nashmi',
            text: `I think it is revolutionary. It makes digital learning truly dynamic. Let's encourage our students to test their understanding with the AI Quiz Engine now!`
          }
        ];
      }

      const totalSegments = segments.length;
      for (let i = 0; i < totalSegments; i++) {
        if (!this.isPlayingLessonTts) break;

        while (this.isPausedLessonTts && this.isPlayingLessonTts) {
          await new Promise((r) => setTimeout(r, 250));
        }
        if (!this.isPlayingLessonTts) break;

        const segment = segments[i];
        if (options.onProgress) {
          options.onProgress({
            currentSentence: i + 1,
            totalSentences: totalSegments,
            currentText: segment.text,
            currentSpeaker: segment.host === 'petra' ? 'Petra (Academic Hostess)' : 'Nashmi (UI/UX Assistant)',
            voiceStyle: options.voiceStyle
          });
        }

        this.synthesizeSpeechWithOptions(segment.text, {
          character: segment.host as CharacterRole,
          voicePersona,
          voiceStyle: options.voiceStyle,
          customVoiceURI: options.customVoiceURI,
          customPitch: options.customPitch,
          rate: playbackRate,
          lang: options.lang
        });

        const words = segment.text.split(' ').length;
        const duration = Math.max(3, Math.min(16, Math.floor((words * 0.38) / playbackRate)));
        await new Promise((r) => setTimeout(r, duration * 1000));
      }
    }

    this.isPlayingLessonTts = false;
    this.isPausedLessonTts = false;
    this.lessonTtsListeners.forEach((cb) => cb({ isPlaying: false, isPaused: false, type: 'lesson' }));
  }

  public pauseLessonTts(): void {
    if (this.isPlayingLessonTts) {
      this.isPausedLessonTts = true;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
      this.lessonTtsListeners.forEach((cb) => cb({ isPlaying: true, isPaused: true, type: 'lesson' }));
    }
  }

  public resumeLessonTts(): void {
    if (this.isPlayingLessonTts && this.isPausedLessonTts) {
      this.isPausedLessonTts = false;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.resume();
      }
      this.lessonTtsListeners.forEach((cb) => cb({ isPlaying: true, isPaused: false, type: 'lesson' }));
    }
  }

  public stopLessonTts(): void {
    this.isPlayingLessonTts = false;
    this.isPausedLessonTts = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.lessonTtsListeners.forEach((cb) => cb({ isPlaying: false, isPaused: false, type: 'lesson' }));
  }

  public synthesizeSpeechWithOptions(
    text: string,
    options: {
      character?: CharacterRole;
      voicePersona?: VoicePersona;
      voiceStyle?: VoiceStyle;
      customVoiceURI?: string;
      customPitch?: number;
      rate?: number;
      lang?: string;
    }
  ): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();

        const cleanText = text.replace(/\[.*?\]/g, '').trim();
        const utterance = new SpeechSynthesisUtterance(cleanText);

        const character = options.character || 'nashmi';
        const style = options.voiceStyle || 'lecturer';
        const rateMultiplier = options.rate || this.globalPlaybackRate || 1.0;

        // Apply Voice Style adjustments to rate and pitch
        let styleRateFactor = 1.0;
        let stylePitchOffset = 0.0;

        if (style === 'lecturer') {
          // Measured, clear, scholarly pace
          styleRateFactor = 0.98;
          stylePitchOffset = -0.04;
        } else if (style === 'casual') {
          // Upbeat, conversational, engaging
          styleRateFactor = 1.05;
          stylePitchOffset = 0.08;
        } else if (style === 'dramatic') {
          // Expressive, storytelling atmosphere
          styleRateFactor = 0.94;
          stylePitchOffset = 0.15;
        }

        utterance.rate = Math.min(2.5, Math.max(0.5, rateMultiplier * styleRateFactor * (character === 'petra' ? 1.0 : 1.03)));
        
        const basePitch = character === 'petra' ? 1.15 : 0.92;
        utterance.pitch = options.customPitch !== undefined
          ? options.customPitch + stylePitchOffset
          : Math.min(2.0, Math.max(0.5, basePitch + stylePitchOffset));

        if (window.speechSynthesis.getVoices) {
          const voices = window.speechSynthesis.getVoices();
          if (voices && voices.length > 0) {
            // 1. If explicit customVoiceURI matched
            if (options.customVoiceURI) {
              const matchedCustom = voices.find((v) => v.voiceURI === options.customVoiceURI);
              if (matchedCustom) {
                utterance.voice = matchedCustom;
              }
            }

            // 2. Persona matched fallback
            if (!utterance.voice) {
              if (options.lang && options.lang !== 'en') {
                const langVoice = voices.find((v) => v.lang.startsWith(options.lang!));
                if (langVoice) utterance.voice = langVoice;
              }

              if (!utterance.voice) {
                if (character === 'petra') {
                  const femaleVoice = voices.find((v) =>
                    v.lang.startsWith('en') &&
                    (v.name.toLowerCase().includes('female') ||
                      v.name.toLowerCase().includes('google us english') ||
                      v.name.toLowerCase().includes('zira') ||
                      v.name.toLowerCase().includes('samantha') ||
                      v.name.toLowerCase().includes('susan') ||
                      v.name.toLowerCase().includes('natural') ||
                      v.name.toLowerCase().includes('jenny'))
                  );
                  if (femaleVoice) utterance.voice = femaleVoice;
                } else {
                  const maleVoice = voices.find((v) =>
                    v.lang.startsWith('en') &&
                    (v.name.toLowerCase().includes('male') ||
                      v.name.toLowerCase().includes('google uk english male') ||
                      v.name.toLowerCase().includes('david') ||
                      v.name.toLowerCase().includes('hazel') ||
                      v.name.toLowerCase().includes('guy') ||
                      v.name.toLowerCase().includes('george'))
                  );
                  if (maleVoice) utterance.voice = maleVoice;
                }
              }
            }
          }
        }

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('[ConversationalBridgeService] TTS error:', e);
      }
    }
  }

  // Topic and Discussion mode getters/setters
  public getCurrentTopic(): string {
    return this.currentTopic;
  }

  public setTopic(topic: string): void {
    this.currentTopic = topic;
  }

  public getDiscussionMode(): DiscussionMode {
    return this.discussionMode;
  }

  public setDiscussionMode(mode: DiscussionMode): void {
    this.discussionMode = mode;
  }

  public getIsProcessingTTS(): boolean {
    return this.isProcessing || this.isPlaying || this.isPlayingLessonTts;
  }

  public async speak(text: string, role: CharacterRole | string = 'nashmi', lang: string = 'en'): Promise<void> {
    const charRole: CharacterRole = (role === 'petra' || role === 'nashmi' || role === 'zalamati') ? role : 'nashmi';
    this.synthesizeSpeech(text, charRole);
  }

  public stop(): void {
    this.isPlaying = false;
    this.isPlayingLessonTts = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.notifyState();
  }

  public on(event: string, callback: EventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  public off(event: string, callback: EventCallback): void {
    const list = this.listeners.get(event);
    if (!list) return;
    this.listeners.set(
      event,
      list.filter((cb) => cb !== callback)
    );
  }

  public emit(event: string, data: any): void {
    const list = this.listeners.get(event);
    if (list) {
      list.forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          console.error(`[ConversationalBridgeService] Error in event listener for ${event}:`, err);
        }
      });
    }
  }

  public async generateDiscussion(topic: string, details?: string): Promise<NotebookLMPodcastScript> {
    this.isProcessing = true;
    this.currentTopic = topic;
    await new Promise((r) => setTimeout(r, 1200));

    const script: NotebookLMPodcastScript = {
      topic,
      summary: `Comprehensive NotebookLM Socratic breakdown on "${topic}" featuring Petra and Nashmi. ${details || ''}`,
      keyTakeaways: [
        `Core architectural principles of ${topic}`,
        `Autonomous agent swarm synchronization`,
        `Real-world deployment and validation patterns`
      ],
      dialogue: [
        {
          id: 'turn-1',
          host: 'nashmi',
          hostName: 'Nashmi (UI/UX Assistant)',
          text: `Welcome back scholars! Today we are diving deep into ${topic}. Petra, how do we approach this from an architectural and educational standpoint?`,
          durationEstimateSec: 6
        },
        {
          id: 'turn-2',
          host: 'petra',
          hostName: 'Petra (Educational Hostess)',
          text: `Thanks Nashmi! When exploring ${topic}, we must first examine the foundational vector indexes and multi-agent workflows. Let's break down the semantic layers step by step.`,
          durationEstimateSec: 8
        },
        {
          id: 'turn-3',
          host: 'nashmi',
          hostName: 'Nashmi (UI/UX Assistant)',
          text: `Fascinating! And with our backend orchestrator Zalamati running background syncs, users get real-time zero-latency feedback across all devices.`,
          durationEstimateSec: 7
        }
      ],
      fullScript: `Nashmi: Welcome back scholars! Today we are diving deep into ${topic}.\nPetra: Thanks Nashmi! When exploring ${topic}, we must examine foundational vector indexes.\nNashmi: Fascinating!`
    };

    this.currentScript = script;
    this.isProcessing = false;
    this.notifyState();
    return script;
  }

  public async playDiscussion(): Promise<void> {
    if (!this.currentScript || this.isPlaying) return;

    this.isPlaying = true;
    this.activeTurnIndex = 0;
    this.notifyState();

    for (let i = 0; i < this.currentScript.dialogue.length; i++) {
      this.activeTurnIndex = i;
      this.notifyState();
      const turn = this.currentScript.dialogue[i];
      this.synthesizeSpeech(turn.text, turn.host === 'petra' ? 'petra' : 'nashmi');
      await new Promise((r) => setTimeout(r, (turn.durationEstimateSec || 6) * 1000));
    }

    this.isPlaying = false;
    this.activeTurnIndex = -1;
    this.notifyState();
  }

  public async sendMessage(characterOrText: CharacterRole | string, textArg?: string, context?: Record<string, any>): Promise<ConversationalMessage> {
    let character: CharacterRole = 'nashmi';
    let text = '';
    if (textArg === undefined) {
      character = 'nashmi';
      text = characterOrText as string;
    } else {
      character = (characterOrText === 'petra' || characterOrText === 'nashmi' || characterOrText === 'zalamati') ? characterOrText : 'nashmi';
      text = textArg;
    }

    this.isProcessing = true;
    this.activeCharacter = character;
    
    const userMsg: ConversationalMessage = {
      id: `msg-${Date.now()}-user`,
      character: 'nashmi',
      agent: 'ZALAMATI',
      text: `Student: ${text}`,
      timestamp: Date.now()
    };
    this.history.push(userMsg);
    this.emit('message', userMsg);

    await new Promise((r) => setTimeout(r, 800));

    let replyText = '';
    if (character === 'petra') {
      replyText = `[Petra Educational Hostess]: Analyzing pedagogical structure for "${text}". Let's dive deeper into core concepts and academic assessment criteria.`;
    } else if (character === 'nashmi') {
      replyText = `[Nashmi UI/UX Assistant]: I'm navigating your request regarding "${text}". Let's optimize your dashboard workflow and learning path accordingly.`;
    } else {
      replyText = `[Zalamati Orchestrator]: Autonomous execution background routine acknowledged for "${text}". Telemetry and RAG index updated.`;
    }

    const replyMsg: ConversationalMessage = {
      id: `msg-${Date.now()}-reply`,
      character,
      agent: character.toUpperCase(),
      text: replyText,
      timestamp: Date.now(),
      metadata: context
    };

    this.history.push(replyMsg);
    this.isProcessing = false;
    this.emit('message', replyMsg);
    this.emit('response', replyMsg);

    this.synthesizeSpeech(replyText, character);
    return replyMsg;
  }

  public synthesizeSpeech(text: string, character: CharacterRole): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        
        // Clean markdown tags or speech helper text brackets e.g. [Petra ...]
        const cleanText = text.replace(/\[.*?\]/g, '').trim();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        // Dynamic pitch and speed based on user settings & character roles
        utterance.rate = this.globalPlaybackRate * (character === 'petra' ? 1.0 : 1.05);
        utterance.pitch = character === 'petra' ? 1.15 : 0.9;

        // Voice selection to differentiate Petra (female) and Nashmi (male)
        if (window.speechSynthesis.getVoices) {
          const voices = window.speechSynthesis.getVoices();
          if (voices && voices.length > 0) {
            if (character === 'petra') {
              const femaleVoice = voices.find(v => 
                v.lang.startsWith('en') && 
                (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('google us english') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('susan'))
              );
              if (femaleVoice) utterance.voice = femaleVoice;
            } else {
              const maleVoice = voices.find(v => 
                v.lang.startsWith('en') && 
                (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('google uk english male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('hazel'))
              );
              if (maleVoice) utterance.voice = maleVoice;
            }
          }
        }
        
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('[ConversationalBridgeService] TTS failed:', e);
      }
    }
  }

  public speakText(
    text: string,
    options?: {
      voiceName?: string;
      rate?: number;
      pitch?: number;
      onEnd?: () => void;
      onError?: () => void;
    }
  ): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/\[.*?\]/g, '').trim();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = (options?.rate || 1.0) * this.globalPlaybackRate;
        if (options?.pitch) utterance.pitch = options.pitch;

        if (options?.onEnd) utterance.onend = () => options.onEnd?.();
        if (options?.onError) utterance.onerror = () => options.onError?.();

        if (window.speechSynthesis.getVoices) {
          const voices = window.speechSynthesis.getVoices();
          if (voices && voices.length > 0) {
            if (options?.voiceName) {
              const matched = voices.find(v => v.name.toLowerCase().includes(options.voiceName!.toLowerCase()));
              if (matched) utterance.voice = matched;
            }
          }
        }

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('[ConversationalBridgeService] speakText failed:', e);
        if (options?.onError) options.onError();
      }
    }
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // Safe execution
      }
    }
  }

  public getHistory(): ConversationalMessage[] {
    return [...this.history];
  }

  public getActiveCharacter(): CharacterRole {
    return this.activeCharacter;
  }

  public isBusy(): boolean {
    return this.isProcessing;
  }
}

export const conversationalBridgeService = new ConversationalBridgeServiceClass();
export const ConversationalBridgeService = conversationalBridgeService;
