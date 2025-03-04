import { importFromTextFileAndSplitByNewLine } from "../utils"

const data: string[] = importFromTextFileAndSplitByNewLine("day-03/data.txt")

const regex = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g
let allowMul = true

export const newMulNumber = data
  .flatMap((line) => {
    const matches = [...line.matchAll(regex)]

    return matches
      .flatMap((match) => {
        if (match[0] === "do()") {
          allowMul = true
          return null
        }
        if (match[0] === "don't()") {
          allowMul = false
          return null
        }
        if (!allowMul || !match[1] || !match[2]) return null

        const result = Number(match[1]) * Number(match[2])
        return result
      })
      .filter((num): num is number => num !== null)
  })
  .reduce((prev, current) => prev + current, 0)
