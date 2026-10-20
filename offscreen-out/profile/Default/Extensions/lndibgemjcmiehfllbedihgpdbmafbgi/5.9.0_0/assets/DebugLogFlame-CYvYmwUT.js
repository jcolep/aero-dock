import{C as x,Et as f,K as E,Kt as $,P as L,U as p,Ut as D,a as B,bt as I,ct as M,f as l,h as g,p as S,qt as w}from"./vendor-charts-BA6mrMsB.js";import{Cd as F,Hl as b,cc as N,cs as U,dc as z,sc as H}from"./vendor-underscore-Bz5YeRR3.js";import{t as P}from"./AutoHeightBlock-BUkX-tUq.js";import{r as q}from"./themeHandler-Cv4WOiCZ.js";import{C as A,p as K}from"./debugLogHandler-D96HuoqF.js";import{t as O}from"./debuglogParser-Yr1sLT1T.js";import{n as y,r as h}from"./debuglogModels-4pEqLScl.js";import{t as W}from"./vendor-flamechartjs-N2J5G_5S.js";var j=["id"],G={class:"bb-debuglog-legend flex gap-2 flex-wrap align-items-center"},Q=x({__name:"DebugLogFlame",props:{conn:{},log:{}},setup(v){const o=v,r=z(),i=r+"-tooltip",c=I(!1);let u;function _(e){u=e,L(()=>{document.getElementById(r)&&k()})}function d(e){const s={name:e.unitType?`${e.unitType} - ${e.unitName}`:e.label||e.type,start:b(e.sts),duration:e.tet,type:K(e),log:e};return e.children?.length&&(s.children=e.children.map(t=>d(t))),s}function C(){return o.log.entries.filter(e=>A[e.type]?.level==="Error").map(e=>({shortName:"Error",fullName:e.info,timestamp:b(e.sts),color:"#ef4444"}))}function T(e,s,t){const a=e?.data?.source;if(!a)return n.style.display="none",null;let m=`
    <span class="bb-outfield">
      <span class="text-sm legend-pill" style="background-color: ${h[a.type]}">${a.type}</span> <span>${a.name}</span>
    </span>
    <span class="bb-outfield">
      <span class="label">Total Time</span>
        <span>${N(a.log.tet)}ms (${H(a.log.tetPer,2)}%)</span>
      </span>
    </span>
    <span class="bb-outfield">
      <span class="label">SOQLs</span>
        <span>${a.log.soqlCount}</span>
      </span>
    </span>
    <span class="bb-outfield">
      <span class="label">DMLs</span>
        <span>${a.log.dmlCount}</span>
      </span>
    </span>
    <span class="bb-outfield">
      <span class="label">Event#</span>
        <span>${a.log.row}</span>
      </span>
    </span>
  `;return a.log.hasError&&(m+=`
      <span class="bb-outfield">
        <span class="label"></span>
          <span class="text-sm legend-pill" style="background-color: ${h.Error}">Has Error</span>
        </span>
      </span>
     `),n.innerHTML=m,n.style.left=`${t.x+10}px`,n.style.top=`${t.y+10}px`,n.style.display="block",n}let n;function k(){if(O(o.log),c.value=!!o.log.callTree?.length,!c.value)return;const e=d(o.log.callTree[0]),s=document.getElementById(r);n=document.getElementById(i),s.width=F()-10,s.height=(u?.height||800)-100,new W({canvas:s,data:[e],marks:C(),colors:U(y,t=>t.type,t=>t.color),settings:{hotkeys:{active:!0,scrollSpeed:.5,zoomSpeed:.001,fastMultiplayer:5},options:{tooltip:T,timeUnits:"ms"},styles:{main:{backgroundColor:q()?"#262626":"",font:"11px 'Inter var'"},timeframeSelectorPlugin:{backgroundColor1:"var(--bb-surface-color)",font:"9px 'Inter var'"}}}}).on("select",t=>{t?.node?.source?.log})}return(e,s)=>(p(),S(P,null,{default:M(t=>[l("span",{style:{display:"none"},class:D({["height"+t.height]:_(t)})},null,2),l("div",{id:i,class:"bb-debuglog-flame-tooltip flex gap-2"}),l("canvas",{id:f(r)},null,8,j),l("div",null,[l("div",G,[s[0]||(s[0]=l("span",null,"Legend: ",-1)),(p(!0),g(B,null,E(f(y),a=>(p(),g("span",{class:"text-sm legend-pill",style:$({backgroundColor:a.color})},w(a.type),5))),256))])])]),_:1}))}}),ae=Q;export{ae as default};
