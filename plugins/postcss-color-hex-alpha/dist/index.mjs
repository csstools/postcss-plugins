import e from"postcss-value-parser";import{hasFallback as s}from"@csstools/utilities";const creator=a=>{const o=Object.assign({preserve:!1},a);return{postcssPlugin:"postcss-color-hex-alpha",Declaration(a){if(!t.test(a.value))return;if(s(a))return;const{value:l}=a,n=e(l);n.walk((e=>{if("function"===e.type&&"url"===e.value)return!1;"word"===e.type&&r.test(e.value)&&hexa2rgba(e)}));const c=n.toString();c!==l&&(a.cloneBefore({value:c}),o.preserve||a.remove())}}};creator.postcss=!0;const t=/#[0-9a-f]{4}(?:[0-9a-f]{4})?\b/i,r=/^#[0-9a-f]{4}(?:[0-9a-f]{4})?$/i,a=1e5,o=/[0-9a-f]/gi;function hexa2rgba(e){const s=e.value,t=`0x${5===s.length?s.slice(1).replace(o,"$&$&"):s.slice(1)}`,[r,l,n,c]=[parseInt(t.slice(2,4),16),parseInt(t.slice(4,6),16),parseInt(t.slice(6,8),16),Math.round(parseInt(t.slice(8,10),16)/255*a)/a];e.value=`rgba(${r},${l},${n},${c})`}export{creator as default};
