import r from"postcss-value-parser";var o,n;!function(r){r.Block="block",r.Inline="inline"}(o||(o={})),function(r){r.Start="start",r.End="end"}(n||(n={}));const e={BlockStart:"block-start",BlockEnd:"block-end",InlineStart:"inline-start",InlineEnd:"inline-end"};var t,i;function cloneDeclaration(r,o,n){r.parent&&r.parent.some((r=>"decl"==r.type&&r.prop===n&&r.value===o))||r.cloneBefore({value:o,prop:n})}function parseValueCouple(o){const n=r(o.value).nodes.filter((r=>"space"!==r.type));if(n.length>2){const r=`[postcss-logical] Invalid number of values for ${o.prop}. Found ${n.length} values, expected 1 or 2.`;throw o.error(r)}let e,t;return 1===n.length&&(e=r.stringify(n[0]),t=e),2===n.length&&(e=r.stringify(n[0]),t=r.stringify(n[1])),[e,t]}function transformBorder(r,o){return n=>(cloneDeclaration(n,n.value,`border-${o}-${r}`),!0)}function transformBorderProperty(r,o){return n=>{const[e,t]=o,[i,a]=parseValueCouple(n);return cloneDeclaration(n,i,`border-${e}-${r}`),cloneDeclaration(n,a,`border-${t}-${r}`),!0}}function transformBorderShorthand(r){return o=>(r.forEach((r=>cloneDeclaration(o,o.value,`border-${r}`))),!0)}function transformBorderRadius(r){return o=>{let n;switch(o.prop.toLowerCase()){case"border-start-start-radius":n=`border-${r.inlineIsHorizontal?`${r.block[0]}-${r.inline[0]}`:`${r.inline[0]}-${r.block[0]}`}-radius`;break;case"border-start-end-radius":n=`border-${r.inlineIsHorizontal?`${r.block[0]}-${r.inline[1]}`:`${r.inline[1]}-${r.block[0]}`}-radius`;break;case"border-end-start-radius":n=`border-${r.inlineIsHorizontal?`${r.block[1]}-${r.inline[0]}`:`${r.inline[0]}-${r.block[1]}`}-radius`;break;case"border-end-end-radius":n=`border-${r.inlineIsHorizontal?`${r.block[1]}-${r.inline[1]}`:`${r.inline[1]}-${r.block[1]}`}-radius`;break}return cloneDeclaration(o,o.value,n),!0}}function transformLogicalSize(r){return o=>{const{value:n}=o,e=r.inlineIsHorizontal?"width":"height",t=r.inlineIsHorizontal?"height":"width",i=o.prop.toLowerCase().replace("inline-size",e).replace("block-size",t);return cloneDeclaration(o,n,i),!0}}function transformOffset(r){return o=>(cloneDeclaration(o,o.value,r),!0)}function transformOffsetShorthand(r){return o=>{const[n,e]=r,[t,i]=parseValueCouple(o);return cloneDeclaration(o,t,n),cloneDeclaration(o,i,e),!0}}function transformSide(r,o){return n=>(cloneDeclaration(n,n.value,`${r}-${o}`),!0)}function transformSideShorthand(r,o){return n=>{const[e,t]=o,[i,a]=parseValueCouple(n);return cloneDeclaration(n,i,`${r}-${e}`),cloneDeclaration(n,a,`${r}-${t}`),!0}}function logicalToPhysical(r,o){const[n,t]=o.block,[i,a]=o.inline;switch(r){case e.BlockStart:return n;case e.BlockEnd:return t;case e.InlineStart:return i;case e.InlineEnd:return a}}function doTransform(o,n,e){const{prop:t,value:i}=o,a=r(i);a.nodes.forEach((r=>{if("word"===r.type){const o=r.value.toLowerCase();n.includes(o)&&(r.value=logicalToPhysical(o,e))}}));const l=a.toString();return l!==i&&(cloneDeclaration(o,l,t),!0)}function directionFlowToAxes(r){switch(r){case t.TopToBottom:return[i.Top,i.Bottom];case t.BottomToTop:return[i.Bottom,i.Top];case t.RightToLeft:return[i.Right,i.Left];case t.LeftToRight:return[i.Left,i.Right]}}!function(r){r.TopToBottom="top-to-bottom",r.BottomToTop="bottom-to-top",r.RightToLeft="right-to-left",r.LeftToRight="left-to-right"}(t||(t={})),function(r){r.Top="top",r.Right="right",r.Bottom="bottom",r.Left="left"}(i||(i={}));const creator=o=>{const a=Object.assign({blockDirection:t.TopToBottom,inlineDirection:t.LeftToRight},o),l=Object.values(t);if(!l.includes(a.blockDirection))throw new Error(`[postcss-logical] "blockDirection" must be one of ${l.join(", ")}`);if(!l.includes(a.inlineDirection))throw new Error(`[postcss-logical] "inlineDirection" must be one of ${l.join(", ")}`);const[s,c]=directionFlowToAxes(a.blockDirection),[d,f]=directionFlowToAxes(a.inlineDirection);if(!Object.values(i).every((r=>[s,c,d,f].includes(r))))throw new Error('[postcss-logical] "blockDirection" and "inlineDirection" must be on separate axes');const u={block:[s,c],inline:[d,f],inlineIsHorizontal:[t.LeftToRight,t.RightToLeft].includes(a.inlineDirection)},makeTransform=r=>(o,{result:n})=>{if(!r)return;let e=!1;try{e=r(o)}catch(r){return void o.warn(n,r.message)}e&&o.remove()};return{postcssPlugin:"postcss-logical",Declaration:{"caption-side":makeTransform((m=u,r=>doTransform(r,Object.values(e),m))),"text-align":makeTransform(u.inlineIsHorizontal?(b=u.inline,o=>{const{prop:e,value:t}=o,i=r(t),[a,l]=b;i.nodes.forEach((r=>{if("word"===r.type){const o=r.value.toLowerCase();if(o===n.End)return void(r.value=l);o===n.Start&&(r.value=a)}}));const s=i.toString();return s!==t&&(cloneDeclaration(o,s,e),!0)}):null),"block-size":makeTransform(transformLogicalSize(u)),"inline-size":makeTransform(transformLogicalSize(u)),"min-block-size":makeTransform(transformLogicalSize(u)),"max-block-size":makeTransform(transformLogicalSize(u)),"min-inline-size":makeTransform(transformLogicalSize(u)),"max-inline-size":makeTransform(transformLogicalSize(u)),"margin-block-start":makeTransform(transformSide("margin",s)),"margin-block-end":makeTransform(transformSide("margin",c)),"margin-inline-start":makeTransform(transformSide("margin",d)),"margin-inline-end":makeTransform(transformSide("margin",f)),"margin-block":makeTransform(transformSideShorthand("margin",u.block)),"margin-inline":makeTransform(transformSideShorthand("margin",u.inline)),"inset-block":makeTransform(transformOffsetShorthand(u.block)),"inset-block-start":makeTransform(transformOffset(s)),"inset-block-end":makeTransform(transformOffset(c)),"inset-inline":makeTransform(transformOffsetShorthand(u.inline)),"inset-inline-start":makeTransform(transformOffset(d)),"inset-inline-end":makeTransform(transformOffset(f)),inset:makeTransform((o=>{const n=r(o.value).nodes.filter((r=>"space"!==r.type&&"comment"!==r.type));if(n.length>4){const r=`[postcss-logical] Invalid number of values for ${o.prop}. Found ${n.length} values, expected up to 4 values.`;throw o.error(r)}const e={top:"",right:"",bottom:"",left:""};return 1===n.length&&(e.top=r.stringify(n[0]),e.right=e.top,e.bottom=e.top,e.left=e.top),2===n.length&&(e.top=r.stringify(n[0]),e.right=r.stringify(n[1]),e.bottom=e.top,e.left=e.right),3===n.length&&(e.top=r.stringify(n[0]),e.right=r.stringify(n[1]),e.left=e.right,e.bottom=r.stringify(n[2])),4===n.length&&(e.top=r.stringify(n[0]),e.right=r.stringify(n[1]),e.bottom=r.stringify(n[2]),e.left=r.stringify(n[3])),Object.keys(e).forEach((r=>{cloneDeclaration(o,e[r],r)})),!0})),"padding-block-start":makeTransform(transformSide("padding",s)),"padding-block-end":makeTransform(transformSide("padding",c)),"padding-inline-start":makeTransform(transformSide("padding",d)),"padding-inline-end":makeTransform(transformSide("padding",f)),"padding-block":makeTransform(transformSideShorthand("padding",u.block)),"padding-inline":makeTransform(transformSideShorthand("padding",u.inline)),"border-block-start-width":makeTransform(transformBorder("width",s)),"border-block-end-width":makeTransform(transformBorder("width",c)),"border-inline-start-width":makeTransform(transformBorder("width",d)),"border-inline-end-width":makeTransform(transformBorder("width",f)),"border-block-width":makeTransform(transformBorderProperty("width",u.block)),"border-inline-width":makeTransform(transformBorderProperty("width",u.inline)),"border-block-start-style":makeTransform(transformBorder("style",s)),"border-block-end-style":makeTransform(transformBorder("style",c)),"border-inline-start-style":makeTransform(transformBorder("style",d)),"border-inline-end-style":makeTransform(transformBorder("style",f)),"border-block-style":makeTransform(transformBorderProperty("style",u.block)),"border-inline-style":makeTransform(transformBorderProperty("style",u.inline)),"border-block-start-color":makeTransform(transformBorder("color",s)),"border-block-end-color":makeTransform(transformBorder("color",c)),"border-inline-start-color":makeTransform(transformBorder("color",d)),"border-inline-end-color":makeTransform(transformBorder("color",f)),"border-block-color":makeTransform(transformBorderProperty("color",u.block)),"border-inline-color":makeTransform(transformBorderProperty("color",u.inline)),"border-block":makeTransform(transformBorderShorthand(u.block)),"border-block-start":makeTransform(transformBorderShorthand([s])),"border-block-end":makeTransform(transformBorderShorthand([c])),"border-inline":makeTransform(transformBorderShorthand(u.inline)),"border-inline-start":makeTransform(transformBorderShorthand([d])),"border-inline-end":makeTransform(transformBorderShorthand([f])),"border-start-start-radius":makeTransform(transformBorderRadius(u)),"border-start-end-radius":makeTransform(transformBorderRadius(u)),"border-end-start-radius":makeTransform(transformBorderRadius(u)),"border-end-end-radius":makeTransform(transformBorderRadius(u))}};var b,m};creator.postcss=!0;export{creator as default};
