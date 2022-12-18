import e from"postcss-selector-parser";import{parse as r,addLayerToModel as t}from"@csstools/cascade-layer-name-parser";const s=r("csstools-implicit-layer")[0];function collectCascadeLayerOrder(e){const o=new Map,a=new Map,n=[];e.walkAtRules((e=>{if("layer"!==e.name.toLowerCase())return;{let r=e.parent;for(;r;){if("atrule"!==r.type||"layer"!==r.name.toLowerCase()){if(r===e.root())break;return}r=r.parent}}let l;if(e.nodes)l=normalizeLayerName(e.params,1);else{if(!e.params.trim())return;l=e.params}let c=r(l,{onParseError(r){throw e.error(r.message)}});{let r=e.parent;for(;r&&"atrule"===r.type&&"layer"===r.name.toLowerCase();){const e=a.get(r);e?(c=c.map((r=>e.concat(r))),r=r.parent):r=r.parent}}if(t(n,c),e.nodes){const r=c[0].concat(s);o.set(e,r),a.set(e,c[0])}}));for(const e of o.values())t(n,[e]);const l=new WeakMap;for(const[e,r]of o)l.set(e,n.findIndex((e=>r.equal(e))));return l}function normalizeLayerName(e,r){return e.trim()?e:"csstools-anon-layer--"+r++}const o=new Set(["scope","container","layer"]);function isProcessableCustomSelectorRule(e){if("atrule"!==e.type)return!1;if("custom-selector"!==e.name.toLowerCase())return!1;if(!e.params||!e.params.includes(":--"))return!1;if(e.nodes&&e.nodes.length>0)return!1;let r=e.parent;for(;r;){if("rule"===r.type)return!1;if("atrule"===r.type&&!o.has(r.name.toLowerCase()))return!1;r=r.parent}return!0}function getCustomSelectors(r,t,s){const o=new Map,a=new Map,n=collectCascadeLayerOrder(r);return r.walkAtRules((r=>{var l,c;if(isProcessableCustomSelectorRule(r))try{var p,u,i;const t=r.params.trim(),m=e().astSync(t),f=null==m||null==(p=m.nodes)||null==(u=p[0])||null==(i=u.nodes)?void 0:i[0];if(!f||"pseudo"!==f.type||!f.value.startsWith(":--"))return;const d=f.toString(),y=(c=n,(l=r).parent&&"atrule"===l.parent.type&&"layer"===l.parent.name.toLowerCase()?c.has(l.parent)?c.get(l.parent):-1:1/0);if(y>=(a.get(d)??-1)&&(a.set(d,y),o.set(d,e().astSync(t.slice(d.length).trim()))),!s.preserve){const e=r.parent;r.remove(),removeEmptyAncestorBlocks(e)}}catch(e){r.warn(t,`Failed to parse custom selector : "${r.params}" with message: "${e.message}"`)}})),o}function removeEmptyAncestorBlocks(e){let r=e;for(;r;){if(r.nodes&&r.nodes.length>0)return;const e=r.parent;r.remove(),r=e}}var transformRule=(r,t,s,o)=>{let a=r.selector;try{a=e((r=>{r.walkPseudos((r=>{if(!s.has(r.value))return;const t=e.pseudo({value:":is",nodes:[]});s.get(r.value).each((e=>{t.append(e.clone({}))})),r.replaceWith(t)}))})).processSync(r.selector)}catch(e){return void r.warn(t,`Failed to parse selector : "${a}" with message: "${e.message}"`)}a!==r.selector&&(r.cloneBefore({selector:a}),o.preserve||r.remove())};const creator=e=>{const r=Boolean(Object(e).preserve);if("importFrom"in Object(e))throw new Error('[postcss-custom-selectors] "importFrom" is no longer supported');if("exportTo"in Object(e))throw new Error('[postcss-custom-selectors] "exportTo" is no longer supported');return{postcssPlugin:"postcss-custom-selectors",prepare(){let e=new Map;return{Once:(t,{result:s})=>{e=getCustomSelectors(t,s,{preserve:r})},Rule:(t,{result:s})=>{t.selector.includes(":--")&&transformRule(t,s,e,{preserve:r})}}}}};creator.postcss=!0;export{creator as default};
