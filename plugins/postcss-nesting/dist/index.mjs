import e from"postcss-selector-parser";import{selectorSpecificity as t}from"@csstools/selector-specificity";import{resolveNestedSelector as n}from"@csstools/selector-resolve-nested";const r=e.pseudo({value:":is"});function sortCompoundSelectorsInsideComplexSelector(t){if(!t||!t.nodes)return;const n=[];let o=[];for(let s=0;s<t.nodes.length;s++)if("combinator"!==t.nodes[s].type)if(e.isPseudoElement(t.nodes[s]))n.push(o),o=[t.nodes[s]];else{if("tag"===t.nodes[s].type&&o.find((e=>"tag"===e.type))){const n=r.clone({}),o=t.nodes[s];o.replaceWith(n),n.append(e.selector({nodes:[o],value:void 0}))}o.push(t.nodes[s])}else n.push(o),n.push([t.nodes[s]]),o=[];n.push(o);const s=[];for(let e=0;e<n.length;e++){const t=n[e];t.sort(((e,t)=>"selector"===e.type&&"selector"===t.type&&e.nodes.length&&t.nodes.length?selectorTypeOrder(e.nodes[0])-selectorTypeOrder(t.nodes[0]):"selector"===e.type&&e.nodes.length?selectorTypeOrder(e.nodes[0])-selectorTypeOrder(t):"selector"===t.type&&t.nodes.length?selectorTypeOrder(e)-selectorTypeOrder(t.nodes[0]):selectorTypeOrder(e)-selectorTypeOrder(t)));for(let e=0;e<t.length;e++)s.push(t[e])}for(let e=s.length-1;e>=0;e--)s[e].remove(),t.prepend(s[e])}function selectorTypeOrder(t){return e.isPseudoElement(t)?o.pseudoElement:o[t.type]}const o={universal:0,tag:1,pseudoElement:2,id:3,class:4,attribute:5,pseudo:6,selector:7,string:8,root:9,comment:10};function isAtRule(e){return e&&"atrule"===e.type}function isNestRule(e){return e&&isAtRule(e)&&"nest"===e.name}function isRule(e){return e&&"rule"===e.type}function ampersandToScope$1(t,n){let r,o=t.parent;for(;o;){if("rule"===o.type)return;if(isAtRule(o)&&"scope"===o.name)return;o=o.parent}try{r=e().astSync(t.selector)}catch(e){return void t.warn(n,`Failed to parse selector : "${t.selector}" with message: "${e instanceof Error?e.message:e}"`)}r&&(r.walkNesting((t=>{const n=t.parent;t.replaceWith(e.pseudo({value:":scope"})),n&&sortCompoundSelectorsInsideComplexSelector(n)})),t.selector=r.toString())}function cleanupParent(e){if(!e.nodes.length)return void e.remove();const t=e.nodes.filter((e=>"comment"===e.type));t.length===e.nodes.length&&e.replaceWith(...t)}function groupDeclarations(e){const t=[],n=[];e.each((e=>{if(isDeclarationLike(e,n.length>0))t.push(e);else{if("comment"===e.type){let r=e.next();for(;r&&"comment"===r.type;)r=r.next();if(isDeclarationLike(r,n.length>0))return void t.push(e)}n.push(e)}})),e.removeAll(),t.forEach((t=>{e.append(t)})),n.forEach((t=>{e.append(t)}))}function isDeclarationLike(e,t){return!!e&&("decl"===e.type||"atrule"===e.type&&"mixin"===e.name.toLowerCase()&&!t)}function comma(e){const t=[];let n="",r=!1,o=0,s=!1,i=!1;for(const l of e)i?i=!1:"\\"===l?i=!0:s?l===s&&(s=!1):'"'===l||"'"===l?s=l:"("===l?o+=1:")"===l?o>0&&(o-=1):0===o&&","===l&&(r=!0),r?(""!==n&&t.push(n.trim()),n="",r=!1):n+=l;return t.push(n.trim()),t}function shiftNodesBeforeParent(e,t){const n=t.index(e);if(n){const e=t.cloneBefore().removeAll().append(t.nodes.slice(0,n));e.raws.semicolon=!0,cleanupParent(e)}t.before(e),t.raws.semicolon=!0}var s=["container","document","media","supports","layer","starting-style"];function transformAtruleWithinAtrule(e,t){var n,r;groupDeclarations(t),shiftNodesBeforeParent(e,t),e.params=(n=t.params,r=e.params,comma(n).map((e=>comma(r).map((t=>`${e} and ${t}`)).join(", "))).join(", ")),cleanupParent(t)}function isAtruleWithinAtrule(e,t){return s.includes(e.name)&&e.name===t.name}function atruleWithinRule$1(e,t,n,r,o){if(groupDeclarations(t),shiftNodesBeforeParent(e,t),e.nodes){const s=t.clone().removeAll().append(e.nodes);e.append(s),cleanupParent(t),r(s,n,o)}else cleanupParent(t)}function isAtruleWithinRule$1(e){return s.includes(e.name)}function combinationsWithSizeN(e,t){if(t<2)throw new Error("n must be greater than 1");if(e.length<2)throw new Error("s must be greater than 1");if(Math.pow(e.length,t)>1e4)throw new Error("Too many combinations when trying to resolve a nested selector with lists, reduce the complexity of your selectors");const n=[];for(let e=0;e<t;e++)n[e]=0;const r=[];for(;;){const o=[];for(let s=t-1;s>=0;s--){let t=n[s];if(t>=e.length){if(t=0,n[s]=0,0===s)return r;n[s-1]+=1}o[s]=e[t]}r.push(o),n[n.length-1]++}}function nodesAreEquallySpecific(n){const r=n.map((t=>e().astSync(t))).map((e=>t(e))),o=r[0];for(let e=1;e<r.length;e++)if(o.a!==r[e].a||o.b!==r[e].b||o.c!==r[e].c)return!1;return!0}function mergeSelectors$1(t,n,r){let o=[];o=nodesAreEquallySpecific(t)||r.noIsPseudoSelector?t.map((t=>e().astSync(t))):[e().astSync(`:is(${t.join(",")})`)];const s=[];for(let t=0;t<n.length;t++){let i,l=n[t];{const t=e().astSync(l);let n=!1;t.walk((e=>{"nesting"===e.type&&(n=!0)}));const r=t.nodes[0];let o=!1;r.each((e=>"combinator"===e.type&&(o=!0,!1))),n?o&&r.insertBefore(r.at(0),e.nesting({})):(r.insertBefore(r.at(0),e.combinator({value:" "})),r.insertBefore(r.at(0),e.nesting({}))),l=t.toString()}let a=[],c=0;if(e().astSync(l).walkNesting((()=>{c++})),c>1&&o.length>1)a=combinationsWithSizeN(o,c),i=a.length;else{i=o.length;for(let e=0;e<o.length;e++){a.push([]);for(let t=0;t<c;t++)a[e].push(o[e])}}for(let t=0;t<i;t++){let n=0;const o=e().astSync(l);o.walk((o=>{if("nesting"!==o.type)return;let s=a[t][n];n++,"root"===s.type&&1===s.nodes.length&&(s=s.nodes[0]);const i=e().astSync(`:is(${s.toString()})`),l=isSimpleSelector(s.nodes[0]),c=isCompoundSelector(s.nodes[0]),u=isSimpleSelector(o),p=isCompoundSelector(o);if(l&&u)return void o.replaceWith(s.clone());if((l||c)&&(u||p)){const e=o.parent;return l&&"selector"===s.type?o.replaceWith(s.clone().nodes[0]):o.replaceWith(...s.clone().nodes),void(e&&e.nodes.length>1&&sortCompoundSelectorsInsideComplexSelector(e))}if(l){const e=o.parent;return o.replaceWith(s.clone().nodes[0]),void(e&&sortCompoundSelectorsInsideComplexSelector(e))}if(c){const e=o.parent;return o.replaceWith(...s.clone().nodes),void(e&&sortCompoundSelectorsInsideComplexSelector(e))}if(nestingIsFirstAndOnlyInSelectorWithEitherSpaceOrChildCombinator(o)){const e=o.parent;return o.replaceWith(...s.clone().nodes),void(e&&sortCompoundSelectorsInsideComplexSelector(e))}if(nestingIsNotInsideCompoundSelector(o)){const e=o.parent;return o.replaceWith(...s.clone().nodes),void(e&&sortCompoundSelectorsInsideComplexSelector(e))}const d=o.parent;r.noIsPseudoSelector?o.replaceWith(...s.clone().nodes):o.replaceWith(...i.clone({}).nodes),d&&sortCompoundSelectorsInsideComplexSelector(d)})),s.push(o.toString())}}return s}function isSimpleSelector(e){return"combinator"!==e.type&&!(e.parent&&e.parent.nodes.length>1)}function isCompoundSelector(e,t=null){if(isSimpleSelector(e))return!1;if(!e.parent)return!1;if(!!e.parent.nodes.find((e=>"combinator"===e.type)))return!1;return!(!!e.parent.nodes.find((e=>"nesting"===e.type))&&t&&!isCompoundSelector(t))}function nestingIsFirstAndOnlyInSelectorWithEitherSpaceOrChildCombinator(e){if(!e.parent)return!1;if(0!==e.parent.nodes.indexOf(e))return!1;for(let t=1;t<e.parent.nodes.length;t++)if("combinator"===e.parent.nodes[t].type&&" "!==e.parent.nodes[t].value&&">"!==e.parent.nodes[t].value)return!1;return!0}function nestingIsNotInsideCompoundSelector(e){if(isSimpleSelector(e))return!0;if(!e.parent)return!1;for(let t=0;t<e.parent.nodes.length;t++)if("nesting"!==e.parent.nodes[t].type&&(e.parent.nodes[t].prev()||e.parent.nodes[t].next())){if(e.parent.nodes[t].prev()&&"combinator"!==e.parent.nodes[t].prev().type)return!1;if(e.parent.nodes[t].next()&&"combinator"!==e.parent.nodes[t].next().type)return!1}return!0}function transformNestRuleWithinRule(e,t,n,r,o){let s=[];try{s=mergeSelectors$1(t.selectors,comma(e.params),o)}catch(r){return void e.warn(n,`Failed to parse selectors : "${t.selector}" / "${e.params}" with message: "${r instanceof Error?r.message:r}"`)}if(!s.length)return;shiftNodesBeforeParent(e,t);const i=t.clone().removeAll().append(e.nodes);i.raws.semicolon=!0,i.selectors=s,e.replaceWith(i),cleanupParent(t),r(i,n,o)}function isValidNestRuleWithinRule(e){return comma(e.params).every((e=>e.split("&").length>=2&&-1===e.indexOf("|")))}function transformRuleWithinRule$1(e,t,n,r){let o=[];try{o=mergeSelectors$1(t.selectors,e.selectors,r)}catch(r){return void e.warn(n,`Failed to parse selectors : "${t.selector}" / "${e.selector}" with message: "${r instanceof Error?r.message:r}"`)}if(!o.length)return;groupDeclarations(t),shiftNodesBeforeParent(e,t),e.selectors=o;"rule"===e.type&&"rule"===t.type&&e.selector===t.selector&&e.append(...t.nodes),cleanupParent(t)}function isValidRuleWithinRule$1(e){return e.selectors.every((e=>-1===e.indexOf("|")))}function walk$1(e,t,n){e.each((r=>{const o=r.parent;isNestRule(r)&&!n.silenceAtNestWarning&&e.warn(t,`\`@nest\` was removed from the CSS Nesting specification and will be removed from PostCSS Nesting in the next major version.\nChange \`@nest ${r.params} {}\` to \`${r.params} {}\` to migrate to the latest standard.`),isRule(r)&&isRule(o)&&isValidRuleWithinRule$1(r)?transformRuleWithinRule$1(r,o,t,n):isNestRule(r)&&isRule(o)&&isValidNestRuleWithinRule(r)?transformNestRuleWithinRule(r,o,t,walk$1,n):isAtRule(r)&&isRule(o)&&isAtruleWithinRule$1(r)?atruleWithinRule$1(r,o,t,walk$1,n):isAtRule(r)&&isAtRule(o)&&isAtruleWithinAtrule(r,o)&&transformAtruleWithinAtrule(r,o),"nodes"in r&&r.nodes.length&&walk$1(r,t,n)}))}const creator$2=e=>{const t=Object.assign({noIsPseudoSelector:!1,silenceAtNestWarning:!1},e);return{postcssPlugin:"postcss-nesting",Rule(e,{result:n}){walk$1(e,n,t),e.selector.includes("&")&&ampersandToScope$1(e,n)}}};function ampersandToScope(t,n){let r,o=t.parent;for(;o;){if("rule"===o.type)return;if(isAtRule(o)&&"scope"===o.name)return;o=o.parent}try{r=e().astSync(t.selector)}catch(e){return void t.warn(n,`Failed to parse selector : "${t.selector}" with message: "${e instanceof Error?e.message:e}"`)}r&&(r.walkNesting((t=>{t.replaceWith(e.pseudo({value:":scope"}))})),t.selector=r.toString())}function atruleWithinRule(e,t,n,r){if(shiftNodesBeforeParent(e,t),e.nodes){const o=t.clone().removeAll().append(e.nodes);e.append(o),cleanupParent(t),r(o,n)}else cleanupParent(t)}function isAtruleWithinRule(e){return s.includes(e.name)}creator$2.postcss=!0;const i=e();function mergeSelectors(e,t,r,o){let s;try{s=n(i.astSync(t),i.astSync(r))}catch(n){return e.warn(o,`Failed to parse selectors : "${r}" / "${t}" with message: "${n instanceof Error?n.message:n}"`),!1}return!!s&&s.toString()}function transformRuleWithinRule(e,t,n){const r=mergeSelectors(e,e.selector,t.selector,n);if(!r)return;shiftNodesBeforeParent(e,t),e.selector=r;"rule"===e.type&&"rule"===t.type&&e.selector===t.selector&&e.append(...t.nodes),cleanupParent(t)}function isValidRuleWithinRule(e){return e.selectors.every((e=>-1===e.indexOf("|")))}function walk(e,t){e.each((e=>{const n=e.parent;isRule(e)&&isRule(n)&&isValidRuleWithinRule(e)?transformRuleWithinRule(e,n,t):isAtRule(e)&&isRule(n)&&isAtruleWithinRule(e)&&atruleWithinRule(e,n,t,walk),"nodes"in e&&e.nodes.length&&walk(e,t)}))}const creator$1=()=>({postcssPlugin:"postcss-nesting",Rule(e,{result:t}){walk(e,t),e.selector.includes("&")&&ampersandToScope(e,t)},AtRule:{nest(e){throw e.error(`\`@nest\` was removed from the CSS Nesting specification and will be removed from PostCSS Nesting in the next major version.\nChange \`@nest ${e.params} {}\` to \`${e.params} {}\` to migrate to the latest standard.`)}}});creator$1.postcss=!0;const creator=e=>{const t=Object.assign({edition:"2021"},e);switch(t.edition){case"2021":return creator$2(e);case"2024-02":return creator$1();default:throw new Error(`Invalid edition: ${t.edition}`)}};creator.postcss=!0;export{creator as default};
