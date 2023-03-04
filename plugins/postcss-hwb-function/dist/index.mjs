import e from"postcss-value-parser";import{conversions as r}from"@csstools/color-helpers";import{tokenize as n}from"@csstools/css-tokenizer";import{parseCommaSeparatedListOfComponentValues as t,replaceComponentValues as o,isFunctionNode as u,stringify as i}from"@csstools/css-parser-algorithms";import{color as s}from"@csstools/css-color-parser";const a="(color: hwb(0 0% 0%))";function hasSupportsAtRuleAncestor(e){let r=e.parent;for(;r;)if("atrule"===r.type){if("supports"===r.name.toLowerCase()&&r.params.includes(a))return!0;r=r.parent}else r=r.parent;return!1}function onCSSFunctionSRgb(e){const n=e.nodes.slice().filter((e=>"comment"!==e.type&&"space"!==e.type)),t=hwbFunctionContents(n);if(!t)return;if(n.length>3&&(!t.slash||!t.alpha))return;e.value="rgb",transformAlpha(e,t.slash,t.alpha);const[o,u,i]=[(s=t).hNode,s.wNode,s.bNode];var s;const[a,c,l]=channelDimensions(t),p=[a.number,c.number,l.number].map((e=>parseFloat(e))),d=r.HWB_to_sRGB(p).map((e=>Math.round(255*e)));e.nodes.splice(e.nodes.indexOf(o)+1,0,{sourceIndex:0,sourceEndIndex:1,value:",",type:"div",before:"",after:""}),e.nodes.splice(e.nodes.indexOf(u)+1,0,{sourceIndex:0,sourceEndIndex:1,value:",",type:"div",before:"",after:""}),replaceWith(e.nodes,o,{...o,value:String(d[0])}),replaceWith(e.nodes,u,{...u,value:String(d[1])}),replaceWith(e.nodes,i,{...i,value:String(d[2])})}function isNumericNode(r){if(!r||"word"!==r.type)return!1;if(!canParseAsUnit(r))return!1;const n=e.unit(r.value);return!!n&&!!n.number}function isNumericNodeHueLike(r){if(!r||"word"!==r.type)return!1;if(!canParseAsUnit(r))return!1;const n=e.unit(r.value);if(!n)return!1;const t=n.unit.toLowerCase();return!!n.number&&("deg"===t||"grad"===t||"rad"===t||"turn"===t||""===t)}function isNumericNodePercentageOrNumber(r){if(!r||"word"!==r.type)return!1;if(!canParseAsUnit(r))return!1;const n=e.unit(r.value);return!!n&&("%"===n.unit||""===n.unit)}function isCalcNode(e){return e&&"function"===e.type&&"calc"===e.value.toLowerCase()}function isVarNode(e){return e&&"function"===e.type&&"var"===e.value.toLowerCase()}function hwbFunctionContents(r){if(!isNumericNodeHueLike(r[0]))return null;if(!isNumericNodePercentageOrNumber(r[1]))return null;if(!isNumericNodePercentageOrNumber(r[2]))return null;const n={h:e.unit(r[0].value),hNode:r[0],w:e.unit(r[1].value),wNode:r[1],b:e.unit(r[2].value),bNode:r[2]};return normalizeHueNode(n.h),""!==n.h.unit?null:(normalizeBlackOrWhiteNode(n.w),normalizeBlackOrWhiteNode(n.b),(t=r[3])&&"div"===t.type&&"/"===t.value&&(n.slash=r[3]),(isNumericNodePercentageOrNumber(r[4])||isCalcNode(r[4])||isVarNode(r[4]))&&(n.alpha=r[4]),n);var t}function channelDimensions(e){return[e.h,e.w,e.b]}function transformAlpha(r,n,t){if(!n||!t)return;if(r.value="rgba",n.value=",",n.before="",!isNumericNode(t))return;const o=e.unit(t.value);o&&"%"===o.unit&&(o.number=String(parseFloat(o.number)/100),t.value=String(o.number))}function replaceWith(e,r,n){const t=e.indexOf(r);e[t]=n}function normalizeHueNode(e){switch(e.unit.toLowerCase()){case"deg":return void(e.unit="");case"rad":return e.unit="",void(e.number=(180*parseFloat(e.number)/Math.PI).toString());case"grad":return e.unit="",void(e.number=(.9*parseFloat(e.number)).toString());case"turn":return e.unit="",void(e.number=(360*parseFloat(e.number)).toString())}}function normalizeBlackOrWhiteNode(e){if("%"!==e.unit)return e.unit="%",void(e.number=(100*parseFloat(e.number)).toString())}function canParseAsUnit(r){if(!r||!r.value)return!1;try{return!1!==e.unit(r.value)}catch(e){return!1}}function hasFallback(e){const r=e.parent;if(!r)return!1;const n=e.prop.toLowerCase(),t=r.index(e);for(let e=0;e<t;e++){const t=r.nodes[e];if("decl"===t.type&&t.prop.toLowerCase()===n)return!0}return!1}const c=/hwb\(/i,l=/hwb/i,postcssPlugin=e=>{const r="preserve"in Object(e)&&Boolean(null==e?void 0:e.preserve);return{postcssPlugin:"postcss-hwb-function",Declaration:(e,{result:p,postcss:d})=>{const f=e.value;if(!c.test(f))return;if(r&&hasSupportsAtRuleAncestor(e))return;if(hasFallback(e))return;{const e=n({css:f}),r=t(e),a=o(r,(e=>{u(e)&&l.test(e.getName())&&console.log(s(e))}));i(a)}const m=modifiedValues(f,e,p);if(void 0!==m)if(e.variable&&r&&e.parent){const r=e.parent,n=d.atRule({name:"supports",params:a,source:e.source}),t=r.clone();t.removeAll(),t.append(e.clone()),n.append(t),insertAtSupportsAfterCorrectRule(n,r,a),e.replaceWith(e.clone({value:m}))}else r?e.cloneBefore({value:m}):e.replaceWith(e.clone({value:m}))}}};function modifiedValues(r,n,t){let o;try{o=e(r)}catch(e){n.warn(t,`Failed to parse value '${r}' as a hwb function. Leaving the original value intact.`)}if(void 0===o)return;o.walk((e=>{e.type&&"function"===e.type&&"hwb"===e.value.toLowerCase()&&onCSSFunctionSRgb(e)}));const u=String(o);return u!==r?u:void 0}function insertAtSupportsAfterCorrectRule(e,r,n){let t=r,o=r.next();for(;t&&o&&"atrule"===o.type&&"supports"===o.name.toLowerCase()&&o.params===n;)t=o,o=o.next();t.after(e)}postcssPlugin.postcss=!0;export{postcssPlugin as default};
