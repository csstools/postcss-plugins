import e from"postcss-selector-parser";function sourceFrom(e){return{sourceIndex:e.sourceIndex??0,source:e.source}}function sortCompoundSelectorsInsideComplexSelector(o){const t=[];let r=[];o.each((o=>{if("combinator"===o.type)return t.push(r,[o]),void(r=[]);if(e.isPseudoElement(o))return t.push(r),void(r=[o]);if("universal"===o.type&&r.find((e=>"universal"===e.type)))o.remove();else{if("tag"===o.type&&r.find((e=>"tag"===e.type))){o.remove();const t=e.selector({value:"",...sourceFrom(o)});t.append(o);const n=e.pseudo({value:":is",...sourceFrom(o)});return n.append(t),void r.push(n)}r.push(o)}})),t.push(r);const n=[];for(let e=0;e<t.length;e++){const o=t[e];o.sort(((e,o)=>selectorTypeOrder(e)-selectorTypeOrder(o))),n.push(...o)}o.removeAll();for(let e=n.length-1;e>=0;e--)n[e].remove(),o.prepend(n[e])}function selectorTypeOrder(t){return e.isPseudoElement(t)?o.pseudoElement:o[t.type]}const o={universal:0,tag:1,pseudoElement:2,nesting:3,id:4,class:5,attribute:6,pseudo:7,comment:8};function resolveNestedSelector(o,t){const r=[];for(let n=0;n<o.nodes.length;n++){const s=o.nodes[n].clone();{let o=!1;s.walkNesting((()=>(o=!0,!1))),o?"combinator"===s.nodes[0]?.type&&s.prepend(e.nesting({...sourceFrom(s)})):(s.prepend(e.combinator({value:" ",...sourceFrom(s)})),s.prepend(e.nesting({...sourceFrom(s)})))}{const e=new Set;s.walkNesting((o=>{const r=o.parent;e.add(r),"pseudo"===r.parent?.type&&":has"===r.parent.value?.toLowerCase()?o.replaceWith(...prepareParentSelectors(t,!0)):o.replaceWith(...prepareParentSelectors(t))}));for(const o of e)sortCompoundSelectorsInsideComplexSelector(o)}s.walk((e=>{"combinator"===e.type&&""!==e.value.trim()?(e.rawSpaceAfter=" ",e.rawSpaceBefore=" "):(e.rawSpaceAfter="",e.rawSpaceBefore="")})),r.push(s)}const n=e.root({value:"",...sourceFrom(o)});return r.forEach((e=>{n.append(e)})),n}function prepareParentSelectors(o,t=!1){if(t||!isCompoundSelector(o.nodes)){const t=e.pseudo({value:":is",...sourceFrom(o)});return o.nodes.forEach((e=>{t.append(e.clone())})),[t]}return o.nodes[0].nodes.map((e=>e.clone()))}function isCompoundSelector(o){return 1===o.length&&!o[0].nodes.some((o=>"combinator"===o.type||e.isPseudoElement(o)))}function combinationsWithSizeN(e,o){if(o<2)throw new Error("n must be greater than 1");if(e.length<2)throw new Error("s must be greater than 1");if(Math.pow(e.length,o)>1e4)throw new Error("Too many combinations when trying to resolve a nested selector with lists, reduce the complexity of your selectors");const t=[];for(let e=0;e<o;e++)t[e]=0;const r=[];for(;;){const n=[];for(let s=o-1;s>=0;s--){let o=t[s];if(o>=e.length){if(o=0,t[s]=0,0===s)return r;t[s-1]+=1}n[s]=e[o].clone()}r.push(n),t[t.length-1]++}}function flattenNestedSelector(o,t){const r=[];for(let n=0;n<o.nodes.length;n++){const s=o.nodes[n].clone();let c,l=0;{let o=!1;s.walkNesting((()=>{o=!0,l++})),o?"combinator"===s.nodes[0]?.type&&(s.prepend(e.nesting({...sourceFrom(s)})),l++):(s.prepend(e.combinator({value:" ",...sourceFrom(s)})),s.prepend(e.nesting({...sourceFrom(s)})),l++)}let p=[];if(l>1&&t.nodes.length>1)p=combinationsWithSizeN(t.nodes,l),c=p.length;else{c=t.nodes.length;for(let e=0;e<t.nodes.length;e++){p.push([]);for(let o=0;o<l;o++)p[e].push(t.nodes[e].clone())}}for(let e=0;e<c;e++){let o=0;const t=s.clone();t.walkNesting((t=>{const r=p[e][o];o++,t.replaceWith(...r.nodes)})),r.push(t)}}const n=e.root({value:"",...sourceFrom(o)});return r.forEach((e=>{n.append(e)})),n}export{flattenNestedSelector,resolveNestedSelector};
