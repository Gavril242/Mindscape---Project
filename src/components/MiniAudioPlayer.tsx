
import { Volume2, VolumeX, Maximize2, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSound } from "@/components/SoundContext";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

interface MiniAudioPlayerProps {
  soundType: string;
  soundName: string;
  emoji: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onMaximize: () => void;
}

const MiniAudioPlayer = ({
  soundType,
  soundName,
  emoji,
  isPlaying,
  onTogglePlay,
  onMaximize
}: MiniAudioPlayerProps) => {
  const { 
    playWaterDrop, 
    playAmbientSound, 
    stopAmbientSound, 
    isAmbientSoundLoading,
    loadingProgress,
    currentAmbientSound
  } = useSound();
  
  const [showErrorHint, setShowErrorHint] = useState(false);
  
  useEffect(() => {
    // If this sound has been loading for more than 8 seconds, show error hint
    let timer: number | undefined;
    
    if (isAmbientSoundLoading && currentAmbientSound === soundType) {
      timer = window.setTimeout(() => {
        setShowErrorHint(true);
      }, 8000);
    } else {
      setShowErrorHint(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAmbientSoundLoading, currentAmbientSound, soundType]);
  
  const handleTogglePlay = () => {
    playWaterDrop();
    if (isPlaying) {
      stopAmbientSound();
    } else {
      playAmbientSound(soundType);
    }
    onTogglePlay();
  };
  
  return (
    <div className="fixed bottom-4 right-4 bg-background border rounded-full shadow-lg px-3 py-2 flex items-center gap-2 z-50 animate-fade-in hover:shadow-xl transition-all">
      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-sm">{emoji}</span>
      </div>
      
      <span className="text-sm font-medium">{soundName}</span>
      
      {isAmbientSoundLoading && currentAmbientSound === soundType ? (
        <div className="flex items-center gap-1">
          <LoaderCircle className="h-3 w-3 animate-spin" />
          <span className="text-xs">{loadingProgress}%</span>
        </div>
      ) : (
        <Button 
          variant="ghost" 
          size="icon"
          className="h-6 w-6 transition-transform hover:scale-110 active:scale-95" 
          onClick={handleTogglePlay}
          disabled={isAmbientSoundLoading}
        >
          {isPlaying ? (
            <Volume2 className="h-3 w-3" />
          ) : (
            <VolumeX className="h-3 w-3" />
          )}
        </Button>
      )}
      
      <Button 
        variant="ghost" 
        size="icon"
        className="h-6 w-6 transition-transform hover:scale-110 active:scale-95" 
        onClick={() => {
          playWaterDrop();
          onMaximize();
        }}
      >
        <Maximize2 className="h-3 w-3" />
      </Button>
      
      {showErrorHint && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-red-500 hover:text-red-600"
          onClick={() => toast.error("Sound loading issue", {
            description: "Try using the Audio Debugger to diagnose the problem",
            action: {
              label: "Debug",
              onClick: () => window.location.href = "/audio-debug"
            }
          })}
        >
          Issues?
        </Button>
      )}
    </div>
  );
};

export default MiniAudioPlayer;
