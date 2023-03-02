import type { Color } from '@csstools/color-helpers';
import { ColorSpace } from './color-space';
import { TokenNumber } from '@csstools/css-tokenizer';
export type ColorData = {
    colorSpace: ColorSpace;
    channels: Color;
    sourceColorSpace: ColorSpace;
    alpha: number;
    missingComponents: Array<boolean>;
    syntaxFlags: Set<SyntaxFlag>;
};
export declare enum SyntaxFlag {
    ColorKeyword = "color-keyword",
    HasAlpha = "has-alpha",
    HasDimensionValues = "has-dimension-values",
    HasNoneKeywords = "has-none-keywords",
    HasNumberValues = "has-number-values",
    HasPercentageAlpha = "has-percentage-alpha",
    HasPercentageValues = "has-percentage-values",
    Hex = "hex",
    LegacyHSL = "legacy-hsl",
    LegacyRGB = "legacy-rgb",
    NamedColor = "named-color",
    RelativeColorSyntax = "relative-color-syntax"
}
export declare function colorDataChannelsToCalcGlobals(x: ColorData): Map<string, TokenNumber>;
export declare function colorDataToColorSpace(x: ColorData | -1, colorSpace: ColorSpace): ColorData | -1;
