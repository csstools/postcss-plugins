"use strict";var e=require("postcss-value-parser");function isVarNode(e){return"function"===e.type&&"var"===e.value.toLowerCase()}function validateArgumentsAndTypes(n,t,o,r){const u=[];let a=!1;if(n.nodes.forEach((e=>{"word"!==e.type?isVarNode(e)&&(a=!0):u.push(e)})),a)return void optionallyWarn(t,o,`Failed to transform ${t.value} as variables can't be processed.`,r);if(2!==u.length)return void optionallyWarn(t,o,`Failed to transform ${t.value} as it's expecting 2 arguments instead of ${u.length}`,r);const s=e.unit(u[0].value),i=e.unit(u[1].value);if(s&&i){if(s.unit===i.unit)return[s,i];optionallyWarn(t,o,`Failed to transform ${t.value} as the units don't match`,r)}}function optionallyWarn(e,n,t,o){"warn"===o.onInvalid&&e.warn(n,t)}function functionNodeToWordNode(e){delete e.nodes;const n=e;return n.type="word",n}function transformModFunction(n,t,o){const r=e(n.value);return r.walk((e=>{if("function"!==e.type||"mod"!==e.value.toLowerCase())return;const r=validateArgumentsAndTypes(e,n,t,o);if(!r)return;const[u,a]=r,s=Number(u.number),i=Number(a.number),l=(s%i+i)%i;if("number"!=typeof l||isNaN(l))return;functionNodeToWordNode(e).value=0===l?"0":`${l}${u.unit}`}),!0),r.toString()}function transformRemFunction(n,t,o){const r=e(n.value);return r.walk((e=>{if("function"!==e.type||"rem"!==e.value.toLowerCase())return;const r=validateArgumentsAndTypes(e,n,t,o);if(!r)return;const[u,a]=r,s=Number(u.number)%Number(a.number);if("number"!=typeof s&&!isNaN(s))return;functionNodeToWordNode(e).value=0===s?"0":`${s}${u.unit}`}),!0),r.toString()}var n;!function(e){e.Nearest="nearest",e.Up="up",e.Down="down",e.ToZero="to-zero"}(n||(n={}));const t=/^[a-z|-]+$/i;function transformRoundFunction(o,r,u){const a=e(o.value);return a.walk((a=>{if("function"!==a.type||"round"!==a.value.toLowerCase())return;if(3!==a.nodes.length&&5!==a.nodes.length)return void optionallyWarn(o,r,`Failed to transform ${o.value} as the amount of arguments isn't valid`,u);const s=a.nodes.filter((e=>"word"===e.type)),i=s[0].value;let l,d,c;if(t.test(i.toLowerCase())){var f,v;if(!Object.values(n).includes(i.toLowerCase()))return void optionallyWarn(o,r,`Failed to transform ${o.value} as ${i} is not a valid rounding strategy.`,u);l=i.toLowerCase(),d=e.unit((null==s||null==(f=s[1])?void 0:f.value)||""),c=e.unit((null==s||null==(v=s[2])?void 0:v.value)||"")}else{var m,p;l=n.Nearest,d=e.unit((null==s||null==(m=s[0])?void 0:m.value)||""),c=e.unit((null==s||null==(p=s[1])?void 0:p.value)||"")}if(!d||!c)return;if(d.unit!==c.unit)return void optionallyWarn(o,r,`Failed to transform ${o.value} as the units don't match`,u);const N=Number(d.number),b=Number(c.number);let w;switch(l){case n.Down:w=Math.floor(N/b)*b;break;case n.Up:w=Math.ceil(N/b)*b;break;case n.ToZero:w=Math.trunc(N/b)*b;break;case n.Nearest:default:w=Math.round(N/b)*b}if("number"!=typeof w||isNaN(w))return;functionNodeToWordNode(a).value=0===w?"0":`${w}${d.unit}`}),!0),a.toString()}const creator=e=>{const n=Object.assign({preserve:!1,onInvalid:""},e);return{postcssPlugin:"postcss-stepped-value-functions",Declaration(e,{result:t}){const o=["mod(","rem(","round("].some((n=>e.value.toLowerCase().includes(n)));if(!e||!o)return;const r=e.clone();if(r.value.toLowerCase().includes("mod(")){const e=transformModFunction(r,t,n);e&&(r.value=e)}if(r.value.toLowerCase().includes("rem(")){const e=transformRemFunction(r,t,n);e&&(r.value=e)}if(r.value.toLowerCase().includes("round(")){const e=transformRoundFunction(r,t,n);e&&(r.value=e)}e.value!==r.value&&(e.before(r),n.preserve||e.remove())}}};creator.postcss=!0,module.exports=creator;
