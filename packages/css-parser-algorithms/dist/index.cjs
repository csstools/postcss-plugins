"use strict";var e,n=require("@csstools/css-tokenizer");function consumeComponentValue(e,o){const t=o[0];if(t[0]===n.TokenType.OpenParen||t[0]===n.TokenType.OpenCurly||t[0]===n.TokenType.OpenSquare){const n=consumeSimpleBlock(e,o);return{advance:n.advance,node:n.node}}if(t[0]===n.TokenType.Function){const n=consumeFunction(e,o);return{advance:n.advance,node:n.node}}if(t[0]===n.TokenType.Whitespace){const n=consumeWhitespace(e,o);return{advance:n.advance,node:n.node}}if(t[0]===n.TokenType.Comment){const n=consumeComment(e,o);return{advance:n.advance,node:n.node}}return{advance:1,node:new TokenNode(t)}}exports.ComponentValueType=void 0,(e=exports.ComponentValueType||(exports.ComponentValueType={})).Function="function",e.SimpleBlock="simple-block",e.Whitespace="whitespace",e.Comment="comment",e.Token="token";class FunctionNode{type=exports.ComponentValueType.Function;name;endToken;value;constructor(e,n,o){this.name=e,this.endToken=n,this.value=o}getName(){return this.name[4].value}normalize(){this.endToken[0]===n.TokenType.EOF&&(this.endToken=[n.TokenType.CloseParen,")",-1,-1,void 0])}tokens(){return this.endToken[0]===n.TokenType.EOF?[this.name,...this.value.flatMap((e=>e.tokens()))]:[this.name,...this.value.flatMap((e=>e.tokens())),this.endToken]}toString(){const e=this.value.map((e=>n.isToken(e)?n.stringify(e):e.toString())).join("");return n.stringify(this.name)+e+n.stringify(this.endToken)}indexOf(e){return this.value.indexOf(e)}at(e){if("number"==typeof e)return e<0&&(e=this.value.length+e),this.value[e]}walk(e,n){let o=!1;if(this.value.forEach(((t,s)=>{if(o)return;let i;n&&(i={...n}),!1!==e({node:t,parent:this,state:i},s)?"walk"in t&&!1===t.walk(e,i)&&(o=!0):o=!0})),o)return!1}toJSON(){return{type:this.type,name:this.getName(),tokens:this.tokens(),value:this.value.map((e=>e.toJSON()))}}isFunctionNode(){return FunctionNode.isFunctionNode(this)}static isFunctionNode(e){return!!e&&(e instanceof FunctionNode&&e.type===exports.ComponentValueType.Function)}}function consumeFunction(e,o){const t=[];let s=1;for(;;){const i=o[s];if(!i||i[0]===n.TokenType.EOF)return e.onParseError(new n.ParseError("Unexpected EOF while consuming a function.",o[0][2],o[o.length-1][3],["5.4.9. Consume a function","Unexpected EOF"])),{advance:o.length,node:new FunctionNode(o[0],i,t)};if(i[0]===n.TokenType.CloseParen)return{advance:s+1,node:new FunctionNode(o[0],i,t)};if(i[0]===n.TokenType.Comment||i[0]===n.TokenType.Whitespace){const n=consumeAllCommentsAndWhitespace(e,o.slice(s));s+=n.advance,t.push(...n.nodes);continue}const r=consumeComponentValue(e,o.slice(s));s+=r.advance,t.push(r.node)}}class SimpleBlockNode{type=exports.ComponentValueType.SimpleBlock;startToken;endToken;value;constructor(e,n,o){this.startToken=e,this.endToken=n,this.value=o}normalize(){if(this.endToken[0]===n.TokenType.EOF){const e=n.mirrorVariant(this.startToken);e&&(this.endToken=e)}}tokens(){return this.endToken[0]===n.TokenType.EOF?[this.startToken,...this.value.flatMap((e=>e.tokens()))]:[this.startToken,...this.value.flatMap((e=>e.tokens())),this.endToken]}toString(){const e=this.value.map((e=>n.isToken(e)?n.stringify(e):e.toString())).join("");return n.stringify(this.startToken)+e+n.stringify(this.endToken)}indexOf(e){return this.value.indexOf(e)}at(e){if("number"==typeof e)return e<0&&(e=this.value.length+e),this.value[e]}walk(e,n){let o=!1;if(this.value.forEach(((t,s)=>{if(o)return;let i;n&&(i={...n}),!1!==e({node:t,parent:this,state:i},s)?"walk"in t&&!1===t.walk(e,i)&&(o=!0):o=!0})),o)return!1}toJSON(){return{type:this.type,startToken:this.startToken,tokens:this.tokens(),value:this.value.map((e=>e.toJSON()))}}isSimpleBlockNode(){return SimpleBlockNode.isSimpleBlockNode(this)}static isSimpleBlockNode(e){return!!e&&(e instanceof SimpleBlockNode&&e.type===exports.ComponentValueType.SimpleBlock)}}function consumeSimpleBlock(e,o){const t=n.mirrorVariantType(o[0][0]);if(!t)throw new Error("Failed to parse, a mirror variant must exist for all block open tokens.");const s=[];let i=1;for(;;){const r=o[i];if(!r||r[0]===n.TokenType.EOF)return e.onParseError(new n.ParseError("Unexpected EOF while consuming a simple block.",o[0][2],o[o.length-1][3],["5.4.8. Consume a simple block","Unexpected EOF"])),{advance:o.length,node:new SimpleBlockNode(o[0],r,s)};if(r[0]===t)return{advance:i+1,node:new SimpleBlockNode(o[0],r,s)};if(r[0]===n.TokenType.Comment||r[0]===n.TokenType.Whitespace){const n=consumeAllCommentsAndWhitespace(e,o.slice(i));i+=n.advance,s.push(...n.nodes);continue}const a=consumeComponentValue(e,o.slice(i));i+=a.advance,s.push(a.node)}}class WhitespaceNode{type=exports.ComponentValueType.Whitespace;value;constructor(e){this.value=e}tokens(){return this.value}toString(){return n.stringify(...this.value)}toJSON(){return{type:this.type,tokens:this.tokens()}}isWhitespaceNode(){return WhitespaceNode.isWhitespaceNode(this)}static isWhitespaceNode(e){return!!e&&(e instanceof WhitespaceNode&&e.type===exports.ComponentValueType.Whitespace)}}function consumeWhitespace(e,o){let t=0;for(;;){if(o[t][0]!==n.TokenType.Whitespace)return{advance:t,node:new WhitespaceNode(o.slice(0,t))};t++}}class CommentNode{type=exports.ComponentValueType.Comment;value;constructor(e){this.value=e}tokens(){return[this.value]}toString(){return n.stringify(this.value)}toJSON(){return{type:this.type,tokens:this.tokens()}}isCommentNode(){return CommentNode.isCommentNode(this)}static isCommentNode(e){return!!e&&(e instanceof CommentNode&&e.type===exports.ComponentValueType.Comment)}}function consumeComment(e,n){return{advance:1,node:new CommentNode(n[0])}}function consumeAllCommentsAndWhitespace(e,o){const t=[];let s=0;for(;;)if(o[s][0]!==n.TokenType.Whitespace){if(o[s][0]!==n.TokenType.Comment)return{advance:s,nodes:t};t.push(new CommentNode(o[s])),s++}else{const e=consumeWhitespace(0,o.slice(s));s+=e.advance,t.push(e.node)}}class TokenNode{type=exports.ComponentValueType.Token;value;constructor(e){this.value=e}tokens(){return[this.value]}toString(){return n.stringify(this.value)}toJSON(){return{type:this.type,tokens:this.tokens()}}isTokenNode(){return TokenNode.isTokenNode(this)}static isTokenNode(e){return!!e&&(e instanceof TokenNode&&e.type===exports.ComponentValueType.Token)}}function isSimpleBlockNode(e){return SimpleBlockNode.isSimpleBlockNode(e)}function isFunctionNode(e){return FunctionNode.isFunctionNode(e)}exports.CommentNode=CommentNode,exports.FunctionNode=FunctionNode,exports.SimpleBlockNode=SimpleBlockNode,exports.TokenNode=TokenNode,exports.WhitespaceNode=WhitespaceNode,exports.gatherNodeAncestry=function gatherNodeAncestry(e){const n=new Map;return e.walk((e=>{Array.isArray(e.node)?e.node.forEach((o=>{n.set(o,e.parent)})):n.set(e.node,e.parent)})),n},exports.isCommentNode=function isCommentNode(e){return CommentNode.isCommentNode(e)},exports.isFunctionNode=isFunctionNode,exports.isSimpleBlockNode=isSimpleBlockNode,exports.isTokenNode=function isTokenNode(e){return TokenNode.isTokenNode(e)},exports.isWhitespaceNode=function isWhitespaceNode(e){return WhitespaceNode.isWhitespaceNode(e)},exports.parseCommaSeparatedListOfComponentValues=function parseCommaSeparatedListOfComponentValues(e,o){const t={onParseError:o?.onParseError??(()=>{})},s=[...e];if(0===e.length)return[];s[s.length-1][0]!==n.TokenType.EOF&&s.push([n.TokenType.EOF,"",s[s.length-1][2],s[s.length-1][3],void 0]);const i=[];let r=[],a=0;for(;;){if(!s[a]||s[a][0]===n.TokenType.EOF)return r.length&&i.push(r),i;if(s[a][0]===n.TokenType.Comma){i.push(r),r=[],a++;continue}const o=consumeComponentValue(t,e.slice(a));r.push(o.node),a+=o.advance}},exports.parseComponentValue=function parseComponentValue(e,o){const t={onParseError:o?.onParseError??(()=>{})},s=[...e];s[s.length-1][0]!==n.TokenType.EOF&&s.push([n.TokenType.EOF,"",s[s.length-1][2],s[s.length-1][3],void 0]);const i=consumeComponentValue(t,s);if(s[Math.min(i.advance,s.length-1)][0]===n.TokenType.EOF)return i.node;t.onParseError(new n.ParseError("Expected EOF after parsing a component value.",e[0][2],e[e.length-1][3],["5.3.9. Parse a component value","Expected EOF"]))},exports.parseListOfComponentValues=function parseListOfComponentValues(e,o){const t={onParseError:o?.onParseError??(()=>{})},s=[...e];s[s.length-1][0]!==n.TokenType.EOF&&s.push([n.TokenType.EOF,"",s[s.length-1][2],s[s.length-1][3],void 0]);const i=[];let r=0;for(;;){if(!s[r]||s[r][0]===n.TokenType.EOF)return i;const e=consumeComponentValue(t,s.slice(r));i.push(e.node),r+=e.advance}},exports.replaceComponentValues=function replaceComponentValues(e,n){for(let o=0;o<e.length;o++){const t=e[o];for(let e=0;e<t.length;e++){const o=t[e];{const s=n(o);if(s){t.splice(e,1,s);continue}}(isSimpleBlockNode(o)||isFunctionNode(o))&&o.walk(((e,o)=>{if("number"!=typeof o)return;const t=e.node,s=n(t);s&&e.parent.value.splice(o,1,s)}))}}return e},exports.sourceIndices=function sourceIndices(e){if(Array.isArray(e)){const n=e[0];if(!n)return[0,0];const o=e[e.length-1]||n;return[sourceIndices(n)[0],sourceIndices(o)[1]]}const n=e.tokens(),o=n[0],t=n[n.length-1];return o&&t?[o[2],t[3]]:[0,0]},exports.stringify=function stringify(e){return e.map((e=>e.map((e=>n.stringify(...e.tokens()))).join(""))).join(",")};
