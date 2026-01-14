/**
 * Block Component
 * 個別のブロック（アイテムまたは敵）を表示
 */

import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { Block as BlockType } from '../../types';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { ItemDefinitions, EnemyDefinitions } from '../../constants/Items';

interface BlockProps {
  block: BlockType;
  size?: number;
}

export const Block: React.FC<BlockProps> = ({ block, size }) => {
  const blockSize = size || Layout.board.blockSize;

  // ブロックタイプに応じたアセットとカラーを取得
  const isEnemy = block.type in EnemyDefinitions;
  const definition = isEnemy
    ? EnemyDefinitions[block.type as keyof typeof EnemyDefinitions]
    : ItemDefinitions[block.type as keyof typeof ItemDefinitions];

  const imageSource = isEnemy
    ? (definition as any).sprite
    : (definition as any).icon;

  const backgroundColor = isEnemy
    ? Colors.enemies[block.type as keyof typeof Colors.enemies] || Colors.background.secondary
    : (Colors.items[block.type as keyof typeof Colors.items] as any)?.base || Colors.background.secondary;

  return (
    <View
      style={[
        styles.container,
        {
          width: blockSize,
          height: blockSize,
          backgroundColor,
          opacity: block.matched ? 0.5 : 1,
        },
      ]}
    >
      <Image
        source={imageSource}
        style={[styles.image, { width: blockSize * 0.8, height: blockSize * 0.8 }]}
        resizeMode="contain"
      />

      {/* 敵の場合はHPを表示 */}
      {isEnemy && 'hp' in block && (
        <View style={styles.hpContainer}>
          <Text style={styles.hpText}>{block.hp}</Text>
        </View>
      )}

      {/* レベル表示（進化アイテム用） */}
      {block.level && block.level > 1 && (
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>Lv{block.level}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.ui.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    position: 'absolute',
  },
  hpContainer: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: Colors.accent.danger,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  hpText: {
    color: Colors.text.white,
    fontSize: Layout.fontSize.tiny,
    fontWeight: 'bold',
  },
  levelContainer: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    backgroundColor: Colors.accent.primary,
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  levelText: {
    color: Colors.text.dark,
    fontSize: Layout.fontSize.tiny,
    fontWeight: 'bold',
  },
});
