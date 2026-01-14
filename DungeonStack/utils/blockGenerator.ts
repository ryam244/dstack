/**
 * Block Generator Utility
 * ランダムなブロック（アイテム/敵）を生成
 */

import { Block, ItemType, EnemyType } from '../types';
import { GameConfig } from '../constants/GameConfig';

let blockIdCounter = 0;

/**
 * ユニークなブロックIDを生成
 */
const generateBlockId = (): string => {
  blockIdCounter += 1;
  return `block-${Date.now()}-${blockIdCounter}`;
};

/**
 * ランダムなアイテムタイプを生成
 */
export const generateRandomItem = (): ItemType => {
  const items: ItemType[] = ['sword', 'shield', 'potion', 'coin'];
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
};

/**
 * ランダムな敵タイプを生成（ステージに応じた難易度調整）
 */
export const generateRandomEnemy = (stage: number, wave: number): EnemyType => {
  const enemies = GameConfig.enemies;

  // ステージに応じて出現する敵を制限
  let availableEnemies: EnemyType[] = ['slime'];

  if (stage >= 2) {
    availableEnemies.push('goblin');
  }
  if (stage >= 3) {
    availableEnemies.push('bat');
  }
  if (stage >= 4) {
    availableEnemies.push('orc');
  }

  // ボスステージ（5の倍数）ではドラゴンも出現
  if (stage % 5 === 0 && wave >= 3) {
    availableEnemies.push('dragon');
  }

  // 重み付けランダム選択
  const weights = availableEnemies.map(type => enemies[type].spawnWeight);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < availableEnemies.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return availableEnemies[i];
    }
  }

  return availableEnemies[0];
};

/**
 * 新しいブロックを生成（アイテムまたは敵）
 */
export const generateNewBlock = (
  x: number,
  stage: number,
  wave: number,
  enemySpawnRate: number = 0.3
): Block => {
  const isEnemy = Math.random() < enemySpawnRate;

  if (isEnemy) {
    const enemyType = generateRandomEnemy(stage, wave);
    const enemyConfig = GameConfig.enemies[enemyType];

    return {
      id: generateBlockId(),
      type: enemyType,
      x,
      y: 0,
      falling: true,
      matched: false,
      hp: enemyConfig.hp,
      attack: enemyConfig.attack,
    };
  } else {
    const itemType = generateRandomItem();

    return {
      id: generateBlockId(),
      type: itemType,
      x,
      y: 0,
      falling: true,
      matched: false,
      level: 1,
    };
  }
};

/**
 * ボード上の指定位置にブロックが存在するかチェック
 */
export const hasBlockAt = (board: (Block | null)[][], x: number, y: number): boolean => {
  if (y < 0 || y >= board.length || x < 0 || x >= board[0].length) {
    return true; // 範囲外は衝突とみなす
  }
  return board[y][x] !== null;
};

/**
 * ブロックを移動できるかチェック
 */
export const canMoveBlock = (
  board: (Block | null)[][],
  block: Block,
  newX: number,
  newY: number
): boolean => {
  // ボードの範囲チェック
  if (newX < 0 || newX >= board[0].length) {
    return false;
  }
  if (newY < 0 || newY >= board.length) {
    return false;
  }

  // 移動先にブロックがあるかチェック
  return !hasBlockAt(board, newX, newY);
};

/**
 * ブロックが着地したかチェック
 */
export const isBlockLanded = (board: (Block | null)[][], block: Block): boolean => {
  // 最下段に到達
  if (block.y >= board.length - 1) {
    return true;
  }

  // 下にブロックがある
  return hasBlockAt(board, block.x, block.y + 1);
};
