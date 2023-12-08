import { assertEquals } from "std/assert/mod.ts";

const cards = ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2", "J"];

function getCardValue(card: string): number {
  const index = cards.findIndex((s) => s == card);
  if (index >= 0) {
    return cards.length - index;
  }
  return NaN;
}

enum HandType {
  FiveOfAKind = 7,
  FourOfAKind = 6,
  FullHouse = 5,
  ThreeOfAKind = 4,
  TwoPair = 3,
  OnePair = 2,
  HighCard = 1,
}

type Hand = {
  handType: HandType;
  handValues: number[];
  bidAmount: number;
};

function parseHand(line: string): Hand {
  const tokens = line.split(" ");
  const handString = tokens[0];
  const bidAmount = Number.parseInt(tokens[1]);

  let jokers = 0;
  const handValues: number[] = [];
  const result: Record<number, number> = {};
  for (let i = 0; i < handString.length; ++i) {
    const card = handString.charAt(i);
    const cardValue = getCardValue(card);
    handValues.push(cardValue);

    if (card == "J") {
      jokers += 1;
    } else if (result[cardValue]) {
      result[cardValue] += 1;
    } else {
      result[cardValue] = 1;
    }
  }

  const sortedCounts = Object.values(result);
  sortedCounts.sort();
  sortedCounts.reverse();

  let handType = HandType.HighCard;
  if (jokers == 5 || sortedCounts[0] + jokers == 5) {
    handType = HandType.FiveOfAKind;
  } else if (sortedCounts[0] + jokers == 4) {
    handType = HandType.FourOfAKind;
  } else if (sortedCounts[0] + sortedCounts[1] + jokers == 5) {
    handType = HandType.FullHouse;
  } else if (sortedCounts[0] + jokers == 3) {
    handType = HandType.ThreeOfAKind;
  } else if (sortedCounts[0] + sortedCounts[1] + jokers == 4) {
    handType = HandType.TwoPair;
  } else if (sortedCounts[0] + jokers == 2) {
    handType = HandType.OnePair;
  }

  assertEquals(handValues.length, 5);

  return { handType, handValues, bidAmount };
}

function compareHands(left: Hand, right: Hand): number {
  if (left.handType != right.handType) {
    return left.handType < right.handType ? -1 : 1;
  }
  for (let i = 0; i < 5; ++i) {
    const leftValue = left.handValues[i];
    const rightValue = right.handValues[i];
    if (leftValue != rightValue) {
      return leftValue < rightValue ? -1 : 1;
    }
  }
  return 0;
}

export default function day07_2(input: string): string {
  const hands = input.split("\n").map((s) => s.trim()).filter((s) =>
    s.length > 0
  ).map(parseHand).toSorted(compareHands);
  let result = 0;
  for (let rank = 1; rank <= hands.length; ++rank) {
    const hand = hands[rank - 1];
    result += rank * hand.bidAmount;
  }
  return result.toString();
}

Deno.test("day07_2", () => {
  assertEquals(
    day07_2(`
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`),
    "5905",
  );
});
