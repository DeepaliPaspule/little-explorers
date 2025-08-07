import { cn } from "@/lib/utils";
import type { Category } from "@shared/schema";
import { forwardRef } from "react";
import { accessibilityService } from "@/lib/accessibility";

interface CategoryButtonProps {
  category: Category;
  onClick: (category: Category) => void;
  onKeyDown?: (e: React.KeyboardEvent, category: Category) => void;
  className?: string;
}

export const CategoryButton = forwardRef<HTMLButtonElement, CategoryButtonProps>(({ 
  category, 
  onClick, 
  onKeyDown, 
  className 
}, ref) => {
  const handleClick = () => {
    // Trigger vibration feedback
    accessibilityService.vibrate('select');
    
    // Announce to screen reader with excitement
    accessibilityService.announceToScreenReader(`WOW! You picked ${category.name}! Get ready for amazing discoveries! ${category.description}`);
    
    onClick(category);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
    onKeyDown?.(e, category);
  };

  return (
    <button
      ref={ref}
      className={cn(
        "category-button bg-white dark:bg-gray-800 border-4 border-primary rounded-3xl p-8 shadow-xl",
        "focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-4",
        "hover:border-secondary hover:shadow-2xl hover:-translate-y-2 hover:bg-blue-50 dark:hover:bg-gray-700",
        "transition-all duration-300 ease-out",
        "active:translate-y-0 active:shadow-lg",
        "min-h-[200px] touch-manipulation",
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-describedby={`${category.id}-desc`}
      aria-label={`${category.name} category button. ${category.description}`}
      role="button"
    >
      <div className="text-8xl mb-4 floating-emoji" aria-hidden="true" role="img" aria-label={`${category.name} emoji`}>
        {category.emoji}
      </div>
      <h3 className="text-2xl font-bold text-primary dark:text-blue-400 mb-3">
        {category.name}
      </h3>
      <p 
        id={`${category.id}-desc`} 
        className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed"
      >
        {category.description}
      </p>
    </button>
  );
});

CategoryButton.displayName = "CategoryButton";
