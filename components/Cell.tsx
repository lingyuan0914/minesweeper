import React, { useEffect, useRef } from 'react'
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  interpolate,
  Easing,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { Cell } from '../src/types'
import { useTheme } from './ThemeProvider'

interface CellProps {
  cell: Cell
  cellSize: number
  onPress: () => void
  onLongPress: () => void
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export function CellComponent({ cell, cellSize, onPress, onLongPress }: CellProps) {
  const { theme } = useTheme()
  const rotateY = useSharedValue(0)
  const scale = useSharedValue(1)
  const opacity = useSharedValue(1)
  const isRevealedRef = useRef(false)
  const isFlaggedRef = useRef(false)

  useEffect(() => {
    if (cell.isRevealed && !isRevealedRef.current) {
      // 翻转动画
      rotateY.value = withSequence(
        withTiming(90, { duration: 150, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 150, easing: Easing.inOut(Easing.ease) })
      )
      isRevealedRef.current = true
    }
    if (!cell.isRevealed) {
      isRevealedRef.current = false
    }
  }, [cell.isRevealed])

  useEffect(() => {
    if (cell.isFlagged !== isFlaggedRef.current) {
      // 标旗弹跳动画
      scale.value = withSequence(
        withTiming(1.2, { duration: 100 }),
        withTiming(1, { duration: 100 })
      )
      isFlaggedRef.current = cell.isFlagged
    }
  }, [cell.isFlagged])

  useEffect(() => {
    if (cell.isRevealed && cell.isMine) {
      // 地雷爆炸动画
      opacity.value = withSequence(
        withTiming(0.5, { duration: 100 }),
        withTiming(1, { duration: 100 }),
        withTiming(0.5, { duration: 100 }),
        withTiming(1, { duration: 100 })
      )
      scale.value = withSequence(
        withTiming(1.3, { duration: 100 }),
        withTiming(1, { duration: 100 })
      )
    }
  }, [cell.isRevealed, cell.isMine])

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPress()
  }

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onLongPress()
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${rotateY.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }))

  const getBackgroundColor = () => {
    if (cell.isRevealed) {
      return cell.isMine ? theme.cell.mine : theme.cell.revealed
    }
    return theme.cell.hidden
  }

  const renderContent = () => {
    if (!cell.isRevealed && cell.isFlagged) {
      return <Text style={[styles.flag, { color: theme.cell.flag }]}>🚩</Text>
    }
    if (cell.isRevealed && cell.isMine) {
      return <Text style={styles.mine}>💣</Text>
    }
    if (cell.isRevealed && cell.neighborMines > 0) {
      return (
        <Text style={[styles.number, { color: theme.numberColors[cell.neighborMines as keyof typeof theme.numberColors] }]}>
          {cell.neighborMines}
        </Text>
      )
    }
    return null
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      style={[
        styles.cell,
        {
          width: cellSize,
          height: cellSize,
          backgroundColor: getBackgroundColor(),
          borderColor: cell.isRevealed ? theme.cell.revealedBorder : theme.cell.hiddenBorder,
        },
        animatedStyle,
      ]}
    >
      {renderContent()}
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
    borderWidth: 2,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  flag: {
    fontSize: 16,
  },
  mine: {
    fontSize: 16,
  },
  number: {
    fontSize: 18,
    fontWeight: 'bold',
  },
})
