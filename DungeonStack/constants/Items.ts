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
  icon: any; // require() で読み込んだ画像リソース
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
    icon: require('../assets/items/sword.png'),
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
    icon: require('../assets/items/shield.png'),
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
    icon: require('../assets/items/potion.png'),
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
    icon: require('../assets/items/coin.png'),
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
  sprite: any; // require() で読み込んだ画像リソース
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
    sprite: require('../assets/enemies/slime.png'),
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
    sprite: require('../assets/enemies/goblin.png'),
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
    sprite: require('../assets/enemies/slime.png'), // TODO: bat.pngを作成
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
    sprite: require('../assets/enemies/goblin.png'), // TODO: orc.pngを作成
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
    sprite: require('../assets/enemies/goblin.png'), // TODO: dragon.pngを作成
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
