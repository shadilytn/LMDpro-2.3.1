import React from 'react';
import { getApiHeaders } from '../shared/apiHelper';

export interface AudioNarrationResult {
  audioUrl?: string;
  ssml?: string;
  transcript?: string;
  durationSeconds?: number;
  timepoints?: Array<{ markName: string; timeOffsetMs: number }>;
}

export const useAudioNarration = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [audioResult, setAudioResult] = React.useState<AudioNarrationResult | null>(null);

  const fetchNarration = React.useCallback(async (text: string, voicePersona: 'PETRA_TEACHER' | 'NASHMI_DOCUMENTARY' = 'PETRA_TEACHER') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/gemini/tts', {
        method: 'POST',
        headers: getApiHeaders(),
        body: JSON.stringify({
          text,
          voicePersona,
          speed: 1.0,
          enableTimepoints: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS API error status ${response.status}`);
      }

      const data = await response.json();
      const result: AudioNarrationResult = {
        audioUrl: data.audioUrl || data.audioContent,
        ssml: data.ssml,
        transcript: text,
        timepoints: data.timepoints || [],
      };
      setAudioResult(result);
      return result;
    } catch (err: any) {
      console.warn('Audio narration fetch failed, using web speech synthesis fallback:', err);
      setError(err.message || 'Audio fetch failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fetchNarration,
    isLoading,
    error,
    audioResult,
  };
};

export default useAudioNarration;
