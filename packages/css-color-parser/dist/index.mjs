import{TokenType as e,NumberType as a}from"@csstools/css-tokenizer";import{xyz as n,namedColors as r,utils as o,conversions as t,calculations as l}from"@csstools/color-helpers";import{isWhitespaceNode as s,isCommentNode as u,isTokenNode as i,isFunctionNode as c,TokenNode as m,FunctionNode as h,WhitespaceNode as N}from"@csstools/css-parser-algorithms";import{mathFunctionNames as p,calcFromComponentValues as b}from"@csstools/css-calc";var _,g;function colorData_to_XYZ_D50(e){switch(e.colorNotation){case _.HEX:case _.RGB:case _.sRGB:return{...e,colorNotation:_.XYZ_D50,channels:n.sRGB_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.Linear_sRGB:return{...e,colorNotation:_.XYZ_D50,channels:n.lin_sRGB_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.Display_P3:return{...e,colorNotation:_.XYZ_D50,channels:n.P3_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.Rec2020:return{...e,colorNotation:_.XYZ_D50,channels:n.rec_2020_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.A98_RGB:return{...e,colorNotation:_.XYZ_D50,channels:n.a98_RGB_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.ProPhoto_RGB:return{...e,colorNotation:_.XYZ_D50,channels:n.ProPhoto_RGB_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.HSL:return{...e,colorNotation:_.XYZ_D50,channels:n.HSL_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.HWB:return{...e,colorNotation:_.XYZ_D50,channels:n.HWB_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.Lab:return{...e,colorNotation:_.XYZ_D50,channels:n.Lab_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.OKLab:return{...e,colorNotation:_.XYZ_D50,channels:n.OKLab_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.LCH:return{...e,colorNotation:_.XYZ_D50,channels:n.LCH_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.OKLCH:return{...e,colorNotation:_.XYZ_D50,channels:n.OKLCH_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.XYZ_D50:return{...e,colorNotation:_.XYZ_D50,channels:n.XYZ_D50_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};case _.XYZ_D65:return{...e,colorNotation:_.XYZ_D50,channels:n.XYZ_D65_to_XYZ_D50(e.channels.map((e=>Number.isNaN(e)?0:e)))};default:throw new Error("Unsupported color notation")}}!function(e){e.A98_RGB="a98-rgb",e.Display_P3="display-p3",e.HEX="hex",e.HSL="hsl",e.HWB="hwb",e.LCH="lch",e.Lab="lab",e.Linear_sRGB="srgb-linear",e.OKLCH="oklch",e.OKLab="oklab",e.ProPhoto_RGB="prophoto-rgb",e.RGB="rgb",e.sRGB="srgb",e.Rec2020="rec2020",e.XYZ_D50="xyz-d50",e.XYZ_D65="xyz-d65"}(_||(_={})),function(e){e.ColorKeyword="color-keyword",e.HasAlpha="has-alpha",e.HasDimensionValues="has-dimension-values",e.HasNoneKeywords="has-none-keywords",e.HasNumberValues="has-number-values",e.HasPercentageAlpha="has-percentage-alpha",e.HasPercentageValues="has-percentage-values",e.HasVariableAlpha="has-variable-alpha",e.Hex="hex",e.LegacyHSL="legacy-hsl",e.LegacyRGB="legacy-rgb",e.NamedColor="named-color",e.RelativeColorSyntax="relative-color-syntax",e.ColorMix="color-mix"}(g||(g={}));const f=new Set([_.A98_RGB,_.Display_P3,_.HEX,_.Linear_sRGB,_.ProPhoto_RGB,_.RGB,_.sRGB,_.Rec2020,_.XYZ_D50,_.XYZ_D65]);function colorDataTo(e,a){const r={...e};if(e.colorNotation!==a){const e=colorData_to_XYZ_D50(r);switch(a){case _.HEX:case _.RGB:r.colorNotation=_.RGB,r.channels=n.XYZ_D50_to_sRGB(e.channels);break;case _.sRGB:r.colorNotation=_.sRGB,r.channels=n.XYZ_D50_to_sRGB(e.channels);break;case _.Linear_sRGB:r.colorNotation=_.Linear_sRGB,r.channels=n.XYZ_D50_to_lin_sRGB(e.channels);break;case _.Display_P3:r.colorNotation=_.Display_P3,r.channels=n.XYZ_D50_to_P3(e.channels);break;case _.Rec2020:r.colorNotation=_.Rec2020,r.channels=n.XYZ_D50_to_rec_2020(e.channels);break;case _.ProPhoto_RGB:r.colorNotation=_.ProPhoto_RGB,r.channels=n.XYZ_D50_to_ProPhoto(e.channels);break;case _.A98_RGB:r.colorNotation=_.A98_RGB,r.channels=n.XYZ_D50_to_a98_RGB(e.channels);break;case _.HSL:r.colorNotation=_.HSL,r.channels=n.XYZ_D50_to_HSL(e.channels);break;case _.HWB:r.colorNotation=_.HWB,r.channels=n.XYZ_D50_to_HWB(e.channels);break;case _.Lab:r.colorNotation=_.Lab,r.channels=n.XYZ_D50_to_Lab(e.channels);break;case _.LCH:r.colorNotation=_.LCH,r.channels=n.XYZ_D50_to_LCH(e.channels);break;case _.OKLCH:r.colorNotation=_.OKLCH,r.channels=n.XYZ_D50_to_OKLCH(e.channels);break;case _.OKLab:r.colorNotation=_.OKLab,r.channels=n.XYZ_D50_to_OKLab(e.channels);break;case _.XYZ_D50:r.colorNotation=_.XYZ_D50,r.channels=n.XYZ_D50_to_XYZ_D50(e.channels);break;case _.XYZ_D65:r.colorNotation=_.XYZ_D65,r.channels=n.XYZ_D50_to_XYZ_D65(e.channels);break;default:throw new Error("Unsupported color notation")}}else r.channels=e.channels.map((e=>Number.isNaN(e)?0:e));if(a===e.colorNotation)r.channels=carryForwardMissingComponents(e.channels,[0,1,2],r.channels,[0,1,2]);else if(f.has(a)&&f.has(e.colorNotation))r.channels=carryForwardMissingComponents(e.channels,[0,1,2],r.channels,[0,1,2]);else switch(a){case _.HSL:switch(e.colorNotation){case _.HWB:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[0]);break;case _.Lab:case _.OKLab:r.channels=carryForwardMissingComponents(e.channels,[2],r.channels,[0]);break;case _.LCH:case _.OKLCH:r.channels=carryForwardMissingComponents(e.channels,[0,1,2],r.channels,[2,1,0])}break;case _.HWB:switch(e.colorNotation){case _.HSL:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[0]);break;case _.LCH:case _.OKLCH:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[2])}break;case _.Lab:case _.OKLab:switch(e.colorNotation){case _.HSL:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[2]);break;case _.Lab:case _.OKLab:r.channels=carryForwardMissingComponents(e.channels,[0,1,2],r.channels,[0,1,2]);break;case _.LCH:case _.OKLCH:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[0])}break;case _.LCH:case _.OKLCH:switch(e.colorNotation){case _.HSL:r.channels=carryForwardMissingComponents(e.channels,[0,1,2],r.channels,[2,1,0]);break;case _.HWB:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[2]);break;case _.Lab:case _.OKLab:r.channels=carryForwardMissingComponents(e.channels,[0],r.channels,[0]);break;case _.LCH:case _.OKLCH:r.channels=carryForwardMissingComponents(e.channels,[0,1,2],r.channels,[0,1,2])}}return r.channels=convertPowerlessComponentsToMissingComponents(r.channels,a),r}function convertPowerlessComponentsToMissingComponents(e,a){const n=[...e];switch(a){case _.HSL:reducePrecision(n[1],4)<=0&&(n[0]=NaN);break;case _.HWB:Math.max(0,reducePrecision(n[1],4))+Math.max(0,reducePrecision(n[2],4))>=100&&(n[0]=NaN);break;case _.LCH:reducePrecision(n[1],4)<=0&&(n[2]=NaN);break;case _.OKLCH:reducePrecision(n[1],6)<=0&&(n[2]=NaN)}return n}function convertPowerlessComponentsToZeroValuesForDisplay(e,a){const n=[...e];switch(a){case _.HSL:(reducePrecision(n[2])<=0||reducePrecision(n[2])>=100)&&(n[0]=NaN,n[1]=NaN),reducePrecision(n[1])<=0&&(n[0]=NaN);break;case _.HWB:Math.max(0,reducePrecision(n[1]))+Math.max(0,reducePrecision(n[2]))>=100&&(n[0]=NaN);break;case _.Lab:(reducePrecision(n[0])<=0||reducePrecision(n[0])>=100)&&(n[1]=NaN,n[2]=NaN);break;case _.LCH:reducePrecision(n[1])<=0&&(n[2]=NaN),(reducePrecision(n[0])<=0||reducePrecision(n[0])>=100)&&(n[1]=NaN,n[2]=NaN);break;case _.OKLab:(reducePrecision(n[0])<=0||reducePrecision(n[0])>=1)&&(n[1]=NaN,n[2]=NaN);break;case _.OKLCH:reducePrecision(n[1])<=0&&(n[2]=NaN),(reducePrecision(n[0])<=0||reducePrecision(n[0])>=1)&&(n[1]=NaN,n[2]=NaN)}return n}function carryForwardMissingComponents(e,a,n,r){const o=[...n];for(const n of a)Number.isNaN(e[a[n]])&&(o[r[n]]=NaN);return o}function normalizeRelativeColorDataChannels(e){const a=new Map;switch(e.colorNotation){case _.RGB:case _.HEX:a.set("r",dummyNumberToken(255*e.channels[0])),a.set("g",dummyNumberToken(255*e.channels[1])),a.set("b",dummyNumberToken(255*e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha));break;case _.HSL:a.set("h",dummyNumberToken(e.channels[0])),a.set("s",dummyNumberToken(e.channels[1])),a.set("l",dummyNumberToken(e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha));break;case _.HWB:a.set("h",dummyNumberToken(e.channels[0])),a.set("w",dummyNumberToken(e.channels[1])),a.set("b",dummyNumberToken(e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha));break;case _.Lab:case _.OKLab:a.set("l",dummyNumberToken(e.channels[0])),a.set("a",dummyNumberToken(e.channels[1])),a.set("b",dummyNumberToken(e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha));break;case _.LCH:case _.OKLCH:a.set("l",dummyNumberToken(e.channels[0])),a.set("c",dummyNumberToken(e.channels[1])),a.set("h",dummyNumberToken(e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha));break;case _.sRGB:case _.A98_RGB:case _.Display_P3:case _.Rec2020:case _.Linear_sRGB:case _.ProPhoto_RGB:a.set("r",dummyNumberToken(e.channels[0])),a.set("g",dummyNumberToken(e.channels[1])),a.set("b",dummyNumberToken(e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha));break;case _.XYZ_D50:case _.XYZ_D65:a.set("x",dummyNumberToken(e.channels[0])),a.set("y",dummyNumberToken(e.channels[1])),a.set("z",dummyNumberToken(e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha))}return a}function noneToZeroInRelativeColorDataChannels(e){const a=new Map(e);for(const[n,r]of e)Number.isNaN(r[4].value)&&a.set(n,dummyNumberToken(0));return a}function dummyNumberToken(n){return[e.Number,n.toString(),-1,-1,{value:n,type:a.Number}]}function reducePrecision(e,a=7){if(Number.isNaN(e))return 0;const n=Math.pow(10,a);return Math.round(e*n)/n}function colorDataFitsRGB_Gamut(e){const a=JSON.parse(JSON.stringify(e));a.channels=convertPowerlessComponentsToZeroValuesForDisplay(a.channels,a.colorNotation);return!colorDataTo(a,_.RGB).channels.find((e=>e<-1e-5||e>1.00001))}function normalize(e,a,n,r){return Math.min(Math.max(e/a,n),r)}const v=/[A-Z]/g;function toLowerCaseAZ(e){return e.replace(v,(e=>String.fromCharCode(e.charCodeAt(0)+32)))}function normalize_Color_ChannelValues(n,r,o){if(n[0]===e.Ident&&"none"===toLowerCaseAZ(n[4].value))return o.syntaxFlags.add(g.HasNoneKeywords),[e.Number,"none",n[2],n[3],{value:NaN,type:a.Number}];if(n[0]===e.Percentage){3!==r&&o.syntaxFlags.add(g.HasPercentageValues);let t=normalize(n[4].value,100,-1/0,1/0);return 3===r&&(t=normalize(n[4].value,100,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}if(n[0]===e.Number){3!==r&&o.syntaxFlags.add(g.HasNumberValues);let t=normalize(n[4].value,1,-1/0,1/0);return 3===r&&(t=normalize(n[4].value,1,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}return!1}const d=new Set(["srgb","srgb-linear","display-p3","a98-rgb","prophoto-rgb","rec2020","xyz","xyz-d50","xyz-d65"]);function color$1(a,n){const r=[],o=[],t=[],l=[];let h,N,f=!1,v=!1;const y={colorNotation:_.sRGB,channels:[0,0,0],alpha:1,syntaxFlags:new Set([])};let C=r;for(let _=0;_<a.value.length;_++){let w=a.value[_];if(s(w)||u(w))for(;s(a.value[_+1])||u(a.value[_+1]);)_++;else if(C===r&&r.length&&(C=o),C===o&&o.length&&(C=t),i(w)&&w.value[0]===e.Delim&&"/"===w.value[4].value){if(C===l)return!1;C=l}else{if(c(w)){if(C===l&&"var"===toLowerCaseAZ(w.getName())){y.syntaxFlags.add(g.HasVariableAlpha),C.push(w);continue}if(!p.has(toLowerCaseAZ(w.getName())))return!1;const[[a]]=b([[w]],{toCanonicalUnits:!0,precision:100,globals:N});if(!a||!i(a)||(a.value[0]===e.Percentage||a.value[0]===e.Number||a.value[0]===e.Dimension)&&Number.isNaN(a.value[4].value))return!1;w=a}if(C===r&&0===r.length&&i(w)&&w.value[0]===e.Ident&&d.has(toLowerCaseAZ(w.value[4].value))){if(f)return!1;f=toLowerCaseAZ(w.value[4].value),y.colorNotation=colorSpaceNameToColorNotation(f),v&&(v.colorNotation!==y.colorNotation&&(v=colorDataTo(v,y.colorNotation)),h=normalizeRelativeColorDataChannels(v),N=noneToZeroInRelativeColorDataChannels(h))}else if(C===r&&0===r.length&&i(w)&&w.value[0]===e.Ident&&"from"===toLowerCaseAZ(w.value[4].value)){if(v)return!1;if(f)return!1;for(;s(a.value[_+1])||u(a.value[_+1]);)_++;if(_++,w=a.value[_],v=n(w),!1===v)return!1;y.syntaxFlags.add(g.RelativeColorSyntax)}else{if(!i(w))return!1;if(w.value[0]===e.Ident&&h&&h.has(toLowerCaseAZ(w.value[4].value))){C.push(new m(h.get(toLowerCaseAZ(w.value[4].value))));continue}C.push(w)}}}if(!f)return!1;if(1!==C.length)return!1;if(1!==r.length||1!==o.length||1!==t.length)return!1;if(!i(r[0])||!i(o[0])||!i(t[0]))return!1;if(h&&!h.has("alpha"))return!1;const w=normalize_Color_ChannelValues(r[0].value,0,y);if(!w||w[0]!==e.Number)return!1;const L=normalize_Color_ChannelValues(o[0].value,1,y);if(!L||L[0]!==e.Number)return!1;const H=normalize_Color_ChannelValues(t[0].value,2,y);if(!H||H[0]!==e.Number)return!1;const D=[w,L,H];if(1===l.length)if(y.syntaxFlags.add(g.HasAlpha),i(l[0])){const a=normalize_Color_ChannelValues(l[0].value,3,y);if(!a||a[0]!==e.Number)return!1;D.push(a)}else y.alpha=l[0];else if(h&&h.has("alpha")){const a=normalize_Color_ChannelValues(h.get("alpha"),3,y);if(!a||a[0]!==e.Number)return!1;D.push(a)}return y.channels=[D[0][4].value,D[1][4].value,D[2][4].value],4===D.length&&(y.alpha=D[3][4].value),y}function colorSpaceNameToColorNotation(e){switch(e){case"srgb":return _.sRGB;case"srgb-linear":return _.Linear_sRGB;case"display-p3":return _.Display_P3;case"a98-rgb":return _.A98_RGB;case"prophoto-rgb":return _.ProPhoto_RGB;case"rec2020":return _.Rec2020;case"xyz":case"xyz-d65":return _.XYZ_D65;case"xyz-d50":return _.XYZ_D50;default:throw new Error("Unknown color space name: "+e)}}const y=new Set(["srgb","srgb-linear","lab","oklab","xyz","xyz-d50","xyz-d65"]),C=new Set(["hsl","hwb","lch","oklch"]),w=new Set(["shorter","longer","increasing","decreasing"]);function colorMix(a,n){let r=null,o=null,t=null,l=!1;for(let c=0;c<a.value.length;c++){const m=a.value[c];if(!s(m)&&!u(m)){if(i(m)&&m.value[0]===e.Ident){if(!r&&"in"===toLowerCaseAZ(m.value[4].value)){r=m;continue}if(r&&!o){o=toLowerCaseAZ(m.value[4].value);continue}if(r&&o&&!t&&C.has(o)){t=toLowerCaseAZ(m.value[4].value);continue}if(r&&o&&t&&!l&&"hue"===toLowerCaseAZ(m.value[4].value)){l=!0;continue}return!1}return!(!i(m)||m.value[0]!==e.Comma)&&(!!o&&(t||l?!!(o&&t&&l&&C.has(o)&&w.has(t))&&colorMixPolar(o,t,colorMixComponents(a.value.slice(c+1),n)):y.has(o)?colorMixRectangular(o,colorMixComponents(a.value.slice(c+1),n)):!!C.has(o)&&colorMixPolar(o,"shorter",colorMixComponents(a.value.slice(c+1),n))))}}return!1}function colorMixComponents(a,n){const r=[];let o=1,t=!1,l=!1;for(let o=0;o<a.length;o++){let m=a[o];if(!s(m)&&!u(m)){if(!i(m)||m.value[0]!==e.Comma){if(!t){const e=n(m);if(e){t=e;continue}}if(!l){if(c(m)&&p.has(toLowerCaseAZ(m.getName()))&&([[m]]=b([[m]],{toCanonicalUnits:!0,precision:100}),!m||!i(m)||(m.value[0]===e.Percentage||m.value[0]===e.Number||m.value[0]===e.Dimension)&&Number.isNaN(m.value[4].value)))return!1;if(i(m)&&m.value[0]===e.Percentage&&m.value[4].value>=0){l=m.value[4].value;continue}}return!1}if(!t)return!1;r.push({color:t,percentage:l}),t=!1,l=!1}}if(t&&r.push({color:t,percentage:l}),2!==r.length)return!1;let m=r[0].percentage,h=r[1].percentage;return(!1===m||!(m<0||m>100))&&((!1===h||!(h<0||h>100))&&(!1===m&&!1===h?(m=50,h=50):!1!==m&&!1===h?h=100-m:!1===m&&!1!==h&&(m=100-h),(0!==m||0!==h)&&(!1!==m&&!1!==h&&(m+h>100&&(m=m/(m+h)*100,h=h/(m+h)*100),m+h<100&&(o=(m+h)/100,m=m/(m+h)*100,h=h/(m+h)*100),{a:{color:r[0].color,percentage:m},b:{color:r[1].color,percentage:h},alphaMultiplier:o}))))}function colorMixRectangular(e,a){if(!a)return!1;const n=a.a.color,r=a.b.color,o=a.a.percentage/100;let t=n.channels,l=r.channels,s=_.RGB,u=n.alpha;if("number"!=typeof u)return!1;let i=r.alpha;if("number"!=typeof i)return!1;switch(u=Number.isNaN(u)?i:u,i=Number.isNaN(i)?u:i,e){case"srgb":s=_.RGB;break;case"srgb-linear":s=_.Linear_sRGB;break;case"lab":s=_.Lab;break;case"oklab":s=_.OKLab;break;case"xyz-d50":s=_.XYZ_D50;break;case"xyz":case"xyz-d65":s=_.XYZ_D65}t=colorDataTo(n,s).channels,l=colorDataTo(r,s).channels,t[0]=fillInMissingComponent(t[0],l[0]),l[0]=fillInMissingComponent(l[0],t[0]),t[1]=fillInMissingComponent(t[1],l[1]),l[1]=fillInMissingComponent(l[1],t[1]),t[2]=fillInMissingComponent(t[2],l[2]),l[2]=fillInMissingComponent(l[2],t[2]),t[0]=premultiply(t[0],u),t[1]=premultiply(t[1],u),t[2]=premultiply(t[2],u),l[0]=premultiply(l[0],i),l[1]=premultiply(l[1],i),l[2]=premultiply(l[2],i);const c=interpolate(u,i,o);return{colorNotation:s,channels:[un_premultiply(interpolate(t[0],l[0],o),c),un_premultiply(interpolate(t[1],l[1],o),c),un_premultiply(interpolate(t[2],l[2],o),c)],alpha:c*a.alphaMultiplier,syntaxFlags:new Set([g.ColorMix])}}function colorMixPolar(e,a,n){if(!n)return!1;const r=n.a.color,o=n.b.color,t=n.a.percentage/100;let l=r.channels,s=o.channels,u=0,i=0,c=0,m=0,h=0,N=0,p=_.RGB,b=r.alpha;if("number"!=typeof b)return!1;let f=o.alpha;if("number"!=typeof f)return!1;switch(b=Number.isNaN(b)?f:b,f=Number.isNaN(f)?b:f,e){case"hsl":p=_.HSL;break;case"hwb":p=_.HWB;break;case"lch":p=_.LCH;break;case"oklch":p=_.OKLCH}switch(l=colorDataTo(r,p).channels,s=colorDataTo(o,p).channels,e){case"hsl":case"hwb":u=l[0],i=s[0],c=l[1],m=s[1],h=l[2],N=s[2];break;case"lch":case"oklch":c=l[0],m=s[0],h=l[1],N=s[1],u=l[2],i=s[2]}u=fillInMissingComponent(u,i),Number.isNaN(u)&&(u=0),i=fillInMissingComponent(i,u),Number.isNaN(i)&&(i=0),c=fillInMissingComponent(c,m),m=fillInMissingComponent(m,c),h=fillInMissingComponent(h,N),N=fillInMissingComponent(N,h);const v=i-u;switch(a){case"shorter":v>180?u+=360:v<-180&&(i+=360);break;case"longer":-180<v&&v<180&&(v>0?u+=360:i+=360);break;case"increasing":v<0&&(i+=360);break;case"decreasing":v>0&&(u+=360);break;default:throw new Error("Unknown hue interpolation method")}c=premultiply(c,b),h=premultiply(h,b),m=premultiply(m,f),N=premultiply(N,f);let d=[0,0,0];const y=interpolate(b,f,t);switch(e){case"hsl":case"hwb":d=[interpolate(u,i,t),un_premultiply(interpolate(c,m,t),y),un_premultiply(interpolate(h,N,t),y)];break;case"lch":case"oklch":d=[un_premultiply(interpolate(c,m,t),y),un_premultiply(interpolate(h,N,t),y),interpolate(u,i,t)]}return{colorNotation:p,channels:d,alpha:y*n.alphaMultiplier,syntaxFlags:new Set([g.ColorMix])}}function fillInMissingComponent(e,a){return Number.isNaN(e)?a:e}function interpolate(e,a,n){return e*n+a*(1-n)}function premultiply(e,a){return Number.isNaN(a)?e:Number.isNaN(e)?NaN:e*a}function un_premultiply(e,a){return 0===a||Number.isNaN(a)?e:Number.isNaN(e)?NaN:e/a}function hex(e){const a=toLowerCaseAZ(e[4].value);if(a.match(/[^a-f0-9]/))return!1;const n={colorNotation:_.HEX,channels:[0,0,0],alpha:1,syntaxFlags:new Set([g.Hex])},r=a.length;if(3===r){const e=a[0],r=a[1],o=a[2];return n.channels=[parseInt(e+e,16)/255,parseInt(r+r,16)/255,parseInt(o+o,16)/255],n}if(6===r){const e=a[0]+a[1],r=a[2]+a[3],o=a[4]+a[5];return n.channels=[parseInt(e,16)/255,parseInt(r,16)/255,parseInt(o,16)/255],n}if(4===r){const e=a[0],r=a[1],o=a[2],t=a[3];return n.channels=[parseInt(e+e,16)/255,parseInt(r+r,16)/255,parseInt(o+o,16)/255],n.alpha=parseInt(t+t,16)/255,n.syntaxFlags.add(g.HasAlpha),n}if(8===r){const e=a[0]+a[1],r=a[2]+a[3],o=a[4]+a[5],t=a[6]+a[7];return n.channels=[parseInt(e,16)/255,parseInt(r,16)/255,parseInt(o,16)/255],n.alpha=parseInt(t,16)/255,n.syntaxFlags.add(g.HasAlpha),n}return!1}function normalizeHue(n){if(n[0]===e.Number)return n[4].value=n[4].value%360,n[1]=n[4].value.toString(),n;if(n[0]===e.Dimension){let r=n[4].value;switch(toLowerCaseAZ(n[4].unit)){case"deg":break;case"rad":r=180*n[4].value/Math.PI;break;case"grad":r=.9*n[4].value;break;case"turn":r=360*n[4].value;break;default:return!1}return r%=360,[e.Number,r.toString(),n[2],n[3],{value:r,type:a.Number}]}return!1}function normalize_legacy_HSL_ChannelValues(n,r,o){if(0===r){const a=normalizeHue(n);return!1!==a&&(n[0]===e.Dimension&&o.syntaxFlags.add(g.HasDimensionValues),a)}if(n[0]===e.Percentage){3===r?o.syntaxFlags.add(g.HasPercentageAlpha):o.syntaxFlags.add(g.HasPercentageValues);let t=normalize(n[4].value,1,0,100);return 3===r&&(t=normalize(n[4].value,100,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}if(n[0]===e.Number){if(3!==r)return!1;let o=normalize(n[4].value,1,0,100);return 3===r&&(o=normalize(n[4].value,1,0,1)),[e.Number,o.toString(),n[2],n[3],{value:o,type:a.Number}]}return!1}function normalize_modern_HSL_ChannelValues(n,r,o){if(n[0]===e.Ident&&"none"===toLowerCaseAZ(n[4].value))return o.syntaxFlags.add(g.HasNoneKeywords),[e.Number,"none",n[2],n[3],{value:NaN,type:a.Number}];if(0===r){const a=normalizeHue(n);return!1!==a&&(n[0]===e.Dimension&&o.syntaxFlags.add(g.HasDimensionValues),a)}if(n[0]===e.Percentage){3===r?o.syntaxFlags.add(g.HasPercentageAlpha):o.syntaxFlags.add(g.HasPercentageValues);let t=n[4].value;return 3===r&&(t=normalize(n[4].value,100,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}if(n[0]===e.Number){3!==r&&o.syntaxFlags.add(g.HasNumberValues);let t=n[4].value;return 3===r&&(t=normalize(n[4].value,1,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}return!1}function threeChannelLegacySyntax(a,n,r,o){const t=[],l=[],m=[],h=[],N={colorNotation:r,channels:[0,0,0],alpha:1,syntaxFlags:new Set(o)};let _=t;for(let n=0;n<a.value.length;n++){let r=a.value[n];if(!s(r)&&!u(r)){if(i(r)&&r.value[0]===e.Comma){if(_===t){_=l;continue}if(_===l){_=m;continue}if(_===m){_=h;continue}if(_===h)return!1}if(c(r)){if(_===h&&"var"===toLowerCaseAZ(r.getName())){N.syntaxFlags.add(g.HasVariableAlpha),_.push(r);continue}if(!p.has(toLowerCaseAZ(r.getName())))return!1;const[[a]]=b([[r]],{toCanonicalUnits:!0,precision:100});if(!a||!i(a)||(a.value[0]===e.Percentage||a.value[0]===e.Number||a.value[0]===e.Dimension)&&Number.isNaN(a.value[4].value))return!1;r=a}if(!i(r))return!1;_.push(r)}}if(1!==_.length)return!1;if(1!==t.length||1!==l.length||1!==m.length)return!1;if(!i(t[0])||!i(l[0])||!i(m[0]))return!1;const f=n(t[0].value,0,N);if(!f||f[0]!==e.Number)return!1;const v=n(l[0].value,1,N);if(!v||v[0]!==e.Number)return!1;const d=n(m[0].value,2,N);if(!d||d[0]!==e.Number)return!1;const y=[f,v,d];if(1===h.length)if(N.syntaxFlags.add(g.HasAlpha),i(h[0])){const a=n(h[0].value,3,N);if(!a||a[0]!==e.Number)return!1;y.push(a)}else N.alpha=h[0];return N.channels=[y[0][4].value,y[1][4].value,y[2][4].value],4===y.length&&(N.alpha=y[3][4].value),N}function threeChannelSpaceSeparated(a,n,r,o,t){const l=toLowerCaseAZ(a.getName()),h=[],N=[],_=[],f=[];let v,d,y=!1;const C={colorNotation:r,channels:[0,0,0],alpha:1,syntaxFlags:new Set(o)};let w=h;for(let n=0;n<a.value.length;n++){let o=a.value[n];if(s(o)||u(o))for(;s(a.value[n+1])||u(a.value[n+1]);)n++;else if(w===h&&h.length&&(w=N),w===N&&N.length&&(w=_),i(o)&&o.value[0]===e.Delim&&"/"===o.value[4].value){if(w===f)return!1;w=f}else{if(c(o)){if(w===f&&"var"===toLowerCaseAZ(o.getName())){C.syntaxFlags.add(g.HasVariableAlpha),w.push(o);continue}if(!p.has(toLowerCaseAZ(o.getName())))return!1;const[[a]]=b([[o]],{toCanonicalUnits:!0,precision:100,globals:d});if(!a||!i(a)||(a.value[0]===e.Percentage||a.value[0]===e.Number||a.value[0]===e.Dimension)&&Number.isNaN(a.value[4].value))return!1;o=a}if(w===h&&0===h.length&&i(o)&&o.value[0]===e.Ident&&"from"===toLowerCaseAZ(o.value[4].value)&&"hsla"!==l&&"rgba"!==l){if(y)return!1;for(;s(a.value[n+1])||u(a.value[n+1]);)n++;if(n++,o=a.value[n],y=t(o),!1===y)return!1;C.syntaxFlags.add(g.RelativeColorSyntax),y.colorNotation!==r&&(y=colorDataTo(y,r)),v=normalizeRelativeColorDataChannels(y),d=noneToZeroInRelativeColorDataChannels(v)}else{if(!i(o))return!1;if(o.value[0]===e.Ident&&v&&v.has(toLowerCaseAZ(o.value[4].value))){w.push(new m(v.get(toLowerCaseAZ(o.value[4].value))));continue}w.push(o)}}}if(1!==w.length)return!1;if(1!==h.length||1!==N.length||1!==_.length)return!1;if(!i(h[0])||!i(N[0])||!i(_[0]))return!1;if(v&&!v.has("alpha"))return!1;const L=n(h[0].value,0,C);if(!L||L[0]!==e.Number)return!1;const H=n(N[0].value,1,C);if(!H||H[0]!==e.Number)return!1;const D=n(_[0].value,2,C);if(!D||D[0]!==e.Number)return!1;const Z=[L,H,D];if(1===f.length)if(C.syntaxFlags.add(g.HasAlpha),i(f[0])){const a=n(f[0].value,3,C);if(!a||a[0]!==e.Number)return!1;Z.push(a)}else C.alpha=f[0];else if(v&&v.has("alpha")){const a=n(v.get("alpha"),3,C);if(!a||a[0]!==e.Number)return!1;Z.push(a)}return C.channels=[Z[0][4].value,Z[1][4].value,Z[2][4].value],4===Z.length&&(C.alpha=Z[3][4].value),C}function hsl(a,n){if(a.value.some((a=>i(a)&&a.value[0]===e.Comma))){const e=hslCommaSeparated(a);if(!1!==e)return e}{const e=hslSpaceSeparated(a,n);if(!1!==e)return e}return!1}function hslCommaSeparated(e){return threeChannelLegacySyntax(e,normalize_legacy_HSL_ChannelValues,_.HSL,[g.LegacyHSL])}function hslSpaceSeparated(e,a){return threeChannelSpaceSeparated(e,normalize_modern_HSL_ChannelValues,_.HSL,[],a)}function normalize_HWB_ChannelValues(n,r,o){if(n[0]===e.Ident&&"none"===toLowerCaseAZ(n[4].value))return o.syntaxFlags.add(g.HasNoneKeywords),[e.Number,"none",n[2],n[3],{value:NaN,type:a.Number}];if(0===r){const a=normalizeHue(n);return!1!==a&&(n[0]===e.Dimension&&o.syntaxFlags.add(g.HasDimensionValues),a)}if(n[0]===e.Percentage){3===r?o.syntaxFlags.add(g.HasPercentageAlpha):o.syntaxFlags.add(g.HasPercentageValues);let t=n[4].value;return 3===r&&(t=normalize(n[4].value,100,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}if(n[0]===e.Number){3!==r&&o.syntaxFlags.add(g.HasNumberValues);let t=n[4].value;return 3===r&&(t=normalize(n[4].value,1,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}return!1}function normalize_Lab_ChannelValues(n,r,o){if(n[0]===e.Ident&&"none"===toLowerCaseAZ(n[4].value))return o.syntaxFlags.add(g.HasNoneKeywords),[e.Number,"none",n[2],n[3],{value:NaN,type:a.Number}];if(n[0]===e.Percentage){3!==r&&o.syntaxFlags.add(g.HasPercentageValues);let t=normalize(n[4].value,1,0,100);return 1===r||2===r?t=normalize(n[4].value,.8,-1/0,1/0):3===r&&(t=normalize(n[4].value,100,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}if(n[0]===e.Number){3!==r&&o.syntaxFlags.add(g.HasNumberValues);let t=normalize(n[4].value,1,0,100);return 1===r||2===r?t=normalize(n[4].value,1,-1/0,1/0):3===r&&(t=normalize(n[4].value,1,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}return!1}function lab(e,a){return threeChannelSpaceSeparated(e,normalize_Lab_ChannelValues,_.Lab,[],a)}function normalize_LCH_ChannelValues(n,r,o){if(n[0]===e.Ident&&"none"===toLowerCaseAZ(n[4].value))return o.syntaxFlags.add(g.HasNoneKeywords),[e.Number,"none",n[2],n[3],{value:NaN,type:a.Number}];if(2===r){const a=normalizeHue(n);return!1!==a&&(n[0]===e.Dimension&&o.syntaxFlags.add(g.HasDimensionValues),a)}if(n[0]===e.Percentage){3!==r&&o.syntaxFlags.add(g.HasPercentageValues);let t=normalize(n[4].value,1,0,100);return 1===r?t=normalize(n[4].value,100/150,0,1/0):3===r&&(t=normalize(n[4].value,100,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}if(n[0]===e.Number){3!==r&&o.syntaxFlags.add(g.HasNumberValues);let t=normalize(n[4].value,1,0,100);return 1===r?t=normalize(n[4].value,1,0,1/0):3===r&&(t=normalize(n[4].value,1,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}return!1}function lch(e,a){return threeChannelSpaceSeparated(e,normalize_LCH_ChannelValues,_.LCH,[],a)}const L=new Map;for(const[e,a]of Object.entries(r))L.set(e,a);function namedColor(e){const a=L.get(toLowerCaseAZ(e));return!!a&&{colorNotation:_.RGB,channels:[a[0]/255,a[1]/255,a[2]/255],alpha:1,syntaxFlags:new Set([g.ColorKeyword,g.NamedColor])}}function normalize_OKLab_ChannelValues(n,r,o){if(n[0]===e.Ident&&"none"===toLowerCaseAZ(n[4].value))return o.syntaxFlags.add(g.HasNoneKeywords),[e.Number,"none",n[2],n[3],{value:NaN,type:a.Number}];if(n[0]===e.Percentage){3!==r&&o.syntaxFlags.add(g.HasPercentageValues);let t=normalize(n[4].value,100,0,1);return 1===r||2===r?t=normalize(n[4].value,250,-1/0,1/0):3===r&&(t=normalize(n[4].value,100,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}if(n[0]===e.Number){3!==r&&o.syntaxFlags.add(g.HasNumberValues);let t=normalize(n[4].value,1,0,1);return 1===r||2===r?t=normalize(n[4].value,1,-1/0,1/0):3===r&&(t=normalize(n[4].value,1,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}return!1}function oklab(e,a){return threeChannelSpaceSeparated(e,normalize_OKLab_ChannelValues,_.OKLab,[],a)}function normalize_OKLCH_ChannelValues(n,r,o){if(n[0]===e.Ident&&"none"===toLowerCaseAZ(n[4].value))return o.syntaxFlags.add(g.HasNoneKeywords),[e.Number,"none",n[2],n[3],{value:NaN,type:a.Number}];if(2===r){const a=normalizeHue(n);return!1!==a&&(n[0]===e.Dimension&&o.syntaxFlags.add(g.HasDimensionValues),a)}if(n[0]===e.Percentage){3!==r&&o.syntaxFlags.add(g.HasPercentageValues);let t=normalize(n[4].value,100,0,1);return 1===r?t=normalize(n[4].value,250,0,1/0):3===r&&(t=normalize(n[4].value,100,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}if(n[0]===e.Number){3!==r&&o.syntaxFlags.add(g.HasNumberValues);let t=normalize(n[4].value,1,0,1);return 1===r?t=normalize(n[4].value,1,0,1/0):3===r&&(t=normalize(n[4].value,1,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}return!1}function oklch(e,a){return threeChannelSpaceSeparated(e,normalize_OKLCH_ChannelValues,_.OKLCH,[],a)}function normalize_legacy_sRGB_ChannelValues(n,r,o){if(n[0]===e.Percentage){3===r?o.syntaxFlags.add(g.HasPercentageAlpha):o.syntaxFlags.add(g.HasPercentageValues);const t=normalize(n[4].value,100,0,1);return[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}if(n[0]===e.Number){3!==r&&o.syntaxFlags.add(g.HasNumberValues);let t=normalize(n[4].value,255,0,1);return 3===r&&(t=normalize(n[4].value,1,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}return!1}function normalize_modern_sRGB_ChannelValues(n,r,o){if(n[0]===e.Ident&&"none"===toLowerCaseAZ(n[4].value))return o.syntaxFlags.add(g.HasNoneKeywords),[e.Number,"none",n[2],n[3],{value:NaN,type:a.Number}];if(n[0]===e.Percentage){3!==r&&o.syntaxFlags.add(g.HasPercentageValues);let t=normalize(n[4].value,100,-1/0,1/0);return 3===r&&(t=normalize(n[4].value,100,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}if(n[0]===e.Number){3!==r&&o.syntaxFlags.add(g.HasNumberValues);let t=normalize(n[4].value,255,-1/0,1/0);return 3===r&&(t=normalize(n[4].value,1,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}return!1}function rgb(a,n){if(a.value.some((a=>i(a)&&a.value[0]===e.Comma))){const e=rgbCommaSeparated(a);if(!1!==e)return(!e.syntaxFlags.has(g.HasNumberValues)||!e.syntaxFlags.has(g.HasPercentageValues))&&e}else{const e=rgbSpaceSeparated(a,n);if(!1!==e)return e}return!1}function rgbCommaSeparated(e){return threeChannelLegacySyntax(e,normalize_legacy_sRGB_ChannelValues,_.RGB,[g.LegacyRGB])}function rgbSpaceSeparated(e,a){return threeChannelSpaceSeparated(e,normalize_modern_sRGB_ChannelValues,_.RGB,[],a)}function toPrecision(e,a=7){e=+e,a=+a;const n=(Math.floor(e)+"").length;if(a>n)return+e.toFixed(a-n);{const r=10**(n-a);return Math.round(e/r)*r}}function XYZ_D50_to_P3_Gamut(e){const a=n.XYZ_D50_to_P3(e);if(o.inGamut(a))return o.clip(a);let r=e.slice();return r=t.D50_to_D65(r),r=t.XYZ_to_OKLab(r),r=t.OKLab_to_OKLCH(r),r[0]<1e-6&&(r=[0,0,0]),r[0]>.999999&&(r=[1,0,0]),l.mapGamut(r,(e=>(e=t.OKLCH_to_OKLab(e),e=t.OKLab_to_XYZ(e),e=t.XYZ_to_lin_P3(e),t.gam_P3(e))),(e=>(e=t.lin_P3(e),e=t.lin_P3_to_XYZ(e),e=t.XYZ_to_OKLab(e),t.OKLab_to_OKLCH(e))))}function serializeWithAlpha(n,r,o,t){const l=[e.CloseParen,")",-1,-1,void 0];if("number"==typeof n.alpha){const s=Math.min(1,Math.max(0,toPrecision(Number.isNaN(n.alpha)?0:n.alpha)));return 1===toPrecision(s,4)?new h(r,l,t):new h(r,l,[...t,new N([o]),new m([e.Delim,"/",-1,-1,{value:"/"}]),new N([o]),new m([e.Number,toPrecision(s,4).toString(),-1,-1,{value:n.alpha,type:a.Integer}])])}return new h(r,l,[...t,new N([o]),new m([e.Delim,"/",-1,-1,{value:"/"}]),new N([o]),n.alpha])}function serializeP3(r,o=!0){r.channels=convertPowerlessComponentsToZeroValuesForDisplay(r.channels,r.colorNotation);let t=r.channels.map((e=>Number.isNaN(e)?0:e));r.colorNotation!==_.Display_P3&&(t=o?XYZ_D50_to_P3_Gamut(colorData_to_XYZ_D50(r).channels):n.XYZ_D50_to_P3(colorData_to_XYZ_D50(r).channels));const l=toPrecision(t[0],6),s=toPrecision(t[1],6),u=toPrecision(t[2],6),i=[e.Function,"color(",-1,-1,{value:"color"}],c=[e.Whitespace," ",-1,-1,void 0];return serializeWithAlpha(r,i,c,[new m([e.Ident,"display-p3",-1,-1,{value:"display-p3"}]),new N([c]),new m([e.Number,l.toString(),-1,-1,{value:t[0],type:a.Number}]),new N([c]),new m([e.Number,s.toString(),-1,-1,{value:t[1],type:a.Number}]),new N([c]),new m([e.Number,u.toString(),-1,-1,{value:t[2],type:a.Number}])])}function XYZ_D50_to_sRGB_Gamut(e){const a=n.XYZ_D50_to_sRGB(e);if(o.inGamut(a))return o.clip(a);let r=e.slice();return r=t.D50_to_D65(r),r=t.XYZ_to_OKLab(r),r=t.OKLab_to_OKLCH(r),r[0]<1e-6&&(r=[0,0,0]),r[0]>.999999&&(r=[1,0,0]),l.mapGamut(r,(e=>(e=t.OKLCH_to_OKLab(e),e=t.OKLab_to_XYZ(e),e=t.XYZ_to_lin_sRGB(e),t.gam_sRGB(e))),(e=>(e=t.lin_sRGB(e),e=t.lin_sRGB_to_XYZ(e),e=t.XYZ_to_OKLab(e),t.OKLab_to_OKLCH(e))))}function serializeRGB(r,o=!0){r.channels=convertPowerlessComponentsToZeroValuesForDisplay(r.channels,r.colorNotation);let t=r.channels.map((e=>Number.isNaN(e)?0:e));t=o?XYZ_D50_to_sRGB_Gamut(colorData_to_XYZ_D50(r).channels):n.XYZ_D50_to_sRGB(colorData_to_XYZ_D50(r).channels);const l=Math.min(255,Math.max(0,Math.round(255*toPrecision(t[0])))),s=Math.min(255,Math.max(0,Math.round(255*toPrecision(t[1])))),u=Math.min(255,Math.max(0,Math.round(255*toPrecision(t[2])))),i=[e.CloseParen,")",-1,-1,void 0],c=[e.Whitespace," ",-1,-1,void 0],p=[e.Comma,",",-1,-1,void 0],b=[new m([e.Number,l.toString(),-1,-1,{value:t[0],type:a.Integer}]),new m(p),new N([c]),new m([e.Number,s.toString(),-1,-1,{value:t[1],type:a.Integer}]),new m(p),new N([c]),new m([e.Number,u.toString(),-1,-1,{value:t[2],type:a.Integer}])];if("number"==typeof r.alpha){const n=Math.min(1,Math.max(0,toPrecision(Number.isNaN(r.alpha)?0:r.alpha)));return 1===toPrecision(n,4)?new h([e.Function,"rgb(",-1,-1,{value:"rgb"}],i,b):new h([e.Function,"rgba(",-1,-1,{value:"rgba"}],i,[...b,new m(p),new N([c]),new m([e.Number,toPrecision(n,4).toString(),-1,-1,{value:r.alpha,type:a.Number}])])}return new h([e.Function,"rgba(",-1,-1,{value:"rgba"}],i,[...b,new m(p),new N([c]),r.alpha])}function serializeOKLCH(r){r.channels=convertPowerlessComponentsToZeroValuesForDisplay(r.channels,r.colorNotation);let o=r.channels.map((e=>Number.isNaN(e)?0:e));r.colorNotation!==_.OKLCH&&(o=n.XYZ_D50_to_OKLCH(colorData_to_XYZ_D50(r).channels));const t=toPrecision(o[0],6),l=toPrecision(o[1],6),s=toPrecision(o[2],6),u=[e.Function,"oklch(",-1,-1,{value:"oklch"}],i=[e.Whitespace," ",-1,-1,void 0];return serializeWithAlpha(r,u,i,[new m([e.Number,t.toString(),-1,-1,{value:o[0],type:a.Number}]),new N([i]),new m([e.Number,l.toString(),-1,-1,{value:o[1],type:a.Number}]),new N([i]),new m([e.Number,s.toString(),-1,-1,{value:o[2],type:a.Number}])])}function color(a){if(c(a)){switch(toLowerCaseAZ(a.getName())){case"rgb":case"rgba":return rgb(a,color);case"hsl":case"hsla":return hsl(a,color);case"hwb":return n=color,threeChannelSpaceSeparated(a,normalize_HWB_ChannelValues,_.HWB,[],n);case"lab":return lab(a,color);case"lch":return lch(a,color);case"oklab":return oklab(a,color);case"oklch":return oklch(a,color);case"color":return color$1(a,color);case"color-mix":return colorMix(a,color)}}var n;if(i(a)){if(a.value[0]===e.Hash)return hex(a.value);if(a.value[0]===e.Ident){const e=namedColor(a.value[4].value);return!1!==e?e:"transparent"===toLowerCaseAZ(a.value[4].value)&&{colorNotation:_.RGB,channels:[0,0,0],alpha:0,syntaxFlags:new Set([g.ColorKeyword])}}}return!1}export{_ as ColorNotation,g as SyntaxFlag,color,colorDataFitsRGB_Gamut,colorDataTo,serializeOKLCH,serializeP3,serializeRGB};
