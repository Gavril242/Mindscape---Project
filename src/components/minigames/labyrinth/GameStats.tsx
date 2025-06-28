
import { LabyrinthState } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, MapPin, X } from "lucide-react";

interface GameStatsProps {
  gameState: LabyrinthState;
  onNewGame: () => void;
  onClose: () => void;
}

export const GameStats = ({ gameState, onNewGame, onClose }: GameStatsProps) => {
  const completionTime = gameState.timeCompleted 
    ? Math.floor((gameState.timeCompleted - gameState.timeStarted) / 1000)
    : 0;

  const quotesFound = gameState.discoveredQuotes.length;
  const totalQuotes = gameState.quotes.length;
  const completionPercentage = Math.round((quotesFound / totalQuotes) * 100);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Labyrinth Complete!
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-primary">Congratulations!</div>
            <div className="text-muted-foreground">
              You successfully navigated through the labyrinth and found your way to mindfulness.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Time</span>
              </div>
              <div className="text-lg font-bold">{completionTime}s</div>
            </div>

            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-1">
                <MapPin className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Quotes Found</span>
              </div>
              <div className="text-lg font-bold">{quotesFound}/{totalQuotes}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Discovery Rate</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {quotesFound === totalQuotes && (
            <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-yellow-800 font-medium">Perfect Discovery!</div>
              <div className="text-yellow-600 text-sm">
                You found all the hidden wisdom in the labyrinth.
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={onNewGame} className="flex-1">
              Play Again
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
