import type { TokenCloseParen }from '@csstools/css-tokenizer';
import { ColorData } from '../color-data';
import { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { NumberType, TokenType } from '@csstools/css-tokenizer';
import { toPrecision } from './to-precision';
import { xyz } from '@csstools/color-helpers';

export function serializeRGB(color: ColorData): FunctionNode {
	const srgb = xyz.XYZ_D50_to_sRGB(color.channels);
	const r = Math.min(255, Math.max(0, Math.round(toPrecision(srgb[0]) * 255)));
	const g = Math.min(255, Math.max(0, Math.round(toPrecision(srgb[1]) * 255)));
	const b = Math.min(255, Math.max(0, Math.round(toPrecision(srgb[2]) * 255)));

	const close: TokenCloseParen = [TokenType.CloseParen, ')', -1, -1, undefined];

	const channels = [
		new TokenNode([TokenType.Number, r.toString(), -1, -1, { value: srgb[0], type: NumberType.Integer }]),
		new TokenNode([TokenType.Comma, ',', -1, -1, undefined]),
		new TokenNode([TokenType.Whitespace, ' ', -1, -1, undefined]),
		new TokenNode([TokenType.Number, g.toString(), -1, -1, { value: srgb[1], type: NumberType.Integer }]),
		new TokenNode([TokenType.Comma, ',', -1, -1, undefined]),
		new TokenNode([TokenType.Whitespace, ' ', -1, -1, undefined]),
		new TokenNode([TokenType.Number, b.toString(), -1, -1, { value: srgb[2], type: NumberType.Integer }]),
	];

	if (typeof color.alpha === 'number') {
		const a = Math.min(1, Math.max(0, toPrecision(color.alpha)));
		if (a === 1) {
			return new FunctionNode(
				[TokenType.Function, 'rgb(', -1, -1, { value: 'rgb' }],
				close,
				channels,
			);
		}

		return new FunctionNode(
			[TokenType.Function, 'rgba(', -1, -1, { value: 'rgba' }],
			close,
			[
				...channels,
				new TokenNode([TokenType.Comma, ',', -1, -1, undefined]),
				new TokenNode([TokenType.Whitespace, ' ', -1, -1, undefined]),
				new TokenNode([TokenType.Number, a.toString(), -1, -1, { value: color.alpha, type: NumberType.Integer }]),
			],
		);
	}

	return new FunctionNode(
		[TokenType.Function, 'rgba(', -1, -1, { value: 'rgba' }],
		close,
		[
			...channels,
			new TokenNode([TokenType.Comma, ',', -1, -1, undefined]),
			new TokenNode([TokenType.Whitespace, ' ', -1, -1, undefined]),
			color.alpha,
		],
	);
}
