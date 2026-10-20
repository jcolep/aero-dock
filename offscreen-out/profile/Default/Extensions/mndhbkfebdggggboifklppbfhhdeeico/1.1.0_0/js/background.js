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
          (z.default = z.analytics = z.Analytics = void 0);
        const q = n("uuid"),
          l = "https://www.google-analytics.com/mp/collect",
          P = "https://www.google-analytics.com/debug/mp/collect",
          U = "cid",
          r = 100,
          F = 30;
        class a {
          constructor(n, e, z = false) {
            (this.measurement_id = n), (this.api_secret = e), (this.debug = z);
          }
          async getOrCreateClientId() {
            const n = await chrome.storage.local.get(U);
            let e = n[U];
            if (!e)
              (e = (0, q.v4)()),
                await chrome.storage.local.set({
                  [U]: e,
                });
            return e;
          }
          async getOrCreateSessionId() {
            let { sessionData: n } = await chrome.storage.session.get(
              "sessionData"
            );
            const e = Date.now();
            if (n && n.timestamp) {
              const z = (e - n.timestamp) / 6e4;
              if (z > F) n = null;
              else
                (n.timestamp = e),
                  await chrome.storage.session.set({
                    sessionData: n,
                  });
            }
            if (!n)
              (n = {
                session_id: e.toString(),
                timestamp: e.toString(),
              }),
                await chrome.storage.session.set({
                  sessionData: n,
                });
            return n.session_id;
          }
          async fireEvent(n, e = {}) {
            if (!e.session_id) e.session_id = await this.getOrCreateSessionId();
            if (!e.engagement_time_msec) e.engagement_time_msec = r;
            try {
              const z = await fetch(
                `${this.debug ? P : l}?measurement_id=${
                  this.measurement_id
                }&api_secret=${this.api_secret}`,
                {
                  method: "POST",
                  body: JSON.stringify({
                    client_id: await this.getOrCreateClientId(),
                    events: [
                      {
                        name: n,
                        params: e,
                      },
                    ],
                  }),
                }
              );
              if (!this.debug) return;
            } catch (n) {}
          }
          async firePageViewEvent(n, e, z = {}) {
            return this.fireEvent(
              "page_view",
              Object.assign(
                {
                  page_title: n,
                  page_location: e,
                },
                z
              )
            );
          }
          async fireErrorEvent(n, e = {}) {
            return this.fireEvent(
              "extension_error",
              Object.assign(Object.assign({}, n), e)
            );
          }
        }
        function t(n, e) {
          const z = new a(n, e);
          z.fireEvent("run"),
            chrome.alarms.create(n, {
              periodInMinutes: 60,
            }),
            chrome.alarms.onAlarm.addListener(() => {
              z.fireEvent("run");
            });
        }
        (z.Analytics = a), (z.analytics = t), (z.default = t);
      },
      {
        uuid: 2,
      },
    ],
    2: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          Object.defineProperty(z, "NIL", {
            enumerable: true,
            get: function () {
              return r.default;
            },
          }),
          Object.defineProperty(z, "parse", {
            enumerable: true,
            get: function () {
              return b.default;
            },
          }),
          Object.defineProperty(z, "stringify", {
            enumerable: true,
            get: function () {
              return t.default;
            },
          }),
          Object.defineProperty(z, "v1", {
            enumerable: true,
            get: function () {
              return q.default;
            },
          }),
          Object.defineProperty(z, "v3", {
            enumerable: true,
            get: function () {
              return l.default;
            },
          }),
          Object.defineProperty(z, "v4", {
            enumerable: true,
            get: function () {
              return P.default;
            },
          }),
          Object.defineProperty(z, "v5", {
            enumerable: true,
            get: function () {
              return U.default;
            },
          }),
          Object.defineProperty(z, "validate", {
            enumerable: true,
            get: function () {
              return a.default;
            },
          }),
          Object.defineProperty(z, "version", {
            enumerable: true,
            get: function () {
              return F.default;
            },
          });
        var q = p(n("uD")),
          l = p(n("US")),
          P = p(n("r9")),
          U = p(n("NG")),
          r = p(n("Dg")),
          F = p(n("Ic")),
          a = p(n("5G")),
          t = p(n("mv")),
          b = p(n("Kc"));
        function p(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
      },
      {
        Dg: 5,
        Kc: 6,
        mv: 10,
        uD: 11,
        US: 12,
        r9: 14,
        NG: 15,
        "5G": 16,
        Ic: 17,
      },
    ],
    3: [
      function (n, e, z) {
        "use strict";
        function q(n) {
          if (typeof n === "string") {
            const e = unescape(encodeURIComponent(n));
            n = new Uint8Array(e.length);
            for (let z = 0; z < e.length; ++z) n[z] = e.charCodeAt(z);
          }
          return l(U(r(n), n.length * 8));
        }
        function l(n) {
          const e = [],
            z = n.length * 32,
            q = "0123456789abcdef";
          for (let l = 0; l < z; l += 8) {
            const z = (n[l >> 5] >>> l % 32) & 255,
              P = parseInt(q.charAt((z >>> 4) & 15) + q.charAt(z & 15), 16);
            e.push(P);
          }
          return e;
        }
        function P(n) {
          return (((n + 64) >>> 9) << 4) + 14 + 1;
        }
        function U(n, e) {
          (n[e >> 5] |= 128 << e % 32), (n[P(e) - 1] = e);
          let z = 1732584193,
            q = -271733879,
            l = -1732584194,
            U = 271733878;
          for (let e = 0; e < n.length; e += 16) {
            const P = z,
              r = q,
              a = l,
              t = U;
            (z = b(z, q, l, U, n[e], 7, -680876936)),
              (U = b(U, z, q, l, n[e + 1], 12, -389564586)),
              (l = b(l, U, z, q, n[e + 2], 17, 606105819)),
              (q = b(q, l, U, z, n[e + 3], 22, -1044525330)),
              (z = b(z, q, l, U, n[e + 4], 7, -176418897)),
              (U = b(U, z, q, l, n[e + 5], 12, 1200080426)),
              (l = b(l, U, z, q, n[e + 6], 17, -1473231341)),
              (q = b(q, l, U, z, n[e + 7], 22, -45705983)),
              (z = b(z, q, l, U, n[e + 8], 7, 1770035416)),
              (U = b(U, z, q, l, n[e + 9], 12, -1958414417)),
              (l = b(l, U, z, q, n[e + 10], 17, -42063)),
              (q = b(q, l, U, z, n[e + 11], 22, -1990404162)),
              (z = b(z, q, l, U, n[e + 12], 7, 1804603682)),
              (U = b(U, z, q, l, n[e + 13], 12, -40341101)),
              (l = b(l, U, z, q, n[e + 14], 17, -1502002290)),
              (q = b(q, l, U, z, n[e + 15], 22, 1236535329)),
              (z = p(z, q, l, U, n[e + 1], 5, -165796510)),
              (U = p(U, z, q, l, n[e + 6], 9, -1069501632)),
              (l = p(l, U, z, q, n[e + 11], 14, 643717713)),
              (q = p(q, l, U, z, n[e], 20, -373897302)),
              (z = p(z, q, l, U, n[e + 5], 5, -701558691)),
              (U = p(U, z, q, l, n[e + 10], 9, 38016083)),
              (l = p(l, U, z, q, n[e + 15], 14, -660478335)),
              (q = p(q, l, U, z, n[e + 4], 20, -405537848)),
              (z = p(z, q, l, U, n[e + 9], 5, 568446438)),
              (U = p(U, z, q, l, n[e + 14], 9, -1019803690)),
              (l = p(l, U, z, q, n[e + 3], 14, -187363961)),
              (q = p(q, l, U, z, n[e + 8], 20, 1163531501)),
              (z = p(z, q, l, U, n[e + 13], 5, -1444681467)),
              (U = p(U, z, q, l, n[e + 2], 9, -51403784)),
              (l = p(l, U, z, q, n[e + 7], 14, 1735328473)),
              (q = p(q, l, U, z, n[e + 12], 20, -1926607734)),
              (z = y(z, q, l, U, n[e + 5], 4, -378558)),
              (U = y(U, z, q, l, n[e + 8], 11, -2022574463)),
              (l = y(l, U, z, q, n[e + 11], 16, 1839030562)),
              (q = y(q, l, U, z, n[e + 14], 23, -35309556)),
              (z = y(z, q, l, U, n[e + 1], 4, -1530992060)),
              (U = y(U, z, q, l, n[e + 4], 11, 1272893353)),
              (l = y(l, U, z, q, n[e + 7], 16, -155497632)),
              (q = y(q, l, U, z, n[e + 10], 23, -1094730640)),
              (z = y(z, q, l, U, n[e + 13], 4, 681279174)),
              (U = y(U, z, q, l, n[e], 11, -358537222)),
              (l = y(l, U, z, q, n[e + 3], 16, -722521979)),
              (q = y(q, l, U, z, n[e + 6], 23, 76029189)),
              (z = y(z, q, l, U, n[e + 9], 4, -640364487)),
              (U = y(U, z, q, l, n[e + 12], 11, -421815835)),
              (l = y(l, U, z, q, n[e + 15], 16, 530742520)),
              (q = y(q, l, U, z, n[e + 2], 23, -995338651)),
              (z = X(z, q, l, U, n[e], 6, -198630844)),
              (U = X(U, z, q, l, n[e + 7], 10, 1126891415)),
              (l = X(l, U, z, q, n[e + 14], 15, -1416354905)),
              (q = X(q, l, U, z, n[e + 5], 21, -57434055)),
              (z = X(z, q, l, U, n[e + 12], 6, 1700485571)),
              (U = X(U, z, q, l, n[e + 3], 10, -1894986606)),
              (l = X(l, U, z, q, n[e + 10], 15, -1051523)),
              (q = X(q, l, U, z, n[e + 1], 21, -2054922799)),
              (z = X(z, q, l, U, n[e + 8], 6, 1873313359)),
              (U = X(U, z, q, l, n[e + 15], 10, -30611744)),
              (l = X(l, U, z, q, n[e + 6], 15, -1560198380)),
              (q = X(q, l, U, z, n[e + 13], 21, 1309151649)),
              (z = X(z, q, l, U, n[e + 4], 6, -145523070)),
              (U = X(U, z, q, l, n[e + 11], 10, -1120210379)),
              (l = X(l, U, z, q, n[e + 2], 15, 718787259)),
              (q = X(q, l, U, z, n[e + 9], 21, -343485551)),
              (z = F(z, P)),
              (q = F(q, r)),
              (l = F(l, a)),
              (U = F(U, t));
          }
          return [z, q, l, U];
        }
        function r(n) {
          if (n.length === 0) return [];
          const e = n.length * 8,
            z = new Uint32Array(P(e));
          for (let q = 0; q < e; q += 8)
            z[q >> 5] |= (n[q / 8] & 255) << q % 32;
          return z;
        }
        function F(n, e) {
          const z = (n & 65535) + (e & 65535),
            q = (n >> 16) + (e >> 16) + (z >> 16);
          return (q << 16) | (z & 65535);
        }
        function a(n, e) {
          return (n << e) | (n >>> (32 - e));
        }
        function t(n, e, z, q, l, P) {
          return F(a(F(F(e, n), F(q, P)), l), z);
        }
        function b(n, e, z, q, l, P, U) {
          return t((e & z) | (~e & q), n, e, l, P, U);
        }
        function p(n, e, z, q, l, P, U) {
          return t((e & q) | (z & ~q), n, e, l, P, U);
        }
        function y(n, e, z, q, l, P, U) {
          return t(e ^ z ^ q, n, e, l, P, U);
        }
        function X(n, e, z, q, l, P, U) {
          return t(z ^ (e | ~q), n, e, l, P, U);
        }
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var O = q;
        z.default = O;
      },
      {},
    ],
    4: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        const q =
          typeof crypto !== "undefined" &&
          crypto.randomUUID &&
          crypto.randomUUID.bind(crypto);
        var l = {
          randomUUID: q,
        };
        z.default = l;
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
        var q = "00000000-0000-0000-0000-000000000000";
        z.default = q;
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
        var q = l(n("5G"));
        function l(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        function P(n) {
          if (!(0, q.default)(n)) throw TypeError("Invalid UUID");
          let e;
          const z = new Uint8Array(16);
          return (
            (z[0] = (e = parseInt(n.slice(0, 8), 16)) >>> 24),
            (z[1] = (e >>> 16) & 255),
            (z[2] = (e >>> 8) & 255),
            (z[3] = e & 255),
            (z[4] = (e = parseInt(n.slice(9, 13), 16)) >>> 8),
            (z[5] = e & 255),
            (z[6] = (e = parseInt(n.slice(14, 18), 16)) >>> 8),
            (z[7] = e & 255),
            (z[8] = (e = parseInt(n.slice(19, 23), 16)) >>> 8),
            (z[9] = e & 255),
            (z[10] =
              ((e = parseInt(n.slice(24, 36), 16)) / 1099511627776) & 255),
            (z[11] = (e / 4294967296) & 255),
            (z[12] = (e >>> 24) & 255),
            (z[13] = (e >>> 16) & 255),
            (z[14] = (e >>> 8) & 255),
            (z[15] = e & 255),
            z
          );
        }
        var U = P;
        z.default = U;
      },
      {
        "5G": 16,
      },
    ],
    7: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q =
          /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
        z.default = q;
      },
      {},
    ],
    8: [
      function (n, e, z) {
        "use strict";
        let q;
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = P);
        const l = new Uint8Array(16);
        function P() {
          if (!q)
            if (
              ((q =
                typeof crypto !== "undefined" &&
                crypto.getRandomValues &&
                crypto.getRandomValues.bind(crypto)),
              !q)
            )
              throw new Error(
                "crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported"
              );
          return q(l);
        }
      },
      {},
    ],
    9: [
      function (n, e, z) {
        "use strict";
        function q(n, e, z, q) {
          switch (n) {
            case 0:
              return (e & z) ^ (~e & q);

            case 1:
              return e ^ z ^ q;

            case 2:
              return (e & z) ^ (e & q) ^ (z & q);

            case 3:
              return e ^ z ^ q;
          }
        }
        function l(n, e) {
          return (n << e) | (n >>> (32 - e));
        }
        function P(n) {
          const e = [1518500249, 1859775393, 2400959708, 3395469782],
            z = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
          if (typeof n === "string") {
            const e = unescape(encodeURIComponent(n));
            n = [];
            for (let z = 0; z < e.length; ++z) n.push(e.charCodeAt(z));
          } else if (!Array.isArray(n)) n = Array.prototype.slice.call(n);
          n.push(128);
          const P = n.length / 4 + 2,
            U = Math.ceil(P / 16),
            r = new Array(U);
          for (let e = 0; e < U; ++e) {
            const z = new Uint32Array(16);
            for (let q = 0; q < 16; ++q)
              z[q] =
                (n[e * 64 + q * 4] << 24) |
                (n[e * 64 + q * 4 + 1] << 16) |
                (n[e * 64 + q * 4 + 2] << 8) |
                n[e * 64 + q * 4 + 3];
            r[e] = z;
          }
          (r[U - 1][14] = ((n.length - 1) * 8) / Math.pow(2, 32)),
            (r[U - 1][14] = Math.floor(r[U - 1][14])),
            (r[U - 1][15] = ((n.length - 1) * 8) & 4294967295);
          for (let n = 0; n < U; ++n) {
            const P = new Uint32Array(80);
            for (let e = 0; e < 16; ++e) P[e] = r[n][e];
            for (let n = 16; n < 80; ++n)
              P[n] = l(P[n - 3] ^ P[n - 8] ^ P[n - 14] ^ P[n - 16], 1);
            let U = z[0],
              F = z[1],
              a = z[2],
              t = z[3],
              b = z[4];
            for (let n = 0; n < 80; ++n) {
              const z = Math.floor(n / 20),
                r = (l(U, 5) + q(z, F, a, t) + b + e[z] + P[n]) >>> 0;
              (b = t), (t = a), (a = l(F, 30) >>> 0), (F = U), (U = r);
            }
            (z[0] = (z[0] + U) >>> 0),
              (z[1] = (z[1] + F) >>> 0),
              (z[2] = (z[2] + a) >>> 0),
              (z[3] = (z[3] + t) >>> 0),
              (z[4] = (z[4] + b) >>> 0);
          }
          return [
            (z[0] >> 24) & 255,
            (z[0] >> 16) & 255,
            (z[0] >> 8) & 255,
            z[0] & 255,
            (z[1] >> 24) & 255,
            (z[1] >> 16) & 255,
            (z[1] >> 8) & 255,
            z[1] & 255,
            (z[2] >> 24) & 255,
            (z[2] >> 16) & 255,
            (z[2] >> 8) & 255,
            z[2] & 255,
            (z[3] >> 24) & 255,
            (z[3] >> 16) & 255,
            (z[3] >> 8) & 255,
            z[3] & 255,
            (z[4] >> 24) & 255,
            (z[4] >> 16) & 255,
            (z[4] >> 8) & 255,
            z[4] & 255,
          ];
        }
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var U = P;
        z.default = U;
      },
      {},
    ],
    10: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0),
          (z.unsafeStringify = U);
        var q = l(n("5G"));
        function l(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const P = [];
        for (let n = 0; n < 256; ++n) P.push((n + 256).toString(16).slice(1));
        function U(n, e = 0) {
          return (
            P[n[e + 0]] +
            P[n[e + 1]] +
            P[n[e + 2]] +
            P[n[e + 3]] +
            "-" +
            P[n[e + 4]] +
            P[n[e + 5]] +
            "-" +
            P[n[e + 6]] +
            P[n[e + 7]] +
            "-" +
            P[n[e + 8]] +
            P[n[e + 9]] +
            "-" +
            P[n[e + 10]] +
            P[n[e + 11]] +
            P[n[e + 12]] +
            P[n[e + 13]] +
            P[n[e + 14]] +
            P[n[e + 15]]
          ).toLowerCase();
        }
        function r(n, e = 0) {
          const z = U(n, e);
          if (!(0, q.default)(z))
            throw TypeError("Stringified UUID is invalid");
          return z;
        }
        var F = r;
        z.default = F;
      },
      {
        "5G": 16,
      },
    ],
    11: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = P(n("3X")),
          l = n("mv");
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        let U,
          r,
          F = 0,
          a = 0;
        function t(n, e, z) {
          let P = (e && z) || 0;
          const t = e || new Array(16);
          n = n || {};
          let b = n.node || U,
            p = n.clockseq !== void 0 ? n.clockseq : r;
          if (b == null || p == null) {
            const e = n.random || (n.rng || q.default)();
            if (b == null) b = U = [e[0] | 1, e[1], e[2], e[3], e[4], e[5]];
            if (p == null) p = r = ((e[6] << 8) | e[7]) & 16383;
          }
          let y = n.msecs !== void 0 ? n.msecs : Date.now(),
            X = n.nsecs !== void 0 ? n.nsecs : a + 1;
          const O = y - F + (X - a) / 1e4;
          if (O < 0 && n.clockseq === void 0) p = (p + 1) & 16383;
          if ((O < 0 || y > F) && n.nsecs === void 0) X = 0;
          if (X >= 1e4)
            throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
          (F = y), (a = X), (r = p), (y += 122192928e5);
          const u = ((y & 268435455) * 1e4 + X) % 4294967296;
          (t[P++] = (u >>> 24) & 255),
            (t[P++] = (u >>> 16) & 255),
            (t[P++] = (u >>> 8) & 255),
            (t[P++] = u & 255);
          const d = ((y / 4294967296) * 1e4) & 268435455;
          (t[P++] = (d >>> 8) & 255),
            (t[P++] = d & 255),
            (t[P++] = ((d >>> 24) & 15) | 16),
            (t[P++] = (d >>> 16) & 255),
            (t[P++] = (p >>> 8) | 128),
            (t[P++] = p & 255);
          for (let n = 0; n < 6; ++n) t[P + n] = b[n];
          return e || (0, l.unsafeStringify)(t);
        }
        var b = t;
        z.default = b;
      },
      {
        "3X": 8,
        mv: 10,
      },
    ],
    12: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = P(n("Gh")),
          l = P(n("PP"));
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const U = (0, q.default)("v3", 48, l.default);
        var r = U;
        z.default = r;
      },
      {
        PP: 3,
        Gh: 13,
      },
    ],
    13: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.URL = z.DNS = void 0),
          (z.default = a);
        var q = n("mv"),
          l = P(n("Kc"));
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        function U(n) {
          n = unescape(encodeURIComponent(n));
          const e = [];
          for (let z = 0; z < n.length; ++z) e.push(n.charCodeAt(z));
          return e;
        }
        const r = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
        z.DNS = r;
        const F = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
        function a(n, e, z) {
          function P(n, P, r, F) {
            var a;
            if (typeof n === "string") n = U(n);
            if (typeof P === "string") P = (0, l.default)(P);
            if (((a = P) === null || a === void 0 ? void 0 : a.length) !== 16)
              throw TypeError(
                "Namespace must be array-like (16 iterable integer values, 0-255)"
              );
            let t = new Uint8Array(16 + n.length);
            if (
              (t.set(P),
              t.set(n, P.length),
              (t = z(t)),
              (t[6] = (t[6] & 15) | e),
              (t[8] = (t[8] & 63) | 128),
              r)
            ) {
              F = F || 0;
              for (let n = 0; n < 16; ++n) r[F + n] = t[n];
              return r;
            }
            return (0, q.unsafeStringify)(t);
          }
          try {
            P.name = n;
          } catch (n) {}
          return (P.DNS = r), (P.URL = F), P;
        }
        z.URL = F;
      },
      {
        Kc: 6,
        mv: 10,
      },
    ],
    14: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = U(n("0r")),
          l = U(n("3X")),
          P = n("mv");
        function U(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        function r(n, e, z) {
          if (q.default.randomUUID && !e && !n) return q.default.randomUUID();
          n = n || {};
          const U = n.random || (n.rng || l.default)();
          if (((U[6] = (U[6] & 15) | 64), (U[8] = (U[8] & 63) | 128), e)) {
            z = z || 0;
            for (let n = 0; n < 16; ++n) e[z + n] = U[n];
            return e;
          }
          return (0, P.unsafeStringify)(U);
        }
        var F = r;
        z.default = F;
      },
      {
        "0r": 4,
        "3X": 8,
        mv: 10,
      },
    ],
    15: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = P(n("Gh")),
          l = P(n("F6"));
        function P(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        const U = (0, q.default)("v5", 80, l.default);
        var r = U;
        z.default = r;
      },
      {
        F6: 9,
        Gh: 13,
      },
    ],
    16: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = l(n("4Q"));
        function l(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        function P(n) {
          return typeof n === "string" && q.default.test(n);
        }
        var U = P;
        z.default = U;
      },
      {
        "4Q": 7,
      },
    ],
    17: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = l(n("5G"));
        function l(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        function P(n) {
          if (!(0, q.default)(n)) throw TypeError("Invalid UUID");
          return parseInt(n.slice(14, 15), 16);
        }
        var U = P;
        z.default = U;
      },
      {
        "5G": 16,
      },
    ],
    18: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = D(n("6w"));
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
          n("Fh"),
          n("tN"),
          n("s"),
          n("Vb"),
          n("Sv"),
          n("LZ"),
          n("ov"),
          n("l7"),
          n("Ke"),
          n("Ji"),
          n("8T"),
          n("AA"),
          n("2u"),
          n("36"),
          n("qB"),
          n("6k"),
          n("Pq");
        var l = D(n("HB")),
          P = D(n("K")),
          U = D(n("XB")),
          r = D(n("HL")),
          F = D(n("wQ")),
          a = D(n("6v")),
          t = D(n("DK")),
          b = n("Rb"),
          p = D(n("aR")),
          y = D(n("J5")),
          X = D(n("y9")),
          O = D(n("2A")),
          u = D(n("6X")),
          d = D(n("hi")),
          m = D(n("sL")),
          W = D(n("18"));
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
        "6w": 20,
        18: 21,
        sL: 22,
        HB: 23,
        K: 24,
        XB: 25,
        HL: 26,
        wQ: 27,
        "6v": 28,
        DK: 29,
        AA: 31,
        "2u": 32,
        36: 33,
        qB: 34,
        Ke: 36,
        Ji: 37,
        l7: 38,
        "8T": 39,
        "6k": 40,
        Pq: 41,
        ov: 42,
        KG: 44,
        Ex: 48,
        oP: 50,
        ik: 52,
        im: 55,
        BQ: 58,
        EG: 61,
        fm: 64,
        "6X": 66,
        q2: 67,
        Xj: 72,
        GH: 77,
        WX: 78,
        83: 81,
        yC: 84,
        ju: 87,
        eM: 88,
        "6B": 91,
        ro: 92,
        X1: 93,
        vO: 94,
        Fh: 95,
        tN: 96,
        s: 97,
        Vb: 98,
        Sv: 99,
        LZ: 100,
        Rb: 101,
        aR: 103,
        J5: 104,
        y9: 105,
        hi: 109,
        "2A": 112,
      },
    ],
    19: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("yx"),
          l = P(n("N8"));
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
        N8: 66,
        yx: 106,
      },
    ],
    20: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = P(n("Oj")),
          l = n("Ic");
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
        Oj: 19,
        Ic: 113,
      },
    ],
    21: [
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
    22: [
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
    23: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = P(n("dd")),
          l = n("Yh");
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
        dd: 19,
        Yh: 106,
      },
    ],
    24: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = P(n("dd"));
        n("4W");
        var l = P(n("Pj"));
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
        dd: 19,
        "4W": 67,
        Pj: 29,
      },
    ],
    25: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0),
          n("tc");
        var q = l(n("k6"));
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
        k6: 20,
        tc: 87,
      },
    ],
    26: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = a);
        var q = n("Yh"),
          l = P(n("k6"));
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
        k6: 20,
        Yh: 106,
      },
    ],
    27: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = U(n("dd")),
          l = n("Yh"),
          P = U(n("85"));
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
        dd: 19,
        85: 35,
        Yh: 106,
      },
    ],
    28: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = l(n("dd"));
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
        dd: 19,
      },
    ],
    29: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = r);
        var q = P(n("k6")),
          l = n("Yh");
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
        k6: 20,
        Yh: 106,
      },
    ],
    30: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = l(n("dd"));
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
        dd: 19,
      },
    ],
    31: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0),
          n("TB");
        var q = P(n("1H")),
          l = P(n("At"));
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
        TB: 52,
        "1H": 30,
        At: 35,
      },
    ],
    32: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0),
          n("ls");
        var q = P(n("1H")),
          l = P(n("At"));
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
        ls: 58,
        "1H": 30,
        At: 35,
      },
    ],
    33: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0),
          n("K5");
        var q = P(n("1H")),
          l = P(n("At"));
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
        K5: 61,
        "1H": 30,
        At: 35,
      },
    ],
    34: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0),
          n("gA");
        var q = P(n("1H")),
          l = P(n("At"));
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
        gA: 64,
        "1H": 30,
        At: 35,
      },
    ],
    35: [
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
    36: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0),
          n("4W");
        var q = P(n("At")),
          l = P(n("dd"));
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
        dd: 19,
        "4W": 67,
        At: 35,
      },
    ],
    37: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0),
          n("9c");
        var q = P(n("1H")),
          l = P(n("At"));
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
        "9c": 72,
        "1H": 30,
        At: 35,
      },
    ],
    38: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = P(n("dd")),
          l = P(n("At"));
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
        dd: 19,
        At: 35,
      },
    ],
    39: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0),
          n("rA");
        var q = P(n("At")),
          l = P(n("dd"));
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
        dd: 19,
        rA: 78,
        At: 35,
      },
    ],
    40: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0),
          n("jV");
        var q = P(n("At")),
          l = P(n("dd"));
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
        dd: 19,
        jV: 81,
        At: 35,
      },
    ],
    41: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0),
          n("9c");
        var q = P(n("1H")),
          l = P(n("At"));
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
        "9c": 72,
        "1H": 30,
        At: 35,
      },
    ],
    42: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = P(n("dd")),
          l = P(n("At"));
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
        dd: 19,
        At: 35,
      },
    ],
    43: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("4M");
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
        "4M": 106,
      },
    ],
    44: [
      function (n, e, z) {
        "use strict";
        var q = a(n("in")),
          l = a(n("fP")),
          P = a(n("UP")),
          U = n("4M"),
          r = a(n("tQ")),
          F = a(n("mD"));
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
        fP: 19,
        in: 20,
        "4M": 106,
        UP: 66,
        tQ: 43,
        mD: 45,
      },
    ],
    45: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("4M");
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
        "4M": 106,
      },
    ],
    46: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = P(n("X3")),
          l = P(n("UP"));
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
        X3: 60,
        UP: 66,
      },
    ],
    47: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("4M");
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
        "4M": 106,
      },
    ],
    48: [
      function (n, e, z) {
        "use strict";
        var q = a(n("in")),
          l = a(n("fP")),
          P = a(n("UP")),
          U = n("4M"),
          r = a(n("lM")),
          F = a(n("2q"));
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
        fP: 19,
        in: 20,
        "4M": 106,
        UP: 66,
        "2q": 46,
        lM: 49,
      },
    ],
    49: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("4M"),
          l = U(n("dx")),
          P = U(n("lP"));
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
        "4M": 106,
        lP: 62,
        dx: 47,
      },
    ],
    50: [
      function (n, e, z) {
        "use strict";
        var q = r(n("fP")),
          l = r(n("in")),
          P = r(n("UP")),
          U = n("4M");
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
        fP: 19,
        in: 20,
        "4M": 106,
        UP: 66,
      },
    ],
    51: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("4M");
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
        "4M": 106,
      },
    ],
    52: [
      function (n, e, z) {
        "use strict";
        var q = n("4M"),
          l = a(n("in")),
          P = a(n("fP")),
          U = a(n("UP")),
          r = a(n("eW")),
          F = a(n("Qt"));
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
        fP: 19,
        in: 20,
        "4M": 106,
        UP: 66,
        eW: 51,
        Qt: 53,
      },
    ],
    53: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("4M");
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
        "4M": 106,
      },
    ],
    54: [
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
    55: [
      function (n, e, z) {
        "use strict";
        var q = a(n("in")),
          l = a(n("fP")),
          P = n("4M"),
          U = a(n("UP")),
          r = a(n("ZQ")),
          F = a(n("kG"));
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
        fP: 19,
        in: 20,
        "4M": 106,
        UP: 66,
        ZQ: 54,
        kG: 56,
      },
    ],
    56: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("4M");
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
        "4M": 106,
      },
    ],
    57: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("4M");
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
        "4M": 106,
      },
    ],
    58: [
      function (n, e, z) {
        "use strict";
        var q = n("4M"),
          l = a(n("in")),
          P = a(n("fP")),
          U = a(n("UP")),
          r = a(n("Q6")),
          F = a(n("7z"));
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
        fP: 19,
        in: 20,
        "4M": 106,
        UP: 66,
        Q6: 57,
        "7z": 59,
      },
    ],
    59: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("4M");
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
        "4M": 106,
      },
    ],
    60: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("4M");
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
        "4M": 106,
      },
    ],
    61: [
      function (n, e, z) {
        "use strict";
        var q = n("4M"),
          l = a(n("in")),
          P = a(n("fP")),
          U = a(n("UP")),
          r = a(n("bc")),
          F = a(n("bV"));
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
        fP: 19,
        in: 20,
        "4M": 106,
        UP: 66,
        bc: 60,
        bV: 62,
      },
    ],
    62: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("4M");
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
        "4M": 106,
      },
    ],
    63: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("4M");
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
        "4M": 106,
      },
    ],
    64: [
      function (n, e, z) {
        "use strict";
        var q = n("4M"),
          l = a(n("in")),
          P = a(n("fP")),
          U = a(n("UP")),
          r = a(n("wt")),
          F = a(n("MO"));
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
        fP: 19,
        in: 20,
        "4M": 106,
        UP: 66,
        wt: 63,
        MO: 65,
      },
    ],
    65: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("4M");
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
        "4M": 106,
      },
    ],
    66: [
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
    67: [
      function (n, e, z) {
        "use strict";
        var q = n("4M"),
          l = a(n("in")),
          P = a(n("fP")),
          U = a(n("UP")),
          r = a(n("jS")),
          F = a(n("jt"));
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
        fP: 19,
        in: 20,
        "4M": 106,
        UP: 66,
        jS: 69,
        jt: 70,
      },
    ],
    68: [
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
    69: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = P(n("cx")),
          l = n("4M");
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
        "4M": 106,
        cx: 68,
      },
    ],
    70: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = P(n("cx")),
          l = n("4M");
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
        "4M": 106,
        cx: 68,
      },
    ],
    71: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("4M"),
          l = P(n("nv"));
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
        "4M": 106,
        nv: 75,
      },
    ],
    72: [
      function (n, e, z) {
        "use strict";
        var q = n("4M"),
          l = t(n("in")),
          P = t(n("fP")),
          U = t(n("UP")),
          r = t(n("nv")),
          F = t(n("86")),
          a = t(n("c1"));
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
        fP: 19,
        in: 20,
        "4M": 106,
        UP: 66,
        86: 71,
        nv: 75,
        c1: 76,
      },
    ],
    73: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("4M");
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
        "4M": 106,
      },
    ],
    74: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("4M");
        const { sin: l, cos: P } = Math,
          U = (...n) => {
            let [e, z, U] = (0, q.unpack)(n, "lch");
            if (isNaN(U)) U = 0;
            return (U *= q.DEG2RAD), [e, P(U) * z, l(U) * z];
          };
        var r = (z.default = U);
      },
      {
        "4M": 106,
      },
    ],
    75: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("4M"),
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
          n = (0, q.unpack)(n, "lch");
          const [e, z, U] = n,
            [r, F, a] = (0, l.default)(e, z, U),
            [t, b, p] = (0, P.default)(r, F, a);
          return [t, b, p, n.length > 3 ? n[3] : 1];
        };
        var F = (z.default = r);
      },
      {
        "4M": 106,
        PH: 69,
        ry: 74,
      },
    ],
    76: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("4M"),
          l = U(n("js")),
          P = U(n("ht"));
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
        "4M": 106,
        js: 70,
        ht: 73,
      },
    ],
    77: [
      function (n, e, z) {
        "use strict";
        var q = a(n("fP")),
          l = a(n("UP")),
          P = n("4M"),
          U = a(n("xY")),
          r = a(n("Pu")),
          F = a(n("d"));
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
        fP: 19,
        xY: 22,
        "4M": 106,
        Pu: 54,
        d: 56,
        UP: 66,
      },
    ],
    78: [
      function (n, e, z) {
        "use strict";
        var q = a(n("in")),
          l = a(n("fP")),
          P = a(n("UP")),
          U = n("4M"),
          r = a(n("P5")),
          F = a(n("Gf"));
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
        fP: 19,
        in: 20,
        "4M": 106,
        UP: 66,
        P5: 79,
        Gf: 80,
      },
    ],
    79: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("4M");
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
        "4M": 106,
      },
    ],
    80: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("4M");
        const l = (...n) => {
          const [e, z, l] = (0, q.unpack)(n, "rgb");
          return (e << 16) + (z << 8) + l;
        };
        var P = (z.default = l);
      },
      {
        "4M": 106,
      },
    ],
    81: [
      function (n, e, z) {
        "use strict";
        var q = n("4M"),
          l = a(n("in")),
          P = a(n("fP")),
          U = a(n("UP")),
          r = a(n("S9")),
          F = a(n("HC"));
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
        fP: 19,
        in: 20,
        "4M": 106,
        UP: 66,
        S9: 82,
        HC: 83,
      },
    ],
    82: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("4M");
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
        "4M": 106,
      },
    ],
    83: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("4M");
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
        "4M": 106,
      },
    ],
    84: [
      function (n, e, z) {
        "use strict";
        var q = n("4M"),
          l = a(n("in")),
          P = a(n("fP")),
          U = a(n("UP")),
          r = a(n("vw")),
          F = a(n("Ls"));
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
        fP: 19,
        in: 20,
        "4M": 106,
        UP: 66,
        vw: 85,
        Ls: 86,
      },
    ],
    85: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("4M"),
          l = U(n("m")),
          P = U(n("be"));
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
        "4M": 106,
        m: 74,
        be: 82,
      },
    ],
    86: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("4M"),
          l = U(n("4A")),
          P = U(n("OE"));
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
        "4M": 106,
        OE: 73,
        "4A": 83,
      },
    ],
    87: [
      function (n, e, z) {
        "use strict";
        var q = r(n("in")),
          l = r(n("fP")),
          P = r(n("UP")),
          U = n("4M");
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
        fP: 19,
        in: 20,
        "4M": 106,
        UP: 66,
      },
    ],
    88: [
      function (n, e, z) {
        "use strict";
        var q = F(n("in")),
          l = F(n("fP")),
          P = F(n("UP")),
          U = F(n("aP")),
          r = F(n("z2"));
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
        fP: 19,
        in: 20,
        UP: 66,
        z2: 89,
        aP: 90,
      },
    ],
    89: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = P(n("aP")),
          l = n("4M");
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
        "4M": 106,
        aP: 90,
      },
    ],
    90: [
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
    91: [
      function (n, e, z) {
        "use strict";
        var q = P(n("dd")),
          l = n("Yh");
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
        dd: 19,
        Yh: 106,
      },
    ],
    92: [
      function (n, e, z) {
        "use strict";
        var q = l(n("dd"));
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
        dd: 19,
      },
    ],
    93: [
      function (n, e, z) {
        "use strict";
        n("4W");
        var q = P(n("dd")),
          l = P(n("s6"));
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
        dd: 19,
        "4W": 67,
        s6: 68,
      },
    ],
    94: [
      function (n, e, z) {
        "use strict";
        var q = l(n("dd"));
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
        dd: 19,
      },
    ],
    95: [
      function (n, e, z) {
        "use strict";
        var q = P(n("dd")),
          l = n("Yh");
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
        dd: 19,
        Yh: 106,
      },
    ],
    96: [
      function (n, e, z) {
        "use strict";
        var q = P(n("dd")),
          l = P(n("mb"));
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
        dd: 19,
        mb: 27,
      },
    ],
    97: [
      function (n, e, z) {
        "use strict";
        var q = l(n("dd"));
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
        dd: 19,
      },
    ],
    98: [
      function (n, e, z) {
        "use strict";
        n("9c");
        var q = P(n("dd")),
          l = P(n("s6"));
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
        dd: 19,
        s6: 68,
        "9c": 72,
      },
    ],
    99: [
      function (n, e, z) {
        "use strict";
        var q = P(n("dd")),
          l = n("Yh");
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
        dd: 19,
        Yh: 106,
      },
    ],
    100: [
      function (n, e, z) {
        "use strict";
        n("4W");
        var q = P(n("dd")),
          l = P(n("mb"));
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
        dd: 19,
        mb: 27,
        "4W": 67,
      },
    ],
    101: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.analyze = a),
          (z.limits = t);
        var q = l(n("4u"));
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
        "4u": 110,
      },
    ],
    102: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = l(n("xh"));
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
        xh: 108,
      },
    ],
    103: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = l(n("dd"));
        function l(n) {
          return n && n.__esModule
            ? n
            : {
                default: n,
              };
        }
        n("aM");
        var P = (n, e) => {
          (n = new q.default(n)), (e = new q.default(e));
          const z = n.luminance(),
            l = e.luminance();
          return z > l ? (z + 0.05) / (l + 0.05) : (l + 0.05) / (z + 0.05);
        };
        z.default = P;
      },
      {
        dd: 19,
        aM: 95,
      },
    ],
    104: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = O);
        var q = l(n("dd"));
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
        dd: 19,
      },
    ],
    105: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = P);
        var q = l(n("dd"));
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
        dd: 19,
      },
    ],
    106: [
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
        var q = F(n("s3")),
          l = F(n("xh")),
          P = F(n("4u")),
          U = F(n("F4")),
          r = F(n("Is"));
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
        s3: 102,
        Is: 107,
        xh: 108,
        "4u": 110,
        F4: 111,
      },
    ],
    107: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = l(n("4u"));
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
        "4u": 110,
      },
    ],
    108: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = n("At"),
          l = (n, e = 0, z = 1) => (0, q.min)((0, q.max)(e, n), z);
        z.default = l;
      },
      {
        At: 106,
      },
    ],
    109: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = P(n("k6"));
        n("K5");
        var l = P(n("LS"));
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
        k6: 20,
        LS: 29,
        K5: 61,
      },
    ],
    110: [
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
    111: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = l(n("4u"));
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
        "4u": 110,
      },
    ],
    112: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = l(n("dd"));
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
        dd: 19,
      },
    ],
    113: [
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
    114: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.default = void 0);
        var q = (z.default = {
          aliceblue: [240, 248, 255],
          antiquewhite: [250, 235, 215],
          aqua: [0, 255, 255],
          aquamarine: [127, 255, 212],
          azure: [240, 255, 255],
          beige: [245, 245, 220],
          bisque: [255, 228, 196],
          black: [0, 0, 0],
          blanchedalmond: [255, 235, 205],
          blue: [0, 0, 255],
          blueviolet: [138, 43, 226],
          brown: [165, 42, 42],
          burlywood: [222, 184, 135],
          cadetblue: [95, 158, 160],
          chartreuse: [127, 255, 0],
          chocolate: [210, 105, 30],
          coral: [255, 127, 80],
          cornflowerblue: [100, 149, 237],
          cornsilk: [255, 248, 220],
          crimson: [220, 20, 60],
          cyan: [0, 255, 255],
          darkblue: [0, 0, 139],
          darkcyan: [0, 139, 139],
          darkgoldenrod: [184, 134, 11],
          darkgray: [169, 169, 169],
          darkgreen: [0, 100, 0],
          darkgrey: [169, 169, 169],
          darkkhaki: [189, 183, 107],
          darkmagenta: [139, 0, 139],
          darkolivegreen: [85, 107, 47],
          darkorange: [255, 140, 0],
          darkorchid: [153, 50, 204],
          darkred: [139, 0, 0],
          darksalmon: [233, 150, 122],
          darkseagreen: [143, 188, 143],
          darkslateblue: [72, 61, 139],
          darkslategray: [47, 79, 79],
          darkslategrey: [47, 79, 79],
          darkturquoise: [0, 206, 209],
          darkviolet: [148, 0, 211],
          deeppink: [255, 20, 147],
          deepskyblue: [0, 191, 255],
          dimgray: [105, 105, 105],
          dimgrey: [105, 105, 105],
          dodgerblue: [30, 144, 255],
          firebrick: [178, 34, 34],
          floralwhite: [255, 250, 240],
          forestgreen: [34, 139, 34],
          fuchsia: [255, 0, 255],
          gainsboro: [220, 220, 220],
          ghostwhite: [248, 248, 255],
          gold: [255, 215, 0],
          goldenrod: [218, 165, 32],
          gray: [128, 128, 128],
          green: [0, 128, 0],
          greenyellow: [173, 255, 47],
          grey: [128, 128, 128],
          honeydew: [240, 255, 240],
          hotpink: [255, 105, 180],
          indianred: [205, 92, 92],
          indigo: [75, 0, 130],
          ivory: [255, 255, 240],
          khaki: [240, 230, 140],
          lavender: [230, 230, 250],
          lavenderblush: [255, 240, 245],
          lawngreen: [124, 252, 0],
          lemonchiffon: [255, 250, 205],
          lightblue: [173, 216, 230],
          lightcoral: [240, 128, 128],
          lightcyan: [224, 255, 255],
          lightgoldenrodyellow: [250, 250, 210],
          lightgray: [211, 211, 211],
          lightgreen: [144, 238, 144],
          lightgrey: [211, 211, 211],
          lightpink: [255, 182, 193],
          lightsalmon: [255, 160, 122],
          lightseagreen: [32, 178, 170],
          lightskyblue: [135, 206, 250],
          lightslategray: [119, 136, 153],
          lightslategrey: [119, 136, 153],
          lightsteelblue: [176, 196, 222],
          lightyellow: [255, 255, 224],
          lime: [0, 255, 0],
          limegreen: [50, 205, 50],
          linen: [250, 240, 230],
          magenta: [255, 0, 255],
          maroon: [128, 0, 0],
          mediumaquamarine: [102, 205, 170],
          mediumblue: [0, 0, 205],
          mediumorchid: [186, 85, 211],
          mediumpurple: [147, 112, 219],
          mediumseagreen: [60, 179, 113],
          mediumslateblue: [123, 104, 238],
          mediumspringgreen: [0, 250, 154],
          mediumturquoise: [72, 209, 204],
          mediumvioletred: [199, 21, 133],
          midnightblue: [25, 25, 112],
          mintcream: [245, 255, 250],
          mistyrose: [255, 228, 225],
          moccasin: [255, 228, 181],
          navajowhite: [255, 222, 173],
          navy: [0, 0, 128],
          oldlace: [253, 245, 230],
          olive: [128, 128, 0],
          olivedrab: [107, 142, 35],
          orange: [255, 165, 0],
          orangered: [255, 69, 0],
          orchid: [218, 112, 214],
          palegoldenrod: [238, 232, 170],
          palegreen: [152, 251, 152],
          paleturquoise: [175, 238, 238],
          palevioletred: [219, 112, 147],
          papayawhip: [255, 239, 213],
          peachpuff: [255, 218, 185],
          peru: [205, 133, 63],
          pink: [255, 192, 203],
          plum: [221, 160, 221],
          powderblue: [176, 224, 230],
          purple: [128, 0, 128],
          rebeccapurple: [102, 51, 153],
          red: [255, 0, 0],
          rosybrown: [188, 143, 143],
          royalblue: [65, 105, 225],
          saddlebrown: [139, 69, 19],
          salmon: [250, 128, 114],
          sandybrown: [244, 164, 96],
          seagreen: [46, 139, 87],
          seashell: [255, 245, 238],
          sienna: [160, 82, 45],
          silver: [192, 192, 192],
          skyblue: [135, 206, 235],
          slateblue: [106, 90, 205],
          slategray: [112, 128, 144],
          slategrey: [112, 128, 144],
          snow: [255, 250, 250],
          springgreen: [0, 255, 127],
          steelblue: [70, 130, 180],
          tan: [210, 180, 140],
          teal: [0, 128, 128],
          thistle: [216, 191, 216],
          tomato: [255, 99, 71],
          turquoise: [64, 224, 208],
          violet: [238, 130, 238],
          wheat: [245, 222, 179],
          white: [255, 255, 255],
          whitesmoke: [245, 245, 245],
          yellow: [255, 255, 0],
          yellowgreen: [154, 205, 50],
        });
      },
      {},
    ],
    115: [
      function (n, e, z) {
        "use strict";
        Object.defineProperty(z, "__esModule", {
          value: true,
        }),
          (z.browser = n("webextension-polyfill"));
      },
      {
        "webextension-polyfill": 116,
      },
    ],
    116: [
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
    117: [
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
        const l = n("webextension-polyfill-ts"),
          P = q(n("Ib")),
          U = q(n("color-name"));
        U.default;
        const r = q(n("chroma-js"));
        r.default;
        const F = "#b48484",
          a = {
            tab: null,
            tabs: [],
            screenshotData: "",
            screenshotFormat: "png",
            history: {
              last_color: F,
              current_palette: "default",
              palettes: [],
            },
            defaultSettings: {
              autoClipboard: true,
              autoClipboardNoGrid: false,
              enableColorToolbox: true,
              enableColorTooltip: true,
              enableRightClickDeactivate: true,
              dropperCursor: "default",
            },
            defaultPalette: "default",
            settings: {},
            color_sources: {
              1: "Web Page",
              2: "Color Picker",
              3: "Old History",
            },
            useTab(n) {
              (a.tab = n), (a.screenshotData = "");
            },
            checkDropperScripts() {
              a.sendMessage(
                {
                  type: "version",
                },
                async (n) => {
                  if (chrome.runtime.lastError || !n) await a.injectDropper();
                  else a.pickupActivate();
                }
              );
            },
            async injectDropper() {
              await chrome.scripting.executeScript({
                target: {
                  tabId: a.tab.id,
                },
                files: ["/js/picker.js"],
              }),
                a.pickupActivate();
            },
            sendMessage(n, e) {
              chrome.tabs.sendMessage(a.tab.id, n, e);
            },
            shortcutListener() {
              chrome.commands.onCommand.addListener((n) => {
                switch (n) {
                  case "activate":
                    a.activate2();
                    break;
                }
              });
            },
            messageListener() {
              chrome.runtime.onMessage.addListener((n, e, z) => {
                switch (n.type) {
                  case "activate-from-hotkey":
                    a.activate2(), z({});
                    break;

                  case "clear-history":
                    a.clearHistory(z);
                    break;
                }
              }),
                chrome.runtime.onConnect.addListener((n) => {
                  n.onMessage.addListener((n, e) => {
                    switch (n.type) {
                      case "screenshot":
                        a.capture();
                        break;

                      case "set-color":
                        a.setColor(`#${n.color.rgbhex}`, true, 1, e.sender.url);
                        break;
                    }
                  });
                });
            },
            setBadgeColor(n) {
              chrome.action.setBadgeBackgroundColor({
                color: [
                  parseInt(n.substr(1, 2), 16),
                  parseInt(n.substr(3, 2), 16),
                  parseInt(n.substr(5, 2), 16),
                  255,
                ],
              });
            },
            setColor(n, e = true, z = 1, q) {
              if (!n || !n.match(/^#[0-9a-f]{6}$/)) return;
              a.setBadgeColor(n),
                (a.history.last_color = n),
                a.saveToHistory(n, z, q);
            },
            saveToHistory(n, e = 1, z) {
              const q = a.getPalette();
              if (!q.colors.find((e) => e.h === n))
                q.colors.push(a.historyColorItem(n, Date.now(), e, false, z)),
                  a.saveHistory();
            },
            activate2() {
              chrome.tabs.query(
                {
                  active: true,
                  currentWindow: true,
                },
                (n) => {
                  a.useTab(n[0]), a.activate();
                }
              );
            },
            activate() {
              a.checkDropperScripts();
            },
            pickupActivate() {
              a.sendMessage({
                type: "pickup-activate",
                options: {
                  cursor: a.settings.dropperCursor,
                  enableColorToolbox: a.settings.enableColorToolbox,
                  enableColorTooltip: a.settings.enableColorTooltip,
                  enableRightClickDeactivate:
                    a.settings.enableRightClickDeactivate,
                },
              });
            },
            capture() {
              chrome.tabs.captureVisibleTab(
                null,
                {
                  format: "png",
                },
                a.doCapture
              );
            },
            getColor: () => a.history.last_color,
            doCapture(n) {
              if (n)
                a.sendMessage({
                  type: "update-image",
                  data: n,
                });
            },
            tabOnChangeListener() {
              chrome.tabs.onActivated.addListener((n) => {
                const { tabId: e } = n;
                if (a.tab && a.tab.id === e)
                  a.sendMessage({
                    type: "pickup-deactivate",
                  });
              });
            },
            getPaletteName: () => a.getPalette().name,
            isPalette: (n) => !!a.history.palettes.find((e) => e.name === n),
            getPalette(n) {
              if (n === void 0)
                n =
                  a.history.current_palette === void 0 ||
                  !a.isPalette(a.history.current_palette)
                    ? "default"
                    : a.history.current_palette;
              return a.history.palettes.find((e) => e.name === n);
            },
            changePalette(n) {
              if (a.history.current_palette === n);
              else if (a.isPalette(n))
                (a.history.current_palette = n), a.saveHistory();
            },
            getPaletteNames: () => a.history.palettes.map((n) => n.name),
            uniquePaletteName(n) {
              if (n === void 0 || !n || n.length < 1)
                return a.uniquePaletteName("palette");
              if (a.getPaletteNames().find((e) => e === n)) {
                const e = n.match(/^(.*[^\d]+)(\d+)?$/);
                if (e && e[2] === void 0) return a.uniquePaletteName(`${n}1`);
                if (e) {
                  const n = `${e[1]}${parseInt(e[2], 10) + 1}`;
                  return a.uniquePaletteName(n);
                }
              } else return n;
              return "";
            },
            createPalette(n) {
              const e = a.uniquePaletteName(n);
              return (
                a.history.palettes.push({
                  name: e,
                  created: Date.now(),
                  colors: [],
                }),
                a.saveHistory(),
                a.getPalette(e)
              );
            },
            destroyPalette(n) {
              if (!a.isPalette(n)) return;
              if (n === "default") a.getPalette(n).colors = [];
              else {
                const e = n === a.getPalette().name;
                if (
                  ((a.history.palettes = a.history.palettes.filter(
                    (e) => e.name !== n
                  )),
                  e)
                )
                  a.changePalette("default");
              }
              a.saveHistory(false), chrome.storage.sync.remove(`palette.${n}`);
            },
            clearHistory(n) {
              const e = a.getPalette();
              if (((e.colors = []), a.saveHistory(), n !== void 0))
                n({
                  state: "OK",
                });
            },
            loadHistory() {
              chrome.storage.sync.get((n) => {
                if (n.history) {
                  (a.history.current_palette = n.history.cp),
                    (a.history.last_color = n.history.lc);
                  let e = 0,
                    z = 0;
                  if (
                    (Object.keys(n).forEach((q) => {
                      const l = q.match(/^palette\.(.*)$/);
                      if (l) {
                        const P = n[q];
                        if (
                          (a.history.palettes.push({
                            name: l[1],
                            colors: P.c,
                            created: P.t,
                          }),
                          l[1] === "default")
                        )
                          e = P.c.length;
                        if (l[1] === "converted") z = P.c.length;
                      }
                    }),
                    e === 0 && z > 0)
                  )
                    a.defaultPalette = "converted";
                } else a.createPalette("default");
              });
            },
            loadSettings() {
              chrome.storage.sync.get("settings", (n) => {
                if (n.settings) a.settings = n.settings;
              });
            },
            historyColorItem: (n, e = Date.now(), z = 1, q = false) => ({
              h: n,
              n: "",
              s: z,
              t: e,
              f: q ? 1 : 0,
            }),
            saveHistory(n = true) {
              const e = {
                history: {
                  v: a.history.version,
                  cp: a.history.current_palette,
                  lc: a.history.last_color,
                },
              };
              if (n)
                for (let n = 0, z = a.history.palettes; n < z.length; n += 1) {
                  const q = z[n];
                  e[`palette.${q.name}`] = {
                    c: q.colors,
                    t: q.created,
                  };
                }
              chrome.storage.sync.set(e, () => {});
            },
            saveSettings() {
              chrome.storage.sync.set(
                {
                  settings: a.settings,
                },
                () => {}
              );
            },
            init() {
              a.loadSettings(),
                a.loadHistory(),
                chrome.action.setBadgeText({
                  text: " ",
                }),
                a.messageListener(),
                a.tabOnChangeListener(),
                a.shortcutListener();
            },
          };
        async function t(n) {
          if (
            !n.url ||
            (!n.url.startsWith("http") && !n.url.startsWith("file")) ||
            n.url.startsWith("https://chrome.google.com")
          )
            return void chrome.action.setTitle({
              tabId: n.id,
              title: "Color picker doesn't work on internal browser pages.",
            });
          chrome.action.setTitle({
            tabId: n.id,
            title: "Click to activate the color picker tool.",
          });
        }
        function b() {
          const n = Array.from(document.styleSheets)
              .filter(
                (n) =>
                  n.href === null || n.href.startsWith(window.location.origin)
              )
              .reduce(
                (n, e) =>
                  (n = [
                    ...n,
                    ...Array.from(e.cssRules).reduce(
                      (n, e) =>
                        (n =
                          e.selectorText === ":root"
                            ? [
                                ...n,
                                ...Array.from(e.style).filter((n) =>
                                  n.startsWith("--")
                                ),
                              ]
                            : n),
                      []
                    ),
                  ]),
                []
              ),
            e = [];
          for (const z of n) {
            const n = getComputedStyle(
              document.documentElement
            ).getPropertyValue(z);
            if (n.startsWith("#")) if (!e.includes(n)) e.push(n);
          }
          return e;
        }
        async function p() {
          let n = [];
          const e = await l.browser.tabs.query({
            active: true,
            currentWindow: true,
          });
          if (e.length) {
            const z = e[0],
              q = await chrome.scripting.executeScript({
                target: {
                  tabId: z.id,
                  allFrames: false,
                },
                func: b,
              });
            if (q.length) n = q[0].result;
          }
          return n;
        }
        l.browser.runtime.onInstalled.addListener(async (n) => {
          if (n.reason === "install") {
            const n = "js/content.js",
              e = await l.browser.tabs.query({});
            for (const z of e)
              if (z.id)
                try {
                  await chrome.scripting.executeScript({
                    target: {
                      tabId: z.id,
                      allFrames: true,
                    },
                    files: [n],
                  });
                } catch (n) {}
          }
        }),
          l.browser.tabs.onActivated.addListener(async (n) => {
            await new Promise((n) => setTimeout(n, 100));
            try {
              if (n.tabId) {
                const e = await l.browser.tabs.get(n.tabId);
                await t(e);
              }
            } catch (n) {}
          }),
          l.browser.tabs.onUpdated.addListener(async (n, e, z) => {
            await t(z);
          }),
          l.browser.runtime.onMessage.addListener(async (n) => {
            let e;
            if (n.action === "activate") a.activate2();
            else if (n.action === "getHistory") e = a.getPalette();
            else if (n.action === "getPalette") e = await p();
            else if (n.action === "clear")
              await new Promise((n) => a.clearHistory(n));
            return e;
          }),
          (0, P.default)("G-LP41FMZMKL", "-NtRTvJfT4qYzF5jjlMYmA"),
          a.init();
      },
      {
        Ib: 1,
        "chroma-js": 18,
        "color-name": 114,
        "webextension-polyfill-ts": 115,
      },
    ],
  },
  {},
  [117]
);
