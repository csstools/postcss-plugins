/**
 * The CSS Tokenizer is forgiving and will never throw on invalid input.
 * Any errors are reported through the `onParseError` callback.
 */
class ParseError extends Error {
    /** The index of the start character of the current token. */
    sourceStart;
    /** The index of the end character of the current token. */
    sourceEnd;
    /** The parser steps that preceded the error. */
    parserState;
    constructor(message, sourceStart, sourceEnd, parserState) {
        super(message);
        this.name = 'ParseError';
        this.sourceStart = sourceStart;
        this.sourceEnd = sourceEnd;
        this.parserState = parserState;
    }
}
class ParseErrorWithToken extends ParseError {
    /** The associated token. */
    token;
    constructor(message, sourceStart, sourceEnd, parserState, token) {
        super(message, sourceStart, sourceEnd, parserState);
        this.token = token;
    }
}
const ParseErrorMessage = {
    UnexpectedNewLineInString: 'Unexpected newline while consuming a string token.',
    UnexpectedEOFInString: 'Unexpected EOF while consuming a string token.',
    UnexpectedEOFInComment: 'Unexpected EOF while consuming a comment.',
    UnexpectedEOFInURL: 'Unexpected EOF while consuming a url token.',
    UnexpectedEOFInEscapedCodePoint: 'Unexpected EOF while consuming an escaped code point.',
    UnexpectedCharacterInURL: 'Unexpected character while consuming a url token.',
    InvalidEscapeSequenceInURL: 'Invalid escape sequence while consuming a url token.',
    InvalidEscapeSequenceAfterBackslash: 'Invalid escape sequence after "\\"',
};

const supportsStructuredClone = (typeof globalThis !== 'undefined') && 'structuredClone' in globalThis;
/**
 * Deep clone a list of tokens.
 * Useful for mutations without altering the original list.
 */
function cloneTokens(tokens) {
    if (supportsStructuredClone) {
        return structuredClone(tokens);
    }
    return JSON.parse(JSON.stringify(tokens));
}

/**
 * Concatenate the string representation of a list of tokens.
 * This is not a proper serializer that will handle escaping and whitespace.
 * It only produces valid CSS for a token list that is also valid.
 */
function stringify(...tokens) {
    let buffer = '';
    for (let i = 0; i < tokens.length; i++) {
        buffer = buffer + tokens[i][1];
    }
    return buffer;
}

/** ' */
const APOSTROPHE = 0x0027;
/** * */
const ASTERISK = 0x002a;
/** \b */
const BACKSPACE = 0x008;
/** \r */
const CARRIAGE_RETURN = 0x00d;
/** \t */
const CHARACTER_TABULATION = 0x009;
/** : */
const COLON = 0x003a;
/** , */
const COMMA = 0x002c;
/** @ */
const COMMERCIAL_AT = 0x0040;
/** \x7F */
const DELETE = 0x007f;
/** ! */
const EXCLAMATION_MARK = 0x0021;
/** \f */
const FORM_FEED = 0x000c;
/** . */
const FULL_STOP = 0x002e;
/** > */
const GREATER_THAN_SIGN = 0x003e;
/** - */
const HYPHEN_MINUS = 0x002d;
/** \x1F */
const INFORMATION_SEPARATOR_ONE = 0x001f;
/** E */
const LATIN_CAPITAL_LETTER_E = 0x0045;
/** e */
const LATIN_SMALL_LETTER_E = 0x0065;
/** { */
const LEFT_CURLY_BRACKET = 0x007b;
/** ( */
const LEFT_PARENTHESIS = 0x0028;
/** [ */
const LEFT_SQUARE_BRACKET = 0x005b;
/** < */
const LESS_THAN_SIGN = 0x003c;
/** \n */
const LINE_FEED = 0x00a;
/** \v */
const LINE_TABULATION = 0x00b;
/** _ */
const LOW_LINE = 0x005f;
/** \x10FFFF */
const MAXIMUM_ALLOWED_CODEPOINT = 0x10FFFF;
/** \x00 */
const NULL = 0x000;
/** # */
const NUMBER_SIGN = 0x0023;
/** % */
const PERCENTAGE_SIGN = 0x0025;
/** + */
const PLUS_SIGN = 0x002b;
/** " */
const QUOTATION_MARK = 0x0022;
/** � */
const REPLACEMENT_CHARACTER = 0xFFFD;
/** \ */
const REVERSE_SOLIDUS = 0x005c;
/** } */
const RIGHT_CURLY_BRACKET = 0x007d;
/** ) */
const RIGHT_PARENTHESIS = 0x0029;
/** ] */
const RIGHT_SQUARE_BRACKET = 0x005d;
/** ; */
const SEMICOLON = 0x003b;
/** \u0E */
const SHIFT_OUT = 0x00e;
/** / */
const SOLIDUS = 0x002f;
/** \u20 */
const SPACE = 0x0020;
/** u */
const LATIN_SMALL_LETTER_U = 0x0075;
/** U */
const LATIN_CAPITAL_LETTER_U = 0x0055;
/** r */
const LATIN_SMALL_LETTER_R = 0x0072;
/** R */
const LATIN_CAPITAL_LETTER_R = 0x0052;
/** l */
const LATIN_SMALL_LETTER_L = 0x006c;
/** L */
const LATIN_CAPITAL_LETTER_L = 0x004c;
/** ? */
const QUESTION_MARK = 0x003f;
/** 0 */
const DIGIT_ZERO = 0x0030;
/** F */
const LATIN_CAPITAL_LETTER_F = 0x0046;

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-token
function checkIfFourCodePointsWouldStartCDO(reader) {
    return reader.source.codePointAt(reader.cursor) === LESS_THAN_SIGN && reader.source.codePointAt(reader.cursor + 1) === EXCLAMATION_MARK && reader.source.codePointAt(reader.cursor + 2) === HYPHEN_MINUS && reader.source.codePointAt(reader.cursor + 3) === HYPHEN_MINUS;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokenizer-definitions
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#digit
function isDigitCodePoint(search) {
    return (typeof search !== "undefined") && search >= 0x0030 && search <= 0x0039;
}
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#uppercase-letter
function isUppercaseLetterCodePoint(search) {
    return (typeof search !== "undefined") && search >= 0x0041 && search <= 0x005a;
}
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#lowercase-letter
function isLowercaseLetterCodePoint(search) {
    return (typeof search !== "undefined") && search >= 0x0061 && search <= 0x007a;
}
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#hex-digit
function isHexDigitCodePoint(search) {
    return (typeof search !== "undefined") && ((search >= 0x0030 && search <= 0x0039) || // 0 .. 9
        (search >= 0x0061 && search <= 0x0066) || // a .. f
        (search >= 0x0041 && search <= 0x0046) // A .. F
    );
}
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#letter
function isLetterCodePoint(search) {
    return isLowercaseLetterCodePoint(search) || isUppercaseLetterCodePoint(search);
}
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#ident-start-code-point
function isIdentStartCodePoint(search) {
    return isLetterCodePoint(search) || isNonASCII_IdentCodePoint(search) || search === LOW_LINE;
}
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#ident-code-point
function isIdentCodePoint(search) {
    return isIdentStartCodePoint(search) || isDigitCodePoint(search) || search === HYPHEN_MINUS;
}
// https://drafts.csswg.org/css-syntax/#non-ascii-ident-code-point
function isNonASCII_IdentCodePoint(search) {
    if (search === 0x00B7 ||
        search === 0x200C ||
        search === 0x200D ||
        search === 0x203F ||
        search === 0x2040 ||
        search === 0x200C) {
        return true;
    }
    if (typeof search === "undefined") {
        return false;
    }
    if ((0x00C0 <= search && search <= 0x00D6) ||
        (0x00D8 <= search && search <= 0x00F6) ||
        (0x00F8 <= search && search <= 0x037D) ||
        (0x037F <= search && search <= 0x1FFF) ||
        (0x2070 <= search && search <= 0x218F) ||
        (0x2C00 <= search && search <= 0x2FEF) ||
        (0x3001 <= search && search <= 0xD7FF) ||
        (0xF900 <= search && search <= 0xFDCF) ||
        (0xFDF0 <= search && search <= 0xFFFD)) {
        return true;
    }
    return search >= 0x10000;
}
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#non-printable-code-point
function isNonPrintableCodePoint(search) {
    return (typeof search !== "undefined") && ((search === LINE_TABULATION) ||
        (search === DELETE) ||
        (NULL <= search && search <= BACKSPACE) ||
        (SHIFT_OUT <= search && search <= INFORMATION_SEPARATOR_ONE));
}
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#whitespace
function isNewLine(search) {
    return search === LINE_FEED || search === CARRIAGE_RETURN || search === FORM_FEED;
}
// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#whitespace
function isWhitespace(search) {
    return search === SPACE || search === LINE_FEED || search === CHARACTER_TABULATION || search === CARRIAGE_RETURN || search === FORM_FEED;
}
// https://infra.spec.whatwg.org/#surrogate
function isSurrogate(search) {
    return (typeof search !== "undefined") && search >= 0xd800 && search <= 0xdfff;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#starts-with-a-valid-escape
function checkIfTwoCodePointsAreAValidEscape(reader) {
    return (
    // If the first code point is not U+005C REVERSE SOLIDUS (\), return false.
    reader.source.codePointAt(reader.cursor) === REVERSE_SOLIDUS &&
        // Otherwise, if the second code point is a newline, return false.
        !isNewLine(reader.source.codePointAt(reader.cursor + 1)));
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#would-start-an-identifier
function checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader) {
    // // U+002D HYPHEN-MINUS
    if (reader.source.codePointAt(reader.cursor) === HYPHEN_MINUS) {
        // If the second code point is a U+002D HYPHEN-MINUS return true
        if (reader.source.codePointAt(reader.cursor + 1) === HYPHEN_MINUS) {
            return true;
        }
        // If the second code point is an ident-start code point return true
        if (isIdentStartCodePoint(reader.source.codePointAt(reader.cursor + 1))) {
            return true;
        }
        // If the second and third code points are a valid escape return true
        if (reader.source.codePointAt(reader.cursor + 1) === REVERSE_SOLIDUS && !isNewLine(reader.source.codePointAt(reader.cursor + 2))) {
            return true;
        }
        return false;
    }
    // ident-start code point
    // Return true.
    if (isIdentStartCodePoint(reader.source.codePointAt(reader.cursor))) {
        return true;
    }
    // U+005C REVERSE SOLIDUS (\)
    return checkIfTwoCodePointsAreAValidEscape(reader);
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#starts-with-a-number
function checkIfThreeCodePointsWouldStartANumber(reader) {
    if (reader.source.codePointAt(reader.cursor) === PLUS_SIGN || reader.source.codePointAt(reader.cursor) === HYPHEN_MINUS) { // U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS (-)
        // If the second code point is a digit, return true.
        if (isDigitCodePoint(reader.source.codePointAt(reader.cursor + 1))) {
            return true;
        }
        // Otherwise, if the second code point is a U+002E FULL STOP (.)
        if (reader.source.codePointAt(reader.cursor + 1) === FULL_STOP) {
            // and the third code point is a digit, return true.
            return isDigitCodePoint(reader.source.codePointAt(reader.cursor + 2));
        }
        // Otherwise, return false.
        return false;
    }
    else if (reader.source.codePointAt(reader.cursor) === FULL_STOP) { // U+002E FULL STOP (.)
        // If the second code point is a digit, return true.
        // Otherwise, return false.
        return isDigitCodePoint(reader.source.codePointAt(reader.cursor + 1));
    }
    return isDigitCodePoint(reader.source.codePointAt(reader.cursor)); // digit
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-comments
function checkIfTwoCodePointsStartAComment(reader) {
    return (reader.source.codePointAt(reader.cursor) === SOLIDUS &&
        reader.source.codePointAt(reader.cursor + 1) === ASTERISK);
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-token
function checkIfThreeCodePointsWouldStartCDC(reader) {
    return reader.source.codePointAt(reader.cursor) === HYPHEN_MINUS && reader.source.codePointAt(reader.cursor + 1) === HYPHEN_MINUS && reader.source.codePointAt(reader.cursor + 2) === GREATER_THAN_SIGN;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
/**
 * All possible CSS token types
 */
var TokenType;
(function (TokenType) {
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#comment-diagram}
     */
    TokenType["Comment"] = "comment";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-at-keyword-token}
     */
    TokenType["AtKeyword"] = "at-keyword-token";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-bad-string-token}
     */
    TokenType["BadString"] = "bad-string-token";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-bad-url-token}
     */
    TokenType["BadURL"] = "bad-url-token";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-cdc-token}
     */
    TokenType["CDC"] = "CDC-token";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-cdo-token}
     */
    TokenType["CDO"] = "CDO-token";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-colon-token}
     */
    TokenType["Colon"] = "colon-token";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-comma-token}
     */
    TokenType["Comma"] = "comma-token";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-delim-token}
     */
    TokenType["Delim"] = "delim-token";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-dimension-token}
     */
    TokenType["Dimension"] = "dimension-token";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-eof-token}
     */
    TokenType["EOF"] = "EOF-token";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-function-token}
     */
    TokenType["Function"] = "function-token";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-hash-token}
     */
    TokenType["Hash"] = "hash-token";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-ident-token}
     */
    TokenType["Ident"] = "ident-token";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-percentage-token}
     */
    TokenType["Number"] = "number-token";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-percentage-token}
     */
    TokenType["Percentage"] = "percentage-token";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-semicolon-token}
     */
    TokenType["Semicolon"] = "semicolon-token";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-string-token}
     */
    TokenType["String"] = "string-token";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-url-token}
     */
    TokenType["URL"] = "url-token";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-whitespace-token}
     */
    TokenType["Whitespace"] = "whitespace-token";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-open-paren}
     */
    TokenType["OpenParen"] = "(-token";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-close-paren}
     */
    TokenType["CloseParen"] = ")-token";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-open-square}
     */
    TokenType["OpenSquare"] = "[-token";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-close-square}
     */
    TokenType["CloseSquare"] = "]-token";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-open-curly}
     */
    TokenType["OpenCurly"] = "{-token";
    /**
     * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-close-curly}
     */
    TokenType["CloseCurly"] = "}-token";
    /**
     * Only appears in the token stream when the `unicodeRangesAllowed` option is set to true.
     *
     * @example
     * ```js
     * import { tokenize } from '@csstools/css-tokenizer';
     *
     * const tokens = tokenize({
     * 	css: `U+0025-00FF, U+4??`,
     * 	unicodeRangesAllowed: true,
     * });
     *
     * console.log(tokens);
     * ```
     *
     * @see {@link https://drafts.csswg.org/css-syntax/#typedef-unicode-range-token}
     */
    TokenType["UnicodeRange"] = "unicode-range-token";
})(TokenType || (TokenType = {}));
/**
 * The type of number token
 * Either `integer` or `number`
 */
var NumberType;
(function (NumberType) {
    NumberType["Integer"] = "integer";
    NumberType["Number"] = "number";
})(NumberType || (NumberType = {}));
/**
 * The type of hash token
 */
var HashType;
(function (HashType) {
    /**
     * The hash token did not start with an ident sequence (e.g. `#-2`)
     */
    HashType["Unrestricted"] = "unrestricted";
    /**
     * The hash token started with an ident sequence (e.g. `#foo`)
     * Only hash tokens with the "id" type are valid ID selectors.
     */
    HashType["ID"] = "id";
})(HashType || (HashType = {}));
/**
 * Get the mirror variant type of a given token type
 *
 * @example
 *
 * ```js
 * const input = TokenType.OpenParen;
 * const output = mirrorVariantType(input);
 *
 * console.log(output); // TokenType.CloseParen
 * ```
 */
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
/**
 * Get the mirror variant of a given token
 *
 * @example
 *
 * ```js
 * const input = [TokenType.OpenParen, '(', 0, 1, undefined];
 * const output = mirrorVariant(input);
 *
 * console.log(output); // [TokenType.CloseParen, ')', -1, -1, undefined]
 * ```
 */
function mirrorVariant(token) {
    switch (token[0]) {
        case TokenType.OpenParen:
            return [TokenType.CloseParen, ')', -1, -1, undefined];
        case TokenType.CloseParen:
            return [TokenType.OpenParen, '(', -1, -1, undefined];
        case TokenType.OpenCurly:
            return [TokenType.CloseCurly, '}', -1, -1, undefined];
        case TokenType.CloseCurly:
            return [TokenType.OpenCurly, '{', -1, -1, undefined];
        case TokenType.OpenSquare:
            return [TokenType.CloseSquare, ']', -1, -1, undefined];
        case TokenType.CloseSquare:
            return [TokenType.OpenSquare, '[', -1, -1, undefined];
        default:
            return null;
    }
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-comment
function consumeComment(ctx, reader) {
    reader.advanceCodePoint(2);
    while (true) {
        const codePoint = reader.readCodePoint();
        if (typeof codePoint === "undefined") {
            const token = [
                TokenType.Comment,
                reader.source.slice(reader.representationStart, reader.representationEnd + 1),
                reader.representationStart,
                reader.representationEnd,
                undefined,
            ];
            ctx.onParseError(new ParseErrorWithToken(ParseErrorMessage.UnexpectedEOFInComment, reader.representationStart, reader.representationEnd, [
                '4.3.2. Consume comments',
                'Unexpected EOF',
            ], token));
            return token;
        }
        if (codePoint !== ASTERISK) {
            continue;
        }
        if (typeof reader.source.codePointAt(reader.cursor) === "undefined") {
            continue;
        }
        if (reader.source.codePointAt(reader.cursor) === SOLIDUS) {
            reader.advanceCodePoint();
            break;
        }
    }
    return [
        TokenType.Comment,
        reader.source.slice(reader.representationStart, reader.representationEnd + 1),
        reader.representationStart,
        reader.representationEnd,
        undefined,
    ];
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-escaped-code-point
function consumeEscapedCodePoint(ctx, reader) {
    const codePoint = reader.readCodePoint();
    if (typeof codePoint === "undefined") {
        ctx.onParseError(new ParseError(ParseErrorMessage.UnexpectedEOFInEscapedCodePoint, reader.representationStart, reader.representationEnd, [
            '4.3.7. Consume an escaped code point',
            'Unexpected EOF',
        ]));
        return REPLACEMENT_CHARACTER;
    }
    if (isHexDigitCodePoint(codePoint)) {
        const hexSequence = [codePoint];
        let nextCodePoint;
        while ((typeof (nextCodePoint = reader.source.codePointAt(reader.cursor)) !== "undefined") && isHexDigitCodePoint(nextCodePoint) && hexSequence.length < 6) {
            hexSequence.push(nextCodePoint);
            reader.advanceCodePoint();
        }
        if (isWhitespace(reader.source.codePointAt(reader.cursor))) {
            reader.advanceCodePoint();
        }
        const codePointLiteral = parseInt(String.fromCodePoint(...hexSequence), 16);
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
    while (true) {
        const codePoint = reader.source.codePointAt(reader.cursor);
        if (isIdentCodePoint(codePoint)) {
            result.push(codePoint);
            reader.advanceCodePoint(1 + +(codePoint > 0xffff));
            continue;
        }
        if (checkIfTwoCodePointsAreAValidEscape(reader)) {
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
    const codePoint = reader.source.codePointAt(reader.cursor);
    if ((typeof codePoint !== "undefined") && (isIdentCodePoint(codePoint) ||
        checkIfTwoCodePointsAreAValidEscape(reader))) {
        let hashType = HashType.Unrestricted;
        if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
            hashType = HashType.ID;
        }
        const identSequence = consumeIdentSequence(ctx, reader);
        return [
            TokenType.Hash,
            reader.source.slice(reader.representationStart, reader.representationEnd + 1),
            reader.representationStart,
            reader.representationEnd,
            {
                value: String.fromCodePoint(...identSequence),
                type: hashType,
            },
        ];
    }
    return [
        TokenType.Delim,
        '#',
        reader.representationStart,
        reader.representationEnd,
        {
            value: '#',
        },
    ];
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-number
function consumeNumber(ctx, reader) {
    // 1. Initially set type to "integer".
    let type = NumberType.Integer;
    // 2. If the next input code point is U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS (-), consume it and append it to repr.
    if (reader.source.codePointAt(reader.cursor) === PLUS_SIGN || reader.source.codePointAt(reader.cursor) === HYPHEN_MINUS) {
        reader.advanceCodePoint();
    }
    // 3. While the next input code point is a digit, consume it and append it to repr.
    while (isDigitCodePoint(reader.source.codePointAt(reader.cursor))) {
        reader.advanceCodePoint();
    }
    // 4. If the next 2 input code points are U+002E FULL STOP (.) followed by a digit, then:
    if (reader.source.codePointAt(reader.cursor) === FULL_STOP && isDigitCodePoint(reader.source.codePointAt(reader.cursor + 1))) {
        // 4.1. Consume them.
        reader.advanceCodePoint(2);
        // 4.3. Set type to "number".
        type = NumberType.Number;
        // 4.4. While the next input code point is a digit, consume it and append it to repr.
        while (isDigitCodePoint(reader.source.codePointAt(reader.cursor))) {
            reader.advanceCodePoint();
        }
    }
    // 5. If the next 2 or 3 input code points are U+0045 LATIN CAPITAL LETTER E (E) or U+0065 LATIN SMALL LETTER E (e),
    // optionally followed by U+002D HYPHEN-MINUS (-) or U+002B PLUS SIGN (+),
    // followed by a digit, then:
    if (reader.source.codePointAt(reader.cursor) === LATIN_SMALL_LETTER_E || reader.source.codePointAt(reader.cursor) === LATIN_CAPITAL_LETTER_E) {
        if (isDigitCodePoint(reader.source.codePointAt(reader.cursor + 1))) {
            // 5.1. Consume them.
            reader.advanceCodePoint(2);
        }
        else if ((reader.source.codePointAt(reader.cursor + 1) === HYPHEN_MINUS || reader.source.codePointAt(reader.cursor + 1) === PLUS_SIGN) &&
            isDigitCodePoint(reader.source.codePointAt(reader.cursor + 2))) {
            // 5.1. Consume them.
            reader.advanceCodePoint(3);
        }
        else {
            return type;
        }
        // 5.3. Set type to "number".
        type = NumberType.Number;
        // 5.4. While the next input code point is a digit, consume it and append it to repr.
        while (isDigitCodePoint(reader.source.codePointAt(reader.cursor))) {
            reader.advanceCodePoint();
        }
    }
    return type;
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-numeric-token
function consumeNumericToken(ctx, reader) {
    let signCharacter = undefined;
    {
        const peeked = reader.source.codePointAt(reader.cursor);
        if (peeked === HYPHEN_MINUS) {
            signCharacter = '-';
        }
        else if (peeked === PLUS_SIGN) {
            signCharacter = '+';
        }
    }
    const numberType = consumeNumber(ctx, reader);
    const numberValue = parseFloat(reader.source.slice(reader.representationStart, reader.representationEnd + 1));
    if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
        const unit = consumeIdentSequence(ctx, reader);
        return [
            TokenType.Dimension,
            reader.source.slice(reader.representationStart, reader.representationEnd + 1),
            reader.representationStart,
            reader.representationEnd,
            {
                value: numberValue,
                signCharacter: signCharacter,
                type: numberType,
                unit: String.fromCodePoint(...unit),
            },
        ];
    }
    if (reader.source.codePointAt(reader.cursor) === PERCENTAGE_SIGN) {
        reader.advanceCodePoint();
        return [
            TokenType.Percentage,
            reader.source.slice(reader.representationStart, reader.representationEnd + 1),
            reader.representationStart,
            reader.representationEnd,
            {
                value: numberValue,
                signCharacter: signCharacter,
            },
        ];
    }
    return [
        TokenType.Number,
        reader.source.slice(reader.representationStart, reader.representationEnd + 1),
        reader.representationStart,
        reader.representationEnd,
        {
            value: numberValue,
            signCharacter: signCharacter,
            type: numberType,
        },
    ];
}

function consumeWhiteSpace(reader) {
    while (isWhitespace(reader.source.codePointAt(reader.cursor))) {
        reader.advanceCodePoint();
    }
    return [
        TokenType.Whitespace,
        reader.source.slice(reader.representationStart, reader.representationEnd + 1),
        reader.representationStart,
        reader.representationEnd,
        undefined,
    ];
}

/**
 * @internal
 */
class Reader {
    cursor = 0;
    source = '';
    representationStart = 0;
    representationEnd = -1;
    constructor(source) {
        this.source = source;
    }
    advanceCodePoint(n = 1) {
        this.cursor = this.cursor + n;
        this.representationEnd = this.cursor - 1;
    }
    readCodePoint() {
        const codePoint = this.source.codePointAt(this.cursor);
        if (typeof codePoint === "undefined") {
            return undefined;
        }
        this.cursor = this.cursor + 1;
        this.representationEnd = this.cursor - 1;
        return codePoint;
    }
    unreadCodePoint(n = 1) {
        this.cursor = this.cursor - n;
        this.representationEnd = this.cursor - 1;
        return;
    }
    resetRepresentation() {
        this.representationStart = this.cursor;
        this.representationEnd = -1;
    }
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-string-token
function consumeStringToken(ctx, reader) {
    let result = '';
    const first = reader.readCodePoint();
    while (true) {
        const next = reader.readCodePoint();
        if (typeof next === "undefined") {
            const token = [TokenType.String, reader.source.slice(reader.representationStart, reader.representationEnd + 1), reader.representationStart, reader.representationEnd, { value: result }];
            ctx.onParseError(new ParseErrorWithToken(ParseErrorMessage.UnexpectedEOFInString, reader.representationStart, reader.representationEnd, [
                '4.3.5. Consume a string token',
                'Unexpected EOF',
            ], token));
            return token;
        }
        if (isNewLine(next)) {
            reader.unreadCodePoint();
            const token = [TokenType.BadString, reader.source.slice(reader.representationStart, reader.representationEnd + 1), reader.representationStart, reader.representationEnd, undefined];
            ctx.onParseError(new ParseErrorWithToken(ParseErrorMessage.UnexpectedNewLineInString, reader.representationStart, ((reader.source.codePointAt(reader.cursor) === CARRIAGE_RETURN &&
                reader.source.codePointAt(reader.cursor + 1) === LINE_FEED) ?
                // CR LF
                reader.representationEnd + 2 :
                // LF
                reader.representationEnd + 1), [
                '4.3.5. Consume a string token',
                'Unexpected newline',
            ], token));
            return token;
        }
        if (next === first) {
            return [TokenType.String, reader.source.slice(reader.representationStart, reader.representationEnd + 1), reader.representationStart, reader.representationEnd, { value: result }];
        }
        if (next === REVERSE_SOLIDUS) {
            if (typeof reader.source.codePointAt(reader.cursor) === "undefined") {
                continue;
            }
            if (isNewLine(reader.source.codePointAt(reader.cursor))) {
                if (reader.source.codePointAt(reader.cursor) === CARRIAGE_RETURN &&
                    reader.source.codePointAt(reader.cursor + 1) === LINE_FEED) {
                    reader.advanceCodePoint();
                }
                reader.advanceCodePoint();
                continue;
            }
            result = result + String.fromCodePoint(consumeEscapedCodePoint(ctx, reader));
            continue;
        }
        result = result + String.fromCodePoint(next);
    }
}

function checkIfCodePointsMatchURLIdent(codePoints) {
    return (codePoints.length === 3 &&
        (codePoints[0] === LATIN_SMALL_LETTER_U ||
            codePoints[0] === LATIN_CAPITAL_LETTER_U) &&
        (codePoints[1] === LATIN_SMALL_LETTER_R ||
            codePoints[1] === LATIN_CAPITAL_LETTER_R) &&
        (codePoints[2] === LATIN_SMALL_LETTER_L ||
            codePoints[2] === LATIN_CAPITAL_LETTER_L));
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-remnants-of-bad-url
function consumeBadURL(ctx, reader) {
    while (true) {
        const codePoint = reader.source.codePointAt(reader.cursor);
        if (typeof codePoint === "undefined") {
            return;
        }
        if (codePoint === RIGHT_PARENTHESIS) {
            reader.advanceCodePoint();
            return;
        }
        if (checkIfTwoCodePointsAreAValidEscape(reader)) {
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
    while (isWhitespace(reader.source.codePointAt(reader.cursor))) {
        reader.advanceCodePoint();
    }
    let string = '';
    while (true) {
        if (typeof reader.source.codePointAt(reader.cursor) === "undefined") {
            const token = [
                TokenType.URL,
                reader.source.slice(reader.representationStart, reader.representationEnd + 1),
                reader.representationStart,
                reader.representationEnd,
                {
                    value: string,
                },
            ];
            ctx.onParseError(new ParseErrorWithToken(ParseErrorMessage.UnexpectedEOFInURL, reader.representationStart, reader.representationEnd, [
                '4.3.6. Consume a url token',
                'Unexpected EOF',
            ], token));
            return token;
        }
        if (reader.source.codePointAt(reader.cursor) === RIGHT_PARENTHESIS) {
            reader.advanceCodePoint();
            return [
                TokenType.URL,
                reader.source.slice(reader.representationStart, reader.representationEnd + 1),
                reader.representationStart,
                reader.representationEnd,
                {
                    value: string,
                },
            ];
        }
        if (isWhitespace(reader.source.codePointAt(reader.cursor))) {
            reader.advanceCodePoint();
            while (isWhitespace(reader.source.codePointAt(reader.cursor))) {
                reader.advanceCodePoint();
            }
            if (typeof reader.source.codePointAt(reader.cursor) === "undefined") {
                const token = [
                    TokenType.URL,
                    reader.source.slice(reader.representationStart, reader.representationEnd + 1),
                    reader.representationStart,
                    reader.representationEnd,
                    {
                        value: string,
                    },
                ];
                ctx.onParseError(new ParseErrorWithToken(ParseErrorMessage.UnexpectedEOFInURL, reader.representationStart, reader.representationEnd, [
                    '4.3.6. Consume a url token',
                    'Consume as much whitespace as possible',
                    'Unexpected EOF',
                ], token));
                return token;
            }
            if (reader.source.codePointAt(reader.cursor) === RIGHT_PARENTHESIS) {
                reader.advanceCodePoint();
                return [
                    TokenType.URL,
                    reader.source.slice(reader.representationStart, reader.representationEnd + 1),
                    reader.representationStart,
                    reader.representationEnd,
                    {
                        value: string,
                    },
                ];
            }
            consumeBadURL(ctx, reader);
            return [
                TokenType.BadURL,
                reader.source.slice(reader.representationStart, reader.representationEnd + 1),
                reader.representationStart,
                reader.representationEnd,
                undefined,
            ];
        }
        const codePoint = reader.source.codePointAt(reader.cursor);
        if (codePoint === QUOTATION_MARK || codePoint === APOSTROPHE || codePoint === LEFT_PARENTHESIS || isNonPrintableCodePoint(codePoint)) {
            consumeBadURL(ctx, reader);
            const token = [
                TokenType.BadURL,
                reader.source.slice(reader.representationStart, reader.representationEnd + 1),
                reader.representationStart,
                reader.representationEnd,
                undefined,
            ];
            ctx.onParseError(new ParseErrorWithToken(ParseErrorMessage.UnexpectedCharacterInURL, reader.representationStart, reader.representationEnd, [
                '4.3.6. Consume a url token',
                'Unexpected U+0022 QUOTATION MARK ("), U+0027 APOSTROPHE (\'), U+0028 LEFT PARENTHESIS (() or non-printable code point',
            ], token));
            return token;
        }
        if (codePoint === REVERSE_SOLIDUS) {
            if (checkIfTwoCodePointsAreAValidEscape(reader)) {
                reader.advanceCodePoint();
                string = string + String.fromCodePoint(consumeEscapedCodePoint(ctx, reader));
                continue;
            }
            consumeBadURL(ctx, reader);
            const token = [
                TokenType.BadURL,
                reader.source.slice(reader.representationStart, reader.representationEnd + 1),
                reader.representationStart,
                reader.representationEnd,
                undefined,
            ];
            ctx.onParseError(new ParseErrorWithToken(ParseErrorMessage.InvalidEscapeSequenceInURL, reader.representationStart, reader.representationEnd, [
                '4.3.6. Consume a url token',
                'U+005C REVERSE SOLIDUS (\\)',
                'The input stream does not start with a valid escape sequence',
            ], token));
            return token;
        }
        string = string + reader.source[reader.cursor];
        reader.advanceCodePoint();
    }
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-ident-like-token
function consumeIdentLikeToken(ctx, reader) {
    const codePoints = consumeIdentSequence(ctx, reader);
    if (reader.source.codePointAt(reader.cursor) !== LEFT_PARENTHESIS) {
        return [
            TokenType.Ident,
            reader.source.slice(reader.representationStart, reader.representationEnd + 1),
            reader.representationStart,
            reader.representationEnd,
            {
                value: String.fromCodePoint(...codePoints),
            },
        ];
    }
    if (checkIfCodePointsMatchURLIdent(codePoints)) {
        reader.advanceCodePoint();
        let read = 0;
        while (true) {
            const firstIsWhitespace = isWhitespace(reader.source.codePointAt(reader.cursor));
            const secondIsWhitespace = isWhitespace(reader.source.codePointAt(reader.cursor + 1));
            if (firstIsWhitespace && secondIsWhitespace) {
                read = read + 1;
                reader.advanceCodePoint(1);
                continue;
            }
            const firstNonWhitespace = firstIsWhitespace ? reader.source.codePointAt(reader.cursor + 1) : reader.source.codePointAt(reader.cursor);
            if (firstNonWhitespace === QUOTATION_MARK || firstNonWhitespace === APOSTROPHE) {
                if (read > 0) {
                    // https://github.com/w3c/csswg-drafts/issues/8280#issuecomment-1370566921
                    reader.unreadCodePoint(read);
                }
                return [
                    TokenType.Function,
                    reader.source.slice(reader.representationStart, reader.representationEnd + 1),
                    reader.representationStart,
                    reader.representationEnd,
                    {
                        value: String.fromCodePoint(...codePoints),
                    },
                ];
            }
            break;
        }
        return consumeUrlToken(ctx, reader);
    }
    reader.advanceCodePoint();
    return [
        TokenType.Function,
        reader.source.slice(reader.representationStart, reader.representationEnd + 1),
        reader.representationStart,
        reader.representationEnd,
        {
            value: String.fromCodePoint(...codePoints),
        },
    ];
}

// https://drafts.csswg.org/css-syntax/#starts-a-unicode-range
function checkIfThreeCodePointsWouldStartAUnicodeRange(reader) {
    if (
    // The first code point is either U+0055 LATIN CAPITAL LETTER U (U) or U+0075 LATIN SMALL LETTER U (u)
    (reader.source.codePointAt(reader.cursor) === LATIN_SMALL_LETTER_U ||
        reader.source.codePointAt(reader.cursor) === LATIN_CAPITAL_LETTER_U) &&
        // The second code point is U+002B PLUS SIGN (+).
        reader.source.codePointAt(reader.cursor + 1) === PLUS_SIGN &&
        // The third code point is either U+003F QUESTION MARK (?) or a hex digit
        (reader.source.codePointAt(reader.cursor + 2) === QUESTION_MARK ||
            isHexDigitCodePoint(reader.source.codePointAt(reader.cursor + 2)))) {
        // then return true.
        return true;
    }
    // Otherwise return false.
    return false;
}

// https://drafts.csswg.org/css-syntax/#starts-a-unicode-range
function consumeUnicodeRangeToken(ctx, reader) {
    // 1. Consume the next two input code points and discard them.
    reader.advanceCodePoint(2);
    const firstSegment = [];
    const secondSegment = [];
    // 2. Consume as many hex digits as possible,
    // but no more than 6.
    let codePoint;
    while ((typeof (codePoint = reader.source.codePointAt(reader.cursor)) !== "undefined") &&
        firstSegment.length < 6 &&
        isHexDigitCodePoint(codePoint)) {
        firstSegment.push(codePoint);
        reader.advanceCodePoint();
    }
    // 2. If less than 6 hex digits were consumed,
    // consume as many U+003F QUESTION MARK (?) code points as possible,
    // but no more than enough to make the total of hex digits and U+003F QUESTION MARK (?) code points equal to 6.
    while ((typeof (codePoint = reader.source.codePointAt(reader.cursor)) !== "undefined") &&
        firstSegment.length < 6 &&
        codePoint === QUESTION_MARK) {
        if (secondSegment.length === 0) {
            secondSegment.push(...firstSegment);
        }
        // 3. If first segment contains any question mark code points, then:
        // 3.1 Replace the question marks in first segment with U+0030 DIGIT ZERO (0) code points.
        firstSegment.push(DIGIT_ZERO);
        // 3.2.Replace the question marks in first segment with U+0046 LATIN CAPITAL LETTER F (F) code points.
        secondSegment.push(LATIN_CAPITAL_LETTER_F);
        reader.advanceCodePoint();
    }
    if (!secondSegment.length) {
        // 5. If the next 2 input code points are U+002D HYPHEN-MINUS (-) followed by a hex digit
        if (reader.source.codePointAt(reader.cursor) === HYPHEN_MINUS &&
            isHexDigitCodePoint(reader.source.codePointAt(reader.cursor + 1))) {
            // 5.1. Consume the next input code point.
            reader.advanceCodePoint();
            // 5.2 Consume as many hex digits as possible,
            // but no more than 6.
            while ((typeof (codePoint = reader.source.codePointAt(reader.cursor)) !== "undefined") &&
                secondSegment.length < 6 &&
                isHexDigitCodePoint(codePoint)) {
                secondSegment.push(codePoint);
                reader.advanceCodePoint();
            }
        }
    }
    if (!secondSegment.length) {
        // Interpret the consumed code points as a hexadecimal number.
        const startOfRange = parseInt(String.fromCodePoint(...firstSegment), 16);
        // Return a new <unicode-range-token> both starting and ending at start of range.
        return [
            TokenType.UnicodeRange,
            reader.source.slice(reader.representationStart, reader.representationEnd + 1),
            reader.representationStart,
            reader.representationEnd,
            {
                startOfRange: startOfRange,
                endOfRange: startOfRange,
            },
        ];
    }
    // Interpret the consumed code points as a hexadecimal number.
    const startOfRange = parseInt(String.fromCodePoint(...firstSegment), 16);
    const endOfRange = parseInt(String.fromCodePoint(...secondSegment), 16);
    // Return a new <unicode-range-token> starting at start of range and ending at end of range.
    return [
        TokenType.UnicodeRange,
        reader.source.slice(reader.representationStart, reader.representationEnd + 1),
        reader.representationStart,
        reader.representationEnd,
        {
            startOfRange: startOfRange,
            endOfRange: endOfRange,
        },
    ];
}

/**
 * Tokenize a CSS string into a list of tokens.
 */
function tokenize(input, options) {
    const t = tokenizer(input, options);
    const tokens = [];
    {
        while (!t.endOfFile()) {
            const token = t.nextToken();
            if (token) {
                tokens.push(token);
            }
        }
        const token = t.nextToken(); // EOF-token
        if (token) {
            tokens.push(token);
        }
    }
    return tokens;
}
/**
 * Create a tokenizer for a CSS string.
 */
function tokenizer(input, options) {
    const css = input.css.valueOf();
    console.log(css.codePointAt(0));
    const unicodeRangesAllowed = input.unicodeRangesAllowed ?? false;
    const reader = new Reader(css);
    console.log(reader.source.codePointAt(0));
    const ctx = {
        onParseError: options?.onParseError ?? noop,
    };
    const endOfFile = () => {
        console.log('ok? eof');
        console.log(typeof reader);
        const y = reader.source.codePointAt(reader.cursor);
        console.log(y);
        const x = typeof y === "undefined";
        console.log('ok eof');
        return x;
    };
    const nextToken = () => {
        reader.resetRepresentation();
        console.log('ok?');
        const peeked = reader.source.codePointAt(reader.cursor);
        console.log('ok');
        if (typeof peeked === "undefined") {
            return [TokenType.EOF, '', -1, -1, undefined];
        }
        if (peeked === SOLIDUS && checkIfTwoCodePointsStartAComment(reader)) {
            return consumeComment(ctx, reader);
        }
        if (unicodeRangesAllowed && (peeked === LATIN_SMALL_LETTER_U ||
            peeked === LATIN_CAPITAL_LETTER_U) &&
            checkIfThreeCodePointsWouldStartAUnicodeRange(reader)) {
            return consumeUnicodeRangeToken(ctx, reader);
        }
        if (isIdentStartCodePoint(peeked)) {
            return consumeIdentLikeToken(ctx, reader);
        }
        if (isDigitCodePoint(peeked)) {
            return consumeNumericToken(ctx, reader);
        }
        // Simple, one character tokens:
        switch (peeked) {
            case COMMA:
                reader.advanceCodePoint();
                return [TokenType.Comma, ',', reader.representationStart, reader.representationEnd, undefined];
            case COLON:
                reader.advanceCodePoint();
                return [TokenType.Colon, ':', reader.representationStart, reader.representationEnd, undefined];
            case SEMICOLON:
                reader.advanceCodePoint();
                return [TokenType.Semicolon, ';', reader.representationStart, reader.representationEnd, undefined];
            case LEFT_PARENTHESIS:
                reader.advanceCodePoint();
                return [TokenType.OpenParen, '(', reader.representationStart, reader.representationEnd, undefined];
            case RIGHT_PARENTHESIS:
                reader.advanceCodePoint();
                return [TokenType.CloseParen, ')', reader.representationStart, reader.representationEnd, undefined];
            case LEFT_SQUARE_BRACKET:
                reader.advanceCodePoint();
                return [TokenType.OpenSquare, '[', reader.representationStart, reader.representationEnd, undefined];
            case RIGHT_SQUARE_BRACKET:
                reader.advanceCodePoint();
                return [TokenType.CloseSquare, ']', reader.representationStart, reader.representationEnd, undefined];
            case LEFT_CURLY_BRACKET:
                reader.advanceCodePoint();
                return [TokenType.OpenCurly, '{', reader.representationStart, reader.representationEnd, undefined];
            case RIGHT_CURLY_BRACKET:
                reader.advanceCodePoint();
                return [TokenType.CloseCurly, '}', reader.representationStart, reader.representationEnd, undefined];
            case APOSTROPHE:
            case QUOTATION_MARK:
                return consumeStringToken(ctx, reader);
            case NUMBER_SIGN:
                return consumeHashToken(ctx, reader);
            case PLUS_SIGN:
            case FULL_STOP:
                if (checkIfThreeCodePointsWouldStartANumber(reader)) {
                    return consumeNumericToken(ctx, reader);
                }
                reader.advanceCodePoint();
                return [TokenType.Delim, reader.source[reader.representationStart], reader.representationStart, reader.representationEnd, {
                        value: reader.source[reader.representationStart],
                    }];
            case LINE_FEED:
            case CARRIAGE_RETURN:
            case FORM_FEED:
            case CHARACTER_TABULATION:
            case SPACE:
                return consumeWhiteSpace(reader);
            case HYPHEN_MINUS:
                if (checkIfThreeCodePointsWouldStartANumber(reader)) {
                    return consumeNumericToken(ctx, reader);
                }
                if (checkIfThreeCodePointsWouldStartCDC(reader)) {
                    reader.advanceCodePoint(3);
                    return [TokenType.CDC, '-->', reader.representationStart, reader.representationEnd, undefined];
                }
                if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
                    return consumeIdentLikeToken(ctx, reader);
                }
                reader.advanceCodePoint();
                return [TokenType.Delim, '-', reader.representationStart, reader.representationEnd, {
                        value: '-',
                    }];
            case LESS_THAN_SIGN:
                if (checkIfFourCodePointsWouldStartCDO(reader)) {
                    reader.advanceCodePoint(4);
                    return [TokenType.CDO, '<!--', reader.representationStart, reader.representationEnd, undefined];
                }
                reader.advanceCodePoint();
                return [TokenType.Delim, '<', reader.representationStart, reader.representationEnd, {
                        value: '<',
                    }];
            case COMMERCIAL_AT:
                reader.advanceCodePoint();
                if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
                    const identSequence = consumeIdentSequence(ctx, reader);
                    return [TokenType.AtKeyword, reader.source.slice(reader.representationStart, reader.representationEnd + 1), reader.representationStart, reader.representationEnd, {
                            value: String.fromCodePoint(...identSequence),
                        }];
                }
                return [TokenType.Delim, '@', reader.representationStart, reader.representationEnd, {
                        value: '@',
                    }];
            case REVERSE_SOLIDUS: {
                if (checkIfTwoCodePointsAreAValidEscape(reader)) {
                    return consumeIdentLikeToken(ctx, reader);
                }
                reader.advanceCodePoint();
                const token = [TokenType.Delim, '\\', reader.representationStart, reader.representationEnd, {
                        value: '\\',
                    }];
                ctx.onParseError(new ParseErrorWithToken(ParseErrorMessage.InvalidEscapeSequenceAfterBackslash, reader.representationStart, reader.representationEnd, [
                    '4.3.1. Consume a token',
                    'U+005C REVERSE SOLIDUS (\\)',
                    'The input stream does not start with a valid escape sequence',
                ], token));
                return token;
            }
        }
        reader.advanceCodePoint();
        return [TokenType.Delim, reader.source[reader.representationStart], reader.representationStart, reader.representationEnd, {
                value: reader.source[reader.representationStart],
            }];
    };
    return {
        nextToken: nextToken,
        endOfFile: endOfFile,
    };
}
function noop() { }

/**
 * Set the ident value and update the string representation.
 * This handles escaping.
 */
function mutateIdent(ident, newValue) {
    const codePoints = [];
    for (const codePoint of newValue) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        codePoints.push(codePoint.codePointAt(0));
    }
    const result = String.fromCodePoint(...ensureThatValueRoundTripsAsIdent(codePoints));
    ident[1] = result;
    ident[4].value = newValue;
}
/**
 * Set the unit and update the string representation.
 * This handles escaping.
 */
function mutateUnit(ident, newUnit) {
    const codePoints = [];
    for (const codePoint of newUnit) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        codePoints.push(codePoint.codePointAt(0));
    }
    const escapedCodePoints = ensureThatValueRoundTripsAsIdent(codePoints);
    if (escapedCodePoints[0] === 101) { // `e`
        insertEscapedCodePoint(escapedCodePoints, 0, escapedCodePoints[0]);
    }
    const result = String.fromCodePoint(...escapedCodePoints);
    const signCharacter = ident[4].signCharacter === '+' ? ident[4].signCharacter : '';
    const numericValue = ident[4].value.toString();
    ident[1] = `${signCharacter}${numericValue}${result}`;
    ident[4].unit = newUnit;
}
function ensureThatValueRoundTripsAsIdent(codePoints) {
    let remainderStartIndex = 0;
    if (codePoints[0] === HYPHEN_MINUS && codePoints[1] === HYPHEN_MINUS) {
        remainderStartIndex = 2;
    }
    else if (codePoints[0] === HYPHEN_MINUS && codePoints[1]) {
        remainderStartIndex = 2;
        if (!isIdentStartCodePoint(codePoints[1])) {
            remainderStartIndex += insertEscapedCodePoint(codePoints, 1, codePoints[1]);
        }
    }
    else if (isIdentStartCodePoint(codePoints[0])) {
        remainderStartIndex = 1;
    }
    else {
        remainderStartIndex = 1;
        remainderStartIndex += insertEscapedCodePoint(codePoints, 0, codePoints[0]);
    }
    for (let i = remainderStartIndex; i < codePoints.length; i++) {
        if (isIdentCodePoint(codePoints[i])) {
            continue;
        }
        i += insertEscapedCodePoint(codePoints, i, codePoints[i]);
    }
    return codePoints;
}
function insertEscapedCodePoint(codePoints, index, codePoint) {
    const hexRepresentation = codePoint.toString(16);
    const codePointsForHexRepresentation = [];
    for (const x of hexRepresentation) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        codePointsForHexRepresentation.push(x.codePointAt(0));
    }
    const next = codePoints[index + 1];
    if ((index === codePoints.length - 1) ||
        (next && isHexDigitCodePoint(next))) {
        codePoints.splice(index, 1, 92, // `\` backslash
        ...codePointsForHexRepresentation, 32);
        return 1 + codePointsForHexRepresentation.length;
    }
    codePoints.splice(index, 1, 92, // `\` backslash
    ...codePointsForHexRepresentation);
    return codePointsForHexRepresentation.length;
}

const tokenTypes = Object.values(TokenType);
/**
 * Assert that a given value has the general structure of a CSS token:
 * 1. is an array.
 * 2. has at least four items.
 * 3. has a known token type.
 * 4. has a string representation.
 * 5. has a start position.
 * 6. has an end position.
 */
function isToken(x) {
    if (!Array.isArray(x)) {
        return false;
    }
    if (x.length < 4) {
        return false;
    }
    if (!tokenTypes.includes(x[0])) {
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
/**
 * Assert that a token is a numeric token
 */
function isTokenNumeric(x) {
    switch (x[0]) {
        case TokenType.Dimension:
        case TokenType.Number:
        case TokenType.Percentage:
            return true;
        default:
            return false;
    }
}
/**
 * Assert that a token is a whitespace or comment token
 */
function isTokenWhiteSpaceOrComment(x) {
    switch (x[0]) {
        case TokenType.Whitespace:
        case TokenType.Comment:
            return true;
        default:
            return false;
    }
}
function isTokenAtKeyword(x) {
    return !!x && x[0] === TokenType.AtKeyword;
}
function isTokenBadString(x) {
    return !!x && x[0] === TokenType.BadString;
}
function isTokenBadURL(x) {
    return !!x && x[0] === TokenType.BadURL;
}
function isTokenCDC(x) {
    return !!x && x[0] === TokenType.CDC;
}
function isTokenCDO(x) {
    return !!x && x[0] === TokenType.CDO;
}
function isTokenColon(x) {
    return !!x && x[0] === TokenType.Colon;
}
function isTokenComma(x) {
    return !!x && x[0] === TokenType.Comma;
}
function isTokenComment(x) {
    return !!x && x[0] === TokenType.Comment;
}
function isTokenDelim(x) {
    return !!x && x[0] === TokenType.Delim;
}
function isTokenDimension(x) {
    return !!x && x[0] === TokenType.Dimension;
}
function isTokenEOF(x) {
    return !!x && x[0] === TokenType.EOF;
}
function isTokenFunction(x) {
    return !!x && x[0] === TokenType.Function;
}
function isTokenHash(x) {
    return !!x && x[0] === TokenType.Hash;
}
function isTokenIdent(x) {
    return !!x && x[0] === TokenType.Ident;
}
function isTokenNumber(x) {
    return !!x && x[0] === TokenType.Number;
}
function isTokenPercentage(x) {
    return !!x && x[0] === TokenType.Percentage;
}
function isTokenSemicolon(x) {
    return !!x && x[0] === TokenType.Semicolon;
}
function isTokenString(x) {
    return !!x && x[0] === TokenType.String;
}
function isTokenURL(x) {
    return !!x && x[0] === TokenType.URL;
}
function isTokenWhitespace(x) {
    return !!x && x[0] === TokenType.Whitespace;
}
function isTokenOpenParen(x) {
    return !!x && x[0] === TokenType.OpenParen;
}
function isTokenCloseParen(x) {
    return !!x && x[0] === TokenType.CloseParen;
}
function isTokenOpenSquare(x) {
    return !!x && x[0] === TokenType.OpenSquare;
}
function isTokenCloseSquare(x) {
    return !!x && x[0] === TokenType.CloseSquare;
}
function isTokenOpenCurly(x) {
    return !!x && x[0] === TokenType.OpenCurly;
}
function isTokenCloseCurly(x) {
    return !!x && x[0] === TokenType.CloseCurly;
}
function isTokenUnicodeRange(x) {
    return !!x && x[0] === TokenType.UnicodeRange;
}


;const tokens = tokenize({
	css: '.foo { color: rgb(10, calc(20 * 0.129), 15); }',
});

console.log(tokens);

const foo = "bar";
console.log(foo);
console.log(foo.valueOf().codePointAt(0));
