import e from"postcss-value-parser";const creator=o=>{const r=Object.assign({preserve:!0},o);return{postcssPlugin:"postcss-overflow-shorthand",Declaration:(o,{result:t})=>{if("overflow"!==o.prop.toLowerCase())return;let s="",a="";const l=o.value;try{const o=e(l).nodes.slice().filter((e=>"comment"!==e.type&&"space"!==e.type));if(o.length<2)return;s=e.stringify(o[0]),a=e.stringify(o[1])}catch(e){return void o.warn(t,`Failed to parse value '${l}' as a shorthand for "overflow". Leaving the original value intact.`)}s&&a&&(s.toLowerCase()===a.toLowerCase()?o.cloneBefore({value:s}):(o.cloneBefore({prop:"overflow-x",value:s}),o.cloneBefore({prop:"overflow-y",value:a})),r.preserve||o.remove())}}};creator.postcss=!0;export{creator as default};
