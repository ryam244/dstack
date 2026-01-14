/**
 * StatusBar Component
 * HP、スコア、ステージ/Wave情報を表示
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../store/gameStore';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

export const StatusBar: React.FC = () => {
  const { t } = useTranslation();
  const player = useGameStore((state) => state.player);

  // HPバーの幅を計算（パーセンテージ）
  const hpPercentage = Math.max(0, (player.hp / player.maxHp) * 100);

  return (
    <View style={styles.container}>
      {/* 上段: ステージ/Wave情報 */}
      <View style={styles.topRow}>
        <Text style={styles.stageText}>
          {t('game.stage', { number: player.stage })}
        </Text>
        <Text style={styles.waveText}>
          {t('game.wave', { number: player.wave })}
        </Text>
      </View>

      {/* 中段: HPバー */}
      <View style={styles.hpContainer}>
        <Text style={styles.hpLabel}>{t('game.hp')}</Text>
        <View style={styles.hpBarBackground}>
          <LinearGradient
            colors={Colors.gradients.health}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.hpBarFill,
              {
                width: `${hpPercentage}%`,
              },
            ]}
          />
          <Text style={styles.hpText}>
            {player.hp} / {player.maxHp}
          </Text>
        </View>
      </View>

      {/* 下段: スコアと金貨 */}
      <View style={styles.bottomRow}>
        <View style={styles.statContainer}>
          <Text style={styles.statLabel}>{t('game.score')}</Text>
          <Text style={styles.statValue}>{player.score.toLocaleString()}</Text>
        </View>
        <View style={styles.statContainer}>
          <Text style={styles.statLabel}>{t('game.coins')}</Text>
          <Text style={styles.statValue}>{player.coins.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: Layout.spacing.md,
    marginHorizontal: Layout.spacing.md,
    marginVertical: Layout.spacing.sm,
    borderWidth: 2,
    borderColor: Colors.ui.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.sm,
  },
  stageText: {
    color: Colors.text.primary,
    fontSize: Layout.fontSize.large,
    fontWeight: 'bold',
  },
  waveText: {
    color: Colors.text.secondary,
    fontSize: Layout.fontSize.medium,
    fontWeight: '600',
  },
  hpContainer: {
    marginBottom: Layout.spacing.sm,
  },
  hpLabel: {
    color: Colors.text.primary,
    fontSize: Layout.fontSize.small,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  hpBarBackground: {
    height: 32,
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.ui.cardBorder,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  hpBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 14,
  },
  hpText: {
    color: Colors.text.white,
    fontSize: Layout.fontSize.medium,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    zIndex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statContainer: {
    alignItems: 'center',
  },
  statLabel: {
    color: Colors.text.secondary,
    fontSize: Layout.fontSize.small,
    marginBottom: 2,
  },
  statValue: {
    color: Colors.text.gold,
    fontSize: Layout.fontSize.large,
    fontWeight: 'bold',
  },
});
