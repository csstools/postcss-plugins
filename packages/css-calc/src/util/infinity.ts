import { FunctionNode, isFunctionNode, TokenNode, WhitespaceNode } from '@csstools/css-parser-algorithms';
import { NumberType, TokenType } from '@csstools/css-tokenizer';

export function patchInfinity(x: TokenNode | FunctionNode | -1): TokenNode | FunctionNode | -1 {
	if (x === -1) {
		return -1;
	}

	if (isFunctionNode(x)) {
		return x;
	}

	const token = x.value;
	if (
		token[0] !== TokenType.Number &&
		token[0] !== TokenType.Percentage &&
		token[0] !== TokenType.Dimension
	) {
		return x;
	}

	if (Number.isFinite(token[4].value)) {
		return x;
	}

	let signStr = '';
	if (Number.NEGATIVE_INFINITY === token[4].value) {
		signStr = '-';
	}

	if (token[0] === TokenType.Number) {
		return new FunctionNode(
			[TokenType.Function, 'calc(', token[2], token[3], { value: 'calc' }],
			[TokenType.CloseParen, ')', token[2], token[3], undefined],
			[
				new TokenNode([TokenType.Ident, signStr + 'infinity', token[2], token[3], {
					value: signStr + 'infinity',
				}]),
			],
		);
	}

	if (token[0] === TokenType.Dimension) {
		return new FunctionNode(
			[TokenType.Function, 'calc(', token[2], token[3], { value: 'calc' }],
			[TokenType.CloseParen, ')', token[2], token[3], undefined],
			[
				new TokenNode([TokenType.Ident, signStr + 'infinity', token[2], token[3], {
					value: signStr + 'infinity',
				}]),
				new WhitespaceNode(
					[
						[TokenType.Whitespace, ' ', token[2], token[3], undefined],
					],
				),
				new TokenNode([TokenType.Delim, '*', token[2], token[3], {
					value: '*',
				}]),
				new WhitespaceNode(
					[
						[TokenType.Whitespace, ' ', token[2], token[3], undefined],
					],
				),
				new TokenNode([TokenType.Dimension, '1' + token[4].unit, token[2], token[3], {
					value: 1,
					type: NumberType.Integer,
					unit: token[4].unit,
				}]),
			],
		);
	}

	if (token[0] === TokenType.Percentage) {
		return new FunctionNode(
			[TokenType.Function, 'calc(', token[2], token[3], { value: 'calc' }],
			[TokenType.CloseParen, ')', token[2], token[3], undefined],
			[
				new TokenNode([TokenType.Ident, signStr + 'infinity', token[2], token[3], {
					value: signStr + 'infinity',
				}]),
				new WhitespaceNode(
					[
						[TokenType.Whitespace, ' ', token[2], token[3], undefined],
					],
				),
				new TokenNode([TokenType.Delim, '*', token[2], token[3], {
					value: '*',
				}]),
				new WhitespaceNode(
					[
						[TokenType.Whitespace, ' ', token[2], token[3], undefined],
					],
				),
				new TokenNode([TokenType.Percentage, '1%', token[2], token[3], {
					value: 1,
				}]),
			],
		);
	}

	return -1;
}
