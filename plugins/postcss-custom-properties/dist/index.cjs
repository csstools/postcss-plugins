"use strict";var e=require("postcss-value-parser"),t=require("@csstools/cascade-layer-name-parser"),r=require("@csstools/utilities");const o=t.parse("csstools-implicit-layer")[0];function collectCascadeLayerOrder(e){const r=new Map,n=new Map,s=[];e.walkAtRules((e=>{if("layer"!==e.name.toLowerCase())return;{let t=e.parent;for(;t;){if("atrule"!==t.type||"layer"!==t.name.toLowerCase()){if(t===e.root())break;return}t=t.parent}}let a;if(e.nodes)a=normalizeLayerName(e.params,1);else{if(!e.params.trim())return;a=e.params}let i=t.parse(a);if(i?.length){{let t=e.parent;for(;t&&"atrule"===t.type&&"layer"===t.name.toLowerCase();){const e=n.get(t);e?(i=i.map((t=>e.concat(t))),t=t.parent):t=t.parent}}if(t.addLayerToModel(s,i),e.nodes){const t=i[0].concat(o);r.set(e,t),n.set(e,i[0])}}}));for(const e of r.values())t.addLayerToModel(s,[e]);const a=new WeakMap;for(const[e,t]of r)a.set(e,s.findIndex((e=>t.equal(e))));return a}function normalizeLayerName(e,t){return e.trim()?e:"csstools-anon-layer--"+t++}const n=/(!\s*)?postcss-custom-properties:\s*off\b/i,s=new WeakMap;function isBlockIgnored(e){if(!e||!e.nodes)return!1;if(s.has(e))return s.get(e);const t=e.some((e=>isIgnoreComment(e,n)));return s.set(e,t),t}const a=/(!\s*)?postcss-custom-properties:\s*ignore\s+next\b/i;function isDeclarationIgnored(e){return!!e&&(!!isBlockIgnored(e.parent)||isIgnoreComment(e.prev(),a))}function isIgnoreComment(e,t){return!!e&&"comment"===e.type&&t.test(e.text)}const i=new Set(["layer"]);function isProcessableRule(e){let t=e.parent;for(;t;){if("atrule"===t.type&&!i.has(t.name.toLowerCase()))return!1;t=t.parent}return!0}const l=/^html$/i,c=/^:where\(html\)$/i,u=/^:root$/i,p=/^:where\(:root\)$/i,f=/(html|:root)/i,d=/^var$/i;function isVarFunction(e){return"function"===e.type&&d.test(e.value)&&Object(e.nodes).length>0}const w=/\bvar\(/i;function removeCyclicReferences(e,t){const r=new Set;let o=t;for(;e.size>0;)try{toposort(Array.from(e.keys()),o);break}catch(t){if(!t._graphNode)throw t;e.delete(t._graphNode),r.add(t._graphNode),o=o.filter((e=>-1===e.indexOf(t._graphNode)))}return r}function toposort(e,t){let r=e.length;const o=new Array(r),n={};let s=r;const a=makeOutgoingEdges(t),i=makeNodesHash(e);for(;s--;)n[s]||visit(e[s],s,new Set);return o;function visit(e,t,s){if(s.has(e)){const t=new Error("Cyclic dependency"+JSON.stringify(e));throw t._graphNode=e,t}if(!i.has(e))return;if(n[t])return;n[t]=!0;let l=a.get(e)||new Set;if(l=Array.from(l),t=l.length){s.add(e);do{const e=l[--t];visit(e,i.get(e),s)}while(t);s.delete(e)}o[--r]=e}}function makeOutgoingEdges(e){const t=new Map;for(let r=0,o=e.length;r<o;r++){const o=e[r];t.has(o[0])||t.set(o[0],new Set),t.has(o[1])||t.set(o[1],new Set),t.get(o[0]).add(o[1])}return t}function makeNodesHash(e){const t=new Map;for(let r=0,o=e.length;r<o;r++)t.set(e[r],r);return t}function parseOrCached(t,r){let o=r.get(t);return o||(o=e(t),r.set(t,o),o)}function getCustomPropertiesFromRoot(t,r){const o=new Map,n=new Map,s=collectCascadeLayerOrder(t);t.walkRules((e=>{f.test(e.selector)&&e.nodes?.length&&isProcessableRule(e)&&(isBlockIgnored(e)||e.selectors.forEach((t=>{let r=-1;if(c.test(t)||p.test(t))r=0;else if(l.test(t))r=1;else{if(!u.test(t))return;r=2}const a=(f=s,((i=e).parent&&"atrule"===i.parent.type&&"layer"===i.parent.name.toLowerCase()?f.has(i.parent)?f.get(i.parent)+1:0:1e7)+10+r);var i,f;e.each((e=>{if("decl"!==e.type)return;if(!e.variable||isDeclarationIgnored(e))return;if("initial"===e.value.toLowerCase().trim())return;const t=n.get(e.prop)??-1;a>=t&&(n.set(e.prop,a),o.set(e.prop,e.value))}))})))}));const a=[],i=new Map;for(const[t,n]of o.entries()){const o=parseOrCached(n,r);e.walk(o.nodes,(e=>{if(isVarFunction(e)){const[r]=e.nodes.filter((e=>"word"===e.type));a.push([r.value,t])}})),i.set(t,o)}return removeCyclicReferences(i,a),i}function transformValueAST(t,r,o){if(!t.nodes?.length)return"";const n=new Map;return t.nodes.forEach((e=>{n.set(e,t)})),e.walk(t.nodes,(e=>{"nodes"in e&&e.nodes.length&&e.nodes.forEach((t=>{n.set(t,e)}))})),e.walk(t.nodes,(t=>{if(!isVarFunction(t))return;const[s,...a]=t.nodes.filter((e=>"div"!==e.type)),{value:i}=s,l=n.get(t);if(!l)return;const c=l.nodes.indexOf(t);if(-1===c)return;let u=!1;a&&e.walk(a,(e=>{if(isVarFunction(e)){const[t]=e.nodes.filter((e=>"word"===e.type));if(r.has(t.value)||o.has(t.value))return;return u=!0,!1}}));let p=o.get(i)?.nodes??r.get(i)?.nodes;p||!a.length||u||(p=t.nodes.slice(t.nodes.indexOf(a[0]))),void 0!==p&&(p.length?(l.nodes.splice(c,1,...p),l.nodes.forEach((e=>n.set(e,l)))):(l.nodes.splice(c,1,{type:"comment",value:"",sourceIndex:t.sourceIndex,sourceEndIndex:t.sourceEndIndex}),l.nodes.forEach((e=>n.set(e,l)))))}),!0),e.stringify(t.nodes)}function transformProperties(t,r,o,n,s){if(isTransformableDecl(t)&&!isDeclarationIgnored(t)){const n=t.value;let a=transformValueAST(e(n),r,o);const i=new Set;for(;w.test(a)&&!i.has(a);){i.add(a);a=transformValueAST(e(a),r,o)}if(a!==n){if(parentHasExactFallback(t,a))return void(s.preserve||t.remove());if(s.preserve){const e=t.cloneBefore({value:a});hasTrailingComment(e)&&e.raws?.value&&(e.raws.value.value=e.value.replace(v,"$1"),e.raws.value.raw=e.raws.value.value+e.raws.value.raw.replace(v,"$2"))}else t.value=a,hasTrailingComment(t)&&t.raws?.value&&(t.raws.value.value=t.value.replace(v,"$1"),t.raws.value.raw=t.raws.value.value+t.raws.value.raw.replace(v,"$2"))}}}const isTransformableDecl=e=>!e.variable&&e.value.includes("--")&&e.value.toLowerCase().includes("var("),hasTrailingComment=e=>"value"in Object(Object(e.raws).value)&&"raw"in(e.raws?.value??{})&&v.test(e.raws.value?.raw??""),v=/^([\W\w]+)(\s*\/\*[\W\w]+?\*\/)$/;function parentHasExactFallback(e,t){if(!e||!e.parent)return!1;let r=!1;const o=e.parent.index(e);return e.parent.each(((n,s)=>n!==e&&(!(s>=o)&&void("decl"===n.type&&n.prop.toLowerCase()===e.prop.toLowerCase()&&n.value===t&&(r=!0))))),r}const m=/^initial$/i,h=/(?:\bvar\()|(?:\(top: var\(--f\))/i,creator=e=>{const t=!("preserve"in Object(e))||Boolean(e?.preserve);if("importFrom"in Object(e))throw new Error('[postcss-custom-properties] "importFrom" is no longer supported');if("exportTo"in Object(e))throw new Error('[postcss-custom-properties] "exportTo" is no longer supported');return{postcssPlugin:"postcss-custom-properties",prepare:()=>{let e=new Map;const o=new Map;return{Once:t=>{e=getCustomPropertiesFromRoot(t,o)},Declaration:n=>{if(!w.test(n.value))return;if(r.hasSupportsAtRuleAncestor(n,h))return;const s=new Map;t&&n.parent&&n.parent.each((e=>{"decl"===e.type&&e.variable&&n!==e&&(isDeclarationIgnored(e)||(m.test(e.value)?s.delete(e.prop):s.set(e.prop,parseOrCached(e.value,o))))})),transformProperties(n,e,s,0,{preserve:t})}}}}};creator.postcss=!0,module.exports=creator;
