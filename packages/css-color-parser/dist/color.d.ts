import type { Color } from '@csstools/color-helpers';
import { TokenNumber } from '@csstools/css-tokenizer';
export type ColorData = {
    channels: Color;
    alpha: number;
    missingComponents: Array<boolean>;
    sourceColorSpace: string;
    currentColorSpace: string;
    syntaxFlags: Set<SyntaxFlag>;
};
export declare enum SyntaxFlag {
    LegacyRGB = "legacy-rgb",
    LegacyHSL = "legacy-hsl",
    RelativeColorSyntax = "relative-color-syntax",
    HasAlpha = "has-alpha",
    HasNoneKeywords = "has-none-keywords",
    HasNumberValues = "has-number-values",
    HasPercentageValues = "has-percentage-values"
}
export declare function colorDataChannelsToCalcGlobals(x: ColorData): Map<string, TokenNumber>;
