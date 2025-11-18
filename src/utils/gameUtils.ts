import { GemType, Cell, GameBoard, Position } from '../types/game';

export const GEM_TYPES: GemType[] = ['red', 'blue', 'green', 'yellow', 'purple'];

export const createInitialBoard = (rows: number = 8, cols: number = 8): GameBoard => {
  const board: GameBoard = [];
  
  for (let i = 0; i < rows; i++) {
    const row: Cell[] = [];
    for (let j = 0; j < cols; j++) {
      row.push({
        type: GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)],
        id: `gem-${i}-${j}-${Date.now()}`
      });
    }
    board.push(row);
  }
  
  return board;
};

export const swapCells = (board: GameBoard, from: Position, to: Position): GameBoard => {
  const newBoard = board.map(row => [...row]);
  const temp = newBoard[from.row][from.col];
  newBoard[from.row][from.col] = newBoard[to.row][to.col];
  newBoard[to.row][to.col] = temp;
  return newBoard;
};

export const arePositionsEqual = (a: Position, b: Position): boolean => {
  return a.row === b.row && a.col === b.col;
};