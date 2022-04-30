import { Declaration, Result } from 'postcss';
import valueParser from 'postcss-value-parser';
import { validateArgumentsAndTypes } from './utils';
import { pluginOptions } from './index';

const remFunctionCheck = 'rem(';

function transformRemFunction(
	decl: Declaration,
	result: Result,
	options: pluginOptions,
): string | undefined {
	const parsedValue = valueParser(decl.value);

	parsedValue.walk(node => {
		if (node.type !== 'function' || node.value !== 'rem') {
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

		node.type = 'word';
		node.value = remainder === 0 ? '0' : `${remainder}${valueA.unit}`;
	});

	return parsedValue.toString();
}

export { remFunctionCheck, transformRemFunction };
