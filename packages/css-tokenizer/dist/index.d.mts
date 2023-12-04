declare enum TokenType {
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
declare enum NumberType {
    Integer = "integer",
    Number = "number"
}
declare enum HashType {
    Unrestricted = "unrestricted",
    ID = "id"
}
type TokenAtKeyword = Token<TokenType.AtKeyword, {
    value: string;
}>;
type TokenBadString = Token<TokenType.BadString, undefined>;
type TokenBadURL = Token<TokenType.BadURL, undefined>;
type TokenCDC = Token<TokenType.CDC, undefined>;
type TokenCDO = Token<TokenType.CDO, undefined>;
type TokenColon = Token<TokenType.Colon, undefined>;
type TokenComma = Token<TokenType.Comma, undefined>;
type TokenComment = Token<TokenType.Comment, undefined>;
type TokenDelim = Token<TokenType.Delim, {
    value: string;
}>;
type TokenDimension = Token<TokenType.Dimension, {
    value: number;
    signCharacter?: "+" | "-";
    unit: string;
    type: NumberType;
}>;
type TokenEOF = Token<TokenType.EOF, undefined>;
type TokenFunction = Token<TokenType.Function, {
    value: string;
}>;
type TokenHash = Token<TokenType.Hash, {
    value: string;
    type: HashType;
}>;
type TokenIdent = Token<TokenType.Ident, {
    value: string;
}>;
type TokenNumber = Token<TokenType.Number, {
    value: number;
    signCharacter?: "+" | "-";
    type: NumberType;
}>;
type TokenPercentage = Token<TokenType.Percentage, {
    value: number;
    signCharacter?: "+" | "-";
}>;
type TokenSemicolon = Token<TokenType.Semicolon, undefined>;
type TokenString = Token<TokenType.String, {
    value: string;
}>;
type TokenURL = Token<TokenType.URL, {
    value: string;
}>;
type TokenWhitespace = Token<TokenType.Whitespace, undefined>;
type TokenOpenParen = Token<TokenType.OpenParen, undefined>;
type TokenCloseParen = Token<TokenType.CloseParen, undefined>;
type TokenOpenSquare = Token<TokenType.OpenSquare, undefined>;
type TokenCloseSquare = Token<TokenType.CloseSquare, undefined>;
type TokenOpenCurly = Token<TokenType.OpenCurly, undefined>;
type TokenCloseCurly = Token<TokenType.CloseCurly, undefined>;
type TokenUnicodeRange = Token<TokenType.UnicodeRange, {
    startOfRange: number;
    endOfRange: number;
}>;
type CSSToken = TokenAtKeyword | TokenBadString | TokenBadURL | TokenCDC | TokenCDO | TokenColon | TokenComma | TokenComment | TokenDelim | TokenDimension | TokenEOF | TokenFunction | TokenHash | TokenIdent | TokenNumber | TokenPercentage | TokenSemicolon | TokenString | TokenURL | TokenWhitespace | TokenOpenParen | TokenCloseParen | TokenOpenSquare | TokenCloseSquare | TokenOpenCurly | TokenCloseCurly | TokenUnicodeRange;
type Token<T extends TokenType, U> = [
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
declare function mirrorVariantType(type: TokenType): TokenType | null;
declare function mirrorVariant(token: CSSToken): CSSToken | null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function isToken(x: any): x is CSSToken;
declare class ParseError extends Error {
    /** The index of the start character of the current token. */
    sourceStart: number;
    /** The index of the end character of the current token. */
    sourceEnd: number;
    /** The parser steps that preceded the error. */
    parserState: Array<string>;
    constructor(message: string, sourceStart: number, sourceEnd: number, parserState: Array<string>);
}
type CodePointReader = {
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
declare class Reader implements CodePointReader {
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
declare function cloneTokens(tokens: Array<CSSToken>): Array<CSSToken>;
declare function stringify(...tokens: Array<CSSToken>): string;
interface Stringer {
    valueOf(): string;
}
declare function tokenize(input: {
    css: Stringer;
    unicodeRangesAllowed?: boolean;
}, options?: {
    onParseError?: (error: ParseError) => void;
}): Array<CSSToken>;
declare function tokenizer(input: {
    css: Stringer;
    unicodeRangesAllowed?: boolean;
}, options?: {
    onParseError?: (error: ParseError) => void;
}): {
    nextToken: () => CSSToken | undefined;
    endOfFile: () => boolean;
};
declare function mutateIdent(ident: TokenIdent, newValue: string): void;
export type { CSSToken, Token, TokenAtKeyword, TokenBadString, TokenBadURL, TokenCDC, TokenCDO, TokenColon, TokenComma, TokenComment, TokenDelim, TokenDimension, TokenEOF, TokenFunction, TokenHash, TokenIdent, TokenNumber, TokenPercentage, TokenSemicolon, TokenString, TokenURL, TokenWhitespace, TokenOpenParen, TokenCloseParen, TokenOpenSquare, TokenCloseSquare, TokenOpenCurly, TokenCloseCurly };
export { ParseError, Reader, TokenType, NumberType, mirrorVariantType, mirrorVariant, isToken, cloneTokens, stringify, tokenize, tokenizer, mutateIdent };
