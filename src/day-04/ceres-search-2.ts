import { importFromTextFileAndSplitByNewLine } from "../utils"

type Position = [number, number]
type Direction = { start: Position, end: Position }
type Grid = string[][]
type Pattern = { mas: boolean, sam: boolean }
type GridPosition = {
    grid: Grid
    row: number
    col: number
  }
  

const data = importFromTextFileAndSplitByNewLine("day-04/data.txt")
const grid = data.map(row => [...row])
export const crossesNumber = findCrosses(grid)

function findCrosses(grid: Grid): number {
  const isGridValid = grid.length > 2 && grid[0].length > 2
  if (!isGridValid) return 0
  const positions = getCenterCoordinates(grid)
  return positions.reduce((total, [row, col]) => 
    total + findMASInDiagonalCoords({ grid, row, col }), 0)
}

function findMASInDiagonalCoords({ grid, row, col }: GridPosition): number {
  const diagonalPatterns: Direction[] = [
    { start: [-1, -1] as Position, end: [1, 1] as Position },
    { start: [-1, 1] as Position, end: [1, -1] as Position }
  ]

  const patterns = diagonalPatterns.map(dir => ({
    mas: hasPattern({ grid, row, col, dir, pattern: ['m', 's'] }),
    sam: hasPattern({ grid, row, col, dir, pattern: ['s', 'm'] })
  }))

  return countValidCrosses(patterns)
}

function countValidCrosses(patterns: Pattern[]): number {
  const [dir1, dir2] = patterns
  return Number(
    (dir1.mas && dir2.mas) ||
    (dir1.sam && dir2.sam) ||
    (dir1.mas && dir2.sam) ||
    (dir1.sam && dir2.mas)
  )
}

function hasPattern({ grid, row, col, dir, pattern: [first, last] }: 
  GridPosition & { dir: Direction, pattern: [string, string] }): boolean {
  const startRow = row + dir.start[0]
  const startCol = col + dir.start[1]
  const endRow = row + dir.end[0]
  const endCol = col + dir.end[1]

  return grid[startRow]?.[startCol]?.toLowerCase() === first && 
         grid[endRow]?.[endCol]?.toLowerCase() === last
}

function getCenterCoordinates(grid: Grid): Position[] {
  return grid.flatMap((row, rowIndex) => {
    const isFirstOrLastRow = rowIndex === 0 || rowIndex === grid.length - 1 
    if (isFirstOrLastRow) return []
    return row.reduce<Position[]>((acc, cell, colIndex) => {
      const isFirstOrLastCol = colIndex === 0 || colIndex === row.length - 1
      if (isFirstOrLastCol) return acc
      return cell.toLowerCase() === 'a' 
        ? [...acc, [rowIndex, colIndex]]
        : acc
    }, [])
  })
}