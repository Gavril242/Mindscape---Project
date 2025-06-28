
import { useRef, useEffect } from "react";
import { LabyrinthState } from "./types";

interface LabyrinthCanvasProps {
  gameState: LabyrinthState;
  cellSize: number;
}

export const LabyrinthCanvas = ({ gameState, cellSize }: LabyrinthCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { maze, playerPosition } = gameState;
    const width = maze[0].length * cellSize;
    const height = maze.length * cellSize;

    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Draw maze
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        const cell = maze[y][x];
        const pixelX = x * cellSize;
        const pixelY = y * cellSize;

        if (cell.isWall) {
          ctx.fillStyle = '#1f2937'; // Dark gray for walls
        } else if (cell.isStart) {
          ctx.fillStyle = '#10b981'; // Green for start
        } else if (cell.isEnd) {
          ctx.fillStyle = '#f59e0b'; // Amber for end
        } else if (cell.visited) {
          ctx.fillStyle = '#e5e7eb'; // Light gray for visited paths
        } else {
          ctx.fillStyle = '#f9fafb'; // Very light gray for unvisited paths
        }

        ctx.fillRect(pixelX, pixelY, cellSize, cellSize);

        // Draw quotes
        if (cell.hasQuote && cell.quote) {
          ctx.fillStyle = cell.quote.discovered ? '#6366f1' : '#8b5cf6'; // Purple for quotes
          ctx.beginPath();
          ctx.arc(
            pixelX + cellSize / 2,
            pixelY + cellSize / 2,
            cellSize / 4,
            0,
            2 * Math.PI
          );
          ctx.fill();

          // Add sparkle effect for undiscovered quotes
          if (!cell.quote.discovered) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(pixelX + cellSize / 2 - 1, pixelY + cellSize / 2 - 1, 2, 2);
          }
        }
      }
    }

    // Draw player
    const playerPixelX = playerPosition.x * cellSize;
    const playerPixelY = playerPosition.y * cellSize;
    
    ctx.fillStyle = '#ef4444'; // Red for player
    ctx.beginPath();
    ctx.arc(
      playerPixelX + cellSize / 2,
      playerPixelY + cellSize / 2,
      cellSize / 3,
      0,
      2 * Math.PI
    );
    ctx.fill();

    // Add player glow effect
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(
      playerPixelX + cellSize / 2,
      playerPixelY + cellSize / 2,
      cellSize / 3,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.shadowBlur = 0;

  }, [gameState, cellSize]);

  return (
    <div className="border rounded-lg overflow-hidden bg-gray-900 p-2">
      <canvas 
        ref={canvasRef}
        className="max-w-full h-auto"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};
