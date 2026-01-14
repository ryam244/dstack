/**
 * Block Matching Utility
 * ブロックのマッチング判定（3つ揃え）
 */

import { Block, ItemType } from '../types';
import { isItem } from '../constants/Items';
import { GameConfig } from '../constants/GameConfig';

export interface MatchGroup {
  blocks: Block[];
  type: ItemType;
}

/**
 * 指定位置から横方向に同じタイプのブロックを探す
 */
const findHorizontalMatches = (
  board: (Block | null)[][],
  startY: number,
  startX: number
): Block[] => {
  const startBlock = board[startY][startX];
  if (!startBlock || !isItem(startBlock.type)) {
    return [];
  }

  const matches: Block[] = [startBlock];
  const targetType = startBlock.type;

  // 右方向に探索
  for (let x = startX + 1; x < board[0].length; x++) {
    const block = board[startY][x];
    if (block && block.type === targetType && isItem(block.type)) {
      matches.push(block);
    } else {
      break;
    }
  }

  // 左方向に探索
  for (let x = startX - 1; x >= 0; x--) {
    const block = board[startY][x];
    if (block && block.type === targetType && isItem(block.type)) {
      matches.unshift(block);
    } else {
      break;
    }
  }

  return matches.length >= GameConfig.matching.minBlocks ? matches : [];
};

/**
 * 指定位置から縦方向に同じタイプのブロックを探す
 */
const findVerticalMatches = (
  board: (Block | null)[][],
  startY: number,
  startX: number
): Block[] => {
  const startBlock = board[startY][startX];
  if (!startBlock || !isItem(startBlock.type)) {
    return [];
  }

  const matches: Block[] = [startBlock];
  const targetType = startBlock.type;

  // 下方向に探索
  for (let y = startY + 1; y < board.length; y++) {
    const block = board[y][startX];
    if (block && block.type === targetType && isItem(block.type)) {
      matches.push(block);
    } else {
      break;
    }
  }

  // 上方向に探索
  for (let y = startY - 1; y >= 0; y--) {
    const block = board[y][startX];
    if (block && block.type === targetType && isItem(block.type)) {
      matches.unshift(block);
    } else {
      break;
    }
  }

  return matches.length >= GameConfig.matching.minBlocks ? matches : [];
};

/**
 * ボード全体からマッチングを検出
 */
export const findAllMatches = (board: (Block | null)[][]): MatchGroup[] => {
  const matchedIds = new Set<string>();
  const matchGroups: MatchGroup[] = [];

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const block = board[y][x];
      if (!block || matchedIds.has(block.id) || !isItem(block.type)) {
        continue;
      }

      // 横方向のマッチ
      const horizontalMatches = findHorizontalMatches(board, y, x);
      if (horizontalMatches.length > 0) {
        horizontalMatches.forEach(b => matchedIds.add(b.id));
        matchGroups.push({
          blocks: horizontalMatches,
          type: block.type as ItemType,
        });
      }

      // 縦方向のマッチ
      const verticalMatches = findVerticalMatches(board, y, x);
      if (verticalMatches.length > 0) {
        const newMatches = verticalMatches.filter(b => !matchedIds.has(b.id));
        if (newMatches.length >= GameConfig.matching.minBlocks) {
          newMatches.forEach(b => matchedIds.add(b.id));
          matchGroups.push({
            blocks: newMatches,
            type: block.type as ItemType,
          });
        }
      }
    }
  }

  return matchGroups;
};

/**
 * マッチしたブロックをボードから削除
 */
export const removeMatchedBlocks = (
  board: (Block | null)[][],
  matchGroups: MatchGroup[]
): (Block | null)[][] => {
  const matchedIds = new Set<string>();
  matchGroups.forEach(group => {
    group.blocks.forEach(block => matchedIds.add(block.id));
  });

  const newBoard = board.map(row =>
    row.map(block => (block && matchedIds.has(block.id) ? null : block))
  );

  return newBoard;
};

/**
 * ブロックを下に落とす（重力処理）
 */
export const applyGravity = (board: (Block | null)[][]): (Block | null)[][] => {
  const newBoard: (Block | null)[][] = Array(board.length)
    .fill(null)
    .map(() => Array(board[0].length).fill(null));

  // 各列ごとに処理
  for (let x = 0; x < board[0].length; x++) {
    const column: Block[] = [];

    // 下から上に向かってnullでないブロックを集める
    for (let y = board.length - 1; y >= 0; y--) {
      const block = board[y][x];
      if (block) {
        column.push(block);
      }
    }

    // 下から配置
    for (let i = 0; i < column.length; i++) {
      const newY = board.length - 1 - i;
      newBoard[newY][x] = {
        ...column[i],
        y: newY,
        falling: false,
      };
    }
  }

  return newBoard;
};

/**
 * マッチしたブロック数をカウント
 */
export const countMatchedBlocks = (matchGroups: MatchGroup[]): number => {
  return matchGroups.reduce((sum, group) => sum + group.blocks.length, 0);
};

/**
 * マッチタイプごとのカウント
 */
export const countByType = (matchGroups: MatchGroup[]): Record<ItemType, number> => {
  const counts: Partial<Record<ItemType, number>> = {};

  matchGroups.forEach(group => {
    counts[group.type] = (counts[group.type] || 0) + group.blocks.length;
  });

  return counts as Record<ItemType, number>;
};
