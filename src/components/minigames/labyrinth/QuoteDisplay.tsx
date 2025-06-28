
import { Quote } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Heart, Lightbulb } from "lucide-react";

interface QuoteDisplayProps {
  quote: Quote;
  onClose: () => void;
}

export const QuoteDisplay = ({ quote, onClose }: QuoteDisplayProps) => {
  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            {quote.type === 'motivational' ? (
              <Heart className="w-5 h-5 text-pink-500" />
            ) : (
              <Lightbulb className="w-5 h-5 text-yellow-500" />
            )}
            {quote.type === 'motivational' ? 'Inspiration' : 'Hint'}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <blockquote className="text-base italic border-l-4 border-primary/30 pl-4">
          "{quote.text}"
        </blockquote>
        <div className="text-sm text-muted-foreground text-right">
          — {quote.author}
        </div>
      </CardContent>
    </Card>
  );
};
