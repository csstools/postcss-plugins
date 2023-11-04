import o from"@csstools/postcss-progressive-custom-properties";import{WhitespaceNode as e,TokenNode as t,FunctionNode as r,isCommentNode as n,isWhitespaceNode as i,isTokenNode as s,stringify as l,replaceComponentValues as a,parseCommaSeparatedListOfComponentValues as c,isFunctionNode as u}from"@csstools/css-parser-algorithms";import{TokenType as p,tokenize as f}from"@csstools/css-tokenizer";import{serializeP3 as v,color as h,colorDataFitsRGB_Gamut as m,serializeRGB as d,SyntaxFlag as g}from"@csstools/css-color-parser";const w=/(repeating-)?(linear|radial|conic)-gradient\(.*?in/i,C=/^(repeating-)?(linear|radial|conic)-gradient$/i;function hasFallback(o){const e=o.parent;if(!e)return!1;const t=o.prop.toLowerCase(),r=e.index(o);for(let o=0;o<r;o++){const r=e.nodes[o];if("decl"===r.type&&r.prop.toLowerCase()===t)return!0}return!1}function hasSupportsAtRuleAncestor(o){let e=o.parent;for(;e;)if("atrule"===e.type){if("supports"===e.name&&w.test(e.params))return!0;e=e.parent}else e=e.parent;return!1}function interpolateColorsInColorStopsList(o,n,i,s=!1){const l=[],a=[];for(let s=0;s<o.length-1;s++){const l=o[s],c=o[s+1];if(a.push(l),i||v(l.colorData,!1).toString()!==v(c.colorData,!1).toString()&&l.position.toString()!==c.position.toString())for(let o=1;o<=9;o++){const s=10*o;let u=[];i&&(u=[new e([[p.Whitespace," ",-1,-1,void 0]]),i,new e([[p.Whitespace," ",-1,-1,void 0]]),new t([p.Ident,"hue",-1,-1,{value:"hue"}])]);const f=new r([p.Function,"color-mix(",-1,-1,{value:"color-mix"}],[p.CloseParen,")",-1,-1,void 0],[new t([p.Ident,"in",-1,-1,{value:"in"}]),new e([[p.Whitespace," ",-1,-1,void 0]]),n,...u,new t([p.Comma,",",-1,-1,void 0]),new e([[p.Whitespace," ",-1,-1,void 0]]),l.color,new e([[p.Whitespace," ",-1,-1,void 0]]),new t([p.Percentage,100-s+"%",-1,-1,{value:100-s}]),new t([p.Comma,",",-1,-1,void 0]),new e([[p.Whitespace," ",-1,-1,void 0]]),c.color,new e([[p.Whitespace," ",-1,-1,void 0]]),new t([p.Percentage,`${s}%`,-1,-1,{value:s}])]),v=h(f);if(!v)return!1;a.push({colorData:v})}s===o.length-2&&a.push(c)}for(let o=0;o<a.length;o++)s&&!m(a[o].colorData)?a[o].color=v(a[o].colorData,!1):a[o].color=d(a[o].colorData,!1);for(let o=0;o<a.length;o++){const r=a[o];r.position?l.push(r.color,new e([[p.Whitespace," ",-1,-1,void 0]]),r.position):l.push(r.color),o!==a.length-1&&l.push(new t([p.Comma,",",-1,-1,void 0]),new e([[p.Whitespace," ",-1,-1,void 0]]))}return l}function parseColorStops(o){const e=[];let t={};for(let r=0;r<o.length;r++){const l=o[r];if(n(l)||i(l))continue;if(s(l)&&l.value[0]===p.Comma){if(t.color&&t.colorData&&t.positionA){e.push({color:t.color,colorData:t.colorData,position:t.positionA}),t.positionB&&e.push({color:t.color,colorData:t.colorData,position:t.positionB}),t={};continue}return!1}const a=h(l);if(a){if(t.color)return!1;if(a.syntaxFlags.has(g.Experimental))return!1;t.color=l,t.colorData=a}else{if(!t.color)return!1;if(t.positionA){if(!t.positionA||t.positionB)return!1;t.positionB=l}else t.positionA=l}}return!(!t.color||!t.positionA)&&(t.color&&t.colorData&&t.positionA&&(e.push({color:t.color,colorData:t.colorData,position:t.positionA}),t.positionB&&e.push({color:t.color,colorData:t.colorData,position:t.positionB})),!(e.length<2)&&e)}const D=/^(srgb|srgb-linear|lab|oklab|xyz|xyz-d50|xyz-d65|hsl|hwb|lch|oklch)$/i,b=/^(hsl|hwb|lch|oklch)$/i,x=/^(shorter|longer|increasing|decreasing)$/i,A=/^in$/i,S=/^hue$/i;function modifyGradientFunctionComponentValues(o,r=!1){const l=o.getName();if(!C.test(l))return!1;let a="srgb",c=null,u=null,f=null,v=null,h=null,m=[];{let e=0,t=o.value[e];for(;t&&(!s(t)||t.value[0]!==p.Ident||!A.test(t.value[4].value));){if(s(t)&&t.value[0]===p.Comma)return!1;e++,t=o.value[e]}for(c=t,e++,t=o.value[e];n(t)||i(t);)e++,t=o.value[e];if(s(t)&&t.value[0]===p.Ident&&D.test(t.value[4].value)){if(u)return!1;u=t,a=t.value[4].value,e++,t=o.value[e]}for(;n(t)||i(t);)e++,t=o.value[e];if(s(t)&&t.value[0]===p.Ident&&x.test(t.value[4].value)&&b.test(a)){if(f||!u)return!1;f=t,e++,t=o.value[e]}for(;n(t)||i(t);)e++,t=o.value[e];if(s(t)&&t.value[0]===p.Ident&&S.test(t.value[4].value)){if(v||!u||!f)return!1;v=t,e++,t=o.value[e]}for(;t&&(!s(t)||t.value[0]!==p.Comma);)e++,t=o.value[e];if(h=t,!h)return!1;m=o.value.slice(e+1)}if(!u)return!1;if(f&&!v)return!1;if(v&&!f)return!1;const d=parseColorStops(m);if(!d)return!1;const g=interpolateColorsInColorStopsList(d,u,f,r);if(!g)return!1;const w=trim([...o.value.slice(0,o.value.indexOf(c)),...o.value.slice(o.value.indexOf(v||u)+1,o.value.indexOf(h))]);return w.length>0&&w.some((o=>!n(o)))&&w.push(new t([p.Comma,",",-1,-1,void 0]),new e([[p.Whitespace," ",-1,-1,void 0]])),trim([...w,...trim(g)])}function trim(o){let e=0,t=o.length-1;for(let t=0;t<o.length;t++)if(!i(o[t])){e=t;break}for(let e=o.length-1;e>=0;e--)if(!i(o[e])){t=e;break}return o.slice(e,t+1)}const basePlugin=o=>({postcssPlugin:"postcss-gradients-interpolation-method",Declaration(e){if(!w.test(e.value))return;if(hasFallback(e))return;if(hasSupportsAtRuleAncestor(e))return;const t=f({css:e.value}),r=l(a(c(t),(o=>{if(!u(o))return;const e=modifyGradientFunctionComponentValues(o);e&&(o.value=e)})));if(r===e.value)return;const n=l(a(c(t),(o=>{if(!u(o))return;const e=modifyGradientFunctionComponentValues(o,!0);e&&(o.value=e)})));e.cloneBefore({value:r}),r!==n&&e.cloneBefore({value:n}),null!=o&&o.preserve||e.remove()}});basePlugin.postcss=!0;const postcssPlugin=e=>{const t=Object.assign({enableProgressiveCustomProperties:!0,preserve:!0},e);return t.enableProgressiveCustomProperties?{postcssPlugin:"postcss-gradients-interpolation-method",plugins:[o(),basePlugin(t)]}:basePlugin(t)};postcssPlugin.postcss=!0;export{postcssPlugin as default};
