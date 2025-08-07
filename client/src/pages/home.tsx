import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { CategoryButton } from "@/components/category-button";
import { ItemButton } from "@/components/item-button";
import { SpeechStatus } from "@/components/speech-status";
import { useSpeech } from "@/hooks/use-speech";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import type { Category, LearningItem } from "@shared/schema";

export default function HomePage() {
  const [currentView, setCurrentView] = useState<'categories' | 'items'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const { speak, speakItem, stop, isSpeaking, isSupported, error: speechError } = useSpeech();
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

  // Enable speech on first user interaction
  const enableSpeech = () => {
    if (isSupported && !speechEnabled) {
      setSpeechEnabled(true);
      speak('Welcome to Learn and Listen! An educational app for young learners. Use Tab to navigate between categories and Enter to select.');
    }
  };

  // Announce welcome message
  useEffect(() => {
    if (!categoriesLoading && isSupported && speechEnabled) {
      const timer = setTimeout(() => {
        speak('Welcome to Learn and Listen! An educational app for young learners. Use Tab to navigate between categories and Enter to select.');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [categoriesLoading, isSupported, speechEnabled, speak]);

  // Handle speech errors
  useEffect(() => {
    if (speechError) {
      toast({
        title: "Speech Error",
        description: speechError,
        variant: "destructive",
      });
    }
  }, [speechError, toast]);

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
        stop();
        if (currentView === 'items') {
          showCategories();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentView, stop]);

  const handleCategorySelect = (category: Category) => {
    if (!speechEnabled) enableSpeech();
    
    setSelectedCategory(category);
    setCurrentView('items');
    refetchItems();
    
    if (speechEnabled) {
      speak(`Now learning ${category.name}. Loading items, please wait.`);
    }
  };

  const handleItemSelect = (item: LearningItem) => {
    if (!speechEnabled) enableSpeech();
    
    if (speechEnabled) {
      speakItem(item.name, item.fact);
    }
  };

  const showCategories = () => {
    setCurrentView('categories');
    setSelectedCategory(null);
    if (speechEnabled) {
      speak('Back to categories. Choose a learning category to continue.');
    }
  };

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center max-w-md">
          <h2 className="text-xl font-semibold mb-2">Speech Not Supported</h2>
          <p className="mb-4">Your browser does not support speech synthesis. Please use a modern browser like Chrome, Firefox, or Safari for the full experience.</p>
          <p className="text-sm">If you're using a supported browser, try refreshing the page or checking your browser's audio settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded focus:outline-none focus:ring-4 focus:ring-accent"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="bg-primary text-white shadow-lg" role="banner">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-heading font-bold text-center" id="app-title">
            Learn & Listen
          </h1>
          <p className="text-lg text-center mt-2 opacity-90" id="app-subtitle">
            Educational Learning for Young Minds
          </p>
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
        {/* Speech Enable Instruction */}
        {isSupported && !speechEnabled && (
          <div className="bg-blue-100 border border-blue-400 text-blue-800 px-6 py-4 rounded-lg text-center mb-8">
            <h3 className="text-lg font-semibold mb-2">🔊 Enable Audio Learning</h3>
            <p className="mb-3">This app works best with sound! Click any category below to enable speech output and start learning.</p>
            <p className="text-sm">The app will speak the names of items and share fun facts about them.</p>
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
              <h2 id="categories-title" className="text-heading font-bold text-gray-800">
                Choose a Learning Category
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Select a category to start learning. Use Tab to navigate and Enter or Space to select. Each item will be spoken aloud when selected.
              </p>
            </div>

            <div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6" 
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
            <div className="text-center space-y-4">
              <h2 id="items-title" className="text-heading font-bold text-gray-800">
                Learning {selectedCategory.name}
              </h2>
              <Button
                onClick={showCategories}
                className="bg-secondary text-white hover:bg-green-700 focus:ring-4 focus:ring-accent"
                aria-label="Go back to categories"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Categories
              </Button>
            </div>

            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
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

      {/* Speech Status */}
      <SpeechStatus isVisible={isSpeaking} />

      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-100 mt-16 py-8" role="contentinfo">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-600">
            An accessible learning tool designed for blind and visually impaired children.
          </p>
          <p className="text-gray-500 mt-2">
            Use Tab to navigate, Enter or Space to select items.
          </p>
        </div>
      </footer>
    </div>
  );
}
