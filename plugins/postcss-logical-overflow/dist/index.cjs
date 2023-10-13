"use strict";var o,t,e,n;function directionFlowToAxes(o){switch(o){case e.TopToBottom:return[n.Top,n.Bottom];case e.BottomToTop:return[n.Bottom,n.Top];case e.RightToLeft:return[n.Right,n.Left];case e.LeftToRight:return[n.Left,n.Right]}}function cloneDeclaration(o,t,e){return o.parent&&o.parent.some((o=>"decl"==o.type&&o.prop===e&&o.value===t))?[]:[o.clone({value:t,prop:e})]}function transformAxes(o){return t=>{const{value:e}=t,n=o.inlineIsHorizontal?"x":"y",i=o.inlineIsHorizontal?"y":"x",r=t.prop.toLowerCase().replace("inline",n).replace("block",i);return cloneDeclaration(t,e,r)}}!function(o){o.Block="block",o.Inline="inline"}(o||(o={})),function(o){o.Start="start",o.End="end"}(t||(t={})),function(o){o.TopToBottom="top-to-bottom",o.BottomToTop="bottom-to-top",o.RightToLeft="right-to-left",o.LeftToRight="left-to-right"}(e||(e={})),function(o){o.Top="top",o.Right="right",o.Bottom="bottom",o.Left="left"}(n||(n={}));const creator=o=>{const t=Object.assign({blockDirection:e.TopToBottom,inlineDirection:e.LeftToRight},o),i=Object.values(e);if(!i.includes(t.blockDirection))throw new Error(`[postcss-logical-overflow] "blockDirection" must be one of ${i.join(", ")}`);if(!i.includes(t.inlineDirection))throw new Error(`[postcss-logical-overflow] "inlineDirection" must be one of ${i.join(", ")}`);const[r,l]=directionFlowToAxes(t.blockDirection),[c,s]=directionFlowToAxes(t.inlineDirection);if(!Object.values(n).every((o=>[r,l,c,s].includes(o))))throw new Error('[postcss-logical-overflow] "blockDirection" and "inlineDirection" must be on separate axes');const a={block:[r,l],inline:[c,s],inlineIsHorizontal:[e.LeftToRight,e.RightToLeft].includes(t.inlineDirection)},makeTransform=o=>(t,{result:e})=>{var n;if(!o)return;let i=[];try{i=o(t)}catch(o){return void t.warn(e,o.message)}null!=(n=i)&&n.length&&(i.forEach((o=>{t.cloneBefore(o)})),t.remove())};return{postcssPlugin:"postcss-logical-overflow",Declaration:{"overflow-block":makeTransform(transformAxes(a)),"overflow-inline":makeTransform(transformAxes(a))}}};creator.postcss=!0,module.exports=creator;
