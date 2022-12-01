"use strict";var e=require("postcss-value-parser");const r=[{supports:"color(srgb 0 0 0)",property:"color",sniff:"color",matchers:[{type:"function",value:"color",nodes:[{type:"word",value:"srgb"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color",nodes:[{type:"word",value:"srgb"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"color(srgb-linear 0 0 0)",property:"color",sniff:"color",matchers:[{type:"function",value:"color",nodes:[{type:"word",value:"srgb-linear"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color",nodes:[{type:"word",value:"srgb-linear"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"color(a98-rgb 0 0 0)",property:"color",sniff:"color",matchers:[{type:"function",value:"color",nodes:[{type:"word",value:"a98-rgb"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color",nodes:[{type:"word",value:"a98-rgb"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"color(prophoto-rgb 0 0 0)",property:"color",sniff:"color",matchers:[{type:"function",value:"color",nodes:[{type:"word",value:"prophoto-rgb"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color",nodes:[{type:"word",value:"prophoto-rgb"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"color(display-p3 0 0 0)",property:"color",sniff:"color",matchers:[{type:"function",value:"color",nodes:[{type:"word",value:"display-p3"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color",nodes:[{type:"word",value:"display-p3"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"color(rec2020 0 0 0)",property:"color",sniff:"color",matchers:[{type:"function",value:"color",nodes:[{type:"word",value:"rec2020"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color",nodes:[{type:"word",value:"rec2020"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"color(xyz-d50 0 0 0)",property:"color",sniff:"color",matchers:[{type:"function",value:"color",nodes:[{type:"word",value:"xyz-d50"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color",nodes:[{type:"word",value:"xyz-d50"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"color(xyz-d65 0 0 0)",property:"color",sniff:"color",matchers:[{type:"function",value:"color",nodes:[{type:"word",value:"xyz-d65"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color",nodes:[{type:"word",value:"xyz-d65"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"color(xyz 0 0 0)",property:"color",sniff:"color",matchers:[{type:"function",value:"color",nodes:[{type:"word",value:"xyz"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color",nodes:[{type:"word",value:"xyz"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"hsl(0, 0%, 0%)",property:"color",sniff:"hsl",matchers:[{type:"function",value:"hsl",nodes:[{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0}]}]},{supports:"hsl(0 0% 0% / 0)",property:"color",sniff:"hsl",matchers:[{type:"function",value:"hsl",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"hsl",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"hsla(0 0% 0% / 0)",property:"color",sniff:"hsla",matchers:[{type:"function",value:"hsla",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"hwb(0 0% 0%)",property:"color",sniff:"hwb",matchers:[{type:"function",value:"hwb",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"hwb",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"lab(0% 0 0)",property:"color",sniff:"lab",matchers:[{type:"function",value:"lab",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"lab",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"lch(0% 0 0)",property:"color",sniff:"lch",matchers:[{type:"function",value:"lch",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"lch",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"oklab(0% 0 0)",property:"color",sniff:"oklab",matchers:[{type:"function",value:"oklab",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"oklab",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"oklch(0% 0 0)",property:"color",sniff:"oklch",matchers:[{type:"function",value:"oklch",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"oklch",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"rgb(0, 0, 0, 0)",property:"color",sniff:"rgb",matchers:[{type:"function",value:"rgb",nodes:[{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0}]}]},{supports:"rgb(0 0 0 / 0)",property:"color",sniff:"rgb",matchers:[{type:"function",value:"rgb",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"rgb",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"rgba(0 0 0 / 0)",property:"color",sniff:"rgba",matchers:[{type:"function",value:"rgba",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"color-mix(in oklch, #000, #fff)",property:"color",sniff:"color-mix",matchers:[{type:"function",value:"color-mix",nodes:[{type:"word",value:"in"},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0}]},{type:"function",value:"color-mix",nodes:[{type:"word",value:"in"},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0}]},{type:"function",value:"color-mix",nodes:[{type:"word",value:"in"},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color-mix",nodes:[{type:"word",value:"in"},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color-mix",nodes:[{type:"word",value:"in"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0}]},{type:"function",value:"color-mix",nodes:[{type:"word",value:"in"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0}]},{type:"function",value:"color-mix",nodes:[{type:"word",value:"in"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color-mix",nodes:[{type:"word",value:"in"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]}]},{supports:"1ic",property:"font-size",sniff:"ic",matchers:[{type:"word",value:"1ic",dimension:{unit:"ic"}}]}];function matches(e,r){if(e.isVariable&&r)return!0;if(e.type!==r.type)return!1;if(doesNotMatchValue(e,r))return!1;if(e.nodes&&r.nodes){for(let a=0;a<e.nodes.length;a++){let t=a,p=a;for(;e.nodes[t]&&"space"===e.nodes[t].type;)t++;for(;r.nodes[p]&&"space"===r.nodes[p].type;)p++;if(!!e.nodes[t]!=!!r.nodes[p])return!1;if(!matches(e.nodes[t],r.nodes[p]))return!1}return!0}return!0}function doesNotMatchValue(e,r){return("space"!==e.type||"space"!==r.type||e.value.trim()!==r.value.trim())&&(e.dimension&&r.dimension?e.dimension.unit!==r.dimension.unit:"string"===e.type?e.value!==r.value:e.value.toLowerCase()!==r.value.toLowerCase())}const a=["at","bottom","center","circle","closest-corner","closest-side","ellipse","farthest-corner","farthest-side","from","in","left","right","to","top"];function doublePositionGradients(e){const r=[],t=e.value.toLowerCase();if("function"===e.type&&("conic-gradient"===t||"linear-gradient"===t||"radial-gradient"===t||"repeating-conic-gradient"===t||"repeating-linear-gradient"===t||"repeating-radial-gradient"===t)){let t=0,p=!1,i=!1;e:for(let o=0;o<e.nodes.length;o++){const s=e.nodes[o];if("word"===s.type&&a.includes(s.value.toLowerCase())&&(p=!0),"div"!==s.type||","!==s.value.trim())if("word"!==s.type||"in"!==s.value.toLowerCase()){if("word"!==s.type&&"function"!==s.type||t++,i)switch(e.value.toLowerCase()){case"conic-gradient":r.push("(background: conic-gradient(in oklch, red 0deg, red 0deg 1deg, red 2deg))");break e;case"linear-gradient":r.push("(background: linear-gradient(in oklch, red 0%, red 0% 1%, red 2%))");break e;case"radial-gradient":r.push("(background: radial-gradient(in oklch, red, red 1px 2px, red 3px))");break e;case"repeating-conic-gradient":r.push("(background: repeating-conic-gradient(in oklch from 0deg, red 0deg, red 0deg 1deg, red 2deg))");break e;case"repeating-linear-gradient":r.push("(background: repeating-linear-gradient(in oklch, red 0%, red 0% 1%, red 2%))");break e;case"repeating-radial-gradient":r.push("(background: repeating-radial-gradient(in oklch, red, red 1px 2px, red 3px))");break e}if(!p&&3===t)switch(e.value.toLowerCase()){case"conic-gradient":r.push("(background: conic-gradient(red 0deg, red 0deg 1deg, red 2deg))");break e;case"linear-gradient":r.push("(background: linear-gradient(red 0%, red 0% 1%, red 2%))");break e;case"radial-gradient":r.push("(background: radial-gradient(red, red 1px 2px, red 3px))");break e;case"repeating-conic-gradient":r.push("(background: repeating-conic-gradient(from 0deg, red 0deg, red 0deg 1deg, red 2deg))");break e;case"repeating-linear-gradient":r.push("(background: repeating-linear-gradient(red 0%, red 0% 1%, red 2%))");break e;case"repeating-radial-gradient":r.push("(background: repeating-radial-gradient(red, red 1px 2px, red 3px))");break e}}else i=!0;else t=0,p=!1}}return r}function supportConditionsFromValue(a){const t=[],p=[];r.forEach((e=>{a.indexOf(e.sniff)>-1&&p.push(e)}));try{e(a).walk((r=>{try{r.dimension=e.unit(r.value)}finally{!1===r.dimension&&delete r.dimension}for(let e=0;e<p.length;e++){const a=p[e];for(let e=0;e<a.matchers.length;e++){if(matches(a.matchers[e],r))return void t.push(`(${a.property}: ${a.supports})`)}}t.push(...doublePositionGradients(r))}))}catch(e){}return Array.from(new Set(t))}const creator=()=>({postcssPlugin:"postcss-progressive-custom-properties",RuleExit:(e,{postcss:r})=>{const a=[],t=new Set;e.each((p=>{if("decl"!==p.type)return;if(!p.variable)return;if("initial"===p.value.trim().toLowerCase())return;if(""===p.value.trim())return;if(!t.has(p.prop.toString().toLowerCase()))return void t.add(p.prop.toString().toLowerCase());const i=supportConditionsFromValue(p.value);if(!i.length)return;const o=r.atRule({name:"supports",params:i.join(" and "),source:e.source,raws:{before:"\n\n",after:"\n"}}),s=e.clone();s.removeAll(),s.raws.before="\n",s.append(p.clone()),p.remove(),o.append(s),a.push(o)})),0!==a.length&&a.reverse().forEach((r=>{e.after(r)}))}});creator.postcss=!0,module.exports=creator;
