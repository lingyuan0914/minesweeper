import React, { useState, useCallback } from 'react'
import { View, Alert, StyleSheet } from 'react-native'
import { Board } from '../src/game/Board'
import { DIFFICULTY_CONFIG, Difficulty } from '../src/types'
import { BoardComponent } from '../components/Board'
import { Header } from '../components/Header'

function cloneBoard(board: Board): Board {
  const newBoard = new Board(board.config)
  newBoard.cells = board.cells.map(row => row.map(cell => ({ ...cell })))
  newBoard.gameOver = board.gameOver
  newBoard.gameWon = board.gameWon
  newBoard.firstClick = board.firstClick
  newBoard.flagCount = board.flagCount
  newBoard.revealedCount = board.revealedCount
  return newBoard
}

export function GameScreen() {
  const [board, setBoard] = useState(() => new Board(DIFFICULTY_CONFIG.beginner))
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner')

  const handleCellPress = useCallback((row: number, col: number) => {
    setBoard((prevBoard) => {
      const newBoard = cloneBoard(prevBoard)
      newBoard.reveal(row, col)
      
      if (newBoard.gameOver) {
        setTimeout(() => Alert.alert('💥 游戏结束！', '踩到地雷了'), 100)
      } else if (newBoard.gameWon) {
        setTimeout(() => Alert.alert('🎉 恭喜你赢了！', '你成功排出了所有地雷'), 100)
      }
      
      return newBoard
    })
  }, [])

  const handleCellLongPress = useCallback((row: number, col: number) => {
    setBoard((prevBoard) => {
      const newBoard = cloneBoard(prevBoard)
      newBoard.toggleFlag(row, col)
      return newBoard
    })
  }, [])

  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty)
    setBoard(new Board(DIFFICULTY_CONFIG[newDifficulty]))
  }, [])

  const handleRestart = useCallback(() => {
    setBoard(new Board(DIFFICULTY_CONFIG[difficulty]))
  }, [difficulty])

  return (
    <View style={styles.container}>
      <Header
        minesRemaining={board.config.mines - board.flagCount}
        currentDifficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
        onRestart={handleRestart}
      />
      <View style={styles.boardContainer}>
        <BoardComponent
          board={board}
          onCellPress={handleCellPress}
          onLongPress={handleCellLongPress}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50'
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
