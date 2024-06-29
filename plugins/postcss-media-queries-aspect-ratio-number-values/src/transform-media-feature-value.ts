import { ComponentValue, FunctionNode, isFunctionNode, isTokenNode, SimpleBlockNode, TokenNode, WhitespaceNode } from '@csstools/css-parser-algorithms';
import { isTokenNumber, NumberType, TokenType } from '@csstools/css-tokenizer';
import { matchesRatioExactly, MediaFeatureValue } from '@csstools/media-query-list-parser';

const precision = 100000;
const nearInfinity = 2147483647;

export function transformMediaFeatureValue(value: MediaFeatureValue): void {
	if (Array.isArray(value.value) && matchesRatioExactly(value.value)) {
		const nodes: Array<ComponentValue> = [];

		for (let i = 0; i < value.value.length; i++) {
			const node = value.value[i];
			if (isTokenNode(node) && isTokenNumber(node.value)) {
				nodes.push(node);
				continue;
			}

			if (isFunctionNode(node) && node.getName().toLowerCase() === 'calc') {
				nodes.push(node);
				continue;
			}
		}

		if (nodes.length !== 2) {
			return;
		}

		const firstValue = nodes[0];
		const firstValueIndex = value.value.indexOf(firstValue);
		const secondValue = nodes[1];
		const secondValueIndex = value.value.indexOf(secondValue);

		// Ratio with division by 0
		// "<any> / 0" -> "2147483647 / 1" (near infinity)
		if (isTokenNode(secondValue) && isTokenNumber(secondValue.value) && secondValue.value[4].value === 0) {
			value.value.splice(
				firstValueIndex,
				1,
				new TokenNode(
					[TokenType.Number, nearInfinity.toString(), -1, -1, { value: nearInfinity, type: NumberType.Integer }],
				),
			);

			value.value.splice(
				secondValueIndex,
				1,
				new TokenNode(
					[TokenType.Number, '1', -1, -1, { value: 1, type: NumberType.Integer }],
				),
			);

			return;
		}

		// Ratio with only integers
		// "1 / 1"
		if (
			(isTokenNode(firstValue) && isTokenNumber(firstValue.value) && firstValue.value[4].type === NumberType.Integer) &&
			(isTokenNode(secondValue) && isTokenNumber(secondValue.value) && secondValue.value[4].type === NumberType.Integer)
		) {
			return;
		}

		let firstValueModified: ComponentValue | null = null;
		let secondValueModified: ComponentValue | null = null;

		// Calc
		{
			if (isFunctionNode(firstValue) && firstValue.getName().toLowerCase() === 'calc') {
				// Avoid infinite loops
				if (firstValue.toString().includes(precision.toString())) {
					return;
				}

				firstValueModified = modifyCalc(firstValue);
			}

			if (isFunctionNode(secondValue) && secondValue.getName().toLowerCase() === 'calc') {
				// Avoid infinite loops
				if (secondValue.toString().includes(precision.toString())) {
					return;
				}

				secondValueModified = modifyCalc(secondValue);
			}
		}

		// Numbers
		{
			if (
				(isTokenNode(firstValue) && isTokenNumber(firstValue.value)) &&
				(isTokenNode(secondValue) && isTokenNumber(secondValue.value))
			) {
				const firstToken = firstValue.value;
				const secondToken = secondValue.value;

				const firstNumber = Math.round(firstToken[4].value * precision);
				const secondNumber = Math.round(secondToken[4].value * precision);
				const gcd = greatestCommonDivisor(firstNumber, secondNumber);

				firstValueModified = new TokenNode(
					[TokenType.Number, Math.round(firstNumber / gcd).toString(), -1, -1, { value: Math.round(firstNumber / gcd), type: NumberType.Integer }],
				);

				secondValueModified = new TokenNode(
					[TokenType.Number, Math.round(secondNumber / gcd).toString(), -1, -1, { value: Math.round(secondNumber / gcd), type: NumberType.Integer }],
				);
			} else {
				if (isTokenNode(firstValue) && isTokenNumber(firstValue.value)) {
					const token = firstValue.value;
					firstValueModified = new TokenNode(
						[TokenType.Number, Math.round(token[4].value * precision).toString(), -1, -1, { value: Math.round(token[4].value * precision), type: NumberType.Integer }],
					);
				}

				if (isTokenNode(secondValue) && isTokenNumber(secondValue.value)) {
					const token = secondValue.value;
					secondValueModified = new TokenNode(
						[TokenType.Number, Math.round(token[4].value * precision).toString(), -1, -1, { value: Math.round(token[4].value * precision), type: NumberType.Integer }],
					);
				}
			}
		}

		if (firstValueModified && secondValueModified) {
			value.value.splice(
				firstValueIndex,
				1,
				firstValueModified,
			);

			value.value.splice(
				secondValueIndex,
				1,
				secondValueModified,
			);

			return;
		}

		return;
	}

	const componentValues = Array.isArray(value.value) ? value.value : [value.value];
	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];

		if (isTokenNode(componentValue)) {
			const token = componentValue.value;
			if (!isTokenNumber(token)) {
				return;
			}

			// Single integer as <ratio>
			// "1" -> "1 / 1"
			if (token[4].type === NumberType.Integer) {
				componentValues.splice(
					i + 1,
					0,
					new TokenNode(
						[TokenType.Delim, '/', -1, -1, { value: '/' }],
					),
					new TokenNode(
						[TokenType.Number, '1', -1, -1, { value: 1, type: NumberType.Integer }],
					),
				);

				value.value = componentValues;
				return;
			}

			// Single float as <ratio>
			// "0.001" -> "1000 / 1000000"
			if (token[4].type === NumberType.Number) {
				const firstNumber = Math.round(token[4].value * precision);
				const gcd = greatestCommonDivisor(firstNumber, precision);

				componentValues.splice(
					i,
					1,
					new TokenNode(
						[TokenType.Number, Math.round(firstNumber / gcd).toString(), -1, -1, { value: Math.round(firstNumber / gcd), type: NumberType.Integer }],
					),
					new TokenNode(
						[TokenType.Delim, '/', -1, -1, { value: '/' }],
					),
					new TokenNode(
						[TokenType.Number, Math.round(precision / gcd).toString(), -1, -1, { value: Math.round(precision / gcd), type: NumberType.Integer }],
					),
				);

				value.value = componentValues;
				return;
			}

			return;
		}

		// Single calc as <ratio>
		// "calc(5 / 3)" -> "calc((5 / 3) * 1000000)/1000000"
		if (isFunctionNode(componentValue) && componentValue.getName().toLowerCase() === 'calc') {
			componentValues.splice(
				i,
				1,
				modifyCalc(componentValue),
				new TokenNode(
					[TokenType.Delim, '/', -1, -1, { value: '/' }],
				),
				new TokenNode(
					[TokenType.Number, precision.toString(), -1, -1, { value: precision, type: NumberType.Integer }],
				),
			);

			value.value = componentValues;
			return;
		}
	}

	return;
}

function modifyCalc(focus: FunctionNode): FunctionNode {
	return new FunctionNode(
		[TokenType.Function, 'calc(', -1, -1, { value: 'calc(' }],
		[TokenType.CloseParen, ')', -1, -1, undefined],
		[
			new SimpleBlockNode(
				[TokenType.OpenParen, '(', -1, -1, undefined],
				[TokenType.CloseParen, ')', -1, -1, undefined],
				focus.value,
			),
			new WhitespaceNode(
				[[TokenType.Whitespace, ' ', -1, -1, undefined]],
			),
			new TokenNode(
				[TokenType.Delim, '*', -1, -1, { value: '*' }],
			),
			new WhitespaceNode(
				[[TokenType.Whitespace, ' ', -1, -1, undefined]],
			),
			new TokenNode(
				[TokenType.Number, precision.toString(), -1, -1, { value: precision, type: NumberType.Integer }],
			),
		],
	);
}

// https://stackoverflow.com/questions/17445231/js-how-to-find-the-greatest-common-divisor
function greatestCommonDivisor(a: number, b: number): number {
	if (Number.isNaN(a) || Number.isNaN(b)) {
		throw new Error('Unexpected \'NaN\' when calculating the greatest common divisor.');
	}

	if (!Number.isFinite(a) || !Number.isFinite(b)) {
		throw new Error('Unexpected \'Infinite\' value when calculating the greatest common divisor.');
	}

	if (b > a) {
		[a, b] = [b, a];
	}

	while (true) {
		if (b == 0) {
			return a;
		}

		a %= b;

		if (a == 0) {
			return b;
		}

		b %= a;
	}
}
