import{isWhitespaceNode as e,isCommentNode as a,isTokenNode as n,isFunctionNode as t,TokenNode as r}from"@csstools/css-parser-algorithms";import{TokenType as s,NumberType as l}from"@csstools/css-tokenizer";import{xyz as o,namedColors as u}from"@csstools/color-helpers";import{calcFromComponentValues as c}from"@csstools/css-calc";var i,h;function colorDataChannelsToCalcGlobals(e){const a=new Map;switch(e.colorSpace){case i.XYZ_D50:a.set("x",dummyNumberToken(e.channels[0])),a.set("y",dummyNumberToken(e.channels[1])),a.set("z",dummyNumberToken(e.channels[2])),a.set("alpha",dummyNumberToken(e.alpha));break;case i.sRGB:a.set("r",dummyNumberToken(255*e.channels[0])),a.set("g",dummyNumberToken(255*e.channels[1])),a.set("b",dummyNumberToken(255*e.channels[2])),a.set("alpha",dummyNumberToken(e.alpha))}return a}function dummyNumberToken(e){return[s.Number,e.toString(),-1,-1,{value:e,type:l.Number}]}function colorDataToColorSpace(e,a){if(-1===e)return-1;if(e.colorSpace!==i.XYZ_D50)return-1;switch(a){case i.XYZ_D50:return e;case i.sRGB:return e.colorSpace=i.sRGB,e.channels=o.XYZ_D50_to_sRGB(e.channels),e}return-1}function hex(e){const a=e[4].value.toLowerCase();if(a.match(/[^a-f0-9]/))return-1;const n={colorSpace:i.XYZ_D50,channels:[0,0,0],sourceColorSpace:i.sRGB,alpha:1,missingComponents:[!1,!1,!1,!1],syntaxFlags:new Set([h.Hex])},t=a.length;if(3===t){const e=a[0],t=a[1],r=a[2];return n.channels=o.sRGB_to_XYZ_D50([parseInt(e+e,16)/255,parseInt(t+t,16)/255,parseInt(r+r,16)/255]),n}if(6===t){const e=a[0]+a[1],t=a[2]+a[3],r=a[4]+a[5];return n.channels=o.sRGB_to_XYZ_D50([parseInt(e,16)/255,parseInt(t,16)/255,parseInt(r,16)/255]),n}if(4===t){const e=a[0],t=a[1],r=a[2],s=a[3];return n.channels=o.sRGB_to_XYZ_D50([parseInt(e+e,16)/255,parseInt(t+t,16)/255,parseInt(r+r,16)/255]),n.alpha=parseInt(s+s,16)/255,n}if(8===t){const e=a[0]+a[1],t=a[2]+a[3],r=a[4]+a[5],s=a[6]+a[7];return n.channels=o.sRGB_to_XYZ_D50([parseInt(e,16)/255,parseInt(t,16)/255,parseInt(r,16)/255]),n.alpha=parseInt(s,16)/255,n}return-1}function normalizeHue(e){if(e[0]===s.Number)return e[4].value=e[4].value%360,e[1]=e[4].value.toString(),e;if(e[0]===s.Dimension){let a=e[4].value;switch(e[4].unit.toLowerCase()){case"deg":break;case"rad":a=180*e[4].value/Math.PI;break;case"grad":a=.9*e[4].value;break;case"turn":a=360*e[4].value;break;default:return-1}return a%=360,[s.Number,a.toString(),e[2],e[3],{value:a,type:l.Number}]}return-1}function normalize_legacy_HSL_ChannelValues(e,a){const n=[];for(let t=0;t<e.length;t++){const r=e[t];if(0!==t)if(r[0]!==s.Percentage){if(r[0]!==s.Number)return-1;{3!==t&&a.syntaxFlags.add(h.HasNumberValues);let e=1;3===t&&(e=1),n.push([s.Number,(r[4].value/e).toString(),r[2],r[3],{value:r[4].value/e,type:l.Number}])}}else{3===t?a.syntaxFlags.add(h.HasPercentageAlpha):a.syntaxFlags.add(h.HasPercentageValues);let e=1;3===t&&(e=100),n.push([s.Number,(r[4].value/e).toString(),r[2],r[3],{value:r[4].value/e,type:l.Number}])}else{const e=normalizeHue(r);if(-1===e)return-1;r[0]===s.Dimension&&a.syntaxFlags.add(h.HasDimensionValues),n.push(e)}}return a.syntaxFlags.has(h.HasNumberValues)?-1:n}function normalize_modern_HSL_ChannelValues(e,a){const n=[];for(let t=0;t<e.length;t++){const r=e[t];if(r[0]!==s.Ident||"none"!==r[4].value.toLowerCase())if(0!==t)if(r[0]!==s.Percentage){if(r[0]!==s.Number)return-1;{3!==t&&a.syntaxFlags.add(h.HasNumberValues);let e=1;3===t&&(e=1),n.push([s.Number,(r[4].value/e).toString(),r[2],r[3],{value:r[4].value/e,type:l.Number}])}}else{3===t?a.syntaxFlags.add(h.HasPercentageAlpha):a.syntaxFlags.add(h.HasPercentageValues);let e=1;3===t&&(e=100),n.push([s.Number,(r[4].value/e).toString(),r[2],r[3],{value:r[4].value/e,type:l.Number}])}else{const e=normalizeHue(r);if(-1===e)return-1;r[0]===s.Dimension&&a.syntaxFlags.add(h.HasDimensionValues),n.push(e)}else a.syntaxFlags.add(h.HasNoneKeywords),a.missingComponents[t]=!0,n.push([s.Number,"0",r[2],r[3],{value:0,type:l.Number}])}return a.syntaxFlags.has(h.HasNumberValues)?-1:n}function threeChannelLegacySyntax(r,l,o,u,m){const p=[],g=[],f=[],v=[],d={colorSpace:i.XYZ_D50,channels:[0,0,0],sourceColorSpace:o,alpha:0,missingComponents:[!1,!1,!1,!1],syntaxFlags:new Set(m)};let b=p;for(let l=0;l<r.value.length;l++){let o=r.value[l];if(!e(o)&&!a(o)){if(n(o)&&o.value[0]===s.Comma){if(b===p){b=g;continue}if(b===g){b=f;continue}if(b===f){b=v;continue}if(b===v)return-1}if(t(o)){if("calc"!==o.getName().toLowerCase())return-1;const[[e]]=c([[o]],{toCanonicalUnits:!0,precision:100});if(!e||!n(e))return-1;o=e}if(!n(o))return-1;b.push(o.value)}}if(1!==b.length)return-1;if(1!==p.length||1!==g.length||1!==f.length)return-1;const y=[p[0],g[0],f[0]],S=1===v.length;S&&(d.syntaxFlags.add(h.HasAlpha),y.push(v[0]));const _=l(y,d);return-1===_?-1:(d.channels=u([_[0][4].value,_[1][4].value,_[2][4].value]),d.alpha=S?_[3][4].value:1,d)}function threeChannelSpaceSeparated(r,l,o,u,m){const p=[],g=[],f=[],v=[],d={colorSpace:i.XYZ_D50,channels:[0,0,0],sourceColorSpace:o,alpha:0,missingComponents:[!1,!1,!1,!1],syntaxFlags:new Set(m)};let b=p;for(let l=0;l<r.value.length;l++){let o=r.value[l];if(e(o)||a(o)){for(;e(r.value[l+1])||a(r.value[l+1]);)l++;if(!p.length)continue;if(b===p){b=g;continue}if(b===g){b=f;continue}}else if(n(o)&&o.value[0]===s.Delim&&"/"===o.value[4].value){if(b===v)return-1;b=v}else{if(t(o)){if("calc"!==o.getName().toLowerCase())return-1;const[[e]]=c([[o]],{toCanonicalUnits:!0,precision:100});if(!e||!n(e))return-1;o=e}if(!n(o))return-1;b.push(o.value)}}if(1!==b.length)return-1;if(1!==p.length||1!==g.length||1!==f.length)return-1;const y=[p[0],g[0],f[0]],S=1===v.length;S&&(d.syntaxFlags.add(h.HasAlpha),y.push(v[0]));const _=l(y,d);return-1===_?-1:(d.channels=u([_[0][4].value,_[1][4].value,_[2][4].value]),d.alpha=S?_[3][4].value:1,d)}function hsl(e,a){{const a=hslCommaSeparated(e);if(-1!==a)return a}{const a=hslSpaceSeparated(e);if(-1!==a)return a}return-1}function hslCommaSeparated(e){return threeChannelLegacySyntax(e,normalize_legacy_HSL_ChannelValues,i.sRGB,o.HSL_to_XYZ_D50,[h.LegacyHSL])}function hslSpaceSeparated(e){return threeChannelSpaceSeparated(e,normalize_modern_HSL_ChannelValues,i.sRGB,o.HSL_to_XYZ_D50,[])}function normalize_modern_HWB_ChannelValues(e,a){const n=[];for(let t=0;t<e.length;t++){const r=e[t];if(r[0]!==s.Ident||"none"!==r[4].value.toLowerCase())if(0!==t)if(r[0]!==s.Percentage){if(r[0]!==s.Number)return-1;if(3!==t)return-1;n.push([s.Number,r[1],r[2],r[3],{value:r[4].value,type:l.Number}])}else{3===t?a.syntaxFlags.add(h.HasPercentageAlpha):a.syntaxFlags.add(h.HasPercentageValues);let e=1;3===t&&(e=100),n.push([s.Number,(r[4].value/e).toString(),r[2],r[3],{value:r[4].value/e,type:l.Number}])}else{const e=normalizeHue(r);if(-1===e)return-1;r[0]===s.Dimension&&a.syntaxFlags.add(h.HasDimensionValues),n.push(e)}else a.syntaxFlags.add(h.HasNoneKeywords),a.missingComponents[t]=!0,n.push([s.Number,"0",r[2],r[3],{value:0,type:l.Number}])}return n}function hwb(e,a){{const a=hwbSpaceSeparated(e);if(-1!==a)return a}return-1}function hwbSpaceSeparated(e){return threeChannelSpaceSeparated(e,normalize_modern_HWB_ChannelValues,i.sRGB,o.HWB_to_XYZ_D50,[])}!function(e){e.XYZ_D50="xyz-d50",e.XYZ_D65="xyz-d65",e.sRGB="srgb"}(i||(i={})),function(e){e.ColorKeyword="color-keyword",e.HasAlpha="has-alpha",e.HasDimensionValues="has-dimension-values",e.HasNoneKeywords="has-none-keywords",e.HasNumberValues="has-number-values",e.HasPercentageAlpha="has-percentage-alpha",e.HasPercentageValues="has-percentage-values",e.Hex="hex",e.LegacyHSL="legacy-hsl",e.LegacyRGB="legacy-rgb",e.NamedColor="named-color",e.RelativeColorSyntax="relative-color-syntax"}(h||(h={}));const m=new Map;for(const[e,a]of Object.entries(u))m.set(e.toLowerCase(),a);function namedColor(e){const a=m.get(e);return a?{colorSpace:i.XYZ_D50,channels:o.sRGB_to_XYZ_D50([a[0]/255,a[1]/255,a[2]/255]),sourceColorSpace:i.sRGB,alpha:1,missingComponents:[!1,!1,!1,!1],syntaxFlags:new Set([h.ColorKeyword,h.NamedColor])}:-1}function normalize_legacy_sRGB_ChannelValues(e,a){const n=[];for(let t=0;t<e.length;t++){const r=e[t];if(r[0]!==s.Percentage){if(r[0]!==s.Number)return-1;{3!==t&&a.syntaxFlags.add(h.HasNumberValues);let e=255;3===t&&(e=1),n.push([s.Number,(r[4].value/e).toString(),r[2],r[3],{value:r[4].value/e,type:l.Number}])}}else 3===t?a.syntaxFlags.add(h.HasPercentageAlpha):a.syntaxFlags.add(h.HasPercentageValues),n.push([s.Number,(r[4].value/100).toString(),r[2],r[3],{value:r[4].value/100,type:l.Number}])}return a.syntaxFlags.has(h.HasNumberValues)&&a.syntaxFlags.has(h.HasPercentageValues)?-1:n}function normalize_modern_sRGB_ChannelValues(e,a){const n=[];for(let t=0;t<e.length;t++){const r=e[t];if(r[0]!==s.Percentage)if(r[0]!==s.Number){if(r[0]!==s.Ident||"none"!==r[4].value.toLowerCase())return-1;a.syntaxFlags.add(h.HasNoneKeywords),a.missingComponents[t]=!0,n.push([s.Number,"0",r[2],r[3],{value:0,type:l.Number}])}else{3!==t&&a.syntaxFlags.add(h.HasNumberValues);let e=255;3===t&&(e=1),n.push([s.Number,(r[4].value/e).toString(),r[2],r[3],{value:r[4].value/e,type:l.Number}])}else 3!==t&&a.syntaxFlags.add(h.HasPercentageValues),n.push([s.Number,(r[4].value/100).toString(),r[2],r[3],{value:r[4].value/100,type:l.Number}])}return n}function rgb(e,a){{const a=rgbCommaSeparated(e);if(-1!==a)return a}{const a=rgbSpaceSeparated(e);if(-1!==a)return a}{const n=rgbSpaceSeparated_RCS(e,a);if(-1!==n)return n}return-1}function rgbCommaSeparated(e){return threeChannelLegacySyntax(e,normalize_legacy_sRGB_ChannelValues,i.sRGB,o.sRGB_to_XYZ_D50,[h.LegacyRGB])}function rgbSpaceSeparated(e){return threeChannelSpaceSeparated(e,normalize_modern_sRGB_ChannelValues,i.sRGB,o.sRGB_to_XYZ_D50,[])}function rgbSpaceSeparated_RCS(u,m){let p=null,g=1;const f=[],v=[],d=[],b=[],y={channels:[0,0,0],colorSpace:i.XYZ_D50,sourceColorSpace:i.sRGB,alpha:0,missingComponents:[!1,!1,!1,!1],syntaxFlags:new Set([h.RelativeColorSyntax])};let S=f;for(let o=0;o<u.value.length;o++){let y=u.value[o];if(e(y)||a(y)){for(;e(u.value[o+1])||a(u.value[o+1]);)o++;if(!f.length)continue;if(S===f){S=v;continue}if(S===v){S=d;continue}}else{if(n(y)&&!p&&y.value[0]===s.Ident&&"from"===y.value[4].value.toLowerCase()){for(;e(u.value[o+1])||a(u.value[o+1]);)o++;const r=u.value[o+1];if(n(r)&&r.value[0]===s.Ident){const e=r.value[4].value.toLowerCase();{const a=colorDataToColorSpace("transparent"===e?{colorSpace:i.XYZ_D50,channels:[0,0,0],sourceColorSpace:i.sRGB,alpha:0,missingComponents:[!1,!1,!1,!1],syntaxFlags:new Set([h.ColorKeyword,h.NamedColor])}:-1,i.sRGB);if(-1!==a){p=colorDataChannelsToCalcGlobals(a),g=a.alpha,o++;continue}}{const a=colorDataToColorSpace(namedColor(e),i.sRGB);if(-1!==a){p=colorDataChannelsToCalcGlobals(a),g=a.alpha,o++;continue}}return-1}if(t(r)){if("var"===r.getName().toLowerCase())return-1;const e=colorDataToColorSpace(m(r),i.sRGB);if(-1===e)return-1;p=colorDataChannelsToCalcGlobals(e),g=e.alpha,o++;continue}}if(!p)return-1;if(!n(y)||y.value[0]!==s.Delim||"/"!==y.value[4].value){if(t(y)){if("calc"!==y.getName().toLowerCase())return-1;const[[e]]=c([[y]],{toCanonicalUnits:!0,precision:100,globals:p});if(!e||!n(e))return-1;y=e}if(n(y)){if(y.value[0]===s.Ident){const e=y.value,a=p.get(e[4].value.toLowerCase());if(!a)return-1;y=new r(a)}if(y.value[0]===s.Percentage){const e=y.value;S.push([s.Number,(e[4].value/100).toString(),e[2],e[3],{value:e[4].value/100,type:l.Number}]);continue}if(y.value[0]===s.Number){let e=255;S===b&&(e=1);const a=y.value;S.push([s.Number,(a[4].value/e).toString(),a[2],a[3],{value:a[4].value/e,type:l.Number}]);continue}}return-1}if(S===b)return-1;S=b}}return 1!==S.length||1!==f.length||1!==v.length||1!==d.length?-1:(y.channels=o.sRGB_to_XYZ_D50([f[0][4].value,v[0][4].value,d[0][4].value]),y.alpha=1===b.length?b[0][4].value:g,y)}function color(e){if(t(e)){const a=e.getName().toLowerCase();return"rgb"===a||"rgba"===a?rgb(e,color):"hsl"===a||"hsla"===a?hsl(e):"hwb"===a?hwb(e):-1}return n(e)&&e.value[0]===s.Hash?hex(e.value):-1}export{i as ColorSpace,color};
