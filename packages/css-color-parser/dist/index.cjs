"use strict";var e,o,n=require("@csstools/css-parser-algorithms"),a=require("@csstools/css-tokenizer"),t=require("@csstools/color-helpers"),r=require("@csstools/css-calc");function colorData_to_XYZ_D50(e){switch(e.colorNotation){case exports.ColorNotation.HEX:case exports.ColorNotation.RGB:return{...e,colorNotation:exports.ColorNotation.XYZ_D50,channels:t.xyz.sRGB_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case exports.ColorNotation.HSL:return{...e,colorNotation:exports.ColorNotation.XYZ_D50,channels:t.xyz.HSL_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case exports.ColorNotation.HWB:return{...e,colorNotation:exports.ColorNotation.XYZ_D50,channels:t.xyz.HWB_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case exports.ColorNotation.Lab:return{...e,colorNotation:exports.ColorNotation.XYZ_D50,channels:t.xyz.Lab_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case exports.ColorNotation.OKLab:return{...e,colorNotation:exports.ColorNotation.XYZ_D50,channels:t.xyz.OKLab_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};default:throw new Error("Unsupported color notation")}}function colorDataTo(e,o){const n=colorData_to_XYZ_D50(e);switch(o){case exports.ColorNotation.HSL:{const o={...e,colorNotation:exports.ColorNotation.HSL,channels:t.xyz.XYZ_D50_to_HSL(n.channels)};switch(e.colorNotation){case exports.ColorNotation.HSL:carryForwardMissingComponents(e.channels,[0,1,2],o.channels,[0,1,2]);break;case exports.ColorNotation.HWB:carryForwardMissingComponents(e.channels,[0],o.channels,[0]);break;case exports.ColorNotation.Lab:case exports.ColorNotation.OKLab:carryForwardMissingComponents(e.channels,[2],o.channels,[0])}return o}case exports.ColorNotation.HWB:{const o={...e,colorNotation:exports.ColorNotation.HWB,channels:t.xyz.XYZ_D50_to_HWB(n.channels)};switch(e.colorNotation){case exports.ColorNotation.HSL:carryForwardMissingComponents(e.channels,[0],o.channels,[0]);break;case exports.ColorNotation.HWB:carryForwardMissingComponents(e.channels,[0,1,2],o.channels,[0,1,2])}return o}default:throw new Error("Unsupported color notation")}}function carryForwardMissingComponents(e,o,n,a){const t=[...n];for(const n of o)Number.isNaN(e[o[n]])&&(t[a[n]]=NaN);return t}function fillInMissingComponents(e,o){const n=[...e];for(let a=0;a<e.length;a++)Number.isNaN(e[a])&&(n[a]=o[a]);return n}exports.ColorNotation=void 0,(e=exports.ColorNotation||(exports.ColorNotation={})).HEX="hex",e.HSL="hsl",e.HWB="hwb",e.Lab="lab",e.OKLab="oklab",e.RGB="rgb",e.XYZ_D50="xyz-d50",exports.SyntaxFlag=void 0,(o=exports.SyntaxFlag||(exports.SyntaxFlag={})).ColorKeyword="color-keyword",o.HasAlpha="has-alpha",o.HasDimensionValues="has-dimension-values",o.HasNoneKeywords="has-none-keywords",o.HasNumberValues="has-number-values",o.HasPercentageAlpha="has-percentage-alpha",o.HasPercentageValues="has-percentage-values",o.HasVariableAlpha="has-variable-alpha",o.Hex="hex",o.LegacyHSL="legacy-hsl",o.LegacyRGB="legacy-rgb",o.NamedColor="named-color",o.RelativeColorSyntax="relative-color-syntax",o.ColorMix="color-mix";const l=/[A-Z]/g;function toLowerCaseAZ(e){return e.replace(l,(e=>String.fromCharCode(e.charCodeAt(0)+32)))}function hex(e){const o=toLowerCaseAZ(e[4].value);if(o.match(/[^a-f0-9]/))return!1;const n={colorNotation:exports.ColorNotation.HEX,channels:[0,0,0],alpha:1,syntaxFlags:new Set([exports.SyntaxFlag.Hex])},a=o.length;if(3===a){const e=o[0],a=o[1],t=o[2];return n.channels=[parseInt(e+e,16)/255,parseInt(a+a,16)/255,parseInt(t+t,16)/255],n}if(6===a){const e=o[0]+o[1],a=o[2]+o[3],t=o[4]+o[5];return n.channels=[parseInt(e,16)/255,parseInt(a,16)/255,parseInt(t,16)/255],n}if(4===a){const e=o[0],a=o[1],t=o[2],r=o[3];return n.channels=[parseInt(e+e,16)/255,parseInt(a+a,16)/255,parseInt(t+t,16)/255],n.alpha=parseInt(r+r,16)/255,n.syntaxFlags.add(exports.SyntaxFlag.HasAlpha),n}if(8===a){const e=o[0]+o[1],a=o[2]+o[3],t=o[4]+o[5],r=o[6]+o[7];return n.channels=[parseInt(e,16)/255,parseInt(a,16)/255,parseInt(t,16)/255],n.alpha=parseInt(r,16)/255,n.syntaxFlags.add(exports.SyntaxFlag.HasAlpha),n}return!1}function normalizeHue(e){if(e[0]===a.TokenType.Number)return e[4].value=e[4].value%360,e[1]=e[4].value.toString(),e;if(e[0]===a.TokenType.Dimension){let o=e[4].value;switch(toLowerCaseAZ(e[4].unit)){case"deg":break;case"rad":o=180*e[4].value/Math.PI;break;case"grad":o=.9*e[4].value;break;case"turn":o=360*e[4].value;break;default:return!1}return o%=360,[a.TokenType.Number,o.toString(),e[2],e[3],{value:o,type:a.NumberType.Number}]}return!1}function normalize(e,o,n,a){return Math.min(Math.max(e/o,n),a)}function normalize_legacy_HSL_ChannelValues(e,o){const n=[];for(let t=0;t<e.length;t++){const r=e[t];if(0!==t)if(r[0]!==a.TokenType.Percentage){if(r[0]!==a.TokenType.Number)return!1;{3!==t&&o.syntaxFlags.add(exports.SyntaxFlag.HasNumberValues);let e=normalize(r[4].value,1,0,100);3===t&&(e=normalize(r[4].value,1,0,1)),n.push([a.TokenType.Number,e.toString(),r[2],r[3],{value:e,type:a.NumberType.Number}])}}else{3===t?o.syntaxFlags.add(exports.SyntaxFlag.HasPercentageAlpha):o.syntaxFlags.add(exports.SyntaxFlag.HasPercentageValues);let e=normalize(r[4].value,1,0,100);3===t&&(e=normalize(r[4].value,100,0,1)),n.push([a.TokenType.Number,e.toString(),r[2],r[3],{value:e,type:a.NumberType.Number}])}else{const e=normalizeHue(r);if(!1===e)return!1;r[0]===a.TokenType.Dimension&&o.syntaxFlags.add(exports.SyntaxFlag.HasDimensionValues),n.push(e)}}return!o.syntaxFlags.has(exports.SyntaxFlag.HasNumberValues)&&n}function normalize_modern_HSL_ChannelValues(e,o){const n=[];for(let t=0;t<e.length;t++){const r=e[t];if(r[0]!==a.TokenType.Ident||"none"!==toLowerCaseAZ(r[4].value))if(0!==t)if(r[0]!==a.TokenType.Percentage){if(r[0]!==a.TokenType.Number)return!1;{3!==t&&o.syntaxFlags.add(exports.SyntaxFlag.HasNumberValues);let e=normalize(r[4].value,1,0,100);3===t&&(e=normalize(r[4].value,1,0,1)),n.push([a.TokenType.Number,e.toString(),r[2],r[3],{value:e,type:a.NumberType.Number}])}}else{3===t?o.syntaxFlags.add(exports.SyntaxFlag.HasPercentageAlpha):o.syntaxFlags.add(exports.SyntaxFlag.HasPercentageValues);let e=normalize(r[4].value,1,0,100);3===t&&(e=normalize(r[4].value,100,0,1)),n.push([a.TokenType.Number,e.toString(),r[2],r[3],{value:e,type:a.NumberType.Number}])}else{const e=normalizeHue(r);if(!1===e)return!1;r[0]===a.TokenType.Dimension&&o.syntaxFlags.add(exports.SyntaxFlag.HasDimensionValues),n.push(e)}else o.syntaxFlags.add(exports.SyntaxFlag.HasNoneKeywords),n.push([a.TokenType.Number,"none",r[2],r[3],{value:NaN,type:a.NumberType.Number}])}return n}function threeChannelLegacySyntax(e,o,t,l){const s=[],i=[],u=[],c=[],p={colorNotation:t,channels:[0,0,0],alpha:1,syntaxFlags:new Set(l)};let N=s;for(let o=0;o<e.value.length;o++){let t=e.value[o];if(!n.isWhitespaceNode(t)&&!n.isCommentNode(t)){if(n.isTokenNode(t)&&t.value[0]===a.TokenType.Comma){if(N===s){N=i;continue}if(N===i){N=u;continue}if(N===u){N=c;continue}if(N===c)return!1}if(n.isFunctionNode(t)){if(N===c&&"var"===toLowerCaseAZ(t.getName())){p.syntaxFlags.add(exports.SyntaxFlag.HasVariableAlpha),N.push(t);continue}if("calc"!==toLowerCaseAZ(t.getName()))return!1;const[[e]]=r.calcFromComponentValues([[t]],{toCanonicalUnits:!0,precision:100});if(!e||!n.isTokenNode(e))return!1;t=e}if(!n.isTokenNode(t))return!1;N.push(t)}}if(1!==N.length)return!1;if(1!==s.length||1!==i.length||1!==u.length)return!1;if(!n.isTokenNode(s[0])||!n.isTokenNode(i[0])||!n.isTokenNode(u[0]))return!1;const m=[s[0].value,i[0].value,u[0].value];1===c.length&&(p.syntaxFlags.add(exports.SyntaxFlag.HasAlpha),n.isTokenNode(c[0])?m.push(c[0].value):p.alpha=c[0]);const y=o(m,p);return!1!==y&&(p.channels=[y[0][4].value,y[1][4].value,y[2][4].value],4===y.length&&(p.alpha=y[3][4].value),p)}function threeChannelSpaceSeparated(e,o,t,l){const s=[],i=[],u=[],c=[],p={colorNotation:t,channels:[0,0,0],alpha:1,syntaxFlags:new Set(l)};let N=s;for(let o=0;o<e.value.length;o++){let t=e.value[o];if(n.isWhitespaceNode(t)||n.isCommentNode(t)){for(;n.isWhitespaceNode(e.value[o+1])||n.isCommentNode(e.value[o+1]);)o++;if(!s.length)continue;if(N===s){N=i;continue}if(N===i){N=u;continue}}else if(n.isTokenNode(t)&&t.value[0]===a.TokenType.Delim&&"/"===t.value[4].value){if(N===c)return!1;N=c}else{if(n.isFunctionNode(t)){if(N===c&&"var"===toLowerCaseAZ(t.getName())){p.syntaxFlags.add(exports.SyntaxFlag.HasVariableAlpha),N.push(t);continue}if("calc"!==toLowerCaseAZ(t.getName()))return!1;const[[e]]=r.calcFromComponentValues([[t]],{toCanonicalUnits:!0,precision:100});if(!e||!n.isTokenNode(e))return!1;t=e}if(!n.isTokenNode(t))return!1;N.push(t)}}if(1!==N.length)return!1;if(1!==s.length||1!==i.length||1!==u.length)return!1;if(!n.isTokenNode(s[0])||!n.isTokenNode(i[0])||!n.isTokenNode(u[0]))return!1;const m=[s[0].value,i[0].value,u[0].value];1===c.length&&(p.syntaxFlags.add(exports.SyntaxFlag.HasAlpha),n.isTokenNode(c[0])?m.push(c[0].value):p.alpha=c[0]);const y=o(m,p);return!1!==y&&(p.channels=[y[0][4].value,y[1][4].value,y[2][4].value],4===y.length&&(p.alpha=y[3][4].value),p)}function hsl(e,o){{const o=hslCommaSeparated(e);if(!1!==o)return o}{const o=hslSpaceSeparated(e);if(!1!==o)return o}return!1}function hslCommaSeparated(e){return threeChannelLegacySyntax(e,normalize_legacy_HSL_ChannelValues,exports.ColorNotation.HSL,[exports.SyntaxFlag.LegacyHSL])}function hslSpaceSeparated(e){return threeChannelSpaceSeparated(e,normalize_modern_HSL_ChannelValues,exports.ColorNotation.HSL,[])}function normalize_HWB_ChannelValues(e,o){const n=[];for(let t=0;t<e.length;t++){const r=e[t];if(r[0]!==a.TokenType.Ident||"none"!==toLowerCaseAZ(r[4].value))if(0!==t)if(r[0]!==a.TokenType.Percentage){if(r[0]!==a.TokenType.Number)return!1;{if(3!==t)return!1;const e=normalize(r[4].value,1,0,1);n.push([a.TokenType.Number,e.toString(),r[2],r[3],{value:e,type:a.NumberType.Number}])}}else{3===t?o.syntaxFlags.add(exports.SyntaxFlag.HasPercentageAlpha):o.syntaxFlags.add(exports.SyntaxFlag.HasPercentageValues);let e=normalize(r[4].value,1,0,100);3===t&&(e=normalize(r[4].value,100,0,1)),n.push([a.TokenType.Number,e.toString(),r[2],r[3],{value:e,type:a.NumberType.Number}])}else{const e=normalizeHue(r);if(!1===e)return!1;r[0]===a.TokenType.Dimension&&o.syntaxFlags.add(exports.SyntaxFlag.HasDimensionValues),n.push(e)}else o.syntaxFlags.add(exports.SyntaxFlag.HasNoneKeywords),n.push([a.TokenType.Number,"none",r[2],r[3],{value:NaN,type:a.NumberType.Number}])}return n}const s=new Map;for(const[e,o]of Object.entries(t.namedColors))s.set(e,o);function namedColor(e){const o=s.get(toLowerCaseAZ(e));return!!o&&{colorNotation:exports.ColorNotation.RGB,channels:[o[0]/255,o[1]/255,o[2]/255],alpha:1,syntaxFlags:new Set([exports.SyntaxFlag.ColorKeyword,exports.SyntaxFlag.NamedColor])}}function normalize_legacy_sRGB_ChannelValues(e,o){const n=[];for(let t=0;t<e.length;t++){const r=e[t];if(r[0]!==a.TokenType.Percentage){if(r[0]!==a.TokenType.Number)return!1;{3!==t&&o.syntaxFlags.add(exports.SyntaxFlag.HasNumberValues);let e=normalize(r[4].value,255,0,1);3===t&&(e=normalize(r[4].value,1,0,1)),n.push([a.TokenType.Number,e.toString(),r[2],r[3],{value:e,type:a.NumberType.Number}])}}else{3===t?o.syntaxFlags.add(exports.SyntaxFlag.HasPercentageAlpha):o.syntaxFlags.add(exports.SyntaxFlag.HasPercentageValues);const e=normalize(r[4].value,100,0,1);n.push([a.TokenType.Number,e.toString(),r[2],r[3],{value:e,type:a.NumberType.Number}])}}return(!o.syntaxFlags.has(exports.SyntaxFlag.HasNumberValues)||!o.syntaxFlags.has(exports.SyntaxFlag.HasPercentageValues))&&n}function normalize_modern_sRGB_ChannelValues(e,o){const n=[];for(let t=0;t<e.length;t++){const r=e[t];if(r[0]!==a.TokenType.Ident||"none"!==toLowerCaseAZ(r[4].value))if(r[0]!==a.TokenType.Percentage){if(r[0]!==a.TokenType.Number)return!1;{3!==t&&o.syntaxFlags.add(exports.SyntaxFlag.HasNumberValues);let e=normalize(r[4].value,255,0,1);3===t&&(e=normalize(r[4].value,1,0,1)),n.push([a.TokenType.Number,e.toString(),r[2],r[3],{value:e,type:a.NumberType.Number}])}}else{3!==t&&o.syntaxFlags.add(exports.SyntaxFlag.HasPercentageValues);const e=normalize(r[4].value,100,0,1);n.push([a.TokenType.Number,e.toString(),r[2],r[3],{value:e,type:a.NumberType.Number}])}else o.syntaxFlags.add(exports.SyntaxFlag.HasNoneKeywords),n.push([a.TokenType.Number,"none",r[2],r[3],{value:NaN,type:a.NumberType.Number}])}return n}function rgb(e,o){{const o=rgbCommaSeparated(e);if(!1!==o)return o}{const o=rgbSpaceSeparated(e);if(!1!==o)return o}return!1}function rgbCommaSeparated(e){return threeChannelLegacySyntax(e,normalize_legacy_sRGB_ChannelValues,exports.ColorNotation.RGB,[exports.SyntaxFlag.LegacyRGB])}function rgbSpaceSeparated(e){return threeChannelSpaceSeparated(e,normalize_modern_sRGB_ChannelValues,exports.ColorNotation.RGB,[])}function normalize_Lab_ChannelValues(e,o){const n=[];for(let t=0;t<e.length;t++){const r=e[t];if(r[0]!==a.TokenType.Ident||"none"!==toLowerCaseAZ(r[4].value))if(r[0]!==a.TokenType.Percentage){if(r[0]!==a.TokenType.Number)return!1;{3!==t&&o.syntaxFlags.add(exports.SyntaxFlag.HasNumberValues);let e=normalize(r[4].value,1,0,100);1===t||2===t?e=normalize(r[4].value,1,-1/0,1/0):3===t&&(e=normalize(r[4].value,1,0,1)),n.push([a.TokenType.Number,e.toString(),r[2],r[3],{value:r[4].value,type:a.NumberType.Number}])}}else{3!==t&&o.syntaxFlags.add(exports.SyntaxFlag.HasPercentageValues);let e=normalize(r[4].value,1,0,100);1===t||2===t?e=normalize(r[4].value,.8,-1/0,1/0):3===t&&(e=normalize(r[4].value,100,0,1)),n.push([a.TokenType.Number,e.toString(),r[2],r[3],{value:e,type:a.NumberType.Number}])}else o.syntaxFlags.add(exports.SyntaxFlag.HasNoneKeywords),n.push([a.TokenType.Number,"none",r[2],r[3],{value:NaN,type:a.NumberType.Number}])}return n}const i=new Set(["srgb","srgb-linear","lab","oklab","xyz","xyz-d50","xyz-d65"]),u=new Set(["hsl","hwb","lch","oklch"]),c=new Set(["shorter","longer","increasing","decreasing"]);function colorMix(e,o){let t=null,r=null,l=null,s=!1;for(let p=0;p<e.value.length;p++){const N=e.value[p];if(!n.isWhitespaceNode(N)&&!n.isCommentNode(N)){if(n.isTokenNode(N)&&N.value[0]===a.TokenType.Ident){if(!t&&"in"===toLowerCaseAZ(N.value[4].value)){t=N;continue}if(t&&!r){r=toLowerCaseAZ(N.value[4].value);continue}if(t&&r&&!l&&u.has(r)){l=toLowerCaseAZ(N.value[4].value);continue}if(t&&r&&l&&!s&&"hue"===toLowerCaseAZ(N.value[4].value)){s=!0;continue}return!1}return!(!n.isTokenNode(N)||N.value[0]!==a.TokenType.Comma)&&(!!r&&(l||s?!!(r&&l&&s&&u.has(r)&&c.has(l))&&colorMixPolar(r,l,colorMixComponents(e.value.slice(p+1),o)):i.has(r)?colorMixRectangular(r,colorMixComponents(e.value.slice(p+1),o)):!!u.has(r)&&colorMixPolar(r,"shorter",colorMixComponents(e.value.slice(p+1),o))))}}return!1}function colorMixComponents(e,o){const t=[];let l=1,s=!1,i=!1;for(let l=0;l<e.length;l++){let u=e[l];if(!n.isWhitespaceNode(u)&&!n.isCommentNode(u))if(n.isTokenNode(u)&&u.value[0]===a.TokenType.Comma){if(!s)return!1;t.push({color:s,percentage:i}),s=!1,i=!1}else{if(!s){const e=o(u);if(e){s=e;continue}}if(i||(n.isFunctionNode(u)&&"calc"===toLowerCaseAZ(u.getName())&&([[u]]=r.calcFromComponentValues([[u]],{toCanonicalUnits:!0,precision:100})),!(n.isTokenNode(u)&&u.value[0]===a.TokenType.Percentage&&u.value[4].value>=0)))return!1;i=u.value[4].value}}if(s&&t.push({color:s,percentage:i}),2!==t.length)return!1;let u=t[0].percentage,c=t[1].percentage;return!1===u&&!1===c?(u=50,c=50):!1!==u&&!1===c?c=100-u:!1===u&&!1!==c&&(u=100-c),(0!==u||0!==c)&&(!1!==u&&!1!==c&&(u+c>100&&(u=u/(u+c)*100,c=c/(u+c)*100),u+c<100&&(l=(u+c)/100,u=u/(u+c)*100,c=c/(u+c)*100),{a:{color:t[0].color,percentage:u},b:{color:t[1].color,percentage:c},alphaMultiplier:l}))}function colorMixRectangular(e,o){return!1}function colorMixPolar(e,o,n){if(!n)return!1;const a=n.a.color,t=n.b.color,r=n.a.percentage/100;let l=a.channels,s=t.channels,i=0,u=0,c=0,p=0,N=0,m=0,y=a.alpha;if("number"!=typeof y)return!1;let h=t.alpha;if("number"!=typeof h)return!1;switch(y=Number.isNaN(y)?h:y,h=Number.isNaN(h)?y:h,e){case"hsl":a.colorNotation!==exports.ColorNotation.HSL&&(l=colorDataTo(a,exports.ColorNotation.HSL).channels),t.colorNotation!==exports.ColorNotation.HSL&&(s=colorDataTo(t,exports.ColorNotation.HSL).channels),l=fillInMissingComponents(l,s),s=fillInMissingComponents(s,l),i=l[0],u=s[0],c=l[1],p=s[1],N=l[2],m=s[2];break;case"hwb":a.colorNotation!==exports.ColorNotation.HWB&&(l=colorDataTo(a,exports.ColorNotation.HWB).channels),t.colorNotation!==exports.ColorNotation.HWB&&(s=colorDataTo(t,exports.ColorNotation.HWB).channels),l=fillInMissingComponents(l,s),s=fillInMissingComponents(s,l),i=l[0],u=s[0],c=l[1],p=s[1],N=l[2],m=s[2]}const g=u-i;switch(o){case"shorter":g>180?i+=360:g<-180&&(u+=360);break;case"longer":-180<g&&g<180&&(g>0?i+=360:u+=360);break;case"increasing":g<0&&(u+=360);break;case"decreasing":g>0&&(i+=360);break;default:throw new Error("Unknown hue interpolation method")}c=premultiply(c,y),N=premultiply(N,y),p=premultiply(p,h),m=premultiply(m,h);let x=exports.ColorNotation.RGB,T=[0,0,0],d=1;switch(e){case"hsl":{d=interpolate(y,h,r);const e=interpolate(i,u,r);let o=interpolate(c,p,r),n=interpolate(N,m,r);o=un_premultiply(o,d),n=un_premultiply(n,d),T=[e,o,n],x=exports.ColorNotation.HSL;break}case"hwb":{d=interpolate(y,h,r);const e=interpolate(i,u,r);let o=interpolate(c,p,r),n=interpolate(N,m,r);o=un_premultiply(o,d),n=un_premultiply(n,d),T=[e,o,n],x=exports.ColorNotation.HWB;break}}return{colorNotation:x,channels:T,alpha:d*n.alphaMultiplier,syntaxFlags:new Set([exports.SyntaxFlag.ColorMix])}}function interpolate(e,o,n){return Number.isNaN(e)?o:Number.isNaN(o)?e:e*n+o*(1-n)}function premultiply(e,o){return Number.isNaN(o)?e:Number.isNaN(e)?NaN:e*o}function un_premultiply(e,o){return 0===o||Number.isNaN(o)?e:Number.isNaN(e)?NaN:e/o}function normalize_OKLab_ChannelValues(e,o){const n=[];for(let t=0;t<e.length;t++){const r=e[t];if(r[0]!==a.TokenType.Ident||"none"!==toLowerCaseAZ(r[4].value))if(r[0]!==a.TokenType.Percentage){if(r[0]!==a.TokenType.Number)return!1;{3!==t&&o.syntaxFlags.add(exports.SyntaxFlag.HasNumberValues);let e=normalize(r[4].value,1,0,1);1===t||2===t?e=normalize(r[4].value,1,-1/0,1/0):3===t&&(e=normalize(r[4].value,1,0,1)),n.push([a.TokenType.Number,e.toString(),r[2],r[3],{value:r[4].value,type:a.NumberType.Number}])}}else{3!==t&&o.syntaxFlags.add(exports.SyntaxFlag.HasPercentageValues);let e=normalize(r[4].value,100,0,1);1===t||2===t?e=normalize(r[4].value,250,-1/0,1/0):3===t&&(e=normalize(r[4].value,100,0,1)),n.push([a.TokenType.Number,e.toString(),r[2],r[3],{value:e,type:a.NumberType.Number}])}else o.syntaxFlags.add(exports.SyntaxFlag.HasNoneKeywords),n.push([a.TokenType.Number,"none",r[2],r[3],{value:NaN,type:a.NumberType.Number}])}return n}function toPrecision(e,o=7){e=+e,o=+o;const n=(Math.floor(e)+"").length;if(o>n)return+e.toFixed(o-n);{const a=10**(n-o);return Math.round(e/a)*a}}function XYZ_D50_to_sRGB_Gamut(e){const o=t.xyz.XYZ_D50_to_sRGB(e);if(t.utils.inGamut(o))return t.utils.clip(o);let n=e.slice();return n=t.conversions.D50_to_D65(n),n=t.conversions.XYZ_to_OKLab(n),n=t.conversions.OKLab_to_OKLCH(n),n[0]<1e-6&&(n=[0,0,0]),n[0]>.999999&&(n=[1,0,0]),t.calculations.mapGamut(n,(e=>(e=t.conversions.OKLCH_to_OKLab(e),e=t.conversions.OKLab_to_XYZ(e),e=t.conversions.XYZ_to_lin_sRGB(e),t.conversions.gam_sRGB(e))),(e=>(e=t.conversions.lin_sRGB(e),e=t.conversions.lin_sRGB_to_XYZ(e),e=t.conversions.XYZ_to_OKLab(e),t.conversions.OKLab_to_OKLCH(e))))}function XYZ_D50_to_P3_Gamut(e){const o=t.xyz.XYZ_D50_to_P3(e);if(t.utils.inGamut(o))return t.utils.clip(o);let n=e.slice();return n=t.conversions.D50_to_D65(n),n=t.conversions.XYZ_to_OKLab(n),n=t.conversions.OKLab_to_OKLCH(n),n[0]<1e-6&&(n=[0,0,0]),n[0]>.999999&&(n=[1,0,0]),t.calculations.mapGamut(n,(e=>(e=t.conversions.OKLCH_to_OKLab(e),e=t.conversions.OKLab_to_XYZ(e),e=t.conversions.XYZ_to_lin_P3(e),t.conversions.gam_P3(e))),(e=>(e=t.conversions.lin_P3(e),e=t.conversions.lin_P3_to_XYZ(e),e=t.conversions.XYZ_to_OKLab(e),t.conversions.OKLab_to_OKLCH(e))))}exports.color=function color(e){if(n.isFunctionNode(e)){switch(toLowerCaseAZ(e.getName())){case"rgb":case"rgba":return rgb(e);case"hsl":case"hsla":return hsl(e);case"hwb":return threeChannelSpaceSeparated(e,normalize_HWB_ChannelValues,exports.ColorNotation.HWB,[]);case"lab":return threeChannelSpaceSeparated(e,normalize_Lab_ChannelValues,exports.ColorNotation.Lab,[]);case"oklab":return threeChannelSpaceSeparated(e,normalize_OKLab_ChannelValues,exports.ColorNotation.OKLab,[]);case"color-mix":return colorMix(e,color);default:return!1}}if(n.isTokenNode(e)){if(e.value[0]===a.TokenType.Hash)return hex(e.value);if(e.value[0]===a.TokenType.Ident){const o=namedColor(e.value[4].value);if(!1!==o)return o;const n="transparent"===toLowerCaseAZ(e.value[4].value)&&{colorNotation:exports.ColorNotation.RGB,channels:[0,0,0],alpha:0,syntaxFlags:new Set([exports.SyntaxFlag.ColorKeyword])};return!1!==n&&n}return!1}return!1},exports.serializeP3=function serializeP3(e){let o=e.channels.map((e=>Number.isNaN(e)?0:e));e.colorNotation!==exports.ColorNotation.RGB&&e.colorNotation!==exports.ColorNotation.HEX&&(o=XYZ_D50_to_P3_Gamut(colorData_to_XYZ_D50(e).channels));const t=toPrecision(o[0],6),r=toPrecision(o[1],6),l=toPrecision(o[2],6),s=[a.TokenType.Function,"color(",-1,-1,{value:"color"}],i=[a.TokenType.CloseParen,")",-1,-1,void 0],u=[a.TokenType.Whitespace," ",-1,-1,void 0],c=[new n.TokenNode([a.TokenType.Ident,"display-p3",-1,-1,{value:"display-p3"}]),new n.TokenNode(u),new n.TokenNode([a.TokenType.Number,t.toString(),-1,-1,{value:o[0],type:a.NumberType.Number}]),new n.TokenNode(u),new n.TokenNode([a.TokenType.Number,r.toString(),-1,-1,{value:o[1],type:a.NumberType.Number}]),new n.TokenNode(u),new n.TokenNode([a.TokenType.Number,l.toString(),-1,-1,{value:o[2],type:a.NumberType.Number}])];if("number"==typeof e.alpha){const o=Math.min(1,Math.max(0,toPrecision(Number.isNaN(e.alpha)?0:e.alpha)));return 1===o?new n.FunctionNode(s,i,c):new n.FunctionNode(s,i,[...c,new n.TokenNode(u),new n.TokenNode([a.TokenType.Delim,"/",-1,-1,{value:"/"}]),new n.TokenNode(u),new n.TokenNode([a.TokenType.Number,o.toString(),-1,-1,{value:e.alpha,type:a.NumberType.Integer}])])}return new n.FunctionNode(s,i,[...c,new n.TokenNode([a.TokenType.Delim,"/",-1,-1,{value:"/"}]),new n.TokenNode(u),e.alpha])},exports.serializeRGB=function serializeRGB(e){let o=e.channels.map((e=>Number.isNaN(e)?0:e));e.colorNotation!==exports.ColorNotation.RGB&&e.colorNotation!==exports.ColorNotation.HEX&&(o=XYZ_D50_to_sRGB_Gamut(colorData_to_XYZ_D50(e).channels));const t=Math.min(255,Math.max(0,Math.round(255*toPrecision(o[0])))),r=Math.min(255,Math.max(0,Math.round(255*toPrecision(o[1])))),l=Math.min(255,Math.max(0,Math.round(255*toPrecision(o[2])))),s=[a.TokenType.CloseParen,")",-1,-1,void 0],i=[a.TokenType.Whitespace," ",-1,-1,void 0],u=[a.TokenType.Comma,",",-1,-1,void 0],c=[new n.TokenNode([a.TokenType.Number,t.toString(),-1,-1,{value:o[0],type:a.NumberType.Integer}]),new n.TokenNode(u),new n.TokenNode(i),new n.TokenNode([a.TokenType.Number,r.toString(),-1,-1,{value:o[1],type:a.NumberType.Integer}]),new n.TokenNode(u),new n.TokenNode(i),new n.TokenNode([a.TokenType.Number,l.toString(),-1,-1,{value:o[2],type:a.NumberType.Integer}])];if("number"==typeof e.alpha){const o=Math.min(1,Math.max(0,toPrecision(Number.isNaN(e.alpha)?0:e.alpha)));return 1===o?new n.FunctionNode([a.TokenType.Function,"rgb(",-1,-1,{value:"rgb"}],s,c):new n.FunctionNode([a.TokenType.Function,"rgba(",-1,-1,{value:"rgba"}],s,[...c,new n.TokenNode(u),new n.TokenNode(i),new n.TokenNode([a.TokenType.Number,o.toString(),-1,-1,{value:e.alpha,type:a.NumberType.Integer}])])}return new n.FunctionNode([a.TokenType.Function,"rgba(",-1,-1,{value:"rgba"}],s,[...c,new n.TokenNode(u),new n.TokenNode(i),e.alpha])};
