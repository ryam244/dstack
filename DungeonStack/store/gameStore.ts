/**
 * Game State Management (Zustand)
 */

import { create } from 'zustand';
import { GameState, PlayerState } from '../types';
import { GameConfig } from '../constants/GameConfig';

interface GameStore extends GameState {
  // アクション
  startGame: (difficulty: 'casual' | 'normal' | 'hardcore') => void;
  pauseGame: () => void;
  resumeGame: () => void;
  gameOver: () => void;
  victory: () => void;
  updatePlayer: (updates: Partial<PlayerState>) => void;
  damagePlayer: (amount: number) => void;
  healPlayer: (amount: number) => void;
  addCoins: (amount: number) => void;
  nextWave: () => void;
  nextStage: () => void;
  resetGame: () => void;
}

const initialPlayerState: PlayerState = {
  hp: GameConfig.player.initialHP,
  maxHp: GameConfig.player.initialMaxHP,
  coins: 0,
  totalCoinsEarned: 0,
  score: 0,
  stage: 1,
  wave: 1,
  difficulty: 'normal',
};

export const useGameStore = create<GameStore>((set, get) => ({
  board: Array(10).fill(null).map(() => Array(7).fill(null)),
  player: initialPlayerState,
  currentBlock: null,
  isPaused: false,
  isGameOver: false,
  isVictory: false,

  startGame: (difficulty) => {
    const multiplier = GameConfig.difficulty[difficulty].playerHPMultiplier;
    set({
      board: Array(10).fill(null).map(() => Array(7).fill(null)),
      player: {
        ...initialPlayerState,
        difficulty,
        maxHp: Math.floor(initialPlayerState.maxHp * multiplier),
        hp: Math.floor(initialPlayerState.hp * multiplier),
      },
      isPaused: false,
      isGameOver: false,
      isVictory: false,
    });
  },

  pauseGame: () => set({ isPaused: true }),
  resumeGame: () => set({ isPaused: false }),
  gameOver: () => set({ isGameOver: true, isPaused: true }),
  victory: () => set({ isVictory: true, isPaused: true }),

  updatePlayer: (updates) => {
    set((state) => ({
      player: { ...state.player, ...updates },
    }));
  },

  damagePlayer: (amount) => {
    const { player } = get();
    const difficulty = GameConfig.difficulty[player.difficulty];
    const actualDamage = Math.floor(amount * difficulty.enemyAttackMultiplier);
    const newHp = Math.max(0, player.hp - actualDamage);

    set((state) => ({
      player: { ...state.player, hp: newHp },
    }));

    if (newHp <= 0) {
      get().gameOver();
    }
  },

  healPlayer: (amount) => {
    set((state) => ({
      player: {
        ...state.player,
        hp: Math.min(state.player.maxHp, state.player.hp + amount),
      },
    }));
  },

  addCoins: (amount) => {
    set((state) => ({
      player: {
        ...state.player,
        coins: state.player.coins + amount,
        totalCoinsEarned: state.player.totalCoinsEarned + amount,
      },
    }));
  },

  nextWave: () => {
    set((state) => ({
      player: {
        ...state.player,
        wave: state.player.wave + 1,
      },
    }));
  },

  nextStage: () => {
    const { player } = get();
    if (player.stage >= GameConfig.stage.totalStages) {
      get().victory();
    } else {
      set((state) => ({
        player: {
          ...state.player,
          stage: state.player.stage + 1,
          wave: 1,
        },
      }));
    }
  },

  resetGame: () => {
    set({
      board: Array(10).fill(null).map(() => Array(7).fill(null)),
      player: initialPlayerState,
      currentBlock: null,
      isPaused: false,
      isGameOver: false,
      isVictory: false,
    });
  },
}));
