var o;function transformAxes(o,e){var t;const i=e?"-x":"-y",r=e?"-y":"-x",n=o.prop.toLowerCase().replace("-inline",i).replace("-block",r),l=o.value;null!=(t=o.parent)&&t.some((o=>"decl"==o.type&&o.prop===n&&o.value===l))||(o.cloneBefore({prop:n,value:l}),o.remove())}!function(o){o.TopToBottom="top-to-bottom",o.BottomToTop="bottom-to-top",o.RightToLeft="right-to-left",o.LeftToRight="left-to-right"}(o||(o={}));const creator=e=>{const t=Object.assign({inlineDirection:o.LeftToRight},e),i=Object.values(o);if(!i.includes(t.inlineDirection))throw new Error(`[postcss-logical-float-and-clear] "inlineDirection" must be one of ${i.join(", ")}`);const r=[o.LeftToRight,o.RightToLeft].includes(t.inlineDirection);return{postcssPlugin:"postcss-logical-overscroll-behavior",Declaration:{"overscroll-behavior-block":o=>transformAxes(o,r),"overscroll-behavior-inline":o=>transformAxes(o,r)}}};creator.postcss=!0;export{creator as default};
