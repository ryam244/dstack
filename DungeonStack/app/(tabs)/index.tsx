/**
 * Main Game Screen
 * メインゲーム画面
 */

import React, { useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, Text } from 'react-native';
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
  const { isGameOver, isVictory, isPaused, startGame, pauseGame, resumeGame } = useGameStore();
  const player = useGameStore((state) => state.player);

  // ブロック落下ロジックを有効化
  useBlockFall();

  // ゲームが開始されていない場合の初期化
  useEffect(() => {
    if (player.stage === 1 && player.wave === 1 && player.hp === 0) {
      // まだゲームが開始されていない
    }
  }, [player]);

  const handleStartGame = () => {
    startGame('normal');
  };

  const handlePause = () => {
    if (isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  };

  // ゲームが開始されていない場合
  if (player.hp === 0 && !isGameOver) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.menuContainer}>
          <Text style={styles.title}>{t('game.title')}</Text>

          <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
            <Text style={styles.startButtonText}>{t('common.start')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
      </ScrollView>

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
  scrollContent: {
    flexGrow: 1,
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
});
