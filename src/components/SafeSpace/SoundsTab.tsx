
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSound } from "@/components/SoundContext";
import AudioPlayer from "@/components/AudioPlayer";
import { LoaderCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";

interface SoundOption {
  type: string;
  name: string;
  url: string;
  emoji: string;
}

interface SoundsTabProps {
  onActivateSound: (sound: SoundOption, play: boolean) => void;
  activeSound: string | null;
  miniPlayerVisible: boolean;
}

const SoundsTab: React.FC<SoundsTabProps> = ({ 
  onActivateSound, 
  activeSound, 
  miniPlayerVisible 
}) => {
  const { 
    playWaterDrop, 
    isAmbientSoundLoading,
    currentAmbientSound,
    loadingProgress,
    preloadAmbientSounds
  } = useSound();
  
  // Preload sounds when the tab is opened
  useEffect(() => {
    const preloadSounds = async () => {
      try {
        await preloadAmbientSounds();
        console.log("Ambient sounds preloaded successfully");
      } catch (error) {
        console.error("Error preloading ambient sounds:", error);
        toast.error("Failed to preload some ambient sounds", {
          description: "Some sounds may take longer to start playing"
        });
      }
    };
    
    preloadSounds();
  }, [preloadAmbientSounds]);
  
  // Sound options
  const soundOptions: SoundOption[] = [
    { type: 'rain', name: 'Rain', url: '/sounds/rain.mp3', emoji: '🌧️' },
    { type: 'ocean', name: 'Ocean', url: '/sounds/ocean.mp3', emoji: '🌊' },
    { type: 'fireplace', name: 'Fireplace', url: '/sounds/fireplace.mp3', emoji: '🔥' },
    { type: 'forest', name: 'Forest', url: '/sounds/forest.mp3', emoji: '🌳' }
  ];
  
  const getActiveSound = () => {
    return soundOptions.find(s => s.type === activeSound);
  };
  
  const toggleMiniPlayer = () => {
    const sound = getActiveSound();
    if (sound) {
      onActivateSound(sound, true);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ambient Sounds</CardTitle>
        <CardDescription>Calming sounds to enhance your experience</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {soundOptions.map((sound) => (
            <div 
              key={sound.type}
              className={`border rounded-lg p-4 flex flex-col items-center justify-center aspect-square cursor-pointer ${
                activeSound === sound.type ? 'bg-muted border-primary' : 'hover:bg-muted'
              }`}
              onClick={() => {
                playWaterDrop();
                onActivateSound(sound, true);
              }}
            >
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                {isAmbientSoundLoading && currentAmbientSound === sound.type ? (
                  <LoaderCircle className="animate-spin text-2xl" />
                ) : (
                  <span className="text-2xl">{sound.emoji}</span>
                )}
              </div>
              <p className="font-medium">{sound.name}</p>
              {isAmbientSoundLoading && currentAmbientSound === sound.type && (
                <div className="w-full mt-2">
                  <Progress value={loadingProgress} className="h-1" />
                  <p className="text-xs text-muted-foreground mt-1">Loading... {loadingProgress}%</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {activeSound && getActiveSound() && !miniPlayerVisible && (
          <div className="mt-6">
            <AudioPlayer
              soundType={activeSound}
              soundName={getActiveSound()!.name}
              soundUrl={getActiveSound()!.url}
              emoji={getActiveSound()!.emoji}
              onMinimize={toggleMiniPlayer}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SoundsTab;
