import s from"@csstools/postcss-progressive-custom-properties";import{tokenize as e}from"@csstools/css-tokenizer";import{color as r,SyntaxFlag as t,serializeRGB as o,colorDataFitsRGB_Gamut as n,serializeP3 as a}from"@csstools/css-color-parser";import{replaceComponentValues as i,parseCommaSeparatedListOfComponentValues as u,isFunctionNode as l,stringify as c}from"@csstools/css-parser-algorithms";function hasFallback(s){const e=s.parent;if(!e)return!1;const r=s.prop.toLowerCase(),t=e.index(s);for(let s=0;s<t;s++){const t=e.nodes[s];if("decl"===t.type&&t.prop.toLowerCase()===r)return!0}return!1}function hasSupportsAtRuleAncestor(s){let e=s.parent;for(;e;)if("atrule"===e.type){if("supports"===e.name.toLowerCase()&&-1!==e.params.toLowerCase().indexOf("color-mix("))return!0;e=e.parent}else e=e.parent;return!1}const p=/(color-mix)\(/i,f=/^(color-mix)$/i,basePlugin=s=>({postcssPlugin:"postcss-color-mix-function",Declaration:m=>{const b=m.value;if(!p.test(b))return;if(hasFallback(m))return;if(hasSupportsAtRuleAncestor(m))return;const g=e({css:b}),P=i(u(g),(s=>{if(l(s)&&f.test(s.getName())){const e=r(s);if(!e)return;if(e.syntaxFlags.has(t.Experimental))return;return o(e)}})),d=c(P);if(d===b)return;let v=d;null!=s&&s.subFeatures.displayP3&&(v=c(i(u(g),(s=>{if(l(s)&&f.test(s.getName())){const e=r(s);if(!e)return;return n(e)?o(e):a(e)}})))),m.cloneBefore({value:d}),null!=s&&s.subFeatures.displayP3&&v!==d&&m.cloneBefore({value:v}),null!=s&&s.preserve||m.remove()}});basePlugin.postcss=!0;const creator=e=>{const r=Object.assign({enableProgressiveCustomProperties:!0,preserve:!1,subFeatures:{displayP3:!0}},e);return r.subFeatures=Object.assign({displayP3:!0},r.subFeatures),r.enableProgressiveCustomProperties&&(r.preserve||r.subFeatures.displayP3)?{postcssPlugin:"postcss-color-mix-function",plugins:[s(),basePlugin(r)]}:basePlugin(r)};creator.postcss=!0;export{creator as default};
