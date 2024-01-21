import e from"postcss-selector-parser";function ampersandToScope(t,n){let r,o=t.parent;for(;o;){if("rule"===o.type)return;o=o.parent}try{r=e().astSync(t.selector)}catch(e){return void t.warn(n,`Failed to parse selector : "${t.selector}" with message: "${e.message}"`)}r&&(r.walkNesting((t=>{"root"===t.parent?.parent?.type?t.replaceWith(e.pseudo({value:":scope"})):t.replaceWith(e.pseudo({value:":is",nodes:[e.pseudo({value:":root"}),e.pseudo({value:":host"})]}))})),t.selector=r.toString())}function cleanupParent(e){if(!e.nodes.length)return void e.remove();const t=e.nodes.filter((e=>"comment"===e.type));t.length===e.nodes.length&&e.replaceWith(...t)}function shiftNodesBeforeParent(e,t){const n=t.index(e);if(n){const e=t.cloneBefore().removeAll().append(t.nodes.slice(0,n));e.raws.semicolon=!0,cleanupParent(e)}t.before(e),t.raws.semicolon=!0}function mergeSelectors(t,n,r,o){const s=[];if(0===o.length)return;const i=e().astSync(`:is(${r.join(",")})`);for(let r=0;r<o.length;r++){const l=e().astSync(o[r]);if(!l)continue;let a=!1;if(l.walk((e=>{"nesting"===e.type&&(a=!0)})),!a){const s=l.nodes[0];let i=!1;if(s.each((e=>"combinator"===e.type&&(i=!0,!1))),0===r){let e=!1;s.each((t=>"tag"===t.type&&(e=!0,!1))),e&&t.warn(n,`Invalid nested rule : "${o[r]}"`)}i||s.insertBefore(s.at(0),e.combinator({value:" "})),s.insertBefore(s.at(0),e.nesting({}))}l.walk((e=>{"nesting"===e.type&&e.replaceWith(i.clone({}))})),s.push(l.toString())}return s}function groupDeclarations(e){let t=-1;e.each(((n,r)=>{if("decl"===n.type){if(-1===t)return void(t=r);if(t===r-1)return void(t=r);n.remove(),e.insertAfter(t,n),t=e.index(n)}}))}function transformRuleWithinRule(e,t,n){let r=[];try{r=mergeSelectors(e,n,t.selectors,e.selectors)}catch(r){return void e.warn(n,`Failed to transform selectors : "${t.selector}" / "${e.selector}" with message: "${r.message}"`)}groupDeclarations(t),shiftNodesBeforeParent(e,t),e.selectors=r;"rule"===e.type&&"rule"===t.type&&e.selector===t.selector&&e.append(...t.nodes),cleanupParent(t)}var t=["container","document","media","supports","layer"];function atruleWithinRule(e,t,n,r){if(groupDeclarations(t),shiftNodesBeforeParent(e,t),e.nodes){const o=t.clone().removeAll().append(e.nodes);e.append(o),cleanupParent(t),r(o,n)}}function isAtruleWithinRule(e){return t.includes(e.name)}function comma(e){const t=[];let n="",r=!1,o=0,s=!1,i=!1;for(const l of e)i?i=!1:"\\"===l?i=!0:s?l===s&&(s=!1):'"'===l||"'"===l?s=l:"("===l?o+=1:")"===l?o>0&&(o-=1):0===o&&","===l&&(r=!0),r?(""!==n&&t.push(n.trim()),n="",r=!1):n+=l;return t.push(n.trim()),t}function transformAtruleWithinAtrule(e,t){var n,r;groupDeclarations(t),shiftNodesBeforeParent(e,t),e.params=(n=t.params,r=e.params,comma(n).map((e=>comma(r).map((t=>`${e} and ${t}`)).join(", "))).join(", ")),cleanupParent(t)}function isAtruleWithinAtrule(e,n){return t.includes(e.name)&&e.name===n.name}function isAtRule(e){return e&&"atrule"===e.type}function isRule(e){return e&&"rule"===e.type}function walk(e,t){e.each((e=>{const n=e.parent;isRule(e)&&e.selector.trim()&&isRule(n)&&n.selector.trim()?transformRuleWithinRule(e,n,t):isAtRule(e)&&isRule(n)&&n.selector.trim()&&isAtruleWithinRule(e)?atruleWithinRule(e,n,t,walk):isAtRule(e)&&isAtRule(n)&&isAtruleWithinAtrule(e,n)&&transformAtruleWithinAtrule(e,n),"nodes"in e&&e.nodes.length&&walk(e,t)}))}const creator=()=>({postcssPlugin:"postcss-nesting",Rule(e,{result:t}){walk(e,t),e.selector.trim().includes("&")&&ampersandToScope(e,t)}});creator.postcss=!0;export{creator as default};
