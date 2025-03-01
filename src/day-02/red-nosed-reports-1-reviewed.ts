import { importFromTextFileAndSplitByNewLine } from "../utils"

const data: string[] = importFromTextFileAndSplitByNewLine("day-02/data.txt")
const resolvedData: number[][] = data.map((element) =>
  element.split(" ").map((element) => parseInt(element))
)
export const reports = resolvedData.reduce((prev, current) => {
  return isValidSequence(current) ? (prev += 1) : prev
}, 0)

// NEW: Helper function to get adjacent number pairs
// This replaces the repeated index-based access pattern used in multiple functions
// Makes the code more declarative and reduces potential for off-by-one errors
const getPairs = (numbers: number[]): [number, number][] =>
  numbers.slice(1).map((num, i) => [numbers[i], num])

// REFACTORED: Simplified monotonic check
// Old version used sorting and array comparison
// New version uses Math.sign to determine direction and checks pairs directly
const isStrictlyMonotonic = (numbers: number[]): boolean => {
  const direction = Math.sign(numbers[numbers.length - 1] - numbers[0])
  if (direction === 0) return false

  return getPairs(numbers).every(([a, b]) => Math.sign(b - a) === direction)
}

// REFACTORED: Simplified gap checking using getPairs
// Old version used array indexing and multiple conditions
// New version is more functional and clearer in intent
const hasLargeGaps = (numbers: number[], maxGap: number): boolean =>
  getPairs(numbers).some(([a, b]) => exceedsGapThreshold(a, b, maxGap))

// REFACTORED: Simplified validation logic
// Old version used nested if statements
// New version uses boolean expressions for clearer intent
const isValidSequence = (numbers: number[]): boolean =>
  !hasAdjacentDuplicates(numbers) && !hasLargeGaps(numbers, 3) && isStrictlyMonotonic(numbers)

export function hasAdjacentDuplicates(array: number[]): boolean {
  // check for duplicate neighbours in the array
  const isDuplicateNeighbours = array.some((element, index) => {
    const firstDigit = array[index - 1]
    const secondDigit = element
    if (firstDigit === secondDigit) return true
    return false
  })
  if (isDuplicateNeighbours) return true

  // is increasing, so sort and match
  if (array[0] < array[array.length - 1]) {
    const increasing = [...array].sort((a, b) => a - b)
    return !increasing.some((element, index) => element !== array[index])
  }

  // is decreasing, so reverse it then match
  if (array[0] > array[array.length - 1]) {
    const reversed = [...array].sort((a, b) => b - a)
    return !reversed.some((element, index) => {
      return element !== array[index]
    })
  }

  // when first and last element of the array are the same
  return false
}

export function exceedsGapThreshold(a: number, b: number, maxGap: number): boolean {
  const difference = a - b
  const resolvedDifference = difference < 0 ? difference * -1 : difference
  if (resolvedDifference > maxGap) return true
  return false
}
