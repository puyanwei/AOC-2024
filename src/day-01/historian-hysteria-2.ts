import { importFromTextFileAndSplitByNewLine } from "../utils"
import { Location, transformArraysAndReorderFromSmallToLarge } from "./historian-hysteria-1"

// const data: string[] = importFromTextFileAndSplitByNewLine("day-01/example.txt")
const data: string[] = importFromTextFileAndSplitByNewLine("day-01/data.txt")
const locationIds: Location[] = transformArraysAndReorderFromSmallToLarge(data)
const matches = countMatches(locationIds)
export const score = getSimilarityScore(matches)

function getSimilarityScore(count: Count[]) {
  return count.reduce((accumulator, { value, count }) => {
    const score = parseInt(value) * count
    return (accumulator += score)
  }, 0)
}

type Count = {
  value: string
  count: number
}

function countMatches(locations: Location[]): Count[] {
  const matchCounts: { [key: string]: number } = {}

  // Initialize all first values with 0
  locations.forEach((location) => {
    matchCounts[location.first] = 0
  })

  // Count matches
  locations.forEach((location) => {
    locations.forEach((innerLocation) => {
      if (location.first === innerLocation.second) {
        matchCounts[location.first]++
      }
    })
  })

  return Object.entries(matchCounts).map(([value, count]) => ({
    value,
    count,
  }))
}
