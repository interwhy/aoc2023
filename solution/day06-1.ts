import { assertEquals } from "std/assert/mod.ts";

function parseIntList(line: string): number[] {
  return line.split(" ").slice(1).map((s) => s.trim()).filter((s) =>
    s.length > 0
  ).map((s) => Number.parseInt(s));
}

function getDistanceTraveled(raceTime: number, holdTime: number): number {
  if (raceTime <= holdTime) return 0;
  return (raceTime - holdTime) * holdTime;
}

function countWaysToWin(raceTime: number, recordDistance: number): number {
  let waysToWin = 0;
  for (let i = 0; i < raceTime; ++i) {
    if (getDistanceTraveled(raceTime, i) > recordDistance) {
      waysToWin += 1;
    }
  }
  return waysToWin;
}

export default function day06_1(input: string): string {
  const lines = input.split("\n").map((s) => s.trim()).filter((s) =>
    s.length > 0
  );
  assertEquals(lines.length, 2);
  const times = parseIntList(lines[0]);
  const distances = parseIntList(lines[1]);
  assertEquals(times.length, distances.length);
  const races = times.map((t, i) => [t, distances[i]]);
  return races.map((race) => countWaysToWin(race[0], race[1])).reduce((x, y) =>
    x * y
  ).toString();
}

Deno.test("day06-1", () => {
  assertEquals(
    day06_1(`
Time:      7  15   30
Distance:  9  40  200`),
    "288",
  );
});
