import { assertEquals } from "std/assert/mod.ts";

function isDigit(c: string): boolean {
  return /^\d$/.test(c);
}

const adjacency: Gear[] = [
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

type Gear = [number, number];
type GearKey = string;
function getGearKey(gear: Gear): GearKey {
  return `${gear[0]},${gear[1]}`;
}

function adjacentGears(
  grid: string[],
  x0: number,
  y0: number,
): Gear[] {
  const width = grid[0].length;
  const height = grid.length;
  return adjacency.map(([dx, dy]) => [x0 + dx, y0 + dy]).filter(([x, y]) =>
    x >= 0 && x < width && y >= 0 && y < height && getAt(grid, x, y) === "*"
  ) as Gear[];
}

function collectGearRatios(grid: string[]): number[] {
  const width = grid[0].length;
  const height = grid.length;
  const gearLabels: Record<GearKey, number[]> = {};

  let isParsingNumber = false;
  let gears: Set<GearKey> = new Set();
  let number = 0;

  function resetState() {
    for (const key of gears) {
      const labels = gearLabels[key] || [];
      gearLabels[key] = labels.concat([number]);
    }
    isParsingNumber = false;
    gears = new Set();
    number = 0;
  }

  function parseDigit(c: string, x: number, y: number) {
    isParsingNumber = true;
    number = number * 10 + Number.parseInt(c);
    adjacentGears(grid, x, y).forEach((gear) =>
      gears = gears.add(getGearKey(gear))
    );
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

  const results: number[] = [];
  for (const labels of Object.values(gearLabels)) {
    if (labels.length != 2) continue;
    const [first, second] = labels;
    results.push(first * second);
  }
  return results;
}

export default function day03_2(input: string): string {
  const grid = input.split("\n").filter((line) => line.length > 0);
  return collectGearRatios(grid).reduce((x, y) => x + y, 0).toString();
}

Deno.test("example input", () => {
  assertEquals(
    day03_2(`
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
    "467835",
  );
});
