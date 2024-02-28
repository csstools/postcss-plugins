import{TokenNode as e,isTokenNode as n,isCommentNode as t,isWhitespaceNode as r,isSimpleBlockNode as u,isFunctionNode as i,FunctionNode as a,WhitespaceNode as o,parseCommaSeparatedListOfComponentValues as l,replaceComponentValues as c}from"@csstools/css-parser-algorithms";import{TokenType as s,NumberType as v,isToken as m,tokenizer as f,tokenize as p,stringify as N}from"@csstools/css-tokenizer";const g=/[A-Z]/g;function toLowerCaseAZ(e){return e.replace(g,(e=>String.fromCharCode(e.charCodeAt(0)+32)))}const b={cm:"px",in:"px",mm:"px",pc:"px",pt:"px",px:"px",q:"px",deg:"deg",grad:"deg",rad:"deg",turn:"deg",ms:"s",s:"s",hz:"hz",khz:"hz"},d=new Map([["cm",e=>e],["mm",e=>10*e],["q",e=>40*e],["in",e=>e/2.54],["pc",e=>e/2.54*6],["pt",e=>e/2.54*72],["px",e=>e/2.54*96]]),w=new Map([["deg",e=>e],["grad",e=>e/.9],["rad",e=>e/180*Math.PI],["turn",e=>e/360]]),h=new Map([["deg",e=>.9*e],["grad",e=>e],["rad",e=>.9*e/180*Math.PI],["turn",e=>.9*e/360]]),C=new Map([["hz",e=>e],["khz",e=>e/1e3]]),I=new Map([["cm",e=>2.54*e],["mm",e=>25.4*e],["q",e=>25.4*e*4],["in",e=>e],["pc",e=>6*e],["pt",e=>72*e],["px",e=>96*e]]),S=new Map([["hz",e=>1e3*e],["khz",e=>e]]),y=new Map([["cm",e=>e/10],["mm",e=>e],["q",e=>4*e],["in",e=>e/25.4],["pc",e=>e/25.4*6],["pt",e=>e/25.4*72],["px",e=>e/25.4*96]]),M=new Map([["ms",e=>e],["s",e=>e/1e3]]),P=new Map([["cm",e=>e/6*2.54],["mm",e=>e/6*25.4],["q",e=>e/6*25.4*4],["in",e=>e/6],["pc",e=>e],["pt",e=>e/6*72],["px",e=>e/6*96]]),D=new Map([["cm",e=>e/72*2.54],["mm",e=>e/72*25.4],["q",e=>e/72*25.4*4],["in",e=>e/72],["pc",e=>e/72*6],["pt",e=>e],["px",e=>e/72*96]]),T=new Map([["cm",e=>e/96*2.54],["mm",e=>e/96*25.4],["q",e=>e/96*25.4*4],["in",e=>e/96],["pc",e=>e/96*6],["pt",e=>e/96*72],["px",e=>e]]),A=new Map([["cm",e=>e/4/10],["mm",e=>e/4],["q",e=>e],["in",e=>e/4/25.4],["pc",e=>e/4/25.4*6],["pt",e=>e/4/25.4*72],["px",e=>e/4/25.4*96]]),k=new Map([["deg",e=>180*e/Math.PI],["grad",e=>180*e/Math.PI/.9],["rad",e=>e],["turn",e=>180*e/Math.PI/360]]),F=new Map([["ms",e=>1e3*e],["s",e=>e]]),x=new Map([["deg",e=>360*e],["grad",e=>360*e/.9],["rad",e=>360*e/180*Math.PI],["turn",e=>e]]),O=new Map([["cm",d],["mm",y],["q",A],["in",I],["pc",P],["pt",D],["px",T],["ms",M],["s",F],["deg",w],["grad",h],["rad",k],["turn",x],["hz",C],["khz",S]]);function convertUnit(e,n){if(e[0]!==s.Dimension)return n;if(n[0]!==s.Dimension)return n;const t=toLowerCaseAZ(e[4].unit),r=toLowerCaseAZ(n[4].unit);if(t===r)return n;const u=O.get(r);if(!u)return n;const i=u.get(t);if(!i)return n;const a=i(n[4].value);return[s.Dimension,a.toString()+e[4].unit,n[2],n[3],{value:a,unit:e[4].unit,type:Number.isInteger(a)?v.Integer:v.Number}]}function toCanonicalUnit(e){if(e[0]!==s.Dimension)return e;const n=toLowerCaseAZ(e[4].unit),t=b[n];if(n===t)return e;const r=O.get(n);if(!r)return e;const u=r.get(t);if(!u)return e;const i=u(e[4].value);return[s.Dimension,i.toString()+t,e[2],e[3],{value:i,unit:t,type:Number.isInteger(i)?v.Integer:v.Number}]}function addition(n){if(2!==n.length)return-1;const t=n[0].value;let r=n[1].value;if(t[0]===s.Number&&r[0]===s.Number){const n=t[4].value+r[4].value;return new e([s.Number,n.toString(),t[2],r[3],{value:n,type:t[4].type===v.Integer&&r[4].type===v.Integer?v.Integer:v.Number}])}if(t[0]===s.Percentage&&r[0]===s.Percentage){const n=t[4].value+r[4].value;return new e([s.Percentage,n.toString()+"%",t[2],r[3],{value:n}])}if(t[0]===s.Dimension&&r[0]===s.Dimension&&(r=convertUnit(t,r),toLowerCaseAZ(t[4].unit)===toLowerCaseAZ(r[4].unit))){const n=t[4].value+r[4].value;return new e([s.Dimension,n.toString()+t[4].unit,t[2],r[3],{value:n,type:t[4].type===v.Integer&&r[4].type===v.Integer?v.Integer:v.Number,unit:t[4].unit}])}return-1}function division(n){if(2!==n.length)return-1;const t=n[0].value,r=n[1].value;if(t[0]===s.Number&&r[0]===s.Number){const n=t[4].value/r[4].value;return new e([s.Number,n.toString(),t[2],r[3],{value:n,type:Number.isInteger(n)?v.Integer:v.Number}])}if(t[0]===s.Percentage&&r[0]===s.Number){const n=t[4].value/r[4].value;return new e([s.Percentage,n.toString()+"%",t[2],r[3],{value:n}])}if(t[0]===s.Dimension&&r[0]===s.Number){const n=t[4].value/r[4].value;return new e([s.Dimension,n.toString()+t[4].unit,t[2],r[3],{value:n,type:Number.isInteger(n)?v.Integer:v.Number,unit:t[4].unit}])}return-1}function isCalculation(e){return!!e&&"object"==typeof e&&"inputs"in e&&Array.isArray(e.inputs)&&"operation"in e}function solve(e){if(-1===e)return-1;const t=[];for(let r=0;r<e.inputs.length;r++){const u=e.inputs[r];if(n(u)){t.push(u);continue}const i=solve(u);if(-1===i)return-1;t.push(i)}return e.operation(t)}function multiplication(n){if(2!==n.length)return-1;const t=n[0].value,r=n[1].value;if(t[0]===s.Number&&r[0]===s.Number){const n=t[4].value*r[4].value;return new e([s.Number,n.toString(),t[2],r[3],{value:n,type:t[4].type===v.Integer&&r[4].type===v.Integer?v.Integer:v.Number}])}if(t[0]===s.Percentage&&r[0]===s.Number){const n=t[4].value*r[4].value;return new e([s.Percentage,n.toString()+"%",t[2],r[3],{value:n}])}if(t[0]===s.Number&&r[0]===s.Percentage){const n=t[4].value*r[4].value;return new e([s.Percentage,n.toString()+"%",t[2],r[3],{value:n}])}if(t[0]===s.Dimension&&r[0]===s.Number){const n=t[4].value*r[4].value;return new e([s.Dimension,n.toString()+t[4].unit,t[2],r[3],{value:n,type:t[4].type===v.Integer&&r[4].type===v.Integer?v.Integer:v.Number,unit:t[4].unit}])}if(t[0]===s.Number&&r[0]===s.Dimension){const n=t[4].value*r[4].value;return new e([s.Dimension,n.toString()+r[4].unit,t[2],r[3],{value:n,type:t[4].type===v.Integer&&r[4].type===v.Integer?v.Integer:v.Number,unit:r[4].unit}])}return-1}function resolveGlobalsAndConstants(t,r){for(let u=0;u<t.length;u++){const i=t[u];if(!n(i))continue;const a=i.value;if(a[0]!==s.Ident)continue;const o=toLowerCaseAZ(a[4].value);switch(o){case"e":t.splice(u,1,new e([s.Number,Math.E.toString(),a[2],a[3],{value:Math.E,type:v.Number}]));break;case"pi":t.splice(u,1,new e([s.Number,Math.PI.toString(),a[2],a[3],{value:Math.PI,type:v.Number}]));break;case"infinity":t.splice(u,1,new e([s.Number,"infinity",a[2],a[3],{value:1/0,type:v.Number}]));break;case"-infinity":t.splice(u,1,new e([s.Number,"-infinity",a[2],a[3],{value:-1/0,type:v.Number}]));break;case"nan":t.splice(u,1,new e([s.Number,"NaN",a[2],a[3],{value:Number.NaN,type:v.Number}]));break;default:if(r.has(o)){const n=r.get(o);t.splice(u,1,new e(n))}}}return t}function isNumeric(e){return e[0]===s.Dimension||(e[0]===s.Percentage||e[0]===s.Number)}function isDimensionOrNumber(e){return e[0]===s.Dimension||e[0]===s.Number}function arrayOfSameNumeric(e){if(0===e.length)return!0;const n=e[0];if(!isNumeric(n))return!1;if(1===e.length)return!0;if(n[0]===s.Dimension){const t=toLowerCaseAZ(n[4].unit);for(let r=1;r<e.length;r++){const u=e[r];if(n[0]!==u[0])return!1;if(t!==toLowerCaseAZ(u[4].unit))return!1}return!0}for(let t=1;t<e.length;t++){const r=e[t];if(n[0]!==r[0])return!1}return!0}function twoOfSameNumeric(e,n){return!!isNumeric(e)&&(e[0]===s.Dimension?e[0]===n[0]&&toLowerCaseAZ(e[4].unit)===toLowerCaseAZ(n[4].unit):e[0]===n[0])}function unary(e){if(1!==e.length)return-1;return isNumeric(e[0].value)?e[0]:-1}function resultToCalculation(e,n,t){return n[0]===s.Dimension?dimensionToCalculation(e,n[4].unit,t):n[0]===s.Percentage?percentageToCalculation(e,t):n[0]===s.Number?numberToCalculation(e,t):-1}function dimensionToCalculation(n,t,r){const u=n.tokens();return{inputs:[new e([s.Dimension,r.toString()+t,u[0][2],u[u.length-1][3],{value:r,type:Number.isInteger(r)?v.Integer:v.Number,unit:t}])],operation:unary}}function percentageToCalculation(n,t){const r=n.tokens();return{inputs:[new e([s.Percentage,t.toString()+"%",r[0][2],r[r.length-1][3],{value:t}])],operation:unary}}function numberToCalculation(n,t){const r=n.tokens();return{inputs:[new e([s.Number,t.toString(),r[0][2],r[r.length-1][3],{value:t,type:Number.isInteger(t)?v.Integer:v.Number}])],operation:unary}}function solveACos(e,n){const t=n.value;if(t[0]!==s.Number)return-1;return dimensionToCalculation(e,"rad",Math.acos(t[4].value))}function solveASin(e,n){const t=n.value;if(t[0]!==s.Number)return-1;return dimensionToCalculation(e,"rad",Math.asin(t[4].value))}function solveATan(e,n){const t=n.value;if(t[0]!==s.Number)return-1;return dimensionToCalculation(e,"rad",Math.atan(t[4].value))}function solveATan2(e,n,t){const r=n.value;if(!isDimensionOrNumber(r))return-1;const u=convertUnit(r,t.value);if(!twoOfSameNumeric(r,u))return-1;return dimensionToCalculation(e,"rad",Math.atan2(r[4].value,u[4].value))}function solveAbs(e,n){const t=n.value;if(!isDimensionOrNumber(t))return-1;return resultToCalculation(e,t,Math.abs(t[4].value))}function solveClamp(e,t,r,u){if(!n(t)||!n(r)||!n(u))return-1;const i=t.value;if(!isNumeric(i))return-1;const a=convertUnit(i,r.value);if(!twoOfSameNumeric(i,a))return-1;const o=convertUnit(i,u.value);if(!twoOfSameNumeric(i,o))return-1;return resultToCalculation(e,i,Math.max(i[4].value,Math.min(a[4].value,o[4].value)))}function solveCos(e,n){const t=n.value;if(!isDimensionOrNumber(t))return-1;let r=t[4].value;if(t[0]===s.Dimension)switch(toLowerCaseAZ(t[4].unit)){case"rad":break;case"deg":r=w.get("rad")(t[4].value);break;case"grad":r=h.get("rad")(t[4].value);break;case"turn":r=x.get("rad")(t[4].value);break;default:return-1}return r=Math.cos(r),numberToCalculation(e,r)}function solveExp(e,n){const t=n.value;if(t[0]!==s.Number)return-1;return numberToCalculation(e,Math.exp(t[4].value))}function solveHypot(e,t){const r=t[0];if(!r||!n(r))return-1;if(1!==new Set(t.map((e=>e.type))).size)return-1;const u=r.value;if(!isNumeric(u))return-1;const i=t.map((e=>convertUnit(u,e.value)));if(!arrayOfSameNumeric(i))return-1;const a=i.map((e=>e[4].value)),o=Math.hypot(...a);return resultToCalculation(e,u,o)}function solveMax(e,t){const r=t[0];if(!r||!n(r))return-1;if(1!==new Set(t.map((e=>e.type))).size)return-1;const u=r.value;if(!isNumeric(u))return-1;const i=t.map((e=>convertUnit(u,e.value)));if(!arrayOfSameNumeric(i))return-1;const a=i.map((e=>e[4].value)),o=Math.max(...a);return resultToCalculation(e,u,o)}function solveMin(e,t){const r=t[0];if(!r||!n(r))return-1;if(1!==new Set(t.map((e=>e.type))).size)return-1;const u=r.value;if(!isNumeric(u))return-1;const i=t.map((e=>convertUnit(u,e.value)));if(!arrayOfSameNumeric(i))return-1;const a=i.map((e=>e[4].value)),o=Math.min(...a);return resultToCalculation(e,u,o)}function solveMod(e,n,t){const r=n.value;if(!isNumeric(r))return-1;const u=convertUnit(r,t.value);if(!twoOfSameNumeric(r,u))return-1;let i;return i=0===u[4].value?Number.NaN:Number.isFinite(r[4].value)&&(Number.isFinite(u[4].value)||(u[4].value!==Number.POSITIVE_INFINITY||r[4].value!==Number.NEGATIVE_INFINITY&&!Object.is(0*r[4].value,-0))&&(u[4].value!==Number.NEGATIVE_INFINITY||r[4].value!==Number.POSITIVE_INFINITY&&!Object.is(0*r[4].value,0)))?Number.isFinite(u[4].value)?(r[4].value%u[4].value+u[4].value)%u[4].value:r[4].value:Number.NaN,resultToCalculation(e,r,i)}function solvePow(e,n,t){const r=n.value,u=t.value;if(r[0]!==s.Number)return-1;if(!twoOfSameNumeric(r,u))return-1;return numberToCalculation(e,Math.pow(r[4].value,u[4].value))}function solveRem(e,n,t){const r=n.value;if(!isNumeric(r))return-1;const u=convertUnit(r,t.value);if(!twoOfSameNumeric(r,u))return-1;let i;return i=0===u[4].value?Number.NaN:Number.isFinite(r[4].value)?Number.isFinite(u[4].value)?r[4].value%u[4].value:r[4].value:Number.NaN,resultToCalculation(e,r,i)}function solveRound(e,n,t,r){const u=t.value;if(!isNumeric(u))return-1;const i=convertUnit(u,r.value);if(!twoOfSameNumeric(u,i))return-1;let a;if(0===i[4].value)a=Number.NaN;else if(Number.isFinite(u[4].value)||Number.isFinite(i[4].value))if(!Number.isFinite(u[4].value)&&Number.isFinite(i[4].value))a=u[4].value;else if(Number.isFinite(u[4].value)&&!Number.isFinite(i[4].value))switch(n){case"down":a=u[4].value<0?-1/0:Object.is(-0,0*u[4].value)?-0:0;break;case"up":a=u[4].value>0?1/0:Object.is(0,0*u[4].value)?0:-0;break;default:a=Object.is(0,0*u[4].value)?0:-0}else if(Number.isFinite(i[4].value))switch(n){case"down":a=Math.floor(u[4].value/i[4].value)*i[4].value;break;case"up":a=Math.ceil(u[4].value/i[4].value)*i[4].value;break;case"to-zero":a=Math.trunc(u[4].value/i[4].value)*i[4].value;break;default:{let e=Math.floor(u[4].value/i[4].value)*i[4].value,n=Math.ceil(u[4].value/i[4].value)*i[4].value;if(e>n){const t=e;e=n,n=t}const t=Math.abs(u[4].value-e),r=Math.abs(u[4].value-n);a=t===r?n:t<r?e:n;break}}else a=u[4].value;else a=Number.NaN;return resultToCalculation(e,u,a)}function solveSign(e,n){const t=n.value;if(!isDimensionOrNumber(t))return-1;return numberToCalculation(e,Math.sign(t[4].value))}function solveSin(e,n){const t=n.value;if(!isDimensionOrNumber(t))return-1;let r=t[4].value;if(t[0]===s.Dimension)switch(toLowerCaseAZ(t[4].unit)){case"rad":break;case"deg":r=w.get("rad")(t[4].value);break;case"grad":r=h.get("rad")(t[4].value);break;case"turn":r=x.get("rad")(t[4].value);break;default:return-1}return r=Math.sin(r),numberToCalculation(e,r)}function solveSqrt(e,n){const t=n.value;if(t[0]!==s.Number)return-1;return numberToCalculation(e,Math.sqrt(t[4].value))}function solveTan(e,n){const t=n.value;if(!isDimensionOrNumber(t))return-1;const r=t[4].value;let u=0,i=t[4].value;if(t[0]===s.Dimension)switch(toLowerCaseAZ(t[4].unit)){case"rad":u=k.get("deg")(r);break;case"deg":u=r,i=w.get("rad")(r);break;case"grad":u=h.get("deg")(r),i=h.get("rad")(r);break;case"turn":u=x.get("deg")(r),i=x.get("rad")(r);break;default:return-1}const a=u/90;return i=u%90==0&&a%2!=0?a>0?1/0:-1/0:Math.tan(i),numberToCalculation(e,i)}function subtraction(n){if(2!==n.length)return-1;const t=n[0].value;let r=n[1].value;if(t[0]===s.Number&&r[0]===s.Number){const n=t[4].value-r[4].value;return new e([s.Number,n.toString(),t[2],r[3],{value:n,type:t[4].type===v.Integer&&r[4].type===v.Integer?v.Integer:v.Number}])}if(t[0]===s.Percentage&&r[0]===s.Percentage){const n=t[4].value-r[4].value;return new e([s.Percentage,n.toString()+"%",t[2],r[3],{value:n}])}if(t[0]===s.Dimension&&r[0]===s.Dimension&&(r=convertUnit(t,r),toLowerCaseAZ(t[4].unit)===toLowerCaseAZ(r[4].unit))){const n=t[4].value-r[4].value;return new e([s.Dimension,n.toString()+t[4].unit,t[2],r[3],{value:n,type:t[4].type===v.Integer&&r[4].type===v.Integer?v.Integer:v.Number,unit:t[4].unit}])}return-1}function solveLog(e,t){if(1===t.length){const r=t[0];if(!r||!n(r))return-1;const u=r.value;if(u[0]!==s.Number)return-1;return numberToCalculation(e,Math.log(u[4].value))}if(2===t.length){const r=t[0];if(!r||!n(r))return-1;const u=r.value;if(u[0]!==s.Number)return-1;const i=t[1];if(!i||!n(i))return-1;const a=i.value;if(a[0]!==s.Number)return-1;return numberToCalculation(e,Math.log(u[4].value)/Math.log(a[4].value))}return-1}const Z=new Map([["abs",function abs(e,n){return singleNodeSolver(e,n,solveAbs)}],["acos",function acos(e,n){return singleNodeSolver(e,n,solveACos)}],["asin",function asin(e,n){return singleNodeSolver(e,n,solveASin)}],["atan",function atan(e,n){return singleNodeSolver(e,n,solveATan)}],["atan2",function atan2(e,n){return twoCommaSeparatedNodesSolver(e,n,solveATan2)}],["calc",calc$1],["clamp",function clamp(e,u){const i=resolveGlobalsAndConstants([...e.value.filter((e=>!t(e)&&!r(e)))],u),o=[],l=[],c=[];{let e=o;for(let t=0;t<i.length;t++){const r=i[t];if(n(r)&&r.value[0]===s.Comma){if(e===c)return-1;if(e===l){e=c;continue}if(e===o){e=l;continue}return-1}e.push(r)}}const v=solve(calc$1(new a([s.Function,"calc(",-1,-1,{value:"calc"}],[s.CloseParen,")",-1,-1,void 0],o),u));if(-1===v)return-1;const m=solve(calc$1(new a([s.Function,"calc(",-1,-1,{value:"calc"}],[s.CloseParen,")",-1,-1,void 0],l),u));if(-1===m)return-1;const f=solve(calc$1(new a([s.Function,"calc(",-1,-1,{value:"calc"}],[s.CloseParen,")",-1,-1,void 0],c),u));if(-1===f)return-1;return solveClamp(e,v,m,f)}],["cos",function cos(e,n){return singleNodeSolver(e,n,solveCos)}],["exp",function exp(e,n){return singleNodeSolver(e,n,solveExp)}],["hypot",function hypot(e,n){return variadicNodesSolver(e,n,solveHypot)}],["log",function log(e,n){return variadicNodesSolver(e,n,solveLog)}],["max",function max(e,n){return variadicNodesSolver(e,n,solveMax)}],["min",function min(e,n){return variadicNodesSolver(e,n,solveMin)}],["mod",function mod(e,n){return twoCommaSeparatedNodesSolver(e,n,solveMod)}],["pow",function pow(e,n){return twoCommaSeparatedNodesSolver(e,n,solvePow)}],["rem",function rem(e,n){return twoCommaSeparatedNodesSolver(e,n,solveRem)}],["round",function round(u,i){const o=resolveGlobalsAndConstants([...u.value.filter((e=>!t(e)&&!r(e)))],i);let l="",c=!1;const m=[],f=[];{let e=m;for(let t=0;t<o.length;t++){const r=o[t];if(!l&&0===m.length&&0===f.length&&n(r)&&r.value[0]===s.Ident){const e=toLowerCaseAZ(r.value[4].value);if(L.has(e)){l=e;continue}}if(n(r)&&r.value[0]===s.Comma){if(e===f)return-1;if(e===m&&l&&0===m.length)continue;if(e===m){c=!0,e=f;continue}return-1}e.push(r)}}const p=solve(calc$1(new a([s.Function,"calc(",-1,-1,{value:"calc"}],[s.CloseParen,")",-1,-1,void 0],m),i));if(-1===p)return-1;c||0!==f.length||f.push(new e([s.Number,"1",-1,-1,{value:1,type:v.Integer}]));const N=solve(calc$1(new a([s.Function,"calc(",-1,-1,{value:"calc"}],[s.CloseParen,")",-1,-1,void 0],f),i));if(-1===N)return-1;l||(l="nearest");return solveRound(u,l,p,N)}],["sign",function sign(e,n){return singleNodeSolver(e,n,solveSign)}],["sin",function sin(e,n){return singleNodeSolver(e,n,solveSin)}],["sqrt",function sqrt(e,n){return singleNodeSolver(e,n,solveSqrt)}],["tan",function tan(e,n){return singleNodeSolver(e,n,solveTan)}]]);function calc$1(e,a){const o=resolveGlobalsAndConstants([...e.value.filter((e=>!t(e)&&!r(e)))],a);if(1===o.length&&n(o[0]))return{inputs:[o[0]],operation:unary};let l=0;for(;l<o.length;){const e=o[l];if(u(e)&&e.startToken[0]===s.OpenParen){const n=calc$1(e,a);if(-1===n)return-1;o.splice(l,1,n)}else if(i(e)){const n=Z.get(toLowerCaseAZ(e.getName()));if(!n)return-1;const t=n(e,a);if(-1===t)return-1;o.splice(l,1,t)}else l++}if(l=0,1===o.length&&isCalculation(o[0]))return o[0];for(;l<o.length;){const e=o[l];if(!e||!n(e)&&!isCalculation(e)){l++;continue}const t=o[l+1];if(!t||!n(t)){l++;continue}const r=t.value;if(r[0]!==s.Delim||"*"!==r[4].value&&"/"!==r[4].value){l++;continue}const u=o[l+2];if(!u||!n(u)&&!isCalculation(u))return-1;"*"!==r[4].value?"/"!==r[4].value?l++:o.splice(l,3,{inputs:[e,u],operation:division}):o.splice(l,3,{inputs:[e,u],operation:multiplication})}if(l=0,1===o.length&&isCalculation(o[0]))return o[0];for(;l<o.length;){const e=o[l];if(!e||!n(e)&&!isCalculation(e)){l++;continue}const t=o[l+1];if(!t||!n(t)){l++;continue}const r=t.value;if(r[0]!==s.Delim||"+"!==r[4].value&&"-"!==r[4].value){l++;continue}const u=o[l+2];if(!u||!n(u)&&!isCalculation(u))return-1;"+"!==r[4].value?"-"!==r[4].value?l++:o.splice(l,3,{inputs:[e,u],operation:subtraction}):o.splice(l,3,{inputs:[e,u],operation:addition})}return 1===o.length&&isCalculation(o[0])?o[0]:-1}function singleNodeSolver(e,n,u){const i=resolveGlobalsAndConstants([...e.value.filter((e=>!t(e)&&!r(e)))],n),o=solve(calc$1(new a([s.Function,"calc(",-1,-1,{value:"calc"}],[s.CloseParen,")",-1,-1,void 0],i),n));return-1===o?-1:u(e,o)}function twoCommaSeparatedNodesSolver(e,u,i){const o=resolveGlobalsAndConstants([...e.value.filter((e=>!t(e)&&!r(e)))],u),l=[],c=[];{let e=l;for(let t=0;t<o.length;t++){const r=o[t];if(n(r)&&r.value[0]===s.Comma){if(e===c)return-1;if(e===l){e=c;continue}return-1}e.push(r)}}const v=solve(calc$1(new a([s.Function,"calc(",-1,-1,{value:"calc"}],[s.CloseParen,")",-1,-1,void 0],l),u));if(-1===v)return-1;const m=solve(calc$1(new a([s.Function,"calc(",-1,-1,{value:"calc"}],[s.CloseParen,")",-1,-1,void 0],c),u));return-1===m?-1:i(e,v,m)}function variadicNodesSolver(e,u,i){const o=resolveGlobalsAndConstants([...e.value.filter((e=>!t(e)&&!r(e)))],u),l=[];{const e=[];let t=[];for(let r=0;r<o.length;r++){const u=o[r];n(u)&&u.value[0]===s.Comma?(e.push(t),t=[]):t.push(u)}e.push(t);for(let n=0;n<e.length;n++){if(0===e[n].length)return-1;const t=solve(calc$1(new a([s.Function,"calc(",-1,-1,{value:"calc"}],[s.CloseParen,")",-1,-1,void 0],e[n]),u));if(-1===t)return-1;l.push(t)}}return i(e,l)}const L=new Set(["nearest","up","down","to-zero"]);function patchNaN(n){if(-1===n)return-1;if(i(n))return n;const t=n.value;return t[0]!==s.Number&&t[0]!==s.Percentage&&t[0]!==s.Dimension?n:Number.isNaN(t[4].value)?t[0]===s.Number?new a([s.Function,"calc(",t[2],t[3],{value:"calc"}],[s.CloseParen,")",t[2],t[3],void 0],[new e([s.Ident,"NaN",t[2],t[3],{value:"NaN"}])]):t[0]===s.Dimension?new a([s.Function,"calc(",t[2],t[3],{value:"calc"}],[s.CloseParen,")",t[2],t[3],void 0],[new e([s.Ident,"NaN",t[2],t[3],{value:"NaN"}]),new o([[s.Whitespace," ",t[2],t[3],void 0]]),new e([s.Delim,"*",t[2],t[3],{value:"*"}]),new o([[s.Whitespace," ",t[2],t[3],void 0]]),new e([s.Dimension,"1"+t[4].unit,t[2],t[3],{value:1,type:v.Integer,unit:t[4].unit}])]):t[0]===s.Percentage?new a([s.Function,"calc(",t[2],t[3],{value:"calc"}],[s.CloseParen,")",t[2],t[3],void 0],[new e([s.Ident,"NaN",t[2],t[3],{value:"NaN"}]),new o([[s.Whitespace," ",t[2],t[3],void 0]]),new e([s.Delim,"*",t[2],t[3],{value:"*"}]),new o([[s.Whitespace," ",t[2],t[3],void 0]]),new e([s.Percentage,"1%",t[2],t[3],{value:1}])]):-1:n}function patchInfinity(n){if(-1===n)return-1;if(i(n))return n;const t=n.value;if(t[0]!==s.Number&&t[0]!==s.Percentage&&t[0]!==s.Dimension)return n;if(Number.isFinite(t[4].value))return n;let r="";return Number.NEGATIVE_INFINITY===t[4].value&&(r="-"),t[0]===s.Number?new a([s.Function,"calc(",t[2],t[3],{value:"calc"}],[s.CloseParen,")",t[2],t[3],void 0],[new e([s.Ident,r+"infinity",t[2],t[3],{value:r+"infinity"}])]):t[0]===s.Dimension?new a([s.Function,"calc(",t[2],t[3],{value:"calc"}],[s.CloseParen,")",t[2],t[3],void 0],[new e([s.Ident,r+"infinity",t[2],t[3],{value:r+"infinity"}]),new o([[s.Whitespace," ",t[2],t[3],void 0]]),new e([s.Delim,"*",t[2],t[3],{value:"*"}]),new o([[s.Whitespace," ",t[2],t[3],void 0]]),new e([s.Dimension,"1"+t[4].unit,t[2],t[3],{value:1,type:v.Integer,unit:t[4].unit}])]):t[0]===s.Percentage?new a([s.Function,"calc(",t[2],t[3],{value:"calc"}],[s.CloseParen,")",t[2],t[3],void 0],[new e([s.Ident,r+"infinity",t[2],t[3],{value:r+"infinity"}]),new o([[s.Whitespace," ",t[2],t[3],void 0]]),new e([s.Delim,"*",t[2],t[3],{value:"*"}]),new o([[s.Whitespace," ",t[2],t[3],void 0]]),new e([s.Percentage,"1%",t[2],t[3],{value:1}])]):-1}function patchMinusZero(e){if(-1===e)return-1;if(i(e))return e;const n=e.value;return n[0]!==s.Number&&n[0]!==s.Percentage&&n[0]!==s.Dimension?e:Object.is(-0,n[4].value)?("-0"===n[1]||(n[0]===s.Percentage?n[1]="-0%":n[0]===s.Dimension?n[1]="-0"+n[4].unit:n[1]="-0"),e):e}function patchPrecision(e,n=13){if(-1===e)return-1;if(i(e))return e;const t=e.value;if(t[0]!==s.Number&&t[0]!==s.Percentage&&t[0]!==s.Dimension)return e;if(Number.isInteger(t[4].value))return e;const r=Number(t[4].value.toFixed(n)).toString();return t[0]===s.Number?t[1]=r:t[0]===s.Percentage?t[1]=r+"%":t[0]===s.Dimension&&(t[1]=r+t[4].unit),e}function patchCanonicalUnit(e){return-1===e?-1:(i(e)||e.value[0]!==s.Dimension||(e.value=toCanonicalUnit(e.value)),e)}function patchCalcResult(e,n){let t;return t=patchNaN(e),t=patchInfinity(t),n?.toCanonicalUnits&&(t=patchCanonicalUnit(t)),t=patchPrecision(t,n?.precision),t=patchMinusZero(t),t}function tokenizeGlobals(e){const n=new Map;if(!e)return n;for(const[t,r]of e)if(m(r))n.set(t,r);else if("string"!=typeof r);else{const e=f({css:r}),u=e.nextToken();if(e.nextToken(),!e.endOfFile())continue;if(!u)continue;if(u[0]!==s.Number&&u[0]!==s.Dimension&&u[0]!==s.Percentage)continue;n.set(t,u)}return n}function calc(e,n){return calcFromComponentValues(l(p({css:e}),{}),n).map((e=>e.map((e=>N(...e.tokens()))).join(""))).join(",")}function calcFromComponentValues(e,n){const t=tokenizeGlobals(n?.globals);return c(e,(e=>{if(!i(e))return;const r=Z.get(toLowerCaseAZ(e.getName()));if(!r)return;const u=patchCalcResult(solve(r(e,t)),n);return-1!==u?u:void 0}))}const z=new Set(Z.keys());export{calc,calcFromComponentValues,z as mathFunctionNames};
