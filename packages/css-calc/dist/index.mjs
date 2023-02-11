import{TokenType as e,NumberType as n,tokenizer as t}from"@csstools/css-tokenizer";import{isTokenNode as r,TokenNode as u,parseComponentValue as i,isFunctionNode as a,isCommentNode as o,isWhitespaceNode as l,isSimpleBlockNode as s}from"@csstools/css-parser-algorithms";function isCalculation(e){return"inputs"in e&&Array.isArray(e.inputs)&&"operation"in e}function solve(e){const n=[];for(let t=0;t<e.inputs.length;t++){const u=e.inputs[t];if(r(u)){n.push(u);continue}const i=solve(u);if(-1===i)return-1;n.push(i)}return e.operation(n)}function unary(n){if(1!==n.length)return-1;const t=n[0].value;return t[0]===e.Number||t[0]===e.Dimension||t[0]===e.Percentage?n[0]:-1}function multiplication(t){if(2!==t.length)return-1;const r=t[0].value,i=t[1].value;if(r[0]===e.Number&&i[0]===e.Number){const t=r[4].value*i[4].value;return new u([e.Number,t.toString(),r[2],i[3],{value:t,type:r[4].type===n.Integer&&i[4].type===n.Integer?n.Integer:n.Number}])}if(r[0]===e.Percentage&&i[0]===e.Number){const n=r[4].value*i[4].value;return new u([e.Percentage,n.toString()+"%",r[2],i[3],{value:n}])}if(r[0]===e.Number&&i[0]===e.Percentage){const n=r[4].value*i[4].value;return new u([e.Percentage,n.toString()+"%",r[2],i[3],{value:n}])}if(r[0]===e.Dimension&&i[0]===e.Number){const t=r[4].value*i[4].value;return new u([e.Dimension,t.toString()+r[4].unit,r[2],i[3],{value:t,type:r[4].type===n.Integer&&i[4].type===n.Integer?n.Integer:n.Number,unit:r[4].unit}])}if(r[0]===e.Number&&i[0]===e.Dimension){const t=r[4].value*i[4].value;return new u([e.Dimension,t.toString()+i[4].unit,r[2],i[3],{value:t,type:r[4].type===n.Integer&&i[4].type===n.Integer?n.Integer:n.Number,unit:i[4].unit}])}return-1}function division(t){if(2!==t.length)return-1;const r=t[0].value,i=t[1].value;if(r[0]===e.Number&&i[0]===e.Number){const t=r[4].value/i[4].value;return NaN_Token(t,r,i)??new u([e.Number,t.toString(),r[2],i[3],{value:t,type:Number.isInteger(t)?n.Integer:n.Number}])}if(r[0]===e.Percentage&&i[0]===e.Number){const n=r[4].value*i[4].value;return NaN_Token(n,r,i)??new u([e.Percentage,n.toString()+"%",r[2],i[3],{value:n}])}if(r[0]===e.Dimension&&i[0]===e.Number){const t=r[4].value/i[4].value;return NaN_Token(t,r,i)??new u([e.Dimension,t.toString()+r[4].unit,r[2],i[3],{value:t,type:r[4].type===n.Integer&&i[4].type===n.Integer?n.Integer:n.Number,unit:r[4].unit}])}return-1}function NaN_Token(n,t,r){if(Number.isNaN(n))return new u([e.Ident,"NaN",t[2],r[3],{value:"NaN"}])}function addition(t){if(2!==t.length)return-1;const r=t[0].value,i=t[1].value;if(r[0]===e.Number&&i[0]===e.Number){const t=r[4].value+i[4].value;return new u([e.Number,t.toString(),r[2],i[3],{value:t,type:r[4].type===n.Integer&&i[4].type===n.Integer?n.Integer:n.Number}])}if(r[0]===e.Percentage&&i[0]===e.Percentage){const n=r[4].value+i[4].value;return new u([e.Percentage,n.toString()+"%",r[2],i[3],{value:n}])}if(r[0]===e.Dimension&&i[0]===e.Dimension&&r[4].unit===i[4].unit){const t=r[4].value+i[4].value;return new u([e.Dimension,t.toString()+r[4].unit,r[2],i[3],{value:t,type:r[4].type===n.Integer&&i[4].type===n.Integer?n.Integer:n.Number,unit:r[4].unit}])}return-1}function subtraction(t){if(2!==t.length)return-1;const r=t[0].value,i=t[1].value;if(r[0]===e.Number&&i[0]===e.Number){const t=r[4].value-i[4].value;return new u([e.Number,t.toString(),r[2],i[3],{value:t,type:r[4].type===n.Integer&&i[4].type===n.Integer?n.Integer:n.Number}])}if(r[0]===e.Percentage&&i[0]===e.Percentage){const n=r[4].value-i[4].value;return new u([e.Percentage,n.toString()+"%",r[2],i[3],{value:n}])}if(r[0]===e.Dimension&&i[0]===e.Dimension&&r[4].unit===i[4].unit){const t=r[4].value-i[4].value;return new u([e.Dimension,t.toString()+r[4].unit,r[2],i[3],{value:t,type:r[4].type===n.Integer&&i[4].type===n.Integer?n.Integer:n.Number,unit:r[4].unit}])}return-1}function convert(e,n){const r=t({css:e}),u=[];for(;!r.endOfFile();)u.push(r.nextToken());u.push(r.nextToken());const o=i(u,{onParseError:e=>{throw e}});if("walk"in o){if(a(o)&&"calc"===o.getName().toLowerCase()){const t=calcHandler(o,n??new Map);if(-1===t)return e;const r=solve(t);return-1===r?e:r.toString()}return o.walk(((e,t)=>{if("number"!=typeof t)return;const r=e.node;if(!a(r)||"calc"!==r.getName().toLowerCase())return;const u=calcHandler(r,n??new Map);if(-1===u)return;const i=solve(u);-1!==i&&e.parent.value.splice(t,1,i)})),o.toString()}}function calcHandler(t,i){const c=[...t.value.filter((e=>!o(e)&&!l(e)))];for(let t=0;t<c.length;t++){const a=c[t];if(!r(a))continue;const o=a.value;if(o[0]!==e.Ident)continue;const l=o[4].value.toLowerCase();switch(l){case"e":c.splice(t,1,new u([e.Number,Math.E.toString(),o[2],o[3],{value:Math.E,type:n.Number}]));break;case"pi":c.splice(t,1,new u([e.Number,Math.PI.toString(),o[2],o[3],{value:Math.PI,type:n.Number}]));break;default:if(i.has(l)){const r=i.get(l);c.splice(t,1,new u([e.Number,r.toString(),o[2],o[3],{value:r,type:n.Number}]))}}}if(1===c.length&&r(c[0]))return{inputs:[c[0]],operation:unary};for(let n=0;n<c.length;n++){const t=c[n];if(s(t)&&t.startToken[0]===e.OpenParen){const e=calcHandler(t,i);if(-1===e)return-1;c.splice(n,1,e)}else if(a(t))switch(t.getName().toLowerCase()){case"calc":{const e=calcHandler(t,i);if(-1===e)return-1;c.splice(n,1,e);break}default:return-1}else;}if(1===c.length&&isCalculation(c[0]))return c[0];for(let n=0;n<c.length;n++){const t=c[n];if(!t||!r(t)&&!isCalculation(t))return-1;const u=c[n+1];if(!u)break;if(!r(u))return-1;const i=c[n+2];if(!i||!r(i)&&!isCalculation(i))return-1;const a=u.value;a[0]!==e.Delim||"*"!==a[4].value?a[0]!==e.Delim||"/"!==a[4].value||(c.splice(n,3,{inputs:[t,i],operation:division}),n--):(c.splice(n,3,{inputs:[t,i],operation:multiplication}),n--)}if(1===c.length&&isCalculation(c[0]))return c[0];for(let n=0;n<c.length;n++){const t=c[n];if(!t||!r(t)&&!isCalculation(t))return-1;const u=c[n+1];if(!u)break;if(!r(u))return-1;const i=c[n+2];if(!i||!r(i)&&!isCalculation(i))return-1;const a=u.value;a[0]!==e.Delim||"+"!==a[4].value?a[0]!==e.Delim||"-"!==a[4].value||(c.splice(n,3,{inputs:[t,i],operation:subtraction}),n--):(c.splice(n,3,{inputs:[t,i],operation:addition}),n--)}return 1===c.length&&isCalculation(c[0])?c[0]:-1}export{convert};
