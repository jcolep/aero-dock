import{C as w,M as S,U as c,bt as _,ct as m,d as o,f as C,m as b,nt as A,ot as k,p as h,qt as x}from"./vendor-charts-BA6mrMsB.js";import{t as B}from"./Dialog-Da6kly5a.js";import{t as M}from"./AIChat-BFkyw9W4.js";var P={class:"text-secondary text-sm mr-sm"},U=w({__name:"SetupAuditSummaryDialog",props:S({rows:{}},{modelValue:{type:Boolean,required:!0},modelModifiers:{}}),emits:["update:modelValue"],setup(n){const s=A(n,"modelValue"),y=n,i=_(0),u=o(()=>y.rows||[]);function l(a){return`"${String(a??"").replaceAll('"','""').replaceAll("\r"," ").replaceAll(`
`," ")}"`}const g=o(()=>{const a=new Map;return u.value.forEach(e=>{const t=e.CreatedBy?.Name||e["CreatedBy.Name"]||e.CreatedBy?.Username||e["CreatedBy.Username"]||e.CreatedById||"Unknown User",r=String(e.CreatedDate||""),d=`${t}__${r}`,p=a.get(d);p?p.rows.push(e):a.set(d,{user:String(t),time:r,rows:[e]})}),Array.from(a.values()).map(e=>{const t=["action,details"];return e.rows.forEach(r=>{t.push([l(r.Action),l(r.Display)].join(","))}),[`User: ${e.user}`,`Time: ${e.time}`,"```csv",t.join(`
`),"```"].join(`
`)}).join(`

`)}),f=o(()=>`You are an expert Salesforce setup audit analyst.

Your job is to summarize the provided Setup Audit Trail entries for an admin audience.

Requirements:
- Use only the provided audit data.
- Return properly formatted Markdown.
- Each section below is already grouped by user and timestamp.
- Group the analysis by user, by likely transaction, and by changes within each transaction.
- Treat transactions as inferred groupings based on timing, action text, user, and details because Setup Audit Trail does not provide an explicit transaction id in this dataset.
- Call out when a transaction grouping is uncertain.
- Be concise but specific.

Preferred output structure:
## Executive Summary
## By User
## By Transaction
## Changes Within Each Transaction
## Notable Risks or Follow-up Items

Setup Audit grouped entries:
${g.value}
`),v=o(()=>`Summarize these Setup Audit entries using the provided time, action, user, and details fields.

Please:
- group activity by user
- infer likely transactions or change sessions
- list the changes that happened within each transaction
- highlight any repeated patterns, bulk changes, or potentially risky changes
- use the grouped user/time sections as the starting point
- return the result as clean Markdown`);return k(()=>s.value,()=>{s.value&&i.value++}),(a,e)=>(c(),h(B,{modelValue:s.value,"onUpdate:modelValue":e[0]||(e[0]=t=>s.value=t),title:"Setup Audit Summary",width:"1100px",height:"800px",closeMode:"",closeOnEscape:"",helpFeature:"Org Monitor/Setup Audit"},{default:m(()=>[s.value?(c(),h(M,{key:i.value,systemPrompt:f.value,initialPrompt:v.value,autoSendInitialPrompt:!0,sessionPrefix:"setupaudit",emptyMessage:"Review the generated summary and ask follow-up questions about these setup audit entries."},{"actions-before":m(()=>[C("span",P,"Rows: "+x(u.value.length),1)]),_:1},8,["systemPrompt","initialPrompt"])):b("",!0)]),_:1},8,["modelValue"]))}}),T=U;export{T as default};
