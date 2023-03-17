import s from"@csstools/postcss-progressive-custom-properties";import{tokenize as e,cloneTokens as r}from"@csstools/css-tokenizer";import{color as t,SyntaxFlag as o,serializeRGB as n,colorDataTo as a,ColorNotation as l,serializeP3 as u}from"@csstools/css-color-parser";import{replaceComponentValues as i,parseCommaSeparatedListOfComponentValues as p,isFunctionNode as c,stringify as f}from"@csstools/css-parser-algorithms";function hasFallback(s){const e=s.parent;if(!e)return!1;const r=s.prop.toLowerCase(),t=e.index(s);for(let s=0;s<t;s++){const t=e.nodes[s];if("decl"===t.type&&t.prop.toLowerCase()===r)return!0}return!1}function hasSupportsAtRuleAncestor(s){let e=s.parent;for(;e;)if("atrule"===e.type){if("supports"===e.name.toLowerCase()){if(-1!==e.params.toLowerCase().indexOf("oklab("))return!0;if(-1!==e.params.toLowerCase().indexOf("oklch("))return!0}e=e.parent}else e=e.parent;return!1}const m=/(oklab|oklch)\(/i,b=/^(oklab|oklch)$/i,basePlugin=s=>({postcssPlugin:"postcss-oklab-function",Declaration:d=>{if(hasFallback(d))return;if(hasSupportsAtRuleAncestor(d))return;const g=d.value;if(!m.test(g.toLowerCase()))return;const h=e({css:g}),k=i(p(h),(s=>{if(c(s)&&b.test(s.getName())){const e=t(s);if(!e)return;if(e.syntaxFlags.has(o.HasNoneKeywords))return;return n(e)}})),y=f(k);if(y===g)return;let P=y;null!=s&&s.subFeatures.displayP3&&(P=f(i(p(r(h)),(s=>{if(c(s)&&b.test(s.getName())){const e=t(s);if(!e)return;if(e.syntaxFlags.has(o.HasNoneKeywords))return;return a(e,l.RGB).channels.find((s=>s<=1e-5||s>=.99999))?u(e):n(e)}})))),d.cloneBefore({value:y}),null!=s&&s.subFeatures.displayP3&&P!==y&&d.cloneBefore({value:P}),null!=s&&s.preserve||d.remove()}});basePlugin.postcss=!0;const postcssPlugin=e=>{const r=Object.assign({enableProgressiveCustomProperties:!0,preserve:!1,subFeatures:{displayP3:!0}},e);return r.subFeatures=Object.assign({displayP3:!0},r.subFeatures),r.enableProgressiveCustomProperties&&(r.preserve||r.subFeatures.displayP3)?{postcssPlugin:"postcss-oklab-function",plugins:[s(),basePlugin(r)]}:basePlugin(r)};postcssPlugin.postcss=!0;export{postcssPlugin as default};
