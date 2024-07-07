"use strict";var e=require("@csstools/css-parser-algorithms"),s=require("@csstools/css-tokenizer"),t=require("@csstools/postcss-progressive-custom-properties"),o=require("@csstools/utilities");const r={test:e=>e.includes("content:")&&e.includes("/")},basePlugin=t=>({postcssPlugin:"postcss-content-alt-text",Declaration(n){if("content"!==n.prop||!n.value.includes("/"))return;if(o.hasFallback(n))return;if(o.hasSupportsAtRuleAncestor(n,r))return;const i=e.parseListOfComponentValues(s.tokenize({css:n.value}));let c=0;for(let o=i.length-1;o>=0;o--){const r=i[o];if(!e.isTokenNode(r))continue;const n=r.value;s.isTokenDelim(n)&&("/"===n[4].value&&(c++,!0===t?.stripAltText?i.splice(o,i.length):i.splice(o,1)))}if(1!==c)return;const l=e.stringify([i]);l!==n.value&&(n.cloneBefore({value:l}),!1===t?.preserve&&n.remove())}});basePlugin.postcss=!0;const creator=e=>{const s=Object.assign({enableProgressiveCustomProperties:!0,preserve:!0,stripAltText:!1},e);return s.enableProgressiveCustomProperties&&s.preserve?{postcssPlugin:"postcss-content-alt-text",plugins:[t(),basePlugin(s)]}:basePlugin(s)};creator.postcss=!0,module.exports=creator;
