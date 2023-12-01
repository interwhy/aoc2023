import { getSolution } from "./runner.ts";

const solutionName = Deno.args[0];
if (!solutionName) {
  console.log("please specify a solution");
  Deno.exit(1);
}

const solution = getSolution(solutionName);
if (!solution) {
  console.log("can't find solution with that name");
  Deno.exit(1);
}

const input = Deno.readTextFileSync(solution.inputFile);
const output = solution.run(input);
console.log(output);
Deno.writeTextFileSync(solution.outputFile, output, {
  create: true,
});
