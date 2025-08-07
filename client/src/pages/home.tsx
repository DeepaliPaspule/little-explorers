import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { CategoryButton } from "@/components/category-button";
import { ItemButton } from "@/components/item-button";
import { LearningDisplay } from "@/components/learning-display";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Vibrate } from "lucide-react";
import { accessibilityService } from "@/lib/accessibility";
import type { Category, LearningItem } from "@shared/schema";

export default function HomePage() {
  const [currentView, setCurrentView] = useState<'categories' | 'items'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedItem, setSelectedItem] = useState<LearningItem | null>(null);
  const [showLearningDisplay, setShowLearningDisplay] = useState(false);
  const { toast } = useToast();
  const firstItemRef = useRef<HTMLButtonElement>(null);
  const firstCategoryRef = useRef<HTMLButtonElement>(null);

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Fetch items for selected category
  const { 
    data: items = [], 
    isLoading: itemsLoading,
    refetch: refetchItems 
  } = useQuery<LearningItem[]>({
    queryKey: ['/api/learning-items', selectedCategory?.id],
    enabled: !!selectedCategory?.id,
  });

  // Welcome announcement for screen readers
  useEffect(() => {
    if (!categoriesLoading) {
      const timer = setTimeout(() => {
        accessibilityService.announceToScreenReader(
          'Welcome to Learn and Listen! An accessible educational app. Navigate through categories to learn about fruits, vegetables, animals, and letters. Use Tab to navigate and Enter to select.'
        );
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [categoriesLoading]);

  // Focus management
  useEffect(() => {
    if (currentView === 'items' && !itemsLoading && firstItemRef.current) {
      firstItemRef.current.focus();
    } else if (currentView === 'categories' && !categoriesLoading && firstCategoryRef.current) {
      firstCategoryRef.current.focus();
    }
  }, [currentView, itemsLoading, categoriesLoading]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showLearningDisplay) {
          setShowLearningDisplay(false);
          setSelectedItem(null);
        } else if (currentView === 'items') {
          showCategories();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentView, showLearningDisplay]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setCurrentView('items');
    refetchItems();
    
    accessibilityService.announceToScreenReader(`Now viewing ${category.name}. ${category.description}`);
  };

  const handleItemSelect = (item: LearningItem) => {
    setSelectedItem(item);
    setShowLearningDisplay(true);
  };

  const showCategories = () => {
    setCurrentView('categories');
    setSelectedCategory(null);
    accessibilityService.vibrate('navigate');
    accessibilityService.announceToScreenReader('Returned to categories. Choose a learning category to continue.');
  };

  const closeLearningDisplay = () => {
    setShowLearningDisplay(false);
    setSelectedItem(null);
    accessibilityService.announceToScreenReader('Closed learning display. Continue exploring items.');
  };



  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      {/* Skip to main content */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded focus:outline-none focus:ring-4 focus:ring-accent z-50"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="bg-primary dark:bg-blue-800 text-white shadow-lg" role="banner">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold" id="app-title">
              Learn & Listen
            </h1>
            <p className="text-xl md:text-2xl opacity-90" id="app-subtitle">
              Accessible Learning for Everyone
            </p>
            {accessibilityService.isVibrationAvailable() && (
              <div className="flex items-center justify-center gap-2 text-sm opacity-80">
                <Vibrate className="w-4 h-4" />
                <span>Vibration feedback enabled</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation breadcrumbs */}
      <nav aria-label="Navigation breadcrumb" className="bg-white border-b-2 border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-lg" role="list">
            <li role="listitem">
              <Button
                variant="ghost"
                onClick={showCategories}
                className="text-primary font-medium p-2 focus:ring-4 focus:ring-accent"
                aria-current={currentView === 'categories' ? 'page' : undefined}
              >
                <Home className="w-5 h-5 mr-2" />
                Home
              </Button>
            </li>
            {selectedCategory && (
              <li role="listitem" className="flex items-center">
                <span className="text-gray-400 mx-2">→</span>
                <Button
                  variant="ghost"
                  className="text-primary font-medium p-2 focus:ring-4 focus:ring-accent"
                  aria-current="page"
                >
                  {selectedCategory.name}
                </Button>
              </li>
            )}
          </ol>
        </div>
      </nav>

      <main id="main-content" className="max-w-6xl mx-auto px-4 py-8" role="main">
        {/* Welcome Instructions */}
        {currentView === 'categories' && (
          <div className="bg-blue-100 dark:bg-blue-900 border border-blue-400 dark:border-blue-600 text-blue-800 dark:text-blue-200 px-6 py-6 rounded-2xl text-center mb-8">
            <h3 className="text-2xl font-semibold mb-3">Welcome to Accessible Learning</h3>
            <div className="space-y-3 text-lg">
              <p>Choose a category below to start exploring educational content.</p>
              <p>Each item shows clear spelling, emojis, and interesting facts.</p>
              <p className="text-base opacity-80">
                {accessibilityService.isVibrationAvailable() 
                  ? "Tap items for vibration feedback and detailed learning displays."
                  : "Tap items to see detailed learning displays with spelling and facts."
                }
              </p>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {(categoriesLoading || itemsLoading) && (
          <div className="text-center py-8">
            <div className="bg-primary text-white px-6 py-3 rounded-lg text-lg font-medium inline-block animate-pulse">
              Loading... Please wait
            </div>
          </div>
        )}

        {/* Categories View */}
        {currentView === 'categories' && !categoriesLoading && (
          <section className="space-y-8" role="region" aria-labelledby="categories-title">
            <div className="text-center space-y-4">
              <h2 id="categories-title" className="text-3xl font-bold text-gray-800 dark:text-white">
                Choose a Learning Category
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Select a category to start learning. Use Tab to navigate and Enter or Space to select. 
                Each item shows clear visual information and provides tactile feedback.
              </p>
            </div>

            <div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8" 
              role="group" 
              aria-labelledby="categories-title"
            >
              {categories.map((category: Category, index: number) => (
                <CategoryButton
                  key={category.id}
                  category={category}
                  onClick={handleCategorySelect}
                  ref={index === 0 ? firstCategoryRef : undefined}
                />
              ))}
            </div>
          </section>
        )}

        {/* Items View */}
        {currentView === 'items' && selectedCategory && !itemsLoading && (
          <section className="space-y-8" role="region" aria-labelledby="items-title">
            <div className="text-center space-y-6">
              <h2 id="items-title" className="text-3xl font-bold text-gray-800 dark:text-white">
                Learning {selectedCategory.name}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Tap any item below to see its spelling and learn interesting facts!
              </p>
              <Button
                onClick={showCategories}
                className="bg-secondary text-white hover:bg-green-700 focus:ring-4 focus:ring-accent text-lg px-6 py-3"
                aria-label="Go back to categories"
              >
                <ArrowLeft className="w-6 h-6 mr-2" />
                Back to Categories
              </Button>
            </div>

            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
              role="group"
              aria-label={`${selectedCategory.name} learning items`}
            >
              {items.map((item: LearningItem, index: number) => (
                <ItemButton
                  key={item.id}
                  item={item}
                  index={index}
                  onClick={handleItemSelect}
                  ref={index === 0 ? firstItemRef : undefined}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Learning Display Modal */}
      {selectedItem && (
        <LearningDisplay
          isVisible={showLearningDisplay}
          itemName={selectedItem.name}
          itemFact={selectedItem.fact}
          itemEmoji={selectedItem.emoji}
          onClose={closeLearningDisplay}
        />
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t-2 border-gray-100 dark:border-gray-700 mt-16 py-8" role="contentinfo">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            An accessible learning tool designed for all learners.
          </p>
          <div className="text-gray-500 dark:text-gray-400 space-y-2">
            <p>Use Tab to navigate, Enter or Space to select items.</p>
            <p>Press Escape to go back or close displays.</p>
            {accessibilityService.isVibrationAvailable() && (
              <p>Vibration feedback provides tactile confirmation on supported devices.</p>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
