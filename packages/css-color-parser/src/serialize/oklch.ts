import { ColorData, convertPowerlessComponentsToZeroValuesForDisplay } from '../color-data';
import type { TokenFunction, TokenWhitespace } from '@csstools/css-tokenizer';
import {  colorData_to_XYZ_D50 } from '../color-data';
import { ColorNotation } from '../color-notation';
import { FunctionNode, TokenNode, WhitespaceNode } from '@csstools/css-parser-algorithms';
import { NumberType, TokenType } from '@csstools/css-tokenizer';
import { xyz } from '@csstools/color-helpers';
import { toPrecision } from './to-precision';
import { serializeWithAlpha } from './with-alpha';

export function serializeOKLCH(color: ColorData): FunctionNode {
	color.channels = convertPowerlessComponentsToZeroValuesForDisplay(color.channels, color.colorNotation);
	let oklch = color.channels.map((x) => Number.isNaN(x) ? 0 : x);

	if (
		color.colorNotation !== ColorNotation.OKLCH
	) {
		oklch = xyz.XYZ_D50_to_OKLCH(colorData_to_XYZ_D50(color).channels);
	}

	const l = toPrecision(oklch[0], 6);
	const c = toPrecision(oklch[1], 6);
	const h = toPrecision(oklch[2], 6);

	const fn: TokenFunction = [TokenType.Function, 'oklch(', -1, -1, { value: 'oklch' }];
	const space: TokenWhitespace = [TokenType.Whitespace, ' ', -1, -1, undefined];

	const channels = [
		new TokenNode([TokenType.Number, l.toString(), -1, -1, { value: oklch[0], type: NumberType.Number }]),
		new WhitespaceNode([space]),
		new TokenNode([TokenType.Number, c.toString(), -1, -1, { value: oklch[1], type: NumberType.Number }]),
		new WhitespaceNode([space]),
		new TokenNode([TokenType.Number, h.toString(), -1, -1, { value: oklch[2], type: NumberType.Number }]),
	];

	return serializeWithAlpha(color, fn, space, channels);
}
