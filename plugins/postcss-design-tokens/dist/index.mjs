import e from"postcss-value-parser";import t from"path";import{promises as n}from"fs";import r from"module";import{parseListOfComponentValues as o,isFunctionNode as s,isWhitespaceNode as a,isCommentNode as i,isTokenNode as u}from"@csstools/css-parser-algorithms";import{tokenizer as l,TokenType as c}from"@csstools/css-tokenizer";function toposort(e,t){let n=e.length;const r=new Array(n),o={};let s=n;const a=makeOutgoingEdges(t),i=makeNodesHash(e);for(t.forEach((function(e){if(!i.has(e[0])||!i.has(e[1]))throw new Error("Unknown token. Make sure to provide all tokens used in aliases.")}));s--;)o[s]||visit(e[s],s,new Set);return r;function visit(e,t,s){if(s.has(e)){let t;try{t=", token was: "+JSON.stringify(e)}catch(e){t=""}throw new Error("Cyclic dependency"+t)}if(!i.has(e))throw new Error("Found unknown token. Make sure to provided all involved tokens. Unknown token: "+JSON.stringify(e));if(o[t])return;o[t]=!0;const u=Array.from(a.get(e)||new Set);if(t=u.length){s.add(e);do{const e=u[--t];visit(e,i.get(e),s)}while(t);s.delete(e)}r[--n]=e}}function makeOutgoingEdges(e){const t=new Map;for(let n=0,r=e.length;n<r;n++){const r=e[n];t.has(r[0])||t.set(r[0],new Set),t.has(r[1])||t.set(r[1],new Set),t.get(r[0]).add(r[1])}return t}function makeNodesHash(e){const t=new Map;for(let n=0,r=e.length;n<r;n++)t.set(e[n],n);return t}function extractStyleDictionaryV3Token(e,t,n,r){if(void 0===e.value)throw new Error('Token value is undefined for "'+[...n,t].join(".")+'"');switch(typeof e.value){case"string":case"number":break;default:throw new Error('Token value is not a string or a number for "'+[...n,t].join(".")+'"')}const o=String(e.value);return{value:o,cssValue:e=>applyTransformsToValue(o,e),name:String(e.name??"")||t,comment:String(e.comment??"")||void 0,metadata:{name:String(e.name??"")?t:void 0,path:[...n,t],filePath:r,isSource:!0}}}const f=new Map;function applyTransformsToValue(t,n){if(!t)return"";if(!n)return t;if(!n.toUnit)return t;const r=e.unit(t);if(!r||r.unit===n.toUnit)return t;if(!r.unit){if(f.has(n.toUnit)){if(f.get(n.toUnit))return`${t}${n.toUnit}`;throw new Error(`Invalid unit "${n.toUnit}" for "${t}"`)}try{const r=e.unit(`${t}${n.toUnit}`);if(r&&r.unit===n.toUnit)return f.set(n.toUnit,!0),`${t}${n.toUnit}`;f.set(n.toUnit,!1)}catch(e){f.set(n.toUnit,!1)}throw new Error(`Invalid unit "${n.toUnit}" for "${t}"`)}return"rem"===r.unit&&"px"===n.toUnit?remToPx(parseFloat(r.number),n.pluginOptions?.rootFontSize??16):"px"===r.unit&&"rem"===n.toUnit?pxToRem(parseFloat(r.number),n.pluginOptions?.rootFontSize??16):t}function remToPx(e,t){return`${formatFloat(e*t)}px`}function pxToRem(e,t){return`${formatFloat(e/t)}rem`}function formatFloat(e){if(Number.isInteger(e))return e.toString();let t=e.toFixed(5);for(let e=t.length-1;e>=0&&"."!==t[e]&&"0"===t[e];e--)t=t.slice(0,e);return t}function dereferenceTokenValues(e){const t=new Set,n=new Map;for(const[r,o]of e.entries()){const e=parseReferences(o.value);e.length&&(t.add(r),n.set(r,e))}for(const[r,o]of n.entries()){for(let n=0;n<o.length;n++){const r=o[n];if("value-reference"!==r.type)continue;if(t.has(r.raw))continue;if(!e.has(r.raw))throw new Error('Alias "'+r.raw+'" not found');const s=e.get(r.raw);o[n]={type:"value-resolved",raw:r.raw,value:s.cssValue()}}if(o.some((e=>"value-reference"===e.type)))continue;const s=o.map((e=>e.value)).join(""),a=e.get(r);a.value=s,a.cssValue=e=>applyTransformsToValue(s,e),e.set(r,a),t.delete(r),n.delete(r)}if(0===t.size)return e;{const r=Array.from(e.keys()),o=[];for(const[e,t]of n.entries())for(let n=0;n<t.length;n++){const r=t[n];"value-reference"===r.type&&o.push([r.raw,e])}const s=toposort(r,o);if(!s)throw new Error("Circular reference detected");for(const r of s){if(!n.has(r))continue;const o=n.get(r);for(let n=0;n<o.length;n++){const r=o[n];if("value-reference"!==r.type)continue;if(t.has(r.raw))throw new Error('Alias "'+r.raw+'" can not be resolved');if(!e.has(r.raw))throw new Error('Alias "'+r.raw+'" not found');const s=e.get(r.raw);o[n]={type:"value-resolved",raw:r.raw,value:s.cssValue()}}if(o.some((e=>"value-reference"===e.type)))throw new Error('Token "'+r+'" can not be fully resolved');const s=o.map((e=>e.value)).join(""),a=e.get(r);a.value=s,a.cssValue=e=>applyTransformsToValue(s,e),e.set(r,a),t.delete(r),n.delete(r)}if(0===t.size)return e}return e}function parseReferences(e){if("string"!=typeof e)return[];if(-1===e.indexOf("{"))return[];const t=[];let n=!1,r=!1,o="";for(let s=0;s<e.length;s++){const a=e[s];switch(a){case"{":if(r)throw new Error('Unexpected "{" in "'+e+'" at '+s);o.length>0&&(t.push({type:"value-non-reference",value:o}),o=""),r=!0;break;case"}":if(!r)throw new Error('Unexpected "}" in "'+e+'" at '+s);if(0===o.length)throw new Error('Empty alias "{}" in "'+e+'" at '+s);{let e=o.trim();".value"===e.slice(-6)&&(e=e.slice(0,-6)),t.push({type:"value-reference",raw:e}),o=""}n=!0,r=!1;break;default:o+=a}}if(r)throw new Error('Unexpected end of alias in "'+e+'"');return o.length>0&&t.push({type:"value-non-reference",value:o}),n?t:[]}function extractTokens(e,t,n){const r=new Map;for(const o in e)if(Object.hasOwnProperty.call(e,o)){if(null===e[o]||"object"!=typeof e[o]||Array.isArray(e[o]))throw new Error(`Parsing error at "${[...t,o].join(".")}"`);const s=Object(e[o]);if(!s)throw new Error(`Parsing error at "${[...t,o].join(".")}"`);if(void 0!==s.value){const e=extractStyleDictionaryV3Token(s,o,t,n);r.set(e.metadata.path.join("."),e);continue}for(const[e,a]of extractTokens(s,[...t,o],n).entries())r.set(e,a)}return r}function extractStyleDictionaryV3Tokens(e,t){return dereferenceTokenValues(extractTokens(e,[],t))}function extractStyleDictionaryTokens(e,t,n){if("3"===e)return extractStyleDictionaryV3Tokens(t,n);throw new Error("Unsupported version: "+e)}const p="6b4e71e7-4787-42f7-a092-8684961895db";function parseImport(t){const n=e(t),r={filePath:"",format:"standard",conditions:[p]};return n.walk((e=>{"function"===e.type&&"url"===e.value&&(r.filePath=e.nodes[0].value),"function"===e.type&&"format"===e.value&&(r.format=e.nodes[0].value),"function"===e.type&&"when"===e.value&&(r.conditions=e.nodes.filter((e=>"string"===e.type)).map((e=>e.value)))})),r.conditions.length||(r.conditions=[p]),r}async function tokensFromImport(e,o,s,a,i,u){const{filePath:l,format:c,conditions:f}=parseImport(i);if(!f.every((e=>s.includes(e))))return!1;let p="";try{if(l.startsWith("node_modules://")){p=r.createRequire(t.dirname(a)).resolve(l.slice(15))}else if(l.startsWith("node_modules:")){p=r.createRequire(t.dirname(a)).resolve(l.slice(13))}else p=t.resolve(t.dirname(a),l)}catch(e){throw new Error(`Failed to read ${l} with error ${e instanceof Error?e.message:e}`)}if(u.has(p))return!1;o.result.messages.push({type:"dependency",plugin:"postcss-design-tokens",file:p,parent:e.source?.input?.file}),u.add(p);const m=await n.readFile(p,"utf8"),d=JSON.parse(m);if("style-dictionary3"===c)return{filePath:t.resolve(l),tokens:extractStyleDictionaryTokens("3",d,p)};throw new Error("Unsupported format: "+c)}function mergeTokens(e,t){const n=new Map(e);for(const[e,r]of t)n.set(e,r);return n}function parsePluginOptions(e){const t={importAtRuleName:"design-tokens",is:[p],unitsAndValues:{rootFontSize:16},valueFunctionName:"design-token"};return e?("object"!=typeof e||(Array.isArray(e.is)&&(t.is=e.is.filter((e=>"string"==typeof e))),0===t.is.length&&(t.is=[p]),"object"==typeof e.unitsAndValues&&"number"==typeof e.unitsAndValues.rootFontSize&&((n=e.unitsAndValues.rootFontSize)>0&&n!==1/0)&&(t.unitsAndValues.rootFontSize=e.unitsAndValues.rootFontSize),"string"==typeof e.valueFunctionName&&(t.valueFunctionName=e.valueFunctionName),"string"==typeof e.importAtRuleName&&(t.importAtRuleName=e.importAtRuleName)),t):t;var n}function parseComponentValuesFromTokens(e){return o(e,{onParseError:e=>{throw e}})}function parseComponentValues(e){const t=l({css:e},{onParseError:e=>{throw e}}),n=[];for(;!t.endOfFile();)n.push(t.nextToken());return n.push(t.nextToken()),parseComponentValuesFromTokens(n)}function transform(e,t,n,r,o){const s=parseComponentValues(r);let a=!1;return s.forEach(((r,i)=>{if("walk"in r){{const u=transformComponentValue(r,e,t,n,o);if(u)return s.splice(i,1,...u),a=!0,!1}r.walk(((r,s)=>{if("string"==typeof s)return;const i=transformComponentValue(r.node,e,t,n,o);return i?(r.parent.value.splice(s,1,...i),a=!0,!1):void 0}))}})),a?s.map((e=>e.toString())).join(""):r}function transformComponentValue(e,t,n,r,o){if(!s(e))return;if(e.getName().toLowerCase()!==o.valueFunctionName)return;let l="",f="",p="";for(let t=0;t<e.value.length;t++){const n=e.value[t];if(!a(n)&&!i(n))if(l||!u(n)||n.value[0]!==c.String)if(l&&!f&&u(n)&&n.value[0]===c.Ident&&"to"===n.value[4].value.toLowerCase())f="to";else{if(!(l&&f&&u(n)&&n.value[0]===c.Ident))break;p=n.value[4].value}else l=n.value[4].value}if(!l)return void r.warn(n,"Expected at least a single string literal for the design-token function.");const m=t.get(l);if(!m)return void r.warn(n,`design-token: "${l}" is not configured.`);if(!f)return parseComponentValues(m.cssValue());const d={pluginOptions:o.unitsAndValues};if("to"===f){if(!p)return void r.warn(n,`Invalid or missing unit in "${e.toString()}"`);d.toUnit=p;try{return parseComponentValues(m.cssValue(d))}catch(e){return void r.warn(n,e instanceof Error?e.message:String(e))}}}const creator=e=>{const t=parsePluginOptions(e);return{postcssPlugin:"postcss-design-tokens",prepare(){let e=new Map,n=new Set;return{postcssPlugin:"postcss-design-tokens",OnceExit(){e=new Map,n=new Set},async Once(r,o){const s=[];r.walkAtRules((e=>{if(e.name.toLowerCase()!==t.importAtRuleName)return;if(!e?.source?.input?.file)return;const n=e.source.input.file,r=e.params;e.remove(),s.push({filePath:n,params:r,node:e})}));for(const a of s.values()){let s;try{if(s=await tokensFromImport(r,o,t.is,a.filePath,a.params,n),!s)continue}catch(e){a.node.warn(o.result,`Failed to import design tokens from "${a.params}" with error:\n\t`+(e instanceof Error?e.message:e));continue}o.result.messages.push({type:"dependency",plugin:"postcss-design-tokens",file:s.filePath,parent:a.filePath}),e=mergeTokens(e,s.tokens)}},Declaration(n,{result:r}){if(n.value.toLowerCase().includes(t.valueFunctionName))try{const o=transform(e,r,n,n.value,t);if(o===n.value)return;n.value=o}catch(e){n.warn(r,`Failed to parse and transform "${n.value}"`)}},AtRule(n,{result:r}){if(n.params.toLowerCase().includes(t.valueFunctionName))try{const o=transform(e,r,n,n.params,t);if(o===n.params)return;n.params=o}catch(e){n.warn(r,`Failed to parse and transform "${n.params}"`)}}}}}};creator.postcss=!0;export{creator as default};
