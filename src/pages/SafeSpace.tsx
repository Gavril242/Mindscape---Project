
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Sun, Moon, Music, Clock } from "lucide-react";
import MiniAudioPlayer from "@/components/MiniAudioPlayer";
import { useSound } from "@/components/SoundContext";

// Import refactored components
import JournalTab from "@/components/SafeSpace/JournalTab";
import MeditationTab from "@/components/SafeSpace/MeditationTab";
import SoundsTab from "@/components/SafeSpace/SoundsTab";
import AudioControlPanel from "@/components/SafeSpace/AudioControlPanel";
import BreathingTab from "@/components/SafeSpace/BreathingTab";
import TimerTab from "@/components/SafeSpace/TimerTab";

interface SoundOption {
  type: string;
  name: string;
  url: string;
  emoji: string;
}

const SafeSpace = () => {
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [miniPlayerVisible, setMiniPlayerVisible] = useState(false);
  const [activeSoundPlaying, setActiveSoundPlaying] = useState(false);
  
  const { playWaterDrop, playAmbientSound, stopAmbientSound } = useSound();
  
  const handleEntryCreated = () => {
    setRefreshCounter(prev => prev + 1);
  };
  
  // Sound options
  const soundOptions = [
    { type: 'rain', name: 'Rain', url: '/sounds/rain.mp3', emoji: '🌧️' },
    { type: 'ocean', name: 'Ocean', url: '/sounds/ocean.mp3', emoji: '🌊' },
    { type: 'fireplace', name: 'Fireplace', url: '/sounds/fireplace.mp3', emoji: '🔥' },
    { type: 'forest', name: 'Forest', url: '/sounds/forest.mp3', emoji: '🌳' }
  ];
  
  const getActiveSound = () => {
    return soundOptions.find(s => s.type === activeSound);
  };
  
  const toggleMiniPlayer = () => {
    setMiniPlayerVisible(!miniPlayerVisible);
  };
  
  const toggleSoundPlaying = () => {
    setActiveSoundPlaying(!activeSoundPlaying);
    if (!activeSoundPlaying && activeSound) {
      playAmbientSound(activeSound);
    } else {
      stopAmbientSound();
    }
  };

  // Handle sound activation
  const handleActivateSound = (sound: SoundOption, play: boolean) => {
    setActiveSound(sound.type);
    setMiniPlayerVisible(true);
    setActiveSoundPlaying(play);
    
    if (play) {
      playAmbientSound(sound.type);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Safe Space</h1>
        <p className="text-muted-foreground">Your personal sanctuary for reflection and relaxation.</p>
      </div>
      
      <Tabs defaultValue="journal" className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-4">
          <TabsTrigger value="journal">
            <MessageCircle className="h-4 w-4 mr-2" /> Journal
          </TabsTrigger>
          <TabsTrigger value="meditation">
            <Sun className="h-4 w-4 mr-2" /> Meditate
          </TabsTrigger>
          <TabsTrigger value="sounds">
            <Music className="h-4 w-4 mr-2" /> Sounds
          </TabsTrigger>
          <TabsTrigger value="breathing">
            <Moon className="h-4 w-4 mr-2" /> Breathe
          </TabsTrigger>
          <TabsTrigger value="timer">
            <Clock className="h-4 w-4 mr-2" /> Timer
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="journal" className="space-y-4">
          <JournalTab 
            refreshCounter={refreshCounter} 
            onEntryCreated={handleEntryCreated} 
          />
        </TabsContent>
        
        <TabsContent value="meditation" className="space-y-4">
          <MeditationTab />
        </TabsContent>
        
        <TabsContent value="sounds" className="space-y-4">
          <SoundsTab 
            onActivateSound={handleActivateSound}
            activeSound={activeSound}
            miniPlayerVisible={miniPlayerVisible}
          />
          <AudioControlPanel />
        </TabsContent>
        
        <TabsContent value="breathing">
          <BreathingTab />
        </TabsContent>
        
        <TabsContent value="timer">
          <TimerTab />
        </TabsContent>
      </Tabs>
      
      {activeSound && getActiveSound() && miniPlayerVisible && (
        <MiniAudioPlayer 
          soundType={activeSound}
          soundName={getActiveSound()!.name}
          emoji={getActiveSound()!.emoji}
          isPlaying={activeSoundPlaying}
          onTogglePlay={toggleSoundPlaying}
          onMaximize={toggleMiniPlayer}
        />
      )}
    </div>
  );
};

export default SafeSpace;
