"use strict";var e=require("@csstools/css-calc");const creator=s=>{const o=Object.assign({preserve:!1,onInvalid:""},s);return{postcssPlugin:"postcss-stepped-value-functions",Declaration(s){const r=["mod(","rem(","round("],t=r.some((e=>s.value.toLowerCase().includes(e)));if(!s||!t)return;const c=e.convert(s.value,{precision:5});if(c===s.value)return;r.some((e=>c.toLowerCase().includes(e)))||(s.cloneBefore({value:c}),o.preserve||s.remove())}}};creator.postcss=!0,module.exports=creator;
