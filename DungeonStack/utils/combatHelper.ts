/**
 * Combat Helper Utility
 * 戦闘処理のヘルパー関数
 */

import { Block, EnemyType } from '../types';
import { isEnemy } from '../constants/Items';
import { GameConfig } from '../constants/GameConfig';

/**
 * 指定位置の周囲8方向の座標を取得
 */
const getAdjacentPositions = (x: number, y: number): Array<{ x: number; y: number }> => {
  return [
    { x: x - 1, y: y - 1 }, // 左上
    { x: x, y: y - 1 },     // 上
    { x: x + 1, y: y - 1 }, // 右上
    { x: x - 1, y: y },     // 左
    { x: x + 1, y: y },     // 右
    { x: x - 1, y: y + 1 }, // 左下
    { x: x, y: y + 1 },     // 下
    { x: x + 1, y: y + 1 }, // 右下
  ];
};

/**
 * 指定位置に隣接する敵ブロックを取得
 */
export const findAdjacentEnemies = (
  board: (Block | null)[][],
  x: number,
  y: number
): Block[] => {
  const adjacentPositions = getAdjacentPositions(x, y);
  const enemies: Block[] = [];

  adjacentPositions.forEach(pos => {
    if (pos.y >= 0 && pos.y < board.length && pos.x >= 0 && pos.x < board[0].length) {
      const block = board[pos.y][pos.x];
      if (block && isEnemy(block.type) && block.hp && block.hp > 0) {
        enemies.push(block);
      }
    }
  });

  return enemies;
};

/**
 * 敵にダメージを与える
 */
export const damageEnemy = (
  board: (Block | null)[][],
  enemy: Block,
  damage: number
): (Block | null)[][] => {
  const newBoard = board.map(row => [...row]);
  const enemyBlock = newBoard[enemy.y][enemy.x];

  if (!enemyBlock || !enemyBlock.hp) {
    return newBoard;
  }

  const newHp = enemyBlock.hp - damage;

  if (newHp <= 0) {
    // 敵を撃破
    newBoard[enemy.y][enemy.x] = null;
  } else {
    // HPを減らす
    newBoard[enemy.y][enemy.x] = {
      ...enemyBlock,
      hp: newHp,
    };
  }

  return newBoard;
};

/**
 * 複数の敵にダメージを与える
 */
export const damageMultipleEnemies = (
  board: (Block | null)[][],
  enemies: Block[],
  damage: number
): (Block | null)[][] => {
  let newBoard = board;

  enemies.forEach(enemy => {
    newBoard = damageEnemy(newBoard, enemy, damage);
  });

  return newBoard;
};

/**
 * 撃破した敵の数をカウント
 */
export const countDefeatedEnemies = (
  beforeBoard: (Block | null)[][],
  afterBoard: (Block | null)[][]
): number => {
  let count = 0;

  for (let y = 0; y < beforeBoard.length; y++) {
    for (let x = 0; x < beforeBoard[y].length; x++) {
      const before = beforeBoard[y][x];
      const after = afterBoard[y][x];

      if (before && isEnemy(before.type) && !after) {
        count++;
      }
    }
  }

  return count;
};

/**
 * 盾ブロックをカウント
 */
export const countShields = (board: (Block | null)[][]): number => {
  let count = 0;

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const block = board[y][x];
      if (block && block.type === 'shield') {
        count++;
      }
    }
  }

  return count;
};

/**
 * 最下段（Hero Line）の敵をチェック
 */
export const findEnemiesAtHeroLine = (board: (Block | null)[][]): Block[] => {
  const heroLineY = board.length - 1;
  const enemies: Block[] = [];

  for (let x = 0; x < board[heroLineY].length; x++) {
    const block = board[heroLineY][x];
    if (block && isEnemy(block.type) && block.attack) {
      enemies.push(block);
    }
  }

  return enemies;
};

/**
 * Hero Lineの敵を削除
 */
export const removeEnemiesAtHeroLine = (
  board: (Block | null)[][]
): (Block | null)[][] => {
  const newBoard = board.map(row => [...row]);
  const heroLineY = board.length - 1;

  for (let x = 0; x < newBoard[heroLineY].length; x++) {
    const block = newBoard[heroLineY][x];
    if (block && isEnemy(block.type)) {
      newBoard[heroLineY][x] = null;
    }
  }

  return newBoard;
};

/**
 * 盾を1つ消費
 */
export const consumeShield = (board: (Block | null)[][]): (Block | null)[][] => {
  const newBoard = board.map(row => [...row]);

  // 下から順に盾を探して削除
  for (let y = board.length - 1; y >= 0; y--) {
    for (let x = 0; x < board[y].length; x++) {
      const block = newBoard[y][x];
      if (block && block.type === 'shield') {
        newBoard[y][x] = null;
        return newBoard;
      }
    }
  }

  return newBoard;
};

/**
 * 剣マッチ時の攻撃処理
 */
export const processSwordAttack = (
  board: (Block | null)[][],
  swordPositions: Array<{ x: number; y: number }>,
  swordCount: number
): {
  newBoard: (Block | null)[][];
  defeatedEnemies: number;
} => {
  let newBoard = board;
  const beforeBoard = board.map(row => [...row]);

  // 剣の数に応じたダメージ
  const damage = swordCount >= 3 ? GameConfig.combat.bigSwordDamage : GameConfig.combat.swordDamage;

  // 各剣の位置から隣接する敵を攻撃
  swordPositions.forEach(pos => {
    const adjacentEnemies = findAdjacentEnemies(newBoard, pos.x, pos.y);
    newBoard = damageMultipleEnemies(newBoard, adjacentEnemies, damage);
  });

  const defeatedEnemies = countDefeatedEnemies(beforeBoard, newBoard);

  return { newBoard, defeatedEnemies };
};
