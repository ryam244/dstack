/**
 * GameOverModal Component
 * ゲームオーバー/勝利時のモーダル
 */

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../store/gameStore';
import { usePlayerStore } from '../../store/playerStore';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { GameConfig } from '../../constants/GameConfig';

export const GameOverModal: React.FC = () => {
  const { t } = useTranslation();
  const { isGameOver, isVictory, player, resetGame, startGame } = useGameStore();
  const { addCoins, updateHighScore } = usePlayerStore();
  const highScore = usePlayerStore((state) => state.highScore);

  const visible = isGameOver || isVictory;

  const handleContinue = () => {
    // プレイヤーストアに金貨を保存
    if (player.coins > 0) {
      addCoins(player.coins);
    }

    // ハイスコア更新
    if (player.score > highScore) {
      updateHighScore(player.score);
    }

    resetGame();
  };

  const handleRestart = () => {
    if (player.coins > 0) {
      addCoins(player.coins);
    }

    if (player.score > highScore) {
      updateHighScore(player.score);
    }

    startGame(player.difficulty);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleContinue}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* タイトル */}
          <Text style={[styles.title, isVictory ? styles.victoryTitle : styles.gameOverTitle]}>
            {isVictory ? t('game.victory') : t('game.gameOver')}
          </Text>

          {/* ステータス表示 */}
          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>{t('game.finalScore')}</Text>
              <Text style={styles.statValue}>{player.score.toLocaleString()}</Text>
            </View>

            {player.score > highScore && (
              <Text style={styles.newRecord}>{t('game.newHighScore')}</Text>
            )}

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>{t('game.stage')}</Text>
              <Text style={styles.statValue}>{player.stage}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>{t('game.coinsEarned')}</Text>
              <Text style={styles.statValue}>{player.coins.toLocaleString()}</Text>
            </View>
          </View>

          {/* ボタン */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleRestart} style={styles.button}>
              <LinearGradient
                colors={Colors.gradients.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>{t('common.retry')}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleContinue} style={styles.button}>
              <View style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>{t('common.home')}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    padding: Layout.spacing.xl,
    width: '85%',
    maxWidth: 400,
    borderWidth: 3,
    borderColor: Colors.ui.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 20,
  },
  title: {
    fontSize: Layout.fontSize.title,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  victoryTitle: {
    color: Colors.accent.success,
  },
  gameOverTitle: {
    color: Colors.accent.danger,
  },
  statsContainer: {
    marginBottom: Layout.spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.sm,
    paddingVertical: Layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.cardBorder,
  },
  statLabel: {
    color: Colors.text.secondary,
    fontSize: Layout.fontSize.medium,
  },
  statValue: {
    color: Colors.text.primary,
    fontSize: Layout.fontSize.large,
    fontWeight: 'bold',
  },
  newRecord: {
    color: Colors.accent.warning,
    fontSize: Layout.fontSize.small,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Layout.spacing.sm,
  },
  buttonContainer: {
    gap: Layout.spacing.md,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.text.dark,
    fontSize: Layout.fontSize.large,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: Colors.background.secondary,
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.ui.cardBorder,
  },
  secondaryButtonText: {
    color: Colors.text.primary,
    fontSize: Layout.fontSize.large,
    fontWeight: 'bold',
  },
});
