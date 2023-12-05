import { assertEquals } from "std/assert/mod.ts";
import { mapSeed, parseMaps } from "./day05-1.ts";

interface SeedRange {
  start: number;
  length: number;
}

function parseSeedRanges(line: string): SeedRange[] {
  const tokens = line.split(" ").slice(1);
  let currentRange: SeedRange | undefined;
  const results: SeedRange[] = [];
  for (const token of tokens) {
    if (currentRange) {
      currentRange.length = Number.parseInt(token);
      results.push(currentRange);
      currentRange = undefined;
    } else {
      currentRange = {
        start: Number.parseInt(token),
        length: -1,
      };
    }
  }
  if (currentRange) {
    throw new Error("invalid seeds");
  }

  return results;
}

export default function day05_2(input: string): string {
  // I don't feel like thinking about this problem right now, let's just brute force it.
  const lines = input.split("\n").map((s) => s.trim()).filter((s) =>
    s.length > 0
  );
  const seedRanges = parseSeedRanges(lines[0]);
  console.log(seedRanges.length, "ranges to be processed");
  const maps = parseMaps(lines.slice(1));
  let minimumResult = Number.MAX_SAFE_INTEGER;
  for (const seedRange of seedRanges) {
    const now = Date.now();
    console.log(seedRange);
    for (let i = 0; i < seedRange.length; ++i) {
      if ((i % 10000000) == 0) {
        console.log(i * 100.0 / seedRange.length, "%");
      }
      const result = mapSeed(seedRange.start + i, maps);
      minimumResult = Math.min(minimumResult, result);
    }
    console.log(Date.now() - now, "ms elapsed");
  }
  return minimumResult.toString();
}

Deno.test("day05_2", () => {
  assertEquals(
    day05_2(`
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
    "46",
  );
});
