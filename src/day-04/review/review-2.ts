import { importFromTextFileAndSplitByNewLine } from "../../utils"
// STRUCTURE: Good separation of types at the top

// Consider moving to a separate types.ts file for reuse
type Position = [number, number]
type Direction = { start: Position, end: Position }
type Grid = string[][]
type Pattern = { mas: boolean, sam: boolean }
type GridPosition = {
    grid: Grid
    row: number
    col: number
}

// READABILITY: Consider extracting file operations and grid creation
// into a separate function with a descriptive name
const data = importFromTextFileAndSplitByNewLine("day-04/data.txt")
const grid = data.map(row => [...row])
export const crossesNumber = findCrosses(grid)

// FUNCTIONAL: Good separation of concerns in findCrosses
// But could be more declarative with the validation
function findCrosses(grid: Grid): number {
  const isGridValid = grid.length > 2 && grid[0].length > 2
  if (!isGridValid) return 0
  const positions = getCenterCoordinates(grid)
  return positions.reduce((total, [row, col]) => 
    total + findMASInDiagonalCoords({ grid, row, col }), 0)
}

// READABILITY: Good descriptive function name
// STRUCTURE: Consider extracting diagonalPatterns as a constant
function findMASInDiagonalCoords({ grid, row, col }: GridPosition): number {
  const diagonalPatterns: Direction[] = [
    { start: [-1, -1] as Position, end: [1, 1] as Position },
    { start: [-1, 1] as Position, end: [1, -1] as Position }
  ]

  // FUNCTIONAL: Good use of map for transformation
  // Consider extracting pattern checking into a separate function
  const patterns = diagonalPatterns.map(dir => ({
    mas: hasPattern({ grid, row, col, dir, pattern: ['m', 's'] }),
    sam: hasPattern({ grid, row, col, dir, pattern: ['s', 'm'] })
  }))

  return countValidCrosses(patterns)
}

// FUNCTIONAL: Pure function with clear purpose
// Consider using a more descriptive name like countValidCrossPatterns
function countValidCrosses(patterns: Pattern[]): number {
  const [dir1, dir2] = patterns
  return Number(
    (dir1.mas && dir2.mas) ||
    (dir1.sam && dir2.sam) ||
    (dir1.mas && dir2.sam) ||
    (dir1.sam && dir2.mas)
  )
}

// READABILITY: Complex parameter type could be simplified with a custom type
// FUNCTIONAL: Pure function with good single responsibility
function hasPattern({ grid, row, col, dir, pattern: [first, last] }: 
  GridPosition & { dir: Direction, pattern: [string, string] }): boolean {
  const startRow = row + dir.start[0]
  const startCol = col + dir.start[1]
  const endRow = row + dir.end[0]
  const endCol = col + dir.end[1]

  return grid[startRow]?.[startCol]?.toLowerCase() === first && 
         grid[endRow]?.[endCol]?.toLowerCase() === last
}

// FUNCTIONAL: Good use of flatMap and reduce
// READABILITY: Clear variable names make the logic easy to follow
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