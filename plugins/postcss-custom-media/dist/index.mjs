import{parse as e,addLayerToModel as r}from"@csstools/cascade-layer-name-parser";import{tokenizer as t,TokenType as n,NumberType as a,cloneTokens as o,stringify as s}from"@csstools/css-tokenizer";import{parseFromTokens as i,parse as l,isMediaFeatureBoolean as u,isMediaFeature as c,newMediaFeaturePlain as p,isMediaQueryInvalid as f,isMediaQueryWithType as m,isMediaAnd as d,isMediaOr as h,isMediaNot as y,isMediaConditionList as g,isGeneralEnclosed as v}from"@csstools/media-query-list-parser";const w=e("csstools-implicit-layer")[0];function collectCascadeLayerOrder(t){const n=new Map,a=new Map,o=[];t.walkAtRules((t=>{var s;if("layer"!==t.name.toLowerCase())return;{let e=t.parent;for(;e;){if("atrule"!==e.type||"layer"!==e.name.toLowerCase()){if(e===t.root())break;return}e=e.parent}}let i;if(t.nodes)i=normalizeLayerName(t.params,1);else{if(!t.params.trim())return;i=t.params}let l=e(i);if(null!=(s=l)&&s.length){{let e=t.parent;for(;e&&"atrule"===e.type&&"layer"===e.name.toLowerCase();){const r=a.get(e);r?(l=l.map((e=>r.concat(e))),e=e.parent):e=e.parent}}if(r(o,l),t.nodes){const e=l[0].concat(w);n.set(t,e),a.set(t,l[0])}}}));for(const e of n.values())r(o,[e]);const s=new WeakMap;for(const[e,r]of n)s.set(e,o.findIndex((e=>r.equal(e))));return s}function normalizeLayerName(e,r){return e.trim()?e:"csstools-anon-layer--"+r++}const C=new Set(["scope","container","layer"]);function isProcessableCustomMediaRule(e){if("custom-media"!==e.name.toLowerCase())return!1;if(!e.params||!e.params.includes("--"))return!1;if(e.nodes&&e.nodes.length>0)return!1;let r=e.parent;for(;r;){if("atrule"===r.type&&!C.has(r.name.toLowerCase()))return!1;r=r.parent}return!0}function removeCyclicReferences(e,r){const t=new Set;let n=r;for(;e.size>0;)try{toposort(Array.from(e.keys()),n);break}catch(r){if(!r._graphNode)throw r;e.delete(r._graphNode),t.add(r._graphNode),n=n.filter((e=>-1===e.indexOf(r._graphNode)))}return t}function toposort(e,r){let t=e.length;const n=new Array(t),a={};let o=t;const s=makeOutgoingEdges(r),i=makeNodesHash(e);for(;o--;)a[o]||visit(e[o],o,new Set);return n;function visit(e,r,o){if(o.has(e)){const r=new Error("Cyclic dependency"+JSON.stringify(e));throw r._graphNode=e,r}if(!i.has(e))return;if(a[r])return;a[r]=!0;let l=s.get(e)||new Set;if(l=Array.from(l),r=l.length){o.add(e);do{const e=l[--r];visit(e,i.get(e),o)}while(r);o.delete(e)}n[--t]=e}}function makeOutgoingEdges(e){const r=new Map;for(let t=0,n=e.length;t<n;t++){const n=e[t];r.has(n[0])||r.set(n[0],new Set),r.has(n[1])||r.set(n[1],new Set),r.get(n[0]).add(n[1])}return r}function makeNodesHash(e){const r=new Map;for(let t=0,n=e.length;t<n;t++)r.set(e[t],t);return r}function atMediaParamsTokens(e){const r=t({css:e},{onParseError:()=>{throw new Error(`Unable to parse media query "${e}"`)}}),n=[];for(;!r.endOfFile();)n.push(r.nextToken());return n}const W=[[n.Ident,"max-color",0,0,{value:"max-color"}],[n.Colon,":",0,0,void 0],[n.Number,"2147477350",0,0,{value:2147477350,type:a.Integer}]],k=[[n.Ident,"color",0,0,{value:"color"}],[n.Colon,":",0,0,void 0],[n.Number,"2147477350",0,0,{value:2147477350,type:a.Integer}]];function replaceTrueAndFalseTokens(e){let r,t=[];for(let a=0;a<e.length;a++)if(e[a][0]!==n.Comment&&e[a][0]!==n.Whitespace){if(e[a][0]===n.Ident){const n=e[a];if("true"===n[4].value.toLowerCase()){r="true",t=e.slice(a+1);break}if("false"===n[4].value.toLowerCase()){r="false",t=e.slice(a+1);break}}return e}if(!r)return e;for(let r=0;r<t.length;r++)if(t[r][0]!==n.Comment&&t[r][0]!==n.Whitespace)return e;return"true"===r?[[n.Whitespace," ",0,0,void 0],[n.OpenParen,"(",0,0,void 0],...W,[n.CloseParen,")",0,0,void 0]]:[[n.Whitespace," ",0,0,void 0],[n.OpenParen,"(",0,0,void 0],...k,[n.CloseParen,")",0,0,void 0]]}function parseCustomMedia(e){const r=atMediaParamsTokens(e),t=new Set;let a="",l=r;for(let e=0;e<r.length;e++)if(r[e][0]!==n.Comment&&r[e][0]!==n.Whitespace){if(r[e][0]===n.Ident){const t=r[e];if(t[4].value.startsWith("--")){a=t[4].value,l=r.slice(e+1);break}}return!1}for(let e=0;e<l.length;e++)if(l[e][0]===n.Ident){const r=l[e];r[4].value.startsWith("--")&&t.add(r[4].value)}l=replaceTrueAndFalseTokens(l);const u=i(o(l),{preserveInvalidMediaQueries:!0,onParseError:()=>{throw new Error(`Unable to parse media query "${s(...l)}"`)}}),c=i(o(l),{preserveInvalidMediaQueries:!0,onParseError:()=>{throw new Error(`Unable to parse media query "${s(...l)}"`)}});for(let e=0;e<c.length;e++)c[e]=c[e].negateQuery();return{name:a,truthy:u,falsy:c,dependsOn:Array.from(t).map((e=>[e,a]))}}function getCustomMedia(e,r,t){const n=new Map,a=new Map,o=[],s=collectCascadeLayerOrder(e);e.walkAtRules((e=>{if(!isProcessableCustomMediaRule(e))return;const r=parseCustomMedia(e.params);if(!r)return;if(0===r.truthy.length)return;const i=(u=s,(l=e).parent&&"atrule"===l.parent.type&&"layer"===l.parent.name.toLowerCase()?u.has(l.parent)?u.get(l.parent)+1:0:1e7);var l,u;const c=a.get(r.name)??-1;if(i&&i>=c&&(a.set(r.name,i),n.set(r.name,{truthy:r.truthy,falsy:r.falsy}),o.push(...r.dependsOn)),!t.preserve){const r=e.parent;e.remove(),removeEmptyAncestorBlocks(r)}}));const i=removeCyclicReferences(n,o);for(const t of i.values())e.warn(r,`@custom-media rules have cyclic dependencies for "${t}"`);return n}function removeEmptyAncestorBlocks(e){if(!e)return;let r=e;for(;r;){if(r.nodes&&r.nodes.length>0)return;const e=r.parent;r.remove(),r=e}}function transformAtMediaListTokens(e,r){const t=l(e,{preserveInvalidMediaQueries:!0,onParseError:()=>{throw new Error(`Unable to parse media query "${e}"`)}}),n=t.map((e=>e.toString()));for(let e=0;e<t.length;e++){const a=t[e],o=n[e];{const t=transformSimpleMediaQuery(a,r);if(t&&t.replaceWith!==o)return n.map(((r,n)=>n===e?t:{replaceWith:r}))}const s=transformComplexMediaQuery(a,r);if(s&&0!==s.length&&s[0].replaceWith!==o)return n.flatMap(((r,t)=>t===e?s:[{replaceWith:r}]))}return[]}function transformSimpleMediaQuery(e,r){if(!mediaQueryIsSimple(e))return null;let t=null;return e.walk((e=>{const n=e.node;if(!u(n))return;const a=n.getName();if(!a.startsWith("--"))return!1;const o=r.get(a);return o?(t={replaceWith:o.truthy.map((e=>e.toString().trim())).join(",")},!1):void 0})),t}function transformComplexMediaQuery(e,r){let t=[];return e.walk((n=>{const a=n.node;if(!u(a))return;const o=n.parent;if(!c(o))return;const s=a.getName();if(!s.startsWith("--"))return!1;const i=r.get(s);if(i){if(1===i.truthy.length&&mediaQueryIsSimple(i.truthy[0])){let r=null;if(i.truthy[0].walk((e=>{if(c(e.node))return r=e.node,!1})),r&&r.feature)return o.feature=r.feature,t=[{replaceWith:e.toString()}],!1}const r=p(W[0][4].value,W[2]);o.feature=r.feature;const n=e.toString(),a=p(k[0][4].value,k[2]);o.feature=a.feature;const s=e.toString();return t=[{replaceWith:n,encapsulateWith:i.truthy.map((e=>e.toString().trim())).join(",")},{replaceWith:s,encapsulateWith:i.falsy.map((e=>e.toString().trim())).join(",")}],!1}})),t}function mediaQueryIsSimple(e){if(f(e))return!1;if(m(e))return!1;let r=!0;return e.walk((e=>{if(d(e.node)||h(e.node)||y(e.node)||g(e.node)||v(e.node))return r=!1,!1})),r}const creator=e=>{const r=Boolean(Object(e).preserve);if("importFrom"in Object(e))throw new Error('[postcss-custom-media] "importFrom" is no longer supported');if("exportTo"in Object(e))throw new Error('[postcss-custom-media] "exportTo" is no longer supported');return{postcssPlugin:"postcss-custom-media",prepare(){const e=new WeakSet;let t=new Map;return{Once:(e,{result:n})=>{t=getCustomMedia(e,n,{preserve:r})},AtRule:(n,{result:a})=>{if(e.has(n))return;if("media"!==n.name.toLowerCase())return;if(!n.params)return;if(!n.params.includes("--"))return;let o=[];try{o=transformAtMediaListTokens(n.params,t)}catch(e){return void n.warn(a,`Failed to parse @custom-media params with error message: "${e.message}"`)}if(!o||0===o.length)return;if(1===o.length){if(n.params.trim()===o[0].replaceWith.trim())return;return e.add(n),n.cloneBefore({params:o[0].replaceWith.trim()}),r?void 0:void n.remove()}if(!!!o.find((e=>!!e.encapsulateWith)))return e.add(n),n.cloneBefore({params:o.map((e=>e.replaceWith)).join(",").trim()}),void(r||n.remove());o.forEach((r=>{if(!r.encapsulateWith)return void n.cloneBefore({params:r.replaceWith.trim()});const t=n.clone({params:r.replaceWith}),a=n.clone({params:r.encapsulateWith.trim(),nodes:[]});t.parent=void 0,a.parent=void 0,e.add(n),a.append(t),n.before(a)})),r||n.remove()}}}}};creator.postcss=!0;export{creator as default};
