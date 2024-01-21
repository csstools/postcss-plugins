"use strict";var e=require("postcss-selector-parser"),t=require("@csstools/selector-resolve-nested");function ampersandToScope(t,r){let n,o=t.parent;for(;o;){if("rule"===o.type)return;o=o.parent}try{n=e().astSync(t.selector)}catch(e){return void t.warn(r,`Failed to parse selector : "${t.selector}" with message: "${e instanceof Error?e.message:e}"`)}n&&(n.walkNesting((t=>{t.replaceWith(e.pseudo({value:":scope"}))})),t.selector=n.toString())}function cleanupParent(e){if(!e.nodes.length)return void e.remove();const t=e.nodes.filter((e=>"comment"===e.type));t.length===e.nodes.length&&e.replaceWith(...t)}function groupDeclarations(e){let t=-1;e.each(((r,n)=>{if("decl"===r.type)return t===n-1?void(t=n):(r.remove(),e.insertAfter(t,r),void(t=e.index(r)));if("atrule"===r.type&&"mixin"===r.name.toLowerCase()){let o=r.prev();for(;o;){if("rule"===o.type||"atrule"===o.type)return;o=o.prev()}return t===n-1?void(t=n):(r.remove(),e.insertAfter(t,r),void(t=e.index(r)))}if("comment"===r.type){const o=r.next();if(o&&("comment"===o.type||"rule"===o.type||"atrule"===o.type&&"mixin"!==o.name.toLowerCase()))return;return t===n-1?void(t=n):(r.remove(),e.insertAfter(t,r),void(t=e.index(r)))}}))}const r=e();function mergeSelectors(e,n,o,s){let i;try{i=t.resolveNestedSelector(r.astSync(n),r.astSync(o))}catch(t){return e.warn(s,`Failed to parse selectors : "${o}" / "${n}" with message: "${t instanceof Error?t.message:t}"`),!1}return!!i&&i.toString()}function shiftNodesBeforeParent(e,t){const r=t.index(e);if(r){const e=t.cloneBefore().removeAll().append(t.nodes.slice(0,r));e.raws.semicolon=!0,cleanupParent(e)}t.before(e),t.raws.semicolon=!0}function transformRuleWithinRule(e,t,r){const n=mergeSelectors(e,e.selector,t.selector,r);if(!n)return;groupDeclarations(t),shiftNodesBeforeParent(e,t),e.selector=n;"rule"===e.type&&"rule"===t.type&&e.selector===t.selector&&e.append(...t.nodes),cleanupParent(t)}function isValidRuleWithinRule(e){return e.selectors.every((e=>-1===e.indexOf("|")))}var n=["container","document","media","supports","layer","starting-style"];function atruleWithinRule(e,t,r,n){if(groupDeclarations(t),shiftNodesBeforeParent(e,t),e.nodes){const o=t.clone().removeAll().append(e.nodes),s=mergeSelectors(e,"&",t.selector,r);s&&(o.selector=s),e.append(o),cleanupParent(t),n(o,r)}else cleanupParent(t)}function isAtruleWithinRule(e){return n.includes(e.name)}function comma(e){const t=[];let r="",n=!1,o=0,s=!1,i=!1;for(const l of e)i?i=!1:"\\"===l?i=!0:s?l===s&&(s=!1):'"'===l||"'"===l?s=l:"("===l?o+=1:")"===l?o>0&&(o-=1):0===o&&","===l&&(n=!0),n?(""!==r&&t.push(r.trim()),r="",n=!1):r+=l;return t.push(r.trim()),t}function transformAtruleWithinAtrule(e,t){var r,n;groupDeclarations(t),shiftNodesBeforeParent(e,t),e.params=(r=t.params,n=e.params,comma(r).map((e=>comma(n).map((t=>`${e} and ${t}`)).join(", "))).join(", ")),cleanupParent(t)}function isAtruleWithinAtrule(e,t){return n.includes(e.name)&&e.name===t.name}function isAtRule(e){return e&&"atrule"===e.type}function isRule(e){return e&&"rule"===e.type}function walk(e,t){e.each((e=>{const r=e.parent;isRule(e)&&isRule(r)&&isValidRuleWithinRule(e)?transformRuleWithinRule(e,r,t):isAtRule(e)&&isRule(r)&&isAtruleWithinRule(e)?atruleWithinRule(e,r,t,walk):isAtRule(e)&&isAtRule(r)&&isAtruleWithinAtrule(e,r)&&transformAtruleWithinAtrule(e,r),"nodes"in e&&e.nodes.length&&walk(e,t)}))}const creator=e=>{if(Object.assign({noIsPseudoSelector:!1},e).noIsPseudoSelector)throw new Error("The `noIsPseudoSelector` option is no longer supported. Migrate your CSS to use the latest CSS nesting syntax.");return{postcssPlugin:"postcss-nesting",Rule(e,{result:t}){walk(e,t),e.selector.includes("&")&&ampersandToScope(e,t)},AtRule:{nest(e){throw e.error(`\`@nest\` was removed from the CSS Nesting specification and will be removed from PostCSS Nesting in the next major version.\nChange \`@nest ${e.params} {}\` to \`${e.params} {}\` to migrate to the latest standard.`)}}}};creator.postcss=!0,module.exports=creator;
