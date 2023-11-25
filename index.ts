const day = Deno.args[0];
if (!day) {
  console.log("please specify a day");
  Deno.exit(1);
}

const command = new Deno.Command("deno", {
  args: ["run", "--allow-read", `./solution/day${day}.ts`],
  stdin: "piped",
  stdout: "piped",
  stderr: "piped",
});

const child = command.spawn();

const [out1, out2] = child.stdout.tee();
out1.pipeTo(
  Deno.openSync(`./output/day${day}.txt`, {
    write: true,
    create: true,
    truncate: true,
  }).writable,
);
out2.pipeTo(Deno.stdout.writable);
child.stderr.pipeTo(Deno.stderr.writable);

const input = Deno.readFile(`./input/day${day}.txt`);
const writer = child.stdin.getWriter();
await writer.write(await input);
writer.releaseLock();
await child.stdin.close();

const status = await child.status;
Deno.exit(status.code);
