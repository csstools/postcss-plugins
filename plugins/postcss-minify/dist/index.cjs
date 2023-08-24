"use strict";var e=require("@csstools/css-tokenizer");const r=/(?:license|copyright)/i,t=/sourceMappingURL/i,o=/(?:[\s]|\/\*)/;function minify(r,t){if(!t)return t;if(r.has(t))return r.get(t);if(!o.test(t))return r.set(t,t),t;if(""===t.trim())return r.set(t," ")," ";const s=e.tokenize({css:t});for(let r=0;r<s.length;r++){const t=s[r];if(t[0]===e.TokenType.Comment||t[0]===e.TokenType.Whitespace){t[1]=" ";let o=s[r+1];for(;o&&(o[0]===e.TokenType.Comment||o[0]===e.TokenType.Whitespace);)o[1]="",r++,o=s[r+1]}}const n=e.stringify(...s);return r.set(t,n),n}function removeEmptyNodes(e){var r;if("rule"===e.type){if(0===(null==(r=e.nodes)?void 0:r.length)){var t;const r=e.parent;return e.remove(),0===(null==r||null==(t=r.nodes)?void 0:t.length)&&removeEmptyNodes(r),!0}}else if("atrule"===e.type){var o;if(0===(null==(o=e.nodes)?void 0:o.length)&&"layer"!==e.name.toLowerCase()){var s;const r=e.parent;return e.remove(),0===(null==r||null==(s=r.nodes)?void 0:s.length)&&removeEmptyNodes(r),!0}}return!1}function setSemicolon(e){if(e.raws.semicolon){const r=e.last;"decl"===(null==r?void 0:r.type)&&r.variable||(e.raws.semicolon=!1)}}const creator=()=>({postcssPlugin:"postcss-minify",prepare(){const e=new Map;return{OnceExit(o){o.raws={before:"",after:"\n"},o.walk((o=>{if("comment"!==o.type)if("decl"===o.type&&o.variable)o.raws.before="";else{if("atrule"===o.type){if(removeEmptyNodes(o))return;return o.raws.after="",o.raws.afterName=" ",o.raws.before="",o.raws.between="",o.raws.params=void 0,setSemicolon(o),void(o.params=minify(e,o.params))}if("rule"===o.type){if(removeEmptyNodes(o))return;return o.raws.after="",o.raws.before="",o.raws.between="",o.raws.selector=void 0,setSemicolon(o),void(o.selector=minify(e,o.selector))}if("decl"===o.type){if(o.variable)return void(o.raws.before="");o.raws.before="",o.raws.between=":",o.raws.important=o.important?"!important":"",o.raws.value=void 0,o.value=minify(e,o.value)}}else{if(r.test(o.text)||t.test(o.text))return;o.remove()}}))}}}});creator.postcss=!0,module.exports=creator;
