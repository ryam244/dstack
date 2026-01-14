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
    padding: 8, // paddingを減らしてスペース確保
    gap: 2,

    // ブロックサイズ（自動計算：画面幅と高さの両方を考慮）
    get blockSize() {
      // 幅から計算
      const availableWidth = SCREEN_WIDTH - (this.padding * 2);
      const widthGap = this.gap * (this.columns - 1);
      const sizeFromWidth = Math.floor((availableWidth - widthGap) / this.columns);

      // 高さから計算
      // StatusBar(100) + HeroLine(60) + PauseButton(50) + TabBar(50) + SafeArea(80) = 340px
      const reservedHeight = Platform.select({ ios: 340, android: 320 }) || 340;
      const availableHeight = SCREEN_HEIGHT - reservedHeight;
      const heightGap = this.gap * (this.rows - 1);
      const sizeFromHeight = Math.floor((availableHeight - heightGap - this.padding * 2) / this.rows);

      // 両方の制約を満たす最小値を使用
      const size = Math.min(sizeFromWidth, sizeFromHeight);
      return Math.max(32, Math.min(size, 50)); // 32px〜50pxの範囲に制限
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
