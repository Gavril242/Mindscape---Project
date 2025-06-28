
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Youtube } from "lucide-react";

interface MeditationSessionControlsProps {
  meditationYoutubeLink: string;
  onYoutubeLinkChange: (link: string) => void;
  onStartMeditation: () => void;
}

const MeditationSessionControls: React.FC<MeditationSessionControlsProps> = ({
  meditationYoutubeLink,
  onYoutubeLinkChange,
  onStartMeditation
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="youtube-link">YouTube Background Music (Optional)</Label>
        <div className="flex gap-2 mt-1">
          <Input 
            id="youtube-link" 
            placeholder="Paste a YouTube URL here" 
            value={meditationYoutubeLink}
            onChange={(e) => onYoutubeLinkChange(e.target.value)}
          />
          <Button variant="outline" size="icon">
            <Youtube className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Button onClick={onStartMeditation} className="w-full">
        Begin Meditation
      </Button>
    </div>
  );
};

export default MeditationSessionControls;
