import React from 'react';
import { Cell, Position } from '../types/game';
import './Gem.css';

interface GemProps {
  cell: Cell;
  position: Position;
  isSelected: boolean;
  isSwapping?: boolean;
  isRemoving?: boolean;
  isFalling?: boolean;
  isNew?: boolean;
  isDragging?: boolean;
  swapDirection?: { dx: number; dy: number };
  onMouseDown: (position: Position) => void;
  onMouseEnter: (position: Position) => void;
  onMouseUp: () => void;
  onTouchStart: (e: React.TouchEvent, position: Position) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onClick: (position: Position) => void;
}

const getGemSymbol = (type: string): string => {
  const symbols: { [key: string]: string } = {
    red: '♦',
    blue: '●',
    green: '▲',
    yellow: '★',
    purple: '◆'
  };
  return symbols[type] || '○';
};

const Gem: React.FC<GemProps> = ({ 
  cell, 
  position, 
  isSelected, 
  isSwapping = false,
  isRemoving = false,
  isFalling = false,
  isNew = false,
  isDragging = false,
  swapDirection = { dx: 0, dy: 0 },
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onClick 
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isRemoving && !isSwapping) {
      onClick(position);
    }
  };

  return (
    <div 
      className={`gem gem-${cell.type} ${isSelected ? 'gem-selected' : ''} ${isDragging ? 'gem-dragging' : ''} ${isSwapping ? 'gem-swapping' : ''} ${isRemoving ? 'gem-removing' : ''} ${isFalling ? 'gem-falling' : ''} ${isNew ? 'gem-new' : ''}`}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown(position);
      }}
      onMouseEnter={() => onMouseEnter(position)}
      onMouseUp={onMouseUp}
      onTouchStart={(e) => onTouchStart(e, position)}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={handleClick}
      data-testid={`gem-${position.row}-${position.col}`}
      data-gem-position={`${position.row}-${position.col}`}
      title={`${cell.type} gem`}
      style={isSwapping ? {
        '--swap-dx': `${swapDirection.dx * 40}px`,
        '--swap-dy': `${swapDirection.dy * 40}px`,
      } as React.CSSProperties : {}}
    >
      <span className="gem-symbol">
        {getGemSymbol(cell.type)}
      </span>
    </div>
  );
};

export default Gem;