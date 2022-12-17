"use strict";var e=require("@csstools/css-parser-algorithms"),t=require("@csstools/css-tokenizer");class LayerName{parts;constructor(e){this.parts=e}tokens(){return[...this.parts]}segments(){return this.parts.filter((e=>e[0]===t.TokenType.Ident)).map((e=>e[4].value))}name(){return this.segments().join(".")}toString(){return t.stringify(...this.parts)}toJSON(){return{parts:this.parts,segments:this.segments(),name:this.name()}}}function parseFromTokens(n,r){const s=e.parseCommaSeparatedListOfComponentValues(n,{onParseError:null==r?void 0:r.onParseError}),a=(null==r?void 0:r.onParseError)??(()=>{}),genericError=e=>({message:`Invalid cascade layer name. ${e}`,start:n[0][2],end:n[n.length-1][3],state:["6.4.2. Layer Naming and Nesting","Layer name syntax","<layer-name> = <ident> [ '.' <ident> ]*"]}),o=[];for(let n=0;n<s.length;n++){const r=s[n];for(let t=0;t<r.length;t++){const n=r[t];if(!e.isTokenNode(n)&&!e.isCommentNode(n)&&!e.isWhitespaceNode(n))return a(genericError(`Invalid layer name part "${n.toString()}"`)),[]}const i=r.flatMap((e=>e.tokens()));let p,m=!1,l=!1;for(let e=0;e<i.length;e++){const n=i[e];if(n[0]!==t.TokenType.Comment&&n[0]!==t.TokenType.Whitespace&&n[0]!==t.TokenType.Ident&&(n[0]!==t.TokenType.Delim||"."!==n[4].value))return a(genericError(`Invalid character "${n[1]}"`)),[];if(!m&&n[0]===t.TokenType.Delim)return a(genericError("Layer names can not start with a dot.")),[];if(m){if(n[0]===t.TokenType.Whitespace){l=!0;continue}if(l)return a(genericError("Encountered unexpected whitespace between layer name parts.")),[];if(p[0]===t.TokenType.Ident&&n[0]===t.TokenType.Ident)return a(genericError("Layer name parts must be separated by dots.")),[];if(p[0]===t.TokenType.Delim&&n[0]===t.TokenType.Delim)return a(genericError("Layer name parts must not be empty.")),[]}n[0]===t.TokenType.Ident&&(m=!0),n[0]!==t.TokenType.Ident&&n[0]!==t.TokenType.Delim||(p=n)}if(!p)return a(genericError("Empty layer name.")),[];if(p[0]===t.TokenType.Delim)return a(genericError("Layer name must not end with a dot.")),[];o.push(new LayerName(i))}return o}exports.LayerName=LayerName,exports.parse=function parse(e,n){const r=t.tokenizer({css:e},{commentsAreTokens:!0,onParseError:null==n?void 0:n.onParseError}),s=[];for(;!r.endOfFile();)s.push(r.nextToken());return s.push(r.nextToken()),parseFromTokens(s,n)},exports.parseFromTokens=parseFromTokens;
