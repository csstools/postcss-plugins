import type { Color } from '@csstools/color-helpers';
import { ColorSpace } from './color-space';
import { NumberType, TokenNumber, TokenType } from '@csstools/css-tokenizer';
import { xyz } from '@csstools/color-helpers';
import { ComponentValue } from '@csstools/css-parser-algorithms';

export type ColorData = {
	colorSpace: ColorSpace,
	channels: Color,

	sourceColorSpace: ColorSpace,
	alpha: number | ComponentValue,
	missingComponents: Array<boolean>,
	syntaxFlags: Set<SyntaxFlag>
}

export enum SyntaxFlag {
	ColorKeyword = 'color-keyword',
	HasAlpha = 'has-alpha',
	HasDimensionValues = 'has-dimension-values',
	HasNoneKeywords = 'has-none-keywords',
	HasNumberValues = 'has-number-values',
	HasPercentageAlpha = 'has-percentage-alpha',
	HasPercentageValues = 'has-percentage-values',
	HasVariableAlpha = 'has-variable-alpha',
	Hex = 'hex',
	LegacyHSL = 'legacy-hsl',
	LegacyRGB = 'legacy-rgb',
	NamedColor = 'named-color',
	RelativeColorSyntax = 'relative-color-syntax',
	ColorMix = 'color-mix',
}

export function colorDataChannelsToCalcGlobals(x: ColorData /*, zeroPercentRef: number, hundredPercentRef: number */): Map<string, TokenNumber> {
	const globals: Map<string, TokenNumber> = new Map();

	switch (x.colorSpace) {
		case ColorSpace.XYZ_D50:
			globals.set('x', dummyNumberToken(x.channels[0]));
			globals.set('y', dummyNumberToken(x.channels[1]));
			globals.set('z', dummyNumberToken(x.channels[2]));

			if (typeof x.alpha === 'number') {
				globals.set('alpha', dummyNumberToken(x.alpha));
			}

			break;
		case ColorSpace.sRGB:
			globals.set('r', dummyNumberToken(x.channels[0] * 255));
			globals.set('g', dummyNumberToken(x.channels[1] * 255));
			globals.set('b', dummyNumberToken(x.channels[2] * 255));

			if (typeof x.alpha === 'number') {
				globals.set('alpha', dummyNumberToken(x.alpha));
			}

			break;
		default:
			break;
	}

	return globals;
}

function dummyNumberToken(x: number): TokenNumber {
	return [TokenType.Number, x.toString(), -1, -1, { value: x, type: NumberType.Number }];
}

export function colorDataToColorSpace(x: ColorData | false, colorSpace: ColorSpace): ColorData | false {
	if (x === false) {
		return false;
	}

	if (x.colorSpace !== ColorSpace.XYZ_D50) {
		return false;
	}

	switch (colorSpace) {
		case ColorSpace.XYZ_D50:
			return x;
		case ColorSpace.sRGB:
			x.colorSpace = ColorSpace.sRGB;
			x.channels = xyz.XYZ_D50_to_sRGB(x.channels);
			return x;
		default:
			break;
	}

	return false;
}
