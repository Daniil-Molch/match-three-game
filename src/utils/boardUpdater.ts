import { GameBoard, Cell } from '../types/game';
import { GEM_TYPES } from './gameUtils';

// Создаем новую фишку
const createGem = (row: number, col: number): Cell => ({
  type: GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)],
  id: `gem-${row}-${col}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
});

// Находим все совпадения на доске
export const findAllMatches = (board: GameBoard): { row: number; col: number }[] => {
  const matches: { row: number; col: number }[] = [];
  const rows = board.length;
  const cols = board[0].length;

  // Проверка горизонтальных совпадений
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols - 2; col++) {
      const cell = board[row][col];
      if (cell.type === board[row][col + 1].type && 
          cell.type === board[row][col + 2].type) {
        // Добавляем всю линию из 3+ фишек
        let endCol = col + 2;
        while (endCol + 1 < cols && board[row][endCol + 1].type === cell.type) {
          endCol++;
        }
        for (let c = col; c <= endCol; c++) {
          matches.push({ row, col: c });
        }
      }
    }
  }

  // Проверка вертикальных совпадений
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows - 2; row++) {
      const cell = board[row][col];
      if (cell.type === board[row + 1][col].type && 
          cell.type === board[row + 2][col].type) {
        // Добавляем всю линию из 3+ фишек
        let endRow = row + 2;
        while (endRow + 1 < rows && board[endRow + 1][col].type === cell.type) {
          endRow++;
        }
        for (let r = row; r <= endRow; r++) {
          matches.push({ row: r, col });
        }
      }
    }
  }

  // Убираем дубликаты
  return matches.filter((pos, index, self) => 
    index === self.findIndex(p => p.row === pos.row && p.col === pos.col)
  );
};

// Удаляем совпадения и заставляем фишки падать
export const removeMatchesAndRefill = (board: GameBoard, matches: { row: number; col: number }[]): GameBoard => {
  if (matches.length === 0) return board;

  const rows = board.length;
  const cols = board[0].length;
  
  // Создаем копию доски
  const newBoard: GameBoard = [];
  for (let i = 0; i < rows; i++) {
    newBoard.push([...board[i]]);
  }

  // Шаг 1: Помечаем позиции для удаления
  const positionsToRemove = new Set();
  matches.forEach(match => {
    positionsToRemove.add(`${match.row}-${match.col}`);
  });

  // Шаг 2: Для каждой колонки собираем фишки, которые остаются
  for (let col = 0; col < cols; col++) {
    const remainingGems: Cell[] = [];
    
    // Собираем все фишки, которые НЕ удаляются (снизу вверх)
    for (let row = rows - 1; row >= 0; row--) {
      if (!positionsToRemove.has(`${row}-${col}`)) {
        remainingGems.push(newBoard[row][col]);
      }
    }

    // Заполняем колонку: снизу - оставшиеся фишки, сверху - новые
    for (let row = rows - 1; row >= 0; row--) {
      if (remainingGems.length > 0) {
        // Берем фишку из оставшихся
        newBoard[row][col] = remainingGems.shift()!;
      } else {
        // Создаем новую фишку для верхних рядов
        newBoard[row][col] = createGem(row, col);
      }
    }
  }

  return newBoard;
};

// Основная функция для обработки одного цикла
export const processMatches = (board: GameBoard): { newBoard: GameBoard; matchesFound: number } => {
  const matches = findAllMatches(board);
  
  if (matches.length === 0) {
    return { newBoard: board, matchesFound: 0 };
  }

  const newBoard = removeMatchesAndRefill(board, matches);
  return { newBoard, matchesFound: matches.length };
};

// Проверяем есть ли хотя бы один возможный ход
export const hasValidMoves = (board: GameBoard): boolean => {
  const rows = board.length;
  const cols = board[0].length;

  // Проверяем все возможные обмены
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Проверяем обмен с правой фишкой
      if (col < cols - 1) {
        const tempBoard = board.map(r => [...r]);
        // Меняем местами
        [tempBoard[row][col], tempBoard[row][col + 1]] = 
        [tempBoard[row][col + 1], tempBoard[row][col]];
        
        if (findAllMatches(tempBoard).length > 0) {
          return true;
        }
      }
      
      // Проверяем обмен с нижней фишкой
      if (row < rows - 1) {
        const tempBoard = board.map(r => [...r]);
        // Меняем местами
        [tempBoard[row][col], tempBoard[row + 1][col]] = 
        [tempBoard[row + 1][col], tempBoard[row][col]];
        
        if (findAllMatches(tempBoard).length > 0) {
          return true;
        }
      }
    }
  }
  
  return false;
};