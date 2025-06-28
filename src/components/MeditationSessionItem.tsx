import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import YouTube, { YouTubeProps } from "react-youtube";

interface MeditationSessionProps {
  title: string;
  duration: number;
  date: string;
  youtubeLink?: string;
  notes?: string;
  onClick?: () => void;
}

/**
 * Extracts the YouTube video ID from a given URL.
 * Supports standard, shortened, embed, shorts, etc.
 */
const getYouTubeId = (url: string): string | null => {
  const match = url.match(
    /(?:youtu\.be\/|(?:[\w-]+\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)?)([\w-]{11})/
  );
  return match ? match[1] : null;
};

const MeditationSessionItem = ({
  title,
  duration,
  date,
  youtubeLink,
  notes,
  onClick,
}: MeditationSessionProps) => {
  const formattedDate = formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
  const youtubeId = youtubeLink ? getYouTubeId(youtubeLink) : null;

  // YouTube iframe API options
  const playerOpts: YouTubeProps["opts"] = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 0, // do not autoplay when rendered
      modestbranding: 1, // minimal YouTube branding
      rel: 0, // do not show related videos at the end
    },
  };

  return (
    <Card
      className="hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{title}</h4>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
            {notes && <p className="text-sm mt-2 line-clamp-2">{notes}</p>}
          </div>

          <Badge>{duration} min</Badge>
        </div>

        {/* YouTube player */}
        {youtubeId && (
          <AspectRatio ratio={16 / 9} className="mt-4 rounded-lg overflow-hidden">
            <YouTube
              videoId={youtubeId}
              opts={playerOpts}
              className="w-full h-full" // container div
              iframeClassName="w-full h-full rounded-lg" // iframe itself
              onReady={(e) => e.target.pauseVideo()} // ensure video doesn't auto‑play on mobile Safari despite autoplay=0
            />
          </AspectRatio>
        )}
      </CardContent>
    </Card>
  );
};

export default MeditationSessionItem;
