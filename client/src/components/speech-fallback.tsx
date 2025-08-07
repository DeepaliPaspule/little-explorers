import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Volume2, VolumeX } from "lucide-react";

interface SpeechFallbackProps {
  text: string;
  isVisible: boolean;
  onClose?: () => void;
}

export function SpeechFallback({ text, isVisible, onClose }: SpeechFallbackProps) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (isVisible && text) {
      setDisplayText(text);
      // Auto-hide after 12 seconds to give users time to read
      const timer = setTimeout(() => {
        onClose?.();
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, text, onClose]);

  if (!isVisible || !text) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center">
      <div className={cn(
        "bg-white border-2 border-primary rounded-lg shadow-lg p-4 max-w-md w-full",
        "transition-all duration-300 ease-in-out",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-primary mb-1">Learning Content:</h4>
            <p className="text-lg font-medium text-gray-800 leading-relaxed">
              {displayText}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:rounded p-1"
            aria-label="Close learning text"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}