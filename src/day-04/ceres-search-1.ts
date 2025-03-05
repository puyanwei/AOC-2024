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

const data = importFromTextFileAndSplitByNewLine("day-04/data.txt")
export const wordSearchNumber = countMatchedWords(data, "xmas")

function findWordInGrid(grid: (string | null)[][], word: string): number {
  const checkAllDirections = (row: number, col: number): number =>
    movementDirections.reduce(
      (count, direction) => count + checkDirection({ row, col, direction, grid, word }),
      0
    )

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

function getPositionKey(positions: string[]): string {
  return positions.join("|")
}

function isNewMatch(positionKey: string, foundPositions: Set<string>): boolean {
  if (foundPositions.has(positionKey)) return false
  foundPositions.add(positionKey)
  return true
}

type CollectLettersInDirectionParams = {
  row: number
  col: number
  direction: { rowStep: number; colStep: number }
  wordLength: number
  grid: (string | null)[][]
}

function collectLettersInDirection({
  row: startRow,
  col: startCol,
  direction,
  wordLength,
  grid,
}: CollectLettersInDirectionParams): { letters: string; positions: string[] } {
  const positions: string[] = []
  const letters = Array.from({ length: wordLength }, (_, index) => {
    const newRow = startRow + direction.rowStep * index
    const newCol = startCol + direction.colStep * index
    positions.push(`${newRow},${newCol}`)
    return grid[newRow]?.[newCol]?.toLowerCase() ?? null
  }).join("")

  return { letters, positions }
}

type CheckDirectionParams = Omit<CollectLettersInDirectionParams, "wordLength"> & {
  word: string
}

function checkDirection({ row, col, direction, grid, word }: CheckDirectionParams): number {
  const wordLength = word.length
  const lowerWord = word.toLowerCase()
  const foundPositions = new Set<string>()
  const { letters, positions } = collectLettersInDirection({
    row,
    col,
    direction,
    wordLength,
    grid,
  })
  if (letters === lowerWord && isNewMatch(getPositionKey(positions), foundPositions)) return 1
  return 0
}
