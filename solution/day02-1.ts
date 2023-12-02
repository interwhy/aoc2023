import { assert, assertEquals, assertFalse } from "std/assert/mod.ts";

export type Pull = {
  red: number;
  green: number;
  blue: number;
};

export type Game = {
  id: number;
  pulls: Pull[];
};

function parsePull(text: string): Pull {
  const pairs = text.split(",");
  const pull = { red: 0, green: 0, blue: 0 };
  for (const pair of pairs) {
    const [amount, color] = pair.trim().split(" ");
    if (color == "red" || color == "green" || color == "blue") {
      pull[color] += Number.parseInt(amount);
    }
  }

  return pull;
}

export function parseGame(line: string): Game {
  const [gameIdText, gameText] = line.split(":");
  const [game, idText] = gameIdText.split(" ");
  assertEquals(game, "Game");
  const id = Number.parseInt(idText);
  const pullsText = gameText.split(";");
  return { id, pulls: pullsText.map(parsePull) };
}

function isPossible(game: Game, maxPull: Pull): boolean {
  return game.pulls.find((pull) =>
    pull.red > maxPull.red || pull.green > maxPull.green ||
    pull.blue > maxPull.blue
  ) === undefined;
}

export default function day02_1(input: string): string {
  const maxPull: Pull = {
    red: 12,
    green: 13,
    blue: 14,
  };
  return input.split("\n").map((line) => line.trim()).filter((line) =>
    line != ""
  ).map(parseGame).filter((game) => isPossible(game, maxPull)).reduce<number>(
    (sum: number, game: Game) => sum + game.id,
    0,
  ).toString();
}

Deno.test("parse game", () => {
  assertEquals(
    {
      id: 4,
      pulls: [{ red: 3, green: 4, blue: 0 }, { red: 0, green: 0, blue: 5 }],
    },
    parseGame("Game 4: 1 red, 4 green, 2 red; 5 blue"),
  );
});

Deno.test("is possible", () => {
  assert(
    isPossible(parseGame("Game 4: 1 red, 4 green, 2 red; 5 blue"), {
      red: 5,
      green: 4,
      blue: 6,
    }),
  );
  assertFalse(
    isPossible(parseGame("Game 4: 1 red, 4 green, 2 red; 5 blue, 6 red"), {
      red: 5,
      green: 4,
      blue: 6,
    }),
  );
});
Deno.test("day02_1", () => {
  const input = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;
  assertEquals("8", day02_1(input));
});
