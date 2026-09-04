import React from 'react';
import { ConversationalBridgeService } from '../shared/conversational.bridge.service';

export interface TTSOptions {
  rate?: number;
  pitch?: number;
  voiceURI?: string;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export function useTTSVoice() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [rate, setRate] = React.useState(1.0);
  const [pitch, setPitch] = React.useState(1.0);
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = React.useState<SpeechSynthesisVoice | null>(null);
  const [currentText, setCurrentText] = React.useState<string>('');
  const [charIndex, setCharIndex] = React.useState(0);

  // Load voices as fallback / reference
  React.useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      if (available.length > 0 && !selectedVoice) {
        const englishVoice = available.find(
          v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
        ) || available.find(v => v.lang.startsWith('en')) || available[0];
        setSelectedVoice(englishVoice);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, [selectedVoice]);

  // Subscribe to central service state changes
  React.useEffect(() => {
    const unsubscribe = ConversationalBridgeService.subscribeLessonTts((event) => {
      if (event.type === "TTS_START") setIsPlaying(true);
      if (event.type === "TTS_END") setIsPlaying(false);
      if (event.type === "UI_UPDATE" && event.isPlaying !== undefined) {
        setIsPlaying(event.isPlaying);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const speak = React.useCallback(
    (text: string, options?: TTSOptions) => {
      if (!text || !text.trim()) return;

      const cleanText = text
        .replace(/[*#_`~]/g, '')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/file:\/\/\/[^\s]+/g, 'file path');

      setCurrentText(cleanText);

      ConversationalBridgeService.playLessonTts(cleanText)
        .then(() => {
          if (options?.onEnd) options.onEnd();
        })
        .catch(err => {
          console.error('TTS service error:', err);
          if (options?.onError) {
            options.onError(err);
          }
        });
    },
    []
  );

  const pause = React.useCallback(() => {
    ConversationalBridgeService.stopLessonTts();
    setIsPaused(true);
    setIsPlaying(false);
  }, []);

  const resume = React.useCallback(() => {
    if (currentText) {
      speak(currentText);
    }
  }, [currentText, speak]);

  const stop = React.useCallback(() => {
    ConversationalBridgeService.stopLessonTts();
    setIsPlaying(false);
    setIsPaused(false);
    setCharIndex(0);
  }, []);

  return {
    speak,
    pause,
    resume,
    stop,
    isPlaying,
    isPaused,
    rate,
    setRate,
    pitch,
    setPitch,
    voices,
    selectedVoice,
    setSelectedVoice,
    currentText,
    charIndex
  };
}
