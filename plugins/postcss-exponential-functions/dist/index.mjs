import{calc as e}from"@csstools/css-calc";const s=/(?:exp|hypot|log|pow|sqrt)\(/i,creator=o=>{const t=Object.assign({preserve:!1},o);return{postcssPlugin:"postcss-exponential-functions",Declaration(o){if(!s.test(o.value))return;const r=e(o.value);r!==o.value&&(o.cloneBefore({value:r}),t.preserve||o.remove())}}};creator.postcss=!0;export{creator as default};
