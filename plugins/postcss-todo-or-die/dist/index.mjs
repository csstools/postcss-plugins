import e from"browserslist";import{TokenType as t,NumberType as r,tokenizer as n}from"@csstools/css-tokenizer";import{isWhitespaceNode as o,isCommentNode as s,isTokenNode as i,parseCommaSeparatedListOfComponentValues as a,isFunctionNode as u}from"@csstools/css-parser-algorithms";import c from"https";import l from"path";function died(e){return"string"==typeof e}function matchBeforeDateCondition(e,t,r){const n=new Date;n.setUTCFullYear(e),n.setUTCMonth(t),n.setUTCDate(r);return(new Date).getTime()<n.getTime()||`Died because ${e}-${t}-${r} is in the past`}function matchBrowserslistCondition(t,r){const n=e(t);for(let e=0;e<n.length;e++){const t=n[e];if(r.has(t))return!0}return`Died because the browsers matching "${t}" do not have any overlap with your project browserslist`}function matchIfCondition(e){const r=e.a,n=e.b;if(r[0]===n[0]&&(r[0]!==t.Dimension||n[0]!==t.Dimension||r[4].unit.toLowerCase()===n[4].unit.toLowerCase())){switch(e.operator){case"<":if(r[4].value>=n[4].value)return`Died because A (${r[1]}) is no longer less than B (${n[1]})`;break;case">":if(r[4].value<=n[4].value)return`Died because A (${r[1]}) is no longer greater than B (${n[1]})`;break;case"=":if(r[4].value!==n[4].value)return`Died because A (${r[1]}) is no longer equal to B (${n[1]})`}return!0}}async function matchIssueOpenCondition(e,t,r){const n=`github-issue-open:${e}:${t}`;let o;if(!r.has(n))try{o=await fetch(e,t)}catch(e){return}return"closed"===o?(r.set(n,o),`Died because issue ${t} in ${e} was closed`):"open"===o?(r.set(n,o),!0):void 0}function fetch(e,t){return new Promise(((r,n)=>{let o=!1;const s=new URL(l.join("repos",e,"issues",t.toString()),"https://api.github.com/"),i={headers:{"User-Agent":"PostCSS TODO or Die"},timeout:15e3};process.env.GITHUB_TOKEN&&(i.headers.Authorization=`Bearer ${process.env.GITHUB_TOKEN}`);const a=c.request(s,i,(e=>{if(o)return;if(200!==e.statusCode)return o=!0,void n(new Error("Failed to fetch issue status"));let t="";e.on("data",(e=>{o||(t+=e.toString())})),e.on("end",(()=>{if(!o)try{const e=JSON.parse(t);return void r(e.state)}catch(e){return o=!0,void n(e)}}))}));a.on("timeout",(()=>{a.destroy()})),a.on("error",(e=>{o||(o=!0,n(e))})),a.end()}))}function matchNotCondition(e){const r=e.a,n=e.b;if(r[0]===n[0]&&(r[0]!==t.Dimension||n[0]!==t.Dimension||r[4].unit.toLowerCase()===n[4].unit.toLowerCase())){switch(e.operator){case"<":if(r[4].value<n[4].value)return`Died because A (${r[1]}) is less than B (${n[1]})`;break;case">":if(r[4].value>n[4].value)return`Died because A (${r[1]}) is greater than B (${n[1]})`;break;case"=":if(r[4].value===n[4].value)return`Died because A (${r[1]}) equals B (${n[1]})`}return!0}}function parseBeforeDateCondition(e){const n=e.value.filter((e=>!o(e)&&!s(e)));if(n.length>3)return!1;const a=n[0],u=n[1],c=n[2];if(!a||!u||!c)return!1;if(!i(a)||!i(u)||!i(c))return!1;const l=a.value,f=u.value,d=c.value;return l[0]===t.Number&&l[4].type===r.Integer&&(f[0]===t.Number&&f[4].type===r.Integer&&(d[0]===t.Number&&d[4].type===r.Integer&&{year:l[4].value,month:f[4].value,day:d[4].value}))}function parseBrowserslistCondition(e){const r=e.value.filter((e=>!o(e)&&!s(e)));if(r.length>1)return!1;const n=r[0];if(!n)return!1;if(!i(n))return!1;const a=n.value;return a[0]===t.String&&a[4].value}const f=[t.Ident,t.Number,t.Percentage,t.Dimension],d=["<",">","="];function parseIfCondition(e){const r=e.value.filter((e=>!o(e)&&!s(e)));if(r.length>3)return!1;const n=r[0],a=r[1],u=r[2];if(!n||!a||!u)return!1;if(!i(n)||!i(a)||!i(u))return!1;const c=n.value,l=a.value,h=u.value;return l[0]===t.Delim&&(!!d.includes(l[4].value)&&(!!f.includes(c[0])&&(!!f.includes(h[0])&&{a:c,b:h,operator:l[4].value})))}function parseIssueOpenCondition(e){const n=e.value.filter((e=>!o(e)&&!s(e)));if(n.length>2)return!1;const a=n[0],u=n[1];if(!a||!u)return!1;if(!i(a)||!i(u))return!1;const c=a.value,l=u.value;return c[0]===t.String&&(l[0]===t.Number&&l[4].type===r.Integer&&{repository:c[4].value,issue:l[4].value})}function parseNotCondition(e){const t=parseIfCondition(e);return!!t&&{a:t.a,b:t.b,operator:t.operator}}const creator=()=>{const t=new Set(e()),r=new Map;return{postcssPlugin:"postcss-todo-or-die",async Once(e,{result:i}){const c=[];e.walkAtRules((e=>{if("todo-or-die"===e.name.toLowerCase()){if(!e.params.trim())throw e.error("Rule must have valid params");c.push(e)}}));for(const e of c){const errorHandler=t=>{throw e.error(t.message)},c=n({css:e.params},{onParseError:errorHandler}),l=[];for(;!c.endOfFile();)l.push(c.nextToken());l.push(c.nextToken());const f=a(l,{onParseError:errorHandler});if(!f.length)return void e.warn(i,"Rule must have some valid params.");for(let n=0;n<f.length;n++){const a=f[n].filter((e=>!o(e)&&!s(e)));if(1!==a.length)return void e.warn(i,"Conditions must be split by commas when adding multiple in a list.");if(!u(a[0]))return void e.warn(i,"Conditions must be one of the supported functions.");switch(a[0].name[4].value.toLowerCase()){case"if":{const t=parseIfCondition(a[0]);if(!t)return void e.warn(i,"Incorrect arguments in `if()` function.");const r=matchIfCondition(t);if(died(r))throw e.error(r);break}case"not":{const t=parseNotCondition(a[0]);if(!t)return void e.warn(i,"Incorrect arguments in `not()` function.");const r=matchNotCondition(t);if(died(r))throw e.error(r);break}case"browserslist":{const r=parseBrowserslistCondition(a[0]);if(!r)return void e.warn(i,"Incorrect arguments in `browserslist()` function.");const n=matchBrowserslistCondition(r,t);if(died(n))throw e.error(n);break}case"before-date":{const t=parseBeforeDateCondition(a[0]);if(!t)return void e.warn(i,"Incorrect arguments in `before-date()` function.");const r=matchBeforeDateCondition(t.year,t.month,t.day);if(died(r))throw e.error(r);break}case"issue-open":{const t=parseIssueOpenCondition(a[0]);if(!t)return void e.warn(i,"Incorrect arguments in `issue-open()` function.");const n=await matchIssueOpenCondition(t.repository,t.issue,r);if(died(n))throw e.error(n);break}}}e.nodes&&e.nodes.length?e.replaceWith(e.nodes):e.remove()}}}};creator.postcss=!0;export{creator as default};
