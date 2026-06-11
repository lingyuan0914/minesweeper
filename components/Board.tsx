import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Board } from '../src/game/Board'
import { CellComponent } from './Cell'

interface BoardProps {
  board: Board
  onCellPress: (row: number, col: number) => void
  onCellLongPress: (row: number, col: number) => void
}

export function BoardComponent({ board, onCellPress, onCellLongPress }: BoardProps) {
  const screenWidth = Dimensions.get('window').width
  const padding = 16
  const availableWidth = screenWidth - padding * 2
  const cellSize = Math.floor(availableWidth / board.config.cols)

  return (
    <View style={styles.container}>
      {board.cells.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <CellComponent
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              cellSize={cellSize}
              onPress={() => onCellPress(rowIndex, colIndex)}
              onLongPress={() => onCellLongPress(rowIndex, colIndex)}
            />
          ))}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row'
  }
})
