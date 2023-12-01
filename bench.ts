import { getSolution } from "./runner.ts";

const solutionNames = ["01-1", "01-2"];

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
