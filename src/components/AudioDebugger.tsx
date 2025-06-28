
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Play, 
  Pause,
  StopCircle,
  FileAudio
} from "lucide-react";

interface AudioDebuggerProps {
  soundFiles: string[];
}

interface TestResult {
  status: 'success' | 'error' | 'loading' | 'warning' | 'not-tested';
  message: string;
  duration?: number;
  size?: number;
  errorCode?: number;
  errorDetails?: string;
  loadTime?: number;
}

const AudioDebugger = ({ soundFiles }: AudioDebuggerProps) => {
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [playingFile, setPlayingFile] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<Record<string, HTMLAudioElement>>({});
  const [loadingProgress, setLoadingProgress] = useState<Record<string, number>>({});

  const testAudioFile = async (filePath: string) => {
    try {
      // Set initial loading state
      setResults(prev => ({
        ...prev,
        [filePath]: { 
          status: 'loading', 
          message: 'Loading...'
        }
      }));
      
      setLoadingProgress(prev => ({ 
        ...prev, 
        [filePath]: 0 
      }));

      // Create new audio element
      const audio = new Audio();
      
      // Track start time to measure loading performance
      const startTime = performance.now();
      
      // Set up event listeners
      const onCanPlayThrough = () => {
        const loadTime = Math.round((performance.now() - startTime) / 100) / 10;
        let status: 'success' | 'warning' = 'success';
        let message = `File loaded successfully (${Math.round(audio.duration)} seconds)`;
        
        // Check for potential issues - increased threshold to 600 seconds (10 minutes)
        if (audio.duration > 1000) { // > 10 minutes
          status = 'warning';
          message = `File loaded but may be too large (${Math.round(audio.duration)} seconds)`;
        }

        setResults(prev => ({
          ...prev,
          [filePath]: { 
            status, 
            message,
            duration: audio.duration,
            loadTime
          }
        }));
        
        console.log(`Debug: ${filePath} loaded successfully, duration: ${audio.duration} seconds, load time: ${loadTime}s`);
        
        // Store the audio element for playback testing
        setAudioElements(prev => ({
          ...prev,
          [filePath]: audio
        }));
      };
      
      const onProgress = () => {
        if (audio.buffered.length) {
          const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
          if (audio.duration) {
            setLoadingProgress(prev => ({ 
              ...prev, 
              [filePath]: Math.round((bufferedEnd / audio.duration) * 100) 
            }));
          }
        }
      };
      
      const onError = () => {
        const errorMessage = audio.error ? 
          getErrorMessage(audio.error.code, filePath) : 
          'Unknown error';
        
        setResults(prev => ({
          ...prev,
          [filePath]: { 
            status: 'error', 
            message: errorMessage,
            errorCode: audio.error?.code,
            errorDetails: audio.error?.message
          }
        }));
        
        console.error(`Debug: Error loading ${filePath}:`, audio.error);
      };
      
      // Add the event listeners
      audio.addEventListener('canplaythrough', onCanPlayThrough);
      audio.addEventListener('error', onError);
      audio.addEventListener('progress', onProgress);
      
      // Set source and start loading
      audio.preload = 'auto';
      audio.src = filePath;
      audio.load();
      
      // Set a timeout in case the file is too large or has other issues
      setTimeout(() => {
        if (results[filePath]?.status === 'loading') {
          setResults(prev => ({
            ...prev,
            [filePath]: { 
              status: 'warning', 
              message: 'Loading timeout - file may be too large or corrupted'
            }
          }));
        }
      }, 15000);
      
      // Clean up when component unmounts
      return () => {
        audio.removeEventListener('canplaythrough', onCanPlayThrough);
        audio.removeEventListener('error', onError);
        audio.removeEventListener('progress', onProgress);
      };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setResults(prev => ({
        ...prev,
        [filePath]: { 
          status: 'error', 
          message: `Exception: ${errorMessage}` 
        }
      }));
      console.error(`Debug: Exception loading ${filePath}:`, e);
    }
  };
  
  const getErrorMessage = (code: number, filePath: string): string => {
    const extension = filePath.split('.').pop()?.toLowerCase();
    
    switch(code) {
      case 1: 
        return 'MEDIA_ERR_ABORTED: The user aborted the download.';
      case 2: 
        return 'MEDIA_ERR_NETWORK: A network error occurred.';
      case 3: 
        return `MEDIA_ERR_DECODE: The file is corrupted or format (${extension}) is not supported.`;
      case 4: 
        return `MEDIA_ERR_SRC_NOT_SUPPORTED: The file format (${extension}) is not supported.`;
      default: 
        return 'Unknown error.';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'loading':
        return <div className="h-4 w-4 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };
  
  const testAllFiles = () => {
    soundFiles.forEach(file => testAudioFile(file));
    toast.info("Testing all audio files", {
      description: "Results will appear below as files are tested"
    });
  };
  
  const playAudio = (filePath: string) => {
    if (playingFile) {
      // Stop currently playing audio
      if (audioElements[playingFile]) {
        audioElements[playingFile].pause();
        audioElements[playingFile].currentTime = 0;
      }
      
      if (playingFile === filePath) {
        setPlayingFile(null);
        return;
      }
    }
    
    // Play the new audio
    if (audioElements[filePath]) {
      audioElements[filePath].play().catch(err => {
        console.error("Error playing audio:", err);
        toast.error("Failed to play audio", { 
          description: "Your browser might be blocking autoplay. Try clicking elsewhere on the page first." 
        });
      });
      setPlayingFile(filePath);
    } else {
      toast.error("Audio not loaded yet", {
        description: "Test the audio file first to load it"
      });
    }
  };
  
  const stopAllAudio = () => {
    if (playingFile && audioElements[playingFile]) {
      audioElements[playingFile].pause();
      audioElements[playingFile].currentTime = 0;
      setPlayingFile(null);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileAudio className="h-5 w-5" />
            Audio File Debugger
          </span>
          <div className="flex gap-2">
            {playingFile && (
              <Button onClick={stopAllAudio} variant="outline" size="sm">
                <StopCircle className="h-4 w-4 mr-1" /> Stop Audio
              </Button>
            )}
            <Button onClick={testAllFiles} variant="outline" size="sm">
              Test All Files
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          {soundFiles.map(file => (
            <div key={file} className="flex flex-col gap-2 p-3 border rounded">
              <div className="flex items-center justify-between">
                <span className="font-medium">{file.split('/').pop()}</span>
                <div className="flex items-center gap-2">
                  {results[file] && getStatusIcon(results[file].status)}
                  <span className="text-sm">{results[file]?.message || '—'}</span>
                </div>
              </div>
              
              {loadingProgress[file] > 0 && loadingProgress[file] < 100 && (
                <Progress value={loadingProgress[file]} className="h-1 my-1" />
              )}
              
              <div className="flex items-center justify-end gap-2 mt-1">
                {audioElements[file] && (
                  <Button 
                    onClick={() => playAudio(file)} 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    {playingFile === file ? (
                      <><Pause className="h-3 w-3" /> Pause</>
                    ) : (
                      <><Play className="h-3 w-3" /> Play</>
                    )}
                  </Button>
                )}
                
                <Button 
                  onClick={() => testAudioFile(file)} 
                  variant="outline" 
                  size="sm"
                >
                  {results[file]?.status === 'loading' ? 'Loading...' : 'Test'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioDebugger;
