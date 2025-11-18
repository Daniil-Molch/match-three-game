import { GameBoard, Position } from '../types/game';

export const findMatches = (board: GameBoard): Position[] => {
  const matches: Position[] = [];
  const rows = board.length;
  const cols = board[0].length;

  // Проверка горизонтальных совпадений
  for (let row = 0; row < rows; row++) {
    let count = 1;
    for (let col = 1; col <= cols; col++) {
      if (col < cols && board[row][col]?.type === board[row][col - 1]?.type) {
        count++;
      } else {
        if (count >= 3) {
          for (let i = col - count; i < col; i++) {
            matches.push({ row, col: i });
          }
        }
        count = 1;
      }
    }
  }

  // Проверка вертикальных совпадений
  for (let col = 0; col < cols; col++) {
    let count = 1;
    for (let row = 1; row <= rows; row++) {
      if (row < rows && board[row]?.[col]?.type === board[row - 1]?.[col]?.type) {
        count++;
      } else {
        if (count >= 3) {
          for (let i = row - count; i < row; i++) {
            matches.push({ row: i, col });
          }
        }
        count = 1;
      }
    }
  }

  // Убираем дубликаты
  return matches.filter((pos, index, self) => 
    index === self.findIndex(p => p.row === pos.row && p.col === pos.col)
  );
};