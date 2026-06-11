import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Board } from '../src/game/Board'
import { CellComponent } from './Cell'
import { useTheme } from './ThemeProvider'

interface BoardProps {
  board: Board
  onCellPress: (row: number, col: number) => void
  onLongPress: (row: number, col: number) => void
}

export function BoardComponent({ board, onCellPress, onLongPress }: BoardProps) {
  const { theme } = useTheme()
  const screenWidth = Dimensions.get('window').width
  const padding = 16
  const availableWidth = screenWidth - padding * 2
  const cellSize = Math.floor(availableWidth / board.config.cols)

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.board, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
        {board.cells.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <CellComponent
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                cellSize={cellSize}
                onPress={() => onCellPress(rowIndex, colIndex)}
                onLongPress={() => onLongPress(rowIndex, colIndex)}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  board: {
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  row: {
    flexDirection: 'row',
  },
})
