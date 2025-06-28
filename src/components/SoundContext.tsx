import { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";

interface SoundContextType {
  playWaterDrop: () => void;
  playInhale: () => void;
  playExhale: () => void;
  playAmbientSound: (soundType: string) => void;
  stopAmbientSound: () => void;
  setAmbientVolume: (volume: number) => void;
  isAmbientSoundLoading: boolean;
  currentAmbientSound: string | null;
  loadingProgress: number;
  preloadAmbientSounds: () => Promise<void>;
  showMiniPlayer: boolean;
  setShowMiniPlayer: (show: boolean) => void;
}

// Map of sound types to their file information
interface SoundFile {
  mp3Path: string;
  oggPath: string;
  duration: number; // in seconds
  size: string;     // human readable size
}

// Sound files metadata for better management
const SOUND_FILES: Record<string, SoundFile> = {
  rain: {
    mp3Path: '/sounds/rain.mp3', 
    oggPath: '/sounds/rain.ogg',
    duration: 600, // 10 minutes
    size: '8-10MB'
  },
  ocean: { 
    mp3Path: '/sounds/ocean.mp3',
    oggPath: '/sounds/ocean.ogg',
    duration: 600, // 10 minutes
    size: '8-10MB'
  },
  fireplace: { 
    mp3Path: '/sounds/fireplace.mp3',
    oggPath: '/sounds/fireplace.ogg',
    duration: 600, // 10 minutes
    size: '8-10MB'
  },
  forest: { 
    mp3Path: '/sounds/forest.mp3',
    oggPath: '/sounds/forest.ogg',
    duration: 600, // 10 minutes
    size: '8-10MB'
  }
};

// Cache for preloaded sounds
const preloadedSounds: Record<string, HTMLAudioElement> = {};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const waterDropRef = useRef<HTMLAudioElement | null>(null);
  const inhaleRef = useRef<HTMLAudioElement | null>(null);
  const exhaleRef = useRef<HTMLAudioElement | null>(null);
  const ambientSoundRef = useRef<HTMLAudioElement | null>(null);
  
  const [soundsLoaded, setSoundsLoaded] = useState(false);
  const [currentAmbientSound, setCurrentAmbientSound] = useState<string | null>(null);
  const [isAmbientSoundLoading, setIsAmbientSoundLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [soundsPreloaded, setSoundsPreloaded] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  
  useEffect(() => {
    // Create audio elements for short sounds
    waterDropRef.current = new Audio('/sounds/water-drop.mp3');
    inhaleRef.current = new Audio('/sounds/inhale.mp3');
    exhaleRef.current = new Audio('/sounds/exhale.mp3');
    
    // Set volume for interaction sounds
    if (waterDropRef.current) waterDropRef.current.volume = 0.3;
    if (inhaleRef.current) inhaleRef.current.volume = 0.4;
    if (exhaleRef.current) exhaleRef.current.volume = 0.4;
    
    // Set load handlers for basic interaction sounds
    const handleSuccess = () => {
      console.log("Interaction sound files loaded successfully");
      setSoundsLoaded(true);
    };
    
    const handleError = (e: Event) => {
      console.error("Error loading interaction sound file:", e);
      toast.error("Some interaction sound files could not be loaded", {
        description: "Please ensure sound files are placed in the /public/sounds directory"
      });
    };
    
    // Add event listeners for short sounds
    [waterDropRef.current, inhaleRef.current, exhaleRef.current].forEach(audio => {
      if (audio) {
        audio.addEventListener('canplaythrough', handleSuccess);
        audio.addEventListener('error', handleError);
      }
    });
    
    // Cleanup
    return () => {
      [waterDropRef.current, inhaleRef.current, exhaleRef.current, ambientSoundRef.current].forEach(audio => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
          if (audio !== ambientSoundRef.current) {
            audio.removeEventListener('canplaythrough', handleSuccess);
            audio.removeEventListener('error', handleError);
          }
        }
      });
      
      // Also clean up any preloaded sounds
      Object.values(preloadedSounds).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);
  
  // Enhanced function to load audio with fallback and chunked buffering
  const loadAudioWithFallback = (soundType: string, audio: HTMLAudioElement, useMp3: boolean = false): Promise<void> => {
    return new Promise((resolve, reject) => {
      let hasStartedPlaying = false;
      let loadTimeout: number;
      
      const soundData = SOUND_FILES[soundType];
      if (!soundData) {
        reject(new Error(`Unknown sound type: ${soundType}`));
        return;
      }
      
      // Choose format: try MP3 first if useMp3 is true, otherwise try OGG first
      const soundUrl = useMp3 ? soundData.mp3Path : soundData.oggPath;
      console.log(`Loading ${soundType} from: ${soundUrl}`);
      
      // Set up progress tracking
      const handleProgress = () => {
        if (audio.buffered.length > 0) {
          const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
          const duration = audio.duration || 60; // Default to 60 seconds if duration unknown
          const progress = Math.min(Math.round((bufferedEnd / duration) * 100), 100);
          setLoadingProgress(progress);
          
          console.log(`${soundType} loading progress: ${progress}% (${bufferedEnd.toFixed(1)}s buffered)`);
          
          // Start playing when we have at least 10 seconds buffered or 25% loaded
          if (!hasStartedPlaying && (bufferedEnd >= 10 || progress >= 25)) {
            hasStartedPlaying = true;
            audio.play()
              .then(() => {
                console.log(`${soundType} started playing with partial buffer`);
                setIsAmbientSoundLoading(false);
                setCurrentAmbientSound(soundType);
                resolve();
              })
              .catch(reject);
          }
        }
      };
      
      const handleCanPlay = () => {
        if (!hasStartedPlaying) {
          hasStartedPlaying = true;
          console.log(`${soundType} can play - starting playback`);
          audio.play()
            .then(() => {
              setIsAmbientSoundLoading(false);
              setCurrentAmbientSound(soundType);
              resolve();
            })
            .catch(reject);
        }
      };
      
      const handleError = (e: Event) => {
        console.error(`Error loading ${soundType} from ${soundUrl}:`, e);
        clearTimeout(loadTimeout);
        
        // If we haven't tried MP3 yet and this was OGG, try MP3 as fallback
        if (!useMp3 && soundUrl.includes('.ogg')) {
          console.log(`Fallback: Trying MP3 for ${soundType}`);
          cleanup();
          // Retry with MP3
          loadAudioWithFallback(soundType, audio, true).then(resolve).catch(reject);
          return;
        }
        
        reject(new Error(`Failed to load ${soundType} sound`));
      };
      
      const handleLoadedData = () => {
        console.log(`${soundType} metadata loaded, duration: ${audio.duration}s`);
      };
      
      // Set up event listeners
      audio.addEventListener('progress', handleProgress);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('loadeddata', handleLoadedData);
      audio.addEventListener('error', handleError);
      
      // Set loading timeout - try to start playing within 15 seconds
      loadTimeout = window.setTimeout(() => {
        if (!hasStartedPlaying) {
          console.warn(`${soundType} loading timeout - attempting to play with current buffer`);
          if (audio.buffered.length > 0) {
            hasStartedPlaying = true;
            audio.play()
              .then(() => {
                setIsAmbientSoundLoading(false);
                setCurrentAmbientSound(soundType);
                resolve();
              })
              .catch(() => {
                // If timeout fails and we were using OGG, try MP3
                if (!useMp3) {
                  console.log(`Timeout fallback: Trying MP3 for ${soundType}`);
                  cleanup();
                  loadAudioWithFallback(soundType, audio, true).then(resolve).catch(reject);
                } else {
                  reject(new Error(`${soundType} loading timed out`));
                }
              });
          } else {
            // No buffer and timeout - try MP3 if we were using OGG
            if (!useMp3) {
              console.log(`No buffer fallback: Trying MP3 for ${soundType}`);
              cleanup();
              loadAudioWithFallback(soundType, audio, true).then(resolve).catch(reject);
            } else {
              reject(new Error(`${soundType} loading timed out`));
            }
          }
        }
      }, 15000);
      
      // Set up the audio element
      audio.loop = true;
      audio.volume = 0.5;
      audio.src = soundUrl;
      audio.load();
      
      // Cleanup function
      const cleanup = () => {
        clearTimeout(loadTimeout);
        audio.removeEventListener('progress', handleProgress);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('loadeddata', handleLoadedData);
        audio.removeEventListener('error', handleError);
      };
      
      // Clean up on resolve/reject
      const originalResolve = resolve;
      const originalReject = reject;
      resolve = (...args) => {
        cleanup();
        originalResolve(...args);
      };
      reject = (...args) => {
        cleanup();
        originalReject(...args);
      };
    });
  };
  
  // Function to preload all ambient sounds in the background
  const preloadAmbientSounds = async (): Promise<void> => {
    if (soundsPreloaded) return;
    
    const soundTypes = Object.keys(SOUND_FILES);
    console.log("Starting to preload ambient sounds...");
    
    try {
      // Preload sounds sequentially to avoid overwhelming the browser
      for (const soundType of soundTypes) {
        try {
          console.log(`Preloading ${soundType}`);
          
          const audio = new Audio();
          audio.loop = true;
          audio.volume = 0.5;
          audio.preload = 'auto';
          
          await loadAudioWithFallback(soundType, audio);
          
          // Pause after loading but keep in cache
          audio.pause();
          audio.currentTime = 0;
          preloadedSounds[soundType] = audio;
          
          console.log(`Successfully preloaded: ${soundType}`);
        } catch (error) {
          console.warn(`Failed to preload ${soundType}:`, error);
          // Continue with other sounds even if one fails
        }
      }
      
      setSoundsPreloaded(true);
      setLoadingProgress(100);
      console.log("Ambient sounds preloading completed");
    } catch (error) {
      console.error("Error during preloading:", error);
    }
  };
  
  const playWaterDrop = () => {
    if (waterDropRef.current) {
      waterDropRef.current.currentTime = 0;
      waterDropRef.current.play().catch(e => console.error("Error playing water drop sound:", e));
    }
  };
  
  const playInhale = () => {
    if (inhaleRef.current) {
      inhaleRef.current.currentTime = 0;
      inhaleRef.current.play().catch(e => console.error("Error playing inhale sound:", e));
    }
  };
  
  const playExhale = () => {
    if (exhaleRef.current) {
      exhaleRef.current.currentTime = 0;
      exhaleRef.current.play().catch(e => console.error("Error playing exhale sound:", e));
    }
  };
  
  const playAmbientSound = async (soundType: string) => {
    // Stop current ambient sound if any
    stopAmbientSound();
    
    console.log(`Attempting to play ambient sound: ${soundType}`);
    setIsAmbientSoundLoading(true);
    setLoadingProgress(0);
    setShowMiniPlayer(true); // Show mini player when audio starts
    
    try {
      // Check if this sound is in our preloaded cache
      if (preloadedSounds[soundType]) {
        console.log(`Using preloaded ${soundType} sound`);
        ambientSoundRef.current = preloadedSounds[soundType];
        
        if (ambientSoundRef.current) {
          ambientSoundRef.current.currentTime = 0;
          await ambientSoundRef.current.play();
          setIsAmbientSoundLoading(false);
          setCurrentAmbientSound(soundType);
          return;
        }
      }
      
      // No preloaded sound, load directly with MP3 priority
      await loadSoundDirectly(soundType);
      
    } catch (error) {
      console.error(`Error playing ${soundType}:`, error);
      setIsAmbientSoundLoading(false);
      setCurrentAmbientSound(null);
      setShowMiniPlayer(false);
      toast.error(`Could not play ${soundType} sound`, {
        description: "The sound file may be too large or corrupted"
      });
    }
  };
  
  const loadSoundDirectly = async (soundType: string) => {
    if (!SOUND_FILES[soundType]) {
      throw new Error(`Unknown sound type: ${soundType}`);
    }
    
    console.log(`Loading sound directly: ${soundType}`);
    
    // Create new audio element
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.5;
    
    try {
      // Try MP3 first since it's more reliable
      await loadAudioWithFallback(soundType, audio, true);
      
      // Store reference and in cache for future use
      ambientSoundRef.current = audio;
      preloadedSounds[soundType] = audio;
      
    } catch (error) {
      throw error;
    }
  };
  
  const stopAmbientSound = () => {
    if (ambientSoundRef.current) {
      console.log("Stopping ambient sound");
      ambientSoundRef.current.pause();
      ambientSoundRef.current.currentTime = 0;
      setCurrentAmbientSound(null);
      setIsAmbientSoundLoading(false);
      setLoadingProgress(0);
      setShowMiniPlayer(false);
    }
  };
  
  const setAmbientVolume = (volume: number) => {
    const volumeLevel = volume / 100;
    
    if (ambientSoundRef.current) {
      ambientSoundRef.current.volume = volumeLevel;
    }
    
    // Also update volume for preloaded sounds that are currently playing
    Object.values(preloadedSounds).forEach(audio => {
      if (audio === ambientSoundRef.current) {
        audio.volume = volumeLevel;
      }
    });
  };
  
  return (
    <SoundContext.Provider value={{ 
      playWaterDrop, 
      playInhale, 
      playExhale, 
      playAmbientSound,
      stopAmbientSound,
      setAmbientVolume,
      isAmbientSoundLoading,
      currentAmbientSound,
      loadingProgress,
      preloadAmbientSounds,
      showMiniPlayer,
      setShowMiniPlayer
    }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
};
