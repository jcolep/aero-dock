(self["webpackChunkabu_cross_browser_extension"] = self["webpackChunkabu_cross_browser_extension"] || []).push([[166],{

/***/ 96324:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  vA: () => (/* reexport */ n),
  EW: () => (/* reexport */ g),
  vP: () => (/* reexport */ y),
  HO: () => (/* binding */ useComputed),
  Ul: () => (/* binding */ useSignal),
  R0: () => (/* binding */ useSignalEffect)
});

// UNUSED EXPORTS: Signal, action, createModel, effect, untracked, useModel

// EXTERNAL MODULE: ./node_modules/preact/dist/preact.module.js
var preact_module = __webpack_require__(96445);
// EXTERNAL MODULE: ./node_modules/preact/hooks/dist/hooks.module.js
var hooks_module = __webpack_require__(52297);
;// ./node_modules/@preact/signals-core/dist/signals-core.module.js
var i=Symbol.for("preact-signals");function t(){if(!(v>1)){var i,t=!1;!function(){var i=c;c=void 0;while(void 0!==i){var t=i.S;if(t.v===i.v)for(var n=t.t;void 0!==n;n=n.x)if(n.i===i.i)n.i=t.i;i=i.o}}();while(void 0!==h){var n=h;h=void 0;s++;while(void 0!==n){var r=n.u;n.u=void 0;n.f&=-3;if(!(8&n.f)&&w(n))try{n.c()}catch(n){if(!t){i=n;t=!0}}n=r}}s=0;v--;if(t)throw i}else v--}function n(i){if(v>0)return i();signals_core_module_e=++u;v++;try{return i()}finally{t()}}var r,signals_core_module_o=void 0;function f(i){var t=signals_core_module_o,n=r;signals_core_module_o=void 0;r=void 0;try{return i()}finally{signals_core_module_o=t;r=n}}var h=void 0,v=0,s=0,u=0,signals_core_module_e=0,c=void 0,d=0;function a(i){if(void 0!==signals_core_module_o){var t=i.n;if(void 0===t||t.t!==signals_core_module_o){t={i:0,S:i,p:signals_core_module_o.s,n:void 0,t:signals_core_module_o,e:void 0,x:void 0,r:t};if(void 0!==signals_core_module_o.s)signals_core_module_o.s.n=t;signals_core_module_o.s=t;i.n=t;if(32&signals_core_module_o.f)i.S(t);return t}else if(-1===t.i){t.i=0;if(void 0!==t.n){t.n.p=t.p;if(void 0!==t.p)t.p.n=t.n;t.p=signals_core_module_o.s;t.n=void 0;signals_core_module_o.s.n=t;signals_core_module_o.s=t}return t}}}function l(i,t){this.v=i;this.i=0;this.n=void 0;this.t=void 0;this.l=0;this.W=null==t?void 0:t.watched;this.Z=null==t?void 0:t.unwatched;this.name=null==t?void 0:t.name}l.prototype.brand=i;l.prototype.h=function(){return!0};l.prototype.S=function(i){var t=this,n=this.t;if(n!==i&&void 0===i.e){i.x=n;this.t=i;if(void 0!==n)n.e=i;else f(function(){var i;null==(i=t.W)||i.call(t)})}};l.prototype.U=function(i){var t=this;if(void 0!==this.t){var n=i.e,r=i.x;if(void 0!==n){n.x=r;i.e=void 0}if(void 0!==r){r.e=n;i.x=void 0}if(i===this.t){this.t=r;if(void 0===r)f(function(){var i;null==(i=t.Z)||i.call(t)})}}};l.prototype.subscribe=function(i){var t=this;return j(function(){var n=t.value;f(function(){return i(n)})},{name:"sub"})};l.prototype.valueOf=function(){return this.value};l.prototype.toString=function(){return this.value+""};l.prototype.toJSON=function(){return this.value};l.prototype.peek=function(){var i=this;return f(function(){return i.value})};Object.defineProperty(l.prototype,"value",{get:function(){var i=a(this);if(void 0!==i)i.i=this.i;return this.v},set:function(i){if(i!==this.v){if(s>100)throw new Error("Cycle detected");!function(i){if(0!==v&&0===s)if(i.l!==signals_core_module_e){i.l=signals_core_module_e;c={S:i,v:i.v,i:i.i,o:c}}}(this);this.v=i;this.i++;d++;v++;try{for(var n=this.t;void 0!==n;n=n.x)n.t.N()}finally{t()}}}});function y(i,t){return new l(i,t)}function w(i){for(var t=i.s;void 0!==t;t=t.n)if(t.S.i!==t.i||!t.S.h()||t.S.i!==t.i)return!0;return!1}function _(i){for(var t=i.s;void 0!==t;t=t.n){var n=t.S.n;if(void 0!==n)t.r=n;t.S.n=t;t.i=-1;if(void 0===t.n){i.s=t;break}}}function b(i){var t=i.s,n=void 0;while(void 0!==t){var r=t.p;if(-1===t.i){t.S.U(t);if(void 0!==r)r.n=t.n;if(void 0!==t.n)t.n.p=r}else n=t;t.S.n=t.r;if(void 0!==t.r)t.r=void 0;t=r}i.s=n}function p(i,t){l.call(this,void 0,t);this.x=i;this.s=void 0;this.g=d-1;this.f=4}p.prototype=new l;p.prototype.h=function(){this.f&=-3;if(1&this.f)return!1;if(32==(36&this.f))return!0;this.f&=-5;if(this.g===d)return!0;this.g=d;this.f|=1;if(this.i>0&&!w(this)){this.f&=-2;return!0}var i=signals_core_module_o;try{_(this);signals_core_module_o=this;var t=this.x();if(16&this.f||this.v!==t||0===this.i){this.v=t;this.f&=-17;this.i++}}catch(i){this.v=i;this.f|=16;this.i++}signals_core_module_o=i;b(this);this.f&=-2;return!0};p.prototype.S=function(i){if(void 0===this.t){this.f|=36;for(var t=this.s;void 0!==t;t=t.n)t.S.S(t)}l.prototype.S.call(this,i)};p.prototype.U=function(i){if(void 0!==this.t){l.prototype.U.call(this,i);if(void 0===this.t){this.f&=-33;for(var t=this.s;void 0!==t;t=t.n)t.S.U(t)}}};p.prototype.N=function(){if(!(2&this.f)){this.f|=6;for(var i=this.t;void 0!==i;i=i.x)i.t.N()}};Object.defineProperty(p.prototype,"value",{get:function(){if(1&this.f)throw new Error("Cycle detected");var i=a(this);this.h();if(void 0!==i)i.i=this.i;if(16&this.f)throw this.v;return this.v}});function g(i,t){return new p(i,t)}function S(i){var n=i.m;i.m=void 0;if("function"==typeof n){v++;var r=signals_core_module_o;signals_core_module_o=void 0;try{n()}catch(t){i.f&=-2;i.f|=8;m(i);throw t}finally{signals_core_module_o=r;t()}}}function m(i){for(var t=i.s;void 0!==t;t=t.n)t.S.U(t);i.x=void 0;i.s=void 0;S(i)}function x(i){if(signals_core_module_o!==this)throw new Error("Out-of-order effect");b(this);signals_core_module_o=i;this.f&=-2;if(8&this.f)m(this);t()}function E(i,t){this.x=i;this.m=void 0;this.s=void 0;this.u=void 0;this.f=32;this.name=null==t?void 0:t.name;if(r)r.push(this)}E.prototype.c=function(){var i=this.S();try{if(8&this.f)return;if(void 0===this.x)return;var t=this.x();if("function"==typeof t)this.m=t}finally{i()}};E.prototype.S=function(){if(1&this.f)throw new Error("Cycle detected");this.f|=1;this.f&=-9;S(this);_(this);v++;var i=signals_core_module_o;signals_core_module_o=this;return x.bind(this,i)};E.prototype.N=function(){if(!(2&this.f)){this.f|=2;this.u=h;h=this}};E.prototype.d=function(){this.f|=8;if(!(1&this.f))m(this)};E.prototype.dispose=function(){this.d()};function j(i,t){var n=new E(i,t);try{n.c()}catch(i){n.d();throw i}var r=n.d.bind(n);r[Symbol.dispose]=r;return r}function C(i){return function(){var t=arguments,r=this;return n(function(){return f(function(){return i.apply(r,[].slice.call(t))})})}}function O(){var i=r;r=[];return function(){var t=r;if(r&&i)i=i.concat(r);r=i;return t}}var k=function(i){for(var t in i){var n=i[t];if("function"==typeof n)i[t]=C(n);else if("object"==typeof n&&null!==n&&!("brand"in n))k(n)}};function T(i){return function(){var t,n,o=O();try{n=i.apply(void 0,[].slice.call(arguments))}catch(i){r=void 0;throw i}finally{t=o()}k(n);n[Symbol.dispose]=C(function(){if(t)for(var i=0;i<t.length;i++)t[i].dispose();t=void 0});return n}}
;// ./node_modules/@preact/signals/dist/signals.module.js
var signals_module_l,signals_module_h,signals_module_d,signals_module_p="undefined"!=typeof window&&!!window.__PREACT_SIGNALS_DEVTOOLS__,signals_module_m=[],signals_module_=[];j(function(){signals_module_l=this.N})();function signals_module_g(i,r){preact_module/* options */.fF[i]=r.bind(null,preact_module/* options */.fF[i]||function(){})}function signals_module_b(i){if(signals_module_d){var n=signals_module_d;signals_module_d=void 0;n()}signals_module_d=i&&i.S()}function signals_module_y(i){var n=this,t=i.data,f=useSignal(t);f.name="ReactiveDom";f.value=t;var e=(0,hooks_module/* useMemo */.Kr)(function(){var i=n,t=n.__v;while(t=t.__)if(t.__c){t.__c.__$f|=4;break}var o=g(function(){var i=f.value.value;return 0===i?0:!0===i?"":i||""}),e=g(function(){return!Array.isArray(o.value)&&!(0,preact_module/* isValidElement */.zO)(o.value)}),a=j(function(){this.N=F;if(e.value){var n=o.value;if(i.__v&&i.__v.__e&&3===i.__v.__e.nodeType)i.__v.__e.data=n}}),v=n.__$u.d;n.__$u.d=function(){a();v.call(this)};return[e,o]},[]),a=e[0],v=e[1];return a.value?v.peek():v.value}signals_module_y.displayName="ReactiveTextNode";Object.defineProperties(l.prototype,{constructor:{configurable:!0,value:void 0},type:{configurable:!0,value:signals_module_y},props:{configurable:!0,get:function(){var i=this;return{data:{get value(){return i.value}}}}},__b:{configurable:!0,value:1}});signals_module_g("__b",function(i,n){if("string"==typeof n.type){var r,t=n.props;for(var o in t)if("children"!==o){var f=t[o];if(f instanceof l){if(!r)n.__np=r={};r[o]=f;t[o]=f.peek()}}}i(n)});signals_module_g("__r",function(i,n){i(n);if(n.type!==preact_module/* Fragment */.FK){signals_module_b();var r,o=n.__c;if(o){o.__$f&=-2;if(void 0===(r=o.__$u))o.__$u=r=function(i,n){var r;j(function(){r=this},{name:n});r.c=i;return r}(function(i){return function(){var n;if(signals_module_p)null==(n=this.y)||n.call(this);i.__$f|=1;i.setState({})}}(o),"function"==typeof n.type?n.type.displayName||n.type.name:"")}signals_module_h=o;signals_module_b(r)}});signals_module_g("__e",function(i,n,r,t){signals_module_b();signals_module_h=void 0;i(n,r,t)});signals_module_g("diffed",function(i,n){signals_module_b();signals_module_h=void 0;var r;if("string"==typeof n.type&&(r=n.__e)){var t=n.__np,o=n.props,f=r.U;if(f)for(var e in f){var u=f[e];if(!(void 0===u||t&&e in t)){u.d();f[e]=void 0}}if(t){if(!f){f={};r.U=f}for(var a in t){var c=f[a],v=t[a];if(void 0===c){c=signals_module_w(r,a,v,o);f[a]=c}else c.o(v,o)}}}i(n)});function signals_module_w(i,n,r,t){var o=n in i&&void 0===i.ownerSVGElement,f=y(r);return{o:function(i,n){f.value=i;t=n},d:j(function(){this.N=F;var r=f.value.value;if(t[n]!==r){t[n]=r;if(o)i[n]=r;else if(null!=r&&(!1!==r||"-"===n[4]))i.setAttribute(n,r);else i.removeAttribute(n)}})}}signals_module_g("unmount",function(i,n){if("string"==typeof n.type){var r=n.__e;if(r){var t=r.U;if(t){r.U=void 0;for(var o in t){var f=t[o];if(f)f.d()}}}var e=n.__np;if(e){var u=n.props;for(var a in e)u[a]=e[a]}n.__np=void 0}else{var c=n.__c;if(c){var v=c.__$u;if(v){c.__$u=void 0;v.d()}}}i(n)});signals_module_g("__h",function(i,n,r,t){if(t<3)n.__$f|=2;i(n,r,t)});preact_module/* Component */.uA.prototype.shouldComponentUpdate=function(i,n){if(this.__R)return!0;var r=this.__$u,t=r&&void 0!==r.s;for(var o in n)return!0;if(this.__f||"boolean"==typeof this.u&&!0===this.u){var f=2&this.__$f;if(!(t||f||4&this.__$f))return!0;if(1&this.__$f)return!0}else{if(!(t||4&this.__$f))return!0;if(3&this.__$f)return!0}for(var e in i)if("__source"!==e&&i[e]!==this.props[e])return!0;for(var u in this.props)if(!(u in i))return!0;return!1};function useSignal(i,n){return (0,hooks_module/* useMemo */.Kr)(function(){return y(i,n)},[])}function useComputed(i,n){var r=(0,hooks_module/* useRef */.li)(i);r.current=i;signals_module_h.__$f|=4;return (0,hooks_module/* useMemo */.Kr)(function(){return g(function(){return r.current()},n)},[])}var signals_module_k="undefined"==typeof requestAnimationFrame?setTimeout:function(i){var n=function(){clearTimeout(r);cancelAnimationFrame(t);i()},r=setTimeout(n,35),t=requestAnimationFrame(n)},q=function(i){queueMicrotask(function(){queueMicrotask(i)})};function A(){n(function(){var i;while(i=signals_module_m.shift())signals_module_l.call(i)})}function signals_module_T(){if(1===signals_module_m.push(this))(preact_module/* options */.fF.requestAnimationFrame||signals_module_k)(A)}function signals_module_x(){n(function(){var i;while(i=signals_module_.shift())signals_module_l.call(i)})}function F(){if(1===signals_module_.push(this))(preact_module/* options */.fF.requestAnimationFrame||q)(signals_module_x)}function useSignalEffect(i,n){var r=(0,hooks_module/* useRef */.li)(i);r.current=i;(0,hooks_module/* useEffect */.vJ)(function(){return j(function(){this.N=signals_module_T;return r.current()},n)},[])}function M(i){var n=o(function(){return i()},[]);e(function(){return n[Symbol.dispose]},[n]);return n}

/***/ }),

/***/ 96445:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FK: () => (/* binding */ S),
/* harmony export */   Ob: () => (/* binding */ W),
/* harmony export */   Qv: () => (/* binding */ U),
/* harmony export */   XX: () => (/* binding */ R),
/* harmony export */   _3: () => (/* binding */ M),
/* harmony export */   fF: () => (/* binding */ l),
/* harmony export */   h: () => (/* binding */ k),
/* harmony export */   n: () => (/* binding */ k),
/* harmony export */   q6: () => (/* binding */ X),
/* harmony export */   uA: () => (/* binding */ C),
/* harmony export */   v2: () => (/* binding */ F),
/* harmony export */   zO: () => (/* binding */ t)
/* harmony export */ });
var n,l,u,t,i,r,o,e,f,c,a,s,h,p,v,y,d={},w=[],_=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,g=Array.isArray;function m(n,l){for(var u in l)n[u]=l[u];return n}function b(n){n&&n.parentNode&&n.parentNode.removeChild(n)}function k(l,u,t){var i,r,o,e={};for(o in u)"key"==o?i=u[o]:"ref"==o?r=u[o]:e[o]=u[o];if(arguments.length>2&&(e.children=arguments.length>3?n.call(arguments,2):t),"function"==typeof l&&null!=l.defaultProps)for(o in l.defaultProps)void 0===e[o]&&(e[o]=l.defaultProps[o]);return x(l,e,i,r,null)}function x(n,t,i,r,o){var e={type:n,props:t,key:i,ref:r,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:null==o?++u:o,__i:-1,__u:0};return null==o&&null!=l.vnode&&l.vnode(e),e}function M(){return{current:null}}function S(n){return n.children}function C(n,l){this.props=n,this.context=l}function $(n,l){if(null==l)return n.__?$(n.__,n.__i+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return"function"==typeof n.type?$(n):null}function I(n){if(n.__P&&n.__d){var u=n.__v,t=u.__e,i=[],r=[],o=m({},u);o.__v=u.__v+1,l.vnode&&l.vnode(o),q(n.__P,o,u,n.__n,n.__P.namespaceURI,32&u.__u?[t]:null,i,null==t?$(u):t,!!(32&u.__u),r),o.__v=u.__v,o.__.__k[o.__i]=o,D(i,o,r),u.__e=u.__=null,o.__e!=t&&P(o)}}function P(n){if(null!=(n=n.__)&&null!=n.__c)return n.__e=n.__c.base=null,n.__k.some(function(l){if(null!=l&&null!=l.__e)return n.__e=n.__c.base=l.__e}),P(n)}function A(n){(!n.__d&&(n.__d=!0)&&i.push(n)&&!H.__r++||r!=l.debounceRendering)&&((r=l.debounceRendering)||o)(H)}function H(){try{for(var n,l=1;i.length;)i.length>l&&i.sort(e),n=i.shift(),l=i.length,I(n)}finally{i.length=H.__r=0}}function L(n,l,u,t,i,r,o,e,f,c,a){var s,h,p,v,y,_,g=t&&t.__k||w,m=l.length;for(f=T(u,l,g,f,m),s=0;s<m;s++)null!=(p=u.__k[s])&&(h=-1!=p.__i&&g[p.__i]||d,p.__i=s,_=q(n,p,h,i,r,o,e,f,c,a),v=p.__e,p.ref&&h.ref!=p.ref&&(h.ref&&J(h.ref,null,p),a.push(p.ref,p.__c||v,p)),null==y&&null!=v&&(y=v),4&p.__u?(f=j(p,f,n),h.__e&&(h.__e=null)):"function"==typeof p.type&&void 0!==_?f=_:v&&(f=v.nextSibling),p.__u&=-7);return u.__e=y,f}function T(n,l,u,t,i){var r,o,e,f,c,a=u.length,s=a,h=0;for(n.__k=new Array(i),r=0;r<i;r++)null!=(o=l[r])&&"boolean"!=typeof o&&"function"!=typeof o?("string"==typeof o||"number"==typeof o||"bigint"==typeof o||o.constructor==String?o=n.__k[r]=x(null,o,null,null,null):g(o)?o=n.__k[r]=x(S,{children:o},null,null,null):void 0===o.constructor&&o.__b>0?o=n.__k[r]=x(o.type,o.props,o.key,o.ref?o.ref:null,o.__v):n.__k[r]=o,f=r+h,o.__=n,o.__b=n.__b+1,e=null,-1!=(c=o.__i=O(o,u,f,s))&&(s--,(e=u[c])&&(e.__u|=2)),null==e||null==e.__v?(-1==c&&(i>a?h--:i<a&&h++),"function"!=typeof o.type&&(o.__u|=4)):c!=f&&(c==f-1?h--:c==f+1?h++:(c>f?h--:h++,o.__u|=4))):n.__k[r]=null;if(s)for(r=0;r<a;r++)null!=(e=u[r])&&0==(2&e.__u)&&(e.__e==t&&(t=$(e)),K(e,e));return t}function j(n,l,u){var t,i;if("function"==typeof n.type){for(t=n.__k,i=0;t&&i<t.length;i++)t[i]&&(t[i].__=n,l=j(t[i],l,u));return l}n.__e!=l&&(l&&n.type&&!l.parentNode&&(l=$(n)),l=u.insertBefore(n.__e,l||null));do{l=l&&l.nextSibling}while(null!=l&&8==l.nodeType);return l}function F(n,l){return l=l||[],null==n||"boolean"==typeof n||(g(n)?n.some(function(n){F(n,l)}):l.push(n)),l}function O(n,l,u,t){var i,r,o,e=n.key,f=n.type,c=l[u],a=null!=c&&0==(2&c.__u);if(null===c&&null==e||a&&e==c.key&&f==c.type)return u;if(t>(a?1:0))for(i=u-1,r=u+1;i>=0||r<l.length;)if(null!=(c=l[o=i>=0?i--:r++])&&0==(2&c.__u)&&e==c.key&&f==c.type)return o;return-1}function z(n,l,u){"-"==l[0]?n.setProperty(l,null==u?"":u):n[l]=null==u?"":"number"!=typeof u||_.test(l)?u:u+"px"}function N(n,l,u,t,i){var r,o;n:if("style"==l)if("string"==typeof u)n.style.cssText=u;else{if("string"==typeof t&&(n.style.cssText=t=""),t)for(l in t)u&&l in u||z(n.style,l,"");if(u)for(l in u)t&&u[l]==t[l]||z(n.style,l,u[l])}else if("o"==l[0]&&"n"==l[1])r=l!=(l=l.replace(s,"$1")),o=l.toLowerCase(),l=o in n||"onFocusOut"==l||"onFocusIn"==l?o.slice(2):l.slice(2),n.l||(n.l={}),n.l[l+r]=u,u?t?u[a]=t[a]:(u[a]=h,n.addEventListener(l,r?v:p,r)):n.removeEventListener(l,r?v:p,r);else{if("http://www.w3.org/2000/svg"==i)l=l.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if("width"!=l&&"height"!=l&&"href"!=l&&"list"!=l&&"form"!=l&&"tabIndex"!=l&&"download"!=l&&"rowSpan"!=l&&"colSpan"!=l&&"role"!=l&&"popover"!=l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null==u||!1===u&&"-"!=l[4]?n.removeAttribute(l):n.setAttribute(l,"popover"==l&&1==u?"":u))}}function V(n){return function(u){if(this.l){var t=this.l[u.type+n];if(null==u[c])u[c]=h++;else if(u[c]<t[a])return;return t(l.event?l.event(u):u)}}}function q(n,u,t,i,r,o,e,f,c,a){var s,h,p,v,y,d,_,k,x,M,I,P,A,H,T,j,F=u.type;if(void 0!==u.constructor)return null;128&t.__u&&(c=!!(32&t.__u),o=[f=u.__e=t.__e]),(s=l.__b)&&s(u);n:if("function"==typeof F){h=e.length;try{if(x=u.props,M=F.prototype&&F.prototype.render,I=(s=F.contextType)&&i[s.__c],P=s?I?I.props.value:s.__:i,t.__c?k=(p=u.__c=t.__c).__=p.__E:(M?u.__c=p=new F(x,P):(u.__c=p=new C(x,P),p.constructor=F,p.render=Q),I&&I.sub(p),p.state||(p.state={}),p.__n=i,v=p.__d=!0,p.__h=[],p._sb=[]),M&&null==p.__s&&(p.__s=p.state),M&&null!=F.getDerivedStateFromProps&&(p.__s==p.state&&(p.__s=m({},p.__s)),m(p.__s,F.getDerivedStateFromProps(x,p.__s))),y=p.props,d=p.state,p.__v=u,v)M&&null==F.getDerivedStateFromProps&&null!=p.componentWillMount&&p.componentWillMount(),M&&null!=p.componentDidMount&&p.__h.push(p.componentDidMount);else{if(M&&null==F.getDerivedStateFromProps&&x!==y&&null!=p.componentWillReceiveProps&&p.componentWillReceiveProps(x,P),u.__v==t.__v||!p.__e&&null!=p.shouldComponentUpdate&&!1===p.shouldComponentUpdate(x,p.__s,P)){u.__v!=t.__v&&(p.props=x,p.state=p.__s,p.__d=!1),u.__e=t.__e,u.__k=t.__k,u.__k.some(function(n){n&&(n.__=u)}),w.push.apply(p.__h,p._sb),p._sb=[],p.__h.length&&e.push(p),f=$(t);break n}null!=p.componentWillUpdate&&p.componentWillUpdate(x,p.__s,P),M&&null!=p.componentDidUpdate&&p.__h.push(function(){p.componentDidUpdate(y,d,_)})}if(p.context=P,p.props=x,p.__P=n,p.__e=!1,A=l.__r,H=0,M)p.state=p.__s,p.__d=!1,A&&A(u),s=p.render(p.props,p.state,p.context),w.push.apply(p.__h,p._sb),p._sb=[];else do{p.__d=!1,A&&A(u),s=p.render(p.props,p.state,p.context),p.state=p.__s}while(p.__d&&++H<25);p.state=p.__s,null!=p.getChildContext&&(i=m(m({},i),p.getChildContext())),M&&!v&&null!=p.getSnapshotBeforeUpdate&&(_=p.getSnapshotBeforeUpdate(y,d)),T=null!=s&&s.type===S&&null==s.key?E(s.props.children):s,f=L(n,g(T)?T:[T],u,t,i,r,o,e,f,c,a),p.base=u.__e,u.__u&=-161,p.__h.length&&e.push(p),k&&(p.__E=p.__=null)}catch(n){if(e.length=h,u.__v=null,c||null!=o){if(n.then){for(u.__u|=c?160:128;f&&8==f.nodeType&&f.nextSibling;)f=f.nextSibling;null!=o&&(o[o.indexOf(f)]=null),u.__e=f}else if(null!=o)for(j=o.length;j--;)b(o[j])}else u.__e=t.__e;null==u.__k&&(u.__k=t.__k||[]),n.then||B(u),l.__e(n,u,t)}}else null==o&&u.__v==t.__v?(u.__k=t.__k,u.__e=t.__e):f=u.__e=G(t.__e,u,t,i,r,o,e,c,a);return(s=l.diffed)&&s(u),128&u.__u?void 0:f}function B(n){n&&(n.__c&&(n.__c.__e=!0),n.__k&&n.__k.some(B))}function D(n,u,t){for(var i=0;i<t.length;i++)J(t[i],t[++i],t[++i]);l.__c&&l.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u)})}catch(n){l.__e(n,u.__v)}})}function E(n){return"object"!=typeof n||null==n||n.__b>0?n:g(n)?n.map(E):void 0!==n.constructor?null:m({},n)}function G(u,t,i,r,o,e,f,c,a){var s,h,p,v,y,w,_,m=i.props||d,k=t.props,x=t.type;if("svg"==x?o="http://www.w3.org/2000/svg":"math"==x?o="http://www.w3.org/1998/Math/MathML":o||(o="http://www.w3.org/1999/xhtml"),null!=e)for(s=0;s<e.length;s++)if((y=e[s])&&"setAttribute"in y==!!x&&(x?y.localName==x:3==y.nodeType)){u=y,e[s]=null;break}if(null==u){if(null==x)return document.createTextNode(k);u=document.createElementNS(o,x,k.is&&k),c&&(l.__m&&l.__m(t,e),c=!1),e=null}if(null==x)m===k||c&&u.data==k||(u.data=k);else{if(e="textarea"==x&&null!=k.defaultValue?null:e&&n.call(u.childNodes),!c&&null!=e)for(m={},s=0;s<u.attributes.length;s++)m[(y=u.attributes[s]).name]=y.value;for(s in m)y=m[s],"dangerouslySetInnerHTML"==s?p=y:"children"==s||s in k||"value"==s&&"defaultValue"in k||"checked"==s&&"defaultChecked"in k||N(u,s,null,y,o);for(s in k)y=k[s],"children"==s?v=y:"dangerouslySetInnerHTML"==s?h=y:"value"==s?w=y:"checked"==s?_=y:c&&"function"!=typeof y||m[s]===y||N(u,s,y,m[s],o);if(h)c||p&&(h.__html==p.__html||h.__html==u.innerHTML)||(u.innerHTML=h.__html),t.__k=[];else if(p&&(u.innerHTML=""),L("template"==t.type?u.content:u,g(v)?v:[v],t,i,r,"foreignObject"==x?"http://www.w3.org/1999/xhtml":o,e,f,e?e[0]:i.__k&&$(i,0),c,a),null!=e)for(s=e.length;s--;)b(e[s]);c&&"textarea"!=x||(s="value","progress"==x&&null==w?u.removeAttribute("value"):null!=w&&(w!==u[s]||"progress"==x&&!w||"option"==x&&w!=m[s])&&N(u,s,w,m[s],o),s="checked",null!=_&&_!=u[s]&&N(u,s,_,m[s],o))}return u}function J(n,u,t){try{if("function"==typeof n){var i="function"==typeof n.__u;i&&n.__u(),i&&null==u||(n.__u=n(u))}else n.current=u}catch(n){l.__e(n,t)}}function K(n,u,t){var i,r;if(l.unmount&&l.unmount(n),(i=n.ref)&&(i.current&&i.current!=n.__e||J(i,null,u)),null!=(i=n.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount()}catch(n){l.__e(n,u)}i.base=i.__P=i.__n=null}if(i=n.__k)for(r=0;r<i.length;r++)i[r]&&K(i[r],u,t||"function"!=typeof n.type);t||b(n.__e),n.__c=n.__=n.__e=void 0}function Q(n,l,u){return this.constructor(n,u)}function R(u,t,i){var r,o,e,f;t==document&&(t=document.documentElement),l.__&&l.__(u,t),o=(r="function"==typeof i)?null:i&&i.__k||t.__k,e=[],f=[],q(t,u=(!r&&i||t).__k=k(S,null,[u]),o||d,d,t.namespaceURI,!r&&i?[i]:o?null:t.firstChild?n.call(t.childNodes):null,e,!r&&i?i:o?o.__e:t.firstChild,r,f),D(e,u,f),u.props.children=null}function U(n,l){R(n,l,U)}function W(l,u,t){var i,r,o,e,f=m({},l.props);for(o in l.type&&l.type.defaultProps&&(e=l.type.defaultProps),u)"key"==o?i=u[o]:"ref"==o?r=u[o]:f[o]=void 0===u[o]&&null!=e?e[o]:u[o];return arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):t),x(l.type,f,i||l.key,r||l.ref,null)}function X(n){function l(n){var u,t;return this.getChildContext||(u=new Set,(t={})[l.__c]=this,this.getChildContext=function(){return t},this.componentWillUnmount=function(){u=null},this.shouldComponentUpdate=function(n){this.props.value!=n.value&&u.forEach(function(n){n.__e=!0,A(n)})},this.sub=function(n){u.add(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){u&&u.delete(n),l&&l.call(n)}}),n.children}return l.__c="__cC"+y++,l.__=n,l.Provider=l.__l=(l.Consumer=function(n,l){return n.children(l)}).contextType=l,l}n=w.slice,l={__e:function(n,l,u,t){for(var i,r,o;l=l.__;)if((i=l.__c)&&!i.__)try{if((r=i.constructor)&&null!=r.getDerivedStateFromError&&(i.setState(r.getDerivedStateFromError(n)),o=i.__d),null!=i.componentDidCatch&&(i.componentDidCatch(n,t||{}),o=i.__d),o)return i.__E=i}catch(l){n=l}throw n}},u=0,t=function(n){return null!=n&&void 0===n.constructor},C.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!=this.state?this.__s:this.__s=m({},this.state),"function"==typeof n&&(n=n(m({},u),this.props)),n&&m(u,n),null!=n&&this.__v&&(l&&this._sb.push(l),A(this))},C.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),A(this))},C.prototype.render=S,i=[],o="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,e=function(n,l){return n.__v.__b-l.__v.__b},H.__r=0,f=Math.random().toString(8),c="__d"+f,a="__a"+f,s=/(PointerCapture)$|Capture$/i,h=0,p=V(!1),v=V(!0),y=0;


/***/ }),

/***/ 52297:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Bi: () => (/* binding */ g),
/* harmony export */   J0: () => (/* binding */ d),
/* harmony export */   Kr: () => (/* binding */ T),
/* harmony export */   MN: () => (/* binding */ P),
/* harmony export */   NT: () => (/* binding */ x),
/* harmony export */   Nf: () => (/* binding */ _),
/* harmony export */   WO: () => (/* binding */ y),
/* harmony export */   Yn: () => (/* binding */ F),
/* harmony export */   hb: () => (/* binding */ q),
/* harmony export */   li: () => (/* binding */ A),
/* harmony export */   vJ: () => (/* binding */ h)
/* harmony export */ });
/* unused harmony export useErrorBoundary */
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(96445);
var t,r,u,i,o=0,f=[],c=preact__WEBPACK_IMPORTED_MODULE_0__/* .options */ .fF,e=c.__b,a=c.__r,v=c.diffed,l=c.__c,m=c.unmount,p=c.__;function s(n,t){c.__h&&c.__h(r,n,o||t),o=0;var u=r.__H||(r.__H={__:[],__h:[]});return n>=u.__.length&&u.__.push({}),u.__[n]}function d(n){return o=1,y(D,n)}function y(n,u,i){var o=s(t++,2);if(o.t=n,!o.__c&&(o.__=[i?i(u):D(void 0,u),function(n){var t=o.__N?o.__N[0]:o.__[0],r=o.t(t,n);t!==r&&(o.__N=[r,o.__[1]],o.__c.setState({}))}],o.__c=r,!r.__f)){var f=function(n,t,r){if(!o.__c.__H)return!0;var u=!1,i=o.__c.props!==n;if(o.__c.__H.__.some(function(n){if(n.__N){u=!0;var t=n.__[0];n.__=n.__N,n.__N=void 0,t!==n.__[0]&&(i=!0)}}),c){var f=c.call(this,n,t,r);return u?f||i:f}return!u||i};r.__f=!0;var c=r.shouldComponentUpdate,e=r.componentWillUpdate;r.componentWillUpdate=function(n,t,r){if(this.__e){var u=c;c=void 0,f(n,t,r),c=u}e&&e.call(this,n,t,r)},r.shouldComponentUpdate=f}return o.__N||o.__}function h(n,u){var i=s(t++,3);!c.__s&&C(i.__H,u)&&(i.__=n,i.u=u,r.__H.__h.push(i))}function _(n,u){var i=s(t++,4);!c.__s&&C(i.__H,u)&&(i.__=n,i.u=u,r.__h.push(i))}function A(n){return o=5,T(function(){return{current:n}},[])}function F(n,t,r){o=6,_(function(){if("function"==typeof n){var r=n(t());return function(){n(null),r&&"function"==typeof r&&r()}}if(n)return n.current=t(),function(){return n.current=null}},null==r?r:r.concat(n))}function T(n,r){var u=s(t++,7);return C(u.__H,r)&&(u.__=n(),u.__H=r,u.__h=n),u.__}function q(n,t){return o=8,T(function(){return n},t)}function x(n){var u=r.context[n.__c],i=s(t++,9);return i.c=n,u?(null==i.__&&(i.__=!0,u.sub(r)),u.props.value):n.__}function P(n,t){c.useDebugValue&&c.useDebugValue(t?t(n):n)}function b(n){var u=s(t++,10),i=d();return u.__=n,r.componentDidCatch||(r.componentDidCatch=function(n,t){u.__&&u.__(n,t),i[1](n)}),[i[0],function(){i[1](void 0)}]}function g(){var n=s(t++,11);if(!n.__){for(var u=r.__v;null!==u&&!u.__m&&null!==u.__;)u=u.__;var i=u.__m||(u.__m=[0,0]);n.__="P"+i[0]+"-"+i[1]++}return n.__}function j(){for(var n;n=f.shift();){var t=n.__H;if(n.__P&&t)try{t.__h.some(z),t.__h.some(B),t.__h=[]}catch(r){t.__h=[],c.__e(r,n.__v)}}}c.__b=function(n){r=null,e&&e(n)},c.__=function(n,t){n&&t.__k&&t.__k.__m&&(n.__m=t.__k.__m),p&&p(n,t)},c.__r=function(n){a&&a(n),t=0;var i=(r=n.__c).__H;i&&(u===r?(i.__h=[],r.__h=[],i.__.some(function(n){n.__N&&(n.__=n.__N),n.u=n.__N=void 0})):(i.__h.some(z),i.__h.some(B),i.__h=[],t=0)),u=r},c.diffed=function(n){v&&v(n);var t=n.__c;t&&t.__H&&(t.__H.__h.length&&(1!==f.push(t)&&i===c.requestAnimationFrame||((i=c.requestAnimationFrame)||w)(j)),t.__H.__.some(function(n){n.u&&(n.__H=n.u,n.u=void 0)})),u=r=null},c.__c=function(n,t){t.some(function(n){try{n.__h.some(z),n.__h=n.__h.filter(function(n){return!n.__||B(n)})}catch(r){t.some(function(n){n.__h&&(n.__h=[])}),t=[],c.__e(r,n.__v)}}),l&&l(n,t)},c.unmount=function(n){m&&m(n);var t,r=n.__c;r&&r.__H&&(r.__H.__.some(function(n){try{z(n)}catch(n){t=n}}),r.__H=void 0,t&&c.__e(t,r.__v))};var k="function"==typeof requestAnimationFrame;function w(n){var t,r=function(){clearTimeout(u),k&&cancelAnimationFrame(t),setTimeout(n)},u=setTimeout(r,35);k&&(t=requestAnimationFrame(r))}function z(n){var t=r,u=n.__c;"function"==typeof u&&(n.__c=void 0,u()),r=t}function B(n){var t=r;n.__c=n.__(),r=t}function C(n,t){return!n||n.length!==t.length||t.some(function(t,r){return t!==n[r]})}function D(n,t){return"function"==typeof t?t(n):t}


/***/ }),

/***/ 93748:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FD: () => (/* binding */ u),
/* harmony export */   FK: () => (/* reexport safe */ preact__WEBPACK_IMPORTED_MODULE_0__.FK),
/* harmony export */   Y: () => (/* binding */ u)
/* harmony export */ });
/* unused harmony exports jsxAttr, jsxDEV, jsxEscape, jsxTemplate */
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(96445);
var t=/["&<]/;function n(r){if(0===r.length||!1===t.test(r))return r;for(var e=0,n=0,o="",f="";n<r.length;n++){switch(r.charCodeAt(n)){case 34:f="&quot;";break;case 38:f="&amp;";break;case 60:f="&lt;";break;default:continue}n!==e&&(o+=r.slice(e,n)),o+=f,e=n+1}return n!==e&&(o+=r.slice(e,n)),o}var o=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,f=0,i=Array.isArray;function u(e,t,n,o,i,u){t||(t={});var a,c,p=t;if("ref"in p)for(c in p={},t)"ref"==c?a=t[c]:p[c]=t[c];var l={type:e,props:p,key:n,ref:a,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--f,__i:-1,__u:0,__source:i,__self:u};if("function"==typeof e&&(a=e.defaultProps))for(c in a)void 0===p[c]&&(p[c]=a[c]);return preact__WEBPACK_IMPORTED_MODULE_0__/* .options */ .fF.vnode&&preact__WEBPACK_IMPORTED_MODULE_0__/* .options */ .fF.vnode(l),l}function a(r){var t=u(e,{tpl:r,exprs:[].slice.call(arguments,1)});return t.key=t.__v,t}var c={},p=/[A-Z]/g;function l(e,t){if(r.attr){var f=r.attr(e,t);if("string"==typeof f)return f}if(t=function(r){return null!==r&&"object"==typeof r&&"function"==typeof r.valueOf?r.valueOf():r}(t),"ref"===e||"key"===e)return"";if("style"===e&&"object"==typeof t){var i="";for(var u in t){var a=t[u];if(null!=a&&""!==a){var l="-"==u[0]?u:c[u]||(c[u]=u.replace(p,"-$&").toLowerCase()),s=";";"number"!=typeof a||l.startsWith("--")||o.test(l)||(s="px;"),i=i+l+":"+a+s}}return e+'="'+n(i)+'"'}return null==t||!1===t||"function"==typeof t||"object"==typeof t?"":!0===t?e:e+'="'+n(""+t)+'"'}function s(r){if(null==r||"boolean"==typeof r||"function"==typeof r)return null;if("object"==typeof r){if(void 0===r.constructor)return r;if(i(r)){for(var e=0;e<r.length;e++)r[e]=s(r[e]);return r}}return n(""+r)}


/***/ }),

/***/ 93887:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/////////////////////////////////////////////////////////////////////////////////
/* UAParser.js v1.0.36
   Copyright © 2012-2021 Faisal Salman <f@faisalman.com>
   MIT License *//*
   Detect Browser, Engine, OS, CPU, and Device type/model from User-Agent data.
   Supports browser & node.js environment. 
   Demo   : https://faisalman.github.io/ua-parser-js
   Source : https://github.com/faisalman/ua-parser-js */
/////////////////////////////////////////////////////////////////////////////////

(function (window, undefined) {

    'use strict';

    //////////////
    // Constants
    /////////////


    var LIBVERSION  = '1.0.36',
        EMPTY       = '',
        UNKNOWN     = '?',
        FUNC_TYPE   = 'function',
        UNDEF_TYPE  = 'undefined',
        OBJ_TYPE    = 'object',
        STR_TYPE    = 'string',
        MAJOR       = 'major',
        MODEL       = 'model',
        NAME        = 'name',
        TYPE        = 'type',
        VENDOR      = 'vendor',
        VERSION     = 'version',
        ARCHITECTURE= 'architecture',
        CONSOLE     = 'console',
        MOBILE      = 'mobile',
        TABLET      = 'tablet',
        SMARTTV     = 'smarttv',
        WEARABLE    = 'wearable',
        EMBEDDED    = 'embedded',
        UA_MAX_LENGTH = 350;

    var AMAZON  = 'Amazon',
        APPLE   = 'Apple',
        ASUS    = 'ASUS',
        BLACKBERRY = 'BlackBerry',
        BROWSER = 'Browser',
        CHROME  = 'Chrome',
        EDGE    = 'Edge',
        FIREFOX = 'Firefox',
        GOOGLE  = 'Google',
        HUAWEI  = 'Huawei',
        LG      = 'LG',
        MICROSOFT = 'Microsoft',
        MOTOROLA  = 'Motorola',
        OPERA   = 'Opera',
        SAMSUNG = 'Samsung',
        SHARP   = 'Sharp',
        SONY    = 'Sony',
        VIERA   = 'Viera',
        XIAOMI  = 'Xiaomi',
        ZEBRA   = 'Zebra',
        FACEBOOK    = 'Facebook',
        CHROMIUM_OS = 'Chromium OS',
        MAC_OS  = 'Mac OS';

    ///////////
    // Helper
    //////////

    var extend = function (regexes, extensions) {
            var mergedRegexes = {};
            for (var i in regexes) {
                if (extensions[i] && extensions[i].length % 2 === 0) {
                    mergedRegexes[i] = extensions[i].concat(regexes[i]);
                } else {
                    mergedRegexes[i] = regexes[i];
                }
            }
            return mergedRegexes;
        },
        enumerize = function (arr) {
            var enums = {};
            for (var i=0; i<arr.length; i++) {
                enums[arr[i].toUpperCase()] = arr[i];
            }
            return enums;
        },
        has = function (str1, str2) {
            return typeof str1 === STR_TYPE ? lowerize(str2).indexOf(lowerize(str1)) !== -1 : false;
        },
        lowerize = function (str) {
            return str.toLowerCase();
        },
        majorize = function (version) {
            return typeof(version) === STR_TYPE ? version.replace(/[^\d\.]/g, EMPTY).split('.')[0] : undefined;
        },
        trim = function (str, len) {
            if (typeof(str) === STR_TYPE) {
                str = str.replace(/^\s\s*/, EMPTY);
                return typeof(len) === UNDEF_TYPE ? str : str.substring(0, UA_MAX_LENGTH);
            }
    };

    ///////////////
    // Map helper
    //////////////

    var rgxMapper = function (ua, arrays) {

            var i = 0, j, k, p, q, matches, match;

            // loop through all regexes maps
            while (i < arrays.length && !matches) {

                var regex = arrays[i],       // even sequence (0,2,4,..)
                    props = arrays[i + 1];   // odd sequence (1,3,5,..)
                j = k = 0;

                // try matching uastring with regexes
                while (j < regex.length && !matches) {

                    if (!regex[j]) { break; }
                    matches = regex[j++].exec(ua);

                    if (!!matches) {
                        for (p = 0; p < props.length; p++) {
                            match = matches[++k];
                            q = props[p];
                            // check if given property is actually array
                            if (typeof q === OBJ_TYPE && q.length > 0) {
                                if (q.length === 2) {
                                    if (typeof q[1] == FUNC_TYPE) {
                                        // assign modified match
                                        this[q[0]] = q[1].call(this, match);
                                    } else {
                                        // assign given value, ignore regex match
                                        this[q[0]] = q[1];
                                    }
                                } else if (q.length === 3) {
                                    // check whether function or regex
                                    if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                                        // call function (usually string mapper)
                                        this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
                                    } else {
                                        // sanitize match using given regex
                                        this[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                                    }
                                } else if (q.length === 4) {
                                        this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
                                }
                            } else {
                                this[q] = match ? match : undefined;
                            }
                        }
                    }
                }
                i += 2;
            }
        },

        strMapper = function (str, map) {

            for (var i in map) {
                // check if current value is array
                if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
                    for (var j = 0; j < map[i].length; j++) {
                        if (has(map[i][j], str)) {
                            return (i === UNKNOWN) ? undefined : i;
                        }
                    }
                } else if (has(map[i], str)) {
                    return (i === UNKNOWN) ? undefined : i;
                }
            }
            return str;
    };

    ///////////////
    // String map
    //////////////

    // Safari < 3.0
    var oldSafariMap = {
            '1.0'   : '/8',
            '1.2'   : '/1',
            '1.3'   : '/3',
            '2.0'   : '/412',
            '2.0.2' : '/416',
            '2.0.3' : '/417',
            '2.0.4' : '/419',
            '?'     : '/'
        },
        windowsVersionMap = {
            'ME'        : '4.90',
            'NT 3.11'   : 'NT3.51',
            'NT 4.0'    : 'NT4.0',
            '2000'      : 'NT 5.0',
            'XP'        : ['NT 5.1', 'NT 5.2'],
            'Vista'     : 'NT 6.0',
            '7'         : 'NT 6.1',
            '8'         : 'NT 6.2',
            '8.1'       : 'NT 6.3',
            '10'        : ['NT 6.4', 'NT 10.0'],
            'RT'        : 'ARM'
    };

    //////////////
    // Regex map
    /////////////

    var regexes = {

        browser : [[

            /\b(?:crmo|crios)\/([\w\.]+)/i                                      // Chrome for Android/iOS
            ], [VERSION, [NAME, 'Chrome']], [
            /edg(?:e|ios|a)?\/([\w\.]+)/i                                       // Microsoft Edge
            ], [VERSION, [NAME, 'Edge']], [

            // Presto based
            /(opera mini)\/([-\w\.]+)/i,                                        // Opera Mini
            /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,                 // Opera Mobi/Tablet
            /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i                           // Opera
            ], [NAME, VERSION], [
            /opios[\/ ]+([\w\.]+)/i                                             // Opera mini on iphone >= 8.0
            ], [VERSION, [NAME, OPERA+' Mini']], [
            /\bopr\/([\w\.]+)/i                                                 // Opera Webkit
            ], [VERSION, [NAME, OPERA]], [

            // Mixed
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,      // Lunascape/Maxthon/Netfront/Jasmine/Blazer
            // Trident based
            /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i,               // Avant/IEMobile/SlimBrowser
            /(ba?idubrowser)[\/ ]?([\w\.]+)/i,                                  // Baidu Browser
            /(?:ms|\()(ie) ([\w\.]+)/i,                                         // Internet Explorer

            // Webkit/KHTML based                                               // Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
            /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i,
                                                                                // Rekonq/Puffin/Brave/Whale/QQBrowserLite/QQ, aka ShouQ
            /(heytap|ovi)browser\/([\d\.]+)/i,                                  // Heytap/Ovi
            /(weibo)__([\d\.]+)/i                                               // Weibo
            ], [NAME, VERSION], [
            /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i                 // UCBrowser
            ], [VERSION, [NAME, 'UC'+BROWSER]], [
            /microm.+\bqbcore\/([\w\.]+)/i,                                     // WeChat Desktop for Windows Built-in Browser
            /\bqbcore\/([\w\.]+).+microm/i
            ], [VERSION, [NAME, 'WeChat(Win) Desktop']], [
            /micromessenger\/([\w\.]+)/i                                        // WeChat
            ], [VERSION, [NAME, 'WeChat']], [
            /konqueror\/([\w\.]+)/i                                             // Konqueror
            ], [VERSION, [NAME, 'Konqueror']], [
            /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i                       // IE11
            ], [VERSION, [NAME, 'IE']], [
            /ya(?:search)?browser\/([\w\.]+)/i                                  // Yandex
            ], [VERSION, [NAME, 'Yandex']], [
            /(avast|avg)\/([\w\.]+)/i                                           // Avast/AVG Secure Browser
            ], [[NAME, /(.+)/, '$1 Secure '+BROWSER], VERSION], [
            /\bfocus\/([\w\.]+)/i                                               // Firefox Focus
            ], [VERSION, [NAME, FIREFOX+' Focus']], [
            /\bopt\/([\w\.]+)/i                                                 // Opera Touch
            ], [VERSION, [NAME, OPERA+' Touch']], [
            /coc_coc\w+\/([\w\.]+)/i                                            // Coc Coc Browser
            ], [VERSION, [NAME, 'Coc Coc']], [
            /dolfin\/([\w\.]+)/i                                                // Dolphin
            ], [VERSION, [NAME, 'Dolphin']], [
            /coast\/([\w\.]+)/i                                                 // Opera Coast
            ], [VERSION, [NAME, OPERA+' Coast']], [
            /miuibrowser\/([\w\.]+)/i                                           // MIUI Browser
            ], [VERSION, [NAME, 'MIUI '+BROWSER]], [
            /fxios\/([-\w\.]+)/i                                                // Firefox for iOS
            ], [VERSION, [NAME, FIREFOX]], [
            /\bqihu|(qi?ho?o?|360)browser/i                                     // 360
            ], [[NAME, '360 '+BROWSER]], [
            /(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i
            ], [[NAME, /(.+)/, '$1 '+BROWSER], VERSION], [                      // Oculus/Samsung/Sailfish/Huawei Browser
            /(comodo_dragon)\/([\w\.]+)/i                                       // Comodo Dragon
            ], [[NAME, /_/g, ' '], VERSION], [
            /(electron)\/([\w\.]+) safari/i,                                    // Electron-based App
            /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,                   // Tesla
            /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i            // QQBrowser/Baidu App/2345 Browser
            ], [NAME, VERSION], [
            /(metasr)[\/ ]?([\w\.]+)/i,                                         // SouGouBrowser
            /(lbbrowser)/i,                                                     // LieBao Browser
            /\[(linkedin)app\]/i                                                // LinkedIn App for iOS & Android
            ], [NAME], [

            // WebView
            /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i       // Facebook App for iOS & Android
            ], [[NAME, FACEBOOK], VERSION], [
            /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,                             // Kakao App
            /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,                                  // Naver InApp
            /safari (line)\/([\w\.]+)/i,                                        // Line App for iOS
            /\b(line)\/([\w\.]+)\/iab/i,                                        // Line App for Android
            /(chromium|instagram|snapchat)[\/ ]([-\w\.]+)/i                     // Chromium/Instagram/Snapchat
            ], [NAME, VERSION], [
            /\bgsa\/([\w\.]+) .*safari\//i                                      // Google Search Appliance on iOS
            ], [VERSION, [NAME, 'GSA']], [
            /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i                        // TikTok
            ], [VERSION, [NAME, 'TikTok']], [

            /headlesschrome(?:\/([\w\.]+)| )/i                                  // Chrome Headless
            ], [VERSION, [NAME, CHROME+' Headless']], [

            / wv\).+(chrome)\/([\w\.]+)/i                                       // Chrome WebView
            ], [[NAME, CHROME+' WebView'], VERSION], [

            /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i           // Android Browser
            ], [VERSION, [NAME, 'Android '+BROWSER]], [

            /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i       // Chrome/OmniWeb/Arora/Tizen/Nokia
            ], [NAME, VERSION], [

            /version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i                      // Mobile Safari
            ], [VERSION, [NAME, 'Mobile Safari']], [
            /version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i                // Safari & Safari Mobile
            ], [VERSION, NAME], [
            /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i                      // Safari < 3.0
            ], [NAME, [VERSION, strMapper, oldSafariMap]], [

            /(webkit|khtml)\/([\w\.]+)/i
            ], [NAME, VERSION], [

            // Gecko based
            /(navigator|netscape\d?)\/([-\w\.]+)/i                              // Netscape
            ], [[NAME, 'Netscape'], VERSION], [
            /mobile vr; rv:([\w\.]+)\).+firefox/i                               // Firefox Reality
            ], [VERSION, [NAME, FIREFOX+' Reality']], [
            /ekiohf.+(flow)\/([\w\.]+)/i,                                       // Flow
            /(swiftfox)/i,                                                      // Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,
                                                                                // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror/Klar
            /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
                                                                                // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(firefox)\/([\w\.]+)/i,                                            // Other Firefox-based
            /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,                         // Mozilla

            // Other
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
                                                                                // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir/Obigo/Mosaic/Go/ICE/UP.Browser
            /(links) \(([\w\.]+)/i,                                             // Links
            /panasonic;(viera)/i                                                // Panasonic Viera
            ], [NAME, VERSION], [
            
            /(cobalt)\/([\w\.]+)/i                                              // Cobalt
            ], [NAME, [VERSION, /master.|lts./, ""]]
        ],

        cpu : [[

            /(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i                     // AMD64 (x64)
            ], [[ARCHITECTURE, 'amd64']], [

            /(ia32(?=;))/i                                                      // IA32 (quicktime)
            ], [[ARCHITECTURE, lowerize]], [

            /((?:i[346]|x)86)[;\)]/i                                            // IA32 (x86)
            ], [[ARCHITECTURE, 'ia32']], [

            /\b(aarch64|arm(v?8e?l?|_?64))\b/i                                 // ARM64
            ], [[ARCHITECTURE, 'arm64']], [

            /\b(arm(?:v[67])?ht?n?[fl]p?)\b/i                                   // ARMHF
            ], [[ARCHITECTURE, 'armhf']], [

            // PocketPC mistakenly identified as PowerPC
            /windows (ce|mobile); ppc;/i
            ], [[ARCHITECTURE, 'arm']], [

            /((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i                            // PowerPC
            ], [[ARCHITECTURE, /ower/, EMPTY, lowerize]], [

            /(sun4\w)[;\)]/i                                                    // SPARC
            ], [[ARCHITECTURE, 'sparc']], [

            /((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i
                                                                                // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
            ], [[ARCHITECTURE, lowerize]]
        ],

        device : [[

            //////////////////////////
            // MOBILES & TABLETS
            /////////////////////////

            // Samsung
            /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, TABLET]], [
            /\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
            /samsung[- ]([-\w]+)/i,
            /sec-(sgh\w+)/i
            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, MOBILE]], [

            // Apple
            /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i                          // iPod/iPhone
            ], [MODEL, [VENDOR, APPLE], [TYPE, MOBILE]], [
            /\((ipad);[-\w\),; ]+apple/i,                                       // iPad
            /applecoremedia\/[\w\.]+ \((ipad)/i,
            /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
            ], [MODEL, [VENDOR, APPLE], [TYPE, TABLET]], [
            /(macintosh);/i
            ], [MODEL, [VENDOR, APPLE]], [

            // Sharp
            /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
            ], [MODEL, [VENDOR, SHARP], [TYPE, MOBILE]], [

            // Huawei
            /\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i
            ], [MODEL, [VENDOR, HUAWEI], [TYPE, TABLET]], [
            /(?:huawei|honor)([-\w ]+)[;\)]/i,
            /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
            ], [MODEL, [VENDOR, HUAWEI], [TYPE, MOBILE]], [

            // Xiaomi
            /\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,                  // Xiaomi POCO
            /\b; (\w+) build\/hm\1/i,                                           // Xiaomi Hongmi 'numeric' models
            /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,                             // Xiaomi Hongmi
            /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,                   // Xiaomi Redmi
            /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i // Xiaomi Mi
            ], [[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, MOBILE]], [
            /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i                        // Mi Pad tablets
            ],[[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, TABLET]], [

            // OPPO
            /; (\w+) bui.+ oppo/i,
            /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
            ], [MODEL, [VENDOR, 'OPPO'], [TYPE, MOBILE]], [

            // Vivo
            /vivo (\w+)(?: bui|\))/i,
            /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
            ], [MODEL, [VENDOR, 'Vivo'], [TYPE, MOBILE]], [

            // Realme
            /\b(rmx[12]\d{3})(?: bui|;|\))/i
            ], [MODEL, [VENDOR, 'Realme'], [TYPE, MOBILE]], [

            // Motorola
            /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
            /\bmot(?:orola)?[- ](\w*)/i,
            /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i
            ], [MODEL, [VENDOR, MOTOROLA], [TYPE, MOBILE]], [
            /\b(mz60\d|xoom[2 ]{0,2}) build\//i
            ], [MODEL, [VENDOR, MOTOROLA], [TYPE, TABLET]], [

            // LG
            /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
            ], [MODEL, [VENDOR, LG], [TYPE, TABLET]], [
            /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
            /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
            /\blg-?([\d\w]+) bui/i
            ], [MODEL, [VENDOR, LG], [TYPE, MOBILE]], [

            // Lenovo
            /(ideatab[-\w ]+)/i,
            /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i
            ], [MODEL, [VENDOR, 'Lenovo'], [TYPE, TABLET]], [

            // Nokia
            /(?:maemo|nokia).*(n900|lumia \d+)/i,
            /nokia[-_ ]?([-\w\.]*)/i
            ], [[MODEL, /_/g, ' '], [VENDOR, 'Nokia'], [TYPE, MOBILE]], [

            // Google
            /(pixel c)\b/i                                                      // Google Pixel C
            ], [MODEL, [VENDOR, GOOGLE], [TYPE, TABLET]], [
            /droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i                         // Google Pixel
            ], [MODEL, [VENDOR, GOOGLE], [TYPE, MOBILE]], [

            // Sony
            /droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
            ], [MODEL, [VENDOR, SONY], [TYPE, MOBILE]], [
            /sony tablet [ps]/i,
            /\b(?:sony)?sgp\w+(?: bui|\))/i
            ], [[MODEL, 'Xperia Tablet'], [VENDOR, SONY], [TYPE, TABLET]], [

            // OnePlus
            / (kb2005|in20[12]5|be20[12][59])\b/i,
            /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
            ], [MODEL, [VENDOR, 'OnePlus'], [TYPE, MOBILE]], [

            // Amazon
            /(alexa)webm/i,
            /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i,                             // Kindle Fire without Silk / Echo Show
            /(kf[a-z]+)( bui|\)).+silk\//i                                      // Kindle Fire HD
            ], [MODEL, [VENDOR, AMAZON], [TYPE, TABLET]], [
            /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i                     // Fire Phone
            ], [[MODEL, /(.+)/g, 'Fire Phone $1'], [VENDOR, AMAZON], [TYPE, MOBILE]], [

            // BlackBerry
            /(playbook);[-\w\),; ]+(rim)/i                                      // BlackBerry PlayBook
            ], [MODEL, VENDOR, [TYPE, TABLET]], [
            /\b((?:bb[a-f]|st[hv])100-\d)/i,
            /\(bb10; (\w+)/i                                                    // BlackBerry 10
            ], [MODEL, [VENDOR, BLACKBERRY], [TYPE, MOBILE]], [

            // Asus
            /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
            ], [MODEL, [VENDOR, ASUS], [TYPE, TABLET]], [
            / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
            ], [MODEL, [VENDOR, ASUS], [TYPE, MOBILE]], [

            // HTC
            /(nexus 9)/i                                                        // HTC Nexus 9
            ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [
            /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,                         // HTC

            // ZTE
            /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
            /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i         // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
            ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [

            // Acer
            /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
            ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [

            // Meizu
            /droid.+; (m[1-5] note) bui/i,
            /\bmz-([-\w]{2,})/i
            ], [MODEL, [VENDOR, 'Meizu'], [TYPE, MOBILE]], [

            // MIXED
            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron|infinix|tecno)[-_ ]?([-\w]*)/i,
                                                                                // BlackBerry/BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
            /(hp) ([\w ]+\w)/i,                                                 // HP iPAQ
            /(asus)-?(\w+)/i,                                                   // Asus
            /(microsoft); (lumia[\w ]+)/i,                                      // Microsoft Lumia
            /(lenovo)[-_ ]?([-\w]+)/i,                                          // Lenovo
            /(jolla)/i,                                                         // Jolla
            /(oppo) ?([\w ]+) bui/i                                             // OPPO
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /(kobo)\s(ereader|touch)/i,                                         // Kobo
            /(archos) (gamepad2?)/i,                                            // Archos
            /(hp).+(touchpad(?!.+tablet)|tablet)/i,                             // HP TouchPad
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(nook)[\w ]+build\/(\w+)/i,                                        // Nook
            /(dell) (strea[kpr\d ]*[\dko])/i,                                   // Dell Streak
            /(le[- ]+pan)[- ]+(\w{1,9}) bui/i,                                  // Le Pan Tablets
            /(trinity)[- ]*(t\d{3}) bui/i,                                      // Trinity Tablets
            /(gigaset)[- ]+(q\w{1,9}) bui/i,                                    // Gigaset Tablets
            /(vodafone) ([\w ]+)(?:\)| bui)/i                                   // Vodafone
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(surface duo)/i                                                    // Surface Duo
            ], [MODEL, [VENDOR, MICROSOFT], [TYPE, TABLET]], [
            /droid [\d\.]+; (fp\du?)(?: b|\))/i                                 // Fairphone
            ], [MODEL, [VENDOR, 'Fairphone'], [TYPE, MOBILE]], [
            /(u304aa)/i                                                         // AT&T
            ], [MODEL, [VENDOR, 'AT&T'], [TYPE, MOBILE]], [
            /\bsie-(\w*)/i                                                      // Siemens
            ], [MODEL, [VENDOR, 'Siemens'], [TYPE, MOBILE]], [
            /\b(rct\w+) b/i                                                     // RCA Tablets
            ], [MODEL, [VENDOR, 'RCA'], [TYPE, TABLET]], [
            /\b(venue[\d ]{2,7}) b/i                                            // Dell Venue Tablets
            ], [MODEL, [VENDOR, 'Dell'], [TYPE, TABLET]], [
            /\b(q(?:mv|ta)\w+) b/i                                              // Verizon Tablet
            ], [MODEL, [VENDOR, 'Verizon'], [TYPE, TABLET]], [
            /\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i                       // Barnes & Noble Tablet
            ], [MODEL, [VENDOR, 'Barnes & Noble'], [TYPE, TABLET]], [
            /\b(tm\d{3}\w+) b/i
            ], [MODEL, [VENDOR, 'NuVision'], [TYPE, TABLET]], [
            /\b(k88) b/i                                                        // ZTE K Series Tablet
            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, TABLET]], [
            /\b(nx\d{3}j) b/i                                                   // ZTE Nubia
            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, MOBILE]], [
            /\b(gen\d{3}) b.+49h/i                                              // Swiss GEN Mobile
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, MOBILE]], [
            /\b(zur\d{3}) b/i                                                   // Swiss ZUR Tablet
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, TABLET]], [
            /\b((zeki)?tb.*\b) b/i                                              // Zeki Tablets
            ], [MODEL, [VENDOR, 'Zeki'], [TYPE, TABLET]], [
            /\b([yr]\d{2}) b/i,
            /\b(dragon[- ]+touch |dt)(\w{5}) b/i                                // Dragon Touch Tablet
            ], [[VENDOR, 'Dragon Touch'], MODEL, [TYPE, TABLET]], [
            /\b(ns-?\w{0,9}) b/i                                                // Insignia Tablets
            ], [MODEL, [VENDOR, 'Insignia'], [TYPE, TABLET]], [
            /\b((nxa|next)-?\w{0,9}) b/i                                        // NextBook Tablets
            ], [MODEL, [VENDOR, 'NextBook'], [TYPE, TABLET]], [
            /\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i                  // Voice Xtreme Phones
            ], [[VENDOR, 'Voice'], MODEL, [TYPE, MOBILE]], [
            /\b(lvtel\-)?(v1[12]) b/i                                           // LvTel Phones
            ], [[VENDOR, 'LvTel'], MODEL, [TYPE, MOBILE]], [
            /\b(ph-1) /i                                                        // Essential PH-1
            ], [MODEL, [VENDOR, 'Essential'], [TYPE, MOBILE]], [
            /\b(v(100md|700na|7011|917g).*\b) b/i                               // Envizen Tablets
            ], [MODEL, [VENDOR, 'Envizen'], [TYPE, TABLET]], [
            /\b(trio[-\w\. ]+) b/i                                              // MachSpeed Tablets
            ], [MODEL, [VENDOR, 'MachSpeed'], [TYPE, TABLET]], [
            /\btu_(1491) b/i                                                    // Rotor Tablets
            ], [MODEL, [VENDOR, 'Rotor'], [TYPE, TABLET]], [
            /(shield[\w ]+) b/i                                                 // Nvidia Shield Tablets
            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, TABLET]], [
            /(sprint) (\w+)/i                                                   // Sprint Phones
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /(kin\.[onetw]{3})/i                                                // Microsoft Kin
            ], [[MODEL, /\./g, ' '], [VENDOR, MICROSOFT], [TYPE, MOBILE]], [
            /droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i             // Zebra
            ], [MODEL, [VENDOR, ZEBRA], [TYPE, TABLET]], [
            /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
            ], [MODEL, [VENDOR, ZEBRA], [TYPE, MOBILE]], [

            ///////////////////
            // SMARTTVS
            ///////////////////

            /smart-tv.+(samsung)/i                                              // Samsung
            ], [VENDOR, [TYPE, SMARTTV]], [
            /hbbtv.+maple;(\d+)/i
            ], [[MODEL, /^/, 'SmartTV'], [VENDOR, SAMSUNG], [TYPE, SMARTTV]], [
            /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i        // LG SmartTV
            ], [[VENDOR, LG], [TYPE, SMARTTV]], [
            /(apple) ?tv/i                                                      // Apple TV
            ], [VENDOR, [MODEL, APPLE+' TV'], [TYPE, SMARTTV]], [
            /crkey/i                                                            // Google Chromecast
            ], [[MODEL, CHROME+'cast'], [VENDOR, GOOGLE], [TYPE, SMARTTV]], [
            /droid.+aft(\w+)( bui|\))/i                                         // Fire TV
            ], [MODEL, [VENDOR, AMAZON], [TYPE, SMARTTV]], [
            /\(dtv[\);].+(aquos)/i,
            /(aquos-tv[\w ]+)\)/i                                               // Sharp
            ], [MODEL, [VENDOR, SHARP], [TYPE, SMARTTV]],[
            /(bravia[\w ]+)( bui|\))/i                                              // Sony
            ], [MODEL, [VENDOR, SONY], [TYPE, SMARTTV]], [
            /(mitv-\w{5}) bui/i                                                 // Xiaomi
            ], [MODEL, [VENDOR, XIAOMI], [TYPE, SMARTTV]], [
            /Hbbtv.*(technisat) (.*);/i                                         // TechniSAT
            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [
            /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,                          // Roku
            /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i         // HbbTV devices
            ], [[VENDOR, trim], [MODEL, trim], [TYPE, SMARTTV]], [
            /\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i                   // SmartTV from Unidentified Vendors
            ], [[TYPE, SMARTTV]], [

            ///////////////////
            // CONSOLES
            ///////////////////

            /(ouya)/i,                                                          // Ouya
            /(nintendo) ([wids3utch]+)/i                                        // Nintendo
            ], [VENDOR, MODEL, [TYPE, CONSOLE]], [
            /droid.+; (shield) bui/i                                            // Nvidia
            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, CONSOLE]], [
            /(playstation [345portablevi]+)/i                                   // Playstation
            ], [MODEL, [VENDOR, SONY], [TYPE, CONSOLE]], [
            /\b(xbox(?: one)?(?!; xbox))[\); ]/i                                // Microsoft Xbox
            ], [MODEL, [VENDOR, MICROSOFT], [TYPE, CONSOLE]], [

            ///////////////////
            // WEARABLES
            ///////////////////

            /((pebble))app/i                                                    // Pebble
            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [
            /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i                              // Apple Watch
            ], [MODEL, [VENDOR, APPLE], [TYPE, WEARABLE]], [
            /droid.+; (glass) \d/i                                              // Google Glass
            ], [MODEL, [VENDOR, GOOGLE], [TYPE, WEARABLE]], [
            /droid.+; (wt63?0{2,3})\)/i
            ], [MODEL, [VENDOR, ZEBRA], [TYPE, WEARABLE]], [
            /(quest( 2| pro)?)/i                                                // Oculus Quest
            ], [MODEL, [VENDOR, FACEBOOK], [TYPE, WEARABLE]], [

            ///////////////////
            // EMBEDDED
            ///////////////////

            /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i                              // Tesla
            ], [VENDOR, [TYPE, EMBEDDED]], [
            /(aeobc)\b/i                                                        // Echo Dot
            ], [MODEL, [VENDOR, AMAZON], [TYPE, EMBEDDED]], [

            ////////////////////
            // MIXED (GENERIC)
            ///////////////////

            /droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i           // Android Phones from Unidentified Vendors
            ], [MODEL, [TYPE, MOBILE]], [
            /droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i       // Android Tablets from Unidentified Vendors
            ], [MODEL, [TYPE, TABLET]], [
            /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i                      // Unidentifiable Tablet
            ], [[TYPE, TABLET]], [
            /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i    // Unidentifiable Mobile
            ], [[TYPE, MOBILE]], [
            /(android[-\w\. ]{0,9});.+buil/i                                    // Generic Android Device
            ], [MODEL, [VENDOR, 'Generic']]
        ],

        engine : [[

            /windows.+ edge\/([\w\.]+)/i                                       // EdgeHTML
            ], [VERSION, [NAME, EDGE+'HTML']], [

            /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i                         // Blink
            ], [VERSION, [NAME, 'Blink']], [

            /(presto)\/([\w\.]+)/i,                                             // Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna
            /ekioh(flow)\/([\w\.]+)/i,                                          // Flow
            /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,                           // KHTML/Tasman/Links
            /(icab)[\/ ]([23]\.[\d\.]+)/i,                                      // iCab
            /\b(libweb)/i
            ], [NAME, VERSION], [

            /rv\:([\w\.]{1,9})\b.+(gecko)/i                                     // Gecko
            ], [VERSION, NAME]
        ],

        os : [[

            // Windows
            /microsoft (windows) (vista|xp)/i                                   // Windows (iTunes)
            ], [NAME, VERSION], [
            /(windows) nt 6\.2; (arm)/i,                                        // Windows RT
            /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i,            // Windows Phone
            /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i
            ], [NAME, [VERSION, strMapper, windowsVersionMap]], [
            /(win(?=3|9|n)|win 9x )([nt\d\.]+)/i
            ], [[NAME, 'Windows'], [VERSION, strMapper, windowsVersionMap]], [

            // iOS/macOS
            /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,              // iOS
            /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
            /cfnetwork\/.+darwin/i
            ], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [
            /(mac os x) ?([\w\. ]*)/i,
            /(macintosh|mac_powerpc\b)(?!.+haiku)/i                             // Mac OS
            ], [[NAME, MAC_OS], [VERSION, /_/g, '.']], [

            // Mobile OSes
            /droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i                    // Android-x86/HarmonyOS
            ], [VERSION, NAME], [                                               // Android/WebOS/QNX/Bada/RIM/Maemo/MeeGo/Sailfish OS
            /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,
            /(blackberry)\w*\/([\w\.]*)/i,                                      // Blackberry
            /(tizen|kaios)[\/ ]([\w\.]+)/i,                                     // Tizen/KaiOS
            /\((series40);/i                                                    // Series 40
            ], [NAME, VERSION], [
            /\(bb(10);/i                                                        // BlackBerry 10
            ], [VERSION, [NAME, BLACKBERRY]], [
            /(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i         // Symbian
            ], [VERSION, [NAME, 'Symbian']], [
            /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i // Firefox OS
            ], [VERSION, [NAME, FIREFOX+' OS']], [
            /web0s;.+rt(tv)/i,
            /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i                              // WebOS
            ], [VERSION, [NAME, 'webOS']], [
            /watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i                              // watchOS
            ], [VERSION, [NAME, 'watchOS']], [

            // Google Chromecast
            /crkey\/([\d\.]+)/i                                                 // Google Chromecast
            ], [VERSION, [NAME, CHROME+'cast']], [
            /(cros) [\w]+(?:\)| ([\w\.]+)\b)/i                                  // Chromium OS
            ], [[NAME, CHROMIUM_OS], VERSION],[

            // Smart TVs
            /panasonic;(viera)/i,                                               // Panasonic Viera
            /(netrange)mmh/i,                                                   // Netrange
            /(nettv)\/(\d+\.[\w\.]+)/i,                                         // NetTV

            // Console
            /(nintendo|playstation) ([wids345portablevuch]+)/i,                 // Nintendo/Playstation
            /(xbox); +xbox ([^\);]+)/i,                                         // Microsoft Xbox (360, One, X, S, Series X, Series S)

            // Other
            /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,                            // Joli/Palm
            /(mint)[\/\(\) ]?(\w*)/i,                                           // Mint
            /(mageia|vectorlinux)[; ]/i,                                        // Mageia/VectorLinux
            /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
                                                                                // Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware/Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus/Raspbian/Plan9/Minix/RISCOS/Contiki/Deepin/Manjaro/elementary/Sabayon/Linspire
            /(hurd|linux) ?([\w\.]*)/i,                                         // Hurd/Linux
            /(gnu) ?([\w\.]*)/i,                                                // GNU
            /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, // FreeBSD/NetBSD/OpenBSD/PC-BSD/GhostBSD/DragonFly
            /(haiku) (\w+)/i                                                    // Haiku
            ], [NAME, VERSION], [
            /(sunos) ?([\w\.\d]*)/i                                             // Solaris
            ], [[NAME, 'Solaris'], VERSION], [
            /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,                              // Solaris
            /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,                                  // AIX
            /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, // BeOS/OS2/AmigaOS/MorphOS/OpenVMS/Fuchsia/HP-UX/SerenityOS
            /(unix) ?([\w\.]*)/i                                                // UNIX
            ], [NAME, VERSION]
        ]
    };

    /////////////////
    // Constructor
    ////////////////

    var UAParser = function (ua, extensions) {

        if (typeof ua === OBJ_TYPE) {
            extensions = ua;
            ua = undefined;
        }

        if (!(this instanceof UAParser)) {
            return new UAParser(ua, extensions).getResult();
        }

        var _navigator = (typeof window !== UNDEF_TYPE && window.navigator) ? window.navigator : undefined;
        var _ua = ua || ((_navigator && _navigator.userAgent) ? _navigator.userAgent : EMPTY);
        var _uach = (_navigator && _navigator.userAgentData) ? _navigator.userAgentData : undefined;
        var _rgxmap = extensions ? extend(regexes, extensions) : regexes;
        var _isSelfNav = _navigator && _navigator.userAgent == _ua;

        this.getBrowser = function () {
            var _browser = {};
            _browser[NAME] = undefined;
            _browser[VERSION] = undefined;
            rgxMapper.call(_browser, _ua, _rgxmap.browser);
            _browser[MAJOR] = majorize(_browser[VERSION]);
            // Brave-specific detection
            if (_isSelfNav && _navigator && _navigator.brave && typeof _navigator.brave.isBrave == FUNC_TYPE) {
                _browser[NAME] = 'Brave';
            }
            return _browser;
        };
        this.getCPU = function () {
            var _cpu = {};
            _cpu[ARCHITECTURE] = undefined;
            rgxMapper.call(_cpu, _ua, _rgxmap.cpu);
            return _cpu;
        };
        this.getDevice = function () {
            var _device = {};
            _device[VENDOR] = undefined;
            _device[MODEL] = undefined;
            _device[TYPE] = undefined;
            rgxMapper.call(_device, _ua, _rgxmap.device);
            if (_isSelfNav && !_device[TYPE] && _uach && _uach.mobile) {
                _device[TYPE] = MOBILE;
            }
            // iPadOS-specific detection: identified as Mac, but has some iOS-only properties
            if (_isSelfNav && _device[MODEL] == 'Macintosh' && _navigator && typeof _navigator.standalone !== UNDEF_TYPE && _navigator.maxTouchPoints && _navigator.maxTouchPoints > 2) {
                _device[MODEL] = 'iPad';
                _device[TYPE] = TABLET;
            }
            return _device;
        };
        this.getEngine = function () {
            var _engine = {};
            _engine[NAME] = undefined;
            _engine[VERSION] = undefined;
            rgxMapper.call(_engine, _ua, _rgxmap.engine);
            return _engine;
        };
        this.getOS = function () {
            var _os = {};
            _os[NAME] = undefined;
            _os[VERSION] = undefined;
            rgxMapper.call(_os, _ua, _rgxmap.os);
            if (_isSelfNav && !_os[NAME] && _uach && _uach.platform != 'Unknown') {
                _os[NAME] = _uach.platform  
                                    .replace(/chrome os/i, CHROMIUM_OS)
                                    .replace(/macos/i, MAC_OS);           // backward compatibility
            }
            return _os;
        };
        this.getResult = function () {
            return {
                ua      : this.getUA(),
                browser : this.getBrowser(),
                engine  : this.getEngine(),
                os      : this.getOS(),
                device  : this.getDevice(),
                cpu     : this.getCPU()
            };
        };
        this.getUA = function () {
            return _ua;
        };
        this.setUA = function (ua) {
            _ua = (typeof ua === STR_TYPE && ua.length > UA_MAX_LENGTH) ? trim(ua, UA_MAX_LENGTH) : ua;
            return this;
        };
        this.setUA(_ua);
        return this;
    };

    UAParser.VERSION = LIBVERSION;
    UAParser.BROWSER =  enumerize([NAME, VERSION, MAJOR]);
    UAParser.CPU = enumerize([ARCHITECTURE]);
    UAParser.DEVICE = enumerize([MODEL, VENDOR, TYPE, CONSOLE, MOBILE, SMARTTV, TABLET, WEARABLE, EMBEDDED]);
    UAParser.ENGINE = UAParser.OS = enumerize([NAME, VERSION]);

    ///////////
    // Export
    //////////

    // check js environment
    if (typeof(exports) !== UNDEF_TYPE) {
        // nodejs env
        if ("object" !== UNDEF_TYPE && module.exports) {
            exports = module.exports = UAParser;
        }
        exports.UAParser = UAParser;
    } else {
        // requirejs env (optional)
        if ("function" === FUNC_TYPE && __webpack_require__.amdO) {
            !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
                return UAParser;
            }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        } else if (typeof window !== UNDEF_TYPE) {
            // browser env
            window.UAParser = UAParser;
        }
    }

    // jQuery/Zepto specific (optional)
    // Note:
    //   In AMD env the global scope should be kept clean, but jQuery is an exception.
    //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
    //   and we should catch that.
    var $ = typeof window !== UNDEF_TYPE && (window.jQuery || window.Zepto);
    if ($ && !$.ua) {
        var parser = new UAParser();
        $.ua = parser.getResult();
        $.ua.get = function () {
            return parser.getUA();
        };
        $.ua.set = function (ua) {
            parser.setUA(ua);
            var result = parser.getResult();
            for (var prop in result) {
                $.ua[prop] = result[prop];
            }
        };
    }

})(typeof window === 'object' ? window : this);


/***/ }),

/***/ 61934:
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (module) {
  /* webextension-polyfill - v0.12.0 - Tue May 14 2024 18:01:29 */
  /* -*- Mode: indent-tabs-mode: nil; js-indent-level: 2 -*- */
  /* vim: set sts=2 sw=2 et tw=80: */
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  "use strict";

  if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id)) {
    throw new Error("This script should only be loaded in a browser extension.");
  }
  if (!(globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)) {
    const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";

    // Wrapping the bulk of this polyfill in a one-time-use function is a minor
    // optimization for Firefox. Since Spidermonkey does not fully parse the
    // contents of a function until the first time it's called, and since it will
    // never actually need to be called, this allows the polyfill to be included
    // in Firefox nearly for free.
    const wrapAPIs = extensionAPIs => {
      // NOTE: apiMetadata is associated to the content of the api-metadata.json file
      // at build time by replacing the following "include" with the content of the
      // JSON file.
      const apiMetadata = {
        "alarms": {
          "clear": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "clearAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "get": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "bookmarks": {
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getChildren": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getRecent": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getSubTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTree": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "browserAction": {
          "disable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "enable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "getBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getBadgeText": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "openPopup": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setBadgeText": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "browsingData": {
          "remove": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "removeCache": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCookies": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeDownloads": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFormData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeHistory": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeLocalStorage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePasswords": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePluginData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "settings": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "commands": {
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "contextMenus": {
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "cookies": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAllCookieStores": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "set": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "devtools": {
          "inspectedWindow": {
            "eval": {
              "minArgs": 1,
              "maxArgs": 2,
              "singleCallbackArg": false
            }
          },
          "panels": {
            "create": {
              "minArgs": 3,
              "maxArgs": 3,
              "singleCallbackArg": true
            },
            "elements": {
              "createSidebarPane": {
                "minArgs": 1,
                "maxArgs": 1
              }
            }
          }
        },
        "downloads": {
          "cancel": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "download": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "erase": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFileIcon": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "open": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "pause": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFile": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "resume": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "extension": {
          "isAllowedFileSchemeAccess": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "isAllowedIncognitoAccess": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "history": {
          "addUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "deleteRange": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getVisits": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "i18n": {
          "detectLanguage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAcceptLanguages": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "identity": {
          "launchWebAuthFlow": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "idle": {
          "queryState": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "management": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getSelf": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setEnabled": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "uninstallSelf": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "notifications": {
          "clear": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPermissionLevel": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "pageAction": {
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "hide": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "permissions": {
          "contains": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "request": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "runtime": {
          "getBackgroundPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPlatformInfo": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "openOptionsPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "requestUpdateCheck": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "sendMessage": {
            "minArgs": 1,
            "maxArgs": 3
          },
          "sendNativeMessage": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "setUninstallURL": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "sessions": {
          "getDevices": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getRecentlyClosed": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "restore": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "storage": {
          "local": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          },
          "managed": {
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            }
          },
          "sync": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          }
        },
        "tabs": {
          "captureVisibleTab": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "detectLanguage": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "discard": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "duplicate": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "executeScript": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getZoom": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getZoomSettings": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goBack": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goForward": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "highlight": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "insertCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "query": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "reload": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "sendMessage": {
            "minArgs": 2,
            "maxArgs": 3
          },
          "setZoom": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "setZoomSettings": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "update": {
            "minArgs": 1,
            "maxArgs": 2
          }
        },
        "topSites": {
          "get": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "webNavigation": {
          "getAllFrames": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFrame": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "webRequest": {
          "handlerBehaviorChanged": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "windows": {
          "create": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getLastFocused": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        }
      };
      if (Object.keys(apiMetadata).length === 0) {
        throw new Error("api-metadata.json has not been included in browser-polyfill");
      }

      /**
       * A WeakMap subclass which creates and stores a value for any key which does
       * not exist when accessed, but behaves exactly as an ordinary WeakMap
       * otherwise.
       *
       * @param {function} createItem
       *        A function which will be called in order to create the value for any
       *        key which does not exist, the first time it is accessed. The
       *        function receives, as its only argument, the key being created.
       */
      class DefaultWeakMap extends WeakMap {
        constructor(createItem, items = undefined) {
          super(items);
          this.createItem = createItem;
        }
        get(key) {
          if (!this.has(key)) {
            this.set(key, this.createItem(key));
          }
          return super.get(key);
        }
      }

      /**
       * Returns true if the given object is an object with a `then` method, and can
       * therefore be assumed to behave as a Promise.
       *
       * @param {*} value The value to test.
       * @returns {boolean} True if the value is thenable.
       */
      const isThenable = value => {
        return value && typeof value === "object" && typeof value.then === "function";
      };

      /**
       * Creates and returns a function which, when called, will resolve or reject
       * the given promise based on how it is called:
       *
       * - If, when called, `chrome.runtime.lastError` contains a non-null object,
       *   the promise is rejected with that value.
       * - If the function is called with exactly one argument, the promise is
       *   resolved to that value.
       * - Otherwise, the promise is resolved to an array containing all of the
       *   function's arguments.
       *
       * @param {object} promise
       *        An object containing the resolution and rejection functions of a
       *        promise.
       * @param {function} promise.resolve
       *        The promise's resolution function.
       * @param {function} promise.reject
       *        The promise's rejection function.
       * @param {object} metadata
       *        Metadata about the wrapped method which has created the callback.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function}
       *        The generated callback function.
       */
      const makeCallback = (promise, metadata) => {
        return (...callbackArgs) => {
          if (extensionAPIs.runtime.lastError) {
            promise.reject(new Error(extensionAPIs.runtime.lastError.message));
          } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
            promise.resolve(callbackArgs[0]);
          } else {
            promise.resolve(callbackArgs);
          }
        };
      };
      const pluralizeArguments = numArgs => numArgs == 1 ? "argument" : "arguments";

      /**
       * Creates a wrapper function for a method with the given name and metadata.
       *
       * @param {string} name
       *        The name of the method which is being wrapped.
       * @param {object} metadata
       *        Metadata about the method being wrapped.
       * @param {integer} metadata.minArgs
       *        The minimum number of arguments which must be passed to the
       *        function. If called with fewer than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {integer} metadata.maxArgs
       *        The maximum number of arguments which may be passed to the
       *        function. If called with more than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function(object, ...*)}
       *       The generated wrapper function.
       */
      const wrapAsyncFunction = (name, metadata) => {
        return function asyncFunctionWrapper(target, ...args) {
          if (args.length < metadata.minArgs) {
            throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
          }
          if (args.length > metadata.maxArgs) {
            throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
          }
          return new Promise((resolve, reject) => {
            if (metadata.fallbackToNoCallback) {
              // This API method has currently no callback on Chrome, but it return a promise on Firefox,
              // and so the polyfill will try to call it with a callback first, and it will fallback
              // to not passing the callback if the first call fails.
              try {
                target[name](...args, makeCallback({
                  resolve,
                  reject
                }, metadata));
              } catch (cbError) {
                console.warn(`${name} API method doesn't seem to support the callback parameter, ` + "falling back to call it without a callback: ", cbError);
                target[name](...args);

                // Update the API method metadata, so that the next API calls will not try to
                // use the unsupported callback anymore.
                metadata.fallbackToNoCallback = false;
                metadata.noCallback = true;
                resolve();
              }
            } else if (metadata.noCallback) {
              target[name](...args);
              resolve();
            } else {
              target[name](...args, makeCallback({
                resolve,
                reject
              }, metadata));
            }
          });
        };
      };

      /**
       * Wraps an existing method of the target object, so that calls to it are
       * intercepted by the given wrapper function. The wrapper function receives,
       * as its first argument, the original `target` object, followed by each of
       * the arguments passed to the original method.
       *
       * @param {object} target
       *        The original target object that the wrapped method belongs to.
       * @param {function} method
       *        The method being wrapped. This is used as the target of the Proxy
       *        object which is created to wrap the method.
       * @param {function} wrapper
       *        The wrapper function which is called in place of a direct invocation
       *        of the wrapped method.
       *
       * @returns {Proxy<function>}
       *        A Proxy object for the given method, which invokes the given wrapper
       *        method in its place.
       */
      const wrapMethod = (target, method, wrapper) => {
        return new Proxy(method, {
          apply(targetMethod, thisObj, args) {
            return wrapper.call(thisObj, target, ...args);
          }
        });
      };
      let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

      /**
       * Wraps an object in a Proxy which intercepts and wraps certain methods
       * based on the given `wrappers` and `metadata` objects.
       *
       * @param {object} target
       *        The target object to wrap.
       *
       * @param {object} [wrappers = {}]
       *        An object tree containing wrapper functions for special cases. Any
       *        function present in this object tree is called in place of the
       *        method in the same location in the `target` object tree. These
       *        wrapper methods are invoked as described in {@see wrapMethod}.
       *
       * @param {object} [metadata = {}]
       *        An object tree containing metadata used to automatically generate
       *        Promise-based wrapper functions for asynchronous. Any function in
       *        the `target` object tree which has a corresponding metadata object
       *        in the same location in the `metadata` tree is replaced with an
       *        automatically-generated wrapper function, as described in
       *        {@see wrapAsyncFunction}
       *
       * @returns {Proxy<object>}
       */
      const wrapObject = (target, wrappers = {}, metadata = {}) => {
        let cache = Object.create(null);
        let handlers = {
          has(proxyTarget, prop) {
            return prop in target || prop in cache;
          },
          get(proxyTarget, prop, receiver) {
            if (prop in cache) {
              return cache[prop];
            }
            if (!(prop in target)) {
              return undefined;
            }
            let value = target[prop];
            if (typeof value === "function") {
              // This is a method on the underlying object. Check if we need to do
              // any wrapping.

              if (typeof wrappers[prop] === "function") {
                // We have a special-case wrapper for this method.
                value = wrapMethod(target, target[prop], wrappers[prop]);
              } else if (hasOwnProperty(metadata, prop)) {
                // This is an async method that we have metadata for. Create a
                // Promise wrapper for it.
                let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                value = wrapMethod(target, target[prop], wrapper);
              } else {
                // This is a method that we don't know or care about. Return the
                // original method, bound to the underlying object.
                value = value.bind(target);
              }
            } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
              // This is an object that we need to do some wrapping for the children
              // of. Create a sub-object wrapper for it with the appropriate child
              // metadata.
              value = wrapObject(value, wrappers[prop], metadata[prop]);
            } else if (hasOwnProperty(metadata, "*")) {
              // Wrap all properties in * namespace.
              value = wrapObject(value, wrappers[prop], metadata["*"]);
            } else {
              // We don't need to do any wrapping for this property,
              // so just forward all access to the underlying object.
              Object.defineProperty(cache, prop, {
                configurable: true,
                enumerable: true,
                get() {
                  return target[prop];
                },
                set(value) {
                  target[prop] = value;
                }
              });
              return value;
            }
            cache[prop] = value;
            return value;
          },
          set(proxyTarget, prop, value, receiver) {
            if (prop in cache) {
              cache[prop] = value;
            } else {
              target[prop] = value;
            }
            return true;
          },
          defineProperty(proxyTarget, prop, desc) {
            return Reflect.defineProperty(cache, prop, desc);
          },
          deleteProperty(proxyTarget, prop) {
            return Reflect.deleteProperty(cache, prop);
          }
        };

        // Per contract of the Proxy API, the "get" proxy handler must return the
        // original value of the target if that value is declared read-only and
        // non-configurable. For this reason, we create an object with the
        // prototype set to `target` instead of using `target` directly.
        // Otherwise we cannot return a custom object for APIs that
        // are declared read-only and non-configurable, such as `chrome.devtools`.
        //
        // The proxy handlers themselves will still use the original `target`
        // instead of the `proxyTarget`, so that the methods and properties are
        // dereferenced via the original targets.
        let proxyTarget = Object.create(target);
        return new Proxy(proxyTarget, handlers);
      };

      /**
       * Creates a set of wrapper functions for an event object, which handles
       * wrapping of listener functions that those messages are passed.
       *
       * A single wrapper is created for each listener function, and stored in a
       * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
       * retrieve the original wrapper, so that  attempts to remove a
       * previously-added listener work as expected.
       *
       * @param {DefaultWeakMap<function, function>} wrapperMap
       *        A DefaultWeakMap object which will create the appropriate wrapper
       *        for a given listener function when one does not exist, and retrieve
       *        an existing one when it does.
       *
       * @returns {object}
       */
      const wrapEvent = wrapperMap => ({
        addListener(target, listener, ...args) {
          target.addListener(wrapperMap.get(listener), ...args);
        },
        hasListener(target, listener) {
          return target.hasListener(wrapperMap.get(listener));
        },
        removeListener(target, listener) {
          target.removeListener(wrapperMap.get(listener));
        }
      });
      const onRequestFinishedWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }

        /**
         * Wraps an onRequestFinished listener function so that it will return a
         * `getContent()` property which returns a `Promise` rather than using a
         * callback API.
         *
         * @param {object} req
         *        The HAR entry object representing the network request.
         */
        return function onRequestFinished(req) {
          const wrappedReq = wrapObject(req, {} /* wrappers */, {
            getContent: {
              minArgs: 0,
              maxArgs: 0
            }
          });
          listener(wrappedReq);
        };
      });
      const onMessageWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }

        /**
         * Wraps a message listener function so that it may send responses based on
         * its return value, rather than by returning a sentinel value and calling a
         * callback. If the listener function returns a Promise, the response is
         * sent when the promise either resolves or rejects.
         *
         * @param {*} message
         *        The message sent by the other end of the channel.
         * @param {object} sender
         *        Details about the sender of the message.
         * @param {function(*)} sendResponse
         *        A callback which, when called with an arbitrary argument, sends
         *        that value as a response.
         * @returns {boolean}
         *        True if the wrapped listener returned a Promise, which will later
         *        yield a response. False otherwise.
         */
        return function onMessage(message, sender, sendResponse) {
          let didCallSendResponse = false;
          let wrappedSendResponse;
          let sendResponsePromise = new Promise(resolve => {
            wrappedSendResponse = function (response) {
              didCallSendResponse = true;
              resolve(response);
            };
          });
          let result;
          try {
            result = listener(message, sender, wrappedSendResponse);
          } catch (err) {
            result = Promise.reject(err);
          }
          const isResultThenable = result !== true && isThenable(result);

          // If the listener didn't returned true or a Promise, or called
          // wrappedSendResponse synchronously, we can exit earlier
          // because there will be no response sent from this listener.
          if (result !== true && !isResultThenable && !didCallSendResponse) {
            return false;
          }

          // A small helper to send the message if the promise resolves
          // and an error if the promise rejects (a wrapped sendMessage has
          // to translate the message into a resolved promise or a rejected
          // promise).
          const sendPromisedResult = promise => {
            promise.then(msg => {
              // send the message value.
              sendResponse(msg);
            }, error => {
              // Send a JSON representation of the error if the rejected value
              // is an instance of error, or the object itself otherwise.
              let message;
              if (error && (error instanceof Error || typeof error.message === "string")) {
                message = error.message;
              } else {
                message = "An unexpected error occurred";
              }
              sendResponse({
                __mozWebExtensionPolyfillReject__: true,
                message
              });
            }).catch(err => {
              // Print an error on the console if unable to send the response.
              console.error("Failed to send onMessage rejected reply", err);
            });
          };

          // If the listener returned a Promise, send the resolved value as a
          // result, otherwise wait the promise related to the wrappedSendResponse
          // callback to resolve and send it as a response.
          if (isResultThenable) {
            sendPromisedResult(result);
          } else {
            sendPromisedResult(sendResponsePromise);
          }

          // Let Chrome know that the listener is replying.
          return true;
        };
      });
      const wrappedSendMessageCallback = ({
        reject,
        resolve
      }, reply) => {
        if (extensionAPIs.runtime.lastError) {
          // Detect when none of the listeners replied to the sendMessage call and resolve
          // the promise to undefined as in Firefox.
          // See https://github.com/mozilla/webextension-polyfill/issues/130
          if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
            resolve();
          } else {
            reject(new Error(extensionAPIs.runtime.lastError.message));
          }
        } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
          // Convert back the JSON representation of the error into
          // an Error instance.
          reject(new Error(reply.message));
        } else {
          resolve(reply);
        }
      };
      const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
        if (args.length < metadata.minArgs) {
          throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
        }
        if (args.length > metadata.maxArgs) {
          throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
        }
        return new Promise((resolve, reject) => {
          const wrappedCb = wrappedSendMessageCallback.bind(null, {
            resolve,
            reject
          });
          args.push(wrappedCb);
          apiNamespaceObj.sendMessage(...args);
        });
      };
      const staticWrappers = {
        devtools: {
          network: {
            onRequestFinished: wrapEvent(onRequestFinishedWrappers)
          }
        },
        runtime: {
          onMessage: wrapEvent(onMessageWrappers),
          onMessageExternal: wrapEvent(onMessageWrappers),
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 1,
            maxArgs: 3
          })
        },
        tabs: {
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 2,
            maxArgs: 3
          })
        }
      };
      const settingMetadata = {
        clear: {
          minArgs: 1,
          maxArgs: 1
        },
        get: {
          minArgs: 1,
          maxArgs: 1
        },
        set: {
          minArgs: 1,
          maxArgs: 1
        }
      };
      apiMetadata.privacy = {
        network: {
          "*": settingMetadata
        },
        services: {
          "*": settingMetadata
        },
        websites: {
          "*": settingMetadata
        }
      };
      return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
    };

    // The build process adds a UMD wrapper around this file, which makes the
    // `module` variable available.
    module.exports = wrapAPIs(chrome);
  } else {
    module.exports = globalThis.browser;
  }
});


/***/ }),

/***/ 47300:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   l: () => (/* binding */ Toggle)
/* harmony export */ });
/* harmony import */ var preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(93748);

/**
 * Shared on/off toggle used by the options page and the popup menu.
 * Styling lives in src/pages/common.pcss (`.toggle`).
 */ function Toggle({ checked, onClick }) {
    return /*#__PURE__*/ (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__/* .jsx */ .Y)("div", {
        class: `toggle ${checked ? 'toggle--checked' : ''}`,
        onClick: onClick,
        children: /*#__PURE__*/ (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__/* .jsx */ .Y)("div", {
            class: "toggle__label"
        })
    });
}


/***/ }),

/***/ 65821:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";

// EXTERNAL MODULE: ./node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
var jsxRuntime_module = __webpack_require__(93748);
// EXTERNAL MODULE: ./node_modules/preact/dist/preact.module.js
var preact_module = __webpack_require__(96445);
// EXTERNAL MODULE: ./src/common/i18n.js
var i18n = __webpack_require__(75129);
// EXTERNAL MODULE: ./node_modules/@preact/signals/dist/signals.module.js + 1 modules
var signals_module = __webpack_require__(96324);
// EXTERNAL MODULE: ./node_modules/lucide-preact/dist/esm/icons/info.mjs
var info = __webpack_require__(7337);
// EXTERNAL MODULE: ./src/common/url-injector.js
var url_injector = __webpack_require__(17661);
// EXTERNAL MODULE: ./src/common/user-agent.js
var user_agent = __webpack_require__(72038);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.url-search-params.delete.js
var web_url_search_params_delete = __webpack_require__(92218);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.url-search-params.has.js
var web_url_search_params_has = __webpack_require__(97273);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.url-search-params.size.js
var web_url_search_params_size = __webpack_require__(1180);
// EXTERNAL MODULE: ./node_modules/webextension-polyfill/dist/browser-polyfill.js
var browser_polyfill = __webpack_require__(61934);
var browser_polyfill_default = /*#__PURE__*/__webpack_require__.n(browser_polyfill);
// EXTERNAL MODULE: ./src/pages/services/messenger.js
var messenger = __webpack_require__(47754);
;// ./src/background/prefs.js
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else obj[key] = value;
    return obj;
}

class Prefs {
}
_define_property(Prefs, "id", browser_polyfill.runtime.id);
_define_property(Prefs, "baseUrl", browser_polyfill.runtime.getURL(''));
_define_property(Prefs, "version", browser_polyfill.runtime.getManifest().version);
_define_property(Prefs, "language", browser_polyfill.i18n.getUILanguage());

// EXTERNAL MODULE: ./src/common/logger.js
var logger = __webpack_require__(65293);
;// ./src/background/browser-api/windows.js



class WindowsApi {
    /**
   * Checks if browser.windows API is supported.
   *
   * Do not use browser.windows API if it is not supported,
   * for example on Android: not supported in Firefox and does not work in Edge.
   */ static async isSupported() {
        const isAndroid = await user_agent/* UserAgent */.B.getIsAndroid();
        /**
     * We need separate check for Edge on Android,
     * because it has browser.windows API defined,
     * but it does nothing when you try to use it
     */ if (isAndroid && user_agent/* UserAgent */.B.isEdge) {
            return false;
        }
        return !!browser_polyfill.windows && typeof browser_polyfill.windows.update === 'function' && typeof browser_polyfill.windows.create === 'function';
    }
    static async update(windowId, updateInfo) {
        if (!windowId) {
            logger/* logger */.v.debug('[ext.WindowsApi.update]: windowId is not specified');
            return;
        }
        if (!await WindowsApi.isSupported()) {
            logger/* logger */.v.debug('[ext.WindowsApi.update]: browser.windows API is not supported');
            return;
        }
        await browser_polyfill.windows.update(windowId, updateInfo);
    }
}

;// ./src/background/browser-api/tabs.js






class TabsApi {
    static async findOne(queryInfo) {
        const [tab] = await browser_polyfill.tabs.query(queryInfo);
        return tab;
    }
    static async focus(tab) {
        const { id, windowId } = tab;
        await browser_polyfill.tabs.update(id, {
            active: true
        });
        await WindowsApi.update(windowId, {
            focused: true
        });
    }
    static async getAll() {
        return browser_polyfill.tabs.query({});
    }
    static async getActive() {
        return TabsApi.findOne({
            currentWindow: true,
            active: true
        });
    }
    static isExtensionTab(tab) {
        const { url } = tab;
        if (!url) {
            return false;
        }
        try {
            const parsed = new URL(url);
            const { protocol, hostname } = parsed;
            const scheme = Prefs.baseUrl.split('://')[0];
            if (!scheme) {
                return false;
            }
            return protocol.indexOf(scheme) > -1 && hostname === Prefs.id;
        } catch (e) {
            return false;
        }
    }
    static async reload(id) {
        await browser_polyfill.tabs.reload(id, {
            bypassCache: true
        });
    }
}

// EXTERNAL MODULE: ./src/common/messages/index.js
var messages = __webpack_require__(37382);
;// ./src/pages/popup/store.js









// Model State
const extensionBaseUrl = browser_polyfill.runtime.getURL('');
const activeTab = (0,signals_module/* signal */.vP)(null);
const tabInfo = (0,signals_module/* signal */.vP)(null);
const initialLoadDone = (0,signals_module/* signal */.vP)(false);
const frameInfo = (0,signals_module/* computed */.EW)(()=>tabInfo.value?.frameInfo);
const enableChecked = (0,signals_module/* computed */.EW)(()=>!(frameInfo.value?.documentAllowlisted ?? false));
const isWebSiteTab = (0,signals_module/* computed */.EW)(()=>frameInfo.value ? !frameInfo.value.urlFilteringDisabled : false);
const desktopAppActive = (0,signals_module/* computed */.EW)(()=>tabInfo.value?.options?.desktopAppActive ?? false);
const desktopAppInstalled = (0,signals_module/* computed */.EW)(()=>tabInfo.value?.options?.desktopAppInstalled ?? false);
const areFilterLimitsExceeded = (0,signals_module/* computed */.EW)(()=>tabInfo.value?.options?.areFilterLimitsExceeded ?? false);
const totalBlockedTab = (0,signals_module/* computed */.EW)(()=>frameInfo.value?.totalBlockedTab ?? 0);
const totalBlocked = (0,signals_module/* computed */.EW)(()=>frameInfo.value?.totalBlocked ?? 0);
const documentAllowlisted = (0,signals_module/* computed */.EW)(()=>frameInfo.value?.documentAllowlisted ?? false);
const isFilteringPossible = (0,signals_module/* computed */.EW)(()=>frameInfo.value?.isFilteringPossible ?? false);
const canAddRemoveRule = (0,signals_module/* computed */.EW)(()=>frameInfo.value?.canAddRemoveRule ?? false);
const activeTabId = (0,signals_module/* computed */.EW)(()=>activeTab.value?.id);
const statusText = (0,signals_module/* computed */.EW)(()=>{
    const securePageText = (0,i18n/* getMessage */.I4)('popup_secure_page');
    const protectionEnabledText = (0,i18n/* getMessage */.I4)('popup_protection_enabled');
    const protectionDisabledText = (0,i18n/* getMessage */.I4)('popup_protection_disabled');
    return !isWebSiteTab.value ? securePageText : enableChecked.value ? protectionEnabledText : protectionDisabledText;
});
const tabUrlDisplay = (0,signals_module/* computed */.EW)(()=>{
    const tabUrl = activeTab.value?.url || '';
    if (tabUrl.startsWith(extensionBaseUrl)) {
        return 'AdBlocker Ultimate';
    }
    const domain = frameInfo.value?.domainName;
    if (domain) {
        return domain;
    }
    try {
        const url = new URL(tabUrl);
        return url.hostname.replace(/^www\./, '') || '';
    } catch  {
        return '';
    }
});
async function loadPopupData() {
    try {
        const tab = await TabsApi.getActive();
        activeTab.value = tab;
        if (!tab) {
            return;
        }
        const info = await messenger/* Messenger */.e.getTabInfoForPopup(tab.id);
        if (info?.frameInfo) {
            tabInfo.value = info;
        }
    } finally{
        initialLoadDone.value = true;
    }
}
browser_polyfill.runtime.onMessage.addListener((message)=>{
    if (!(0,messages/* messageHasTypeField */.Et)(message)) {
        return;
    }
    if (message.type === messages/* MessageType */.Go.AppInitialized) {
        loadPopupData();
        return;
    }
    if (message.type === messages/* MessageType */.Go.UpdateLimitsVerdict && (0,messages/* messageHasTypeAndDataFields */.oL)(message)) {
        if (tabInfo.value) {
            tabInfo.value = {
                ...tabInfo.value,
                options: {
                    ...tabInfo.value.options,
                    areFilterLimitsExceeded: message.data.areFilterLimitsExceeded
                }
            };
        }
        return;
    }
    if (message.type === messages/* MessageType */.Go.UpdateTotalBlocked && (0,messages/* messageHasTypeAndDataFields */.oL)(message)) {
        const { tabId, totalBlockedTab, totalBlocked } = message.data;
        if (tabId === activeTab.value?.id) {
            tabInfo.value = {
                ...tabInfo.value,
                frameInfo: {
                    ...tabInfo.value?.frameInfo,
                    totalBlockedTab,
                    totalBlocked
                }
            };
        }
    }
});
// Optimistic Updates
function setDocumentAllowlisted(allowlisted) {
    const current = tabInfo.value;
    if (!current?.frameInfo) {
        return;
    }
    tabInfo.value = {
        ...current,
        frameInfo: {
            ...current.frameInfo,
            documentAllowlisted: allowlisted
        }
    };
}
// UI State
const infoHover = (0,signals_module/* signal */.vP)(false);
// Initialization
loadPopupData();

// EXTERNAL MODULE: ./src/resources/svg-icons.jsx
var svg_icons = __webpack_require__(13819);
// EXTERNAL MODULE: ./src/pages/services/native-app-promo.js
var native_app_promo = __webpack_require__(17874);
// EXTERNAL MODULE: ./node_modules/lucide-preact/dist/esm/Icon.mjs + 3 modules
var Icon = __webpack_require__(73167);
;// ./node_modules/@lucide/lab/dist/esm/icons/broom.js
/**
 * @license @lucide/lab v0.1.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const broom = [
  ["path", { d: "m13 11 9-9", key: "hhupzs" }],
  ["path", { d: "M14.6 12.6c.8.8.9 2.1.2 3L10 22l-8-8 6.4-4.8c.9-.7 2.2-.6 3 .2Z", key: "125lmh" }],
  ["path", { d: "m6.8 10.4 6.8 6.8", key: "8ijsh8" }],
  ["path", { d: "m5 17 1.4-1.4", key: "rw7fu1" }]
];



;// ./src/pages/popup/components/Stats.jsx




function Stats({ totalBlockedTab, totalBlocked, visible }) {
    if (!visible.value) {
        return null;
    }
    return /*#__PURE__*/ (0,jsxRuntime_module/* jsxs */.FD)("div", {
        class: "stats visible",
        children: [
            /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("div", {
                class: "stats__img",
                children: /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)(Icon/* default */.A, {
                    iconNode: broom,
                    class: "stats__glyph"
                })
            }),
            /*#__PURE__*/ (0,jsxRuntime_module/* jsxs */.FD)("div", {
                class: "stats__content",
                children: [
                    /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("strong", {
                        class: "stats__heading",
                        children: (0,i18n/* getMessage */.I4)('popup_tab_blocked', [
                            (totalBlockedTab.value ?? 0).toLocaleString()
                        ])
                    }),
                    /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("p", {
                        class: "stats__subheading",
                        children: (0,i18n/* getMessage */.I4)('popup_tab_blocked_all', [
                            (totalBlocked.value ?? 0).toLocaleString()
                        ])
                    })
                ]
            })
        ]
    });
}

// EXTERNAL MODULE: ./node_modules/preact/hooks/dist/hooks.module.js
var hooks_module = __webpack_require__(52297);
// EXTERNAL MODULE: ./node_modules/lucide-preact/dist/esm/icons/shield-check.mjs
var shield_check = __webpack_require__(36853);
// EXTERNAL MODULE: ./node_modules/lucide-preact/dist/esm/createLucideIcon.mjs + 3 modules
var createLucideIcon = __webpack_require__(2448);
;// ./node_modules/lucide-preact/dist/esm/icons/square-dashed-mouse-pointer.mjs
/**
 * @license lucide-preact v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const SquareDashedMousePointer = (0,createLucideIcon/* default */.A)("square-dashed-mouse-pointer", [
  [
    "path",
    {
      d: "M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z",
      key: "xwnzip"
    }
  ],
  ["path", { d: "M5 3a2 2 0 0 0-2 2", key: "y57alp" }],
  ["path", { d: "M19 3a2 2 0 0 1 2 2", key: "18rm91" }],
  ["path", { d: "M5 21a2 2 0 0 1-2-2", key: "sbafld" }],
  ["path", { d: "M9 3h1", key: "1yesri" }],
  ["path", { d: "M9 21h2", key: "1qve2z" }],
  ["path", { d: "M14 3h1", key: "1ec4yj" }],
  ["path", { d: "M3 9v1", key: "1r0deq" }],
  ["path", { d: "M21 9v2", key: "p14lih" }],
  ["path", { d: "M3 14v1", key: "vnatye" }]
]);


//# sourceMappingURL=square-dashed-mouse-pointer.mjs.map

// EXTERNAL MODULE: ./node_modules/lucide-preact/dist/esm/icons/settings.mjs
var settings = __webpack_require__(22830);
// EXTERNAL MODULE: ./src/pages/components/Toggle.jsx
var Toggle = __webpack_require__(47300);
;// ./src/pages/popup/components/Menu.jsx







function Menu({ isWebSiteTab, documentAllowlisted, isFilteringPossible, canAddRemoveRule, activeTabId, enableChecked }) {
    const handleEnableClick = (0,hooks_module/* useCallback */.hb)(()=>{
        if (!isWebSiteTab.value || !isFilteringPossible.value || !canAddRemoveRule.value || activeTabId.value == null) {
            return;
        }
        const wasAllowlisted = documentAllowlisted.value;
        const tabId = activeTabId.value;
        setDocumentAllowlisted(!wasAllowlisted);
        if (wasAllowlisted) {
            messenger/* Messenger */.e.removeAllowlistDomain(tabId, true);
        } else {
            messenger/* Messenger */.e.addAllowlistDomain(tabId);
        }
    }, [
        isWebSiteTab,
        documentAllowlisted,
        isFilteringPossible,
        canAddRemoveRule,
        activeTabId
    ]);
    const handleBlockClick = (0,hooks_module/* useCallback */.hb)(async ()=>{
        if (!isWebSiteTab.value) {
            return;
        }
        await messenger/* Messenger */.e.openAssistant();
        window.close();
    }, [
        isWebSiteTab
    ]);
    const handleSettingsClick = (0,hooks_module/* useCallback */.hb)(()=>{
        messenger/* Messenger */.e.openSettingsTab();
        window.close();
    }, []);
    return /*#__PURE__*/ (0,jsxRuntime_module/* jsxs */.FD)("ul", {
        class: "menu",
        children: [
            /*#__PURE__*/ (0,jsxRuntime_module/* jsxs */.FD)("li", {
                class: `menu__item ${isWebSiteTab.value ? '' : 'disabled'}`,
                onClick: isWebSiteTab.value ? handleEnableClick : undefined,
                children: [
                    /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("div", {
                        class: "menu__icon",
                        children: /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)(shield_check/* default */.A, {
                            class: "menu__glyph"
                        })
                    }),
                    /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("span", {
                        class: "checkbox-label",
                        children: (0,i18n/* getMessage */.I4)('popup_enabled_on_site')
                    }),
                    /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)(Toggle/* Toggle */.l, {
                        checked: enableChecked.value
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsxRuntime_module/* jsxs */.FD)("li", {
                class: `menu__item ${isWebSiteTab.value ? '' : 'disabled'}`,
                onClick: handleBlockClick,
                children: [
                    /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("div", {
                        class: "menu__icon",
                        children: /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)(SquareDashedMousePointer, {
                            class: "menu__glyph"
                        })
                    }),
                    /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("span", {
                        children: (0,i18n/* getMessage */.I4)('browser_action_popup_block_element')
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsxRuntime_module/* jsxs */.FD)("li", {
                class: "menu__item",
                onClick: handleSettingsClick,
                children: [
                    /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("div", {
                        class: "menu__icon",
                        children: /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)(settings/* default */.A, {
                            class: "menu__glyph"
                        })
                    }),
                    /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("span", {
                        children: (0,i18n/* getMessage */.I4)('popup_settings')
                    })
                ]
            })
        ]
    });
}

// EXTERNAL MODULE: ./node_modules/lucide-preact/dist/esm/icons/triangle-alert.mjs
var triangle_alert = __webpack_require__(16692);
;// ./src/pages/popup/components/LimitsWarning.jsx






/** Must match the `notify-hide` animation duration in index.pcss. */ const HIDE_ANIMATION_MS = 300;
function LimitsWarning() {
    const [closing, setClosing] = (0,hooks_module/* useState */.J0)(false);
    const [closed, setClosed] = (0,hooks_module/* useState */.J0)(false);
    if (!areFilterLimitsExceeded.value || closed) {
        return null;
    }
    const handleDetailsClick = ()=>{
        messenger/* Messenger */.e.openRulesLimitsTab();
        window.close();
    };
    const handleCloseClick = ()=>{
        setClosing(true);
        setTimeout(()=>setClosed(true), HIDE_ANIMATION_MS);
    };
    return /*#__PURE__*/ (0,jsxRuntime_module/* jsxs */.FD)("div", {
        class: `limits-warning ${closing ? 'limits-warning--closing' : ''}`,
        role: "status",
        children: [
            /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)(triangle_alert/* default */.A, {
                class: "limits-warning__icon"
            }),
            /*#__PURE__*/ (0,jsxRuntime_module/* jsxs */.FD)("div", {
                class: "limits-warning__content",
                children: [
                    /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("p", {
                        class: "limits-warning__text",
                        children: (0,i18n/* getMessage */.I4)('popup_limits_warning')
                    }),
                    /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("button", {
                        type: "button",
                        class: "limits-warning__link",
                        onClick: handleDetailsClick,
                        children: (0,i18n/* getMessage */.I4)('options_limits_view_details')
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("button", {
                type: "button",
                class: "limits-warning__close",
                "aria-label": (0,i18n/* getMessage */.I4)('close'),
                onClick: handleCloseClick,
                children: /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("span", {
                    "aria-hidden": "true",
                    children: "\xd7"
                })
            })
        ]
    });
}

;// ./src/common/constants/promotions.active.js
/**
 * Active promotion configuration (generated at build time)
 * This file is empty when no promotion is active
 */ const PROMOTIONS = (/* unused pure expression or super */ null && ([]));
/**
 * Get the currently active promotion based on current UTC date
 * @returns {Object|null} The active promotion object or null if no promotion is active
 */ const getActivePromotion = ()=>{
    return null;
};

// EXTERNAL MODULE: ./src/background/services/ui/url-builder.js
var url_builder = __webpack_require__(51643);
// EXTERNAL MODULE: ./src/background/storage-keys.js
var storage_keys = __webpack_require__(44210);
;// ./src/pages/popup/components/Banner.jsx







// --- Signals (module scope) ---
const promo = (0,signals_module/* signal */.vP)(null);
const visible = (0,signals_module/* signal */.vP)(false);
// --- Data loading ---
(async ()=>{
    const activePromo = getActivePromotion();
    if (!activePromo) {
        return;
    }
    const storageKey = `${storage_keys/* PROMO_BANNER_DISMISSED_PREFIX */.Ag}${activePromo.id}`;
    const result = await browser_polyfill_default().storage.local.get([
        storageKey
    ]);
    if (result[storageKey] === true) {
        return;
    }
    promo.value = activePromo;
    visible.value = true;
})();
// --- Component (pure render) ---
async function handleClose() {
    if (!promo.value) {
        return;
    }
    visible.value = false;
    const storageKey = `${storage_keys/* PROMO_BANNER_DISMISSED_PREFIX */.Ag}${promo.value.id}`;
    await browser_polyfill_default().storage.local.set({
        [storageKey]: true
    });
}
function Banner() {
    if (!promo.value || !visible.value) {
        return null;
    }
    const bgUrl = promo.value.backgroundImage ? browser_polyfill_default().runtime.getURL(promo.value.backgroundImage) : null;
    const iconUrl = promo.value.iconImage ? browser_polyfill_default().runtime.getURL(promo.value.iconImage) : null;
    const title = (0,i18n/* getMessage */.I4)(promo.value.titleKey) || '';
    const buttonText = (0,i18n/* getMessage */.I4)(promo.value.buttonTextKey) || (0,i18n/* getMessage */.I4)('popup_promo_button') || 'Learn More';
    const linkUrl = promo.value.linkUrl || (0,url_builder/* buildUrl */.c$)(url_builder/* Endpoint */.yI.Upgrade);
    return /*#__PURE__*/ (0,jsxRuntime_module/* jsxs */.FD)("div", {
        class: "promotional-banner",
        children: [
            /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("button", {
                type: "button",
                class: "promotional-banner__close",
                "aria-label": "Close banner",
                onClick: handleClose,
                children: "\xd7"
            }),
            /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("div", {
                class: "promotional-banner__background",
                style: bgUrl ? {
                    backgroundImage: `url('${bgUrl}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                } : undefined
            }),
            /*#__PURE__*/ (0,jsxRuntime_module/* jsxs */.FD)("div", {
                class: "promotional-banner__content",
                children: [
                    /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("div", {
                        class: "promotional-banner__icon",
                        style: {
                            display: iconUrl ? 'flex' : 'none'
                        },
                        children: /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("img", {
                            src: iconUrl || '',
                            alt: "",
                            class: "promotional-banner__icon-image"
                        })
                    }),
                    /*#__PURE__*/ (0,jsxRuntime_module/* jsxs */.FD)("div", {
                        class: "promotional-banner__text",
                        children: [
                            /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("span", {
                                class: "promotional-banner__title",
                                children: title
                            }),
                            /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("a", {
                                href: linkUrl,
                                class: "promotional-banner__button",
                                target: "_blank",
                                rel: "noopener noreferrer",
                                children: buttonText
                            })
                        ]
                    })
                ]
            })
        ]
    });
}

;// ./src/pages/popup/components/Socials.jsx



const FACEBOOK_URL = (0,url_injector/* getUrlByKey */.W)('FACEBOOK');
const X_URL = (0,url_injector/* getUrlByKey */.W)('X');
function Socials() {
    return /*#__PURE__*/ (0,jsxRuntime_module/* jsxs */.FD)("ul", {
        class: "socials",
        children: [
            /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("li", {
                children: /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("a", {
                    href: FACEBOOK_URL || '#',
                    class: "social",
                    "data-social": "facebook",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    title: "Facebook",
                    children: /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)(svg_icons/* IconFacebook */.GA, {
                        class: "icon icon--facebook"
                    })
                })
            }),
            /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("li", {
                children: /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("a", {
                    href: X_URL || '#',
                    class: "social",
                    "data-social": "x",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    title: "X",
                    children: /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)(svg_icons/* IconX */.MR, {
                        class: "icon"
                    })
                })
            })
        ]
    });
}

;// ./src/pages/popup/components/MobileApps.jsx




const ANDROID_URL = (0,url_injector/* getUrlByKey */.W)('ANDROID_APP');
const IOS_URL = (0,url_injector/* getUrlByKey */.W)('IOS_APP');
function MobileApps() {
    const title = (0,i18n/* getMessage */.I4)('popup_mobile_apps_title');
    return /*#__PURE__*/ (0,jsxRuntime_module/* jsxs */.FD)("div", {
        class: "app-promo",
        children: [
            /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("span", {
                class: "app-promo__text",
                title: title,
                children: title
            }),
            /*#__PURE__*/ (0,jsxRuntime_module/* jsxs */.FD)("ul", {
                class: "app-promo__links",
                children: [
                    /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("li", {
                        children: /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("a", {
                            href: ANDROID_URL || '#',
                            class: "app-promo__link",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            title: (0,i18n/* getMessage */.I4)('popup_abu_for_android'),
                            children: /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)(svg_icons/* IconAndroid */.z6, {
                                class: "icon"
                            })
                        })
                    }),
                    /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("li", {
                        children: /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("a", {
                            href: IOS_URL || '#',
                            class: "app-promo__link",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            title: (0,i18n/* getMessage */.I4)('popup_abu_for_ios'),
                            children: /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)(svg_icons/* IconApple */.wp, {
                                class: "icon"
                            })
                        })
                    })
                ]
            })
        ]
    });
}

;// ./src/pages/popup/components/Popup.jsx















const homepageUrl = (0,url_injector/* getUrlByKey */.W)('HOMEPAGE');
const isEdge = user_agent/* UserAgent */.B.isEdge;
const isAndroid = user_agent/* UserAgent */.B.isAndroid;
const PromoIcon = native_app_promo/* nativeAppPromo */.Q?.Icon;
function Popup() {
    (0,signals_module/* useSignalEffect */.R0)(()=>{
        if (initialLoadDone.value) {
            document.body.classList.remove('loading');
        }
    });
    return /*#__PURE__*/ (0,jsxRuntime_module/* jsxs */.FD)(jsxRuntime_module/* Fragment */.FK, {
        children: [
            /*#__PURE__*/ (0,jsxRuntime_module/* jsxs */.FD)("div", {
                class: `display ${enableChecked.value ? '' : 'disabled'}`,
                children: [
                    /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("a", {
                        href: homepageUrl || '#',
                        class: "logo",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        children: /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("img", {
                            src: "/assets/images/logo.png",
                            alt: ""
                        })
                    }),
                    /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("div", {
                        class: `info ${infoHover.value ? 'visible' : ''}`,
                        children: desktopAppActive.value ? (0,i18n/* getMessage */.I4)('desktop_app_info') : ''
                    }),
                    !desktopAppActive.value && /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)(Stats, {
                        totalBlockedTab: totalBlockedTab,
                        totalBlocked: totalBlocked,
                        visible: isWebSiteTab
                    }),
                    /*#__PURE__*/ (0,jsxRuntime_module/* jsxs */.FD)("div", {
                        class: `stats-desktop ${desktopAppActive.value ? 'visible' : ''}`,
                        children: [
                            /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)(info/* default */.A, {
                                class: `text__help ${desktopAppActive.value ? 'visible' : ''}`,
                                onMouseEnter: ()=>infoHover.value = true,
                                onMouseLeave: ()=>infoHover.value = false
                            }),
                            /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("strong", {
                                class: "text__heading",
                                children: desktopAppActive.value ? (0,i18n/* getMessage */.I4)('desktop_app_is_running') : ''
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsxRuntime_module/* jsxs */.FD)("div", {
                        class: "mascot",
                        children: [
                            /*#__PURE__*/ (0,jsxRuntime_module/* jsxs */.FD)("div", {
                                class: "mascot__circle",
                                children: [
                                    /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("img", {
                                        src: "/assets/images/circle.svg",
                                        alt: ""
                                    }),
                                    /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)(svg_icons/* IconMascotCircle */.jG, {})
                                ]
                            }),
                            /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("img", {
                                class: "mascot__img mascot__awake",
                                src: "/assets/images/mascot-awake.png",
                                alt: ""
                            }),
                            /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("img", {
                                class: "mascot__img mascot__asleep",
                                src: "/assets/images/mascot-asleep.png",
                                alt: ""
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("p", {
                        class: "tab-url",
                        children: tabUrlDisplay
                    }),
                    /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("p", {
                        class: "status",
                        children: statusText
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsxRuntime_module/* jsxs */.FD)("div", {
                class: "actions",
                children: [
                    /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)(Menu, {
                        isWebSiteTab: isWebSiteTab,
                        documentAllowlisted: documentAllowlisted,
                        isFilteringPossible: isFilteringPossible,
                        canAddRemoveRule: canAddRemoveRule,
                        activeTabId: activeTabId,
                        enableChecked: enableChecked
                    }),
                    native_app_promo/* nativeAppPromo */.Q && !isEdge && /*#__PURE__*/ (0,jsxRuntime_module/* jsxs */.FD)("a", {
                        href: native_app_promo/* nativeAppPromo */.Q.url || '#',
                        class: `btn btn-download-app ${initialLoadDone.value && !desktopAppInstalled.value ? 'visible' : ''}`,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        children: [
                            /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)(PromoIcon, {
                                class: "icon"
                            }),
                            /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)("span", {
                                children: (0,i18n/* getMessage */.I4)('popup_get_abu_desktop', [
                                    native_app_promo/* nativeAppPromo */.Q.platform
                                ])
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)(Banner, {}),
                    isEdge && /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)(Socials, {})
                ]
            }),
            !isEdge && !isAndroid && /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)(MobileApps, {}),
            /*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)(LimitsWarning, {})
        ]
    });
}

;// ./src/pages/popup/index.jsx






const root = document.getElementById('root');
(async ()=>{
    await (0,i18n/* initDevLocale */.mO)();
    if (root) {
        (0,preact_module/* render */.XX)(/*#__PURE__*/ (0,jsxRuntime_module/* jsx */.Y)(Popup, {}), root);
    }
})();


/***/ }),

/***/ 13819:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GA: () => (/* binding */ IconFacebook),
/* harmony export */   Hz: () => (/* binding */ IconWindows),
/* harmony export */   MR: () => (/* binding */ IconX),
/* harmony export */   jG: () => (/* binding */ IconMascotCircle),
/* harmony export */   wp: () => (/* binding */ IconApple),
/* harmony export */   z6: () => (/* binding */ IconAndroid)
/* harmony export */ });
/* harmony import */ var preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(93748);

/**
 * Shared inline SVG icons for options and popup pages.
 * Use as <IconName class="icon" /> or with other props (aria-hidden, etc.).
 *
 * General UI icons come from the `lucide-preact` package; this file only
 * keeps icons Lucide doesn't provide (brand logos, custom glyphs).
 * Brand icon paths sourced from Simple Icons (CC0), https://simpleicons.org
 */ const defaultSvgProps = {
    fill: 'currentColor',
    'aria-hidden': true
};
function IconWindows(props) {
    return /*#__PURE__*/ (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__/* .jsx */ .Y)("svg", {
        viewBox: "0 0 24 24",
        ...defaultSvgProps,
        ...props,
        children: /*#__PURE__*/ (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__/* .jsx */ .Y)("path", {
            d: "M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"
        })
    });
}
function IconFacebook(props) {
    return /*#__PURE__*/ (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__/* .jsx */ .Y)("svg", {
        viewBox: "0 0 24 24",
        ...defaultSvgProps,
        ...props,
        children: /*#__PURE__*/ (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__/* .jsx */ .Y)("path", {
            d: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"
        })
    });
}
function IconX(props) {
    return /*#__PURE__*/ (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__/* .jsx */ .Y)("svg", {
        viewBox: "0 0 24 24",
        ...defaultSvgProps,
        ...props,
        children: /*#__PURE__*/ (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__/* .jsx */ .Y)("path", {
            d: "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"
        })
    });
}
function IconAndroid(props) {
    return /*#__PURE__*/ (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__/* .jsx */ .Y)("svg", {
        viewBox: "0 0 24 24",
        ...defaultSvgProps,
        ...props,
        children: /*#__PURE__*/ (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__/* .jsx */ .Y)("path", {
            d: "M18.4395 5.5586c-.675 1.1664-1.352 2.3318-2.0274 3.498-.0366-.0155-.0742-.0286-.1113-.043-1.8249-.6957-3.484-.8-4.42-.787-1.8551.0185-3.3544.4643-4.2597.8203-.084-.1494-1.7526-3.021-2.0215-3.4864a1.1451 1.1451 0 0 0-.1406-.1914c-.3312-.364-.9054-.4859-1.379-.203-.475.282-.7136.9361-.3886 1.5019 1.9466 3.3696-.0966-.2158 1.9473 3.3593.0172.031-.4946.2642-1.3926 1.0177C2.8987 12.176.452 14.772 0 18.9902h24c-.119-1.1108-.3686-2.099-.7461-3.0683-.7438-1.9118-1.8435-3.2928-2.7402-4.1836a12.1048 12.1048 0 0 0-2.1309-1.6875c.6594-1.122 1.312-2.2559 1.9649-3.3848.2077-.3615.1886-.7956-.0079-1.1191a1.1001 1.1001 0 0 0-.8515-.5332c-.5225-.0536-.9392.3128-1.0488.5449zm-.0391 8.461c.3944.5926.324 1.3306-.1563 1.6503-.4799.3197-1.188.0985-1.582-.4941-.3944-.5927-.324-1.3307.1563-1.6504.4727-.315 1.1812-.1086 1.582.4941zM7.207 13.5273c.4803.3197.5506 1.0577.1563 1.6504-.394.5926-1.1038.8138-1.584.4941-.48-.3197-.5503-1.0577-.1563-1.6504.4008-.6021 1.1087-.8106 1.584-.4941z"
        })
    });
}
function IconApple(props) {
    return /*#__PURE__*/ (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__/* .jsx */ .Y)("svg", {
        viewBox: "0 0 24 24",
        ...defaultSvgProps,
        ...props,
        children: /*#__PURE__*/ (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__/* .jsx */ .Y)("path", {
            d: "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
        })
    });
}
/** Circle used in popup mascot (not exported for index.html placeholder). */ function IconMascotCircle(props) {
    return /*#__PURE__*/ (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__/* .jsx */ .Y)("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 100 100",
        preserveAspectRatio: "xMinYMin meet",
        ...props,
        children: /*#__PURE__*/ (0,preact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__/* .jsx */ .Y)("circle", {
            cx: "50",
            cy: "50",
            r: "48"
        })
    });
}


/***/ }),

/***/ 14839:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isCallable = __webpack_require__(14226);
var tryToString = __webpack_require__(52824);

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw new $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ 62947:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isPossiblePrototype = __webpack_require__(99946);

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (isPossiblePrototype(argument)) return argument;
  throw new $TypeError("Can't set " + $String(argument) + ' as a prototype');
};


/***/ }),

/***/ 38228:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var wellKnownSymbol = __webpack_require__(92704);
var create = __webpack_require__(64515);
var defineProperty = (__webpack_require__(90484).f);

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] === undefined) {
  defineProperty(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ 49352:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isObject = __webpack_require__(82917);

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw new $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ 93980:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIndexedObject = __webpack_require__(81958);
var toAbsoluteIndex = __webpack_require__(63513);
var lengthOfArrayLike = __webpack_require__(71959);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    if (length === 0) return !IS_INCLUDES && -1;
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el !== el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value !== value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ 73431:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(25963);

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ 43924:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(8695);
var isCallable = __webpack_require__(14226);
var classofRaw = __webpack_require__(73431);
var wellKnownSymbol = __webpack_require__(92704);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ }),

/***/ 47187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var hasOwn = __webpack_require__(3412);
var ownKeys = __webpack_require__(47066);
var getOwnPropertyDescriptorModule = __webpack_require__(85534);
var definePropertyModule = __webpack_require__(90484);

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ 70386:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(96591);
var definePropertyModule = __webpack_require__(90484);
var createPropertyDescriptor = __webpack_require__(81329);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 81329:
/***/ ((module) => {

"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 39627:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var makeBuiltIn = __webpack_require__(52240);
var defineProperty = __webpack_require__(90484);

module.exports = function (target, name, descriptor) {
  if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true });
  if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true });
  return defineProperty.f(target, name, descriptor);
};


/***/ }),

/***/ 82927:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isCallable = __webpack_require__(14226);
var definePropertyModule = __webpack_require__(90484);
var makeBuiltIn = __webpack_require__(52240);
var defineGlobalProperty = __webpack_require__(39548);

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};


/***/ }),

/***/ 39548:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var globalThis = __webpack_require__(84439);

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(globalThis, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    globalThis[key] = value;
  } return value;
};


/***/ }),

/***/ 96591:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(53668);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
});


/***/ }),

/***/ 35784:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var globalThis = __webpack_require__(84439);
var isObject = __webpack_require__(82917);

var document = globalThis.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ 41168:
/***/ ((module) => {

"use strict";

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ 46834:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var globalThis = __webpack_require__(84439);

var navigator = globalThis.navigator;
var userAgent = navigator && navigator.userAgent;

module.exports = userAgent ? String(userAgent) : '';


/***/ }),

/***/ 63782:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var globalThis = __webpack_require__(84439);
var userAgent = __webpack_require__(46834);

var process = globalThis.process;
var Deno = globalThis.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ 92202:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(25963);

var $Error = Error;
var replace = uncurryThis(''.replace);

var TEST = (function (arg) { return String(new $Error(arg).stack); })('zxcasd');
// eslint-disable-next-line redos/no-vulnerable, sonarjs/slow-regex -- safe
var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);

module.exports = function (stack, dropEntries) {
  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string' && !$Error.prepareStackTrace) {
    while (dropEntries--) stack = replace(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
  } return stack;
};


/***/ }),

/***/ 41044:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var createNonEnumerableProperty = __webpack_require__(70386);
var clearErrorStack = __webpack_require__(92202);
var ERROR_STACK_INSTALLABLE = __webpack_require__(73656);

// non-standard V8
var captureStackTrace = Error.captureStackTrace;

module.exports = function (error, C, stack, dropEntries) {
  if (ERROR_STACK_INSTALLABLE) {
    if (captureStackTrace) captureStackTrace(error, C);
    else createNonEnumerableProperty(error, 'stack', clearErrorStack(stack, dropEntries));
  }
};


/***/ }),

/***/ 73656:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(53668);
var createPropertyDescriptor = __webpack_require__(81329);

module.exports = !fails(function () {
  var error = new Error('a');
  if (!('stack' in error)) return true;
  // eslint-disable-next-line es/no-object-defineproperty -- safe
  Object.defineProperty(error, 'stack', createPropertyDescriptor(1, 7));
  return error.stack !== 7;
});


/***/ }),

/***/ 93499:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var globalThis = __webpack_require__(84439);
var getOwnPropertyDescriptor = (__webpack_require__(85534).f);
var createNonEnumerableProperty = __webpack_require__(70386);
var defineBuiltIn = __webpack_require__(82927);
var defineGlobalProperty = __webpack_require__(39548);
var copyConstructorProperties = __webpack_require__(47187);
var isForced = __webpack_require__(60015);

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = globalThis;
  } else if (STATIC) {
    target = globalThis[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = globalThis[TARGET] && globalThis[TARGET].prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ 53668:
/***/ ((module) => {

"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ 29968:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_BIND = __webpack_require__(76169);

var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es/no-function-prototype-bind, es/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});


/***/ }),

/***/ 76169:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(53668);

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ 72530:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_BIND = __webpack_require__(76169);

var call = Function.prototype.call;
// eslint-disable-next-line es/no-function-prototype-bind -- safe
module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ 47241:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(96591);
var hasOwn = __webpack_require__(3412);

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ 42055:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(25963);
var aCallable = __webpack_require__(14839);

module.exports = function (object, key, method) {
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
  } catch (error) { /* empty */ }
};


/***/ }),

/***/ 25963:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_BIND = __webpack_require__(76169);

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
// eslint-disable-next-line es/no-function-prototype-bind -- safe
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ 30454:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var globalThis = __webpack_require__(84439);
var isCallable = __webpack_require__(14226);

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(globalThis[namespace]) : globalThis[namespace] && globalThis[namespace][method];
};


/***/ }),

/***/ 13791:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var aCallable = __webpack_require__(14839);
var isNullOrUndefined = __webpack_require__(38904);

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ }),

/***/ 84439:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var check = function (it) {
  return it && it.Math === Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  check(typeof this == 'object' && this) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ }),

/***/ 3412:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(25963);
var toObject = __webpack_require__(31450);

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ 37050:
/***/ ((module) => {

"use strict";

module.exports = {};


/***/ }),

/***/ 78664:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var getBuiltIn = __webpack_require__(30454);

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),

/***/ 18264:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(96591);
var fails = __webpack_require__(53668);
var createElement = __webpack_require__(35784);

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a !== 7;
});


/***/ }),

/***/ 78042:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(25963);
var fails = __webpack_require__(53668);
var classof = __webpack_require__(73431);

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) === 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ 36348:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isCallable = __webpack_require__(14226);
var isObject = __webpack_require__(82917);
var setPrototypeOf = __webpack_require__(41312);

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    isCallable(NewTarget = dummy.constructor) &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};


/***/ }),

/***/ 94959:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(25963);
var isCallable = __webpack_require__(14226);
var store = __webpack_require__(97880);

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ 11299:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isObject = __webpack_require__(82917);
var createNonEnumerableProperty = __webpack_require__(70386);

// `InstallErrorCause` abstract operation
// https://tc39.es/proposal-error-cause/#sec-errorobjects-install-error-cause
module.exports = function (O, options) {
  if (isObject(options) && 'cause' in options) {
    createNonEnumerableProperty(O, 'cause', options.cause);
  }
};


/***/ }),

/***/ 17436:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_WEAK_MAP = __webpack_require__(73759);
var globalThis = __webpack_require__(84439);
var isObject = __webpack_require__(82917);
var createNonEnumerableProperty = __webpack_require__(70386);
var hasOwn = __webpack_require__(3412);
var shared = __webpack_require__(97880);
var sharedKey = __webpack_require__(50418);
var hiddenKeys = __webpack_require__(37050);

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = globalThis.TypeError;
var WeakMap = globalThis.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ 14226:
/***/ ((module) => {

"use strict";

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
var documentAll = typeof document == 'object' && document.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
module.exports = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ 60015:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(53668);
var isCallable = __webpack_require__(14226);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value === POLYFILL ? true
    : value === NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ 38904:
/***/ ((module) => {

"use strict";

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ }),

/***/ 82917:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isCallable = __webpack_require__(14226);

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ 99946:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isObject = __webpack_require__(82917);

module.exports = function (argument) {
  return isObject(argument) || argument === null;
};


/***/ }),

/***/ 69320:
/***/ ((module) => {

"use strict";

module.exports = false;


/***/ }),

/***/ 56882:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var getBuiltIn = __webpack_require__(30454);
var isCallable = __webpack_require__(14226);
var isPrototypeOf = __webpack_require__(46816);
var USE_SYMBOL_AS_UID = __webpack_require__(60511);

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ 71959:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toLength = __webpack_require__(11801);

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ 52240:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(25963);
var fails = __webpack_require__(53668);
var isCallable = __webpack_require__(14226);
var hasOwn = __webpack_require__(3412);
var DESCRIPTORS = __webpack_require__(96591);
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(47241).CONFIGURABLE);
var inspectSource = __webpack_require__(94959);
var InternalStateModule = __webpack_require__(17436);

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var $String = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var stringSlice = uncurryThis(''.slice);
var replace = uncurryThis(''.replace);
var join = uncurryThis([].join);

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
    name = '[' + replace($String(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


/***/ }),

/***/ 5760:
/***/ ((module) => {

"use strict";

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ 48088:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toString = __webpack_require__(54056);

module.exports = function (argument, $default) {
  return argument === undefined ? arguments.length < 2 ? '' : $default : toString(argument);
};


/***/ }),

/***/ 64515:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* global ActiveXObject -- old IE, WSH */
var anObject = __webpack_require__(49352);
var definePropertiesModule = __webpack_require__(85268);
var enumBugKeys = __webpack_require__(41168);
var hiddenKeys = __webpack_require__(37050);
var html = __webpack_require__(78664);
var documentCreateElement = __webpack_require__(35784);
var sharedKey = __webpack_require__(50418);

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  // eslint-disable-next-line no-useless-assignment -- avoid memory leak
  activeXDocument = null;
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};


/***/ }),

/***/ 85268:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(96591);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(57133);
var definePropertyModule = __webpack_require__(90484);
var anObject = __webpack_require__(49352);
var toIndexedObject = __webpack_require__(81958);
var objectKeys = __webpack_require__(98531);

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};


/***/ }),

/***/ 90484:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(96591);
var IE8_DOM_DEFINE = __webpack_require__(18264);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(57133);
var anObject = __webpack_require__(49352);
var toPropertyKey = __webpack_require__(23822);

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 85534:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(96591);
var call = __webpack_require__(72530);
var propertyIsEnumerableModule = __webpack_require__(48150);
var createPropertyDescriptor = __webpack_require__(81329);
var toIndexedObject = __webpack_require__(81958);
var toPropertyKey = __webpack_require__(23822);
var hasOwn = __webpack_require__(3412);
var IE8_DOM_DEFINE = __webpack_require__(18264);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ 13971:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var internalObjectKeys = __webpack_require__(22093);
var enumBugKeys = __webpack_require__(41168);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ 3994:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ 46816:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(25963);

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ 22093:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(25963);
var hasOwn = __webpack_require__(3412);
var toIndexedObject = __webpack_require__(81958);
var indexOf = (__webpack_require__(93980).indexOf);
var hiddenKeys = __webpack_require__(37050);

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ 98531:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var internalObjectKeys = __webpack_require__(22093);
var enumBugKeys = __webpack_require__(41168);

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),

/***/ 48150:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ 41312:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable no-proto -- safe */
var uncurryThisAccessor = __webpack_require__(42055);
var isObject = __webpack_require__(82917);
var requireObjectCoercible = __webpack_require__(7975);
var aPossiblePrototype = __webpack_require__(62947);

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    requireObjectCoercible(O);
    aPossiblePrototype(proto);
    if (!isObject(O)) return O;
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ 24653:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(72530);
var isCallable = __webpack_require__(14226);
var isObject = __webpack_require__(82917);

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw new $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 47066:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var getBuiltIn = __webpack_require__(30454);
var uncurryThis = __webpack_require__(25963);
var getOwnPropertyNamesModule = __webpack_require__(13971);
var getOwnPropertySymbolsModule = __webpack_require__(3994);
var anObject = __webpack_require__(49352);

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ 79877:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var defineProperty = (__webpack_require__(90484).f);

module.exports = function (Target, Source, key) {
  key in Target || defineProperty(Target, key, {
    configurable: true,
    get: function () { return Source[key]; },
    set: function (it) { Source[key] = it; }
  });
};


/***/ }),

/***/ 7975:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isNullOrUndefined = __webpack_require__(38904);

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ 50418:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var shared = __webpack_require__(74032);
var uid = __webpack_require__(86379);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ 97880:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var IS_PURE = __webpack_require__(69320);
var globalThis = __webpack_require__(84439);
var defineGlobalProperty = __webpack_require__(39548);

var SHARED = '__core-js_shared__';
var store = module.exports = globalThis[SHARED] || defineGlobalProperty(SHARED, {});

(store.versions || (store.versions = [])).push({
  version: '3.40.0',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2025 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.40.0/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ 74032:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var store = __webpack_require__(97880);

module.exports = function (key, value) {
  return store[key] || (store[key] = value || {});
};


/***/ }),

/***/ 54638:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(63782);
var fails = __webpack_require__(53668);
var globalThis = __webpack_require__(84439);

var $String = globalThis.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol('symbol detection');
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ 63513:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIntegerOrInfinity = __webpack_require__(54050);

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ 81958:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(78042);
var requireObjectCoercible = __webpack_require__(7975);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ 54050:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var trunc = __webpack_require__(5760);

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ 11801:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIntegerOrInfinity = __webpack_require__(54050);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  var len = toIntegerOrInfinity(argument);
  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ 31450:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var requireObjectCoercible = __webpack_require__(7975);

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ 50132:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(72530);
var isObject = __webpack_require__(82917);
var isSymbol = __webpack_require__(56882);
var getMethod = __webpack_require__(13791);
var ordinaryToPrimitive = __webpack_require__(24653);
var wellKnownSymbol = __webpack_require__(92704);

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw new $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ 23822:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toPrimitive = __webpack_require__(50132);
var isSymbol = __webpack_require__(56882);

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ 8695:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var wellKnownSymbol = __webpack_require__(92704);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ 54056:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var classof = __webpack_require__(43924);

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};


/***/ }),

/***/ 52824:
/***/ ((module) => {

"use strict";

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ 86379:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(25963);

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ 60511:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(54638);

module.exports = NATIVE_SYMBOL &&
  !Symbol.sham &&
  typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ 57133:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(96591);
var fails = __webpack_require__(53668);

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype !== 42;
});


/***/ }),

/***/ 69179:
/***/ ((module) => {

"use strict";

var $TypeError = TypeError;

module.exports = function (passed, required) {
  if (passed < required) throw new $TypeError('Not enough arguments');
  return passed;
};


/***/ }),

/***/ 73759:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var globalThis = __webpack_require__(84439);
var isCallable = __webpack_require__(14226);

var WeakMap = globalThis.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ }),

/***/ 92704:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var globalThis = __webpack_require__(84439);
var shared = __webpack_require__(74032);
var hasOwn = __webpack_require__(3412);
var uid = __webpack_require__(86379);
var NATIVE_SYMBOL = __webpack_require__(54638);
var USE_SYMBOL_AS_UID = __webpack_require__(60511);

var Symbol = globalThis.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
      ? Symbol[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ 58102:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var getBuiltIn = __webpack_require__(30454);
var hasOwn = __webpack_require__(3412);
var createNonEnumerableProperty = __webpack_require__(70386);
var isPrototypeOf = __webpack_require__(46816);
var setPrototypeOf = __webpack_require__(41312);
var copyConstructorProperties = __webpack_require__(47187);
var proxyAccessor = __webpack_require__(79877);
var inheritIfRequired = __webpack_require__(36348);
var normalizeStringArgument = __webpack_require__(48088);
var installErrorCause = __webpack_require__(11299);
var installErrorStack = __webpack_require__(41044);
var DESCRIPTORS = __webpack_require__(96591);
var IS_PURE = __webpack_require__(69320);

module.exports = function (FULL_NAME, wrapper, FORCED, IS_AGGREGATE_ERROR) {
  var STACK_TRACE_LIMIT = 'stackTraceLimit';
  var OPTIONS_POSITION = IS_AGGREGATE_ERROR ? 2 : 1;
  var path = FULL_NAME.split('.');
  var ERROR_NAME = path[path.length - 1];
  var OriginalError = getBuiltIn.apply(null, path);

  if (!OriginalError) return;

  var OriginalErrorPrototype = OriginalError.prototype;

  // V8 9.3- bug https://bugs.chromium.org/p/v8/issues/detail?id=12006
  if (!IS_PURE && hasOwn(OriginalErrorPrototype, 'cause')) delete OriginalErrorPrototype.cause;

  if (!FORCED) return OriginalError;

  var BaseError = getBuiltIn('Error');

  var WrappedError = wrapper(function (a, b) {
    var message = normalizeStringArgument(IS_AGGREGATE_ERROR ? b : a, undefined);
    var result = IS_AGGREGATE_ERROR ? new OriginalError(a) : new OriginalError();
    if (message !== undefined) createNonEnumerableProperty(result, 'message', message);
    installErrorStack(result, WrappedError, result.stack, 2);
    if (this && isPrototypeOf(OriginalErrorPrototype, this)) inheritIfRequired(result, this, WrappedError);
    if (arguments.length > OPTIONS_POSITION) installErrorCause(result, arguments[OPTIONS_POSITION]);
    return result;
  });

  WrappedError.prototype = OriginalErrorPrototype;

  if (ERROR_NAME !== 'Error') {
    if (setPrototypeOf) setPrototypeOf(WrappedError, BaseError);
    else copyConstructorProperties(WrappedError, BaseError, { name: true });
  } else if (DESCRIPTORS && STACK_TRACE_LIMIT in OriginalError) {
    proxyAccessor(WrappedError, OriginalError, STACK_TRACE_LIMIT);
    proxyAccessor(WrappedError, OriginalError, 'prepareStackTrace');
  }

  copyConstructorProperties(WrappedError, OriginalError);

  if (!IS_PURE) try {
    // Safari 13- bug: WebAssembly errors does not have a proper `.name`
    if (OriginalErrorPrototype.name !== ERROR_NAME) {
      createNonEnumerableProperty(OriginalErrorPrototype, 'name', ERROR_NAME);
    }
    OriginalErrorPrototype.constructor = WrappedError;
  } catch (error) { /* empty */ }

  return WrappedError;
};


/***/ }),

/***/ 92588:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(93499);
var $includes = (__webpack_require__(93980).includes);
var fails = __webpack_require__(53668);
var addToUnscopables = __webpack_require__(38228);

// FF99+ bug
var BROKEN_ON_SPARSE = fails(function () {
  // eslint-disable-next-line es/no-array-prototype-includes -- detection
  return !Array(1).includes();
});

// `Array.prototype.includes` method
// https://tc39.es/ecma262/#sec-array.prototype.includes
$({ target: 'Array', proto: true, forced: BROKEN_ON_SPARSE }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');


/***/ }),

/***/ 6277:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable no-unused-vars -- required for functions `.length` */
var $ = __webpack_require__(93499);
var globalThis = __webpack_require__(84439);
var apply = __webpack_require__(29968);
var wrapErrorConstructorWithCause = __webpack_require__(58102);

var WEB_ASSEMBLY = 'WebAssembly';
var WebAssembly = globalThis[WEB_ASSEMBLY];

// eslint-disable-next-line es/no-error-cause -- feature detection
var FORCED = new Error('e', { cause: 7 }).cause !== 7;

var exportGlobalErrorCauseWrapper = function (ERROR_NAME, wrapper) {
  var O = {};
  O[ERROR_NAME] = wrapErrorConstructorWithCause(ERROR_NAME, wrapper, FORCED);
  $({ global: true, constructor: true, arity: 1, forced: FORCED }, O);
};

var exportWebAssemblyErrorCauseWrapper = function (ERROR_NAME, wrapper) {
  if (WebAssembly && WebAssembly[ERROR_NAME]) {
    var O = {};
    O[ERROR_NAME] = wrapErrorConstructorWithCause(WEB_ASSEMBLY + '.' + ERROR_NAME, wrapper, FORCED);
    $({ target: WEB_ASSEMBLY, stat: true, constructor: true, arity: 1, forced: FORCED }, O);
  }
};

// https://tc39.es/ecma262/#sec-nativeerror
exportGlobalErrorCauseWrapper('Error', function (init) {
  return function Error(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('EvalError', function (init) {
  return function EvalError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('RangeError', function (init) {
  return function RangeError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('ReferenceError', function (init) {
  return function ReferenceError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('SyntaxError', function (init) {
  return function SyntaxError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('TypeError', function (init) {
  return function TypeError(message) { return apply(init, this, arguments); };
});
exportGlobalErrorCauseWrapper('URIError', function (init) {
  return function URIError(message) { return apply(init, this, arguments); };
});
exportWebAssemblyErrorCauseWrapper('CompileError', function (init) {
  return function CompileError(message) { return apply(init, this, arguments); };
});
exportWebAssemblyErrorCauseWrapper('LinkError', function (init) {
  return function LinkError(message) { return apply(init, this, arguments); };
});
exportWebAssemblyErrorCauseWrapper('RuntimeError', function (init) {
  return function RuntimeError(message) { return apply(init, this, arguments); };
});


/***/ }),

/***/ 92218:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var defineBuiltIn = __webpack_require__(82927);
var uncurryThis = __webpack_require__(25963);
var toString = __webpack_require__(54056);
var validateArgumentsLength = __webpack_require__(69179);

var $URLSearchParams = URLSearchParams;
var URLSearchParamsPrototype = $URLSearchParams.prototype;
var append = uncurryThis(URLSearchParamsPrototype.append);
var $delete = uncurryThis(URLSearchParamsPrototype['delete']);
var forEach = uncurryThis(URLSearchParamsPrototype.forEach);
var push = uncurryThis([].push);
var params = new $URLSearchParams('a=1&a=2&b=3');

params['delete']('a', 1);
// `undefined` case is a Chromium 117 bug
// https://bugs.chromium.org/p/v8/issues/detail?id=14222
params['delete']('b', undefined);

if (params + '' !== 'a=2') {
  defineBuiltIn(URLSearchParamsPrototype, 'delete', function (name /* , value */) {
    var length = arguments.length;
    var $value = length < 2 ? undefined : arguments[1];
    if (length && $value === undefined) return $delete(this, name);
    var entries = [];
    forEach(this, function (v, k) { // also validates `this`
      push(entries, { key: k, value: v });
    });
    validateArgumentsLength(length, 1);
    var key = toString(name);
    var value = toString($value);
    var index = 0;
    var dindex = 0;
    var found = false;
    var entriesLength = entries.length;
    var entry;
    while (index < entriesLength) {
      entry = entries[index++];
      if (found || entry.key === key) {
        found = true;
        $delete(this, entry.key);
      } else dindex++;
    }
    while (dindex < entriesLength) {
      entry = entries[dindex++];
      if (!(entry.key === key && entry.value === value)) append(this, entry.key, entry.value);
    }
  }, { enumerable: true, unsafe: true });
}


/***/ }),

/***/ 97273:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var defineBuiltIn = __webpack_require__(82927);
var uncurryThis = __webpack_require__(25963);
var toString = __webpack_require__(54056);
var validateArgumentsLength = __webpack_require__(69179);

var $URLSearchParams = URLSearchParams;
var URLSearchParamsPrototype = $URLSearchParams.prototype;
var getAll = uncurryThis(URLSearchParamsPrototype.getAll);
var $has = uncurryThis(URLSearchParamsPrototype.has);
var params = new $URLSearchParams('a=1');

// `undefined` case is a Chromium 117 bug
// https://bugs.chromium.org/p/v8/issues/detail?id=14222
if (params.has('a', 2) || !params.has('a', undefined)) {
  defineBuiltIn(URLSearchParamsPrototype, 'has', function has(name /* , value */) {
    var length = arguments.length;
    var $value = length < 2 ? undefined : arguments[1];
    if (length && $value === undefined) return $has(this, name);
    var values = getAll(this, name); // also validates `this`
    validateArgumentsLength(length, 1);
    var value = toString($value);
    var index = 0;
    while (index < values.length) {
      if (values[index++] === value) return true;
    } return false;
  }, { enumerable: true, unsafe: true });
}


/***/ }),

/***/ 1180:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(96591);
var uncurryThis = __webpack_require__(25963);
var defineBuiltInAccessor = __webpack_require__(39627);

var URLSearchParamsPrototype = URLSearchParams.prototype;
var forEach = uncurryThis(URLSearchParamsPrototype.forEach);

// `URLSearchParams.prototype.size` getter
// https://github.com/whatwg/url/pull/734
if (DESCRIPTORS && !('size' in URLSearchParamsPrototype)) {
  defineBuiltInAccessor(URLSearchParamsPrototype, 'size', {
    get: function size() {
      var count = 0;
      forEach(this, function () { count++; });
      return count;
    },
    configurable: true,
    enumerable: true
  });
}


/***/ }),

/***/ 73167:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ Icon)
});

// EXTERNAL MODULE: ./node_modules/preact/dist/preact.module.js
var preact_module = __webpack_require__(96445);
;// ./node_modules/lucide-preact/dist/esm/defaultAttributes.mjs
/**
 * @license lucide-preact v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};


//# sourceMappingURL=defaultAttributes.mjs.map

// EXTERNAL MODULE: ./node_modules/preact/hooks/dist/hooks.module.js
var hooks_module = __webpack_require__(52297);
;// ./node_modules/lucide-preact/dist/esm/context.mjs
/**
 * @license lucide-preact v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */




const LucideContext = (0,preact_module/* createContext */.q6)({
  size: 24,
  color: "currentColor",
  strokeWidth: 2,
  absoluteStrokeWidth: false,
  class: ""
});
function LucideProvider({
  children,
  size,
  color,
  strokeWidth,
  absoluteStrokeWidth,
  class: className
}) {
  const value = useMemo(
    () => ({
      size,
      color,
      strokeWidth,
      absoluteStrokeWidth,
      class: className
    }),
    [size, color, strokeWidth, absoluteStrokeWidth, className]
  );
  return h(LucideContext.Provider, { value }, children);
}
const useLucideContext = () => (0,hooks_module/* useContext */.NT)(LucideContext);


//# sourceMappingURL=context.mjs.map

;// ./node_modules/lucide-preact/dist/esm/shared/src/utils/hasA11yProp.mjs
/**
 * @license lucide-preact v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};


//# sourceMappingURL=hasA11yProp.mjs.map

// EXTERNAL MODULE: ./node_modules/lucide-preact/dist/esm/shared/src/utils/mergeClasses.mjs
var mergeClasses = __webpack_require__(84545);
;// ./node_modules/lucide-preact/dist/esm/Icon.mjs
/**
 * @license lucide-preact v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */







const Icon = ({
  color,
  size,
  strokeWidth,
  absoluteStrokeWidth,
  children,
  iconNode,
  class: classes = "",
  ...rest
}) => {
  const {
    size: contextSize = 24,
    strokeWidth: contextStrokeWidth = 2,
    absoluteStrokeWidth: contextAbsoluteStrokeWidth = false,
    color: contextColor = "currentColor",
    class: contextClass = ""
  } = useLucideContext() ?? {};
  const calculatedStrokeWidth = absoluteStrokeWidth ?? contextAbsoluteStrokeWidth ? Number(strokeWidth ?? contextStrokeWidth) * 24 / Number(size ?? contextSize) : strokeWidth ?? contextStrokeWidth;
  return (0,preact_module.h)(
    "svg",
    {
      ...defaultAttributes,
      width: size ?? contextSize ?? 24,
      height: size ?? contextSize ?? 24,
      stroke: color ?? contextColor,
      ["stroke-width"]: calculatedStrokeWidth,
      class: (0,mergeClasses/* mergeClasses */.z)("lucide", contextClass, classes),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [...iconNode.map(([tag, attrs]) => (0,preact_module.h)(tag, attrs)), ...(0,preact_module/* toChildArray */.v2)(children)]
  );
};


//# sourceMappingURL=Icon.mjs.map


/***/ }),

/***/ 2448:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ createLucideIcon)
});

// EXTERNAL MODULE: ./node_modules/preact/dist/preact.module.js
var preact_module = __webpack_require__(96445);
// EXTERNAL MODULE: ./node_modules/lucide-preact/dist/esm/shared/src/utils/mergeClasses.mjs
var mergeClasses = __webpack_require__(84545);
;// ./node_modules/lucide-preact/dist/esm/shared/src/utils/toKebabCase.mjs
/**
 * @license lucide-preact v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();


//# sourceMappingURL=toKebabCase.mjs.map

;// ./node_modules/lucide-preact/dist/esm/shared/src/utils/toCamelCase.mjs
/**
 * @license lucide-preact v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);


//# sourceMappingURL=toCamelCase.mjs.map

;// ./node_modules/lucide-preact/dist/esm/shared/src/utils/toPascalCase.mjs
/**
 * @license lucide-preact v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};


//# sourceMappingURL=toPascalCase.mjs.map

// EXTERNAL MODULE: ./node_modules/lucide-preact/dist/esm/Icon.mjs + 3 modules
var Icon = __webpack_require__(73167);
;// ./node_modules/lucide-preact/dist/esm/createLucideIcon.mjs
/**
 * @license lucide-preact v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */







const createLucideIcon = (iconName, iconNode) => {
  const Component = ({ class: classes = "", className = "", children, ...props }) => (0,preact_module.h)(
    Icon/* default */.A,
    {
      ...props,
      iconNode,
      class: (0,mergeClasses/* mergeClasses */.z)(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${toKebabCase(iconName)}`,
        classes,
        className
      )
    },
    children
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};


//# sourceMappingURL=createLucideIcon.mjs.map


/***/ }),

/***/ 7337:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Info)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2448);
/**
 * @license lucide-preact v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Info = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("info", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
]);


//# sourceMappingURL=info.mjs.map


/***/ }),

/***/ 22830:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Settings)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2448);
/**
 * @license lucide-preact v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Settings = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);


//# sourceMappingURL=settings.mjs.map


/***/ }),

/***/ 36853:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ ShieldCheck)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2448);
/**
 * @license lucide-preact v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const ShieldCheck = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("shield-check", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);


//# sourceMappingURL=shield-check.mjs.map


/***/ }),

/***/ 16692:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ TriangleAlert)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2448);
/**
 * @license lucide-preact v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const TriangleAlert = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("triangle-alert", [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
]);


//# sourceMappingURL=triangle-alert.mjs.map


/***/ }),

/***/ 84545:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   z: () => (/* binding */ mergeClasses)
/* harmony export */ });
/**
 * @license lucide-preact v1.34.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();


//# sourceMappingURL=mergeClasses.mjs.map


/***/ }),

/***/ 51643:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c$: () => (/* binding */ buildUrl),
/* harmony export */   tr: () => (/* binding */ ExternalLinks),
/* harmony export */   yI: () => (/* binding */ Endpoint)
/* harmony export */ });
/* harmony import */ var core_js_modules_web_url_search_params_delete_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(92218);
/* harmony import */ var core_js_modules_web_url_search_params_has_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(97273);
/* harmony import */ var core_js_modules_web_url_search_params_size_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1180);



const BASE_URL =  true ? 'https://adblockultimate.net' : 0;
const Endpoint = {
    Homepage: '/',
    Installed: '/welcome',
    Updated: '/updated',
    Uninstall: '/uninstall',
    Upgrade: '/upgrade',
    RateExtension: '/rate-extension',
    Report: '/report',
    Privacy: '/privacy',
    Contact: '/contact',
    Windows: '/windows',
    Mac: '/mac',
    Android: '/android',
    Ios: '/ios',
    Feedback: '/feedback-extension'
};
const ExternalLinks = {
    FACEBOOK: 'https://facebook.com/AdBlockUltimate',
    X: 'https://x.com/AdBlockUltimate',
    CROWDIN: 'https://crowdin.com/profile/adblockultimate',
    CHROME_STORE: 'https://chromewebstore.google.com/detail/adblocker-ultimate/ohahllgiabjaoigichmmfljhkcfikeof',
    FIREFOX_STORE: 'https://addons.mozilla.org/firefox/addon/adblocker-ultimate/',
    EDGE_STORE: 'https://microsoftedge.microsoft.com/addons/detail/adblocker-ultimate/pciakllldcajllepkbbihkmfadfhpgel'
};
function buildUrl(endpoint, params = {}) {
    const url = new URL(endpoint, BASE_URL);
    Object.entries(params).forEach(([key, value])=>{
        url.searchParams.set(key, value);
    });
    return url.toString();
}


/***/ }),

/***/ 44210:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ag: () => (/* binding */ PROMO_BANNER_DISMISSED_PREFIX),
/* harmony export */   GZ: () => (/* binding */ SettingOption),
/* harmony export */   VR: () => (/* binding */ OPTIONS_PROMO_DISMISSED_KEY)
/* harmony export */ });
/* unused harmony exports APP_VERSION_KEY, SETTINGS_KEY, INSTALLED_ON_KEY, LAST_UPDATE_KEY, SHOW_RATE_US_POPUP_KEY, PAGE_STATISTIC_KEY, TRUSTED_DOCUMENTS_CACHE_KEY, RULES_LIMITS_KEY, CONTENT_SCRIPT_INJECTION_FLAG, DESKTOP_APP_ACTIVE_KEY, DESKTOP_APP_INSTALLED_KEY, UPDATE_CHECK_TIME_KEY */
// Settings keys (user preferences)
const SettingOption = {
    // General settings.
    ShowPageStats: 'show-page-stats',
    AutoDetectFilters: 'auto-detect-filters',
    FiltersUpdatePeriod: 'filters-update-period',
    // Extension specific settings.
    ShowContextMenu: 'show-context-menu',
    ThemeMode: 'theme-mode',
    // Allowlist section.
    AllowlistDomains: 'allowlist-domains',
    // Filters' statuses and states.
    FiltersState: 'filters-state',
    FiltersVersion: 'filters-version',
    GroupsState: 'groups-state',
    // Filters metadata.
    Metadata: 'filters-metadata',
    CustomFilters: 'custom-filters'
};
// System/operational storage keys
const APP_VERSION_KEY = 'app-version';
const SETTINGS_KEY = 'settings';
const INSTALLED_ON_KEY = 'installed-on';
const LAST_UPDATE_KEY = 'last-update';
const SHOW_RATE_US_POPUP_KEY = 'show-rate-us-popup';
const PAGE_STATISTIC_KEY = 'page-statistic';
const TRUSTED_DOCUMENTS_CACHE_KEY = 'trusted-documents';
const RULES_LIMITS_KEY = 'rules-limits';
const CONTENT_SCRIPT_INJECTION_FLAG = 'content-script-injection-flag';
// Desktop app integration keys
const DESKTOP_APP_ACTIVE_KEY = 'desktop-app-active';
const DESKTOP_APP_INSTALLED_KEY = 'desktop-app-installed';
// Filter update controller key
const UPDATE_CHECK_TIME_KEY = 'update-check-time-ms';
// Promotional banner key prefix
const PROMO_BANNER_DISMISSED_PREFIX = 'promotionalBannerDismissed_';
// Options page upsell callout
const OPTIONS_PROMO_DISMISSED_KEY = 'options-promo-dismissed';


/***/ }),

/***/ 75129:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   I4: () => (/* binding */ getMessage),
/* harmony export */   mO: () => (/* binding */ initDevLocale)
/* harmony export */ });
/* unused harmony exports DEV_LOCALES, getUiDir, applyDocumentLocale, getDevLocale, getDevLocaleState, applyDevLocale, setDevLocale */
/* harmony import */ var core_js_modules_es_error_cause_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6277);
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(61934);
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(65293);



// Kept in browser.storage.local (not localStorage) so the background worker,
// which composes toast and context-menu strings, can read it too.
const DEV_LOCALE_STORAGE_KEY = 'abu-dev-ui-locale';
const RTL_LOCALES = new Set([
    'ar',
    'he',
    'fa'
]);
let overrideMessages = null;
let devLocale = '';
/** Locale folder names from `src/resources/_locales` (injected at build time). */ const DEV_LOCALES = (/* unused pure expression or super */ null && ( true ? [] : 0));
function applySubstitutions(message, substitutions, placeholders) {
    const subs = substitutions == null ? [] : Array.isArray(substitutions) ? substitutions : [
        substitutions
    ];
    let result = message;
    if (placeholders) {
        for (const [name, { content }] of Object.entries(placeholders)){
            // Chrome only supports positional $1–$9 in placeholder content.
            const resolved = String(content).replace(/\$([1-9])/g, (_, n)=>{
                const value = subs[Number(n) - 1];
                return value !== undefined ? String(value) : '';
            });
            result = result.replace(new RegExp(`\\$${name}\\$`, 'gi'), ()=>resolved);
        }
    }
    // Chrome: $$ → literal $; only $1–$9 are substitution slots.
    result = result.replace(/\$\$|\$([1-9])/g, (match, n)=>{
        if (match === '$$') {
            return '$';
        }
        const value = subs[Number(n) - 1];
        return value !== undefined ? String(value) : match;
    });
    return result;
}
/** UI direction for the active locale: DEV override if set, else `@@bidi_dir`. */ function getUiDir() {
    if (devLocale) {
        return RTL_LOCALES.has(devLocale) ? 'rtl' : 'ltr';
    }
    return webextension_polyfill__WEBPACK_IMPORTED_MODULE_1__.i18n.getMessage('@@bidi_dir') || 'ltr';
}
/** Sets `dir` (and `lang` when a DEV locale override is active) on a document. */ function applyDocumentLocale(doc) {
    if (!doc?.documentElement) {
        return;
    }
    if (devLocale) {
        doc.documentElement.lang = devLocale.replace(/_/g, '-');
    }
    doc.documentElement.dir = getUiDir();
}
/** Resolved during initDevLocale; empty when using the browser language. */ function getDevLocale() {
    return devLocale;
}
/** Snapshot for the background GetDevLocale handler / content-script inject. */ function getDevLocaleState() {
    return {
        locale: devLocale,
        messages: overrideMessages
    };
}
/**
 * Injects an override pack into this bundle's i18n module state.
 * Used by content-script contexts that receive the pack from the background.
 * Does not touch `document` — call `applyDocumentLocale` separately (e.g. on
 * an iframe doc) so content scripts never mutate the host page's lang/dir.
 */ function applyDevLocale(state = {}) {
    if (state.locale !== undefined) {
        devLocale = state.locale || '';
    }
    if (state.messages !== undefined) {
        overrideMessages = state.messages || null;
    }
}
/** Persist override and reload. Pass empty to clear. */ async function setDevLocale(locale) {
    if (true) {
        return;
    }
    if (locale) {
        await browser.storage.local.set({
            [DEV_LOCALE_STORAGE_KEY]: locale
        });
    } else {
        await browser.storage.local.remove(DEV_LOCALE_STORAGE_KEY);
    }
    location.reload();
}
async function loadOverride(locale) {
    if (!locale) {
        applyDevLocale({
            locale: '',
            messages: null
        });
    } else {
        try {
            const response = await fetch(webextension_polyfill__WEBPACK_IMPORTED_MODULE_1__.runtime.getURL(`_locales/${locale}/messages.json`));
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            applyDevLocale({
                locale,
                messages: await response.json()
            });
        } catch (e) {
            _logger__WEBPACK_IMPORTED_MODULE_2__/* .logger */ .v.warn(`[i18n] Failed to load DEV locale "${locale}":`, e);
            applyDevLocale({
                locale: '',
                messages: null
            });
        }
    }
    // Extension pages only — content scripts never call loadOverride.
    if (typeof document !== 'undefined') {
        applyDocumentLocale(document);
    }
}
/**
 * Loads the DEV locale override before the first getMessage call, and always
 * applies `dir` on extension pages. Call it on pages before render and on
 * background startup. The override load is a no-op in release builds.
 *
 * Pass `{ watch: true }` from the background so the pack stays in sync when
 * Options changes the override (pages reload on switch and do not need this).
 */ async function initDevLocale({ watch = false } = {}) {
    if (true) {
        if (typeof document !== 'undefined') {
            applyDocumentLocale(document);
        }
        return;
    }
    if (watch) {
        webextension_polyfill__WEBPACK_IMPORTED_MODULE_1__.storage.onChanged.addListener((changes, area)=>{
            if (area === 'local' && DEV_LOCALE_STORAGE_KEY in changes) {
                loadOverride(changes[DEV_LOCALE_STORAGE_KEY].newValue || '');
            }
        });
    }
    const stored = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_1__.storage.local.get(DEV_LOCALE_STORAGE_KEY);
    await loadOverride(stored[DEV_LOCALE_STORAGE_KEY] || '');
}
function getMessage(messageName, substitutions = []) {
    if (false) {}
    return webextension_polyfill__WEBPACK_IMPORTED_MODULE_1__.i18n.getMessage(messageName, substitutions);
}


/***/ }),

/***/ 65293:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   v: () => (/* binding */ logger)
/* harmony export */ });
/* unused harmony export getErrorMessage */
/* harmony import */ var core_js_modules_es_error_cause_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6277);

const LEVELS = {
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    verbose: 5
};
const METHOD = {
    error: 'error',
    warn: 'warn',
    info: 'info',
    debug: 'debug',
    verbose: 'trace'
};
let levelNum =  true ? LEVELS.info : 0;
let level =  true ? 'info' : 0;
function getErrorMessage(error) {
    if (typeof error === 'object' && error !== null && typeof error.message === 'string') {
        return error.message;
    }
    try {
        return JSON.stringify(error);
    } catch  {
        return String(error);
    }
}
function log(lvl, args) {
    if (levelNum < LEVELS[lvl] || !args.length || !args[0]) {
        return;
    }
    // eslint-disable-next-line no-console
    console[METHOD[lvl]](...args);
}
const logger = {
    get currentLevel () {
        return level;
    },
    set currentLevel (l){
        if (!LEVELS[l]) {
            throw new Error(`Unsupported log level: ${l}`);
        }
        level = l;
        levelNum = LEVELS[l];
    },
    isVerbose: ()=>levelNum >= LEVELS.debug,
    error: (...args)=>log('error', args),
    warn: (...args)=>log('warn', args),
    info: (...args)=>log('info', args),
    debug: (...args)=>log('debug', args),
    trace: (...args)=>log('verbose', args)
};



/***/ }),

/***/ 83351:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   G: () => (/* binding */ MessageType),
/* harmony export */   z: () => (/* binding */ APP_MESSAGE_HANDLER_NAME)
/* harmony export */ });
const APP_MESSAGE_HANDLER_NAME = 'app';
const MessageType = {
    CreateEventListener: 'createEventListener',
    RemoveListener: 'removeListener',
    OpenExtensionStore: 'openExtensionStore',
    SetFilterEnabled: 'setFilterEnabled',
    GetUserRules: 'getUserRules',
    SaveUserRules: 'saveUserRules',
    GetAllowlistDomains: 'getAllowlistDomains',
    SaveAllowlistDomains: 'saveAllowlistDomains',
    CheckFiltersUpdate: 'checkFiltersUpdate',
    LoadCustomFilterInfo: 'loadCustomFilterInfo',
    SubscribeToCustomFilter: 'subscribeToCustomFilter',
    RemoveAntiBannerFilter: 'removeAntiBannerFilter',
    GetIsAppInitialized: 'getIsAppInitialized',
    GetTabInfoForPopup: 'getTabInfoForPopup',
    ChangeApplicationFilteringPaused: 'changeApplicationFilteringPaused',
    OpenRulesLimitsTab: 'openRulesLimitsTab',
    OpenSettingsTab: 'openSettingsTab',
    OpenAssistant: 'openAssistant',
    OpenAbuseTab: 'openAbuseTab',
    OpenSiteReportTab: 'openSiteReportTab',
    OpenChromeExtensionsSettingsPage: 'openChromeExtensionsSettingsPage',
    OpenExtensionDetailsPage: 'openExtensionDetailsPage',
    RemoveAllowlistDomain: 'removeAllowlistDomain',
    AddAllowlistDomainForTabId: 'addAllowlistDomainForTabId',
    RefreshPage: 'refreshPage',
    AddUserRule: 'addUserRule',
    RemoveUserRule: 'removeUserRule',
    SetGroupEnabled: 'setGroupEnabled',
    NotifyListeners: 'notifyListeners',
    AddLongLivedConnection: 'addLongLivedConnection',
    GetOptionsData: 'getOptionsData',
    ChangeUserSettings: 'changeUserSetting',
    GetSelectorsAndScripts: 'getSelectorsAndScripts',
    CheckPageScriptWrapperRequest: 'checkPageScriptWrapperRequest',
    ProcessShouldCollapse: 'processShouldCollapse',
    ProcessShouldCollapseMany: 'processShouldCollapseMany',
    GetCookieRules: 'getCookieRules',
    SaveCookieLogEvent: 'saveCookieRuleEvent',
    AddUrlToTrusted: 'addUrlToTrusted',
    GetEditorStorageContent: 'getEditorStorageContent',
    SetEditorStorageContent: 'setEditorStorageContent',
    AppInitialized: 'appInitialized',
    UpdateTotalBlocked: 'updateTotalBlocked',
    UpdateLimitsVerdict: 'updateLimitsVerdict',
    ScriptletCloseWindow: 'scriptletCloseWindow',
    ShowRuleLimitsAlert: 'showRuleLimitsAlert',
    ShowRateUsPopup: 'showRateUsPopup',
    ShowAlertPopup: 'showAlertPopup',
    UpdateListeners: 'updateListeners',
    CurrentLimitsMv3: 'currentLimitsMv3',
    GetRulesLimitsCountersMv3: 'getRulesLimitsCountersMv3',
    GetDesktopAppStatus: 'getDesktopAppStatus',
    SendFeedback: 'sendFeedback',
    GetRateUsEligibility: 'getRateUsEligibility',
    GetWelcomeState: 'getWelcomeState',
    ApplyWelcomeSettings: 'applyWelcomeSettings',
    GetThemeMode: 'getThemeMode',
    GetDevLocale: 'getDevLocale'
};


/***/ }),

/***/ 75002:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   t: () => (/* binding */ unwrapErrorResponse)
/* harmony export */ });
/* unused harmony export wrapErrorResponse */
/* harmony import */ var core_js_modules_es_error_cause_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6277);
/**
 * Error transport for app messages.
 *
 * Errors thrown in background message handlers cannot be propagated to the
 * sender as promise rejections: Chrome's native promise-based messaging
 * (used since webextension-polyfill passes through the native `browser`
 * namespace when available) re-wraps rejected values and mangles their
 * `message` (e.g. 'limits_exceeded' arrives as 'Error: limits_exceeded').
 * Instead, handlers respond with a plain envelope object which the sender
 * side converts back into a thrown Error.
 *
 * This module must stay dependency-free: it is bundled into content scripts.
 */ /** Marker key for error responses produced by {@link wrapErrorResponse}. */ 
const ERROR_RESPONSE_KEY = '__appMessagingError__';
/**
 * Wraps a handler error into a plain response object that survives the
 * messaging boundary verbatim.
 *
 * @param {unknown} e Error thrown by a message handler.
 * @returns {object} Error envelope response.
 */ const wrapErrorResponse = (e)=>{
    return {
        [ERROR_RESPONSE_KEY]: {
            name: e instanceof Error ? e.name : 'Error',
            message: e instanceof Error ? e.message : String(e)
        }
    };
};
/**
 * Rethrows an error transported via {@link wrapErrorResponse}, if the
 * response is such an envelope. Otherwise does nothing.
 *
 * @param {unknown} response Response received from the background.
 * @throws {Error} The reconstructed handler error.
 */ const unwrapErrorResponse = (response)=>{
    if (typeof response === 'object' && response !== null && ERROR_RESPONSE_KEY in response) {
        const { name, message } = response[ERROR_RESPONSE_KEY];
        const error = new Error(message);
        error.name = name;
        throw error;
    }
};


/***/ }),

/***/ 37382:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Et: () => (/* reexport safe */ _message_handler__WEBPACK_IMPORTED_MODULE_2__.Et),
/* harmony export */   Go: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.G),
/* harmony export */   oL: () => (/* reexport safe */ _message_handler__WEBPACK_IMPORTED_MODULE_2__.oL),
/* harmony export */   tt: () => (/* reexport safe */ _error_response__WEBPACK_IMPORTED_MODULE_3__.t),
/* harmony export */   zk: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_0__.z)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(83351);
/* harmony import */ var _send_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62144);
/* harmony import */ var _message_handler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(50940);
/* harmony import */ var _error_response__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(75002);
/**
 * Since exports from './constants' are: the MessageType enum and a lot of types,
 * and imports there are types only, so it should not affect bundle size
 */ // eslint-disable-next-line no-restricted-syntax






/***/ }),

/***/ 50940:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Et: () => (/* binding */ messageHasTypeField),
/* harmony export */   oL: () => (/* binding */ messageHasTypeAndDataFields)
/* harmony export */ });
/* unused harmony export MessageHandler */
/* harmony import */ var core_js_modules_es_error_cause_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6277);
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(61934);
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(65293);
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else obj[key] = value;
    return obj;
}



const messageHasTypeField = (message)=>{
    return typeof message === 'object' && message !== null && 'type' in message;
};
const messageHasTypeAndDataFields = (message)=>{
    return messageHasTypeField(message) && 'data' in message;
};
class MessageHandler {
    static isValidMessageType(message) {
        return messageHasTypeField(message) && typeof message.type === 'string';
    }
    init() {
        browser.runtime.onMessage.addListener(this.handleMessage);
    }
    handleMessage(message, sender) {
        if (this.customHandler && typeof this.customHandler === 'function') {
            const res = this.customHandler(message, sender);
            if (res !== undefined) {
                return res;
            }
        }
        const listener = this.listeners.get(message.type);
        if (!listener) {
            return;
        }
        const fn = async ()=>{
            try {
                return await listener(message, sender);
            } catch (e) {
                logger.error('An error occurred while handling message:', message, 'error:', e);
                throw e;
            }
        };
        return fn();
    }
    addListener(type, listener) {
        if (this.listeners.has(type)) {
            throw new Error(`Message handler: ${type} listener has already been registered`);
        }
        this.listeners.set(type, listener);
    }
    removeListeners() {
        this.listeners.clear();
    }
    constructor(customHandler){
        _define_property(this, "listeners", new Map());
        this.handleMessage = this.handleMessage.bind(this);
        this.customHandler = customHandler;
    }
}


/***/ }),

/***/ 62144:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* unused harmony exports sendMessage, sendTabMessage */
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(61934);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(83351);
/* harmony import */ var _error_response__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(75002);



async function sendMessage(message) {
    try {
        const response = await browser.runtime.sendMessage({
            handlerName: APP_MESSAGE_HANDLER_NAME,
            ...message
        });
        // Rethrows handler errors transported as error-envelope responses
        // (swallowed below, as before, since callers do not consume errors).
        unwrapErrorResponse(response);
        return response;
    } catch (e) {
    // do nothing
    }
}
async function sendTabMessage(tabId, message) {
    return browser.tabs.sendMessage(tabId, {
        handlerName: APP_MESSAGE_HANDLER_NAME,
        ...message
    });
}


/***/ }),

/***/ 17661:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   W: () => (/* binding */ getUrlByKey)
/* harmony export */ });
/* harmony import */ var _background_services_ui_url_builder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(51643);

const EndpointKeyMap = {
    HOMEPAGE: _background_services_ui_url_builder__WEBPACK_IMPORTED_MODULE_0__/* .Endpoint */ .yI.Homepage,
    UPGRADE_PAGE: _background_services_ui_url_builder__WEBPACK_IMPORTED_MODULE_0__/* .Endpoint */ .yI.Upgrade,
    RATE_EXTENSION: _background_services_ui_url_builder__WEBPACK_IMPORTED_MODULE_0__/* .Endpoint */ .yI.RateExtension,
    PRIVACY_POLICY: _background_services_ui_url_builder__WEBPACK_IMPORTED_MODULE_0__/* .Endpoint */ .yI.Privacy,
    CONTACT: _background_services_ui_url_builder__WEBPACK_IMPORTED_MODULE_0__/* .Endpoint */ .yI.Contact,
    WINDOWS_APP: _background_services_ui_url_builder__WEBPACK_IMPORTED_MODULE_0__/* .Endpoint */ .yI.Windows,
    MAC_APP: _background_services_ui_url_builder__WEBPACK_IMPORTED_MODULE_0__/* .Endpoint */ .yI.Mac,
    ANDROID_APP: _background_services_ui_url_builder__WEBPACK_IMPORTED_MODULE_0__/* .Endpoint */ .yI.Android,
    IOS_APP: _background_services_ui_url_builder__WEBPACK_IMPORTED_MODULE_0__/* .Endpoint */ .yI.Ios,
    REPORT_PAGE: _background_services_ui_url_builder__WEBPACK_IMPORTED_MODULE_0__/* .Endpoint */ .yI.Report
};
function getUrlByKey(key) {
    if (_background_services_ui_url_builder__WEBPACK_IMPORTED_MODULE_0__/* .ExternalLinks */ .tr[key]) {
        return _background_services_ui_url_builder__WEBPACK_IMPORTED_MODULE_0__/* .ExternalLinks */ .tr[key];
    }
    if (EndpointKeyMap[key]) {
        return (0,_background_services_ui_url_builder__WEBPACK_IMPORTED_MODULE_0__/* .buildUrl */ .c$)(EndpointKeyMap[key]);
    }
    return null;
}


/***/ }),

/***/ 72038:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   B: () => (/* binding */ UserAgent)
/* harmony export */ });
/* harmony import */ var ua_parser_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(93887);
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(61934);
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else obj[key] = value;
    return obj;
}


class UserAgent {
    static getBrowserName() {
        return UserAgent.isFirefoxMobile ? 'Firefox Mobile' : UserAgent.parser.getBrowser().name;
    }
    static getSystemName() {
        return UserAgent.parser.getOS().name;
    }
    static async getIsAndroid() {
        try {
            const { os } = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_1__.runtime.getPlatformInfo();
            return os === UserAgent.ANDROID_OS_NAME;
        } catch  {
            // If runtime.getPlatformInfo() is not supported, we fallback to the UserAgent string.
            return UserAgent.isAndroid;
        }
    }
    static isTargetBrowser(browserName) {
        return UserAgent.parser.getBrowser().name === browserName;
    }
    static isTargetPlatform(platformName) {
        return UserAgent.getSystemName() === platformName;
    }
    static isTargetEngine(engineName) {
        return UserAgent.parser.getEngine().name === engineName;
    }
    static isTargetDeviceType(deviceType) {
        return UserAgent.parser.getDevice().type === deviceType;
    }
    static getVersion() {
        const browser = UserAgent.parser.getBrowser();
        const versionNumber = Number(browser.version?.split('.')[0]);
        return Number.isNaN(versionNumber) ? undefined : versionNumber;
    }
}
_define_property(UserAgent, "ANDROID_OS_NAME", 'android');
_define_property(UserAgent, "parser", new ua_parser_js__WEBPACK_IMPORTED_MODULE_0__(navigator.userAgent));
_define_property(UserAgent, "version", UserAgent.getVersion());
_define_property(UserAgent, "isFirefox", UserAgent.isTargetBrowser('Firefox'));
_define_property(UserAgent, "isEdge", UserAgent.isTargetBrowser('Edge'));
_define_property(UserAgent, "isWindows", UserAgent.isTargetPlatform('Windows'));
_define_property(UserAgent, "isMacOs", UserAgent.isTargetPlatform('Mac OS'));
_define_property(UserAgent, "isAndroid", UserAgent.isTargetPlatform('Android'));
_define_property(UserAgent, "isChromium", UserAgent.isTargetEngine('Blink'));
_define_property(UserAgent, "isMobileDevice", UserAgent.isTargetDeviceType('mobile'));
_define_property(UserAgent, "isFirefoxMobile", UserAgent.isFirefox && UserAgent.isMobileDevice);
_define_property(UserAgent, "browserName", UserAgent.getBrowserName());


/***/ }),

/***/ 47754:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   e: () => (/* binding */ Messenger)
/* harmony export */ });
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(92588);
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(61934);
/* harmony import */ var _common_logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(65293);
/* harmony import */ var _common_messages__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(37382);
function _class_check_private_static_access(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
function _class_static_private_method_get(receiver, classConstructor, method) {
    _class_check_private_static_access(receiver, classConstructor);
    return method;
}




class Messenger {
    static async createEventListener(events, callback, onUnloadCallback) {
        let listenerId;
        const response = await _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.CreateEventListener, {
            events
        });
        listenerId = response;
        const onUpdateListeners = async ()=>{
            const updatedResponse = await _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.CreateEventListener, {
                events
            });
            listenerId = updatedResponse;
        };
        webextension_polyfill__WEBPACK_IMPORTED_MODULE_1__.runtime.onMessage.addListener((message)=>{
            if (!(0,_common_messages__WEBPACK_IMPORTED_MODULE_3__/* .messageHasTypeField */ .Et)(message)) {
                _common_logger__WEBPACK_IMPORTED_MODULE_2__/* .logger */ .v.error('Received message in Messenger.createEventListener has no type field: ', message);
                return undefined;
            }
            if (message.type === _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.NotifyListeners) {
                if (!(0,_common_messages__WEBPACK_IMPORTED_MODULE_3__/* .messageHasTypeAndDataFields */ .oL)(message)) {
                    _common_logger__WEBPACK_IMPORTED_MODULE_2__/* .logger */ .v.error('Received message with type MessageType.NotifyListeners has no data: ', message);
                    return undefined;
                }
                const castedMessage = message;
                const [type, ...data] = castedMessage.data;
                if (events.includes(type)) {
                    callback({
                        type,
                        data
                    });
                }
            }
            if (message.type === _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.UpdateListeners) {
                onUpdateListeners();
            }
        });
        const onUnload = ()=>{
            if (!listenerId) {
                return;
            }
            _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.RemoveListener, {
                listenerId
            });
            listenerId = null;
            if (typeof onUnloadCallback === 'function') {
                onUnloadCallback();
            }
        };
        window.addEventListener('beforeunload', onUnload);
        window.addEventListener('unload', onUnload);
        return onUnload;
    }
    static async updateListeners() {
        return _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.UpdateListeners);
    }
    static async getOptionsData() {
        return _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.GetOptionsData);
    }
    static async changeUserSetting(settingId, value) {
        await _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.ChangeUserSettings, {
            key: settingId,
            value
        });
    }
    static async setFilterEnabled(filterId, enabled) {
        return _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.SetFilterEnabled, {
            filterId,
            enabled
        });
    }
    static async getUserRules() {
        return _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.GetUserRules);
    }
    static async saveUserRules(value) {
        await _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.SaveUserRules, {
            value
        });
    }
    static async getAllowlist() {
        return _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.GetAllowlistDomains);
    }
    static async saveAllowlist(value) {
        await _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.SaveAllowlistDomains, {
            value
        });
    }
    static async updateFilters() {
        if (true) {
            _common_logger__WEBPACK_IMPORTED_MODULE_2__/* .logger */ .v.debug('Filters update is not supported in MV3');
            return [];
        }
        return _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.CheckFiltersUpdate);
    }
    static async setGroupEnabled(groupId, enabled) {
        return _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.SetGroupEnabled, {
            groupId,
            enabled
        });
    }
    static async checkCustomUrl(url) {
        return _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.LoadCustomFilterInfo, {
            url
        });
    }
    static async addCustomFilter(filter) {
        return _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.SubscribeToCustomFilter, {
            filter
        });
    }
    static async removeCustomFilter(filterId) {
        await _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.RemoveAntiBannerFilter, {
            filterId
        });
    }
    static async getIsEngineStarted() {
        return _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.GetIsEngineStarted);
    }
    static async getTabInfoForPopup(tabId) {
        return _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.GetTabInfoForPopup, {
            tabId
        });
    }
    static async openSettingsTab() {
        return _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.OpenSettingsTab);
    }
    static async openRulesLimitsTab() {
        return _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.OpenRulesLimitsTab);
    }
    static async openAssistant() {
        return _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.OpenAssistant);
    }
    static async removeAllowlistDomain(tabId, tabRefresh) {
        return _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.RemoveAllowlistDomain, {
            tabId,
            tabRefresh
        });
    }
    static async addAllowlistDomain(tabId) {
        return _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.AddAllowlistDomainForTabId, {
            tabId
        });
    }
    static async addUserRule(ruleText) {
        await _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.AddUserRule, {
            ruleText
        });
    }
    static async removeUserRule(ruleText) {
        await _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.RemoveUserRule, {
            ruleText
        });
    }
    static async getCurrentLimits() {
        return _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.CurrentLimitsMv3);
    }
    static async getRulesLimitsCounters() {
        return _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.GetRulesLimitsCountersMv3);
    }
    static async addUrlToTrusted(url) {
        return _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.AddUrlToTrusted, {
            url
        });
    }
    static async getThemeMode() {
        return _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.GetThemeMode);
    }
    static async getDevLocale() {
        return _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.GetDevLocale);
    }
    static async openChromeExtensionsPage() {
        return _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.OpenChromeExtensionsSettingsPage);
    }
    static async openExtensionDetailsPage() {
        return _class_static_private_method_get(Messenger, Messenger, sendMessage).call(Messenger, _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .MessageType */ .Go.OpenExtensionDetailsPage);
    }
}
async function sendMessage(type, data) {
    const response = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_1__.runtime.sendMessage({
        handlerName: _common_messages__WEBPACK_IMPORTED_MODULE_3__/* .APP_MESSAGE_HANDLER_NAME */ .zk,
        type,
        data
    });
    // Rethrows handler errors transported as error-envelope responses.
    (0,_common_messages__WEBPACK_IMPORTED_MODULE_3__/* .unwrapErrorResponse */ .tt)(response);
    return response;
}



/***/ }),

/***/ 17874:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Q: () => (/* binding */ nativeAppPromo)
/* harmony export */ });
/* harmony import */ var _common_url_injector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17661);
/* harmony import */ var _common_user_agent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(72038);
/* harmony import */ var _resources_svg_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(13819);



const nativeAppPromo = _common_user_agent__WEBPACK_IMPORTED_MODULE_1__/* .UserAgent */ .B.isWindows ? {
    url: (0,_common_url_injector__WEBPACK_IMPORTED_MODULE_0__/* .getUrlByKey */ .W)('WINDOWS_APP'),
    Icon: _resources_svg_icons__WEBPACK_IMPORTED_MODULE_2__/* .IconWindows */ .Hz,
    platform: 'Windows'
} : _common_user_agent__WEBPACK_IMPORTED_MODULE_1__/* .UserAgent */ .B.isMacOs ? {
    url: (0,_common_url_injector__WEBPACK_IMPORTED_MODULE_0__/* .getUrlByKey */ .W)('MAC_APP'),
    Icon: _resources_svg_icons__WEBPACK_IMPORTED_MODULE_2__/* .IconApple */ .wp,
    platform: 'Mac'
} : _common_user_agent__WEBPACK_IMPORTED_MODULE_1__/* .UserAgent */ .B.isAndroid ? {
    url: (0,_common_url_injector__WEBPACK_IMPORTED_MODULE_0__/* .getUrlByKey */ .W)('ANDROID_APP'),
    Icon: _resources_svg_icons__WEBPACK_IMPORTED_MODULE_2__/* .IconAndroid */ .z6,
    platform: 'Android'
} : null;


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__(65821));
/******/ }
]);