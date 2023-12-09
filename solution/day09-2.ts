import { assertEquals } from "std/assert/mod.ts";

function derivative(seq: number[]): number[] | "zero" {
  const result: number[] = [];
  let isZero = true;
  for (let i = 0; i + 1 < seq.length; ++i) {
    const value = seq[i + 1] - seq[i];
    result.push(value);
    if (value != 0) isZero = false;
  }
  return isZero ? "zero" : result;
}

function getPrevValue(seq: number[]): number {
  const derivatives: number[][] = [seq];
  let nextDerivative: number[] | "zero";
  while (
    "zero" != (nextDerivative = derivative(derivatives[derivatives.length - 1]))
  ) {
    derivatives.push(nextDerivative);
  }

  let prevValue = 0;
  for (let i = derivatives.length - 1; i >= 0; --i) {
    const derivative = derivatives[i];
    prevValue = derivative[0] - prevValue;
  }

  return prevValue;
}

function parseSeq(line: string): number[] {
  return line.split(" ").map((s) => Number.parseInt(s));
}

export default function day09_2(input: string): string {
  const lines = input.split("\n").map((s) => s.trim()).filter((s) =>
    s.length > 0
  );

  return lines.map(parseSeq).map(getPrevValue).reduce((x, y) => x + y)
    .toString();
}

Deno.test("day09-2", () => {
  assertEquals(
    day09_2(`
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`),
    "2",
  );

  assertEquals(
    day09_2(`
0 0 0 0
`),
    "0",
  );

  assertEquals(
    day09_2(`
1
`),
    "1",
  );
});
