import type { Declaration } from 'postcss';
import valueParser from 'postcss-value-parser';
import { DirectionValue } from './types';
import { cloneDeclaration } from './clone-declaration';

export function transformTextAlign(
	inlineValues: [string, string],
): (declaration: Declaration) => Array<Declaration> {
	return (declaration: Declaration) => {
		const { prop, value } = declaration;
		const valueAST = valueParser(value);
		const [start, end] = inlineValues;

		valueAST.nodes.forEach((node) => {
			if (node.type === 'word') {
				const valueCandidate = node.value.toLowerCase() as DirectionValue;

				if (valueCandidate === DirectionValue.End) {
					node.value = end;
					return;
				}

				if (valueCandidate === DirectionValue.Start) {
					node.value = start;
					return;
				}
			}
		});

		const modifiedValued = valueAST.toString();
		if (modifiedValued !== value) {
			return cloneDeclaration(declaration, modifiedValued, prop);
		}

		return [];
	};
}
