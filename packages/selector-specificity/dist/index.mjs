import e from"postcss-selector-parser";const s=/[A-Z]/g;function toLowerCaseAZ(e){return e.replace(s,(e=>String.fromCharCode(e.charCodeAt(0)+32)))}function compare(e,s){return e.a===s.a?e.b===s.b?e.c-s.c:e.b-s.b:e.a-s.a}function selectorSpecificity(s){if(!s)return{a:0,b:0,c:0};let t=0,n=0,c=0;if("universal"==s.type)return{a:0,b:0,c:0};if("id"===s.type)t+=1;else if("tag"===s.type)c+=1;else if("class"===s.type)n+=1;else if("attribute"===s.type)n+=1;else if(isPseudoElement(s))switch(toLowerCaseAZ(s.value)){case"::slotted":if(c+=1,s.nodes&&s.nodes.length>0){const e=specificityOfMostSpecificListItem(s.nodes);t+=e.a,n+=e.b,c+=e.c}break;case"::view-transition-group":case"::view-transition-image-pair":case"::view-transition-old":case"::view-transition-new":return s.nodes&&1===s.nodes.length&&"selector"===s.nodes[0].type&&selectorNodeContainsOnlyUniversal(s.nodes[0])?{a:0,b:0,c:0}:{a:0,b:0,c:1};default:c+=1}else if(e.isPseudoClass(s))switch(toLowerCaseAZ(s.value)){case":-moz-any":case":-webkit-any":case":any":default:n+=1;break;case":has":case":is":case":matches":case":not":if(s.nodes&&s.nodes.length>0){const e=specificityOfMostSpecificListItem(s.nodes);t+=e.a,n+=e.b,c+=e.c}break;case":where":break;case":nth-child":case":nth-last-child":if(n+=1,s.nodes&&s.nodes.length>0){const o=s.nodes[0].nodes.findIndex((e=>"tag"===e.type&&"of"===toLowerCaseAZ(e.value)));if(o>-1){const i=[e.selector({nodes:s.nodes[0].nodes.slice(o+1),value:""})];s.nodes.length>1&&i.push(...s.nodes.slice(1));const a=specificityOfMostSpecificListItem(i);t+=a.a,n+=a.b,c+=a.c}}break;case":local":case":global":s.nodes&&s.nodes.length>0&&s.nodes.forEach((e=>{const s=selectorSpecificity(e);t+=s.a,n+=s.b,c+=s.c}));break;case":host":case":host-context":if(n+=1,s.nodes&&s.nodes.length>0){const e=specificityOfMostSpecificListItem(s.nodes);t+=e.a,n+=e.b,c+=e.c}break;case":active-view-transition":return s.nodes&&1===s.nodes.length&&"selector"===s.nodes[0].type&&selectorNodeContainsOnlyUniversal(s.nodes[0])?{a:0,b:1,c:0}:{a:0,b:2,c:0}}else e.isContainer(s)&&s.nodes.length>0&&s.nodes.forEach((e=>{const s=selectorSpecificity(e);t+=s.a,n+=s.b,c+=s.c}));return{a:t,b:n,c:c}}function specificityOfMostSpecificListItem(e){let s={a:0,b:0,c:0};return e.forEach((e=>{const t=selectorSpecificity(e);t.a>s.a?s=t:t.a<s.a||(t.b>s.b?s=t:t.b<s.b||t.c>s.c&&(s=t))})),s}function isPseudoElement(s){return e.isPseudoElement(s)}function selectorNodeContainsOnlyUniversal(e){if(!e)return!1;if(!e.nodes)return!1;const s=e.nodes.filter((e=>"comment"!==e.type));return 1===s.length&&"universal"===s[0].type}export{compare,selectorSpecificity};
