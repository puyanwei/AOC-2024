import { importFromTextFileAndSplitByNewLine } from "../utils"

const data: string[] = importFromTextFileAndSplitByNewLine("day-02/data.txt")
const resolvedData: number[][] = data.map((element) =>
  element.split(" ").map((element) => parseInt(element))
)
export const reports = resolvedData.reduce((prev, current) => {
  return increasesInNumber(current) && !hasGapHigherThanN(current, 3) ? (prev += 1) : prev
}, 0)

export function increasesInNumber(array: number[]): boolean {
  // check for duplicate neighbours in the array
  const isDuplicateNeighbours = array.some((element, index) => {
    const firstDigit = array[index - 1]
    const secondDigit = element
    if (firstDigit === secondDigit) return true
    return false
  })
  if (isDuplicateNeighbours) return false

  // is increasing, so sort and match
  if (array[0] < array[array.length - 1]) {
    const increasing = [...array].sort((a, b) => a - b)
    return !increasing.some((element, index) => element !== array[index])
  }

  // is decreasing, so reverse it then match
  if (array[0] > array[array.length - 1]) {
    const reversed = [...array].sort((a, b) => b - a)
    return !reversed.some((element, index) => {
      return element !== array[index]
    })
  }

  // when first and last element of the array are the same
  return false
}

export function hasGapHigherThanN(array: number[], gap: number) {
  return array.some((element, index) => {
    const firstDigit = array[index - 1]
    const secondDigit = element
    if (!firstDigit) return false
    if (!secondDigit) return false
    const difference = firstDigit - secondDigit
    const resolvedDifference = difference < 0 ? difference * -1 : difference
    if (resolvedDifference > gap) return true
    return false
  })
}
