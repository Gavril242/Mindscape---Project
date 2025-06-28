
import { useEffect, useState } from "react";
import AudioDebugger from "@/components/AudioDebugger";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, XCircle, Info } from "lucide-react";

interface BrowserSupport {
  mp3: boolean;
  ogg: boolean;
  wav: boolean;
  aac: boolean;
}

const AudioDebug = () => {
  const navigate = useNavigate();
  const [soundFiles, setSoundFiles] = useState<string[]>([
    '/sounds/water-drop.mp3',
    '/sounds/inhale.mp3',
    '/sounds/exhale.mp3',
    '/sounds/rain.mp3',
    '/sounds/ocean.mp3',
    '/sounds/forest.mp3',
    '/sounds/fireplace.mp3'
  ]);
  const [formatSupport, setFormatSupport] = useState<BrowserSupport | null>(null);
  
  useEffect(() => {
    // Check format support
    const audio = document.createElement('audio');
    
    const support: BrowserSupport = {
      mp3: Boolean(audio.canPlayType && audio.canPlayType('audio/mpeg;').replace(/no/, '')),
      ogg: Boolean(audio.canPlayType && audio.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, '')),
      wav: Boolean(audio.canPlayType && audio.canPlayType('audio/wav; codecs="1"').replace(/no/, '')),
      aac: Boolean(audio.canPlayType && audio.canPlayType('audio/mp4; codecs="mp4a.40.2"').replace(/no/, ''))
    };
    
    setFormatSupport(support);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Audio Debug Tool</h1>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </div>
      
      <p className="mb-8 text-muted-foreground">
        This tool helps debug audio file loading issues. Click "Test All Files" to check if your audio files 
        are loading correctly, or test individual files using the "Test" button.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              Browser Audio Support
            </CardTitle>
            <CardDescription>
              Audio formats supported by your current browser
            </CardDescription>
          </CardHeader>
          <CardContent>
            {formatSupport ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">MP3 Format</span>
                  {formatSupport.mp3 ? 
                    <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
                    <XCircle className="h-5 w-5 text-red-500" />}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">OGG Format</span>
                  {formatSupport.ogg ? 
                    <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
                    <XCircle className="h-5 w-5 text-red-500" />}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">WAV Format</span>
                  {formatSupport.wav ? 
                    <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
                    <XCircle className="h-5 w-5 text-red-500" />}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">AAC Format</span>
                  {formatSupport.aac ? 
                    <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
                    <XCircle className="h-5 w-5 text-red-500" />}
                </div>
                
                <div className="pt-3 mt-3 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>Recommended format:</strong>{" "}
                    {formatSupport.ogg ? "OGG (smaller file size)" : "MP3 (best compatibility)"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center p-4">
                <p>Checking browser support...</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Audio Requirements
            </CardTitle>
            <CardDescription>
              Recommendations for optimal audio playback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Ambient Sounds (Rain, Ocean, etc.)</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>File size: Under 5MB for best performance</li>
                  <li>Duration: 2-3 minutes, seamlessly looping</li>
                  <li>Format: MP3 (128kbps) or OGG (96kbps)</li>
                  <li>Channels: Stereo</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">UI Sounds (Water Drop, etc.)</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>File size: Under 100KB</li>
                  <li>Duration: Less than 1 second</li>
                  <li>Format: MP3 or OGG</li>
                  <li>Channels: Mono</li>
                </ul>
              </div>
              
              <p className="text-sm text-muted-foreground pt-2 border-t mt-3">
                These recommendations ensure optimal loading time and playback performance
                across different devices and connection speeds.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AudioDebugger soundFiles={soundFiles} />
      
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Audio Troubleshooting Tips</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Make sure all audio files are properly placed in the <code>/public/sounds</code> directory</li>
          <li>Large audio files (larger than 5MB) may take longer to load or fail on slower connections</li>
          <li>Convert your audio files to both MP3 and OGG formats for better cross-browser support</li>
          <li>For ambient sounds, use shorter looped files (2-3 minutes) that repeat seamlessly</li>
          <li>Check browser console for detailed error messages</li>
          <li>Some browsers have restrictions on audio autoplay - ensure your user has interacted with the page first</li>
          <li>Use the "Preload All Sounds" button in the Audio Settings panel for better performance</li>
        </ul>
      </div>
    </div>
  );
};

export default AudioDebug;
