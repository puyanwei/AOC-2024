import { importFromTextFileAndSplitByNewLine } from "../utils"

// Parse input data into number arrays
const parseInput = (data: string[]): number[][] => data.map((line) => line.split(" ").map(Number))

// Check if numbers have exact difference of 1
const hasConsecutiveNumbers = (a: number, b: number): boolean => Math.abs(a - b) === 1

// Check if the gap between numbers exceeds the threshold
const exceedsGapThreshold = (a: number, b: number, maxGap: number): boolean =>
  Math.abs(a - b) > maxGap

// Check if array has any adjacent duplicates
const hasAdjacentDuplicates = (numbers: number[]): boolean =>
  numbers.some((num, i) => i > 0 && num === numbers[i - 1])

// Check if array is strictly monotonic (all increasing or all decreasing)
const isStrictlyMonotonic = (numbers: number[]): boolean => {
  const isIncreasing = numbers[0] < numbers[numbers.length - 1]
  const sortedNumbers = [...numbers].sort((a, b) => (isIncreasing ? a - b : b - a))
  return numbers.every((num, i) => num === sortedNumbers[i])
}

// Check if array has any gaps larger than specified threshold
const hasLargeGaps = (numbers: number[], maxGap: number): boolean =>
  numbers.some((num, i) => i > 0 && exceedsGapThreshold(numbers[i - 1], num, maxGap))

// Validate if a sequence meets all criteria
const isValidSequence = (numbers: number[]): boolean => {
  if (hasAdjacentDuplicates(numbers)) return false
  if (numbers[0] === numbers[numbers.length - 1]) return false
  if (hasLargeGaps(numbers, 3)) return false
  return isStrictlyMonotonic(numbers)
}

// Process input data and count valid sequences
const data: string[] = importFromTextFileAndSplitByNewLine("day-02/data.txt")
const sequences = parseInput(data)
export const reports = sequences.filter(isValidSequence).length
