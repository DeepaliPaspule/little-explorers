import { cn } from "@/lib/utils";

interface SpeechStatusProps {
  isVisible: boolean;
  text?: string;
}

export function SpeechStatus({ isVisible, text = "Speaking..." }: SpeechStatusProps) {
  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 transition-all duration-200",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
    )}>
      <div className="bg-primary text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span>{text}</span>
      </div>
    </div>
  );
}
