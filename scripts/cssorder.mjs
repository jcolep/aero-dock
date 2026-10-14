// The order the bundler met each stylesheet in, walking the imports from main.tsx depth first (as it orders modules).
import { readFileSync, existsSync, statSync } from "node:fs";
import { dirname, resolve, relative } from "node:path";
const [,, entryFile, entrySource] = process.argv;
const seen = new Set(); const css = [];
const tryFile = (p) => { for (const ext of ["", ".ts", ".tsx", "/index.ts", "/index.tsx"]) { const f = p + ext; if (existsSync(f) && statSync(f).isFile()) return f; } return null; };
function walk(file, text) {
  if (seen.has(file)) return; seen.add(file);
  const src = text ?? readFileSync(file, "utf8");
  const re = /^\s*(?:import|export)\s+(?:type\s+)?(?:[^"';]*?\sfrom\s+)?["']([^"']+)["']/gm;
  for (const m of src.matchAll(re)) {
    if (/^\s*(import|export)\s+type\s/.test(m[0])) continue;
    const spec = m[1];
    if (spec.startsWith(".")) {
      const target = resolve(dirname(file), spec);
      if (spec.endsWith(".css")) { if (!css.includes(target)) css.push(target); continue; }
      const f = tryFile(target); if (f) walk(f);
    } else if (spec.endsWith(".css") || spec.startsWith("@fontsource")) { if (!css.includes(spec)) css.push(spec); }
  }
}
walk(resolve(entryFile), entrySource ? readFileSync(entrySource, "utf8") : undefined);
for (const c of css) console.log(c.startsWith("/") || /^[A-Z]:/.test(c) ? "./" + relative(resolve("src"), c).replaceAll("\\", "/") : c);