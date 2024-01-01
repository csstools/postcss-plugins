import e from"postcss-selector-parser";function nodeIsInsensitiveAttribute(e){return"attribute"===e.type&&(e.insensitive??!1)}function selectorHasInsensitiveAttribute(e){return e.some(nodeIsInsensitiveAttribute)}function transformString(e,t,r){const s=r.charAt(t);if(""===s)return e;let n=e.map((e=>e+s));const o=s.toLocaleUpperCase();return o!==s&&(n=n.concat(e.map((e=>e+o)))),transformString(n,t+1,r)}function createNewSelectors(t){let r=[e.selector({value:"",nodes:[]})];return t.each((e=>{if(!nodeIsInsensitiveAttribute(e))return void r.forEach((t=>{t.append(e.clone())}));const t=transformString([""],0,(s=e).value??"").map((e=>{const t=s.clone({spaces:{after:s.spaces.after,before:s.spaces.before},insensitive:!1});return t.setValue(e),t}));var s;const n=[];t.forEach((e=>{r.forEach((t=>{const r=t.clone({});r.append(e),n.push(r)}))})),r=n})),r}const creator=t=>{const r=Object.assign({preserve:!1},t);return{postcssPlugin:"postcss-attribute-case-insensitive",prepare(){const t=new WeakSet;return{Rule(s,{result:n}){if(t.has(s))return;if(!/i\s*]/gim.test(s.selector))return;let o;try{o=e((e=>{let t=[];e.each((e=>{selectorHasInsensitiveAttribute(e)&&(t=t.concat(createNewSelectors(e)),e.remove())})),t.length&&t.forEach((t=>e.append(t)))})).processSync(s.selector)}catch(e){return void s.warn(n,`Failed to parse selector : "${s.selector}" with message: "${e instanceof Error?e.message:e}"`)}o!==s.selector&&(t.add(s),s.cloneBefore({selector:o}),r.preserve||s.remove())}}}}};creator.postcss=!0;export{creator as default};
