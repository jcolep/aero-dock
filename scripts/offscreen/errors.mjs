// Errors in plain words: what comes up from Windows and Rust is said as a short reason, and nothing raw reaches a toast.
//
//   node scripts/offscreen/errors.mjs

import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../../src/engine/errors/humane.ts", import.meta.url), "utf8");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { humane, because } = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));

let failed = false;
const check = (got, want, what) => {
  const ok = got === want;
  console.log(ok ? "ok  " : "FAIL", what, ok ? "" : `(got "${got}", wanted "${want}")`);
  if (!ok) failed = true;
};
check(humane("The system cannot find the file specified. (os error 2)"), "it could not be found", "a missing file");
check(humane(new Error("Access is denied. (os error 5)")), "Windows would not allow it", "a refusal");
check(humane("The process cannot access the file because it is being used by another process. (os error 32)"), "another program is using it", "a file in use");
check(humane("expected value at line 1 column 1"), "that is not something Aero Dock understands", "a file that is not JSON");
check(humane('{"kind":"Other","message":"x"}'), "something went wrong", "a blob of JSON says nothing a person can use");
check(humane("0x80070005 at windows::core::Error::from_hresult"), "something went wrong", "a code and a stack");
check(humane("The Start menu is already open."), "the Start menu is already open", "a sentence is kept");
check(humane(undefined), "something went wrong", "nothing at all");
check(because("Could not open Notepad", "os error 2"), "Could not open Notepad: it could not be found.", "the whole line");
process.exit(failed ? 1 : 0);
