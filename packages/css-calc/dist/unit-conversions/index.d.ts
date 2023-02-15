import { CSSToken } from '@csstools/css-tokenizer';
export declare const conversions: Map<string, Map<string, (number: any) => number>>;
export declare function convertUnit<T extends CSSToken>(a: CSSToken, b: T): T;
export declare function toCanonicalUnit<T extends CSSToken>(a: T): T;
