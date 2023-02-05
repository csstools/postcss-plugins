"use strict";var e=require("postcss-value-parser"),t=require("path"),n=require("fs"),r=require("module"),o=require("@csstools/css-parser-algorithms"),s=require("@csstools/css-tokenizer");function toposort(e,t){let n=e.length;const r=new Array(n),o={};let s=n;const a=makeOutgoingEdges(t),i=makeNodesHash(e);for(t.forEach((function(e){if(!i.has(e[0])||!i.has(e[1]))throw new Error("Unknown token. Make sure to provide all tokens used in aliases.")}));s--;)o[s]||visit(e[s],s,new Set);return r;function visit(e,t,s){if(s.has(e)){let t;try{t=", token was: "+JSON.stringify(e)}catch(e){t=""}throw new Error("Cyclic dependency"+t)}if(!i.has(e))throw new Error("Found unknown token. Make sure to provided all involved tokens. Unknown token: "+JSON.stringify(e));if(o[t])return;o[t]=!0;let u=a.get(e)||new Set;if(u=Array.from(u),t=u.length){s.add(e);do{const e=u[--t];visit(e,i.get(e),s)}while(t);s.delete(e)}r[--n]=e}}function makeOutgoingEdges(e){const t=new Map;for(let n=0,r=e.length;n<r;n++){const r=e[n];t.has(r[0])||t.set(r[0],new Set),t.has(r[1])||t.set(r[1],new Set),t.get(r[0]).add(r[1])}return t}function makeNodesHash(e){const t=new Map;for(let n=0,r=e.length;n<r;n++)t.set(e[n],n);return t}function extractStyleDictionaryV3Token(e,t,n,r){if(void 0===e.value)throw new Error('Token value is undefined for "'+[...n,t].join(".")+'"');switch(typeof e.value){case"string":case"number":break;default:throw new Error('Token value is not a string or a number for "'+[...n,t].join(".")+'"')}const o=String(e.value);return{value:o,cssValue:e=>applyTransformsToValue(o,e),name:String(e.name??"")||t,comment:String(e.comment??"")||void 0,metadata:{name:String(e.name??"")?t:void 0,path:[...n,t],filePath:r,isSource:!0}}}const a=new Map;function applyTransformsToValue(t,n){if(!t)return"";if(!n)return t;if(!n.toUnit)return t;const r=e.unit(t??"");if(!r||r.unit===n.toUnit)return t;if(!r.unit){if(a.has(n.toUnit)){if(a.get(n.toUnit))return`${t}${n.toUnit}`;throw new Error(`Invalid unit "${n.toUnit}" for "${t}"`)}try{const r=e.unit(`${t}${n.toUnit}`);if(r&&r.unit===n.toUnit)return a.set(n.toUnit,!0),`${t}${n.toUnit}`;a.set(n.toUnit,!1)}catch(e){a.set(n.toUnit,!1)}throw new Error(`Invalid unit "${n.toUnit}" for "${t}"`)}var o,s;return"rem"===r.unit&&"px"===n.toUnit?remToPx(parseFloat(r.number),(null==(o=n.pluginOptions)?void 0:o.rootFontSize)??16):"px"===r.unit&&"rem"===n.toUnit?pxToRem(parseFloat(r.number),(null==(s=n.pluginOptions)?void 0:s.rootFontSize)??16):t}function remToPx(e,t){return`${formatFloat(e*t)}px`}function pxToRem(e,t){return`${formatFloat(e/t)}rem`}function formatFloat(e){if(Number.isInteger(e))return e.toString();let t=e.toFixed(5);for(let e=t.length-1;e>=0&&"."!==t[e]&&"0"===t[e];e--)t=t.slice(0,e);return t}function dereferenceTokenValues(e){const t=new Set,n=new Map;for(const[r,o]of e.entries()){const e=parseReferences(o.value);e.length&&(t.add(r),n.set(r,e))}for(const[r,o]of n.entries()){for(let n=0;n<o.length;n++){const r=o[n];if("value-reference"!==r.type)continue;if(t.has(r.raw))continue;if(!e.has(r.raw))throw new Error('Alias "'+r.raw+'" not found');const s=e.get(r.raw);o[n]={type:"value-resolved",raw:r.raw,value:s.cssValue()}}if(o.some((e=>"value-reference"===e.type)))continue;const s=o.map((e=>e.value)).join(""),a=e.get(r);a.value=s,a.cssValue=e=>applyTransformsToValue(s,e),e.set(r,a),t.delete(r),n.delete(r)}if(0===t.size)return e;{const r=Array.from(e.keys()),o=[];for(const[e,t]of n.entries())for(let n=0;n<t.length;n++){const r=t[n];"value-reference"===r.type&&o.push([r.raw,e])}const s=toposort(r,o);if(!s)throw new Error("Circular reference detected");for(const r of s){if(!n.has(r))continue;const o=n.get(r);for(let n=0;n<o.length;n++){const r=o[n];if("value-reference"!==r.type)continue;if(t.has(r.raw))throw new Error('Alias "'+r.raw+'" can not be resolved');if(!e.has(r.raw))throw new Error('Alias "'+r.raw+'" not found');const s=e.get(r.raw);o[n]={type:"value-resolved",raw:r.raw,value:s.cssValue()}}if(o.some((e=>"value-reference"===e.type)))throw new Error('Token "'+r+'" can not be fully resolved');const s=o.map((e=>e.value)).join(""),a=e.get(r);a.value=s,a.cssValue=e=>applyTransformsToValue(s,e),e.set(r,a),t.delete(r),n.delete(r)}if(0===t.size)return e}return e}function parseReferences(e){if("string"!=typeof e)return[];if(-1===e.indexOf("{"))return[];const t=[];let n=!1,r=!1,o="";for(let s=0;s<e.length;s++){const a=e[s];switch(a){case"{":if(r)throw new Error('Unexpected "{" in "'+e+'" at '+s);o.length>0&&(t.push({type:"value-non-reference",value:o}),o=""),r=!0;break;case"}":if(!r)throw new Error('Unexpected "}" in "'+e+'" at '+s);if(0===o.length)throw new Error('Empty alias "{}" in "'+e+'" at '+s);{let e=o.trim();".value"===e.slice(-6)&&(e=e.slice(0,-6)),t.push({type:"value-reference",raw:e}),o=""}n=!0,r=!1;break;default:o+=a}}if(r)throw new Error('Unexpected end of alias in "'+e+'"');return o.length>0&&t.push({type:"value-non-reference",value:o}),n?t:[]}function extractTokens(e,t,n){const r=new Map;for(const o in e)if(Object.hasOwnProperty.call(e,o)){if(null===e[o]||"object"!=typeof e[o]||Array.isArray(e[o]))throw new Error(`Parsing error at "${[...t,o].join(".")}"`);const s=Object(e[o]);if(!s)throw new Error(`Parsing error at "${[...t,o].join(".")}"`);if(void 0!==s.value){const e=extractStyleDictionaryV3Token(s,o,t,n);r.set(e.metadata.path.join("."),e);continue}for(const[e,a]of extractTokens(s,[...t,o],n).entries())r.set(e,a)}return r}function extractStyleDictionaryV3Tokens(e,t){return dereferenceTokenValues(extractTokens(e,[],t))}function extractStyleDictionaryTokens(e,t,n){if("3"===e)return extractStyleDictionaryV3Tokens(t,n);throw new Error("Unsupported version: "+e)}const i="6b4e71e7-4787-42f7-a092-8684961895db",u="design-token",l="design-tokens",c=r.createRequire("undefined"==typeof document?new(require("url").URL)("file:"+__filename).href:document.currentScript&&document.currentScript.src||new URL("index.cjs",document.baseURI).href);function parseImport(t){const n=e(t),r={filePath:"",format:"standard",conditions:[i]};return n.walk((e=>{"function"===e.type&&"url"===e.value&&(r.filePath=e.nodes[0].value),"function"===e.type&&"format"===e.value&&(r.format=e.nodes[0].value),"function"===e.type&&"when"===e.value&&(r.conditions=e.nodes.filter((e=>"string"===e.type)).map((e=>e.value)))})),r.conditions.length||(r.conditions=[i]),r}async function tokensFromImport(e,r,o,s){const{filePath:a,format:i,conditions:u}=parseImport(o);if(!u.every((t=>e.includes(t))))return!1;let l="";if(a.startsWith("node_modules://"))try{l=c.resolve(a.slice(15),{paths:[t.dirname(r)]})}catch(e){throw new Error(`Failed to read ${a} with error ${e.message}`)}else l=t.resolve(t.dirname(r),a);if(s.has(l))return!1;s.add(l);const f=await n.promises.readFile(l,"utf8"),p=JSON.parse(f);if("style-dictionary3"===i)return{filePath:t.resolve(a),tokens:extractStyleDictionaryTokens("3",p,l)};throw new Error("Unsupported format: "+i)}function mergeTokens(e,t){const n=new Map(e);for(const[e,r]of t)n.set(e,r);return n}function parsePluginOptions(e){const t={importAtRuleName:l,is:[i],unitsAndValues:{rootFontSize:16},valueFunctionName:u};return e?("object"!=typeof e||(Array.isArray(e.is)&&(t.is=e.is.filter((e=>"string"==typeof e))),0===t.is.length&&(t.is=[i]),"object"==typeof e.unitsAndValues&&"number"==typeof e.unitsAndValues.rootFontSize&&((n=e.unitsAndValues.rootFontSize)>0&&n!==1/0)&&(t.unitsAndValues.rootFontSize=e.unitsAndValues.rootFontSize),"string"==typeof e.valueFunctionName&&(t.valueFunctionName=e.valueFunctionName),"string"==typeof e.importAtRuleName&&(t.importAtRuleName=e.importAtRuleName)),t):t;var n}function parseComponentValuesFromTokens(e){return o.parseListOfComponentValues(e,{onParseError:e=>{throw e}})}function parseComponentValues(e){const t=s.tokenizer({css:e},{onParseError:e=>{throw e}}),n=[];for(;!t.endOfFile();)n.push(t.nextToken());return n.push(t.nextToken()),parseComponentValuesFromTokens(n)}function transform(e,t,n,r,o){const s=parseComponentValues(r);let a=!1;return s.forEach(((r,i)=>{if("walk"in r){{const u=transformComponentValue(r,e,t,n,o);if(u)return s.splice(i,1,...u),a=!0,!1}r.walk(((r,s)=>{if("string"==typeof s)return;const i=transformComponentValue(r.node,e,t,n,o);return i?(r.parent.value.splice(s,1,...i),a=!0,!1):void 0}))}})),a?s.map((e=>e.toString())).join(""):r}function transformComponentValue(e,t,n,r,a){if(!o.isFunctionNode(e))return;if(e.getName().toLowerCase()!==a.valueFunctionName)return;let i="",u="",l="";for(let t=0;t<e.value.length;t++){const n=e.value[t];if(!o.isWhitespaceNode(n)&&!o.isCommentNode(n))if(i||!o.isTokenNode(n)||n.value[0]!==s.TokenType.String)if(i&&!u&&o.isTokenNode(n)&&n.value[0]===s.TokenType.Ident&&"to"===n.value[4].value.toLowerCase())u="to";else{if(!(i&&u&&o.isTokenNode(n)&&n.value[0]===s.TokenType.Ident))break;l=n.value[4].value}else i=n.value[4].value}if(!i)return void r.warn(n,"Expected at least a single string literal for the design-token function.");const c=t.get(i);if(!c)return void r.warn(n,`design-token: "${i}" is not configured.`);if(!u)return parseComponentValues(c.cssValue());const f={pluginOptions:a.unitsAndValues};if("to"===u){if(!l)return void r.warn(n,`Invalid or missing unit in "${e.toString()}"`);f.toUnit=l;try{return parseComponentValues(c.cssValue(f))}catch(e){return void r.warn(n,e.message)}}}const creator=e=>{const t=parsePluginOptions(e);return{postcssPlugin:"postcss-design-tokens",prepare(){let e=new Map,n=new Set;return{OnceExit(){e=new Map,n=new Set},Once:async(r,{result:o})=>{const s=[];r.walkAtRules((e=>{var n,r;if(e.name.toLowerCase()!==t.importAtRuleName)return;if(null==e||null==(n=e.source)||null==(r=n.input)||!r.file)return;const o=e.source.input.file,a=e.params;e.remove(),s.push({filePath:o,params:a,node:e})}));for(const r of s.values()){let s;try{if(s=await tokensFromImport(t.is,r.filePath,r.params,n),!s)continue}catch(e){r.node.warn(o,`Failed to import design tokens from "${r.params}" with error:\n\t`+e.message);continue}o.messages.push({type:"dependency",plugin:"postcss-design-tokens",file:s.filePath,parent:r.filePath}),e=mergeTokens(e,s.tokens)}},Declaration(n,{result:r}){if(n.value.toLowerCase().includes(t.valueFunctionName))try{const o=transform(e,r,n,n.value,t);if(o===n.value)return;n.value=o}catch(e){n.warn(r,`Failed to parse and transform "${n.value}"`)}},AtRule(n,{result:r}){if(n.params.toLowerCase().includes(t.valueFunctionName))try{const o=transform(e,r,n,n.params,t);if(o===n.params)return;n.params=o}catch(e){n.warn(r,`Failed to parse and transform "${n.params}"`)}}}}}};creator.postcss=!0,module.exports=creator;
