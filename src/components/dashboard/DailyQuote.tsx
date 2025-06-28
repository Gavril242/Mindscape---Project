
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Quote } from "lucide-react";

const quotes = [
  {
    text: "The present moment is the only time over which we have dominion.",
    author: "Thích Nhất Hạnh"
  },
  {
    text: "Mindfulness is about being fully awake in our lives.",
    author: "Jon Kabat-Zinn"
  },
  {
    text: "Peace comes from within. Do not seek it without.",
    author: "Buddha"
  },
  {
    text: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius"
  },
  {
    text: "The mind is everything. What you think you become.",
    author: "Buddha"
  },
  {
    text: "Wherever you are, be there totally.",
    author: "Eckhart Tolle"
  },
  {
    text: "Mindfulness is the miracle by which we master and restore ourselves.",
    author: "Thích Nhất Hạnh"
  }
];

export const DailyQuote = () => {
  const [dailyQuote, setDailyQuote] = useState(quotes[0]);

  useEffect(() => {
    // Get quote based on day of year to ensure same quote per day
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const quoteIndex = dayOfYear % quotes.length;
    setDailyQuote(quotes[quoteIndex]);
  }, []);

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
          <Quote className="w-5 h-5 text-primary" />
          Quote of the Day
        </CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote className="text-base italic border-l-4 border-primary/30 pl-4 mb-3 text-card-foreground">
          "{dailyQuote.text}"
        </blockquote>
        <div className="text-sm text-muted-foreground text-right">
          — {dailyQuote.author}
        </div>
      </CardContent>
    </Card>
  );
};
