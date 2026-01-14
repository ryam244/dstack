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
    button: ['#ffb84d', '#ff9f1c'] as const,
    buttonSecondary: ['#4da6ff', '#1976d2'] as const,
    card: ['#2d3142', '#242838'] as const,
    health: ['#ff4d6d', '#ff1744'] as const,
    energy: ['#4da6ff', '#1976d2'] as const,
    gold: ['#ffd700', '#ffb84d'] as const,
  },
};

export type ColorScheme = typeof Colors;
