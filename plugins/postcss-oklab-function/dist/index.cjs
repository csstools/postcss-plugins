"use strict";var e=require("@csstools/postcss-progressive-custom-properties"),s=require("@csstools/css-tokenizer"),r=require("@csstools/css-color-parser"),t=require("@csstools/css-parser-algorithms");function hasFallback(e){const s=e.parent;if(!s)return!1;const r=e.prop.toLowerCase(),t=s.index(e);for(let e=0;e<t;e++){const t=s.nodes[e];if("decl"===t.type&&t.prop.toLowerCase()===r)return!0}return!1}function hasSupportsAtRuleAncestor(e){let s=e.parent;for(;s;)if("atrule"===s.type){if("supports"===s.name.toLowerCase()){if(-1!==s.params.toLowerCase().indexOf("oklab("))return!0;if(-1!==s.params.toLowerCase().indexOf("oklch("))return!0}s=s.parent}else s=s.parent;return!1}const o=/(oklab|oklch)\(/i,a=/^(oklab|oklch)$/i,basePlugin=e=>({postcssPlugin:"postcss-oklab-function",Declaration:n=>{const l=n.value;if(!o.test(l))return;if(hasFallback(n))return;if(hasSupportsAtRuleAncestor(n))return;const i=s.tokenize({css:l}),u=t.replaceComponentValues(t.parseCommaSeparatedListOfComponentValues(i),(e=>{if(t.isFunctionNode(e)&&a.test(e.getName())){const s=r.color(e);if(!s)return;if(s.syntaxFlags.has(r.SyntaxFlag.Experimental))return;if(s.syntaxFlags.has(r.SyntaxFlag.HasNoneKeywords))return;if(s.syntaxFlags.has(r.SyntaxFlag.RelativeColorSyntax))return;return r.serializeRGB(s)}})),p=t.stringify(u);if(p===l)return;let c=p;null!=e&&e.subFeatures.displayP3&&(c=t.stringify(t.replaceComponentValues(t.parseCommaSeparatedListOfComponentValues(i),(e=>{if(t.isFunctionNode(e)&&a.test(e.getName())){const s=r.color(e);if(!s)return;if(s.syntaxFlags.has(r.SyntaxFlag.HasNoneKeywords))return;if(s.syntaxFlags.has(r.SyntaxFlag.RelativeColorSyntax))return;return r.colorDataFitsRGB_Gamut(s)?r.serializeRGB(s):r.serializeP3(s)}})))),n.cloneBefore({value:p}),null!=e&&e.subFeatures.displayP3&&c!==p&&n.cloneBefore({value:c}),null!=e&&e.preserve||n.remove()}});basePlugin.postcss=!0;const creator=s=>{const r=Object.assign({enableProgressiveCustomProperties:!0,preserve:!1,subFeatures:{displayP3:!0}},s);return r.subFeatures=Object.assign({displayP3:!0},r.subFeatures),r.enableProgressiveCustomProperties&&(r.preserve||r.subFeatures.displayP3)?{postcssPlugin:"postcss-oklab-function",plugins:[e(),basePlugin(r)]}:basePlugin(r)};creator.postcss=!0,module.exports=creator;
