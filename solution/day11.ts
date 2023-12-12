import { assertEquals } from "std/assert/mod.ts";

enum Tile {
  Empty,
  Galaxy,
}

type Point = [number, number];

function distance(a: Point, b: Point): number {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

class Image {
  grid: Tile[][];
  galaxies: Point[];
  width: number;
  height: number;

  constructor(input: string) {
    const lines = input.split("\n").map((x) => x.trim()).filter((x) =>
      x.length > 0
    );
    this.galaxies = [];
    this.grid = [];
    this.width = lines[0].length;
    this.height = lines.length;
    for (let y = 0; y < this.height; ++y) {
      const xs = [...Array(this.width).keys()].map(() => Tile.Empty);
      for (let x = 0; x < this.width; ++x) {
        if (lines[y][x] == "#") {
          xs[x] = Tile.Galaxy;
          this.galaxies.push([x, y]);
        }
      }
      this.grid.push(xs);
    }
  }

  toString(): string {
    const lines = this.grid.map((row) =>
      row.map((value) => {
        switch (value) {
          case Tile.Empty:
            return ".";
          case Tile.Galaxy:
            return "#";
        }
      }).join("")
    );
    return lines.join("\n");
  }

  expandAndSumDistances(scale: number) {
    const amount = scale - 1;
    const emptyCols: number[] = [];
    const emptyRows: number[] = [];

    for (let y = 0; y < this.height; ++y) {
      let isEmpty = true;
      for (let x = 0; x < this.width; ++x) {
        if (this.grid[y][x] == Tile.Galaxy) {
          isEmpty = false;
          break;
        }
      }
      if (isEmpty) {
        emptyRows.push(y);
      }
    }

    for (let x = 0; x < this.width; ++x) {
      let isEmpty = true;
      for (let y = 0; y < this.height; ++y) {
        if (this.grid[y][x] == Tile.Galaxy) {
          isEmpty = false;
          break;
        }
      }
      if (isEmpty) {
        emptyCols.push(x);
      }
    }

    function countBetween(a: number, b: number, values: number[]): number {
      return values.filter((c) => (a < c && c < b) || (b < c && c < a)).length;
    }

    let result = 0;
    for (let i = 0; i < this.galaxies.length; ++i) {
      for (let j = 0; j < this.galaxies.length; ++j) {
        if (i >= j) continue;

        const [x0, y0] = this.galaxies[i];
        const [x1, y1] = this.galaxies[j];
        const xx0 = countBetween(-1, x0, emptyCols) * amount;
        const yy0 = countBetween(-1, y0, emptyRows) * amount;
        const xx1 = countBetween(-1, x1, emptyCols) * amount;
        const yy1 = countBetween(-1, y1, emptyRows) * amount;

        result += distance([x0 + xx0, y0 + yy0], [x1 + xx1, y1 + yy1]);
      }
    }

    return result;
  }
}

export function day11_1(input: string): string {
  const image = new Image(input);
  return image.expandAndSumDistances(2).toString();
}

export function day11_2(input: string): string {
  const image = new Image(input);
  return image.expandAndSumDistances(1000000).toString();
}

Deno.test("day11-1", () => {
  assertEquals(
    day11_1(`
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`),
    "374",
  );
});

Deno.test("day11-2", () => {
  assertEquals(
    new Image(`
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`).expandAndSumDistances(10).toString(),
    "1030",
  );
  assertEquals(
    new Image(`
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`).expandAndSumDistances(100).toString(),
    "8410",
  );
});
