import{i as Cp,n as Lv,o as vd,r as dl,s as Td,t as H}from"./rolldown-runtime-BPrqr1PP.js";var _p=typeof global=="object"&&global&&global.Object===Object&&global,Mv=typeof self=="object"&&self&&self.Object===Object&&self,ur=_p||Mv||Function("return this")(),qt=ur.Symbol,Sp=Object.prototype,Fv=Sp.hasOwnProperty,xv=Sp.toString,ii=qt?qt.toStringTag:void 0;function qv(e){var t=Fv.call(e,ii),r=e[ii];try{e[ii]=void 0;var n=!0}catch{}var i=xv.call(e);return n&&(t?e[ii]=r:delete e[ii]),i}var jv=Object.prototype.toString;function Uv(e){return jv.call(e)}var Wv="[object Null]",Bv="[object Undefined]",Df=qt?qt.toStringTag:void 0;function Gr(e){return e==null?e===void 0?Bv:Wv:Df&&Df in Object(e)?qv(e):Uv(e)}function zt(e){return e!=null&&typeof e=="object"}var Hv="[object Symbol]";function Bs(e){return typeof e=="symbol"||zt(e)&&Gr(e)==Hv}function Hs(e,t){for(var r=-1,n=e==null?0:e.length,i=Array(n);++r<n;)i[r]=t(e[r],r,e);return i}var ce=Array.isArray,Kv=1/0,Of=qt?qt.prototype:void 0,Lf=Of?Of.toString:void 0;function bp(e){if(typeof e=="string")return e;if(ce(e))return Hs(e,bp)+"";if(Bs(e))return Lf?Lf.call(e):"";var t=e+"";return t=="0"&&1/e==-Kv?"-0":t}var Gv=/\s/;function zv(e){for(var t=e.length;t--&&Gv.test(e.charAt(t)););return t}var Vv=/^\s+/;function Yv(e){return e&&e.slice(0,zv(e)+1).replace(Vv,"")}function jt(e){var t=typeof e;return e!=null&&(t=="object"||t=="function")}var Mf=NaN,Xv=/^[-+]0x[0-9a-f]+$/i,Qv=/^0b[01]+$/i,Jv=/^0o[0-7]+$/i,Zv=parseInt;function eT(e){if(typeof e=="number")return e;if(Bs(e))return Mf;if(jt(e)){var t=typeof e.valueOf=="function"?e.valueOf():e;e=jt(t)?t+"":t}if(typeof e!="string")return e===0?e:+e;e=Yv(e);var r=Qv.test(e);return r||Jv.test(e)?Zv(e.slice(2),r?2:8):Xv.test(e)?Mf:+e}var Ff=1/0,tT=17976931348623157e292;function rT(e){return e?(e=eT(e),e===Ff||e===-Ff?(e<0?-1:1)*tT:e===e?e:0):e===0?e:0}function Ks(e){var t=rT(e),r=t%1;return t===t?r?t-r:t:0}function nn(e){return e}var nT="[object AsyncFunction]",iT="[object Function]",sT="[object GeneratorFunction]",aT="[object Proxy]";function Ar(e){if(!jt(e))return!1;var t=Gr(e);return t==iT||t==sT||t==nT||t==aT}var Vl=ur["__core-js_shared__"],xf=(function(){var e=/[^.]+$/.exec(Vl&&Vl.keys&&Vl.keys.IE_PROTO||"");return e?"Symbol(src)_1."+e:""})();function oT(e){return!!xf&&xf in e}var lT=Function.prototype.toString;function hn(e){if(e!=null){try{return lT.call(e)}catch{}try{return e+""}catch{}}return""}var uT=/[\\^$.*+?()[\]{}|]/g,cT=/^\[object .+?Constructor\]$/,dT=Function.prototype,fT=Object.prototype,hT=dT.toString,pT=fT.hasOwnProperty,mT=RegExp("^"+hT.call(pT).replace(uT,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function gT(e){return!jt(e)||oT(e)?!1:(Ar(e)?mT:cT).test(hn(e))}function yT(e,t){return e?.[t]}function pn(e,t){var r=yT(e,t);return gT(r)?r:void 0}var _u=pn(ur,"WeakMap"),qf=Object.create,vT=(function(){function e(){}return function(t){if(!jt(t))return{};if(qf)return qf(t);e.prototype=t;var r=new e;return e.prototype=void 0,r}})();function TT(e,t,r){switch(r.length){case 0:return e.call(t);case 1:return e.call(t,r[0]);case 2:return e.call(t,r[0],r[1]);case 3:return e.call(t,r[0],r[1],r[2])}return e.apply(t,r)}function Qe(){}function RT(e,t){var r=-1,n=e.length;for(t||(t=Array(n));++r<n;)t[r]=e[r];return t}var wT=800,CT=16,_T=Date.now;function ST(e){var t=0,r=0;return function(){var n=_T(),i=CT-(n-r);if(r=n,i>0){if(++t>=wT)return arguments[0]}else t=0;return e.apply(void 0,arguments)}}function bT(e){return function(){return e}}var Mo=(function(){try{var e=pn(Object,"defineProperty");return e({},"",{}),e}catch{}})(),kT=Mo?function(e,t){return Mo(e,"toString",{configurable:!0,enumerable:!1,value:bT(t),writable:!0})}:nn,$T=ST(kT);function kp(e,t){for(var r=-1,n=e==null?0:e.length;++r<n&&t(e[r],r,e)!==!1;);return e}function $p(e,t,r,n){for(var i=e.length,s=r+(n?1:-1);n?s--:++s<i;)if(t(e[s],s,e))return s;return-1}function ET(e){return e!==e}function AT(e,t,r){for(var n=r-1,i=e.length;++n<i;)if(e[n]===t)return n;return-1}function Rd(e,t,r){return t===t?AT(e,t,r):$p(e,ET,r)}function Ep(e,t){return!!(e!=null&&e.length)&&Rd(e,t,0)>-1}var IT=9007199254740991,NT=/^(?:0|[1-9]\d*)$/;function fl(e,t){var r=typeof e;return t=t??IT,!!t&&(r=="number"||r!="symbol"&&NT.test(e))&&e>-1&&e%1==0&&e<t}function wd(e,t,r){t=="__proto__"&&Mo?Mo(e,t,{configurable:!0,enumerable:!0,value:r,writable:!0}):e[t]=r}function Gs(e,t){return e===t||e!==e&&t!==t}var PT=Object.prototype.hasOwnProperty;function hl(e,t,r){var n=e[t];(!(PT.call(e,t)&&Gs(n,r))||r===void 0&&!(t in e))&&wd(e,t,r)}function zs(e,t,r,n){var i=!r;r||(r={});for(var s=-1,a=t.length;++s<a;){var o=t[s],l=n?n(r[o],e[o],o,r,e):void 0;l===void 0&&(l=e[o]),i?wd(r,o,l):hl(r,o,l)}return r}var jf=Math.max;function DT(e,t,r){return t=jf(t===void 0?e.length-1:t,0),function(){for(var n=arguments,i=-1,s=jf(n.length-t,0),a=Array(s);++i<s;)a[i]=n[t+i];i=-1;for(var o=Array(t+1);++i<t;)o[i]=n[i];return o[t]=r(a),TT(e,this,o)}}function Cd(e,t){return $T(DT(e,t,nn),e+"")}var OT=9007199254740991;function _d(e){return typeof e=="number"&&e>-1&&e%1==0&&e<=OT}function cr(e){return e!=null&&_d(e.length)&&!Ar(e)}function pl(e,t,r){if(!jt(r))return!1;var n=typeof t;return(n=="number"?cr(r)&&fl(t,r.length):n=="string"&&t in r)?Gs(r[t],e):!1}function LT(e){return Cd(function(t,r){var n=-1,i=r.length,s=i>1?r[i-1]:void 0,a=i>2?r[2]:void 0;for(s=e.length>3&&typeof s=="function"?(i--,s):void 0,a&&pl(r[0],r[1],a)&&(s=i<3?void 0:s,i=1),t=Object(t);++n<i;){var o=r[n];o&&e(t,o,n,s)}return t})}var MT=Object.prototype;function Vs(e){var t=e&&e.constructor;return e===(typeof t=="function"&&t.prototype||MT)}function FT(e,t){for(var r=-1,n=Array(e);++r<e;)n[r]=t(r);return n}var xT="[object Arguments]";function Uf(e){return zt(e)&&Gr(e)==xT}var Ap=Object.prototype,qT=Ap.hasOwnProperty,jT=Ap.propertyIsEnumerable,ml=Uf((function(){return arguments})())?Uf:function(e){return zt(e)&&qT.call(e,"callee")&&!jT.call(e,"callee")};function UT(){return!1}var Ip=typeof exports=="object"&&exports&&!exports.nodeType&&exports,Wf=Ip&&typeof module=="object"&&module&&!module.nodeType&&module,Bf=Wf&&Wf.exports===Ip?ur.Buffer:void 0,Os=(Bf?Bf.isBuffer:void 0)||UT,WT="[object Arguments]",BT="[object Array]",HT="[object Boolean]",KT="[object Date]",GT="[object Error]",zT="[object Function]",VT="[object Map]",YT="[object Number]",XT="[object Object]",QT="[object RegExp]",JT="[object Set]",ZT="[object String]",eR="[object WeakMap]",tR="[object ArrayBuffer]",rR="[object DataView]",nR="[object Float32Array]",iR="[object Float64Array]",sR="[object Int8Array]",aR="[object Int16Array]",oR="[object Int32Array]",lR="[object Uint8Array]",uR="[object Uint8ClampedArray]",cR="[object Uint16Array]",dR="[object Uint32Array]",_e={};_e[nR]=_e[iR]=_e[sR]=_e[aR]=_e[oR]=_e[lR]=_e[uR]=_e[cR]=_e[dR]=!0;_e[WT]=_e[BT]=_e[tR]=_e[HT]=_e[rR]=_e[KT]=_e[GT]=_e[zT]=_e[VT]=_e[YT]=_e[XT]=_e[QT]=_e[JT]=_e[ZT]=_e[eR]=!1;function fR(e){return zt(e)&&_d(e.length)&&!!_e[Gr(e)]}function Ys(e){return function(t){return e(t)}}var Np=typeof exports=="object"&&exports&&!exports.nodeType&&exports,Ps=Np&&typeof module=="object"&&module&&!module.nodeType&&module,Yl=Ps&&Ps.exports===Np&&_p.process,Wr=(function(){try{var e=Ps&&Ps.require&&Ps.require("util").types;return e||Yl&&Yl.binding&&Yl.binding("util")}catch{}})(),Hf=Wr&&Wr.isTypedArray,Sd=Hf?Ys(Hf):fR,hR=Object.prototype.hasOwnProperty;function Pp(e,t){var r=ce(e),n=!r&&ml(e),i=!r&&!n&&Os(e),s=!r&&!n&&!i&&Sd(e),a=r||n||i||s,o=a?FT(e.length,String):[],l=o.length;for(var u in e)(t||hR.call(e,u))&&!(a&&(u=="length"||i&&(u=="offset"||u=="parent")||s&&(u=="buffer"||u=="byteLength"||u=="byteOffset")||fl(u,l)))&&o.push(u);return o}function Dp(e,t){return function(r){return e(t(r))}}var pR=Dp(Object.keys,Object),mR=Object.prototype.hasOwnProperty;function Op(e){if(!Vs(e))return pR(e);var t=[];for(var r in Object(e))mR.call(e,r)&&r!="constructor"&&t.push(r);return t}function Nt(e){return cr(e)?Pp(e):Op(e)}var gR=Object.prototype.hasOwnProperty,Pt=LT(function(e,t){if(Vs(t)||cr(t)){zs(t,Nt(t),e);return}for(var r in t)gR.call(t,r)&&hl(e,r,t[r])});function yR(e){var t=[];if(e!=null)for(var r in Object(e))t.push(r);return t}var vR=Object.prototype.hasOwnProperty;function TR(e){if(!jt(e))return yR(e);var t=Vs(e),r=[];for(var n in e)n=="constructor"&&(t||!vR.call(e,n))||r.push(n);return r}function gl(e){return cr(e)?Pp(e,!0):TR(e)}var RR=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,wR=/^\w*$/;function bd(e,t){if(ce(e))return!1;var r=typeof e;return r=="number"||r=="symbol"||r=="boolean"||e==null||Bs(e)?!0:wR.test(e)||!RR.test(e)||t!=null&&e in Object(t)}var Ls=pn(Object,"create");function CR(){this.__data__=Ls?Ls(null):{},this.size=0}function _R(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t}var SR="__lodash_hash_undefined__",bR=Object.prototype.hasOwnProperty;function kR(e){var t=this.__data__;if(Ls){var r=t[e];return r===SR?void 0:r}return bR.call(t,e)?t[e]:void 0}var $R=Object.prototype.hasOwnProperty;function ER(e){var t=this.__data__;return Ls?t[e]!==void 0:$R.call(t,e)}var AR="__lodash_hash_undefined__";function IR(e,t){var r=this.__data__;return this.size+=this.has(e)?0:1,r[e]=Ls&&t===void 0?AR:t,this}function sn(e){var t=-1,r=e==null?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}sn.prototype.clear=CR;sn.prototype.delete=_R;sn.prototype.get=kR;sn.prototype.has=ER;sn.prototype.set=IR;function NR(){this.__data__=[],this.size=0}function yl(e,t){for(var r=e.length;r--;)if(Gs(e[r][0],t))return r;return-1}var PR=Array.prototype.splice;function DR(e){var t=this.__data__,r=yl(t,e);return r<0?!1:(r==t.length-1?t.pop():PR.call(t,r,1),--this.size,!0)}function OR(e){var t=this.__data__,r=yl(t,e);return r<0?void 0:t[r][1]}function LR(e){return yl(this.__data__,e)>-1}function MR(e,t){var r=this.__data__,n=yl(r,e);return n<0?(++this.size,r.push([e,t])):r[n][1]=t,this}function Ir(e){var t=-1,r=e==null?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}Ir.prototype.clear=NR;Ir.prototype.delete=DR;Ir.prototype.get=OR;Ir.prototype.has=LR;Ir.prototype.set=MR;var Ms=pn(ur,"Map");function FR(){this.size=0,this.__data__={hash:new sn,map:new(Ms||Ir),string:new sn}}function xR(e){var t=typeof e;return t=="string"||t=="number"||t=="symbol"||t=="boolean"?e!=="__proto__":e===null}function vl(e,t){var r=e.__data__;return xR(t)?r[typeof t=="string"?"string":"hash"]:r.map}function qR(e){var t=vl(this,e).delete(e);return this.size-=t?1:0,t}function jR(e){return vl(this,e).get(e)}function UR(e){return vl(this,e).has(e)}function WR(e,t){var r=vl(this,e),n=r.size;return r.set(e,t),this.size+=r.size==n?0:1,this}function Nr(e){var t=-1,r=e==null?0:e.length;for(this.clear();++t<r;){var n=e[t];this.set(n[0],n[1])}}Nr.prototype.clear=FR;Nr.prototype.delete=qR;Nr.prototype.get=jR;Nr.prototype.has=UR;Nr.prototype.set=WR;var BR="Expected a function";function kd(e,t){if(typeof e!="function"||t!=null&&typeof t!="function")throw new TypeError(BR);var r=function(){var n=arguments,i=t?t.apply(this,n):n[0],s=r.cache;if(s.has(i))return s.get(i);var a=e.apply(this,n);return r.cache=s.set(i,a)||s,a};return r.cache=new(kd.Cache||Nr),r}kd.Cache=Nr;var HR=500;function KR(e){var t=kd(e,function(n){return r.size===HR&&r.clear(),n}),r=t.cache;return t}var GR=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,zR=/\\(\\)?/g,VR=KR(function(e){var t=[];return e.charCodeAt(0)===46&&t.push(""),e.replace(GR,function(r,n,i,s){t.push(i?s.replace(zR,"$1"):n||r)}),t});function YR(e){return e==null?"":bp(e)}function Tl(e,t){return ce(e)?e:bd(e,t)?[e]:VR(YR(e))}var XR=1/0;function Xs(e){if(typeof e=="string"||Bs(e))return e;var t=e+"";return t=="0"&&1/e==-XR?"-0":t}function $d(e,t){t=Tl(t,e);for(var r=0,n=t.length;e!=null&&r<n;)e=e[Xs(t[r++])];return r&&r==n?e:void 0}function QR(e,t,r){var n=e==null?void 0:$d(e,t);return n===void 0?r:n}function Ed(e,t){for(var r=-1,n=t.length,i=e.length;++r<n;)e[i+r]=t[r];return e}var Kf=qt?qt.isConcatSpreadable:void 0;function JR(e){return ce(e)||ml(e)||!!(Kf&&e&&e[Kf])}function Rl(e,t,r,n,i){var s=-1,a=e.length;for(r||(r=JR),i||(i=[]);++s<a;){var o=e[s];t>0&&r(o)?t>1?Rl(o,t-1,r,n,i):Ed(i,o):n||(i[i.length]=o)}return i}function Ft(e){return e!=null&&e.length?Rl(e,1):[]}var Lp=Dp(Object.getPrototypeOf,Object);function Mp(e,t,r){var n=-1,i=e.length;t<0&&(t=-t>i?0:i+t),r=r>i?i:r,r<0&&(r+=i),i=t>r?0:r-t>>>0,t>>>=0;for(var s=Array(i);++n<i;)s[n]=e[n+t];return s}function ZR(e,t,r,n){var i=-1,s=e==null?0:e.length;for(n&&s&&(r=e[++i]);++i<s;)r=t(r,e[i],i,e);return r}function ew(){this.__data__=new Ir,this.size=0}function tw(e){var t=this.__data__,r=t.delete(e);return this.size=t.size,r}function rw(e){return this.__data__.get(e)}function nw(e){return this.__data__.has(e)}var iw=200;function sw(e,t){var r=this.__data__;if(r instanceof Ir){var n=r.__data__;if(!Ms||n.length<iw-1)return n.push([e,t]),this.size=++r.size,this;r=this.__data__=new Nr(n)}return r.set(e,t),this.size=r.size,this}function sr(e){this.size=(this.__data__=new Ir(e)).size}sr.prototype.clear=ew;sr.prototype.delete=tw;sr.prototype.get=rw;sr.prototype.has=nw;sr.prototype.set=sw;function aw(e,t){return e&&zs(t,Nt(t),e)}function ow(e,t){return e&&zs(t,gl(t),e)}var Fp=typeof exports=="object"&&exports&&!exports.nodeType&&exports,Gf=Fp&&typeof module=="object"&&module&&!module.nodeType&&module,zf=Gf&&Gf.exports===Fp?ur.Buffer:void 0,Vf=zf?zf.allocUnsafe:void 0;function lw(e,t){if(t)return e.slice();var r=e.length,n=Vf?Vf(r):new e.constructor(r);return e.copy(n),n}function Ad(e,t){for(var r=-1,n=e==null?0:e.length,i=0,s=[];++r<n;){var a=e[r];t(a,r,e)&&(s[i++]=a)}return s}function xp(){return[]}var uw=Object.prototype.propertyIsEnumerable,Yf=Object.getOwnPropertySymbols,Id=Yf?function(e){return e==null?[]:(e=Object(e),Ad(Yf(e),function(t){return uw.call(e,t)}))}:xp;function cw(e,t){return zs(e,Id(e),t)}var qp=Object.getOwnPropertySymbols?function(e){for(var t=[];e;)Ed(t,Id(e)),e=Lp(e);return t}:xp;function dw(e,t){return zs(e,qp(e),t)}function jp(e,t,r){var n=t(e);return ce(e)?n:Ed(n,r(e))}function Su(e){return jp(e,Nt,Id)}function Up(e){return jp(e,gl,qp)}var bu=pn(ur,"DataView"),ku=pn(ur,"Promise"),Pn=pn(ur,"Set"),Xf="[object Map]",fw="[object Object]",Qf="[object Promise]",Jf="[object Set]",Zf="[object WeakMap]",eh="[object DataView]",hw=hn(bu),pw=hn(Ms),mw=hn(ku),gw=hn(Pn),yw=hn(_u),Qr=Gr;(bu&&Qr(new bu(new ArrayBuffer(1)))!=eh||Ms&&Qr(new Ms)!=Xf||ku&&Qr(ku.resolve())!=Qf||Pn&&Qr(new Pn)!=Jf||_u&&Qr(new _u)!=Zf)&&(Qr=function(e){var t=Gr(e),r=t==fw?e.constructor:void 0,n=r?hn(r):"";if(n)switch(n){case hw:return eh;case pw:return Xf;case mw:return Qf;case gw:return Jf;case yw:return Zf}return t});var Mn=Qr,vw=Object.prototype.hasOwnProperty;function Tw(e){var t=e.length,r=new e.constructor(t);return t&&typeof e[0]=="string"&&vw.call(e,"index")&&(r.index=e.index,r.input=e.input),r}var Fo=ur.Uint8Array;function Nd(e){var t=new e.constructor(e.byteLength);return new Fo(t).set(new Fo(e)),t}function Rw(e,t){var r=t?Nd(e.buffer):e.buffer;return new e.constructor(r,e.byteOffset,e.byteLength)}var ww=/\w*$/;function Cw(e){var t=new e.constructor(e.source,ww.exec(e));return t.lastIndex=e.lastIndex,t}var th=qt?qt.prototype:void 0,rh=th?th.valueOf:void 0;function _w(e){return rh?Object(rh.call(e)):{}}function Sw(e,t){var r=t?Nd(e.buffer):e.buffer;return new e.constructor(r,e.byteOffset,e.length)}var bw="[object Boolean]",kw="[object Date]",$w="[object Map]",Ew="[object Number]",Aw="[object RegExp]",Iw="[object Set]",Nw="[object String]",Pw="[object Symbol]",Dw="[object ArrayBuffer]",Ow="[object DataView]",Lw="[object Float32Array]",Mw="[object Float64Array]",Fw="[object Int8Array]",xw="[object Int16Array]",qw="[object Int32Array]",jw="[object Uint8Array]",Uw="[object Uint8ClampedArray]",Ww="[object Uint16Array]",Bw="[object Uint32Array]";function Hw(e,t,r){var n=e.constructor;switch(t){case Dw:return Nd(e);case bw:case kw:return new n(+e);case Ow:return Rw(e,r);case Lw:case Mw:case Fw:case xw:case qw:case jw:case Uw:case Ww:case Bw:return Sw(e,r);case $w:return new n;case Ew:case Nw:return new n(e);case Aw:return Cw(e);case Iw:return new n;case Pw:return _w(e)}}function Kw(e){return typeof e.constructor=="function"&&!Vs(e)?vT(Lp(e)):{}}var Gw="[object Map]";function zw(e){return zt(e)&&Mn(e)==Gw}var nh=Wr&&Wr.isMap,Vw=nh?Ys(nh):zw,Yw="[object Set]";function Xw(e){return zt(e)&&Mn(e)==Yw}var ih=Wr&&Wr.isSet,Qw=ih?Ys(ih):Xw,Jw=1,Zw=2,eC=4,Wp="[object Arguments]",tC="[object Array]",rC="[object Boolean]",nC="[object Date]",iC="[object Error]",Bp="[object Function]",sC="[object GeneratorFunction]",aC="[object Map]",oC="[object Number]",Hp="[object Object]",lC="[object RegExp]",uC="[object Set]",cC="[object String]",dC="[object Symbol]",fC="[object WeakMap]",hC="[object ArrayBuffer]",pC="[object DataView]",mC="[object Float32Array]",gC="[object Float64Array]",yC="[object Int8Array]",vC="[object Int16Array]",TC="[object Int32Array]",RC="[object Uint8Array]",wC="[object Uint8ClampedArray]",CC="[object Uint16Array]",_C="[object Uint32Array]",we={};we[Wp]=we[tC]=we[hC]=we[pC]=we[rC]=we[nC]=we[mC]=we[gC]=we[yC]=we[vC]=we[TC]=we[aC]=we[oC]=we[Hp]=we[lC]=we[uC]=we[cC]=we[dC]=we[RC]=we[wC]=we[CC]=we[_C]=!0;we[iC]=we[Bp]=we[fC]=!1;function za(e,t,r,n,i,s){var a,o=t&Jw,l=t&Zw,u=t&eC;if(r&&(a=i?r(e,n,i,s):r(e)),a!==void 0)return a;if(!jt(e))return e;var c=ce(e);if(c){if(a=Tw(e),!o)return RT(e,a)}else{var d=Mn(e),f=d==Bp||d==sC;if(Os(e))return lw(e,o);if(d==Hp||d==Wp||f&&!i){if(a=l||f?{}:Kw(e),!o)return l?dw(e,ow(a,e)):cw(e,aw(a,e))}else{if(!we[d])return i?e:{};a=Hw(e,d,o)}}s||(s=new sr);var h=s.get(e);if(h)return h;s.set(e,a),Qw(e)?e.forEach(function(R){a.add(za(R,t,r,R,e,s))}):Vw(e)&&e.forEach(function(R,S){a.set(S,za(R,t,r,S,e,s))});var m=c?void 0:(u?l?Up:Su:l?gl:Nt)(e);return kp(m||e,function(R,S){m&&(S=R,R=e[S]),hl(a,S,za(R,t,r,S,e,s))}),a}var SC=4;function lt(e){return za(e,SC)}function Qs(e){for(var t=-1,r=e==null?0:e.length,n=0,i=[];++t<r;){var s=e[t];s&&(i[n++]=s)}return i}var bC="__lodash_hash_undefined__";function kC(e){return this.__data__.set(e,bC),this}function $C(e){return this.__data__.has(e)}function Fn(e){var t=-1,r=e==null?0:e.length;for(this.__data__=new Nr;++t<r;)this.add(e[t])}Fn.prototype.add=Fn.prototype.push=kC;Fn.prototype.has=$C;function Kp(e,t){for(var r=-1,n=e==null?0:e.length;++r<n;)if(t(e[r],r,e))return!0;return!1}function Pd(e,t){return e.has(t)}var EC=1,AC=2;function Gp(e,t,r,n,i,s){var a=r&EC,o=e.length,l=t.length;if(o!=l&&!(a&&l>o))return!1;var u=s.get(e),c=s.get(t);if(u&&c)return u==t&&c==e;var d=-1,f=!0,h=r&AC?new Fn:void 0;for(s.set(e,t),s.set(t,e);++d<o;){var m=e[d],R=t[d];if(n)var S=a?n(R,m,d,t,e,s):n(m,R,d,e,t,s);if(S!==void 0){if(S)continue;f=!1;break}if(h){if(!Kp(t,function(v,_){if(!Pd(h,_)&&(m===v||i(m,v,r,n,s)))return h.push(_)})){f=!1;break}}else if(!(m===R||i(m,R,r,n,s))){f=!1;break}}return s.delete(e),s.delete(t),f}function IC(e){var t=-1,r=Array(e.size);return e.forEach(function(n,i){r[++t]=[i,n]}),r}function Dd(e){var t=-1,r=Array(e.size);return e.forEach(function(n){r[++t]=n}),r}var NC=1,PC=2,DC="[object Boolean]",OC="[object Date]",LC="[object Error]",MC="[object Map]",FC="[object Number]",xC="[object RegExp]",qC="[object Set]",jC="[object String]",UC="[object Symbol]",WC="[object ArrayBuffer]",BC="[object DataView]",sh=qt?qt.prototype:void 0,Xl=sh?sh.valueOf:void 0;function HC(e,t,r,n,i,s,a){switch(r){case BC:if(e.byteLength!=t.byteLength||e.byteOffset!=t.byteOffset)return!1;e=e.buffer,t=t.buffer;case WC:return!(e.byteLength!=t.byteLength||!s(new Fo(e),new Fo(t)));case DC:case OC:case FC:return Gs(+e,+t);case LC:return e.name==t.name&&e.message==t.message;case xC:case jC:return e==t+"";case MC:var o=IC;case qC:var l=n&NC;if(o||(o=Dd),e.size!=t.size&&!l)return!1;var u=a.get(e);if(u)return u==t;n|=PC,a.set(e,t);var c=Gp(o(e),o(t),n,i,s,a);return a.delete(e),c;case UC:if(Xl)return Xl.call(e)==Xl.call(t)}return!1}var KC=1,GC=Object.prototype.hasOwnProperty;function zC(e,t,r,n,i,s){var a=r&KC,o=Su(e),l=o.length;if(l!=Su(t).length&&!a)return!1;for(var u=l;u--;){var c=o[u];if(!(a?c in t:GC.call(t,c)))return!1}var d=s.get(e),f=s.get(t);if(d&&f)return d==t&&f==e;var h=!0;s.set(e,t),s.set(t,e);for(var m=a;++u<l;){c=o[u];var R=e[c],S=t[c];if(n)var v=a?n(S,R,c,t,e,s):n(R,S,c,e,t,s);if(!(v===void 0?R===S||i(R,S,r,n,s):v)){h=!1;break}m||(m=c=="constructor")}if(h&&!m){var _=e.constructor,T=t.constructor;_!=T&&"constructor"in e&&"constructor"in t&&!(typeof _=="function"&&_ instanceof _&&typeof T=="function"&&T instanceof T)&&(h=!1)}return s.delete(e),s.delete(t),h}var VC=1,ah="[object Arguments]",oh="[object Array]",ka="[object Object]",lh=Object.prototype.hasOwnProperty;function YC(e,t,r,n,i,s){var a=ce(e),o=ce(t),l=a?oh:Mn(e),u=o?oh:Mn(t);l=l==ah?ka:l,u=u==ah?ka:u;var c=l==ka,d=u==ka,f=l==u;if(f&&Os(e)){if(!Os(t))return!1;a=!0,c=!1}if(f&&!c)return s||(s=new sr),a||Sd(e)?Gp(e,t,r,n,i,s):HC(e,t,l,r,n,i,s);if(!(r&VC)){var h=c&&lh.call(e,"__wrapped__"),m=d&&lh.call(t,"__wrapped__");if(h||m){var R=h?e.value():e,S=m?t.value():t;return s||(s=new sr),i(R,S,r,n,s)}}return f?(s||(s=new sr),zC(e,t,r,n,i,s)):!1}function Od(e,t,r,n,i){return e===t?!0:e==null||t==null||!zt(e)&&!zt(t)?e!==e&&t!==t:YC(e,t,r,n,Od,i)}var XC=1,QC=2;function JC(e,t,r,n){var i=r.length,s=i,a=!n;if(e==null)return!s;for(e=Object(e);i--;){var o=r[i];if(a&&o[2]?o[1]!==e[o[0]]:!(o[0]in e))return!1}for(;++i<s;){o=r[i];var l=o[0],u=e[l],c=o[1];if(a&&o[2]){if(u===void 0&&!(l in e))return!1}else{var d=new sr;if(n)var f=n(u,c,l,e,t,d);if(!(f===void 0?Od(c,u,XC|QC,n,d):f))return!1}}return!0}function zp(e){return e===e&&!jt(e)}function ZC(e){for(var t=Nt(e),r=t.length;r--;){var n=t[r],i=e[n];t[r]=[n,i,zp(i)]}return t}function Vp(e,t){return function(r){return r==null?!1:r[e]===t&&(t!==void 0||e in Object(r))}}function e_(e){var t=ZC(e);return t.length==1&&t[0][2]?Vp(t[0][0],t[0][1]):function(r){return r===e||JC(r,e,t)}}function t_(e,t){return e!=null&&t in Object(e)}function Yp(e,t,r){t=Tl(t,e);for(var n=-1,i=t.length,s=!1;++n<i;){var a=Xs(t[n]);if(!(s=e!=null&&r(e,a)))break;e=e[a]}return s||++n!=i?s:(i=e==null?0:e.length,!!i&&_d(i)&&fl(a,i)&&(ce(e)||ml(e)))}function r_(e,t){return e!=null&&Yp(e,t,t_)}var n_=1,i_=2;function s_(e,t){return bd(e)&&zp(t)?Vp(Xs(e),t):function(r){var n=QR(r,e);return n===void 0&&n===t?r_(r,e):Od(t,n,n_|i_)}}function a_(e){return function(t){return t?.[e]}}function o_(e){return function(t){return $d(t,e)}}function l_(e){return bd(e)?a_(Xs(e)):o_(e)}function Xt(e){return typeof e=="function"?e:e==null?nn:typeof e=="object"?ce(e)?s_(e[0],e[1]):e_(e):l_(e)}function u_(e,t,r,n){for(var i=-1,s=e==null?0:e.length;++i<s;){var a=e[i];t(n,a,r(a),e)}return n}function c_(e){return function(t,r,n){for(var i=-1,s=Object(t),a=n(t),o=a.length;o--;){var l=a[e?o:++i];if(r(s[l],l,s)===!1)break}return t}}var d_=c_();function f_(e,t){return e&&d_(e,t,Nt)}function h_(e,t){return function(r,n){if(r==null)return r;if(!cr(r))return e(r,n);for(var i=r.length,s=t?i:-1,a=Object(r);(t?s--:++s<i)&&n(a[s],s,a)!==!1;);return r}}var mn=h_(f_);function p_(e,t,r,n){return mn(e,function(i,s,a){t(n,i,r(i),a)}),n}function m_(e,t){return function(r,n){var i=ce(r)?u_:p_,s=t?t():{};return i(r,e,Xt(n,2),s)}}var Xp=Object.prototype,g_=Xp.hasOwnProperty,Ld=Cd(function(e,t){e=Object(e);var r=-1,n=t.length,i=n>2?t[2]:void 0;for(i&&pl(t[0],t[1],i)&&(n=1);++r<n;)for(var s=t[r],a=gl(s),o=-1,l=a.length;++o<l;){var u=a[o],c=e[u];(c===void 0||Gs(c,Xp[u])&&!g_.call(e,u))&&(e[u]=s[u])}return e});function uh(e){return zt(e)&&cr(e)}function Qp(e,t,r){for(var n=-1,i=e==null?0:e.length;++n<i;)if(r(t,e[n]))return!0;return!1}var y_=200;function v_(e,t,r,n){var i=-1,s=Ep,a=!0,o=e.length,l=[],u=t.length;if(!o)return l;r&&(t=Hs(t,Ys(r))),n?(s=Qp,a=!1):t.length>=y_&&(s=Pd,a=!1,t=new Fn(t));e:for(;++i<o;){var c=e[i],d=r==null?c:r(c);if(c=n||c!==0?c:0,a&&d===d){for(var f=u;f--;)if(t[f]===d)continue e;l.push(c)}else s(t,d,n)||l.push(c)}return l}var wl=Cd(function(e,t){return uh(e)?v_(e,Rl(t,1,uh,!0)):[]});function xn(e){var t=e==null?0:e.length;return t?e[t-1]:void 0}function st(e,t,r){var n=e==null?0:e.length;return n?(t=r||t===void 0?1:Ks(t),Mp(e,t<0?0:t,n)):[]}function Fs(e,t,r){var n=e==null?0:e.length;return n?(t=r||t===void 0?1:Ks(t),t=n-t,Mp(e,0,t<0?0:t)):[]}function T_(e){return typeof e=="function"?e:nn}function Q(e,t){return(ce(e)?kp:mn)(e,T_(t))}function R_(e,t){for(var r=-1,n=e==null?0:e.length;++r<n;)if(!t(e[r],r,e))return!1;return!0}function w_(e,t){var r=!0;return mn(e,function(n,i,s){return r=!!t(n,i,s),r}),r}function Gt(e,t,r){var n=ce(e)?R_:w_;return r&&pl(e,t,r)&&(t=void 0),n(e,Xt(t,3))}function Jp(e,t){var r=[];return mn(e,function(n,i,s){t(n,i,s)&&r.push(n)}),r}function Dt(e,t){return(ce(e)?Ad:Jp)(e,Xt(t,3))}function C_(e){return function(t,r,n){var i=Object(t);if(!cr(t)){var s=Xt(r,3);t=Nt(t),r=function(o){return s(i[o],o,i)}}var a=e(t,r,n);return a>-1?i[s?t[a]:a]:void 0}}var __=Math.max;function S_(e,t,r){var n=e==null?0:e.length;if(!n)return-1;var i=r==null?0:Ks(r);return i<0&&(i=__(n+i,0)),$p(e,Xt(t,3),i)}var qn=C_(S_);function Vt(e){return e&&e.length?e[0]:void 0}function b_(e,t){var r=-1,n=cr(e)?Array(e.length):[];return mn(e,function(i,s,a){n[++r]=t(i,s,a)}),n}function K(e,t){return(ce(e)?Hs:b_)(e,Xt(t,3))}function At(e,t){return Rl(K(e,t),1)}var k_=Object.prototype.hasOwnProperty,$_=m_(function(e,t,r){k_.call(e,r)?e[r].push(t):wd(e,r,[t])}),E_=Object.prototype.hasOwnProperty;function A_(e,t){return e!=null&&E_.call(e,t)}function J(e,t){return e!=null&&Yp(e,t,A_)}var I_="[object String]";function Ct(e){return typeof e=="string"||!ce(e)&&zt(e)&&Gr(e)==I_}function N_(e,t){return Hs(t,function(r){return e[r]})}function Je(e){return e==null?[]:N_(e,Nt(e))}var P_=Math.max;function vt(e,t,r,n){e=cr(e)?e:Je(e),r=r&&!n?Ks(r):0;var i=e.length;return r<0&&(r=P_(i+r,0)),Ct(e)?r<=i&&e.indexOf(t,r)>-1:!!i&&Rd(e,t,r)>-1}var D_=Math.max;function ch(e,t,r){var n=e==null?0:e.length;if(!n)return-1;var i=r==null?0:Ks(r);return i<0&&(i=D_(n+i,0)),Rd(e,t,i)}var O_="[object Map]",L_="[object Set]",M_=Object.prototype.hasOwnProperty;function Re(e){if(e==null)return!0;if(cr(e)&&(ce(e)||typeof e=="string"||typeof e.splice=="function"||Os(e)||Sd(e)||ml(e)))return!e.length;var t=Mn(e);if(t==O_||t==L_)return!e.size;if(Vs(e))return!Op(e).length;for(var r in e)if(M_.call(e,r))return!1;return!0}var F_="[object RegExp]";function x_(e){return zt(e)&&Gr(e)==F_}var dh=Wr&&Wr.isRegExp,br=dh?Ys(dh):x_;function kr(e){return e===void 0}function q_(e,t){return e<t}function j_(e,t,r){for(var n=-1,i=e.length;++n<i;){var s=e[n],a=t(s);if(a!=null&&(o===void 0?a===a&&!Bs(a):r(a,o)))var o=a,l=s}return l}function U_(e){return e&&e.length?j_(e,nn,q_):void 0}var W_="Expected a function";function B_(e){if(typeof e!="function")throw new TypeError(W_);return function(){var t=arguments;switch(t.length){case 0:return!e.call(this);case 1:return!e.call(this,t[0]);case 2:return!e.call(this,t[0],t[1]);case 3:return!e.call(this,t[0],t[1],t[2])}return!e.apply(this,t)}}function H_(e,t,r,n){if(!jt(e))return e;t=Tl(t,e);for(var i=-1,s=t.length,a=s-1,o=e;o!=null&&++i<s;){var l=Xs(t[i]),u=r;if(l==="__proto__"||l==="constructor"||l==="prototype")return e;if(i!=a){var c=o[l];u=n?n(c,l,o):void 0,u===void 0&&(u=jt(c)?c:fl(t[i+1])?[]:{})}hl(o,l,u),o=o[l]}return e}function K_(e,t,r){for(var n=-1,i=t.length,s={};++n<i;){var a=t[n],o=$d(e,a);r(o,a)&&H_(s,Tl(a,e),o)}return s}function Qt(e,t){if(e==null)return{};var r=Hs(Up(e),function(n){return[n]});return t=Xt(t),K_(e,r,function(n,i){return t(n,i[0])})}function G_(e,t,r,n,i){return i(e,function(s,a,o){r=n?(n=!1,s):t(r,s,a,o)}),r}function mt(e,t,r){var n=ce(e)?ZR:G_,i=arguments.length<3;return n(e,Xt(t,4),r,i,mn)}function Cl(e,t){return(ce(e)?Ad:Jp)(e,B_(Xt(t,3)))}function z_(e,t){var r;return mn(e,function(n,i,s){return r=t(n,i,s),!r}),!!r}function Zp(e,t,r){var n=ce(e)?Kp:z_;return r&&pl(e,t,r)&&(t=void 0),n(e,Xt(t,3))}var V_=Pn&&1/Dd(new Pn([,-0]))[1]==1/0?function(e){return new Pn(e)}:Qe,Y_=200;function em(e,t,r){var n=-1,i=Ep,s=e.length,a=!0,o=[],l=o;if(r)a=!1,i=Qp;else if(s>=Y_){var u=t?null:V_(e);if(u)return Dd(u);a=!1,i=Pd,l=new Fn}else l=t?[]:o;e:for(;++n<s;){var c=e[n],d=t?t(c):c;if(c=r||c!==0?c:0,a&&d===d){for(var f=l.length;f--;)if(l[f]===d)continue e;t&&l.push(d),o.push(c)}else i(l,d,r)||(l!==o&&l.push(d),o.push(c))}return o}function Md(e){return e&&e.length?em(e):[]}function X_(e,t){return e&&e.length?em(e,Xt(t,2)):[]}function at(e){return typeof e=="object"&&e!==null&&typeof e.$type=="string"}function ir(e){return typeof e=="object"&&e!==null&&typeof e.$refText=="string"}function Q_(e){return typeof e=="object"&&e!==null&&typeof e.name=="string"&&typeof e.type=="string"&&typeof e.path=="string"}function Va(e){return typeof e=="object"&&e!==null&&at(e.container)&&ir(e.reference)&&typeof e.message=="string"}var tm=class{constructor(){this.subtypes={},this.allSubtypes={}}isInstance(e,t){return at(e)&&this.isSubtype(e.$type,t)}isSubtype(e,t){if(e===t)return!0;let r=this.subtypes[e];r||(r=this.subtypes[e]={});const n=r[t];if(n!==void 0)return n;{const i=this.computeIsSubtype(e,t);return r[t]=i,i}}getAllSubTypes(e){const t=this.allSubtypes[e];if(t)return t;{const r=this.getAllTypes(),n=[];for(const i of r)this.isSubtype(i,e)&&n.push(i);return this.allSubtypes[e]=n,n}}};function an(e){return typeof e=="object"&&e!==null&&Array.isArray(e.content)}function Js(e){return typeof e=="object"&&e!==null&&typeof e.tokenType=="object"}function rm(e){return an(e)&&typeof e.fullText=="string"}var jr=class Tr{constructor(t,r){this.startFn=t,this.nextFn=r}iterator(){const t={state:this.startFn(),next:()=>this.nextFn(t.state),[Symbol.iterator]:()=>t};return t}[Symbol.iterator](){return this.iterator()}isEmpty(){return!!this.iterator().next().done}count(){const t=this.iterator();let r=0,n=t.next();for(;!n.done;)r++,n=t.next();return r}toArray(){const t=[],r=this.iterator();let n;do n=r.next(),n.value!==void 0&&t.push(n.value);while(!n.done);return t}toSet(){return new Set(this)}toMap(t,r){const n=this.map(i=>[t?t(i):i,r?r(i):i]);return new Map(n)}toString(){return this.join()}concat(t){return new Tr(()=>({first:this.startFn(),firstDone:!1,iterator:t[Symbol.iterator]()}),r=>{let n;if(!r.firstDone){do if(n=this.nextFn(r.first),!n.done)return n;while(!n.done);r.firstDone=!0}do if(n=r.iterator.next(),!n.done)return n;while(!n.done);return kt})}join(t=","){const r=this.iterator();let n="",i,s=!1;do i=r.next(),i.done||(s&&(n+=t),n+=J_(i.value)),s=!0;while(!i.done);return n}indexOf(t,r=0){const n=this.iterator();let i=0,s=n.next();for(;!s.done;){if(i>=r&&s.value===t)return i;s=n.next(),i++}return-1}every(t){const r=this.iterator();let n=r.next();for(;!n.done;){if(!t(n.value))return!1;n=r.next()}return!0}some(t){const r=this.iterator();let n=r.next();for(;!n.done;){if(t(n.value))return!0;n=r.next()}return!1}forEach(t){const r=this.iterator();let n=0,i=r.next();for(;!i.done;)t(i.value,n),i=r.next(),n++}map(t){return new Tr(this.startFn,r=>{const{done:n,value:i}=this.nextFn(r);return n?kt:{done:!1,value:t(i)}})}filter(t){return new Tr(this.startFn,r=>{let n;do if(n=this.nextFn(r),!n.done&&t(n.value))return n;while(!n.done);return kt})}nonNullable(){return this.filter(t=>t!=null)}reduce(t,r){const n=this.iterator();let i=r,s=n.next();for(;!s.done;)i===void 0?i=s.value:i=t(i,s.value),s=n.next();return i}reduceRight(t,r){return this.recursiveReduce(this.iterator(),t,r)}recursiveReduce(t,r,n){const i=t.next();if(i.done)return n;const s=this.recursiveReduce(t,r,n);return s===void 0?i.value:r(s,i.value)}find(t){const r=this.iterator();let n=r.next();for(;!n.done;){if(t(n.value))return n.value;n=r.next()}}findIndex(t){const r=this.iterator();let n=0,i=r.next();for(;!i.done;){if(t(i.value))return n;i=r.next(),n++}return-1}includes(t){const r=this.iterator();let n=r.next();for(;!n.done;){if(n.value===t)return!0;n=r.next()}return!1}flatMap(t){return new Tr(()=>({this:this.startFn()}),r=>{do{if(r.iterator){const s=r.iterator.next();if(s.done)r.iterator=void 0;else return s}const{done:n,value:i}=this.nextFn(r.this);if(!n){const s=t(i);if(xo(s))r.iterator=s[Symbol.iterator]();else return{done:!1,value:s}}}while(r.iterator);return kt})}flat(t){if(t===void 0&&(t=1),t<=0)return this;const r=t>1?this.flat(t-1):this;return new Tr(()=>({this:r.startFn()}),n=>{do{if(n.iterator){const a=n.iterator.next();if(a.done)n.iterator=void 0;else return a}const{done:i,value:s}=r.nextFn(n.this);if(!i)if(xo(s))n.iterator=s[Symbol.iterator]();else return{done:!1,value:s}}while(n.iterator);return kt})}head(){const t=this.iterator().next();if(!t.done)return t.value}tail(t=1){return new Tr(()=>{const r=this.startFn();for(let n=0;n<t;n++)if(this.nextFn(r).done)return r;return r},this.nextFn)}limit(t){return new Tr(()=>({size:0,state:this.startFn()}),r=>(r.size++,r.size>t?kt:this.nextFn(r.state)))}distinct(t){return new Tr(()=>({set:new Set,internalState:this.startFn()}),r=>{let n;do if(n=this.nextFn(r.internalState),!n.done){const i=t?t(n.value):n.value;if(!r.set.has(i))return r.set.add(i),n}while(!n.done);return kt})}exclude(t,r){const n=new Set;for(const i of t){const s=r?r(i):i;n.add(s)}return this.filter(i=>{const s=r?r(i):i;return!n.has(s)})}};function J_(e){return typeof e=="string"?e:typeof e>"u"?"undefined":typeof e.toString=="function"?e.toString():Object.prototype.toString.call(e)}function xo(e){return!!e&&typeof e[Symbol.iterator]=="function"}var Z_=new jr(()=>{},()=>kt),kt=Object.freeze({done:!0,value:void 0});function Me(...e){if(e.length===1){const t=e[0];if(t instanceof jr)return t;if(xo(t))return new jr(()=>t[Symbol.iterator](),r=>r.next());if(typeof t.length=="number")return new jr(()=>({index:0}),r=>r.index<t.length?{done:!1,value:t[r.index++]}:kt)}return e.length>1?new jr(()=>({collIndex:0,arrIndex:0}),t=>{do{if(t.iterator){const r=t.iterator.next();if(!r.done)return r;t.iterator=void 0}if(t.array){if(t.arrIndex<t.array.length)return{done:!1,value:t.array[t.arrIndex++]};t.array=void 0,t.arrIndex=0}if(t.collIndex<e.length){const r=e[t.collIndex++];xo(r)?t.iterator=r[Symbol.iterator]():r&&typeof r.length=="number"&&(t.array=r)}}while(t.iterator||t.array||t.collIndex<e.length);return kt}):Z_}var qo=class extends jr{constructor(e,t,r){super(()=>({iterators:r?.includeRoot?[[e][Symbol.iterator]()]:[t(e)[Symbol.iterator]()],pruned:!1}),n=>{for(n.pruned&&(n.iterators.pop(),n.pruned=!1);n.iterators.length>0;){const i=n.iterators[n.iterators.length-1].next();if(i.done)n.iterators.pop();else return n.iterators.push(t(i.value)[Symbol.iterator]()),i}return kt})}iterator(){const e={state:this.startFn(),next:()=>this.nextFn(e.state),prune:()=>{e.state.pruned=!0},[Symbol.iterator]:()=>e};return e}},$u;(function(e){function t(s){return s.reduce((a,o)=>a+o,0)}e.sum=t;function r(s){return s.reduce((a,o)=>a*o,0)}e.product=r;function n(s){return s.reduce((a,o)=>Math.min(a,o))}e.min=n;function i(s){return s.reduce((a,o)=>Math.max(a,o))}e.max=i})($u||($u={}));function jo(e){return new qo(e,t=>an(t)?t.content:[],{includeRoot:!0})}function Eu(e){return jo(e).filter(Js)}function eS(e,t){for(;e.container;)if(e=e.container,e===t)return!0;return!1}function Au(e){return{start:{character:e.startColumn-1,line:e.startLine-1},end:{character:e.endColumn,line:e.endLine-1}}}function Uo(e){if(!e)return;const{offset:t,end:r,range:n}=e;return{range:n,offset:t,end:r,length:r-t}}var Cr;(function(e){e[e.Before=0]="Before",e[e.After=1]="After",e[e.OverlapFront=2]="OverlapFront",e[e.OverlapBack=3]="OverlapBack",e[e.Inside=4]="Inside",e[e.Outside=5]="Outside"})(Cr||(Cr={}));function tS(e,t){if(e.end.line<t.start.line||e.end.line===t.start.line&&e.end.character<=t.start.character)return Cr.Before;if(e.start.line>t.end.line||e.start.line===t.end.line&&e.start.character>=t.end.character)return Cr.After;const r=e.start.line>t.start.line||e.start.line===t.start.line&&e.start.character>=t.start.character,n=e.end.line<t.end.line||e.end.line===t.end.line&&e.end.character<=t.end.character;return r&&n?Cr.Inside:r?Cr.OverlapBack:n?Cr.OverlapFront:Cr.Outside}function rS(e,t){return tS(e,t)>Cr.After}var nm=/^[\w\p{L}]$/u;function on(e,t,r=nm){if(e){if(t>0){const n=t-e.offset,i=e.text.charAt(n);r.test(i)||t--}return im(e,t)}}function nS(e,t){if(e){const r=am(e,!0);if(r&&fh(r,t))return r;if(rm(e)){const n=e.content.findIndex(i=>!i.hidden);for(let i=n-1;i>=0;i--){const s=e.content[i];if(fh(s,t))return s}}}}function fh(e,t){return Js(e)&&t.includes(e.tokenType.name)}function im(e,t){if(Js(e))return e;if(an(e)){const r=sm(e,t,!1);if(r)return im(r,t)}}function Iu(e,t){if(Js(e))return e;if(an(e)){const r=sm(e,t,!0);if(r)return Iu(r,t)}}function sm(e,t,r){let n=0,i=e.content.length-1,s;for(;n<=i;){const a=Math.floor((n+i)/2),o=e.content[a];if(o.offset<=t&&o.end>t)return o;o.end<=t?(s=r?o:void 0,n=a+1):i=a-1}return s}function am(e,t=!0){for(;e.container;){const r=e.container;let n=r.content.indexOf(e);for(;n>0;){n--;const i=r.content[n];if(t||!i.hidden)return i}e=r}}function iS(e,t=!0){for(;e.container;){const r=e.container;let n=r.content.indexOf(e);const i=r.content.length-1;for(;n<i;){n++;const s=r.content[n];if(t||!s.hidden)return s}e=r}}var om=class extends Error{constructor(e,t){super(e?`${t} at ${e.range.start.line}:${e.range.start.character}`:t)}};function Zs(e){throw new Error("Error! The input value was not handled.")}var Ql="AbstractRule",Jl="AbstractType",hh="Condition",ph="TypeDefinition",mh="ValueLiteral",di="AbstractElement";function lm(e){return pe.isInstance(e,di)}var $a="ArrayLiteral",Ea="ArrayType",fi="BooleanLiteral";function sS(e){return pe.isInstance(e,fi)}var hi="Conjunction";function aS(e){return pe.isInstance(e,hi)}var pi="Disjunction";function oS(e){return pe.isInstance(e,pi)}var Aa="Grammar",Zl="GrammarImport",mi="InferredType";function um(e){return pe.isInstance(e,mi)}var gi="Interface";function cm(e){return pe.isInstance(e,gi)}var eu="NamedArgument",yi="Negation";function lS(e){return pe.isInstance(e,yi)}var Ia="NumberLiteral",Na="Parameter",vi="ParameterReference";function uS(e){return pe.isInstance(e,vi)}var Ti="ParserRule";function dt(e){return pe.isInstance(e,Ti)}var Pa="ReferenceType",Ya="ReturnType";function cS(e){return pe.isInstance(e,Ya)}var Ri="SimpleType";function dS(e){return pe.isInstance(e,Ri)}var Da="StringLiteral",Sn="TerminalRule";function zr(e){return pe.isInstance(e,Sn)}var wi="Type";function dm(e){return pe.isInstance(e,wi)}var tu="TypeAttribute",Oa="UnionType",Ci="Action";function ea(e){return pe.isInstance(e,Ci)}var _i="Alternatives";function Fd(e){return pe.isInstance(e,_i)}var Si="Assignment";function ar(e){return pe.isInstance(e,Si)}var bi="CharacterRange";function fS(e){return pe.isInstance(e,bi)}var ki="CrossReference";function ta(e){return pe.isInstance(e,ki)}var $i="EndOfFile";function hS(e){return pe.isInstance(e,$i)}var Ei="Group";function ln(e){return pe.isInstance(e,Ei)}var Ai="Keyword";function or(e){return pe.isInstance(e,Ai)}var Ii="NegatedToken";function pS(e){return pe.isInstance(e,Ii)}var Ni="RegexToken";function mS(e){return pe.isInstance(e,Ni)}var Pi="RuleCall";function $r(e){return pe.isInstance(e,Pi)}var Di="TerminalAlternatives";function gS(e){return pe.isInstance(e,Di)}var Oi="TerminalGroup";function yS(e){return pe.isInstance(e,Oi)}var Li="TerminalRuleCall";function fm(e){return pe.isInstance(e,Li)}var Mi="UnorderedGroup";function xd(e){return pe.isInstance(e,Mi)}var Fi="UntilToken";function vS(e){return pe.isInstance(e,Fi)}var xi="Wildcard";function TS(e){return pe.isInstance(e,xi)}var hm=class extends tm{getAllTypes(){return[di,Ql,Jl,Ci,_i,$a,Ea,Si,fi,bi,hh,hi,ki,pi,$i,Aa,Zl,Ei,mi,gi,Ai,eu,Ii,yi,Ia,Na,vi,Ti,Pa,Ni,Ya,Pi,Ri,Da,Di,Oi,Sn,Li,wi,tu,ph,Oa,Mi,Fi,mh,xi]}computeIsSubtype(e,t){switch(e){case Ci:case _i:case Si:case bi:case ki:case $i:case Ei:case Ai:case Ii:case Ni:case Pi:case Di:case Oi:case Li:case Mi:case Fi:case xi:return this.isSubtype(di,t);case $a:case Ia:case Da:return this.isSubtype(mh,t);case Ea:case Pa:case Ri:case Oa:return this.isSubtype(ph,t);case fi:return this.isSubtype("Condition",t)||this.isSubtype("ValueLiteral",t);case hi:case pi:case yi:case vi:return this.isSubtype(hh,t);case mi:case gi:case wi:return this.isSubtype(Jl,t);case Ti:return this.isSubtype("AbstractRule",t)||this.isSubtype("AbstractType",t);case Sn:return this.isSubtype(Ql,t);default:return!1}}getReferenceType(e){const t=`${e.container.$type}:${e.property}`;switch(t){case"Action:type":case"CrossReference:type":case"Interface:superTypes":case"ParserRule:returnType":case"SimpleType:typeRef":return Jl;case"Grammar:hiddenTokens":case"ParserRule:hiddenTokens":case"RuleCall:rule":return Ql;case"Grammar:usedGrammars":return Aa;case"NamedArgument:parameter":case"ParameterReference:parameter":return Na;case"TerminalRuleCall:rule":return Sn;default:throw new Error(`${t} is not a valid reference id.`)}}getTypeMetaData(e){switch(e){case di:return{name:di,properties:[{name:"cardinality"},{name:"lookahead"}]};case $a:return{name:$a,properties:[{name:"elements",defaultValue:[]}]};case Ea:return{name:Ea,properties:[{name:"elementType"}]};case fi:return{name:fi,properties:[{name:"true",defaultValue:!1}]};case hi:return{name:hi,properties:[{name:"left"},{name:"right"}]};case pi:return{name:pi,properties:[{name:"left"},{name:"right"}]};case Aa:return{name:Aa,properties:[{name:"definesHiddenTokens",defaultValue:!1},{name:"hiddenTokens",defaultValue:[]},{name:"imports",defaultValue:[]},{name:"interfaces",defaultValue:[]},{name:"isDeclared",defaultValue:!1},{name:"name"},{name:"rules",defaultValue:[]},{name:"types",defaultValue:[]},{name:"usedGrammars",defaultValue:[]}]};case Zl:return{name:Zl,properties:[{name:"path"}]};case mi:return{name:mi,properties:[{name:"name"}]};case gi:return{name:gi,properties:[{name:"attributes",defaultValue:[]},{name:"name"},{name:"superTypes",defaultValue:[]}]};case eu:return{name:eu,properties:[{name:"calledByName",defaultValue:!1},{name:"parameter"},{name:"value"}]};case yi:return{name:yi,properties:[{name:"value"}]};case Ia:return{name:Ia,properties:[{name:"value"}]};case Na:return{name:Na,properties:[{name:"name"}]};case vi:return{name:vi,properties:[{name:"parameter"}]};case Ti:return{name:Ti,properties:[{name:"dataType"},{name:"definesHiddenTokens",defaultValue:!1},{name:"definition"},{name:"entry",defaultValue:!1},{name:"fragment",defaultValue:!1},{name:"hiddenTokens",defaultValue:[]},{name:"inferredType"},{name:"name"},{name:"parameters",defaultValue:[]},{name:"returnType"},{name:"wildcard",defaultValue:!1}]};case Pa:return{name:Pa,properties:[{name:"referenceType"}]};case Ya:return{name:Ya,properties:[{name:"name"}]};case Ri:return{name:Ri,properties:[{name:"primitiveType"},{name:"stringType"},{name:"typeRef"}]};case Da:return{name:Da,properties:[{name:"value"}]};case Sn:return{name:Sn,properties:[{name:"definition"},{name:"fragment",defaultValue:!1},{name:"hidden",defaultValue:!1},{name:"name"},{name:"type"}]};case wi:return{name:wi,properties:[{name:"name"},{name:"type"}]};case tu:return{name:tu,properties:[{name:"defaultValue"},{name:"isOptional",defaultValue:!1},{name:"name"},{name:"type"}]};case Oa:return{name:Oa,properties:[{name:"types",defaultValue:[]}]};case Ci:return{name:Ci,properties:[{name:"cardinality"},{name:"feature"},{name:"inferredType"},{name:"lookahead"},{name:"operator"},{name:"type"}]};case _i:return{name:_i,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"lookahead"}]};case Si:return{name:Si,properties:[{name:"cardinality"},{name:"feature"},{name:"lookahead"},{name:"operator"},{name:"terminal"}]};case bi:return{name:bi,properties:[{name:"cardinality"},{name:"left"},{name:"lookahead"},{name:"right"}]};case ki:return{name:ki,properties:[{name:"cardinality"},{name:"deprecatedSyntax",defaultValue:!1},{name:"lookahead"},{name:"terminal"},{name:"type"}]};case $i:return{name:$i,properties:[{name:"cardinality"},{name:"lookahead"}]};case Ei:return{name:Ei,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"guardCondition"},{name:"lookahead"}]};case Ai:return{name:Ai,properties:[{name:"cardinality"},{name:"lookahead"},{name:"value"}]};case Ii:return{name:Ii,properties:[{name:"cardinality"},{name:"lookahead"},{name:"terminal"}]};case Ni:return{name:Ni,properties:[{name:"cardinality"},{name:"lookahead"},{name:"regex"}]};case Pi:return{name:Pi,properties:[{name:"arguments",defaultValue:[]},{name:"cardinality"},{name:"lookahead"},{name:"rule"}]};case Di:return{name:Di,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"lookahead"}]};case Oi:return{name:Oi,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"lookahead"}]};case Li:return{name:Li,properties:[{name:"cardinality"},{name:"lookahead"},{name:"rule"}]};case Mi:return{name:Mi,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"lookahead"}]};case Fi:return{name:Fi,properties:[{name:"cardinality"},{name:"lookahead"},{name:"terminal"}]};case xi:return{name:xi,properties:[{name:"cardinality"},{name:"lookahead"}]};default:return{name:e,properties:[]}}}},pe=new hm;function RS(e){for(const[t,r]of Object.entries(e))t.startsWith("$")||(Array.isArray(r)?r.forEach((n,i)=>{at(n)&&(n.$container=e,n.$containerProperty=t,n.$containerIndex=i)}):at(r)&&(r.$container=e,r.$containerProperty=t))}function Ur(e,t){let r=e;for(;r;){if(t(r))return r;r=r.$container}}function lr(e){const t=Nu(e).$document;if(!t)throw new Error("AST node has no document.");return t}function Nu(e){for(;e.$container;)e=e.$container;return e}function _l(e,t){if(!e)throw new Error("Node must be an AstNode.");const r=t?.range;return new jr(()=>({keys:Object.keys(e),keyIndex:0,arrayIndex:0}),n=>{for(;n.keyIndex<n.keys.length;){const i=n.keys[n.keyIndex];if(!i.startsWith("$")){const s=e[i];if(at(s)){if(n.keyIndex++,Pu(s,r))return{done:!1,value:s}}else if(Array.isArray(s)){for(;n.arrayIndex<s.length;){const a=s[n.arrayIndex++];if(at(a)&&Pu(a,r))return{done:!1,value:a}}n.arrayIndex=0}}n.keyIndex++}return kt})}function zn(e,t){if(!e)throw new Error("Root node must be an AstNode.");return new qo(e,r=>_l(r,t))}function Dn(e,t){if(e){if(t?.range&&!Pu(e,t.range))return new qo(e,()=>[])}else throw new Error("Root node must be an AstNode.");return new qo(e,r=>_l(r,t),{includeRoot:!0})}function Pu(e,t){var r;if(!t)return!0;const n=(r=e.$cstNode)===null||r===void 0?void 0:r.range;return n?rS(n,t):!1}function pm(e){return new jr(()=>({keys:Object.keys(e),keyIndex:0,arrayIndex:0}),t=>{for(;t.keyIndex<t.keys.length;){const r=t.keys[t.keyIndex];if(!r.startsWith("$")){const n=e[r];if(ir(n))return t.keyIndex++,{done:!1,value:{reference:n,container:e,property:r}};if(Array.isArray(n)){for(;t.arrayIndex<n.length;){const i=t.arrayIndex++,s=n[i];if(ir(s))return{done:!1,value:{reference:s,container:e,property:r,index:i}}}t.arrayIndex=0}}t.keyIndex++}return kt})}function mm(e,t){const r=e.getTypeMetaData(t.$type),n=t;for(const i of r.properties)i.defaultValue!==void 0&&n[i.name]===void 0&&(n[i.name]=gm(i.defaultValue))}function gm(e){return Array.isArray(e)?[...e.map(gm)]:e}function te(e){return e.charCodeAt(0)}function ru(e,t){Array.isArray(e)?e.forEach(function(r){t.push(r)}):t.push(e)}function si(e,t){if(e[t]===!0)throw"duplicate flag "+t;e[t],e[t]=!0}function _n(e){if(e===void 0)throw Error("Internal Error - Should never get here!");return!0}function La(){throw Error("Internal Error - Should never get here!")}function gh(e){return e.type==="Character"}var Wo=[];for(let e=te("0");e<=te("9");e++)Wo.push(e);var Bo=[te("_")].concat(Wo);for(let e=te("a");e<=te("z");e++)Bo.push(e);for(let e=te("A");e<=te("Z");e++)Bo.push(e);var yh=[te(" "),te("\f"),te(`
`),te("\r"),te("	"),te("\v"),te("	"),te(" "),te(" "),te(" "),te(" "),te(" "),te(" "),te(" "),te(" "),te(" "),te(" "),te(" "),te(" "),te(" "),te("\u2028"),te("\u2029"),te(" "),te(" "),te("　"),te("\uFEFF")],wS=/[0-9a-fA-F]/,Ma=/[0-9]/,CS=/[1-9]/,ym=class{constructor(){this.idx=0,this.input="",this.groupIdx=0}saveState(){return{idx:this.idx,input:this.input,groupIdx:this.groupIdx}}restoreState(e){this.idx=e.idx,this.input=e.input,this.groupIdx=e.groupIdx}pattern(e){this.idx=0,this.input=e,this.groupIdx=0,this.consumeChar("/");const t=this.disjunction();this.consumeChar("/");const r={type:"Flags",loc:{begin:this.idx,end:e.length},global:!1,ignoreCase:!1,multiLine:!1,unicode:!1,sticky:!1};for(;this.isRegExpFlag();)switch(this.popChar()){case"g":si(r,"global");break;case"i":si(r,"ignoreCase");break;case"m":si(r,"multiLine");break;case"u":si(r,"unicode");break;case"y":si(r,"sticky");break}if(this.idx!==this.input.length)throw Error("Redundant input: "+this.input.substring(this.idx));return{type:"Pattern",flags:r,value:t,loc:this.loc(0)}}disjunction(){const e=[],t=this.idx;for(e.push(this.alternative());this.peekChar()==="|";)this.consumeChar("|"),e.push(this.alternative());return{type:"Disjunction",value:e,loc:this.loc(t)}}alternative(){const e=[],t=this.idx;for(;this.isTerm();)e.push(this.term());return{type:"Alternative",value:e,loc:this.loc(t)}}term(){return this.isAssertion()?this.assertion():this.atom()}assertion(){const e=this.idx;switch(this.popChar()){case"^":return{type:"StartAnchor",loc:this.loc(e)};case"$":return{type:"EndAnchor",loc:this.loc(e)};case"\\":switch(this.popChar()){case"b":return{type:"WordBoundary",loc:this.loc(e)};case"B":return{type:"NonWordBoundary",loc:this.loc(e)}}throw Error("Invalid Assertion Escape");case"(":this.consumeChar("?");let t;switch(this.popChar()){case"=":t="Lookahead";break;case"!":t="NegativeLookahead";break}_n(t);const r=this.disjunction();return this.consumeChar(")"),{type:t,value:r,loc:this.loc(e)}}return La()}quantifier(e=!1){let t;const r=this.idx;switch(this.popChar()){case"*":t={atLeast:0,atMost:1/0};break;case"+":t={atLeast:1,atMost:1/0};break;case"?":t={atLeast:0,atMost:1};break;case"{":const n=this.integerIncludingZero();switch(this.popChar()){case"}":t={atLeast:n,atMost:n};break;case",":let i;this.isDigit()?(i=this.integerIncludingZero(),t={atLeast:n,atMost:i}):t={atLeast:n,atMost:1/0},this.consumeChar("}");break}if(e===!0&&t===void 0)return;_n(t);break}if(!(e===!0&&t===void 0)&&_n(t))return this.peekChar(0)==="?"?(this.consumeChar("?"),t.greedy=!1):t.greedy=!0,t.type="Quantifier",t.loc=this.loc(r),t}atom(){let e;const t=this.idx;switch(this.peekChar()){case".":e=this.dotAll();break;case"\\":e=this.atomEscape();break;case"[":e=this.characterClass();break;case"(":e=this.group();break}return e===void 0&&this.isPatternCharacter()&&(e=this.patternCharacter()),_n(e)?(e.loc=this.loc(t),this.isQuantifier()&&(e.quantifier=this.quantifier()),e):La()}dotAll(){return this.consumeChar("."),{type:"Set",complement:!0,value:[te(`
`),te("\r"),te("\u2028"),te("\u2029")]}}atomEscape(){switch(this.consumeChar("\\"),this.peekChar()){case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":return this.decimalEscapeAtom();case"d":case"D":case"s":case"S":case"w":case"W":return this.characterClassEscape();case"f":case"n":case"r":case"t":case"v":return this.controlEscapeAtom();case"c":return this.controlLetterEscapeAtom();case"0":return this.nulCharacterAtom();case"x":return this.hexEscapeSequenceAtom();case"u":return this.regExpUnicodeEscapeSequenceAtom();default:return this.identityEscapeAtom()}}decimalEscapeAtom(){return{type:"GroupBackReference",value:this.positiveInteger()}}characterClassEscape(){let e,t=!1;switch(this.popChar()){case"d":e=Wo;break;case"D":e=Wo,t=!0;break;case"s":e=yh;break;case"S":e=yh,t=!0;break;case"w":e=Bo;break;case"W":e=Bo,t=!0;break}return _n(e)?{type:"Set",value:e,complement:t}:La()}controlEscapeAtom(){let e;switch(this.popChar()){case"f":e=te("\f");break;case"n":e=te(`
`);break;case"r":e=te("\r");break;case"t":e=te("	");break;case"v":e=te("\v");break}return _n(e)?{type:"Character",value:e}:La()}controlLetterEscapeAtom(){this.consumeChar("c");const e=this.popChar();if(/[a-zA-Z]/.test(e)===!1)throw Error("Invalid ");return{type:"Character",value:e.toUpperCase().charCodeAt(0)-64}}nulCharacterAtom(){return this.consumeChar("0"),{type:"Character",value:te("\0")}}hexEscapeSequenceAtom(){return this.consumeChar("x"),this.parseHexDigits(2)}regExpUnicodeEscapeSequenceAtom(){return this.consumeChar("u"),this.parseHexDigits(4)}identityEscapeAtom(){return{type:"Character",value:te(this.popChar())}}classPatternCharacterAtom(){switch(this.peekChar()){case`
`:case"\r":case"\u2028":case"\u2029":case"\\":case"]":throw Error("TBD");default:return{type:"Character",value:te(this.popChar())}}}characterClass(){const e=[];let t=!1;for(this.consumeChar("["),this.peekChar(0)==="^"&&(this.consumeChar("^"),t=!0);this.isClassAtom();){const r=this.classAtom();if(r.type,gh(r)&&this.isRangeDash()){this.consumeChar("-");const n=this.classAtom();if(n.type,gh(n)){if(n.value<r.value)throw Error("Range out of order in character class");e.push({from:r.value,to:n.value})}else ru(r.value,e),e.push(te("-")),ru(n.value,e)}else ru(r.value,e)}return this.consumeChar("]"),{type:"Set",complement:t,value:e}}classAtom(){switch(this.peekChar()){case"]":case`
`:case"\r":case"\u2028":case"\u2029":throw Error("TBD");case"\\":return this.classEscape();default:return this.classPatternCharacterAtom()}}classEscape(){switch(this.consumeChar("\\"),this.peekChar()){case"b":return this.consumeChar("b"),{type:"Character",value:te("\b")};case"d":case"D":case"s":case"S":case"w":case"W":return this.characterClassEscape();case"f":case"n":case"r":case"t":case"v":return this.controlEscapeAtom();case"c":return this.controlLetterEscapeAtom();case"0":return this.nulCharacterAtom();case"x":return this.hexEscapeSequenceAtom();case"u":return this.regExpUnicodeEscapeSequenceAtom();default:return this.identityEscapeAtom()}}group(){let e=!0;this.consumeChar("("),this.peekChar(0)==="?"?(this.consumeChar("?"),this.consumeChar(":"),e=!1):this.groupIdx++;const t=this.disjunction();this.consumeChar(")");const r={type:"Group",capturing:e,value:t};return e&&(r.idx=this.groupIdx),r}positiveInteger(){let e=this.popChar();if(CS.test(e)===!1)throw Error("Expecting a positive integer");for(;Ma.test(this.peekChar(0));)e+=this.popChar();return parseInt(e,10)}integerIncludingZero(){let e=this.popChar();if(Ma.test(e)===!1)throw Error("Expecting an integer");for(;Ma.test(this.peekChar(0));)e+=this.popChar();return parseInt(e,10)}patternCharacter(){const e=this.popChar();switch(e){case`
`:case"\r":case"\u2028":case"\u2029":case"^":case"$":case"\\":case".":case"*":case"+":case"?":case"(":case")":case"[":case"|":throw Error("TBD");default:return{type:"Character",value:te(e)}}}isRegExpFlag(){switch(this.peekChar(0)){case"g":case"i":case"m":case"u":case"y":return!0;default:return!1}}isRangeDash(){return this.peekChar()==="-"&&this.isClassAtom(1)}isDigit(){return Ma.test(this.peekChar(0))}isClassAtom(e=0){switch(this.peekChar(e)){case"]":case`
`:case"\r":case"\u2028":case"\u2029":return!1;default:return!0}}isTerm(){return this.isAtom()||this.isAssertion()}isAtom(){if(this.isPatternCharacter())return!0;switch(this.peekChar(0)){case".":case"\\":case"[":case"(":return!0;default:return!1}}isAssertion(){switch(this.peekChar(0)){case"^":case"$":return!0;case"\\":switch(this.peekChar(1)){case"b":case"B":return!0;default:return!1}case"(":return this.peekChar(1)==="?"&&(this.peekChar(2)==="="||this.peekChar(2)==="!");default:return!1}}isQuantifier(){const e=this.saveState();try{return this.quantifier(!0)!==void 0}catch{return!1}finally{this.restoreState(e)}}isPatternCharacter(){switch(this.peekChar()){case"^":case"$":case"\\":case".":case"*":case"+":case"?":case"(":case")":case"[":case"|":case"/":case`
`:case"\r":case"\u2028":case"\u2029":return!1;default:return!0}}parseHexDigits(e){let t="";for(let r=0;r<e;r++){const n=this.popChar();if(wS.test(n)===!1)throw Error("Expecting a HexDecimal digits");t+=n}return{type:"Character",value:parseInt(t,16)}}peekChar(e=0){return this.input[this.idx+e]}popChar(){const e=this.peekChar(0);return this.consumeChar(void 0),e}consumeChar(e){if(e!==void 0&&this.input[this.idx]!==e)throw Error("Expected: '"+e+"' but found: '"+this.input[this.idx]+"' at offset: "+this.idx);if(this.idx>=this.input.length)throw Error("Unexpected end of input");this.idx++}loc(e){return{begin:e,end:this.idx}}},Sl=class{visitChildren(e){for(const t in e){const r=e[t];e.hasOwnProperty(t)&&(r.type!==void 0?this.visit(r):Array.isArray(r)&&r.forEach(n=>{this.visit(n)},this))}}visit(e){switch(e.type){case"Pattern":this.visitPattern(e);break;case"Flags":this.visitFlags(e);break;case"Disjunction":this.visitDisjunction(e);break;case"Alternative":this.visitAlternative(e);break;case"StartAnchor":this.visitStartAnchor(e);break;case"EndAnchor":this.visitEndAnchor(e);break;case"WordBoundary":this.visitWordBoundary(e);break;case"NonWordBoundary":this.visitNonWordBoundary(e);break;case"Lookahead":this.visitLookahead(e);break;case"NegativeLookahead":this.visitNegativeLookahead(e);break;case"Character":this.visitCharacter(e);break;case"Set":this.visitSet(e);break;case"Group":this.visitGroup(e);break;case"GroupBackReference":this.visitGroupBackReference(e);break;case"Quantifier":this.visitQuantifier(e);break}this.visitChildren(e)}visitPattern(e){}visitFlags(e){}visitDisjunction(e){}visitAlternative(e){}visitStartAnchor(e){}visitEndAnchor(e){}visitWordBoundary(e){}visitNonWordBoundary(e){}visitLookahead(e){}visitNegativeLookahead(e){}visitCharacter(e){}visitSet(e){}visitGroup(e){}visitGroupBackReference(e){}visitQuantifier(e){}},_S=/\r?\n/gm,SS=new ym,bS=class extends Sl{constructor(){super(...arguments),this.isStarting=!0,this.endRegexpStack=[],this.multiline=!1}get endRegex(){return this.endRegexpStack.join("")}reset(e){this.multiline=!1,this.regex=e,this.startRegexp="",this.isStarting=!0,this.endRegexpStack=[]}visitGroup(e){e.quantifier&&(this.isStarting=!1,this.endRegexpStack=[])}visitCharacter(e){const t=String.fromCharCode(e.value);if(!this.multiline&&t===`
`&&(this.multiline=!0),e.quantifier)this.isStarting=!1,this.endRegexpStack=[];else{const r=bl(t);this.endRegexpStack.push(r),this.isStarting&&(this.startRegexp+=r)}}visitSet(e){if(!this.multiline){const t=this.regex.substring(e.loc.begin,e.loc.end),r=new RegExp(t);this.multiline=!!`
`.match(r)}if(e.quantifier)this.isStarting=!1,this.endRegexpStack=[];else{const t=this.regex.substring(e.loc.begin,e.loc.end);this.endRegexpStack.push(t),this.isStarting&&(this.startRegexp+=t)}}visitChildren(e){e.type==="Group"&&e.quantifier||super.visitChildren(e)}},nu=new bS;function kS(e){try{return typeof e=="string"&&(e=new RegExp(e)),e=e.toString(),nu.reset(e),nu.visit(SS.pattern(e)),nu.multiline}catch{return!1}}var $S=`\f
\r	\v              \u2028\u2029  　\uFEFF`.split("");function Du(e){const t=typeof e=="string"?new RegExp(e):e;return $S.some(r=>t.test(r))}function bl(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function ES(e){return Array.prototype.map.call(e,t=>/\w/.test(t)?`[${t.toLowerCase()}${t.toUpperCase()}]`:bl(t)).join("")}function AS(e,t){const r=IS(e),n=t.match(r);return!!n&&n[0].length>0}function IS(e){typeof e=="string"&&(e=new RegExp(e));const t=e,r=e.source;let n=0;function i(){let s="",a;function o(u){s+=r.substr(n,u),n+=u}function l(u){s+="(?:"+r.substr(n,u)+"|$)",n+=u}for(;n<r.length;)switch(r[n]){case"\\":switch(r[n+1]){case"c":l(3);break;case"x":l(4);break;case"u":t.unicode?r[n+2]==="{"?l(r.indexOf("}",n)-n+1):l(6):l(2);break;case"p":case"P":t.unicode?l(r.indexOf("}",n)-n+1):l(2);break;case"k":l(r.indexOf(">",n)-n+1);break;default:l(2);break}break;case"[":a=/\[(?:\\.|.)*?\]/g,a.lastIndex=n,a=a.exec(r)||[],l(a[0].length);break;case"|":case"^":case"$":case"*":case"+":case"?":o(1);break;case"{":a=/\{\d+,?\d*\}/g,a.lastIndex=n,a=a.exec(r),a?o(a[0].length):l(1);break;case"(":if(r[n+1]==="?")switch(r[n+2]){case":":s+="(?:",n+=3,s+=i()+"|$)";break;case"=":s+="(?=",n+=3,s+=i()+")";break;case"!":a=n,n+=3,i(),s+=r.substr(a,n-a);break;case"<":switch(r[n+3]){case"=":case"!":a=n,n+=4,i(),s+=r.substr(a,n-a);break;default:o(r.indexOf(">",n)-n+1),s+=i()+"|$)";break}break}else o(1),s+=i()+"|$)";break;case")":return++n,s;default:l(1);break}return s}return new RegExp(i(),e.flags)}function Ou(e){return e.rules.find(t=>dt(t)&&t.entry)}function NS(e){return e.rules.filter(t=>zr(t)&&t.hidden)}function vm(e,t){const r=new Set,n=Ou(e);if(!n)return new Set(e.rules);const i=[n].concat(NS(e));for(const a of i)Tm(a,r,t);const s=new Set;for(const a of e.rules)(r.has(a.name)||zr(a)&&a.hidden)&&s.add(a);return s}function Tm(e,t,r){t.add(e.name),zn(e).forEach(n=>{if($r(n)||r&&fm(n)){const i=n.rule.ref;i&&!t.has(i.name)&&Tm(i,t,r)}})}function Rm(e){if(e.terminal)return e.terminal;if(e.type.ref){const t=Cm(e.type.ref);return t?.terminal}}function PS(e){return e.hidden&&!Du($l(e))}function DS(e,t){return!e||!t?[]:qd(e,t,e.astNode,!0)}function wm(e,t,r){if(!e||!t)return;const n=qd(e,t,e.astNode,!0);if(n.length!==0)return r!==void 0?r=Math.max(0,Math.min(r,n.length-1)):r=0,n[r]}function qd(e,t,r,n){if(!n){const i=Ur(e.grammarSource,ar);if(i&&i.feature===t)return[e]}return an(e)&&e.astNode===r?e.content.flatMap(i=>qd(i,t,r,!1)):[]}function OS(e,t,r){if(!e)return;const n=LS(e,t,e?.astNode);if(n.length!==0)return r!==void 0?r=Math.max(0,Math.min(r,n.length-1)):r=0,n[r]}function LS(e,t,r){if(e.astNode!==r)return[];if(or(e.grammarSource)&&e.grammarSource.value===t)return[e];const n=jo(e).iterator();let i;const s=[];do if(i=n.next(),!i.done){const a=i.value;a.astNode===r?or(a.grammarSource)&&a.grammarSource.value===t&&s.push(a):n.prune()}while(!i.done);return s}function MS(e){var t;const r=e.astNode;for(;r===((t=e.container)===null||t===void 0?void 0:t.astNode);){const n=Ur(e.grammarSource,ar);if(n)return n;e=e.container}}function Cm(e){let t=e;return um(t)&&(ea(t.$container)?t=t.$container.$container:dt(t.$container)?t=t.$container:Zs(t.$container)),_m(e,t,new Map)}function _m(e,t,r){var n;function i(s,a){let o;return Ur(s,ar)||(o=_m(a,a,r)),r.set(e,o),o}if(r.has(e))return r.get(e);r.set(e,void 0);for(const s of zn(t)){if(ar(s)&&s.feature.toLowerCase()==="name")return r.set(e,s),s;if($r(s)&&dt(s.rule.ref))return i(s,s.rule.ref);if(dS(s)&&(!((n=s.typeRef)===null||n===void 0)&&n.ref))return i(s,s.typeRef.ref)}}function xs(e,t){return e==="?"||e==="*"||ln(t)&&!!t.guardCondition}function FS(e){return e==="*"||e==="+"}function Sm(e){return bm(e,new Set)}function bm(e,t){if(t.has(e))return!0;t.add(e);for(const r of zn(e))if($r(r)){if(!r.rule.ref||dt(r.rule.ref)&&!bm(r.rule.ref,t))return!1}else{if(ar(r))return!1;if(ea(r))return!1}return!!e.definition}function ra(e){if(e.inferredType)return e.inferredType.name;if(e.dataType)return e.dataType;if(e.returnType){const t=e.returnType.ref;if(t){if(dt(t))return t.name;if(cm(t)||dm(t))return t.name}}}function kl(e){var t;if(dt(e))return Sm(e)?e.name:(t=ra(e))!==null&&t!==void 0?t:e.name;if(cm(e)||dm(e)||cS(e))return e.name;if(ea(e)){const r=xS(e);if(r)return r}else if(um(e))return e.name;throw new Error("Cannot get name of Unknown Type")}function xS(e){var t;if(e.inferredType)return e.inferredType.name;if(!((t=e.type)===null||t===void 0)&&t.ref)return kl(e.type.ref)}function qS(e){var t,r,n;return zr(e)?(r=(t=e.type)===null||t===void 0?void 0:t.name)!==null&&r!==void 0?r:"string":(n=ra(e))!==null&&n!==void 0?n:e.name}function $l(e){const t={s:!1,i:!1,u:!1},r=Vn(e.definition,t),n=Object.entries(t).filter(([,i])=>i).map(([i])=>i).join("");return new RegExp(r,n)}var jd=/[\s\S]/.source;function Vn(e,t){if(gS(e))return jS(e);if(yS(e))return US(e);if(fS(e))return HS(e);if(fm(e)){const r=e.rule.ref;if(!r)throw new Error("Missing rule reference.");return Sr(Vn(r.definition),{cardinality:e.cardinality,lookahead:e.lookahead})}else{if(pS(e))return BS(e);if(vS(e))return WS(e);if(mS(e)){const r=e.regex.lastIndexOf("/"),n=e.regex.substring(1,r),i=e.regex.substring(r+1);return t&&(t.i=i.includes("i"),t.s=i.includes("s"),t.u=i.includes("u")),Sr(n,{cardinality:e.cardinality,lookahead:e.lookahead,wrap:!1})}else{if(TS(e))return Sr(jd,{cardinality:e.cardinality,lookahead:e.lookahead});throw new Error(`Invalid terminal element: ${e?.$type}`)}}}function jS(e){return Sr(e.elements.map(t=>Vn(t)).join("|"),{cardinality:e.cardinality,lookahead:e.lookahead})}function US(e){return Sr(e.elements.map(t=>Vn(t)).join(""),{cardinality:e.cardinality,lookahead:e.lookahead})}function WS(e){return Sr(`${jd}*?${Vn(e.terminal)}`,{cardinality:e.cardinality,lookahead:e.lookahead})}function BS(e){return Sr(`(?!${Vn(e.terminal)})${jd}*?`,{cardinality:e.cardinality,lookahead:e.lookahead})}function HS(e){return e.right?Sr(`[${iu(e.left)}-${iu(e.right)}]`,{cardinality:e.cardinality,lookahead:e.lookahead,wrap:!1}):Sr(iu(e.left),{cardinality:e.cardinality,lookahead:e.lookahead,wrap:!1})}function iu(e){return bl(e.value)}function Sr(e,t){var r;return(t.wrap!==!1||t.lookahead)&&(e=`(${(r=t.lookahead)!==null&&r!==void 0?r:""}${e})`),t.cardinality?`${e}${t.cardinality}`:e}function KS(e){const t=[],r=e.Grammar;for(const n of r.rules)zr(n)&&PS(n)&&kS($l(n))&&t.push(n.name);return{multilineCommentRules:t,nameRegexp:nm}}function Lu(e){console&&console.error&&console.error(`Error: ${e}`)}function km(e){console&&console.warn&&console.warn(`Warning: ${e}`)}function $m(e){const t=new Date().getTime(),r=e();return{time:new Date().getTime()-t,value:r}}function Em(e){function t(){}t.prototype=e;const r=new t;function n(){return typeof r.bar}return n(),n(),e}function GS(e){return zS(e)?e.LABEL:e.name}function zS(e){return Ct(e.LABEL)&&e.LABEL!==""}var dr=class{get definition(){return this._definition}set definition(e){this._definition=e}constructor(e){this._definition=e}accept(e){e.visit(this),Q(this.definition,t=>{t.accept(e)})}},gt=class extends dr{constructor(e){super([]),this.idx=1,Pt(this,Qt(e,t=>t!==void 0))}set definition(e){}get definition(){return this.referencedRule!==void 0?this.referencedRule.definition:[]}accept(e){e.visit(this)}},Yn=class extends dr{constructor(e){super(e.definition),this.orgText="",Pt(this,Qt(e,t=>t!==void 0))}},_t=class extends dr{constructor(e){super(e.definition),this.ignoreAmbiguities=!1,Pt(this,Qt(e,t=>t!==void 0))}},ot=class extends dr{constructor(e){super(e.definition),this.idx=1,Pt(this,Qt(e,t=>t!==void 0))}},Ot=class extends dr{constructor(e){super(e.definition),this.idx=1,Pt(this,Qt(e,t=>t!==void 0))}},Lt=class extends dr{constructor(e){super(e.definition),this.idx=1,Pt(this,Qt(e,t=>t!==void 0))}},Fe=class extends dr{constructor(e){super(e.definition),this.idx=1,Pt(this,Qt(e,t=>t!==void 0))}},St=class extends dr{constructor(e){super(e.definition),this.idx=1,Pt(this,Qt(e,t=>t!==void 0))}},bt=class extends dr{get definition(){return this._definition}set definition(e){this._definition=e}constructor(e){super(e.definition),this.idx=1,this.ignoreAmbiguities=!1,this.hasPredicates=!1,Pt(this,Qt(e,t=>t!==void 0))}},be=class{constructor(e){this.idx=1,Pt(this,Qt(e,t=>t!==void 0))}accept(e){e.visit(this)}};function VS(e){return K(e,Xa)}function Xa(e){function t(r){return K(r,Xa)}if(e instanceof gt){const r={type:"NonTerminal",name:e.nonTerminalName,idx:e.idx};return Ct(e.label)&&(r.label=e.label),r}else{if(e instanceof _t)return{type:"Alternative",definition:t(e.definition)};if(e instanceof ot)return{type:"Option",idx:e.idx,definition:t(e.definition)};if(e instanceof Ot)return{type:"RepetitionMandatory",idx:e.idx,definition:t(e.definition)};if(e instanceof Lt)return{type:"RepetitionMandatoryWithSeparator",idx:e.idx,separator:Xa(new be({terminalType:e.separator})),definition:t(e.definition)};if(e instanceof St)return{type:"RepetitionWithSeparator",idx:e.idx,separator:Xa(new be({terminalType:e.separator})),definition:t(e.definition)};if(e instanceof Fe)return{type:"Repetition",idx:e.idx,definition:t(e.definition)};if(e instanceof bt)return{type:"Alternation",idx:e.idx,definition:t(e.definition)};if(e instanceof be){const r={type:"Terminal",name:e.terminalType.name,label:GS(e.terminalType),idx:e.idx};Ct(e.label)&&(r.terminalLabel=e.label);const n=e.terminalType.PATTERN;return e.terminalType.PATTERN&&(r.pattern=br(n)?n.source:n),r}else{if(e instanceof Yn)return{type:"Rule",name:e.name,orgText:e.orgText,definition:t(e.definition)};throw Error("non exhaustive match")}}}var Xn=class{visit(e){const t=e;switch(t.constructor){case gt:return this.visitNonTerminal(t);case _t:return this.visitAlternative(t);case ot:return this.visitOption(t);case Ot:return this.visitRepetitionMandatory(t);case Lt:return this.visitRepetitionMandatoryWithSeparator(t);case St:return this.visitRepetitionWithSeparator(t);case Fe:return this.visitRepetition(t);case bt:return this.visitAlternation(t);case be:return this.visitTerminal(t);case Yn:return this.visitRule(t);default:throw Error("non exhaustive match")}}visitNonTerminal(e){}visitAlternative(e){}visitOption(e){}visitRepetition(e){}visitRepetitionMandatory(e){}visitRepetitionMandatoryWithSeparator(e){}visitRepetitionWithSeparator(e){}visitAlternation(e){}visitTerminal(e){}visitRule(e){}};function YS(e){return e instanceof _t||e instanceof ot||e instanceof Fe||e instanceof Ot||e instanceof Lt||e instanceof St||e instanceof be||e instanceof Yn}function Ho(e,t=[]){return e instanceof ot||e instanceof Fe||e instanceof St?!0:e instanceof bt?Zp(e.definition,r=>Ho(r,t)):e instanceof gt&&vt(t,e)?!1:e instanceof dr?(e instanceof gt&&t.push(e),Gt(e.definition,r=>Ho(r,t))):!1}function XS(e){return e instanceof bt}function nr(e){if(e instanceof gt)return"SUBRULE";if(e instanceof ot)return"OPTION";if(e instanceof bt)return"OR";if(e instanceof Ot)return"AT_LEAST_ONE";if(e instanceof Lt)return"AT_LEAST_ONE_SEP";if(e instanceof St)return"MANY_SEP";if(e instanceof Fe)return"MANY";if(e instanceof be)return"CONSUME";throw Error("non exhaustive match")}var El=class{walk(e,t=[]){Q(e.definition,(r,n)=>{const i=st(e.definition,n+1);if(r instanceof gt)this.walkProdRef(r,i,t);else if(r instanceof be)this.walkTerminal(r,i,t);else if(r instanceof _t)this.walkFlat(r,i,t);else if(r instanceof ot)this.walkOption(r,i,t);else if(r instanceof Ot)this.walkAtLeastOne(r,i,t);else if(r instanceof Lt)this.walkAtLeastOneSep(r,i,t);else if(r instanceof St)this.walkManySep(r,i,t);else if(r instanceof Fe)this.walkMany(r,i,t);else if(r instanceof bt)this.walkOr(r,i,t);else throw Error("non exhaustive match")})}walkTerminal(e,t,r){}walkProdRef(e,t,r){}walkFlat(e,t,r){const n=t.concat(r);this.walk(e,n)}walkOption(e,t,r){const n=t.concat(r);this.walk(e,n)}walkAtLeastOne(e,t,r){const n=[new ot({definition:e.definition})].concat(t,r);this.walk(e,n)}walkAtLeastOneSep(e,t,r){const n=vh(e,t,r);this.walk(e,n)}walkMany(e,t,r){const n=[new ot({definition:e.definition})].concat(t,r);this.walk(e,n)}walkManySep(e,t,r){const n=vh(e,t,r);this.walk(e,n)}walkOr(e,t,r){const n=t.concat(r);Q(e.definition,i=>{const s=new _t({definition:[i]});this.walk(s,n)})}};function vh(e,t,r){return[new ot({definition:[new be({terminalType:e.separator})].concat(e.definition)})].concat(t,r)}function na(e){if(e instanceof gt)return na(e.referencedRule);if(e instanceof be)return ZS(e);if(YS(e))return QS(e);if(XS(e))return JS(e);throw Error("non exhaustive match")}function QS(e){let t=[];const r=e.definition;let n=0,i=r.length>n,s,a=!0;for(;i&&a;)s=r[n],a=Ho(s),t=t.concat(na(s)),n=n+1,i=r.length>n;return Md(t)}function JS(e){return Md(Ft(K(e.definition,t=>na(t))))}function ZS(e){return[e.terminalType]}var Am="_~IN~_",eb=class extends El{constructor(e){super(),this.topProd=e,this.follows={}}startWalking(){return this.walk(this.topProd),this.follows}walkTerminal(e,t,r){}walkProdRef(e,t,r){const n=rb(e.referencedRule,e.idx)+this.topProd.name,i=na(new _t({definition:t.concat(r)}));this.follows[n]=i}};function tb(e){const t={};return Q(e,r=>{Pt(t,new eb(r).startWalking())}),t}function rb(e,t){return e.name+t+Am}var Qa={},nb=new ym;function Al(e){const t=e.toString();if(Qa.hasOwnProperty(t))return Qa[t];{const r=nb.pattern(t);return Qa[t]=r,r}}function ib(){Qa={}}var Im="Complement Sets are not supported for first char optimization",Ko=`Unable to use "first char" lexer optimizations:
`;function sb(e,t=!1){try{const r=Al(e);return Mu(r.value,{},r.flags.ignoreCase)}catch(r){if(r.message===Im)t&&km(`${Ko}	Unable to optimize: < ${e.toString()} >
	Complement Sets cannot be automatically optimized.
	This will disable the lexer's first char optimizations.
	See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#COMPLEMENT for details.`);else{let n="";t&&(n=`
	This will disable the lexer's first char optimizations.
	See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#REGEXP_PARSING for details.`),Lu(`${Ko}
	Failed parsing: < ${e.toString()} >
	Using the @chevrotain/regexp-to-ast library
	Please open an issue at: https://github.com/chevrotain/chevrotain/issues`+n)}}return[]}function Mu(e,t,r){switch(e.type){case"Disjunction":for(let i=0;i<e.value.length;i++)Mu(e.value[i],t,r);break;case"Alternative":const n=e.value;for(let i=0;i<n.length;i++){const s=n[i];switch(s.type){case"EndAnchor":case"GroupBackReference":case"Lookahead":case"NegativeLookahead":case"StartAnchor":case"WordBoundary":case"NonWordBoundary":continue}const a=s;switch(a.type){case"Character":Fa(a.value,t,r);break;case"Set":if(a.complement===!0)throw Error(Im);Q(a.value,l=>{if(typeof l=="number")Fa(l,t,r);else{const u=l;if(r===!0)for(let c=u.from;c<=u.to;c++)Fa(c,t,r);else{for(let c=u.from;c<=u.to&&c<256;c++)Fa(c,t,r);if(u.to>=256){const c=u.from>=256?u.from:256,d=u.to,f=Br(c),h=Br(d);for(let m=f;m<=h;m++)t[m]=m}}}});break;case"Group":Mu(a.value,t,r);break;default:throw Error("Non Exhaustive Match")}const o=a.quantifier!==void 0&&a.quantifier.atLeast===0;if(a.type==="Group"&&Fu(a)===!1||a.type!=="Group"&&o===!1)break}break;default:throw Error("non exhaustive match!")}return Je(t)}function Fa(e,t,r){const n=Br(e);t[n]=n,r===!0&&ab(e,t)}function ab(e,t){const r=String.fromCharCode(e),n=r.toUpperCase();if(n!==r){const i=Br(n.charCodeAt(0));t[i]=i}else{const i=r.toLowerCase();if(i!==r){const s=Br(i.charCodeAt(0));t[s]=s}}}function Th(e,t){return qn(e.value,r=>{if(typeof r=="number")return vt(t,r);{const n=r;return qn(t,i=>n.from<=i&&i<=n.to)!==void 0}})}function Fu(e){const t=e.quantifier;return t&&t.atLeast===0?!0:e.value?ce(e.value)?Gt(e.value,Fu):Fu(e.value):!1}var ob=class extends Sl{constructor(e){super(),this.targetCharCodes=e,this.found=!1}visitChildren(e){if(this.found!==!0){switch(e.type){case"Lookahead":this.visitLookahead(e);return;case"NegativeLookahead":this.visitNegativeLookahead(e);return}super.visitChildren(e)}}visitCharacter(e){vt(this.targetCharCodes,e.value)&&(this.found=!0)}visitSet(e){e.complement?Th(e,this.targetCharCodes)===void 0&&(this.found=!0):Th(e,this.targetCharCodes)!==void 0&&(this.found=!0)}};function Ud(e,t){if(t instanceof RegExp){const r=Al(t),n=new ob(e);return n.visit(r),n.found}else return qn(t,r=>vt(e,r.charCodeAt(0)))!==void 0}var un="PATTERN",xu="defaultMode",lb="modes",Nm=typeof new RegExp("(?:)").sticky=="boolean";function ub(e,t){t=Ld(t,{useSticky:Nm,debug:!1,safeMode:!1,positionTracking:"full",lineTerminatorCharacters:["\r",`
`],tracer:(_,T)=>T()});const r=t.tracer;r("initCharCodeToOptimizedIndexMap",()=>{Pb()});let n;r("Reject Lexer.NA",()=>{n=Cl(e,_=>_[un]===wt.NA)});let i=!1,s;r("Transform Patterns",()=>{i=!1,s=K(n,_=>{const T=_[un];if(br(T)){const M=T.source;return M.length===1&&M!=="^"&&M!=="$"&&M!=="."&&!T.ignoreCase?M:M.length===2&&M[0]==="\\"&&!vt(["d","D","s","S","t","r","n","t","0","c","b","B","f","v","w","W"],M[1])?M[1]:t.useSticky?wh(T):Rh(T)}else{if(Ar(T))return i=!0,{exec:T};if(typeof T=="object")return i=!0,T;if(typeof T=="string"){if(T.length===1)return T;{const M=T.replace(/[\\^$.*+?()[\]{}|]/g,"\\$&"),F=new RegExp(M);return t.useSticky?wh(F):Rh(F)}}else throw Error("non exhaustive match")}})});let a,o,l,u,c;r("misc mapping",()=>{a=K(n,_=>_.tokenTypeIdx),o=K(n,_=>{const T=_.GROUP;if(T!==wt.SKIPPED){if(Ct(T))return T;if(kr(T))return!1;throw Error("non exhaustive match")}}),l=K(n,_=>{const T=_.LONGER_ALT;if(T)return ce(T)?K(T,M=>ch(n,M)):[ch(n,T)]}),u=K(n,_=>_.PUSH_MODE),c=K(n,_=>J(_,"POP_MODE"))});let d;r("Line Terminator Handling",()=>{const _=Om(t.lineTerminatorCharacters);d=K(n,T=>!1),t.positionTracking!=="onlyOffset"&&(d=K(n,T=>J(T,"LINE_BREAKS")?!!T.LINE_BREAKS:Dm(T,_)===!1&&Ud(_,T.PATTERN)))});let f,h,m,R;r("Misc Mapping #2",()=>{f=K(n,Pm),h=K(s,Ab),m=mt(n,(_,T)=>{const M=T.GROUP;return Ct(M)&&M!==wt.SKIPPED&&(_[M]=[]),_},{}),R=K(s,(_,T)=>({pattern:s[T],longerAlt:l[T],canLineTerminator:d[T],isCustom:f[T],short:h[T],group:o[T],push:u[T],pop:c[T],tokenTypeIdx:a[T],tokenType:n[T]}))});let S=!0,v=[];return t.safeMode||r("First Char Optimization",()=>{v=mt(n,(_,T,M)=>{if(typeof T.PATTERN=="string")su(_,Br(T.PATTERN.charCodeAt(0)),R[M]);else if(ce(T.START_CHARS_HINT)){let F;Q(T.START_CHARS_HINT,W=>{const U=Br(typeof W=="string"?W.charCodeAt(0):W);F!==U&&(F=U,su(_,U,R[M]))})}else if(br(T.PATTERN))if(T.PATTERN.unicode)S=!1,t.ensureOptimizations&&Lu(`${Ko}	Unable to analyze < ${T.PATTERN.toString()} > pattern.
	The regexp unicode flag is not currently supported by the regexp-to-ast library.
	This will disable the lexer's first char optimizations.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNICODE_OPTIMIZE`);else{const F=sb(T.PATTERN,t.ensureOptimizations);Re(F)&&(S=!1),Q(F,W=>{su(_,W,R[M])})}else t.ensureOptimizations&&Lu(`${Ko}	TokenType: <${T.name}> is using a custom token pattern without providing <start_chars_hint> parameter.
	This will disable the lexer's first char optimizations.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_OPTIMIZE`),S=!1;return _},[])}),{emptyGroups:m,patternIdxToConfig:R,charCodeToPatternIdxToConfig:v,hasCustom:i,canBeOptimized:S}}function cb(e,t){let r=[];const n=fb(e);r=r.concat(n.errors);const i=hb(n.valid),s=i.valid;return r=r.concat(i.errors),r=r.concat(db(s)),r=r.concat(wb(s)),r=r.concat(Cb(s,t)),r=r.concat(_b(s)),r}function db(e){let t=[];const r=Dt(e,n=>br(n[un]));return t=t.concat(mb(r)),t=t.concat(vb(r)),t=t.concat(Tb(r)),t=t.concat(Rb(r)),t=t.concat(gb(r)),t}function fb(e){const t=Dt(e,r=>!J(r,un));return{errors:K(t,r=>({message:"Token Type: ->"+r.name+"<- missing static 'PATTERN' property",type:xe.MISSING_PATTERN,tokenTypes:[r]})),valid:wl(e,t)}}function hb(e){const t=Dt(e,r=>{const n=r[un];return!br(n)&&!Ar(n)&&!J(n,"exec")&&!Ct(n)});return{errors:K(t,r=>({message:"Token Type: ->"+r.name+"<- static 'PATTERN' can only be a RegExp, a Function matching the {CustomPatternMatcherFunc} type or an Object matching the {ICustomPattern} interface.",type:xe.INVALID_PATTERN,tokenTypes:[r]})),valid:wl(e,t)}}var pb=/[^\\][$]/;function mb(e){class t extends Sl{constructor(){super(...arguments),this.found=!1}visitEndAnchor(n){this.found=!0}}return K(Dt(e,r=>{const n=r.PATTERN;try{const i=Al(n),s=new t;return s.visit(i),s.found}catch{return pb.test(n.source)}}),r=>({message:`Unexpected RegExp Anchor Error:
	Token Type: ->`+r.name+`<- static 'PATTERN' cannot contain end of input anchor '$'
	See chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS	for details.`,type:xe.EOI_ANCHOR_FOUND,tokenTypes:[r]}))}function gb(e){return K(Dt(e,t=>t.PATTERN.test("")),t=>({message:"Token Type: ->"+t.name+"<- static 'PATTERN' must not match an empty string",type:xe.EMPTY_MATCH_PATTERN,tokenTypes:[t]}))}var yb=/[^\\[][\^]|^\^/;function vb(e){class t extends Sl{constructor(){super(...arguments),this.found=!1}visitStartAnchor(n){this.found=!0}}return K(Dt(e,r=>{const n=r.PATTERN;try{const i=Al(n),s=new t;return s.visit(i),s.found}catch{return yb.test(n.source)}}),r=>({message:`Unexpected RegExp Anchor Error:
	Token Type: ->`+r.name+`<- static 'PATTERN' cannot contain start of input anchor '^'
	See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS	for details.`,type:xe.SOI_ANCHOR_FOUND,tokenTypes:[r]}))}function Tb(e){return K(Dt(e,t=>{const r=t[un];return r instanceof RegExp&&(r.multiline||r.global)}),t=>({message:"Token Type: ->"+t.name+"<- static 'PATTERN' may NOT contain global('g') or multiline('m')",type:xe.UNSUPPORTED_FLAGS_FOUND,tokenTypes:[t]}))}function Rb(e){const t=[];let r=K(e,n=>mt(e,(i,s)=>(n.PATTERN.source===s.PATTERN.source&&!vt(t,s)&&s.PATTERN!==wt.NA&&(t.push(s),i.push(s)),i),[]));return r=Qs(r),K(Dt(r,n=>n.length>1),n=>{const i=K(n,s=>s.name);return{message:`The same RegExp pattern ->${Vt(n).PATTERN}<-has been used in all of the following Token Types: ${i.join(", ")} <-`,type:xe.DUPLICATE_PATTERNS_FOUND,tokenTypes:n}})}function wb(e){return K(Dt(e,t=>{if(!J(t,"GROUP"))return!1;const r=t.GROUP;return r!==wt.SKIPPED&&r!==wt.NA&&!Ct(r)}),t=>({message:"Token Type: ->"+t.name+"<- static 'GROUP' can only be Lexer.SKIPPED/Lexer.NA/A String",type:xe.INVALID_GROUP_TYPE_FOUND,tokenTypes:[t]}))}function Cb(e,t){return K(Dt(e,r=>r.PUSH_MODE!==void 0&&!vt(t,r.PUSH_MODE)),r=>({message:`Token Type: ->${r.name}<- static 'PUSH_MODE' value cannot refer to a Lexer Mode ->${r.PUSH_MODE}<-which does not exist`,type:xe.PUSH_MODE_DOES_NOT_EXIST,tokenTypes:[r]}))}function _b(e){const t=[],r=mt(e,(n,i,s)=>{const a=i.PATTERN;return a===wt.NA||(Ct(a)?n.push({str:a,idx:s,tokenType:i}):br(a)&&bb(a)&&n.push({str:a.source,idx:s,tokenType:i})),n},[]);return Q(e,(n,i)=>{Q(r,({str:s,idx:a,tokenType:o})=>{if(i<a&&Sb(s,n.PATTERN)){const l=`Token: ->${o.name}<- can never be matched.
Because it appears AFTER the Token Type ->${n.name}<-in the lexer's definition.
See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNREACHABLE`;t.push({message:l,type:xe.UNREACHABLE_PATTERN,tokenTypes:[n,o]})}})}),t}function Sb(e,t){if(br(t)){const r=t.exec(e);return r!==null&&r.index===0}else{if(Ar(t))return t(e,0,[],{});if(J(t,"exec"))return t.exec(e,0,[],{});if(typeof t=="string")return t===e;throw Error("non exhaustive match")}}function bb(e){return qn([".","\\","[","]","|","^","$","(",")","?","*","+","{"],t=>e.source.indexOf(t)!==-1)===void 0}function Rh(e){const t=e.ignoreCase?"i":"";return new RegExp(`^(?:${e.source})`,t)}function wh(e){const t=e.ignoreCase?"iy":"y";return new RegExp(`${e.source}`,t)}function kb(e,t,r){const n=[];return J(e,"defaultMode")||n.push({message:"A MultiMode Lexer cannot be initialized without a <"+xu+`> property in its definition
`,type:xe.MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE}),J(e,"modes")||n.push({message:"A MultiMode Lexer cannot be initialized without a <"+lb+`> property in its definition
`,type:xe.MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY}),J(e,"modes")&&J(e,"defaultMode")&&!J(e.modes,e.defaultMode)&&n.push({message:`A MultiMode Lexer cannot be initialized with a ${xu}: <${e.defaultMode}>which does not exist
`,type:xe.MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST}),J(e,"modes")&&Q(e.modes,(i,s)=>{Q(i,(a,o)=>{kr(a)?n.push({message:`A Lexer cannot be initialized using an undefined Token Type. Mode:<${s}> at index: <${o}>
`,type:xe.LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED}):J(a,"LONGER_ALT")&&Q(ce(a.LONGER_ALT)?a.LONGER_ALT:[a.LONGER_ALT],l=>{!kr(l)&&!vt(i,l)&&n.push({message:`A MultiMode Lexer cannot be initialized with a longer_alt <${l.name}> on token <${a.name}> outside of mode <${s}>
`,type:xe.MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE})})})}),n}function $b(e,t,r){const n=[];let i=!1;const s=Cl(Qs(Ft(Je(e.modes))),o=>o[un]===wt.NA),a=Om(r);return t&&Q(s,o=>{const l=Dm(o,a);if(l!==!1){const u={message:Nb(o,l),type:l.issue,tokenType:o};n.push(u)}else J(o,"LINE_BREAKS")?o.LINE_BREAKS===!0&&(i=!0):Ud(a,o.PATTERN)&&(i=!0)}),t&&!i&&n.push({message:`Warning: No LINE_BREAKS Found.
	This Lexer has been defined to track line and column information,
	But none of the Token Types can be identified as matching a line terminator.
	See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#LINE_BREAKS 
	for details.`,type:xe.NO_LINE_BREAKS_FLAGS}),n}function Eb(e){const t={};return Q(Nt(e),r=>{const n=e[r];if(ce(n))t[r]=[];else throw Error("non exhaustive match")}),t}function Pm(e){const t=e.PATTERN;if(br(t))return!1;if(Ar(t))return!0;if(J(t,"exec"))return!0;if(Ct(t))return!1;throw Error("non exhaustive match")}function Ab(e){return Ct(e)&&e.length===1?e.charCodeAt(0):!1}var Ib={test:function(e){const t=e.length;for(let r=this.lastIndex;r<t;r++){const n=e.charCodeAt(r);if(n===10)return this.lastIndex=r+1,!0;if(n===13)return e.charCodeAt(r+1)===10?this.lastIndex=r+2:this.lastIndex=r+1,!0}return!1},lastIndex:0};function Dm(e,t){if(J(e,"LINE_BREAKS"))return!1;if(br(e.PATTERN)){try{Ud(t,e.PATTERN)}catch(r){return{issue:xe.IDENTIFY_TERMINATOR,errMsg:r.message}}return!1}else{if(Ct(e.PATTERN))return!1;if(Pm(e))return{issue:xe.CUSTOM_LINE_BREAK};throw Error("non exhaustive match")}}function Nb(e,t){if(t.issue===xe.IDENTIFY_TERMINATOR)return`Warning: unable to identify line terminator usage in pattern.
	The problem is in the <${e.name}> Token Type
	 Root cause: ${t.errMsg}.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#IDENTIFY_TERMINATOR`;if(t.issue===xe.CUSTOM_LINE_BREAK)return`Warning: A Custom Token Pattern should specify the <line_breaks> option.
	The problem is in the <${e.name}> Token Type
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_LINE_BREAK`;throw Error("non exhaustive match")}function Om(e){return K(e,t=>Ct(t)?t.charCodeAt(0):t)}function su(e,t,r){e[t]===void 0?e[t]=[r]:e[t].push(r)}var Ja=[];function Br(e){return e<256?e:Ja[e]}function Pb(){if(Re(Ja)){Ja=new Array(65536);for(let e=0;e<65536;e++)Ja[e]=e>255?255+~~(e/255):e}}function ia(e,t){const r=e.tokenTypeIdx;return r===t.tokenTypeIdx?!0:t.isParent===!0&&t.categoryMatchesMap[r]===!0}function Go(e,t){return e.tokenTypeIdx===t.tokenTypeIdx}var Ch=1,Lm={};function sa(e){const t=Db(e);Ob(t),Mb(t),Lb(t),Q(t,r=>{r.isParent=r.categoryMatches.length>0})}function Db(e){let t=lt(e),r=e,n=!0;for(;n;){r=Qs(Ft(K(r,s=>s.CATEGORIES)));const i=wl(r,t);t=t.concat(i),Re(i)?n=!1:r=i}return t}function Ob(e){Q(e,t=>{Fm(t)||(Lm[Ch]=t,t.tokenTypeIdx=Ch++),_h(t)&&!ce(t.CATEGORIES)&&(t.CATEGORIES=[t.CATEGORIES]),_h(t)||(t.CATEGORIES=[]),Fb(t)||(t.categoryMatches=[]),xb(t)||(t.categoryMatchesMap={})})}function Lb(e){Q(e,t=>{t.categoryMatches=[],Q(t.categoryMatchesMap,(r,n)=>{t.categoryMatches.push(Lm[n].tokenTypeIdx)})})}function Mb(e){Q(e,t=>{Mm([],t)})}function Mm(e,t){Q(e,r=>{t.categoryMatchesMap[r.tokenTypeIdx]=!0}),Q(t.CATEGORIES,r=>{const n=e.concat(t);vt(n,r)||Mm(n,r)})}function Fm(e){return J(e,"tokenTypeIdx")}function _h(e){return J(e,"CATEGORIES")}function Fb(e){return J(e,"categoryMatches")}function xb(e){return J(e,"categoryMatchesMap")}function qb(e){return J(e,"tokenTypeIdx")}var qu={buildUnableToPopLexerModeMessage(e){return`Unable to pop Lexer Mode after encountering Token ->${e.image}<- The Mode Stack is empty`},buildUnexpectedCharactersMessage(e,t,r,n,i){return`unexpected character: ->${e.charAt(t)}<- at offset: ${t}, skipped ${r} characters.`}},xe;(function(e){e[e.MISSING_PATTERN=0]="MISSING_PATTERN",e[e.INVALID_PATTERN=1]="INVALID_PATTERN",e[e.EOI_ANCHOR_FOUND=2]="EOI_ANCHOR_FOUND",e[e.UNSUPPORTED_FLAGS_FOUND=3]="UNSUPPORTED_FLAGS_FOUND",e[e.DUPLICATE_PATTERNS_FOUND=4]="DUPLICATE_PATTERNS_FOUND",e[e.INVALID_GROUP_TYPE_FOUND=5]="INVALID_GROUP_TYPE_FOUND",e[e.PUSH_MODE_DOES_NOT_EXIST=6]="PUSH_MODE_DOES_NOT_EXIST",e[e.MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE=7]="MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE",e[e.MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY=8]="MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY",e[e.MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST=9]="MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST",e[e.LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED=10]="LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED",e[e.SOI_ANCHOR_FOUND=11]="SOI_ANCHOR_FOUND",e[e.EMPTY_MATCH_PATTERN=12]="EMPTY_MATCH_PATTERN",e[e.NO_LINE_BREAKS_FLAGS=13]="NO_LINE_BREAKS_FLAGS",e[e.UNREACHABLE_PATTERN=14]="UNREACHABLE_PATTERN",e[e.IDENTIFY_TERMINATOR=15]="IDENTIFY_TERMINATOR",e[e.CUSTOM_LINE_BREAK=16]="CUSTOM_LINE_BREAK",e[e.MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE=17]="MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE"})(xe||(xe={}));var qi={deferDefinitionErrorsHandling:!1,positionTracking:"full",lineTerminatorsPattern:/\n|\r\n?/g,lineTerminatorCharacters:[`
`,"\r"],ensureOptimizations:!1,safeMode:!1,errorMessageProvider:qu,traceInitPerf:!1,skipValidations:!1,recoveryEnabled:!0};Object.freeze(qi);var wt=class{constructor(e,t=qi){if(this.lexerDefinition=e,this.lexerDefinitionErrors=[],this.lexerDefinitionWarning=[],this.patternIdxToConfig={},this.charCodeToPatternIdxToConfig={},this.modes=[],this.emptyGroups={},this.trackStartLines=!0,this.trackEndLines=!0,this.hasCustom=!1,this.canModeBeOptimized={},this.TRACE_INIT=(n,i)=>{if(this.traceInitPerf===!0){this.traceInitIndent++;const s=new Array(this.traceInitIndent+1).join("	");this.traceInitIndent<this.traceInitMaxIdent&&console.log(`${s}--> <${n}>`);const{time:a,value:o}=$m(i),l=a>10?console.warn:console.log;return this.traceInitIndent<this.traceInitMaxIdent&&l(`${s}<-- <${n}> time: ${a}ms`),this.traceInitIndent--,o}else return i()},typeof t=="boolean")throw Error(`The second argument to the Lexer constructor is now an ILexerConfig Object.
a boolean 2nd argument is no longer supported`);this.config=Pt({},qi,t);const r=this.config.traceInitPerf;r===!0?(this.traceInitMaxIdent=1/0,this.traceInitPerf=!0):typeof r=="number"&&(this.traceInitMaxIdent=r,this.traceInitPerf=!0),this.traceInitIndent=-1,this.TRACE_INIT("Lexer Constructor",()=>{let n,i=!0;this.TRACE_INIT("Lexer Config handling",()=>{if(this.config.lineTerminatorsPattern===qi.lineTerminatorsPattern)this.config.lineTerminatorsPattern=Ib;else if(this.config.lineTerminatorCharacters===qi.lineTerminatorCharacters)throw Error(`Error: Missing <lineTerminatorCharacters> property on the Lexer config.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#MISSING_LINE_TERM_CHARS`);if(t.safeMode&&t.ensureOptimizations)throw Error('"safeMode" and "ensureOptimizations" flags are mutually exclusive.');this.trackStartLines=/full|onlyStart/i.test(this.config.positionTracking),this.trackEndLines=/full/i.test(this.config.positionTracking),ce(e)?n={modes:{defaultMode:lt(e)},defaultMode:xu}:(i=!1,n=lt(e))}),this.config.skipValidations===!1&&(this.TRACE_INIT("performRuntimeChecks",()=>{this.lexerDefinitionErrors=this.lexerDefinitionErrors.concat(kb(n,this.trackStartLines,this.config.lineTerminatorCharacters))}),this.TRACE_INIT("performWarningRuntimeChecks",()=>{this.lexerDefinitionWarning=this.lexerDefinitionWarning.concat($b(n,this.trackStartLines,this.config.lineTerminatorCharacters))})),n.modes=n.modes?n.modes:{},Q(n.modes,(a,o)=>{n.modes[o]=Cl(a,l=>kr(l))});const s=Nt(n.modes);if(Q(n.modes,(a,o)=>{this.TRACE_INIT(`Mode: <${o}> processing`,()=>{if(this.modes.push(o),this.config.skipValidations===!1&&this.TRACE_INIT("validatePatterns",()=>{this.lexerDefinitionErrors=this.lexerDefinitionErrors.concat(cb(a,s))}),Re(this.lexerDefinitionErrors)){sa(a);let l;this.TRACE_INIT("analyzeTokenTypes",()=>{l=ub(a,{lineTerminatorCharacters:this.config.lineTerminatorCharacters,positionTracking:t.positionTracking,ensureOptimizations:t.ensureOptimizations,safeMode:t.safeMode,tracer:this.TRACE_INIT})}),this.patternIdxToConfig[o]=l.patternIdxToConfig,this.charCodeToPatternIdxToConfig[o]=l.charCodeToPatternIdxToConfig,this.emptyGroups=Pt({},this.emptyGroups,l.emptyGroups),this.hasCustom=l.hasCustom||this.hasCustom,this.canModeBeOptimized[o]=l.canBeOptimized}})}),this.defaultMode=n.defaultMode,!Re(this.lexerDefinitionErrors)&&!this.config.deferDefinitionErrorsHandling){const a=K(this.lexerDefinitionErrors,o=>o.message).join(`-----------------------
`);throw new Error(`Errors detected in definition of Lexer:
`+a)}Q(this.lexerDefinitionWarning,a=>{km(a.message)}),this.TRACE_INIT("Choosing sub-methods implementations",()=>{if(Nm?(this.chopInput=nn,this.match=this.matchWithTest):(this.updateLastIndex=Qe,this.match=this.matchWithExec),i&&(this.handleModes=Qe),this.trackStartLines===!1&&(this.computeNewColumn=nn),this.trackEndLines===!1&&(this.updateTokenEndLineColumnLocation=Qe),/full/i.test(this.config.positionTracking))this.createTokenInstance=this.createFullToken;else if(/onlyStart/i.test(this.config.positionTracking))this.createTokenInstance=this.createStartOnlyToken;else if(/onlyOffset/i.test(this.config.positionTracking))this.createTokenInstance=this.createOffsetOnlyToken;else throw Error(`Invalid <positionTracking> config option: "${this.config.positionTracking}"`);this.hasCustom?(this.addToken=this.addTokenUsingPush,this.handlePayload=this.handlePayloadWithCustom):(this.addToken=this.addTokenUsingMemberAccess,this.handlePayload=this.handlePayloadNoCustom)}),this.TRACE_INIT("Failed Optimization Warnings",()=>{const a=mt(this.canModeBeOptimized,(o,l,u)=>(l===!1&&o.push(u),o),[]);if(t.ensureOptimizations&&!Re(a))throw Error(`Lexer Modes: < ${a.join(", ")} > cannot be optimized.
	 Disable the "ensureOptimizations" lexer config flag to silently ignore this and run the lexer in an un-optimized mode.
	 Or inspect the console log for details on how to resolve these issues.`)}),this.TRACE_INIT("clearRegExpParserCache",()=>{ib()}),this.TRACE_INIT("toFastProperties",()=>{Em(this)})})}tokenize(e,t=this.defaultMode){if(!Re(this.lexerDefinitionErrors)){const r=K(this.lexerDefinitionErrors,n=>n.message).join(`-----------------------
`);throw new Error(`Unable to Tokenize because Errors detected in definition of Lexer:
`+r)}return this.tokenizeInternal(e,t)}tokenizeInternal(e,t){let r,n,i,s,a,o,l,u,c,d,f,h,m,R,S;const v=e,_=v.length;let T=0,M=0;const F=this.hasCustom?0:Math.floor(e.length/10),W=new Array(F),U=[];let ee=this.trackStartLines?1:void 0,se=this.trackStartLines?1:void 0;const he=Eb(this.emptyGroups),x=this.trackStartLines,A=this.config.lineTerminatorsPattern;let y=0,b=[],q=[];const O=[],$=[];Object.freeze($);let k;function ie(){return b}function de(ye){const Ie=Br(ye),ct=q[Ie];return ct===void 0?$:ct}const Ge=ye=>{if(O.length===1&&ye.tokenType.PUSH_MODE===void 0){const Ie=this.config.errorMessageProvider.buildUnableToPopLexerModeMessage(ye);U.push({offset:ye.startOffset,line:ye.startLine,column:ye.startColumn,length:ye.image.length,message:Ie})}else{O.pop();const Ie=xn(O);b=this.patternIdxToConfig[Ie],q=this.charCodeToPatternIdxToConfig[Ie],y=b.length;const ct=this.canModeBeOptimized[Ie]&&this.config.safeMode===!1;q&&ct?k=de:k=ie}};function ut(ye){O.push(ye),q=this.charCodeToPatternIdxToConfig[ye],b=this.patternIdxToConfig[ye],y=b.length,y=b.length;const Ie=this.canModeBeOptimized[ye]&&this.config.safeMode===!1;q&&Ie?k=de:k=ie}ut.call(this,t);let ae;const ze=this.config.recoveryEnabled;for(;T<_;){o=null;const ye=v.charCodeAt(T),Ie=k(ye),ct=Ie.length;for(r=0;r<ct;r++){ae=Ie[r];const ve=ae.pattern;l=null;const Oe=ae.short;if(Oe!==!1?ye===Oe&&(o=ve):ae.isCustom===!0?(S=ve.exec(v,T,W,he),S!==null?(o=S[0],S.payload!==void 0&&(l=S.payload)):o=null):(this.updateLastIndex(ve,T),o=this.match(ve,e,T)),o!==null){if(a=ae.longerAlt,a!==void 0){const et=a.length;for(i=0;i<et;i++){const w=b[a[i]],I=w.pattern;if(u=null,w.isCustom===!0?(S=I.exec(v,T,W,he),S!==null?(s=S[0],S.payload!==void 0&&(u=S.payload)):s=null):(this.updateLastIndex(I,T),s=this.match(I,e,T)),s&&s.length>o.length){o=s,l=u,ae=w;break}}}break}}if(o!==null){if(c=o.length,d=ae.group,d!==void 0&&(f=ae.tokenTypeIdx,h=this.createTokenInstance(o,T,f,ae.tokenType,ee,se,c),this.handlePayload(h,l),d===!1?M=this.addToken(W,M,h):he[d].push(h)),e=this.chopInput(e,c),T=T+c,se=this.computeNewColumn(se,c),x===!0&&ae.canLineTerminator===!0){let ve=0,Oe,et;A.lastIndex=0;do Oe=A.test(o),Oe===!0&&(et=A.lastIndex-1,ve++);while(Oe===!0);ve!==0&&(ee=ee+ve,se=c-et,this.updateTokenEndLineColumnLocation(h,d,et,ve,ee,se,c))}this.handleModes(ae,Ge,ut,h)}else{const ve=T,Oe=ee,et=se;let w=ze===!1;for(;w===!1&&T<_;)for(e=this.chopInput(e,1),T++,n=0;n<y;n++){const I=b[n],L=I.pattern,Z=I.short;if(Z!==!1?v.charCodeAt(T)===Z&&(w=!0):I.isCustom===!0?w=L.exec(v,T,W,he)!==null:(this.updateLastIndex(L,T),w=L.exec(e)!==null),w===!0)break}if(m=T-ve,se=this.computeNewColumn(se,m),R=this.config.errorMessageProvider.buildUnexpectedCharactersMessage(v,ve,m,Oe,et),U.push({offset:ve,line:Oe,column:et,length:m,message:R}),ze===!1)break}}return this.hasCustom||(W.length=M),{tokens:W,groups:he,errors:U}}handleModes(e,t,r,n){if(e.pop===!0){const i=e.push;t(n),i!==void 0&&r.call(this,i)}else e.push!==void 0&&r.call(this,e.push)}chopInput(e,t){return e.substring(t)}updateLastIndex(e,t){e.lastIndex=t}updateTokenEndLineColumnLocation(e,t,r,n,i,s,a){let o,l;t!==void 0&&(o=r===a-1,l=o?-1:0,n===1&&o===!0||(e.endLine=i+l,e.endColumn=s-1+-l))}computeNewColumn(e,t){return e+t}createOffsetOnlyToken(e,t,r,n){return{image:e,startOffset:t,tokenTypeIdx:r,tokenType:n}}createStartOnlyToken(e,t,r,n,i,s){return{image:e,startOffset:t,startLine:i,startColumn:s,tokenTypeIdx:r,tokenType:n}}createFullToken(e,t,r,n,i,s,a){return{image:e,startOffset:t,endOffset:t+a-1,startLine:i,endLine:i,startColumn:s,endColumn:s+a-1,tokenTypeIdx:r,tokenType:n}}addTokenUsingPush(e,t,r){return e.push(r),t}addTokenUsingMemberAccess(e,t,r){return e[t]=r,t++,t}handlePayloadNoCustom(e,t){}handlePayloadWithCustom(e,t){t!==null&&(e.payload=t)}matchWithTest(e,t,r){return e.test(t)===!0?t.substring(r,e.lastIndex):null}matchWithExec(e,t){const r=e.exec(t);return r!==null?r[0]:null}};wt.SKIPPED="This marks a skipped Token pattern, this means each token identified by it willbe consumed and then thrown into oblivion, this can be used to for example to completely ignore whitespace.";wt.NA=/NOT_APPLICABLE/;function On(e){return xm(e)?e.LABEL:e.name}function xm(e){return Ct(e.LABEL)&&e.LABEL!==""}var jb="parent",Sh="categories",bh="label",kh="group",$h="push_mode",Eh="pop_mode",Ah="longer_alt",Ih="line_breaks",Nh="start_chars_hint";function qm(e){return Ub(e)}function Ub(e){const t=e.pattern,r={};if(r.name=e.name,kr(t)||(r.PATTERN=t),J(e,jb))throw`The parent property is no longer supported.
See: https://github.com/chevrotain/chevrotain/issues/564#issuecomment-349062346 for details.`;return J(e,Sh)&&(r.CATEGORIES=e[Sh]),sa([r]),J(e,bh)&&(r.LABEL=e[bh]),J(e,kh)&&(r.GROUP=e[kh]),J(e,Eh)&&(r.POP_MODE=e[Eh]),J(e,$h)&&(r.PUSH_MODE=e[$h]),J(e,Ah)&&(r.LONGER_ALT=e[Ah]),J(e,Ih)&&(r.LINE_BREAKS=e[Ih]),J(e,Nh)&&(r.START_CHARS_HINT=e[Nh]),r}var Hr=qm({name:"EOF",pattern:wt.NA});sa([Hr]);function Wd(e,t,r,n,i,s,a,o){return{image:t,startOffset:r,endOffset:n,startLine:i,endLine:s,startColumn:a,endColumn:o,tokenTypeIdx:e.tokenTypeIdx,tokenType:e}}function jm(e,t){return ia(e,t)}var Nn={buildMismatchTokenMessage({expected:e,actual:t,previous:r,ruleName:n}){return`Expecting ${xm(e)?`--> ${On(e)} <--`:`token of type --> ${e.name} <--`} but found --> '${t.image}' <--`},buildNotAllInputParsedMessage({firstRedundant:e,ruleName:t}){return"Redundant input, expecting EOF but found: "+e.image},buildNoViableAltMessage({expectedPathsPerAlt:e,actual:t,previous:r,customUserDescription:n,ruleName:i}){const s="Expecting: ",a=`
but found: '`+Vt(t).image+"'";return n?s+n+a:`Expecting: one of these possible Token sequences:
${K(K(mt(e,(o,l)=>o.concat(l),[]),o=>`[${K(o,l=>On(l)).join(", ")}]`),(o,l)=>`  ${l+1}. ${o}`).join(`
`)}`+a},buildEarlyExitMessage({expectedIterationPaths:e,actual:t,customUserDescription:r,ruleName:n}){const i="Expecting: ",s=`
but found: '`+Vt(t).image+"'";return r?i+r+s:`Expecting: expecting at least one iteration which starts with one of these possible Token sequences::
  <${K(e,a=>`[${K(a,o=>On(o)).join(",")}]`).join(" ,")}>`+s}};Object.freeze(Nn);var Wb={buildRuleNotFoundError(e,t){return"Invalid grammar, reference to a rule which is not defined: ->"+t.nonTerminalName+`<-
inside top level rule: ->`+e.name+"<-"}},tn={buildDuplicateFoundError(e,t){function r(u){return u instanceof be?u.terminalType.name:u instanceof gt?u.nonTerminalName:""}const n=e.name,i=Vt(t),s=i.idx,a=nr(i),o=r(i);let l=`->${a}${s>0?s:""}<- ${o?`with argument: ->${o}<-`:""}
                  appears more than once (${t.length} times) in the top level rule: ->${n}<-.                  
                  For further details see: https://chevrotain.io/docs/FAQ.html#NUMERICAL_SUFFIXES 
                  `;return l=l.replace(/[ \t]+/g," "),l=l.replace(/\s\s+/g,`
`),l},buildNamespaceConflictError(e){return`Namespace conflict found in grammar.
The grammar has both a Terminal(Token) and a Non-Terminal(Rule) named: <${e.name}>.
To resolve this make sure each Terminal and Non-Terminal names are unique
This is easy to accomplish by using the convention that Terminal names start with an uppercase letter
and Non-Terminal names start with a lower case letter.`},buildAlternationPrefixAmbiguityError(e){const t=K(e.prefixPath,n=>On(n)).join(", "),r=e.alternation.idx===0?"":e.alternation.idx;return`Ambiguous alternatives: <${e.ambiguityIndices.join(" ,")}> due to common lookahead prefix
in <OR${r}> inside <${e.topLevelRule.name}> Rule,
<${t}> may appears as a prefix path in all these alternatives.
See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#COMMON_PREFIX
For Further details.`},buildAlternationAmbiguityError(e){const t=K(e.prefixPath,i=>On(i)).join(", "),r=e.alternation.idx===0?"":e.alternation.idx;let n=`Ambiguous Alternatives Detected: <${e.ambiguityIndices.join(" ,")}> in <OR${r}> inside <${e.topLevelRule.name}> Rule,
<${t}> may appears as a prefix path in all these alternatives.
`;return n=n+`See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#AMBIGUOUS_ALTERNATIVES
For Further details.`,n},buildEmptyRepetitionError(e){let t=nr(e.repetition);return e.repetition.idx!==0&&(t+=e.repetition.idx),`The repetition <${t}> within Rule <${e.topLevelRule.name}> can never consume any tokens.
This could lead to an infinite loop.`},buildTokenNameError(e){return"deprecated"},buildEmptyAlternationError(e){return`Ambiguous empty alternative: <${e.emptyChoiceIdx+1}> in <OR${e.alternation.idx}> inside <${e.topLevelRule.name}> Rule.
Only the last alternative may be an empty alternative.`},buildTooManyAlternativesError(e){return`An Alternation cannot have more than 256 alternatives:
<OR${e.alternation.idx}> inside <${e.topLevelRule.name}> Rule.
 has ${e.alternation.definition.length+1} alternatives.`},buildLeftRecursionError(e){const t=e.topLevelRule.name;return`Left Recursion found in grammar.
rule: <${t}> can be invoked from itself (directly or indirectly)
without consuming any Tokens. The grammar path that causes this is: 
 ${`${t} --> ${K(e.leftRecursionPath,r=>r.name).concat([t]).join(" --> ")}`}
 To fix this refactor your grammar to remove the left recursion.
see: https://en.wikipedia.org/wiki/LL_parser#Left_factoring.`},buildInvalidRuleNameError(e){return"deprecated"},buildDuplicateRuleNameError(e){let t;return e.topLevelRule instanceof Yn?t=e.topLevelRule.name:t=e.topLevelRule,`Duplicate definition, rule: ->${t}<- is already defined in the grammar: ->${e.grammarName}<-`}};function Bb(e,t){const r=new Hb(e,t);return r.resolveRefs(),r.errors}var Hb=class extends Xn{constructor(e,t){super(),this.nameToTopRule=e,this.errMsgProvider=t,this.errors=[]}resolveRefs(){Q(Je(this.nameToTopRule),e=>{this.currTopLevel=e,e.accept(this)})}visitNonTerminal(e){const t=this.nameToTopRule[e.nonTerminalName];if(t)e.referencedRule=t;else{const r=this.errMsgProvider.buildRuleNotFoundError(this.currTopLevel,e);this.errors.push({message:r,type:yt.UNRESOLVED_SUBRULE_REF,ruleName:this.currTopLevel.name,unresolvedRefName:e.nonTerminalName})}}},Kb=class extends El{constructor(e,t){super(),this.topProd=e,this.path=t,this.possibleTokTypes=[],this.nextProductionName="",this.nextProductionOccurrence=0,this.found=!1,this.isAtEndOfPath=!1}startWalking(){if(this.found=!1,this.path.ruleStack[0]!==this.topProd.name)throw Error("The path does not start with the walker's top Rule!");return this.ruleStack=lt(this.path.ruleStack).reverse(),this.occurrenceStack=lt(this.path.occurrenceStack).reverse(),this.ruleStack.pop(),this.occurrenceStack.pop(),this.updateExpectedNext(),this.walk(this.topProd),this.possibleTokTypes}walk(e,t=[]){this.found||super.walk(e,t)}walkProdRef(e,t,r){if(e.referencedRule.name===this.nextProductionName&&e.idx===this.nextProductionOccurrence){const n=t.concat(r);this.updateExpectedNext(),this.walk(e.referencedRule,n)}}updateExpectedNext(){Re(this.ruleStack)?(this.nextProductionName="",this.nextProductionOccurrence=0,this.isAtEndOfPath=!0):(this.nextProductionName=this.ruleStack.pop(),this.nextProductionOccurrence=this.occurrenceStack.pop())}},Gb=class extends Kb{constructor(e,t){super(e,t),this.path=t,this.nextTerminalName="",this.nextTerminalOccurrence=0,this.nextTerminalName=this.path.lastTok.name,this.nextTerminalOccurrence=this.path.lastTokOccurrence}walkTerminal(e,t,r){this.isAtEndOfPath&&e.terminalType.name===this.nextTerminalName&&e.idx===this.nextTerminalOccurrence&&!this.found&&(this.possibleTokTypes=na(new _t({definition:t.concat(r)})),this.found=!0)}},Il=class extends El{constructor(e,t){super(),this.topRule=e,this.occurrence=t,this.result={token:void 0,occurrence:void 0,isEndOfRule:void 0}}startWalking(){return this.walk(this.topRule),this.result}},zb=class extends Il{walkMany(e,t,r){if(e.idx===this.occurrence){const n=Vt(t.concat(r));this.result.isEndOfRule=n===void 0,n instanceof be&&(this.result.token=n.terminalType,this.result.occurrence=n.idx)}else super.walkMany(e,t,r)}},Ph=class extends Il{walkManySep(e,t,r){if(e.idx===this.occurrence){const n=Vt(t.concat(r));this.result.isEndOfRule=n===void 0,n instanceof be&&(this.result.token=n.terminalType,this.result.occurrence=n.idx)}else super.walkManySep(e,t,r)}},Vb=class extends Il{walkAtLeastOne(e,t,r){if(e.idx===this.occurrence){const n=Vt(t.concat(r));this.result.isEndOfRule=n===void 0,n instanceof be&&(this.result.token=n.terminalType,this.result.occurrence=n.idx)}else super.walkAtLeastOne(e,t,r)}},Dh=class extends Il{walkAtLeastOneSep(e,t,r){if(e.idx===this.occurrence){const n=Vt(t.concat(r));this.result.isEndOfRule=n===void 0,n instanceof be&&(this.result.token=n.terminalType,this.result.occurrence=n.idx)}else super.walkAtLeastOneSep(e,t,r)}};function ju(e,t,r=[]){r=lt(r);let n=[],i=0;function s(o){return o.concat(st(e,i+1))}function a(o){const l=ju(s(o),t,r);return n.concat(l)}for(;r.length<t&&i<e.length;){const o=e[i];if(o instanceof _t)return a(o.definition);if(o instanceof gt)return a(o.definition);if(o instanceof ot)n=a(o.definition);else{if(o instanceof Ot)return a(o.definition.concat([new Fe({definition:o.definition})]));if(o instanceof Lt)return a([new _t({definition:o.definition}),new Fe({definition:[new be({terminalType:o.separator})].concat(o.definition)})]);if(o instanceof St)n=a(o.definition.concat([new Fe({definition:[new be({terminalType:o.separator})].concat(o.definition)})]));else if(o instanceof Fe)n=a(o.definition.concat([new Fe({definition:o.definition})]));else{if(o instanceof bt)return Q(o.definition,l=>{Re(l.definition)===!1&&(n=a(l.definition))}),n;if(o instanceof be)r.push(o.terminalType);else throw Error("non exhaustive match")}}i++}return n.push({partialPath:r,suffixDef:st(e,i)}),n}function Um(e,t,r,n){const i="EXIT_NONE_TERMINAL",s=[i],a="EXIT_ALTERNATIVE";let o=!1;const l=t.length,u=l-n-1,c=[],d=[];for(d.push({idx:-1,def:e,ruleStack:[],occurrenceStack:[]});!Re(d);){const f=d.pop();if(f===a){o&&xn(d).idx<=u&&d.pop();continue}const h=f.def,m=f.idx,R=f.ruleStack,S=f.occurrenceStack;if(Re(h))continue;const v=h[0];if(v===i){const _={idx:m,def:st(h),ruleStack:Fs(R),occurrenceStack:Fs(S)};d.push(_)}else if(v instanceof be)if(m<l-1){const _=m+1,T=t[_];if(r(T,v.terminalType)){const M={idx:_,def:st(h),ruleStack:R,occurrenceStack:S};d.push(M)}}else if(m===l-1)c.push({nextTokenType:v.terminalType,nextTokenOccurrence:v.idx,ruleStack:R,occurrenceStack:S}),o=!0;else throw Error("non exhaustive match");else if(v instanceof gt){const _=lt(R);_.push(v.nonTerminalName);const T=lt(S);T.push(v.idx);const M={idx:m,def:v.definition.concat(s,st(h)),ruleStack:_,occurrenceStack:T};d.push(M)}else if(v instanceof ot){const _={idx:m,def:st(h),ruleStack:R,occurrenceStack:S};d.push(_),d.push(a);const T={idx:m,def:v.definition.concat(st(h)),ruleStack:R,occurrenceStack:S};d.push(T)}else if(v instanceof Ot){const _=new Fe({definition:v.definition,idx:v.idx}),T={idx:m,def:v.definition.concat([_],st(h)),ruleStack:R,occurrenceStack:S};d.push(T)}else if(v instanceof Lt){const _=new Fe({definition:[new be({terminalType:v.separator})].concat(v.definition),idx:v.idx}),T={idx:m,def:v.definition.concat([_],st(h)),ruleStack:R,occurrenceStack:S};d.push(T)}else if(v instanceof St){const _={idx:m,def:st(h),ruleStack:R,occurrenceStack:S};d.push(_),d.push(a);const T=new Fe({definition:[new be({terminalType:v.separator})].concat(v.definition),idx:v.idx}),M={idx:m,def:v.definition.concat([T],st(h)),ruleStack:R,occurrenceStack:S};d.push(M)}else if(v instanceof Fe){const _={idx:m,def:st(h),ruleStack:R,occurrenceStack:S};d.push(_),d.push(a);const T=new Fe({definition:v.definition,idx:v.idx}),M={idx:m,def:v.definition.concat([T],st(h)),ruleStack:R,occurrenceStack:S};d.push(M)}else if(v instanceof bt)for(let _=v.definition.length-1;_>=0;_--){const T={idx:m,def:v.definition[_].definition.concat(st(h)),ruleStack:R,occurrenceStack:S};d.push(T),d.push(a)}else if(v instanceof _t)d.push({idx:m,def:v.definition.concat(st(h)),ruleStack:R,occurrenceStack:S});else if(v instanceof Yn)d.push(Yb(v,m,R,S));else throw Error("non exhaustive match")}return c}function Yb(e,t,r,n){const i=lt(r);i.push(e.name);const s=lt(n);return s.push(1),{idx:t,def:e.definition,ruleStack:i,occurrenceStack:s}}var Pe;(function(e){e[e.OPTION=0]="OPTION",e[e.REPETITION=1]="REPETITION",e[e.REPETITION_MANDATORY=2]="REPETITION_MANDATORY",e[e.REPETITION_MANDATORY_WITH_SEPARATOR=3]="REPETITION_MANDATORY_WITH_SEPARATOR",e[e.REPETITION_WITH_SEPARATOR=4]="REPETITION_WITH_SEPARATOR",e[e.ALTERNATION=5]="ALTERNATION"})(Pe||(Pe={}));function Bd(e){if(e instanceof ot||e==="Option")return Pe.OPTION;if(e instanceof Fe||e==="Repetition")return Pe.REPETITION;if(e instanceof Ot||e==="RepetitionMandatory")return Pe.REPETITION_MANDATORY;if(e instanceof Lt||e==="RepetitionMandatoryWithSeparator")return Pe.REPETITION_MANDATORY_WITH_SEPARATOR;if(e instanceof St||e==="RepetitionWithSeparator")return Pe.REPETITION_WITH_SEPARATOR;if(e instanceof bt||e==="Alternation")return Pe.ALTERNATION;throw Error("non exhaustive match")}function Oh(e){const{occurrence:t,rule:r,prodType:n,maxLookahead:i}=e,s=Bd(n);return s===Pe.ALTERNATION?Nl(t,r,i):Pl(t,r,s,i)}function Xb(e,t,r,n,i,s){const a=Nl(e,t,r);return s(a,n,Hm(a)?Go:ia,i)}function Qb(e,t,r,n,i,s){const a=Pl(e,t,i,r),o=Hm(a)?Go:ia;return s(a[0],o,n)}function Jb(e,t,r,n){const i=e.length,s=Gt(e,a=>Gt(a,o=>o.length===1));if(t)return function(a){const o=K(a,l=>l.GATE);for(let l=0;l<i;l++){const u=e[l],c=u.length,d=o[l];if(!(d!==void 0&&d.call(this)===!1))e:for(let f=0;f<c;f++){const h=u[f],m=h.length;for(let R=0;R<m;R++)if(r(this.LA(R+1),h[R])===!1)continue e;return l}}};if(s&&!n){const a=mt(K(e,o=>Ft(o)),(o,l,u)=>(Q(l,c=>{J(o,c.tokenTypeIdx)||(o[c.tokenTypeIdx]=u),Q(c.categoryMatches,d=>{J(o,d)||(o[d]=u)})}),o),{});return function(){return a[this.LA(1).tokenTypeIdx]}}else return function(){for(let a=0;a<i;a++){const o=e[a],l=o.length;e:for(let u=0;u<l;u++){const c=o[u],d=c.length;for(let f=0;f<d;f++)if(r(this.LA(f+1),c[f])===!1)continue e;return a}}}}function Zb(e,t,r){const n=Gt(e,s=>s.length===1),i=e.length;if(n&&!r){const s=Ft(e);if(s.length===1&&Re(s[0].categoryMatches)){const a=s[0].tokenTypeIdx;return function(){return this.LA(1).tokenTypeIdx===a}}else{const a=mt(s,(o,l,u)=>(o[l.tokenTypeIdx]=!0,Q(l.categoryMatches,c=>{o[c]=!0}),o),[]);return function(){return a[this.LA(1).tokenTypeIdx]===!0}}}else return function(){e:for(let s=0;s<i;s++){const a=e[s],o=a.length;for(let l=0;l<o;l++)if(t(this.LA(l+1),a[l])===!1)continue e;return!0}return!1}}var e0=class extends El{constructor(e,t,r){super(),this.topProd=e,this.targetOccurrence=t,this.targetProdType=r}startWalking(){return this.walk(this.topProd),this.restDef}checkIsTarget(e,t,r,n){return e.idx===this.targetOccurrence&&this.targetProdType===t?(this.restDef=r.concat(n),!0):!1}walkOption(e,t,r){this.checkIsTarget(e,Pe.OPTION,t,r)||super.walkOption(e,t,r)}walkAtLeastOne(e,t,r){this.checkIsTarget(e,Pe.REPETITION_MANDATORY,t,r)||super.walkOption(e,t,r)}walkAtLeastOneSep(e,t,r){this.checkIsTarget(e,Pe.REPETITION_MANDATORY_WITH_SEPARATOR,t,r)||super.walkOption(e,t,r)}walkMany(e,t,r){this.checkIsTarget(e,Pe.REPETITION,t,r)||super.walkOption(e,t,r)}walkManySep(e,t,r){this.checkIsTarget(e,Pe.REPETITION_WITH_SEPARATOR,t,r)||super.walkOption(e,t,r)}},Wm=class extends Xn{constructor(e,t,r){super(),this.targetOccurrence=e,this.targetProdType=t,this.targetRef=r,this.result=[]}checkIsTarget(e,t){e.idx===this.targetOccurrence&&this.targetProdType===t&&(this.targetRef===void 0||e===this.targetRef)&&(this.result=e.definition)}visitOption(e){this.checkIsTarget(e,Pe.OPTION)}visitRepetition(e){this.checkIsTarget(e,Pe.REPETITION)}visitRepetitionMandatory(e){this.checkIsTarget(e,Pe.REPETITION_MANDATORY)}visitRepetitionMandatoryWithSeparator(e){this.checkIsTarget(e,Pe.REPETITION_MANDATORY_WITH_SEPARATOR)}visitRepetitionWithSeparator(e){this.checkIsTarget(e,Pe.REPETITION_WITH_SEPARATOR)}visitAlternation(e){this.checkIsTarget(e,Pe.ALTERNATION)}};function Lh(e){const t=new Array(e);for(let r=0;r<e;r++)t[r]=[];return t}function au(e){let t=[""];for(let r=0;r<e.length;r++){const n=e[r],i=[];for(let s=0;s<t.length;s++){const a=t[s];i.push(a+"_"+n.tokenTypeIdx);for(let o=0;o<n.categoryMatches.length;o++){const l="_"+n.categoryMatches[o];i.push(a+l)}}t=i}return t}function t0(e,t,r){for(let n=0;n<e.length;n++){if(n===r)continue;const i=e[n];for(let s=0;s<t.length;s++)if(i[t[s]]===!0)return!1}return!0}function Bm(e,t){const r=K(e,a=>ju([a],1)),n=Lh(r.length),i=K(r,a=>{const o={};return Q(a,l=>{Q(au(l.partialPath),u=>{o[u]=!0})}),o});let s=r;for(let a=1;a<=t;a++){const o=s;s=Lh(o.length);for(let l=0;l<o.length;l++){const u=o[l];for(let c=0;c<u.length;c++){const d=u[c].partialPath,f=u[c].suffixDef,h=au(d);if(t0(i,h,l)||Re(f)||d.length===t){const m=n[l];if(Uu(m,d)===!1){m.push(d);for(let R=0;R<h.length;R++){const S=h[R];i[l][S]=!0}}}else{const m=ju(f,a+1,d);s[l]=s[l].concat(m),Q(m,R=>{Q(au(R.partialPath),S=>{i[l][S]=!0})})}}}}return n}function Nl(e,t,r,n){const i=new Wm(e,Pe.ALTERNATION,n);return t.accept(i),Bm(i.result,r)}function Pl(e,t,r,n){const i=new Wm(e,r);t.accept(i);const s=i.result,a=new e0(t,e,r).startWalking();return Bm([new _t({definition:s}),new _t({definition:a})],n)}function Uu(e,t){e:for(let r=0;r<e.length;r++){const n=e[r];if(n.length===t.length){for(let i=0;i<n.length;i++){const s=t[i],a=n[i];if(!(s===a||a.categoryMatchesMap[s.tokenTypeIdx]!==void 0))continue e}return!0}}return!1}function r0(e,t){return e.length<t.length&&Gt(e,(r,n)=>{const i=t[n];return r===i||i.categoryMatchesMap[r.tokenTypeIdx]})}function Hm(e){return Gt(e,t=>Gt(t,r=>Gt(r,n=>Re(n.categoryMatches))))}function n0(e){return K(e.lookaheadStrategy.validate({rules:e.rules,tokenTypes:e.tokenTypes,grammarName:e.grammarName}),t=>Object.assign({type:yt.CUSTOM_LOOKAHEAD_VALIDATION},t))}function i0(e,t,r,n){const i=At(e,l=>s0(l,r)),s=y0(e,t,r),a=At(e,l=>h0(l,r)),o=At(e,l=>l0(l,e,n,r));return i.concat(s,a,o)}function s0(e,t){const r=new o0;e.accept(r);const n=r.allProductions;return K(Je(Qt($_(n,a0),i=>i.length>1)),i=>{const s=Vt(i),a=t.buildDuplicateFoundError(e,i),o=nr(s),l={message:a,type:yt.DUPLICATE_PRODUCTIONS,ruleName:e.name,dslName:o,occurrence:s.idx},u=Km(s);return u&&(l.parameter=u),l})}function a0(e){return`${nr(e)}_#_${e.idx}_#_${Km(e)}`}function Km(e){return e instanceof be?e.terminalType.name:e instanceof gt?e.nonTerminalName:""}var o0=class extends Xn{constructor(){super(...arguments),this.allProductions=[]}visitNonTerminal(e){this.allProductions.push(e)}visitOption(e){this.allProductions.push(e)}visitRepetitionWithSeparator(e){this.allProductions.push(e)}visitRepetitionMandatory(e){this.allProductions.push(e)}visitRepetitionMandatoryWithSeparator(e){this.allProductions.push(e)}visitRepetition(e){this.allProductions.push(e)}visitAlternation(e){this.allProductions.push(e)}visitTerminal(e){this.allProductions.push(e)}};function l0(e,t,r,n){const i=[];if(mt(t,(s,a)=>a.name===e.name?s+1:s,0)>1){const s=n.buildDuplicateRuleNameError({topLevelRule:e,grammarName:r});i.push({message:s,type:yt.DUPLICATE_RULE_NAME,ruleName:e.name})}return i}function u0(e,t,r){const n=[];let i;return vt(t,e)||(i=`Invalid rule override, rule: ->${e}<- cannot be overridden in the grammar: ->${r}<-as it is not defined in any of the super grammars `,n.push({message:i,type:yt.INVALID_RULE_OVERRIDE,ruleName:e})),n}function Gm(e,t,r,n=[]){const i=[],s=Za(t.definition);if(Re(s))return[];{const a=e.name;vt(s,e)&&i.push({message:r.buildLeftRecursionError({topLevelRule:e,leftRecursionPath:n}),type:yt.LEFT_RECURSION,ruleName:a});const o=At(wl(s,n.concat([e])),l=>{const u=lt(n);return u.push(l),Gm(e,l,r,u)});return i.concat(o)}}function Za(e){let t=[];if(Re(e))return t;const r=Vt(e);if(r instanceof gt)t.push(r.referencedRule);else if(r instanceof _t||r instanceof ot||r instanceof Ot||r instanceof Lt||r instanceof St||r instanceof Fe)t=t.concat(Za(r.definition));else if(r instanceof bt)t=Ft(K(r.definition,s=>Za(s.definition)));else if(!(r instanceof be))throw Error("non exhaustive match");const n=Ho(r),i=e.length>1;if(n&&i){const s=st(e);return t.concat(Za(s))}else return t}var Hd=class extends Xn{constructor(){super(...arguments),this.alternations=[]}visitAlternation(e){this.alternations.push(e)}};function c0(e,t){const r=new Hd;e.accept(r);const n=r.alternations;return At(n,i=>At(Fs(i.definition),(s,a)=>Re(Um([s],[],ia,1))?[{message:t.buildEmptyAlternationError({topLevelRule:e,alternation:i,emptyChoiceIdx:a}),type:yt.NONE_LAST_EMPTY_ALT,ruleName:e.name,occurrence:i.idx,alternative:a+1}]:[]))}function d0(e,t,r){const n=new Hd;e.accept(n);let i=n.alternations;return i=Cl(i,s=>s.ignoreAmbiguities===!0),At(i,s=>{const a=s.idx,o=Nl(a,e,s.maxLookahead||t,s),l=m0(o,s,e,r),u=g0(o,s,e,r);return l.concat(u)})}var f0=class extends Xn{constructor(){super(...arguments),this.allProductions=[]}visitRepetitionWithSeparator(e){this.allProductions.push(e)}visitRepetitionMandatory(e){this.allProductions.push(e)}visitRepetitionMandatoryWithSeparator(e){this.allProductions.push(e)}visitRepetition(e){this.allProductions.push(e)}};function h0(e,t){const r=new Hd;e.accept(r);const n=r.alternations;return At(n,i=>i.definition.length>255?[{message:t.buildTooManyAlternativesError({topLevelRule:e,alternation:i}),type:yt.TOO_MANY_ALTS,ruleName:e.name,occurrence:i.idx}]:[])}function p0(e,t,r){const n=[];return Q(e,i=>{const s=new f0;i.accept(s);const a=s.allProductions;Q(a,o=>{const l=Bd(o),u=o.maxLookahead||t,c=o.idx,d=Pl(c,i,l,u)[0];if(Re(Ft(d))){const f=r.buildEmptyRepetitionError({topLevelRule:i,repetition:o});n.push({message:f,type:yt.NO_NON_EMPTY_LOOKAHEAD,ruleName:i.name})}})}),n}function m0(e,t,r,n){const i=[];return K(mt(e,(s,a,o)=>(t.definition[o].ignoreAmbiguities===!0||Q(a,l=>{const u=[o];Q(e,(c,d)=>{o!==d&&Uu(c,l)&&t.definition[d].ignoreAmbiguities!==!0&&u.push(d)}),u.length>1&&!Uu(i,l)&&(i.push(l),s.push({alts:u,path:l}))}),s),[]),s=>{const a=K(s.alts,o=>o+1);return{message:n.buildAlternationAmbiguityError({topLevelRule:r,alternation:t,ambiguityIndices:a,prefixPath:s.path}),type:yt.AMBIGUOUS_ALTS,ruleName:r.name,occurrence:t.idx,alternatives:s.alts}})}function g0(e,t,r,n){const i=mt(e,(s,a,o)=>{const l=K(a,u=>({idx:o,path:u}));return s.concat(l)},[]);return Qs(At(i,s=>{if(t.definition[s.idx].ignoreAmbiguities===!0)return[];const a=s.idx,o=s.path;return K(Dt(i,l=>t.definition[l.idx].ignoreAmbiguities!==!0&&l.idx<a&&r0(l.path,o)),l=>{const u=[l.idx+1,a+1],c=t.idx===0?"":t.idx;return{message:n.buildAlternationPrefixAmbiguityError({topLevelRule:r,alternation:t,ambiguityIndices:u,prefixPath:l.path}),type:yt.AMBIGUOUS_PREFIX_ALTS,ruleName:r.name,occurrence:c,alternatives:u}})}))}function y0(e,t,r){const n=[],i=K(t,s=>s.name);return Q(e,s=>{const a=s.name;if(vt(i,a)){const o=r.buildNamespaceConflictError(s);n.push({message:o,type:yt.CONFLICT_TOKENS_RULES_NAMESPACE,ruleName:a})}}),n}function v0(e){const t=Ld(e,{errMsgProvider:Wb}),r={};return Q(e.rules,n=>{r[n.name]=n}),Bb(r,t.errMsgProvider)}function T0(e){return e=Ld(e,{errMsgProvider:tn}),i0(e.rules,e.tokenTypes,e.errMsgProvider,e.grammarName)}var zm="MismatchedTokenException",Vm="NoViableAltException",Ym="EarlyExitException",Xm="NotAllInputParsedException",Qm=[zm,Vm,Ym,Xm];Object.freeze(Qm);function zo(e){return vt(Qm,e.name)}var Dl=class extends Error{constructor(e,t){super(e),this.token=t,this.resyncedTokens=[],Object.setPrototypeOf(this,new.target.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor)}},Jm=class extends Dl{constructor(e,t,r){super(e,t),this.previousToken=r,this.name=zm}},R0=class extends Dl{constructor(e,t,r){super(e,t),this.previousToken=r,this.name=Vm}},w0=class extends Dl{constructor(e,t){super(e,t),this.name=Xm}},C0=class extends Dl{constructor(e,t,r){super(e,t),this.previousToken=r,this.name=Ym}},ou={},_0="InRuleRecoveryException",S0=class extends Error{constructor(e){super(e),this.name=_0}},b0=class{initRecoverable(e){this.firstAfterRepMap={},this.resyncFollows={},this.recoveryEnabled=J(e,"recoveryEnabled")?e.recoveryEnabled:Er.recoveryEnabled,this.recoveryEnabled&&(this.attemptInRepetitionRecovery=k0)}getTokenToInsert(e){const t=Wd(e,"",NaN,NaN,NaN,NaN,NaN,NaN);return t.isInsertedInRecovery=!0,t}canTokenTypeBeInsertedInRecovery(e){return!0}canTokenTypeBeDeletedInRecovery(e){return!0}tryInRepetitionRecovery(e,t,r,n){const i=this.findReSyncTokenType(),s=this.exportLexerState(),a=[];let o=!1;const l=this.LA(1);let u=this.LA(1);const c=()=>{const d=this.LA(0),f=new Jm(this.errorMessageProvider.buildMismatchTokenMessage({expected:n,actual:l,previous:d,ruleName:this.getCurrRuleFullName()}),l,this.LA(0));f.resyncedTokens=Fs(a),this.SAVE_ERROR(f)};for(;!o;)if(this.tokenMatcher(u,n)){c();return}else if(r.call(this)){c(),e.apply(this,t);return}else this.tokenMatcher(u,i)?o=!0:(u=this.SKIP_TOKEN(),this.addToResyncTokens(u,a));this.importLexerState(s)}shouldInRepetitionRecoveryBeTried(e,t,r){return!(r===!1||this.tokenMatcher(this.LA(1),e)||this.isBackTracking()||this.canPerformInRuleRecovery(e,this.getFollowsForInRuleRecovery(e,t)))}getFollowsForInRuleRecovery(e,t){const r=this.getCurrentGrammarPath(e,t);return this.getNextPossibleTokenTypes(r)}tryInRuleRecovery(e,t){if(this.canRecoverWithSingleTokenInsertion(e,t))return this.getTokenToInsert(e);if(this.canRecoverWithSingleTokenDeletion(e)){const r=this.SKIP_TOKEN();return this.consumeToken(),r}throw new S0("sad sad panda")}canPerformInRuleRecovery(e,t){return this.canRecoverWithSingleTokenInsertion(e,t)||this.canRecoverWithSingleTokenDeletion(e)}canRecoverWithSingleTokenInsertion(e,t){if(!this.canTokenTypeBeInsertedInRecovery(e)||Re(t))return!1;const r=this.LA(1);return qn(t,n=>this.tokenMatcher(r,n))!==void 0}canRecoverWithSingleTokenDeletion(e){return this.canTokenTypeBeDeletedInRecovery(e)?this.tokenMatcher(this.LA(2),e):!1}isInCurrentRuleReSyncSet(e){const t=this.getCurrFollowKey();return vt(this.getFollowSetFromFollowKey(t),e)}findReSyncTokenType(){const e=this.flattenFollowSet();let t=this.LA(1),r=2;for(;;){const n=qn(e,i=>jm(t,i));if(n!==void 0)return n;t=this.LA(r),r++}}getCurrFollowKey(){if(this.RULE_STACK.length===1)return ou;const e=this.getLastExplicitRuleShortName(),t=this.getLastExplicitRuleOccurrenceIndex(),r=this.getPreviousExplicitRuleShortName();return{ruleName:this.shortRuleNameToFullName(e),idxInCallingRule:t,inRule:this.shortRuleNameToFullName(r)}}buildFullFollowKeyStack(){const e=this.RULE_STACK,t=this.RULE_OCCURRENCE_STACK;return K(e,(r,n)=>n===0?ou:{ruleName:this.shortRuleNameToFullName(r),idxInCallingRule:t[n],inRule:this.shortRuleNameToFullName(e[n-1])})}flattenFollowSet(){return Ft(K(this.buildFullFollowKeyStack(),e=>this.getFollowSetFromFollowKey(e)))}getFollowSetFromFollowKey(e){if(e===ou)return[Hr];const t=e.ruleName+e.idxInCallingRule+Am+e.inRule;return this.resyncFollows[t]}addToResyncTokens(e,t){return this.tokenMatcher(e,Hr)||t.push(e),t}reSyncTo(e){const t=[];let r=this.LA(1);for(;this.tokenMatcher(r,e)===!1;)r=this.SKIP_TOKEN(),this.addToResyncTokens(r,t);return Fs(t)}attemptInRepetitionRecovery(e,t,r,n,i,s,a){}getCurrentGrammarPath(e,t){return{ruleStack:this.getHumanReadableRuleStack(),occurrenceStack:lt(this.RULE_OCCURRENCE_STACK),lastTok:e,lastTokOccurrence:t}}getHumanReadableRuleStack(){return K(this.RULE_STACK,e=>this.shortRuleNameToFullName(e))}};function k0(e,t,r,n,i,s,a){const o=this.getKeyForAutomaticLookahead(n,i);let l=this.firstAfterRepMap[o];if(l===void 0){const f=this.getCurrRuleFullName(),h=this.getGAstProductions()[f];l=new s(h,i).startWalking(),this.firstAfterRepMap[o]=l}let u=l.token,c=l.occurrence;const d=l.isEndOfRule;this.RULE_STACK.length===1&&d&&u===void 0&&(u=Hr,c=1),!(u===void 0||c===void 0)&&this.shouldInRepetitionRecoveryBeTried(u,c,a)&&this.tryInRepetitionRecovery(e,t,r,u)}var Wu=1024,Bu=1280,eo=1536;function lu(e,t,r){return r|t|e}var Kd=class{constructor(e){var t;this.maxLookahead=(t=e?.maxLookahead)!==null&&t!==void 0?t:Er.maxLookahead}validate(e){const t=this.validateNoLeftRecursion(e.rules);if(Re(t)){const r=this.validateEmptyOrAlternatives(e.rules),n=this.validateAmbiguousAlternationAlternatives(e.rules,this.maxLookahead),i=this.validateSomeNonEmptyLookaheadPath(e.rules,this.maxLookahead);return[...t,...r,...n,...i]}return t}validateNoLeftRecursion(e){return At(e,t=>Gm(t,t,tn))}validateEmptyOrAlternatives(e){return At(e,t=>c0(t,tn))}validateAmbiguousAlternationAlternatives(e,t){return At(e,r=>d0(r,t,tn))}validateSomeNonEmptyLookaheadPath(e,t){return p0(e,t,tn)}buildLookaheadForAlternation(e){return Xb(e.prodOccurrence,e.rule,e.maxLookahead,e.hasPredicates,e.dynamicTokensEnabled,Jb)}buildLookaheadForOptional(e){return Qb(e.prodOccurrence,e.rule,e.maxLookahead,e.dynamicTokensEnabled,Bd(e.prodType),Zb)}},$0=class{initLooksAhead(e){this.dynamicTokensEnabled=J(e,"dynamicTokensEnabled")?e.dynamicTokensEnabled:Er.dynamicTokensEnabled,this.maxLookahead=J(e,"maxLookahead")?e.maxLookahead:Er.maxLookahead,this.lookaheadStrategy=J(e,"lookaheadStrategy")?e.lookaheadStrategy:new Kd({maxLookahead:this.maxLookahead}),this.lookAheadFuncsCache=new Map}preComputeLookaheadFunctions(e){Q(e,t=>{this.TRACE_INIT(`${t.name} Rule Lookahead`,()=>{const{alternation:r,repetition:n,option:i,repetitionMandatory:s,repetitionMandatoryWithSeparator:a,repetitionWithSeparator:o}=A0(t);Q(r,l=>{const u=l.idx===0?"":l.idx;this.TRACE_INIT(`${nr(l)}${u}`,()=>{const c=this.lookaheadStrategy.buildLookaheadForAlternation({prodOccurrence:l.idx,rule:t,maxLookahead:l.maxLookahead||this.maxLookahead,hasPredicates:l.hasPredicates,dynamicTokensEnabled:this.dynamicTokensEnabled}),d=lu(this.fullRuleNameToShort[t.name],256,l.idx);this.setLaFuncCache(d,c)})}),Q(n,l=>{this.computeLookaheadFunc(t,l.idx,768,"Repetition",l.maxLookahead,nr(l))}),Q(i,l=>{this.computeLookaheadFunc(t,l.idx,512,"Option",l.maxLookahead,nr(l))}),Q(s,l=>{this.computeLookaheadFunc(t,l.idx,Wu,"RepetitionMandatory",l.maxLookahead,nr(l))}),Q(a,l=>{this.computeLookaheadFunc(t,l.idx,eo,"RepetitionMandatoryWithSeparator",l.maxLookahead,nr(l))}),Q(o,l=>{this.computeLookaheadFunc(t,l.idx,Bu,"RepetitionWithSeparator",l.maxLookahead,nr(l))})})})}computeLookaheadFunc(e,t,r,n,i,s){this.TRACE_INIT(`${s}${t===0?"":t}`,()=>{const a=this.lookaheadStrategy.buildLookaheadForOptional({prodOccurrence:t,rule:e,maxLookahead:i||this.maxLookahead,dynamicTokensEnabled:this.dynamicTokensEnabled,prodType:n}),o=lu(this.fullRuleNameToShort[e.name],r,t);this.setLaFuncCache(o,a)})}getKeyForAutomaticLookahead(e,t){return lu(this.getLastExplicitRuleShortName(),e,t)}getLaFuncFromCache(e){return this.lookAheadFuncsCache.get(e)}setLaFuncCache(e,t){this.lookAheadFuncsCache.set(e,t)}},E0=class extends Xn{constructor(){super(...arguments),this.dslMethods={option:[],alternation:[],repetition:[],repetitionWithSeparator:[],repetitionMandatory:[],repetitionMandatoryWithSeparator:[]}}reset(){this.dslMethods={option:[],alternation:[],repetition:[],repetitionWithSeparator:[],repetitionMandatory:[],repetitionMandatoryWithSeparator:[]}}visitOption(e){this.dslMethods.option.push(e)}visitRepetitionWithSeparator(e){this.dslMethods.repetitionWithSeparator.push(e)}visitRepetitionMandatory(e){this.dslMethods.repetitionMandatory.push(e)}visitRepetitionMandatoryWithSeparator(e){this.dslMethods.repetitionMandatoryWithSeparator.push(e)}visitRepetition(e){this.dslMethods.repetition.push(e)}visitAlternation(e){this.dslMethods.alternation.push(e)}},xa=new E0;function A0(e){xa.reset(),e.accept(xa);const t=xa.dslMethods;return xa.reset(),t}function Mh(e,t){isNaN(e.startOffset)===!0?(e.startOffset=t.startOffset,e.endOffset=t.endOffset):e.endOffset<t.endOffset&&(e.endOffset=t.endOffset)}function Fh(e,t){isNaN(e.startOffset)===!0?(e.startOffset=t.startOffset,e.startColumn=t.startColumn,e.startLine=t.startLine,e.endOffset=t.endOffset,e.endColumn=t.endColumn,e.endLine=t.endLine):e.endOffset<t.endOffset&&(e.endOffset=t.endOffset,e.endColumn=t.endColumn,e.endLine=t.endLine)}function I0(e,t,r){e.children[r]===void 0?e.children[r]=[t]:e.children[r].push(t)}function N0(e,t,r){e.children[t]===void 0?e.children[t]=[r]:e.children[t].push(r)}var P0="name";function Zm(e,t){Object.defineProperty(e,P0,{enumerable:!1,configurable:!0,writable:!1,value:t})}function D0(e,t){const r=Nt(e),n=r.length;for(let i=0;i<n;i++){const s=e[r[i]],a=s.length;for(let o=0;o<a;o++){const l=s[o];l.tokenTypeIdx===void 0&&this[l.name](l.children,t)}}}function O0(e,t){const r=function(){};return Zm(r,e+"BaseSemantics"),r.prototype={visit:function(n,i){if(ce(n)&&(n=n[0]),!kr(n))return this[n.name](n.children,i)},validateVisitor:function(){const n=M0(this,t);if(!Re(n)){const i=K(n,s=>s.msg);throw Error(`Errors Detected in CST Visitor <${this.constructor.name}>:
	${i.join(`

`).replace(/\n/g,`
	`)}`)}}},r.prototype.constructor=r,r._RULE_NAMES=t,r}function L0(e,t,r){const n=function(){};Zm(n,e+"BaseSemanticsWithDefaults");const i=Object.create(r.prototype);return Q(t,s=>{i[s]=D0}),n.prototype=i,n.prototype.constructor=n,n}var Hu;(function(e){e[e.REDUNDANT_METHOD=0]="REDUNDANT_METHOD",e[e.MISSING_METHOD=1]="MISSING_METHOD"})(Hu||(Hu={}));function M0(e,t){return F0(e,t)}function F0(e,t){return Qs(K(Dt(t,r=>Ar(e[r])===!1),r=>({msg:`Missing visitor method: <${r}> on ${e.constructor.name} CST Visitor.`,type:Hu.MISSING_METHOD,methodName:r})))}var x0=class{initTreeBuilder(e){if(this.CST_STACK=[],this.outputCst=e.outputCst,this.nodeLocationTracking=J(e,"nodeLocationTracking")?e.nodeLocationTracking:Er.nodeLocationTracking,!this.outputCst)this.cstInvocationStateUpdate=Qe,this.cstFinallyStateUpdate=Qe,this.cstPostTerminal=Qe,this.cstPostNonTerminal=Qe,this.cstPostRule=Qe;else if(/full/i.test(this.nodeLocationTracking))this.recoveryEnabled?(this.setNodeLocationFromToken=Fh,this.setNodeLocationFromNode=Fh,this.cstPostRule=Qe,this.setInitialNodeLocation=this.setInitialNodeLocationFullRecovery):(this.setNodeLocationFromToken=Qe,this.setNodeLocationFromNode=Qe,this.cstPostRule=this.cstPostRuleFull,this.setInitialNodeLocation=this.setInitialNodeLocationFullRegular);else if(/onlyOffset/i.test(this.nodeLocationTracking))this.recoveryEnabled?(this.setNodeLocationFromToken=Mh,this.setNodeLocationFromNode=Mh,this.cstPostRule=Qe,this.setInitialNodeLocation=this.setInitialNodeLocationOnlyOffsetRecovery):(this.setNodeLocationFromToken=Qe,this.setNodeLocationFromNode=Qe,this.cstPostRule=this.cstPostRuleOnlyOffset,this.setInitialNodeLocation=this.setInitialNodeLocationOnlyOffsetRegular);else if(/none/i.test(this.nodeLocationTracking))this.setNodeLocationFromToken=Qe,this.setNodeLocationFromNode=Qe,this.cstPostRule=Qe,this.setInitialNodeLocation=Qe;else throw Error(`Invalid <nodeLocationTracking> config option: "${e.nodeLocationTracking}"`)}setInitialNodeLocationOnlyOffsetRecovery(e){e.location={startOffset:NaN,endOffset:NaN}}setInitialNodeLocationOnlyOffsetRegular(e){e.location={startOffset:this.LA(1).startOffset,endOffset:NaN}}setInitialNodeLocationFullRecovery(e){e.location={startOffset:NaN,startLine:NaN,startColumn:NaN,endOffset:NaN,endLine:NaN,endColumn:NaN}}setInitialNodeLocationFullRegular(e){const t=this.LA(1);e.location={startOffset:t.startOffset,startLine:t.startLine,startColumn:t.startColumn,endOffset:NaN,endLine:NaN,endColumn:NaN}}cstInvocationStateUpdate(e){const t={name:e,children:Object.create(null)};this.setInitialNodeLocation(t),this.CST_STACK.push(t)}cstFinallyStateUpdate(){this.CST_STACK.pop()}cstPostRuleFull(e){const t=this.LA(0),r=e.location;r.startOffset<=t.startOffset?(r.endOffset=t.endOffset,r.endLine=t.endLine,r.endColumn=t.endColumn):(r.startOffset=NaN,r.startLine=NaN,r.startColumn=NaN)}cstPostRuleOnlyOffset(e){const t=this.LA(0),r=e.location;r.startOffset<=t.startOffset?r.endOffset=t.endOffset:r.startOffset=NaN}cstPostTerminal(e,t){const r=this.CST_STACK[this.CST_STACK.length-1];I0(r,t,e),this.setNodeLocationFromToken(r.location,t)}cstPostNonTerminal(e,t){const r=this.CST_STACK[this.CST_STACK.length-1];N0(r,t,e),this.setNodeLocationFromNode(r.location,e.location)}getBaseCstVisitorConstructor(){if(kr(this.baseCstVisitorConstructor)){const e=O0(this.className,Nt(this.gastProductionsCache));return this.baseCstVisitorConstructor=e,e}return this.baseCstVisitorConstructor}getBaseCstVisitorConstructorWithDefaults(){if(kr(this.baseCstVisitorWithDefaultsConstructor)){const e=L0(this.className,Nt(this.gastProductionsCache),this.getBaseCstVisitorConstructor());return this.baseCstVisitorWithDefaultsConstructor=e,e}return this.baseCstVisitorWithDefaultsConstructor}getLastExplicitRuleShortName(){const e=this.RULE_STACK;return e[e.length-1]}getPreviousExplicitRuleShortName(){const e=this.RULE_STACK;return e[e.length-2]}getLastExplicitRuleOccurrenceIndex(){const e=this.RULE_OCCURRENCE_STACK;return e[e.length-1]}},q0=class{initLexerAdapter(){this.tokVector=[],this.tokVectorLength=0,this.currIdx=-1}set input(e){if(this.selfAnalysisDone!==!0)throw Error("Missing <performSelfAnalysis> invocation at the end of the Parser's constructor.");this.reset(),this.tokVector=e,this.tokVectorLength=e.length}get input(){return this.tokVector}SKIP_TOKEN(){return this.currIdx<=this.tokVector.length-2?(this.consumeToken(),this.LA(1)):Yo}LA(e){const t=this.currIdx+e;return t<0||this.tokVectorLength<=t?Yo:this.tokVector[t]}consumeToken(){this.currIdx++}exportLexerState(){return this.currIdx}importLexerState(e){this.currIdx=e}resetLexerState(){this.currIdx=-1}moveToTerminatedState(){this.currIdx=this.tokVector.length-1}getLexerPosition(){return this.exportLexerState()}},j0=class{ACTION(e){return e.call(this)}consume(e,t,r){return this.consumeInternal(t,e,r)}subrule(e,t,r){return this.subruleInternal(t,e,r)}option(e,t){return this.optionInternal(t,e)}or(e,t){return this.orInternal(t,e)}many(e,t){return this.manyInternal(e,t)}atLeastOne(e,t){return this.atLeastOneInternal(e,t)}CONSUME(e,t){return this.consumeInternal(e,0,t)}CONSUME1(e,t){return this.consumeInternal(e,1,t)}CONSUME2(e,t){return this.consumeInternal(e,2,t)}CONSUME3(e,t){return this.consumeInternal(e,3,t)}CONSUME4(e,t){return this.consumeInternal(e,4,t)}CONSUME5(e,t){return this.consumeInternal(e,5,t)}CONSUME6(e,t){return this.consumeInternal(e,6,t)}CONSUME7(e,t){return this.consumeInternal(e,7,t)}CONSUME8(e,t){return this.consumeInternal(e,8,t)}CONSUME9(e,t){return this.consumeInternal(e,9,t)}SUBRULE(e,t){return this.subruleInternal(e,0,t)}SUBRULE1(e,t){return this.subruleInternal(e,1,t)}SUBRULE2(e,t){return this.subruleInternal(e,2,t)}SUBRULE3(e,t){return this.subruleInternal(e,3,t)}SUBRULE4(e,t){return this.subruleInternal(e,4,t)}SUBRULE5(e,t){return this.subruleInternal(e,5,t)}SUBRULE6(e,t){return this.subruleInternal(e,6,t)}SUBRULE7(e,t){return this.subruleInternal(e,7,t)}SUBRULE8(e,t){return this.subruleInternal(e,8,t)}SUBRULE9(e,t){return this.subruleInternal(e,9,t)}OPTION(e){return this.optionInternal(e,0)}OPTION1(e){return this.optionInternal(e,1)}OPTION2(e){return this.optionInternal(e,2)}OPTION3(e){return this.optionInternal(e,3)}OPTION4(e){return this.optionInternal(e,4)}OPTION5(e){return this.optionInternal(e,5)}OPTION6(e){return this.optionInternal(e,6)}OPTION7(e){return this.optionInternal(e,7)}OPTION8(e){return this.optionInternal(e,8)}OPTION9(e){return this.optionInternal(e,9)}OR(e){return this.orInternal(e,0)}OR1(e){return this.orInternal(e,1)}OR2(e){return this.orInternal(e,2)}OR3(e){return this.orInternal(e,3)}OR4(e){return this.orInternal(e,4)}OR5(e){return this.orInternal(e,5)}OR6(e){return this.orInternal(e,6)}OR7(e){return this.orInternal(e,7)}OR8(e){return this.orInternal(e,8)}OR9(e){return this.orInternal(e,9)}MANY(e){this.manyInternal(0,e)}MANY1(e){this.manyInternal(1,e)}MANY2(e){this.manyInternal(2,e)}MANY3(e){this.manyInternal(3,e)}MANY4(e){this.manyInternal(4,e)}MANY5(e){this.manyInternal(5,e)}MANY6(e){this.manyInternal(6,e)}MANY7(e){this.manyInternal(7,e)}MANY8(e){this.manyInternal(8,e)}MANY9(e){this.manyInternal(9,e)}MANY_SEP(e){this.manySepFirstInternal(0,e)}MANY_SEP1(e){this.manySepFirstInternal(1,e)}MANY_SEP2(e){this.manySepFirstInternal(2,e)}MANY_SEP3(e){this.manySepFirstInternal(3,e)}MANY_SEP4(e){this.manySepFirstInternal(4,e)}MANY_SEP5(e){this.manySepFirstInternal(5,e)}MANY_SEP6(e){this.manySepFirstInternal(6,e)}MANY_SEP7(e){this.manySepFirstInternal(7,e)}MANY_SEP8(e){this.manySepFirstInternal(8,e)}MANY_SEP9(e){this.manySepFirstInternal(9,e)}AT_LEAST_ONE(e){this.atLeastOneInternal(0,e)}AT_LEAST_ONE1(e){return this.atLeastOneInternal(1,e)}AT_LEAST_ONE2(e){this.atLeastOneInternal(2,e)}AT_LEAST_ONE3(e){this.atLeastOneInternal(3,e)}AT_LEAST_ONE4(e){this.atLeastOneInternal(4,e)}AT_LEAST_ONE5(e){this.atLeastOneInternal(5,e)}AT_LEAST_ONE6(e){this.atLeastOneInternal(6,e)}AT_LEAST_ONE7(e){this.atLeastOneInternal(7,e)}AT_LEAST_ONE8(e){this.atLeastOneInternal(8,e)}AT_LEAST_ONE9(e){this.atLeastOneInternal(9,e)}AT_LEAST_ONE_SEP(e){this.atLeastOneSepFirstInternal(0,e)}AT_LEAST_ONE_SEP1(e){this.atLeastOneSepFirstInternal(1,e)}AT_LEAST_ONE_SEP2(e){this.atLeastOneSepFirstInternal(2,e)}AT_LEAST_ONE_SEP3(e){this.atLeastOneSepFirstInternal(3,e)}AT_LEAST_ONE_SEP4(e){this.atLeastOneSepFirstInternal(4,e)}AT_LEAST_ONE_SEP5(e){this.atLeastOneSepFirstInternal(5,e)}AT_LEAST_ONE_SEP6(e){this.atLeastOneSepFirstInternal(6,e)}AT_LEAST_ONE_SEP7(e){this.atLeastOneSepFirstInternal(7,e)}AT_LEAST_ONE_SEP8(e){this.atLeastOneSepFirstInternal(8,e)}AT_LEAST_ONE_SEP9(e){this.atLeastOneSepFirstInternal(9,e)}RULE(e,t,r=Xo){if(vt(this.definedRulesNames,e)){const i={message:tn.buildDuplicateRuleNameError({topLevelRule:e,grammarName:this.className}),type:yt.DUPLICATE_RULE_NAME,ruleName:e};this.definitionErrors.push(i)}this.definedRulesNames.push(e);const n=this.defineRule(e,t,r);return this[e]=n,n}OVERRIDE_RULE(e,t,r=Xo){const n=u0(e,this.definedRulesNames,this.className);this.definitionErrors=this.definitionErrors.concat(n);const i=this.defineRule(e,t,r);return this[e]=i,i}BACKTRACK(e,t){return function(){this.isBackTrackingStack.push(1);const r=this.saveRecogState();try{return e.apply(this,t),!0}catch(n){if(zo(n))return!1;throw n}finally{this.reloadRecogState(r),this.isBackTrackingStack.pop()}}}getGAstProductions(){return this.gastProductionsCache}getSerializedGastProductions(){return VS(Je(this.gastProductionsCache))}},U0=class{initRecognizerEngine(e,t){if(this.className=this.constructor.name,this.shortRuleNameToFull={},this.fullRuleNameToShort={},this.ruleShortNameIdx=256,this.tokenMatcher=Go,this.subruleIdx=0,this.definedRulesNames=[],this.tokensMap={},this.isBackTrackingStack=[],this.RULE_STACK=[],this.RULE_OCCURRENCE_STACK=[],this.gastProductionsCache={},J(t,"serializedGrammar"))throw Error(`The Parser's configuration can no longer contain a <serializedGrammar> property.
	See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_6-0-0
	For Further details.`);if(ce(e)){if(Re(e))throw Error(`A Token Vocabulary cannot be empty.
	Note that the first argument for the parser constructor
	is no longer a Token vector (since v4.0).`);if(typeof e[0].startOffset=="number")throw Error(`The Parser constructor no longer accepts a token vector as the first argument.
	See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_4-0-0
	For Further details.`)}if(ce(e))this.tokensMap=mt(e,(r,n)=>(r[n.name]=n,r),{});else if(J(e,"modes")&&Gt(Ft(Je(e.modes)),qb))this.tokensMap=mt(Md(Ft(Je(e.modes))),(r,n)=>(r[n.name]=n,r),{});else if(jt(e))this.tokensMap=lt(e);else throw new Error("<tokensDictionary> argument must be An Array of Token constructors, A dictionary of Token constructors or an IMultiModeLexerDefinition");this.tokensMap.EOF=Hr,this.tokenMatcher=Gt(J(e,"modes")?Ft(Je(e.modes)):Je(e),r=>Re(r.categoryMatches))?Go:ia,sa(Je(this.tokensMap))}defineRule(e,t,r){if(this.selfAnalysisDone)throw Error(`Grammar rule <${e}> may not be defined after the 'performSelfAnalysis' method has been called'
Make sure that all grammar rule definitions are done before 'performSelfAnalysis' is called.`);const n=J(r,"resyncEnabled")?r.resyncEnabled:Xo.resyncEnabled,i=J(r,"recoveryValueFunc")?r.recoveryValueFunc:Xo.recoveryValueFunc,s=this.ruleShortNameIdx<<12;this.ruleShortNameIdx++,this.shortRuleNameToFull[s]=e,this.fullRuleNameToShort[e]=s;let a;return this.outputCst===!0?a=function(...l){try{this.ruleInvocationStateUpdate(s,e,this.subruleIdx),t.apply(this,l);const u=this.CST_STACK[this.CST_STACK.length-1];return this.cstPostRule(u),u}catch(u){return this.invokeRuleCatch(u,n,i)}finally{this.ruleFinallyStateUpdate()}}:a=function(...l){try{return this.ruleInvocationStateUpdate(s,e,this.subruleIdx),t.apply(this,l)}catch(u){return this.invokeRuleCatch(u,n,i)}finally{this.ruleFinallyStateUpdate()}},Object.assign(a,{ruleName:e,originalGrammarAction:t})}invokeRuleCatch(e,t,r){const n=this.RULE_STACK.length===1,i=t&&!this.isBackTracking()&&this.recoveryEnabled;if(zo(e)){const s=e;if(i){const a=this.findReSyncTokenType();if(this.isInCurrentRuleReSyncSet(a))if(s.resyncedTokens=this.reSyncTo(a),this.outputCst){const o=this.CST_STACK[this.CST_STACK.length-1];return o.recoveredNode=!0,o}else return r(e);else{if(this.outputCst){const o=this.CST_STACK[this.CST_STACK.length-1];o.recoveredNode=!0,s.partialCstResult=o}throw s}}else{if(n)return this.moveToTerminatedState(),r(e);throw s}}else throw e}optionInternal(e,t){const r=this.getKeyForAutomaticLookahead(512,t);return this.optionInternalLogic(e,t,r)}optionInternalLogic(e,t,r){let n=this.getLaFuncFromCache(r),i;if(typeof e!="function"){i=e.DEF;const s=e.GATE;if(s!==void 0){const a=n;n=()=>s.call(this)&&a.call(this)}}else i=e;if(n.call(this)===!0)return i.call(this)}atLeastOneInternal(e,t){const r=this.getKeyForAutomaticLookahead(Wu,e);return this.atLeastOneInternalLogic(e,t,r)}atLeastOneInternalLogic(e,t,r){let n=this.getLaFuncFromCache(r),i;if(typeof t!="function"){i=t.DEF;const s=t.GATE;if(s!==void 0){const a=n;n=()=>s.call(this)&&a.call(this)}}else i=t;if(n.call(this)===!0){let s=this.doSingleRepetition(i);for(;n.call(this)===!0&&s===!0;)s=this.doSingleRepetition(i)}else throw this.raiseEarlyExitException(e,Pe.REPETITION_MANDATORY,t.ERR_MSG);this.attemptInRepetitionRecovery(this.atLeastOneInternal,[e,t],n,Wu,e,Vb)}atLeastOneSepFirstInternal(e,t){const r=this.getKeyForAutomaticLookahead(eo,e);this.atLeastOneSepFirstInternalLogic(e,t,r)}atLeastOneSepFirstInternalLogic(e,t,r){const n=t.DEF,i=t.SEP;if(this.getLaFuncFromCache(r).call(this)===!0){n.call(this);const s=()=>this.tokenMatcher(this.LA(1),i);for(;this.tokenMatcher(this.LA(1),i)===!0;)this.CONSUME(i),n.call(this);this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal,[e,i,s,n,Dh],s,eo,e,Dh)}else throw this.raiseEarlyExitException(e,Pe.REPETITION_MANDATORY_WITH_SEPARATOR,t.ERR_MSG)}manyInternal(e,t){const r=this.getKeyForAutomaticLookahead(768,e);return this.manyInternalLogic(e,t,r)}manyInternalLogic(e,t,r){let n=this.getLaFuncFromCache(r),i;if(typeof t!="function"){i=t.DEF;const a=t.GATE;if(a!==void 0){const o=n;n=()=>a.call(this)&&o.call(this)}}else i=t;let s=!0;for(;n.call(this)===!0&&s===!0;)s=this.doSingleRepetition(i);this.attemptInRepetitionRecovery(this.manyInternal,[e,t],n,768,e,zb,s)}manySepFirstInternal(e,t){const r=this.getKeyForAutomaticLookahead(Bu,e);this.manySepFirstInternalLogic(e,t,r)}manySepFirstInternalLogic(e,t,r){const n=t.DEF,i=t.SEP;if(this.getLaFuncFromCache(r).call(this)===!0){n.call(this);const s=()=>this.tokenMatcher(this.LA(1),i);for(;this.tokenMatcher(this.LA(1),i)===!0;)this.CONSUME(i),n.call(this);this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal,[e,i,s,n,Ph],s,Bu,e,Ph)}}repetitionSepSecondInternal(e,t,r,n,i){for(;r();)this.CONSUME(t),n.call(this);this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal,[e,t,r,n,i],r,eo,e,i)}doSingleRepetition(e){const t=this.getLexerPosition();return e.call(this),this.getLexerPosition()>t}orInternal(e,t){const r=this.getKeyForAutomaticLookahead(256,t),n=ce(e)?e:e.DEF,i=this.getLaFuncFromCache(r).call(this,n);if(i!==void 0)return n[i].ALT.call(this);this.raiseNoAltException(t,e.ERR_MSG)}ruleFinallyStateUpdate(){if(this.RULE_STACK.pop(),this.RULE_OCCURRENCE_STACK.pop(),this.cstFinallyStateUpdate(),this.RULE_STACK.length===0&&this.isAtEndOfInput()===!1){const e=this.LA(1),t=this.errorMessageProvider.buildNotAllInputParsedMessage({firstRedundant:e,ruleName:this.getCurrRuleFullName()});this.SAVE_ERROR(new w0(t,e))}}subruleInternal(e,t,r){let n;try{const i=r!==void 0?r.ARGS:void 0;return this.subruleIdx=t,n=e.apply(this,i),this.cstPostNonTerminal(n,r!==void 0&&r.LABEL!==void 0?r.LABEL:e.ruleName),n}catch(i){throw this.subruleInternalError(i,r,e.ruleName)}}subruleInternalError(e,t,r){throw zo(e)&&e.partialCstResult!==void 0&&(this.cstPostNonTerminal(e.partialCstResult,t!==void 0&&t.LABEL!==void 0?t.LABEL:r),delete e.partialCstResult),e}consumeInternal(e,t,r){let n;try{const i=this.LA(1);this.tokenMatcher(i,e)===!0?(this.consumeToken(),n=i):this.consumeInternalError(e,i,r)}catch(i){n=this.consumeInternalRecovery(e,t,i)}return this.cstPostTerminal(r!==void 0&&r.LABEL!==void 0?r.LABEL:e.name,n),n}consumeInternalError(e,t,r){let n;const i=this.LA(0);throw r!==void 0&&r.ERR_MSG?n=r.ERR_MSG:n=this.errorMessageProvider.buildMismatchTokenMessage({expected:e,actual:t,previous:i,ruleName:this.getCurrRuleFullName()}),this.SAVE_ERROR(new Jm(n,t,i))}consumeInternalRecovery(e,t,r){if(this.recoveryEnabled&&r.name==="MismatchedTokenException"&&!this.isBackTracking()){const n=this.getFollowsForInRuleRecovery(e,t);try{return this.tryInRuleRecovery(e,n)}catch(i){throw i.name==="InRuleRecoveryException"?r:i}}else throw r}saveRecogState(){const e=this.errors,t=lt(this.RULE_STACK);return{errors:e,lexerState:this.exportLexerState(),RULE_STACK:t,CST_STACK:this.CST_STACK}}reloadRecogState(e){this.errors=e.errors,this.importLexerState(e.lexerState),this.RULE_STACK=e.RULE_STACK}ruleInvocationStateUpdate(e,t,r){this.RULE_OCCURRENCE_STACK.push(r),this.RULE_STACK.push(e),this.cstInvocationStateUpdate(t)}isBackTracking(){return this.isBackTrackingStack.length!==0}getCurrRuleFullName(){const e=this.getLastExplicitRuleShortName();return this.shortRuleNameToFull[e]}shortRuleNameToFullName(e){return this.shortRuleNameToFull[e]}isAtEndOfInput(){return this.tokenMatcher(this.LA(1),Hr)}reset(){this.resetLexerState(),this.subruleIdx=0,this.isBackTrackingStack=[],this.errors=[],this.RULE_STACK=[],this.CST_STACK=[],this.RULE_OCCURRENCE_STACK=[]}},W0=class{initErrorHandler(e){this._errors=[],this.errorMessageProvider=J(e,"errorMessageProvider")?e.errorMessageProvider:Er.errorMessageProvider}SAVE_ERROR(e){if(zo(e))return e.context={ruleStack:this.getHumanReadableRuleStack(),ruleOccurrenceStack:lt(this.RULE_OCCURRENCE_STACK)},this._errors.push(e),e;throw Error("Trying to save an Error which is not a RecognitionException")}get errors(){return lt(this._errors)}set errors(e){this._errors=e}raiseEarlyExitException(e,t,r){const n=this.getCurrRuleFullName(),i=this.getGAstProductions()[n],s=Pl(e,i,t,this.maxLookahead)[0],a=[];for(let l=1;l<=this.maxLookahead;l++)a.push(this.LA(l));const o=this.errorMessageProvider.buildEarlyExitMessage({expectedIterationPaths:s,actual:a,previous:this.LA(0),customUserDescription:r,ruleName:n});throw this.SAVE_ERROR(new C0(o,this.LA(1),this.LA(0)))}raiseNoAltException(e,t){const r=this.getCurrRuleFullName(),n=this.getGAstProductions()[r],i=Nl(e,n,this.maxLookahead),s=[];for(let l=1;l<=this.maxLookahead;l++)s.push(this.LA(l));const a=this.LA(0),o=this.errorMessageProvider.buildNoViableAltMessage({expectedPathsPerAlt:i,actual:s,previous:a,customUserDescription:t,ruleName:this.getCurrRuleFullName()});throw this.SAVE_ERROR(new R0(o,this.LA(1),a))}},B0=class{initContentAssist(){}computeContentAssist(e,t){const r=this.gastProductionsCache[e];if(kr(r))throw Error(`Rule ->${e}<- does not exist in this grammar.`);return Um([r],t,this.tokenMatcher,this.maxLookahead)}getNextPossibleTokenTypes(e){const t=Vt(e.ruleStack),r=this.getGAstProductions()[t];return new Gb(r,e).startWalking()}},Ol={description:"This Object indicates the Parser is during Recording Phase"};Object.freeze(Ol);var xh=!0,qh=Math.pow(2,8)-1,eg=qm({name:"RECORDING_PHASE_TOKEN",pattern:wt.NA});sa([eg]);var tg=Wd(eg,`This IToken indicates the Parser is in Recording Phase
	See: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details`,-1,-1,-1,-1,-1,-1);Object.freeze(tg);var H0={name:`This CSTNode indicates the Parser is in Recording Phase
	See: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details`,children:{}},K0=class{initGastRecorder(e){this.recordingProdStack=[],this.RECORDING_PHASE=!1}enableRecording(){this.RECORDING_PHASE=!0,this.TRACE_INIT("Enable Recording",()=>{for(let e=0;e<10;e++){const t=e>0?e:"";this[`CONSUME${t}`]=function(r,n){return this.consumeInternalRecord(r,e,n)},this[`SUBRULE${t}`]=function(r,n){return this.subruleInternalRecord(r,e,n)},this[`OPTION${t}`]=function(r){return this.optionInternalRecord(r,e)},this[`OR${t}`]=function(r){return this.orInternalRecord(r,e)},this[`MANY${t}`]=function(r){this.manyInternalRecord(e,r)},this[`MANY_SEP${t}`]=function(r){this.manySepFirstInternalRecord(e,r)},this[`AT_LEAST_ONE${t}`]=function(r){this.atLeastOneInternalRecord(e,r)},this[`AT_LEAST_ONE_SEP${t}`]=function(r){this.atLeastOneSepFirstInternalRecord(e,r)}}this.consume=function(e,t,r){return this.consumeInternalRecord(t,e,r)},this.subrule=function(e,t,r){return this.subruleInternalRecord(t,e,r)},this.option=function(e,t){return this.optionInternalRecord(t,e)},this.or=function(e,t){return this.orInternalRecord(t,e)},this.many=function(e,t){this.manyInternalRecord(e,t)},this.atLeastOne=function(e,t){this.atLeastOneInternalRecord(e,t)},this.ACTION=this.ACTION_RECORD,this.BACKTRACK=this.BACKTRACK_RECORD,this.LA=this.LA_RECORD})}disableRecording(){this.RECORDING_PHASE=!1,this.TRACE_INIT("Deleting Recording methods",()=>{const e=this;for(let t=0;t<10;t++){const r=t>0?t:"";delete e[`CONSUME${r}`],delete e[`SUBRULE${r}`],delete e[`OPTION${r}`],delete e[`OR${r}`],delete e[`MANY${r}`],delete e[`MANY_SEP${r}`],delete e[`AT_LEAST_ONE${r}`],delete e[`AT_LEAST_ONE_SEP${r}`]}delete e.consume,delete e.subrule,delete e.option,delete e.or,delete e.many,delete e.atLeastOne,delete e.ACTION,delete e.BACKTRACK,delete e.LA})}ACTION_RECORD(e){}BACKTRACK_RECORD(e,t){return()=>!0}LA_RECORD(e){return Yo}topLevelRuleRecord(e,t){try{const r=new Yn({definition:[],name:e});return r.name=e,this.recordingProdStack.push(r),t.call(this),this.recordingProdStack.pop(),r}catch(r){if(r.KNOWN_RECORDER_ERROR!==!0)try{r.message=r.message+`
	 This error was thrown during the "grammar recording phase" For more info see:
	https://chevrotain.io/docs/guide/internals.html#grammar-recording`}catch{throw r}throw r}}optionInternalRecord(e,t){return ai.call(this,ot,e,t)}atLeastOneInternalRecord(e,t){ai.call(this,Ot,t,e)}atLeastOneSepFirstInternalRecord(e,t){ai.call(this,Lt,t,e,xh)}manyInternalRecord(e,t){ai.call(this,Fe,t,e)}manySepFirstInternalRecord(e,t){ai.call(this,St,t,e,xh)}orInternalRecord(e,t){return G0.call(this,e,t)}subruleInternalRecord(e,t,r){if(Vo(t),!e||J(e,"ruleName")===!1){const a=new Error(`<SUBRULE${jh(t)}> argument is invalid expecting a Parser method reference but got: <${JSON.stringify(e)}>
 inside top level rule: <${this.recordingProdStack[0].name}>`);throw a.KNOWN_RECORDER_ERROR=!0,a}const n=xn(this.recordingProdStack),i=e.ruleName,s=new gt({idx:t,nonTerminalName:i,label:r?.LABEL,referencedRule:void 0});return n.definition.push(s),this.outputCst?H0:Ol}consumeInternalRecord(e,t,r){if(Vo(t),!Fm(e)){const s=new Error(`<CONSUME${jh(t)}> argument is invalid expecting a TokenType reference but got: <${JSON.stringify(e)}>
 inside top level rule: <${this.recordingProdStack[0].name}>`);throw s.KNOWN_RECORDER_ERROR=!0,s}const n=xn(this.recordingProdStack),i=new be({idx:t,terminalType:e,label:r?.LABEL});return n.definition.push(i),tg}};function ai(e,t,r,n=!1){Vo(r);const i=xn(this.recordingProdStack),s=Ar(t)?t:t.DEF,a=new e({definition:[],idx:r});return n&&(a.separator=t.SEP),J(t,"MAX_LOOKAHEAD")&&(a.maxLookahead=t.MAX_LOOKAHEAD),this.recordingProdStack.push(a),s.call(this),i.definition.push(a),this.recordingProdStack.pop(),Ol}function G0(e,t){Vo(t);const r=xn(this.recordingProdStack),n=ce(e)===!1,i=n===!1?e:e.DEF,s=new bt({definition:[],idx:t,ignoreAmbiguities:n&&e.IGNORE_AMBIGUITIES===!0});return J(e,"MAX_LOOKAHEAD")&&(s.maxLookahead=e.MAX_LOOKAHEAD),s.hasPredicates=Zp(i,a=>Ar(a.GATE)),r.definition.push(s),Q(i,a=>{const o=new _t({definition:[]});s.definition.push(o),J(a,"IGNORE_AMBIGUITIES")?o.ignoreAmbiguities=a.IGNORE_AMBIGUITIES:J(a,"GATE")&&(o.ignoreAmbiguities=!0),this.recordingProdStack.push(o),a.ALT.call(this),this.recordingProdStack.pop()}),Ol}function jh(e){return e===0?"":`${e}`}function Vo(e){if(e<0||e>qh){const t=new Error(`Invalid DSL Method idx value: <${e}>
	Idx value must be a none negative value smaller than ${qh+1}`);throw t.KNOWN_RECORDER_ERROR=!0,t}}var z0=class{initPerformanceTracer(e){if(J(e,"traceInitPerf")){const t=e.traceInitPerf,r=typeof t=="number";this.traceInitMaxIdent=r?t:1/0,this.traceInitPerf=r?t>0:t}else this.traceInitMaxIdent=0,this.traceInitPerf=Er.traceInitPerf;this.traceInitIndent=-1}TRACE_INIT(e,t){if(this.traceInitPerf===!0){this.traceInitIndent++;const r=new Array(this.traceInitIndent+1).join("	");this.traceInitIndent<this.traceInitMaxIdent&&console.log(`${r}--> <${e}>`);const{time:n,value:i}=$m(t),s=n>10?console.warn:console.log;return this.traceInitIndent<this.traceInitMaxIdent&&s(`${r}<-- <${e}> time: ${n}ms`),this.traceInitIndent--,i}else return t()}};function V0(e,t){t.forEach(r=>{const n=r.prototype;Object.getOwnPropertyNames(n).forEach(i=>{if(i==="constructor")return;const s=Object.getOwnPropertyDescriptor(n,i);s&&(s.get||s.set)?Object.defineProperty(e.prototype,i,s):e.prototype[i]=r.prototype[i]})})}var Yo=Wd(Hr,"",NaN,NaN,NaN,NaN,NaN,NaN);Object.freeze(Yo);var Er=Object.freeze({recoveryEnabled:!1,maxLookahead:3,dynamicTokensEnabled:!1,outputCst:!0,errorMessageProvider:Nn,nodeLocationTracking:"none",traceInitPerf:!1,skipValidations:!1}),Xo=Object.freeze({recoveryValueFunc:()=>{},resyncEnabled:!0}),yt;(function(e){e[e.INVALID_RULE_NAME=0]="INVALID_RULE_NAME",e[e.DUPLICATE_RULE_NAME=1]="DUPLICATE_RULE_NAME",e[e.INVALID_RULE_OVERRIDE=2]="INVALID_RULE_OVERRIDE",e[e.DUPLICATE_PRODUCTIONS=3]="DUPLICATE_PRODUCTIONS",e[e.UNRESOLVED_SUBRULE_REF=4]="UNRESOLVED_SUBRULE_REF",e[e.LEFT_RECURSION=5]="LEFT_RECURSION",e[e.NONE_LAST_EMPTY_ALT=6]="NONE_LAST_EMPTY_ALT",e[e.AMBIGUOUS_ALTS=7]="AMBIGUOUS_ALTS",e[e.CONFLICT_TOKENS_RULES_NAMESPACE=8]="CONFLICT_TOKENS_RULES_NAMESPACE",e[e.INVALID_TOKEN_NAME=9]="INVALID_TOKEN_NAME",e[e.NO_NON_EMPTY_LOOKAHEAD=10]="NO_NON_EMPTY_LOOKAHEAD",e[e.AMBIGUOUS_PREFIX_ALTS=11]="AMBIGUOUS_PREFIX_ALTS",e[e.TOO_MANY_ALTS=12]="TOO_MANY_ALTS",e[e.CUSTOM_LOOKAHEAD_VALIDATION=13]="CUSTOM_LOOKAHEAD_VALIDATION"})(yt||(yt={}));function Uh(e=void 0){return function(){return e}}var Gd=class rg{static performSelfAnalysis(t){throw Error("The **static** `performSelfAnalysis` method has been deprecated.	\nUse the **instance** method with the same name instead.")}performSelfAnalysis(){this.TRACE_INIT("performSelfAnalysis",()=>{let t;this.selfAnalysisDone=!0;const r=this.className;this.TRACE_INIT("toFastProps",()=>{Em(this)}),this.TRACE_INIT("Grammar Recording",()=>{try{this.enableRecording(),Q(this.definedRulesNames,i=>{const s=this[i].originalGrammarAction;let a;this.TRACE_INIT(`${i} Rule`,()=>{a=this.topLevelRuleRecord(i,s)}),this.gastProductionsCache[i]=a})}finally{this.disableRecording()}});let n=[];if(this.TRACE_INIT("Grammar Resolving",()=>{n=v0({rules:Je(this.gastProductionsCache)}),this.definitionErrors=this.definitionErrors.concat(n)}),this.TRACE_INIT("Grammar Validations",()=>{if(Re(n)&&this.skipValidations===!1){const i=T0({rules:Je(this.gastProductionsCache),tokenTypes:Je(this.tokensMap),errMsgProvider:tn,grammarName:r}),s=n0({lookaheadStrategy:this.lookaheadStrategy,rules:Je(this.gastProductionsCache),tokenTypes:Je(this.tokensMap),grammarName:r});this.definitionErrors=this.definitionErrors.concat(i,s)}}),Re(this.definitionErrors)&&(this.recoveryEnabled&&this.TRACE_INIT("computeAllProdsFollows",()=>{this.resyncFollows=tb(Je(this.gastProductionsCache))}),this.TRACE_INIT("ComputeLookaheadFunctions",()=>{var i,s;(s=(i=this.lookaheadStrategy).initialize)===null||s===void 0||s.call(i,{rules:Je(this.gastProductionsCache)}),this.preComputeLookaheadFunctions(Je(this.gastProductionsCache))})),!rg.DEFER_DEFINITION_ERRORS_HANDLING&&!Re(this.definitionErrors))throw t=K(this.definitionErrors,i=>i.message),new Error(`Parser Definition Errors detected:
 ${t.join(`
-------------------------------
`)}`)})}constructor(t,r){this.definitionErrors=[],this.selfAnalysisDone=!1;const n=this;if(n.initErrorHandler(r),n.initLexerAdapter(),n.initLooksAhead(r),n.initRecognizerEngine(t,r),n.initRecoverable(r),n.initTreeBuilder(r),n.initContentAssist(),n.initGastRecorder(r),n.initPerformanceTracer(r),J(r,"ignoredIssues"))throw new Error(`The <ignoredIssues> IParserConfig property has been deprecated.
	Please use the <IGNORE_AMBIGUITIES> flag on the relevant DSL method instead.
	See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#IGNORING_AMBIGUITIES
	For further details.`);this.skipValidations=J(r,"skipValidations")?r.skipValidations:Er.skipValidations}};Gd.DEFER_DEFINITION_ERRORS_HANDLING=!1;V0(Gd,[b0,$0,x0,q0,U0,j0,W0,B0,K0,z0]);var Y0=class extends Gd{constructor(e,t=Er){const r=lt(t);r.outputCst=!1,super(e,r)}};function jn(e,t,r){return`${e.name}_${t}_${r}`}var zd=class{constructor(e){this.target=e}isEpsilon(){return!1}},Vd=class extends zd{constructor(e,t){super(e),this.tokenType=t}},ng=class extends zd{constructor(e){super(e)}isEpsilon(){return!0}},Yd=class extends zd{constructor(e,t,r){super(e),this.rule=t,this.followState=r}isEpsilon(){return!0}};function X0(e){const t={decisionMap:{},decisionStates:[],ruleToStartState:new Map,ruleToStopState:new Map,states:[]};Q0(t,e);const r=e.length;for(let n=0;n<r;n++){const i=e[n],s=gn(t,i,i);s!==void 0&&lk(t,i,s)}return t}function Q0(e,t){const r=t.length;for(let n=0;n<r;n++){const i=t[n],s=rt(e,i,void 0,{type:2}),a=rt(e,i,void 0,{type:7});s.stop=a,e.ruleToStartState.set(i,s),e.ruleToStopState.set(i,a)}}function ig(e,t,r){return r instanceof be?Xd(e,t,r.terminalType,r):r instanceof gt?ok(e,t,r):r instanceof bt?rk(e,t,r):r instanceof ot?nk(e,t,r):r instanceof Fe?J0(e,t,r):r instanceof St?Z0(e,t,r):r instanceof Ot?ek(e,t,r):r instanceof Lt?tk(e,t,r):gn(e,t,r)}function J0(e,t,r){const n=rt(e,t,r,{type:5});return Vr(e,n),ag(e,t,r,Qn(e,t,n,r,gn(e,t,r)))}function Z0(e,t,r){const n=rt(e,t,r,{type:5});return Vr(e,n),ag(e,t,r,Qn(e,t,n,r,gn(e,t,r)),Xd(e,t,r.separator,r))}function ek(e,t,r){const n=rt(e,t,r,{type:4});return Vr(e,n),sg(e,t,r,Qn(e,t,n,r,gn(e,t,r)))}function tk(e,t,r){const n=rt(e,t,r,{type:4});return Vr(e,n),sg(e,t,r,Qn(e,t,n,r,gn(e,t,r)),Xd(e,t,r.separator,r))}function rk(e,t,r){const n=rt(e,t,r,{type:1});return Vr(e,n),Qn(e,t,n,r,...K(r.definition,i=>ig(e,t,i)))}function nk(e,t,r){const n=rt(e,t,r,{type:1});return Vr(e,n),ik(e,t,r,Qn(e,t,n,r,gn(e,t,r)))}function gn(e,t,r){const n=Dt(K(r.definition,i=>ig(e,t,i)),i=>i!==void 0);return n.length===1?n[0]:n.length===0?void 0:ak(e,n)}function sg(e,t,r,n,i){const s=n.left,a=n.right,o=rt(e,t,r,{type:11});Vr(e,o);const l=rt(e,t,r,{type:12});return s.loopback=o,l.loopback=o,e.decisionMap[jn(t,i?"RepetitionMandatoryWithSeparator":"RepetitionMandatory",r.idx)]=o,Ve(a,o),i===void 0?(Ve(o,s),Ve(o,l)):(Ve(o,l),Ve(o,i.left),Ve(i.right,s)),{left:s,right:l}}function ag(e,t,r,n,i){const s=n.left,a=n.right,o=rt(e,t,r,{type:10});Vr(e,o);const l=rt(e,t,r,{type:12}),u=rt(e,t,r,{type:9});return o.loopback=u,l.loopback=u,Ve(o,s),Ve(o,l),Ve(a,u),i!==void 0?(Ve(u,l),Ve(u,i.left),Ve(i.right,s)):Ve(u,o),e.decisionMap[jn(t,i?"RepetitionWithSeparator":"Repetition",r.idx)]=o,{left:o,right:l}}function ik(e,t,r,n){const i=n.left,s=n.right;return Ve(i,s),e.decisionMap[jn(t,"Option",r.idx)]=i,n}function Vr(e,t){return e.decisionStates.push(t),t.decision=e.decisionStates.length-1,t.decision}function Qn(e,t,r,n,...i){const s=rt(e,t,n,{type:8,start:r});r.end=s;for(const o of i)o!==void 0?(Ve(r,o.left),Ve(o.right,s)):Ve(r,s);const a={left:r,right:s};return e.decisionMap[jn(t,sk(n),n.idx)]=r,a}function sk(e){if(e instanceof bt)return"Alternation";if(e instanceof ot)return"Option";if(e instanceof Fe)return"Repetition";if(e instanceof St)return"RepetitionWithSeparator";if(e instanceof Ot)return"RepetitionMandatory";if(e instanceof Lt)return"RepetitionMandatoryWithSeparator";throw new Error("Invalid production type encountered")}function ak(e,t){const r=t.length;for(let s=0;s<r-1;s++){const a=t[s];let o;a.left.transitions.length===1&&(o=a.left.transitions[0]);const l=o instanceof Yd,u=o,c=t[s+1].left;a.left.type===1&&a.right.type===1&&o!==void 0&&(l&&u.followState===a.right||o.target===a.right)?(l?u.followState=c:o.target=c,uk(e,a.right)):Ve(a.right,c)}const n=t[0],i=t[r-1];return{left:n.left,right:i.right}}function Xd(e,t,r,n){const i=rt(e,t,n,{type:1}),s=rt(e,t,n,{type:1});return Qd(i,new Vd(s,r)),{left:i,right:s}}function ok(e,t,r){const n=r.referencedRule,i=e.ruleToStartState.get(n),s=rt(e,t,r,{type:1}),a=rt(e,t,r,{type:1});return Qd(s,new Yd(i,n,a)),{left:s,right:a}}function lk(e,t,r){const n=e.ruleToStartState.get(t);Ve(n,r.left);const i=e.ruleToStopState.get(t);return Ve(r.right,i),{left:n,right:i}}function Ve(e,t){Qd(e,new ng(t))}function rt(e,t,r,n){const i=Object.assign({atn:e,production:r,epsilonOnlyTransitions:!1,rule:t,transitions:[],nextTokenWithinRule:[],stateNumber:e.states.length},n);return e.states.push(i),i}function Qd(e,t){e.transitions.length===0&&(e.epsilonOnlyTransitions=t.isEpsilon()),e.transitions.push(t)}function uk(e,t){e.states.splice(e.states.indexOf(t),1)}var Qo={},Ku=class{constructor(){this.map={},this.configs=[]}get size(){return this.configs.length}finalize(){this.map={}}add(e){const t=og(e);t in this.map||(this.map[t]=this.configs.length,this.configs.push(e))}get elements(){return this.configs}get alts(){return K(this.configs,e=>e.alt)}get key(){let e="";for(const t in this.map)e+=t+":";return e}};function og(e,t=!0){return`${t?`a${e.alt}`:""}s${e.state.stateNumber}:${e.stack.map(r=>r.stateNumber.toString()).join("_")}`}function ck(e,t){const r={};return n=>{const i=n.toString();let s=r[i];return s!==void 0||(s={atnStartState:e,decision:t,states:{}},r[i]=s),s}}var lg=class{constructor(){this.predicates=[]}is(e){return e>=this.predicates.length||this.predicates[e]}set(e,t){this.predicates[e]=t}toString(){let e="";const t=this.predicates.length;for(let r=0;r<t;r++)e+=this.predicates[r]===!0?"1":"0";return e}},Wh=new lg,dk=class extends Kd{constructor(e){var t;super(),this.logging=(t=e?.logging)!==null&&t!==void 0?t:(r=>console.log(r))}initialize(e){this.atn=X0(e.rules),this.dfas=fk(this.atn)}validateAmbiguousAlternationAlternatives(){return[]}validateEmptyOrAlternatives(){return[]}buildLookaheadForAlternation(e){const{prodOccurrence:t,rule:r,hasPredicates:n,dynamicTokensEnabled:i}=e,s=this.dfas,a=this.logging,o=jn(r,"Alternation",t),l=this.atn.decisionMap[o].decision,u=K(Oh({maxLookahead:1,occurrence:t,prodType:"Alternation",rule:r}),c=>K(c,d=>d[0]));if(Bh(u,!1)&&!i){const c=mt(u,(d,f,h)=>(Q(f,m=>{m&&(d[m.tokenTypeIdx]=h,Q(m.categoryMatches,R=>{d[R]=h}))}),d),{});return n?function(d){var f;const h=c[this.LA(1).tokenTypeIdx];if(d!==void 0&&h!==void 0){const m=(f=d[h])===null||f===void 0?void 0:f.GATE;if(m!==void 0&&m.call(this)===!1)return}return h}:function(){return c[this.LA(1).tokenTypeIdx]}}else return n?function(c){const d=new lg,f=c===void 0?0:c.length;for(let m=0;m<f;m++){const R=c?.[m].GATE;d.set(m,R===void 0||R.call(this))}const h=uu.call(this,s,l,d,a);return typeof h=="number"?h:void 0}:function(){const c=uu.call(this,s,l,Wh,a);return typeof c=="number"?c:void 0}}buildLookaheadForOptional(e){const{prodOccurrence:t,rule:r,prodType:n,dynamicTokensEnabled:i}=e,s=this.dfas,a=this.logging,o=jn(r,n,t),l=this.atn.decisionMap[o].decision,u=K(Oh({maxLookahead:1,occurrence:t,prodType:n,rule:r}),c=>K(c,d=>d[0]));if(Bh(u)&&u[0][0]&&!i){const c=u[0],d=Ft(c);if(d.length===1&&Re(d[0].categoryMatches)){const f=d[0].tokenTypeIdx;return function(){return this.LA(1).tokenTypeIdx===f}}else{const f=mt(d,(h,m)=>(m!==void 0&&(h[m.tokenTypeIdx]=!0,Q(m.categoryMatches,R=>{h[R]=!0})),h),{});return function(){return f[this.LA(1).tokenTypeIdx]===!0}}}return function(){const c=uu.call(this,s,l,Wh,a);return typeof c=="object"?!1:c===0}}};function Bh(e,t=!0){const r=new Set;for(const n of e){const i=new Set;for(const s of n){if(s===void 0){if(t)break;return!1}const a=[s.tokenTypeIdx].concat(s.categoryMatches);for(const o of a)if(r.has(o)){if(!i.has(o))return!1}else r.add(o),i.add(o)}}return!0}function fk(e){const t=e.decisionStates.length,r=Array(t);for(let n=0;n<t;n++)r[n]=ck(e.decisionStates[n],n);return r}function uu(e,t,r,n){const i=e[t](r);let s=i.start;return s===void 0&&(s=cg(i,ug(_k(i.atnStartState))),i.start=s),hk.apply(this,[i,s,r,n])}function hk(e,t,r,n){let i=t,s=1;const a=[];let o=this.LA(s++);for(;;){let l=Tk(i,o);if(l===void 0&&(l=pk.apply(this,[e,i,o,s,r,n])),l===Qo)return vk(a,i,o);if(l.isAcceptState===!0)return l.prediction;i=l,a.push(o),o=this.LA(s++)}}function pk(e,t,r,n,i,s){const a=Rk(t.configs,r,i);if(a.size===0)return Hh(e,t,r,Qo),Qo;let o=ug(a);const l=Ck(a,i);if(l!==void 0)o.isAcceptState=!0,o.prediction=l,o.configs.uniqueAlt=l;else if($k(a)){const u=U_(a.alts);o.isAcceptState=!0,o.prediction=u,o.configs.uniqueAlt=u,mk.apply(this,[e,n,a.alts,s])}return o=Hh(e,t,r,o),o}function mk(e,t,r,n){const i=[];for(let l=1;l<=t;l++)i.push(this.LA(l).tokenType);const s=e.atnStartState,a=s.rule,o=s.production;n(gk({topLevelRule:a,ambiguityIndices:r,production:o,prefixPath:i}))}function gk(e){const t=K(e.prefixPath,i=>On(i)).join(", "),r=e.production.idx===0?"":e.production.idx;let n=`Ambiguous Alternatives Detected: <${e.ambiguityIndices.join(", ")}> in <${yk(e.production)}${r}> inside <${e.topLevelRule.name}> Rule,
<${t}> may appears as a prefix path in all these alternatives.
`;return n=n+`See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#AMBIGUOUS_ALTERNATIVES
For Further details.`,n}function yk(e){if(e instanceof gt)return"SUBRULE";if(e instanceof ot)return"OPTION";if(e instanceof bt)return"OR";if(e instanceof Ot)return"AT_LEAST_ONE";if(e instanceof Lt)return"AT_LEAST_ONE_SEP";if(e instanceof St)return"MANY_SEP";if(e instanceof Fe)return"MANY";if(e instanceof be)return"CONSUME";throw Error("non exhaustive match")}function vk(e,t,r){return{actualToken:r,possibleTokenTypes:X_(At(t.configs.elements,n=>n.state.transitions).filter(n=>n instanceof Vd).map(n=>n.tokenType),n=>n.tokenTypeIdx),tokenPath:e}}function Tk(e,t){return e.edges[t.tokenTypeIdx]}function Rk(e,t,r){const n=new Ku,i=[];for(const a of e.elements){if(r.is(a.alt)===!1)continue;if(a.state.type===7){i.push(a);continue}const o=a.state.transitions.length;for(let l=0;l<o;l++){const u=a.state.transitions[l],c=wk(u,t);c!==void 0&&n.add({state:c,alt:a.alt,stack:a.stack})}}let s;if(i.length===0&&n.size===1&&(s=n),s===void 0){s=new Ku;for(const a of n.elements)Jo(a,s)}if(i.length>0&&!bk(s))for(const a of i)s.add(a);return s}function wk(e,t){if(e instanceof Vd&&jm(t,e.tokenType))return e.target}function Ck(e,t){let r;for(const n of e.elements)if(t.is(n.alt)===!0){if(r===void 0)r=n.alt;else if(r!==n.alt)return}return r}function ug(e){return{configs:e,edges:{},isAcceptState:!1,prediction:-1}}function Hh(e,t,r,n){return n=cg(e,n),t.edges[r.tokenTypeIdx]=n,n}function cg(e,t){if(t===Qo)return t;const r=t.configs.key,n=e.states[r];return n!==void 0?n:(t.configs.finalize(),e.states[r]=t,t)}function _k(e){const t=new Ku,r=e.transitions.length;for(let n=0;n<r;n++)Jo({state:e.transitions[n].target,alt:n,stack:[]},t);return t}function Jo(e,t){const r=e.state;if(r.type===7){if(e.stack.length>0){const i=[...e.stack];Jo({state:i.pop(),alt:e.alt,stack:i},t)}else t.add(e);return}r.epsilonOnlyTransitions||t.add(e);const n=r.transitions.length;for(let i=0;i<n;i++){const s=r.transitions[i],a=Sk(e,s);a!==void 0&&Jo(a,t)}}function Sk(e,t){if(t instanceof ng)return{state:t.target,alt:e.alt,stack:e.stack};if(t instanceof Yd){const r=[...e.stack,t.followState];return{state:t.target,alt:e.alt,stack:r}}}function bk(e){for(const t of e.elements)if(t.state.type===7)return!0;return!1}function kk(e){for(const t of e.elements)if(t.state.type!==7)return!1;return!0}function $k(e){if(kk(e))return!0;const t=Ek(e.elements);return Ak(t)&&!Ik(t)}function Ek(e){const t=new Map;for(const r of e){const n=og(r,!1);let i=t.get(n);i===void 0&&(i={},t.set(n,i)),i[r.alt]=!0}return t}function Ak(e){for(const t of Array.from(e.values()))if(Object.keys(t).length>1)return!0;return!1}function Ik(e){for(const t of Array.from(e.values()))if(Object.keys(t).length===1)return!0;return!1}var Jd=dl({AnnotatedTextEdit:()=>Rr,ChangeAnnotation:()=>Zr,ChangeAnnotationIdentifier:()=>it,CodeAction:()=>bc,CodeActionContext:()=>Sc,CodeActionKind:()=>_c,CodeActionTriggerKind:()=>Gi,CodeDescription:()=>tc,CodeLens:()=>kc,Color:()=>ro,ColorInformation:()=>Yu,ColorPresentation:()=>Xu,Command:()=>Jr,CompletionItem:()=>dc,CompletionItemKind:()=>sc,CompletionItemLabelDetails:()=>cc,CompletionItemTag:()=>oc,CompletionList:()=>fc,CreateFile:()=>bn,DeleteFile:()=>$n,Diagnostic:()=>Wi,DiagnosticRelatedInformation:()=>no,DiagnosticSeverity:()=>Zu,DiagnosticTag:()=>ec,DocumentHighlight:()=>yc,DocumentHighlightKind:()=>gc,DocumentLink:()=>Ec,DocumentSymbol:()=>Cc,DocumentUri:()=>Gu,EOL:()=>fg,FoldingRange:()=>Ju,FoldingRangeKind:()=>Qu,FormattingOptions:()=>$c,Hover:()=>hc,InlayHint:()=>Fc,InlayHintKind:()=>ao,InlayHintLabelPart:()=>oo,InlineCompletionContext:()=>Bc,InlineCompletionItem:()=>qc,InlineCompletionList:()=>jc,InlineCompletionTriggerKind:()=>Uc,InlineValueContext:()=>Mc,InlineValueEvaluatableExpression:()=>Lc,InlineValueText:()=>Dc,InlineValueVariableLookup:()=>Oc,InsertReplaceEdit:()=>lc,InsertTextFormat:()=>ac,InsertTextMode:()=>uc,Location:()=>Ui,LocationLink:()=>Vu,MarkedString:()=>Ki,MarkupContent:()=>En,MarkupKind:()=>so,OptionalVersionedTextDocumentIdentifier:()=>Hi,ParameterInformation:()=>pc,Position:()=>fe,Range:()=>le,RenameFile:()=>kn,SelectedCompletionInfo:()=>Wc,SelectionRange:()=>Ac,SemanticTokenModifiers:()=>Nc,SemanticTokenTypes:()=>Ic,SemanticTokens:()=>Pc,SignatureInformation:()=>mc,StringValue:()=>xc,SymbolInformation:()=>Rc,SymbolKind:()=>vc,SymbolTag:()=>Tc,TextDocument:()=>Kc,TextDocumentEdit:()=>Bi,TextDocumentIdentifier:()=>rc,TextDocumentItem:()=>ic,TextEdit:()=>Ht,URI:()=>to,VersionedTextDocumentIdentifier:()=>nc,WorkspaceChange:()=>dg,WorkspaceEdit:()=>io,WorkspaceFolder:()=>Hc,WorkspaceSymbol:()=>wc,integer:()=>zu,uinteger:()=>ji}),Gu,to,zu,ji,fe,le,Ui,Vu,ro,Yu,Xu,Qu,Ju,no,Zu,ec,tc,Wi,Jr,Ht,Zr,it,Rr,Bi,bn,kn,$n,io,oi,cu,dg,rc,nc,Hi,ic,so,En,sc,ac,oc,lc,uc,cc,dc,fc,Ki,hc,pc,mc,gc,yc,vc,Tc,Rc,wc,Cc,_c,Gi,Sc,bc,kc,$c,Ec,Ac,Ic,Nc,Pc,Dc,Oc,Lc,Mc,ao,oo,Fc,xc,qc,jc,Uc,Wc,Bc,Hc,fg,Kc,Kh,C,yn=Lv((()=>{(function(e){function t(r){return typeof r=="string"}e.is=t})(Gu||(Gu={})),(function(e){function t(r){return typeof r=="string"}e.is=t})(to||(to={})),(function(e){e.MIN_VALUE=-2147483648,e.MAX_VALUE=2147483647;function t(r){return typeof r=="number"&&e.MIN_VALUE<=r&&r<=e.MAX_VALUE}e.is=t})(zu||(zu={})),(function(e){e.MIN_VALUE=0,e.MAX_VALUE=2147483647;function t(r){return typeof r=="number"&&e.MIN_VALUE<=r&&r<=e.MAX_VALUE}e.is=t})(ji||(ji={})),(function(e){function t(n,i){return n===Number.MAX_VALUE&&(n=ji.MAX_VALUE),i===Number.MAX_VALUE&&(i=ji.MAX_VALUE),{line:n,character:i}}e.create=t;function r(n){let i=n;return C.objectLiteral(i)&&C.uinteger(i.line)&&C.uinteger(i.character)}e.is=r})(fe||(fe={})),(function(e){function t(n,i,s,a){if(C.uinteger(n)&&C.uinteger(i)&&C.uinteger(s)&&C.uinteger(a))return{start:fe.create(n,i),end:fe.create(s,a)};if(fe.is(n)&&fe.is(i))return{start:n,end:i};throw new Error(`Range#create called with invalid arguments[${n}, ${i}, ${s}, ${a}]`)}e.create=t;function r(n){let i=n;return C.objectLiteral(i)&&fe.is(i.start)&&fe.is(i.end)}e.is=r})(le||(le={})),(function(e){function t(n,i){return{uri:n,range:i}}e.create=t;function r(n){let i=n;return C.objectLiteral(i)&&le.is(i.range)&&(C.string(i.uri)||C.undefined(i.uri))}e.is=r})(Ui||(Ui={})),(function(e){function t(n,i,s,a){return{targetUri:n,targetRange:i,targetSelectionRange:s,originSelectionRange:a}}e.create=t;function r(n){let i=n;return C.objectLiteral(i)&&le.is(i.targetRange)&&C.string(i.targetUri)&&le.is(i.targetSelectionRange)&&(le.is(i.originSelectionRange)||C.undefined(i.originSelectionRange))}e.is=r})(Vu||(Vu={})),(function(e){function t(n,i,s,a){return{red:n,green:i,blue:s,alpha:a}}e.create=t;function r(n){const i=n;return C.objectLiteral(i)&&C.numberRange(i.red,0,1)&&C.numberRange(i.green,0,1)&&C.numberRange(i.blue,0,1)&&C.numberRange(i.alpha,0,1)}e.is=r})(ro||(ro={})),(function(e){function t(n,i){return{range:n,color:i}}e.create=t;function r(n){const i=n;return C.objectLiteral(i)&&le.is(i.range)&&ro.is(i.color)}e.is=r})(Yu||(Yu={})),(function(e){function t(n,i,s){return{label:n,textEdit:i,additionalTextEdits:s}}e.create=t;function r(n){const i=n;return C.objectLiteral(i)&&C.string(i.label)&&(C.undefined(i.textEdit)||Ht.is(i))&&(C.undefined(i.additionalTextEdits)||C.typedArray(i.additionalTextEdits,Ht.is))}e.is=r})(Xu||(Xu={})),(function(e){e.Comment="comment",e.Imports="imports",e.Region="region"})(Qu||(Qu={})),(function(e){function t(n,i,s,a,o,l){const u={startLine:n,endLine:i};return C.defined(s)&&(u.startCharacter=s),C.defined(a)&&(u.endCharacter=a),C.defined(o)&&(u.kind=o),C.defined(l)&&(u.collapsedText=l),u}e.create=t;function r(n){const i=n;return C.objectLiteral(i)&&C.uinteger(i.startLine)&&C.uinteger(i.startLine)&&(C.undefined(i.startCharacter)||C.uinteger(i.startCharacter))&&(C.undefined(i.endCharacter)||C.uinteger(i.endCharacter))&&(C.undefined(i.kind)||C.string(i.kind))}e.is=r})(Ju||(Ju={})),(function(e){function t(n,i){return{location:n,message:i}}e.create=t;function r(n){let i=n;return C.defined(i)&&Ui.is(i.location)&&C.string(i.message)}e.is=r})(no||(no={})),(function(e){e.Error=1,e.Warning=2,e.Information=3,e.Hint=4})(Zu||(Zu={})),(function(e){e.Unnecessary=1,e.Deprecated=2})(ec||(ec={})),(function(e){function t(r){const n=r;return C.objectLiteral(n)&&C.string(n.href)}e.is=t})(tc||(tc={})),(function(e){function t(n,i,s,a,o,l){let u={range:n,message:i};return C.defined(s)&&(u.severity=s),C.defined(a)&&(u.code=a),C.defined(o)&&(u.source=o),C.defined(l)&&(u.relatedInformation=l),u}e.create=t;function r(n){var i;let s=n;return C.defined(s)&&le.is(s.range)&&C.string(s.message)&&(C.number(s.severity)||C.undefined(s.severity))&&(C.integer(s.code)||C.string(s.code)||C.undefined(s.code))&&(C.undefined(s.codeDescription)||C.string((i=s.codeDescription)===null||i===void 0?void 0:i.href))&&(C.string(s.source)||C.undefined(s.source))&&(C.undefined(s.relatedInformation)||C.typedArray(s.relatedInformation,no.is))}e.is=r})(Wi||(Wi={})),(function(e){function t(n,i,...s){let a={title:n,command:i};return C.defined(s)&&s.length>0&&(a.arguments=s),a}e.create=t;function r(n){let i=n;return C.defined(i)&&C.string(i.title)&&C.string(i.command)}e.is=r})(Jr||(Jr={})),(function(e){function t(s,a){return{range:s,newText:a}}e.replace=t;function r(s,a){return{range:{start:s,end:s},newText:a}}e.insert=r;function n(s){return{range:s,newText:""}}e.del=n;function i(s){const a=s;return C.objectLiteral(a)&&C.string(a.newText)&&le.is(a.range)}e.is=i})(Ht||(Ht={})),(function(e){function t(n,i,s){const a={label:n};return i!==void 0&&(a.needsConfirmation=i),s!==void 0&&(a.description=s),a}e.create=t;function r(n){const i=n;return C.objectLiteral(i)&&C.string(i.label)&&(C.boolean(i.needsConfirmation)||i.needsConfirmation===void 0)&&(C.string(i.description)||i.description===void 0)}e.is=r})(Zr||(Zr={})),(function(e){function t(r){const n=r;return C.string(n)}e.is=t})(it||(it={})),(function(e){function t(s,a,o){return{range:s,newText:a,annotationId:o}}e.replace=t;function r(s,a,o){return{range:{start:s,end:s},newText:a,annotationId:o}}e.insert=r;function n(s,a){return{range:s,newText:"",annotationId:a}}e.del=n;function i(s){const a=s;return Ht.is(a)&&(Zr.is(a.annotationId)||it.is(a.annotationId))}e.is=i})(Rr||(Rr={})),(function(e){function t(n,i){return{textDocument:n,edits:i}}e.create=t;function r(n){let i=n;return C.defined(i)&&Hi.is(i.textDocument)&&Array.isArray(i.edits)}e.is=r})(Bi||(Bi={})),(function(e){function t(n,i,s){let a={kind:"create",uri:n};return i!==void 0&&(i.overwrite!==void 0||i.ignoreIfExists!==void 0)&&(a.options=i),s!==void 0&&(a.annotationId=s),a}e.create=t;function r(n){let i=n;return i&&i.kind==="create"&&C.string(i.uri)&&(i.options===void 0||(i.options.overwrite===void 0||C.boolean(i.options.overwrite))&&(i.options.ignoreIfExists===void 0||C.boolean(i.options.ignoreIfExists)))&&(i.annotationId===void 0||it.is(i.annotationId))}e.is=r})(bn||(bn={})),(function(e){function t(n,i,s,a){let o={kind:"rename",oldUri:n,newUri:i};return s!==void 0&&(s.overwrite!==void 0||s.ignoreIfExists!==void 0)&&(o.options=s),a!==void 0&&(o.annotationId=a),o}e.create=t;function r(n){let i=n;return i&&i.kind==="rename"&&C.string(i.oldUri)&&C.string(i.newUri)&&(i.options===void 0||(i.options.overwrite===void 0||C.boolean(i.options.overwrite))&&(i.options.ignoreIfExists===void 0||C.boolean(i.options.ignoreIfExists)))&&(i.annotationId===void 0||it.is(i.annotationId))}e.is=r})(kn||(kn={})),(function(e){function t(n,i,s){let a={kind:"delete",uri:n};return i!==void 0&&(i.recursive!==void 0||i.ignoreIfNotExists!==void 0)&&(a.options=i),s!==void 0&&(a.annotationId=s),a}e.create=t;function r(n){let i=n;return i&&i.kind==="delete"&&C.string(i.uri)&&(i.options===void 0||(i.options.recursive===void 0||C.boolean(i.options.recursive))&&(i.options.ignoreIfNotExists===void 0||C.boolean(i.options.ignoreIfNotExists)))&&(i.annotationId===void 0||it.is(i.annotationId))}e.is=r})($n||($n={})),(function(e){function t(r){let n=r;return n&&(n.changes!==void 0||n.documentChanges!==void 0)&&(n.documentChanges===void 0||n.documentChanges.every(i=>C.string(i.kind)?bn.is(i)||kn.is(i)||$n.is(i):Bi.is(i)))}e.is=t})(io||(io={})),oi=class{constructor(e,t){this.edits=e,this.changeAnnotations=t}insert(e,t,r){let n,i;if(r===void 0?n=Ht.insert(e,t):it.is(r)?(i=r,n=Rr.insert(e,t,r)):(this.assertChangeAnnotations(this.changeAnnotations),i=this.changeAnnotations.manage(r),n=Rr.insert(e,t,i)),this.edits.push(n),i!==void 0)return i}replace(e,t,r){let n,i;if(r===void 0?n=Ht.replace(e,t):it.is(r)?(i=r,n=Rr.replace(e,t,r)):(this.assertChangeAnnotations(this.changeAnnotations),i=this.changeAnnotations.manage(r),n=Rr.replace(e,t,i)),this.edits.push(n),i!==void 0)return i}delete(e,t){let r,n;if(t===void 0?r=Ht.del(e):it.is(t)?(n=t,r=Rr.del(e,t)):(this.assertChangeAnnotations(this.changeAnnotations),n=this.changeAnnotations.manage(t),r=Rr.del(e,n)),this.edits.push(r),n!==void 0)return n}add(e){this.edits.push(e)}all(){return this.edits}clear(){this.edits.splice(0,this.edits.length)}assertChangeAnnotations(e){if(e===void 0)throw new Error("Text edit change is not configured to manage change annotations.")}},cu=class{constructor(e){this._annotations=e===void 0?Object.create(null):e,this._counter=0,this._size=0}all(){return this._annotations}get size(){return this._size}manage(e,t){let r;if(it.is(e)?r=e:(r=this.nextId(),t=e),this._annotations[r]!==void 0)throw new Error(`Id ${r} is already in use.`);if(t===void 0)throw new Error(`No annotation provided for id ${r}`);return this._annotations[r]=t,this._size++,r}nextId(){return this._counter++,this._counter.toString()}},dg=class{constructor(e){this._textEditChanges=Object.create(null),e!==void 0?(this._workspaceEdit=e,e.documentChanges?(this._changeAnnotations=new cu(e.changeAnnotations),e.changeAnnotations=this._changeAnnotations.all(),e.documentChanges.forEach(t=>{if(Bi.is(t)){const r=new oi(t.edits,this._changeAnnotations);this._textEditChanges[t.textDocument.uri]=r}})):e.changes&&Object.keys(e.changes).forEach(t=>{const r=new oi(e.changes[t]);this._textEditChanges[t]=r})):this._workspaceEdit={}}get edit(){return this.initDocumentChanges(),this._changeAnnotations!==void 0&&(this._changeAnnotations.size===0?this._workspaceEdit.changeAnnotations=void 0:this._workspaceEdit.changeAnnotations=this._changeAnnotations.all()),this._workspaceEdit}getTextEditChange(e){if(Hi.is(e)){if(this.initDocumentChanges(),this._workspaceEdit.documentChanges===void 0)throw new Error("Workspace edit is not configured for document changes.");const t={uri:e.uri,version:e.version};let r=this._textEditChanges[t.uri];if(!r){const n=[],i={textDocument:t,edits:n};this._workspaceEdit.documentChanges.push(i),r=new oi(n,this._changeAnnotations),this._textEditChanges[t.uri]=r}return r}else{if(this.initChanges(),this._workspaceEdit.changes===void 0)throw new Error("Workspace edit is not configured for normal text edit changes.");let t=this._textEditChanges[e];if(!t){let r=[];this._workspaceEdit.changes[e]=r,t=new oi(r),this._textEditChanges[e]=t}return t}}initDocumentChanges(){this._workspaceEdit.documentChanges===void 0&&this._workspaceEdit.changes===void 0&&(this._changeAnnotations=new cu,this._workspaceEdit.documentChanges=[],this._workspaceEdit.changeAnnotations=this._changeAnnotations.all())}initChanges(){this._workspaceEdit.documentChanges===void 0&&this._workspaceEdit.changes===void 0&&(this._workspaceEdit.changes=Object.create(null))}createFile(e,t,r){if(this.initDocumentChanges(),this._workspaceEdit.documentChanges===void 0)throw new Error("Workspace edit is not configured for document changes.");let n;Zr.is(t)||it.is(t)?n=t:r=t;let i,s;if(n===void 0?i=bn.create(e,r):(s=it.is(n)?n:this._changeAnnotations.manage(n),i=bn.create(e,r,s)),this._workspaceEdit.documentChanges.push(i),s!==void 0)return s}renameFile(e,t,r,n){if(this.initDocumentChanges(),this._workspaceEdit.documentChanges===void 0)throw new Error("Workspace edit is not configured for document changes.");let i;Zr.is(r)||it.is(r)?i=r:n=r;let s,a;if(i===void 0?s=kn.create(e,t,n):(a=it.is(i)?i:this._changeAnnotations.manage(i),s=kn.create(e,t,n,a)),this._workspaceEdit.documentChanges.push(s),a!==void 0)return a}deleteFile(e,t,r){if(this.initDocumentChanges(),this._workspaceEdit.documentChanges===void 0)throw new Error("Workspace edit is not configured for document changes.");let n;Zr.is(t)||it.is(t)?n=t:r=t;let i,s;if(n===void 0?i=$n.create(e,r):(s=it.is(n)?n:this._changeAnnotations.manage(n),i=$n.create(e,r,s)),this._workspaceEdit.documentChanges.push(i),s!==void 0)return s}},(function(e){function t(n){return{uri:n}}e.create=t;function r(n){let i=n;return C.defined(i)&&C.string(i.uri)}e.is=r})(rc||(rc={})),(function(e){function t(n,i){return{uri:n,version:i}}e.create=t;function r(n){let i=n;return C.defined(i)&&C.string(i.uri)&&C.integer(i.version)}e.is=r})(nc||(nc={})),(function(e){function t(n,i){return{uri:n,version:i}}e.create=t;function r(n){let i=n;return C.defined(i)&&C.string(i.uri)&&(i.version===null||C.integer(i.version))}e.is=r})(Hi||(Hi={})),(function(e){function t(n,i,s,a){return{uri:n,languageId:i,version:s,text:a}}e.create=t;function r(n){let i=n;return C.defined(i)&&C.string(i.uri)&&C.string(i.languageId)&&C.integer(i.version)&&C.string(i.text)}e.is=r})(ic||(ic={})),(function(e){e.PlainText="plaintext",e.Markdown="markdown";function t(r){const n=r;return n===e.PlainText||n===e.Markdown}e.is=t})(so||(so={})),(function(e){function t(r){const n=r;return C.objectLiteral(r)&&so.is(n.kind)&&C.string(n.value)}e.is=t})(En||(En={})),(function(e){e.Text=1,e.Method=2,e.Function=3,e.Constructor=4,e.Field=5,e.Variable=6,e.Class=7,e.Interface=8,e.Module=9,e.Property=10,e.Unit=11,e.Value=12,e.Enum=13,e.Keyword=14,e.Snippet=15,e.Color=16,e.File=17,e.Reference=18,e.Folder=19,e.EnumMember=20,e.Constant=21,e.Struct=22,e.Event=23,e.Operator=24,e.TypeParameter=25})(sc||(sc={})),(function(e){e.PlainText=1,e.Snippet=2})(ac||(ac={})),(function(e){e.Deprecated=1})(oc||(oc={})),(function(e){function t(n,i,s){return{newText:n,insert:i,replace:s}}e.create=t;function r(n){const i=n;return i&&C.string(i.newText)&&le.is(i.insert)&&le.is(i.replace)}e.is=r})(lc||(lc={})),(function(e){e.asIs=1,e.adjustIndentation=2})(uc||(uc={})),(function(e){function t(r){const n=r;return n&&(C.string(n.detail)||n.detail===void 0)&&(C.string(n.description)||n.description===void 0)}e.is=t})(cc||(cc={})),(function(e){function t(r){return{label:r}}e.create=t})(dc||(dc={})),(function(e){function t(r,n){return{items:r||[],isIncomplete:!!n}}e.create=t})(fc||(fc={})),(function(e){function t(n){return n.replace(/[\\`*_{}[\]()#+\-.!]/g,"\\$&")}e.fromPlainText=t;function r(n){const i=n;return C.string(i)||C.objectLiteral(i)&&C.string(i.language)&&C.string(i.value)}e.is=r})(Ki||(Ki={})),(function(e){function t(r){let n=r;return!!n&&C.objectLiteral(n)&&(En.is(n.contents)||Ki.is(n.contents)||C.typedArray(n.contents,Ki.is))&&(r.range===void 0||le.is(r.range))}e.is=t})(hc||(hc={})),(function(e){function t(r,n){return n?{label:r,documentation:n}:{label:r}}e.create=t})(pc||(pc={})),(function(e){function t(r,n,...i){let s={label:r};return C.defined(n)&&(s.documentation=n),C.defined(i)?s.parameters=i:s.parameters=[],s}e.create=t})(mc||(mc={})),(function(e){e.Text=1,e.Read=2,e.Write=3})(gc||(gc={})),(function(e){function t(r,n){let i={range:r};return C.number(n)&&(i.kind=n),i}e.create=t})(yc||(yc={})),(function(e){e.File=1,e.Module=2,e.Namespace=3,e.Package=4,e.Class=5,e.Method=6,e.Property=7,e.Field=8,e.Constructor=9,e.Enum=10,e.Interface=11,e.Function=12,e.Variable=13,e.Constant=14,e.String=15,e.Number=16,e.Boolean=17,e.Array=18,e.Object=19,e.Key=20,e.Null=21,e.EnumMember=22,e.Struct=23,e.Event=24,e.Operator=25,e.TypeParameter=26})(vc||(vc={})),(function(e){e.Deprecated=1})(Tc||(Tc={})),(function(e){function t(r,n,i,s,a){let o={name:r,kind:n,location:{uri:s,range:i}};return a&&(o.containerName=a),o}e.create=t})(Rc||(Rc={})),(function(e){function t(r,n,i,s){return s!==void 0?{name:r,kind:n,location:{uri:i,range:s}}:{name:r,kind:n,location:{uri:i}}}e.create=t})(wc||(wc={})),(function(e){function t(n,i,s,a,o,l){let u={name:n,detail:i,kind:s,range:a,selectionRange:o};return l!==void 0&&(u.children=l),u}e.create=t;function r(n){let i=n;return i&&C.string(i.name)&&C.number(i.kind)&&le.is(i.range)&&le.is(i.selectionRange)&&(i.detail===void 0||C.string(i.detail))&&(i.deprecated===void 0||C.boolean(i.deprecated))&&(i.children===void 0||Array.isArray(i.children))&&(i.tags===void 0||Array.isArray(i.tags))}e.is=r})(Cc||(Cc={})),(function(e){e.Empty="",e.QuickFix="quickfix",e.Refactor="refactor",e.RefactorExtract="refactor.extract",e.RefactorInline="refactor.inline",e.RefactorRewrite="refactor.rewrite",e.Source="source",e.SourceOrganizeImports="source.organizeImports",e.SourceFixAll="source.fixAll"})(_c||(_c={})),(function(e){e.Invoked=1,e.Automatic=2})(Gi||(Gi={})),(function(e){function t(n,i,s){let a={diagnostics:n};return i!=null&&(a.only=i),s!=null&&(a.triggerKind=s),a}e.create=t;function r(n){let i=n;return C.defined(i)&&C.typedArray(i.diagnostics,Wi.is)&&(i.only===void 0||C.typedArray(i.only,C.string))&&(i.triggerKind===void 0||i.triggerKind===Gi.Invoked||i.triggerKind===Gi.Automatic)}e.is=r})(Sc||(Sc={})),(function(e){function t(n,i,s){let a={title:n},o=!0;return typeof i=="string"?(o=!1,a.kind=i):Jr.is(i)?a.command=i:a.edit=i,o&&s!==void 0&&(a.kind=s),a}e.create=t;function r(n){let i=n;return i&&C.string(i.title)&&(i.diagnostics===void 0||C.typedArray(i.diagnostics,Wi.is))&&(i.kind===void 0||C.string(i.kind))&&(i.edit!==void 0||i.command!==void 0)&&(i.command===void 0||Jr.is(i.command))&&(i.isPreferred===void 0||C.boolean(i.isPreferred))&&(i.edit===void 0||io.is(i.edit))}e.is=r})(bc||(bc={})),(function(e){function t(n,i){let s={range:n};return C.defined(i)&&(s.data=i),s}e.create=t;function r(n){let i=n;return C.defined(i)&&le.is(i.range)&&(C.undefined(i.command)||Jr.is(i.command))}e.is=r})(kc||(kc={})),(function(e){function t(n,i){return{tabSize:n,insertSpaces:i}}e.create=t;function r(n){let i=n;return C.defined(i)&&C.uinteger(i.tabSize)&&C.boolean(i.insertSpaces)}e.is=r})($c||($c={})),(function(e){function t(n,i,s){return{range:n,target:i,data:s}}e.create=t;function r(n){let i=n;return C.defined(i)&&le.is(i.range)&&(C.undefined(i.target)||C.string(i.target))}e.is=r})(Ec||(Ec={})),(function(e){function t(n,i){return{range:n,parent:i}}e.create=t;function r(n){let i=n;return C.objectLiteral(i)&&le.is(i.range)&&(i.parent===void 0||e.is(i.parent))}e.is=r})(Ac||(Ac={})),(function(e){e.namespace="namespace",e.type="type",e.class="class",e.enum="enum",e.interface="interface",e.struct="struct",e.typeParameter="typeParameter",e.parameter="parameter",e.variable="variable",e.property="property",e.enumMember="enumMember",e.event="event",e.function="function",e.method="method",e.macro="macro",e.keyword="keyword",e.modifier="modifier",e.comment="comment",e.string="string",e.number="number",e.regexp="regexp",e.operator="operator",e.decorator="decorator"})(Ic||(Ic={})),(function(e){e.declaration="declaration",e.definition="definition",e.readonly="readonly",e.static="static",e.deprecated="deprecated",e.abstract="abstract",e.async="async",e.modification="modification",e.documentation="documentation",e.defaultLibrary="defaultLibrary"})(Nc||(Nc={})),(function(e){function t(r){const n=r;return C.objectLiteral(n)&&(n.resultId===void 0||typeof n.resultId=="string")&&Array.isArray(n.data)&&(n.data.length===0||typeof n.data[0]=="number")}e.is=t})(Pc||(Pc={})),(function(e){function t(n,i){return{range:n,text:i}}e.create=t;function r(n){const i=n;return i!=null&&le.is(i.range)&&C.string(i.text)}e.is=r})(Dc||(Dc={})),(function(e){function t(n,i,s){return{range:n,variableName:i,caseSensitiveLookup:s}}e.create=t;function r(n){const i=n;return i!=null&&le.is(i.range)&&C.boolean(i.caseSensitiveLookup)&&(C.string(i.variableName)||i.variableName===void 0)}e.is=r})(Oc||(Oc={})),(function(e){function t(n,i){return{range:n,expression:i}}e.create=t;function r(n){const i=n;return i!=null&&le.is(i.range)&&(C.string(i.expression)||i.expression===void 0)}e.is=r})(Lc||(Lc={})),(function(e){function t(n,i){return{frameId:n,stoppedLocation:i}}e.create=t;function r(n){const i=n;return C.defined(i)&&le.is(n.stoppedLocation)}e.is=r})(Mc||(Mc={})),(function(e){e.Type=1,e.Parameter=2;function t(r){return r===1||r===2}e.is=t})(ao||(ao={})),(function(e){function t(n){return{value:n}}e.create=t;function r(n){const i=n;return C.objectLiteral(i)&&(i.tooltip===void 0||C.string(i.tooltip)||En.is(i.tooltip))&&(i.location===void 0||Ui.is(i.location))&&(i.command===void 0||Jr.is(i.command))}e.is=r})(oo||(oo={})),(function(e){function t(n,i,s){const a={position:n,label:i};return s!==void 0&&(a.kind=s),a}e.create=t;function r(n){const i=n;return C.objectLiteral(i)&&fe.is(i.position)&&(C.string(i.label)||C.typedArray(i.label,oo.is))&&(i.kind===void 0||ao.is(i.kind))&&i.textEdits===void 0||C.typedArray(i.textEdits,Ht.is)&&(i.tooltip===void 0||C.string(i.tooltip)||En.is(i.tooltip))&&(i.paddingLeft===void 0||C.boolean(i.paddingLeft))&&(i.paddingRight===void 0||C.boolean(i.paddingRight))}e.is=r})(Fc||(Fc={})),(function(e){function t(r){return{kind:"snippet",value:r}}e.createSnippet=t})(xc||(xc={})),(function(e){function t(r,n,i,s){return{insertText:r,filterText:n,range:i,command:s}}e.create=t})(qc||(qc={})),(function(e){function t(r){return{items:r}}e.create=t})(jc||(jc={})),(function(e){e.Invoked=0,e.Automatic=1})(Uc||(Uc={})),(function(e){function t(r,n){return{range:r,text:n}}e.create=t})(Wc||(Wc={})),(function(e){function t(r,n){return{triggerKind:r,selectedCompletionInfo:n}}e.create=t})(Bc||(Bc={})),(function(e){function t(r){const n=r;return C.objectLiteral(n)&&to.is(n.uri)&&C.string(n.name)}e.is=t})(Hc||(Hc={})),fg=[`
`,`\r
`,"\r"],(function(e){function t(s,a,o,l){return new Kh(s,a,o,l)}e.create=t;function r(s){let a=s;return!!(C.defined(a)&&C.string(a.uri)&&(C.undefined(a.languageId)||C.string(a.languageId))&&C.uinteger(a.lineCount)&&C.func(a.getText)&&C.func(a.positionAt)&&C.func(a.offsetAt))}e.is=r;function n(s,a){let o=s.getText(),l=i(a,(c,d)=>{let f=c.range.start.line-d.range.start.line;return f===0?c.range.start.character-d.range.start.character:f}),u=o.length;for(let c=l.length-1;c>=0;c--){let d=l[c],f=s.offsetAt(d.range.start),h=s.offsetAt(d.range.end);if(h<=u)o=o.substring(0,f)+d.newText+o.substring(h,o.length);else throw new Error("Overlapping edit");u=f}return o}e.applyEdits=n;function i(s,a){if(s.length<=1)return s;const o=s.length/2|0,l=s.slice(0,o),u=s.slice(o);i(l,a),i(u,a);let c=0,d=0,f=0;for(;c<l.length&&d<u.length;)a(l[c],u[d])<=0?s[f++]=l[c++]:s[f++]=u[d++];for(;c<l.length;)s[f++]=l[c++];for(;d<u.length;)s[f++]=u[d++];return s}})(Kc||(Kc={})),Kh=class{constructor(e,t,r,n){this._uri=e,this._languageId=t,this._version=r,this._content=n,this._lineOffsets=void 0}get uri(){return this._uri}get languageId(){return this._languageId}get version(){return this._version}getText(e){if(e){let t=this.offsetAt(e.start),r=this.offsetAt(e.end);return this._content.substring(t,r)}return this._content}update(e,t){this._content=e.text,this._version=t,this._lineOffsets=void 0}getLineOffsets(){if(this._lineOffsets===void 0){let e=[],t=this._content,r=!0;for(let n=0;n<t.length;n++){r&&(e.push(n),r=!1);let i=t.charAt(n);r=i==="\r"||i===`
`,i==="\r"&&n+1<t.length&&t.charAt(n+1)===`
`&&n++}r&&t.length>0&&e.push(t.length),this._lineOffsets=e}return this._lineOffsets}positionAt(e){e=Math.max(Math.min(e,this._content.length),0);let t=this.getLineOffsets(),r=0,n=t.length;if(n===0)return fe.create(0,e);for(;r<n;){let s=Math.floor((r+n)/2);t[s]>e?n=s:r=s+1}let i=r-1;return fe.create(i,e-t[i])}offsetAt(e){let t=this.getLineOffsets();if(e.line>=t.length)return this._content.length;if(e.line<0)return 0;let r=t[e.line],n=e.line+1<t.length?t[e.line+1]:this._content.length;return Math.max(Math.min(r+e.character,n),r)}get lineCount(){return this.getLineOffsets().length}},(function(e){const t=Object.prototype.toString;function r(h){return typeof h<"u"}e.defined=r;function n(h){return typeof h>"u"}e.undefined=n;function i(h){return h===!0||h===!1}e.boolean=i;function s(h){return t.call(h)==="[object String]"}e.string=s;function a(h){return t.call(h)==="[object Number]"}e.number=a;function o(h,m,R){return t.call(h)==="[object Number]"&&m<=h&&h<=R}e.numberRange=o;function l(h){return t.call(h)==="[object Number]"&&-2147483648<=h&&h<=2147483647}e.integer=l;function u(h){return t.call(h)==="[object Number]"&&0<=h&&h<=2147483647}e.uinteger=u;function c(h){return t.call(h)==="[object Function]"}e.func=c;function d(h){return h!==null&&typeof h=="object"}e.objectLiteral=d;function f(h,m){return Array.isArray(h)&&h.every(m)}e.typedArray=f})(C||(C={}))}));yn();var Nk=class{constructor(){this.nodeStack=[]}get current(){var e;return(e=this.nodeStack[this.nodeStack.length-1])!==null&&e!==void 0?e:this.rootNode}buildRootNode(e){return this.rootNode=new mg(e),this.rootNode.root=this.rootNode,this.nodeStack=[this.rootNode],this.rootNode}buildCompositeNode(e){const t=new Zd;return t.grammarSource=e,t.root=this.rootNode,this.current.content.push(t),this.nodeStack.push(t),t}buildLeafNode(e,t){const r=new Gc(e.startOffset,e.image.length,Au(e),e.tokenType,!t);return r.grammarSource=t,r.root=this.rootNode,this.current.content.push(r),r}removeNode(e){const t=e.container;if(t){const r=t.content.indexOf(e);r>=0&&t.content.splice(r,1)}}addHiddenNodes(e){const t=[];for(const i of e){const s=new Gc(i.startOffset,i.image.length,Au(i),i.tokenType,!0);s.root=this.rootNode,t.push(s)}let r=this.current,n=!1;if(r.content.length>0){r.content.push(...t);return}for(;r.container;){const i=r.container.content.indexOf(r);if(i>0){r.container.content.splice(i,0,...t),n=!0;break}r=r.container}n||this.rootNode.content.unshift(...t)}construct(e){const t=this.current;typeof e.$type=="string"&&(this.current.astNode=e),e.$cstNode=t;const r=this.nodeStack.pop();r?.content.length===0&&this.removeNode(r)}},hg=class{get parent(){return this.container}get feature(){return this.grammarSource}get hidden(){return!1}get astNode(){var e,t;const r=typeof((e=this._astNode)===null||e===void 0?void 0:e.$type)=="string"?this._astNode:(t=this.container)===null||t===void 0?void 0:t.astNode;if(!r)throw new Error("This node has no associated AST element");return r}set astNode(e){this._astNode=e}get element(){return this.astNode}get text(){return this.root.fullText.substring(this.offset,this.end)}},Gc=class extends hg{get offset(){return this._offset}get length(){return this._length}get end(){return this._offset+this._length}get hidden(){return this._hidden}get tokenType(){return this._tokenType}get range(){return this._range}constructor(e,t,r,n,i=!1){super(),this._hidden=i,this._offset=e,this._tokenType=n,this._length=t,this._range=r}},Zd=class extends hg{constructor(){super(...arguments),this.content=new Pk(this)}get children(){return this.content}get offset(){var e,t;return(t=(e=this.firstNonHiddenNode)===null||e===void 0?void 0:e.offset)!==null&&t!==void 0?t:0}get length(){return this.end-this.offset}get end(){var e,t;return(t=(e=this.lastNonHiddenNode)===null||e===void 0?void 0:e.end)!==null&&t!==void 0?t:0}get range(){const e=this.firstNonHiddenNode,t=this.lastNonHiddenNode;if(e&&t){if(this._rangeCache===void 0){const{range:r}=e,{range:n}=t;this._rangeCache={start:r.start,end:n.end.line<r.start.line?r.start:n.end}}return this._rangeCache}else return{start:fe.create(0,0),end:fe.create(0,0)}}get firstNonHiddenNode(){for(const e of this.content)if(!e.hidden)return e;return this.content[0]}get lastNonHiddenNode(){for(let e=this.content.length-1;e>=0;e--){const t=this.content[e];if(!t.hidden)return t}return this.content[this.content.length-1]}},Pk=class pg extends Array{constructor(t){super(),this.parent=t,Object.setPrototypeOf(this,pg.prototype)}push(...t){return this.addParents(t),super.push(...t)}unshift(...t){return this.addParents(t),super.unshift(...t)}splice(t,r,...n){return this.addParents(n),super.splice(t,r,...n)}addParents(t){for(const r of t)r.container=this.parent}},mg=class extends Zd{get text(){return this._text.substring(this.offset,this.end)}get fullText(){return this._text}constructor(e){super(),this._text="",this._text=e??""}},zc=Symbol("Datatype");function du(e){return e.$type===zc}var Gh="​",gg=e=>e.endsWith(Gh)?e:e+Gh,yg=class{constructor(e){this._unorderedGroups=new Map,this.allRules=new Map,this.lexer=e.parser.Lexer;const t=this.lexer.definition,r=e.LanguageMetaData.mode==="production";this.wrapper=new Fk(t,Object.assign(Object.assign({},e.parser.ParserConfig),{skipValidations:r,errorMessageProvider:e.parser.ParserErrorMessageProvider}))}alternatives(e,t){this.wrapper.wrapOr(e,t)}optional(e,t){this.wrapper.wrapOption(e,t)}many(e,t){this.wrapper.wrapMany(e,t)}atLeastOne(e,t){this.wrapper.wrapAtLeastOne(e,t)}getRule(e){return this.allRules.get(e)}isRecording(){return this.wrapper.IS_RECORDING}get unorderedGroups(){return this._unorderedGroups}getRuleStack(){return this.wrapper.RULE_STACK}finalize(){this.wrapper.wrapSelfAnalysis()}},Dk=class extends yg{get current(){return this.stack[this.stack.length-1]}constructor(e){super(e),this.nodeBuilder=new Nk,this.stack=[],this.assignmentMap=new Map,this.linker=e.references.Linker,this.converter=e.parser.ValueConverter,this.astReflection=e.shared.AstReflection}rule(e,t){const r=this.computeRuleType(e),n=this.wrapper.DEFINE_RULE(gg(e.name),this.startImplementation(r,t).bind(this));return this.allRules.set(e.name,n),e.entry&&(this.mainRule=n),n}computeRuleType(e){if(!e.fragment){if(Sm(e))return zc;{const t=ra(e);return t??e.name}}}parse(e,t={}){this.nodeBuilder.buildRootNode(e);const r=this.lexerResult=this.lexer.tokenize(e);this.wrapper.input=r.tokens;const n=t.rule?this.allRules.get(t.rule):this.mainRule;if(!n)throw new Error(t.rule?`No rule found with name '${t.rule}'`:"No main rule available.");const i=n.call(this.wrapper,{});return this.nodeBuilder.addHiddenNodes(r.hidden),this.unorderedGroups.clear(),this.lexerResult=void 0,{value:i,lexerErrors:r.errors,lexerReport:r.report,parserErrors:this.wrapper.errors}}startImplementation(e,t){return r=>{const n=!this.isRecording()&&e!==void 0;if(n){const s={$type:e};this.stack.push(s),e===zc&&(s.value="")}let i;try{i=t(r)}catch{i=void 0}return i===void 0&&n&&(i=this.construct()),i}}extractHiddenTokens(e){const t=this.lexerResult.hidden;if(!t.length)return[];const r=e.startOffset;for(let n=0;n<t.length;n++)if(t[n].startOffset>r)return t.splice(0,n);return t.splice(0,t.length)}consume(e,t,r){const n=this.wrapper.wrapConsume(e,t);if(!this.isRecording()&&this.isValidToken(n)){const i=this.extractHiddenTokens(n);this.nodeBuilder.addHiddenNodes(i);const s=this.nodeBuilder.buildLeafNode(n,r),{assignment:a,isCrossRef:o}=this.getAssignment(r),l=this.current;if(a){const u=or(r)?n.image:this.converter.convert(n.image,s);this.assign(a.operator,a.feature,u,s,o)}else if(du(l)){let u=n.image;or(r)||(u=this.converter.convert(u,s).toString()),l.value+=u}}}isValidToken(e){return!e.isInsertedInRecovery&&!isNaN(e.startOffset)&&typeof e.endOffset=="number"&&!isNaN(e.endOffset)}subrule(e,t,r,n,i){let s;!this.isRecording()&&!r&&(s=this.nodeBuilder.buildCompositeNode(n));const a=this.wrapper.wrapSubrule(e,t,i);!this.isRecording()&&s&&s.length>0&&this.performSubruleAssignment(a,n,s)}performSubruleAssignment(e,t,r){const{assignment:n,isCrossRef:i}=this.getAssignment(t);if(n)this.assign(n.operator,n.feature,e,r,i);else if(!n){const s=this.current;if(du(s))s.value+=e.toString();else if(typeof e=="object"&&e){const a=this.assignWithoutOverride(e,s);this.stack.pop(),this.stack.push(a)}}}action(e,t){if(!this.isRecording()){let r=this.current;if(t.feature&&t.operator){r=this.construct(),this.nodeBuilder.removeNode(r.$cstNode),this.nodeBuilder.buildCompositeNode(t).content.push(r.$cstNode);const n={$type:e};this.stack.push(n),this.assign(t.operator,t.feature,r,r.$cstNode,!1)}else r.$type=e}}construct(){if(this.isRecording())return;const e=this.current;return RS(e),this.nodeBuilder.construct(e),this.stack.pop(),du(e)?this.converter.convert(e.value,e.$cstNode):(mm(this.astReflection,e),e)}getAssignment(e){if(!this.assignmentMap.has(e)){const t=Ur(e,ar);this.assignmentMap.set(e,{assignment:t,isCrossRef:t?ta(t.terminal):!1})}return this.assignmentMap.get(e)}assign(e,t,r,n,i){const s=this.current;let a;switch(i&&typeof r=="string"?a=this.linker.buildReference(s,t,n,r):a=r,e){case"=":s[t]=a;break;case"?=":s[t]=!0;break;case"+=":Array.isArray(s[t])||(s[t]=[]),s[t].push(a)}}assignWithoutOverride(e,t){for(const[n,i]of Object.entries(t)){const s=e[n];s===void 0?e[n]=i:Array.isArray(s)&&Array.isArray(i)&&(i.push(...s),e[n]=i)}const r=e.$cstNode;return r&&(r.astNode=void 0,e.$cstNode=void 0),e}get definitionErrors(){return this.wrapper.definitionErrors}},Ok=class{buildMismatchTokenMessage(e){return Nn.buildMismatchTokenMessage(e)}buildNotAllInputParsedMessage(e){return Nn.buildNotAllInputParsedMessage(e)}buildNoViableAltMessage(e){return Nn.buildNoViableAltMessage(e)}buildEarlyExitMessage(e){return Nn.buildEarlyExitMessage(e)}},vg=class extends Ok{buildMismatchTokenMessage({expected:e,actual:t}){return`Expecting ${e.LABEL?"`"+e.LABEL+"`":e.name.endsWith(":KW")?`keyword '${e.name.substring(0,e.name.length-3)}'`:`token of type '${e.name}'`} but found \`${t.image}\`.`}buildNotAllInputParsedMessage({firstRedundant:e}){return`Expecting end of file but found \`${e.image}\`.`}},Lk=class extends yg{constructor(){super(...arguments),this.tokens=[],this.elementStack=[],this.lastElementStack=[],this.nextTokenIndex=0,this.stackSize=0}action(){}construct(){}parse(e){return this.resetState(),this.tokens=this.lexer.tokenize(e,{mode:"partial"}).tokens,this.wrapper.input=[...this.tokens],this.mainRule.call(this.wrapper,{}),this.unorderedGroups.clear(),{tokens:this.tokens,elementStack:[...this.lastElementStack],tokenIndex:this.nextTokenIndex}}rule(e,t){const r=this.wrapper.DEFINE_RULE(gg(e.name),this.startImplementation(t).bind(this));return this.allRules.set(e.name,r),e.entry&&(this.mainRule=r),r}resetState(){this.elementStack=[],this.lastElementStack=[],this.nextTokenIndex=0,this.stackSize=0}startImplementation(e){return t=>{const r=this.keepStackSize();try{e(t)}finally{this.resetStackSize(r)}}}removeUnexpectedElements(){this.elementStack.splice(this.stackSize)}keepStackSize(){const e=this.elementStack.length;return this.stackSize=e,e}resetStackSize(e){this.removeUnexpectedElements(),this.stackSize=e}consume(e,t,r){this.wrapper.wrapConsume(e,t),this.isRecording()||(this.lastElementStack=[...this.elementStack,r],this.nextTokenIndex=this.currIdx+1)}subrule(e,t,r,n,i){this.before(n),this.wrapper.wrapSubrule(e,t,i),this.after(n)}before(e){this.isRecording()||this.elementStack.push(e)}after(e){if(!this.isRecording()){const t=this.elementStack.lastIndexOf(e);t>=0&&this.elementStack.splice(t)}}get currIdx(){return this.wrapper.currIdx}},Mk={recoveryEnabled:!0,nodeLocationTracking:"full",skipValidations:!0,errorMessageProvider:new vg},Fk=class extends Y0{constructor(e,t){const r=t&&"maxLookahead"in t;super(e,Object.assign(Object.assign(Object.assign({},Mk),{lookaheadStrategy:r?new Kd({maxLookahead:t.maxLookahead}):new dk({logging:t.skipValidations?()=>{}:void 0})}),t))}get IS_RECORDING(){return this.RECORDING_PHASE}DEFINE_RULE(e,t){return this.RULE(e,t)}wrapSelfAnalysis(){this.performSelfAnalysis()}wrapConsume(e,t){return this.consume(e,t)}wrapSubrule(e,t,r){return this.subrule(e,t,{ARGS:[r]})}wrapOr(e,t){this.or(e,t)}wrapOption(e,t){this.option(e,t)}wrapMany(e,t){this.many(e,t)}wrapAtLeastOne(e,t){this.atLeastOne(e,t)}};function Tg(e,t,r){return xk({parser:t,tokens:r,ruleNames:new Map},e),t}function xk(e,t){const r=vm(t,!1),n=Me(t.rules).filter(dt).filter(i=>r.has(i));for(const i of n){const s=Object.assign(Object.assign({},e),{consume:1,optional:1,subrule:1,many:1,or:1});e.parser.rule(i,cn(s,i.definition))}}function cn(e,t,r=!1){let n;if(or(t))n=Kk(e,t);else if(ea(t))n=qk(e,t);else if(ar(t))n=cn(e,t.terminal);else if(ta(t))n=Rg(e,t);else if($r(t))n=jk(e,t);else if(Fd(t))n=Wk(e,t);else if(xd(t))n=Bk(e,t);else if(ln(t))n=Hk(e,t);else if(hS(t)){const i=e.consume++;n=()=>e.parser.consume(i,Hr,t)}else throw new om(t.$cstNode,`Unexpected element type: ${t.$type}`);return wg(e,r?void 0:Zo(t),n,t.cardinality)}function qk(e,t){const r=kl(t);return()=>e.parser.action(r,t)}function jk(e,t){const r=t.rule.ref;if(dt(r)){const n=e.subrule++,i=r.fragment,s=t.arguments.length>0?Uk(r,t.arguments):()=>({});return a=>e.parser.subrule(n,Cg(e,r),i,t,s(a))}else if(zr(r)){const n=e.consume++,i=Vc(e,r.name);return()=>e.parser.consume(n,i,t)}else if(r)Zs(r);else throw new om(t.$cstNode,`Undefined rule: ${t.rule.$refText}`)}function Uk(e,t){const r=t.map(n=>_r(n.value));return n=>{const i={};for(let s=0;s<r.length;s++){const a=e.parameters[s],o=r[s];i[a.name]=o(n)}return i}}function _r(e){if(oS(e)){const t=_r(e.left),r=_r(e.right);return n=>t(n)||r(n)}else if(aS(e)){const t=_r(e.left),r=_r(e.right);return n=>t(n)&&r(n)}else if(lS(e)){const t=_r(e.value);return r=>!t(r)}else if(uS(e)){const t=e.parameter.ref.name;return r=>r!==void 0&&r[t]===!0}else if(sS(e)){const t=!!e.true;return()=>t}Zs(e)}function Wk(e,t){if(t.elements.length===1)return cn(e,t.elements[0]);{const r=[];for(const i of t.elements){const s={ALT:cn(e,i,!0)},a=Zo(i);a&&(s.GATE=_r(a)),r.push(s)}const n=e.or++;return i=>e.parser.alternatives(n,r.map(s=>{const a={ALT:()=>s.ALT(i)},o=s.GATE;return o&&(a.GATE=()=>o(i)),a}))}}function Bk(e,t){if(t.elements.length===1)return cn(e,t.elements[0]);const r=[];for(const o of t.elements){const l={ALT:cn(e,o,!0)},u=Zo(o);u&&(l.GATE=_r(u)),r.push(l)}const n=e.or++,i=(o,l)=>`uGroup_${o}_${l.getRuleStack().join("-")}`,s=o=>e.parser.alternatives(n,r.map((l,u)=>{const c={ALT:()=>!0},d=e.parser;c.ALT=()=>{if(l.ALT(o),!d.isRecording()){const h=i(n,d);d.unorderedGroups.get(h)||d.unorderedGroups.set(h,[]);const m=d.unorderedGroups.get(h);typeof m?.[u]>"u"&&(m[u]=!0)}};const f=l.GATE;return f?c.GATE=()=>f(o):c.GATE=()=>{const h=d.unorderedGroups.get(i(n,d));return!h?.[u]},c})),a=wg(e,Zo(t),s,"*");return o=>{a(o),e.parser.isRecording()||e.parser.unorderedGroups.delete(i(n,e.parser))}}function Hk(e,t){const r=t.elements.map(n=>cn(e,n));return n=>r.forEach(i=>i(n))}function Zo(e){if(ln(e))return e.guardCondition}function Rg(e,t,r=t.terminal){if(r)if($r(r)&&dt(r.rule.ref)){const n=r.rule.ref,i=e.subrule++;return s=>e.parser.subrule(i,Cg(e,n),!1,t,s)}else if($r(r)&&zr(r.rule.ref)){const n=e.consume++,i=Vc(e,r.rule.ref.name);return()=>e.parser.consume(n,i,t)}else if(or(r)){const n=e.consume++,i=Vc(e,r.value);return()=>e.parser.consume(n,i,t)}else throw new Error("Could not build cross reference parser");else{if(!t.type.ref)throw new Error("Could not resolve reference to type: "+t.type.$refText);const n=Cm(t.type.ref),i=n?.terminal;if(!i)throw new Error("Could not find name assignment for type: "+kl(t.type.ref));return Rg(e,t,i)}}function Kk(e,t){const r=e.consume++,n=e.tokens[t.value];if(!n)throw new Error("Could not find token for keyword: "+t.value);return()=>e.parser.consume(r,n,t)}function wg(e,t,r,n){const i=t&&_r(t);if(!n)if(i){const s=e.or++;return a=>e.parser.alternatives(s,[{ALT:()=>r(a),GATE:()=>i(a)},{ALT:Uh(),GATE:()=>!i(a)}])}else return r;if(n==="*"){const s=e.many++;return a=>e.parser.many(s,{DEF:()=>r(a),GATE:i?()=>i(a):void 0})}else if(n==="+"){const s=e.many++;if(i){const a=e.or++;return o=>e.parser.alternatives(a,[{ALT:()=>e.parser.atLeastOne(s,{DEF:()=>r(o)}),GATE:()=>i(o)},{ALT:Uh(),GATE:()=>!i(o)}])}else return a=>e.parser.atLeastOne(s,{DEF:()=>r(a)})}else if(n==="?"){const s=e.optional++;return a=>e.parser.optional(s,{DEF:()=>r(a),GATE:i?()=>i(a):void 0})}else Zs(n)}function Cg(e,t){const r=Gk(e,t),n=e.parser.getRule(r);if(!n)throw new Error(`Rule "${r}" not found."`);return n}function Gk(e,t){if(dt(t))return t.name;if(e.ruleNames.has(t))return e.ruleNames.get(t);{let r=t,n=r.$container,i=t.$type;for(;!dt(n);)(ln(n)||Fd(n)||xd(n))&&(i=n.elements.indexOf(r).toString()+":"+i),r=n,n=n.$container;return i=n.name+":"+i,e.ruleNames.set(t,i),i}}function Vc(e,t){const r=e.tokens[t];if(!r)throw new Error(`Token "${t}" not found."`);return r}function zk(e){const t=e.Grammar,r=e.parser.Lexer,n=new Lk(e);return Tg(t,n,r.definition),n.finalize(),n}function Vk(e){const t=Yk(e);return t.finalize(),t}function Yk(e){const t=e.Grammar,r=e.parser.Lexer;return Tg(t,new Dk(e),r.definition)}var Xk=class{constructor(){this.diagnostics=[]}buildTokens(e,t){const r=Me(vm(e,!1)),n=this.buildTerminalTokens(r),i=this.buildKeywordTokens(r,n,t);return n.forEach(s=>{const a=s.PATTERN;typeof a=="object"&&a&&"test"in a&&Du(a)?i.unshift(s):i.push(s)}),i}flushLexingReport(e){return{diagnostics:this.popDiagnostics()}}popDiagnostics(){const e=[...this.diagnostics];return this.diagnostics=[],e}buildTerminalTokens(e){return e.filter(zr).filter(t=>!t.fragment).map(t=>this.buildTerminalToken(t)).toArray()}buildTerminalToken(e){const t=$l(e),r=this.requiresCustomPattern(t)?this.regexPatternFunction(t):t,n={name:e.name,PATTERN:r};return typeof r=="function"&&(n.LINE_BREAKS=!0),e.hidden&&(n.GROUP=Du(t)?wt.SKIPPED:"hidden"),n}requiresCustomPattern(e){return e.flags.includes("u")||e.flags.includes("s")?!0:!!(e.source.includes("?<=")||e.source.includes("?<!"))}regexPatternFunction(e){const t=new RegExp(e,e.flags+"y");return(r,n)=>(t.lastIndex=n,t.exec(r))}buildKeywordTokens(e,t,r){return e.filter(dt).flatMap(n=>zn(n).filter(or)).distinct(n=>n.value).toArray().sort((n,i)=>i.value.length-n.value.length).map(n=>this.buildKeywordToken(n,t,!!r?.caseInsensitive))}buildKeywordToken(e,t,r){const n=this.buildKeywordPattern(e,r),i={name:e.value,PATTERN:n,LONGER_ALT:this.findLongerAlt(e,t)};return typeof n=="function"&&(i.LINE_BREAKS=!0),i}buildKeywordPattern(e,t){return t?new RegExp(ES(e.value)):e.value}findLongerAlt(e,t){return t.reduce((r,n)=>{const i=n?.PATTERN;return i?.source&&AS("^"+i.source+"$",e.value)&&r.push(n),r},[])}},Qk=class{convert(e,t){let r=t.grammarSource;if(ta(r)&&(r=Rm(r)),$r(r)){const n=r.rule.ref;if(!n)throw new Error("This cst node was not parsed by a rule.");return this.runConverter(n,e,t)}return e}runConverter(e,t,r){var n;switch(e.name.toUpperCase()){case"INT":return wr.convertInt(t);case"STRING":return wr.convertString(t);case"ID":return wr.convertID(t)}switch((n=qS(e))===null||n===void 0?void 0:n.toLowerCase()){case"number":return wr.convertNumber(t);case"boolean":return wr.convertBoolean(t);case"bigint":return wr.convertBigint(t);case"date":return wr.convertDate(t);default:return t}}},wr;(function(e){function t(u){let c="";for(let d=1;d<u.length-1;d++){const f=u.charAt(d);if(f==="\\"){const h=u.charAt(++d);c+=r(h)}else c+=f}return c}e.convertString=t;function r(u){switch(u){case"b":return"\b";case"f":return"\f";case"n":return`
`;case"r":return"\r";case"t":return"	";case"v":return"\v";case"0":return"\0";default:return u}}function n(u){return u.charAt(0)==="^"?u.substring(1):u}e.convertID=n;function i(u){return parseInt(u)}e.convertInt=i;function s(u){return BigInt(u)}e.convertBigint=s;function a(u){return new Date(u)}e.convertDate=a;function o(u){return Number(u)}e.convertNumber=o;function l(u){return u.toLowerCase()==="true"}e.convertBoolean=l})(wr||(wr={}));var vn=H((e=>{Object.defineProperty(e,"__esModule",{value:!0});var t;function r(){if(t===void 0)throw new Error("No runtime abstraction layer installed");return t}(function(n){function i(s){if(s===void 0)throw new Error("No runtime abstraction layer provided");t=s}n.install=i})(r||(r={})),e.default=r})),aa=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.stringArray=e.array=e.func=e.error=e.number=e.string=e.boolean=void 0;function t(l){return l===!0||l===!1}e.boolean=t;function r(l){return typeof l=="string"||l instanceof String}e.string=r;function n(l){return typeof l=="number"||l instanceof Number}e.number=n;function i(l){return l instanceof Error}e.error=i;function s(l){return typeof l=="function"}e.func=s;function a(l){return Array.isArray(l)}e.array=a;function o(l){return a(l)&&l.every(u=>r(u))}e.stringArray=o})),Jn=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Emitter=e.Event=void 0;var t=vn(),r;(function(s){const a={dispose(){}};s.None=function(){return a}})(r||(e.Event=r={}));var n=class{add(s,a=null,o){this._callbacks||(this._callbacks=[],this._contexts=[]),this._callbacks.push(s),this._contexts.push(a),Array.isArray(o)&&o.push({dispose:()=>this.remove(s,a)})}remove(s,a=null){if(!this._callbacks)return;let o=!1;for(let l=0,u=this._callbacks.length;l<u;l++)if(this._callbacks[l]===s)if(this._contexts[l]===a){this._callbacks.splice(l,1),this._contexts.splice(l,1);return}else o=!0;if(o)throw new Error("When adding a listener with a context, you should remove it with the same context")}invoke(...s){if(!this._callbacks)return[];const a=[],o=this._callbacks.slice(0),l=this._contexts.slice(0);for(let u=0,c=o.length;u<c;u++)try{a.push(o[u].apply(l[u],s))}catch(d){(0,t.default)().console.error(d)}return a}isEmpty(){return!this._callbacks||this._callbacks.length===0}dispose(){this._callbacks=void 0,this._contexts=void 0}},i=class _g{constructor(a){this._options=a}get event(){return this._event||(this._event=(a,o,l)=>{this._callbacks||(this._callbacks=new n),this._options&&this._options.onFirstListenerAdd&&this._callbacks.isEmpty()&&this._options.onFirstListenerAdd(this),this._callbacks.add(a,o);const u={dispose:()=>{this._callbacks&&(this._callbacks.remove(a,o),u.dispose=_g._noop,this._options&&this._options.onLastListenerRemove&&this._callbacks.isEmpty()&&this._options.onLastListenerRemove(this))}};return Array.isArray(l)&&l.push(u),u}),this._event}fire(a){this._callbacks&&this._callbacks.invoke.call(this._callbacks,a)}dispose(){this._callbacks&&(this._callbacks.dispose(),this._callbacks=void 0)}};e.Emitter=i,i._noop=function(){}})),Ll=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.CancellationTokenSource=e.CancellationToken=void 0;var t=vn(),r=aa(),n=Jn(),i;(function(l){l.None=Object.freeze({isCancellationRequested:!1,onCancellationRequested:n.Event.None}),l.Cancelled=Object.freeze({isCancellationRequested:!0,onCancellationRequested:n.Event.None});function u(c){const d=c;return d&&(d===l.None||d===l.Cancelled||r.boolean(d.isCancellationRequested)&&!!d.onCancellationRequested)}l.is=u})(i||(e.CancellationToken=i={}));var s=Object.freeze(function(l,u){const c=(0,t.default)().timer.setTimeout(l.bind(u),0);return{dispose(){c.dispose()}}}),a=class{constructor(){this._isCancelled=!1}cancel(){this._isCancelled||(this._isCancelled=!0,this._emitter&&(this._emitter.fire(void 0),this.dispose()))}get isCancellationRequested(){return this._isCancelled}get onCancellationRequested(){return this._isCancelled?s:(this._emitter||(this._emitter=new n.Emitter),this._emitter.event)}dispose(){this._emitter&&(this._emitter.dispose(),this._emitter=void 0)}},o=class{get token(){return this._token||(this._token=new a),this._token}cancel(){this._token?this._token.cancel():this._token=i.Cancelled}dispose(){this._token?this._token instanceof a&&this._token.dispose():this._token=i.None}};e.CancellationTokenSource=o})),Se=dl({});Cp(Se,Td(Ll(),1));function Jk(){return new Promise(e=>{typeof setImmediate>"u"?setTimeout(e,0):setImmediate(e)})}var lo=0,Zk=10;function e$(){return lo=performance.now(),new Se.CancellationTokenSource}var el=Symbol("OperationCancelled");function Ml(e){return e===el}async function Rt(e){if(e===Se.CancellationToken.None)return;const t=performance.now();if(t-lo>=Zk&&(lo=t,await Jk(),lo=performance.now()),e.isCancellationRequested)throw el}var ef=class{constructor(){this.promise=new Promise((e,t)=>{this.resolve=r=>(e(r),this),this.reject=r=>(t(r),this)})}},zh=class Yc{constructor(t,r,n,i){this._uri=t,this._languageId=r,this._version=n,this._content=i,this._lineOffsets=void 0}get uri(){return this._uri}get languageId(){return this._languageId}get version(){return this._version}getText(t){if(t){const r=this.offsetAt(t.start),n=this.offsetAt(t.end);return this._content.substring(r,n)}return this._content}update(t,r){for(let n of t)if(Yc.isIncremental(n)){const i=Sg(n.range),s=this.offsetAt(i.start),a=this.offsetAt(i.end);this._content=this._content.substring(0,s)+n.text+this._content.substring(a,this._content.length);const o=Math.max(i.start.line,0),l=Math.max(i.end.line,0);let u=this._lineOffsets;const c=Vh(n.text,!1,s);if(l-o===c.length)for(let f=0,h=c.length;f<h;f++)u[f+o+1]=c[f];else c.length<1e4?u.splice(o+1,l-o,...c):this._lineOffsets=u=u.slice(0,o+1).concat(c,u.slice(l+1));const d=n.text.length-(a-s);if(d!==0)for(let f=o+1+c.length,h=u.length;f<h;f++)u[f]=u[f]+d}else if(Yc.isFull(n))this._content=n.text,this._lineOffsets=void 0;else throw new Error("Unknown change event received");this._version=r}getLineOffsets(){return this._lineOffsets===void 0&&(this._lineOffsets=Vh(this._content,!0)),this._lineOffsets}positionAt(t){t=Math.max(Math.min(t,this._content.length),0);let r=this.getLineOffsets(),n=0,i=r.length;if(i===0)return{line:0,character:t};for(;n<i;){let a=Math.floor((n+i)/2);r[a]>t?i=a:n=a+1}let s=n-1;return{line:s,character:t-r[s]}}offsetAt(t){let r=this.getLineOffsets();if(t.line>=r.length)return this._content.length;if(t.line<0)return 0;let n=r[t.line],i=t.line+1<r.length?r[t.line+1]:this._content.length;return Math.max(Math.min(n+t.character,i),n)}get lineCount(){return this.getLineOffsets().length}static isIncremental(t){let r=t;return r!=null&&typeof r.text=="string"&&r.range!==void 0&&(r.rangeLength===void 0||typeof r.rangeLength=="number")}static isFull(t){let r=t;return r!=null&&typeof r.text=="string"&&r.range===void 0&&r.rangeLength===void 0}},tl;(function(e){function t(i,s,a,o){return new zh(i,s,a,o)}e.create=t;function r(i,s,a){if(i instanceof zh)return i.update(s,a),i;throw new Error("TextDocument.update: document must be created by TextDocument.create")}e.update=r;function n(i,s){let a=i.getText(),o=Xc(s.map(t$),(c,d)=>{let f=c.range.start.line-d.range.start.line;return f===0?c.range.start.character-d.range.start.character:f}),l=0;const u=[];for(const c of o){let d=i.offsetAt(c.range.start);if(d<l)throw new Error("Overlapping edit");d>l&&u.push(a.substring(l,d)),c.newText.length&&u.push(c.newText),l=i.offsetAt(c.range.end)}return u.push(a.substr(l)),u.join("")}e.applyEdits=n})(tl||(tl={}));function Xc(e,t){if(e.length<=1)return e;const r=e.length/2|0,n=e.slice(0,r),i=e.slice(r);Xc(n,t),Xc(i,t);let s=0,a=0,o=0;for(;s<n.length&&a<i.length;)t(n[s],i[a])<=0?e[o++]=n[s++]:e[o++]=i[a++];for(;s<n.length;)e[o++]=n[s++];for(;a<i.length;)e[o++]=i[a++];return e}function Vh(e,t,r=0){const n=t?[r]:[];for(let i=0;i<e.length;i++){let s=e.charCodeAt(i);(s===13||s===10)&&(s===13&&i+1<e.length&&e.charCodeAt(i+1)===10&&i++,n.push(r+i+1))}return n}function Sg(e){const t=e.start,r=e.end;return t.line>r.line||t.line===r.line&&t.character>r.character?{start:r,end:t}:e}function t$(e){const t=Sg(e.range);return t!==e.range?{newText:e.newText,range:t}:e}var bg;(()=>{"use strict";var e={470:i=>{function s(l){if(typeof l!="string")throw new TypeError("Path must be a string. Received "+JSON.stringify(l))}function a(l,u){for(var c,d="",f=0,h=-1,m=0,R=0;R<=l.length;++R){if(R<l.length)c=l.charCodeAt(R);else{if(c===47)break;c=47}if(c===47){if(!(h===R-1||m===1))if(h!==R-1&&m===2){if(d.length<2||f!==2||d.charCodeAt(d.length-1)!==46||d.charCodeAt(d.length-2)!==46){if(d.length>2){var S=d.lastIndexOf("/");if(S!==d.length-1){S===-1?(d="",f=0):f=(d=d.slice(0,S)).length-1-d.lastIndexOf("/"),h=R,m=0;continue}}else if(d.length===2||d.length===1){d="",f=0,h=R,m=0;continue}}u&&(d.length>0?d+="/..":d="..",f=2)}else d.length>0?d+="/"+l.slice(h+1,R):d=l.slice(h+1,R),f=R-h-1;h=R,m=0}else c===46&&m!==-1?++m:m=-1}return d}var o={resolve:function(){for(var l,u="",c=!1,d=arguments.length-1;d>=-1&&!c;d--){var f;d>=0?f=arguments[d]:(l===void 0&&(l=process.cwd()),f=l),s(f),f.length!==0&&(u=f+"/"+u,c=f.charCodeAt(0)===47)}return u=a(u,!c),c?u.length>0?"/"+u:"/":u.length>0?u:"."},normalize:function(l){if(s(l),l.length===0)return".";var u=l.charCodeAt(0)===47,c=l.charCodeAt(l.length-1)===47;return(l=a(l,!u)).length!==0||u||(l="."),l.length>0&&c&&(l+="/"),u?"/"+l:l},isAbsolute:function(l){return s(l),l.length>0&&l.charCodeAt(0)===47},join:function(){if(arguments.length===0)return".";for(var l,u=0;u<arguments.length;++u){var c=arguments[u];s(c),c.length>0&&(l===void 0?l=c:l+="/"+c)}return l===void 0?".":o.normalize(l)},relative:function(l,u){if(s(l),s(u),l===u||(l=o.resolve(l))===(u=o.resolve(u)))return"";for(var c=1;c<l.length&&l.charCodeAt(c)===47;++c);for(var d=l.length,f=d-c,h=1;h<u.length&&u.charCodeAt(h)===47;++h);for(var m=u.length-h,R=f<m?f:m,S=-1,v=0;v<=R;++v){if(v===R){if(m>R){if(u.charCodeAt(h+v)===47)return u.slice(h+v+1);if(v===0)return u.slice(h+v)}else f>R&&(l.charCodeAt(c+v)===47?S=v:v===0&&(S=0));break}var _=l.charCodeAt(c+v);if(_!==u.charCodeAt(h+v))break;_===47&&(S=v)}var T="";for(v=c+S+1;v<=d;++v)v!==d&&l.charCodeAt(v)!==47||(T.length===0?T+="..":T+="/..");return T.length>0?T+u.slice(h+S):(h+=S,u.charCodeAt(h)===47&&++h,u.slice(h))},_makeLong:function(l){return l},dirname:function(l){if(s(l),l.length===0)return".";for(var u=l.charCodeAt(0),c=u===47,d=-1,f=!0,h=l.length-1;h>=1;--h)if((u=l.charCodeAt(h))===47){if(!f){d=h;break}}else f=!1;return d===-1?c?"/":".":c&&d===1?"//":l.slice(0,d)},basename:function(l,u){if(u!==void 0&&typeof u!="string")throw new TypeError('"ext" argument must be a string');s(l);var c,d=0,f=-1,h=!0;if(u!==void 0&&u.length>0&&u.length<=l.length){if(u.length===l.length&&u===l)return"";var m=u.length-1,R=-1;for(c=l.length-1;c>=0;--c){var S=l.charCodeAt(c);if(S===47){if(!h){d=c+1;break}}else R===-1&&(h=!1,R=c+1),m>=0&&(S===u.charCodeAt(m)?--m==-1&&(f=c):(m=-1,f=R))}return d===f?f=R:f===-1&&(f=l.length),l.slice(d,f)}for(c=l.length-1;c>=0;--c)if(l.charCodeAt(c)===47){if(!h){d=c+1;break}}else f===-1&&(h=!1,f=c+1);return f===-1?"":l.slice(d,f)},extname:function(l){s(l);for(var u=-1,c=0,d=-1,f=!0,h=0,m=l.length-1;m>=0;--m){var R=l.charCodeAt(m);if(R!==47)d===-1&&(f=!1,d=m+1),R===46?u===-1?u=m:h!==1&&(h=1):u!==-1&&(h=-1);else if(!f){c=m+1;break}}return u===-1||d===-1||h===0||h===1&&u===d-1&&u===c+1?"":l.slice(u,d)},format:function(l){if(l===null||typeof l!="object")throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof l);return(function(u,c){var d=c.dir||c.root,f=c.base||(c.name||"")+(c.ext||"");return d?d===c.root?d+f:d+"/"+f:f})(0,l)},parse:function(l){s(l);var u={root:"",dir:"",base:"",ext:"",name:""};if(l.length===0)return u;var c,d=l.charCodeAt(0),f=d===47;f?(u.root="/",c=1):c=0;for(var h=-1,m=0,R=-1,S=!0,v=l.length-1,_=0;v>=c;--v)if((d=l.charCodeAt(v))!==47)R===-1&&(S=!1,R=v+1),d===46?h===-1?h=v:_!==1&&(_=1):h!==-1&&(_=-1);else if(!S){m=v+1;break}return h===-1||R===-1||_===0||_===1&&h===R-1&&h===m+1?R!==-1&&(u.base=u.name=m===0&&f?l.slice(1,R):l.slice(m,R)):(m===0&&f?(u.name=l.slice(1,h),u.base=l.slice(1,R)):(u.name=l.slice(m,h),u.base=l.slice(m,R)),u.ext=l.slice(h,R)),m>0?u.dir=l.slice(0,m-1):f&&(u.dir="/"),u},sep:"/",delimiter:":",win32:null,posix:null};o.posix=o,i.exports=o}},t={};function r(i){var s=t[i];if(s!==void 0)return s.exports;var a=t[i]={exports:{}};return e[i](a,a.exports,r),a.exports}r.d=(i,s)=>{for(var a in s)r.o(s,a)&&!r.o(i,a)&&Object.defineProperty(i,a,{enumerable:!0,get:s[a]})},r.o=(i,s)=>Object.prototype.hasOwnProperty.call(i,s),r.r=i=>{typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(i,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(i,"__esModule",{value:!0})};var n={};(()=>{let i;r.r(n),r.d(n,{URI:()=>f,Utils:()=>he}),typeof process=="object"?i=process.platform==="win32":typeof navigator=="object"&&(i=navigator.userAgent.indexOf("Windows")>=0);const s=/^\w[\w\d+.-]*$/,a=/^\//,o=/^\/\//;function l(x,A){if(!x.scheme&&A)throw new Error(`[UriError]: Scheme is missing: {scheme: "", authority: "${x.authority}", path: "${x.path}", query: "${x.query}", fragment: "${x.fragment}"}`);if(x.scheme&&!s.test(x.scheme))throw new Error("[UriError]: Scheme contains illegal characters.");if(x.path){if(x.authority){if(!a.test(x.path))throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character')}else if(o.test(x.path))throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")')}}const u="",c="/",d=/^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;class f{static isUri(A){return A instanceof f||!!A&&typeof A.authority=="string"&&typeof A.fragment=="string"&&typeof A.path=="string"&&typeof A.query=="string"&&typeof A.scheme=="string"&&typeof A.fsPath=="string"&&typeof A.with=="function"&&typeof A.toString=="function"}scheme;authority;path;query;fragment;constructor(A,y,b,q,O,$=!1){typeof A=="object"?(this.scheme=A.scheme||u,this.authority=A.authority||u,this.path=A.path||u,this.query=A.query||u,this.fragment=A.fragment||u):(this.scheme=(function(k,ie){return k||ie?k:"file"})(A,$),this.authority=y||u,this.path=(function(k,ie){switch(k){case"https":case"http":case"file":ie?ie[0]!==c&&(ie=c+ie):ie=c}return ie})(this.scheme,b||u),this.query=q||u,this.fragment=O||u,l(this,$))}get fsPath(){return _(this,!1)}with(A){if(!A)return this;let{scheme:y,authority:b,path:q,query:O,fragment:$}=A;return y===void 0?y=this.scheme:y===null&&(y=u),b===void 0?b=this.authority:b===null&&(b=u),q===void 0?q=this.path:q===null&&(q=u),O===void 0?O=this.query:O===null&&(O=u),$===void 0?$=this.fragment:$===null&&($=u),y===this.scheme&&b===this.authority&&q===this.path&&O===this.query&&$===this.fragment?this:new m(y,b,q,O,$)}static parse(A,y=!1){const b=d.exec(A);return b?new m(b[2]||u,W(b[4]||u),W(b[5]||u),W(b[7]||u),W(b[9]||u),y):new m(u,u,u,u,u)}static file(A){let y=u;if(i&&(A=A.replace(/\\/g,c)),A[0]===c&&A[1]===c){const b=A.indexOf(c,2);b===-1?(y=A.substring(2),A=c):(y=A.substring(2,b),A=A.substring(b)||c)}return new m("file",y,A,u,u)}static from(A){const y=new m(A.scheme,A.authority,A.path,A.query,A.fragment);return l(y,!0),y}toString(A=!1){return T(this,A)}toJSON(){return this}static revive(A){if(A){if(A instanceof f)return A;{const y=new m(A);return y._formatted=A.external,y._fsPath=A._sep===h?A.fsPath:null,y}}return A}}const h=i?1:void 0;class m extends f{_formatted=null;_fsPath=null;get fsPath(){return this._fsPath||(this._fsPath=_(this,!1)),this._fsPath}toString(A=!1){return A?T(this,!0):(this._formatted||(this._formatted=T(this,!1)),this._formatted)}toJSON(){const A={$mid:1};return this._fsPath&&(A.fsPath=this._fsPath,A._sep=h),this._formatted&&(A.external=this._formatted),this.path&&(A.path=this.path),this.scheme&&(A.scheme=this.scheme),this.authority&&(A.authority=this.authority),this.query&&(A.query=this.query),this.fragment&&(A.fragment=this.fragment),A}}const R={58:"%3A",47:"%2F",63:"%3F",35:"%23",91:"%5B",93:"%5D",64:"%40",33:"%21",36:"%24",38:"%26",39:"%27",40:"%28",41:"%29",42:"%2A",43:"%2B",44:"%2C",59:"%3B",61:"%3D",32:"%20"};function S(x,A,y){let b,q=-1;for(let O=0;O<x.length;O++){const $=x.charCodeAt(O);if($>=97&&$<=122||$>=65&&$<=90||$>=48&&$<=57||$===45||$===46||$===95||$===126||A&&$===47||y&&$===91||y&&$===93||y&&$===58)q!==-1&&(b+=encodeURIComponent(x.substring(q,O)),q=-1),b!==void 0&&(b+=x.charAt(O));else{b===void 0&&(b=x.substr(0,O));const k=R[$];k!==void 0?(q!==-1&&(b+=encodeURIComponent(x.substring(q,O)),q=-1),b+=k):q===-1&&(q=O)}}return q!==-1&&(b+=encodeURIComponent(x.substring(q))),b!==void 0?b:x}function v(x){let A;for(let y=0;y<x.length;y++){const b=x.charCodeAt(y);b===35||b===63?(A===void 0&&(A=x.substr(0,y)),A+=R[b]):A!==void 0&&(A+=x[y])}return A!==void 0?A:x}function _(x,A){let y;return y=x.authority&&x.path.length>1&&x.scheme==="file"?`//${x.authority}${x.path}`:x.path.charCodeAt(0)===47&&(x.path.charCodeAt(1)>=65&&x.path.charCodeAt(1)<=90||x.path.charCodeAt(1)>=97&&x.path.charCodeAt(1)<=122)&&x.path.charCodeAt(2)===58?A?x.path.substr(1):x.path[1].toLowerCase()+x.path.substr(2):x.path,i&&(y=y.replace(/\//g,"\\")),y}function T(x,A){const y=A?v:S;let b="",{scheme:q,authority:O,path:$,query:k,fragment:ie}=x;if(q&&(b+=q,b+=":"),(O||q==="file")&&(b+=c,b+=c),O){let de=O.indexOf("@");if(de!==-1){const Ge=O.substr(0,de);O=O.substr(de+1),de=Ge.lastIndexOf(":"),de===-1?b+=y(Ge,!1,!1):(b+=y(Ge.substr(0,de),!1,!1),b+=":",b+=y(Ge.substr(de+1),!1,!0)),b+="@"}O=O.toLowerCase(),de=O.lastIndexOf(":"),de===-1?b+=y(O,!1,!0):(b+=y(O.substr(0,de),!1,!0),b+=O.substr(de))}if($){if($.length>=3&&$.charCodeAt(0)===47&&$.charCodeAt(2)===58){const de=$.charCodeAt(1);de>=65&&de<=90&&($=`/${String.fromCharCode(de+32)}:${$.substr(3)}`)}else if($.length>=2&&$.charCodeAt(1)===58){const de=$.charCodeAt(0);de>=65&&de<=90&&($=`${String.fromCharCode(de+32)}:${$.substr(2)}`)}b+=y($,!0,!1)}return k&&(b+="?",b+=y(k,!1,!1)),ie&&(b+="#",b+=A?ie:S(ie,!1,!1)),b}function M(x){try{return decodeURIComponent(x)}catch{return x.length>3?x.substr(0,3)+M(x.substr(3)):x}}const F=/(%[0-9A-Za-z][0-9A-Za-z])+/g;function W(x){return x.match(F)?x.replace(F,(A=>M(A))):x}var U=r(470);const ee=U.posix||U,se="/";var he;(function(x){x.joinPath=function(A,...y){return A.with({path:ee.join(A.path,...y)})},x.resolvePath=function(A,...y){let b=A.path,q=!1;b[0]!==se&&(b=se+b,q=!0);let O=ee.resolve(b,...y);return q&&O[0]===se&&!A.authority&&(O=O.substring(1)),A.with({path:O})},x.dirname=function(A){if(A.path.length===0||A.path===se)return A;let y=ee.dirname(A.path);return y.length===1&&y.charCodeAt(0)===46&&(y=""),A.with({path:y})},x.basename=function(A){return ee.basename(A.path)},x.extname=function(A){return ee.extname(A.path)}})(he||(he={}))})(),bg=n})();var{URI:It,Utils:li}=bg,Ae;(function(e){e.basename=li.basename,e.dirname=li.dirname,e.extname=li.extname,e.joinPath=li.joinPath,e.resolvePath=li.resolvePath;const t=typeof process=="object"&&(process==null?void 0:process.platform)==="win32";function r(s,a){return s?.toString()===a?.toString()}e.equals=r;function n(s,a){const o=typeof s=="string"?It.parse(s).path:s.path,l=typeof a=="string"?It.parse(a).path:a.path,u=o.split("/").filter(f=>f.length>0),c=l.split("/").filter(f=>f.length>0);if(t){const f=/^[A-Z]:$/;if(u[0]&&f.test(u[0])&&(u[0]=u[0].toLowerCase()),c[0]&&f.test(c[0])&&(c[0]=c[0].toLowerCase()),u[0]!==c[0])return l.substring(1)}let d=0;for(;d<u.length&&u[d]===c[d];d++);return"../".repeat(u.length-d)+c.slice(d).join("/")}e.relative=n;function i(s){return It.parse(s.toString()).toString()}e.normalize=i})(Ae||(Ae={}));var Ee;(function(e){e[e.Changed=0]="Changed",e[e.Parsed=1]="Parsed",e[e.IndexedContent=2]="IndexedContent",e[e.ComputedScopes=3]="ComputedScopes",e[e.Linked=4]="Linked",e[e.IndexedReferences=5]="IndexedReferences",e[e.Validated=6]="Validated"})(Ee||(Ee={}));var r$=class{constructor(e){this.serviceRegistry=e.ServiceRegistry,this.textDocuments=e.workspace.TextDocuments,this.fileSystemProvider=e.workspace.FileSystemProvider}async fromUri(e,t=Se.CancellationToken.None){const r=await this.fileSystemProvider.readFile(e);return this.createAsync(e,r,t)}fromTextDocument(e,t,r){return t=t??It.parse(e.uri),Se.CancellationToken.is(r)?this.createAsync(t,e,r):this.create(t,e,r)}fromString(e,t,r){return Se.CancellationToken.is(r)?this.createAsync(t,e,r):this.create(t,e,r)}fromModel(e,t){return this.create(t,{$model:e})}create(e,t,r){if(typeof t=="string"){const n=this.parse(e,t,r);return this.createLangiumDocument(n,e,void 0,t)}else if("$model"in t){const n={value:t.$model,parserErrors:[],lexerErrors:[]};return this.createLangiumDocument(n,e)}else{const n=this.parse(e,t.getText(),r);return this.createLangiumDocument(n,e,t)}}async createAsync(e,t,r){if(typeof t=="string"){const n=await this.parseAsync(e,t,r);return this.createLangiumDocument(n,e,void 0,t)}else{const n=await this.parseAsync(e,t.getText(),r);return this.createLangiumDocument(n,e,t)}}createLangiumDocument(e,t,r,n){let i;if(r)i={parseResult:e,uri:t,state:Ee.Parsed,references:[],textDocument:r};else{const s=this.createTextDocumentGetter(t,n);i={parseResult:e,uri:t,state:Ee.Parsed,references:[],get textDocument(){return s()}}}return e.value.$document=i,i}async update(e,t){var r,n;const i=(r=e.parseResult.value.$cstNode)===null||r===void 0?void 0:r.root.fullText,s=(n=this.textDocuments)===null||n===void 0?void 0:n.get(e.uri.toString()),a=s?s.getText():await this.fileSystemProvider.readFile(e.uri);if(s)Object.defineProperty(e,"textDocument",{value:s});else{const o=this.createTextDocumentGetter(e.uri,a);Object.defineProperty(e,"textDocument",{get:o})}return i!==a&&(e.parseResult=await this.parseAsync(e.uri,a,t),e.parseResult.value.$document=e),e.state=Ee.Parsed,e}parse(e,t,r){return this.serviceRegistry.getServices(e).parser.LangiumParser.parse(t,r)}parseAsync(e,t,r){return this.serviceRegistry.getServices(e).parser.AsyncParser.parse(t,r)}createTextDocumentGetter(e,t){const r=this.serviceRegistry;let n;return()=>n??(n=tl.create(e.toString(),r.getServices(e).LanguageMetaData.languageId,0,t??""))}},n$=class{constructor(e){this.documentMap=new Map,this.langiumDocumentFactory=e.workspace.LangiumDocumentFactory,this.serviceRegistry=e.ServiceRegistry}get all(){return Me(this.documentMap.values())}addDocument(e){const t=e.uri.toString();if(this.documentMap.has(t))throw new Error(`A document with the URI '${t}' is already present.`);this.documentMap.set(t,e)}getDocument(e){const t=e.toString();return this.documentMap.get(t)}async getOrCreateDocument(e,t){let r=this.getDocument(e);return r||(r=await this.langiumDocumentFactory.fromUri(e,t),this.addDocument(r),r)}createDocument(e,t,r){if(r)return this.langiumDocumentFactory.fromString(t,e,r).then(n=>(this.addDocument(n),n));{const n=this.langiumDocumentFactory.fromString(t,e);return this.addDocument(n),n}}hasDocument(e){return this.documentMap.has(e.toString())}invalidateDocument(e){const t=e.toString(),r=this.documentMap.get(t);return r&&(this.serviceRegistry.getServices(e).references.Linker.unlink(r),r.state=Ee.Changed,r.precomputedScopes=void 0,r.diagnostics=void 0),r}deleteDocument(e){const t=e.toString(),r=this.documentMap.get(t);return r&&(r.state=Ee.Changed,this.documentMap.delete(t)),r}},fu=Symbol("ref_resolving"),i$=class{constructor(e){this.reflection=e.shared.AstReflection,this.langiumDocuments=()=>e.shared.workspace.LangiumDocuments,this.scopeProvider=e.references.ScopeProvider,this.astNodeLocator=e.workspace.AstNodeLocator}async link(e,t=Se.CancellationToken.None){for(const r of Dn(e.parseResult.value))await Rt(t),pm(r).forEach(n=>this.doLink(n,e))}doLink(e,t){var r;const n=e.reference;if(n._ref===void 0){n._ref=fu;try{const i=this.getCandidate(e);if(Va(i))n._ref=i;else if(n._nodeDescription=i,this.langiumDocuments().hasDocument(i.documentUri)){const s=this.loadAstNode(i);n._ref=s??this.createLinkingError(e,i)}else n._ref=void 0}catch(i){console.error(`An error occurred while resolving reference to '${n.$refText}':`,i);const s=(r=i.message)!==null&&r!==void 0?r:String(i);n._ref=Object.assign(Object.assign({},e),{message:`An error occurred while resolving reference to '${n.$refText}': ${s}`})}t.references.push(n)}}unlink(e){for(const t of e.references)delete t._ref,delete t._nodeDescription;e.references=[]}getCandidate(e){const t=this.scopeProvider.getScope(e).getElement(e.reference.$refText);return t??this.createLinkingError(e)}buildReference(e,t,r,n){const i=this,s={$refNode:r,$refText:n,get ref(){var a;if(at(this._ref))return this._ref;if(Q_(this._nodeDescription)){const o=i.loadAstNode(this._nodeDescription);this._ref=o??i.createLinkingError({reference:s,container:e,property:t},this._nodeDescription)}else if(this._ref===void 0){this._ref=fu;const o=Nu(e).$document,l=i.getLinkedNode({reference:s,container:e,property:t});if(l.error&&o&&o.state<Ee.ComputedScopes){this._ref=void 0;return}this._ref=(a=l.node)!==null&&a!==void 0?a:l.error,this._nodeDescription=l.descr,o?.references.push(this)}else if(this._ref===fu)throw new Error(`Cyclic reference resolution detected: ${i.astNodeLocator.getAstNodePath(e)}/${t} (symbol '${n}')`);return at(this._ref)?this._ref:void 0},get $nodeDescription(){return this._nodeDescription},get error(){return Va(this._ref)?this._ref:void 0}};return s}getLinkedNode(e){var t;try{const r=this.getCandidate(e);if(Va(r))return{error:r};const n=this.loadAstNode(r);return n?{node:n,descr:r}:{descr:r,error:this.createLinkingError(e,r)}}catch(r){console.error(`An error occurred while resolving reference to '${e.reference.$refText}':`,r);const n=(t=r.message)!==null&&t!==void 0?t:String(r);return{error:Object.assign(Object.assign({},e),{message:`An error occurred while resolving reference to '${e.reference.$refText}': ${n}`})}}}loadAstNode(e){if(e.node)return e.node;const t=this.langiumDocuments().getDocument(e.documentUri);if(t)return this.astNodeLocator.getAstNode(t.parseResult.value,e.path)}createLinkingError(e,t){const r=Nu(e.container).$document;r&&r.state<Ee.ComputedScopes&&console.warn(`Attempted reference resolution before document reached ComputedScopes state (${r.uri}).`);const n=this.reflection.getReferenceType(e);return Object.assign(Object.assign({},e),{message:`Could not resolve reference to ${n} named '${e.reference.$refText}'.`,targetDescription:t})}};function kg(e){return typeof e.name=="string"}var s$=class{getName(e){if(kg(e))return e.name}getNameNode(e){return wm(e.$cstNode,"name")}},a$=class{constructor(e){this.nameProvider=e.references.NameProvider,this.index=e.shared.workspace.IndexManager,this.nodeLocator=e.workspace.AstNodeLocator}findDeclaration(e){if(e){const t=MS(e),r=e.astNode;if(t&&r){const n=r[t.feature];if(ir(n))return n.ref;if(Array.isArray(n)){for(const i of n)if(ir(i)&&i.$refNode&&i.$refNode.offset<=e.offset&&i.$refNode.end>=e.end)return i.ref}}if(r){const n=this.nameProvider.getNameNode(r);if(n&&(n===e||eS(e,n)))return r}}}findDeclarationNode(e){const t=this.findDeclaration(e);if(t?.$cstNode){const r=this.nameProvider.getNameNode(t);return r??t.$cstNode}}findReferences(e,t){const r=[];if(t.includeDeclaration){const i=this.getReferenceToSelf(e);i&&r.push(i)}let n=this.index.findAllReferences(e,this.nodeLocator.getAstNodePath(e));return t.documentUri&&(n=n.filter(i=>Ae.equals(i.sourceUri,t.documentUri))),r.push(...n),Me(r)}getReferenceToSelf(e){const t=this.nameProvider.getNameNode(e);if(t){const r=lr(e),n=this.nodeLocator.getAstNodePath(e);return{sourceUri:r.uri,sourcePath:n,targetUri:r.uri,targetPath:n,segment:Uo(t),local:!0}}}},rl=class{constructor(e){if(this.map=new Map,e)for(const[t,r]of e)this.add(t,r)}get size(){return $u.sum(Me(this.map.values()).map(e=>e.length))}clear(){this.map.clear()}delete(e,t){if(t===void 0)return this.map.delete(e);{const r=this.map.get(e);if(r){const n=r.indexOf(t);if(n>=0)return r.length===1?this.map.delete(e):r.splice(n,1),!0}return!1}}get(e){var t;return(t=this.map.get(e))!==null&&t!==void 0?t:[]}has(e,t){if(t===void 0)return this.map.has(e);{const r=this.map.get(e);return r?r.indexOf(t)>=0:!1}}add(e,t){return this.map.has(e)?this.map.get(e).push(t):this.map.set(e,[t]),this}addAll(e,t){return this.map.has(e)?this.map.get(e).push(...t):this.map.set(e,Array.from(t)),this}forEach(e){this.map.forEach((t,r)=>t.forEach(n=>e(n,r,this)))}[Symbol.iterator](){return this.entries().iterator()}entries(){return Me(this.map.entries()).flatMap(([e,t])=>t.map(r=>[e,r]))}keys(){return Me(this.map.keys())}values(){return Me(this.map.values()).flat()}entriesGroupedByKey(){return Me(this.map.entries())}},Yh=class{get size(){return this.map.size}constructor(e){if(this.map=new Map,this.inverse=new Map,e)for(const[t,r]of e)this.set(t,r)}clear(){this.map.clear(),this.inverse.clear()}set(e,t){return this.map.set(e,t),this.inverse.set(t,e),this}get(e){return this.map.get(e)}getKey(e){return this.inverse.get(e)}delete(e){const t=this.map.get(e);return t!==void 0?(this.map.delete(e),this.inverse.delete(t),!0):!1}},o$=class{constructor(e){this.nameProvider=e.references.NameProvider,this.descriptions=e.workspace.AstNodeDescriptionProvider}async computeExports(e,t=Se.CancellationToken.None){return this.computeExportsForNode(e.parseResult.value,e,void 0,t)}async computeExportsForNode(e,t,r=_l,n=Se.CancellationToken.None){const i=[];this.exportNode(e,i,t);for(const s of r(e))await Rt(n),this.exportNode(s,i,t);return i}exportNode(e,t,r){const n=this.nameProvider.getName(e);n&&t.push(this.descriptions.createDescription(e,n,r))}async computeLocalScopes(e,t=Se.CancellationToken.None){const r=e.parseResult.value,n=new rl;for(const i of zn(r))await Rt(t),this.processNode(i,e,n);return n}processNode(e,t,r){const n=e.$container;if(n){const i=this.nameProvider.getName(e);i&&r.add(n,this.descriptions.createDescription(e,i,t))}}},Xh=class{constructor(e,t,r){var n;this.elements=e,this.outerScope=t,this.caseInsensitive=(n=r?.caseInsensitive)!==null&&n!==void 0?n:!1}getAllElements(){return this.outerScope?this.elements.concat(this.outerScope.getAllElements()):this.elements}getElement(e){const t=this.caseInsensitive?this.elements.find(r=>r.name.toLowerCase()===e.toLowerCase()):this.elements.find(r=>r.name===e);if(t)return t;if(this.outerScope)return this.outerScope.getElement(e)}},l$=class{constructor(e,t,r){var n;this.elements=new Map,this.caseInsensitive=(n=r?.caseInsensitive)!==null&&n!==void 0?n:!1;for(const i of e){const s=this.caseInsensitive?i.name.toLowerCase():i.name;this.elements.set(s,i)}this.outerScope=t}getElement(e){const t=this.caseInsensitive?e.toLowerCase():e,r=this.elements.get(t);if(r)return r;if(this.outerScope)return this.outerScope.getElement(e)}getAllElements(){let e=Me(this.elements.values());return this.outerScope&&(e=e.concat(this.outerScope.getAllElements())),e}},$g=class{constructor(){this.toDispose=[],this.isDisposed=!1}onDispose(e){this.toDispose.push(e)}dispose(){this.throwIfDisposed(),this.clear(),this.isDisposed=!0,this.toDispose.forEach(e=>e.dispose())}throwIfDisposed(){if(this.isDisposed)throw new Error("This cache has already been disposed")}},u$=class extends $g{constructor(){super(...arguments),this.cache=new Map}has(e){return this.throwIfDisposed(),this.cache.has(e)}set(e,t){this.throwIfDisposed(),this.cache.set(e,t)}get(e,t){if(this.throwIfDisposed(),this.cache.has(e))return this.cache.get(e);if(t){const r=t();return this.cache.set(e,r),r}else return}delete(e){return this.throwIfDisposed(),this.cache.delete(e)}clear(){this.throwIfDisposed(),this.cache.clear()}},c$=class extends $g{constructor(e){super(),this.cache=new Map,this.converter=e??(t=>t)}has(e,t){return this.throwIfDisposed(),this.cacheForContext(e).has(t)}set(e,t,r){this.throwIfDisposed(),this.cacheForContext(e).set(t,r)}get(e,t,r){this.throwIfDisposed();const n=this.cacheForContext(e);if(n.has(t))return n.get(t);if(r){const i=r();return n.set(t,i),i}else return}delete(e,t){return this.throwIfDisposed(),this.cacheForContext(e).delete(t)}clear(e){if(this.throwIfDisposed(),e){const t=this.converter(e);this.cache.delete(t)}else this.cache.clear()}cacheForContext(e){const t=this.converter(e);let r=this.cache.get(t);return r||(r=new Map,this.cache.set(t,r)),r}},d$=class extends u${constructor(e,t){super(),t?(this.toDispose.push(e.workspace.DocumentBuilder.onBuildPhase(t,()=>{this.clear()})),this.toDispose.push(e.workspace.DocumentBuilder.onUpdate((r,n)=>{n.length>0&&this.clear()}))):this.toDispose.push(e.workspace.DocumentBuilder.onUpdate(()=>{this.clear()}))}},f$=class{constructor(e){this.reflection=e.shared.AstReflection,this.nameProvider=e.references.NameProvider,this.descriptions=e.workspace.AstNodeDescriptionProvider,this.indexManager=e.shared.workspace.IndexManager,this.globalScopeCache=new d$(e.shared)}getScope(e){const t=[],r=this.reflection.getReferenceType(e),n=lr(e.container).precomputedScopes;if(n){let s=e.container;do{const a=n.get(s);a.length>0&&t.push(Me(a).filter(o=>this.reflection.isSubtype(o.type,r))),s=s.$container}while(s)}let i=this.getGlobalScope(r,e);for(let s=t.length-1;s>=0;s--)i=this.createScope(t[s],i);return i}createScope(e,t,r){return new Xh(Me(e),t,r)}createScopeForNodes(e,t,r){return new Xh(Me(e).map(n=>{const i=this.nameProvider.getName(n);if(i)return this.descriptions.createDescription(n,i)}).nonNullable(),t,r)}getGlobalScope(e,t){return this.globalScopeCache.get(e,()=>new l$(this.indexManager.allElements(e)))}};function h$(e){return typeof e.$comment=="string"}function Qh(e){return typeof e=="object"&&!!e&&("$ref"in e||"$error"in e)}var p$=class{constructor(e){this.ignoreProperties=new Set(["$container","$containerProperty","$containerIndex","$document","$cstNode"]),this.langiumDocuments=e.shared.workspace.LangiumDocuments,this.astNodeLocator=e.workspace.AstNodeLocator,this.nameProvider=e.references.NameProvider,this.commentProvider=e.documentation.CommentProvider}serialize(e,t){const r=t??{},n=t?.replacer,i=(a,o)=>this.replacer(a,o,r),s=n?(a,o)=>n(a,o,i):i;try{return this.currentDocument=lr(e),JSON.stringify(e,s,t?.space)}finally{this.currentDocument=void 0}}deserialize(e,t){const r=t??{},n=JSON.parse(e);return this.linkNode(n,n,r),n}replacer(e,t,{refText:r,sourceText:n,textRegions:i,comments:s,uriConverter:a}){var o,l,u,c;if(!this.ignoreProperties.has(e))if(ir(t)){const d=t.ref,f=r?t.$refText:void 0;if(d){const h=lr(d);let m="";this.currentDocument&&this.currentDocument!==h&&(a?m=a(h.uri,t):m=h.uri.toString());const R=this.astNodeLocator.getAstNodePath(d);return{$ref:`${m}#${R}`,$refText:f}}else return{$error:(l=(o=t.error)===null||o===void 0?void 0:o.message)!==null&&l!==void 0?l:"Could not resolve reference",$refText:f}}else if(at(t)){let d;if(i&&(d=this.addAstNodeRegionWithAssignmentsTo(Object.assign({},t)),(!e||t.$document)&&d?.$textRegion&&(d.$textRegion.documentURI=(u=this.currentDocument)===null||u===void 0?void 0:u.uri.toString())),n&&!e&&(d!=null||(d=Object.assign({},t)),d.$sourceText=(c=t.$cstNode)===null||c===void 0?void 0:c.text),s){d!=null||(d=Object.assign({},t));const f=this.commentProvider.getComment(t);f&&(d.$comment=f.replace(/\r/g,""))}return d??t}else return t}addAstNodeRegionWithAssignmentsTo(e){const t=r=>({offset:r.offset,end:r.end,length:r.length,range:r.range});if(e.$cstNode){const r=e.$textRegion=t(e.$cstNode),n=r.assignments={};return Object.keys(e).filter(i=>!i.startsWith("$")).forEach(i=>{const s=DS(e.$cstNode,i).map(t);s.length!==0&&(n[i]=s)}),e}}linkNode(e,t,r,n,i,s){for(const[o,l]of Object.entries(e))if(Array.isArray(l))for(let u=0;u<l.length;u++){const c=l[u];Qh(c)?l[u]=this.reviveReference(e,o,t,c,r):at(c)&&this.linkNode(c,t,r,e,o,u)}else Qh(l)?e[o]=this.reviveReference(e,o,t,l,r):at(l)&&this.linkNode(l,t,r,e,o);const a=e;a.$container=n,a.$containerProperty=i,a.$containerIndex=s}reviveReference(e,t,r,n,i){let s=n.$refText,a=n.$error;if(n.$ref){const o=this.getRefNode(r,n.$ref,i.uriConverter);if(at(o))return s||(s=this.nameProvider.getName(o)),{$refText:s??"",ref:o};a=o}if(a){const o={$refText:s??""};return o.error={container:e,property:t,message:a,reference:o},o}else return}getRefNode(e,t,r){try{const n=t.indexOf("#");if(n===0){const o=this.astNodeLocator.getAstNode(e,t.substring(1));return o||"Could not resolve path: "+t}if(n<0){const o=r?r(t):It.parse(t),l=this.langiumDocuments.getDocument(o);return l?l.parseResult.value:"Could not find document for URI: "+t}const i=r?r(t.substring(0,n)):It.parse(t.substring(0,n)),s=this.langiumDocuments.getDocument(i);if(!s)return"Could not find document for URI: "+t;if(n===t.length-1)return s.parseResult.value;const a=this.astNodeLocator.getAstNode(s.parseResult.value,t.substring(n+1));return a||"Could not resolve URI: "+t}catch(n){return String(n)}}},m$=class{get map(){return this.fileExtensionMap}constructor(e){this.languageIdMap=new Map,this.fileExtensionMap=new Map,this.textDocuments=e?.workspace.TextDocuments}register(e){const t=e.LanguageMetaData;for(const r of t.fileExtensions)this.fileExtensionMap.has(r)&&console.warn(`The file extension ${r} is used by multiple languages. It is now assigned to '${t.languageId}'.`),this.fileExtensionMap.set(r,e);this.languageIdMap.set(t.languageId,e),this.languageIdMap.size===1?this.singleton=e:this.singleton=void 0}getServices(e){var t,r;if(this.singleton!==void 0)return this.singleton;if(this.languageIdMap.size===0)throw new Error("The service registry is empty. Use `register` to register the services of a language.");const n=(r=(t=this.textDocuments)===null||t===void 0?void 0:t.get(e))===null||r===void 0?void 0:r.languageId;if(n!==void 0){const a=this.languageIdMap.get(n);if(a)return a}const i=Ae.extname(e),s=this.fileExtensionMap.get(i);if(!s)throw n?new Error(`The service registry contains no services for the extension '${i}' for language '${n}'.`):new Error(`The service registry contains no services for the extension '${i}'.`);return s}hasServices(e){try{return this.getServices(e),!0}catch{return!1}}get all(){return Array.from(this.languageIdMap.values())}};function zi(e){return{code:e}}var nl;(function(e){e.all=["fast","slow","built-in"]})(nl||(nl={}));var g$=class{constructor(e){this.entries=new rl,this.entriesBefore=[],this.entriesAfter=[],this.reflection=e.shared.AstReflection}register(e,t=this,r="fast"){if(r==="built-in")throw new Error("The 'built-in' category is reserved for lexer, parser, and linker errors.");for(const[n,i]of Object.entries(e)){const s=i;if(Array.isArray(s))for(const a of s){const o={check:this.wrapValidationException(a,t),category:r};this.addEntry(n,o)}else if(typeof s=="function"){const a={check:this.wrapValidationException(s,t),category:r};this.addEntry(n,a)}else Zs(s)}}wrapValidationException(e,t){return async(r,n,i)=>{await this.handleException(()=>e.call(t,r,n,i),"An error occurred during validation",n,r)}}async handleException(e,t,r,n){try{await e()}catch(i){if(Ml(i))throw i;console.error(`${t}:`,i),i instanceof Error&&i.stack&&console.error(i.stack),r("error",`${t}: ${i instanceof Error?i.message:String(i)}`,{node:n})}}addEntry(e,t){if(e==="AstNode"){this.entries.add("AstNode",t);return}for(const r of this.reflection.getAllSubTypes(e))this.entries.add(r,t)}getChecks(e,t){let r=Me(this.entries.get(e)).concat(this.entries.get("AstNode"));return t&&(r=r.filter(n=>t.includes(n.category))),r.map(n=>n.check)}registerBeforeDocument(e,t=this){this.entriesBefore.push(this.wrapPreparationException(e,"An error occurred during set-up of the validation",t))}registerAfterDocument(e,t=this){this.entriesAfter.push(this.wrapPreparationException(e,"An error occurred during tear-down of the validation",t))}wrapPreparationException(e,t,r){return async(n,i,s,a)=>{await this.handleException(()=>e.call(r,n,i,s,a),t,i,n)}}get checksBefore(){return this.entriesBefore}get checksAfter(){return this.entriesAfter}},y$=class{constructor(e){this.validationRegistry=e.validation.ValidationRegistry,this.metadata=e.LanguageMetaData}async validateDocument(e,t={},r=Se.CancellationToken.None){const n=e.parseResult,i=[];if(await Rt(r),(!t.categories||t.categories.includes("built-in"))&&(this.processLexingErrors(n,i,t),t.stopAfterLexingErrors&&i.some(s=>{var a;return((a=s.data)===null||a===void 0?void 0:a.code)===Kt.LexingError})||(this.processParsingErrors(n,i,t),t.stopAfterParsingErrors&&i.some(s=>{var a;return((a=s.data)===null||a===void 0?void 0:a.code)===Kt.ParsingError}))||(this.processLinkingErrors(e,i,t),t.stopAfterLinkingErrors&&i.some(s=>{var a;return((a=s.data)===null||a===void 0?void 0:a.code)===Kt.LinkingError}))))return i;try{i.push(...await this.validateAst(n.value,t,r))}catch(s){if(Ml(s))throw s;console.error("An error occurred during validation:",s)}return await Rt(r),i}processLexingErrors(e,t,r){var n,i,s;const a=[...e.lexerErrors,...(i=(n=e.lexerReport)===null||n===void 0?void 0:n.diagnostics)!==null&&i!==void 0?i:[]];for(const o of a){const l=(s=o.severity)!==null&&s!==void 0?s:"error",u={severity:hu(l),range:{start:{line:o.line-1,character:o.column-1},end:{line:o.line-1,character:o.column+o.length-1}},message:o.message,data:T$(l),source:this.getSource()};t.push(u)}}processParsingErrors(e,t,r){for(const n of e.parserErrors){let i;if(isNaN(n.token.startOffset)){if("previousToken"in n){const s=n.previousToken;if(isNaN(s.startOffset)){const a={line:0,character:0};i={start:a,end:a}}else{const a={line:s.endLine-1,character:s.endColumn};i={start:a,end:a}}}}else i=Au(n.token);if(i){const s={severity:hu("error"),range:i,message:n.message,data:zi(Kt.ParsingError),source:this.getSource()};t.push(s)}}}processLinkingErrors(e,t,r){for(const n of e.references){const i=n.error;if(i){const s={node:i.container,property:i.property,index:i.index,data:{code:Kt.LinkingError,containerType:i.container.$type,property:i.property,refText:i.reference.$refText}};t.push(this.toDiagnostic("error",i.message,s))}}}async validateAst(e,t,r=Se.CancellationToken.None){const n=[],i=(s,a,o)=>{n.push(this.toDiagnostic(s,a,o))};return await this.validateAstBefore(e,t,i,r),await this.validateAstNodes(e,t,i,r),await this.validateAstAfter(e,t,i,r),n}async validateAstBefore(e,t,r,n=Se.CancellationToken.None){var i;const s=this.validationRegistry.checksBefore;for(const a of s)await Rt(n),await a(e,r,(i=t.categories)!==null&&i!==void 0?i:[],n)}async validateAstNodes(e,t,r,n=Se.CancellationToken.None){await Promise.all(Dn(e).map(async i=>{await Rt(n);const s=this.validationRegistry.getChecks(i.$type,t.categories);for(const a of s)await a(i,r,n)}))}async validateAstAfter(e,t,r,n=Se.CancellationToken.None){var i;const s=this.validationRegistry.checksAfter;for(const a of s)await Rt(n),await a(e,r,(i=t.categories)!==null&&i!==void 0?i:[],n)}toDiagnostic(e,t,r){return{message:t,range:v$(r),severity:hu(e),code:r.code,codeDescription:r.codeDescription,tags:r.tags,relatedInformation:r.relatedInformation,data:r.data,source:this.getSource()}}getSource(){return this.metadata.languageId}};function v$(e){if(e.range)return e.range;let t;return typeof e.property=="string"?t=wm(e.node.$cstNode,e.property,e.index):typeof e.keyword=="string"&&(t=OS(e.node.$cstNode,e.keyword,e.index)),t!=null||(t=e.node.$cstNode),t?t.range:{start:{line:0,character:0},end:{line:0,character:0}}}function hu(e){switch(e){case"error":return 1;case"warning":return 2;case"info":return 3;case"hint":return 4;default:throw new Error("Invalid diagnostic severity: "+e)}}function T$(e){switch(e){case"error":return zi(Kt.LexingError);case"warning":return zi(Kt.LexingWarning);case"info":return zi(Kt.LexingInfo);case"hint":return zi(Kt.LexingHint);default:throw new Error("Invalid diagnostic severity: "+e)}}var Kt;(function(e){e.LexingError="lexing-error",e.LexingWarning="lexing-warning",e.LexingInfo="lexing-info",e.LexingHint="lexing-hint",e.ParsingError="parsing-error",e.LinkingError="linking-error"})(Kt||(Kt={}));var R$=class{constructor(e){this.astNodeLocator=e.workspace.AstNodeLocator,this.nameProvider=e.references.NameProvider}createDescription(e,t,r){const n=r??lr(e);t!=null||(t=this.nameProvider.getName(e));const i=this.astNodeLocator.getAstNodePath(e);if(!t)throw new Error(`Node at path ${i} has no name.`);let s;const a=()=>{var o;return s??(s=Uo((o=this.nameProvider.getNameNode(e))!==null&&o!==void 0?o:e.$cstNode))};return{node:e,name:t,get nameSegment(){return a()},selectionSegment:Uo(e.$cstNode),type:e.$type,documentUri:n.uri,path:i}}},w$=class{constructor(e){this.nodeLocator=e.workspace.AstNodeLocator}async createDescriptions(e,t=Se.CancellationToken.None){const r=[],n=e.parseResult.value;for(const i of Dn(n))await Rt(t),pm(i).filter(s=>!Va(s)).forEach(s=>{const a=this.createDescription(s);a&&r.push(a)});return r}createDescription(e){const t=e.reference.$nodeDescription,r=e.reference.$refNode;if(!t||!r)return;const n=lr(e.container).uri;return{sourceUri:n,sourcePath:this.nodeLocator.getAstNodePath(e.container),targetUri:t.documentUri,targetPath:t.path,segment:Uo(r),local:Ae.equals(t.documentUri,n)}}},C$=class{constructor(){this.segmentSeparator="/",this.indexSeparator="@"}getAstNodePath(e){if(e.$container){const t=this.getAstNodePath(e.$container),r=this.getPathSegment(e);return t+this.segmentSeparator+r}return""}getPathSegment({$containerProperty:e,$containerIndex:t}){if(!e)throw new Error("Missing '$containerProperty' in AST node.");return t!==void 0?e+this.indexSeparator+t:e}getAstNode(e,t){return t.split(this.segmentSeparator).reduce((r,n)=>{if(!r||n.length===0)return r;const i=n.indexOf(this.indexSeparator);if(i>0){const s=n.substring(0,i),a=parseInt(n.substring(i+1)),o=r[s];return o?.[a]}return r[n]},e)}},Eg=dl({});Cp(Eg,Td(Jn(),1));var _$=class{constructor(e){this._ready=new ef,this.settings={},this.workspaceConfig=!1,this.onConfigurationSectionUpdateEmitter=new Eg.Emitter,this.serviceRegistry=e.ServiceRegistry}get ready(){return this._ready.promise}initialize(e){var t,r;this.workspaceConfig=(r=(t=e.capabilities.workspace)===null||t===void 0?void 0:t.configuration)!==null&&r!==void 0?r:!1}async initialized(e){if(this.workspaceConfig){if(e.register){const t=this.serviceRegistry.all;e.register({section:t.map(r=>this.toSectionName(r.LanguageMetaData.languageId))})}if(e.fetchConfiguration){const t=this.serviceRegistry.all.map(n=>({section:this.toSectionName(n.LanguageMetaData.languageId)})),r=await e.fetchConfiguration(t);t.forEach((n,i)=>{this.updateSectionConfiguration(n.section,r[i])})}}this._ready.resolve()}updateConfiguration(e){e.settings&&Object.keys(e.settings).forEach(t=>{const r=e.settings[t];this.updateSectionConfiguration(t,r),this.onConfigurationSectionUpdateEmitter.fire({section:t,configuration:r})})}updateSectionConfiguration(e,t){this.settings[e]=t}async getConfiguration(e,t){await this.ready;const r=this.toSectionName(e);if(this.settings[r])return this.settings[r][t]}toSectionName(e){return`${e}`}get onConfigurationSectionUpdate(){return this.onConfigurationSectionUpdateEmitter.event}},Ds;(function(e){function t(r){return{dispose:async()=>await r()}}e.create=t})(Ds||(Ds={}));var S$=class{constructor(e){this.updateBuildOptions={validation:{categories:["built-in","fast"]}},this.updateListeners=[],this.buildPhaseListeners=new rl,this.documentPhaseListeners=new rl,this.buildState=new Map,this.documentBuildWaiters=new Map,this.currentState=Ee.Changed,this.langiumDocuments=e.workspace.LangiumDocuments,this.langiumDocumentFactory=e.workspace.LangiumDocumentFactory,this.textDocuments=e.workspace.TextDocuments,this.indexManager=e.workspace.IndexManager,this.serviceRegistry=e.ServiceRegistry}async build(e,t={},r=Se.CancellationToken.None){var n,i;for(const s of e){const a=s.uri.toString();if(s.state===Ee.Validated){if(typeof t.validation=="boolean"&&t.validation)s.state=Ee.IndexedReferences,s.diagnostics=void 0,this.buildState.delete(a);else if(typeof t.validation=="object"){const o=this.buildState.get(a),l=(n=o?.result)===null||n===void 0?void 0:n.validationChecks;if(l){const u=((i=t.validation.categories)!==null&&i!==void 0?i:nl.all).filter(c=>!l.includes(c));u.length>0&&(this.buildState.set(a,{completed:!1,options:{validation:Object.assign(Object.assign({},t.validation),{categories:u})},result:o.result}),s.state=Ee.IndexedReferences)}}}else this.buildState.delete(a)}this.currentState=Ee.Changed,await this.emitUpdate(e.map(s=>s.uri),[]),await this.buildDocuments(e,t,r)}async update(e,t,r=Se.CancellationToken.None){this.currentState=Ee.Changed;for(const s of t)this.langiumDocuments.deleteDocument(s),this.buildState.delete(s.toString()),this.indexManager.remove(s);for(const s of e){if(!this.langiumDocuments.invalidateDocument(s)){const a=this.langiumDocumentFactory.fromModel({$type:"INVALID"},s);a.state=Ee.Changed,this.langiumDocuments.addDocument(a)}this.buildState.delete(s.toString())}const n=Me(e).concat(t).map(s=>s.toString()).toSet();this.langiumDocuments.all.filter(s=>!n.has(s.uri.toString())&&this.shouldRelink(s,n)).forEach(s=>{this.serviceRegistry.getServices(s.uri).references.Linker.unlink(s),s.state=Math.min(s.state,Ee.ComputedScopes),s.diagnostics=void 0}),await this.emitUpdate(e,t),await Rt(r);const i=this.sortDocuments(this.langiumDocuments.all.filter(s=>{var a;return s.state<Ee.Linked||!(!((a=this.buildState.get(s.uri.toString()))===null||a===void 0)&&a.completed)}).toArray());await this.buildDocuments(i,this.updateBuildOptions,r)}async emitUpdate(e,t){await Promise.all(this.updateListeners.map(r=>r(e,t)))}sortDocuments(e){let t=0,r=e.length-1;for(;t<r;){for(;t<e.length&&this.hasTextDocument(e[t]);)t++;for(;r>=0&&!this.hasTextDocument(e[r]);)r--;t<r&&([e[t],e[r]]=[e[r],e[t]])}return e}hasTextDocument(e){var t;return!!(!((t=this.textDocuments)===null||t===void 0)&&t.get(e.uri))}shouldRelink(e,t){return e.references.some(r=>r.error!==void 0)?!0:this.indexManager.isAffected(e,t)}onUpdate(e){return this.updateListeners.push(e),Ds.create(()=>{const t=this.updateListeners.indexOf(e);t>=0&&this.updateListeners.splice(t,1)})}async buildDocuments(e,t,r){this.prepareBuild(e,t),await this.runCancelable(e,Ee.Parsed,r,i=>this.langiumDocumentFactory.update(i,r)),await this.runCancelable(e,Ee.IndexedContent,r,i=>this.indexManager.updateContent(i,r)),await this.runCancelable(e,Ee.ComputedScopes,r,async i=>{i.precomputedScopes=await this.serviceRegistry.getServices(i.uri).references.ScopeComputation.computeLocalScopes(i,r)}),await this.runCancelable(e,Ee.Linked,r,i=>this.serviceRegistry.getServices(i.uri).references.Linker.link(i,r)),await this.runCancelable(e,Ee.IndexedReferences,r,i=>this.indexManager.updateReferences(i,r));const n=e.filter(i=>this.shouldValidate(i));await this.runCancelable(n,Ee.Validated,r,i=>this.validate(i,r));for(const i of e){const s=this.buildState.get(i.uri.toString());s&&(s.completed=!0)}}prepareBuild(e,t){for(const r of e){const n=r.uri.toString(),i=this.buildState.get(n);(!i||i.completed)&&this.buildState.set(n,{completed:!1,options:t,result:i?.result})}}async runCancelable(e,t,r,n){const i=e.filter(a=>a.state<t);for(const a of i)await Rt(r),await n(a),a.state=t,await this.notifyDocumentPhase(a,t,r);const s=e.filter(a=>a.state===t);await this.notifyBuildPhase(s,t,r),this.currentState=t}onBuildPhase(e,t){return this.buildPhaseListeners.add(e,t),Ds.create(()=>{this.buildPhaseListeners.delete(e,t)})}onDocumentPhase(e,t){return this.documentPhaseListeners.add(e,t),Ds.create(()=>{this.documentPhaseListeners.delete(e,t)})}waitUntil(e,t,r){let n;if(t&&"path"in t?n=t:r=t,r!=null||(r=Se.CancellationToken.None),n){const i=this.langiumDocuments.getDocument(n);if(i&&i.state>e)return Promise.resolve(n)}return this.currentState>=e?Promise.resolve(void 0):r.isCancellationRequested?Promise.reject(el):new Promise((i,s)=>{const a=this.onBuildPhase(e,()=>{if(a.dispose(),o.dispose(),n){const l=this.langiumDocuments.getDocument(n);i(l?.uri)}else i(void 0)}),o=r.onCancellationRequested(()=>{a.dispose(),o.dispose(),s(el)})})}async notifyDocumentPhase(e,t,r){const n=this.documentPhaseListeners.get(t).slice();for(const i of n)try{await i(e,r)}catch(s){if(!Ml(s))throw s}}async notifyBuildPhase(e,t,r){if(e.length===0)return;const n=this.buildPhaseListeners.get(t).slice();for(const i of n)await Rt(r),await i(e,r)}shouldValidate(e){return!!this.getBuildOptions(e).validation}async validate(e,t){var r,n;const i=this.serviceRegistry.getServices(e.uri).validation.DocumentValidator,s=this.getBuildOptions(e).validation,a=typeof s=="object"?s:void 0,o=await i.validateDocument(e,a,t);e.diagnostics?e.diagnostics.push(...o):e.diagnostics=o;const l=this.buildState.get(e.uri.toString());if(l){(r=l.result)!==null&&r!==void 0||(l.result={});const u=(n=a?.categories)!==null&&n!==void 0?n:nl.all;l.result.validationChecks?l.result.validationChecks.push(...u):l.result.validationChecks=[...u]}}getBuildOptions(e){var t,r;return(r=(t=this.buildState.get(e.uri.toString()))===null||t===void 0?void 0:t.options)!==null&&r!==void 0?r:{}}},b$=class{constructor(e){this.symbolIndex=new Map,this.symbolByTypeIndex=new c$,this.referenceIndex=new Map,this.documents=e.workspace.LangiumDocuments,this.serviceRegistry=e.ServiceRegistry,this.astReflection=e.AstReflection}findAllReferences(e,t){const r=lr(e).uri,n=[];return this.referenceIndex.forEach(i=>{i.forEach(s=>{Ae.equals(s.targetUri,r)&&s.targetPath===t&&n.push(s)})}),Me(n)}allElements(e,t){let r=Me(this.symbolIndex.keys());return t&&(r=r.filter(n=>!t||t.has(n))),r.map(n=>this.getFileDescriptions(n,e)).flat()}getFileDescriptions(e,t){var r;return t?this.symbolByTypeIndex.get(e,t,()=>{var n;return((n=this.symbolIndex.get(e))!==null&&n!==void 0?n:[]).filter(i=>this.astReflection.isSubtype(i.type,t))}):(r=this.symbolIndex.get(e))!==null&&r!==void 0?r:[]}remove(e){const t=e.toString();this.symbolIndex.delete(t),this.symbolByTypeIndex.clear(t),this.referenceIndex.delete(t)}async updateContent(e,t=Se.CancellationToken.None){const r=await this.serviceRegistry.getServices(e.uri).references.ScopeComputation.computeExports(e,t),n=e.uri.toString();this.symbolIndex.set(n,r),this.symbolByTypeIndex.clear(n)}async updateReferences(e,t=Se.CancellationToken.None){const r=await this.serviceRegistry.getServices(e.uri).workspace.ReferenceDescriptionProvider.createDescriptions(e,t);this.referenceIndex.set(e.uri.toString(),r)}isAffected(e,t){const r=this.referenceIndex.get(e.uri.toString());return r?r.some(n=>!n.local&&t.has(n.targetUri.toString())):!1}},k$=class{constructor(e){this.initialBuildOptions={},this._ready=new ef,this.serviceRegistry=e.ServiceRegistry,this.langiumDocuments=e.workspace.LangiumDocuments,this.documentBuilder=e.workspace.DocumentBuilder,this.fileSystemProvider=e.workspace.FileSystemProvider,this.mutex=e.workspace.WorkspaceLock}get ready(){return this._ready.promise}get workspaceFolders(){return this.folders}initialize(e){var t;this.folders=(t=e.workspaceFolders)!==null&&t!==void 0?t:void 0}initialized(e){return this.mutex.write(t=>{var r;return this.initializeWorkspace((r=this.folders)!==null&&r!==void 0?r:[],t)})}async initializeWorkspace(e,t=Se.CancellationToken.None){const r=await this.performStartup(e);await Rt(t),await this.documentBuilder.build(r,this.initialBuildOptions,t)}async performStartup(e){const t=this.serviceRegistry.all.flatMap(i=>i.LanguageMetaData.fileExtensions),r=[],n=i=>{r.push(i),this.langiumDocuments.hasDocument(i.uri)||this.langiumDocuments.addDocument(i)};return await this.loadAdditionalDocuments(e,n),await Promise.all(e.map(i=>[i,this.getRootFolder(i)]).map(async i=>this.traverseFolder(...i,t,n))),this._ready.resolve(),r}loadAdditionalDocuments(e,t){return Promise.resolve()}getRootFolder(e){return It.parse(e.uri)}async traverseFolder(e,t,r,n){const i=await this.fileSystemProvider.readDirectory(t);await Promise.all(i.map(async s=>{this.includeEntry(e,s,r)&&(s.isDirectory?await this.traverseFolder(e,s.uri,r,n):s.isFile&&n(await this.langiumDocuments.getOrCreateDocument(s.uri)))}))}includeEntry(e,t,r){const n=Ae.basename(t.uri);if(n.startsWith("."))return!1;if(t.isDirectory)return n!=="node_modules"&&n!=="out";if(t.isFile){const i=Ae.extname(t.uri);return r.includes(i)}return!1}},$$=class{buildUnexpectedCharactersMessage(e,t,r,n,i){return qu.buildUnexpectedCharactersMessage(e,t,r,n,i)}buildUnableToPopLexerModeMessage(e){return qu.buildUnableToPopLexerModeMessage(e)}},E$={mode:"full"},A$=class{constructor(e){this.errorMessageProvider=e.parser.LexerErrorMessageProvider,this.tokenBuilder=e.parser.TokenBuilder;const t=this.tokenBuilder.buildTokens(e.Grammar,{caseInsensitive:e.LanguageMetaData.caseInsensitive});this.tokenTypes=this.toTokenTypeDictionary(t),this.chevrotainLexer=new wt(Jh(t)?Object.values(t):t,{positionTracking:"full",skipValidations:e.LanguageMetaData.mode==="production",errorMessageProvider:this.errorMessageProvider})}get definition(){return this.tokenTypes}tokenize(e,t=E$){var r,n,i;const s=this.chevrotainLexer.tokenize(e);return{tokens:s.tokens,errors:s.errors,hidden:(r=s.groups.hidden)!==null&&r!==void 0?r:[],report:(i=(n=this.tokenBuilder).flushLexingReport)===null||i===void 0?void 0:i.call(n,e)}}toTokenTypeDictionary(e){if(Jh(e))return e;const t=Ag(e)?Object.values(e.modes).flat():e,r={};return t.forEach(n=>r[n.name]=n),r}};function I$(e){return Array.isArray(e)&&(e.length===0||"name"in e[0])}function Ag(e){return e&&"modes"in e&&"defaultMode"in e}function Jh(e){return!I$(e)&&!Ag(e)}yn();function N$(e,t,r){let n,i;typeof e=="string"?(i=t,n=r):(i=e.range.start,n=t),i||(i=fe.create(0,0));const s=Ig(e),a=tf(n);return q$({index:0,tokens:O$({lines:s,position:i,options:a}),position:i})}function P$(e,t){const r=tf(t),n=Ig(e);if(n.length===0)return!1;const i=n[0],s=n[n.length-1],a=r.start,o=r.end;return!!a?.exec(i)&&!!o?.exec(s)}function Ig(e){let t="";return typeof e=="string"?t=e:t=e.text,t.split(_S)}var Zh=/\s*(@([\p{L}][\p{L}\p{N}]*)?)/uy,D$=/\{(@[\p{L}][\p{L}\p{N}]*)(\s*)([^\r\n}]+)?\}/gu;function O$(e){var t,r,n;const i=[];let s=e.position.line,a=e.position.character;for(let o=0;o<e.lines.length;o++){const l=o===0,u=o===e.lines.length-1;let c=e.lines[o],d=0;if(l&&e.options.start){const f=(t=e.options.start)===null||t===void 0?void 0:t.exec(c);f&&(d=f.index+f[0].length)}else{const f=(r=e.options.line)===null||r===void 0?void 0:r.exec(c);f&&(d=f.index+f[0].length)}if(u){const f=(n=e.options.end)===null||n===void 0?void 0:n.exec(c);f&&(c=c.substring(0,f.index))}if(c=c.substring(0,x$(c)),Qc(c,d)>=c.length){if(i.length>0){const f=fe.create(s,a);i.push({type:"break",content:"",range:le.create(f,f)})}}else{Zh.lastIndex=d;const f=Zh.exec(c);if(f){const h=f[0],m=f[1],R=fe.create(s,a+d),S=fe.create(s,a+d+h.length);i.push({type:"tag",content:m,range:le.create(R,S)}),d+=h.length,d=Qc(c,d)}if(d<c.length){const h=c.substring(d),m=Array.from(h.matchAll(D$));i.push(...L$(m,h,s,a+d))}}s++,a=0}return i.length>0&&i[i.length-1].type==="break"?i.slice(0,-1):i}function L$(e,t,r,n){const i=[];if(e.length===0){const s=fe.create(r,n),a=fe.create(r,n+t.length);i.push({type:"text",content:t,range:le.create(s,a)})}else{let s=0;for(const o of e){const l=o.index,u=t.substring(s,l);u.length>0&&i.push({type:"text",content:t.substring(s,l),range:le.create(fe.create(r,s+n),fe.create(r,l+n))});let c=u.length+1;const d=o[1];if(i.push({type:"inline-tag",content:d,range:le.create(fe.create(r,s+c+n),fe.create(r,s+c+d.length+n))}),c+=d.length,o.length===4){c+=o[2].length;const f=o[3];i.push({type:"text",content:f,range:le.create(fe.create(r,s+c+n),fe.create(r,s+c+f.length+n))})}else i.push({type:"text",content:"",range:le.create(fe.create(r,s+c+n),fe.create(r,s+c+n))});s=l+o[0].length}const a=t.substring(s);a.length>0&&i.push({type:"text",content:a,range:le.create(fe.create(r,s+n),fe.create(r,s+n+a.length))})}return i}var M$=/\S/,F$=/\s*$/;function Qc(e,t){const r=e.substring(t).match(M$);return r?t+r.index:e.length}function x$(e){const t=e.match(F$);if(t&&typeof t.index=="number")return t.index}function q$(e){var t,r,n,i;const s=fe.create(e.position.line,e.position.character);if(e.tokens.length===0)return new ep([],le.create(s,s));const a=[];for(;e.index<e.tokens.length;){const u=j$(e,a[a.length-1]);u&&a.push(u)}const o=(r=(t=a[0])===null||t===void 0?void 0:t.range.start)!==null&&r!==void 0?r:s,l=(i=(n=a[a.length-1])===null||n===void 0?void 0:n.range.end)!==null&&i!==void 0?i:s;return new ep(a,le.create(o,l))}function j$(e,t){const r=e.tokens[e.index];if(r.type==="tag")return Pg(e,!1);if(r.type==="text"||r.type==="inline-tag")return Ng(e);U$(r,t),e.index++}function U$(e,t){if(t){const r=new Og("",e.range);"inlines"in t?t.inlines.push(r):t.content.inlines.push(r)}}function Ng(e){let t=e.tokens[e.index];const r=t;let n=t;const i=[];for(;t&&t.type!=="break"&&t.type!=="tag";)i.push(W$(e)),n=t,t=e.tokens[e.index];return new Jc(i,le.create(r.range.start,n.range.end))}function W$(e){return e.tokens[e.index].type==="inline-tag"?Pg(e,!0):Dg(e)}function Pg(e,t){const r=e.tokens[e.index++],n=r.content.substring(1),i=e.tokens[e.index];if(i?.type==="text")if(t){const s=Dg(e);return new mu(n,new Jc([s],s.range),t,le.create(r.range.start,s.range.end))}else{const s=Ng(e);return new mu(n,s,t,le.create(r.range.start,s.range.end))}else{const s=r.range;return new mu(n,new Jc([],s),t,s)}}function Dg(e){const t=e.tokens[e.index++];return new Og(t.content,t.range)}function tf(e){if(!e)return tf({start:"/**",end:"*/",line:"*"});const{start:t,end:r,line:n}=e;return{start:pu(t,!0),end:pu(r,!1),line:pu(n,!0)}}function pu(e,t){if(typeof e=="string"||typeof e=="object"){const r=typeof e=="string"?bl(e):e.source;return t?new RegExp(`^\\s*${r}`):new RegExp(`\\s*${r}\\s*$`)}else return e}var ep=class{constructor(e,t){this.elements=e,this.range=t}getTag(e){return this.getAllTags().find(t=>t.name===e)}getTags(e){return this.getAllTags().filter(t=>t.name===e)}getAllTags(){return this.elements.filter(e=>"name"in e)}toString(){let e="";for(const t of this.elements)if(e.length===0)e=t.toString();else{const r=t.toString();e+=tp(e)+r}return e.trim()}toMarkdown(e){let t="";for(const r of this.elements)if(t.length===0)t=r.toMarkdown(e);else{const n=r.toMarkdown(e);t+=tp(t)+n}return t.trim()}},mu=class{constructor(e,t,r,n){this.name=e,this.content=t,this.inline=r,this.range=n}toString(){let e=`@${this.name}`;const t=this.content.toString();return this.content.inlines.length===1?e=`${e} ${t}`:this.content.inlines.length>1&&(e=`${e}
${t}`),this.inline?`{${e}}`:e}toMarkdown(e){var t,r;return(r=(t=e?.renderTag)===null||t===void 0?void 0:t.call(e,this))!==null&&r!==void 0?r:this.toMarkdownDefault(e)}toMarkdownDefault(e){const t=this.content.toMarkdown(e);if(this.inline){const i=B$(this.name,t,e??{});if(typeof i=="string")return i}let r="";e?.tag==="italic"||e?.tag===void 0?r="*":e?.tag==="bold"?r="**":e?.tag==="bold-italic"&&(r="***");let n=`${r}@${this.name}${r}`;return this.content.inlines.length===1?n=`${n} — ${t}`:this.content.inlines.length>1&&(n=`${n}
${t}`),this.inline?`{${n}}`:n}};function B$(e,t,r){var n,i;if(e==="linkplain"||e==="linkcode"||e==="link"){const s=t.indexOf(" ");let a=t;if(s>0){const o=Qc(t,s);a=t.substring(o),t=t.substring(0,s)}return(e==="linkcode"||e==="link"&&r.link==="code")&&(a=`\`${a}\``),(i=(n=r.renderLink)===null||n===void 0?void 0:n.call(r,t,a))!==null&&i!==void 0?i:H$(t,a)}}function H$(e,t){try{return It.parse(e,!0),`[${t}](${e})`}catch{return e}}var Jc=class{constructor(e,t){this.inlines=e,this.range=t}toString(){let e="";for(let t=0;t<this.inlines.length;t++){const r=this.inlines[t],n=this.inlines[t+1];e+=r.toString(),n&&n.range.start.line>r.range.start.line&&(e+=`
`)}return e}toMarkdown(e){let t="";for(let r=0;r<this.inlines.length;r++){const n=this.inlines[r],i=this.inlines[r+1];t+=n.toMarkdown(e),i&&i.range.start.line>n.range.start.line&&(t+=`
`)}return t}},Og=class{constructor(e,t){this.text=e,this.range=t}toString(){return this.text}toMarkdown(){return this.text}};function tp(e){return e.endsWith(`
`)?`
`:`

`}var K$=class{constructor(e){this.indexManager=e.shared.workspace.IndexManager,this.commentProvider=e.documentation.CommentProvider}getDocumentation(e){const t=this.commentProvider.getComment(e);if(t&&P$(t))return N$(t).toMarkdown({renderLink:(r,n)=>this.documentationLinkRenderer(e,r,n),renderTag:r=>this.documentationTagRenderer(e,r)})}documentationLinkRenderer(e,t,r){var n;const i=(n=this.findNameInPrecomputedScopes(e,t))!==null&&n!==void 0?n:this.findNameInGlobalScope(e,t);if(i&&i.nameSegment){const s=i.nameSegment.range.start.line+1,a=i.nameSegment.range.start.character+1;return`[${r}](${i.documentUri.with({fragment:`L${s},${a}`}).toString()})`}else return}documentationTagRenderer(e,t){}findNameInPrecomputedScopes(e,t){const r=lr(e).precomputedScopes;if(!r)return;let n=e;do{const i=r.get(n).find(s=>s.name===t);if(i)return i;n=n.$container}while(n)}findNameInGlobalScope(e,t){return this.indexManager.allElements().find(r=>r.name===t)}},G$=class{constructor(e){this.grammarConfig=()=>e.parser.GrammarConfig}getComment(e){var t;return h$(e)?e.$comment:(t=nS(e.$cstNode,this.grammarConfig().multilineCommentRules))===null||t===void 0?void 0:t.text}},z$=class{constructor(e){this.syncParser=e.parser.LangiumParser}parse(e,t){return Promise.resolve(this.syncParser.parse(e))}},V$=class{constructor(){this.previousTokenSource=new Se.CancellationTokenSource,this.writeQueue=[],this.readQueue=[],this.done=!0}write(e){this.cancelWrite();const t=e$();return this.previousTokenSource=t,this.enqueue(this.writeQueue,e,t.token)}read(e){return this.enqueue(this.readQueue,e)}enqueue(e,t,r=Se.CancellationToken.None){const n=new ef,i={action:t,deferred:n,cancellationToken:r};return e.push(i),this.performNextOperation(),n.promise}async performNextOperation(){if(!this.done)return;const e=[];if(this.writeQueue.length>0)e.push(this.writeQueue.shift());else if(this.readQueue.length>0)e.push(...this.readQueue.splice(0,this.readQueue.length));else return;this.done=!1,await Promise.all(e.map(async({action:t,deferred:r,cancellationToken:n})=>{try{const i=await Promise.resolve().then(()=>t(n));r.resolve(i)}catch(i){Ml(i)?r.resolve(void 0):r.reject(i)}})),this.done=!0,this.performNextOperation()}cancelWrite(){this.previousTokenSource.cancel()}},Y$=class{constructor(e){this.grammarElementIdMap=new Yh,this.tokenTypeIdMap=new Yh,this.grammar=e.Grammar,this.lexer=e.parser.Lexer,this.linker=e.references.Linker}dehydrate(e){return{lexerErrors:e.lexerErrors,lexerReport:e.lexerReport?this.dehydrateLexerReport(e.lexerReport):void 0,parserErrors:e.parserErrors.map(t=>Object.assign(Object.assign({},t),{message:t.message})),value:this.dehydrateAstNode(e.value,this.createDehyrationContext(e.value))}}dehydrateLexerReport(e){return e}createDehyrationContext(e){const t=new Map,r=new Map;for(const n of Dn(e))t.set(n,{});if(e.$cstNode)for(const n of jo(e.$cstNode))r.set(n,{});return{astNodes:t,cstNodes:r}}dehydrateAstNode(e,t){const r=t.astNodes.get(e);r.$type=e.$type,r.$containerIndex=e.$containerIndex,r.$containerProperty=e.$containerProperty,e.$cstNode!==void 0&&(r.$cstNode=this.dehydrateCstNode(e.$cstNode,t));for(const[n,i]of Object.entries(e))if(!n.startsWith("$"))if(Array.isArray(i)){const s=[];r[n]=s;for(const a of i)at(a)?s.push(this.dehydrateAstNode(a,t)):ir(a)?s.push(this.dehydrateReference(a,t)):s.push(a)}else at(i)?r[n]=this.dehydrateAstNode(i,t):ir(i)?r[n]=this.dehydrateReference(i,t):i!==void 0&&(r[n]=i);return r}dehydrateReference(e,t){const r={};return r.$refText=e.$refText,e.$refNode&&(r.$refNode=t.cstNodes.get(e.$refNode)),r}dehydrateCstNode(e,t){const r=t.cstNodes.get(e);return rm(e)?r.fullText=e.fullText:r.grammarSource=this.getGrammarElementId(e.grammarSource),r.hidden=e.hidden,r.astNode=t.astNodes.get(e.astNode),an(e)?r.content=e.content.map(n=>this.dehydrateCstNode(n,t)):Js(e)&&(r.tokenType=e.tokenType.name,r.offset=e.offset,r.length=e.length,r.startLine=e.range.start.line,r.startColumn=e.range.start.character,r.endLine=e.range.end.line,r.endColumn=e.range.end.character),r}hydrate(e){const t=e.value,r=this.createHydrationContext(t);return"$cstNode"in t&&this.hydrateCstNode(t.$cstNode,r),{lexerErrors:e.lexerErrors,lexerReport:e.lexerReport,parserErrors:e.parserErrors,value:this.hydrateAstNode(t,r)}}createHydrationContext(e){const t=new Map,r=new Map;for(const i of Dn(e))t.set(i,{});let n;if(e.$cstNode)for(const i of jo(e.$cstNode)){let s;"fullText"in i?(s=new mg(i.fullText),n=s):"content"in i?s=new Zd:"tokenType"in i&&(s=this.hydrateCstLeafNode(i)),s&&(r.set(i,s),s.root=n)}return{astNodes:t,cstNodes:r}}hydrateAstNode(e,t){const r=t.astNodes.get(e);r.$type=e.$type,r.$containerIndex=e.$containerIndex,r.$containerProperty=e.$containerProperty,e.$cstNode&&(r.$cstNode=t.cstNodes.get(e.$cstNode));for(const[n,i]of Object.entries(e))if(!n.startsWith("$"))if(Array.isArray(i)){const s=[];r[n]=s;for(const a of i)at(a)?s.push(this.setParent(this.hydrateAstNode(a,t),r)):ir(a)?s.push(this.hydrateReference(a,r,n,t)):s.push(a)}else at(i)?r[n]=this.setParent(this.hydrateAstNode(i,t),r):ir(i)?r[n]=this.hydrateReference(i,r,n,t):i!==void 0&&(r[n]=i);return r}setParent(e,t){return e.$container=t,e}hydrateReference(e,t,r,n){return this.linker.buildReference(t,r,n.cstNodes.get(e.$refNode),e.$refText)}hydrateCstNode(e,t,r=0){const n=t.cstNodes.get(e);if(typeof e.grammarSource=="number"&&(n.grammarSource=this.getGrammarElement(e.grammarSource)),n.astNode=t.astNodes.get(e.astNode),an(n))for(const i of e.content){const s=this.hydrateCstNode(i,t,r++);n.content.push(s)}return n}hydrateCstLeafNode(e){const t=this.getTokenType(e.tokenType),r=e.offset,n=e.length,i=e.startLine,s=e.startColumn,a=e.endLine,o=e.endColumn,l=e.hidden;return new Gc(r,n,{start:{line:i,character:s},end:{line:a,character:o}},t,l)}getTokenType(e){return this.lexer.definition[e]}getGrammarElementId(e){if(e)return this.grammarElementIdMap.size===0&&this.createGrammarElementIdMap(),this.grammarElementIdMap.get(e)}getGrammarElement(e){return this.grammarElementIdMap.size===0&&this.createGrammarElementIdMap(),this.grammarElementIdMap.getKey(e)}createGrammarElementIdMap(){let e=0;for(const t of Dn(this.grammar))lm(t)&&this.grammarElementIdMap.set(t,e++)}};function rf(e){return{documentation:{CommentProvider:t=>new G$(t),DocumentationProvider:t=>new K$(t)},parser:{AsyncParser:t=>new z$(t),GrammarConfig:t=>KS(t),LangiumParser:t=>Vk(t),CompletionParser:t=>zk(t),ValueConverter:()=>new Qk,TokenBuilder:()=>new Xk,Lexer:t=>new A$(t),ParserErrorMessageProvider:()=>new vg,LexerErrorMessageProvider:()=>new $$},workspace:{AstNodeLocator:()=>new C$,AstNodeDescriptionProvider:t=>new R$(t),ReferenceDescriptionProvider:t=>new w$(t)},references:{Linker:t=>new i$(t),NameProvider:()=>new s$,ScopeProvider:t=>new f$(t),ScopeComputation:t=>new o$(t),References:t=>new a$(t)},serializer:{Hydrator:t=>new Y$(t),JsonSerializer:t=>new p$(t)},validation:{DocumentValidator:t=>new y$(t),ValidationRegistry:t=>new g$(t)},shared:()=>e.shared}}function nf(e){return{ServiceRegistry:t=>new m$(t),workspace:{LangiumDocuments:t=>new n$(t),LangiumDocumentFactory:t=>new r$(t),DocumentBuilder:t=>new S$(t),IndexManager:t=>new b$(t),WorkspaceManager:t=>new k$(t),FileSystemProvider:t=>e.fileSystemProvider(t),WorkspaceLock:()=>new V$,ConfigurationProvider:t=>new _$(t)}}}var il;(function(e){e.merge=(t,r)=>sl(sl({},t),r)})(il||(il={}));function Un(e,t,r,n,i,s,a,o,l){return Mg([e,t,r,n,i,s,a,o,l].reduce(sl,{}))}var Lg=Symbol("isProxy");function Zc(e){if(e&&e[Lg])for(const t of Object.values(e))Zc(t);return e}function Mg(e,t){const r=new Proxy({},{deleteProperty:()=>!1,set:()=>{throw new Error("Cannot set property on injected service container")},get:(n,i)=>i===Lg?!0:np(n,i,e,t||r),getOwnPropertyDescriptor:(n,i)=>(np(n,i,e,t||r),Object.getOwnPropertyDescriptor(n,i)),has:(n,i)=>i in e,ownKeys:()=>[...Object.getOwnPropertyNames(e)]});return r}var rp=Symbol();function np(e,t,r,n){if(t in e){if(e[t]instanceof Error)throw new Error("Construction failure. Please make sure that your dependencies are constructable.",{cause:e[t]});if(e[t]===rp)throw new Error('Cycle detected. Please make "'+String(t)+'" lazy. Visit https://langium.org/docs/reference/configuration-services/#resolving-cyclic-dependencies');return e[t]}else if(t in r){const i=r[t];e[t]=rp;try{e[t]=typeof i=="function"?i(n):Mg(i,n)}catch(s){throw e[t]=s instanceof Error?s:void 0,s}return e[t]}else return}function sl(e,t){if(t){for(const[r,n]of Object.entries(t))if(n!==void 0){const i=e[r];i!==null&&n!==null&&typeof i=="object"&&typeof n=="object"?e[r]=sl(i,n):e[r]=n}}return e}var X$=class{readFile(){throw new Error("No file system is available.")}async readDirectory(){return[]}},Fg={fileSystemProvider:()=>new X$},Q$={Grammar:()=>{},LanguageMetaData:()=>({caseInsensitive:!1,fileExtensions:[".langium"],languageId:"langium"})},J$={AstReflection:()=>new hm};function Z$(){const e=Un(nf(Fg),J$),t=Un(rf({shared:e}),Q$);return e.ServiceRegistry.register(t),t}function eE(e){var t;const r=Z$(),n=r.serializer.JsonSerializer.deserialize(e);return r.shared.workspace.LangiumDocumentFactory.fromModel(n,It.parse(`memory://${(t=n.name)!==null&&t!==void 0?t:"grammar"}.langium`)),n}var ip="ExprValue",sp="FuncArg",tE="IncludeField",rE="InValue",nE="PolyFieldValue",ap="SelectField",iE="SoslField",op="SoslWithClause",sE="SoslWithCondValue",ed="Statement";function aE(e){return z.isInstance(e,ed)}var lp="UpdateValue",Vi="ApexVar";function xg(e){return z.isInstance(e,Vi)}var Yi="Boolean";function qg(e){return z.isInstance(e,Yi)}var Xi="DataCategory";function jg(e){return z.isInstance(e,Xi)}var uo="DataCategoryName";function Ug(e){return z.isInstance(e,uo)}var co="DataCategoryNames";function Wg(e){return z.isInstance(e,co)}var fo="DataCategorySelection";function oE(e){return z.isInstance(e,fo)}var Qi="DateConst";function Bg(e){return z.isInstance(e,Qi)}var Ji="DateN";function Hg(e){return z.isInstance(e,Ji)}var Zi="Datetime";function Kg(e){return z.isInstance(e,Zi)}var es="DateVal";function Gg(e){return z.isInstance(e,es)}var ts="Decimal";function zg(e){return z.isInstance(e,ts)}var rs="DeleteStmt";function sf(e){return z.isInstance(e,rs)}var ns="Expr";function Vg(e){return z.isInstance(e,ns)}var is="Field";function al(e){return z.isInstance(e,is)}var ss="FormulaField";function td(e){return z.isInstance(e,ss)}var as="FormulaValue";function Yg(e){return z.isInstance(e,as)}var os="Func";function Xg(e){return z.isInstance(e,os)}var ho="GroupByClause";function Qg(e){return z.isInstance(e,ho)}var po="GroupByFunc";function Jg(e){return z.isInstance(e,po)}var mo="HavingClause";function Zg(e){return z.isInstance(e,mo)}var go="IncludeFieldsClause";function ey(e){return z.isInstance(e,go)}var gu="InsertCsvClause",yu="InsertCsvFileClause",ls="InsertStatement";function zN(e){return z.isInstance(e,ls)}function ty(e){return z.isInstance(e,"Int")}var yo="LimitClause";function ry(e){return z.isInstance(e,yo)}var us="NullValue";function ny(e){return z.isInstance(e,us)}var vo="OffsetClause";function iy(e){return z.isInstance(e,vo)}var To="OrderByClause";function sy(e){return z.isInstance(e,To)}var Ro="OrderByItem";function lE(e){return z.isInstance(e,Ro)}var cs="PolyField";function An(e){return z.isInstance(e,cs)}var wo="PolyFieldElseExpr";function uE(e){return z.isInstance(e,wo)}var Co="PolyFieldSobjectExpr";function cE(e){return z.isInstance(e,Co)}var ds="PurgeStatement";function VN(e){return z.isInstance(e,ds)}var fs="RelField";function ol(e){return z.isInstance(e,fs)}var _o="ScopeClause";function ay(e){return z.isInstance(e,_o)}var So="SecurityContext";function oy(e){return z.isInstance(e,So)}var bo="SfsqlModel";function ly(e){return z.isInstance(e,bo)}var hs="SoqlChainStmt";function uy(e){return z.isInstance(e,hs)}var ps="SoqlChildQuery";function ms(e){return z.isInstance(e,ps)}var gs="SoqlStmt";function rd(e){return z.isInstance(e,gs)}var ko="SoslReturningClause";function cy(e){return z.isInstance(e,ko)}var $o="SoslReturningExpr";function dy(e){return z.isInstance(e,$o)}var Eo="SoslSearchInClause";function fy(e){return z.isInstance(e,Eo)}var ys="SoslStmt";function hy(e){return z.isInstance(e,ys)}var Ao="SoslUsingListViewClause";function py(e){return z.isInstance(e,Ao)}var vs="SoslWithCond";function my(e){return z.isInstance(e,vs)}var Ts="SoslWithSnippet";function gy(e){return z.isInstance(e,Ts)}var Rs="StringVal";function yy(e){return z.isInstance(e,Rs)}var ws="SubFunc";function vy(e){return z.isInstance(e,ws)}var Cs="SubQuery";function Ty(e){return z.isInstance(e,Cs)}var _s="UndeleteStmt";function Fl(e){return z.isInstance(e,_s)}var Io="UpdateClause";function Ry(e){return z.isInstance(e,Io)}var No="UpdateExpression";function wy(e){return z.isInstance(e,No)}var Ss="UpdateStmt";function xl(e){return z.isInstance(e,Ss)}var qa="ValueField",bs="ValueIn";function Cy(e){return z.isInstance(e,bs)}var ja="ValueRelField",Po="WhereClause";function _y(e){return z.isInstance(e,Po)}var ks="WildField";function nd(e){return z.isInstance(e,ks)}var $s="WildRelField";function id(e){return z.isInstance(e,$s)}var vu="WithFieldsClause",Es="AndExpr";function qr(e){return z.isInstance(e,Es)}var As="ExprCond";function Sy(e){return z.isInstance(e,As)}var Is="NotExpr";function ll(e){return z.isInstance(e,Is)}var Ns="OrExpr";function In(e){return z.isInstance(e,Ns)}var by=class extends tm{getAllTypes(){return[Es,Vi,Yi,Xi,uo,co,fo,Qi,Ji,es,Zi,ts,rs,ns,As,ip,is,ss,as,os,sp,ho,po,mo,rE,tE,go,gu,yu,ls,"Int",yo,Is,us,vo,Ns,To,Ro,cs,wo,Co,nE,ds,fs,_o,So,ap,bo,hs,ps,gs,iE,ko,$o,Eo,ys,Ao,op,vs,sE,Ts,ed,Rs,ws,Cs,_s,Io,No,Ss,lp,qa,bs,ja,Po,ks,$s,vu]}computeIsSubtype(e,t){switch(e){case Es:case As:case Is:case Ns:return this.isSubtype(ns,t);case Vi:return this.isSubtype("ExprValue",t)||this.isSubtype("InValue",t);case Yi:case Zi:case es:case ts:case"Int":case us:case Rs:return this.isSubtype("ExprValue",t)||this.isSubtype("FuncArg",t)||this.isSubtype("InValue",t)||this.isSubtype("SoslWithCondValue",t)||this.isSubtype("UpdateValue",t);case Xi:case vs:case Ts:return this.isSubtype(op,t);case Qi:case Ji:return this.isSubtype("ExprValue",t)||this.isSubtype("FuncArg",t)||this.isSubtype("InValue",t)||this.isSubtype("SoslWithCondValue",t);case rs:case ls:case ds:case hs:case gs:case ys:case _s:case Ss:return this.isSubtype(ed,t);case is:case fs:return this.isSubtype("FuncArg",t)||this.isSubtype("IncludeField",t)||this.isSubtype("PolyFieldValue",t)||this.isSubtype("SelectField",t)||this.isSubtype("SoslField",t)||this.isSubtype("UpdateValue",t);case ss:case cs:case ps:case ks:case $s:return this.isSubtype(ap,t);case as:return this.isSubtype(lp,t);case os:return this.isSubtype("PolyFieldValue",t)||this.isSubtype("SelectField",t)||this.isSubtype("SoslField",t);case ws:case qa:case ja:return this.isSubtype(sp,t);case Cs:return this.isSubtype(ip,t);case bs:return this.isSubtype("ExprValue",t)||this.isSubtype("SoslWithCondValue",t);default:return!1}}getReferenceType(e){const t=`${e.container.$type}:${e.property}`;throw new Error(`${t} is not a valid reference id.`)}getTypeMetaData(e){switch(e){case Vi:return{name:Vi,properties:[{name:"name"}]};case Yi:return{name:Yi,properties:[{name:"value"}]};case Xi:return{name:Xi,properties:[{name:"dataCategory",defaultValue:!1},{name:"exprs",defaultValue:[]}]};case uo:return{name:uo,properties:[{name:"value"}]};case co:return{name:co,properties:[{name:"values",defaultValue:[]}]};case fo:return{name:fo,properties:[{name:"group"},{name:"name"},{name:"selector"}]};case Qi:return{name:Qi,properties:[{name:"value"}]};case Ji:return{name:Ji,properties:[{name:"value"}]};case Zi:return{name:Zi,properties:[{name:"value"}]};case es:return{name:es,properties:[{name:"value"}]};case ts:return{name:ts,properties:[{name:"value"}]};case rs:return{name:rs,properties:[{name:"hard",defaultValue:!1},{name:"limitClause"},{name:"max"},{name:"maxKw"},{name:"offsetClause"},{name:"orderByClause"},{name:"scopeClause"},{name:"sobject"},{name:"whereClause"}]};case ns:return{name:ns,properties:[{name:"paren",defaultValue:!1}]};case is:return{name:is,properties:[{name:"alias"},{name:"field"}]};case ss:return{name:ss,properties:[{name:"alias"},{name:"formula"},{name:"type"}]};case as:return{name:as,properties:[{name:"value"}]};case os:return{name:os,properties:[{name:"alias"},{name:"args",defaultValue:[]},{name:"name"}]};case ho:return{name:ho,properties:[{name:"fields",defaultValue:[]},{name:"local",defaultValue:!1}]};case po:return{name:po,properties:[{name:"alias"},{name:"args",defaultValue:[]},{name:"name"}]};case mo:return{name:mo,properties:[{name:"expr"}]};case go:return{name:go,properties:[{name:"fields",defaultValue:[]}]};case gu:return{name:gu,properties:[{name:"content"}]};case yu:return{name:yu,properties:[{name:"file"}]};case ls:return{name:ls,properties:[{name:"csvClause"},{name:"csvFileClause"},{name:"fields",defaultValue:[]},{name:"object"}]};case"Int":return{name:"Int",properties:[{name:"value"}]};case yo:return{name:yo,properties:[{name:"value"}]};case us:return{name:us,properties:[{name:"value"}]};case vo:return{name:vo,properties:[{name:"value"}]};case To:return{name:To,properties:[{name:"items",defaultValue:[]}]};case Ro:return{name:Ro,properties:[{name:"direction"},{name:"nullSort"},{name:"source"}]};case cs:return{name:cs,properties:[{name:"alias"},{name:"else"},{name:"end"},{name:"objects",defaultValue:[]},{name:"what"}]};case wo:return{name:wo,properties:[{name:"fields",defaultValue:[]}]};case Co:return{name:Co,properties:[{name:"fields",defaultValue:[]},{name:"object"}]};case ds:return{name:ds,properties:[{name:"limitClause"},{name:"offsetClause"},{name:"orderByClause"},{name:"scopeClause"},{name:"sobject"},{name:"whereClause"}]};case fs:return{name:fs,properties:[{name:"alias"},{name:"field"}]};case _o:return{name:_o,properties:[{name:"scope"}]};case So:return{name:So,properties:[{name:"mode"}]};case bo:return{name:bo,properties:[{name:"statements",defaultValue:[]}]};case hs:return{name:hs,properties:[{name:"stmts",defaultValue:[]}]};case ps:return{name:ps,properties:[{name:"childField"},{name:"childFieldAlias"},{name:"fields",defaultValue:[]},{name:"limit"},{name:"offset"},{name:"orderBy"},{name:"where"}]};case gs:return{name:gs,properties:[{name:"allRows",defaultValue:!1},{name:"fields",defaultValue:[]},{name:"for"},{name:"groupBy"},{name:"having"},{name:"includeFields"},{name:"limit"},{name:"offset"},{name:"orderBy"},{name:"scope"},{name:"sobject"},{name:"sobjectAlias"},{name:"update"},{name:"where"},{name:"withs",defaultValue:[]}]};case ko:return{name:ko,properties:[{name:"returningExprs",defaultValue:[]}]};case $o:return{name:$o,properties:[{name:"fields",defaultValue:[]},{name:"limitClause"},{name:"offsetClause"},{name:"orderByClause"},{name:"sobject"},{name:"usingListViewClause"},{name:"whereClause"}]};case Eo:return{name:Eo,properties:[{name:"kwFields"},{name:"searchIn"}]};case ys:return{name:ys,properties:[{name:"limitClause"},{name:"returningClause"},{name:"searchInClause"},{name:"searchTerm"},{name:"updateClause"},{name:"withClause"}]};case Ao:return{name:Ao,properties:[{name:"kwListView"},{name:"listView"}]};case vs:return{name:vs,properties:[{name:"left"},{name:"oper"},{name:"right"}]};case Ts:return{name:Ts,properties:[{name:"left"},{name:"right"}]};case Rs:return{name:Rs,properties:[{name:"value"}]};case ws:return{name:ws,properties:[{name:"args",defaultValue:[]},{name:"name"}]};case Cs:return{name:Cs,properties:[{name:"value"}]};case _s:return{name:_s,properties:[{name:"limitClause"},{name:"max"},{name:"maxKw"},{name:"offsetClause"},{name:"orderByClause"},{name:"scopeClause"},{name:"sobject"},{name:"whereClause"}]};case Io:return{name:Io,properties:[{name:"type"}]};case No:return{name:No,properties:[{name:"field"},{name:"value"}]};case Ss:return{name:Ss,properties:[{name:"limitClause"},{name:"max"},{name:"maxKw"},{name:"offsetClause"},{name:"orderByClause"},{name:"scopeClause"},{name:"sobject"},{name:"updateExpressions",defaultValue:[]},{name:"whereClause"},{name:"withFieldsClause"}]};case qa:return{name:qa,properties:[{name:"value"}]};case bs:return{name:bs,properties:[{name:"values",defaultValue:[]}]};case ja:return{name:ja,properties:[{name:"value"}]};case Po:return{name:Po,properties:[{name:"expr"}]};case ks:return{name:ks,properties:[{name:"alias"},{name:"field"}]};case $s:return{name:$s,properties:[{name:"alias"},{name:"field"}]};case vu:return{name:vu,properties:[{name:"withFields",defaultValue:[]}]};case Es:return{name:Es,properties:[{name:"left"},{name:"paren",defaultValue:!1},{name:"right"}]};case As:return{name:As,properties:[{name:"left"},{name:"oper"},{name:"operNot",defaultValue:!1},{name:"paren",defaultValue:!1},{name:"right"}]};case Is:return{name:Is,properties:[{name:"expr"},{name:"paren",defaultValue:!1}]};case Ns:return{name:Ns,properties:[{name:"left"},{name:"paren",defaultValue:!1},{name:"right"}]};default:return{name:e,properties:[]}}}},z=new by,Ua,dE=()=>Ua??(Ua=eE(`{
  "$type": "Grammar",
  "isDeclared": true,
  "name": "Sfsql",
  "rules": [
    {
      "$type": "ParserRule",
      "entry": true,
      "name": "SfsqlModel",
      "inferredType": {
        "$type": "InferredType",
        "name": "SfsqlModel"
      },
      "definition": {
        "$type": "Assignment",
        "feature": "statements",
        "operator": "+=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@1"
          },
          "arguments": []
        },
        "cardinality": "*"
      },
      "definesHiddenTokens": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Statement",
      "inferredType": {
        "$type": "InferredType",
        "name": "Statement"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@16"
                },
                "arguments": []
              },
              {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@15"
                },
                "arguments": []
              },
              {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@59"
                },
                "arguments": []
              },
              {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@2"
                },
                "arguments": []
              },
              {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@5"
                },
                "arguments": []
              },
              {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@7"
                },
                "arguments": []
              },
              {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@6"
                },
                "arguments": []
              },
              {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@8"
                },
                "arguments": []
              }
            ]
          },
          {
            "$type": "Keyword",
            "value": ";",
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "InsertStatement",
      "inferredType": {
        "$type": "InferredType",
        "name": "InsertStatement"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "insert"
          },
          {
            "$type": "Keyword",
            "value": "into"
          },
          {
            "$type": "Assignment",
            "feature": "object",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@90"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "fields",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@90"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": ","
                  },
                  {
                    "$type": "Assignment",
                    "feature": "fields",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@90"
                      },
                      "arguments": []
                    }
                  }
                ],
                "cardinality": "*"
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "csvClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@3"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "csvFileClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@4"
              },
              "arguments": []
            },
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "InsertCsvClause",
      "inferredType": {
        "$type": "InferredType",
        "name": "InsertCsvClause"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "csvcontent"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "content",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@84"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "InsertCsvFileClause",
      "inferredType": {
        "$type": "InferredType",
        "name": "InsertCsvFileClause"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "csvfile"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "file",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@84"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DeleteStmt",
      "inferredType": {
        "$type": "InferredType",
        "name": "DeleteStmt"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "delete"
          },
          {
            "$type": "Assignment",
            "feature": "hard",
            "operator": "?=",
            "terminal": {
              "$type": "Keyword",
              "value": "hard"
            },
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "maxKw",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@96"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Assignment",
                "feature": "max",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@98"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": "from",
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "sobject",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@90"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "scopeClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@26"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "whereClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@27"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "orderByClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@17"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "limitClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@50"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "offsetClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@51"
              },
              "arguments": []
            },
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "PurgeStatement",
      "inferredType": {
        "$type": "InferredType",
        "name": "PurgeStatement"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "purge"
          },
          {
            "$type": "Keyword",
            "value": "from"
          },
          {
            "$type": "Assignment",
            "feature": "sobject",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@90"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "scopeClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@26"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "whereClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@27"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "orderByClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@17"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "limitClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@50"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "offsetClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@51"
              },
              "arguments": []
            },
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "UndeleteStmt",
      "inferredType": {
        "$type": "InferredType",
        "name": "UndeleteStmt"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "undelete"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "maxKw",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@96"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Assignment",
                "feature": "max",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@98"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": "from",
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "sobject",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@90"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "scopeClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@26"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "whereClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@27"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "orderByClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@17"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "limitClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@50"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "offsetClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@51"
              },
              "arguments": []
            },
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "UpdateStmt",
      "inferredType": {
        "$type": "InferredType",
        "name": "UpdateStmt"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "update"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "maxKw",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@96"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Assignment",
                "feature": "max",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@98"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "sobject",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@90"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "withFieldsClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@9"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": "set"
          },
          {
            "$type": "Assignment",
            "feature": "updateExpressions",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@12"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "updateExpressions",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@12"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Assignment",
            "feature": "scopeClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@26"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "whereClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@27"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "orderByClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@17"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "limitClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@50"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "offsetClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@51"
              },
              "arguments": []
            },
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "WithFieldsClause",
      "inferredType": {
        "$type": "InferredType",
        "name": "WithFieldsClause"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "with"
          },
          {
            "$type": "Assignment",
            "feature": "withFields",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@87"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "withFields",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@87"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "IncludeField",
      "inferredType": {
        "$type": "InferredType",
        "name": "IncludeField"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@72"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@73"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "IncludeFieldsClause",
      "inferredType": {
        "$type": "InferredType",
        "name": "IncludeFieldsClause"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "include"
          },
          {
            "$type": "Assignment",
            "feature": "fields",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@10"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "fields",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@10"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "UpdateExpression",
      "inferredType": {
        "$type": "InferredType",
        "name": "UpdateExpression"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "field",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@90"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": "="
          },
          {
            "$type": "Assignment",
            "feature": "value",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@13"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "UpdateValue",
      "inferredType": {
        "$type": "InferredType",
        "name": "UpdateValue"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@72"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@73"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@85"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@14"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@84"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@80"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@81"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@77"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@79"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@78"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "FormulaValue",
      "inferredType": {
        "$type": "InferredType",
        "name": "FormulaValue"
      },
      "definition": {
        "$type": "Assignment",
        "feature": "value",
        "operator": "=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@100"
          },
          "arguments": []
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SoqlChainStmt",
      "inferredType": {
        "$type": "InferredType",
        "name": "SoqlChainStmt"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "stmts",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@16"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": "chain"
          },
          {
            "$type": "Assignment",
            "feature": "stmts",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@16"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "chain"
              },
              {
                "$type": "Assignment",
                "feature": "stmts",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@16"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SoqlStmt",
      "inferredType": {
        "$type": "InferredType",
        "name": "SoqlStmt"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "select"
          },
          {
            "$type": "Assignment",
            "feature": "fields",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@20"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "fields",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@20"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ",",
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "includeFields",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@11"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": "from"
          },
          {
            "$type": "Assignment",
            "feature": "sobject",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@90"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "sobjectAlias",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@96"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "using"
              },
              {
                "$type": "Keyword",
                "value": "scope"
              },
              {
                "$type": "Assignment",
                "feature": "scope",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@58"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "where",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@27"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "UnorderedGroup",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "withs",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@40"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Assignment",
                "feature": "withs",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@42"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "groupBy",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@47"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Assignment",
                "feature": "having",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@18"
                  },
                  "arguments": []
                },
                "cardinality": "?"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "orderBy",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@17"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "limit"
              },
              {
                "$type": "Assignment",
                "feature": "limit",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@98"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "offset"
              },
              {
                "$type": "Assignment",
                "feature": "offset",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@98"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "for"
              },
              {
                "$type": "Assignment",
                "feature": "for",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@55"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "update"
              },
              {
                "$type": "Assignment",
                "feature": "update",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@56"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "allRows",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "include"
                }
              },
              {
                "$type": "Keyword",
                "value": "deleted"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "OrderByClause",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "order"
          },
          {
            "$type": "Keyword",
            "value": "by"
          },
          {
            "$type": "Assignment",
            "feature": "items",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@49"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "items",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@49"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ",",
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "HavingClause",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "having"
          },
          {
            "$type": "Assignment",
            "feature": "expr",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@28"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SoqlChildQuery",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "select"
          },
          {
            "$type": "Assignment",
            "feature": "fields",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@20"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "fields",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@20"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ",",
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": "from"
          },
          {
            "$type": "Assignment",
            "feature": "childField",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@90"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "childFieldAlias",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@96"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "where",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@27"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "orderBy",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@17"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "limit"
              },
              {
                "$type": "Assignment",
                "feature": "limit",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@98"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "offset"
              },
              {
                "$type": "Assignment",
                "feature": "offset",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@98"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SelectField",
      "inferredType": {
        "$type": "InferredType",
        "name": "SelectField"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@72"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@73"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@74"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@75"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@21"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@22"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@52"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@19"
                },
                "arguments": []
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ]
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "FormulaField",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "formula",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@101"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ":"
              },
              {
                "$type": "Assignment",
                "feature": "type",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@90"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "as",
                "cardinality": "?"
              },
              {
                "$type": "Assignment",
                "feature": "alias",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@96"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "PolyField",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "typeof"
          },
          {
            "$type": "Assignment",
            "feature": "what",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@90"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "objects",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@23"
              },
              "arguments": []
            },
            "cardinality": "*"
          },
          {
            "$type": "Assignment",
            "feature": "else",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@24"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "end",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@90"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "as"
              },
              {
                "$type": "Assignment",
                "feature": "alias",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@96"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "PolyFieldSobjectExpr",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "when"
          },
          {
            "$type": "Assignment",
            "feature": "object",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@90"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": "then"
          },
          {
            "$type": "Assignment",
            "feature": "fields",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@25"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "fields",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@25"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ",",
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "PolyFieldElseExpr",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "else"
          },
          {
            "$type": "Assignment",
            "feature": "fields",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@25"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "fields",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@25"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ",",
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "PolyFieldValue",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@72"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@73"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@52"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ScopeClause",
      "inferredType": {
        "$type": "InferredType",
        "name": "ScopeClause"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "using"
          },
          {
            "$type": "Keyword",
            "value": "scope"
          },
          {
            "$type": "Assignment",
            "feature": "scope",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@58"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "WhereClause",
      "inferredType": {
        "$type": "InferredType",
        "name": "WhereClause"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "where"
          },
          {
            "$type": "Assignment",
            "feature": "expr",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@28"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Expr",
      "inferredType": {
        "$type": "InferredType",
        "name": "Expr"
      },
      "definition": {
        "$type": "RuleCall",
        "rule": {
          "$ref": "#/rules@29"
        },
        "arguments": []
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "OrExpr",
      "inferredType": {
        "$type": "InferredType",
        "name": "Expr"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@30"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "OrExpr"
                },
                "feature": "left",
                "operator": "="
              },
              {
                "$type": "Keyword",
                "value": "or"
              },
              {
                "$type": "Assignment",
                "feature": "right",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@30"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "AndExpr",
      "inferredType": {
        "$type": "InferredType",
        "name": "Expr"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@31"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "AndExpr"
                },
                "feature": "left",
                "operator": "="
              },
              {
                "$type": "Keyword",
                "value": "and"
              },
              {
                "$type": "Assignment",
                "feature": "right",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@31"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "PrimaryExpr",
      "inferredType": {
        "$type": "InferredType",
        "name": "Expr"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "paren",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "("
                }
              },
              {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@28"
                },
                "arguments": []
              },
              {
                "$type": "Assignment",
                "feature": "paren",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": ")"
                }
              }
            ]
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@35"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@32"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "NotExpr",
      "inferredType": {
        "$type": "InferredType",
        "name": "Expr"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Action",
            "inferredType": {
              "$type": "InferredType",
              "name": "NotExpr"
            }
          },
          {
            "$type": "Keyword",
            "value": "not"
          },
          {
            "$type": "Assignment",
            "feature": "expr",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@28"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "fragment": true,
      "name": "ExprCondFragment",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "left",
            "operator": "=",
            "terminal": {
              "$type": "Alternatives",
              "elements": [
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@72"
                  },
                  "arguments": []
                },
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@73"
                  },
                  "arguments": []
                },
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@52"
                  },
                  "arguments": []
                }
              ]
            }
          },
          {
            "$type": "Assignment",
            "feature": "operNot",
            "operator": "?=",
            "terminal": {
              "$type": "Keyword",
              "value": "not"
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "oper",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@34"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "right",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@36"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ExprOper",
      "returnType": {
        "$ref": "#/types@0"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Keyword",
            "value": "="
          },
          {
            "$type": "Keyword",
            "value": "!="
          },
          {
            "$type": "Keyword",
            "value": "<>"
          },
          {
            "$type": "Keyword",
            "value": "<"
          },
          {
            "$type": "Keyword",
            "value": "<="
          },
          {
            "$type": "Keyword",
            "value": ">"
          },
          {
            "$type": "Keyword",
            "value": ">="
          },
          {
            "$type": "Keyword",
            "value": "like"
          },
          {
            "$type": "Keyword",
            "value": "in"
          },
          {
            "$type": "Keyword",
            "value": "includes"
          },
          {
            "$type": "Keyword",
            "value": "excludes"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ExprCond",
      "inferredType": {
        "$type": "InferredType",
        "name": "ExprCond"
      },
      "definition": {
        "$type": "RuleCall",
        "rule": {
          "$ref": "#/rules@33"
        },
        "arguments": []
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ExprValue",
      "inferredType": {
        "$type": "InferredType",
        "name": "ExprValue"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@76"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@78"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@79"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@82"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@83"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@80"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@81"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@85"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@84"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@37"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@77"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@39"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ValueIn",
      "inferredType": {
        "$type": "InferredType",
        "name": "ValueIn"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "values",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@38"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "values",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@38"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ",",
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "InValue",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@76"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@78"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@79"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@82"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@83"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@80"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@81"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@85"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@84"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@77"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@83"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SubQuery",
      "inferredType": {
        "$type": "InferredType",
        "name": "SubQuery"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "value",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@16"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SecurityContext",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "with"
          },
          {
            "$type": "Assignment",
            "feature": "mode",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@41"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "WithSecurityMode",
      "returnType": {
        "$ref": "#/types@1"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Keyword",
            "value": "security_enforced"
          },
          {
            "$type": "Keyword",
            "value": "system_mode"
          },
          {
            "$type": "Keyword",
            "value": "user_mode"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DataCategory",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "with"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "dataCategory",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "data"
                }
              },
              {
                "$type": "Keyword",
                "value": "category"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "exprs",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@44"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "and"
              },
              {
                "$type": "Assignment",
                "feature": "exprs",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@44"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DataCategorySelectors",
      "returnType": {
        "$ref": "#/types@2"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Keyword",
            "value": "at"
          },
          {
            "$type": "Keyword",
            "value": "above"
          },
          {
            "$type": "Keyword",
            "value": "below"
          },
          {
            "$type": "Keyword",
            "value": "above_or_below"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DataCategorySelection",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "group",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@96"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "selector",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@43"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "Alternatives",
              "elements": [
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@45"
                  },
                  "arguments": []
                },
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@46"
                  },
                  "arguments": []
                }
              ]
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DataCategoryName",
      "definition": {
        "$type": "Assignment",
        "feature": "value",
        "operator": "=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@96"
          },
          "arguments": []
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DataCategoryNames",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "values",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@96"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "values",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@96"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ",",
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "GroupByClause",
      "inferredType": {
        "$type": "InferredType",
        "name": "GroupByClause"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "group"
          },
          {
            "$type": "Assignment",
            "feature": "local",
            "operator": "?=",
            "terminal": {
              "$type": "Keyword",
              "value": "local"
            },
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": "by"
          },
          {
            "$type": "Assignment",
            "feature": "fields",
            "operator": "+=",
            "terminal": {
              "$type": "Alternatives",
              "elements": [
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@72"
                  },
                  "arguments": []
                },
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@73"
                  },
                  "arguments": []
                },
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@48"
                  },
                  "arguments": []
                }
              ]
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "fields",
                "operator": "+=",
                "terminal": {
                  "$type": "Alternatives",
                  "elements": [
                    {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@72"
                      },
                      "arguments": []
                    },
                    {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@73"
                      },
                      "arguments": []
                    },
                    {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@48"
                      },
                      "arguments": []
                    }
                  ]
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ",",
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "GroupByFunc",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@90"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "args",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@54"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": ","
                  },
                  {
                    "$type": "Assignment",
                    "feature": "args",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@54"
                      },
                      "arguments": []
                    }
                  }
                ],
                "cardinality": "*"
              },
              {
                "$type": "Keyword",
                "value": ",",
                "cardinality": "?"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ")"
          },
          {
            "$type": "Assignment",
            "feature": "alias",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@96"
              },
              "arguments": []
            },
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "OrderByItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "source",
            "operator": "=",
            "terminal": {
              "$type": "Alternatives",
              "elements": [
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@72"
                  },
                  "arguments": []
                },
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@73"
                  },
                  "arguments": []
                },
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@52"
                  },
                  "arguments": []
                }
              ]
            }
          },
          {
            "$type": "Assignment",
            "feature": "direction",
            "operator": "=",
            "terminal": {
              "$type": "Alternatives",
              "elements": [
                {
                  "$type": "Keyword",
                  "value": "asc"
                },
                {
                  "$type": "Keyword",
                  "value": "desc"
                }
              ]
            },
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "nulls"
              },
              {
                "$type": "Assignment",
                "feature": "nullSort",
                "operator": "=",
                "terminal": {
                  "$type": "Alternatives",
                  "elements": [
                    {
                      "$type": "Keyword",
                      "value": "first"
                    },
                    {
                      "$type": "Keyword",
                      "value": "last"
                    }
                  ]
                }
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "LimitClause",
      "inferredType": {
        "$type": "InferredType",
        "name": "LimitClause"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "limit"
          },
          {
            "$type": "Assignment",
            "feature": "value",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@98"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "OffsetClause",
      "inferredType": {
        "$type": "InferredType",
        "name": "OffsetClause"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "offset"
          },
          {
            "$type": "Assignment",
            "feature": "value",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@98"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Func",
      "inferredType": {
        "$type": "InferredType",
        "name": "Func"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@90"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "args",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@54"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": ","
                  },
                  {
                    "$type": "Assignment",
                    "feature": "args",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@54"
                      },
                      "arguments": []
                    }
                  }
                ],
                "cardinality": "*"
              },
              {
                "$type": "Keyword",
                "value": ",",
                "cardinality": "?"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ")"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "as",
                "cardinality": "?"
              },
              {
                "$type": "Assignment",
                "feature": "alias",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@96"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SubFunc",
      "inferredType": {
        "$type": "InferredType",
        "name": "SubFunc"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@90"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "args",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@54"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": ","
                  },
                  {
                    "$type": "Assignment",
                    "feature": "args",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@54"
                      },
                      "arguments": []
                    }
                  }
                ],
                "cardinality": "*"
              },
              {
                "$type": "Keyword",
                "value": ",",
                "cardinality": "?"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "FuncArg",
      "inferredType": {
        "$type": "InferredType",
        "name": "FuncArg"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@72"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@73"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@83"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@65"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@66"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@78"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@79"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@82"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@80"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@81"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@85"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@84"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@77"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@53"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SoqlForLiterals",
      "returnType": {
        "$ref": "#/types@3"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Keyword",
            "value": "update"
          },
          {
            "$type": "Keyword",
            "value": "view"
          },
          {
            "$type": "Keyword",
            "value": "reference"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SoqlUpValueDateVals",
      "returnType": {
        "$ref": "#/types@4"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Keyword",
            "value": "tracking"
          },
          {
            "$type": "Keyword",
            "value": "viewstat"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ValueDateVals",
      "returnType": {
        "$ref": "#/types@5"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Keyword",
            "value": "yesterday"
          },
          {
            "$type": "Keyword",
            "value": "today"
          },
          {
            "$type": "Keyword",
            "value": "tomorrow"
          },
          {
            "$type": "Keyword",
            "value": "last_week"
          },
          {
            "$type": "Keyword",
            "value": "this_week"
          },
          {
            "$type": "Keyword",
            "value": "next_week"
          },
          {
            "$type": "Keyword",
            "value": "last_month"
          },
          {
            "$type": "Keyword",
            "value": "this_month"
          },
          {
            "$type": "Keyword",
            "value": "next_month"
          },
          {
            "$type": "Keyword",
            "value": "last_90_days"
          },
          {
            "$type": "Keyword",
            "value": "next_90_days"
          },
          {
            "$type": "Keyword",
            "value": "this_quarter"
          },
          {
            "$type": "Keyword",
            "value": "last_quarter"
          },
          {
            "$type": "Keyword",
            "value": "next_quarter"
          },
          {
            "$type": "Keyword",
            "value": "this_year"
          },
          {
            "$type": "Keyword",
            "value": "last_year"
          },
          {
            "$type": "Keyword",
            "value": "next_year"
          },
          {
            "$type": "Keyword",
            "value": "this_fiscal_quarter"
          },
          {
            "$type": "Keyword",
            "value": "last_fiscal_quarter"
          },
          {
            "$type": "Keyword",
            "value": "next_fiscal_quarter"
          },
          {
            "$type": "Keyword",
            "value": "this_fiscal_year"
          },
          {
            "$type": "Keyword",
            "value": "last_fiscal_year"
          },
          {
            "$type": "Keyword",
            "value": "next_fiscal_year"
          },
          {
            "$type": "Keyword",
            "value": "last_n_days"
          },
          {
            "$type": "Keyword",
            "value": "next_n_days"
          },
          {
            "$type": "Keyword",
            "value": "next_n_quarters"
          },
          {
            "$type": "Keyword",
            "value": "last_n_quarters"
          },
          {
            "$type": "Keyword",
            "value": "next_n_years"
          },
          {
            "$type": "Keyword",
            "value": "last_n_years"
          },
          {
            "$type": "Keyword",
            "value": "next_n_fiscal_years"
          },
          {
            "$type": "Keyword",
            "value": "last_n_fiscal_years"
          },
          {
            "$type": "Keyword",
            "value": "next_n_fiscal_quarters"
          },
          {
            "$type": "Keyword",
            "value": "last_n_fiscal_quarters"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ScopeLiterals",
      "returnType": {
        "$ref": "#/types@6"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Keyword",
            "value": "mru"
          },
          {
            "$type": "Keyword",
            "value": "delegated"
          },
          {
            "$type": "Keyword",
            "value": "everything"
          },
          {
            "$type": "Keyword",
            "value": "mine"
          },
          {
            "$type": "Keyword",
            "value": "my_territory"
          },
          {
            "$type": "Keyword",
            "value": "my_team_territory"
          },
          {
            "$type": "Keyword",
            "value": "mine"
          },
          {
            "$type": "Keyword",
            "value": "mine_and_my_groups"
          },
          {
            "$type": "Keyword",
            "value": "team"
          },
          {
            "$type": "Keyword",
            "value": "scopingRule"
          },
          {
            "$type": "Keyword",
            "value": "allPrivate"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SoslStmt",
      "inferredType": {
        "$type": "InferredType",
        "name": "SoslStmt"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "find"
          },
          {
            "$type": "Assignment",
            "feature": "searchTerm",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@102"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "searchInClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@60"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "returningClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@61"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "withClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@67"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "limitClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@50"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "updateClause",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@71"
              },
              "arguments": []
            },
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SoslSearchInClause",
      "inferredType": {
        "$type": "InferredType",
        "name": "SoslSearchInClause"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "in"
          },
          {
            "$type": "Assignment",
            "feature": "searchIn",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@90"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "kwFields",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@90"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SoslReturningClause",
      "inferredType": {
        "$type": "InferredType",
        "name": "SoslReturningClause"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "returning"
          },
          {
            "$type": "Assignment",
            "feature": "returningExprs",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@62"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "returningExprs",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@62"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ",",
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SoslReturningExpr",
      "inferredType": {
        "$type": "InferredType",
        "name": "SoslReturningExpr"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "sobject",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@90"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "fields",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@63"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": ","
                  },
                  {
                    "$type": "Assignment",
                    "feature": "fields",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@63"
                      },
                      "arguments": []
                    }
                  }
                ],
                "cardinality": "*"
              },
              {
                "$type": "Keyword",
                "value": ",",
                "cardinality": "?"
              },
              {
                "$type": "Assignment",
                "feature": "whereClause",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@27"
                  },
                  "arguments": []
                },
                "cardinality": "?"
              },
              {
                "$type": "Assignment",
                "feature": "usingListViewClause",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@64"
                  },
                  "arguments": []
                },
                "cardinality": "?"
              },
              {
                "$type": "Assignment",
                "feature": "orderByClause",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@17"
                  },
                  "arguments": []
                },
                "cardinality": "?"
              },
              {
                "$type": "Assignment",
                "feature": "limitClause",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@50"
                  },
                  "arguments": []
                },
                "cardinality": "?"
              },
              {
                "$type": "Assignment",
                "feature": "offsetClause",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@51"
                  },
                  "arguments": []
                },
                "cardinality": "?"
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SoslField",
      "inferredType": {
        "$type": "InferredType",
        "name": "SoslField"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@72"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@73"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@52"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SoslUsingListViewClause",
      "inferredType": {
        "$type": "InferredType",
        "name": "SoslUsingListViewClause"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "using"
          },
          {
            "$type": "Assignment",
            "feature": "kwListView",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@90"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": "="
          },
          {
            "$type": "Assignment",
            "feature": "listView",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@90"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ValueField",
      "definition": {
        "$type": "Assignment",
        "feature": "value",
        "operator": "=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@90"
          },
          "arguments": []
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ValueRelField",
      "definition": {
        "$type": "Assignment",
        "feature": "value",
        "operator": "=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@86"
          },
          "arguments": []
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SoslWithClause",
      "inferredType": {
        "$type": "InferredType",
        "name": "SoslWithClause"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@68"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@42"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@69"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SoslWithCond",
      "inferredType": {
        "$type": "InferredType",
        "name": "SoslWithCond"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "with"
          },
          {
            "$type": "Assignment",
            "feature": "left",
            "operator": "=",
            "terminal": {
              "$type": "Alternatives",
              "elements": [
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@72"
                  },
                  "arguments": []
                },
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@73"
                  },
                  "arguments": []
                }
              ]
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "oper",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@34"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Assignment",
                "feature": "right",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@70"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SoslWithSnippet",
      "inferredType": {
        "$type": "InferredType",
        "name": "SoslWithSnippet"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "with"
          },
          {
            "$type": "Keyword",
            "value": "snippet"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "left",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@90"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": "="
              },
              {
                "$type": "Assignment",
                "feature": "right",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@70"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SoslWithCondValue",
      "inferredType": {
        "$type": "InferredType",
        "name": "SoslWithCondValue"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@78"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@79"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@82"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@83"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@80"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@81"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@85"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@84"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@37"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@77"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "UpdateClause",
      "inferredType": {
        "$type": "InferredType",
        "name": "UpdateClause"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "update"
          },
          {
            "$type": "Assignment",
            "feature": "type",
            "operator": "=",
            "terminal": {
              "$type": "Alternatives",
              "elements": [
                {
                  "$type": "Keyword",
                  "value": "tracking"
                },
                {
                  "$type": "Keyword",
                  "value": "viewstat"
                }
              ]
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Field",
      "inferredType": {
        "$type": "InferredType",
        "name": "Field"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "field",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@90"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "as"
              },
              {
                "$type": "Assignment",
                "feature": "alias",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@96"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "RelField",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "field",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@86"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "as"
              },
              {
                "$type": "Assignment",
                "feature": "alias",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@96"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "WildField",
      "inferredType": {
        "$type": "InferredType",
        "name": "WildField"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "field",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@91"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "as"
              },
              {
                "$type": "Assignment",
                "feature": "alias",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@96"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "WildRelField",
      "inferredType": {
        "$type": "InferredType",
        "name": "WildRelField"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "field",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@89"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "as"
              },
              {
                "$type": "Assignment",
                "feature": "alias",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@96"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ApexVar",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": ":"
          },
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "Alternatives",
              "elements": [
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@87"
                  },
                  "arguments": []
                },
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@88"
                  },
                  "arguments": []
                }
              ]
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Boolean",
      "inferredType": {
        "$type": "InferredType",
        "name": "Boolean"
      },
      "definition": {
        "$type": "Assignment",
        "feature": "value",
        "operator": "=",
        "terminal": {
          "$type": "Alternatives",
          "elements": [
            {
              "$type": "Keyword",
              "value": "true"
            },
            {
              "$type": "Keyword",
              "value": "false"
            }
          ]
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Datetime",
      "inferredType": {
        "$type": "InferredType",
        "name": "Datetime"
      },
      "definition": {
        "$type": "Assignment",
        "feature": "value",
        "operator": "=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@92"
          },
          "arguments": []
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DateVal",
      "inferredType": {
        "$type": "InferredType",
        "name": "DateVal"
      },
      "definition": {
        "$type": "Assignment",
        "feature": "value",
        "operator": "=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@93"
          },
          "arguments": []
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Decimal",
      "inferredType": {
        "$type": "InferredType",
        "name": "Decimal"
      },
      "definition": {
        "$type": "Assignment",
        "feature": "value",
        "operator": "=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@97"
          },
          "arguments": []
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Int",
      "inferredType": {
        "$type": "InferredType",
        "name": "Int"
      },
      "definition": {
        "$type": "Assignment",
        "feature": "value",
        "operator": "=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@98"
          },
          "arguments": []
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DateConst",
      "inferredType": {
        "$type": "InferredType",
        "name": "DateConst"
      },
      "definition": {
        "$type": "Assignment",
        "feature": "value",
        "operator": "=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@57"
          },
          "arguments": []
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DateN",
      "inferredType": {
        "$type": "InferredType",
        "name": "DateN"
      },
      "definition": {
        "$type": "Assignment",
        "feature": "value",
        "operator": "=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@94"
          },
          "arguments": []
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "StringVal",
      "inferredType": {
        "$type": "InferredType",
        "name": "StringVal"
      },
      "definition": {
        "$type": "Assignment",
        "feature": "value",
        "operator": "=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@99"
          },
          "arguments": []
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "NullValue",
      "inferredType": {
        "$type": "InferredType",
        "name": "NullValue"
      },
      "definition": {
        "$type": "Assignment",
        "feature": "value",
        "operator": "=",
        "terminal": {
          "$type": "Keyword",
          "value": "null"
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "RelId",
      "dataType": "string",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@90"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "."
              },
              {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@90"
                },
                "arguments": []
              }
            ],
            "cardinality": "+"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "IdOrRelId",
      "dataType": "string",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@90"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "."
              },
              {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@90"
                },
                "arguments": []
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DollarId",
      "dataType": "string",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "$"
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@87"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "WildRelId",
      "dataType": "string",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@90"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "."
              },
              {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@90"
                },
                "arguments": []
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": "."
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@91"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Id",
      "dataType": "string",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Keyword",
            "value": "all"
          },
          {
            "$type": "Keyword",
            "value": "group"
          },
          {
            "$type": "Keyword",
            "value": "order"
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@96"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "WildId",
      "dataType": "string",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Keyword",
            "value": "all"
          },
          {
            "$type": "Keyword",
            "value": "group"
          },
          {
            "$type": "Keyword",
            "value": "order"
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@95"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "TerminalRule",
      "name": "DATETIME",
      "type": {
        "$type": "ReturnType",
        "name": "string"
      },
      "definition": {
        "$type": "RegexToken",
        "regex": "/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\\\\.[0-9]+)?(\\\\Z|\\\\.[0-9]+Z|\\\\+[0-9]{2}:[0-9]{2}|\\\\-[0-9]{2}:[0-9]{2}|\\\\+[0-9]{4}|\\\\-[0-9]{4})/"
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "DATE",
      "type": {
        "$type": "ReturnType",
        "name": "string"
      },
      "definition": {
        "$type": "RegexToken",
        "regex": "/[0-9]{4}-[0-9]{2}-[0-9]{2}/"
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "DATEN",
      "type": {
        "$type": "ReturnType",
        "name": "string"
      },
      "definition": {
        "$type": "RegexToken",
        "regex": "/[a-zA-Z_]+:[0-9]+/"
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "WILD_ID",
      "type": {
        "$type": "ReturnType",
        "name": "string"
      },
      "definition": {
        "$type": "RegexToken",
        "regex": "/(([_a-zA-Z0-9*])+\\\\*([_a-zA-Z0-9*])+)|(\\\\*([_a-zA-Z0-9*])+)|(([_a-zA-Z0-9*])+\\\\*)|\\\\*/"
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "ID",
      "definition": {
        "$type": "RegexToken",
        "regex": "/[_a-zA-Z][_a-zA-Z0-9]*/"
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "DECIMAL",
      "type": {
        "$type": "ReturnType",
        "name": "number"
      },
      "definition": {
        "$type": "RegexToken",
        "regex": "/[+-]?[0-9]+\\\\.[0-9]+/"
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "INT",
      "type": {
        "$type": "ReturnType",
        "name": "number"
      },
      "definition": {
        "$type": "RegexToken",
        "regex": "/[+-]?[0-9]+/"
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "SINGLE_STRING",
      "type": {
        "$type": "ReturnType",
        "name": "string"
      },
      "definition": {
        "$type": "RegexToken",
        "regex": "/('[^'\\\\\\\\]*(?:\\\\\\\\.[^'\\\\\\\\]*)*')/"
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "DOUBLE_STRING",
      "type": {
        "$type": "ReturnType",
        "name": "string"
      },
      "definition": {
        "$type": "RegexToken",
        "regex": "/(\\"[^\\"\\\\\\\\]*(?:\\\\\\\\.[^\\"\\\\\\\\]*)*\\")/"
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "FORMULA_STRING",
      "type": {
        "$type": "ReturnType",
        "name": "string"
      },
      "definition": {
        "$type": "TerminalGroup",
        "elements": [
          {
            "$type": "CharacterRange",
            "left": {
              "$type": "Keyword",
              "value": "{{"
            }
          },
          {
            "$type": "NegatedToken",
            "terminal": {
              "$type": "TerminalAlternatives",
              "elements": [
                {
                  "$type": "TerminalAlternatives",
                  "elements": [
                    {
                      "$type": "CharacterRange",
                      "left": {
                        "$type": "Keyword",
                        "value": "\\\\"
                      }
                    },
                    {
                      "$type": "CharacterRange",
                      "left": {
                        "$type": "Keyword",
                        "value": "{"
                      }
                    }
                  ]
                },
                {
                  "$type": "CharacterRange",
                  "left": {
                    "$type": "Keyword",
                    "value": "}"
                  }
                }
              ]
            }
          },
          {
            "$type": "CharacterRange",
            "left": {
              "$type": "Keyword",
              "value": "}}"
            }
          }
        ]
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "SEARCH_STRING",
      "type": {
        "$type": "ReturnType",
        "name": "string"
      },
      "definition": {
        "$type": "TerminalGroup",
        "elements": [
          {
            "$type": "CharacterRange",
            "left": {
              "$type": "Keyword",
              "value": "{"
            }
          },
          {
            "$type": "NegatedToken",
            "terminal": {
              "$type": "TerminalAlternatives",
              "elements": [
                {
                  "$type": "TerminalAlternatives",
                  "elements": [
                    {
                      "$type": "CharacterRange",
                      "left": {
                        "$type": "Keyword",
                        "value": "\\\\"
                      }
                    },
                    {
                      "$type": "CharacterRange",
                      "left": {
                        "$type": "Keyword",
                        "value": "{"
                      }
                    }
                  ]
                },
                {
                  "$type": "CharacterRange",
                  "left": {
                    "$type": "Keyword",
                    "value": "}"
                  }
                }
              ]
            }
          },
          {
            "$type": "CharacterRange",
            "left": {
              "$type": "Keyword",
              "value": "}"
            }
          }
        ]
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "hidden": true,
      "name": "ML_COMMENT",
      "definition": {
        "$type": "RegexToken",
        "regex": "/\\\\/\\\\*[\\\\s\\\\S]*?\\\\*\\\\//"
      },
      "fragment": false
    },
    {
      "$type": "TerminalRule",
      "hidden": true,
      "name": "SL_COMMENT",
      "definition": {
        "$type": "RegexToken",
        "regex": "/\\\\/\\\\/[^\\\\n\\\\r]*/"
      },
      "fragment": false
    },
    {
      "$type": "TerminalRule",
      "hidden": true,
      "name": "WS",
      "type": {
        "$type": "ReturnType",
        "name": "string"
      },
      "definition": {
        "$type": "TerminalAlternatives",
        "elements": [
          {
            "$type": "TerminalAlternatives",
            "elements": [
              {
                "$type": "TerminalAlternatives",
                "elements": [
                  {
                    "$type": "CharacterRange",
                    "left": {
                      "$type": "Keyword",
                      "value": " "
                    }
                  },
                  {
                    "$type": "CharacterRange",
                    "left": {
                      "$type": "Keyword",
                      "value": "\\t"
                    }
                  }
                ]
              },
              {
                "$type": "CharacterRange",
                "left": {
                  "$type": "Keyword",
                  "value": "\\r"
                }
              }
            ]
          },
          {
            "$type": "CharacterRange",
            "left": {
              "$type": "Keyword",
              "value": "\\n"
            }
          }
        ],
        "cardinality": "+"
      },
      "fragment": false
    }
  ],
  "types": [
    {
      "$type": "Type",
      "name": "ExprOper",
      "type": {
        "$type": "UnionType",
        "types": [
          {
            "$type": "SimpleType",
            "stringType": "="
          },
          {
            "$type": "SimpleType",
            "stringType": "!="
          },
          {
            "$type": "SimpleType",
            "stringType": "<>"
          },
          {
            "$type": "SimpleType",
            "stringType": "<"
          },
          {
            "$type": "SimpleType",
            "stringType": "<="
          },
          {
            "$type": "SimpleType",
            "stringType": ">"
          },
          {
            "$type": "SimpleType",
            "stringType": ">="
          },
          {
            "$type": "SimpleType",
            "stringType": "like"
          },
          {
            "$type": "SimpleType",
            "stringType": "in"
          },
          {
            "$type": "SimpleType",
            "stringType": "includes"
          },
          {
            "$type": "SimpleType",
            "stringType": "excludes"
          }
        ]
      }
    },
    {
      "$type": "Type",
      "name": "WithSecurityMode",
      "type": {
        "$type": "UnionType",
        "types": [
          {
            "$type": "SimpleType",
            "stringType": "security_enforced"
          },
          {
            "$type": "SimpleType",
            "stringType": "system_mode"
          },
          {
            "$type": "SimpleType",
            "stringType": "user_mode"
          }
        ]
      }
    },
    {
      "$type": "Type",
      "name": "DataCategorySelectors",
      "type": {
        "$type": "UnionType",
        "types": [
          {
            "$type": "SimpleType",
            "stringType": "at"
          },
          {
            "$type": "SimpleType",
            "stringType": "above"
          },
          {
            "$type": "SimpleType",
            "stringType": "below"
          },
          {
            "$type": "SimpleType",
            "stringType": "above_or_below"
          }
        ]
      }
    },
    {
      "$type": "Type",
      "name": "SoqlForLiterals",
      "type": {
        "$type": "UnionType",
        "types": [
          {
            "$type": "SimpleType",
            "stringType": "update"
          },
          {
            "$type": "SimpleType",
            "stringType": "view"
          },
          {
            "$type": "SimpleType",
            "stringType": "reference"
          }
        ]
      }
    },
    {
      "$type": "Type",
      "name": "SoqlUpValueDateVals",
      "type": {
        "$type": "UnionType",
        "types": [
          {
            "$type": "SimpleType",
            "stringType": "tracking"
          },
          {
            "$type": "SimpleType",
            "stringType": "viewstat"
          }
        ]
      }
    },
    {
      "$type": "Type",
      "name": "ValueDateVals",
      "type": {
        "$type": "UnionType",
        "types": [
          {
            "$type": "SimpleType",
            "stringType": "yesterday"
          },
          {
            "$type": "SimpleType",
            "stringType": "today"
          },
          {
            "$type": "SimpleType",
            "stringType": "tomorrow"
          },
          {
            "$type": "SimpleType",
            "stringType": "last_week"
          },
          {
            "$type": "SimpleType",
            "stringType": "this_week"
          },
          {
            "$type": "SimpleType",
            "stringType": "next_week"
          },
          {
            "$type": "SimpleType",
            "stringType": "last_month"
          },
          {
            "$type": "SimpleType",
            "stringType": "this_month"
          },
          {
            "$type": "SimpleType",
            "stringType": "next_month"
          },
          {
            "$type": "SimpleType",
            "stringType": "last_90_days"
          },
          {
            "$type": "SimpleType",
            "stringType": "next_90_days"
          },
          {
            "$type": "SimpleType",
            "stringType": "this_quarter"
          },
          {
            "$type": "SimpleType",
            "stringType": "last_quarter"
          },
          {
            "$type": "SimpleType",
            "stringType": "next_quarter"
          },
          {
            "$type": "SimpleType",
            "stringType": "this_year"
          },
          {
            "$type": "SimpleType",
            "stringType": "last_year"
          },
          {
            "$type": "SimpleType",
            "stringType": "next_year"
          },
          {
            "$type": "SimpleType",
            "stringType": "this_fiscal_quarter"
          },
          {
            "$type": "SimpleType",
            "stringType": "last_fiscal_quarter"
          },
          {
            "$type": "SimpleType",
            "stringType": "next_fiscal_quarter"
          },
          {
            "$type": "SimpleType",
            "stringType": "this_fiscal_year"
          },
          {
            "$type": "SimpleType",
            "stringType": "last_fiscal_year"
          },
          {
            "$type": "SimpleType",
            "stringType": "next_fiscal_year"
          },
          {
            "$type": "SimpleType",
            "stringType": "last_n_days"
          },
          {
            "$type": "SimpleType",
            "stringType": "next_n_days"
          },
          {
            "$type": "SimpleType",
            "stringType": "next_n_quarters"
          },
          {
            "$type": "SimpleType",
            "stringType": "last_n_quarters"
          },
          {
            "$type": "SimpleType",
            "stringType": "next_n_years"
          },
          {
            "$type": "SimpleType",
            "stringType": "last_n_years"
          },
          {
            "$type": "SimpleType",
            "stringType": "next_n_fiscal_years"
          },
          {
            "$type": "SimpleType",
            "stringType": "last_n_fiscal_years"
          },
          {
            "$type": "SimpleType",
            "stringType": "next_n_fiscal_quarters"
          },
          {
            "$type": "SimpleType",
            "stringType": "last_n_fiscal_quarters"
          }
        ]
      }
    },
    {
      "$type": "Type",
      "name": "ScopeLiterals",
      "type": {
        "$type": "UnionType",
        "types": [
          {
            "$type": "SimpleType",
            "stringType": "mru"
          },
          {
            "$type": "SimpleType",
            "stringType": "delegated"
          },
          {
            "$type": "SimpleType",
            "stringType": "everything"
          },
          {
            "$type": "SimpleType",
            "stringType": "mine"
          },
          {
            "$type": "SimpleType",
            "stringType": "my_territory"
          },
          {
            "$type": "SimpleType",
            "stringType": "my_team_territory"
          },
          {
            "$type": "SimpleType",
            "stringType": "mine"
          },
          {
            "$type": "SimpleType",
            "stringType": "mine_and_my_groups"
          },
          {
            "$type": "SimpleType",
            "stringType": "team"
          },
          {
            "$type": "SimpleType",
            "stringType": "scopingRule"
          },
          {
            "$type": "SimpleType",
            "stringType": "allPrivate"
          }
        ]
      }
    }
  ],
  "definesHiddenTokens": false,
  "hiddenTokens": [],
  "imports": [],
  "interfaces": [],
  "usedGrammars": []
}`)),fE={languageId:"sfsql",fileExtensions:[".sfsql"],caseInsensitive:!0,mode:"development"},ky={AstReflection:()=>new by},$y={Grammar:()=>dE(),LanguageMetaData:()=>fE,parser:{}};function hE(e){const t=e.validation.ValidationRegistry,r=e.validation.SfsqlValidator;t.register({},r)}var Ey=class{},pE={validation:{SfsqlValidator:()=>new Ey}};function mE(e){const t=Un(nf(e),ky),r=Un(rf({shared:t}),$y,pE);return t.ServiceRegistry.register(r),hE(r),{shared:t,Sfsql:r}}var gE=H(((e,t)=>{t.exports={}})),Ay=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Message=e.NotificationType9=e.NotificationType8=e.NotificationType7=e.NotificationType6=e.NotificationType5=e.NotificationType4=e.NotificationType3=e.NotificationType2=e.NotificationType1=e.NotificationType0=e.NotificationType=e.RequestType9=e.RequestType8=e.RequestType7=e.RequestType6=e.RequestType5=e.RequestType4=e.RequestType3=e.RequestType2=e.RequestType1=e.RequestType=e.RequestType0=e.AbstractMessageSignature=e.ParameterStructures=e.ResponseError=e.ErrorCodes=void 0;var t=aa(),r;(function(y){y.ParseError=-32700,y.InvalidRequest=-32600,y.MethodNotFound=-32601,y.InvalidParams=-32602,y.InternalError=-32603,y.jsonrpcReservedErrorRangeStart=-32099,y.serverErrorStart=-32099,y.MessageWriteError=-32099,y.MessageReadError=-32098,y.PendingResponseRejected=-32097,y.ConnectionInactive=-32096,y.ServerNotInitialized=-32002,y.UnknownErrorCode=-32001,y.jsonrpcReservedErrorRangeEnd=-32e3,y.serverErrorEnd=-32e3})(r||(e.ErrorCodes=r={}));var n=class Iy extends Error{constructor(b,q,O){super(q),this.code=t.number(b)?b:r.UnknownErrorCode,this.data=O,Object.setPrototypeOf(this,Iy.prototype)}toJson(){const b={code:this.code,message:this.message};return this.data!==void 0&&(b.data=this.data),b}};e.ResponseError=n;var i=class Do{constructor(b){this.kind=b}static is(b){return b===Do.auto||b===Do.byName||b===Do.byPosition}toString(){return this.kind}};e.ParameterStructures=i,i.auto=new i("auto"),i.byPosition=new i("byPosition"),i.byName=new i("byName");var s=class{constructor(y,b){this.method=y,this.numberOfParams=b}get parameterStructures(){return i.auto}};e.AbstractMessageSignature=s;var a=class extends s{constructor(y){super(y,0)}};e.RequestType0=a;var o=class extends s{constructor(y,b=i.auto){super(y,1),this._parameterStructures=b}get parameterStructures(){return this._parameterStructures}};e.RequestType=o;var l=class extends s{constructor(y,b=i.auto){super(y,1),this._parameterStructures=b}get parameterStructures(){return this._parameterStructures}};e.RequestType1=l;var u=class extends s{constructor(y){super(y,2)}};e.RequestType2=u;var c=class extends s{constructor(y){super(y,3)}};e.RequestType3=c;var d=class extends s{constructor(y){super(y,4)}};e.RequestType4=d;var f=class extends s{constructor(y){super(y,5)}};e.RequestType5=f;var h=class extends s{constructor(y){super(y,6)}};e.RequestType6=h;var m=class extends s{constructor(y){super(y,7)}};e.RequestType7=m;var R=class extends s{constructor(y){super(y,8)}};e.RequestType8=R;var S=class extends s{constructor(y){super(y,9)}};e.RequestType9=S;var v=class extends s{constructor(y,b=i.auto){super(y,1),this._parameterStructures=b}get parameterStructures(){return this._parameterStructures}};e.NotificationType=v;var _=class extends s{constructor(y){super(y,0)}};e.NotificationType0=_;var T=class extends s{constructor(y,b=i.auto){super(y,1),this._parameterStructures=b}get parameterStructures(){return this._parameterStructures}};e.NotificationType1=T;var M=class extends s{constructor(y){super(y,2)}};e.NotificationType2=M;var F=class extends s{constructor(y){super(y,3)}};e.NotificationType3=F;var W=class extends s{constructor(y){super(y,4)}};e.NotificationType4=W;var U=class extends s{constructor(y){super(y,5)}};e.NotificationType5=U;var ee=class extends s{constructor(y){super(y,6)}};e.NotificationType6=ee;var se=class extends s{constructor(y){super(y,7)}};e.NotificationType7=se;var he=class extends s{constructor(y){super(y,8)}};e.NotificationType8=he;var x=class extends s{constructor(y){super(y,9)}};e.NotificationType9=x;var A;(function(y){function b($){const k=$;return k&&t.string(k.method)&&(t.string(k.id)||t.number(k.id))}y.isRequest=b;function q($){const k=$;return k&&t.string(k.method)&&$.id===void 0}y.isNotification=q;function O($){const k=$;return k&&(k.result!==void 0||!!k.error)&&(t.string(k.id)||t.number(k.id)||k.id===null)}y.isResponse=O})(A||(e.Message=A={}))})),Ny=H((e=>{var t;Object.defineProperty(e,"__esModule",{value:!0}),e.LRUCache=e.LinkedMap=e.Touch=void 0;var r;(function(s){s.None=0,s.First=1,s.AsOld=s.First,s.Last=2,s.AsNew=s.Last})(r||(e.Touch=r={}));var n=class{constructor(){this[t]="LinkedMap",this._map=new Map,this._head=void 0,this._tail=void 0,this._size=0,this._state=0}clear(){this._map.clear(),this._head=void 0,this._tail=void 0,this._size=0,this._state++}isEmpty(){return!this._head&&!this._tail}get size(){return this._size}get first(){return this._head?.value}get last(){return this._tail?.value}has(s){return this._map.has(s)}get(s,a=r.None){const o=this._map.get(s);if(o)return a!==r.None&&this.touch(o,a),o.value}set(s,a,o=r.None){let l=this._map.get(s);if(l)l.value=a,o!==r.None&&this.touch(l,o);else{switch(l={key:s,value:a,next:void 0,previous:void 0},o){case r.None:this.addItemLast(l);break;case r.First:this.addItemFirst(l);break;case r.Last:this.addItemLast(l);break;default:this.addItemLast(l);break}this._map.set(s,l),this._size++}return this}delete(s){return!!this.remove(s)}remove(s){const a=this._map.get(s);if(a)return this._map.delete(s),this.removeItem(a),this._size--,a.value}shift(){if(!this._head&&!this._tail)return;if(!this._head||!this._tail)throw new Error("Invalid list");const s=this._head;return this._map.delete(s.key),this.removeItem(s),this._size--,s.value}forEach(s,a){const o=this._state;let l=this._head;for(;l;){if(a?s.bind(a)(l.value,l.key,this):s(l.value,l.key,this),this._state!==o)throw new Error("LinkedMap got modified during iteration.");l=l.next}}keys(){const s=this._state;let a=this._head;const o={[Symbol.iterator]:()=>o,next:()=>{if(this._state!==s)throw new Error("LinkedMap got modified during iteration.");if(a){const l={value:a.key,done:!1};return a=a.next,l}else return{value:void 0,done:!0}}};return o}values(){const s=this._state;let a=this._head;const o={[Symbol.iterator]:()=>o,next:()=>{if(this._state!==s)throw new Error("LinkedMap got modified during iteration.");if(a){const l={value:a.value,done:!1};return a=a.next,l}else return{value:void 0,done:!0}}};return o}entries(){const s=this._state;let a=this._head;const o={[Symbol.iterator]:()=>o,next:()=>{if(this._state!==s)throw new Error("LinkedMap got modified during iteration.");if(a){const l={value:[a.key,a.value],done:!1};return a=a.next,l}else return{value:void 0,done:!0}}};return o}[(t=Symbol.toStringTag,Symbol.iterator)](){return this.entries()}trimOld(s){if(s>=this.size)return;if(s===0){this.clear();return}let a=this._head,o=this.size;for(;a&&o>s;)this._map.delete(a.key),a=a.next,o--;this._head=a,this._size=o,a&&(a.previous=void 0),this._state++}addItemFirst(s){if(!this._head&&!this._tail)this._tail=s;else if(this._head)s.next=this._head,this._head.previous=s;else throw new Error("Invalid list");this._head=s,this._state++}addItemLast(s){if(!this._head&&!this._tail)this._head=s;else if(this._tail)s.previous=this._tail,this._tail.next=s;else throw new Error("Invalid list");this._tail=s,this._state++}removeItem(s){if(s===this._head&&s===this._tail)this._head=void 0,this._tail=void 0;else if(s===this._head){if(!s.next)throw new Error("Invalid list");s.next.previous=void 0,this._head=s.next}else if(s===this._tail){if(!s.previous)throw new Error("Invalid list");s.previous.next=void 0,this._tail=s.previous}else{const a=s.next,o=s.previous;if(!a||!o)throw new Error("Invalid list");a.previous=o,o.next=a}s.next=void 0,s.previous=void 0,this._state++}touch(s,a){if(!this._head||!this._tail)throw new Error("Invalid list");if(!(a!==r.First&&a!==r.Last)){if(a===r.First){if(s===this._head)return;const o=s.next,l=s.previous;s===this._tail?(l.next=void 0,this._tail=l):(o.previous=l,l.next=o),s.previous=void 0,s.next=this._head,this._head.previous=s,this._head=s,this._state++}else if(a===r.Last){if(s===this._tail)return;const o=s.next,l=s.previous;s===this._head?(o.previous=void 0,this._head=o):(o.previous=l,l.next=o),s.next=void 0,s.previous=this._tail,this._tail.next=s,this._tail=s,this._state++}}}toJSON(){const s=[];return this.forEach((a,o)=>{s.push([o,a])}),s}fromJSON(s){this.clear();for(const[a,o]of s)this.set(a,o)}};e.LinkedMap=n;var i=class extends n{constructor(s,a=1){super(),this._limit=s,this._ratio=Math.min(Math.max(0,a),1)}get limit(){return this._limit}set limit(s){this._limit=s,this.checkTrim()}get ratio(){return this._ratio}set ratio(s){this._ratio=Math.min(Math.max(0,s),1),this.checkTrim()}get(s,a=r.AsNew){return super.get(s,a)}peek(s){return super.get(s,r.None)}set(s,a){return super.set(s,a,r.Last),this.checkTrim(),this}checkTrim(){this.size>this._limit&&this.trimOld(Math.round(this._limit*this._ratio))}};e.LRUCache=i})),yE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Disposable=void 0;var t;(function(r){function n(i){return{dispose:i}}r.create=n})(t||(e.Disposable=t={}))})),vE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.SharedArrayReceiverStrategy=e.SharedArraySenderStrategy=void 0;var t=Ll(),r;(function(o){o.Continue=0,o.Cancelled=1})(r||(r={}));var n=class{constructor(){this.buffers=new Map}enableCancellation(o){if(o.id===null)return;const l=new SharedArrayBuffer(4),u=new Int32Array(l,0,1);u[0]=r.Continue,this.buffers.set(o.id,l),o.$cancellationData=l}async sendCancellation(o,l){const u=this.buffers.get(l);if(u===void 0)return;const c=new Int32Array(u,0,1);Atomics.store(c,0,r.Cancelled)}cleanup(o){this.buffers.delete(o)}dispose(){this.buffers.clear()}};e.SharedArraySenderStrategy=n;var i=class{constructor(o){this.data=new Int32Array(o,0,1)}get isCancellationRequested(){return Atomics.load(this.data,0)===r.Cancelled}get onCancellationRequested(){throw new Error("Cancellation over SharedArrayBuffer doesn't support cancellation events")}},s=class{constructor(o){this.token=new i(o)}cancel(){}dispose(){}},a=class{constructor(){this.kind="request"}createCancellationTokenSource(o){const l=o.$cancellationData;return l===void 0?new t.CancellationTokenSource:new s(l)}};e.SharedArrayReceiverStrategy=a})),Py=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Semaphore=void 0;var t=vn(),r=class{constructor(n=1){if(n<=0)throw new Error("Capacity must be greater than 0");this._capacity=n,this._active=0,this._waiting=[]}lock(n){return new Promise((i,s)=>{this._waiting.push({thunk:n,resolve:i,reject:s}),this.runNext()})}get active(){return this._active}runNext(){this._waiting.length===0||this._active===this._capacity||(0,t.default)().timer.setImmediate(()=>this.doRunNext())}doRunNext(){if(this._waiting.length===0||this._active===this._capacity)return;const n=this._waiting.shift();if(this._active++,this._active>this._capacity)throw new Error("To many thunks active");try{const i=n.thunk();i instanceof Promise?i.then(s=>{this._active--,n.resolve(s),this.runNext()},s=>{this._active--,n.reject(s),this.runNext()}):(this._active--,n.resolve(i),this.runNext())}catch(i){this._active--,n.reject(i),this.runNext()}}};e.Semaphore=r})),TE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.ReadableStreamMessageReader=e.AbstractMessageReader=e.MessageReader=void 0;var t=vn(),r=aa(),n=Jn(),i=Py(),s;(function(u){function c(d){let f=d;return f&&r.func(f.listen)&&r.func(f.dispose)&&r.func(f.onError)&&r.func(f.onClose)&&r.func(f.onPartialMessage)}u.is=c})(s||(e.MessageReader=s={}));var a=class{constructor(){this.errorEmitter=new n.Emitter,this.closeEmitter=new n.Emitter,this.partialMessageEmitter=new n.Emitter}dispose(){this.errorEmitter.dispose(),this.closeEmitter.dispose()}get onError(){return this.errorEmitter.event}fireError(u){this.errorEmitter.fire(this.asError(u))}get onClose(){return this.closeEmitter.event}fireClose(){this.closeEmitter.fire(void 0)}get onPartialMessage(){return this.partialMessageEmitter.event}firePartialMessage(u){this.partialMessageEmitter.fire(u)}asError(u){return u instanceof Error?u:new Error(`Reader received error. Reason: ${r.string(u.message)?u.message:"unknown"}`)}};e.AbstractMessageReader=a;var o;(function(u){function c(d){let f,h;const m=new Map;let R;const S=new Map;if(d===void 0||typeof d=="string")f=d??"utf-8";else{if(f=d.charset??"utf-8",d.contentDecoder!==void 0&&(h=d.contentDecoder,m.set(h.name,h)),d.contentDecoders!==void 0)for(const v of d.contentDecoders)m.set(v.name,v);if(d.contentTypeDecoder!==void 0&&(R=d.contentTypeDecoder,S.set(R.name,R)),d.contentTypeDecoders!==void 0)for(const v of d.contentTypeDecoders)S.set(v.name,v)}return R===void 0&&(R=(0,t.default)().applicationJson.decoder,S.set(R.name,R)),{charset:f,contentDecoder:h,contentDecoders:m,contentTypeDecoder:R,contentTypeDecoders:S}}u.fromOptions=c})(o||(o={}));var l=class extends a{constructor(u,c){super(),this.readable=u,this.options=o.fromOptions(c),this.buffer=(0,t.default)().messageBuffer.create(this.options.charset),this._partialMessageTimeout=1e4,this.nextMessageLength=-1,this.messageToken=0,this.readSemaphore=new i.Semaphore(1)}set partialMessageTimeout(u){this._partialMessageTimeout=u}get partialMessageTimeout(){return this._partialMessageTimeout}listen(u){this.nextMessageLength=-1,this.messageToken=0,this.partialMessageTimer=void 0,this.callback=u;const c=this.readable.onData(d=>{this.onData(d)});return this.readable.onError(d=>this.fireError(d)),this.readable.onClose(()=>this.fireClose()),c}onData(u){try{for(this.buffer.append(u);;){if(this.nextMessageLength===-1){const d=this.buffer.tryReadHeaders(!0);if(!d)return;const f=d.get("content-length");if(!f){this.fireError(new Error(`Header must provide a Content-Length property.
${JSON.stringify(Object.fromEntries(d))}`));return}const h=parseInt(f);if(isNaN(h)){this.fireError(new Error(`Content-Length value must be a number. Got ${f}`));return}this.nextMessageLength=h}const c=this.buffer.tryReadBody(this.nextMessageLength);if(c===void 0){this.setPartialMessageTimer();return}this.clearPartialMessageTimer(),this.nextMessageLength=-1,this.readSemaphore.lock(async()=>{const d=this.options.contentDecoder!==void 0?await this.options.contentDecoder.decode(c):c,f=await this.options.contentTypeDecoder.decode(d,this.options);this.callback(f)}).catch(d=>{this.fireError(d)})}}catch(c){this.fireError(c)}}clearPartialMessageTimer(){this.partialMessageTimer&&(this.partialMessageTimer.dispose(),this.partialMessageTimer=void 0)}setPartialMessageTimer(){this.clearPartialMessageTimer(),!(this._partialMessageTimeout<=0)&&(this.partialMessageTimer=(0,t.default)().timer.setTimeout((u,c)=>{this.partialMessageTimer=void 0,u===this.messageToken&&(this.firePartialMessage({messageToken:u,waitingTime:c}),this.setPartialMessageTimer())},this._partialMessageTimeout,this.messageToken,this._partialMessageTimeout))}};e.ReadableStreamMessageReader=l})),RE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.WriteableStreamMessageWriter=e.AbstractMessageWriter=e.MessageWriter=void 0;var t=vn(),r=aa(),n=Py(),i=Jn(),s="Content-Length: ",a=`\r
`,o;(function(d){function f(h){let m=h;return m&&r.func(m.dispose)&&r.func(m.onClose)&&r.func(m.onError)&&r.func(m.write)}d.is=f})(o||(e.MessageWriter=o={}));var l=class{constructor(){this.errorEmitter=new i.Emitter,this.closeEmitter=new i.Emitter}dispose(){this.errorEmitter.dispose(),this.closeEmitter.dispose()}get onError(){return this.errorEmitter.event}fireError(d,f,h){this.errorEmitter.fire([this.asError(d),f,h])}get onClose(){return this.closeEmitter.event}fireClose(){this.closeEmitter.fire(void 0)}asError(d){return d instanceof Error?d:new Error(`Writer received error. Reason: ${r.string(d.message)?d.message:"unknown"}`)}};e.AbstractMessageWriter=l;var u;(function(d){function f(h){return h===void 0||typeof h=="string"?{charset:h??"utf-8",contentTypeEncoder:(0,t.default)().applicationJson.encoder}:{charset:h.charset??"utf-8",contentEncoder:h.contentEncoder,contentTypeEncoder:h.contentTypeEncoder??(0,t.default)().applicationJson.encoder}}d.fromOptions=f})(u||(u={}));var c=class extends l{constructor(d,f){super(),this.writable=d,this.options=u.fromOptions(f),this.errorCount=0,this.writeSemaphore=new n.Semaphore(1),this.writable.onError(h=>this.fireError(h)),this.writable.onClose(()=>this.fireClose())}async write(d){return this.writeSemaphore.lock(async()=>this.options.contentTypeEncoder.encode(d,this.options).then(f=>this.options.contentEncoder!==void 0?this.options.contentEncoder.encode(f):f).then(f=>{const h=[];return h.push(s,f.byteLength.toString(),a),h.push(a),this.doWrite(d,h,f)},f=>{throw this.fireError(f),f}))}async doWrite(d,f,h){try{return await this.writable.write(f.join(""),"ascii"),this.writable.write(h)}catch(m){return this.handleError(m,d),Promise.reject(m)}}handleError(d,f){this.errorCount++,this.fireError(d,f,this.errorCount)}end(){this.writable.end()}};e.WriteableStreamMessageWriter=c})),wE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.AbstractMessageBuffer=void 0;var t=13,r=10,n=`\r
`,i=class{constructor(s="utf-8"){this._encoding=s,this._chunks=[],this._totalLength=0}get encoding(){return this._encoding}append(s){const a=typeof s=="string"?this.fromString(s,this._encoding):s;this._chunks.push(a),this._totalLength+=a.byteLength}tryReadHeaders(s=!1){if(this._chunks.length===0)return;let a=0,o=0,l=0,u=0;e:for(;o<this._chunks.length;){const h=this._chunks[o];for(l=0;l<h.length;){switch(h[l]){case t:switch(a){case 0:a=1;break;case 2:a=3;break;default:a=0}break;case r:switch(a){case 1:a=2;break;case 3:a=4,l++;break e;default:a=0}break;default:a=0}l++}u+=h.byteLength,o++}if(a!==4)return;const c=this._read(u+l),d=new Map,f=this.toString(c,"ascii").split(n);if(f.length<2)return d;for(let h=0;h<f.length-2;h++){const m=f[h],R=m.indexOf(":");if(R===-1)throw new Error(`Message header must separate key and value using ':'
${m}`);const S=m.substr(0,R),v=m.substr(R+1).trim();d.set(s?S.toLowerCase():S,v)}return d}tryReadBody(s){if(!(this._totalLength<s))return this._read(s)}get numberOfBytes(){return this._totalLength}_read(s){if(s===0)return this.emptyBuffer();if(s>this._totalLength)throw new Error("Cannot read so many bytes!");if(this._chunks[0].byteLength===s){const u=this._chunks[0];return this._chunks.shift(),this._totalLength-=s,this.asNative(u)}if(this._chunks[0].byteLength>s){const u=this._chunks[0],c=this.asNative(u,s);return this._chunks[0]=u.slice(s),this._totalLength-=s,c}const a=this.allocNative(s);let o=0,l=0;for(;s>0;){const u=this._chunks[l];if(u.byteLength>s){const c=u.slice(0,s);a.set(c,o),o+=s,this._chunks[l]=u.slice(s),this._totalLength-=s,s-=s}else a.set(u,o),o+=u.byteLength,this._chunks.shift(),this._totalLength-=u.byteLength,s-=u.byteLength}return a}};e.AbstractMessageBuffer=i})),CE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.createMessageConnection=e.ConnectionOptions=e.MessageStrategy=e.CancellationStrategy=e.CancellationSenderStrategy=e.CancellationReceiverStrategy=e.RequestCancellationReceiverStrategy=e.IdCancellationReceiverStrategy=e.ConnectionStrategy=e.ConnectionError=e.ConnectionErrors=e.LogTraceNotification=e.SetTraceNotification=e.TraceFormat=e.TraceValues=e.Trace=e.NullLogger=e.ProgressType=e.ProgressToken=void 0;var t=vn(),r=aa(),n=Ay(),i=Ny(),s=Jn(),a=Ll(),o;(function(y){y.type=new n.NotificationType("$/cancelRequest")})(o||(o={}));var l;(function(y){function b(q){return typeof q=="string"||typeof q=="number"}y.is=b})(l||(e.ProgressToken=l={}));var u;(function(y){y.type=new n.NotificationType("$/progress")})(u||(u={}));var c=class{constructor(){}};e.ProgressType=c;var d;(function(y){function b(q){return r.func(q)}y.is=b})(d||(d={})),e.NullLogger=Object.freeze({error:()=>{},warn:()=>{},info:()=>{},log:()=>{}});var f;(function(y){y[y.Off=0]="Off",y[y.Messages=1]="Messages",y[y.Compact=2]="Compact",y[y.Verbose=3]="Verbose"})(f||(e.Trace=f={}));var h;(function(y){y.Off="off",y.Messages="messages",y.Compact="compact",y.Verbose="verbose"})(h||(e.TraceValues=h={})),(function(y){function b(O){if(!r.string(O))return y.Off;switch(O=O.toLowerCase(),O){case"off":return y.Off;case"messages":return y.Messages;case"compact":return y.Compact;case"verbose":return y.Verbose;default:return y.Off}}y.fromString=b;function q(O){switch(O){case y.Off:return"off";case y.Messages:return"messages";case y.Compact:return"compact";case y.Verbose:return"verbose";default:return"off"}}y.toString=q})(f||(e.Trace=f={}));var m;(function(y){y.Text="text",y.JSON="json"})(m||(e.TraceFormat=m={})),(function(y){function b(q){return r.string(q)?(q=q.toLowerCase(),q==="json"?y.JSON:y.Text):y.Text}y.fromString=b})(m||(e.TraceFormat=m={}));var R;(function(y){y.type=new n.NotificationType("$/setTrace")})(R||(e.SetTraceNotification=R={}));var S;(function(y){y.type=new n.NotificationType("$/logTrace")})(S||(e.LogTraceNotification=S={}));var v;(function(y){y[y.Closed=1]="Closed",y[y.Disposed=2]="Disposed",y[y.AlreadyListening=3]="AlreadyListening"})(v||(e.ConnectionErrors=v={}));var _=class Dy extends Error{constructor(b,q){super(q),this.code=b,Object.setPrototypeOf(this,Dy.prototype)}};e.ConnectionError=_;var T;(function(y){function b(q){const O=q;return O&&r.func(O.cancelUndispatched)}y.is=b})(T||(e.ConnectionStrategy=T={}));var M;(function(y){function b(q){const O=q;return O&&(O.kind===void 0||O.kind==="id")&&r.func(O.createCancellationTokenSource)&&(O.dispose===void 0||r.func(O.dispose))}y.is=b})(M||(e.IdCancellationReceiverStrategy=M={}));var F;(function(y){function b(q){const O=q;return O&&O.kind==="request"&&r.func(O.createCancellationTokenSource)&&(O.dispose===void 0||r.func(O.dispose))}y.is=b})(F||(e.RequestCancellationReceiverStrategy=F={}));var W;(function(y){y.Message=Object.freeze({createCancellationTokenSource(q){return new a.CancellationTokenSource}});function b(q){return M.is(q)||F.is(q)}y.is=b})(W||(e.CancellationReceiverStrategy=W={}));var U;(function(y){y.Message=Object.freeze({sendCancellation(q,O){return q.sendNotification(o.type,{id:O})},cleanup(q){}});function b(q){const O=q;return O&&r.func(O.sendCancellation)&&r.func(O.cleanup)}y.is=b})(U||(e.CancellationSenderStrategy=U={}));var ee;(function(y){y.Message=Object.freeze({receiver:W.Message,sender:U.Message});function b(q){const O=q;return O&&W.is(O.receiver)&&U.is(O.sender)}y.is=b})(ee||(e.CancellationStrategy=ee={}));var se;(function(y){function b(q){const O=q;return O&&r.func(O.handleMessage)}y.is=b})(se||(e.MessageStrategy=se={}));var he;(function(y){function b(q){const O=q;return O&&(ee.is(O.cancellationStrategy)||T.is(O.connectionStrategy)||se.is(O.messageStrategy))}y.is=b})(he||(e.ConnectionOptions=he={}));var x;(function(y){y[y.New=1]="New",y[y.Listening=2]="Listening",y[y.Closed=3]="Closed",y[y.Disposed=4]="Disposed"})(x||(x={}));function A(y,b,q,O){const $=q!==void 0?q:e.NullLogger;let k=0,ie=0,de=0;const Ge="2.0";let ut;const ae=new Map;let ze;const ye=new Map,Ie=new Map;let ct,ve=new i.LinkedMap,Oe=new Map,et=new Set,w=new Map,I=f.Off,L=m.Text,Z,P=x.New;const tt=new s.Emitter,Wt=new s.Emitter,Dr=new s.Emitter,Or=new s.Emitter,Lr=new s.Emitter,Tt=O&&O.cancellationStrategy?O.cancellationStrategy:ee.Message;function Mr(g){if(g===null)throw new Error("Can't send requests with id null since the response can't be correlated.");return"req-"+g.toString()}function pr(g){return g===null?"res-unknown-"+(++de).toString():"res-"+g.toString()}function wn(){return"not-"+(++ie).toString()}function mr(g,D){n.Message.isRequest(D)?g.set(Mr(D.id),D):n.Message.isResponse(D)?g.set(pr(D.id),D):g.set(wn(),D)}function gr(g){}function Zt(){return P===x.Listening}function Mt(){return P===x.Closed}function E(){return P===x.Disposed}function N(){(P===x.New||P===x.Listening)&&(P=x.Closed,Wt.fire(void 0))}function B(g){tt.fire([g,void 0,void 0])}function Ye(g){tt.fire(g)}y.onClose(N),y.onError(B),b.onClose(N),b.onError(Ye);function Yr(){ct||ve.size===0||(ct=(0,t.default)().timer.setImmediate(()=>{ct=void 0,pa()}))}function ri(g){n.Message.isRequest(g)?ga(g):n.Message.isNotification(g)?va(g):n.Message.isResponse(g)?ya(g):Ta(g)}function pa(){if(ve.size===0)return;const g=ve.shift();try{const D=O?.messageStrategy;se.is(D)?D.handleMessage(g,ri):ri(g)}finally{Yr()}}const ma=g=>{try{if(n.Message.isNotification(g)&&g.method===o.type.method){const D=g.params.id,j=Mr(D),V=ve.get(j);if(n.Message.isRequest(V)){const Te=O?.connectionStrategy,Le=Te&&Te.cancelUndispatched?Te.cancelUndispatched(V,gr):void 0;if(Le&&(Le.error!==void 0||Le.result!==void 0)){ve.delete(j),w.delete(D),Le.id=V.id,Xr(Le,g.method,Date.now()),b.write(Le).catch(()=>$.error("Sending response for canceled message failed."));return}}const Ce=w.get(D);if(Ce!==void 0){Ce.cancel(),Cn(g);return}else et.add(D)}mr(ve,g)}finally{Yr()}};function ga(g){if(E())return;function D(ue,Ne,me){const Xe={jsonrpc:Ge,id:g.id};ue instanceof n.ResponseError?Xe.error=ue.toJson():Xe.result=ue===void 0?null:ue,Xr(Xe,Ne,me),b.write(Xe).catch(()=>$.error("Sending response failed."))}function j(ue,Ne,me){const Xe={jsonrpc:Ge,id:g.id,error:ue.toJson()};Xr(Xe,Ne,me),b.write(Xe).catch(()=>$.error("Sending response failed."))}function V(ue,Ne,me){ue===void 0&&(ue=null);const Xe={jsonrpc:Ge,id:g.id,result:ue};Xr(Xe,Ne,me),b.write(Xe).catch(()=>$.error("Sending response failed."))}Ca(g);const Ce=ae.get(g.method);let Te,Le;Ce&&(Te=Ce.type,Le=Ce.handler);const We=Date.now();if(Le||ut){const ue=g.id??String(Date.now()),Ne=M.is(Tt.receiver)?Tt.receiver.createCancellationTokenSource(ue):Tt.receiver.createCancellationTokenSource(g);g.id!==null&&et.has(g.id)&&Ne.cancel(),g.id!==null&&w.set(ue,Ne);try{let me;if(Le)if(g.params===void 0){if(Te!==void 0&&Te.numberOfParams!==0){j(new n.ResponseError(n.ErrorCodes.InvalidParams,`Request ${g.method} defines ${Te.numberOfParams} params but received none.`),g.method,We);return}me=Le(Ne.token)}else if(Array.isArray(g.params)){if(Te!==void 0&&Te.parameterStructures===n.ParameterStructures.byName){j(new n.ResponseError(n.ErrorCodes.InvalidParams,`Request ${g.method} defines parameters by name but received parameters by position`),g.method,We);return}me=Le(...g.params,Ne.token)}else{if(Te!==void 0&&Te.parameterStructures===n.ParameterStructures.byPosition){j(new n.ResponseError(n.ErrorCodes.InvalidParams,`Request ${g.method} defines parameters by position but received parameters by name`),g.method,We);return}me=Le(g.params,Ne.token)}else ut&&(me=ut(g.method,g.params,Ne.token));const Xe=me;me?Xe.then?Xe.then(ht=>{w.delete(ue),D(ht,g.method,We)},ht=>{w.delete(ue),ht instanceof n.ResponseError?j(ht,g.method,We):ht&&r.string(ht.message)?j(new n.ResponseError(n.ErrorCodes.InternalError,`Request ${g.method} failed with message: ${ht.message}`),g.method,We):j(new n.ResponseError(n.ErrorCodes.InternalError,`Request ${g.method} failed unexpectedly without providing any details.`),g.method,We)}):(w.delete(ue),D(me,g.method,We)):(w.delete(ue),V(me,g.method,We))}catch(me){w.delete(ue),me instanceof n.ResponseError?D(me,g.method,We):me&&r.string(me.message)?j(new n.ResponseError(n.ErrorCodes.InternalError,`Request ${g.method} failed with message: ${me.message}`),g.method,We):j(new n.ResponseError(n.ErrorCodes.InternalError,`Request ${g.method} failed unexpectedly without providing any details.`),g.method,We)}}else j(new n.ResponseError(n.ErrorCodes.MethodNotFound,`Unhandled method ${g.method}`),g.method,We)}function ya(g){if(!E())if(g.id===null)g.error?$.error(`Received response message without id: Error is: 
${JSON.stringify(g.error,void 0,4)}`):$.error("Received response message without id. No further error information provided.");else{const D=g.id,j=Oe.get(D);if(_a(g,j),j!==void 0){Oe.delete(D);try{if(g.error){const V=g.error;j.reject(new n.ResponseError(V.code,V.message,V.data))}else if(g.result!==void 0)j.resolve(g.result);else throw new Error("Should never happen.")}catch(V){V.message?$.error(`Response handler '${j.method}' failed with message: ${V.message}`):$.error(`Response handler '${j.method}' failed unexpectedly.`)}}}}function va(g){if(E())return;let D,j;if(g.method===o.type.method){const V=g.params.id;et.delete(V),Cn(g);return}else{const V=ye.get(g.method);V&&(j=V.handler,D=V.type)}if(j||ze)try{if(Cn(g),j)if(g.params===void 0)D!==void 0&&D.numberOfParams!==0&&D.parameterStructures!==n.ParameterStructures.byName&&$.error(`Notification ${g.method} defines ${D.numberOfParams} params but received none.`),j();else if(Array.isArray(g.params)){const V=g.params;g.method===u.type.method&&V.length===2&&l.is(V[0])?j({token:V[0],value:V[1]}):(D!==void 0&&(D.parameterStructures===n.ParameterStructures.byName&&$.error(`Notification ${g.method} defines parameters by name but received parameters by position`),D.numberOfParams!==g.params.length&&$.error(`Notification ${g.method} defines ${D.numberOfParams} params but received ${V.length} arguments`)),j(...V))}else D!==void 0&&D.parameterStructures===n.ParameterStructures.byPosition&&$.error(`Notification ${g.method} defines parameters by position but received parameters by name`),j(g.params);else ze&&ze(g.method,g.params)}catch(V){V.message?$.error(`Notification handler '${g.method}' failed with message: ${V.message}`):$.error(`Notification handler '${g.method}' failed unexpectedly.`)}else Dr.fire(g)}function Ta(g){if(!g){$.error("Received empty message.");return}$.error(`Received message which is neither a response nor a notification message:
${JSON.stringify(g,null,4)}`);const D=g;if(r.string(D.id)||r.number(D.id)){const j=D.id,V=Oe.get(j);V&&V.reject(new Error("The received response has neither a result nor an error property."))}}function Bt(g){if(g!=null)switch(I){case f.Verbose:return JSON.stringify(g,null,4);case f.Compact:return JSON.stringify(g);default:return}}function Ra(g){if(!(I===f.Off||!Z))if(L===m.Text){let D;(I===f.Verbose||I===f.Compact)&&g.params&&(D=`Params: ${Bt(g.params)}

`),Z.log(`Sending request '${g.method} - (${g.id})'.`,D)}else yr("send-request",g)}function wa(g){if(!(I===f.Off||!Z))if(L===m.Text){let D;(I===f.Verbose||I===f.Compact)&&(g.params?D=`Params: ${Bt(g.params)}

`:D=`No parameters provided.

`),Z.log(`Sending notification '${g.method}'.`,D)}else yr("send-notification",g)}function Xr(g,D,j){if(!(I===f.Off||!Z))if(L===m.Text){let V;(I===f.Verbose||I===f.Compact)&&(g.error&&g.error.data?V=`Error data: ${Bt(g.error.data)}

`:g.result?V=`Result: ${Bt(g.result)}

`:g.error===void 0&&(V=`No result returned.

`)),Z.log(`Sending response '${D} - (${g.id})'. Processing request took ${Date.now()-j}ms`,V)}else yr("send-response",g)}function Ca(g){if(!(I===f.Off||!Z))if(L===m.Text){let D;(I===f.Verbose||I===f.Compact)&&g.params&&(D=`Params: ${Bt(g.params)}

`),Z.log(`Received request '${g.method} - (${g.id})'.`,D)}else yr("receive-request",g)}function Cn(g){if(!(I===f.Off||!Z||g.method===S.type.method))if(L===m.Text){let D;(I===f.Verbose||I===f.Compact)&&(g.params?D=`Params: ${Bt(g.params)}

`:D=`No parameters provided.

`),Z.log(`Received notification '${g.method}'.`,D)}else yr("receive-notification",g)}function _a(g,D){if(!(I===f.Off||!Z))if(L===m.Text){let j;if((I===f.Verbose||I===f.Compact)&&(g.error&&g.error.data?j=`Error data: ${Bt(g.error.data)}

`:g.result?j=`Result: ${Bt(g.result)}

`:g.error===void 0&&(j=`No result returned.

`)),D){const V=g.error?` Request failed: ${g.error.message} (${g.error.code}).`:"";Z.log(`Received response '${D.method} - (${g.id})' in ${Date.now()-D.timerStart}ms.${V}`,j)}else Z.log(`Received response ${g.id} without active response promise.`,j)}else yr("receive-response",g)}function yr(g,D){if(!Z||I===f.Off)return;const j={isLSPMessage:!0,type:g,message:D,timestamp:Date.now()};Z.log(j)}function Fr(){if(Mt())throw new _(v.Closed,"Connection is closed.");if(E())throw new _(v.Disposed,"Connection is disposed.")}function Sa(){if(Zt())throw new _(v.AlreadyListening,"Connection is already listening")}function ba(){if(!Zt())throw new Error("Call listen() first.")}function xr(g){return g===void 0?null:g}function ni(g){if(g!==null)return g}function p(g){return g!=null&&!Array.isArray(g)&&typeof g=="object"}function je(g,D){switch(g){case n.ParameterStructures.auto:return p(D)?ni(D):[xr(D)];case n.ParameterStructures.byName:if(!p(D))throw new Error("Received parameters by name but param is not an object literal.");return ni(D);case n.ParameterStructures.byPosition:return[xr(D)];default:throw new Error(`Unknown parameter structure ${g.toString()}`)}}function Ue(g,D){let j;const V=g.numberOfParams;switch(V){case 0:j=void 0;break;case 1:j=je(g.parameterStructures,D[0]);break;default:j=[];for(let Ce=0;Ce<D.length&&Ce<V;Ce++)j.push(xr(D[Ce]));if(D.length<V)for(let Ce=D.length;Ce<V;Ce++)j.push(null);break}return j}const re={sendNotification:(g,...D)=>{Fr();let j,V;if(r.string(g)){j=g;const Te=D[0];let Le=0,We=n.ParameterStructures.auto;n.ParameterStructures.is(Te)&&(Le=1,We=Te);let ue=D.length;const Ne=ue-Le;switch(Ne){case 0:V=void 0;break;case 1:V=je(We,D[Le]);break;default:if(We===n.ParameterStructures.byName)throw new Error(`Received ${Ne} parameters for 'by Name' notification parameter structure.`);V=D.slice(Le,ue).map(me=>xr(me));break}}else{const Te=D;j=g.method,V=Ue(g,Te)}const Ce={jsonrpc:Ge,method:j,params:V};return wa(Ce),b.write(Ce).catch(Te=>{throw $.error("Sending notification failed."),Te})},onNotification:(g,D)=>{Fr();let j;return r.func(g)?ze=g:D&&(r.string(g)?(j=g,ye.set(g,{type:void 0,handler:D})):(j=g.method,ye.set(g.method,{type:g,handler:D}))),{dispose:()=>{j!==void 0?ye.delete(j):ze=void 0}}},onProgress:(g,D,j)=>{if(Ie.has(D))throw new Error(`Progress handler for token ${D} already registered`);return Ie.set(D,j),{dispose:()=>{Ie.delete(D)}}},sendProgress:(g,D,j)=>re.sendNotification(u.type,{token:D,value:j}),onUnhandledProgress:Or.event,sendRequest:(g,...D)=>{Fr(),ba();let j,V,Ce;if(r.string(g)){j=g;const ue=D[0],Ne=D[D.length-1];let me=0,Xe=n.ParameterStructures.auto;n.ParameterStructures.is(ue)&&(me=1,Xe=ue);let ht=D.length;a.CancellationToken.is(Ne)&&(ht=ht-1,Ce=Ne);const er=ht-me;switch(er){case 0:V=void 0;break;case 1:V=je(Xe,D[me]);break;default:if(Xe===n.ParameterStructures.byName)throw new Error(`Received ${er} parameters for 'by Name' request parameter structure.`);V=D.slice(me,ht).map(Ov=>xr(Ov));break}}else{const ue=D;j=g.method,V=Ue(g,ue);const Ne=g.numberOfParams;Ce=a.CancellationToken.is(ue[Ne])?ue[Ne]:void 0}const Te=k++;let Le;Ce&&(Le=Ce.onCancellationRequested(()=>{const ue=Tt.sender.sendCancellation(re,Te);return ue===void 0?($.log(`Received no promise from cancellation strategy when cancelling id ${Te}`),Promise.resolve()):ue.catch(()=>{$.log(`Sending cancellation messages for id ${Te} failed`)})}));const We={jsonrpc:Ge,id:Te,method:j,params:V};return Ra(We),typeof Tt.sender.enableCancellation=="function"&&Tt.sender.enableCancellation(We),new Promise(async(ue,Ne)=>{const me=er=>{ue(er),Tt.sender.cleanup(Te),Le?.dispose()},Xe=er=>{Ne(er),Tt.sender.cleanup(Te),Le?.dispose()},ht={method:j,timerStart:Date.now(),resolve:me,reject:Xe};try{await b.write(We),Oe.set(Te,ht)}catch(er){throw $.error("Sending request failed."),ht.reject(new n.ResponseError(n.ErrorCodes.MessageWriteError,er.message?er.message:"Unknown reason")),er}})},onRequest:(g,D)=>{Fr();let j=null;return d.is(g)?(j=void 0,ut=g):r.string(g)?(j=null,D!==void 0&&(j=g,ae.set(g,{handler:D,type:void 0}))):D!==void 0&&(j=g.method,ae.set(g.method,{type:g,handler:D})),{dispose:()=>{j!==null&&(j!==void 0?ae.delete(j):ut=void 0)}}},hasPendingResponse:()=>Oe.size>0,trace:async(g,D,j)=>{let V=!1,Ce=m.Text;j!==void 0&&(r.boolean(j)?V=j:(V=j.sendNotification||!1,Ce=j.traceFormat||m.Text)),I=g,L=Ce,I===f.Off?Z=void 0:Z=D,V&&!Mt()&&!E()&&await re.sendNotification(R.type,{value:f.toString(g)})},onError:tt.event,onClose:Wt.event,onUnhandledNotification:Dr.event,onDispose:Lr.event,end:()=>{b.end()},dispose:()=>{if(E())return;P=x.Disposed,Lr.fire(void 0);const g=new n.ResponseError(n.ErrorCodes.PendingResponseRejected,"Pending response rejected since connection got disposed");for(const D of Oe.values())D.reject(g);Oe=new Map,w=new Map,et=new Set,ve=new i.LinkedMap,r.func(b.dispose)&&b.dispose(),r.func(y.dispose)&&y.dispose()},listen:()=>{Fr(),Sa(),P=x.Listening,y.listen(ma)},inspect:()=>{(0,t.default)().console.log("inspect")}};return re.onNotification(S.type,g=>{if(I===f.Off||!Z)return;const D=I===f.Verbose||I===f.Compact;Z.log(g.message,D?g.verbose:void 0)}),re.onNotification(u.type,g=>{const D=Ie.get(g.token);D?D(g.value):Or.fire(g)}),re}e.createMessageConnection=A})),sd=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.ProgressType=e.ProgressToken=e.createMessageConnection=e.NullLogger=e.ConnectionOptions=e.ConnectionStrategy=e.AbstractMessageBuffer=e.WriteableStreamMessageWriter=e.AbstractMessageWriter=e.MessageWriter=e.ReadableStreamMessageReader=e.AbstractMessageReader=e.MessageReader=e.SharedArrayReceiverStrategy=e.SharedArraySenderStrategy=e.CancellationToken=e.CancellationTokenSource=e.Emitter=e.Event=e.Disposable=e.LRUCache=e.Touch=e.LinkedMap=e.ParameterStructures=e.NotificationType9=e.NotificationType8=e.NotificationType7=e.NotificationType6=e.NotificationType5=e.NotificationType4=e.NotificationType3=e.NotificationType2=e.NotificationType1=e.NotificationType0=e.NotificationType=e.ErrorCodes=e.ResponseError=e.RequestType9=e.RequestType8=e.RequestType7=e.RequestType6=e.RequestType5=e.RequestType4=e.RequestType3=e.RequestType2=e.RequestType1=e.RequestType0=e.RequestType=e.Message=e.RAL=void 0,e.MessageStrategy=e.CancellationStrategy=e.CancellationSenderStrategy=e.CancellationReceiverStrategy=e.ConnectionError=e.ConnectionErrors=e.LogTraceNotification=e.SetTraceNotification=e.TraceFormat=e.TraceValues=e.Trace=void 0;var t=Ay();Object.defineProperty(e,"Message",{enumerable:!0,get:function(){return t.Message}}),Object.defineProperty(e,"RequestType",{enumerable:!0,get:function(){return t.RequestType}}),Object.defineProperty(e,"RequestType0",{enumerable:!0,get:function(){return t.RequestType0}}),Object.defineProperty(e,"RequestType1",{enumerable:!0,get:function(){return t.RequestType1}}),Object.defineProperty(e,"RequestType2",{enumerable:!0,get:function(){return t.RequestType2}}),Object.defineProperty(e,"RequestType3",{enumerable:!0,get:function(){return t.RequestType3}}),Object.defineProperty(e,"RequestType4",{enumerable:!0,get:function(){return t.RequestType4}}),Object.defineProperty(e,"RequestType5",{enumerable:!0,get:function(){return t.RequestType5}}),Object.defineProperty(e,"RequestType6",{enumerable:!0,get:function(){return t.RequestType6}}),Object.defineProperty(e,"RequestType7",{enumerable:!0,get:function(){return t.RequestType7}}),Object.defineProperty(e,"RequestType8",{enumerable:!0,get:function(){return t.RequestType8}}),Object.defineProperty(e,"RequestType9",{enumerable:!0,get:function(){return t.RequestType9}}),Object.defineProperty(e,"ResponseError",{enumerable:!0,get:function(){return t.ResponseError}}),Object.defineProperty(e,"ErrorCodes",{enumerable:!0,get:function(){return t.ErrorCodes}}),Object.defineProperty(e,"NotificationType",{enumerable:!0,get:function(){return t.NotificationType}}),Object.defineProperty(e,"NotificationType0",{enumerable:!0,get:function(){return t.NotificationType0}}),Object.defineProperty(e,"NotificationType1",{enumerable:!0,get:function(){return t.NotificationType1}}),Object.defineProperty(e,"NotificationType2",{enumerable:!0,get:function(){return t.NotificationType2}}),Object.defineProperty(e,"NotificationType3",{enumerable:!0,get:function(){return t.NotificationType3}}),Object.defineProperty(e,"NotificationType4",{enumerable:!0,get:function(){return t.NotificationType4}}),Object.defineProperty(e,"NotificationType5",{enumerable:!0,get:function(){return t.NotificationType5}}),Object.defineProperty(e,"NotificationType6",{enumerable:!0,get:function(){return t.NotificationType6}}),Object.defineProperty(e,"NotificationType7",{enumerable:!0,get:function(){return t.NotificationType7}}),Object.defineProperty(e,"NotificationType8",{enumerable:!0,get:function(){return t.NotificationType8}}),Object.defineProperty(e,"NotificationType9",{enumerable:!0,get:function(){return t.NotificationType9}}),Object.defineProperty(e,"ParameterStructures",{enumerable:!0,get:function(){return t.ParameterStructures}});var r=Ny();Object.defineProperty(e,"LinkedMap",{enumerable:!0,get:function(){return r.LinkedMap}}),Object.defineProperty(e,"LRUCache",{enumerable:!0,get:function(){return r.LRUCache}}),Object.defineProperty(e,"Touch",{enumerable:!0,get:function(){return r.Touch}});var n=yE();Object.defineProperty(e,"Disposable",{enumerable:!0,get:function(){return n.Disposable}});var i=Jn();Object.defineProperty(e,"Event",{enumerable:!0,get:function(){return i.Event}}),Object.defineProperty(e,"Emitter",{enumerable:!0,get:function(){return i.Emitter}});var s=Ll();Object.defineProperty(e,"CancellationTokenSource",{enumerable:!0,get:function(){return s.CancellationTokenSource}}),Object.defineProperty(e,"CancellationToken",{enumerable:!0,get:function(){return s.CancellationToken}});var a=vE();Object.defineProperty(e,"SharedArraySenderStrategy",{enumerable:!0,get:function(){return a.SharedArraySenderStrategy}}),Object.defineProperty(e,"SharedArrayReceiverStrategy",{enumerable:!0,get:function(){return a.SharedArrayReceiverStrategy}});var o=TE();Object.defineProperty(e,"MessageReader",{enumerable:!0,get:function(){return o.MessageReader}}),Object.defineProperty(e,"AbstractMessageReader",{enumerable:!0,get:function(){return o.AbstractMessageReader}}),Object.defineProperty(e,"ReadableStreamMessageReader",{enumerable:!0,get:function(){return o.ReadableStreamMessageReader}});var l=RE();Object.defineProperty(e,"MessageWriter",{enumerable:!0,get:function(){return l.MessageWriter}}),Object.defineProperty(e,"AbstractMessageWriter",{enumerable:!0,get:function(){return l.AbstractMessageWriter}}),Object.defineProperty(e,"WriteableStreamMessageWriter",{enumerable:!0,get:function(){return l.WriteableStreamMessageWriter}});var u=wE();Object.defineProperty(e,"AbstractMessageBuffer",{enumerable:!0,get:function(){return u.AbstractMessageBuffer}});var c=CE();Object.defineProperty(e,"ConnectionStrategy",{enumerable:!0,get:function(){return c.ConnectionStrategy}}),Object.defineProperty(e,"ConnectionOptions",{enumerable:!0,get:function(){return c.ConnectionOptions}}),Object.defineProperty(e,"NullLogger",{enumerable:!0,get:function(){return c.NullLogger}}),Object.defineProperty(e,"createMessageConnection",{enumerable:!0,get:function(){return c.createMessageConnection}}),Object.defineProperty(e,"ProgressToken",{enumerable:!0,get:function(){return c.ProgressToken}}),Object.defineProperty(e,"ProgressType",{enumerable:!0,get:function(){return c.ProgressType}}),Object.defineProperty(e,"Trace",{enumerable:!0,get:function(){return c.Trace}}),Object.defineProperty(e,"TraceValues",{enumerable:!0,get:function(){return c.TraceValues}}),Object.defineProperty(e,"TraceFormat",{enumerable:!0,get:function(){return c.TraceFormat}}),Object.defineProperty(e,"SetTraceNotification",{enumerable:!0,get:function(){return c.SetTraceNotification}}),Object.defineProperty(e,"LogTraceNotification",{enumerable:!0,get:function(){return c.LogTraceNotification}}),Object.defineProperty(e,"ConnectionErrors",{enumerable:!0,get:function(){return c.ConnectionErrors}}),Object.defineProperty(e,"ConnectionError",{enumerable:!0,get:function(){return c.ConnectionError}}),Object.defineProperty(e,"CancellationReceiverStrategy",{enumerable:!0,get:function(){return c.CancellationReceiverStrategy}}),Object.defineProperty(e,"CancellationSenderStrategy",{enumerable:!0,get:function(){return c.CancellationSenderStrategy}}),Object.defineProperty(e,"CancellationStrategy",{enumerable:!0,get:function(){return c.CancellationStrategy}}),Object.defineProperty(e,"MessageStrategy",{enumerable:!0,get:function(){return c.MessageStrategy}});var d=vn();e.RAL=d.default})),_E=H((e=>{Object.defineProperty(e,"__esModule",{value:!0});var t=sd(),r=class Oy extends t.AbstractMessageBuffer{constructor(u="utf-8"){super(u),this.asciiDecoder=new TextDecoder("ascii")}emptyBuffer(){return Oy.emptyBuffer}fromString(u,c){return new TextEncoder().encode(u)}toString(u,c){return c==="ascii"?this.asciiDecoder.decode(u):new TextDecoder(c).decode(u)}asNative(u,c){return c===void 0?u:u.slice(0,c)}allocNative(u){return new Uint8Array(u)}};r.emptyBuffer=new Uint8Array(0);var n=class{constructor(l){this.socket=l,this._onData=new t.Emitter,this._messageListener=u=>{u.data.arrayBuffer().then(c=>{this._onData.fire(new Uint8Array(c))},()=>{(0,t.RAL)().console.error("Converting blob to array buffer failed.")})},this.socket.addEventListener("message",this._messageListener)}onClose(l){return this.socket.addEventListener("close",l),t.Disposable.create(()=>this.socket.removeEventListener("close",l))}onError(l){return this.socket.addEventListener("error",l),t.Disposable.create(()=>this.socket.removeEventListener("error",l))}onEnd(l){return this.socket.addEventListener("end",l),t.Disposable.create(()=>this.socket.removeEventListener("end",l))}onData(l){return this._onData.event(l)}},i=class{constructor(l){this.socket=l}onClose(l){return this.socket.addEventListener("close",l),t.Disposable.create(()=>this.socket.removeEventListener("close",l))}onError(l){return this.socket.addEventListener("error",l),t.Disposable.create(()=>this.socket.removeEventListener("error",l))}onEnd(l){return this.socket.addEventListener("end",l),t.Disposable.create(()=>this.socket.removeEventListener("end",l))}write(l,u){if(typeof l=="string"){if(u!==void 0&&u!=="utf-8")throw new Error(`In a Browser environments only utf-8 text encoding is supported. But got encoding: ${u}`);this.socket.send(l)}else this.socket.send(l);return Promise.resolve()}end(){this.socket.close()}},s=new TextEncoder,a=Object.freeze({messageBuffer:Object.freeze({create:l=>new r(l)}),applicationJson:Object.freeze({encoder:Object.freeze({name:"application/json",encode:(l,u)=>{if(u.charset!=="utf-8")throw new Error(`In a Browser environments only utf-8 text encoding is supported. But got encoding: ${u.charset}`);return Promise.resolve(s.encode(JSON.stringify(l,void 0,0)))}}),decoder:Object.freeze({name:"application/json",decode:(l,u)=>{if(!(l instanceof Uint8Array))throw new Error("In a Browser environments only Uint8Arrays are supported.");return Promise.resolve(JSON.parse(new TextDecoder(u.charset).decode(l)))}})}),stream:Object.freeze({asReadableStream:l=>new n(l),asWritableStream:l=>new i(l)}),console,timer:Object.freeze({setTimeout(l,u,...c){const d=setTimeout(l,u,...c);return{dispose:()=>clearTimeout(d)}},setImmediate(l,...u){const c=setTimeout(l,0,...u);return{dispose:()=>clearTimeout(c)}},setInterval(l,u,...c){const d=setInterval(l,u,...c);return{dispose:()=>clearInterval(d)}}})});function o(){return a}(function(l){function u(){t.RAL.install(a)}l.install=u})(o||(o={})),e.default=o})),Zn=H((e=>{var t=e&&e.__createBinding||(Object.create?(function(o,l,u,c){c===void 0&&(c=u);var d=Object.getOwnPropertyDescriptor(l,u);(!d||("get"in d?!l.__esModule:d.writable||d.configurable))&&(d={enumerable:!0,get:function(){return l[u]}}),Object.defineProperty(o,c,d)}):(function(o,l,u,c){c===void 0&&(c=u),o[c]=l[u]})),r=e&&e.__exportStar||function(o,l){for(var u in o)u!=="default"&&!Object.prototype.hasOwnProperty.call(l,u)&&t(l,o,u)};Object.defineProperty(e,"__esModule",{value:!0}),e.createMessageConnection=e.BrowserMessageWriter=e.BrowserMessageReader=void 0,_E().default.install();var n=sd();r(sd(),e);var i=class extends n.AbstractMessageReader{constructor(o){super(),this._onData=new n.Emitter,this._messageListener=l=>{this._onData.fire(l.data)},o.addEventListener("error",l=>this.fireError(l)),o.onmessage=this._messageListener}listen(o){return this._onData.event(o)}};e.BrowserMessageReader=i;var s=class extends n.AbstractMessageWriter{constructor(o){super(),this.port=o,this.errorCount=0,o.addEventListener("error",l=>this.fireError(l))}write(o){try{return this.port.postMessage(o),Promise.resolve()}catch(l){return this.handleError(l,o),Promise.reject(l)}}handleError(o,l){this.errorCount++,this.fireError(o,l,this.errorCount)}end(){}};e.BrowserMessageWriter=s;function a(o,l,u,c){return u===void 0&&(u=n.NullLogger),n.ConnectionStrategy.is(c)&&(c={connectionStrategy:c}),(0,n.createMessageConnection)(o,l,u,c)}e.createMessageConnection=a})),up=H(((e,t)=>{t.exports=Zn()})),De=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.ProtocolNotificationType=e.ProtocolNotificationType0=e.ProtocolRequestType=e.ProtocolRequestType0=e.RegistrationType=e.MessageDirection=void 0;var t=Zn(),r;(function(l){l.clientToServer="clientToServer",l.serverToClient="serverToClient",l.both="both"})(r||(e.MessageDirection=r={}));var n=class{constructor(l){this.method=l}};e.RegistrationType=n;var i=class extends t.RequestType0{constructor(l){super(l)}};e.ProtocolRequestType0=i;var s=class extends t.RequestType{constructor(l){super(l,t.ParameterStructures.byName)}};e.ProtocolRequestType=s;var a=class extends t.NotificationType0{constructor(l){super(l)}};e.ProtocolNotificationType0=a;var o=class extends t.NotificationType{constructor(l){super(l,t.ParameterStructures.byName)}};e.ProtocolNotificationType=o})),af=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.objectLiteral=e.typedArray=e.stringArray=e.array=e.func=e.error=e.number=e.string=e.boolean=void 0;function t(c){return c===!0||c===!1}e.boolean=t;function r(c){return typeof c=="string"||c instanceof String}e.string=r;function n(c){return typeof c=="number"||c instanceof Number}e.number=n;function i(c){return c instanceof Error}e.error=i;function s(c){return typeof c=="function"}e.func=s;function a(c){return Array.isArray(c)}e.array=a;function o(c){return a(c)&&c.every(d=>r(d))}e.stringArray=o;function l(c,d){return Array.isArray(c)&&c.every(d)}e.typedArray=l;function u(c){return c!==null&&typeof c=="object"}e.objectLiteral=u})),SE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.ImplementationRequest=void 0;var t=De(),r;(function(n){n.method="textDocument/implementation",n.messageDirection=t.MessageDirection.clientToServer,n.type=new t.ProtocolRequestType(n.method)})(r||(e.ImplementationRequest=r={}))})),bE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.TypeDefinitionRequest=void 0;var t=De(),r;(function(n){n.method="textDocument/typeDefinition",n.messageDirection=t.MessageDirection.clientToServer,n.type=new t.ProtocolRequestType(n.method)})(r||(e.TypeDefinitionRequest=r={}))})),kE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.DidChangeWorkspaceFoldersNotification=e.WorkspaceFoldersRequest=void 0;var t=De(),r;(function(i){i.method="workspace/workspaceFolders",i.messageDirection=t.MessageDirection.serverToClient,i.type=new t.ProtocolRequestType0(i.method)})(r||(e.WorkspaceFoldersRequest=r={}));var n;(function(i){i.method="workspace/didChangeWorkspaceFolders",i.messageDirection=t.MessageDirection.clientToServer,i.type=new t.ProtocolNotificationType(i.method)})(n||(e.DidChangeWorkspaceFoldersNotification=n={}))})),$E=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.ConfigurationRequest=void 0;var t=De(),r;(function(n){n.method="workspace/configuration",n.messageDirection=t.MessageDirection.serverToClient,n.type=new t.ProtocolRequestType(n.method)})(r||(e.ConfigurationRequest=r={}))})),EE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.ColorPresentationRequest=e.DocumentColorRequest=void 0;var t=De(),r;(function(i){i.method="textDocument/documentColor",i.messageDirection=t.MessageDirection.clientToServer,i.type=new t.ProtocolRequestType(i.method)})(r||(e.DocumentColorRequest=r={}));var n;(function(i){i.method="textDocument/colorPresentation",i.messageDirection=t.MessageDirection.clientToServer,i.type=new t.ProtocolRequestType(i.method)})(n||(e.ColorPresentationRequest=n={}))})),AE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.FoldingRangeRefreshRequest=e.FoldingRangeRequest=void 0;var t=De(),r;(function(i){i.method="textDocument/foldingRange",i.messageDirection=t.MessageDirection.clientToServer,i.type=new t.ProtocolRequestType(i.method)})(r||(e.FoldingRangeRequest=r={}));var n;(function(i){i.method="workspace/foldingRange/refresh",i.messageDirection=t.MessageDirection.serverToClient,i.type=new t.ProtocolRequestType0(i.method)})(n||(e.FoldingRangeRefreshRequest=n={}))})),IE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.DeclarationRequest=void 0;var t=De(),r;(function(n){n.method="textDocument/declaration",n.messageDirection=t.MessageDirection.clientToServer,n.type=new t.ProtocolRequestType(n.method)})(r||(e.DeclarationRequest=r={}))})),NE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.SelectionRangeRequest=void 0;var t=De(),r;(function(n){n.method="textDocument/selectionRange",n.messageDirection=t.MessageDirection.clientToServer,n.type=new t.ProtocolRequestType(n.method)})(r||(e.SelectionRangeRequest=r={}))})),PE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.WorkDoneProgressCancelNotification=e.WorkDoneProgressCreateRequest=e.WorkDoneProgress=void 0;var t=Zn(),r=De(),n;(function(a){a.type=new t.ProgressType;function o(l){return l===a.type}a.is=o})(n||(e.WorkDoneProgress=n={}));var i;(function(a){a.method="window/workDoneProgress/create",a.messageDirection=r.MessageDirection.serverToClient,a.type=new r.ProtocolRequestType(a.method)})(i||(e.WorkDoneProgressCreateRequest=i={}));var s;(function(a){a.method="window/workDoneProgress/cancel",a.messageDirection=r.MessageDirection.clientToServer,a.type=new r.ProtocolNotificationType(a.method)})(s||(e.WorkDoneProgressCancelNotification=s={}))})),DE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.CallHierarchyOutgoingCallsRequest=e.CallHierarchyIncomingCallsRequest=e.CallHierarchyPrepareRequest=void 0;var t=De(),r;(function(s){s.method="textDocument/prepareCallHierarchy",s.messageDirection=t.MessageDirection.clientToServer,s.type=new t.ProtocolRequestType(s.method)})(r||(e.CallHierarchyPrepareRequest=r={}));var n;(function(s){s.method="callHierarchy/incomingCalls",s.messageDirection=t.MessageDirection.clientToServer,s.type=new t.ProtocolRequestType(s.method)})(n||(e.CallHierarchyIncomingCallsRequest=n={}));var i;(function(s){s.method="callHierarchy/outgoingCalls",s.messageDirection=t.MessageDirection.clientToServer,s.type=new t.ProtocolRequestType(s.method)})(i||(e.CallHierarchyOutgoingCallsRequest=i={}))})),OE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.SemanticTokensRefreshRequest=e.SemanticTokensRangeRequest=e.SemanticTokensDeltaRequest=e.SemanticTokensRequest=e.SemanticTokensRegistrationType=e.TokenFormat=void 0;var t=De(),r;(function(l){l.Relative="relative"})(r||(e.TokenFormat=r={}));var n;(function(l){l.method="textDocument/semanticTokens",l.type=new t.RegistrationType(l.method)})(n||(e.SemanticTokensRegistrationType=n={}));var i;(function(l){l.method="textDocument/semanticTokens/full",l.messageDirection=t.MessageDirection.clientToServer,l.type=new t.ProtocolRequestType(l.method),l.registrationMethod=n.method})(i||(e.SemanticTokensRequest=i={}));var s;(function(l){l.method="textDocument/semanticTokens/full/delta",l.messageDirection=t.MessageDirection.clientToServer,l.type=new t.ProtocolRequestType(l.method),l.registrationMethod=n.method})(s||(e.SemanticTokensDeltaRequest=s={}));var a;(function(l){l.method="textDocument/semanticTokens/range",l.messageDirection=t.MessageDirection.clientToServer,l.type=new t.ProtocolRequestType(l.method),l.registrationMethod=n.method})(a||(e.SemanticTokensRangeRequest=a={}));var o;(function(l){l.method="workspace/semanticTokens/refresh",l.messageDirection=t.MessageDirection.serverToClient,l.type=new t.ProtocolRequestType0(l.method)})(o||(e.SemanticTokensRefreshRequest=o={}))})),LE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.ShowDocumentRequest=void 0;var t=De(),r;(function(n){n.method="window/showDocument",n.messageDirection=t.MessageDirection.serverToClient,n.type=new t.ProtocolRequestType(n.method)})(r||(e.ShowDocumentRequest=r={}))})),ME=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.LinkedEditingRangeRequest=void 0;var t=De(),r;(function(n){n.method="textDocument/linkedEditingRange",n.messageDirection=t.MessageDirection.clientToServer,n.type=new t.ProtocolRequestType(n.method)})(r||(e.LinkedEditingRangeRequest=r={}))})),FE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.WillDeleteFilesRequest=e.DidDeleteFilesNotification=e.DidRenameFilesNotification=e.WillRenameFilesRequest=e.DidCreateFilesNotification=e.WillCreateFilesRequest=e.FileOperationPatternKind=void 0;var t=De(),r;(function(u){u.file="file",u.folder="folder"})(r||(e.FileOperationPatternKind=r={}));var n;(function(u){u.method="workspace/willCreateFiles",u.messageDirection=t.MessageDirection.clientToServer,u.type=new t.ProtocolRequestType(u.method)})(n||(e.WillCreateFilesRequest=n={}));var i;(function(u){u.method="workspace/didCreateFiles",u.messageDirection=t.MessageDirection.clientToServer,u.type=new t.ProtocolNotificationType(u.method)})(i||(e.DidCreateFilesNotification=i={}));var s;(function(u){u.method="workspace/willRenameFiles",u.messageDirection=t.MessageDirection.clientToServer,u.type=new t.ProtocolRequestType(u.method)})(s||(e.WillRenameFilesRequest=s={}));var a;(function(u){u.method="workspace/didRenameFiles",u.messageDirection=t.MessageDirection.clientToServer,u.type=new t.ProtocolNotificationType(u.method)})(a||(e.DidRenameFilesNotification=a={}));var o;(function(u){u.method="workspace/didDeleteFiles",u.messageDirection=t.MessageDirection.clientToServer,u.type=new t.ProtocolNotificationType(u.method)})(o||(e.DidDeleteFilesNotification=o={}));var l;(function(u){u.method="workspace/willDeleteFiles",u.messageDirection=t.MessageDirection.clientToServer,u.type=new t.ProtocolRequestType(u.method)})(l||(e.WillDeleteFilesRequest=l={}))})),xE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.MonikerRequest=e.MonikerKind=e.UniquenessLevel=void 0;var t=De(),r;(function(s){s.document="document",s.project="project",s.group="group",s.scheme="scheme",s.global="global"})(r||(e.UniquenessLevel=r={}));var n;(function(s){s.$import="import",s.$export="export",s.local="local"})(n||(e.MonikerKind=n={}));var i;(function(s){s.method="textDocument/moniker",s.messageDirection=t.MessageDirection.clientToServer,s.type=new t.ProtocolRequestType(s.method)})(i||(e.MonikerRequest=i={}))})),qE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.TypeHierarchySubtypesRequest=e.TypeHierarchySupertypesRequest=e.TypeHierarchyPrepareRequest=void 0;var t=De(),r;(function(s){s.method="textDocument/prepareTypeHierarchy",s.messageDirection=t.MessageDirection.clientToServer,s.type=new t.ProtocolRequestType(s.method)})(r||(e.TypeHierarchyPrepareRequest=r={}));var n;(function(s){s.method="typeHierarchy/supertypes",s.messageDirection=t.MessageDirection.clientToServer,s.type=new t.ProtocolRequestType(s.method)})(n||(e.TypeHierarchySupertypesRequest=n={}));var i;(function(s){s.method="typeHierarchy/subtypes",s.messageDirection=t.MessageDirection.clientToServer,s.type=new t.ProtocolRequestType(s.method)})(i||(e.TypeHierarchySubtypesRequest=i={}))})),jE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.InlineValueRefreshRequest=e.InlineValueRequest=void 0;var t=De(),r;(function(i){i.method="textDocument/inlineValue",i.messageDirection=t.MessageDirection.clientToServer,i.type=new t.ProtocolRequestType(i.method)})(r||(e.InlineValueRequest=r={}));var n;(function(i){i.method="workspace/inlineValue/refresh",i.messageDirection=t.MessageDirection.serverToClient,i.type=new t.ProtocolRequestType0(i.method)})(n||(e.InlineValueRefreshRequest=n={}))})),UE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.InlayHintRefreshRequest=e.InlayHintResolveRequest=e.InlayHintRequest=void 0;var t=De(),r;(function(s){s.method="textDocument/inlayHint",s.messageDirection=t.MessageDirection.clientToServer,s.type=new t.ProtocolRequestType(s.method)})(r||(e.InlayHintRequest=r={}));var n;(function(s){s.method="inlayHint/resolve",s.messageDirection=t.MessageDirection.clientToServer,s.type=new t.ProtocolRequestType(s.method)})(n||(e.InlayHintResolveRequest=n={}));var i;(function(s){s.method="workspace/inlayHint/refresh",s.messageDirection=t.MessageDirection.serverToClient,s.type=new t.ProtocolRequestType0(s.method)})(i||(e.InlayHintRefreshRequest=i={}))})),WE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.DiagnosticRefreshRequest=e.WorkspaceDiagnosticRequest=e.DocumentDiagnosticRequest=e.DocumentDiagnosticReportKind=e.DiagnosticServerCancellationData=void 0;var t=Zn(),r=af(),n=De(),i;(function(u){function c(d){const f=d;return f&&r.boolean(f.retriggerRequest)}u.is=c})(i||(e.DiagnosticServerCancellationData=i={}));var s;(function(u){u.Full="full",u.Unchanged="unchanged"})(s||(e.DocumentDiagnosticReportKind=s={}));var a;(function(u){u.method="textDocument/diagnostic",u.messageDirection=n.MessageDirection.clientToServer,u.type=new n.ProtocolRequestType(u.method),u.partialResult=new t.ProgressType})(a||(e.DocumentDiagnosticRequest=a={}));var o;(function(u){u.method="workspace/diagnostic",u.messageDirection=n.MessageDirection.clientToServer,u.type=new n.ProtocolRequestType(u.method),u.partialResult=new t.ProgressType})(o||(e.WorkspaceDiagnosticRequest=o={}));var l;(function(u){u.method="workspace/diagnostic/refresh",u.messageDirection=n.MessageDirection.serverToClient,u.type=new n.ProtocolRequestType0(u.method)})(l||(e.DiagnosticRefreshRequest=l={}))})),BE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.DidCloseNotebookDocumentNotification=e.DidSaveNotebookDocumentNotification=e.DidChangeNotebookDocumentNotification=e.NotebookCellArrayChange=e.DidOpenNotebookDocumentNotification=e.NotebookDocumentSyncRegistrationType=e.NotebookDocument=e.NotebookCell=e.ExecutionSummary=e.NotebookCellKind=void 0;var t=(yn(),vd(Jd)),r=af(),n=De(),i;(function(m){m.Markup=1,m.Code=2;function R(S){return S===1||S===2}m.is=R})(i||(e.NotebookCellKind=i={}));var s;(function(m){function R(_,T){const M={executionOrder:_};return(T===!0||T===!1)&&(M.success=T),M}m.create=R;function S(_){const T=_;return r.objectLiteral(T)&&t.uinteger.is(T.executionOrder)&&(T.success===void 0||r.boolean(T.success))}m.is=S;function v(_,T){return _===T?!0:_==null||T===null||T===void 0?!1:_.executionOrder===T.executionOrder&&_.success===T.success}m.equals=v})(s||(e.ExecutionSummary=s={}));var a;(function(m){function R(T,M){return{kind:T,document:M}}m.create=R;function S(T){const M=T;return r.objectLiteral(M)&&i.is(M.kind)&&t.DocumentUri.is(M.document)&&(M.metadata===void 0||r.objectLiteral(M.metadata))}m.is=S;function v(T,M){const F=new Set;return T.document!==M.document&&F.add("document"),T.kind!==M.kind&&F.add("kind"),T.executionSummary!==M.executionSummary&&F.add("executionSummary"),(T.metadata!==void 0||M.metadata!==void 0)&&!_(T.metadata,M.metadata)&&F.add("metadata"),(T.executionSummary!==void 0||M.executionSummary!==void 0)&&!s.equals(T.executionSummary,M.executionSummary)&&F.add("executionSummary"),F}m.diff=v;function _(T,M){if(T===M)return!0;if(T==null||M===null||M===void 0||typeof T!=typeof M||typeof T!="object")return!1;const F=Array.isArray(T),W=Array.isArray(M);if(F!==W)return!1;if(F&&W){if(T.length!==M.length)return!1;for(let U=0;U<T.length;U++)if(!_(T[U],M[U]))return!1}if(r.objectLiteral(T)&&r.objectLiteral(M)){const U=Object.keys(T),ee=Object.keys(M);if(U.length!==ee.length||(U.sort(),ee.sort(),!_(U,ee)))return!1;for(let se=0;se<U.length;se++){const he=U[se];if(!_(T[he],M[he]))return!1}}return!0}})(a||(e.NotebookCell=a={}));var o;(function(m){function R(v,_,T,M){return{uri:v,notebookType:_,version:T,cells:M}}m.create=R;function S(v){const _=v;return r.objectLiteral(_)&&r.string(_.uri)&&t.integer.is(_.version)&&r.typedArray(_.cells,a.is)}m.is=S})(o||(e.NotebookDocument=o={}));var l;(function(m){m.method="notebookDocument/sync",m.messageDirection=n.MessageDirection.clientToServer,m.type=new n.RegistrationType(m.method)})(l||(e.NotebookDocumentSyncRegistrationType=l={}));var u;(function(m){m.method="notebookDocument/didOpen",m.messageDirection=n.MessageDirection.clientToServer,m.type=new n.ProtocolNotificationType(m.method),m.registrationMethod=l.method})(u||(e.DidOpenNotebookDocumentNotification=u={}));var c;(function(m){function R(v){const _=v;return r.objectLiteral(_)&&t.uinteger.is(_.start)&&t.uinteger.is(_.deleteCount)&&(_.cells===void 0||r.typedArray(_.cells,a.is))}m.is=R;function S(v,_,T){const M={start:v,deleteCount:_};return T!==void 0&&(M.cells=T),M}m.create=S})(c||(e.NotebookCellArrayChange=c={}));var d;(function(m){m.method="notebookDocument/didChange",m.messageDirection=n.MessageDirection.clientToServer,m.type=new n.ProtocolNotificationType(m.method),m.registrationMethod=l.method})(d||(e.DidChangeNotebookDocumentNotification=d={}));var f;(function(m){m.method="notebookDocument/didSave",m.messageDirection=n.MessageDirection.clientToServer,m.type=new n.ProtocolNotificationType(m.method),m.registrationMethod=l.method})(f||(e.DidSaveNotebookDocumentNotification=f={}));var h;(function(m){m.method="notebookDocument/didClose",m.messageDirection=n.MessageDirection.clientToServer,m.type=new n.ProtocolNotificationType(m.method),m.registrationMethod=l.method})(h||(e.DidCloseNotebookDocumentNotification=h={}))})),HE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.InlineCompletionRequest=void 0;var t=De(),r;(function(n){n.method="textDocument/inlineCompletion",n.messageDirection=t.MessageDirection.clientToServer,n.type=new t.ProtocolRequestType(n.method)})(r||(e.InlineCompletionRequest=r={}))})),KE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.WorkspaceSymbolRequest=e.CodeActionResolveRequest=e.CodeActionRequest=e.DocumentSymbolRequest=e.DocumentHighlightRequest=e.ReferencesRequest=e.DefinitionRequest=e.SignatureHelpRequest=e.SignatureHelpTriggerKind=e.HoverRequest=e.CompletionResolveRequest=e.CompletionRequest=e.CompletionTriggerKind=e.PublishDiagnosticsNotification=e.WatchKind=e.RelativePattern=e.FileChangeType=e.DidChangeWatchedFilesNotification=e.WillSaveTextDocumentWaitUntilRequest=e.WillSaveTextDocumentNotification=e.TextDocumentSaveReason=e.DidSaveTextDocumentNotification=e.DidCloseTextDocumentNotification=e.DidChangeTextDocumentNotification=e.TextDocumentContentChangeEvent=e.DidOpenTextDocumentNotification=e.TextDocumentSyncKind=e.TelemetryEventNotification=e.LogMessageNotification=e.ShowMessageRequest=e.ShowMessageNotification=e.MessageType=e.DidChangeConfigurationNotification=e.ExitNotification=e.ShutdownRequest=e.InitializedNotification=e.InitializeErrorCodes=e.InitializeRequest=e.WorkDoneProgressOptions=e.TextDocumentRegistrationOptions=e.StaticRegistrationOptions=e.PositionEncodingKind=e.FailureHandlingKind=e.ResourceOperationKind=e.UnregistrationRequest=e.RegistrationRequest=e.DocumentSelector=e.NotebookCellTextDocumentFilter=e.NotebookDocumentFilter=e.TextDocumentFilter=void 0,e.MonikerRequest=e.MonikerKind=e.UniquenessLevel=e.WillDeleteFilesRequest=e.DidDeleteFilesNotification=e.WillRenameFilesRequest=e.DidRenameFilesNotification=e.WillCreateFilesRequest=e.DidCreateFilesNotification=e.FileOperationPatternKind=e.LinkedEditingRangeRequest=e.ShowDocumentRequest=e.SemanticTokensRegistrationType=e.SemanticTokensRefreshRequest=e.SemanticTokensRangeRequest=e.SemanticTokensDeltaRequest=e.SemanticTokensRequest=e.TokenFormat=e.CallHierarchyPrepareRequest=e.CallHierarchyOutgoingCallsRequest=e.CallHierarchyIncomingCallsRequest=e.WorkDoneProgressCancelNotification=e.WorkDoneProgressCreateRequest=e.WorkDoneProgress=e.SelectionRangeRequest=e.DeclarationRequest=e.FoldingRangeRefreshRequest=e.FoldingRangeRequest=e.ColorPresentationRequest=e.DocumentColorRequest=e.ConfigurationRequest=e.DidChangeWorkspaceFoldersNotification=e.WorkspaceFoldersRequest=e.TypeDefinitionRequest=e.ImplementationRequest=e.ApplyWorkspaceEditRequest=e.ExecuteCommandRequest=e.PrepareRenameRequest=e.RenameRequest=e.PrepareSupportDefaultBehavior=e.DocumentOnTypeFormattingRequest=e.DocumentRangesFormattingRequest=e.DocumentRangeFormattingRequest=e.DocumentFormattingRequest=e.DocumentLinkResolveRequest=e.DocumentLinkRequest=e.CodeLensRefreshRequest=e.CodeLensResolveRequest=e.CodeLensRequest=e.WorkspaceSymbolResolveRequest=void 0,e.InlineCompletionRequest=e.DidCloseNotebookDocumentNotification=e.DidSaveNotebookDocumentNotification=e.DidChangeNotebookDocumentNotification=e.NotebookCellArrayChange=e.DidOpenNotebookDocumentNotification=e.NotebookDocumentSyncRegistrationType=e.NotebookDocument=e.NotebookCell=e.ExecutionSummary=e.NotebookCellKind=e.DiagnosticRefreshRequest=e.WorkspaceDiagnosticRequest=e.DocumentDiagnosticRequest=e.DocumentDiagnosticReportKind=e.DiagnosticServerCancellationData=e.InlayHintRefreshRequest=e.InlayHintResolveRequest=e.InlayHintRequest=e.InlineValueRefreshRequest=e.InlineValueRequest=e.TypeHierarchySupertypesRequest=e.TypeHierarchySubtypesRequest=e.TypeHierarchyPrepareRequest=void 0;var t=De(),r=(yn(),vd(Jd)),n=af(),i=SE();Object.defineProperty(e,"ImplementationRequest",{enumerable:!0,get:function(){return i.ImplementationRequest}});var s=bE();Object.defineProperty(e,"TypeDefinitionRequest",{enumerable:!0,get:function(){return s.TypeDefinitionRequest}});var a=kE();Object.defineProperty(e,"WorkspaceFoldersRequest",{enumerable:!0,get:function(){return a.WorkspaceFoldersRequest}}),Object.defineProperty(e,"DidChangeWorkspaceFoldersNotification",{enumerable:!0,get:function(){return a.DidChangeWorkspaceFoldersNotification}});var o=$E();Object.defineProperty(e,"ConfigurationRequest",{enumerable:!0,get:function(){return o.ConfigurationRequest}});var l=EE();Object.defineProperty(e,"DocumentColorRequest",{enumerable:!0,get:function(){return l.DocumentColorRequest}}),Object.defineProperty(e,"ColorPresentationRequest",{enumerable:!0,get:function(){return l.ColorPresentationRequest}});var u=AE();Object.defineProperty(e,"FoldingRangeRequest",{enumerable:!0,get:function(){return u.FoldingRangeRequest}}),Object.defineProperty(e,"FoldingRangeRefreshRequest",{enumerable:!0,get:function(){return u.FoldingRangeRefreshRequest}});var c=IE();Object.defineProperty(e,"DeclarationRequest",{enumerable:!0,get:function(){return c.DeclarationRequest}});var d=NE();Object.defineProperty(e,"SelectionRangeRequest",{enumerable:!0,get:function(){return d.SelectionRangeRequest}});var f=PE();Object.defineProperty(e,"WorkDoneProgress",{enumerable:!0,get:function(){return f.WorkDoneProgress}}),Object.defineProperty(e,"WorkDoneProgressCreateRequest",{enumerable:!0,get:function(){return f.WorkDoneProgressCreateRequest}}),Object.defineProperty(e,"WorkDoneProgressCancelNotification",{enumerable:!0,get:function(){return f.WorkDoneProgressCancelNotification}});var h=DE();Object.defineProperty(e,"CallHierarchyIncomingCallsRequest",{enumerable:!0,get:function(){return h.CallHierarchyIncomingCallsRequest}}),Object.defineProperty(e,"CallHierarchyOutgoingCallsRequest",{enumerable:!0,get:function(){return h.CallHierarchyOutgoingCallsRequest}}),Object.defineProperty(e,"CallHierarchyPrepareRequest",{enumerable:!0,get:function(){return h.CallHierarchyPrepareRequest}});var m=OE();Object.defineProperty(e,"TokenFormat",{enumerable:!0,get:function(){return m.TokenFormat}}),Object.defineProperty(e,"SemanticTokensRequest",{enumerable:!0,get:function(){return m.SemanticTokensRequest}}),Object.defineProperty(e,"SemanticTokensDeltaRequest",{enumerable:!0,get:function(){return m.SemanticTokensDeltaRequest}}),Object.defineProperty(e,"SemanticTokensRangeRequest",{enumerable:!0,get:function(){return m.SemanticTokensRangeRequest}}),Object.defineProperty(e,"SemanticTokensRefreshRequest",{enumerable:!0,get:function(){return m.SemanticTokensRefreshRequest}}),Object.defineProperty(e,"SemanticTokensRegistrationType",{enumerable:!0,get:function(){return m.SemanticTokensRegistrationType}});var R=LE();Object.defineProperty(e,"ShowDocumentRequest",{enumerable:!0,get:function(){return R.ShowDocumentRequest}});var S=ME();Object.defineProperty(e,"LinkedEditingRangeRequest",{enumerable:!0,get:function(){return S.LinkedEditingRangeRequest}});var v=FE();Object.defineProperty(e,"FileOperationPatternKind",{enumerable:!0,get:function(){return v.FileOperationPatternKind}}),Object.defineProperty(e,"DidCreateFilesNotification",{enumerable:!0,get:function(){return v.DidCreateFilesNotification}}),Object.defineProperty(e,"WillCreateFilesRequest",{enumerable:!0,get:function(){return v.WillCreateFilesRequest}}),Object.defineProperty(e,"DidRenameFilesNotification",{enumerable:!0,get:function(){return v.DidRenameFilesNotification}}),Object.defineProperty(e,"WillRenameFilesRequest",{enumerable:!0,get:function(){return v.WillRenameFilesRequest}}),Object.defineProperty(e,"DidDeleteFilesNotification",{enumerable:!0,get:function(){return v.DidDeleteFilesNotification}}),Object.defineProperty(e,"WillDeleteFilesRequest",{enumerable:!0,get:function(){return v.WillDeleteFilesRequest}});var _=xE();Object.defineProperty(e,"UniquenessLevel",{enumerable:!0,get:function(){return _.UniquenessLevel}}),Object.defineProperty(e,"MonikerKind",{enumerable:!0,get:function(){return _.MonikerKind}}),Object.defineProperty(e,"MonikerRequest",{enumerable:!0,get:function(){return _.MonikerRequest}});var T=qE();Object.defineProperty(e,"TypeHierarchyPrepareRequest",{enumerable:!0,get:function(){return T.TypeHierarchyPrepareRequest}}),Object.defineProperty(e,"TypeHierarchySubtypesRequest",{enumerable:!0,get:function(){return T.TypeHierarchySubtypesRequest}}),Object.defineProperty(e,"TypeHierarchySupertypesRequest",{enumerable:!0,get:function(){return T.TypeHierarchySupertypesRequest}});var M=jE();Object.defineProperty(e,"InlineValueRequest",{enumerable:!0,get:function(){return M.InlineValueRequest}}),Object.defineProperty(e,"InlineValueRefreshRequest",{enumerable:!0,get:function(){return M.InlineValueRefreshRequest}});var F=UE();Object.defineProperty(e,"InlayHintRequest",{enumerable:!0,get:function(){return F.InlayHintRequest}}),Object.defineProperty(e,"InlayHintResolveRequest",{enumerable:!0,get:function(){return F.InlayHintResolveRequest}}),Object.defineProperty(e,"InlayHintRefreshRequest",{enumerable:!0,get:function(){return F.InlayHintRefreshRequest}});var W=WE();Object.defineProperty(e,"DiagnosticServerCancellationData",{enumerable:!0,get:function(){return W.DiagnosticServerCancellationData}}),Object.defineProperty(e,"DocumentDiagnosticReportKind",{enumerable:!0,get:function(){return W.DocumentDiagnosticReportKind}}),Object.defineProperty(e,"DocumentDiagnosticRequest",{enumerable:!0,get:function(){return W.DocumentDiagnosticRequest}}),Object.defineProperty(e,"WorkspaceDiagnosticRequest",{enumerable:!0,get:function(){return W.WorkspaceDiagnosticRequest}}),Object.defineProperty(e,"DiagnosticRefreshRequest",{enumerable:!0,get:function(){return W.DiagnosticRefreshRequest}});var U=BE();Object.defineProperty(e,"NotebookCellKind",{enumerable:!0,get:function(){return U.NotebookCellKind}}),Object.defineProperty(e,"ExecutionSummary",{enumerable:!0,get:function(){return U.ExecutionSummary}}),Object.defineProperty(e,"NotebookCell",{enumerable:!0,get:function(){return U.NotebookCell}}),Object.defineProperty(e,"NotebookDocument",{enumerable:!0,get:function(){return U.NotebookDocument}}),Object.defineProperty(e,"NotebookDocumentSyncRegistrationType",{enumerable:!0,get:function(){return U.NotebookDocumentSyncRegistrationType}}),Object.defineProperty(e,"DidOpenNotebookDocumentNotification",{enumerable:!0,get:function(){return U.DidOpenNotebookDocumentNotification}}),Object.defineProperty(e,"NotebookCellArrayChange",{enumerable:!0,get:function(){return U.NotebookCellArrayChange}}),Object.defineProperty(e,"DidChangeNotebookDocumentNotification",{enumerable:!0,get:function(){return U.DidChangeNotebookDocumentNotification}}),Object.defineProperty(e,"DidSaveNotebookDocumentNotification",{enumerable:!0,get:function(){return U.DidSaveNotebookDocumentNotification}}),Object.defineProperty(e,"DidCloseNotebookDocumentNotification",{enumerable:!0,get:function(){return U.DidCloseNotebookDocumentNotification}});var ee=HE();Object.defineProperty(e,"InlineCompletionRequest",{enumerable:!0,get:function(){return ee.InlineCompletionRequest}});var se;(function(p){function je(Ue){const re=Ue;return n.string(re)||n.string(re.language)||n.string(re.scheme)||n.string(re.pattern)}p.is=je})(se||(e.TextDocumentFilter=se={}));var he;(function(p){function je(Ue){const re=Ue;return n.objectLiteral(re)&&(n.string(re.notebookType)||n.string(re.scheme)||n.string(re.pattern))}p.is=je})(he||(e.NotebookDocumentFilter=he={}));var x;(function(p){function je(Ue){const re=Ue;return n.objectLiteral(re)&&(n.string(re.notebook)||he.is(re.notebook))&&(re.language===void 0||n.string(re.language))}p.is=je})(x||(e.NotebookCellTextDocumentFilter=x={}));var A;(function(p){function je(Ue){if(!Array.isArray(Ue))return!1;for(let re of Ue)if(!n.string(re)&&!se.is(re)&&!x.is(re))return!1;return!0}p.is=je})(A||(e.DocumentSelector=A={}));var y;(function(p){p.method="client/registerCapability",p.messageDirection=t.MessageDirection.serverToClient,p.type=new t.ProtocolRequestType(p.method)})(y||(e.RegistrationRequest=y={}));var b;(function(p){p.method="client/unregisterCapability",p.messageDirection=t.MessageDirection.serverToClient,p.type=new t.ProtocolRequestType(p.method)})(b||(e.UnregistrationRequest=b={}));var q;(function(p){p.Create="create",p.Rename="rename",p.Delete="delete"})(q||(e.ResourceOperationKind=q={}));var O;(function(p){p.Abort="abort",p.Transactional="transactional",p.TextOnlyTransactional="textOnlyTransactional",p.Undo="undo"})(O||(e.FailureHandlingKind=O={}));var $;(function(p){p.UTF8="utf-8",p.UTF16="utf-16",p.UTF32="utf-32"})($||(e.PositionEncodingKind=$={}));var k;(function(p){function je(Ue){const re=Ue;return re&&n.string(re.id)&&re.id.length>0}p.hasId=je})(k||(e.StaticRegistrationOptions=k={}));var ie;(function(p){function je(Ue){const re=Ue;return re&&(re.documentSelector===null||A.is(re.documentSelector))}p.is=je})(ie||(e.TextDocumentRegistrationOptions=ie={}));var de;(function(p){function je(re){const g=re;return n.objectLiteral(g)&&(g.workDoneProgress===void 0||n.boolean(g.workDoneProgress))}p.is=je;function Ue(re){const g=re;return g&&n.boolean(g.workDoneProgress)}p.hasWorkDoneProgress=Ue})(de||(e.WorkDoneProgressOptions=de={}));var Ge;(function(p){p.method="initialize",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(Ge||(e.InitializeRequest=Ge={}));var ut;(function(p){p.unknownProtocolVersion=1})(ut||(e.InitializeErrorCodes=ut={}));var ae;(function(p){p.method="initialized",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolNotificationType(p.method)})(ae||(e.InitializedNotification=ae={}));var ze;(function(p){p.method="shutdown",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType0(p.method)})(ze||(e.ShutdownRequest=ze={}));var ye;(function(p){p.method="exit",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolNotificationType0(p.method)})(ye||(e.ExitNotification=ye={}));var Ie;(function(p){p.method="workspace/didChangeConfiguration",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolNotificationType(p.method)})(Ie||(e.DidChangeConfigurationNotification=Ie={}));var ct;(function(p){p.Error=1,p.Warning=2,p.Info=3,p.Log=4,p.Debug=5})(ct||(e.MessageType=ct={}));var ve;(function(p){p.method="window/showMessage",p.messageDirection=t.MessageDirection.serverToClient,p.type=new t.ProtocolNotificationType(p.method)})(ve||(e.ShowMessageNotification=ve={}));var Oe;(function(p){p.method="window/showMessageRequest",p.messageDirection=t.MessageDirection.serverToClient,p.type=new t.ProtocolRequestType(p.method)})(Oe||(e.ShowMessageRequest=Oe={}));var et;(function(p){p.method="window/logMessage",p.messageDirection=t.MessageDirection.serverToClient,p.type=new t.ProtocolNotificationType(p.method)})(et||(e.LogMessageNotification=et={}));var w;(function(p){p.method="telemetry/event",p.messageDirection=t.MessageDirection.serverToClient,p.type=new t.ProtocolNotificationType(p.method)})(w||(e.TelemetryEventNotification=w={}));var I;(function(p){p.None=0,p.Full=1,p.Incremental=2})(I||(e.TextDocumentSyncKind=I={}));var L;(function(p){p.method="textDocument/didOpen",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolNotificationType(p.method)})(L||(e.DidOpenTextDocumentNotification=L={}));var Z;(function(p){function je(re){let g=re;return g!=null&&typeof g.text=="string"&&g.range!==void 0&&(g.rangeLength===void 0||typeof g.rangeLength=="number")}p.isIncremental=je;function Ue(re){let g=re;return g!=null&&typeof g.text=="string"&&g.range===void 0&&g.rangeLength===void 0}p.isFull=Ue})(Z||(e.TextDocumentContentChangeEvent=Z={}));var P;(function(p){p.method="textDocument/didChange",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolNotificationType(p.method)})(P||(e.DidChangeTextDocumentNotification=P={}));var tt;(function(p){p.method="textDocument/didClose",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolNotificationType(p.method)})(tt||(e.DidCloseTextDocumentNotification=tt={}));var Wt;(function(p){p.method="textDocument/didSave",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolNotificationType(p.method)})(Wt||(e.DidSaveTextDocumentNotification=Wt={}));var Dr;(function(p){p.Manual=1,p.AfterDelay=2,p.FocusOut=3})(Dr||(e.TextDocumentSaveReason=Dr={}));var Or;(function(p){p.method="textDocument/willSave",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolNotificationType(p.method)})(Or||(e.WillSaveTextDocumentNotification=Or={}));var Lr;(function(p){p.method="textDocument/willSaveWaitUntil",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(Lr||(e.WillSaveTextDocumentWaitUntilRequest=Lr={}));var Tt;(function(p){p.method="workspace/didChangeWatchedFiles",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolNotificationType(p.method)})(Tt||(e.DidChangeWatchedFilesNotification=Tt={}));var Mr;(function(p){p.Created=1,p.Changed=2,p.Deleted=3})(Mr||(e.FileChangeType=Mr={}));var pr;(function(p){function je(Ue){const re=Ue;return n.objectLiteral(re)&&(r.URI.is(re.baseUri)||r.WorkspaceFolder.is(re.baseUri))&&n.string(re.pattern)}p.is=je})(pr||(e.RelativePattern=pr={}));var wn;(function(p){p.Create=1,p.Change=2,p.Delete=4})(wn||(e.WatchKind=wn={}));var mr;(function(p){p.method="textDocument/publishDiagnostics",p.messageDirection=t.MessageDirection.serverToClient,p.type=new t.ProtocolNotificationType(p.method)})(mr||(e.PublishDiagnosticsNotification=mr={}));var gr;(function(p){p.Invoked=1,p.TriggerCharacter=2,p.TriggerForIncompleteCompletions=3})(gr||(e.CompletionTriggerKind=gr={}));var Zt;(function(p){p.method="textDocument/completion",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(Zt||(e.CompletionRequest=Zt={}));var Mt;(function(p){p.method="completionItem/resolve",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(Mt||(e.CompletionResolveRequest=Mt={}));var E;(function(p){p.method="textDocument/hover",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(E||(e.HoverRequest=E={}));var N;(function(p){p.Invoked=1,p.TriggerCharacter=2,p.ContentChange=3})(N||(e.SignatureHelpTriggerKind=N={}));var B;(function(p){p.method="textDocument/signatureHelp",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(B||(e.SignatureHelpRequest=B={}));var Ye;(function(p){p.method="textDocument/definition",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(Ye||(e.DefinitionRequest=Ye={}));var Yr;(function(p){p.method="textDocument/references",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(Yr||(e.ReferencesRequest=Yr={}));var ri;(function(p){p.method="textDocument/documentHighlight",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(ri||(e.DocumentHighlightRequest=ri={}));var pa;(function(p){p.method="textDocument/documentSymbol",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(pa||(e.DocumentSymbolRequest=pa={}));var ma;(function(p){p.method="textDocument/codeAction",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(ma||(e.CodeActionRequest=ma={}));var ga;(function(p){p.method="codeAction/resolve",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(ga||(e.CodeActionResolveRequest=ga={}));var ya;(function(p){p.method="workspace/symbol",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(ya||(e.WorkspaceSymbolRequest=ya={}));var va;(function(p){p.method="workspaceSymbol/resolve",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(va||(e.WorkspaceSymbolResolveRequest=va={}));var Ta;(function(p){p.method="textDocument/codeLens",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(Ta||(e.CodeLensRequest=Ta={}));var Bt;(function(p){p.method="codeLens/resolve",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(Bt||(e.CodeLensResolveRequest=Bt={}));var Ra;(function(p){p.method="workspace/codeLens/refresh",p.messageDirection=t.MessageDirection.serverToClient,p.type=new t.ProtocolRequestType0(p.method)})(Ra||(e.CodeLensRefreshRequest=Ra={}));var wa;(function(p){p.method="textDocument/documentLink",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(wa||(e.DocumentLinkRequest=wa={}));var Xr;(function(p){p.method="documentLink/resolve",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(Xr||(e.DocumentLinkResolveRequest=Xr={}));var Ca;(function(p){p.method="textDocument/formatting",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(Ca||(e.DocumentFormattingRequest=Ca={}));var Cn;(function(p){p.method="textDocument/rangeFormatting",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(Cn||(e.DocumentRangeFormattingRequest=Cn={}));var _a;(function(p){p.method="textDocument/rangesFormatting",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(_a||(e.DocumentRangesFormattingRequest=_a={}));var yr;(function(p){p.method="textDocument/onTypeFormatting",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(yr||(e.DocumentOnTypeFormattingRequest=yr={}));var Fr;(function(p){p.Identifier=1})(Fr||(e.PrepareSupportDefaultBehavior=Fr={}));var Sa;(function(p){p.method="textDocument/rename",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(Sa||(e.RenameRequest=Sa={}));var ba;(function(p){p.method="textDocument/prepareRename",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(ba||(e.PrepareRenameRequest=ba={}));var xr;(function(p){p.method="workspace/executeCommand",p.messageDirection=t.MessageDirection.clientToServer,p.type=new t.ProtocolRequestType(p.method)})(xr||(e.ExecuteCommandRequest=xr={}));var ni;(function(p){p.method="workspace/applyEdit",p.messageDirection=t.MessageDirection.serverToClient,p.type=new t.ProtocolRequestType("workspace/applyEdit")})(ni||(e.ApplyWorkspaceEditRequest=ni={}))})),GE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.createProtocolConnection=void 0;var t=Zn();function r(n,i,s,a){return t.ConnectionStrategy.is(a)&&(a={connectionStrategy:a}),(0,t.createMessageConnection)(n,i,s,a)}e.createProtocolConnection=r})),zE=H((e=>{var t=e&&e.__createBinding||(Object.create?(function(s,a,o,l){l===void 0&&(l=o);var u=Object.getOwnPropertyDescriptor(a,o);(!u||("get"in u?!a.__esModule:u.writable||u.configurable))&&(u={enumerable:!0,get:function(){return a[o]}}),Object.defineProperty(s,l,u)}):(function(s,a,o,l){l===void 0&&(l=o),s[l]=a[o]})),r=e&&e.__exportStar||function(s,a){for(var o in s)o!=="default"&&!Object.prototype.hasOwnProperty.call(a,o)&&t(a,s,o)};Object.defineProperty(e,"__esModule",{value:!0}),e.LSPErrorCodes=e.createProtocolConnection=void 0,r(Zn(),e),r((yn(),vd(Jd)),e),r(De(),e),r(KE(),e);var n=GE();Object.defineProperty(e,"createProtocolConnection",{enumerable:!0,get:function(){return n.createProtocolConnection}});var i;(function(s){s.lspReservedErrorRangeStart=-32899,s.RequestFailed=-32803,s.ServerCancelled=-32802,s.ContentModified=-32801,s.RequestCancelled=-32800,s.lspReservedErrorRangeEnd=-32800})(i||(e.LSPErrorCodes=i={}))})),Ke=H((e=>{var t=e&&e.__createBinding||(Object.create?(function(s,a,o,l){l===void 0&&(l=o);var u=Object.getOwnPropertyDescriptor(a,o);(!u||("get"in u?!a.__esModule:u.writable||u.configurable))&&(u={enumerable:!0,get:function(){return a[o]}}),Object.defineProperty(s,l,u)}):(function(s,a,o,l){l===void 0&&(l=o),s[l]=a[o]})),r=e&&e.__exportStar||function(s,a){for(var o in s)o!=="default"&&!Object.prototype.hasOwnProperty.call(a,o)&&t(a,s,o)};Object.defineProperty(e,"__esModule",{value:!0}),e.createProtocolConnection=void 0;var n=up();r(up(),e),r(zE(),e);function i(s,a,o,l){return(0,n.createMessageConnection)(s,a,o,l)}e.createProtocolConnection=i})),Ly=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.SemanticTokensBuilder=e.SemanticTokensDiff=e.SemanticTokensFeature=void 0;var t=Ke(),r=s=>class extends s{get semanticTokens(){return{refresh:()=>this.connection.sendRequest(t.SemanticTokensRefreshRequest.type),on:a=>{const o=t.SemanticTokensRequest.type;return this.connection.onRequest(o,(l,u)=>a(l,u,this.attachWorkDoneProgress(l),this.attachPartialResultProgress(o,l)))},onDelta:a=>{const o=t.SemanticTokensDeltaRequest.type;return this.connection.onRequest(o,(l,u)=>a(l,u,this.attachWorkDoneProgress(l),this.attachPartialResultProgress(o,l)))},onRange:a=>{const o=t.SemanticTokensRangeRequest.type;return this.connection.onRequest(o,(l,u)=>a(l,u,this.attachWorkDoneProgress(l),this.attachPartialResultProgress(o,l)))}}}};e.SemanticTokensFeature=r;var n=class{constructor(s,a){this.originalSequence=s,this.modifiedSequence=a}computeDiff(){const s=this.originalSequence.length,a=this.modifiedSequence.length;let o=0;for(;o<a&&o<s&&this.originalSequence[o]===this.modifiedSequence[o];)o++;if(o<a&&o<s){let l=s-1,u=a-1;for(;l>=o&&u>=o&&this.originalSequence[l]===this.modifiedSequence[u];)l--,u--;(l<o||u<o)&&(l++,u++);const c=l-o+1,d=this.modifiedSequence.slice(o,u+1);return d.length===1&&d[0]===this.originalSequence[l]?[{start:o,deleteCount:c-1}]:[{start:o,deleteCount:c,data:d}]}else return o<a?[{start:o,deleteCount:0,data:this.modifiedSequence.slice(o)}]:o<s?[{start:o,deleteCount:s-o}]:[]}};e.SemanticTokensDiff=n;var i=class{constructor(){this._prevData=void 0,this.initialize()}initialize(){this._id=Date.now(),this._prevLine=0,this._prevChar=0,this._data=[],this._dataLen=0}push(s,a,o,l,u){let c=s,d=a;this._dataLen>0&&(c-=this._prevLine,c===0&&(d-=this._prevChar)),this._data[this._dataLen++]=c,this._data[this._dataLen++]=d,this._data[this._dataLen++]=o,this._data[this._dataLen++]=l,this._data[this._dataLen++]=u,this._prevLine=s,this._prevChar=a}get id(){return this._id.toString()}previousResult(s){this.id===s&&(this._prevData=this._data),this.initialize()}build(){return this._prevData=void 0,{resultId:this.id,data:this._data}}canBuildEdits(){return this._prevData!==void 0}buildEdits(){return this._prevData!==void 0?{resultId:this.id,edits:new n(this._prevData,this._data).computeDiff()}:this.build()}};e.SemanticTokensBuilder=i})),VE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.InlineCompletionFeature=void 0;var t=Ke(),r=n=>class extends n{get inlineCompletion(){return{on:i=>this.connection.onRequest(t.InlineCompletionRequest.type,(s,a)=>i(s,a,this.attachWorkDoneProgress(s)))}}};e.InlineCompletionFeature=r})),My=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.TextDocuments=void 0;var t=Ke(),r=class{constructor(n){this._configuration=n,this._syncedDocuments=new Map,this._onDidChangeContent=new t.Emitter,this._onDidOpen=new t.Emitter,this._onDidClose=new t.Emitter,this._onDidSave=new t.Emitter,this._onWillSave=new t.Emitter}get onDidOpen(){return this._onDidOpen.event}get onDidChangeContent(){return this._onDidChangeContent.event}get onWillSave(){return this._onWillSave.event}onWillSaveWaitUntil(n){this._willSaveWaitUntil=n}get onDidSave(){return this._onDidSave.event}get onDidClose(){return this._onDidClose.event}get(n){return this._syncedDocuments.get(n)}all(){return Array.from(this._syncedDocuments.values())}keys(){return Array.from(this._syncedDocuments.keys())}listen(n){n.__textDocumentSync=t.TextDocumentSyncKind.Incremental;const i=[];return i.push(n.onDidOpenTextDocument(s=>{const a=s.textDocument,o=this._configuration.create(a.uri,a.languageId,a.version,a.text);this._syncedDocuments.set(a.uri,o);const l=Object.freeze({document:o});this._onDidOpen.fire(l),this._onDidChangeContent.fire(l)})),i.push(n.onDidChangeTextDocument(s=>{const a=s.textDocument,o=s.contentChanges;if(o.length===0)return;const{version:l}=a;if(l==null)throw new Error(`Received document change event for ${a.uri} without valid version identifier`);let u=this._syncedDocuments.get(a.uri);u!==void 0&&(u=this._configuration.update(u,o,l),this._syncedDocuments.set(a.uri,u),this._onDidChangeContent.fire(Object.freeze({document:u})))})),i.push(n.onDidCloseTextDocument(s=>{let a=this._syncedDocuments.get(s.textDocument.uri);a!==void 0&&(this._syncedDocuments.delete(s.textDocument.uri),this._onDidClose.fire(Object.freeze({document:a})))})),i.push(n.onWillSaveTextDocument(s=>{let a=this._syncedDocuments.get(s.textDocument.uri);a!==void 0&&this._onWillSave.fire(Object.freeze({document:a,reason:s.reason}))})),i.push(n.onWillSaveTextDocumentWaitUntil((s,a)=>{let o=this._syncedDocuments.get(s.textDocument.uri);return o!==void 0&&this._willSaveWaitUntil?this._willSaveWaitUntil(Object.freeze({document:o,reason:s.reason}),a):[]})),i.push(n.onDidSaveTextDocument(s=>{let a=this._syncedDocuments.get(s.textDocument.uri);a!==void 0&&this._onDidSave.fire(Object.freeze({document:a}))})),t.Disposable.create(()=>{i.forEach(s=>s.dispose())})}};e.TextDocuments=r})),Fy=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.NotebookDocuments=e.NotebookSyncFeature=void 0;var t=Ke(),r=My(),n=a=>class extends a{get synchronization(){return{onDidOpenNotebookDocument:o=>this.connection.onNotification(t.DidOpenNotebookDocumentNotification.type,l=>{o(l)}),onDidChangeNotebookDocument:o=>this.connection.onNotification(t.DidChangeNotebookDocumentNotification.type,l=>{o(l)}),onDidSaveNotebookDocument:o=>this.connection.onNotification(t.DidSaveNotebookDocumentNotification.type,l=>{o(l)}),onDidCloseNotebookDocument:o=>this.connection.onNotification(t.DidCloseNotebookDocumentNotification.type,l=>{o(l)})}}};e.NotebookSyncFeature=n;var i=class Oo{onDidOpenTextDocument(o){return this.openHandler=o,t.Disposable.create(()=>{this.openHandler=void 0})}openTextDocument(o){this.openHandler&&this.openHandler(o)}onDidChangeTextDocument(o){return this.changeHandler=o,t.Disposable.create(()=>{this.changeHandler=o})}changeTextDocument(o){this.changeHandler&&this.changeHandler(o)}onDidCloseTextDocument(o){return this.closeHandler=o,t.Disposable.create(()=>{this.closeHandler=void 0})}closeTextDocument(o){this.closeHandler&&this.closeHandler(o)}onWillSaveTextDocument(){return Oo.NULL_DISPOSE}onWillSaveTextDocumentWaitUntil(){return Oo.NULL_DISPOSE}onDidSaveTextDocument(){return Oo.NULL_DISPOSE}};i.NULL_DISPOSE=Object.freeze({dispose:()=>{}});var s=class{constructor(a){a instanceof r.TextDocuments?this._cellTextDocuments=a:this._cellTextDocuments=new r.TextDocuments(a),this.notebookDocuments=new Map,this.notebookCellMap=new Map,this._onDidOpen=new t.Emitter,this._onDidChange=new t.Emitter,this._onDidSave=new t.Emitter,this._onDidClose=new t.Emitter}get cellTextDocuments(){return this._cellTextDocuments}getCellTextDocument(a){return this._cellTextDocuments.get(a.document)}getNotebookDocument(a){return this.notebookDocuments.get(a)}getNotebookCell(a){const o=this.notebookCellMap.get(a);return o&&o[0]}findNotebookDocumentForCell(a){const o=typeof a=="string"?a:a.document,l=this.notebookCellMap.get(o);return l&&l[1]}get onDidOpen(){return this._onDidOpen.event}get onDidSave(){return this._onDidSave.event}get onDidChange(){return this._onDidChange.event}get onDidClose(){return this._onDidClose.event}listen(a){const o=new i,l=[];return l.push(this.cellTextDocuments.listen(o)),l.push(a.notebooks.synchronization.onDidOpenNotebookDocument(u=>{this.notebookDocuments.set(u.notebookDocument.uri,u.notebookDocument);for(const c of u.cellTextDocuments)o.openTextDocument({textDocument:c});this.updateCellMap(u.notebookDocument),this._onDidOpen.fire(u.notebookDocument)})),l.push(a.notebooks.synchronization.onDidChangeNotebookDocument(u=>{const c=this.notebookDocuments.get(u.notebookDocument.uri);if(c===void 0)return;c.version=u.notebookDocument.version;const d=c.metadata;let f=!1;const h=u.change;h.metadata!==void 0&&(f=!0,c.metadata=h.metadata);const m=[],R=[],S=[],v=[];if(h.cells!==void 0){const W=h.cells;if(W.structure!==void 0){const U=W.structure.array;if(c.cells.splice(U.start,U.deleteCount,...U.cells!==void 0?U.cells:[]),W.structure.didOpen!==void 0)for(const ee of W.structure.didOpen)o.openTextDocument({textDocument:ee}),m.push(ee.uri);if(W.structure.didClose)for(const ee of W.structure.didClose)o.closeTextDocument({textDocument:ee}),R.push(ee.uri)}if(W.data!==void 0){const U=new Map(W.data.map(ee=>[ee.document,ee]));for(let ee=0;ee<=c.cells.length;ee++){const se=U.get(c.cells[ee].document);if(se!==void 0){const he=c.cells.splice(ee,1,se);if(S.push({old:he[0],new:se}),U.delete(se.document),U.size===0)break}}}if(W.textContent!==void 0)for(const U of W.textContent)o.changeTextDocument({textDocument:U.document,contentChanges:U.changes}),v.push(U.document.uri)}this.updateCellMap(c);const _={notebookDocument:c};f&&(_.metadata={old:d,new:c.metadata});const T=[];for(const W of m)T.push(this.getNotebookCell(W));const M=[];for(const W of R)M.push(this.getNotebookCell(W));const F=[];for(const W of v)F.push(this.getNotebookCell(W));(T.length>0||M.length>0||S.length>0||F.length>0)&&(_.cells={added:T,removed:M,changed:{data:S,textContent:F}}),(_.metadata!==void 0||_.cells!==void 0)&&this._onDidChange.fire(_)})),l.push(a.notebooks.synchronization.onDidSaveNotebookDocument(u=>{const c=this.notebookDocuments.get(u.notebookDocument.uri);c!==void 0&&this._onDidSave.fire(c)})),l.push(a.notebooks.synchronization.onDidCloseNotebookDocument(u=>{const c=this.notebookDocuments.get(u.notebookDocument.uri);if(c!==void 0){this._onDidClose.fire(c);for(const d of u.cellTextDocuments)o.closeTextDocument({textDocument:d});this.notebookDocuments.delete(u.notebookDocument.uri);for(const d of c.cells)this.notebookCellMap.delete(d.document)}})),t.Disposable.create(()=>{l.forEach(u=>u.dispose())})}updateCellMap(a){for(const o of a.cells)this.notebookCellMap.set(o.document,[o,a])}};e.NotebookDocuments=s})),xy=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.thenable=e.typedArray=e.stringArray=e.array=e.func=e.error=e.number=e.string=e.boolean=void 0;function t(c){return c===!0||c===!1}e.boolean=t;function r(c){return typeof c=="string"||c instanceof String}e.string=r;function n(c){return typeof c=="number"||c instanceof Number}e.number=n;function i(c){return c instanceof Error}e.error=i;function s(c){return typeof c=="function"}e.func=s;function a(c){return Array.isArray(c)}e.array=a;function o(c){return a(c)&&c.every(d=>r(d))}e.stringArray=o;function l(c,d){return Array.isArray(c)&&c.every(d)}e.typedArray=l;function u(c){return c&&s(c.then)}e.thenable=u})),qy=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.generateUuid=e.parse=e.isUUID=e.v4=e.empty=void 0;var t=class{constructor(l){this._value=l}asHex(){return this._value}equals(l){return this.asHex()===l.asHex()}},r=class oe extends t{static _oneOf(u){return u[Math.floor(u.length*Math.random())]}static _randomHex(){return oe._oneOf(oe._chars)}constructor(){super([oe._randomHex(),oe._randomHex(),oe._randomHex(),oe._randomHex(),oe._randomHex(),oe._randomHex(),oe._randomHex(),oe._randomHex(),"-",oe._randomHex(),oe._randomHex(),oe._randomHex(),oe._randomHex(),"-","4",oe._randomHex(),oe._randomHex(),oe._randomHex(),"-",oe._oneOf(oe._timeHighBits),oe._randomHex(),oe._randomHex(),oe._randomHex(),"-",oe._randomHex(),oe._randomHex(),oe._randomHex(),oe._randomHex(),oe._randomHex(),oe._randomHex(),oe._randomHex(),oe._randomHex(),oe._randomHex(),oe._randomHex(),oe._randomHex(),oe._randomHex()].join(""))}};r._chars=["0","1","2","3","4","5","6","6","7","8","9","a","b","c","d","e","f"],r._timeHighBits=["8","9","a","b"],e.empty=new t("00000000-0000-0000-0000-000000000000");function n(){return new r}e.v4=n;var i=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;function s(l){return i.test(l)}e.isUUID=s;function a(l){if(!s(l))throw new Error("invalid uuid");return new t(l)}e.parse=a;function o(){return n().asHex()}e.generateUuid=o})),YE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.attachPartialResult=e.ProgressFeature=e.attachWorkDone=void 0;var t=Ke(),r=qy(),n=class ad{constructor(h,m){this._connection=h,this._token=m,ad.Instances.set(this._token,this)}begin(h,m,R,S){let v={kind:"begin",title:h,percentage:m,message:R,cancellable:S};this._connection.sendProgress(t.WorkDoneProgress.type,this._token,v)}report(h,m){let R={kind:"report"};typeof h=="number"?(R.percentage=h,m!==void 0&&(R.message=m)):R.message=h,this._connection.sendProgress(t.WorkDoneProgress.type,this._token,R)}done(){ad.Instances.delete(this._token),this._connection.sendProgress(t.WorkDoneProgress.type,this._token,{kind:"end"})}};n.Instances=new Map;var i=class extends n{constructor(f,h){super(f,h),this._source=new t.CancellationTokenSource}get token(){return this._source.token}done(){this._source.dispose(),super.done()}cancel(){this._source.cancel()}},s=class{constructor(){}begin(){}report(){}done(){}},a=class extends s{constructor(){super(),this._source=new t.CancellationTokenSource}get token(){return this._source.token}done(){this._source.dispose()}cancel(){this._source.cancel()}};function o(f,h){if(h===void 0||h.workDoneToken===void 0)return new s;const m=h.workDoneToken;return delete h.workDoneToken,new n(f,m)}e.attachWorkDone=o;var l=f=>class extends f{constructor(){super(),this._progressSupported=!1}initialize(h){super.initialize(h),h?.window?.workDoneProgress===!0&&(this._progressSupported=!0,this.connection.onNotification(t.WorkDoneProgressCancelNotification.type,m=>{let R=n.Instances.get(m.token);(R instanceof i||R instanceof a)&&R.cancel()}))}attachWorkDoneProgress(h){return h===void 0?new s:new n(this.connection,h)}createWorkDoneProgress(){if(this._progressSupported){const h=(0,r.generateUuid)();return this.connection.sendRequest(t.WorkDoneProgressCreateRequest.type,{token:h}).then(()=>new i(this.connection,h))}else return Promise.resolve(new a)}};e.ProgressFeature=l;var u;(function(f){f.type=new t.ProgressType})(u||(u={}));var c=class{constructor(f,h){this._connection=f,this._token=h}report(f){this._connection.sendProgress(u.type,this._token,f)}};function d(f,h){if(h===void 0||h.partialResultToken===void 0)return;const m=h.partialResultToken;return delete h.partialResultToken,new c(f,m)}e.attachPartialResult=d})),XE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.ConfigurationFeature=void 0;var t=Ke(),r=xy(),n=i=>class extends i{getConfiguration(s){return s?r.string(s)?this._getConfiguration({section:s}):this._getConfiguration(s):this._getConfiguration({})}_getConfiguration(s){let a={items:Array.isArray(s)?s:[s]};return this.connection.sendRequest(t.ConfigurationRequest.type,a).then(o=>Array.isArray(o)?Array.isArray(s)?o:o[0]:Array.isArray(s)?[]:null)}};e.ConfigurationFeature=n})),QE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.WorkspaceFoldersFeature=void 0;var t=Ke(),r=n=>class extends n{constructor(){super(),this._notificationIsAutoRegistered=!1}initialize(i){super.initialize(i);let s=i.workspace;s&&s.workspaceFolders&&(this._onDidChangeWorkspaceFolders=new t.Emitter,this.connection.onNotification(t.DidChangeWorkspaceFoldersNotification.type,a=>{this._onDidChangeWorkspaceFolders.fire(a.event)}))}fillServerCapabilities(i){super.fillServerCapabilities(i);const s=i.workspace?.workspaceFolders?.changeNotifications;this._notificationIsAutoRegistered=s===!0||typeof s=="string"}getWorkspaceFolders(){return this.connection.sendRequest(t.WorkspaceFoldersRequest.type)}get onDidChangeWorkspaceFolders(){if(!this._onDidChangeWorkspaceFolders)throw new Error("Client doesn't support sending workspace folder change events.");return!this._notificationIsAutoRegistered&&!this._unregistration&&(this._unregistration=this.connection.client.register(t.DidChangeWorkspaceFoldersNotification.type)),this._onDidChangeWorkspaceFolders.event}};e.WorkspaceFoldersFeature=r})),JE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.CallHierarchyFeature=void 0;var t=Ke(),r=n=>class extends n{get callHierarchy(){return{onPrepare:i=>this.connection.onRequest(t.CallHierarchyPrepareRequest.type,(s,a)=>i(s,a,this.attachWorkDoneProgress(s),void 0)),onIncomingCalls:i=>{const s=t.CallHierarchyIncomingCallsRequest.type;return this.connection.onRequest(s,(a,o)=>i(a,o,this.attachWorkDoneProgress(a),this.attachPartialResultProgress(s,a)))},onOutgoingCalls:i=>{const s=t.CallHierarchyOutgoingCallsRequest.type;return this.connection.onRequest(s,(a,o)=>i(a,o,this.attachWorkDoneProgress(a),this.attachPartialResultProgress(s,a)))}}}};e.CallHierarchyFeature=r})),ZE=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.ShowDocumentFeature=void 0;var t=Ke(),r=n=>class extends n{showDocument(i){return this.connection.sendRequest(t.ShowDocumentRequest.type,i)}};e.ShowDocumentFeature=r})),eA=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.FileOperationsFeature=void 0;var t=Ke(),r=n=>class extends n{onDidCreateFiles(i){return this.connection.onNotification(t.DidCreateFilesNotification.type,s=>{i(s)})}onDidRenameFiles(i){return this.connection.onNotification(t.DidRenameFilesNotification.type,s=>{i(s)})}onDidDeleteFiles(i){return this.connection.onNotification(t.DidDeleteFilesNotification.type,s=>{i(s)})}onWillCreateFiles(i){return this.connection.onRequest(t.WillCreateFilesRequest.type,(s,a)=>i(s,a))}onWillRenameFiles(i){return this.connection.onRequest(t.WillRenameFilesRequest.type,(s,a)=>i(s,a))}onWillDeleteFiles(i){return this.connection.onRequest(t.WillDeleteFilesRequest.type,(s,a)=>i(s,a))}};e.FileOperationsFeature=r})),tA=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.LinkedEditingRangeFeature=void 0;var t=Ke(),r=n=>class extends n{onLinkedEditingRange(i){return this.connection.onRequest(t.LinkedEditingRangeRequest.type,(s,a)=>i(s,a,this.attachWorkDoneProgress(s),void 0))}};e.LinkedEditingRangeFeature=r})),rA=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.TypeHierarchyFeature=void 0;var t=Ke(),r=n=>class extends n{get typeHierarchy(){return{onPrepare:i=>this.connection.onRequest(t.TypeHierarchyPrepareRequest.type,(s,a)=>i(s,a,this.attachWorkDoneProgress(s),void 0)),onSupertypes:i=>{const s=t.TypeHierarchySupertypesRequest.type;return this.connection.onRequest(s,(a,o)=>i(a,o,this.attachWorkDoneProgress(a),this.attachPartialResultProgress(s,a)))},onSubtypes:i=>{const s=t.TypeHierarchySubtypesRequest.type;return this.connection.onRequest(s,(a,o)=>i(a,o,this.attachWorkDoneProgress(a),this.attachPartialResultProgress(s,a)))}}}};e.TypeHierarchyFeature=r})),nA=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.InlineValueFeature=void 0;var t=Ke(),r=n=>class extends n{get inlineValue(){return{refresh:()=>this.connection.sendRequest(t.InlineValueRefreshRequest.type),on:i=>this.connection.onRequest(t.InlineValueRequest.type,(s,a)=>i(s,a,this.attachWorkDoneProgress(s)))}}};e.InlineValueFeature=r})),iA=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.FoldingRangeFeature=void 0;var t=Ke(),r=n=>class extends n{get foldingRange(){return{refresh:()=>this.connection.sendRequest(t.FoldingRangeRefreshRequest.type),on:i=>{const s=t.FoldingRangeRequest.type;return this.connection.onRequest(s,(a,o)=>i(a,o,this.attachWorkDoneProgress(a),this.attachPartialResultProgress(s,a)))}}}};e.FoldingRangeFeature=r})),sA=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.InlayHintFeature=void 0;var t=Ke(),r=n=>class extends n{get inlayHint(){return{refresh:()=>this.connection.sendRequest(t.InlayHintRefreshRequest.type),on:i=>this.connection.onRequest(t.InlayHintRequest.type,(s,a)=>i(s,a,this.attachWorkDoneProgress(s))),resolve:i=>this.connection.onRequest(t.InlayHintResolveRequest.type,(s,a)=>i(s,a))}}};e.InlayHintFeature=r})),aA=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.DiagnosticFeature=void 0;var t=Ke(),r=n=>class extends n{get diagnostics(){return{refresh:()=>this.connection.sendRequest(t.DiagnosticRefreshRequest.type),on:i=>this.connection.onRequest(t.DocumentDiagnosticRequest.type,(s,a)=>i(s,a,this.attachWorkDoneProgress(s),this.attachPartialResultProgress(t.DocumentDiagnosticRequest.partialResult,s))),onWorkspace:i=>this.connection.onRequest(t.WorkspaceDiagnosticRequest.type,(s,a)=>i(s,a,this.attachWorkDoneProgress(s),this.attachPartialResultProgress(t.WorkspaceDiagnosticRequest.partialResult,s)))}}};e.DiagnosticFeature=r})),oA=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.MonikerFeature=void 0;var t=Ke(),r=n=>class extends n{get moniker(){return{on:i=>{const s=t.MonikerRequest.type;return this.connection.onRequest(s,(a,o)=>i(a,o,this.attachWorkDoneProgress(a),this.attachPartialResultProgress(s,a)))}}}};e.MonikerFeature=r})),lA=H((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.createConnection=e.combineFeatures=e.combineNotebooksFeatures=e.combineLanguagesFeatures=e.combineWorkspaceFeatures=e.combineWindowFeatures=e.combineClientFeatures=e.combineTracerFeatures=e.combineTelemetryFeatures=e.combineConsoleFeatures=e._NotebooksImpl=e._LanguagesImpl=e.BulkUnregistration=e.BulkRegistration=e.ErrorMessageTracker=void 0;var t=Ke(),r=xy(),n=qy(),i=YE(),s=XE(),a=QE(),o=JE(),l=Ly(),u=ZE(),c=eA(),d=tA(),f=rA(),h=nA(),m=iA(),R=sA(),S=aA(),v=Fy(),_=oA();function T(w){if(w!==null)return w}var M=class{constructor(){this._messages=Object.create(null)}add(w){let I=this._messages[w];I||(I=0),I++,this._messages[w]=I}sendErrors(w){Object.keys(this._messages).forEach(I=>{w.window.showErrorMessage(I)})}};e.ErrorMessageTracker=M;var F=class{constructor(){}rawAttach(w){this._rawConnection=w}attach(w){this._connection=w}get connection(){if(!this._connection)throw new Error("Remote is not attached to a connection yet.");return this._connection}fillServerCapabilities(w){}initialize(w){}error(w){this.send(t.MessageType.Error,w)}warn(w){this.send(t.MessageType.Warning,w)}info(w){this.send(t.MessageType.Info,w)}log(w){this.send(t.MessageType.Log,w)}debug(w){this.send(t.MessageType.Debug,w)}send(w,I){this._rawConnection&&this._rawConnection.sendNotification(t.LogMessageNotification.type,{type:w,message:I}).catch(()=>{(0,t.RAL)().console.error("Sending log message failed")})}},W=class{constructor(){}attach(w){this._connection=w}get connection(){if(!this._connection)throw new Error("Remote is not attached to a connection yet.");return this._connection}initialize(w){}fillServerCapabilities(w){}showErrorMessage(w,...I){let L={type:t.MessageType.Error,message:w,actions:I};return this.connection.sendRequest(t.ShowMessageRequest.type,L).then(T)}showWarningMessage(w,...I){let L={type:t.MessageType.Warning,message:w,actions:I};return this.connection.sendRequest(t.ShowMessageRequest.type,L).then(T)}showInformationMessage(w,...I){let L={type:t.MessageType.Info,message:w,actions:I};return this.connection.sendRequest(t.ShowMessageRequest.type,L).then(T)}},U=(0,u.ShowDocumentFeature)((0,i.ProgressFeature)(W)),ee;(function(w){function I(){return new se}w.create=I})(ee||(e.BulkRegistration=ee={}));var se=class{constructor(){this._registrations=[],this._registered=new Set}add(w,I){const L=r.string(w)?w:w.method;if(this._registered.has(L))throw new Error(`${L} is already added to this registration`);const Z=n.generateUuid();this._registrations.push({id:Z,method:L,registerOptions:I||{}}),this._registered.add(L)}asRegistrationParams(){return{registrations:this._registrations}}},he;(function(w){function I(){return new x(void 0,[])}w.create=I})(he||(e.BulkUnregistration=he={}));var x=class{constructor(w,I){this._connection=w,this._unregistrations=new Map,I.forEach(L=>{this._unregistrations.set(L.method,L)})}get isAttached(){return!!this._connection}attach(w){this._connection=w}add(w){this._unregistrations.set(w.method,w)}dispose(){let w=[];for(let L of this._unregistrations.values())w.push(L);let I={unregisterations:w};this._connection.sendRequest(t.UnregistrationRequest.type,I).catch(()=>{this._connection.console.info("Bulk unregistration failed.")})}disposeSingle(w){const I=r.string(w)?w:w.method,L=this._unregistrations.get(I);if(!L)return!1;let Z={unregisterations:[L]};return this._connection.sendRequest(t.UnregistrationRequest.type,Z).then(()=>{this._unregistrations.delete(I)},P=>{this._connection.console.info(`Un-registering request handler for ${L.id} failed.`)}),!0}},A=class{attach(w){this._connection=w}get connection(){if(!this._connection)throw new Error("Remote is not attached to a connection yet.");return this._connection}initialize(w){}fillServerCapabilities(w){}register(w,I,L){return w instanceof se?this.registerMany(w):w instanceof x?this.registerSingle1(w,I,L):this.registerSingle2(w,I)}registerSingle1(w,I,L){const Z=r.string(I)?I:I.method,P=n.generateUuid();let tt={registrations:[{id:P,method:Z,registerOptions:L||{}}]};return w.isAttached||w.attach(this.connection),this.connection.sendRequest(t.RegistrationRequest.type,tt).then(Wt=>(w.add({id:P,method:Z}),w),Wt=>(this.connection.console.info(`Registering request handler for ${Z} failed.`),Promise.reject(Wt)))}registerSingle2(w,I){const L=r.string(w)?w:w.method,Z=n.generateUuid();let P={registrations:[{id:Z,method:L,registerOptions:I||{}}]};return this.connection.sendRequest(t.RegistrationRequest.type,P).then(tt=>t.Disposable.create(()=>{this.unregisterSingle(Z,L).catch(()=>{this.connection.console.info(`Un-registering capability with id ${Z} failed.`)})}),tt=>(this.connection.console.info(`Registering request handler for ${L} failed.`),Promise.reject(tt)))}unregisterSingle(w,I){let L={unregisterations:[{id:w,method:I}]};return this.connection.sendRequest(t.UnregistrationRequest.type,L).catch(()=>{this.connection.console.info(`Un-registering request handler for ${w} failed.`)})}registerMany(w){let I=w.asRegistrationParams();return this.connection.sendRequest(t.RegistrationRequest.type,I).then(()=>new x(this._connection,I.registrations.map(L=>({id:L.id,method:L.method}))),L=>(this.connection.console.info("Bulk registration failed."),Promise.reject(L)))}},y=class{constructor(){}attach(w){this._connection=w}get connection(){if(!this._connection)throw new Error("Remote is not attached to a connection yet.");return this._connection}initialize(w){}fillServerCapabilities(w){}applyEdit(w){function I(Z){return Z&&!!Z.edit}let L=I(w)?w:{edit:w};return this.connection.sendRequest(t.ApplyWorkspaceEditRequest.type,L)}},b=(0,c.FileOperationsFeature)((0,a.WorkspaceFoldersFeature)((0,s.ConfigurationFeature)(y))),q=class{constructor(){this._trace=t.Trace.Off}attach(w){this._connection=w}get connection(){if(!this._connection)throw new Error("Remote is not attached to a connection yet.");return this._connection}initialize(w){}fillServerCapabilities(w){}set trace(w){this._trace=w}log(w,I){this._trace!==t.Trace.Off&&this.connection.sendNotification(t.LogTraceNotification.type,{message:w,verbose:this._trace===t.Trace.Verbose?I:void 0}).catch(()=>{})}},O=class{constructor(){}attach(w){this._connection=w}get connection(){if(!this._connection)throw new Error("Remote is not attached to a connection yet.");return this._connection}initialize(w){}fillServerCapabilities(w){}logEvent(w){this.connection.sendNotification(t.TelemetryEventNotification.type,w).catch(()=>{this.connection.console.log("Sending TelemetryEventNotification failed")})}},$=class{constructor(){}attach(w){this._connection=w}get connection(){if(!this._connection)throw new Error("Remote is not attached to a connection yet.");return this._connection}initialize(w){}fillServerCapabilities(w){}attachWorkDoneProgress(w){return(0,i.attachWorkDone)(this.connection,w)}attachPartialResultProgress(w,I){return(0,i.attachPartialResult)(this.connection,I)}};e._LanguagesImpl=$;var k=(0,m.FoldingRangeFeature)((0,_.MonikerFeature)((0,S.DiagnosticFeature)((0,R.InlayHintFeature)((0,h.InlineValueFeature)((0,f.TypeHierarchyFeature)((0,d.LinkedEditingRangeFeature)((0,l.SemanticTokensFeature)((0,o.CallHierarchyFeature)($))))))))),ie=class{constructor(){}attach(w){this._connection=w}get connection(){if(!this._connection)throw new Error("Remote is not attached to a connection yet.");return this._connection}initialize(w){}fillServerCapabilities(w){}attachWorkDoneProgress(w){return(0,i.attachWorkDone)(this.connection,w)}attachPartialResultProgress(w,I){return(0,i.attachPartialResult)(this.connection,I)}};e._NotebooksImpl=ie;var de=(0,v.NotebookSyncFeature)(ie);function Ge(w,I){return function(L){return I(w(L))}}e.combineConsoleFeatures=Ge;function ut(w,I){return function(L){return I(w(L))}}e.combineTelemetryFeatures=ut;function ae(w,I){return function(L){return I(w(L))}}e.combineTracerFeatures=ae;function ze(w,I){return function(L){return I(w(L))}}e.combineClientFeatures=ze;function ye(w,I){return function(L){return I(w(L))}}e.combineWindowFeatures=ye;function Ie(w,I){return function(L){return I(w(L))}}e.combineWorkspaceFeatures=Ie;function ct(w,I){return function(L){return I(w(L))}}e.combineLanguagesFeatures=ct;function ve(w,I){return function(L){return I(w(L))}}e.combineNotebooksFeatures=ve;function Oe(w,I){function L(Z,P,tt){return Z&&P?tt(Z,P):Z||P}return{__brand:"features",console:L(w.console,I.console,Ge),tracer:L(w.tracer,I.tracer,ae),telemetry:L(w.telemetry,I.telemetry,ut),client:L(w.client,I.client,ze),window:L(w.window,I.window,ye),workspace:L(w.workspace,I.workspace,Ie),languages:L(w.languages,I.languages,ct),notebooks:L(w.notebooks,I.notebooks,ve)}}e.combineFeatures=Oe;function et(w,I,L){const Z=L&&L.console?new(L.console(F)):new F,P=w(Z);Z.rawAttach(P);const tt=L&&L.tracer?new(L.tracer(q)):new q,Wt=L&&L.telemetry?new(L.telemetry(O)):new O,Dr=L&&L.client?new(L.client(A)):new A,Or=L&&L.window?new(L.window(U)):new U,Lr=L&&L.workspace?new(L.workspace(b)):new b,Tt=L&&L.languages?new(L.languages(k)):new k,Mr=L&&L.notebooks?new(L.notebooks(de)):new de,pr=[Z,tt,Wt,Dr,Or,Lr,Tt,Mr];function wn(E){return E instanceof Promise?E:r.thenable(E)?new Promise((N,B)=>{E.then(Ye=>N(Ye),Ye=>B(Ye))}):Promise.resolve(E)}let mr,gr,Zt,Mt={listen:()=>P.listen(),sendRequest:(E,...N)=>P.sendRequest(r.string(E)?E:E.method,...N),onRequest:(E,N)=>P.onRequest(E,N),sendNotification:(E,N)=>{const B=r.string(E)?E:E.method;return P.sendNotification(B,N)},onNotification:(E,N)=>P.onNotification(E,N),onProgress:P.onProgress,sendProgress:P.sendProgress,onInitialize:E=>(gr=E,{dispose:()=>{gr=void 0}}),onInitialized:E=>P.onNotification(t.InitializedNotification.type,E),onShutdown:E=>(mr=E,{dispose:()=>{mr=void 0}}),onExit:E=>(Zt=E,{dispose:()=>{Zt=void 0}}),get console(){return Z},get telemetry(){return Wt},get tracer(){return tt},get client(){return Dr},get window(){return Or},get workspace(){return Lr},get languages(){return Tt},get notebooks(){return Mr},onDidChangeConfiguration:E=>P.onNotification(t.DidChangeConfigurationNotification.type,E),onDidChangeWatchedFiles:E=>P.onNotification(t.DidChangeWatchedFilesNotification.type,E),__textDocumentSync:void 0,onDidOpenTextDocument:E=>P.onNotification(t.DidOpenTextDocumentNotification.type,E),onDidChangeTextDocument:E=>P.onNotification(t.DidChangeTextDocumentNotification.type,E),onDidCloseTextDocument:E=>P.onNotification(t.DidCloseTextDocumentNotification.type,E),onWillSaveTextDocument:E=>P.onNotification(t.WillSaveTextDocumentNotification.type,E),onWillSaveTextDocumentWaitUntil:E=>P.onRequest(t.WillSaveTextDocumentWaitUntilRequest.type,E),onDidSaveTextDocument:E=>P.onNotification(t.DidSaveTextDocumentNotification.type,E),sendDiagnostics:E=>P.sendNotification(t.PublishDiagnosticsNotification.type,E),onHover:E=>P.onRequest(t.HoverRequest.type,(N,B)=>E(N,B,(0,i.attachWorkDone)(P,N),void 0)),onCompletion:E=>P.onRequest(t.CompletionRequest.type,(N,B)=>E(N,B,(0,i.attachWorkDone)(P,N),(0,i.attachPartialResult)(P,N))),onCompletionResolve:E=>P.onRequest(t.CompletionResolveRequest.type,E),onSignatureHelp:E=>P.onRequest(t.SignatureHelpRequest.type,(N,B)=>E(N,B,(0,i.attachWorkDone)(P,N),void 0)),onDeclaration:E=>P.onRequest(t.DeclarationRequest.type,(N,B)=>E(N,B,(0,i.attachWorkDone)(P,N),(0,i.attachPartialResult)(P,N))),onDefinition:E=>P.onRequest(t.DefinitionRequest.type,(N,B)=>E(N,B,(0,i.attachWorkDone)(P,N),(0,i.attachPartialResult)(P,N))),onTypeDefinition:E=>P.onRequest(t.TypeDefinitionRequest.type,(N,B)=>E(N,B,(0,i.attachWorkDone)(P,N),(0,i.attachPartialResult)(P,N))),onImplementation:E=>P.onRequest(t.ImplementationRequest.type,(N,B)=>E(N,B,(0,i.attachWorkDone)(P,N),(0,i.attachPartialResult)(P,N))),onReferences:E=>P.onRequest(t.ReferencesRequest.type,(N,B)=>E(N,B,(0,i.attachWorkDone)(P,N),(0,i.attachPartialResult)(P,N))),onDocumentHighlight:E=>P.onRequest(t.DocumentHighlightRequest.type,(N,B)=>E(N,B,(0,i.attachWorkDone)(P,N),(0,i.attachPartialResult)(P,N))),onDocumentSymbol:E=>P.onRequest(t.DocumentSymbolRequest.type,(N,B)=>E(N,B,(0,i.attachWorkDone)(P,N),(0,i.attachPartialResult)(P,N))),onWorkspaceSymbol:E=>P.onRequest(t.WorkspaceSymbolRequest.type,(N,B)=>E(N,B,(0,i.attachWorkDone)(P,N),(0,i.attachPartialResult)(P,N))),onWorkspaceSymbolResolve:E=>P.onRequest(t.WorkspaceSymbolResolveRequest.type,E),onCodeAction:E=>P.onRequest(t.CodeActionRequest.type,(N,B)=>E(N,B,(0,i.attachWorkDone)(P,N),(0,i.attachPartialResult)(P,N))),onCodeActionResolve:E=>P.onRequest(t.CodeActionResolveRequest.type,(N,B)=>E(N,B)),onCodeLens:E=>P.onRequest(t.CodeLensRequest.type,(N,B)=>E(N,B,(0,i.attachWorkDone)(P,N),(0,i.attachPartialResult)(P,N))),onCodeLensResolve:E=>P.onRequest(t.CodeLensResolveRequest.type,(N,B)=>E(N,B)),onDocumentFormatting:E=>P.onRequest(t.DocumentFormattingRequest.type,(N,B)=>E(N,B,(0,i.attachWorkDone)(P,N),void 0)),onDocumentRangeFormatting:E=>P.onRequest(t.DocumentRangeFormattingRequest.type,(N,B)=>E(N,B,(0,i.attachWorkDone)(P,N),void 0)),onDocumentOnTypeFormatting:E=>P.onRequest(t.DocumentOnTypeFormattingRequest.type,(N,B)=>E(N,B)),onRenameRequest:E=>P.onRequest(t.RenameRequest.type,(N,B)=>E(N,B,(0,i.attachWorkDone)(P,N),void 0)),onPrepareRename:E=>P.onRequest(t.PrepareRenameRequest.type,(N,B)=>E(N,B)),onDocumentLinks:E=>P.onRequest(t.DocumentLinkRequest.type,(N,B)=>E(N,B,(0,i.attachWorkDone)(P,N),(0,i.attachPartialResult)(P,N))),onDocumentLinkResolve:E=>P.onRequest(t.DocumentLinkResolveRequest.type,(N,B)=>E(N,B)),onDocumentColor:E=>P.onRequest(t.DocumentColorRequest.type,(N,B)=>E(N,B,(0,i.attachWorkDone)(P,N),(0,i.attachPartialResult)(P,N))),onColorPresentation:E=>P.onRequest(t.ColorPresentationRequest.type,(N,B)=>E(N,B,(0,i.attachWorkDone)(P,N),(0,i.attachPartialResult)(P,N))),onFoldingRanges:E=>P.onRequest(t.FoldingRangeRequest.type,(N,B)=>E(N,B,(0,i.attachWorkDone)(P,N),(0,i.attachPartialResult)(P,N))),onSelectionRanges:E=>P.onRequest(t.SelectionRangeRequest.type,(N,B)=>E(N,B,(0,i.attachWorkDone)(P,N),(0,i.attachPartialResult)(P,N))),onExecuteCommand:E=>P.onRequest(t.ExecuteCommandRequest.type,(N,B)=>E(N,B,(0,i.attachWorkDone)(P,N),void 0)),dispose:()=>P.dispose()};for(let E of pr)E.attach(Mt);return P.onRequest(t.InitializeRequest.type,E=>{I.initialize(E),r.string(E.trace)&&(tt.trace=t.Trace.fromString(E.trace));for(let N of pr)N.initialize(E.capabilities);if(gr)return wn(gr(E,new t.CancellationTokenSource().token,(0,i.attachWorkDone)(P,E),void 0)).then(N=>{if(N instanceof t.ResponseError)return N;let B=N;B||(B={capabilities:{}});let Ye=B.capabilities;Ye||(Ye={},B.capabilities=Ye),Ye.textDocumentSync===void 0||Ye.textDocumentSync===null?Ye.textDocumentSync=r.number(Mt.__textDocumentSync)?Mt.__textDocumentSync:t.TextDocumentSyncKind.None:!r.number(Ye.textDocumentSync)&&!r.number(Ye.textDocumentSync.change)&&(Ye.textDocumentSync.change=r.number(Mt.__textDocumentSync)?Mt.__textDocumentSync:t.TextDocumentSyncKind.None);for(let Yr of pr)Yr.fillServerCapabilities(Ye);return B});{let N={capabilities:{textDocumentSync:t.TextDocumentSyncKind.None}};for(let B of pr)B.fillServerCapabilities(N.capabilities);return N}}),P.onRequest(t.ShutdownRequest.type,()=>{if(I.shutdownReceived=!0,mr)return mr(new t.CancellationTokenSource().token)}),P.onNotification(t.ExitNotification.type,()=>{try{Zt&&Zt()}finally{I.shutdownReceived?I.exit(0):I.exit(1)}}),P.onNotification(t.SetTraceNotification.type,E=>{tt.trace=t.Trace.fromString(E.value)}),Mt}e.createConnection=et})),cp=H((e=>{var t=e&&e.__createBinding||(Object.create?(function(l,u,c,d){d===void 0&&(d=c);var f=Object.getOwnPropertyDescriptor(u,c);(!f||("get"in f?!u.__esModule:f.writable||f.configurable))&&(f={enumerable:!0,get:function(){return u[c]}}),Object.defineProperty(l,d,f)}):(function(l,u,c,d){d===void 0&&(d=c),l[d]=u[c]})),r=e&&e.__exportStar||function(l,u){for(var c in l)c!=="default"&&!Object.prototype.hasOwnProperty.call(u,c)&&t(u,l,c)};Object.defineProperty(e,"__esModule",{value:!0}),e.ProposedFeatures=e.NotebookDocuments=e.TextDocuments=e.SemanticTokensBuilder=void 0;var n=Ly();Object.defineProperty(e,"SemanticTokensBuilder",{enumerable:!0,get:function(){return n.SemanticTokensBuilder}});var i=VE();r(Ke(),e);var s=My();Object.defineProperty(e,"TextDocuments",{enumerable:!0,get:function(){return s.TextDocuments}});var a=Fy();Object.defineProperty(e,"NotebookDocuments",{enumerable:!0,get:function(){return a.NotebookDocuments}}),r(lA(),e);var o;(function(l){l.all={__brand:"features",languages:i.InlineCompletionFeature}})(o||(e.ProposedFeatures=o={}))})),uA=H(((e,t)=>{t.exports=Ke()})),cA=H((e=>{var t=e&&e.__createBinding||(Object.create?(function(o,l,u,c){c===void 0&&(c=u);var d=Object.getOwnPropertyDescriptor(l,u);(!d||("get"in d?!l.__esModule:d.writable||d.configurable))&&(d={enumerable:!0,get:function(){return l[u]}}),Object.defineProperty(o,c,d)}):(function(o,l,u,c){c===void 0&&(c=u),o[c]=l[u]})),r=e&&e.__exportStar||function(o,l){for(var u in o)u!=="default"&&!Object.prototype.hasOwnProperty.call(l,u)&&t(l,o,u)};Object.defineProperty(e,"__esModule",{value:!0}),e.createConnection=void 0;var n=cp();r(uA(),e),r(cp(),e);var i=!1,s={initialize:o=>{},get shutdownReceived(){return i},set shutdownReceived(o){i=o},exit:o=>{}};function a(o,l,u,c){let d,f,h,m;o!==void 0&&o.__brand==="features"&&(d=o,o=l,l=u,u=c),n.ConnectionStrategy.is(o)||n.ConnectionOptions.is(o)?m=o:(f=o,h=l,m=u);const R=S=>(0,n.createProtocolConnection)(f,h,S,m);return(0,n.createConnection)(R,s,d)}e.createConnection=a})),G=cA(),YN={[G.SemanticTokenTypes.class]:0,[G.SemanticTokenTypes.comment]:1,[G.SemanticTokenTypes.enum]:2,[G.SemanticTokenTypes.enumMember]:3,[G.SemanticTokenTypes.event]:4,[G.SemanticTokenTypes.function]:5,[G.SemanticTokenTypes.interface]:6,[G.SemanticTokenTypes.keyword]:7,[G.SemanticTokenTypes.macro]:8,[G.SemanticTokenTypes.method]:9,[G.SemanticTokenTypes.modifier]:10,[G.SemanticTokenTypes.namespace]:11,[G.SemanticTokenTypes.number]:12,[G.SemanticTokenTypes.operator]:13,[G.SemanticTokenTypes.parameter]:14,[G.SemanticTokenTypes.property]:15,[G.SemanticTokenTypes.regexp]:16,[G.SemanticTokenTypes.string]:17,[G.SemanticTokenTypes.struct]:18,[G.SemanticTokenTypes.type]:19,[G.SemanticTokenTypes.typeParameter]:20,[G.SemanticTokenTypes.variable]:21,[G.SemanticTokenTypes.decorator]:22},XN={[G.SemanticTokenModifiers.abstract]:1,[G.SemanticTokenModifiers.async]:2,[G.SemanticTokenModifiers.declaration]:4,[G.SemanticTokenModifiers.defaultLibrary]:8,[G.SemanticTokenModifiers.definition]:16,[G.SemanticTokenModifiers.deprecated]:32,[G.SemanticTokenModifiers.documentation]:64,[G.SemanticTokenModifiers.modification]:128,[G.SemanticTokenModifiers.readonly]:256,[G.SemanticTokenModifiers.static]:512};function dA(e){const t=[],r=[];let n=!0,i=!0,s=!0;for(const a of e)a&&(a.legend.tokenTypes.forEach((o,l)=>{const u=t[l];if(u&&u!==o)throw new Error(`Cannot merge '${u}' and '${o}' token types. They use the same index ${l}.`);t[l]=o}),a.legend.tokenModifiers.forEach((o,l)=>{const u=r[l];if(u&&u!==o)throw new Error(`Cannot merge '${u}' and '${o}' token modifier. They use the same index ${l}.`);r[l]=o}),a.full?typeof a.full=="object"&&!a.full.delta&&(i=!1):n=!1,a.range||(s=!1));return{legend:{tokenTypes:t,tokenModifiers:r},full:n&&{delta:i},range:s}}var dp;(function(e){function t(n,i,s){const a=new Map;Object.entries(i).forEach(([u,c])=>a.set(c,u));let o=0,l=0;return r(n.data,5).map(u=>{o+=u[0],u[0]!==0&&(l=0),l+=u[1];const c=u[2];return{offset:s.textDocument.offsetAt({line:o,character:l}),tokenType:a.get(u[3]),tokenModifiers:u[4],text:s.textDocument.getText({start:{line:o,character:l},end:{line:o,character:l+c}})}})}e.decode=t;function r(n,i){const s=[];for(let a=0;a<n.length;a+=i){const o=n.slice(a,a+i);s.push(o)}return s}})(dp||(dp={}));var QN=Td(gE(),1);yn();var fA=1;function hA(e){const t=e.LanguageMetaData,r=e.shared.workspace.DocumentBuilder;return async(n,i)=>{var s,a;const o=It.parse((s=i?.documentUri)!==null&&s!==void 0?s:`file:///${fA++}${(a=t.fileExtensions[0])!==null&&a!==void 0?a:""}`),l=e.shared.workspace.LangiumDocumentFactory.fromString(n,o,i?.parserOptions);return e.shared.workspace.LangiumDocuments.addDocument(l),await r.build([l],i),l}}var fp,od;function pA(){od||(fp=mE(Fg),od=hA(fp.Sfsql))}function ld(e){if(Array.isArray(e))for(const t of e)ld(t);if(e.$type)delete e.$cstNode,delete e.$container,delete e.$document,delete e.$containerProperty,delete e.$containerIndex,Object.keys(e).forEach(t=>{const r=e[t];typeof r=="boolean"&&!r||Array.isArray(r)&&!r.length?delete e[t]:ld(e[t])});else return}function mA(e,t,r){return e.split(t).join(r||"")}async function gA(e,t={}){pA();const r=await od(e);if(t.checkForErrors&&r.parseResult.parserErrors.length)throw new Error(`${r.parseResult.parserErrors.map(n=>mA(n.message,"``","<blank>")).join("; ")}`);return t.cleanup&&ld(r.parseResult.value),r}function pt(e){return e==null}function yA(e,t){return pt(e)&&pt(t)?!0:pt(e)||pt(t)?!1:e.toString().toLowerCase()===t.toString().toLowerCase()}function vA(e,t=r=>r?r.toString():""){const r=new Set,n=[];return e.forEach(i=>{let s=t(i);s&&(s=s.toString(),r.has(s.toLowerCase())||(r.add(s.toLowerCase()),n.push(i)))}),n}var jy="ap",Uy="chain",Wy="map",By="of",ql="fantasy-land/",JN=ql+By,ZN=ql+Wy,eP=ql+jy,tP=ql+Uy,qs="constructor",ud="prototype",Wn=function(t){return t},xt=function(e){return e},Pr=Wn,of=Pr(function(e){return function(t,r){return arguments.length<2?e(t):e(t)(r)}}),lf=Pr(function(e){return function(t,r){return arguments.length<2?xt(function(n){return e(t,n)},e):e(t,r)}}),Hy=Pr(function(e){return function(t,r,n){switch(arguments.length){case 0:case 1:return $t(2,e(t));case 2:return $t(2,e(t))(r);default:return $t(2,e(t))(r,n)}}}),Ky=Pr(function(e){return function(t,r,n){switch(arguments.length){case 0:case 1:return of(xt(function(i){return e(t,i)},e));case 2:return e(t,r);default:return e(t,r)(n)}}}),Gy=Pr(function(e){return function(t,r,n){switch(arguments.length){case 0:case 1:return lf(xt(function(i,s){return e(t,i,s)},e));case 2:return xt(function(i){return e(t,r,i)},e);default:return e(t,r,n)}}}),TA=Pr(function(e){return function(t,r,n,i){switch(arguments.length){case 0:case 1:return $t(3,e(t));case 2:return $t(3,e(t))(r);case 3:return $t(3,e(t))(r,n);default:return $t(3,e(t))(r,n,i)}}}),RA=Pr(function(e){return function(t,r,n,i){switch(arguments.length){case 0:case 1:return Hy(xt(function(s){return e(t,s)},e));case 2:return $t(2,e(t,r));case 3:return $t(2,e(t,r))(n);default:return $t(2,e(t,r))(n,i)}}}),wA=Pr(function(e){return function(t,r,n,i){switch(arguments.length){case 0:case 1:return Ky(xt(function(s,a){return e(t,s,a)},e));case 2:return of(xt(function(s){return e(t,r,s)},e));case 3:return e(t,r,n);default:return e(t,r,n)(i)}}}),CA=Pr(function(e){return function(t,r,n,i){switch(arguments.length){case 0:case 1:return Gy(xt(function(s,a,o){return e(t,s,a,o)},e));case 2:return lf(xt(function(s,a){return e(t,r,s,a)},e));case 3:return xt(function(s){return e(t,r,n,s)},e);default:return e(t,r,n,i)}}}),_A=function(t){return t.length===0?t:xt(function(){return t()},t)},hp=function(t){return t.length===1?t:xt(function(r){return t(r)},t)},zy=[[_A],[hp,hp],[void 0,of,lf],[void 0,Hy,Ky,Gy],[void 0,TA,RA,wA,CA]],$t=function(t,r){return zy[t][Math.min(t,r.length)](r)},uf=function(t,r){return zy[t][t](r)},ke=function(t){return uf(t.length,t)},cf=Object.create,ul=Object.assign,df=function(t){return ul({},t)},jl=function(t){return function(r){return t}},Tu=function(t,r){return t(r)},ff=function(t,r){return r},hf=function(t){return t&&Object.freeze(t)},pf=Wn,mf=hf({}),SA=function(t){return t!==void 0},bA=Object[ud].hasOwnProperty,Vy=function(t,r){return bA.call(r,t)},gf=function(t){return t==null?t:Object.getPrototypeOf(t)},kA=function(t){return t==null?t:(Vy(qs,t)?gf(t):t)[qs]},Bn=function(t){return typeof t=="function"},Kr=function(t){return typeof t=="string"},yf=function(t){return typeof t=="number"},Hn=Array.isArray,$A=gf({}),vf=function(t){return t!=null&&typeof t=="object"&&(Vy(qs,t)?gf(t)===$A:t[qs]===Object)},Tf=function(t,r){return r instanceof t},EA=function(t,r){var n=t.length;return n===1?function(i){return r(t(i))}:uf(n,function(){return r(t.apply(void 0,arguments))})},Yy=function(t,r){return t===r&&(t!==0||1/t===1/r)||t!==t&&r!==r},AA=function(t,r,n){var i={};if(n instanceof Object){vf(n)||(n=df(n));for(var s in n)s!==t?i[s]=n[s]:(i[t]=r,t=void 0)}return SA(t)&&(i[t]=r),i},IA=function(t,r){var n=void 0;if(r instanceof Object){vf(r)||(r=df(r));for(var i in r)i!==t?(n||(n={}),n[i]=r[i]):t=void 0}return n},Xy=function(t,r,n,i){return ul(t[ud]=cf(r[ud]),n)[qs]=ul(t,i)};function cl(e){if(!Tf(cl,this))return pf(new cl(e));this[Wy]=e}var cd=Xy(function e(t,r,n){if(!Tf(e,this))return pf(new e(t,r,n));cl.call(this,t),this[By]=r,this[jy]=n},cl),NA=Xy(function e(t,r,n,i){if(!Tf(e,this))return pf(new e(t,r,n,i));cd.call(this,t,r,n),this[Uy]=i},cd),oa=NA(Tu,Wn,Tu,Tu),ft="length",PA=hf((function(t){return ul(cf(null),t)})(mf)),Ut=function(t){return t},DA=function(e){return e},Qy=function(e){return e},Ru=function(t){return function(r){return[r,t]}},dd=Ut(function(e,t,r){for(var n=t[ft],i=Array(n),s=0,a=!0,o=0;o<n;++o){var l=t[o],u=e(l,o);r!==u&&(i[s++]=u,a&&(a=l===u&&(l!==0||1/l===1/u)||l!==l&&u!==u))}return s!==n?(i[ft]=s,i):a?t:i}),OA=Ut(function(e,t,r,n,i){for(;n<i;)e[t++]=r[n++];return e});function Jy(e,t){for(var r=0,n=t[ft];r<n;++r){var i=e(t[r],r);if(i!==void 0)return i}}var LA=function(t,r){return cd(ff,jl(r),t)},MA=function(t,r,n,i){return Et(n)(i,void 0,t,r)},fd=function(t){return function(r){return function(n){return t!==n?[n,r]:r}}},FA=function(t,r){for(;fd!==t;)r.push(t[0]),t=t[1];return r},xA=Ut(function(e){return FA(e,[]).reverse()});function hd(e,t,r,n){var i=e.map,s=e.ap,a=e.of(fd),o=r[ft];if(i===ff){for(var l=0;l<o;++l)a=s(a,t(r[l],l));return a}else{for(var u=fd(n),c=0;c<o;++c)a=s(i(u,a),t(r[c],c));return i(xA,a)}}var Zy=function(t,r){return function(n){return function(i,s,a,o){return a.map(function(l){return r(n,l,i)},o(t(n,i),n))}}},js=function(t,r){return r instanceof Object?r[t]:void 0},Rf=Ut(function(e,t,r){return t!==void 0?AA(e,t,r):IA(e,r)||mf}),qA=Zy(js,Rf),Us=function(t,r){return Ul(r)?r[t]:void 0},wf=Ut(function(e,t,r){Ul(r)||(r="");var n=r[ft];if(t!==void 0){for(var i=Math.max(e+1,n),s=Array(i),a=0;a<i;++a)s[a]=r[a];return s[e]=t,s}else{if(n<=e)return OA(Array(n),0,r,0,n);for(var o=Array(n-1),l=0;l<e;++l)o[l]=r[l];for(var u=e+1;u<n;++u)o[u-1]=r[u];return o}}),jA=Zy(Us,wf),UA=function(t,r){return function(n,i){return i=r(n,i),function(s,a){return t(s,a,n,i)}}};function Cf(e,t){var r=t[ft]-e;if(r<2)return r?Et(t[e]):ev;for(var n=Et(t[e+--r]),i=function(o,l){return function(u,c){return n(u,c,o,l)}};--r;)i=UA(Et(t[e+r]),i);var s=Et(t[e]);return function(a,o,l,u){return s(a,o,l,i(l,u))}}var WA=Ut(function(t,r,n){switch(typeof t){case"string":return Rf(t,r(js(t,n),t),n);case"number":return wf(t,r(Us(t,n),t),n);case"object":return HA(t,r,n);default:return t[ft]===4?t(n,void 0,oa,r):(r(t(n,void 0),void 0),n)}}),BA=Ut(function(t,r,n){switch(typeof r){case"string":return t(js(r,n),r);case"number":return t(Us(r,n),r);case"object":for(var i=r[ft],s=0,a;s<i;++s)switch(typeof(a=r[s])){case"string":n=js(a,n);break;case"number":n=Us(a,n);break;default:return Cf(s,r)(n,r[s-1],Kn,t)}return t(n,r[i-1]);default:return t!==Ut&&r[ft]!==4?t(r(n,void 0),void 0):r(n,void 0,Kn,t)}});function HA(e,t,r,n){for(var i=e[ft],s=Array(i),a=0,o;a<i;++a)switch(s[a]=r,typeof(o=e[a])){case"string":r=js(o,r);break;case"number":r=Us(o,r);break;default:r=Cf(a,e)(r,e[a-1],oa,t||jl(n)),i=a;break}i===e[ft]&&(r=t?t(r,e[i-1]):n);for(var l;0<=--i;)r=Kr(l=e[i])?Rf(l,r,s[i]):wf(l,r,s[i]);return r}var KA=function(t){return kA(t)!==Object?df(t):t},ev=function(t,r,n,i){return i(t,r)},GA=Ut(function(e){return function(t){for(var r={},n=e[ft];n--;){var i=t[0];i!==void 0&&(r[e[n]]=i),t=t[1]}return r}}),zA=Ut(function(e,t,r,n,i,s){var a=void 0,o=!0,l={};for(var u in t){a=1;var c=r[u],d=t[u](c,u,i,s);d!==void 0?(l[u]=d,o&&(o=c===d&&(c!==0||1/c===1/d)||c!==c&&d!==d)):o=!1}var f=a;for(var h in r)if((f&&t[h])===void 0){a=1;var m=r[h],R=e(m,h,i,s);R!==void 0?(l[h]=R,o&&(o=m===R&&(m!==0||1/m===1/R)||m!==m&&R!==R)):o=!1}return a?o&&r===n?n:l:n}),tv=function(t,r){return function(n,i,s,a){var o=n instanceof Object?KA(n):mf;if(oa===s)return zA(t,r,o,n,s,a);if(Kn===s){for(var l in r){var u=r[l](o[l],l,s,a);if(u!==void 0)return u}for(var c in o)if(r[c]===void 0){var d=t(o[c],c,s,a);if(d!==void 0)return d}}else{var f=s.map,h=s.ap,m=s.of,R=m(Ru),S=[];for(var v in r)S.push(v),R=h(f(Ru,R),r[v](o[v],v,s,a));var _=S[ft]?!0:void 0;for(var T in o)(_&&r[T])===void 0&&(S.push(T),R=h(f(Ru,R),t(o[T],T,s,a)));return S[ft]?f(GA(S),R):m(n)}}};function rv(e,t){var r=cf(null);for(var n in t){var i=t[n];r[n]=vf(i)?rv(e,i):Et(i)}return tv(e,r)}var VA=function(t){return Qy(function(r,n,i,s){return i.map(jl(r),s(t(r,n),n))},t)},YA=function(t,r){return function(i){return function(a,o,l,u){return(i(a,o)?t:r)(a,o,l,u)}}},XA=function(t,r,n,i){return n.of(t)},QA=function(t,r,n,i){return n===oa?dd(i,t,void 0):n===Kn?Jy(i,t):hd(n,i,t,void 0)},Ul=function(t){return t instanceof Object&&(t=t[ft],t===t>>0&&0<=t)||Kr(t)},Kn=LA(function(e,t){return e!==void 0?e:t}),Et=Ut(function(t){switch(typeof t){case"string":return qA(t);case"number":return jA(t);case"object":return Cf(0,t);default:return t[ft]===4?t:VA(t)}}),_f=ke(WA),pp=ke(MA);function JA(e){var t=function(i,s,a,o){return(t=Et(e(r)))(i,s,a,o)};function r(n,i,s,a){return t(n,i,s,a)}return r}var ZA=function(t){return Qy(function(r,n,i,s){return Et(t(r,n))(r,n,i,s)},t)},eI=ke(function(t,r,n){return YA(Et(r),Et(n))(t)}),tI=Ut($t(2,function(t){return t=Et(t),function(n){return rv(t,n)}}));function ei(e,t,r,n){return Ul(e)?QA(e,t,r,n):r.of(e)}var wu=function(t,r,n,i){return Ul(t)?n===oa?dd(i,t,dd):n===Kn?Jy(i,t):hd(n,i,t,hd):n.of(t)},nv=DA(tv(ev,PA),"values"),iv=ke(function(t,r,n){return!!BA(function(i,s){if(t(i,s))return!0},r,n)}),Wl=function(t){return function(r,n,i,s){return i.map(function(a){return a!==void 0?t(a,n):a},s(r,n))}},rI=function(t){return function(n,i,s,a){return s.of(t(n,i))}},Yt=function(t){return t.length},nI=ke(function(e,t){return e<=t}),iI=ke(function(e,t){return e>=t}),pd=ke(Yy),sv=ke(function(e,t){return t instanceof e}),sI=sv(Object),dn=ke(function(e,t){return function(r){return e(t(r))}}),aI=ke(function(e,t){return function(r){return e(r)&&t(r)}}),Bl=function(e){return e};function av(e){this.value=e!==void 0?e:null}var fr=sv(av),Tn=Wn(function(e){return new av(e)}),la=function(t){return t.value},ov=function(t){return fr(t)?la(t):void 0},oI=function(t){return fr(t)?la(t):null},Sf=function(t,r){return function(n){return iv(fr,t,n)?Tn(_f(t,r,n)):n}},lv=Wl(Sf(ei,oI)),lI=Wl(Sf(ei,ov)),uI=Wl(Sf(nv,ov));function bf(e){var t=Error(JSON.stringify(e,null,2));return t.errors=e,t}function uv(e){throw bf(e)}var cI=function(t){return fr(t)?uv(bf(la(t))):t},kf=function(t,r,n){return Bl(function(){var i=arguments.length,s=t;if(i)for(s=r(arguments[--i],s);i;)s=n(arguments[--i],s);return s},n)},nt=function(t){if(Bn(t))return Yt(t)<3?hI(t):t;var r=t[1];return Bn(r)?hv(r,t[0]):pI(r,t[0])},dI=_f(ei,nt),Hl=function(t,r){return eI(t,cv(r),fn)},cv=dn(Et,dI),dv=function(t){var r=t.less,n=t.rest;return n=nt(n),function(){for(var s=arguments.length,a=Array(s),o=0;o<s;++o)a[o]=nt(arguments[o]);return Hl(r?Hn:aI(Hn,dn(nI(s),Yt)),[lv,r?function(l,u,c,d){var f=Yt(l);return f<s?(l=l.slice(),l.length=s,c.map(function(h){return iv(fr,ei,h)?h:h.slice(0,f)},wu(l,u,c,d))):wu(l,u,c,d)}:wu,ZA(function(l,u){return a[u]||n})])}},Gn={},rn=Gn;function $f(e,t){var r=rn;return r===Gn?r=t:rn=Gn,e.of(Tn(r))}var Kl=function(t,r){return function(n,i){try{return t(n,i)}catch(s){return rn=s,r}}},Gl=XA,fI=function(t){return function(r,n,i,s){return i.chain(function(a){return s(a,n)},t(r,n))}},fn=rI(Tn),fv=function(t){return $t(2,Bl(function(r){return r=nt(r),function(n){return n=nt(n),t(r,n)}},t))},hI=function(t){return t=Kl(t),function(r,n,i,s){return i.chain(function(a){return a?i.of(r):$f(i,r)},t(r,n))}},hv=ke(function(t,r){return r=nt(r),function(i,s,a,o){return a.chain(function(l){return fr(l)?a.map(Tn,t(i,la(l),s)):a.of(l)},r(i,s,a,o))}}),pI=ke(function(t,r){return cv([Wl(function(n){return fr(n)?Tn(t):n}),r])}),mI=$t(2,function(t){return dn(pv(t),fI)}),pv=fv(function(t,r){return function(i,s,a,o){return a.chain(function(l){return fr(l)?a.of(l):r(l,s,a,o)},t(i,s,a,o))}}),mv=kf(Gl,nt,pv),gI=fv(function(t,r){return function(i,s,a,o){return a.chain(function(l){return fr(l)?r(i,s,a,o):a.of(l)},t(i,s,a,o))}}),Ef=kf(fn,nt,gI),yI=function(t){return Hl(Hn,[lI,ei,t])},ua=function(t){return Hl(Hn,[lv,ei,t])},vI=dv({less:!0,rest:Gl}),ca=dv({less:!1,rest:fn}),TI=ke(function(t,r){return t=nt(t),function(n,i,s,a){return s.of(Bn(n)?Bl(function(){for(var o=arguments.length,l=Array(o),u=0;u<o;u++)l[u]=arguments[u];return s.chain(function(c){return fr(c)?uv(bf(la(c))):s.chain(function(d){return s.map(cI,pp(s,Wn,nt(r.apply(null,c)),d))},n.apply(null,c))},pp(s,Wn,t,l))},n):Tn(n))}}),Rn=ke(function(t,r){return TI(t,jl(r))}),gv=ke(function(t,r){return Hl(sI,[uI,tI(nt(t),_f(nv,nt,r))])}),RI=gv(fn),yv=function(t){return t=Kl(t),Bl(function(r,n,i,s){var a=t(r,n);return a?nt(a)(r,n,i,s):$f(i,r)},t)},wI=kf(fn,function(e,t){return Yt(e)===1?e[0]:mp(e[0],e[1],t)},function(t,r){return mp(t[0],t[1],r)}),mp=ke(function(t,r,n){return t=Kl(t),r=nt(r),n=nt(n),function(s,a,o,l){var u=t(s,a);return u?r(s,a,o,l):u!==void 0||rn===Gn?n(s,a,o,l):$f(o,s)}});function CI(e){e=Et(e);var t=arguments.length-1;if(!t)return fn;var r=arguments[t];r.length===1?(--t,r=nt(r[0])):r=fn;for(var n=Array(t),i=Array(t+1),s=0;s<t;++s){var a=arguments[s+1];n[s]=Kl(a[0]),i[s]=nt(a[1])}return i[t]=r,function(l,u,c,d){var f=t,h=e(l,u,Kn,function(m,R){for(var S=0;S<f;++S){var v=n[S](m,R);if(v){if(f=S,S===0)return 0;break}else if(v===void 0&&rn!==Gn){var _=rn;return rn=Gn,c.of(Tn(_))}}});return h||i[f](l,u,c,d)}}var vv=dn(JA,dn(nt)),Tv=[Bn,function(e){return"Expected function, but got "+e}],_I=function(t){return mv(Tv,[dn(iI(t),Yt),function(r){return"Expected function of max arity "+t+", but got arity "+Yt(r)}])},SI=function(t){return mv(Tv,[dn(pd(t),Yt),function(r){return"Expected function of arity "+t+", but got arity "+Yt(r)}])},Rv=_I(2),bI=SI(4),qe=vv(function(e){return Ef(Rv,bI,ca(e,Gl))}),kI=function(t,r){return hv(function(n,i){return[t,i]},r)},da=function(t,r){return kI("partial.lenses.validation: `"+t+"` given invalid arguments",r)},fa=function(t,r,n){return yv(function(i){return mI(Rn(da(t,ca.apply(null,r)),n),function(s){return uf(Yt(i),s)})})},$I=function(t,r,n){return yv(function(i){return ua(CI.apply(null,[ff].concat(t.map(function(s,a){return[pd(a),s]}),n.map(function(s,a){return[pd(Yt(i)-Yt(n)+a),s]}),[[r]])))})},EI=ca(qe),wv=ca(Rv,qe),AI=Ef(EI,wv),hr=function(e){return e},Wa=hr(Gl,qe),md=hr(Ef,Rn(da("or",ua(qe)),qe)),gp=hr(yI,fa("arrayId",[qe],qe)),II=hr(ua,fa("arrayIx",[qe],qe)),NI=hr(vI,Rn(da("args",ua(qe)),qe)),Cv=hr(ca,Rn(da("tuple",ua(qe)),qe)),PI=hr(Rn,fa("freeFn",[qe,qe],qe)),ui=hr(RI,fa("props",[gv(qe,{})],qe)),DI=hr(wI,Rn(da("cases",$I([],wv,[AI])),qe)),OI=hr(vv,fa("lazy",[Rn(Cv(qe),qe)],qe)),Ws=function(t){return t.length},LI=ke(function(e,t,r){return r.reduceRight(e,t)}),MI=ke(function(e,t){return t.repeat(e)}),ci=ke(Yy),FI=ke(function(e,t){return Kr(t)&&e.test(t)}),ti=function(t,r){return PI(NI.apply(null,t),r)},_v=function(t){return Cv(t,t)},xI=function(t){return Kr(t)?t:MI(t," ")},gd=function(t){return{c:0,v:t}},Sv=function(t){return{c:1,v:t}};function zl(e){if(e.c!==0)return e.v;var t=e.v;return e.v=void 0,e.c=1,e.v=t()}var bv=function(t,r){return{c:3,p:t,d:r}},Af=function(t,r){return{c:5,w:t,n:r}},qI=function(t){return{c:6,f:t}},kv=function(t){return typeof t=="object"?Hn(t)?2:t.c:4};function en(e){switch(kv(e)){case 0:return gd(function(){return en(zl(e))});case 1:return en(e.v);case 2:return(function t(r){switch(Ws(e)-r){case 0:return"";case 1:return en(e[r]);default:return[en(e[r]),gd(function(){return t(r+1)})]}})(0);case 3:return bv(e.p,en(e.d));case 4:switch(e){case`
`:return" ";case"\r":return"";default:return e}case 5:return e.w;default:return qI(EA(e.f,en))}}var jI=[0],UI=function(t,r){return[1,t,r]},WI=function(t,r){return[2,t,r]};function BI(e,t,r){for(var n=e.text,i=e.line;;)switch(r=zl(r),r[0]){case 0:return t;case 1:t=n(i(t),r[1]),r=r[2];break;default:t=n(t,r[1]),r=r[2];break}}function HI(e,t,r){for(;;){if(e<t)return!1;if(r=zl(r),r[0]<2)return!0;t+=Ws(r[1]),r=r[2]}}var yp=function(t,r,n){return gd(function(){return rr(t,r,n)})};function rr(e,t,r){if(r===void 0)return jI;var n=r[0],i=r[1],s=r[2];switch(kv(i)){case 0:return rr(e,t,[n,zl(i),s]);case 1:return rr(e,t,[n,i.v,s]);case 2:return rr(e,t,LI(function(o,l){return[n,l,o]},s,i));case 3:return rr(e,t,[n+xI(i.p),i.d,s]);case 4:switch(i){case`
`:case"\r":return UI(n,yp(e,Ws(n),s));case"":return rr(e,t,s);default:return WI(i,yp(e,t+Ws(i),s))}case 5:var a=rr(e,t,[n,i.w,s]);return!e||HI(e,t,Sv(a))?a:rr(e,t,[n,i.n,s]);default:return rr(e,t,[n,i.f(t,n),s])}}var $v=`
`,Ev="\r",KI=Af(" ",$v),GI=Af("",Ev),zI=ke(function(t,r){var n=[],i=Ws(r);i&&n.push(r[0]);for(var s=1;s<i;++s)n.push(t,r[s]);return n}),VI=function(t,r){return hf([t,r])},YI=VI("(",")"),XI=ke(function(t,r){return[t[0],r,t[1]]}),Av=ke(function(t,r){return Af(en(t),r)}),QI=function(t){return Av(t,t)},JI=ke(bv),ZI=ke(function(t,r,n,i){return BI(t,r,Sv(rr(n,0,["",i,void 0])))}),eN=ZI({line:function(t){return t+`
`},text:function(t,r){return t+r}},""),Ze=OI(function(e){return DI([Kr,FI(/^([\n\r]|[^\n\r]*)$/)],[Hn,II(e)],[md(ui({c:ci(0),v:Bn}),ui({c:ci(1),v:Wa}),ui({c:ci(3),p:md(Kr,yf),d:Wa}),ui({c:ci(5),w:Wa,n:Wa}),ui({c:ci(6),f:Bn}))])}),Jt=function(e){return e},Cu=Jt(eN,ti([yf,Ze],Kr)),tN=Jt($v,Ze),rN=Jt(Ev,Ze),nN=Jt(KI,Ze),iN=Jt(GI,Ze),sN=Jt(zI,ti([Ze,gp(Ze)],gp(Ze))),aN=Jt(XI,ti([_v(Ze),Ze],Ze)),oN=Jt(YI,_v(Ze)),tr=Jt(Av,ti([Ze,Ze],Ze)),lN=Jt(QI,ti([Ze],Ze)),uN=Jt(JI,ti([md(Kr,yf),Ze],Ze)),rP=dl({SfsqlFormatter:()=>If,formatSfsql:()=>fN});function ha(e){return(Array.isArray(e)?e:[e]).filter(t=>t!==""&&!pt(t)&&(!Array.isArray(t)||t.length>0))}function Y(e){return lN(ha(e))}function ge(e,t){return sN(e,ha(t))}function X(e){return ge(" ",ha(e))}function vr(e){return ge(Y([",",ne]),ha(e))}function Be(e){return uN(2,ha(e))}function Ba(e){return aN(oN,e)}var ne=tN,He=rN,Ha=nN,$e=iN,cN=[],dN=new Set(["ML_COMMENT","SL_COMMENT"]),If=class{constructor(e){this.opt=e}kw(e){return pt(e)?"":this.opt.uppercase?e.toUpperCase():e.toLowerCase()}buildCommentMap(e){var t,r,n,i;const s=new WeakMap,a=new WeakMap,o=(t=e.$cstNode)===null||t===void 0?void 0:t.root;if(!o)return s;for(const l of Eu(o)){if(!l.hidden||!l.tokenType||!dN.has(l.tokenType.name))continue;const u=iS(l,!1),c=am(l,!1);let d=(n=(r=u?.astNode)!==null&&r!==void 0?r:c?.astNode)!==null&&n!==void 0?n:e;for(;d.$container&&!aE(d);)d=d.$container;const f=(i=s.get(d))!==null&&i!==void 0?i:{leading:[],trailing:[],betweenSelectAndFrom:[],betweenFromWhere:[],betweenWhereGroupBy:[],betweenGroupByHaving:[],betweenHavingOrderBy:[],betweenOrderByLimitOffset:[],betweenLimitOffset:[]},h=d.$cstNode,m=c?.text,R={text:l.text,prefix:m===","?",":void 0};if(rd(d)){const S=d;let v=a.get(S);if(!v){v={};const F=S.$cstNode;if(F)for(const W of Eu(F)){if(W.hidden)continue;const U=W.text.toLowerCase();U==="select"&&v.select==null?v.select=W.offset:U==="from"&&v.from==null?v.from=W.offset:U==="where"&&v.where==null?v.where=W.offset:U==="group"&&v.group==null?v.group=W.offset:U==="having"&&v.having==null?v.having=W.offset:U==="order"&&v.order==null?v.order=W.offset:U==="limit"&&v.limit==null?v.limit=W.offset:U==="offset"&&v.offset==null&&(v.offset=W.offset)}a.set(S,v)}const _=[];v.select!=null&&_.push({key:"select",offset:v.select}),v.from!=null&&_.push({key:"from",offset:v.from}),v.where!=null&&_.push({key:"where",offset:v.where}),v.group!=null&&_.push({key:"group",offset:v.group}),v.having!=null&&_.push({key:"having",offset:v.having}),v.order!=null&&_.push({key:"order",offset:v.order}),v.limit!=null&&_.push({key:"limit",offset:v.limit}),v.offset!=null&&_.push({key:"offset",offset:v.offset});const T={"select->from":F=>f.betweenSelectAndFrom.push(F),"from->where":F=>f.betweenFromWhere.push(F),"from->group":F=>f.betweenFromWhere.push(F),"from->having":F=>f.betweenFromWhere.push(F),"from->order":F=>f.betweenFromWhere.push(F),"from->limit":F=>f.betweenFromWhere.push(F),"from->offset":F=>f.betweenFromWhere.push(F),"where->group":F=>f.betweenWhereGroupBy.push(F),"where->having":F=>f.betweenWhereGroupBy.push(F),"where->order":F=>f.betweenWhereGroupBy.push(F),"where->limit":F=>f.betweenWhereGroupBy.push(F),"where->offset":F=>f.betweenWhereGroupBy.push(F),"group->having":F=>f.betweenGroupByHaving.push(F),"group->order":F=>f.betweenGroupByHaving.push(F),"group->limit":F=>f.betweenGroupByHaving.push(F),"group->offset":F=>f.betweenGroupByHaving.push(F),"having->order":F=>f.betweenHavingOrderBy.push(F),"having->limit":F=>f.betweenHavingOrderBy.push(F),"having->offset":F=>f.betweenHavingOrderBy.push(F),"order->limit":F=>f.betweenOrderByLimitOffset.push(F),"order->offset":F=>f.betweenOrderByLimitOffset.push(F),"limit->offset":F=>f.betweenLimitOffset.push(F)};let M=!1;for(let F=0;F<_.length-1;F++){const W=_[F],U=_[F+1];if(l.offset>W.offset&&l.offset<U.offset){const ee=`${W.key}->${U.key}`;if(T[ee]){T[ee](R),M=!0;break}}}if(M){s.set(d,f);continue}}!u&&c||h&&l.offset>=h.end?f.trailing.push(R):f.leading.push(R),s.set(d,f)}return s}renderCommentEntries(e){if(e.length===0)return"";const t=[];return e.forEach((r,n)=>{var i;const s=(i=r.prefix)!==null&&i!==void 0?i:"";t.push(s+r.text),n<e.length-1&&t.push(ne)}),t}withComments(e,t){var r,n;if(!this.commentMap||!this.emittedComments)return t;const i=this.commentMap.get(e);if(!i||i.leading.length===0&&i.trailing.length===0&&i.betweenSelectAndFrom.length===0&&i.betweenFromWhere.length===0&&i.betweenWhereGroupBy.length===0&&i.betweenGroupByHaving.length===0&&i.betweenHavingOrderBy.length===0&&i.betweenOrderByLimitOffset.length===0&&i.betweenLimitOffset.length===0||this.emittedComments.has(e))return t;this.emittedComments.add(e);const s=[];for(const a of i.leading){const o=(r=a.prefix)!==null&&r!==void 0?r:"";s.push(o+a.text,ne)}if(s.push(t),i.trailing.length>0){s.push(ne);for(const a of i.trailing){const o=(n=a.prefix)!==null&&n!==void 0?n:"";s.push(o+a.text,ne)}}return s}isParenExpr(e){return!!e.paren}shouldForceTopLevelAndBreak(e){return qr(e)?this.collectAndTerms(e).some(t=>t.paren||In(t)):!1}flatLength(e){return Cu(1e4,Y(e)).replace(/\n/g,"").length}collectAndTerms(e){return qr(e)?[...this.collectAndTerms(e.left),...this.collectAndTerms(e.right)]:[e]}shouldForcePolyFieldBreak(e){const t=this.opt.printWidth;return!pt(t)&&t>150?!1:!pt(t)&&t<=50&&e.some(r=>An(r))?!0:e.some(r=>{var n,i;if(!An(r))return!1;const s=r.objects.some(o=>{var l;return(((l=o.fields)===null||l===void 0?void 0:l.length)||0)>3}),a=(((i=(n=r.else)===null||n===void 0?void 0:n.fields)===null||i===void 0?void 0:i.length)||0)>3;return s||a})}formatSelectFields(e){const t=this.opt.childQueriesInNewLine?e.some(i=>ms(i)):!1;if(this.opt.fieldsInNewLine){const i=this.format(e);return{doc:Be([ne,ge([",",ne],i)]),forceBreak:!0}}const r=this.shouldForcePolyFieldBreak(e)||t,n=this.format(e);if(r){const i=[];for(let s=0;s<n.length;s++){if(s>0){const a=e[s-1],o=e[s],l=An(a)||An(o)||ms(a)||ms(o);i.push(l?[",",He]:", ")}i.push(n[s])}return{doc:Be(i),forceBreak:r}}return{doc:Be(Y(ge(Y([",",ne]),n))),forceBreak:r}}selectFields(e){return this.formatSelectFields(e.fields)}selectClause(e){const{doc:t,forceBreak:r}=this.selectFields(e),n=X([this.kw("select"),t]);return r?n:Y(n)}soqlStmtItems(e){var t,r,n,i,s,a,o,l;const u=(t=this.commentMap)===null||t===void 0?void 0:t.get(e),c=(r=u?.betweenSelectAndFrom)!==null&&r!==void 0?r:[],d=(n=u?.betweenFromWhere)!==null&&n!==void 0?n:[],f=(i=u?.betweenWhereGroupBy)!==null&&i!==void 0?i:[],h=(s=u?.betweenGroupByHaving)!==null&&s!==void 0?s:[],m=(a=u?.betweenHavingOrderBy)!==null&&a!==void 0?a:[],R=(o=u?.betweenOrderByLimitOffset)!==null&&o!==void 0?o:[],S=(l=u?.betweenLimitOffset)!==null&&l!==void 0?l:[],v=c.length>0,_=d.length>0,T=f.length>0,M=h.length>0,F=m.length>0,W=R.length>0,U=S.length>0&&e.limit!=null&&e.offset!=null,ee=c.some(ze=>ze.prefix===","),se=ee?[this.selectClause(e),","]:this.selectClause(e),he=ee?c.map(ze=>({text:ze.text})):c,x=v?this.renderCommentEntries(he):"",A=_?this.renderCommentEntries(d):"",y=T?this.renderCommentEntries(f):"",b=M?this.renderCommentEntries(h):"",q=F?this.renderCommentEntries(m):"",O=W?this.renderCommentEntries(R):"",$=U?this.renderCommentEntries(S):"",k=e.limit!=null&&typeof e.limit=="number"?e.limit:null,ie=e.offset!=null&&typeof e.offset=="number"?e.offset:null,de=k!=null?Y([$e,X([this.kw("limit"),k+""])]):"",Ge=ie!=null?Y([$e,X([this.kw("offset"),ie+""])]):"",ut=U?"":this.limitOffset(e.limit,e.offset),ae=[se];return v&&ae.push(x),ae.push(this.format(e.includeFields)),ae.push(Y(this.fromClause(e))),_&&ae.push(A),ae.push(this.format(e.where)),e.withs&&e.withs.length>0&&ae.push(ge(ne,this.format(e.withs))),T&&ae.push(y),ae.push(this.format(e.groupBy)),M&&ae.push(b),ae.push(this.format(e.having)),F&&ae.push(q),ae.push(this.format(e.orderBy)),W&&ae.push(O),U?ae.push(de,$,Ge):ae.push(ut),ae.push(pt(e.for)?"":Y([$e,X([this.kw("for"),this.kw(e.for)])]),e.update?Y([$e,X([this.kw("update"),this.kw(e.update)])]):"",e.allRows?Y([$e,X([this.kw("include"),this.kw("deleted")])]):""),ae.filter(ze=>ze!=="")}soqlStmt(e){var t,r,n,i,s,a,o,l;const u=this.soqlStmtItems(e),c=(t=this.commentMap)===null||t===void 0?void 0:t.get(e);return((r=c?.betweenSelectAndFrom.length)!==null&&r!==void 0?r:0)>0||((n=c?.betweenFromWhere.length)!==null&&n!==void 0?n:0)>0||((i=c?.betweenWhereGroupBy.length)!==null&&i!==void 0?i:0)>0||((s=c?.betweenGroupByHaving.length)!==null&&s!==void 0?s:0)>0||((a=c?.betweenHavingOrderBy.length)!==null&&a!==void 0?a:0)>0||((o=c?.betweenOrderByLimitOffset.length)!==null&&o!==void 0?o:0)>0||((l=c?.betweenLimitOffset.length)!==null&&l!==void 0?l:0)>0||this.opt.fieldsInNewLine||this.opt.whereConditionInNewLine||this.opt.clauseInNewLine||this.opt.childQueriesInNewLine?ge(ne,u):tr(X(u),ge(He,u))}soqlChildQueryFields(e){return this.formatSelectFields(e.fields)}soqlChildQueryClause(e){const{doc:t,forceBreak:r}=this.soqlChildQueryFields(e),n=X([this.kw("select"),t]);return r?n:Y(n)}soqlChildQuery(e){const t=[this.soqlChildQueryClause(e),Y([$e,X([this.kw("from"),e.childField,e.childFieldAlias])]),this.format(e.where),this.limitOffset(e.limit,e.offset)];if(this.opt.childQueriesInNewLine)return[ne,"(",Be([ne,ge(ne,t)]),ne,")"];if(this.opt.fieldsInNewLine||this.opt.clauseInNewLine)return["(",Be([ne,ge(ne,t)]),ne,")"];const r=["(",X(t),")"],n=[He,"(",Be([He,ge(He,t)]),He,")"];return Y([$e,tr(r,n)])}soslStmt(e){const t=[Y([this.kw("find")," ",e.searchTerm,this.format(e.searchInClause)]),this.format(e.returningClause),this.format(e.withClause),this.format(e.limitClause),this.format(e.updateClause)];return this.opt.clauseInNewLine?ge(ne,t):Y(ge(ne,t))}soslSearchInClause(e){return[" ",this.kw("in")," ",this.kw(e.searchIn)," ",this.kw("fields")]}soslReturningClause(e){const t=this.format(e.returningExprs);return Y([this.kw("returning"),Be([ne,ge([",",ne],t)])])}soslReturningExpr(e){const t=[e.sobject];if(e.fields&&e.fields.length>0){t.push(" ");const r=[Y(vr(this.format(e.fields))),this.format(e.whereClause),this.format(e.usingListViewClause),this.format(e.orderByClause),this.limitOffset(e.limitClause,e.offsetClause)],n=["(",X(r),")"],i=["(",Be([He,ge(He,r)]),He,")"];t.push(tr(n,i))}return Y(t)}soslUsingListViewClause(e){return Y([$e,this.kw("using")," ",this.kw("listview")," = ",e.listView])}soslWithCond(e){const t=[this.kw("with")," ",this.format(e.left)];return e.oper&&t.push(" ",e.oper," ",this.format(e.right)),Y(t)}soslWithSnippet(e){const t=[this.kw("with")," ",this.kw("snippet")];return e.left&&t.push("(",e.left," = ",this.format(e.right),")"),Y(t)}limitOffset(e,t){const r=[];if(e!=null){const n=typeof e=="number"?e:e.value;r.push(X([this.kw("limit"),n+""]))}if(t!=null){const n=typeof t=="number"?t:t.value;r.push(X([this.kw("offset"),n+""]))}return r.length===0?"":Y([$e,X(r)])}limitClause(e){return Y([this.kw("limit")," ",e.value+""])}offsetClause(e){return Y([this.kw("offset")," ",e.value+""])}updateClause(e){return Y([this.kw("update")," ",this.kw(e.type)])}field(e){const t=this.context==="where"?e.field:Y([$e,e.field]);return e.alias?[t," ",this.kw("as")," ",e.alias]:t}formulaField(e){const t=e.type?`:${e.type}`:"";return Y([$e,X([e.formula+t,e.alias?X([this.kw("as"),e.alias]):void 0])])}fieldWoBreak(e){return e.field}polyField(e){var t,r,n;const i=this.format(e.else),s=e.alias?X([this.kw("as"),e.alias]):void 0,a=X(((t=this.opt.printWidth)!==null&&t!==void 0?t:150)>150?[this.kw("typeof"),e.what,X(this.format(e.objects)),i,X([this.kw("end"),s])]:[this.kw("typeof"),e.what,X(this.format(e.objects)),this.kw("end"),i,s]),o=this.format(e.objects),l=[this.kw("typeof")," ",e.what,Be([ne,ge(ne,o),i?[ne,i]:""]),ne,X([this.kw("end"),s])];return(pt(this.opt.printWidth)||this.opt.printWidth<=150)&&(e.objects.some(u=>{var c;return(((c=u.fields)===null||c===void 0?void 0:c.length)||0)>3})||(((n=(r=e.else)===null||r===void 0?void 0:r.fields)===null||n===void 0?void 0:n.length)||0)>3)?l:tr(a,Y(l))}polyFieldSobjectExpr(e){const t=X([this.kw("when"),e.object,this.kw("then"),vr(this.format(e.fields))]),r=X([this.kw("when"),e.object,this.kw("then"),Be(vr(this.format(e.fields)))]);return tr(t,Y(r))}polyFieldElseExpr(e){return X([this.kw("else"),Be(vr(this.format(e.fields)))])}valueIn(e){const t=ge([",",Ha],e.values.map(i=>this.format(i))),r=["(",t,")"],n=[He,"(",Be([He,t]),He,")"];return tr(r,Y(n))}apexVar(e){return":"+e.name}includeFieldsClause(e){if(!e)return"";const{doc:t,forceBreak:r}=this.formatSelectFields(e.fields),n=X([this.kw("include"),t]);return r?n:Y(n)}fromClause(e){return Y([$e,X([this.kw("from"),e.sobject||e.childField,e.sobjectAlias,...pt(e.scope)?[]:[this.kw("using scope"),e.scope+""]])])}whereClause(e){if(this.opt.whereConditionInNewLine&&qr(e.expr)){const t=this.collectAndTerms(e.expr).map(n=>this.format(n)),r=[];return t.forEach((n,i)=>{if(i===0){r.push(n);return}r.push(ne,this.kw("and")," ",n)}),Be([$e,this.kw("where")," ",r])}if(this.shouldForceTopLevelAndBreak(e.expr)){const t=this.collectAndTerms(e.expr).map(o=>this.format(o)),r=[],n=this.opt.printWidth||150,i=5;let s=t.length>0?this.flatLength([this.kw("where")," ",t[0]]):0,a=!1;return t.forEach((o,l)=>{const u=this.flatLength(o);if(l===0){r.push(o);return}a||s+i+u>n?(r.push(ne,this.kw("and")," ",o),s=i+u,a=!0):(r.push(" ",this.kw("and")," ",o),s+=i+u)}),Be([$e,this.kw("where")," ",r])}return Be(Y([$e,X([this.kw("where"),this.format(e.expr)])]))}subQuery(e){const t=e.value,r=this.soqlStmtItems(t),n=["(",X(r),")"],i=[He,"(",Be([He,ge(He,r)]),He,")"];return this.opt.fieldsInNewLine||this.opt.clauseInNewLine?Y(["(",Be([He,ge(Ha,r)]),He,")"]):Y(tr(n,i))}securityContext(e){return Y(X([this.kw("with"),e.mode]))}dataCategory(e){const t=` ${this.kw("and")} `;return Y(X([this.kw("with"),e.dataCategory?this.kw("data category"):void 0,ge(t,this.format(e.exprs))]))}groupByClause(e){const t=[];return t.push(this.kw("group")),e.local&&t.push(this.kw("local")),t.push(this.kw("by"),vr(this.format(e.fields))),Y([$e,X(t)])}havingClause(e){return Y([$e,X([this.kw("having"),this.format(e.expr)])])}orderBy(e){return Be(Y([$e,X([this.kw("order by"),vr(this.format(e.items))])]))}orderByItem(e){return Y([$e,X([this.format(e.source),this.kw(e.direction),e.nullSort?this.kw("nulls ")+this.kw(e.nullSort):void 0])])}updateStmt(e){var t,r;const n=[Y(X([this.kw("update"),e.max?X([this.kw("max"),e.max+""]):void 0,e.sobject])),!((r=(t=e.withFieldsClause)===null||t===void 0?void 0:t.withFields)===null||r===void 0)&&r.length?Y([$e,X([this.kw("with"),Ba(vr(e.withFieldsClause.withFields))])]):"",Y([$e,X([this.kw("set"),Be(Y(vr(this.format(e.updateExpressions))))])]),this.format(e.scopeClause),this.format(e.whereClause),this.format(e.orderByClause),this.limitOffset(e.limitClause,e.offsetClause)];return this.opt.clauseInNewLine?ge(ne,n):tr(X(n),ge(He,n))}deleteStmt(e){const t=[Y(X([this.kw("delete"),e.hard?this.kw("hard"):void 0,e.max?X([this.kw("max"),e.max+""]):void 0])),Y(X([this.kw("from"),e.sobject])),this.format(e.scopeClause),this.format(e.whereClause),this.format(e.orderByClause),this.limitOffset(e.limitClause,e.offsetClause)];return this.opt.clauseInNewLine?ge(ne,t):tr(X(t),ge(He,t))}undeleteStmt(e){const t=[Y(X([this.kw("undelete"),e.max?X([this.kw("max"),e.max+""]):void 0])),Y(X([this.kw("from"),e.sobject])),this.format(e.scopeClause),this.format(e.whereClause),this.format(e.orderByClause),this.limitOffset(e.limitClause,e.offsetClause)];return this.opt.clauseInNewLine?ge(ne,t):tr(X(t),ge(He,t))}updateExpression(e){return Y([$e,X([e.field,"=",this.format(e.value)])])}soqlChainStmt(e){return ge(ge(" ",[ne,this.kw("chain"),ne]),this.format(e.stmts))}scopeClause(e){return Y([$e,X([this.kw("using scope"),e.scope])])}dataCategorySelection(e){return Y([X([e.group,this.kw(e.selector),this.format(e.name)])])}dataCategoryName(e){return e.value}dataCategoryNames(e){return Ba(vr(e.values))}func(e,t){const r=(e.args||[]).map(i=>al(i)||ol(i)||nd(i)||id(i)?this.fieldWoBreak(i):this.format(i)),n=this.opt.uppercase?e.name.toUpperCase():e.name;return Y([t?void 0:$e,[n,Ba(ge(", ",r)),...e.alias?[" ",e.alias]:[]]])}exprCase(e){if(this.context="where",qr(e)){if(this.opt.whereConditionInNewLine){const a=this.collectAndTerms(e).map(l=>this.format(l)),o=[];return a.forEach((l,u)=>{if(u===0){o.push(l);return}o.push(ne,this.kw("and")," ",l)}),o}const t=this.collectAndTerms(e),r=this.opt.printWidth||150,n=t.map(a=>this.format(a)),i=[];let s=0;return n.forEach((a,o)=>{const l=this.flatLength(a);if(o===0){i.push(a),s=l;return}const u=5;s+u+l>r?(i.push(ne,this.kw("and")," ",a),s=l):(i.push(Ha,this.kw("and")," ",a),s+=u+l)}),i}else if(In(e)){const t=this.format(e.left),r=this.format(e.right);if(this.opt.whereConditionInNewLine)return[t,ne,this.kw("or")," ",r];const n=this.opt.printWidth||150;if(this.flatLength([t," ",this.kw("or")," ",r])>n){const i=this.isParenExpr(e.right);return[t,ne,this.kw("or"),i?ne:" ",r]}return[t,Ha,this.kw("or")," ",r]}else{if(ll(e))return X([this.kw("not"),this.format(e.expr)]);if(Sy(e))return Y(X([this.format(e.left),e.operNot?this.kw("not"):void 0,this.kw(e.oper),this.format(e.right)]))}throw new Error(`Expr type ${e.$type} is not handled!`)}expr(e){if(!e.paren)return this.exprCase(e);const t=e.$container;if(!qr(e)&&!In(e)&&!ll(e))return this.exprCase(e);if(qr(e)&&t&&qr(t))return this.exprCase(e);if(In(e)&&t&&In(t))return this.exprCase(e);const r=this.exprCase(e);if(this.opt.whereConditionInNewLine)return["(",Be([ne,r]),ne,")"];const n=this.opt.printWidth||150;if(this.flatLength(r)>n)return Y(["(",Be([ne,r]),ne,")"]);const i=Cu(1e4,Y(r)).trim();return(this.opt.printWidth||150)>1e3&&i.startsWith("(")?Y(["(",r,")"]):Ba(r)}format(e){if(!e)return[];if(Array.isArray(e))return e.map(r=>this.format(r));let t;if(ly(e)){const r=this.format(e.statements);if(e.statements.length<=1)t=r;else{const n=r.map(i=>[i,";"]);t=ge([ne,ne],n)}}else if(rd(e))t=this.soqlStmt(e);else if(_y(e))t=this.whereClause(e);else if(oy(e))t=this.securityContext(e);else if(Qg(e))t=this.groupByClause(e);else if(Zg(e))t=this.havingClause(e);else if(sy(e))t=this.orderBy(e);else if(lE(e))t=this.orderByItem(e);else if(iy(e))t=this.offsetClause(e);else if(ms(e))t=this.soqlChildQuery(e);else if(jg(e))t=this.dataCategory(e);else if(oE(e))t=this.dataCategorySelection(e);else if(Ug(e))t=this.dataCategoryName(e);else if(Wg(e))t=this.dataCategoryNames(e);else if(Vg(e))t=this.expr(e);else if(Xg(e)||Jg(e))t=this.func(e);else if(vy(e))t=this.func(e,!0);else if(al(e)||ol(e)||nd(e)||id(e))t=this.field(e);else if(td(e))t=this.formulaField(e);else if(An(e))t=this.polyField(e);else if(cE(e))t=this.polyFieldSobjectExpr(e);else if(uE(e))t=this.polyFieldElseExpr(e);else if(xg(e))t=this.apexVar(e);else if(Ty(e))t=this.subQuery(e);else if(Bg(e)||Hg(e)||ny(e))t=this.kw(e.value);else if(qg(e))t=this.kw(e.value);else if(Gg(e)||Kg(e)||zg(e)||ty(e)||yy(e))t=e.value+"";else if(Yg(e))t=e.value;else if(Cy(e))t=this.valueIn(e);else if(hy(e))t=this.soslStmt(e);else if(fy(e))t=this.soslSearchInClause(e);else if(cy(e))t=this.soslReturningClause(e);else if(dy(e))t=this.soslReturningExpr(e);else if(ry(e))t=this.limitClause(e);else if(py(e))t=this.soslUsingListViewClause(e);else if(my(e))t=this.soslWithCond(e);else if(gy(e))t=this.soslWithSnippet(e);else if(Ry(e))t=this.updateClause(e);else if(xl(e))t=this.updateStmt(e);else if(sf(e))t=this.deleteStmt(e);else if(Fl(e))t=this.undeleteStmt(e);else if(uy(e))t=this.soqlChainStmt(e);else if(wy(e))t=this.updateExpression(e);else if(ay(e))t=this.scopeClause(e);else if(ey(e))t=this.includeFieldsClause(e);else throw new Error(`AST Node of type ${e.$type} is not handled!`);return this.withComments(e,t)}print(e){this.commentMap=this.buildCommentMap(e),this.emittedComments=new WeakSet;const t=Cu(this.opt.printWidth||150,this.format(e)).split(`
`).map(n=>cN.find(i=>n.toLowerCase().startsWith(i.toLowerCase()))?n.substring(1).trimEnd():n.trimEnd()),r=[];for(const n of t){if(n){r.push(n);continue}r.length>0&&r[r.length-1].trimEnd().endsWith(";")&&r.push(n)}return r.join(`
`).trim()}};async function fN(e,t={}){var r;return(r=t.printWidth)!==null&&r!==void 0||(t.printWidth=150),new If(t).print((await gA(e,{checkForErrors:!0})).parseResult.value).trim()}var hN=new Set(["avg","count","count_distinct","first","join","join_distinct","last","max","min","sum"]);function pN(e){return hN.has(e.name.toLowerCase())}var mN=class{constructor(e={}){this.text="",this.opt=e}append(e){return pt(e)||(this.text+=e),this}wrapIf(e,t,r){return pt(t)?this:(this.append(e).append(t).append(r),this)}space(){return this.text.endsWith(" ")||this.append(" "),this}ln(){return this.opt.noNewLines?this.append(" "):this.append(`
`),this}getKw(e){return e&&(this.opt.uppercase?e.toUpperCase():e.toLowerCase())}kwIf(e,t){return t&&this.append(this.getKw(e)),this}kw(e,t,r){return this.append(this.getKw(e)),t&&this.space().kw(t),r&&this.space().kw(r),this}appendItems(e,t=", ",r=n=>this.process(n)){let n=!0;for(const i of e)n?n=!1:this.append(t),r(i);return this}fromClause(e){return this.ln().kw("from").space().append(e.sobject||e.childField).wrapIf(" ",e.sobjectAlias||e.childFieldAlias),this}groupByClause(e){return e?(this.ln(),this.kw("group").space(),e.local&&!this.opt.skipGroupByLocal&&this.kw("local").space(),this.kw("by").space(),this.appendItems(e.fields,", ",t=>this.process(t)),this):this}whereClause(e){return e?(this.ln().kw("where").space().process(e.expr),this):this}dataCategory(e){return this.ln().kw("with"),e.dataCategory&&this.space().kw("data category"),this.space().appendItems(e.exprs,this.getKw(" and "),t=>this.dataCategorySel(t)),this}securityContext(e){return this.ln().kw("with").space().append(e.mode),this}dataCategorySel(e){return this.append(e.group).space().kw(e.selector).space().process(e.name),Ug(e.name)?this.append(e.name.value):Wg(e.name)&&this.append("(").appendItems(e.name.values,", ",t=>this.append(t)).append(")"),this}havingClause(e){return this.ln().kw("having").space().process(e.expr),this}expr(e){return e.paren&&this.append("("),ll(e)?this.kw("not").space().process(e.expr):qr(e)?this.expr(e.left).append(" and ").expr(e.right):In(e)?this.expr(e.left).append(" or ").expr(e.right):ll(e)?this.append("(").expr(e.expr).append(")"):Sy(e)&&this.process(e.left).space().append(e.operNot?this.getKw("not "):void 0).kw(e.oper).space().process(e.right),e.paren&&this.append(")"),this}orderBy(e){return e&&this.ln().kw("order by").space().appendItems(e.items,", ",t=>this.orderByItem(t)),this}orderByItem(e){return this.process(e.source).wrapIf(" ",this.getKw(e.direction)).wrapIf(this.getKw(" nulls "),this.getKw(e.nullSort)),this}offset(e){return pt(e)||this.ln().kw("offset").space().append(e),this}limit(e){return pt(e)||this.ln().kw("limit").space().append(e),this}childSoql(e){this.append(this.opt.skipChildQueryParenthesis?"":"(").soqlStmt(e).append(this.opt.skipChildQueryParenthesis?"":")")}soqlChainStmt(e){this.appendItems(e.stmts,this.getKw(" chain "),t=>this.process(t))}isIncludeField(e){return td(e)?!this.opt.skipFormulaFields:!0}includeFieldsClause(e){return!e||this.opt.skipIncludeFields?this:(this.ln().kw("include").space().appendItems(e.fields,", ",t=>this.process(t)),this)}soqlStmt(e){const t=e.fields.filter(r=>this.isIncludeField(r));return!this.opt.asCountQuery&&this.opt.skipFormulaFields&&t.length===0&&t.push({$type:"Field",field:"Id"}),this.kw("select").space().appendItems(this.opt.asCountQuery?[{$type:"Func",name:"count",args:[]}]:t,", ",r=>this.process(r)).includeFieldsClause(e.includeFields).fromClause(e).wrapIf(" using scope ",e.scope).process(e.where).process(e.withs).process(e.groupBy).process(e.having),this.opt.asCountQuery||this.process(e.orderBy),this.limit(e.limit).offset(e.offset),e.for&&this.ln().kw("for").space().append(e.for),e.update&&this.ln().kw("update").space().append(e.update),e.allRows&&!this.opt.skipIncludeDeleted&&this.space().kw("include deleted"),this}updateStmt(e){var t,r;this.kw("update").space(),e.max&&this.kw("max").space().append(e.max).space(),this.append(e.sobject),!((r=(t=e.withFieldsClause)===null||t===void 0?void 0:t.withFields)===null||r===void 0)&&r.length&&this.space().kw("with").space().appendItems(e.withFieldsClause.withFields,", ",n=>this.append(n)),this.ln().kw("set").space().appendItems(e.updateExpressions,", "),this.process(e.scopeClause),this.process(e.whereClause),this.process(e.orderByClause),this.process(e.limitClause),this.process(e.offsetClause)}deleteStmt(e){this.kw("delete").space().kwIf("hard",e.hard).space(),e.max&&this.kw("max").space().append(e.max).space(),this.kw("from").space().append(e.sobject),this.process(e.scopeClause),this.process(e.whereClause),this.process(e.orderByClause),this.process(e.limitClause),this.process(e.offsetClause)}undeleteStmt(e){this.kw("undelete").space(),e.max&&this.kw("max").space().append(e.max).space(),this.kw("from").space().append(e.sobject),this.process(e.scopeClause),this.process(e.whereClause),this.process(e.orderByClause),this.process(e.limitClause),this.process(e.offsetClause)}updateExpr(e){this.append(e.field).space().append("=").space().process(e.value)}soslStmt(e){return this.kw("find").space().append(e.searchTerm).process(e.searchInClause).process(e.returningClause).process(e.withClause).process(e.limitClause).process(e.updateClause),this}field(e){return this.append(e.field),this}formulaField(e){return this.opt.skipFormulaFields||(this.append(e.formula),e.type&&this.append(":"+e.type)),this}polyField(e){this.kw("typeof").space().append(e.what);for(const t of e.objects)this.space().kw("when").space().append(t.object).space().kw("then").space().appendItems(t.fields,", ",r=>this.process(r));return e.else&&this.space().kw("else").space().appendItems(e.else.fields,", ",t=>this.process(t)),this.space().append("end"),this}func(e){var t;this.append(e.name).append("("),!((t=e.args)===null||t===void 0)&&t.length&&this.appendItems(e.args,", ",r=>this.process(r)),this.append(")").wrapIf(" ",pN(e)?e.alias:void 0)}process(e){if(!e)return this;if(Array.isArray(e)){for(const t of e)this.process(t);return this}return ly(e)?e.statements.length===1?this.process(e.statements[0]):this.appendItems(e.statements,`;
`,t=>this.process(t)):uy(e)?this.soqlChainStmt(e):xl(e)?this.updateStmt(e):sf(e)?this.deleteStmt(e):Fl(e)?this.undeleteStmt(e):wy(e)?this.updateExpr(e):rd(e)?this.soqlStmt(e):hy(e)?this.soslStmt(e):fy(e)?this.soslSearchInClause(e):cy(e)?this.soslReturningClause(e):dy(e)?this.soslReturningExpr(e):ry(e)?this.limitClause(e):ay(e)?this.space().kw("using").space().kw("scope").space().append(e.scope):ey(e)?this.includeFieldsClause(e):iy(e)?this.offsetClause(e):py(e)?this.soslUsingListViewClause(e):my(e)?this.soslWithCond(e):gy(e)?this.soslWithSnippet(e):Ry(e)?this.updateClause(e):jg(e)?this.dataCategory(e):oy(e)?this.securityContext(e):_y(e)?this.whereClause(e):Qg(e)?this.groupByClause(e):Zg(e)?this.havingClause(e):sy(e)?this.orderBy(e):al(e)||ol(e)||nd(e)||id(e)?this.field(e):td(e)?this.formulaField(e):An(e)?this.polyField(e):ms(e)?this.childSoql(e):Xg(e)?this.func(e):vy(e)?this.func(e):Jg(e)?this.func(e):Vg(e)?this.expr(e):xg(e)?this.append(":").append(e.name):Ty(e)?this.append("(").soqlStmt(e.value).append(")"):Cy(e)?this.append("(").appendItems(e.values,", ",t=>this.process(t)).append(")"):Bg(e)||Hg(e)?this.kw(e.value):(qg(e)||Gg(e)||Kg(e)||zg(e)||ty(e)||ny(e)||yy(e)||Yg(e))&&this.append(""+e.value),this}serialize(e){return this.process(e),this.text.trim()}soslSearchInClause(e){return this.space().kw("in").space().append(e.searchIn).space().append("fields"),this}soslReturningClause(e){this.space().kw("returning").space().appendItems(e.returningExprs,", ",t=>this.process(t))}soslReturningExpr(e){var t;this.append(e.sobject),!((t=e.fields)===null||t===void 0)&&t.length&&(this.space().append("(").appendItems(e.fields,", ",r=>this.process(r)),this.process(e.whereClause),this.process(e.usingListViewClause),this.process(e.orderByClause),this.process(e.limitClause),this.process(e.offsetClause),this.append(")"))}limitClause(e){this.space().kw("limit").space().append(e.value)}offsetClause(e){this.space().kw("offset").space().append(e.value)}soslUsingListViewClause(e){this.space().kw("using").space().kw("listview").space().append("=").space().append(e.listView)}soslWithCond(e){this.space().kw("with").space().process(e.left),e.oper&&this.space().append(e.oper).space().process(e.right)}soslWithSnippet(e){this.space().kw("with","snippet"),e.left&&this.space().append("(").append(e.left).space().append("=").space().process(e.right).append(")")}updateClause(e){this.space().kw("update").space().kw(e.type)}};function nP(e,t={}){return(xl(e)||sf(e)||Fl(e))&&t.dmlToSoql&&(e=yN(e,t)),t.printWidth||(t.printWidth=150),t.noNewLines=t.format?!1:t.noNewLines,t.format?new If(t).print(e):new mN(t).serialize(e)}function gN(e){var t;let r=[];if(xl(e)){if(e.withFieldsClause)for(const n of e.withFieldsClause.withFields)r.push(n);if(!((t=e.updateExpressions)===null||t===void 0)&&t.length)for(const n of e.updateExpressions)r.push(n.field),(al(n.value)||ol(n.value))&&r.push(n.value.field)}return r=["Id",...vA(r).filter(n=>!yA("Id",n))],r.map(n=>({$type:"Field",field:n}))}function yN(e,t={}){var r,n,i,s;const a={$type:"SoqlStmt"};a.fields=gN(e),a.sobject=e.sobject,a.scope=(r=e.scopeClause)===null||r===void 0?void 0:r.scope;let o=e.whereClause;if(Fl(e)){const l={$type:"ExprCond",left:{$type:"Field",field:"IsDeleted"},oper:"=",right:{$type:"Boolean",value:"true"}};o?(e.whereClause.expr.paren=!0,o={$type:"WhereClause",expr:{$type:"AndExpr",left:(n=e.whereClause)===null||n===void 0?void 0:n.expr,right:l}}):o={$type:"WhereClause",expr:l}}return a.where=o,a.orderBy=e.orderByClause,a.limit=(i=e.limitClause)===null||i===void 0?void 0:i.value,a.offset=(s=e.offsetClause)===null||s===void 0?void 0:s.value,a}function vp(e,t){const r={stacks:e,tokens:t};return vN(r),r.stacks.flat().forEach(n=>{n.property=void 0}),Nv(r.stacks).map(n=>n[n.length-1])}function Nf(e){const{next:t,cardinalities:r,visited:n,plus:i}=e,s=[],a=t.feature;if(n.has(a))return[];ln(a)||n.add(a);let o,l=a;for(;l.$container;)if(ln(l.$container)){o=l.$container;break}else if(lm(l.$container))l=l.$container;else break;if(FS(l.cardinality)){const u=Ln({next:{feature:l,type:t.type},cardinalities:r,visited:n,plus:i});for(const c of u)i.add(c.feature);s.push(...u)}if(o){const u=o.elements.indexOf(l);u!==void 0&&u<o.elements.length-1&&s.push(...Iv({feature:o,type:t.type},u+1,r,n,i)),s.every(c=>xs(c.feature.cardinality,c.feature)||xs(r.get(c.feature))||i.has(c.feature))&&s.push(...Nf({next:{feature:o,type:t.type},cardinalities:r,visited:n,plus:i}))}return s}function yd(e){return at(e)&&(e={feature:e}),Ln({next:e,cardinalities:new Map,visited:new Set,plus:new Set})}function Ln(e){var t,r,n;const{next:i,cardinalities:s,visited:a,plus:o}=e;if(i===void 0)return[];const{feature:l,type:u}=i;if(ln(l))return a.has(l)?[]:(a.add(l),Iv(i,0,s,a,o).map(c=>Ka(c,l.cardinality,s)));if(Fd(l)||xd(l))return l.elements.flatMap(c=>Ln({next:{feature:c,type:u,property:i.property},cardinalities:s,visited:a,plus:o})).map(c=>Ka(c,l.cardinality,s));if(ar(l))return Ln({next:{feature:l.terminal,type:u,property:(t=i.property)!==null&&t!==void 0?t:l.feature},cardinalities:s,visited:a,plus:o}).map(c=>Ka(c,l.cardinality,s));if(ea(l))return Nf({next:{feature:l,type:kl(l),property:(r=i.property)!==null&&r!==void 0?r:l.feature},cardinalities:s,visited:a,plus:o});if($r(l)&&dt(l.rule.ref)){const c=l.rule.ref;return Ln({next:{feature:c.definition,type:c.fragment||c.dataType?void 0:(n=ra(c))!==null&&n!==void 0?n:c.name,property:i.property},cardinalities:s,visited:a,plus:o}).map(d=>Ka(d,l.cardinality,s))}else return[i]}function Ka(e,t,r){return r.set(e.feature,t),e}function Iv(e,t,r,n,i){var s;const a=[];let o;for(;t<e.feature.elements.length&&(o={feature:e.feature.elements[t++],type:e.type},a.push(...Ln({next:o,cardinalities:r,visited:n,plus:i})),!!xs((s=o.feature.cardinality)!==null&&s!==void 0?s:r.get(o.feature),o.feature)););return a}function vN(e){for(const t of e.tokens)e.stacks=Nv(e.stacks,t)}function Nv(e,t){const r=[];for(const n of e)r.push(...TN(n,t));return r}function TN(e,t){const r=new Map,n=new Set(e.map(s=>s.feature).filter(RN)),i=[];for(;e.length>0;){const s=Nf({next:e.pop(),cardinalities:r,plus:n,visited:new Set}).filter(a=>t?Pf(a.feature,t):!0);for(const a of s)i.push([...e,a]);if(!s.every(a=>xs(a.feature.cardinality,a.feature)||xs(r.get(a.feature))))break}return i}function RN(e){if(e.cardinality==="+")return!0;const t=Ur(e,ar);return!!(t&&t.cardinality==="+")}function Pf(e,t){if(or(e))return e.value===t.image;if($r(e))return wN(e.rule.ref,t);if(ta(e)){const r=Rm(e);if(r)return Pf(r,t)}return!1}function wN(e,t){return dt(e)?yd(e.definition).some(r=>Pf(r.feature,t)):zr(e)?$l(e).test(t.image):!1}function CN(e){const t=Array.from(new Set(e.flatMap(n=>{var i;return(i=n?.triggerCharacters)!==null&&i!==void 0?i:[]}))),r=Array.from(new Set(e.flatMap(n=>{var i;return(i=n?.allCommitCharacters)!==null&&i!==void 0?i:[]})));return{triggerCharacters:t.length>0?t:void 0,allCommitCharacters:r.length>0?r:void 0}}var _N=class{constructor(e){this.scopeProvider=e.references.ScopeProvider,this.grammar=e.Grammar,this.completionParser=e.parser.CompletionParser,this.nameProvider=e.references.NameProvider,this.lexer=e.parser.Lexer,this.nodeKindProvider=e.shared.lsp.NodeKindProvider,this.fuzzyMatcher=e.shared.lsp.FuzzyMatcher,this.grammarConfig=e.parser.GrammarConfig,this.astReflection=e.shared.AstReflection,this.documentationProvider=e.documentation.DocumentationProvider}async getCompletion(e,t,r){const n=[],i=this.buildContexts(e,t.position),s=(l,u)=>{const c=this.fillCompletionItem(l,u);c&&n.push(c)},a=l=>or(l.feature)?l.feature.value:l.feature,o=[];for(const l of i)if(await Promise.all(Me(l.features).distinct(a).exclude(o).map(u=>this.completionFor(l,u,s))),o.push(...l.features),!this.continueCompletion(n))break;return G.CompletionList.create(this.deduplicateItems(n),!0)}deduplicateItems(e){return Me(e).distinct(t=>`${t.kind}_${t.label}_${t.detail}`).toArray()}findFeaturesAt(e,t){const r=e.getText({start:G.Position.create(0,0),end:e.positionAt(t)}),n=this.completionParser.parse(r),i=n.tokens;if(n.tokenIndex===0){const a=Ou(this.grammar),o=yd({feature:a.definition,type:ra(a)});return i.length>0?(i.shift(),vp(o.map(l=>[l]),i)):o}const s=[...i].splice(n.tokenIndex);return vp([n.elementStack.map(a=>({feature:a}))],s)}*buildContexts(e,t){var r,n;const i=e.parseResult.value.$cstNode;if(!i)return;const s=e.textDocument,a=s.getText(),o=s.offsetAt(t),l={document:e,textDocument:s,offset:o,position:t},u=this.findDataTypeRuleStart(i,o);if(u){const[v,_]=u,T=(r=Iu(i,v))===null||r===void 0?void 0:r.astNode;yield Object.assign(Object.assign({},l),{node:T,tokenOffset:v,tokenEndOffset:_,features:this.findFeaturesAt(s,v)})}const{nextTokenStart:c,nextTokenEnd:d,previousTokenStart:f,previousTokenEnd:h}=this.backtrackToAnyToken(a,o);let m=c;o<=c&&f!==void 0&&(m=f);const R=(n=Iu(i,m))===null||n===void 0?void 0:n.astNode;let S=!0;if(f!==void 0&&h!==void 0&&h===o&&(yield Object.assign(Object.assign({},l),{node:R,tokenOffset:f,tokenEndOffset:h,features:this.findFeaturesAt(s,f)}),S=this.performNextTokenCompletion(e,a.substring(f,h),f,h),S&&(yield Object.assign(Object.assign({},l),{node:R,tokenOffset:h,tokenEndOffset:h,features:this.findFeaturesAt(s,h)}))),R)S&&(yield Object.assign(Object.assign({},l),{node:R,tokenOffset:c,tokenEndOffset:d,features:this.findFeaturesAt(s,c)}));else{const v=Ou(this.grammar);if(!v)throw new Error("Missing entry parser rule");yield Object.assign(Object.assign({},l),{tokenOffset:c,tokenEndOffset:d,features:yd(v.definition)})}}performNextTokenCompletion(e,t,r,n){return new RegExp("\\P{L}$","u").test(t)}findDataTypeRuleStart(e,t){var r,n;let i=on(e,t,this.grammarConfig.nameRegexp),s=!!(!((r=Ur(i?.grammarSource,dt))===null||r===void 0)&&r.dataType);if(s){for(;s;)i=i?.container,s=!!(!((n=Ur(i?.grammarSource,dt))===null||n===void 0)&&n.dataType);if(i)return[i.offset,i.end]}}continueCompletion(e){return e.length===0}backtrackToAnyToken(e,t){const r=this.lexer.tokenize(e).tokens;if(r.length===0)return{nextTokenStart:t,nextTokenEnd:t};let n;for(const i of r){if(i.startOffset>=t)return{nextTokenStart:t,nextTokenEnd:t,previousTokenStart:n?n.startOffset:void 0,previousTokenEnd:n?n.endOffset+1:void 0};if(i.endOffset>=t)return{nextTokenStart:i.startOffset,nextTokenEnd:i.endOffset+1,previousTokenStart:n?n.startOffset:void 0,previousTokenEnd:n?n.endOffset+1:void 0};n=i}return{nextTokenStart:t,nextTokenEnd:t,previousTokenStart:n?n.startOffset:void 0,previousTokenEnd:n?n.endOffset+1:void 0}}completionFor(e,t,r){if(or(t.feature))return this.completionForKeyword(e,t.feature,r);if(ta(t.feature)&&e.node)return this.completionForCrossReference(e,t,r)}completionForCrossReference(e,t,r){const n=Ur(t.feature,ar);let i=e.node;if(n&&i){t.type&&(i={$type:t.type,$container:i,$containerProperty:t.property},mm(this.astReflection,i));const s={reference:{$refText:""},container:i,property:n.feature};try{for(const a of this.getReferenceCandidates(s,e))r(e,this.createReferenceCompletionItem(a))}catch(a){console.error(a)}}}getReferenceCandidates(e,t){return this.scopeProvider.getScope(e).getAllElements()}createReferenceCompletionItem(e){return{nodeDescription:e,kind:this.nodeKindProvider.getCompletionItemKind(e),documentation:this.getReferenceDocumentation(e),detail:e.type,sortText:"0"}}getReferenceDocumentation(e){if(!e.node)return;const t=this.documentationProvider.getDocumentation(e.node);if(t)return{kind:"markdown",value:t}}completionForKeyword(e,t,r){this.filterKeyword(e,t)&&r(e,{label:t.value,kind:this.getKeywordCompletionItemKind(t),detail:"Keyword",sortText:"1"})}getKeywordCompletionItemKind(e){return G.CompletionItemKind.Keyword}filterKeyword(e,t){return new RegExp("\\p{L}","u").test(t.value)}fillCompletionItem(e,t){var r,n;let i;if(typeof t.label=="string")i=t.label;else if("node"in t){const o=this.nameProvider.getName(t.node);if(!o)return;i=o}else if("nodeDescription"in t)i=t.nodeDescription.name;else return;let s;typeof((r=t.textEdit)===null||r===void 0?void 0:r.newText)=="string"?s=t.textEdit.newText:typeof t.insertText=="string"?s=t.insertText:s=i;const a=(n=t.textEdit)!==null&&n!==void 0?n:this.buildCompletionTextEdit(e,i,s);if(a)return{additionalTextEdits:t.additionalTextEdits,command:t.command,commitCharacters:t.commitCharacters,data:t.data,detail:t.detail,documentation:t.documentation,filterText:t.filterText,insertText:t.insertText,insertTextFormat:t.insertTextFormat,insertTextMode:t.insertTextMode,kind:t.kind,labelDetails:t.labelDetails,preselect:t.preselect,sortText:t.sortText,tags:t.tags,textEditText:t.textEditText,textEdit:a,label:i}}buildCompletionTextEdit(e,t,r){const n=e.textDocument.getText().substring(e.tokenOffset,e.offset);if(this.fuzzyMatcher.match(n,t))return{newText:r,range:{start:e.textDocument.positionAt(e.tokenOffset),end:e.position}}}},SN=class{constructor(e){this.nameProvider=e.references.NameProvider,this.references=e.references.References,this.grammarConfig=e.parser.GrammarConfig}getDefinition(e,t,r){const n=e.parseResult.value;if(n.$cstNode){const i=n.$cstNode,s=on(i,e.textDocument.offsetAt(t.position),this.grammarConfig.nameRegexp);if(s)return this.collectLocationLinks(s,t)}}collectLocationLinks(e,t){var r;const n=this.findLink(e);if(n)return[G.LocationLink.create(n.targetDocument.textDocument.uri,((r=n.target.astNode.$cstNode)!==null&&r!==void 0?r:n.target).range,n.target.range,n.source.range)]}findLink(e){const t=this.references.findDeclarationNode(e);if(t?.astNode){const r=lr(t.astNode);if(t&&r)return{source:e,target:t,targetDocument:r}}}},bN=class{constructor(e){this.references=e.references.References,this.nameProvider=e.references.NameProvider,this.grammarConfig=e.parser.GrammarConfig}getDocumentHighlight(e,t,r){const n=e.parseResult.value.$cstNode;if(!n)return;const i=on(n,e.textDocument.offsetAt(t.position),this.grammarConfig.nameRegexp);if(!i)return;const s=this.references.findDeclaration(i);if(s){const a=Ae.equals(lr(s).uri,e.uri),o={documentUri:e.uri,includeDeclaration:a};return this.references.findReferences(s,o).map(l=>this.createDocumentHighlight(l)).toArray()}}createDocumentHighlight(e){return G.DocumentHighlight.create(e.segment.range)}},kN=class{constructor(e){this.nameProvider=e.references.NameProvider,this.nodeKindProvider=e.shared.lsp.NodeKindProvider}getSymbols(e,t,r){return this.getSymbol(e,e.parseResult.value)}getSymbol(e,t){const r=t.$cstNode,n=this.nameProvider.getNameNode(t);if(n&&r){const i=this.nameProvider.getName(t);return[{kind:this.nodeKindProvider.getSymbolKind(t),name:i||n.text,range:r.range,selectionRange:n.range,children:this.getChildSymbols(e,t)}]}else return this.getChildSymbols(e,t)||[]}getChildSymbols(e,t){const r=[];for(const n of _l(t)){const i=this.getSymbol(e,n);r.push(...i)}if(r.length>0)return r}},$N=class{constructor(e){this.workspaceManager=e.workspace.WorkspaceManager,this.documentBuilder=e.workspace.DocumentBuilder,this.workspaceLock=e.workspace.WorkspaceLock,this.serviceRegistry=e.ServiceRegistry;let t=!1;e.lsp.LanguageServer.onInitialize(r=>{var n,i;t=!!(!((i=(n=r.capabilities.workspace)===null||n===void 0?void 0:n.didChangeWatchedFiles)===null||i===void 0)&&i.dynamicRegistration)}),e.lsp.LanguageServer.onInitialized(r=>{t&&this.registerFileWatcher(e)})}registerFileWatcher(e){const t=Me(e.ServiceRegistry.all).flatMap(r=>r.LanguageMetaData.fileExtensions).map(r=>r.startsWith(".")?r.substring(1):r).distinct().toArray();if(t.length>0){const r=e.lsp.Connection,n={watchers:[{globPattern:t.length===1?`**/*.${t[0]}`:`**/*.{${t.join(",")}}`}]};r?.client.register(G.DidChangeWatchedFilesNotification.type,n)}}fireDocumentUpdate(e,t){e=e.filter(r=>this.serviceRegistry.hasServices(r)),this.workspaceManager.ready.then(()=>{this.workspaceLock.write(r=>this.documentBuilder.update(e,t,r))}).catch(r=>{console.error("Workspace initialization failed. Could not perform document update.",r)})}didChangeContent(e){this.fireDocumentUpdate([It.parse(e.document.uri)],[])}didChangeWatchedFiles(e){const t=Me(e.changes).filter(n=>n.type!==G.FileChangeType.Deleted).distinct(n=>n.uri).map(n=>It.parse(n.uri)).toArray(),r=Me(e.changes).filter(n=>n.type===G.FileChangeType.Deleted).distinct(n=>n.uri).map(n=>It.parse(n.uri)).toArray();this.fireDocumentUpdate(t,r)}},EN=class{constructor(e){this.commentNames=e.parser.GrammarConfig.multilineCommentRules}getFoldingRanges(e,t,r){const n=[],i=s=>n.push(s);return this.collectFolding(e,i),n}collectFolding(e,t){var r;const n=(r=e.parseResult)===null||r===void 0?void 0:r.value;if(n){if(this.shouldProcessContent(n)){const i=zn(n).iterator();let s;do if(s=i.next(),!s.done){const a=s.value;this.shouldProcess(a)&&this.collectObjectFolding(e,a,t),this.shouldProcessContent(a)||i.prune()}while(!s.done)}this.collectCommentFolding(e,n,t)}}shouldProcess(e){return!0}shouldProcessContent(e){return!0}collectObjectFolding(e,t,r){const n=t.$cstNode;if(n){const i=this.toFoldingRange(e,n);i&&r(i)}}collectCommentFolding(e,t,r){const n=t.$cstNode;if(n){for(const i of Eu(n))if(this.commentNames.includes(i.tokenType.name)){const s=this.toFoldingRange(e,i,G.FoldingRangeKind.Comment);s&&r(s)}}}toFoldingRange(e,t,r){const n=t.range,i=n.start;let s=n.end;if(!(s.line-i.line<2))return this.includeLastFoldingLine(t,r)||(s=e.textDocument.positionAt(e.textDocument.offsetAt({line:s.line,character:0})-1)),G.FoldingRange.create(i.line,s.line,i.character,s.character,r)}includeLastFoldingLine(e,t){if(t===G.FoldingRangeKind.Comment)return!1;const r=e.text,n=r.charAt(r.length-1);return!(n==="}"||n===")"||n==="]")}},AN=class{match(e,t){if(e.length===0)return!0;let r=!1,n,i=0;const s=t.length;for(let a=0;a<s;a++){const o=t.charCodeAt(a),l=e.charCodeAt(i);if((o===l||this.toUpperCharCode(o)===this.toUpperCharCode(l))&&(r||(r=n===void 0||this.isWordTransition(n,o)),r&&i++,i===e.length))return!0;n=o}return!1}isWordTransition(e,t){return Tp<=e&&e<=Rp&&IN<=t&&t<=NN||e===wp&&t!==wp}toUpperCharCode(e){return Tp<=e&&e<=Rp?e-32:e}},Tp=97,Rp=122,IN=65,NN=90,wp=95,PN=class{constructor(e){this.references=e.references.References,this.grammarConfig=e.parser.GrammarConfig}getHoverContent(e,t){var r,n;const i=(n=(r=e.parseResult)===null||r===void 0?void 0:r.value)===null||n===void 0?void 0:n.$cstNode;if(i){const s=e.textDocument.offsetAt(t.position),a=on(i,s,this.grammarConfig.nameRegexp);if(a&&a.offset+a.length>s){const o=this.references.findDeclaration(a);if(o)return this.getAstNodeHoverContent(o)}}}},DN=class extends PN{constructor(e){super(e),this.documentationProvider=e.documentation.DocumentationProvider}getAstNodeHoverContent(e){const t=this.documentationProvider.getDocumentation(e);if(t)return{contents:{kind:"markdown",value:t}}}};function ON(e){const t=[],r=[];e.forEach(i=>{i?.triggerCharacters&&t.push(...i.triggerCharacters),i?.retriggerCharacters&&r.push(...i.retriggerCharacters)});const n={triggerCharacters:t.length>0?Array.from(new Set(t)).sort():void 0,retriggerCharacters:r.length>0?Array.from(new Set(r)).sort():void 0};return n.triggerCharacters?n:void 0}var Ga=Ke(),LN=class{constructor(e){this.onInitializeEmitter=new Ga.Emitter,this.onInitializedEmitter=new Ga.Emitter,this.services=e}get onInitialize(){return this.onInitializeEmitter.event}get onInitialized(){return this.onInitializedEmitter.event}async initialize(e){return this.eagerLoadServices(),this.fireInitializeOnDefaultServices(e),this.onInitializeEmitter.fire(e),this.onInitializeEmitter.dispose(),this.buildInitializeResult(e)}eagerLoadServices(){Zc(this.services),this.services.ServiceRegistry.all.forEach(e=>Zc(e))}hasService(e){return this.services.ServiceRegistry.all.some(t=>e(t)!==void 0)}buildInitializeResult(e){var t,r,n,i;const s=this.services.lsp.DocumentUpdateHandler,a=(t=this.services.lsp.FileOperationHandler)===null||t===void 0?void 0:t.fileOperationOptions,o=this.services.ServiceRegistry.all,l=this.hasService($=>{var k;return(k=$.lsp)===null||k===void 0?void 0:k.Formatter}),u=o.map($=>{var k,ie;return(ie=(k=$.lsp)===null||k===void 0?void 0:k.Formatter)===null||ie===void 0?void 0:ie.formatOnTypeOptions}).find($=>!!$),c=this.hasService($=>{var k;return(k=$.lsp)===null||k===void 0?void 0:k.CodeActionProvider}),d=this.hasService($=>{var k;return(k=$.lsp)===null||k===void 0?void 0:k.SemanticTokenProvider}),f=dA(o.map($=>{var k,ie;return(ie=(k=$.lsp)===null||k===void 0?void 0:k.SemanticTokenProvider)===null||ie===void 0?void 0:ie.semanticTokensOptions})),h=(n=(r=this.services.lsp)===null||r===void 0?void 0:r.ExecuteCommandHandler)===null||n===void 0?void 0:n.commands,m=this.hasService($=>{var k;return(k=$.lsp)===null||k===void 0?void 0:k.DocumentLinkProvider}),R=ON(o.map($=>{var k,ie;return(ie=(k=$.lsp)===null||k===void 0?void 0:k.SignatureHelp)===null||ie===void 0?void 0:ie.signatureHelpOptions})),S=this.hasService($=>{var k;return(k=$.lsp)===null||k===void 0?void 0:k.TypeProvider}),v=this.hasService($=>{var k;return(k=$.lsp)===null||k===void 0?void 0:k.ImplementationProvider}),_=this.hasService($=>{var k;return(k=$.lsp)===null||k===void 0?void 0:k.CompletionProvider}),T=CN(o.map($=>{var k,ie;return(ie=(k=$.lsp)===null||k===void 0?void 0:k.CompletionProvider)===null||ie===void 0?void 0:ie.completionOptions})),M=this.hasService($=>{var k;return(k=$.lsp)===null||k===void 0?void 0:k.ReferencesProvider}),F=this.hasService($=>{var k;return(k=$.lsp)===null||k===void 0?void 0:k.DocumentSymbolProvider}),W=this.hasService($=>{var k;return(k=$.lsp)===null||k===void 0?void 0:k.DefinitionProvider}),U=this.hasService($=>{var k;return(k=$.lsp)===null||k===void 0?void 0:k.DocumentHighlightProvider}),ee=this.hasService($=>{var k;return(k=$.lsp)===null||k===void 0?void 0:k.FoldingRangeProvider}),se=this.hasService($=>{var k;return(k=$.lsp)===null||k===void 0?void 0:k.HoverProvider}),he=this.hasService($=>{var k;return(k=$.lsp)===null||k===void 0?void 0:k.RenameProvider}),x=this.hasService($=>{var k;return(k=$.lsp)===null||k===void 0?void 0:k.CallHierarchyProvider}),A=this.hasService($=>{var k;return(k=$.lsp)===null||k===void 0?void 0:k.TypeHierarchyProvider}),y=this.hasService($=>{var k;return(k=$.lsp)===null||k===void 0?void 0:k.CodeLensProvider}),b=this.hasService($=>{var k;return(k=$.lsp)===null||k===void 0?void 0:k.DeclarationProvider}),q=this.hasService($=>{var k;return(k=$.lsp)===null||k===void 0?void 0:k.InlayHintProvider}),O=(i=this.services.lsp)===null||i===void 0?void 0:i.WorkspaceSymbolProvider;return{capabilities:{workspace:{workspaceFolders:{supported:!0},fileOperations:a},executeCommandProvider:h&&{commands:h},textDocumentSync:{change:Ga.TextDocumentSyncKind.Incremental,openClose:!0,save:!!s.didSaveDocument,willSave:!!s.willSaveDocument,willSaveWaitUntil:!!s.willSaveDocumentWaitUntil},completionProvider:_?T:void 0,referencesProvider:M,documentSymbolProvider:F,definitionProvider:W,typeDefinitionProvider:S,documentHighlightProvider:U,codeActionProvider:c,documentFormattingProvider:l,documentRangeFormattingProvider:l,documentOnTypeFormattingProvider:u,foldingRangeProvider:ee,hoverProvider:se,renameProvider:he?{prepareProvider:!0}:void 0,semanticTokensProvider:d?f:void 0,signatureHelpProvider:R,implementationProvider:v,callHierarchyProvider:x?{}:void 0,typeHierarchyProvider:A?{}:void 0,documentLinkProvider:m?{resolveProvider:!1}:void 0,codeLensProvider:y?{resolveProvider:!1}:void 0,declarationProvider:b,inlayHintProvider:q?{resolveProvider:!1}:void 0,workspaceSymbolProvider:O?{resolveProvider:!!O.resolveSymbol}:void 0}}}initialized(e){this.fireInitializedOnDefaultServices(e),this.onInitializedEmitter.fire(e),this.onInitializedEmitter.dispose()}fireInitializeOnDefaultServices(e){this.services.workspace.ConfigurationProvider.initialize(e),this.services.workspace.WorkspaceManager.initialize(e)}fireInitializedOnDefaultServices(e){const t=this.services.lsp.Connection,r=t?Object.assign(Object.assign({},e),{register:n=>t.client.register(Ga.DidChangeConfigurationNotification.type,n),fetchConfiguration:n=>t.workspace.getConfiguration(n)}):e;this.services.workspace.ConfigurationProvider.initialized(r).catch(n=>console.error("Error in ConfigurationProvider initialization:",n)),this.services.workspace.WorkspaceManager.initialized(e).catch(n=>console.error("Error in WorkspaceManager initialization:",n))}},MN=class{getSymbolKind(e){return G.SymbolKind.Field}getCompletionItemKind(e){return G.CompletionItemKind.Reference}},FN=class{constructor(e){this.nameProvider=e.references.NameProvider,this.references=e.references.References,this.grammarConfig=e.parser.GrammarConfig}findReferences(e,t,r){const n=e.parseResult.value.$cstNode;if(!n)return[];const i=on(n,e.textDocument.offsetAt(t.position),this.grammarConfig.nameRegexp);return i?this.getReferences(i,t,e):[]}getReferences(e,t,r){const n=[],i=this.references.findDeclaration(e);if(i){const s={includeDeclaration:t.context.includeDeclaration};this.references.findReferences(i,s).forEach(a=>{n.push(G.Location.create(a.sourceUri.toString(),a.segment.range))})}return n}};yn();var xN=class{constructor(e){this.references=e.references.References,this.nameProvider=e.references.NameProvider,this.grammarConfig=e.parser.GrammarConfig}async rename(e,t,r){const n={},i=e.parseResult.value.$cstNode;if(!i)return;const s=on(i,e.textDocument.offsetAt(t.position),this.grammarConfig.nameRegexp);if(!s)return;const a=this.references.findDeclaration(s);if(a)return this.references.findReferences(a,{onlyLocal:!1,includeDeclaration:!0}).forEach(o=>{const l=Ht.replace(o.segment.range,t.newName),u=o.sourceUri.toString();n[u]?n[u].push(l):n[u]=[l]}),{changes:n}}prepareRename(e,t,r){return this.renameNodeRange(e,t.position)}renameNodeRange(e,t){const r=e.parseResult.value.$cstNode,n=e.textDocument.offsetAt(t);if(r&&n){const i=on(r,n,this.grammarConfig.nameRegexp);if(!i)return;if(this.references.findDeclaration(i)||this.isNameNode(i))return i.range}}isNameNode(e){return e?.astNode&&kg(e.astNode)&&e===this.nameProvider.getNameNode(e.astNode)}},qN=class{constructor(e){this.indexManager=e.workspace.IndexManager,this.nodeKindProvider=e.lsp.NodeKindProvider,this.fuzzyMatcher=e.lsp.FuzzyMatcher}async getSymbols(e,t=Se.CancellationToken.None){const r=[],n=e.query.toLowerCase();for(const i of this.indexManager.allElements())if(await Rt(t),this.fuzzyMatcher.match(n,i.name)){const s=this.getWorkspaceSymbol(i);s&&r.push(s)}return r}getWorkspaceSymbol(e){const t=e.nameSegment;if(t)return{kind:this.nodeKindProvider.getSymbolKind(e),name:e.name,location:{range:t.range,uri:e.documentUri.toString()}}}},Pv=class{constructor(e){this._configuration=e,this._syncedDocuments=new Map,this._onDidChangeContent=new G.Emitter,this._onDidOpen=new G.Emitter,this._onDidClose=new G.Emitter,this._onDidSave=new G.Emitter,this._onWillSave=new G.Emitter}get onDidOpen(){return this._onDidOpen.event}get onDidChangeContent(){return this._onDidChangeContent.event}get onWillSave(){return this._onWillSave.event}onWillSaveWaitUntil(e){this._willSaveWaitUntil=e}get onDidSave(){return this._onDidSave.event}get onDidClose(){return this._onDidClose.event}get(e){return this._syncedDocuments.get(Ae.normalize(e))}set(e){const t=Ae.normalize(e.uri);let r=!0;this._syncedDocuments.has(t)&&(r=!1),this._syncedDocuments.set(t,e);const n=Object.freeze({document:e});return this._onDidOpen.fire(n),this._onDidChangeContent.fire(n),r}delete(e){const t=Ae.normalize(typeof e=="object"&&"uri"in e?e.uri:e),r=this._syncedDocuments.get(t);r!==void 0&&(this._syncedDocuments.delete(t),this._onDidClose.fire(Object.freeze({document:r})))}all(){return Array.from(this._syncedDocuments.values())}keys(){return Array.from(this._syncedDocuments.keys())}listen(e){e.__textDocumentSync=G.TextDocumentSyncKind.Incremental;const t=[];return t.push(e.onDidOpenTextDocument(r=>{const n=r.textDocument,i=Ae.normalize(n.uri),s=this._configuration.create(i,n.languageId,n.version,n.text);this._syncedDocuments.set(i,s);const a=Object.freeze({document:s});this._onDidOpen.fire(a),this._onDidChangeContent.fire(a)})),t.push(e.onDidChangeTextDocument(r=>{const n=r.textDocument,i=r.contentChanges;if(i.length===0)return;const{version:s}=n;if(s==null)throw new Error(`Received document change event for ${n.uri} without valid version identifier`);const a=Ae.normalize(n.uri);let o=this._syncedDocuments.get(a);o!==void 0&&(o=this._configuration.update(o,i,s),this._syncedDocuments.set(a,o),this._onDidChangeContent.fire(Object.freeze({document:o})))})),t.push(e.onDidCloseTextDocument(r=>{const n=Ae.normalize(r.textDocument.uri),i=this._syncedDocuments.get(n);i!==void 0&&(this._syncedDocuments.delete(n),this._onDidClose.fire(Object.freeze({document:i})))})),t.push(e.onWillSaveTextDocument(r=>{const n=this._syncedDocuments.get(Ae.normalize(r.textDocument.uri));n!==void 0&&this._onWillSave.fire(Object.freeze({document:n,reason:r.reason}))})),t.push(e.onWillSaveTextDocumentWaitUntil((r,n)=>{const i=this._syncedDocuments.get(Ae.normalize(r.textDocument.uri));return i!==void 0&&this._willSaveWaitUntil?this._willSaveWaitUntil(Object.freeze({document:i,reason:r.reason}),n):[]})),t.push(e.onDidSaveTextDocument(r=>{const n=this._syncedDocuments.get(Ae.normalize(r.textDocument.uri));n!==void 0&&this._onDidSave.fire(Object.freeze({document:n}))})),G.Disposable.create(()=>{t.forEach(r=>r.dispose())})}},jN=class{constructor(e){this.notebookDocuments=new Map,this.notebookCellMap=new Map,this._onDidOpen=new G.Emitter,this._onDidSave=new G.Emitter,this._onDidChange=new G.Emitter,this._onDidClose=new G.Emitter,"listen"in e?this._cellTextDocuments=e:this._cellTextDocuments=new Pv(e)}get cellTextDocuments(){return this._cellTextDocuments}getCellTextDocument(e){return this._cellTextDocuments.get(e.document)}getNotebookDocument(e){return this.notebookDocuments.get(Ae.normalize(e))}getNotebookCell(e){const t=this.notebookCellMap.get(Ae.normalize(e));return t&&t[0]}findNotebookDocumentForCell(e){const t=typeof e=="string"||"scheme"in e?e:e.document,r=this.notebookCellMap.get(Ae.normalize(t));return r&&r[1]}get onDidOpen(){return this._onDidOpen.event}get onDidSave(){return this._onDidSave.event}get onDidChange(){return this._onDidChange.event}get onDidClose(){return this._onDidClose.event}listen(e){const t=new Dv,r=[];return r.push(this.cellTextDocuments.listen(t)),r.push(e.notebooks.synchronization.onDidOpenNotebookDocument(n=>{const i=Ae.normalize(n.notebookDocument.uri);this.notebookDocuments.set(i,n.notebookDocument);for(const s of n.cellTextDocuments)t.openTextDocument({textDocument:s});this.updateCellMap(n.notebookDocument),this._onDidOpen.fire(n.notebookDocument)})),r.push(e.notebooks.synchronization.onDidChangeNotebookDocument(n=>{const i=Ae.normalize(n.notebookDocument.uri),s=this.notebookDocuments.get(i);if(s===void 0)return;s.version=n.notebookDocument.version;const a=s.metadata;let o=!1;const l=n.change;l.metadata!==void 0&&(o=!0,s.metadata=l.metadata);const u=[],c=[],d=[],f=[];if(l.cells!==void 0){const v=l.cells;if(v.structure!==void 0){const _=v.structure.array;if(s.cells.splice(_.start,_.deleteCount,..._.cells!==void 0?_.cells:[]),v.structure.didOpen!==void 0)for(const T of v.structure.didOpen)t.openTextDocument({textDocument:T}),u.push(T.uri);if(v.structure.didClose)for(const T of v.structure.didClose)t.closeTextDocument({textDocument:T}),c.push(T.uri)}if(v.data!==void 0){const _=new Map(v.data.map(T=>[T.document,T]));for(let T=0;T<=s.cells.length;T++){const M=_.get(s.cells[T].document);if(M!==void 0){const F=s.cells.splice(T,1,M);if(d.push({old:F[0],new:M}),_.delete(M.document),_.size===0)break}}}if(v.textContent!==void 0)for(const _ of v.textContent)t.changeTextDocument({textDocument:_.document,contentChanges:_.changes}),f.push(_.document.uri)}this.updateCellMap(s);const h={notebookDocument:s};o&&(h.metadata={old:a,new:s.metadata});const m=[];for(const v of u)m.push(this.getNotebookCell(v));const R=[];for(const v of c)R.push(this.getNotebookCell(v));const S=[];for(const v of f)S.push(this.getNotebookCell(v));(m.length>0||R.length>0||d.length>0||S.length>0)&&(h.cells={added:m,removed:R,changed:{data:d,textContent:S}}),(h.metadata!==void 0||h.cells!==void 0)&&this._onDidChange.fire(h)})),r.push(e.notebooks.synchronization.onDidSaveNotebookDocument(n=>{const i=this.getNotebookDocument(n.notebookDocument.uri);i!==void 0&&this._onDidSave.fire(i)})),r.push(e.notebooks.synchronization.onDidCloseNotebookDocument(n=>{const i=Ae.normalize(n.notebookDocument.uri),s=this.notebookDocuments.get(i);if(s!==void 0){this._onDidClose.fire(s);for(const a of n.cellTextDocuments)t.closeTextDocument({textDocument:a});this.notebookDocuments.delete(i);for(const a of s.cells)this.notebookCellMap.delete(a.document)}})),G.Disposable.create(()=>{r.forEach(n=>n.dispose())})}updateCellMap(e){for(const t of e.cells)this.notebookCellMap.set(t.document,[t,e])}},Dv=class Lo{onDidOpenTextDocument(t){return this.openHandler=t,G.Disposable.create(()=>{this.openHandler=void 0})}openTextDocument(t){this.openHandler&&this.openHandler(t)}onDidChangeTextDocument(t){return this.changeHandler=t,G.Disposable.create(()=>{this.changeHandler=t})}changeTextDocument(t){this.changeHandler&&this.changeHandler(t)}onDidCloseTextDocument(t){return this.closeHandler=t,G.Disposable.create(()=>{this.closeHandler=void 0})}closeTextDocument(t){this.closeHandler&&this.closeHandler(t)}onWillSaveTextDocument(){return Lo.NULL_DISPOSE}onWillSaveTextDocumentWaitUntil(){return Lo.NULL_DISPOSE}onDidSaveTextDocument(){return Lo.NULL_DISPOSE}};Dv.NULL_DISPOSE=Object.freeze({dispose:()=>{}});function UN(e){return il.merge(rf(e),WN(e))}function WN(e){return{lsp:{CompletionProvider:t=>new _N(t),DocumentSymbolProvider:t=>new kN(t),HoverProvider:t=>new DN(t),FoldingRangeProvider:t=>new EN(t),ReferencesProvider:t=>new FN(t),DefinitionProvider:t=>new SN(t),DocumentHighlightProvider:t=>new bN(t),RenameProvider:t=>new xN(t)},shared:()=>e.shared}}function BN(e){return il.merge(nf(e),HN(e))}function HN(e){return{lsp:{Connection:()=>e.connection,LanguageServer:t=>new LN(t),DocumentUpdateHandler:t=>new $N(t),WorkspaceSymbolProvider:t=>new qN(t),NodeKindProvider:()=>new MN,FuzzyMatcher:()=>new AN},workspace:{TextDocuments:()=>new Pv(tl),NotebookDocuments:t=>new jN(t.workspace.TextDocuments)}}}var KN={validation:{SfsqlValidator:()=>new Ey}};function iP(e){const t=Un(BN(e),ky),r=Un(UN({shared:t}),$y,KN);return t.ServiceRegistry.register(r),{shared:t,Sfsql:r}}export{qn as $,eT as $t,Cy as A,Nt as At,mt as B,DT as Bt,ms as C,Ed as Ct,Ty as D,Tl as Dt,hy as E,Xs as Et,qm as F,ml as Ft,kr as G,Rd as Gt,U_ as H,hl as Ht,wt as I,LT as It,Je as J,RT as Jt,br as K,$T as Kt,on as L,pl as Lt,id as M,Sd as Mt,Fg as N,Ys as Nt,Fl as O,YR as Ot,Y0 as P,Os as Pt,b_ as Q,rT as Qt,jo as R,cr as Rt,uy as S,Rl as St,dy as T,$d as Tt,j_ as U,Gs as Ut,K_ as V,zs as Vt,q_ as W,wd as Wt,J as X,nn as Xt,Ct as Y,Ar as Yt,K as Z,Ks as Zt,In as _,lw as _t,gE as a,Hs as an,Ld as at,VN as b,Lp as bt,sf as c,Gr as cn,Xt as ct,td as d,Od as dt,jt as en,Dt as et,Yg as f,lt as ft,ll as g,Mn as gt,zN as h,Sw as ht,gA as i,ce as in,uh as it,nd as j,Op as jt,xl as k,gl as kt,Sy as l,ur as ln,a_ as lt,Jg as m,Kw as mt,nP as n,zv as nn,T_ as nt,qr as o,Bs as on,f_ as ot,Xg as p,za as pt,Re as q,bT as qt,rP as r,bp as rn,xn as rt,xg as s,zt as sn,d_ as st,iP as t,Yv as tn,Q as tt,al as u,r_ as ut,An as v,sr as vt,rd as w,QR as wt,ol as x,Ft as xt,cE as y,Mp as yt,em as z,Cd as zt};
