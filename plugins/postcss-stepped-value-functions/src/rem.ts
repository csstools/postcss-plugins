import type { Declaration, Result } from 'postcss';
import valueParser from 'postcss-value-parser';
import { functionNodeToWordNode, validateArgumentsAndTypes } from './utils';
import { pluginOptions } from './index';

const remFunctionCheck = 'rem(';

function transformRemFunction(
	decl: Declaration,
	result: Result,
	options: pluginOptions,
): string | undefined {
	const parsedValue = valueParser(decl.value);

	parsedValue.walk(node => {
		if (node.type !== 'function' || node.value.toLowerCase() !== 'rem') {
			return;
		}

		const values = validateArgumentsAndTypes(
			node,
			decl,
			result,
			options,
		);

		if (!values) {
			return;
		}

		const [ valueA, valueB ] = values;
		const remainder = Number(valueA.number) % Number(valueB.number);

		if (typeof remainder !== 'number' && !isNaN(remainder)) {
			return;
		}

		const transformedNode = functionNodeToWordNode(node);
		transformedNode.value = remainder === 0 ? '0' : `${remainder}${valueA.unit}`;
	}, true);

	return parsedValue.toString();
}

export { remFunctionCheck, transformRemFunction };
