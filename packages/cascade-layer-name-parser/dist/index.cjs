"use strict";var e=require("@csstools/css-tokenizer"),n=require("@csstools/css-parser-algorithms");class LayerName{parts;constructor(e){this.parts=e}tokens(){return[...this.parts]}slice(n,r){const t=[];for(let n=0;n<this.parts.length;n++)this.parts[n][0]===e.TokenType.Ident&&t.push(n);const a=t.slice(n,r);return new LayerName(this.parts.slice(a[0],a[a.length-1]+1))}concat(n){const r=[e.TokenType.Delim,".",-1,-1,{value:"."}];return new LayerName([...this.parts.filter((n=>n[0]===e.TokenType.Ident||n[0]===e.TokenType.Delim)),r,...n.parts.filter((n=>n[0]===e.TokenType.Ident||n[0]===e.TokenType.Delim))])}segments(){return this.parts.filter((n=>n[0]===e.TokenType.Ident)).map((e=>e[4].value))}name(){return this.parts.filter((n=>n[0]===e.TokenType.Ident||n[0]===e.TokenType.Delim)).map((e=>e[1])).join("")}equal(e){const n=this.segments(),r=e.segments();if(n.length!==r.length)return!1;for(let e=0;e<n.length;e++){if(n[e]!==r[e])return!1}return!0}toString(){return e.stringify(...this.parts)}toJSON(){return{parts:this.parts,segments:this.segments(),name:this.name()}}}function parseFromTokens(r,t){const a=n.parseCommaSeparatedListOfComponentValues(r,{onParseError:null==t?void 0:t.onParseError}),s=(null==t?void 0:t.onParseError)??(()=>{}),o=["6.4.2. Layer Naming and Nesting","Layer name syntax","<layer-name> = <ident> [ '.' <ident> ]*"],i=r[0][2],l=r[r.length-1][3],p=[];for(let r=0;r<a.length;r++){const t=a[r];for(let r=0;r<t.length;r++){const a=t[r];if(!n.isTokenNode(a)&&!n.isCommentNode(a)&&!n.isWhitespaceNode(a))return s(new e.ParseError(`Invalid cascade layer name. Invalid layer name part "${a.toString()}"`,i,l,o)),[]}const m=t.flatMap((e=>e.tokens()));let c,T=!1,y=!1;for(let n=0;n<m.length;n++){const r=m[n];if(r[0]!==e.TokenType.Comment&&r[0]!==e.TokenType.Whitespace&&r[0]!==e.TokenType.Ident&&(r[0]!==e.TokenType.Delim||"."!==r[4].value))return s(new e.ParseError(`Invalid cascade layer name. Invalid character "${r[1]}"`,i,l,o)),[];if(!T&&r[0]===e.TokenType.Delim)return s(new e.ParseError("Invalid cascade layer name. Layer names can not start with a dot.",i,l,o)),[];if(T){if(r[0]===e.TokenType.Whitespace){y=!0;continue}if(y&&r[0]===e.TokenType.Comment)continue;if(y)return s(new e.ParseError("Invalid cascade layer name. Encountered unexpected whitespace between layer name parts.",i,l,o)),[];if(c[0]===e.TokenType.Ident&&r[0]===e.TokenType.Ident)return s(new e.ParseError("Invalid cascade layer name. Layer name parts must be separated by dots.",i,l,o)),[];if(c[0]===e.TokenType.Delim&&r[0]===e.TokenType.Delim)return s(new e.ParseError("Invalid cascade layer name. Layer name parts must not be empty.",i,l,o)),[]}r[0]===e.TokenType.Ident&&(T=!0),r[0]!==e.TokenType.Ident&&r[0]!==e.TokenType.Delim||(c=r)}if(!c)return s(new e.ParseError("Invalid cascade layer name. Empty layer name.",i,l,o)),[];if(c[0]===e.TokenType.Delim)return s(new e.ParseError("Invalid cascade layer name. Layer name must not end with a dot.",i,l,o)),[];p.push(new LayerName(m))}return p}exports.LayerName=LayerName,exports.addLayerToModel=function addLayerToModel(e,n){return n.forEach((n=>{const r=n.segments();e:for(let t=0;t<r.length;t++){const r=n.slice(0,t+1),a=r.segments();let s=-1,o=0;for(let n=0;n<e.length;n++){const r=e[n].segments();let t=0;n:for(let e=0;e<r.length;e++){const n=r[e],s=a[e];if(s===n&&e+1===a.length)continue e;if(s!==n){if(s!==n)break n}else t++}t>=o&&(s=n,o=t)}-1===s?e.push(r):e.splice(s+1,0,r)}})),e},exports.parse=function parse(n,r){const t=e.tokenizer({css:n},{onParseError:null==r?void 0:r.onParseError}),a=[];for(;!t.endOfFile();)a.push(t.nextToken());return a.push(t.nextToken()),parseFromTokens(a,r)},exports.parseFromTokens=parseFromTokens;
