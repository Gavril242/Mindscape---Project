
export interface Position {
  x: number;
  y: number;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  type: 'motivational' | 'hint';
  position: Position;
  discovered: boolean;
}

export interface LabyrinthCell {
  x: number;
  y: number;
  isWall: boolean;
  isPath: boolean;
  isStart: boolean;
  isEnd: boolean;
  hasQuote: boolean;
  quote?: Quote;
  visited: boolean;
}

export interface LabyrinthState {
  playerPosition: Position;
  maze: LabyrinthCell[][];
  quotes: Quote[];
  discoveredQuotes: Quote[];
  isCompleted: boolean;
  timeStarted: number;
  timeCompleted?: number;
}
