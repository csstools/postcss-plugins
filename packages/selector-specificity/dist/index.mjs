import e from"postcss-selector-parser";function compare(e,t){return e.a===t.a?e.b===t.b?e.c-t.c:e.b-t.b:e.a-t.a}function selectorSpecificity(t,s){const i=s?.customSpecificity?.(t);if(i)return i;if(!t)return{a:0,b:0,c:0};let c=0,n=0,o=0;if("universal"==t.type)return{a:0,b:0,c:0};if("id"===t.type)c+=1;else if("tag"===t.type)o+=1;else if("class"===t.type)n+=1;else if("attribute"===t.type)n+=1;else if(isPseudoElement(t))switch(t.value.toLowerCase()){case"::slotted":if(o+=1,t.nodes&&t.nodes.length>0){const e=specificityOfMostSpecificListItem(t.nodes,s);c+=e.a,n+=e.b,o+=e.c}break;case"::view-transition-group":case"::view-transition-image-pair":case"::view-transition-old":case"::view-transition-new":return t.nodes&&1===t.nodes.length&&"selector"===t.nodes[0].type&&selectorNodeContainsNothingOrOnlyUniversal(t.nodes[0])?{a:0,b:0,c:0}:{a:0,b:0,c:1};default:o+=1}else if(e.isPseudoClass(t))switch(t.value.toLowerCase()){case":-webkit-any":case":any":default:n+=1;break;case":-moz-any":case":has":case":is":case":matches":case":not":if(t.nodes&&t.nodes.length>0){const e=specificityOfMostSpecificListItem(t.nodes,s);c+=e.a,n+=e.b,o+=e.c}break;case":where":break;case":nth-child":case":nth-last-child":if(n+=1,t.nodes&&t.nodes.length>0){const i=t.nodes[0].nodes.findIndex((e=>"tag"===e.type&&"of"===e.value.toLowerCase()));if(i>-1){const a=e.selector({nodes:[],value:""});t.nodes[0].nodes.slice(i+1).forEach((e=>{a.append(e.clone())}));const r=[a];t.nodes.length>1&&r.push(...t.nodes.slice(1));const l=specificityOfMostSpecificListItem(r,s);c+=l.a,n+=l.b,o+=l.c}}break;case":local":case":global":t.nodes&&t.nodes.length>0&&t.nodes.forEach((e=>{const t=selectorSpecificity(e,s);c+=t.a,n+=t.b,o+=t.c}));break;case":host":case":host-context":if(n+=1,t.nodes&&t.nodes.length>0){const e=specificityOfMostSpecificListItem(t.nodes,s);c+=e.a,n+=e.b,o+=e.c}break;case":active-view-transition":case":active-view-transition-type":return{a:0,b:1,c:0}}else e.isContainer(t)&&t.nodes?.length>0&&t.nodes.forEach((e=>{const t=selectorSpecificity(e,s);c+=t.a,n+=t.b,o+=t.c}));return{a:c,b:n,c:o}}function specificityOfMostSpecificListItem(e,t){let s={a:0,b:0,c:0};return e.forEach((e=>{const i=selectorSpecificity(e,t);compare(i,s)<0||(s=i)})),s}function isPseudoElement(t){return e.isPseudoElement(t)}function selectorNodeContainsNothingOrOnlyUniversal(e){if(!e)return!1;if(!e.nodes)return!1;const t=e.nodes.filter((e=>"comment"!==e.type));return 0===t.length||1===t.length&&"universal"===t[0].type}export{compare,selectorSpecificity,specificityOfMostSpecificListItem};
