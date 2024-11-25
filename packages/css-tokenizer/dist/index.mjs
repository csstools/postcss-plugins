class ParseError extends Error{sourceStart;sourceEnd;parserState;constructor(e,n,t,o){super(e),this.name="ParseError",this.sourceStart=n,this.sourceEnd=t,this.parserState=o}}class ParseErrorWithToken extends ParseError{token;constructor(e,n,t,o,r){super(e,n,t,o),this.token=r}}const e={UnexpectedNewLineInString:"Unexpected newline while consuming a string token.",UnexpectedEOFInString:"Unexpected EOF while consuming a string token.",UnexpectedEOFInComment:"Unexpected EOF while consuming a comment.",UnexpectedEOFInURL:"Unexpected EOF while consuming a url token.",UnexpectedEOFInEscapedCodePoint:"Unexpected EOF while consuming an escaped code point.",UnexpectedCharacterInURL:"Unexpected character while consuming a url token.",InvalidEscapeSequenceInURL:"Invalid escape sequence while consuming a url token.",InvalidEscapeSequenceAfterBackslash:'Invalid escape sequence after "\\"'},n="undefined"!=typeof globalThis&&"structuredClone"in globalThis;function cloneTokens(e){return n?structuredClone(e):JSON.parse(JSON.stringify(e))}function stringify(...e){let n="";for(let t=0;t<e.length;t++)n+=e[t][1];return n}const t=13,o=46,r=45,i=10,s=43,c=65533;function checkIfFourCodePointsWouldStartCDO(e){return 60===e.source.codePointAt(e.cursor)&&33===e.source.codePointAt(e.cursor+1)&&e.source.codePointAt(e.cursor+2)===r&&e.source.codePointAt(e.cursor+3)===r}function isDigitCodePoint(e){return e>=48&&e<=57}function isUppercaseLetterCodePoint(e){return e>=65&&e<=90}function isLowercaseLetterCodePoint(e){return e>=97&&e<=122}function isHexDigitCodePoint(e){return e>=48&&e<=57||e>=97&&e<=102||e>=65&&e<=70}function isLetterCodePoint(e){return isLowercaseLetterCodePoint(e)||isUppercaseLetterCodePoint(e)}function isIdentStartCodePoint(e){return isLetterCodePoint(e)||isNonASCII_IdentCodePoint(e)||95===e}function isIdentCodePoint(e){return isIdentStartCodePoint(e)||isDigitCodePoint(e)||e===r}function isNonASCII_IdentCodePoint(e){return 183===e||8204===e||8205===e||8255===e||8256===e||8204===e||(192<=e&&e<=214||216<=e&&e<=246||248<=e&&e<=893||895<=e&&e<=8191||8304<=e&&e<=8591||11264<=e&&e<=12271||12289<=e&&e<=55295||63744<=e&&e<=64975||65008<=e&&e<=65533||(0===e||(!!isSurrogate(e)||e>=65536)))}function isNewLine(e){return e===i||e===t||12===e}function isWhitespace(e){return 32===e||e===i||9===e||e===t||12===e}function isSurrogate(e){return e>=55296&&e<=57343}function checkIfTwoCodePointsAreAValidEscape(e){return 92===e.source.codePointAt(e.cursor)&&!isNewLine(e.source.codePointAt(e.cursor+1)??-1)}function checkIfThreeCodePointsWouldStartAnIdentSequence(e,n){return n.source.codePointAt(n.cursor)===r?n.source.codePointAt(n.cursor+1)===r||(!!isIdentStartCodePoint(n.source.codePointAt(n.cursor+1)??-1)||92===n.source.codePointAt(n.cursor+1)&&!isNewLine(n.source.codePointAt(n.cursor+2)??-1)):!!isIdentStartCodePoint(n.source.codePointAt(n.cursor)??-1)||checkIfTwoCodePointsAreAValidEscape(n)}function checkIfThreeCodePointsWouldStartANumber(e){return e.source.codePointAt(e.cursor)===s||e.source.codePointAt(e.cursor)===r?!!isDigitCodePoint(e.source.codePointAt(e.cursor+1)??-1)||e.source.codePointAt(e.cursor+1)===o&&isDigitCodePoint(e.source.codePointAt(e.cursor+2)??-1):e.source.codePointAt(e.cursor)===o?isDigitCodePoint(e.source.codePointAt(e.cursor+1)??-1):isDigitCodePoint(e.source.codePointAt(e.cursor)??-1)}function checkIfTwoCodePointsStartAComment(e){return 47===e.source.codePointAt(e.cursor)&&42===e.source.codePointAt(e.cursor+1)}function checkIfThreeCodePointsWouldStartCDC(e){return e.source.codePointAt(e.cursor)===r&&e.source.codePointAt(e.cursor+1)===r&&62===e.source.codePointAt(e.cursor+2)}var a,u,d;function mirrorVariantType(e){switch(e){case a.OpenParen:return a.CloseParen;case a.CloseParen:return a.OpenParen;case a.OpenCurly:return a.CloseCurly;case a.CloseCurly:return a.OpenCurly;case a.OpenSquare:return a.CloseSquare;case a.CloseSquare:return a.OpenSquare;default:return null}}function mirrorVariant(e){switch(e[0]){case a.OpenParen:return[a.CloseParen,")",-1,-1,void 0];case a.CloseParen:return[a.OpenParen,"(",-1,-1,void 0];case a.OpenCurly:return[a.CloseCurly,"}",-1,-1,void 0];case a.CloseCurly:return[a.OpenCurly,"{",-1,-1,void 0];case a.OpenSquare:return[a.CloseSquare,"]",-1,-1,void 0];case a.CloseSquare:return[a.OpenSquare,"[",-1,-1,void 0];default:return null}}function consumeComment(n,t){for(t.advanceCodePoint(2);;){const o=t.readCodePoint();if(void 0===o){const o=[a.Comment,t.source.slice(t.representationStart,t.representationEnd+1),t.representationStart,t.representationEnd,void 0];return n.onParseError(new ParseErrorWithToken(e.UnexpectedEOFInComment,t.representationStart,t.representationEnd,["4.3.2. Consume comments","Unexpected EOF"],o)),o}if(42===o&&(void 0!==t.source.codePointAt(t.cursor)&&47===t.source.codePointAt(t.cursor))){t.advanceCodePoint();break}}return[a.Comment,t.source.slice(t.representationStart,t.representationEnd+1),t.representationStart,t.representationEnd,void 0]}function consumeEscapedCodePoint(n,o){const r=o.readCodePoint();if(void 0===r)return n.onParseError(new ParseError(e.UnexpectedEOFInEscapedCodePoint,o.representationStart,o.representationEnd,["4.3.7. Consume an escaped code point","Unexpected EOF"])),c;if(isHexDigitCodePoint(r)){const e=[r];let n;for(;void 0!==(n=o.source.codePointAt(o.cursor))&&isHexDigitCodePoint(n)&&e.length<6;)e.push(n),o.advanceCodePoint();isWhitespace(o.source.codePointAt(o.cursor)??-1)&&(o.source.codePointAt(o.cursor)===t&&o.source.codePointAt(o.cursor+1)===i&&o.advanceCodePoint(),o.advanceCodePoint());const s=parseInt(String.fromCodePoint(...e),16);return 0===s||isSurrogate(s)||s>1114111?c:s}return 0===r||isSurrogate(r)?c:r}function consumeIdentSequence(e,n){const t=[];for(;;){const o=n.source.codePointAt(n.cursor)??-1;if(0===o||isSurrogate(o))t.push(c),n.advanceCodePoint(+(o>65535)+1);else if(isIdentCodePoint(o))t.push(o),n.advanceCodePoint(+(o>65535)+1);else{if(!checkIfTwoCodePointsAreAValidEscape(n))return t;n.advanceCodePoint(),t.push(consumeEscapedCodePoint(e,n))}}}function consumeHashToken(e,n){n.advanceCodePoint();const t=n.source.codePointAt(n.cursor);if(void 0!==t&&(isIdentCodePoint(t)||checkIfTwoCodePointsAreAValidEscape(n))){let t=d.Unrestricted;checkIfThreeCodePointsWouldStartAnIdentSequence(0,n)&&(t=d.ID);const o=consumeIdentSequence(e,n);return[a.Hash,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:String.fromCodePoint(...o),type:t}]}return[a.Delim,"#",n.representationStart,n.representationEnd,{value:"#"}]}function consumeNumber(e,n){let t=u.Integer;for(n.source.codePointAt(n.cursor)!==s&&n.source.codePointAt(n.cursor)!==r||n.advanceCodePoint();isDigitCodePoint(n.source.codePointAt(n.cursor)??-1);)n.advanceCodePoint();if(n.source.codePointAt(n.cursor)===o&&isDigitCodePoint(n.source.codePointAt(n.cursor+1)??-1))for(n.advanceCodePoint(2),t=u.Number;isDigitCodePoint(n.source.codePointAt(n.cursor)??-1);)n.advanceCodePoint();if(101===n.source.codePointAt(n.cursor)||69===n.source.codePointAt(n.cursor)){if(isDigitCodePoint(n.source.codePointAt(n.cursor+1)??-1))n.advanceCodePoint(2);else{if(n.source.codePointAt(n.cursor+1)!==r&&n.source.codePointAt(n.cursor+1)!==s||!isDigitCodePoint(n.source.codePointAt(n.cursor+2)??-1))return t;n.advanceCodePoint(3)}for(t=u.Number;isDigitCodePoint(n.source.codePointAt(n.cursor)??-1);)n.advanceCodePoint()}return t}function consumeNumericToken(e,n){let t;{const e=n.source.codePointAt(n.cursor);e===r?t="-":e===s&&(t="+")}const o=consumeNumber(0,n),i=parseFloat(n.source.slice(n.representationStart,n.representationEnd+1));if(checkIfThreeCodePointsWouldStartAnIdentSequence(0,n)){const r=consumeIdentSequence(e,n);return[a.Dimension,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:i,signCharacter:t,type:o,unit:String.fromCodePoint(...r)}]}return 37===n.source.codePointAt(n.cursor)?(n.advanceCodePoint(),[a.Percentage,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:i,signCharacter:t}]):[a.Number,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:i,signCharacter:t,type:o}]}function consumeWhiteSpace$1(e){for(;isWhitespace(e.source.codePointAt(e.cursor)??-1);)e.advanceCodePoint();return[a.Whitespace,e.source.slice(e.representationStart,e.representationEnd+1),e.representationStart,e.representationEnd,void 0]}!function(e){e.Comment="comment",e.AtKeyword="at-keyword-token",e.BadString="bad-string-token",e.BadURL="bad-url-token",e.CDC="CDC-token",e.CDO="CDO-token",e.Colon="colon-token",e.Comma="comma-token",e.Delim="delim-token",e.Dimension="dimension-token",e.EOF="EOF-token",e.Function="function-token",e.Hash="hash-token",e.Ident="ident-token",e.Number="number-token",e.Percentage="percentage-token",e.Semicolon="semicolon-token",e.String="string-token",e.URL="url-token",e.Whitespace="whitespace-token",e.OpenParen="(-token",e.CloseParen=")-token",e.OpenSquare="[-token",e.CloseSquare="]-token",e.OpenCurly="{-token",e.CloseCurly="}-token",e.UnicodeRange="unicode-range-token"}(a||(a={})),function(e){e.Integer="integer",e.Number="number"}(u||(u={})),function(e){e.Unrestricted="unrestricted",e.ID="id"}(d||(d={}));class Reader{cursor=0;source="";representationStart=0;representationEnd=-1;constructor(e){this.source=e}advanceCodePoint(e=1){this.cursor=this.cursor+e,this.representationEnd=this.cursor-1}readCodePoint(){const e=this.source.codePointAt(this.cursor);if(void 0!==e)return this.cursor=this.cursor+1,this.representationEnd=this.cursor-1,e}unreadCodePoint(e=1){this.cursor=this.cursor-e,this.representationEnd=this.cursor-1}resetRepresentation(){this.representationStart=this.cursor,this.representationEnd=-1}}function consumeStringToken(n,o){let r="";const s=o.readCodePoint();for(;;){const u=o.readCodePoint();if(void 0===u){const t=[a.String,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:r}];return n.onParseError(new ParseErrorWithToken(e.UnexpectedEOFInString,o.representationStart,o.representationEnd,["4.3.5. Consume a string token","Unexpected EOF"],t)),t}if(isNewLine(u)){o.unreadCodePoint();const r=[a.BadString,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0];return n.onParseError(new ParseErrorWithToken(e.UnexpectedNewLineInString,o.representationStart,o.source.codePointAt(o.cursor)===t&&o.source.codePointAt(o.cursor+1)===i?o.representationEnd+2:o.representationEnd+1,["4.3.5. Consume a string token","Unexpected newline"],r)),r}if(u===s)return[a.String,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:r}];if(92!==u)0===u||isSurrogate(u)?r+=String.fromCodePoint(c):r+=String.fromCodePoint(u);else{if(void 0===o.source.codePointAt(o.cursor))continue;if(isNewLine(o.source.codePointAt(o.cursor)??-1)){o.source.codePointAt(o.cursor)===t&&o.source.codePointAt(o.cursor+1)===i&&o.advanceCodePoint(),o.advanceCodePoint();continue}r+=String.fromCodePoint(consumeEscapedCodePoint(n,o))}}}function checkIfCodePointsMatchURLIdent(e){return!(3!==e.length||117!==e[0]&&85!==e[0]||114!==e[1]&&82!==e[1]||108!==e[2]&&76!==e[2])}function consumeBadURL(e,n){for(;;){const t=n.source.codePointAt(n.cursor);if(void 0===t)return;if(41===t)return void n.advanceCodePoint();checkIfTwoCodePointsAreAValidEscape(n)?(n.advanceCodePoint(),consumeEscapedCodePoint(e,n)):n.advanceCodePoint()}}function consumeUrlToken(n,t){for(;isWhitespace(t.source.codePointAt(t.cursor)??-1);)t.advanceCodePoint();let o="";for(;;){if(void 0===t.source.codePointAt(t.cursor)){const r=[a.URL,t.source.slice(t.representationStart,t.representationEnd+1),t.representationStart,t.representationEnd,{value:o}];return n.onParseError(new ParseErrorWithToken(e.UnexpectedEOFInURL,t.representationStart,t.representationEnd,["4.3.6. Consume a url token","Unexpected EOF"],r)),r}if(41===t.source.codePointAt(t.cursor))return t.advanceCodePoint(),[a.URL,t.source.slice(t.representationStart,t.representationEnd+1),t.representationStart,t.representationEnd,{value:o}];if(isWhitespace(t.source.codePointAt(t.cursor)??-1)){for(t.advanceCodePoint();isWhitespace(t.source.codePointAt(t.cursor)??-1);)t.advanceCodePoint();if(void 0===t.source.codePointAt(t.cursor)){const r=[a.URL,t.source.slice(t.representationStart,t.representationEnd+1),t.representationStart,t.representationEnd,{value:o}];return n.onParseError(new ParseErrorWithToken(e.UnexpectedEOFInURL,t.representationStart,t.representationEnd,["4.3.6. Consume a url token","Consume as much whitespace as possible","Unexpected EOF"],r)),r}return 41===t.source.codePointAt(t.cursor)?(t.advanceCodePoint(),[a.URL,t.source.slice(t.representationStart,t.representationEnd+1),t.representationStart,t.representationEnd,{value:o}]):(consumeBadURL(n,t),[a.BadURL,t.source.slice(t.representationStart,t.representationEnd+1),t.representationStart,t.representationEnd,void 0])}const i=t.source.codePointAt(t.cursor);if(34===i||39===i||40===i||(11===(r=i??-1)||127===r||0<=r&&r<=8||14<=r&&r<=31)){consumeBadURL(n,t);const o=[a.BadURL,t.source.slice(t.representationStart,t.representationEnd+1),t.representationStart,t.representationEnd,void 0];return n.onParseError(new ParseErrorWithToken(e.UnexpectedCharacterInURL,t.representationStart,t.representationEnd,["4.3.6. Consume a url token","Unexpected U+0022 QUOTATION MARK (\"), U+0027 APOSTROPHE ('), U+0028 LEFT PARENTHESIS (() or non-printable code point"],o)),o}if(92===i){if(checkIfTwoCodePointsAreAValidEscape(t)){t.advanceCodePoint(),o+=String.fromCodePoint(consumeEscapedCodePoint(n,t));continue}consumeBadURL(n,t);const r=[a.BadURL,t.source.slice(t.representationStart,t.representationEnd+1),t.representationStart,t.representationEnd,void 0];return n.onParseError(new ParseErrorWithToken(e.InvalidEscapeSequenceInURL,t.representationStart,t.representationEnd,["4.3.6. Consume a url token","U+005C REVERSE SOLIDUS (\\)","The input stream does not start with a valid escape sequence"],r)),r}0===t.source.codePointAt(t.cursor)||isSurrogate(t.source.codePointAt(t.cursor)??-1)?(o+=String.fromCodePoint(c),t.advanceCodePoint()):(o+=t.source[t.cursor],t.advanceCodePoint())}var r}function consumeIdentLikeToken(e,n){const t=consumeIdentSequence(e,n);if(40!==n.source.codePointAt(n.cursor))return[a.Ident,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:String.fromCodePoint(...t)}];if(checkIfCodePointsMatchURLIdent(t)){n.advanceCodePoint();let o=0;for(;;){const e=isWhitespace(n.source.codePointAt(n.cursor)??-1),r=isWhitespace(n.source.codePointAt(n.cursor+1)??-1);if(e&&r){o+=1,n.advanceCodePoint(1);continue}const i=e?n.source.codePointAt(n.cursor+1):n.source.codePointAt(n.cursor);if(34===i||39===i)return o>0&&n.unreadCodePoint(o),[a.Function,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:String.fromCodePoint(...t)}];break}return consumeUrlToken(e,n)}return n.advanceCodePoint(),[a.Function,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:String.fromCodePoint(...t)}]}function checkIfThreeCodePointsWouldStartAUnicodeRange(e){return!(117!==e.source.codePointAt(e.cursor)&&85!==e.source.codePointAt(e.cursor)||e.source.codePointAt(e.cursor+1)!==s||63!==e.source.codePointAt(e.cursor+2)&&!isHexDigitCodePoint(e.source.codePointAt(e.cursor+2)??-1))}function consumeUnicodeRangeToken(e,n){n.advanceCodePoint(2);const t=[],o=[];let i;for(;void 0!==(i=n.source.codePointAt(n.cursor))&&t.length<6&&isHexDigitCodePoint(i);)t.push(i),n.advanceCodePoint();for(;void 0!==(i=n.source.codePointAt(n.cursor))&&t.length<6&&63===i;)0===o.length&&o.push(...t),t.push(48),o.push(70),n.advanceCodePoint();if(!o.length&&n.source.codePointAt(n.cursor)===r&&isHexDigitCodePoint(n.source.codePointAt(n.cursor+1)??-1))for(n.advanceCodePoint();void 0!==(i=n.source.codePointAt(n.cursor))&&o.length<6&&isHexDigitCodePoint(i);)o.push(i),n.advanceCodePoint();if(!o.length){const e=parseInt(String.fromCodePoint(...t),16);return[a.UnicodeRange,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{startOfRange:e,endOfRange:e}]}const s=parseInt(String.fromCodePoint(...t),16),c=parseInt(String.fromCodePoint(...o),16);return[a.UnicodeRange,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{startOfRange:s,endOfRange:c}]}function tokenize(e,n){const t=tokenizer(e,n),o=[];for(;!t.endOfFile();)o.push(t.nextToken());return o.push(t.nextToken()),o}function tokenizer(n,c){const u=n.css.valueOf(),d=n.unicodeRangesAllowed??!1,p=new Reader(u),P={onParseError:c?.onParseError??noop};return{nextToken:function nextToken(){p.resetRepresentation();const n=p.source.codePointAt(p.cursor);if(void 0===n)return[a.EOF,"",-1,-1,void 0];if(47===n&&checkIfTwoCodePointsStartAComment(p))return consumeComment(P,p);if(d&&(117===n||85===n)&&checkIfThreeCodePointsWouldStartAUnicodeRange(p))return consumeUnicodeRangeToken(0,p);if(isIdentStartCodePoint(n))return consumeIdentLikeToken(P,p);if(isDigitCodePoint(n))return consumeNumericToken(P,p);switch(n){case 44:return p.advanceCodePoint(),[a.Comma,",",p.representationStart,p.representationEnd,void 0];case 58:return p.advanceCodePoint(),[a.Colon,":",p.representationStart,p.representationEnd,void 0];case 59:return p.advanceCodePoint(),[a.Semicolon,";",p.representationStart,p.representationEnd,void 0];case 40:return p.advanceCodePoint(),[a.OpenParen,"(",p.representationStart,p.representationEnd,void 0];case 41:return p.advanceCodePoint(),[a.CloseParen,")",p.representationStart,p.representationEnd,void 0];case 91:return p.advanceCodePoint(),[a.OpenSquare,"[",p.representationStart,p.representationEnd,void 0];case 93:return p.advanceCodePoint(),[a.CloseSquare,"]",p.representationStart,p.representationEnd,void 0];case 123:return p.advanceCodePoint(),[a.OpenCurly,"{",p.representationStart,p.representationEnd,void 0];case 125:return p.advanceCodePoint(),[a.CloseCurly,"}",p.representationStart,p.representationEnd,void 0];case 39:case 34:return consumeStringToken(P,p);case 35:return consumeHashToken(P,p);case s:case o:return checkIfThreeCodePointsWouldStartANumber(p)?consumeNumericToken(P,p):(p.advanceCodePoint(),[a.Delim,p.source[p.representationStart],p.representationStart,p.representationEnd,{value:p.source[p.representationStart]}]);case i:case t:case 12:case 9:case 32:return consumeWhiteSpace$1(p);case r:return checkIfThreeCodePointsWouldStartANumber(p)?consumeNumericToken(P,p):checkIfThreeCodePointsWouldStartCDC(p)?(p.advanceCodePoint(3),[a.CDC,"--\x3e",p.representationStart,p.representationEnd,void 0]):checkIfThreeCodePointsWouldStartAnIdentSequence(0,p)?consumeIdentLikeToken(P,p):(p.advanceCodePoint(),[a.Delim,"-",p.representationStart,p.representationEnd,{value:"-"}]);case 60:return checkIfFourCodePointsWouldStartCDO(p)?(p.advanceCodePoint(4),[a.CDO,"\x3c!--",p.representationStart,p.representationEnd,void 0]):(p.advanceCodePoint(),[a.Delim,"<",p.representationStart,p.representationEnd,{value:"<"}]);case 64:if(p.advanceCodePoint(),checkIfThreeCodePointsWouldStartAnIdentSequence(0,p)){const e=consumeIdentSequence(P,p);return[a.AtKeyword,p.source.slice(p.representationStart,p.representationEnd+1),p.representationStart,p.representationEnd,{value:String.fromCodePoint(...e)}]}return[a.Delim,"@",p.representationStart,p.representationEnd,{value:"@"}];case 92:{if(checkIfTwoCodePointsAreAValidEscape(p))return consumeIdentLikeToken(P,p);p.advanceCodePoint();const n=[a.Delim,"\\",p.representationStart,p.representationEnd,{value:"\\"}];return P.onParseError(new ParseErrorWithToken(e.InvalidEscapeSequenceAfterBackslash,p.representationStart,p.representationEnd,["4.3.1. Consume a token","U+005C REVERSE SOLIDUS (\\)","The input stream does not start with a valid escape sequence"],n)),n}}return p.advanceCodePoint(),[a.Delim,p.source[p.representationStart],p.representationStart,p.representationEnd,{value:p.source[p.representationStart]}]},endOfFile:function endOfFile(){return void 0===p.source.codePointAt(p.cursor)}}}function noop(){}function mutateIdent(e,n){const t=[];for(const e of n)t.push(e.codePointAt(0));const o=String.fromCodePoint(...ensureThatValueRoundTripsAsIdent(t));e[1]=o,e[4].value=n}function mutateUnit(e,n){const t=[];for(const e of n)t.push(e.codePointAt(0));const o=ensureThatValueRoundTripsAsIdent(t);101===o[0]&&insertEscapedCodePoint(o,0,o[0]);const r=String.fromCodePoint(...o),i="+"===e[4].signCharacter?e[4].signCharacter:"",s=e[4].value.toString();e[1]=`${i}${s}${r}`,e[4].unit=n}function ensureThatValueRoundTripsAsIdent(e){let n=0;e[0]===r&&e[1]===r?n=2:e[0]===r&&e[1]?(n=2,isIdentStartCodePoint(e[1])||(n+=insertEscapedCodePoint(e,1,e[1]))):isIdentStartCodePoint(e[0])?n=1:(n=1,n+=insertEscapedCodePoint(e,0,e[0]));for(let t=n;t<e.length;t++)isIdentCodePoint(e[t])||(t+=insertEscapedCodePoint(e,t,e[t]));return e}function insertEscapedCodePoint(e,n,t){const o=t.toString(16),r=[];for(const e of o)r.push(e.codePointAt(0));const i=e[n+1];return n===e.length-1||i&&isHexDigitCodePoint(i)?(e.splice(n,1,92,...r,32),1+r.length):(e.splice(n,1,92,...r),r.length)}const p=Object.values(a);function isToken(e){return!!Array.isArray(e)&&(!(e.length<4)&&(!!p.includes(e[0])&&("string"==typeof e[1]&&("number"==typeof e[2]&&"number"==typeof e[3]))))}function isTokenNumeric(e){if(!e)return!1;switch(e[0]){case a.Dimension:case a.Number:case a.Percentage:return!0;default:return!1}}function isTokenWhiteSpaceOrComment(e){if(!e)return!1;switch(e[0]){case a.Whitespace:case a.Comment:return!0;default:return!1}}function isTokenAtKeyword(e){return!!e&&e[0]===a.AtKeyword}function isTokenBadString(e){return!!e&&e[0]===a.BadString}function isTokenBadURL(e){return!!e&&e[0]===a.BadURL}function isTokenCDC(e){return!!e&&e[0]===a.CDC}function isTokenCDO(e){return!!e&&e[0]===a.CDO}function isTokenColon(e){return!!e&&e[0]===a.Colon}function isTokenComma(e){return!!e&&e[0]===a.Comma}function isTokenComment(e){return!!e&&e[0]===a.Comment}function isTokenDelim(e){return!!e&&e[0]===a.Delim}function isTokenDimension(e){return!!e&&e[0]===a.Dimension}function isTokenEOF(e){return!!e&&e[0]===a.EOF}function isTokenFunction(e){return!!e&&e[0]===a.Function}function isTokenHash(e){return!!e&&e[0]===a.Hash}function isTokenIdent(e){return!!e&&e[0]===a.Ident}function isTokenNumber(e){return!!e&&e[0]===a.Number}function isTokenPercentage(e){return!!e&&e[0]===a.Percentage}function isTokenSemicolon(e){return!!e&&e[0]===a.Semicolon}function isTokenString(e){return!!e&&e[0]===a.String}function isTokenURL(e){return!!e&&e[0]===a.URL}function isTokenWhitespace(e){return!!e&&e[0]===a.Whitespace}function isTokenOpenParen(e){return!!e&&e[0]===a.OpenParen}function isTokenCloseParen(e){return!!e&&e[0]===a.CloseParen}function isTokenOpenSquare(e){return!!e&&e[0]===a.OpenSquare}function isTokenCloseSquare(e){return!!e&&e[0]===a.CloseSquare}function isTokenOpenCurly(e){return!!e&&e[0]===a.OpenCurly}function isTokenCloseCurly(e){return!!e&&e[0]===a.CloseCurly}function isTokenUnicodeRange(e){return!!e&&e[0]===a.UnicodeRange}var P;function tokenizeGridTemplateAreas(e){const n=[],r=new Reader(e.valueOf());e:for(;;){r.resetRepresentation();const e=r.source.codePointAt(r.cursor);if(void 0===e)break;switch(e){case i:case t:case 12:case 9:case 32:consumeWhiteSpace(r);continue e;case o:n.push(consumeNullCell(r));continue e;default:if(0===e||isSurrogate(e)||isIdentCodePoint(e)){n.push(consumeNamedCell(r));continue e}n.push(consumeTrash(r));continue e}}return n}function consumeNamedCell(e){const n=[];for(;;){const t=e.source.codePointAt(e.cursor)??-1;if(0===t||isSurrogate(t))n.push(c),e.advanceCodePoint(+(t>65535)+1);else{if(!isIdentCodePoint(t))break;n.push(t),e.advanceCodePoint(+(t>65535)+1)}}return{type:P.NamedCell,value:String.fromCodePoint(...n)}}function consumeNullCell(e){for(;e.source.codePointAt(e.cursor)===o;)e.advanceCodePoint();return{type:P.NullCell,value:e.source.slice(e.representationStart,e.representationEnd+1)}}function consumeWhiteSpace(e){for(;isWhitespace(e.source.codePointAt(e.cursor)??-1);)e.advanceCodePoint()}function consumeTrash(e){e.advanceCodePoint();e:for(;;){const n=e.source.codePointAt(e.cursor);if(void 0===n)break e;switch(n){case i:case t:case 12:case 9:case 32:case o:case 0:break e;default:if(isSurrogate(n)||isIdentCodePoint(n))break e;e.advanceCodePoint();continue e}}return{type:P.Trash,value:e.source.slice(e.representationStart,e.representationEnd+1)}}!function(e){e.NamedCell="named-cell-token",e.NullCell="null-cell-token",e.Trash="trash-token"}(P||(P={}));export{d as HashType,u as NumberType,ParseError,e as ParseErrorMessage,ParseErrorWithToken,a as TokenType,P as TokenTypeGridTemplateAreas,cloneTokens,isToken,isTokenAtKeyword,isTokenBadString,isTokenBadURL,isTokenCDC,isTokenCDO,isTokenCloseCurly,isTokenCloseParen,isTokenCloseSquare,isTokenColon,isTokenComma,isTokenComment,isTokenDelim,isTokenDimension,isTokenEOF,isTokenFunction,isTokenHash,isTokenIdent,isTokenNumber,isTokenNumeric,isTokenOpenCurly,isTokenOpenParen,isTokenOpenSquare,isTokenPercentage,isTokenSemicolon,isTokenString,isTokenURL,isTokenUnicodeRange,isTokenWhiteSpaceOrComment,isTokenWhitespace,mirrorVariant,mirrorVariantType,mutateIdent,mutateUnit,stringify,tokenize,tokenizeGridTemplateAreas,tokenizer};
