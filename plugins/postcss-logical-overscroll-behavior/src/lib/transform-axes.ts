import type { Declaration } from 'postcss';
import { cloneDeclaration } from './clone-declaration';
import { DirectionConfig } from './types';

export function transformAxes(
	directionConfig: DirectionConfig,
): (declaration: Declaration) => Array<Declaration> {
	return (declaration: Declaration) => {
		const { value } = declaration;
		const inlineProp = directionConfig.inlineIsHorizontal ? 'x' : 'y';
		const blockProp = directionConfig.inlineIsHorizontal ? 'y' : 'x';
		const prop = declaration.prop.toLowerCase()
			.replace('inline', inlineProp)
			.replace('block', blockProp);

		return cloneDeclaration(
			declaration,
			value,
			prop,
		);
	};
}
