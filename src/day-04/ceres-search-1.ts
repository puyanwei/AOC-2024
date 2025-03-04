import { importFromTextFileAndSplitByNewLine } from "../utils"
/*
IDEA 1
- Iterate across the grid with a 4x4 square then look for XMAS inside it
- Can immediately count out impossible situations, eg if 3 cells to the left of a border, its impossible for XMAS to appear horizontally as there are not enough cells to spell it

IDEA 2
- Do each direction over the whole data one at a time
- Could be more performant as if a letter of xmas is not found you can skip 4 characters ahead. That being said that is true also with IDEA 1

IDEA 3
- Look for XMAS horizontally, then for a different direction resort the data so that you can run it again horizontally
- Needs figuring out how this would work for diagonals
*/

const data = importFromTextFileAndSplitByNewLine("day-04/data.txt")
export const wordSearchNumber = countMatchedWords(data, "xmas")

function findWordInGrid(grid: (string | null)[][], word: string): number {
  const wordLength = word.length
  const lowerWord = word.toLowerCase()
  const foundPositions = new Set<string>()

  const movementDirections = [
    { name: "Right", rowStep: 0, colStep: 1 },
    { name: "Left", rowStep: 0, colStep: -1 },
    { name: "Down", rowStep: 1, colStep: 0 },
    { name: "Up", rowStep: -1, colStep: 0 },
    { name: "Diagonal Down-Right", rowStep: 1, colStep: 1 },
    { name: "Diagonal Up-Left", rowStep: -1, colStep: -1 },
    { name: "Diagonal Down-Left", rowStep: 1, colStep: -1 },
    { name: "Diagonal Up-Right", rowStep: -1, colStep: 1 },
  ]

  const getPositionKey = (positions: string[]): string => positions.join("|")

  const isNewMatch = (positionKey: string): boolean => {
    if (foundPositions.has(positionKey)) return false
    foundPositions.add(positionKey)
    return true
  }

  const collectLettersInDirection = (
    startRow: number,
    startCol: number,
    direction: { rowStep: number; colStep: number }
  ): { letters: string; positions: string[] } => {
    const positions: string[] = []
    const letters = Array.from({ length: wordLength }, (_, index) => {
      const newRow = startRow + direction.rowStep * index
      const newCol = startCol + direction.colStep * index
      positions.push(`${newRow},${newCol}`)
      return grid[newRow]?.[newCol]?.toLowerCase() ?? null
    }).join("")

    return { letters, positions }
  }

  const checkDirection = (
    row: number,
    col: number,
    direction: (typeof movementDirections)[0]
  ): number => {
    const { letters, positions } = collectLettersInDirection(row, col, direction)
    if (letters === lowerWord && isNewMatch(getPositionKey(positions))) return 1
    return 0
  }

  const checkAllDirections = (row: number, col: number): number =>
    movementDirections.reduce((count, direction) => count + checkDirection(row, col, direction), 0)

  const getAllPositions = (): [number, number][] =>
    grid.flatMap((row, rowIndex) =>
      row.map((_, colIndex) => [rowIndex, colIndex] as [number, number])
    )

  return getAllPositions().reduce((total, [row, col]) => total + checkAllDirections(row, col), 0)
}

function countMatchedWords(data: string[], word: string): number {
  const wordLength = word.length
  if (data.length < wordLength || data[0].length < wordLength) return 0

  const grid = data.map((row) => [...row])
  return findWordInGrid(grid, word)
}
