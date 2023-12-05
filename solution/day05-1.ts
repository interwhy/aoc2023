import { assertEquals } from "std/assert/mod.ts";

interface Range {
  source: number;
  destination: number;
  length: number;
}

interface AlmanacMap {
  from: string;
  to: string;
  ranges: Range[];
}

function parseMapName(line: string): AlmanacMap | undefined {
  const re = /^(\w+)-to-(\w+) map:/;
  const matches = line.match(re);
  if (matches && matches.length >= 3) {
    return {
      from: matches[1],
      to: matches[2],
      ranges: [],
    };
  }
}

function parseRange(line: string): Range | undefined {
  const tokens = line.split(" ");
  if (tokens.length == 3) {
    return {
      destination: Number.parseInt(tokens[0]),
      source: Number.parseInt(tokens[1]),
      length: Number.parseInt(tokens[2]),
    };
  }
}

export function parseMaps(lines: string[]): AlmanacMap[] {
  // assume seeds are already parsed from input and skipped
  const results: AlmanacMap[] = [];
  let currentMap: AlmanacMap | undefined;
  for (const line of lines) {
    const possibleMap = parseMapName(line);
    if (possibleMap) {
      if (currentMap) {
        results.push(currentMap);
      }
      currentMap = possibleMap;
      continue;
    }

    const range = parseRange(line);
    if (!range) {
      throw new Error(`expected range, got "${line}"`);
    }
    if (!currentMap) {
      throw new Error("expected map");
    }
    currentMap.ranges.push(range);
  }

  return results;
}

function parseSeeds(line: string): number[] {
  return line.split(" ").slice(1).map((s) => Number.parseInt(s));
}

function mapTo(value: number, map: AlmanacMap): number {
  let matches = 0;
  let match: Range | undefined;
  for (const range of map.ranges) {
    const start = range.source;
    const end = range.source + range.length;
    if (start <= value && value < end) {
      match = range;
      matches += 1;
    }
  }
  if (matches > 1) {
    throw new Error(`got ${matches} matches for map ${map.from}-to-${map.to}`);
  }
  if (match) {
    const result = (value - match.source) + match.destination;
    return result;
  }
  return value;
}

export function mapSeed(seed: number, maps: AlmanacMap[]): number {
  return maps.reduce<number>((value, map) => mapTo(value, map), seed);
}

export default function day05_1(input: string): string {
  const lines = input.split("\n").map((s) => s.trim()).filter((s) =>
    s.length > 0
  );
  const seeds = parseSeeds(lines[0]);
  const maps = parseMaps(lines.slice(1));
  return seeds.map((seed) => mapSeed(seed, maps)).reduce((x, y) =>
    Math.min(x, y)
  ).toString();
}

Deno.test("day05_1", () => {
  assertEquals(
    day05_1(`
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`),
    "35",
  );
});
