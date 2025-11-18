import { useState, useRef, useCallback } from 'react';
import { Position } from '../types/game';

interface DragState {
  isDragging: boolean;
  startPosition: Position | null;
  currentPosition: Position | null;
}

export const useDragDrop = (onSwap: (from: Position, to: Position) => void) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startPosition: null,
    currentPosition: null
  });

  const touchId = useRef<number | null>(null);

  const handleDragStart = useCallback((position: Position) => {
    setDragState({
      isDragging: true,
      startPosition: position,
      currentPosition: position
    });
  }, []);

  const handleDragMove = useCallback((position: Position) => {
    if (!dragState.isDragging || !dragState.startPosition) return;

    setDragState(prev => ({
      ...prev,
      currentPosition: position
    }));

    // Проверяем, является ли позиция соседней
    const { startPosition } = dragState;
    const isAdjacent = 
      (Math.abs(startPosition.row - position.row) === 1 && startPosition.col === position.col) ||
      (Math.abs(startPosition.col - position.col) === 1 && startPosition.row === position.row);

    if (isAdjacent && (startPosition.row !== position.row || startPosition.col !== position.col)) {
      onSwap(startPosition, position);
      setDragState({
        isDragging: false,
        startPosition: null,
        currentPosition: null
      });
    }
  }, [dragState.isDragging, dragState.startPosition, onSwap]);

  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      startPosition: null,
      currentPosition: null
    });
  }, []);

  // Обработчики для мыши
  const handleMouseDown = useCallback((position: Position) => {
    handleDragStart(position);
  }, [handleDragStart]);

  const handleMouseEnter = useCallback((position: Position) => {
    handleDragMove(position);
  }, [handleDragMove]);

  // Обработчики для тач-устройств
  const handleTouchStart = useCallback((e: React.TouchEvent, position: Position) => {
    if (touchId.current !== null) return; // Уже идет drag
    
    const touch = e.touches[0];
    touchId.current = touch.identifier;
    handleDragStart(position);
  }, [handleDragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchId.current === null || !dragState.isDragging) return;

    const touch = Array.from(e.touches).find(t => t.identifier === touchId.current);
    if (!touch) return;

    // Находим элемент под пальцем
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!element) return;

    const gemElement = element.closest('[data-gem-position]');
    if (!gemElement) return;

    const positionStr = gemElement.getAttribute('data-gem-position');
    if (!positionStr) return;

    const [row, col] = positionStr.split('-').map(Number);
    handleDragMove({ row, col });
  }, [dragState.isDragging, handleDragMove]);

  const handleTouchEnd = useCallback(() => {
    touchId.current = null;
    handleDragEnd();
  }, [handleDragEnd]);

  return {
    dragState,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp: handleDragEnd,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};