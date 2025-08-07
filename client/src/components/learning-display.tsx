import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface LearningDisplayProps {
  isVisible: boolean;
  itemName: string;
  itemFact: string;
  itemEmoji: string;
  onClose?: () => void;
}

export function LearningDisplay({ 
  isVisible, 
  itemName, 
  itemFact, 
  itemEmoji, 
  onClose 
}: LearningDisplayProps) {
  const [spelling, setSpelling] = useState<string[]>([]);

  useEffect(() => {
    if (isVisible && itemName) {
      // Create spelling array with individual letters
      setSpelling(itemName.toUpperCase().split(''));
    }
  }, [isVisible, itemName]);

  if (!isVisible || !itemName) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className={cn(
        "bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4",
        "border-4 border-primary",
        "transition-all duration-300 ease-in-out",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        
        {/* Header */}
        <div className="bg-primary text-white p-6 rounded-t-xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:rounded p-1"
            aria-label="Close learning display"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <div className="text-6xl mb-2" aria-hidden="true">
              {itemEmoji}
            </div>
            <h2 className="text-2xl font-bold">
              {itemName}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Spelling Section */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              How to spell it:
            </h3>
            <div className="flex justify-center gap-2 flex-wrap">
              {spelling.map((letter, index) => (
                <div
                  key={index}
                  className="w-12 h-12 bg-accent text-accent-foreground rounded-lg flex items-center justify-center text-xl font-bold border-2 border-accent-foreground"
                  role="text"
                  aria-label={`Letter ${letter}`}
                >
                  {letter}
                </div>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {itemName.length} letters: {spelling.join(' - ')}
            </p>
          </div>

          {/* Fun Fact Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Fun Fact:
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {itemFact}
            </p>
          </div>

          {/* Close Button */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium"
            >
              Continue Learning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}