"use strict";class ParseError extends Error{sourceStart;sourceEnd;parserState;constructor(e,o,n,t){super(e),this.name="ParseError",this.sourceStart=o,this.sourceEnd=n,this.parserState=t}}class ParseErrorWithToken extends ParseError{token;constructor(e,o,n,t,r){super(e,o,n,t),this.token=r}}const e={UnexpectedNewLineInString:"Unexpected newline while consuming a string token.",UnexpectedEOFInString:"Unexpected EOF while consuming a string token.",UnexpectedEOFInComment:"Unexpected EOF while consuming a comment.",UnexpectedEOFInURL:"Unexpected EOF while consuming a url token.",UnexpectedEOFInEscapedCodePoint:"Unexpected EOF while consuming an escaped code point.",UnexpectedCharacterInURL:"Unexpected character while consuming a url token.",InvalidEscapeSequenceInURL:"Invalid escape sequence while consuming a url token.",InvalidEscapeSequenceAfterBackslash:'Invalid escape sequence after "\\"'},o="undefined"!=typeof globalThis&&"structuredClone"in globalThis;const n=13,t=46,r=45,s=10,i=43,c=65533;function checkIfFourCodePointsWouldStartCDO(e){return 60===e.source.codePointAt(e.cursor)&&33===e.source.codePointAt(e.cursor+1)&&e.source.codePointAt(e.cursor+2)===r&&e.source.codePointAt(e.cursor+3)===r}function isDigitCodePoint(e){return e>=48&&e<=57}function isUppercaseLetterCodePoint(e){return e>=65&&e<=90}function isLowercaseLetterCodePoint(e){return e>=97&&e<=122}function isHexDigitCodePoint(e){return e>=48&&e<=57||e>=97&&e<=102||e>=65&&e<=70}function isLetterCodePoint(e){return isLowercaseLetterCodePoint(e)||isUppercaseLetterCodePoint(e)}function isIdentStartCodePoint(e){return isLetterCodePoint(e)||isNonASCII_IdentCodePoint(e)||95===e}function isIdentCodePoint(e){return isIdentStartCodePoint(e)||isDigitCodePoint(e)||e===r}function isNonASCII_IdentCodePoint(e){return 183===e||8204===e||8205===e||8255===e||8256===e||8204===e||(192<=e&&e<=214||216<=e&&e<=246||248<=e&&e<=893||895<=e&&e<=8191||8304<=e&&e<=8591||11264<=e&&e<=12271||12289<=e&&e<=55295||63744<=e&&e<=64975||65008<=e&&e<=65533||(0===e||(!!isSurrogate(e)||e>=65536)))}function isNewLine(e){return e===s||e===n||12===e}function isWhitespace(e){return 32===e||e===s||9===e||e===n||12===e}function isSurrogate(e){return e>=55296&&e<=57343}function checkIfTwoCodePointsAreAValidEscape(e){return 92===e.source.codePointAt(e.cursor)&&!isNewLine(e.source.codePointAt(e.cursor+1)??-1)}function checkIfThreeCodePointsWouldStartAnIdentSequence(e,o){return o.source.codePointAt(o.cursor)===r?o.source.codePointAt(o.cursor+1)===r||(!!isIdentStartCodePoint(o.source.codePointAt(o.cursor+1)??-1)||92===o.source.codePointAt(o.cursor+1)&&!isNewLine(o.source.codePointAt(o.cursor+2)??-1)):!!isIdentStartCodePoint(o.source.codePointAt(o.cursor)??-1)||checkIfTwoCodePointsAreAValidEscape(o)}function checkIfThreeCodePointsWouldStartANumber(e){return e.source.codePointAt(e.cursor)===i||e.source.codePointAt(e.cursor)===r?!!isDigitCodePoint(e.source.codePointAt(e.cursor+1)??-1)||e.source.codePointAt(e.cursor+1)===t&&isDigitCodePoint(e.source.codePointAt(e.cursor+2)??-1):e.source.codePointAt(e.cursor)===t?isDigitCodePoint(e.source.codePointAt(e.cursor+1)??-1):isDigitCodePoint(e.source.codePointAt(e.cursor)??-1)}function checkIfTwoCodePointsStartAComment(e){return 47===e.source.codePointAt(e.cursor)&&42===e.source.codePointAt(e.cursor+1)}function checkIfThreeCodePointsWouldStartCDC(e){return e.source.codePointAt(e.cursor)===r&&e.source.codePointAt(e.cursor+1)===r&&62===e.source.codePointAt(e.cursor+2)}var a,u,d;function consumeComment(o,n){for(n.advanceCodePoint(2);;){const t=n.readCodePoint();if(void 0===t){const t=[exports.TokenType.Comment,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,void 0];return o.onParseError(new ParseErrorWithToken(e.UnexpectedEOFInComment,n.representationStart,n.representationEnd,["4.3.2. Consume comments","Unexpected EOF"],t)),t}if(42===t&&(void 0!==n.source.codePointAt(n.cursor)&&47===n.source.codePointAt(n.cursor))){n.advanceCodePoint();break}}return[exports.TokenType.Comment,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,void 0]}function consumeEscapedCodePoint(o,t){const r=t.readCodePoint();if(void 0===r)return o.onParseError(new ParseError(e.UnexpectedEOFInEscapedCodePoint,t.representationStart,t.representationEnd,["4.3.7. Consume an escaped code point","Unexpected EOF"])),c;if(isHexDigitCodePoint(r)){const e=[r];let o;for(;void 0!==(o=t.source.codePointAt(t.cursor))&&isHexDigitCodePoint(o)&&e.length<6;)e.push(o),t.advanceCodePoint();isWhitespace(t.source.codePointAt(t.cursor)??-1)&&(t.source.codePointAt(t.cursor)===n&&t.source.codePointAt(t.cursor+1)===s&&t.advanceCodePoint(),t.advanceCodePoint());const i=parseInt(String.fromCodePoint(...e),16);return 0===i||isSurrogate(i)||i>1114111?c:i}return 0===r||isSurrogate(r)?c:r}function consumeIdentSequence(e,o){const n=[];for(;;){const t=o.source.codePointAt(o.cursor)??-1;if(0===t||isSurrogate(t))n.push(c),o.advanceCodePoint(+(t>65535)+1);else if(isIdentCodePoint(t))n.push(t),o.advanceCodePoint(+(t>65535)+1);else{if(!checkIfTwoCodePointsAreAValidEscape(o))return n;o.advanceCodePoint(),n.push(consumeEscapedCodePoint(e,o))}}}function consumeHashToken(e,o){o.advanceCodePoint();const n=o.source.codePointAt(o.cursor);if(void 0!==n&&(isIdentCodePoint(n)||checkIfTwoCodePointsAreAValidEscape(o))){let n=exports.HashType.Unrestricted;checkIfThreeCodePointsWouldStartAnIdentSequence(0,o)&&(n=exports.HashType.ID);const t=consumeIdentSequence(e,o);return[exports.TokenType.Hash,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:String.fromCodePoint(...t),type:n}]}return[exports.TokenType.Delim,"#",o.representationStart,o.representationEnd,{value:"#"}]}function consumeNumber(e,o){let n=exports.NumberType.Integer;for(o.source.codePointAt(o.cursor)!==i&&o.source.codePointAt(o.cursor)!==r||o.advanceCodePoint();isDigitCodePoint(o.source.codePointAt(o.cursor)??-1);)o.advanceCodePoint();if(o.source.codePointAt(o.cursor)===t&&isDigitCodePoint(o.source.codePointAt(o.cursor+1)??-1))for(o.advanceCodePoint(2),n=exports.NumberType.Number;isDigitCodePoint(o.source.codePointAt(o.cursor)??-1);)o.advanceCodePoint();if(101===o.source.codePointAt(o.cursor)||69===o.source.codePointAt(o.cursor)){if(isDigitCodePoint(o.source.codePointAt(o.cursor+1)??-1))o.advanceCodePoint(2);else{if(o.source.codePointAt(o.cursor+1)!==r&&o.source.codePointAt(o.cursor+1)!==i||!isDigitCodePoint(o.source.codePointAt(o.cursor+2)??-1))return n;o.advanceCodePoint(3)}for(n=exports.NumberType.Number;isDigitCodePoint(o.source.codePointAt(o.cursor)??-1);)o.advanceCodePoint()}return n}function consumeNumericToken(e,o){let n;{const e=o.source.codePointAt(o.cursor);e===r?n="-":e===i&&(n="+")}const t=consumeNumber(0,o),s=parseFloat(o.source.slice(o.representationStart,o.representationEnd+1));if(checkIfThreeCodePointsWouldStartAnIdentSequence(0,o)){const r=consumeIdentSequence(e,o);return[exports.TokenType.Dimension,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:s,signCharacter:n,type:t,unit:String.fromCodePoint(...r)}]}return 37===o.source.codePointAt(o.cursor)?(o.advanceCodePoint(),[exports.TokenType.Percentage,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:s,signCharacter:n}]):[exports.TokenType.Number,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:s,signCharacter:n,type:t}]}function consumeWhiteSpace$1(e){for(;isWhitespace(e.source.codePointAt(e.cursor)??-1);)e.advanceCodePoint();return[exports.TokenType.Whitespace,e.source.slice(e.representationStart,e.representationEnd+1),e.representationStart,e.representationEnd,void 0]}exports.TokenType=void 0,(a=exports.TokenType||(exports.TokenType={})).Comment="comment",a.AtKeyword="at-keyword-token",a.BadString="bad-string-token",a.BadURL="bad-url-token",a.CDC="CDC-token",a.CDO="CDO-token",a.Colon="colon-token",a.Comma="comma-token",a.Delim="delim-token",a.Dimension="dimension-token",a.EOF="EOF-token",a.Function="function-token",a.Hash="hash-token",a.Ident="ident-token",a.Number="number-token",a.Percentage="percentage-token",a.Semicolon="semicolon-token",a.String="string-token",a.URL="url-token",a.Whitespace="whitespace-token",a.OpenParen="(-token",a.CloseParen=")-token",a.OpenSquare="[-token",a.CloseSquare="]-token",a.OpenCurly="{-token",a.CloseCurly="}-token",a.UnicodeRange="unicode-range-token",exports.NumberType=void 0,(u=exports.NumberType||(exports.NumberType={})).Integer="integer",u.Number="number",exports.HashType=void 0,(d=exports.HashType||(exports.HashType={})).Unrestricted="unrestricted",d.ID="id";class Reader{cursor=0;source="";representationStart=0;representationEnd=-1;constructor(e){this.source=e}advanceCodePoint(e=1){this.cursor=this.cursor+e,this.representationEnd=this.cursor-1}readCodePoint(){const e=this.source.codePointAt(this.cursor);if(void 0!==e)return this.cursor=this.cursor+1,this.representationEnd=this.cursor-1,e}unreadCodePoint(e=1){this.cursor=this.cursor-e,this.representationEnd=this.cursor-1}resetRepresentation(){this.representationStart=this.cursor,this.representationEnd=-1}}function consumeStringToken(o,t){let r="";const i=t.readCodePoint();for(;;){const a=t.readCodePoint();if(void 0===a){const n=[exports.TokenType.String,t.source.slice(t.representationStart,t.representationEnd+1),t.representationStart,t.representationEnd,{value:r}];return o.onParseError(new ParseErrorWithToken(e.UnexpectedEOFInString,t.representationStart,t.representationEnd,["4.3.5. Consume a string token","Unexpected EOF"],n)),n}if(isNewLine(a)){t.unreadCodePoint();const r=[exports.TokenType.BadString,t.source.slice(t.representationStart,t.representationEnd+1),t.representationStart,t.representationEnd,void 0];return o.onParseError(new ParseErrorWithToken(e.UnexpectedNewLineInString,t.representationStart,t.source.codePointAt(t.cursor)===n&&t.source.codePointAt(t.cursor+1)===s?t.representationEnd+2:t.representationEnd+1,["4.3.5. Consume a string token","Unexpected newline"],r)),r}if(a===i)return[exports.TokenType.String,t.source.slice(t.representationStart,t.representationEnd+1),t.representationStart,t.representationEnd,{value:r}];if(92!==a)0===a||isSurrogate(a)?r+=String.fromCodePoint(c):r+=String.fromCodePoint(a);else{if(void 0===t.source.codePointAt(t.cursor))continue;if(isNewLine(t.source.codePointAt(t.cursor)??-1)){t.source.codePointAt(t.cursor)===n&&t.source.codePointAt(t.cursor+1)===s&&t.advanceCodePoint(),t.advanceCodePoint();continue}r+=String.fromCodePoint(consumeEscapedCodePoint(o,t))}}}function checkIfCodePointsMatchURLIdent(e){return!(3!==e.length||117!==e[0]&&85!==e[0]||114!==e[1]&&82!==e[1]||108!==e[2]&&76!==e[2])}function consumeBadURL(e,o){for(;;){const n=o.source.codePointAt(o.cursor);if(void 0===n)return;if(41===n)return void o.advanceCodePoint();checkIfTwoCodePointsAreAValidEscape(o)?(o.advanceCodePoint(),consumeEscapedCodePoint(e,o)):o.advanceCodePoint()}}function consumeUrlToken(o,n){for(;isWhitespace(n.source.codePointAt(n.cursor)??-1);)n.advanceCodePoint();let t="";for(;;){if(void 0===n.source.codePointAt(n.cursor)){const r=[exports.TokenType.URL,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:t}];return o.onParseError(new ParseErrorWithToken(e.UnexpectedEOFInURL,n.representationStart,n.representationEnd,["4.3.6. Consume a url token","Unexpected EOF"],r)),r}if(41===n.source.codePointAt(n.cursor))return n.advanceCodePoint(),[exports.TokenType.URL,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:t}];if(isWhitespace(n.source.codePointAt(n.cursor)??-1)){for(n.advanceCodePoint();isWhitespace(n.source.codePointAt(n.cursor)??-1);)n.advanceCodePoint();if(void 0===n.source.codePointAt(n.cursor)){const r=[exports.TokenType.URL,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:t}];return o.onParseError(new ParseErrorWithToken(e.UnexpectedEOFInURL,n.representationStart,n.representationEnd,["4.3.6. Consume a url token","Consume as much whitespace as possible","Unexpected EOF"],r)),r}return 41===n.source.codePointAt(n.cursor)?(n.advanceCodePoint(),[exports.TokenType.URL,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:t}]):(consumeBadURL(o,n),[exports.TokenType.BadURL,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,void 0])}const s=n.source.codePointAt(n.cursor);if(34===s||39===s||40===s||(11===(r=s??-1)||127===r||0<=r&&r<=8||14<=r&&r<=31)){consumeBadURL(o,n);const t=[exports.TokenType.BadURL,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,void 0];return o.onParseError(new ParseErrorWithToken(e.UnexpectedCharacterInURL,n.representationStart,n.representationEnd,["4.3.6. Consume a url token","Unexpected U+0022 QUOTATION MARK (\"), U+0027 APOSTROPHE ('), U+0028 LEFT PARENTHESIS (() or non-printable code point"],t)),t}if(92===s){if(checkIfTwoCodePointsAreAValidEscape(n)){n.advanceCodePoint(),t+=String.fromCodePoint(consumeEscapedCodePoint(o,n));continue}consumeBadURL(o,n);const r=[exports.TokenType.BadURL,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,void 0];return o.onParseError(new ParseErrorWithToken(e.InvalidEscapeSequenceInURL,n.representationStart,n.representationEnd,["4.3.6. Consume a url token","U+005C REVERSE SOLIDUS (\\)","The input stream does not start with a valid escape sequence"],r)),r}0===n.source.codePointAt(n.cursor)||isSurrogate(n.source.codePointAt(n.cursor)??-1)?(t+=String.fromCodePoint(c),n.advanceCodePoint()):(t+=n.source[n.cursor],n.advanceCodePoint())}var r}function consumeIdentLikeToken(e,o){const n=consumeIdentSequence(e,o);if(40!==o.source.codePointAt(o.cursor))return[exports.TokenType.Ident,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:String.fromCodePoint(...n)}];if(checkIfCodePointsMatchURLIdent(n)){o.advanceCodePoint();let t=0;for(;;){const e=isWhitespace(o.source.codePointAt(o.cursor)??-1),r=isWhitespace(o.source.codePointAt(o.cursor+1)??-1);if(e&&r){t+=1,o.advanceCodePoint(1);continue}const s=e?o.source.codePointAt(o.cursor+1):o.source.codePointAt(o.cursor);if(34===s||39===s)return t>0&&o.unreadCodePoint(t),[exports.TokenType.Function,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:String.fromCodePoint(...n)}];break}return consumeUrlToken(e,o)}return o.advanceCodePoint(),[exports.TokenType.Function,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:String.fromCodePoint(...n)}]}function checkIfThreeCodePointsWouldStartAUnicodeRange(e){return!(117!==e.source.codePointAt(e.cursor)&&85!==e.source.codePointAt(e.cursor)||e.source.codePointAt(e.cursor+1)!==i||63!==e.source.codePointAt(e.cursor+2)&&!isHexDigitCodePoint(e.source.codePointAt(e.cursor+2)??-1))}function consumeUnicodeRangeToken(e,o){o.advanceCodePoint(2);const n=[],t=[];let s;for(;void 0!==(s=o.source.codePointAt(o.cursor))&&n.length<6&&isHexDigitCodePoint(s);)n.push(s),o.advanceCodePoint();for(;void 0!==(s=o.source.codePointAt(o.cursor))&&n.length<6&&63===s;)0===t.length&&t.push(...n),n.push(48),t.push(70),o.advanceCodePoint();if(!t.length&&o.source.codePointAt(o.cursor)===r&&isHexDigitCodePoint(o.source.codePointAt(o.cursor+1)??-1))for(o.advanceCodePoint();void 0!==(s=o.source.codePointAt(o.cursor))&&t.length<6&&isHexDigitCodePoint(s);)t.push(s),o.advanceCodePoint();if(!t.length){const e=parseInt(String.fromCodePoint(...n),16);return[exports.TokenType.UnicodeRange,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{startOfRange:e,endOfRange:e}]}const i=parseInt(String.fromCodePoint(...n),16),c=parseInt(String.fromCodePoint(...t),16);return[exports.TokenType.UnicodeRange,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{startOfRange:i,endOfRange:c}]}function tokenizer(o,c){const a=o.css.valueOf(),u=o.unicodeRangesAllowed??!1,d=new Reader(a),p={onParseError:c?.onParseError??noop};return{nextToken:function nextToken(){d.resetRepresentation();const o=d.source.codePointAt(d.cursor);if(void 0===o)return[exports.TokenType.EOF,"",-1,-1,void 0];if(47===o&&checkIfTwoCodePointsStartAComment(d))return consumeComment(p,d);if(u&&(117===o||85===o)&&checkIfThreeCodePointsWouldStartAUnicodeRange(d))return consumeUnicodeRangeToken(0,d);if(isIdentStartCodePoint(o))return consumeIdentLikeToken(p,d);if(isDigitCodePoint(o))return consumeNumericToken(p,d);switch(o){case 44:return d.advanceCodePoint(),[exports.TokenType.Comma,",",d.representationStart,d.representationEnd,void 0];case 58:return d.advanceCodePoint(),[exports.TokenType.Colon,":",d.representationStart,d.representationEnd,void 0];case 59:return d.advanceCodePoint(),[exports.TokenType.Semicolon,";",d.representationStart,d.representationEnd,void 0];case 40:return d.advanceCodePoint(),[exports.TokenType.OpenParen,"(",d.representationStart,d.representationEnd,void 0];case 41:return d.advanceCodePoint(),[exports.TokenType.CloseParen,")",d.representationStart,d.representationEnd,void 0];case 91:return d.advanceCodePoint(),[exports.TokenType.OpenSquare,"[",d.representationStart,d.representationEnd,void 0];case 93:return d.advanceCodePoint(),[exports.TokenType.CloseSquare,"]",d.representationStart,d.representationEnd,void 0];case 123:return d.advanceCodePoint(),[exports.TokenType.OpenCurly,"{",d.representationStart,d.representationEnd,void 0];case 125:return d.advanceCodePoint(),[exports.TokenType.CloseCurly,"}",d.representationStart,d.representationEnd,void 0];case 39:case 34:return consumeStringToken(p,d);case 35:return consumeHashToken(p,d);case i:case t:return checkIfThreeCodePointsWouldStartANumber(d)?consumeNumericToken(p,d):(d.advanceCodePoint(),[exports.TokenType.Delim,d.source[d.representationStart],d.representationStart,d.representationEnd,{value:d.source[d.representationStart]}]);case s:case n:case 12:case 9:case 32:return consumeWhiteSpace$1(d);case r:return checkIfThreeCodePointsWouldStartANumber(d)?consumeNumericToken(p,d):checkIfThreeCodePointsWouldStartCDC(d)?(d.advanceCodePoint(3),[exports.TokenType.CDC,"--\x3e",d.representationStart,d.representationEnd,void 0]):checkIfThreeCodePointsWouldStartAnIdentSequence(0,d)?consumeIdentLikeToken(p,d):(d.advanceCodePoint(),[exports.TokenType.Delim,"-",d.representationStart,d.representationEnd,{value:"-"}]);case 60:return checkIfFourCodePointsWouldStartCDO(d)?(d.advanceCodePoint(4),[exports.TokenType.CDO,"\x3c!--",d.representationStart,d.representationEnd,void 0]):(d.advanceCodePoint(),[exports.TokenType.Delim,"<",d.representationStart,d.representationEnd,{value:"<"}]);case 64:if(d.advanceCodePoint(),checkIfThreeCodePointsWouldStartAnIdentSequence(0,d)){const e=consumeIdentSequence(p,d);return[exports.TokenType.AtKeyword,d.source.slice(d.representationStart,d.representationEnd+1),d.representationStart,d.representationEnd,{value:String.fromCodePoint(...e)}]}return[exports.TokenType.Delim,"@",d.representationStart,d.representationEnd,{value:"@"}];case 92:{if(checkIfTwoCodePointsAreAValidEscape(d))return consumeIdentLikeToken(p,d);d.advanceCodePoint();const o=[exports.TokenType.Delim,"\\",d.representationStart,d.representationEnd,{value:"\\"}];return p.onParseError(new ParseErrorWithToken(e.InvalidEscapeSequenceAfterBackslash,d.representationStart,d.representationEnd,["4.3.1. Consume a token","U+005C REVERSE SOLIDUS (\\)","The input stream does not start with a valid escape sequence"],o)),o}}return d.advanceCodePoint(),[exports.TokenType.Delim,d.source[d.representationStart],d.representationStart,d.representationEnd,{value:d.source[d.representationStart]}]},endOfFile:function endOfFile(){return void 0===d.source.codePointAt(d.cursor)}}}function noop(){}function ensureThatValueRoundTripsAsIdent(e){let o=0;e[0]===r&&e[1]===r?o=2:e[0]===r&&e[1]?(o=2,isIdentStartCodePoint(e[1])||(o+=insertEscapedCodePoint(e,1,e[1]))):isIdentStartCodePoint(e[0])?o=1:(o=1,o+=insertEscapedCodePoint(e,0,e[0]));for(let n=o;n<e.length;n++)isIdentCodePoint(e[n])||(n+=insertEscapedCodePoint(e,n,e[n]));return e}function insertEscapedCodePoint(e,o,n){const t=n.toString(16),r=[];for(const e of t)r.push(e.codePointAt(0));const s=e[o+1];return o===e.length-1||s&&isHexDigitCodePoint(s)?(e.splice(o,1,92,...r,32),1+r.length):(e.splice(o,1,92,...r),r.length)}const p=Object.values(exports.TokenType);var T;function consumeNamedCell(e){const o=[];for(;;){const n=e.source.codePointAt(e.cursor)??-1;if(0===n||isSurrogate(n))o.push(c),e.advanceCodePoint(+(n>65535)+1);else{if(!isIdentCodePoint(n))break;o.push(n),e.advanceCodePoint(+(n>65535)+1)}}return{type:exports.TokenTypeGridTemplateAreas.NamedCell,value:String.fromCodePoint(...o)}}function consumeNullCell(e){for(;e.source.codePointAt(e.cursor)===t;)e.advanceCodePoint();return{type:exports.TokenTypeGridTemplateAreas.NullCell,value:e.source.slice(e.representationStart,e.representationEnd+1)}}function consumeWhiteSpace(e){for(;isWhitespace(e.source.codePointAt(e.cursor)??-1);)e.advanceCodePoint()}function consumeTrash(e){e.advanceCodePoint();e:for(;;){const o=e.source.codePointAt(e.cursor);if(void 0===o)break e;switch(o){case s:case n:case 12:case 9:case 32:case t:case 0:break e;default:if(isSurrogate(o)||isIdentCodePoint(o))break e;e.advanceCodePoint();continue e}}return{type:exports.TokenTypeGridTemplateAreas.Trash,value:e.source.slice(e.representationStart,e.representationEnd+1)}}exports.TokenTypeGridTemplateAreas=void 0,(T=exports.TokenTypeGridTemplateAreas||(exports.TokenTypeGridTemplateAreas={})).NamedCell="named-cell-token",T.NullCell="null-cell-token",T.Trash="trash-token",exports.ParseError=ParseError,exports.ParseErrorMessage=e,exports.ParseErrorWithToken=ParseErrorWithToken,exports.cloneTokens=function cloneTokens(e){return o?structuredClone(e):JSON.parse(JSON.stringify(e))},exports.isToken=function isToken(e){return!!Array.isArray(e)&&(!(e.length<4)&&(!!p.includes(e[0])&&("string"==typeof e[1]&&("number"==typeof e[2]&&"number"==typeof e[3]))))},exports.isTokenAtKeyword=function isTokenAtKeyword(e){return!!e&&e[0]===exports.TokenType.AtKeyword},exports.isTokenBadString=function isTokenBadString(e){return!!e&&e[0]===exports.TokenType.BadString},exports.isTokenBadURL=function isTokenBadURL(e){return!!e&&e[0]===exports.TokenType.BadURL},exports.isTokenCDC=function isTokenCDC(e){return!!e&&e[0]===exports.TokenType.CDC},exports.isTokenCDO=function isTokenCDO(e){return!!e&&e[0]===exports.TokenType.CDO},exports.isTokenCloseCurly=function isTokenCloseCurly(e){return!!e&&e[0]===exports.TokenType.CloseCurly},exports.isTokenCloseParen=function isTokenCloseParen(e){return!!e&&e[0]===exports.TokenType.CloseParen},exports.isTokenCloseSquare=function isTokenCloseSquare(e){return!!e&&e[0]===exports.TokenType.CloseSquare},exports.isTokenColon=function isTokenColon(e){return!!e&&e[0]===exports.TokenType.Colon},exports.isTokenComma=function isTokenComma(e){return!!e&&e[0]===exports.TokenType.Comma},exports.isTokenComment=function isTokenComment(e){return!!e&&e[0]===exports.TokenType.Comment},exports.isTokenDelim=function isTokenDelim(e){return!!e&&e[0]===exports.TokenType.Delim},exports.isTokenDimension=function isTokenDimension(e){return!!e&&e[0]===exports.TokenType.Dimension},exports.isTokenEOF=function isTokenEOF(e){return!!e&&e[0]===exports.TokenType.EOF},exports.isTokenFunction=function isTokenFunction(e){return!!e&&e[0]===exports.TokenType.Function},exports.isTokenHash=function isTokenHash(e){return!!e&&e[0]===exports.TokenType.Hash},exports.isTokenIdent=function isTokenIdent(e){return!!e&&e[0]===exports.TokenType.Ident},exports.isTokenNumber=function isTokenNumber(e){return!!e&&e[0]===exports.TokenType.Number},exports.isTokenNumeric=function isTokenNumeric(e){if(!e)return!1;switch(e[0]){case exports.TokenType.Dimension:case exports.TokenType.Number:case exports.TokenType.Percentage:return!0;default:return!1}},exports.isTokenOpenCurly=function isTokenOpenCurly(e){return!!e&&e[0]===exports.TokenType.OpenCurly},exports.isTokenOpenParen=function isTokenOpenParen(e){return!!e&&e[0]===exports.TokenType.OpenParen},exports.isTokenOpenSquare=function isTokenOpenSquare(e){return!!e&&e[0]===exports.TokenType.OpenSquare},exports.isTokenPercentage=function isTokenPercentage(e){return!!e&&e[0]===exports.TokenType.Percentage},exports.isTokenSemicolon=function isTokenSemicolon(e){return!!e&&e[0]===exports.TokenType.Semicolon},exports.isTokenString=function isTokenString(e){return!!e&&e[0]===exports.TokenType.String},exports.isTokenURL=function isTokenURL(e){return!!e&&e[0]===exports.TokenType.URL},exports.isTokenUnicodeRange=function isTokenUnicodeRange(e){return!!e&&e[0]===exports.TokenType.UnicodeRange},exports.isTokenWhiteSpaceOrComment=function isTokenWhiteSpaceOrComment(e){if(!e)return!1;switch(e[0]){case exports.TokenType.Whitespace:case exports.TokenType.Comment:return!0;default:return!1}},exports.isTokenWhitespace=function isTokenWhitespace(e){return!!e&&e[0]===exports.TokenType.Whitespace},exports.mirrorVariant=function mirrorVariant(e){switch(e[0]){case exports.TokenType.OpenParen:return[exports.TokenType.CloseParen,")",-1,-1,void 0];case exports.TokenType.CloseParen:return[exports.TokenType.OpenParen,"(",-1,-1,void 0];case exports.TokenType.OpenCurly:return[exports.TokenType.CloseCurly,"}",-1,-1,void 0];case exports.TokenType.CloseCurly:return[exports.TokenType.OpenCurly,"{",-1,-1,void 0];case exports.TokenType.OpenSquare:return[exports.TokenType.CloseSquare,"]",-1,-1,void 0];case exports.TokenType.CloseSquare:return[exports.TokenType.OpenSquare,"[",-1,-1,void 0];default:return null}},exports.mirrorVariantType=function mirrorVariantType(e){switch(e){case exports.TokenType.OpenParen:return exports.TokenType.CloseParen;case exports.TokenType.CloseParen:return exports.TokenType.OpenParen;case exports.TokenType.OpenCurly:return exports.TokenType.CloseCurly;case exports.TokenType.CloseCurly:return exports.TokenType.OpenCurly;case exports.TokenType.OpenSquare:return exports.TokenType.CloseSquare;case exports.TokenType.CloseSquare:return exports.TokenType.OpenSquare;default:return null}},exports.mutateIdent=function mutateIdent(e,o){const n=[];for(const e of o)n.push(e.codePointAt(0));const t=String.fromCodePoint(...ensureThatValueRoundTripsAsIdent(n));e[1]=t,e[4].value=o},exports.mutateUnit=function mutateUnit(e,o){const n=[];for(const e of o)n.push(e.codePointAt(0));const t=ensureThatValueRoundTripsAsIdent(n);101===t[0]&&insertEscapedCodePoint(t,0,t[0]);const r=String.fromCodePoint(...t),s="+"===e[4].signCharacter?e[4].signCharacter:"",i=e[4].value.toString();e[1]=`${s}${i}${r}`,e[4].unit=o},exports.stringify=function stringify(...e){let o="";for(let n=0;n<e.length;n++)o+=e[n][1];return o},exports.tokenize=function tokenize(e,o){const n=tokenizer(e,o),t=[];for(;!n.endOfFile();)t.push(n.nextToken());return t.push(n.nextToken()),t},exports.tokenizeGridTemplateAreas=function tokenizeGridTemplateAreas(e){const o=[],r=new Reader(e.valueOf());e:for(;;){r.resetRepresentation();const e=r.source.codePointAt(r.cursor);if(void 0===e)break;switch(e){case s:case n:case 12:case 9:case 32:consumeWhiteSpace(r);continue e;case t:o.push(consumeNullCell(r));continue e;default:if(0===e||isSurrogate(e)||isIdentCodePoint(e)){o.push(consumeNamedCell(r));continue e}o.push(consumeTrash(r));continue e}}return o},exports.tokenizer=tokenizer;
