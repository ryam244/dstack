/**
 * GameBoard Component
 * 7x10グリッドのゲーム盤面を表示
 */

import React, { useRef } from 'react';
import { View, StyleSheet, GestureResponderEvent, PanResponder } from 'react-native';
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

  // スワイプ検出用
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, dy } = gestureState;

        // 下方向のフリック（高速落下）
        if (dy > 50 && Math.abs(dx) < 50) {
          dropBlock();
        }
        // 左スワイプ
        else if (dx < -30 && Math.abs(dy) < 50) {
          moveBlockLeft();
        }
        // 右スワイプ
        else if (dx > 30 && Math.abs(dy) < 50) {
          moveBlockRight();
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
});
