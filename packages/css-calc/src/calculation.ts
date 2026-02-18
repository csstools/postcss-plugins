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

	const inputs: Array<TokenNode> = [];
	for (let i = 0; i < calculation.inputs.length; i++) {
		const input = calculation.inputs[i];
		if (isTokenNode(input)) {
			inputs.push(input);
			continue;
		}

		const result = solve(input, options);
		if (result === -1) {
			return -1;
		}

		inputs.push(result);
	}

	return calculation.operation(inputs, options);
}
