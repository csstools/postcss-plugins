"use strict";function e(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var t,r=e(require("postcss-selector-parser"));function n(e,r,n,a,s=!1){if(r.startsWith("__proto__")||null!=n&&n.startsWith("__proto__"))return[];let u=!1;n||""===n||(u=!0);let o="";u||(o=n.toString()),s&&(o=o.toLowerCase());return e.filter((e=>{let n="";if(n="variable"===r.toLowerCase()&&"decl"===e.type&&"variable"in e?"variable":Object.keys(e).find((t=>t.toLowerCase()===r.toLowerCase()&&Object.prototype.hasOwnProperty.call(e,t))),!n)return!1;if("boolean"==typeof e[n])return e[n];if(u)return!0;let i=[e[n].toString()];switch("rule"!==e.type||"selector"!==n&&"selectors"!==n||(i=e.selectors),s&&(i=i.map((e=>e.toLowerCase()))),a){case t.StartsWith:return!!i.find((e=>e.startsWith(o)));case t.EndsWith:return!!i.find((e=>e.endsWith(o)));case t.Contains:return!!i.find((e=>e.includes(o)));case t.Exact:default:return!!i.find((e=>e===o))}}))}function a(e){switch(e.type){case"decl":{const t=e;return s({type:t.type,important:t.important,prop:t.prop,value:t.value,variable:t.variable})}case"rule":{const t=e;return s({type:t.type,selectors:t.selectors})}case"atrule":{const t=e;return s({type:t.type,name:t.name,params:t.params})}case"comment":{const t=e;return s({type:t.type,text:t.text})}default:return{}}}function s(e){return Object.keys(e).forEach((t=>{void 0===e[t]&&delete e[t]})),e}function u(e,t){const r={};for(const[n,s]of t){let t=new Set;s.each((r=>{t=o(e,r,t)})),r[n]=[];for(const e of t)r[n].push(a(e))}return r}function o(e,t,r){const n=i(t),a=new Set(r);return e.walk((e=>{if(a.has(e))return;c(n,[e]).length>0&&a.add(e)})),a}function i(e){if(!e||!e.nodes)return;let r=null;return e.each((e=>{switch(e.type){case"universal":r={next:r,run:e=>e};break;case"combinator":switch(e.value){case" ":r={next:r,run:e=>function(e){return e.flatMap((t=>{const r=[];let n=t.parent;for(;n;)r.push(n),n=n.parent;return e.length?r:[]})).filter((e=>!!e))}(e)};break;case">":r={next:r,run:e=>function(e){return e.map((e=>e.parent)).filter((e=>!!e))}(e)};break;case"+":r={next:r,run:e=>function(e){return e.map((e=>e.prev())).filter((e=>!!e))}(e)};break;case"~":r={next:r,run:e=>function(e){return e.flatMap((t=>{const r=[];let n=t.prev();for(;n;)r.push(n),n=n.prev();return e.length?r:[]})).filter((e=>!!e))}(e)};break;default:r={next:r,run:()=>[]}}break;case"tag":r={next:r,run:t=>function(e,t){return e.filter((e=>e.type.toLowerCase()===t.toLowerCase()))}(t,e.value)};break;case"pseudo":if(":not"===e.value)r={next:r,run:t=>{const r=e.nodes.map((e=>i(e))),n=t.filter((e=>r.flatMap((t=>c(t,[e]))).length>0));return function(e,t){return e.filter((e=>!t.includes(e)))}(t,n)}};else r={next:r,run:()=>[]};break;case"attribute":switch(e.operator){case"^=":r={next:r,run:r=>n(r,e.attribute,e.value,t.StartsWith,e.insensitive)};break;case"$=":r={next:r,run:r=>n(r,e.attribute,e.value,t.EndsWith,e.insensitive)};break;case"*=":r={next:r,run:r=>n(r,e.attribute,e.value,t.Contains,e.insensitive)};break;default:r={next:r,run:r=>n(r,e.attribute,e.value,t.Exact,e.insensitive)}}break;default:r={next:r,run:()=>[]}}})),r}function c(e,t){let r=e,n=t;for(;r&&n.length>0;)n=r.run(n),r=r.next;return n}!function(e){e.Exact="",e.StartsWith="^",e.EndsWith="$",e.Contains="*"}(t||(t={}));const l=e=>{var t;const n=Object(e),a=new Map;return Object.keys(null!=(t=n.queries)?t:{}).forEach((e=>{a.set(e,r.default().astSync(n.queries[e]))})),n.results||(n.results=e=>{console.log(e)}),{postcssPlugin:"postcss-extract",prepare:()=>e.extractLate?{OnceExit:e=>{n.results(u(e,a))}}:{Once:e=>{n.results(u(e,a))}}}};l.postcss=!0,module.exports=l;
