"use strict";var e=require("postcss-selector-parser");const s=/[A-Z]/g;function toLowerCaseAZ(e){return e.replace(s,(e=>String.fromCharCode(e.charCodeAt(0)+32)))}function selectorSpecificity(s){if(!s)return{a:0,b:0,c:0};let t=0,c=0,n=0;if("universal"==s.type)return{a:0,b:0,c:0};if("id"===s.type)t+=1;else if("tag"===s.type)n+=1;else if("class"===s.type)c+=1;else if("attribute"===s.type)c+=1;else if(isPseudoElement(s))switch(toLowerCaseAZ(s.value)){case"::slotted":if(n+=1,s.nodes&&s.nodes.length>0){const e=specificityOfMostSpecificListItem(s.nodes);t+=e.a,c+=e.b,n+=e.c}break;case"::view-transition-group":case"::view-transition-image-pair":case"::view-transition-old":case"::view-transition-new":return s.nodes&&1===s.nodes.length&&"selector"===s.nodes[0].type&&selectorNodeContainsOnlyUniversal(s.nodes[0])?{a:0,b:0,c:0}:{a:0,b:0,c:1};default:n+=1}else if(e.isPseudoClass(s))switch(toLowerCaseAZ(s.value)){case":-moz-any":case":-webkit-any":case":any":default:c+=1;break;case":has":case":is":case":matches":case":not":if(s.nodes&&s.nodes.length>0){const e=specificityOfMostSpecificListItem(s.nodes);t+=e.a,c+=e.b,n+=e.c}break;case":where":break;case":nth-child":case":nth-last-child":if(c+=1,s.nodes&&s.nodes.length>0){const i=s.nodes[0].nodes.findIndex((e=>"tag"===e.type&&"of"===toLowerCaseAZ(e.value)));if(i>-1){const o=[e.selector({nodes:s.nodes[0].nodes.slice(i+1),value:""})];s.nodes.length>1&&o.push(...s.nodes.slice(1));const a=specificityOfMostSpecificListItem(o);t+=a.a,c+=a.b,n+=a.c}}break;case":local":case":global":s.nodes&&s.nodes.length>0&&s.nodes.forEach((e=>{const s=selectorSpecificity(e);t+=s.a,c+=s.b,n+=s.c}));break;case":host":case":host-context":if(c+=1,s.nodes&&s.nodes.length>0){const e=specificityOfMostSpecificListItem(s.nodes);t+=e.a,c+=e.b,n+=e.c}break;case":active-view-transition":return s.nodes&&1===s.nodes.length&&"selector"===s.nodes[0].type&&selectorNodeContainsOnlyUniversal(s.nodes[0])?{a:0,b:1,c:0}:{a:0,b:2,c:0}}else e.isContainer(s)&&s.nodes.length>0&&s.nodes.forEach((e=>{const s=selectorSpecificity(e);t+=s.a,c+=s.b,n+=s.c}));return{a:t,b:c,c:n}}function specificityOfMostSpecificListItem(e){let s={a:0,b:0,c:0};return e.forEach((e=>{const t=selectorSpecificity(e);t.a>s.a?s=t:t.a<s.a||(t.b>s.b?s=t:t.b<s.b||t.c>s.c&&(s=t))})),s}function isPseudoElement(s){return e.isPseudoElement(s)}function selectorNodeContainsOnlyUniversal(e){if(!e)return!1;if(!e.nodes)return!1;const s=e.nodes.filter((e=>"comment"!==e.type));return 1===s.length&&"universal"===s[0].type}exports.compare=function compare(e,s){return e.a===s.a?e.b===s.b?e.c-s.c:e.b-s.b:e.a-s.a},exports.selectorSpecificity=selectorSpecificity;
