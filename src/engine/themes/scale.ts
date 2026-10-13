/**
 * The screen's scale as a number the stylesheets can divide by (`--dpr`), so that a hairline is one device pixel
 * (`--hair`, tokens.css) and not 1.25 or 1.5 of them, drawn soft. It is written at the start, and again whenever
 * the window changes screens or the screen's scale changes (a media query on the resolution says when).
 */

export function trackScale(): void {
  const write = () => {
    document.documentElement.style.setProperty("--dpr", String(window.devicePixelRatio || 1));
  };
  write();
  const watch = () => {
    const query = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    query.addEventListener(
      "change",
      () => {
        write();
        watch();
      },
      { once: true },
    );
  };
  watch();
  window.addEventListener("resize", write);
}
