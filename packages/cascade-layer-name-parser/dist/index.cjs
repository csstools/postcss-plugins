"use strict";var e=require("@csstools/css-tokenizer"),t=require("@csstools/css-parser-algorithms");class LayerName{parts;constructor(e){this.parts=e}tokens(){return[...this.parts]}slice(t,n){const r=[];for(let t=0;t<this.parts.length;t++)this.parts[t][0]===e.TokenType.Ident&&r.push(t);const s=r.slice(t,n);return new LayerName(this.parts.slice(s[0],s[s.length-1]+1))}concat(t){const n=[e.TokenType.Delim,".",-1,-1,{value:"."}];return new LayerName([...this.parts.filter((t=>t[0]===e.TokenType.Ident||t[0]===e.TokenType.Delim)),n,...t.parts.filter((t=>t[0]===e.TokenType.Ident||t[0]===e.TokenType.Delim))])}segments(){return this.parts.filter((t=>t[0]===e.TokenType.Ident)).map((e=>e[4].value))}name(){return this.parts.filter((t=>t[0]===e.TokenType.Ident||t[0]===e.TokenType.Delim)).map((e=>e[1])).join("")}equal(e){const t=this.segments(),n=e.segments();if(t.length!==n.length)return!1;for(let e=0;e<t.length;e++){if(t[e]!==n[e])return!1}return!0}toString(){return e.stringify(...this.parts)}toJSON(){return{parts:this.parts,segments:this.segments(),name:this.name()}}}function parseFromTokens(n,r){const s=t.parseCommaSeparatedListOfComponentValues(n,{onParseError:null==r?void 0:r.onParseError}),o=(null==r?void 0:r.onParseError)??(()=>{}),genericError=e=>({message:`Invalid cascade layer name. ${e}`,start:n[0][2],end:n[n.length-1][3],state:["6.4.2. Layer Naming and Nesting","Layer name syntax","<layer-name> = <ident> [ '.' <ident> ]*"]}),a=[];for(let n=0;n<s.length;n++){const r=s[n];for(let e=0;e<r.length;e++){const n=r[e];if(!t.isTokenNode(n)&&!t.isCommentNode(n)&&!t.isWhitespaceNode(n))return o(genericError(`Invalid layer name part "${n.toString()}"`)),[]}const i=r.flatMap((e=>e.tokens()));let p,l=!1,m=!1;for(let t=0;t<i.length;t++){const n=i[t];if(n[0]!==e.TokenType.Comment&&n[0]!==e.TokenType.Whitespace&&n[0]!==e.TokenType.Ident&&(n[0]!==e.TokenType.Delim||"."!==n[4].value))return o(genericError(`Invalid character "${n[1]}"`)),[];if(!l&&n[0]===e.TokenType.Delim)return o(genericError("Layer names can not start with a dot.")),[];if(l){if(n[0]===e.TokenType.Whitespace){m=!0;continue}if(m&&n[0]===e.TokenType.Comment)continue;if(m)return o(genericError("Encountered unexpected whitespace between layer name parts.")),[];if(p[0]===e.TokenType.Ident&&n[0]===e.TokenType.Ident)return o(genericError("Layer name parts must be separated by dots.")),[];if(p[0]===e.TokenType.Delim&&n[0]===e.TokenType.Delim)return o(genericError("Layer name parts must not be empty.")),[]}n[0]===e.TokenType.Ident&&(l=!0),n[0]!==e.TokenType.Ident&&n[0]!==e.TokenType.Delim||(p=n)}if(!p)return o(genericError("Empty layer name.")),[];if(p[0]===e.TokenType.Delim)return o(genericError("Layer name must not end with a dot.")),[];a.push(new LayerName(i))}return a}exports.LayerName=LayerName,exports.addLayerToModel=function addLayerToModel(e,t){return t.forEach((t=>{const n=t.segments();e:for(let r=0;r<n.length;r++){const n=t.slice(0,r+1),s=n.segments();let o=-1,a=0;for(let t=0;t<e.length;t++){const n=e[t].segments();let r=0;t:for(let e=0;e<n.length;e++){const t=n[e],o=s[e];if(o===t&&e+1===s.length)continue e;if(o!==t){if(o!==t)break t}else r++}r>=a&&(o=t,a=r)}-1===o?e.push(n):e.splice(o+1,0,n)}})),e},exports.parse=function parse(t,n){const r=e.tokenizer({css:t},{commentsAreTokens:!0,onParseError:null==n?void 0:n.onParseError}),s=[];for(;!r.endOfFile();)s.push(r.nextToken());return s.push(r.nextToken()),parseFromTokens(s,n)},exports.parseFromTokens=parseFromTokens;
