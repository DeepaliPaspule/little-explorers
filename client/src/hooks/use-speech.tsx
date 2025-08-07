import { useState, useCallback, useEffect } from 'react';
import { speechService } from '@/lib/speech';

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fallbackText, setFallbackText] = useState<string>('');
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    setIsSupported(speechService.isSupported());
  }, []);

  const speak = useCallback((text: string) => {
    // Always show text fallback for reliability
    setFallbackText(text);
    setShowFallback(true);

    // Also attempt speech synthesis if supported
    if (isSupported) {
      setIsSpeaking(true);
      setError(null);

      speechService.speak(
        text,
        () => {
          setIsSpeaking(false);
        },
        (error) => {
          setIsSpeaking(false);
          // Text fallback is already shown, so no need to handle error
        }
      );
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    speechService.stop();
    setIsSpeaking(false);
  }, []);

  const speakItem = useCallback((name: string, fact: string) => {
    const text = `${name}. Let me spell that for you: ${name.split('').join(', ')}. Here's a fun fact: ${fact}`;
    speak(text);
  }, [speak]);

  const hideFallback = useCallback(() => {
    setShowFallback(false);
    setFallbackText('');
  }, []);

  return {
    speak,
    speakItem,
    stop,
    isSpeaking,
    isSupported,
    error,
    fallbackText,
    showFallback,
    hideFallback
  };
}
