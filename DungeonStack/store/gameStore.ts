/**
 * Game State Management (Zustand)
 */

import { create } from 'zustand';
import { GameState, PlayerState, Block } from '../types';
import { GameConfig } from '../constants/GameConfig';
import { generateNewBlock, canMoveBlock, isBlockLanded } from '../utils/blockGenerator';
import { findAllMatches, removeMatchedBlocks, applyGravity, countByType } from '../utils/blockMatcher';

interface GameStore extends GameState {
  // プレイヤーアクション
  startGame: (difficulty: 'casual' | 'normal' | 'hardcore') => void;
  pauseGame: () => void;
  resumeGame: () => void;
  gameOver: () => void;
  victory: () => void;
  updatePlayer: (updates: Partial<PlayerState>) => void;
  damagePlayer: (amount: number) => void;
  healPlayer: (amount: number) => void;
  addCoins: (amount: number) => void;
  addScore: (amount: number) => void;
  nextWave: () => void;
  nextStage: () => void;
  resetGame: () => void;

  // ブロック操作アクション
  spawnNewBlock: () => void;
  moveBlockLeft: () => void;
  moveBlockRight: () => void;
  moveBlockDown: () => boolean; // 着地したらtrue
  dropBlock: () => void; // 一気に落とす
  landBlock: () => void;
  updateBoard: (board: (Block | null)[][]) => void;

  // マッチング & 消去アクション
  checkAndProcessMatches: () => void;
  processMatchEffects: (matchCounts: Record<string, number>) => void;
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

  addScore: (amount) => {
    set((state) => ({
      player: {
        ...state.player,
        score: state.player.score + amount,
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

  // ブロック操作アクション
  spawnNewBlock: () => {
    const { board, player } = get();
    const startX = Math.floor(board[0].length / 2); // 中央から開始

    // 敵の出現率（Waveが進むにつれて増加）
    const baseEnemyRate = 0.3;
    const enemySpawnRate = Math.min(0.6, baseEnemyRate + (player.wave * 0.05));

    const newBlock = generateNewBlock(startX, player.stage, player.wave, enemySpawnRate);

    // スポーン位置にすでにブロックがある場合はゲームオーバー
    if (board[0][startX] !== null) {
      get().gameOver();
      return;
    }

    set({ currentBlock: newBlock });
  },

  moveBlockLeft: () => {
    const { currentBlock, board } = get();
    if (!currentBlock || !currentBlock.falling) return;

    const newX = currentBlock.x - 1;
    if (canMoveBlock(board, currentBlock, newX, currentBlock.y)) {
      set({
        currentBlock: { ...currentBlock, x: newX },
      });
    }
  },

  moveBlockRight: () => {
    const { currentBlock, board } = get();
    if (!currentBlock || !currentBlock.falling) return;

    const newX = currentBlock.x + 1;
    if (canMoveBlock(board, currentBlock, newX, currentBlock.y)) {
      set({
        currentBlock: { ...currentBlock, x: newX },
      });
    }
  },

  moveBlockDown: () => {
    const { currentBlock, board } = get();
    if (!currentBlock || !currentBlock.falling) return false;

    // 着地判定
    if (isBlockLanded(board, currentBlock)) {
      get().landBlock();
      return true;
    }

    // 下に移動
    const newY = currentBlock.y + 1;
    set({
      currentBlock: { ...currentBlock, y: newY },
    });

    return false;
  },

  dropBlock: () => {
    const { currentBlock, board } = get();
    if (!currentBlock || !currentBlock.falling) return;

    let newY = currentBlock.y;
    while (!isBlockLanded(board, { ...currentBlock, y: newY })) {
      newY += 1;
    }

    set({
      currentBlock: { ...currentBlock, y: newY },
    });

    get().landBlock();
  },

  landBlock: () => {
    const { currentBlock, board } = get();
    if (!currentBlock) return;

    // ブロックを固定
    const newBoard = board.map(row => [...row]);
    newBoard[currentBlock.y][currentBlock.x] = {
      ...currentBlock,
      falling: false,
    };

    set({
      board: newBoard,
      currentBlock: null,
    });

    // マッチング判定を実行
    setTimeout(() => {
      get().checkAndProcessMatches();
    }, 100);
  },

  updateBoard: (board) => {
    set({ board });
  },

  // マッチング & 消去処理
  checkAndProcessMatches: () => {
    const { board } = get();

    // マッチングを検出
    const matchGroups = findAllMatches(board);

    if (matchGroups.length === 0) {
      return; // マッチなし
    }

    // マッチしたブロックを削除
    let newBoard = removeMatchedBlocks(board, matchGroups);

    // 重力を適用
    newBoard = applyGravity(newBoard);

    // ボード更新
    set({ board: newBoard });

    // マッチ効果を処理
    const matchCounts = countByType(matchGroups);
    get().processMatchEffects(matchCounts);

    // 連鎖チェック
    setTimeout(() => {
      get().checkAndProcessMatches();
    }, GameConfig.blocks.afterMatchDelay);
  },

  processMatchEffects: (matchCounts) => {
    const { addCoins, addScore, healPlayer } = get();

    // 各アイテムタイプごとに処理
    Object.entries(matchCounts).forEach(([type, count]) => {
      // スコア加算
      addScore(count * GameConfig.scoring.perBlockMatch);

      switch (type) {
        case 'sword':
          // 剣は戦闘システムで処理（後で実装）
          break;

        case 'shield':
          // 盾は戦闘システムで処理（後で実装）
          break;

        case 'potion':
          // 回復処理
          healPlayer(GameConfig.combat.potionHeal * Math.floor(count / 3));
          break;

        case 'coin':
          // 金貨獲得
          addCoins(GameConfig.coinReward.perCoinBlock * count);
          break;
      }
    });
  },
}));
