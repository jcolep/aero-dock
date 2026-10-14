// CSS classes that no page code mentions: candidates for dead rules. A class built up in code (`mb-${kind}`) is not
// seen as a whole, so each candidate is listed with its file for a person to check.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
const files = []; (function list(d) { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) list(p); else files.push(p); } })("src");
const code = files.filter((f) => /\.(ts|tsx)$/.test(f)).map((f) => readFileSync(f, "utf8")).join("\n");
const out = new Map();
for (const f of files.filter((f) => f.endsWith(".css"))) {
  const css = readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  for (const m of css.matchAll(/\.([a-zA-Z][\w-]*)/g)) {
    const c = m[1];
    if (/^\d/.test(c) || c === "woff2" || c === "css") continue;
    if (code.includes(c)) continue;
    // a prefix built up in code: "np-" + something
    const dash = c.lastIndexOf("-");
    if (dash > 0 && new RegExp(`["'\`]${c.slice(0, dash + 1).replace(/[-]/g, "\\-")}(\\$\\{|["'\`])`).test(code)) continue;
    if (!out.has(c)) out.set(c, relative("src", f));
  }
}
for (const [c, f] of [...out].sort((a, b) => a[1].localeCompare(b[1]))) console.log(`${f}: .${c}`);
console.log(out.size, "classes");