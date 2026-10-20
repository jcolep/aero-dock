import{C as P,M as Y,U as f,bt as r,ct as v,f as F,h as W,m as k,nt as H,ot as V,p as q,x as m,xt as K}from"./vendor-charts-BA6mrMsB.js";import{Od as G,Wp as A,il as O,rt as J,sp as M,vt as X}from"./vendor-underscore-Bz5YeRR3.js";import{t as Z}from"./Message2-BnGtoJYT.js";import{t as ee}from"./Button-Ch4v2GDk.js";import{t as te}from"./Dialog-Da6kly5a.js";import{t as ae}from"./disposables-BP06IWsY.js";import{t as oe}from"./AutoHeightBlock-BUkX-tUq.js";import{t as se}from"./SoqlDatagrid-BOhBIFI0.js";import{t as re}from"./InputMultiSelect2-CzTrO1pT.js";import{t as ne}from"./AIChat-BFkyw9W4.js";var le=P({__name:"SoqlDatagridDialog",props:Y({conn:{},query:{}},{modelValue:{type:Boolean,required:!0},modelModifiers:{}}),emits:["update:modelValue"],setup(i){const l=H(i,"modelValue");V(()=>l.value,()=>l.value?d():void 0);async function d(){}return(S,n)=>(f(),q(te,{modelValue:l.value,title:"Query Records",onClose:n[0]||(n[0]=u=>l.value=!1),width:"90vw",height:"90vw",closeOnEscape:"",closeMode:""},{body:v(u=>[m(oe,{maxBotto:u.maxBottom},{default:v(s=>[l.value?(f(),q(se,{key:0,conn:i.conn,query:i.query,mode:"TopQuery",options:{},height:s.height},null,8,["conn","query","height"])):k("",!0)]),_:1},8,["maxBotto"])]),_:1},8,["modelValue"]))}}),ie=le,ue={class:"query-ai-container p-md"},I="query-ai-context-global",ce=100,N=250,me=P({__name:"QueryAI",props:{conn:{},getInitialQuery:{}},emits:["execute"],setup(i,{emit:l}){const d=ae(),S=l,n=i,u=r(""),s=r([]),p=r(""),g=K([]),h=r(0),b=r(!1),x=r(""),c=r([]),j=r(""),w=r(!1);let C=0;d.add(M(n.conn,"markdownCodeSoqlViewRecords",t=>{x.value=t.data.soql,b.value=!0})),d.add(M(n.conn,"markdownCodeSoqlExecuteQuery",t=>{S("execute",{oper:"executeQuery",param:{mode:"TopQuery",query:t.data.soql}})})),V(()=>s.value,async()=>{w.value&&(await _(),await y())},{deep:!0}),B();async function B(){try{u.value="",p.value="";const[t,e]=await Promise.all([X(n.conn),E()]);g.value=t.sobjects.filter(o=>["Standard Data","Custom Data","Package Data","Metadata","Tooling"].includes(o.category)).map(o=>({label:o.name,value:o.name}));const a=new Set(g.value.map(o=>o.value));s.value=(e?.sobjNames||[]).filter(o=>a.has(o)),c.value=R(e?.messages||[]),c.value.length||(p.value=await D()),await _(),await y()}catch(t){u.value=t?.message||"Error loading Query AI"}finally{w.value=!0,h.value++}}async function _(){const t=++C;let e=`You are an expert Salesforce SOQL query analyst and generator.

Your task is to:
1. Analyze the user's request and selected Salesforce objects (if provided)
2. Generate an appropriate SOQL query based on the requirements

For query generation:
- Include relevant fields for the selected objects
- Use proper SOQL syntax
- Add appropriate WHERE clauses, ORDER BY, LIMIT as needed
- Consider relationships and joins when relevant
- Follow Salesforce best practices
- Always format the SOQL for readability

IMPORTANT: When you generate a SOQL query, wrap it in triple backticks with "soql" language identifier.
`;if(s.value.length){const a=await Promise.all(s.value.map(o=>T(o)));if(t!==C)return;e+=`
Selected Salesforce object metadata:

${a.join(`

`)}`}j.value=e}async function T(t){try{const e=(await J(n.conn,t)).fields||[],a=e.slice(0,N),o=e.length>a.length;return`Object: ${t}
\`\`\`csv
ApiName,DataType
${a.map(Q=>`${Q.name},${Q.typeDerived}`).join(`
`)}
\`\`\`
${o?`Note: Only first ${N} fields shown out of ${e.length}.`:""}`}catch(e){return`Object: ${t}
Metadata unavailable: ${e?.message||"Unknown error"}.`}}function $(t){c.value.push(t),y()}async function L(){c.value=[],p.value=await D(),h.value++,await y()}async function D(){const t=n.getInitialQuery?.();if(t&&!O(t))return`Analyze this SOQL query:

${t.trim()}`;try{const e=await G();if(e&&!O(e)&&["select","from","where","order by","group by","having","limit"].some(a=>e.toLowerCase().includes(a)))return""}catch{}return""}async function E(){const t=await A().get(I);if(!(!t||typeof t!="object"))return{sobjNames:Array.isArray(t.sobjNames)?t.sobjNames.filter(e=>typeof e=="string"):[],messages:Array.isArray(t.messages)?t.messages:[]}}function R(t){return t.map(e=>{if(!e||e.role!=="user"&&e.role!=="assistant"||typeof e.content!="string")return;const a=new Date(e.timestamp);return{role:e.role,content:e.content,timestamp:Number.isNaN(a.getTime())?new Date:a}}).filter(e=>!!e)}function U(t){return t.role==="user"||t.role==="assistant"}async function y(){const t={sobjNames:[...s.value],messages:c.value.filter(U).slice(-ce).map(e=>({role:e.role,content:e.content,timestamp:z(e.timestamp)}))};await A().set(I,t)}function z(t){const e=t instanceof Date?t:new Date(t);return Number.isNaN(e.getTime())?new Date().toISOString():e.toISOString()}return(t,e)=>(f(),W("div",ue,[m(Z,{message:u.value},null,8,["message"]),w.value?(f(),q(ne,{class:"query-ai-chat",systemPrompt:j.value,initialPrompt:p.value,key:h.value,initialMessages:c.value,sessionPrefix:"query",emptyMessage:"Type your request below to either create a new query or explain one. You can select one or more objects to feed metadata into AI.",onMessageAdded:$},{"actions-before":v(()=>[e[2]||(e[2]=F("span",{class:"mr-sm"},"Objects",-1)),m(re,{modelValue:s.value,"onUpdate:modelValue":e[0]||(e[0]=a=>s.value=a),options:g.value,width:"320px",placeholder:"Select Objects",class:"mr-sm"},null,8,["modelValue","options"])]),"actions-after":v(()=>[m(ee,{label:"New Chat",severity:"secondary",size:"small",onClick:L})]),_:1},8,["systemPrompt","initialPrompt","initialMessages"])):k("",!0),m(ie,{conn:i.conn,query:x.value,modelValue:b.value,"onUpdate:modelValue":e[1]||(e[1]=a=>b.value=a)},null,8,["conn","query","modelValue"])]))}}),Se=me;export{Se as default};
