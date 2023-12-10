import { assertEquals } from "std/assert/assert_equals.ts";

type Point = [number, number];

class SewerMap {
  tiles: string[];
  width: number;
  height: number;
  constructor(tiles: string[]) {
    this.tiles = tiles;
    this.width = tiles[0].length;
    this.height = tiles.length;
  }

  at(p: Point): string | undefined {
    const [x, y] = p;
    if (0 <= x && x < this.width && 0 <= y && y < this.height) {
      return this.tiles[y][x];
    }
  }

  start(): Point | undefined {
    for (let y = 0; y < this.height; ++y) {
      for (let x = 0; x < this.width; ++x) {
        if (this.at([x, y]) == "S") {
          return [x, y];
        }
      }
    }
  }
}

enum Direction {
  North,
  South,
  East,
  West,
}

function getNext(
  map: SewerMap,
  from: Direction,
  through: Point,
): [Point, Direction] | undefined {
  const [x, y] = through;
  const throughTile = map.at(through);
  switch (throughTile) {
    case "S":
      return;
    case "|":
      if (from == Direction.North) {
        return [[x, y + 1], Direction.North];
      }
      if (from == Direction.South) {
        return [[x, y - 1], Direction.South];
      }
      return;
    case "-":
      if (from == Direction.West) {
        return [[x + 1, y], Direction.West];
      }
      if (from == Direction.East) {
        return [[x - 1, y], Direction.East];
      }
      return;
    case "L":
      if (from == Direction.North) {
        return [[x + 1, y], Direction.West];
      }
      if (from == Direction.East) {
        return [[x, y - 1], Direction.South];
      }
      return;
    case "J":
      if (from == Direction.North) {
        return [[x - 1, y], Direction.East];
      }
      if (from == Direction.West) {
        return [[x, y - 1], Direction.South];
      }
      return;
    case "7":
      if (from == Direction.South) {
        return [[x - 1, y], Direction.East];
      }
      if (from == Direction.West) {
        return [[x, y + 1], Direction.North];
      }
      return;
    case "F":
      if (from == Direction.South) {
        return [[x + 1, y], Direction.West];
      }
      if (from == Direction.East) {
        return [[x, y + 1], Direction.North];
      }
      return;
  }
}

function findLoop(
  map: SewerMap,
  start: Point,
): [Point, Direction][] | undefined {
  const [startX, startY] = start;
  // The directions here indicate where we are coming *from*, not going to.
  const queue: [Point, Direction, [Point, Direction][]][] = [
    [[startX - 1, startY], Direction.East, [[start, Direction.East]]],
    [[startX + 1, startY], Direction.West, [[start, Direction.West]]],
    [[startX, startY - 1], Direction.South, [[start, Direction.South]]],
    [[startX, startY + 1], Direction.North, [[start, Direction.North]]],
  ];
  while (queue.length > 0) {
    const [point, from, path] = queue.pop()!;
    if (point[0] == start[0] && point[1] == start[1]) {
      return path;
    }
    const next = getNext(map, from, point);
    if (next) {
      const [nextPoint, nextFrom] = next;
      queue.push([nextPoint, nextFrom, path.concat([[point, from]])]);
    }
  }
}

export function day10_1(input: string): string {
  const lines = input.split("\n").map((s) => s.trim()).filter((s) =>
    s.length > 0
  );
  const map = new SewerMap(lines);
  const loop = findLoop(map, map.start()!)!;

  return (loop.length / 2).toString();
}

enum Tile {
  Unknown,
  Right,
  Left,
  Pipe,
}

class TileMap {
  map: SewerMap;
  grid: Tile[][];
  width: number;
  height: number;

  constructor(map: SewerMap) {
    this.width = map.width;
    this.height = map.height;
    this.grid = [];
    this.map = map;
    for (let y = 0; y < map.height; ++y) {
      const xs = [...Array(map.width).keys()].map(() => Tile.Unknown);
      this.grid.push(xs);
    }
  }

  at(p: Point): Tile | undefined {
    const [x, y] = p;
    if (0 <= x && x < this.width && 0 <= y && y < this.height) {
      return this.grid[y][x];
    }
  }

  set(p: Point, t: Tile) {
    const [x, y] = p;
    if (0 <= x && x < this.width && 0 <= y && y < this.height) {
      this.grid[y][x] = t;
    }
  }

  count(t: Tile): number {
    return this.grid.map((xs) => xs.filter((x) => x == t).length)
      .reduce((
        x,
        y,
      ) => x + y);
  }

  display(cursor: Point | undefined): string {
    const lines = this.grid.map((row, y) =>
      row.map((value, x) => {
        if (cursor && x == cursor[0] && y == cursor[1]) {
          return "@";
        }
        switch (value) {
          case Tile.Left:
            return "A";
          case Tile.Right:
            return "B";
          case Tile.Pipe:
            return this.map.at([x, y]) || " ";
          default:
            return ".";
        }
      }).join("")
    );
    return lines.join("\n");
  }

  fill(start: Point, value: Tile) {
    const queue: Point[] = [start];
    while (queue.length > 0) {
      const p = queue.pop()!;
      const tile = this.at(p);
      if (tile == Tile.Unknown) {
        this.set(p, value);
        const [x, y] = p;
        queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      }
    }
  }

  findExterior(): Tile {
    for (let y = 0; y < this.height; ++y) {
      const x0 = 0;
      const x1 = this.width - 1;
      const t0 = this.at([x0, y]);
      const t1 = this.at([x1, y]);
      if (t0 && t0 != Tile.Pipe) {
        return t0;
      }
      if (t1 && t1 != Tile.Pipe) {
        return t1;
      }
    }
    for (let x = 0; x < this.height; ++x) {
      const y0 = 0;
      const y1 = this.height - 1;
      const t0 = this.at([x, y0]);
      const t1 = this.at([x, y1]);
      if (t0 && t0 != Tile.Pipe) {
        return t0;
      }
      if (t1 && t1 != Tile.Pipe) {
        return t1;
      }
    }

    return Tile.Unknown;
  }

  fillLeftAndRight(point: Point, direction: Direction) {
    const [x, y] = point;
    switch (direction) {
      case Direction.North:
        this.fill([x - 1, y], Tile.Right);
        this.fill([x + 1, y], Tile.Left);
        break;
      case Direction.South:
        this.fill([x + 1, y], Tile.Right);
        this.fill([x - 1, y], Tile.Left);
        break;
      case Direction.East:
        this.fill([x, y - 1], Tile.Right);
        this.fill([x, y + 1], Tile.Left);
        break;
      case Direction.West:
        this.fill([x, y + 1], Tile.Right);
        this.fill([x, y - 1], Tile.Left);
        break;
    }
  }
}

export function day10_2(input: string): string {
  const lines = input.split("\n").map((s) => s.trim()).filter((s) =>
    s.length > 0
  );
  const map = new SewerMap(lines);
  const loop = findLoop(map, map.start()!)!;
  const tileMap = new TileMap(map);
  for (const [point, _] of loop) {
    tileMap.set(point, Tile.Pipe);
  }

  let previousDirection: Direction | undefined;
  let previousPoint: Point | undefined;
  for (const [point, direction] of loop) {
    tileMap.fillLeftAndRight(point, direction);
    if (previousPoint && previousDirection) {
      tileMap.fillLeftAndRight(previousPoint, direction);
    }
    previousDirection = direction;
    previousPoint = point;
  }

  console.log(tileMap.display(undefined));

  const countA = tileMap.count(Tile.Right);
  const countB = tileMap.count(Tile.Left);
  console.log(countA, countB);
  const exterior = tileMap.findExterior();

  return exterior == Tile.Right ? countB.toString() : countA.toString();
}

Deno.test("day10-1", () => {
  assertEquals(
    day10_1(`
.....
.S-7.
.|.|.
.L-J.
.....
`),
    "4",
  );

  assertEquals(
    day10_1(`
-L|F7
7S-7|
L|7||
-L-J|
L|-JF
`),
    "4",
  );
});

Deno.test("day10-2", () => {
  assertEquals(
    day10_2(`
.....
.S-7.
.|.|.
.L-J.
.....
`),
    "1",
  );

  assertEquals(
    day10_2(`
.......
.S-7F7.
.L7LJ|.
.FJ.FJ.
.L7FJ..
..LJ...
`),
    "1",
  );

  assertEquals(
    day10_2(`
...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........
      `),
    "4",
  );

  assertEquals(
    day10_2(`
..........
.S------7.
.|F----7|.
.||....||.
.||....||.
.|L-7F-J|.
.|..||..|.
.L--JL--J.
..........
      `),
    "4",
  );
  assertEquals(
    day10_2(`
FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L
`),
    "10",
  );
});
