"use strict";var e=require("@csstools/css-tokenizer"),t=require("@csstools/css-parser-algorithms"),n=require("browserslist"),o=require("https"),r=require("path");const s=[e.TokenType.Ident,e.TokenType.Number,e.TokenType.Percentage,e.TokenType.Dimension],i=["<",">","="];function parseIfCondition(n){const o=n.value.filter((e=>!t.isWhitespaceNode(e)&&!t.isCommentNode(e)));if(o.length>3)return!1;const r=o[0],a=o[1],u=o[2];if(!r||!a||!u)return!1;if(!t.isTokenNode(r)||!t.isTokenNode(a)||!t.isTokenNode(u))return!1;const c=r.value,d=a.value,l=u.value;return d[0]===e.TokenType.Delim&&(!!i.includes(d[4].value)&&(!!s.includes(c[0])&&(!!s.includes(l[0])&&{a:c,b:l,operator:d[4].value})))}function parseNotCondition(e){const t=parseIfCondition(e);return!!t&&{a:t.a,b:t.b,operator:t.operator}}function matchIfCondition(t){const n=t.a,o=t.b;if(n[0]===o[0]&&(n[0]!==e.TokenType.Dimension||o[0]!==e.TokenType.Dimension||n[4].unit.toLowerCase()===o[4].unit.toLowerCase())){switch(t.operator){case"<":if(n[4].value>=o[4].value)return`Died because A (${n[1]}) is no longer less than B (${o[1]})`;break;case">":if(n[4].value<=o[4].value)return`Died because A (${n[1]}) is no longer greater than B (${o[1]})`;break;case"=":if(n[4].value!==o[4].value)return`Died because A (${n[1]}) is no longer equal to B (${o[1]})`}return!0}}function matchNotCondition(t){const n=t.a,o=t.b;if(n[0]===o[0]&&(n[0]!==e.TokenType.Dimension||o[0]!==e.TokenType.Dimension||n[4].unit.toLowerCase()===o[4].unit.toLowerCase())){switch(t.operator){case"<":if(n[4].value<o[4].value)return`Died because A (${n[1]}) is less than B (${o[1]})`;break;case">":if(n[4].value>o[4].value)return`Died because A (${n[1]}) is greater than B (${o[1]})`;break;case"=":if(n[4].value===o[4].value)return`Died because A (${n[1]}) equals B (${o[1]})`}return!0}}function parseBrowserslistCondition(n){const o=n.value.filter((e=>!t.isWhitespaceNode(e)&&!t.isCommentNode(e)));if(o.length>1)return!1;const r=o[0];if(!r)return!1;if(!t.isTokenNode(r))return!1;const s=r.value;return s[0]===e.TokenType.String&&s[4].value}function matchBrowserslistCondition(e,t){const o=n(e);for(let e=0;e<o.length;e++){const n=o[e];if(t.has(n))return!0}return`Died because the browsers matching "${e}" do not have any overlap with your project browserslist`}function died(e){return"string"==typeof e}function parseBeforeDateCondition(n){const o=n.value.filter((e=>!t.isWhitespaceNode(e)&&!t.isCommentNode(e)));if(o.length>3)return!1;const r=o[0],s=o[1],i=o[2];if(!r||!s||!i)return!1;if(!t.isTokenNode(r)||!t.isTokenNode(s)||!t.isTokenNode(i))return!1;const a=r.value,u=s.value,c=i.value;return a[0]===e.TokenType.Number&&a[4].type===e.NumberType.Integer&&(u[0]===e.TokenType.Number&&u[4].type===e.NumberType.Integer&&(c[0]===e.TokenType.Number&&c[4].type===e.NumberType.Integer&&{year:a[4].value,month:u[4].value,day:c[4].value}))}function matchBeforeDateCondition(e,t,n){const o=new Date;o.setUTCFullYear(e),o.setUTCMonth(t),o.setUTCDate(n);return(new Date).getTime()<o.getTime()||`Died because ${e}-${t}-${n} is in the past`}function parseIssueOpenCondition(n){const o=n.value.filter((e=>!t.isWhitespaceNode(e)&&!t.isCommentNode(e)));if(o.length>2)return!1;const r=o[0],s=o[1];if(!r||!s)return!1;if(!t.isTokenNode(r)||!t.isTokenNode(s))return!1;const i=r.value,a=s.value;return i[0]===e.TokenType.String&&(a[0]===e.TokenType.Number&&a[4].type===e.NumberType.Integer&&{repository:i[4].value,issue:a[4].value})}async function matchIssueOpenCondition(e,t,n){const o=`github-issue-open:${e}:${t}`;let r;if(!n.has(o))try{r=await fetch(e,t)}catch(e){return}return"closed"===r?(n.set(o,r),`Died because issue ${t} in ${e} was closed`):"open"===r?(n.set(o,r),!0):void 0}function fetch(e,t){return new Promise(((n,s)=>{let i=!1;if(r.normalize(e)!==e)return void s(new Error("Invalid repository"));const a=new URL(r.join("repos",e,"issues",t.toString()),"https://api.github.com/"),u=o.request(a,{headers:{"User-Agent":"PostCSS TODO or Die"},timeout:1e3},(e=>{if(i)return;if(200!==e.statusCode)return i=!0,void s(new Error("Failed to fetch issue status"));let t="";e.on("data",(e=>{i||(t+=e.toString())})),e.on("end",(()=>{if(!i)try{const e=JSON.parse(t);return void n(e.state)}catch(e){return i=!0,void s(e)}}))}));u.on("timeout",(()=>{u.destroy()})),u.on("error",(e=>{i||(i=!0,s(e))})),u.end()}))}const creator=()=>{const o=new Set(n()),r=new Map;return{postcssPlugin:"postcss-todo-or-die",async Once(n,{result:s}){const i=[];n.walkAtRules((e=>{if("todo-or-die"===e.name.toLowerCase()){if(!e.params.trim())throw e.error("Rule must have valid params");i.push(e)}}));for(const n of i){const errorHandler=e=>{throw n.error(e.message)},i=e.tokenizer({css:n.params},{onParseError:errorHandler}),a=[];for(;!i.endOfFile();)a.push(i.nextToken());a.push(i.nextToken());const u=t.parseCommaSeparatedListOfComponentValues(a,{onParseError:errorHandler});if(!u.length)return void n.warn(s,"Rule must have some valid params.");for(let e=0;e<u.length;e++){const i=u[e].filter((e=>!t.isWhitespaceNode(e)&&!t.isCommentNode(e)));if(1!==i.length)return void n.warn(s,"Conditions must be split by commas when adding multiple in a list.");if(!t.isFunctionNode(i[0]))return void n.warn(s,"Conditions must be one of the supported functions.");switch(i[0].name[4].value.toLowerCase()){case"if":{const e=parseIfCondition(i[0]);if(!e)return void n.warn(s,"Incorrect arguments in `if()` function.");const t=matchIfCondition(e);if(died(t))throw n.error(t);break}case"not":{const e=parseNotCondition(i[0]);if(!e)return void n.warn(s,"Incorrect arguments in `not()` function.");const t=matchNotCondition(e);if(died(t))throw n.error(t);break}case"browserslist":{const e=parseBrowserslistCondition(i[0]);if(!e)return void n.warn(s,"Incorrect arguments in `browserslist()` function.");const t=matchBrowserslistCondition(e,o);if(died(t))throw n.error(t);break}case"before-date":{const e=parseBeforeDateCondition(i[0]);if(!e)return void n.warn(s,"Incorrect arguments in `before-date()` function.");const t=matchBeforeDateCondition(e.year,e.month,e.day);if(died(t))throw n.error(t);break}case"issue-open":{const e=parseIssueOpenCondition(i[0]);if(!e)return void n.warn(s,"Incorrect arguments in `issue-open()` function.");const t=await matchIssueOpenCondition(e.repository,e.issue,r);if(died(t))throw n.error(t);break}}}n.nodes&&n.nodes.length?n.replaceWith(n.nodes):n.remove()}}}};creator.postcss=!0,module.exports=creator;
