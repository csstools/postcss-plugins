import s from"@csstools/postcss-progressive-custom-properties";import{tokenize as e}from"@csstools/css-tokenizer";import{color as r,SyntaxFlag as o,serializeRGB as t}from"@csstools/css-color-parser";import{replaceComponentValues as n,parseCommaSeparatedListOfComponentValues as a,isFunctionNode as c,stringify as p}from"@csstools/css-parser-algorithms";function hasFallback(s){const e=s.parent;if(!e)return!1;const r=s.prop.toLowerCase(),o=e.index(s);for(let s=0;s<o;s++){const o=e.nodes[s];if("decl"===o.type&&o.prop.toLowerCase()===r)return!0}return!1}function hasSupportsAtRuleAncestor(s){let e=s.parent;for(;e;)if("atrule"===e.type){if("supports"===e.name&&-1!==e.params.indexOf("color("))return!0;e=e.parent}else e=e.parent;return!1}const l=/(color)\(/i,i=/^(color)$/i,basePlugin=s=>({postcssPlugin:"postcss-color-function",Declaration:u=>{const f=u.value;if(!l.test(f))return;if(hasFallback(u))return;if(hasSupportsAtRuleAncestor(u))return;const m=e({css:f}),g=n(a(m),(s=>{if(!c(s)||!i.test(s.getName()))return;const e=r(s);return e&&!(e.syntaxFlags.has(o.Experimental)||e.syntaxFlags.has(o.HasNoneKeywords)||e.syntaxFlags.has(o.RelativeColorSyntax))?t(e):void 0})),v=p(g);v!==f&&(u.cloneBefore({value:v}),s?.preserve||u.remove())}});basePlugin.postcss=!0;const postcssPlugin=e=>{const r=Object.assign({preserve:!1,enableProgressiveCustomProperties:!0},e);return r.enableProgressiveCustomProperties&&r.preserve?{postcssPlugin:"postcss-color-function",plugins:[s(),basePlugin(r)]}:basePlugin(r)};postcssPlugin.postcss=!0;export{postcssPlugin as default};
