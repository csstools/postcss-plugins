"use strict";var e=require("@csstools/postcss-progressive-custom-properties"),o=require("@csstools/utilities"),r=require("@csstools/css-tokenizer"),s=require("@csstools/css-parser-algorithms"),t=require("@csstools/css-color-parser"),n=require("@csstools/color-helpers");const a=/^contrast-color$/i;function parseContrastColor(e){if(!s.isFunctionNode(e)||!a.test(e.getName()))return!1;const o=e.value.filter((e=>!s.isWhitespaceNode(e)&&!s.isCommentNode(e)));if(o.length>2)return!1;const t=o[0],n=o[1];return!!t&&(n?!(!s.isTokenNode(n)||n.value[0]!==r.TokenType.Ident||"max"!==n.value[4].value.toLowerCase())&&[t,"max"]:[t])}var c;function transformContrastColor(e,o){const a=s.replaceComponentValues(s.parseCommaSeparatedListOfComponentValues(r.tokenize({css:e})),(e=>{const a=parseContrastColor(e);if(!a)return;const[l,i]=a;if("max"===i){const o=t.color(e);if(!o)return;return t.serializeRGB(o,!0)}if(i)return;const u=t.color(new s.FunctionNode([r.TokenType.Function,"contrast-color(",-1,-1,{value:"contrast-color"}],[r.TokenType.CloseParen,")",-1,-1,void 0],[l,new s.TokenNode([r.TokenType.Ident,"max",-1,-1,{value:"max"}])]));if(!u)return;if(o===c.MORE)return t.serializeRGB(u,!0);const p=t.color(l);if(!p)return;let f=0;const m=t.color(t.serializeRGB(p,!0));if(!m)return;{const e=n.contrast_ratio_wcag_2_1(m.channels,[0,0,0]),r=n.contrast_ratio_wcag_2_1(m.channels,[1,1,1]);f=o===c.LESS?e>=r?.3:.9:e>=r?.2:.95}const v=t.color(new s.FunctionNode([r.TokenType.Function,"oklch(",-1,-1,{value:"oklch"}],[r.TokenType.CloseParen,")",-1,-1,void 0],[new s.TokenNode([r.TokenType.Ident,"from",-1,-1,{value:"from"}]),l,new s.TokenNode([r.TokenType.Number,f.toString(),-1,-1,{value:f,type:r.NumberType.Number}]),new s.TokenNode([r.TokenType.Ident,"c",-1,-1,{value:"c"}]),new s.TokenNode([r.TokenType.Ident,"h",-1,-1,{value:"h"}])]));if(!v)return;const d=t.color(t.serializeRGB(v,!0));if(!d)return;return n.contrast_ratio_wcag_2_1(m.channels,d.channels)<4.5?t.serializeRGB(u,!0):t.serializeP3(v,!0)}));return s.stringify(a)}!function(e){e[e.MORE=0]="MORE",e[e.LESS=1]="LESS",e[e.NO_PREFERENCE=2]="NO_PREFERENCE"}(c||(c={}));const l=/\bcontrast-color\(/i,basePlugin=e=>({postcssPlugin:"postcss-contrast-color-function",prepare:()=>({postcssPlugin:"postcss-contrast-color-function",Declaration(r,{atRule:s}){const t=r.parent;if(!t)return;if(!l.test(r.value))return;if(o.hasFallback(r))return;if(o.hasSupportsAtRuleAncestor(r,l))return;const n=transformContrastColor(r.value,c.NO_PREFERENCE);if(n===r.value)return;const a=transformContrastColor(r.value,c.LESS);if(a===r.value)return;const i=transformContrastColor(r.value,c.MORE);if(i!==r.value){if(r.cloneBefore({value:n}),n!==a){const o=t.clone();o.removeAll(),o.append(r.clone({value:a}));const n=s({name:"media",params:"(prefers-contrast: less)",source:t.source});if(n.append(o),e?.preserve){const e=s({name:"supports",params:"not (color: contrast-color(red max))",source:t.source});e.append(n),t.after(e)}else t.after(n)}if(n!==i){const o=t.clone();o.removeAll(),o.append(r.clone({value:i}));const n=s({name:"media",params:"(prefers-contrast: more)",source:t.source});if(n.append(o),e?.preserve){const e=s({name:"supports",params:"not (color: contrast-color(red max))",source:t.source});e.append(n),t.after(e)}else t.after(n)}e?.preserve||r.remove()}}})});basePlugin.postcss=!0;const postcssPlugin=o=>{const r=Object.assign({enableProgressiveCustomProperties:!0,preserve:!0},o);return r.enableProgressiveCustomProperties&&r.preserve?{postcssPlugin:"postcss-contrast-color-function",plugins:[e(),basePlugin(r)]}:basePlugin(r)};postcssPlugin.postcss=!0,module.exports=postcssPlugin;
