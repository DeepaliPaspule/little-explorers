import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { X, Sparkles, Star } from "lucide-react";

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
  const [showCelebration, setShowCelebration] = useState(false);
  const [animateLetters, setAnimateLetters] = useState(false);

  useEffect(() => {
    if (isVisible && itemName) {
      // Create spelling array with individual letters
      setSpelling(itemName.toUpperCase().split(''));
      
      // Trigger celebration animation
      setTimeout(() => setShowCelebration(true), 300);
      setTimeout(() => setAnimateLetters(true), 600);
      
      // Reset animations when closing
      return () => {
        setShowCelebration(false);
        setAnimateLetters(false);
      };
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
        <div className={cn(
          "bg-gradient-to-br from-primary via-blue-500 to-purple-600 text-white p-6 rounded-t-xl relative overflow-hidden",
          showCelebration && "celebration"
        )}>
          {/* Floating sparkles */}
          <div className="absolute top-2 left-4 text-yellow-300 animate-pulse">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="absolute top-4 right-12 text-yellow-200 animate-bounce">
            <Star className="w-3 h-3" />
          </div>
          <div className="absolute bottom-2 left-8 text-pink-300 animate-ping">
            <Star className="w-2 h-2" />
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:rounded p-1 transition-all duration-200 hover:scale-110"
            aria-label="Close learning display"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <div className="text-8xl mb-3 floating-emoji transform transition-all duration-500 hover:scale-125" aria-hidden="true">
              {itemEmoji}
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              {itemName}
            </h2>
            <div className="text-yellow-300 text-sm mt-2 animate-pulse">
              ⭐ Amazing Discovery! ⭐
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Spelling Section */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-purple-700 mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Let's spell it together!
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </h3>
            <div className="flex justify-center gap-3 flex-wrap">
              {spelling.map((letter, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-14 h-14 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 text-white rounded-xl flex items-center justify-center text-2xl font-black border-3 border-purple-500 shadow-lg transform transition-all duration-300",
                    animateLetters && "animate-bounce hover:scale-125 hover:rotate-12"
                  )}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    boxShadow: '0 8px 15px rgba(0,0,0,0.2), inset 0 2px 5px rgba(255,255,255,0.3)'
                  }}
                  role="text"
                  aria-label={`Letter ${letter}`}
                >
                  {letter}
                </div>
              ))}
            </div>
            <p className="mt-4 text-lg font-semibold text-purple-600 bg-yellow-100 rounded-full px-4 py-2 inline-block">
              🎉 {itemName.length} magical letters: {spelling.join(' ⭐ ')} 🎉
            </p>
          </div>

          {/* Fun Fact Section */}
          <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-2xl p-6 border-3 border-dashed border-rainbow shadow-lg">
            <h3 className="text-xl font-bold text-purple-700 mb-3 flex items-center justify-center gap-2">
              🤯 Mind-Blowing Fact Alert! 🤯
            </h3>
            <div className="bg-white rounded-xl p-4 border-2 border-purple-300 shadow-inner">
              <p className="text-gray-800 leading-relaxed text-lg font-medium">
                💡 {itemFact}
              </p>
            </div>
            <div className="text-center mt-3">
              <span className="text-2xl animate-bounce">🤩</span>
              <span className="text-sm text-purple-600 font-semibold ml-2">Isn't that AMAZING?!</span>
              <span className="text-2xl animate-bounce ml-2">🤩</span>
            </div>
          </div>

          {/* Close Button */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white px-8 py-4 rounded-full hover:from-purple-600 hover:via-blue-500 hover:to-green-400 focus:outline-none focus:ring-4 focus:ring-rainbow font-bold text-lg transform transition-all duration-300 hover:scale-110 hover:rotate-3 shadow-xl"
            >
              🚀 Keep Exploring! 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}