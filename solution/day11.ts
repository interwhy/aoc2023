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

  expand() {
    const emptyCols: Set<number> = new Set();
    const emptyRows: Set<number> = new Set();

    for (let y = 0; y < this.height; ++y) {
      let isEmpty = true;
      for (let x = 0; x < this.width; ++x) {
        if (this.grid[y][x] == Tile.Galaxy) {
          isEmpty = false;
          break;
        }
      }
      if (isEmpty) {
        emptyRows.add(y);
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
        emptyCols.add(x);
      }
    }

    console.log(emptyRows);
    console.log(emptyCols);

    const newGrid: number[][] = [];
    const newHeight = this.height + emptyCols.size;
    const newWidth = this.width + emptyRows.size;
    const newGalaxies: Point[] = [];
    let yi = 0;
    for (let y = 0; y < this.height; ++y) {
      let xi = 0;
      const xs = [...Array(newWidth).keys()].map(() => Tile.Empty);
      if (!emptyRows.has(y)) {
        for (let x = 0; x < this.width; ++x) {
          if (!emptyCols.has(x)) {
            if (this.grid[y][x] == Tile.Galaxy) {
              xs[x + xi] = Tile.Galaxy;
              newGalaxies.push([x + xi, y + yi]);
            }
          } else {
            xi += 1;
          }
        }
      } else {
        yi += 1;
      }
      newGrid.push(xs);
    }

    this.grid = newGrid;
    this.width = newWidth;
    this.height = newHeight;
    this.galaxies = newGalaxies;
  }

  sumDistances(): number {
    let result = 0;
    for (let i = 0; i < this.galaxies.length; ++i) {
      for (let j = 0; j < this.galaxies.length; ++j) {
        if (i >= j) continue;

        result += distance(this.galaxies[i], this.galaxies[j]);
      }
    }

    return result;
  }
}

export function day11_1(input: string): string {
  const image = new Image(input);
  image.expand();
  console.log(image.toString());
  return image.sumDistances().toString();
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
