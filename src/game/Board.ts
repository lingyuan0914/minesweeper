import { Cell, GameConfig } from '../types'

export class Board {
  cells: Cell[][] = []
  config: GameConfig
  gameOver = false
  gameWon = false
  firstClick = true
  flagCount = 0
  revealedCount = 0

  constructor(config: GameConfig) {
    this.config = config
    this.initBoard()
  }

  private initBoard(): void {
    this.cells = []
    for (let r = 0; r < this.config.rows; r++) {
      const row: Cell[] = []
      for (let c = 0; c < this.config.cols; c++) {
        row.push({
          row: r,
          col: c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0
        })
      }
      this.cells.push(row)
    }
  }

  private placeMines(excludeRow: number, excludeCol: number): void {
    let placed = 0
    while (placed < this.config.mines) {
      const r = Math.floor(Math.random() * this.config.rows)
      const c = Math.floor(Math.random() * this.config.cols)
      if (!this.cells[r][c].isMine && !(r === excludeRow && c === excludeCol)) {
        this.cells[r][c].isMine = true
        placed++
      }
    }
    this.calculateNeighbors()
  }

  private calculateNeighbors(): void {
    const dirs = [-1, 0, 1]
    for (let r = 0; r < this.config.rows; r++) {
      for (let c = 0; c < this.config.cols; c++) {
        if (this.cells[r][c].isMine) continue
        let count = 0
        for (const dr of dirs) {
          for (const dc of dirs) {
            if (dr === 0 && dc === 0) continue
            const nr = r + dr
            const nc = c + dc
            if (nr >= 0 && nr < this.config.rows && nc >= 0 && nc < this.config.cols) {
              if (this.cells[nr][nc].isMine) count++
            }
          }
        }
        this.cells[r][c].neighborMines = count
      }
    }
  }

  reveal(row: number, col: number): boolean {
    if (this.gameOver || this.gameWon) return false

    const cell = this.cells[row][col]
    if (cell.isRevealed || cell.isFlagged) return false

    if (this.firstClick) {
      this.firstClick = false
      this.placeMines(row, col)
    }

    if (cell.isMine) {
      this.gameOver = true
      this.revealAllMines()
      return false
    }

    this.floodReveal(row, col)
    this.checkWin()
    return true
  }

  private floodReveal(row: number, col: number): void {
    const cell = this.cells[row][col]
    if (cell.isRevealed || cell.isFlagged || cell.isMine) return

    cell.isRevealed = true
    this.revealedCount++

    if (cell.neighborMines === 0) {
      const dirs = [-1, 0, 1]
      for (const dr of dirs) {
        for (const dc of dirs) {
          if (dr === 0 && dc === 0) continue
          const nr = row + dr
          const nc = col + dc
          if (nr >= 0 && nr < this.config.rows && nc >= 0 && nc < this.config.cols) {
            this.floodReveal(nr, nc)
          }
        }
      }
    }
  }

  toggleFlag(row: number, col: number): void {
    if (this.gameOver || this.gameWon) return
    const cell = this.cells[row][col]
    if (cell.isRevealed) return

    cell.isFlagged = !cell.isFlagged
    this.flagCount += cell.isFlagged ? 1 : -1
  }

  private revealAllMines(): void {
    for (const row of this.cells) {
      for (const cell of row) {
        if (cell.isMine) cell.isRevealed = true
      }
    }
  }

  private checkWin(): void {
    const totalCells = this.config.rows * this.config.cols
    if (this.revealedCount === totalCells - this.config.mines) {
      this.gameWon = true
    }
  }

  reset(): void {
    this.gameOver = false
    this.gameWon = false
    this.firstClick = true
    this.flagCount = 0
    this.revealedCount = 0
    this.initBoard()
  }
}
