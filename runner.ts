import day01_1 from "./solution/day01-1.ts";
import day01_2 from "./solution/day01-2.ts";
import day02_1 from "./solution/day02-1.ts";
import day02_2 from "./solution/day02-2.ts";

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
