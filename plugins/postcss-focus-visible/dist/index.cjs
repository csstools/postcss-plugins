"use strict";var e=require("postcss-selector-parser");const s="js-focus-visible",o=":focus-visible",creator=r=>{const t=Object.assign({preserve:!0,replaceWith:".focus-visible",disablePolyfillReadyClass:!1},r),n=e().astSync(t.replaceWith);return{postcssPlugin:"postcss-focus-visible",prepare(){const r=new WeakSet;return{Rule(l,{result:a}){if(r.has(l))return;if(!l.selector.toLowerCase().includes(o))return;const i=l.selectors.flatMap((r=>{if(!r.toLowerCase().includes(o))return[r];let i;try{i=e().astSync(r)}catch(e){return l.warn(a,`Failed to parse selector : "${r}" with message: "${e instanceof Error?e.message:e}"`),r}if(void 0===i)return[r];let c=!1;if(i.walkPseudos((e=>{e.value.toLowerCase()===o&&(e.nodes&&e.nodes.length||(c=!0,e.replaceWith(n.clone({}))))})),!c)return[r];const d=i.clone();if(!t.disablePolyfillReadyClass){if(i.nodes?.[0]?.nodes?.length)for(let o=0;o<i.nodes[0].nodes.length;o++){const r=i.nodes[0].nodes[o];if("combinator"===r.type||e.isPseudoElement(r)){i.nodes[0].insertBefore(r,e.className({value:s}));break}if(o===i.nodes[0].nodes.length-1){i.nodes[0].append(e.className({value:s}));break}}return i.nodes?.[0]?.nodes&&(d.nodes[0].prepend(e.combinator({value:" "})),d.nodes[0].prepend(e.className({value:s}))),[i.toString(),d.toString()]}return[i.toString()]}));i.join(",")!==l.selectors.join(",")&&(r.add(l),l.cloneBefore({selectors:i}),t.preserve||l.remove())}}}}};creator.postcss=!0,module.exports=creator;
