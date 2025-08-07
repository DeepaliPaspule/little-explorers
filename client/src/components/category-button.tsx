import { cn } from "@/lib/utils";
import type { Category } from "@shared/schema";

interface CategoryButtonProps {
  category: Category;
  onClick: (category: Category) => void;
  onKeyDown?: (e: React.KeyboardEvent, category: Category) => void;
  className?: string;
}

export function CategoryButton({ 
  category, 
  onClick, 
  onKeyDown, 
  className 
}: CategoryButtonProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(category);
    }
    onKeyDown?.(e, category);
  };

  return (
    <button
      className={cn(
        "category-button bg-surface border-2 border-primary rounded-2xl p-8 shadow-lg",
        "focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-2",
        "hover:border-secondary hover:shadow-xl hover:-translate-y-1",
        "transition-all duration-200 ease-in-out",
        "active:translate-y-0",
        className
      )}
      onClick={() => onClick(category)}
      onKeyDown={handleKeyDown}
      aria-describedby={`${category.id}-desc`}
      role="button"
    >
      <div className="text-6xl mb-4" aria-hidden="true">
        {category.emoji}
      </div>
      <h3 className="text-button font-semibold text-primary mb-2">
        {category.name}
      </h3>
      <p 
        id={`${category.id}-desc`} 
        className="text-gray-600"
      >
        {category.description}
      </p>
    </button>
  );
}
