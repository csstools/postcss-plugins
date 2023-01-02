import type { Declaration } from 'postcss';
import valueParser from 'postcss-value-parser';
import { DirectionValue } from './types';
import { cloneDeclaration } from './clone-declaration';
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
					return;
				}

				if (valueCandidate === DirectionValue.Start) {
					node.value = start;
				}
			}
		});

		const changed = valueAST.toString() !== value;

		if (changed) {
			cloneDeclaration(declaration, valueAST.toString(), prop);
		}

		return changed;
	};
}
