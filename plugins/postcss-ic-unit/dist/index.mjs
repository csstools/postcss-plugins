import e from"@csstools/postcss-progressive-custom-properties";import s from"postcss-value-parser";function hasFallback(e){const s=e.parent;if(!s)return!1;const t=e.prop.toLowerCase(),r=s.index(e);for(let e=0;e<r;e++){const r=s.nodes[e];if("decl"===r.type&&r.prop.toLowerCase()===t)return!0}return!1}function hasSupportsAtRuleAncestor(e){let s=e.parent;for(;s;)if("atrule"===s.type){if("supports"===s.name.toLowerCase()&&/\(font-size: \d+ic\)/i.test(s.params))return!0;s=s.parent}else s=s.parent;return!1}const basePlugin=e=>({postcssPlugin:"postcss-ic-unit",Declaration(t){if(!t.value.toLowerCase().includes("ic"))return;if(hasFallback(t))return;if(hasSupportsAtRuleAncestor(t))return;const r=s(t.value);r.walk((e=>{if(!e.type||"word"!==e.type)return;const t=s.unit(e.value);t&&"ic"===t.unit.toLowerCase()&&(e.value=`${t.number}em`)}));const o=String(r);o!==t.value&&(t.cloneBefore({value:o}),null!=e&&e.preserve||t.remove())}});basePlugin.postcss=!0;const postcssPlugin=s=>{const t=Object.assign({preserve:!1,enableProgressiveCustomProperties:!0},s);return t.enableProgressiveCustomProperties&&t.preserve?{postcssPlugin:"postcss-ic-unit",plugins:[e(),basePlugin(t)]}:basePlugin(t)};postcssPlugin.postcss=!0;export{postcssPlugin as default};
