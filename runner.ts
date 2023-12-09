import day01_1 from "./solution/day01-1.ts";
import day01_2 from "./solution/day01-2.ts";
import day02_1 from "./solution/day02-1.ts";
import day02_2 from "./solution/day02-2.ts";
import day03_1 from "./solution/day03-1.ts";
import day03_2 from "./solution/day03-2.ts";
import day04_1 from "./solution/day04-1.ts";
import day04_2 from "./solution/day04-2.ts";
import day05_1 from "./solution/day05-1.ts";
import day05_2 from "./solution/day05-2.ts";
import day06_1 from "./solution/day06-1.ts";
import day06_2 from "./solution/day06-2.ts";
import day07_1 from "./solution/day07-1.ts";
import day07_2 from "./solution/day07-2.ts";
import day08_1 from "./solution/day08-1.ts";
import day08_2 from "./solution/day08-2.ts";

export interface Solution {
  run: (s: string) => string;
  inputFile: string;
  outputFile: string;
}

export function getSolution(name: string): Solution | undefined {
  const segments = name.split("-");
  const day = segments.length == 0 ? undefined : segments[0];

  let run = function (_s: string): string {
    return "";
  };

  switch (name) {
    case "01-1":
      run = day01_1;
      break;
    case "01-2":
      run = day01_2;
      break;
    case "02-1":
      run = day02_1;
      break;
    case "02-2":
      run = day02_2;
      break;
    case "03-1":
      run = day03_1;
      break;
    case "03-2":
      run = day03_2;
      break;
    case "04-1":
      run = day04_1;
      break;
    case "04-2":
      run = day04_2;
      break;
    case "05-1":
      run = day05_1;
      break;
    case "05-2":
      run = day05_2;
      break;
    case "06-1":
      run = day06_1;
      break;
    case "06-2":
      run = day06_2;
      break;
    case "07-1":
      run = day07_1;
      break;
    case "07-2":
      run = day07_2;
      break;
    case "08-1":
      run = day08_1;
      break;
    case "08-2":
      run = day08_2;
      break;
    default:
      console.log("I don't think I've done that one yet");
      Deno.exit(1);
  }

  return {
    run,
    inputFile: `./input/day${day}.txt`,
    outputFile: `./output/day${name}.txt`,
  };
}
