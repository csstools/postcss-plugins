"use strict";var e,a,n=require("@csstools/css-parser-algorithms"),o=require("@csstools/css-tokenizer"),r=require("@csstools/color-helpers"),t=require("@csstools/css-calc");function colorDataChannelsToCalcGlobals(e){const a=new Map;switch(e.colorSpace){case exports.ColorSpace.XYZ_D50:a.set("x",dummyNumberToken(e.channels[0])),a.set("y",dummyNumberToken(e.channels[1])),a.set("z",dummyNumberToken(e.channels[2])),a.set("alpha",dummyNumberToken(e.alpha));break;case exports.ColorSpace.sRGB:a.set("r",dummyNumberToken(255*e.channels[0])),a.set("g",dummyNumberToken(255*e.channels[1])),a.set("b",dummyNumberToken(255*e.channels[2])),a.set("alpha",dummyNumberToken(e.alpha))}return a}function dummyNumberToken(e){return[o.TokenType.Number,e.toString(),-1,-1,{value:e,type:o.NumberType.Number}]}function colorDataToColorSpace(e,a){if(-1===e)return-1;if(e.colorSpace!==exports.ColorSpace.XYZ_D50)return-1;switch(a){case exports.ColorSpace.XYZ_D50:return e;case exports.ColorSpace.sRGB:return e.colorSpace=exports.ColorSpace.sRGB,e.channels=r.xyz.XYZ_D50_to_sRGB(e.channels),e}return-1}function hex(e){const n=e[4].value.toLowerCase();if(n.match(/[^a-f0-9]/))return-1;const o={colorSpace:exports.ColorSpace.XYZ_D50,channels:[0,0,0],sourceColorSpace:exports.ColorSpace.sRGB,alpha:1,missingComponents:[!1,!1,!1,!1],syntaxFlags:new Set([a.Hex])},t=n.length;if(3===t){const e=n[0],a=n[1],t=n[2];return o.channels=r.xyz.sRGB_to_XYZ_D50([parseInt(e+e,16)/255,parseInt(a+a,16)/255,parseInt(t+t,16)/255]),o}if(6===t){const e=n[0]+n[1],a=n[2]+n[3],t=n[4]+n[5];return o.channels=r.xyz.sRGB_to_XYZ_D50([parseInt(e,16)/255,parseInt(a,16)/255,parseInt(t,16)/255]),o}if(4===t){const e=n[0],t=n[1],s=n[2],l=n[3];return o.channels=r.xyz.sRGB_to_XYZ_D50([parseInt(e+e,16)/255,parseInt(t+t,16)/255,parseInt(s+s,16)/255]),o.alpha=parseInt(l+l,16)/255,o.syntaxFlags.add(a.HasAlpha),o}if(8===t){const e=n[0]+n[1],t=n[2]+n[3],s=n[4]+n[5],l=n[6]+n[7];return o.channels=r.xyz.sRGB_to_XYZ_D50([parseInt(e,16)/255,parseInt(t,16)/255,parseInt(s,16)/255]),o.alpha=parseInt(l,16)/255,o.syntaxFlags.add(a.HasAlpha),o}return-1}function normalizeHue(e){if(e[0]===o.TokenType.Number)return e[4].value=e[4].value%360,e[1]=e[4].value.toString(),e;if(e[0]===o.TokenType.Dimension){let a=e[4].value;switch(e[4].unit.toLowerCase()){case"deg":break;case"rad":a=180*e[4].value/Math.PI;break;case"grad":a=.9*e[4].value;break;case"turn":a=360*e[4].value;break;default:return-1}return a%=360,[o.TokenType.Number,a.toString(),e[2],e[3],{value:a,type:o.NumberType.Number}]}return-1}function normalize_legacy_HSL_ChannelValues(e,n){const r=[];for(let t=0;t<e.length;t++){const s=e[t];if(0!==t)if(s[0]!==o.TokenType.Percentage){if(s[0]!==o.TokenType.Number)return-1;{3!==t&&n.syntaxFlags.add(a.HasNumberValues);let e=1;3===t&&(e=1),r.push([o.TokenType.Number,(s[4].value/e).toString(),s[2],s[3],{value:s[4].value/e,type:o.NumberType.Number}])}}else{3===t?n.syntaxFlags.add(a.HasPercentageAlpha):n.syntaxFlags.add(a.HasPercentageValues);let e=1;3===t&&(e=100),r.push([o.TokenType.Number,(s[4].value/e).toString(),s[2],s[3],{value:s[4].value/e,type:o.NumberType.Number}])}else{const e=normalizeHue(s);if(-1===e)return-1;s[0]===o.TokenType.Dimension&&n.syntaxFlags.add(a.HasDimensionValues),r.push(e)}}return n.syntaxFlags.has(a.HasNumberValues)?-1:r}function normalize_modern_HSL_ChannelValues(e,n){const r=[];for(let t=0;t<e.length;t++){const s=e[t];if(s[0]!==o.TokenType.Ident||"none"!==s[4].value.toLowerCase())if(0!==t)if(s[0]!==o.TokenType.Percentage){if(s[0]!==o.TokenType.Number)return-1;{3!==t&&n.syntaxFlags.add(a.HasNumberValues);let e=1;3===t&&(e=1),r.push([o.TokenType.Number,(s[4].value/e).toString(),s[2],s[3],{value:s[4].value/e,type:o.NumberType.Number}])}}else{3===t?n.syntaxFlags.add(a.HasPercentageAlpha):n.syntaxFlags.add(a.HasPercentageValues);let e=1;3===t&&(e=100),r.push([o.TokenType.Number,(s[4].value/e).toString(),s[2],s[3],{value:s[4].value/e,type:o.NumberType.Number}])}else{const e=normalizeHue(s);if(-1===e)return-1;s[0]===o.TokenType.Dimension&&n.syntaxFlags.add(a.HasDimensionValues),r.push(e)}else n.syntaxFlags.add(a.HasNoneKeywords),n.missingComponents[t]=!0,r.push([o.TokenType.Number,"0",s[2],s[3],{value:0,type:o.NumberType.Number}])}return n.syntaxFlags.has(a.HasNumberValues)?-1:r}function threeChannelLegacySyntax(e,r,s,l,u){const c=[],p=[],i=[],m=[],h={colorSpace:exports.ColorSpace.XYZ_D50,channels:[0,0,0],sourceColorSpace:s,alpha:0,missingComponents:[!1,!1,!1,!1],syntaxFlags:new Set(u)};let y=c;for(let a=0;a<e.value.length;a++){let r=e.value[a];if(!n.isWhitespaceNode(r)&&!n.isCommentNode(r)){if(n.isTokenNode(r)&&r.value[0]===o.TokenType.Comma){if(y===c){y=p;continue}if(y===p){y=i;continue}if(y===i){y=m;continue}if(y===m)return-1}if(n.isFunctionNode(r)){if("calc"!==r.getName().toLowerCase())return-1;const[[e]]=t.calcFromComponentValues([[r]],{toCanonicalUnits:!0,precision:100});if(!e||!n.isTokenNode(e))return-1;r=e}if(!n.isTokenNode(r))return-1;y.push(r.value)}}if(1!==y.length)return-1;if(1!==c.length||1!==p.length||1!==i.length)return-1;const g=[c[0],p[0],i[0]],d=1===m.length;d&&(h.syntaxFlags.add(a.HasAlpha),g.push(m[0]));const T=r(g,h);return-1===T?-1:(h.channels=l([T[0][4].value,T[1][4].value,T[2][4].value]),h.alpha=d?T[3][4].value:1,h)}function threeChannelSpaceSeparated(e,r,s,l,u){const c=[],p=[],i=[],m=[],h={colorSpace:exports.ColorSpace.XYZ_D50,channels:[0,0,0],sourceColorSpace:s,alpha:0,missingComponents:[!1,!1,!1,!1],syntaxFlags:new Set(u)};let y=c;for(let a=0;a<e.value.length;a++){let r=e.value[a];if(n.isWhitespaceNode(r)||n.isCommentNode(r)){for(;n.isWhitespaceNode(e.value[a+1])||n.isCommentNode(e.value[a+1]);)a++;if(!c.length)continue;if(y===c){y=p;continue}if(y===p){y=i;continue}}else if(n.isTokenNode(r)&&r.value[0]===o.TokenType.Delim&&"/"===r.value[4].value){if(y===m)return-1;y=m}else{if(n.isFunctionNode(r)){if("calc"!==r.getName().toLowerCase())return-1;const[[e]]=t.calcFromComponentValues([[r]],{toCanonicalUnits:!0,precision:100});if(!e||!n.isTokenNode(e))return-1;r=e}if(!n.isTokenNode(r))return-1;y.push(r.value)}}if(1!==y.length)return-1;if(1!==c.length||1!==p.length||1!==i.length)return-1;const g=[c[0],p[0],i[0]],d=1===m.length;d&&(h.syntaxFlags.add(a.HasAlpha),g.push(m[0]));const T=r(g,h);return-1===T?-1:(h.channels=l([T[0][4].value,T[1][4].value,T[2][4].value]),h.alpha=d?T[3][4].value:1,h)}function hsl(e,a){{const a=hslCommaSeparated(e);if(-1!==a)return a}{const a=hslSpaceSeparated(e);if(-1!==a)return a}return-1}function hslCommaSeparated(e){return threeChannelLegacySyntax(e,normalize_legacy_HSL_ChannelValues,exports.ColorSpace.sRGB,r.xyz.HSL_to_XYZ_D50,[a.LegacyHSL])}function hslSpaceSeparated(e){return threeChannelSpaceSeparated(e,normalize_modern_HSL_ChannelValues,exports.ColorSpace.sRGB,r.xyz.HSL_to_XYZ_D50,[])}function normalize_modern_HWB_ChannelValues(e,n){const r=[];for(let t=0;t<e.length;t++){const s=e[t];if(s[0]!==o.TokenType.Ident||"none"!==s[4].value.toLowerCase())if(0!==t)if(s[0]!==o.TokenType.Percentage){if(s[0]!==o.TokenType.Number)return-1;if(3!==t)return-1;r.push([o.TokenType.Number,s[1],s[2],s[3],{value:s[4].value,type:o.NumberType.Number}])}else{3===t?n.syntaxFlags.add(a.HasPercentageAlpha):n.syntaxFlags.add(a.HasPercentageValues);let e=1;3===t&&(e=100),r.push([o.TokenType.Number,(s[4].value/e).toString(),s[2],s[3],{value:s[4].value/e,type:o.NumberType.Number}])}else{const e=normalizeHue(s);if(-1===e)return-1;s[0]===o.TokenType.Dimension&&n.syntaxFlags.add(a.HasDimensionValues),r.push(e)}else n.syntaxFlags.add(a.HasNoneKeywords),n.missingComponents[t]=!0,r.push([o.TokenType.Number,"0",s[2],s[3],{value:0,type:o.NumberType.Number}])}return r}function hwb(e,a){{const a=hwbSpaceSeparated(e);if(-1!==a)return a}return-1}function hwbSpaceSeparated(e){return threeChannelSpaceSeparated(e,normalize_modern_HWB_ChannelValues,exports.ColorSpace.sRGB,r.xyz.HWB_to_XYZ_D50,[])}exports.ColorSpace=void 0,(e=exports.ColorSpace||(exports.ColorSpace={})).XYZ_D50="xyz-d50",e.XYZ_D65="xyz-d65",e.sRGB="srgb",function(e){e.ColorKeyword="color-keyword",e.HasAlpha="has-alpha",e.HasDimensionValues="has-dimension-values",e.HasNoneKeywords="has-none-keywords",e.HasNumberValues="has-number-values",e.HasPercentageAlpha="has-percentage-alpha",e.HasPercentageValues="has-percentage-values",e.Hex="hex",e.LegacyHSL="legacy-hsl",e.LegacyRGB="legacy-rgb",e.NamedColor="named-color",e.RelativeColorSyntax="relative-color-syntax"}(a||(a={}));const s=new Map;for(const[e,a]of Object.entries(r.namedColors))s.set(e.toLowerCase(),a);function namedColor(e){const n=s.get(e);return n?{colorSpace:exports.ColorSpace.XYZ_D50,channels:r.xyz.sRGB_to_XYZ_D50([n[0]/255,n[1]/255,n[2]/255]),sourceColorSpace:exports.ColorSpace.sRGB,alpha:1,missingComponents:[!1,!1,!1,!1],syntaxFlags:new Set([a.ColorKeyword,a.NamedColor])}:-1}function normalize_legacy_sRGB_ChannelValues(e,n){const r=[];for(let t=0;t<e.length;t++){const s=e[t];if(s[0]!==o.TokenType.Percentage){if(s[0]!==o.TokenType.Number)return-1;{3!==t&&n.syntaxFlags.add(a.HasNumberValues);let e=255;3===t&&(e=1),r.push([o.TokenType.Number,(s[4].value/e).toString(),s[2],s[3],{value:s[4].value/e,type:o.NumberType.Number}])}}else 3===t?n.syntaxFlags.add(a.HasPercentageAlpha):n.syntaxFlags.add(a.HasPercentageValues),r.push([o.TokenType.Number,(s[4].value/100).toString(),s[2],s[3],{value:s[4].value/100,type:o.NumberType.Number}])}return n.syntaxFlags.has(a.HasNumberValues)&&n.syntaxFlags.has(a.HasPercentageValues)?-1:r}function normalize_modern_sRGB_ChannelValues(e,n){const r=[];for(let t=0;t<e.length;t++){const s=e[t];if(s[0]!==o.TokenType.Percentage)if(s[0]!==o.TokenType.Number){if(s[0]!==o.TokenType.Ident||"none"!==s[4].value.toLowerCase())return-1;n.syntaxFlags.add(a.HasNoneKeywords),n.missingComponents[t]=!0,r.push([o.TokenType.Number,"0",s[2],s[3],{value:0,type:o.NumberType.Number}])}else{3!==t&&n.syntaxFlags.add(a.HasNumberValues);let e=255;3===t&&(e=1),r.push([o.TokenType.Number,(s[4].value/e).toString(),s[2],s[3],{value:s[4].value/e,type:o.NumberType.Number}])}else 3!==t&&n.syntaxFlags.add(a.HasPercentageValues),r.push([o.TokenType.Number,(s[4].value/100).toString(),s[2],s[3],{value:s[4].value/100,type:o.NumberType.Number}])}return r}function rgb(e,a){{const a=rgbCommaSeparated(e);if(-1!==a)return a}{const a=rgbSpaceSeparated(e);if(-1!==a)return a}{const n=rgbSpaceSeparated_RCS(e,a);if(-1!==n)return n}return-1}function rgbCommaSeparated(e){return threeChannelLegacySyntax(e,normalize_legacy_sRGB_ChannelValues,exports.ColorSpace.sRGB,r.xyz.sRGB_to_XYZ_D50,[a.LegacyRGB])}function rgbSpaceSeparated(e){return threeChannelSpaceSeparated(e,normalize_modern_sRGB_ChannelValues,exports.ColorSpace.sRGB,r.xyz.sRGB_to_XYZ_D50,[])}function rgbSpaceSeparated_RCS(e,s){let l=null,u=1;const c=[],p=[],i=[],m=[],h={channels:[0,0,0],colorSpace:exports.ColorSpace.XYZ_D50,sourceColorSpace:exports.ColorSpace.sRGB,alpha:0,missingComponents:[!1,!1,!1,!1],syntaxFlags:new Set([a.RelativeColorSyntax])};let y=c;for(let r=0;r<e.value.length;r++){let h=e.value[r];if(n.isWhitespaceNode(h)||n.isCommentNode(h)){for(;n.isWhitespaceNode(e.value[r+1])||n.isCommentNode(e.value[r+1]);)r++;if(!c.length)continue;if(y===c){y=p;continue}if(y===p){y=i;continue}}else{if(n.isTokenNode(h)&&!l&&h.value[0]===o.TokenType.Ident&&"from"===h.value[4].value.toLowerCase()){for(;n.isWhitespaceNode(e.value[r+1])||n.isCommentNode(e.value[r+1]);)r++;const t=e.value[r+1];if(n.isTokenNode(t)&&t.value[0]===o.TokenType.Ident){const e=t.value[4].value.toLowerCase();{const n=colorDataToColorSpace("transparent"===e?{colorSpace:exports.ColorSpace.XYZ_D50,channels:[0,0,0],sourceColorSpace:exports.ColorSpace.sRGB,alpha:0,missingComponents:[!1,!1,!1,!1],syntaxFlags:new Set([a.ColorKeyword,a.NamedColor])}:-1,exports.ColorSpace.sRGB);if(-1!==n){l=colorDataChannelsToCalcGlobals(n),u=n.alpha,r++;continue}}{const a=colorDataToColorSpace(namedColor(e),exports.ColorSpace.sRGB);if(-1!==a){l=colorDataChannelsToCalcGlobals(a),u=a.alpha,r++;continue}}return-1}if(n.isFunctionNode(t)){if("var"===t.getName().toLowerCase())return-1;const e=colorDataToColorSpace(s(t),exports.ColorSpace.sRGB);if(-1===e)return-1;l=colorDataChannelsToCalcGlobals(e),u=e.alpha,r++;continue}}if(!l)return-1;if(!n.isTokenNode(h)||h.value[0]!==o.TokenType.Delim||"/"!==h.value[4].value){if(n.isFunctionNode(h)){if("calc"!==h.getName().toLowerCase())return-1;const[[e]]=t.calcFromComponentValues([[h]],{toCanonicalUnits:!0,precision:100,globals:l});if(!e||!n.isTokenNode(e))return-1;h=e}if(n.isTokenNode(h)){if(h.value[0]===o.TokenType.Ident){const e=h.value,a=l.get(e[4].value.toLowerCase());if(!a)return-1;h=new n.TokenNode(a)}if(h.value[0]===o.TokenType.Percentage){const e=h.value;y.push([o.TokenType.Number,(e[4].value/100).toString(),e[2],e[3],{value:e[4].value/100,type:o.NumberType.Number}]);continue}if(h.value[0]===o.TokenType.Number){let e=255;y===m&&(e=1);const a=h.value;y.push([o.TokenType.Number,(a[4].value/e).toString(),a[2],a[3],{value:a[4].value/e,type:o.NumberType.Number}]);continue}}return-1}if(y===m)return-1;y=m}}return 1!==y.length||1!==c.length||1!==p.length||1!==i.length?-1:(h.channels=r.xyz.sRGB_to_XYZ_D50([c[0][4].value,p[0][4].value,i[0][4].value]),h.alpha=1===m.length?m[0][4].value:u,h)}exports.color=function color(e){if(n.isFunctionNode(e)){const a=e.getName().toLowerCase();return"rgb"===a||"rgba"===a?rgb(e,color):"hsl"===a||"hsla"===a?hsl(e):"hwb"===a?hwb(e):-1}return n.isTokenNode(e)&&e.value[0]===o.TokenType.Hash?hex(e.value):-1};
