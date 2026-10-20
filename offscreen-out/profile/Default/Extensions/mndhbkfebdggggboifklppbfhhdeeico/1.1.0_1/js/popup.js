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
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = D(n("p0"));
        n("uD"),
          n("US"),
          n("r9"),
          n("NG"),
          n("Dg"),
          n("Ic"),
          n("5G"),
          n("mv"),
          n("Kc"),
          n("3X"),
          n("Gh"),
          n("PP"),
          n("0r"),
          n("F6"),
          n("4Q"),
          n("6w"),
          n("KG"),
          n("Ex"),
          n("oP"),
          n("ik"),
          n("im"),
          n("BQ"),
          n("EG"),
          n("fm"),
          n("q2"),
          n("Xj"),
          n("GH"),
          n("WX"),
          n("ju"),
          n("eM"),
          n("83"),
          n("yC"),
          n("6B"),
          n("ro"),
          n("X1"),
          n("vO"),
          n("Fh");
        var l = D(n("tN")),
          P = D(n("s")),
          U = D(n("Vb")),
          r = D(n("Sv")),
          F = D(n("LZ")),
          a = D(n("ov")),
          t = D(n("l7")),
          b = n("Ke"),
          p = D(n("Ji")),
          y = D(n("8T")),
          X = D(n("AA")),
          O = D(n("2u")),
          u = D(n("36")),
          d = D(n("qB")),
          m = D(n("6k")),
          W = D(n("Pq"));
        function D(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        Object.assign(q.default, {
          average: l.default,
          bezier: P.default,
          blend: U.default,
          cubehelix: r.default,
          mix: F.default,
          interpolate: F.default,
          random: a.default,
          scale: t.default,
          analyze: b.analyze,
          contrast: p.default,
          deltaE: y.default,
          distance: X.default,
          limits: b.limits,
          valid: O.default,
          scales: d.default,
          input: u.default,
          colors: m.default,
          brewer: W.default,
        });
        var L = (z.default = q.default);
      },
      {
        p0: 3,
        Pq: 4,
        "6k": 5,
        tN: 6,
        s: 7,
        Vb: 8,
        Sv: 9,
        LZ: 10,
        ov: 11,
        l7: 12,
        yC: 14,
        "6B": 15,
        ro: 16,
        X1: 17,
        ju: 19,
        eM: 20,
        WX: 21,
        83: 22,
        vO: 23,
        Fh: 24,
        GH: 25,
        uD: 27,
        US: 31,
        r9: 33,
        NG: 35,
        Dg: 38,
        Ic: 41,
        "5G": 44,
        mv: 47,
        36: 49,
        Kc: 50,
        "3X": 55,
        Gh: 60,
        PP: 61,
        "4Q": 64,
        "6w": 67,
        "0r": 70,
        F6: 71,
        KG: 74,
        Ex: 75,
        oP: 76,
        ik: 77,
        im: 78,
        BQ: 79,
        EG: 80,
        fm: 81,
        q2: 82,
        Xj: 83,
        Ke: 84,
        Ji: 86,
        "8T": 87,
        AA: 88,
        qB: 92,
        "2u": 95,
      },
    ],
    2: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("HB"),
          l = P(n("K"));
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        class U {
          constructor(...n) {
            const e = this;
            if (
              (0, q.type)(n[0]) === "object" &&
              n[0].constructor &&
              n[0].constructor === this.constructor
            )
              return n[0];
            let z = (0, q.last)(n),
              P = false;
            if (!z) {
              if (((P = true), !l.default.sorted))
                (l.default.autodetect = l.default.autodetect.sort(
                  (n, e) => e.p - n.p
                )),
                  (l.default.sorted = true);
              for (let e of l.default.autodetect)
                if (((z = e.test(...n)), z)) break;
            }
            if (l.default.format[z]) {
              const U = l.default.format[z].apply(null, P ? n : n.slice(0, -1));
              e._rgb = (0, q.clip_rgb)(U);
            } else throw new Error("unknown format: " + n);
            if (e._rgb.length === 3) e._rgb.push(1);
          }
          toString() {
            if ((0, q.type)(this.hex) == "function") return this.hex();
            return `[${this._rgb.join(",")}]`;
          }
        }
        var r = (z.default = U);
      },
      {
        K: 49,
        HB: 89,
      },
    ],
    3: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = P(n("XB")),
          l = n("HL");
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const U = (...n) => new U.Color(...n);
        (U.Color = q.default), (U.version = l.version);
        var r = (z.default = U);
      },
      {
        XB: 2,
        HL: 96,
      },
    ],
    4: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        const q = {
          OrRd: [
            "#fff7ec",
            "#fee8c8",
            "#fdd49e",
            "#fdbb84",
            "#fc8d59",
            "#ef6548",
            "#d7301f",
            "#b30000",
            "#7f0000",
          ],
          PuBu: [
            "#fff7fb",
            "#ece7f2",
            "#d0d1e6",
            "#a6bddb",
            "#74a9cf",
            "#3690c0",
            "#0570b0",
            "#045a8d",
            "#023858",
          ],
          BuPu: [
            "#f7fcfd",
            "#e0ecf4",
            "#bfd3e6",
            "#9ebcda",
            "#8c96c6",
            "#8c6bb1",
            "#88419d",
            "#810f7c",
            "#4d004b",
          ],
          Oranges: [
            "#fff5eb",
            "#fee6ce",
            "#fdd0a2",
            "#fdae6b",
            "#fd8d3c",
            "#f16913",
            "#d94801",
            "#a63603",
            "#7f2704",
          ],
          BuGn: [
            "#f7fcfd",
            "#e5f5f9",
            "#ccece6",
            "#99d8c9",
            "#66c2a4",
            "#41ae76",
            "#238b45",
            "#006d2c",
            "#00441b",
          ],
          YlOrBr: [
            "#ffffe5",
            "#fff7bc",
            "#fee391",
            "#fec44f",
            "#fe9929",
            "#ec7014",
            "#cc4c02",
            "#993404",
            "#662506",
          ],
          YlGn: [
            "#ffffe5",
            "#f7fcb9",
            "#d9f0a3",
            "#addd8e",
            "#78c679",
            "#41ab5d",
            "#238443",
            "#006837",
            "#004529",
          ],
          Reds: [
            "#fff5f0",
            "#fee0d2",
            "#fcbba1",
            "#fc9272",
            "#fb6a4a",
            "#ef3b2c",
            "#cb181d",
            "#a50f15",
            "#67000d",
          ],
          RdPu: [
            "#fff7f3",
            "#fde0dd",
            "#fcc5c0",
            "#fa9fb5",
            "#f768a1",
            "#dd3497",
            "#ae017e",
            "#7a0177",
            "#49006a",
          ],
          Greens: [
            "#f7fcf5",
            "#e5f5e0",
            "#c7e9c0",
            "#a1d99b",
            "#74c476",
            "#41ab5d",
            "#238b45",
            "#006d2c",
            "#00441b",
          ],
          YlGnBu: [
            "#ffffd9",
            "#edf8b1",
            "#c7e9b4",
            "#7fcdbb",
            "#41b6c4",
            "#1d91c0",
            "#225ea8",
            "#253494",
            "#081d58",
          ],
          Purples: [
            "#fcfbfd",
            "#efedf5",
            "#dadaeb",
            "#bcbddc",
            "#9e9ac8",
            "#807dba",
            "#6a51a3",
            "#54278f",
            "#3f007d",
          ],
          GnBu: [
            "#f7fcf0",
            "#e0f3db",
            "#ccebc5",
            "#a8ddb5",
            "#7bccc4",
            "#4eb3d3",
            "#2b8cbe",
            "#0868ac",
            "#084081",
          ],
          Greys: [
            "#ffffff",
            "#f0f0f0",
            "#d9d9d9",
            "#bdbdbd",
            "#969696",
            "#737373",
            "#525252",
            "#252525",
            "#000000",
          ],
          YlOrRd: [
            "#ffffcc",
            "#ffeda0",
            "#fed976",
            "#feb24c",
            "#fd8d3c",
            "#fc4e2a",
            "#e31a1c",
            "#bd0026",
            "#800026",
          ],
          PuRd: [
            "#f7f4f9",
            "#e7e1ef",
            "#d4b9da",
            "#c994c7",
            "#df65b0",
            "#e7298a",
            "#ce1256",
            "#980043",
            "#67001f",
          ],
          Blues: [
            "#f7fbff",
            "#deebf7",
            "#c6dbef",
            "#9ecae1",
            "#6baed6",
            "#4292c6",
            "#2171b5",
            "#08519c",
            "#08306b",
          ],
          PuBuGn: [
            "#fff7fb",
            "#ece2f0",
            "#d0d1e6",
            "#a6bddb",
            "#67a9cf",
            "#3690c0",
            "#02818a",
            "#016c59",
            "#014636",
          ],
          Viridis: [
            "#440154",
            "#482777",
            "#3f4a8a",
            "#31678e",
            "#26838f",
            "#1f9d8a",
            "#6cce5a",
            "#b6de2b",
            "#fee825",
          ],
          Spectral: [
            "#9e0142",
            "#d53e4f",
            "#f46d43",
            "#fdae61",
            "#fee08b",
            "#ffffbf",
            "#e6f598",
            "#abdda4",
            "#66c2a5",
            "#3288bd",
            "#5e4fa2",
          ],
          RdYlGn: [
            "#a50026",
            "#d73027",
            "#f46d43",
            "#fdae61",
            "#fee08b",
            "#ffffbf",
            "#d9ef8b",
            "#a6d96a",
            "#66bd63",
            "#1a9850",
            "#006837",
          ],
          RdBu: [
            "#67001f",
            "#b2182b",
            "#d6604d",
            "#f4a582",
            "#fddbc7",
            "#f7f7f7",
            "#d1e5f0",
            "#92c5de",
            "#4393c3",
            "#2166ac",
            "#053061",
          ],
          PiYG: [
            "#8e0152",
            "#c51b7d",
            "#de77ae",
            "#f1b6da",
            "#fde0ef",
            "#f7f7f7",
            "#e6f5d0",
            "#b8e186",
            "#7fbc41",
            "#4d9221",
            "#276419",
          ],
          PRGn: [
            "#40004b",
            "#762a83",
            "#9970ab",
            "#c2a5cf",
            "#e7d4e8",
            "#f7f7f7",
            "#d9f0d3",
            "#a6dba0",
            "#5aae61",
            "#1b7837",
            "#00441b",
          ],
          RdYlBu: [
            "#a50026",
            "#d73027",
            "#f46d43",
            "#fdae61",
            "#fee090",
            "#ffffbf",
            "#e0f3f8",
            "#abd9e9",
            "#74add1",
            "#4575b4",
            "#313695",
          ],
          BrBG: [
            "#543005",
            "#8c510a",
            "#bf812d",
            "#dfc27d",
            "#f6e8c3",
            "#f5f5f5",
            "#c7eae5",
            "#80cdc1",
            "#35978f",
            "#01665e",
            "#003c30",
          ],
          RdGy: [
            "#67001f",
            "#b2182b",
            "#d6604d",
            "#f4a582",
            "#fddbc7",
            "#ffffff",
            "#e0e0e0",
            "#bababa",
            "#878787",
            "#4d4d4d",
            "#1a1a1a",
          ],
          PuOr: [
            "#7f3b08",
            "#b35806",
            "#e08214",
            "#fdb863",
            "#fee0b6",
            "#f7f7f7",
            "#d8daeb",
            "#b2abd2",
            "#8073ac",
            "#542788",
            "#2d004b",
          ],
          Set2: [
            "#66c2a5",
            "#fc8d62",
            "#8da0cb",
            "#e78ac3",
            "#a6d854",
            "#ffd92f",
            "#e5c494",
            "#b3b3b3",
          ],
          Accent: [
            "#7fc97f",
            "#beaed4",
            "#fdc086",
            "#ffff99",
            "#386cb0",
            "#f0027f",
            "#bf5b17",
            "#666666",
          ],
          Set1: [
            "#e41a1c",
            "#377eb8",
            "#4daf4a",
            "#984ea3",
            "#ff7f00",
            "#ffff33",
            "#a65628",
            "#f781bf",
            "#999999",
          ],
          Set3: [
            "#8dd3c7",
            "#ffffb3",
            "#bebada",
            "#fb8072",
            "#80b1d3",
            "#fdb462",
            "#b3de69",
            "#fccde5",
            "#d9d9d9",
            "#bc80bd",
            "#ccebc5",
            "#ffed6f",
          ],
          Dark2: [
            "#1b9e77",
            "#d95f02",
            "#7570b3",
            "#e7298a",
            "#66a61e",
            "#e6ab02",
            "#a6761d",
            "#666666",
          ],
          Paired: [
            "#a6cee3",
            "#1f78b4",
            "#b2df8a",
            "#33a02c",
            "#fb9a99",
            "#e31a1c",
            "#fdbf6f",
            "#ff7f00",
            "#cab2d6",
            "#6a3d9a",
            "#ffff99",
            "#b15928",
          ],
          Pastel2: [
            "#b3e2cd",
            "#fdcdac",
            "#cbd5e8",
            "#f4cae4",
            "#e6f5c9",
            "#fff2ae",
            "#f1e2cc",
            "#cccccc",
          ],
          Pastel1: [
            "#fbb4ae",
            "#b3cde3",
            "#ccebc5",
            "#decbe4",
            "#fed9a6",
            "#ffffcc",
            "#e5d8bd",
            "#fddaec",
            "#f2f2f2",
          ],
        };
        for (let n of Object.keys(q)) q[n.toLowerCase()] = q[n];
        var l = (z.default = q);
      },
      {},
    ],
    5: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        const q = {
          aliceblue: "#f0f8ff",
          antiquewhite: "#faebd7",
          aqua: "#00ffff",
          aquamarine: "#7fffd4",
          azure: "#f0ffff",
          beige: "#f5f5dc",
          bisque: "#ffe4c4",
          black: "#000000",
          blanchedalmond: "#ffebcd",
          blue: "#0000ff",
          blueviolet: "#8a2be2",
          brown: "#a52a2a",
          burlywood: "#deb887",
          cadetblue: "#5f9ea0",
          chartreuse: "#7fff00",
          chocolate: "#d2691e",
          coral: "#ff7f50",
          cornflowerblue: "#6495ed",
          cornsilk: "#fff8dc",
          crimson: "#dc143c",
          cyan: "#00ffff",
          darkblue: "#00008b",
          darkcyan: "#008b8b",
          darkgoldenrod: "#b8860b",
          darkgray: "#a9a9a9",
          darkgreen: "#006400",
          darkgrey: "#a9a9a9",
          darkkhaki: "#bdb76b",
          darkmagenta: "#8b008b",
          darkolivegreen: "#556b2f",
          darkorange: "#ff8c00",
          darkorchid: "#9932cc",
          darkred: "#8b0000",
          darksalmon: "#e9967a",
          darkseagreen: "#8fbc8f",
          darkslateblue: "#483d8b",
          darkslategray: "#2f4f4f",
          darkslategrey: "#2f4f4f",
          darkturquoise: "#00ced1",
          darkviolet: "#9400d3",
          deeppink: "#ff1493",
          deepskyblue: "#00bfff",
          dimgray: "#696969",
          dimgrey: "#696969",
          dodgerblue: "#1e90ff",
          firebrick: "#b22222",
          floralwhite: "#fffaf0",
          forestgreen: "#228b22",
          fuchsia: "#ff00ff",
          gainsboro: "#dcdcdc",
          ghostwhite: "#f8f8ff",
          gold: "#ffd700",
          goldenrod: "#daa520",
          gray: "#808080",
          green: "#008000",
          greenyellow: "#adff2f",
          grey: "#808080",
          honeydew: "#f0fff0",
          hotpink: "#ff69b4",
          indianred: "#cd5c5c",
          indigo: "#4b0082",
          ivory: "#fffff0",
          khaki: "#f0e68c",
          laserlemon: "#ffff54",
          lavender: "#e6e6fa",
          lavenderblush: "#fff0f5",
          lawngreen: "#7cfc00",
          lemonchiffon: "#fffacd",
          lightblue: "#add8e6",
          lightcoral: "#f08080",
          lightcyan: "#e0ffff",
          lightgoldenrod: "#fafad2",
          lightgoldenrodyellow: "#fafad2",
          lightgray: "#d3d3d3",
          lightgreen: "#90ee90",
          lightgrey: "#d3d3d3",
          lightpink: "#ffb6c1",
          lightsalmon: "#ffa07a",
          lightseagreen: "#20b2aa",
          lightskyblue: "#87cefa",
          lightslategray: "#778899",
          lightslategrey: "#778899",
          lightsteelblue: "#b0c4de",
          lightyellow: "#ffffe0",
          lime: "#00ff00",
          limegreen: "#32cd32",
          linen: "#faf0e6",
          magenta: "#ff00ff",
          maroon: "#800000",
          maroon2: "#7f0000",
          maroon3: "#b03060",
          mediumaquamarine: "#66cdaa",
          mediumblue: "#0000cd",
          mediumorchid: "#ba55d3",
          mediumpurple: "#9370db",
          mediumseagreen: "#3cb371",
          mediumslateblue: "#7b68ee",
          mediumspringgreen: "#00fa9a",
          mediumturquoise: "#48d1cc",
          mediumvioletred: "#c71585",
          midnightblue: "#191970",
          mintcream: "#f5fffa",
          mistyrose: "#ffe4e1",
          moccasin: "#ffe4b5",
          navajowhite: "#ffdead",
          navy: "#000080",
          oldlace: "#fdf5e6",
          olive: "#808000",
          olivedrab: "#6b8e23",
          orange: "#ffa500",
          orangered: "#ff4500",
          orchid: "#da70d6",
          palegoldenrod: "#eee8aa",
          palegreen: "#98fb98",
          paleturquoise: "#afeeee",
          palevioletred: "#db7093",
          papayawhip: "#ffefd5",
          peachpuff: "#ffdab9",
          peru: "#cd853f",
          pink: "#ffc0cb",
          plum: "#dda0dd",
          powderblue: "#b0e0e6",
          purple: "#800080",
          purple2: "#7f007f",
          purple3: "#a020f0",
          rebeccapurple: "#663399",
          red: "#ff0000",
          rosybrown: "#bc8f8f",
          royalblue: "#4169e1",
          saddlebrown: "#8b4513",
          salmon: "#fa8072",
          sandybrown: "#f4a460",
          seagreen: "#2e8b57",
          seashell: "#fff5ee",
          sienna: "#a0522d",
          silver: "#c0c0c0",
          skyblue: "#87ceeb",
          slateblue: "#6a5acd",
          slategray: "#708090",
          slategrey: "#708090",
          snow: "#fffafa",
          springgreen: "#00ff7f",
          steelblue: "#4682b4",
          tan: "#d2b48c",
          teal: "#008080",
          thistle: "#d8bfd8",
          tomato: "#ff6347",
          turquoise: "#40e0d0",
          violet: "#ee82ee",
          wheat: "#f5deb3",
          white: "#ffffff",
          whitesmoke: "#f5f5f5",
          yellow: "#ffff00",
          yellowgreen: "#9acd32",
        };
        var l = (z.default = q);
      },
      {},
    ],
    6: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = P(n("wQ")),
          l = n("6v");
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const { pow: U, sqrt: r, PI: F, cos: a, sin: t, atan2: b } = Math;
        var p = (n, e = "lrgb", z = null) => {
          const l = n.length;
          if (!z) z = Array.from(new Array(l)).map(() => 1);
          const P =
            l /
            z.reduce(function (n, e) {
              return n + e;
            });
          if (
            (z.forEach((n, e) => {
              z[e] *= P;
            }),
            (n = n.map((n) => new q.default(n))),
            e === "lrgb")
          )
            return y(n, z);
          const U = n.shift(),
            r = U.get(e),
            p = [];
          let X = 0,
            O = 0;
          for (let n = 0; n < r.length; n++)
            if (
              ((r[n] = (r[n] || 0) * z[0]),
              p.push(isNaN(r[n]) ? 0 : z[0]),
              e.charAt(n) === "h" && !isNaN(r[n]))
            ) {
              const e = (r[n] / 180) * F;
              (X += a(e) * z[0]), (O += t(e) * z[0]);
            }
          let u = U.alpha() * z[0];
          n.forEach((n, q) => {
            const l = n.get(e);
            u += n.alpha() * z[q + 1];
            for (let n = 0; n < r.length; n++)
              if (!isNaN(l[n]))
                if (((p[n] += z[q + 1]), e.charAt(n) === "h")) {
                  const e = (l[n] / 180) * F;
                  (X += a(e) * z[q + 1]), (O += t(e) * z[q + 1]);
                } else r[n] += l[n] * z[q + 1];
          });
          for (let n = 0; n < r.length; n++)
            if (e.charAt(n) === "h") {
              let e = (b(O / p[n], X / p[n]) / F) * 180;
              while (e < 0) e += 360;
              while (e >= 360) e -= 360;
              r[n] = e;
            } else r[n] = r[n] / p[n];
          return (u /= l), new q.default(r, e).alpha(u > 0.99999 ? 1 : u, true);
        };
        z.default = p;
        const y = (n, e) => {
          const z = n.length,
            P = [0, 0, 0, 0];
          for (let q = 0; q < n.length; q++) {
            const l = n[q],
              r = e[q] / z,
              F = l._rgb;
            (P[0] += U(F[0], 2) * r),
              (P[1] += U(F[1], 2) * r),
              (P[2] += U(F[2], 2) * r),
              (P[3] += F[3] * r);
          }
          if (
            ((P[0] = r(P[0])),
            (P[1] = r(P[1])),
            (P[2] = r(P[2])),
            P[3] > 0.9999999)
          )
            P[3] = 1;
          return new q.default((0, l.clip_rgb)(P));
        };
      },
      {
        wQ: 2,
        "6v": 89,
      },
    ],
    7: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = P(n("wQ"));
        n("DK");
        var l = P(n("Rb"));
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const U = function (n) {
            let e = [1, 1];
            for (let z = 1; z < n; z++) {
              let n = [1];
              for (let z = 1; z <= e.length; z++) n[z] = (e[z] || 0) + e[z - 1];
              e = n;
            }
            return e;
          },
          r = function (n) {
            let e, z, l, P;
            if (((n = n.map((n) => new q.default(n))), n.length === 2))
              ([z, l] = n.map((n) => n.lab())),
                (e = function (n) {
                  const e = [0, 1, 2].map((e) => z[e] + n * (l[e] - z[e]));
                  return new q.default(e, "lab");
                });
            else if (n.length === 3)
              ([z, l, P] = n.map((n) => n.lab())),
                (e = function (n) {
                  const e = [0, 1, 2].map(
                    (e) =>
                      (1 - n) * (1 - n) * z[e] +
                      2 * (1 - n) * n * l[e] +
                      n * n * P[e]
                  );
                  return new q.default(e, "lab");
                });
            else if (n.length === 4) {
              let U;
              ([z, l, P, U] = n.map((n) => n.lab())),
                (e = function (n) {
                  const e = [0, 1, 2].map(
                    (e) =>
                      (1 - n) * (1 - n) * (1 - n) * z[e] +
                      3 * (1 - n) * (1 - n) * n * l[e] +
                      3 * (1 - n) * n * n * P[e] +
                      n * n * n * U[e]
                  );
                  return new q.default(e, "lab");
                });
            } else if (n.length >= 5) {
              let z, l, P;
              (z = n.map((n) => n.lab())),
                (P = n.length - 1),
                (l = U(P)),
                (e = function (n) {
                  const e = 1 - n,
                    U = [0, 1, 2].map((q) =>
                      z.reduce(
                        (z, U, r) => z + l[r] * e ** (P - r) * n ** r * U[q],
                        0
                      )
                    );
                  return new q.default(U, "lab");
                });
            } else
              throw new RangeError(
                "No point in running bezier with only one color."
              );
            return e;
          };
        var F = (n) => {
          const e = r(n);
          return (e.scale = () => (0, l.default)(e)), e;
        };
        z.default = F;
      },
      {
        wQ: 2,
        DK: 50,
        Rb: 12,
      },
    ],
    8: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0),
          n("aR");
        var q = l(n("J5"));
        function l(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const P = (n, e, z) => {
            if (!P[z]) throw new Error("unknown blend mode " + z);
            return P[z](n, e);
          },
          U = (n) => (e, z) => {
            const l = (0, q.default)(z).rgb(),
              P = (0, q.default)(e).rgb();
            return q.default.rgb(n(l, P));
          },
          r = (n) => (e, z) => {
            const q = [];
            return (
              (q[0] = n(e[0], z[0])),
              (q[1] = n(e[1], z[1])),
              (q[2] = n(e[2], z[2])),
              q
            );
          },
          F = (n) => n,
          a = (n, e) => (n * e) / 255,
          t = (n, e) => (n > e ? e : n),
          b = (n, e) => (n > e ? n : e),
          p = (n, e) => 255 * (1 - (1 - n / 255) * (1 - e / 255)),
          y = (n, e) =>
            e < 128
              ? (2 * n * e) / 255
              : 255 * (1 - 2 * (1 - n / 255) * (1 - e / 255)),
          X = (n, e) => 255 * (1 - (1 - e / 255) / (n / 255)),
          O = (n, e) => {
            if (n === 255) return 255;
            return (n = (255 * (e / 255)) / (1 - n / 255)), n > 255 ? 255 : n;
          };
        (P.normal = U(r(F))),
          (P.multiply = U(r(a))),
          (P.screen = U(r(p))),
          (P.overlay = U(r(y))),
          (P.darken = U(r(t))),
          (P.lighten = U(r(b))),
          (P.dodge = U(r(O))),
          (P.burn = U(r(X)));
        var u = (z.default = P);
      },
      {
        J5: 3,
        aR: 70,
      },
    ],
    9: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = a);
        var q = n("6v"),
          l = P(n("J5"));
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const { pow: U, sin: r, cos: F } = Math;
        function a(n = 300, e = -1.5, z = 1, P = 1, a = [0, 1]) {
          let t = 0,
            b;
          if ((0, q.type)(a) === "array") b = a[1] - a[0];
          else (b = 0), (a = [a, a]);
          const p = function (p) {
            const y = q.TWOPI * ((n + 120) / 360 + e * p),
              X = U(a[0] + b * p, P),
              O = t !== 0 ? z[0] + p * t : z,
              u = (O * X * (1 - X)) / 2,
              d = F(y),
              m = r(y),
              W = X + u * (-0.14861 * d + 1.78277 * m),
              D = X + u * (-0.29227 * d - 0.90649 * m),
              L = X + u * (+1.97294 * d);
            return (0, l.default)(
              (0, q.clip_rgb)([W * 255, D * 255, L * 255, 1])
            );
          };
          return (
            (p.start = function (e) {
              if (e == null) return n;
              return (n = e), p;
            }),
            (p.rotations = function (n) {
              if (n == null) return e;
              return (e = n), p;
            }),
            (p.gamma = function (n) {
              if (n == null) return P;
              return (P = n), p;
            }),
            (p.hue = function (n) {
              if (n == null) return z;
              if (((z = n), (0, q.type)(z) === "array")) {
                if (((t = z[1] - z[0]), t === 0)) z = z[1];
              } else t = 0;
              return p;
            }),
            (p.lightness = function (n) {
              if (n == null) return a;
              if ((0, q.type)(n) === "array") (a = n), (b = n[1] - n[0]);
              else (a = [n, n]), (b = 0);
              return p;
            }),
            (p.scale = () => l.default.scale(p)),
            p.hue(z),
            p
          );
        }
      },
      {
        J5: 3,
        "6v": 89,
      },
    ],
    10: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = U(n("wQ")),
          l = n("6v"),
          P = U(n("y9"));
        function U(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        var r = (n, e, z = 0.5, ...U) => {
          let r = U[0] || "lrgb";
          if (!P.default[r] && !U.length) r = Object.keys(P.default)[0];
          if (!P.default[r])
            throw new Error(`interpolation mode ${r} is not defined`);
          if ((0, l.type)(n) !== "object") n = new q.default(n);
          if ((0, l.type)(e) !== "object") e = new q.default(e);
          return P.default[r](n, e, z).alpha(
            n.alpha() + z * (e.alpha() - n.alpha())
          );
        };
        z.default = r;
      },
      {
        wQ: 2,
        y9: 18,
        "6v": 89,
      },
    ],
    11: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = l(n("wQ"));
        function l(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const P = "0123456789abcdef",
          { floor: U, random: r } = Math;
        var F = () => {
          let n = "#";
          for (let e = 0; e < 6; e++) n += P.charAt(U(r() * 16));
          return new q.default(n, "hex");
        };
        z.default = F;
      },
      {
        wQ: 2,
      },
    ],
    12: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = r);
        var q = P(n("J5")),
          l = n("6v");
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const { pow: U } = Math;
        function r(n) {
          let e = "rgb",
            z = (0, q.default)("#ccc"),
            P = 0,
            r = [0, 1],
            a = [],
            t = [0, 0],
            b = false,
            p = [],
            y = false,
            X = 0,
            O = 1,
            u = false,
            d = {},
            m = true,
            W = 1;
          const D = function (n) {
              if (
                ((n = n || ["#fff", "#000"]),
                n &&
                  (0, l.type)(n) === "string" &&
                  q.default.brewer &&
                  q.default.brewer[n.toLowerCase()])
              )
                n = q.default.brewer[n.toLowerCase()];
              if ((0, l.type)(n) === "array") {
                if (n.length === 1) n = [n[0], n[0]];
                n = n.slice(0);
                for (let e = 0; e < n.length; e++) n[e] = (0, q.default)(n[e]);
                a.length = 0;
                for (let e = 0; e < n.length; e++) a.push(e / (n.length - 1));
              }
              return J(), (p = n);
            },
            L = function (n) {
              if (b != null) {
                const e = b.length - 1;
                let z = 0;
                while (z < e && n >= b[z]) z++;
                return z - 1;
              }
              return 0;
            };
          let M = (n) => n,
            g = (n) => n;
          const E = function (n, P) {
            let r, F;
            if (P == null) P = false;
            if (isNaN(n) || n === null) return z;
            if (!P)
              if (b && b.length > 2) {
                const e = L(n);
                F = e / (b.length - 2);
              } else if (O !== X) F = (n - X) / (O - X);
              else F = 1;
            else F = n;
            if (((F = g(F)), !P)) F = M(F);
            if (W !== 1) F = U(F, W);
            (F = t[0] + F * (1 - t[0] - t[1])), (F = (0, l.limit)(F, 0, 1));
            const y = Math.floor(F * 1e4);
            if (m && d[y]) r = d[y];
            else {
              if ((0, l.type)(p) === "array")
                for (let n = 0; n < a.length; n++) {
                  const z = a[n];
                  if (F <= z) {
                    r = p[n];
                    break;
                  }
                  if (F >= z && n === a.length - 1) {
                    r = p[n];
                    break;
                  }
                  if (F > z && F < a[n + 1]) {
                    (F = (F - z) / (a[n + 1] - z)),
                      (r = q.default.interpolate(p[n], p[n + 1], F, e));
                    break;
                  }
                }
              else if ((0, l.type)(p) === "function") r = p(F);
              if (m) d[y] = r;
            }
            return r;
          };
          var J = () => (d = {});
          D(n);
          const i = function (n) {
            const e = (0, q.default)(E(n));
            if (y && e[y]) return e[y]();
            else return e;
          };
          return (
            (i.classes = function (n) {
              if (n != null) {
                if ((0, l.type)(n) === "array")
                  (b = n), (r = [n[0], n[n.length - 1]]);
                else {
                  const e = q.default.analyze(r);
                  if (n === 0) b = [e.min, e.max];
                  else b = q.default.limits(e, "e", n);
                }
                return i;
              }
              return b;
            }),
            (i.domain = function (n) {
              if (!arguments.length) return r;
              (X = n[0]), (O = n[n.length - 1]), (a = []);
              const e = p.length;
              if (n.length === e && X !== O)
                for (let e of Array.from(n)) a.push((e - X) / (O - X));
              else {
                for (let n = 0; n < e; n++) a.push(n / (e - 1));
                if (n.length > 2) {
                  const e = n.map((e, z) => z / (n.length - 1)),
                    z = n.map((n) => (n - X) / (O - X));
                  if (!z.every((n, z) => e[z] === n))
                    g = (n) => {
                      if (n <= 0 || n >= 1) return n;
                      let q = 0;
                      while (n >= z[q + 1]) q++;
                      const l = (n - z[q]) / (z[q + 1] - z[q]),
                        P = e[q] + l * (e[q + 1] - e[q]);
                      return P;
                    };
                }
              }
              return (r = [X, O]), i;
            }),
            (i.mode = function (n) {
              if (!arguments.length) return e;
              return (e = n), J(), i;
            }),
            (i.range = function (n, e) {
              return D(n, e), i;
            }),
            (i.out = function (n) {
              return (y = n), i;
            }),
            (i.spread = function (n) {
              if (!arguments.length) return P;
              return (P = n), i;
            }),
            (i.correctLightness = function (n) {
              if (n == null) n = true;
              if (((u = n), J(), u))
                M = function (n) {
                  const e = E(0, true).lab()[0],
                    z = E(1, true).lab()[0],
                    q = e > z;
                  let l = E(n, true).lab()[0];
                  const P = e + (z - e) * n;
                  let U = l - P,
                    r = 0,
                    F = 1,
                    a = 20;
                  while (Math.abs(U) > 0.01 && a-- > 0)
                    (function () {
                      if (q) U *= -1;
                      if (U < 0) (r = n), (n += (F - n) * 0.5);
                      else (F = n), (n += (r - n) * 0.5);
                      (l = E(n, true).lab()[0]), (U = l - P);
                    })();
                  return n;
                };
              else M = (n) => n;
              return i;
            }),
            (i.padding = function (n) {
              if (n != null) {
                if ((0, l.type)(n) === "number") n = [n, n];
                return (t = n), i;
              } else return t;
            }),
            (i.colors = function (e, z) {
              if (arguments.length < 2) z = "hex";
              let l = [];
              if (arguments.length === 0) l = p.slice(0);
              else if (e === 1) l = [i(0.5)];
              else if (e > 1) {
                const n = r[0],
                  z = r[1] - n;
                l = F(0, e, false).map((q) => i(n + (q / (e - 1)) * z));
              } else {
                n = [];
                let e = [];
                if (b && b.length > 2)
                  for (
                    let n = 1, z = b.length, q = 1 <= z;
                    q ? n < z : n > z;
                    q ? n++ : n--
                  )
                    e.push((b[n - 1] + b[n]) * 0.5);
                else e = r;
                l = e.map((n) => i(n));
              }
              if (q.default[z]) l = l.map((n) => n[z]());
              return l;
            }),
            (i.cache = function (n) {
              if (n != null) return (m = n), i;
              else return m;
            }),
            (i.gamma = function (n) {
              if (n != null) return (W = n), i;
              else return W;
            }),
            (i.nodata = function (n) {
              if (n != null) return (z = (0, q.default)(n)), i;
              else return z;
            }),
            i
          );
        }
        function F(n, e, z) {
          let q = [],
            l = n < e,
            P = !z ? e : l ? e + 1 : e - 1;
          for (let e = n; l ? e < P : e > P; l ? e++ : e--) q.push(e);
          return q;
        }
      },
      {
        J5: 3,
        "6v": 89,
      },
    ],
    13: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = l(n("wQ"));
        function l(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        var P = (n, e, z, l) => {
          let P, U, r, F, a, t, b, p, y, X, O, u;
          if (l === "hsl") (P = n.hsl()), (U = e.hsl());
          else if (l === "hsv") (P = n.hsv()), (U = e.hsv());
          else if (l === "hcg") (P = n.hcg()), (U = e.hcg());
          else if (l === "hsi") (P = n.hsi()), (U = e.hsi());
          else if (l === "lch" || l === "hcl")
            (l = "hcl"), (P = n.hcl()), (U = e.hcl());
          else if (l === "oklch")
            (P = n.oklch().reverse()), (U = e.oklch().reverse());
          if (l.substr(0, 1) === "h" || l === "oklch")
            ([r, a, b] = P), ([F, t, p] = U);
          if (!isNaN(r) && !isNaN(F)) {
            if (F > r && F - r > 180) u = F - (r + 360);
            else if (F < r && r - F > 180) u = F + 360 - r;
            else u = F - r;
            X = r + z * u;
          } else if (!isNaN(r)) {
            if (((X = r), (p == 1 || p == 0) && l != "hsv")) y = a;
          } else if (!isNaN(F)) {
            if (((X = F), (b == 1 || b == 0) && l != "hsv")) y = t;
          } else X = Number.NaN;
          if (y === void 0) y = a + z * (t - a);
          return (
            (O = b + z * (p - b)),
            l === "oklch"
              ? new q.default([O, y, X], l)
              : new q.default([X, y, O], l)
          );
        };
        z.default = P;
      },
      {
        wQ: 2,
      },
    ],
    14: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0),
          n("2A");
        var q = P(n("6X")),
          l = P(n("hi"));
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const U = (n, e, z) => (0, q.default)(n, e, z, "hcg");
        l.default.hcg = U;
        var r = (z.default = U);
      },
      {
        "2A": 35,
        "6X": 13,
        hi: 18,
      },
    ],
    15: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0),
          n("sL");
        var q = P(n("6X")),
          l = P(n("hi"));
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const U = (n, e, z) => (0, q.default)(n, e, z, "hsi");
        l.default.hsi = U;
        var r = (z.default = U);
      },
      {
        sL: 41,
        "6X": 13,
        hi: 18,
      },
    ],
    16: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0),
          n("18");
        var q = P(n("6X")),
          l = P(n("hi"));
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const U = (n, e, z) => (0, q.default)(n, e, z, "hsl");
        l.default.hsl = U;
        var r = (z.default = U);
      },
      {
        18: 44,
        "6X": 13,
        hi: 18,
      },
    ],
    17: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0),
          n("yx");
        var q = P(n("6X")),
          l = P(n("hi"));
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const U = (n, e, z) => (0, q.default)(n, e, z, "hsv");
        l.default.hsv = U;
        var r = (z.default = U);
      },
      {
        yx: 47,
        "6X": 13,
        hi: 18,
      },
    ],
    18: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = (z.default = {});
      },
      {},
    ],
    19: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0),
          n("DK");
        var q = P(n("hi")),
          l = P(n("wQ"));
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const U = (n, e, z) => {
          const q = n.lab(),
            P = e.lab();
          return new l.default(
            q[0] + z * (P[0] - q[0]),
            q[1] + z * (P[1] - q[1]),
            q[2] + z * (P[2] - q[2]),
            "lab"
          );
        };
        q.default.lab = U;
        var r = (z.default = U);
      },
      {
        wQ: 2,
        DK: 50,
        hi: 18,
      },
    ],
    20: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0),
          n("N8");
        var q = P(n("6X")),
          l = P(n("hi"));
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const U = (n, e, z) => (0, q.default)(n, e, z, "lch");
        (l.default.lch = U), (l.default.hcl = U);
        var r = (z.default = U);
      },
      {
        N8: 55,
        "6X": 13,
        hi: 18,
      },
    ],
    21: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = P(n("wQ")),
          l = P(n("hi"));
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const { sqrt: U, pow: r } = Math,
          F = (n, e, z) => {
            const [l, P, F] = n._rgb,
              [a, t, b] = e._rgb;
            return new q.default(
              U(r(l, 2) * (1 - z) + r(a, 2) * z),
              U(r(P, 2) * (1 - z) + r(t, 2) * z),
              U(r(F, 2) * (1 - z) + r(b, 2) * z),
              "rgb"
            );
          };
        l.default.lrgb = F;
        var a = (z.default = F);
      },
      {
        wQ: 2,
        hi: 18,
      },
    ],
    22: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0),
          n("Oj");
        var q = P(n("hi")),
          l = P(n("wQ"));
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const U = (n, e, z) => {
          const q = n.num(),
            P = e.num();
          return new l.default(q + z * (P - q), "num");
        };
        q.default.num = U;
        var r = (z.default = U);
      },
      {
        wQ: 2,
        Oj: 61,
        hi: 18,
      },
    ],
    23: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0),
          n("dd");
        var q = P(n("hi")),
          l = P(n("wQ"));
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const U = (n, e, z) => {
          const q = n.oklab(),
            P = e.oklab();
          return new l.default(
            q[0] + z * (P[0] - q[0]),
            q[1] + z * (P[1] - q[1]),
            q[2] + z * (P[2] - q[2]),
            "oklab"
          );
        };
        q.default.oklab = U;
        var r = (z.default = U);
      },
      {
        wQ: 2,
        dd: 64,
        hi: 18,
      },
    ],
    24: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0),
          n("N8");
        var q = P(n("6X")),
          l = P(n("hi"));
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const U = (n, e, z) => (0, q.default)(n, e, z, "oklch");
        l.default.oklch = U;
        var r = (z.default = U);
      },
      {
        N8: 55,
        "6X": 13,
        hi: 18,
      },
    ],
    25: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = P(n("wQ")),
          l = P(n("hi"));
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const U = (n, e, z) => {
          const l = n._rgb,
            P = e._rgb;
          return new q.default(
            l[0] + z * (P[0] - l[0]),
            l[1] + z * (P[1] - l[1]),
            l[2] + z * (P[2] - l[2]),
            "rgb"
          );
        };
        l.default.rgb = U;
        var r = (z.default = U);
      },
      {
        wQ: 2,
        hi: 18,
      },
    ],
    26: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("Yh");
        const l = (...n) => {
          n = (0, q.unpack)(n, "cmyk");
          const [e, z, l, P] = n,
            U = n.length > 4 ? n[4] : 1;
          if (P === 1) return [0, 0, 0, U];
          return [
            e >= 1 ? 0 : 255 * (1 - e) * (1 - P),
            z >= 1 ? 0 : 255 * (1 - z) * (1 - P),
            l >= 1 ? 0 : 255 * (1 - l) * (1 - P),
            U,
          ];
        };
        var P = (z.default = l);
      },
      {
        Yh: 89,
      },
    ],
    27: [
      function (n, e, z) {
        "use strict";
        var q = a(n("4W")),
          l = a(n("Pj")),
          P = a(n("tc")),
          U = n("Yh"),
          r = a(n("k6")),
          F = a(n("85"));
        function a(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        (l.default.prototype.cmyk = function () {
          return (0, F.default)(this._rgb);
        }),
          (q.default.cmyk = (...n) => new l.default(...n, "cmyk")),
          (P.default.format.cmyk = r.default),
          P.default.autodetect.push({
            p: 2,
            test: (...n) => {
              if (
                ((n = (0, U.unpack)(n, "cmyk")),
                (0, U.type)(n) === "array" && n.length === 4)
              )
                return "cmyk";
            },
          });
      },
      {
        Pj: 2,
        "4W": 3,
        Yh: 89,
        tc: 49,
        k6: 26,
        85: 28,
      },
    ],
    28: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("Yh");
        const { max: l } = Math,
          P = (...n) => {
            let [e, z, P] = (0, q.unpack)(n, "rgb");
            (e /= 255), (z /= 255), (P /= 255);
            const U = 1 - l(e, l(z, P)),
              r = U < 1 ? 1 / (1 - U) : 0,
              F = (1 - e - U) * r,
              a = (1 - z - U) * r,
              t = (1 - P - U) * r;
            return [F, a, t, U];
          };
        var U = (z.default = P);
      },
      {
        Yh: 89,
      },
    ],
    29: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = P(n("TB")),
          l = P(n("tc"));
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const U = /^rgb\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*\)$/,
          r =
            /^rgba\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*([01]|[01]?\.\d+)\)$/,
          F =
            /^rgb\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/,
          a =
            /^rgba\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/,
          t =
            /^hsl\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/,
          b =
            /^hsla\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/,
          { round: p } = Math,
          y = (n) => {
            let e;
            if (((n = n.toLowerCase().trim()), l.default.format.named))
              try {
                return l.default.format.named(n);
              } catch (n) {}
            if ((e = n.match(U))) {
              const n = e.slice(1, 4);
              for (let e = 0; e < 3; e++) n[e] = +n[e];
              return (n[3] = 1), n;
            }
            if ((e = n.match(r))) {
              const n = e.slice(1, 5);
              for (let e = 0; e < 4; e++) n[e] = +n[e];
              return n;
            }
            if ((e = n.match(F))) {
              const n = e.slice(1, 4);
              for (let e = 0; e < 3; e++) n[e] = p(n[e] * 2.55);
              return (n[3] = 1), n;
            }
            if ((e = n.match(a))) {
              const n = e.slice(1, 5);
              for (let e = 0; e < 3; e++) n[e] = p(n[e] * 2.55);
              return (n[3] = +n[3]), n;
            }
            if ((e = n.match(t))) {
              const n = e.slice(1, 4);
              (n[1] *= 0.01), (n[2] *= 0.01);
              const z = (0, q.default)(n);
              return (z[3] = 1), z;
            }
            if ((e = n.match(b))) {
              const n = e.slice(1, 4);
              (n[1] *= 0.01), (n[2] *= 0.01);
              const z = (0, q.default)(n);
              return (z[3] = +e[4]), z;
            }
          };
        y.test = (n) =>
          U.test(n) ||
          r.test(n) ||
          F.test(n) ||
          a.test(n) ||
          t.test(n) ||
          b.test(n);
        var X = (z.default = y);
      },
      {
        TB: 43,
        tc: 49,
      },
    ],
    30: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("Yh");
        const l = (n) => Math.round(n * 100) / 100,
          P = (...n) => {
            const e = (0, q.unpack)(n, "hsla");
            let z = (0, q.last)(n) || "lsa";
            if (
              ((e[0] = l(e[0] || 0)),
              (e[1] = l(e[1] * 100) + "%"),
              (e[2] = l(e[2] * 100) + "%"),
              z === "hsla" || (e.length > 3 && e[3] < 1))
            )
              (e[3] = e.length > 3 ? e[3] : 1), (z = "hsla");
            else e.length = 3;
            return `${z}(${e.join(",")})`;
          };
        var U = (z.default = P);
      },
      {
        Yh: 89,
      },
    ],
    31: [
      function (n, e, z) {
        "use strict";
        var q = a(n("4W")),
          l = a(n("Pj")),
          P = a(n("tc")),
          U = n("Yh"),
          r = a(n("1H")),
          F = a(n("At"));
        function a(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        (l.default.prototype.css = function (n) {
          return (0, r.default)(this._rgb, n);
        }),
          (q.default.css = (...n) => new l.default(...n, "css")),
          (P.default.format.css = F.default),
          P.default.autodetect.push({
            p: 5,
            test: (n, ...e) => {
              if (!e.length && (0, U.type)(n) === "string" && F.default.test(n))
                return "css";
            },
          });
      },
      {
        Pj: 2,
        "4W": 3,
        Yh: 89,
        tc: 49,
        At: 29,
        "1H": 32,
      },
    ],
    32: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("Yh"),
          l = U(n("ls")),
          P = U(n("K5"));
        function U(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const { round: r } = Math,
          F = (...n) => {
            const e = (0, q.unpack)(n, "rgba");
            let z = (0, q.last)(n) || "rgb";
            if (z.substr(0, 3) == "hsl")
              return (0, l.default)((0, P.default)(e), z);
            if (
              ((e[0] = r(e[0])),
              (e[1] = r(e[1])),
              (e[2] = r(e[2])),
              z === "rgba" || (e.length > 3 && e[3] < 1))
            )
              (e[3] = e.length > 3 ? e[3] : 1), (z = "rgba");
            return `${z}(${e.slice(0, z === "rgb" ? 3 : 4).join(",")})`;
          };
        var a = (z.default = F);
      },
      {
        Yh: 89,
        K5: 45,
        ls: 30,
      },
    ],
    33: [
      function (n, e, z) {
        "use strict";
        var q = r(n("Pj")),
          l = r(n("4W")),
          P = r(n("tc")),
          U = n("Yh");
        function r(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        (P.default.format.gl = (...n) => {
          const e = (0, U.unpack)(n, "rgba");
          return (e[0] *= 255), (e[1] *= 255), (e[2] *= 255), e;
        }),
          (l.default.gl = (...n) => new q.default(...n, "gl")),
          (q.default.prototype.gl = function () {
            const n = this._rgb;
            return [n[0] / 255, n[1] / 255, n[2] / 255, n[3]];
          });
      },
      {
        Pj: 2,
        "4W": 3,
        Yh: 89,
        tc: 49,
      },
    ],
    34: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("Yh");
        const { floor: l } = Math,
          P = (...n) => {
            n = (0, q.unpack)(n, "hcg");
            let [e, z, P] = n,
              U,
              r,
              F;
            P *= 255;
            const a = z * 255;
            if (z === 0) U = r = F = P;
            else {
              if (e === 360) e = 0;
              if (e > 360) e -= 360;
              if (e < 0) e += 360;
              e /= 60;
              const n = l(e),
                q = e - n,
                t = P * (1 - z),
                b = t + a * (1 - q),
                p = t + a * q,
                y = t + a;
              switch (n) {
                case 0:
                  [U, r, F] = [y, p, t];
                  break;

                case 1:
                  [U, r, F] = [b, y, t];
                  break;

                case 2:
                  [U, r, F] = [t, y, p];
                  break;

                case 3:
                  [U, r, F] = [t, b, y];
                  break;

                case 4:
                  [U, r, F] = [p, t, y];
                  break;

                case 5:
                  [U, r, F] = [y, t, b];
                  break;
              }
            }
            return [U, r, F, n.length > 3 ? n[3] : 1];
          };
        var U = (z.default = P);
      },
      {
        Yh: 89,
      },
    ],
    35: [
      function (n, e, z) {
        "use strict";
        var q = n("Yh"),
          l = a(n("4W")),
          P = a(n("Pj")),
          U = a(n("tc")),
          r = a(n("gA")),
          F = a(n("9c"));
        function a(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        (P.default.prototype.hcg = function () {
          return (0, F.default)(this._rgb);
        }),
          (l.default.hcg = (...n) => new P.default(...n, "hcg")),
          (U.default.format.hcg = r.default),
          U.default.autodetect.push({
            p: 1,
            test: (...n) => {
              if (
                ((n = (0, q.unpack)(n, "hcg")),
                (0, q.type)(n) === "array" && n.length === 3)
              )
                return "hcg";
            },
          });
      },
      {
        Pj: 2,
        "4W": 3,
        Yh: 89,
        tc: 49,
        gA: 34,
        "9c": 36,
      },
    ],
    36: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("Yh");
        const l = (...n) => {
          const [e, z, l] = (0, q.unpack)(n, "rgb"),
            P = (0, q.min)(e, z, l),
            U = (0, q.max)(e, z, l),
            r = U - P,
            F = (r * 100) / 255,
            a = (P / (255 - r)) * 100;
          let t;
          if (r === 0) t = Number.NaN;
          else {
            if (e === U) t = (z - l) / r;
            if (z === U) t = 2 + (l - e) / r;
            if (l === U) t = 4 + (e - z) / r;
            if (((t *= 60), t < 0)) t += 360;
          }
          return [t, F, a];
        };
        var P = (z.default = l);
      },
      {
        Yh: 89,
      },
    ],
    37: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        const q = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
          l = /^#?([A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/,
          P = (n) => {
            if (n.match(q)) {
              if (n.length === 4 || n.length === 7) n = n.substr(1);
              if (n.length === 3)
                (n = n.split("")),
                  (n = n[0] + n[0] + n[1] + n[1] + n[2] + n[2]);
              const e = parseInt(n, 16),
                z = e >> 16,
                q = (e >> 8) & 255,
                l = e & 255;
              return [z, q, l, 1];
            }
            if (n.match(l)) {
              if (n.length === 5 || n.length === 9) n = n.substr(1);
              if (n.length === 4)
                (n = n.split("")),
                  (n = n[0] + n[0] + n[1] + n[1] + n[2] + n[2] + n[3] + n[3]);
              const e = parseInt(n, 16),
                z = (e >> 24) & 255,
                q = (e >> 16) & 255,
                l = (e >> 8) & 255,
                P = Math.round(((e & 255) / 255) * 100) / 100;
              return [z, q, l, P];
            }
            throw new Error(`unknown hex color: ${n}`);
          };
        var U = (z.default = P);
      },
      {},
    ],
    38: [
      function (n, e, z) {
        "use strict";
        var q = a(n("4W")),
          l = a(n("Pj")),
          P = n("Yh"),
          U = a(n("tc")),
          r = a(n("rA")),
          F = a(n("jV"));
        function a(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        (l.default.prototype.hex = function (n) {
          return (0, F.default)(this._rgb, n);
        }),
          (q.default.hex = (...n) => new l.default(...n, "hex")),
          (U.default.format.hex = r.default),
          U.default.autodetect.push({
            p: 4,
            test: (n, ...e) => {
              if (
                !e.length &&
                (0, P.type)(n) === "string" &&
                [3, 4, 5, 6, 7, 8, 9].indexOf(n.length) >= 0
              )
                return "hex";
            },
          });
      },
      {
        Pj: 2,
        "4W": 3,
        Yh: 89,
        tc: 49,
        rA: 37,
        jV: 39,
      },
    ],
    39: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("Yh");
        const { round: l } = Math,
          P = (...n) => {
            let [e, z, P, U] = (0, q.unpack)(n, "rgba"),
              r = (0, q.last)(n) || "auto";
            if (U === void 0) U = 1;
            if (r === "auto") r = U < 1 ? "rgba" : "rgb";
            (e = l(e)), (z = l(z)), (P = l(P));
            const F = (e << 16) | (z << 8) | P;
            let a = "000000" + F.toString(16);
            a = a.substr(a.length - 6);
            let t = "0" + l(U * 255).toString(16);
            switch (((t = t.substr(t.length - 2)), r.toLowerCase())) {
              case "rgba":
                return `#${a}${t}`;

              case "argb":
                return `#${t}${a}`;

              default:
                return `#${a}`;
            }
          };
        var U = (z.default = P);
      },
      {
        Yh: 89,
      },
    ],
    40: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("Yh");
        const { cos: l } = Math,
          P = (...n) => {
            n = (0, q.unpack)(n, "hsi");
            let [e, z, P] = n,
              U,
              r,
              F;
            if (isNaN(e)) e = 0;
            if (isNaN(z)) z = 0;
            if (e > 360) e -= 360;
            if (e < 0) e += 360;
            if (((e /= 360), e < 1 / 3))
              (F = (1 - z) / 3),
                (U =
                  (1 + (z * l(q.TWOPI * e)) / l(q.PITHIRD - q.TWOPI * e)) / 3),
                (r = 1 - (F + U));
            else if (e < 2 / 3)
              (e -= 1 / 3),
                (U = (1 - z) / 3),
                (r =
                  (1 + (z * l(q.TWOPI * e)) / l(q.PITHIRD - q.TWOPI * e)) / 3),
                (F = 1 - (U + r));
            else
              (e -= 2 / 3),
                (r = (1 - z) / 3),
                (F =
                  (1 + (z * l(q.TWOPI * e)) / l(q.PITHIRD - q.TWOPI * e)) / 3),
                (U = 1 - (r + F));
            return (
              (U = (0, q.limit)(P * U * 3)),
              (r = (0, q.limit)(P * r * 3)),
              (F = (0, q.limit)(P * F * 3)),
              [U * 255, r * 255, F * 255, n.length > 3 ? n[3] : 1]
            );
          };
        var U = (z.default = P);
      },
      {
        Yh: 89,
      },
    ],
    41: [
      function (n, e, z) {
        "use strict";
        var q = n("Yh"),
          l = a(n("4W")),
          P = a(n("Pj")),
          U = a(n("tc")),
          r = a(n("4M")),
          F = a(n("in"));
        function a(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        (P.default.prototype.hsi = function () {
          return (0, F.default)(this._rgb);
        }),
          (l.default.hsi = (...n) => new P.default(...n, "hsi")),
          (U.default.format.hsi = r.default),
          U.default.autodetect.push({
            p: 2,
            test: (...n) => {
              if (
                ((n = (0, q.unpack)(n, "hsi")),
                (0, q.type)(n) === "array" && n.length === 3)
              )
                return "hsi";
            },
          });
      },
      {
        Pj: 2,
        "4W": 3,
        Yh: 89,
        tc: 49,
        "4M": 40,
        in: 42,
      },
    ],
    42: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("Yh");
        const { min: l, sqrt: P, acos: U } = Math,
          r = (...n) => {
            let [e, z, r] = (0, q.unpack)(n, "rgb"),
              F;
            (e /= 255), (z /= 255), (r /= 255);
            const a = l(e, z, r),
              t = (e + z + r) / 3,
              b = t > 0 ? 1 - a / t : 0;
            if (b === 0) F = NaN;
            else {
              if (
                ((F = (e - z + (e - r)) / 2),
                (F /= P((e - z) * (e - z) + (e - r) * (z - r))),
                (F = U(F)),
                r > z)
              )
                F = q.TWOPI - F;
              F /= q.TWOPI;
            }
            return [F * 360, b, t];
          };
        var F = (z.default = r);
      },
      {
        Yh: 89,
      },
    ],
    43: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("Yh");
        const { round: l } = Math,
          P = (...n) => {
            n = (0, q.unpack)(n, "hsl");
            const [e, z, P] = n;
            let U, r, F;
            if (z === 0) U = r = F = P * 255;
            else {
              const n = [0, 0, 0],
                q = [0, 0, 0],
                a = P < 0.5 ? P * (1 + z) : P + z - P * z,
                t = 2 * P - a,
                b = e / 360;
              (n[0] = b + 1 / 3), (n[1] = b), (n[2] = b - 1 / 3);
              for (let e = 0; e < 3; e++) {
                if (n[e] < 0) n[e] += 1;
                if (n[e] > 1) n[e] -= 1;
                if (6 * n[e] < 1) q[e] = t + (a - t) * 6 * n[e];
                else if (2 * n[e] < 1) q[e] = a;
                else if (3 * n[e] < 2) q[e] = t + (a - t) * (2 / 3 - n[e]) * 6;
                else q[e] = t;
              }
              [U, r, F] = [l(q[0] * 255), l(q[1] * 255), l(q[2] * 255)];
            }
            if (n.length > 3) return [U, r, F, n[3]];
            return [U, r, F, 1];
          };
        var U = (z.default = P);
      },
      {
        Yh: 89,
      },
    ],
    44: [
      function (n, e, z) {
        "use strict";
        var q = n("Yh"),
          l = a(n("4W")),
          P = a(n("Pj")),
          U = a(n("tc")),
          r = a(n("fP")),
          F = a(n("UP"));
        function a(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        (P.default.prototype.hsl = function () {
          return (0, F.default)(this._rgb);
        }),
          (l.default.hsl = (...n) => new P.default(...n, "hsl")),
          (U.default.format.hsl = r.default),
          U.default.autodetect.push({
            p: 2,
            test: (...n) => {
              if (
                ((n = (0, q.unpack)(n, "hsl")),
                (0, q.type)(n) === "array" && n.length === 3)
              )
                return "hsl";
            },
          });
      },
      {
        Pj: 2,
        "4W": 3,
        Yh: 89,
        tc: 49,
        fP: 43,
        UP: 45,
      },
    ],
    45: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("Yh");
        const l = (...n) => {
          n = (0, q.unpack)(n, "rgba");
          let [e, z, l] = n;
          (e /= 255), (z /= 255), (l /= 255);
          const P = (0, q.min)(e, z, l),
            U = (0, q.max)(e, z, l),
            r = (U + P) / 2;
          let F, a;
          if (U === P) (F = 0), (a = Number.NaN);
          else F = r < 0.5 ? (U - P) / (U + P) : (U - P) / (2 - U - P);
          if (e == U) a = (z - l) / (U - P);
          else if (z == U) a = 2 + (l - e) / (U - P);
          else if (l == U) a = 4 + (e - z) / (U - P);
          if (((a *= 60), a < 0)) a += 360;
          if (n.length > 3 && n[3] !== void 0) return [a, F, r, n[3]];
          return [a, F, r];
        };
        var P = (z.default = l);
      },
      {
        Yh: 89,
      },
    ],
    46: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("Yh");
        const { floor: l } = Math,
          P = (...n) => {
            n = (0, q.unpack)(n, "hsv");
            let [e, z, P] = n,
              U,
              r,
              F;
            if (((P *= 255), z === 0)) U = r = F = P;
            else {
              if (e === 360) e = 0;
              if (e > 360) e -= 360;
              if (e < 0) e += 360;
              e /= 60;
              const n = l(e),
                q = e - n,
                a = P * (1 - z),
                t = P * (1 - z * q),
                b = P * (1 - z * (1 - q));
              switch (n) {
                case 0:
                  [U, r, F] = [P, b, a];
                  break;

                case 1:
                  [U, r, F] = [t, P, a];
                  break;

                case 2:
                  [U, r, F] = [a, P, b];
                  break;

                case 3:
                  [U, r, F] = [a, t, P];
                  break;

                case 4:
                  [U, r, F] = [b, a, P];
                  break;

                case 5:
                  [U, r, F] = [P, a, t];
                  break;
              }
            }
            return [U, r, F, n.length > 3 ? n[3] : 1];
          };
        var U = (z.default = P);
      },
      {
        Yh: 89,
      },
    ],
    47: [
      function (n, e, z) {
        "use strict";
        var q = n("Yh"),
          l = a(n("4W")),
          P = a(n("Pj")),
          U = a(n("tc")),
          r = a(n("tQ")),
          F = a(n("mD"));
        function a(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        (P.default.prototype.hsv = function () {
          return (0, F.default)(this._rgb);
        }),
          (l.default.hsv = (...n) => new P.default(...n, "hsv")),
          (U.default.format.hsv = r.default),
          U.default.autodetect.push({
            p: 2,
            test: (...n) => {
              if (
                ((n = (0, q.unpack)(n, "hsv")),
                (0, q.type)(n) === "array" && n.length === 3)
              )
                return "hsv";
            },
          });
      },
      {
        Pj: 2,
        "4W": 3,
        Yh: 89,
        tc: 49,
        tQ: 46,
        mD: 48,
      },
    ],
    48: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("Yh");
        const { min: l, max: P } = Math,
          U = (...n) => {
            n = (0, q.unpack)(n, "rgb");
            let [e, z, U] = n;
            const r = l(e, z, U),
              F = P(e, z, U),
              a = F - r;
            let t, b, p;
            if (((p = F / 255), F === 0)) (t = Number.NaN), (b = 0);
            else {
              if (((b = a / F), e === F)) t = (z - U) / a;
              if (z === F) t = 2 + (U - e) / a;
              if (U === F) t = 4 + (e - z) / a;
              if (((t *= 60), t < 0)) t += 360;
            }
            return [t, b, p];
          };
        var r = (z.default = U);
      },
      {
        Yh: 89,
      },
    ],
    49: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = (z.default = {
          format: {},
          autodetect: [],
        });
      },
      {},
    ],
    50: [
      function (n, e, z) {
        "use strict";
        var q = n("Yh"),
          l = a(n("4W")),
          P = a(n("Pj")),
          U = a(n("tc")),
          r = a(n("X3")),
          F = a(n("lM"));
        function a(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        (P.default.prototype.lab = function () {
          return (0, F.default)(this._rgb);
        }),
          (l.default.lab = (...n) => new P.default(...n, "lab")),
          (U.default.format.lab = r.default),
          U.default.autodetect.push({
            p: 2,
            test: (...n) => {
              if (
                ((n = (0, q.unpack)(n, "lab")),
                (0, q.type)(n) === "array" && n.length === 3)
              )
                return "lab";
            },
          });
      },
      {
        Pj: 2,
        "4W": 3,
        Yh: 89,
        tc: 49,
        X3: 52,
        lM: 53,
      },
    ],
    51: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = (z.default = {
          Kn: 18,
          Xn: 0.95047,
          Yn: 1,
          Zn: 1.08883,
          t0: 0.137931034,
          t1: 0.206896552,
          t2: 0.12841855,
          t3: 0.008856452,
        });
      },
      {},
    ],
    52: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = P(n("2q")),
          l = n("Yh");
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const { pow: U } = Math,
          r = (...n) => {
            n = (0, l.unpack)(n, "lab");
            const [e, z, P] = n;
            let U, r, t, b, p, y;
            return (
              (r = (e + 16) / 116),
              (U = isNaN(z) ? r : r + z / 500),
              (t = isNaN(P) ? r : r - P / 200),
              (r = q.default.Yn * a(r)),
              (U = q.default.Xn * a(U)),
              (t = q.default.Zn * a(t)),
              (b = F(3.2404542 * U - 1.5371385 * r - 0.4985314 * t)),
              (p = F(-0.969266 * U + 1.8760108 * r + 0.041556 * t)),
              (y = F(0.0556434 * U - 0.2040259 * r + 1.0572252 * t)),
              [b, p, y, n.length > 3 ? n[3] : 1]
            );
          },
          F = (n) =>
            255 * (n <= 0.00304 ? 12.92 * n : 1.055 * U(n, 1 / 2.4) - 0.055),
          a = (n) =>
            n > q.default.t1 ? n * n * n : q.default.t2 * (n - q.default.t0);
        var t = (z.default = r);
      },
      {
        Yh: 89,
        "2q": 51,
      },
    ],
    53: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = P(n("2q")),
          l = n("Yh");
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const { pow: U } = Math,
          r = (...n) => {
            const [e, z, q] = (0, l.unpack)(n, "rgb"),
              [P, U, r] = t(e, z, q),
              F = 116 * U - 16;
            return [F < 0 ? 0 : F, 500 * (P - U), 200 * (U - r)];
          },
          F = (n) => {
            if ((n /= 255) <= 0.04045) return n / 12.92;
            return U((n + 0.055) / 1.055, 2.4);
          },
          a = (n) => {
            if (n > q.default.t3) return U(n, 1 / 3);
            return n / q.default.t2 + q.default.t0;
          },
          t = (n, e, z) => {
            (n = F(n)), (e = F(e)), (z = F(z));
            const l = a(
                (0.4124564 * n + 0.3575761 * e + 0.1804375 * z) / q.default.Xn
              ),
              P = a(
                (0.2126729 * n + 0.7151522 * e + 0.072175 * z) / q.default.Yn
              ),
              U = a(
                (0.0193339 * n + 0.119192 * e + 0.9503041 * z) / q.default.Zn
              );
            return [l, P, U];
          };
        var b = (z.default = r);
      },
      {
        Yh: 89,
        "2q": 51,
      },
    ],
    54: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("Yh"),
          l = P(n("dx"));
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const U = (...n) => {
          const e = (0, q.unpack)(n, "hcl").reverse();
          return (0, l.default)(...e);
        };
        var r = (z.default = U);
      },
      {
        Yh: 89,
        dx: 58,
      },
    ],
    55: [
      function (n, e, z) {
        "use strict";
        var q = n("Yh"),
          l = t(n("4W")),
          P = t(n("Pj")),
          U = t(n("tc")),
          r = t(n("dx")),
          F = t(n("lP")),
          a = t(n("eW"));
        function t(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        (P.default.prototype.lch = function () {
          return (0, a.default)(this._rgb);
        }),
          (P.default.prototype.hcl = function () {
            return (0, a.default)(this._rgb).reverse();
          }),
          (l.default.lch = (...n) => new P.default(...n, "lch")),
          (l.default.hcl = (...n) => new P.default(...n, "hcl")),
          (U.default.format.lch = r.default),
          (U.default.format.hcl = F.default),
          ["lch", "hcl"].forEach((n) =>
            U.default.autodetect.push({
              p: 2,
              test: (...e) => {
                if (
                  ((e = (0, q.unpack)(e, n)),
                  (0, q.type)(e) === "array" && e.length === 3)
                )
                  return n;
              },
            })
          );
      },
      {
        Pj: 2,
        "4W": 3,
        Yh: 89,
        tc: 49,
        lP: 54,
        dx: 58,
        eW: 59,
      },
    ],
    56: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("Yh");
        const { sqrt: l, atan2: P, round: U } = Math,
          r = (...n) => {
            const [e, z, r] = (0, q.unpack)(n, "lab"),
              F = l(z * z + r * r);
            let a = (P(r, z) * q.RAD2DEG + 360) % 360;
            if (U(F * 1e4) === 0) a = Number.NaN;
            return [e, F, a];
          };
        var F = (z.default = r);
      },
      {
        Yh: 89,
      },
    ],
    57: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("Yh");
        const { sin: l, cos: P } = Math,
          U = (...n) => {
            let [e, z, U] = (0, q.unpack)(n, "lch");
            if (isNaN(U)) U = 0;
            return (U *= q.DEG2RAD), [e, P(U) * z, l(U) * z];
          };
        var r = (z.default = U);
      },
      {
        Yh: 89,
      },
    ],
    58: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("Yh"),
          l = U(n("Qt")),
          P = U(n("ZQ"));
        function U(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const r = (...n) => {
          n = (0, q.unpack)(n, "lch");
          const [e, z, U] = n,
            [r, F, a] = (0, l.default)(e, z, U),
            [t, b, p] = (0, P.default)(r, F, a);
          return [t, b, p, n.length > 3 ? n[3] : 1];
        };
        var F = (z.default = r);
      },
      {
        Yh: 89,
        ZQ: 52,
        Qt: 57,
      },
    ],
    59: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("Yh"),
          l = U(n("kG")),
          P = U(n("Q6"));
        function U(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const r = (...n) => {
          const [e, z, U] = (0, q.unpack)(n, "rgb"),
            [r, F, a] = (0, l.default)(e, z, U);
          return (0, P.default)(r, F, a);
        };
        var F = (z.default = r);
      },
      {
        Yh: 89,
        kG: 53,
        Q6: 56,
      },
    ],
    60: [
      function (n, e, z) {
        "use strict";
        var q = a(n("Pj")),
          l = a(n("tc")),
          P = n("Yh"),
          U = a(n("7z")),
          r = a(n("bc")),
          F = a(n("bV"));
        function a(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        (q.default.prototype.name = function () {
          const n = (0, F.default)(this._rgb, "rgb");
          for (let e of Object.keys(U.default))
            if (U.default[e] === n) return e.toLowerCase();
          return n;
        }),
          (l.default.format.named = (n) => {
            if (((n = n.toLowerCase()), U.default[n]))
              return (0, r.default)(U.default[n]);
            throw new Error("unknown color name: " + n);
          }),
          l.default.autodetect.push({
            p: 5,
            test: (n, ...e) => {
              if (
                !e.length &&
                (0, P.type)(n) === "string" &&
                U.default[n.toLowerCase()]
              )
                return "named";
            },
          });
      },
      {
        Pj: 2,
        "7z": 5,
        Yh: 89,
        bc: 37,
        bV: 39,
        tc: 49,
      },
    ],
    61: [
      function (n, e, z) {
        "use strict";
        var q = a(n("4W")),
          l = a(n("Pj")),
          P = a(n("tc")),
          U = n("Yh"),
          r = a(n("wt")),
          F = a(n("MO"));
        function a(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        (l.default.prototype.num = function () {
          return (0, F.default)(this._rgb);
        }),
          (q.default.num = (...n) => new l.default(...n, "num")),
          (P.default.format.num = r.default),
          P.default.autodetect.push({
            p: 5,
            test: (...n) => {
              if (
                n.length === 1 &&
                (0, U.type)(n[0]) === "number" &&
                n[0] >= 0 &&
                n[0] <= 16777215
              )
                return "num";
            },
          });
      },
      {
        Pj: 2,
        "4W": 3,
        Yh: 89,
        tc: 49,
        wt: 62,
        MO: 63,
      },
    ],
    62: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("Yh");
        const l = (n) => {
          if ((0, q.type)(n) == "number" && n >= 0 && n <= 16777215) {
            const e = n >> 16,
              z = (n >> 8) & 255,
              q = n & 255;
            return [e, z, q, 1];
          }
          throw new Error("unknown num color: " + n);
        };
        var P = (z.default = l);
      },
      {
        Yh: 89,
      },
    ],
    63: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("Yh");
        const l = (...n) => {
          const [e, z, l] = (0, q.unpack)(n, "rgb");
          return (e << 16) + (z << 8) + l;
        };
        var P = (z.default = l);
      },
      {
        Yh: 89,
      },
    ],
    64: [
      function (n, e, z) {
        "use strict";
        var q = n("Yh"),
          l = a(n("4W")),
          P = a(n("Pj")),
          U = a(n("tc")),
          r = a(n("jS")),
          F = a(n("jt"));
        function a(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        (P.default.prototype.oklab = function () {
          return (0, F.default)(this._rgb);
        }),
          (l.default.oklab = (...n) => new P.default(...n, "oklab")),
          (U.default.format.oklab = r.default),
          U.default.autodetect.push({
            p: 3,
            test: (...n) => {
              if (
                ((n = (0, q.unpack)(n, "oklab")),
                (0, q.type)(n) === "array" && n.length === 3)
              )
                return "oklab";
            },
          });
      },
      {
        Pj: 2,
        "4W": 3,
        Yh: 89,
        tc: 49,
        jS: 65,
        jt: 66,
      },
    ],
    65: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("Yh");
        const { pow: l, sign: P } = Math,
          U = (...n) => {
            n = (0, q.unpack)(n, "lab");
            const [e, z, P] = n,
              U = l(e + 0.3963377774 * z + 0.2158037573 * P, 3),
              r = l(e - 0.1055613458 * z - 0.0638541728 * P, 3),
              a = l(e - 0.0894841775 * z - 1.291485548 * P, 3);
            return [
              255 * F(+4.0767416621 * U - 3.3077115913 * r + 0.2309699292 * a),
              255 * F(-1.2684380046 * U + 2.6097574011 * r - 0.3413193965 * a),
              255 * F(-0.0041960863 * U - 0.7034186147 * r + 1.707614701 * a),
              n.length > 3 ? n[3] : 1,
            ];
          };
        var r = (z.default = U);
        function F(n) {
          const e = Math.abs(n);
          if (e > 0.0031308)
            return (P(n) || 1) * (1.055 * l(e, 1 / 2.4) - 0.055);
          return n * 12.92;
        }
      },
      {
        Yh: 89,
      },
    ],
    66: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("Yh");
        const { cbrt: l, pow: P, sign: U } = Math,
          r = (...n) => {
            const [e, z, P] = (0, q.unpack)(n, "rgb"),
              [U, r, F] = [a(e / 255), a(z / 255), a(P / 255)],
              t = l(0.4122214708 * U + 0.5363325363 * r + 0.0514459929 * F),
              b = l(0.2119034982 * U + 0.6806995451 * r + 0.1073969566 * F),
              p = l(0.0883024619 * U + 0.2817188376 * r + 0.6299787005 * F);
            return [
              0.2104542553 * t + 0.793617785 * b - 0.0040720468 * p,
              1.9779984951 * t - 2.428592205 * b + 0.4505937099 * p,
              0.0259040371 * t + 0.7827717662 * b - 0.808675766 * p,
            ];
          };
        var F = (z.default = r);
        function a(n) {
          const e = Math.abs(n);
          if (e < 0.04045) return n / 12.92;
          return (U(n) || 1) * P((e + 0.055) / 1.055, 2.4);
        }
      },
      {
        Yh: 89,
      },
    ],
    67: [
      function (n, e, z) {
        "use strict";
        var q = n("Yh"),
          l = a(n("4W")),
          P = a(n("Pj")),
          U = a(n("tc")),
          r = a(n("cx")),
          F = a(n("nv"));
        function a(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        (P.default.prototype.oklch = function () {
          return (0, F.default)(this._rgb);
        }),
          (l.default.oklch = (...n) => new P.default(...n, "oklch")),
          (U.default.format.oklch = r.default),
          U.default.autodetect.push({
            p: 3,
            test: (...n) => {
              if (
                ((n = (0, q.unpack)(n, "oklch")),
                (0, q.type)(n) === "array" && n.length === 3)
              )
                return "oklch";
            },
          });
      },
      {
        Pj: 2,
        "4W": 3,
        Yh: 89,
        tc: 49,
        cx: 68,
        nv: 69,
      },
    ],
    68: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("Yh"),
          l = U(n("86")),
          P = U(n("c1"));
        function U(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const r = (...n) => {
          n = (0, q.unpack)(n, "lch");
          const [e, z, U] = n,
            [r, F, a] = (0, l.default)(e, z, U),
            [t, b, p] = (0, P.default)(r, F, a);
          return [t, b, p, n.length > 3 ? n[3] : 1];
        };
        var F = (z.default = r);
      },
      {
        Yh: 89,
        86: 57,
        c1: 65,
      },
    ],
    69: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("Yh"),
          l = U(n("ry")),
          P = U(n("PH"));
        function U(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const r = (...n) => {
          const [e, z, U] = (0, q.unpack)(n, "rgb"),
            [r, F, a] = (0, l.default)(e, z, U);
          return (0, P.default)(r, F, a);
        };
        var F = (z.default = r);
      },
      {
        Yh: 89,
        PH: 56,
        ry: 66,
      },
    ],
    70: [
      function (n, e, z) {
        "use strict";
        var q = r(n("4W")),
          l = r(n("Pj")),
          P = r(n("tc")),
          U = n("Yh");
        function r(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const { round: F } = Math;
        (l.default.prototype.rgb = function (n = true) {
          if (n === false) return this._rgb.slice(0, 3);
          return this._rgb.slice(0, 3).map(F);
        }),
          (l.default.prototype.rgba = function (n = true) {
            return this._rgb
              .slice(0, 4)
              .map((e, z) => (z < 3 ? (n === false ? e : F(e)) : e));
          }),
          (q.default.rgb = (...n) => new l.default(...n, "rgb")),
          (P.default.format.rgb = (...n) => {
            const e = (0, U.unpack)(n, "rgba");
            if (e[3] === void 0) e[3] = 1;
            return e;
          }),
          P.default.autodetect.push({
            p: 3,
            test: (...n) => {
              if (
                ((n = (0, U.unpack)(n, "rgba")),
                (0, U.type)(n) === "array" &&
                  (n.length === 3 ||
                    (n.length === 4 &&
                      (0, U.type)(n[3]) == "number" &&
                      n[3] >= 0 &&
                      n[3] <= 1)))
              )
                return "rgb";
            },
          });
      },
      {
        Pj: 2,
        "4W": 3,
        Yh: 89,
        tc: 49,
      },
    ],
    71: [
      function (n, e, z) {
        "use strict";
        var q = F(n("4W")),
          l = F(n("Pj")),
          P = F(n("tc")),
          U = F(n("js")),
          r = F(n("ht"));
        function F(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        (l.default.prototype.temp =
          l.default.prototype.kelvin =
          l.default.prototype.temperature =
            function () {
              return (0, r.default)(this._rgb);
            }),
          (q.default.temp =
            q.default.kelvin =
            q.default.temperature =
              (...n) => new l.default(...n, "temp")),
          (P.default.format.temp =
            P.default.format.kelvin =
            P.default.format.temperature =
              U.default);
      },
      {
        Pj: 2,
        "4W": 3,
        tc: 49,
        ht: 72,
        js: 73,
      },
    ],
    72: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = P(n("js")),
          l = n("Yh");
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const { round: U } = Math,
          r = (...n) => {
            const e = (0, l.unpack)(n, "rgb"),
              z = e[0],
              P = e[2];
            let r = 1e3,
              F = 4e4;
            const a = 0.4;
            let t;
            while (F - r > a) {
              t = (F + r) * 0.5;
              const n = (0, q.default)(t);
              if (n[2] / n[0] >= P / z) F = t;
              else r = t;
            }
            return U(t);
          };
        var F = (z.default = r);
      },
      {
        Yh: 89,
        js: 73,
      },
    ],
    73: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        const { log: q } = Math,
          l = (n) => {
            const e = n / 100;
            let z, l, P;
            if (e < 66)
              (z = 255),
                (l =
                  e < 6
                    ? 0
                    : -155.25485562709179 -
                      0.44596950469579133 * (l = e - 2) +
                      104.49216199393888 * q(l)),
                (P =
                  e < 20
                    ? 0
                    : -254.76935184120902 +
                      0.8274096064007395 * (P = e - 10) +
                      115.67994401066147 * q(P));
            else
              (z =
                351.97690566805693 +
                0.114206453784165 * (z = e - 55) -
                40.25366309332127 * q(z)),
                (l =
                  325.4494125711974 +
                  0.07943456536662342 * (l = e - 50) -
                  28.0852963507957 * q(l)),
                (P = 255);
            return [z, l, P, 1];
          };
        var P = (z.default = l);
      },
      {},
    ],
    74: [
      function (n, e, z) {
        "use strict";
        var q = P(n("wQ")),
          l = n("6v");
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        q.default.prototype.alpha = function (n, e = false) {
          if (n !== void 0 && (0, l.type)(n) === "number") {
            if (e) return (this._rgb[3] = n), this;
            return new q.default(
              [this._rgb[0], this._rgb[1], this._rgb[2], n],
              "rgb"
            );
          }
          return this._rgb[3];
        };
      },
      {
        wQ: 2,
        "6v": 89,
      },
    ],
    75: [
      function (n, e, z) {
        "use strict";
        var q = l(n("wQ"));
        function l(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        q.default.prototype.clipped = function () {
          return this._rgb._clipped || false;
        };
      },
      {
        wQ: 2,
      },
    ],
    76: [
      function (n, e, z) {
        "use strict";
        n("DK");
        var q = P(n("wQ")),
          l = P(n("xY"));
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        (q.default.prototype.darken = function (n = 1) {
          const e = this,
            z = e.lab();
          return (
            (z[0] -= l.default.Kn * n),
            new q.default(z, "lab").alpha(e.alpha(), true)
          );
        }),
          (q.default.prototype.brighten = function (n = 1) {
            return this.darken(-n);
          }),
          (q.default.prototype.darker = q.default.prototype.darken),
          (q.default.prototype.brighter = q.default.prototype.brighten);
      },
      {
        wQ: 2,
        DK: 50,
        xY: 51,
      },
    ],
    77: [
      function (n, e, z) {
        "use strict";
        var q = l(n("wQ"));
        function l(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        q.default.prototype.get = function (n) {
          const [e, z] = n.split("."),
            q = this[e]();
          if (z) {
            const n = e.indexOf(z) - (e.substr(0, 2) === "ok" ? 2 : 0);
            if (n > -1) return q[n];
            throw new Error(`unknown channel ${z} in mode ${e}`);
          } else return q;
        };
      },
      {
        wQ: 2,
      },
    ],
    78: [
      function (n, e, z) {
        "use strict";
        var q = P(n("wQ")),
          l = n("6v");
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const { pow: U } = Math,
          r = 1e-7,
          F = 20;
        q.default.prototype.luminance = function (n, e = "rgb") {
          if (n !== void 0 && (0, l.type)(n) === "number") {
            if (n === 0) return new q.default([0, 0, 0, this._rgb[3]], "rgb");
            if (n === 1)
              return new q.default([255, 255, 255, this._rgb[3]], "rgb");
            let z = this.luminance(),
              l = F;
            const P = (z, q) => {
                const U = z.interpolate(q, 0.5, e),
                  F = U.luminance();
                if (Math.abs(n - F) < r || !l--) return U;
                return F > n ? P(z, U) : P(U, q);
              },
              U = (
                z > n
                  ? P(new q.default([0, 0, 0]), this)
                  : P(this, new q.default([255, 255, 255]))
              ).rgb();
            return new q.default([...U, this._rgb[3]]);
          }
          return a(...this._rgb.slice(0, 3));
        };
        const a = (n, e, z) => (
            (n = t(n)),
            (e = t(e)),
            (z = t(z)),
            0.2126 * n + 0.7152 * e + 0.0722 * z
          ),
          t = (n) => (
            (n /= 255), n <= 0.03928 ? n / 12.92 : U((n + 0.055) / 1.055, 2.4)
          );
      },
      {
        wQ: 2,
        "6v": 89,
      },
    ],
    79: [
      function (n, e, z) {
        "use strict";
        var q = P(n("wQ")),
          l = P(n("Pu"));
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        q.default.prototype.mix = q.default.prototype.interpolate = function (
          n,
          e = 0.5,
          ...z
        ) {
          return (0, l.default)(this, n, e, ...z);
        };
      },
      {
        wQ: 2,
        Pu: 10,
      },
    ],
    80: [
      function (n, e, z) {
        "use strict";
        var q = l(n("wQ"));
        function l(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        q.default.prototype.premultiply = function (n = false) {
          const e = this._rgb,
            z = e[3];
          if (n) return (this._rgb = [e[0] * z, e[1] * z, e[2] * z, z]), this;
          else return new q.default([e[0] * z, e[1] * z, e[2] * z, z], "rgb");
        };
      },
      {
        wQ: 2,
      },
    ],
    81: [
      function (n, e, z) {
        "use strict";
        n("N8");
        var q = P(n("wQ")),
          l = P(n("xY"));
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        (q.default.prototype.saturate = function (n = 1) {
          const e = this,
            z = e.lch();
          if (((z[1] += l.default.Kn * n), z[1] < 0)) z[1] = 0;
          return new q.default(z, "lch").alpha(e.alpha(), true);
        }),
          (q.default.prototype.desaturate = function (n = 1) {
            return this.saturate(-n);
          });
      },
      {
        wQ: 2,
        xY: 51,
        N8: 55,
      },
    ],
    82: [
      function (n, e, z) {
        "use strict";
        var q = P(n("wQ")),
          l = n("6v");
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        q.default.prototype.set = function (n, e, z = false) {
          const [P, U] = n.split("."),
            r = this[P]();
          if (U) {
            const n = P.indexOf(U) - (P.substr(0, 2) === "ok" ? 2 : 0);
            if (n > -1) {
              if ((0, l.type)(e) == "string")
                switch (e.charAt(0)) {
                  case "+":
                    r[n] += +e;
                    break;

                  case "-":
                    r[n] += +e;
                    break;

                  case "*":
                    r[n] *= +e.substr(1);
                    break;

                  case "/":
                    r[n] /= +e.substr(1);
                    break;

                  default:
                    r[n] = +e;
                }
              else if ((0, l.type)(e) === "number") r[n] = e;
              else throw new Error(`unsupported value for Color.set`);
              const U = new q.default(r, P);
              if (z) return (this._rgb = U._rgb), this;
              return U;
            }
            throw new Error(`unknown channel ${U} in mode ${P}`);
          } else return r;
        };
      },
      {
        wQ: 2,
        "6v": 89,
      },
    ],
    83: [
      function (n, e, z) {
        "use strict";
        n("DK");
        var q = P(n("wQ")),
          l = P(n("Pu"));
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        (q.default.prototype.tint = function (n = 0.5, ...e) {
          return (0, l.default)(this, "white", n, ...e);
        }),
          (q.default.prototype.shade = function (n = 0.5, ...e) {
            return (0, l.default)(this, "black", n, ...e);
          });
      },
      {
        wQ: 2,
        Pu: 10,
        DK: 50,
      },
    ],
    84: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.analyze = a),
          (z.limits = t);
        var q = l(n("d"));
        function l(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const { log: P, pow: U, floor: r, abs: F } = Math;
        function a(n, e = null) {
          const z = {
            min: Number.MAX_VALUE,
            max: Number.MAX_VALUE * -1,
            sum: 0,
            values: [],
            count: 0,
          };
          if ((0, q.default)(n) === "object") n = Object.values(n);
          return (
            n.forEach((n) => {
              if (e && (0, q.default)(n) === "object") n = n[e];
              if (n !== void 0 && n !== null && !isNaN(n)) {
                if ((z.values.push(n), (z.sum += n), n < z.min)) z.min = n;
                if (n > z.max) z.max = n;
                z.count += 1;
              }
            }),
            (z.domain = [z.min, z.max]),
            (z.limits = (n, e) => t(z, n, e)),
            z
          );
        }
        function t(n, e = "equal", z = 7) {
          if ((0, q.default)(n) == "array") n = a(n);
          const { min: l, max: t } = n,
            b = n.values.sort((n, e) => n - e);
          if (z === 1) return [l, t];
          const p = [];
          if (e.substr(0, 1) === "c") p.push(l), p.push(t);
          if (e.substr(0, 1) === "e") {
            p.push(l);
            for (let n = 1; n < z; n++) p.push(l + (n / z) * (t - l));
            p.push(t);
          } else if (e.substr(0, 1) === "l") {
            if (l <= 0)
              throw new Error(
                "Logarithmic scales are only possible for values > 0"
              );
            const n = Math.LOG10E * P(l),
              e = Math.LOG10E * P(t);
            p.push(l);
            for (let q = 1; q < z; q++) p.push(U(10, n + (q / z) * (e - n)));
            p.push(t);
          } else if (e.substr(0, 1) === "q") {
            p.push(l);
            for (let n = 1; n < z; n++) {
              const e = ((b.length - 1) * n) / z,
                q = r(e);
              if (q === e) p.push(b[q]);
              else {
                const n = e - q;
                p.push(b[q] * (1 - n) + b[q + 1] * n);
              }
            }
            p.push(t);
          } else if (e.substr(0, 1) === "k") {
            let n;
            const e = b.length,
              q = new Array(e),
              P = new Array(z);
            let U = true,
              r = 0,
              a = null;
            (a = []), a.push(l);
            for (let n = 1; n < z; n++) a.push(l + (n / z) * (t - l));
            a.push(t);
            while (U) {
              for (let n = 0; n < z; n++) P[n] = 0;
              for (let n = 0; n < e; n++) {
                const e = b[n];
                let l = Number.MAX_VALUE,
                  U;
                for (let r = 0; r < z; r++) {
                  const z = F(a[r] - e);
                  if (z < l) (l = z), (U = r);
                  P[U]++, (q[n] = U);
                }
              }
              const l = new Array(z);
              for (let n = 0; n < z; n++) l[n] = null;
              for (let z = 0; z < e; z++)
                if (((n = q[z]), l[n] === null)) l[n] = b[z];
                else l[n] += b[z];
              for (let n = 0; n < z; n++) l[n] *= 1 / P[n];
              U = false;
              for (let n = 0; n < z; n++)
                if (l[n] !== a[n]) {
                  U = true;
                  break;
                }
              if (((a = l), r++, r > 200)) U = false;
            }
            const y = {};
            for (let n = 0; n < z; n++) y[n] = [];
            for (let z = 0; z < e; z++) (n = q[z]), y[n].push(b[z]);
            let X = [];
            for (let n = 0; n < z; n++)
              X.push(y[n][0]), X.push(y[n][y[n].length - 1]);
            (X = X.sort((n, e) => n - e)), p.push(X[0]);
            for (let n = 1; n < X.length; n += 2) {
              const e = X[n];
              if (!isNaN(e) && p.indexOf(e) === -1) p.push(e);
            }
          }
          return p;
        }
      },
      {
        d: 93,
      },
    ],
    85: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = l(n("P5"));
        function l(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        var P = (n) => {
          (n._clipped = false), (n._unclipped = n.slice(0));
          for (let e = 0; e <= 3; e++)
            if (e < 3) {
              if (n[e] < 0 || n[e] > 255) n._clipped = true;
              n[e] = (0, q.default)(n[e], 0, 255);
            } else if (e === 3) n[e] = (0, q.default)(n[e], 0, 1);
          return n;
        };
        z.default = P;
      },
      {
        P5: 91,
      },
    ],
    86: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = l(n("wQ"));
        function l(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        n("Gf");
        var P = (n, e) => {
          (n = new q.default(n)), (e = new q.default(e));
          const z = n.luminance(),
            l = e.luminance();
          return z > l ? (z + 0.05) / (l + 0.05) : (l + 0.05) / (z + 0.05);
        };
        z.default = P;
      },
      {
        wQ: 2,
        Gf: 78,
      },
    ],
    87: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = O);
        var q = l(n("wQ"));
        function l(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const {
          sqrt: P,
          pow: U,
          min: r,
          max: F,
          atan2: a,
          abs: t,
          cos: b,
          sin: p,
          exp: y,
          PI: X,
        } = Math;
        function O(n, e, z = 1, l = 1, O = 1) {
          var u = function (n) {
              return (360 * n) / (2 * X);
            },
            d = function (n) {
              return (2 * X * n) / 360;
            };
          (n = new q.default(n)), (e = new q.default(e));
          const [m, W, D] = Array.from(n.lab()),
            [L, M, g] = Array.from(e.lab()),
            E = (m + L) / 2,
            J = P(U(W, 2) + U(D, 2)),
            i = P(U(M, 2) + U(g, 2)),
            w = (J + i) / 2,
            k = 0.5 * (1 - P(U(w, 7) / (U(w, 7) + U(25, 7)))),
            K = W * (1 + k),
            G = M * (1 + k),
            A = P(U(K, 2) + U(D, 2)),
            I = P(U(G, 2) + U(g, 2)),
            j = (A + I) / 2,
            N = u(a(D, K)),
            V = u(a(g, G)),
            T = N >= 0 ? N : N + 360,
            h = V >= 0 ? V : V + 360,
            v = t(T - h) > 180 ? (T + h + 360) / 2 : (T + h) / 2,
            Q =
              1 -
              0.17 * b(d(v - 30)) +
              0.24 * b(d(2 * v)) +
              0.32 * b(d(3 * v + 6)) -
              0.2 * b(d(4 * v - 63));
          let o = h - T;
          (o = t(o) <= 180 ? o : h <= T ? o + 360 : o - 360),
            (o = 2 * P(A * I) * p(d(o) / 2));
          const H = L - m,
            R = I - A,
            Y = 1 + (0.015 * U(E - 50, 2)) / P(20 + U(E - 50, 2)),
            C = 1 + 0.045 * j,
            c = 1 + 0.015 * j * Q,
            S = 30 * y(-U((v - 275) / 25, 2)),
            B = 2 * P(U(j, 7) / (U(j, 7) + U(25, 7))),
            x = -B * p(2 * d(S)),
            f = P(
              U(H / (z * Y), 2) +
                U(R / (l * C), 2) +
                U(o / (O * c), 2) +
                x * (R / (l * C)) * (o / (O * c))
            );
          return F(0, r(100, f));
        }
      },
      {
        wQ: 2,
      },
    ],
    88: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = P);
        var q = l(n("wQ"));
        function l(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        function P(n, e, z = "lab") {
          (n = new q.default(n)), (e = new q.default(e));
          const l = n.get(z),
            P = e.get(z);
          let U = 0;
          for (let n in l) {
            const e = (l[n] || 0) - (P[n] || 0);
            U += e * e;
          }
          return Math.sqrt(U);
        }
      },
      {
        wQ: 2,
      },
    ],
    89: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.TWOPI = z.RAD2DEG = z.PITHIRD = z.PI = z.DEG2RAD = void 0),
          Object.defineProperty(z, "clip_rgb", {
            enumerable: true,
            get: function () {
              return q.default;
            },
          }),
          Object.defineProperty(z, "last", {
            enumerable: true,
            get: function () {
              return r.default;
            },
          }),
          Object.defineProperty(z, "limit", {
            enumerable: true,
            get: function () {
              return l.default;
            },
          }),
          (z.min = z.max = void 0),
          Object.defineProperty(z, "type", {
            enumerable: true,
            get: function () {
              return P.default;
            },
          }),
          Object.defineProperty(z, "unpack", {
            enumerable: true,
            get: function () {
              return U.default;
            },
          });
        var q = F(n("S9")),
          l = F(n("P5")),
          P = F(n("d")),
          U = F(n("HC")),
          r = F(n("vw"));
        function F(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const { PI: a, min: t, max: b } = Math;
        (z.max = b), (z.min = t), (z.PI = a);
        const p = (z.TWOPI = a * 2),
          y = (z.PITHIRD = a / 3),
          X = (z.DEG2RAD = a / 180),
          O = (z.RAD2DEG = 180 / a);
      },
      {
        S9: 85,
        vw: 90,
        P5: 91,
        d: 93,
        HC: 94,
      },
    ],
    90: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = l(n("d"));
        function l(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        var P = (n) => {
          if (n.length < 2) return null;
          const e = n.length - 1;
          if ((0, q.default)(n[e]) == "string") return n[e].toLowerCase();
          return null;
        };
        z.default = P;
      },
      {
        d: 93,
      },
    ],
    91: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("hi"),
          l = (n, e = 0, z = 1) => (0, q.min)((0, q.max)(e, n), z);
        z.default = l;
      },
      {
        hi: 89,
      },
    ],
    92: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = P(n("J5"));
        n("18");
        var l = P(n("Ls"));
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        var U = (z.default = {
          cool: () =>
            (0, l.default)([
              q.default.hsl(180, 1, 0.9),
              q.default.hsl(250, 0.7, 0.4),
            ]),
          hot: () =>
            (0, l.default)(
              ["#000", "#f00", "#ff0", "#fff"],
              [0, 0.25, 0.75, 1]
            ).mode("rgb"),
        });
      },
      {
        J5: 3,
        Ls: 12,
        18: 44,
      },
    ],
    93: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = l);
        const q = {};
        for (let n of [
          "Boolean",
          "Number",
          "String",
          "Function",
          "Array",
          "Date",
          "RegExp",
          "Undefined",
          "Null",
        ])
          q[`[object ${n}]`] = n.toLowerCase();
        function l(n) {
          return q[Object.prototype.toString.call(n)] || "object";
        }
      },
      {},
    ],
    94: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = l(n("d"));
        function l(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        var P = (n, e = null) => {
          if (n.length >= 3) return Array.prototype.slice.call(n);
          if ((0, q.default)(n[0]) == "object" && e)
            return e
              .split("")
              .filter((e) => n[0][e] !== void 0)
              .map((e) => n[0][e]);
          return n[0];
        };
        z.default = P;
      },
      {
        d: 93,
      },
    ],
    95: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = l(n("wQ"));
        function l(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        var P = (...n) => {
          try {
            return new q.default(...n), true;
          } catch (n) {
            return false;
          }
        };
        z.default = P;
      },
      {
        wQ: 2,
      },
    ],
    96: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.version = void 0);
        const q = (z.version = "2.6.0");
      },
      {},
    ],
    97: [
      function (n, e, z) {
        "use strict";
        (function (n, z) {
          "use strict";
          if (typeof e === "object" && typeof e.exports === "object")
            e.exports = n.document
              ? z(n, true)
              : function (n) {
                  if (!n.document)
                    throw new Error("jQuery requires a window with a document");
                  return z(n);
                };
          else z(n);
        })(typeof window !== "undefined" ? window : void 0, function (n, e) {
          "use strict";
          var z = [],
            q = Object.getPrototypeOf,
            l = z.slice,
            P = z.flat
              ? function (n) {
                  return z.flat.call(n);
                }
              : function (n) {
                  return z.concat.apply([], n);
                },
            U = z.push,
            r = z.indexOf,
            F = {},
            a = F.toString,
            t = F.hasOwnProperty,
            b = t.toString,
            p = b.call(Object),
            y = {},
            X = function n(e) {
              return (
                typeof e === "function" &&
                typeof e.nodeType !== "number" &&
                typeof e.item !== "function"
              );
            },
            O = function n(e) {
              return e != null && e === e.window;
            },
            u = n.document,
            d = {
              type: true,
              src: true,
              nonce: true,
              noModule: true,
            };
          function m(n, e, z) {
            z = z || u;
            var q,
              l,
              P = z.createElement("script");
            if (((P.text = n), e))
              for (q in d)
                if (((l = e[q] || (e.getAttribute && e.getAttribute(q))), l))
                  P.setAttribute(q, l);
            z.head.appendChild(P).parentNode.removeChild(P);
          }
          function W(n) {
            if (n == null) return n + "";
            return typeof n === "object" || typeof n === "function"
              ? F[a.call(n)] || "object"
              : typeof n;
          }
          var D = "3.7.1",
            L = /HTML$/i,
            M = function (n, e) {
              return new M.fn.init(n, e);
            };
          if (
            ((M.fn = M.prototype =
              {
                jquery: D,
                constructor: M,
                length: 0,
                toArray: function () {
                  return l.call(this);
                },
                get: function (n) {
                  if (n == null) return l.call(this);
                  return n < 0 ? this[n + this.length] : this[n];
                },
                pushStack: function (n) {
                  var e = M.merge(this.constructor(), n);
                  return (e.prevObject = this), e;
                },
                each: function (n) {
                  return M.each(this, n);
                },
                map: function (n) {
                  return this.pushStack(
                    M.map(this, function (e, z) {
                      return n.call(e, z, e);
                    })
                  );
                },
                slice: function () {
                  return this.pushStack(l.apply(this, arguments));
                },
                first: function () {
                  return this.eq(0);
                },
                last: function () {
                  return this.eq(-1);
                },
                even: function () {
                  return this.pushStack(
                    M.grep(this, function (n, e) {
                      return (e + 1) % 2;
                    })
                  );
                },
                odd: function () {
                  return this.pushStack(
                    M.grep(this, function (n, e) {
                      return e % 2;
                    })
                  );
                },
                eq: function (n) {
                  var e = this.length,
                    z = +n + (n < 0 ? e : 0);
                  return this.pushStack(z >= 0 && z < e ? [this[z]] : []);
                },
                end: function () {
                  return this.prevObject || this.constructor();
                },
                push: U,
                sort: z.sort,
                splice: z.splice,
              }),
            (M.extend = M.fn.extend =
              function () {
                var n,
                  e,
                  z,
                  q,
                  l,
                  P,
                  U = arguments[0] || {},
                  r = 1,
                  F = arguments.length,
                  a = false;
                if (typeof U === "boolean")
                  (a = U), (U = arguments[r] || {}), r++;
                if (typeof U !== "object" && !X(U)) U = {};
                if (r === F) (U = this), r--;
                for (; r < F; r++)
                  if ((n = arguments[r]) != null)
                    for (e in n) {
                      if (((q = n[e]), e === "__proto__" || U === q)) continue;
                      if (
                        a &&
                        q &&
                        (M.isPlainObject(q) || (l = Array.isArray(q)))
                      ) {
                        if (((z = U[e]), l && !Array.isArray(z))) P = [];
                        else if (!l && !M.isPlainObject(z)) P = {};
                        else P = z;
                        (l = false), (U[e] = M.extend(a, P, q));
                      } else if (q !== void 0) U[e] = q;
                    }
                return U;
              }),
            M.extend({
              expando: "jQuery" + (D + Math.random()).replace(/\D/g, ""),
              isReady: true,
              error: function (n) {
                throw new Error(n);
              },
              noop: function () {},
              isPlainObject: function (n) {
                var e, z;
                if (!n || a.call(n) !== "[object Object]") return false;
                if (((e = q(n)), !e)) return true;
                return (
                  (z = t.call(e, "constructor") && e.constructor),
                  typeof z === "function" && b.call(z) === p
                );
              },
              isEmptyObject: function (n) {
                var e;
                for (e in n) return false;
                return true;
              },
              globalEval: function (n, e, z) {
                m(
                  n,
                  {
                    nonce: e && e.nonce,
                  },
                  z
                );
              },
              each: function (n, e) {
                var z,
                  q = 0;
                if (g(n)) {
                  for (z = n.length; q < z; q++)
                    if (e.call(n[q], q, n[q]) === false) break;
                } else for (q in n) if (e.call(n[q], q, n[q]) === false) break;
                return n;
              },
              text: function (n) {
                var e,
                  z = "",
                  q = 0,
                  l = n.nodeType;
                if (!l) while ((e = n[q++])) z += M.text(e);
                if (l === 1 || l === 11) return n.textContent;
                if (l === 9) return n.documentElement.textContent;
                if (l === 3 || l === 4) return n.nodeValue;
                return z;
              },
              makeArray: function (n, e) {
                var z = e || [];
                if (n != null)
                  if (g(Object(n))) M.merge(z, typeof n === "string" ? [n] : n);
                  else U.call(z, n);
                return z;
              },
              inArray: function (n, e, z) {
                return e == null ? -1 : r.call(e, n, z);
              },
              isXMLDoc: function (n) {
                var e = n && n.namespaceURI,
                  z = n && (n.ownerDocument || n).documentElement;
                return !L.test(e || (z && z.nodeName) || "HTML");
              },
              merge: function (n, e) {
                for (var z = +e.length, q = 0, l = n.length; q < z; q++)
                  n[l++] = e[q];
                return (n.length = l), n;
              },
              grep: function (n, e, z) {
                for (var q, l = [], P = 0, U = n.length, r = !z; P < U; P++)
                  if (((q = !e(n[P], P)), q !== r)) l.push(n[P]);
                return l;
              },
              map: function (n, e, z) {
                var q,
                  l,
                  U = 0,
                  r = [];
                if (g(n)) {
                  for (q = n.length; U < q; U++)
                    if (((l = e(n[U], U, z)), l != null)) r.push(l);
                } else
                  for (U in n) if (((l = e(n[U], U, z)), l != null)) r.push(l);
                return P(r);
              },
              guid: 1,
              support: y,
            }),
            typeof Symbol === "function")
          )
            M.fn[Symbol.iterator] = z[Symbol.iterator];
          function g(n) {
            var e = !!n && "length" in n && n.length,
              z = W(n);
            if (X(n) || O(n)) return false;
            return (
              z === "array" ||
              e === 0 ||
              (typeof e === "number" && e > 0 && e - 1 in n)
            );
          }
          function E(n, e) {
            return n.nodeName && n.nodeName.toLowerCase() === e.toLowerCase();
          }
          M.each(
            "Boolean Number String Function Array Date RegExp Object Error Symbol".split(
              " "
            ),
            function (n, e) {
              F["[object " + e + "]"] = e.toLowerCase();
            }
          );
          var J = z.pop,
            i = z.sort,
            w = z.splice,
            k = "[\\x20\\t\\r\\n\\f]",
            K = new RegExp(
              "^" + k + "+|((?:^|[^\\\\])(?:\\\\.)*)" + k + "+$",
              "g"
            );
          M.contains = function (n, e) {
            var z = e && e.parentNode;
            return (
              n === z ||
              !!(
                z &&
                z.nodeType === 1 &&
                (n.contains
                  ? n.contains(z)
                  : n.compareDocumentPosition &&
                    n.compareDocumentPosition(z) & 16)
              )
            );
          };
          var G = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
          function A(n, e) {
            if (e) {
              if (n === "\0") return "�";
              return (
                n.slice(0, -1) +
                "\\" +
                n.charCodeAt(n.length - 1).toString(16) +
                " "
              );
            }
            return "\\" + n;
          }
          M.escapeSelector = function (n) {
            return (n + "").replace(G, A);
          };
          var I = u,
            j = U;
          (function () {
            var e,
              q,
              P,
              U,
              F,
              a = j,
              b,
              p,
              X,
              O,
              u,
              d = M.expando,
              m = 0,
              W = 0,
              D = zD(),
              L = zD(),
              g = zD(),
              G = zD(),
              A = function (n, e) {
                if (n === e) F = true;
                return 0;
              },
              N =
                "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|" +
                "loop|multiple|open|readonly|required|scoped",
              V =
                "(?:\\\\[\\da-fA-F]{1,6}" +
                k +
                "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",
              T =
                "\\[" +
                k +
                "*(" +
                V +
                ")(?:" +
                k +
                "*([*^$|!~]?=)" +
                k +
                "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" +
                V +
                "))|)" +
                k +
                "*\\]",
              h =
                ":(" +
                V +
                ")(?:\\((" +
                "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
                "((?:\\\\.|[^\\\\()[\\]]|" +
                T +
                ")*)|" +
                ".*" +
                ")\\)|)",
              v = new RegExp(k + "+", "g"),
              Q = new RegExp("^" + k + "*," + k + "*"),
              o = new RegExp("^" + k + "*([>+~]|" + k + ")" + k + "*"),
              H = new RegExp(k + "|>"),
              R = new RegExp(h),
              Y = new RegExp("^" + V + "$"),
              C = {
                ID: new RegExp("^#(" + V + ")"),
                CLASS: new RegExp("^\\.(" + V + ")"),
                TAG: new RegExp("^(" + V + "|[*])"),
                ATTR: new RegExp("^" + T),
                PSEUDO: new RegExp("^" + h),
                CHILD: new RegExp(
                  "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
                    k +
                    "*(even|odd|(([+-]|)(\\d*)n|)" +
                    k +
                    "*(?:([+-]|)" +
                    k +
                    "*(\\d+)|))" +
                    k +
                    "*\\)|)",
                  "i"
                ),
                bool: new RegExp("^(?:" + N + ")$", "i"),
                needsContext: new RegExp(
                  "^" +
                    k +
                    "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
                    k +
                    "*((?:-\\d)?\\d*)" +
                    k +
                    "*\\)|)(?=[^-]|$)",
                  "i"
                ),
              },
              c = /^(?:input|select|textarea|button)$/i,
              S = /^h\d$/i,
              B = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
              x = /[+~]/,
              f = new RegExp(
                "\\\\[\\da-fA-F]{1,6}" + k + "?|\\\\([^\\r\\n\\f])",
                "g"
              ),
              s = function (n, e) {
                var z = "0x" + n.slice(1) - 65536;
                if (e) return e;
                return z < 0
                  ? String.fromCharCode(z + 65536)
                  : String.fromCharCode((z >> 10) | 55296, (z & 1023) | 56320);
              },
              Z = function () {
                Qg();
              },
              KJ = Hq(
                function (n) {
                  return n.disabled === true && E(n, "fieldset");
                },
                {
                  dir: "parentNode",
                  next: "legend",
                }
              );
            function Ez() {
              try {
                return b.activeElement;
              } catch (n) {}
            }
            try {
              a.apply((z = l.call(I.childNodes)), I.childNodes),
                z[I.childNodes.length].nodeType;
            } catch (n) {
              a = {
                apply: function (n, e) {
                  j.apply(n, l.call(e));
                },
                call: function (n) {
                  j.apply(n, l.call(arguments, 1));
                },
              };
            }
            function OY(n, e, z, q) {
              var l,
                P,
                U,
                r,
                F,
                t,
                p,
                u = e && e.ownerDocument,
                m = e ? e.nodeType : 9;
              if (
                ((z = z || []),
                typeof n !== "string" || !n || (m !== 1 && m !== 9 && m !== 11))
              )
                return z;
              if (!q)
                if ((Qg(e), (e = e || b), X)) {
                  if (m !== 11 && (F = B.exec(n)))
                    if ((l = F[1])) {
                      if (m === 9)
                        if ((U = e.getElementById(l))) {
                          if (U.id === l) return a.call(z, U), z;
                        } else return z;
                      else if (
                        u &&
                        (U = u.getElementById(l)) &&
                        OY.contains(e, U) &&
                        U.id === l
                      )
                        return a.call(z, U), z;
                    } else if (F[2])
                      return a.apply(z, e.getElementsByTagName(n)), z;
                    else if ((l = F[3]) && e.getElementsByClassName)
                      return a.apply(z, e.getElementsByClassName(l)), z;
                  if (!G[n + " "] && (!O || !O.test(n))) {
                    if (
                      ((p = n), (u = e), m === 1 && (H.test(n) || o.test(n)))
                    ) {
                      if (
                        ((u = (x.test(n) && ju(e.parentNode)) || e),
                        u != e || !y.scope)
                      )
                        if ((r = e.getAttribute("id"))) r = M.escapeSelector(r);
                        else e.setAttribute("id", (r = d));
                      (t = hn(n)), (P = t.length);
                      while (P--)
                        t[P] = (r ? "#" + r : ":scope") + " " + pP(t[P]);
                      p = t.join(",");
                    }
                    try {
                      return a.apply(z, u.querySelectorAll(p)), z;
                    } catch (e) {
                      G(n, true);
                    } finally {
                      if (r === d) e.removeAttribute("id");
                    }
                  }
                }
              return bT(n.replace(K, "$1"), e, z, q);
            }
            function zD() {
              var n = [];
              function e(z, l) {
                if (n.push(z + " ") > q.cacheLength) delete e[n.shift()];
                return (e[z + " "] = l);
              }
              return e;
            }
            function pg(n) {
              return (n[d] = true), n;
            }
            function kW(n) {
              var e = b.createElement("fieldset");
              try {
                return !!n(e);
              } catch (n) {
                return false;
              } finally {
                if (e.parentNode) e.parentNode.removeChild(e);
                e = null;
              }
            }
            function KZ(n) {
              return function (e) {
                return E(e, "input") && e.type === n;
              };
            }
            function gt(n) {
              return function (e) {
                return (E(e, "input") || E(e, "button")) && e.type === n;
              };
            }
            function dV(n) {
              return function (e) {
                if ("form" in e) {
                  if (e.parentNode && e.disabled === false) {
                    if ("label" in e)
                      if ("label" in e.parentNode)
                        return e.parentNode.disabled === n;
                      else return e.disabled === n;
                    return (
                      e.isDisabled === n || (e.isDisabled !== !n && KJ(e) === n)
                    );
                  }
                  return e.disabled === n;
                } else if ("label" in e) return e.disabled === n;
                return false;
              };
            }
            function wP(n) {
              return pg(function (e) {
                return (
                  (e = +e),
                  pg(function (z, q) {
                    var l,
                      P = n([], z.length, e),
                      U = P.length;
                    while (U--) if (z[(l = P[U])]) z[l] = !(q[l] = z[l]);
                  })
                );
              });
            }
            function ju(n) {
              return n && typeof n.getElementsByTagName !== "undefined" && n;
            }
            function Qg(n) {
              var e,
                z = n ? n.ownerDocument || n : I;
              if (z == b || z.nodeType !== 9 || !z.documentElement) return b;
              if (
                ((b = z),
                (p = b.documentElement),
                (X = !M.isXMLDoc(b)),
                (u =
                  p.matches || p.webkitMatchesSelector || p.msMatchesSelector),
                p.msMatchesSelector &&
                  I != b &&
                  (e = b.defaultView) &&
                  e.top !== e)
              )
                e.addEventListener("unload", Z);
              if (
                ((y.getById = kW(function (n) {
                  return (
                    (p.appendChild(n).id = M.expando),
                    !b.getElementsByName ||
                      !b.getElementsByName(M.expando).length
                  );
                })),
                (y.disconnectedMatch = kW(function (n) {
                  return u.call(n, "*");
                })),
                (y.scope = kW(function () {
                  return b.querySelectorAll(":scope");
                })),
                (y.cssHas = kW(function () {
                  try {
                    return b.querySelector(":has(*,:jqfake)"), false;
                  } catch (n) {
                    return true;
                  }
                })),
                y.getById)
              )
                (q.filter.ID = function (n) {
                  var e = n.replace(f, s);
                  return function (n) {
                    return n.getAttribute("id") === e;
                  };
                }),
                  (q.find.ID = function (n, e) {
                    if (typeof e.getElementById !== "undefined" && X) {
                      var z = e.getElementById(n);
                      return z ? [z] : [];
                    }
                  });
              else
                (q.filter.ID = function (n) {
                  var e = n.replace(f, s);
                  return function (n) {
                    var z =
                      typeof n.getAttributeNode !== "undefined" &&
                      n.getAttributeNode("id");
                    return z && z.value === e;
                  };
                }),
                  (q.find.ID = function (n, e) {
                    if (typeof e.getElementById !== "undefined" && X) {
                      var z,
                        q,
                        l,
                        P = e.getElementById(n);
                      if (P) {
                        if (
                          ((z = P.getAttributeNode("id")), z && z.value === n)
                        )
                          return [P];
                        (l = e.getElementsByName(n)), (q = 0);
                        while ((P = l[q++]))
                          if (
                            ((z = P.getAttributeNode("id")), z && z.value === n)
                          )
                            return [P];
                      }
                      return [];
                    }
                  });
              if (
                ((q.find.TAG = function (n, e) {
                  if (typeof e.getElementsByTagName !== "undefined")
                    return e.getElementsByTagName(n);
                  else return e.querySelectorAll(n);
                }),
                (q.find.CLASS = function (n, e) {
                  if (typeof e.getElementsByClassName !== "undefined" && X)
                    return e.getElementsByClassName(n);
                }),
                (O = []),
                kW(function (n) {
                  var e;
                  if (
                    ((p.appendChild(n).innerHTML =
                      "<a id='" +
                      d +
                      "' href='' disabled='disabled'></a>" +
                      "<select id='" +
                      d +
                      "-\r\\' disabled='disabled'>" +
                      "<option selected=''></option></select>"),
                    !n.querySelectorAll("[selected]").length)
                  )
                    O.push("\\[" + k + "*(?:value|" + N + ")");
                  if (!n.querySelectorAll("[id~=" + d + "-]").length)
                    O.push("~=");
                  if (!n.querySelectorAll("a#" + d + "+*").length)
                    O.push(".#.+[+~]");
                  if (!n.querySelectorAll(":checked").length)
                    O.push(":checked");
                  if (
                    ((e = b.createElement("input")),
                    e.setAttribute("type", "hidden"),
                    n.appendChild(e).setAttribute("name", "D"),
                    (p.appendChild(n).disabled = true),
                    n.querySelectorAll(":disabled").length !== 2)
                  )
                    O.push(":enabled", ":disabled");
                  if (
                    ((e = b.createElement("input")),
                    e.setAttribute("name", ""),
                    n.appendChild(e),
                    !n.querySelectorAll("[name='']").length)
                  )
                    O.push("\\[" + k + "*name" + k + "*=" + k + "*(?:''|\"\")");
                }),
                !y.cssHas)
              )
                O.push(":has");
              return (
                (O = O.length && new RegExp(O.join("|"))),
                (A = function (n, e) {
                  if (n === e) return (F = true), 0;
                  var z =
                    !n.compareDocumentPosition - !e.compareDocumentPosition;
                  if (z) return z;
                  if (
                    ((z =
                      (n.ownerDocument || n) == (e.ownerDocument || e)
                        ? n.compareDocumentPosition(e)
                        : 1),
                    z & 1 ||
                      (!y.sortDetached && e.compareDocumentPosition(n) === z))
                  ) {
                    if (n === b || (n.ownerDocument == I && OY.contains(I, n)))
                      return -1;
                    if (e === b || (e.ownerDocument == I && OY.contains(I, e)))
                      return 1;
                    return U ? r.call(U, n) - r.call(U, e) : 0;
                  }
                  return z & 4 ? -1 : 1;
                }),
                b
              );
            }
            for (e in ((OY.matches = function (n, e) {
              return OY(n, null, null, e);
            }),
            (OY.matchesSelector = function (n, e) {
              if ((Qg(n), X && !G[e + " "] && (!O || !O.test(e))))
                try {
                  var z = u.call(n, e);
                  if (
                    z ||
                    y.disconnectedMatch ||
                    (n.document && n.document.nodeType !== 11)
                  )
                    return z;
                } catch (n) {
                  G(e, true);
                }
              return OY(e, b, null, [n]).length > 0;
            }),
            (OY.contains = function (n, e) {
              if ((n.ownerDocument || n) != b) Qg(n);
              return M.contains(n, e);
            }),
            (OY.attr = function (n, e) {
              if ((n.ownerDocument || n) != b) Qg(n);
              var z = q.attrHandle[e.toLowerCase()],
                l =
                  z && t.call(q.attrHandle, e.toLowerCase())
                    ? z(n, e, !X)
                    : void 0;
              if (l !== void 0) return l;
              return n.getAttribute(e);
            }),
            (OY.error = function (n) {
              throw new Error("Syntax error, unrecognized expression: " + n);
            }),
            (M.uniqueSort = function (n) {
              var e,
                z = [],
                q = 0,
                P = 0;
              if (
                ((F = !y.sortStable),
                (U = !y.sortStable && l.call(n, 0)),
                i.call(n, A),
                F)
              ) {
                while ((e = n[P++])) if (e === n[P]) q = z.push(P);
                while (q--) w.call(n, z[q], 1);
              }
              return (U = null), n;
            }),
            (M.fn.uniqueSort = function () {
              return this.pushStack(M.uniqueSort(l.apply(this)));
            }),
            (q = M.expr =
              {
                cacheLength: 50,
                createPseudo: pg,
                match: C,
                attrHandle: {},
                find: {},
                relative: {
                  ">": {
                    dir: "parentNode",
                    first: true,
                  },
                  " ": {
                    dir: "parentNode",
                  },
                  "+": {
                    dir: "previousSibling",
                    first: true,
                  },
                  "~": {
                    dir: "previousSibling",
                  },
                },
                preFilter: {
                  ATTR: function (n) {
                    if (
                      ((n[1] = n[1].replace(f, s)),
                      (n[3] = (n[3] || n[4] || n[5] || "").replace(f, s)),
                      n[2] === "~=")
                    )
                      n[3] = " " + n[3] + " ";
                    return n.slice(0, 4);
                  },
                  CHILD: function (n) {
                    if (
                      ((n[1] = n[1].toLowerCase()), n[1].slice(0, 3) === "nth")
                    ) {
                      if (!n[3]) OY.error(n[0]);
                      (n[4] = +(n[4]
                        ? n[5] + (n[6] || 1)
                        : 2 * (n[3] === "even" || n[3] === "odd"))),
                        (n[5] = +(n[7] + n[8] || n[3] === "odd"));
                    } else if (n[3]) OY.error(n[0]);
                    return n;
                  },
                  PSEUDO: function (n) {
                    var e,
                      z = !n[6] && n[2];
                    if (C.CHILD.test(n[0])) return null;
                    if (n[3]) n[2] = n[4] || n[5] || "";
                    else if (
                      z &&
                      R.test(z) &&
                      (e = hn(z, true)) &&
                      (e = z.indexOf(")", z.length - e) - z.length)
                    )
                      (n[0] = n[0].slice(0, e)), (n[2] = z.slice(0, e));
                    return n.slice(0, 3);
                  },
                },
                filter: {
                  TAG: function (n) {
                    var e = n.replace(f, s).toLowerCase();
                    return n === "*"
                      ? function () {
                          return true;
                        }
                      : function (n) {
                          return E(n, e);
                        };
                  },
                  CLASS: function (n) {
                    var e = D[n + " "];
                    return (
                      e ||
                      ((e = new RegExp(
                        "(^|" + k + ")" + n + "(" + k + "|$)"
                      )) &&
                        D(n, function (n) {
                          return e.test(
                            (typeof n.className === "string" && n.className) ||
                              (typeof n.getAttribute !== "undefined" &&
                                n.getAttribute("class")) ||
                              ""
                          );
                        }))
                    );
                  },
                  ATTR: function (n, e, z) {
                    return function (q) {
                      var l = OY.attr(q, n);
                      if (l == null) return e === "!=";
                      if (!e) return true;
                      if (((l += ""), e === "=")) return l === z;
                      if (e === "!=") return l !== z;
                      if (e === "^=") return z && l.indexOf(z) === 0;
                      if (e === "*=") return z && l.indexOf(z) > -1;
                      if (e === "$=") return z && l.slice(-z.length) === z;
                      if (e === "~=")
                        return (" " + l.replace(v, " ") + " ").indexOf(z) > -1;
                      if (e === "|=")
                        return l === z || l.slice(0, z.length + 1) === z + "-";
                      return false;
                    };
                  },
                  CHILD: function (n, e, z, q, l) {
                    var P = n.slice(0, 3) !== "nth",
                      U = n.slice(-4) !== "last",
                      r = e === "of-type";
                    return q === 1 && l === 0
                      ? function (n) {
                          return !!n.parentNode;
                        }
                      : function (e, z, F) {
                          var a,
                            t,
                            b,
                            p,
                            y,
                            X = P !== U ? "nextSibling" : "previousSibling",
                            O = e.parentNode,
                            u = r && e.nodeName.toLowerCase(),
                            W = !F && !r,
                            D = false;
                          if (O) {
                            if (P) {
                              while (X) {
                                b = e;
                                while ((b = b[X]))
                                  if (r ? E(b, u) : b.nodeType === 1)
                                    return false;
                                y = X = n === "only" && !y && "nextSibling";
                              }
                              return true;
                            }
                            if (
                              ((y = [U ? O.firstChild : O.lastChild]), U && W)
                            ) {
                              (t = O[d] || (O[d] = {})),
                                (a = t[n] || []),
                                (p = a[0] === m && a[1]),
                                (D = p && a[2]),
                                (b = p && O.childNodes[p]);
                              while (
                                (b =
                                  (++p && b && b[X]) || (D = p = 0) || y.pop())
                              )
                                if (b.nodeType === 1 && ++D && b === e) {
                                  t[n] = [m, p, D];
                                  break;
                                }
                            } else {
                              if (W)
                                (t = e[d] || (e[d] = {})),
                                  (a = t[n] || []),
                                  (p = a[0] === m && a[1]),
                                  (D = p);
                              if (D === false)
                                while (
                                  (b =
                                    (++p && b && b[X]) ||
                                    (D = p = 0) ||
                                    y.pop())
                                )
                                  if ((r ? E(b, u) : b.nodeType === 1) && ++D) {
                                    if (W)
                                      (t = b[d] || (b[d] = {})),
                                        (t[n] = [m, D]);
                                    if (b === e) break;
                                  }
                            }
                            return (
                              (D -= l), D === q || (D % q === 0 && D / q >= 0)
                            );
                          }
                        };
                  },
                  PSEUDO: function (n, e) {
                    var z,
                      l =
                        q.pseudos[n] ||
                        q.setFilters[n.toLowerCase()] ||
                        OY.error("unsupported pseudo: " + n);
                    if (l[d]) return l(e);
                    if (l.length > 1)
                      return (
                        (z = [n, n, "", e]),
                        q.setFilters.hasOwnProperty(n.toLowerCase())
                          ? pg(function (n, z) {
                              var q,
                                P = l(n, e),
                                U = P.length;
                              while (U--)
                                (q = r.call(n, P[U])), (n[q] = !(z[q] = P[U]));
                            })
                          : function (n) {
                              return l(n, 0, z);
                            }
                      );
                    return l;
                  },
                },
                pseudos: {
                  not: pg(function (n) {
                    var e = [],
                      z = [],
                      q = sb(n.replace(K, "$1"));
                    return q[d]
                      ? pg(function (n, e, z, l) {
                          var P,
                            U = q(n, null, l, []),
                            r = n.length;
                          while (r--) if ((P = U[r])) n[r] = !(e[r] = P);
                        })
                      : function (n, l, P) {
                          return (
                            (e[0] = n),
                            q(e, null, P, z),
                            (e[0] = null),
                            !z.pop()
                          );
                        };
                  }),
                  has: pg(function (n) {
                    return function (e) {
                      return OY(n, e).length > 0;
                    };
                  }),
                  contains: pg(function (n) {
                    return (
                      (n = n.replace(f, s)),
                      function (e) {
                        return (e.textContent || M.text(e)).indexOf(n) > -1;
                      }
                    );
                  }),
                  lang: pg(function (n) {
                    if (!Y.test(n || "")) OY.error("unsupported lang: " + n);
                    return (
                      (n = n.replace(f, s).toLowerCase()),
                      function (e) {
                        var z;
                        do {
                          if (
                            (z = X
                              ? e.lang
                              : e.getAttribute("xml:lang") ||
                                e.getAttribute("lang"))
                          )
                            return (
                              (z = z.toLowerCase()),
                              z === n || z.indexOf(n + "-") === 0
                            );
                        } while ((e = e.parentNode) && e.nodeType === 1);
                        return false;
                      }
                    );
                  }),
                  target: function (e) {
                    var z = n.location && n.location.hash;
                    return z && z.slice(1) === e.id;
                  },
                  root: function (n) {
                    return n === p;
                  },
                  focus: function (n) {
                    return (
                      n === Ez() &&
                      b.hasFocus() &&
                      !!(n.type || n.href || ~n.tabIndex)
                    );
                  },
                  enabled: dV(false),
                  disabled: dV(true),
                  checked: function (n) {
                    return (
                      (E(n, "input") && !!n.checked) ||
                      (E(n, "option") && !!n.selected)
                    );
                  },
                  selected: function (n) {
                    if (n.parentNode) n.parentNode.selectedIndex;
                    return n.selected === true;
                  },
                  empty: function (n) {
                    for (n = n.firstChild; n; n = n.nextSibling)
                      if (n.nodeType < 6) return false;
                    return true;
                  },
                  parent: function (n) {
                    return !q.pseudos.empty(n);
                  },
                  header: function (n) {
                    return S.test(n.nodeName);
                  },
                  input: function (n) {
                    return c.test(n.nodeName);
                  },
                  button: function (n) {
                    return (
                      (E(n, "input") && n.type === "button") || E(n, "button")
                    );
                  },
                  text: function (n) {
                    var e;
                    return (
                      E(n, "input") &&
                      n.type === "text" &&
                      ((e = n.getAttribute("type")) == null ||
                        e.toLowerCase() === "text")
                    );
                  },
                  first: wP(function () {
                    return [0];
                  }),
                  last: wP(function (n, e) {
                    return [e - 1];
                  }),
                  eq: wP(function (n, e, z) {
                    return [z < 0 ? z + e : z];
                  }),
                  even: wP(function (n, e) {
                    for (var z = 0; z < e; z += 2) n.push(z);
                    return n;
                  }),
                  odd: wP(function (n, e) {
                    for (var z = 1; z < e; z += 2) n.push(z);
                    return n;
                  }),
                  lt: wP(function (n, e, z) {
                    var q;
                    if (z < 0) q = z + e;
                    else if (z > e) q = e;
                    else q = z;
                    for (; --q >= 0; ) n.push(q);
                    return n;
                  }),
                  gt: wP(function (n, e, z) {
                    for (var q = z < 0 ? z + e : z; ++q < e; ) n.push(q);
                    return n;
                  }),
                },
              }),
            (q.pseudos.nth = q.pseudos.eq),
            {
              radio: true,
              checkbox: true,
              file: true,
              password: true,
              image: true,
            }))
              q.pseudos[e] = KZ(e);
            for (e in {
              submit: true,
              reset: true,
            })
              q.pseudos[e] = gt(e);
            function tH() {}
            function hn(n, e) {
              var z,
                l,
                P,
                U,
                r,
                F,
                a,
                t = L[n + " "];
              if (t) return e ? 0 : t.slice(0);
              (r = n), (F = []), (a = q.preFilter);
              while (r) {
                if (!z || (l = Q.exec(r))) {
                  if (l) r = r.slice(l[0].length) || r;
                  F.push((P = []));
                }
                if (((z = false), (l = o.exec(r))))
                  (z = l.shift()),
                    P.push({
                      value: z,
                      type: l[0].replace(K, " "),
                    }),
                    (r = r.slice(z.length));
                for (U in q.filter)
                  if ((l = C[U].exec(r)) && (!a[U] || (l = a[U](l))))
                    (z = l.shift()),
                      P.push({
                        value: z,
                        type: U,
                        matches: l,
                      }),
                      (r = r.slice(z.length));
                if (!z) break;
              }
              if (e) return r.length;
              return r ? OY.error(n) : L(n, F).slice(0);
            }
            function pP(n) {
              for (var e = 0, z = n.length, q = ""; e < z; e++) q += n[e].value;
              return q;
            }
            function Hq(n, e, z) {
              var q = e.dir,
                l = e.next,
                P = l || q,
                U = z && P === "parentNode",
                r = W++;
              return e.first
                ? function (e, z, l) {
                    while ((e = e[q]))
                      if (e.nodeType === 1 || U) return n(e, z, l);
                    return false;
                  }
                : function (e, z, F) {
                    var a,
                      t,
                      b = [m, r];
                    if (F) {
                      while ((e = e[q]))
                        if (e.nodeType === 1 || U) if (n(e, z, F)) return true;
                    } else
                      while ((e = e[q]))
                        if (e.nodeType === 1 || U)
                          if (((t = e[d] || (e[d] = {})), l && E(e, l)))
                            e = e[q] || e;
                          else if ((a = t[P]) && a[0] === m && a[1] === r)
                            return (b[2] = a[2]);
                          else if (((t[P] = b), (b[2] = n(e, z, F))))
                            return true;
                    return false;
                  };
            }
            function de(n) {
              return n.length > 1
                ? function (e, z, q) {
                    var l = n.length;
                    while (l--) if (!n[l](e, z, q)) return false;
                    return true;
                  }
                : n[0];
            }
            function mL(n, e, z) {
              for (var q = 0, l = e.length; q < l; q++) OY(n, e[q], z);
              return z;
            }
            function Ac(n, e, z, q, l) {
              for (
                var P, U = [], r = 0, F = n.length, a = e != null;
                r < F;
                r++
              )
                if ((P = n[r]))
                  if (!z || z(P, q, l)) if ((U.push(P), a)) e.push(r);
              return U;
            }
            function Lu(n, e, z, q, l, P) {
              if (q && !q[d]) q = Lu(q);
              if (l && !l[d]) l = Lu(l, P);
              return pg(function (P, U, F, t) {
                var b,
                  p,
                  y,
                  X,
                  O = [],
                  u = [],
                  d = U.length,
                  m = P || mL(e || "*", F.nodeType ? [F] : F, []),
                  W = n && (P || !e) ? Ac(m, O, n, F, t) : m;
                if (z) (X = l || (P ? n : d || q) ? [] : U), z(W, X, F, t);
                else X = W;
                if (q) {
                  (b = Ac(X, u)), q(b, [], F, t), (p = b.length);
                  while (p--) if ((y = b[p])) X[u[p]] = !(W[u[p]] = y);
                }
                if (P) {
                  if (l || n) {
                    if (l) {
                      (b = []), (p = X.length);
                      while (p--) if ((y = X[p])) b.push((W[p] = y));
                      l(null, (X = []), b, t);
                    }
                    p = X.length;
                    while (p--)
                      if ((y = X[p]) && (b = l ? r.call(P, y) : O[p]) > -1)
                        P[b] = !(U[b] = y);
                  }
                } else if (((X = Ac(X === U ? X.splice(d, X.length) : X)), l))
                  l(null, U, X, t);
                else a.apply(U, X);
              });
            }
            function FN(n) {
              for (
                var e,
                  z,
                  l,
                  U = n.length,
                  F = q.relative[n[0].type],
                  a = F || q.relative[" "],
                  t = F ? 1 : 0,
                  b = Hq(
                    function (n) {
                      return n === e;
                    },
                    a,
                    true
                  ),
                  p = Hq(
                    function (n) {
                      return r.call(e, n) > -1;
                    },
                    a,
                    true
                  ),
                  y = [
                    function (n, z, q) {
                      var l =
                        (!F && (q || z != P)) ||
                        ((e = z).nodeType ? b(n, z, q) : p(n, z, q));
                      return (e = null), l;
                    },
                  ];
                t < U;
                t++
              )
                if ((z = q.relative[n[t].type])) y = [Hq(de(y), z)];
                else {
                  if (
                    ((z = q.filter[n[t].type].apply(null, n[t].matches)), z[d])
                  ) {
                    for (l = ++t; l < U; l++) if (q.relative[n[l].type]) break;
                    return Lu(
                      t > 1 && de(y),
                      t > 1 &&
                        pP(
                          n.slice(0, t - 1).concat({
                            value: n[t - 2].type === " " ? "*" : "",
                          })
                        ).replace(K, "$1"),
                      z,
                      t < l && FN(n.slice(t, l)),
                      l < U && FN((n = n.slice(l))),
                      l < U && pP(n)
                    );
                  }
                  y.push(z);
                }
              return de(y);
            }
            function WA(n, e) {
              var z = e.length > 0,
                l = n.length > 0,
                U = function (U, r, F, t, p) {
                  var y,
                    O,
                    u,
                    d = 0,
                    W = "0",
                    D = U && [],
                    L = [],
                    g = P,
                    E = U || (l && q.find.TAG("*", p)),
                    i = (m += g == null ? 1 : Math.random() || 0.1),
                    w = E.length;
                  if (p) P = r == b || r || p;
                  for (; W !== w && (y = E[W]) != null; W++) {
                    if (l && y) {
                      if (((O = 0), !r && y.ownerDocument != b))
                        Qg(y), (F = !X);
                      while ((u = n[O++]))
                        if (u(y, r || b, F)) {
                          a.call(t, y);
                          break;
                        }
                      if (p) m = i;
                    }
                    if (z) {
                      if ((y = !u && y)) d--;
                      if (U) D.push(y);
                    }
                  }
                  if (((d += W), z && W !== d)) {
                    O = 0;
                    while ((u = e[O++])) u(D, L, r, F);
                    if (U) {
                      if (d > 0)
                        while (W--) if (!(D[W] || L[W])) L[W] = J.call(t);
                      L = Ac(L);
                    }
                    if (
                      (a.apply(t, L),
                      p && !U && L.length > 0 && d + e.length > 1)
                    )
                      M.uniqueSort(t);
                  }
                  if (p) (m = i), (P = g);
                  return D;
                };
              return z ? pg(U) : U;
            }
            function sb(n, e) {
              var z,
                q = [],
                l = [],
                P = g[n + " "];
              if (!P) {
                if (!e) e = hn(n);
                z = e.length;
                while (z--)
                  if (((P = FN(e[z])), P[d])) q.push(P);
                  else l.push(P);
                (P = g(n, WA(l, q))), (P.selector = n);
              }
              return P;
            }
            function bT(n, e, z, l) {
              var P,
                U,
                r,
                F,
                t,
                b = typeof n === "function" && n,
                p = !l && hn((n = b.selector || n));
              if (((z = z || []), p.length === 1)) {
                if (
                  ((U = p[0] = p[0].slice(0)),
                  U.length > 2 &&
                    (r = U[0]).type === "ID" &&
                    e.nodeType === 9 &&
                    X &&
                    q.relative[U[1].type])
                ) {
                  if (
                    ((e = (q.find.ID(r.matches[0].replace(f, s), e) || [])[0]),
                    !e)
                  )
                    return z;
                  else if (b) e = e.parentNode;
                  n = n.slice(U.shift().value.length);
                }
                P = C.needsContext.test(n) ? 0 : U.length;
                while (P--) {
                  if (((r = U[P]), q.relative[(F = r.type)])) break;
                  if ((t = q.find[F]))
                    if (
                      (l = t(
                        r.matches[0].replace(f, s),
                        (x.test(U[0].type) && ju(e.parentNode)) || e
                      ))
                    ) {
                      if ((U.splice(P, 1), (n = l.length && pP(U)), !n))
                        return a.apply(z, l), z;
                      break;
                    }
                }
              }
              return (
                (b || sb(n, p))(
                  l,
                  e,
                  !X,
                  z,
                  !e || (x.test(n) && ju(e.parentNode)) || e
                ),
                z
              );
            }
            (tH.prototype = q.filters = q.pseudos),
              (q.setFilters = new tH()),
              (y.sortStable = d.split("").sort(A).join("") === d),
              Qg(),
              (y.sortDetached = kW(function (n) {
                return (
                  n.compareDocumentPosition(b.createElement("fieldset")) & 1
                );
              })),
              (M.find = OY),
              (M.expr[":"] = M.expr.pseudos),
              (M.unique = M.uniqueSort),
              (OY.compile = sb),
              (OY.select = bT),
              (OY.setDocument = Qg),
              (OY.tokenize = hn),
              (OY.escape = M.escapeSelector),
              (OY.getText = M.text),
              (OY.isXML = M.isXMLDoc),
              (OY.selectors = M.expr),
              (OY.support = M.support),
              (OY.uniqueSort = M.uniqueSort);
          })();
          var N = function (n, e, z) {
              var q = [],
                l = z !== void 0;
              while ((n = n[e]) && n.nodeType !== 9)
                if (n.nodeType === 1) {
                  if (l && M(n).is(z)) break;
                  q.push(n);
                }
              return q;
            },
            V = function (n, e) {
              for (var z = []; n; n = n.nextSibling)
                if (n.nodeType === 1 && n !== e) z.push(n);
              return z;
            },
            T = M.expr.match.needsContext,
            h =
              /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
          function v(n, e, z) {
            if (X(e))
              return M.grep(n, function (n, q) {
                return !!e.call(n, q, n) !== z;
              });
            if (e.nodeType)
              return M.grep(n, function (n) {
                return (n === e) !== z;
              });
            if (typeof e !== "string")
              return M.grep(n, function (n) {
                return r.call(e, n) > -1 !== z;
              });
            return M.filter(e, n, z);
          }
          (M.filter = function (n, e, z) {
            var q = e[0];
            if (z) n = ":not(" + n + ")";
            if (e.length === 1 && q.nodeType === 1)
              return M.find.matchesSelector(q, n) ? [q] : [];
            return M.find.matches(
              n,
              M.grep(e, function (n) {
                return n.nodeType === 1;
              })
            );
          }),
            M.fn.extend({
              find: function (n) {
                var e,
                  z,
                  q = this.length,
                  l = this;
                if (typeof n !== "string")
                  return this.pushStack(
                    M(n).filter(function () {
                      for (e = 0; e < q; e++)
                        if (M.contains(l[e], this)) return true;
                    })
                  );
                for (z = this.pushStack([]), e = 0; e < q; e++)
                  M.find(n, l[e], z);
                return q > 1 ? M.uniqueSort(z) : z;
              },
              filter: function (n) {
                return this.pushStack(v(this, n || [], false));
              },
              not: function (n) {
                return this.pushStack(v(this, n || [], true));
              },
              is: function (n) {
                return !!v(
                  this,
                  typeof n === "string" && T.test(n) ? M(n) : n || [],
                  false
                ).length;
              },
            });
          var Q,
            o = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
            H = (M.fn.init = function (n, e, z) {
              var q, l;
              if (!n) return this;
              if (((z = z || Q), typeof n === "string")) {
                if (n[0] === "<" && n[n.length - 1] === ">" && n.length >= 3)
                  q = [null, n, null];
                else q = o.exec(n);
                if (q && (q[1] || !e))
                  if (q[1]) {
                    if (
                      ((e = e instanceof M ? e[0] : e),
                      M.merge(
                        this,
                        M.parseHTML(
                          q[1],
                          e && e.nodeType ? e.ownerDocument || e : u,
                          true
                        )
                      ),
                      h.test(q[1]) && M.isPlainObject(e))
                    )
                      for (q in e)
                        if (X(this[q])) this[q](e[q]);
                        else this.attr(q, e[q]);
                    return this;
                  } else {
                    if (((l = u.getElementById(q[2])), l))
                      (this[0] = l), (this.length = 1);
                    return this;
                  }
                else if (!e || e.jquery) return (e || z).find(n);
                else return this.constructor(e).find(n);
              } else if (n.nodeType)
                return (this[0] = n), (this.length = 1), this;
              else if (X(n)) return z.ready !== void 0 ? z.ready(n) : n(M);
              return M.makeArray(n, this);
            });
          (H.prototype = M.fn), (Q = M(u));
          var R = /^(?:parents|prev(?:Until|All))/,
            Y = {
              children: true,
              contents: true,
              next: true,
              prev: true,
            };
          function C(n, e) {
            while ((n = n[e]) && n.nodeType !== 1);
            return n;
          }
          M.fn.extend({
            has: function (n) {
              var e = M(n, this),
                z = e.length;
              return this.filter(function () {
                for (var n = 0; n < z; n++)
                  if (M.contains(this, e[n])) return true;
              });
            },
            closest: function (n, e) {
              var z,
                q = 0,
                l = this.length,
                P = [],
                U = typeof n !== "string" && M(n);
              if (!T.test(n))
                for (; q < l; q++)
                  for (z = this[q]; z && z !== e; z = z.parentNode)
                    if (
                      z.nodeType < 11 &&
                      (U
                        ? U.index(z) > -1
                        : z.nodeType === 1 && M.find.matchesSelector(z, n))
                    ) {
                      P.push(z);
                      break;
                    }
              return this.pushStack(P.length > 1 ? M.uniqueSort(P) : P);
            },
            index: function (n) {
              if (!n)
                return this[0] && this[0].parentNode
                  ? this.first().prevAll().length
                  : -1;
              if (typeof n === "string") return r.call(M(n), this[0]);
              return r.call(this, n.jquery ? n[0] : n);
            },
            add: function (n, e) {
              return this.pushStack(M.uniqueSort(M.merge(this.get(), M(n, e))));
            },
            addBack: function (n) {
              return this.add(
                n == null ? this.prevObject : this.prevObject.filter(n)
              );
            },
          }),
            M.each(
              {
                parent: function (n) {
                  var e = n.parentNode;
                  return e && e.nodeType !== 11 ? e : null;
                },
                parents: function (n) {
                  return N(n, "parentNode");
                },
                parentsUntil: function (n, e, z) {
                  return N(n, "parentNode", z);
                },
                next: function (n) {
                  return C(n, "nextSibling");
                },
                prev: function (n) {
                  return C(n, "previousSibling");
                },
                nextAll: function (n) {
                  return N(n, "nextSibling");
                },
                prevAll: function (n) {
                  return N(n, "previousSibling");
                },
                nextUntil: function (n, e, z) {
                  return N(n, "nextSibling", z);
                },
                prevUntil: function (n, e, z) {
                  return N(n, "previousSibling", z);
                },
                siblings: function (n) {
                  return V((n.parentNode || {}).firstChild, n);
                },
                children: function (n) {
                  return V(n.firstChild);
                },
                contents: function (n) {
                  if (n.contentDocument != null && q(n.contentDocument))
                    return n.contentDocument;
                  if (E(n, "template")) n = n.content || n;
                  return M.merge([], n.childNodes);
                },
              },
              function (n, e) {
                M.fn[n] = function (z, q) {
                  var l = M.map(this, e, z);
                  if (n.slice(-5) !== "Until") q = z;
                  if (q && typeof q === "string") l = M.filter(q, l);
                  if (this.length > 1) {
                    if (!Y[n]) M.uniqueSort(l);
                    if (R.test(n)) l.reverse();
                  }
                  return this.pushStack(l);
                };
              }
            );
          var c = /[^\x20\t\r\n\f]+/g;
          function S(n) {
            var e = {};
            return (
              M.each(n.match(c) || [], function (n, z) {
                e[z] = true;
              }),
              e
            );
          }
          function B(n) {
            return n;
          }
          function x(n) {
            throw n;
          }
          function f(n, e, z, q) {
            var l;
            try {
              if (n && X((l = n.promise))) l.call(n).done(e).fail(z);
              else if (n && X((l = n.then))) l.call(n, e, z);
              else e.apply(void 0, [n].slice(q));
            } catch (n) {
              z.apply(void 0, [n]);
            }
          }
          (M.Callbacks = function (n) {
            n = typeof n === "string" ? S(n) : M.extend({}, n);
            var e,
              z,
              q,
              l,
              P = [],
              U = [],
              r = -1,
              F = function () {
                for (l = l || n.once, q = e = true; U.length; r = -1) {
                  z = U.shift();
                  while (++r < P.length)
                    if (P[r].apply(z[0], z[1]) === false && n.stopOnFalse)
                      (r = P.length), (z = false);
                }
                if (!n.memory) z = false;
                if (((e = false), l))
                  if (z) P = [];
                  else P = "";
              },
              a = {
                add: function () {
                  if (P) {
                    if (z && !e) (r = P.length - 1), U.push(z);
                    if (
                      ((function e(z) {
                        M.each(z, function (z, q) {
                          if (X(q)) {
                            if (!n.unique || !a.has(q)) P.push(q);
                          } else if (q && q.length && W(q) !== "string") e(q);
                        });
                      })(arguments),
                      z && !e)
                    )
                      F();
                  }
                  return this;
                },
                remove: function () {
                  return (
                    M.each(arguments, function (n, e) {
                      var z;
                      while ((z = M.inArray(e, P, z)) > -1)
                        if ((P.splice(z, 1), z <= r)) r--;
                    }),
                    this
                  );
                },
                has: function (n) {
                  return n ? M.inArray(n, P) > -1 : P.length > 0;
                },
                empty: function () {
                  if (P) P = [];
                  return this;
                },
                disable: function () {
                  return (l = U = []), (P = z = ""), this;
                },
                disabled: function () {
                  return !P;
                },
                lock: function () {
                  if (((l = U = []), !z && !e)) P = z = "";
                  return this;
                },
                locked: function () {
                  return !!l;
                },
                fireWith: function (n, z) {
                  if (!l)
                    if (
                      ((z = z || []),
                      (z = [n, z.slice ? z.slice() : z]),
                      U.push(z),
                      !e)
                    )
                      F();
                  return this;
                },
                fire: function () {
                  return a.fireWith(this, arguments), this;
                },
                fired: function () {
                  return !!q;
                },
              };
            return a;
          }),
            M.extend({
              Deferred: function (e) {
                var z = [
                    [
                      "notify",
                      "progress",
                      M.Callbacks("memory"),
                      M.Callbacks("memory"),
                      2,
                    ],
                    [
                      "resolve",
                      "done",
                      M.Callbacks("once memory"),
                      M.Callbacks("once memory"),
                      0,
                      "resolved",
                    ],
                    [
                      "reject",
                      "fail",
                      M.Callbacks("once memory"),
                      M.Callbacks("once memory"),
                      1,
                      "rejected",
                    ],
                  ],
                  q = "pending",
                  l = {
                    state: function () {
                      return q;
                    },
                    always: function () {
                      return P.done(arguments).fail(arguments), this;
                    },
                    catch: function (n) {
                      return l.then(null, n);
                    },
                    pipe: function () {
                      var n = arguments;
                      return M.Deferred(function (e) {
                        M.each(z, function (z, q) {
                          var l = X(n[q[4]]) && n[q[4]];
                          P[q[1]](function () {
                            var n = l && l.apply(this, arguments);
                            if (n && X(n.promise))
                              n.promise()
                                .progress(e.notify)
                                .done(e.resolve)
                                .fail(e.reject);
                            else e[q[0] + "With"](this, l ? [n] : arguments);
                          });
                        }),
                          (n = null);
                      }).promise();
                    },
                    then: function (e, q, l) {
                      var P = 0;
                      function U(e, z, q, l) {
                        return function () {
                          var r = this,
                            F = arguments,
                            a = function () {
                              var n, a;
                              if (e < P) return;
                              if (((n = q.apply(r, F)), n === z.promise()))
                                throw new TypeError("Thenable self-resolution");
                              if (
                                ((a =
                                  n &&
                                  (typeof n === "object" ||
                                    typeof n === "function") &&
                                  n.then),
                                X(a))
                              )
                                if (l) a.call(n, U(P, z, B, l), U(P, z, x, l));
                                else
                                  P++,
                                    a.call(
                                      n,
                                      U(P, z, B, l),
                                      U(P, z, x, l),
                                      U(P, z, B, z.notifyWith)
                                    );
                              else {
                                if (q !== B) (r = void 0), (F = [n]);
                                (l || z.resolveWith)(r, F);
                              }
                            },
                            t = l
                              ? a
                              : function () {
                                  try {
                                    a();
                                  } catch (n) {
                                    if (M.Deferred.exceptionHook)
                                      M.Deferred.exceptionHook(n, t.error);
                                    if (e + 1 >= P) {
                                      if (q !== x) (r = void 0), (F = [n]);
                                      z.rejectWith(r, F);
                                    }
                                  }
                                };
                          if (e) t();
                          else {
                            if (M.Deferred.getErrorHook)
                              t.error = M.Deferred.getErrorHook();
                            else if (M.Deferred.getStackHook)
                              t.error = M.Deferred.getStackHook();
                            n.setTimeout(t);
                          }
                        };
                      }
                      return M.Deferred(function (n) {
                        z[0][3].add(U(0, n, X(l) ? l : B, n.notifyWith)),
                          z[1][3].add(U(0, n, X(e) ? e : B)),
                          z[2][3].add(U(0, n, X(q) ? q : x));
                      }).promise();
                    },
                    promise: function (n) {
                      return n != null ? M.extend(n, l) : l;
                    },
                  },
                  P = {};
                if (
                  (M.each(z, function (n, e) {
                    var U = e[2],
                      r = e[5];
                    if (((l[e[1]] = U.add), r))
                      U.add(
                        function () {
                          q = r;
                        },
                        z[3 - n][2].disable,
                        z[3 - n][3].disable,
                        z[0][2].lock,
                        z[0][3].lock
                      );
                    U.add(e[3].fire),
                      (P[e[0]] = function () {
                        return (
                          P[e[0] + "With"](
                            this === P ? void 0 : this,
                            arguments
                          ),
                          this
                        );
                      }),
                      (P[e[0] + "With"] = U.fireWith);
                  }),
                  l.promise(P),
                  e)
                )
                  e.call(P, P);
                return P;
              },
              when: function (n) {
                var e = arguments.length,
                  z = e,
                  q = Array(z),
                  P = l.call(arguments),
                  U = M.Deferred(),
                  r = function (n) {
                    return function (z) {
                      if (
                        ((q[n] = this),
                        (P[n] = arguments.length > 1 ? l.call(arguments) : z),
                        !--e)
                      )
                        U.resolveWith(q, P);
                    };
                  };
                if (e <= 1)
                  if (
                    (f(n, U.done(r(z)).resolve, U.reject, !e),
                    U.state() === "pending" || X(P[z] && P[z].then))
                  )
                    return U.then();
                while (z--) f(P[z], r(z), U.reject);
                return U.promise();
              },
            });
          var s = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
          (M.Deferred.exceptionHook = function (e, z) {
            if (n.console && n.console.warn && e && s.test(e.name))
              n.console.warn(
                "jQuery.Deferred exception: " + e.message,
                e.stack,
                z
              );
          }),
            (M.readyException = function (e) {
              n.setTimeout(function () {
                throw e;
              });
            });
          var Z = M.Deferred();
          function KJ() {
            u.removeEventListener("DOMContentLoaded", KJ),
              n.removeEventListener("load", KJ),
              M.ready();
          }
          if (
            ((M.fn.ready = function (n) {
              return (
                Z.then(n).catch(function (n) {
                  M.readyException(n);
                }),
                this
              );
            }),
            M.extend({
              isReady: false,
              readyWait: 1,
              ready: function (n) {
                if (n === true ? --M.readyWait : M.isReady) return;
                if (((M.isReady = true), n !== true && --M.readyWait > 0))
                  return;
                Z.resolveWith(u, [M]);
              },
            }),
            (M.ready.then = Z.then),
            u.readyState === "complete" ||
              (u.readyState !== "loading" && !u.documentElement.doScroll))
          )
            n.setTimeout(M.ready);
          else
            u.addEventListener("DOMContentLoaded", KJ),
              n.addEventListener("load", KJ);
          var Ez = function (n, e, z, q, l, P, U) {
              var r = 0,
                F = n.length,
                a = z == null;
              if (W(z) === "object")
                for (r in ((l = true), z)) Ez(n, e, r, z[r], true, P, U);
              else if (q !== void 0) {
                if (((l = true), !X(q))) U = true;
                if (a)
                  if (U) e.call(n, q), (e = null);
                  else
                    (a = e),
                      (e = function (n, e, z) {
                        return a.call(M(n), z);
                      });
                if (e)
                  for (; r < F; r++)
                    e(n[r], z, U ? q : q.call(n[r], r, e(n[r], z)));
              }
              if (l) return n;
              if (a) return e.call(n);
              return F ? e(n[0], z) : P;
            },
            OY = /^-ms-/,
            zD = /-([a-z])/g;
          function pg(n, e) {
            return e.toUpperCase();
          }
          function kW(n) {
            return n.replace(OY, "ms-").replace(zD, pg);
          }
          var KZ = function (n) {
            return n.nodeType === 1 || n.nodeType === 9 || !+n.nodeType;
          };
          function gt() {
            this.expando = M.expando + gt.uid++;
          }
          (gt.uid = 1),
            (gt.prototype = {
              cache: function (n) {
                var e = n[this.expando];
                if (!e)
                  if (((e = {}), KZ(n)))
                    if (n.nodeType) n[this.expando] = e;
                    else
                      Object.defineProperty(n, this.expando, {
                        value: e,
                        configurable: true,
                      });
                return e;
              },
              set: function (n, e, z) {
                var q,
                  l = this.cache(n);
                if (typeof e === "string") l[kW(e)] = z;
                else for (q in e) l[kW(q)] = e[q];
                return l;
              },
              get: function (n, e) {
                return e === void 0
                  ? this.cache(n)
                  : n[this.expando] && n[this.expando][kW(e)];
              },
              access: function (n, e, z) {
                if (
                  e === void 0 ||
                  (e && typeof e === "string" && z === void 0)
                )
                  return this.get(n, e);
                return this.set(n, e, z), z !== void 0 ? z : e;
              },
              remove: function (n, e) {
                var z,
                  q = n[this.expando];
                if (q === void 0) return;
                if (e !== void 0) {
                  if (Array.isArray(e)) e = e.map(kW);
                  else (e = kW(e)), (e = e in q ? [e] : e.match(c) || []);
                  z = e.length;
                  while (z--) delete q[e[z]];
                }
                if (e === void 0 || M.isEmptyObject(q))
                  if (n.nodeType) n[this.expando] = void 0;
                  else delete n[this.expando];
              },
              hasData: function (n) {
                var e = n[this.expando];
                return e !== void 0 && !M.isEmptyObject(e);
              },
            });
          var dV = new gt(),
            wP = new gt(),
            ju = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
            Qg = /[A-Z]/g;
          function tH(n) {
            if (n === "true") return true;
            if (n === "false") return false;
            if (n === "null") return null;
            if (n === +n + "") return +n;
            if (ju.test(n)) return JSON.parse(n);
            return n;
          }
          function hn(n, e, z) {
            var q;
            if (z === void 0 && n.nodeType === 1)
              if (
                ((q = "data-" + e.replace(Qg, "-$&").toLowerCase()),
                (z = n.getAttribute(q)),
                typeof z === "string")
              ) {
                try {
                  z = tH(z);
                } catch (n) {}
                wP.set(n, e, z);
              } else z = void 0;
            return z;
          }
          M.extend({
            hasData: function (n) {
              return wP.hasData(n) || dV.hasData(n);
            },
            data: function (n, e, z) {
              return wP.access(n, e, z);
            },
            removeData: function (n, e) {
              wP.remove(n, e);
            },
            _data: function (n, e, z) {
              return dV.access(n, e, z);
            },
            _removeData: function (n, e) {
              dV.remove(n, e);
            },
          }),
            M.fn.extend({
              data: function (n, e) {
                var z,
                  q,
                  l,
                  P = this[0],
                  U = P && P.attributes;
                if (n === void 0) {
                  if (this.length)
                    if (
                      ((l = wP.get(P)),
                      P.nodeType === 1 && !dV.get(P, "hasDataAttrs"))
                    ) {
                      z = U.length;
                      while (z--)
                        if (U[z])
                          if (((q = U[z].name), q.indexOf("data-") === 0))
                            (q = kW(q.slice(5))), hn(P, q, l[q]);
                      dV.set(P, "hasDataAttrs", true);
                    }
                  return l;
                }
                if (typeof n === "object")
                  return this.each(function () {
                    wP.set(this, n);
                  });
                return Ez(
                  this,
                  function (e) {
                    var z;
                    if (P && e === void 0) {
                      if (((z = wP.get(P, n)), z !== void 0)) return z;
                      if (((z = hn(P, n)), z !== void 0)) return z;
                      return;
                    }
                    this.each(function () {
                      wP.set(this, n, e);
                    });
                  },
                  null,
                  e,
                  arguments.length > 1,
                  null,
                  true
                );
              },
              removeData: function (n) {
                return this.each(function () {
                  wP.remove(this, n);
                });
              },
            }),
            M.extend({
              queue: function (n, e, z) {
                var q;
                if (n) {
                  if (((e = (e || "fx") + "queue"), (q = dV.get(n, e)), z))
                    if (!q || Array.isArray(z))
                      q = dV.access(n, e, M.makeArray(z));
                    else q.push(z);
                  return q || [];
                }
              },
              dequeue: function (n, e) {
                e = e || "fx";
                var z = M.queue(n, e),
                  q = z.length,
                  l = z.shift(),
                  P = M._queueHooks(n, e),
                  U = function () {
                    M.dequeue(n, e);
                  };
                if (l === "inprogress") (l = z.shift()), q--;
                if (l) {
                  if (e === "fx") z.unshift("inprogress");
                  delete P.stop, l.call(n, U, P);
                }
                if (!q && P) P.empty.fire();
              },
              _queueHooks: function (n, e) {
                var z = e + "queueHooks";
                return (
                  dV.get(n, z) ||
                  dV.access(n, z, {
                    empty: M.Callbacks("once memory").add(function () {
                      dV.remove(n, [e + "queue", z]);
                    }),
                  })
                );
              },
            }),
            M.fn.extend({
              queue: function (n, e) {
                var z = 2;
                if (typeof n !== "string") (e = n), (n = "fx"), z--;
                if (arguments.length < z) return M.queue(this[0], n);
                return e === void 0
                  ? this
                  : this.each(function () {
                      var z = M.queue(this, n, e);
                      if (
                        (M._queueHooks(this, n),
                        n === "fx" && z[0] !== "inprogress")
                      )
                        M.dequeue(this, n);
                    });
              },
              dequeue: function (n) {
                return this.each(function () {
                  M.dequeue(this, n);
                });
              },
              clearQueue: function (n) {
                return this.queue(n || "fx", []);
              },
              promise: function (n, e) {
                var z,
                  q = 1,
                  l = M.Deferred(),
                  P = this,
                  U = this.length,
                  r = function () {
                    if (!--q) l.resolveWith(P, [P]);
                  };
                if (typeof n !== "string") (e = n), (n = void 0);
                n = n || "fx";
                while (U--)
                  if (((z = dV.get(P[U], n + "queueHooks")), z && z.empty))
                    q++, z.empty.add(r);
                return r(), l.promise(e);
              },
            });
          var pP = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
            Hq = new RegExp("^(?:([+-])=|)(" + pP + ")([a-z%]*)$", "i"),
            de = ["Top", "Right", "Bottom", "Left"],
            mL = u.documentElement,
            Ac = function (n) {
              return M.contains(n.ownerDocument, n);
            },
            Lu = {
              composed: true,
            };
          if (mL.getRootNode)
            Ac = function (n) {
              return (
                M.contains(n.ownerDocument, n) ||
                n.getRootNode(Lu) === n.ownerDocument
              );
            };
          var FN = function (n, e) {
            return (
              (n = e || n),
              n.style.display === "none" ||
                (n.style.display === "" &&
                  Ac(n) &&
                  M.css(n, "display") === "none")
            );
          };
          function WA(n, e, z, q) {
            var l,
              P,
              U = 20,
              r = q
                ? function () {
                    return q.cur();
                  }
                : function () {
                    return M.css(n, e, "");
                  },
              F = r(),
              a = (z && z[3]) || (M.cssNumber[e] ? "" : "px"),
              t =
                n.nodeType &&
                (M.cssNumber[e] || (a !== "px" && +F)) &&
                Hq.exec(M.css(n, e));
            if (t && t[3] !== a) {
              (F /= 2), (a = a || t[3]), (t = +F || 1);
              while (U--) {
                if (
                  (M.style(n, e, t + a),
                  (1 - P) * (1 - (P = r() / F || 0.5)) <= 0)
                )
                  U = 0;
                t /= P;
              }
              (t *= 2), M.style(n, e, t + a), (z = z || []);
            }
            if (z)
              if (
                ((t = +t || +F || 0),
                (l = z[1] ? t + (z[1] + 1) * z[2] : +z[2]),
                q)
              )
                (q.unit = a), (q.start = t), (q.end = l);
            return l;
          }
          var sb = {};
          function bT(n) {
            var e,
              z = n.ownerDocument,
              q = n.nodeName,
              l = sb[q];
            if (l) return l;
            if (
              ((e = z.body.appendChild(z.createElement(q))),
              (l = M.css(e, "display")),
              e.parentNode.removeChild(e),
              l === "none")
            )
              l = "block";
            return (sb[q] = l), l;
          }
          function DO(n, e) {
            for (var z, q, l = [], P = 0, U = n.length; P < U; P++) {
              if (((q = n[P]), !q.style)) continue;
              if (((z = q.style.display), e)) {
                if (z === "none")
                  if (((l[P] = dV.get(q, "display") || null), !l[P]))
                    q.style.display = "";
                if (q.style.display === "" && FN(q)) l[P] = bT(q);
              } else if (z !== "none") (l[P] = "none"), dV.set(q, "display", z);
            }
            for (P = 0; P < U; P++) if (l[P] != null) n[P].style.display = l[P];
            return n;
          }
          M.fn.extend({
            show: function () {
              return DO(this, true);
            },
            hide: function () {
              return DO(this);
            },
            toggle: function (n) {
              if (typeof n === "boolean") return n ? this.show() : this.hide();
              return this.each(function () {
                if (FN(this)) M(this).show();
                else M(this).hide();
              });
            },
          });
          var HH = /^(?:checkbox|radio)$/i,
            MK = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i,
            aB = /^$|^module$|\/(?:java|ecma)script/i,
            lf,
            yr,
            hF;
          (lf = u.createDocumentFragment()),
            (yr = lf.appendChild(u.createElement("div"))),
            (hF = u.createElement("input")),
            hF.setAttribute("type", "radio"),
            hF.setAttribute("checked", "checked"),
            hF.setAttribute("name", "t"),
            yr.appendChild(hF),
            (y.checkClone = yr
              .cloneNode(true)
              .cloneNode(true).lastChild.checked),
            (yr.innerHTML = "<textarea>x</textarea>"),
            (y.noCloneChecked = !!yr.cloneNode(true).lastChild.defaultValue),
            (yr.innerHTML = "<option></option>"),
            (y.option = !!yr.lastChild);
          var vz = {
            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: [0, "", ""],
          };
          if (
            ((vz.tbody = vz.tfoot = vz.colgroup = vz.caption = vz.thead),
            (vz.th = vz.td),
            !y.option)
          )
            vz.optgroup = vz.option = [
              1,
              "<select multiple='multiple'>",
              "</select>",
            ];
          function yh(n, e) {
            var z;
            if (typeof n.getElementsByTagName !== "undefined")
              z = n.getElementsByTagName(e || "*");
            else if (typeof n.querySelectorAll !== "undefined")
              z = n.querySelectorAll(e || "*");
            else z = [];
            if (e === void 0 || (e && E(n, e))) return M.merge([n], z);
            return z;
          }
          function Os(n, e) {
            for (var z = 0, q = n.length; z < q; z++)
              dV.set(n[z], "globalEval", !e || dV.get(e[z], "globalEval"));
          }
          var Uu = /<|&#?\w+;/;
          function WW(n, e, z, q, l) {
            for (
              var P,
                U,
                r,
                F,
                a,
                t,
                b = e.createDocumentFragment(),
                p = [],
                y = 0,
                X = n.length;
              y < X;
              y++
            )
              if (((P = n[y]), P || P === 0))
                if (W(P) === "object") M.merge(p, P.nodeType ? [P] : P);
                else if (!Uu.test(P)) p.push(e.createTextNode(P));
                else {
                  (U = U || b.appendChild(e.createElement("div"))),
                    (r = (MK.exec(P) || ["", ""])[1].toLowerCase()),
                    (F = vz[r] || vz._default),
                    (U.innerHTML = F[1] + M.htmlPrefilter(P) + F[2]),
                    (t = F[0]);
                  while (t--) U = U.lastChild;
                  M.merge(p, U.childNodes),
                    (U = b.firstChild),
                    (U.textContent = "");
                }
            (b.textContent = ""), (y = 0);
            while ((P = p[y++])) {
              if (q && M.inArray(P, q) > -1) {
                if (l) l.push(P);
                continue;
              }
              if (((a = Ac(P)), (U = yh(b.appendChild(P), "script")), a)) Os(U);
              if (z) {
                t = 0;
                while ((P = U[t++])) if (aB.test(P.type || "")) z.push(P);
              }
            }
            return b;
          }
          var TT = /^([^.]*)(?:\.(.+)|)/;
          function Hn() {
            return true;
          }
          function Tu() {
            return false;
          }
          function TB(n, e, z, q, l, P) {
            var U, r;
            if (typeof e === "object") {
              if (typeof z !== "string") (q = q || z), (z = void 0);
              for (r in e) TB(n, r, z, q, e[r], P);
              return n;
            }
            if (q == null && l == null) (l = z), (q = z = void 0);
            else if (l == null)
              if (typeof z === "string") (l = q), (q = void 0);
              else (l = q), (q = z), (z = void 0);
            if (l === false) l = Tu;
            else if (!l) return n;
            if (P === 1)
              (U = l),
                (l = function (n) {
                  return M().off(n), U.apply(this, arguments);
                }),
                (l.guid = U.guid || (U.guid = M.guid++));
            return n.each(function () {
              M.event.add(this, e, l, q, z);
            });
          }
          function Sw(n, e, z) {
            if (!z) {
              if (dV.get(n, e) === void 0) M.event.add(n, e, Hn);
              return;
            }
            dV.set(n, e, false),
              M.event.add(n, e, {
                namespace: false,
                handler: function (n) {
                  var z,
                    q = dV.get(this, e);
                  if (n.isTrigger & 1 && this[e]) {
                    if (!q) {
                      if (
                        ((q = l.call(arguments)),
                        dV.set(this, e, q),
                        this[e](),
                        (z = dV.get(this, e)),
                        dV.set(this, e, false),
                        q !== z)
                      )
                        return (
                          n.stopImmediatePropagation(), n.preventDefault(), z
                        );
                    } else if ((M.event.special[e] || {}).delegateType)
                      n.stopPropagation();
                  } else if (q)
                    dV.set(this, e, M.event.trigger(q[0], q.slice(1), this)),
                      n.stopPropagation(),
                      (n.isImmediatePropagationStopped = Hn);
                },
              });
          }
          (M.event = {
            global: {},
            add: function (n, e, z, q, l) {
              var P,
                U,
                r,
                F,
                a,
                t,
                b,
                p,
                y,
                X,
                O,
                u = dV.get(n);
              if (!KZ(n)) return;
              if (z.handler) (P = z), (z = P.handler), (l = P.selector);
              if (l) M.find.matchesSelector(mL, l);
              if (!z.guid) z.guid = M.guid++;
              if (!(F = u.events)) F = u.events = Object.create(null);
              if (!(U = u.handle))
                U = u.handle = function (e) {
                  return typeof M !== "undefined" &&
                    M.event.triggered !== e.type
                    ? M.event.dispatch.apply(n, arguments)
                    : void 0;
                };
              (e = (e || "").match(c) || [""]), (a = e.length);
              while (a--) {
                if (
                  ((r = TT.exec(e[a]) || []),
                  (y = O = r[1]),
                  (X = (r[2] || "").split(".").sort()),
                  !y)
                )
                  continue;
                if (
                  ((b = M.event.special[y] || {}),
                  (y = (l ? b.delegateType : b.bindType) || y),
                  (b = M.event.special[y] || {}),
                  (t = M.extend(
                    {
                      type: y,
                      origType: O,
                      data: q,
                      handler: z,
                      guid: z.guid,
                      selector: l,
                      needsContext: l && M.expr.match.needsContext.test(l),
                      namespace: X.join("."),
                    },
                    P
                  )),
                  !(p = F[y]))
                )
                  if (
                    ((p = F[y] = []),
                    (p.delegateCount = 0),
                    !b.setup || b.setup.call(n, q, X, U) === false)
                  )
                    if (n.addEventListener) n.addEventListener(y, U);
                if (b.add)
                  if ((b.add.call(n, t), !t.handler.guid))
                    t.handler.guid = z.guid;
                if (l) p.splice(p.delegateCount++, 0, t);
                else p.push(t);
                M.event.global[y] = true;
              }
            },
            remove: function (n, e, z, q, l) {
              var P,
                U,
                r,
                F,
                a,
                t,
                b,
                p,
                y,
                X,
                O,
                u = dV.hasData(n) && dV.get(n);
              if (!u || !(F = u.events)) return;
              (e = (e || "").match(c) || [""]), (a = e.length);
              while (a--) {
                if (
                  ((r = TT.exec(e[a]) || []),
                  (y = O = r[1]),
                  (X = (r[2] || "").split(".").sort()),
                  !y)
                ) {
                  for (y in F) M.event.remove(n, y + e[a], z, q, true);
                  continue;
                }
                (b = M.event.special[y] || {}),
                  (y = (q ? b.delegateType : b.bindType) || y),
                  (p = F[y] || []),
                  (r =
                    r[2] &&
                    new RegExp(
                      "(^|\\.)" + X.join("\\.(?:.*\\.|)") + "(\\.|$)"
                    )),
                  (U = P = p.length);
                while (P--)
                  if (
                    ((t = p[P]),
                    (l || O === t.origType) &&
                      (!z || z.guid === t.guid) &&
                      (!r || r.test(t.namespace)) &&
                      (!q || q === t.selector || (q === "**" && t.selector)))
                  ) {
                    if ((p.splice(P, 1), t.selector)) p.delegateCount--;
                    if (b.remove) b.remove.call(n, t);
                  }
                if (U && !p.length) {
                  if (!b.teardown || b.teardown.call(n, X, u.handle) === false)
                    M.removeEvent(n, y, u.handle);
                  delete F[y];
                }
              }
              if (M.isEmptyObject(F)) dV.remove(n, "handle events");
            },
            dispatch: function (n) {
              var e,
                z,
                q,
                l,
                P,
                U,
                r = new Array(arguments.length),
                F = M.event.fix(n),
                a =
                  (dV.get(this, "events") || Object.create(null))[F.type] || [],
                t = M.event.special[F.type] || {};
              for (r[0] = F, e = 1; e < arguments.length; e++)
                r[e] = arguments[e];
              if (
                ((F.delegateTarget = this),
                t.preDispatch && t.preDispatch.call(this, F) === false)
              )
                return;
              (U = M.event.handlers.call(this, F, a)), (e = 0);
              while ((l = U[e++]) && !F.isPropagationStopped()) {
                (F.currentTarget = l.elem), (z = 0);
                while (
                  (P = l.handlers[z++]) &&
                  !F.isImmediatePropagationStopped()
                )
                  if (
                    !F.rnamespace ||
                    P.namespace === false ||
                    F.rnamespace.test(P.namespace)
                  )
                    if (
                      ((F.handleObj = P),
                      (F.data = P.data),
                      (q = (
                        (M.event.special[P.origType] || {}).handle || P.handler
                      ).apply(l.elem, r)),
                      q !== void 0)
                    )
                      if ((F.result = q) === false)
                        F.preventDefault(), F.stopPropagation();
              }
              if (t.postDispatch) t.postDispatch.call(this, F);
              return F.result;
            },
            handlers: function (n, e) {
              var z,
                q,
                l,
                P,
                U,
                r = [],
                F = e.delegateCount,
                a = n.target;
              if (F && a.nodeType && !(n.type === "click" && n.button >= 1))
                for (; a !== this; a = a.parentNode || this)
                  if (
                    a.nodeType === 1 &&
                    !(n.type === "click" && a.disabled === true)
                  ) {
                    for (P = [], U = {}, z = 0; z < F; z++) {
                      if (((q = e[z]), (l = q.selector + " "), U[l] === void 0))
                        U[l] = q.needsContext
                          ? M(l, this).index(a) > -1
                          : M.find(l, this, null, [a]).length;
                      if (U[l]) P.push(q);
                    }
                    if (P.length)
                      r.push({
                        elem: a,
                        handlers: P,
                      });
                  }
              if (((a = this), F < e.length))
                r.push({
                  elem: a,
                  handlers: e.slice(F),
                });
              return r;
            },
            addProp: function (n, e) {
              Object.defineProperty(M.Event.prototype, n, {
                enumerable: true,
                configurable: true,
                get: X(e)
                  ? function () {
                      if (this.originalEvent) return e(this.originalEvent);
                    }
                  : function () {
                      if (this.originalEvent) return this.originalEvent[n];
                    },
                set: function (e) {
                  Object.defineProperty(this, n, {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: e,
                  });
                },
              });
            },
            fix: function (n) {
              return n[M.expando] ? n : new M.Event(n);
            },
            special: {
              load: {
                noBubble: true,
              },
              click: {
                setup: function (n) {
                  var e = this || n;
                  if (HH.test(e.type) && e.click && E(e, "input"))
                    Sw(e, "click", true);
                  return false;
                },
                trigger: function (n) {
                  var e = this || n;
                  if (HH.test(e.type) && e.click && E(e, "input"))
                    Sw(e, "click");
                  return true;
                },
                _default: function (n) {
                  var e = n.target;
                  return (
                    (HH.test(e.type) &&
                      e.click &&
                      E(e, "input") &&
                      dV.get(e, "click")) ||
                    E(e, "a")
                  );
                },
              },
              beforeunload: {
                postDispatch: function (n) {
                  if (n.result !== void 0 && n.originalEvent)
                    n.originalEvent.returnValue = n.result;
                },
              },
            },
          }),
            (M.removeEvent = function (n, e, z) {
              if (n.removeEventListener) n.removeEventListener(e, z);
            }),
            (M.Event = function (n, e) {
              if (!(this instanceof M.Event)) return new M.Event(n, e);
              if (n && n.type)
                (this.originalEvent = n),
                  (this.type = n.type),
                  (this.isDefaultPrevented =
                    n.defaultPrevented ||
                    (n.defaultPrevented === void 0 && n.returnValue === false)
                      ? Hn
                      : Tu),
                  (this.target =
                    n.target && n.target.nodeType === 3
                      ? n.target.parentNode
                      : n.target),
                  (this.currentTarget = n.currentTarget),
                  (this.relatedTarget = n.relatedTarget);
              else this.type = n;
              if (e) M.extend(this, e);
              (this.timeStamp = (n && n.timeStamp) || Date.now()),
                (this[M.expando] = true);
            }),
            (M.Event.prototype = {
              constructor: M.Event,
              isDefaultPrevented: Tu,
              isPropagationStopped: Tu,
              isImmediatePropagationStopped: Tu,
              isSimulated: false,
              preventDefault: function () {
                var n = this.originalEvent;
                if (((this.isDefaultPrevented = Hn), n && !this.isSimulated))
                  n.preventDefault();
              },
              stopPropagation: function () {
                var n = this.originalEvent;
                if (((this.isPropagationStopped = Hn), n && !this.isSimulated))
                  n.stopPropagation();
              },
              stopImmediatePropagation: function () {
                var n = this.originalEvent;
                if (
                  ((this.isImmediatePropagationStopped = Hn),
                  n && !this.isSimulated)
                )
                  n.stopImmediatePropagation();
                this.stopPropagation();
              },
            }),
            M.each(
              {
                altKey: true,
                bubbles: true,
                cancelable: true,
                changedTouches: true,
                ctrlKey: true,
                detail: true,
                eventPhase: true,
                metaKey: true,
                pageX: true,
                pageY: true,
                shiftKey: true,
                view: true,
                char: true,
                code: true,
                charCode: true,
                key: true,
                keyCode: true,
                button: true,
                buttons: true,
                clientX: true,
                clientY: true,
                offsetX: true,
                offsetY: true,
                pointerId: true,
                pointerType: true,
                screenX: true,
                screenY: true,
                targetTouches: true,
                toElement: true,
                touches: true,
                which: true,
              },
              M.event.addProp
            ),
            M.each(
              {
                focus: "focusin",
                blur: "focusout",
              },
              function (n, e) {
                function z(n) {
                  if (u.documentMode) {
                    var z = dV.get(this, "handle"),
                      q = M.event.fix(n);
                    if (
                      ((q.type = n.type === "focusin" ? "focus" : "blur"),
                      (q.isSimulated = true),
                      z(n),
                      q.target === q.currentTarget)
                    )
                      z(q);
                  } else M.event.simulate(e, n.target, M.event.fix(n));
                }
                (M.event.special[n] = {
                  setup: function () {
                    var q;
                    if ((Sw(this, n, true), u.documentMode)) {
                      if (((q = dV.get(this, e)), !q))
                        this.addEventListener(e, z);
                      dV.set(this, e, (q || 0) + 1);
                    } else return false;
                  },
                  trigger: function () {
                    return Sw(this, n), true;
                  },
                  teardown: function () {
                    var n;
                    if (u.documentMode)
                      if (((n = dV.get(this, e) - 1), !n))
                        this.removeEventListener(e, z), dV.remove(this, e);
                      else dV.set(this, e, n);
                    else return false;
                  },
                  _default: function (e) {
                    return dV.get(e.target, n);
                  },
                  delegateType: e,
                }),
                  (M.event.special[e] = {
                    setup: function () {
                      var q = this.ownerDocument || this.document || this,
                        l = u.documentMode ? this : q,
                        P = dV.get(l, e);
                      if (!P)
                        if (u.documentMode) this.addEventListener(e, z);
                        else q.addEventListener(n, z, true);
                      dV.set(l, e, (P || 0) + 1);
                    },
                    teardown: function () {
                      var q = this.ownerDocument || this.document || this,
                        l = u.documentMode ? this : q,
                        P = dV.get(l, e) - 1;
                      if (!P) {
                        if (u.documentMode) this.removeEventListener(e, z);
                        else q.removeEventListener(n, z, true);
                        dV.remove(l, e);
                      } else dV.set(l, e, P);
                    },
                  });
              }
            ),
            M.each(
              {
                mouseenter: "mouseover",
                mouseleave: "mouseout",
                pointerenter: "pointerover",
                pointerleave: "pointerout",
              },
              function (n, e) {
                M.event.special[n] = {
                  delegateType: e,
                  bindType: e,
                  handle: function (n) {
                    var z,
                      q = this,
                      l = n.relatedTarget,
                      P = n.handleObj;
                    if (!l || (l !== q && !M.contains(q, l)))
                      (n.type = P.origType),
                        (z = P.handler.apply(this, arguments)),
                        (n.type = e);
                    return z;
                  },
                };
              }
            ),
            M.fn.extend({
              on: function (n, e, z, q) {
                return TB(this, n, e, z, q);
              },
              one: function (n, e, z, q) {
                return TB(this, n, e, z, q, 1);
              },
              off: function (n, e, z) {
                var q, l;
                if (n && n.preventDefault && n.handleObj)
                  return (
                    (q = n.handleObj),
                    M(n.delegateTarget).off(
                      q.namespace ? q.origType + "." + q.namespace : q.origType,
                      q.selector,
                      q.handler
                    ),
                    this
                  );
                if (typeof n === "object") {
                  for (l in n) this.off(l, e, n[l]);
                  return this;
                }
                if (e === false || typeof e === "function")
                  (z = e), (e = void 0);
                if (z === false) z = Tu;
                return this.each(function () {
                  M.event.remove(this, n, z, e);
                });
              },
            });
          var fC = /<script|<style|<link/i,
            MM = /checked\s*(?:[^=]|=\s*.checked.)/i,
            Gp = /^\s*<!\[CDATA\[|\]\]>\s*$/g;
          function lG(n, e) {
            if (E(n, "table") && E(e.nodeType !== 11 ? e : e.firstChild, "tr"))
              return M(n).children("tbody")[0] || n;
            return n;
          }
          function fR(n) {
            return (
              (n.type = (n.getAttribute("type") !== null) + "/" + n.type), n
            );
          }
          function Re(n) {
            if ((n.type || "").slice(0, 5) === "true/")
              n.type = n.type.slice(5);
            else n.removeAttribute("type");
            return n;
          }
          function pY(n, e) {
            var z, q, l, P, U, r, F;
            if (e.nodeType !== 1) return;
            if (dV.hasData(n))
              if (((P = dV.get(n)), (F = P.events), F))
                for (l in (dV.remove(e, "handle events"), F))
                  for (z = 0, q = F[l].length; z < q; z++)
                    M.event.add(e, l, F[l][z]);
            if (wP.hasData(n))
              (U = wP.access(n)), (r = M.extend({}, U)), wP.set(e, r);
          }
          function vN(n, e) {
            var z = e.nodeName.toLowerCase();
            if (z === "input" && HH.test(n.type)) e.checked = n.checked;
            else if (z === "input" || z === "textarea")
              e.defaultValue = n.defaultValue;
          }
          function MZ(n, e, z, q) {
            e = P(e);
            var l,
              U,
              r,
              F,
              a,
              t,
              b = 0,
              p = n.length,
              O = p - 1,
              u = e[0],
              d = X(u);
            if (
              d ||
              (p > 1 && typeof u === "string" && !y.checkClone && MM.test(u))
            )
              return n.each(function (l) {
                var P = n.eq(l);
                if (d) e[0] = u.call(this, l, P.html());
                MZ(P, e, z, q);
              });
            if (p) {
              if (
                ((l = WW(e, n[0].ownerDocument, false, n, q)),
                (U = l.firstChild),
                l.childNodes.length === 1)
              )
                l = U;
              if (U || q) {
                for (r = M.map(yh(l, "script"), fR), F = r.length; b < p; b++) {
                  if (((a = l), b !== O))
                    if (((a = M.clone(a, true, true)), F))
                      M.merge(r, yh(a, "script"));
                  z.call(n[b], a, b);
                }
                if (F)
                  for (
                    t = r[r.length - 1].ownerDocument, M.map(r, Re), b = 0;
                    b < F;
                    b++
                  )
                    if (
                      ((a = r[b]),
                      aB.test(a.type || "") &&
                        !dV.access(a, "globalEval") &&
                        M.contains(t, a))
                    )
                      if (a.src && (a.type || "").toLowerCase() !== "module") {
                        if (M._evalUrl && !a.noModule)
                          M._evalUrl(
                            a.src,
                            {
                              nonce: a.nonce || a.getAttribute("nonce"),
                            },
                            t
                          );
                      } else m(a.textContent.replace(Gp, ""), a, t);
              }
            }
            return n;
          }
          function LE(n, e, z) {
            for (
              var q, l = e ? M.filter(e, n) : n, P = 0;
              (q = l[P]) != null;
              P++
            ) {
              if (!z && q.nodeType === 1) M.cleanData(yh(q));
              if (q.parentNode) {
                if (z && Ac(q)) Os(yh(q, "script"));
                q.parentNode.removeChild(q);
              }
            }
            return n;
          }
          M.extend({
            htmlPrefilter: function (n) {
              return n;
            },
            clone: function (n, e, z) {
              var q,
                l,
                P,
                U,
                r = n.cloneNode(true),
                F = Ac(n);
              if (
                !y.noCloneChecked &&
                (n.nodeType === 1 || n.nodeType === 11) &&
                !M.isXMLDoc(n)
              )
                for (U = yh(r), P = yh(n), q = 0, l = P.length; q < l; q++)
                  vN(P[q], U[q]);
              if (e)
                if (z)
                  for (
                    P = P || yh(n), U = U || yh(r), q = 0, l = P.length;
                    q < l;
                    q++
                  )
                    pY(P[q], U[q]);
                else pY(n, r);
              if (((U = yh(r, "script")), U.length > 0))
                Os(U, !F && yh(n, "script"));
              return r;
            },
            cleanData: function (n) {
              for (
                var e, z, q, l = M.event.special, P = 0;
                (z = n[P]) !== void 0;
                P++
              )
                if (KZ(z)) {
                  if ((e = z[dV.expando])) {
                    if (e.events)
                      for (q in e.events)
                        if (l[q]) M.event.remove(z, q);
                        else M.removeEvent(z, q, e.handle);
                    z[dV.expando] = void 0;
                  }
                  if (z[wP.expando]) z[wP.expando] = void 0;
                }
            },
          }),
            M.fn.extend({
              detach: function (n) {
                return LE(this, n, true);
              },
              remove: function (n) {
                return LE(this, n);
              },
              text: function (n) {
                return Ez(
                  this,
                  function (n) {
                    return n === void 0
                      ? M.text(this)
                      : this.empty().each(function () {
                          if (
                            this.nodeType === 1 ||
                            this.nodeType === 11 ||
                            this.nodeType === 9
                          )
                            this.textContent = n;
                        });
                  },
                  null,
                  n,
                  arguments.length
                );
              },
              append: function () {
                return MZ(this, arguments, function (n) {
                  if (
                    this.nodeType === 1 ||
                    this.nodeType === 11 ||
                    this.nodeType === 9
                  ) {
                    var e = lG(this, n);
                    e.appendChild(n);
                  }
                });
              },
              prepend: function () {
                return MZ(this, arguments, function (n) {
                  if (
                    this.nodeType === 1 ||
                    this.nodeType === 11 ||
                    this.nodeType === 9
                  ) {
                    var e = lG(this, n);
                    e.insertBefore(n, e.firstChild);
                  }
                });
              },
              before: function () {
                return MZ(this, arguments, function (n) {
                  if (this.parentNode) this.parentNode.insertBefore(n, this);
                });
              },
              after: function () {
                return MZ(this, arguments, function (n) {
                  if (this.parentNode)
                    this.parentNode.insertBefore(n, this.nextSibling);
                });
              },
              empty: function () {
                for (var n, e = 0; (n = this[e]) != null; e++)
                  if (n.nodeType === 1)
                    M.cleanData(yh(n, false)), (n.textContent = "");
                return this;
              },
              clone: function (n, e) {
                return (
                  (n = n == null ? false : n),
                  (e = e == null ? n : e),
                  this.map(function () {
                    return M.clone(this, n, e);
                  })
                );
              },
              html: function (n) {
                return Ez(
                  this,
                  function (n) {
                    var e = this[0] || {},
                      z = 0,
                      q = this.length;
                    if (n === void 0 && e.nodeType === 1) return e.innerHTML;
                    if (
                      typeof n === "string" &&
                      !fC.test(n) &&
                      !vz[(MK.exec(n) || ["", ""])[1].toLowerCase()]
                    ) {
                      n = M.htmlPrefilter(n);
                      try {
                        for (; z < q; z++)
                          if (((e = this[z] || {}), e.nodeType === 1))
                            M.cleanData(yh(e, false)), (e.innerHTML = n);
                        e = 0;
                      } catch (n) {}
                    }
                    if (e) this.empty().append(n);
                  },
                  null,
                  n,
                  arguments.length
                );
              },
              replaceWith: function () {
                var n = [];
                return MZ(
                  this,
                  arguments,
                  function (e) {
                    var z = this.parentNode;
                    if (M.inArray(this, n) < 0)
                      if ((M.cleanData(yh(this)), z)) z.replaceChild(e, this);
                  },
                  n
                );
              },
            }),
            M.each(
              {
                appendTo: "append",
                prependTo: "prepend",
                insertBefore: "before",
                insertAfter: "after",
                replaceAll: "replaceWith",
              },
              function (n, e) {
                M.fn[n] = function (n) {
                  for (
                    var z, q = [], l = M(n), P = l.length - 1, r = 0;
                    r <= P;
                    r++
                  )
                    (z = r === P ? this : this.clone(true)),
                      M(l[r])[e](z),
                      U.apply(q, z.get());
                  return this.pushStack(q);
                };
              }
            );
          var Ip = new RegExp("^(" + pP + ")(?!px)[a-z%]+$", "i"),
            nK = /^--/,
            gV = function (e) {
              var z = e.ownerDocument.defaultView;
              if (!z || !z.opener) z = n;
              return z.getComputedStyle(e);
            },
            gg = function (n, e, z) {
              var q,
                l,
                P = {};
              for (l in e) (P[l] = n.style[l]), (n.style[l] = e[l]);
              for (l in ((q = z.call(n)), e)) n.style[l] = P[l];
              return q;
            },
            SO = new RegExp(de.join("|"), "i");
          function qh(n, e, z) {
            var q,
              l,
              P,
              U,
              r = nK.test(e),
              F = n.style;
            if (((z = z || gV(n)), z)) {
              if (((U = z.getPropertyValue(e) || z[e]), r && U))
                U = U.replace(K, "$1") || void 0;
              if (U === "" && !Ac(n)) U = M.style(n, e);
              if (!y.pixelBoxStyles() && Ip.test(U) && SO.test(e))
                (q = F.width),
                  (l = F.minWidth),
                  (P = F.maxWidth),
                  (F.minWidth = F.maxWidth = F.width = U),
                  (U = z.width),
                  (F.width = q),
                  (F.minWidth = l),
                  (F.maxWidth = P);
            }
            return U !== void 0 ? U + "" : U;
          }
          function We(n, e) {
            return {
              get: function () {
                if (n()) return void delete this.get;
                return (this.get = e).apply(this, arguments);
              },
            };
          }
          (function () {
            function e() {
              if (!t) return;
              (a.style.cssText =
                "position:absolute;left:-11111px;width:60px;" +
                "margin-top:1px;padding:0;border:0"),
                (t.style.cssText =
                  "position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
                  "margin:auto;border:1px;padding:1px;" +
                  "width:60%;top:1%"),
                mL.appendChild(a).appendChild(t);
              var e = n.getComputedStyle(t);
              (q = e.top !== "1%"),
                (F = z(e.marginLeft) === 12),
                (t.style.right = "60%"),
                (U = z(e.right) === 36),
                (l = z(e.width) === 36),
                (t.style.position = "absolute"),
                (P = z(t.offsetWidth / 3) === 12),
                mL.removeChild(a),
                (t = null);
            }
            function z(n) {
              return Math.round(parseFloat(n));
            }
            var q,
              l,
              P,
              U,
              r,
              F,
              a = u.createElement("div"),
              t = u.createElement("div");
            if (!t.style) return;
            (t.style.backgroundClip = "content-box"),
              (t.cloneNode(true).style.backgroundClip = ""),
              (y.clearCloneStyle = t.style.backgroundClip === "content-box"),
              M.extend(y, {
                boxSizingReliable: function () {
                  return e(), l;
                },
                pixelBoxStyles: function () {
                  return e(), U;
                },
                pixelPosition: function () {
                  return e(), q;
                },
                reliableMarginLeft: function () {
                  return e(), F;
                },
                scrollboxSize: function () {
                  return e(), P;
                },
                reliableTrDimensions: function () {
                  var e, z, q, l;
                  if (r == null)
                    (e = u.createElement("table")),
                      (z = u.createElement("tr")),
                      (q = u.createElement("div")),
                      (e.style.cssText =
                        "position:absolute;left:-11111px;border-collapse:separate"),
                      (z.style.cssText =
                        "box-sizing:content-box;border:1px solid"),
                      (z.style.height = "1px"),
                      (q.style.height = "9px"),
                      (q.style.display = "block"),
                      mL.appendChild(e).appendChild(z).appendChild(q),
                      (l = n.getComputedStyle(z)),
                      (r =
                        parseInt(l.height, 10) +
                          parseInt(l.borderTopWidth, 10) +
                          parseInt(l.borderBottomWidth, 10) ===
                        z.offsetHeight),
                      mL.removeChild(e);
                  return r;
                },
              });
          })();
          var DF = ["Webkit", "Moz", "ms"],
            UM = u.createElement("div").style,
            oq = {};
          function UC(n) {
            var e = n[0].toUpperCase() + n.slice(1),
              z = DF.length;
            while (z--) if (((n = DF[z] + e), n in UM)) return n;
          }
          function kk(n) {
            var e = M.cssProps[n] || oq[n];
            if (e) return e;
            if (n in UM) return n;
            return (oq[n] = UC(n) || n);
          }
          var PS = /^(none|table(?!-c[ea]).+)/,
            EK = {
              position: "absolute",
              visibility: "hidden",
              display: "block",
            },
            wQ = {
              letterSpacing: "0",
              fontWeight: "400",
            };
          function bH(n, e, z) {
            var q = Hq.exec(e);
            return q ? Math.max(0, q[2] - (z || 0)) + (q[3] || "px") : e;
          }
          function PD(n, e, z, q, l, P) {
            var U = e === "width" ? 1 : 0,
              r = 0,
              F = 0,
              a = 0;
            if (z === (q ? "border" : "content")) return 0;
            for (; U < 4; U += 2) {
              if (z === "margin") a += M.css(n, z + de[U], true, l);
              if (!q)
                if (
                  ((F += M.css(n, "padding" + de[U], true, l)), z !== "padding")
                )
                  F += M.css(n, "border" + de[U] + "Width", true, l);
                else r += M.css(n, "border" + de[U] + "Width", true, l);
              else {
                if (z === "content") F -= M.css(n, "padding" + de[U], true, l);
                if (z !== "margin")
                  F -= M.css(n, "border" + de[U] + "Width", true, l);
              }
            }
            if (!q && P >= 0)
              F +=
                Math.max(
                  0,
                  Math.ceil(
                    n["offset" + e[0].toUpperCase() + e.slice(1)] -
                      P -
                      F -
                      r -
                      0.5
                  )
                ) || 0;
            return F + a;
          }
          function IR(n, e, z) {
            var q = gV(n),
              l = !y.boxSizingReliable() || z,
              P = l && M.css(n, "boxSizing", false, q) === "border-box",
              U = P,
              r = qh(n, e, q),
              F = "offset" + e[0].toUpperCase() + e.slice(1);
            if (Ip.test(r)) {
              if (!z) return r;
              r = "auto";
            }
            if (
              ((!y.boxSizingReliable() && P) ||
                (!y.reliableTrDimensions() && E(n, "tr")) ||
                r === "auto" ||
                (!parseFloat(r) &&
                  M.css(n, "display", false, q) === "inline")) &&
              n.getClientRects().length
            )
              if (
                ((P = M.css(n, "boxSizing", false, q) === "border-box"),
                (U = F in n),
                U)
              )
                r = n[F];
            return (
              (r = parseFloat(r) || 0),
              r + PD(n, e, z || (P ? "border" : "content"), U, q, r) + "px"
            );
          }
          function qY(n, e, z, q, l) {
            return new qY.prototype.init(n, e, z, q, l);
          }
          M.extend({
            cssHooks: {
              opacity: {
                get: function (n, e) {
                  if (e) {
                    var z = qh(n, "opacity");
                    return z === "" ? "1" : z;
                  }
                },
              },
            },
            cssNumber: {
              animationIterationCount: true,
              aspectRatio: true,
              borderImageSlice: true,
              columnCount: true,
              flexGrow: true,
              flexShrink: true,
              fontWeight: true,
              gridArea: true,
              gridColumn: true,
              gridColumnEnd: true,
              gridColumnStart: true,
              gridRow: true,
              gridRowEnd: true,
              gridRowStart: true,
              lineHeight: true,
              opacity: true,
              order: true,
              orphans: true,
              scale: true,
              widows: true,
              zIndex: true,
              zoom: true,
              fillOpacity: true,
              floodOpacity: true,
              stopOpacity: true,
              strokeMiterlimit: true,
              strokeOpacity: true,
            },
            cssProps: {},
            style: function (n, e, z, q) {
              if (!n || n.nodeType === 3 || n.nodeType === 8 || !n.style)
                return;
              var l,
                P,
                U,
                r = kW(e),
                F = nK.test(e),
                a = n.style;
              if (!F) e = kk(r);
              if (((U = M.cssHooks[e] || M.cssHooks[r]), z !== void 0)) {
                if (
                  ((P = typeof z), P === "string" && (l = Hq.exec(z)) && l[1])
                )
                  (z = WA(n, e, l)), (P = "number");
                if (z == null || z !== z) return;
                if (P === "number" && !F)
                  z += (l && l[3]) || (M.cssNumber[r] ? "" : "px");
                if (
                  !y.clearCloneStyle &&
                  z === "" &&
                  e.indexOf("background") === 0
                )
                  a[e] = "inherit";
                if (!U || !("set" in U) || (z = U.set(n, z, q)) !== void 0)
                  if (F) a.setProperty(e, z);
                  else a[e] = z;
              } else {
                if (U && "get" in U && (l = U.get(n, false, q)) !== void 0)
                  return l;
                return a[e];
              }
            },
            css: function (n, e, z, q) {
              var l,
                P,
                U,
                r = kW(e),
                F = nK.test(e);
              if (!F) e = kk(r);
              if (((U = M.cssHooks[e] || M.cssHooks[r]), U && "get" in U))
                l = U.get(n, true, z);
              if (l === void 0) l = qh(n, e, q);
              if (l === "normal" && e in wQ) l = wQ[e];
              if (z === "" || z)
                return (
                  (P = parseFloat(l)), z === true || isFinite(P) ? P || 0 : l
                );
              return l;
            },
          }),
            M.each(["height", "width"], function (n, e) {
              M.cssHooks[e] = {
                get: function (n, z, q) {
                  if (z)
                    return PS.test(M.css(n, "display")) &&
                      (!n.getClientRects().length ||
                        !n.getBoundingClientRect().width)
                      ? gg(n, EK, function () {
                          return IR(n, e, q);
                        })
                      : IR(n, e, q);
                },
                set: function (n, z, q) {
                  var l,
                    P = gV(n),
                    U = !y.scrollboxSize() && P.position === "absolute",
                    r = U || q,
                    F = r && M.css(n, "boxSizing", false, P) === "border-box",
                    a = q ? PD(n, e, q, F, P) : 0;
                  if (F && U)
                    a -= Math.ceil(
                      n["offset" + e[0].toUpperCase() + e.slice(1)] -
                        parseFloat(P[e]) -
                        PD(n, e, "border", false, P) -
                        0.5
                    );
                  if (a && (l = Hq.exec(z)) && (l[3] || "px") !== "px")
                    (n.style[e] = z), (z = M.css(n, e));
                  return bH(n, z, a);
                },
              };
            }),
            (M.cssHooks.marginLeft = We(y.reliableMarginLeft, function (n, e) {
              if (e)
                return (
                  (parseFloat(qh(n, "marginLeft")) ||
                    n.getBoundingClientRect().left -
                      gg(
                        n,
                        {
                          marginLeft: 0,
                        },
                        function () {
                          return n.getBoundingClientRect().left;
                        }
                      )) + "px"
                );
            })),
            M.each(
              {
                margin: "",
                padding: "",
                border: "Width",
              },
              function (n, e) {
                if (
                  ((M.cssHooks[n + e] = {
                    expand: function (z) {
                      for (
                        var q = 0,
                          l = {},
                          P = typeof z === "string" ? z.split(" ") : [z];
                        q < 4;
                        q++
                      )
                        l[n + de[q] + e] = P[q] || P[q - 2] || P[0];
                      return l;
                    },
                  }),
                  n !== "margin")
                )
                  M.cssHooks[n + e].set = bH;
              }
            ),
            M.fn.extend({
              css: function (n, e) {
                return Ez(
                  this,
                  function (n, e, z) {
                    var q,
                      l,
                      P = {},
                      U = 0;
                    if (Array.isArray(e)) {
                      for (q = gV(n), l = e.length; U < l; U++)
                        P[e[U]] = M.css(n, e[U], false, q);
                      return P;
                    }
                    return z !== void 0 ? M.style(n, e, z) : M.css(n, e);
                  },
                  n,
                  e,
                  arguments.length > 1
                );
              },
            }),
            (M.Tween = qY),
            (qY.prototype = {
              constructor: qY,
              init: function (n, e, z, q, l, P) {
                (this.elem = n),
                  (this.prop = z),
                  (this.easing = l || M.easing._default),
                  (this.options = e),
                  (this.start = this.now = this.cur()),
                  (this.end = q),
                  (this.unit = P || (M.cssNumber[z] ? "" : "px"));
              },
              cur: function () {
                var n = qY.propHooks[this.prop];
                return n && n.get
                  ? n.get(this)
                  : qY.propHooks._default.get(this);
              },
              run: function (n) {
                var e,
                  z = qY.propHooks[this.prop];
                if (this.options.duration)
                  this.pos = e = M.easing[this.easing](
                    n,
                    this.options.duration * n,
                    0,
                    1,
                    this.options.duration
                  );
                else this.pos = e = n;
                if (
                  ((this.now = (this.end - this.start) * e + this.start),
                  this.options.step)
                )
                  this.options.step.call(this.elem, this.now, this);
                if (z && z.set) z.set(this);
                else qY.propHooks._default.set(this);
                return this;
              },
            }),
            (qY.prototype.init.prototype = qY.prototype),
            (qY.propHooks = {
              _default: {
                get: function (n) {
                  var e;
                  if (
                    n.elem.nodeType !== 1 ||
                    (n.elem[n.prop] != null && n.elem.style[n.prop] == null)
                  )
                    return n.elem[n.prop];
                  return (
                    (e = M.css(n.elem, n.prop, "")), !e || e === "auto" ? 0 : e
                  );
                },
                set: function (n) {
                  if (M.fx.step[n.prop]) M.fx.step[n.prop](n);
                  else if (
                    n.elem.nodeType === 1 &&
                    (M.cssHooks[n.prop] || n.elem.style[kk(n.prop)] != null)
                  )
                    M.style(n.elem, n.prop, n.now + n.unit);
                  else n.elem[n.prop] = n.now;
                },
              },
            }),
            (qY.propHooks.scrollTop = qY.propHooks.scrollLeft =
              {
                set: function (n) {
                  if (n.elem.nodeType && n.elem.parentNode)
                    n.elem[n.prop] = n.now;
                },
              }),
            (M.easing = {
              linear: function (n) {
                return n;
              },
              swing: function (n) {
                return 0.5 - Math.cos(n * Math.PI) / 2;
              },
              _default: "swing",
            }),
            (M.fx = qY.prototype.init),
            (M.fx.step = {});
          var eG,
            KA,
            tE = /^(?:toggle|show|hide)$/,
            dU = /queueHooks$/;
          function zm() {
            if (KA) {
              if (u.hidden === false && n.requestAnimationFrame)
                n.requestAnimationFrame(zm);
              else n.setTimeout(zm, M.fx.interval);
              M.fx.tick();
            }
          }
          function Cg() {
            return (
              n.setTimeout(function () {
                eG = void 0;
              }),
              (eG = Date.now())
            );
          }
          function Ge(n, e) {
            var z,
              q = 0,
              l = {
                height: n,
              };
            for (e = e ? 1 : 0; q < 4; q += 2 - e)
              (z = de[q]), (l["margin" + z] = l["padding" + z] = n);
            if (e) l.opacity = l.width = n;
            return l;
          }
          function zQ(n, e, z) {
            for (
              var q,
                l = (mU.tweeners[e] || []).concat(mU.tweeners["*"]),
                P = 0,
                U = l.length;
              P < U;
              P++
            )
              if ((q = l[P].call(z, e, n))) return q;
          }
          function pp(n, e, z) {
            var q,
              l,
              P,
              U,
              r,
              F,
              a,
              t,
              b = "width" in e || "height" in e,
              p = this,
              y = {},
              X = n.style,
              O = n.nodeType && FN(n),
              u = dV.get(n, "fxshow");
            if (!z.queue) {
              if (((U = M._queueHooks(n, "fx")), U.unqueued == null))
                (U.unqueued = 0),
                  (r = U.empty.fire),
                  (U.empty.fire = function () {
                    if (!U.unqueued) r();
                  });
              U.unqueued++,
                p.always(function () {
                  p.always(function () {
                    if ((U.unqueued--, !M.queue(n, "fx").length))
                      U.empty.fire();
                  });
                });
            }
            for (q in e)
              if (((l = e[q]), tE.test(l))) {
                if (
                  (delete e[q],
                  (P = P || l === "toggle"),
                  l === (O ? "hide" : "show"))
                )
                  if (l === "show" && u && u[q] !== void 0) O = true;
                  else continue;
                y[q] = (u && u[q]) || M.style(n, q);
              }
            if (((F = !M.isEmptyObject(e)), !F && M.isEmptyObject(y))) return;
            if (b && n.nodeType === 1) {
              if (
                ((z.overflow = [X.overflow, X.overflowX, X.overflowY]),
                (a = u && u.display),
                a == null)
              )
                a = dV.get(n, "display");
              if (((t = M.css(n, "display")), t === "none"))
                if (a) t = a;
                else
                  DO([n], true),
                    (a = n.style.display || a),
                    (t = M.css(n, "display")),
                    DO([n]);
              if (t === "inline" || (t === "inline-block" && a != null))
                if (M.css(n, "float") === "none") {
                  if (!F)
                    if (
                      (p.done(function () {
                        X.display = a;
                      }),
                      a == null)
                    )
                      (t = X.display), (a = t === "none" ? "" : t);
                  X.display = "inline-block";
                }
            }
            if (z.overflow)
              (X.overflow = "hidden"),
                p.always(function () {
                  (X.overflow = z.overflow[0]),
                    (X.overflowX = z.overflow[1]),
                    (X.overflowY = z.overflow[2]);
                });
            for (q in ((F = false), y)) {
              if (!F) {
                if (u) {
                  if ("hidden" in u) O = u.hidden;
                } else
                  u = dV.access(n, "fxshow", {
                    display: a,
                  });
                if (P) u.hidden = !O;
                if (O) DO([n], true);
                p.done(function () {
                  if (!O) DO([n]);
                  for (q in (dV.remove(n, "fxshow"), y)) M.style(n, q, y[q]);
                });
              }
              if (((F = zQ(O ? u[q] : 0, q, p)), !(q in u)))
                if (((u[q] = F.start), O)) (F.end = F.start), (F.start = 0);
            }
          }
          function Dx(n, e) {
            var z, q, l, P, U;
            for (z in n) {
              if (((q = kW(z)), (l = e[q]), (P = n[z]), Array.isArray(P)))
                (l = P[1]), (P = n[z] = P[0]);
              if (z !== q) (n[q] = P), delete n[z];
              if (((U = M.cssHooks[q]), U && "expand" in U)) {
                for (z in ((P = U.expand(P)), delete n[q], P))
                  if (!(z in n)) (n[z] = P[z]), (e[z] = l);
              } else e[q] = l;
            }
          }
          function mU(n, e, z) {
            var q,
              l,
              P = 0,
              U = mU.prefilters.length,
              r = M.Deferred().always(function () {
                delete F.elem;
              }),
              F = function () {
                if (l) return false;
                for (
                  var e = eG || Cg(),
                    z = Math.max(0, a.startTime + a.duration - e),
                    q = z / a.duration || 0,
                    P = 1 - q,
                    U = 0,
                    F = a.tweens.length;
                  U < F;
                  U++
                )
                  a.tweens[U].run(P);
                if ((r.notifyWith(n, [a, P, z]), P < 1 && F)) return z;
                if (!F) r.notifyWith(n, [a, 1, 0]);
                return r.resolveWith(n, [a]), false;
              },
              a = r.promise({
                elem: n,
                props: M.extend({}, e),
                opts: M.extend(
                  true,
                  {
                    specialEasing: {},
                    easing: M.easing._default,
                  },
                  z
                ),
                originalProperties: e,
                originalOptions: z,
                startTime: eG || Cg(),
                duration: z.duration,
                tweens: [],
                createTween: function (e, z) {
                  var q = M.Tween(
                    n,
                    a.opts,
                    e,
                    z,
                    a.opts.specialEasing[e] || a.opts.easing
                  );
                  return a.tweens.push(q), q;
                },
                stop: function (e) {
                  var z = 0,
                    q = e ? a.tweens.length : 0;
                  if (l) return this;
                  for (l = true; z < q; z++) a.tweens[z].run(1);
                  if (e) r.notifyWith(n, [a, 1, 0]), r.resolveWith(n, [a, e]);
                  else r.rejectWith(n, [a, e]);
                  return this;
                },
              }),
              t = a.props;
            for (Dx(t, a.opts.specialEasing); P < U; P++)
              if (((q = mU.prefilters[P].call(a, n, t, a.opts)), q)) {
                if (X(q.stop))
                  M._queueHooks(a.elem, a.opts.queue).stop = q.stop.bind(q);
                return q;
              }
            if ((M.map(t, zQ, a), X(a.opts.start))) a.opts.start.call(n, a);
            return (
              a
                .progress(a.opts.progress)
                .done(a.opts.done, a.opts.complete)
                .fail(a.opts.fail)
                .always(a.opts.always),
              M.fx.timer(
                M.extend(F, {
                  elem: n,
                  anim: a,
                  queue: a.opts.queue,
                })
              ),
              a
            );
          }
          (M.Animation = M.extend(mU, {
            tweeners: {
              "*": [
                function (n, e) {
                  var z = this.createTween(n, e);
                  return WA(z.elem, n, Hq.exec(e), z), z;
                },
              ],
            },
            tweener: function (n, e) {
              if (X(n)) (e = n), (n = ["*"]);
              else n = n.match(c);
              for (var z, q = 0, l = n.length; q < l; q++)
                (z = n[q]),
                  (mU.tweeners[z] = mU.tweeners[z] || []),
                  mU.tweeners[z].unshift(e);
            },
            prefilters: [pp],
            prefilter: function (n, e) {
              if (e) mU.prefilters.unshift(n);
              else mU.prefilters.push(n);
            },
          })),
            (M.speed = function (n, e, z) {
              var q =
                n && typeof n === "object"
                  ? M.extend({}, n)
                  : {
                      complete: z || (!z && e) || (X(n) && n),
                      duration: n,
                      easing: (z && e) || (e && !X(e) && e),
                    };
              if (M.fx.off) q.duration = 0;
              else if (typeof q.duration !== "number")
                if (q.duration in M.fx.speeds)
                  q.duration = M.fx.speeds[q.duration];
                else q.duration = M.fx.speeds._default;
              if (q.queue == null || q.queue === true) q.queue = "fx";
              return (
                (q.old = q.complete),
                (q.complete = function () {
                  if (X(q.old)) q.old.call(this);
                  if (q.queue) M.dequeue(this, q.queue);
                }),
                q
              );
            }),
            M.fn.extend({
              fadeTo: function (n, e, z, q) {
                return this.filter(FN).css("opacity", 0).show().end().animate(
                  {
                    opacity: e,
                  },
                  n,
                  z,
                  q
                );
              },
              animate: function (n, e, z, q) {
                var l = M.isEmptyObject(n),
                  P = M.speed(e, z, q),
                  U = function () {
                    var e = mU(this, M.extend({}, n), P);
                    if (l || dV.get(this, "finish")) e.stop(true);
                  };
                return (
                  (U.finish = U),
                  l || P.queue === false ? this.each(U) : this.queue(P.queue, U)
                );
              },
              stop: function (n, e, z) {
                var q = function (n) {
                  var e = n.stop;
                  delete n.stop, e(z);
                };
                if (typeof n !== "string") (z = e), (e = n), (n = void 0);
                if (e) this.queue(n || "fx", []);
                return this.each(function () {
                  var e = true,
                    l = n != null && n + "queueHooks",
                    P = M.timers,
                    U = dV.get(this);
                  if (l) {
                    if (U[l] && U[l].stop) q(U[l]);
                  } else for (l in U) if (U[l] && U[l].stop && dU.test(l)) q(U[l]);
                  for (l = P.length; l--; )
                    if (P[l].elem === this && (n == null || P[l].queue === n))
                      P[l].anim.stop(z), (e = false), P.splice(l, 1);
                  if (e || !z) M.dequeue(this, n);
                });
              },
              finish: function (n) {
                if (n !== false) n = n || "fx";
                return this.each(function () {
                  var e,
                    z = dV.get(this),
                    q = z[n + "queue"],
                    l = z[n + "queueHooks"],
                    P = M.timers,
                    U = q ? q.length : 0;
                  if (((z.finish = true), M.queue(this, n, []), l && l.stop))
                    l.stop.call(this, true);
                  for (e = P.length; e--; )
                    if (P[e].elem === this && P[e].queue === n)
                      P[e].anim.stop(true), P.splice(e, 1);
                  for (e = 0; e < U; e++)
                    if (q[e] && q[e].finish) q[e].finish.call(this);
                  delete z.finish;
                });
              },
            }),
            M.each(["toggle", "show", "hide"], function (n, e) {
              var z = M.fn[e];
              M.fn[e] = function (n, q, l) {
                return n == null || typeof n === "boolean"
                  ? z.apply(this, arguments)
                  : this.animate(Ge(e, true), n, q, l);
              };
            }),
            M.each(
              {
                slideDown: Ge("show"),
                slideUp: Ge("hide"),
                slideToggle: Ge("toggle"),
                fadeIn: {
                  opacity: "show",
                },
                fadeOut: {
                  opacity: "hide",
                },
                fadeToggle: {
                  opacity: "toggle",
                },
              },
              function (n, e) {
                M.fn[n] = function (n, z, q) {
                  return this.animate(e, n, z, q);
                };
              }
            ),
            (M.timers = []),
            (M.fx.tick = function () {
              var n,
                e = 0,
                z = M.timers;
              for (eG = Date.now(); e < z.length; e++)
                if (((n = z[e]), !n() && z[e] === n)) z.splice(e--, 1);
              if (!z.length) M.fx.stop();
              eG = void 0;
            }),
            (M.fx.timer = function (n) {
              M.timers.push(n), M.fx.start();
            }),
            (M.fx.interval = 13),
            (M.fx.start = function () {
              if (KA) return;
              (KA = true), zm();
            }),
            (M.fx.stop = function () {
              KA = null;
            }),
            (M.fx.speeds = {
              slow: 600,
              fast: 200,
              _default: 400,
            }),
            (M.fn.delay = function (e, z) {
              return (
                (e = M.fx ? M.fx.speeds[e] || e : e),
                (z = z || "fx"),
                this.queue(z, function (z, q) {
                  var l = n.setTimeout(z, e);
                  q.stop = function () {
                    n.clearTimeout(l);
                  };
                })
              );
            }),
            (function () {
              var n = u.createElement("input"),
                e = u.createElement("select"),
                z = e.appendChild(u.createElement("option"));
              (n.type = "checkbox"),
                (y.checkOn = n.value !== ""),
                (y.optSelected = z.selected),
                (n = u.createElement("input")),
                (n.value = "t"),
                (n.type = "radio"),
                (y.radioValue = n.value === "t");
            })();
          var iA,
            Vt = M.expr.attrHandle;
          M.fn.extend({
            attr: function (n, e) {
              return Ez(this, M.attr, n, e, arguments.length > 1);
            },
            removeAttr: function (n) {
              return this.each(function () {
                M.removeAttr(this, n);
              });
            },
          }),
            M.extend({
              attr: function (n, e, z) {
                var q,
                  l,
                  P = n.nodeType;
                if (P === 3 || P === 8 || P === 2) return;
                if (typeof n.getAttribute === "undefined")
                  return M.prop(n, e, z);
                if (P !== 1 || !M.isXMLDoc(n))
                  l =
                    M.attrHooks[e.toLowerCase()] ||
                    (M.expr.match.bool.test(e) ? iA : void 0);
                if (z !== void 0) {
                  if (z === null) return void M.removeAttr(n, e);
                  if (l && "set" in l && (q = l.set(n, z, e)) !== void 0)
                    return q;
                  return n.setAttribute(e, z + ""), z;
                }
                if (l && "get" in l && (q = l.get(n, e)) !== null) return q;
                return (q = M.find.attr(n, e)), q == null ? void 0 : q;
              },
              attrHooks: {
                type: {
                  set: function (n, e) {
                    if (!y.radioValue && e === "radio" && E(n, "input")) {
                      var z = n.value;
                      if ((n.setAttribute("type", e), z)) n.value = z;
                      return e;
                    }
                  },
                },
              },
              removeAttr: function (n, e) {
                var z,
                  q = 0,
                  l = e && e.match(c);
                if (l && n.nodeType === 1)
                  while ((z = l[q++])) n.removeAttribute(z);
              },
            }),
            (iA = {
              set: function (n, e, z) {
                if (e === false) M.removeAttr(n, z);
                else n.setAttribute(z, z);
                return z;
              },
            }),
            M.each(M.expr.match.bool.source.match(/\w+/g), function (n, e) {
              var z = Vt[e] || M.find.attr;
              Vt[e] = function (n, e, q) {
                var l,
                  P,
                  U = e.toLowerCase();
                if (!q)
                  (P = Vt[U]),
                    (Vt[U] = l),
                    (l = z(n, e, q) != null ? U : null),
                    (Vt[U] = P);
                return l;
              };
            });
          var vp = /^(?:input|select|textarea|button)$/i,
            ma = /^(?:a|area)$/i;
          if (
            (M.fn.extend({
              prop: function (n, e) {
                return Ez(this, M.prop, n, e, arguments.length > 1);
              },
              removeProp: function (n) {
                return this.each(function () {
                  delete this[M.propFix[n] || n];
                });
              },
            }),
            M.extend({
              prop: function (n, e, z) {
                var q,
                  l,
                  P = n.nodeType;
                if (P === 3 || P === 8 || P === 2) return;
                if (P !== 1 || !M.isXMLDoc(n))
                  (e = M.propFix[e] || e), (l = M.propHooks[e]);
                if (z !== void 0) {
                  if (l && "set" in l && (q = l.set(n, z, e)) !== void 0)
                    return q;
                  return (n[e] = z);
                }
                if (l && "get" in l && (q = l.get(n, e)) !== null) return q;
                return n[e];
              },
              propHooks: {
                tabIndex: {
                  get: function (n) {
                    var e = M.find.attr(n, "tabindex");
                    if (e) return parseInt(e, 10);
                    if (vp.test(n.nodeName) || (ma.test(n.nodeName) && n.href))
                      return 0;
                    return -1;
                  },
                },
              },
              propFix: {
                for: "htmlFor",
                class: "className",
              },
            }),
            !y.optSelected)
          )
            M.propHooks.selected = {
              get: function (n) {
                var e = n.parentNode;
                if (e && e.parentNode) e.parentNode.selectedIndex;
                return null;
              },
              set: function (n) {
                var e = n.parentNode;
                if (e)
                  if ((e.selectedIndex, e.parentNode))
                    e.parentNode.selectedIndex;
              },
            };
          function Mv(n) {
            var e = n.match(c) || [];
            return e.join(" ");
          }
          function vR(n) {
            return (n.getAttribute && n.getAttribute("class")) || "";
          }
          function Ey(n) {
            if (Array.isArray(n)) return n;
            if (typeof n === "string") return n.match(c) || [];
            return [];
          }
          M.each(
            [
              "tabIndex",
              "readOnly",
              "maxLength",
              "cellSpacing",
              "cellPadding",
              "rowSpan",
              "colSpan",
              "useMap",
              "frameBorder",
              "contentEditable",
            ],
            function () {
              M.propFix[this.toLowerCase()] = this;
            }
          ),
            M.fn.extend({
              addClass: function (n) {
                var e, z, q, l, P, U;
                if (X(n))
                  return this.each(function (e) {
                    M(this).addClass(n.call(this, e, vR(this)));
                  });
                if (((e = Ey(n)), e.length))
                  return this.each(function () {
                    if (
                      ((q = vR(this)),
                      (z = this.nodeType === 1 && " " + Mv(q) + " "),
                      z)
                    ) {
                      for (P = 0; P < e.length; P++)
                        if (((l = e[P]), z.indexOf(" " + l + " ") < 0))
                          z += l + " ";
                      if (((U = Mv(z)), q !== U)) this.setAttribute("class", U);
                    }
                  });
                return this;
              },
              removeClass: function (n) {
                var e, z, q, l, P, U;
                if (X(n))
                  return this.each(function (e) {
                    M(this).removeClass(n.call(this, e, vR(this)));
                  });
                if (!arguments.length) return this.attr("class", "");
                if (((e = Ey(n)), e.length))
                  return this.each(function () {
                    if (
                      ((q = vR(this)),
                      (z = this.nodeType === 1 && " " + Mv(q) + " "),
                      z)
                    ) {
                      for (P = 0; P < e.length; P++) {
                        l = e[P];
                        while (z.indexOf(" " + l + " ") > -1)
                          z = z.replace(" " + l + " ", " ");
                      }
                      if (((U = Mv(z)), q !== U)) this.setAttribute("class", U);
                    }
                  });
                return this;
              },
              toggleClass: function (n, e) {
                var z,
                  q,
                  l,
                  P,
                  U = typeof n,
                  r = U === "string" || Array.isArray(n);
                if (X(n))
                  return this.each(function (z) {
                    M(this).toggleClass(n.call(this, z, vR(this), e), e);
                  });
                if (typeof e === "boolean" && r)
                  return e ? this.addClass(n) : this.removeClass(n);
                return (
                  (z = Ey(n)),
                  this.each(function () {
                    if (r)
                      for (P = M(this), l = 0; l < z.length; l++)
                        if (((q = z[l]), P.hasClass(q))) P.removeClass(q);
                        else P.addClass(q);
                    else if (n === void 0 || U === "boolean") {
                      if (((q = vR(this)), q)) dV.set(this, "__className__", q);
                      if (this.setAttribute)
                        this.setAttribute(
                          "class",
                          q || n === false
                            ? ""
                            : dV.get(this, "__className__") || ""
                        );
                    }
                  })
                );
              },
              hasClass: function (n) {
                var e,
                  z,
                  q = 0;
                e = " " + n + " ";
                while ((z = this[q++]))
                  if (
                    z.nodeType === 1 &&
                    (" " + Mv(vR(z)) + " ").indexOf(e) > -1
                  )
                    return true;
                return false;
              },
            });
          var lv = /\r/g;
          M.fn.extend({
            val: function (n) {
              var e,
                z,
                q,
                l = this[0];
              if (!arguments.length) {
                if (l) {
                  if (
                    ((e =
                      M.valHooks[l.type] ||
                      M.valHooks[l.nodeName.toLowerCase()]),
                    e && "get" in e && (z = e.get(l, "value")) !== void 0)
                  )
                    return z;
                  if (((z = l.value), typeof z === "string"))
                    return z.replace(lv, "");
                  return z == null ? "" : z;
                }
                return;
              }
              return (
                (q = X(n)),
                this.each(function (z) {
                  var l;
                  if (this.nodeType !== 1) return;
                  if (q) l = n.call(this, z, M(this).val());
                  else l = n;
                  if (l == null) l = "";
                  else if (typeof l === "number") l += "";
                  else if (Array.isArray(l))
                    l = M.map(l, function (n) {
                      return n == null ? "" : n + "";
                    });
                  if (
                    ((e =
                      M.valHooks[this.type] ||
                      M.valHooks[this.nodeName.toLowerCase()]),
                    !e || !("set" in e) || e.set(this, l, "value") === void 0)
                  )
                    this.value = l;
                })
              );
            },
          }),
            M.extend({
              valHooks: {
                option: {
                  get: function (n) {
                    var e = M.find.attr(n, "value");
                    return e != null ? e : Mv(M.text(n));
                  },
                },
                select: {
                  get: function (n) {
                    var e,
                      z,
                      q,
                      l = n.options,
                      P = n.selectedIndex,
                      U = n.type === "select-one",
                      r = U ? null : [],
                      F = U ? P + 1 : l.length;
                    if (P < 0) q = F;
                    else q = U ? P : 0;
                    for (; q < F; q++)
                      if (
                        ((z = l[q]),
                        (z.selected || q === P) &&
                          !z.disabled &&
                          (!z.parentNode.disabled ||
                            !E(z.parentNode, "optgroup")))
                      ) {
                        if (((e = M(z).val()), U)) return e;
                        r.push(e);
                      }
                    return r;
                  },
                  set: function (n, e) {
                    var z,
                      q,
                      l = n.options,
                      P = M.makeArray(e),
                      U = l.length;
                    while (U--)
                      if (
                        ((q = l[U]),
                        (q.selected =
                          M.inArray(M.valHooks.option.get(q), P) > -1))
                      )
                        z = true;
                    if (!z) n.selectedIndex = -1;
                    return P;
                  },
                },
              },
            }),
            M.each(["radio", "checkbox"], function () {
              if (
                ((M.valHooks[this] = {
                  set: function (n, e) {
                    if (Array.isArray(e))
                      return (n.checked = M.inArray(M(n).val(), e) > -1);
                  },
                }),
                !y.checkOn)
              )
                M.valHooks[this].get = function (n) {
                  return n.getAttribute("value") === null ? "on" : n.value;
                };
            });
          var XM = n.location,
            aZ = {
              guid: Date.now(),
            },
            FV = /\?/;
          M.parseXML = function (e) {
            var z, q;
            if (!e || typeof e !== "string") return null;
            try {
              z = new n.DOMParser().parseFromString(e, "text/xml");
            } catch (n) {}
            if (((q = z && z.getElementsByTagName("parsererror")[0]), !z || q))
              M.error(
                "Invalid XML: " +
                  (q
                    ? M.map(q.childNodes, function (n) {
                        return n.textContent;
                      }).join("\n")
                    : e)
              );
            return z;
          };
          var so = /^(?:focusinfocus|focusoutblur)$/,
            QX = function (n) {
              n.stopPropagation();
            };
          M.extend(M.event, {
            trigger: function (e, z, q, l) {
              var P,
                U,
                r,
                F,
                a,
                b,
                p,
                y,
                d = [q || u],
                m = t.call(e, "type") ? e.type : e,
                W = t.call(e, "namespace") ? e.namespace.split(".") : [];
              if (
                ((U = y = r = q = q || u), q.nodeType === 3 || q.nodeType === 8)
              )
                return;
              if (so.test(m + M.event.triggered)) return;
              if (m.indexOf(".") > -1)
                (W = m.split(".")), (m = W.shift()), W.sort();
              if (
                ((a = m.indexOf(":") < 0 && "on" + m),
                (e = e[M.expando]
                  ? e
                  : new M.Event(m, typeof e === "object" && e)),
                (e.isTrigger = l ? 2 : 3),
                (e.namespace = W.join(".")),
                (e.rnamespace = e.namespace
                  ? new RegExp("(^|\\.)" + W.join("\\.(?:.*\\.|)") + "(\\.|$)")
                  : null),
                (e.result = void 0),
                !e.target)
              )
                e.target = q;
              if (
                ((z = z == null ? [e] : M.makeArray(z, [e])),
                (p = M.event.special[m] || {}),
                !l && p.trigger && p.trigger.apply(q, z) === false)
              )
                return;
              if (!l && !p.noBubble && !O(q)) {
                if (((F = p.delegateType || m), !so.test(F + m)))
                  U = U.parentNode;
                for (; U; U = U.parentNode) d.push(U), (r = U);
                if (r === (q.ownerDocument || u))
                  d.push(r.defaultView || r.parentWindow || n);
              }
              P = 0;
              while ((U = d[P++]) && !e.isPropagationStopped()) {
                if (
                  ((y = U),
                  (e.type = P > 1 ? F : p.bindType || m),
                  (b =
                    (dV.get(U, "events") || Object.create(null))[e.type] &&
                    dV.get(U, "handle")),
                  b)
                )
                  b.apply(U, z);
                if (((b = a && U[a]), b && b.apply && KZ(U)))
                  if (((e.result = b.apply(U, z)), e.result === false))
                    e.preventDefault();
              }
              if (((e.type = m), !l && !e.isDefaultPrevented()))
                if (
                  (!p._default || p._default.apply(d.pop(), z) === false) &&
                  KZ(q)
                )
                  if (a && X(q[m]) && !O(q)) {
                    if (((r = q[a]), r)) q[a] = null;
                    if (((M.event.triggered = m), e.isPropagationStopped()))
                      y.addEventListener(m, QX);
                    if ((q[m](), e.isPropagationStopped()))
                      y.removeEventListener(m, QX);
                    if (((M.event.triggered = void 0), r)) q[a] = r;
                  }
              return e.result;
            },
            simulate: function (n, e, z) {
              var q = M.extend(new M.Event(), z, {
                type: n,
                isSimulated: true,
              });
              M.event.trigger(q, null, e);
            },
          }),
            M.fn.extend({
              trigger: function (n, e) {
                return this.each(function () {
                  M.event.trigger(n, e, this);
                });
              },
              triggerHandler: function (n, e) {
                var z = this[0];
                if (z) return M.event.trigger(n, e, z, true);
              },
            });
          var KL = /\[\]$/,
            lr = /\r?\n/g,
            dF = /^(?:submit|button|image|reset|file)$/i,
            lO = /^(?:input|select|textarea|keygen)/i;
          function Oj(n, e, z, q) {
            var l;
            if (Array.isArray(e))
              M.each(e, function (e, l) {
                if (z || KL.test(n)) q(n, l);
                else
                  Oj(
                    n +
                      "[" +
                      (typeof l === "object" && l != null ? e : "") +
                      "]",
                    l,
                    z,
                    q
                  );
              });
            else if (!z && W(e) === "object")
              for (l in e) Oj(n + "[" + l + "]", e[l], z, q);
            else q(n, e);
          }
          (M.param = function (n, e) {
            var z,
              q = [],
              l = function (n, e) {
                var z = X(e) ? e() : e;
                q[q.length] =
                  encodeURIComponent(n) +
                  "=" +
                  encodeURIComponent(z == null ? "" : z);
              };
            if (n == null) return "";
            if (Array.isArray(n) || (n.jquery && !M.isPlainObject(n)))
              M.each(n, function () {
                l(this.name, this.value);
              });
            else for (z in n) Oj(z, n[z], e, l);
            return q.join("&");
          }),
            M.fn.extend({
              serialize: function () {
                return M.param(this.serializeArray());
              },
              serializeArray: function () {
                return this.map(function () {
                  var n = M.prop(this, "elements");
                  return n ? M.makeArray(n) : this;
                })
                  .filter(function () {
                    var n = this.type;
                    return (
                      this.name &&
                      !M(this).is(":disabled") &&
                      lO.test(this.nodeName) &&
                      !dF.test(n) &&
                      (this.checked || !HH.test(n))
                    );
                  })
                  .map(function (n, e) {
                    var z = M(this).val();
                    if (z == null) return null;
                    if (Array.isArray(z))
                      return M.map(z, function (n) {
                        return {
                          name: e.name,
                          value: n.replace(lr, "\r\n"),
                        };
                      });
                    return {
                      name: e.name,
                      value: z.replace(lr, "\r\n"),
                    };
                  })
                  .get();
              },
            });
          var Gc = /%20/g,
            iH = /#.*$/,
            oX = /([?&])_=[^&]*/,
            LY = /^(.*?):[ \t]*([^\r\n]*)$/gm,
            Tv = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
            xL = /^(?:GET|HEAD)$/,
            Rz = /^\/\//,
            tD = {},
            rL = {},
            ss = "*/".concat("*"),
            yg = u.createElement("a");
          function wW(n) {
            return function (e, z) {
              if (typeof e !== "string") (z = e), (e = "*");
              var q,
                l = 0,
                P = e.toLowerCase().match(c) || [];
              if (X(z))
                while ((q = P[l++]))
                  if (q[0] === "+")
                    (q = q.slice(1) || "*"), (n[q] = n[q] || []).unshift(z);
                  else (n[q] = n[q] || []).push(z);
            };
          }
          function OA(n, e, z, q) {
            var l = {},
              P = n === rL;
            function U(r) {
              var F;
              return (
                (l[r] = true),
                M.each(n[r] || [], function (n, r) {
                  var a = r(e, z, q);
                  if (typeof a === "string" && !P && !l[a])
                    return e.dataTypes.unshift(a), U(a), false;
                  else if (P) return !(F = a);
                }),
                F
              );
            }
            return U(e.dataTypes[0]) || (!l["*"] && U("*"));
          }
          function Ot(n, e) {
            var z,
              q,
              l = M.ajaxSettings.flatOptions || {};
            for (z in e)
              if (e[z] !== void 0) (l[z] ? n : q || (q = {}))[z] = e[z];
            if (q) M.extend(true, n, q);
            return n;
          }
          function Rg(n, e, z) {
            var q,
              l,
              P,
              U,
              r = n.contents,
              F = n.dataTypes;
            while (F[0] === "*")
              if ((F.shift(), q === void 0))
                q = n.mimeType || e.getResponseHeader("Content-Type");
            if (q)
              for (l in r)
                if (r[l] && r[l].test(q)) {
                  F.unshift(l);
                  break;
                }
            if (F[0] in z) P = F[0];
            else {
              for (l in z) {
                if (!F[0] || n.converters[l + " " + F[0]]) {
                  P = l;
                  break;
                }
                if (!U) U = l;
              }
              P = P || U;
            }
            if (P) {
              if (P !== F[0]) F.unshift(P);
              return z[P];
            }
          }
          function mK(n, e, z, q) {
            var l,
              P,
              U,
              r,
              F,
              a = {},
              t = n.dataTypes.slice();
            if (t[1])
              for (U in n.converters) a[U.toLowerCase()] = n.converters[U];
            P = t.shift();
            while (P) {
              if (n.responseFields[P]) z[n.responseFields[P]] = e;
              if (!F && q && n.dataFilter) e = n.dataFilter(e, n.dataType);
              if (((F = P), (P = t.shift()), P))
                if (P === "*") P = F;
                else if (F !== "*" && F !== P) {
                  if (((U = a[F + " " + P] || a["* " + P]), !U))
                    for (l in a)
                      if (((r = l.split(" ")), r[1] === P))
                        if (((U = a[F + " " + r[0]] || a["* " + r[0]]), U)) {
                          if (U === true) U = a[l];
                          else if (a[l] !== true) (P = r[0]), t.unshift(r[1]);
                          break;
                        }
                  if (U !== true)
                    if (U && n.throws) e = U(e);
                    else
                      try {
                        e = U(e);
                      } catch (n) {
                        return {
                          state: "parsererror",
                          error: U ? n : "No conversion from " + F + " to " + P,
                        };
                      }
                }
            }
            return {
              state: "success",
              data: e,
            };
          }
          (yg.href = XM.href),
            M.extend({
              active: 0,
              lastModified: {},
              etag: {},
              ajaxSettings: {
                url: XM.href,
                type: "GET",
                isLocal: Tv.test(XM.protocol),
                global: true,
                processData: true,
                async: true,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: {
                  "*": ss,
                  text: "text/plain",
                  html: "text/html",
                  xml: "application/xml, text/xml",
                  json: "application/json, text/javascript",
                },
                contents: {
                  xml: /\bxml\b/,
                  html: /\bhtml/,
                  json: /\bjson\b/,
                },
                responseFields: {
                  xml: "responseXML",
                  text: "responseText",
                  json: "responseJSON",
                },
                converters: {
                  "* text": String,
                  "text html": true,
                  "text json": JSON.parse,
                  "text xml": M.parseXML,
                },
                flatOptions: {
                  url: true,
                  context: true,
                },
              },
              ajaxSetup: function (n, e) {
                return e ? Ot(Ot(n, M.ajaxSettings), e) : Ot(M.ajaxSettings, n);
              },
              ajaxPrefilter: wW(tD),
              ajaxTransport: wW(rL),
              ajax: function (e, z) {
                if (typeof e === "object") (z = e), (e = void 0);
                z = z || {};
                var q,
                  l,
                  P,
                  U,
                  r,
                  F,
                  a,
                  t,
                  b,
                  p,
                  y = M.ajaxSetup({}, z),
                  X = y.context || y,
                  O = y.context && (X.nodeType || X.jquery) ? M(X) : M.event,
                  d = M.Deferred(),
                  m = M.Callbacks("once memory"),
                  W = y.statusCode || {},
                  D = {},
                  L = {},
                  g = "canceled",
                  E = {
                    readyState: 0,
                    getResponseHeader: function (n) {
                      var e;
                      if (a) {
                        if (!U) {
                          U = {};
                          while ((e = LY.exec(P)))
                            U[e[1].toLowerCase() + " "] = (
                              U[e[1].toLowerCase() + " "] || []
                            ).concat(e[2]);
                        }
                        e = U[n.toLowerCase() + " "];
                      }
                      return e == null ? null : e.join(", ");
                    },
                    getAllResponseHeaders: function () {
                      return a ? P : null;
                    },
                    setRequestHeader: function (n, e) {
                      if (a == null)
                        (n = L[n.toLowerCase()] = L[n.toLowerCase()] || n),
                          (D[n] = e);
                      return this;
                    },
                    overrideMimeType: function (n) {
                      if (a == null) y.mimeType = n;
                      return this;
                    },
                    statusCode: function (n) {
                      var e;
                      if (n)
                        if (a) E.always(n[E.status]);
                        else for (e in n) W[e] = [W[e], n[e]];
                      return this;
                    },
                    abort: function (n) {
                      var e = n || g;
                      if (q) q.abort(e);
                      return J(0, e), this;
                    },
                  };
                if (
                  (d.promise(E),
                  (y.url = ((e || y.url || XM.href) + "").replace(
                    Rz,
                    XM.protocol + "//"
                  )),
                  (y.type = z.method || z.type || y.method || y.type),
                  (y.dataTypes = (y.dataType || "*").toLowerCase().match(c) || [
                    "",
                  ]),
                  y.crossDomain == null)
                ) {
                  F = u.createElement("a");
                  try {
                    (F.href = y.url),
                      (F.href = F.href),
                      (y.crossDomain =
                        yg.protocol + "//" + yg.host !==
                        F.protocol + "//" + F.host);
                  } catch (n) {
                    y.crossDomain = true;
                  }
                }
                if (y.data && y.processData && typeof y.data !== "string")
                  y.data = M.param(y.data, y.traditional);
                if ((OA(tD, y, z, E), a)) return E;
                if (((t = M.event && y.global), t && M.active++ === 0))
                  M.event.trigger("ajaxStart");
                if (
                  ((y.type = y.type.toUpperCase()),
                  (y.hasContent = !xL.test(y.type)),
                  (l = y.url.replace(iH, "")),
                  !y.hasContent)
                ) {
                  if (
                    ((p = y.url.slice(l.length)),
                    y.data && (y.processData || typeof y.data === "string"))
                  )
                    (l += (FV.test(l) ? "&" : "?") + y.data), delete y.data;
                  if (y.cache === false)
                    (l = l.replace(oX, "$1")),
                      (p = (FV.test(l) ? "&" : "?") + "_=" + aZ.guid++ + p);
                  y.url = l + p;
                } else if (
                  y.data &&
                  y.processData &&
                  (y.contentType || "").indexOf(
                    "application/x-www-form-urlencoded"
                  ) === 0
                )
                  y.data = y.data.replace(Gc, "+");
                if (y.ifModified) {
                  if (M.lastModified[l])
                    E.setRequestHeader("If-Modified-Since", M.lastModified[l]);
                  if (M.etag[l]) E.setRequestHeader("If-None-Match", M.etag[l]);
                }
                if (
                  (y.data && y.hasContent && y.contentType !== false) ||
                  z.contentType
                )
                  E.setRequestHeader("Content-Type", y.contentType);
                for (b in (E.setRequestHeader(
                  "Accept",
                  y.dataTypes[0] && y.accepts[y.dataTypes[0]]
                    ? y.accepts[y.dataTypes[0]] +
                        (y.dataTypes[0] !== "*" ? ", " + ss + "; q=0.01" : "")
                    : y.accepts["*"]
                ),
                y.headers))
                  E.setRequestHeader(b, y.headers[b]);
                if (y.beforeSend && (y.beforeSend.call(X, E, y) === false || a))
                  return E.abort();
                if (
                  ((g = "abort"),
                  m.add(y.complete),
                  E.done(y.success),
                  E.fail(y.error),
                  (q = OA(rL, y, z, E)),
                  !q)
                )
                  J(-1, "No Transport");
                else {
                  if (((E.readyState = 1), t)) O.trigger("ajaxSend", [E, y]);
                  if (a) return E;
                  if (y.async && y.timeout > 0)
                    r = n.setTimeout(function () {
                      E.abort("timeout");
                    }, y.timeout);
                  try {
                    (a = false), q.send(D, J);
                  } catch (n) {
                    if (a) throw n;
                    J(-1, n);
                  }
                }
                function J(e, z, U, F) {
                  var b,
                    p,
                    u,
                    D,
                    L,
                    g = z;
                  if (a) return;
                  if (((a = true), r)) n.clearTimeout(r);
                  if (
                    ((q = void 0),
                    (P = F || ""),
                    (E.readyState = e > 0 ? 4 : 0),
                    (b = (e >= 200 && e < 300) || e === 304),
                    U)
                  )
                    D = Rg(y, E, U);
                  if (
                    !b &&
                    M.inArray("script", y.dataTypes) > -1 &&
                    M.inArray("json", y.dataTypes) < 0
                  )
                    y.converters["text script"] = function () {};
                  if (((D = mK(y, D, E, b)), b)) {
                    if (y.ifModified) {
                      if (((L = E.getResponseHeader("Last-Modified")), L))
                        M.lastModified[l] = L;
                      if (((L = E.getResponseHeader("etag")), L)) M.etag[l] = L;
                    }
                    if (e === 204 || y.type === "HEAD") g = "nocontent";
                    else if (e === 304) g = "notmodified";
                    else (g = D.state), (p = D.data), (u = D.error), (b = !u);
                  } else if (((u = g), e || !g))
                    if (((g = "error"), e < 0)) e = 0;
                  if (((E.status = e), (E.statusText = (z || g) + ""), b))
                    d.resolveWith(X, [p, g, E]);
                  else d.rejectWith(X, [E, g, u]);
                  if ((E.statusCode(W), (W = void 0), t))
                    O.trigger(b ? "ajaxSuccess" : "ajaxError", [
                      E,
                      y,
                      b ? p : u,
                    ]);
                  if ((m.fireWith(X, [E, g]), t))
                    if ((O.trigger("ajaxComplete", [E, y]), !--M.active))
                      M.event.trigger("ajaxStop");
                }
                return E;
              },
              getJSON: function (n, e, z) {
                return M.get(n, e, z, "json");
              },
              getScript: function (n, e) {
                return M.get(n, void 0, e, "script");
              },
            }),
            M.each(["get", "post"], function (n, e) {
              M[e] = function (n, z, q, l) {
                if (X(z)) (l = l || q), (q = z), (z = void 0);
                return M.ajax(
                  M.extend(
                    {
                      url: n,
                      type: e,
                      dataType: l,
                      data: z,
                      success: q,
                    },
                    M.isPlainObject(n) && n
                  )
                );
              };
            }),
            M.ajaxPrefilter(function (n) {
              var e;
              for (e in n.headers)
                if (e.toLowerCase() === "content-type")
                  n.contentType = n.headers[e] || "";
            }),
            (M._evalUrl = function (n, e, z) {
              return M.ajax({
                url: n,
                type: "GET",
                dataType: "script",
                cache: true,
                async: false,
                global: false,
                converters: {
                  "text script": function () {},
                },
                dataFilter: function (n) {
                  M.globalEval(n, e, z);
                },
              });
            }),
            M.fn.extend({
              wrapAll: function (n) {
                var e;
                if (this[0]) {
                  if (X(n)) n = n.call(this[0]);
                  if (
                    ((e = M(n, this[0].ownerDocument).eq(0).clone(true)),
                    this[0].parentNode)
                  )
                    e.insertBefore(this[0]);
                  e.map(function () {
                    var n = this;
                    while (n.firstElementChild) n = n.firstElementChild;
                    return n;
                  }).append(this);
                }
                return this;
              },
              wrapInner: function (n) {
                if (X(n))
                  return this.each(function (e) {
                    M(this).wrapInner(n.call(this, e));
                  });
                return this.each(function () {
                  var e = M(this),
                    z = e.contents();
                  if (z.length) z.wrapAll(n);
                  else e.append(n);
                });
              },
              wrap: function (n) {
                var e = X(n);
                return this.each(function (z) {
                  M(this).wrapAll(e ? n.call(this, z) : n);
                });
              },
              unwrap: function (n) {
                return (
                  this.parent(n)
                    .not("body")
                    .each(function () {
                      M(this).replaceWith(this.childNodes);
                    }),
                  this
                );
              },
            }),
            (M.expr.pseudos.hidden = function (n) {
              return !M.expr.pseudos.visible(n);
            }),
            (M.expr.pseudos.visible = function (n) {
              return !!(
                n.offsetWidth ||
                n.offsetHeight ||
                n.getClientRects().length
              );
            }),
            (M.ajaxSettings.xhr = function () {
              try {
                return new n.XMLHttpRequest();
              } catch (n) {}
            });
          var an = {
              0: 200,
              1223: 204,
            },
            aF = M.ajaxSettings.xhr();
          (y.cors = !!aF && "withCredentials" in aF),
            (y.ajax = aF = !!aF),
            M.ajaxTransport(function (e) {
              var z, q;
              if (y.cors || (aF && !e.crossDomain))
                return {
                  send: function (l, P) {
                    var U,
                      r = e.xhr();
                    if (
                      (r.open(e.type, e.url, e.async, e.username, e.password),
                      e.xhrFields)
                    )
                      for (U in e.xhrFields) r[U] = e.xhrFields[U];
                    if (e.mimeType && r.overrideMimeType)
                      r.overrideMimeType(e.mimeType);
                    if (!e.crossDomain && !l["X-Requested-With"])
                      l["X-Requested-With"] = "XMLHttpRequest";
                    for (U in l) r.setRequestHeader(U, l[U]);
                    if (
                      ((z = function (n) {
                        return function () {
                          if (z)
                            if (
                              ((z =
                                q =
                                r.onload =
                                r.onerror =
                                r.onabort =
                                r.ontimeout =
                                r.onreadystatechange =
                                  null),
                              n === "abort")
                            )
                              r.abort();
                            else if (n === "error")
                              if (typeof r.status !== "number") P(0, "error");
                              else P(r.status, r.statusText);
                            else
                              P(
                                an[r.status] || r.status,
                                r.statusText,
                                (r.responseType || "text") !== "text" ||
                                  typeof r.responseText !== "string"
                                  ? {
                                      binary: r.response,
                                    }
                                  : {
                                      text: r.responseText,
                                    },
                                r.getAllResponseHeaders()
                              );
                        };
                      }),
                      (r.onload = z()),
                      (q = r.onerror = r.ontimeout = z("error")),
                      r.onabort !== void 0)
                    )
                      r.onabort = q;
                    else
                      r.onreadystatechange = function () {
                        if (r.readyState === 4)
                          n.setTimeout(function () {
                            if (z) q();
                          });
                      };
                    z = z("abort");
                    try {
                      r.send((e.hasContent && e.data) || null);
                    } catch (n) {
                      if (z) throw n;
                    }
                  },
                  abort: function () {
                    if (z) z();
                  },
                };
            }),
            M.ajaxPrefilter(function (n) {
              if (n.crossDomain) n.contents.script = false;
            }),
            M.ajaxSetup({
              accepts: {
                script:
                  "text/javascript, application/javascript, " +
                  "application/ecmascript, application/x-ecmascript",
              },
              contents: {
                script: /\b(?:java|ecma)script\b/,
              },
              converters: {
                "text script": function (n) {
                  return M.globalEval(n), n;
                },
              },
            }),
            M.ajaxPrefilter("script", function (n) {
              if (n.cache === void 0) n.cache = false;
              if (n.crossDomain) n.type = "GET";
            }),
            M.ajaxTransport("script", function (n) {
              if (n.crossDomain || n.scriptAttrs) {
                var e, z;
                return {
                  send: function (q, l) {
                    (e = M("<script>")
                      .attr(n.scriptAttrs || {})
                      .prop({
                        charset: n.scriptCharset,
                        src: n.url,
                      })
                      .on(
                        "load error",
                        (z = function (n) {
                          if ((e.remove(), (z = null), n))
                            l(n.type === "error" ? 404 : 200, n.type);
                        })
                      )),
                      u.head.appendChild(e[0]);
                  },
                  abort: function () {
                    if (z) z();
                  },
                };
              }
            });
          var VZ = [],
            UP = /(=)\?(?=&|$)|\?\?/,
            yR;
          M.ajaxSetup({
            jsonp: "callback",
            jsonpCallback: function () {
              var n = VZ.pop() || M.expando + "_" + aZ.guid++;
              return (this[n] = true), n;
            },
          }),
            M.ajaxPrefilter("json jsonp", function (e, z, q) {
              var l,
                P,
                U,
                r =
                  e.jsonp !== false &&
                  (UP.test(e.url)
                    ? "url"
                    : typeof e.data === "string" &&
                      (e.contentType || "").indexOf(
                        "application/x-www-form-urlencoded"
                      ) === 0 &&
                      UP.test(e.data) &&
                      "data");
              if (r || e.dataTypes[0] === "jsonp") {
                if (
                  ((l = e.jsonpCallback =
                    X(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback),
                  r)
                )
                  e[r] = e[r].replace(UP, "$1" + l);
                else if (e.jsonp !== false)
                  e.url += (FV.test(e.url) ? "&" : "?") + e.jsonp + "=" + l;
                return (
                  (e.converters["script json"] = function () {
                    if (!U) M.error(l + " was not called");
                    return U[0];
                  }),
                  (e.dataTypes[0] = "json"),
                  (P = n[l]),
                  (n[l] = function () {
                    U = arguments;
                  }),
                  q.always(function () {
                    if (P === void 0) M(n).removeProp(l);
                    else n[l] = P;
                    if (e[l]) (e.jsonpCallback = z.jsonpCallback), VZ.push(l);
                    if (U && X(P)) P(U[0]);
                    U = P = void 0;
                  }),
                  "script"
                );
              }
            }),
            (y.createHTMLDocument =
              ((yR = u.implementation.createHTMLDocument("").body),
              (yR.innerHTML = "<form></form><form></form>"),
              yR.childNodes.length === 2)),
            (M.parseHTML = function (n, e, z) {
              if (typeof n !== "string") return [];
              if (typeof e === "boolean") (z = e), (e = false);
              var q, l, P;
              if (!e)
                if (y.createHTMLDocument)
                  (e = u.implementation.createHTMLDocument("")),
                    (q = e.createElement("base")),
                    (q.href = u.location.href),
                    e.head.appendChild(q);
                else e = u;
              if (((l = h.exec(n)), (P = !z && []), l))
                return [e.createElement(l[1])];
              if (((l = WW([n], e, P)), P && P.length)) M(P).remove();
              return M.merge([], l.childNodes);
            }),
            (M.fn.load = function (n, e, z) {
              var q,
                l,
                P,
                U = this,
                r = n.indexOf(" ");
              if (r > -1) (q = Mv(n.slice(r))), (n = n.slice(0, r));
              if (X(e)) (z = e), (e = void 0);
              else if (e && typeof e === "object") l = "POST";
              if (U.length > 0)
                M.ajax({
                  url: n,
                  type: l || "GET",
                  dataType: "html",
                  data: e,
                })
                  .done(function (n) {
                    (P = arguments),
                      U.html(q ? M("<div>").append(M.parseHTML(n)).find(q) : n);
                  })
                  .always(
                    z &&
                      function (n, e) {
                        U.each(function () {
                          z.apply(this, P || [n.responseText, e, n]);
                        });
                      }
                  );
              return this;
            }),
            (M.expr.pseudos.animated = function (n) {
              return M.grep(M.timers, function (e) {
                return n === e.elem;
              }).length;
            }),
            (M.offset = {
              setOffset: function (n, e, z) {
                var q,
                  l,
                  P,
                  U,
                  r,
                  F,
                  a,
                  t = M.css(n, "position"),
                  b = M(n),
                  p = {};
                if (t === "static") n.style.position = "relative";
                if (
                  ((r = b.offset()),
                  (P = M.css(n, "top")),
                  (F = M.css(n, "left")),
                  (a =
                    (t === "absolute" || t === "fixed") &&
                    (P + F).indexOf("auto") > -1),
                  a)
                )
                  (q = b.position()), (U = q.top), (l = q.left);
                else (U = parseFloat(P) || 0), (l = parseFloat(F) || 0);
                if (X(e)) e = e.call(n, z, M.extend({}, r));
                if (e.top != null) p.top = e.top - r.top + U;
                if (e.left != null) p.left = e.left - r.left + l;
                if ("using" in e) e.using.call(n, p);
                else b.css(p);
              },
            }),
            M.fn.extend({
              offset: function (n) {
                if (arguments.length)
                  return n === void 0
                    ? this
                    : this.each(function (e) {
                        M.offset.setOffset(this, n, e);
                      });
                var e,
                  z,
                  q = this[0];
                if (!q) return;
                if (!q.getClientRects().length)
                  return {
                    top: 0,
                    left: 0,
                  };
                return (
                  (e = q.getBoundingClientRect()),
                  (z = q.ownerDocument.defaultView),
                  {
                    top: e.top + z.pageYOffset,
                    left: e.left + z.pageXOffset,
                  }
                );
              },
              position: function () {
                if (!this[0]) return;
                var n,
                  e,
                  z,
                  q = this[0],
                  l = {
                    top: 0,
                    left: 0,
                  };
                if (M.css(q, "position") === "fixed")
                  e = q.getBoundingClientRect();
                else {
                  (e = this.offset()),
                    (z = q.ownerDocument),
                    (n = q.offsetParent || z.documentElement);
                  while (
                    n &&
                    (n === z.body || n === z.documentElement) &&
                    M.css(n, "position") === "static"
                  )
                    n = n.parentNode;
                  if (n && n !== q && n.nodeType === 1)
                    (l = M(n).offset()),
                      (l.top += M.css(n, "borderTopWidth", true)),
                      (l.left += M.css(n, "borderLeftWidth", true));
                }
                return {
                  top: e.top - l.top - M.css(q, "marginTop", true),
                  left: e.left - l.left - M.css(q, "marginLeft", true),
                };
              },
              offsetParent: function () {
                return this.map(function () {
                  var n = this.offsetParent;
                  while (n && M.css(n, "position") === "static")
                    n = n.offsetParent;
                  return n || mL;
                });
              },
            }),
            M.each(
              {
                scrollLeft: "pageXOffset",
                scrollTop: "pageYOffset",
              },
              function (n, e) {
                var z = "pageYOffset" === e;
                M.fn[n] = function (q) {
                  return Ez(
                    this,
                    function (n, q, l) {
                      var P;
                      if (O(n)) P = n;
                      else if (n.nodeType === 9) P = n.defaultView;
                      if (l === void 0) return P ? P[e] : n[q];
                      if (P)
                        P.scrollTo(
                          !z ? l : P.pageXOffset,
                          z ? l : P.pageYOffset
                        );
                      else n[q] = l;
                    },
                    n,
                    q,
                    arguments.length
                  );
                };
              }
            ),
            M.each(["top", "left"], function (n, e) {
              M.cssHooks[e] = We(y.pixelPosition, function (n, z) {
                if (z)
                  return (
                    (z = qh(n, e)), Ip.test(z) ? M(n).position()[e] + "px" : z
                  );
              });
            }),
            M.each(
              {
                Height: "height",
                Width: "width",
              },
              function (n, e) {
                M.each(
                  {
                    padding: "inner" + n,
                    content: e,
                    "": "outer" + n,
                  },
                  function (z, q) {
                    M.fn[q] = function (l, P) {
                      var U = arguments.length && (z || typeof l !== "boolean"),
                        r =
                          z || (l === true || P === true ? "margin" : "border");
                      return Ez(
                        this,
                        function (e, z, l) {
                          var P;
                          if (O(e))
                            return q.indexOf("outer") === 0
                              ? e["inner" + n]
                              : e.document.documentElement["client" + n];
                          if (e.nodeType === 9)
                            return (
                              (P = e.documentElement),
                              Math.max(
                                e.body["scroll" + n],
                                P["scroll" + n],
                                e.body["offset" + n],
                                P["offset" + n],
                                P["client" + n]
                              )
                            );
                          return l === void 0
                            ? M.css(e, z, r)
                            : M.style(e, z, l, r);
                        },
                        e,
                        U ? l : void 0,
                        U
                      );
                    };
                  }
                );
              }
            ),
            M.each(
              [
                "ajaxStart",
                "ajaxStop",
                "ajaxComplete",
                "ajaxError",
                "ajaxSuccess",
                "ajaxSend",
              ],
              function (n, e) {
                M.fn[e] = function (n) {
                  return this.on(e, n);
                };
              }
            ),
            M.fn.extend({
              bind: function (n, e, z) {
                return this.on(n, null, e, z);
              },
              unbind: function (n, e) {
                return this.off(n, null, e);
              },
              delegate: function (n, e, z, q) {
                return this.on(e, n, z, q);
              },
              undelegate: function (n, e, z) {
                return arguments.length === 1
                  ? this.off(n, "**")
                  : this.off(e, n || "**", z);
              },
              hover: function (n, e) {
                return this.on("mouseenter", n).on("mouseleave", e || n);
              },
            }),
            M.each(
              (
                "blur focus focusin focusout resize scroll click dblclick " +
                "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
                "change select submit keydown keypress keyup contextmenu"
              ).split(" "),
              function (n, e) {
                M.fn[e] = function (n, z) {
                  return arguments.length > 0
                    ? this.on(e, null, n, z)
                    : this.trigger(e);
                };
              }
            );
          var zF = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;
          if (
            ((M.proxy = function (n, e) {
              var z, q, P;
              if (typeof e === "string") (z = n[e]), (e = n), (n = z);
              if (!X(n)) return;
              return (
                (q = l.call(arguments, 2)),
                (P = function () {
                  return n.apply(e || this, q.concat(l.call(arguments)));
                }),
                (P.guid = n.guid = n.guid || M.guid++),
                P
              );
            }),
            (M.holdReady = function (n) {
              if (n) M.readyWait++;
              else M.ready(true);
            }),
            (M.isArray = Array.isArray),
            (M.parseJSON = JSON.parse),
            (M.nodeName = E),
            (M.isFunction = X),
            (M.isWindow = O),
            (M.camelCase = kW),
            (M.type = W),
            (M.now = Date.now),
            (M.isNumeric = function (n) {
              var e = M.type(n);
              return (
                (e === "number" || e === "string") && !isNaN(n - parseFloat(n))
              );
            }),
            (M.trim = function (n) {
              return n == null ? "" : (n + "").replace(zF, "$1");
            }),
            typeof define === "function" && define.amd)
          )
            define("jquery", [], function () {
              return M;
            });
          var PP = n.jQuery,
            mh = n.$;
          if (
            ((M.noConflict = function (e) {
              if (n.$ === M) n.$ = mh;
              if (e && n.jQuery === M) n.jQuery = PP;
              return M;
            }),
            typeof e === "undefined")
          )
            n.jQuery = n.$ = M;
          return M;
        });
      },
      {},
    ],
    98: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.browser = n("webextension-polyfill"));
      },
      {
        "webextension-polyfill": 99,
      },
    ],
    99: [
      function (n, e, z) {
        "use strict";
        (function (n, q) {
          if (typeof define === "function" && define.amd)
            define("webextension-polyfill", ["module"], q);
          else if (typeof z !== "undefined") q(e);
          else {
            var l = {
              exports: {},
            };
            q(l), (n.browser = l.exports);
          }
        })(
          typeof globalThis !== "undefined"
            ? globalThis
            : typeof self !== "undefined"
            ? self
            : void 0,
          function (n) {
            "use strict";
            if (
              typeof browser === "undefined" ||
              Object.getPrototypeOf(browser) !== Object.prototype
            ) {
              const e =
                  "The message port closed before a response was received.",
                z =
                  "Returning a Promise is the preferred way to send a reply from an onMessage/onMessageExternal listener, as the sendResponse will be removed from the specs (See https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage)",
                q = (n) => {
                  const z = {
                    alarms: {
                      clear: {
                        minArgs: 0,
                        maxArgs: 1,
                      },
                      clearAll: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                      get: {
                        minArgs: 0,
                        maxArgs: 1,
                      },
                      getAll: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                    },
                    bookmarks: {
                      create: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      get: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      getChildren: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      getRecent: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      getSubTree: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      getTree: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                      move: {
                        minArgs: 2,
                        maxArgs: 2,
                      },
                      remove: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      removeTree: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      search: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      update: {
                        minArgs: 2,
                        maxArgs: 2,
                      },
                    },
                    browserAction: {
                      disable: {
                        minArgs: 0,
                        maxArgs: 1,
                        fallbackToNoCallback: true,
                      },
                      enable: {
                        minArgs: 0,
                        maxArgs: 1,
                        fallbackToNoCallback: true,
                      },
                      getBadgeBackgroundColor: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      getBadgeText: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      getPopup: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      getTitle: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      openPopup: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                      setBadgeBackgroundColor: {
                        minArgs: 1,
                        maxArgs: 1,
                        fallbackToNoCallback: true,
                      },
                      setBadgeText: {
                        minArgs: 1,
                        maxArgs: 1,
                        fallbackToNoCallback: true,
                      },
                      setIcon: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      setPopup: {
                        minArgs: 1,
                        maxArgs: 1,
                        fallbackToNoCallback: true,
                      },
                      setTitle: {
                        minArgs: 1,
                        maxArgs: 1,
                        fallbackToNoCallback: true,
                      },
                    },
                    browsingData: {
                      remove: {
                        minArgs: 2,
                        maxArgs: 2,
                      },
                      removeCache: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      removeCookies: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      removeDownloads: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      removeFormData: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      removeHistory: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      removeLocalStorage: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      removePasswords: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      removePluginData: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      settings: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                    },
                    commands: {
                      getAll: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                    },
                    contextMenus: {
                      remove: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      removeAll: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                      update: {
                        minArgs: 2,
                        maxArgs: 2,
                      },
                    },
                    cookies: {
                      get: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      getAll: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      getAllCookieStores: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                      remove: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      set: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                    },
                    devtools: {
                      inspectedWindow: {
                        eval: {
                          minArgs: 1,
                          maxArgs: 2,
                          singleCallbackArg: false,
                        },
                      },
                      panels: {
                        create: {
                          minArgs: 3,
                          maxArgs: 3,
                          singleCallbackArg: true,
                        },
                        elements: {
                          createSidebarPane: {
                            minArgs: 1,
                            maxArgs: 1,
                          },
                        },
                      },
                    },
                    downloads: {
                      cancel: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      download: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      erase: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      getFileIcon: {
                        minArgs: 1,
                        maxArgs: 2,
                      },
                      open: {
                        minArgs: 1,
                        maxArgs: 1,
                        fallbackToNoCallback: true,
                      },
                      pause: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      removeFile: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      resume: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      search: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      show: {
                        minArgs: 1,
                        maxArgs: 1,
                        fallbackToNoCallback: true,
                      },
                    },
                    extension: {
                      isAllowedFileSchemeAccess: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                      isAllowedIncognitoAccess: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                    },
                    history: {
                      addUrl: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      deleteAll: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                      deleteRange: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      deleteUrl: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      getVisits: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      search: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                    },
                    i18n: {
                      detectLanguage: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      getAcceptLanguages: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                    },
                    identity: {
                      launchWebAuthFlow: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                    },
                    idle: {
                      queryState: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                    },
                    management: {
                      get: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      getAll: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                      getSelf: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                      setEnabled: {
                        minArgs: 2,
                        maxArgs: 2,
                      },
                      uninstallSelf: {
                        minArgs: 0,
                        maxArgs: 1,
                      },
                    },
                    notifications: {
                      clear: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      create: {
                        minArgs: 1,
                        maxArgs: 2,
                      },
                      getAll: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                      getPermissionLevel: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                      update: {
                        minArgs: 2,
                        maxArgs: 2,
                      },
                    },
                    pageAction: {
                      getPopup: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      getTitle: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      hide: {
                        minArgs: 1,
                        maxArgs: 1,
                        fallbackToNoCallback: true,
                      },
                      setIcon: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      setPopup: {
                        minArgs: 1,
                        maxArgs: 1,
                        fallbackToNoCallback: true,
                      },
                      setTitle: {
                        minArgs: 1,
                        maxArgs: 1,
                        fallbackToNoCallback: true,
                      },
                      show: {
                        minArgs: 1,
                        maxArgs: 1,
                        fallbackToNoCallback: true,
                      },
                    },
                    permissions: {
                      contains: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      getAll: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                      remove: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      request: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                    },
                    runtime: {
                      getBackgroundPage: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                      getPlatformInfo: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                      openOptionsPage: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                      requestUpdateCheck: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                      sendMessage: {
                        minArgs: 1,
                        maxArgs: 3,
                      },
                      sendNativeMessage: {
                        minArgs: 2,
                        maxArgs: 2,
                      },
                      setUninstallURL: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                    },
                    sessions: {
                      getDevices: {
                        minArgs: 0,
                        maxArgs: 1,
                      },
                      getRecentlyClosed: {
                        minArgs: 0,
                        maxArgs: 1,
                      },
                      restore: {
                        minArgs: 0,
                        maxArgs: 1,
                      },
                    },
                    storage: {
                      local: {
                        clear: {
                          minArgs: 0,
                          maxArgs: 0,
                        },
                        get: {
                          minArgs: 0,
                          maxArgs: 1,
                        },
                        getBytesInUse: {
                          minArgs: 0,
                          maxArgs: 1,
                        },
                        remove: {
                          minArgs: 1,
                          maxArgs: 1,
                        },
                        set: {
                          minArgs: 1,
                          maxArgs: 1,
                        },
                      },
                      managed: {
                        get: {
                          minArgs: 0,
                          maxArgs: 1,
                        },
                        getBytesInUse: {
                          minArgs: 0,
                          maxArgs: 1,
                        },
                      },
                      sync: {
                        clear: {
                          minArgs: 0,
                          maxArgs: 0,
                        },
                        get: {
                          minArgs: 0,
                          maxArgs: 1,
                        },
                        getBytesInUse: {
                          minArgs: 0,
                          maxArgs: 1,
                        },
                        remove: {
                          minArgs: 1,
                          maxArgs: 1,
                        },
                        set: {
                          minArgs: 1,
                          maxArgs: 1,
                        },
                      },
                    },
                    tabs: {
                      captureVisibleTab: {
                        minArgs: 0,
                        maxArgs: 2,
                      },
                      create: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      detectLanguage: {
                        minArgs: 0,
                        maxArgs: 1,
                      },
                      discard: {
                        minArgs: 0,
                        maxArgs: 1,
                      },
                      duplicate: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      executeScript: {
                        minArgs: 1,
                        maxArgs: 2,
                      },
                      get: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      getCurrent: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                      getZoom: {
                        minArgs: 0,
                        maxArgs: 1,
                      },
                      getZoomSettings: {
                        minArgs: 0,
                        maxArgs: 1,
                      },
                      goBack: {
                        minArgs: 0,
                        maxArgs: 1,
                      },
                      goForward: {
                        minArgs: 0,
                        maxArgs: 1,
                      },
                      highlight: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      insertCSS: {
                        minArgs: 1,
                        maxArgs: 2,
                      },
                      move: {
                        minArgs: 2,
                        maxArgs: 2,
                      },
                      query: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      reload: {
                        minArgs: 0,
                        maxArgs: 2,
                      },
                      remove: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      removeCSS: {
                        minArgs: 1,
                        maxArgs: 2,
                      },
                      sendMessage: {
                        minArgs: 2,
                        maxArgs: 3,
                      },
                      setZoom: {
                        minArgs: 1,
                        maxArgs: 2,
                      },
                      setZoomSettings: {
                        minArgs: 1,
                        maxArgs: 2,
                      },
                      update: {
                        minArgs: 1,
                        maxArgs: 2,
                      },
                    },
                    topSites: {
                      get: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                    },
                    webNavigation: {
                      getAllFrames: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      getFrame: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                    },
                    webRequest: {
                      handlerBehaviorChanged: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                    },
                    windows: {
                      create: {
                        minArgs: 0,
                        maxArgs: 1,
                      },
                      get: {
                        minArgs: 1,
                        maxArgs: 2,
                      },
                      getAll: {
                        minArgs: 0,
                        maxArgs: 1,
                      },
                      getCurrent: {
                        minArgs: 0,
                        maxArgs: 1,
                      },
                      getLastFocused: {
                        minArgs: 0,
                        maxArgs: 1,
                      },
                      remove: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      update: {
                        minArgs: 2,
                        maxArgs: 2,
                      },
                    },
                  };
                  if (Object.keys(z).length === 0)
                    throw new Error(
                      "api-metadata.json has not been included in browser-polyfill"
                    );
                  class q extends WeakMap {
                    constructor(n, e = void 0) {
                      super(e), (this.createItem = n);
                    }
                    get(n) {
                      if (!this.has(n)) this.set(n, this.createItem(n));
                      return super.get(n);
                    }
                  }
                  const l = (n) =>
                      n &&
                      typeof n === "object" &&
                      typeof n.then === "function",
                    P =
                      (e, z) =>
                      (...q) => {
                        if (n.runtime.lastError) e.reject(n.runtime.lastError);
                        else if (
                          z.singleCallbackArg ||
                          (q.length <= 1 && z.singleCallbackArg !== false)
                        )
                          e.resolve(q[0]);
                        else e.resolve(q);
                      },
                    U = (n) => (n == 1 ? "argument" : "arguments"),
                    r = (n, e) =>
                      function z(q, ...l) {
                        if (l.length < e.minArgs)
                          throw new Error(
                            `Expected at least ${e.minArgs} ${U(
                              e.minArgs
                            )} for ${n}(), got ${l.length}`
                          );
                        if (l.length > e.maxArgs)
                          throw new Error(
                            `Expected at most ${e.maxArgs} ${U(
                              e.maxArgs
                            )} for ${n}(), got ${l.length}`
                          );
                        return new Promise((z, U) => {
                          if (e.fallbackToNoCallback)
                            try {
                              q[n](
                                ...l,
                                P(
                                  {
                                    resolve: z,
                                    reject: U,
                                  },
                                  e
                                )
                              );
                            } catch (P) {
                              q[n](...l),
                                (e.fallbackToNoCallback = false),
                                (e.noCallback = true),
                                z();
                            }
                          else if (e.noCallback) q[n](...l), z();
                          else
                            q[n](
                              ...l,
                              P(
                                {
                                  resolve: z,
                                  reject: U,
                                },
                                e
                              )
                            );
                        });
                      },
                    F = (n, e, z) =>
                      new Proxy(e, {
                        apply: (e, q, l) => z.call(q, n, ...l),
                      });
                  let a = Function.call.bind(Object.prototype.hasOwnProperty);
                  const t = (n, e = {}, z = {}) => {
                      let q = Object.create(null),
                        l = {
                          has: (e, z) => z in n || z in q,
                          get(l, P, U) {
                            if (P in q) return q[P];
                            if (!(P in n)) return;
                            let b = n[P];
                            if (typeof b === "function")
                              if (typeof e[P] === "function")
                                b = F(n, n[P], e[P]);
                              else if (a(z, P)) {
                                let e = r(P, z[P]);
                                b = F(n, n[P], e);
                              } else b = b.bind(n);
                            else if (
                              typeof b === "object" &&
                              b !== null &&
                              (a(e, P) || a(z, P))
                            )
                              b = t(b, e[P], z[P]);
                            else if (a(z, "*")) b = t(b, e[P], z["*"]);
                            else
                              return (
                                Object.defineProperty(q, P, {
                                  configurable: true,
                                  enumerable: true,
                                  get: () => n[P],
                                  set(e) {
                                    n[P] = e;
                                  },
                                }),
                                b
                              );
                            return (q[P] = b), b;
                          },
                          set(e, z, l, P) {
                            if (z in q) q[z] = l;
                            else n[z] = l;
                            return true;
                          },
                          defineProperty: (n, e, z) =>
                            Reflect.defineProperty(q, e, z),
                          deleteProperty: (n, e) =>
                            Reflect.deleteProperty(q, e),
                        },
                        P = Object.create(n);
                      return new Proxy(P, l);
                    },
                    b = (n) => ({
                      addListener(e, z, ...q) {
                        e.addListener(n.get(z), ...q);
                      },
                      hasListener: (e, z) => e.hasListener(n.get(z)),
                      removeListener(e, z) {
                        e.removeListener(n.get(z));
                      },
                    });
                  let p = false;
                  const y = new q((n) => {
                      if (typeof n !== "function") return n;
                      return function e(z, q, P) {
                        let U = false,
                          r,
                          F = new Promise((n) => {
                            r = function (e) {
                              if (!p) p = true;
                              (U = true), n(e);
                            };
                          }),
                          a;
                        try {
                          a = n(z, q, r);
                        } catch (n) {
                          a = Promise.reject(n);
                        }
                        const t = a !== true && l(a);
                        if (a !== true && !t && !U) return false;
                        const b = (n) => {
                          n.then(
                            (n) => {
                              P(n);
                            },
                            (n) => {
                              let e;
                              if (
                                n &&
                                (n instanceof Error ||
                                  typeof n.message === "string")
                              )
                                e = n.message;
                              else e = "An unexpected error occurred";
                              P({
                                __mozWebExtensionPolyfillReject__: true,
                                message: e,
                              });
                            }
                          ).catch((n) => {});
                        };
                        if (t) b(a);
                        else b(F);
                        return true;
                      };
                    }),
                    X = ({ reject: z, resolve: q }, l) => {
                      if (n.runtime.lastError)
                        if (n.runtime.lastError.message === e) q();
                        else z(n.runtime.lastError);
                      else if (l && l.__mozWebExtensionPolyfillReject__)
                        z(new Error(l.message));
                      else q(l);
                    },
                    O = (n, e, z, ...q) => {
                      if (q.length < e.minArgs)
                        throw new Error(
                          `Expected at least ${e.minArgs} ${U(
                            e.minArgs
                          )} for ${n}(), got ${q.length}`
                        );
                      if (q.length > e.maxArgs)
                        throw new Error(
                          `Expected at most ${e.maxArgs} ${U(
                            e.maxArgs
                          )} for ${n}(), got ${q.length}`
                        );
                      return new Promise((n, e) => {
                        const l = X.bind(null, {
                          resolve: n,
                          reject: e,
                        });
                        q.push(l), z.sendMessage(...q);
                      });
                    },
                    u = {
                      runtime: {
                        onMessage: b(y),
                        onMessageExternal: b(y),
                        sendMessage: O.bind(null, "sendMessage", {
                          minArgs: 1,
                          maxArgs: 3,
                        }),
                      },
                      tabs: {
                        sendMessage: O.bind(null, "sendMessage", {
                          minArgs: 2,
                          maxArgs: 3,
                        }),
                      },
                    },
                    d = {
                      clear: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      get: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      set: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                    };
                  return (
                    (z.privacy = {
                      network: {
                        "*": d,
                      },
                      services: {
                        "*": d,
                      },
                      websites: {
                        "*": d,
                      },
                    }),
                    t(n, u, z)
                  );
                };
              if (
                typeof chrome != "object" ||
                !chrome ||
                !chrome.runtime ||
                !chrome.runtime.id
              )
                throw new Error(
                  "This script should only be loaded in a browser extension."
                );
              n.exports = q(chrome);
            } else n.exports = browser;
          }
        );
      },
      {},
    ],
    100: [
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
        const l = q(n("jquery")),
          P = n("webextension-polyfill-ts"),
          U = q(n("chroma-js"));
        function r(n) {
          if (n.length !== 7) return null;
          const e = n[1] + n[3] + n[5];
          if (e !== n[2] + n[4] + n[6]) return null;
          return `#${e}`;
        }
        function F(n) {
          (0, l.default)("body").removeClass([
            "status-error",
            "status-no-selected",
            "status-selected",
          ]),
            (0, l.default)("body").addClass(n);
        }
        function a(n) {
          var e, z, q, P, a, t, b, p, y;
          if (!n) return;
          if (
            ((z =
              (e = (0, l.default)(".format-item")) === null || e === void 0
                ? void 0
                : e.find("span")) === null ||
              z === void 0 ||
              z.text(""),
            (0, l.default)(".selected-color-wrapper").removeClass([
              "first-container",
              "second-container",
            ]),
            (0, l.default)("#selected-color").css("background", n),
            (0, l.default)("body").hasClass("status-error"))
          )
            F("status-only-selected");
          else F("status-selected");
          const X = {
              hex: {
                upperCase: "",
                lowCase: "",
              },
              shortHex: {
                upperCase: "",
                lowCase: "",
              },
              css: "",
              hsl: "",
              X11: "",
            },
            O = (0, U.default)(n);
          (X.hex.upperCase = O.hex().toUpperCase()),
            (X.hex.lowCase = O.hex().toLowerCase()),
            (X.css = O.css()),
            (X.hsl = O.css("hsl"));
          const u = r(O.hex());
          if (u)
            (X.shortHex.upperCase = u.toUpperCase()),
              (X.shortHex.lowCase = u.toLowerCase());
          if (O.hex() !== O.name()) X.X11 = O.name();
          let d = "first-container";
          if (X.shortHex.upperCase && X.X11) d = "second-container";
          (0, l.default)(".selected-color-wrapper").addClass(d),
            (q = (0, l.default)(".format-hex-upper")) === null ||
              q === void 0 ||
              q.text(X.hex.upperCase),
            (P = (0, l.default)(".format-hex-lower")) === null ||
              P === void 0 ||
              P.text(X.hex.lowCase),
            (a = (0, l.default)(".format-hsl")) === null ||
              a === void 0 ||
              a.text(X.hsl),
            (t = (0, l.default)(".format-css")) === null ||
              t === void 0 ||
              t.text(X.css),
            (b = (0, l.default)(".format-short-hex-upper")) === null ||
              b === void 0 ||
              b.text(X.shortHex.upperCase),
            (p = (0, l.default)(".format-short-hex-lower")) === null ||
              p === void 0 ||
              p.text(X.shortHex.lowCase),
            (y = (0, l.default)(".format-x11")) === null ||
              y === void 0 ||
              y.text(X.X11);
        }
        function t(n, e) {
          var z;
          const q = (0, l.default)(`.${n}`);
          if (!q) return;
          (z = q.find(".color")) === null ||
            z === void 0 ||
            z.css("background", "transparent");
          for (let n = 0; n < e.length; n += 1) {
            const z = q.find(`.color-item-${n}`);
            if (z) z.css("background", e[n]), z.data("color", e[n]);
          }
        }
        async function b() {
          let n = await P.browser.runtime.sendMessage({
            action: "getPalette",
          });
          if (n === null || n === void 0 ? void 0 : n.length)
            (n = n.slice(0, 10)), t("webpage-colors", n);
        }
        async function p() {
          const n = await P.browser.runtime.sendMessage({
            action: "getHistory",
          });
          return n.colors.map((n) => n.h).reverse();
        }
        async function y() {
          const n = await p();
          t("recent-colors", n);
        }
        async function X() {
          const n = await P.browser.tabs.query({
            active: true,
            currentWindow: true,
          });
          if (n.length > 0) {
            const e = n[0];
            if (
              !e.url ||
              (!e.url.startsWith("http") && !e.url.startsWith("file")) ||
              e.url.startsWith("https://chrome.google.com")
            )
              return false;
          } else return false;
          return true;
        }
        async function O() {
          const n = await p();
          return n[0];
        }
        async function u() {
          y();
          let n = "status-no-selected";
          if (!(await X())) n = "status-error";
          if (n !== "status-error") {
            b(),
              P.browser.runtime.sendMessage({
                action: "activate",
              });
            const e = await O();
            if (e) (n = "status-selected"), a(e);
          }
          F(n);
        }
        function d(n) {
          const e = document.createElement("textarea");
          (e.value = n),
            document.body.appendChild(e),
            e.select(),
            document.execCommand("Copy"),
            e.remove();
        }
        (0, l.default)(async () => {
          await u(),
            (0, l.default)("#activate").on("click", async () => {
              await P.browser.runtime.sendMessage({
                action: "activate",
              });
            }),
            (0, l.default)("#clear").on("click", async () => {
              var n, e;
              if (
                (await P.browser.runtime.sendMessage({
                  action: "clear",
                }),
                t("recent-colors", []),
                (e =
                  (n = (0, l.default)(".recent-colors")) === null ||
                  n === void 0
                    ? void 0
                    : n.find(".color")) === null ||
                  e === void 0 ||
                  e.data("color", ""),
                (0, l.default)("body").hasClass("status-only-selected"))
              )
                F("status-error");
              else if (!(0, l.default)("body").hasClass("status-error"))
                F("status-no-selected");
            }),
            (0, l.default)(".format-item").on("click", function n() {
              const e = (0, l.default)(this).text();
              d(e);
            }),
            (0, l.default)(".color").on("click", function n() {
              const e = (0, l.default)(this).data("color");
              if (!e) return;
              a(e);
            });
        });
      },
      {
        "chroma-js": 1,
        jquery: 97,
        "webextension-polyfill-ts": 98,
      },
    ],
  },
  {},
  [100]
);
