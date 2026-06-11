import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import * as Haptics from 'expo-haptics'
import { Difficulty } from '../src/types'
import { useTheme } from './ThemeProvider'

interface HeaderProps {
  minesRemaining: number
  currentDifficulty: Difficulty
  onDifficultyChange: (difficulty: Difficulty) => void
  onRestart: () => void
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: '初级',
  intermediate: '中级',
  expert: '高级',
}

export function Header({
  minesRemaining,
  currentDifficulty,
  onDifficultyChange,
  onRestart,
}: HeaderProps) {
  const { theme, isDark, toggleTheme } = useTheme()

  const handleDifficultyPress = (difficulty: Difficulty) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onDifficultyChange(difficulty)
  }

  const handleRestartPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onRestart()
  }

  const handleThemePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    toggleTheme()
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderBottomColor: theme.surfaceBorder }]}>
      <View style={styles.minesContainer}>
        <Text style={[styles.minesIcon]}>💣</Text>
        <Text style={[styles.mines, { color: theme.text }]}>{minesRemaining}</Text>
      </View>

      <View style={styles.difficultyButtons}>
        {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((difficulty) => (
          <Pressable
            key={difficulty}
            onPress={() => handleDifficultyPress(difficulty)}
            style={[
              styles.difficultyButton,
              {
                backgroundColor: difficulty === currentDifficulty ? theme.primary : theme.surface,
                borderColor: difficulty === currentDifficulty ? theme.primary : theme.surfaceBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.difficultyText,
                { color: difficulty === currentDifficulty ? '#fff' : theme.text },
              ]}
            >
              {DIFFICULTY_LABELS[difficulty]}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.rightButtons}>
        <Pressable onPress={handleThemePress} style={[styles.themeButton, { backgroundColor: theme.surface }]}>
          <Text style={styles.themeIcon}>{isDark ? '☀️' : '🌙'}</Text>
        </Pressable>
        <Pressable onPress={handleRestartPress} style={[styles.restartButton, { backgroundColor: theme.danger }]}>
          <Text style={styles.restartIcon}>🔄</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  minesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  minesIcon: {
    fontSize: 20,
  },
  mines: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  themeIcon: {
    fontSize: 16,
  },
  restartButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  restartIcon: {
    fontSize: 16,
  },
})
