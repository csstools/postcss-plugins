"use strict";var e=require("path"),t=require("@csstools/css-parser-algorithms"),n=require("@csstools/css-tokenizer"),s=require("fs"),r=require("module"),o=require("@csstools/postcss-rebase-url");function isWarning(e){return"warning"===e.type}function isCharsetStatement(e){return"charset"===e.type}function isImportStatement(e){return"import"===e.type}const i=/^data:text\/css(?:;(base64|plain))?,/i,a=/^data:text\/css;base64,/i,p=/^data:text\/css;plain,/i;function isValidDataURL(e){return!!e&&i.test(e)}const l=/^charset$/i,u=/^import$/i,c=/^url$/i,d=/^layer$/i,m=/^supports$/i;function parseAtImport(e){const s=t.parseListOfComponentValues(n.tokenize({css:e}));let r="",o="";const i=[],a=[],p=[];e:for(let e=0;e<s.length;e++){const l=s[e];if(t.isWhitespaceNode(l)||t.isCommentNode(l))continue;if(t.isTokenNode(l)&&(l.value[0]===n.TokenType.String||l.value[0]===n.TokenType.URL)){if(r)return!1;r=l.value[4].value,o=l.value[1];continue}if(t.isFunctionNode(l)&&c.test(l.getName())){if(r)return!1;for(let e=0;e<l.value.length;e++){const s=l.value[e];if(!t.isWhitespaceNode(s)&&!t.isCommentNode(s)){if(t.isTokenNode(s)&&s.value[0]===n.TokenType.String){r=s.value[4].value,o=t.stringify([[l]]);continue e}return!1}}}if(t.isTokenNode(l)&&l.value[0]===n.TokenType.Ident&&d.test(l.value[4].value)){if(i.length>0||p.length>0)return!1;i.push("");continue}if(t.isFunctionNode(l)&&d.test(l.getName())){if(i.length>0||p.length>0)return!1;i.push(t.stringify([trim(l.value)]));continue}if(t.isFunctionNode(l)&&m.test(l.getName())){if(p.length>0)return!1;p.push(t.stringify([trim(l.value)]));continue}const u=trim(s.slice(e)).flatMap((e=>e.tokens())),f=t.parseCommaSeparatedListOfComponentValues(u).map((e=>t.stringify([trim(e)])));a.push(...f);break}return r=stripHash(r),!!r&&{uri:r,fullUri:o,layer:i,media:a,supports:p}}function trim(e){let n=0,s=e.length;for(let s=0;s<e.length;s++){const r=e[s];if(!t.isWhitespaceNode(r)&&!t.isCommentNode(r)){n=s;break}}for(let n=e.length-1;n>=0;n--){const r=e[n];if(!t.isWhitespaceNode(r)&&!t.isCommentNode(r)){s=n+1;break}}return e.slice(n,s)}function stripHash(e){try{const t=new URL(e,"http://example.com");return t.hash?e.slice(0,e.length-t.hash.length):e}catch{return e}}function parseStatements(e,t,n,s,r){const o=[];if("document"===t.type)return t.each((t=>{o.push(...parseStatements(e,t,n,s,r))})),o;let i=[];return t.each((t=>{let a;"atrule"===t.type&&(u.test(t.name)?a=parseImport(e,t,n,s,r):l.test(t.name)&&(a=parseCharset(e,t,n,s,r))),a?(i.length&&(o.push({type:"nodes",nodes:i,conditions:[...s],from:r,importingNode:n}),i=[]),o.push(a)):i.push(t)})),i.length&&o.push({type:"nodes",nodes:i,conditions:[...s],from:r,importingNode:n}),o}function parseCharset(e,t,n,s,r){return t.prev()?e.warn("@charset must precede all other statements",{node:t}):{type:"charset",node:t,conditions:[...s],from:r,importingNode:n}}function parseImport(e,t,n,s,r){let o=t.prev();for(;o;)if("comment"!==o.type){if("atrule"!==o.type||!u.test(o.name))break;o=o.prev()}else o=o.prev();for(;o;)if("comment"!==o.type)if("atrule"===o.type&&l.test(o.name))o=o.prev();else{if("atrule"!==o.type||!d.test(o.name)||o.nodes)return e.warn("@import must precede all other statements (besides @charset or empty @layer)",{node:t});o=o.prev()}else o=o.prev();if(t.nodes)return e.warn("It looks like you didn't end your @import statement correctly. Child nodes are attached to it.",{node:t});const i={type:"import",uri:"",fullUri:"",node:t,conditions:[...s],from:r,importingNode:n},a=parseAtImport(t.params);if(!a)return e.warn(`Invalid @import statement in '${t.toString()}'`,{node:t});const{layer:p,media:c,supports:m,uri:f,fullUri:h}=a;return i.uri=f,i.fullUri=h,(c.length>0||p.length>0||m.length>0)&&i.conditions.push({layer:p,media:c,supports:m}),i}function resolveId(t,n,o){let i="";if(t.startsWith("node_modules:"))try{i=r.createRequire(n).resolve(t.slice(13))}catch(e){throw o.error(`Failed to find '${t}'`)}else i=e.resolve(n,t);if(!s.existsSync(i))throw o.error(`Failed to find '${t}'`);return i}function loadContent(e){return isValidDataURL(e)?(t=e,a.test(t)?Buffer.from(t.slice(21),"base64").toString():p.test(t)?decodeURIComponent(t.slice(20)):decodeURIComponent(t.slice(14))):s.readFileSync(e,"utf-8");var t}const noopPlugin=()=>({postcssPlugin:"noop-plugin",Once(){}});async function parseStyles(e,t,n,s,r,o){const i=parseStatements(e,t,n,s,r);for(const t of i)isImportStatement(t)&&isProcessableURL(t.uri)&&await resolveImportId(e,t,o);let a=null;const p=[],l=[];function handleCharset(e){if(a){if(e.node.params.toLowerCase()!==a.node.params.toLowerCase()){var t,n;throw e.node.error(`Incompatible @charset statements:\n  ${e.node.params} specified in ${null==(t=e.node.source)?void 0:t.input.file}\n  ${a.node.params} specified in ${null==(n=a.node.source)?void 0:n.input.file}`)}}else a=e}return i.forEach((e=>{isCharsetStatement(e)?handleCharset(e):isImportStatement(e)?e.children?e.children.forEach((e=>{isImportStatement(e)?p.push(e):isCharsetStatement(e)?handleCharset(e):l.push(e)})):p.push(e):"nodes"===e.type&&l.push(e)})),a?[a,...p.concat(l)]:p.concat(l)}async function resolveImportId(t,n,s){var r;if(isValidDataURL(n.uri))return void(n.children=await loadImportContent(t,n,n.uri,s));if(isValidDataURL(n.from[n.from.length-1]))return n.children=[],void t.warn(`Unable to import '${n.uri}' from a stylesheet that is embedded in a data url`,{node:n.node});const o=n.node;let i;if(null==(r=o.source)||null==(r=r.input)||!r.file)return n.children=[],void t.warn("The current PostCSS AST Node is lacking a source file reference. This is most likely a bug in a PostCSS plugin.",{node:n.node});i=o.source.input.file;const a=e.dirname(i),p=resolveId(n.uri,a,o);t.messages.push({type:"dependency",plugin:"postcss-bundler",resolved:p,parent:i});const l=await loadImportContent(t,n,p,s);n.children=l??[]}async function loadImportContent(e,t,n,s){var r,o;const{conditions:i,from:a,node:p}=t;if(a.includes(n))return;const u=await loadContent(n),c=await s([noopPlugin()]).process(u,{from:n,parser:(null==(r=e.opts.syntax)?void 0:r.parse)??e.opts.parser??void 0}),d=c.root;return e.messages=e.messages.concat(c.messages),"atrule"===(null==(o=d.first)?void 0:o.type)&&l.test(d.first.name)?d.first.after(s.comment({text:`${t.uri}`,source:p.source})):d.prepend(s.comment({text:`${t.uri}`,source:p.source})),parseStyles(e,d,p,i,[...a,n],s)}function isProcessableURL(e){if(/^(?:[a-z]+:)?\/\//i.test(e))return!1;try{if(new URL(e,"https://example.com").search)return!1}catch{}return!0}function formatImportPrelude(e,t,n){const s=[];if(e.length){const t=e.join(".");let n="layer";t&&(n=`layer(${t})`),s.push(n)}return 1===n.length?s.push(`supports(${n[0]})`):n.length>0&&s.push(`supports(${n.map((e=>`(${e})`)).join(" and ")})`),t.length&&s.push(t.join(", ")),s.join(" ")}function applyConditions(e,t){e.forEach(((n,s)=>{if(isWarning(n))return;if(!n.conditions.length||isCharsetStatement(n))return;if(isImportStatement(n)){if(1===n.conditions.length)n.node.params=`${n.fullUri} ${formatImportPrelude(n.conditions[0].layer,n.conditions[0].media,n.conditions[0].supports)}`;else if(n.conditions.length>1){const e=n.conditions.slice().reverse(),t=e.pop();let s=`${n.fullUri} ${formatImportPrelude(t.layer,t.media,t.supports)}`;for(const t of e)s=`'data:text/css;base64,${Buffer.from(`@import ${s}`).toString("base64")}' ${formatImportPrelude(t.layer,t.media,t.supports)}`;n.node.params=s}return}const{nodes:r}=n;if(!r.length)return;const{parent:o}=r[0];if(!o)return;const i=[];for(const e of n.conditions){if(e.media.length>0){var a;const s=t({name:"media",params:e.media.join(", "),source:(null==(a=n.importingNode)?void 0:a.source)??o.source});i.push(s)}if(e.supports.length>0){var p;const s=t({name:"supports",params:1===e.supports.length?`(${e.supports[0]})`:e.supports.map((e=>`(${e})`)).join(" and "),source:(null==(p=n.importingNode)?void 0:p.source)??o.source});i.push(s)}if(e.layer.length>0){var l;const s=t({name:"layer",params:e.layer.join("."),source:(null==(l=n.importingNode)?void 0:l.source)??o.source});i.push(s)}}const u=i.shift();if(!u)return;const c=i.reduce(((e,t)=>(e.append(t),t)),u);o.insertBefore(r[0],u),r.forEach((e=>{e.parent=void 0})),r[0].raws.before=r[0].raws.before||"\n",c.append(r),e[s]={type:"nodes",nodes:[u],conditions:n.conditions,from:n.from,importingNode:n.importingNode}}))}function applyStyles(e,t){t.nodes=[],e.forEach((e=>{isCharsetStatement(e)||isImportStatement(e)?(e.node.parent=void 0,t.append(e.node)):"nodes"===e.type&&e.nodes.forEach((e=>{e.parent=void 0,t.append(e)}))}))}noopPlugin.postcss=!0;const creator$1=()=>({postcssPlugin:"postcss-bundler",async Once(e,{result:t,atRule:n,postcss:s}){const r=await parseStyles(t,e,null,[],[],s);applyConditions(r,n),applyStyles(r,e)}});creator$1.postcss=!0;const creator=()=>({postcssPlugin:"postcss-bundler",plugins:[creator$1(),o()]});creator.postcss=!0,module.exports=creator;
