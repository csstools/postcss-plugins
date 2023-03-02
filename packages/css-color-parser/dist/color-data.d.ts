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
    HasNoneKeywords = "has-none-keywords",
    HasNumberValues = "has-number-values",
    HasPercentageValues = "has-percentage-values",
    HasDimensionValues = "has-dimension-values",
    HasPercentageAlpha = "has-percentage-alpha",
    LegacyHSL = "legacy-hsl",
    LegacyRGB = "legacy-rgb",
    NamedColor = "named-color",
    RelativeColorSyntax = "relative-color-syntax"
}
export declare function colorDataChannelsToCalcGlobals(x: ColorData): Map<string, TokenNumber>;
export declare function colorDataToColorSpace(x: ColorData | -1, colorSpace: ColorSpace): ColorData | -1;
