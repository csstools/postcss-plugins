"use strict";var e=require("postcss-value-parser"),l=new Map([["block,flow","block"],["block,flow-root","flow-root"],["inline,flow","inline"],["inline,flow-root","inline-block"],["run-in,flow","run-in"],["list-item,block,flow","list-item"],["inline,flow,list-item","inline list-item"],["block,flex","flex"],["inline,flex","inline-flex"],["block,grid","grid"],["inline,grid","inline-grid"],["inline,ruby","ruby"],["block,table","table"],["inline,table","inline-table"],["table-cell,flow","table-cell"],["table-caption,flow","table-caption"],["ruby-base,flow","ruby-base"],["ruby-text,flow","ruby-text"]]);function transform(n){const{nodes:t}=e(n);if(1===t.length)return n;const o=t.filter((e=>"word"===e.type)).map((e=>e.value.toLowerCase()));if(o.length<=1)return n;const i=l.get(o.join(","));return i||n}const n=/^display$/i,creator=e=>{const l=!("preserve"in Object(e))||Boolean(e?.preserve);return{postcssPlugin:"postcss-normalize-display-values",prepare(){const e=new Map;return{Declaration(t){if(!n.test(t.prop))return;const o=t.value;if(!o)return;if(e.has(o))return void(t.value!==e.get(o)&&(t.cloneBefore({value:e.get(o)}),l||t.remove()));const i=transform(o);e.set(o,i),t.value!==i&&(t.cloneBefore({value:i}),l||t.remove())}}}}};creator.postcss=!0,module.exports=creator;
