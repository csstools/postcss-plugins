"use strict";var e=require("postcss-selector-parser"),t=require("@csstools/selector-specificity"),s=require("postcss-value-parser");function encodeCSS(e){if(""===e)return"";let t,s="";for(let o=0;o<e.length;o++)t=e.charCodeAt(o).toString(36),s+=0===o?t:"-"+t;return"csstools-has-"+s}function isGuardedByAtSupportsFromAtRuleParams(e){if(!e.toLowerCase().includes(":has("))return!1;let t=!1;try{const o=new Set;s(e).walk((e=>{if("function"===e.type&&"selector"===e.value.toLowerCase())return o.add(s.stringify(e.nodes)),!1})),o.forEach((e=>{selectorContainsHasPseudo(e)&&(t=!0)}))}catch(e){}return t}function selectorContainsHasPseudo(t){if(!t.toLowerCase().includes(":has("))return!1;let s=!1;try{e().astSync(t).walk((e=>{if("pseudo"===e.type&&":has"===e.value.toLowerCase()&&e.nodes&&e.nodes.length>0)return s=!0,!1}))}catch(e){}return s}const creator=s=>{const o={preserve:!0,specificityMatchingName:"does-not-exist",...s||{}},r=":not(#"+o.specificityMatchingName+")",n=":not(."+o.specificityMatchingName+")",a=":not("+o.specificityMatchingName+")";return{postcssPlugin:"css-has-pseudo-experimental",RuleExit:(s,{result:c})=>{if(!s.selector.toLowerCase().includes(":has(")||isWithinSupportCheck(s))return;const i=s.selectors.map((i=>{if(!i.toLowerCase().includes(":has("))return i;let l;try{l=e().astSync(i)}catch(e){return s.warn(c,`Failed to parse selector : "${i}" with message: "${e.message}"`),i}if(void 0===l)return i;l.walkPseudos((t=>{let s=t.parent,r=!1;for(;s;)e.isPseudoClass(s)&&":has"===s.value.toLowerCase()&&(r=!0),s=s.parent;r&&(":visited"===t.value.toLowerCase()&&t.replaceWith(e.className({value:o.specificityMatchingName})),":any-link"===t.value.toLowerCase()&&(t.value=":link"))})),l.walkPseudos((s=>{if(":has"!==s.value.toLowerCase()||!s.nodes)return;let o=s.parent??s;if(o!==s){let t=o.nodes.length;e:for(let s=0;s<o.nodes.length;s++){const r=o.nodes[s];if(e.isPseudoElement(r))for(let e=s-1;e>=0;e--)if("combinator"!==o.nodes[s].type&&"comment"!==o.nodes[s].type){t=e+1;break e}}if(t<o.nodes.length){const s=e.selector({value:"",nodes:[]});o.nodes.slice(0,t).forEach((e=>{delete e.parent,s.append(e)}));const r=e.selector({value:"",nodes:[]});o.nodes.slice(t).forEach((e=>{delete e.parent,r.append(e)}));const n=e.selector({value:"",nodes:[]});n.append(s),n.append(r),o.replaceWith(n),o=s}}const c="["+encodeCSS(o.toString())+"]",i=t.selectorSpecificity(o);let l=c;for(let e=0;e<i.a;e++)l+=r;const u=Math.max(1,i.b)-1;for(let e=0;e<u;e++)l+=n;for(let e=0;e<i.c;e++)l+=a;const p=e().astSync(l);o.replaceWith(p.nodes[0])}));const u=l.toString();return u!==i?".js-has-pseudo "+u:i}));i.join(",")!==s.selectors.join(",")&&(s.cloneBefore({selectors:i}),o.preserve||s.remove())}}};function isWithinSupportCheck(e){let t=e.parent;for(;t;){if("atrule"===t.type&&isGuardedByAtSupportsFromAtRuleParams(t.params))return!0;t=t.parent}return!1}creator.postcss=!0,module.exports=creator;
