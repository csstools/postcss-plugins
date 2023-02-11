import { isTokenNode, TokenNode } from '@csstools/css-parser-algorithms';
import { Operation } from './operation/operation';

export type Calculation = {
	inputs: Array<Calculation|TokenNode>;
	operation: Operation;
}

export function solve(calculation: Calculation) {
	const inputs: Array<TokenNode> = [];
	for (let i = 0; i < calculation.inputs.length; i++) {
		const input = calculation.inputs[i];
		if (isTokenNode(input)) {
			inputs.push(input);
			continue;
		}

		const result = solve(input);
		if (result === -1) {
			return -1;
		}

		inputs.push(result);
	}

	return calculation.operation(inputs);
}
