"use strict";function e(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var t=e(require("node:fs"));const r=["primary","secondary","grey"],n=e=>{const n={},{dist:s}=e;return t.default.existsSync(s)||t.default.mkdirSync(s,{recursive:!0}),{postcssPlugin:"postcss-generate-variables-file",Rule(e){const{selector:c}=e,o=c.match(/\[theme-pattern=(\w+)\]/);if(!o||!o[1])return;const i=o[1];n[i]||(n[i]={});const u=n[i];e.walkDecls((e=>{const{prop:n,value:c}=e,o=r.find((e=>new RegExp(`^--cp-color-${e}`).test(n)));if(!o)return;const l=n.split("-"),a=l[l.length-1];isNaN(Number(a))||(u[o]||(u[o]={}),u[o][100*Number(a)]=c,t.default.writeFileSync(`${s}/${i}.ts`,function(e){const t=JSON.stringify(e,null,"\t");return`export default ${t.replace(/"/g,"'").replace(/'(\d+)'/g,"$1")}`}(u),{encoding:"utf-8"}))}))},OnceExit(){}}};n.postcss=!0,module.exports=n;
