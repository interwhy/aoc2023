import { assertEquals } from "std/assert/mod.ts";

const spelledDigitRegex = /^(one|two|three|four|five|six|seven|eight|nine)/;

const spelledDigitToNumber: Record<string, number> = {
  "one": 1,
  "two": 2,
  "three": 3,
  "four": 4,
  "five": 5,
  "six": 6,
  "seven": 7,
  "eight": 8,
  "nine": 9,
};

function reduceSpelledDigit(s: string, i: number): number {
  const matches = spelledDigitRegex.exec(s.slice(i));
  if (matches == null || matches.length == 0) return NaN;
  const match = matches[0];
  return spelledDigitToNumber[match];
}

function reduceDigit(s: string, i: number): number {
  const parsed = Number.parseInt(s.charAt(i));
  if (Number.isNaN(parsed)) return NaN;
  return parsed;
}

function getCalibrationValue(s: string): number {
  const results: number[] = [];
  for (let i = 0; i < s.length; ++i) {
    let value = reduceSpelledDigit(s, i);
    if (!Number.isNaN(value)) {
      results.push(value);
      continue;
    }

    value = reduceDigit(s, i);
    if (!Number.isNaN(value)) {
      results.push(value);
      continue;
    }
  }

  if (results.length == 0) {
    return NaN;
  }

  const result = 10 * results[0] + results[results.length - 1];
  return result;
}

export default function day01_2(input: string): string {
  return input.split("\n").map(getCalibrationValue).filter((n) => !isNaN(n))
    .reduce((prev, current, _i, _array) => prev + current, 0).toString();
}

Deno.test("getCalibrationValue", () => {
  assertEquals(12, getCalibrationValue("a1bc4two"));
  assertEquals(63, getCalibrationValue("sixa1bcnine23"));
  assertEquals(11, getCalibrationValue("zero1"));
});

Deno.test("day01", () => {
  assertEquals("36", day01_2("a1b4atwosdf\n1zero\nysfh11two1113"));
  assertEquals(
    "281",
    day01_2(`two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`),
  );
});
