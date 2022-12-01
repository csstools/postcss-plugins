"use strict";var e=require("postcss-selector-parser");const s=":focus-visible",creator=o=>{const l=Object.assign({preserve:!0,replaceWith:".focus-visible",disablePolyfillReadyClass:!1},o),n=e().astSync(l.replaceWith);return{postcssPlugin:"postcss-focus-visible",Rule(o,{result:t}){if(!o.selector.toLowerCase().includes(s))return;const r=o.selectors.flatMap((r=>{if(!r.toLowerCase().includes(s))return[r];let i;try{i=e().astSync(r)}catch(e){return o.warn(t,`Failed to parse selector : "${r}" with message: "${e.message}"`),r}if(void 0===i)return[r];let a=!1;if(i.walkPseudos((e=>{e.value.toLowerCase()===s&&(e.nodes&&e.nodes.length||(a=!0,e.replaceWith(n.clone({}))))})),!a)return[r];const c=i.clone();if(!l.disablePolyfillReadyClass){var u,d,f,p,v;if(null!=(u=i.nodes)&&null!=(d=u[0])&&null!=(f=d.nodes)&&f.length)for(let s=0;s<i.nodes[0].nodes.length;s++){const o=i.nodes[0].nodes[s];if("combinator"===o.type||e.isPseudoElement(o)){i.nodes[0].insertBefore(o,e.className({value:"js-focus-visible"}));break}if(s===i.nodes[0].nodes.length-1){i.nodes[0].append(e.className({value:"js-focus-visible"}));break}}null!=(p=i.nodes)&&null!=(v=p[0])&&v.nodes&&(c.nodes[0].prepend(e.combinator({value:" "})),c.nodes[0].prepend(e.className({value:"js-focus-visible"})))}return[i.toString(),c.toString()]}));r.join(",")!==o.selectors.join(",")&&(o.cloneBefore({selectors:r}),l.preserve||o.remove())}}};creator.postcss=!0,module.exports=creator;
