/**
 * Upgrades Screen
 * 永続強化画面
 */

import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { UpgradeCard, UpgradeData } from '../../components/upgrades/UpgradeCard';
import { usePlayerStore } from '../../store/playerStore';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { GameConfig } from '../../constants/GameConfig';

export default function UpgradesScreen() {
  const { t } = useTranslation();
  const { totalCoins, upgrades, purchaseUpgrade } = usePlayerStore();

  // アップグレードデータ
  const upgradesList: UpgradeData[] = [
    {
      id: 'maxHPBoost',
      nameKey: 'upgrades.maxHP',
      descriptionKey: 'upgrades.maxHPDesc',
      cost: GameConfig.permanentUpgrades.maxHPBoost.cost,
      currentLevel: upgrades.maxHPBoost || 0,
      maxLevel: GameConfig.permanentUpgrades.maxHPBoost.maxLevel,
    },
    {
      id: 'boardExpansion',
      nameKey: 'upgrades.boardExpansion',
      descriptionKey: 'upgrades.boardExpansionDesc',
      cost: GameConfig.permanentUpgrades.boardExpansion.cost,
      currentLevel: upgrades.boardExpansion || 0,
      maxLevel: GameConfig.permanentUpgrades.boardExpansion.maxLevel,
    },
    {
      id: 'startingCoins',
      nameKey: 'upgrades.startingCoins',
      descriptionKey: 'upgrades.startingCoinsDesc',
      cost: GameConfig.permanentUpgrades.startingCoins.cost,
      currentLevel: upgrades.startingCoins || 0,
      maxLevel: GameConfig.permanentUpgrades.startingCoins.maxLevel,
    },
  ];

  const handlePurchase = (upgradeId: string) => {
    const upgrade = upgradesList.find(u => u.id === upgradeId);
    if (!upgrade) return;

    if (totalCoins >= upgrade.cost && upgrade.currentLevel < upgrade.maxLevel) {
      purchaseUpgrade(upgradeId, upgrade.cost);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('upgrades.title')}</Text>
          <View style={styles.coinsContainer}>
            <Text style={styles.coinsLabel}>{t('game.coins')}</Text>
            <Text style={styles.coinsValue}>{totalCoins.toLocaleString()}</Text>
          </View>
        </View>

        {/* アップグレードリスト */}
        <View style={styles.upgradesList}>
          {upgradesList.map(upgrade => (
            <UpgradeCard
              key={upgrade.id}
              upgrade={upgrade}
              canAfford={totalCoins >= upgrade.cost}
              onPurchase={() => handlePurchase(upgrade.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContent: {
    padding: Layout.spacing.medium,
  },
  header: {
    marginBottom: Layout.spacing.large,
  },
  title: {
    fontSize: Layout.fontSize.xxxlarge,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.medium,
    textAlign: 'center',
  },
  coinsContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: Layout.spacing.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border.emphasis,
  },
  coinsLabel: {
    color: Colors.text.secondary,
    fontSize: Layout.fontSize.large,
    fontWeight: 'bold',
  },
  coinsValue: {
    color: Colors.text.accent,
    fontSize: Layout.fontSize.xxlarge,
    fontWeight: 'bold',
  },
  upgradesList: {
    flex: 1,
  },
});
