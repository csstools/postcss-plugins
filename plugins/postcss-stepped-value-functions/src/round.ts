import type { Declaration, Result } from 'postcss';
import valueParser from 'postcss-value-parser';
import { functionNodeToWordNode, optionallyWarn } from './utils';
import { pluginOptions } from './index';

const roundFunctionCheck = 'round(';

enum RoundingStrategy {
	Nearest = 'nearest',
	Up = 'up',
	Down = 'down',
	ToZero = 'to-zero'
}

// Regex to check only letters and dashes
const onlyRoundingRegex = /^[a-z|-]+$/i;

function transformRoundFunction(
	decl: Declaration,
	result: Result,
	options: pluginOptions,
): string | undefined {
	const parsedValue = valueParser(decl.value);

	parsedValue.walk(node => {
		if (node.type !== 'function' || node.value.toLowerCase() !== 'round') {
			return;
		}

		// Two signatures are valid:
		// round(rounding-strategy, A, B) -> 5 nodes counting the commas
		// round(A, B) (rounding-strategy defaults to nearest) -> 3 elements counting the commas
		if (node.nodes.length !== 3 && node.nodes.length !== 5) {
			optionallyWarn(
				decl,
				result,
				`Failed to transform ${ decl.value } as the amount of arguments isn't valid`,
				options,
			);
			return;
		}

		const childNodes = node.nodes.filter(childNode => childNode.type === 'word');
		const firstValue = childNodes[0].value;
		let strategy: RoundingStrategy;
		let valueA;
		let valueB;

		// If the first argument is only letters, MUST be a matching Rounding Strategy
		if (onlyRoundingRegex.test(firstValue.toLowerCase())) {
			const isValid = (Object.values(RoundingStrategy) as Array<string>).includes(
				firstValue.toLowerCase(),
			);

			if (isValid) {
				strategy = firstValue.toLowerCase() as RoundingStrategy;
			} else {
				optionallyWarn(
					decl,
					result,
					`Failed to transform ${ decl.value } as ${ firstValue } is not a valid rounding strategy.`,
					options,
				);
				return;
			}

			valueA = valueParser.unit(childNodes?.[1]?.value || '');
			valueB = valueParser.unit(childNodes?.[2]?.value || '');
		} else { // Default to "nearest"
			strategy = RoundingStrategy.Nearest;
			valueA = valueParser.unit(childNodes?.[0]?.value || '');
			valueB = valueParser.unit(childNodes?.[1]?.value || '');
		}

		if (!valueA || !valueB) {
			return;
		}

		if (valueA.unit !== valueB.unit) {
			optionallyWarn(
				decl,
				result,
				`Failed to transform ${ decl.value } as the units don't match`,
				options,
			);
			return;
		}

		const numberA = Number(valueA.number);
		const numberB = Number(valueB.number);
		let roundedValue;

		switch (strategy) {
			case RoundingStrategy.Down:
				roundedValue = Math.floor(numberA / numberB) * numberB;
				break;
			case RoundingStrategy.Up:
				roundedValue = Math.ceil(numberA / numberB) * numberB;
				break;
			case RoundingStrategy.ToZero:
				roundedValue = Math.trunc(numberA / numberB) * numberB;
				break;
			case RoundingStrategy.Nearest:
			default:
				roundedValue = Math.round(numberA / numberB) * numberB;
				break;
		}

		if (typeof roundedValue !== 'number' || isNaN(roundedValue)) {
			return;
		}

		const transformedNode = functionNodeToWordNode(node);
		transformedNode.value = roundedValue === 0 ? '0' : `${roundedValue}${valueA.unit}`;
	}, true);

	return parsedValue.toString();
}

export { roundFunctionCheck, transformRoundFunction };
