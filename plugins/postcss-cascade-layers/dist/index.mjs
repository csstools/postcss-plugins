import e from"postcss-selector-parser";import{selectorSpecificity as r}from"@csstools/selector-specificity";const a=["media","supports"],t=["keyframes"],s=new Set(["layer","supports","media","container","scope"]);function isProcessableLayerRule(e){if("atrule"!==e.type)return!1;if("layer"!==e.name.toLowerCase())return!1;let r=e.parent;for(;r;){if("rule"===r.type)return!1;if("atrule"===r.type&&!s.has(r.name.toLowerCase()))return!1;r=r.parent}return!0}class Model{anonymousLayerCount=0;layerCount=0;layerOrder;layerParamsParsed;layerNameParts;constructor(){this.anonymousLayerCount=0,this.layerCount=0,this.layerOrder=new Map,this.layerParamsParsed=new Map,this.layerNameParts=new Map}createAnonymousLayerName(){const e=`anonymous-${this.anonymousLayerCount}-6efdb677-bb05-44e5-840f-29d2175862fd`;return this.addLayerNameParts(e),this.layerParamsParsed.set(e,[e]),this.anonymousLayerCount++,e}createImplicitLayerName(e){const r=this.layerNameParts.get(e),a=`implicit-${r[r.length-1]}-b147acf6-11a6-4338-a4d0-80aef4cd1a2f`;return this.addLayerNameParts([...r,a]),this.layerParamsParsed.set(a,[a]),a}addLayerParams(e,r){r?"string"!=typeof r?this.layerParamsParsed.set(e,r):this.layerParamsParsed.set(e,[r]):this.layerParamsParsed.set(e,[e])}addLayerNameParts(e){"string"!=typeof e?this.layerNameParts.set(e.join("."),e):this.layerNameParts.set(e,[e])}getLayerParams(e){const r=[...this.layerParamsParsed.get(e.params)];let a=e.parent;for(;a;)"atrule"===a.type?(isProcessableLayerRule(a)&&r.push(...this.layerParamsParsed.get(a.params)),a=a.parent):a=a.parent;return r.reverse(),r.flatMap((e=>this.layerNameParts.get(e)))}getLayerNameList(e){const r=this.layerNameParts.get(e),a=[];for(let e=0;e<r.length;e++){const t=r.slice(0,e+1).join(".");this.layerParamsParsed.has(t)||this.layerParamsParsed.set(t,[t]),this.layerNameParts.has(t)||this.layerNameParts.set(t,r.slice(0,e+1)),a.push(r.slice(0,e+1).join("."))}return a}sortLayerNames(){for(const[e,r]of this.layerOrder){const a=this.layerNameParts.get(e);for(let e=1;e<a.length;e++){const t=a.slice(0,e).join(".");this.layerOrder.has(t)||this.layerOrder.set(t,r)}}let e=Array.from(this.layerOrder.entries());e=e.sort(((e,r)=>{const a=this.layerNameParts.get(e[0]),t=this.layerNameParts.get(r[0]);if(a[0]!==t[0])return this.layerOrder.get(a[0])-this.layerOrder.get(t[0]);const s=Math.max(a.length,t.length);for(let e=0;e<s;e++){const r=a[e],s=t[e];if(r!==s)return r?s?this.layerOrder.get(a.slice(0,e).join("."))-this.layerOrder.get(t.slice(0,e).join(".")):-1:1}})),this.layerOrder.clear(),e.forEach(((e,r)=>{this.layerOrder.set(e[0],r)}))}}function adjustSelectorSpecificity(r,a){const t=e().astSync(r),s=e().astSync(generateNot(a));let n=!1;for(let r=0;r<t.nodes[0].nodes.length;r++)if("combinator"===t.nodes[0].nodes[r].type||e.isPseudoElement(t.nodes[0].nodes[r])){t.nodes[0].insertBefore(t.nodes[0].nodes[r],s),n=!0;break}return n||t.nodes[0].insertAfter(t.nodes[0].nodes[t.nodes[0].nodes.length-1],s),t.toString()}function generateNot(e){if(0===e)return"";let r="";for(let a=0;a<e;a++)r+=":not(#\\#)";return r}function someInTree(e,r){let a=!1;return e.walk((e=>{if(r(e))return a=!0,!1})),a}function someAtRuleInTree(e,r){let a=!1;return e.walkAtRules((e=>{if(r(e))return a=!0,!1})),a}function getLayerAtRuleAncestor(e){let r=e.parent;for(;r;)if("atrule"===r.type){if(isProcessableLayerRule(r))return r;r=r.parent}else r=r.parent;return null}function removeEmptyDescendantBlocks(e){var r;e.walk((e=>{var r;("rule"===e.type||"atrule"===e.type&&["layer",...a].includes(e.name.toLowerCase()))&&(0===(null==(r=e.nodes)?void 0:r.length)&&e.remove())})),0===(null==(r=e.nodes)?void 0:r.length)&&e.remove()}function removeEmptyAncestorBlocks(e){let r=e;for(;r;){if(void 0===r.nodes)return;if(r.nodes.length>0)return;const e=r.parent;r.remove(),r=e}}function desugarAndParseLayerNames(r,t){r.walkAtRules((r=>{if(!isProcessableLayerRule(r))return;if(r.params){const a=[];let s=!1;if(e().astSync(r.params).each((e=>{const r=[];e.walk((e=>{switch(e.type){case"class":case"tag":r.push(e.value);break;default:s=!0}})),s||(a.push(r.join(".")),t.addLayerNameParts(r))})),t.addLayerParams(r.params,a),r.nodes&&a.length>1&&(s=!0),s)return void(r.name="csstools-invalid-layer");if(!r.nodes||0===r.nodes.length){if(a.length<=1)return;return a.slice(0,-1).forEach((e=>{t.addLayerParams(e,e),r.cloneBefore({params:e})})),t.addLayerParams(a[a.length-1],a[a.length-1]),void(r.params=a[a.length-1])}}r.params||(r.raws.afterName=" ",r.params=t.createAnonymousLayerName());const s=someAtRuleInTree(r,(e=>isProcessableLayerRule(e))),n=someInTree(r,(e=>{if("rule"!==e.type)return;return getLayerAtRuleAncestor(e)===r}));if(s&&n){const e=t.createImplicitLayerName(r.params),s=r.clone({params:e});s.walkAtRules((e=>{isProcessableLayerRule(e)&&e.remove()})),r.walk((e=>{if("atrule"===e.type&&isProcessableLayerRule(e))return;if("atrule"===e.type&&a.includes(e.name.toLowerCase()))return;getLayerAtRuleAncestor(e)===r&&e.remove()})),r.append(s),removeEmptyDescendantBlocks(r),removeEmptyAncestorBlocks(r)}}))}function desugarNestedLayers(e,r){for(;someAtRuleInTree(e,(e=>e.nodes&&someAtRuleInTree(e,(e=>isProcessableLayerRule(e)))));){let a=!1;if(e.walkAtRules((t=>{if(isProcessableLayerRule(t)&&t.parent!==e){if("atrule"===t.parent.type&&isProcessableLayerRule(t.parent)){const e=t.parent;return r.layerNameParts.set(`${e.params}.${t.params}`,[...r.layerNameParts.get(e.params),...r.layerNameParts.get(t.params)]),r.layerParamsParsed.set(`${e.params}.${t.params}`,[`${e.params}.${t.params}`]),t.params=`${e.params}.${t.params}`,e.before(t),removeEmptyDescendantBlocks(e),void removeEmptyAncestorBlocks(e)}if("atrule"===t.parent.type){const e=t.parent,r=e.clone(),a=t.clone();return r.removeAll(),a.removeAll(),r.append(t.nodes),a.append(r),e.before(a),t.remove(),removeEmptyDescendantBlocks(e),void removeEmptyAncestorBlocks(e)}a=!0}})),a)break}}function sortRootNodes(e,r){e.walkAtRules((e=>{if(!isProcessableLayerRule(e))return;const r=e.clone(),s=e.clone();r.walkAtRules((e=>{if(t.includes(e.name.toLowerCase())){const r=e.parent;return e.remove(),removeEmptyDescendantBlocks(r),void removeEmptyAncestorBlocks(r)}if(someInTree(e,(e=>"rule"===e.type)))return;const r=e.parent;e.remove(),removeEmptyDescendantBlocks(r),removeEmptyAncestorBlocks(r)})),s.walkRules((e=>{if(e.parent&&"atrule"===e.parent.type&&t.includes(e.parent.name.toLowerCase()))return;const r=e.parent;e.remove(),removeEmptyDescendantBlocks(r),removeEmptyAncestorBlocks(r)})),s.walkAtRules((e=>{if(a.includes(e.name.toLowerCase()))return removeEmptyDescendantBlocks(e),void removeEmptyAncestorBlocks(e)})),r.name="csstools-layer-with-selector-rules",e.replaceWith(r,s),0===r.nodes.length&&r.remove(),0===s.nodes.length&&s.remove()})),e.nodes.sort(((e,a)=>{const t="atrule"===e.type&&"layer"===e.name.toLowerCase(),s="atrule"===a.type&&"layer"===a.name.toLowerCase();return t&&s?r.layerOrder.get(e.params)-r.layerOrder.get(a.params):t!==s?t?-1:1:0})),e.walkAtRules("csstools-layer-with-selector-rules",(e=>{e.name="layer"}))}function getConditionalAtRuleAncestor(e){let r=e.parent;for(;r;)if("atrule"===r.type){if(a.includes(r.name.toLowerCase()))return r;r=r.parent}else r=r.parent;return null}function recordLayerOrder(e,r,{result:a,options:t}){e.walkAtRules((e=>{if(!isProcessableLayerRule(e))return;const s=r.getLayerParams(e),n=s.join(".");r.layerOrder.has(n)||(t.onConditionalRulesChangingLayerOrder&&getConditionalAtRuleAncestor(e)&&!e.params.endsWith("b147acf6-11a6-4338-a4d0-80aef4cd1a2f")&&!e.params.endsWith("6efdb677-bb05-44e5-840f-29d2175862fd")&&e.warn(a,"handling different layer orders in conditional rules is unsupported by this plugin and will cause style differences between browser versions."),r.layerParamsParsed.has(n)||r.layerParamsParsed.set(n,[n]),r.layerNameParts.has(n)||r.layerNameParts.set(n,[...s]),r.getLayerNameList(n).forEach((e=>{r.layerOrder.has(e)||(r.layerOrder.set(e,r.layerCount),r.layerCount+=1)}))),e.nodes&&0!==e.nodes.length||e.remove()}))}function splitImportantStyles(e){e.walkDecls((e=>{if(!e.important)return;const r=e.parent;if(r.parent&&"atrule"===r.parent.type&&t.includes(r.parent.name.toLowerCase()))return;const a=r.clone();a.each((e=>{"decl"===e.type&&e.important||e.remove()})),r.each((e=>{"decl"===e.type&&e.important&&e.remove()})),r.before(a),removeEmptyDescendantBlocks(r)}))}const creator=a=>{const s=Object.assign({onRevertLayerKeyword:"warn",onConditionalRulesChangingLayerOrder:"warn",onImportLayerRule:"warn"},a);return{postcssPlugin:"postcss-cascade-layers",OnceExit(a,{result:n}){s.onRevertLayerKeyword&&a.walkDecls((e=>{"revert-layer"===e.value.toLowerCase()&&e.warn(n,'handling "revert-layer" is unsupported by this plugin and will cause style differences between browser versions.')})),s.onImportLayerRule&&a.walkAtRules((e=>{"import"===e.name.toLowerCase()&&e.params.toLowerCase().includes("layer")&&e.warn(n,"To use @import with layers, the postcss-import plugin is also required. This plugin alone will not support using the @import at-rule.")})),splitImportantStyles(a);const o=new Model;if(desugarAndParseLayerNames(a,o),recordLayerOrder(a,o,{result:n,options:s}),!o.layerCount)return void a.walkAtRules("csstools-invalid-layer",(e=>{e.name="layer"}));let l=0;for(a.walkRules((a=>{a.selectors.forEach((t=>{try{const a=r(e().astSync(t));l=Math.max(l,a.a+1)}catch(e){a.warn(n,`Failed to parse selector : "${t}" with message: "${e.message}"`)}}))})),a.walkRules((e=>{e.parent&&"atrule"===e.parent.type&&t.includes(e.parent.name.toLowerCase())||getLayerAtRuleAncestor(e)||e.some((e=>"decl"===e.type&&e.important))||(e.selectors=e.selectors.map((r=>{try{return adjustSelectorSpecificity(r,o.layerCount*l)}catch(a){e.warn(n,`Failed to parse selector : "${r}" with message: "${a.message}"`)}return r})))})),o.sortLayerNames(),desugarNestedLayers(a,o),sortRootNodes(a,o),a.walkRules((e=>{if(e.parent&&"atrule"===e.parent.type&&t.includes(e.parent.name.toLowerCase()))return;const r=getLayerAtRuleAncestor(e);if(!r)return;const a=o.getLayerParams(r).join(".");let s=o.layerOrder.get(a)*l;e.some((e=>"decl"===e.type&&e.important))&&(s=o.layerCount-s),e.selectors=e.selectors.map((e=>adjustSelectorSpecificity(e,s)))}));someAtRuleInTree(a,(e=>isProcessableLayerRule(e)));)a.walkAtRules((e=>{isProcessableLayerRule(e)&&e.replaceWith(e.nodes)}));a.walkAtRules("csstools-invalid-layer",(e=>{e.name="layer"}))}}};creator.postcss=!0;export{creator as default};
