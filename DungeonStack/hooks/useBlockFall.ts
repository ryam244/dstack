/**
 * useBlockFall Hook
 * ブロックの自動落下とゲームループを管理
 */

import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { GameConfig } from '../constants/GameConfig';

export const useBlockFall = () => {
  const {
    currentBlock,
    isPaused,
    isGameOver,
    isVictory,
    spawnNewBlock,
    moveBlockDown,
  } = useGameStore();

  const fallIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // ゲームが停止中またはクリア済みの場合は何もしない
    if (isPaused || isGameOver || isVictory) {
      if (fallIntervalRef.current) {
        clearInterval(fallIntervalRef.current);
        fallIntervalRef.current = null;
      }
      return;
    }

    // 現在のブロックがない場合は新しいブロックを生成
    if (!currentBlock) {
      // 少し遅延を入れて次のブロックを生成
      const spawnTimeout = setTimeout(() => {
        spawnNewBlock();
      }, 500);

      return () => clearTimeout(spawnTimeout);
    }

    // ブロックの自動落下
    const fallSpeed = GameConfig.blocks.fallSpeed;
    fallIntervalRef.current = setInterval(() => {
      const landed = moveBlockDown();

      // 着地した場合は次のブロックを生成
      if (landed) {
        if (fallIntervalRef.current) {
          clearInterval(fallIntervalRef.current);
          fallIntervalRef.current = null;
        }
      }
    }, fallSpeed);

    return () => {
      if (fallIntervalRef.current) {
        clearInterval(fallIntervalRef.current);
        fallIntervalRef.current = null;
      }
    };
  }, [currentBlock, isPaused, isGameOver, isVictory, spawnNewBlock, moveBlockDown]);

  return {
    isActive: !!currentBlock && !isPaused && !isGameOver && !isVictory,
  };
};
