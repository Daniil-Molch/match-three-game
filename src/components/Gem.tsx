import React, { useState, useEffect } from 'react';
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
  swapDirection?: { dx: number; dy: number };
  onClick: (position: Position) => void;
}

// Функция для получения символа по типу фишки
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
  swapDirection = { dx: 0, dy: 0 },
  onClick 
}) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isSwapping) {
      setAnimationClass('gem-swapping');
    } else if (isRemoving) {
      setAnimationClass('gem-removing');
    } else if (isFalling) {
      setAnimationClass('gem-falling');
    } else if (isNew) {
      setAnimationClass('gem-new');
    } else {
      setAnimationClass('');
    }
  }, [isSwapping, isRemoving, isFalling, isNew]);

  const getSwapStyle = () => {
    if (isSwapping && swapDirection) {
      return {
        '--swap-dx': `${swapDirection.dx * 60}px`,
        '--swap-dy': `${swapDirection.dy * 60}px`,
      } as React.CSSProperties;
    }
    return {};
  };

  const handleClick = () => {
    if (!isRemoving && !isSwapping) {
      onClick(position);
    }
  };

  return (
    <div 
      className={`gem gem-${cell.type} ${isSelected ? 'gem-selected' : ''} ${animationClass}`}
      onClick={handleClick}
      data-testid={`gem-${position.row}-${position.col}`}
      title={`${cell.type} gem`}
      style={getSwapStyle()}
    >
      <span className="gem-symbol">
        {getGemSymbol(cell.type)}
      </span>
    </div>
  );
};

export default Gem;