"use strict";class ParseError extends Error{sourceStart;sourceEnd;parserState;constructor(e,n,o,t){super(e),this.name="ParseError",this.sourceStart=n,this.sourceEnd=o,this.parserState=t}}class ParseErrorWithToken extends ParseError{token;constructor(e,n,o,t,r){super(e,n,o,t),this.token=r}}const e={UnexpectedNewLineInString:"Unexpected newline while consuming a string token.",UnexpectedEOFInString:"Unexpected EOF while consuming a string token.",UnexpectedEOFInComment:"Unexpected EOF while consuming a comment.",UnexpectedEOFInURL:"Unexpected EOF while consuming a url token.",UnexpectedEOFInEscapedCodePoint:"Unexpected EOF while consuming an escaped code point.",UnexpectedCharacterInURL:"Unexpected character while consuming a url token.",InvalidEscapeSequenceInURL:"Invalid escape sequence while consuming a url token.",InvalidEscapeSequenceAfterBackslash:'Invalid escape sequence after "\\"'};class Reader{cursor=0;source="";representationStart=0;representationEnd=-1;constructor(e){this.source=e}advanceCodePoint(e=1){this.cursor=this.cursor+e,this.representationEnd=this.cursor-1}readCodePoint(){const e=this.source.codePointAt(this.cursor);if(void 0!==e)return this.cursor=this.cursor+1,this.representationEnd=this.cursor-1,e}unreadCodePoint(e=1){this.cursor=this.cursor-e,this.representationEnd=this.cursor-1}resetRepresentation(){this.representationStart=this.cursor,this.representationEnd=-1}}const n="undefined"!=typeof globalThis&&"structuredClone"in globalThis;const o=39,t=42,r=8,s=13,i=9,c=58,a=44,u=64,d=127,p=33,T=12,P=46,k=62,C=45,l=31,f=69,x=101,S=123,m=40,E=91,h=60,y=10,v=11,A=95,g=1114111,I=0,U=35,O=37,R=43,D=34,w=65533,L=92,W=125,N=41,F=93,q=59,b=14,H=47,B=32,V=117,z=85,K=114,M=82,$=108,J=76,_=63,j=48,Q=70;function checkIfFourCodePointsWouldStartCDO(e){return e.source.codePointAt(e.cursor)===h&&e.source.codePointAt(e.cursor+1)===p&&e.source.codePointAt(e.cursor+2)===C&&e.source.codePointAt(e.cursor+3)===C}function isDigitCodePoint(e){return void 0!==e&&e>=48&&e<=57}function isUppercaseLetterCodePoint(e){return void 0!==e&&e>=65&&e<=90}function isLowercaseLetterCodePoint(e){return void 0!==e&&e>=97&&e<=122}function isHexDigitCodePoint(e){return void 0!==e&&(e>=48&&e<=57||e>=97&&e<=102||e>=65&&e<=70)}function isLetterCodePoint(e){return isLowercaseLetterCodePoint(e)||isUppercaseLetterCodePoint(e)}function isIdentStartCodePoint(e){return isLetterCodePoint(e)||isNonASCII_IdentCodePoint(e)||e===A}function isIdentCodePoint(e){return isIdentStartCodePoint(e)||isDigitCodePoint(e)||e===C}function isNonASCII_IdentCodePoint(e){return 183===e||8204===e||8205===e||8255===e||8256===e||8204===e||void 0!==e&&(192<=e&&e<=214||216<=e&&e<=246||248<=e&&e<=893||895<=e&&e<=8191||8304<=e&&e<=8591||11264<=e&&e<=12271||12289<=e&&e<=55295||63744<=e&&e<=64975||65008<=e&&e<=65533||e>=65536)}function isNewLine(e){return e===y||e===s||e===T}function isWhitespace(e){return e===B||e===y||e===i||e===s||e===T}function checkIfTwoCodePointsAreAValidEscape(e){return e.source.codePointAt(e.cursor)===L&&!isNewLine(e.source.codePointAt(e.cursor+1))}function checkIfThreeCodePointsWouldStartAnIdentSequence(e,n){return n.source.codePointAt(n.cursor)===C?n.source.codePointAt(n.cursor+1)===C||(!!isIdentStartCodePoint(n.source.codePointAt(n.cursor+1))||n.source.codePointAt(n.cursor+1)===L&&!isNewLine(n.source.codePointAt(n.cursor+2))):!!isIdentStartCodePoint(n.source.codePointAt(n.cursor))||checkIfTwoCodePointsAreAValidEscape(n)}function checkIfThreeCodePointsWouldStartANumber(e){return e.source.codePointAt(e.cursor)===R||e.source.codePointAt(e.cursor)===C?!!isDigitCodePoint(e.source.codePointAt(e.cursor+1))||e.source.codePointAt(e.cursor+1)===P&&isDigitCodePoint(e.source.codePointAt(e.cursor+2)):e.source.codePointAt(e.cursor)===P?isDigitCodePoint(e.source.codePointAt(e.cursor+1)):isDigitCodePoint(e.source.codePointAt(e.cursor))}function checkIfTwoCodePointsStartAComment(e){return e.source.codePointAt(e.cursor)===H&&e.source.codePointAt(e.cursor+1)===t}function checkIfThreeCodePointsWouldStartCDC(e){return e.source.codePointAt(e.cursor)===C&&e.source.codePointAt(e.cursor+1)===C&&e.source.codePointAt(e.cursor+2)===k}var G,X,Y;function consumeComment(n,o){for(o.advanceCodePoint(2);;){const r=o.readCodePoint();if(void 0===r){const t=[exports.TokenType.Comment,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0];return n.onParseError(new ParseErrorWithToken(e.UnexpectedEOFInComment,o.representationStart,o.representationEnd,["4.3.2. Consume comments","Unexpected EOF"],t)),t}if(r===t&&(void 0!==o.source.codePointAt(o.cursor)&&o.source.codePointAt(o.cursor)===H)){o.advanceCodePoint();break}}return[exports.TokenType.Comment,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0]}function consumeEscapedCodePoint(n,o){const t=o.readCodePoint();if(void 0===t)return n.onParseError(new ParseError(e.UnexpectedEOFInEscapedCodePoint,o.representationStart,o.representationEnd,["4.3.7. Consume an escaped code point","Unexpected EOF"])),w;if(isHexDigitCodePoint(t)){const e=[t];let n;for(;void 0!==(n=o.source.codePointAt(o.cursor))&&isHexDigitCodePoint(n)&&e.length<6;)e.push(n),o.advanceCodePoint();isWhitespace(o.source.codePointAt(o.cursor))&&o.advanceCodePoint();const s=parseInt(String.fromCodePoint(...e),16);return 0===s?w:void 0!==(r=s)&&r>=55296&&r<=57343||s>g?w:s}var r;return t}function consumeIdentSequence(e,n){const o=[];for(;;){const t=n.source.codePointAt(n.cursor);if(isIdentCodePoint(t))o.push(t),n.advanceCodePoint(+(t>65535)+1);else{if(!checkIfTwoCodePointsAreAValidEscape(n))return o;n.advanceCodePoint(),o.push(consumeEscapedCodePoint(e,n))}}}function consumeHashToken(e,n){n.advanceCodePoint();const o=n.source.codePointAt(n.cursor);if(void 0!==o&&(isIdentCodePoint(o)||checkIfTwoCodePointsAreAValidEscape(n))){let o=exports.HashType.Unrestricted;checkIfThreeCodePointsWouldStartAnIdentSequence(0,n)&&(o=exports.HashType.ID);const t=consumeIdentSequence(e,n);return[exports.TokenType.Hash,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:String.fromCodePoint(...t),type:o}]}return[exports.TokenType.Delim,"#",n.representationStart,n.representationEnd,{value:"#"}]}function consumeNumber(e,n){let o=exports.NumberType.Integer;for(n.source.codePointAt(n.cursor)!==R&&n.source.codePointAt(n.cursor)!==C||n.advanceCodePoint();isDigitCodePoint(n.source.codePointAt(n.cursor));)n.advanceCodePoint();if(n.source.codePointAt(n.cursor)===P&&isDigitCodePoint(n.source.codePointAt(n.cursor+1)))for(n.advanceCodePoint(2),o=exports.NumberType.Number;isDigitCodePoint(n.source.codePointAt(n.cursor));)n.advanceCodePoint();if(n.source.codePointAt(n.cursor)===x||n.source.codePointAt(n.cursor)===f){if(isDigitCodePoint(n.source.codePointAt(n.cursor+1)))n.advanceCodePoint(2);else{if(n.source.codePointAt(n.cursor+1)!==C&&n.source.codePointAt(n.cursor+1)!==R||!isDigitCodePoint(n.source.codePointAt(n.cursor+2)))return o;n.advanceCodePoint(3)}for(o=exports.NumberType.Number;isDigitCodePoint(n.source.codePointAt(n.cursor));)n.advanceCodePoint()}return o}function consumeNumericToken(e,n){let o;{const e=n.source.codePointAt(n.cursor);e===C?o="-":e===R&&(o="+")}const t=consumeNumber(0,n),r=parseFloat(n.source.slice(n.representationStart,n.representationEnd+1));if(checkIfThreeCodePointsWouldStartAnIdentSequence(0,n)){const s=consumeIdentSequence(e,n);return[exports.TokenType.Dimension,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:r,signCharacter:o,type:t,unit:String.fromCodePoint(...s)}]}return n.source.codePointAt(n.cursor)===O?(n.advanceCodePoint(),[exports.TokenType.Percentage,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:r,signCharacter:o}]):[exports.TokenType.Number,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:r,signCharacter:o,type:t}]}function consumeWhiteSpace(e){for(;isWhitespace(e.source.codePointAt(e.cursor));)e.advanceCodePoint();return[exports.TokenType.Whitespace,e.source.slice(e.representationStart,e.representationEnd+1),e.representationStart,e.representationEnd,void 0]}function consumeStringToken(n,o){let t="";const r=o.readCodePoint();for(;;){const i=o.readCodePoint();if(void 0===i){const r=[exports.TokenType.String,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:t}];return n.onParseError(new ParseErrorWithToken(e.UnexpectedEOFInString,o.representationStart,o.representationEnd,["4.3.5. Consume a string token","Unexpected EOF"],r)),r}if(isNewLine(i)){o.unreadCodePoint();const t=[exports.TokenType.BadString,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0];return n.onParseError(new ParseErrorWithToken(e.UnexpectedNewLineInString,o.representationStart,o.source.codePointAt(o.cursor)===s&&o.source.codePointAt(o.cursor+1)===y?o.representationEnd+2:o.representationEnd+1,["4.3.5. Consume a string token","Unexpected newline"],t)),t}if(i===r)return[exports.TokenType.String,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:t}];if(i!==L)t+=String.fromCodePoint(i);else{if(void 0===o.source.codePointAt(o.cursor))continue;if(isNewLine(o.source.codePointAt(o.cursor))){o.source.codePointAt(o.cursor)===s&&o.source.codePointAt(o.cursor+1)===y&&o.advanceCodePoint(),o.advanceCodePoint();continue}t+=String.fromCodePoint(consumeEscapedCodePoint(n,o))}}}function checkIfCodePointsMatchURLIdent(e){return!(3!==e.length||e[0]!==V&&e[0]!==z||e[1]!==K&&e[1]!==M||e[2]!==$&&e[2]!==J)}function consumeBadURL(e,n){for(;;){const o=n.source.codePointAt(n.cursor);if(void 0===o)return;if(o===N)return void n.advanceCodePoint();checkIfTwoCodePointsAreAValidEscape(n)?(n.advanceCodePoint(),consumeEscapedCodePoint(e,n)):n.advanceCodePoint()}}function consumeUrlToken(n,t){for(;isWhitespace(t.source.codePointAt(t.cursor));)t.advanceCodePoint();let s="";for(;;){if(void 0===t.source.codePointAt(t.cursor)){const o=[exports.TokenType.URL,t.source.slice(t.representationStart,t.representationEnd+1),t.representationStart,t.representationEnd,{value:s}];return n.onParseError(new ParseErrorWithToken(e.UnexpectedEOFInURL,t.representationStart,t.representationEnd,["4.3.6. Consume a url token","Unexpected EOF"],o)),o}if(t.source.codePointAt(t.cursor)===N)return t.advanceCodePoint(),[exports.TokenType.URL,t.source.slice(t.representationStart,t.representationEnd+1),t.representationStart,t.representationEnd,{value:s}];if(isWhitespace(t.source.codePointAt(t.cursor))){for(t.advanceCodePoint();isWhitespace(t.source.codePointAt(t.cursor));)t.advanceCodePoint();if(void 0===t.source.codePointAt(t.cursor)){const o=[exports.TokenType.URL,t.source.slice(t.representationStart,t.representationEnd+1),t.representationStart,t.representationEnd,{value:s}];return n.onParseError(new ParseErrorWithToken(e.UnexpectedEOFInURL,t.representationStart,t.representationEnd,["4.3.6. Consume a url token","Consume as much whitespace as possible","Unexpected EOF"],o)),o}return t.source.codePointAt(t.cursor)===N?(t.advanceCodePoint(),[exports.TokenType.URL,t.source.slice(t.representationStart,t.representationEnd+1),t.representationStart,t.representationEnd,{value:s}]):(consumeBadURL(n,t),[exports.TokenType.BadURL,t.source.slice(t.representationStart,t.representationEnd+1),t.representationStart,t.representationEnd,void 0])}const c=t.source.codePointAt(t.cursor);if(c===D||c===o||c===m||void 0!==(i=c)&&(i===v||i===d||I<=i&&i<=r||b<=i&&i<=l)){consumeBadURL(n,t);const o=[exports.TokenType.BadURL,t.source.slice(t.representationStart,t.representationEnd+1),t.representationStart,t.representationEnd,void 0];return n.onParseError(new ParseErrorWithToken(e.UnexpectedCharacterInURL,t.representationStart,t.representationEnd,["4.3.6. Consume a url token","Unexpected U+0022 QUOTATION MARK (\"), U+0027 APOSTROPHE ('), U+0028 LEFT PARENTHESIS (() or non-printable code point"],o)),o}if(c===L){if(checkIfTwoCodePointsAreAValidEscape(t)){t.advanceCodePoint(),s+=String.fromCodePoint(consumeEscapedCodePoint(n,t));continue}consumeBadURL(n,t);const o=[exports.TokenType.BadURL,t.source.slice(t.representationStart,t.representationEnd+1),t.representationStart,t.representationEnd,void 0];return n.onParseError(new ParseErrorWithToken(e.InvalidEscapeSequenceInURL,t.representationStart,t.representationEnd,["4.3.6. Consume a url token","U+005C REVERSE SOLIDUS (\\)","The input stream does not start with a valid escape sequence"],o)),o}s+=t.source[t.cursor],t.advanceCodePoint()}var i}function consumeIdentLikeToken(e,n){const t=consumeIdentSequence(e,n);if(n.source.codePointAt(n.cursor)!==m)return[exports.TokenType.Ident,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:String.fromCodePoint(...t)}];if(checkIfCodePointsMatchURLIdent(t)){n.advanceCodePoint();let r=0;for(;;){const e=isWhitespace(n.source.codePointAt(n.cursor)),s=isWhitespace(n.source.codePointAt(n.cursor+1));if(e&&s){r+=1,n.advanceCodePoint(1);continue}const i=e?n.source.codePointAt(n.cursor+1):n.source.codePointAt(n.cursor);if(i===D||i===o)return r>0&&n.unreadCodePoint(r),[exports.TokenType.Function,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:String.fromCodePoint(...t)}];break}return consumeUrlToken(e,n)}return n.advanceCodePoint(),[exports.TokenType.Function,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:String.fromCodePoint(...t)}]}function checkIfThreeCodePointsWouldStartAUnicodeRange(e){return!(e.source.codePointAt(e.cursor)!==V&&e.source.codePointAt(e.cursor)!==z||e.source.codePointAt(e.cursor+1)!==R||e.source.codePointAt(e.cursor+2)!==_&&!isHexDigitCodePoint(e.source.codePointAt(e.cursor+2)))}function consumeUnicodeRangeToken(e,n){n.advanceCodePoint(2);const o=[],t=[];let r;for(;void 0!==(r=n.source.codePointAt(n.cursor))&&o.length<6&&isHexDigitCodePoint(r);)o.push(r),n.advanceCodePoint();for(;void 0!==(r=n.source.codePointAt(n.cursor))&&o.length<6&&r===_;)0===t.length&&t.push(...o),o.push(j),t.push(Q),n.advanceCodePoint();if(!t.length&&n.source.codePointAt(n.cursor)===C&&isHexDigitCodePoint(n.source.codePointAt(n.cursor+1)))for(n.advanceCodePoint();void 0!==(r=n.source.codePointAt(n.cursor))&&t.length<6&&isHexDigitCodePoint(r);)t.push(r),n.advanceCodePoint();if(!t.length){const e=parseInt(String.fromCodePoint(...o),16);return[exports.TokenType.UnicodeRange,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{startOfRange:e,endOfRange:e}]}const s=parseInt(String.fromCodePoint(...o),16),i=parseInt(String.fromCodePoint(...t),16);return[exports.TokenType.UnicodeRange,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{startOfRange:s,endOfRange:i}]}function tokenizer(n,t){const r=n.css.valueOf(),d=n.unicodeRangesAllowed??!1,p=new Reader(r),k={onParseError:t?.onParseError??noop};return{nextToken:function nextToken(){p.resetRepresentation();const n=p.source.codePointAt(p.cursor);if(void 0===n)return[exports.TokenType.EOF,"",-1,-1,void 0];if(n===H&&checkIfTwoCodePointsStartAComment(p))return consumeComment(k,p);if(d&&(n===V||n===z)&&checkIfThreeCodePointsWouldStartAUnicodeRange(p))return consumeUnicodeRangeToken(0,p);if(isIdentStartCodePoint(n))return consumeIdentLikeToken(k,p);if(isDigitCodePoint(n))return consumeNumericToken(k,p);switch(n){case a:return p.advanceCodePoint(),[exports.TokenType.Comma,",",p.representationStart,p.representationEnd,void 0];case c:return p.advanceCodePoint(),[exports.TokenType.Colon,":",p.representationStart,p.representationEnd,void 0];case q:return p.advanceCodePoint(),[exports.TokenType.Semicolon,";",p.representationStart,p.representationEnd,void 0];case m:return p.advanceCodePoint(),[exports.TokenType.OpenParen,"(",p.representationStart,p.representationEnd,void 0];case N:return p.advanceCodePoint(),[exports.TokenType.CloseParen,")",p.representationStart,p.representationEnd,void 0];case E:return p.advanceCodePoint(),[exports.TokenType.OpenSquare,"[",p.representationStart,p.representationEnd,void 0];case F:return p.advanceCodePoint(),[exports.TokenType.CloseSquare,"]",p.representationStart,p.representationEnd,void 0];case S:return p.advanceCodePoint(),[exports.TokenType.OpenCurly,"{",p.representationStart,p.representationEnd,void 0];case W:return p.advanceCodePoint(),[exports.TokenType.CloseCurly,"}",p.representationStart,p.representationEnd,void 0];case o:case D:return consumeStringToken(k,p);case U:return consumeHashToken(k,p);case R:case P:return checkIfThreeCodePointsWouldStartANumber(p)?consumeNumericToken(k,p):(p.advanceCodePoint(),[exports.TokenType.Delim,p.source[p.representationStart],p.representationStart,p.representationEnd,{value:p.source[p.representationStart]}]);case y:case s:case T:case i:case B:return consumeWhiteSpace(p);case C:return checkIfThreeCodePointsWouldStartANumber(p)?consumeNumericToken(k,p):checkIfThreeCodePointsWouldStartCDC(p)?(p.advanceCodePoint(3),[exports.TokenType.CDC,"--\x3e",p.representationStart,p.representationEnd,void 0]):checkIfThreeCodePointsWouldStartAnIdentSequence(0,p)?consumeIdentLikeToken(k,p):(p.advanceCodePoint(),[exports.TokenType.Delim,"-",p.representationStart,p.representationEnd,{value:"-"}]);case h:return checkIfFourCodePointsWouldStartCDO(p)?(p.advanceCodePoint(4),[exports.TokenType.CDO,"\x3c!--",p.representationStart,p.representationEnd,void 0]):(p.advanceCodePoint(),[exports.TokenType.Delim,"<",p.representationStart,p.representationEnd,{value:"<"}]);case u:if(p.advanceCodePoint(),checkIfThreeCodePointsWouldStartAnIdentSequence(0,p)){const e=consumeIdentSequence(k,p);return[exports.TokenType.AtKeyword,p.source.slice(p.representationStart,p.representationEnd+1),p.representationStart,p.representationEnd,{value:String.fromCodePoint(...e)}]}return[exports.TokenType.Delim,"@",p.representationStart,p.representationEnd,{value:"@"}];case L:{if(checkIfTwoCodePointsAreAValidEscape(p))return consumeIdentLikeToken(k,p);p.advanceCodePoint();const n=[exports.TokenType.Delim,"\\",p.representationStart,p.representationEnd,{value:"\\"}];return k.onParseError(new ParseErrorWithToken(e.InvalidEscapeSequenceAfterBackslash,p.representationStart,p.representationEnd,["4.3.1. Consume a token","U+005C REVERSE SOLIDUS (\\)","The input stream does not start with a valid escape sequence"],n)),n}}return p.advanceCodePoint(),[exports.TokenType.Delim,p.source[p.representationStart],p.representationStart,p.representationEnd,{value:p.source[p.representationStart]}]},endOfFile:function endOfFile(){return void 0===p.source.codePointAt(p.cursor)}}}function noop(){}function ensureThatValueRoundTripsAsIdent(e){let n=0;e[0]===C&&e[1]===C?n=2:e[0]===C&&e[1]?(n=2,isIdentStartCodePoint(e[1])||(n+=insertEscapedCodePoint(e,1,e[1]))):isIdentStartCodePoint(e[0])?n=1:(n=1,n+=insertEscapedCodePoint(e,0,e[0]));for(let o=n;o<e.length;o++)isIdentCodePoint(e[o])||(o+=insertEscapedCodePoint(e,o,e[o]));return e}function insertEscapedCodePoint(e,n,o){const t=o.toString(16),r=[];for(const e of t)r.push(e.codePointAt(0));const s=e[n+1];return n===e.length-1||s&&isHexDigitCodePoint(s)?(e.splice(n,1,92,...r,32),1+r.length):(e.splice(n,1,92,...r),r.length)}exports.TokenType=void 0,(G=exports.TokenType||(exports.TokenType={})).Comment="comment",G.AtKeyword="at-keyword-token",G.BadString="bad-string-token",G.BadURL="bad-url-token",G.CDC="CDC-token",G.CDO="CDO-token",G.Colon="colon-token",G.Comma="comma-token",G.Delim="delim-token",G.Dimension="dimension-token",G.EOF="EOF-token",G.Function="function-token",G.Hash="hash-token",G.Ident="ident-token",G.Number="number-token",G.Percentage="percentage-token",G.Semicolon="semicolon-token",G.String="string-token",G.URL="url-token",G.Whitespace="whitespace-token",G.OpenParen="(-token",G.CloseParen=")-token",G.OpenSquare="[-token",G.CloseSquare="]-token",G.OpenCurly="{-token",G.CloseCurly="}-token",G.UnicodeRange="unicode-range-token",exports.NumberType=void 0,(X=exports.NumberType||(exports.NumberType={})).Integer="integer",X.Number="number",exports.HashType=void 0,(Y=exports.HashType||(exports.HashType={})).Unrestricted="unrestricted",Y.ID="id";const Z=Object.values(exports.TokenType);exports.ParseError=ParseError,exports.ParseErrorMessage=e,exports.ParseErrorWithToken=ParseErrorWithToken,exports.Reader=Reader,exports.cloneTokens=function cloneTokens(e){return n?structuredClone(e):JSON.parse(JSON.stringify(e))},exports.isToken=function isToken(e){return!!Array.isArray(e)&&(!(e.length<4)&&(!!Z.includes(e[0])&&("string"==typeof e[1]&&("number"==typeof e[2]&&"number"==typeof e[3]))))},exports.isTokenAtKeyword=function isTokenAtKeyword(e){return!!e&&e[0]===exports.TokenType.AtKeyword},exports.isTokenBadString=function isTokenBadString(e){return!!e&&e[0]===exports.TokenType.BadString},exports.isTokenBadURL=function isTokenBadURL(e){return!!e&&e[0]===exports.TokenType.BadURL},exports.isTokenCDC=function isTokenCDC(e){return!!e&&e[0]===exports.TokenType.CDC},exports.isTokenCDO=function isTokenCDO(e){return!!e&&e[0]===exports.TokenType.CDO},exports.isTokenCloseCurly=function isTokenCloseCurly(e){return!!e&&e[0]===exports.TokenType.CloseCurly},exports.isTokenCloseParen=function isTokenCloseParen(e){return!!e&&e[0]===exports.TokenType.CloseParen},exports.isTokenCloseSquare=function isTokenCloseSquare(e){return!!e&&e[0]===exports.TokenType.CloseSquare},exports.isTokenColon=function isTokenColon(e){return!!e&&e[0]===exports.TokenType.Colon},exports.isTokenComma=function isTokenComma(e){return!!e&&e[0]===exports.TokenType.Comma},exports.isTokenComment=function isTokenComment(e){return!!e&&e[0]===exports.TokenType.Comment},exports.isTokenDelim=function isTokenDelim(e){return!!e&&e[0]===exports.TokenType.Delim},exports.isTokenDimension=function isTokenDimension(e){return!!e&&e[0]===exports.TokenType.Dimension},exports.isTokenEOF=function isTokenEOF(e){return!!e&&e[0]===exports.TokenType.EOF},exports.isTokenFunction=function isTokenFunction(e){return!!e&&e[0]===exports.TokenType.Function},exports.isTokenHash=function isTokenHash(e){return!!e&&e[0]===exports.TokenType.Hash},exports.isTokenIdent=function isTokenIdent(e){return!!e&&e[0]===exports.TokenType.Ident},exports.isTokenNumber=function isTokenNumber(e){return!!e&&e[0]===exports.TokenType.Number},exports.isTokenNumeric=function isTokenNumeric(e){switch(e[0]){case exports.TokenType.Dimension:case exports.TokenType.Number:case exports.TokenType.Percentage:return!0;default:return!1}},exports.isTokenOpenCurly=function isTokenOpenCurly(e){return!!e&&e[0]===exports.TokenType.OpenCurly},exports.isTokenOpenParen=function isTokenOpenParen(e){return!!e&&e[0]===exports.TokenType.OpenParen},exports.isTokenOpenSquare=function isTokenOpenSquare(e){return!!e&&e[0]===exports.TokenType.OpenSquare},exports.isTokenPercentage=function isTokenPercentage(e){return!!e&&e[0]===exports.TokenType.Percentage},exports.isTokenSemicolon=function isTokenSemicolon(e){return!!e&&e[0]===exports.TokenType.Semicolon},exports.isTokenString=function isTokenString(e){return!!e&&e[0]===exports.TokenType.String},exports.isTokenURL=function isTokenURL(e){return!!e&&e[0]===exports.TokenType.URL},exports.isTokenUnicodeRange=function isTokenUnicodeRange(e){return!!e&&e[0]===exports.TokenType.UnicodeRange},exports.isTokenWhiteSpaceOrComment=function isTokenWhiteSpaceOrComment(e){switch(e[0]){case exports.TokenType.Whitespace:case exports.TokenType.Comment:return!0;default:return!1}},exports.isTokenWhitespace=function isTokenWhitespace(e){return!!e&&e[0]===exports.TokenType.Whitespace},exports.mirrorVariant=function mirrorVariant(e){switch(e[0]){case exports.TokenType.OpenParen:return[exports.TokenType.CloseParen,")",-1,-1,void 0];case exports.TokenType.CloseParen:return[exports.TokenType.OpenParen,"(",-1,-1,void 0];case exports.TokenType.OpenCurly:return[exports.TokenType.CloseCurly,"}",-1,-1,void 0];case exports.TokenType.CloseCurly:return[exports.TokenType.OpenCurly,"{",-1,-1,void 0];case exports.TokenType.OpenSquare:return[exports.TokenType.CloseSquare,"]",-1,-1,void 0];case exports.TokenType.CloseSquare:return[exports.TokenType.OpenSquare,"[",-1,-1,void 0];default:return null}},exports.mirrorVariantType=function mirrorVariantType(e){switch(e){case exports.TokenType.OpenParen:return exports.TokenType.CloseParen;case exports.TokenType.CloseParen:return exports.TokenType.OpenParen;case exports.TokenType.OpenCurly:return exports.TokenType.CloseCurly;case exports.TokenType.CloseCurly:return exports.TokenType.OpenCurly;case exports.TokenType.OpenSquare:return exports.TokenType.CloseSquare;case exports.TokenType.CloseSquare:return exports.TokenType.OpenSquare;default:return null}},exports.mutateIdent=function mutateIdent(e,n){const o=[];for(const e of n)o.push(e.codePointAt(0));const t=String.fromCodePoint(...ensureThatValueRoundTripsAsIdent(o));e[1]=t,e[4].value=n},exports.mutateUnit=function mutateUnit(e,n){const o=[];for(const e of n)o.push(e.codePointAt(0));const t=ensureThatValueRoundTripsAsIdent(o);101===t[0]&&insertEscapedCodePoint(t,0,t[0]);const r=String.fromCodePoint(...t),s="+"===e[4].signCharacter?e[4].signCharacter:"",i=e[4].value.toString();e[1]=`${s}${i}${r}`,e[4].unit=n},exports.stringify=function stringify(...e){let n="";for(let o=0;o<e.length;o++)n+=e[o][1];return n},exports.tokenize=function tokenize(e,n){const o=tokenizer(e,n),t=[];{for(;!o.endOfFile();){const e=o.nextToken();e&&t.push(e)}const e=o.nextToken();e&&t.push(e)}return t},exports.tokenizer=tokenizer;
