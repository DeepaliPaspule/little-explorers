export class SpeechService {
  private synth: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  speak(text: string, onEnd?: () => void, onError?: (error: any) => void): void {
    // Stop any current speech
    this.stop();

    if (!this.synth) {
      onError?.('Speech synthesis not available');
      return;
    }

    // Wait for voices to load
    const speakNow = () => {
      this.currentUtterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance.rate = 0.8; // Slightly slower for clarity
      this.currentUtterance.pitch = 1.1; // Slightly higher pitch for children
      this.currentUtterance.volume = 1;

      // Try to set a more child-friendly voice
      const voices = this.synth.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.includes('Female') || voice.name.includes('Google'))
      ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
      
      if (preferredVoice) {
        this.currentUtterance.voice = preferredVoice;
      }

      this.currentUtterance.onend = () => {
        this.currentUtterance = null;
        onEnd?.();
      };

      this.currentUtterance.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        // Try to provide more helpful error messages
        if (e.error === 'not-allowed') {
          onError?.('Speech not allowed. Please allow audio in your browser settings.');
        } else if (e.error === 'network') {
          onError?.('Network error. Check your internet connection.');
        } else {
          onError?.('Speech synthesis error occurred. Please try again.');
        }
        this.currentUtterance = null;
      };

      try {
        this.synth.speak(this.currentUtterance);
      } catch (err) {
        console.error('Failed to speak:', err);
        onError?.('Failed to start speech synthesis');
      }
    };

    // If voices aren't loaded yet, wait for them
    if (this.synth.getVoices().length === 0) {
      this.synth.addEventListener('voiceschanged', speakNow, { once: true });
      // Fallback timeout in case voiceschanged never fires
      setTimeout(speakNow, 1000);
    } else {
      speakNow();
    }
  }

  stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  isSpeaking(): boolean {
    return this.synth?.speaking || false;
  }

  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}

export const speechService = new SpeechService();
