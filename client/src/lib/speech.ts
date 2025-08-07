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

    this.currentUtterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance.rate = 0.8; // Slightly slower for clarity
    this.currentUtterance.pitch = 1.1; // Slightly higher pitch for children
    this.currentUtterance.volume = 1;

    this.currentUtterance.onend = () => {
      this.currentUtterance = null;
      onEnd?.();
    };

    this.currentUtterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      onError?.(e);
      this.currentUtterance = null;
    };

    this.synth.speak(this.currentUtterance);
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
