import fs from "fs"
import path from "path"

export function importFromTextFileAndSplitByNewLine(fileName: string): string[] {
  const fileContent = fs.readFileSync(path.join(__dirname, "..", fileName), "utf8")
  return fileContent.split("\n").filter(Boolean)
}

type Order = ">" | "<"

export function reorder(array: number[], type: Order = ">") {
  return type === ">" ? array.sort((a, b) => a - b) : array.sort((a, b) => b - a)
}
