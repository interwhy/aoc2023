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

function isStartSymbol(symbol: string): boolean {
  return symbol[2] == "A";
}

function isEndSymbol(symbol: string): boolean {
  return symbol[2] == "Z";
}

type GhostMap = {
  network: Record<string, [string, string]>;
  startSymbols: string[];
};

function parseGhostMap(lines: string[]): GhostMap {
  const startSymbols: string[] = [];
  const network: Record<string, [string, string]> = {};
  for (const line of lines) {
    const key = line.slice(0, 3);
    const left = line.slice(7, 10);
    const right = line.slice(12, 15);
    network[key] = [left, right];
    if (isStartSymbol(key)) {
      startSymbols.push(key);
    }
  }
  return { network, startSymbols };
}

function gcd(a: number, b: number): number {
  if (!b) return a;
  return gcd(b, a % b);
}

function lcm(a: number, b: number): number {
  return a * b / gcd(a, b);
}

export default function day08_2(input: string): string {
  const lines = input.split("\n").map((s) => s.trim()).filter((s) =>
    s.length > 0
  );
  const directions = parseDirections(lines[0]);
  const ghostMap = parseGhostMap(lines.slice(1));

  const stepsToEnd: number[][] = [];
  ghostMap.startSymbols.forEach((_, i) => stepsToEnd[i] = []);
  let steps = 0;
  let currentSymbols = ghostMap.startSymbols;
  let directionIndex = 0;
  while (!currentSymbols.every((_, i) => stepsToEnd[i].length > 0)) {
    currentSymbols.forEach((s, i) => {
      if (isEndSymbol(s)) {
        stepsToEnd[i].push(steps);
      }
    });
    const direction = directions[directionIndex++];
    if (directionIndex >= directions.length) {
      directionIndex = 0;
    }
    currentSymbols = currentSymbols.map((s) => ghostMap.network[s][direction]);
    steps += 1;
  }

  return Object.values(stepsToEnd).reduce((a, b) => lcm(a, b[0]), 1).toString();
}

Deno.test("day08-2", () => {
  assertEquals(
    day08_2(`
LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
`),
    "6",
  );
});
