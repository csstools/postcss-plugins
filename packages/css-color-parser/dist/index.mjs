import{TokenType as e,NumberType as a}from"@csstools/css-tokenizer";import{xyz as n,namedColors as o,utils as r,conversions as t,calculations as l}from"@csstools/color-helpers";import{isWhitespaceNode as s,isCommentNode as u,isTokenNode as c,isFunctionNode as i,TokenNode as h,FunctionNode as m}from"@csstools/css-parser-algorithms";import{mathFunctionNames as p,calcFromComponentValues as N}from"@csstools/css-calc";var b,_;function colorData_to_XYZ_D50(e){switch(e.colorNotation){case b.HEX:case b.RGB:case b.sRGB:return{...e,colorNotation:b.XYZ_D50,channels:n.sRGB_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case b.Linear_sRGB:return{...e,colorNotation:b.XYZ_D50,channels:n.lin_sRGB_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case b.Display_P3:return{...e,colorNotation:b.XYZ_D50,channels:n.P3_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case b.Rec2020:return{...e,colorNotation:b.XYZ_D50,channels:n.rec_2020_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case b.A98_RGB:return{...e,colorNotation:b.XYZ_D50,channels:n.a98_RGB_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case b.ProPhoto_RGB:return{...e,colorNotation:b.XYZ_D50,channels:n.ProPhoto_RGB_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case b.HSL:return{...e,colorNotation:b.XYZ_D50,channels:n.HSL_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case b.HWB:return{...e,colorNotation:b.XYZ_D50,channels:n.HWB_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case b.Lab:return{...e,colorNotation:b.XYZ_D50,channels:n.Lab_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case b.OKLab:return{...e,colorNotation:b.XYZ_D50,channels:n.OKLab_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case b.LCH:return{...e,colorNotation:b.XYZ_D50,channels:n.LCH_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case b.OKLCH:return{...e,colorNotation:b.XYZ_D50,channels:n.OKLCH_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case b.XYZ_D50:return{...e,colorNotation:b.XYZ_D50,channels:n.XYZ_D50_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case b.XYZ_D65:return{...e,colorNotation:b.XYZ_D50,channels:n.XYZ_D65_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};default:throw new Error("Unsupported color notation")}}!function(e){e.A98_RGB="a98-rgb",e.Display_P3="display-p3",e.HEX="hex",e.HSL="hsl",e.HWB="hwb",e.LCH="lch",e.Lab="lab",e.Linear_sRGB="srgb-linear",e.OKLCH="oklch",e.OKLab="oklab",e.ProPhoto_RGB="prophoto-rgb",e.RGB="rgb",e.sRGB="srgb",e.Rec2020="rec2020",e.XYZ_D50="xyz-d50",e.XYZ_D65="xyz-d65"}(b||(b={})),function(e){e.ColorKeyword="color-keyword",e.HasAlpha="has-alpha",e.HasDimensionValues="has-dimension-values",e.HasNoneKeywords="has-none-keywords",e.HasNumberValues="has-number-values",e.HasPercentageAlpha="has-percentage-alpha",e.HasPercentageValues="has-percentage-values",e.HasVariableAlpha="has-variable-alpha",e.Hex="hex",e.LegacyHSL="legacy-hsl",e.LegacyRGB="legacy-rgb",e.NamedColor="named-color",e.RelativeColorSyntax="relative-color-syntax",e.ColorMix="color-mix"}(_||(_={}));const g=new Set([b.A98_RGB,b.Display_P3,b.HEX,b.Linear_sRGB,b.ProPhoto_RGB,b.RGB,b.sRGB,b.Rec2020,b.XYZ_D50,b.XYZ_D65]);function colorDataTo(e,a){const o=colorData_to_XYZ_D50(e),r={...e};switch(a){case b.HEX:case b.RGB:r.colorNotation=b.RGB,r.channels=n.XYZ_D50_to_sRGB(o.channels);break;case b.sRGB:r.colorNotation=b.sRGB,r.channels=n.XYZ_D50_to_sRGB(o.channels);break;case b.Linear_sRGB:r.colorNotation=b.Linear_sRGB,r.channels=n.XYZ_D50_to_lin_sRGB(o.channels);break;case b.Display_P3:r.colorNotation=b.Display_P3,r.channels=n.XYZ_D50_to_P3(o.channels);break;case b.Rec2020:r.colorNotation=b.Rec2020,r.channels=n.XYZ_D50_to_rec_2020(o.channels);break;case b.ProPhoto_RGB:r.colorNotation=b.ProPhoto_RGB,r.channels=n.XYZ_D50_to_ProPhoto(o.channels);break;case b.A98_RGB:r.colorNotation=b.A98_RGB,r.channels=n.XYZ_D50_to_a98_RGB(o.channels);break;case b.HSL:r.colorNotation=b.HSL,r.channels=n.XYZ_D50_to_HSL(o.channels);break;case b.HWB:r.colorNotation=b.HWB,r.channels=n.XYZ_D50_to_HWB(o.channels);break;case b.Lab:r.colorNotation=b.Lab,r.channels=n.XYZ_D50_to_Lab(o.channels);break;case b.LCH:r.colorNotation=b.LCH,r.channels=n.XYZ_D50_to_LCH(o.channels);break;case b.OKLCH:r.colorNotation=b.OKLCH,r.channels=n.XYZ_D50_to_OKLCH(o.channels);break;case b.OKLab:r.colorNotation=b.OKLab,r.channels=n.XYZ_D50_to_OKLab(o.channels);break;case b.XYZ_D50:r.colorNotation=b.XYZ_D50,r.channels=n.XYZ_D50_to_XYZ_D50(o.channels);break;case b.XYZ_D65:r.colorNotation=b.XYZ_D65,r.channels=n.XYZ_D50_to_XYZ_D65(o.channels);break;default:throw new Error("Unsupported color notation")}if(a===e.colorNotation)r.channels=carryForwardMissingComponents(e.channels,[0,1,2],r.channels,[0,1,2]);else if(g.has(a)&&g.has(e.colorNotation))r.channels=carryForwardMissingComponents(e.channels,[0,1,2],r.channels,[0,1,2]);else switch(a){case b.HSL:switch(e.colorNotation){case b.HWB:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[0]);break;case b.Lab:case b.OKLab:r.channels=carryForwardMissingComponents(e.channels,[2],r.channels,[0]);break;case b.LCH:case b.OKLCH:r.channels=carryForwardMissingComponents(e.channels,[0,1,2],r.channels,[2,1,0])}break;case b.HWB:switch(e.colorNotation){case b.HSL:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[0]);break;case b.LCH:case b.OKLCH:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[2])}break;case b.Lab:case b.OKLab:switch(e.colorNotation){case b.HSL:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[2]);break;case b.Lab:case b.OKLab:case b.LCH:case b.OKLCH:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[0])}break;case b.LCH:case b.OKLCH:switch(e.colorNotation){case b.HSL:r.channels=carryForwardMissingComponents(e.channels,[0,1,2],r.channels,[2,1,0]);break;case b.HWB:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[2]);break;case b.Lab:case b.OKLab:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[0]);break;case b.LCH:case b.OKLCH:r.channels=carryForwardMissingComponents(e.channels,[0,1,2],r.channels,[0,1,2])}}return r.channels=convertPowerlessComponentsToMissingComponents(r.channels,a),r}function convertPowerlessComponentsToMissingComponents(e,a){const n=[...e];switch(a){case b.HSL:(reducePrecision(n[2])<=0||reducePrecision(n[2])>=100)&&(n[0]=NaN,n[1]=NaN),n[1]<=0&&(n[0]=NaN);break;case b.HWB:Math.max(0,reducePrecision(n[1]))+Math.max(0,reducePrecision(n[2]))>=100&&(n[0]=NaN);break;case b.Lab:(reducePrecision(n[0])<=0||reducePrecision(n[0])>=100)&&(n[1]=NaN,n[2]=NaN);break;case b.LCH:reducePrecision(n[1])<=0&&(n[2]=NaN),(reducePrecision(n[0])<=0||reducePrecision(n[0])>=100)&&(n[1]=NaN,n[2]=NaN);break;case b.OKLab:(reducePrecision(n[0])<=0||reducePrecision(n[0])>=1)&&(n[1]=NaN,n[2]=NaN);break;case b.OKLCH:reducePrecision(n[1])<=0&&(n[2]=NaN),(reducePrecision(n[0])<=0||reducePrecision(n[0])>=1)&&(n[1]=NaN,n[2]=NaN)}return n}function carryForwardMissingComponents(e,a,n,o){const r=[...n];for(const n of a)Number.isNaN(e[a[n]])&&(r[o[n]]=NaN);return r}function fillInMissingComponents(e,a){const n=[...e];for(let o=0;o<e.length;o++)Number.isNaN(e[o])&&(n[o]=a[o]);return n}function normalizeRelativeColorDataChannels(e){const a=new Map;switch(e.colorNotation){case b.RGB:case b.HEX:a.set("r",dummyNumberToken(255*e.channels[0])),a.set("g",dummyNumberToken(255*e.channels[1])),a.set("b",dummyNumberToken(255*e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha));break;case b.HSL:a.set("h",dummyAngleToken(e.channels[0])),a.set("s",dummyPercentageToken(e.channels[1])),a.set("l",dummyPercentageToken(e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha));break;case b.HWB:a.set("h",dummyAngleToken(e.channels[0])),a.set("w",dummyPercentageToken(e.channels[1])),a.set("b",dummyPercentageToken(e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha));break;case b.Lab:case b.OKLab:a.set("l",dummyNumberToken(e.channels[0])),a.set("a",dummyNumberToken(e.channels[1])),a.set("b",dummyNumberToken(e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha));break;case b.LCH:case b.OKLCH:a.set("l",dummyNumberToken(e.channels[0])),a.set("c",dummyNumberToken(e.channels[1])),a.set("h",dummyAngleToken(e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha));break;case b.sRGB:case b.A98_RGB:case b.Display_P3:case b.Rec2020:case b.Linear_sRGB:case b.ProPhoto_RGB:a.set("r",dummyNumberToken(e.channels[0])),a.set("g",dummyNumberToken(e.channels[1])),a.set("b",dummyNumberToken(e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha));break;case b.XYZ_D50:case b.XYZ_D65:a.set("x",dummyNumberToken(e.channels[0])),a.set("y",dummyNumberToken(e.channels[1])),a.set("z",dummyNumberToken(e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha))}return a}function noneToZeroInRelativeColorDataChannels(e){const a=new Map;for(const[n,o]of e)Number.isNaN(o[4].value)?a.set(n,dummyNumberToken(0)):a.set(n,o);return a}function dummyNumberToken(n){return[e.Number,n.toString(),-1,-1,{value:n,type:a.Number}]}function dummyPercentageToken(a){return[e.Percentage,a.toString(),-1,-1,{value:a}]}function dummyAngleToken(n){return[e.Dimension,n.toString(),-1,-1,{value:n,type:a.Number,unit:"deg"}]}function reducePrecision(e,a=7){const n=Math.pow(10,a);return Math.round(e*n)/n}function colorDataFitsRGB_Gamut(e){return!colorDataTo(e,b.RGB).channels.find((e=>e<-1e-5||e>1.00001))}function normalize(e,a,n,o){return Math.min(Math.max(e/a,n),o)}const v=/[A-Z]/g;function toLowerCaseAZ(e){return e.replace(v,(e=>String.fromCharCode(e.charCodeAt(0)+32)))}function normalize_Color_ChannelValues(n,o){const r=[];for(let t=0;t<n.length;t++){const l=n[t];if(l[0]!==e.Ident||"none"!==toLowerCaseAZ(l[4].value))if(l[0]!==e.Percentage){if(l[0]!==e.Number)return!1;{3!==t&&o.syntaxFlags.add(_.HasNumberValues);let n=normalize(l[4].value,1,-1/0,1/0);3===t&&(n=normalize(l[4].value,1,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:l[4].value,type:a.Number}])}}else{3!==t&&o.syntaxFlags.add(_.HasPercentageValues);let n=normalize(l[4].value,100,-1/0,1/0);3===t&&(n=normalize(l[4].value,100,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}else o.syntaxFlags.add(_.HasNoneKeywords),r.push([e.Number,"none",l[2],l[3],{value:NaN,type:a.Number}])}return r}const d=new Set(["srgb","srgb-linear","display-p3","a98-rgb","prophoto-rgb","rec2020","xyz","xyz-d50","xyz-d65"]);function color$1(a,n){const o=[],r=[],t=[],l=[];let m,g,v=!1,f=!1;const y={colorNotation:b.sRGB,channels:[0,0,0],alpha:1,syntaxFlags:new Set([])};let C=o;for(let b=0;b<a.value.length;b++){let L=a.value[b];if(s(L)||u(L))for(;s(a.value[b+1])||u(a.value[b+1]);)b++;else if(C===o&&o.length&&(C=r),C===r&&r.length&&(C=t),c(L)&&L.value[0]===e.Delim&&"/"===L.value[4].value){if(C===l)return!1;C=l}else{if(i(L)){if(C===l&&"var"===toLowerCaseAZ(L.getName())){y.syntaxFlags.add(_.HasVariableAlpha),C.push(L);continue}if(!p.has(toLowerCaseAZ(L.getName())))return!1;const[[a]]=N([[L]],{toCanonicalUnits:!0,precision:100,globals:g});if(!a||!c(a)||(a.value[0]===e.Percentage||a.value[0]===e.Number||a.value[0]===e.Dimension)&&Number.isNaN(a.value[4].value))return!1;L=a}if(C===o&&0===o.length&&c(L)&&L.value[0]===e.Ident&&d.has(toLowerCaseAZ(L.value[4].value))){if(v)return!1;v=toLowerCaseAZ(L.value[4].value),y.colorNotation=colorSpaceNameToColorNotation(v),f&&(f.colorNotation!==y.colorNotation&&(f=colorDataTo(f,y.colorNotation)),m=normalizeRelativeColorDataChannels(f),g=noneToZeroInRelativeColorDataChannels(m))}else if(C===o&&0===o.length&&c(L)&&L.value[0]===e.Ident&&"from"===toLowerCaseAZ(L.value[4].value)){if(f)return!1;if(v)return!1;for(;s(a.value[b+1])||u(a.value[b+1]);)b++;if(b++,L=a.value[b],f=n(L),!1===f)return!1}else{if(!c(L))return!1;if(L.value[0]===e.Ident&&m&&m.has(toLowerCaseAZ(L.value[4].value))){C.push(new h(m.get(toLowerCaseAZ(L.value[4].value))));continue}C.push(L)}}}if(!v)return!1;if(1!==C.length)return!1;if(1!==o.length||1!==r.length||1!==t.length)return!1;if(!c(o[0])||!c(r[0])||!c(t[0]))return!1;const L=[o[0].value,r[0].value,t[0].value];1===l.length?(y.syntaxFlags.add(_.HasAlpha),c(l[0])?L.push(l[0].value):y.alpha=l[0]):m&&m.has("alpha")&&L.push(m.get("alpha"));const H=normalize_Color_ChannelValues(L,y);return!1!==H&&(y.channels=[H[0][4].value,H[1][4].value,H[2][4].value],4===H.length&&(y.alpha=H[3][4].value),y)}function colorSpaceNameToColorNotation(e){switch(e){case"srgb":return b.sRGB;case"srgb-linear":return b.Linear_sRGB;case"display-p3":return b.Display_P3;case"a98-rgb":return b.A98_RGB;case"prophoto-rgb":return b.ProPhoto_RGB;case"rec2020":return b.Rec2020;case"xyz":case"xyz-d65":return b.XYZ_D65;case"xyz-d50":return b.XYZ_D50;default:throw new Error("Unknown color space name: "+e)}}const f=new Set(["srgb","srgb-linear","lab","oklab","xyz","xyz-d50","xyz-d65"]),y=new Set(["hsl","hwb","lch","oklch"]),C=new Set(["shorter","longer","increasing","decreasing"]);function colorMix(a,n){let o=null,r=null,t=null,l=!1;for(let i=0;i<a.value.length;i++){const h=a.value[i];if(!s(h)&&!u(h)){if(c(h)&&h.value[0]===e.Ident){if(!o&&"in"===toLowerCaseAZ(h.value[4].value)){o=h;continue}if(o&&!r){r=toLowerCaseAZ(h.value[4].value);continue}if(o&&r&&!t&&y.has(r)){t=toLowerCaseAZ(h.value[4].value);continue}if(o&&r&&t&&!l&&"hue"===toLowerCaseAZ(h.value[4].value)){l=!0;continue}return!1}return!(!c(h)||h.value[0]!==e.Comma)&&(!!r&&(t||l?!!(r&&t&&l&&y.has(r)&&C.has(t))&&colorMixPolar(r,t,colorMixComponents(a.value.slice(i+1),n)):f.has(r)?colorMixRectangular(r,colorMixComponents(a.value.slice(i+1),n)):!!y.has(r)&&colorMixPolar(r,"shorter",colorMixComponents(a.value.slice(i+1),n))))}}return!1}function colorMixComponents(a,n){const o=[];let r=1,t=!1,l=!1;for(let r=0;r<a.length;r++){let h=a[r];if(!s(h)&&!u(h)){if(!c(h)||h.value[0]!==e.Comma){if(!t){const e=n(h);if(e){t=e;continue}}if(!l){if(i(h)&&p.has(toLowerCaseAZ(h.getName()))&&([[h]]=N([[h]],{toCanonicalUnits:!0,precision:100}),!h||!c(h)||(h.value[0]===e.Percentage||h.value[0]===e.Number||h.value[0]===e.Dimension)&&Number.isNaN(h.value[4].value)))return!1;if(c(h)&&h.value[0]===e.Percentage&&h.value[4].value>=0){l=h.value[4].value;continue}}return!1}if(!t)return!1;o.push({color:t,percentage:l}),t=!1,l=!1}}if(t&&o.push({color:t,percentage:l}),2!==o.length)return!1;let h=o[0].percentage,m=o[1].percentage;return(!1===h||!(h<0||h>100))&&((!1===m||!(m<0||m>100))&&(!1===h&&!1===m?(h=50,m=50):!1!==h&&!1===m?m=100-h:!1===h&&!1!==m&&(h=100-m),(0!==h||0!==m)&&(!1!==h&&!1!==m&&(h+m>100&&(h=h/(h+m)*100,m=m/(h+m)*100),h+m<100&&(r=(h+m)/100,h=h/(h+m)*100,m=m/(h+m)*100),{a:{color:o[0].color,percentage:h},b:{color:o[1].color,percentage:m},alphaMultiplier:r}))))}function colorMixRectangular(e,a){if(!a)return!1;const n=a.a.color,o=a.b.color,r=a.a.percentage/100;let t=n.channels,l=o.channels,s=b.RGB,u=n.alpha;if("number"!=typeof u)return!1;let c=o.alpha;if("number"!=typeof c)return!1;switch(u=Number.isNaN(u)?c:u,c=Number.isNaN(c)?u:c,e){case"srgb":s=b.RGB,n.colorNotation!==b.RGB&&n.colorNotation!==b.sRGB&&n.colorNotation!==b.HEX&&(t=colorDataTo(n,b.RGB).channels),o.colorNotation!==b.RGB&&o.colorNotation!==b.sRGB&&o.colorNotation!==b.HEX&&(l=colorDataTo(o,b.RGB).channels);break;case"srgb-linear":s=b.Linear_sRGB,n.colorNotation!==b.Linear_sRGB&&(t=colorDataTo(n,b.Linear_sRGB).channels),o.colorNotation!==b.Linear_sRGB&&(l=colorDataTo(o,b.Linear_sRGB).channels);break;case"lab":s=b.Lab,n.colorNotation!==b.Lab&&(t=colorDataTo(n,b.Lab).channels),o.colorNotation!==b.Lab&&(l=colorDataTo(o,b.Lab).channels);break;case"oklab":s=b.OKLab,n.colorNotation!==b.OKLab&&(t=colorDataTo(n,b.OKLab).channels),o.colorNotation!==b.OKLab&&(l=colorDataTo(o,b.OKLab).channels);break;case"xyz-d50":s=b.XYZ_D50,n.colorNotation!==b.XYZ_D50&&(t=colorDataTo(n,b.XYZ_D50).channels),o.colorNotation!==b.XYZ_D50&&(l=colorDataTo(o,b.XYZ_D50).channels);break;case"xyz":case"xyz-d65":s=b.XYZ_D65,n.colorNotation!==b.XYZ_D65&&(t=colorDataTo(n,b.XYZ_D65).channels),o.colorNotation!==b.XYZ_D65&&(l=colorDataTo(o,b.XYZ_D65).channels)}t=fillInMissingComponents(t,l),l=fillInMissingComponents(l,t),t[0]=premultiply(t[0],u),t[1]=premultiply(t[1],u),t[2]=premultiply(t[2],u),l[0]=premultiply(l[0],c),l[1]=premultiply(l[1],c),l[2]=premultiply(l[2],c);const i=interpolate(u,c,r);return{colorNotation:s,channels:[un_premultiply(interpolate(t[0],l[0],r),i),un_premultiply(interpolate(t[1],l[1],r),i),un_premultiply(interpolate(t[2],l[2],r),i)],alpha:i*a.alphaMultiplier,syntaxFlags:new Set([_.ColorMix])}}function colorMixPolar(e,a,n){if(!n)return!1;const o=n.a.color,r=n.b.color,t=n.a.percentage/100;let l=o.channels,s=r.channels,u=0,c=0,i=0,h=0,m=0,p=0,N=b.RGB,g=o.alpha;if("number"!=typeof g)return!1;let v=r.alpha;if("number"!=typeof v)return!1;switch(g=Number.isNaN(g)?v:g,v=Number.isNaN(v)?g:v,e){case"hsl":N=b.HSL,o.colorNotation!==b.HSL&&(l=colorDataTo(o,b.HSL).channels),r.colorNotation!==b.HSL&&(s=colorDataTo(r,b.HSL).channels);break;case"hwb":N=b.HWB,o.colorNotation!==b.HWB&&(l=colorDataTo(o,b.HWB).channels),r.colorNotation!==b.HWB&&(s=colorDataTo(r,b.HWB).channels);break;case"lch":N=b.LCH,o.colorNotation!==b.LCH&&(l=colorDataTo(o,b.LCH).channels),r.colorNotation!==b.LCH&&(s=colorDataTo(r,b.LCH).channels);break;case"oklch":N=b.OKLCH,o.colorNotation!==b.OKLCH&&(l=colorDataTo(o,b.OKLCH).channels),r.colorNotation!==b.OKLCH&&(s=colorDataTo(r,b.OKLCH).channels)}switch(l=fillInMissingComponents(l,s),s=fillInMissingComponents(s,l),e){case"hsl":case"hwb":u=l[0],c=s[0],i=l[1],h=s[1],m=l[2],p=s[2];break;case"lch":case"oklch":i=l[0],h=s[0],m=l[1],p=s[1],u=l[2],c=s[2]}const d=c-u;switch(a){case"shorter":d>180?u+=360:d<-180&&(c+=360);break;case"longer":-180<d&&d<180&&(d>0?u+=360:c+=360);break;case"increasing":d<0&&(c+=360);break;case"decreasing":d>0&&(u+=360);break;default:throw new Error("Unknown hue interpolation method")}i=premultiply(i,g),m=premultiply(m,g),h=premultiply(h,v),p=premultiply(p,v);let f=[0,0,0];const y=interpolate(g,v,t);switch(e){case"hsl":case"hwb":f=[interpolate(u,c,t),un_premultiply(interpolate(i,h,t),y),un_premultiply(interpolate(m,p,t),y)];break;case"lch":case"oklch":f=[un_premultiply(interpolate(i,h,t),y),un_premultiply(interpolate(m,p,t),y),interpolate(u,c,t)]}return{colorNotation:N,channels:f,alpha:y*n.alphaMultiplier,syntaxFlags:new Set([_.ColorMix])}}function interpolate(e,a,n){return Number.isNaN(e)?a:Number.isNaN(a)?e:e*n+a*(1-n)}function premultiply(e,a){return Number.isNaN(a)?e:Number.isNaN(e)?NaN:e*a}function un_premultiply(e,a){return 0===a||Number.isNaN(a)?e:Number.isNaN(e)?NaN:e/a}function hex(e){const a=toLowerCaseAZ(e[4].value);if(a.match(/[^a-f0-9]/))return!1;const n={colorNotation:b.HEX,channels:[0,0,0],alpha:1,syntaxFlags:new Set([_.Hex])},o=a.length;if(3===o){const e=a[0],o=a[1],r=a[2];return n.channels=[parseInt(e+e,16)/255,parseInt(o+o,16)/255,parseInt(r+r,16)/255],n}if(6===o){const e=a[0]+a[1],o=a[2]+a[3],r=a[4]+a[5];return n.channels=[parseInt(e,16)/255,parseInt(o,16)/255,parseInt(r,16)/255],n}if(4===o){const e=a[0],o=a[1],r=a[2],t=a[3];return n.channels=[parseInt(e+e,16)/255,parseInt(o+o,16)/255,parseInt(r+r,16)/255],n.alpha=parseInt(t+t,16)/255,n.syntaxFlags.add(_.HasAlpha),n}if(8===o){const e=a[0]+a[1],o=a[2]+a[3],r=a[4]+a[5],t=a[6]+a[7];return n.channels=[parseInt(e,16)/255,parseInt(o,16)/255,parseInt(r,16)/255],n.alpha=parseInt(t,16)/255,n.syntaxFlags.add(_.HasAlpha),n}return!1}function normalizeHue(n){if(n[0]===e.Number)return n[4].value=n[4].value%360,n[1]=n[4].value.toString(),n;if(n[0]===e.Dimension){let o=n[4].value;switch(toLowerCaseAZ(n[4].unit)){case"deg":break;case"rad":o=180*n[4].value/Math.PI;break;case"grad":o=.9*n[4].value;break;case"turn":o=360*n[4].value;break;default:return!1}return o%=360,[e.Number,o.toString(),n[2],n[3],{value:o,type:a.Number}]}return!1}function normalize_legacy_HSL_ChannelValues(n,o){const r=[];for(let t=0;t<n.length;t++){const l=n[t];if(0!==t)if(l[0]!==e.Percentage){if(l[0]!==e.Number)return!1;{3!==t&&o.syntaxFlags.add(_.HasNumberValues);let n=normalize(l[4].value,1,0,100);3===t&&(n=normalize(l[4].value,1,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}}else{3===t?o.syntaxFlags.add(_.HasPercentageAlpha):o.syntaxFlags.add(_.HasPercentageValues);let n=normalize(l[4].value,1,0,100);3===t&&(n=normalize(l[4].value,100,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}else{const a=normalizeHue(l);if(!1===a)return!1;l[0]===e.Dimension&&o.syntaxFlags.add(_.HasDimensionValues),r.push(a)}}return!o.syntaxFlags.has(_.HasNumberValues)&&r}function normalize_modern_HSL_ChannelValues(n,o){const r=[];for(let t=0;t<n.length;t++){const l=n[t];if(l[0]!==e.Ident||"none"!==toLowerCaseAZ(l[4].value))if(0!==t)if(l[0]!==e.Percentage){if(l[0]!==e.Number)return!1;{3!==t&&o.syntaxFlags.add(_.HasNumberValues);let n=normalize(l[4].value,1,0,100);3===t&&(n=normalize(l[4].value,1,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}}else{3===t?o.syntaxFlags.add(_.HasPercentageAlpha):o.syntaxFlags.add(_.HasPercentageValues);let n=normalize(l[4].value,1,0,100);3===t&&(n=normalize(l[4].value,100,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}else{const a=normalizeHue(l);if(!1===a)return!1;l[0]===e.Dimension&&o.syntaxFlags.add(_.HasDimensionValues),r.push(a)}else o.syntaxFlags.add(_.HasNoneKeywords),r.push([e.Number,"none",l[2],l[3],{value:NaN,type:a.Number}])}return r}function threeChannelLegacySyntax(a,n,o,r){const t=[],l=[],h=[],m=[],b={colorNotation:o,channels:[0,0,0],alpha:1,syntaxFlags:new Set(r)};let g=t;for(let n=0;n<a.value.length;n++){let o=a.value[n];if(!s(o)&&!u(o)){if(c(o)&&o.value[0]===e.Comma){if(g===t){g=l;continue}if(g===l){g=h;continue}if(g===h){g=m;continue}if(g===m)return!1}if(i(o)){if(g===m&&"var"===toLowerCaseAZ(o.getName())){b.syntaxFlags.add(_.HasVariableAlpha),g.push(o);continue}if(!p.has(toLowerCaseAZ(o.getName())))return!1;const[[a]]=N([[o]],{toCanonicalUnits:!0,precision:100});if(!a||!c(a)||(a.value[0]===e.Percentage||a.value[0]===e.Number||a.value[0]===e.Dimension)&&Number.isNaN(a.value[4].value))return!1;o=a}if(!c(o))return!1;g.push(o)}}if(1!==g.length)return!1;if(1!==t.length||1!==l.length||1!==h.length)return!1;if(!c(t[0])||!c(l[0])||!c(h[0]))return!1;const v=[t[0].value,l[0].value,h[0].value];1===m.length&&(b.syntaxFlags.add(_.HasAlpha),c(m[0])?v.push(m[0].value):b.alpha=m[0]);const d=n(v,b);return!1!==d&&(b.channels=[d[0][4].value,d[1][4].value,d[2][4].value],4===d.length&&(b.alpha=d[3][4].value),b)}function threeChannelSpaceSeparated(a,n,o,r,t){const l=[],m=[],b=[],g=[];let v,d,f=!1;const y={colorNotation:o,channels:[0,0,0],alpha:1,syntaxFlags:new Set(r)};let C=l;for(let n=0;n<a.value.length;n++){let r=a.value[n];if(s(r)||u(r))for(;s(a.value[n+1])||u(a.value[n+1]);)n++;else if(C===l&&l.length&&(C=m),C===m&&m.length&&(C=b),c(r)&&r.value[0]===e.Delim&&"/"===r.value[4].value){if(C===g)return!1;C=g}else{if(i(r)){if(C===g&&"var"===toLowerCaseAZ(r.getName())){y.syntaxFlags.add(_.HasVariableAlpha),C.push(r);continue}if(!p.has(toLowerCaseAZ(r.getName())))return!1;const[[a]]=N([[r]],{toCanonicalUnits:!0,precision:100,globals:d});if(!a||!c(a)||(a.value[0]===e.Percentage||a.value[0]===e.Number||a.value[0]===e.Dimension)&&Number.isNaN(a.value[4].value))return!1;r=a}if(C===l&&0===l.length&&c(r)&&r.value[0]===e.Ident&&"from"===toLowerCaseAZ(r.value[4].value)){if(f)return!1;for(;s(a.value[n+1])||u(a.value[n+1]);)n++;if(n++,r=a.value[n],f=t(r),!1===f)return!1;f.colorNotation!==o&&(f=colorDataTo(f,o)),v=normalizeRelativeColorDataChannels(f),d=noneToZeroInRelativeColorDataChannels(v)}else{if(!c(r))return!1;if(r.value[0]===e.Ident&&v&&v.has(toLowerCaseAZ(r.value[4].value))){C.push(new h(v.get(toLowerCaseAZ(r.value[4].value))));continue}C.push(r)}}}if(1!==C.length)return!1;if(1!==l.length||1!==m.length||1!==b.length)return!1;if(!c(l[0])||!c(m[0])||!c(b[0]))return!1;const L=[l[0].value,m[0].value,b[0].value];1===g.length?(y.syntaxFlags.add(_.HasAlpha),c(g[0])?L.push(g[0].value):y.alpha=g[0]):v&&v.has("alpha")&&L.push(v.get("alpha"));const H=n(L,y);return!1!==H&&(y.channels=[H[0][4].value,H[1][4].value,H[2][4].value],4===H.length&&(y.alpha=H[3][4].value),y)}function hsl(a,n){if(a.value.some((a=>c(a)&&a.value[0]===e.Comma))){const e=hslCommaSeparated(a);if(!1!==e)return e}{const e=hslSpaceSeparated(a,n);if(!1!==e)return e}return!1}function hslCommaSeparated(e){return threeChannelLegacySyntax(e,normalize_legacy_HSL_ChannelValues,b.HSL,[_.LegacyHSL])}function hslSpaceSeparated(e,a){return threeChannelSpaceSeparated(e,normalize_modern_HSL_ChannelValues,b.HSL,[],a)}function normalize_HWB_ChannelValues(n,o){const r=[];for(let t=0;t<n.length;t++){const l=n[t];if(l[0]!==e.Ident||"none"!==toLowerCaseAZ(l[4].value))if(0!==t)if(l[0]!==e.Percentage){if(l[0]!==e.Number)return!1;{if(3!==t)return!1;const n=normalize(l[4].value,1,0,1);r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}}else{3===t?o.syntaxFlags.add(_.HasPercentageAlpha):o.syntaxFlags.add(_.HasPercentageValues);let n=normalize(l[4].value,1,0,100);3===t&&(n=normalize(l[4].value,100,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}else{const a=normalizeHue(l);if(!1===a)return!1;l[0]===e.Dimension&&o.syntaxFlags.add(_.HasDimensionValues),r.push(a)}else o.syntaxFlags.add(_.HasNoneKeywords),r.push([e.Number,"none",l[2],l[3],{value:NaN,type:a.Number}])}return r}function normalize_Lab_ChannelValues(n,o){const r=[];for(let t=0;t<n.length;t++){const l=n[t];if(l[0]!==e.Ident||"none"!==toLowerCaseAZ(l[4].value))if(l[0]!==e.Percentage){if(l[0]!==e.Number)return!1;{3!==t&&o.syntaxFlags.add(_.HasNumberValues);let n=normalize(l[4].value,1,0,100);1===t||2===t?n=normalize(l[4].value,1,-1/0,1/0):3===t&&(n=normalize(l[4].value,1,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:l[4].value,type:a.Number}])}}else{3!==t&&o.syntaxFlags.add(_.HasPercentageValues);let n=normalize(l[4].value,1,0,100);1===t||2===t?n=normalize(l[4].value,.8,-1/0,1/0):3===t&&(n=normalize(l[4].value,100,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}else o.syntaxFlags.add(_.HasNoneKeywords),r.push([e.Number,"none",l[2],l[3],{value:NaN,type:a.Number}])}return r}function lab(e,a){return threeChannelSpaceSeparated(e,normalize_Lab_ChannelValues,b.Lab,[],a)}function normalize_LCH_ChannelValues(n,o){const r=[];for(let t=0;t<n.length;t++){const l=n[t];if(l[0]!==e.Ident||"none"!==toLowerCaseAZ(l[4].value))if(2!==t)if(l[0]!==e.Percentage){if(l[0]!==e.Number)return!1;{3!==t&&o.syntaxFlags.add(_.HasNumberValues);let n=normalize(l[4].value,1,0,100);1===t?n=normalize(l[4].value,1,0,1/0):3===t&&(n=normalize(l[4].value,1,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:l[4].value,type:a.Number}])}}else{3!==t&&o.syntaxFlags.add(_.HasPercentageValues);let n=normalize(l[4].value,1,0,100);1===t?n=normalize(l[4].value,100/150,0,1/0):3===t&&(n=normalize(l[4].value,100,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}else{const a=normalizeHue(l);if(!1===a)return!1;l[0]===e.Dimension&&o.syntaxFlags.add(_.HasDimensionValues),r.push(a)}else o.syntaxFlags.add(_.HasNoneKeywords),r.push([e.Number,"none",l[2],l[3],{value:NaN,type:a.Number}])}return r}function lch(e,a){return threeChannelSpaceSeparated(e,normalize_LCH_ChannelValues,b.LCH,[],a)}const L=new Map;for(const[e,a]of Object.entries(o))L.set(e,a);function namedColor(e){const a=L.get(toLowerCaseAZ(e));return!!a&&{colorNotation:b.RGB,channels:[a[0]/255,a[1]/255,a[2]/255],alpha:1,syntaxFlags:new Set([_.ColorKeyword,_.NamedColor])}}function normalize_OKLab_ChannelValues(n,o){const r=[];for(let t=0;t<n.length;t++){const l=n[t];if(l[0]!==e.Ident||"none"!==toLowerCaseAZ(l[4].value))if(l[0]!==e.Percentage){if(l[0]!==e.Number)return!1;{3!==t&&o.syntaxFlags.add(_.HasNumberValues);let n=normalize(l[4].value,1,0,1);1===t||2===t?n=normalize(l[4].value,1,-1/0,1/0):3===t&&(n=normalize(l[4].value,1,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:l[4].value,type:a.Number}])}}else{3!==t&&o.syntaxFlags.add(_.HasPercentageValues);let n=normalize(l[4].value,100,0,1);1===t||2===t?n=normalize(l[4].value,250,-1/0,1/0):3===t&&(n=normalize(l[4].value,100,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}else o.syntaxFlags.add(_.HasNoneKeywords),r.push([e.Number,"none",l[2],l[3],{value:NaN,type:a.Number}])}return r}function oklab(e,a){return threeChannelSpaceSeparated(e,normalize_OKLab_ChannelValues,b.OKLab,[],a)}function normalize_OKLCH_ChannelValues(n,o){const r=[];for(let t=0;t<n.length;t++){const l=n[t];if(l[0]!==e.Ident||"none"!==toLowerCaseAZ(l[4].value))if(2!==t)if(l[0]!==e.Percentage){if(l[0]!==e.Number)return!1;{3!==t&&o.syntaxFlags.add(_.HasNumberValues);let n=normalize(l[4].value,1,0,1);1===t?n=normalize(l[4].value,1,0,1/0):3===t&&(n=normalize(l[4].value,1,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:l[4].value,type:a.Number}])}}else{3!==t&&o.syntaxFlags.add(_.HasPercentageValues);let n=normalize(l[4].value,100,0,1);1===t?n=normalize(l[4].value,250,0,1/0):3===t&&(n=normalize(l[4].value,100,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}else{const a=normalizeHue(l);if(!1===a)return!1;l[0]===e.Dimension&&o.syntaxFlags.add(_.HasDimensionValues),r.push(a)}else o.syntaxFlags.add(_.HasNoneKeywords),r.push([e.Number,"none",l[2],l[3],{value:NaN,type:a.Number}])}return r}function oklch(e,a){return threeChannelSpaceSeparated(e,normalize_OKLCH_ChannelValues,b.OKLCH,[],a)}function normalize_legacy_sRGB_ChannelValues(n,o){const r=[];for(let t=0;t<n.length;t++){const l=n[t];if(l[0]!==e.Percentage){if(l[0]!==e.Number)return!1;{3!==t&&o.syntaxFlags.add(_.HasNumberValues);let n=normalize(l[4].value,255,0,1);3===t&&(n=normalize(l[4].value,1,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}}else{3===t?o.syntaxFlags.add(_.HasPercentageAlpha):o.syntaxFlags.add(_.HasPercentageValues);const n=normalize(l[4].value,100,0,1);r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}}return(!o.syntaxFlags.has(_.HasNumberValues)||!o.syntaxFlags.has(_.HasPercentageValues))&&r}function normalize_modern_sRGB_ChannelValues(n,o){const r=[];for(let t=0;t<n.length;t++){const l=n[t];if(l[0]!==e.Ident||"none"!==toLowerCaseAZ(l[4].value))if(l[0]!==e.Percentage){if(l[0]!==e.Number)return!1;{3!==t&&o.syntaxFlags.add(_.HasNumberValues);let n=normalize(l[4].value,255,0,1);3===t&&(n=normalize(l[4].value,1,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}}else{3!==t&&o.syntaxFlags.add(_.HasPercentageValues);const n=normalize(l[4].value,100,0,1);r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}else o.syntaxFlags.add(_.HasNoneKeywords),r.push([e.Number,"none",l[2],l[3],{value:NaN,type:a.Number}])}return r}function rgb(a,n){if(a.value.some((a=>c(a)&&a.value[0]===e.Comma))){const e=rgbCommaSeparated(a);if(!1!==e)return e}else{const e=rgbSpaceSeparated(a,n);if(!1!==e)return e}return!1}function rgbCommaSeparated(e){return threeChannelLegacySyntax(e,normalize_legacy_sRGB_ChannelValues,b.RGB,[_.LegacyRGB])}function rgbSpaceSeparated(e,a){return threeChannelSpaceSeparated(e,normalize_modern_sRGB_ChannelValues,b.RGB,[],a)}function toPrecision(e,a=7){e=+e,a=+a;const n=(Math.floor(e)+"").length;if(a>n)return+e.toFixed(a-n);{const o=10**(n-a);return Math.round(e/o)*o}}function serializeP3(o,r=!0){o.channels=convertPowerlessComponentsToMissingComponents(o.channels,o.colorNotation);let t=o.channels.map((e=>Number.isNaN(e)?0:e));o.colorNotation!==b.Display_P3&&(t=r?XYZ_D50_to_P3_Gamut(colorData_to_XYZ_D50(o).channels):n.XYZ_D50_to_P3(colorData_to_XYZ_D50(o).channels));const l=toPrecision(t[0],6),s=toPrecision(t[1],6),u=toPrecision(t[2],6),c=[e.Function,"color(",-1,-1,{value:"color"}],i=[e.CloseParen,")",-1,-1,void 0],p=[e.Whitespace," ",-1,-1,void 0],N=[new h([e.Ident,"display-p3",-1,-1,{value:"display-p3"}]),new h(p),new h([e.Number,l.toString(),-1,-1,{value:t[0],type:a.Number}]),new h(p),new h([e.Number,s.toString(),-1,-1,{value:t[1],type:a.Number}]),new h(p),new h([e.Number,u.toString(),-1,-1,{value:t[2],type:a.Number}])];if("number"==typeof o.alpha){const n=Math.min(1,Math.max(0,toPrecision(Number.isNaN(o.alpha)?0:o.alpha)));return new m(c,i,1===n?N:[...N,new h(p),new h([e.Delim,"/",-1,-1,{value:"/"}]),new h(p),new h([e.Number,n.toString(),-1,-1,{value:o.alpha,type:a.Integer}])])}return new m(c,i,[...N,new h(p),new h([e.Delim,"/",-1,-1,{value:"/"}]),new h(p),o.alpha])}function XYZ_D50_to_P3_Gamut(e){const a=n.XYZ_D50_to_P3(e);if(r.inGamut(a))return r.clip(a);let o=e.slice();return o=t.D50_to_D65(o),o=t.XYZ_to_OKLab(o),o=t.OKLab_to_OKLCH(o),o[0]<1e-6&&(o=[0,0,0]),o[0]>.999999&&(o=[1,0,0]),l.mapGamut(o,(e=>(e=t.OKLCH_to_OKLab(e),e=t.OKLab_to_XYZ(e),e=t.XYZ_to_lin_P3(e),t.gam_P3(e))),(e=>(e=t.lin_P3(e),e=t.lin_P3_to_XYZ(e),e=t.XYZ_to_OKLab(e),t.OKLab_to_OKLCH(e))))}function serializeRGB(o,r=!0){o.channels=convertPowerlessComponentsToMissingComponents(o.channels,o.colorNotation);let t=o.channels.map((e=>Number.isNaN(e)?0:e));o.colorNotation!==b.RGB&&o.colorNotation!==b.sRGB&&o.colorNotation!==b.HEX&&(t=r?XYZ_D50_to_sRGB_Gamut(colorData_to_XYZ_D50(o).channels):n.XYZ_D50_to_sRGB(colorData_to_XYZ_D50(o).channels));const l=Math.min(255,Math.max(0,Math.round(255*toPrecision(t[0])))),s=Math.min(255,Math.max(0,Math.round(255*toPrecision(t[1])))),u=Math.min(255,Math.max(0,Math.round(255*toPrecision(t[2])))),c=[e.CloseParen,")",-1,-1,void 0],i=[e.Whitespace," ",-1,-1,void 0],p=[e.Comma,",",-1,-1,void 0],N=[new h([e.Number,l.toString(),-1,-1,{value:t[0],type:a.Integer}]),new h(p),new h(i),new h([e.Number,s.toString(),-1,-1,{value:t[1],type:a.Integer}]),new h(p),new h(i),new h([e.Number,u.toString(),-1,-1,{value:t[2],type:a.Integer}])];if("number"==typeof o.alpha){const n=Math.min(1,Math.max(0,toPrecision(Number.isNaN(o.alpha)?0:o.alpha)));return 1===n?new m([e.Function,"rgb(",-1,-1,{value:"rgb"}],c,N):new m([e.Function,"rgba(",-1,-1,{value:"rgba"}],c,[...N,new h(p),new h(i),new h([e.Number,n.toString(),-1,-1,{value:o.alpha,type:a.Integer}])])}return new m([e.Function,"rgba(",-1,-1,{value:"rgba"}],c,[...N,new h(p),new h(i),o.alpha])}function XYZ_D50_to_sRGB_Gamut(e){const a=n.XYZ_D50_to_sRGB(e);if(r.inGamut(a))return r.clip(a);let o=e.slice();return o=t.D50_to_D65(o),o=t.XYZ_to_OKLab(o),o=t.OKLab_to_OKLCH(o),o[0]<1e-6&&(o=[0,0,0]),o[0]>.999999&&(o=[1,0,0]),l.mapGamut(o,(e=>(e=t.OKLCH_to_OKLab(e),e=t.OKLab_to_XYZ(e),e=t.XYZ_to_lin_sRGB(e),t.gam_sRGB(e))),(e=>(e=t.lin_sRGB(e),e=t.lin_sRGB_to_XYZ(e),e=t.XYZ_to_OKLab(e),t.OKLab_to_OKLCH(e))))}function color(a){if(i(a)){switch(toLowerCaseAZ(a.getName())){case"rgb":case"rgba":return rgb(a,color);case"hsl":case"hsla":return hsl(a,color);case"hwb":return n=color,threeChannelSpaceSeparated(a,normalize_HWB_ChannelValues,b.HWB,[],n);case"lab":return lab(a,color);case"lch":return lch(a,color);case"oklab":return oklab(a,color);case"oklch":return oklch(a,color);case"color":return color$1(a,color);case"color-mix":return colorMix(a,color);default:return!1}}var n;if(c(a)){if(a.value[0]===e.Hash)return hex(a.value);if(a.value[0]===e.Ident){const e=namedColor(a.value[4].value);if(!1!==e)return e;const n="transparent"===toLowerCaseAZ(a.value[4].value)&&{colorNotation:b.RGB,channels:[0,0,0],alpha:0,syntaxFlags:new Set([_.ColorKeyword])};return!1!==n&&n}return!1}return!1}export{b as ColorNotation,_ as SyntaxFlag,color,colorDataFitsRGB_Gamut,colorDataTo,serializeP3,serializeRGB};
