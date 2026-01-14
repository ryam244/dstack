/**
 * HeroLine Component
 * プレイヤーキャラクターの表示とアニメーション
 */

import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { useGameStore } from '../../store/gameStore';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

export const HeroLine: React.FC = () => {
  const player = useGameStore((state) => state.player);
  const [damageAnim] = useState(new Animated.Value(0));
  const [prevHp, setPrevHp] = useState(player.hp);

  // HPの変化を監視してアニメーション実行
  useEffect(() => {
    if (player.hp < prevHp) {
      // ダメージアニメーション
      Animated.sequence([
        Animated.timing(damageAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(damageAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(damageAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(damageAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
    setPrevHp(player.hp);
  }, [player.hp, prevHp, damageAnim]);

  // ダメージ時の点滅効果
  const opacity = damageAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.3],
  });

  // HPに応じたヒーロースプライト選択
  const heroSprite = player.hp < player.maxHp * 0.3
    ? require('../../assets/hero/hero-damaged.png')
    : require('../../assets/hero/hero-idle.png');

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.heroContainer, { opacity }]}>
        <Image
          source={heroSprite}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* HPが低い場合の警告エフェクト */}
      {player.hp < player.maxHp * 0.3 && (
        <View style={styles.warningOverlay}>
          <View style={styles.warningPulse} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.sm,
    backgroundColor: Colors.background.secondary,
    borderTopWidth: 3,
    borderTopColor: Colors.accent.danger,
    position: 'relative',
  },
  heroContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  warningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  warningPulse: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.accent.danger,
    opacity: 0.2,
  },
});
