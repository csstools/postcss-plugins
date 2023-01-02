import type { Declaration } from 'postcss';
import valueParser from 'postcss-value-parser';
import { DirectionConfig } from './types';
import { cloneDeclaration } from './clone-declaration';
export function transformResize(
	directionConfig: DirectionConfig,
): (declaration: Declaration) => boolean {
	return (declaration: Declaration) => {
		const { prop, value } = declaration;
		const valueAST = valueParser(value);
		const inlineValue = directionConfig.inlineIsHorizontal ? 'horizontal' : 'vertical';
		const blockValue = directionConfig.inlineIsHorizontal ? 'vertical' : 'horizontal';

		valueAST.nodes.forEach((node) => {
			const valueCandidate = node.value.toLowerCase();

			if (node.type === 'word') {
				if (valueCandidate === 'inline') {
					node.value = inlineValue;
					return;
				}

				if (valueCandidate === 'block') {
					node.value = blockValue;
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
