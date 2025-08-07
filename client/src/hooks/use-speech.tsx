import { useState, useCallback, useEffect } from 'react';
import { speechService } from '@/lib/speech';

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsSupported(speechService.isSupported());
  }, []);

  const speak = useCallback((text: string) => {
    if (!isSupported) {
      setError('Speech synthesis not supported in this browser');
      return;
    }

    setIsSpeaking(true);
    setError(null);

    speechService.speak(
      text,
      () => {
        setIsSpeaking(false);
      },
      (error) => {
        setIsSpeaking(false);
        setError('Speech synthesis error occurred');
      }
    );
  }, [isSupported]);

  const stop = useCallback(() => {
    speechService.stop();
    setIsSpeaking(false);
  }, []);

  const speakItem = useCallback((name: string, fact: string) => {
    const text = `${name}. Let me spell that for you: ${name.split('').join(', ')}. Here's a fun fact: ${fact}`;
    speak(text);
  }, [speak]);

  return {
    speak,
    speakItem,
    stop,
    isSpeaking,
    isSupported,
    error
  };
}
