"use strict";var e=require("path"),r=require("fs");function parseImport(s,t,a,n){var o;let l="";if(a.startsWith("node_modules://"))try{l=require.resolve(a.slice(15),{paths:[e.dirname(a)]})}catch(e){throw new Error(`Failed to read ${a} with error ${e.message}`)}else l=e.resolve(a);if(n.has(l))return!1;n.add(l),t.result.messages.push({type:"dependency",plugin:"postcss-global-data",file:l,parent:null==(o=s.source)||null==(o=o.input)?void 0:o.file});const i=r.readFileSync(l,"utf8");return t.postcss.parse(i,{from:l})}const creator=e=>{const r=Object.assign({files:[]},e);return{postcssPlugin:"postcss-global-data",prepare(){let e=new Set,s=new Set;return{Once:(t,a)=>{r.files.forEach((r=>{if(e.has(r))return;const n=parseImport(t,a,r,e);n&&n.each((e=>{t.append(e),s.add(e)}))}))},OnceExit:()=>{s.forEach((e=>{e.remove()})),s=new Set,e=new Set}}}}};creator.postcss=!0,module.exports=creator;
