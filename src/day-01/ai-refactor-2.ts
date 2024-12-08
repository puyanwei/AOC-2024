import { readFileSync } from "fs"
import { join } from "path"

// Types
type NumberPair = [number, number]
type NumberCount = Map<number, number>

// Pure functions
const readInputFile = (filename: string): string => {
  return readFileSync(join(__dirname, filename), "utf-8")
}

const parseInput = (input: string): NumberPair[] => {
  return input
    .trim()
    .split("\n")
    .map((line) => {
      const [left, right] = line.trim().split(/\s+/)
      return [parseInt(left), parseInt(right)] as NumberPair
    })
}

const countOccurrences = (numbers: number[]): NumberCount => {
  return numbers.reduce((count, num) => {
    count.set(num, (count.get(num) || 0) + 1)
    return count
  }, new Map<number, number>())
}

const calculateSimilarityScore = (pairs: NumberPair[]): number => {
  // Split pairs into left and right columns
  const leftNumbers = pairs.map(([left]) => left)
  const rightNumbers = pairs.map(([, right]) => right)

  // Count occurrences in right list
  const rightCounts = countOccurrences(rightNumbers)

  // Calculate similarity score
  return leftNumbers.reduce((score, leftNum) => {
    const occurrences = rightCounts.get(leftNum) || 0
    return score + leftNum * occurrences
  }, 0)
}

const solve = (inputFile: string): number => {
  // Read and parse input
  const input = readInputFile(inputFile)
  const pairs = parseInput(input)

  // Calculate similarity score
  return calculateSimilarityScore(pairs)
}

// Execute solution
const result = solve("data.txt")
console.log("Similarity score:", result)

export { solve }
