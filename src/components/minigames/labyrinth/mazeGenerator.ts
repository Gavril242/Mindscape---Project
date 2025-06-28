
import { LabyrinthCell } from "./types";

export function generateMaze(width: number, height: number): LabyrinthCell[][] {
  // Initialize maze with all walls
  const maze: LabyrinthCell[][] = [];
  
  for (let y = 0; y < height; y++) {
    maze[y] = [];
    for (let x = 0; x < width; x++) {
      maze[y][x] = {
        x,
        y,
        isWall: true,
        isPath: false,
        isStart: false,
        isEnd: false,
        hasQuote: false,
        visited: false,
      };
    }
  }

  // Recursive backtracking algorithm
  const stack: { x: number; y: number }[] = [];
  const startX = 1;
  const startY = 1;
  
  // Mark starting position
  maze[startY][startX].isWall = false;
  maze[startY][startX].isPath = true;
  maze[startY][startX].isStart = true;
  stack.push({ x: startX, y: startY });

  const directions = [
    { x: 0, y: -2 }, // Up
    { x: 2, y: 0 },  // Right
    { x: 0, y: 2 },  // Down
    { x: -2, y: 0 }  // Left
  ];

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = [];

    // Find unvisited neighbors
    for (const dir of directions) {
      const newX = current.x + dir.x;
      const newY = current.y + dir.y;

      if (
        newX > 0 && newX < width - 1 &&
        newY > 0 && newY < height - 1 &&
        maze[newY][newX].isWall
      ) {
        neighbors.push({ x: newX, y: newY, dir });
      }
    }

    if (neighbors.length > 0) {
      // Choose random neighbor
      const chosen = neighbors[Math.floor(Math.random() * neighbors.length)];
      
      // Remove wall between current and chosen
      const wallX = current.x + chosen.dir.x / 2;
      const wallY = current.y + chosen.dir.y / 2;
      
      maze[wallY][wallX].isWall = false;
      maze[wallY][wallX].isPath = true;
      maze[chosen.y][chosen.x].isWall = false;
      maze[chosen.y][chosen.x].isPath = true;
      
      stack.push({ x: chosen.x, y: chosen.y });
    } else {
      stack.pop();
    }
  }

  // Set end position (bottom-right area)
  let endX = width - 2;
  let endY = height - 2;
  
  // Find a path cell near the end
  while (maze[endY][endX].isWall && endX > width - 5) {
    endX--;
    if (endX < width - 5) {
      endX = width - 2;
      endY--;
    }
  }
  
  maze[endY][endX].isEnd = true;

  return maze;
}
