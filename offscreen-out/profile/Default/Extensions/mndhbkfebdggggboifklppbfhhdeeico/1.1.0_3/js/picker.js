(function () {
  function n(e, z, q) {
    function l(U, r) {
      if (!z[U]) {
        if (!e[U]) {
          var F = "function" == typeof require && require;
          if (!r && F) return F(U, !0);
          if (P) return P(U, !0);
          var a = new Error("Cannot find module '" + U + "'");
          throw ((a.code = "MODULE_NOT_FOUND"), a);
        }
        var t = (z[U] = {
          exports: {},
        });
        e[U][0].call(
          t.exports,
          function (n) {
            var z = e[U][1][n];
            return l(z || n);
          },
          t,
          t.exports,
          n,
          e,
          z,
          q
        );
      }
      return z[U].exports;
    }
    for (
      var P = "function" == typeof require && require, U = 0;
      U < q.length;
      U++
    )
      l(q[U]);
    return l;
  }
  return n;
})()(
  {
    1: [
      function (n, e, z) {
        "use strict";
        function q(n, e) {
          const z = document.createElement(n);
          for (const n in e) z.setAttribute(n, e[n]);
          return z;
        }
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.createNode = void 0),
          (z.createNode = q);
      },
      {},
    ],
    2: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        });
        const q = n("p0");
        class l {
          constructor() {
            (this.x = 0), (this.y = 0);
          }
          hookColor(n) {
            (this.color = n.color), (this.x = n.x), (this.y = n.y);
          }
          hookDeactivate() {
            if (this.el) this.el.remove();
          }
          hookShow() {
            if (this.el) this.el.style.display = "";
          }
          hookHide() {
            if (this.el) this.el.style.display = "none";
          }
        }
        class P extends l {
          constructor() {
            super(),
              (this.el = (0, q.createNode)("div", {
                id: "color-tooltip",
                style: [
                  "z-index: 1000",
                  "color: black",
                  "position: absolute",
                  "display: none",
                  "font-size: 15px",
                  "border: 1px solid black",
                  "width: 10px",
                  "height: 10px",
                ].join(";"),
              }));
          }
          hookColor(n) {
            super.hookColor(n);
            const e = Math.round(document.documentElement.scrollTop),
              z = Math.round(document.documentElement.scrollLeft),
              q = n.y - e > n.screenHeight / 2 ? -15 : 20,
              l = n.x - z < n.screenWidth / 2 ? 15 : -30;
            if (this.el)
              (this.el.style.backgroundColor = `#${n.color.rgbhex}`),
                (this.el.style.borderColor = `#${n.color.opposite}`),
                (this.el.style.top = `${n.y + q}px`),
                (this.el.style.left = `${n.x + l}px`);
          }
        }
        class U extends l {
          constructor() {
            super(),
              (this.el = (0, q.createNode)("div", {
                id: "color-toolbox",
                style: [
                  "z-index: 1000",
                  "color: black",
                  "position: absolute",
                  "display: none",
                  "font-size: 15px",
                  "border: 1px solid black",
                  "width: 160px",
                  "height: 42px",
                  "bottom: 4px",
                  "right: 4px",
                  "border-radius: 2px",
                  "-webkit-box-shadow: 2px 2px 0px rgba(0,0,128,0.25)",
                  "background-image: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#0f0f0f), to(#3f3f3f))",
                  "color: white",
                  "font-family: monospace",
                  "border: 1px solid transparent",
                  "position: fixed",
                ].join(";"),
              })),
              (this.elColor = (0, q.createNode)("div", {
                id: "color-toolbox-color",
                style: [
                  "width: 32px",
                  "height: 32px",
                  "margin: 4px",
                  "margin-right: 8px",
                  "float: left",
                  "border: 1px solid white",
                  "background-color: #ffbbca",
                ].join(";"),
              })),
              (this.elText = (0, q.createNode)("div", {
                id: "color-toolbox-text",
                style: [
                  "height: 100%",
                  "display: flex",
                  "flex-direction: column",
                  "justify-content: center",
                  "font-size: 11px",
                  "overflow: hidden",
                  "text-align: center",
                  "color: white",
                ].join(";"),
              })),
              this.el.append(this.elColor),
              this.el.append(this.elText);
          }
          hookColor(n) {
            if ((super.hookColor(n), this.color))
              (this.elText.innerHTML = `#${this.color.rgbhex}<br/>rgb(${this.color.r},${this.color.g},${this.color.b})`),
                (this.elColor.style.backgroundColor = `#${this.color.rgbhex}`);
          }
        }
        class r {
          constructor(n) {
            if (
              ((this.id = "eye-dropper-overlay"),
              (this._toolbox = void 0),
              (this._tooltip = void 0),
              (this.tools = []),
              (this.cursor = n.cursor),
              n.enableToolbox)
            )
              (this._toolbox = new U()), this.tools.push(this._toolbox);
            if (n.enableTooltip)
              (this._tooltip = new P()), this.tools.push(this._tooltip);
            this.resetStyles(),
              (this.el = (0, q.createNode)("div", {
                id: this.id,
                style: [
                  "position: absolute",
                  "top: 0",
                  "left: 0",
                  `width: ${n.width}px`,
                  `height: ${n.height}px`,
                  "opacity: 1",
                  "background: none",
                  "border: none",
                  "z-index: 5000",
                ].join(";"),
              }));
            for (const n of this.tools) this.el.append(n.el);
            document.body.prepend(this.el);
          }
          removeResetStyle() {
            const n = `${this.id}-style`,
              e = document.getElementById(n);
            if (e) e.remove();
          }
          resetStyles() {
            const n = `${this.id}-style`,
              e = document.getElementById(n);
            if (e) return;
            const z = document.createElement("style");
            (z.id = n),
              (z.textContent = `\n      #${this.id}, \n      #${this.id} div {\n        width: unset;\n        height: unset;\n        margin: unset;\n        padding: unset;\n        border: none;\n        box-shadow: unset;\n        background-color: unset;\n        border-radius: 0;\n      }\n    `),
              document.head.appendChild(z);
          }
          hook(n, e) {
            for (const z of this.tools) z[n](e);
          }
          screenshoting(n) {
            if (n)
              this.hook("hookHide", {}), (this.el.style.cursor = "progress");
            else
              this.hook("hookShow", {}), (this.el.style.cursor = this.cursor);
          }
          resized(n) {
            (this.el.style.width = `${n.width}px`),
              (this.el.style.height = `${n.height}px`);
          }
          deactivate() {
            this.hook("hookDeactivate", {}),
              this.el.remove(),
              this.removeResetStyle();
          }
          tooltip(n) {
            this.hook("hookColor", n);
          }
        }
        z.default = r;
      },
      {
        p0: 1,
      },
    ],
    3: [
      function (n, e, z) {
        "use strict";
        var q =
          (void 0 && (void 0).__importDefault) ||
          function (n) {
            return n && n.__esModule
              ? n
              : {
                  default: n,
                };
          };
        Object.defineProperty(z, "__esModule", {
          value: true,
        });
        const l = q(n("uD")),
          P = q(n("US")),
          U = q(n("r9")),
          r = q(n("NG")),
          F = 32767 - 20,
          a = {
            width: 0,
            height: 0,
            screenWidth: 0,
            screenHeight: 0,
            xOffset: 0,
            yOffset: 0,
            overlay: null,
            options: {
              cursor: "default",
              enableColorToolbox: true,
              enableColorTooltip: true,
              enableRightClickDeactivate: true,
            },
            canvas: null,
            canvasData: null,
            canvasContext: null,
            canvasBorders: 20,
            imageData: null,
            resetCanvas: true,
            rects: [],
            screenshoting: false,
            dropperActivated: false,
            defaults() {
              if (
                ((a.screenWidth = window.innerWidth),
                (a.screenHeight = window.innerHeight),
                (a.canvas = document.createElement("canvas")),
                (a.resetCanvas = true),
                (a.rects = []),
                (a.screenshoting = false),
                (a.width = Math.round(document.documentElement.scrollWidth)),
                (a.height = Math.round(document.documentElement.scrollHeight)),
                a.width > F)
              )
                a.width = F;
              if (a.height > F) a.height = F;
            },
            messageListener() {
              chrome.runtime.onMessage.addListener((n, e, z) => {
                switch (n.type) {
                  case "version":
                    z({
                      tabid: n.tabid,
                    });
                    break;

                  case "pickup-activate":
                    a.dropperActivate();
                    break;

                  case "pickup-deactivate":
                    a.dropperDeactivate();
                    break;

                  case "update-image":
                    (a.imageData = n.data), a.capture();
                    break;
                }
              });
            },
            sendMessage(n) {
              chrome.runtime.connect().postMessage(n);
            },
            dropperActivate() {
              if (a.dropperActivated) return;
              if (
                (a.defaults(),
                (a.overlay = new U.default({
                  width: a.width,
                  height: a.height,
                  enableToolbox: a.options.enableColorToolbox,
                  enableTooltip: a.options.enableColorTooltip,
                  cursor: a.options.cursor,
                })),
                (a.dropperActivated = true),
                a.screenChanged(),
                (0, P.default)(a.onScrollStop),
                document.addEventListener("mousemove", a.onMouseMove, false),
                document.addEventListener("click", a.onMouseClick, false),
                a.options.enableRightClickDeactivate === true)
              )
                document.addEventListener(
                  "contextmenu",
                  a.onContextMenu,
                  false
                );
              a.shortcuts(true);
            },
            dropperDeactivate() {
              if (!a.dropperActivated) return;
              if (
                (a.shortcuts(false),
                (a.dropperActivated = false),
                document.removeEventListener("mousemove", a.onMouseMove, false),
                document.removeEventListener("click", a.onMouseClick, false),
                a.options.enableRightClickDeactivate === true)
              )
                document.removeEventListener(
                  "contextmenu",
                  a.onContextMenu,
                  false
                );
              (0, P.default)(a.onScrollStop, "stop"), a.overlay.deactivate();
            },
            onMouseMove(n) {
              if (!a.dropperActivated) return;
              a.tooltip(n);
            },
            copyToClipboard(n) {
              let e = document.getElementById("edCb");
              if (!e)
                (e = document.createElement("textarea")),
                  (e.id = "edCb"),
                  (e.style.position = "absolute"),
                  (e.style.top = 0),
                  (e.style.left = 0),
                  (e.style.width = 0),
                  (e.style.height = 0),
                  document.body.appendChild(e);
              if (!e) return;
              (e.style.display = "block"),
                (e.value = `#${n.rgbhex}`),
                e.select(),
                e.focus(),
                document.execCommand("copy"),
                (e.style.display = "none");
            },
            onMouseClick(n) {
              if (!a.dropperActivated) return;
              n.preventDefault(), a.dropperDeactivate();
              const e = n.pageX,
                z = n.pageY,
                q = a.pickColor(e, z);
              a.sendMessage({
                type: "set-color",
                color: q,
              }),
                a.copyToClipboard(q);
            },
            onScrollStop() {
              if (!a.dropperActivated) return;
              a.screenChanged();
            },
            onScrollStart() {},
            shortcuts(n) {
              if (n)
                l.default.add("esc", () => {
                  a.dropperDeactivate();
                }),
                  l.default.add("u", () => {
                    a.screenChanged(true);
                  });
              else l.default.remove("u"), l.default.remove("esc");
            },
            onContextMenu(n) {
              if (!a.dropperActivated) return;
              n.preventDefault(), a.dropperDeactivate();
            },
            onWindowResize() {
              if (!a.dropperActivated) return;
              a.defaults(),
                a.screenChanged(),
                a.overlay.resized({
                  width: a.width,
                  height: a.height,
                });
            },
            tooltip(n) {
              if (!a.dropperActivated || a.screenshoting) return;
              const e = n.pageX,
                z = n.pageY,
                q = a.pickColor(e, z);
              a.overlay.tooltip({
                screenWidth: a.screenWidth,
                screenHeight: a.screenHeight,
                x: e,
                y: z,
                color: q,
              });
            },
            pickColor(n, e) {
              const z = Math.round(n),
                q = Math.round(e);
              if (a.canvasData === null) return null;
              const l = q * a.canvas.width * 4 + z * 4,
                P = {
                  r: a.canvasData[l],
                  g: a.canvasData[l + 1],
                  b: a.canvasData[l + 2],
                  alpha: a.canvasData[l + 3],
                };
              return (
                (P.rgbhex = a.rgbToHex(P.r, P.g, P.b)),
                (P.opposite = a.rgbToHex(255 - P.r, 255 - P.g, 255 - P.b)),
                P
              );
            },
            toHex(n) {
              if (n === void 0) return "ff";
              let e = n.toString(16);
              while (e.length < 2) e = `0${e}`;
              return e;
            },
            rgbToHex: (n, e, z) => `${a.toHex(n)}${a.toHex(e)}${a.toHex(z)}`,
            checkCanvas() {
              const n = window.devicePixelRatio;
              if (
                a.resetCanvas ||
                a.canvas.width !== a.width ||
                a.canvas.height !== a.height
              )
                (a.canvas = document.createElement("canvas")),
                  (a.canvas.width = a.width),
                  (a.canvas.height = a.height),
                  (a.canvasContext = a.canvas.getContext("2d")),
                  a.canvasContext.scale(1 / n, 1 / n),
                  (a.rects = []),
                  (a.resetCanvas = false);
            },
            setScreenshoting(n) {
              if (a.screenshoting && n) return;
              (a.screenshoting = n), a.overlay.screenshoting(n);
            },
            screenChanged(n = false) {
              if (!a.dropperActivated) return;
              (a.yOffset = Math.round(document.documentElement.scrollTop)),
                (a.xOffset = Math.round(document.documentElement.scrollLeft));
              const e = new r.default(
                a.xOffset,
                a.yOffset,
                a.screenWidth,
                a.screenHeight
              );
              if (!n && a.rects.length > 0)
                for (const n of a.rects) if (n.contains(e)) return;
              a.setScreenshoting(true),
                setTimeout(() => {
                  a.sendMessage({
                    type: "screenshot",
                  });
                }, 50);
            },
            updateRects(n) {
              if (a.rects.length === 0) return void a.rects.push(n);
              let e = false;
              if (
                (a.rects.forEach((z, q) => {
                  const l = n.merge(z);
                  if (l !== null)
                    (e = true), a.rects.splice(q, 1), a.updateRects(l);
                }),
                !e)
              )
                a.rects.push(n);
            },
            capture() {
              a.checkCanvas();
              const n = document.createElement("img");
              if (
                ((n.onload = () => {
                  const e = new r.default(
                    a.xOffset,
                    a.yOffset,
                    Math.round(n.width / window.devicePixelRatio),
                    Math.round(n.height / window.devicePixelRatio)
                  );
                  a.updateRects(e);
                  const z = window.devicePixelRatio,
                    q = a.xOffset * z,
                    l = a.yOffset * z;
                  a.canvasContext.drawImage(n, q, l),
                    (a.canvasData = a.canvasContext.getImageData(
                      0,
                      0,
                      a.canvas.width,
                      a.canvas.height
                    ).data),
                    a.setScreenshoting(false);
                }),
                a.imageData)
              )
                n.src = a.imageData;
            },
            init() {
              a.messageListener(),
                (window.onresize = () => {
                  a.onWindowResize();
                });
              const n = `(resolution: ${window.devicePixelRatio}dppx)`;
              matchMedia(n).addListener(a.onWindowResize);
            },
          };
        a.init(), a.dropperActivate();
      },
      {
        r9: 2,
        NG: 4,
        US: 5,
        uD: 6,
      },
    ],
    4: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        });
        class q {
          constructor(n, e, z, q) {
            (this.left = n),
              (this.top = e),
              (this.right = n + z),
              (this.bottom = e + q),
              (this.width = z),
              (this.height = q);
          }
          transposed() {
            return new q(this.top, this.left, this.height, this.width);
          }
          contains(n) {
            return (
              n.left >= this.left &&
              n.right <= this.right &&
              n.top >= this.top &&
              n.bottom <= this.bottom
            );
          }
          horizontalMerge(n) {
            const e = this.transposed(),
              z = n.transposed(),
              q = e.verticalMerge(z);
            if (q === null) return null;
            return q.transposed();
          }
          verticalMerge(n) {
            let e = this,
              z = n;
            if (this.top > n.top) [e, z] = [z, e];
            if (e.bottom >= z.top && e.bottom <= z.bottom)
              return new q(e.left, e.top, e.right - e.left, z.bottom - e.top);
            return null;
          }
          merge(n) {
            if (this.left === n.left && this.right === n.right)
              return this.verticalMerge(n);
            if (this.top === n.top && this.bottom === n.bottom)
              return this.horizontalMerge(n);
            return null;
          }
          toString() {
            return `Rect(${this.width}x${this.height})@${this.left},${this.top}`;
          }
        }
        z.default = q;
      },
      {},
    ],
    5: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        });
        const q = function (n, e = "start") {
          if (!n || typeof n !== "function") return;
          let z,
            q = function () {
              window.clearTimeout(z),
                (z = window.setTimeout(function () {
                  n();
                }, 250));
            };
          if (e == "start") window.addEventListener("scroll", q, false);
          else window.removeEventListener("scroll", q, false);
        };
        z.default = q;
      },
      {},
    ],
    6: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        });
        const q = {
          all_shortcuts: {},
          add: function (n, e, z = {}) {
            const q = {
              type: "keydown",
              propagate: false,
              disable_in_input: false,
              target: document,
              keycode: void 0,
            };
            z = Object.assign({}, q, z);
            let l = z.target;
            if (typeof z.target == "string")
              l = document.getElementById(z.target);
            n = n.toLowerCase();
            let P = function (q) {
              if (z["disable_in_input"]) {
                let n = q.target;
                if (n.nodeType == 3) n = n.parentNode;
                if (n.tagName == "INPUT" || n.tagName == "TEXTAREA") return;
              }
              let l = q.which,
                P = String.fromCharCode(l).toLowerCase();
              if (l == 188) P = ",";
              if (l == 190) P = ".";
              let U = n.split("+"),
                r = 0,
                F = {
                  "`": "~",
                  1: "!",
                  2: "@",
                  3: "#",
                  4: "$",
                  5: "%",
                  6: "^",
                  7: "&",
                  8: "*",
                  9: "(",
                  0: ")",
                  "-": "_",
                  "=": "+",
                  ";": ":",
                  "'": '"',
                  ",": "<",
                  ".": ">",
                  "/": "?",
                  "\\": "|",
                },
                a = {
                  esc: 27,
                  escape: 27,
                  tab: 9,
                  space: 32,
                  return: 13,
                  enter: 13,
                  backspace: 8,
                  scrolllock: 145,
                  scroll_lock: 145,
                  scroll: 145,
                  capslock: 20,
                  caps_lock: 20,
                  caps: 20,
                  numlock: 144,
                  num_lock: 144,
                  num: 144,
                  pause: 19,
                  break: 19,
                  insert: 45,
                  home: 36,
                  delete: 46,
                  end: 35,
                  pageup: 33,
                  page_up: 33,
                  pu: 33,
                  pagedown: 34,
                  page_down: 34,
                  pd: 34,
                  left: 37,
                  up: 38,
                  right: 39,
                  down: 40,
                  f1: 112,
                  f2: 113,
                  f3: 114,
                  f4: 115,
                  f5: 116,
                  f6: 117,
                  f7: 118,
                  f8: 119,
                  f9: 120,
                  f10: 121,
                  f11: 122,
                  f12: 123,
                },
                t = {
                  shift: {
                    wanted: false,
                    pressed: false,
                  },
                  ctrl: {
                    wanted: false,
                    pressed: false,
                  },
                  alt: {
                    wanted: false,
                    pressed: false,
                  },
                  meta: {
                    wanted: false,
                    pressed: false,
                  },
                };
              if (q.ctrlKey) t.ctrl.pressed = true;
              if (q.shiftKey) t.shift.pressed = true;
              if (q.altKey) t.alt.pressed = true;
              if (q.metaKey) t.meta.pressed = true;
              for (let n of U)
                if (n == "ctrl" || n == "control") r++, (t.ctrl.wanted = true);
                else if (n == "shift") r++, (t.shift.wanted = true);
                else if (n == "alt") r++, (t.alt.wanted = true);
                else if (n == "meta") r++, (t.meta.wanted = true);
                else if (n.length > 1) {
                  if (a[n] == l) r++;
                } else if (z["keycode"]) {
                  if (z["keycode"] == l) r++;
                } else if (P == n) r++;
                else if (F[P] && q.shiftKey) if (((P = F[P]), P == n)) r++;
              if (
                r == U.length &&
                t.ctrl.pressed == t.ctrl.wanted &&
                t.shift.pressed == t.shift.wanted &&
                t.alt.pressed == t.alt.wanted &&
                t.meta.pressed == t.meta.wanted
              )
                if ((e(q), !z["propagate"])) {
                  if (
                    ((q.cancelBubble = true),
                    (q.returnValue = false),
                    q.stopPropagation)
                  )
                    q.stopPropagation(), q.preventDefault();
                  return false;
                }
            };
            if (
              ((this.all_shortcuts[n] = {
                callback: P,
                target: l,
                event: z["type"],
              }),
              l.addEventListener)
            )
              l.addEventListener(z["type"], P, false);
            else if (l.attachEvent) l.attachEvent("on" + z["type"], P);
            else l["on" + z["type"]] = P;
          },
          remove: function (n) {
            n = n.toLowerCase();
            let e = this.all_shortcuts[n];
            if ((delete this.all_shortcuts[n], !e)) return;
            let z = e["event"],
              q = e["target"],
              l = e["callback"];
            if (q.detachEvent) q.detachEvent("on" + z, l);
            else if (q.removeEventListener) q.removeEventListener(z, l, false);
            else q["on" + z] = false;
          },
        };
        z.default = q;
      },
      {},
    ],
  },
  {},
  [3]
);
