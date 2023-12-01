import day01_1 from "./solution/day01-1.ts";
import day01_2 from "./solution/day01-2.ts";

const problem = Deno.args[0];
if (!problem) {
  console.log("please specify a problem");
  Deno.exit(1);
}

let run: (s: string) => string = function (_s: string) {
  return "";
};

const segments = problem.split("-");
const day = segments.length == 0 ? undefined : segments[0];

switch (problem) {
  case "01-1":
    run = day01_1;
    break;
  case "01-2":
    run = day01_2;
    break;
  default:
    console.log("I don't think I've done that one yet");
    Deno.exit(1);
}

const input = Deno.readTextFileSync(`./input/day${day}.txt`);
const output = run(input);
console.log(output);
Deno.writeTextFileSync(`./output/day${problem}.txt`, output, {
  create: true,
});
