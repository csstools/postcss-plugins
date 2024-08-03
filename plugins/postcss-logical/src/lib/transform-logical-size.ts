import type { Declaration } from 'postcss';
import { cloneDeclaration } from './clone-declaration';
import type { DirectionConfig } from './types';

export function transformLogicalSize(
	directionConfig: DirectionConfig,
): (declaration: Declaration) => Array<Declaration> {
	return (declaration: Declaration) => {
		const { value } = declaration;
		const inlineProp = directionConfig.inlineIsHorizontal ? 'width' : 'height';
		const blockProp = directionConfig.inlineIsHorizontal ? 'height' : 'width';
		const prop = declaration.prop.toLowerCase()
			.replace('inline-size', inlineProp)
			.replace('block-size', blockProp);

		return cloneDeclaration(
			declaration,
			value,
			prop,
		);
	};
}
