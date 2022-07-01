import type { Declaration } from 'postcss';
import valueParser from 'postcss-value-parser';
import { formatResultingNumber, radToDeg, validateNode } from './utils';

const asinFunctionCheck = 'asin(';

function transformAsinFunction(decl: Declaration): string | undefined {
	const parsedValue = valueParser(decl.value);

	parsedValue.walk(node => {
		if (node.type !== 'function' || node.value.toLowerCase() !== 'asin') {
			return;
		}

		const validated = validateNode(node, false);

		if (!validated) {
			return;
		}

		const [transformedNode, number] = validated;
		let value: string | number = Math.asin(number);

		if (!Number.isNaN(value) && typeof value === 'number') {
			value = `${formatResultingNumber(radToDeg(value), 2)}deg`;
		}

		transformedNode.value = value + '';
	}, true);

	return parsedValue.toString();
}

export { asinFunctionCheck, transformAsinFunction };
