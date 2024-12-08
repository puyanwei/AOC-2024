import { importFromTextFileAndSplitByNewLine, reorder } from "../utils"

// const data: string[] = importFromTextFileAndSplitByNewLine("day-01/example.txt")
const data: string[] = importFromTextFileAndSplitByNewLine("day-01/data.txt")

export type Location = {
  first: number
  second: number
}

export function transformArraysAndReorderFromSmallToLarge(data: string[]): Location[] {
  const firsts: number[] = data.map((locations) => {
    const [first] = locations.split("   ")
    return parseInt(first)
  })

  const seconds: number[] = data.map((locations) => {
    const [, second] = locations.split("   ")
    return parseInt(second)
  })

  const firstNumbers = reorder(firsts)
  const secondNumbers = reorder(seconds)

  // Create location objects by taking numbers from each sorted array
  return firstNumbers.map((first, index) => ({
    first,
    second: secondNumbers[index],
  }))
}

function getTotalDistance(data: Location[]) {
  return data.reduce((accumulator, { first, second }) => {
    const difference = calculateDifference(first, second)
    return (accumulator += difference)
  }, 0)
}

function calculateDifference(first: number, second: number) {
  if (first > second) return first - second
  if (first < second) return second - first
  return 0
}

const sortedLocationIds: Location[] = transformArraysAndReorderFromSmallToLarge(data)
export const totalDistance = getTotalDistance(sortedLocationIds)
