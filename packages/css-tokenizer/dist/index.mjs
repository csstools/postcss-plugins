class Reader {
  cursor;
  source = '';
  codePointSource = [];
  length = 0;
  representationStart = 0;
  representationEnd = -1;
  constructor(source) {
    this.cursor = 0;
    this.source = source;
    this.length = source.length;
    this.codePointSource = new Array(this.length);
    for (let i = 0; i < this.length; i++) {
      this.codePointSource[i] = this.source.charCodeAt(i);
    }
  }
  cursorPositionOfLastReadCodePoint() {
    return this.cursor - 1;
  }
  advanceCodePoint(n = 1) {
    this.cursor += n;
    this.representationEnd = this.cursor - 1;
  }
  readCodePoint(n = 1) {
    const codePoint = this.codePointSource[this.cursor];
    if (codePoint === undefined) {
      return false;
    }
    this.cursor += n;
    this.representationEnd = this.cursor - 1;
    return codePoint;
  }
  unreadCodePoint(n = 1) {
    if (this.cursor === 0) {
      return false;
    }
    this.cursor -= n;
    this.representationEnd = this.cursor - 1;
    return true;
  }
  representationString() {
    return this.source.slice(this.representationStart, this.representationEnd + 1);
  }
  resetRepresentation() {
    this.representationStart = this.cursor;
    this.representationEnd = -1;
  }
  slice(start, end) {
    return this.source.slice(start, end);
  }
}

var TokenType;
(function (TokenType) {
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#comment-diagram */
  TokenType["Comment"] = "comment";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-at-keyword-token */
  TokenType["AtKeyword"] = "at-keyword-token";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-bad-string-token */
  TokenType["BadString"] = "bad-string-token";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-bad-url-token */
  TokenType["BadURL"] = "bad-url-token";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-cdc-token */
  TokenType["CDC"] = "CDC-token";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-cdo-token */
  TokenType["CDO"] = "CDO-token";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-colon-token */
  TokenType["Colon"] = "colon-token";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-comma-token */
  TokenType["Comma"] = "comma-token";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-delim-token */
  TokenType["Delim"] = "delim-token";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-dimension-token */
  TokenType["Dimension"] = "dimension-token";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-eof-token */
  TokenType["EOF"] = "EOF-token";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-function-token */
  TokenType["Function"] = "function-token";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-hash-token */
  TokenType["Hash"] = "hash-token";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-ident-token */
  TokenType["Ident"] = "ident-token";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-percentage-token */
  TokenType["Number"] = "number-token";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-percentage-token */
  TokenType["Percentage"] = "percentage-token";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-semicolon-token */
  TokenType["Semicolon"] = "semicolon-token";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-string-token */
  TokenType["String"] = "string-token";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-url-token */
  TokenType["URL"] = "url-token";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-whitespace-token */
  TokenType["Whitespace"] = "whitespace-token";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-open-paren */
  TokenType["OpenParen"] = "(-token";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-close-paren */
  TokenType["CloseParen"] = ")-token";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-open-square */
  TokenType["OpenSquare"] = "[-token";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-close-square */
  TokenType["CloseSquare"] = "]-token";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-open-curly */
  TokenType["OpenCurly"] = "{-token";
  /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-close-curly */
  TokenType["CloseCurly"] = "}-token";
})(TokenType || (TokenType = {}));
var NumberType;
(function (NumberType) {
  NumberType["Integer"] = "integer";
  NumberType["Number"] = "number";
})(NumberType || (NumberType = {}));
var HashType;
(function (HashType) {
  HashType["Unrestricted"] = "unrestricted";
  HashType["ID"] = "id";
})(HashType || (HashType = {}));
function mirrorVariantType(type) {
  switch (type) {
    case TokenType.OpenParen:
      return TokenType.CloseParen;
    case TokenType.CloseParen:
      return TokenType.OpenParen;
    case TokenType.OpenCurly:
      return TokenType.CloseCurly;
    case TokenType.CloseCurly:
      return TokenType.OpenCurly;
    case TokenType.OpenSquare:
      return TokenType.CloseSquare;
    case TokenType.CloseSquare:
      return TokenType.OpenSquare;
    default:
      return null;
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isToken(x) {
  if (!Array.isArray(x)) {
    return false;
  }
  if (x.length < 4) {
    return false;
  }
  if (!(x[0] in TokenType)) {
    return false;
  }
  if (typeof x[1] !== 'string') {
    return false;
  }
  if (typeof x[2] !== 'number') {
    return false;
  }
  if (typeof x[3] !== 'number') {
    return false;
  }
  return true;
}

function stringify(...tokens) {
  let buffer = '';
  for (let i = 0; i < tokens.length; i++) {
    buffer = buffer + tokens[i][1];
  }
  return buffer;
}

/** ' */
const APOSTROPHE = '\u{27}'.charCodeAt(0);
/** * */
const ASTERISK = '\u{2a}'.charCodeAt(0);
/** \b */
const BACKSPACE = '\u{8}'.charCodeAt(0);
/** \r */
const CARRIAGE_RETURN = '\u{d}'.charCodeAt(0);
/** \t */
const CHARACTER_TABULATION = '\u{9}'.charCodeAt(0);
/** : */
const COLON = '\u{3a}'.charCodeAt(0);
/** , */
const COMMA = '\u{2c}'.charCodeAt(0);
/** @ */
const COMMERCIAL_AT = '\u{40}'.charCodeAt(0);
/** \x7F */
const DELETE = '\u{7f}'.charCodeAt(0);
/** ! */
const EXCLAMATION_MARK = '\u{21}'.charCodeAt(0);
/** \f */
const FORM_FEED = '\u{c}'.charCodeAt(0);
/** . */
const FULL_STOP = '\u{2e}'.charCodeAt(0);
/** > */
const GREATER_THAN_SIGN = '\u{3e}'.charCodeAt(0);
/** - */
const HYPHEN_MINUS = '\u{2d}'.charCodeAt(0);
/** \x1F */
const INFORMATION_SEPARATOR_ONE = '\u{1f}'.charCodeAt(0);
/** E */
const LATIN_CAPITAL_LETTER_E = '\u{45}'.charCodeAt(0);
/** e */
const LATIN_SMALL_LETTER_E = '\u{65}'.charCodeAt(0);
/** { */
const LEFT_CURLY_BRACKET = '\u{7b}'.charCodeAt(0);
/** ( */
const LEFT_PARENTHESIS = '\u{28}'.charCodeAt(0);
/** [ */
const LEFT_SQUARE_BRACKET = '\u{5b}'.charCodeAt(0);
/** < */
const LESS_THAN_SIGN = '\u{3c}'.charCodeAt(0);
/** \n */
const LINE_FEED = '\u{a}'.charCodeAt(0);
/** \v */
const LINE_TABULATION = '\u{b}'.charCodeAt(0);
/** _ */
const LOW_LINE = '\u{5f}'.charCodeAt(0);
/** \x10FFFF */
const MAXIMUM_ALLOWED_CODEPOINT = '\u{10FFFF}'.charCodeAt(0);
/** \x00 */
const NULL = '\u{0}'.charCodeAt(0);
/** # */
const NUMBER_SIGN = '\u{23}'.charCodeAt(0);
/** % */
const PERCENTAGE_SIGN = '\u{25}'.charCodeAt(0);
/** + */
const PLUS_SIGN = '\u{2b}'.charCodeAt(0);
/** " */
const QUOTATION_MARK = '\u{22}'.charCodeAt(0);
/** � */
const REPLACEMENT_CHARACTER = '\u{0FFFD}'.charCodeAt(0);
/** \ */
const REVERSE_SOLIDUS = '\u{5c}'.charCodeAt(0);
/** } */
const RIGHT_CURLY_BRACKET = '\u{7d}'.charCodeAt(0);
/** ) */
const RIGHT_PARENTHESIS = '\u{29}'.charCodeAt(0);
/** ] */
const RIGHT_SQUARE_BRACKET = '\u{5d}'.charCodeAt(0);
/** ; */
const SEMICOLON = '\u{3b}'.charCodeAt(0);
/** \u0E */
const SHIFT_OUT = '\u{e}'.charCodeAt(0);
/** / */
const SOLIDUS = '\u{2f}'.charCodeAt(0);
/** \u20 */
const SPACE = '\u{20}'.charCodeAt(0);
/** 0 */
const DIGIT_0 = '\u{30}'.charCodeAt(0);
/** 1 */
const DIGIT_1 = '\u{31}'.charCodeAt(0);
/** 2 */
const DIGIT_2 = '\u{32}'.charCodeAt(0);
/** 3 */
const DIGIT_3 = '\u{33}'.charCodeAt(0);
/** 4 */
const DIGIT_4 = '\u{34}'.charCodeAt(0);
/** 5 */
const DIGIT_5 = '\u{35}'.charCodeAt(0);
/** 6 */
const DIGIT_6 = '\u{36}'.charCodeAt(0);
/** 7 */
const DIGIT_7 = '\u{37}'.charCodeAt(0);
/** 8 */
const DIGIT_8 = '\u{38}'.charCodeAt(0);
/** 9 */
const DIGIT_9 = '\u{39}'.charCodeAt(0);

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-token
function checkIfFourCodePointsWouldStartCDO(ctx, reader) {
  return reader.codePointSource[reader.cursor] === LESS_THAN_SIGN && reader.codePointSource[reader.cursor + 1] === EXCLAMATION_MARK && reader.codePointSource[reader.cursor + 2] === HYPHEN_MINUS && reader.codePointSource[reader.cursor + 3] === HYPHEN_MINUS;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokenizer-definitions
const digitsLow = '\u{30}'.charCodeAt(0);
const digitsHigh = '\u{39}'.charCodeAt(0);
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#digit
function isDigitCodePoint(search) {
  return digitsLow <= search && search <= digitsHigh;
}
const letterUppercaseLow = '\u{41}'.charCodeAt(0);
const letterUppercaseHigh = '\u{5a}'.charCodeAt(0);
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#uppercase-letter
function isUppercaseLetterCodePoint(search) {
  return letterUppercaseLow <= search && search <= letterUppercaseHigh;
}
const letterLowercaseLow = '\u{61}'.charCodeAt(0);
const letterLowercaseHigh = '\u{7a}'.charCodeAt(0);
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#lowercase-letter
function isLowercaseLetterCodePoint(search) {
  return letterLowercaseLow <= search && search <= letterLowercaseHigh;
}
const afUppercaseHigh = '\u{46}'.charCodeAt(0);
const afLowercaseHigh = '\u{66}'.charCodeAt(0);
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#hex-digit
function isHexDigitCodePoint(search) {
  if (digitsLow <= search && search <= digitsHigh) {
    return true;
  }
  if (letterLowercaseLow <= search && search <= afLowercaseHigh) {
    return true;
  }
  if (letterUppercaseLow <= search && search <= afUppercaseHigh) {
    return true;
  }
  return false;
}
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#letter
function isLetterCodePoint(search) {
  return isLowercaseLetterCodePoint(search) || isUppercaseLetterCodePoint(search);
}
const nonASCIILow = '\u{80}'.charCodeAt(0);
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#non-ascii-code-point
function isNonASCIICodePoint(search) {
  return search >= nonASCIILow;
}
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#ident-start-code-point
function isIdentStartCodePoint(search) {
  if (isLetterCodePoint(search)) {
    return true;
  }
  if (isNonASCIICodePoint(search)) {
    return true;
  }
  return search === LOW_LINE;
}
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#ident-code-point
function isIdentCodePoint(search) {
  if (isIdentStartCodePoint(search)) {
    return true;
  }
  if (isDigitCodePoint(search)) {
    return true;
  }
  return search === HYPHEN_MINUS;
}
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#non-printable-code-point
function isNonPrintableCodePoint(search) {
  if (search === LINE_TABULATION) {
    return true;
  }
  if (search === DELETE) {
    return true;
  }
  if (NULL <= search && search <= BACKSPACE) {
    return true;
  }
  return SHIFT_OUT <= search && search <= INFORMATION_SEPARATOR_ONE;
}
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#whitespace
function isNewLine(search) {
  switch (search) {
    case LINE_FEED:
    case CARRIAGE_RETURN:
    case FORM_FEED:
      // https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#input-preprocessing
      // We can not follow the preprocessing rules because our output is text and must be minimally different from the input.
      // Applying the preprocessing rules would make it impossible to match the input.
      // A side effect of this is that our definition of whitespace is broader.
      return true;
    default:
      return false;
  }
}
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#whitespace
function isWhitespace(search) {
  // https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#input-preprocessing
  // We can not follow the preprocessing rules because our output is text and must be minimally different from the input.
  // Applying the preprocessing rules would make it impossible to match the input.
  // A side effect of this is that our definition of whitespace is broader.
  switch (search) {
    case LINE_FEED:
    case CARRIAGE_RETURN:
    case FORM_FEED:
    case CHARACTER_TABULATION:
    case SPACE:
      return true;
    default:
      return false;
  }
}
const surrogateLow = '\u{d800}'.charCodeAt(0);
const surrogateHigh = '\u{dfff}'.charCodeAt(0);
// https://infra.spec.whatwg.org/#surrogate
function isSurrogate(search) {
  return surrogateLow <= search && search <= surrogateHigh;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#starts-with-a-valid-escape
function checkIfTwoCodePointsAreAValidEscape(ctx, reader) {
  // If the first code point is not U+005C REVERSE SOLIDUS (\), return false.
  if (reader.codePointSource[reader.cursor] !== REVERSE_SOLIDUS) {
    // "\"
    return false;
  }
  // Otherwise, if the second code point is a newline, return false.
  if (reader.codePointSource[reader.cursor + 1] === LINE_FEED) {
    return false;
  }
  // Otherwise, return true.
  return true;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#would-start-an-identifier
function checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader) {
  // // U+002D HYPHEN-MINUS
  if (reader.codePointSource[reader.cursor] === HYPHEN_MINUS) {
    // If the second code point is a U+002D HYPHEN-MINUS return true
    if (reader.codePointSource[reader.cursor + 1] === HYPHEN_MINUS) {
      return true;
    }
    // If the second code point is an ident-start code point return true
    if (isIdentStartCodePoint(reader.codePointSource[reader.cursor + 1])) {
      return true;
    }
    // If the second and third code points are a valid escape return true
    if (reader.codePointSource[reader.cursor + 1] === REVERSE_SOLIDUS && reader.codePointSource[reader.cursor + 2] !== LINE_FEED) {
      return true;
    }
    return false;
  }
  // ident-start code point
  // Return true.
  if (isIdentStartCodePoint(reader.codePointSource[reader.cursor])) {
    return true;
  }
  // U+005C REVERSE SOLIDUS (\)
  return checkIfTwoCodePointsAreAValidEscape(ctx, reader);
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#starts-with-a-number
function checkIfThreeCodePointsWouldStartANumber(ctx, reader) {
  if (reader.codePointSource[reader.cursor] === PLUS_SIGN || reader.codePointSource[reader.cursor] === HYPHEN_MINUS) {
    // U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS (-)
    // If the second code point is a digit, return true.
    if (isDigitCodePoint(reader.codePointSource[reader.cursor + 1])) {
      return true;
    }
    // Otherwise, if the second code point is a U+002E FULL STOP (.)
    if (reader.codePointSource[reader.cursor + 1] === FULL_STOP) {
      // and the third code point is a digit, return true.
      return isDigitCodePoint(reader.codePointSource[reader.cursor + 2]);
    }
    // Otherwise, return false.
    return false;
  } else if (reader.codePointSource[reader.cursor] === FULL_STOP) {
    // U+002E FULL STOP (.)
    // If the second code point is a digit, return true.
    // Otherwise, return false.
    return isDigitCodePoint(reader.codePointSource[reader.cursor + 1]);
  } else if (isDigitCodePoint(reader.codePointSource[reader.cursor])) {
    // digit
    // Return true.
    return true;
  }
  // anything else
  // Return false.
  return false;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-comments
function checkIfTwoCodePointsStartAComment(ctx, reader) {
  if (reader.codePointSource[reader.cursor] !== SOLIDUS) {
    return false;
  }
  if (reader.codePointSource[reader.cursor + 1] !== ASTERISK) {
    return false;
  }
  // Otherwise, return true.
  return true;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-token
function checkIfThreeCodePointsWouldStartCDC(ctx, reader) {
  return reader.codePointSource[reader.cursor] === HYPHEN_MINUS && reader.codePointSource[reader.cursor + 1] === HYPHEN_MINUS && reader.codePointSource[reader.cursor + 2] === GREATER_THAN_SIGN;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-comment
function consumeComment(ctx, reader) {
  reader.advanceCodePoint(2);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const codePoint = reader.readCodePoint();
    if (codePoint === false) {
      ctx.onParseError({
        message: 'Unexpected EOF while consuming a comment.',
        start: reader.representationStart,
        end: reader.representationEnd,
        state: ['4.3.2. Consume comments', 'Unexpected EOF']
      });
      break;
    }
    if (codePoint !== ASTERISK) {
      continue;
    }
    if (reader.codePointSource[reader.cursor] === undefined) {
      continue;
    }
    if (reader.codePointSource[reader.cursor] === SOLIDUS) {
      reader.advanceCodePoint();
      break;
    }
  }
  return [TokenType.Comment, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-escaped-code-point
function consumeEscapedCodePoint(ctx, reader) {
  const codePoint = reader.readCodePoint();
  if (codePoint === false) {
    ctx.onParseError({
      message: 'Unexpected EOF while consuming an escaped code point.',
      start: reader.representationStart,
      end: reader.representationEnd,
      state: ['4.3.7. Consume an escaped code point', 'Unexpected EOF']
    });
    return REPLACEMENT_CHARACTER;
  }
  if (isHexDigitCodePoint(codePoint)) {
    const hexSequence = [codePoint];
    while (reader.codePointSource[reader.cursor] !== undefined && isHexDigitCodePoint(reader.codePointSource[reader.cursor]) && hexSequence.length < 6) {
      hexSequence.push(reader.codePointSource[reader.cursor]);
      reader.advanceCodePoint();
    }
    if (isWhitespace(reader.codePointSource[reader.cursor])) {
      reader.advanceCodePoint();
    }
    const codePointLiteral = parseInt(String.fromCharCode(...hexSequence), 16);
    if (codePointLiteral === 0) {
      return REPLACEMENT_CHARACTER;
    }
    if (isSurrogate(codePointLiteral)) {
      return REPLACEMENT_CHARACTER;
    }
    if (codePointLiteral > MAXIMUM_ALLOWED_CODEPOINT) {
      return REPLACEMENT_CHARACTER;
    }
    return codePointLiteral;
  }
  return codePoint;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-name
function consumeIdentSequence(ctx, reader) {
  const result = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (isIdentCodePoint(reader.codePointSource[reader.cursor])) {
      result.push(reader.codePointSource[reader.cursor]);
      reader.advanceCodePoint();
      continue;
    }
    if (checkIfTwoCodePointsAreAValidEscape(ctx, reader)) {
      reader.advanceCodePoint();
      result.push(consumeEscapedCodePoint(ctx, reader));
      continue;
    }
    return result;
  }
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-token
function consumeHashToken(ctx, reader) {
  reader.advanceCodePoint();
  if (reader.codePointSource[reader.cursor] !== undefined && isIdentCodePoint(reader.codePointSource[reader.cursor]) || checkIfTwoCodePointsAreAValidEscape(ctx, reader)) {
    let hashType = HashType.Unrestricted;
    if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
      hashType = HashType.ID;
    }
    const identSequence = consumeIdentSequence(ctx, reader);
    return [TokenType.Hash, reader.representationString(), reader.representationStart, reader.representationEnd, {
      value: String.fromCharCode(...identSequence),
      type: hashType
    }];
  }
  return [TokenType.Delim, reader.representationString(), reader.representationStart, reader.representationEnd, {
    value: '#'
  }];
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-number
function consumeNumber(ctx, reader) {
  // 1. Initially set type to "integer".
  // Let repr be the empty string.
  let type = NumberType.Integer;
  const repr = [];
  {
    // 2. If the next input code point is U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS (-), consume it and append it to repr.
    if (reader.codePointSource[reader.cursor] === PLUS_SIGN || reader.codePointSource[reader.cursor] === HYPHEN_MINUS) {
      repr.push(reader.codePointSource[reader.cursor]);
      reader.advanceCodePoint();
    }
    // 3. While the next input code point is a digit, consume it and append it to repr.
    const newPart = consumeDigits(reader);
    for (let i = 0; i < newPart.length; i++) {
      repr.push(newPart[i]);
    }
  }
  {
    // 4. If the next 2 input code points are U+002E FULL STOP (.) followed by a digit, then:
    if (reader.codePointSource[reader.cursor] === FULL_STOP && isDigitCodePoint(reader.codePointSource[reader.cursor + 1])) {
      // 4.2. Append them to repr.
      repr.push(reader.codePointSource[reader.cursor]);
      repr.push(reader.codePointSource[reader.cursor + 1]);
      // 4.1. Consume them.
      reader.advanceCodePoint(2);
      // 4.3. Set type to "number".
      type = NumberType.Number;
      // 4.4. While the next input code point is a digit, consume it and append it to repr.
      const newPart = consumeDigits(reader);
      for (let i = 0; i < newPart.length; i++) {
        repr.push(newPart[i]);
      }
    }
  }
  {
    // 5. If the next 2 or 3 input code points are U+0045 LATIN CAPITAL LETTER E (E) or U+0065 LATIN SMALL LETTER E (e),
    // optionally followed by U+002D HYPHEN-MINUS (-) or U+002B PLUS SIGN (+),
    // followed by a digit, then:
    if ((reader.codePointSource[reader.cursor] === LATIN_SMALL_LETTER_E || reader.codePointSource[reader.cursor] === LATIN_CAPITAL_LETTER_E) && isDigitCodePoint(reader.codePointSource[reader.cursor + 1])) {
      // 5.2. Append them to repr.
      repr.push(reader.codePointSource[reader.cursor]);
      repr.push(reader.codePointSource[reader.cursor + 1]);
      // 5.1. Consume them.
      reader.advanceCodePoint(2);
      // 5.3. Set type to "number".
      type = NumberType.Number;
      // 5.4. While the next input code point is a digit, consume it and append it to repr.
      const newPart = consumeDigits(reader);
      for (let i = 0; i < newPart.length; i++) {
        repr.push(newPart[i]);
      }
    }
    if ((reader.codePointSource[reader.cursor] === LATIN_SMALL_LETTER_E || reader.codePointSource[reader.cursor] === LATIN_CAPITAL_LETTER_E) && (reader.codePointSource[reader.cursor + 1] === HYPHEN_MINUS || reader.codePointSource[reader.cursor + 1] === PLUS_SIGN) && isDigitCodePoint(reader.codePointSource[reader.cursor + 2])) {
      // 5.2. Append them to repr.
      repr.push(reader.codePointSource[reader.cursor]);
      repr.push(reader.codePointSource[reader.cursor + 1]);
      repr.push(reader.codePointSource[reader.cursor + 2]);
      // 5.1. Consume them.
      reader.advanceCodePoint(3);
      // 5.3. Set type to "number".
      type = NumberType.Number;
      // 5.4. While the next input code point is a digit, consume it and append it to repr.
      const newPart = consumeDigits(reader);
      for (let i = 0; i < newPart.length; i++) {
        repr.push(newPart[i]);
      }
    }
  }
  // 6. Convert repr to a number, and set the value to the returned value.
  const value = convertCodePointsToNumber(repr);
  // 7. Return value and type.
  return [value, type];
}
function consumeDigits(reader) {
  const value = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (reader.codePointSource[reader.cursor] === undefined) {
      return value;
    }
    if (isDigitCodePoint(reader.codePointSource[reader.cursor])) {
      value.push(reader.codePointSource[reader.cursor]);
      reader.advanceCodePoint();
    } else {
      return value;
    }
  }
}
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#convert-string-to-number
function convertCodePointsToNumber(codePoints) {
  let s = 1;
  const iCodePoints = [];
  let i = 0;
  let d = 0;
  const fCodePoints = [];
  let f = 0;
  let t = 1;
  const eCodePoints = [];
  let e = 0;
  let cursor = 0;
  // 1. A sign: a single U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS (-), or the empty string.
  // Let s be the number -1 if the sign is U+002D HYPHEN-MINUS (-);
  // otherwise, let s be the number 1.
  if (codePoints[cursor] === HYPHEN_MINUS) {
    cursor++;
    s = -1;
  } else if (codePoints[cursor] === PLUS_SIGN) {
    cursor++;
  }
  // 2. An integer part: zero or more digits.
  // If there is at least one digit,
  // let i be the number formed by interpreting the digits as a base-10 integer;
  // otherwise, let i be the number 0.
  while (cursor < codePoints.length && isDigitCodePoint(codePoints[cursor])) {
    iCodePoints.push(codePoints[cursor]);
    cursor++;
  }
  i = digitCodePointsToInteger(iCodePoints);
  // 3. A decimal point: a single U+002E FULL STOP (.), or the empty string.
  if (codePoints[cursor] === FULL_STOP) {
    cursor++;
  }
  // 4. A fractional part: zero or more digits.
  // If there is at least one digit,
  // let f be the number formed by interpreting the digits as a base-10 integer and d be the number of digits;
  // otherwise, let f and d be the number 0.
  while (cursor < codePoints.length && isDigitCodePoint(codePoints[cursor])) {
    fCodePoints.push(codePoints[cursor]);
    cursor++;
  }
  d = fCodePoints.length;
  f = digitCodePointsToInteger(fCodePoints) / Math.pow(10, d);
  // 5. An exponent indicator: a single U+0045 LATIN CAPITAL LETTER E (E) or U+0065 LATIN SMALL LETTER E (e), or the empty string.
  if (codePoints[cursor] === LATIN_SMALL_LETTER_E || codePoints[cursor] === LATIN_CAPITAL_LETTER_E) {
    cursor++;
  }
  // 6. An exponent sign: a single U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS (-), or the empty string.
  // Let t be the number -1 if the sign is U+002D HYPHEN-MINUS (-);
  // otherwise, let t be the number 1.
  if (codePoints[cursor] === HYPHEN_MINUS) {
    cursor++;
    t = -1;
  } else if (codePoints[cursor] === PLUS_SIGN) {
    cursor++;
  }
  // 7. An exponent: zero or more digits.
  // If there is at least one digit,
  // let e be the number formed by interpreting the digits as a base-10 integer;
  // otherwise, let e be the number 0.
  while (cursor < codePoints.length && isDigitCodePoint(codePoints[cursor])) {
    eCodePoints.push(codePoints[cursor]);
    cursor++;
  }
  e = digitCodePointsToInteger(eCodePoints);
  // Return the number s·(i + f·10-d)·10te.
  return s * (i + f) * Math.pow(10, t * e);
}
function digitCodePointsToInteger(codePoints) {
  if (codePoints.length === 0) {
    return 0;
  }
  return Number.parseInt(String.fromCharCode(...codePoints), 10);
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-numeric-token
function consumeNumericToken(ctx, reader) {
  const numberValue = consumeNumber(ctx, reader);
  if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
    const unit = consumeIdentSequence(ctx, reader);
    return [TokenType.Dimension, reader.representationString(), reader.representationStart, reader.representationEnd, {
      value: numberValue[0],
      type: numberValue[1],
      unit: String.fromCharCode(...unit)
    }];
  }
  {
    if (reader.codePointSource[reader.cursor] === PERCENTAGE_SIGN) {
      reader.advanceCodePoint();
      return [TokenType.Percentage, reader.representationString(), reader.representationStart, reader.representationEnd, {
        value: numberValue[0]
      }];
    }
  }
  return [TokenType.Number, reader.representationString(), reader.representationStart, reader.representationEnd, {
    value: numberValue[0],
    type: numberValue[1]
  }];
}

function consumeWhiteSpace(ctx, reader) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (!isWhitespace(reader.codePointSource[reader.cursor])) {
      break;
    }
    reader.advanceCodePoint();
  }
  return [TokenType.Whitespace, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-string-token
function consumeStringToken(ctx, reader) {
  let result = '';
  const first = reader.readCodePoint();
  if (first === false) {
    throw new Error('Unexpected EOF');
  }
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const next = reader.readCodePoint();
    if (next === false) {
      ctx.onParseError({
        message: 'Unexpected EOF while consuming a string token.',
        start: reader.representationStart,
        end: reader.representationEnd,
        state: ['4.3.5. Consume a string token', 'Unexpected EOF']
      });
      return [TokenType.String, reader.representationString(), reader.representationStart, reader.representationEnd, {
        value: result
      }];
    }
    if (isNewLine(next)) {
      {
        ctx.onParseError({
          message: 'Unexpected newline while consuming a string token.',
          start: reader.representationStart,
          end: reader.representationEnd,
          state: ['4.3.5. Consume a string token', 'Unexpected newline']
        });
      }
      reader.unreadCodePoint();
      return [TokenType.BadString, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
    }
    if (next === first) {
      return [TokenType.String, reader.representationString(), reader.representationStart, reader.representationEnd, {
        value: result
      }];
    }
    if (next === REVERSE_SOLIDUS) {
      if (reader.codePointSource[reader.cursor] === undefined) {
        continue;
      }
      if (isNewLine(reader.codePointSource[reader.cursor])) {
        reader.advanceCodePoint();
        continue;
      }
      result += String.fromCharCode(consumeEscapedCodePoint(ctx, reader));
      continue;
    }
    result += String.fromCharCode(next);
  }
}

const u = 'u'.charCodeAt(0);
const U = 'U'.charCodeAt(0);
const r = 'r'.charCodeAt(0);
const R = 'R'.charCodeAt(0);
const l = 'l'.charCodeAt(0);
const L = 'L'.charCodeAt(0);
function checkIfCodePointsMatchURLIdent(ctx, codePoints) {
  if (codePoints.length !== 3) {
    return false;
  }
  if (codePoints[0] !== u && codePoints[0] !== U) {
    return false;
  }
  if (codePoints[1] !== r && codePoints[1] !== R) {
    return false;
  }
  if (codePoints[2] !== l && codePoints[2] !== L) {
    return false;
  }
  return true;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-remnants-of-bad-url
function consumeBadURL(ctx, reader) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (reader.codePointSource[reader.cursor] === undefined) {
      return;
    }
    if (reader.codePointSource[reader.cursor] === RIGHT_PARENTHESIS) {
      reader.advanceCodePoint();
      return;
    }
    if (checkIfTwoCodePointsAreAValidEscape(ctx, reader)) {
      reader.advanceCodePoint();
      consumeEscapedCodePoint(ctx, reader);
      continue;
    }
    reader.advanceCodePoint();
    continue;
  }
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-url-token
function consumeUrlToken(ctx, reader) {
  consumeWhiteSpace(ctx, reader);
  let string = '';
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (reader.codePointSource[reader.cursor] === undefined) {
      ctx.onParseError({
        message: 'Unexpected EOF while consuming a url token.',
        start: reader.representationStart,
        end: reader.representationEnd,
        state: ['4.3.6. Consume a url token', 'Unexpected EOF']
      });
      return [TokenType.URL, reader.representationString(), reader.representationStart, reader.representationEnd, {
        value: string
      }];
    }
    if (reader.codePointSource[reader.cursor] === RIGHT_PARENTHESIS) {
      reader.advanceCodePoint();
      return [TokenType.URL, reader.representationString(), reader.representationStart, reader.representationEnd, {
        value: string
      }];
    }
    if (isWhitespace(reader.codePointSource[reader.cursor])) {
      consumeWhiteSpace(ctx, reader);
      if (reader.codePointSource[reader.cursor] === undefined) {
        ctx.onParseError({
          message: 'Unexpected EOF while consuming a url token.',
          start: reader.representationStart,
          end: reader.representationEnd,
          state: ['4.3.6. Consume a url token', 'Consume as much whitespace as possible', 'Unexpected EOF']
        });
        return [TokenType.URL, reader.representationString(), reader.representationStart, reader.representationEnd, {
          value: string
        }];
      }
      if (reader.codePointSource[reader.cursor] === RIGHT_PARENTHESIS) {
        reader.advanceCodePoint();
        return [TokenType.URL, reader.representationString(), reader.representationStart, reader.representationEnd, {
          value: string
        }];
      }
      consumeBadURL(ctx, reader);
      return [TokenType.BadURL, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
    }
    if (reader.codePointSource[reader.cursor] === QUOTATION_MARK || reader.codePointSource[reader.cursor] === APOSTROPHE || reader.codePointSource[reader.cursor] === LEFT_PARENTHESIS || isNonPrintableCodePoint(reader.codePointSource[reader.cursor])) {
      consumeBadURL(ctx, reader);
      ctx.onParseError({
        message: 'Unexpected character while consuming a url token.',
        start: reader.representationStart,
        end: reader.representationEnd,
        state: ['4.3.6. Consume a url token', 'Unexpected U+0022 QUOTATION MARK ("), U+0027 APOSTROPHE (\'), U+0028 LEFT PARENTHESIS (() or non-printable code point']
      });
      return [TokenType.BadURL, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
    }
    if (reader.codePointSource[reader.cursor] === REVERSE_SOLIDUS) {
      if (checkIfTwoCodePointsAreAValidEscape(ctx, reader)) {
        string += String.fromCharCode(consumeEscapedCodePoint(ctx, reader));
        continue;
      }
      consumeBadURL(ctx, reader);
      ctx.onParseError({
        message: 'Invalid escape sequence while consuming a url token.',
        start: reader.representationStart,
        end: reader.representationEnd,
        state: ['4.3.6. Consume a url token', 'U+005C REVERSE SOLIDUS (\\)', 'The input stream does not start with a valid escape sequence']
      });
      return [TokenType.BadURL, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
    }
    string += String.fromCharCode(reader.codePointSource[reader.cursor]);
    reader.advanceCodePoint();
  }
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-ident-like-token
function consumeIdentLikeToken(ctx, reader) {
  const codePoints = consumeIdentSequence(ctx, reader);
  if (reader.codePointSource[reader.cursor] !== LEFT_PARENTHESIS) {
    return [TokenType.Ident, reader.representationString(), reader.representationStart, reader.representationEnd, {
      value: String.fromCharCode(...codePoints)
    }];
  }
  if (checkIfCodePointsMatchURLIdent(ctx, codePoints)) {
    reader.advanceCodePoint();
    let read = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const firstIsWhitespace = isWhitespace(reader.codePointSource[reader.cursor]);
      const secondIsWhitespace = isWhitespace(reader.codePointSource[reader.cursor + 1]);
      if (firstIsWhitespace && secondIsWhitespace) {
        read += 2;
        reader.advanceCodePoint(2);
        continue;
      }
      const firstNonWhitespace = firstIsWhitespace ? reader.codePointSource[reader.cursor + 1] : reader.codePointSource[reader.cursor];
      if (firstNonWhitespace === QUOTATION_MARK || firstNonWhitespace === APOSTROPHE) {
        if (read > 0) {
          reader.advanceCodePoint(read);
        }
        return [TokenType.Function, reader.representationString(), reader.representationStart, reader.representationEnd, {
          value: String.fromCharCode(...codePoints)
        }];
      }
      break;
    }
    if (read > 0) {
      reader.advanceCodePoint(read);
    }
    return consumeUrlToken(ctx, reader);
  }
  reader.advanceCodePoint();
  return [TokenType.Function, reader.representationString(), reader.representationStart, reader.representationEnd, {
    value: String.fromCharCode(...codePoints)
  }];
}

function tokenizer(input, options) {
  const css = input.css.valueOf();
  const reader = new Reader(css);
  const ctx = {
    onParseError: (options == null ? void 0 : options.onParseError) ?? (() => {})
  };
  function endOfFile() {
    return reader.codePointSource[reader.cursor] === undefined;
  }
  function nextToken() {
    reader.resetRepresentation();
    if (checkIfTwoCodePointsStartAComment(ctx, reader)) {
      if (options != null && options.commentsAreTokens) {
        return consumeComment(ctx, reader);
      } else {
        consumeComment(ctx, reader);
        reader.resetRepresentation();
      }
    }
    const peeked = reader.codePointSource[reader.cursor];
    if (peeked === undefined) {
      return [TokenType.EOF, '', -1, -1, undefined];
    }
    if (isIdentStartCodePoint(peeked)) {
      return consumeIdentLikeToken(ctx, reader);
    }
    // Simple, one character tokens:
    switch (peeked) {
      case COMMA:
        {
          reader.advanceCodePoint();
          return [TokenType.Comma, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
        }
      case COLON:
        {
          reader.advanceCodePoint();
          return [TokenType.Colon, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
        }
      case SEMICOLON:
        {
          reader.advanceCodePoint();
          return [TokenType.Semicolon, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
        }
      case LEFT_PARENTHESIS:
        {
          reader.advanceCodePoint();
          return [TokenType.OpenParen, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
        }
      case RIGHT_PARENTHESIS:
        {
          reader.advanceCodePoint();
          return [TokenType.CloseParen, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
        }
      case LEFT_SQUARE_BRACKET:
        {
          reader.advanceCodePoint();
          return [TokenType.OpenSquare, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
        }
      case RIGHT_SQUARE_BRACKET:
        {
          reader.advanceCodePoint();
          return [TokenType.CloseSquare, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
        }
      case LEFT_CURLY_BRACKET:
        {
          reader.advanceCodePoint();
          return [TokenType.OpenCurly, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
        }
      case RIGHT_CURLY_BRACKET:
        {
          reader.advanceCodePoint();
          return [TokenType.CloseCurly, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
        }
      case APOSTROPHE:
      case QUOTATION_MARK:
        return consumeStringToken(ctx, reader);
      case NUMBER_SIGN:
        return consumeHashToken(ctx, reader);
      case PLUS_SIGN:
      case FULL_STOP:
        {
          if (checkIfThreeCodePointsWouldStartANumber(ctx, reader)) {
            return consumeNumericToken(ctx, reader);
          }
          reader.advanceCodePoint();
          return [TokenType.Delim, reader.representationString(), reader.representationStart, reader.representationEnd, {
            value: reader.representationString()
          }];
        }
      case DIGIT_0:
      case DIGIT_1:
      case DIGIT_2:
      case DIGIT_3:
      case DIGIT_4:
      case DIGIT_5:
      case DIGIT_6:
      case DIGIT_7:
      case DIGIT_8:
      case DIGIT_9:
        return consumeNumericToken(ctx, reader);
      case LINE_FEED:
      case CARRIAGE_RETURN:
      case FORM_FEED:
      case CHARACTER_TABULATION:
      case SPACE:
        return consumeWhiteSpace(ctx, reader);
      case HYPHEN_MINUS:
        {
          if (checkIfThreeCodePointsWouldStartANumber(ctx, reader)) {
            return consumeNumericToken(ctx, reader);
          }
          if (checkIfThreeCodePointsWouldStartCDC(ctx, reader)) {
            reader.advanceCodePoint(3);
            return [TokenType.CDC, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
          }
          if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
            return consumeIdentLikeToken(ctx, reader);
          }
          reader.advanceCodePoint();
          return [TokenType.Delim, reader.representationString(), reader.representationStart, reader.representationEnd, {
            value: '-'
          }];
        }
      case LESS_THAN_SIGN:
        {
          if (checkIfFourCodePointsWouldStartCDO(ctx, reader)) {
            reader.advanceCodePoint(4);
            return [TokenType.CDO, reader.representationString(), reader.representationStart, reader.representationEnd, undefined];
          }
          reader.advanceCodePoint();
          return [TokenType.Delim, reader.representationString(), reader.representationStart, reader.representationEnd, {
            value: '<'
          }];
        }
      case COMMERCIAL_AT:
        {
          reader.advanceCodePoint();
          if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
            const identSequence = consumeIdentSequence(ctx, reader);
            return [TokenType.AtKeyword, reader.representationString(), reader.representationStart, reader.representationEnd, {
              value: String.fromCharCode(...identSequence)
            }];
          }
          return [TokenType.Delim, reader.representationString(), reader.representationStart, reader.representationEnd, {
            value: '@'
          }];
        }
      case REVERSE_SOLIDUS:
        {
          if (checkIfTwoCodePointsAreAValidEscape(ctx, reader)) {
            return consumeIdentLikeToken(ctx, reader);
          }
          reader.advanceCodePoint();
          ctx.onParseError({
            message: 'Invalid escape sequence after "\\"',
            start: reader.representationStart,
            end: reader.representationEnd,
            state: ['4.3.1. Consume a token', 'U+005C REVERSE SOLIDUS (\\)', 'The input stream does not start with a valid escape sequence']
          });
          return [TokenType.Delim, reader.representationString(), reader.representationStart, reader.representationEnd, {
            value: '\\'
          }];
        }
    }
    reader.advanceCodePoint();
    return [TokenType.Delim, reader.representationString(), reader.representationStart, reader.representationEnd, {
      value: reader.representationString()
    }];
  }
  return {
    nextToken: nextToken,
    endOfFile: endOfFile
  };
}

function cloneTokens(tokens) {
  if (typeof globalThis !== 'undefined' && 'structuredClone' in globalThis) {
    return structuredClone(tokens);
  }
  return JSON.parse(JSON.stringify(tokens));
}

export { NumberType, Reader, TokenType, cloneTokens, isToken, mirrorVariantType, stringify, tokenizer };
//# sourceMappingURL=index.mjs.map
