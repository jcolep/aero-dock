// How much of a built chunk each source module is, from its source map (bytes of output per source).
import { readFileSync, readdirSync } from "node:fs";
const dir = process.argv[2], pick = process.argv[3];
const file = readdirSync(dir).find((f) => f.startsWith(pick) && f.endsWith(".js"));
const code = readFileSync(`${dir}/${file}`, "utf8"); const map = JSON.parse(readFileSync(`${dir}/${file}.map`, "utf8"));
// decode VLQ mappings, attribute each generated segment's length to its source
const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const lines = code.split("\n"); const size = new Map(); let src = 0;
map.mappings.split(";").forEach((line, li) => { let col = 0; const segs = line ? line.split(",") : []; const parsed = [];
  for (const s of segs) { const v = []; let shift = 0, val = 0; for (const ch of s) { let d = B64.indexOf(ch); val += (d & 31) << shift; if (d & 32) { shift += 5; } else { v.push(val & 1 ? -(val >> 1) : val >> 1); val = 0; shift = 0; } } col += v[0]; if (v.length > 1) src += v[1]; parsed.push([col, v.length > 1 ? src : -1]); }
  for (let i = 0; i < parsed.length; i++) { const [c, s] = parsed[i]; const end = i + 1 < parsed.length ? parsed[i + 1][0] : (lines[li]?.length ?? c); if (s >= 0) size.set(s, (size.get(s) ?? 0) + end - c); } });
const byPkg = new Map();
for (const [s, n] of size) { const p = map.sources[s].replace(/^.*node_modules\/(?:\.pnpm\/[^/]+\/node_modules\/)?((?:@[^/]+\/)?[^/]+).*$/, "pkg:$1").replace(/^\.\.\/\.\.\/\.\.\/src\//, "src/").replace(/^(src\/[^/]+\/[^/]+).*/, "$1"); byPkg.set(p, (byPkg.get(p) ?? 0) + n); }
console.log(file, (code.length / 1024).toFixed(0), "KB");
for (const [p, n] of [...byPkg].sort((a, b) => b[1] - a[1]).slice(0, 22)) console.log(`${(n / 1024).toFixed(1).padStart(7)} KB  ${p}`);