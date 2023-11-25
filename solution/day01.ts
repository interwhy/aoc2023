import { toText } from "std/streams/to_text.ts";

const input = await toText(Deno.stdin.readable);

console.log(input);

