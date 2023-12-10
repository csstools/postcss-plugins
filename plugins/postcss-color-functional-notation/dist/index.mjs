import s from"@csstools/postcss-progressive-custom-properties";import{tokenize as t}from"@csstools/css-tokenizer";import{color as e,SyntaxFlag as r,serializeHSL as o,serializeRGB as a}from"@csstools/css-color-parser";import{replaceComponentValues as n,parseCommaSeparatedListOfComponentValues as c,isFunctionNode as l,stringify as i}from"@csstools/css-parser-algorithms";function hasFallback(s){const t=s.parent;if(!t)return!1;const e=s.prop.toLowerCase(),r=t.index(s);for(let s=0;s<r;s++){const r=t.nodes[s];if("decl"===r.type&&r.prop.toLowerCase()===e)return!0}return!1}const p=/(?:rgb|hsl)a?\(/i;function hasSupportsAtRuleAncestor(s){let t=s.parent;for(;t;)if("atrule"===t.type){if("supports"===t.name.toLowerCase()&&p.test(t.params))return!0;t=t.parent}else t=t.parent;return!1}const u=/^(?:rgb|hsl)a?$/i,basePlugin=s=>({postcssPlugin:"postcss-color-functional-notation",Declaration:f=>{const g=f.value;if(!p.test(g))return;if(hasFallback(f))return;if(hasSupportsAtRuleAncestor(f))return;const m=n(c(t({css:g})),(s=>{if(l(s)&&u.test(s.getName())){const t=e(s);if(!t)return;if(t.syntaxFlags.has(r.Experimental))return;if(t.syntaxFlags.has(r.HasNoneKeywords))return;if(t.syntaxFlags.has(r.RelativeColorSyntax))return;if((t.syntaxFlags.has(r.LegacyRGB)||t.syntaxFlags.has(r.LegacyHSL))&&!t.syntaxFlags.has(r.HasPercentageAlpha))return;return"hsl"===t.colorNotation?o(t):a(t)}})),h=i(m);h!==g&&(f.cloneBefore({value:h}),s?.preserve||f.remove())}});basePlugin.postcss=!0;const postcssPlugin=t=>{const e=Object.assign({preserve:!1,enableProgressiveCustomProperties:!0},t);return e.enableProgressiveCustomProperties&&e.preserve?{postcssPlugin:"postcss-color-functional-notation",plugins:[s(),basePlugin(e)]}:basePlugin(e)};postcssPlugin.postcss=!0;export{postcssPlugin as default};
