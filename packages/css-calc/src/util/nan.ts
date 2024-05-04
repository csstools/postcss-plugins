import { FunctionNode, isFunctionNode, TokenNode, WhitespaceNode } from '@csstools/css-parser-algorithms';
import { isTokenNumber } from '@csstools/css-tokenizer';
import { isTokenDimension, isTokenNumeric, isTokenPercentage, NumberType, TokenType } from '@csstools/css-tokenizer';

export function patchNaN(x: TokenNode | FunctionNode | -1): TokenNode | FunctionNode | -1 {
	if (x === -1) {
		return -1;
	}

	if (isFunctionNode(x)) {
		return x;
	}

	const token = x.value;
	if (!isTokenNumeric(token)) {
		return x;
	}

	if (!Number.isNaN(token[4].value)) {
		return x;
	}

	if (isTokenNumber(token)) {
		return new FunctionNode(
			[TokenType.Function, 'calc(', token[2], token[3], { value: 'calc' }],
			[TokenType.CloseParen, ')', token[2], token[3], undefined],
			[
				new TokenNode([TokenType.Ident, 'NaN', token[2], token[3], {
					value: 'NaN',
				}]),
			],
		);
	}

	if (isTokenDimension(token)) {
		return new FunctionNode(
			[TokenType.Function, 'calc(', token[2], token[3], { value: 'calc' }],
			[TokenType.CloseParen, ')', token[2], token[3], undefined],
			[
				new TokenNode([TokenType.Ident, 'NaN', token[2], token[3], {
					value: 'NaN',
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

	if (isTokenPercentage(token)) {
		return new FunctionNode(
			[TokenType.Function, 'calc(', token[2], token[3], { value: 'calc' }],
			[TokenType.CloseParen, ')', token[2], token[3], undefined],
			[
				new TokenNode([TokenType.Ident, 'NaN', token[2], token[3], {
					value: 'NaN',
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
