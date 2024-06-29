"use strict";var e=require("postcss-value-parser"),o=require("@csstools/color-helpers");const r=/^text-decoration$/i,creator=o=>{const c=Object.assign({preserve:!0},o);return{postcssPlugin:"postcss-text-decoration-shorthand",prepare(){const o=new Map;return{postcssPlugin:"postcss-text-decoration-shorthand",OnceExit(){o.clear()},Declaration(u){if(!r.test(u.prop))return;const a=u.parent;if(!a)return;const i=a.index(u);if(a.nodes.some((e=>"decl"===e.type&&r.test(e.prop)&&o.get(u.value)===e.value&&a.index(e)!==i)))return;const d=e(u.value),p=d.nodes.filter((e=>"space"!==e.type&&"comment"!==e.type));if(p.find((e=>"var"===e.value.toLowerCase()&&"function"===e.type)))return;if(p.find((e=>"word"===e.type&&t.includes(e.value))))return;const f={line:[],style:null,color:null,thickness:null};for(let o=0;o<p.length;o++){const r=p[o];if(f.line.length||"word"!==r.type||!n.includes(r.value.toLowerCase()))if(f.line.length||"word"!==r.type||"none"!==r.value.toLowerCase())if(f.style||"word"!==r.type||!s.includes(r.value.toLowerCase()))if(f.thickness||"word"!==r.type||!l.includes(r.value.toLowerCase()))if(f.thickness||"function"!==r.type||"calc"!==r.value.toLowerCase())if(f.color||!nodeIsAColor(r)){if("word"!==r.type)return;{let o;try{o=e.unit(r.value)}catch{return}if(!o||!o.unit)return;f.thickness=r,"%"===o.unit&&(f.thickness={before:"",after:"",sourceIndex:0,sourceEndIndex:0,type:"function",value:"calc",nodes:[{before:"",after:"",sourceIndex:0,sourceEndIndex:0,type:"word",value:"0.01em"},{before:"",after:"",sourceIndex:0,sourceEndIndex:0,type:"space",value:" "},{before:"",after:"",sourceIndex:0,sourceEndIndex:0,type:"word",value:"*"},{before:"",after:"",sourceIndex:0,sourceEndIndex:0,type:"space",value:" "},{before:"",after:"",sourceIndex:0,sourceEndIndex:0,type:"word",value:o.number}]})}}else f.color=r;else f.thickness=r;else f.thickness=r;else f.style=r;else f.line.push(r);else{const e=r;let t=r;for(;;){const e=p[o+1];if(!e||"word"!==e.type||!n.includes(e.value.toLowerCase()))break;t=e,o++}f.line=d.nodes.slice(d.nodes.indexOf(e),d.nodes.indexOf(t)+1)}}f.line.length||f.line.push({before:"",after:"",sourceIndex:0,sourceEndIndex:0,type:"word",value:"none"}),f.style||(f.style={before:"",after:"",sourceIndex:0,sourceEndIndex:0,type:"word",value:"solid"}),f.color||(f.color={before:"",after:"",sourceIndex:0,sourceEndIndex:0,type:"word",value:"currentColor"});const v=e.stringify(f.line);if(u.value.toLowerCase()===v.toLowerCase()){const e=u.next();return void(e&&"decl"===e.type&&"text-decoration"===e.prop.toLowerCase()||u.cloneBefore({prop:"-webkit-text-decoration",value:v}))}u.cloneBefore({prop:"text-decoration",value:v});const y=e.stringify([...f.line,{before:"",after:"",sourceIndex:0,sourceEndIndex:0,type:"space",value:" "},f.style,{before:"",after:"",sourceIndex:0,sourceEndIndex:0,type:"space",value:" "},f.color]);f.thickness&&u.cloneBefore({prop:"text-decoration",value:y}),f.thickness&&u.cloneBefore({prop:"text-decoration-thickness",value:e.stringify([f.thickness])}),o.set(u.value,v),o.set(y,v),c.preserve||u.remove()}}}}};function nodeIsAColor(e){return!("word"!==e.type||!e.value.startsWith("#"))||(!("word"!==e.type||!u.includes(e.value.toLowerCase()))||!("function"!==e.type||!c.includes(e.value.toLowerCase())))}creator.postcss=!0;const t=["unset","inherit","initial","revert","revert-layer"],n=["underline","overline","line-through","blink","spelling-error","grammar-error"],s=["solid","double","dotted","dashed","wavy"],l=["auto","from-font"],c=["color","color-mix","hsl","hsla","hwb","lab","lch","oklab","oklch","rgb","rgba"],u=["currentcolor","transparent",...Object.keys(o.namedColors)];module.exports=creator;
