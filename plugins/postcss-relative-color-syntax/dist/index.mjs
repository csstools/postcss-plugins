import s from"@csstools/postcss-progressive-custom-properties";import{tokenize as e}from"@csstools/css-tokenizer";import{color as o,SyntaxFlag as r,serializeRGB as t,colorDataFitsRGB_Gamut as a,serializeP3 as l}from"@csstools/css-color-parser";import{hasFallback as i,hasSupportsAtRuleAncestor as c}from"@csstools/utilities";import{replaceComponentValues as n,parseCommaSeparatedListOfComponentValues as u,isFunctionNode as p,stringify as b}from"@csstools/css-parser-algorithms";const m=/\b(?:rgb|hsl|hwb|lab|lch|oklch|oklab|color)\(/i,g=/\b(?:rgb|hsl|hwb|lab|lch|oklch|oklab|color)\(\s*?from/i,h=/^(?:rgb|hsl|hwb|lab|lch|oklch|oklab|color)$/i,y=/from/i,basePlugin=s=>({postcssPlugin:"postcss-relative-color-syntax",Declaration:f=>{const v=f.value;if(!m.test(v)||!y.test(v))return;if(i(f))return;if(c(f,g))return;const x=e({css:v}),F=n(u(x),(s=>{if(!p(s)||!h.test(s.getName()))return;const e=o(s);return e&&!e.syntaxFlags.has(r.Experimental)&&!e.syntaxFlags.has(r.HasNoneKeywords)&&e.syntaxFlags.has(r.RelativeColorSyntax)?t(e):void 0})),P=b(F);if(P===v)return;let d=P;s?.subFeatures.displayP3&&(d=b(n(u(x),(s=>{if(!p(s)||!h.test(s.getName()))return;const e=o(s);return e&&!e.syntaxFlags.has(r.Experimental)&&!e.syntaxFlags.has(r.HasNoneKeywords)&&e.syntaxFlags.has(r.RelativeColorSyntax)?a(e)?t(e):l(e):void 0})))),f.cloneBefore({value:P}),s?.subFeatures.displayP3&&d!==P&&f.cloneBefore({value:d}),s?.preserve||f.remove()}});basePlugin.postcss=!0;const postcssPlugin=e=>{const o=Object.assign({enableProgressiveCustomProperties:!0,preserve:!1,subFeatures:{displayP3:!0}},e);return o.subFeatures=Object.assign({displayP3:!0},o.subFeatures),o.enableProgressiveCustomProperties&&(o.preserve||o.subFeatures.displayP3)?{postcssPlugin:"postcss-relative-color-syntax",plugins:[s(),basePlugin(o)]}:basePlugin(o)};postcssPlugin.postcss=!0;export{postcssPlugin as default};
