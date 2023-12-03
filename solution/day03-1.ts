import { assertEquals } from "std/assert/mod.ts";

function isDigit(c: string): boolean {
  return /^\d$/.test(c);
}

function isSymbol(c: string): boolean {
  return c != "." && !isDigit(c);
}

const adjacency = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
];

function getAt(grid: string[], x: number, y: number): string {
  return grid[y]![x];
}

function adjacentToSymbol(grid: string[], x0: number, y0: number): boolean {
  const width = grid[0].length;
  const height = grid.length;
  for (const [dx, dy] of adjacency) {
    const x = x0 + dx;
    const y = y0 + dy;
    if (x < 0 || x >= width) continue;
    if (y < 0 || y >= height) continue;
    if (isSymbol(getAt(grid, x, y))) return true;
  }
  return false;
}

function collectPartNumbers(grid: string[]): number[] {
  const results: number[] = [];
  const width = grid[0].length;
  const height = grid.length;

  let isParsingNumber = false;
  let isPartNumber = false;
  let number = 0;

  function resetState() {
    if (isPartNumber) {
      results.push(number);
    }
    isParsingNumber = false;
    isPartNumber = false;
    number = 0;
  }

  function parseDigit(c: string, x: number, y: number) {
    isParsingNumber = true;
    isPartNumber = isPartNumber || adjacentToSymbol(grid, x, y);
    number = number * 10 + Number.parseInt(c);
  }

  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const c = getAt(grid, x, y);
      if (isDigit(c)) {
        parseDigit(c, x, y);
      } else if (isParsingNumber) {
        resetState();
      }
    }
    resetState();
  }

  return results;
}

export default function day03_1(input: string): string {
  const grid = input.split("\n").filter((line) => line.length > 0);
  return collectPartNumbers(grid).reduce((x, y) => x + y, 0).toString();
}

Deno.test("example input", () => {
  assertEquals(
    day03_1(`
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`),
    "4361",
  );
});
