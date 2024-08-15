import{tokenizer as e,isTokenWhiteSpaceOrComment as r}from"@csstools/css-tokenizer";const t=/license|copyright|sourcemappingurl/i,s=/\s|\/\*/,o=/^layer$/i;function minify(t,o){if(!o)return o;if(t.has(o))return t.get(o);const n=o.trim();if(""===n)return t.set(o,""),"";if(!s.test(n))return t.set(o,n),n;let a=!1,i="";const c=e({css:n});for(;!c.endOfFile();){const e=c.nextToken();r(e)?(e[1]=a?"":" ",a=!0):a=!1,i+=e[1]}return t.set(o,i),i}function removeEmptyNodes(e){if("rule"===e.type){if(0===e.nodes?.length){const r=e.parent;return!!r&&(e.remove(),removeEmptyNodes(r),!0)}}else if("atrule"===e.type&&0===e.nodes?.length&&!o.test(e.name)){const r=e.parent;return!!r&&(e.remove(),removeEmptyNodes(r),!0)}return!1}function setSemicolon(e){if(!e.raws.semicolon)return;const r=e.last;"decl"===r?.type&&r.variable||(e.raws.semicolon=!1)}const creator=()=>{const e=new Map;return{postcssPlugin:"postcss-minify",OnceExit(r){r.raws.before="",r.raws.after="\n",r.walk((r=>{switch(r.type){case"atrule":if(removeEmptyNodes(r))return;return r.raws.after="",r.raws.afterName=" ",r.raws.before="",r.raws.between="",r.raws.params=void 0,setSemicolon(r),void(r.params=minify(e,r.params));case"rule":if(removeEmptyNodes(r))return;return r.raws.after="",r.raws.before="",r.raws.between="",r.raws.selector=void 0,setSemicolon(r),void(r.selector=minify(e,r.selector));case"decl":return r.prop.startsWith("--")?void(r.raws.before=""):(r.raws.before="",r.raws.between=":",r.raws.important=r.important?"!important":"",r.raws.value=void 0,void(r.value=minify(e,r.value)));case"comment":return r.text.startsWith("!")||t.test(r.text)?void(r.raws.before=""):void r.remove()}}))}}};creator.postcss=!0;export{creator as default};
