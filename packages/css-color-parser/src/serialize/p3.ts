import { ColorData, convertPowerlessComponentsToMissingComponents } from '../color-data';
import type { TokenCloseParen, TokenFunction, TokenWhitespace } from '@csstools/css-tokenizer';
import {  colorData_to_XYZ_D50 } from '../color-data';
import { ColorNotation } from '../color-notation';
import { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { NumberType, TokenType } from '@csstools/css-tokenizer';
import { xyz } from '@csstools/color-helpers';
import { toPrecision } from './to-precision';
import { XYZ_D50_to_P3_Gamut } from '../gamut-mapping/p3';

export function serializeP3(color: ColorData, gamutMapping = true): FunctionNode {
	color.channels = convertPowerlessComponentsToMissingComponents(color.channels, color.colorNotation);
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
	const close: TokenCloseParen = [TokenType.CloseParen, ')', -1, -1, undefined];
	const space: TokenWhitespace = [TokenType.Whitespace, ' ', -1, -1, undefined];

	const channels = [
		new TokenNode([TokenType.Ident, 'display-p3', -1, -1, { value: 'display-p3' }]),
		new TokenNode(space),
		new TokenNode([TokenType.Number, r.toString(), -1, -1, { value: p3[0], type: NumberType.Number }]),
		new TokenNode(space),
		new TokenNode([TokenType.Number, g.toString(), -1, -1, { value: p3[1], type: NumberType.Number }]),
		new TokenNode(space),
		new TokenNode([TokenType.Number, b.toString(), -1, -1, { value: p3[2], type: NumberType.Number }]),
	];

	if (typeof color.alpha === 'number') {
		const a = Math.min(1, Math.max(0, toPrecision(Number.isNaN(color.alpha) ? 0 : color.alpha)));
		if (a === 1) {
			return new FunctionNode(
				fn,
				close,
				channels,
			);
		}

		return new FunctionNode(
			fn,
			close,
			[
				...channels,
				new TokenNode(space),
				new TokenNode([TokenType.Delim, '/', -1, -1, { value: '/' }]),
				new TokenNode(space),
				new TokenNode([TokenType.Number, a.toString(), -1, -1, { value: color.alpha, type: NumberType.Integer }]),
			],
		);
	}

	return new FunctionNode(
		fn,
		close,
		[
			...channels,
			new TokenNode(space),
			new TokenNode([TokenType.Delim, '/', -1, -1, { value: '/' }]),
			new TokenNode(space),
			color.alpha,
		],
	);
}
