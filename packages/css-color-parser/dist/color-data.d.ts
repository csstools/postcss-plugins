import { Color } from '@csstools/color-helpers';
import { ColorNotation } from './color-notation';
import { TokenNumber } from '@csstools/css-tokenizer';
import { ComponentValue } from '@csstools/css-parser-algorithms';
export type ColorData = {
    colorNotation: ColorNotation;
    channels: Color;
    alpha: number | ComponentValue;
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
    HasVariableAlpha = "has-variable-alpha",
    Hex = "hex",
    LegacyHSL = "legacy-hsl",
    LegacyRGB = "legacy-rgb",
    NamedColor = "named-color",
    RelativeColorSyntax = "relative-color-syntax",
    ColorMix = "color-mix"
}
export declare function colorData_to_XYZ_D50(colorData: ColorData): ColorData;
export declare function colorDataTo(colorData: ColorData, toNotation: ColorNotation): ColorData;
export declare function fillInMissingComponents(a: Color, b: Color): Color;
export declare function colorDataChannelsToCalcGlobals(x: ColorData): Map<string, TokenNumber>;
export declare function colorDataToColorNotation(x: ColorData | false, colorNotation: ColorNotation): ColorData | false;
