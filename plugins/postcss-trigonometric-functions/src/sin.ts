import type { Declaration } from 'postcss';
import valueParser from 'postcss-value-parser';
import { formatResultingNumber, validateNode } from './utils';

const sinFunctionCheck = 'sin(';

function transformSinFunction(decl: Declaration): string | undefined {
	const parsedValue = valueParser(decl.value);

	parsedValue.walk(node => {
		if (node.type !== 'function' || node.value.toLowerCase() !== 'sin') {
			return;
		}

		const validated = validateNode(node);

		if (!validated) {
			return;
		}

		const [transformedNode, number] = validated;
		transformedNode.value = formatResultingNumber(Math.sin(number), 5);
	}, true);

	return parsedValue.toString();
}

export { sinFunctionCheck, transformSinFunction };
