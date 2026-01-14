/**
 * Main Game Screen
 * メインゲーム画面
 */

import React, { useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StatusBar } from '../../components/game/StatusBar';
import { GameBoard } from '../../components/game/GameBoard';
import { HeroLine } from '../../components/game/HeroLine';
import { GameOverModal } from '../../components/game/GameOverModal';
import { useGameStore } from '../../store/gameStore';
import { useBlockFall } from '../../hooks/useBlockFall';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

export default function GameScreen() {
  const { t } = useTranslation();
  const { isGameStarted, isGameOver, isVictory, isPaused, startGame, pauseGame, resumeGame } = useGameStore();

  // ブロック落下ロジックを有効化
  useBlockFall();

  const handleStartGame = (difficulty: 'casual' | 'normal' | 'hardcore') => {
    startGame(difficulty);
  };

  const handlePause = () => {
    if (isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  };

  // ゲームが開始されていない場合（タイトル画面）
  if (!isGameStarted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.menuContainer}>
          <Text style={styles.title}>{t('game.title')}</Text>

          <Text style={styles.subtitle}>{t('game.selectDifficulty')}</Text>

          <View style={styles.difficultyButtons}>
            <TouchableOpacity
              style={[styles.difficultyButton, styles.casualButton]}
              onPress={() => handleStartGame('casual')}
            >
              <Text style={styles.difficultyButtonText}>{t('game.casual')}</Text>
              <Text style={styles.difficultyDescription}>{t('game.casualDesc')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.difficultyButton, styles.normalButton]}
              onPress={() => handleStartGame('normal')}
            >
              <Text style={styles.difficultyButtonText}>{t('game.normal')}</Text>
              <Text style={styles.difficultyDescription}>{t('game.normalDesc')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.difficultyButton, styles.hardcoreButton]}
              onPress={() => handleStartGame('hardcore')}
            >
              <Text style={styles.difficultyButtonText}>{t('game.hardcore')}</Text>
              <Text style={styles.difficultyDescription}>{t('game.hardcoreDesc')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gameContent}>
        {/* ステータスバー */}
        <StatusBar />

        {/* ゲームボード */}
        <GameBoard />

        {/* ヒーローライン */}
        <HeroLine />

        {/* 一時停止ボタン */}
        <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
          <Text style={styles.pauseButtonText}>
            {isPaused ? t('common.resume') : t('common.pause')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ゲームオーバー/勝利モーダル */}
      <GameOverModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  gameContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.lg,
  },
  title: {
    fontSize: Layout.fontSize.title,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xl,
    textShadowColor: Colors.accent.primary,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  startButton: {
    backgroundColor: Colors.accent.primary,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.md,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: Colors.ui.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  startButtonText: {
    color: Colors.text.dark,
    fontSize: Layout.fontSize.xlarge,
    fontWeight: 'bold',
  },
  pauseButton: {
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: Layout.spacing.md,
    borderWidth: 2,
    borderColor: Colors.ui.cardBorder,
  },
  pauseButtonText: {
    color: Colors.text.primary,
    fontSize: Layout.fontSize.medium,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: Layout.fontSize.large,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.lg,
    textAlign: 'center',
  },
  difficultyButtons: {
    width: '100%',
    gap: Layout.spacing.md,
  },
  difficultyButton: {
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
    borderRadius: 12,
    borderWidth: 3,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  casualButton: {
    backgroundColor: Colors.accent.success,
    borderColor: Colors.ui.cardBorder,
  },
  normalButton: {
    backgroundColor: Colors.accent.primary,
    borderColor: Colors.ui.cardBorder,
  },
  hardcoreButton: {
    backgroundColor: Colors.accent.danger,
    borderColor: Colors.ui.cardBorder,
  },
  difficultyButtonText: {
    color: Colors.text.dark,
    fontSize: Layout.fontSize.xlarge,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.xs,
  },
  difficultyDescription: {
    color: Colors.text.dark,
    fontSize: Layout.fontSize.small,
    opacity: 0.8,
  },
});
