"use strict";var e=require("@csstools/css-parser-algorithms"),t=require("@csstools/css-tokenizer"),s=require("path"),o=require("module"),n=require("fs/promises"),r=require("@csstools/postcss-rebase-url");function isWarning(e){return"warning"===e.type}function isNodesStatement(e){return"nodes"===e.type}function isImportStatement(e){return"import"===e.type}function isPreImportStatement(e){return"pre-import"===e.type}const i=/^data:text\/css(?:;(base64|plain))?,/i,a=/^data:text\/css;base64,/i,c=/^data:text\/css;plain,/i;function isValidDataURL(e){return!!e&&i.test(e)}const l=/^charset$/i,u=/^import$/i,p=/^url$/i,m=/^layer$/i,d=/^supports$/i;function parseAtImport(s){const o=t.tokenize({css:s});if(2===o.length&&(o[0][0]===t.TokenType.String||o[0][0]===t.TokenType.URL)){let e=o[0][4].value;return e=stripHash(e),!!e&&{uri:e,fullUri:o[0][1]}}const n=e.parseListOfComponentValues(o);let r,i,a,c="",l="";for(let s=0;s<n.length;s++){const o=n[s];if(!e.isWhitespaceNode(o)&&!e.isCommentNode(o))if(!e.isTokenNode(o)||o.value[0]!==t.TokenType.String&&o.value[0]!==t.TokenType.URL)if(e.isFunctionNode(o)&&p.test(o.getName())){if(c)return!1;for(let s=0;s<o.value.length;s++){const n=o.value[s];if(!e.isWhitespaceNode(n)&&!e.isCommentNode(n)){if(!e.isTokenNode(n)||n.value[0]!==t.TokenType.String)return!1;c=n.value[4].value,l=e.stringify([[o]])}}}else{if(!c)return!1;if(e.isTokenNode(o)&&o.value[0]===t.TokenType.Ident&&m.test(o.value[4].value)){if(void 0!==r||void 0!==a)return!1;r=""}else if(e.isFunctionNode(o)&&m.test(o.getName())){if(void 0!==r||void 0!==a)return!1;r=e.stringify([o.value])}else{if(!e.isFunctionNode(o)||!d.test(o.getName())){i=e.stringify([n.slice(s)]);break}if(void 0!==a)return!1;a=e.stringify([o.value])}}else{if(c)return!1;c=o.value[4].value,l=o.value[1]}}return c=stripHash(c),!!c&&{uri:c,fullUri:l,layer:r,media:i,supports:a}}function stripHash(e){if(e.startsWith("#"))return"";if(!e.includes("#"))return e;try{const t=new URL(e,"http://example.com");return t.hash?e.slice(0,e.length-t.hash.length):e}catch{return e}}function parseStylesheet(e,t,s,o,n){const r={statements:[]};if("document"===t.type)return t.each((t=>{const i=parseStylesheet(e,t,s,o,n);var a,c;if(r.charset&&i.charset&&r.charset.params.toLowerCase()!==i.charset.params.toLowerCase())throw i.charset.error(`Incompatible @charset statements:\n  ${i.charset.params} specified in ${null==(a=i.charset.source)?void 0:a.input.file}\n  ${r.charset.params} specified in ${null==(c=r.charset.source)?void 0:c.input.file}`);!r.charset&&i.charset&&(r.charset=i.charset),r.statements.push(...i.statements)})),r;let i,a,c=[],p=[];for(let r=0;r<t.nodes.length;r++){const d=t.nodes[r];if(0===r&&"atrule"===d.type&&l.test(d.name))i=d;else if(p.length||"comment"!==d.type&&("atrule"!==d.type||!m.test(d.name)||d.nodes)){if(p.length||"atrule"!==d.type||!u.test(d.name)){a={type:"nodes",nodes:t.nodes.slice(r),conditions:[...o],from:n,importingNode:s};break}[r,p]=consumeImports(e,t.nodes,o,r,s,n)}else[r,c]=consumeBeforeImports(t.nodes,o,r,s,n)}const d=[];return c.length&&d.push(...c),p.length&&d.push(...p),a&&d.push(a),{charset:i,statements:d}}function consumeImports(e,t,s,o,n,r){const i=[];let a=o;const c=t.length;for(;a<c;a++){const o=t[a];if("comment"!==o.type){if("atrule"!==o.type||!u.test(o.name))break;i.push(parseImport(e,o,n,s,r))}else{const[e,s]=consumeComments(t,a,n,r);i.push(s),a=e}}return[a-1,i]}function consumeBeforeImports(e,t,s,o,n){const r=[];let i=s;const a=e.length;for(;i<a;i++){const s=e[i];if("comment"!==s.type){if("atrule"===s.type&&m.test(s.name)&&!s.nodes){if(t.length){r.push({type:"pre-import",node:s,conditions:[...t],from:n,importingNode:o});continue}{const[s,a]=consumeLayers(e,t,i,o,n);r.push(a),i=s;continue}}break}{const[t,s]=consumeComments(e,i,o,n);r.push(s),i=t}}return[i-1,r]}function consumeComments(e,t,s,o){const n=[];let r=t;const i=e.length;for(;r<i;r++){const t=e[r];n.push(t);const s=e[r+1];if("comment"!==(null==s?void 0:s.type))break}return[r,{type:"nodes",nodes:n,conditions:[],from:o,importingNode:s}]}function consumeLayers(e,t,s,o,n){const r=[];let i=s;const a=e.length;for(;i<a;i++){const t=e[i];r.push(t);const s=e[i+1];if(!s||"atrule"!==s.type||!m.test(s.name)||s.nodes)break}return[i,{type:"nodes",nodes:r,conditions:[...t],from:n,importingNode:o}]}function parseImport(e,t,s,o,n){const r=parseAtImport(t.params);if(!r)return e.warn(`Invalid @import statement in '${t.toString()}'`,{node:t});const i={type:"import",uri:r.uri,fullUri:r.fullUri,node:t,conditions:[...o],from:n,importingNode:s};return void 0===r.layer&&void 0===r.media&&void 0===r.supports||i.conditions.push({layer:r.layer,media:r.media,supports:r.supports}),i}function resolveId(e,t,o,n){let r="";if(o.startsWith("node_modules:"))try{r=t.resolve(o.slice(13))}catch(t){throw e.error(`Failed to find '${o}'`)}else r=s.resolve(n,o);return r}function createRequire(e,t){var n;let r;if(null==(n=e.source)||null==(n=n.input)||!n.file)return t.warn("The current PostCSS AST Node is lacking a source file reference. This is most likely a bug in a PostCSS plugin.",{node:e}),[];r=e.source.input.file;const i=s.dirname(r);return[o.createRequire(i),r,i]}async function loadContent(e){return isValidDataURL(e)?(t=e,a.test(t)?Buffer.from(t.slice(21),"base64").toString():c.test(t)?decodeURIComponent(t.slice(20)):decodeURIComponent(t.slice(14))):n.readFile(e,"utf-8");var t}const noopPlugin=()=>({postcssPlugin:"noop-plugin",Once(){}});async function parseStyles(e,t,s,o,n,r){const i=parseStylesheet(e,t,s,o,n);{let t,s,o;const n=[];for(const a of i.statements)isImportStatement(a)&&isProcessableURL(a.uri)&&(t&&s&&o||([t,s,o]=createRequire(a.node,e),t&&s&&o))&&n.push(resolveImportId(e,a,r,t,s,o));n.length&&await Promise.all(n)}for(let e=0;e<i.statements.length;e++){const t=i.statements[e];if(isImportStatement(t)&&t.stylesheet){var a,c;if(i.charset&&t.stylesheet.charset&&i.charset.params.toLowerCase()!==t.stylesheet.charset.params.toLowerCase())throw t.stylesheet.charset.error(`Incompatible @charset statements:\n  ${t.stylesheet.charset.params} specified in ${null==(a=t.stylesheet.charset.source)?void 0:a.input.file}\n  ${i.charset.params} specified in ${null==(c=i.charset.source)?void 0:c.input.file}`);!i.charset&&t.stylesheet.charset&&(i.charset=t.stylesheet.charset),i.statements.splice(e,1,...t.stylesheet.statements),e--}else;}return i}async function resolveImportId(e,t,s,o,n,r){if(isValidDataURL(t.uri))return void(t.stylesheet=await loadImportContent(e,t,t.uri,s));if(isValidDataURL(t.from[t.from.length-1]))return t.stylesheet={statements:[]},void e.warn(`Unable to import '${t.uri}' from a stylesheet that is embedded in a data url`,{node:t.node});const i=resolveId(t.node,o,t.uri,r);e.messages.push({type:"dependency",plugin:"postcss-bundler",file:i,parent:n}),t.stylesheet=await loadImportContent(e,t,i,s)}async function loadImportContent(e,t,s,o){var n,r;const{conditions:i,from:a,node:c}=t;if(a.includes(s))return{statements:[]};let u;try{u=await loadContent(s)}catch{throw c.error(`Failed to find '${t.uri}'`)}const p=await o([noopPlugin()]).process(u,{from:s,parser:(null==(n=e.opts.syntax)?void 0:n.parse)??e.opts.parser??void 0}),m=p.root;return e.messages=e.messages.concat(p.messages),"atrule"===(null==(r=m.first)?void 0:r.type)&&l.test(m.first.name)?m.first.after(o.comment({text:`${t.uri}`,source:c.source})):m.prepend(o.comment({text:`${t.uri}`,source:c.source})),parseStyles(e,m,c,i,[...a,s],o)}function isProcessableURL(e){if(/^(?:[a-z]+:)?\/\//i.test(e))return!1;try{if(new URL(e,"https://example.com").search)return!1}catch{}return!0}function formatImportPrelude(e,t,s){const o=[];if(void 0!==e){let t="layer";e&&(t="layer("+e+")"),o.push(t)}return void 0!==s&&o.push("supports("+s+")"),void 0!==t&&o.push(t),o.join(" ")}function base64EncodedConditionalImport(e,t){t.reverse();const s=t.pop();let o=`${e} ${formatImportPrelude(s.layer,s.media,s.supports)}`;for(const e of t)o=`'data:text/css;base64,${Buffer.from(`@import ${o}`).toString("base64")}' ${formatImportPrelude(e.layer,e.media,e.supports)}`;return o}function applyConditions(e,t){e.statements.forEach(((s,o)=>{var n;if(isWarning(s)||isPreImportStatement(s)||null==(n=s.conditions)||!n.length)return;if(isImportStatement(s))return void(s.node.params=base64EncodedConditionalImport(s.fullUri,s.conditions));const r=s.nodes;if(!r.length)return;const i=r[0].parent;if(!i)return;const a=[];for(const e of s.conditions){if(void 0!==e.media){var c;const o=t({name:"media",params:e.media,source:(null==(c=s.importingNode)?void 0:c.source)??i.source});a.push(o)}if(void 0!==e.supports){var l;const o=t({name:"supports",params:"("+e.supports+")",source:(null==(l=s.importingNode)?void 0:l.source)??i.source});a.push(o)}if(void 0!==e.layer){var u;const o=t({name:"layer",params:e.layer,source:(null==(u=s.importingNode)?void 0:u.source)??i.source});a.push(o)}}const p=a[0];if(!p)return;for(let e=0;e<a.length-1;e++)a[e].append(a[e+1]);const m=a[a.length-1];i.insertBefore(r[0],p),r.forEach((e=>{e.parent=void 0})),m.append(r),e.statements[o]={type:"nodes",nodes:[p],conditions:s.conditions,from:s.from,importingNode:s.importingNode}}))}function applyStyles(e,t){t.nodes=[],e.charset&&(e.charset.parent=void 0,t.append(e.charset)),e.statements.forEach((e=>{isImportStatement(e)?(e.node.parent=void 0,t.append(e.node)):isNodesStatement(e)&&e.nodes.forEach((e=>{e.parent=void 0,t.append(e)}))}))}function postProcess(e,t){let s=-1,o=-1,n=-1;for(let t=0;t<e.statements.length;t++){const r=e.statements[t];if(isImportStatement(r)){if(s=t,-1!==s&&-1!==o&&-1!==n)break}else if(isPreImportStatement(r)){if(o=t,-1!==s&&-1!==o&&-1!==n)break}else if(isNodesStatement(r)){for(let e=0;e<r.nodes.length;e++){"comment"!==r.nodes[e].type&&(n=t)}if(-1!==s&&-1!==o&&-1!==n)break}else;}if(-1!==o)for(let o=0;o<e.statements.length;o++){const r=e.statements[o];if(isPreImportStatement(r))if(o<s&&(o<n||-1===n)){const s="data:text/css;base64,"+Buffer.from(r.node.toString()).toString("base64"),n={type:"import",uri:s,fullUri:"'"+s+"'",node:t({name:"import",params:"'"+s+"'",source:r.node.source}),conditions:r.conditions,from:r.from,importingNode:r.importingNode};e.statements.splice(o,1,n)}else{const t={type:"nodes",nodes:[r.node],conditions:r.conditions,from:r.from,importingNode:r.importingNode};e.statements.splice(o,1,t)}}}noopPlugin.postcss=!0;const creator$1=()=>({postcssPlugin:"postcss-bundler",async Once(e,{result:t,atRule:s,postcss:o}){const n=await parseStyles(t,e,null,[],[],o);postProcess(n,s),applyConditions(n,s),applyStyles(n,e)}});creator$1.postcss=!0;const creator=()=>({postcssPlugin:"postcss-bundler",plugins:[creator$1(),r()]});creator.postcss=!0,module.exports=creator;
