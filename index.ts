import day01 from "./solution/day01.ts";

const day = Deno.args[0];
if (!day) {
  console.log("please specify a day");
  Deno.exit(1);
}

let run: (s: string) => string = function (_s: string) {
  return "";
};

switch (day) {
  case "01":
    run = day01;
    break;
  default:
    console.log("I don't think I've done that one yet");
    Deno.exit(1);
}

const input = Deno.readTextFileSync(`./input/day${day}.txt`);
const output = run(input);
console.log(output);
Deno.writeTextFileSync(`./output/day${day}.txt`, output, {
  create: true,
});
