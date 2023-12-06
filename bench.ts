import { getSolution } from "./runner.ts";

const solutionNames = [
  "01-1",
  "01-2",
  "02-1",
  "02-2",
  "03-1",
  "03-2",
  "04-1",
  "04-2",
  "05-1",
  "06-1",
  "06-2",
];

function control(s: string): string {
  return s;
}
Deno.bench("control", () => {
  control("");
});

for (const solutionName of solutionNames) {
  const solution = getSolution(solutionName);
  if (!solution) {
    console.log(`bad solution name: ${solutionName}`);
    continue;
  }
  const input = Deno.readTextFileSync(solution.inputFile);
  Deno.bench(solutionName, () => {
    solution.run(input);
  });
}
