
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quote, LabyrinthState, Position, LabyrinthCell } from "./types";
import { generateMaze } from "./mazeGenerator";
import { LabyrinthCanvas } from "./LabyrinthCanvas";
import { QuoteDisplay } from "./QuoteDisplay";
import { GameStats } from "./GameStats";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";

const MAZE_SIZE = 15;

const motivationalQuotes: Omit<Quote, 'id' | 'position' | 'discovered'>[] = [
  { text: "Every step forward is progress, no matter how small.", author: "Unknown", type: "motivational" },
  { text: "You are stronger than you think and braver than you feel.", author: "Unknown", type: "motivational" },
  { text: "Trust the process, trust yourself.", author: "Unknown", type: "motivational" },
  { text: "Look for the light switch - there might be a hidden passage nearby.", author: "Hint", type: "hint" },
  { text: "Sometimes the longest path leads to the most beautiful discoveries.", author: "Unknown", type: "motivational" },
  { text: "When you feel lost, remember that every maze has an exit.", author: "Unknown", type: "motivational" },
  { text: "Check the corners - treasures are often hidden in unexpected places.", author: "Hint", type: "hint" },
  { text: "Your journey matters as much as your destination.", author: "Unknown", type: "motivational" },
];

const LabyrinthGame = () => {
  const [gameState, setGameState] = useState<LabyrinthState | null>(null);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [showStats, setShowStats] = useState(false);

  const initializeGame = useCallback(() => {
    const maze = generateMaze(MAZE_SIZE, MAZE_SIZE);
    const quotes = motivationalQuotes.map((quote, index) => ({
      ...quote,
      id: `quote-${index}`,
      position: getRandomPathPosition(maze),
      discovered: false,
    }));

    // Place quotes in maze cells
    quotes.forEach(quote => {
      const cell = maze[quote.position.y][quote.position.x];
      if (cell && cell.isPath) {
        cell.hasQuote = true;
        cell.quote = quote;
      }
    });

    setGameState({
      playerPosition: { x: 1, y: 1 }, // Start position
      maze,
      quotes,
      discoveredQuotes: [],
      isCompleted: false,
      timeStarted: Date.now(),
    });

    setCurrentQuote(null);
    setShowStats(false);
  }, []);

  const getRandomPathPosition = (maze: LabyrinthCell[][]): Position => {
    const pathCells: Position[] = [];
    
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        if (maze[y][x].isPath && !maze[y][x].isStart && !maze[y][x].isEnd) {
          pathCells.push({ x, y });
        }
      }
    }
    
    return pathCells[Math.floor(Math.random() * pathCells.length)];
  };

  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!gameState || gameState.isCompleted) return;

    const { playerPosition, maze } = gameState;
    let newPosition: Position;

    switch (direction) {
      case 'up':
        newPosition = { x: playerPosition.x, y: playerPosition.y - 1 };
        break;
      case 'down':
        newPosition = { x: playerPosition.x, y: playerPosition.y + 1 };
        break;
      case 'left':
        newPosition = { x: playerPosition.x - 1, y: playerPosition.y };
        break;
      case 'right':
        newPosition = { x: playerPosition.x + 1, y: playerPosition.y };
        break;
    }

    // Check bounds and walls
    if (
      newPosition.x < 0 ||
      newPosition.x >= MAZE_SIZE ||
      newPosition.y < 0 ||
      newPosition.y >= MAZE_SIZE ||
      maze[newPosition.y][newPosition.x].isWall
    ) {
      return;
    }

    // Mark cell as visited
    maze[newPosition.y][newPosition.x].visited = true;

    // Check for quotes
    const cell = maze[newPosition.y][newPosition.x];
    if (cell.hasQuote && cell.quote && !cell.quote.discovered) {
      const updatedQuote = { ...cell.quote, discovered: true };
      setCurrentQuote(updatedQuote);
      
      setGameState(prev => ({
        ...prev!,
        playerPosition: newPosition,
        discoveredQuotes: [...prev!.discoveredQuotes, updatedQuote],
        quotes: prev!.quotes.map(q => q.id === updatedQuote.id ? updatedQuote : q),
      }));
    } else {
      setGameState(prev => ({
        ...prev!,
        playerPosition: newPosition,
      }));
    }

    // Check for completion
    if (maze[newPosition.y][newPosition.x].isEnd) {
      setGameState(prev => ({
        ...prev!,
        isCompleted: true,
        timeCompleted: Date.now(),
      }));
      setShowStats(true);
    }
  }, [gameState]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          movePlayer('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          movePlayer('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          movePlayer('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          movePlayer('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  if (!gameState) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Mindful Labyrinth
            <Button onClick={initializeGame} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              New Game
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Navigate through the labyrinth to find motivational quotes and reach the exit. 
            Use arrow keys or WASD to move.
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <LabyrinthCanvas 
                gameState={gameState}
                cellSize={20}
              />
            </div>
            
            <div className="space-y-4 lg:w-80">
              <div className="grid grid-cols-2 gap-2 lg:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => movePlayer('up')}
                  className="col-start-2"
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => movePlayer('left')}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => movePlayer('down')}
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => movePlayer('right')}
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">
                  Quotes Found: {gameState.discoveredQuotes.length} / {gameState.quotes.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  Time: {Math.floor((Date.now() - gameState.timeStarted) / 1000)}s
                </div>
              </div>

              {currentQuote && (
                <QuoteDisplay 
                  quote={currentQuote}
                  onClose={() => setCurrentQuote(null)}
                />
              )}

              {gameState.discoveredQuotes.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Discovered Quotes:</div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {gameState.discoveredQuotes.map(quote => (
                      <div 
                        key={quote.id}
                        className="text-xs p-2 bg-muted rounded cursor-pointer hover:bg-muted/80"
                        onClick={() => setCurrentQuote(quote)}
                      >
                        "{quote.text.length > 50 ? `${quote.text.substring(0, 50)}...` : quote.text}"
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {showStats && gameState.isCompleted && (
        <GameStats 
          gameState={gameState}
          onNewGame={initializeGame}
          onClose={() => setShowStats(false)}
        />
      )}
    </div>
  );
};

export default LabyrinthGame;
