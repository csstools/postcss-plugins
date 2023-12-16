/**
 * Tokenize CSS following the CSS Syntax Level 3 specification.
 *
 * @example
 * Tokenize a string of CSS into an array of tokens:
 * ```js
 * import { tokenize } from '@csstools/css-tokenizer';
 *
 * const myCSS =  `@media only screen and (min-width: 768rem) {
 * 	.foo {
 * 		content: 'Some content!' !important;
 * 	}
 * }
 * `;
 *
 * const tokens = tokenize({
 * 	css: myCSS,
 * });
 *
 * console.log(tokens);
 * ```
 *
 * @packageDocumentation
 */

export type { CSSToken } from './interfaces/token';
export type { CodePointReader } from './interfaces/code-point-reader';
export type { Token } from './interfaces/token';
export { ParseError } from './interfaces/error';
export { Reader } from './reader';
export { TokenType, NumberType, mirrorVariantType, mirrorVariant, isToken } from './interfaces/token';
export { cloneTokens } from './util/clone-tokens';
export { stringify } from './stringify';
export { tokenize, tokenizer } from './tokenizer';

export type {
	HashType,
	TokenAtKeyword,
	TokenBadString,
	TokenBadURL,
	TokenCDC,
	TokenCDO,
	TokenCloseCurly,
	TokenCloseParen,
	TokenCloseSquare,
	TokenColon,
	TokenComma,
	TokenComment,
	TokenDelim,
	TokenDimension,
	TokenEOF,
	TokenFunction,
	TokenHash,
	TokenIdent,
	TokenNumber,
	TokenOpenCurly,
	TokenOpenParen,
	TokenOpenSquare,
	TokenPercentage,
	TokenSemicolon,
	TokenString,
	TokenURL,
	TokenUnicodeRange,
	TokenWhitespace,
} from './interfaces/token';

export {
	mutateIdent,
} from './util/mutations';
