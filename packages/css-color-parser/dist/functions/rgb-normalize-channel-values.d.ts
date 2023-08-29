import type { ColorData } from '../color-data';
import { CSSToken } from '@csstools/css-tokenizer';
export declare function normalize_legacy_sRGB_ChannelValues(token: CSSToken, index: number, colorData: ColorData): CSSToken | false;
export declare function normalize_modern_sRGB_ChannelValues(token: CSSToken, index: number, colorData: ColorData): CSSToken | false;
