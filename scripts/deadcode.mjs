// Dead code in the pages: files nothing reaches from main.tsx (static or dynamic imports), and exported names no other
// file mentions.
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { dirname, resolve, relative, join } from "node:path";
const root = resolve("src");
const all = []; (function list(d) { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) list(p); else if (/\.(ts|tsx)$/.test(f) && !f.endsWith(".d.ts")) all.push(p); } })(root);
const tryFile = (p) => { for (const ext of ["", ".ts", ".tsx", "/index.ts", "/index.tsx"]) { const f = p + ext; if (existsSync(f) && statSync(f).isFile()) return f; } return null; };
const reached = new Set();
(function walk(file) { if (reached.has(file)) return; reached.add(file); const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(/(?:import|export)[^"';]*?["'](\.[^"']+)["']|import\(\s*["'](\.[^"']+)["']\s*\)/g)) { const spec = m[1] ?? m[2]; if (spec.endsWith(".css")) continue; const f = tryFile(resolve(dirname(file), spec)); if (f) walk(f); } })(resolve("src/main.tsx"));
console.log("--- files nothing reaches");
for (const f of all) if (!reached.has(f)) console.log("  " + relative(root, f));
console.log("--- exports no other file mentions");
const texts = new Map(all.map((f) => [f, readFileSync(f, "utf8")]));
for (const [f, src] of texts) {
  for (const m of src.matchAll(/^export\s+(?:default\s+)?(?:async\s+)?(?:const|let|function|class|type|interface|enum)\s+([A-Za-z_$][\w$]*)/gm)) {
    const name = m[1]; const re = new RegExp(`\\b${name}\\b`);
    let used = false; for (const [g, other] of texts) if (g !== f && re.test(other)) { used = true; break; }
    if (!used) { const inFile = (src.match(new RegExp(`\\b${name}\\b`, "g")) ?? []).length; console.log(`  ${relative(root, f)}: ${name}${inFile > 1 ? " (used inside its own file)" : ""}`); }
  }
}