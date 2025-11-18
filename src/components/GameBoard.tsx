import React, { useState, useEffect } from 'react';
import { GameBoard as BoardType, Position } from '../types/game';
import { createInitialBoard, swapCells, arePositionsEqual } from '../utils/gameUtils';
import { processMatches, findAllMatches } from '../utils/boardUpdater';
import { useAnimations } from '../hooks/useAnimations';
import Gem from './Gem';
import './GameBoard.css';

const GameBoard: React.FC = () => {
  const [board, setBoard] = useState<BoardType>([]);
  const [selectedCell, setSelectedCell] = useState<Position | null>(null);
  const [score, setScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Используем хук анимаций
  const {
    startSwapAnimation,
    startRemoveAnimation,
    startFallAnimation,
    startNewGemAnimation,
    isSwapping,
    isRemoving,
    isFalling,
    isNew,
    getSwapDirection
  } = useAnimations();

  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    const newBoard = createInitialBoard();
    setBoard(newBoard);
    setScore(0);
    setSelectedCell(null);
    setIsAnimating(false);
  };

  // Функция для обработки всех каскадных совпадений с анимациями
  const processAllMatches = async (currentBoard: BoardType): Promise<{ board: BoardType; scoreAdded: number }> => {
    let board = currentBoard;
    let totalScore = 0;
    let hasMoreMatches = true;

    while (hasMoreMatches) {
      const matches = findAllMatches(board);
      
      if (matches.length > 0) {
        // Анимация удаления
        startRemoveAnimation(matches);
        totalScore += matches.length * 10;
        
        // Ждем анимацию удаления
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Обновляем доску (удаляем совпадения)
        const result = processMatches(board);
        board = result.newBoard;
        setBoard([...board]);
        setScore(prev => prev + matches.length * 10);
        
        // Ждем перед падением
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Анимация падения (в реальной игре нужно вычислять какие фишки падают)
        const fallingPositions = board.flatMap((row, rowIndex) => 
          row.map((_, colIndex) => ({ row: rowIndex, col: colIndex }))
        );
        startFallAnimation(fallingPositions);
        
        // Ждем анимацию падения
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Анимация новых фишек
        const newGemPositions = board.flatMap((row, rowIndex) => 
          row.map((_, colIndex) => ({ row: rowIndex, col: colIndex }))
        );
        startNewGemAnimation(newGemPositions);
        
        // Ждем анимацию появления
        await new Promise(resolve => setTimeout(resolve, 700));
      } else {
        hasMoreMatches = false;
      }
    }

    return { board, scoreAdded: totalScore };
  };

  const handleCellClick = async (position: Position) => {
    if (isAnimating) return;
    
    if (!selectedCell) {
      setSelectedCell(position);
      return;
    }

    if (arePositionsEqual(selectedCell, position)) {
      setSelectedCell(null);
      return;
    }

    const isAdjacent = 
      (Math.abs(selectedCell.row - position.row) === 1 && selectedCell.col === position.col) ||
      (Math.abs(selectedCell.col - position.col) === 1 && selectedCell.row === position.row);

    if (isAdjacent) {
      setIsAnimating(true);
      
      // Запускаем анимацию обмена
      startSwapAnimation(selectedCell, position);
      
      // Ждем начала анимации
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Меняем фишки местами
      const newBoard = swapCells(board, selectedCell, position);
      setBoard([...newBoard]);
      
      // Ждем завершения анимации обмена
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Проверяем есть ли совпадения после обмена
      const matches = findAllMatches(newBoard);
      
      if (matches.length > 0) {
        // Есть совпадения - обрабатываем каскад
        await processAllMatches(newBoard);
      } else {
        // Нет совпадений - возвращаем обратно с анимацией
        await new Promise(resolve => setTimeout(resolve, 300));
        startSwapAnimation(position, selectedCell);
        await new Promise(resolve => setTimeout(resolve, 100));
        const revertedBoard = swapCells(newBoard, position, selectedCell);
        setBoard([...revertedBoard]);
        await new Promise(resolve => setTimeout(resolve, 400));
      }
      
      setSelectedCell(null);
      setIsAnimating(false);
    } else {
      setSelectedCell(position);
    }
  };

  if (board.length === 0) {
    return <div className="loading">Loading game...</div>;
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>✨ Match Three Game ✨</h1>
        <div className="score">Score: {score}</div>
        <button onClick={initializeBoard} className="reset-button" disabled={isAnimating}>
          {isAnimating ? 'Processing...' : 'New Game'}
        </button>
        {isAnimating && (
          <div className="processing-matches">
            <div className="spinner"></div>
            Processing matches...
          </div>
        )}
      </div>
      
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => {
              const position = { row: rowIndex, col: colIndex };
              const swapDirection = selectedCell ? 
                getSwapDirection(selectedCell, position) : { dx: 0, dy: 0 };
              
              return (
                <Gem
                  key={cell.id}
                  cell={cell}
                  position={position}
                  isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                  isSwapping={isSwapping(position)}
                  isRemoving={isRemoving(position)}
                  isFalling={isFalling(position)}
                  isNew={isNew(position)}
                  swapDirection={swapDirection}
                  onClick={handleCellClick}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;