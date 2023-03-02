import { CSSToken, TokenNumber } from '@csstools/css-tokenizer';
import { ColorData } from '../color-data';
export declare function normalize_legacy_sRGB_ChannelValues(tokens: Array<CSSToken>, colorData: ColorData): Array<TokenNumber> | -1;
export declare function normalize_modern_sRGB_ChannelValues(tokens: Array<CSSToken>, colorData: ColorData): Array<TokenNumber> | -1;
