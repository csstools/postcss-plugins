"use strict";var e=require("postcss-selector-parser"),t=require("postcss-value-parser"),s=require("@csstools/selector-specificity");function encodeCSS(e){if(""===e)return"";let t,s="";for(let r=0;r<e.length;r++)t=e.charCodeAt(r).toString(36),s+=0===r?t:"-"+t;return"csstools-has-"+s}function isGuardedByAtSupportsFromAtRuleParams(e){if(!e.toLowerCase().includes(":has("))return!1;let s=!1;try{const r=new Set;t(e).walk((e=>{if("function"===e.type&&"selector"===e.value.toLowerCase())return r.add(t.stringify(e.nodes)),!1})),r.forEach((e=>{selectorContainsHasPseudo(e)&&(s=!0)}))}catch(e){}return s}function selectorContainsHasPseudo(t){if(!t.toLowerCase().includes(":has("))return!1;let s=!1;try{e().astSync(t).walk((e=>{if("pseudo"===e.type&&":has"===e.value.toLowerCase()&&e.nodes&&e.nodes.length>0)return s=!0,!1}))}catch(e){}return s}const creator=t=>{const r={preserve:!0,specificityMatchingName:"does-not-exist",...t||{}},o=":not(#"+r.specificityMatchingName+")",n=":not(."+r.specificityMatchingName+")",a=":not("+r.specificityMatchingName+")";return{postcssPlugin:"css-has-pseudo",prepare(){const t=new WeakSet;return{postcssPlugin:"css-has-pseudo",RuleExit(c,{result:i}){if(t.has(c))return;if(!c.selector.toLowerCase().includes(":has(")||isWithinSupportCheck(c))return;const l=c.selectors.map((t=>{if(!t.toLowerCase().includes(":has("))return t;let l;try{l=e().astSync(t)}catch(e){return c.warn(i,`Failed to parse selector : "${t}" with message: "${e instanceof Error?e.message:e}"`),t}if(void 0===l)return t;l.walkPseudos((t=>{let s=t.parent,o=!1;for(;s;)e.isPseudoClass(s)&&":has"===s.value.toLowerCase()&&(o=!0),s=s.parent;o&&(":visited"===t.value.toLowerCase()&&t.replaceWith(e.className({value:r.specificityMatchingName})),":any-link"===t.value.toLowerCase()&&(t.value=":link"))})),l.walkPseudos((t=>{if(":has"!==t.value.toLowerCase()||!t.nodes)return;const r=t.parent;if(!r)return;const c=e.selector({value:"",nodes:[]});{let t=r.nodes.length;e:for(let s=0;s<r.nodes.length;s++){const o=r.nodes[s];if(e.isPseudoElement(o))for(let e=s-1;e>=0;e--)if("combinator"!==r.nodes[s].type&&"comment"!==r.nodes[s].type){t=e+1;break e}}r.nodes.slice(0,t).forEach((e=>{e.remove(),"selector"===e.type?e.nodes.forEach((e=>{delete e.parent,c.append(e)})):(delete e.parent,c.append(e))}))}const i="["+encodeCSS(c.toString())+"]",l=s.selectorSpecificity(c);let u=i;for(let e=0;e<l.a;e++)u+=o;const p=Math.max(1,l.b)-1;for(let e=0;e<p;e++)u+=n;for(let e=0;e<l.c;e++)u+=a;const d=e().astSync(u).nodes[0].nodes;for(let e=d.length-1;e>=0;e--)r.prepend(d[e])}));const u=l.toString();return u!==t?".js-has-pseudo "+u:t}));l.join(",")!==c.selectors.join(",")&&(t.add(c),c.cloneBefore({selectors:l}),r.preserve||c.remove())}}}}};function isWithinSupportCheck(e){let t=e.parent;for(;t;){if("atrule"===t.type&&isGuardedByAtSupportsFromAtRuleParams(t.params))return!0;t=t.parent}return!1}creator.postcss=!0,module.exports=creator;
