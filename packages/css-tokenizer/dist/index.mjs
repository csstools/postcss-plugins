class ParseError extends Error{sourceStart;sourceEnd;parserState;constructor(e,n,o,r){super(e),this.name="ParseError",this.sourceStart=n,this.sourceEnd=o,this.parserState=r}}class Reader{cursor=0;source="";codePointSource=[];representationIndices=[-1];length=0;representationStart=0;representationEnd=-1;constructor(e){this.source=e;{let n=-1,o="";for(o of e)n+=o.length,this.codePointSource.push(o.codePointAt(0)),this.representationIndices.push(n)}this.length=this.codePointSource.length}advanceCodePoint(e=1){this.cursor=this.cursor+e,this.representationEnd=this.representationIndices[this.cursor]}readCodePoint(e=1){const n=this.codePointSource[this.cursor];return void 0!==n&&(this.cursor=this.cursor+e,this.representationEnd=this.representationIndices[this.cursor],n)}unreadCodePoint(e=1){this.cursor=this.cursor-e,this.representationEnd=this.representationIndices[this.cursor]}resetRepresentation(){this.representationStart=this.representationIndices[this.cursor]+1,this.representationEnd=-1}}var e,n,o;function mirrorVariantType(n){switch(n){case e.OpenParen:return e.CloseParen;case e.CloseParen:return e.OpenParen;case e.OpenCurly:return e.CloseCurly;case e.CloseCurly:return e.OpenCurly;case e.OpenSquare:return e.CloseSquare;case e.CloseSquare:return e.OpenSquare;default:return null}}function mirrorVariant(n){switch(n[0]){case e.OpenParen:return[e.CloseParen,")",-1,-1,void 0];case e.CloseParen:return[e.OpenParen,"(",-1,-1,void 0];case e.OpenCurly:return[e.CloseCurly,"}",-1,-1,void 0];case e.CloseCurly:return[e.OpenCurly,"{",-1,-1,void 0];case e.OpenSquare:return[e.CloseSquare,"]",-1,-1,void 0];case e.CloseSquare:return[e.OpenSquare,"[",-1,-1,void 0];default:return null}}!function(e){e.Comment="comment",e.AtKeyword="at-keyword-token",e.BadString="bad-string-token",e.BadURL="bad-url-token",e.CDC="CDC-token",e.CDO="CDO-token",e.Colon="colon-token",e.Comma="comma-token",e.Delim="delim-token",e.Dimension="dimension-token",e.EOF="EOF-token",e.Function="function-token",e.Hash="hash-token",e.Ident="ident-token",e.Number="number-token",e.Percentage="percentage-token",e.Semicolon="semicolon-token",e.String="string-token",e.URL="url-token",e.Whitespace="whitespace-token",e.OpenParen="(-token",e.CloseParen=")-token",e.OpenSquare="[-token",e.CloseSquare="]-token",e.OpenCurly="{-token",e.CloseCurly="}-token",e.UnicodeRange="unicode-range-token"}(e||(e={})),function(e){e.Integer="integer",e.Number="number"}(n||(n={})),function(e){e.Unrestricted="unrestricted",e.ID="id"}(o||(o={}));const r=Object.values(e);function isToken(e){return!!Array.isArray(e)&&(!(e.length<4)&&(!!r.includes(e[0])&&("string"==typeof e[1]&&("number"==typeof e[2]&&"number"==typeof e[3]))))}function cloneTokens(e){return"undefined"!=typeof globalThis&&"structuredClone"in globalThis?structuredClone(e):JSON.parse(JSON.stringify(e))}function stringify(...e){let n="";for(let o=0;o<e.length;o++)n+=e[o][1];return n}const t=39,i=42,c=8,s=13,a=9,u=58,d=44,P=64,p=127,S=33,C=12,l=46,f=62,h=45,E=31,m=69,v=101,g=123,k=40,I=91,T=60,O=10,U=11,w=95,D=1114111,A=0,R=35,L=37,x=43,y=34,q=65533,W=92,N=125,b=41,F=93,H=59,V=14,B=47,z=32,K=117,M=85,$=114,J=82,_=108,j=76,Q=63,G=48,X=70;function checkIfFourCodePointsWouldStartCDO(e){return e.codePointSource[e.cursor]===T&&e.codePointSource[e.cursor+1]===S&&e.codePointSource[e.cursor+2]===h&&e.codePointSource[e.cursor+3]===h}function isDigitCodePoint(e){return e>=48&&e<=57}function isUppercaseLetterCodePoint(e){return e>=65&&e<=90}function isLowercaseLetterCodePoint(e){return e>=97&&e<=122}function isHexDigitCodePoint(e){return isDigitCodePoint(e)||e>=97&&e<=102||e>=65&&e<=70}function isLetterCodePoint(e){return isLowercaseLetterCodePoint(e)||isUppercaseLetterCodePoint(e)}function isIdentStartCodePoint(e){return isLetterCodePoint(e)||isNonASCII_IdentCodePoint(e)||e===w}function isIdentCodePoint(e){return isIdentStartCodePoint(e)||isDigitCodePoint(e)||e===h}function isNonASCII_IdentCodePoint(e){return 183===e||8204===e||8205===e||8255===e||8256===e||8204===e||(192<=e&&e<=214||216<=e&&e<=246||248<=e&&e<=893||895<=e&&e<=8191||8304<=e&&e<=8591||11264<=e&&e<=12271||12289<=e&&e<=55295||63744<=e&&e<=64975||65008<=e&&e<=65533||e>=65536)}function isNewLine(e){return 10===e||13===e||12===e}function isWhitespace(e){return 32===e||10===e||9===e||13===e||12===e}function checkIfTwoCodePointsAreAValidEscape(e){return e.codePointSource[e.cursor]===W&&!isNewLine(e.codePointSource[e.cursor+1])}function checkIfThreeCodePointsWouldStartAnIdentSequence(e,n){return n.codePointSource[n.cursor]===h?n.codePointSource[n.cursor+1]===h||(!!isIdentStartCodePoint(n.codePointSource[n.cursor+1])||n.codePointSource[n.cursor+1]===W&&!isNewLine(n.codePointSource[n.cursor+2])):!!isIdentStartCodePoint(n.codePointSource[n.cursor])||checkIfTwoCodePointsAreAValidEscape(n)}function checkIfThreeCodePointsWouldStartANumber(e){return e.codePointSource[e.cursor]===x||e.codePointSource[e.cursor]===h?!!isDigitCodePoint(e.codePointSource[e.cursor+1])||e.codePointSource[e.cursor+1]===l&&isDigitCodePoint(e.codePointSource[e.cursor+2]):e.codePointSource[e.cursor]===l?isDigitCodePoint(e.codePointSource[e.cursor+1]):isDigitCodePoint(e.codePointSource[e.cursor])}function checkIfTwoCodePointsStartAComment(e){return e.codePointSource[e.cursor]===B&&e.codePointSource[e.cursor+1]===i}function checkIfThreeCodePointsWouldStartCDC(e){return e.codePointSource[e.cursor]===h&&e.codePointSource[e.cursor+1]===h&&e.codePointSource[e.cursor+2]===f}function consumeComment(n,o){for(o.advanceCodePoint(2);;){const e=o.readCodePoint();if(!1===e){n.onParseError(new ParseError("Unexpected EOF while consuming a comment.",o.representationStart,o.representationEnd,["4.3.2. Consume comments","Unexpected EOF"]));break}if(e===i&&(void 0!==o.codePointSource[o.cursor]&&o.codePointSource[o.cursor]===B)){o.advanceCodePoint();break}}return[e.Comment,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0]}function consumeEscapedCodePoint(e,n){const o=n.readCodePoint();if(!1===o)return e.onParseError(new ParseError("Unexpected EOF while consuming an escaped code point.",n.representationStart,n.representationEnd,["4.3.7. Consume an escaped code point","Unexpected EOF"])),q;if(isHexDigitCodePoint(o)){const e=[o];for(;void 0!==n.codePointSource[n.cursor]&&isHexDigitCodePoint(n.codePointSource[n.cursor])&&e.length<6;)e.push(n.codePointSource[n.cursor]),n.advanceCodePoint();isWhitespace(n.codePointSource[n.cursor])&&n.advanceCodePoint();const t=parseInt(String.fromCodePoint(...e),16);return 0===t?q:(r=t)>=55296&&r<=57343||t>D?q:t}var r;return o}function consumeIdentSequence(e,n){const o=[];for(;;)if(isIdentCodePoint(n.codePointSource[n.cursor]))o.push(n.codePointSource[n.cursor]),n.advanceCodePoint();else{if(!checkIfTwoCodePointsAreAValidEscape(n))return o;n.advanceCodePoint(),o.push(consumeEscapedCodePoint(e,n))}}function consumeHashToken(n,r){if(r.advanceCodePoint(),void 0!==r.codePointSource[r.cursor]&&(isIdentCodePoint(r.codePointSource[r.cursor])||checkIfTwoCodePointsAreAValidEscape(r))){let t=o.Unrestricted;checkIfThreeCodePointsWouldStartAnIdentSequence(0,r)&&(t=o.ID);const i=consumeIdentSequence(n,r);return[e.Hash,r.source.slice(r.representationStart,r.representationEnd+1),r.representationStart,r.representationEnd,{value:String.fromCodePoint(...i),type:t}]}return[e.Delim,"#",r.representationStart,r.representationEnd,{value:"#"}]}function consumeNumber(e,o){let r=n.Integer;for(o.codePointSource[o.cursor]!==x&&o.codePointSource[o.cursor]!==h||o.advanceCodePoint();isDigitCodePoint(o.codePointSource[o.cursor]);)o.advanceCodePoint();if(o.codePointSource[o.cursor]===l&&isDigitCodePoint(o.codePointSource[o.cursor+1]))for(o.advanceCodePoint(2),r=n.Number;isDigitCodePoint(o.codePointSource[o.cursor]);)o.advanceCodePoint();if(o.codePointSource[o.cursor]===v||o.codePointSource[o.cursor]===m){if(isDigitCodePoint(o.codePointSource[o.cursor+1]))o.advanceCodePoint(2);else{if(o.codePointSource[o.cursor+1]!==h&&o.codePointSource[o.cursor+1]!==x||!isDigitCodePoint(o.codePointSource[o.cursor+2]))return r;o.advanceCodePoint(3)}for(r=n.Number;isDigitCodePoint(o.codePointSource[o.cursor]);)o.advanceCodePoint()}return r}function consumeNumericToken(n,o){let r;{const e=o.codePointSource[o.cursor];e===h?r="-":e===x&&(r="+")}const t=consumeNumber(0,o),i=parseFloat(o.source.slice(o.representationStart,o.representationEnd+1))||0;if(checkIfThreeCodePointsWouldStartAnIdentSequence(0,o)){const c=consumeIdentSequence(n,o);return[e.Dimension,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:i,signCharacter:r,type:t,unit:String.fromCodePoint(...c)}]}return o.codePointSource[o.cursor]===L?(o.advanceCodePoint(),[e.Percentage,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:i,signCharacter:r}]):[e.Number,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:i,signCharacter:r,type:t}]}function consumeWhiteSpace(n){for(;isWhitespace(n.codePointSource[n.cursor]);)n.advanceCodePoint();return[e.Whitespace,n.source.slice(n.representationStart,n.representationEnd+1),n.representationStart,n.representationEnd,void 0]}function consumeStringToken(n,o){let r="";const t=o.readCodePoint();for(;;){const i=o.readCodePoint();if(!1===i)return n.onParseError(new ParseError("Unexpected EOF while consuming a string token.",o.representationStart,o.representationEnd,["4.3.5. Consume a string token","Unexpected EOF"])),[e.String,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:r}];if(isNewLine(i))return n.onParseError(new ParseError("Unexpected newline while consuming a string token.",o.representationStart,o.representationEnd,["4.3.5. Consume a string token","Unexpected newline"])),o.unreadCodePoint(),[e.BadString,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0];if(i===t)return[e.String,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:r}];if(i!==W)r+=String.fromCodePoint(i);else{if(void 0===o.codePointSource[o.cursor])continue;if(isNewLine(o.codePointSource[o.cursor])){o.advanceCodePoint();continue}r+=String.fromCodePoint(consumeEscapedCodePoint(n,o))}}}function checkIfCodePointsMatchURLIdent(e){return!(3!==e.length||e[0]!==K&&e[0]!==M||e[1]!==$&&e[1]!==J||e[2]!==_&&e[2]!==j)}function consumeBadURL(e,n){for(;;){if(void 0===n.codePointSource[n.cursor])return;if(n.codePointSource[n.cursor]===b)return void n.advanceCodePoint();checkIfTwoCodePointsAreAValidEscape(n)?(n.advanceCodePoint(),consumeEscapedCodePoint(e,n)):n.advanceCodePoint()}}function consumeUrlToken(n,o){for(;isWhitespace(o.codePointSource[o.cursor]);)o.advanceCodePoint();let r="";for(;;){if(void 0===o.codePointSource[o.cursor])return n.onParseError(new ParseError("Unexpected EOF while consuming a url token.",o.representationStart,o.representationEnd,["4.3.6. Consume a url token","Unexpected EOF"])),[e.URL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:r}];if(o.codePointSource[o.cursor]===b)return o.advanceCodePoint(),[e.URL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:r}];if(isWhitespace(o.codePointSource[o.cursor])){for(o.advanceCodePoint();isWhitespace(o.codePointSource[o.cursor]);)o.advanceCodePoint();return void 0===o.codePointSource[o.cursor]?(n.onParseError(new ParseError("Unexpected EOF while consuming a url token.",o.representationStart,o.representationEnd,["4.3.6. Consume a url token","Consume as much whitespace as possible","Unexpected EOF"])),[e.URL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:r}]):o.codePointSource[o.cursor]===b?(o.advanceCodePoint(),[e.URL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:r}]):(consumeBadURL(n,o),[e.BadURL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0])}if(o.codePointSource[o.cursor]===y||o.codePointSource[o.cursor]===t||o.codePointSource[o.cursor]===k||((i=o.codePointSource[o.cursor])===U||i===p||A<=i&&i<=c||V<=i&&i<=E))return consumeBadURL(n,o),n.onParseError(new ParseError("Unexpected character while consuming a url token.",o.representationStart,o.representationEnd,["4.3.6. Consume a url token","Unexpected U+0022 QUOTATION MARK (\"), U+0027 APOSTROPHE ('), U+0028 LEFT PARENTHESIS (() or non-printable code point"])),[e.BadURL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0];if(o.codePointSource[o.cursor]===W){if(checkIfTwoCodePointsAreAValidEscape(o)){o.advanceCodePoint(),r+=String.fromCodePoint(consumeEscapedCodePoint(n,o));continue}return consumeBadURL(n,o),n.onParseError(new ParseError("Invalid escape sequence while consuming a url token.",o.representationStart,o.representationEnd,["4.3.6. Consume a url token","U+005C REVERSE SOLIDUS (\\)","The input stream does not start with a valid escape sequence"])),[e.BadURL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0]}r+=String.fromCodePoint(o.codePointSource[o.cursor]),o.advanceCodePoint()}var i}function consumeIdentLikeToken(n,o){const r=consumeIdentSequence(n,o);if(o.codePointSource[o.cursor]!==k)return[e.Ident,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:String.fromCodePoint(...r)}];if(checkIfCodePointsMatchURLIdent(r)){o.advanceCodePoint();let i=0;for(;;){const n=isWhitespace(o.codePointSource[o.cursor]),c=isWhitespace(o.codePointSource[o.cursor+1]);if(n&&c){i+=1,o.advanceCodePoint(1);continue}const s=n?o.codePointSource[o.cursor+1]:o.codePointSource[o.cursor];if(s===y||s===t)return i>0&&o.unreadCodePoint(i),[e.Function,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:String.fromCodePoint(...r)}];break}return consumeUrlToken(n,o)}return o.advanceCodePoint(),[e.Function,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:String.fromCodePoint(...r)}]}function checkIfThreeCodePointsWouldStartAUnicodeRange(e){return!(e.codePointSource[e.cursor]!==K&&e.codePointSource[e.cursor]!==M||e.codePointSource[e.cursor+1]!==x||e.codePointSource[e.cursor+2]!==Q&&!isHexDigitCodePoint(e.codePointSource[e.cursor+2]))}function consumeUnicodeRangeToken(n,o){o.advanceCodePoint(2);const r=[],t=[];for(;void 0!==o.codePointSource[o.cursor]&&r.length<6&&isHexDigitCodePoint(o.codePointSource[o.cursor]);)r.push(o.codePointSource[o.cursor]),o.advanceCodePoint();for(;void 0!==o.codePointSource[o.cursor]&&r.length<6&&o.codePointSource[o.cursor]===Q;)0===t.length&&t.push(...r),r.push(G),t.push(X),o.advanceCodePoint();if(!t.length&&o.codePointSource[o.cursor]===h&&isHexDigitCodePoint(o.codePointSource[o.cursor+1]))for(o.advanceCodePoint();void 0!==o.codePointSource[o.cursor]&&t.length<6&&isHexDigitCodePoint(o.codePointSource[o.cursor]);)t.push(o.codePointSource[o.cursor]),o.advanceCodePoint();if(!t.length){const n=parseInt(String.fromCodePoint(...r),16);return[e.UnicodeRange,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{startOfRange:n,endOfRange:n}]}const i=parseInt(String.fromCodePoint(...r),16),c=parseInt(String.fromCodePoint(...t),16);return[e.UnicodeRange,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{startOfRange:i,endOfRange:c}]}function tokenize(e,n){const o=tokenizer(e,n),r=[];{for(;!o.endOfFile();){const e=o.nextToken();e&&r.push(e)}const e=o.nextToken();e&&r.push(e)}return r}function tokenizer(n,o){const r=n.css.valueOf(),i=n.unicodeRangesAllowed??!1,c=new Reader(r),p={onParseError:(null==o?void 0:o.onParseError)??(()=>{})};return{nextToken:function nextToken(){c.resetRepresentation();const n=c.codePointSource[c.cursor];if(void 0===n)return[e.EOF,"",-1,-1,void 0];if(n===B&&checkIfTwoCodePointsStartAComment(c))return consumeComment(p,c);if(i&&(n===K||n===M)&&checkIfThreeCodePointsWouldStartAUnicodeRange(c))return consumeUnicodeRangeToken(0,c);if(isIdentStartCodePoint(n))return consumeIdentLikeToken(p,c);if(isDigitCodePoint(n))return consumeNumericToken(p,c);switch(n){case d:return c.advanceCodePoint(),[e.Comma,",",c.representationStart,c.representationEnd,void 0];case u:return c.advanceCodePoint(),[e.Colon,":",c.representationStart,c.representationEnd,void 0];case H:return c.advanceCodePoint(),[e.Semicolon,";",c.representationStart,c.representationEnd,void 0];case k:return c.advanceCodePoint(),[e.OpenParen,"(",c.representationStart,c.representationEnd,void 0];case b:return c.advanceCodePoint(),[e.CloseParen,")",c.representationStart,c.representationEnd,void 0];case I:return c.advanceCodePoint(),[e.OpenSquare,"[",c.representationStart,c.representationEnd,void 0];case F:return c.advanceCodePoint(),[e.CloseSquare,"]",c.representationStart,c.representationEnd,void 0];case g:return c.advanceCodePoint(),[e.OpenCurly,"{",c.representationStart,c.representationEnd,void 0];case N:return c.advanceCodePoint(),[e.CloseCurly,"}",c.representationStart,c.representationEnd,void 0];case t:case y:return consumeStringToken(p,c);case R:return consumeHashToken(p,c);case x:case l:return checkIfThreeCodePointsWouldStartANumber(c)?consumeNumericToken(p,c):(c.advanceCodePoint(),[e.Delim,c.source[c.representationStart],c.representationStart,c.representationEnd,{value:c.source[c.representationStart]}]);case O:case s:case C:case a:case z:return consumeWhiteSpace(c);case h:return checkIfThreeCodePointsWouldStartANumber(c)?consumeNumericToken(p,c):checkIfThreeCodePointsWouldStartCDC(c)?(c.advanceCodePoint(3),[e.CDC,"--\x3e",c.representationStart,c.representationEnd,void 0]):checkIfThreeCodePointsWouldStartAnIdentSequence(0,c)?consumeIdentLikeToken(p,c):(c.advanceCodePoint(),[e.Delim,"-",c.representationStart,c.representationEnd,{value:"-"}]);case T:return checkIfFourCodePointsWouldStartCDO(c)?(c.advanceCodePoint(4),[e.CDO,"\x3c!--",c.representationStart,c.representationEnd,void 0]):(c.advanceCodePoint(),[e.Delim,"<",c.representationStart,c.representationEnd,{value:"<"}]);case P:if(c.advanceCodePoint(),checkIfThreeCodePointsWouldStartAnIdentSequence(0,c)){const n=consumeIdentSequence(p,c);return[e.AtKeyword,c.source.slice(c.representationStart,c.representationEnd+1),c.representationStart,c.representationEnd,{value:String.fromCodePoint(...n)}]}return[e.Delim,"@",c.representationStart,c.representationEnd,{value:"@"}];case W:return checkIfTwoCodePointsAreAValidEscape(c)?consumeIdentLikeToken(p,c):(c.advanceCodePoint(),p.onParseError(new ParseError('Invalid escape sequence after "\\"',c.representationStart,c.representationEnd,["4.3.1. Consume a token","U+005C REVERSE SOLIDUS (\\)","The input stream does not start with a valid escape sequence"])),[e.Delim,"\\",c.representationStart,c.representationEnd,{value:"\\"}])}return c.advanceCodePoint(),[e.Delim,c.source[c.representationStart],c.representationStart,c.representationEnd,{value:c.source[c.representationStart]}]},endOfFile:function endOfFile(){return void 0===c.codePointSource[c.cursor]}}}function mutateIdent(e,n){let o="";const r=[];{let e="";for(e of n)r.push(e.codePointAt(0))}let t=0;r[0]===h&&r[1]===h?(o="--",t=2):r[0]===h&&r[1]?(o="-",t=2,isIdentStartCodePoint(r[1])?o+=n[1]:o+=`\\${r[1].toString(16)} `):isIdentStartCodePoint(r[0])?(o=n[0],t=1):(o=`\\${r[0].toString(16)} `,t=1);for(let e=t;e<r.length;e++)isIdentCodePoint(r[e])?o+=n[e]:o+=`\\${r[e].toString(16)} `;e[1]=o,e[4].value=n}export{n as NumberType,ParseError,Reader,e as TokenType,cloneTokens,isToken,mirrorVariant,mirrorVariantType,mutateIdent,stringify,tokenize,tokenizer};
