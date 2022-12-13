"use strict";var e=require("postcss-value-parser");function collectCascadeLayerOrder(e){const r=new Map,t=new Map,o=[];e.walkAtRules((e=>{if("layer"!==e.name.toLowerCase())return;{let r=e.parent;for(;r;){if("atrule"!==r.type||"layer"!==r.name.toLowerCase()){if(r===e.root())break;return}r=r.parent}}let s=[];if(e.nodes)s.push((n=e.params,a=1,n.trim()||"csstools-anon-layer--"+a++));else{if(!e.params.trim())return;s=e.params.split(",").map((e=>e.trim()))}var n,a;{let r=e.parent;for(;r&&"atrule"===r.type&&"layer"===r.name.toLowerCase();){const e=t.get(r);e?(s=s.map((r=>e+"."+r)),r=r.parent):r=r.parent}}if(addLayerToModel(o,s),e.nodes){const o=s[0]+".csstools-implicit-layer";r.set(e,o),t.set(e,s[0])}}));for(const e of r.values())addLayerToModel(o,[e]);const s=o.map((e=>e.join("."))),n=new WeakMap;for(const[e,t]of r)n.set(e,s.indexOf(t));return n}function cascadeLayerNumberForNode(e,r){return e.parent&&"atrule"===e.parent.type&&"layer"===e.parent.name.toLowerCase()?r.has(e.parent)?r.get(e.parent):-1:1/0}function addLayerToModel(e,r){return r.forEach((r=>{const t=r.split(".");e:for(let r=0;r<t.length;r++){const o=t.slice(0,r+1);let s=-1,n=0;for(let r=0;r<e.length;r++){const t=e[r];let a=0;r:for(let e=0;e<t.length;e++){const r=t[e],s=o[e];if(s===r&&e+1===o.length)continue e;if(s!==r){if(s!==r)break r}else a++}a>=n&&(s=r,n=a)}-1===s?e.push(o):e.splice(s+1,0,o)}})),e}const r=/(!\s*)?postcss-custom-properties:\s*off\b/i,t=new WeakMap;function isBlockIgnored(e){if(!e||!e.nodes)return!1;if(t.has(e))return t.get(e);const o=e.some((e=>isIgnoreComment(e,r)));return t.set(e,o),o}const o=/(!\s*)?postcss-custom-properties:\s*ignore\s+next\b/i;function isDeclarationIgnored(e){return!!e&&(!!isBlockIgnored(e.parent)||isIgnoreComment(e.prev(),o))}function isIgnoreComment(e,r){return e&&"comment"===e.type&&r.test(e.text)}const s=new Set(["layer"]);function isProcessableRule(e){if(!isHtmlRule(e)&&!isRootRule(e))return!1;let r=e.parent;for(;r;){if("atrule"===r.type&&!s.has(r.name.toLowerCase()))return!1;r=r.parent}return!0}const n=/^html$/i,a=/^:root$/i;function isHtmlRule(e){return e.selectors.some((e=>n.test(e)))&&e.nodes&&e.nodes.length}function isRootRule(e){return e.selectors.some((e=>a.test(e)))&&e.nodes&&e.nodes.length}function getCustomPropertiesFromRoot(r){const t=new Map,o=new Map,s=new Map,n=new Map,a=new Map,l=collectCascadeLayerOrder(r);r.walkRules((e=>{isProcessableRule(e)&&(isBlockIgnored(e)||(isHtmlRule(e)?e.each((e=>{if("decl"!==e.type)return;if(!e.variable||isDeclarationIgnored(e))return;if("initial"===e.value.toLowerCase().trim())return;const r=cascadeLayerNumberForNode(e,l);r>=(n.get(e.prop)??-1)&&(n.set(e.prop,r),t.set(e.prop,e.value))})):isRootRule(e)&&e.each((e=>{if("decl"!==e.type)return;if(!e.variable||isDeclarationIgnored(e))return;if("initial"===e.value.toLowerCase().trim())return;const r=cascadeLayerNumberForNode(e,l);r>=(a.get(e.prop)??-1)&&(a.set(e.prop,r),o.set(e.prop,e.value))}))))}));for(const[e,r]of t.entries())s.set(e,r);for(const[e,r]of o.entries())s.set(e,r);const i=new Map;for(const[r,t]of s.entries())i.set(r,e(t));return i}function transformValueAST(e,r){return e.nodes&&e.nodes.length&&e.nodes.slice().forEach((t=>{if(isVarFunction(t)){const[o,...s]=t.nodes.filter((e=>"div"!==e.type)),{value:n}=o,a=e.nodes.indexOf(t);if(r.has(n)){const t=r.get(n).nodes;reTransformValueAST({nodes:t},r,n),a>-1&&e.nodes.splice(a,1,...t)}else s.length&&(a>-1&&e.nodes.splice(a,1,...t.nodes.slice(t.nodes.indexOf(s[0]))),transformValueAST(e,r))}else transformValueAST(t,r)})),e.toString()}function reTransformValueAST(e,r,t){const o=new Map(r);return o.delete(t),transformValueAST(e,o)}const l=/^var$/i,isVarFunction=e=>"function"===e.type&&l.test(e.value)&&Object(e.nodes).length>0;var transformProperties=(r,t,o)=>{if(isTransformableDecl(r)&&!isDeclarationIgnored(r)){const s=r.value;let n=transformValueAST(e(s),t);const a=new Set;for(;n.includes("--")&&n.toLowerCase().includes("var(")&&!a.has(n);){a.add(n);n=transformValueAST(e(n),t)}if(n!==s){if(parentHasExactFallback(r,n))return void(o.preserve||r.remove());if(o.preserve){const e=r.cloneBefore({value:n});hasTrailingComment(e)&&(e.raws.value.value=e.value.replace(i,"$1"),e.raws.value.raw=e.raws.value.value+e.raws.value.raw.replace(i,"$2"))}else r.value=n,hasTrailingComment(r)&&(r.raws.value.value=r.value.replace(i,"$1"),r.raws.value.raw=r.raws.value.value+r.raws.value.raw.replace(i,"$2"))}}};const isTransformableDecl=e=>!e.variable&&e.value.includes("--")&&e.value.toLowerCase().includes("var("),hasTrailingComment=e=>"value"in Object(Object(e.raws).value)&&"raw"in e.raws.value&&i.test(e.raws.value.raw),i=/^([\W\w]+)(\s*\/\*[\W\w]+?\*\/)$/;function parentHasExactFallback(e,r){if(!e||!e.parent)return!1;let t=!1;const o=e.parent.index(e);return e.parent.each(((s,n)=>s!==e&&(!(n>=o)&&void("decl"===s.type&&s.prop.toLowerCase()===e.prop.toLowerCase()&&s.value===r&&(t=!0))))),t}const creator=r=>{const t=!("preserve"in Object(r))||Boolean(r.preserve);if("importFrom"in Object(r))throw new Error('[postcss-custom-properties] "importFrom" is no longer supported');if("exportTo"in Object(r))throw new Error('[postcss-custom-properties] "exportTo" is no longer supported');return{postcssPlugin:"postcss-custom-properties",prepare:()=>{let r=new Map;return{Once:e=>{r=getCustomPropertiesFromRoot(e)},Declaration:o=>{let s=r;if(t&&o.parent){let t=!1;o.parent.each((n=>{o!==n&&"decl"===n.type&&n.variable&&!isDeclarationIgnored(n)&&(t||(s=new Map(r),t=!0),"initial"!==n.value.toLowerCase().trim()?s.set(n.prop,e(n.value)):s.delete(n.prop))}))}transformProperties(o,s,{preserve:t})}}}}};creator.postcss=!0,module.exports=creator;
