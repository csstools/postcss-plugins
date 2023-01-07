class ParseError extends Error{sourceStart;sourceEnd;parserState;constructor(e,r,n,o){super(e),this.name="ParseError",this.sourceStart=r,this.sourceEnd=n,this.parserState=o}}class Reader{cursor;source="";codePointSource=[];length=0;representationStart=0;representationEnd=-1;constructor(e){this.cursor=0,this.source=e,this.length=e.length,this.codePointSource=new Array(this.length);for(let e=0;e<this.length;e++)this.codePointSource[e]=this.source.charCodeAt(e)}cursorPositionOfLastReadCodePoint(){return this.cursor-1}advanceCodePoint(e=1){this.cursor+=e,this.representationEnd=this.cursor-1}readCodePoint(e=1){const r=this.codePointSource[this.cursor];return void 0!==r&&(this.cursor+=e,this.representationEnd=this.cursor-1,r)}unreadCodePoint(e=1){return 0!==this.cursor&&(this.cursor-=e,this.representationEnd=this.cursor-1,!0)}}var e,r,n;function mirrorVariantType(r){switch(r){case e.OpenParen:return e.CloseParen;case e.CloseParen:return e.OpenParen;case e.OpenCurly:return e.CloseCurly;case e.CloseCurly:return e.OpenCurly;case e.OpenSquare:return e.CloseSquare;case e.CloseSquare:return e.OpenSquare;default:return null}}function isToken(r){return!!Array.isArray(r)&&(!(r.length<4)&&(r[0]in e&&("string"==typeof r[1]&&("number"==typeof r[2]&&"number"==typeof r[3]))))}function stringify(...e){let r="";for(let n=0;n<e.length;n++)r+=e[n][1];return r}!function(e){e.Comment="comment",e.AtKeyword="at-keyword-token",e.BadString="bad-string-token",e.BadURL="bad-url-token",e.CDC="CDC-token",e.CDO="CDO-token",e.Colon="colon-token",e.Comma="comma-token",e.Delim="delim-token",e.Dimension="dimension-token",e.EOF="EOF-token",e.Function="function-token",e.Hash="hash-token",e.Ident="ident-token",e.Number="number-token",e.Percentage="percentage-token",e.Semicolon="semicolon-token",e.String="string-token",e.URL="url-token",e.Whitespace="whitespace-token",e.OpenParen="(-token",e.CloseParen=")-token",e.OpenSquare="[-token",e.CloseSquare="]-token",e.OpenCurly="{-token",e.CloseCurly="}-token"}(e||(e={})),function(e){e.Integer="integer",e.Number="number"}(r||(r={})),function(e){e.Unrestricted="unrestricted",e.ID="id"}(n||(n={}));const o=45,t=65533;function checkIfFourCodePointsWouldStartCDO(e,r){return 60===r.codePointSource[r.cursor]&&33===r.codePointSource[r.cursor+1]&&r.codePointSource[r.cursor+2]===o&&r.codePointSource[r.cursor+3]===o}function isDigitCodePoint(e){return e>=48&&e<=57}function isUppercaseLetterCodePoint(e){return e>=65&&e<=90}function isLowercaseLetterCodePoint(e){return e>=97&&e<=122}function isHexDigitCodePoint(e){return isDigitCodePoint(e)||e>=97&&e<=102||e>=65&&e<=70}function isLetterCodePoint(e){return isLowercaseLetterCodePoint(e)||isUppercaseLetterCodePoint(e)}function isNonASCIICodePoint(e){return e>=128}function isIdentStartCodePoint(e){return isLetterCodePoint(e)||isNonASCIICodePoint(e)||95===e}function isIdentCodePoint(e){return isIdentStartCodePoint(e)||isDigitCodePoint(e)||e===o}function isNewLine(e){return 10===e||13===e||12===e}function isWhitespace(e){return 32===e||10===e||9===e||13===e||12===e}function checkIfTwoCodePointsAreAValidEscape(e,r){return 92===r.codePointSource[r.cursor]&&!isNewLine(r.codePointSource[r.cursor+1])}function checkIfThreeCodePointsWouldStartAnIdentSequence(e,r){return r.codePointSource[r.cursor]===o?r.codePointSource[r.cursor+1]===o||(!!isIdentStartCodePoint(r.codePointSource[r.cursor+1])||92===r.codePointSource[r.cursor+1]&&10!==r.codePointSource[r.cursor+2]):!!isIdentStartCodePoint(r.codePointSource[r.cursor])||checkIfTwoCodePointsAreAValidEscape(0,r)}function checkIfThreeCodePointsWouldStartANumber(e,r){return 43===r.codePointSource[r.cursor]||r.codePointSource[r.cursor]===o?!!isDigitCodePoint(r.codePointSource[r.cursor+1])||46===r.codePointSource[r.cursor+1]&&isDigitCodePoint(r.codePointSource[r.cursor+2]):46===r.codePointSource[r.cursor]?isDigitCodePoint(r.codePointSource[r.cursor+1]):!!isDigitCodePoint(r.codePointSource[r.cursor])}function checkIfTwoCodePointsStartAComment(e,r){return 47===r.codePointSource[r.cursor]&&42===r.codePointSource[r.cursor+1]}function checkIfThreeCodePointsWouldStartCDC(e,r){return r.codePointSource[r.cursor]===o&&r.codePointSource[r.cursor+1]===o&&62===r.codePointSource[r.cursor+2]}function consumeComment(r,n){for(n.advanceCodePoint(2);;){const e=n.readCodePoint();if(!1===e){r.onParseError(new ParseError("Unexpected EOF while consuming a comment.",n.representationStart,n.representationEnd,["4.3.2. Consume comments","Unexpected EOF"]));break}if(42===e&&(void 0!==n.codePointSource[n.cursor]&&47===n.codePointSource[n.cursor])){n.advanceCodePoint();break}}return[e.Comment,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,void 0]}function consumeEscapedCodePoint(e,r){const n=r.readCodePoint();if(!1===n)return e.onParseError(new ParseError("Unexpected EOF while consuming an escaped code point.",r.representationStart,r.representationEnd,["4.3.7. Consume an escaped code point","Unexpected EOF"])),t;if(isHexDigitCodePoint(n)){const e=[n];for(;void 0!==r.codePointSource[r.cursor]&&isHexDigitCodePoint(r.codePointSource[r.cursor])&&e.length<6;)e.push(r.codePointSource[r.cursor]),r.advanceCodePoint();isWhitespace(r.codePointSource[r.cursor])&&r.advanceCodePoint();const i=parseInt(String.fromCharCode(...e),16);return 0===i?t:(o=i)>=55296&&o<=57343||i>1114111?t:i}var o;return n}function consumeIdentSequence(e,r){const n=[];for(;;)if(isIdentCodePoint(r.codePointSource[r.cursor]))n.push(r.codePointSource[r.cursor]),r.advanceCodePoint();else{if(!checkIfTwoCodePointsAreAValidEscape(0,r))return n;r.advanceCodePoint(),n.push(consumeEscapedCodePoint(e,r))}}function consumeHashToken(r,o){if(o.advanceCodePoint(),void 0!==o.codePointSource[o.cursor]&&isIdentCodePoint(o.codePointSource[o.cursor])||checkIfTwoCodePointsAreAValidEscape(0,o)){let t=n.Unrestricted;checkIfThreeCodePointsWouldStartAnIdentSequence(0,o)&&(t=n.ID);const i=consumeIdentSequence(r,o);return[e.Hash,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:String.fromCharCode(...i),type:t}]}return[e.Delim,"#",o.representationStart,o.representationEnd,{value:"#"}]}function consumeNumber(e,n){let t=r.Integer;for(43!==n.codePointSource[n.cursor]&&n.codePointSource[n.cursor]!==o||n.advanceCodePoint();isDigitCodePoint(n.codePointSource[n.cursor]);)n.advanceCodePoint();if(46===n.codePointSource[n.cursor]&&isDigitCodePoint(n.codePointSource[n.cursor+1]))for(n.advanceCodePoint(2),t=r.Number;isDigitCodePoint(n.codePointSource[n.cursor]);)n.advanceCodePoint();if((101===n.codePointSource[n.cursor]||69===n.codePointSource[n.cursor])&&isDigitCodePoint(n.codePointSource[n.cursor+1]))for(n.advanceCodePoint(2),t=r.Number;isDigitCodePoint(n.codePointSource[n.cursor]);)n.advanceCodePoint();if((101===n.codePointSource[n.cursor]||69===n.codePointSource[n.cursor])&&(n.codePointSource[n.cursor+1]===o||43===n.codePointSource[n.cursor+1])&&isDigitCodePoint(n.codePointSource[n.cursor+2]))for(n.advanceCodePoint(3),t=r.Number;isDigitCodePoint(n.codePointSource[n.cursor]);)n.advanceCodePoint();return[parseFloat(n.source.slice(n.representationStart,n.representationEnd+1)),t]}function consumeNumericToken(r,n){const o=consumeNumber(0,n);if(checkIfThreeCodePointsWouldStartAnIdentSequence(0,n)){const t=consumeIdentSequence(r,n);return[e.Dimension,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:o[0],type:o[1],unit:String.fromCharCode(...t)}]}return 37===n.codePointSource[n.cursor]?(n.advanceCodePoint(),[e.Percentage,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:o[0]}]):[e.Number,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:o[0],type:o[1]}]}function consumeWhiteSpace(r,n){for(;isWhitespace(n.codePointSource[n.cursor]);)n.advanceCodePoint();return[e.Whitespace,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,void 0]}function consumeStringToken(r,n){let o="";const t=n.readCodePoint();for(;;){const i=n.readCodePoint();if(!1===i)return r.onParseError(new ParseError("Unexpected EOF while consuming a string token.",n.representationStart,n.representationEnd,["4.3.5. Consume a string token","Unexpected EOF"])),[e.String,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:o}];if(isNewLine(i))return r.onParseError(new ParseError("Unexpected newline while consuming a string token.",n.representationStart,n.representationEnd,["4.3.5. Consume a string token","Unexpected newline"])),n.unreadCodePoint(),[e.BadString,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,void 0];if(i===t)return[e.String,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:o}];if(92!==i)o+=String.fromCharCode(i);else{if(void 0===n.codePointSource[n.cursor])continue;if(isNewLine(n.codePointSource[n.cursor])){n.advanceCodePoint();continue}o+=String.fromCharCode(consumeEscapedCodePoint(r,n))}}}const i="u".charCodeAt(0),c="U".charCodeAt(0),s="r".charCodeAt(0),a="R".charCodeAt(0),u="l".charCodeAt(0),d="L".charCodeAt(0);function checkIfCodePointsMatchURLIdent(e,r){return 3===r.length&&((r[0]===i||r[0]===c)&&((r[1]===s||r[1]===a)&&(r[2]===u||r[2]===d)))}function consumeBadURL(e,r){for(;;){if(void 0===r.codePointSource[r.cursor])return;if(41===r.codePointSource[r.cursor])return void r.advanceCodePoint();checkIfTwoCodePointsAreAValidEscape(0,r)?(r.advanceCodePoint(),consumeEscapedCodePoint(e,r)):r.advanceCodePoint()}}function consumeUrlToken(r,n){consumeWhiteSpace(0,n);let o="";for(;;){if(void 0===n.codePointSource[n.cursor])return r.onParseError(new ParseError("Unexpected EOF while consuming a url token.",n.representationStart,n.representationEnd,["4.3.6. Consume a url token","Unexpected EOF"])),[e.URL,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:o}];if(41===n.codePointSource[n.cursor])return n.advanceCodePoint(),[e.URL,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:o}];if(isWhitespace(n.codePointSource[n.cursor]))return consumeWhiteSpace(0,n),void 0===n.codePointSource[n.cursor]?(r.onParseError(new ParseError("Unexpected EOF while consuming a url token.",n.representationStart,n.representationEnd,["4.3.6. Consume a url token","Consume as much whitespace as possible","Unexpected EOF"])),[e.URL,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:o}]):41===n.codePointSource[n.cursor]?(n.advanceCodePoint(),[e.URL,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:o}]):(consumeBadURL(r,n),[e.BadURL,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,void 0]);if(34===n.codePointSource[n.cursor]||39===n.codePointSource[n.cursor]||40===n.codePointSource[n.cursor]||(11===(t=n.codePointSource[n.cursor])||127===t||0<=t&&t<=8||14<=t&&t<=31))return consumeBadURL(r,n),r.onParseError(new ParseError("Unexpected character while consuming a url token.",n.representationStart,n.representationEnd,["4.3.6. Consume a url token","Unexpected U+0022 QUOTATION MARK (\"), U+0027 APOSTROPHE ('), U+0028 LEFT PARENTHESIS (() or non-printable code point"])),[e.BadURL,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,void 0];if(92===n.codePointSource[n.cursor]){if(checkIfTwoCodePointsAreAValidEscape(0,n)){o+=String.fromCharCode(consumeEscapedCodePoint(r,n));continue}return consumeBadURL(r,n),r.onParseError(new ParseError("Invalid escape sequence while consuming a url token.",n.representationStart,n.representationEnd,["4.3.6. Consume a url token","U+005C REVERSE SOLIDUS (\\)","The input stream does not start with a valid escape sequence"])),[e.BadURL,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,void 0]}o+=String.fromCharCode(n.codePointSource[n.cursor]),n.advanceCodePoint()}var t}function consumeIdentLikeToken(r,n){const o=consumeIdentSequence(r,n);if(40!==n.codePointSource[n.cursor])return[e.Ident,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:String.fromCharCode(...o)}];if(checkIfCodePointsMatchURLIdent(0,o)){n.advanceCodePoint();let t=0;for(;;){const r=isWhitespace(n.codePointSource[n.cursor]),i=isWhitespace(n.codePointSource[n.cursor+1]);if(r&&i){t+=1,n.advanceCodePoint(1);continue}const c=r?n.codePointSource[n.cursor+1]:n.codePointSource[n.cursor];if(34===c||39===c)return t>0&&n.unreadCodePoint(t),[e.Function,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:String.fromCharCode(...o)}];break}return consumeUrlToken(r,n)}return n.advanceCodePoint(),[e.Function,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:String.fromCharCode(...o)}]}function tokenizer(r,n){const t=r.css.valueOf(),i=new Reader(t),c={onParseError:(null==n?void 0:n.onParseError)??(()=>{})};return{nextToken:function nextToken(){if(i.representationStart=i.cursor,i.representationEnd=-1,checkIfTwoCodePointsStartAComment(0,i)){if(null!=n&&n.commentsAreTokens)return consumeComment(c,i);consumeComment(c,i),i.representationStart=i.cursor,i.representationEnd=-1}const r=i.codePointSource[i.cursor];if(void 0===r)return[e.EOF,"",-1,-1,void 0];if(isIdentStartCodePoint(r))return consumeIdentLikeToken(c,i);if(isDigitCodePoint(r))return consumeNumericToken(c,i);switch(r){case 44:return i.advanceCodePoint(),[e.Comma,",",i.representationStart,i.representationEnd,void 0];case 58:return i.advanceCodePoint(),[e.Colon,":",i.representationStart,i.representationEnd,void 0];case 59:return i.advanceCodePoint(),[e.Semicolon,";",i.representationStart,i.representationEnd,void 0];case 40:return i.advanceCodePoint(),[e.OpenParen,"(",i.representationStart,i.representationEnd,void 0];case 41:return i.advanceCodePoint(),[e.CloseParen,")",i.representationStart,i.representationEnd,void 0];case 91:return i.advanceCodePoint(),[e.OpenSquare,"[",i.representationStart,i.representationEnd,void 0];case 93:return i.advanceCodePoint(),[e.CloseSquare,"]",i.representationStart,i.representationEnd,void 0];case 123:return i.advanceCodePoint(),[e.OpenCurly,"{",i.representationStart,i.representationEnd,void 0];case 125:return i.advanceCodePoint(),[e.CloseCurly,"}",i.representationStart,i.representationEnd,void 0];case 39:case 34:return consumeStringToken(c,i);case 35:return consumeHashToken(c,i);case 43:case 46:return checkIfThreeCodePointsWouldStartANumber(0,i)?consumeNumericToken(c,i):(i.advanceCodePoint(),[e.Delim,i.source[i.representationStart],i.representationStart,i.representationEnd,{value:i.source[i.representationStart]}]);case 10:case 13:case 12:case 9:case 32:return consumeWhiteSpace(0,i);case o:return checkIfThreeCodePointsWouldStartANumber(0,i)?consumeNumericToken(c,i):checkIfThreeCodePointsWouldStartCDC(0,i)?(i.advanceCodePoint(3),[e.CDC,"--\x3e",i.representationStart,i.representationEnd,void 0]):checkIfThreeCodePointsWouldStartAnIdentSequence(0,i)?consumeIdentLikeToken(c,i):(i.advanceCodePoint(),[e.Delim,"-",i.representationStart,i.representationEnd,{value:"-"}]);case 60:return checkIfFourCodePointsWouldStartCDO(0,i)?(i.advanceCodePoint(4),[e.CDO,"\x3c!--",i.representationStart,i.representationEnd,void 0]):(i.advanceCodePoint(),[e.Delim,"<",i.representationStart,i.representationEnd,{value:"<"}]);case 64:if(i.advanceCodePoint(),checkIfThreeCodePointsWouldStartAnIdentSequence(0,i)){const r=consumeIdentSequence(c,i);return[e.AtKeyword,i.source.slice(i.representationStart,i.representationEnd+1),i.representationStart,i.representationEnd,{value:String.fromCharCode(...r)}]}return[e.Delim,"@",i.representationStart,i.representationEnd,{value:"@"}];case 92:return checkIfTwoCodePointsAreAValidEscape(0,i)?consumeIdentLikeToken(c,i):(i.advanceCodePoint(),c.onParseError(new ParseError('Invalid escape sequence after "\\"',i.representationStart,i.representationEnd,["4.3.1. Consume a token","U+005C REVERSE SOLIDUS (\\)","The input stream does not start with a valid escape sequence"])),[e.Delim,"\\",i.representationStart,i.representationEnd,{value:"\\"}])}return i.advanceCodePoint(),[e.Delim,i.source[i.representationStart],i.representationStart,i.representationEnd,{value:i.source[i.representationStart]}]},endOfFile:function endOfFile(){return void 0===i.codePointSource[i.cursor]}}}function cloneTokens(e){return"undefined"!=typeof globalThis&&"structuredClone"in globalThis?structuredClone(e):JSON.parse(JSON.stringify(e))}function mutateIdent(e,r){let n="";const t=new Array(r.length);for(let e=0;e<r.length;e++)t[e]=r.charCodeAt(e);let i=0;t[0]===o&&t[1]===o?(n="--",i=2):t[0]===o&&t[1]?(n="-",i=2,isIdentStartCodePoint(t[1])?n+=r[1]:n+=`\\${t[1].toString(16)} `):isIdentStartCodePoint(t[0])?(n=r[0],i=1):(n=`\\${t[0].toString(16)} `,i=1);for(let e=i;e<t.length;e++)isIdentCodePoint(t[e])?n+=r[e]:n+=`\\${t[e].toString(16)} `;e[1]=n,e[4].value=r}export{r as NumberType,ParseError,Reader,e as TokenType,cloneTokens,isToken,mirrorVariantType,mutateIdent,stringify,tokenizer};
