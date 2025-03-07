import { importFromTextFileAndSplitByNewLine } from "../../utils"

// STRUCTURE: Consider moving constants and types to separate files
// for better organization and reusability
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

// READABILITY: Consider moving file operations to a separate function
// to make the main logic more focused
const data = importFromTextFileAndSplitByNewLine("day-04/data.txt")
export const wordSearchNumber = countMatchedWords(data, "xmas")

// STRUCTURE: Good use of types for parameters, but consider combining
// related types like Direction and CheckDirectionParams into a namespace
export type Direction = {
  name: string
  rowStep: number
  colStep: number
}

export type CheckDirectionParams = {
  row: number
  col: number
  direction: Direction
  grid: (string | null)[][]
  word: string
  foundPositions: Set<string>
}

// FUNCTIONAL: This could be more functional by using composition
// instead of imperative reduction

/*
Instead of directly accumulating inside a loop, you can compose pure functions to keep the logic more declarative and functional. Here, the main idea is to separate the logic into small, reusable functions that can be composed together.

For example, the logic could be split into smaller functions that each focus on a single task. You'd use higher-order functions to compose them instead of updating a total variable manually.

Here’s how you might refactor the findWordInGrid function to use composition and pure functions:

function findWordInGrid(grid: (string | null)[][], word: string): number {
  const positions = getAllPositions(grid);
  return positions
    .map(([row, col]) => checkAllDirections(row, col, grid, word))  // map to results
    .reduce((total, count) => total + count, 0);  // sum up all the results
}

// Example pure function for counting directions

function checkAllDirections(row: number, col: number, grid: (string | null)[][], word: string): number {
  const directions = getMovementDirections();
  return directions
    .map(direction => checkDirection({ row, col, direction, grid, word }))  // check each direction
    .reduce((sum, result) => sum + result, 0);  // sum up all results
}

*/
function findWordInGrid(grid: (string | null)[][], word: string): number {
  const positions = getAllPositions(grid)
  return positions.reduce((total, [row, col]) => total + checkAllDirections(row, col, grid, word), 0)
}

// READABILITY: Function name could be more specific about what it's checking
// Consider: countMatchesInAllDirections
function checkAllDirections(row: number, col: number, grid: (string | null)[][], word: string): number {
  const foundPositions = new Set<string>();
  return movementDirections.reduce(
    (count, direction) => count + checkDirection({ row, col, direction, grid, word, foundPositions }),
    0
  )
}

// FUNCTIONAL: Good use of flatMap for transforming 2D array
// but could be more explicit about the transformation
export function getAllPositions(grid: (string | null)[][]): [number, number][] {
  return grid.flatMap((row, rowIndex) =>
    row.map((_, colIndex) => [rowIndex, colIndex] as [number, number])
  )
}

// READABILITY: Function does multiple things - validation, grid creation, and search
// Consider splitting into smaller, focused functions
function countMatchedWords(data: string[], word: string): number {
  const wordLength = word.length
  if (data.length < wordLength || data[0].length < wordLength) return 0

  const grid = data.map((row) => [...row])
  return findWordInGrid(grid, word)
}

// FUNCTIONAL: Pure functions like these are good!
// But consider combining related utility functions into a utility class/namespace
export function getPositionKey(positions: string[]): string {
  return positions.join("|")
}

export function isNewMatch(positionKey: string, foundPositions: Set<string>): boolean {
  if (foundPositions.has(positionKey)) return false
  foundPositions.add(positionKey)
  return true
}

// STRUCTURE: Good use of type for parameters
// but consider making grid type more specific than (string | null)[][]
type CollectLettersInDirectionParams = {
  row: number
  col: number
  direction: { rowStep: number; colStep: number }
  wordLength: number
  grid: (string | null)[][]
}

// FUNCTIONAL: This function has side effects (modifying positions array)
// Consider making it pure by returning a new array
/*
export function collectLettersInDirection({
  row: startRow,
  col: startCol,
  direction,
  wordLength,
  grid,
}: CollectLettersInDirectionParams): { letters: string; positions: string[] } {
  const positions = Array.from({ length: wordLength }, (_, index) => {
    const newRow = startRow + direction.rowStep * index;
    const newCol = startCol + direction.colStep * index;
    return `${newRow},${newCol}`;
  });

  const letters = positions
    .map((position, index) => {
      const [newRow, newCol] = position.split(",").map(Number);
      return grid[newRow]?.[newCol]?.toLowerCase() ?? null;
    })
    .join("");

  return { letters, positions };
}
*/
export function collectLettersInDirection({
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
    positions.push(`${newRow},${newCol}`)  // Side effect!
    return grid[newRow]?.[newCol]?.toLowerCase() ?? null
  }).join("")

  return { letters, positions }
}

// READABILITY: Function is doing too much - checking direction,
// collecting letters, and validating matches
// Consider breaking into smaller functions
function checkDirection({ row, col, direction, grid, word, foundPositions }: CheckDirectionParams): number {
  const wordLength = word.length
  const lowerWord = word.toLowerCase()
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
