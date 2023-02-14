import { NumberType, TokenDimension, TokenType } from '@csstools/css-tokenizer';
import { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { Calculation } from '../calculation';
import { unary } from '../operation/unary';
import { convertUnit } from '../unit-conversions';

export function solveRound(roundNodes: FunctionNode, roundingStrategy: string, a: TokenNode, b: TokenNode): Calculation | -1 {
	const aToken = a.value;
	if (
		!(
			aToken[0] === TokenType.Dimension ||
			aToken[0] === TokenType.Number ||
			aToken[0] === TokenType.Percentage
		)
	) {
		return -1;
	}

	const bToken = convertUnit(aToken, b.value);
	if (aToken[0] !== bToken[0]) {
		return -1;
	}

	if (aToken[0] === TokenType.Dimension) {
		if (aToken[4].unit !== (bToken as TokenDimension)[4].unit) {
			return -1;
		}
	}

	let result;
	if (bToken[4].value === 0) {
		result = Number.NaN;
	} else if (!Number.isFinite(aToken[4].value) && !Number.isFinite(bToken[4].value)) {
		result = Number.NaN;
	} else if (!Number.isFinite(aToken[4].value) && Number.isFinite(bToken[4].value)) {
		result = aToken[4].value;
	} else if (Number.isFinite(aToken[4].value) && !Number.isFinite(bToken[4].value)) {
		switch (roundingStrategy) {
			case 'down':
				if (aToken[4].value < 0) {
					result = -Infinity;
				} else if (Object.is(-0, aToken[4].value * 0)) {
					result = -0;
				} else {
					result = +0;
				}
				break;
			case 'up':
				if (aToken[4].value > 0) {
					result = +Infinity;
				} else if (Object.is(+0, aToken[4].value * 0)) {
					result = +0;
				} else {
					result = -0;
				}
				break;
			case 'to-zero':
			case 'nearest':
			default: {
				if (Object.is(+0, aToken[4].value * 0)) {
					result = +0;
				} else {
					result = -0;
				}
			}
		}
	} else {
		switch (roundingStrategy) {
			case 'down':
				result = Math.floor(aToken[4].value / bToken[4].value) * bToken[4].value;
				break;
			case 'up':
				result = Math.ceil(aToken[4].value / bToken[4].value) * bToken[4].value;
				break;
			case 'to-zero':
				result = Math.trunc(aToken[4].value / bToken[4].value) * bToken[4].value;
				break;
			case 'nearest':
			default: {
				let down = Math.floor(aToken[4].value / bToken[4].value) * bToken[4].value;
				let up = Math.ceil(aToken[4].value / bToken[4].value) * bToken[4].value;
				if (down > up) {
					const temp = down;
					down = up;
					up = temp;
				}

				const downDiff = Math.abs(aToken[4].value - down);
				const upDiff = Math.abs(aToken[4].value - up);

				if (downDiff === upDiff) {
					result = up;
				} if (downDiff < upDiff) {
					result = down;
				} else {
					result = up;
				}

				break;
			}
		}
	}

	const roundTokens = roundNodes.tokens();
	if (aToken[0] === TokenType.Dimension) {
		return {
			inputs: [
				new TokenNode(
					[
						TokenType.Dimension,
						result.toString() + aToken[4].unit,
						roundTokens[0][2],
						roundTokens[roundTokens.length - 1][3],
						{
							value: result,
							type: Number.isInteger(result) ? NumberType.Integer : NumberType.Number,
							unit: aToken[4].unit,
						},
					],
				),
			],
			operation: unary,
		};
	}

	if (aToken[0] === TokenType.Percentage) {
		return {
			inputs: [
				new TokenNode(
					[
						TokenType.Percentage,
						result.toString() + '%',
						roundTokens[0][2],
						roundTokens[roundTokens.length - 1][3],
						{
							value: result,
						},
					],
				),
			],
			operation: unary,
		};
	}

	return {
		inputs: [
			new TokenNode(
				[
					TokenType.Number,
					result.toString(),
					roundTokens[0][2],
					roundTokens[roundTokens.length - 1][3],
					{
						value: result,
						type: Number.isInteger(result) ? NumberType.Integer : NumberType.Number,
					},
				],
			),
		],
		operation: unary,
	};
}
