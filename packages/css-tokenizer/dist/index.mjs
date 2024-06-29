class ParseError extends Error{sourceStart;sourceEnd;parserState;constructor(e,n,o,r){super(e),this.name="ParseError",this.sourceStart=n,this.sourceEnd=o,this.parserState=r}}class Reader{cursor=0;source="";codePointSource=[];representationIndices=[-1];length=0;representationStart=0;representationEnd=-1;constructor(e){this.source=e;{let n=-1,o="";for(o of e)n+=o.length,this.codePointSource.push(o.codePointAt(0)),this.representationIndices.push(n)}this.length=this.codePointSource.length}advanceCodePoint(e=1){this.cursor=this.cursor+e,this.representationEnd=this.representationIndices[this.cursor]}readCodePoint(e=1){const n=this.codePointSource[this.cursor];return void 0!==n&&(this.cursor=this.cursor+e,this.representationEnd=this.representationIndices[this.cursor],n)}unreadCodePoint(e=1){this.cursor=this.cursor-e,this.representationEnd=this.representationIndices[this.cursor]}resetRepresentation(){this.representationStart=this.representationIndices[this.cursor]+1,this.representationEnd=-1}}const e="undefined"!=typeof globalThis&&"structuredClone"in globalThis;function cloneTokens(n){return e?structuredClone(n):JSON.parse(JSON.stringify(n))}function stringify(...e){let n="";for(let o=0;o<e.length;o++)n+=e[o][1];return n}const n=39,o=42,r=8,t=13,i=9,s=58,c=44,a=64,u=127,d=33,P=12,p=46,S=62,C=45,l=31,f=69,m=101,h=123,k=40,E=91,v=60,g=10,T=11,I=95,O=1114111,U=0,D=35,w=37,R=43,A=34,L=65533,y=92,q=125,W=41,N=93,x=59,F=14,b=47,H=32,B=117,V=85,K=114,z=82,M=108,$=76,J=63,_=48,j=70;function checkIfFourCodePointsWouldStartCDO(e){return e.codePointSource[e.cursor]===v&&e.codePointSource[e.cursor+1]===d&&e.codePointSource[e.cursor+2]===C&&e.codePointSource[e.cursor+3]===C}function isDigitCodePoint(e){return e>=48&&e<=57}function isUppercaseLetterCodePoint(e){return e>=65&&e<=90}function isLowercaseLetterCodePoint(e){return e>=97&&e<=122}function isHexDigitCodePoint(e){return isDigitCodePoint(e)||e>=97&&e<=102||e>=65&&e<=70}function isLetterCodePoint(e){return isLowercaseLetterCodePoint(e)||isUppercaseLetterCodePoint(e)}function isIdentStartCodePoint(e){return isLetterCodePoint(e)||isNonASCII_IdentCodePoint(e)||e===I}function isIdentCodePoint(e){return isIdentStartCodePoint(e)||isDigitCodePoint(e)||e===C}function isNonASCII_IdentCodePoint(e){return 183===e||8204===e||8205===e||8255===e||8256===e||8204===e||(192<=e&&e<=214||216<=e&&e<=246||248<=e&&e<=893||895<=e&&e<=8191||8304<=e&&e<=8591||11264<=e&&e<=12271||12289<=e&&e<=55295||63744<=e&&e<=64975||65008<=e&&e<=65533||e>=65536)}function isNewLine(e){return 10===e||13===e||12===e}function isWhitespace(e){return 32===e||10===e||9===e||13===e||12===e}function checkIfTwoCodePointsAreAValidEscape(e){return e.codePointSource[e.cursor]===y&&!isNewLine(e.codePointSource[e.cursor+1])}function checkIfThreeCodePointsWouldStartAnIdentSequence(e,n){return n.codePointSource[n.cursor]===C?n.codePointSource[n.cursor+1]===C||(!!isIdentStartCodePoint(n.codePointSource[n.cursor+1])||n.codePointSource[n.cursor+1]===y&&!isNewLine(n.codePointSource[n.cursor+2])):!!isIdentStartCodePoint(n.codePointSource[n.cursor])||checkIfTwoCodePointsAreAValidEscape(n)}function checkIfThreeCodePointsWouldStartANumber(e){return e.codePointSource[e.cursor]===R||e.codePointSource[e.cursor]===C?!!isDigitCodePoint(e.codePointSource[e.cursor+1])||e.codePointSource[e.cursor+1]===p&&isDigitCodePoint(e.codePointSource[e.cursor+2]):e.codePointSource[e.cursor]===p?isDigitCodePoint(e.codePointSource[e.cursor+1]):isDigitCodePoint(e.codePointSource[e.cursor])}function checkIfTwoCodePointsStartAComment(e){return e.codePointSource[e.cursor]===b&&e.codePointSource[e.cursor+1]===o}function checkIfThreeCodePointsWouldStartCDC(e){return e.codePointSource[e.cursor]===C&&e.codePointSource[e.cursor+1]===C&&e.codePointSource[e.cursor+2]===S}var Q,G,X;function mirrorVariantType(e){switch(e){case Q.OpenParen:return Q.CloseParen;case Q.CloseParen:return Q.OpenParen;case Q.OpenCurly:return Q.CloseCurly;case Q.CloseCurly:return Q.OpenCurly;case Q.OpenSquare:return Q.CloseSquare;case Q.CloseSquare:return Q.OpenSquare;default:return null}}function mirrorVariant(e){switch(e[0]){case Q.OpenParen:return[Q.CloseParen,")",-1,-1,void 0];case Q.CloseParen:return[Q.OpenParen,"(",-1,-1,void 0];case Q.OpenCurly:return[Q.CloseCurly,"}",-1,-1,void 0];case Q.CloseCurly:return[Q.OpenCurly,"{",-1,-1,void 0];case Q.OpenSquare:return[Q.CloseSquare,"]",-1,-1,void 0];case Q.CloseSquare:return[Q.OpenSquare,"[",-1,-1,void 0];default:return null}}function consumeComment(e,n){for(n.advanceCodePoint(2);;){const r=n.readCodePoint();if(!1===r){e.onParseError(new ParseError("Unexpected EOF while consuming a comment.",n.representationStart,n.representationEnd,["4.3.2. Consume comments","Unexpected EOF"]));break}if(r===o&&(void 0!==n.codePointSource[n.cursor]&&n.codePointSource[n.cursor]===b)){n.advanceCodePoint();break}}return[Q.Comment,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,void 0]}function consumeEscapedCodePoint(e,n){const o=n.readCodePoint();if(!1===o)return e.onParseError(new ParseError("Unexpected EOF while consuming an escaped code point.",n.representationStart,n.representationEnd,["4.3.7. Consume an escaped code point","Unexpected EOF"])),L;if(isHexDigitCodePoint(o)){const e=[o];for(;void 0!==n.codePointSource[n.cursor]&&isHexDigitCodePoint(n.codePointSource[n.cursor])&&e.length<6;)e.push(n.codePointSource[n.cursor]),n.advanceCodePoint();isWhitespace(n.codePointSource[n.cursor])&&n.advanceCodePoint();const t=parseInt(String.fromCodePoint(...e),16);return 0===t?L:(r=t)>=55296&&r<=57343||t>O?L:t}var r;return o}function consumeIdentSequence(e,n){const o=[];for(;;)if(isIdentCodePoint(n.codePointSource[n.cursor]))o.push(n.codePointSource[n.cursor]),n.advanceCodePoint();else{if(!checkIfTwoCodePointsAreAValidEscape(n))return o;n.advanceCodePoint(),o.push(consumeEscapedCodePoint(e,n))}}function consumeHashToken(e,n){if(n.advanceCodePoint(),void 0!==n.codePointSource[n.cursor]&&(isIdentCodePoint(n.codePointSource[n.cursor])||checkIfTwoCodePointsAreAValidEscape(n))){let o=X.Unrestricted;checkIfThreeCodePointsWouldStartAnIdentSequence(0,n)&&(o=X.ID);const r=consumeIdentSequence(e,n);return[Q.Hash,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:String.fromCodePoint(...r),type:o}]}return[Q.Delim,"#",n.representationStart,n.representationEnd,{value:"#"}]}function consumeNumber(e,n){let o=G.Integer;for(n.codePointSource[n.cursor]!==R&&n.codePointSource[n.cursor]!==C||n.advanceCodePoint();isDigitCodePoint(n.codePointSource[n.cursor]);)n.advanceCodePoint();if(n.codePointSource[n.cursor]===p&&isDigitCodePoint(n.codePointSource[n.cursor+1]))for(n.advanceCodePoint(2),o=G.Number;isDigitCodePoint(n.codePointSource[n.cursor]);)n.advanceCodePoint();if(n.codePointSource[n.cursor]===m||n.codePointSource[n.cursor]===f){if(isDigitCodePoint(n.codePointSource[n.cursor+1]))n.advanceCodePoint(2);else{if(n.codePointSource[n.cursor+1]!==C&&n.codePointSource[n.cursor+1]!==R||!isDigitCodePoint(n.codePointSource[n.cursor+2]))return o;n.advanceCodePoint(3)}for(o=G.Number;isDigitCodePoint(n.codePointSource[n.cursor]);)n.advanceCodePoint()}return o}function consumeNumericToken(e,n){let o;{const e=n.codePointSource[n.cursor];e===C?o="-":e===R&&(o="+")}const r=consumeNumber(0,n),t=parseFloat(n.source.slice(n.representationStart,n.representationEnd+1));if(checkIfThreeCodePointsWouldStartAnIdentSequence(0,n)){const i=consumeIdentSequence(e,n);return[Q.Dimension,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:t,signCharacter:o,type:r,unit:String.fromCodePoint(...i)}]}return n.codePointSource[n.cursor]===w?(n.advanceCodePoint(),[Q.Percentage,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:t,signCharacter:o}]):[Q.Number,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:t,signCharacter:o,type:r}]}function consumeWhiteSpace(e){for(;isWhitespace(e.codePointSource[e.cursor]);)e.advanceCodePoint();return[Q.Whitespace,e.source.slice(e.representationStart,e.representationEnd+1),e.representationStart,e.representationEnd,void 0]}function consumeStringToken(e,n){let o="";const r=n.readCodePoint();for(;;){const t=n.readCodePoint();if(!1===t)return e.onParseError(new ParseError("Unexpected EOF while consuming a string token.",n.representationStart,n.representationEnd,["4.3.5. Consume a string token","Unexpected EOF"])),[Q.String,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:o}];if(isNewLine(t))return e.onParseError(new ParseError("Unexpected newline while consuming a string token.",n.representationStart,n.representationEnd,["4.3.5. Consume a string token","Unexpected newline"])),n.unreadCodePoint(),[Q.BadString,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,void 0];if(t===r)return[Q.String,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:o}];if(t!==y)o+=String.fromCodePoint(t);else{if(void 0===n.codePointSource[n.cursor])continue;if(isNewLine(n.codePointSource[n.cursor])){n.advanceCodePoint();continue}o+=String.fromCodePoint(consumeEscapedCodePoint(e,n))}}}function checkIfCodePointsMatchURLIdent(e){return!(3!==e.length||e[0]!==B&&e[0]!==V||e[1]!==K&&e[1]!==z||e[2]!==M&&e[2]!==$)}function consumeBadURL(e,n){for(;;){if(void 0===n.codePointSource[n.cursor])return;if(n.codePointSource[n.cursor]===W)return void n.advanceCodePoint();checkIfTwoCodePointsAreAValidEscape(n)?(n.advanceCodePoint(),consumeEscapedCodePoint(e,n)):n.advanceCodePoint()}}function consumeUrlToken(e,o){for(;isWhitespace(o.codePointSource[o.cursor]);)o.advanceCodePoint();let t="";for(;;){if(void 0===o.codePointSource[o.cursor])return e.onParseError(new ParseError("Unexpected EOF while consuming a url token.",o.representationStart,o.representationEnd,["4.3.6. Consume a url token","Unexpected EOF"])),[Q.URL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:t}];if(o.codePointSource[o.cursor]===W)return o.advanceCodePoint(),[Q.URL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:t}];if(isWhitespace(o.codePointSource[o.cursor])){for(o.advanceCodePoint();isWhitespace(o.codePointSource[o.cursor]);)o.advanceCodePoint();return void 0===o.codePointSource[o.cursor]?(e.onParseError(new ParseError("Unexpected EOF while consuming a url token.",o.representationStart,o.representationEnd,["4.3.6. Consume a url token","Consume as much whitespace as possible","Unexpected EOF"])),[Q.URL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:t}]):o.codePointSource[o.cursor]===W?(o.advanceCodePoint(),[Q.URL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:t}]):(consumeBadURL(e,o),[Q.BadURL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0])}if(o.codePointSource[o.cursor]===A||o.codePointSource[o.cursor]===n||o.codePointSource[o.cursor]===k||((i=o.codePointSource[o.cursor])===T||i===u||U<=i&&i<=r||F<=i&&i<=l))return consumeBadURL(e,o),e.onParseError(new ParseError("Unexpected character while consuming a url token.",o.representationStart,o.representationEnd,["4.3.6. Consume a url token","Unexpected U+0022 QUOTATION MARK (\"), U+0027 APOSTROPHE ('), U+0028 LEFT PARENTHESIS (() or non-printable code point"])),[Q.BadURL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0];if(o.codePointSource[o.cursor]===y){if(checkIfTwoCodePointsAreAValidEscape(o)){o.advanceCodePoint(),t+=String.fromCodePoint(consumeEscapedCodePoint(e,o));continue}return consumeBadURL(e,o),e.onParseError(new ParseError("Invalid escape sequence while consuming a url token.",o.representationStart,o.representationEnd,["4.3.6. Consume a url token","U+005C REVERSE SOLIDUS (\\)","The input stream does not start with a valid escape sequence"])),[Q.BadURL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0]}t+=String.fromCodePoint(o.codePointSource[o.cursor]),o.advanceCodePoint()}var i}function consumeIdentLikeToken(e,o){const r=consumeIdentSequence(e,o);if(o.codePointSource[o.cursor]!==k)return[Q.Ident,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:String.fromCodePoint(...r)}];if(checkIfCodePointsMatchURLIdent(r)){o.advanceCodePoint();let t=0;for(;;){const e=isWhitespace(o.codePointSource[o.cursor]),i=isWhitespace(o.codePointSource[o.cursor+1]);if(e&&i){t+=1,o.advanceCodePoint(1);continue}const s=e?o.codePointSource[o.cursor+1]:o.codePointSource[o.cursor];if(s===A||s===n)return t>0&&o.unreadCodePoint(t),[Q.Function,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:String.fromCodePoint(...r)}];break}return consumeUrlToken(e,o)}return o.advanceCodePoint(),[Q.Function,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:String.fromCodePoint(...r)}]}function checkIfThreeCodePointsWouldStartAUnicodeRange(e){return!(e.codePointSource[e.cursor]!==B&&e.codePointSource[e.cursor]!==V||e.codePointSource[e.cursor+1]!==R||e.codePointSource[e.cursor+2]!==J&&!isHexDigitCodePoint(e.codePointSource[e.cursor+2]))}function consumeUnicodeRangeToken(e,n){n.advanceCodePoint(2);const o=[],r=[];for(;void 0!==n.codePointSource[n.cursor]&&o.length<6&&isHexDigitCodePoint(n.codePointSource[n.cursor]);)o.push(n.codePointSource[n.cursor]),n.advanceCodePoint();for(;void 0!==n.codePointSource[n.cursor]&&o.length<6&&n.codePointSource[n.cursor]===J;)0===r.length&&r.push(...o),o.push(_),r.push(j),n.advanceCodePoint();if(!r.length&&n.codePointSource[n.cursor]===C&&isHexDigitCodePoint(n.codePointSource[n.cursor+1]))for(n.advanceCodePoint();void 0!==n.codePointSource[n.cursor]&&r.length<6&&isHexDigitCodePoint(n.codePointSource[n.cursor]);)r.push(n.codePointSource[n.cursor]),n.advanceCodePoint();if(!r.length){const e=parseInt(String.fromCodePoint(...o),16);return[Q.UnicodeRange,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{startOfRange:e,endOfRange:e}]}const t=parseInt(String.fromCodePoint(...o),16),i=parseInt(String.fromCodePoint(...r),16);return[Q.UnicodeRange,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{startOfRange:t,endOfRange:i}]}function tokenize(e,n){const o=tokenizer(e,n),r=[];{for(;!o.endOfFile();){const e=o.nextToken();e&&r.push(e)}const e=o.nextToken();e&&r.push(e)}return r}function tokenizer(e,o){const r=e.css.valueOf(),u=e.unicodeRangesAllowed??!1,d=new Reader(r),S={onParseError:o?.onParseError??noop};return{nextToken:function nextToken(){d.resetRepresentation();const e=d.codePointSource[d.cursor];if(void 0===e)return[Q.EOF,"",-1,-1,void 0];if(e===b&&checkIfTwoCodePointsStartAComment(d))return consumeComment(S,d);if(u&&(e===B||e===V)&&checkIfThreeCodePointsWouldStartAUnicodeRange(d))return consumeUnicodeRangeToken(0,d);if(isIdentStartCodePoint(e))return consumeIdentLikeToken(S,d);if(isDigitCodePoint(e))return consumeNumericToken(S,d);switch(e){case c:return d.advanceCodePoint(),[Q.Comma,",",d.representationStart,d.representationEnd,void 0];case s:return d.advanceCodePoint(),[Q.Colon,":",d.representationStart,d.representationEnd,void 0];case x:return d.advanceCodePoint(),[Q.Semicolon,";",d.representationStart,d.representationEnd,void 0];case k:return d.advanceCodePoint(),[Q.OpenParen,"(",d.representationStart,d.representationEnd,void 0];case W:return d.advanceCodePoint(),[Q.CloseParen,")",d.representationStart,d.representationEnd,void 0];case E:return d.advanceCodePoint(),[Q.OpenSquare,"[",d.representationStart,d.representationEnd,void 0];case N:return d.advanceCodePoint(),[Q.CloseSquare,"]",d.representationStart,d.representationEnd,void 0];case h:return d.advanceCodePoint(),[Q.OpenCurly,"{",d.representationStart,d.representationEnd,void 0];case q:return d.advanceCodePoint(),[Q.CloseCurly,"}",d.representationStart,d.representationEnd,void 0];case n:case A:return consumeStringToken(S,d);case D:return consumeHashToken(S,d);case R:case p:return checkIfThreeCodePointsWouldStartANumber(d)?consumeNumericToken(S,d):(d.advanceCodePoint(),[Q.Delim,d.source[d.representationStart],d.representationStart,d.representationEnd,{value:d.source[d.representationStart]}]);case g:case t:case P:case i:case H:return consumeWhiteSpace(d);case C:return checkIfThreeCodePointsWouldStartANumber(d)?consumeNumericToken(S,d):checkIfThreeCodePointsWouldStartCDC(d)?(d.advanceCodePoint(3),[Q.CDC,"--\x3e",d.representationStart,d.representationEnd,void 0]):checkIfThreeCodePointsWouldStartAnIdentSequence(0,d)?consumeIdentLikeToken(S,d):(d.advanceCodePoint(),[Q.Delim,"-",d.representationStart,d.representationEnd,{value:"-"}]);case v:return checkIfFourCodePointsWouldStartCDO(d)?(d.advanceCodePoint(4),[Q.CDO,"\x3c!--",d.representationStart,d.representationEnd,void 0]):(d.advanceCodePoint(),[Q.Delim,"<",d.representationStart,d.representationEnd,{value:"<"}]);case a:if(d.advanceCodePoint(),checkIfThreeCodePointsWouldStartAnIdentSequence(0,d)){const e=consumeIdentSequence(S,d);return[Q.AtKeyword,d.source.slice(d.representationStart,d.representationEnd+1),d.representationStart,d.representationEnd,{value:String.fromCodePoint(...e)}]}return[Q.Delim,"@",d.representationStart,d.representationEnd,{value:"@"}];case y:return checkIfTwoCodePointsAreAValidEscape(d)?consumeIdentLikeToken(S,d):(d.advanceCodePoint(),S.onParseError(new ParseError('Invalid escape sequence after "\\"',d.representationStart,d.representationEnd,["4.3.1. Consume a token","U+005C REVERSE SOLIDUS (\\)","The input stream does not start with a valid escape sequence"])),[Q.Delim,"\\",d.representationStart,d.representationEnd,{value:"\\"}])}return d.advanceCodePoint(),[Q.Delim,d.source[d.representationStart],d.representationStart,d.representationEnd,{value:d.source[d.representationStart]}]},endOfFile:function endOfFile(){return void 0===d.codePointSource[d.cursor]}}}function noop(){}function mutateIdent(e,n){const o=[];for(const e of n)o.push(e.codePointAt(0));const r=String.fromCodePoint(...ensureThatValueRoundTripsAsIdent(o));e[1]=r,e[4].value=n}function mutateUnit(e,n){const o=[];for(const e of n)o.push(e.codePointAt(0));const r=ensureThatValueRoundTripsAsIdent(o);101===r[0]&&insertEscapedCodePoint(r,0,r[0]);const t=String.fromCodePoint(...r),i="+"===e[4].signCharacter?e[4].signCharacter:"",s=e[4].value.toString();e[1]=`${i}${s}${t}`,e[4].unit=n}function ensureThatValueRoundTripsAsIdent(e){let n=0;e[0]===C&&e[1]===C?n=2:e[0]===C&&e[1]?(n=2,isIdentStartCodePoint(e[1])||(n+=insertEscapedCodePoint(e,1,e[1]))):isIdentStartCodePoint(e[0])?n=1:(n=1,n+=insertEscapedCodePoint(e,0,e[0]));for(let o=n;o<e.length;o++)isIdentCodePoint(e[o])||(o+=insertEscapedCodePoint(e,o,e[o]));return e}function insertEscapedCodePoint(e,n,o){const r=o.toString(16),t=[];for(const e of r)t.push(e.codePointAt(0));const i=e[n+1];return n===e.length-1||i&&isHexDigitCodePoint(i)?(e.splice(n,1,92,...t,32),1+t.length):(e.splice(n,1,92,...t),t.length)}!function(e){e.Comment="comment",e.AtKeyword="at-keyword-token",e.BadString="bad-string-token",e.BadURL="bad-url-token",e.CDC="CDC-token",e.CDO="CDO-token",e.Colon="colon-token",e.Comma="comma-token",e.Delim="delim-token",e.Dimension="dimension-token",e.EOF="EOF-token",e.Function="function-token",e.Hash="hash-token",e.Ident="ident-token",e.Number="number-token",e.Percentage="percentage-token",e.Semicolon="semicolon-token",e.String="string-token",e.URL="url-token",e.Whitespace="whitespace-token",e.OpenParen="(-token",e.CloseParen=")-token",e.OpenSquare="[-token",e.CloseSquare="]-token",e.OpenCurly="{-token",e.CloseCurly="}-token",e.UnicodeRange="unicode-range-token"}(Q||(Q={})),function(e){e.Integer="integer",e.Number="number"}(G||(G={})),function(e){e.Unrestricted="unrestricted",e.ID="id"}(X||(X={}));const Y=Object.values(Q);function isToken(e){return!!Array.isArray(e)&&(!(e.length<4)&&(!!Y.includes(e[0])&&("string"==typeof e[1]&&("number"==typeof e[2]&&"number"==typeof e[3]))))}function isTokenNumeric(e){switch(e[0]){case Q.Dimension:case Q.Number:case Q.Percentage:return!0;default:return!1}}function isTokenWhiteSpaceOrComment(e){switch(e[0]){case Q.Whitespace:case Q.Comment:return!0;default:return!1}}function isTokenAtKeyword(e){return!!e&&e[0]===Q.AtKeyword}function isTokenBadString(e){return!!e&&e[0]===Q.BadString}function isTokenBadURL(e){return!!e&&e[0]===Q.BadURL}function isTokenCDC(e){return!!e&&e[0]===Q.CDC}function isTokenCDO(e){return!!e&&e[0]===Q.CDO}function isTokenColon(e){return!!e&&e[0]===Q.Colon}function isTokenComma(e){return!!e&&e[0]===Q.Comma}function isTokenComment(e){return!!e&&e[0]===Q.Comment}function isTokenDelim(e){return!!e&&e[0]===Q.Delim}function isTokenDimension(e){return!!e&&e[0]===Q.Dimension}function isTokenEOF(e){return!!e&&e[0]===Q.EOF}function isTokenFunction(e){return!!e&&e[0]===Q.Function}function isTokenHash(e){return!!e&&e[0]===Q.Hash}function isTokenIdent(e){return!!e&&e[0]===Q.Ident}function isTokenNumber(e){return!!e&&e[0]===Q.Number}function isTokenPercentage(e){return!!e&&e[0]===Q.Percentage}function isTokenSemicolon(e){return!!e&&e[0]===Q.Semicolon}function isTokenString(e){return!!e&&e[0]===Q.String}function isTokenURL(e){return!!e&&e[0]===Q.URL}function isTokenWhitespace(e){return!!e&&e[0]===Q.Whitespace}function isTokenOpenParen(e){return!!e&&e[0]===Q.OpenParen}function isTokenCloseParen(e){return!!e&&e[0]===Q.CloseParen}function isTokenOpenSquare(e){return!!e&&e[0]===Q.OpenSquare}function isTokenCloseSquare(e){return!!e&&e[0]===Q.CloseSquare}function isTokenOpenCurly(e){return!!e&&e[0]===Q.OpenCurly}function isTokenCloseCurly(e){return!!e&&e[0]===Q.CloseCurly}function isTokenUnicodeRange(e){return!!e&&e[0]===Q.UnicodeRange}export{X as HashType,G as NumberType,ParseError,Reader,Q as TokenType,cloneTokens,isToken,isTokenAtKeyword,isTokenBadString,isTokenBadURL,isTokenCDC,isTokenCDO,isTokenCloseCurly,isTokenCloseParen,isTokenCloseSquare,isTokenColon,isTokenComma,isTokenComment,isTokenDelim,isTokenDimension,isTokenEOF,isTokenFunction,isTokenHash,isTokenIdent,isTokenNumber,isTokenNumeric,isTokenOpenCurly,isTokenOpenParen,isTokenOpenSquare,isTokenPercentage,isTokenSemicolon,isTokenString,isTokenURL,isTokenUnicodeRange,isTokenWhiteSpaceOrComment,isTokenWhitespace,mirrorVariant,mirrorVariantType,mutateIdent,mutateUnit,stringify,tokenize,tokenizer};
