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
			if (node.type === 'word') {
				const valueCandidate = node.value.toLowerCase();

				if (valueCandidate === DirectionValue.End) {
					node.value = end;
					return;
				}

				if (valueCandidate === DirectionValue.Start) {
					node.value = start;
				}
			}
		});

		const modifiedValued = valueAST.toString();
		if (modifiedValued !== value) {
			cloneDeclaration(declaration, modifiedValued, prop);
			return true;
		}

		return false;
	};
}
