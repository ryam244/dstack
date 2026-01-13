# Dungeon Stack - 詳細実装計画書

## プロジェクト概要

**アプリ名**: Dungeon Stack
**ジャンル**: 落ち物パズル × ローグライク
**プラットフォーム**: iOS / Android (React Native + Expo)
**開発期間**: 3ヶ月（フェーズ分割）

---

## 技術スタック

### フレームワーク & 言語
- **Framework**: React Native (Expo SDK 50+)
- **Language**: TypeScript
- **Routing**: Expo Router (File-based routing)
- **Styling**: StyleSheet (Standard)
- **State Management**: Zustand
- **Backend**: Supabase (ユーザーデータ、ランキング、セーブデータ)
- **Monetization**:
  - expo-ads-admob (動画リワード広告)
  - expo-in-app-purchases (アプリ内課金)

### ディレクトリ構造（予定）
```
app/
├── (tabs)/
│   ├── index.tsx           # メインゲーム画面
│   ├── shop.tsx            # ショップ画面
│   └── upgrades.tsx        # 永続強化画面
├── _layout.tsx
└── +not-found.tsx

components/
├── game/
│   ├── GameBoard.tsx       # ゲーム盤面
│   ├── Block.tsx           # ブロック（アイテム/敵）
│   ├── HeroLine.tsx        # プレイヤー表示ライン
│   ├── StatusBar.tsx       # HP、スコア表示
│   └── GameOverModal.tsx   # ゲームオーバー画面
├── shop/
│   ├── ShopModal.tsx       # ショップUI
│   └── BuffCard.tsx        # バフカード
└── upgrades/
    └── UpgradeCard.tsx     # 永続強化カード

constants/
├── Colors.ts               # カラーテーマ
├── Layout.ts               # レイアウト定数
├── GameConfig.ts           # ゲームパラメータ
└── Items.ts                # アイテム定義

hooks/
├── useGameLoop.ts          # ゲームループロジック
├── useBlockFall.ts         # ブロック落下制御
├── useCombat.ts            # 戦闘処理
└── useShop.ts              # ショップロジック

store/
├── gameStore.ts            # ゲーム状態管理 (Zustand)
└── playerStore.ts          # プレイヤーデータ管理

types/
└── index.ts                # TypeScript型定義

utils/
├── blockMatcher.ts         # ブロックマッチング判定
├── enemySpawner.ts         # 敵出現ロジック
└── coinCalculator.ts       # 報酬計算
```

---

## データモデル（TypeScript Interfaces）

```typescript
// ブロックタイプ
type BlockType = 'sword' | 'shield' | 'potion' | 'coin' | 'enemy';

// ブロック
interface Block {
  id: string;
  type: BlockType;
  x: number;      // 横位置 (0-6)
  y: number;      // 縦位置 (0-9)
  falling: boolean;
  matched: boolean;
  level?: number; // 進化レベル（剣など）
}

// 敵データ
interface Enemy extends Block {
  hp: number;
  attack: number;
  sprite: string; // ドット絵アセット名
}

// プレイヤー状態
interface PlayerState {
  hp: number;
  maxHp: number;
  coins: number;
  score: number;
  stage: number;
  wave: number;
}

// 永続強化データ
interface PermanentUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  currentLevel: number;
  maxLevel: number;
  effect: (state: PlayerState) => PlayerState;
}

// ショップバフ
interface ShopBuff {
  id: string;
  name: string;
  description: string;
  cost: number;
  duration: number; // WAVEの持続時間
  effect: string;   // 効果の種類
}

// ゲーム状態
interface GameState {
  board: Block[][];        // 7x10のグリッド
  player: PlayerState;
  currentBlock: Block | null;
  activeBuffs: ShopBuff[];
  isPaused: boolean;
  isGameOver: boolean;
}
```

---

## Phase 0: プロジェクトセットアップ（1週目）

### 0.1 環境構築
- [ ] Expo CLI インストール確認
- [ ] プロジェクト作成: `npx create-expo-app DungeonStack --template tabs`
- [ ] TypeScript設定確認
- [ ] Git初期化とリポジトリ作成

### 0.2 基本設定
- [ ] `constants/Colors.ts` 作成
  - レトロ風パレット定義（背景、テキスト、アイテム色）
- [ ] `constants/Layout.ts` 作成
  - 盤面サイズ、グリッドサイズ、余白定義
- [ ] `constants/GameConfig.ts` 作成
  - 初期HP、ダメージ量、落下速度などのパラメータ
- [ ] `constants/Items.ts` 作成
  - アイテム・敵の基本データ定義

### 0.3 型定義
- [ ] `types/index.ts` 作成
  - Block, Enemy, PlayerState, GameState等のインターフェース定義

### 0.4 Zustandストア作成
- [ ] `store/gameStore.ts` 作成
  - ゲーム状態の初期化
  - 基本アクション（startGame, pauseGame, gameOver）
- [ ] `store/playerStore.ts` 作成
  - プレイヤーの永続データ管理
  - 金貨、アップグレード状態の保存

### 0.5 デザインアセット準備
- [ ] ドット絵アセット収集または作成
  - 剣、盾、薬、金貨のアイコン（32x32px）
  - 敵スプライト（スライム、ゴブリン等）
  - 勇者スプライト（ダメージ、回復アニメーション用）
- [ ] 効果音・BGMの選定
  - 8bitサウンド素材の準備

---

## Phase 1: MVP開発（2-4週目）

**目標**: コアループ「落とす→揃える→戦う」の検証

### 1.1 ゲーム盤面の実装
- [ ] `components/game/GameBoard.tsx` 作成
  - 7x10グリッドの描画
  - 背景デザイン（リュックサックの断面図風）
- [ ] `components/game/Block.tsx` 作成
  - ブロックの描画（アイテム・敵の見た目）
  - ドット絵アセットの表示

### 1.2 ブロック操作システム
- [ ] `hooks/useBlockFall.ts` 作成
  - ブロックの自動落下処理
  - 落下速度の制御
  - 着地判定
- [ ] タッチ操作の実装
  - Swipe: 左右移動
  - Tap: 回転（未使用の場合はスキップ）
  - Flick Down: 高速落下

### 1.3 マッチング & 消去システム
- [ ] `utils/blockMatcher.ts` 作成
  - 3つ以上の同一アイテムの検出
  - 縦・横・斜めのマッチング判定
- [ ] マッチしたブロックの消去アニメーション
- [ ] 消去後の上からのブロック落下処理

### 1.4 戦闘システム
- [ ] `hooks/useCombat.ts` 作成
  - 剣ブロック消去時の攻撃判定
  - 隣接する敵へのダメージ処理
  - 敵撃破時のエフェクト
- [ ] 敵ブロックのHero Line到達処理
  - プレイヤーへのダメージ
  - 盾ブロックの身代わり機能
- [ ] `components/game/HeroLine.tsx` 作成
  - ドット絵の勇者表示
  - ダメージ・回復時のアニメーション

### 1.5 プレイヤー状態管理
- [ ] `components/game/StatusBar.tsx` 作成
  - HP表示（レトロ風UIフォント）
  - スコア表示
  - 現在の階層（Stage/Wave）表示
- [ ] HP管理ロジック
  - ダメージ処理
  - 回復処理（薬3つマッチ）
  - ゲームオーバー判定

### 1.6 敵出現システム
- [ ] `utils/enemySpawner.ts` 作成
  - ランダムな敵の出現
  - Wave進行に応じた難易度調整
  - 敵の種類選定ロジック
- [ ] 敵データ定義
  - スライム（HP: 1, 攻撃: 1）
  - ゴブリン（HP: 2, 攻撃: 2）

### 1.7 ステージクリア型ゲームフロー
- [ ] ステージ管理システム
  - 5ステージの実装
  - ステージクリア条件（敵を全滅させる）
  - ステージ間の遷移
- [ ] ゲームオーバー処理
  - `components/game/GameOverModal.tsx` 作成
  - 獲得金貨の表示
  - リトライボタン
  - ホームに戻るボタン

### 1.8 永続強化システム（基本）
- [ ] `app/(tabs)/upgrades.tsx` 作成
  - アップグレード画面のUI
- [ ] `components/upgrades/UpgradeCard.tsx` 作成
  - カード形式のアップグレード表示
- [ ] 基本アップグレード実装
  - **HPアップ**: 最大HPを+5（最大レベル5）
  - **リュック拡張**: 盤面の横幅を1列追加（最大レベル2）
- [ ] アップグレード購入処理
  - 金貨消費
  - 効果の適用
  - Zustandストアへの保存

### 1.9 効果音とBGM
- [ ] 効果音の実装
  - ブロック消去音
  - 攻撃音
  - ダメージ音
  - 回復音
- [ ] BGMの実装
  - メインゲームBGM（軽快な冒険曲）

---

## Phase 2: 機能拡張（5-7週目）

**目標**: 戦略の幅とリプレイ性の向上

### 2.1 ショップシステム
- [ ] `app/(tabs)/shop.tsx` 作成
  - ショップ画面のUI
- [ ] `components/shop/ShopModal.tsx` 作成
  - ステージクリア後のショップモーダル
- [ ] `components/shop/BuffCard.tsx` 作成
  - バフの説明カード
- [ ] `hooks/useShop.ts` 作成
  - ショップアイテムのランダム生成
  - バフの購入・適用処理
- [ ] バフの実装
  - 「次のWAVEで剣の出現率UP」
  - 「次のWAVEで敵の出現率DOWN」
  - 「特定アイテムを出現させなくする」
  - 「剣の進化条件緩和（2つで大剣）」

### 2.2 新アイテムの追加
- [ ] **魔法の杖**: 3つ揃えると範囲攻撃
- [ ] **爆弾**: 1つで周囲8マスを破壊
- [ ] **鍵**: 宝箱ブロックを開けるために必要
- [ ] **宝箱**: 鍵と一緒に消すと大量の金貨
- [ ] 各アイテムのロジックとUI実装

### 2.3 新エネミーの追加
- [ ] **コウモリ**: HP1、素早く落ちてくる
- [ ] **オーク**: HP3、攻撃力3
- [ ] **ドラゴン**: HP5、攻撃力5（中ボス）
- [ ] 敵ごとの挙動とスプライト実装

### 2.4 ステージ追加（〜20ステージ）
- [ ] ステージ11〜20のデータ作成
  - 敵の種類と数の設定
  - 難易度曲線の調整
- [ ] ステージ選択画面の実装（オプション）

### 2.5 ボス戦の実装
- [ ] ボスステージの定義（5, 10, 15, 20ステージ目）
- [ ] ボス専用UI
  - ボスHP表示バー
  - ボス登場演出
- [ ] ボス専用BGM
- [ ] ボス撃破時の報酬（大量の金貨）

### 2.6 永続強化の追加
- [ ] **攻撃力アップ**: 剣のダメージ+1
- [ ] **防御力アップ**: 盾の耐久度+1
- [ ] **回復量アップ**: 薬の回復量+5
- [ ] **初期金貨ボーナス**: ゲーム開始時の金貨+100
- [ ] **スタートレベルアップ**: ステージ2からスタート

### 2.7 動画リワード広告
- [ ] expo-ads-admobのインストールと設定
- [ ] コンティニュー機能
  - ゲームオーバー時に広告視聴でHP50%回復
- [ ] 金貨2倍機能
  - ステージクリア時に広告視聴で報酬2倍
- [ ] 広告ロード・表示処理
- [ ] エラーハンドリング

### 2.8 チュートリアルの実装
- [ ] 初回起動時のチュートリアルフラグ管理
- [ ] ステップ1: 基本操作（落とす、消す）
- [ ] ステップ2: 戦闘（剣で敵を攻撃）
- [ ] ステップ3: 防御（盾で防ぐ）
- [ ] ステップ4: 回復（薬を3つ揃える）
- [ ] スキップ可能なUI

### 2.9 難易度選択
- [ ] タイトル画面に難易度選択を追加
  - カジュアル（敵攻撃力0.7倍、初期HP150%）
  - ノーマル（デフォルト）
  - ハードコア（敵攻撃力1.5倍、初期HP70%）
- [ ] 難易度に応じた報酬調整（ハードコアは金貨1.5倍）

---

## Phase 3: 長期エンゲージメント機能（8-12週目）

**目標**: 長期的なプレイヤー定着と収益化

### 3.1 エンドレスモード
- [ ] エンドレスモード画面の追加
- [ ] 無限にWAVEが続くロジック
  - 敵の強さが徐々に上昇
  - 到達WAVEがスコアになる
- [ ] ハイスコア保存（ローカル）

### 3.2 ランキングシステム
- [ ] Supabaseのセットアップ
  - テーブル設計（user_id, score, rank, created_at）
- [ ] スコア送信処理
- [ ] ランキング表示画面
  - トップ100表示
  - 自分の順位表示
- [ ] リーダーボードUI

### 3.3 デイリーミッション
- [ ] ミッション定義
  - 「敵を10体倒す」
  - 「1ゲームで1000点達成」
  - 「ステージ5をクリア」
- [ ] ミッション進捗管理
- [ ] ミッション達成時の報酬（金貨）
- [ ] 毎日0時のリセット処理

### 3.4 シーズンパス
- [ ] expo-in-app-purchasesのセットアップ
- [ ] シーズンパス購入UI
- [ ] プレイに応じた経験値システム
  - ゲームプレイでEXP獲得
  - レベルアップ報酬
- [ ] 無料パスと有料パスの報酬設定
  - 無料: 金貨、アイテム
  - 有料: 限定スキン、特殊強化、大量金貨
- [ ] シーズン期限管理（例: 30日）

### 3.5 期間限定イベント
- [ ] イベント管理システム
  - サーバー側でイベント情報を管理
  - アプリ起動時にイベント情報を取得
- [ ] イベント専用ステージ
  - 特別な敵配置
  - 限定報酬
- [ ] イベント通知UI

### 3.6 スキンシステム
- [ ] プレイヤースキン
  - 勇者の見た目変更
  - 複数バリエーション（騎士、魔法使い、盗賊）
- [ ] アイテムスキン
  - 剣、盾、薬のデザイン変更
- [ ] スキン変更UI
- [ ] 有料スキンの実装（IAP）

### 3.7 収益化の最終調整
- [ ] **買い切り型の広告非表示**
  - IAPでの購入処理
  - 広告表示フラグの管理
- [ ] **金貨の直接販売**
  - 100金貨、500金貨、1000金貨パック
- [ ] **消費アイテムの販売**
  - HP全回復アイテム
  - コンティニューチケット
- [ ] レシート検証とセキュリティ

### 3.8 パフォーマンス最適化
- [ ] メモリ使用量の削減
- [ ] アニメーションのフレームレート最適化
- [ ] 画像アセットの最適化
- [ ] 不要なレンダリングの削減（React.memo, useMemo）

### 3.9 バグ修正とポリッシュ
- [ ] QAテスト
- [ ] クラッシュログの収集と修正
- [ ] UI/UXの微調整
- [ ] エフェクトの追加・改善
- [ ] サウンドバランスの調整

---

## テスト戦略

### 単体テスト
- `utils/blockMatcher.ts` のマッチング判定
- `utils/enemySpawner.ts` の敵生成ロジック
- `utils/coinCalculator.ts` の報酬計算

### 統合テスト
- ゲームループ全体の動作確認
- ショップでのバフ購入から適用までのフロー
- ゲームオーバーから永続強化までのフロー

### E2Eテスト
- 実機での動作確認（iOS/Android）
- 広告表示の確認
- IAP購入フローの確認

---

## リリース前チェックリスト

### App Store / Google Play準備
- [ ] アプリアイコン作成（1024x1024）
- [ ] スプラッシュスクリーン作成
- [ ] スクリーンショット作成（各デバイスサイズ）
- [ ] アプリ説明文作成（日本語・英語）
- [ ] プライバシーポリシー作成
- [ ] 利用規約作成

### ビルド & デプロイ
- [ ] iOSビルド（EAS Build）
- [ ] Androidビルド（EAS Build）
- [ ] TestFlightでのベータテスト
- [ ] Google Play内部テスト
- [ ] 本番リリース

---

## マイルストーン

| フェーズ | 期間 | 主要成果物 |
|---------|------|-----------|
| Phase 0 | 1週 | プロジェクトセットアップ完了 |
| Phase 1 | 3週 | 遊べるMVP完成 |
| Phase 2 | 3週 | 戦略性向上、広告実装 |
| Phase 3 | 4週 | 長期運営基盤完成 |
| リリース準備 | 1週 | ストア申請 |

---

## リスク管理

| リスク | 対策 |
|--------|------|
| パフォーマンス問題（落ち物の処理重い） | 早期プロファイリング、最適化の優先実装 |
| ゲームバランスの調整難航 | プレイテストを頻繁に実施、データドリブンな調整 |
| 広告・IAP実装の技術的困難 | Phase 1完了後、早めに検証用実装を行う |
| アセット不足 | フリー素材の活用、必要に応じて外注検討 |

---

## 次のステップ

1. **Phase 0を開始**: プロジェクトのセットアップと基本設定
2. **デザインモックアップの確認**: UIの最終イメージを固める
3. **Phase 1の実装開始**: コアゲームループを最優先で実装

**注意**: コードは Phase 0 の承認後に開始します。
