import React, { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import AudioVisualizer from "@/components/AudioVisualizer";
import YouTube, { YouTubeProps } from "react-youtube";

interface ActiveMeditationSessionProps {
  title: string;
  duration: number;
  timeRemaining: number;
  youtubeLink: string;
  notes: string;
  onNotesChange: (notes: string) => void;
  onComplete: () => void;
  onEnd: (completed: boolean) => void;
  onVideoDurationChange: (duration: number) => void;
  formatTimeRemaining: () => string;
  getYoutubeId: (url: string) => string;
}

const ActiveMeditationSession: React.FC<ActiveMeditationSessionProps> = ({
  title,
  duration,
  timeRemaining,
  youtubeLink,
  notes,
  onNotesChange,
  onComplete,
  onEnd,
  onVideoDurationChange,
  formatTimeRemaining,
  getYoutubeId,
}) => {
  const youtubeId = youtubeLink ? getYoutubeId(youtubeLink) : "";
  const playerRef = useRef<YT.Player | null>(null);

  /* Pause visible player when countdown finishes */
  useEffect(() => {
    if (timeRemaining === 0 && playerRef.current) {
      try {
        playerRef.current.pauseVideo();
      } catch {
        /* noop */
      }
    }
  }, [timeRemaining]);

  /* YouTube player options */
  const opts: YouTubeProps["opts"] = {
    width: "100%",
    height: "100%",
    playerVars: { autoplay: 1, modestbranding: 1, rel: 0 },
  };

  const handleReady: YouTubeProps["onReady"] = (e) => {
    playerRef.current = e.target;
    const dur = e.target.getDuration();
    if (dur) onVideoDurationChange(dur);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meditation in Progress</CardTitle>
        <CardDescription>
          Focus on your breath and find your center
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center">
        {/* Countdown */}
        <div className="text-6xl font-bold mb-8">
          {formatTimeRemaining()}
        </div>

        {/* Video or visualizer */}
        {youtubeId ? (
          <>
            <AspectRatio
              ratio={16 / 9}
              className="w-full max-w-lg mb-4 rounded-lg overflow-hidden mx-auto"
            >
              <YouTube
                videoId={youtubeId}
                opts={opts}
                className="w-full h-full"
                iframeClassName="w-full h-full rounded-lg"
                onReady={handleReady}
                onEnd={onComplete}
              />
            </AspectRatio>

            {/* Audio-only visualizer (optional) */}
            <div className="w-full max-w-lg mb-8 mx-auto">
              <AudioVisualizer
                youtubeId={youtubeId}
                onDurationChange={onVideoDurationChange}
                onEnd={onComplete}
              />
            </div>
          </>
        ) : (
          /* Fallback graphic */
          <div className="flex items-center justify-center w-full max-w-lg mb-8 h-[300px] bg-muted/30 rounded-lg">
            <div className="text-center p-6">
              <div className="mb-4 text-4xl">
                {title === "Mindful Morning"
                  ? "🌅"
                  : title === "Deep Relaxation"
                  ? "🧘"
                  : title === "Stress Relief"
                  ? "✨"
                  : "🌙"}
              </div>
              <h3 className="text-lg font-medium mb-2">{title}</h3>
              <p className="text-muted-foreground">
                Focus on your breath and let thoughts pass by like clouds
              </p>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="space-y-4 w-full max-w-lg">
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">
              Duration: {duration} minutes
            </p>
          </div>

          <Textarea
            placeholder="Add notes about your experience..."
            className="h-24"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
          />
        </div>
      </CardContent>

      <CardFooter className="flex justify-center">
        <Button
          variant="destructive"
          onClick={() => onEnd(false)}
          className="mr-4"
        >
          End Session
        </Button>
        <Button onClick={() => onEnd(true)}>Complete Session</Button>
      </CardFooter>
    </Card>
  );
};

export default ActiveMeditationSession;
