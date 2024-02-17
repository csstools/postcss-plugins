"use strict";var e=require("postcss-value-parser"),s=require("@csstools/utilities");const creator=t=>{const r=Object.assign({preserve:!1},t);return{postcssPlugin:"postcss-color-hex-alpha",Declaration(t){if(!/#([0-9A-Fa-f]{4}(?:[0-9A-Fa-f]{4})?)\b/.test(t.value))return;if(s.hasFallback(t))return;const{value:a}=t,l=e(a);l.walk((e=>{if("function"===e.type&&"url"===e.value)return!1;isAlphaHex(e)&&hexa2rgba(e)}));const c=l.toString();c!==a&&(t.cloneBefore({value:c}),r.preserve||t.remove())}}};function isAlphaHex(e){return"word"===e.type&&/^#([0-9A-Fa-f]{4}(?:[0-9A-Fa-f]{4})?)$/.test(e.value)}creator.postcss=!0;const t=1e5,hexa2rgba=e=>{const s=e.value,r=`0x${5===s.length?s.slice(1).replace(/[0-9A-Fa-f]/g,"$&$&"):s.slice(1)}`,[a,l,c,n]=[parseInt(r.slice(2,4),16),parseInt(r.slice(4,6),16),parseInt(r.slice(6,8),16),Math.round(parseInt(r.slice(8,10),16)/255*t)/t];e.value=`rgba(${a},${l},${c},${n})`};module.exports=creator;
