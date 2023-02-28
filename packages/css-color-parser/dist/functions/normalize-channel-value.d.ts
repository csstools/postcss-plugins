import { CSSToken, TokenNumber } from '@csstools/css-tokenizer';
export type normalizeChannelValueFn = (token: CSSToken, index: number) => TokenNumber | -1;
export declare function normalize_sRGB_ChannelValue(token: CSSToken, index: number): TokenNumber | -1;
