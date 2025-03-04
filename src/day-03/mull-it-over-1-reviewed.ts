import { importFromTextFileAndSplitByNewLine } from "../utils"

// Define regex pattern for matching multiplication expressions
// Example matches: mul(2,3), mul(10,20)
const MULTIPLICATION_PATTERN = /mul\((\d+),(\d+)\)/g

// Type definition for multiplication operation result
type MultiplicationResult = number

// Parse and calculate multiplication from a matched expression
const calculateMultiplication = (match: RegExpMatchArray): MultiplicationResult => {
  const [_, firstNumber, secondNumber] = match
  return Number(firstNumber) * Number(secondNumber)
}

// Process input data and calculate sum of all multiplications
const calculateTotalSum = (lines: string[]): number => {
  return lines
    .flatMap((line) => [...line.matchAll(MULTIPLICATION_PATTERN)])
    .map(calculateMultiplication)
    .reduce((sum, result) => sum + result, 0)
}

// Read and process input file
const data: string[] = importFromTextFileAndSplitByNewLine("day-03/data.txt")
export const mulNumbers = calculateTotalSum(data)
