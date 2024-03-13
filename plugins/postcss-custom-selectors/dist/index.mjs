import e from"postcss-selector-parser";import{parse as r,addLayerToModel as t}from"@csstools/cascade-layer-name-parser";const s=r("csstools-implicit-layer")[0];function collectCascadeLayerOrder(e){const o=new Map,n=new Map,a=[];e.walkAtRules((e=>{if("layer"!==e.name.toLowerCase())return;{let r=e.parent;for(;r;){if("atrule"!==r.type||"layer"!==r.name.toLowerCase()){if(r===e.root())break;return}r=r.parent}}let c;if(e.nodes)c=normalizeLayerName(e.params,1);else{if(!e.params.trim())return;c=e.params}let l=r(c);if(l?.length){{let r=e.parent;for(;r&&"atrule"===r.type&&"layer"===r.name.toLowerCase();){const e=n.get(r);e?(l=l.map((r=>e.concat(r))),r=r.parent):r=r.parent}}if(t(a,l),e.nodes){const r=l[0].concat(s);o.set(e,r),n.set(e,l[0])}}}));for(const e of o.values())t(a,[e]);const c=new WeakMap;for(const[e,r]of o)c.set(e,a.findIndex((e=>r.equal(e))));return c}function normalizeLayerName(e,r){return e.trim()?e:"csstools-anon-layer--"+r++}const o=new Set(["scope","container","layer"]);function isProcessableCustomSelectorRule(e){if("atrule"!==e.type)return!1;if("custom-selector"!==e.name.toLowerCase())return!1;if(!e.params||!e.params.includes(":--"))return!1;if(e.nodes&&e.nodes.length>0)return!1;let r=e.parent;for(;r;){if("rule"===r.type)return!1;if("atrule"===r.type&&!o.has(r.name.toLowerCase()))return!1;r=r.parent}return!0}function getCustomSelectors(r,t,s){const o=new Map,n=new Map,a=collectCascadeLayerOrder(r);return r.walkAtRules((r=>{var c,l;if(isProcessableCustomSelectorRule(r))try{const t=r.params.trim(),p=e().astSync(t),u=p?.nodes?.[0]?.nodes?.[0];if(!u||"pseudo"!==u.type||!u.value.startsWith(":--"))return;const i=u.toString(),m=(l=a,(c=r).parent&&"atrule"===c.parent.type&&"layer"===c.parent.name.toLowerCase()?l.has(c.parent)?l.get(c.parent)+1:0:1e7),f=n.get(i)??-1;if(m&&m>=f&&(n.set(i,m),o.set(i,e().astSync(t.slice(i.length).trim()))),!s.preserve){const e=r.parent;r.remove(),removeEmptyAncestorBlocks(e)}}catch(e){r.warn(t,`Failed to parse selector : "${r.params}" with message: "${e instanceof Error?e.message:e}"`)}})),o}function removeEmptyAncestorBlocks(e){if(!e)return;let r=e;for(;r;){if(r.nodes&&r.nodes.length>0)return;const e=r.parent;r.remove(),r=e}}function transformRule(r,t,s){let o=r.selector;try{o=e((r=>{r.walkPseudos((r=>{if(!s.has(r.value))return;const t=e.pseudo({value:":is",nodes:[]}),o=s.get(r.value);o&&(o.each((e=>{t.append(e.clone({}))})),r.replaceWith(t))}))})).processSync(r.selector)}catch(e){return r.warn(t,`Failed to parse selector : "${o}" with message: "${e instanceof Error?e.message:e}"`),r.selector}return o}const creator=e=>{const r=Boolean(Object(e).preserve);if("importFrom"in Object(e))throw new Error('[postcss-custom-selectors] "importFrom" is no longer supported');if("exportTo"in Object(e))throw new Error('[postcss-custom-selectors] "exportTo" is no longer supported');return{postcssPlugin:"postcss-custom-selectors",prepare(){const e=new WeakSet;let t=new Map;return{postcssPlugin:"postcss-custom-selectors",Once(e,{result:s}){t=getCustomSelectors(e,s,{preserve:r})},Rule(s,{result:o}){if(e.has(s))return;if(!s.selector?.includes(":--"))return;const n=transformRule(s,o,t);n!==s.selector&&(e.add(s),s.cloneBefore({selector:n}),r||s.remove())}}}}};creator.postcss=!0;export{creator as default};
