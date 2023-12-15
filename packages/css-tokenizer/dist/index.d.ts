export declare function cloneTokens(tokens: Array<CSSToken>): Array<CSSToken>;

export declare type CodePointReader = {
    representationStart: number;
    representationEnd: number;
    cursor: number;
    codePointSource: Array<number>;
    representationIndices: Array<number>;
    source: string;
    advanceCodePoint(n?: number): void;
    readCodePoint(n?: number): number | false;
    unreadCodePoint(n?: number): void;
    resetRepresentation(): void;
};

export declare type CSSToken = TokenAtKeyword | TokenBadString | TokenBadURL | TokenCDC | TokenCDO | TokenColon | TokenComma | TokenComment | TokenDelim | TokenDimension | TokenEOF | TokenFunction | TokenHash | TokenIdent | TokenNumber | TokenPercentage | TokenSemicolon | TokenString | TokenURL | TokenWhitespace | TokenOpenParen | TokenCloseParen | TokenOpenSquare | TokenCloseSquare | TokenOpenCurly | TokenCloseCurly | TokenUnicodeRange;

export declare enum HashType {
    Unrestricted = "unrestricted",
    ID = "id"
}

export declare function isToken(x: any): x is CSSToken;

export declare function mirrorVariant(token: CSSToken): CSSToken | null;

export declare function mirrorVariantType(type: TokenType): TokenType | null;

export declare function mutateIdent(ident: TokenIdent, newValue: string): void;

export declare enum NumberType {
    Integer = "integer",
    Number = "number"
}

export declare class ParseError extends Error {
    /** The index of the start character of the current token. */
    sourceStart: number;
    /** The index of the end character of the current token. */
    sourceEnd: number;
    /** The parser steps that preceded the error. */
    parserState: Array<string>;
    constructor(message: string, sourceStart: number, sourceEnd: number, parserState: Array<string>);
}

export declare class Reader implements CodePointReader {
    cursor: number;
    source: string;
    codePointSource: Array<number>;
    representationIndices: Array<number>;
    length: number;
    representationStart: number;
    representationEnd: number;
    constructor(source: string);
    advanceCodePoint(n?: number): void;
    readCodePoint(n?: number): number | false;
    unreadCodePoint(n?: number): void;
    resetRepresentation(): void;
}

export declare function stringify(...tokens: Array<CSSToken>): string;

export declare type Token<T extends TokenType, U> = [
/** The type of token */
T,
/** The token representation */
string,
/** Start position of representation */
number,
/** End position of representation */
number,
/** Extra data */
U
];

export declare type TokenAtKeyword = Token<TokenType.AtKeyword, {
    value: string;
}>;

export declare type TokenBadString = Token<TokenType.BadString, undefined>;

export declare type TokenBadURL = Token<TokenType.BadURL, undefined>;

export declare type TokenCDC = Token<TokenType.CDC, undefined>;

export declare type TokenCDO = Token<TokenType.CDO, undefined>;

export declare type TokenCloseCurly = Token<TokenType.CloseCurly, undefined>;

export declare type TokenCloseParen = Token<TokenType.CloseParen, undefined>;

export declare type TokenCloseSquare = Token<TokenType.CloseSquare, undefined>;

export declare type TokenColon = Token<TokenType.Colon, undefined>;

export declare type TokenComma = Token<TokenType.Comma, undefined>;

export declare type TokenComment = Token<TokenType.Comment, undefined>;

export declare type TokenDelim = Token<TokenType.Delim, {
    value: string;
}>;

export declare type TokenDimension = Token<TokenType.Dimension, {
    value: number;
    signCharacter?: '+' | '-';
    unit: string;
    type: NumberType;
}>;

export declare type TokenEOF = Token<TokenType.EOF, undefined>;

export declare type TokenFunction = Token<TokenType.Function, {
    value: string;
}>;

export declare type TokenHash = Token<TokenType.Hash, {
    value: string;
    type: HashType;
}>;

export declare type TokenIdent = Token<TokenType.Ident, {
    value: string;
}>;

export declare function tokenize(input: {
    css: {
        valueOf(): string;
    };
    unicodeRangesAllowed?: boolean;
}, options?: {
    onParseError?: (error: ParseError) => void;
}): Array<CSSToken>;

export declare function tokenizer(input: {
    css: {
        valueOf(): string;
    };
    unicodeRangesAllowed?: boolean;
}, options?: {
    onParseError?: (error: ParseError) => void;
}): {
    nextToken: () => CSSToken | undefined;
    endOfFile: () => boolean;
};

export declare type TokenNumber = Token<TokenType.Number, {
    value: number;
    signCharacter?: '+' | '-';
    type: NumberType;
}>;

export declare type TokenOpenCurly = Token<TokenType.OpenCurly, undefined>;

export declare type TokenOpenParen = Token<TokenType.OpenParen, undefined>;

export declare type TokenOpenSquare = Token<TokenType.OpenSquare, undefined>;

export declare type TokenPercentage = Token<TokenType.Percentage, {
    value: number;
    signCharacter?: '+' | '-';
}>;

export declare type TokenSemicolon = Token<TokenType.Semicolon, undefined>;

export declare type TokenString = Token<TokenType.String, {
    value: string;
}>;

export declare enum TokenType {
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#comment-diagram */
    Comment = "comment",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-at-keyword-token */
    AtKeyword = "at-keyword-token",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-bad-string-token */
    BadString = "bad-string-token",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-bad-url-token */
    BadURL = "bad-url-token",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-cdc-token */
    CDC = "CDC-token",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-cdo-token */
    CDO = "CDO-token",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-colon-token */
    Colon = "colon-token",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-comma-token */
    Comma = "comma-token",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-delim-token */
    Delim = "delim-token",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-dimension-token */
    Dimension = "dimension-token",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-eof-token */
    EOF = "EOF-token",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-function-token */
    Function = "function-token",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-hash-token */
    Hash = "hash-token",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-ident-token */
    Ident = "ident-token",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-percentage-token */
    Number = "number-token",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-percentage-token */
    Percentage = "percentage-token",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-semicolon-token */
    Semicolon = "semicolon-token",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-string-token */
    String = "string-token",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-url-token */
    URL = "url-token",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-whitespace-token */
    Whitespace = "whitespace-token",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-open-paren */
    OpenParen = "(-token",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-close-paren */
    CloseParen = ")-token",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-open-square */
    OpenSquare = "[-token",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-close-square */
    CloseSquare = "]-token",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-open-curly */
    OpenCurly = "{-token",
    /** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-close-curly */
    CloseCurly = "}-token",
    /** https://drafts.csswg.org/css-syntax/#typedef-unicode-range-token */
    UnicodeRange = "unicode-range-token"
}

export declare type TokenUnicodeRange = Token<TokenType.UnicodeRange, {
    startOfRange: number;
    endOfRange: number;
}>;

export declare type TokenURL = Token<TokenType.URL, {
    value: string;
}>;

export declare type TokenWhitespace = Token<TokenType.Whitespace, undefined>;

export { }
