export type GemType = 'red' | 'blue' | 'green' | 'yellow' | 'purple';

export interface Cell {
  type: GemType;
  id: string;
}

export type GameBoard = Cell[][]; // Убираем null, всегда есть фишки

export interface Position {
  row: number;
  col: number;
}
export type CellState = 'normal' | 'removed' | 'new';