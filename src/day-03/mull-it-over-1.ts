import { importFromTextFileAndSplitByNewLine } from "../utils"

const regex = /mul\((\d+),(\d+)\)/g // Capture groups for numbers
/*
(\d+) → Captures the first number.
(\d+) → Captures the second number.
The g flag allows multiple matches per line.
*/

const data: string[] = importFromTextFileAndSplitByNewLine("day-03/data.txt")

export const mulNumber = data
  .flatMap((line) => {
    const matches = [...line.matchAll(regex)] // Get all matches in the line
    return matches.map((match) => [Number(match[1]) * Number(match[2])]) // Extract and convert to numbers
  })
  .reduce((prev, current) => prev + current[0], 0)
