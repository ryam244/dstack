# Phase 0: プロジェクトセットアップ - 詳細仕様書

## デザインコンセプト（確定版）

添付画像を参考に、**3Dレンダリング風の洗練されたモダンデザイン**を採用します。
従来の「ドット絵」コンセプトから、より現代的で質感のあるビジュアルに変更。

---

## 1. 環境構築（0.1）

### 必要なツール
```bash
# Node.js (推奨: v18以上)
node --version

# Expo CLI
npm install -g expo-cli
npm install -g eas-cli

# プロジェクト作成
npx create-expo-app@latest DungeonStack --template tabs
cd DungeonStack

# 必要なパッケージ
npx expo install expo-av              # サウンド/BGM
npx expo install expo-haptics         # 触覚フィードバック
npx expo install @react-native-async-storage/async-storage
npx expo install zustand              # 状態管理
npx expo install react-native-reanimated  # スムーズなアニメーション
npx expo install expo-linear-gradient     # グラデーション効果
```

### Git設定
```bash
git init
git add .
git commit -m "Initial project setup with Expo tabs template"
```

---

## 2. 基本設定（0.2）

### 2.1 `constants/Colors.ts` - カラーパレット

画像から抽出した配色を基に定義します。

```typescript
/**
 * Dungeon Stack Color Palette
 * モダンでダークなテーマを基調に、温かみのあるアクセントカラーを使用
 */

export const Colors = {
  // ベースカラー（背景・UI）
  background: {
    primary: '#1a1d2e',      // ダークブルーグレー（メイン背景）
    secondary: '#242838',    // ライトダークブルー（カード背景）
    modal: 'rgba(0, 0, 0, 0.85)',  // モーダル背景
  },

  // アクセントカラー
  accent: {
    primary: '#ffb84d',      // ゴールデンイエロー（ボタン、ハイライト）
    secondary: '#4da6ff',    // シアンブルー（セカンダリボタン）
    success: '#4dff88',      // 明るいグリーン（成功時）
    danger: '#ff4d6d',       // ピンクレッド（ダメージ、敵）
  },

  // テキストカラー
  text: {
    primary: '#f5f5dc',      // ベージュホワイト（メインテキスト）
    secondary: '#9da5b4',    // グレー（サブテキスト）
    dark: '#2a2d3a',         // ダークグレー（ボタン内テキスト）
    gold: '#ffd700',         // ゴールド（スコア、金貨）
  },

  // アイテムカラー（3D風レンダリング用）
  items: {
    sword: {
      base: '#c0c0c0',       // シルバーメタル
      edge: '#e8e8e8',       // ハイライト
      shadow: '#606060',     // シャドウ
    },
    shield: {
      base: '#8b7355',       // ブロンズ
      metal: '#b8a488',      // メタル部分
      shadow: '#5a4a3a',
    },
    potion: {
      glass: 'rgba(255, 100, 120, 0.6)',  // 半透明ガラス
      liquid: '#ff4d6d',     // 赤い液体
      cap: '#8b4513',        // 茶色の蓋
    },
    coin: {
      base: '#ffd700',       // ゴールド
      highlight: '#ffed4e',  // ハイライト
      shadow: '#cc9a00',     // シャドウ
    },
  },

  // 敵カラー
  enemies: {
    slime: '#4dff88',        // 緑スライム
    goblin: '#ff8b4d',       // オレンジゴブリン
    orc: '#8b4d4d',          // 赤茶色オーク
    dragon: '#4d4d8b',       // 紫ドラゴン
  },

  // UIエレメント
  ui: {
    leather: '#8b6f47',      // レザー風フレーム
    leatherDark: '#5a4a37',  // ダークレザー
    stitching: '#d4a76a',    // ステッチ（縫い目）
    cardBg: '#2d3142',       // カード背景
    cardBorder: '#4a5073',   // カードボーダー
    shadow: 'rgba(0, 0, 0, 0.4)',
  },

  // グラデーション
  gradients: {
    button: ['#ffb84d', '#ff9f1c'],  // ゴールデンボタン
    card: ['#2d3142', '#242838'],    // カード背景
    health: ['#ff4d6d', '#ff1744'],  // HPバー
    energy: ['#4da6ff', '#1976d2'],  // エネルギーバー
  },
};

export type ColorScheme = typeof Colors;
```

### 2.2 `constants/Layout.ts` - レイアウト定数

```typescript
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Dungeon Stack Layout Constants
 * iPhone 14 Pro (393 x 852) を基準に設計
 */

export const Layout = {
  // スクリーン情報
  window: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },

  // ゲーム盤面 (The Bag)
  board: {
    columns: 7,              // 横7列
    rows: 10,                // 縦10行
    padding: 16,             // 盤面の余白
    gap: 2,                  // ブロック間の隙間

    // ブロックサイズ（画面幅に応じて自動計算）
    get blockSize() {
      const availableWidth = SCREEN_WIDTH - (this.padding * 2);
      const totalGap = this.gap * (this.columns - 1);
      return Math.floor((availableWidth - totalGap) / this.columns);
    },

    // 盤面全体のサイズ
    get totalWidth() {
      return (this.blockSize * this.columns) + (this.gap * (this.columns - 1));
    },
    get totalHeight() {
      return (this.blockSize * this.rows) + (this.gap * (this.rows - 1));
    },
  },

  // Hero Line（プレイヤー表示エリア）
  heroLine: {
    height: 60,
    iconSize: 48,
    padding: 8,
  },

  // ステータスバー
  statusBar: {
    height: 80,
    padding: 16,
    iconSize: 32,
  },

  // カード UI
  card: {
    width: SCREEN_WIDTH * 0.85,  // 画面幅の85%
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

  // フォントサイズ
  fontSize: {
    tiny: 10,
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 28,
    xxlarge: 36,
    title: 48,
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

  // アニメーション
  animation: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: {
      // expo-easing に合わせた値
      linear: [0.25, 0.1, 0.25, 1],
      easeIn: [0.42, 0, 1, 1],
      easeOut: [0, 0, 0.58, 1],
      easeInOut: [0.42, 0, 0.58, 1],
    },
  },

  // Z-index層
  zIndex: {
    background: 0,
    board: 1,
    block: 2,
    ui: 10,
    modal: 100,
    overlay: 1000,
  },
};

export type LayoutScheme = typeof Layout;
```

### 2.3 `constants/GameConfig.ts` - ゲームパラメータ

```typescript
/**
 * Dungeon Stack Game Configuration
 * ゲームバランスに関わる全パラメータを定義
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
    fast: 50,            // 高速落下（Flick Down時）
    afterMatch: 200,     // マッチ後の再配置
  },

  // マッチング条件
  matching: {
    minBlocks: 3,        // 最低3つで消去可能
    directions: ['horizontal', 'vertical'] as const,  // 斜めは無し
  },

  // 戦闘
  combat: {
    swordDamage: 1,      // 通常の剣のダメージ
    bigSwordDamage: 3,   // 大剣（進化後）のダメージ
    shieldDurability: 1, // 盾が防げるダメージ回数
    potionHeal: 20,      // 薬3つマッチ時の回復量
  },

  // 敵の基本データ
  enemies: {
    slime: {
      hp: 1,
      attack: 5,
      spawnWeight: 40,   // 出現率の重み（%）
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
      fallSpeed: 250,    // 素早く落ちる
    },
    orc: {
      hp: 3,
      attack: 15,
      spawnWeight: 10,
    },
  },

  // ボス
  boss: {
    dragon: {
      hp: 10,
      attack: 25,
      appearStages: [5, 10, 15, 20],  // 登場ステージ
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
    // 合計100%
  },

  // ステージ設定
  stage: {
    wavesPerStage: 5,    // 1ステージあたりのWAVE数
    enemiesPerWave: 3,   // 1WAVEあたりの敵数（初期）
    difficultyScale: 1.2, // ステージごとの難易度倍率
  },

  // 難易度別の調整値
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
    comboMultiplier: 1.5,  // コンボ時の倍率
  },

  // 金貨獲得
  coinReward: {
    perStage: 50,
    perEnemy: 10,
    perCoinBlock: 5,
  },
};

export type GameConfigScheme = typeof GameConfig;

// 難易度タイプ
export type Difficulty = keyof typeof GameConfig.difficulty;
export type EnemyType = keyof typeof GameConfig.enemies;
```

### 2.4 `constants/Items.ts` - アイテム定義

```typescript
/**
 * Dungeon Stack Item Definitions
 * アイテム・敵の基本データとメタデータ
 */

export type ItemType = 'sword' | 'shield' | 'potion' | 'coin';
export type EnemyType = 'slime' | 'goblin' | 'bat' | 'orc' | 'dragon';
export type BlockType = ItemType | EnemyType;

// アイテムメタデータ
export interface ItemMeta {
  id: ItemType;
  name: string;
  nameJa: string;
  description: string;
  descriptionJa: string;
  icon: string;  // アセットのパス
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  stackable: boolean;  // 3つ揃えられるか
  evolvable: boolean;  // 進化可能か
  evolveCount?: number;  // 進化に必要な数
}

export const ItemDefinitions: Record<ItemType, ItemMeta> = {
  sword: {
    id: 'sword',
    name: 'Sword',
    nameJa: '剣',
    description: 'Match 3 to evolve into Big Sword. Attack adjacent enemies.',
    descriptionJa: '3つ揃えると大剣に進化。隣接する敵を攻撃します。',
    icon: 'assets/items/sword.png',
    rarity: 'common',
    stackable: true,
    evolvable: true,
    evolveCount: 3,
  },
  shield: {
    id: 'shield',
    name: 'Shield',
    nameJa: '盾',
    description: 'Blocks 1 damage when enemy reaches Hero Line.',
    descriptionJa: '敵がHero Lineに到達した時、1ダメージを防ぎます。',
    icon: 'assets/items/shield.png',
    rarity: 'common',
    stackable: false,
    evolvable: false,
  },
  potion: {
    id: 'potion',
    name: 'Potion',
    nameJa: '薬',
    description: 'Match 3 to restore 20 HP.',
    descriptionJa: '3つ揃えるとHP20回復します。',
    icon: 'assets/items/potion.png',
    rarity: 'common',
    stackable: true,
    evolvable: false,
  },
  coin: {
    id: 'coin',
    name: 'Gold Coin',
    nameJa: '金貨',
    description: 'Match to earn coins. Used for permanent upgrades.',
    descriptionJa: 'マッチすると金貨を獲得。永続強化に使用できます。',
    icon: 'assets/items/coin.png',
    rarity: 'common',
    stackable: true,
    evolvable: false,
  },
};

// 敵メタデータ
export interface EnemyMeta {
  id: EnemyType;
  name: string;
  nameJa: string;
  hp: number;
  attack: number;
  sprite: string;  // アセットのパス
  description: string;
  descriptionJa: string;
}

export const EnemyDefinitions: Record<EnemyType, EnemyMeta> = {
  slime: {
    id: 'slime',
    name: 'Slime',
    nameJa: 'スライム',
    hp: 1,
    attack: 5,
    sprite: 'assets/enemies/slime.png',
    description: 'The weakest enemy. Easy to defeat.',
    descriptionJa: '最弱の敵。簡単に倒せます。',
  },
  goblin: {
    id: 'goblin',
    name: 'Goblin',
    nameJa: 'ゴブリン',
    hp: 2,
    attack: 10,
    sprite: 'assets/enemies/goblin.png',
    description: 'A common foe with moderate strength.',
    descriptionJa: 'よくいる敵。そこそこ強い。',
  },
  bat: {
    id: 'bat',
    name: 'Bat',
    nameJa: 'コウモリ',
    hp: 1,
    attack: 3,
    sprite: 'assets/enemies/bat.png',
    description: 'Fast falling enemy with low attack.',
    descriptionJa: '素早く落ちてくる敵。攻撃力は低い。',
  },
  orc: {
    id: 'orc',
    name: 'Orc',
    nameJa: 'オーク',
    hp: 3,
    attack: 15,
    sprite: 'assets/enemies/orc.png',
    description: 'A strong enemy with high HP.',
    descriptionJa: '強敵。HPが高い。',
  },
  dragon: {
    id: 'dragon',
    name: 'Dragon',
    nameJa: 'ドラゴン',
    hp: 10,
    attack: 25,
    sprite: 'assets/enemies/dragon.png',
    description: 'Boss monster. Extremely dangerous.',
    descriptionJa: 'ボス級モンスター。非常に危険。',
  },
};

// ユーティリティ関数
export const getItemMeta = (type: ItemType): ItemMeta => {
  return ItemDefinitions[type];
};

export const getEnemyMeta = (type: EnemyType): EnemyMeta => {
  return EnemyDefinitions[type];
};

export const isItem = (type: BlockType): type is ItemType => {
  return type in ItemDefinitions;
};

export const isEnemy = (type: BlockType): type is EnemyType => {
  return type in EnemyDefinitions;
};
```

---

## 3. デザインアセット準備（0.5）

### 必要なアセットリスト

#### アイテムアイコン（3Dレンダリング風、256x256px推奨）
- [ ] `assets/items/sword.png` - シルバーの剣
- [ ] `assets/items/big-sword.png` - 進化後の大剣
- [ ] `assets/items/shield.png` - 木製/金属の盾
- [ ] `assets/items/potion.png` - 赤い薬瓶
- [ ] `assets/items/coin.png` - ゴールドコイン

#### 敵スプライト（256x256px推奨）
- [ ] `assets/enemies/slime.png` - 緑スライム
- [ ] `assets/enemies/goblin.png` - オレンジゴブリン
- [ ] `assets/enemies/bat.png` - 黒コウモリ
- [ ] `assets/enemies/orc.png` - 赤茶色オーク
- [ ] `assets/enemies/dragon.png` - 紫ドラゴン

#### プレイヤースプライト（128x128px推奨）
- [ ] `assets/hero/idle.png` - 待機状態
- [ ] `assets/hero/damaged.png` - ダメージ状態
- [ ] `assets/hero/heal.png` - 回復状態
- [ ] `assets/hero/victory.png` - 勝利ポーズ

#### UIエレメント
- [ ] `assets/ui/leather-frame.png` - レザー風フレーム（9-slice対応）
- [ ] `assets/ui/card-bg.png` - カード背景
- [ ] `assets/ui/button-primary.png` - ゴールデンボタン
- [ ] `assets/ui/button-secondary.png` - ブルーボタン

#### エフェクト
- [ ] `assets/effects/explosion.png` - 爆発エフェクト（スプライトシート）
- [ ] `assets/effects/sparkle.png` - キラキラエフェクト
- [ ] `assets/effects/slash.png` - 斬撃エフェクト

#### サウンド
- [ ] `assets/sounds/bgm-main.mp3` - メインBGM（ループ）
- [ ] `assets/sounds/bgm-boss.mp3` - ボス戦BGM
- [ ] `assets/sounds/match.mp3` - マッチ音
- [ ] `assets/sounds/attack.mp3` - 攻撃音
- [ ] `assets/sounds/damaged.mp3` - ダメージ音
- [ ] `assets/sounds/heal.mp3` - 回復音
- [ ] `assets/sounds/coin.mp3` - 金貨獲得音
- [ ] `assets/sounds/victory.mp3` - 勝利ファンファーレ
- [ ] `assets/sounds/game-over.mp3` - ゲームオーバー音

### アセット入手方法の提案

1. **フリー素材サイト**
   - [itch.io](https://itch.io/game-assets/free) - ゲーム素材の宝庫
   - [OpenGameArt.org](https://opengameart.org) - CC0ライセンスの素材多数
   - [Kenney.nl](https://kenney.nl/assets) - 高品質なフリー素材

2. **AI生成**
   - Midjourney / DALL-E 3 で「3D rendered game icon, leather texture」などで生成
   - 統一感を出すためにプロンプトを固定

3. **外注**
   - Fiverr / Coconala で3Dアイコンセットを発注（$50-$200程度）

---

## 確認事項・質問

### ✅ 確認が必要な項目

#### 1. **デザインの方向性**
- 添付画像のような「3Dレンダリング風」でOKですか？
  - ✅ Yes → 3D風のアセットを準備
  - ❌ No → ドット絵風に変更

#### 2. **アニメーションの複雑さ**
- リッチなアニメーション（パーティクル、スプリングアニメーション）を実装しますか？
  - react-native-reanimated v3 を使用してヌルヌル動かす
  - または、シンプルなフェード・スケールのみ

#### 3. **サウンドの方向性**
- 8bitチップチューン？それともオーケストラ風？
  - 添付画像の雰囲気からは「モダンな冒険音楽」が合いそう

#### 4. **バックエンド（Supabase）の必要性**
- Phase 3のランキング機能まで不要なら、Phase 0では設定スキップ可能
  - ローカルストレージ（AsyncStorage）のみで開始

#### 5. **開発環境**
- Mac / Windows / Linux？
  - iOSシミュレータが使えるか（Macのみ）
  - Androidエミュレータで開発するか

#### 6. **ターゲットデバイス**
- 主にiPhone？Android？両方？
  - iPhone SE（小画面）までサポートするか
  - タブレット対応は不要？

#### 7. **リリース時期の希望**
- 3ヶ月でPhase 3まで完成させる？
  - それともMVP（Phase 1）を1ヶ月で素早くリリース？

#### 8. **アセットの準備**
- 自前で用意？AI生成？フリー素材？外注？
  - 予算があれば外注がクオリティ高い

#### 9. **多言語対応**
- 日本語のみ？英語も？
  - Phase 0で i18n ライブラリを入れるか

#### 10. **テストの方針**
- E2Eテスト（Detox）まで実施する？
  - それともマニュアルテストのみ？

---

## 次のステップ（確認後）

上記の確認事項に回答いただければ、以下を開始できます：

1. **プロジェクト作成コマンドの実行**
2. **4つの定数ファイルの作成**（Colors, Layout, GameConfig, Items）
3. **型定義ファイルの作成**
4. **Zustandストアの初期化**
5. **アセット準備の具体的な手順**

**所要時間**: 回答後、2-3時間で完了予定

---

## 補足：画像から読み取ったデザインの特徴

### 画像1（タイトル画面）
- 3Dレンダリングされたブロック（テトリスのような立体感）
- 鮮やかなブルー、オレンジ、イエローの配色
- モダンで洗練されたフォント
- シンプルで視認性の高いUI

### 画像2（ゲームプレイ）
- レザー風の茶色いフレーム（ステッチ付き）
- グリッドベースのパズル（7x8程度？）
- アイテムカードが左右に配置（インベントリ的）
- 上部にリソース表示（数字のカウンター）
- ダークグリーンの背景

### 画像3（ショップ/アップグレード）
- カード形式のUI（縦スクロール可能？）
- 各カードに価格とレベル表示
- ハート、宝石、リュックなどのアイコン
- ダークテーマとベージュ色の組み合わせ
- 「BUY」ボタンが明瞭

これらの要素を **Dungeon Stack** に取り入れます！
