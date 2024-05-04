"use strict";class ParseError extends Error{sourceStart;sourceEnd;parserState;constructor(e,o,n,r){super(e),this.name="ParseError",this.sourceStart=o,this.sourceEnd=n,this.parserState=r}}class Reader{cursor=0;source="";codePointSource=[];representationIndices=[-1];length=0;representationStart=0;representationEnd=-1;constructor(e){this.source=e;{let o=-1,n="";for(n of e)o+=n.length,this.codePointSource.push(n.codePointAt(0)),this.representationIndices.push(o)}this.length=this.codePointSource.length}advanceCodePoint(e=1){this.cursor=this.cursor+e,this.representationEnd=this.representationIndices[this.cursor]}readCodePoint(e=1){const o=this.codePointSource[this.cursor];return void 0!==o&&(this.cursor=this.cursor+e,this.representationEnd=this.representationIndices[this.cursor],o)}unreadCodePoint(e=1){this.cursor=this.cursor-e,this.representationEnd=this.representationIndices[this.cursor]}resetRepresentation(){this.representationStart=this.representationIndices[this.cursor]+1,this.representationEnd=-1}}const e=39,o=42,n=8,r=13,t=9,i=58,s=44,c=64,a=127,u=33,d=12,p=46,T=62,P=45,S=31,C=69,k=101,l=123,f=40,x=91,m=60,h=10,y=11,E=95,v=1114111,g=0,I=35,O=37,U=43,D=34,w=65533,R=92,A=125,L=41,N=93,b=59,q=14,W=47,F=32,H=117,B=85,V=114,z=82,K=108,M=76,$=63,J=48,_=70;function checkIfFourCodePointsWouldStartCDO(e){return e.codePointSource[e.cursor]===m&&e.codePointSource[e.cursor+1]===u&&e.codePointSource[e.cursor+2]===P&&e.codePointSource[e.cursor+3]===P}function isDigitCodePoint(e){return e>=48&&e<=57}function isUppercaseLetterCodePoint(e){return e>=65&&e<=90}function isLowercaseLetterCodePoint(e){return e>=97&&e<=122}function isHexDigitCodePoint(e){return isDigitCodePoint(e)||e>=97&&e<=102||e>=65&&e<=70}function isLetterCodePoint(e){return isLowercaseLetterCodePoint(e)||isUppercaseLetterCodePoint(e)}function isIdentStartCodePoint(e){return isLetterCodePoint(e)||isNonASCII_IdentCodePoint(e)||e===E}function isIdentCodePoint(e){return isIdentStartCodePoint(e)||isDigitCodePoint(e)||e===P}function isNonASCII_IdentCodePoint(e){return 183===e||8204===e||8205===e||8255===e||8256===e||8204===e||(192<=e&&e<=214||216<=e&&e<=246||248<=e&&e<=893||895<=e&&e<=8191||8304<=e&&e<=8591||11264<=e&&e<=12271||12289<=e&&e<=55295||63744<=e&&e<=64975||65008<=e&&e<=65533||e>=65536)}function isNewLine(e){return 10===e||13===e||12===e}function isWhitespace(e){return 32===e||10===e||9===e||13===e||12===e}function checkIfTwoCodePointsAreAValidEscape(e){return e.codePointSource[e.cursor]===R&&!isNewLine(e.codePointSource[e.cursor+1])}function checkIfThreeCodePointsWouldStartAnIdentSequence(e,o){return o.codePointSource[o.cursor]===P?o.codePointSource[o.cursor+1]===P||(!!isIdentStartCodePoint(o.codePointSource[o.cursor+1])||o.codePointSource[o.cursor+1]===R&&!isNewLine(o.codePointSource[o.cursor+2])):!!isIdentStartCodePoint(o.codePointSource[o.cursor])||checkIfTwoCodePointsAreAValidEscape(o)}function checkIfThreeCodePointsWouldStartANumber(e){return e.codePointSource[e.cursor]===U||e.codePointSource[e.cursor]===P?!!isDigitCodePoint(e.codePointSource[e.cursor+1])||e.codePointSource[e.cursor+1]===p&&isDigitCodePoint(e.codePointSource[e.cursor+2]):e.codePointSource[e.cursor]===p?isDigitCodePoint(e.codePointSource[e.cursor+1]):isDigitCodePoint(e.codePointSource[e.cursor])}function checkIfTwoCodePointsStartAComment(e){return e.codePointSource[e.cursor]===W&&e.codePointSource[e.cursor+1]===o}function checkIfThreeCodePointsWouldStartCDC(e){return e.codePointSource[e.cursor]===P&&e.codePointSource[e.cursor+1]===P&&e.codePointSource[e.cursor+2]===T}var j,Q,G;function consumeComment(e,n){for(n.advanceCodePoint(2);;){const r=n.readCodePoint();if(!1===r){e.onParseError(new ParseError("Unexpected EOF while consuming a comment.",n.representationStart,n.representationEnd,["4.3.2. Consume comments","Unexpected EOF"]));break}if(r===o&&(void 0!==n.codePointSource[n.cursor]&&n.codePointSource[n.cursor]===W)){n.advanceCodePoint();break}}return[exports.TokenType.Comment,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,void 0]}function consumeEscapedCodePoint(e,o){const n=o.readCodePoint();if(!1===n)return e.onParseError(new ParseError("Unexpected EOF while consuming an escaped code point.",o.representationStart,o.representationEnd,["4.3.7. Consume an escaped code point","Unexpected EOF"])),w;if(isHexDigitCodePoint(n)){const e=[n];for(;void 0!==o.codePointSource[o.cursor]&&isHexDigitCodePoint(o.codePointSource[o.cursor])&&e.length<6;)e.push(o.codePointSource[o.cursor]),o.advanceCodePoint();isWhitespace(o.codePointSource[o.cursor])&&o.advanceCodePoint();const t=parseInt(String.fromCodePoint(...e),16);return 0===t?w:(r=t)>=55296&&r<=57343||t>v?w:t}var r;return n}function consumeIdentSequence(e,o){const n=[];for(;;)if(isIdentCodePoint(o.codePointSource[o.cursor]))n.push(o.codePointSource[o.cursor]),o.advanceCodePoint();else{if(!checkIfTwoCodePointsAreAValidEscape(o))return n;o.advanceCodePoint(),n.push(consumeEscapedCodePoint(e,o))}}function consumeHashToken(e,o){if(o.advanceCodePoint(),void 0!==o.codePointSource[o.cursor]&&(isIdentCodePoint(o.codePointSource[o.cursor])||checkIfTwoCodePointsAreAValidEscape(o))){let n=exports.HashType.Unrestricted;checkIfThreeCodePointsWouldStartAnIdentSequence(0,o)&&(n=exports.HashType.ID);const r=consumeIdentSequence(e,o);return[exports.TokenType.Hash,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:String.fromCodePoint(...r),type:n}]}return[exports.TokenType.Delim,"#",o.representationStart,o.representationEnd,{value:"#"}]}function consumeNumber(e,o){let n=exports.NumberType.Integer;for(o.codePointSource[o.cursor]!==U&&o.codePointSource[o.cursor]!==P||o.advanceCodePoint();isDigitCodePoint(o.codePointSource[o.cursor]);)o.advanceCodePoint();if(o.codePointSource[o.cursor]===p&&isDigitCodePoint(o.codePointSource[o.cursor+1]))for(o.advanceCodePoint(2),n=exports.NumberType.Number;isDigitCodePoint(o.codePointSource[o.cursor]);)o.advanceCodePoint();if(o.codePointSource[o.cursor]===k||o.codePointSource[o.cursor]===C){if(isDigitCodePoint(o.codePointSource[o.cursor+1]))o.advanceCodePoint(2);else{if(o.codePointSource[o.cursor+1]!==P&&o.codePointSource[o.cursor+1]!==U||!isDigitCodePoint(o.codePointSource[o.cursor+2]))return n;o.advanceCodePoint(3)}for(n=exports.NumberType.Number;isDigitCodePoint(o.codePointSource[o.cursor]);)o.advanceCodePoint()}return n}function consumeNumericToken(e,o){let n;{const e=o.codePointSource[o.cursor];e===P?n="-":e===U&&(n="+")}const r=consumeNumber(0,o),t=parseFloat(o.source.slice(o.representationStart,o.representationEnd+1));if(checkIfThreeCodePointsWouldStartAnIdentSequence(0,o)){const i=consumeIdentSequence(e,o);return[exports.TokenType.Dimension,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:t,signCharacter:n,type:r,unit:String.fromCodePoint(...i)}]}return o.codePointSource[o.cursor]===O?(o.advanceCodePoint(),[exports.TokenType.Percentage,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:t,signCharacter:n}]):[exports.TokenType.Number,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:t,signCharacter:n,type:r}]}function consumeWhiteSpace(e){for(;isWhitespace(e.codePointSource[e.cursor]);)e.advanceCodePoint();return[exports.TokenType.Whitespace,e.source.slice(e.representationStart,e.representationEnd+1),e.representationStart,e.representationEnd,void 0]}function consumeStringToken(e,o){let n="";const r=o.readCodePoint();for(;;){const t=o.readCodePoint();if(!1===t)return e.onParseError(new ParseError("Unexpected EOF while consuming a string token.",o.representationStart,o.representationEnd,["4.3.5. Consume a string token","Unexpected EOF"])),[exports.TokenType.String,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:n}];if(isNewLine(t))return e.onParseError(new ParseError("Unexpected newline while consuming a string token.",o.representationStart,o.representationEnd,["4.3.5. Consume a string token","Unexpected newline"])),o.unreadCodePoint(),[exports.TokenType.BadString,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0];if(t===r)return[exports.TokenType.String,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:n}];if(t!==R)n+=String.fromCodePoint(t);else{if(void 0===o.codePointSource[o.cursor])continue;if(isNewLine(o.codePointSource[o.cursor])){o.advanceCodePoint();continue}n+=String.fromCodePoint(consumeEscapedCodePoint(e,o))}}}function checkIfCodePointsMatchURLIdent(e){return!(3!==e.length||e[0]!==H&&e[0]!==B||e[1]!==V&&e[1]!==z||e[2]!==K&&e[2]!==M)}function consumeBadURL(e,o){for(;;){if(void 0===o.codePointSource[o.cursor])return;if(o.codePointSource[o.cursor]===L)return void o.advanceCodePoint();checkIfTwoCodePointsAreAValidEscape(o)?(o.advanceCodePoint(),consumeEscapedCodePoint(e,o)):o.advanceCodePoint()}}function consumeUrlToken(o,r){for(;isWhitespace(r.codePointSource[r.cursor]);)r.advanceCodePoint();let t="";for(;;){if(void 0===r.codePointSource[r.cursor])return o.onParseError(new ParseError("Unexpected EOF while consuming a url token.",r.representationStart,r.representationEnd,["4.3.6. Consume a url token","Unexpected EOF"])),[exports.TokenType.URL,r.source.slice(r.representationStart,r.representationEnd+1),r.representationStart,r.representationEnd,{value:t}];if(r.codePointSource[r.cursor]===L)return r.advanceCodePoint(),[exports.TokenType.URL,r.source.slice(r.representationStart,r.representationEnd+1),r.representationStart,r.representationEnd,{value:t}];if(isWhitespace(r.codePointSource[r.cursor])){for(r.advanceCodePoint();isWhitespace(r.codePointSource[r.cursor]);)r.advanceCodePoint();return void 0===r.codePointSource[r.cursor]?(o.onParseError(new ParseError("Unexpected EOF while consuming a url token.",r.representationStart,r.representationEnd,["4.3.6. Consume a url token","Consume as much whitespace as possible","Unexpected EOF"])),[exports.TokenType.URL,r.source.slice(r.representationStart,r.representationEnd+1),r.representationStart,r.representationEnd,{value:t}]):r.codePointSource[r.cursor]===L?(r.advanceCodePoint(),[exports.TokenType.URL,r.source.slice(r.representationStart,r.representationEnd+1),r.representationStart,r.representationEnd,{value:t}]):(consumeBadURL(o,r),[exports.TokenType.BadURL,r.source.slice(r.representationStart,r.representationEnd+1),r.representationStart,r.representationEnd,void 0])}if(r.codePointSource[r.cursor]===D||r.codePointSource[r.cursor]===e||r.codePointSource[r.cursor]===f||((i=r.codePointSource[r.cursor])===y||i===a||g<=i&&i<=n||q<=i&&i<=S))return consumeBadURL(o,r),o.onParseError(new ParseError("Unexpected character while consuming a url token.",r.representationStart,r.representationEnd,["4.3.6. Consume a url token","Unexpected U+0022 QUOTATION MARK (\"), U+0027 APOSTROPHE ('), U+0028 LEFT PARENTHESIS (() or non-printable code point"])),[exports.TokenType.BadURL,r.source.slice(r.representationStart,r.representationEnd+1),r.representationStart,r.representationEnd,void 0];if(r.codePointSource[r.cursor]===R){if(checkIfTwoCodePointsAreAValidEscape(r)){r.advanceCodePoint(),t+=String.fromCodePoint(consumeEscapedCodePoint(o,r));continue}return consumeBadURL(o,r),o.onParseError(new ParseError("Invalid escape sequence while consuming a url token.",r.representationStart,r.representationEnd,["4.3.6. Consume a url token","U+005C REVERSE SOLIDUS (\\)","The input stream does not start with a valid escape sequence"])),[exports.TokenType.BadURL,r.source.slice(r.representationStart,r.representationEnd+1),r.representationStart,r.representationEnd,void 0]}t+=String.fromCodePoint(r.codePointSource[r.cursor]),r.advanceCodePoint()}var i}function consumeIdentLikeToken(o,n){const r=consumeIdentSequence(o,n);if(n.codePointSource[n.cursor]!==f)return[exports.TokenType.Ident,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:String.fromCodePoint(...r)}];if(checkIfCodePointsMatchURLIdent(r)){n.advanceCodePoint();let t=0;for(;;){const o=isWhitespace(n.codePointSource[n.cursor]),i=isWhitespace(n.codePointSource[n.cursor+1]);if(o&&i){t+=1,n.advanceCodePoint(1);continue}const s=o?n.codePointSource[n.cursor+1]:n.codePointSource[n.cursor];if(s===D||s===e)return t>0&&n.unreadCodePoint(t),[exports.TokenType.Function,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:String.fromCodePoint(...r)}];break}return consumeUrlToken(o,n)}return n.advanceCodePoint(),[exports.TokenType.Function,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:String.fromCodePoint(...r)}]}function checkIfThreeCodePointsWouldStartAUnicodeRange(e){return!(e.codePointSource[e.cursor]!==H&&e.codePointSource[e.cursor]!==B||e.codePointSource[e.cursor+1]!==U||e.codePointSource[e.cursor+2]!==$&&!isHexDigitCodePoint(e.codePointSource[e.cursor+2]))}function consumeUnicodeRangeToken(e,o){o.advanceCodePoint(2);const n=[],r=[];for(;void 0!==o.codePointSource[o.cursor]&&n.length<6&&isHexDigitCodePoint(o.codePointSource[o.cursor]);)n.push(o.codePointSource[o.cursor]),o.advanceCodePoint();for(;void 0!==o.codePointSource[o.cursor]&&n.length<6&&o.codePointSource[o.cursor]===$;)0===r.length&&r.push(...n),n.push(J),r.push(_),o.advanceCodePoint();if(!r.length&&o.codePointSource[o.cursor]===P&&isHexDigitCodePoint(o.codePointSource[o.cursor+1]))for(o.advanceCodePoint();void 0!==o.codePointSource[o.cursor]&&r.length<6&&isHexDigitCodePoint(o.codePointSource[o.cursor]);)r.push(o.codePointSource[o.cursor]),o.advanceCodePoint();if(!r.length){const e=parseInt(String.fromCodePoint(...n),16);return[exports.TokenType.UnicodeRange,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{startOfRange:e,endOfRange:e}]}const t=parseInt(String.fromCodePoint(...n),16),i=parseInt(String.fromCodePoint(...r),16);return[exports.TokenType.UnicodeRange,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{startOfRange:t,endOfRange:i}]}function tokenizer(o,n){const a=o.css.valueOf(),u=o.unicodeRangesAllowed??!1,T=new Reader(a),S={onParseError:n?.onParseError??noop};return{nextToken:function nextToken(){T.resetRepresentation();const o=T.codePointSource[T.cursor];if(void 0===o)return[exports.TokenType.EOF,"",-1,-1,void 0];if(o===W&&checkIfTwoCodePointsStartAComment(T))return consumeComment(S,T);if(u&&(o===H||o===B)&&checkIfThreeCodePointsWouldStartAUnicodeRange(T))return consumeUnicodeRangeToken(0,T);if(isIdentStartCodePoint(o))return consumeIdentLikeToken(S,T);if(isDigitCodePoint(o))return consumeNumericToken(S,T);switch(o){case s:return T.advanceCodePoint(),[exports.TokenType.Comma,",",T.representationStart,T.representationEnd,void 0];case i:return T.advanceCodePoint(),[exports.TokenType.Colon,":",T.representationStart,T.representationEnd,void 0];case b:return T.advanceCodePoint(),[exports.TokenType.Semicolon,";",T.representationStart,T.representationEnd,void 0];case f:return T.advanceCodePoint(),[exports.TokenType.OpenParen,"(",T.representationStart,T.representationEnd,void 0];case L:return T.advanceCodePoint(),[exports.TokenType.CloseParen,")",T.representationStart,T.representationEnd,void 0];case x:return T.advanceCodePoint(),[exports.TokenType.OpenSquare,"[",T.representationStart,T.representationEnd,void 0];case N:return T.advanceCodePoint(),[exports.TokenType.CloseSquare,"]",T.representationStart,T.representationEnd,void 0];case l:return T.advanceCodePoint(),[exports.TokenType.OpenCurly,"{",T.representationStart,T.representationEnd,void 0];case A:return T.advanceCodePoint(),[exports.TokenType.CloseCurly,"}",T.representationStart,T.representationEnd,void 0];case e:case D:return consumeStringToken(S,T);case I:return consumeHashToken(S,T);case U:case p:return checkIfThreeCodePointsWouldStartANumber(T)?consumeNumericToken(S,T):(T.advanceCodePoint(),[exports.TokenType.Delim,T.source[T.representationStart],T.representationStart,T.representationEnd,{value:T.source[T.representationStart]}]);case h:case r:case d:case t:case F:return consumeWhiteSpace(T);case P:return checkIfThreeCodePointsWouldStartANumber(T)?consumeNumericToken(S,T):checkIfThreeCodePointsWouldStartCDC(T)?(T.advanceCodePoint(3),[exports.TokenType.CDC,"--\x3e",T.representationStart,T.representationEnd,void 0]):checkIfThreeCodePointsWouldStartAnIdentSequence(0,T)?consumeIdentLikeToken(S,T):(T.advanceCodePoint(),[exports.TokenType.Delim,"-",T.representationStart,T.representationEnd,{value:"-"}]);case m:return checkIfFourCodePointsWouldStartCDO(T)?(T.advanceCodePoint(4),[exports.TokenType.CDO,"\x3c!--",T.representationStart,T.representationEnd,void 0]):(T.advanceCodePoint(),[exports.TokenType.Delim,"<",T.representationStart,T.representationEnd,{value:"<"}]);case c:if(T.advanceCodePoint(),checkIfThreeCodePointsWouldStartAnIdentSequence(0,T)){const e=consumeIdentSequence(S,T);return[exports.TokenType.AtKeyword,T.source.slice(T.representationStart,T.representationEnd+1),T.representationStart,T.representationEnd,{value:String.fromCodePoint(...e)}]}return[exports.TokenType.Delim,"@",T.representationStart,T.representationEnd,{value:"@"}];case R:return checkIfTwoCodePointsAreAValidEscape(T)?consumeIdentLikeToken(S,T):(T.advanceCodePoint(),S.onParseError(new ParseError('Invalid escape sequence after "\\"',T.representationStart,T.representationEnd,["4.3.1. Consume a token","U+005C REVERSE SOLIDUS (\\)","The input stream does not start with a valid escape sequence"])),[exports.TokenType.Delim,"\\",T.representationStart,T.representationEnd,{value:"\\"}])}return T.advanceCodePoint(),[exports.TokenType.Delim,T.source[T.representationStart],T.representationStart,T.representationEnd,{value:T.source[T.representationStart]}]},endOfFile:function endOfFile(){return void 0===T.codePointSource[T.cursor]}}}function noop(){}function ensureThatValueRoundTripsAsIdent(e){let o=0;e[0]===P&&e[1]===P?o=2:e[0]===P&&e[1]?(o=2,isIdentStartCodePoint(e[1])||(o+=insertEscapedCodePoint(e,1,e[1]))):isIdentStartCodePoint(e[0])?o=1:(o=1,o+=insertEscapedCodePoint(e,0,e[0]));for(let n=o;n<e.length;n++)isIdentCodePoint(e[n])||(n+=insertEscapedCodePoint(e,n,e[n]));return e}function insertEscapedCodePoint(e,o,n){const r=n.toString(16),t=[];for(const e of r)t.push(e.codePointAt(0));const i=e[o+1];return o===e.length-1||i&&isHexDigitCodePoint(i)?(e.splice(o,1,92,...t,32),1+t.length):(e.splice(o,1,92,...t),t.length)}exports.TokenType=void 0,(j=exports.TokenType||(exports.TokenType={})).Comment="comment",j.AtKeyword="at-keyword-token",j.BadString="bad-string-token",j.BadURL="bad-url-token",j.CDC="CDC-token",j.CDO="CDO-token",j.Colon="colon-token",j.Comma="comma-token",j.Delim="delim-token",j.Dimension="dimension-token",j.EOF="EOF-token",j.Function="function-token",j.Hash="hash-token",j.Ident="ident-token",j.Number="number-token",j.Percentage="percentage-token",j.Semicolon="semicolon-token",j.String="string-token",j.URL="url-token",j.Whitespace="whitespace-token",j.OpenParen="(-token",j.CloseParen=")-token",j.OpenSquare="[-token",j.CloseSquare="]-token",j.OpenCurly="{-token",j.CloseCurly="}-token",j.UnicodeRange="unicode-range-token",exports.NumberType=void 0,(Q=exports.NumberType||(exports.NumberType={})).Integer="integer",Q.Number="number",exports.HashType=void 0,(G=exports.HashType||(exports.HashType={})).Unrestricted="unrestricted",G.ID="id";const X=Object.values(exports.TokenType);exports.ParseError=ParseError,exports.Reader=Reader,exports.cloneTokens=function cloneTokens(e){return"undefined"!=typeof globalThis&&"structuredClone"in globalThis?structuredClone(e):JSON.parse(JSON.stringify(e))},exports.isToken=function isToken(e){return!!Array.isArray(e)&&(!(e.length<4)&&(!!X.includes(e[0])&&("string"==typeof e[1]&&("number"==typeof e[2]&&"number"==typeof e[3]))))},exports.isTokenAtKeyword=function isTokenAtKeyword(e){return!!e&&e[0]===exports.TokenType.AtKeyword},exports.isTokenBadString=function isTokenBadString(e){return!!e&&e[0]===exports.TokenType.BadString},exports.isTokenBadURL=function isTokenBadURL(e){return!!e&&e[0]===exports.TokenType.BadURL},exports.isTokenCDC=function isTokenCDC(e){return!!e&&e[0]===exports.TokenType.CDC},exports.isTokenCDO=function isTokenCDO(e){return!!e&&e[0]===exports.TokenType.CDO},exports.isTokenCloseCurly=function isTokenCloseCurly(e){return!!e&&e[0]===exports.TokenType.CloseCurly},exports.isTokenCloseParen=function isTokenCloseParen(e){return!!e&&e[0]===exports.TokenType.CloseParen},exports.isTokenCloseSquare=function isTokenCloseSquare(e){return!!e&&e[0]===exports.TokenType.CloseSquare},exports.isTokenColon=function isTokenColon(e){return!!e&&e[0]===exports.TokenType.Colon},exports.isTokenComma=function isTokenComma(e){return!!e&&e[0]===exports.TokenType.Comma},exports.isTokenComment=function isTokenComment(e){return!!e&&e[0]===exports.TokenType.Comment},exports.isTokenDelim=function isTokenDelim(e){return!!e&&e[0]===exports.TokenType.Delim},exports.isTokenDimension=function isTokenDimension(e){return!!e&&e[0]===exports.TokenType.Dimension},exports.isTokenEOF=function isTokenEOF(e){return!!e&&e[0]===exports.TokenType.EOF},exports.isTokenFunction=function isTokenFunction(e){return!!e&&e[0]===exports.TokenType.Function},exports.isTokenHash=function isTokenHash(e){return!!e&&e[0]===exports.TokenType.Hash},exports.isTokenIdent=function isTokenIdent(e){return!!e&&e[0]===exports.TokenType.Ident},exports.isTokenNumber=function isTokenNumber(e){return!!e&&e[0]===exports.TokenType.Number},exports.isTokenNumeric=function isTokenNumeric(e){switch(e[0]){case exports.TokenType.Dimension:case exports.TokenType.Number:case exports.TokenType.Percentage:return!0;default:return!1}},exports.isTokenOpenCurly=function isTokenOpenCurly(e){return!!e&&e[0]===exports.TokenType.OpenCurly},exports.isTokenOpenParen=function isTokenOpenParen(e){return!!e&&e[0]===exports.TokenType.OpenParen},exports.isTokenOpenSquare=function isTokenOpenSquare(e){return!!e&&e[0]===exports.TokenType.OpenSquare},exports.isTokenPercentage=function isTokenPercentage(e){return!!e&&e[0]===exports.TokenType.Percentage},exports.isTokenSemicolon=function isTokenSemicolon(e){return!!e&&e[0]===exports.TokenType.Semicolon},exports.isTokenString=function isTokenString(e){return!!e&&e[0]===exports.TokenType.String},exports.isTokenURL=function isTokenURL(e){return!!e&&e[0]===exports.TokenType.URL},exports.isTokenUnicodeRange=function isTokenUnicodeRange(e){return!!e&&e[0]===exports.TokenType.UnicodeRange},exports.isTokenWhiteSpaceOrComment=function isTokenWhiteSpaceOrComment(e){switch(e[0]){case exports.TokenType.Whitespace:case exports.TokenType.Comment:return!0;default:return!1}},exports.isTokenWhitespace=function isTokenWhitespace(e){return!!e&&e[0]===exports.TokenType.Whitespace},exports.mirrorVariant=function mirrorVariant(e){switch(e[0]){case exports.TokenType.OpenParen:return[exports.TokenType.CloseParen,")",-1,-1,void 0];case exports.TokenType.CloseParen:return[exports.TokenType.OpenParen,"(",-1,-1,void 0];case exports.TokenType.OpenCurly:return[exports.TokenType.CloseCurly,"}",-1,-1,void 0];case exports.TokenType.CloseCurly:return[exports.TokenType.OpenCurly,"{",-1,-1,void 0];case exports.TokenType.OpenSquare:return[exports.TokenType.CloseSquare,"]",-1,-1,void 0];case exports.TokenType.CloseSquare:return[exports.TokenType.OpenSquare,"[",-1,-1,void 0];default:return null}},exports.mirrorVariantType=function mirrorVariantType(e){switch(e){case exports.TokenType.OpenParen:return exports.TokenType.CloseParen;case exports.TokenType.CloseParen:return exports.TokenType.OpenParen;case exports.TokenType.OpenCurly:return exports.TokenType.CloseCurly;case exports.TokenType.CloseCurly:return exports.TokenType.OpenCurly;case exports.TokenType.OpenSquare:return exports.TokenType.CloseSquare;case exports.TokenType.CloseSquare:return exports.TokenType.OpenSquare;default:return null}},exports.mutateIdent=function mutateIdent(e,o){const n=[];for(const e of o)n.push(e.codePointAt(0));const r=String.fromCodePoint(...ensureThatValueRoundTripsAsIdent(n));e[1]=r,e[4].value=o},exports.mutateUnit=function mutateUnit(e,o){const n=[];for(const e of o)n.push(e.codePointAt(0));const r=ensureThatValueRoundTripsAsIdent(n);101===r[0]&&insertEscapedCodePoint(r,0,r[0]);const t=String.fromCodePoint(...r),i="+"===e[4].signCharacter?e[4].signCharacter:"",s=e[4].value.toString();e[1]=`${i}${s}${t}`,e[4].unit=o},exports.stringify=function stringify(...e){let o="";for(let n=0;n<e.length;n++)o+=e[n][1];return o},exports.tokenize=function tokenize(e,o){const n=tokenizer(e,o),r=[];{for(;!n.endOfFile();){const e=n.nextToken();e&&r.push(e)}const e=n.nextToken();e&&r.push(e)}return r},exports.tokenizer=tokenizer;
