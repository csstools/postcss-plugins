const e=["column-gap","gap","row-gap"],creator=o=>{const r=Object.assign({preserve:!0},o);return{postcssPlugin:"postcss-gap-properties",Declaration(o){if(!e.includes(o.prop.toLowerCase()))return;if(!o.parent.some((e=>"decl"===e.type&&("display"===e.prop.toLowerCase()&&"grid"===e.value.toLowerCase()))))return;const p=`grid-${o.prop.toLowerCase()}`;o.parent.some((e=>"decl"===e.type&&e.prop.toLowerCase()===p))||(o.cloneBefore({prop:p}),r.preserve||o.remove())}}};creator.postcss=!0;export{creator as default};
