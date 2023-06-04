import{TokenType as e,NumberType as a}from"@csstools/css-tokenizer";import{xyz as n,utils as o,conversions as r,calculations as t,namedColors as l}from"@csstools/color-helpers";import{isWhitespaceNode as s,isCommentNode as u,isTokenNode as c,isFunctionNode as i,TokenNode as h,FunctionNode as m}from"@csstools/css-parser-algorithms";import{mathFunctionNames as N,calcFromComponentValues as p}from"@csstools/css-calc";var _,b;function colorData_to_XYZ_D50(e){switch(e.colorNotation){case _.HEX:case _.RGB:case _.sRGB:return{...e,colorNotation:_.XYZ_D50,channels:n.sRGB_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.Linear_sRGB:return{...e,colorNotation:_.XYZ_D50,channels:n.lin_sRGB_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.Display_P3:return{...e,colorNotation:_.XYZ_D50,channels:n.P3_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.Rec2020:return{...e,colorNotation:_.XYZ_D50,channels:n.rec_2020_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.A98_RGB:return{...e,colorNotation:_.XYZ_D50,channels:n.a98_RGB_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.ProPhoto_RGB:return{...e,colorNotation:_.XYZ_D50,channels:n.ProPhoto_RGB_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.HSL:return{...e,colorNotation:_.XYZ_D50,channels:n.HSL_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.HWB:return{...e,colorNotation:_.XYZ_D50,channels:n.HWB_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.Lab:return{...e,colorNotation:_.XYZ_D50,channels:n.Lab_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.OKLab:return{...e,colorNotation:_.XYZ_D50,channels:n.OKLab_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.LCH:return{...e,colorNotation:_.XYZ_D50,channels:n.LCH_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.OKLCH:return{...e,colorNotation:_.XYZ_D50,channels:n.OKLCH_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.XYZ_D50:return{...e,colorNotation:_.XYZ_D50,channels:n.XYZ_D50_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.XYZ_D65:return{...e,colorNotation:_.XYZ_D50,channels:n.XYZ_D65_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};default:throw new Error("Unsupported color notation")}}!function(e){e.A98_RGB="a98-rgb",e.Display_P3="display-p3",e.HEX="hex",e.HSL="hsl",e.HWB="hwb",e.LCH="lch",e.Lab="lab",e.Linear_sRGB="srgb-linear",e.OKLCH="oklch",e.OKLab="oklab",e.ProPhoto_RGB="prophoto-rgb",e.RGB="rgb",e.sRGB="srgb",e.Rec2020="rec2020",e.XYZ_D50="xyz-d50",e.XYZ_D65="xyz-d65"}(_||(_={})),function(e){e.ColorKeyword="color-keyword",e.HasAlpha="has-alpha",e.HasDimensionValues="has-dimension-values",e.HasNoneKeywords="has-none-keywords",e.HasNumberValues="has-number-values",e.HasPercentageAlpha="has-percentage-alpha",e.HasPercentageValues="has-percentage-values",e.HasVariableAlpha="has-variable-alpha",e.Hex="hex",e.LegacyHSL="legacy-hsl",e.LegacyRGB="legacy-rgb",e.NamedColor="named-color",e.RelativeColorSyntax="relative-color-syntax",e.ColorMix="color-mix"}(b||(b={}));const g=new Set([_.A98_RGB,_.Display_P3,_.HEX,_.Linear_sRGB,_.ProPhoto_RGB,_.RGB,_.sRGB,_.Rec2020,_.XYZ_D50,_.XYZ_D65]);function colorDataTo(e,a){const o=colorData_to_XYZ_D50(e),r={...e};switch(a){case _.HEX:case _.RGB:r.colorNotation=_.RGB,r.channels=n.XYZ_D50_to_sRGB(o.channels);break;case _.sRGB:r.colorNotation=_.sRGB,r.channels=n.XYZ_D50_to_sRGB(o.channels);break;case _.Linear_sRGB:r.colorNotation=_.Linear_sRGB,r.channels=n.XYZ_D50_to_lin_sRGB(o.channels);break;case _.Display_P3:r.colorNotation=_.Display_P3,r.channels=n.XYZ_D50_to_P3(o.channels);break;case _.Rec2020:r.colorNotation=_.Rec2020,r.channels=n.XYZ_D50_to_rec_2020(o.channels);break;case _.ProPhoto_RGB:r.colorNotation=_.ProPhoto_RGB,r.channels=n.XYZ_D50_to_ProPhoto(o.channels);break;case _.A98_RGB:r.colorNotation=_.A98_RGB,r.channels=n.XYZ_D50_to_a98_RGB(o.channels);break;case _.HSL:r.colorNotation=_.HSL,r.channels=n.XYZ_D50_to_HSL(o.channels);break;case _.HWB:r.colorNotation=_.HWB,r.channels=n.XYZ_D50_to_HWB(o.channels);break;case _.Lab:r.colorNotation=_.Lab,r.channels=n.XYZ_D50_to_Lab(o.channels);break;case _.LCH:r.colorNotation=_.LCH,r.channels=n.XYZ_D50_to_LCH(o.channels);break;case _.OKLCH:r.colorNotation=_.OKLCH,r.channels=n.XYZ_D50_to_OKLCH(o.channels);break;case _.OKLab:r.colorNotation=_.OKLab,r.channels=n.XYZ_D50_to_OKLab(o.channels);break;case _.XYZ_D50:r.colorNotation=_.XYZ_D50,r.channels=n.XYZ_D50_to_XYZ_D50(o.channels);break;case _.XYZ_D65:r.colorNotation=_.XYZ_D65,r.channels=n.XYZ_D50_to_XYZ_D65(o.channels);break;default:throw new Error("Unsupported color notation")}if(a===e.colorNotation)r.channels=carryForwardMissingComponents(e.channels,[0,1,2],r.channels,[0,1,2]);else if(g.has(a)&&g.has(e.colorNotation))r.channels=carryForwardMissingComponents(e.channels,[0,1,2],r.channels,[0,1,2]);else switch(a){case _.HSL:switch(e.colorNotation){case _.HWB:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[0]);break;case _.Lab:case _.OKLab:r.channels=carryForwardMissingComponents(e.channels,[2],r.channels,[0]);break;case _.LCH:case _.OKLCH:r.channels=carryForwardMissingComponents(e.channels,[0,1,2],r.channels,[2,1,0])}break;case _.HWB:switch(e.colorNotation){case _.HSL:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[0]);break;case _.LCH:case _.OKLCH:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[2])}break;case _.Lab:case _.OKLab:switch(e.colorNotation){case _.HSL:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[2]);break;case _.Lab:case _.OKLab:case _.LCH:case _.OKLCH:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[0])}break;case _.LCH:case _.OKLCH:switch(e.colorNotation){case _.HSL:r.channels=carryForwardMissingComponents(e.channels,[0,1,2],r.channels,[2,1,0]);break;case _.HWB:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[2]);break;case _.Lab:case _.OKLab:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[0]);break;case _.LCH:case _.OKLCH:r.channels=carryForwardMissingComponents(e.channels,[0,1,2],r.channels,[0,1,2])}}return r.channels=convertPowerlessComponentsToMissingComponents(r.channels,a),r}function convertPowerlessComponentsToMissingComponents(e,a){const n=[...e];switch(a){case _.HSL:(reducePrecision(n[2])<=0||reducePrecision(n[2])>=100)&&(n[0]=NaN,n[1]=NaN),n[1]<=0&&(n[0]=NaN);break;case _.HWB:Math.max(0,reducePrecision(n[1]))+Math.max(0,reducePrecision(n[2]))>=100&&(n[0]=NaN);break;case _.Lab:(reducePrecision(n[0])<=0||reducePrecision(n[0])>=100)&&(n[1]=NaN,n[2]=NaN);break;case _.LCH:reducePrecision(n[1])<=0&&(n[2]=NaN),(reducePrecision(n[0])<=0||reducePrecision(n[0])>=100)&&(n[1]=NaN,n[2]=NaN);break;case _.OKLab:(reducePrecision(n[0])<=0||reducePrecision(n[0])>=1)&&(n[1]=NaN,n[2]=NaN);break;case _.OKLCH:reducePrecision(n[1])<=0&&(n[2]=NaN),(reducePrecision(n[0])<=0||reducePrecision(n[0])>=1)&&(n[1]=NaN,n[2]=NaN)}return n}function carryForwardMissingComponents(e,a,n,o){const r=[...n];for(const n of a)Number.isNaN(e[a[n]])&&(r[o[n]]=NaN);return r}function fillInMissingComponents(e,a){const n=[...e];for(let o=0;o<e.length;o++)Number.isNaN(e[o])&&(n[o]=a[o]);return n}function normalizeRelativeColorDataChannels(e){const a=new Map;switch(e.colorNotation){case _.RGB:case _.HEX:a.set("r",dummyNumberToken(255*e.channels[0])),a.set("g",dummyNumberToken(255*e.channels[1])),a.set("b",dummyNumberToken(255*e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha));break;case _.HSL:a.set("h",dummyNumberToken(e.channels[0])),a.set("s",dummyPercentageToken(e.channels[1])),a.set("l",dummyPercentageToken(e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha));break;case _.HWB:a.set("h",dummyNumberToken(e.channels[0])),a.set("w",dummyPercentageToken(e.channels[1])),a.set("b",dummyPercentageToken(e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha));break;case _.Lab:case _.OKLab:a.set("l",dummyNumberToken(e.channels[0])),a.set("a",dummyNumberToken(e.channels[1])),a.set("b",dummyNumberToken(e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha));break;case _.LCH:case _.OKLCH:a.set("l",dummyNumberToken(e.channels[0])),a.set("c",dummyNumberToken(e.channels[1])),a.set("h",dummyNumberToken(e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha));break;case _.sRGB:case _.A98_RGB:case _.Display_P3:case _.Rec2020:case _.Linear_sRGB:case _.ProPhoto_RGB:a.set("r",dummyNumberToken(e.channels[0])),a.set("g",dummyNumberToken(e.channels[1])),a.set("b",dummyNumberToken(e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha));break;case _.XYZ_D50:case _.XYZ_D65:a.set("x",dummyNumberToken(e.channels[0])),a.set("y",dummyNumberToken(e.channels[1])),a.set("z",dummyNumberToken(e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha))}return a}function noneToZeroInRelativeColorDataChannels(e){const a=new Map;for(const[n,o]of e)Number.isNaN(o[4].value)?a.set(n,dummyNumberToken(0)):a.set(n,o);return a}function dummyNumberToken(n){return[e.Number,n.toString(),-1,-1,{value:n,type:a.Number}]}function dummyPercentageToken(a){return[e.Percentage,a.toString()+"%",-1,-1,{value:a}]}function reducePrecision(e,a=7){const n=Math.pow(10,a);return Math.round(e*n)/n}function colorDataFitsRGB_Gamut(e){return!colorDataTo(e,_.RGB).channels.find((e=>e<-1e-5||e>1.00001))}function normalize(e,a,n,o){return Math.min(Math.max(e/a,n),o)}const v=/[A-Z]/g;function toLowerCaseAZ(e){return e.replace(v,(e=>String.fromCharCode(e.charCodeAt(0)+32)))}function normalize_Color_ChannelValues(n,o){const r=[];for(let t=0;t<n.length;t++){const l=n[t];if(l[0]!==e.Ident||"none"!==toLowerCaseAZ(l[4].value))if(l[0]!==e.Percentage){if(l[0]!==e.Number)return!1;{3!==t&&o.syntaxFlags.add(b.HasNumberValues);let n=normalize(l[4].value,1,-1/0,1/0);3===t&&(n=normalize(l[4].value,1,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:l[4].value,type:a.Number}])}}else{3!==t&&o.syntaxFlags.add(b.HasPercentageValues);let n=normalize(l[4].value,100,-1/0,1/0);3===t&&(n=normalize(l[4].value,100,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}else o.syntaxFlags.add(b.HasNoneKeywords),r.push([e.Number,"none",l[2],l[3],{value:NaN,type:a.Number}])}return r}const d=new Set(["srgb","srgb-linear","display-p3","a98-rgb","prophoto-rgb","rec2020","xyz","xyz-d50","xyz-d65"]);function color$1(a,n){const o=[],r=[],t=[],l=[];let m,g,v=!1,f=!1;const y={colorNotation:_.sRGB,channels:[0,0,0],alpha:1,syntaxFlags:new Set([])};let C=o;for(let _=0;_<a.value.length;_++){let L=a.value[_];if(s(L)||u(L))for(;s(a.value[_+1])||u(a.value[_+1]);)_++;else if(C===o&&o.length&&(C=r),C===r&&r.length&&(C=t),c(L)&&L.value[0]===e.Delim&&"/"===L.value[4].value){if(C===l)return!1;C=l}else{if(i(L)){if(C===l&&"var"===toLowerCaseAZ(L.getName())){y.syntaxFlags.add(b.HasVariableAlpha),C.push(L);continue}if(!N.has(toLowerCaseAZ(L.getName())))return!1;const[[a]]=p([[L]],{toCanonicalUnits:!0,precision:100,globals:g});if(!a||!c(a)||(a.value[0]===e.Percentage||a.value[0]===e.Number||a.value[0]===e.Dimension)&&Number.isNaN(a.value[4].value))return!1;L=a}if(C===o&&0===o.length&&c(L)&&L.value[0]===e.Ident&&d.has(toLowerCaseAZ(L.value[4].value))){if(v)return!1;v=toLowerCaseAZ(L.value[4].value),y.colorNotation=colorSpaceNameToColorNotation(v),f&&(f.colorNotation!==y.colorNotation&&(f=colorDataTo(f,y.colorNotation)),m=normalizeRelativeColorDataChannels(f),g=noneToZeroInRelativeColorDataChannels(m))}else if(C===o&&0===o.length&&c(L)&&L.value[0]===e.Ident&&"from"===toLowerCaseAZ(L.value[4].value)){if(f)return!1;if(v)return!1;for(;s(a.value[_+1])||u(a.value[_+1]);)_++;if(_++,L=a.value[_],f=n(L),!1===f)return!1;y.syntaxFlags.add(b.RelativeColorSyntax)}else{if(!c(L))return!1;if(L.value[0]===e.Ident&&m&&m.has(toLowerCaseAZ(L.value[4].value))){C.push(new h(m.get(toLowerCaseAZ(L.value[4].value))));continue}C.push(L)}}}if(!v)return!1;if(1!==C.length)return!1;if(1!==o.length||1!==r.length||1!==t.length)return!1;if(!c(o[0])||!c(r[0])||!c(t[0]))return!1;if(m&&!m.has("alpha"))return!1;const L=[o[0].value,r[0].value,t[0].value];1===l.length?(y.syntaxFlags.add(b.HasAlpha),c(l[0])?L.push(l[0].value):y.alpha=l[0]):m&&m.has("alpha")&&L.push(m.get("alpha"));const H=normalize_Color_ChannelValues(L,y);return!1!==H&&(y.channels=[H[0][4].value,H[1][4].value,H[2][4].value],4===H.length&&(y.alpha=H[3][4].value),y)}function colorSpaceNameToColorNotation(e){switch(e){case"srgb":return _.sRGB;case"srgb-linear":return _.Linear_sRGB;case"display-p3":return _.Display_P3;case"a98-rgb":return _.A98_RGB;case"prophoto-rgb":return _.ProPhoto_RGB;case"rec2020":return _.Rec2020;case"xyz":case"xyz-d65":return _.XYZ_D65;case"xyz-d50":return _.XYZ_D50;default:throw new Error("Unknown color space name: "+e)}}const f=new Set(["srgb","srgb-linear","lab","oklab","xyz","xyz-d50","xyz-d65"]),y=new Set(["hsl","hwb","lch","oklch"]),C=new Set(["shorter","longer","increasing","decreasing"]);function colorMix(a,n){let o=null,r=null,t=null,l=!1;for(let i=0;i<a.value.length;i++){const h=a.value[i];if(!s(h)&&!u(h)){if(c(h)&&h.value[0]===e.Ident){if(!o&&"in"===toLowerCaseAZ(h.value[4].value)){o=h;continue}if(o&&!r){r=toLowerCaseAZ(h.value[4].value);continue}if(o&&r&&!t&&y.has(r)){t=toLowerCaseAZ(h.value[4].value);continue}if(o&&r&&t&&!l&&"hue"===toLowerCaseAZ(h.value[4].value)){l=!0;continue}return!1}return!(!c(h)||h.value[0]!==e.Comma)&&(!!r&&(t||l?!!(r&&t&&l&&y.has(r)&&C.has(t))&&colorMixPolar(r,t,colorMixComponents(a.value.slice(i+1),n)):f.has(r)?colorMixRectangular(r,colorMixComponents(a.value.slice(i+1),n)):!!y.has(r)&&colorMixPolar(r,"shorter",colorMixComponents(a.value.slice(i+1),n))))}}return!1}function colorMixComponents(a,n){const o=[];let r=1,t=!1,l=!1;for(let r=0;r<a.length;r++){let h=a[r];if(!s(h)&&!u(h)){if(!c(h)||h.value[0]!==e.Comma){if(!t){const e=n(h);if(e){t=e;continue}}if(!l){if(i(h)&&N.has(toLowerCaseAZ(h.getName()))&&([[h]]=p([[h]],{toCanonicalUnits:!0,precision:100}),!h||!c(h)||(h.value[0]===e.Percentage||h.value[0]===e.Number||h.value[0]===e.Dimension)&&Number.isNaN(h.value[4].value)))return!1;if(c(h)&&h.value[0]===e.Percentage&&h.value[4].value>=0){l=h.value[4].value;continue}}return!1}if(!t)return!1;o.push({color:t,percentage:l}),t=!1,l=!1}}if(t&&o.push({color:t,percentage:l}),2!==o.length)return!1;let h=o[0].percentage,m=o[1].percentage;return(!1===h||!(h<0||h>100))&&((!1===m||!(m<0||m>100))&&(!1===h&&!1===m?(h=50,m=50):!1!==h&&!1===m?m=100-h:!1===h&&!1!==m&&(h=100-m),(0!==h||0!==m)&&(!1!==h&&!1!==m&&(h+m>100&&(h=h/(h+m)*100,m=m/(h+m)*100),h+m<100&&(r=(h+m)/100,h=h/(h+m)*100,m=m/(h+m)*100),{a:{color:o[0].color,percentage:h},b:{color:o[1].color,percentage:m},alphaMultiplier:r}))))}function colorMixRectangular(e,a){if(!a)return!1;const n=a.a.color,o=a.b.color,r=a.a.percentage/100;let t=n.channels,l=o.channels,s=_.RGB,u=n.alpha;if("number"!=typeof u)return!1;let c=o.alpha;if("number"!=typeof c)return!1;switch(u=Number.isNaN(u)?c:u,c=Number.isNaN(c)?u:c,e){case"srgb":s=_.RGB,n.colorNotation!==_.RGB&&n.colorNotation!==_.sRGB&&n.colorNotation!==_.HEX&&(t=colorDataTo(n,_.RGB).channels),o.colorNotation!==_.RGB&&o.colorNotation!==_.sRGB&&o.colorNotation!==_.HEX&&(l=colorDataTo(o,_.RGB).channels);break;case"srgb-linear":s=_.Linear_sRGB,n.colorNotation!==_.Linear_sRGB&&(t=colorDataTo(n,_.Linear_sRGB).channels),o.colorNotation!==_.Linear_sRGB&&(l=colorDataTo(o,_.Linear_sRGB).channels);break;case"lab":s=_.Lab,n.colorNotation!==_.Lab&&(t=colorDataTo(n,_.Lab).channels),o.colorNotation!==_.Lab&&(l=colorDataTo(o,_.Lab).channels);break;case"oklab":s=_.OKLab,n.colorNotation!==_.OKLab&&(t=colorDataTo(n,_.OKLab).channels),o.colorNotation!==_.OKLab&&(l=colorDataTo(o,_.OKLab).channels);break;case"xyz-d50":s=_.XYZ_D50,n.colorNotation!==_.XYZ_D50&&(t=colorDataTo(n,_.XYZ_D50).channels),o.colorNotation!==_.XYZ_D50&&(l=colorDataTo(o,_.XYZ_D50).channels);break;case"xyz":case"xyz-d65":s=_.XYZ_D65,n.colorNotation!==_.XYZ_D65&&(t=colorDataTo(n,_.XYZ_D65).channels),o.colorNotation!==_.XYZ_D65&&(l=colorDataTo(o,_.XYZ_D65).channels)}t=fillInMissingComponents(t,l),l=fillInMissingComponents(l,t),t[0]=premultiply(t[0],u),t[1]=premultiply(t[1],u),t[2]=premultiply(t[2],u),l[0]=premultiply(l[0],c),l[1]=premultiply(l[1],c),l[2]=premultiply(l[2],c);const i=interpolate(u,c,r);return{colorNotation:s,channels:[un_premultiply(interpolate(t[0],l[0],r),i),un_premultiply(interpolate(t[1],l[1],r),i),un_premultiply(interpolate(t[2],l[2],r),i)],alpha:i*a.alphaMultiplier,syntaxFlags:new Set([b.ColorMix])}}function colorMixPolar(e,a,n){if(!n)return!1;const o=n.a.color,r=n.b.color,t=n.a.percentage/100;let l=o.channels,s=r.channels,u=0,c=0,i=0,h=0,m=0,N=0,p=_.RGB,g=o.alpha;if("number"!=typeof g)return!1;let v=r.alpha;if("number"!=typeof v)return!1;switch(g=Number.isNaN(g)?v:g,v=Number.isNaN(v)?g:v,e){case"hsl":p=_.HSL,o.colorNotation!==_.HSL&&(l=colorDataTo(o,_.HSL).channels),r.colorNotation!==_.HSL&&(s=colorDataTo(r,_.HSL).channels);break;case"hwb":p=_.HWB,o.colorNotation!==_.HWB&&(l=colorDataTo(o,_.HWB).channels),r.colorNotation!==_.HWB&&(s=colorDataTo(r,_.HWB).channels);break;case"lch":p=_.LCH,o.colorNotation!==_.LCH&&(l=colorDataTo(o,_.LCH).channels),r.colorNotation!==_.LCH&&(s=colorDataTo(r,_.LCH).channels);break;case"oklch":p=_.OKLCH,o.colorNotation!==_.OKLCH&&(l=colorDataTo(o,_.OKLCH).channels),r.colorNotation!==_.OKLCH&&(s=colorDataTo(r,_.OKLCH).channels)}switch(l=fillInMissingComponents(l,s),s=fillInMissingComponents(s,l),e){case"hsl":case"hwb":u=l[0],c=s[0],i=l[1],h=s[1],m=l[2],N=s[2];break;case"lch":case"oklch":i=l[0],h=s[0],m=l[1],N=s[1],u=l[2],c=s[2]}const d=c-u;switch(a){case"shorter":d>180?u+=360:d<-180&&(c+=360);break;case"longer":-180<d&&d<180&&(d>0?u+=360:c+=360);break;case"increasing":d<0&&(c+=360);break;case"decreasing":d>0&&(u+=360);break;default:throw new Error("Unknown hue interpolation method")}i=premultiply(i,g),m=premultiply(m,g),h=premultiply(h,v),N=premultiply(N,v);let f=[0,0,0];const y=interpolate(g,v,t);switch(e){case"hsl":case"hwb":f=[interpolate(u,c,t),un_premultiply(interpolate(i,h,t),y),un_premultiply(interpolate(m,N,t),y)];break;case"lch":case"oklch":f=[un_premultiply(interpolate(i,h,t),y),un_premultiply(interpolate(m,N,t),y),interpolate(u,c,t)]}return{colorNotation:p,channels:f,alpha:y*n.alphaMultiplier,syntaxFlags:new Set([b.ColorMix])}}function interpolate(e,a,n){return Number.isNaN(e)?a:Number.isNaN(a)?e:e*n+a*(1-n)}function premultiply(e,a){return Number.isNaN(a)?e:Number.isNaN(e)?NaN:e*a}function un_premultiply(e,a){return 0===a||Number.isNaN(a)?e:Number.isNaN(e)?NaN:e/a}function hex(e){const a=toLowerCaseAZ(e[4].value);if(a.match(/[^a-f0-9]/))return!1;const n={colorNotation:_.HEX,channels:[0,0,0],alpha:1,syntaxFlags:new Set([b.Hex])},o=a.length;if(3===o){const e=a[0],o=a[1],r=a[2];return n.channels=[parseInt(e+e,16)/255,parseInt(o+o,16)/255,parseInt(r+r,16)/255],n}if(6===o){const e=a[0]+a[1],o=a[2]+a[3],r=a[4]+a[5];return n.channels=[parseInt(e,16)/255,parseInt(o,16)/255,parseInt(r,16)/255],n}if(4===o){const e=a[0],o=a[1],r=a[2],t=a[3];return n.channels=[parseInt(e+e,16)/255,parseInt(o+o,16)/255,parseInt(r+r,16)/255],n.alpha=parseInt(t+t,16)/255,n.syntaxFlags.add(b.HasAlpha),n}if(8===o){const e=a[0]+a[1],o=a[2]+a[3],r=a[4]+a[5],t=a[6]+a[7];return n.channels=[parseInt(e,16)/255,parseInt(o,16)/255,parseInt(r,16)/255],n.alpha=parseInt(t,16)/255,n.syntaxFlags.add(b.HasAlpha),n}return!1}function normalizeHue(n){if(n[0]===e.Number)return n[4].value=n[4].value%360,n[1]=n[4].value.toString(),n;if(n[0]===e.Dimension){let o=n[4].value;switch(toLowerCaseAZ(n[4].unit)){case"deg":break;case"rad":o=180*n[4].value/Math.PI;break;case"grad":o=.9*n[4].value;break;case"turn":o=360*n[4].value;break;default:return!1}return o%=360,[e.Number,o.toString(),n[2],n[3],{value:o,type:a.Number}]}return!1}function normalize_legacy_HSL_ChannelValues(n,o){const r=[];for(let t=0;t<n.length;t++){const l=n[t];if(0!==t)if(l[0]!==e.Percentage){if(l[0]!==e.Number)return!1;{3!==t&&o.syntaxFlags.add(b.HasNumberValues);let n=normalize(l[4].value,1,0,100);3===t&&(n=normalize(l[4].value,1,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}}else{3===t?o.syntaxFlags.add(b.HasPercentageAlpha):o.syntaxFlags.add(b.HasPercentageValues);let n=normalize(l[4].value,1,0,100);3===t&&(n=normalize(l[4].value,100,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}else{const a=normalizeHue(l);if(!1===a)return!1;l[0]===e.Dimension&&o.syntaxFlags.add(b.HasDimensionValues),r.push(a)}}return!o.syntaxFlags.has(b.HasNumberValues)&&r}function normalize_modern_HSL_ChannelValues(n,o){const r=[];for(let t=0;t<n.length;t++){const l=n[t];if(l[0]!==e.Ident||"none"!==toLowerCaseAZ(l[4].value))if(0!==t)if(l[0]!==e.Percentage){if(l[0]!==e.Number)return!1;{3!==t&&o.syntaxFlags.add(b.HasNumberValues);let n=normalize(l[4].value,1,0,100);3===t&&(n=normalize(l[4].value,1,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}}else{3===t?o.syntaxFlags.add(b.HasPercentageAlpha):o.syntaxFlags.add(b.HasPercentageValues);let n=normalize(l[4].value,1,0,100);3===t&&(n=normalize(l[4].value,100,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}else{const a=normalizeHue(l);if(!1===a)return!1;l[0]===e.Dimension&&o.syntaxFlags.add(b.HasDimensionValues),r.push(a)}else o.syntaxFlags.add(b.HasNoneKeywords),r.push([e.Number,"none",l[2],l[3],{value:NaN,type:a.Number}])}return r}function threeChannelLegacySyntax(a,n,o,r){const t=[],l=[],h=[],m=[],_={colorNotation:o,channels:[0,0,0],alpha:1,syntaxFlags:new Set(r)};let g=t;for(let n=0;n<a.value.length;n++){let o=a.value[n];if(!s(o)&&!u(o)){if(c(o)&&o.value[0]===e.Comma){if(g===t){g=l;continue}if(g===l){g=h;continue}if(g===h){g=m;continue}if(g===m)return!1}if(i(o)){if(g===m&&"var"===toLowerCaseAZ(o.getName())){_.syntaxFlags.add(b.HasVariableAlpha),g.push(o);continue}if(!N.has(toLowerCaseAZ(o.getName())))return!1;const[[a]]=p([[o]],{toCanonicalUnits:!0,precision:100});if(!a||!c(a)||(a.value[0]===e.Percentage||a.value[0]===e.Number||a.value[0]===e.Dimension)&&Number.isNaN(a.value[4].value))return!1;o=a}if(!c(o))return!1;g.push(o)}}if(1!==g.length)return!1;if(1!==t.length||1!==l.length||1!==h.length)return!1;if(!c(t[0])||!c(l[0])||!c(h[0]))return!1;const v=[t[0].value,l[0].value,h[0].value];1===m.length&&(_.syntaxFlags.add(b.HasAlpha),c(m[0])?v.push(m[0].value):_.alpha=m[0]);const d=n(v,_);return!1!==d&&(_.channels=[d[0][4].value,d[1][4].value,d[2][4].value],4===d.length&&(_.alpha=d[3][4].value),_)}function XYZ_D50_to_sRGB_Gamut(e){const a=n.XYZ_D50_to_sRGB(e);if(o.inGamut(a))return o.clip(a);let l=e.slice();return l=r.D50_to_D65(l),l=r.XYZ_to_OKLab(l),l=r.OKLab_to_OKLCH(l),l[0]<1e-6&&(l=[0,0,0]),l[0]>.999999&&(l=[1,0,0]),t.mapGamut(l,(e=>(e=r.OKLCH_to_OKLab(e),e=r.OKLab_to_XYZ(e),e=r.XYZ_to_lin_sRGB(e),r.gam_sRGB(e))),(e=>(e=r.lin_sRGB(e),e=r.lin_sRGB_to_XYZ(e),e=r.XYZ_to_OKLab(e),r.OKLab_to_OKLCH(e))))}function threeChannelSpaceSeparated(a,n,o,t,l){const m=toLowerCaseAZ(a.getName()),g=[],v=[],d=[],f=[];let y,C,L=!1;const H={colorNotation:o,channels:[0,0,0],alpha:1,syntaxFlags:new Set(t)};let D=g;for(let n=0;n<a.value.length;n++){let t=a.value[n];if(s(t)||u(t))for(;s(a.value[n+1])||u(a.value[n+1]);)n++;else if(D===g&&g.length&&(D=v),D===v&&v.length&&(D=d),c(t)&&t.value[0]===e.Delim&&"/"===t.value[4].value){if(D===f)return!1;D=f}else{if(i(t)){if(D===f&&"var"===toLowerCaseAZ(t.getName())){H.syntaxFlags.add(b.HasVariableAlpha),D.push(t);continue}if(!N.has(toLowerCaseAZ(t.getName())))return!1;const[[a]]=p([[t]],{toCanonicalUnits:!0,precision:100,globals:C});if(!a||!c(a)||(a.value[0]===e.Percentage||a.value[0]===e.Number||a.value[0]===e.Dimension)&&Number.isNaN(a.value[4].value))return!1;t=a}if(D===g&&0===g.length&&c(t)&&t.value[0]===e.Ident&&"from"===toLowerCaseAZ(t.value[4].value)&&"hsla"!==m&&"rgba"!==m){if(L)return!1;for(;s(a.value[n+1])||u(a.value[n+1]);)n++;if(n++,t=a.value[n],L=l(t),!1===L)return!1;H.syntaxFlags.add(b.RelativeColorSyntax),L.colorNotation!==o&&(L=colorDataTo(L,o)),o===_.HEX||o===_.RGB?L.channels=XYZ_D50_to_sRGB_Gamut(colorData_to_XYZ_D50(L).channels):o===_.HSL?L.channels=r.sRGB_to_HSL(XYZ_D50_to_sRGB_Gamut(colorData_to_XYZ_D50(L).channels)):o===_.HWB&&(L.channels=r.sRGB_to_HWB(XYZ_D50_to_sRGB_Gamut(colorData_to_XYZ_D50(L).channels))),y=normalizeRelativeColorDataChannels(L),C=noneToZeroInRelativeColorDataChannels(y)}else{if(!c(t))return!1;if(t.value[0]===e.Ident&&y&&y.has(toLowerCaseAZ(t.value[4].value))){D.push(new h(y.get(toLowerCaseAZ(t.value[4].value))));continue}D.push(t)}}}if(1!==D.length)return!1;if(1!==g.length||1!==v.length||1!==d.length)return!1;if(!c(g[0])||!c(v[0])||!c(d[0]))return!1;if(y&&!y.has("alpha"))return!1;const w=[g[0].value,v[0].value,d[0].value];1===f.length?(H.syntaxFlags.add(b.HasAlpha),c(f[0])?w.push(f[0].value):H.alpha=f[0]):y&&y.has("alpha")&&w.push(y.get("alpha"));const Z=n(w,H);return!1!==Z&&(H.channels=[Z[0][4].value,Z[1][4].value,Z[2][4].value],4===Z.length&&(H.alpha=Z[3][4].value),H)}function hsl(a,n){if(a.value.some((a=>c(a)&&a.value[0]===e.Comma))){const e=hslCommaSeparated(a);if(!1!==e)return e}{const e=hslSpaceSeparated(a,n);if(!1!==e)return e}return!1}function hslCommaSeparated(e){return threeChannelLegacySyntax(e,normalize_legacy_HSL_ChannelValues,_.HSL,[b.LegacyHSL])}function hslSpaceSeparated(e,a){return threeChannelSpaceSeparated(e,normalize_modern_HSL_ChannelValues,_.HSL,[],a)}function normalize_HWB_ChannelValues(n,o){const r=[];for(let t=0;t<n.length;t++){const l=n[t];if(l[0]!==e.Ident||"none"!==toLowerCaseAZ(l[4].value))if(0!==t)if(l[0]!==e.Percentage){if(l[0]!==e.Number)return!1;{if(3!==t)return!1;const n=normalize(l[4].value,1,0,1);r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}}else{3===t?o.syntaxFlags.add(b.HasPercentageAlpha):o.syntaxFlags.add(b.HasPercentageValues);let n=normalize(l[4].value,1,0,100);3===t&&(n=normalize(l[4].value,100,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}else{const a=normalizeHue(l);if(!1===a)return!1;l[0]===e.Dimension&&o.syntaxFlags.add(b.HasDimensionValues),r.push(a)}else o.syntaxFlags.add(b.HasNoneKeywords),r.push([e.Number,"none",l[2],l[3],{value:NaN,type:a.Number}])}return r}function normalize_Lab_ChannelValues(n,o){const r=[];for(let t=0;t<n.length;t++){const l=n[t];if(l[0]!==e.Ident||"none"!==toLowerCaseAZ(l[4].value))if(l[0]!==e.Percentage){if(l[0]!==e.Number)return!1;{3!==t&&o.syntaxFlags.add(b.HasNumberValues);let n=normalize(l[4].value,1,0,100);1===t||2===t?n=normalize(l[4].value,1,-1/0,1/0):3===t&&(n=normalize(l[4].value,1,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:l[4].value,type:a.Number}])}}else{3!==t&&o.syntaxFlags.add(b.HasPercentageValues);let n=normalize(l[4].value,1,0,100);1===t||2===t?n=normalize(l[4].value,.8,-1/0,1/0):3===t&&(n=normalize(l[4].value,100,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}else o.syntaxFlags.add(b.HasNoneKeywords),r.push([e.Number,"none",l[2],l[3],{value:NaN,type:a.Number}])}return r}function lab(e,a){return threeChannelSpaceSeparated(e,normalize_Lab_ChannelValues,_.Lab,[],a)}function normalize_LCH_ChannelValues(n,o){const r=[];for(let t=0;t<n.length;t++){const l=n[t];if(l[0]!==e.Ident||"none"!==toLowerCaseAZ(l[4].value))if(2!==t)if(l[0]!==e.Percentage){if(l[0]!==e.Number)return!1;{3!==t&&o.syntaxFlags.add(b.HasNumberValues);let n=normalize(l[4].value,1,0,100);1===t?n=normalize(l[4].value,1,0,1/0):3===t&&(n=normalize(l[4].value,1,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:l[4].value,type:a.Number}])}}else{3!==t&&o.syntaxFlags.add(b.HasPercentageValues);let n=normalize(l[4].value,1,0,100);1===t?n=normalize(l[4].value,100/150,0,1/0):3===t&&(n=normalize(l[4].value,100,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}else{const a=normalizeHue(l);if(!1===a)return!1;l[0]===e.Dimension&&o.syntaxFlags.add(b.HasDimensionValues),r.push(a)}else o.syntaxFlags.add(b.HasNoneKeywords),r.push([e.Number,"none",l[2],l[3],{value:NaN,type:a.Number}])}return r}function lch(e,a){return threeChannelSpaceSeparated(e,normalize_LCH_ChannelValues,_.LCH,[],a)}const L=new Map;for(const[e,a]of Object.entries(l))L.set(e,a);function namedColor(e){const a=L.get(toLowerCaseAZ(e));return!!a&&{colorNotation:_.RGB,channels:[a[0]/255,a[1]/255,a[2]/255],alpha:1,syntaxFlags:new Set([b.ColorKeyword,b.NamedColor])}}function normalize_OKLab_ChannelValues(n,o){const r=[];for(let t=0;t<n.length;t++){const l=n[t];if(l[0]!==e.Ident||"none"!==toLowerCaseAZ(l[4].value))if(l[0]!==e.Percentage){if(l[0]!==e.Number)return!1;{3!==t&&o.syntaxFlags.add(b.HasNumberValues);let n=normalize(l[4].value,1,0,1);1===t||2===t?n=normalize(l[4].value,1,-1/0,1/0):3===t&&(n=normalize(l[4].value,1,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:l[4].value,type:a.Number}])}}else{3!==t&&o.syntaxFlags.add(b.HasPercentageValues);let n=normalize(l[4].value,100,0,1);1===t||2===t?n=normalize(l[4].value,250,-1/0,1/0):3===t&&(n=normalize(l[4].value,100,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}else o.syntaxFlags.add(b.HasNoneKeywords),r.push([e.Number,"none",l[2],l[3],{value:NaN,type:a.Number}])}return r}function oklab(e,a){return threeChannelSpaceSeparated(e,normalize_OKLab_ChannelValues,_.OKLab,[],a)}function normalize_OKLCH_ChannelValues(n,o){const r=[];for(let t=0;t<n.length;t++){const l=n[t];if(l[0]!==e.Ident||"none"!==toLowerCaseAZ(l[4].value))if(2!==t)if(l[0]!==e.Percentage){if(l[0]!==e.Number)return!1;{3!==t&&o.syntaxFlags.add(b.HasNumberValues);let n=normalize(l[4].value,1,0,1);1===t?n=normalize(l[4].value,1,0,1/0):3===t&&(n=normalize(l[4].value,1,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:l[4].value,type:a.Number}])}}else{3!==t&&o.syntaxFlags.add(b.HasPercentageValues);let n=normalize(l[4].value,100,0,1);1===t?n=normalize(l[4].value,250,0,1/0):3===t&&(n=normalize(l[4].value,100,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}else{const a=normalizeHue(l);if(!1===a)return!1;l[0]===e.Dimension&&o.syntaxFlags.add(b.HasDimensionValues),r.push(a)}else o.syntaxFlags.add(b.HasNoneKeywords),r.push([e.Number,"none",l[2],l[3],{value:NaN,type:a.Number}])}return r}function oklch(e,a){return threeChannelSpaceSeparated(e,normalize_OKLCH_ChannelValues,_.OKLCH,[],a)}function normalize_legacy_sRGB_ChannelValues(n,o){const r=[];for(let t=0;t<n.length;t++){const l=n[t];if(l[0]!==e.Percentage){if(l[0]!==e.Number)return!1;{3!==t&&o.syntaxFlags.add(b.HasNumberValues);let n=normalize(l[4].value,255,0,1);3===t&&(n=normalize(l[4].value,1,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}}else{3===t?o.syntaxFlags.add(b.HasPercentageAlpha):o.syntaxFlags.add(b.HasPercentageValues);const n=normalize(l[4].value,100,0,1);r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}}return(!o.syntaxFlags.has(b.HasNumberValues)||!o.syntaxFlags.has(b.HasPercentageValues))&&r}function normalize_modern_sRGB_ChannelValues(n,o){const r=[];for(let t=0;t<n.length;t++){const l=n[t];if(l[0]!==e.Ident||"none"!==toLowerCaseAZ(l[4].value))if(l[0]!==e.Percentage){if(l[0]!==e.Number)return!1;{3!==t&&o.syntaxFlags.add(b.HasNumberValues);let n=normalize(l[4].value,255,0,1);3===t&&(n=normalize(l[4].value,1,0,1)),r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}}else{3!==t&&o.syntaxFlags.add(b.HasPercentageValues);const n=normalize(l[4].value,100,0,1);r.push([e.Number,n.toString(),l[2],l[3],{value:n,type:a.Number}])}else o.syntaxFlags.add(b.HasNoneKeywords),r.push([e.Number,"none",l[2],l[3],{value:NaN,type:a.Number}])}return r}function rgb(a,n){if(a.value.some((a=>c(a)&&a.value[0]===e.Comma))){const e=rgbCommaSeparated(a);if(!1!==e)return e}else{const e=rgbSpaceSeparated(a,n);if(!1!==e)return e}return!1}function rgbCommaSeparated(e){return threeChannelLegacySyntax(e,normalize_legacy_sRGB_ChannelValues,_.RGB,[b.LegacyRGB])}function rgbSpaceSeparated(e,a){return threeChannelSpaceSeparated(e,normalize_modern_sRGB_ChannelValues,_.RGB,[],a)}function toPrecision(e,a=7){e=+e,a=+a;const n=(Math.floor(e)+"").length;if(a>n)return+e.toFixed(a-n);{const o=10**(n-a);return Math.round(e/o)*o}}function XYZ_D50_to_P3_Gamut(e){const a=n.XYZ_D50_to_P3(e);if(o.inGamut(a))return o.clip(a);let l=e.slice();return l=r.D50_to_D65(l),l=r.XYZ_to_OKLab(l),l=r.OKLab_to_OKLCH(l),l[0]<1e-6&&(l=[0,0,0]),l[0]>.999999&&(l=[1,0,0]),t.mapGamut(l,(e=>(e=r.OKLCH_to_OKLab(e),e=r.OKLab_to_XYZ(e),e=r.XYZ_to_lin_P3(e),r.gam_P3(e))),(e=>(e=r.lin_P3(e),e=r.lin_P3_to_XYZ(e),e=r.XYZ_to_OKLab(e),r.OKLab_to_OKLCH(e))))}function serializeP3(o,r=!0){o.channels=convertPowerlessComponentsToMissingComponents(o.channels,o.colorNotation);let t=o.channels.map((e=>Number.isNaN(e)?0:e));o.colorNotation!==_.Display_P3&&(t=r?XYZ_D50_to_P3_Gamut(colorData_to_XYZ_D50(o).channels):n.XYZ_D50_to_P3(colorData_to_XYZ_D50(o).channels));const l=toPrecision(t[0],6),s=toPrecision(t[1],6),u=toPrecision(t[2],6),c=[e.Function,"color(",-1,-1,{value:"color"}],i=[e.CloseParen,")",-1,-1,void 0],N=[e.Whitespace," ",-1,-1,void 0],p=[new h([e.Ident,"display-p3",-1,-1,{value:"display-p3"}]),new h(N),new h([e.Number,l.toString(),-1,-1,{value:t[0],type:a.Number}]),new h(N),new h([e.Number,s.toString(),-1,-1,{value:t[1],type:a.Number}]),new h(N),new h([e.Number,u.toString(),-1,-1,{value:t[2],type:a.Number}])];if("number"==typeof o.alpha){const n=Math.min(1,Math.max(0,toPrecision(Number.isNaN(o.alpha)?0:o.alpha)));return 1===toPrecision(n,4)?new m(c,i,p):new m(c,i,[...p,new h(N),new h([e.Delim,"/",-1,-1,{value:"/"}]),new h(N),new h([e.Number,toPrecision(n,4).toString(),-1,-1,{value:o.alpha,type:a.Integer}])])}return new m(c,i,[...p,new h(N),new h([e.Delim,"/",-1,-1,{value:"/"}]),new h(N),o.alpha])}function serializeRGB(o,t=!0){o.channels=convertPowerlessComponentsToMissingComponents(o.channels,o.colorNotation);let l=o.channels.map((e=>Number.isNaN(e)?0:e));o.colorNotation===_.HWB?l=r.HWB_to_sRGB(l):o.colorNotation===_.HSL?l=r.HSL_to_sRGB(l):o.colorNotation!==_.RGB&&o.colorNotation!==_.HEX&&(l=t?XYZ_D50_to_sRGB_Gamut(colorData_to_XYZ_D50(o).channels):n.XYZ_D50_to_sRGB(colorData_to_XYZ_D50(o).channels));const s=Math.min(255,Math.max(0,Math.round(255*toPrecision(l[0])))),u=Math.min(255,Math.max(0,Math.round(255*toPrecision(l[1])))),c=Math.min(255,Math.max(0,Math.round(255*toPrecision(l[2])))),i=[e.CloseParen,")",-1,-1,void 0],N=[e.Whitespace," ",-1,-1,void 0],p=[e.Comma,",",-1,-1,void 0],b=[new h([e.Number,s.toString(),-1,-1,{value:l[0],type:a.Integer}]),new h(p),new h(N),new h([e.Number,u.toString(),-1,-1,{value:l[1],type:a.Integer}]),new h(p),new h(N),new h([e.Number,c.toString(),-1,-1,{value:l[2],type:a.Integer}])];if("number"==typeof o.alpha){const n=Math.min(1,Math.max(0,toPrecision(Number.isNaN(o.alpha)?0:o.alpha)));return 1===toPrecision(n,4)?new m([e.Function,"rgb(",-1,-1,{value:"rgb"}],i,b):new m([e.Function,"rgba(",-1,-1,{value:"rgba"}],i,[...b,new h(p),new h(N),new h([e.Number,toPrecision(n,4).toString(),-1,-1,{value:o.alpha,type:a.Number}])])}return new m([e.Function,"rgba(",-1,-1,{value:"rgba"}],i,[...b,new h(p),new h(N),o.alpha])}function color(a){if(i(a)){switch(toLowerCaseAZ(a.getName())){case"rgb":case"rgba":return rgb(a,color);case"hsl":case"hsla":return hsl(a,color);case"hwb":return n=color,threeChannelSpaceSeparated(a,normalize_HWB_ChannelValues,_.HWB,[],n);case"lab":return lab(a,color);case"lch":return lch(a,color);case"oklab":return oklab(a,color);case"oklch":return oklch(a,color);case"color":return color$1(a,color);case"color-mix":return colorMix(a,color)}}var n;if(c(a)){if(a.value[0]===e.Hash)return hex(a.value);if(a.value[0]===e.Ident){const e=namedColor(a.value[4].value);return!1!==e?e:"transparent"===toLowerCaseAZ(a.value[4].value)&&{colorNotation:_.RGB,channels:[0,0,0],alpha:0,syntaxFlags:new Set([b.ColorKeyword])}}}return!1}export{_ as ColorNotation,b as SyntaxFlag,color,colorDataFitsRGB_Gamut,colorDataTo,serializeP3,serializeRGB};
