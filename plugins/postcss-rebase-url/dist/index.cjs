"use strict";var e=require("@csstools/css-tokenizer"),r=require("@csstools/css-parser-algorithms"),t=require("path");const s=/^([-_a-z0-9]+:)?\/\//i;function rebase(e,r,i){if(e.startsWith("data:"))return!1;if(s.test(e))return!1;if(e.startsWith("/"))return e;if(e.startsWith("#"))return e;try{const r=new URL(e);if(r.port||r.protocol)return!1}catch{}const o=t.posix.resolve(t.posix.join(r,e));return t.posix.relative(i,o)}function serializeString(e){let r="";for(const t of e){const e=t.codePointAt(0);if(void 0!==e)switch(e){case 0:r+=String.fromCodePoint(65533);break;case 127:r+=`\\${e.toString(16)}`;break;case 34:case 39:case 92:r+=`\\${t}`;break;default:if(1<=e&&e<=31){r+=`\\${e.toString(16)} `;break}r+=t}else r+=String.fromCodePoint(65533)}return r}function normalizedDir(e){return t.parse(t.resolve(e.trim())).dir.split(t.sep).join(t.posix.sep)}const i=/url\(/i,o=/url/i,creator=()=>({postcssPlugin:"postcss-rebase-url",prepare(){const t=new WeakSet,s=new Set;return{Once(e){e.walkAtRules(/property/i,(e=>{if(!e.nodes)return;const r=e.nodes.find((e=>{if("decl"===e.type&&/syntax/i.test(e.prop))return!0}));r&&/<url>/i.test(r.value)&&s.add(e.params.trim())}))},Declaration(n,{result:a}){var u;if(t.has(n))return;if(n.variable&&!s.has(n.prop))return;const{from:l}=a.opts;if(!l)return;if(null==(u=n.source)||!u.input.from)return;if(!i.test(n.value))return;const c=normalizedDir(l),p=n.source.input.from.trim();if(!p)return;const f=normalizedDir(p),d=r.parseCommaSeparatedListOfComponentValues(e.tokenize({css:n.value})),v=r.replaceComponentValues(d,(t=>{if(r.isTokenNode(t)&&t.value[0]===e.TokenType.URL){const e=rebase(t.value[4].value.trim(),f,c);if(e)return t.value[4].value=e,t.value[1]=`url(${serializeString(e)})`,t}if(r.isFunctionNode(t)&&o.test(t.getName()))for(const s of t.value)if(!r.isWhitespaceNode(s)&&!r.isCommentNode(s)&&r.isTokenNode(s)&&s.value[0]===e.TokenType.String){const e=rebase(s.value[4].value.trim(),f,c);if(e)return s.value[4].value=e,s.value[1]=`"${serializeString(e)}"`,t;break}})),m=r.stringify(v);m!==n.value&&(n.value=m,t.add(n))}}}});creator.postcss=!0,module.exports=creator;
