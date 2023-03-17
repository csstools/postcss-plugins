import{isWhitespaceNode as e,isCommentNode as a,isTokenNode as n,isFunctionNode as r,FunctionNode as o,TokenNode as t}from"@csstools/css-parser-algorithms";import{TokenType as l,NumberType as s}from"@csstools/css-tokenizer";import{xyz as c,namedColors as u,utils as i,conversions as h,calculations as m}from"@csstools/color-helpers";import{calcFromComponentValues as p}from"@csstools/css-calc";var N,_;function colorData_to_XYZ_D50(e){switch(e.colorNotation){case N.HEX:case N.RGB:return{...e,colorNotation:N.XYZ_D50,channels:c.sRGB_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case N.Linear_RGB:return{...e,colorNotation:N.XYZ_D50,channels:c.lin_sRGB_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case N.Display_P3:return{...e,colorNotation:N.XYZ_D50,channels:c.P3_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case N.Rec2020:return{...e,colorNotation:N.XYZ_D50,channels:c.rec_2020_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case N.A98_RGB:return{...e,colorNotation:N.XYZ_D50,channels:c.a98_RGB_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case N.ProPhoto_RGB:return{...e,colorNotation:N.XYZ_D50,channels:c.ProPhoto_RGB_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case N.HSL:return{...e,colorNotation:N.XYZ_D50,channels:c.HSL_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case N.HWB:return{...e,colorNotation:N.XYZ_D50,channels:c.HWB_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case N.Lab:return{...e,colorNotation:N.XYZ_D50,channels:c.Lab_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case N.OKLab:return{...e,colorNotation:N.XYZ_D50,channels:c.OKLab_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case N.LCH:return{...e,colorNotation:N.XYZ_D50,channels:c.LCH_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case N.OKLCH:return{...e,colorNotation:N.XYZ_D50,channels:c.OKLCH_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case N.XYZ_D50:return{...e,colorNotation:N.XYZ_D50,channels:c.XYZ_D50_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case N.XYZ_D65:return{...e,colorNotation:N.XYZ_D50,channels:c.XYZ_D65_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};default:throw new Error("Unsupported color notation")}}!function(e){e.A98_RGB="a98-rgb",e.Display_P3="display-p3",e.HEX="hex",e.HSL="hsl",e.HWB="hwb",e.LCH="lch",e.Lab="lab",e.Linear_RGB="srgb-linear",e.OKLCH="oklch",e.OKLab="oklab",e.ProPhoto_RGB="prophoto-rgb",e.RGB="rgb",e.Rec2020="rec2020",e.XYZ_D50="xyz-d50",e.XYZ_D65="xyz-d65"}(N||(N={})),function(e){e.ColorKeyword="color-keyword",e.HasAlpha="has-alpha",e.HasDimensionValues="has-dimension-values",e.HasNoneKeywords="has-none-keywords",e.HasNumberValues="has-number-values",e.HasPercentageAlpha="has-percentage-alpha",e.HasPercentageValues="has-percentage-values",e.HasVariableAlpha="has-variable-alpha",e.Hex="hex",e.LegacyHSL="legacy-hsl",e.LegacyRGB="legacy-rgb",e.NamedColor="named-color",e.RelativeColorSyntax="relative-color-syntax",e.ColorMix="color-mix"}(_||(_={}));const b=new Set([N.A98_RGB,N.Display_P3,N.HEX,N.Linear_RGB,N.ProPhoto_RGB,N.RGB,N.Rec2020,N.XYZ_D50,N.XYZ_D65]);function colorDataTo(e,a){const n=colorData_to_XYZ_D50(e),r={...e};switch(a){case N.HEX:case N.RGB:r.colorNotation=N.RGB,r.channels=c.XYZ_D50_to_sRGB(n.channels);break;case N.Linear_RGB:r.colorNotation=N.Linear_RGB,r.channels=c.XYZ_D50_to_lin_sRGB(n.channels);break;case N.Display_P3:r.colorNotation=N.Display_P3,r.channels=c.XYZ_D50_to_P3(n.channels);break;case N.Rec2020:r.colorNotation=N.Rec2020,r.channels=c.XYZ_D50_to_rec_2020(n.channels);break;case N.ProPhoto_RGB:r.colorNotation=N.ProPhoto_RGB,r.channels=c.XYZ_D50_to_ProPhoto(n.channels);break;case N.A98_RGB:r.colorNotation=N.A98_RGB,r.channels=c.XYZ_D50_to_a98_RGB(n.channels);break;case N.HSL:r.colorNotation=N.HSL,r.channels=c.XYZ_D50_to_HSL(n.channels);break;case N.HWB:r.colorNotation=N.HWB,r.channels=c.XYZ_D50_to_HWB(n.channels);break;case N.Lab:r.colorNotation=N.Lab,r.channels=c.XYZ_D50_to_Lab(n.channels);break;case N.LCH:r.colorNotation=N.LCH,r.channels=c.XYZ_D50_to_LCH(n.channels);break;case N.OKLCH:r.colorNotation=N.OKLCH,r.channels=c.XYZ_D50_to_OKLCH(n.channels);break;case N.OKLab:r.colorNotation=N.OKLab,r.channels=c.XYZ_D50_to_OKLab(n.channels);break;case N.XYZ_D50:r.colorNotation=N.XYZ_D50,r.channels=c.XYZ_D50_to_XYZ_D50(n.channels);break;case N.XYZ_D65:r.colorNotation=N.XYZ_D65,r.channels=c.XYZ_D50_to_XYZ_D65(n.channels);break;default:throw new Error("Unsupported color notation")}if(a===e.colorNotation)r.channels=carryForwardMissingComponents(e.channels,[0,1,2],r.channels,[0,1,2]);else if(b.has(a)&&b.has(e.colorNotation))r.channels=carryForwardMissingComponents(e.channels,[0,1,2],r.channels,[0,1,2]);else switch(a){case N.HSL:switch(e.colorNotation){case N.HWB:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[0]);break;case N.Lab:case N.OKLab:r.channels=carryForwardMissingComponents(e.channels,[2],r.channels,[0]);break;case N.LCH:case N.OKLCH:r.channels=carryForwardMissingComponents(e.channels,[0,1,2],r.channels,[2,1,0])}break;case N.HWB:switch(e.colorNotation){case N.HSL:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[0]);break;case N.LCH:case N.OKLCH:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[2])}break;case N.Lab:case N.OKLab:switch(e.colorNotation){case N.HSL:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[2]);break;case N.Lab:case N.OKLab:case N.LCH:case N.OKLCH:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[0])}break;case N.LCH:case N.OKLCH:switch(e.colorNotation){case N.HSL:r.channels=carryForwardMissingComponents(e.channels,[0,1,2],r.channels,[2,1,0]);break;case N.HWB:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[2]);break;case N.Lab:case N.OKLab:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[0]);break;case N.LCH:case N.OKLCH:r.channels=carryForwardMissingComponents(e.channels,[0,1,2],r.channels,[0,1,2])}}switch(a){case N.HSL:(reducePrecision(r.channels[2])<=0||reducePrecision(r.channels[2])>=100)&&(r.channels[0]=NaN,r.channels[1]=NaN),r.channels[1]<=0&&(r.channels[0]=NaN);break;case N.HWB:Math.max(0,reducePrecision(r.channels[1]))+Math.max(0,reducePrecision(r.channels[2]))>=100&&(r.channels[0]=NaN);break;case N.Lab:(reducePrecision(r.channels[0])<=0||reducePrecision(r.channels[0])>=100)&&(r.channels[1]=NaN,r.channels[2]=NaN);break;case N.LCH:reducePrecision(r.channels[1])<=0&&(r.channels[2]=NaN),(reducePrecision(r.channels[0])<=0||reducePrecision(r.channels[0])>=100)&&(r.channels[1]=NaN,r.channels[2]=NaN);break;case N.OKLab:(reducePrecision(r.channels[0])<=0||reducePrecision(r.channels[0])>=1)&&(r.channels[1]=NaN,r.channels[2]=NaN);break;case N.OKLCH:reducePrecision(r.channels[1])<=0&&(r.channels[2]=NaN),(reducePrecision(r.channels[0])<=0||reducePrecision(r.channels[0])>=1)&&(r.channels[1]=NaN,r.channels[2]=NaN)}return r}function carryForwardMissingComponents(e,a,n,r){const o=[...n];for(const n of a)Number.isNaN(e[a[n]])&&(o[r[n]]=NaN);return o}function fillInMissingComponents(e,a){const n=[...e];for(let r=0;r<e.length;r++)Number.isNaN(e[r])&&(n[r]=a[r]);return n}function reducePrecision(e,a=7){const n=Math.pow(10,a);return Math.round(e*n)/n}const g=/[A-Z]/g;function toLowerCaseAZ(e){return e.replace(g,(e=>String.fromCharCode(e.charCodeAt(0)+32)))}function hex(e){const a=toLowerCaseAZ(e[4].value);if(a.match(/[^a-f0-9]/))return!1;const n={colorNotation:N.HEX,channels:[0,0,0],alpha:1,syntaxFlags:new Set([_.Hex])},r=a.length;if(3===r){const e=a[0],r=a[1],o=a[2];return n.channels=[parseInt(e+e,16)/255,parseInt(r+r,16)/255,parseInt(o+o,16)/255],n}if(6===r){const e=a[0]+a[1],r=a[2]+a[3],o=a[4]+a[5];return n.channels=[parseInt(e,16)/255,parseInt(r,16)/255,parseInt(o,16)/255],n}if(4===r){const e=a[0],r=a[1],o=a[2],t=a[3];return n.channels=[parseInt(e+e,16)/255,parseInt(r+r,16)/255,parseInt(o+o,16)/255],n.alpha=parseInt(t+t,16)/255,n.syntaxFlags.add(_.HasAlpha),n}if(8===r){const e=a[0]+a[1],r=a[2]+a[3],o=a[4]+a[5],t=a[6]+a[7];return n.channels=[parseInt(e,16)/255,parseInt(r,16)/255,parseInt(o,16)/255],n.alpha=parseInt(t,16)/255,n.syntaxFlags.add(_.HasAlpha),n}return!1}function normalizeHue(e){if(e[0]===l.Number)return e[4].value=e[4].value%360,e[1]=e[4].value.toString(),e;if(e[0]===l.Dimension){let a=e[4].value;switch(toLowerCaseAZ(e[4].unit)){case"deg":break;case"rad":a=180*e[4].value/Math.PI;break;case"grad":a=.9*e[4].value;break;case"turn":a=360*e[4].value;break;default:return!1}return a%=360,[l.Number,a.toString(),e[2],e[3],{value:a,type:s.Number}]}return!1}function normalize(e,a,n,r){return Math.min(Math.max(e/a,n),r)}function normalize_legacy_HSL_ChannelValues(e,a){const n=[];for(let r=0;r<e.length;r++){const o=e[r];if(0!==r)if(o[0]!==l.Percentage){if(o[0]!==l.Number)return!1;{3!==r&&a.syntaxFlags.add(_.HasNumberValues);let e=normalize(o[4].value,1,0,100);3===r&&(e=normalize(o[4].value,1,0,1)),n.push([l.Number,e.toString(),o[2],o[3],{value:e,type:s.Number}])}}else{3===r?a.syntaxFlags.add(_.HasPercentageAlpha):a.syntaxFlags.add(_.HasPercentageValues);let e=normalize(o[4].value,1,0,100);3===r&&(e=normalize(o[4].value,100,0,1)),n.push([l.Number,e.toString(),o[2],o[3],{value:e,type:s.Number}])}else{const e=normalizeHue(o);if(!1===e)return!1;o[0]===l.Dimension&&a.syntaxFlags.add(_.HasDimensionValues),n.push(e)}}return!a.syntaxFlags.has(_.HasNumberValues)&&n}function normalize_modern_HSL_ChannelValues(e,a){const n=[];for(let r=0;r<e.length;r++){const o=e[r];if(o[0]!==l.Ident||"none"!==toLowerCaseAZ(o[4].value))if(0!==r)if(o[0]!==l.Percentage){if(o[0]!==l.Number)return!1;{3!==r&&a.syntaxFlags.add(_.HasNumberValues);let e=normalize(o[4].value,1,0,100);3===r&&(e=normalize(o[4].value,1,0,1)),n.push([l.Number,e.toString(),o[2],o[3],{value:e,type:s.Number}])}}else{3===r?a.syntaxFlags.add(_.HasPercentageAlpha):a.syntaxFlags.add(_.HasPercentageValues);let e=normalize(o[4].value,1,0,100);3===r&&(e=normalize(o[4].value,100,0,1)),n.push([l.Number,e.toString(),o[2],o[3],{value:e,type:s.Number}])}else{const e=normalizeHue(o);if(!1===e)return!1;o[0]===l.Dimension&&a.syntaxFlags.add(_.HasDimensionValues),n.push(e)}else a.syntaxFlags.add(_.HasNoneKeywords),n.push([l.Number,"none",o[2],o[3],{value:NaN,type:s.Number}])}return n}function threeChannelLegacySyntax(o,t,s,c){const u=[],i=[],h=[],m=[],N={colorNotation:s,channels:[0,0,0],alpha:1,syntaxFlags:new Set(c)};let b=u;for(let t=0;t<o.value.length;t++){let s=o.value[t];if(!e(s)&&!a(s)){if(n(s)&&s.value[0]===l.Comma){if(b===u){b=i;continue}if(b===i){b=h;continue}if(b===h){b=m;continue}if(b===m)return!1}if(r(s)){if(b===m&&"var"===toLowerCaseAZ(s.getName())){N.syntaxFlags.add(_.HasVariableAlpha),b.push(s);continue}if("calc"!==toLowerCaseAZ(s.getName()))return!1;const[[e]]=p([[s]],{toCanonicalUnits:!0,precision:100});if(!e||!n(e))return!1;s=e}if(!n(s))return!1;b.push(s)}}if(1!==b.length)return!1;if(1!==u.length||1!==i.length||1!==h.length)return!1;if(!n(u[0])||!n(i[0])||!n(h[0]))return!1;const g=[u[0].value,i[0].value,h[0].value];1===m.length&&(N.syntaxFlags.add(_.HasAlpha),n(m[0])?g.push(m[0].value):N.alpha=m[0]);const d=t(g,N);return!1!==d&&(N.channels=[d[0][4].value,d[1][4].value,d[2][4].value],4===d.length&&(N.alpha=d[3][4].value),N)}function threeChannelSpaceSeparated(o,t,s,c){const u=[],i=[],h=[],m=[],N={colorNotation:s,channels:[0,0,0],alpha:1,syntaxFlags:new Set(c)};let b=u;for(let t=0;t<o.value.length;t++){let s=o.value[t];if(e(s)||a(s)){for(;e(o.value[t+1])||a(o.value[t+1]);)t++;if(!u.length)continue;if(b===u){b=i;continue}if(b===i){b=h;continue}}else if(n(s)&&s.value[0]===l.Delim&&"/"===s.value[4].value){if(b===m)return!1;b=m}else{if(r(s)){if(b===m&&"var"===toLowerCaseAZ(s.getName())){N.syntaxFlags.add(_.HasVariableAlpha),b.push(s);continue}if("calc"!==toLowerCaseAZ(s.getName()))return!1;const[[e]]=p([[s]],{toCanonicalUnits:!0,precision:100});if(!e||!n(e))return!1;s=e}if(!n(s))return!1;b.push(s)}}if(1!==b.length)return!1;if(1!==u.length||1!==i.length||1!==h.length)return!1;if(!n(u[0])||!n(i[0])||!n(h[0]))return!1;const g=[u[0].value,i[0].value,h[0].value];1===m.length&&(N.syntaxFlags.add(_.HasAlpha),n(m[0])?g.push(m[0].value):N.alpha=m[0]);const d=t(g,N);return!1!==d&&(N.channels=[d[0][4].value,d[1][4].value,d[2][4].value],4===d.length&&(N.alpha=d[3][4].value),N)}function hsl(e,a){{const a=hslCommaSeparated(e);if(!1!==a)return a}{const a=hslSpaceSeparated(e);if(!1!==a)return a}return!1}function hslCommaSeparated(e){return threeChannelLegacySyntax(e,normalize_legacy_HSL_ChannelValues,N.HSL,[_.LegacyHSL])}function hslSpaceSeparated(e){return threeChannelSpaceSeparated(e,normalize_modern_HSL_ChannelValues,N.HSL,[])}function normalize_HWB_ChannelValues(e,a){const n=[];for(let r=0;r<e.length;r++){const o=e[r];if(o[0]!==l.Ident||"none"!==toLowerCaseAZ(o[4].value))if(0!==r)if(o[0]!==l.Percentage){if(o[0]!==l.Number)return!1;{if(3!==r)return!1;const e=normalize(o[4].value,1,0,1);n.push([l.Number,e.toString(),o[2],o[3],{value:e,type:s.Number}])}}else{3===r?a.syntaxFlags.add(_.HasPercentageAlpha):a.syntaxFlags.add(_.HasPercentageValues);let e=normalize(o[4].value,1,0,100);3===r&&(e=normalize(o[4].value,100,0,1)),n.push([l.Number,e.toString(),o[2],o[3],{value:e,type:s.Number}])}else{const e=normalizeHue(o);if(!1===e)return!1;o[0]===l.Dimension&&a.syntaxFlags.add(_.HasDimensionValues),n.push(e)}else a.syntaxFlags.add(_.HasNoneKeywords),n.push([l.Number,"none",o[2],o[3],{value:NaN,type:s.Number}])}return n}const d=new Map;for(const[e,a]of Object.entries(u))d.set(e,a);function namedColor(e){const a=d.get(toLowerCaseAZ(e));return!!a&&{colorNotation:N.RGB,channels:[a[0]/255,a[1]/255,a[2]/255],alpha:1,syntaxFlags:new Set([_.ColorKeyword,_.NamedColor])}}function normalize_legacy_sRGB_ChannelValues(e,a){const n=[];for(let r=0;r<e.length;r++){const o=e[r];if(o[0]!==l.Percentage){if(o[0]!==l.Number)return!1;{3!==r&&a.syntaxFlags.add(_.HasNumberValues);let e=normalize(o[4].value,255,0,1);3===r&&(e=normalize(o[4].value,1,0,1)),n.push([l.Number,e.toString(),o[2],o[3],{value:e,type:s.Number}])}}else{3===r?a.syntaxFlags.add(_.HasPercentageAlpha):a.syntaxFlags.add(_.HasPercentageValues);const e=normalize(o[4].value,100,0,1);n.push([l.Number,e.toString(),o[2],o[3],{value:e,type:s.Number}])}}return(!a.syntaxFlags.has(_.HasNumberValues)||!a.syntaxFlags.has(_.HasPercentageValues))&&n}function normalize_modern_sRGB_ChannelValues(e,a){const n=[];for(let r=0;r<e.length;r++){const o=e[r];if(o[0]!==l.Ident||"none"!==toLowerCaseAZ(o[4].value))if(o[0]!==l.Percentage){if(o[0]!==l.Number)return!1;{3!==r&&a.syntaxFlags.add(_.HasNumberValues);let e=normalize(o[4].value,255,0,1);3===r&&(e=normalize(o[4].value,1,0,1)),n.push([l.Number,e.toString(),o[2],o[3],{value:e,type:s.Number}])}}else{3!==r&&a.syntaxFlags.add(_.HasPercentageValues);const e=normalize(o[4].value,100,0,1);n.push([l.Number,e.toString(),o[2],o[3],{value:e,type:s.Number}])}else a.syntaxFlags.add(_.HasNoneKeywords),n.push([l.Number,"none",o[2],o[3],{value:NaN,type:s.Number}])}return n}function rgb(e,a){{const a=rgbCommaSeparated(e);if(!1!==a)return a}{const a=rgbSpaceSeparated(e);if(!1!==a)return a}return!1}function rgbCommaSeparated(e){return threeChannelLegacySyntax(e,normalize_legacy_sRGB_ChannelValues,N.RGB,[_.LegacyRGB])}function rgbSpaceSeparated(e){return threeChannelSpaceSeparated(e,normalize_modern_sRGB_ChannelValues,N.RGB,[])}function normalize_Lab_ChannelValues(e,a){const n=[];for(let r=0;r<e.length;r++){const o=e[r];if(o[0]!==l.Ident||"none"!==toLowerCaseAZ(o[4].value))if(o[0]!==l.Percentage){if(o[0]!==l.Number)return!1;{3!==r&&a.syntaxFlags.add(_.HasNumberValues);let e=normalize(o[4].value,1,0,100);1===r||2===r?e=normalize(o[4].value,1,-1/0,1/0):3===r&&(e=normalize(o[4].value,1,0,1)),n.push([l.Number,e.toString(),o[2],o[3],{value:o[4].value,type:s.Number}])}}else{3!==r&&a.syntaxFlags.add(_.HasPercentageValues);let e=normalize(o[4].value,1,0,100);1===r||2===r?e=normalize(o[4].value,.8,-1/0,1/0):3===r&&(e=normalize(o[4].value,100,0,1)),n.push([l.Number,e.toString(),o[2],o[3],{value:e,type:s.Number}])}else a.syntaxFlags.add(_.HasNoneKeywords),n.push([l.Number,"none",o[2],o[3],{value:NaN,type:s.Number}])}return n}const f=new Set(["srgb","srgb-linear","lab","oklab","xyz","xyz-d50","xyz-d65"]),y=new Set(["hsl","hwb","lch","oklch"]),v=new Set(["shorter","longer","increasing","decreasing"]);function colorMix(r,o){let t=null,s=null,c=null,u=!1;for(let i=0;i<r.value.length;i++){const h=r.value[i];if(!e(h)&&!a(h)){if(n(h)&&h.value[0]===l.Ident){if(!t&&"in"===toLowerCaseAZ(h.value[4].value)){t=h;continue}if(t&&!s){s=toLowerCaseAZ(h.value[4].value);continue}if(t&&s&&!c&&y.has(s)){c=toLowerCaseAZ(h.value[4].value);continue}if(t&&s&&c&&!u&&"hue"===toLowerCaseAZ(h.value[4].value)){u=!0;continue}return!1}return!(!n(h)||h.value[0]!==l.Comma)&&(!!s&&(c||u?!!(s&&c&&u&&y.has(s)&&v.has(c))&&colorMixPolar(s,c,colorMixComponents(r.value.slice(i+1),o)):f.has(s)?colorMixRectangular(s,colorMixComponents(r.value.slice(i+1),o)):!!y.has(s)&&colorMixPolar(s,"shorter",colorMixComponents(r.value.slice(i+1),o))))}}return!1}function colorMixComponents(o,t){const s=[];let c=1,u=!1,i=!1;for(let c=0;c<o.length;c++){let h=o[c];if(!e(h)&&!a(h))if(n(h)&&h.value[0]===l.Comma){if(!u)return!1;s.push({color:u,percentage:i}),u=!1,i=!1}else{if(!u){const e=t(h);if(e){u=e;continue}}if(i||(r(h)&&"calc"===toLowerCaseAZ(h.getName())&&([[h]]=p([[h]],{toCanonicalUnits:!0,precision:100})),!(n(h)&&h.value[0]===l.Percentage&&h.value[4].value>=0)))return!1;i=h.value[4].value}}if(u&&s.push({color:u,percentage:i}),2!==s.length)return!1;let h=s[0].percentage,m=s[1].percentage;return(!1===h||!(h<0||h>100))&&((!1===m||!(m<0||m>100))&&(!1===h&&!1===m?(h=50,m=50):!1!==h&&!1===m?m=100-h:!1===h&&!1!==m&&(h=100-m),(0!==h||0!==m)&&(!1!==h&&!1!==m&&(h+m>100&&(h=h/(h+m)*100,m=m/(h+m)*100),h+m<100&&(c=(h+m)/100,h=h/(h+m)*100,m=m/(h+m)*100),{a:{color:s[0].color,percentage:h},b:{color:s[1].color,percentage:m},alphaMultiplier:c}))))}function colorMixRectangular(e,a){if(!a)return!1;const n=a.a.color,r=a.b.color,o=a.a.percentage/100;let t=n.channels,l=r.channels,s=N.RGB,c=n.alpha;if("number"!=typeof c)return!1;let u=r.alpha;if("number"!=typeof u)return!1;switch(c=Number.isNaN(c)?u:c,u=Number.isNaN(u)?c:u,e){case"srgb":s=N.RGB,n.colorNotation!==N.RGB&&(t=colorDataTo(n,N.RGB).channels),r.colorNotation!==N.RGB&&(l=colorDataTo(r,N.RGB).channels);break;case"srgb-linear":s=N.Linear_RGB,n.colorNotation!==N.Linear_RGB&&(t=colorDataTo(n,N.Linear_RGB).channels),r.colorNotation!==N.Linear_RGB&&(l=colorDataTo(r,N.Linear_RGB).channels);break;case"lab":s=N.Lab,n.colorNotation!==N.Lab&&(t=colorDataTo(n,N.Lab).channels),r.colorNotation!==N.Lab&&(l=colorDataTo(r,N.Lab).channels);break;case"oklab":s=N.OKLab,n.colorNotation!==N.OKLab&&(t=colorDataTo(n,N.OKLab).channels),r.colorNotation!==N.OKLab&&(l=colorDataTo(r,N.OKLab).channels);break;case"xyz-d50":s=N.XYZ_D50,n.colorNotation!==N.XYZ_D50&&(t=colorDataTo(n,N.XYZ_D50).channels),r.colorNotation!==N.XYZ_D50&&(l=colorDataTo(r,N.XYZ_D50).channels);break;case"xyz":case"xyz-d65":s=N.XYZ_D65,n.colorNotation!==N.XYZ_D65&&(t=colorDataTo(n,N.XYZ_D65).channels),r.colorNotation!==N.XYZ_D65&&(l=colorDataTo(r,N.XYZ_D65).channels)}t=fillInMissingComponents(t,l),l=fillInMissingComponents(l,t),t[0]=premultiply(t[0],c),t[1]=premultiply(t[1],c),t[2]=premultiply(t[2],c),l[0]=premultiply(l[0],u),l[1]=premultiply(l[1],u),l[2]=premultiply(l[2],u);const i=interpolate(c,u,o);return{colorNotation:s,channels:[un_premultiply(interpolate(t[0],l[0],o),i),un_premultiply(interpolate(t[1],l[1],o),i),un_premultiply(interpolate(t[2],l[2],o),i)],alpha:i*a.alphaMultiplier,syntaxFlags:new Set([_.ColorMix])}}function colorMixPolar(e,a,n){if(!n)return!1;const r=n.a.color,o=n.b.color,t=n.a.percentage/100;let l=r.channels,s=o.channels,c=0,u=0,i=0,h=0,m=0,p=0,b=N.RGB,g=r.alpha;if("number"!=typeof g)return!1;let d=o.alpha;if("number"!=typeof d)return!1;switch(g=Number.isNaN(g)?d:g,d=Number.isNaN(d)?g:d,e){case"hsl":b=N.HSL,r.colorNotation!==N.HSL&&(l=colorDataTo(r,N.HSL).channels),o.colorNotation!==N.HSL&&(s=colorDataTo(o,N.HSL).channels);break;case"hwb":b=N.HWB,r.colorNotation!==N.HWB&&(l=colorDataTo(r,N.HWB).channels),o.colorNotation!==N.HWB&&(s=colorDataTo(o,N.HWB).channels);break;case"lch":b=N.LCH,r.colorNotation!==N.LCH&&(l=colorDataTo(r,N.LCH).channels),o.colorNotation!==N.LCH&&(s=colorDataTo(o,N.LCH).channels);break;case"oklch":b=N.OKLCH,r.colorNotation!==N.OKLCH&&(l=colorDataTo(r,N.OKLCH).channels),o.colorNotation!==N.OKLCH&&(s=colorDataTo(o,N.OKLCH).channels)}switch(l=fillInMissingComponents(l,s),s=fillInMissingComponents(s,l),e){case"hsl":case"hwb":c=l[0],u=s[0],i=l[1],h=s[1],m=l[2],p=s[2];break;case"lch":case"oklch":i=l[0],h=s[0],m=l[1],p=s[1],c=l[2],u=s[2]}const f=u-c;switch(a){case"shorter":f>180?c+=360:f<-180&&(u+=360);break;case"longer":-180<f&&f<180&&(f>0?c+=360:u+=360);break;case"increasing":f<0&&(u+=360);break;case"decreasing":f>0&&(c+=360);break;default:throw new Error("Unknown hue interpolation method")}i=premultiply(i,g),m=premultiply(m,g),h=premultiply(h,d),p=premultiply(p,d);let y=[0,0,0];const v=interpolate(g,d,t);switch(e){case"hsl":case"hwb":y=[interpolate(c,u,t),un_premultiply(interpolate(i,h,t),v),un_premultiply(interpolate(m,p,t),v)];break;case"lch":case"oklch":y=[un_premultiply(interpolate(i,h,t),v),un_premultiply(interpolate(m,p,t),v),interpolate(c,u,t)]}return{colorNotation:b,channels:y,alpha:v*n.alphaMultiplier,syntaxFlags:new Set([_.ColorMix])}}function interpolate(e,a,n){return Number.isNaN(e)?a:Number.isNaN(a)?e:e*n+a*(1-n)}function premultiply(e,a){return Number.isNaN(a)?e:Number.isNaN(e)?NaN:e*a}function un_premultiply(e,a){return 0===a||Number.isNaN(a)?e:Number.isNaN(e)?NaN:e/a}function normalize_OKLab_ChannelValues(e,a){const n=[];for(let r=0;r<e.length;r++){const o=e[r];if(o[0]!==l.Ident||"none"!==toLowerCaseAZ(o[4].value))if(o[0]!==l.Percentage){if(o[0]!==l.Number)return!1;{3!==r&&a.syntaxFlags.add(_.HasNumberValues);let e=normalize(o[4].value,1,0,1);1===r||2===r?e=normalize(o[4].value,1,-1/0,1/0):3===r&&(e=normalize(o[4].value,1,0,1)),n.push([l.Number,e.toString(),o[2],o[3],{value:o[4].value,type:s.Number}])}}else{3!==r&&a.syntaxFlags.add(_.HasPercentageValues);let e=normalize(o[4].value,100,0,1);1===r||2===r?e=normalize(o[4].value,250,-1/0,1/0):3===r&&(e=normalize(o[4].value,100,0,1)),n.push([l.Number,e.toString(),o[2],o[3],{value:e,type:s.Number}])}else a.syntaxFlags.add(_.HasNoneKeywords),n.push([l.Number,"none",o[2],o[3],{value:NaN,type:s.Number}])}return n}function normalize_LCH_ChannelValues(e,a){const n=[];for(let r=0;r<e.length;r++){const o=e[r];if(o[0]!==l.Ident||"none"!==toLowerCaseAZ(o[4].value))if(2!==r)if(o[0]!==l.Percentage){if(o[0]!==l.Number)return!1;{3!==r&&a.syntaxFlags.add(_.HasNumberValues);let e=normalize(o[4].value,1,0,100);1===r?e=normalize(o[4].value,1,0,1/0):3===r&&(e=normalize(o[4].value,1,0,1)),n.push([l.Number,e.toString(),o[2],o[3],{value:o[4].value,type:s.Number}])}}else{3!==r&&a.syntaxFlags.add(_.HasPercentageValues);let e=normalize(o[4].value,1,0,100);1===r?e=normalize(o[4].value,100/150,0,1/0):3===r&&(e=normalize(o[4].value,100,0,1)),n.push([l.Number,e.toString(),o[2],o[3],{value:e,type:s.Number}])}else{const e=normalizeHue(o);if(!1===e)return!1;o[0]===l.Dimension&&a.syntaxFlags.add(_.HasDimensionValues),n.push(e)}else a.syntaxFlags.add(_.HasNoneKeywords),n.push([l.Number,"none",o[2],o[3],{value:NaN,type:s.Number}])}return n}function normalize_OKLCH_ChannelValues(e,a){const n=[];for(let r=0;r<e.length;r++){const o=e[r];if(o[0]!==l.Ident||"none"!==toLowerCaseAZ(o[4].value))if(2!==r)if(o[0]!==l.Percentage){if(o[0]!==l.Number)return!1;{3!==r&&a.syntaxFlags.add(_.HasNumberValues);let e=normalize(o[4].value,1,0,1);1===r?e=normalize(o[4].value,1,0,1/0):3===r&&(e=normalize(o[4].value,1,0,1)),n.push([l.Number,e.toString(),o[2],o[3],{value:o[4].value,type:s.Number}])}}else{3!==r&&a.syntaxFlags.add(_.HasPercentageValues);let e=normalize(o[4].value,100,0,1);1===r?e=normalize(o[4].value,250,0,1/0):3===r&&(e=normalize(o[4].value,100,0,1)),n.push([l.Number,e.toString(),o[2],o[3],{value:e,type:s.Number}])}else{const e=normalizeHue(o);if(!1===e)return!1;o[0]===l.Dimension&&a.syntaxFlags.add(_.HasDimensionValues),n.push(e)}else a.syntaxFlags.add(_.HasNoneKeywords),n.push([l.Number,"none",o[2],o[3],{value:NaN,type:s.Number}])}return n}function normalize_Color_ChannelValues(e,a){const n=[];for(let r=0;r<e.length;r++){const o=e[r];if(o[0]!==l.Ident||"none"!==toLowerCaseAZ(o[4].value))if(o[0]!==l.Percentage){if(o[0]!==l.Number)return!1;{3!==r&&a.syntaxFlags.add(_.HasNumberValues);let e=normalize(o[4].value,1,-1/0,1/0);3===r&&(e=normalize(o[4].value,1,0,1)),n.push([l.Number,e.toString(),o[2],o[3],{value:o[4].value,type:s.Number}])}}else{3!==r&&a.syntaxFlags.add(_.HasPercentageValues);let e=normalize(o[4].value,100,-1/0,1/0);3===r&&(e=normalize(o[4].value,100,0,1)),n.push([l.Number,e.toString(),o[2],o[3],{value:e,type:s.Number}])}else a.syntaxFlags.add(_.HasNoneKeywords),n.push([l.Number,"none",o[2],o[3],{value:NaN,type:s.Number}])}return n}const L=new Set(["srgb","srgb-linear","display-p3","a98-rgb","prophoto-rgb","rec2020","xyz","xyz-d50","xyz-d65"]);function color$1(r,t){for(let t=0;t<r.value.length;t++){const s=r.value[t];if(!e(s)&&!a(s)){if(n(s)&&s.value[0]===l.Ident){const e=toLowerCaseAZ(s.value[4].value);return!!L.has(e)&&threeChannelSpaceSeparated(new o(r.name,r.endToken,r.value.slice(t+1)),normalize_Color_ChannelValues,colorSpaceNameToColorNotation(e),[])}return!1}}return!1}function colorSpaceNameToColorNotation(e){switch(e){case"srgb":return N.RGB;case"srgb-linear":return N.Linear_RGB;case"display-p3":return N.Display_P3;case"a98-rgb":return N.A98_RGB;case"prophoto-rgb":return N.ProPhoto_RGB;case"rec2020":return N.Rec2020;case"xyz":case"xyz-d65":return N.XYZ_D65;case"xyz-d50":return N.XYZ_D50;default:throw new Error("Unknown color space name: "+e)}}function toPrecision(e,a=7){e=+e,a=+a;const n=(Math.floor(e)+"").length;if(a>n)return+e.toFixed(a-n);{const r=10**(n-a);return Math.round(e/r)*r}}function serializeRGB(e){let a=e.channels.map((e=>Number.isNaN(e)?0:e));e.colorNotation!==N.RGB&&e.colorNotation!==N.HEX&&(a=XYZ_D50_to_sRGB_Gamut(colorData_to_XYZ_D50(e).channels));const n=Math.min(255,Math.max(0,Math.round(255*toPrecision(a[0])))),r=Math.min(255,Math.max(0,Math.round(255*toPrecision(a[1])))),c=Math.min(255,Math.max(0,Math.round(255*toPrecision(a[2])))),u=[l.CloseParen,")",-1,-1,void 0],i=[l.Whitespace," ",-1,-1,void 0],h=[l.Comma,",",-1,-1,void 0],m=[new t([l.Number,n.toString(),-1,-1,{value:a[0],type:s.Integer}]),new t(h),new t(i),new t([l.Number,r.toString(),-1,-1,{value:a[1],type:s.Integer}]),new t(h),new t(i),new t([l.Number,c.toString(),-1,-1,{value:a[2],type:s.Integer}])];if("number"==typeof e.alpha){const a=Math.min(1,Math.max(0,toPrecision(Number.isNaN(e.alpha)?0:e.alpha)));return 1===a?new o([l.Function,"rgb(",-1,-1,{value:"rgb"}],u,m):new o([l.Function,"rgba(",-1,-1,{value:"rgba"}],u,[...m,new t(h),new t(i),new t([l.Number,a.toString(),-1,-1,{value:e.alpha,type:s.Integer}])])}return new o([l.Function,"rgba(",-1,-1,{value:"rgba"}],u,[...m,new t(h),new t(i),e.alpha])}function XYZ_D50_to_sRGB_Gamut(e){const a=c.XYZ_D50_to_sRGB(e);if(i.inGamut(a))return i.clip(a);let n=e.slice();return n=h.D50_to_D65(n),n=h.XYZ_to_OKLab(n),n=h.OKLab_to_OKLCH(n),n[0]<1e-6&&(n=[0,0,0]),n[0]>.999999&&(n=[1,0,0]),m.mapGamut(n,(e=>(e=h.OKLCH_to_OKLab(e),e=h.OKLab_to_XYZ(e),e=h.XYZ_to_lin_sRGB(e),h.gam_sRGB(e))),(e=>(e=h.lin_sRGB(e),e=h.lin_sRGB_to_XYZ(e),e=h.XYZ_to_OKLab(e),h.OKLab_to_OKLCH(e))))}function serializeP3(e){let a=e.channels.map((e=>Number.isNaN(e)?0:e));e.colorNotation!==N.RGB&&e.colorNotation!==N.HEX&&(a=XYZ_D50_to_P3_Gamut(colorData_to_XYZ_D50(e).channels));const n=toPrecision(a[0],6),r=toPrecision(a[1],6),c=toPrecision(a[2],6),u=[l.Function,"color(",-1,-1,{value:"color"}],i=[l.CloseParen,")",-1,-1,void 0],h=[l.Whitespace," ",-1,-1,void 0],m=[new t([l.Ident,"display-p3",-1,-1,{value:"display-p3"}]),new t(h),new t([l.Number,n.toString(),-1,-1,{value:a[0],type:s.Number}]),new t(h),new t([l.Number,r.toString(),-1,-1,{value:a[1],type:s.Number}]),new t(h),new t([l.Number,c.toString(),-1,-1,{value:a[2],type:s.Number}])];if("number"==typeof e.alpha){const a=Math.min(1,Math.max(0,toPrecision(Number.isNaN(e.alpha)?0:e.alpha)));return new o(u,i,1===a?m:[...m,new t(h),new t([l.Delim,"/",-1,-1,{value:"/"}]),new t(h),new t([l.Number,a.toString(),-1,-1,{value:e.alpha,type:s.Integer}])])}return new o(u,i,[...m,new t(h),new t([l.Delim,"/",-1,-1,{value:"/"}]),new t(h),e.alpha])}function XYZ_D50_to_P3_Gamut(e){const a=c.XYZ_D50_to_P3(e);if(i.inGamut(a))return i.clip(a);let n=e.slice();return n=h.D50_to_D65(n),n=h.XYZ_to_OKLab(n),n=h.OKLab_to_OKLCH(n),n[0]<1e-6&&(n=[0,0,0]),n[0]>.999999&&(n=[1,0,0]),m.mapGamut(n,(e=>(e=h.OKLCH_to_OKLab(e),e=h.OKLab_to_XYZ(e),e=h.XYZ_to_lin_P3(e),h.gam_P3(e))),(e=>(e=h.lin_P3(e),e=h.lin_P3_to_XYZ(e),e=h.XYZ_to_OKLab(e),h.OKLab_to_OKLCH(e))))}function color(e){if(r(e)){switch(toLowerCaseAZ(e.getName())){case"rgb":case"rgba":return rgb(e);case"hsl":case"hsla":return hsl(e);case"hwb":return threeChannelSpaceSeparated(e,normalize_HWB_ChannelValues,N.HWB,[]);case"lab":return threeChannelSpaceSeparated(e,normalize_Lab_ChannelValues,N.Lab,[]);case"lch":return threeChannelSpaceSeparated(e,normalize_LCH_ChannelValues,N.LCH,[]);case"oklab":return threeChannelSpaceSeparated(e,normalize_OKLab_ChannelValues,N.OKLab,[]);case"oklch":return threeChannelSpaceSeparated(e,normalize_OKLCH_ChannelValues,N.OKLCH,[]);case"color":return color$1(e);case"color-mix":return colorMix(e,color);default:return!1}}if(n(e)){if(e.value[0]===l.Hash)return hex(e.value);if(e.value[0]===l.Ident){const a=namedColor(e.value[4].value);if(!1!==a)return a;const n="transparent"===toLowerCaseAZ(e.value[4].value)&&{colorNotation:N.RGB,channels:[0,0,0],alpha:0,syntaxFlags:new Set([_.ColorKeyword])};return!1!==n&&n}return!1}return!1}export{N as ColorNotation,_ as SyntaxFlag,color,serializeP3,serializeRGB};
