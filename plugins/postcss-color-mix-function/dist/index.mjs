import s from"@csstools/postcss-progressive-custom-properties";import{color as e,SyntaxFlag as r,serializeRGB as t,colorDataFitsRGB_Gamut as o,serializeP3 as i}from"@csstools/css-color-parser";import{hasFallback as c,hasSupportsAtRuleAncestor as a}from"@csstools/utilities";import{replaceComponentValues as n,parseCommaSeparatedListOfComponentValues as l,isFunctionNode as u,stringify as p}from"@csstools/css-parser-algorithms";import{tokenize as m}from"@csstools/css-tokenizer";const f=/\b(?:color-mix)\(/i,g=/^(?:color-mix)$/i,basePlugin=s=>({postcssPlugin:"postcss-color-mix-function",Declaration(v){const b=v.value;if(!f.test(b))return;if(c(v))return;if(a(v,f))return;const P=m({css:b}),x=n(l(P),(s=>{if(!u(s)||!g.test(s.getName()))return;const o=e(s);return o&&!o.syntaxFlags.has(r.Experimental)?t(o):void 0})),d=p(x);if(d===b)return;let F=d;s?.subFeatures.displayP3&&(F=p(n(l(P),(s=>{if(!u(s)||!g.test(s.getName()))return;const c=e(s);return c&&!c.syntaxFlags.has(r.Experimental)?o(c)?t(c):i(c):void 0})))),v.cloneBefore({value:d}),s?.subFeatures.displayP3&&F!==d&&v.cloneBefore({value:F}),s?.preserve||v.remove()}});basePlugin.postcss=!0;const postcssPlugin=e=>{const r=Object.assign({enableProgressiveCustomProperties:!0,preserve:!1,subFeatures:{displayP3:!0}},e);return r.subFeatures=Object.assign({displayP3:!0},r.subFeatures),r.enableProgressiveCustomProperties&&(r.preserve||r.subFeatures.displayP3)?{postcssPlugin:"postcss-color-mix-function",plugins:[s(),basePlugin(r)]}:basePlugin(r)};postcssPlugin.postcss=!0;export{postcssPlugin as default};
