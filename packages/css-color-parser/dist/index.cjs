"use strict";var e,a,n=require("@csstools/css-parser-algorithms"),o=require("@csstools/color-helpers"),r=require("@csstools/css-tokenizer"),t=require("@csstools/css-calc");function colorDataChannelsToCalcGlobals(e){const a=new Map;switch(e.colorSpace){case exports.ColorSpace.XYZ_D50:a.set("x",dummyNumberToken(e.channels[0])),a.set("y",dummyNumberToken(e.channels[1])),a.set("z",dummyNumberToken(e.channels[2])),a.set("alpha",dummyNumberToken(e.alpha));break;case exports.ColorSpace.sRGB:a.set("r",dummyNumberToken(255*e.channels[0])),a.set("g",dummyNumberToken(255*e.channels[1])),a.set("b",dummyNumberToken(255*e.channels[2])),a.set("alpha",dummyNumberToken(e.alpha))}return a}function dummyNumberToken(e){return[r.TokenType.Number,e.toString(),-1,-1,{value:e,type:r.NumberType.Number}]}function colorDataToColorSpace(e,a){if(-1===e)return-1;if(e.colorSpace!==exports.ColorSpace.XYZ_D50)return-1;switch(a){case exports.ColorSpace.XYZ_D50:return e;case exports.ColorSpace.sRGB:return e.colorSpace=exports.ColorSpace.sRGB,e.channels=o.xyz.XYZ_D50_to_sRGB(e.channels),e}return-1}function normalizeHue(e){if(e[0]===r.TokenType.Number)return e[4].value=e[4].value%360,e[1]=e[4].value.toString(),e;if(e[0]===r.TokenType.Dimension){let a=e[4].value;switch(e[4].unit.toLowerCase()){case"deg":break;case"rad":a=180*e[4].value/Math.PI;break;case"grad":a=.9*e[4].value;break;case"turn":a=360*e[4].value;break;default:return-1}return a%=360,[r.TokenType.Number,a.toString(),e[2],e[3],{value:a,type:r.NumberType.Number}]}return-1}function normalize_legacy_HSL_ChannelValues(e,n){const o=[];for(let t=0;t<e.length;t++){const s=e[t];if(0!==t)if(s[0]!==r.TokenType.Percentage){if(s[0]!==r.TokenType.Number)return-1;{3!==t&&n.syntaxFlags.add(a.HasNumberValues);let e=1;3===t&&(e=1),o.push([r.TokenType.Number,(s[4].value/e).toString(),s[2],s[3],{value:s[4].value/e,type:r.NumberType.Number}])}}else{3===t?n.syntaxFlags.add(a.HasPercentageAlpha):n.syntaxFlags.add(a.HasPercentageValues);let e=1;3===t&&(e=100),o.push([r.TokenType.Number,(s[4].value/e).toString(),s[2],s[3],{value:s[4].value/e,type:r.NumberType.Number}])}else{const e=normalizeHue(s);if(-1===e)return-1;s[0]===r.TokenType.Dimension&&n.syntaxFlags.add(a.HasDimensionValues),o.push(e)}}return n.syntaxFlags.has(a.HasNumberValues)?-1:o}function normalize_modern_HSL_ChannelValues(e,n){const o=[];for(let t=0;t<e.length;t++){const s=e[t];if(s[0]!==r.TokenType.Ident||"none"!==s[4].value.toLowerCase())if(0!==t)if(s[0]!==r.TokenType.Percentage){if(s[0]!==r.TokenType.Number)return-1;{3!==t&&n.syntaxFlags.add(a.HasNumberValues);let e=1;3===t&&(e=1),o.push([r.TokenType.Number,(s[4].value/e).toString(),s[2],s[3],{value:s[4].value/e,type:r.NumberType.Number}])}}else{3===t?n.syntaxFlags.add(a.HasPercentageAlpha):n.syntaxFlags.add(a.HasPercentageValues);let e=1;3===t&&(e=100),o.push([r.TokenType.Number,(s[4].value/e).toString(),s[2],s[3],{value:s[4].value/e,type:r.NumberType.Number}])}else{const e=normalizeHue(s);if(-1===e)return-1;s[0]===r.TokenType.Dimension&&n.syntaxFlags.add(a.HasDimensionValues),o.push(e)}else n.syntaxFlags.add(a.HasNoneKeywords),n.missingComponents[t]=!0,o.push([r.TokenType.Number,"0",s[2],s[3],{value:0,type:r.NumberType.Number}])}return n.syntaxFlags.has(a.HasNumberValues)?-1:o}function threeChannelLegacySyntax(e,o,s,l,u){const c=[],i=[],p=[],m=[],h={colorSpace:exports.ColorSpace.XYZ_D50,channels:[0,0,0],sourceColorSpace:s,alpha:0,missingComponents:[!1,!1,!1,!1],syntaxFlags:new Set(u)};let y=c;for(let a=0;a<e.value.length;a++){let o=e.value[a];if(!n.isWhitespaceNode(o)&&!n.isCommentNode(o)){if(n.isTokenNode(o)&&o.value[0]===r.TokenType.Comma){if(y===c){y=i;continue}if(y===i){y=p;continue}if(y===p){y=m;continue}if(y===m)return-1}if(n.isFunctionNode(o)){if("calc"!==o.getName().toLowerCase())return-1;const[[e]]=t.calcFromComponentValues([[o]],{toCanonicalUnits:!0,precision:100});if(!e||!n.isTokenNode(e))return-1;o=e}if(!n.isTokenNode(o))return-1;y.push(o.value)}}if(1!==y.length)return-1;if(1!==c.length||1!==i.length||1!==p.length)return-1;const g=[c[0],i[0],p[0]],d=1===m.length;d&&(h.syntaxFlags.add(a.HasAlpha),g.push(m[0]));const T=o(g,h);return-1===T?-1:(h.channels=l([T[0][4].value,T[1][4].value,T[2][4].value]),h.alpha=d?T[3][4].value:1,h)}function threeChannelSpaceSeparated(e,o,s,l,u){const c=[],i=[],p=[],m=[],h={colorSpace:exports.ColorSpace.XYZ_D50,channels:[0,0,0],sourceColorSpace:s,alpha:0,missingComponents:[!1,!1,!1,!1],syntaxFlags:new Set(u)};let y=c;for(let a=0;a<e.value.length;a++){let o=e.value[a];if(n.isWhitespaceNode(o)||n.isCommentNode(o)){for(;n.isWhitespaceNode(e.value[a+1])||n.isCommentNode(e.value[a+1]);)a++;if(!c.length)continue;if(y===c){y=i;continue}if(y===i){y=p;continue}}else if(n.isTokenNode(o)&&o.value[0]===r.TokenType.Delim&&"/"===o.value[4].value){if(y===m)return-1;y=m}else{if(n.isFunctionNode(o)){if("calc"!==o.getName().toLowerCase())return-1;const[[e]]=t.calcFromComponentValues([[o]],{toCanonicalUnits:!0,precision:100});if(!e||!n.isTokenNode(e))return-1;o=e}if(!n.isTokenNode(o))return-1;y.push(o.value)}}if(1!==y.length)return-1;if(1!==c.length||1!==i.length||1!==p.length)return-1;const g=[c[0],i[0],p[0]],d=1===m.length;d&&(h.syntaxFlags.add(a.HasAlpha),g.push(m[0]));const T=o(g,h);return-1===T?-1:(h.channels=l([T[0][4].value,T[1][4].value,T[2][4].value]),h.alpha=d?T[3][4].value:1,h)}function hsl(e,a){{const a=hslCommaSeparated(e);if(-1!==a)return a}{const a=hslSpaceSeparated(e);if(-1!==a)return a}return-1}function hslCommaSeparated(e){return threeChannelLegacySyntax(e,normalize_legacy_HSL_ChannelValues,exports.ColorSpace.sRGB,o.xyz.HSL_to_XYZ_D50,[a.LegacyHSL])}function hslSpaceSeparated(e){return threeChannelSpaceSeparated(e,normalize_modern_HSL_ChannelValues,exports.ColorSpace.sRGB,o.xyz.HSL_to_XYZ_D50,[])}exports.ColorSpace=void 0,(e=exports.ColorSpace||(exports.ColorSpace={})).XYZ_D50="xyz-d50",e.XYZ_D65="xyz-d65",e.sRGB="srgb",function(e){e.ColorKeyword="color-keyword",e.HasAlpha="has-alpha",e.HasNoneKeywords="has-none-keywords",e.HasNumberValues="has-number-values",e.HasPercentageValues="has-percentage-values",e.HasDimensionValues="has-dimension-values",e.HasPercentageAlpha="has-percentage-alpha",e.LegacyHSL="legacy-hsl",e.LegacyRGB="legacy-rgb",e.NamedColor="named-color",e.RelativeColorSyntax="relative-color-syntax"}(a||(a={}));const s=new Map;for(const[e,a]of Object.entries(o.namedColors))s.set(e.toLowerCase(),a);function namedColor(e){const n=s.get(e);return n?{colorSpace:exports.ColorSpace.XYZ_D50,channels:o.xyz.sRGB_to_XYZ_D50([n[0]/255,n[1]/255,n[2]/255]),sourceColorSpace:exports.ColorSpace.sRGB,alpha:1,missingComponents:[!1,!1,!1,!1],syntaxFlags:new Set([a.ColorKeyword,a.NamedColor])}:-1}function normalize_legacy_sRGB_ChannelValues(e,n){const o=[];for(let t=0;t<e.length;t++){const s=e[t];if(s[0]!==r.TokenType.Percentage){if(s[0]!==r.TokenType.Number)return-1;{3!==t&&n.syntaxFlags.add(a.HasNumberValues);let e=255;3===t&&(e=1),o.push([r.TokenType.Number,(s[4].value/e).toString(),s[2],s[3],{value:s[4].value/e,type:r.NumberType.Number}])}}else 3===t?n.syntaxFlags.add(a.HasPercentageAlpha):n.syntaxFlags.add(a.HasPercentageValues),o.push([r.TokenType.Number,(s[4].value/100).toString(),s[2],s[3],{value:s[4].value/100,type:r.NumberType.Number}])}return n.syntaxFlags.has(a.HasNumberValues)&&n.syntaxFlags.has(a.HasPercentageValues)?-1:o}function normalize_modern_sRGB_ChannelValues(e,n){const o=[];for(let t=0;t<e.length;t++){const s=e[t];if(s[0]!==r.TokenType.Percentage)if(s[0]!==r.TokenType.Number){if(s[0]!==r.TokenType.Ident||"none"!==s[4].value.toLowerCase())return-1;n.syntaxFlags.add(a.HasNoneKeywords),n.missingComponents[t]=!0,o.push([r.TokenType.Number,"0",s[2],s[3],{value:0,type:r.NumberType.Number}])}else{3!==t&&n.syntaxFlags.add(a.HasNumberValues);let e=255;3===t&&(e=1),o.push([r.TokenType.Number,(s[4].value/e).toString(),s[2],s[3],{value:s[4].value/e,type:r.NumberType.Number}])}else 3!==t&&n.syntaxFlags.add(a.HasPercentageValues),o.push([r.TokenType.Number,(s[4].value/100).toString(),s[2],s[3],{value:s[4].value/100,type:r.NumberType.Number}])}return o}function rgb(e,a){{const a=rgbCommaSeparated(e);if(-1!==a)return a}{const a=rgbSpaceSeparated(e);if(-1!==a)return a}{const n=rgbSpaceSeparated_RCS(e,a);if(-1!==n)return n}return-1}function rgbCommaSeparated(e){return threeChannelLegacySyntax(e,normalize_legacy_sRGB_ChannelValues,exports.ColorSpace.sRGB,o.xyz.sRGB_to_XYZ_D50,[a.LegacyRGB])}function rgbSpaceSeparated(e){return threeChannelSpaceSeparated(e,normalize_modern_sRGB_ChannelValues,exports.ColorSpace.sRGB,o.xyz.sRGB_to_XYZ_D50,[])}function rgbSpaceSeparated_RCS(e,s){let l=null,u=1;const c=[],i=[],p=[],m=[],h={channels:[0,0,0],colorSpace:exports.ColorSpace.XYZ_D50,sourceColorSpace:exports.ColorSpace.sRGB,alpha:0,missingComponents:[!1,!1,!1,!1],syntaxFlags:new Set([a.RelativeColorSyntax])};let y=c;for(let o=0;o<e.value.length;o++){let h=e.value[o];if(n.isWhitespaceNode(h)||n.isCommentNode(h)){for(;n.isWhitespaceNode(e.value[o+1])||n.isCommentNode(e.value[o+1]);)o++;if(!c.length)continue;if(y===c){y=i;continue}if(y===i){y=p;continue}}else{if(n.isTokenNode(h)&&!l&&h.value[0]===r.TokenType.Ident&&"from"===h.value[4].value.toLowerCase()){for(;n.isWhitespaceNode(e.value[o+1])||n.isCommentNode(e.value[o+1]);)o++;const t=e.value[o+1];if(n.isTokenNode(t)&&t.value[0]===r.TokenType.Ident){const e=t.value[4].value.toLowerCase();{const n=colorDataToColorSpace("transparent"===e?{colorSpace:exports.ColorSpace.XYZ_D50,channels:[0,0,0],sourceColorSpace:exports.ColorSpace.sRGB,alpha:0,missingComponents:[!1,!1,!1,!1],syntaxFlags:new Set([a.ColorKeyword,a.NamedColor])}:-1,exports.ColorSpace.sRGB);if(-1!==n){l=colorDataChannelsToCalcGlobals(n),u=n.alpha,o++;continue}}{const a=colorDataToColorSpace(namedColor(e),exports.ColorSpace.sRGB);if(-1!==a){l=colorDataChannelsToCalcGlobals(a),u=a.alpha,o++;continue}}return-1}if(n.isFunctionNode(t)){if("var"===t.getName().toLowerCase())return-1;const e=colorDataToColorSpace(s(t),exports.ColorSpace.sRGB);if(-1===e)return-1;l=colorDataChannelsToCalcGlobals(e),u=e.alpha,o++;continue}}if(!l)return-1;if(!n.isTokenNode(h)||h.value[0]!==r.TokenType.Delim||"/"!==h.value[4].value){if(n.isFunctionNode(h)){if("calc"!==h.getName().toLowerCase())return-1;const[[e]]=t.calcFromComponentValues([[h]],{toCanonicalUnits:!0,precision:100,globals:l});if(!e||!n.isTokenNode(e))return-1;h=e}if(n.isTokenNode(h)){if(h.value[0]===r.TokenType.Ident){const e=h.value,a=l.get(e[4].value.toLowerCase());if(!a)return-1;h=new n.TokenNode(a)}if(h.value[0]===r.TokenType.Percentage){const e=h.value;y.push([r.TokenType.Number,(e[4].value/100).toString(),e[2],e[3],{value:e[4].value/100,type:r.NumberType.Number}]);continue}if(h.value[0]===r.TokenType.Number){let e=255;y===m&&(e=1);const a=h.value;y.push([r.TokenType.Number,(a[4].value/e).toString(),a[2],a[3],{value:a[4].value/e,type:r.NumberType.Number}]);continue}}return-1}if(y===m)return-1;y=m}}return 1!==y.length||1!==c.length||1!==i.length||1!==p.length?-1:(h.channels=o.xyz.sRGB_to_XYZ_D50([c[0][4].value,i[0][4].value,p[0][4].value]),h.alpha=1===m.length?m[0][4].value:u,h)}exports.color=function color(e){if(!n.isFunctionNode(e))return-1;const a=e.getName().toLowerCase();return"rgb"===a||"rgba"===a?rgb(e,color):"hsl"===a||"hsla"===a?hsl(e):-1};
