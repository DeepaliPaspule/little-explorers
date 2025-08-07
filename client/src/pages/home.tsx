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
          'Welcome to Little Explorers! A fun learning app for kids. Discover amazing facts about fruits, vegetables, animals, letters, colors, shapes, numbers, and transportation. Use Tab to navigate and Enter to select.'
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
    
    accessibilityService.announceToScreenReader(`FANTASTIC! Welcome to the magical world of ${category.name}! Look at all these incredible things to discover!`);
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
    accessibilityService.vibrate('navigate');
    accessibilityService.announceToScreenReader('What an amazing discovery! Ready to explore more incredible things? Keep the adventure going!');
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
              Little Explorers
            </h1>
            <p className="text-xl md:text-2xl opacity-90" id="app-subtitle">
              Fun Learning Adventures
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
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              🎉 Welcome to the Fun Zone! 🎉
            </h3>
            <div className="space-y-4 text-xl">
              <p className="font-bold text-purple-700">Get ready for AWESOME discoveries!</p>
              <p className="font-semibold text-blue-600">Touch, explore, and learn AMAZING things about our world!</p>
              <div className="bg-yellow-200 rounded-full px-6 py-3 inline-block">
                <p className="text-lg font-bold text-purple-800">
                  {accessibilityService.isVibrationAvailable() 
                    ? "🎯 Touch anything and feel the magic buzz! 🎯"
                    : "🌟 Touch anything for incredible surprises! 🌟"
                  }
                </p>
              </div>
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
              <h2 id="categories-title" className="text-4xl font-black text-transparent bg-gradient-to-r from-rainbow-start via-rainbow-middle to-rainbow-end bg-clip-text mb-4">
                🌈 Choose Your Adventure! 🌈
              </h2>
              <p className="text-2xl font-bold text-purple-700 max-w-4xl mx-auto leading-relaxed mb-2">
                Every button is a doorway to INCREDIBLE discoveries!
              </p>
              <p className="text-lg text-blue-600 font-semibold">
                🎮 Touch, click, or use your keyboard to unlock the magic! 🎮
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
              <p className="text-xl font-bold text-purple-700 bg-yellow-200 rounded-full px-6 py-3 inline-block mb-4">
                🎯 Touch ANYTHING below for mind-blowing surprises! 🎯
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
            Where curiosity meets discovery - learning made fun for everyone!
          </p>
          <div className="text-gray-500 dark:text-gray-400 space-y-2">
            <p>Use your keyboard to navigate or touch to explore.</p>
            <p>Press Escape to go back to your adventure.</p>
            {accessibilityService.isVibrationAvailable() && (
              <p>Feel the buzz when you make discoveries on your device!</p>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
