
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { useSound } from "@/components/SoundContext";
import BreatheAnimation from "@/components/AudioPlayer/BreatheAnimation";

const BreathingTab: React.FC = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const { playInhale } = useSound();
  
  const startBreathing = () => {
    setIsBreathing(true);
    playInhale();
  };
  
  const stopBreathing = () => {
    setIsBreathing(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Breathing Exercise</CardTitle>
        <CardDescription>Follow the animation to practice mindful breathing</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <BreatheAnimation 
          isActive={isBreathing}
          pattern={{
            inhaleTime: 4,
            holdInTime: 7,
            exhaleTime: 8,
            holdOutTime: 0
          }}
        />
        
        <div className="text-center space-y-2 mt-8">
          <p className="text-lg font-medium">4-7-8 Breathing</p>
          <p className="text-sm text-muted-foreground max-w-md">
            Inhale through your nose for 4 seconds, hold for 7 seconds, 
            then exhale through your mouth for 8 seconds.
          </p>
        </div>
        
        <div className="flex gap-4 mt-8">
          <Button variant="outline" disabled={isBreathing}>Change Pattern</Button>
          {isBreathing ? (
            <Button onClick={stopBreathing}>
              <Pause className="mr-2 h-4 w-4" /> Stop
            </Button>
          ) : (
            <Button onClick={startBreathing}>
              <Play className="mr-2 h-4 w-4" /> Begin
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BreathingTab;
