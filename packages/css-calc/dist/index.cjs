"use strict";var e=require("@csstools/css-parser-algorithms"),n=require("@csstools/css-tokenizer");const t=/[A-Z]/g;function toLowerCaseAZ(e){return e.replace(t,(e=>String.fromCharCode(e.charCodeAt(0)+32)))}const o={cm:"px",in:"px",mm:"px",pc:"px",pt:"px",px:"px",q:"px",deg:"deg",grad:"deg",rad:"deg",turn:"deg",ms:"s",s:"s",hz:"hz",khz:"hz"},r=new Map([["cm",e=>e],["mm",e=>10*e],["q",e=>40*e],["in",e=>e/2.54],["pc",e=>e/2.54*6],["pt",e=>e/2.54*72],["px",e=>e/2.54*96]]),i=new Map([["deg",e=>e],["grad",e=>e/.9],["rad",e=>e/180*Math.PI],["turn",e=>e/360]]),u=new Map([["deg",e=>.9*e],["grad",e=>e],["rad",e=>.9*e/180*Math.PI],["turn",e=>.9*e/360]]),a=new Map([["hz",e=>e],["khz",e=>e/1e3]]),s=new Map([["cm",e=>2.54*e],["mm",e=>25.4*e],["q",e=>25.4*e*4],["in",e=>e],["pc",e=>6*e],["pt",e=>72*e],["px",e=>96*e]]),l=new Map([["hz",e=>1e3*e],["khz",e=>e]]),c=new Map([["cm",e=>e/10],["mm",e=>e],["q",e=>4*e],["in",e=>e/25.4],["pc",e=>e/25.4*6],["pt",e=>e/25.4*72],["px",e=>e/25.4*96]]),m=new Map([["ms",e=>e],["s",e=>e/1e3]]),v=new Map([["cm",e=>e/6*2.54],["mm",e=>e/6*25.4],["q",e=>e/6*25.4*4],["in",e=>e/6],["pc",e=>e],["pt",e=>e/6*72],["px",e=>e/6*96]]),T=new Map([["cm",e=>e/72*2.54],["mm",e=>e/72*25.4],["q",e=>e/72*25.4*4],["in",e=>e/72],["pc",e=>e/72*6],["pt",e=>e],["px",e=>e/72*96]]),p=new Map([["cm",e=>e/96*2.54],["mm",e=>e/96*25.4],["q",e=>e/96*25.4*4],["in",e=>e/96],["pc",e=>e/96*6],["pt",e=>e/96*72],["px",e=>e]]),N=new Map([["cm",e=>e/4/10],["mm",e=>e/4],["q",e=>e],["in",e=>e/4/25.4],["pc",e=>e/4/25.4*6],["pt",e=>e/4/25.4*72],["px",e=>e/4/25.4*96]]),f=new Map([["deg",e=>180*e/Math.PI],["grad",e=>180*e/Math.PI/.9],["rad",e=>e],["turn",e=>180*e/Math.PI/360]]),k=new Map([["ms",e=>1e3*e],["s",e=>e]]),d=new Map([["deg",e=>360*e],["grad",e=>360*e/.9],["rad",e=>360*e/180*Math.PI],["turn",e=>e]]),C=new Map([["cm",r],["mm",c],["q",N],["in",s],["pc",v],["pt",T],["px",p],["ms",m],["s",k],["deg",i],["grad",u],["rad",f],["turn",d],["hz",a],["khz",l]]);function convertUnit(e,t){if(!n.isTokenDimension(e))return t;if(!n.isTokenDimension(t))return t;const o=toLowerCaseAZ(e[4].unit),r=toLowerCaseAZ(t[4].unit);if(o===r)return t;const i=C.get(r);if(!i)return t;const u=i.get(o);if(!u)return t;const a=u(t[4].value),s=[n.TokenType.Dimension,"",t[2],t[3],{...t[4],signCharacter:a<0?"-":void 0,type:Number.isInteger(a)?n.NumberType.Integer:n.NumberType.Number,value:a}];return n.mutateUnit(s,e[4].unit),s}function toCanonicalUnit(e){if(!n.isTokenDimension(e))return e;const t=toLowerCaseAZ(e[4].unit),r=o[t];if(t===r)return e;const i=C.get(t);if(!i)return e;const u=i.get(r);if(!u)return e;const a=u(e[4].value),s=[n.TokenType.Dimension,"",e[2],e[3],{...e[4],signCharacter:a<0?"-":void 0,type:Number.isInteger(a)?n.NumberType.Integer:n.NumberType.Number,value:a}];return n.mutateUnit(s,r),s}function addition(t){if(2!==t.length)return-1;const o=t[0].value;let r=t[1].value;if(n.isTokenNumber(o)&&n.isTokenNumber(r)){const t=o[4].value+r[4].value;return new e.TokenNode([n.TokenType.Number,t.toString(),o[2],r[3],{value:t,type:o[4].type===n.NumberType.Integer&&r[4].type===n.NumberType.Integer?n.NumberType.Integer:n.NumberType.Number}])}if(n.isTokenPercentage(o)&&n.isTokenPercentage(r)){const t=o[4].value+r[4].value;return new e.TokenNode([n.TokenType.Percentage,t.toString()+"%",o[2],r[3],{value:t}])}if(n.isTokenDimension(o)&&n.isTokenDimension(r)&&(r=convertUnit(o,r),toLowerCaseAZ(o[4].unit)===toLowerCaseAZ(r[4].unit))){const t=o[4].value+r[4].value;return new e.TokenNode([n.TokenType.Dimension,t.toString()+o[4].unit,o[2],r[3],{value:t,type:o[4].type===n.NumberType.Integer&&r[4].type===n.NumberType.Integer?n.NumberType.Integer:n.NumberType.Number,unit:o[4].unit}])}return-1}function division(t){if(2!==t.length)return-1;const o=t[0].value,r=t[1].value;if(n.isTokenNumber(o)&&n.isTokenNumber(r)){const t=o[4].value/r[4].value;return new e.TokenNode([n.TokenType.Number,t.toString(),o[2],r[3],{value:t,type:Number.isInteger(t)?n.NumberType.Integer:n.NumberType.Number}])}if(n.isTokenPercentage(o)&&n.isTokenNumber(r)){const t=o[4].value/r[4].value;return new e.TokenNode([n.TokenType.Percentage,t.toString()+"%",o[2],r[3],{value:t}])}if(n.isTokenDimension(o)&&n.isTokenNumber(r)){const t=o[4].value/r[4].value;return new e.TokenNode([n.TokenType.Dimension,t.toString()+o[4].unit,o[2],r[3],{value:t,type:Number.isInteger(t)?n.NumberType.Integer:n.NumberType.Number,unit:o[4].unit}])}return-1}function isCalculation(e){return!!e&&"object"==typeof e&&"inputs"in e&&Array.isArray(e.inputs)&&"operation"in e}function solve(n){if(-1===n)return-1;const t=[];for(let o=0;o<n.inputs.length;o++){const r=n.inputs[o];if(e.isTokenNode(r)){t.push(r);continue}const i=solve(r);if(-1===i)return-1;t.push(i)}return n.operation(t)}function multiplication(t){if(2!==t.length)return-1;const o=t[0].value,r=t[1].value;if(n.isTokenNumber(o)&&n.isTokenNumber(r)){const t=o[4].value*r[4].value;return new e.TokenNode([n.TokenType.Number,t.toString(),o[2],r[3],{value:t,type:o[4].type===n.NumberType.Integer&&r[4].type===n.NumberType.Integer?n.NumberType.Integer:n.NumberType.Number}])}if(n.isTokenPercentage(o)&&n.isTokenNumber(r)){const t=o[4].value*r[4].value;return new e.TokenNode([n.TokenType.Percentage,t.toString()+"%",o[2],r[3],{value:t}])}if(n.isTokenNumber(o)&&n.isTokenPercentage(r)){const t=o[4].value*r[4].value;return new e.TokenNode([n.TokenType.Percentage,t.toString()+"%",o[2],r[3],{value:t}])}if(n.isTokenDimension(o)&&n.isTokenNumber(r)){const t=o[4].value*r[4].value;return new e.TokenNode([n.TokenType.Dimension,t.toString()+o[4].unit,o[2],r[3],{value:t,type:o[4].type===n.NumberType.Integer&&r[4].type===n.NumberType.Integer?n.NumberType.Integer:n.NumberType.Number,unit:o[4].unit}])}if(n.isTokenNumber(o)&&n.isTokenDimension(r)){const t=o[4].value*r[4].value;return new e.TokenNode([n.TokenType.Dimension,t.toString()+r[4].unit,o[2],r[3],{value:t,type:o[4].type===n.NumberType.Integer&&r[4].type===n.NumberType.Integer?n.NumberType.Integer:n.NumberType.Number,unit:r[4].unit}])}return-1}function resolveGlobalsAndConstants(t,o){for(let r=0;r<t.length;r++){const i=t[r];if(!e.isTokenNode(i))continue;const u=i.value;if(!n.isTokenIdent(u))continue;const a=toLowerCaseAZ(u[4].value);switch(a){case"e":t.splice(r,1,new e.TokenNode([n.TokenType.Number,Math.E.toString(),u[2],u[3],{value:Math.E,type:n.NumberType.Number}]));break;case"pi":t.splice(r,1,new e.TokenNode([n.TokenType.Number,Math.PI.toString(),u[2],u[3],{value:Math.PI,type:n.NumberType.Number}]));break;case"infinity":t.splice(r,1,new e.TokenNode([n.TokenType.Number,"infinity",u[2],u[3],{value:1/0,type:n.NumberType.Number}]));break;case"-infinity":t.splice(r,1,new e.TokenNode([n.TokenType.Number,"-infinity",u[2],u[3],{value:-1/0,type:n.NumberType.Number}]));break;case"nan":t.splice(r,1,new e.TokenNode([n.TokenType.Number,"NaN",u[2],u[3],{value:Number.NaN,type:n.NumberType.Number}]));break;default:if(o.has(a)){const n=o.get(a);t.splice(r,1,new e.TokenNode(n))}}}return t}function unary(e){if(1!==e.length)return-1;const t=e[0].value;return n.isTokenNumeric(t)?e[0]:-1}function resultToCalculation(e,t,o){return n.isTokenDimension(t)?dimensionToCalculation(e,t[4].unit,o):n.isTokenPercentage(t)?percentageToCalculation(e,o):n.isTokenNumber(t)?numberToCalculation(e,o):-1}function dimensionToCalculation(t,o,r){const i=t.tokens();return{inputs:[new e.TokenNode([n.TokenType.Dimension,r.toString()+o,i[0][2],i[i.length-1][3],{value:r,type:Number.isInteger(r)?n.NumberType.Integer:n.NumberType.Number,unit:o}])],operation:unary}}function percentageToCalculation(t,o){const r=t.tokens();return{inputs:[new e.TokenNode([n.TokenType.Percentage,o.toString()+"%",r[0][2],r[r.length-1][3],{value:o}])],operation:unary}}function numberToCalculation(t,o){const r=t.tokens();return{inputs:[new e.TokenNode([n.TokenType.Number,o.toString(),r[0][2],r[r.length-1][3],{value:o,type:Number.isInteger(o)?n.NumberType.Integer:n.NumberType.Number}])],operation:unary}}function solveACos(e,t){const o=t.value;if(!n.isTokenNumber(o))return-1;return dimensionToCalculation(e,"rad",Math.acos(o[4].value))}function solveASin(e,t){const o=t.value;if(!n.isTokenNumber(o))return-1;return dimensionToCalculation(e,"rad",Math.asin(o[4].value))}function solveATan(e,t){const o=t.value;if(!n.isTokenNumber(o))return-1;return dimensionToCalculation(e,"rad",Math.atan(o[4].value))}function isDimensionOrNumber(e){return n.isTokenDimension(e)||n.isTokenNumber(e)}function arrayOfSameNumeric(e){if(0===e.length)return!0;const t=e[0];if(!n.isTokenNumeric(t))return!1;if(1===e.length)return!0;if(n.isTokenDimension(t)){const n=toLowerCaseAZ(t[4].unit);for(let o=1;o<e.length;o++){const r=e[o];if(t[0]!==r[0])return!1;if(n!==toLowerCaseAZ(r[4].unit))return!1}return!0}for(let n=1;n<e.length;n++){const o=e[n];if(t[0]!==o[0])return!1}return!0}function twoOfSameNumeric(e,t){return!!n.isTokenNumeric(e)&&(n.isTokenDimension(e)?e[0]===t[0]&&toLowerCaseAZ(e[4].unit)===toLowerCaseAZ(t[4].unit):e[0]===t[0])}function solveATan2(e,n,t){const o=n.value;if(!isDimensionOrNumber(o))return-1;const r=convertUnit(o,t.value);if(!twoOfSameNumeric(o,r))return-1;return dimensionToCalculation(e,"rad",Math.atan2(o[4].value,r[4].value))}function solveAbs(e,t,o){const r=t.value;if(!n.isTokenNumeric(r))return-1;if(!o.rawPercentages&&n.isTokenPercentage(r))return-1;return resultToCalculation(e,r,Math.abs(r[4].value))}function solveClamp(t,o,r,i,u){if(!e.isTokenNode(o)||!e.isTokenNode(r)||!e.isTokenNode(i))return-1;const a=o.value;if(!n.isTokenNumeric(a))return-1;if(!u.rawPercentages&&n.isTokenPercentage(a))return-1;const s=convertUnit(a,r.value);if(!twoOfSameNumeric(a,s))return-1;const l=convertUnit(a,i.value);if(!twoOfSameNumeric(a,l))return-1;return resultToCalculation(t,a,Math.max(a[4].value,Math.min(s[4].value,l[4].value)))}function solveCos(e,t){const o=t.value;if(!isDimensionOrNumber(o))return-1;let r=o[4].value;if(n.isTokenDimension(o))switch(o[4].unit.toLowerCase()){case"rad":break;case"deg":r=i.get("rad")(o[4].value);break;case"grad":r=u.get("rad")(o[4].value);break;case"turn":r=d.get("rad")(o[4].value);break;default:return-1}return r=Math.cos(r),numberToCalculation(e,r)}function solveExp(e,t){const o=t.value;if(!n.isTokenNumber(o))return-1;return numberToCalculation(e,Math.exp(o[4].value))}function solveHypot(t,o,r){if(!o.every(e.isTokenNode))return-1;const i=o[0].value;if(!n.isTokenNumeric(i))return-1;if(!r.rawPercentages&&n.isTokenPercentage(i))return-1;const u=o.map((e=>convertUnit(i,e.value)));if(!arrayOfSameNumeric(u))return-1;const a=u.map((e=>e[4].value)),s=Math.hypot(...a);return resultToCalculation(t,i,s)}function solveMax(t,o,r){if(!o.every(e.isTokenNode))return-1;const i=o[0].value;if(!n.isTokenNumeric(i))return-1;if(!r.rawPercentages&&n.isTokenPercentage(i))return-1;const u=o.map((e=>convertUnit(i,e.value)));if(!arrayOfSameNumeric(u))return-1;const a=u.map((e=>e[4].value)),s=Math.max(...a);return resultToCalculation(t,i,s)}function solveMin(t,o,r){if(!o.every(e.isTokenNode))return-1;const i=o[0].value;if(!n.isTokenNumeric(i))return-1;if(!r.rawPercentages&&n.isTokenPercentage(i))return-1;const u=o.map((e=>convertUnit(i,e.value)));if(!arrayOfSameNumeric(u))return-1;const a=u.map((e=>e[4].value)),s=Math.min(...a);return resultToCalculation(t,i,s)}function solveMod(e,t,o){const r=t.value;if(!n.isTokenNumeric(r))return-1;const i=convertUnit(r,o.value);if(!twoOfSameNumeric(r,i))return-1;let u;return u=0===i[4].value?Number.NaN:Number.isFinite(r[4].value)&&(Number.isFinite(i[4].value)||(i[4].value!==Number.POSITIVE_INFINITY||r[4].value!==Number.NEGATIVE_INFINITY&&!Object.is(0*r[4].value,-0))&&(i[4].value!==Number.NEGATIVE_INFINITY||r[4].value!==Number.POSITIVE_INFINITY&&!Object.is(0*r[4].value,0)))?Number.isFinite(i[4].value)?(r[4].value%i[4].value+i[4].value)%i[4].value:r[4].value:Number.NaN,resultToCalculation(e,r,u)}function solvePow(e,t,o){const r=t.value,i=o.value;if(!n.isTokenNumber(r))return-1;if(!twoOfSameNumeric(r,i))return-1;return numberToCalculation(e,Math.pow(r[4].value,i[4].value))}function solveRem(e,t,o){const r=t.value;if(!n.isTokenNumeric(r))return-1;const i=convertUnit(r,o.value);if(!twoOfSameNumeric(r,i))return-1;let u;return u=0===i[4].value?Number.NaN:Number.isFinite(r[4].value)?Number.isFinite(i[4].value)?r[4].value%i[4].value:r[4].value:Number.NaN,resultToCalculation(e,r,u)}function solveRound(e,t,o,r,i){const u=o.value;if(!n.isTokenNumeric(u))return-1;if(!i.rawPercentages&&n.isTokenPercentage(u))return-1;const a=convertUnit(u,r.value);if(!twoOfSameNumeric(u,a))return-1;let s;if(0===a[4].value)s=Number.NaN;else if(Number.isFinite(u[4].value)||Number.isFinite(a[4].value))if(!Number.isFinite(u[4].value)&&Number.isFinite(a[4].value))s=u[4].value;else if(Number.isFinite(u[4].value)&&!Number.isFinite(a[4].value))switch(t){case"down":s=u[4].value<0?-1/0:Object.is(-0,0*u[4].value)?-0:0;break;case"up":s=u[4].value>0?1/0:Object.is(0,0*u[4].value)?0:-0;break;default:s=Object.is(0,0*u[4].value)?0:-0}else if(Number.isFinite(a[4].value))switch(t){case"down":s=Math.floor(u[4].value/a[4].value)*a[4].value;break;case"up":s=Math.ceil(u[4].value/a[4].value)*a[4].value;break;case"to-zero":s=Math.trunc(u[4].value/a[4].value)*a[4].value;break;default:{let e=Math.floor(u[4].value/a[4].value)*a[4].value,n=Math.ceil(u[4].value/a[4].value)*a[4].value;if(e>n){const t=e;e=n,n=t}const t=Math.abs(u[4].value-e),o=Math.abs(u[4].value-n);s=t===o?n:t<o?e:n;break}}else s=u[4].value;else s=Number.NaN;return resultToCalculation(e,u,s)}function solveSign(e,t,o){const r=t.value;if(!n.isTokenNumeric(r))return-1;if(!o.rawPercentages&&n.isTokenPercentage(r))return-1;return numberToCalculation(e,Math.sign(r[4].value))}function solveSin(e,t){const o=t.value;if(!isDimensionOrNumber(o))return-1;let r=o[4].value;if(n.isTokenDimension(o))switch(toLowerCaseAZ(o[4].unit)){case"rad":break;case"deg":r=i.get("rad")(o[4].value);break;case"grad":r=u.get("rad")(o[4].value);break;case"turn":r=d.get("rad")(o[4].value);break;default:return-1}return r=Math.sin(r),numberToCalculation(e,r)}function solveSqrt(e,t){const o=t.value;if(!n.isTokenNumber(o))return-1;return numberToCalculation(e,Math.sqrt(o[4].value))}function solveTan(e,t){const o=t.value;if(!isDimensionOrNumber(o))return-1;const r=o[4].value;let a=0,s=o[4].value;if(n.isTokenDimension(o))switch(toLowerCaseAZ(o[4].unit)){case"rad":a=f.get("deg")(r);break;case"deg":a=r,s=i.get("rad")(r);break;case"grad":a=u.get("deg")(r),s=u.get("rad")(r);break;case"turn":a=d.get("deg")(r),s=d.get("rad")(r);break;default:return-1}const l=a/90;return s=a%90==0&&l%2!=0?l>0?1/0:-1/0:Math.tan(s),numberToCalculation(e,s)}function subtraction(t){if(2!==t.length)return-1;const o=t[0].value;let r=t[1].value;if(n.isTokenNumber(o)&&n.isTokenNumber(r)){const t=o[4].value-r[4].value;return new e.TokenNode([n.TokenType.Number,t.toString(),o[2],r[3],{value:t,type:o[4].type===n.NumberType.Integer&&r[4].type===n.NumberType.Integer?n.NumberType.Integer:n.NumberType.Number}])}if(n.isTokenPercentage(o)&&n.isTokenPercentage(r)){const t=o[4].value-r[4].value;return new e.TokenNode([n.TokenType.Percentage,t.toString()+"%",o[2],r[3],{value:t}])}if(n.isTokenDimension(o)&&n.isTokenDimension(r)&&(r=convertUnit(o,r),toLowerCaseAZ(o[4].unit)===toLowerCaseAZ(r[4].unit))){const t=o[4].value-r[4].value;return new e.TokenNode([n.TokenType.Dimension,t.toString()+o[4].unit,o[2],r[3],{value:t,type:o[4].type===n.NumberType.Integer&&r[4].type===n.NumberType.Integer?n.NumberType.Integer:n.NumberType.Number,unit:o[4].unit}])}return-1}function solveLog(t,o){if(1===o.length){const r=o[0];if(!r||!e.isTokenNode(r))return-1;const i=r.value;if(!n.isTokenNumber(i))return-1;return numberToCalculation(t,Math.log(i[4].value))}if(2===o.length){const r=o[0];if(!r||!e.isTokenNode(r))return-1;const i=r.value;if(!n.isTokenNumber(i))return-1;const u=o[1];if(!u||!e.isTokenNode(u))return-1;const a=u.value;if(!n.isTokenNumber(a))return-1;return numberToCalculation(t,Math.log(i[4].value)/Math.log(a[4].value))}return-1}const g=/^none$/i;function isNone(t){if(Array.isArray(t)){const n=t.filter((n=>!(e.isWhitespaceNode(n)&&e.isCommentNode(n))));return 1===n.length&&isNone(n[0])}if(!e.isTokenNode(t))return!1;const o=t.value;return!!n.isTokenIdent(o)&&g.test(o[4].value)}function solveRandom(e,t,o,r,i,u){const a=o.value;if(!n.isTokenNumeric(a))return-1;const s=convertUnit(a,r.value);if(!twoOfSameNumeric(a,s))return-1;let l,c=null;if(i&&(c=convertUnit(a,i.value),!twoOfSameNumeric(a,c)))return-1;if(Number.isFinite(a[4].value))if(Number.isFinite(s[4].value))if(c&&(!Number.isFinite(c[4].value)||c[4].value<=0))l=a[4].value;else{const e=sfc32(crc32([t,n.stringify(a),n.stringify(s),i?`by ${i.toString()}`:""].join(",")),u.randomSeed);let o=a[4].value,r=s[4].value;if(o>r&&([o,r]=[r,o]),c){const n=Math.abs(o-r),t=e();l=o+Math.floor(n/c[4].value*t)*c[4].value}else{const n=e();l=Number((n*(r-o)+o).toFixed(5))}}else l=Number.NaN;else l=Number.NaN;return resultToCalculation(e,a,l)}function sfc32(e=.34944106645296036,n=.19228640875738723,t=.8784393832007205,o=.04850964319275053){return()=>{const r=((e|=0)+(n|=0)|0)+(o|=0)|0;return o=o+1|0,e=n^n>>>9,n=(t|=0)+(t<<3)|0,t=(t=t<<21|t>>>11)+r|0,(r>>>0)/4294967296}}function crc32(e){let n=0,t=0,o=0;n=~n;for(let r=0,i=e.length;r<i;r++)o=255&(n^e.charCodeAt(r)),t=Number("0x"+"00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D".substring(9*o,9*o+8)),n=n>>>8^t;return~n>>>0}const D=new Map([["abs",function abs(e,n,t){return singleNodeSolver(e,n,t,solveAbs)}],["acos",function acos(e,n,t){return singleNodeSolver(e,n,t,solveACos)}],["asin",function asin(e,n,t){return singleNodeSolver(e,n,t,solveASin)}],["atan",function atan(e,n,t){return singleNodeSolver(e,n,t,solveATan)}],["atan2",function atan2(e,n,t){return twoCommaSeparatedNodesSolver(e,n,t,solveATan2)}],["calc",calc$1],["clamp",function clamp(t,o,r){const i=resolveGlobalsAndConstants([...t.value.filter((n=>!e.isWhiteSpaceOrCommentNode(n)))],o),u=[],a=[],s=[];{let t=u;for(let o=0;o<i.length;o++){const r=i[o];if(e.isTokenNode(r)&&n.isTokenComma(r.value)){if(t===s)return-1;if(t===a){t=s;continue}if(t===u){t=a;continue}return-1}t.push(r)}}const l=isNone(u),c=isNone(s);if(l&&c)return calc$1(calcWrapper(a),o,r);const m=solve(calc$1(calcWrapper(a),o,r));if(-1===m)return-1;if(l){const t=solve(calc$1(calcWrapper(s),o,r));return-1===t?-1:solveMin((v=m,T=t,new e.FunctionNode([n.TokenType.Function,"min(",-1,-1,{value:"min"}],[n.TokenType.CloseParen,")",-1,-1,void 0],[v,new e.TokenNode([n.TokenType.Comma,",",-1,-1,void 0]),T])),[m,t],r)}if(c){const e=solve(calc$1(calcWrapper(u),o,r));return-1===e?-1:solveMax(maxWrapper(e,m),[e,m],r)}var v,T;const p=solve(calc$1(calcWrapper(u),o,r));if(-1===p)return-1;const N=solve(calc$1(calcWrapper(s),o,r));if(-1===N)return-1;return solveClamp(t,p,m,N,r)}],["cos",function cos(e,n,t){return singleNodeSolver(e,n,t,solveCos)}],["exp",function exp(e,n,t){return singleNodeSolver(e,n,t,solveExp)}],["hypot",function hypot(e,n,t){return variadicNodesSolver(e,e.value,n,t,solveHypot)}],["log",function log(e,n,t){return variadicNodesSolver(e,e.value,n,t,solveLog)}],["max",function max(e,n,t){return variadicNodesSolver(e,e.value,n,t,solveMax)}],["min",function min(e,n,t){return variadicNodesSolver(e,e.value,n,t,solveMin)}],["mod",function mod(e,n,t){return twoCommaSeparatedNodesSolver(e,n,t,solveMod)}],["pow",function pow(e,n,t){return twoCommaSeparatedNodesSolver(e,n,t,solvePow)}],["random",function random(t,o,r){const i=t.value.filter((n=>!e.isWhiteSpaceOrCommentNode(n)));let u="";const a=[],s=[];for(let t=0;t<i.length;t++){const o=i[t];if(!u&&0===s.length&&e.isTokenNode(o)&&n.isTokenIdent(o.value)){const r=o.value[4].value.toLowerCase();if("per-element"===r||r.startsWith("--")){u=r;const o=i[t+1];if(!e.isTokenNode(o)||!n.isTokenComma(o.value))return-1;t++;continue}}if(e.isTokenNode(o)&&n.isTokenComma(o.value)){const o=i[t+1];if(s.length>0&&e.isTokenNode(o)&&n.isTokenIdent(o.value)){const e=o.value[4].value.toLowerCase();if("by"===e||e.startsWith("--")){a.push(...i.slice(t+2));break}}}s.push(o)}const l=twoCommaSeparatedArguments(s,o,r);if(-1===l)return-1;const[c,m]=l;let v=null;if(a.length&&(v=singleArgument(a,o,r),-1===v))return-1;return solveRandom(t,u,c,m,v,r)}],["rem",function rem(e,n,t){return twoCommaSeparatedNodesSolver(e,n,t,solveRem)}],["round",function round(t,o,r){const i=resolveGlobalsAndConstants([...t.value.filter((n=>!e.isWhiteSpaceOrCommentNode(n)))],o);let u="",a=!1;const s=[],l=[];{let t=s;for(let o=0;o<i.length;o++){const r=i[o];if(!u&&0===s.length&&0===l.length&&e.isTokenNode(r)&&n.isTokenIdent(r.value)){const e=r.value[4].value.toLowerCase();if(b.has(e)){u=e;continue}}if(e.isTokenNode(r)&&n.isTokenComma(r.value)){if(t===l)return-1;if(t===s&&u&&0===s.length)continue;if(t===s){a=!0,t=l;continue}return-1}t.push(r)}}const c=solve(calc$1(calcWrapper(s),o,r));if(-1===c)return-1;a||0!==l.length||l.push(new e.TokenNode([n.TokenType.Number,"1",-1,-1,{value:1,type:n.NumberType.Integer}]));const m=solve(calc$1(calcWrapper(l),o,r));if(-1===m)return-1;u||(u="nearest");return solveRound(t,u,c,m,r)}],["sign",function sign(e,n,t){return singleNodeSolver(e,n,t,solveSign)}],["sin",function sin(e,n,t){return singleNodeSolver(e,n,t,solveSin)}],["sqrt",function sqrt(e,n,t){return singleNodeSolver(e,n,t,solveSqrt)}],["tan",function tan(e,n,t){return singleNodeSolver(e,n,t,solveTan)}]]);function calc$1(t,o,r){const i=resolveGlobalsAndConstants([...t.value.filter((n=>!e.isWhiteSpaceOrCommentNode(n)))],o);if(1===i.length&&e.isTokenNode(i[0]))return{inputs:[i[0]],operation:unary};let u=0;for(;u<i.length;){const t=i[u];if(e.isSimpleBlockNode(t)&&n.isTokenOpenParen(t.startToken)){const e=calc$1(t,o,r);if(-1===e)return-1;i.splice(u,1,e)}else if(e.isFunctionNode(t)){const e=D.get(t.getName().toLowerCase());if(!e)return-1;const n=e(t,o,r);if(-1===n)return-1;i.splice(u,1,n)}else u++}if(u=0,1===i.length&&isCalculation(i[0]))return i[0];for(;u<i.length;){const t=i[u];if(!t||!e.isTokenNode(t)&&!isCalculation(t)){u++;continue}const o=i[u+1];if(!o||!e.isTokenNode(o)){u++;continue}const r=o.value;if(!n.isTokenDelim(r)||"*"!==r[4].value&&"/"!==r[4].value){u++;continue}const a=i[u+2];if(!a||!e.isTokenNode(a)&&!isCalculation(a))return-1;"*"!==r[4].value?"/"!==r[4].value?u++:i.splice(u,3,{inputs:[t,a],operation:division}):i.splice(u,3,{inputs:[t,a],operation:multiplication})}if(u=0,1===i.length&&isCalculation(i[0]))return i[0];for(;u<i.length;){const t=i[u];if(!t||!e.isTokenNode(t)&&!isCalculation(t)){u++;continue}const o=i[u+1];if(!o||!e.isTokenNode(o)){u++;continue}const r=o.value;if(!n.isTokenDelim(r)||"+"!==r[4].value&&"-"!==r[4].value){u++;continue}const a=i[u+2];if(!a||!e.isTokenNode(a)&&!isCalculation(a))return-1;"+"!==r[4].value?"-"!==r[4].value?u++:i.splice(u,3,{inputs:[t,a],operation:subtraction}):i.splice(u,3,{inputs:[t,a],operation:addition})}return 1===i.length&&isCalculation(i[0])?i[0]:-1}function singleNodeSolver(e,n,t,o){const r=singleArgument(e.value,n,t);return-1===r?-1:o(e,r,t)}function singleArgument(n,t,o){const r=solve(calc$1(calcWrapper(resolveGlobalsAndConstants([...n.filter((n=>!e.isWhiteSpaceOrCommentNode(n)))],t)),t,o));return-1===r?-1:r}function twoCommaSeparatedNodesSolver(e,n,t,o){const r=twoCommaSeparatedArguments(e.value,n,t);if(-1===r)return-1;const[i,u]=r;return o(e,i,u,t)}function twoCommaSeparatedArguments(t,o,r){const i=resolveGlobalsAndConstants([...t.filter((n=>!e.isWhiteSpaceOrCommentNode(n)))],o),u=[],a=[];{let t=u;for(let o=0;o<i.length;o++){const r=i[o];if(e.isTokenNode(r)&&n.isTokenComma(r.value)){if(t===a)return-1;if(t===u){t=a;continue}return-1}t.push(r)}}const s=solve(calc$1(calcWrapper(u),o,r));if(-1===s)return-1;const l=solve(calc$1(calcWrapper(a),o,r));return-1===l?-1:[s,l]}function variadicNodesSolver(e,n,t,o,r){const i=variadicArguments(e.value,t,o);return-1===i?-1:r(e,i,o)}function variadicArguments(t,o,r){const i=resolveGlobalsAndConstants([...t.filter((n=>!e.isWhiteSpaceOrCommentNode(n)))],o),u=[];{const t=[];let a=[];for(let o=0;o<i.length;o++){const r=i[o];e.isTokenNode(r)&&n.isTokenComma(r.value)?(t.push(a),a=[]):a.push(r)}t.push(a);for(let e=0;e<t.length;e++){if(0===t[e].length)return-1;const n=solve(calc$1(calcWrapper(t[e]),o,r));if(-1===n)return-1;u.push(n)}}return u}const b=new Set(["nearest","up","down","to-zero"]);function calcWrapper(t){return new e.FunctionNode([n.TokenType.Function,"calc(",-1,-1,{value:"calc"}],[n.TokenType.CloseParen,")",-1,-1,void 0],t)}function maxWrapper(t,o){return new e.FunctionNode([n.TokenType.Function,"max(",-1,-1,{value:"max"}],[n.TokenType.CloseParen,")",-1,-1,void 0],[t,new e.TokenNode([n.TokenType.Comma,",",-1,-1,void 0]),o])}function patchNaN(t){if(-1===t)return-1;if(e.isFunctionNode(t))return t;const o=t.value;return n.isTokenNumeric(o)&&Number.isNaN(o[4].value)?n.isTokenNumber(o)?new e.FunctionNode([n.TokenType.Function,"calc(",o[2],o[3],{value:"calc"}],[n.TokenType.CloseParen,")",o[2],o[3],void 0],[new e.TokenNode([n.TokenType.Ident,"NaN",o[2],o[3],{value:"NaN"}])]):n.isTokenDimension(o)?new e.FunctionNode([n.TokenType.Function,"calc(",o[2],o[3],{value:"calc"}],[n.TokenType.CloseParen,")",o[2],o[3],void 0],[new e.TokenNode([n.TokenType.Ident,"NaN",o[2],o[3],{value:"NaN"}]),new e.WhitespaceNode([[n.TokenType.Whitespace," ",o[2],o[3],void 0]]),new e.TokenNode([n.TokenType.Delim,"*",o[2],o[3],{value:"*"}]),new e.WhitespaceNode([[n.TokenType.Whitespace," ",o[2],o[3],void 0]]),new e.TokenNode([n.TokenType.Dimension,"1"+o[4].unit,o[2],o[3],{value:1,type:n.NumberType.Integer,unit:o[4].unit}])]):n.isTokenPercentage(o)?new e.FunctionNode([n.TokenType.Function,"calc(",o[2],o[3],{value:"calc"}],[n.TokenType.CloseParen,")",o[2],o[3],void 0],[new e.TokenNode([n.TokenType.Ident,"NaN",o[2],o[3],{value:"NaN"}]),new e.WhitespaceNode([[n.TokenType.Whitespace," ",o[2],o[3],void 0]]),new e.TokenNode([n.TokenType.Delim,"*",o[2],o[3],{value:"*"}]),new e.WhitespaceNode([[n.TokenType.Whitespace," ",o[2],o[3],void 0]]),new e.TokenNode([n.TokenType.Percentage,"1%",o[2],o[3],{value:1}])]):-1:t}function patchInfinity(t){if(-1===t)return-1;if(e.isFunctionNode(t))return t;const o=t.value;if(!n.isTokenNumeric(o))return t;if(Number.isFinite(o[4].value)||Number.isNaN(o[4].value))return t;let r="";return Number.NEGATIVE_INFINITY===o[4].value&&(r="-"),n.isTokenNumber(o)?new e.FunctionNode([n.TokenType.Function,"calc(",o[2],o[3],{value:"calc"}],[n.TokenType.CloseParen,")",o[2],o[3],void 0],[new e.TokenNode([n.TokenType.Ident,r+"infinity",o[2],o[3],{value:r+"infinity"}])]):n.isTokenDimension(o)?new e.FunctionNode([n.TokenType.Function,"calc(",o[2],o[3],{value:"calc"}],[n.TokenType.CloseParen,")",o[2],o[3],void 0],[new e.TokenNode([n.TokenType.Ident,r+"infinity",o[2],o[3],{value:r+"infinity"}]),new e.WhitespaceNode([[n.TokenType.Whitespace," ",o[2],o[3],void 0]]),new e.TokenNode([n.TokenType.Delim,"*",o[2],o[3],{value:"*"}]),new e.WhitespaceNode([[n.TokenType.Whitespace," ",o[2],o[3],void 0]]),new e.TokenNode([n.TokenType.Dimension,"1"+o[4].unit,o[2],o[3],{value:1,type:n.NumberType.Integer,unit:o[4].unit}])]):new e.FunctionNode([n.TokenType.Function,"calc(",o[2],o[3],{value:"calc"}],[n.TokenType.CloseParen,")",o[2],o[3],void 0],[new e.TokenNode([n.TokenType.Ident,r+"infinity",o[2],o[3],{value:r+"infinity"}]),new e.WhitespaceNode([[n.TokenType.Whitespace," ",o[2],o[3],void 0]]),new e.TokenNode([n.TokenType.Delim,"*",o[2],o[3],{value:"*"}]),new e.WhitespaceNode([[n.TokenType.Whitespace," ",o[2],o[3],void 0]]),new e.TokenNode([n.TokenType.Percentage,"1%",o[2],o[3],{value:1}])])}function patchMinusZero(t){if(-1===t)return-1;if(e.isFunctionNode(t))return t;const o=t.value;return n.isTokenNumeric(o)&&Object.is(-0,o[4].value)?("-0"===o[1]||(n.isTokenPercentage(o)?o[1]="-0%":n.isTokenDimension(o)?o[1]="-0"+o[4].unit:o[1]="-0"),t):t}function patchPrecision(t,o=13){if(-1===t)return-1;if(o<=0)return t;if(e.isFunctionNode(t))return t;const r=t.value;if(!n.isTokenNumeric(r))return t;if(Number.isInteger(r[4].value))return t;const i=Number(r[4].value.toFixed(o)).toString();return n.isTokenNumber(r)?r[1]=i:n.isTokenPercentage(r)?r[1]=i+"%":n.isTokenDimension(r)&&(r[1]=i+r[4].unit),t}function patchCanonicalUnit(t){return-1===t?-1:e.isFunctionNode(t)?t:n.isTokenDimension(t.value)?(t.value=toCanonicalUnit(t.value),t):t}function patchCalcResult(e,n){let t=e;return n?.toCanonicalUnits&&(t=patchCanonicalUnit(t)),t=patchPrecision(t,n?.precision),t=patchMinusZero(t),n?.censorIntoStandardRepresentableValues||(t=patchNaN(t),t=patchInfinity(t)),t}function tokenizeGlobals(e){const t=new Map;if(!e)return t;for(const[o,r]of e)if(n.isToken(r))t.set(o,r);else if("string"!=typeof r);else{const e=n.tokenizer({css:r}),i=e.nextToken();if(e.nextToken(),!e.endOfFile())continue;if(!n.isTokenNumeric(i))continue;t.set(o,i)}return t}function calcFromComponentValues(n,t){const o=tokenizeGlobals(t?.globals);return e.replaceComponentValues(n,(n=>{if(!e.isFunctionNode(n))return;const r=D.get(n.getName().toLowerCase());if(!r)return;const i=patchCalcResult(solve(r(n,o,t??{})),t);return-1!==i?i:void 0}))}const y=new Set(D.keys());exports.calc=function calc(t,o){return calcFromComponentValues(e.parseCommaSeparatedListOfComponentValues(n.tokenize({css:t}),{}),o).map((e=>e.map((e=>n.stringify(...e.tokens()))).join(""))).join(",")},exports.calcFromComponentValues=calcFromComponentValues,exports.mathFunctionNames=y;
