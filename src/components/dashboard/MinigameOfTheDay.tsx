
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Gamepad2, Star } from "lucide-react";

const minigames = [
  {
    name: "Mindful Match",
    description: "Memory game with emotional reflection",
    route: "/mindful-match",
    difficulty: "Easy",
    estimatedTime: "10-15 min"
  },
  {
    name: "Mindful Labyrinth",
    description: "Navigate through wisdom and inspiration",
    route: "/mindful-labyrinth",
    difficulty: "Medium",
    estimatedTime: "15-20 min"
  }
];

export const MinigameOfTheDay = () => {
  const navigate = useNavigate();
  const [featuredGame, setFeaturedGame] = useState(minigames[0]);

  useEffect(() => {
    // Rotate featured game based on day of week
    const dayIndex = new Date().getDay() % minigames.length;
    setFeaturedGame(minigames[dayIndex]);
  }, []);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Minigame of the Day
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{featuredGame.name}</h3>
            <Badge variant="outline">{featuredGame.difficulty}</Badge>
          </div>
          <p className="text-muted-foreground">{featuredGame.description}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Gamepad2 className="w-4 h-4" />
            <span>{featuredGame.estimatedTime}</span>
          </div>
        </div>
      </CardContent>
      <div className="px-6 pb-6">
        <Button 
          onClick={() => navigate(featuredGame.route)} 
          className="w-full"
        >
          Play Now
        </Button>
      </div>
    </Card>
  );
};
