"use strict";var e=require("postcss-selector-parser");function nodeIsInsensitiveAttribute(e){return"attribute"===e.type&&(e.insensitive??!1)}function selectorHasInsensitiveAttribute(e){return e.some(nodeIsInsensitiveAttribute)}function transformString(e,t,s){const r=s.charAt(t);if(""===r)return e;let n=e.map((e=>e+r));const o=r.toLocaleUpperCase();return o!==r&&(n=n.concat(e.map((e=>e+o)))),transformString(n,t+1,s)}function createNewSelectors(t){let s=[e.selector({value:"",nodes:[]})];return t.each((e=>{if(!nodeIsInsensitiveAttribute(e))return void s.forEach((t=>{t.append(e.clone())}));const t=transformString([""],0,(r=e).value??"").map((e=>{const t=r.clone({spaces:{after:r.spaces.after,before:r.spaces.before},insensitive:!1});return t.setValue(e),t}));var r;const n=[];t.forEach((e=>{s.forEach((t=>{const s=t.clone({});s.append(e),n.push(s)}))})),s=n})),s}const creator=t=>{const s=Object.assign({preserve:!1},t);return{postcssPlugin:"postcss-attribute-case-insensitive",prepare(){const t=new WeakSet;return{postcssPlugin:"postcss-attribute-case-insensitive",Rule(r,{result:n}){if(t.has(r))return;if(!/i\s*]/gim.test(r.selector))return;let o;try{o=e((e=>{let t=[];e.each((e=>{selectorHasInsensitiveAttribute(e)&&(t=t.concat(createNewSelectors(e)),e.remove())})),t.length&&t.forEach((t=>e.append(t)))})).processSync(r.selector)}catch(e){return void r.warn(n,`Failed to parse selector : "${r.selector}" with message: "${e instanceof Error?e.message:e}"`)}o!==r.selector&&(t.add(r),r.cloneBefore({selector:o}),s.preserve||r.remove())}}}}};creator.postcss=!0,module.exports=creator;
