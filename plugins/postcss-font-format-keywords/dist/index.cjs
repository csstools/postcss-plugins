"use strict";var e=require("postcss-value-parser");function hasFallback(e){const t=e.parent;if(!t)return!1;const o=e.prop.toLowerCase(),r=t.index(e);for(let e=0;e<r;e++){const r=t.nodes[e];if("decl"===r.type&&r.prop.toLowerCase()===o)return!0}return!1}const t=["woff","truetype","opentype","woff2","embedded-opentype","collection","svg"],creator=o=>{const r="preserve"in Object(o)&&Boolean(o?.preserve);return{postcssPlugin:"postcss-font-format-keywords",Declaration(o){if("src"!==o.prop.toLowerCase())return;if(!o.value.toLowerCase().includes("format("))return;if(hasFallback(o))return;const s=o.parent;if(!s||"atrule"!==s.type)return;if("font-face"!==s.name.toLowerCase())return;const n=e(o.value);n.walk((o=>{"function"===o.type&&"format"===o.value.toLowerCase()&&o.nodes.forEach((o=>{"word"===o.type&&t.includes(o.value.toLowerCase())&&(o.value=e.stringify({type:"string",value:o.value,quote:'"'}))}))})),n.toString()!==o.value&&(o.cloneBefore({value:n.toString()}),r||o.remove())}}};creator.postcss=!0,module.exports=creator;
