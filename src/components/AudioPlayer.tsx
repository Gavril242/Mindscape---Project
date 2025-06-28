
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, Minimize2, LoaderCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { useSound } from "@/components/SoundContext";
import { toast } from "@/components/ui/sonner";

interface AudioPlayerProps {
  soundType: string;
  soundName: string;
  soundUrl: string;
  emoji: string;
  onMinimize: () => void;
}

interface SoundSetting {
  is_playing: boolean;
  volume: number;
}

const AudioPlayer = ({ soundType, soundName, soundUrl, emoji, onMinimize }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [hasError, setHasError] = useState(false);
  const { user } = useAuth();
  const { 
    playWaterDrop, 
    playAmbientSound, 
    stopAmbientSound, 
    setAmbientVolume, 
    isAmbientSoundLoading,
    currentAmbientSound,
    loadingProgress 
  } = useSound();

  useEffect(() => {
    setHasError(false);
    
    if (isPlaying) {
      playAmbientSound(soundType).catch((error) => {
        console.error(`Failed to play ${soundType}:`, error);
        setHasError(true);
        setIsPlaying(false);
        toast.error(`Failed to load ${soundName}`, {
          description: "The audio file might be too large or corrupted",
          action: {
            label: "Try Debug",
            onClick: () => window.location.href = "/audio-debug"
          }
        });
      });
      setAmbientVolume(volume);
    } else {
      stopAmbientSound();
    }
    
    // If user is logged in, save preferences
    if (user) {
      saveUserSoundPreferences();
    }
  }, [isPlaying]);

  // Handle volume changes separately to avoid reloading the sound
  useEffect(() => {
    if (isPlaying) {
      setAmbientVolume(volume);
    }
    
    // Save preferences when volume changes
    if (user && isPlaying) {
      saveUserSoundPreferences();
    }
  }, [volume]);

  useEffect(() => {
    // Load user preferences when component mounts
    if (user) {
      loadUserSoundPreferences();
    }
    
    return () => {
      if (isPlaying) {
        stopAmbientSound();
      }
    };
  }, [user]);

  // Keep local playing state in sync with context state
  useEffect(() => {
    if (currentAmbientSound !== soundType && isPlaying) {
      setIsPlaying(false);
    } else if (currentAmbientSound === soundType && !isPlaying) {
      setIsPlaying(true);
    }
  }, [currentAmbientSound, soundType]);

  const togglePlayPause = () => {
    playWaterDrop();
    setHasError(false);
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (newValue: number[]) => {
    setVolume(newValue[0]);
    setAmbientVolume(newValue[0]);
  };
  
  const loadUserSoundPreferences = async () => {
    try {
      // Use localStorage as a temporary solution until Supabase types are updated
      const savedSettings = localStorage.getItem(`sound_settings_${user!.id}_${soundType}`);
      
      if (savedSettings) {
        const settings = JSON.parse(savedSettings) as SoundSetting;
        setIsPlaying(settings.is_playing);
        setVolume(settings.volume);
      }
    } catch (error) {
      console.error("Error loading sound preferences:", error);
    }
  };
  
  const saveUserSoundPreferences = async () => {
    try {
      // Use localStorage as a temporary solution until Supabase types are updated
      localStorage.setItem(`sound_settings_${user!.id}_${soundType}`, JSON.stringify({
        is_playing: isPlaying,
        volume: volume
      }));
      
    } catch (error) {
      console.error("Error saving sound preferences:", error);
    }
  };

  return (
    <Card className="p-2 shadow-md">
      <CardContent className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-lg">{emoji}</span>
            </div>
            <span className="font-medium">{soundName}</span>
            {hasError && (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={togglePlayPause}
              className="h-8 w-8 transition-transform hover:scale-110 active:scale-95"
              disabled={isAmbientSoundLoading}
            >
              {isAmbientSoundLoading ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : isPlaying ? (
                <VolumeX className="h-4 w-4" /> 
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            
            <div className="w-24">
              <Slider 
                value={[volume]} 
                onValueChange={handleVolumeChange} 
                max={100} 
                step={1} 
                disabled={isAmbientSoundLoading}
              />
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                playWaterDrop();
                onMinimize();
              }}
              className="h-8 w-8 transition-transform hover:scale-110 active:scale-95"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {isAmbientSoundLoading && currentAmbientSound === soundType && (
          <div className="mt-2">
            <Progress value={loadingProgress} className="h-1" />
            <p className="text-xs text-muted-foreground text-right mt-1">
              Loading... {loadingProgress}% 
              {loadingProgress > 25 && " (Starting soon...)"}
            </p>
          </div>
        )}
        
        {hasError && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            Failed to load audio. Try the Audio Debugger to diagnose the issue.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioPlayer;
