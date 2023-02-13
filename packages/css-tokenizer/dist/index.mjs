class ParseError extends Error{sourceStart;sourceEnd;parserState;constructor(e,r,n,t){super(e),this.name="ParseError",this.sourceStart=r,this.sourceEnd=n,this.parserState=t}}class Reader{cursor;source="";codePointSource=[];length=0;representationStart=0;representationEnd=-1;constructor(e){this.cursor=0,this.source=e,this.length=e.length,this.codePointSource=new Array(this.length);for(let e=0;e<this.length;e++)this.codePointSource[e]=this.source.charCodeAt(e)}advanceCodePoint(e=1){this.cursor+=e,this.representationEnd=this.cursor-1}readCodePoint(e=1){const r=this.codePointSource[this.cursor];return void 0!==r&&(this.cursor+=e,this.representationEnd=this.cursor-1,r)}unreadCodePoint(e=1){this.cursor-=e,this.representationEnd=this.cursor-1}}var e,r,n;function mirrorVariantType(r){switch(r){case e.OpenParen:return e.CloseParen;case e.CloseParen:return e.OpenParen;case e.OpenCurly:return e.CloseCurly;case e.CloseCurly:return e.OpenCurly;case e.OpenSquare:return e.CloseSquare;case e.CloseSquare:return e.OpenSquare;default:return null}}function mirrorVariant(r){switch(r[0]){case e.OpenParen:return[e.CloseParen,")",-1,-1,void 0];case e.CloseParen:return[e.OpenParen,"(",-1,-1,void 0];case e.OpenCurly:return[e.CloseCurly,"}",-1,-1,void 0];case e.CloseCurly:return[e.OpenCurly,"{",-1,-1,void 0];case e.OpenSquare:return[e.CloseSquare,"]",-1,-1,void 0];case e.CloseSquare:return[e.OpenSquare,"[",-1,-1,void 0];default:return null}}!function(e){e.Comment="comment",e.AtKeyword="at-keyword-token",e.BadString="bad-string-token",e.BadURL="bad-url-token",e.CDC="CDC-token",e.CDO="CDO-token",e.Colon="colon-token",e.Comma="comma-token",e.Delim="delim-token",e.Dimension="dimension-token",e.EOF="EOF-token",e.Function="function-token",e.Hash="hash-token",e.Ident="ident-token",e.Number="number-token",e.Percentage="percentage-token",e.Semicolon="semicolon-token",e.String="string-token",e.URL="url-token",e.Whitespace="whitespace-token",e.OpenParen="(-token",e.CloseParen=")-token",e.OpenSquare="[-token",e.CloseSquare="]-token",e.OpenCurly="{-token",e.CloseCurly="}-token"}(e||(e={})),function(e){e.Integer="integer",e.Number="number"}(r||(r={})),function(e){e.Unrestricted="unrestricted",e.ID="id"}(n||(n={}));const t=Object.values(e);function isToken(e){return!!Array.isArray(e)&&(!(e.length<4)&&(!!t.includes(e[0])&&("string"==typeof e[1]&&("number"==typeof e[2]&&"number"==typeof e[3]))))}function stringify(...e){let r="";for(let n=0;n<e.length;n++)r+=e[n][1];return r}const o=39,i=42,c=8,s=13,a=9,u=58,d=44,p=64,S=127,P=33,C=12,l=46,f=62,E=45,m=31,h=69,v=101,k=123,g=40,I=91,T=60,w=10,O=11,A=95,U=1114111,D=0,L=35,y=37,q=43,R=34,N=65533,b=92,W=125,x=41,F=93,V=59,B=14,H=47,K=32;function checkIfFourCodePointsWouldStartCDO(e,r){return r.codePointSource[r.cursor]===T&&r.codePointSource[r.cursor+1]===P&&r.codePointSource[r.cursor+2]===E&&r.codePointSource[r.cursor+3]===E}function isDigitCodePoint(e){return e>=48&&e<=57}function isUppercaseLetterCodePoint(e){return e>=65&&e<=90}function isLowercaseLetterCodePoint(e){return e>=97&&e<=122}function isHexDigitCodePoint(e){return isDigitCodePoint(e)||e>=97&&e<=102||e>=65&&e<=70}function isLetterCodePoint(e){return isLowercaseLetterCodePoint(e)||isUppercaseLetterCodePoint(e)}function isNonASCIICodePoint(e){return e>=128}function isIdentStartCodePoint(e){return isLetterCodePoint(e)||isNonASCIICodePoint(e)||e===A}function isIdentCodePoint(e){return isIdentStartCodePoint(e)||isDigitCodePoint(e)||e===E}function isNewLine(e){return 10===e||13===e||12===e}function isWhitespace(e){return 32===e||10===e||9===e||13===e||12===e}function checkIfTwoCodePointsAreAValidEscape(e,r){return r.codePointSource[r.cursor]===b&&!isNewLine(r.codePointSource[r.cursor+1])}function checkIfThreeCodePointsWouldStartAnIdentSequence(e,r){return r.codePointSource[r.cursor]===E?r.codePointSource[r.cursor+1]===E||(!!isIdentStartCodePoint(r.codePointSource[r.cursor+1])||r.codePointSource[r.cursor+1]===b&&!isNewLine(r.codePointSource[r.cursor+2])):!!isIdentStartCodePoint(r.codePointSource[r.cursor])||checkIfTwoCodePointsAreAValidEscape(0,r)}function checkIfThreeCodePointsWouldStartANumber(e,r){return r.codePointSource[r.cursor]===q||r.codePointSource[r.cursor]===E?!!isDigitCodePoint(r.codePointSource[r.cursor+1])||r.codePointSource[r.cursor+1]===l&&isDigitCodePoint(r.codePointSource[r.cursor+2]):r.codePointSource[r.cursor]===l?isDigitCodePoint(r.codePointSource[r.cursor+1]):isDigitCodePoint(r.codePointSource[r.cursor])}function checkIfTwoCodePointsStartAComment(e,r){return r.codePointSource[r.cursor]===H&&r.codePointSource[r.cursor+1]===i}function checkIfThreeCodePointsWouldStartCDC(e,r){return r.codePointSource[r.cursor]===E&&r.codePointSource[r.cursor+1]===E&&r.codePointSource[r.cursor+2]===f}function consumeComment(r,n){for(n.advanceCodePoint(2);;){const e=n.readCodePoint();if(!1===e){r.onParseError(new ParseError("Unexpected EOF while consuming a comment.",n.representationStart,n.representationEnd,["4.3.2. Consume comments","Unexpected EOF"]));break}if(e===i&&(void 0!==n.codePointSource[n.cursor]&&n.codePointSource[n.cursor]===H)){n.advanceCodePoint();break}}return[e.Comment,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,void 0]}function consumeEscapedCodePoint(e,r){const n=r.readCodePoint();if(!1===n)return e.onParseError(new ParseError("Unexpected EOF while consuming an escaped code point.",r.representationStart,r.representationEnd,["4.3.7. Consume an escaped code point","Unexpected EOF"])),N;if(isHexDigitCodePoint(n)){const e=[n];for(;void 0!==r.codePointSource[r.cursor]&&isHexDigitCodePoint(r.codePointSource[r.cursor])&&e.length<6;)e.push(r.codePointSource[r.cursor]),r.advanceCodePoint();isWhitespace(r.codePointSource[r.cursor])&&r.advanceCodePoint();const o=parseInt(String.fromCharCode(...e),16);return 0===o?N:(t=o)>=55296&&t<=57343||o>U?N:o}var t;return n}function consumeIdentSequence(e,r){const n=[];for(;;)if(isIdentCodePoint(r.codePointSource[r.cursor]))n.push(r.codePointSource[r.cursor]),r.advanceCodePoint();else{if(!checkIfTwoCodePointsAreAValidEscape(0,r))return n;r.advanceCodePoint(),n.push(consumeEscapedCodePoint(e,r))}}function consumeHashToken(r,t){if(t.advanceCodePoint(),void 0!==t.codePointSource[t.cursor]&&(isIdentCodePoint(t.codePointSource[t.cursor])||checkIfTwoCodePointsAreAValidEscape(0,t))){let o=n.Unrestricted;checkIfThreeCodePointsWouldStartAnIdentSequence(0,t)&&(o=n.ID);const i=consumeIdentSequence(r,t);return[e.Hash,t.source.slice(t.representationStart,t.representationEnd+1),t.representationStart,t.representationEnd,{value:String.fromCharCode(...i),type:o}]}return[e.Delim,"#",t.representationStart,t.representationEnd,{value:"#"}]}function consumeNumber(e,n){let t=r.Integer;for(n.codePointSource[n.cursor]!==q&&n.codePointSource[n.cursor]!==E||n.advanceCodePoint();isDigitCodePoint(n.codePointSource[n.cursor]);)n.advanceCodePoint();if(n.codePointSource[n.cursor]===l&&isDigitCodePoint(n.codePointSource[n.cursor+1]))for(n.advanceCodePoint(2),t=r.Number;isDigitCodePoint(n.codePointSource[n.cursor]);)n.advanceCodePoint();if(n.codePointSource[n.cursor]===v||n.codePointSource[n.cursor]===h){if(isDigitCodePoint(n.codePointSource[n.cursor+1]))n.advanceCodePoint(2);else{if(n.codePointSource[n.cursor+1]!==E&&n.codePointSource[n.cursor+1]!==q||!isDigitCodePoint(n.codePointSource[n.cursor+2]))return t;n.advanceCodePoint(3)}for(t=r.Number;isDigitCodePoint(n.codePointSource[n.cursor]);)n.advanceCodePoint()}return t}function consumeNumericToken(r,n){const t=consumeNumber(0,n),o=parseFloat(n.source.slice(n.representationStart,n.representationEnd+1));if(checkIfThreeCodePointsWouldStartAnIdentSequence(0,n)){const i=consumeIdentSequence(r,n);return[e.Dimension,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:o,type:t,unit:String.fromCharCode(...i)}]}return n.codePointSource[n.cursor]===y?(n.advanceCodePoint(),[e.Percentage,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:o}]):[e.Number,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:o,type:t}]}function consumeWhiteSpace(r,n){for(;isWhitespace(n.codePointSource[n.cursor]);)n.advanceCodePoint();return[e.Whitespace,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,void 0]}function consumeStringToken(r,n){let t="";const o=n.readCodePoint();for(;;){const i=n.readCodePoint();if(!1===i)return r.onParseError(new ParseError("Unexpected EOF while consuming a string token.",n.representationStart,n.representationEnd,["4.3.5. Consume a string token","Unexpected EOF"])),[e.String,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:t}];if(isNewLine(i))return r.onParseError(new ParseError("Unexpected newline while consuming a string token.",n.representationStart,n.representationEnd,["4.3.5. Consume a string token","Unexpected newline"])),n.unreadCodePoint(),[e.BadString,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,void 0];if(i===o)return[e.String,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:t}];if(i!==b)t+=String.fromCharCode(i);else{if(void 0===n.codePointSource[n.cursor])continue;if(isNewLine(n.codePointSource[n.cursor])){n.advanceCodePoint();continue}t+=String.fromCharCode(consumeEscapedCodePoint(r,n))}}}const M="u".charCodeAt(0),$="U".charCodeAt(0),z="r".charCodeAt(0),J="R".charCodeAt(0),j="l".charCodeAt(0),Q="L".charCodeAt(0);function checkIfCodePointsMatchURLIdent(e,r){return 3===r.length&&((r[0]===M||r[0]===$)&&((r[1]===z||r[1]===J)&&(r[2]===j||r[2]===Q)))}function consumeBadURL(e,r){for(;;){if(void 0===r.codePointSource[r.cursor])return;if(r.codePointSource[r.cursor]===x)return void r.advanceCodePoint();checkIfTwoCodePointsAreAValidEscape(0,r)?(r.advanceCodePoint(),consumeEscapedCodePoint(e,r)):r.advanceCodePoint()}}function consumeUrlToken(r,n){consumeWhiteSpace(0,n);let t="";for(;;){if(void 0===n.codePointSource[n.cursor])return r.onParseError(new ParseError("Unexpected EOF while consuming a url token.",n.representationStart,n.representationEnd,["4.3.6. Consume a url token","Unexpected EOF"])),[e.URL,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:t}];if(n.codePointSource[n.cursor]===x)return n.advanceCodePoint(),[e.URL,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:t}];if(isWhitespace(n.codePointSource[n.cursor]))return consumeWhiteSpace(0,n),void 0===n.codePointSource[n.cursor]?(r.onParseError(new ParseError("Unexpected EOF while consuming a url token.",n.representationStart,n.representationEnd,["4.3.6. Consume a url token","Consume as much whitespace as possible","Unexpected EOF"])),[e.URL,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:t}]):n.codePointSource[n.cursor]===x?(n.advanceCodePoint(),[e.URL,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:t}]):(consumeBadURL(r,n),[e.BadURL,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,void 0]);if(n.codePointSource[n.cursor]===R||n.codePointSource[n.cursor]===o||n.codePointSource[n.cursor]===g||((i=n.codePointSource[n.cursor])===O||i===S||D<=i&&i<=c||B<=i&&i<=m))return consumeBadURL(r,n),r.onParseError(new ParseError("Unexpected character while consuming a url token.",n.representationStart,n.representationEnd,["4.3.6. Consume a url token","Unexpected U+0022 QUOTATION MARK (\"), U+0027 APOSTROPHE ('), U+0028 LEFT PARENTHESIS (() or non-printable code point"])),[e.BadURL,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,void 0];if(n.codePointSource[n.cursor]===b){if(checkIfTwoCodePointsAreAValidEscape(0,n)){n.advanceCodePoint(),t+=String.fromCharCode(consumeEscapedCodePoint(r,n));continue}return consumeBadURL(r,n),r.onParseError(new ParseError("Invalid escape sequence while consuming a url token.",n.representationStart,n.representationEnd,["4.3.6. Consume a url token","U+005C REVERSE SOLIDUS (\\)","The input stream does not start with a valid escape sequence"])),[e.BadURL,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,void 0]}t+=String.fromCharCode(n.codePointSource[n.cursor]),n.advanceCodePoint()}var i}function consumeIdentLikeToken(r,n){const t=consumeIdentSequence(r,n);if(n.codePointSource[n.cursor]!==g)return[e.Ident,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:String.fromCharCode(...t)}];if(checkIfCodePointsMatchURLIdent(0,t)){n.advanceCodePoint();let i=0;for(;;){const r=isWhitespace(n.codePointSource[n.cursor]),c=isWhitespace(n.codePointSource[n.cursor+1]);if(r&&c){i+=1,n.advanceCodePoint(1);continue}const s=r?n.codePointSource[n.cursor+1]:n.codePointSource[n.cursor];if(s===R||s===o)return i>0&&n.unreadCodePoint(i),[e.Function,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:String.fromCharCode(...t)}];break}return consumeUrlToken(r,n)}return n.advanceCodePoint(),[e.Function,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,{value:String.fromCharCode(...t)}]}function tokenizer(r,n){const t=r.css.valueOf(),i=new Reader(t),c={onParseError:(null==n?void 0:n.onParseError)??(()=>{})};return{nextToken:function nextToken(){if(i.representationStart=i.cursor,i.representationEnd=-1,checkIfTwoCodePointsStartAComment(0,i))return consumeComment(c,i);const r=i.codePointSource[i.cursor];if(void 0===r)return[e.EOF,"",-1,-1,void 0];if(isIdentStartCodePoint(r))return consumeIdentLikeToken(c,i);if(isDigitCodePoint(r))return consumeNumericToken(c,i);switch(r){case d:return i.advanceCodePoint(),[e.Comma,",",i.representationStart,i.representationEnd,void 0];case u:return i.advanceCodePoint(),[e.Colon,":",i.representationStart,i.representationEnd,void 0];case V:return i.advanceCodePoint(),[e.Semicolon,";",i.representationStart,i.representationEnd,void 0];case g:return i.advanceCodePoint(),[e.OpenParen,"(",i.representationStart,i.representationEnd,void 0];case x:return i.advanceCodePoint(),[e.CloseParen,")",i.representationStart,i.representationEnd,void 0];case I:return i.advanceCodePoint(),[e.OpenSquare,"[",i.representationStart,i.representationEnd,void 0];case F:return i.advanceCodePoint(),[e.CloseSquare,"]",i.representationStart,i.representationEnd,void 0];case k:return i.advanceCodePoint(),[e.OpenCurly,"{",i.representationStart,i.representationEnd,void 0];case W:return i.advanceCodePoint(),[e.CloseCurly,"}",i.representationStart,i.representationEnd,void 0];case o:case R:return consumeStringToken(c,i);case L:return consumeHashToken(c,i);case q:case l:return checkIfThreeCodePointsWouldStartANumber(0,i)?consumeNumericToken(c,i):(i.advanceCodePoint(),[e.Delim,i.source[i.representationStart],i.representationStart,i.representationEnd,{value:i.source[i.representationStart]}]);case w:case s:case C:case a:case K:return consumeWhiteSpace(0,i);case E:return checkIfThreeCodePointsWouldStartANumber(0,i)?consumeNumericToken(c,i):checkIfThreeCodePointsWouldStartCDC(0,i)?(i.advanceCodePoint(3),[e.CDC,"--\x3e",i.representationStart,i.representationEnd,void 0]):checkIfThreeCodePointsWouldStartAnIdentSequence(0,i)?consumeIdentLikeToken(c,i):(i.advanceCodePoint(),[e.Delim,"-",i.representationStart,i.representationEnd,{value:"-"}]);case T:return checkIfFourCodePointsWouldStartCDO(0,i)?(i.advanceCodePoint(4),[e.CDO,"\x3c!--",i.representationStart,i.representationEnd,void 0]):(i.advanceCodePoint(),[e.Delim,"<",i.representationStart,i.representationEnd,{value:"<"}]);case p:if(i.advanceCodePoint(),checkIfThreeCodePointsWouldStartAnIdentSequence(0,i)){const r=consumeIdentSequence(c,i);return[e.AtKeyword,i.source.slice(i.representationStart,i.representationEnd+1),i.representationStart,i.representationEnd,{value:String.fromCharCode(...r)}]}return[e.Delim,"@",i.representationStart,i.representationEnd,{value:"@"}];case b:return checkIfTwoCodePointsAreAValidEscape(0,i)?consumeIdentLikeToken(c,i):(i.advanceCodePoint(),c.onParseError(new ParseError('Invalid escape sequence after "\\"',i.representationStart,i.representationEnd,["4.3.1. Consume a token","U+005C REVERSE SOLIDUS (\\)","The input stream does not start with a valid escape sequence"])),[e.Delim,"\\",i.representationStart,i.representationEnd,{value:"\\"}])}return i.advanceCodePoint(),[e.Delim,i.source[i.representationStart],i.representationStart,i.representationEnd,{value:i.source[i.representationStart]}]},endOfFile:function endOfFile(){return void 0===i.codePointSource[i.cursor]}}}function cloneTokens(e){return"undefined"!=typeof globalThis&&"structuredClone"in globalThis?structuredClone(e):JSON.parse(JSON.stringify(e))}function mutateIdent(e,r){let n="";const t=new Array(r.length);for(let e=0;e<r.length;e++)t[e]=r.charCodeAt(e);let o=0;t[0]===E&&t[1]===E?(n="--",o=2):t[0]===E&&t[1]?(n="-",o=2,isIdentStartCodePoint(t[1])?n+=r[1]:n+=`\\${t[1].toString(16)} `):isIdentStartCodePoint(t[0])?(n=r[0],o=1):(n=`\\${t[0].toString(16)} `,o=1);for(let e=o;e<t.length;e++)isIdentCodePoint(t[e])?n+=r[e]:n+=`\\${t[e].toString(16)} `;e[1]=n,e[4].value=r}export{r as NumberType,ParseError,Reader,e as TokenType,cloneTokens,isToken,mirrorVariant,mirrorVariantType,mutateIdent,stringify,tokenizer};
