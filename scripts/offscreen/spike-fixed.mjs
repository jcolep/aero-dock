// A spike: does `background-attachment: fixed` hold a window-sized picture still behind elements that
// sit inside transformed parents? Elements below should all show the same split (red to the left of
// the window's middle, blue to the right) at the same place, whatever is above them.
import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
const h = await startHarness({ out, window: "dock", viewport: [1000, 500], running: [], settings: () => {} });
try {
  await h.open(".dock-icon");
  await h.eval(`(() => {
    const c = document.createElement("canvas"); c.width = 100; c.height = 50;
    const g = c.getContext("2d");
    const grad = g.createLinearGradient(0, 0, 100, 0);
    grad.addColorStop(0, "#e03030"); grad.addColorStop(0.5, "#e03030"); grad.addColorStop(0.5, "#3050e0"); grad.addColorStop(1, "#3050e0");
    g.fillStyle = grad; g.fillRect(0, 0, 100, 50);
    const url = c.toDataURL("image/png");
    document.documentElement.style.setProperty("--backdrop", "url(" + url + ")");
    document.body.innerHTML = "";
    document.body.style.background = "#111";
    const mk = (label, top, parentStyle) => {
      const p = document.createElement("div");
      p.style.cssText = "position:absolute;left:0;top:" + top + "px;width:1000px;height:70px;" + parentStyle;
      const e = document.createElement("div");
      e.style.cssText = "position:absolute;left:300px;top:5px;width:400px;height:60px;border-radius:30px;background:var(--backdrop) fixed 0 0 / 100vw 100vh no-repeat;";
      e.textContent = label;
      p.appendChild(e); document.body.appendChild(p);
    };
    mk("plain", 20, "");
    mk("translated", 100, "transform: translateY(0px);");
    mk("will-change", 180, "will-change: transform;");
    mk("scaled", 260, "transform: scale(0.9); transform-origin: 50% 50%;");
    mk("moved", 340, "transform: translateX(120px);");
    return 1;
  })()`);
  await h.sleep(500);
  console.log("sheet:", await h.sheet({ all: await h.shot(0, 0, 1000, 420, 1) }, "spike-fixed"));
} finally {
  h.close();
}
process.exit(0);
