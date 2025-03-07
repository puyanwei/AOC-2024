import { importFromTextFileAndSplitByNewLine } from "../../utils"

// Types
type Grid = string[][]
type Position = readonly [row: number, col: number]
type Direction = {
  readonly rowStep: number
  readonly colStep: number
}

// Constants
const DIRECTIONS: readonly Direction[] = [
  { rowStep: 0, colStep: 1 },   // right
  { rowStep: 0, colStep: -1 },  // left
  { rowStep: 1, colStep: 0 },   // down
  { rowStep: -1, colStep: 0 },  // up
  { rowStep: 1, colStep: 1 },   // down-right
  { rowStep: -1, colStep: -1 }, // up-left
  { rowStep: 1, colStep: -1 },  // down-left
  { rowStep: -1, colStep: 1 }   // up-right
] as const

const WORD = "XMAS"

// Main export
const data = importFromTextFileAndSplitByNewLine("day-04/data.txt")
export const wordCount = findAllWords(createGrid(data))

// Grid operations
function createGrid(data: string[]): Grid {
  return data.map(row => [...row])
}

function getCharAt(grid: Grid, [row, col]: Position): string | undefined {
  return grid[row]?.[col]
}

// Word finding
function checkWord(grid: Grid, startPos: Position, dir: Direction, word: string): boolean {
  return word.split('').every((letter, index) => {
    const row = startPos[0] + (dir.rowStep * index)
    const col = startPos[1] + (dir.colStep * index)
    return getCharAt(grid, [row, col]) === letter
  })
}

function findWordsFromPosition(grid: Grid, startPos: Position, word: string): number {
  return DIRECTIONS.reduce((count, dir) => 
    checkWord(grid, startPos, dir, word) ? count + 1 : count
  , 0)
}

function getAllPositions(grid: Grid): Position[] {
  return grid.flatMap((row, rowIndex) =>
    row.map((_, colIndex) => [rowIndex, colIndex] as Position)
  )
}

function findAllWords(grid: Grid): number {
  return getAllPositions(grid)
    .map(pos => findWordsFromPosition(grid, pos, WORD))
    .reduce((sum, count) => sum + count, 0)
}
