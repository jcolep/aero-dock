import{s as O}from"./rolldown-runtime-BPrqr1PP.js";import{Cu as S,Dl as T,Fp as N,Ms as E,Ns as I,Ou as g,Qc as D,Qs as _,Tu as C,_l as A,du as M,ju as u,lu as q,nd as v,rd as w,xu as x,zc as z,zo as F}from"./vendor-underscore-Bz5YeRR3.js";import{t as U}from"./vendor-papaparse-Dma5Wtia.js";var d=O(U(),1);function V(t){const n=JSON.parse(t),s=Array.isArray(n)?n:[n],r=s.filter(e=>e!==null&&typeof e=="object"&&!Array.isArray(e));if(s.length&&r.length===s.length){const e=[...new Set(s.flatMap(o=>Object.keys(o)))];return d.default.unparse(s.map(o=>Object.fromEntries(e.map(i=>[i,m(o[i])]))),{columns:e})}return d.default.unparse(s.map(e=>({value:m(e)})))}function m(t){return t!==null&&typeof t=="object"?JSON.stringify(t):t}var L=N(500,1440*60),k=class{opt={};constructor(t){this.opt=this.parseOptions(t)}parseOptions(t){const n=L.get(t);if(n)return n;const s={};return u(t,",").forEach(r=>{const e=r.split("=");e.length&&(s[e[0].trim().toLowerCase()]=e.length>1?e[1].trim():!0)}),L.set(t,s),s}has(t){return this.opt[t]}int(t,n=0){if(!this.opt[t])return n;try{return parseInt(this.opt[t])}catch{return n}}str(t,n){return A(this.opt[t])?n:this.opt[t]}};function B(t,n,s,r){const e={ids:[],groups:[]};if(!n)return e;if(e.ids=S(I(n.trim().replace(/[^A-Z0-9]+/gi," ").split(" ").filter(o=>o&&T(o))),""),s?.opt.has("group")||r){const o=D(e.ids,i=>i.substring(0,3));for(const i of Object.keys(o))e.groups.push({prefix:i,ids:o[i],sobjName:t[i]?.name||F[i]})}return e}function J(t,n,s,r){const e=B(t,n,s,r);return e.groups.length?e.groups.map(o=>`${o.sobjName||o.prefix} (${o.ids.length})
=============
${o.ids.join(`
`)}`).join(`

`):e.ids.join(`
`)}function P(t,n){return u(t).map(s=>_(s)).filter(s=>s!=="").join(`
`)}function H(t,n,s){const r=u(t),e=u(n),o=[],i=[],h=[];for(const c of r)e.includes(c)?o.push(c):h.push(c);for(const c of e)r.includes(c)?o.push(c):i.push(c);return{matching:o,missingLeft:i,missingRight:h}}function Q(t,n,s){const r=H(t,n,s),e=f(r.matching.join(`
`),s),o=e.lines.map(a=>a.count>1?`${a.line} (${a.count})`:a.line).join(`
`),i=f(r.missingLeft.join(`
`),s),h=i.lines.map(a=>a.count>1?`${a.line} (${a.count})`:a.line).join(`
`),c=f(r.missingRight.join(`
`),s),b=c.lines.map(a=>a.count>1?`${a.line} (${a.count})`:a.line).join(`
`);let p="";return p+=`Missing in Right (${c.lines.length} Lines, ${r.missingRight.length} Occurrences)
============
${b}`,p+=`

`,p+=`Missing in Left (${i.lines.length} Lines, ${r.missingLeft.length} Occurrences)
============
${h}`,p+=`

`,p+=`Matching (${e.lines.length} Lines, ${r.matching.length} Occurrences)
============
${o}`,p}function K(t,n,s){const r=s?t:t.map(e=>q(e,"'","\\'"));return s?g(r,n).map(e=>e.join(", ")).join(`,
`):g(r,n).map(e=>e.join("', '")).join(`',
'`)}function W(t,n,s,r){const e=r.opt.has("noparen"),o=`${e?"":"("}${n?"":"'"}${K(s,r.opt.int("size",5),n)}${n?"":"'"}${e?"":")"}`;if(t){if(t.includes("{{value}}"))return M(t,"value",o);`${t}${o}`}return o}function X(t,n,s){let r=u(t);if(!r.length)return"";r=I(r);const e=s.opt.has("noquote");return g(r,s.opt.int("max",500)).map(o=>W(n,e,o,s)).join(`

`)}function f(t,n){const s=Array.isArray(t)?t:u(t),r={};return s.forEach(e=>{r[e]||(r[e]=0),r[e]=r[e]+1}),{lines:Object.keys(r).map(e=>({line:e,count:r[e]}))}}function y(t,n,s){const r=f(t,s);return{dupeLines:C(r.lines.filter(e=>e.count>1),e=>e.count),uniqueLines:S(r.lines.filter(e=>e.count===1))}}function Z(t,n,s){const r=y(t,n,s);return`
Duplicates (${r.dupeLines.length} Lines)
==
${r.dupeLines.map(e=>`${e.line} (${e.count})`).join(`
`)}

Non-Duplicates (${r.uniqueLines.length} Lines)
==
${r.uniqueLines.map(e=>`${e.line}`).join(`
`)}
`}function $(t,n,s,r){return r||s.opt.has("reverse")?C(u(t),void 0,!s.opt.has("case")).join(`
`):x(u(t),void 0,!s.opt.has("case")).join(`
`)}function G(t,n,s){return s.opt.has("count")?f(t).lines.map(r=>`${r.line} (${r.count})`).join(`
`):R(t,n,s).join(`
`)}function R(t,n,s){const r=Array.isArray(t)?t:u(t),e={},o=[];return r.forEach(i=>{e[i]||(e[i]=!0,o.push(i))}),o}function j(t,n,s,r){const e=s.opt.int("size",-1),o=s.opt.str("char","0");return e<=0?t:u(t).map(i=>r?i.padStart(e,o):i.padEnd(e,o)).join(`
`)}function l(t,n,s){return u(t).map(r=>s(r)).filter(r=>n?!!r:!0).join(`
`)}function Y(t){return t.split(`
`).filter(n=>!n)}function oe(t){if(!t)return"0 Chars";const n=u(t);return`${n.length} lines, ${y(n,"",void 0).dupeLines.length} dupes, ${R(n,"",void 0).length} unique, ${Y(t).length} blanks, ${t.length} chars`}function ie(t,n,s,r){return te(t,n,s,r).trim()}var ae=["JSON to CSV","18 Char Ids","15 Char Ids","Extract Ids","Extract Numbers","Base64 Decode","Html Decode","URL Decode","In Clause String","Compare","Identify Duplicates","View Unique","Match","Sort","Sort Reverse","Shuffle","Trim","Truncate Left","Truncate Right","Pad Left","Pad Right"];function ee(t){const n=u(t);return x(n,()=>z(0,n.length)).join(`
`)}function te(t,n,s,r){const e={...r,opt:new k(r.options)};switch(r.oper){case"JSON to CSV":return V(n);case"18 Char Ids":return l(n,!0,o=>w(o));case"15 Char Ids":return l(n,!0,o=>v(o));case"Extract Ids":return J(t,n,e,!0);case"Extract Numbers":return P(n,e);case"Base64 Decode":return E(n.replace(/\s+/g,""));case"Html Decode":{const o=document.createElement("textarea");return o.innerHTML=n,o.value}case"URL Decode":return decodeURIComponent(n);case"In Clause String":return X(n,s,e);case"Identify Duplicates":return Z(n,s,e);case"Match":return Q(n,s,e);case"View Unique":return G(n,s,e);case"Sort":return $(n,s,e);case"Sort Reverse":return $(n,s,e,!0);case"Shuffle":return ee(n);case"Trim":return l(n,!1,o=>o.trim());case"Pad Left":return j(n,s,e,!0);case"Pad Right":return j(n,s,e,!1);case"Truncate Left":return l(n,!1,o=>e.opt.has("size")?o.slice(-e.opt.int("size")):o);case"Truncate Right":return l(n,!1,o=>e.opt.has("size")?o.substring(0,e.opt.int("size")):o)}return""}export{oe as a,B as i,k as n,X as o,V as r,ie as s,ae as t};
