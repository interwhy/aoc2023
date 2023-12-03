import { assertEquals } from "std/assert/mod.ts";

function isDigit(c: string): boolean {
  return /^\d$/.test(c);
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

type Gear = { x: number; y: number };
type GearKey = string;
function getGearKey(gear: Gear): GearKey {
  return `${gear.x},${gear.y}`;
}

function adjacentGears(
  grid: string[],
  x0: number,
  y0: number,
): Gear[] {
  const width = grid[0].length;
  const height = grid.length;
  return adjacency.flatMap((coords) => {
    const [dx, dy] = coords;
    const x = x0 + dx;
    const y = y0 + dy;
    if (x < 0 || x >= width) return [];
    if (y < 0 || y >= height) return [];
    if (getAt(grid, x, y) == "*") return [{ x, y }];
    return [];
  });
}

// This is gross, if I feel like it I'll clean it up later :)
function collectGearRatios(grid: string[]): number[] {
  const width = grid[0].length;
  const height = grid.length;
  const gearLabels: Record<GearKey, number[]> = {};
  for (let y = 0; y < height; ++y) {
    let parsingNumber = false;
    let number = 0;
    let gears: Set<GearKey> = new Set();
    for (let x = 0; x < width; ++x) {
      const c = getAt(grid, x, y);
      if (parsingNumber) {
        if (isDigit(c)) {
          number = number * 10 + Number.parseInt(c);
          adjacentGears(grid, x, y).forEach((gear) =>
            gears = gears.add(getGearKey(gear))
          );
        } else {
          for (const key of gears) {
            const labels = gearLabels[key] || [];
            gearLabels[key] = labels.concat([number]);
          }
          parsingNumber = false;
          number = 0;
          gears = new Set();
        }
      } else if (isDigit(c)) {
        parsingNumber = true;
        number = Number.parseInt(c);
        adjacentGears(grid, x, y).forEach((gear) =>
          gears = gears.add(getGearKey(gear))
        );
      }
    }
    for (const key of gears) {
      const labels = gearLabels[key] || [];
      gearLabels[key] = labels.concat([number]);
    }
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
