import type { Color } from '@csstools/color-helpers';
import { ColorSpace } from './color-space';
import { NumberType, TokenNumber, TokenType } from '@csstools/css-tokenizer';
import { xyz } from '@csstools/color-helpers';

export type ColorData = {
	colorSpace: ColorSpace,
	channels: Color,

	sourceColorSpace: ColorSpace,
	alpha: number,
	missingComponents: Array<boolean>,
	syntaxFlags: Set<SyntaxFlag>
}

export enum SyntaxFlag {
	ColorKeyword = 'color-keyword',
	HasAlpha = 'has-alpha',
	HasNoneKeywords = 'has-none-keywords',
	HasNumberValues = 'has-number-values',
	HasPercentageValues = 'has-percentage-values',
	HasDimensionValues = 'has-dimension-values',
	HasPercentageAlpha = 'has-percentage-alpha',
	LegacyHSL = 'legacy-hsl',
	LegacyRGB = 'legacy-rgb',
	NamedColor = 'named-color',
	RelativeColorSyntax = 'relative-color-syntax',
}

export function colorDataChannelsToCalcGlobals(x: ColorData /*, zeroPercentRef: number, hundredPercentRef: number */): Map<string, TokenNumber> {
	const globals: Map<string, TokenNumber> = new Map();

	switch (x.colorSpace) {
		case ColorSpace.XYZ_D50:
			globals.set('x', dummyNumberToken(x.channels[0]));
			globals.set('y', dummyNumberToken(x.channels[1]));
			globals.set('z', dummyNumberToken(x.channels[2]));
			globals.set('alpha', dummyNumberToken(x.alpha));
			break;
		case ColorSpace.sRGB:
			globals.set('r', dummyNumberToken(x.channels[0] * 255));
			globals.set('g', dummyNumberToken(x.channels[1] * 255));
			globals.set('b', dummyNumberToken(x.channels[2] * 255));
			globals.set('alpha', dummyNumberToken(x.alpha));
			break;
		default:
			break;
	}

	return globals;
}

function dummyNumberToken(x: number): TokenNumber {
	return [TokenType.Number, x.toString(), -1, -1, { value: x, type: NumberType.Number }];
}


export function colorDataToColorSpace(x: ColorData | -1, colorSpace: ColorSpace): ColorData | -1 {
	if (x === -1) {
		return -1;
	}

	if (x.colorSpace !== ColorSpace.XYZ_D50) {
		return -1;
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

	return -1;
}
