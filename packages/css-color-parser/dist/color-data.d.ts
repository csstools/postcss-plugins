import type { Color } from '@csstools/color-helpers';
import type { ComponentValue } from '@csstools/css-parser-algorithms';
import { ColorNotation } from './color-notation';
import { TokenNumber } from '@csstools/css-tokenizer';
export type ColorData = {
    colorNotation: ColorNotation;
    channels: Color;
    alpha: number | ComponentValue;
    syntaxFlags: Set<SyntaxFlag>;
};
export declare enum SyntaxFlag {
    /** Is a color keyword, e.g. `transparent`, `currentColor`, ... */
    ColorKeyword = "color-keyword",
    /** Has an explicit alpha channel */
    HasAlpha = "has-alpha",
    /** Has a channel with a dimension value, e.g. `50deg` */
    HasDimensionValues = "has-dimension-values",
    /** Has a channel with the `none` keyword */
    HasNoneKeywords = "has-none-keywords",
    /** Has a channel with a number value */
    HasNumberValues = "has-number-values",
    /** Has an alpha channel with a percentage value */
    HasPercentageAlpha = "has-percentage-alpha",
    /** Has a channel with a percentage value */
    HasPercentageValues = "has-percentage-values",
    /** Has an alpha channel with a `var()` function value */
    HasVariableAlpha = "has-variable-alpha",
    /** Is Hex notation */
    Hex = "hex",
    /** Is legacy HSL, e.g. `hsl(50deg, 0%, 0%)` */
    LegacyHSL = "legacy-hsl",
    /** Is legacy RGB, e.g. `rgb(0, 0, 0)` */
    LegacyRGB = "legacy-rgb",
    /** Is a named color, e.g. `red`, `blue` */
    NamedColor = "named-color",
    /** Is a relative color syntax, e.g. `rgb(from purple r g b)` */
    RelativeColorSyntax = "relative-color-syntax",
    /** Is a mixed color, e.g. `color-mix(in oklch, red, blue)` */
    ColorMix = "color-mix",
    /** Is a contrast color syntax */
    ContrastColor = "contrast-color",
    /** Is an experimental color syntax */
    Experimental = "experimental"
}
export declare function colorData_to_XYZ_D50(colorData: ColorData): ColorData;
export declare function colorDataTo(colorData: ColorData, toNotation: ColorNotation): ColorData;
export declare function convertPowerlessComponentsToZeroValuesForDisplay(a: Color, colorNotation: ColorNotation): Color;
export declare function normalizeRelativeColorDataChannels(x: ColorData): Map<string, TokenNumber>;
export declare function noneToZeroInRelativeColorDataChannels(x: Map<string, TokenNumber>): Map<string, TokenNumber>;
/**
 * Check if a color data object fits the `sRGB` gamut.
 *
 * @param {ColorData} x - The color data to be checked.
 * @returns {boolean} Whether the color data fits the `sRGB` gamut.
 */
export declare function colorDataFitsRGB_Gamut(x: ColorData): boolean;
/**
 * Check if a color data object fits the `display-p3` gamut.
 *
 * @param {ColorData} x - The color data to be checked.
 * @returns {boolean} Whether the color data fits the `display-p3` gamut.
 */
export declare function colorDataFitsDisplayP3_Gamut(x: ColorData): boolean;
