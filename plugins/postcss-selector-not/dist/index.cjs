"use strict";var e=require("postcss-selector-parser");function cleanupWhitespace(e){e.spaces&&(e.spaces.after="",e.spaces.before=""),e.nodes&&e.nodes.length>0&&(e.nodes[0]&&e.nodes[0].spaces&&(e.nodes[0].spaces.before=""),e.nodes[e.nodes.length-1]&&e.nodes[e.nodes.length-1].spaces&&(e.nodes[e.nodes.length-1].spaces.after=""))}const creator=()=>({postcssPlugin:"postcss-selector-not",Rule:(s,{result:o})=>{if(s.selector&&s.selector.toLowerCase().includes(":not("))try{const o=e().astSync(s.selector);o.walkPseudos((s=>{if(":not"!==s.value.toLowerCase())return;if(!s.nodes||s.nodes.length<2)return;const o=[];s.nodes.forEach((s=>{cleanupWhitespace(s);const t=e.pseudo({value:":not",nodes:[s]});o.push(t)})),s.replaceWith(...o)}));const t=o.toString();t!==s.selector&&s.replaceWith(s.clone({selector:t}))}catch(e){s.warn(o,`Failed to parse selector : "${s.selector}" with message: "${e.message}"`)}}});creator.postcss=!0,module.exports=creator;
