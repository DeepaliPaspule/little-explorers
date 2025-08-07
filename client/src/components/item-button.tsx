import { cn } from "@/lib/utils";
import type { LearningItem } from "@shared/schema";
import { forwardRef } from "react";

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
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(item);
    }
    onKeyDown?.(e, item);
  };

  return (
    <button
      ref={ref}
      className={cn(
        "item-button bg-surface border-2 border-gray-200 rounded-xl p-6 shadow-md",
        "focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-2",
        "hover:border-primary hover:bg-gray-50",
        "transition-all duration-200 ease-in-out",
        "min-h-[160px] w-full",
        className
      )}
      onClick={() => onClick(item)}
      onKeyDown={handleKeyDown}
      aria-describedby={`item-desc-${index}`}
      role="button"
    >
      <div className="text-5xl mb-3" aria-hidden="true">
        {item.emoji}
      </div>
      <h3 className="text-button font-semibold text-gray-800 mb-2">
        {item.name}
      </h3>
      <p 
        id={`item-desc-${index}`} 
        className="text-gray-600 text-sm"
      >
        Press to learn more about {item.name}
      </p>
    </button>
  );
});

ItemButton.displayName = "ItemButton";
