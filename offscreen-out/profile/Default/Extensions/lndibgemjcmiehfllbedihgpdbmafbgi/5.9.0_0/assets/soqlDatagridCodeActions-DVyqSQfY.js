import{Ks as d,Oo as o,Ou as c,To as $,Uc as s,_l as u,ad as p,jl as g,lu as I}from"./vendor-underscore-Bz5YeRR3.js";function T(r,n,a){let e=n==="Id"?r._Id||r._id||r.Id||r.id:s(r,n);return a==="Boolean"?g(e):u(e)?"null":$(a)?e:a==="Date"?`Date.valueOf('${e}')`:a==="DateTime"?`(DateTime) JSON.deserialize('"${e}"', Datetime.class)`:(o(a)&&(e=I(e,`
`,"\\n")),p(e))}function m(r,n,a){if(a==="delete")return d(n.label,"Id");const e=n.label||n.field;return e?a==="insert"?!(!n.props?.createable||u(s(r,e))):n.props?.updateable||n.label==="Id":!1}function D(r,n,a,e,t=5){return`new ${r}(${c(a.filter(l=>m(n,l,e)).map(l=>`${l.label||l.field} = ${T(n,l.label||l.field,l.props?.typeDerived)}`),t).map(l=>l.join(", ")).join(`,
    `)})`}async function x(r,n,a,e,t=5){const l=n.map(f=>D(r,f,a,e,t));let i="";return l.length===1?i=`${r} record = ${l[0]};

${e} record;
`:i=`List<${r}> records = new List<${r}>{
  ${l.join(`,${a.length<=5||e==="delete"?`
`:`

`}  `)}
};

${e} records;
`,i}export{x as t};
