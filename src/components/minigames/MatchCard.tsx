
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { EmotionCard } from "./types";

interface MatchCardProps {
  card: EmotionCard;
  onClick: () => void;
}

const MatchCard = ({ card, onClick }: MatchCardProps) => {
  const [isFlipping, setIsFlipping] = useState(false);
  
  // Add animation state when card is flipped
  useEffect(() => {
    if (card.isFlipped) {
      setIsFlipping(true);
      const timer = setTimeout(() => setIsFlipping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [card.isFlipped]);
  
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative h-24 md:h-28 lg:h-32 cursor-pointer transition-all duration-300 transform perspective-1000",
        isFlipping && "scale-105",
        card.isMatched && "opacity-80"
      )}
    >
      <div
        className={cn(
          "absolute w-full h-full rounded-lg shadow-md transition-all duration-300 transform backface-visibility-hidden flex items-center justify-center",
          card.isFlipped ? "rotate-y-180 opacity-0" : "rotate-y-0 opacity-100 bg-primary/10 hover:bg-primary/20"
        )}
      >
        <span className="text-2xl">?</span>
      </div>
      
      <div
        className={cn(
          "absolute w-full h-full rounded-lg shadow-md transition-all duration-300 transform backface-visibility-hidden flex flex-col items-center justify-center",
          card.isFlipped ? "rotate-y-0 opacity-100" : "rotate-y-180 opacity-0",
          card.color,
          card.isMatched && "animate-pulse-light"
        )}
      >
        <span className="text-4xl mb-1">{card.emoji}</span>
        <span className="text-sm font-medium">{card.name}</span>
      </div>
    </div>
  );
};

export default MatchCard;
