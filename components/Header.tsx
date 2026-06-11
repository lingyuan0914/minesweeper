import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Difficulty } from '../src/types'

interface HeaderProps {
  minesRemaining: number
  currentDifficulty: Difficulty
  onDifficultyChange: (difficulty: Difficulty) => void
  onRestart: () => void
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: '初级',
  intermediate: '中级',
  expert: '高级'
}

export function Header({
  minesRemaining,
  currentDifficulty,
  onDifficultyChange,
  onRestart
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.mines}>💣 {minesRemaining}</Text>
      
      <View style={styles.difficultyButtons}>
        {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((difficulty) => (
          <Pressable
            key={difficulty}
            onPress={() => onDifficultyChange(difficulty)}
            style={[
              styles.difficultyButton,
              difficulty === currentDifficulty && styles.activeDifficulty
            ]}
          >
            <Text style={styles.difficultyText}>
              {DIFFICULTY_LABELS[difficulty]}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={onRestart} style={styles.restartButton}>
        <Text style={styles.restartText}>🔄</Text>
      </Pressable>
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
    backgroundColor: '#2c3e50'
  },
  mines: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ecf0f1'
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 8
  },
  difficultyButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#34495e'
  },
  activeDifficulty: {
    backgroundColor: '#3498db'
  },
  difficultyText: {
    color: '#fff',
    fontSize: 14
  },
  restartButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#e74c3c'
  },
  restartText: {
    fontSize: 18
  }
})
