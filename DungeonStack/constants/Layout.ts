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
