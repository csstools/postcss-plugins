"use strict";var e=require("@csstools/css-tokenizer"),n=require("@csstools/css-parser-algorithms");function isCalculation(e){return!!e&&"object"==typeof e&&"inputs"in e&&Array.isArray(e.inputs)&&"operation"in e}function solve(e){if(-1===e)return-1;const o=[];for(let t=0;t<e.inputs.length;t++){const r=e.inputs[t];if(n.isTokenNode(r)){o.push(r);continue}const u=solve(r);if(-1===u)return-1;o.push(u)}return e.operation(o)}const o=/[A-Z]/g;function toLowerCaseAZ(e){return e.replace(o,(e=>String.fromCharCode(e.charCodeAt(0)+32)))}const t={cm:"px",in:"px",mm:"px",pc:"px",pt:"px",px:"px",q:"px",deg:"deg",grad:"deg",rad:"deg",turn:"deg",ms:"s",s:"s",hz:"hz",khz:"hz"},r=new Map([["cm",e=>e],["mm",e=>10*e],["q",e=>40*e],["in",e=>e/2.54],["pc",e=>e/2.54*6],["pt",e=>e/2.54*72],["px",e=>e/2.54*96]]),u=new Map([["deg",e=>e],["grad",e=>e/.9],["rad",e=>e/180*Math.PI],["turn",e=>e/360]]),i=new Map([["deg",e=>.9*e],["grad",e=>e],["rad",e=>.9*e/180*Math.PI],["turn",e=>.9*e/360]]),a=new Map([["hz",e=>e],["khz",e=>e/1e3]]),l=new Map([["cm",e=>2.54*e],["mm",e=>25.4*e],["q",e=>25.4*e*4],["in",e=>e],["pc",e=>6*e],["pt",e=>72*e],["px",e=>96*e]]),s=new Map([["hz",e=>1e3*e],["khz",e=>e]]),c=new Map([["cm",e=>e/10],["mm",e=>e],["q",e=>4*e],["in",e=>e/25.4],["pc",e=>e/25.4*6],["pt",e=>e/25.4*72],["px",e=>e/25.4*96]]),T=new Map([["ms",e=>e],["s",e=>e/1e3]]),p=new Map([["cm",e=>e/6*2.54],["mm",e=>e/6*25.4],["q",e=>e/6*25.4*4],["in",e=>e/6],["pc",e=>e],["pt",e=>e/6*72],["px",e=>e/6*96]]),v=new Map([["cm",e=>e/72*2.54],["mm",e=>e/72*25.4],["q",e=>e/72*25.4*4],["in",e=>e/72],["pc",e=>e/72*6],["pt",e=>e],["px",e=>e/72*96]]),m=new Map([["cm",e=>e/96*2.54],["mm",e=>e/96*25.4],["q",e=>e/96*25.4*4],["in",e=>e/96],["pc",e=>e/96*6],["pt",e=>e/96*72],["px",e=>e]]),N=new Map([["cm",e=>e/4/10],["mm",e=>e/4],["q",e=>e],["in",e=>e/4/25.4],["pc",e=>e/4/25.4*6],["pt",e=>e/4/25.4*72],["px",e=>e/4/25.4*96]]),f=new Map([["deg",e=>180*e/Math.PI],["grad",e=>180*e/Math.PI/.9],["rad",e=>e],["turn",e=>180*e/Math.PI/360]]),y=new Map([["ms",e=>1e3*e],["s",e=>e]]),k=new Map([["deg",e=>360*e],["grad",e=>360*e/.9],["rad",e=>360*e/180*Math.PI],["turn",e=>e]]),d=new Map([["cm",r],["mm",c],["q",N],["in",l],["pc",p],["pt",v],["px",m],["ms",T],["s",y],["deg",u],["grad",i],["rad",f],["turn",k],["hz",a],["khz",s]]);function convertUnit(n,o){if(n[0]!==e.TokenType.Dimension)return o;if(o[0]!==e.TokenType.Dimension)return o;const t=toLowerCaseAZ(n[4].unit),r=toLowerCaseAZ(o[4].unit);if(t===r)return o;const u=d.get(r);if(!u)return o;const i=u.get(t);if(!i)return o;const a=i(o[4].value);return[e.TokenType.Dimension,a.toString()+n[4].unit,o[2],o[3],{value:a,unit:n[4].unit,type:Number.isInteger(a)?e.NumberType.Integer:e.NumberType.Number}]}function toCanonicalUnit(n){if(n[0]!==e.TokenType.Dimension)return n;const o=toLowerCaseAZ(n[4].unit),r=t[o];if(o===r)return n;const u=d.get(o);if(!u)return n;const i=u.get(r);if(!i)return n;const a=i(n[4].value);return[e.TokenType.Dimension,a.toString()+r,n[2],n[3],{value:a,unit:r,type:Number.isInteger(a)?e.NumberType.Integer:e.NumberType.Number}]}function addition(o){if(2!==o.length)return-1;const t=o[0].value;let r=o[1].value;if(t[0]===e.TokenType.Number&&r[0]===e.TokenType.Number){const o=t[4].value+r[4].value;return new n.TokenNode([e.TokenType.Number,o.toString(),t[2],r[3],{value:o,type:t[4].type===e.NumberType.Integer&&r[4].type===e.NumberType.Integer?e.NumberType.Integer:e.NumberType.Number}])}if(t[0]===e.TokenType.Percentage&&r[0]===e.TokenType.Percentage){const o=t[4].value+r[4].value;return new n.TokenNode([e.TokenType.Percentage,o.toString()+"%",t[2],r[3],{value:o}])}if(t[0]===e.TokenType.Dimension&&r[0]===e.TokenType.Dimension&&(r=convertUnit(t,r),toLowerCaseAZ(t[4].unit)===toLowerCaseAZ(r[4].unit))){const o=t[4].value+r[4].value;return new n.TokenNode([e.TokenType.Dimension,o.toString()+t[4].unit,t[2],r[3],{value:o,type:t[4].type===e.NumberType.Integer&&r[4].type===e.NumberType.Integer?e.NumberType.Integer:e.NumberType.Number,unit:t[4].unit}])}return-1}function division(o){if(2!==o.length)return-1;const t=o[0].value,r=o[1].value;if(t[0]===e.TokenType.Number&&r[0]===e.TokenType.Number){const o=t[4].value/r[4].value;return new n.TokenNode([e.TokenType.Number,o.toString(),t[2],r[3],{value:o,type:Number.isInteger(o)?e.NumberType.Integer:e.NumberType.Number}])}if(t[0]===e.TokenType.Percentage&&r[0]===e.TokenType.Number){const o=t[4].value/r[4].value;return new n.TokenNode([e.TokenType.Percentage,o.toString()+"%",t[2],r[3],{value:o}])}if(t[0]===e.TokenType.Dimension&&r[0]===e.TokenType.Number){const o=t[4].value/r[4].value;return new n.TokenNode([e.TokenType.Dimension,o.toString()+t[4].unit,t[2],r[3],{value:o,type:Number.isInteger(o)?e.NumberType.Integer:e.NumberType.Number,unit:t[4].unit}])}return-1}function multiplication(o){if(2!==o.length)return-1;const t=o[0].value,r=o[1].value;if(t[0]===e.TokenType.Number&&r[0]===e.TokenType.Number){const o=t[4].value*r[4].value;return new n.TokenNode([e.TokenType.Number,o.toString(),t[2],r[3],{value:o,type:t[4].type===e.NumberType.Integer&&r[4].type===e.NumberType.Integer?e.NumberType.Integer:e.NumberType.Number}])}if(t[0]===e.TokenType.Percentage&&r[0]===e.TokenType.Number){const o=t[4].value*r[4].value;return new n.TokenNode([e.TokenType.Percentage,o.toString()+"%",t[2],r[3],{value:o}])}if(t[0]===e.TokenType.Number&&r[0]===e.TokenType.Percentage){const o=t[4].value*r[4].value;return new n.TokenNode([e.TokenType.Percentage,o.toString()+"%",t[2],r[3],{value:o}])}if(t[0]===e.TokenType.Dimension&&r[0]===e.TokenType.Number){const o=t[4].value*r[4].value;return new n.TokenNode([e.TokenType.Dimension,o.toString()+t[4].unit,t[2],r[3],{value:o,type:t[4].type===e.NumberType.Integer&&r[4].type===e.NumberType.Integer?e.NumberType.Integer:e.NumberType.Number,unit:t[4].unit}])}if(t[0]===e.TokenType.Number&&r[0]===e.TokenType.Dimension){const o=t[4].value*r[4].value;return new n.TokenNode([e.TokenType.Dimension,o.toString()+r[4].unit,t[2],r[3],{value:o,type:t[4].type===e.NumberType.Integer&&r[4].type===e.NumberType.Integer?e.NumberType.Integer:e.NumberType.Number,unit:r[4].unit}])}return-1}function resolveGlobalsAndConstants(o,t){for(let r=0;r<o.length;r++){const u=o[r];if(!n.isTokenNode(u))continue;const i=u.value;if(i[0]!==e.TokenType.Ident)continue;const a=toLowerCaseAZ(i[4].value);switch(a){case"e":o.splice(r,1,new n.TokenNode([e.TokenType.Number,Math.E.toString(),i[2],i[3],{value:Math.E,type:e.NumberType.Number}]));break;case"pi":o.splice(r,1,new n.TokenNode([e.TokenType.Number,Math.PI.toString(),i[2],i[3],{value:Math.PI,type:e.NumberType.Number}]));break;case"infinity":o.splice(r,1,new n.TokenNode([e.TokenType.Number,"infinity",i[2],i[3],{value:1/0,type:e.NumberType.Number}]));break;case"-infinity":o.splice(r,1,new n.TokenNode([e.TokenType.Number,"-infinity",i[2],i[3],{value:-1/0,type:e.NumberType.Number}]));break;case"nan":o.splice(r,1,new n.TokenNode([e.TokenType.Number,"NaN",i[2],i[3],{value:Number.NaN,type:e.NumberType.Number}]));break;default:if(t.has(a)){const e=t.get(a);o.splice(r,1,new n.TokenNode(e))}}}return o}function isNumeric(n){return n[0]===e.TokenType.Dimension||(n[0]===e.TokenType.Percentage||n[0]===e.TokenType.Number)}function isDimensionOrNumber(n){return n[0]===e.TokenType.Dimension||n[0]===e.TokenType.Number}function arrayOfSameNumeric(n){if(0===n.length)return!0;const o=n[0];if(!isNumeric(o))return!1;if(1===n.length)return!0;if(o[0]===e.TokenType.Dimension){const e=toLowerCaseAZ(o[4].unit);for(let t=1;t<n.length;t++){const r=n[t];if(o[0]!==r[0])return!1;if(e!==toLowerCaseAZ(r[4].unit))return!1}return!0}for(let e=1;e<n.length;e++){const t=n[e];if(o[0]!==t[0])return!1}return!0}function twoOfSameNumeric(n,o){return!!isNumeric(n)&&(n[0]===e.TokenType.Dimension?n[0]===o[0]&&toLowerCaseAZ(n[4].unit)===toLowerCaseAZ(o[4].unit):n[0]===o[0])}function unary(e){if(1!==e.length)return-1;return isNumeric(e[0].value)?e[0]:-1}function resultToCalculation(n,o,t){return o[0]===e.TokenType.Dimension?dimensionToCalculation(n,o[4].unit,t):o[0]===e.TokenType.Percentage?percentageToCalculation(n,t):o[0]===e.TokenType.Number?numberToCalculation(n,t):-1}function dimensionToCalculation(o,t,r){const u=o.tokens();return{inputs:[new n.TokenNode([e.TokenType.Dimension,r.toString()+t,u[0][2],u[u.length-1][3],{value:r,type:Number.isInteger(r)?e.NumberType.Integer:e.NumberType.Number,unit:t}])],operation:unary}}function percentageToCalculation(o,t){const r=o.tokens();return{inputs:[new n.TokenNode([e.TokenType.Percentage,t.toString()+"%",r[0][2],r[r.length-1][3],{value:t}])],operation:unary}}function numberToCalculation(o,t){const r=o.tokens();return{inputs:[new n.TokenNode([e.TokenType.Number,t.toString(),r[0][2],r[r.length-1][3],{value:t,type:Number.isInteger(t)?e.NumberType.Integer:e.NumberType.Number}])],operation:unary}}function solveACos(n,o){const t=o.value;if(t[0]!==e.TokenType.Number)return-1;return dimensionToCalculation(n,"rad",Math.acos(t[4].value))}function solveASin(n,o){const t=o.value;if(t[0]!==e.TokenType.Number)return-1;return dimensionToCalculation(n,"rad",Math.asin(t[4].value))}function solveATan(n,o){const t=o.value;if(t[0]!==e.TokenType.Number)return-1;return dimensionToCalculation(n,"rad",Math.atan(t[4].value))}function solveATan2(e,n,o){const t=n.value;if(!isDimensionOrNumber(t))return-1;const r=convertUnit(t,o.value);if(!twoOfSameNumeric(t,r))return-1;return dimensionToCalculation(e,"rad",Math.atan2(t[4].value,r[4].value))}function solveAbs(e,n){const o=n.value;if(!isDimensionOrNumber(o))return-1;return resultToCalculation(e,o,Math.abs(o[4].value))}function solveClamp(e,o,t,r){if(!n.isTokenNode(o)||!n.isTokenNode(t)||!n.isTokenNode(r))return-1;const u=o.value;if(!isNumeric(u))return-1;const i=convertUnit(u,t.value);if(!twoOfSameNumeric(u,i))return-1;const a=convertUnit(u,r.value);if(!twoOfSameNumeric(u,a))return-1;return resultToCalculation(e,u,Math.max(u[4].value,Math.min(i[4].value,a[4].value)))}function solveCos(n,o){const t=o.value;if(!isDimensionOrNumber(t))return-1;if(t[0]===e.TokenType.Dimension)switch(toLowerCaseAZ(t[4].unit)){case"rad":break;case"deg":t[4].value=u.get("rad")(t[4].value);break;case"grad":t[4].value=i.get("rad")(t[4].value);break;case"turn":t[4].value=k.get("rad")(t[4].value);break;default:return-1}return numberToCalculation(n,Math.cos(t[4].value))}function solveExp(n,o){const t=o.value;if(t[0]!==e.TokenType.Number)return-1;return numberToCalculation(n,Math.exp(t[4].value))}function solveHypot(e,o){const t=o[0];if(!t||!n.isTokenNode(t))return-1;if(1!==new Set(o.map((e=>e.type))).size)return-1;const r=t.value;if(!isNumeric(r))return-1;const u=o.map((e=>convertUnit(r,e.value)));if(!arrayOfSameNumeric(u))return-1;const i=u.map((e=>e[4].value)),a=Math.hypot(...i);return resultToCalculation(e,r,a)}function solveMax(e,o){const t=o[0];if(!t||!n.isTokenNode(t))return-1;if(1!==new Set(o.map((e=>e.type))).size)return-1;const r=t.value;if(!isNumeric(r))return-1;const u=o.map((e=>convertUnit(r,e.value)));if(!arrayOfSameNumeric(u))return-1;const i=u.map((e=>e[4].value)),a=Math.max(...i);return resultToCalculation(e,r,a)}function solveMin(e,o){const t=o[0];if(!t||!n.isTokenNode(t))return-1;if(1!==new Set(o.map((e=>e.type))).size)return-1;const r=t.value;if(!isNumeric(r))return-1;const u=o.map((e=>convertUnit(r,e.value)));if(!arrayOfSameNumeric(u))return-1;const i=u.map((e=>e[4].value)),a=Math.min(...i);return resultToCalculation(e,r,a)}function solveMod(e,n,o){const t=n.value;if(!isNumeric(t))return-1;const r=convertUnit(t,o.value);if(!twoOfSameNumeric(t,r))return-1;let u;return u=0===r[4].value?Number.NaN:Number.isFinite(t[4].value)&&(Number.isFinite(r[4].value)||(r[4].value!==Number.POSITIVE_INFINITY||t[4].value!==Number.NEGATIVE_INFINITY&&!Object.is(0*t[4].value,-0))&&(r[4].value!==Number.NEGATIVE_INFINITY||t[4].value!==Number.POSITIVE_INFINITY&&!Object.is(0*t[4].value,0)))?Number.isFinite(r[4].value)?(t[4].value%r[4].value+r[4].value)%r[4].value:t[4].value:Number.NaN,resultToCalculation(e,t,u)}function solvePow(n,o,t){const r=o.value,u=t.value;if(r[0]!==e.TokenType.Number)return-1;if(!twoOfSameNumeric(r,u))return-1;return numberToCalculation(n,Math.pow(r[4].value,u[4].value))}function solveRem(e,n,o){const t=n.value;if(!isNumeric(t))return-1;const r=convertUnit(t,o.value);if(!twoOfSameNumeric(t,r))return-1;let u;return u=0===r[4].value?Number.NaN:Number.isFinite(t[4].value)?Number.isFinite(r[4].value)?t[4].value%r[4].value:t[4].value:Number.NaN,resultToCalculation(e,t,u)}function solveRound(e,n,o,t){const r=o.value;if(!isNumeric(r))return-1;const u=convertUnit(r,t.value);if(!twoOfSameNumeric(r,u))return-1;let i;if(0===u[4].value)i=Number.NaN;else if(Number.isFinite(r[4].value)||Number.isFinite(u[4].value))if(!Number.isFinite(r[4].value)&&Number.isFinite(u[4].value))i=r[4].value;else if(Number.isFinite(r[4].value)&&!Number.isFinite(u[4].value))switch(n){case"down":i=r[4].value<0?-1/0:Object.is(-0,0*r[4].value)?-0:0;break;case"up":i=r[4].value>0?1/0:Object.is(0,0*r[4].value)?0:-0;break;default:i=Object.is(0,0*r[4].value)?0:-0}else if(Number.isFinite(u[4].value))switch(n){case"down":i=Math.floor(r[4].value/u[4].value)*u[4].value;break;case"up":i=Math.ceil(r[4].value/u[4].value)*u[4].value;break;case"to-zero":i=Math.trunc(r[4].value/u[4].value)*u[4].value;break;default:{let e=Math.floor(r[4].value/u[4].value)*u[4].value,n=Math.ceil(r[4].value/u[4].value)*u[4].value;if(e>n){const o=e;e=n,n=o}const o=Math.abs(r[4].value-e),t=Math.abs(r[4].value-n);i=o===t?n:o<t?e:n;break}}else i=r[4].value;else i=Number.NaN;return resultToCalculation(e,r,i)}function solveSign(e,n){const o=n.value;if(!isDimensionOrNumber(o))return-1;return numberToCalculation(e,Math.sign(o[4].value))}function solveSin(n,o){const t=o.value;if(!isDimensionOrNumber(t))return-1;if(t[0]===e.TokenType.Dimension)switch(toLowerCaseAZ(t[4].unit)){case"rad":break;case"deg":t[4].value=u.get("rad")(t[4].value);break;case"grad":t[4].value=i.get("rad")(t[4].value);break;case"turn":t[4].value=k.get("rad")(t[4].value);break;default:return-1}return numberToCalculation(n,Math.sin(t[4].value))}function solveSqrt(n,o){const t=o.value;if(t[0]!==e.TokenType.Number)return-1;return numberToCalculation(n,Math.sqrt(t[4].value))}function solveTan(n,o){const t=o.value;if(!isDimensionOrNumber(t))return-1;const r=t[4].value;let a=0;if(t[0]===e.TokenType.Dimension)switch(toLowerCaseAZ(t[4].unit)){case"rad":a=f.get("deg")(r);break;case"deg":a=r,t[4].value=u.get("rad")(r);break;case"grad":a=i.get("deg")(r),t[4].value=i.get("rad")(r);break;case"turn":a=k.get("deg")(r),t[4].value=k.get("rad")(r);break;default:return-1}const l=a/90;let s;return s=a%90==0&&l%2!=0?l>0?1/0:-1/0:Math.tan(t[4].value),numberToCalculation(n,s)}function subtraction(o){if(2!==o.length)return-1;const t=o[0].value;let r=o[1].value;if(t[0]===e.TokenType.Number&&r[0]===e.TokenType.Number){const o=t[4].value-r[4].value;return new n.TokenNode([e.TokenType.Number,o.toString(),t[2],r[3],{value:o,type:t[4].type===e.NumberType.Integer&&r[4].type===e.NumberType.Integer?e.NumberType.Integer:e.NumberType.Number}])}if(t[0]===e.TokenType.Percentage&&r[0]===e.TokenType.Percentage){const o=t[4].value-r[4].value;return new n.TokenNode([e.TokenType.Percentage,o.toString()+"%",t[2],r[3],{value:o}])}if(t[0]===e.TokenType.Dimension&&r[0]===e.TokenType.Dimension&&(r=convertUnit(t,r),toLowerCaseAZ(t[4].unit)===toLowerCaseAZ(r[4].unit))){const o=t[4].value-r[4].value;return new n.TokenNode([e.TokenType.Dimension,o.toString()+t[4].unit,t[2],r[3],{value:o,type:t[4].type===e.NumberType.Integer&&r[4].type===e.NumberType.Integer?e.NumberType.Integer:e.NumberType.Number,unit:t[4].unit}])}return-1}function solveLog(o,t){if(1===t.length){const r=t[0];if(!r||!n.isTokenNode(r))return-1;const u=r.value;if(u[0]!==e.TokenType.Number)return-1;return numberToCalculation(o,Math.log(u[4].value))}if(2===t.length){const r=t[0];if(!r||!n.isTokenNode(r))return-1;const u=r.value;if(u[0]!==e.TokenType.Number)return-1;const i=t[1];if(!i||!n.isTokenNode(i))return-1;const a=i.value;if(a[0]!==e.TokenType.Number)return-1;return numberToCalculation(o,Math.log(u[4].value)/Math.log(a[4].value))}return-1}const b=new Map([["abs",function abs(e,n){return singleNodeSolver(e,n,solveAbs)}],["acos",function acos(e,n){return singleNodeSolver(e,n,solveACos)}],["asin",function asin(e,n){return singleNodeSolver(e,n,solveASin)}],["atan",function atan(e,n){return singleNodeSolver(e,n,solveATan)}],["atan2",function atan2(e,n){return twoCommaSeparatedNodesSolver(e,n,solveATan2)}],["calc",calc$1],["clamp",function clamp(o,t){const r=resolveGlobalsAndConstants([...o.value.filter((e=>!n.isCommentNode(e)&&!n.isWhitespaceNode(e)))],t),u=[],i=[],a=[];{let o=u;for(let t=0;t<r.length;t++){const l=r[t];if(n.isTokenNode(l)&&l.value[0]===e.TokenType.Comma){if(o===a)return-1;if(o===i){o=a;continue}if(o===u){o=i;continue}return-1}o.push(l)}}const l=solve(calc$1(new n.FunctionNode([e.TokenType.Function,"calc(",-1,-1,{value:"calc"}],[e.TokenType.CloseParen,")",-1,-1,void 0],u),t));if(-1===l)return-1;const s=solve(calc$1(new n.FunctionNode([e.TokenType.Function,"calc(",-1,-1,{value:"calc"}],[e.TokenType.CloseParen,")",-1,-1,void 0],i),t));if(-1===s)return-1;const c=solve(calc$1(new n.FunctionNode([e.TokenType.Function,"calc(",-1,-1,{value:"calc"}],[e.TokenType.CloseParen,")",-1,-1,void 0],a),t));if(-1===c)return-1;return solveClamp(o,l,s,c)}],["cos",function cos(e,n){return singleNodeSolver(e,n,solveCos)}],["exp",function exp(e,n){return singleNodeSolver(e,n,solveExp)}],["hypot",function hypot(e,n){return variadicNodesSolver(e,n,solveHypot)}],["log",function log(e,n){return variadicNodesSolver(e,n,solveLog)}],["max",function max(e,n){return variadicNodesSolver(e,n,solveMax)}],["min",function min(e,n){return variadicNodesSolver(e,n,solveMin)}],["mod",function mod(e,n){return twoCommaSeparatedNodesSolver(e,n,solveMod)}],["pow",function pow(e,n){return twoCommaSeparatedNodesSolver(e,n,solvePow)}],["rem",function rem(e,n){return twoCommaSeparatedNodesSolver(e,n,solveRem)}],["round",function round(o,t){const r=resolveGlobalsAndConstants([...o.value.filter((e=>!n.isCommentNode(e)&&!n.isWhitespaceNode(e)))],t);let u="";const i=[],a=[];{let o=i;for(let t=0;t<r.length;t++){const l=r[t];if(!u&&0===i.length&&0===a.length&&n.isTokenNode(l)&&l.value[0]===e.TokenType.Ident){const e=toLowerCaseAZ(l.value[4].value);if(g.has(e)){u=e;continue}}if(n.isTokenNode(l)&&l.value[0]===e.TokenType.Comma){if(o===a)return-1;if(o===i&&u&&0===i.length)continue;if(o===i){o=a;continue}return-1}o.push(l)}}const l=solve(calc$1(new n.FunctionNode([e.TokenType.Function,"calc(",-1,-1,{value:"calc"}],[e.TokenType.CloseParen,")",-1,-1,void 0],i),t));if(-1===l)return-1;const s=solve(calc$1(new n.FunctionNode([e.TokenType.Function,"calc(",-1,-1,{value:"calc"}],[e.TokenType.CloseParen,")",-1,-1,void 0],a),t));if(-1===s)return-1;u||(u="nearest");return solveRound(o,u,l,s)}],["sign",function sign(e,n){return singleNodeSolver(e,n,solveSign)}],["sin",function sin(e,n){return singleNodeSolver(e,n,solveSin)}],["sqrt",function sqrt(e,n){return singleNodeSolver(e,n,solveSqrt)}],["tan",function tan(e,n){return singleNodeSolver(e,n,solveTan)}]]);function calc$1(o,t){const r=resolveGlobalsAndConstants([...o.value.filter((e=>!n.isCommentNode(e)&&!n.isWhitespaceNode(e)))],t);if(1===r.length&&n.isTokenNode(r[0]))return{inputs:[r[0]],operation:unary};let u=0;for(;u<r.length;){const o=r[u];if(n.isSimpleBlockNode(o)&&o.startToken[0]===e.TokenType.OpenParen){const e=calc$1(o,t);if(-1===e)return-1;r.splice(u,1,e)}else if(n.isFunctionNode(o)){const e=b.get(toLowerCaseAZ(o.getName()));if(!e)return-1;{const n=e(o,t);if(-1===n)return-1;r.splice(u,1,n)}}else u++}if(u=0,1===r.length&&isCalculation(r[0]))return r[0];for(;u<r.length;){const o=r[u];if(!o||!n.isTokenNode(o)&&!isCalculation(o)){u++;continue}const t=r[u+1];if(!t||!n.isTokenNode(t)){u++;continue}const i=t.value;if(i[0]!==e.TokenType.Delim||"*"!==i[4].value&&"/"!==i[4].value){u++;continue}const a=r[u+2];if(!a||!n.isTokenNode(a)&&!isCalculation(a))return-1;"*"!==i[4].value?"/"!==i[4].value?u++:r.splice(u,3,{inputs:[o,a],operation:division}):r.splice(u,3,{inputs:[o,a],operation:multiplication})}if(u=0,1===r.length&&isCalculation(r[0]))return r[0];for(;u<r.length;){const o=r[u];if(!o||!n.isTokenNode(o)&&!isCalculation(o)){u++;continue}const t=r[u+1];if(!t||!n.isTokenNode(t)){u++;continue}const i=t.value;if(i[0]!==e.TokenType.Delim||"+"!==i[4].value&&"-"!==i[4].value){u++;continue}const a=r[u+2];if(!a||!n.isTokenNode(a)&&!isCalculation(a))return-1;"+"!==i[4].value?"-"!==i[4].value?u++:r.splice(u,3,{inputs:[o,a],operation:subtraction}):r.splice(u,3,{inputs:[o,a],operation:addition})}return 1===r.length&&isCalculation(r[0])?r[0]:-1}function singleNodeSolver(o,t,r){const u=resolveGlobalsAndConstants([...o.value.filter((e=>!n.isCommentNode(e)&&!n.isWhitespaceNode(e)))],t),i=solve(calc$1(new n.FunctionNode([e.TokenType.Function,"calc(",-1,-1,{value:"calc"}],[e.TokenType.CloseParen,")",-1,-1,void 0],u),t));return-1===i?-1:r(o,i)}function twoCommaSeparatedNodesSolver(o,t,r){const u=resolveGlobalsAndConstants([...o.value.filter((e=>!n.isCommentNode(e)&&!n.isWhitespaceNode(e)))],t),i=[],a=[];{let o=i;for(let t=0;t<u.length;t++){const r=u[t];if(n.isTokenNode(r)&&r.value[0]===e.TokenType.Comma){if(o===a)return-1;if(o===i){o=a;continue}return-1}o.push(r)}}const l=solve(calc$1(new n.FunctionNode([e.TokenType.Function,"calc(",-1,-1,{value:"calc"}],[e.TokenType.CloseParen,")",-1,-1,void 0],i),t));if(-1===l)return-1;const s=solve(calc$1(new n.FunctionNode([e.TokenType.Function,"calc(",-1,-1,{value:"calc"}],[e.TokenType.CloseParen,")",-1,-1,void 0],a),t));return-1===s?-1:r(o,l,s)}function variadicNodesSolver(o,t,r){const u=resolveGlobalsAndConstants([...o.value.filter((e=>!n.isCommentNode(e)&&!n.isWhitespaceNode(e)))],t),i=[];{const o=[];let r=[];for(let t=0;t<u.length;t++){const i=u[t];n.isTokenNode(i)&&i.value[0]===e.TokenType.Comma?(o.push(r),r=[]):r.push(i)}o.push(r);for(let r=0;r<o.length;r++){if(0===o[r].length)return-1;const u=solve(calc$1(new n.FunctionNode([e.TokenType.Function,"calc(",-1,-1,{value:"calc"}],[e.TokenType.CloseParen,")",-1,-1,void 0],o[r]),t));if(-1===u)return-1;i.push(u)}}return r(o,i)}const g=new Set(["nearest","up","down","to-zero"]);function tokenizeGlobals(n){const o=new Map;if(!n)return o;for(const[t,r]of n)if(e.isToken(r))o.set(t,r);else if("string"!=typeof r);else{const n=e.tokenizer({css:r}),u=n.nextToken();if(n.nextToken(),!n.endOfFile())continue;if(!u)continue;if(u[0]!==e.TokenType.Number&&u[0]!==e.TokenType.Dimension&&u[0]!==e.TokenType.Percentage)continue;o.set(t,u)}return o}function patchNaN(o){if(-1===o)return-1;if(n.isFunctionNode(o))return o;const t=o.value;return t[0]!==e.TokenType.Number&&t[0]!==e.TokenType.Percentage&&t[0]!==e.TokenType.Dimension?o:Number.isNaN(t[4].value)?t[0]===e.TokenType.Number?new n.FunctionNode([e.TokenType.Function,"calc(",t[2],t[3],{value:"calc"}],[e.TokenType.CloseParen,")",t[2],t[3],void 0],[new n.TokenNode([e.TokenType.Ident,"NaN",t[2],t[3],{value:"NaN"}])]):t[0]===e.TokenType.Dimension?new n.FunctionNode([e.TokenType.Function,"calc(",t[2],t[3],{value:"calc"}],[e.TokenType.CloseParen,")",t[2],t[3],void 0],[new n.TokenNode([e.TokenType.Ident,"NaN",t[2],t[3],{value:"NaN"}]),new n.WhitespaceNode([[e.TokenType.Whitespace," ",t[2],t[3],void 0]]),new n.TokenNode([e.TokenType.Delim,"*",t[2],t[3],{value:"*"}]),new n.WhitespaceNode([[e.TokenType.Whitespace," ",t[2],t[3],void 0]]),new n.TokenNode([e.TokenType.Dimension,"1"+t[4].unit,t[2],t[3],{value:1,type:e.NumberType.Integer,unit:t[4].unit}])]):t[0]===e.TokenType.Percentage?new n.FunctionNode([e.TokenType.Function,"calc(",t[2],t[3],{value:"calc"}],[e.TokenType.CloseParen,")",t[2],t[3],void 0],[new n.TokenNode([e.TokenType.Ident,"NaN",t[2],t[3],{value:"NaN"}]),new n.WhitespaceNode([[e.TokenType.Whitespace," ",t[2],t[3],void 0]]),new n.TokenNode([e.TokenType.Delim,"*",t[2],t[3],{value:"*"}]),new n.WhitespaceNode([[e.TokenType.Whitespace," ",t[2],t[3],void 0]]),new n.TokenNode([e.TokenType.Percentage,"1%",t[2],t[3],{value:1}])]):-1:o}function patchInfinity(o){if(-1===o)return-1;if(n.isFunctionNode(o))return o;const t=o.value;if(t[0]!==e.TokenType.Number&&t[0]!==e.TokenType.Percentage&&t[0]!==e.TokenType.Dimension)return o;if(Number.isFinite(t[4].value))return o;let r="";return Number.NEGATIVE_INFINITY===t[4].value&&(r="-"),t[0]===e.TokenType.Number?new n.FunctionNode([e.TokenType.Function,"calc(",t[2],t[3],{value:"calc"}],[e.TokenType.CloseParen,")",t[2],t[3],void 0],[new n.TokenNode([e.TokenType.Ident,r+"infinity",t[2],t[3],{value:r+"infinity"}])]):t[0]===e.TokenType.Dimension?new n.FunctionNode([e.TokenType.Function,"calc(",t[2],t[3],{value:"calc"}],[e.TokenType.CloseParen,")",t[2],t[3],void 0],[new n.TokenNode([e.TokenType.Ident,r+"infinity",t[2],t[3],{value:r+"infinity"}]),new n.WhitespaceNode([[e.TokenType.Whitespace," ",t[2],t[3],void 0]]),new n.TokenNode([e.TokenType.Delim,"*",t[2],t[3],{value:"*"}]),new n.WhitespaceNode([[e.TokenType.Whitespace," ",t[2],t[3],void 0]]),new n.TokenNode([e.TokenType.Dimension,"1"+t[4].unit,t[2],t[3],{value:1,type:e.NumberType.Integer,unit:t[4].unit}])]):t[0]===e.TokenType.Percentage?new n.FunctionNode([e.TokenType.Function,"calc(",t[2],t[3],{value:"calc"}],[e.TokenType.CloseParen,")",t[2],t[3],void 0],[new n.TokenNode([e.TokenType.Ident,r+"infinity",t[2],t[3],{value:r+"infinity"}]),new n.WhitespaceNode([[e.TokenType.Whitespace," ",t[2],t[3],void 0]]),new n.TokenNode([e.TokenType.Delim,"*",t[2],t[3],{value:"*"}]),new n.WhitespaceNode([[e.TokenType.Whitespace," ",t[2],t[3],void 0]]),new n.TokenNode([e.TokenType.Percentage,"1%",t[2],t[3],{value:1}])]):-1}function patchMinusZero(o){if(-1===o)return-1;if(n.isFunctionNode(o))return o;const t=o.value;return t[0]!==e.TokenType.Number&&t[0]!==e.TokenType.Percentage&&t[0]!==e.TokenType.Dimension?o:Object.is(-0,t[4].value)?("-0"===t[1]||(t[1]="-0"),o):o}function patchPrecision(o,t=13){if(-1===o)return-1;if(n.isFunctionNode(o))return o;const r=o.value;if(r[0]!==e.TokenType.Number&&r[0]!==e.TokenType.Percentage&&r[0]!==e.TokenType.Dimension)return o;if(Number.isInteger(r[4].value))return o;const u=Number(r[4].value.toFixed(t)).toString();return r[0]===e.TokenType.Number?r[1]=u:r[0]===e.TokenType.Percentage?r[1]=u+"%":r[0]===e.TokenType.Dimension&&(r[1]=u+r[4].unit),o}function patchCanonicalUnit(o){return-1===o?-1:(n.isFunctionNode(o)||o.value[0]!==e.TokenType.Dimension||(o.value=toCanonicalUnit(o.value)),o)}function patchCalcResult(e,n){let o=e;return o=patchNaN(e),o=patchInfinity(o),null!=n&&n.toCanonicalUnits&&(o=patchCanonicalUnit(o)),o=patchPrecision(o,null==n?void 0:n.precision),o=patchMinusZero(o),o}function calcFromComponentValues(e,o){const t=tokenizeGlobals(null==o?void 0:o.globals);for(let r=0;r<e.length;r++){const u=e[r];for(let e=0;e<u.length;e++){const r=u[e];if(n.isFunctionNode(r)){const n=b.get(toLowerCaseAZ(r.getName()));if(n){const i=patchCalcResult(solve(n(r,t)),o);if(-1!==i){u.splice(e,1,i);continue}}}(n.isSimpleBlockNode(r)||n.isFunctionNode(r))&&r.walk(((e,r)=>{if("number"!=typeof r)return;const u=e.node;if(n.isFunctionNode(u)){const n=b.get(toLowerCaseAZ(u.getName()));if(!n)return;const i=patchCalcResult(solve(n(u,t)),o);if(-1!==i)return void e.parent.value.splice(r,1,i)}}))}}return e}exports.calc=function calc(o,t){const r=e.tokenizer({css:o}),u=[];for(;!r.endOfFile();)u.push(r.nextToken());return u.push(r.nextToken()),calcFromComponentValues(n.parseCommaSeparatedListOfComponentValues(u,{}),t).map((n=>n.map((n=>e.stringify(...n.tokens()))).join(""))).join(",")},exports.calcFromComponentValues=calcFromComponentValues;
