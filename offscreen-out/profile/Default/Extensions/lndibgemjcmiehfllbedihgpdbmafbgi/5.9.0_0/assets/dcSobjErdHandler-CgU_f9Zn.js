function r(n){const i=n.parentFields.map(t=>`${t.fromEntity} }o--|| ${t.toEntity}: ${t.toEntityAttribute}`);return i.push(...n.childFields.map(t=>`${t.fromEntity} ||--o{ ${t.toEntity}: ${t.toEntityAttribute}`)),i}function o(n){return`
erDiagram
   ${r(n).join(`
   `)}
`}function e(n){const i=[];return n.forEach(t=>i.push(...r(t))),`
erDiagram
   ${i.join(`
   `)}
`}export{e as n,o as t};
