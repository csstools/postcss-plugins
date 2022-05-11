import type { Declaration } from 'postcss';
import valueParser from 'postcss-value-parser';
import { formatResultingNumber, validateNode } from './utils';

const cosFunctionCheck = 'cos(';

function transformCosFunction(decl: Declaration): string | undefined {
	const parsedValue = valueParser(decl.value);

	parsedValue.walk(node => {
		if (node.type !== 'function' || node.value !== 'cos') {
			return;
		}

		const validated = validateNode(node);

		if (!validated) {
			return;
		}

		const [transformedNode, number] = validated;
		transformedNode.value = formatResultingNumber(Math.cos(number), 5);
	});

	return parsedValue.toString();
}

export { cosFunctionCheck, transformCosFunction };
