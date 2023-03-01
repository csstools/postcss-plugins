import type { Color } from '@csstools/color-helpers';
import { NumberType, TokenNumber, TokenType } from '@csstools/css-tokenizer';
import { ColorSpace } from './color-space';

export type ColorData = {
	channels: Color,
	alpha: number,
	missingComponents: Array<boolean>,
	sourceColorSpace: string,
	currentColorSpace: string,
	syntaxFlags: Set<SyntaxFlag>
}

export enum SyntaxFlag {
	LegacyRGB = 'legacy-rgb',
	LegacyHSL = 'legacy-hsl',
	RelativeColorSyntax = 'relative-color-syntax',
	HasAlpha = 'has-alpha',
	HasNoneKeywords = 'has-none-keywords',
	HasNumberValues = 'has-number-values',
	HasPercentageValues = 'has-percentage-values',
}

export function colorDataChannelsToCalcGlobals(x: ColorData /*, zeroPercentRef: number, hundredPercentRef: number */): Map<string, TokenNumber> {
	const globals: Map<string, TokenNumber> = new Map();

	switch (x.currentColorSpace) {
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
