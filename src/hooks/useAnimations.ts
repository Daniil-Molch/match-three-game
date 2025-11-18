import { useState, useCallback } from 'react';
import { Position } from '../types/game';

export interface AnimationState {
  swapping: Set<string>;
  removing: Set<string>;
  falling: Set<string>;
  newGems: Set<string>;
}

export const useAnimations = () => {
  const [animations, setAnimations] = useState<AnimationState>({
    swapping: new Set(),
    removing: new Set(),
    falling: new Set(),
    newGems: new Set()
  });

  const getPositionKey = (position: Position) => `${position.row}-${position.col}`;

  const startSwapAnimation = useCallback((from: Position, to: Position) => {
    const key1 = getPositionKey(from);
    const key2 = getPositionKey(to);
    
    setAnimations(prev => ({
      ...prev,
      swapping: new Set([key1, key2])
    }));

    // Автоматически убираем анимацию через время
    setTimeout(() => {
      setAnimations(prev => ({
        ...prev,
        swapping: new Set()
      }));
    }, 400);
  }, []);

  const startRemoveAnimation = useCallback((positions: Position[]) => {
    const keys = positions.map(getPositionKey);
    
    setAnimations(prev => ({
      ...prev,
      removing: new Set(keys)
    }));

    setTimeout(() => {
      setAnimations(prev => ({
        ...prev,
        removing: new Set()
      }));
    }, 500);
  }, []);

  const startFallAnimation = useCallback((positions: Position[]) => {
    const keys = positions.map(getPositionKey);
    
    setAnimations(prev => ({
      ...prev,
      falling: new Set(keys)
    }));

    setTimeout(() => {
      setAnimations(prev => ({
        ...prev,
        falling: new Set()
      }));
    }, 600);
  }, []);

  const startNewGemAnimation = useCallback((positions: Position[]) => {
    const keys = positions.map(getPositionKey);
    
    setAnimations(prev => ({
      ...prev,
      newGems: new Set(keys)
    }));

    setTimeout(() => {
      setAnimations(prev => ({
        ...prev,
        newGems: new Set()
      }));
    }, 700);
  }, []);

  const isSwapping = useCallback((position: Position) => {
    return animations.swapping.has(getPositionKey(position));
  }, [animations.swapping]);

  const isRemoving = useCallback((position: Position) => {
    return animations.removing.has(getPositionKey(position));
  }, [animations.removing]);

  const isFalling = useCallback((position: Position) => {
    return animations.falling.has(getPositionKey(position));
  }, [animations.falling]);

  const isNew = useCallback((position: Position) => {
    return animations.newGems.has(getPositionKey(position));
  }, [animations.newGems]);

  const getSwapDirection = useCallback((from: Position, to: Position) => {
    return {
      dx: to.col - from.col,
      dy: to.row - from.row
    };
  }, []);

  return {
    startSwapAnimation,
    startRemoveAnimation,
    startFallAnimation,
    startNewGemAnimation,
    isSwapping,
    isRemoving,
    isFalling,
    isNew,
    getSwapDirection
  };
};