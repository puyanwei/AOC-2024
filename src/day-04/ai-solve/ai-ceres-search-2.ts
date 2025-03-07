import { importFromTextFileAndSplitByNewLine } from "../../utils"

// Types
type Grid = string[][]
type Position = readonly [row: number, col: number]
type Direction = {
  readonly start: Position
  readonly end: Position
}
type Pattern = readonly [first: string, last: string]

// Constants
const DIAGONAL_PATTERNS: readonly Direction[] = [
  { start: [-1, -1] as Position, end: [1, 1] as Position },  // down-right
  { start: [-1, 1] as Position, end: [1, -1] as Position }   // down-left
] as const

const PATTERNS: readonly Pattern[] = [
  ['m', 's'],  // MAS
  ['s', 'm']   // SAM
] as const

// Main export
const data = importFromTextFileAndSplitByNewLine("day-04/data.txt")
export const xMasCount = countXMasPatterns(createGrid(data))

// Grid operations
function createGrid(data: string[]): Grid {
  return data.map(row => [...row])
}

function getCharAt(grid: Grid, [row, col]: Position): string | undefined {
  return grid[row]?.[col]?.toLowerCase()
}

// Find center 'a's (not on edges)
function findCenterAs(grid: Grid): Position[] {
  return grid.flatMap((row, rowIndex) => {
    const isEdgeRow = rowIndex === 0 || rowIndex === grid.length - 1
    if (isEdgeRow) return []
    
    return row.reduce<Position[]>((acc, cell, colIndex) => {
      const isEdgeCol = colIndex === 0 || colIndex === row.length - 1
      if (isEdgeCol) return acc
      return cell.toLowerCase() === 'a' 
        ? [...acc, [rowIndex, colIndex] as Position]
        : acc
    }, [])
  })
}

// Pattern checking
function checkDiagonal(grid: Grid, center: Position, dir: Direction, pattern: Pattern): boolean {
  const startPos: Position = [
    center[0] + dir.start[0],
    center[1] + dir.start[1]
  ]
  const endPos: Position = [
    center[0] + dir.end[0],
    center[1] + dir.end[1]
  ]

  return getCharAt(grid, startPos) === pattern[0] && 
         getCharAt(grid, endPos) === pattern[1]
}

function countPatternsInDiagonal(grid: Grid, center: Position, dir: Direction): number {
  return PATTERNS.reduce((count, pattern) =>
    checkDiagonal(grid, center, dir, pattern) ? count + 1 : count
  , 0)
}

// X-MAS counting
function countXMasAtPosition(grid: Grid, center: Position): number {
  const [diag1, diag2] = DIAGONAL_PATTERNS
  const patterns1 = countPatternsInDiagonal(grid, center, diag1)
  const patterns2 = countPatternsInDiagonal(grid, center, diag2)
  
  return patterns1 * patterns2  // If both diagonals have patterns, we have an X-MAS
}

function countXMasPatterns(grid: Grid): number {
  if (grid.length < 3 || grid[0].length < 3) return 0
  
  return findCenterAs(grid)
    .map(pos => countXMasAtPosition(grid, pos))
    .reduce((sum, count) => sum + count, 0)
}
