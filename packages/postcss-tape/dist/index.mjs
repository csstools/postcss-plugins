import n from"path";import o,{promises as e}from"fs";import{strict as t}from"assert";import s from"postcss";import r from"postcss-8.4";import c from"postcss-html";function formatGitHubActionAnnotation(o,e="error",t={}){let s="::"+e;const r=Object.keys(t).map((o=>{let e=String(t[o]);return"file"===o&&process.env.GITHUB_WORKSPACE&&(e=n.relative(process.env.GITHUB_WORKSPACE,n.resolve(e))),`${o}=${s=e,s.replace(/\r/g,"%0D").replace(/\n/g,"%0A").replace(/]/g,"%5D").replace(/;/g,"%3B")}`;var s})).join(",");return r&&(s+=` ${r}`),`${s}::${c=o||"",c.replace(/\r/g,"%0D").replace(/\n/g,"%0A")}`;var c}const i="----------------------------------------";function formatCSSAssertError(n,o,e,t=!1){let s="";if(s+=`\n${n}\n\n`,o.message&&(s+=`message :\n  ${o.message}\n\n`),o.options)try{s+=`options :\n${JSON.stringify(o.options,null,2)}\n\n`}catch(n){}return s+=`output changed :\n${prettyDiff(e.message)}\n`,t||(s+="\n"+i),s}function formatWarningsAssertError(n,o,e,t,s=!1){let r="";if(r+=`\n${n}\n\n`,o.message&&(r+=`message :\n  ${o.message}\n\n`),o.options)try{r+=`options :\n${JSON.stringify(o.options,null,2)}\n\n`}catch(n){}return r+=`unexpected or missing warnings :\n+ actual ${e.length}\n- expected ${t}\n`,s||(e.forEach((n=>{r+=`\n[${n.plugin}]: ${n.text}`})),e.length&&(r+="\n"),r+="\n"+i),r}function prettyDiff(n){return n.replace(/[^\\](\\n)/gm,((n,o)=>n.replace(o," "))).replace(/(\\t)/gm,((n,o)=>n.replace(o," "))).replace(/\+$/gm,"").replace(/^Expected values to be strictly equal:\n/,"")}const noopPlugin=()=>({postcssPlugin:"noop-plugin",Rule(){}});function reduceInformationInCssSyntaxError(n){"CssSyntaxError"!==n.name||process.env.DEBUG||(delete n.source,n.input&&delete n.input.source,delete n.postcssNode)}noopPlugin.postcss=!0;const a=process.env.GITHUB_ACTIONS&&"true"===process.env.ENABLE_ANNOTATIONS_FOR_NODE&&"true"===process.env.ENABLE_ANNOTATIONS_FOR_OS;function postcssSyntax(n){return n.postcssSyntaxHTML?c():null}function runner(c){let l=!1;{!0!==c.postcss&&(l=!0,a?console.log(formatGitHubActionAnnotation('postcss flag not set to "true" on exported plugin object',"error",{file:"./package.json",line:1,col:1})):console.error(`\npostcss flag not set to "true"\n\n${i}`));const n=c();n.postcssPlugin&&"string"==typeof n.postcssPlugin||(l=!0,a?console.log(formatGitHubActionAnnotation('plugin name not set via "postcssPlugin"',"error",{file:"./package.json",line:1,col:1})):console.error(`\nplugin name not set via "postcssPlugin"\n\n${i}`));const e=JSON.parse(o.readFileSync("./package.json").toString());e.keywords&&e.keywords.includes("postcss-plugin")||(l=!0,a?console.log(formatGitHubActionAnnotation('package.json does not include "postcss-plugin" keyword',"error",{file:"./package.json",line:1,col:1})):console.error(`\npackage.json does not include "postcss-plugin" keyword\n\n${i}`));const t=["css-has-pseudo","css-blank-pseudo","css-prefers-color-scheme","@csstools/css-has-pseudo-experimental"].includes(e.name);e.name.startsWith("postcss-")||e.name.startsWith("@csstools/postcss-")||t||(l=!0,a?console.log(formatGitHubActionAnnotation('plugin name in package.json does not start with "postcss-"',"error",{file:"./package.json",line:1,col:1})):console.error(`\nplugin name in package.json does not start with "postcss-"\n\n${i}`)),Object.keys(Object(e.dependencies)).includes("postcss")&&!("postcssTapeSelfTest"in c)&&(l=!0,a?console.log(formatGitHubActionAnnotation("postcss should only be a peer and/or dev dependency","error",{file:"./package.json",line:1,col:1})):console.error(`\npostcss should only be a peer and/or dev dependency\n\n${i}`))}return async o=>{const p=new Set;for(const u in o){const g=o[u];g.before&&await g.before();const f=n.join(".","test",u.split(":")[0]),m=n.join(".","test",u.replace(/:/g,"."));let d="css";g.postcssSyntaxHTML&&(d="html");const S=`${f}.${d}`;let A=`${m}.expect.${d}`,$=`${m}.result.${d}`;g.expect&&(A=n.join(".","test",g.expect)),g.result&&($=n.join(".","test",g.result));const y=g.plugins??[c(g.options)],w=await e.readFile(S,"utf8");let h,b="";try{b=await e.readFile(A,"utf8")}catch(o){l=!0,b=!1,a?console.log(formatGitHubActionAnnotation(`${u}\n\nmissing or broken "expect" file: "${n.parse(A).base}"`,"error",{file:S,line:1,col:1})):(p.add(u),console.error(`\n${u}\n\nmissing or broken "expect" file: "${n.parse(A).base}"\n\n${i}`))}let x=!1;try{h=await s(y).process(w,{from:S,to:$,map:{inline:!1,annotation:!1},syntax:postcssSyntax(g)})}catch(n){if(reduceInformationInCssSyntaxError(n),x=!0,g.exception&&g.exception.test(n.message))continue;throw n}!x&&g.exception&&(l=!0,a?console.log(formatGitHubActionAnnotation(`${u}\n\nexpected an exception but got none`,"error",{file:S,line:1,col:1})):(p.add(u),console.error(`\n${u}\n\nexpected an exception but got none\n\n${i}`)));const E=h.css.toString();if(await e.writeFile($,E,"utf8"),process.env.REWRITE_EXPECTS&&e.writeFile(A,E,"utf8"),!1!==b){try{t.strictEqual(E,b)}catch(n){l=!0,a?console.log(formatGitHubActionAnnotation(formatCSSAssertError(u,g,n,!0),"error",{file:A,line:1,col:1})):(p.add(u),console.error(formatCSSAssertError(u,g,n)))}try{if(!g.postcssSyntaxHTML&&h.map.toJSON().sources.includes("<no source>"))throw new Error("Sourcemap is broken")}catch(n){l=!0;const o='\nThis is most likely a newly created PostCSS AST Node without a value for "source".\nsee :\n- https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md#24-set-nodesource-for-new-nodes\n- https://postcss.org/api/#node-source';a?console.log(formatGitHubActionAnnotation(`${u}\n\nbroken source map: ${JSON.stringify(h.map.toJSON().sources)}\n${o}`,"error",{file:S,line:1,col:1})):(p.add(u),console.error(`\n${u}\n\nbroken source map: ${JSON.stringify(h.map.toJSON().sources)}\n${o}\n\n${i}`))}g.after&&await g.after();try{const n=await e.readFile($,"utf8");if((await s([noopPlugin()]).process(n,{from:$,to:$,map:{inline:!1,annotation:!1},syntax:postcssSyntax(g)})).warnings().length)throw new Error("Unexpected warnings on second pass")}catch(n){l=!0,a?console.log(formatGitHubActionAnnotation(`${u}\n\nresult was not parsable with PostCSS.`,"error",{file:A,line:1,col:1})):(p.add(u),console.error(`\n${u}\n\nresult was not parsable with PostCSS.\n\n${i}`))}if(s([noopPlugin()]).version!==r([noopPlugin()]).version){const n=await r(y).process(w,{from:S,to:$,map:{inline:!1,annotation:!1}});try{t.strictEqual(n.css.toString(),E)}catch(n){reduceInformationInCssSyntaxError(n),l=!0,a?console.log(formatGitHubActionAnnotation("testing older PostCSS:\n"+formatCSSAssertError(u,g,n,!0),"error",{file:A,line:1,col:1})):(p.add(u),console.error("testing older PostCSS:\n"+formatCSSAssertError(u,g,n)))}}try{(h.warnings().length||g.warnings)&&t.strictEqual(h.warnings().length,g.warnings)}catch(n){l=!0,a?console.log(formatGitHubActionAnnotation(formatWarningsAssertError(u,g,h.warnings(),g.warnings,!0),"error",{file:A,line:1,col:1})):(p.add(u),console.error(formatWarningsAssertError(u,g,h.warnings(),g.warnings)))}}}if(p.size){console.error("\nunexpected failures:");for(const n of p.values())console.error("  - "+n)}l&&process.exit(1),console.warn("pass "+c().postcssPlugin)}}export{runner as default};
