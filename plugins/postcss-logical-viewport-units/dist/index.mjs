import{hasFallback as t,hasSupportsAtRuleAncestor as o}from"@csstools/utilities";import{tokenizer as e,isTokenEOF as i,isTokenDimension as n,stringify as r}from"@csstools/css-tokenizer";var s;function transform(t,o){const s=e({css:t}),c=[];let u=!1;for(;;){const t=s.nextToken();if(!t)break;if(c.push(t),i(t))break;if(!n(t))continue;const e=t[4].unit.toLowerCase();let r;"vi"===e?r=o.vi:"vb"===e&&(r=o.vb),r&&(t[1]=t[4].value.toString()+r,t[4].unit=r,u=!0)}return u?r(...c):t}!function(t){t.TopToBottom="top-to-bottom",t.BottomToTop="bottom-to-top",t.RightToLeft="right-to-left",t.LeftToRight="left-to-right"}(s||(s={}));const c=/vb|vi/i,u={test(t){if(!c.test(t))return!1;const o=e({css:t});for(;;){const t=o.nextToken();if(i(t))break;if(!n(t))continue;const e=t[4].unit.toLowerCase();if("vb"===e||"vi"===e)return!0}return!1}},a=/(?:vi|vb)\b/i,creator=e=>{const i=Object.assign({inlineDirection:s.LeftToRight,preserve:!0},e);switch(i.inlineDirection){case s.LeftToRight:case s.RightToLeft:case s.TopToBottom:case s.BottomToTop:break;default:throw new Error(`[postcss-logical-viewport-units] "inlineDirection" must be one of ${Object.values(s).join(", ")}`)}const n=[s.LeftToRight,s.RightToLeft].includes(i.inlineDirection),r={vb:"vh",vi:"vw"};return n||(r.vb="vw",r.vi="vh"),{postcssPlugin:"postcss-logical-viewport-units",Declaration(e,{atRule:n}){if(!a.test(e.value))return;if(t(e))return;if(o(e,u))return;const s=transform(e.value,r);if(s===e.value)return;if(e.cloneBefore({value:s}),!i.preserve)return void e.remove();if(!e.variable)return;const c=n({name:"supports",params:"(top: 1vi)",source:e.source}),f=e.parent;if(!f)return;const v=f.cloneAfter({nodes:[]});v.append(e),c.append(v),f.after(c)}}};creator.postcss=!0;export{creator as default};
