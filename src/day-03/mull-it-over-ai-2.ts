import { importFromTextFileAndSplitByNewLine } from "../utils"

// Define possible command types using discriminated union:
// - "do": enables multiplication
// - "dont": disables multiplication
// - "multiply": performs multiplication with two values if allowed
type Command = { type: "do" } | { type: "dont" } | { type: "multiply"; values: [number, number] }

// Tracks the current state of processing:
// - allowMul: whether multiplication is currently enabled
// - result: running sum of all valid multiplications
type State = {
  allowMul: boolean
  result: number
}

// Import and parse input data from file
const data: string[] = importFromTextFileAndSplitByNewLine("day-03/data.txt")

/**
 * Converts a regex match into a typed Command object
 * @param match - RegExp match containing command information
 * @returns Command object representing the matched instruction
 */
const parseCommand = (match: RegExpMatchArray): Command => {
  if (match[0] === "do()") return { type: "do" }
  if (match[0] === "don't()") return { type: "dont" }
  if (match[1] && match[2])
    return {
      type: "multiply",
      values: [Number(match[1]), Number(match[2])],
    }
  return { type: "dont" }
}

/**
 * Processes a single command and updates the state accordingly
 * @param state - Current state of processing
 * @param command - Command to process
 * @returns New state after processing the command
 */
const processCommand = (state: State, command: Command): State => {
  switch (command.type) {
    case "do":
      return { ...state, allowMul: true }
    case "dont":
      return { ...state, allowMul: false }
    case "multiply":
      return state.allowMul
        ? { ...state, result: state.result + command.values[0] * command.values[1] }
        : state
  }
}

// Main processing pipeline:
// 1. Join all lines and find all commands using regex
// 2. Parse each regex match into a Command object
// 3. Process all commands sequentially, maintaining state
// 4. Extract final result
export const newMulNumber = [...data.join("\n").matchAll(/mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g)]
  .map(parseCommand)
  .reduce(processCommand, { allowMul: true, result: 0 }).result
