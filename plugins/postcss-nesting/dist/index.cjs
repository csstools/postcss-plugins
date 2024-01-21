"use strict";var e=require("postcss-selector-parser");function ampersandToScope(t,n){let o,r=t.parent;for(;r;){if("rule"===r.type)return;r=r.parent}try{o=e().astSync(t.selector)}catch(e){return void t.warn(n,`Failed to parse selector : "${t.selector}" with message: "${e instanceof Error?e.message:e}"`)}o&&(o.walkNesting((t=>{t.replaceWith(e.pseudo({value:":scope"}))})),t.selector=o.toString())}function cleanupParent(e){if(!e.nodes.length)return void e.remove();const t=e.nodes.filter((e=>"comment"===e.type));t.length===e.nodes.length&&e.replaceWith(...t)}function shiftNodesBeforeParent(e,t){const n=t.index(e);if(n){const e=t.cloneBefore().removeAll().append(t.nodes.slice(0,n));e.raws.semicolon=!0,cleanupParent(e)}t.before(e),t.raws.semicolon=!0}const t=e.pseudo({value:":is"});function sortCompoundSelectorsInsideComplexSelector(n){if(!n||!n.nodes)return;const o=[];let r=[];for(let s=0;s<n.nodes.length;s++)if("combinator"!==n.nodes[s].type)if(e.isPseudoElement(n.nodes[s]))o.push(r),r=[n.nodes[s]];else{if("tag"===n.nodes[s].type&&r.find((e=>"tag"===e.type))){const o=t.clone({}),r=n.nodes[s];r.replaceWith(o),o.append(e.selector({nodes:[r],value:void 0}))}r.push(n.nodes[s])}else o.push(r),o.push([n.nodes[s]]),r=[];o.push(r);const s=[];for(let e=0;e<o.length;e++){const t=o[e];t.sort(((e,t)=>"selector"===e.type&&"selector"===t.type&&e.nodes.length&&t.nodes.length?selectorTypeOrder(e.nodes[0])-selectorTypeOrder(t.nodes[0]):"selector"===e.type&&e.nodes.length?selectorTypeOrder(e.nodes[0])-selectorTypeOrder(t):"selector"===t.type&&t.nodes.length?selectorTypeOrder(e)-selectorTypeOrder(t.nodes[0]):selectorTypeOrder(e)-selectorTypeOrder(t)));for(let e=0;e<t.length;e++)s.push(t[e])}for(let e=s.length-1;e>=0;e--)s[e].remove(),n.prepend(s[e])}function selectorTypeOrder(t){return e.isPseudoElement(t)?n.pseudoElement:n[t.type]}const n={universal:0,tag:1,pseudoElement:2,id:3,class:4,attribute:5,pseudo:6,selector:7,string:8,root:9,comment:10};function mergeSelectors(t,n){let o=e().astSync(t);const r=e().astSync(`:is(${t})`);isSimpleSelector(o)||isCompoundSelector(o)||(o=r);const s=o.nodes[0],l=r.nodes[0],i=[],a=e().astSync(n);for(let t=0;t<a.nodes.length;t++){const n=a.nodes[t];n.rawSpaceAfter="",n.rawSpaceBefore="";let o=!1;n.walkNesting((()=>(o=!0,!1))),o?"combinator"===n.nodes[0]?.type&&n.insertBefore(n.at(0),e.nesting({})):(n.insertBefore(n.at(0),e.combinator({value:" "})),n.insertBefore(n.at(0),e.nesting({}))),n.walkNesting((e=>{const t=e.parent;"pseudo"===e.parent?.parent?.type&&":has"===e.parent?.parent?.value?.toLowerCase()?e.replaceWith(...l.clone({}).nodes):e.replaceWith(...s.clone({}).nodes),t?.nodes.length>1&&sortCompoundSelectorsInsideComplexSelector(t)})),n.walk((e=>{"combinator"===e.type&&""!==e.value.trim()?(e.rawSpaceAfter=" ",e.rawSpaceBefore=" "):(e.rawSpaceAfter="",e.rawSpaceBefore="")})),i.push(n.toString().trim())}return i}function isSimpleSelector(t){return 1===t.nodes?.length&&1===t.nodes?.[0]?.length&&!("combinator"===t.nodes[0].nodes[0].type||"pseudo"===t.nodes[0].nodes[0].type&&e.isPseudoElement(t.nodes[0].nodes[0]))}function isCompoundSelector(t){return 1===t.nodes?.length&&!t.nodes[0]?.nodes?.some((n=>"combinator"===n.type||"pseudo"===t.nodes[0].nodes[0].type&&e.isPseudoElement(t.nodes[0].nodes[0])))}function groupDeclarations(e){let t=-1;e.each(((n,o)=>{if("decl"===n.type)return t===o-1?void(t=o):(n.remove(),e.insertAfter(t,n),void(t=e.index(n)));if("atrule"===n.type&&"mixin"===n.name.toLowerCase()){let r=n.prev();for(;r;){if("rule"===r.type||"atrule"===r.type)return;r=r.prev()}return t===o-1?void(t=o):(n.remove(),e.insertAfter(t,n),void(t=e.index(n)))}if("comment"===n.type){const r=n.next();if(r&&("comment"===r.type||"rule"===r.type||"atrule"===r.type&&"mixin"!==r.name.toLowerCase()))return;return t===o-1?void(t=o):(n.remove(),e.insertAfter(t,n),void(t=e.index(n)))}}))}function transformRuleWithinRule(e,t,n){let o=[];try{o=mergeSelectors(t.selector,e.selector)}catch(o){return void e.warn(n,`Failed to parse selectors : "${t.selector}" / "${e.selector}" with message: "${o instanceof Error?o.message:o}"`)}if(!o.length)return;groupDeclarations(t),shiftNodesBeforeParent(e,t),e.selector=o.join(", ");"rule"===e.type&&"rule"===t.type&&e.selector===t.selector&&e.append(...t.nodes),cleanupParent(t)}function isValidRuleWithinRule(e){return e.selectors.every((e=>-1===e.indexOf("|")))}var o=["container","document","media","supports","layer","starting-style"];function atruleWithinRule(e,t,n,o){if(groupDeclarations(t),shiftNodesBeforeParent(e,t),e.nodes){const r=t.clone().removeAll().append(e.nodes);e.append(r),cleanupParent(t),o(r,n)}else cleanupParent(t)}function isAtruleWithinRule(e){return o.includes(e.name)}function comma(e){const t=[];let n="",o=!1,r=0,s=!1,l=!1;for(const i of e)l?l=!1:"\\"===i?l=!0:s?i===s&&(s=!1):'"'===i||"'"===i?s=i:"("===i?r+=1:")"===i?r>0&&(r-=1):0===r&&","===i&&(o=!0),o?(""!==n&&t.push(n.trim()),n="",o=!1):n+=i;return t.push(n.trim()),t}function transformAtruleWithinAtrule(e,t){var n,o;groupDeclarations(t),shiftNodesBeforeParent(e,t),e.params=(n=t.params,o=e.params,comma(n).map((e=>comma(o).map((t=>`${e} and ${t}`)).join(", "))).join(", ")),cleanupParent(t)}function isAtruleWithinAtrule(e,t){return o.includes(e.name)&&e.name===t.name}function isAtRule(e){return e&&"atrule"===e.type}function isRule(e){return e&&"rule"===e.type}function walk(e,t){e.each((e=>{const n=e.parent;isRule(e)&&isRule(n)&&isValidRuleWithinRule(e)?transformRuleWithinRule(e,n,t):isAtRule(e)&&isRule(n)&&isAtruleWithinRule(e)?atruleWithinRule(e,n,t,walk):isAtRule(e)&&isAtRule(n)&&isAtruleWithinAtrule(e,n)&&transformAtruleWithinAtrule(e,n),"nodes"in e&&e.nodes.length&&walk(e,t)}))}const creator=e=>{if(Object.assign({noIsPseudoSelector:!1},e).noIsPseudoSelector)throw new Error("The `noIsPseudoSelector` option is no longer supported. Migrate your CSS to use the latest CSS nesting syntax.");return{postcssPlugin:"postcss-nesting",Rule(e,{result:t}){walk(e,t),e.selector.includes("&")&&ampersandToScope(e,t)},AtRule:{nest(e){throw e.error(`\`@nest\` was removed from the CSS Nesting specification and will be removed from PostCSS Nesting in the next major version.\nChange \`@nest ${e.params} {}\` to \`${e.params} {}\` to migrate to the latest standard.`)}}}};creator.postcss=!0,module.exports=creator;
