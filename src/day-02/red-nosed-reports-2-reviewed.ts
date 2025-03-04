import { importFromTextFileAndSplitByNewLine } from "../utils"

// Parse input data into number arrays
const parseInput = (data: string[]): number[][] => data.map((line) => line.split(" ").map(Number))

// Get all possible sequences by removing one number at each position
const getAllPossibleSequences = (numbers: number[]): number[][] =>
  numbers.map((_, index) => numbers.filter((_, i) => i !== index))

// Get pairs of adjacent numbers in array
const getPairs = (numbers: number[]): [number, number][] =>
  numbers.slice(1).map((num, i) => [numbers[i], num])

// Check if array has any adjacent duplicates
const hasAdjacentDuplicates = (numbers: number[]): boolean =>
  getPairs(numbers).some(([a, b]) => a === b)

// Check if array has gaps larger than threshold
const hasLargeGaps = (numbers: number[], maxGap: number): boolean =>
  getPairs(numbers).some(([a, b]) => Math.abs(a - b) > maxGap)

// Check if array is strictly monotonic (all increasing or all decreasing)
// CHANGE: Simplified from original sort-based approach to direction-based check
const isStrictlyMonotonic = (numbers: number[]): boolean => {
  if (numbers[0] === numbers[numbers.length - 1]) return false

  const isIncreasing = numbers[0] < numbers[numbers.length - 1]
  return getPairs(numbers).every(([a, b]) => (isIncreasing ? a < b : a > b))
}

// Validate if a sequence meets all criteria
// CHANGE: Combined multiple conditions into a single expression
const isValidSequence = (numbers: number[]): boolean =>
  !hasAdjacentDuplicates(numbers) && !hasLargeGaps(numbers, 3) && isStrictlyMonotonic(numbers)

// CHANGE: Replaced imperative loop with functional approach
// Find if any subsequence (removing one number) is valid
const hasValidSubsequence = (numbers: number[]): boolean =>
  getAllPossibleSequences(numbers).some(isValidSequence)

// Process input and count valid sequences
// CHANGE: Simplified the reduction to a filter and length count
const data = importFromTextFileAndSplitByNewLine("day-02/data.txt")
const sequences = parseInput(data)
export const updatedReports = sequences.filter(hasValidSubsequence).length
