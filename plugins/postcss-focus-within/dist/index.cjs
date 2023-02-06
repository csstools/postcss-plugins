"use strict";var e=require("postcss-selector-parser");const s=[" ",">","~",":","+","@","#","(",")"];function isValidReplacement(e){let t=!0;for(let n=0,o=s.length;n<o&&t;n++)e.indexOf(s[n])>-1&&(t=!1);return t}const t="js-focus-within",n=":focus-within",creator=s=>{const o=Object.assign({preserve:!0,replaceWith:"[focus-within]",disablePolyfillReadyClass:!1},s),l=e().astSync(o.replaceWith);return isValidReplacement(o.replaceWith)?{postcssPlugin:"postcss-focus-within",prepare(){const s=new WeakSet;return{Rule(r,{result:a}){if(s.has(r))return;if(!r.selector.toLowerCase().includes(n))return;const i=r.selectors.flatMap((s=>{if(!s.toLowerCase().includes(n))return[s];let i;try{i=e().astSync(s)}catch(e){return r.warn(a,`Failed to parse selector : "${s}" with message: "${e.message}"`),s}if(void 0===i)return[s];let c=!1;if(i.walkPseudos((e=>{e.value.toLowerCase()===n&&(e.nodes&&e.nodes.length||(c=!0,e.replaceWith(l.clone({}))))})),!c)return[s];const u=i.clone();if(!o.disablePolyfillReadyClass){var d,p,f,h,g;if(null!=(d=i.nodes)&&null!=(p=d[0])&&null!=(f=p.nodes)&&f.length)for(let s=0;s<i.nodes[0].nodes.length;s++){const n=i.nodes[0].nodes[s];if("combinator"===n.type||e.isPseudoElement(n)){i.nodes[0].insertBefore(n,e.className({value:t}));break}if(s===i.nodes[0].nodes.length-1){i.nodes[0].append(e.className({value:t}));break}}return null!=(h=i.nodes)&&null!=(g=h[0])&&g.nodes&&(u.nodes[0].prepend(e.combinator({value:" "})),u.nodes[0].prepend(e.className({value:t}))),[i.toString(),u.toString()]}return[i.toString()]}));i.join(",")!==r.selectors.join(",")&&(s.add(r),r.cloneBefore({selectors:i}),o.preserve||r.remove())}}}}:{postcssPlugin:"postcss-focus-within",Once:(e,{result:s})=>{e.warn(s,`${o.replaceWith} is not a valid replacement since it can't be applied to single elements.`)}}};creator.postcss=!0,module.exports=creator;
