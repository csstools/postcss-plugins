"use strict";var e=require("postcss-selector-parser");const s="js-focus-visible",o=":focus-visible",creator=n=>{const r=Object.assign({preserve:!0,replaceWith:".focus-visible",disablePolyfillReadyClass:!1},n),t=e().astSync(r.replaceWith);return{postcssPlugin:"postcss-focus-visible",prepare(){const n=new WeakSet;return{Rule(l,{result:a}){if(n.has(l))return;if(!l.selector.toLowerCase().includes(o))return;const i=l.selectors.flatMap((n=>{if(!n.toLowerCase().includes(o))return[n];let i;try{i=e().astSync(n)}catch(e){return l.warn(a,`Failed to parse selector : "${n}" with message: "${e.message}"`),n}if(void 0===i)return[n];let c=!1;if(i.walkPseudos((e=>{e.value.toLowerCase()===o&&(e.nodes&&e.nodes.length||(c=!0,e.replaceWith(t.clone({}))))})),!c)return[n];const u=i.clone();if(!r.disablePolyfillReadyClass){var d,p,f,v,b;if(null!=(d=i.nodes)&&null!=(p=d[0])&&null!=(f=p.nodes)&&f.length)for(let o=0;o<i.nodes[0].nodes.length;o++){const n=i.nodes[0].nodes[o];if("combinator"===n.type||e.isPseudoElement(n)){i.nodes[0].insertBefore(n,e.className({value:s}));break}if(o===i.nodes[0].nodes.length-1){i.nodes[0].append(e.className({value:s}));break}}return null!=(v=i.nodes)&&null!=(b=v[0])&&b.nodes&&(u.nodes[0].prepend(e.combinator({value:" "})),u.nodes[0].prepend(e.className({value:s}))),[i.toString(),u.toString()]}return[i.toString()]}));i.join(",")!==l.selectors.join(",")&&(n.add(l),l.cloneBefore({selectors:i}),r.preserve||l.remove())}}}}};creator.postcss=!0,module.exports=creator;
