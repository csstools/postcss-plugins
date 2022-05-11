import type { Declaration } from 'postcss';
import valueParser from 'postcss-value-parser';
import { formatResultingNumber, validateNode } from './utils';

const tanFunctionCheck = 'tan(';

function transformTanFunction(decl: Declaration): string | undefined {
	const parsedValue = valueParser(decl.value);

	parsedValue.walk(node => {
		if (node.type !== 'function' || node.value !== 'tan') {
			return;
		}

		const validated = validateNode(node);

		if (!validated) {
			return;
		}

		const [transformedNode, number] = validated;
		transformedNode.value = formatResultingNumber(Math.tan(number), 5);
	});

	return parsedValue.toString();
}

export { tanFunctionCheck, transformTanFunction };
