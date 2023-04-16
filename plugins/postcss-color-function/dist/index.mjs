import s from"@csstools/postcss-progressive-custom-properties";import{tokenize as r}from"@csstools/css-tokenizer";import{color as e,SyntaxFlag as o,serializeRGB as t}from"@csstools/css-color-parser";import{replaceComponentValues as n,parseCommaSeparatedListOfComponentValues as c,isFunctionNode as a,stringify as p}from"@csstools/css-parser-algorithms";function hasFallback(s){const r=s.parent;if(!r)return!1;const e=s.prop.toLowerCase(),o=r.index(s);for(let s=0;s<o;s++){const o=r.nodes[s];if("decl"===o.type&&o.prop.toLowerCase()===e)return!0}return!1}function hasSupportsAtRuleAncestor(s){let r=s.parent;for(;r;)if("atrule"===r.type){if("supports"===r.name&&-1!==r.params.indexOf("color("))return!0;r=r.parent}else r=r.parent;return!1}const l=/(color)\(/i,i=/^(color)$/i,basePlugin=s=>({postcssPlugin:"postcss-color-function",Declaration:u=>{const f=u.value;if(!l.test(f.toLowerCase()))return;if(hasFallback(u))return;if(hasSupportsAtRuleAncestor(u))return;const m=r({css:f}),g=n(c(m),(s=>{if(a(s)&&i.test(s.getName())){const r=e(s);if(!r)return;if(r.syntaxFlags.has(o.HasNoneKeywords))return;if(r.syntaxFlags.has(o.RelativeColorSyntax))return;return t(r)}})),v=p(g);v!==f&&(u.cloneBefore({value:v}),null!=s&&s.preserve||u.remove())}});basePlugin.postcss=!0;const postcssPlugin=r=>{const e=Object.assign({preserve:!1,enableProgressiveCustomProperties:!0},r);return e.enableProgressiveCustomProperties&&e.preserve?{postcssPlugin:"postcss-color-function",plugins:[s(),basePlugin(e)]}:basePlugin(e)};postcssPlugin.postcss=!0;export{postcssPlugin as default};
