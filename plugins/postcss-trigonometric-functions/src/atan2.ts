import type { Declaration } from 'postcss';
import valueParser from 'postcss-value-parser';
import {
	computeCalculation,
	filterOnlyWords,
	formatResultingNumber,
	functionNodeToWordNode,
	parseNumber,
	radToDeg,
} from './utils';

const atan2FunctionCheck = 'atan2(';

function transformAtan2Function(decl: Declaration): string | undefined {
	const parsedValue = valueParser(decl.value);

	parsedValue.walk(node => {
		if (node.type !== 'function' || node.value.toLowerCase() !== 'atan2') {
			return;
		}

		const commaIndex = node.nodes.findIndex(
			childNode => childNode.type === 'div' && childNode.value === ',',
		);

		if (commaIndex < 0) {
			return;
		}

		let first = node.nodes.slice(0, commaIndex).filter(filterOnlyWords);
		let second = node.nodes.slice(commaIndex + 1).filter(filterOnlyWords);

		if (first.length === 0 || second.length === 0) {
			return;
		}

		// Compute calculations first
		if (first.length > 1) {
			first = computeCalculation(first, true);
		}

		if (second.length > 1) {
			second = computeCalculation(second, true);
		}

		if (first.length !== 1 || second.length !== 1) {
			return;
		}

		const firstParsed = parseNumber(first[0].value);
		const secondParsed = parseNumber(second[0].value);

		if (!firstParsed || !secondParsed) {
			return;
		}

		// Units must match
		if (firstParsed.unit !== secondParsed.unit) {
			return;
		}

		let value: string | number = Math.atan2(
			firstParsed.number,
			secondParsed.number,
		);

		if (!Number.isNaN(value) && typeof value === 'number') {
			value = `${formatResultingNumber(radToDeg(value), 2)}deg`;
		}

		const transformedNode = functionNodeToWordNode(node);
		transformedNode.value = value + '';
	}, true);

	return parsedValue.toString();
}

export { atan2FunctionCheck, transformAtan2Function };
