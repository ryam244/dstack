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

  // ブロック設定
  blocks: {
    fallSpeed: 500,      // 通常落下速度（ミリ秒/マス）
    fastFallSpeed: 50,   // 高速落下速度
    afterMatchDelay: 200, // マッチ後の再配置待ち時間
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
    dragon: {
      hp: 10,
      attack: 25,
      spawnWeight: 5,
    },
  },

  // ボス（MVP版は1体のみ）
  boss: {
    dragon: {
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
