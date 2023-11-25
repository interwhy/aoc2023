const days = ["01"];

for (const day of days) {
  const command = new Deno.Command("deno", {
    args: ["run", "--allow-read", `./solution/day${day}.ts`],
    stdin: "piped",
    stdout: "null",
    stderr: "null",
  });

  const input = Deno.readFileSync(`./input/day${day}.txt`);

  Deno.bench(`day${day}`, async (b) => {
    const child = command.spawn();
    b.start();
    const writer = child.stdin.getWriter();
    await writer.write(input);
    writer.releaseLock();
    await child.stdin.close();
    await child.status;
    b.end();
  });
}
