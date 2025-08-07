export class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isInitialized = false;

  constructor() {
    this.initializeSpeech();
  }

  private initializeSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isInitialized = true;
    }
  }

  speak(text: string, onEnd?: () => void, onError?: (error: any) => void): void {
    // Stop any current speech
    this.stop();

    if (!this.synth || !this.isInitialized) {
      console.warn('Speech synthesis not available');
      onError?.('Speech synthesis not available');
      return;
    }

    try {
      // Create utterance with simpler setup
      this.currentUtterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance.rate = 0.9;
      this.currentUtterance.pitch = 1.0;
      this.currentUtterance.volume = 1.0;
      this.currentUtterance.lang = 'en-US';

      // Set up event handlers
      this.currentUtterance.onend = () => {
        this.currentUtterance = null;
        onEnd?.();
      };

      this.currentUtterance.onstart = () => {
        console.log('Speech started:', text.substring(0, 50));
      };

      this.currentUtterance.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        this.currentUtterance = null;
        // Don't call onError to avoid showing error messages to user
        // Speech will just fail silently which is better UX
      };

      // Ensure speech synthesis is not paused
      if (this.synth.paused) {
        this.synth.resume();
      }

      // Speak the utterance
      this.synth.speak(this.currentUtterance);
      
      // Fallback: if speech doesn't start within 2 seconds, consider it failed
      setTimeout(() => {
        if (this.currentUtterance && !this.synth?.speaking) {
          console.warn('Speech failed to start, cleaning up');
          this.currentUtterance = null;
        }
      }, 2000);

    } catch (err) {
      console.error('Failed to create speech utterance:', err);
      onError?.('Failed to start speech synthesis');
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
    return this.isInitialized && 'speechSynthesis' in window;
  }
}

export const speechService = new SpeechService();
