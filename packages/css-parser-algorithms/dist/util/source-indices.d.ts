import { CSSToken } from '@csstools/css-tokenizer';
interface TokenConvertible {
    tokens(): Array<CSSToken>;
}
/**
 * Returns the start and end index of a node in the CSS source string.
 */
export declare function sourceIndices(x: TokenConvertible | Array<TokenConvertible>): [number, number];
export {};
