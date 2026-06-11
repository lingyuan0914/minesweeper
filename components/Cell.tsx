import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Cell } from '../src/types'

interface CellProps {
  cell: Cell
  cellSize: number
  onPress: () => void
  onLongPress: () => void
}

const NUMBER_COLORS: Record<number, string> = {
  1: '#2980b9',
  2: '#27ae60',
  3: '#e74c3c',
  4: '#8e44ad',
  5: '#c0392b',
  6: '#1abc9c',
  7: '#2c3e50',
  8: '#95a5a6'
}

export function CellComponent({ cell, cellSize, onPress, onLongPress }: CellProps) {
  const getBackgroundColor = () => {
    if (cell.isRevealed) {
      return cell.isMine ? '#e74c3c' : '#bdc3c7'
    }
    return '#34495e'
  }

  const renderContent = () => {
    if (!cell.isRevealed && cell.isFlagged) {
      return <Text style={styles.flag}>🚩</Text>
    }
    if (cell.isRevealed && cell.isMine) {
      return <Text style={styles.mine}>💣</Text>
    }
    if (cell.isRevealed && cell.neighborMines > 0) {
      return (
        <Text style={[styles.number, { color: NUMBER_COLORS[cell.neighborMines] }]}>
          {cell.neighborMines}
        </Text>
      )
    }
    return null
  }

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.cell,
        {
          width: cellSize,
          height: cellSize,
          backgroundColor: getBackgroundColor()
        }
      ]}
    >
      {renderContent()}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1
  },
  flag: {
    fontSize: 16
  },
  mine: {
    fontSize: 16
  },
  number: {
    fontSize: 18,
    fontWeight: 'bold'
  }
})
