import{C as h,U as f,bt as _,ct as N,d as p,f as O,p as L,qt as S}from"./vendor-charts-BA6mrMsB.js";import{ic as I}from"./vendor-underscore-Bz5YeRR3.js";import{t as A}from"./Block-5LENspdD.js";import{t as D}from"./AIChat-BFkyw9W4.js";var C=new Set(["SYSTEM_MODE_ENTER","SYSTEM_MODE_EXIT","HEAP_ALLOCATE","HEAP_DEALLOCATE","STATEMENT_EXECUTE","VARIABLE_SCOPE_BEGIN","VARIABLE_ASSIGNMENT","METHOD_ENTRY","METHOD_EXIT","SYSTEM_METHOD_ENTRY","SYSTEM_METHOD_EXIT","CONSTRUCTOR_ENTRY","CONSTRUCTOR_EXIT","ENTERING_MANAGED_PKG"]),M=new Set(["USER_DEBUG","EXCEPTION_THROWN","FATAL_ERROR","DML_BEGIN","DML_END","SOQL_EXECUTE_BEGIN","SOQL_EXECUTE_END","CALLOUT_REQUEST","CALLOUT_RESPONSE","FLOW_ELEMENT_FAULT","FLOW_ELEMENT_ERROR","FLOW_ELEMENT_BEGIN","FLOW_ELEMENT_END","FLOW_BULK_ELEMENT_BEGIN","FLOW_BULK_ELEMENT_END","CODE_UNIT_STARTED","CODE_UNIT_FINISHED","EXECUTION_STARTED","EXECUTION_FINISHED","TRUNCATE_WARNING"]);function T(e){return M.has(e.type)||e.level==="Error"||e.level==="Warn"}function R(e){return C.has(e.type)?!1:T(e)||e.category==="DB"||e.category==="WORKFLOW"||e.category==="CALLOUT"?!0:!!e.unitType}function x(e){const n=e.logName||e.logId||"Unknown",t=e.startTime?I(e.startTime):"-";return[`Log: ${n}`,`Start Time: ${t}`,`Total Entries: ${e.entries.length}`,`Duration (ms): ${e.tet||0}`].join(`
`)}function b(e){return`${e.row||0} | ${e.time||"-"} | ${e.type} | ${e.info||""}`}function v(e,n){if(e.length<=n)return e;const t=e.filter(T);return t.length>=n?t.slice(0,n):[...t,...e.filter(r=>!T(r)).slice(0,n-t.length)]}function U(e,n={}){const t=n.maxChars||12e4,r=n.maxEntries||4e3,a=e.entries.filter(R),o=v(a,r);let s=o.map(b),i=s.join(`
`),E=o.length<a.length;if(i.length>t){E=!0;const c=[];let m=0;for(const g of s){const d=g+`
`;if(m+d.length>t)break;c.push(g),m+=d.length}s=c,i=s.join(`
`)}const l=e.entries.length-s.length,u=E?`

[Trimmed Context] Included ${s.length} relevant entries from ${e.entries.length} total entries to fit AI context limits.`:"";return{text:`${x(e)}

Entries:
${i}${u}`,totalEntries:e.entries.length,includedEntries:s.length,skippedEntries:l,wasTrimmed:E}}var P={class:"text-secondary text-sm mr-sm"},y=h({__name:"DebugLogAI",props:{conn:{},log:{},logText:{}},setup(e){const n=e,t=_([]),r=_(1),a=_("Explain what this debug log is doing and highlight the key bottlenecks, errors, and DML/SOQL behavior."),o=U(n.log,{maxChars:12e4,maxEntries:4e3}),s=p(()=>`${o.includedEntries}/${o.totalEntries} entries`),i=_(`You are a Salesforce Debug Log expert.

You will answer questions strictly based on the provided debug log context.
If the answer cannot be determined from this context, say that clearly and ask for more specific log detail.

When helpful, structure the answer as:
1. Summary
2. Findings (errors, warnings, bottlenecks)
3. Evidence (entry row/time/type references)
4. Actionable recommendations

Debug Log Context:
\`\`\`text
${o.text}
\`\`\`
`);return(E,l)=>(f(),L(A,{class:"bb-debuglog-ai"},{default:N(()=>[(f(),L(D,{systemPrompt:i.value,key:r.value,initialMessages:t.value,sessionPrefix:"debuglog",onMessageAdded:l[0]||(l[0]=u=>t.value.push(u)),initialPrompt:a.value},{"actions-before":N(()=>[O("span",P,"Context: "+S(s.value),1)]),_:1},8,["systemPrompt","initialMessages","initialPrompt"]))]),_:1}))}}),k=y;export{k as default};
