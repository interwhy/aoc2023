import { assertEquals } from "std/assert/mod.ts";

function parseBadlyKernedInt(line: string): number {
  let numberString = line.split(" ").slice(1).map((s) => s.trim()).filter((s) =>
    s.length > 0
  ).join("");
  return Number.parseInt(numberString);
}

function getDistanceTraveled(raceTime: number, holdTime: number): number {
  if (raceTime <= holdTime) return 0;
  return (raceTime - holdTime) * holdTime;
}

function getStartOfWinningTimes(
  raceTime: number,
  recordDistance: number,
): number {
  for (let i = 0; i < raceTime; ++i) {
    if (getDistanceTraveled(raceTime, i) > recordDistance) {
      return i;
    }
  }
  return NaN;
}

function getEndOfWinningTimes(
  raceTime: number,
  recordDistance: number,
): number {
  for (let i = raceTime - 1; i >= 0; --i) {
    if (getDistanceTraveled(raceTime, i) > recordDistance) {
      return i + 1;
    }
  }
  return NaN;
}

export default function day06_2(input: string): string {
  const lines = input.split("\n").map((s) => s.trim()).filter((s) =>
    s.length > 0
  );
  assertEquals(lines.length, 2);
  const time = parseBadlyKernedInt(lines[0]);
  const distance = parseBadlyKernedInt(lines[1]);
  const start = getStartOfWinningTimes(time, distance);
  const end = getEndOfWinningTimes(time, distance);
  return (end - start).toString();
}

Deno.test("day06-2", () => {
  assertEquals(
    day06_2(`
Time:      7  15   30
Distance:  9  40  200`),
    "71503",
  );
});
