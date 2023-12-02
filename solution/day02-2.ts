import { assertEquals } from "std/assert/mod.ts";
import { Game, parseGame, Pull } from "./day02-1.ts";

function minimumCubes(game: Game): Pull {
  const result: Pull = { red: 0, green: 0, blue: 0 };
  for (const pull of game.pulls) {
    result.red = Math.max(result.red, pull.red);
    result.green = Math.max(result.green, pull.green);
    result.blue = Math.max(result.blue, pull.blue);
  }
  return result;
}

function powerOfPull(pull: Pull): number {
  return pull.red * pull.green * pull.blue;
}

export default function day02_2(input: string): string {
  return input.split("\n").map((line) => line.trim()).filter((line) =>
    line != ""
  ).map(
    parseGame,
  ).map(minimumCubes).map(powerOfPull).reduce((x, y) => x + y, 0).toString();
}

Deno.test("day02_2", () => {
  const input = `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;
  assertEquals(day02_2(input), "2286");
});
