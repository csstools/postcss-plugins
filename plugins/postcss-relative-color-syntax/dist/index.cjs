"use strict";var s=require("@csstools/postcss-progressive-custom-properties"),e=require("@csstools/css-tokenizer"),t=require("@csstools/css-color-parser"),r=require("@csstools/css-parser-algorithms");function hasFallback(s){const e=s.parent;if(!e)return!1;const t=s.prop.toLowerCase(),r=e.index(s);for(let s=0;s<r;s++){const r=e.nodes[s];if("decl"===r.type&&r.prop.toLowerCase()===t)return!0}return!1}const o=/(rgb|hsl|hwb|lab|lch|oklch|oklab|color)\(\s*?from/i;function hasSupportsAtRuleAncestor(s){let e=s.parent;for(;e;)if("atrule"===e.type){if("supports"===e.name.toLowerCase()&&o.test(e.params))return!0;e=e.parent}else e=e.parent;return!1}const a=/(rgb|hsl|hwb|lab|lch|oklch|oklab|color)\(/i,l=/^(rgb|hsl|hwb|lab|lch|oklch|oklab|color)$/i,n=/from/i,basePlugin=s=>({postcssPlugin:"postcss-relative-color-syntax",Declaration:o=>{const i=o.value;if(!a.test(i)||!n.test(i))return;if(hasFallback(o))return;if(hasSupportsAtRuleAncestor(o))return;const c=e.tokenize({css:i}),u=r.replaceComponentValues(r.parseCommaSeparatedListOfComponentValues(c),(s=>{if(!r.isFunctionNode(s)||!l.test(s.getName()))return;const e=t.color(s);return e&&!e.syntaxFlags.has(t.SyntaxFlag.Experimental)&&!e.syntaxFlags.has(t.SyntaxFlag.HasNoneKeywords)&&e.syntaxFlags.has(t.SyntaxFlag.RelativeColorSyntax)?t.serializeRGB(e):void 0})),p=r.stringify(u);if(p===i)return;let g=p;s?.subFeatures.displayP3&&(g=r.stringify(r.replaceComponentValues(r.parseCommaSeparatedListOfComponentValues(c),(s=>{if(!r.isFunctionNode(s)||!l.test(s.getName()))return;const e=t.color(s);return e&&!e.syntaxFlags.has(t.SyntaxFlag.Experimental)&&!e.syntaxFlags.has(t.SyntaxFlag.HasNoneKeywords)&&e.syntaxFlags.has(t.SyntaxFlag.RelativeColorSyntax)?t.colorDataFitsRGB_Gamut(e)?t.serializeRGB(e):t.serializeP3(e):void 0})))),o.cloneBefore({value:p}),s?.subFeatures.displayP3&&g!==p&&o.cloneBefore({value:g}),s?.preserve||o.remove()}});basePlugin.postcss=!0;const postcssPlugin=e=>{const t=Object.assign({enableProgressiveCustomProperties:!0,preserve:!1,subFeatures:{displayP3:!0}},e);return t.subFeatures=Object.assign({displayP3:!0},t.subFeatures),t.enableProgressiveCustomProperties&&(t.preserve||t.subFeatures.displayP3)?{postcssPlugin:"postcss-relative-color-syntax",plugins:[s(),basePlugin(t)]}:basePlugin(t)};postcssPlugin.postcss=!0,module.exports=postcssPlugin;
