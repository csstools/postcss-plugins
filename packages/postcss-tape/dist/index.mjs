import o from"path";import n,{promises as e}from"fs";import{strict as t}from"assert";import s from"postcss";import r from"postcss-8.4";import c from"postcss-html";function formatGitHubActionAnnotation(n,e="error",t={}){let s="::"+e;const r=Object.keys(t).map((n=>{let e=String(t[n]);return"file"===n&&process.env.GITHUB_WORKSPACE&&(e=o.relative(process.env.GITHUB_WORKSPACE,o.resolve(e))),`${n}=${s=e,s.replace(/\r/g,"%0D").replace(/\n/g,"%0A").replace(/]/g,"%5D").replace(/;/g,"%3B")}`;var s})).join(",");return r&&(s+=` ${r}`),`${s}::${c=n||"",c.replace(/\r/g,"%0D").replace(/\n/g,"%0A")}`;var c}const a="----------------------------------------";function formatCSSAssertError(o,n,e,t=!1){let s="";if(s+=`\n${o}\n\n`,n.message&&(s+=`message :\n  ${n.message}\n\n`),n.options)try{s+=`options :\n${JSON.stringify(n.options,null,2)}\n\n`}catch(o){}return s+=`output changed :\n${prettyDiff(e.message)}\n`,t||(s+="\n"+a),s}function formatWarningsAssertError(o,n,e,t,s=!1){let r="";if(r+=`\n${o}\n\n`,n.message&&(r+=`message :\n  ${n.message}\n\n`),n.options)try{r+=`options :\n${JSON.stringify(n.options,null,2)}\n\n`}catch(o){}return r+=`unexpected or missing warnings :\n+ actual ${e.length}\n- expected ${t}\n`,s||(e.forEach((o=>{r+=`\n[${o.plugin}]: ${o.text}`})),e.length&&(r+="\n"),r+="\n"+a),r}function prettyDiff(o){return o.replace(/[^\\](\\n)/gm,((o,n)=>o.replace(n," "))).replace(/(\\t)/gm,((o,n)=>o.replace(n," "))).replace(/\+$/gm,"").replace(/^Expected values to be strictly equal:\n/,"")}const noopPlugin=()=>({postcssPlugin:"noop-plugin",Rule(){}});function reduceInformationInCssSyntaxError(o){"CssSyntaxError"!==o.name||process.env.DEBUG||(delete o.source,o.input&&delete o.input.source,delete o.postcssNode)}noopPlugin.postcss=!0;const i=process.env.GITHUB_ACTIONS&&"true"===process.env.ENABLE_ANNOTATIONS_FOR_NODE&&"true"===process.env.ENABLE_ANNOTATIONS_FOR_OS;function postcssSyntax(o){return o.postcssSyntaxHTML?c():null}function postcssTape(c){let l=!1;{!0!==c.postcss&&(l=!0,i?console.log(formatGitHubActionAnnotation('postcss flag not set to "true" on exported plugin object',"error",{file:"./package.json",line:1,col:1})):console.error(`\npostcss flag not set to "true"\n\n${a}`));const o=c();o.postcssPlugin&&"string"==typeof o.postcssPlugin||(l=!0,i?console.log(formatGitHubActionAnnotation('plugin name not set via "postcssPlugin"',"error",{file:"./package.json",line:1,col:1})):console.error(`\nplugin name not set via "postcssPlugin"\n\n${a}`));const e=JSON.parse(n.readFileSync("./package.json").toString());e.keywords&&e.keywords.includes("postcss-plugin")||(l=!0,i?console.log(formatGitHubActionAnnotation('package.json does not include "postcss-plugin" keyword',"error",{file:"./package.json",line:1,col:1})):console.error(`\npackage.json does not include "postcss-plugin" keyword\n\n${a}`));const t=["css-has-pseudo","css-blank-pseudo","css-prefers-color-scheme","@csstools/css-has-pseudo-experimental"].includes(e.name);e.name.startsWith("postcss-")||e.name.startsWith("@csstools/postcss-")||t||(l=!0,i?console.log(formatGitHubActionAnnotation('plugin name in package.json does not start with "postcss-"',"error",{file:"./package.json",line:1,col:1})):console.error(`\nplugin name in package.json does not start with "postcss-"\n\n${a}`)),Object.keys(Object(e.dependencies)).includes("postcss")&&!("postcssTapeSelfTest"in c)&&(l=!0,i?console.log(formatGitHubActionAnnotation("postcss should only be a peer and/or dev dependency","error",{file:"./package.json",line:1,col:1})):console.error(`\npostcss should only be a peer and/or dev dependency\n\n${a}`))}return async n=>{const p=new Set;for(const u in n){const g=n[u];g.before&&await g.before();const f=o.join(".","test",u.split(":")[0]),d=o.join(".","test",u.replace(/:/g,"."));let m="css";g.postcssSyntaxHTML&&(m="html");const S=`${f}.${m}`;let A=`${d}.expect.${m}`,$=`${d}.result.${m}`;g.expect&&(A=o.join(".","test",g.expect)),g.result&&($=o.join(".","test",g.result));const w=g.plugins??[c(g.options)],y=await e.readFile(S,"utf8");let h,b="";try{b=await e.readFile(A,"utf8")}catch(n){l=!0,b=!1,i?console.log(formatGitHubActionAnnotation(`${u}\n\nmissing or broken "expect" file: "${o.parse(A).base}"`,"error",{file:S,line:1,col:1})):(p.add(u),console.error(`\n${u}\n\nmissing or broken "expect" file: "${o.parse(A).base}"\n\n${a}`))}let x=!1;try{h=await s(w).process(y,{from:S,to:$,map:{inline:!1,annotation:!1},syntax:postcssSyntax(g)})}catch(o){if(reduceInformationInCssSyntaxError(o),x=!0,g.exception&&g.exception.test(o.message))continue;throw o}!x&&g.exception&&(l=!0,i?console.log(formatGitHubActionAnnotation(`${u}\n\nexpected an exception but got none`,"error",{file:S,line:1,col:1})):(p.add(u),console.error(`\n${u}\n\nexpected an exception but got none\n\n${a}`)));const E=h.css.toString();if(await e.writeFile($,E,"utf8"),process.env.REWRITE_EXPECTS&&e.writeFile(A,E,"utf8"),!1!==b){try{t.strictEqual(E,b)}catch(o){l=!0,i?console.log(formatGitHubActionAnnotation(formatCSSAssertError(u,g,o,!0),"error",{file:A,line:1,col:1})):(p.add(u),console.error(formatCSSAssertError(u,g,o)))}try{if(!g.postcssSyntaxHTML&&h.map.toJSON().sources.includes("<no source>"))throw new Error("Sourcemap is broken")}catch(o){l=!0;const n='\nThis is most likely a newly created PostCSS AST Node without a value for "source".\nsee :\n- https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md#24-set-nodesource-for-new-nodes\n- https://postcss.org/api/#node-source';i?console.log(formatGitHubActionAnnotation(`${u}\n\nbroken source map: ${JSON.stringify(h.map.toJSON().sources)}\n${n}`,"error",{file:S,line:1,col:1})):(p.add(u),console.error(`\n${u}\n\nbroken source map: ${JSON.stringify(h.map.toJSON().sources)}\n${n}\n\n${a}`))}g.after&&await g.after();try{const o=await e.readFile($,"utf8");if((await s([noopPlugin()]).process(o,{from:$,to:$,map:{inline:!1,annotation:!1},syntax:postcssSyntax(g)})).warnings().length)throw new Error("Unexpected warnings on second pass")}catch(o){l=!0,i?console.log(formatGitHubActionAnnotation(`${u}\n\nresult was not parsable with PostCSS.`,"error",{file:A,line:1,col:1})):(p.add(u),console.error(`\n${u}\n\nresult was not parsable with PostCSS.\n\n${a}`))}if(s([noopPlugin()]).version!==r([noopPlugin()]).version){const o=await r(w).process(y,{from:S,to:$,map:{inline:!1,annotation:!1}});try{t.strictEqual(o.css.toString(),E)}catch(o){reduceInformationInCssSyntaxError(o),l=!0,i?console.log(formatGitHubActionAnnotation("testing older PostCSS:\n"+formatCSSAssertError(u,g,o,!0),"error",{file:A,line:1,col:1})):(p.add(u),console.error("testing older PostCSS:\n"+formatCSSAssertError(u,g,o)))}}try{(h.warnings().length||g.warnings)&&t.strictEqual(h.warnings().length,g.warnings)}catch(o){l=!0,i?console.log(formatGitHubActionAnnotation(formatWarningsAssertError(u,g,h.warnings(),g.warnings,!0),"error",{file:A,line:1,col:1})):(p.add(u),console.error(formatWarningsAssertError(u,g,h.warnings(),g.warnings)))}}}if(p.size){console.error("\nunexpected failures:");for(const o of p.values())console.error("  - "+o)}l&&process.exit(1),console.warn("pass "+c().postcssPlugin)}}const l={postcssPlugin:"declaration-cloner",Declaration(o){"to-clone"===o.prop&&o.cloneBefore({prop:"cloned"})}},p={postcssPlugin:"rule-cloner",prepare(){const o=new WeakSet;return{RuleExit(n){o.has(n)||"to-clone"===n.selector&&(o.add(n),n.cloneBefore({selector:"cloned"}))}}}},u={postcssPlugin:"at-rule-cloner",prepare(){const o=new WeakSet;return{AtRuleExit(n){if(!o.has(n))return"to-clone"===n.params?(o.add(n),void n.cloneBefore({params:"cloned"})):"to-clone"===n.name?(o.add(n),void n.cloneBefore({name:"cloned"})):void 0}}}};export{u as atRuleClonerPlugin,l as declarationClonerPlugin,postcssTape,p as ruleClonerPlugin};
