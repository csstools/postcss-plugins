/* node:coverage disable */
"use strict";var e=require("node:assert/strict"),s=require("node:fs/promises"),t=require("node:fs"),n=require("node:path"),o=require("postcss"),r=require("postcss-8.4"),i=require("node:test"),a=require("node:url");const noopPlugin=()=>({postcssPlugin:"noop-plugin",Once(){}});async function fileContentsOrEmptyString(e){try{return await s.readFile(e,"utf8")}catch(e){return""}}function reduceInformationInCssSyntaxError(e){process.env.DEBUG||(delete e.source,e.input&&delete e.input.source,delete e.postcssNode)}noopPlugin.postcss=!0;const c={postcssPlugin:"declaration-cloner",Declaration(e){"to-clone"===e.prop&&e.cloneBefore({prop:"cloned"})}},p={postcssPlugin:"rule-cloner",prepare(){const e=new WeakSet;return{postcssPlugin:"rule-cloner",RuleExit(s){e.has(s)||"to-clone"===s.selector&&(e.add(s),s.cloneBefore({selector:"cloned"}))}}}},l={postcssPlugin:"at-rule-cloner",prepare(){const e=new WeakSet;return{postcssPlugin:"at-rule-cloner",AtRuleExit(s){if(!e.has(s))return"to-clone"===s.params?(e.add(s),void s.cloneBefore({params:"cloned"})):"to-clone"===s.name?(e.add(s),void s.cloneBefore({name:"cloned"})):void 0}}}};class PackageDescriptionError extends Error{constructor(e,s){super(e),this.name="PackageDescriptionError",this.stack=`${this.name}: ${this.message}\n    at "${s}" (${a.pathToFileURL(n.resolve("package.json")).href}:1:1)`}}class OutcomeError extends Error{constructor(e,s){super(e),this.name="OutcomeError",this.stack=`${this.name}: ${this.message}\n    at ${a.pathToFileURL(n.resolve(s)).href}:1:1`}}exports.atRuleClonerPlugin=l,exports.declarationClonerPlugin=c,exports.postcssTape=function postcssTape(a,c){return async p=>{c=c??{},await i("`postcss` flag is set on exported plugin creator",(()=>{e.equal(a.postcss,!0)})),await i("exported plugin creator is a function",(()=>{e.equal(typeof a,"function")})),await i("`postcssPlugin` is set on a plugin instance",(()=>{const s=a();e.ok(s.postcssPlugin),e.equal(typeof s.postcssPlugin,"string")})),await i("package.json",(async t=>{const n=await s.readFile("./package.json","utf-8"),o=JSON.parse(n);await t.test('includes "postcss-plugin" keyword',(()=>{e.ok(Array.isArray(o.keywords)&&o.keywords?.includes("postcss-plugin"),new PackageDescriptionError('Missing "postcss-plugin" keyword in package.json',"keywords"))})),await t.test('name starts with "postcss-"',{skip:c?.skipPackageNameCheck},(()=>{let s="string"==typeof o.name?o.name:"";if(s.startsWith("@")){const e=s.split("/");s=e.slice(1).join("/")}e.ok(s.startsWith("postcss-"),new PackageDescriptionError(`package name "${s}" does not start with "postcss-"`,"name"))})),await t.test("`postcss` is a peer dependency and not a direct dependency",{skip:"postcssTapeSelfTest"in a},(()=>{e.ok(Object.keys(Object(o.peerDependencies)).includes("postcss"),new PackageDescriptionError('"postcss" must be listed in "peerDependencies"',"peerDependencies")),e.ok(!Object.keys(Object(o.dependencies)).includes("postcss"),new PackageDescriptionError('"postcss" must not be listed in "dependencies"',"dependencies"))}))}));const l=a().postcssPlugin;await i(l,(async i=>{for(const c in p)await i.test(c,(async i=>{const l=p[c];l.before&&await l.before();const u=n.join(".","test",...c.split(":")[0].split(n.posix.sep)),d=n.join(".","test",...c.replace(/:/g,".").split(n.posix.sep)),g="css";let w=`${u}.${g}`,m=`${d}.expect.${g}`,f=`${d}.result.${g}`;l.source&&(w=n.join(".","test",l.source)),l.expect&&(m=n.join(".","test",l.expect)),l.result&&(f=n.join(".","test",l.result));const k=l.plugins??[a(l.options)],h=await fileContentsOrEmptyString(w),y=await fileContentsOrEmptyString(m);let E;try{E=await o(k).process(h,{from:w,to:f,map:{inline:!1,annotation:!1}})}catch(e){if(!(e instanceof Error))throw e;if(reduceInformationInCssSyntaxError(e),l.exception&&l.exception.test(e.message))return;throw e}e.ok(!l.exception,new OutcomeError(`expected an exception matching "${l.exception}"`,w));const x=E.css.toString();{const e=[s.writeFile(f,x,"utf8")];process.env.REWRITE_EXPECTS&&e.push(s.writeFile(m,x,"utf8")),await Promise.all(e)}y||e.ok(t.existsSync(m),new OutcomeError(`Missing expect file: "${m}"`,w)),await i.test("has expected output",(()=>{e.deepEqual(x,y),e.deepEqual(E.warnings().length,l.warnings??0,`Unexpected number warnings:\n${E.warnings().toString()}`)})),await i.test("sourcemaps",(()=>{e.ok(!E.map.toJSON().sources.includes("<no source>"),'Sourcemap is broken. This is most likely a newly created PostCSS AST Node without a value for "source". See: https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md#24-set-nodesource-for-new-nodes')})),l.after&&await l.after(),await i.test("output is parsable with PostCSS",(async()=>{const s=await fileContentsOrEmptyString(f),t=await o([noopPlugin()]).process(s,{from:f,to:f,map:{inline:!1,annotation:!1}});e.deepEqual(t.warnings(),[],"Unexpected warnings on second pass")})),await i.test("The oldest and current PostCSS version produce the same result",{skip:o([noopPlugin()]).version===r([noopPlugin()]).version},(async()=>{const s=await r(k).process(h,{from:w,to:f,map:{inline:!1,annotation:!1}});e.deepEqual(s.css.toString(),x)}))}))}))}},exports.ruleClonerPlugin=p;
/* node:coverage enable */
