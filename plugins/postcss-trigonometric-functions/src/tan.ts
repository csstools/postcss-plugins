import type { Declaration } from 'postcss';
import valueParser from 'postcss-value-parser';
import { formatResultingNumber, radToDeg, validateNode } from './utils';

const tanFunctionCheck = 'tan(';

function transformTanFunction(decl: Declaration): string | undefined {
	const parsedValue = valueParser(decl.value);

	parsedValue.walk(node => {
		if (node.type !== 'function' || node.value.toLowerCase() !== 'tan') {
			return;
		}

		const validated = validateNode(node);

		if (!validated) {
			return;
		}

		const [transformedNode, number] = validated;

		/*
		Asymptotes treatment

		Given at this stage the number is in radians, convert to degrees which
		should give enough precision with the given methods.
		 */
		const degrees = Number(formatResultingNumber(radToDeg(number), 2));
		const isNinetyMultiple = degrees % 90 === 0;
		const timesNinety = degrees / 90;
		const isAsymptote = isNinetyMultiple && timesNinety % 2 !== 0;

		if (isAsymptote) {
			transformedNode.value = timesNinety > 0 ? 'infinity' : '-infinity';
			return;
		}

		transformedNode.value = formatResultingNumber(Math.tan(number), 5);
	}, true);

	return parsedValue.toString();
}

export { tanFunctionCheck, transformTanFunction };
