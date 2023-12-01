import { assertEquals } from "std/assert/mod.ts";

function isDigit(c: string): boolean {
  return c.length == 1 && /^\d$/.test(c);
}

function getCalibrationValue(s: string): number {
  const chars = Array.from(s);
  const digits = chars.filter(isDigit);
  if (digits.length == 0) return Number.NaN;
  return Number.parseInt(digits[0] + digits[digits.length - 1]);
}

export default function day01(input: string): string {
  return input.split("\n").map(getCalibrationValue).filter((n) => !isNaN(n))
    .reduce((prev, current, _i, _array) => prev + current, 0).toString();
}

Deno.test("getCalibrationValue", () => {
  assertEquals(12, getCalibrationValue("a1bc2"));
  assertEquals(13, getCalibrationValue("a1bc23"));
  assertEquals(11, getCalibrationValue("a1"));
});

Deno.test("day01", () => {
  assertEquals("36", day01("a1b2asdf\n1\nysfh111113"));
});
