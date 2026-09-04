import { AdaptiveLevel } from '../shared/types';
import { GeminiProxyService } from './geminiProxyService';

export interface GeneratedQuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface QuizEvaluationResult {
  isCorrect: boolean;
  score: number;
  feedback: string;
  newAdaptiveLevel?: AdaptiveLevel;
  suggestedReviewTopic?: string;
}

export const QuizEngine = {
  /**
   * Generate adaptive, rich multiple-choice questions for course content
   * Proxied securely through the server-side proxy route
   */
  generateQuiz: async (
    lessonTitle: string,
    content: string,
    adaptiveLevel: AdaptiveLevel = 'standard'
  ): Promise<GeneratedQuizQuestion[]> => {
    try {
      const prompt = `You are a Lead Cognitive Psychometrics Assessment Engineer.
Generate 3 high-quality, conceptual multiple-choice quiz questions for the following lesson:
Title: "${lessonTitle}"
Level: ${adaptiveLevel}
Content excerpt: "${content.substring(0, 1500)}"

Return STRICT valid JSON in the following schema array format:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswerIndex": 0,
    "explanation": "Detailed pedagogical explanation of why option A is correct and why others are incorrect.",
    "difficulty": "${adaptiveLevel === 'mastery' ? 'advanced' : adaptiveLevel === 'remedial' ? 'beginner' : 'intermediate'}"
  }
]`;

      const result = await GeminiProxyService.generate({
        prompt,
        model: 'gemini-3.7-flash',
        config: {
          responseMimeType: 'application/json'
        },
        cacheKey: `quiz:${lessonTitle.toLowerCase()}:${adaptiveLevel}`,
        cacheTtlMs: 60 * 60 * 1000
      });

      if (result.success && result.text) {
        const jsonMatch = result.text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn('[QuizEngine] Gemini AI quiz generation fallback to algorithmic builder:', err);
    }

    // Algorithmic Fallback Builder
    return [
      {
        question: `In "${lessonTitle}", what is the primary structural objective?`,
        options: [
          'To establish deterministic execution and minimize computational overhead',
          'To bypass security constraints without audit trails',
          'To replace human judgment with static lookup tables',
          'To enforce single-threaded sequential blocking loops'
        ],
        correctAnswerIndex: 0,
        explanation: 'Core architecture focuses on deterministic execution, low latency, and robust fault-tolerance.',
        difficulty: adaptiveLevel === 'mastery' ? 'advanced' : 'intermediate'
      },
      {
        question: `How does adaptive state management operate under ${adaptiveLevel} parameters?`,
        options: [
          'By continuously sampling metrics and adjusting cognitive difficulty loops',
          'By resetting state variables randomly upon every user interaction',
          'By caching raw unencrypted passwords locally in global scope',
          'By locking user input fields permanently during execution'
        ],
        correctAnswerIndex: 0,
        explanation: 'Adaptive engines monitor real-time accuracy and adjust difficulty dynamically.',
        difficulty: 'intermediate'
      },
      {
        question: `Which trade-off is critical when balancing system performance against accuracy?`,
        options: [
          'Latency versus model parameters & contextual reasoning depth',
          'Color saturation versus screen resolution',
          'File extension naming versus font sizes',
          'Audio volume versus mouse pointer velocity'
        ],
        correctAnswerIndex: 0,
        explanation: 'Higher reasoning model depth increases latency but improves analytical precision.',
        difficulty: 'beginner'
      }
    ];
  },

  /**
   * Evaluate student answer and determine adaptive level shift
   */
  evaluateAnswer: (
    userAnswerIndex: number,
    correctAnswerIndex: number,
    explanation: string,
    currentLevel: AdaptiveLevel = 'standard'
  ): QuizEvaluationResult => {
    const isCorrect = userAnswerIndex === correctAnswerIndex;

    let newLevel: AdaptiveLevel = currentLevel;
    if (isCorrect) {
      if (currentLevel === 'remedial') newLevel = 'standard';
      else if (currentLevel === 'standard') newLevel = 'accelerated';
      else if (currentLevel === 'accelerated') newLevel = 'mastery';
    } else {
      if (currentLevel === 'mastery') newLevel = 'accelerated';
      else if (currentLevel === 'accelerated') newLevel = 'standard';
      else if (currentLevel === 'standard') newLevel = 'remedial';
    }

    return {
      isCorrect,
      score: isCorrect ? 100 : 0,
      feedback: isCorrect
        ? `✅ Spot on! ${explanation}`
        : `❌ Not quite. ${explanation}`,
      newAdaptiveLevel: newLevel
    };
  }
};
