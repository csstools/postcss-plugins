"use strict";var e=require("postcss-selector-parser"),r=require("@csstools/selector-specificity");const t="csstools-invalid-layer",a="csstools-layer-with-selector-rules",s="6efdb677-bb05-44e5-840f-29d2175862fd",n="b147acf6-11a6-4338-a4d0-80aef4cd1a2f",o=["media","supports"],l=["keyframes"],i=/^revert-layer$/i,c=/^import$/i,u=/^layer$/i,y=/layer/i,m=new Set(["layer","supports","media","container","scope"]);function isProcessableLayerRule(e){if("atrule"!==e.type)return!1;if(!u.test(e.name))return!1;let r=e.parent;for(;r;){if("rule"===r.type)return!1;if("atrule"===r.type&&!m.has(r.name.toLowerCase()))return!1;r=r.parent}return!0}class Model{anonymousLayerCount=0;layerCount=0;layerOrder;layerParamsParsed;layerNameParts;constructor(){this.anonymousLayerCount=0,this.layerCount=0,this.layerOrder=new Map,this.layerParamsParsed=new Map,this.layerNameParts=new Map}createAnonymousLayerName(){const e=`anonymous-${this.anonymousLayerCount}-${s}`;return this.addLayerNameParts(e),this.layerParamsParsed.set(e,[e]),this.anonymousLayerCount++,e}createImplicitLayerName(e){const r=this.layerNameParts.get(e)??[],t=`implicit-${r[r.length-1]}-${n}`;return this.addLayerNameParts([...r,t]),this.layerParamsParsed.set(t,[t]),t}addLayerParams(e,r){r?"string"!=typeof r?this.layerParamsParsed.set(e,r):this.layerParamsParsed.set(e,[r]):this.layerParamsParsed.set(e,[e])}addLayerNameParts(e){"string"!=typeof e?this.layerNameParts.set(e.join("."),e):this.layerNameParts.set(e,[e])}getLayerParams(e){const r=[...this.layerParamsParsed.get(e.params)??[]];let t=e.parent;for(;t;)"atrule"===t.type?(isProcessableLayerRule(t)&&r.push(...this.layerParamsParsed.get(t.params)??[]),t=t.parent):t=t.parent;return r.reverse(),r.flatMap((e=>this.layerNameParts.get(e)??[]))}getLayerNameList(e){const r=this.layerNameParts.get(e)??[],t=[];for(let e=0;e<r.length;e++){const a=r.slice(0,e+1).join(".");this.layerParamsParsed.has(a)||this.layerParamsParsed.set(a,[a]),this.layerNameParts.has(a)||this.layerNameParts.set(a,r.slice(0,e+1)),t.push(r.slice(0,e+1).join("."))}return t}sortLayerNames(){for(const[e,r]of this.layerOrder){const t=this.layerNameParts.get(e)??[];for(let e=1;e<t.length;e++){const a=t.slice(0,e).join(".");this.layerOrder.has(a)||this.layerOrder.set(a,r)}}let e=Array.from(this.layerOrder.entries());e=e.sort(((e,r)=>{const t=this.layerNameParts.get(e[0])??[],a=this.layerNameParts.get(r[0])??[];if(t[0]!==a[0])return(this.layerOrder.get(t[0])??0)-(this.layerOrder.get(a[0])??0);const s=Math.max(t.length,a.length);for(let e=0;e<s;e++){const r=t[e],s=a[e];if(r!==s)return r?s?(this.layerOrder.get(t.slice(0,e).join("."))??0)-(this.layerOrder.get(a.slice(0,e).join("."))??0):-1:1}return 0})),this.layerOrder.clear(),e.forEach(((e,r)=>{this.layerOrder.set(e[0],r)}))}}function adjustSelectorSpecificity(r,t){const a=e().astSync(r),s=e().astSync(generateNot(t));let n=!1;for(let r=0;r<a.nodes[0].nodes.length;r++)if("combinator"===a.nodes[0].nodes[r].type||e.isPseudoElement(a.nodes[0].nodes[r])){a.nodes[0].insertBefore(a.nodes[0].nodes[r],s),n=!0;break}return n||a.nodes[0].insertAfter(a.nodes[0].nodes[a.nodes[0].nodes.length-1],s),a.toString()}function generateNot(e){if(0===e)return"";let r="";for(let t=0;t<e;t++)r+=":not(#\\#)";return r}function someInTree(e,r){let t=!1;return e.walk((e=>{if(r(e))return t=!0,!1})),t}function someAtRuleInTree(e,r){let t=!1;return e.walkAtRules((e=>{if(r(e))return t=!0,!1})),t}function getLayerAtRuleAncestor(e){let r=e.parent;for(;r;)if("atrule"===r.type){if(isProcessableLayerRule(r))return r;r=r.parent}else r=r.parent;return null}function removeEmptyDescendantBlocks(e){e&&(e.walk((e=>{("rule"===e.type||"atrule"===e.type&&["layer",...o].includes(e.name.toLowerCase()))&&0===e.nodes?.length&&e.remove()})),0===e.nodes?.length&&e.remove())}function removeEmptyAncestorBlocks(e){if(!e)return;let r=e;for(;r;){if(void 0===r.nodes)return;if(r.nodes.length>0)return;const e=r.parent;r.remove(),r=e}}function desugarAndParseLayerNames(r,a){r.walkAtRules((r=>{if(!isProcessableLayerRule(r))return;if(r.params){const s=[];let n=!1;if(e().astSync(r.params).each((e=>{const r=[];e.walk((e=>{switch(e.type){case"class":case"tag":r.push(e.value);break;default:n=!0}})),n||(s.push(r.join(".")),a.addLayerNameParts(r))})),a.addLayerParams(r.params,s),r.nodes&&s.length>1&&(n=!0),n)return void(r.name=t);if(!r.nodes||0===r.nodes.length){if(s.length<=1)return;return s.slice(0,-1).forEach((e=>{a.addLayerParams(e,e),r.cloneBefore({params:e})})),a.addLayerParams(s[s.length-1],s[s.length-1]),void(r.params=s[s.length-1])}}r.params||(r.raws.afterName=" ",r.params=a.createAnonymousLayerName());const s=someAtRuleInTree(r,(e=>isProcessableLayerRule(e))),n=someInTree(r,(e=>{if("rule"!==e.type)return!1;return getLayerAtRuleAncestor(e)===r}));if(s&&n){const e=a.createImplicitLayerName(r.params),t=r.clone({params:e});t.walkAtRules((e=>{isProcessableLayerRule(e)&&e.remove()})),r.walk((e=>{if("atrule"===e.type&&isProcessableLayerRule(e))return;if("atrule"===e.type&&o.includes(e.name.toLowerCase()))return;getLayerAtRuleAncestor(e)===r&&e.remove()})),r.append(t),removeEmptyDescendantBlocks(r),removeEmptyAncestorBlocks(r)}}))}function desugarNestedLayers(e,r){for(;someAtRuleInTree(e,(e=>e.nodes&&someAtRuleInTree(e,(e=>isProcessableLayerRule(e)))));){let t=!1;if(e.walkAtRules((a=>{if(isProcessableLayerRule(a)&&a.parent!==e){if("atrule"===a.parent?.type&&isProcessableLayerRule(a.parent)){const e=a.parent;{const t=r.layerNameParts.get(e.params),s=r.layerNameParts.get(a.params);if(!t||!s)return;r.layerNameParts.set(`${e.params}.${a.params}`,[...t,...s]),r.layerParamsParsed.set(`${e.params}.${a.params}`,[`${e.params}.${a.params}`])}return a.params=`${e.params}.${a.params}`,e.before(a),removeEmptyDescendantBlocks(e),void removeEmptyAncestorBlocks(e)}if("atrule"===a.parent?.type){const e=a.parent,r=e.clone(),t=a.clone();return r.removeAll(),t.removeAll(),r.append(a.nodes),t.append(r),e.before(t),a.remove(),removeEmptyDescendantBlocks(e),void removeEmptyAncestorBlocks(e)}t=!0}})),t)break}}function sortRootNodes(e,r){e.walkAtRules((e=>{if(!isProcessableLayerRule(e))return;const r=e.clone(),t=e.clone();r.walkAtRules((e=>{if(l.includes(e.name.toLowerCase())){const r=e.parent;return e.remove(),removeEmptyDescendantBlocks(r),void removeEmptyAncestorBlocks(r)}if(someInTree(e,(e=>"rule"===e.type)))return;const r=e.parent;e.remove(),removeEmptyDescendantBlocks(r),removeEmptyAncestorBlocks(r)})),t.walkRules((e=>{if(e.parent&&"atrule"===e.parent.type&&l.includes(e.parent.name.toLowerCase()))return;const r=e.parent;e.remove(),removeEmptyDescendantBlocks(r),removeEmptyAncestorBlocks(r)})),t.walkAtRules((e=>{if(o.includes(e.name.toLowerCase()))return removeEmptyDescendantBlocks(e),void removeEmptyAncestorBlocks(e)})),r.name=a,e.replaceWith(r,t),0===r.nodes.length&&r.remove(),0===t.nodes.length&&t.remove()})),e.nodes.sort(((e,t)=>{const a="atrule"===e.type&&u.test(e.name),s="atrule"===t.type&&u.test(t.name);if(a&&s){return(r.layerOrder.get(e.params)??0)-(r.layerOrder.get(t.params)??0)}return a!==s?a?-1:1:0})),e.walkAtRules(a,(e=>{e.name="layer"}))}function getConditionalAtRuleAncestor(e){let r=e.parent;for(;r;)if("atrule"===r.type){if(o.includes(r.name.toLowerCase()))return r;r=r.parent}else r=r.parent;return null}function recordLayerOrder(e,r,{result:t,options:a}){e.walkAtRules((e=>{if(!isProcessableLayerRule(e))return;const o=r.getLayerParams(e),l=o.join(".");r.layerOrder.has(l)||(a.onConditionalRulesChangingLayerOrder&&getConditionalAtRuleAncestor(e)&&!e.params.endsWith(n)&&!e.params.endsWith(s)&&e.warn(t,"handling different layer orders in conditional rules is unsupported by this plugin and will cause style differences between browser versions."),r.layerParamsParsed.has(l)||r.layerParamsParsed.set(l,[l]),r.layerNameParts.has(l)||r.layerNameParts.set(l,[...o]),r.getLayerNameList(l).forEach((e=>{r.layerOrder.has(e)||(r.layerOrder.set(e,r.layerCount),r.layerCount+=1)}))),e.nodes&&0!==e.nodes.length||e.remove()}))}function splitImportantStyles(e){e.walkDecls((e=>{if(!e.important)return;const r=e.parent;if(!r)return;if("atrule"===r?.parent?.type&&l.includes(r.parent.name.toLowerCase()))return;const t=r.clone();t.each((e=>{"decl"===e.type&&e.important||e.remove()})),r.each((e=>{"decl"===e.type&&e.important&&e.remove()})),r.before(t),removeEmptyDescendantBlocks(r)}))}const creator=a=>{const s=Object.assign({onRevertLayerKeyword:"warn",onConditionalRulesChangingLayerOrder:"warn",onImportLayerRule:"warn"},a);return{postcssPlugin:"postcss-cascade-layers",OnceExit(a,{result:n}){let o=!1;if((s.onRevertLayerKeyword||s.onImportLayerRule)&&a.walk((e=>"decl"===e.type?i.test(e.value)?void e.warn(n,'handling "revert-layer" is unsupported by this plugin and will cause style differences between browser versions.'):void 0:"atrule"===e.type?c.test(e.name)&&y.test(e.params)?void e.warn(n,"To use @import with layers, the postcss-import plugin is also required. This plugin alone will not support using the @import at-rule."):u.test(e.name)?void(o=!0):void 0:void 0)),!o)return;splitImportantStyles(a);const m=new Model;if(desugarAndParseLayerNames(a,m),recordLayerOrder(a,m,{result:n,options:s}),!m.layerCount)return void a.walkAtRules(t,(e=>{e.name="layer"}));let p=0;for(a.walkRules((t=>{t.selectors.forEach((a=>{try{const t=r.selectorSpecificity(e().astSync(a));p=Math.max(p,t.a+1)}catch(e){t.warn(n,`Failed to parse selector : "${a}" with message: "${e instanceof Error?e.message:e}"`)}}))})),a.walkRules((e=>{e.parent&&"atrule"===e.parent.type&&l.includes(e.parent.name.toLowerCase())||getLayerAtRuleAncestor(e)||e.some((e=>"decl"===e.type&&e.important))||(e.selectors=e.selectors.map((r=>{try{return adjustSelectorSpecificity(r,m.layerCount*p)}catch(t){e.warn(n,`Failed to parse selector : "${r}" with message: "${t instanceof Error?t.message:t}"`)}return r})))})),m.sortLayerNames(),desugarNestedLayers(a,m),sortRootNodes(a,m),a.walkRules((e=>{if(e.parent&&"atrule"===e.parent.type&&l.includes(e.parent.name.toLowerCase()))return;const r=getLayerAtRuleAncestor(e);if(!r)return;const t=m.getLayerParams(r).join(".");let a=(m.layerOrder.get(t)??0)*p;e.some((e=>"decl"===e.type&&e.important))&&(a=m.layerCount-a),e.selectors=e.selectors.map((e=>adjustSelectorSpecificity(e,a)))}));someAtRuleInTree(a,(e=>isProcessableLayerRule(e)));)a.walkAtRules((e=>{isProcessableLayerRule(e)&&e.replaceWith(e.nodes)}));a.walkAtRules(t,(e=>{e.name="layer"}))}}};creator.postcss=!0,module.exports=creator;
