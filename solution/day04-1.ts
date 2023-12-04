import { assertEquals } from "std/assert/mod.ts";

function cardValue(card: string): number {
  const [_id, numbers] = card.split(":");
  const [winningNumbersString, cardNumbersString] = numbers.split("|").map((
    s,
  ) => s.trim());
  const winningNumbers = new Set(
    winningNumbersString.split(" ")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => Number.parseInt(s))
      .filter((n) => !isNaN(n)),
  );
  const cardNumbers = new Set(
    cardNumbersString.split(" ")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => Number.parseInt(s))
      .filter((n) => !isNaN(n)),
  );
  const matchValues: number[] = [];
  let matches = 0;
  for (const x of winningNumbers) {
    if (cardNumbers.has(x)) {
      matchValues.push(x);
      matches += 1;
    }
  }

  return matches > 0 ? 1 << (matches - 1) : 0;
}

export default function day04_1(input: string): string {
  return input.split("\n").map((s) => s.trim()).filter((s) => s.length > 0).map(
    cardValue,
  ).reduce((x, y) => x + y, 0).toString();
}

Deno.test("day04_1", () => {
  assertEquals(
    day04_1(`
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`),
    "13",
  );
});
