import{TokenType as e,NumberType as a}from"@csstools/css-tokenizer";import{XYZ_D65_to_XYZ_D50 as n,XYZ_D50_to_XYZ_D50 as r,OKLCH_to_XYZ_D50 as o,LCH_to_XYZ_D50 as t,OKLab_to_XYZ_D50 as l,Lab_to_XYZ_D50 as s,HWB_to_XYZ_D50 as u,HSL_to_XYZ_D50 as i,ProPhoto_RGB_to_XYZ_D50 as c,a98_RGB_to_XYZ_D50 as m,rec_2020_to_XYZ_D50 as h,P3_to_XYZ_D50 as N,lin_sRGB_to_XYZ_D50 as p,sRGB_to_XYZ_D50 as b,XYZ_D50_to_XYZ_D65 as g,XYZ_D50_to_OKLab as v,XYZ_D50_to_OKLCH as d,XYZ_D50_to_LCH as f,XYZ_D50_to_Lab as y,XYZ_D50_to_HWB as C,XYZ_D50_to_HSL as w,XYZ_D50_to_a98_RGB as _,XYZ_D50_to_ProPhoto as H,XYZ_D50_to_rec_2020 as x,XYZ_D50_to_P3 as L,XYZ_D50_to_lin_sRGB as P,XYZ_D50_to_sRGB as D,namedColors as S,inGamut as k,clip as z,mapGamut as F,OKLCH_to_OKLab as M,OKLab_to_XYZ as Z,XYZ_to_lin_P3 as R,gam_P3 as B,lin_P3 as G,lin_P3_to_XYZ as V,XYZ_to_OKLab as T,OKLab_to_OKLCH as A,XYZ_to_lin_sRGB as I,gam_sRGB as X,lin_sRGB as K,lin_sRGB_to_XYZ as Y}from"@csstools/color-helpers";import{isWhitespaceNode as O,isCommentNode as E,isTokenNode as W,isFunctionNode as U,TokenNode as $,FunctionNode as j,WhitespaceNode as q}from"@csstools/css-parser-algorithms";import{mathFunctionNames as J,calcFromComponentValues as Q}from"@csstools/css-calc";var ee,ae;function colorData_to_XYZ_D50(e){switch(e.colorNotation){case ee.HEX:case ee.RGB:case ee.sRGB:return{...e,colorNotation:ee.XYZ_D50,channels:b(e.channels.map((e=>Number.isNaN(e)?0:e)))};case ee.Linear_sRGB:return{...e,colorNotation:ee.XYZ_D50,channels:p(e.channels.map((e=>Number.isNaN(e)?0:e)))};case ee.Display_P3:return{...e,colorNotation:ee.XYZ_D50,channels:N(e.channels.map((e=>Number.isNaN(e)?0:e)))};case ee.Rec2020:return{...e,colorNotation:ee.XYZ_D50,channels:h(e.channels.map((e=>Number.isNaN(e)?0:e)))};case ee.A98_RGB:return{...e,colorNotation:ee.XYZ_D50,channels:m(e.channels.map((e=>Number.isNaN(e)?0:e)))};case ee.ProPhoto_RGB:return{...e,colorNotation:ee.XYZ_D50,channels:c(e.channels.map((e=>Number.isNaN(e)?0:e)))};case ee.HSL:return{...e,colorNotation:ee.XYZ_D50,channels:i(e.channels.map((e=>Number.isNaN(e)?0:e)))};case ee.HWB:return{...e,colorNotation:ee.XYZ_D50,channels:u(e.channels.map((e=>Number.isNaN(e)?0:e)))};case ee.Lab:return{...e,colorNotation:ee.XYZ_D50,channels:s(e.channels.map((e=>Number.isNaN(e)?0:e)))};case ee.OKLab:return{...e,colorNotation:ee.XYZ_D50,channels:l(e.channels.map((e=>Number.isNaN(e)?0:e)))};case ee.LCH:return{...e,colorNotation:ee.XYZ_D50,channels:t(e.channels.map((e=>Number.isNaN(e)?0:e)))};case ee.OKLCH:return{...e,colorNotation:ee.XYZ_D50,channels:o(e.channels.map((e=>Number.isNaN(e)?0:e)))};case ee.XYZ_D50:return{...e,colorNotation:ee.XYZ_D50,channels:r(e.channels.map((e=>Number.isNaN(e)?0:e)))};case ee.XYZ_D65:return{...e,colorNotation:ee.XYZ_D50,channels:n(e.channels.map((e=>Number.isNaN(e)?0:e)))};default:throw new Error("Unsupported color notation")}}!function(e){e.A98_RGB="a98-rgb",e.Display_P3="display-p3",e.HEX="hex",e.HSL="hsl",e.HWB="hwb",e.LCH="lch",e.Lab="lab",e.Linear_sRGB="srgb-linear",e.OKLCH="oklch",e.OKLab="oklab",e.ProPhoto_RGB="prophoto-rgb",e.RGB="rgb",e.sRGB="srgb",e.Rec2020="rec2020",e.XYZ_D50="xyz-d50",e.XYZ_D65="xyz-d65"}(ee||(ee={})),function(e){e.ColorKeyword="color-keyword",e.HasAlpha="has-alpha",e.HasDimensionValues="has-dimension-values",e.HasNoneKeywords="has-none-keywords",e.HasNumberValues="has-number-values",e.HasPercentageAlpha="has-percentage-alpha",e.HasPercentageValues="has-percentage-values",e.HasVariableAlpha="has-variable-alpha",e.Hex="hex",e.LegacyHSL="legacy-hsl",e.LegacyRGB="legacy-rgb",e.NamedColor="named-color",e.RelativeColorSyntax="relative-color-syntax",e.ColorMix="color-mix",e.Experimental="experimental"}(ae||(ae={}));const ne=new Set([ee.A98_RGB,ee.Display_P3,ee.HEX,ee.Linear_sRGB,ee.ProPhoto_RGB,ee.RGB,ee.sRGB,ee.Rec2020,ee.XYZ_D50,ee.XYZ_D65]);function colorDataTo(e,a){const n={...e};if(e.colorNotation!==a){const e=colorData_to_XYZ_D50(n);switch(a){case ee.HEX:case ee.RGB:n.colorNotation=ee.RGB,n.channels=D(e.channels);break;case ee.sRGB:n.colorNotation=ee.sRGB,n.channels=D(e.channels);break;case ee.Linear_sRGB:n.colorNotation=ee.Linear_sRGB,n.channels=P(e.channels);break;case ee.Display_P3:n.colorNotation=ee.Display_P3,n.channels=L(e.channels);break;case ee.Rec2020:n.colorNotation=ee.Rec2020,n.channels=x(e.channels);break;case ee.ProPhoto_RGB:n.colorNotation=ee.ProPhoto_RGB,n.channels=H(e.channels);break;case ee.A98_RGB:n.colorNotation=ee.A98_RGB,n.channels=_(e.channels);break;case ee.HSL:n.colorNotation=ee.HSL,n.channels=w(e.channels);break;case ee.HWB:n.colorNotation=ee.HWB,n.channels=C(e.channels);break;case ee.Lab:n.colorNotation=ee.Lab,n.channels=y(e.channels);break;case ee.LCH:n.colorNotation=ee.LCH,n.channels=f(e.channels);break;case ee.OKLCH:n.colorNotation=ee.OKLCH,n.channels=d(e.channels);break;case ee.OKLab:n.colorNotation=ee.OKLab,n.channels=v(e.channels);break;case ee.XYZ_D50:n.colorNotation=ee.XYZ_D50,n.channels=r(e.channels);break;case ee.XYZ_D65:n.colorNotation=ee.XYZ_D65,n.channels=g(e.channels);break;default:throw new Error("Unsupported color notation")}}else n.channels=e.channels.map((e=>Number.isNaN(e)?0:e));if(a===e.colorNotation)n.channels=carryForwardMissingComponents(e.channels,[0,1,2],n.channels,[0,1,2]);else if(ne.has(a)&&ne.has(e.colorNotation))n.channels=carryForwardMissingComponents(e.channels,[0,1,2],n.channels,[0,1,2]);else switch(a){case ee.HSL:switch(e.colorNotation){case ee.HWB:n.channels=carryForwardMissingComponents(e.channels,[0],n.channels,[0]);break;case ee.Lab:case ee.OKLab:n.channels=carryForwardMissingComponents(e.channels,[2],n.channels,[0]);break;case ee.LCH:case ee.OKLCH:n.channels=carryForwardMissingComponents(e.channels,[0,1,2],n.channels,[2,1,0])}break;case ee.HWB:switch(e.colorNotation){case ee.HSL:n.channels=carryForwardMissingComponents(e.channels,[0],n.channels,[0]);break;case ee.LCH:case ee.OKLCH:n.channels=carryForwardMissingComponents(e.channels,[0],n.channels,[2])}break;case ee.Lab:case ee.OKLab:switch(e.colorNotation){case ee.HSL:n.channels=carryForwardMissingComponents(e.channels,[0],n.channels,[2]);break;case ee.Lab:case ee.OKLab:n.channels=carryForwardMissingComponents(e.channels,[0,1,2],n.channels,[0,1,2]);break;case ee.LCH:case ee.OKLCH:n.channels=carryForwardMissingComponents(e.channels,[0],n.channels,[0])}break;case ee.LCH:case ee.OKLCH:switch(e.colorNotation){case ee.HSL:n.channels=carryForwardMissingComponents(e.channels,[0,1,2],n.channels,[2,1,0]);break;case ee.HWB:n.channels=carryForwardMissingComponents(e.channels,[0],n.channels,[2]);break;case ee.Lab:case ee.OKLab:n.channels=carryForwardMissingComponents(e.channels,[0],n.channels,[0]);break;case ee.LCH:case ee.OKLCH:n.channels=carryForwardMissingComponents(e.channels,[0,1,2],n.channels,[0,1,2])}}return n.channels=convertPowerlessComponentsToMissingComponents(n.channels,a),n}function convertPowerlessComponentsToMissingComponents(e,a){const n=[...e];switch(a){case ee.HSL:reducePrecision(n[1],4)<=0&&(n[0]=NaN);break;case ee.HWB:Math.max(0,reducePrecision(n[1],4))+Math.max(0,reducePrecision(n[2],4))>=100&&(n[0]=NaN);break;case ee.LCH:reducePrecision(n[1],4)<=0&&(n[2]=NaN);break;case ee.OKLCH:reducePrecision(n[1],6)<=0&&(n[2]=NaN)}return n}function convertPowerlessComponentsToZeroValuesForDisplay(e,a){const n=[...e];switch(a){case ee.HSL:(reducePrecision(n[2])<=0||reducePrecision(n[2])>=100)&&(n[0]=NaN,n[1]=NaN),reducePrecision(n[1])<=0&&(n[0]=NaN);break;case ee.HWB:Math.max(0,reducePrecision(n[1]))+Math.max(0,reducePrecision(n[2]))>=100&&(n[0]=NaN);break;case ee.Lab:(reducePrecision(n[0])<=0||reducePrecision(n[0])>=100)&&(n[1]=NaN,n[2]=NaN);break;case ee.LCH:reducePrecision(n[1])<=0&&(n[2]=NaN),(reducePrecision(n[0])<=0||reducePrecision(n[0])>=100)&&(n[1]=NaN,n[2]=NaN);break;case ee.OKLab:(reducePrecision(n[0])<=0||reducePrecision(n[0])>=1)&&(n[1]=NaN,n[2]=NaN);break;case ee.OKLCH:reducePrecision(n[1])<=0&&(n[2]=NaN),(reducePrecision(n[0])<=0||reducePrecision(n[0])>=1)&&(n[1]=NaN,n[2]=NaN)}return n}function carryForwardMissingComponents(e,a,n,r){const o=[...n];for(const n of a)Number.isNaN(e[a[n]])&&(o[r[n]]=NaN);return o}function normalizeRelativeColorDataChannels(e){const a=new Map;switch(e.colorNotation){case ee.RGB:case ee.HEX:a.set("r",dummyNumberToken(255*e.channels[0])),a.set("g",dummyNumberToken(255*e.channels[1])),a.set("b",dummyNumberToken(255*e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha));break;case ee.HSL:a.set("h",dummyNumberToken(e.channels[0])),a.set("s",dummyNumberToken(e.channels[1])),a.set("l",dummyNumberToken(e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha));break;case ee.HWB:a.set("h",dummyNumberToken(e.channels[0])),a.set("w",dummyNumberToken(e.channels[1])),a.set("b",dummyNumberToken(e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha));break;case ee.Lab:case ee.OKLab:a.set("l",dummyNumberToken(e.channels[0])),a.set("a",dummyNumberToken(e.channels[1])),a.set("b",dummyNumberToken(e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha));break;case ee.LCH:case ee.OKLCH:a.set("l",dummyNumberToken(e.channels[0])),a.set("c",dummyNumberToken(e.channels[1])),a.set("h",dummyNumberToken(e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha));break;case ee.sRGB:case ee.A98_RGB:case ee.Display_P3:case ee.Rec2020:case ee.Linear_sRGB:case ee.ProPhoto_RGB:a.set("r",dummyNumberToken(e.channels[0])),a.set("g",dummyNumberToken(e.channels[1])),a.set("b",dummyNumberToken(e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha));break;case ee.XYZ_D50:case ee.XYZ_D65:a.set("x",dummyNumberToken(e.channels[0])),a.set("y",dummyNumberToken(e.channels[1])),a.set("z",dummyNumberToken(e.channels[2])),"number"==typeof e.alpha&&a.set("alpha",dummyNumberToken(e.alpha))}return a}function noneToZeroInRelativeColorDataChannels(e){const a=new Map(e);for(const[n,r]of e)Number.isNaN(r[4].value)&&a.set(n,dummyNumberToken(0));return a}function dummyNumberToken(n){return[e.Number,n.toString(),-1,-1,{value:n,type:a.Number}]}function reducePrecision(e,a=7){if(Number.isNaN(e))return 0;const n=Math.pow(10,a);return Math.round(e*n)/n}function colorDataFitsRGB_Gamut(e){const a={...e,channels:[...e.channels]};a.channels=convertPowerlessComponentsToZeroValuesForDisplay(a.channels,a.colorNotation);return!colorDataTo(a,ee.RGB).channels.find((e=>e<-1e-5||e>1.00001))}function colorDataFitsDisplayP3_Gamut(e){const a={...e,channels:[...e.channels]};a.channels=convertPowerlessComponentsToZeroValuesForDisplay(a.channels,a.colorNotation);return!colorDataTo(a,ee.Display_P3).channels.find((e=>e<-1e-5||e>1.00001))}function normalize(e,a,n,r){return Math.min(Math.max(e/a,n),r)}const re=/[A-Z]/g;function toLowerCaseAZ(e){return e.replace(re,(e=>String.fromCharCode(e.charCodeAt(0)+32)))}function normalize_Color_ChannelValues(n,r,o){if(n[0]===e.Ident&&"none"===toLowerCaseAZ(n[4].value))return o.syntaxFlags.add(ae.HasNoneKeywords),[e.Number,"none",n[2],n[3],{value:NaN,type:a.Number}];if(n[0]===e.Percentage){3!==r&&o.syntaxFlags.add(ae.HasPercentageValues);let t=normalize(n[4].value,100,-1/0,1/0);return 3===r&&(t=normalize(n[4].value,100,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}if(n[0]===e.Number){3!==r&&o.syntaxFlags.add(ae.HasNumberValues);let t=normalize(n[4].value,1,-1/0,1/0);return 3===r&&(t=normalize(n[4].value,1,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}return!1}const oe=new Set(["srgb","srgb-linear","display-p3","a98-rgb","prophoto-rgb","rec2020","xyz","xyz-d50","xyz-d65"]);function color$1(a,n){const r=[],o=[],t=[],l=[];let s,u,i=!1,c=!1;const m={colorNotation:ee.sRGB,channels:[0,0,0],alpha:1,syntaxFlags:new Set([])};let h=r;for(let N=0;N<a.value.length;N++){let p=a.value[N];if(O(p)||E(p))for(;O(a.value[N+1])||E(a.value[N+1]);)N++;else if(h===r&&r.length&&(h=o),h===o&&o.length&&(h=t),W(p)&&p.value[0]===e.Delim&&"/"===p.value[4].value){if(h===l)return!1;h=l}else{if(U(p)){if(h===l&&"var"===toLowerCaseAZ(p.getName())){m.syntaxFlags.add(ae.HasVariableAlpha),h.push(p);continue}if(!J.has(toLowerCaseAZ(p.getName())))return!1;const[[a]]=Q([[p]],{toCanonicalUnits:!0,precision:100,globals:u});if(!a||!W(a)||(a.value[0]===e.Percentage||a.value[0]===e.Number||a.value[0]===e.Dimension)&&Number.isNaN(a.value[4].value))return!1;p=a}if(h===r&&0===r.length&&W(p)&&p.value[0]===e.Ident&&oe.has(toLowerCaseAZ(p.value[4].value))){if(i)return!1;i=toLowerCaseAZ(p.value[4].value),m.colorNotation=colorSpaceNameToColorNotation(i),c&&(c.colorNotation!==m.colorNotation&&(c=colorDataTo(c,m.colorNotation)),s=normalizeRelativeColorDataChannels(c),u=noneToZeroInRelativeColorDataChannels(s))}else if(h===r&&0===r.length&&W(p)&&p.value[0]===e.Ident&&"from"===toLowerCaseAZ(p.value[4].value)){if(c)return!1;if(i)return!1;for(;O(a.value[N+1])||E(a.value[N+1]);)N++;if(N++,p=a.value[N],c=n(p),!1===c)return!1;c.syntaxFlags.has(ae.Experimental)&&m.syntaxFlags.add(ae.Experimental),m.syntaxFlags.add(ae.RelativeColorSyntax)}else{if(!W(p))return!1;if(p.value[0]===e.Ident&&s&&s.has(toLowerCaseAZ(p.value[4].value))){h.push(new $(s.get(toLowerCaseAZ(p.value[4].value))));continue}h.push(p)}}}if(!i)return!1;if(1!==h.length)return!1;if(1!==r.length||1!==o.length||1!==t.length)return!1;if(!W(r[0])||!W(o[0])||!W(t[0]))return!1;if(s&&!s.has("alpha"))return!1;const N=normalize_Color_ChannelValues(r[0].value,0,m);if(!N||N[0]!==e.Number)return!1;const p=normalize_Color_ChannelValues(o[0].value,1,m);if(!p||p[0]!==e.Number)return!1;const b=normalize_Color_ChannelValues(t[0].value,2,m);if(!b||b[0]!==e.Number)return!1;const g=[N,p,b];if(1===l.length)if(m.syntaxFlags.add(ae.HasAlpha),W(l[0])){const a=normalize_Color_ChannelValues(l[0].value,3,m);if(!a||a[0]!==e.Number)return!1;g.push(a)}else m.alpha=l[0];else if(s&&s.has("alpha")){const a=normalize_Color_ChannelValues(s.get("alpha"),3,m);if(!a||a[0]!==e.Number)return!1;g.push(a)}return m.channels=[g[0][4].value,g[1][4].value,g[2][4].value],4===g.length&&(m.alpha=g[3][4].value),m}function colorSpaceNameToColorNotation(e){switch(e){case"srgb":return ee.sRGB;case"srgb-linear":return ee.Linear_sRGB;case"display-p3":return ee.Display_P3;case"a98-rgb":return ee.A98_RGB;case"prophoto-rgb":return ee.ProPhoto_RGB;case"rec2020":return ee.Rec2020;case"xyz":case"xyz-d65":return ee.XYZ_D65;case"xyz-d50":return ee.XYZ_D50;default:throw new Error("Unknown color space name: "+e)}}const te=new Set(["srgb","srgb-linear","lab","oklab","xyz","xyz-d50","xyz-d65"]),le=new Set(["hsl","hwb","lch","oklch"]),se=new Set(["shorter","longer","increasing","decreasing"]);function colorMix(a,n){let r=null,o=null,t=null,l=!1;for(let s=0;s<a.value.length;s++){const u=a.value[s];if(!O(u)&&!E(u)){if(W(u)&&u.value[0]===e.Ident){if(!r&&"in"===toLowerCaseAZ(u.value[4].value)){r=u;continue}if(r&&!o){o=toLowerCaseAZ(u.value[4].value);continue}if(r&&o&&!t&&le.has(o)){t=toLowerCaseAZ(u.value[4].value);continue}if(r&&o&&t&&!l&&"hue"===toLowerCaseAZ(u.value[4].value)){l=!0;continue}return!1}return!(!W(u)||u.value[0]!==e.Comma)&&(!!o&&(t||l?!!(o&&t&&l&&le.has(o)&&se.has(t))&&colorMixPolar(o,t,colorMixComponents(a.value.slice(s+1),n)):te.has(o)?colorMixRectangular(o,colorMixComponents(a.value.slice(s+1),n)):!!le.has(o)&&colorMixPolar(o,"shorter",colorMixComponents(a.value.slice(s+1),n))))}}return!1}function colorMixComponents(a,n){const r=[];let o=1,t=!1,l=!1;for(let o=0;o<a.length;o++){let s=a[o];if(!O(s)&&!E(s)){if(!W(s)||s.value[0]!==e.Comma){if(!t){const e=n(s);if(e){t=e;continue}}if(!l){if(U(s)&&J.has(toLowerCaseAZ(s.getName()))&&([[s]]=Q([[s]],{toCanonicalUnits:!0,precision:100}),!s||!W(s)||(s.value[0]===e.Percentage||s.value[0]===e.Number||s.value[0]===e.Dimension)&&Number.isNaN(s.value[4].value)))return!1;if(W(s)&&s.value[0]===e.Percentage&&s.value[4].value>=0){l=s.value[4].value;continue}}return!1}if(!t)return!1;r.push({color:t,percentage:l}),t=!1,l=!1}}if(t&&r.push({color:t,percentage:l}),2!==r.length)return!1;let s=r[0].percentage,u=r[1].percentage;return(!1===s||!(s<0||s>100))&&((!1===u||!(u<0||u>100))&&(!1===s&&!1===u?(s=50,u=50):!1!==s&&!1===u?u=100-s:!1===s&&!1!==u&&(s=100-u),(0!==s||0!==u)&&(!1!==s&&!1!==u&&(s+u>100&&(s=s/(s+u)*100,u=u/(s+u)*100),s+u<100&&(o=(s+u)/100,s=s/(s+u)*100,u=u/(s+u)*100),{a:{color:r[0].color,percentage:s},b:{color:r[1].color,percentage:u},alphaMultiplier:o}))))}function colorMixRectangular(e,a){if(!a)return!1;const n=a.a.color,r=a.b.color,o=a.a.percentage/100;let t=n.channels,l=r.channels,s=ee.RGB,u=n.alpha;if("number"!=typeof u)return!1;let i=r.alpha;if("number"!=typeof i)return!1;switch(u=Number.isNaN(u)?i:u,i=Number.isNaN(i)?u:i,e){case"srgb":s=ee.RGB;break;case"srgb-linear":s=ee.Linear_sRGB;break;case"lab":s=ee.Lab;break;case"oklab":s=ee.OKLab;break;case"xyz-d50":s=ee.XYZ_D50;break;case"xyz":case"xyz-d65":s=ee.XYZ_D65}t=colorDataTo(n,s).channels,l=colorDataTo(r,s).channels,t[0]=fillInMissingComponent(t[0],l[0]),l[0]=fillInMissingComponent(l[0],t[0]),t[1]=fillInMissingComponent(t[1],l[1]),l[1]=fillInMissingComponent(l[1],t[1]),t[2]=fillInMissingComponent(t[2],l[2]),l[2]=fillInMissingComponent(l[2],t[2]),t[0]=premultiply(t[0],u),t[1]=premultiply(t[1],u),t[2]=premultiply(t[2],u),l[0]=premultiply(l[0],i),l[1]=premultiply(l[1],i),l[2]=premultiply(l[2],i);const c=interpolate(u,i,o),m={colorNotation:s,channels:[un_premultiply(interpolate(t[0],l[0],o),c),un_premultiply(interpolate(t[1],l[1],o),c),un_premultiply(interpolate(t[2],l[2],o),c)],alpha:c*a.alphaMultiplier,syntaxFlags:new Set([ae.ColorMix])};return(a.a.color.syntaxFlags.has(ae.Experimental)||a.b.color.syntaxFlags.has(ae.Experimental))&&m.syntaxFlags.add(ae.Experimental),m}function colorMixPolar(e,a,n){if(!n)return!1;const r=n.a.color,o=n.b.color,t=n.a.percentage/100;let l=r.channels,s=o.channels,u=0,i=0,c=0,m=0,h=0,N=0,p=ee.RGB,b=r.alpha;if("number"!=typeof b)return!1;let g=o.alpha;if("number"!=typeof g)return!1;switch(b=Number.isNaN(b)?g:b,g=Number.isNaN(g)?b:g,e){case"hsl":p=ee.HSL;break;case"hwb":p=ee.HWB;break;case"lch":p=ee.LCH;break;case"oklch":p=ee.OKLCH}switch(l=colorDataTo(r,p).channels,s=colorDataTo(o,p).channels,e){case"hsl":case"hwb":u=l[0],i=s[0],c=l[1],m=s[1],h=l[2],N=s[2];break;case"lch":case"oklch":c=l[0],m=s[0],h=l[1],N=s[1],u=l[2],i=s[2]}u=fillInMissingComponent(u,i),Number.isNaN(u)&&(u=0),i=fillInMissingComponent(i,u),Number.isNaN(i)&&(i=0),c=fillInMissingComponent(c,m),m=fillInMissingComponent(m,c),h=fillInMissingComponent(h,N),N=fillInMissingComponent(N,h);const v=i-u;switch(a){case"shorter":v>180?u+=360:v<-180&&(i+=360);break;case"longer":-180<v&&v<180&&(v>0?u+=360:i+=360);break;case"increasing":v<0&&(i+=360);break;case"decreasing":v>0&&(u+=360);break;default:throw new Error("Unknown hue interpolation method")}c=premultiply(c,b),h=premultiply(h,b),m=premultiply(m,g),N=premultiply(N,g);let d=[0,0,0];const f=interpolate(b,g,t);switch(e){case"hsl":case"hwb":d=[interpolate(u,i,t),un_premultiply(interpolate(c,m,t),f),un_premultiply(interpolate(h,N,t),f)];break;case"lch":case"oklch":d=[un_premultiply(interpolate(c,m,t),f),un_premultiply(interpolate(h,N,t),f),interpolate(u,i,t)]}const y={colorNotation:p,channels:d,alpha:f*n.alphaMultiplier,syntaxFlags:new Set([ae.ColorMix])};return(n.a.color.syntaxFlags.has(ae.Experimental)||n.b.color.syntaxFlags.has(ae.Experimental))&&y.syntaxFlags.add(ae.Experimental),y}function fillInMissingComponent(e,a){return Number.isNaN(e)?a:e}function interpolate(e,a,n){return e*n+a*(1-n)}function premultiply(e,a){return Number.isNaN(a)?e:Number.isNaN(e)?NaN:e*a}function un_premultiply(e,a){return 0===a||Number.isNaN(a)?e:Number.isNaN(e)?NaN:e/a}function hex(e){const a=toLowerCaseAZ(e[4].value);if(a.match(/[^a-f0-9]/))return!1;const n={colorNotation:ee.HEX,channels:[0,0,0],alpha:1,syntaxFlags:new Set([ae.Hex])},r=a.length;if(3===r){const e=a[0],r=a[1],o=a[2];return n.channels=[parseInt(e+e,16)/255,parseInt(r+r,16)/255,parseInt(o+o,16)/255],n}if(6===r){const e=a[0]+a[1],r=a[2]+a[3],o=a[4]+a[5];return n.channels=[parseInt(e,16)/255,parseInt(r,16)/255,parseInt(o,16)/255],n}if(4===r){const e=a[0],r=a[1],o=a[2],t=a[3];return n.channels=[parseInt(e+e,16)/255,parseInt(r+r,16)/255,parseInt(o+o,16)/255],n.alpha=parseInt(t+t,16)/255,n.syntaxFlags.add(ae.HasAlpha),n}if(8===r){const e=a[0]+a[1],r=a[2]+a[3],o=a[4]+a[5],t=a[6]+a[7];return n.channels=[parseInt(e,16)/255,parseInt(r,16)/255,parseInt(o,16)/255],n.alpha=parseInt(t,16)/255,n.syntaxFlags.add(ae.HasAlpha),n}return!1}function normalizeHue(n){if(n[0]===e.Number)return n[4].value=n[4].value%360,n[1]=n[4].value.toString(),n;if(n[0]===e.Dimension){let r=n[4].value;switch(toLowerCaseAZ(n[4].unit)){case"deg":break;case"rad":r=180*n[4].value/Math.PI;break;case"grad":r=.9*n[4].value;break;case"turn":r=360*n[4].value;break;default:return!1}return r%=360,[e.Number,r.toString(),n[2],n[3],{value:r,type:a.Number}]}return!1}function normalize_legacy_HSL_ChannelValues(n,r,o){if(0===r){const a=normalizeHue(n);return!1!==a&&(n[0]===e.Dimension&&o.syntaxFlags.add(ae.HasDimensionValues),a)}if(n[0]===e.Percentage){3===r?o.syntaxFlags.add(ae.HasPercentageAlpha):o.syntaxFlags.add(ae.HasPercentageValues);let t=normalize(n[4].value,1,0,100);return 3===r&&(t=normalize(n[4].value,100,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}if(n[0]===e.Number){if(3!==r)return!1;let o=normalize(n[4].value,1,0,100);return 3===r&&(o=normalize(n[4].value,1,0,1)),[e.Number,o.toString(),n[2],n[3],{value:o,type:a.Number}]}return!1}function normalize_modern_HSL_ChannelValues(n,r,o){if(n[0]===e.Ident&&"none"===toLowerCaseAZ(n[4].value))return o.syntaxFlags.add(ae.HasNoneKeywords),[e.Number,"none",n[2],n[3],{value:NaN,type:a.Number}];if(0===r){const a=normalizeHue(n);return!1!==a&&(n[0]===e.Dimension&&o.syntaxFlags.add(ae.HasDimensionValues),a)}if(n[0]===e.Percentage){3===r?o.syntaxFlags.add(ae.HasPercentageAlpha):o.syntaxFlags.add(ae.HasPercentageValues);let t=n[4].value;return 3===r?t=normalize(n[4].value,100,0,1):1===r&&(t=normalize(n[4].value,1,0,1/0)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}if(n[0]===e.Number){3!==r&&o.syntaxFlags.add(ae.HasNumberValues);let t=n[4].value;return 3===r?t=normalize(n[4].value,1,0,1):1===r&&(t=normalize(n[4].value,1,0,1/0)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}return!1}function threeChannelLegacySyntax(a,n,r,o){const t=[],l=[],s=[],u=[],i={colorNotation:r,channels:[0,0,0],alpha:1,syntaxFlags:new Set(o)};let c=t;for(let n=0;n<a.value.length;n++){let r=a.value[n];if(!O(r)&&!E(r)){if(W(r)&&r.value[0]===e.Comma){if(c===t){c=l;continue}if(c===l){c=s;continue}if(c===s){c=u;continue}if(c===u)return!1}if(U(r)){if(c===u&&"var"===r.getName().toLowerCase()){i.syntaxFlags.add(ae.HasVariableAlpha),c.push(r);continue}if(!J.has(r.getName().toLowerCase()))return!1;const[[a]]=Q([[r]],{toCanonicalUnits:!0,precision:100});if(!a||!W(a)||(a.value[0]===e.Percentage||a.value[0]===e.Number||a.value[0]===e.Dimension)&&Number.isNaN(a.value[4].value))return!1;r=a}if(!W(r))return!1;c.push(r)}}if(1!==c.length)return!1;if(1!==t.length||1!==l.length||1!==s.length)return!1;if(!W(t[0])||!W(l[0])||!W(s[0]))return!1;const m=n(t[0].value,0,i);if(!m||m[0]!==e.Number)return!1;const h=n(l[0].value,1,i);if(!h||h[0]!==e.Number)return!1;const N=n(s[0].value,2,i);if(!N||N[0]!==e.Number)return!1;const p=[m,h,N];if(1===u.length)if(i.syntaxFlags.add(ae.HasAlpha),W(u[0])){const a=n(u[0].value,3,i);if(!a||a[0]!==e.Number)return!1;p.push(a)}else i.alpha=u[0];return i.channels=[p[0][4].value,p[1][4].value,p[2][4].value],4===p.length&&(i.alpha=p[3][4].value),i}function threeChannelSpaceSeparated(a,n,r,o,t){const l=[],s=[],u=[],i=[];let c,m,h=!1;const N={colorNotation:r,channels:[0,0,0],alpha:1,syntaxFlags:new Set(o)};let p=l;for(let n=0;n<a.value.length;n++){let o=a.value[n];if(O(o)||E(o))for(;O(a.value[n+1])||E(a.value[n+1]);)n++;else if(p===l&&l.length&&(p=s),p===s&&s.length&&(p=u),W(o)&&o.value[0]===e.Delim&&"/"===o.value[4].value){if(p===i)return!1;p=i}else{if(U(o)){if(p===i&&"var"===o.getName().toLowerCase()){N.syntaxFlags.add(ae.HasVariableAlpha),p.push(o);continue}if(!J.has(o.getName().toLowerCase()))return!1;const[[a]]=Q([[o]],{toCanonicalUnits:!0,precision:100,globals:m});if(!a||!W(a)||(a.value[0]===e.Percentage||a.value[0]===e.Number||a.value[0]===e.Dimension)&&Number.isNaN(a.value[4].value))return!1;o=a}if(p===l&&0===l.length&&W(o)&&o.value[0]===e.Ident&&"from"===o.value[4].value.toLowerCase()){if(h)return!1;for(;O(a.value[n+1])||E(a.value[n+1]);)n++;if(n++,o=a.value[n],h=t(o),!1===h)return!1;h.syntaxFlags.has(ae.Experimental)&&N.syntaxFlags.add(ae.Experimental),N.syntaxFlags.add(ae.RelativeColorSyntax),h.colorNotation!==r&&(h=colorDataTo(h,r)),c=normalizeRelativeColorDataChannels(h),m=noneToZeroInRelativeColorDataChannels(c)}else{if(!W(o))return!1;if(o.value[0]===e.Ident&&c){const e=o.value[4].value.toLowerCase();if(c.has(e)){p.push(new $(c.get(e)));continue}}p.push(o)}}}if(1!==p.length)return!1;if(1!==l.length||1!==s.length||1!==u.length)return!1;if(!W(l[0])||!W(s[0])||!W(u[0]))return!1;if(c&&!c.has("alpha"))return!1;const b=n(l[0].value,0,N);if(!b||b[0]!==e.Number)return!1;const g=n(s[0].value,1,N);if(!g||g[0]!==e.Number)return!1;const v=n(u[0].value,2,N);if(!v||v[0]!==e.Number)return!1;const d=[b,g,v];if(1===i.length)if(N.syntaxFlags.add(ae.HasAlpha),W(i[0])){const a=n(i[0].value,3,N);if(!a||a[0]!==e.Number)return!1;d.push(a)}else N.alpha=i[0];else if(c&&c.has("alpha")){const a=n(c.get("alpha"),3,N);if(!a||a[0]!==e.Number)return!1;d.push(a)}return N.channels=[d[0][4].value,d[1][4].value,d[2][4].value],4===d.length&&(N.alpha=d[3][4].value),N}function hsl(a,n){if(a.value.some((a=>W(a)&&a.value[0]===e.Comma))){const e=hslCommaSeparated(a);if(!1!==e)return e}{const e=hslSpaceSeparated(a,n);if(!1!==e)return e}return!1}function hslCommaSeparated(e){return threeChannelLegacySyntax(e,normalize_legacy_HSL_ChannelValues,ee.HSL,[ae.LegacyHSL])}function hslSpaceSeparated(e,a){return threeChannelSpaceSeparated(e,normalize_modern_HSL_ChannelValues,ee.HSL,[],a)}function normalize_HWB_ChannelValues(n,r,o){if(n[0]===e.Ident&&"none"===toLowerCaseAZ(n[4].value))return o.syntaxFlags.add(ae.HasNoneKeywords),[e.Number,"none",n[2],n[3],{value:NaN,type:a.Number}];if(0===r){const a=normalizeHue(n);return!1!==a&&(n[0]===e.Dimension&&o.syntaxFlags.add(ae.HasDimensionValues),a)}if(n[0]===e.Percentage){3===r?o.syntaxFlags.add(ae.HasPercentageAlpha):o.syntaxFlags.add(ae.HasPercentageValues);let t=n[4].value;return 3===r&&(t=normalize(n[4].value,100,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}if(n[0]===e.Number){3!==r&&o.syntaxFlags.add(ae.HasNumberValues);let t=n[4].value;return 3===r&&(t=normalize(n[4].value,1,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}return!1}function normalize_Lab_ChannelValues(n,r,o){if(n[0]===e.Ident&&"none"===toLowerCaseAZ(n[4].value))return o.syntaxFlags.add(ae.HasNoneKeywords),[e.Number,"none",n[2],n[3],{value:NaN,type:a.Number}];if(n[0]===e.Percentage){3!==r&&o.syntaxFlags.add(ae.HasPercentageValues);let t=normalize(n[4].value,1,0,100);return 1===r||2===r?t=normalize(n[4].value,.8,-1/0,1/0):3===r&&(t=normalize(n[4].value,100,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}if(n[0]===e.Number){3!==r&&o.syntaxFlags.add(ae.HasNumberValues);let t=normalize(n[4].value,1,0,100);return 1===r||2===r?t=normalize(n[4].value,1,-1/0,1/0):3===r&&(t=normalize(n[4].value,1,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}return!1}function lab(e,a){return threeChannelSpaceSeparated(e,normalize_Lab_ChannelValues,ee.Lab,[],a)}function normalize_LCH_ChannelValues(n,r,o){if(n[0]===e.Ident&&"none"===toLowerCaseAZ(n[4].value))return o.syntaxFlags.add(ae.HasNoneKeywords),[e.Number,"none",n[2],n[3],{value:NaN,type:a.Number}];if(2===r){const a=normalizeHue(n);return!1!==a&&(n[0]===e.Dimension&&o.syntaxFlags.add(ae.HasDimensionValues),a)}if(n[0]===e.Percentage){3!==r&&o.syntaxFlags.add(ae.HasPercentageValues);let t=normalize(n[4].value,1,0,100);return 1===r?t=normalize(n[4].value,100/150,0,1/0):3===r&&(t=normalize(n[4].value,100,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}if(n[0]===e.Number){3!==r&&o.syntaxFlags.add(ae.HasNumberValues);let t=normalize(n[4].value,1,0,100);return 1===r?t=normalize(n[4].value,1,0,1/0):3===r&&(t=normalize(n[4].value,1,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}return!1}function lch(e,a){return threeChannelSpaceSeparated(e,normalize_LCH_ChannelValues,ee.LCH,[],a)}const ue=new Map;for(const[e,a]of Object.entries(S))ue.set(e,a);function namedColor(e){const a=ue.get(toLowerCaseAZ(e));return!!a&&{colorNotation:ee.RGB,channels:[a[0]/255,a[1]/255,a[2]/255],alpha:1,syntaxFlags:new Set([ae.ColorKeyword,ae.NamedColor])}}function normalize_OKLab_ChannelValues(n,r,o){if(n[0]===e.Ident&&"none"===toLowerCaseAZ(n[4].value))return o.syntaxFlags.add(ae.HasNoneKeywords),[e.Number,"none",n[2],n[3],{value:NaN,type:a.Number}];if(n[0]===e.Percentage){3!==r&&o.syntaxFlags.add(ae.HasPercentageValues);let t=normalize(n[4].value,100,0,1);return 1===r||2===r?t=normalize(n[4].value,250,-1/0,1/0):3===r&&(t=normalize(n[4].value,100,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}if(n[0]===e.Number){3!==r&&o.syntaxFlags.add(ae.HasNumberValues);let t=normalize(n[4].value,1,0,1);return 1===r||2===r?t=normalize(n[4].value,1,-1/0,1/0):3===r&&(t=normalize(n[4].value,1,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}return!1}function oklab(e,a){return threeChannelSpaceSeparated(e,normalize_OKLab_ChannelValues,ee.OKLab,[],a)}function normalize_OKLCH_ChannelValues(n,r,o){if(n[0]===e.Ident&&"none"===toLowerCaseAZ(n[4].value))return o.syntaxFlags.add(ae.HasNoneKeywords),[e.Number,"none",n[2],n[3],{value:NaN,type:a.Number}];if(2===r){const a=normalizeHue(n);return!1!==a&&(n[0]===e.Dimension&&o.syntaxFlags.add(ae.HasDimensionValues),a)}if(n[0]===e.Percentage){3!==r&&o.syntaxFlags.add(ae.HasPercentageValues);let t=normalize(n[4].value,100,0,1);return 1===r?t=normalize(n[4].value,250,0,1/0):3===r&&(t=normalize(n[4].value,100,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}if(n[0]===e.Number){3!==r&&o.syntaxFlags.add(ae.HasNumberValues);let t=normalize(n[4].value,1,0,1);return 1===r?t=normalize(n[4].value,1,0,1/0):3===r&&(t=normalize(n[4].value,1,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}return!1}function oklch(e,a){return threeChannelSpaceSeparated(e,normalize_OKLCH_ChannelValues,ee.OKLCH,[],a)}function normalize_legacy_sRGB_ChannelValues(n,r,o){if(n[0]===e.Percentage){3===r?o.syntaxFlags.add(ae.HasPercentageAlpha):o.syntaxFlags.add(ae.HasPercentageValues);const t=normalize(n[4].value,100,0,1);return[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}if(n[0]===e.Number){3!==r&&o.syntaxFlags.add(ae.HasNumberValues);let t=normalize(n[4].value,255,0,1);return 3===r&&(t=normalize(n[4].value,1,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}return!1}function normalize_modern_sRGB_ChannelValues(n,r,o){if(n[0]===e.Ident&&"none"===n[4].value.toLowerCase())return o.syntaxFlags.add(ae.HasNoneKeywords),[e.Number,"none",n[2],n[3],{value:NaN,type:a.Number}];if(n[0]===e.Percentage){3!==r&&o.syntaxFlags.add(ae.HasPercentageValues);let t=normalize(n[4].value,100,-1/0,1/0);return 3===r&&(t=normalize(n[4].value,100,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}if(n[0]===e.Number){3!==r&&o.syntaxFlags.add(ae.HasNumberValues);let t=normalize(n[4].value,255,-1/0,1/0);return 3===r&&(t=normalize(n[4].value,1,0,1)),[e.Number,t.toString(),n[2],n[3],{value:t,type:a.Number}]}return!1}function rgb(a,n){if(a.value.some((a=>W(a)&&a.value[0]===e.Comma))){const e=rgbCommaSeparated(a);if(!1!==e)return(!e.syntaxFlags.has(ae.HasNumberValues)||!e.syntaxFlags.has(ae.HasPercentageValues))&&e}else{const e=rgbSpaceSeparated(a,n);if(!1!==e)return e}return!1}function rgbCommaSeparated(e){return threeChannelLegacySyntax(e,normalize_legacy_sRGB_ChannelValues,ee.RGB,[ae.LegacyRGB])}function rgbSpaceSeparated(e,a){return threeChannelSpaceSeparated(e,normalize_modern_sRGB_ChannelValues,ee.RGB,[],a)}function toPrecision(e,a=7){e=+e,a=+a;const n=(Math.floor(e)+"").length;if(a>n)return+e.toFixed(a-n);{const r=10**(n-a);return Math.round(e/r)*r}}function XYZ_D50_to_P3_Gamut(e){const a=L(e);if(k(a))return z(a);let n=e.slice();return n=d(n),n[0]<1e-6&&(n=[0,0,0]),n[0]>.999999&&(n=[1,0,0]),F(n,(e=>(e=M(e),e=Z(e),e=R(e),B(e))),(e=>(e=G(e),e=V(e),e=T(e),A(e))))}function serializeWithAlpha(n,r,o,t){const l=[e.CloseParen,")",-1,-1,void 0];if("number"==typeof n.alpha){const s=Math.min(1,Math.max(0,toPrecision(Number.isNaN(n.alpha)?0:n.alpha)));return 1===toPrecision(s,4)?new j(r,l,t):new j(r,l,[...t,new q([o]),new $([e.Delim,"/",-1,-1,{value:"/"}]),new q([o]),new $([e.Number,toPrecision(s,4).toString(),-1,-1,{value:n.alpha,type:a.Integer}])])}return new j(r,l,[...t,new q([o]),new $([e.Delim,"/",-1,-1,{value:"/"}]),new q([o]),n.alpha])}function serializeP3(n,r=!0){n.channels=convertPowerlessComponentsToZeroValuesForDisplay(n.channels,n.colorNotation);let o=n.channels.map((e=>Number.isNaN(e)?0:e));n.colorNotation!==ee.Display_P3&&(o=r?XYZ_D50_to_P3_Gamut(colorData_to_XYZ_D50(n).channels):L(colorData_to_XYZ_D50(n).channels));const t=toPrecision(o[0],6),l=toPrecision(o[1],6),s=toPrecision(o[2],6),u=[e.Function,"color(",-1,-1,{value:"color"}],i=[e.Whitespace," ",-1,-1,void 0];return serializeWithAlpha(n,u,i,[new $([e.Ident,"display-p3",-1,-1,{value:"display-p3"}]),new q([i]),new $([e.Number,t.toString(),-1,-1,{value:o[0],type:a.Number}]),new q([i]),new $([e.Number,l.toString(),-1,-1,{value:o[1],type:a.Number}]),new q([i]),new $([e.Number,s.toString(),-1,-1,{value:o[2],type:a.Number}])])}function XYZ_D50_to_sRGB_Gamut(e){const a=D(e);if(k(a))return z(a);let n=e.slice();return n=d(n),n[0]<1e-6&&(n=[0,0,0]),n[0]>.999999&&(n=[1,0,0]),F(n,(e=>(e=M(e),e=Z(e),e=I(e),X(e))),(e=>(e=K(e),e=Y(e),e=T(e),A(e))))}function serializeRGB(n,r=!0){n.channels=convertPowerlessComponentsToZeroValuesForDisplay(n.channels,n.colorNotation);let o=n.channels.map((e=>Number.isNaN(e)?0:e));o=r?XYZ_D50_to_sRGB_Gamut(colorData_to_XYZ_D50(n).channels):D(colorData_to_XYZ_D50(n).channels);const t=Math.min(255,Math.max(0,Math.round(255*toPrecision(o[0])))),l=Math.min(255,Math.max(0,Math.round(255*toPrecision(o[1])))),s=Math.min(255,Math.max(0,Math.round(255*toPrecision(o[2])))),u=[e.CloseParen,")",-1,-1,void 0],i=[e.Whitespace," ",-1,-1,void 0],c=[e.Comma,",",-1,-1,void 0],m=[new $([e.Number,t.toString(),-1,-1,{value:o[0],type:a.Integer}]),new $(c),new q([i]),new $([e.Number,l.toString(),-1,-1,{value:o[1],type:a.Integer}]),new $(c),new q([i]),new $([e.Number,s.toString(),-1,-1,{value:o[2],type:a.Integer}])];if("number"==typeof n.alpha){const r=Math.min(1,Math.max(0,toPrecision(Number.isNaN(n.alpha)?0:n.alpha)));return 1===toPrecision(r,4)?new j([e.Function,"rgb(",-1,-1,{value:"rgb"}],u,m):new j([e.Function,"rgba(",-1,-1,{value:"rgba"}],u,[...m,new $(c),new q([i]),new $([e.Number,toPrecision(r,4).toString(),-1,-1,{value:n.alpha,type:a.Number}])])}return new j([e.Function,"rgba(",-1,-1,{value:"rgba"}],u,[...m,new $(c),new q([i]),n.alpha])}function serializeHSL(n,r=!0){n.channels=convertPowerlessComponentsToZeroValuesForDisplay(n.channels,n.colorNotation);let o=n.channels.map((e=>Number.isNaN(e)?0:e));o=w(r?b(XYZ_D50_to_sRGB_Gamut(colorData_to_XYZ_D50(n).channels)):colorData_to_XYZ_D50(n).channels),o=o.map((e=>Number.isNaN(e)?0:e));const t=Math.min(360,Math.max(0,Math.round(toPrecision(o[0])))),l=Math.min(100,Math.max(0,Math.round(toPrecision(o[1])))),s=Math.min(100,Math.max(0,Math.round(toPrecision(o[2])))),u=[e.CloseParen,")",-1,-1,void 0],i=[e.Whitespace," ",-1,-1,void 0],c=[e.Comma,",",-1,-1,void 0],m=[new $([e.Number,t.toString(),-1,-1,{value:o[0],type:a.Integer}]),new $(c),new q([i]),new $([e.Percentage,l.toString()+"%",-1,-1,{value:o[1]}]),new $(c),new q([i]),new $([e.Percentage,s.toString()+"%",-1,-1,{value:o[2]}])];if("number"==typeof n.alpha){const r=Math.min(1,Math.max(0,toPrecision(Number.isNaN(n.alpha)?0:n.alpha)));return 1===toPrecision(r,4)?new j([e.Function,"hsl(",-1,-1,{value:"hsl"}],u,m):new j([e.Function,"hsla(",-1,-1,{value:"hsla"}],u,[...m,new $(c),new q([i]),new $([e.Number,toPrecision(r,4).toString(),-1,-1,{value:n.alpha,type:a.Number}])])}return new j([e.Function,"hsla(",-1,-1,{value:"hsla"}],u,[...m,new $(c),new q([i]),n.alpha])}function serializeOKLCH(n){n.channels=convertPowerlessComponentsToZeroValuesForDisplay(n.channels,n.colorNotation);let r=n.channels.map((e=>Number.isNaN(e)?0:e));n.colorNotation!==ee.OKLCH&&(r=d(colorData_to_XYZ_D50(n).channels));const o=toPrecision(r[0],6),t=toPrecision(r[1],6),l=toPrecision(r[2],6),s=[e.Function,"oklch(",-1,-1,{value:"oklch"}],u=[e.Whitespace," ",-1,-1,void 0];return serializeWithAlpha(n,s,u,[new $([e.Number,o.toString(),-1,-1,{value:r[0],type:a.Number}]),new q([u]),new $([e.Number,t.toString(),-1,-1,{value:r[1],type:a.Number}]),new q([u]),new $([e.Number,l.toString(),-1,-1,{value:r[2],type:a.Number}])])}function color(a){if(U(a)){switch(toLowerCaseAZ(a.getName())){case"rgb":case"rgba":return rgb(a,color);case"hsl":case"hsla":return hsl(a,color);case"hwb":return n=color,threeChannelSpaceSeparated(a,normalize_HWB_ChannelValues,ee.HWB,[],n);case"lab":return lab(a,color);case"lch":return lch(a,color);case"oklab":return oklab(a,color);case"oklch":return oklch(a,color);case"color":return color$1(a,color);case"color-mix":return colorMix(a,color)}}var n;if(W(a)){if(a.value[0]===e.Hash)return hex(a.value);if(a.value[0]===e.Ident){const e=namedColor(a.value[4].value);return!1!==e?e:"transparent"===toLowerCaseAZ(a.value[4].value)&&{colorNotation:ee.RGB,channels:[0,0,0],alpha:0,syntaxFlags:new Set([ae.ColorKeyword])}}}return!1}export{ee as ColorNotation,ae as SyntaxFlag,color,colorDataFitsDisplayP3_Gamut,colorDataFitsRGB_Gamut,serializeHSL,serializeOKLCH,serializeP3,serializeRGB};
