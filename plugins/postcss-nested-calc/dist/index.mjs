import e from"postcss-value-parser";const t=/calc\(/gim;function hasFallback(e){const t=e.parent;if(!t)return!1;const r=t.index(e);for(let a=0;a<r;a++){const r=t.nodes[a];if("decl"===r.type&&r.prop.toLowerCase()===e.prop.toLowerCase())return!0}return!1}const creator=r=>{const a=Object.assign({preserve:!0},r);return{postcssPlugin:"postcss-nested-calc",Declaration(r,{result:o}){if((r.value.match(t)||[]).length<2)return;if(r.variable)return;if(hasFallback(r))return;const n=r.value;let s;try{s=e(n)}catch(e){return void r.warn(o,`Failed to parse value '${n}'. Leaving the original value intact.`)}if(void 0===s)return;e.walk(s.nodes,(t=>{t.type&&"function"===t.type&&"calc"===t.value.toLowerCase()&&e.walk(t.nodes,(e=>{if(e.type&&"function"===e.type)return"calc"===e.value.toLowerCase()&&void(e.value="")}))}),!0);const c=String(s);c!==n&&(r.cloneBefore({value:c}),a.preserve||r.remove())}}};creator.postcss=!0;export{creator as default};
