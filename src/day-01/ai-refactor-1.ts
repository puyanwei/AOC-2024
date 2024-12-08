import { readFileSync } from "fs"
import { join } from "path"

// Types
type NumberPair = [number, number]

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

const sortColumn = (pairs: NumberPair[], columnIndex: 0 | 1): number[] => {
  return pairs.map((pair) => pair[columnIndex]).sort((a, b) => a - b)
}

const calculateDistance = (a: number, b: number): number => {
  return Math.abs(a - b)
}

const calculateTotalDistance = (leftSorted: number[], rightSorted: number[]): number => {
  return leftSorted
    .map((leftNum, index) => calculateDistance(leftNum, rightSorted[index]))
    .reduce((sum, distance) => sum + distance, 0)
}

const solve = (inputFile: string): number => {
  // Read and parse input
  const input = readInputFile(inputFile)
  const pairs = parseInput(input)

  // Sort both columns independently
  const leftSorted = sortColumn(pairs, 0)
  const rightSorted = sortColumn(pairs, 1)

  // Calculate total distance
  return calculateTotalDistance(leftSorted, rightSorted)
}

// Execute solution
const result = solve("data.txt")
console.log("Total distance between lists:", result)

export { solve }
