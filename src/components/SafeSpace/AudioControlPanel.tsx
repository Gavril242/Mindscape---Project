
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, HelpCircle, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSound } from "@/components/SoundContext";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AudioControlPanel: React.FC = () => {
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const { preloadAmbientSounds } = useSound();
  const navigate = useNavigate();
  
  const handlePreloadSounds = async () => {
    await preloadAmbientSounds();
  };

  return (
    <Card>
      
    </Card>
  );
};

export default AudioControlPanel;
/*<CardHeader>
        <CardTitle className="flex items-center gap-2">
          Audio Settings
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsHelpDialogOpen(true)}
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
        </CardTitle>
        <CardDescription>Optimize your audio experience</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Audio File Format Issue Detected</AlertTitle>
            <AlertDescription>
              Your browser may not support the audio format being used. Try using the Audio Debugger to diagnose the problem.
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Having issues with ambient sounds? Try these options:
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePreloadSounds}
              >
                Preload All Sounds
              </Button>
              
              <Button 
                variant="default" 
                size="sm"
                onClick={() => navigate('/audio-debug')}
              >
                Open Audio Debugger
              </Button>
            </div>
          </div>
          
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3 border border-amber-200 dark:border-amber-800">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-300">Audio File Requirements</h4>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                  For best performance, ambient sound files should be 3-10 minutes long and optimized for web playback. 
                  Ensure your browser supports the MP3 format or try converting to OGG format.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <Dialog open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Audio Troubleshooting</DialogTitle>
            <DialogDescription>
              Tips for getting the best audio experience
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <h3 className="font-medium">Common Audio Format Issues</h3>
            
            <div className="space-y-2">
              <p className="text-sm"><strong>Error: MEDIA_ERR_SRC_NOT_SUPPORTED</strong> - This means your browser 
                doesn't support the audio format. Try these solutions:</p>
              
              <ul className="list-disc pl-5">
                <li className="text-sm">Make sure the audio files exist in the /public/sounds directory</li>
                <li className="text-sm">Convert your audio files to OGG format which is more widely supported</li>
                <li className="text-sm">Use optimized audio files (shorter files load faster)</li>
                <li className="text-sm">Check the Audio Debugger for detailed information about what formats your browser supports</li>
              </ul>
            </div>
            
            <h3 className="font-medium">Browser Support</h3>
            <p className="text-sm">
              For best performance, use Chrome, Edge, or Safari. Firefox may have issues with some audio formats.
              The app will automatically select the best format for your browser (MP3 or OGG).
            </p>
            
            <div className="flex justify-end">
              <Button onClick={() => navigate('/audio-debug')}>
                Open Audio Debugger
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>?*/
      