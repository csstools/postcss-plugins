import type { Operation } from './operation/operation';
import type { TokenNode } from '@csstools/css-parser-algorithms';
import type { conversionOptions } from './options';
import { isTokenNode } from '@csstools/css-parser-algorithms';

export type Calculation = {
	inputs: Array<Calculation|TokenNode>;
	operation: Operation;
};

export function isCalculation(x: unknown): x is Calculation {
	return !!(x) && (typeof x === 'object') && ('inputs' in x) && Array.isArray(x.inputs) && ('operation' in x);
}

export function solve(calculation: Calculation | -1, options: conversionOptions): TokenNode | -1 {
	if (calculation === -1) {
		return -1;
	}

	// Solve the calculation tree iteratively.
	const stack: Array<{ calculation: Calculation, inputs: Array<TokenNode>, index: number }> = [
		{ calculation, inputs: [], index: 0 },
	];

	let result: TokenNode | -1 = -1;

	while (stack.length) {
		const frame = stack[stack.length - 1];

		if (frame.index < frame.calculation.inputs.length) {
			const input = frame.calculation.inputs[frame.index];
			frame.index++;

			if (isTokenNode(input)) {
				frame.inputs.push(input);
				continue;
			}

			stack.push({ calculation: input, inputs: [], index: 0 });
			continue;
		}

		const solved = frame.calculation.operation(frame.inputs, options);
		stack.pop();

		if (solved === -1) {
			return -1;
		}

		if (!stack.length) {
			result = solved;
			break;
		}

		stack[stack.length - 1].inputs.push(solved);
	}

	return result;
}
