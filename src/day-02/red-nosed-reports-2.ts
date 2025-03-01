import { importFromTextFileAndSplitByNewLine } from "../utils"
import { increasesInNumber, hasGapHigherThanN } from "./red-nosed-reports-1"

const data: string[] = importFromTextFileAndSplitByNewLine("day-02/example.txt")
const resolvedData: number[][] = data.map((element) =>
  element.split(" ").map((element) => parseInt(element))
)
export const updatedReports = resolvedData.reduce((prev, current) => {
  current.some((element, index) => {
    const filteredArray = current.filter((elem) => current[index])
    console.log(filteredArray)
  })
  return increasesInNumber(current) && !hasGapHigherThanN(current, 3) ? (prev += 1) : prev
}, 0)
