import { ColorData } from '../color-data';
import type { TokenCloseParen, TokenFunction, TokenWhitespace } from '@csstools/css-tokenizer';
import { FunctionNode, TokenNode, WhitespaceNode } from '@csstools/css-parser-algorithms';
import { NumberType, TokenType } from '@csstools/css-tokenizer';
import { toPrecision } from './to-precision';

export function serializeWithAlpha(color: ColorData, fn: TokenFunction, space: TokenWhitespace, channels: Array<TokenNode|WhitespaceNode>): FunctionNode {
	const close: TokenCloseParen = [TokenType.CloseParen, ')', -1, -1, undefined];

	if (typeof color.alpha === 'number') {
		const a = Math.min(1, Math.max(0, toPrecision(Number.isNaN(color.alpha) ? 0 : color.alpha)));
		if (toPrecision(a, 4) === 1) {
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
				new WhitespaceNode([space]),
				new TokenNode([TokenType.Delim, '/', -1, -1, { value: '/' }]),
				new WhitespaceNode([space]),
				new TokenNode([TokenType.Number, toPrecision(a, 4).toString(), -1, -1, { value: color.alpha, type: NumberType.Integer }]),
			],
		);
	}

	return new FunctionNode(
		fn,
		close,
		[
			...channels,
			new WhitespaceNode([space]),
			new TokenNode([TokenType.Delim, '/', -1, -1, { value: '/' }]),
			new WhitespaceNode([space]),
			color.alpha,
		],
	);
}
