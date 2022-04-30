import { Declaration, Result } from 'postcss';
import valueParser from 'postcss-value-parser';
import { validateArgumentsAndTypes } from './utils';
import { pluginOptions } from './index';

const modFunctionCheck = 'mod(';

function transformModFunction(
	decl: Declaration,
	result: Result,
	options: pluginOptions,
): string | undefined {
	const parsedValue = valueParser(decl.value);

	parsedValue.walk(node => {
		if (node.type !== 'function' || node.value !== 'mod') {
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
		const numberA = Number(valueA.number);
		const numberB = Number(valueB.number);
		const modulus = ((numberA % numberB) + numberB) % numberB;

		if (typeof modulus !== 'number' && !isNaN(modulus)) {
			return;
		}

		node.type = 'word';
		node.value = modulus === 0 ? '0' : `${modulus}${valueA.unit}`;
	});

	return parsedValue.toString();
}

export { modFunctionCheck, transformModFunction };
