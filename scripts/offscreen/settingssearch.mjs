// Searching the settings themselves, off screen, in the real settings page: typing a word narrows the page to the rows
// that answer it (label, hint, group heading or section title), puts away the groups and sections with none, marks the
// words found, lists in the sidebar only the sections that have a hit, and says how many; a section named by the search
// whose rows say nothing more particular is shown whole; nothing found says so; clearing the search puts it all back.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/settingssearch.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};
const h = await startHarness({ out, window: "settings", viewport: [1100, 760], settings: (s) => void (s.onboardingComplete = true) });
try {
  await h.open(".settings-root");
  await h.sleep(700);
  const q = (js) => h.eval(`(() => ${js})()`);
  const search = async (text) => {
    await q(`(() => { const i = document.querySelector('.settings-search input'); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, ${JSON.stringify(text)}); i.dispatchEvent(new Event('input', { bubbles: true })); return 1; })()`);
    await h.sleep(450);
  };
  // what is showing: the labels of the rows not put away, the sections drawn, the sidebar, the header
  const view = () =>
    q(`(() => {
      const vis = (e) => !e.closest('[data-search="hide"]') && e.getClientRects().length > 0;
      return {
        labels: [...document.querySelectorAll('.settings-scroll .ctl-label')].filter(vis).map((e) => e.textContent.trim()),
        sections: [...document.querySelectorAll('section.settings-section')].filter(vis).map((e) => e.dataset.section),
        sidebar: [...document.querySelectorAll('.sb-item')].map((e) => e.textContent.trim()),
        header: document.querySelector('.pane-title p')?.textContent ?? '',
        subs: [...document.querySelectorAll('.settings-scroll .settings-sub')].filter(vis).length,
        marks: (CSS.highlights && CSS.highlights.get('settings-find')) ? CSS.highlights.get('settings-find').size : -1,
        nomatch: !!document.querySelector('.settings-nomatch'),
      };
    })()`);

  const before = await view();
  check(before.sidebar.length > 8, `no search: the sidebar lists the sections (${before.sidebar.length})`);

  await search("magnification");
  let v = await view();
  console.log("magnification ->", JSON.stringify({ sections: v.sections, labels: v.labels.slice(0, 8), header: v.header, marks: v.marks }));
  check(v.labels.length >= 1 && v.labels.length <= 12, `"magnification": narrowed to a few settings (${v.labels.length})`);
  check(v.labels.some((l) => /magnif/i.test(l)), `...and they include one named for it`);
  check(v.sections.length >= 1 && v.sections.length <= 3, `...in ${v.sections.length} section(s)`);
  check(v.sidebar.length === v.sections.length, `the sidebar lists only those sections (${v.sidebar.join(", ")})`);
  check(/\d+ settings? in \d+ sections?/.test(v.header), `the header counts them: ${v.header}`);
  check(v.marks > 0, `the words found are marked (${v.marks})`);

  await search("sound volume");
  v = await view();
  console.log("sound volume ->", JSON.stringify({ sections: v.sections, labels: v.labels.slice(0, 8) }));
  check(v.labels.length >= 1 && v.labels.length < 15, `two words, all must be found: ${v.labels.length} settings`);

  await search("qzxjv");
  v = await view();
  check(v.labels.length === 0 && v.sections.length === 0, "a word nothing answers: no rows, no sections");
  check(v.nomatch, "...and the page says nothing matches");
  check(/No setting matches/.test(v.header), `...and so does the header: ${v.header}`);

  // a section named by the search whose rows say nothing more particular is shown whole
  await search("accessibility");
  v = await view();
  check(v.sections.includes("accessibility") && v.labels.length >= 2, `a section named by the search is shown whole (${v.labels.length} rows)`);

  await search("");
  v = await view();
  check(v.sidebar.length === before.sidebar.length, "clearing the search brings every section back to the sidebar");
  check((await q("document.querySelectorAll('[data-search]').length")) === 0, "...and puts nothing away");
  check((await h.errors()).length === 0, "no errors in the page");
} finally {
  h.close();
}
process.exit(failed ? 1 : 0);
