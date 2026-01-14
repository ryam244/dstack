/**
 * Dungeon Stack Type Definitions
 */

import { ItemType, EnemyType } from '../constants/Items';

// ブロックの基本型
export interface Block {
  id: string;
  type: ItemType | EnemyType;
  x: number;  // 0-6（または拡張後0-8）
  y: number;  // 0-9
  falling: boolean;
  matched: boolean;
  level?: number;  // 進化レベル（剣など）
}

// 敵ブロック
export interface Enemy extends Block {
  type: EnemyType;
  hp: number;
  maxHp: number;
  attack: number;
}

// プレイヤー状態
export interface PlayerState {
  hp: number;
  maxHp: number;
  coins: number;
  totalCoinsEarned: number;  // 永続強化用
  score: number;
  stage: number;
  wave: number;
  difficulty: 'casual' | 'normal' | 'hardcore';
}

// ゲーム状態
export interface GameState {
  board: (Block | null)[][];  // 7x10 のグリッド
  player: PlayerState;
  currentBlock: Block | null;
  isPaused: boolean;
  isGameOver: boolean;
  isVictory: boolean;
}

// 永続強化
export interface PermanentUpgrade {
  id: string;
  nameKey: string;  // i18n用のキー
  descriptionKey: string;
  cost: number;
  currentLevel: number;
  maxLevel: number;
  icon: string;
}

// プレイヤーデータ（永続保存）
export interface PlayerData {
  totalCoins: number;
  highScore: number;
  upgrades: Record<string, number>;  // upgradeId -> level
  settings: {
    language: 'en' | 'ja';
    soundEnabled: boolean;
    musicEnabled: boolean;
    hapticEnabled: boolean;
  };
}
