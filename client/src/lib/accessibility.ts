// Accessibility helper functions for vibration and enhanced feedback

export class AccessibilityService {
  private isVibrationSupported: boolean;

  constructor() {
    this.isVibrationSupported = 'navigator' in window && 'vibrate' in navigator;
  }

  // Vibration patterns for different types of interactions
  vibrate(pattern: 'select' | 'navigate' | 'success' | 'error' = 'select'): void {
    if (!this.isVibrationSupported) return;

    const patterns = {
      select: [100], // Short single vibration for item selection
      navigate: [50, 50, 50], // Triple short vibration for navigation
      success: [200, 100, 200], // Success pattern
      error: [300, 100, 300, 100, 300] // Error pattern
    };

    try {
      navigator.vibrate(patterns[pattern]);
    } catch (error) {
      console.warn('Vibration not available:', error);
    }
  }

  // Check if vibration is supported
  isVibrationAvailable(): boolean {
    return this.isVibrationSupported;
  }

  // Announce text to screen readers
  announceToScreenReader(text: string): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = text;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Focus management helper
  setFocusWithAnnouncement(element: HTMLElement, announcement?: string): void {
    if (announcement) {
      this.announceToScreenReader(announcement);
    }
    
    // Delay focus slightly to ensure screen reader announcement
    setTimeout(() => {
      element.focus();
    }, 100);
  }
}

export const accessibilityService = new AccessibilityService();