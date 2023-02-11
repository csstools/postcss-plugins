"use strict";var e=require("@csstools/css-tokenizer"),n=require("@csstools/css-parser-algorithms");function isCalculation(e){return"inputs"in e&&Array.isArray(e.inputs)&&"operation"in e}function solve(e){const t=[];for(let r=0;r<e.inputs.length;r++){const o=e.inputs[r];if(n.isTokenNode(o)){t.push(o);continue}const u=solve(o);if(-1===u)return-1;t.push(u)}return e.operation(t)}function unary(n){if(1!==n.length)return-1;const t=n[0].value;return t[0]===e.TokenType.Number||t[0]===e.TokenType.Dimension||t[0]===e.TokenType.Percentage?n[0]:-1}function multiplication(t){if(2!==t.length)return-1;const r=t[0].value,o=t[1].value;if(r[0]===e.TokenType.Number&&o[0]===e.TokenType.Number){const t=r[4].value*o[4].value;return new n.TokenNode([e.TokenType.Number,t.toString(),r[2],o[3],{value:t,type:r[4].type===e.NumberType.Integer&&o[4].type===e.NumberType.Integer?e.NumberType.Integer:e.NumberType.Number}])}if(r[0]===e.TokenType.Percentage&&o[0]===e.TokenType.Number){const t=r[4].value*o[4].value;return new n.TokenNode([e.TokenType.Percentage,t.toString()+"%",r[2],o[3],{value:t}])}if(r[0]===e.TokenType.Number&&o[0]===e.TokenType.Percentage){const t=r[4].value*o[4].value;return new n.TokenNode([e.TokenType.Percentage,t.toString()+"%",r[2],o[3],{value:t}])}if(r[0]===e.TokenType.Dimension&&o[0]===e.TokenType.Number){const t=r[4].value*o[4].value;return new n.TokenNode([e.TokenType.Dimension,t.toString()+r[4].unit,r[2],o[3],{value:t,type:r[4].type===e.NumberType.Integer&&o[4].type===e.NumberType.Integer?e.NumberType.Integer:e.NumberType.Number,unit:r[4].unit}])}if(r[0]===e.TokenType.Number&&o[0]===e.TokenType.Dimension){const t=r[4].value*o[4].value;return new n.TokenNode([e.TokenType.Dimension,t.toString()+o[4].unit,r[2],o[3],{value:t,type:r[4].type===e.NumberType.Integer&&o[4].type===e.NumberType.Integer?e.NumberType.Integer:e.NumberType.Number,unit:o[4].unit}])}return-1}function division(t){if(2!==t.length)return-1;const r=t[0].value,o=t[1].value;if(r[0]===e.TokenType.Number&&o[0]===e.TokenType.Number){const t=r[4].value/o[4].value;return NaN_Token(t,r,o)??new n.TokenNode([e.TokenType.Number,t.toString(),r[2],o[3],{value:t,type:Number.isInteger(t)?e.NumberType.Integer:e.NumberType.Number}])}if(r[0]===e.TokenType.Percentage&&o[0]===e.TokenType.Number){const t=r[4].value*o[4].value;return NaN_Token(t,r,o)??new n.TokenNode([e.TokenType.Percentage,t.toString()+"%",r[2],o[3],{value:t}])}if(r[0]===e.TokenType.Dimension&&o[0]===e.TokenType.Number){const t=r[4].value/o[4].value;return NaN_Token(t,r,o)??new n.TokenNode([e.TokenType.Dimension,t.toString()+r[4].unit,r[2],o[3],{value:t,type:r[4].type===e.NumberType.Integer&&o[4].type===e.NumberType.Integer?e.NumberType.Integer:e.NumberType.Number,unit:r[4].unit}])}return-1}function NaN_Token(t,r,o){if(Number.isNaN(t))return new n.TokenNode([e.TokenType.Ident,"NaN",r[2],o[3],{value:"NaN"}])}function addition(t){if(2!==t.length)return-1;const r=t[0].value,o=t[1].value;if(r[0]===e.TokenType.Number&&o[0]===e.TokenType.Number){const t=r[4].value+o[4].value;return new n.TokenNode([e.TokenType.Number,t.toString(),r[2],o[3],{value:t,type:r[4].type===e.NumberType.Integer&&o[4].type===e.NumberType.Integer?e.NumberType.Integer:e.NumberType.Number}])}if(r[0]===e.TokenType.Percentage&&o[0]===e.TokenType.Percentage){const t=r[4].value+o[4].value;return new n.TokenNode([e.TokenType.Percentage,t.toString()+"%",r[2],o[3],{value:t}])}if(r[0]===e.TokenType.Dimension&&o[0]===e.TokenType.Dimension&&r[4].unit===o[4].unit){const t=r[4].value+o[4].value;return new n.TokenNode([e.TokenType.Dimension,t.toString()+r[4].unit,r[2],o[3],{value:t,type:r[4].type===e.NumberType.Integer&&o[4].type===e.NumberType.Integer?e.NumberType.Integer:e.NumberType.Number,unit:r[4].unit}])}return-1}function subtraction(t){if(2!==t.length)return-1;const r=t[0].value,o=t[1].value;if(r[0]===e.TokenType.Number&&o[0]===e.TokenType.Number){const t=r[4].value-o[4].value;return new n.TokenNode([e.TokenType.Number,t.toString(),r[2],o[3],{value:t,type:r[4].type===e.NumberType.Integer&&o[4].type===e.NumberType.Integer?e.NumberType.Integer:e.NumberType.Number}])}if(r[0]===e.TokenType.Percentage&&o[0]===e.TokenType.Percentage){const t=r[4].value-o[4].value;return new n.TokenNode([e.TokenType.Percentage,t.toString()+"%",r[2],o[3],{value:t}])}if(r[0]===e.TokenType.Dimension&&o[0]===e.TokenType.Dimension&&r[4].unit===o[4].unit){const t=r[4].value-o[4].value;return new n.TokenNode([e.TokenType.Dimension,t.toString()+r[4].unit,r[2],o[3],{value:t,type:r[4].type===e.NumberType.Integer&&o[4].type===e.NumberType.Integer?e.NumberType.Integer:e.NumberType.Number,unit:r[4].unit}])}return-1}function calcHandler(t,r){const o=[...t.value.filter((e=>!n.isCommentNode(e)&&!n.isWhitespaceNode(e)))];for(let t=0;t<o.length;t++){const u=o[t];if(!n.isTokenNode(u))continue;const i=u.value;if(i[0]!==e.TokenType.Ident)continue;const T=i[4].value.toLowerCase();switch(T){case"e":o.splice(t,1,new n.TokenNode([e.TokenType.Number,Math.E.toString(),i[2],i[3],{value:Math.E,type:e.NumberType.Number}]));break;case"pi":o.splice(t,1,new n.TokenNode([e.TokenType.Number,Math.PI.toString(),i[2],i[3],{value:Math.PI,type:e.NumberType.Number}]));break;default:if(r.has(T)){const u=r.get(T);o.splice(t,1,new n.TokenNode([e.TokenType.Number,u.toString(),i[2],i[3],{value:u,type:e.NumberType.Number}]))}}}if(1===o.length&&n.isTokenNode(o[0]))return{inputs:[o[0]],operation:unary};for(let t=0;t<o.length;t++){const u=o[t];if(n.isSimpleBlockNode(u)&&u.startToken[0]===e.TokenType.OpenParen){const e=calcHandler(u,r);if(-1===e)return-1;o.splice(t,1,e)}else if(n.isFunctionNode(u))switch(u.getName().toLowerCase()){case"calc":{const e=calcHandler(u,r);if(-1===e)return-1;o.splice(t,1,e);break}default:return-1}else;}if(1===o.length&&isCalculation(o[0]))return o[0];for(let t=0;t<o.length;t++){const r=o[t];if(!r||!n.isTokenNode(r)&&!isCalculation(r))return-1;const u=o[t+1];if(!u)break;if(!n.isTokenNode(u))return-1;const i=o[t+2];if(!i||!n.isTokenNode(i)&&!isCalculation(i))return-1;const T=u.value;T[0]!==e.TokenType.Delim||"*"!==T[4].value?T[0]!==e.TokenType.Delim||"/"!==T[4].value||(o.splice(t,3,{inputs:[r,i],operation:division}),t--):(o.splice(t,3,{inputs:[r,i],operation:multiplication}),t--)}if(1===o.length&&isCalculation(o[0]))return o[0];for(let t=0;t<o.length;t++){const r=o[t];if(!r||!n.isTokenNode(r)&&!isCalculation(r))return-1;const u=o[t+1];if(!u)break;if(!n.isTokenNode(u))return-1;const i=o[t+2];if(!i||!n.isTokenNode(i)&&!isCalculation(i))return-1;const T=u.value;T[0]!==e.TokenType.Delim||"+"!==T[4].value?T[0]!==e.TokenType.Delim||"-"!==T[4].value||(o.splice(t,3,{inputs:[r,i],operation:subtraction}),t--):(o.splice(t,3,{inputs:[r,i],operation:addition}),t--)}return 1===o.length&&isCalculation(o[0])?o[0]:-1}exports.convert=function convert(t,r){const o=e.tokenizer({css:t}),u=[];for(;!o.endOfFile();)u.push(o.nextToken());u.push(o.nextToken());const i=n.parseComponentValue(u,{onParseError:e=>{throw e}});if("walk"in i){if(n.isFunctionNode(i)&&"calc"===i.getName().toLowerCase()){const e=calcHandler(i,r??new Map);if(-1===e)return t;const n=solve(e);return-1===n?t:n.toString()}return i.walk(((e,t)=>{if("number"!=typeof t)return;const o=e.node;if(!n.isFunctionNode(o)||"calc"!==o.getName().toLowerCase())return;const u=calcHandler(o,r??new Map);if(-1===u)return;const i=solve(u);-1!==i&&e.parent.value.splice(t,1,i)})),i.toString()}};
