import{parseCommaSeparatedListOfComponentValues as e,isSimpleBlockNode as n,isFunctionNode as t,isTokenNode as a,isCommentNode as r,TokenNode as o,FunctionNode as s,WhitespaceNode as i}from"@csstools/css-parser-algorithms";import{calcFromComponentValues as l}from"@csstools/css-calc";import{tokenize as u,TokenType as c,stringify as v,NumberType as m}from"@csstools/css-tokenizer";const p=/(repeating-)?(linear|radial|conic)-gradient\(/i,f=/^(repeating-)?(linear|radial|conic)-gradient$/i,g=/^(abs|acos|asin|atan|atan2|calc|clamp|cos|exp|hypot|log|max|min|mod|pow|rem|round|sign|sin|sqrt|tan)$/i,creator=n=>{const s=Object.assign({preserve:!1},n);return{postcssPlugin:"postcss-gradient-stop-increments",Declaration(n){if(!p.test(n.value))return;if(!u({css:n.value}).find((e=>e[0]===c.Delim&&"+"===e[4].value)))return;const i=replaceComponentValues(e(u({css:n.value})),(e=>{if(!t(e))return;const n=e.getName();if(!f.test(n))return;let s=null;for(let n=0;n<e.value.length;n++){const i=e.value[n];if(a(i)&&i.value[0]===c.Delim&&"+"===i.value[4].value){const t=i,a=n;for(;r(e.value[n+1]);)n++;if(n++,isZeroOrNegative(e.value[n])){const t=new o([c.Number,"0",-1,-1,{value:0,type:m.Integer}]);e.value.splice(a,n-a+1,t),n=e.value.indexOf(t);continue}const l=incrementLengthNode(s,t,e.value[n]);e.value.splice(a,n-a+1,l),s=l,n=e.value.indexOf(l)}else(isNumericLargerThanZero(i)||t(i)&&g.test(i.getName()))&&(s=maxOfLastAndCurrentLengthNode(s,i))}})).map((e=>e.map((e=>v(...e.tokens()))).join(""))).join(",");i!==n.value&&(n.cloneBefore({value:i}),null!=s&&s.preserve||n.remove())}}};function isNumericLargerThanZero(e){return!(!a(e)||e.value[0]!==c.Percentage&&e.value[0]!==c.Dimension&&e.value[0]!==c.Number||!(e.value[4].value>0))}function isZeroOrNegative(e){return!(!a(e)||e.value[0]!==c.Percentage&&e.value[0]!==c.Dimension&&e.value[0]!==c.Number||!(e.value[4].value<=0))}function incrementLengthNode(e,n,t){if(!e)return t;const a=new s([c.Function,"calc(",-1,-1,{value:"calc"}],[c.CloseParen,")",-1,-1,void 0],[e,new i([[c.Whitespace," ",-1,-1,void 0]]),n,new i([[c.Whitespace," ",-1,-1,void 0]]),t]),[[r]]=l([[a]]);return r}function maxOfLastAndCurrentLengthNode(e,n){if(!e)return n;const t=new s([c.Function,"max(",-1,-1,{value:"max"}],[c.CloseParen,")",-1,-1,void 0],[e,new o([c.Comma,",",-1,-1,void 0]),new i([[c.Whitespace," ",-1,-1,void 0]]),n]),[[a]]=l([[t]]);return a}function replaceComponentValues(e,a){for(let r=0;r<e.length;r++){const o=e[r];for(let e=0;e<o.length;e++){const r=o[e];{const n=a(r);if(n){o.splice(e,1,n);continue}}(n(r)||t(r))&&r.walk(((e,n)=>{if("number"!=typeof n)return;const t=e.node,r=a(t);r&&e.parent.value.splice(n,1,r)}))}}return e}creator.postcss=!0;export{creator as default};
