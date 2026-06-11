import React, { useState, useCallback } from 'react'
import { View, StyleSheet } from 'react-native'
import { Board } from '../src/game/Board'
import { DIFFICULTY_CONFIG, Difficulty } from '../src/types'
import { BoardComponent } from '../components/Board'
import { Header } from '../components/Header'
import { GameOverModal } from '../components/GameOverModal'
import { useTheme } from '../components/ThemeProvider'
import { useGameSound } from '../src/hooks/useGameSound'

function cloneBoard(board: Board): Board {
  const newBoard = new Board(board.config)
  newBoard.cells = board.cells.map((row) => row.map((cell) => ({ ...cell })))
  newBoard.gameOver = board.gameOver
  newBoard.gameWon = board.gameWon
  newBoard.firstClick = board.firstClick
  newBoard.flagCount = board.flagCount
  newBoard.revealedCount = board.revealedCount
  return newBoard
}

export function GameScreen() {
  const { theme } = useTheme()
  const { playSound } = useGameSound()
  const [board, setBoard] = useState(() => new Board(DIFFICULTY_CONFIG.beginner))
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner')
  const [modalVisible, setModalVisible] = useState(false)
  const [isWin, setIsWin] = useState(false)

  const handleCellPress = useCallback(
    (row: number, col: number) => {
      setBoard((prevBoard) => {
        const newBoard = cloneBoard(prevBoard)
        const wasFirstClick = newBoard.firstClick
        newBoard.reveal(row, col)

        if (!wasFirstClick) {
          playSound('click')
        }

        if (newBoard.gameOver) {
          playSound('explosion')
          setIsWin(false)
          setModalVisible(true)
        } else if (newBoard.gameWon) {
          playSound('victory')
          setIsWin(true)
          setModalVisible(true)
        }

        return newBoard
      })
    },
    [playSound]
  )

  const handleCellLongPress = useCallback(
    (row: number, col: number) => {
      setBoard((prevBoard) => {
        const newBoard = cloneBoard(prevBoard)
        newBoard.toggleFlag(row, col)
        playSound('flag')
        return newBoard
      })
    },
    [playSound]
  )

  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty)
    setBoard(new Board(DIFFICULTY_CONFIG[newDifficulty]))
    setModalVisible(false)
  }, [])

  const handleRestart = useCallback(() => {
    setBoard(new Board(DIFFICULTY_CONFIG[difficulty]))
    setModalVisible(false)
  }, [difficulty])

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
      <GameOverModal
        visible={modalVisible}
        isWin={isWin}
        onRestart={handleRestart}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
