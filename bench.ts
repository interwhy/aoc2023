import day01 from "./solution/day01.ts";

const days = ["control", "01"];

for (const day of days) {
  let run: (s: string) => string = function (_s: string) {
    return "";
  };

  switch (day) {
    case "control":
      break;
    case "01":
      run = day01;
      break;
    default:
      console.log("I don't think I've done that one yet");
      Deno.exit(1);
  }

  const input = day == "control"
    ? ""
    : Deno.readTextFileSync(`./input/day${day}.txt`);

  Deno.bench(day, () => {
    run(input);
  });
}
