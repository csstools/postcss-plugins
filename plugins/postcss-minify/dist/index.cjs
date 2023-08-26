"use strict";var e=require("@csstools/css-tokenizer");const t=/(?:license|copyright)/i,r=/sourceMappingURL/i,s=/(?:[\s]|\/\*)/,o=/^layer$/i;function minify(t,r){if(!r)return r;if(t.has(r))return t.get(r);const o=r.trim();if(""===o)return t.set(r,""),"";if(!s.test(o))return t.set(r,o),o;const n=e.tokenize({css:o});for(let t=0;t<n.length;t++){const r=n[t];if(r[0]===e.TokenType.Comment||r[0]===e.TokenType.Whitespace){r[1]=" ";let s=n[t+1];for(;s&&(s[0]===e.TokenType.Comment||s[0]===e.TokenType.Whitespace);)s[1]="",t++,s=n[t+1]}}const i=e.stringify(...n);return t.set(r,i),i}function removeEmptyNodes(e){var t;if("rule"===e.type){if(0===(null==(t=e.nodes)?void 0:t.length)){const t=e.parent;return!!t&&(e.remove(),removeEmptyNodes(t),!0)}}else if("atrule"===e.type){var r;if(0===(null==(r=e.nodes)?void 0:r.length)&&!o.test(e.name)){const t=e.parent;return!!t&&(e.remove(),removeEmptyNodes(t),!0)}}return!1}function setSemicolon(e){if(e.raws.semicolon){const t=e.last;"decl"===(null==t?void 0:t.type)&&t.variable||(e.raws.semicolon=!1)}}const creator=()=>{const e=new Map;return{postcssPlugin:"postcss-minify",OnceExit(s){s.raws.before="",s.raws.after="\n",s.walk((s=>{if("comment"!==s.type){if("atrule"===s.type){if(removeEmptyNodes(s))return;return s.raws.after="",s.raws.afterName=" ",s.raws.before="",s.raws.between="",s.raws.params=void 0,setSemicolon(s),void(s.params=minify(e,s.params))}if("rule"===s.type){if(removeEmptyNodes(s))return;return s.raws.after="",s.raws.before="",s.raws.between="",s.raws.selector=void 0,setSemicolon(s),void(s.selector=minify(e,s.selector))}if("decl"===s.type){if(s.variable)return void(s.raws.before="");s.raws.before="",s.raws.between=":",s.raws.important=s.important?"!important":"",s.raws.value=void 0,s.value=minify(e,s.value)}}else{if(t.test(s.text)||r.test(s.text))return;s.remove()}}))}}};creator.postcss=!0,module.exports=creator;
