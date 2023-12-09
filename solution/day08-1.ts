import { assertEquals } from "std/assert/mod.ts";

enum Direction {
  Left = 0,
  Right = 1,
}

function parseDirections(line: string): Direction[] {
  const result: Direction[] = [];
  for (let i = 0; i < line.length; ++i) {
    const char = line.charAt(i);
    if (char == "L") {
      result.push(Direction.Left);
    } else if (char == "R") {
      result.push(Direction.Right);
    }
  }
  return result;
}

function parseNetwork(lines: string[]): Record<string, [string, string]> {
  const result: Record<string, [string, string]> = {};
  for (const line of lines) {
    const key = line.slice(0, 3);
    const left = line.slice(7, 10);
    const right = line.slice(12, 15);
    result[key] = [left, right];
  }
  return result;
}

const startSymbol = "AAA";
const endSymbol = "ZZZ";

export default function day08_1(input: string): string {
  const lines = input.split("\n").map((s) => s.trim()).filter((s) =>
    s.length > 0
  );
  const directions = parseDirections(lines[0]);
  const network = parseNetwork(lines.slice(1));
  let steps = 0;
  let currentSymbol = startSymbol;
  let directionIndex = 0;
  while (currentSymbol != endSymbol) {
    const direction = directions[directionIndex++];
    if (directionIndex >= directions.length) {
      directionIndex = 0;
    }
    currentSymbol = network[currentSymbol][direction];
    steps += 1;
  }
  return steps.toString();
}

Deno.test("parse network", () => {
  const network = parseNetwork(["AAA = (BBB, CCC)"]);
  assertEquals(Object.keys(network), ["AAA"]);
  assertEquals(network["AAA"], ["BBB", "CCC"]);
});

Deno.test("day08-1", () => {
  assertEquals(
    day08_1(`
RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)
		`),
    "2",
  );
  assertEquals(
    day08_1(`
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)
		`),
    "6",
  );
});
