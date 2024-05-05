import{tokenize as e,isTokenWhiteSpaceOrComment as t}from"@csstools/css-tokenizer";const r=/(?:license|copyright)/i,s=/sourceMappingURL/i,o=/(?:\s|\/\*)/,n=/^layer$/i;function minify(r,s){if(!s)return s;if(r.has(s))return r.get(s);const n=s.trim();if(""===n)return r.set(s,""),"";if(!o.test(n))return r.set(s,n),n;const a=e({css:n});let i,c=!1;for(let e=0;e<a.length;e++)i=a[e],t(i)?(i[1]=c?"":" ",c=!0):c=!1;let m="";for(let e=0;e<a.length;e++)m+=a[e][1];return r.set(s,m),m}function removeEmptyNodes(e){if("rule"===e.type){if(0===e.nodes?.length){const t=e.parent;return!!t&&(e.remove(),removeEmptyNodes(t),!0)}}else if("atrule"===e.type&&0===e.nodes?.length&&!n.test(e.name)){const t=e.parent;return!!t&&(e.remove(),removeEmptyNodes(t),!0)}return!1}function setSemicolon(e){if(e.raws.semicolon){const t=e.last;"decl"===t?.type&&t.variable||(e.raws.semicolon=!1)}}const creator=()=>{const e=new Map;return{postcssPlugin:"postcss-minify",OnceExit(t){t.raws.before="",t.raws.after="\n",t.walk((t=>{switch(t.type){case"atrule":if(removeEmptyNodes(t))return;return t.raws.after="",t.raws.afterName=" ",t.raws.before="",t.raws.between="",t.raws.params=void 0,setSemicolon(t),void(t.params=minify(e,t.params));case"rule":if(removeEmptyNodes(t))return;return t.raws.after="",t.raws.before="",t.raws.between="",t.raws.selector=void 0,setSemicolon(t),void(t.selector=minify(e,t.selector));case"decl":return t.prop.startsWith("--")?void(t.raws.before=""):(t.raws.before="",t.raws.between=":",t.raws.important=t.important?"!important":"",t.raws.value=void 0,void(t.value=minify(e,t.value)));case"comment":return t.text.startsWith("!")||r.test(t.text)||s.test(t.text)?void(t.raws.before=""):void t.remove()}}))}}};creator.postcss=!0;export{creator as default};
