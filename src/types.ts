export interface Cell {
  row: number
  col: number
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
}

export type Difficulty = 'beginner' | 'intermediate' | 'expert'

export interface GameConfig {
  rows: number
  cols: number
  mines: number
}

export const DIFFICULTY_CONFIG: Record<Difficulty, GameConfig> = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 }
}
