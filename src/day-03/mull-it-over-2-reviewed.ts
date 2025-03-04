import { importFromTextFileAndSplitByNewLine } from "../utils"

// Consider moving to a config/constants file
const data: string[] = importFromTextFileAndSplitByNewLine("day-03/data.txt")

// Good: Clear regex pattern name and grouping
const regex = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g

// Consider: Convert to immutable state using a reducer or composition
// Example:
// type State = { allowMul: boolean, result: number }
// const initialState: State = { allowMul: true, result: 0 }
let allowMul = true

export const newMulNumber = data
  .flatMap((line) => {
    // Consider: Extract match processing to a pure function
    const matches = [...line.matchAll(regex)]

    return matches
      .flatMap((match) => {
        // Consider: Replace imperative flags with functional composition
        // Example using discriminated unions:
        // type Command =
        //   | { type: 'do' }
        //   | { type: 'dont' }
        //   | { type: 'multiply', values: [number, number] }
        if (match[0] === "do()") {
          allowMul = true // Mutable state should be avoided
          return null
        }
        if (match[0] === "don't()") {
          allowMul = false // Mutable state should be avoided
          return null
        }
        if (!allowMul || !match[1] || !match[2]) return null

        // Good: Pure calculation
        const result = Number(match[1]) * Number(match[2])
        return result
      })
      .filter((num): num is number => num !== null) // Good: Type predicate
  })
  .reduce((prev, current) => prev + current, 0) // Consider adding type annotations
