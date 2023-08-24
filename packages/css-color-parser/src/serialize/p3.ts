import { ColorData, convertPowerlessComponentsToZeroValuesForDisplay } from '../color-data';
import type { TokenFunction, TokenWhitespace } from '@csstools/css-tokenizer';
import {  colorData_to_XYZ_D50 } from '../color-data';
import { ColorNotation } from '../color-notation';
import { FunctionNode, TokenNode, WhitespaceNode } from '@csstools/css-parser-algorithms';
import { NumberType, TokenType } from '@csstools/css-tokenizer';
import { xyz } from '@csstools/color-helpers';
import { toPrecision } from './to-precision';
import { XYZ_D50_to_P3_Gamut } from '../gamut-mapping/p3';
import { serializeWithAlpha } from './with-alpha';

export function serializeP3(color: ColorData, gamutMapping = true): FunctionNode {
	color.channels = convertPowerlessComponentsToZeroValuesForDisplay(color.channels, color.colorNotation);
	let p3 = color.channels.map((x) => Number.isNaN(x) ? 0 : x);

	if (
		color.colorNotation !== ColorNotation.Display_P3
	) {
		if (gamutMapping) {
			p3 = XYZ_D50_to_P3_Gamut(colorData_to_XYZ_D50(color).channels);
		} else {
			p3 = xyz.XYZ_D50_to_P3(colorData_to_XYZ_D50(color).channels);
		}
	}

	const r = toPrecision(p3[0], 6);
	const g = toPrecision(p3[1], 6);
	const b = toPrecision(p3[2], 6);

	const fn: TokenFunction = [TokenType.Function, 'color(', -1, -1, { value: 'color' }];
	const space: TokenWhitespace = [TokenType.Whitespace, ' ', -1, -1, undefined];

	const channels = [
		new TokenNode([TokenType.Ident, 'display-p3', -1, -1, { value: 'display-p3' }]),
		new WhitespaceNode([space]),
		new TokenNode([TokenType.Number, r.toString(), -1, -1, { value: p3[0], type: NumberType.Number }]),
		new WhitespaceNode([space]),
		new TokenNode([TokenType.Number, g.toString(), -1, -1, { value: p3[1], type: NumberType.Number }]),
		new WhitespaceNode([space]),
		new TokenNode([TokenType.Number, b.toString(), -1, -1, { value: p3[2], type: NumberType.Number }]),
	];

	return serializeWithAlpha(color, fn, space, channels);
}
