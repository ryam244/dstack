/**
 * UpgradeCard Component
 * 永続強化カード
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

export interface UpgradeData {
  id: string;
  nameKey: string;
  descriptionKey: string;
  cost: number;
  currentLevel: number;
  maxLevel: number;
}

interface UpgradeCardProps {
  upgrade: UpgradeData;
  canAfford: boolean;
  onPurchase: () => void;
}

export const UpgradeCard: React.FC<UpgradeCardProps> = ({
  upgrade,
  canAfford,
  onPurchase,
}) => {
  const { t } = useTranslation();

  const isMaxLevel = upgrade.currentLevel >= upgrade.maxLevel;
  const disabled = !canAfford || isMaxLevel;

  return (
    <View style={styles.card}>
      {/* タイトルとレベル */}
      <View style={styles.header}>
        <Text style={styles.name}>{t(upgrade.nameKey)}</Text>
        <Text style={styles.level}>
          Lv {upgrade.currentLevel}/{upgrade.maxLevel}
        </Text>
      </View>

      {/* 説明 */}
      <Text style={styles.description}>{t(upgrade.descriptionKey)}</Text>

      {/* レベルバー */}
      <View style={styles.levelBarContainer}>
        <View
          style={[
            styles.levelBarFill,
            {
              width: `${(upgrade.currentLevel / upgrade.maxLevel) * 100}%`,
            },
          ]}
        />
      </View>

      {/* 購入ボタン */}
      {!isMaxLevel ? (
        <TouchableOpacity
          onPress={onPurchase}
          disabled={disabled}
          style={[styles.button, disabled && styles.buttonDisabled]}
        >
          <LinearGradient
            colors={disabled ? ['#666', '#444'] : Colors.gradients.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              {t('upgrades.purchase')} - {upgrade.cost} {t('game.coins')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <View style={styles.maxLevelBadge}>
          <Text style={styles.maxLevelText}>{t('upgrades.maxLevel')}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    borderWidth: 2,
    borderColor: Colors.ui.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  name: {
    color: Colors.text.primary,
    fontSize: Layout.fontSize.large,
    fontWeight: 'bold',
  },
  level: {
    color: Colors.text.gold,
    fontSize: Layout.fontSize.medium,
    fontWeight: 'bold',
  },
  description: {
    color: Colors.text.secondary,
    fontSize: Layout.fontSize.small,
    marginBottom: Layout.spacing.md,
    lineHeight: 20,
  },
  levelBarContainer: {
    height: 8,
    backgroundColor: Colors.background.primary,
    borderRadius: 4,
    marginBottom: Layout.spacing.md,
    overflow: 'hidden',
  },
  levelBarFill: {
    height: '100%',
    backgroundColor: Colors.accent.primary,
    borderRadius: 4,
  },
  button: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonGradient: {
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.text.dark,
    fontSize: Layout.fontSize.medium,
    fontWeight: 'bold',
  },
  maxLevelBadge: {
    backgroundColor: Colors.accent.success,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  maxLevelText: {
    color: Colors.text.dark,
    fontSize: Layout.fontSize.medium,
    fontWeight: 'bold',
  },
});
