import type { Declaration } from 'postcss';
import valueParser from 'postcss-value-parser';
import { DirectionValue } from './types';
export function transformTextAlign(
	inlineValues: [string, string],
): (declaration: Declaration) => boolean {
	return (declaration: Declaration) => {
		const { prop, value } = declaration;
		const valueAST = valueParser(value);
		const [start, end] = inlineValues;

		valueAST.nodes.forEach((node) => {
			const valueCandidate = node.value.toLowerCase();

			if (node.type === 'word') {
				if (valueCandidate === DirectionValue.End) {
					node.value = end;
				}

				if (valueCandidate === DirectionValue.Start) {
					node.value = start;
				}
			}
		});

		const changed = valueAST.toString() !== value;

		if (changed) {
			declaration.cloneBefore({
				prop,
				value: valueAST.toString(),
			});
		}

		return changed;
	};
}
