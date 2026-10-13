/**
 * What an error says to a person.
 *
 * A thing that went wrong comes up from Rust or Windows as whatever it was made of: "os error 2", "The system cannot
 * find the file specified. (os error 2)", a JSON error with a line and column, a command that does not exist. None of
 * that belongs in a toast. This says it in a few plain words, and the original goes to the console (see `notify`).
 */

const RULES: Array<[RegExp, string]> = [
  [/access is denied|os error 5\b|permission|not permitted|elevat/i, "Windows would not allow it"],
  [/cannot find the (file|path)|os error [23]\b|not found|no such file|does not exist|missing/i, "it could not be found"],
  [/used by another process|os error 32\b|being used|in use|locked/i, "another program is using it"],
  [/timed? ?out|timeout|took too long/i, "it took too long"],
  [/network|dns|connect|offline|unreachable/i, "there is no connection"],
  [/expected|unexpected|invalid|parse|malformed|syntax|json|eof while/i, "that is not something Aero Dock understands"],
  [/disk|no space|os error 112\b|quota/i, "there is no room on the disk"],
  [/cancel|abort/i, "it was cancelled"],
];

/** A short, plain reason for an error, or nothing when it has none worth giving. */
export function humane(error: unknown): string {
  const raw = typeof error === "string" ? error : error instanceof Error ? error.message : String(error ?? "");
  for (const [pattern, words] of RULES) if (pattern.test(raw)) return words;
  // an error that already reads like a sentence is kept (first one only, and not too long)
  const first = raw.split(/[.\n]/)[0].trim();
  const looksHuman = first.length >= 8 && first.length <= 90 && /^[A-Za-z]/.test(first) && !/[{}[\]<>]|::|0x|\bat \w+\.\w+|\\\\|os error/.test(first);
  return looksHuman ? first.charAt(0).toLowerCase() + first.slice(1) : "something went wrong";
}

/** "Could not open Notepad" and why: "Could not open Notepad: it could not be found." */
export function because(what: string, error: unknown): string {
  return `${what}: ${humane(error)}.`;
}
