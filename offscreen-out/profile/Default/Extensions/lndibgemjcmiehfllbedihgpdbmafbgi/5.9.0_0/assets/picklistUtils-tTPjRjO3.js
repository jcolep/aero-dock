import{Cu as r,Eu as u,Iu as o,Jl as t,Ps as v,lu as f,nc as c}from"./vendor-underscore-Bz5YeRR3.js";function d(a){return f(c({fields:["value","label"],records:(a||[]).map(e=>({value:e.value,label:e.value===e.label?null:e.label}))},{hasHeader:!1}),`\r
`,`
`).split(`
`).map(e=>e.endsWith(",")?o(e,","):e).join(`
`)}function n(a){return v(t(`value,label
${a}`).records,e=>e.value)}function p(a,e){let l=n(a);return e=="value-az"?l=r(l,"value"):e=="value-za"?l=u(l,"value"):e=="label-az"?l=r(l,"label"):e=="label-za"&&(l=u(l,"label")),d(l)}function b(a){const e=n(a.values).map(s=>({fullName:s.value,label:s.label||s.value,default:!1})),l={sorted:a.orderAlphabetically,value:a.orderAlphabetically?r(e,"fullName"):e};return a.useFirstValueAsDefault&&(l.value[0].default=!0),l}export{p as i,n,d as r,b as t};
