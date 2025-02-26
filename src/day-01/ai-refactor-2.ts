import { readFileSync } from "fs"
import { join } from "path"

// Types and constants
type DigitMatch = {
  value: number
  index: number
}

const NUMBER_WORDS = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
} as const

// Pure functions
const readInputFile = (filename: string): string => {
  return readFileSync(join(__dirname, filename), "utf-8")
}

const findAllDigits = (line: string): DigitMatch[] => {
  const matches: DigitMatch[] = []

  // Find numeric digits
  ;[...line].forEach((char, index) => {
    if (/\d/.test(char)) {
      matches.push({ value: parseInt(char), index })
    }
  })

  // Find spelled-out numbers
  Object.entries(NUMBER_WORDS).forEach(([word, value]) => {
    let pos = 0
    while ((pos = line.indexOf(word, pos)) !== -1) {
      matches.push({ value, index: pos })
      pos += 1 // Allow overlapping matches like "oneight"
    }
  })

  return matches.sort((a, b) => a.index - b.index)
}

const getCalibrationValue = (line: string): number => {
  const digits = findAllDigits(line)
  if (digits.length === 0) return 0

  const firstDigit = digits[0].value
  const lastDigit = digits[digits.length - 1].value

  return firstDigit * 10 + lastDigit
}

const solve = (inputFile: string): number => {
  const input = readInputFile(inputFile)

  return input
    .trim()
    .split("\n")
    .map(getCalibrationValue)
    .reduce((sum, value) => sum + value, 0)
}

// Execute solution
const result = solve("data.txt")
console.log("Sum of calibration values:", result)

export { solve }
