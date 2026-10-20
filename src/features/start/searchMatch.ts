/**
 * How the Start menu's search finds an app, the way Windows' own Start search does rather than by plain "contains":
 *
 * - the name itself, or its start ("visual st")
 * - the starts of its words, in order, any of them skipped ("stu co" for Visual Studio Code), and so its initials too
 *   ("vsc", "rdc" for Remote Desktop Connection), or both mixed ("vscode"): the query is cut into pieces, each the start
 *   of a later word than the last (`pieces`)
 * - the program's own file name ("code" for Code.exe, "msedge", "winword"), or a packaged app's name in its id
 * - anywhere in the name ("studio")
 * - with a slip of a key or two (`typos`: "vsiual", "powershel")
 *
 * Each way of matching has its own band of scores, so a better kind of match always comes first, and within a band
 * the closer one does (fewer words skipped, fewer pieces). What the person has picked before for what they typed is
 * added on top (learned.ts), which can lift an app past a band, as Windows' does.
 */

/** Lowercase, without accents. */
export function fold(s: string): string {
  return s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** The words of a name: split at anything that is not a letter or a digit, and at a capital inside a word
 *  ("PowerShell" is power + shell, "VSCode" is vs + code). */
export function wordsOf(name: string): string[] {
  const spaced = name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
  return spaced
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/** The name a program goes by in its file or package: `Code` for `...\Code.exe`, `WindowsTerminal` for
 *  `shell:AppsFolder\Microsoft.WindowsTerminal_8wekyb3d8bbwe!App`. Empty for an address. */
export function programName(target: string): string {
  const apps = /^shell:AppsFolder\\([^!]+)/i.exec(target);
  if (apps) {
    const family = apps[1].split("_")[0];
    const parts = family.split(".");
    // the publisher's part is not the app's name ("Microsoft.WindowsTerminal" is WindowsTerminal)
    return parts.length > 1 ? parts.slice(1).join(" ") : family;
  }
  if (/^[a-z][a-z0-9+.-]*:(?![\\/])/i.test(target) && !/^[a-z]:/i.test(target)) return "";
  const base = target.split(/[\\/]/).pop() ?? "";
  return base.replace(/\.(exe|lnk|bat|cmd|msc|cpl|url)$/i, "");
}

/**
 * The query, without spaces, cut into pieces that each start a word, the words in order, any skipped. The best cut:
 * the fewest words skipped before the first piece, then the fewest skipped between, then the fewest pieces. `null` if
 * it cannot be cut so.
 */
export function pieces(query: string, words: string[]): { before: number; between: number; count: number } | null {
  const q = query.replace(/\s+/g, "");
  if (!q || words.length === 0) return null;
  const memo = new Map<string, { between: number; count: number } | null>();
  // the best way to match q from position i using words from j on, given a word was just matched (no "before" here)
  const rest = (i: number, j: number): { between: number; count: number } | null => {
    if (i === q.length) return { between: 0, count: 0 };
    const key = `${i}:${j}`;
    if (memo.has(key)) return memo.get(key)!;
    let best: { between: number; count: number } | null = null;
    for (let w = j; w < words.length; w++) {
      const word = words[w];
      for (let len = Math.min(word.length, q.length - i); len >= 1; len--) {
        if (!word.startsWith(q.slice(i, i + len))) continue;
        const tail = rest(i + len, w + 1);
        if (!tail) continue;
        const cand = { between: tail.between + (w - j), count: tail.count + 1 };
        if (!best || cand.between < best.between || (cand.between === best.between && cand.count < best.count)) best = cand;
      }
    }
    memo.set(key, best);
    return best;
  };
  let out: { before: number; between: number; count: number } | null = null;
  for (let first = 0; first < words.length; first++) {
    const word = words[first];
    for (let len = Math.min(word.length, q.length); len >= 1; len--) {
      if (!word.startsWith(q.slice(0, len))) continue;
      const tail = rest(len, first + 1);
      if (!tail) continue;
      const cand = { before: first, between: tail.between, count: tail.count + 1 };
      if (
        !out ||
        cand.before < out.before ||
        (cand.before === out.before && (cand.between < out.between || (cand.between === out.between && cand.count < out.count)))
      ) {
        out = cand;
      }
    }
    if (out && out.before === first) break;
  }
  return out;
}

/** Edits between two strings: a letter added, dropped, changed, or two side by side swapped. */
export function distance(a: string, b: string): number {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

/** How many slips a query of this length may have: none under 4 letters (too many words are a slip from 3 letters). */
const slipsFor = (n: number) => (n < 4 ? 0 : n < 8 ? 1 : 2);

/** The fewest slips between the query and the start of the text (as long as the query, give or take one letter). */
function slipsFromStart(q: string, text: string): number {
  let best = Infinity;
  for (const len of [q.length - 1, q.length, q.length + 1]) {
    if (len < 1 || len > text.length) continue;
    best = Math.min(best, distance(q, text.slice(0, len)));
  }
  return best;
}

export interface MatchOptions {
  /** Forgive a slip of a key or two. */
  typos?: boolean;
}

/**
 * How well an app matches what was typed, or `null` if it does not. Bands (each better kind first):
 * 1000 the whole name; 900+ the name's start; 800+ the starts of its words in order; 700+ the program's name;
 * 600 anywhere in the name; 500 anywhere in the program's name; 400+ with slips.
 */
export function scoreApp(query: string, app: { name: string; target: string }, options: MatchOptions = {}): number | null {
  const q = fold(query.trim()).replace(/\s+/g, " ");
  if (!q) return null;
  const name = fold(app.name);
  if (name === q) return 1000;
  // shorter names a touch first within a band ("Code" before "Code Insiders")
  const short = Math.max(0, 20 - name.length) * 0.2;
  if (name.startsWith(q)) return 900 + short;
  const words = wordsOf(app.name);
  const cut = pieces(q, words);
  if (cut) return 800 - cut.before * 20 - cut.between * 8 - (cut.count - 1) * 3 + short;
  const program = programName(app.target);
  if (program) {
    const p = fold(program).replace(/\s+/g, "");
    if (p.startsWith(q.replace(/\s+/g, ""))) return 760 + short;
    const pc = pieces(q, wordsOf(program));
    if (pc) return 700 - pc.before * 20 - pc.between * 8 - (pc.count - 1) * 3 + short;
  }
  if (name.includes(q)) return 600 + short;
  if (program && fold(program).includes(q)) return 500 + short;
  if (options.typos) {
    const compact = q.replace(/\s+/g, "");
    const allowed = slipsFor(compact.length);
    if (allowed > 0) {
      let best = slipsFromStart(compact, name.replace(/\s+/g, ""));
      for (const w of words) best = Math.min(best, slipsFromStart(compact, w));
      if (program) for (const w of wordsOf(program)) best = Math.min(best, slipsFromStart(compact, w));
      if (best <= allowed) return 450 - best * 30 + short;
    }
  }
  return null;
}

/** Whether each word typed starts a word of the text (or slips from one, with `typos`): for Settings' pages. */
export function wordsStart(query: string, text: string, options: MatchOptions = {}): boolean {
  const typed = fold(query).split(/\s+/).filter(Boolean);
  if (typed.length === 0) return false;
  const hay = wordsOf(text);
  const joined = hay.join("");
  return typed.every(
    (w) =>
      hay.some((h) => h.startsWith(w)) ||
      joined.startsWith(w) ||
      (options.typos === true && slipsFor(w.length) > 0 && hay.some((h) => slipsFromStart(w, h) <= slipsFor(w.length))),
  );
}
