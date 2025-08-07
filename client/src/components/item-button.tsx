import { cn } from "@/lib/utils";
import type { LearningItem } from "@shared/schema";
import { forwardRef } from "react";
import { accessibilityService } from "@/lib/accessibility";

interface ItemButtonProps {
  item: LearningItem;
  index: number;
  onClick: (item: LearningItem) => void;
  onKeyDown?: (e: React.KeyboardEvent, item: LearningItem) => void;
  className?: string;
}

export const ItemButton = forwardRef<HTMLButtonElement, ItemButtonProps>(({ 
  item, 
  index, 
  onClick, 
  onKeyDown, 
  className 
}, ref) => {
  const handleClick = () => {
    // Trigger vibration feedback
    accessibilityService.vibrate('select');
    
    // Announce to screen reader
    accessibilityService.announceToScreenReader(`Learning about ${item.name}. Opening detailed information.`);
    
    onClick(item);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
    onKeyDown?.(e, item);
  };

  return (
    <button
      ref={ref}
      className={cn(
        "item-button bg-white dark:bg-gray-800 border-3 border-gray-300 dark:border-gray-600 rounded-2xl p-6 shadow-lg",
        "focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-2",
        "hover:border-primary hover:bg-blue-50 dark:hover:bg-gray-700 hover:shadow-xl hover:-translate-y-1",
        "transition-all duration-200 ease-in-out",
        "min-h-[180px] w-full touch-manipulation",
        "active:translate-y-0",
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-describedby={`item-desc-${index}`}
      aria-label={`Learn about ${item.name}. Click to see spelling and fun facts.`}
      role="button"
    >
      <div className="text-6xl mb-4" aria-hidden="true" role="img" aria-label={`${item.name} emoji`}>
        {item.emoji}
      </div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
        {item.name}
      </h3>
      <p 
        id={`item-desc-${index}`} 
        className="text-gray-600 dark:text-gray-300 text-base"
      >
        Tap to learn spelling and facts
      </p>
    </button>
  );
});

ItemButton.displayName = "ItemButton";
