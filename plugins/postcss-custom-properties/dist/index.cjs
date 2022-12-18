"use strict";var e=require("postcss-value-parser"),r=require("@csstools/cascade-layer-name-parser");const t=r.parse("csstools-implicit-layer")[0];function collectCascadeLayerOrder(e){const o=new Map,a=new Map,s=[];e.walkAtRules((e=>{if("layer"!==e.name.toLowerCase())return;{let r=e.parent;for(;r;){if("atrule"!==r.type||"layer"!==r.name.toLowerCase()){if(r===e.root())break;return}r=r.parent}}let n;if(e.nodes)n=normalizeLayerName(e.params,1);else{if(!e.params.trim())return;n=e.params}let l=r.parse(n,{onParseError(r){throw e.error(r.message)}});{let r=e.parent;for(;r&&"atrule"===r.type&&"layer"===r.name.toLowerCase();){const e=a.get(r);e?(l=l.map((r=>e.concat(r))),r=r.parent):r=r.parent}}if(r.addLayerToModel(s,l),e.nodes){const r=l[0].concat(t);o.set(e,r),a.set(e,l[0])}}));for(const e of o.values())r.addLayerToModel(s,[e]);const n=new WeakMap;for(const[e,r]of o)n.set(e,s.findIndex((e=>r.equal(e))));return n}function cascadeLayerNumberForNode(e,r){return e.parent&&"atrule"===e.parent.type&&"layer"===e.parent.name.toLowerCase()?r.has(e.parent)?r.get(e.parent):-1:1/0}function normalizeLayerName(e,r){return e.trim()?e:"csstools-anon-layer--"+r++}const o=/(!\s*)?postcss-custom-properties:\s*off\b/i,a=new WeakMap;function isBlockIgnored(e){if(!e||!e.nodes)return!1;if(a.has(e))return a.get(e);const r=e.some((e=>isIgnoreComment(e,o)));return a.set(e,r),r}const s=/(!\s*)?postcss-custom-properties:\s*ignore\s+next\b/i;function isDeclarationIgnored(e){return!!e&&(!!isBlockIgnored(e.parent)||isIgnoreComment(e.prev(),s))}function isIgnoreComment(e,r){return e&&"comment"===e.type&&r.test(e.text)}const n=new Set(["layer"]);function isProcessableRule(e){if(!isHtmlRule(e)&&!isRootRule(e))return!1;let r=e.parent;for(;r;){if("atrule"===r.type&&!n.has(r.name.toLowerCase()))return!1;r=r.parent}return!0}const l=/^html$/i,i=/^:root$/i;function isHtmlRule(e){return e.selectors.some((e=>l.test(e)))&&e.nodes&&e.nodes.length}function isRootRule(e){return e.selectors.some((e=>i.test(e)))&&e.nodes&&e.nodes.length}function getCustomPropertiesFromRoot(r){const t=new Map,o=new Map,a=new Map,s=new Map,n=new Map,l=collectCascadeLayerOrder(r);r.walkRules((e=>{isProcessableRule(e)&&(isBlockIgnored(e)||(isHtmlRule(e)?e.each((e=>{if("decl"!==e.type)return;if(!e.variable||isDeclarationIgnored(e))return;if("initial"===e.value.toLowerCase().trim())return;const r=cascadeLayerNumberForNode(e,l);r>=(s.get(e.prop)??-1)&&(s.set(e.prop,r),t.set(e.prop,e.value))})):isRootRule(e)&&e.each((e=>{if("decl"!==e.type)return;if(!e.variable||isDeclarationIgnored(e))return;if("initial"===e.value.toLowerCase().trim())return;const r=cascadeLayerNumberForNode(e,l);r>=(n.get(e.prop)??-1)&&(n.set(e.prop,r),o.set(e.prop,e.value))}))))}));for(const[e,r]of t.entries())a.set(e,r);for(const[e,r]of o.entries())a.set(e,r);const i=new Map;for(const[r,t]of a.entries())i.set(r,e(t));return i}function transformValueAST(e,r){return e.nodes&&e.nodes.length&&e.nodes.slice().forEach((t=>{if(isVarFunction(t)){const[o,...a]=t.nodes.filter((e=>"div"!==e.type)),{value:s}=o,n=e.nodes.indexOf(t);if(r.has(s)){const t=r.get(s).nodes;reTransformValueAST({nodes:t},r,s),n>-1&&e.nodes.splice(n,1,...t)}else a.length&&(n>-1&&e.nodes.splice(n,1,...t.nodes.slice(t.nodes.indexOf(a[0]))),transformValueAST(e,r))}else transformValueAST(t,r)})),e.toString()}function reTransformValueAST(e,r,t){const o=new Map(r);return o.delete(t),transformValueAST(e,o)}const c=/^var$/i,isVarFunction=e=>"function"===e.type&&c.test(e.value)&&Object(e.nodes).length>0;var transformProperties=(r,t,o)=>{if(isTransformableDecl(r)&&!isDeclarationIgnored(r)){const a=r.value;let s=transformValueAST(e(a),t);const n=new Set;for(;s.includes("--")&&s.toLowerCase().includes("var(")&&!n.has(s);){n.add(s);s=transformValueAST(e(s),t)}if(s!==a){if(parentHasExactFallback(r,s))return void(o.preserve||r.remove());if(o.preserve){const e=r.cloneBefore({value:s});hasTrailingComment(e)&&(e.raws.value.value=e.value.replace(u,"$1"),e.raws.value.raw=e.raws.value.value+e.raws.value.raw.replace(u,"$2"))}else r.value=s,hasTrailingComment(r)&&(r.raws.value.value=r.value.replace(u,"$1"),r.raws.value.raw=r.raws.value.value+r.raws.value.raw.replace(u,"$2"))}}};const isTransformableDecl=e=>!e.variable&&e.value.includes("--")&&e.value.toLowerCase().includes("var("),hasTrailingComment=e=>"value"in Object(Object(e.raws).value)&&"raw"in e.raws.value&&u.test(e.raws.value.raw),u=/^([\W\w]+)(\s*\/\*[\W\w]+?\*\/)$/;function parentHasExactFallback(e,r){if(!e||!e.parent)return!1;let t=!1;const o=e.parent.index(e);return e.parent.each(((a,s)=>a!==e&&(!(s>=o)&&void("decl"===a.type&&a.prop.toLowerCase()===e.prop.toLowerCase()&&a.value===r&&(t=!0))))),t}const creator=r=>{const t=!("preserve"in Object(r))||Boolean(r.preserve);if("importFrom"in Object(r))throw new Error('[postcss-custom-properties] "importFrom" is no longer supported');if("exportTo"in Object(r))throw new Error('[postcss-custom-properties] "exportTo" is no longer supported');return{postcssPlugin:"postcss-custom-properties",prepare:()=>{let r=new Map;return{Once:e=>{r=getCustomPropertiesFromRoot(e)},Declaration:o=>{let a=r;if(t&&o.parent){let t=!1;o.parent.each((s=>{o!==s&&"decl"===s.type&&s.variable&&!isDeclarationIgnored(s)&&(t||(a=new Map(r),t=!0),"initial"!==s.value.toLowerCase().trim()?a.set(s.prop,e(s.value)):a.delete(s.prop))}))}transformProperties(o,a,{preserve:t})}}}}};creator.postcss=!0,module.exports=creator;
