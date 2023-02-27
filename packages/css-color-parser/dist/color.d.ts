import type { Color } from '@csstools/color-helpers';
import { TokenNumber } from '@csstools/css-tokenizer';
export type ColorData = {
    channels: Color;
    alpha: number;
    sourceColorSpace: string;
    currentColorSpace: string;
};
export declare function colorDataChannelsToCalcGlobals(x: ColorData): Map<string, TokenNumber>;
