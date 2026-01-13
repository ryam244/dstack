# Phase 0: 最終仕様書（確定版）

## プロジェクト概要

**アプリ名**: Dungeon Stack
**開発期間**: 1ヶ月でMVP完成
**デザインスタイル**: 3Dレンダリング風（モダンで洗練されたビジュアル）
**開発環境**: Mac + Expo + iOSシミュレーター
**ターゲット**: iPhone（SE〜最新機種）
**多言語**: 日本語 + 英語対応
**テスト**: E2Eテスト（Detox）実施

---

## Phase 0 実装チェックリスト

### 0.1 環境構築（所要時間: 30分）

#### 必須ツールの確認
```bash
# Node.js確認（v18以上推奨）
node --version

# Expo CLI確認
npm list -g expo-cli

# EAS CLI確認
npm list -g eas-cli
```

#### プロジェクト作成
```bash
# Expo Tabs テンプレートでプロジェクト作成
npx create-expo-app@latest DungeonStack --template tabs

cd DungeonStack

# Git初期化
git init
git add .
git commit -m "Initial project setup with Expo tabs template"
```

#### 必要なパッケージのインストール
```bash
# 状態管理
npm install zustand

# アニメーション（リッチ実装用）
npx expo install react-native-reanimated

# サウンド・BGM
npx expo install expo-av

# 触覚フィードバック
npx expo install expo-haptics

# ローカルストレージ
npx expo install @react-native-async-storage/async-storage

# UI関連
npx expo install expo-linear-gradient
npx expo install expo-blur

# 多言語対応（i18n）
npm install i18next react-i18next

# E2Eテスト（Detox）
npm install --save-dev detox
npm install --save-dev jest

# 型チェック強化
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

#### プロジェクト構造の準備
```bash
mkdir -p constants
mkdir -p types
mkdir -p store
mkdir -p hooks
mkdir -p utils
mkdir -p components/game
mkdir -p components/shop
mkdir -p components/upgrades
mkdir -p assets/items
mkdir -p assets/enemies
mkdir -p assets/hero
mkdir -p assets/ui
mkdir -p assets/effects
mkdir -p assets/sounds
mkdir -p locales/en
mkdir -p locales/ja
```

---

### 0.2 基本設定ファイルの作成（所要時間: 2時間）

#### ✅ タスク1: `constants/Colors.ts`

3Dレンダリング風に最適化されたカラーパレット

```typescript
/**
 * Dungeon Stack Color Palette
 * 3D-rendered modern design with warm accents
 */

export const Colors = {
  // ベースカラー
  background: {
    primary: '#1a1d2e',      // ダークブルーグレー
    secondary: '#242838',    // ライトダークブルー
    modal: 'rgba(0, 0, 0, 0.85)',
    game: '#0f1419',         // ゲーム盤面の背景
  },

  // アクセントカラー
  accent: {
    primary: '#ffb84d',      // ゴールデンイエロー（メインボタン）
    secondary: '#4da6ff',    // シアンブルー（セカンダリ）
    success: '#4dff88',      // ブライトグリーン（成功）
    danger: '#ff4d6d',       // ピンクレッド（ダメージ）
    warning: '#ffa64d',      // オレンジ（警告）
  },

  // テキストカラー
  text: {
    primary: '#f5f5dc',      // ベージュホワイト
    secondary: '#9da5b4',    // グレー
    dark: '#2a2d3a',         // ダークグレー（ボタン内）
    gold: '#ffd700',         // ゴールド（スコア）
    white: '#ffffff',
  },

  // アイテムカラー（3D風レンダリング用）
  items: {
    sword: {
      base: '#c0c0c0',       // シルバー
      edge: '#e8e8e8',       // ハイライト
      shadow: '#606060',     // シャドウ
      glow: '#4da6ff',       // グロー効果
    },
    shield: {
      base: '#8b7355',       // ブロンズ
      metal: '#b8a488',
      shadow: '#5a4a3a',
      glow: '#ffb84d',
    },
    potion: {
      glass: 'rgba(255, 100, 120, 0.7)',
      liquid: '#ff4d6d',
      cap: '#8b4513',
      glow: '#ff4d6d',
    },
    coin: {
      base: '#ffd700',
      highlight: '#ffed4e',
      shadow: '#cc9a00',
      glow: '#ffa64d',
    },
  },

  // 敵カラー
  enemies: {
    slime: '#4dff88',        // グリーン
    goblin: '#ff8b4d',       // オレンジ
    bat: '#a64dff',          // パープル
    orc: '#8b4d4d',          // レッドブラウン
    dragon: '#4d4d8b',       // ダークパープル
  },

  // UIエレメント
  ui: {
    leather: '#8b6f47',      // レザー風
    leatherDark: '#5a4a37',
    stitching: '#d4a76a',    // ステッチ
    cardBg: '#2d3142',
    cardBorder: '#4a5073',
    shadow: 'rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },

  // グラデーション（LinearGradient用）
  gradients: {
    button: ['#ffb84d', '#ff9f1c'],
    buttonSecondary: ['#4da6ff', '#1976d2'],
    card: ['#2d3142', '#242838'],
    health: ['#ff4d6d', '#ff1744'],
    energy: ['#4da6ff', '#1976d2'],
    gold: ['#ffd700', '#ffb84d'],
  },
};

export type ColorScheme = typeof Colors;
```

#### ✅ タスク2: `constants/Layout.ts`

レスポンシブ対応のレイアウト定数（iPhone SE対応）

```typescript
import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Dungeon Stack Layout Constants
 * iPhone SE (375 x 667) ~ iPhone 15 Pro Max (430 x 932) 対応
 */

export const Layout = {
  // スクリーン情報
  window: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },

  // デバイスタイプ判定
  device: {
    isSmall: SCREEN_WIDTH <= 375,    // iPhone SE
    isMedium: SCREEN_WIDTH <= 390,   // iPhone 14
    isLarge: SCREEN_WIDTH > 390,     // iPhone 14 Pro Max
  },

  // ゲーム盤面 (The Bag)
  board: {
    columns: 7,
    rows: 10,
    padding: 16,
    gap: 2,

    // ブロックサイズ（自動計算）
    get blockSize() {
      const availableWidth = SCREEN_WIDTH - (this.padding * 2);
      const totalGap = this.gap * (this.columns - 1);
      const size = Math.floor((availableWidth - totalGap) / this.columns);
      return Math.max(40, Math.min(size, 60)); // 40px〜60pxの範囲に制限
    },

    get totalWidth() {
      return (this.blockSize * this.columns) + (this.gap * (this.columns - 1));
    },

    get totalHeight() {
      return (this.blockSize * this.rows) + (this.gap * (this.rows - 1));
    },
  },

  // Hero Line
  heroLine: {
    height: 60,
    iconSize: 48,
    padding: 8,
    get marginBottom() {
      return Layout.device.isSmall ? 8 : 16;
    },
  },

  // ステータスバー
  statusBar: {
    height: Platform.select({ ios: 100, android: 80 }),
    padding: 16,
    iconSize: 32,
  },

  // カード UI
  card: {
    width: SCREEN_WIDTH * 0.85,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    shadowRadius: 8,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },

  // ボタン
  button: {
    large: {
      height: 56,
      borderRadius: 28,
      paddingHorizontal: 32,
    },
    medium: {
      height: 44,
      borderRadius: 22,
      paddingHorizontal: 24,
    },
    small: {
      height: 36,
      borderRadius: 18,
      paddingHorizontal: 16,
    },
  },

  // フォントサイズ（レスポンシブ）
  fontSize: {
    get tiny() { return Layout.device.isSmall ? 9 : 10; },
    get small() { return Layout.device.isSmall ? 11 : 12; },
    get medium() { return Layout.device.isSmall ? 14 : 16; },
    get large() { return Layout.device.isSmall ? 18 : 20; },
    get xlarge() { return Layout.device.isSmall ? 24 : 28; },
    get xxlarge() { return Layout.device.isSmall ? 32 : 36; },
    get title() { return Layout.device.isSmall ? 40 : 48; },
  },

  // スペーシング
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // アニメーション設定
  animation: {
    duration: {
      instant: 100,
      fast: 200,
      normal: 300,
      slow: 500,
      verySlow: 800,
    },
    spring: {
      damping: 15,
      stiffness: 150,
      mass: 1,
    },
  },

  // Z-index層
  zIndex: {
    background: 0,
    board: 1,
    block: 2,
    blockFalling: 3,
    ui: 10,
    modal: 100,
    overlay: 1000,
    toast: 2000,
  },
};

export type LayoutScheme = typeof Layout;
```

#### ✅ タスク3: `constants/GameConfig.ts`

ゲームバランス調整用のパラメータ

```typescript
/**
 * Dungeon Stack Game Configuration
 * 1ヶ月MVP版の調整済みパラメータ
 */

export const GameConfig = {
  // プレイヤー初期値
  player: {
    initialHP: 100,
    initialMaxHP: 100,
    initialCoins: 0,
  },

  // ブロック落下速度（ミリ秒/マス）
  blockFall: {
    normal: 500,         // 通常落下
    fast: 50,            // 高速落下
    afterMatch: 200,     // マッチ後の再配置
  },

  // マッチング条件
  matching: {
    minBlocks: 3,
    directions: ['horizontal', 'vertical'] as const,
  },

  // 戦闘
  combat: {
    swordDamage: 1,
    bigSwordDamage: 3,
    shieldDurability: 1,
    potionHeal: 20,
  },

  // 敵の基本データ
  enemies: {
    slime: {
      hp: 1,
      attack: 5,
      spawnWeight: 40,
    },
    goblin: {
      hp: 2,
      attack: 10,
      spawnWeight: 30,
    },
    bat: {
      hp: 1,
      attack: 3,
      spawnWeight: 20,
      fallSpeed: 250,
    },
    orc: {
      hp: 3,
      attack: 15,
      spawnWeight: 10,
    },
  },

  // ボス（MVP版は1体のみ）
  boss: {
    dragon: {
      hp: 10,
      attack: 25,
      appearStages: [5],  // MVPはステージ5のみ
      coinReward: 500,
    },
  },

  // アイテム出現率（%）
  itemSpawnRate: {
    sword: 25,
    shield: 20,
    potion: 20,
    coin: 15,
    enemy: 20,
  },

  // ステージ設定（MVP版は5ステージ）
  stage: {
    totalStages: 5,
    wavesPerStage: 5,
    enemiesPerWave: 3,
    difficultyScale: 1.2,
  },

  // 難易度別調整
  difficulty: {
    casual: {
      enemyAttackMultiplier: 0.7,
      playerHPMultiplier: 1.5,
      coinMultiplier: 1.0,
    },
    normal: {
      enemyAttackMultiplier: 1.0,
      playerHPMultiplier: 1.0,
      coinMultiplier: 1.0,
    },
    hardcore: {
      enemyAttackMultiplier: 1.5,
      playerHPMultiplier: 0.7,
      coinMultiplier: 1.5,
    },
  },

  // スコアリング
  scoring: {
    perBlockMatch: 10,
    perEnemyKill: 50,
    perStageComplete: 200,
    perBossKill: 1000,
    comboMultiplier: 1.5,
  },

  // 金貨獲得
  coinReward: {
    perStage: 50,
    perEnemy: 10,
    perCoinBlock: 5,
  },

  // 永続強化（MVP版）
  permanentUpgrades: {
    maxHPBoost: {
      cost: 100,
      increment: 10,
      maxLevel: 5,
    },
    boardExpansion: {
      cost: 500,
      maxLevel: 2,  // 最大7→9列
    },
    startingCoins: {
      cost: 200,
      increment: 50,
      maxLevel: 3,
    },
  },
};

export type GameConfigScheme = typeof GameConfig;
export type Difficulty = keyof typeof GameConfig.difficulty;
export type EnemyType = keyof typeof GameConfig.enemies;
```

#### ✅ タスク4: `constants/Items.ts`

アイテム・敵のメタデータ（多言語対応）

```typescript
/**
 * Dungeon Stack Item Definitions
 * 多言語対応（日本語・英語）
 */

export type ItemType = 'sword' | 'shield' | 'potion' | 'coin';
export type EnemyType = 'slime' | 'goblin' | 'bat' | 'orc' | 'dragon';
export type BlockType = ItemType | EnemyType;

export interface ItemMeta {
  id: ItemType;
  name: {
    en: string;
    ja: string;
  };
  description: {
    en: string;
    ja: string;
  };
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  stackable: boolean;
  evolvable: boolean;
  evolveCount?: number;
}

export const ItemDefinitions: Record<ItemType, ItemMeta> = {
  sword: {
    id: 'sword',
    name: {
      en: 'Sword',
      ja: '剣',
    },
    description: {
      en: 'Match 3 to evolve into Big Sword. Attack adjacent enemies.',
      ja: '3つ揃えると大剣に進化。隣接する敵を攻撃します。',
    },
    icon: 'assets/items/sword.png',
    rarity: 'common',
    stackable: true,
    evolvable: true,
    evolveCount: 3,
  },
  shield: {
    id: 'shield',
    name: {
      en: 'Shield',
      ja: '盾',
    },
    description: {
      en: 'Blocks 1 damage when enemy reaches Hero Line.',
      ja: '敵がHero Lineに到達した時、1ダメージを防ぎます。',
    },
    icon: 'assets/items/shield.png',
    rarity: 'common',
    stackable: false,
    evolvable: false,
  },
  potion: {
    id: 'potion',
    name: {
      en: 'Potion',
      ja: '薬',
    },
    description: {
      en: 'Match 3 to restore 20 HP.',
      ja: '3つ揃えるとHP20回復します。',
    },
    icon: 'assets/items/potion.png',
    rarity: 'common',
    stackable: true,
    evolvable: false,
  },
  coin: {
    id: 'coin',
    name: {
      en: 'Gold Coin',
      ja: '金貨',
    },
    description: {
      en: 'Match to earn coins. Used for permanent upgrades.',
      ja: 'マッチすると金貨を獲得。永続強化に使用できます。',
    },
    icon: 'assets/items/coin.png',
    rarity: 'common',
    stackable: true,
    evolvable: false,
  },
};

export interface EnemyMeta {
  id: EnemyType;
  name: {
    en: string;
    ja: string;
  };
  hp: number;
  attack: number;
  sprite: string;
  description: {
    en: string;
    ja: string;
  };
}

export const EnemyDefinitions: Record<EnemyType, EnemyMeta> = {
  slime: {
    id: 'slime',
    name: { en: 'Slime', ja: 'スライム' },
    hp: 1,
    attack: 5,
    sprite: 'assets/enemies/slime.png',
    description: {
      en: 'The weakest enemy. Easy to defeat.',
      ja: '最弱の敵。簡単に倒せます。',
    },
  },
  goblin: {
    id: 'goblin',
    name: { en: 'Goblin', ja: 'ゴブリン' },
    hp: 2,
    attack: 10,
    sprite: 'assets/enemies/goblin.png',
    description: {
      en: 'A common foe with moderate strength.',
      ja: 'よくいる敵。そこそこ強い。',
    },
  },
  bat: {
    id: 'bat',
    name: { en: 'Bat', ja: 'コウモリ' },
    hp: 1,
    attack: 3,
    sprite: 'assets/enemies/bat.png',
    description: {
      en: 'Fast falling enemy with low attack.',
      ja: '素早く落ちてくる敵。攻撃力は低い。',
    },
  },
  orc: {
    id: 'orc',
    name: { en: 'Orc', ja: 'オーク' },
    hp: 3,
    attack: 15,
    sprite: 'assets/enemies/orc.png',
    description: {
      en: 'A strong enemy with high HP.',
      ja: '強敵。HPが高い。',
    },
  },
  dragon: {
    id: 'dragon',
    name: { en: 'Dragon', ja: 'ドラゴン' },
    hp: 10,
    attack: 25,
    sprite: 'assets/enemies/dragon.png',
    description: {
      en: 'Boss monster. Extremely dangerous.',
      ja: 'ボス級モンスター。非常に危険。',
    },
  },
};

// ユーティリティ関数
export const getItemMeta = (type: ItemType): ItemMeta => ItemDefinitions[type];
export const getEnemyMeta = (type: EnemyType): EnemyMeta => EnemyDefinitions[type];
export const isItem = (type: BlockType): type is ItemType => type in ItemDefinitions;
export const isEnemy = (type: BlockType): type is EnemyType => type in EnemyDefinitions;
```

---

### 0.3 型定義ファイルの作成（所要時間: 1時間）

#### ✅ タスク5: `types/index.ts`

```typescript
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
```

---

### 0.4 Zustand ストアの作成（所要時間: 1.5時間）

#### ✅ タスク6: `store/gameStore.ts`

```typescript
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
```

#### ✅ タスク7: `store/playerStore.ts`

```typescript
/**
 * Player Data Management (Persistent)
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlayerData } from '../types';

interface PlayerStore extends PlayerData {
  // アクション
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  upgradeLevel: (upgradeId: string) => boolean;
  updateHighScore: (score: number) => void;
  setLanguage: (lang: 'en' | 'ja') => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  toggleHaptic: () => void;
  resetData: () => void;
}

const STORAGE_KEY = '@DungeonStack:PlayerData';

const initialData: PlayerData = {
  totalCoins: 0,
  highScore: 0,
  upgrades: {},
  settings: {
    language: 'en',
    soundEnabled: true,
    musicEnabled: true,
    hapticEnabled: true,
  },
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  ...initialData,

  loadData: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        set(parsed);
      }
    } catch (error) {
      console.error('Failed to load player data:', error);
    }
  },

  saveData: async () => {
    try {
      const data = get();
      const { loadData, saveData, ...persistData } = data;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(persistData));
    } catch (error) {
      console.error('Failed to save player data:', error);
    }
  },

  addCoins: (amount) => {
    set((state) => ({
      totalCoins: state.totalCoins + amount,
    }));
    get().saveData();
  },

  spendCoins: (amount) => {
    const { totalCoins } = get();
    if (totalCoins >= amount) {
      set({ totalCoins: totalCoins - amount });
      get().saveData();
      return true;
    }
    return false;
  },

  upgradeLevel: (upgradeId) => {
    const { upgrades } = get();
    const currentLevel = upgrades[upgradeId] || 0;
    set({
      upgrades: {
        ...upgrades,
        [upgradeId]: currentLevel + 1,
      },
    });
    get().saveData();
    return true;
  },

  updateHighScore: (score) => {
    const { highScore } = get();
    if (score > highScore) {
      set({ highScore: score });
      get().saveData();
    }
  },

  setLanguage: (lang) => {
    set((state) => ({
      settings: { ...state.settings, language: lang },
    }));
    get().saveData();
  },

  toggleSound: () => {
    set((state) => ({
      settings: {
        ...state.settings,
        soundEnabled: !state.settings.soundEnabled,
      },
    }));
    get().saveData();
  },

  toggleMusic: () => {
    set((state) => ({
      settings: {
        ...state.settings,
        musicEnabled: !state.settings.musicEnabled,
      },
    }));
    get().saveData();
  },

  toggleHaptic: () => {
    set((state) => ({
      settings: {
        ...state.settings,
        hapticEnabled: !state.settings.hapticEnabled,
      },
    }));
    get().saveData();
  },

  resetData: () => {
    set(initialData);
    get().saveData();
  },
}));
```

---

### 0.5 多言語対応（i18n）の設定（所要時間: 1時間）

#### ✅ タスク8: `locales/en/translation.json`

```json
{
  "common": {
    "start": "Start",
    "continue": "Continue",
    "pause": "Pause",
    "resume": "Resume",
    "quit": "Quit",
    "retry": "Retry",
    "confirm": "Confirm",
    "cancel": "Cancel",
    "buy": "Buy",
    "upgrade": "Upgrade",
    "back": "Back"
  },
  "game": {
    "title": "Dungeon Stack",
    "stage": "Stage {{number}}",
    "wave": "Wave {{number}}",
    "hp": "HP",
    "score": "Score",
    "coins": "Coins",
    "gameOver": "Game Over",
    "victory": "Victory!",
    "finalScore": "Final Score: {{score}}",
    "coinsEarned": "Coins Earned: {{coins}}"
  },
  "difficulty": {
    "casual": "Casual",
    "normal": "Normal",
    "hardcore": "Hardcore",
    "casualDesc": "70% enemy damage, 150% HP",
    "normalDesc": "Standard difficulty",
    "hardcoreDesc": "150% enemy damage, 70% HP, 150% coins"
  },
  "upgrades": {
    "title": "Upgrades",
    "maxHP": "Max HP Boost",
    "maxHPDesc": "Increase maximum HP by 10",
    "boardExpansion": "Board Expansion",
    "boardExpansionDesc": "Add 1 column to the board",
    "startingCoins": "Starting Coins",
    "startingCoinsDesc": "Start with +50 coins",
    "level": "Level {{level}}/{{max}}",
    "cost": "Cost: {{amount}} coins",
    "maxLevel": "Max Level"
  }
}
```

#### ✅ タスク9: `locales/ja/translation.json`

```json
{
  "common": {
    "start": "スタート",
    "continue": "続ける",
    "pause": "一時停止",
    "resume": "再開",
    "quit": "終了",
    "retry": "リトライ",
    "confirm": "確認",
    "cancel": "キャンセル",
    "buy": "購入",
    "upgrade": "強化",
    "back": "戻る"
  },
  "game": {
    "title": "Dungeon Stack",
    "stage": "ステージ {{number}}",
    "wave": "ウェーブ {{number}}",
    "hp": "HP",
    "score": "スコア",
    "coins": "金貨",
    "gameOver": "ゲームオーバー",
    "victory": "勝利！",
    "finalScore": "最終スコア: {{score}}",
    "coinsEarned": "獲得金貨: {{coins}}"
  },
  "difficulty": {
    "casual": "カジュアル",
    "normal": "ノーマル",
    "hardcore": "ハードコア",
    "casualDesc": "敵ダメージ70%、HP150%",
    "normalDesc": "標準的な難易度",
    "hardcoreDesc": "敵ダメージ150%、HP70%、金貨150%"
  },
  "upgrades": {
    "title": "永続強化",
    "maxHP": "最大HP強化",
    "maxHPDesc": "最大HPを10増やす",
    "boardExpansion": "盤面拡張",
    "boardExpansionDesc": "盤面に1列追加する",
    "startingCoins": "初期金貨",
    "startingCoinsDesc": "金貨50枚でスタート",
    "level": "レベル {{level}}/{{max}}",
    "cost": "コスト: {{amount}}金貨",
    "maxLevel": "最大レベル"
  }
}
```

#### ✅ タスク10: `utils/i18n.ts`

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from '../locales/en/translation.json';
import ja from '../locales/ja/translation.json';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: { translation: en },
      ja: { translation: ja },
    },
    lng: Localization.locale.startsWith('ja') ? 'ja' : 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

---

### 0.6 E2Eテストの設定（所要時間: 1時間）

#### ✅ タスク11: `.detoxrc.js`

```javascript
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/DungeonStack.app',
      build: 'xcodebuild -workspace ios/DungeonStack.xcworkspace -scheme DungeonStack -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 15',
      },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
  },
};
```

#### ✅ タスク12: `e2e/jest.config.js`

```javascript
module.exports = {
  rootDir: '..',
  testMatch: ['<rootDir>/e2e/**/*.test.js'],
  testTimeout: 120000,
  maxWorkers: 1,
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: ['detox/runners/jest/reporter'],
  testEnvironment: 'detox/runners/jest/testEnvironment',
  verbose: true,
};
```

---

## Phase 0 完了条件

- [ ] ✅ プロジェクトが作成され、全パッケージがインストールされている
- [ ] ✅ 4つの定数ファイル（Colors, Layout, GameConfig, Items）が作成されている
- [ ] ✅ 型定義ファイル（types/index.ts）が作成されている
- [ ] ✅ 2つのZustandストア（gameStore, playerStore）が作成されている
- [ ] ✅ i18n設定（英語・日本語）が完了している
- [ ] ✅ Detoxのテスト環境が設定されている
- [ ] ✅ AIで生成したアセットが準備されている（次のドキュメント参照）

---

## 次のステップ

Phase 0完了後、すぐに**Phase 1（MVP開発）**に進みます。

**次のドキュメント**: `AI_ASSET_GENERATION_PROMPTS.md`（AIアセット生成用プロンプト集）
