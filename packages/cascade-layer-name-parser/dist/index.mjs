import{TokenType as e,stringify as t,ParseError as n,tokenizer as r}from"@csstools/css-tokenizer";import{parseCommaSeparatedListOfComponentValues as a,isTokenNode as s,isCommentNode as o,isWhitespaceNode as i}from"@csstools/css-parser-algorithms";class LayerName{parts;constructor(e){this.parts=e}tokens(){return[...this.parts]}slice(t,n){const r=[];for(let t=0;t<this.parts.length;t++)this.parts[t][0]===e.Ident&&r.push(t);const a=r.slice(t,n);return new LayerName(this.parts.slice(a[0],a[a.length-1]+1))}concat(t){const n=[e.Delim,".",-1,-1,{value:"."}];return new LayerName([...this.parts.filter((t=>t[0]===e.Ident||t[0]===e.Delim)),n,...t.parts.filter((t=>t[0]===e.Ident||t[0]===e.Delim))])}segments(){return this.parts.filter((t=>t[0]===e.Ident)).map((e=>e[4].value))}name(){return this.parts.filter((t=>t[0]===e.Ident||t[0]===e.Delim)).map((e=>e[1])).join("")}equal(e){const t=this.segments(),n=e.segments();if(t.length!==n.length)return!1;for(let e=0;e<t.length;e++){if(t[e]!==n[e])return!1}return!0}toString(){return t(...this.parts)}toJSON(){return{parts:this.parts,segments:this.segments(),name:this.name()}}}function addLayerToModel(e,t){return t.forEach((t=>{const n=t.segments();e:for(let r=0;r<n.length;r++){const n=t.slice(0,r+1),a=n.segments();let s=-1,o=0;for(let t=0;t<e.length;t++){const n=e[t].segments();let r=0;t:for(let e=0;e<n.length;e++){const t=n[e],s=a[e];if(s===t&&e+1===a.length)continue e;if(s!==t){if(s!==t)break t}else r++}r>=o&&(s=t,o=r)}-1===s?e.push(n):e.splice(s+1,0,n)}})),e}function parseFromTokens(t,r){const l=a(t,{onParseError:null==r?void 0:r.onParseError}),m=(null==r?void 0:r.onParseError)??(()=>{}),c=["6.4.2. Layer Naming and Nesting","Layer name syntax","<layer-name> = <ident> [ '.' <ident> ]*"],d=t[0][2],u=t[t.length-1][3],p=[];for(let t=0;t<l.length;t++){const r=l[t];for(let e=0;e<r.length;e++){const t=r[e];if(!s(t)&&!o(t)&&!i(t))return m(new n(`Invalid cascade layer name. Invalid layer name part "${t.toString()}"`,d,u,c)),[]}const a=r.flatMap((e=>e.tokens()));let h,f=!1,y=!1;for(let t=0;t<a.length;t++){const r=a[t];if(r[0]!==e.Comment&&r[0]!==e.Whitespace&&r[0]!==e.Ident&&(r[0]!==e.Delim||"."!==r[4].value))return m(new n(`Invalid cascade layer name. Invalid character "${r[1]}"`,d,u,c)),[];if(!f&&r[0]===e.Delim)return m(new n("Invalid cascade layer name. Layer names can not start with a dot.",d,u,c)),[];if(f){if(r[0]===e.Whitespace){y=!0;continue}if(y&&r[0]===e.Comment)continue;if(y)return m(new n("Invalid cascade layer name. Encountered unexpected whitespace between layer name parts.",d,u,c)),[];if(h[0]===e.Ident&&r[0]===e.Ident)return m(new n("Invalid cascade layer name. Layer name parts must be separated by dots.",d,u,c)),[];if(h[0]===e.Delim&&r[0]===e.Delim)return m(new n("Invalid cascade layer name. Layer name parts must not be empty.",d,u,c)),[]}r[0]===e.Ident&&(f=!0),r[0]!==e.Ident&&r[0]!==e.Delim||(h=r)}if(!h)return m(new n("Invalid cascade layer name. Empty layer name.",d,u,c)),[];if(h[0]===e.Delim)return m(new n("Invalid cascade layer name. Layer name must not end with a dot.",d,u,c)),[];p.push(new LayerName(a))}return p}function parse(e,t){const n=r({css:e},{commentsAreTokens:!0,onParseError:null==t?void 0:t.onParseError}),a=[];for(;!n.endOfFile();)a.push(n.nextToken());return a.push(n.nextToken()),parseFromTokens(a,t)}export{LayerName,addLayerToModel,parse,parseFromTokens};
