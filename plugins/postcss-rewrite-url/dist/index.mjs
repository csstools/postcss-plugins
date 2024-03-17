import{tokenize as r,TokenType as e}from"@csstools/css-tokenizer";import{parseCommaSeparatedListOfComponentValues as t,replaceComponentValues as o,isFunctionNode as s,isWhitespaceNode as a,isCommentNode as i,isTokenNode as u,stringify as l}from"@csstools/css-parser-algorithms";function serializeString(r){let e="";for(const t of r){const r=t.codePointAt(0);if(void 0!==r)switch(r){case 0:e+=String.fromCodePoint(65533);break;case 127:e+=`\\${r.toString(16)}`;break;case 34:case 39:case 92:e+=`\\${t}`;break;default:if(1<=r&&r<=31){e+=`\\${r.toString(16)} `;break}e+=t}else e+=String.fromCodePoint(65533)}return e}const n=/rewrite-url\(/i,c=/^rewrite-url$/i,creator=r=>{const e=r?.rewriter??(r=>r);return{postcssPlugin:"postcss-rewrite-url",Declaration(r,{result:t}){if(!n.test(r.value))return;const o={type:"declaration-value",rootFrom:t.opts.from,from:r.source?.input.from,property:r.prop},s=rewrite(e,r.value,o);s!==r.value&&(r.value=s)},AtRule(r,{result:t}){if(!n.test(r.params))return;const o={type:"at-rule-prelude",rootFrom:t.opts.from,from:r.source?.input.from,atRuleName:r.name},s=rewrite(e,r.params,o);s!==r.params&&(r.params=s)}}};function rewrite(n,f,m){const p=t(r({css:f})),v=o(p,(r=>{if(s(r)&&c.test(r.getName()))for(const t of r.value)if(!a(t)&&!i(t)&&u(t)&&t.value[0]===e.String){const e=t.value[4].value.trim(),o=n({url:e},m);if(o.url===e)break;return t.value[4].value=o.url,t.value[1]=`"${serializeString(o.url)}"`,r.name[1]="url(",r.name[4].value="url",r}}));return l(v)}creator.postcss=!0;export{creator as default};
