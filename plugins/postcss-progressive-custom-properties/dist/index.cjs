"use strict";var e=require("postcss-value-parser");const a=[{supports:"color-mix(in lch, red, blue)",property:"color",sniff:"color-mix",matchers:[{type:"function",value:"color-mix",nodes:[{type:"word",value:"in"},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0}]},{type:"function",value:"color-mix",nodes:[{type:"word",value:"in"},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0}]},{type:"function",value:"color-mix",nodes:[{type:"word",value:"in"},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color-mix",nodes:[{type:"word",value:"in"},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color-mix",nodes:[{type:"word",value:"in"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0}]},{type:"function",value:"color-mix",nodes:[{type:"word",value:"in"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0}]},{type:"function",value:"color-mix",nodes:[{type:"word",value:"in"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color-mix",nodes:[{type:"word",value:"in"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]}]},{supports:"rgb(from red r g b)",property:"color",sniff:"from ",matchers:[{type:"function",value:"rgb",nodes:[{type:"word",value:"from"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"rgb",nodes:[{type:"word",value:"from"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]},{type:"function",value:"hsl",nodes:[{type:"word",value:"from"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"hsl",nodes:[{type:"word",value:"from"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]},{type:"function",value:"hwb",nodes:[{type:"word",value:"from"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"hwb",nodes:[{type:"word",value:"from"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]},{type:"function",value:"lch",nodes:[{type:"word",value:"from"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"lch",nodes:[{type:"word",value:"from"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]},{type:"function",value:"oklch",nodes:[{type:"word",value:"from"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"oklch",nodes:[{type:"word",value:"from"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]},{type:"function",value:"lab",nodes:[{type:"word",value:"from"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"lab",nodes:[{type:"word",value:"from"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]},{type:"function",value:"oklab",nodes:[{type:"word",value:"from"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"oklab",nodes:[{type:"word",value:"from"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]},{type:"function",value:"color",nodes:[{type:"word",value:"from"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color",nodes:[{type:"word",value:"from"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"color(srgb 0 0 0)",property:"color",sniff:"color",matchers:[{type:"function",value:"color",nodes:[{type:"word",value:"srgb"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color",nodes:[{type:"word",value:"srgb"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"color(srgb-linear 0 0 0)",property:"color",sniff:"color",matchers:[{type:"function",value:"color",nodes:[{type:"word",value:"srgb-linear"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color",nodes:[{type:"word",value:"srgb-linear"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"color(a98-rgb 0 0 0)",property:"color",sniff:"color",matchers:[{type:"function",value:"color",nodes:[{type:"word",value:"a98-rgb"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color",nodes:[{type:"word",value:"a98-rgb"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"color(prophoto-rgb 0 0 0)",property:"color",sniff:"color",matchers:[{type:"function",value:"color",nodes:[{type:"word",value:"prophoto-rgb"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color",nodes:[{type:"word",value:"prophoto-rgb"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"color(display-p3 0 0 0)",property:"color",sniff:"color",matchers:[{type:"function",value:"color",nodes:[{type:"word",value:"display-p3"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color",nodes:[{type:"word",value:"display-p3"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"color(rec2020 0 0 0)",property:"color",sniff:"color",matchers:[{type:"function",value:"color",nodes:[{type:"word",value:"rec2020"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color",nodes:[{type:"word",value:"rec2020"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"color(xyz-d50 0 0 0)",property:"color",sniff:"color",matchers:[{type:"function",value:"color",nodes:[{type:"word",value:"xyz-d50"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color",nodes:[{type:"word",value:"xyz-d50"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"color(xyz-d65 0 0 0)",property:"color",sniff:"color",matchers:[{type:"function",value:"color",nodes:[{type:"word",value:"xyz-d65"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color",nodes:[{type:"word",value:"xyz-d65"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"color(xyz 0 0 0)",property:"color",sniff:"color",matchers:[{type:"function",value:"color",nodes:[{type:"word",value:"xyz"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"color",nodes:[{type:"word",value:"xyz"},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"hsl(0, 0%, 0%)",property:"color",sniff:"hsl",matchers:[{type:"function",value:"hsl",nodes:[{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0}]}]},{supports:"hsl(0 0% 0% / 0)",property:"color",sniff:"hsl",matchers:[{type:"function",value:"hsl",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"hsl",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"hsla(0 0% 0% / 0)",property:"color",sniff:"hsla",matchers:[{type:"function",value:"hsla",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"hwb(0 0% 0%)",property:"color",sniff:"hwb",matchers:[{type:"function",value:"hwb",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"hwb",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"lab(0% 0 0)",property:"color",sniff:"lab",matchers:[{type:"function",value:"lab",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"lab",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"lch(0% 0 0)",property:"color",sniff:"lch",matchers:[{type:"function",value:"lch",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"lch",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"oklab(0% 0 0)",property:"color",sniff:"oklab",matchers:[{type:"function",value:"oklab",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"oklab",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"oklch(0% 0 0)",property:"color",sniff:"oklch",matchers:[{type:"function",value:"oklch",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"oklch",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"rgb(0, 0, 0, 0)",property:"color",sniff:"rgb",matchers:[{type:"function",value:"rgb",nodes:[{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0},{type:"div",value:","},{type:"word",isVariable:!0}]}]},{supports:"rgb(0 0 0 / 0)",property:"color",sniff:"rgb",matchers:[{type:"function",value:"rgb",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0}]},{type:"function",value:"rgb",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"rgba(0 0 0 / 0)",property:"color",sniff:"rgba",matchers:[{type:"function",value:"rgba",nodes:[{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"space"},{type:"word",isVariable:!0},{type:"div",value:"/"},{type:"word",isVariable:!0}]}]},{supports:"1ic",property:"font-size",sniff:"ic",matchers:[{type:"word",value:"1ic",dimension:{unit:"ic"}}]}];function matches(e,a){if(e.isVariable&&a&&("word"===a.type||"string"===a.type||"function"===a.type))return!0;if(e.type!==a.type)return!1;if(doesNotMatchValue(e,a))return!1;if(e.nodes&&a.nodes){for(let r=0;r<Math.max(e.nodes.length,a.nodes.length);r++){let p=r,t=r;for(;e.nodes[p]&&"space"===e.nodes[p].type;)p++;for(;a.nodes[t]&&"space"===a.nodes[t].type;)t++;if(!!e.nodes[p]!=!!a.nodes[t])return!1;if(!matches(e.nodes[p],a.nodes[t]))return!1}return!0}return!0}function doesNotMatchValue(e,a){var r,p,t,i;return("space"!==e.type||"space"!==a.type||(null==(r=e.value)?void 0:r.trim())!==(null==(p=a.value)?void 0:p.trim()))&&(e.dimension&&a.dimension?e.dimension.unit!==a.dimension.unit:"string"===e.type?e.value!==a.value:(null==(t=e.value)?void 0:t.toLowerCase())!==(null==(i=a.value)?void 0:i.toLowerCase()))}const r=["at","bottom","center","circle","closest-corner","closest-side","ellipse","farthest-corner","farthest-side","from","in","left","right","to","top"];function doublePositionGradients(e){const a=[],p=e.value.toLowerCase();if("function"===e.type&&("conic-gradient"===p||"linear-gradient"===p||"radial-gradient"===p||"repeating-conic-gradient"===p||"repeating-linear-gradient"===p||"repeating-radial-gradient"===p)){let p=0,t=!1,i=!1;e:for(let o=0;o<e.nodes.length;o++){const s=e.nodes[o];if("word"===s.type&&r.includes(s.value.toLowerCase())&&(t=!0),"div"!==s.type||","!==s.value.trim())if("word"!==s.type||"in"!==s.value.toLowerCase()){if("word"!==s.type&&"function"!==s.type||p++,i)switch(e.value.toLowerCase()){case"conic-gradient":a.push("(background: conic-gradient(in oklch, red 0deg, red 0deg 1deg, red 2deg))");break e;case"linear-gradient":a.push("(background: linear-gradient(in oklch, red 0%, red 0% 1%, red 2%))");break e;case"radial-gradient":a.push("(background: radial-gradient(in oklch, red, red 1px 2px, red 3px))");break e;case"repeating-conic-gradient":a.push("(background: repeating-conic-gradient(in oklch from 0deg, red 0deg, red 0deg 1deg, red 2deg))");break e;case"repeating-linear-gradient":a.push("(background: repeating-linear-gradient(in oklch, red 0%, red 0% 1%, red 2%))");break e;case"repeating-radial-gradient":a.push("(background: repeating-radial-gradient(in oklch, red, red 1px 2px, red 3px))");break e}if(!t&&3===p)switch(e.value.toLowerCase()){case"conic-gradient":a.push("(background: conic-gradient(red 0deg, red 0deg 1deg, red 2deg))");break e;case"linear-gradient":a.push("(background: linear-gradient(red 0%, red 0% 1%, red 2%))");break e;case"radial-gradient":a.push("(background: radial-gradient(red, red 1px 2px, red 3px))");break e;case"repeating-conic-gradient":a.push("(background: repeating-conic-gradient(from 0deg, red 0deg, red 0deg 1deg, red 2deg))");break e;case"repeating-linear-gradient":a.push("(background: repeating-linear-gradient(red 0%, red 0% 1%, red 2%))");break e;case"repeating-radial-gradient":a.push("(background: repeating-radial-gradient(red, red 1px 2px, red 3px))");break e}}else i=!0;else p=0,t=!1}}return a}const p=/^var$/i;function supportConditionsFromValue(r,t=!1){const i=[],o=a.filter((e=>r.includes(e.sniff)));let s=!1;try{e(r).walk((a=>{"function"===a.type&&p.test(a.value)&&(s=!0);try{const r=e.unit(a.value);!1!==r&&(a.dimension=r)}catch{}for(let e=0;e<o.length;e++){const r=o[e];for(let e=0;e<r.matchers.length;e++){if(matches(r.matchers[e],a))return void i.push(`(${r.property}: ${r.supports})`)}}i.push(...doublePositionGradients(a))}))}catch(e){}return t&&!s?[]:(s&&i.length>0&&i.push("(top: var(--f))"),Array.from(new Set(i)))}const t=/var\(/i,i=/^initial$/i,o=/^\s*$/,creator=()=>({postcssPlugin:"postcss-progressive-custom-properties",RuleExit:(e,{postcss:a})=>{const r=[],p=new Map,s=new Set;e.each((y=>{if("decl"!==y.type)return;if(y.variable){if(!s.has(y.prop))return void s.add(y.prop)}else{const e=y.prop.toLowerCase();if(!s.has(e))return void s.add(e)}if(!y.variable&&!t.test(y.value))return;if(i.test(y.value))return;if(o.test(y.value))return;const l=!y.variable,d=supportConditionsFromValue(y.value,l);if(!d.length)return;const c=d.join(" and ");if(r.length&&r[r.length-1].params===c){const e=r[r.length-1],a=p.get(e);if(a)return a.append(y.clone()),void y.remove()}const n=a.atRule({name:"supports",params:c,source:e.source,raws:{before:"\n\n",after:"\n"}}),u=e.clone();u.removeAll(),u.raws.before="\n",u.append(y.clone()),y.remove(),p.set(n,u),n.append(u),r.push(n)})),0!==r.length&&r.reverse().forEach((a=>{e.after(a)}))}});creator.postcss=!0,module.exports=creator;
