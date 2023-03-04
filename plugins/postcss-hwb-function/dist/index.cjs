"use strict";var e=require("@csstools/css-color-parser"),r=require("@csstools/css-parser-algorithms"),t=require("@csstools/css-tokenizer");const s="(color: hwb(0 0% 0%))";function hasSupportsAtRuleAncestor(e){let r=e.parent;for(;r;)if("atrule"===r.type){if("supports"===r.name.toLowerCase()&&r.params.includes(s))return!0;r=r.parent}else r=r.parent;return!1}function hasFallback(e){const r=e.parent;if(!r)return!1;const t=e.prop.toLowerCase(),s=r.index(e);for(let e=0;e<s;e++){const s=r.nodes[e];if("decl"===s.type&&s.prop.toLowerCase()===t)return!0}return!1}const o=/hwb\(/i,n=/hwb/i,postcssPlugin=a=>{const l="preserve"in Object(a)&&Boolean(null==a?void 0:a.preserve);return{postcssPlugin:"postcss-hwb-function",Declaration:(a,{postcss:c})=>{const p=a.value;if(!o.test(p))return;if(l&&hasSupportsAtRuleAncestor(a))return;if(hasFallback(a))return;const u=r.replaceComponentValues(r.parseCommaSeparatedListOfComponentValues(t.tokenize({css:p})),(t=>{if(r.isFunctionNode(t)&&n.test(t.getName())){const r=e.color(t);if(!r)return;if(r.syntaxFlags.has(e.SyntaxFlag.HasNoneKeywords))return;return e.serializeRGB(r)}})),i=r.stringify(u);if(i!==p)if(a.variable&&l&&a.parent){const e=a.parent,r=c.atRule({name:"supports",params:s,source:a.source}),t=e.clone();t.removeAll(),t.append(a.clone()),r.append(t),insertAtSupportsAfterCorrectRule(r,e,s),a.replaceWith(a.clone({value:i}))}else l?a.cloneBefore({value:i}):a.replaceWith(a.clone({value:i}))}}};function insertAtSupportsAfterCorrectRule(e,r,t){let s=r,o=r.next();for(;s&&o&&"atrule"===o.type&&"supports"===o.name.toLowerCase()&&o.params===t;)s=o,o=o.next();s.after(e)}postcssPlugin.postcss=!0,module.exports=postcssPlugin;
