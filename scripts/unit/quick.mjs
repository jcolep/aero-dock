// The Start menu's quick answers (src/features/start/quick.ts), tested alone: the module has no imports, so it is
// transpiled with the project's own TypeScript and run here with a fixed clock and zone.
//
//   node scripts/unit/quick.mjs

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const ts = createRequire(join(root, "package.json"))("typescript");
const source = readFileSync(join(root, "src/features/start/quick.ts"), "utf8");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
const dir = join(root, "node_modules", ".cache", "unit");
mkdirSync(dir, { recursive: true });
const file = join(dir, "quick.mjs");
writeFileSync(file, js);
const { quickAnswers, fmt, parseDay } = await import(pathToFileURL(file).href);

let failed = false;
const check = (ok, what, got) => {
  console.log(ok ? "ok  " : "FAIL", what, ok ? "" : `  got ${JSON.stringify(got)}`);
  if (!ok) failed = true;
};
// 21 October 2026, noon where this runs; the person is in Denver (UTC-6 that day)
const now = new Date(2026, 9, 21, 12, 0, 0);
const at = new Date("2026-10-21T18:30:00Z");
const opt = { locale: "en-US", zone: "America/Denver" };
const ask = (q, when = now, o = opt) => quickAnswers(q, when, o)[0];

// ---- units
let a = ask("5 km in miles");
check(a?.answer === "3.10685596 mi", "5 km in miles", a);
check(ask("72 f to c")?.answer === "22.22222222 °C", "72 f to c", ask("72 f to c"));
check(ask("100 c to f")?.answer === "212 °F", "100 c to f", ask("100 c to f"));
check(ask("0 k to c")?.answer === "-273.15 °C", "0 k to c", ask("0 k to c"));
check(ask("1 gb to mb")?.answer === "1,000 MB", "1 gb to mb", ask("1 gb to mb"));
check(ask("1 gib in mib")?.answer === "1,024 MiB", "1 gib in mib", ask("1 gib in mib"));
check(ask("2 hours in minutes")?.answer === "120 min", "2 hours in minutes", ask("2 hours in minutes"));
check(ask("10 kg to lbs")?.answer.startsWith("22.0462"), "10 kg to lbs", ask("10 kg to lbs"));
check(ask("5 in in cm")?.answer === "12.7 cm", "5 in in cm (the unit and the word)", ask("5 in in cm"));
check(ask("1,000 m to km")?.answer === "1 km", "1,000 m to km (a thousands comma)", ask("1,000 m to km"));
check(ask("60 mph to km/h")?.answer.startsWith("96.56"), "60 mph to km/h", ask("60 mph to km/h"));
check(ask("1 acre to ft2")?.answer.startsWith("43,560"), "1 acre to ft2", ask("1 acre to ft2"));
check(ask("2 cups in ml")?.answer.startsWith("473.17"), "2 cups in ml", ask("2 cups in ml"));
check(!ask("5 km in kg") && !ask("5 widgets in gizmos") && !ask("12 apples"), "unlike or unknown units give nothing");

// ---- time
a = ask("time in tokyo", at);
check(a?.answer === "3:30 AM" && /Tokyo/.test(a.detail) && /UTC\+9/.test(a.detail) && /15 h ahead of you/.test(a.detail), "time in tokyo (from 18:30 UTC, in Denver)", a);
check(ask("tokyo time", at)?.answer === "3:30 AM", "tokyo time", ask("tokyo time", at));
check(ask("what time is it in london", at)?.answer === "7:30 PM", "what time is it in london (British summer time ended 25 Oct)", ask("what time is it in london", at));
check(ask("time", at)?.answer === "12:30 PM", "time: here", ask("time", at));
check(ask("what's the time in rome", at)?.answer === "8:30 PM", "what's the time in rome", ask("what's the time in rome", at));
check(ask("what time is it", at)?.answer === "12:30 PM", "what time is it", ask("what time is it", at));
check(ask("3pm est in pst", at)?.answer === "12:00 PM", "3pm est in pst", ask("3pm est in pst", at));
check(ask("15:00 utc to jst", at)?.answer === "12:00 AM (next day)", "15:00 utc to jst, over midnight", ask("15:00 utc to jst", at));
check(ask("9am to tokyo", at)?.answer === "12:00 AM (next day)", "9am to tokyo (from here)", ask("9am to tokyo", at));
check(!ask("time in nowhereville", at) && !ask("screen time", at), "an unknown place gives nothing");

// ---- dates
check(ask("days until dec 25")?.answer === "65 days", "days until dec 25", ask("days until dec 25"));
check(ask("days until 2026-12-25")?.answer === "65 days", "days until 2026-12-25", ask("days until 2026-12-25"));
check(ask("how many days until christmas")?.answer === "65 days", "how many days until christmas", ask("how many days until christmas"));
check(ask("days since 2026-10-01")?.answer === "20 days ago", "days since 2026-10-01", ask("days since 2026-10-01"));
check(ask("days until tomorrow")?.answer === "1 day", "days until tomorrow", ask("days until tomorrow"));
check(ask("days until jan 1")?.answer === "72 days", "days until jan 1 (next year)", ask("days until jan 1"));
check(ask("what day is dec 25 2026")?.answer === "Friday", "what day is dec 25 2026", ask("what day is dec 25 2026"));
check(ask("in 90 days")?.answer === "Tuesday, January 19, 2027", "in 90 days", ask("in 90 days"));
check(ask("2 weeks ago")?.answer === "Wednesday, October 7, 2026", "2 weeks ago", ask("2 weeks ago"));
a = ask("date");
check(a?.answer === "Wednesday, October 21, 2026" && /Week 43/.test(a.detail) && /day 294/.test(a.detail), "date", a);
check(!ask("days until blorp") && !ask("days until feb 30"), "a day that is not one gives nothing");
check(JSON.stringify(parseDay("friday", now)) === JSON.stringify({ y: 2026, m: 9, d: 23 }), "friday is the 23rd", parseDay("friday", now));

// ---- colors
a = ask("#ff8800");
check(a?.answer === "#FF8800" && a.swatch === "#FF8800" && /rgb\(255, 136, 0\)/.test(a.detail) && /hsl\(32, 100%, 50%\)/.test(a.detail), "#ff8800", a);
check(ask("#f80")?.answer === "#FF8800", "#f80", ask("#f80"));
check(ask("rgb(0, 0, 255)")?.answer === "#0000FF" && /hsl\(240, 100%, 50%\)/.test(ask("rgb(0, 0, 255)").detail), "rgb(0, 0, 255)", ask("rgb(0, 0, 255)"));
check(ask("hsl(120, 100%, 50%)")?.answer === "#00FF00", "hsl(120, 100%, 50%)", ask("hsl(120, 100%, 50%)"));
check(!ask("rgb(300, 0, 0)") && !ask("#12"), "a color that is not one gives nothing");

// ---- number bases
check(ask("255 in hex")?.answer === "0xFF", "255 in hex", ask("255 in hex"));
check(ask("10 to binary")?.answer === "0b1010", "10 to binary", ask("10 to binary"));
check(ask("0xff")?.answer === "255", "0xff", ask("0xff"));
check(ask("0b1010")?.answer === "10", "0b1010", ask("0b1010"));

// ---- percentages
check(ask("15% of 80")?.answer === "12", "15% of 80", ask("15% of 80"));
check(ask("what is 15 percent of 80")?.answer === "12", "what is 15 percent of 80", ask("what is 15 percent of 80"));
check(ask("20% off 50")?.answer === "40", "20% off 50", ask("20% off 50"));
a = ask("tip 18% on 64.50");
check(a?.answer === "11.61" && /total 76\.11/.test(a.detail), "tip 18% on 64.50", a);
check(ask("50 is what percent of 200")?.answer === "25%", "50 is what percent of 200", ask("50 is what percent of 200"));

// ---- chance
check(ask("flip a coin", now, { ...opt, random: () => 0.1 })?.answer === "Heads", "flip a coin (low)");
check(ask("flip a coin", now, { ...opt, random: () => 0.9 })?.answer === "Tails", "flip a coin (high)");
check(ask("roll a die", now, { ...opt, random: () => 0.5 })?.answer === "4", "roll a die", ask("roll a die", now, { ...opt, random: () => 0.5 }));
check(ask("roll d20", now, { ...opt, random: () => 0.999 })?.answer === "20", "roll d20");
check(ask("random number 1-100", now, { ...opt, random: () => 0.5 })?.answer === "51", "random number 1-100", ask("random number 1-100", now, { ...opt, random: () => 0.5 }));

// ---- what it must leave alone: a search box first
for (const q of ["firefox", "visual studio code", "hello world", "d20", "a", "", "notepad++", "7-zip", "windows terminal", "time machine backup", "5", "1920x1080", "c:\\users"]) {
  check(quickAnswers(q, now, opt).length === 0, `"${q}" gives no answer`, quickAnswers(q, now, opt));
}
check(fmt(0.1 + 0.2) === "0.3" && fmt(1234567.891) === "1,234,567.891" && fmt(1e21) === "1e+21", "numbers are read cleanly", [fmt(0.1 + 0.2), fmt(1234567.891), fmt(1e21)]);
process.exit(failed ? 1 : 0);
