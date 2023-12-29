import{parseListOfComponentValues as e,isWhitespaceNode as t,isCommentNode as s,isTokenNode as o,isFunctionNode as r,stringify as n}from"@csstools/css-parser-algorithms";import{tokenize as i,TokenType as a}from"@csstools/css-tokenizer";import c from"path";import p from"module";import u from"fs/promises";import l from"@csstools/postcss-rebase-url";function isWarning(e){return"warning"===e.type}function isNodesStatement(e){return"nodes"===e.type}function isImportStatement(e){return"import"===e.type}function isPreImportStatement(e){return"pre-import"===e.type}const m=/^data:text\/css(?:;(base64|plain))?,/i,d=/^data:text\/css;base64,/i,f=/^data:text\/css;plain,/i;function isValidDataURL(e){return!!e&&m.test(e)}const h=/^charset$/i,y=/^import$/i,g=/^url$/i,v=/^layer$/i,I=/^supports$/i;function parseAtImport(c){const p=i({css:c});if(2===p.length&&(p[0][0]===a.String||p[0][0]===a.URL)){let e=p[0][4].value;return e=stripHash(e),!!e&&{uri:e,fullUri:p[0][1]}}const u=e(p);let l,m,d,f="",h="";for(let e=0;e<u.length;e++){const i=u[e];if(!t(i)&&!s(i))if(!o(i)||i.value[0]!==a.String&&i.value[0]!==a.URL)if(r(i)&&g.test(i.getName())){if(f)return!1;for(let e=0;e<i.value.length;e++){const r=i.value[e];if(!t(r)&&!s(r)){if(f||!o(r)||r.value[0]!==a.String)return!1;f=r.value[4].value,h=n([[i]])}}}else{if(!f)return!1;if(o(i)&&i.value[0]===a.Ident&&v.test(i.value[4].value)){if(void 0!==l||void 0!==d)return!1;l=""}else if(r(i)&&v.test(i.getName())){if(void 0!==l||void 0!==d)return!1;l=n([i.value])}else{if(!r(i)||!I.test(i.getName())){m=n([u.slice(e)]);break}if(void 0!==d)return!1;d=n([i.value])}}else{if(f)return!1;f=i.value[4].value,h=i.value[1]}}return f=stripHash(f),!!f&&{uri:f,fullUri:h,layer:l,media:m,supports:d}}function stripHash(e){if(e.startsWith("#"))return"";if(!e.includes("#"))return e;try{const t=new URL(e,"http://example.com");return t.hash?e.slice(0,e.length-t.hash.length):e}catch{return e}}function parseStylesheet(e,t,s,o,r){const n={statements:[]};if("document"===t.type)return t.each((t=>{const i=parseStylesheet(e,t,s,o,r);if(n.charset&&i.charset&&n.charset.params.toLowerCase()!==i.charset.params.toLowerCase())throw i.charset.error(`Incompatible @charset statements:\n  ${i.charset.params} specified in ${i.charset.source?.input.file}\n  ${n.charset.params} specified in ${n.charset.source?.input.file}`);!n.charset&&i.charset&&(n.charset=i.charset),n.statements.push(...i.statements)})),n;let i,a,c=[],p=[];for(let n=0;n<t.nodes.length;n++){const u=t.nodes[n];if(0===n&&"atrule"===u.type&&h.test(u.name))i=u;else if(p.length||"comment"!==u.type&&("atrule"!==u.type||!v.test(u.name)||u.nodes)){if(p.length||"atrule"!==u.type||!y.test(u.name)){a={type:"nodes",nodes:t.nodes.slice(n),conditions:[...o],from:r,importingNode:s};break}[n,p]=consumeImports(e,t.nodes,o,n,s,r)}else[n,c]=consumeBeforeImports(t.nodes,o,n,s,r)}const u=[];return c.length&&u.push(...c),p.length&&u.push(...p),a&&u.push(a),{charset:i,statements:u}}function consumeImports(e,t,s,o,r,n){const i=[];let a=o;const c=t.length;for(;a<c;a++){const o=t[a];if("comment"!==o.type){if("atrule"!==o.type||!y.test(o.name))break;i.push(parseImport(e,o,r,s,n))}else{const[e,s]=consumeComments(t,a,r,n);i.push(s),a=e}}return[a-1,i]}function consumeBeforeImports(e,t,s,o,r){const n=[];let i=s;const a=e.length;for(;i<a;i++){const s=e[i];if("comment"!==s.type){if("atrule"===s.type&&v.test(s.name)&&!s.nodes){if(t.length){n.push({type:"pre-import",node:s,conditions:[...t],from:r,importingNode:o});continue}{const[s,a]=consumeLayers(e,t,i,o,r);n.push(a),i=s;continue}}break}{const[t,s]=consumeComments(e,i,o,r);n.push(s),i=t}}return[i-1,n]}function consumeComments(e,t,s,o){const r=[];let n=t;const i=e.length;for(;n<i;n++){const t=e[n];r.push(t);const s=e[n+1];if("comment"!==s?.type)break}return[n,{type:"nodes",nodes:r,conditions:[],from:o,importingNode:s}]}function consumeLayers(e,t,s,o,r){const n=[];let i=s;const a=e.length;for(;i<a;i++){const t=e[i];n.push(t);const s=e[i+1];if(!s||"atrule"!==s.type||!v.test(s.name)||s.nodes)break}return[i,{type:"nodes",nodes:n,conditions:[...t],from:r,importingNode:o}]}function parseImport(e,t,s,o,r){const n=parseAtImport(t.params);if(!n)return e.warn(`Invalid @import statement in '${t.toString()}'`,{node:t});const i={type:"import",uri:n.uri,fullUri:n.fullUri,node:t,conditions:[...o],from:r,importingNode:s};return void 0===n.layer&&void 0===n.media&&void 0===n.supports||i.conditions.push({layer:n.layer,media:n.media,supports:n.supports}),i}function resolveId(e,t,s,o){let r="";if(s.startsWith("node_modules:"))try{r=t.resolve(s.slice(13))}catch(t){throw e.error(`Failed to find '${s}'`)}else r=c.resolve(o,s);return r}function createRequire(e,t){let s;if(!e.source?.input?.file)return t.warn("The current PostCSS AST Node is lacking a source file reference. This is most likely a bug in a PostCSS plugin.",{node:e}),[];s=e.source.input.file;const o=c.dirname(s);return[p.createRequire(o),s,o]}async function loadContent(e){return isValidDataURL(e)?(t=e,d.test(t)?Buffer.from(t.slice(21),"base64").toString():f.test(t)?decodeURIComponent(t.slice(20)):decodeURIComponent(t.slice(14))):u.readFile(e,"utf-8");var t}async function parseStyles(e,t,s,o,r,n){const i=parseStylesheet(e,t,s,o,r);{let t,s,o;const r=[];for(const a of i.statements)isImportStatement(a)&&isProcessableURL(a.uri)&&(t&&s&&o||([t,s,o]=createRequire(a.node,e),t&&s&&o))&&r.push(resolveImportId(e,a,n,t,s,o));r.length&&await Promise.all(r)}for(let e=0;e<i.statements.length;e++){const t=i.statements[e];if(isImportStatement(t)&&t.stylesheet){if(i.charset&&t.stylesheet.charset&&i.charset.params.toLowerCase()!==t.stylesheet.charset.params.toLowerCase())throw t.stylesheet.charset.error(`Incompatible @charset statements:\n  ${t.stylesheet.charset.params} specified in ${t.stylesheet.charset.source?.input.file}\n  ${i.charset.params} specified in ${i.charset.source?.input.file}`);!i.charset&&t.stylesheet.charset&&(i.charset=t.stylesheet.charset),i.statements.splice(e,1,...t.stylesheet.statements),e--}else;}return i}async function resolveImportId(e,t,s,o,r,n){if(isValidDataURL(t.uri))return void(t.stylesheet=await loadImportContent(e,t,t.uri,s));if(isValidDataURL(t.from[t.from.length-1]))return t.stylesheet={statements:[]},void e.warn(`Unable to import '${t.uri}' from a stylesheet that is embedded in a data url`,{node:t.node});const i=resolveId(t.node,o,t.uri,n);e.messages.push({type:"dependency",plugin:"postcss-bundler",file:i,parent:r}),t.stylesheet=await loadImportContent(e,t,i,s)}async function loadImportContent(e,t,s,o){const{conditions:r,from:n,node:i}=t;if(n.includes(s))return{statements:[]};let a;try{a=await loadContent(s)}catch{throw i.error(`Failed to find '${t.uri}'`)}const c=await o([]).process(a,{from:s,parser:e.opts.syntax?.parse??e.opts.parser??void 0}),p=c.root;return e.messages=e.messages.concat(c.messages),"atrule"===p.first?.type&&h.test(p.first.name)?p.first.after(o.comment({text:`${t.uri}`,source:i.source})):p.prepend(o.comment({text:`${t.uri}`,source:i.source})),parseStyles(e,p,i,r,[...n,s],o)}function isProcessableURL(e){if(/^(?:[a-z]+:)?\/\//i.test(e))return!1;try{if(new URL(e,"https://example.com").search)return!1}catch{}return!0}function formatImportPrelude(e,t,s){const o=[];if(void 0!==e){let t="layer";e&&(t="layer("+e+")"),o.push(t)}return void 0!==s&&o.push("supports("+s+")"),void 0!==t&&o.push(t),o.join(" ")}function base64EncodedConditionalImport(e,t){t.reverse();const s=t.pop();let o=`${e} ${formatImportPrelude(s.layer,s.media,s.supports)}`;for(const e of t)o=`'data:text/css;base64,${Buffer.from(`@import ${o}`).toString("base64")}' ${formatImportPrelude(e.layer,e.media,e.supports)}`;return o}function applyConditions(e,t){e.statements.forEach(((s,o)=>{if(isWarning(s)||isPreImportStatement(s)||!s.conditions?.length)return;if(isImportStatement(s))return void(s.node.params=base64EncodedConditionalImport(s.fullUri,s.conditions));const r=s.nodes;if(!r.length)return;const n=r[0].parent;if(!n)return;const i=[];for(const e of s.conditions){if(void 0!==e.media){const o=t({name:"media",params:e.media,source:s.importingNode?.source??n.source});i.push(o)}if(void 0!==e.supports){const o=t({name:"supports",params:"("+e.supports+")",source:s.importingNode?.source??n.source});i.push(o)}if(void 0!==e.layer){const o=t({name:"layer",params:e.layer,source:s.importingNode?.source??n.source});i.push(o)}}const a=i[0];if(!a)return;for(let e=0;e<i.length-1;e++)i[e].append(i[e+1]);const c=i[i.length-1];n.insertBefore(r[0],a),r.forEach((e=>{e.parent=void 0})),c.append(r),e.statements[o]={type:"nodes",nodes:[a],conditions:s.conditions,from:s.from,importingNode:s.importingNode}}))}function applyStyles(e,t){t.nodes=[],e.charset&&(e.charset.parent=void 0,t.append(e.charset)),e.statements.forEach((e=>{isImportStatement(e)?(e.node.parent=void 0,t.append(e.node)):isNodesStatement(e)&&e.nodes.forEach((e=>{e.parent=void 0,t.append(e)}))}))}function postProcess(e,t){let s=-1,o=-1,r=-1;for(let t=0;t<e.statements.length;t++){const n=e.statements[t];if(isImportStatement(n)){if(s=t,-1!==s&&-1!==o&&-1!==r)break}else if(isPreImportStatement(n)){if(o=t,-1!==s&&-1!==o&&-1!==r)break}else if(isNodesStatement(n)){for(let e=0;e<n.nodes.length;e++){"comment"!==n.nodes[e].type&&(r=t)}if(-1!==s&&-1!==o&&-1!==r)break}else;}if(-1!==o)for(let o=0;o<e.statements.length;o++){const n=e.statements[o];if(isPreImportStatement(n))if(o<s&&(o<r||-1===r)){const s="data:text/css;base64,"+Buffer.from(n.node.toString()).toString("base64"),r={type:"import",uri:s,fullUri:"'"+s+"'",node:t({name:"import",params:"'"+s+"'",source:n.node.source}),conditions:n.conditions,from:n.from,importingNode:n.importingNode};e.statements.splice(o,1,r)}else{const t={type:"nodes",nodes:[n.node],conditions:n.conditions,from:n.from,importingNode:n.importingNode};e.statements.splice(o,1,t)}}}const creator$1=()=>({postcssPlugin:"postcss-bundler",async Once(e,{result:t,atRule:s,postcss:o}){const r=await parseStyles(t,e,null,[],[],o);postProcess(r,s),applyConditions(r,s),applyStyles(r,e)}});creator$1.postcss=!0;const creator=()=>({postcssPlugin:"postcss-bundler",plugins:[creator$1(),l()]});creator.postcss=!0;export{creator as default};
