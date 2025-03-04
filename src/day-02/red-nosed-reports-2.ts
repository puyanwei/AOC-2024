import { importFromTextFileAndSplitByNewLine } from "../utils"
import { increasesInNumber, hasGapHigherThanN } from "./red-nosed-reports-1"

const data: string[] = importFromTextFileAndSplitByNewLine("day-02/data.txt")
const resolvedData: number[][] = data.map((element) =>
  element.split(" ").map((element) => parseInt(element))
)
export const updatedReports = resolvedData.reduce((prev, current) => {
  let hasPassed = false
  for (let index = 0; index < current.length; index++) {
    const newArr = current.filter((_, i) => i !== index)
    if (isValid(newArr)) {
      hasPassed = true
      break
    }
  }
  return hasPassed ? (prev += 1) : prev
}, 0)

function isValid(array: number[]) {
  return increasesInNumber(array) && !hasGapHigherThanN(array, 3)
}
