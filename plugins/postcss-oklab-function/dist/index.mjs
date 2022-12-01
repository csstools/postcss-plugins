import e from"@csstools/postcss-progressive-custom-properties";import t from"postcss-value-parser";function hasFallback(e){const t=e.parent;if(!t)return!1;const n=t.index(e);for(let r=0;r<n;r++){const n=t.nodes[r];if("decl"===n.type&&n.prop.toLowerCase()===e.prop.toLowerCase())return!0}return!1}function hasSupportsAtRuleAncestor(e){let t=e.parent;for(;t;)if("atrule"===t.type){if("supports"===t.name.toLowerCase()){if(-1!==t.params.toLowerCase().indexOf("oklab("))return!0;if(-1!==t.params.toLowerCase().indexOf("oklch("))return!0}t=t.parent}else t=t.parent;return!1}
/**
 * Simple matrix (and vector) multiplication
 * Warning: No error handling for incompatible dimensions!
 * @author Lea Verou 2020 MIT License
 *
 * @license W3C
 * https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/multiply-matrices.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/multiply-matrices.js
 */function multiplyMatrices(e,t){const n=e.length;let r,o;r=Array.isArray(e[0])?e:[e],Array.isArray(t[0])||(o=t.map((e=>[e])));const a=o[0].length,u=o[0].map(((e,t)=>o.map((e=>e[t]))));let i=r.map((e=>u.map((t=>Array.isArray(e)?e.reduce(((e,n,r)=>e+n*(t[r]||0)),0):t.reduce(((t,n)=>t+n*e),0)))));return 1===n&&(i=i[0]),1===a?i.map((e=>e[0])):i}
/**
 * @license W3C
 * https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js
 */function lin_sRGB(e){return e.map((function(e){const t=e<0?-1:1,n=Math.abs(e);return n<.04045?e/12.92:t*Math.pow((n+.055)/1.055,2.4)}))}function gam_sRGB(e){return e.map((function(e){const t=e<0?-1:1,n=Math.abs(e);return n>.0031308?t*(1.055*Math.pow(n,1/2.4)-.055):12.92*e}))}function lin_sRGB_to_XYZ(e){return multiplyMatrices([[.41239079926595934,.357584339383878,.1804807884018343],[.21263900587151027,.715168678767756,.07219231536073371],[.01933081871559182,.11919477979462598,.9505321522496607]],e)}function XYZ_to_lin_sRGB(e){return multiplyMatrices([[3.2409699419045226,-1.537383177570094,-.4986107602930034],[-.9692436362808796,1.8759675015077202,.04155505740717559],[.05563007969699366,-.20397695888897652,1.0569715142428786]],e)}function lin_P3(e){return lin_sRGB(e)}function gam_P3(e){return gam_sRGB(e)}function lin_P3_to_XYZ(e){return multiplyMatrices([[.4865709486482162,.26566769316909306,.1982172852343625],[.2289745640697488,.6917385218365064,.079286914093745],[0,.04511338185890264,1.043944368900976]],e)}function XYZ_to_lin_P3(e){return multiplyMatrices([[2.493496911941425,-.9313836179191239,-.40271078445071684],[-.8294889695615747,1.7626640603183463,.023624685841943577],[.03584583024378447,-.07617238926804182,.9568845240076872]],e)}function XYZ_to_OKLab(e){const t=multiplyMatrices([[.8190224432164319,.3619062562801221,-.12887378261216414],[.0329836671980271,.9292868468965546,.03614466816999844],[.048177199566046255,.26423952494422764,.6335478258136937]],e);return multiplyMatrices([[.2104542553,.793617785,-.0040720468],[1.9779984951,-2.428592205,.4505937099],[.0259040371,.7827717662,-.808675766]],t.map((e=>Math.cbrt(e))))}function OKLab_to_XYZ(e){const t=multiplyMatrices([[.9999999984505198,.39633779217376786,.2158037580607588],[1.0000000088817609,-.10556134232365635,-.06385417477170591],[1.0000000546724108,-.08948418209496575,-1.2914855378640917]],e);return multiplyMatrices([[1.2268798733741557,-.5578149965554813,.28139105017721583],[-.04057576262431372,1.1122868293970594,-.07171106666151701],[-.07637294974672142,-.4214933239627914,1.5869240244272418]],t.map((e=>e**3)))}function OKLab_to_OKLCH(e){const t=180*Math.atan2(e[2],e[1])/Math.PI;return[e[0],Math.sqrt(e[1]**2+e[2]**2),t>=0?t:t+360]}function OKLCH_to_OKLab(e){return[e[0],e[1]*Math.cos(e[2]*Math.PI/180),e[1]*Math.sin(e[2]*Math.PI/180)]}
/**
 * @license W3C
 * https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/deltaEOK.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/deltaEOK.js
 */function deltaEOK(e,t){const[n,r,o]=e,[a,u,i]=t,s=n-a,l=r-u,c=o-i;return Math.sqrt(s**2+l**2+c**2)}function mapGamut(e,t,n){return binarySearchGamut(e,t,n)}function binarySearchGamut(e,t,n){let r=0,o=e[1];const a=e;for(;o-r>1e-4;){const e=clip(t(a));deltaEOK(OKLCH_to_OKLab(a),OKLCH_to_OKLab(n(e)))-.02<1e-4?r=a[1]:o=a[1],a[1]=(o+r)/2}return clip(t([...a]))}function clip(e){return e.map((e=>e<0?0:e>1?1:e))}function inGamut(e){const[t,n,r]=e;return t>=-1e-4&&t<=1.0001&&n>=-1e-4&&n<=1.0001&&r>=-1e-4&&r<=1.0001}function oklabToDisplayP3(e){const[t,n,r]=e;let o=[Math.max(t,0),n,r],a=OKLab_to_OKLCH(o);return a[0]<1e-6&&(a=[0,0,0]),a[0]>.999999&&(a=[1,0,0]),o=OKLab_to_XYZ(o),o=XYZ_to_lin_P3(o),o=gam_P3(o),inGamut(o)?[clip(o),!0]:[mapGamut(a,(e=>gam_P3(e=XYZ_to_lin_P3(e=OKLab_to_XYZ(e=OKLCH_to_OKLab(e))))),(e=>OKLab_to_OKLCH(e=XYZ_to_OKLab(e=lin_P3_to_XYZ(e=lin_P3(e)))))),!1]}function oklchToDisplayP3(e){const[t,n,r]=e,o=[Math.max(t,0),n,r%360];let a=o;return a[0]<1e-6&&(a=[0,0,0]),a[0]>.999999&&(a=[1,0,0]),a=OKLCH_to_OKLab(a),a=OKLab_to_XYZ(a),a=XYZ_to_lin_P3(a),a=gam_P3(a),inGamut(a)?[clip(a),!0]:[mapGamut(o,(e=>gam_P3(e=XYZ_to_lin_P3(e=OKLab_to_XYZ(e=OKLCH_to_OKLab(e))))),(e=>OKLab_to_OKLCH(e=XYZ_to_OKLab(e=lin_P3_to_XYZ(e=lin_P3(e)))))),!1]}function oklabToSRgb(e){const[t,n,r]=e;let o=[Math.max(t,0),n,r],a=OKLab_to_OKLCH(o);return a[0]<1e-6&&(a=[0,0,0]),a[0]>.999999&&(a=[1,0,0]),o=OKLab_to_XYZ(o),o=XYZ_to_lin_sRGB(o),o=gam_sRGB(o),inGamut(o)?clip(o).map((e=>Math.round(255*e))):mapGamut(a,(e=>gam_sRGB(e=XYZ_to_lin_sRGB(e=OKLab_to_XYZ(e=OKLCH_to_OKLab(e))))),(e=>OKLab_to_OKLCH(e=XYZ_to_OKLab(e=lin_sRGB_to_XYZ(e=lin_sRGB(e)))))).map((e=>Math.round(255*e)))}function oklchToSRgb(e){const[t,n,r]=e,o=[Math.max(t,0),n,r%360];let a=o;return a[0]<1e-6&&(a=[0,0,0]),a[0]>.999999&&(a=[1,0,0]),a=OKLCH_to_OKLab(a),a=OKLab_to_XYZ(a),a=XYZ_to_lin_sRGB(a),a=gam_sRGB(a),inGamut(a)?clip(a).map((e=>Math.round(255*e))):mapGamut(o,(e=>gam_sRGB(e=XYZ_to_lin_sRGB(e=OKLab_to_XYZ(e=OKLCH_to_OKLab(e))))),(e=>OKLab_to_OKLCH(e=XYZ_to_OKLab(e=lin_sRGB_to_XYZ(e=lin_sRGB(e)))))).map((e=>Math.round(255*e)))}function onCSSFunctionSRgb(e){const t=e.value.toLowerCase(),n=e.nodes.slice().filter((e=>"comment"!==e.type&&"space"!==e.type));let r=null;if("oklab"===t?r=oklabFunctionContents(n):"oklch"===t&&(r=oklchFunctionContents(n)),!r)return;e.value="rgb",transformAlpha(e,r.slash,r.alpha);const[o,a,u]=channelNodes(r),[i,s,l]=channelDimensions(r),c=("oklab"===t?oklabToSRgb:oklchToSRgb)([i.number,s.number,l.number].map((e=>parseFloat(e))));e.nodes.splice(e.nodes.indexOf(o)+1,0,{sourceIndex:0,sourceEndIndex:1,value:",",type:"div",before:"",after:""}),e.nodes.splice(e.nodes.indexOf(a)+1,0,{sourceIndex:0,sourceEndIndex:1,value:",",type:"div",before:"",after:""}),replaceWith(e.nodes,o,{...o,value:String(c[0])}),replaceWith(e.nodes,a,{...a,value:String(c[1])}),replaceWith(e.nodes,u,{...u,value:String(c[2])})}function onCSSFunctionDisplayP3(e,n,r,o){const a=t.stringify(e),u=e.value.toLowerCase(),i=e.nodes.slice().filter((e=>"comment"!==e.type&&"space"!==e.type));let s=null;if("oklab"===u?s=oklabFunctionContents(i):"oklch"===u&&(s=oklchFunctionContents(i)),!s)return;if(i.length>3&&(!s.slash||!s.alpha))return;e.value="color";const[l,c,p]=channelNodes(s),[m,b,d]=channelDimensions(s),_="oklab"===u?oklabToDisplayP3:oklchToDisplayP3,f=[m.number,b.number,d.number].map((e=>parseFloat(e))),[h,L]=_(f);!L&&o&&n.warn(r,`"${a}" is out of gamut for "display-p3". Given "preserve: true" is set, this will lead to unexpected results in some browsers.`),e.nodes.splice(0,0,{sourceIndex:0,sourceEndIndex:10,value:"display-p3",type:"word"}),e.nodes.splice(1,0,{sourceIndex:0,sourceEndIndex:1,value:" ",type:"space"}),replaceWith(e.nodes,l,{...l,value:h[0].toFixed(5)}),replaceWith(e.nodes,c,{...c,value:h[1].toFixed(5)}),replaceWith(e.nodes,p,{...p,value:h[2].toFixed(5)})}function isNumericNode(e){if(!e||"word"!==e.type)return!1;if(!canParseAsUnit(e))return!1;const n=t.unit(e.value);return!!n&&!!n.number}function isNumericNodeHueLike(e){if(!e||"word"!==e.type)return!1;if(!canParseAsUnit(e))return!1;const n=t.unit(e.value);if(!n)return!1;const r=n.unit.toLowerCase();return!!n.number&&("deg"===r||"grad"===r||"rad"===r||"turn"===r||""===r)}function isNumericNodePercentageOrNumber(e){if(!e||"word"!==e.type)return!1;if(!canParseAsUnit(e))return!1;const n=t.unit(e.value);return!!n&&("%"===n.unit||""===n.unit)}function isCalcNode(e){return e&&"function"===e.type&&"calc"===e.value.toLowerCase()}function isVarNode(e){return e&&"function"===e.type&&"var"===e.value.toLowerCase()}function isSlashNode(e){return e&&"div"===e.type&&"/"===e.value}function oklchFunctionContents(e){if(!isNumericNodePercentageOrNumber(e[0]))return null;if(!isNumericNodePercentageOrNumber(e[1]))return null;if(!isNumericNodeHueLike(e[2]))return null;const n={l:t.unit(e[0].value),lNode:e[0],c:t.unit(e[1].value),cNode:e[1],h:t.unit(e[2].value),hNode:e[2]};return normalizeHueNode(n.h),""!==n.h.unit?null:(isSlashNode(e[3])&&(n.slash=e[3]),(isNumericNodePercentageOrNumber(e[4])||isCalcNode(e[4])||isVarNode(e[4]))&&(n.alpha=e[4]),!(e.length>3)||n.slash&&n.alpha?("%"===n.l.unit&&(n.l.unit="",n.l.number=(parseFloat(n.l.number)/100).toFixed(10)),"%"===n.c.unit&&(n.c.unit="",n.c.number=(parseFloat(n.c.number)/100*.4).toFixed(10)),n):null)}function oklabFunctionContents(e){if(!isNumericNodePercentageOrNumber(e[0]))return null;if(!isNumericNodePercentageOrNumber(e[1]))return null;if(!isNumericNodePercentageOrNumber(e[2]))return null;const n={l:t.unit(e[0].value),lNode:e[0],a:t.unit(e[1].value),aNode:e[1],b:t.unit(e[2].value),bNode:e[2]};return isSlashNode(e[3])&&(n.slash=e[3]),(isNumericNodePercentageOrNumber(e[4])||isCalcNode(e[4])||isVarNode(e[4]))&&(n.alpha=e[4]),!(e.length>3)||n.slash&&n.alpha?("%"===n.l.unit&&(n.l.unit="",n.l.number=(parseFloat(n.l.number)/100).toFixed(10)),"%"===n.a.unit&&(n.a.unit="",n.a.number=(parseFloat(n.a.number)/100*.4).toFixed(10)),"%"===n.b.unit&&(n.b.unit="",n.b.number=(parseFloat(n.b.number)/100*.4).toFixed(10)),n):null}function isLab(e){return void 0!==e.a}function channelNodes(e){return isLab(e)?[e.lNode,e.aNode,e.bNode]:[e.lNode,e.cNode,e.hNode]}function channelDimensions(e){return isLab(e)?[e.l,e.a,e.b]:[e.l,e.c,e.h]}function transformAlpha(e,n,r){if(!n||!r)return;if(e.value="rgba",n.value=",",n.before="",!isNumericNode(r))return;const o=t.unit(r.value);o&&"%"===o.unit&&(o.number=String(parseFloat(o.number)/100),r.value=String(o.number))}function replaceWith(e,t,n){const r=e.indexOf(t);e[r]=n}function normalizeHueNode(e){switch(e.unit.toLowerCase()){case"deg":return void(e.unit="");case"rad":return e.unit="",void(e.number=(180*parseFloat(e.number)/Math.PI).toString());case"grad":return e.unit="",void(e.number=(.9*parseFloat(e.number)).toString());case"turn":return e.unit="",void(e.number=(360*parseFloat(e.number)).toString())}}function canParseAsUnit(e){if(!e||!e.value)return!1;try{return!1!==t.unit(e.value)}catch(e){return!1}}function modifiedValues(e,n,r,o){let a;try{a=t(e)}catch(t){n.warn(r,`Failed to parse value '${e}' as an oklab or oklch function. Leaving the original value intact.`)}if(void 0===a)return;a.walk((e=>{e.type&&"function"===e.type&&("oklab"!==e.value.toLowerCase()&&"oklch"!==e.value.toLowerCase()||onCSSFunctionSRgb(e))}));const u=String(a);if(u===e)return;const i=t(e);i.walk((e=>{e.type&&"function"===e.type&&("oklab"!==e.value.toLowerCase()&&"oklch"!==e.value.toLowerCase()||onCSSFunctionDisplayP3(e,n,r,o))}));return{rgb:u,displayP3:String(i)}}const basePlugin=e=>({postcssPlugin:"postcss-oklab-function",Declaration:(t,{result:n})=>{if(hasFallback(t))return;if(hasSupportsAtRuleAncestor(t))return;const r=t.value;if(!/(^|[^\w-])(oklab|oklch)\(/i.test(r.toLowerCase()))return;const o=modifiedValues(r,t,n,e.preserve);void 0!==o&&(e.preserve?(t.cloneBefore({value:o.rgb}),e.subFeatures.displayP3&&t.cloneBefore({value:o.displayP3})):(t.cloneBefore({value:o.rgb}),e.subFeatures.displayP3&&t.cloneBefore({value:o.displayP3}),t.remove()))}});basePlugin.postcss=!0;const postcssPlugin=t=>{const n=Object.assign({enableProgressiveCustomProperties:!0,preserve:!1,subFeatures:{displayP3:!0}},t);return n.subFeatures=Object.assign({displayP3:!0},n.subFeatures),n.enableProgressiveCustomProperties&&(n.preserve||n.subFeatures.displayP3)?{postcssPlugin:"postcss-oklab-function",plugins:[e(),basePlugin(n)]}:basePlugin(n)};postcssPlugin.postcss=!0;export{postcssPlugin as default};
