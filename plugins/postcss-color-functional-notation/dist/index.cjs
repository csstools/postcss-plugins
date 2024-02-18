"use strict";var s=require("@csstools/postcss-progressive-custom-properties"),e=require("@csstools/css-color-parser"),t=require("@csstools/utilities"),o=require("@csstools/css-parser-algorithms"),a=require("@csstools/css-tokenizer");const r=/^(?:rgb|hsl)a?$/i,n=/\b(?:rgb|hsl)a?\(/i,basePlugin=s=>({postcssPlugin:"postcss-color-functional-notation",Declaration:l=>{const i=l.value;if(!n.test(i))return;if(t.hasFallback(l))return;if(t.hasSupportsAtRuleAncestor(l,n))return;const c=o.replaceComponentValues(o.parseCommaSeparatedListOfComponentValues(a.tokenize({css:i})),(s=>{if(!o.isFunctionNode(s)||!r.test(s.getName()))return;const t=e.color(s);return!t||t.syntaxFlags.has(e.SyntaxFlag.Experimental)||t.syntaxFlags.has(e.SyntaxFlag.HasNoneKeywords)||t.syntaxFlags.has(e.SyntaxFlag.RelativeColorSyntax)||(t.syntaxFlags.has(e.SyntaxFlag.LegacyRGB)||t.syntaxFlags.has(e.SyntaxFlag.LegacyHSL))&&!t.syntaxFlags.has(e.SyntaxFlag.HasPercentageAlpha)?void 0:"hsl"===t.colorNotation?e.serializeHSL(t):e.serializeRGB(t)})),u=o.stringify(c);u!==i&&(l.cloneBefore({value:u}),s?.preserve||l.remove())}});basePlugin.postcss=!0;const postcssPlugin=e=>{const t=Object.assign({preserve:!1,enableProgressiveCustomProperties:!0},e);return t.enableProgressiveCustomProperties&&t.preserve?{postcssPlugin:"postcss-color-functional-notation",plugins:[s(),basePlugin(t)]}:basePlugin(t)};postcssPlugin.postcss=!0,module.exports=postcssPlugin;
