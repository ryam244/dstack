/**
 * GameBoard Component
 * 7x10グリッドのゲーム盤面を表示
 */

import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, PanResponder } from 'react-native';
import { Block } from './Block';
import { useGameStore } from '../../store/gameStore';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

export const GameBoard: React.FC = () => {
  const board = useGameStore((state) => state.board);
  const currentBlock = useGameStore((state) => state.currentBlock);
  const { moveBlockLeft, moveBlockRight, dropBlock } = useGameStore();
  const blockSize = Layout.board.blockSize;
  const gap = Layout.board.gap;

  // スワイプ検出用（改善版）
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        // スワイプの最小距離
        const MIN_SWIPE_DISTANCE = 50;

        // 水平スワイプ（横方向の移動が縦方向の1.5倍以上）
        if (absDx > MIN_SWIPE_DISTANCE && absDx > absDy * 1.5) {
          if (dx < 0) {
            moveBlockLeft();
          } else {
            moveBlockRight();
          }
        }
        // 垂直スワイプ（縦方向の移動が横方向の1.5倍以上）
        else if (absDy > MIN_SWIPE_DISTANCE && absDy > absDx * 1.5) {
          if (dy > 0) {
            dropBlock();
          }
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <View
        {...panResponder.panHandlers}
        style={[
          styles.board,
          {
            width: Layout.board.columns * blockSize + (Layout.board.columns - 1) * gap,
            height: Layout.board.rows * blockSize + (Layout.board.rows - 1) * gap,
          },
        ]}
      >
        {/* 行ごとに描画 */}
        {board.map((row, rowIndex) => (
          <View
            key={`row-${rowIndex}`}
            style={[
              styles.row,
              {
                marginBottom: rowIndex < board.length - 1 ? gap : 0,
              },
            ]}
          >
            {/* 各セル（列）を描画 */}
            {row.map((cell, colIndex) => (
              <View
                key={`cell-${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  {
                    width: blockSize,
                    height: blockSize,
                    marginRight: colIndex < row.length - 1 ? gap : 0,
                  },
                ]}
              >
                {/* ブロックが存在する場合のみ描画 */}
                {cell && <Block block={cell} size={blockSize} />}

                {/* 現在落下中のブロックを描画 */}
                {currentBlock &&
                  currentBlock.y === rowIndex &&
                  currentBlock.x === colIndex && (
                    <Block block={currentBlock} size={blockSize} />
                  )}
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Hero Line (最下部の境界線) */}
      <View style={styles.heroLine} />

      {/* コントロールボタン */}
      <View style={styles.controlButtons}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={moveBlockLeft}
          activeOpacity={0.7}
        >
          <Text style={styles.controlButtonText}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.dropButton]}
          onPress={dropBlock}
          activeOpacity={0.7}
        >
          <Text style={styles.controlButtonText}>↓</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={moveBlockRight}
          activeOpacity={0.7}
        >
          <Text style={styles.controlButtonText}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.board.padding,
  },
  board: {
    backgroundColor: Colors.background.game,
    borderRadius: 12,
    padding: Layout.board.padding,
    borderWidth: 3,
    borderColor: Colors.ui.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.ui.cardBorder,
  },
  heroLine: {
    width: '90%',
    height: 4,
    backgroundColor: Colors.accent.danger,
    marginTop: Layout.spacing.sm,
    borderRadius: 2,
    shadowColor: Colors.accent.danger,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 5,
  },
  controlButtons: {
    flexDirection: 'row',
    marginTop: Layout.spacing.md,
    gap: Layout.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    backgroundColor: Colors.accent.primary,
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.ui.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  dropButton: {
    backgroundColor: Colors.accent.danger,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  controlButtonText: {
    color: Colors.text.dark,
    fontSize: 36,
    fontWeight: 'bold',
    lineHeight: 36,
  },
});
