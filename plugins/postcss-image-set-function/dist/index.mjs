import e from"postcss-value-parser";const t=/^(cross-fade|image|(repeating-)?(conic|linear|radial)-gradient|url|var)$/i;function getImage(n){return!(!n||!n.type)&&("string"===n.type?"url("+e.stringify(n)+")":!("function"!==n.type||!t.test(n.value.toLowerCase()))&&e.stringify(n))}const n={dpcm:2.54,dpi:1,dppx:96,x:96};function getMedia(e,t,i){if("boolean"==typeof e)return!1;const r=Math.floor(e/n.x*100)/100;return t.atRule({name:"media",params:`(-webkit-min-device-pixel-ratio: ${r}), (min-resolution: ${e}dpi)`,source:i.source})}function getMediaDPI(t){if(!t)return!1;if("word"!==t.type)return!1;if(!isNumericNode(t))return!1;const i=e.unit(t.value);return!!i&&(i.unit.toLowerCase()in n&&Number(i.number)*n[i.unit.toLowerCase()])}function isNumericNode(t){if(!t||!t.value)return!1;try{return!1!==e.unit(t.value)}catch(e){return!1}}const handleInvalidation=(e,t,n)=>{if("warn"===e.oninvalid)e.decl.warn(e.result,t,{word:String(n)});else if("throw"===e.oninvalid)throw e.decl.error(t,{word:String(n)})},processImageSet=(t,n,i)=>{const r=n.parent,o=new Map,a=n.value;for(let r=0;r<t.length;r++){const{imageSetFunction:l,imageSetOptionNodes:u}=t[r],c=new Map,d=u.length;let p=-1;for(;p<d;){const t=p<0||(s=u[p],"div"===Object(s).type&&","===Object(s).value),r=getImage(u[p+1]),d=getMediaDPI(u[p+2]),f=getMedia(d,i.postcss,n);if(!t)return void handleInvalidation(i,"expected a comma",e.stringify(u));if(!r)return void handleInvalidation(i,"unexpected image",e.stringify(u));if(!f||!d||c.has(d))return void handleInvalidation(i,"unexpected resolution",e.stringify(u));if(c.set(d,f),o.has(d)){const t=o.get(d);t.value=t.value.replace(e.stringify(l),r.trim()),o.set(d,t)}else o.set(d,{atRule:f,value:a.replace(e.stringify(l),r.trim())});p+=3}}var s;for(const{atRule:e,value:t}of o.values()){const i=r.clone().removeAll(),o=n.clone({value:t});i.append(o),e.append(i)}const l=Array.from(o.keys()).sort(((e,t)=>e-t)).map((e=>o.get(e).atRule));if(!l.length)return;const u=l[0],c=l.slice(1);c.length&&r.after(c);const d=u.nodes[0].nodes[0];n.cloneBefore({value:d.value.trim()}),i.preserve||(n.remove(),r.nodes.length||r.remove())},i=/(^|[^\w-])(-webkit-)?image-set\(/i,r=/^(-webkit-)?image-set$/i,creator=t=>{const n=!("preserve"in Object(t))||Boolean(t.preserve),o="onInvalid"in Object(t)?t.onInvalid:"ignore";if("oninvalid"in Object(t))throw new Error('"oninvalid" was changed to "onInvalid" to match other plugins with similar options');return{postcssPlugin:"postcss-image-set-function",Declaration(t,{result:a,postcss:s}){const l=t.value;if(!i.test(l.toLowerCase()))return;let u;try{u=e(l)}catch(e){t.warn(a,`Failed to parse value '${l}' as an image-set function. Leaving the original value intact.`)}if(void 0===u)return;const c=[];u.walk((n=>{if("function"!==n.type)return;if(!r.test(n.value.toLowerCase()))return;let i=!1;if(e.walk(n.nodes,(e=>{"function"===e.type&&r.test(e.value.toLowerCase())&&(i=!0)})),i)return handleInvalidation({decl:t,oninvalid:o,result:a},"nested image-set functions are not allowed",e.stringify(n)),!1;const s=n.nodes.filter((e=>"comment"!==e.type&&"space"!==e.type));c.push({imageSetFunction:n,imageSetOptionNodes:s})})),processImageSet(c,t,{decl:t,oninvalid:o,preserve:n,result:a,postcss:s})}}};creator.postcss=!0;export{creator as default};
