import type { Declaration } from 'postcss';
import valueParser from 'postcss-value-parser';
import type { DirectionConfig } from './types';
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
			if (node.type === 'word') {
				const valueCandidate = node.value.toLowerCase();

				if (valueCandidate === 'inline') {
					node.value = inlineValue;
					return;
				}

				if (valueCandidate === 'block') {
					node.value = blockValue;
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
