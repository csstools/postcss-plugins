"use strict";class ParseError extends Error{sourceStart;sourceEnd;parserState;constructor(e,n,o,t){super(e),this.name="ParseError",this.sourceStart=n,this.sourceEnd=o,this.parserState=t}}class ParseErrorWithToken extends ParseError{token;constructor(e,n,o,t,r){super(e,n,o,t),this.token=r}}const e={UnexpectedNewLineInString:"Unexpected newline while consuming a string token.",UnexpectedEOFInString:"Unexpected EOF while consuming a string token.",UnexpectedEOFInComment:"Unexpected EOF while consuming a comment.",UnexpectedEOFInURL:"Unexpected EOF while consuming a url token.",UnexpectedEOFInEscapedCodePoint:"Unexpected EOF while consuming an escaped code point.",UnexpectedCharacterInURL:"Unexpected character while consuming a url token.",InvalidEscapeSequenceInURL:"Invalid escape sequence while consuming a url token.",InvalidEscapeSequenceAfterBackslash:'Invalid escape sequence after "\\"'},n="undefined"!=typeof globalThis&&"structuredClone"in globalThis;const o=13,t=45,r=10,s=43,i=65533;function checkIfFourCodePointsWouldStartCDO(e){return 60===e.source.codePointAt(e.cursor)&&33===e.source.codePointAt(e.cursor+1)&&e.source.codePointAt(e.cursor+2)===t&&e.source.codePointAt(e.cursor+3)===t}function isDigitCodePoint(e){return e>=48&&e<=57}function isUppercaseLetterCodePoint(e){return e>=65&&e<=90}function isLowercaseLetterCodePoint(e){return e>=97&&e<=122}function isHexDigitCodePoint(e){return e>=48&&e<=57||e>=97&&e<=102||e>=65&&e<=70}function isLetterCodePoint(e){return isLowercaseLetterCodePoint(e)||isUppercaseLetterCodePoint(e)}function isIdentStartCodePoint(e){return isLetterCodePoint(e)||isNonASCII_IdentCodePoint(e)||95===e}function isIdentCodePoint(e){return isIdentStartCodePoint(e)||isDigitCodePoint(e)||e===t}function isNonASCII_IdentCodePoint(e){return 183===e||8204===e||8205===e||8255===e||8256===e||8204===e||(192<=e&&e<=214||216<=e&&e<=246||248<=e&&e<=893||895<=e&&e<=8191||8304<=e&&e<=8591||11264<=e&&e<=12271||12289<=e&&e<=55295||63744<=e&&e<=64975||65008<=e&&e<=65533||(0===e||(!!isSurrogate(e)||e>=65536)))}function isNewLine(e){return e===r||e===o||12===e}function isWhitespace(e){return 32===e||e===r||9===e||e===o||12===e}function isSurrogate(e){return e>=55296&&e<=57343}function checkIfTwoCodePointsAreAValidEscape(e){return 92===e.source.codePointAt(e.cursor)&&!isNewLine(e.source.codePointAt(e.cursor+1)??-1)}function checkIfThreeCodePointsWouldStartAnIdentSequence(e,n){return n.source.codePointAt(n.cursor)===t?n.source.codePointAt(n.cursor+1)===t||(!!isIdentStartCodePoint(n.source.codePointAt(n.cursor+1)??-1)||92===n.source.codePointAt(n.cursor+1)&&!isNewLine(n.source.codePointAt(n.cursor+2)??-1)):!!isIdentStartCodePoint(n.source.codePointAt(n.cursor)??-1)||checkIfTwoCodePointsAreAValidEscape(n)}function checkIfThreeCodePointsWouldStartANumber(e){return e.source.codePointAt(e.cursor)===s||e.source.codePointAt(e.cursor)===t?!!isDigitCodePoint(e.source.codePointAt(e.cursor+1)??-1)||46===e.source.codePointAt(e.cursor+1)&&isDigitCodePoint(e.source.codePointAt(e.cursor+2)??-1):46===e.source.codePointAt(e.cursor)?isDigitCodePoint(e.source.codePointAt(e.cursor+1)??-1):isDigitCodePoint(e.source.codePointAt(e.cursor)??-1)}function checkIfTwoCodePointsStartAComment(e){return 47===e.source.codePointAt(e.cursor)&&42===e.source.codePointAt(e.cursor+1)}function checkIfThreeCodePointsWouldStartCDC(e){return e.source.codePointAt(e.cursor)===t&&e.source.codePointAt(e.cursor+1)===t&&62===e.source.codePointAt(e.cursor+2)}var c,a,u;function consumeComment(n,o){for(o.advanceCodePoint(2);;){const t=o.readCodePoint();if(void 0===t){const t=[exports.TokenType.Comment,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0];return n.onParseError(new ParseErrorWithToken(e.UnexpectedEOFInComment,o.representationStart,o.representationEnd,["4.3.2. Consume comments","Unexpected EOF"],t)),t}if(42===t&&(void 0!==o.source.codePointAt(o.cursor)&&47===o.source.codePointAt(o.cursor))){o.advanceCodePoint();break}}return[exports.TokenType.Comment,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0]}function consumeEscapedCodePoint(n,t){const s=t.readCodePoint();if(void 0===s)return n.onParseError(new ParseError(e.UnexpectedEOFInEscapedCodePoint,t.representationStart,t.representationEnd,["4.3.7. Consume an escaped code point","Unexpected EOF"])),i;if(isHexDigitCodePoint(s)){const e=[s];let n;for(;void 0!==(n=t.source.codePointAt(t.cursor))&&isHexDigitCodePoint(n)&&e.length<6;)e.push(n),t.advanceCodePoint();isWhitespace(t.source.codePointAt(t.cursor)??-1)&&(t.source.codePointAt(t.cursor)===o&&t.source.codePointAt(t.cursor+1)===r&&t.advanceCodePoint(),t.advanceCodePoint());const c=parseInt(String.fromCodePoint(...e),16);return 0===c||isSurrogate(c)||c>1114111?i:c}return 0===s||isSurrogate(s)?i:s}function consumeIdentSequence(e,n){const o=[];for(;;){const t=n.source.codePointAt(n.cursor)??-1;if(0===t||isSurrogate(t))o.push(i),n.advanceCodePoint(+(t>65535)+1);else if(isIdentCodePoint(t))o.push(t),n.advanceCodePoint(+(t>65535)+1);else{if(!checkIfTwoCodePointsAreAValidEscape(n))return o;n.advanceCodePoint(),o.push(consumeEscapedCodePoint(e,n))}}}function consumeHashToken(e,n){n.advanceCodePoint();const o=n.source.codePointAt(n.cursor);if(void 0!==o&&(isIdentCodePoint(o)||checkIfTwoCodePointsAreAValidEscape(n))){let o=exports.HashType.Unrestricted;checkIfThreeCodePointsWouldStartAnIdentSequence(0,n)&&(o=exports.HashType.ID);const t=consumeIdentSequence(e,n);return[exports.TokenType.Hash,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:String.fromCodePoint(...t),type:o}]}return[exports.TokenType.Delim,"#",n.representationStart,n.representationEnd,{value:"#"}]}function consumeNumber(e,n){let o=exports.NumberType.Integer;for(n.source.codePointAt(n.cursor)!==s&&n.source.codePointAt(n.cursor)!==t||n.advanceCodePoint();isDigitCodePoint(n.source.codePointAt(n.cursor)??-1);)n.advanceCodePoint();if(46===n.source.codePointAt(n.cursor)&&isDigitCodePoint(n.source.codePointAt(n.cursor+1)??-1))for(n.advanceCodePoint(2),o=exports.NumberType.Number;isDigitCodePoint(n.source.codePointAt(n.cursor)??-1);)n.advanceCodePoint();if(101===n.source.codePointAt(n.cursor)||69===n.source.codePointAt(n.cursor)){if(isDigitCodePoint(n.source.codePointAt(n.cursor+1)??-1))n.advanceCodePoint(2);else{if(n.source.codePointAt(n.cursor+1)!==t&&n.source.codePointAt(n.cursor+1)!==s||!isDigitCodePoint(n.source.codePointAt(n.cursor+2)??-1))return o;n.advanceCodePoint(3)}for(o=exports.NumberType.Number;isDigitCodePoint(n.source.codePointAt(n.cursor)??-1);)n.advanceCodePoint()}return o}function consumeNumericToken(e,n){let o;{const e=n.source.codePointAt(n.cursor);e===t?o="-":e===s&&(o="+")}const r=consumeNumber(0,n),i=parseFloat(n.source.slice(n.representationStart,n.representationEnd+1));if(checkIfThreeCodePointsWouldStartAnIdentSequence(0,n)){const t=consumeIdentSequence(e,n);return[exports.TokenType.Dimension,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:i,signCharacter:o,type:r,unit:String.fromCodePoint(...t)}]}return 37===n.source.codePointAt(n.cursor)?(n.advanceCodePoint(),[exports.TokenType.Percentage,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:i,signCharacter:o}]):[exports.TokenType.Number,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:i,signCharacter:o,type:r}]}function consumeWhiteSpace(e){for(;isWhitespace(e.source.codePointAt(e.cursor)??-1);)e.advanceCodePoint();return[exports.TokenType.Whitespace,e.source.slice(e.representationStart,e.representationEnd+1),e.representationStart,e.representationEnd,void 0]}exports.TokenType=void 0,(c=exports.TokenType||(exports.TokenType={})).Comment="comment",c.AtKeyword="at-keyword-token",c.BadString="bad-string-token",c.BadURL="bad-url-token",c.CDC="CDC-token",c.CDO="CDO-token",c.Colon="colon-token",c.Comma="comma-token",c.Delim="delim-token",c.Dimension="dimension-token",c.EOF="EOF-token",c.Function="function-token",c.Hash="hash-token",c.Ident="ident-token",c.Number="number-token",c.Percentage="percentage-token",c.Semicolon="semicolon-token",c.String="string-token",c.URL="url-token",c.Whitespace="whitespace-token",c.OpenParen="(-token",c.CloseParen=")-token",c.OpenSquare="[-token",c.CloseSquare="]-token",c.OpenCurly="{-token",c.CloseCurly="}-token",c.UnicodeRange="unicode-range-token",exports.NumberType=void 0,(a=exports.NumberType||(exports.NumberType={})).Integer="integer",a.Number="number",exports.HashType=void 0,(u=exports.HashType||(exports.HashType={})).Unrestricted="unrestricted",u.ID="id";class Reader{cursor=0;source="";representationStart=0;representationEnd=-1;constructor(e){this.source=e}advanceCodePoint(e=1){this.cursor=this.cursor+e,this.representationEnd=this.cursor-1}readCodePoint(){const e=this.source.codePointAt(this.cursor);if(void 0!==e)return this.cursor=this.cursor+1,this.representationEnd=this.cursor-1,e}unreadCodePoint(e=1){this.cursor=this.cursor-e,this.representationEnd=this.cursor-1}resetRepresentation(){this.representationStart=this.cursor,this.representationEnd=-1}}function consumeStringToken(n,t){let s="";const c=t.readCodePoint();for(;;){const a=t.readCodePoint();if(void 0===a){const o=[exports.TokenType.String,t.source.slice(t.representationStart,t.representationEnd+1),t.representationStart,t.representationEnd,{value:s}];return n.onParseError(new ParseErrorWithToken(e.UnexpectedEOFInString,t.representationStart,t.representationEnd,["4.3.5. Consume a string token","Unexpected EOF"],o)),o}if(isNewLine(a)){t.unreadCodePoint();const s=[exports.TokenType.BadString,t.source.slice(t.representationStart,t.representationEnd+1),t.representationStart,t.representationEnd,void 0];return n.onParseError(new ParseErrorWithToken(e.UnexpectedNewLineInString,t.representationStart,t.source.codePointAt(t.cursor)===o&&t.source.codePointAt(t.cursor+1)===r?t.representationEnd+2:t.representationEnd+1,["4.3.5. Consume a string token","Unexpected newline"],s)),s}if(a===c)return[exports.TokenType.String,t.source.slice(t.representationStart,t.representationEnd+1),t.representationStart,t.representationEnd,{value:s}];if(92!==a)0===a||isSurrogate(a)?s+=String.fromCodePoint(i):s+=String.fromCodePoint(a);else{if(void 0===t.source.codePointAt(t.cursor))continue;if(isNewLine(t.source.codePointAt(t.cursor)??-1)){t.source.codePointAt(t.cursor)===o&&t.source.codePointAt(t.cursor+1)===r&&t.advanceCodePoint(),t.advanceCodePoint();continue}s+=String.fromCodePoint(consumeEscapedCodePoint(n,t))}}}function checkIfCodePointsMatchURLIdent(e){return!(3!==e.length||117!==e[0]&&85!==e[0]||114!==e[1]&&82!==e[1]||108!==e[2]&&76!==e[2])}function consumeBadURL(e,n){for(;;){const o=n.source.codePointAt(n.cursor);if(void 0===o)return;if(41===o)return void n.advanceCodePoint();checkIfTwoCodePointsAreAValidEscape(n)?(n.advanceCodePoint(),consumeEscapedCodePoint(e,n)):n.advanceCodePoint()}}function consumeUrlToken(n,o){for(;isWhitespace(o.source.codePointAt(o.cursor)??-1);)o.advanceCodePoint();let t="";for(;;){if(void 0===o.source.codePointAt(o.cursor)){const r=[exports.TokenType.URL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:t}];return n.onParseError(new ParseErrorWithToken(e.UnexpectedEOFInURL,o.representationStart,o.representationEnd,["4.3.6. Consume a url token","Unexpected EOF"],r)),r}if(41===o.source.codePointAt(o.cursor))return o.advanceCodePoint(),[exports.TokenType.URL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:t}];if(isWhitespace(o.source.codePointAt(o.cursor)??-1)){for(o.advanceCodePoint();isWhitespace(o.source.codePointAt(o.cursor)??-1);)o.advanceCodePoint();if(void 0===o.source.codePointAt(o.cursor)){const r=[exports.TokenType.URL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:t}];return n.onParseError(new ParseErrorWithToken(e.UnexpectedEOFInURL,o.representationStart,o.representationEnd,["4.3.6. Consume a url token","Consume as much whitespace as possible","Unexpected EOF"],r)),r}return 41===o.source.codePointAt(o.cursor)?(o.advanceCodePoint(),[exports.TokenType.URL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:t}]):(consumeBadURL(n,o),[exports.TokenType.BadURL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0])}const s=o.source.codePointAt(o.cursor);if(34===s||39===s||40===s||(11===(r=s??-1)||127===r||0<=r&&r<=8||14<=r&&r<=31)){consumeBadURL(n,o);const t=[exports.TokenType.BadURL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0];return n.onParseError(new ParseErrorWithToken(e.UnexpectedCharacterInURL,o.representationStart,o.representationEnd,["4.3.6. Consume a url token","Unexpected U+0022 QUOTATION MARK (\"), U+0027 APOSTROPHE ('), U+0028 LEFT PARENTHESIS (() or non-printable code point"],t)),t}if(92===s){if(checkIfTwoCodePointsAreAValidEscape(o)){o.advanceCodePoint(),t+=String.fromCodePoint(consumeEscapedCodePoint(n,o));continue}consumeBadURL(n,o);const r=[exports.TokenType.BadURL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0];return n.onParseError(new ParseErrorWithToken(e.InvalidEscapeSequenceInURL,o.representationStart,o.representationEnd,["4.3.6. Consume a url token","U+005C REVERSE SOLIDUS (\\)","The input stream does not start with a valid escape sequence"],r)),r}0===o.source.codePointAt(o.cursor)||isSurrogate(o.source.codePointAt(o.cursor)??-1)?(t+=String.fromCodePoint(i),o.advanceCodePoint()):(t+=o.source[o.cursor],o.advanceCodePoint())}var r}function consumeIdentLikeToken(e,n){const o=consumeIdentSequence(e,n);if(40!==n.source.codePointAt(n.cursor))return[exports.TokenType.Ident,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:String.fromCodePoint(...o)}];if(checkIfCodePointsMatchURLIdent(o)){n.advanceCodePoint();let t=0;for(;;){const e=isWhitespace(n.source.codePointAt(n.cursor)??-1),r=isWhitespace(n.source.codePointAt(n.cursor+1)??-1);if(e&&r){t+=1,n.advanceCodePoint(1);continue}const s=e?n.source.codePointAt(n.cursor+1):n.source.codePointAt(n.cursor);if(34===s||39===s)return t>0&&n.unreadCodePoint(t),[exports.TokenType.Function,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:String.fromCodePoint(...o)}];break}return consumeUrlToken(e,n)}return n.advanceCodePoint(),[exports.TokenType.Function,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:String.fromCodePoint(...o)}]}function checkIfThreeCodePointsWouldStartAUnicodeRange(e){return!(117!==e.source.codePointAt(e.cursor)&&85!==e.source.codePointAt(e.cursor)||e.source.codePointAt(e.cursor+1)!==s||63!==e.source.codePointAt(e.cursor+2)&&!isHexDigitCodePoint(e.source.codePointAt(e.cursor+2)??-1))}function consumeUnicodeRangeToken(e,n){n.advanceCodePoint(2);const o=[],r=[];let s;for(;void 0!==(s=n.source.codePointAt(n.cursor))&&o.length<6&&isHexDigitCodePoint(s);)o.push(s),n.advanceCodePoint();for(;void 0!==(s=n.source.codePointAt(n.cursor))&&o.length<6&&63===s;)0===r.length&&r.push(...o),o.push(48),r.push(70),n.advanceCodePoint();if(!r.length&&n.source.codePointAt(n.cursor)===t&&isHexDigitCodePoint(n.source.codePointAt(n.cursor+1)??-1))for(n.advanceCodePoint();void 0!==(s=n.source.codePointAt(n.cursor))&&r.length<6&&isHexDigitCodePoint(s);)r.push(s),n.advanceCodePoint();if(!r.length){const e=parseInt(String.fromCodePoint(...o),16);return[exports.TokenType.UnicodeRange,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{startOfRange:e,endOfRange:e}]}const i=parseInt(String.fromCodePoint(...o),16),c=parseInt(String.fromCodePoint(...r),16);return[exports.TokenType.UnicodeRange,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{startOfRange:i,endOfRange:c}]}function tokenizer(n,i){const c=n.css.valueOf(),a=n.unicodeRangesAllowed??!1,u=new Reader(c),d={onParseError:i?.onParseError??noop};return{nextToken:function nextToken(){u.resetRepresentation();const n=u.source.codePointAt(u.cursor);if(void 0===n)return[exports.TokenType.EOF,"",-1,-1,void 0];if(47===n&&checkIfTwoCodePointsStartAComment(u))return consumeComment(d,u);if(a&&(117===n||85===n)&&checkIfThreeCodePointsWouldStartAUnicodeRange(u))return consumeUnicodeRangeToken(0,u);if(isIdentStartCodePoint(n))return consumeIdentLikeToken(d,u);if(isDigitCodePoint(n))return consumeNumericToken(d,u);switch(n){case 44:return u.advanceCodePoint(),[exports.TokenType.Comma,",",u.representationStart,u.representationEnd,void 0];case 58:return u.advanceCodePoint(),[exports.TokenType.Colon,":",u.representationStart,u.representationEnd,void 0];case 59:return u.advanceCodePoint(),[exports.TokenType.Semicolon,";",u.representationStart,u.representationEnd,void 0];case 40:return u.advanceCodePoint(),[exports.TokenType.OpenParen,"(",u.representationStart,u.representationEnd,void 0];case 41:return u.advanceCodePoint(),[exports.TokenType.CloseParen,")",u.representationStart,u.representationEnd,void 0];case 91:return u.advanceCodePoint(),[exports.TokenType.OpenSquare,"[",u.representationStart,u.representationEnd,void 0];case 93:return u.advanceCodePoint(),[exports.TokenType.CloseSquare,"]",u.representationStart,u.representationEnd,void 0];case 123:return u.advanceCodePoint(),[exports.TokenType.OpenCurly,"{",u.representationStart,u.representationEnd,void 0];case 125:return u.advanceCodePoint(),[exports.TokenType.CloseCurly,"}",u.representationStart,u.representationEnd,void 0];case 39:case 34:return consumeStringToken(d,u);case 35:return consumeHashToken(d,u);case s:case 46:return checkIfThreeCodePointsWouldStartANumber(u)?consumeNumericToken(d,u):(u.advanceCodePoint(),[exports.TokenType.Delim,u.source[u.representationStart],u.representationStart,u.representationEnd,{value:u.source[u.representationStart]}]);case r:case o:case 12:case 9:case 32:return consumeWhiteSpace(u);case t:return checkIfThreeCodePointsWouldStartANumber(u)?consumeNumericToken(d,u):checkIfThreeCodePointsWouldStartCDC(u)?(u.advanceCodePoint(3),[exports.TokenType.CDC,"--\x3e",u.representationStart,u.representationEnd,void 0]):checkIfThreeCodePointsWouldStartAnIdentSequence(0,u)?consumeIdentLikeToken(d,u):(u.advanceCodePoint(),[exports.TokenType.Delim,"-",u.representationStart,u.representationEnd,{value:"-"}]);case 60:return checkIfFourCodePointsWouldStartCDO(u)?(u.advanceCodePoint(4),[exports.TokenType.CDO,"\x3c!--",u.representationStart,u.representationEnd,void 0]):(u.advanceCodePoint(),[exports.TokenType.Delim,"<",u.representationStart,u.representationEnd,{value:"<"}]);case 64:if(u.advanceCodePoint(),checkIfThreeCodePointsWouldStartAnIdentSequence(0,u)){const e=consumeIdentSequence(d,u);return[exports.TokenType.AtKeyword,u.source.slice(u.representationStart,u.representationEnd+1),u.representationStart,u.representationEnd,{value:String.fromCodePoint(...e)}]}return[exports.TokenType.Delim,"@",u.representationStart,u.representationEnd,{value:"@"}];case 92:{if(checkIfTwoCodePointsAreAValidEscape(u))return consumeIdentLikeToken(d,u);u.advanceCodePoint();const n=[exports.TokenType.Delim,"\\",u.representationStart,u.representationEnd,{value:"\\"}];return d.onParseError(new ParseErrorWithToken(e.InvalidEscapeSequenceAfterBackslash,u.representationStart,u.representationEnd,["4.3.1. Consume a token","U+005C REVERSE SOLIDUS (\\)","The input stream does not start with a valid escape sequence"],n)),n}}return u.advanceCodePoint(),[exports.TokenType.Delim,u.source[u.representationStart],u.representationStart,u.representationEnd,{value:u.source[u.representationStart]}]},endOfFile:function endOfFile(){return void 0===u.source.codePointAt(u.cursor)}}}function noop(){}function ensureThatValueRoundTripsAsIdent(e){let n=0;e[0]===t&&e[1]===t?n=2:e[0]===t&&e[1]?(n=2,isIdentStartCodePoint(e[1])||(n+=insertEscapedCodePoint(e,1,e[1]))):isIdentStartCodePoint(e[0])?n=1:(n=1,n+=insertEscapedCodePoint(e,0,e[0]));for(let o=n;o<e.length;o++)isIdentCodePoint(e[o])||(o+=insertEscapedCodePoint(e,o,e[o]));return e}function insertEscapedCodePoint(e,n,o){const t=o.toString(16),r=[];for(const e of t)r.push(e.codePointAt(0));const s=e[n+1];return n===e.length-1||s&&isHexDigitCodePoint(s)?(e.splice(n,1,92,...r,32),1+r.length):(e.splice(n,1,92,...r),r.length)}const d=Object.values(exports.TokenType);exports.ParseError=ParseError,exports.ParseErrorMessage=e,exports.ParseErrorWithToken=ParseErrorWithToken,exports.cloneTokens=function cloneTokens(e){return n?structuredClone(e):JSON.parse(JSON.stringify(e))},exports.isToken=function isToken(e){return!!Array.isArray(e)&&(!(e.length<4)&&(!!d.includes(e[0])&&("string"==typeof e[1]&&("number"==typeof e[2]&&"number"==typeof e[3]))))},exports.isTokenAtKeyword=function isTokenAtKeyword(e){return!!e&&e[0]===exports.TokenType.AtKeyword},exports.isTokenBadString=function isTokenBadString(e){return!!e&&e[0]===exports.TokenType.BadString},exports.isTokenBadURL=function isTokenBadURL(e){return!!e&&e[0]===exports.TokenType.BadURL},exports.isTokenCDC=function isTokenCDC(e){return!!e&&e[0]===exports.TokenType.CDC},exports.isTokenCDO=function isTokenCDO(e){return!!e&&e[0]===exports.TokenType.CDO},exports.isTokenCloseCurly=function isTokenCloseCurly(e){return!!e&&e[0]===exports.TokenType.CloseCurly},exports.isTokenCloseParen=function isTokenCloseParen(e){return!!e&&e[0]===exports.TokenType.CloseParen},exports.isTokenCloseSquare=function isTokenCloseSquare(e){return!!e&&e[0]===exports.TokenType.CloseSquare},exports.isTokenColon=function isTokenColon(e){return!!e&&e[0]===exports.TokenType.Colon},exports.isTokenComma=function isTokenComma(e){return!!e&&e[0]===exports.TokenType.Comma},exports.isTokenComment=function isTokenComment(e){return!!e&&e[0]===exports.TokenType.Comment},exports.isTokenDelim=function isTokenDelim(e){return!!e&&e[0]===exports.TokenType.Delim},exports.isTokenDimension=function isTokenDimension(e){return!!e&&e[0]===exports.TokenType.Dimension},exports.isTokenEOF=function isTokenEOF(e){return!!e&&e[0]===exports.TokenType.EOF},exports.isTokenFunction=function isTokenFunction(e){return!!e&&e[0]===exports.TokenType.Function},exports.isTokenHash=function isTokenHash(e){return!!e&&e[0]===exports.TokenType.Hash},exports.isTokenIdent=function isTokenIdent(e){return!!e&&e[0]===exports.TokenType.Ident},exports.isTokenNumber=function isTokenNumber(e){return!!e&&e[0]===exports.TokenType.Number},exports.isTokenNumeric=function isTokenNumeric(e){if(!e)return!1;switch(e[0]){case exports.TokenType.Dimension:case exports.TokenType.Number:case exports.TokenType.Percentage:return!0;default:return!1}},exports.isTokenOpenCurly=function isTokenOpenCurly(e){return!!e&&e[0]===exports.TokenType.OpenCurly},exports.isTokenOpenParen=function isTokenOpenParen(e){return!!e&&e[0]===exports.TokenType.OpenParen},exports.isTokenOpenSquare=function isTokenOpenSquare(e){return!!e&&e[0]===exports.TokenType.OpenSquare},exports.isTokenPercentage=function isTokenPercentage(e){return!!e&&e[0]===exports.TokenType.Percentage},exports.isTokenSemicolon=function isTokenSemicolon(e){return!!e&&e[0]===exports.TokenType.Semicolon},exports.isTokenString=function isTokenString(e){return!!e&&e[0]===exports.TokenType.String},exports.isTokenURL=function isTokenURL(e){return!!e&&e[0]===exports.TokenType.URL},exports.isTokenUnicodeRange=function isTokenUnicodeRange(e){return!!e&&e[0]===exports.TokenType.UnicodeRange},exports.isTokenWhiteSpaceOrComment=function isTokenWhiteSpaceOrComment(e){if(!e)return!1;switch(e[0]){case exports.TokenType.Whitespace:case exports.TokenType.Comment:return!0;default:return!1}},exports.isTokenWhitespace=function isTokenWhitespace(e){return!!e&&e[0]===exports.TokenType.Whitespace},exports.mirrorVariant=function mirrorVariant(e){switch(e[0]){case exports.TokenType.OpenParen:return[exports.TokenType.CloseParen,")",-1,-1,void 0];case exports.TokenType.CloseParen:return[exports.TokenType.OpenParen,"(",-1,-1,void 0];case exports.TokenType.OpenCurly:return[exports.TokenType.CloseCurly,"}",-1,-1,void 0];case exports.TokenType.CloseCurly:return[exports.TokenType.OpenCurly,"{",-1,-1,void 0];case exports.TokenType.OpenSquare:return[exports.TokenType.CloseSquare,"]",-1,-1,void 0];case exports.TokenType.CloseSquare:return[exports.TokenType.OpenSquare,"[",-1,-1,void 0];default:return null}},exports.mirrorVariantType=function mirrorVariantType(e){switch(e){case exports.TokenType.OpenParen:return exports.TokenType.CloseParen;case exports.TokenType.CloseParen:return exports.TokenType.OpenParen;case exports.TokenType.OpenCurly:return exports.TokenType.CloseCurly;case exports.TokenType.CloseCurly:return exports.TokenType.OpenCurly;case exports.TokenType.OpenSquare:return exports.TokenType.CloseSquare;case exports.TokenType.CloseSquare:return exports.TokenType.OpenSquare;default:return null}},exports.mutateIdent=function mutateIdent(e,n){const o=[];for(const e of n)o.push(e.codePointAt(0));const t=String.fromCodePoint(...ensureThatValueRoundTripsAsIdent(o));e[1]=t,e[4].value=n},exports.mutateUnit=function mutateUnit(e,n){const o=[];for(const e of n)o.push(e.codePointAt(0));const t=ensureThatValueRoundTripsAsIdent(o);101===t[0]&&insertEscapedCodePoint(t,0,t[0]);const r=String.fromCodePoint(...t),s="+"===e[4].signCharacter?e[4].signCharacter:"",i=e[4].value.toString();e[1]=`${s}${i}${r}`,e[4].unit=n},exports.stringify=function stringify(...e){let n="";for(let o=0;o<e.length;o++)n+=e[o][1];return n},exports.tokenize=function tokenize(e,n){const o=tokenizer(e,n),t=[];for(;!o.endOfFile();)t.push(o.nextToken());return t.push(o.nextToken()),t},exports.tokenizer=tokenizer;
