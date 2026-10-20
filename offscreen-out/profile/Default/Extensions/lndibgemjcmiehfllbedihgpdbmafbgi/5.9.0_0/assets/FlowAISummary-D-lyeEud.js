import{C as p,U as r,bt as n,d as a,m as d,ot as f,p as l}from"./vendor-charts-BA6mrMsB.js";import{Qu as c}from"./vendor-underscore-Bz5YeRR3.js";import{t as w}from"./Message2-BnGtoJYT.js";import{t as h}from"./AIChat-BFkyw9W4.js";import{t as y}from"./flowDetailsBuilder-WqG9RgxL.js";var v=p({__name:"FlowAISummary",props:{conn:{},flow:{}},setup(i){const e=i,o=n(""),s=n(0),t=a(()=>!!e.flow?.Metadata),u=a(()=>t.value?`You are an expert Salesforce Flow analyst.

Your job is to help the user understand this flow, starting with a concise summary of what it does, how it is structured, and any notable risks or implementation details.

After the initial summary, stay in conversation and answer follow-up questions about the flow using the provided flow metadata. If the answer is not directly supported by the metadata, say so clearly.

Be factual, specific, and organized in Markdown with headings and bullet points when useful.

Flow metadata for this conversation:

\`\`\`json
${c(y(e.flow.Metadata))}
\`\`\``:""),m=a(()=>t.value?`Analyze this Salesforce Flow "${e.flow.Metadata.label}" and provide a concise summary of:
- the flow's purpose
- the main entry criteria and path branches
- any record operations, decisions, loops, subflows, or screens
- any risks, assumptions, or implementation details a Salesforce admin should know

Then keep the conversation open so I can ask follow-up questions about the flow.`:"");return f(()=>e.flow,()=>{t.value&&s.value++},{immediate:!0}),(_,b)=>o.value?(r(),l(w,{key:0,message:o.value},null,8,["message"])):t.value?(r(),l(h,{key:s.value,class:"pl-2 pr-md",systemPrompt:u.value,initialPrompt:m.value,autoSendInitialPrompt:!0,sessionPrefix:"flow",emptyMessage:"Ask follow-up questions about this flow after the initial analysis is generated."},null,8,["systemPrompt","initialPrompt"])):d("",!0)}}),I=v;export{I as default};
