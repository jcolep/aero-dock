// Lists the controls in the settings window that are written out more than once, with where. One-off check.
import { readFileSync } from "node:fs";

const file = process.argv[2] ?? "src/features/settings/SettingsApp.tsx";
const text = readFileSync(file, "utf8");
const lines = text.split(/\r?\n/);
const blocks = [];
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^(\s*)<(AeroToggle|AeroSlider|AeroSegmented|AeroSelect|SettingsSub|AeroColor\w*)\b/);
  if (!m) continue;
  // the block runs to the line that closes it at the same indent ("/>" or "</Name>")
  const indent = m[1];
  let j = i;
  if (!/\/>\s*$/.test(lines[i]) || lines[i].trim() === `<${m[2]}`) {
    while (j < lines.length && !(lines[j].startsWith(indent + "/>") || lines[j].startsWith(`${indent}</${m[2]}>`))) j++;
  }
  blocks.push({ start: i + 1, end: j + 1, body: lines.slice(i, j + 1).map((l) => l.trim()).join(" "), name: m[2] });
}
const seen = new Map();
for (const b of blocks) {
  const arr = seen.get(b.body) ?? [];
  arr.push(b);
  seen.set(b.body, arr);
}
let n = 0;
for (const [body, arr] of seen) {
  if (arr.length > 1) {
    n++;
    console.log(`${arr.length}x  lines ${arr.map((b) => `${b.start}-${b.end}`).join(", ")}  ${body.slice(0, 90)}`);
  }
}
console.log(n ? `${n} controls written more than once` : "no control is written twice");
