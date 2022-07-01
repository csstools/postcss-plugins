import type { Declaration } from 'postcss';
import valueParser from 'postcss-value-parser';
import { formatResultingNumber, radToDeg, validateNode } from './utils';

const atanFunctionCheck = 'atan(';

function transformAtanFunction(decl: Declaration): string | undefined {
	const parsedValue = valueParser(decl.value);

	parsedValue.walk(node => {
		if (node.type !== 'function' || node.value.toLowerCase() !== 'atan') {
			return;
		}

		const validated = validateNode(node, false);

		if (!validated) {
			return;
		}

		const [transformedNode, number] = validated;
		let value: string | number = Math.atan(number);

		if (!Number.isNaN(value) && typeof value === 'number') {
			value = `${formatResultingNumber(radToDeg(value), 2)}deg`;
		}

		transformedNode.value = value + '';
	},true);

	return parsedValue.toString();
}

export { atanFunctionCheck, transformAtanFunction };
