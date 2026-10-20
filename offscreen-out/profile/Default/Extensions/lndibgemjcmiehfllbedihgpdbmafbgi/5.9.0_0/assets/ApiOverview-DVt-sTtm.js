import{C as y,U as o,Ut as q,bt as $,f as m,h as u,m as f,ot as C,p as v,qt as p,x as k}from"./vendor-charts-BA6mrMsB.js";import{Ks as _}from"./vendor-underscore-Bz5YeRR3.js";import{t as g}from"./_plugin-vue_export-helper-DvKAVYQk.js";import{t as w}from"./Empty-B2J5N0LX.js";import{t as x}from"./apiHandler-CDN4rC0N.js";import{t as I}from"./MarkdownViewer-CEn-22hq.js";var V=y({__name:"HttpMethodTag",props:{method:{}},setup(t){return(c,n)=>(o(),u("span",{class:q(["http-method-tag",`method-${t.method.toLowerCase()}`])},p(t.method.toUpperCase()),3))}}),b=g(V,[["__scopeId","data-v-ef751fd1"]]),B={key:0,class:"api-overview-header"},E={class:"api-method-path"},H={class:"api-path font-mono"},N={key:0},T=y({__name:"ApiOverview",props:{request:{},height:{}},setup(t){const c=t,n=$("");C(()=>c.request,h),h();async function h(){const a=c.request;let s=`${a.description||""}
  `;const i=a.query||[];(a.queryInfos||[]).forEach(e=>{let r=i.find(l=>_(l.name,e.name));r?r.description=e.description:i.push({name:e.name,description:e.description,value:""})}),i.length&&(s+=`
### Query
| Name | Value | Description |
| :------ | :----------- |:-----|
${i.map(e=>`|${e.name}|${e.value||""}|${e.description||""}|`).join(`
`)}
`);const d=a.headers||[];if((a.headerInfos||[]).forEach(e=>{let r=d.find(l=>_(l.name,e.name));r?r.description=e.description:d.push({name:e.name,description:e.description,value:""})}),d.length&&(s+=`
### Headers
| Name | Value | Description |
| :------ | :----------- |:-----|
${d.map(e=>`|${e.name}|${e.value||""}|${e.description||""}|`).join(`
`)}
`),a.body&&(s+=`
### Body
\`\`\`json
${a.body}
  \`\`\`
`),a.responses?.length)for(const e of a.responses)s+=`
### Response: ${e.name}
${e.statusCode} ${x[e.statusCode]}
\`\`\`json
${e.body}
  \`\`\`
`;n.value=s}return(a,s)=>(o(),u("div",null,[t.request?(o(),u("div",B,[m("h2",null,p(t.request.name),1),m("div",E,[k(b,{method:t.request.method||"GET"},null,8,["method"]),m("span",H,p(t.request.path),1)]),t.request.description?(o(),u("p",N,p(t.request.description),1)):f("",!0)])):f("",!0),n.value?(o(),v(I,{key:1,class:"px-1",text:n.value,height:t.height},null,8,["text","height"])):(o(),v(w,{key:2,message:"There is no documentation for this API"}))]))}}),S=g(T,[["__scopeId","data-v-4adddabf"]]);export{b as n,S as t};
