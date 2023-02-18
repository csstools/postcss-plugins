"use strict";class ParseError extends Error{sourceStart;sourceEnd;parserState;constructor(e,o,r,n){super(e),this.name="ParseError",this.sourceStart=o,this.sourceEnd=r,this.parserState=n}}class Reader{cursor;source="";codePointSource=[];length=0;representationStart=0;representationEnd=-1;constructor(e){this.cursor=0,this.source=e,this.length=e.length,this.codePointSource=new Array(this.length);for(let e=0;e<this.length;e++)this.codePointSource[e]=this.source.charCodeAt(e)}advanceCodePoint(e=1){this.cursor+=e,this.representationEnd=this.cursor-1}readCodePoint(e=1){const o=this.codePointSource[this.cursor];return void 0!==o&&(this.cursor+=e,this.representationEnd=this.cursor-1,o)}unreadCodePoint(e=1){this.cursor-=e,this.representationEnd=this.cursor-1}}var e,o,r;exports.TokenType=void 0,(e=exports.TokenType||(exports.TokenType={})).Comment="comment",e.AtKeyword="at-keyword-token",e.BadString="bad-string-token",e.BadURL="bad-url-token",e.CDC="CDC-token",e.CDO="CDO-token",e.Colon="colon-token",e.Comma="comma-token",e.Delim="delim-token",e.Dimension="dimension-token",e.EOF="EOF-token",e.Function="function-token",e.Hash="hash-token",e.Ident="ident-token",e.Number="number-token",e.Percentage="percentage-token",e.Semicolon="semicolon-token",e.String="string-token",e.URL="url-token",e.Whitespace="whitespace-token",e.OpenParen="(-token",e.CloseParen=")-token",e.OpenSquare="[-token",e.CloseSquare="]-token",e.OpenCurly="{-token",e.CloseCurly="}-token",exports.NumberType=void 0,(o=exports.NumberType||(exports.NumberType={})).Integer="integer",o.Number="number",function(e){e.Unrestricted="unrestricted",e.ID="id"}(r||(r={}));const n=Object.values(exports.TokenType);const t=39,i=42,s=8,c=13,a=9,u=58,d=44,p=64,S=127,P=33,C=12,T=46,l=62,k=45,f=31,m=69,E=101,h=123,v=40,x=91,y=60,g=10,I=11,O=95,w=1114111,A=0,U=35,D=37,L=43,N=34,b=65533,R=92,q=125,W=41,F=93,V=59,B=14,H=47,z=32;function checkIfFourCodePointsWouldStartCDO(e,o){return o.codePointSource[o.cursor]===y&&o.codePointSource[o.cursor+1]===P&&o.codePointSource[o.cursor+2]===k&&o.codePointSource[o.cursor+3]===k}function isDigitCodePoint(e){return e>=48&&e<=57}function isUppercaseLetterCodePoint(e){return e>=65&&e<=90}function isLowercaseLetterCodePoint(e){return e>=97&&e<=122}function isHexDigitCodePoint(e){return isDigitCodePoint(e)||e>=97&&e<=102||e>=65&&e<=70}function isLetterCodePoint(e){return isLowercaseLetterCodePoint(e)||isUppercaseLetterCodePoint(e)}function isNonASCIICodePoint(e){return e>=128}function isIdentStartCodePoint(e){return isLetterCodePoint(e)||isNonASCIICodePoint(e)||e===O}function isIdentCodePoint(e){return isIdentStartCodePoint(e)||isDigitCodePoint(e)||e===k}function isNewLine(e){return 10===e||13===e||12===e}function isWhitespace(e){return 32===e||10===e||9===e||13===e||12===e}function checkIfTwoCodePointsAreAValidEscape(e,o){return o.codePointSource[o.cursor]===R&&!isNewLine(o.codePointSource[o.cursor+1])}function checkIfThreeCodePointsWouldStartAnIdentSequence(e,o){return o.codePointSource[o.cursor]===k?o.codePointSource[o.cursor+1]===k||(!!isIdentStartCodePoint(o.codePointSource[o.cursor+1])||o.codePointSource[o.cursor+1]===R&&!isNewLine(o.codePointSource[o.cursor+2])):!!isIdentStartCodePoint(o.codePointSource[o.cursor])||checkIfTwoCodePointsAreAValidEscape(0,o)}function checkIfThreeCodePointsWouldStartANumber(e,o){return o.codePointSource[o.cursor]===L||o.codePointSource[o.cursor]===k?!!isDigitCodePoint(o.codePointSource[o.cursor+1])||o.codePointSource[o.cursor+1]===T&&isDigitCodePoint(o.codePointSource[o.cursor+2]):o.codePointSource[o.cursor]===T?isDigitCodePoint(o.codePointSource[o.cursor+1]):isDigitCodePoint(o.codePointSource[o.cursor])}function checkIfTwoCodePointsStartAComment(e,o){return o.codePointSource[o.cursor]===H&&o.codePointSource[o.cursor+1]===i}function checkIfThreeCodePointsWouldStartCDC(e,o){return o.codePointSource[o.cursor]===k&&o.codePointSource[o.cursor+1]===k&&o.codePointSource[o.cursor+2]===l}function consumeComment(e,o){for(o.advanceCodePoint(2);;){const r=o.readCodePoint();if(!1===r){e.onParseError(new ParseError("Unexpected EOF while consuming a comment.",o.representationStart,o.representationEnd,["4.3.2. Consume comments","Unexpected EOF"]));break}if(r===i&&(void 0!==o.codePointSource[o.cursor]&&o.codePointSource[o.cursor]===H)){o.advanceCodePoint();break}}return[exports.TokenType.Comment,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0]}function consumeEscapedCodePoint(e,o){const r=o.readCodePoint();if(!1===r)return e.onParseError(new ParseError("Unexpected EOF while consuming an escaped code point.",o.representationStart,o.representationEnd,["4.3.7. Consume an escaped code point","Unexpected EOF"])),b;if(isHexDigitCodePoint(r)){const e=[r];for(;void 0!==o.codePointSource[o.cursor]&&isHexDigitCodePoint(o.codePointSource[o.cursor])&&e.length<6;)e.push(o.codePointSource[o.cursor]),o.advanceCodePoint();isWhitespace(o.codePointSource[o.cursor])&&o.advanceCodePoint();const t=parseInt(String.fromCharCode(...e),16);return 0===t?b:(n=t)>=55296&&n<=57343||t>w?b:t}var n;return r}function consumeIdentSequence(e,o){const r=[];for(;;)if(isIdentCodePoint(o.codePointSource[o.cursor]))r.push(o.codePointSource[o.cursor]),o.advanceCodePoint();else{if(!checkIfTwoCodePointsAreAValidEscape(0,o))return r;o.advanceCodePoint(),r.push(consumeEscapedCodePoint(e,o))}}function consumeHashToken(e,o){if(o.advanceCodePoint(),void 0!==o.codePointSource[o.cursor]&&(isIdentCodePoint(o.codePointSource[o.cursor])||checkIfTwoCodePointsAreAValidEscape(0,o))){let n=r.Unrestricted;checkIfThreeCodePointsWouldStartAnIdentSequence(0,o)&&(n=r.ID);const t=consumeIdentSequence(e,o);return[exports.TokenType.Hash,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:String.fromCharCode(...t),type:n}]}return[exports.TokenType.Delim,"#",o.representationStart,o.representationEnd,{value:"#"}]}function consumeNumber(e,o){let r=exports.NumberType.Integer;for(o.codePointSource[o.cursor]!==L&&o.codePointSource[o.cursor]!==k||o.advanceCodePoint();isDigitCodePoint(o.codePointSource[o.cursor]);)o.advanceCodePoint();if(o.codePointSource[o.cursor]===T&&isDigitCodePoint(o.codePointSource[o.cursor+1]))for(o.advanceCodePoint(2),r=exports.NumberType.Number;isDigitCodePoint(o.codePointSource[o.cursor]);)o.advanceCodePoint();if(o.codePointSource[o.cursor]===E||o.codePointSource[o.cursor]===m){if(isDigitCodePoint(o.codePointSource[o.cursor+1]))o.advanceCodePoint(2);else{if(o.codePointSource[o.cursor+1]!==k&&o.codePointSource[o.cursor+1]!==L||!isDigitCodePoint(o.codePointSource[o.cursor+2]))return r;o.advanceCodePoint(3)}for(r=exports.NumberType.Number;isDigitCodePoint(o.codePointSource[o.cursor]);)o.advanceCodePoint()}return r}function consumeNumericToken(e,o){const r=consumeNumber(0,o),n=parseFloat(o.source.slice(o.representationStart,o.representationEnd+1));if(checkIfThreeCodePointsWouldStartAnIdentSequence(0,o)){const t=consumeIdentSequence(e,o);return[exports.TokenType.Dimension,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:n,type:r,unit:String.fromCharCode(...t)}]}return o.codePointSource[o.cursor]===D?(o.advanceCodePoint(),[exports.TokenType.Percentage,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:n}]):[exports.TokenType.Number,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:n,type:r}]}function consumeWhiteSpace(e,o){for(;isWhitespace(o.codePointSource[o.cursor]);)o.advanceCodePoint();return[exports.TokenType.Whitespace,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0]}function consumeStringToken(e,o){let r="";const n=o.readCodePoint();for(;;){const t=o.readCodePoint();if(!1===t)return e.onParseError(new ParseError("Unexpected EOF while consuming a string token.",o.representationStart,o.representationEnd,["4.3.5. Consume a string token","Unexpected EOF"])),[exports.TokenType.String,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:r}];if(isNewLine(t))return e.onParseError(new ParseError("Unexpected newline while consuming a string token.",o.representationStart,o.representationEnd,["4.3.5. Consume a string token","Unexpected newline"])),o.unreadCodePoint(),[exports.TokenType.BadString,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0];if(t===n)return[exports.TokenType.String,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:r}];if(t!==R)r+=String.fromCharCode(t);else{if(void 0===o.codePointSource[o.cursor])continue;if(isNewLine(o.codePointSource[o.cursor])){o.advanceCodePoint();continue}r+=String.fromCharCode(consumeEscapedCodePoint(e,o))}}}const K="u".charCodeAt(0),M="U".charCodeAt(0),$="r".charCodeAt(0),J="R".charCodeAt(0),j="l".charCodeAt(0),Q="L".charCodeAt(0);function checkIfCodePointsMatchURLIdent(e,o){return 3===o.length&&((o[0]===K||o[0]===M)&&((o[1]===$||o[1]===J)&&(o[2]===j||o[2]===Q)))}function consumeBadURL(e,o){for(;;){if(void 0===o.codePointSource[o.cursor])return;if(o.codePointSource[o.cursor]===W)return void o.advanceCodePoint();checkIfTwoCodePointsAreAValidEscape(0,o)?(o.advanceCodePoint(),consumeEscapedCodePoint(e,o)):o.advanceCodePoint()}}function consumeUrlToken(e,o){consumeWhiteSpace(0,o);let r="";for(;;){if(void 0===o.codePointSource[o.cursor])return e.onParseError(new ParseError("Unexpected EOF while consuming a url token.",o.representationStart,o.representationEnd,["4.3.6. Consume a url token","Unexpected EOF"])),[exports.TokenType.URL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:r}];if(o.codePointSource[o.cursor]===W)return o.advanceCodePoint(),[exports.TokenType.URL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:r}];if(isWhitespace(o.codePointSource[o.cursor]))return consumeWhiteSpace(0,o),void 0===o.codePointSource[o.cursor]?(e.onParseError(new ParseError("Unexpected EOF while consuming a url token.",o.representationStart,o.representationEnd,["4.3.6. Consume a url token","Consume as much whitespace as possible","Unexpected EOF"])),[exports.TokenType.URL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:r}]):o.codePointSource[o.cursor]===W?(o.advanceCodePoint(),[exports.TokenType.URL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:r}]):(consumeBadURL(e,o),[exports.TokenType.BadURL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0]);if(o.codePointSource[o.cursor]===N||o.codePointSource[o.cursor]===t||o.codePointSource[o.cursor]===v||((n=o.codePointSource[o.cursor])===I||n===S||A<=n&&n<=s||B<=n&&n<=f))return consumeBadURL(e,o),e.onParseError(new ParseError("Unexpected character while consuming a url token.",o.representationStart,o.representationEnd,["4.3.6. Consume a url token","Unexpected U+0022 QUOTATION MARK (\"), U+0027 APOSTROPHE ('), U+0028 LEFT PARENTHESIS (() or non-printable code point"])),[exports.TokenType.BadURL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0];if(o.codePointSource[o.cursor]===R){if(checkIfTwoCodePointsAreAValidEscape(0,o)){o.advanceCodePoint(),r+=String.fromCharCode(consumeEscapedCodePoint(e,o));continue}return consumeBadURL(e,o),e.onParseError(new ParseError("Invalid escape sequence while consuming a url token.",o.representationStart,o.representationEnd,["4.3.6. Consume a url token","U+005C REVERSE SOLIDUS (\\)","The input stream does not start with a valid escape sequence"])),[exports.TokenType.BadURL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0]}r+=String.fromCharCode(o.codePointSource[o.cursor]),o.advanceCodePoint()}var n}function consumeIdentLikeToken(e,o){const r=consumeIdentSequence(e,o);if(o.codePointSource[o.cursor]!==v)return[exports.TokenType.Ident,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:String.fromCharCode(...r)}];if(checkIfCodePointsMatchURLIdent(0,r)){o.advanceCodePoint();let n=0;for(;;){const e=isWhitespace(o.codePointSource[o.cursor]),i=isWhitespace(o.codePointSource[o.cursor+1]);if(e&&i){n+=1,o.advanceCodePoint(1);continue}const s=e?o.codePointSource[o.cursor+1]:o.codePointSource[o.cursor];if(s===N||s===t)return n>0&&o.unreadCodePoint(n),[exports.TokenType.Function,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:String.fromCharCode(...r)}];break}return consumeUrlToken(e,o)}return o.advanceCodePoint(),[exports.TokenType.Function,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:String.fromCharCode(...r)}]}function tokenizer(e,o){const r=e.css.valueOf(),n=new Reader(r),i={onParseError:(null==o?void 0:o.onParseError)??(()=>{})};return{nextToken:function nextToken(){if(n.representationStart=n.cursor,n.representationEnd=-1,checkIfTwoCodePointsStartAComment(0,n))return consumeComment(i,n);const e=n.codePointSource[n.cursor];if(void 0===e)return[exports.TokenType.EOF,"",-1,-1,void 0];if(isIdentStartCodePoint(e))return consumeIdentLikeToken(i,n);if(isDigitCodePoint(e))return consumeNumericToken(i,n);switch(e){case d:return n.advanceCodePoint(),[exports.TokenType.Comma,",",n.representationStart,n.representationEnd,void 0];case u:return n.advanceCodePoint(),[exports.TokenType.Colon,":",n.representationStart,n.representationEnd,void 0];case V:return n.advanceCodePoint(),[exports.TokenType.Semicolon,";",n.representationStart,n.representationEnd,void 0];case v:return n.advanceCodePoint(),[exports.TokenType.OpenParen,"(",n.representationStart,n.representationEnd,void 0];case W:return n.advanceCodePoint(),[exports.TokenType.CloseParen,")",n.representationStart,n.representationEnd,void 0];case x:return n.advanceCodePoint(),[exports.TokenType.OpenSquare,"[",n.representationStart,n.representationEnd,void 0];case F:return n.advanceCodePoint(),[exports.TokenType.CloseSquare,"]",n.representationStart,n.representationEnd,void 0];case h:return n.advanceCodePoint(),[exports.TokenType.OpenCurly,"{",n.representationStart,n.representationEnd,void 0];case q:return n.advanceCodePoint(),[exports.TokenType.CloseCurly,"}",n.representationStart,n.representationEnd,void 0];case t:case N:return consumeStringToken(i,n);case U:return consumeHashToken(i,n);case L:case T:return checkIfThreeCodePointsWouldStartANumber(0,n)?consumeNumericToken(i,n):(n.advanceCodePoint(),[exports.TokenType.Delim,n.source[n.representationStart],n.representationStart,n.representationEnd,{value:n.source[n.representationStart]}]);case g:case c:case C:case a:case z:return consumeWhiteSpace(0,n);case k:return checkIfThreeCodePointsWouldStartANumber(0,n)?consumeNumericToken(i,n):checkIfThreeCodePointsWouldStartCDC(0,n)?(n.advanceCodePoint(3),[exports.TokenType.CDC,"--\x3e",n.representationStart,n.representationEnd,void 0]):checkIfThreeCodePointsWouldStartAnIdentSequence(0,n)?consumeIdentLikeToken(i,n):(n.advanceCodePoint(),[exports.TokenType.Delim,"-",n.representationStart,n.representationEnd,{value:"-"}]);case y:return checkIfFourCodePointsWouldStartCDO(0,n)?(n.advanceCodePoint(4),[exports.TokenType.CDO,"\x3c!--",n.representationStart,n.representationEnd,void 0]):(n.advanceCodePoint(),[exports.TokenType.Delim,"<",n.representationStart,n.representationEnd,{value:"<"}]);case p:if(n.advanceCodePoint(),checkIfThreeCodePointsWouldStartAnIdentSequence(0,n)){const e=consumeIdentSequence(i,n);return[exports.TokenType.AtKeyword,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:String.fromCharCode(...e)}]}return[exports.TokenType.Delim,"@",n.representationStart,n.representationEnd,{value:"@"}];case R:return checkIfTwoCodePointsAreAValidEscape(0,n)?consumeIdentLikeToken(i,n):(n.advanceCodePoint(),i.onParseError(new ParseError('Invalid escape sequence after "\\"',n.representationStart,n.representationEnd,["4.3.1. Consume a token","U+005C REVERSE SOLIDUS (\\)","The input stream does not start with a valid escape sequence"])),[exports.TokenType.Delim,"\\",n.representationStart,n.representationEnd,{value:"\\"}])}return n.advanceCodePoint(),[exports.TokenType.Delim,n.source[n.representationStart],n.representationStart,n.representationEnd,{value:n.source[n.representationStart]}]},endOfFile:function endOfFile(){return void 0===n.codePointSource[n.cursor]}}}exports.ParseError=ParseError,exports.Reader=Reader,exports.cloneTokens=function cloneTokens(e){return"undefined"!=typeof globalThis&&"structuredClone"in globalThis?structuredClone(e):JSON.parse(JSON.stringify(e))},exports.isToken=function isToken(e){return!!Array.isArray(e)&&(!(e.length<4)&&(!!n.includes(e[0])&&("string"==typeof e[1]&&("number"==typeof e[2]&&"number"==typeof e[3]))))},exports.mirrorVariant=function mirrorVariant(e){switch(e[0]){case exports.TokenType.OpenParen:return[exports.TokenType.CloseParen,")",-1,-1,void 0];case exports.TokenType.CloseParen:return[exports.TokenType.OpenParen,"(",-1,-1,void 0];case exports.TokenType.OpenCurly:return[exports.TokenType.CloseCurly,"}",-1,-1,void 0];case exports.TokenType.CloseCurly:return[exports.TokenType.OpenCurly,"{",-1,-1,void 0];case exports.TokenType.OpenSquare:return[exports.TokenType.CloseSquare,"]",-1,-1,void 0];case exports.TokenType.CloseSquare:return[exports.TokenType.OpenSquare,"[",-1,-1,void 0];default:return null}},exports.mirrorVariantType=function mirrorVariantType(e){switch(e){case exports.TokenType.OpenParen:return exports.TokenType.CloseParen;case exports.TokenType.CloseParen:return exports.TokenType.OpenParen;case exports.TokenType.OpenCurly:return exports.TokenType.CloseCurly;case exports.TokenType.CloseCurly:return exports.TokenType.OpenCurly;case exports.TokenType.OpenSquare:return exports.TokenType.CloseSquare;case exports.TokenType.CloseSquare:return exports.TokenType.OpenSquare;default:return null}},exports.mutateIdent=function mutateIdent(e,o){let r="";const n=new Array(o.length);for(let e=0;e<o.length;e++)n[e]=o.charCodeAt(e);let t=0;n[0]===k&&n[1]===k?(r="--",t=2):n[0]===k&&n[1]?(r="-",t=2,isIdentStartCodePoint(n[1])?r+=o[1]:r+=`\\${n[1].toString(16)} `):isIdentStartCodePoint(n[0])?(r=o[0],t=1):(r=`\\${n[0].toString(16)} `,t=1);for(let e=t;e<n.length;e++)isIdentCodePoint(n[e])?r+=o[e]:r+=`\\${n[e].toString(16)} `;e[1]=r,e[4].value=o},exports.stringify=function stringify(...e){let o="";for(let r=0;r<e.length;r++)o+=e[r][1];return o},exports.tokenize=function tokenize(e,o){const r=tokenizer(e,o),n=[];{for(;!r.endOfFile();){const e=r.nextToken();e&&n.push(e)}const e=r.nextToken();e&&n.push(e)}return n},exports.tokenizer=tokenizer;
