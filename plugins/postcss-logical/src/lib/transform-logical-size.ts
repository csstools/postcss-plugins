import type { Declaration } from 'postcss';
import { cloneDeclaration } from './clone-declaration';
import { DirectionConfig } from './types';

export function transformLogicalSize(
	directionConfig: DirectionConfig,
): (declaration: Declaration) => boolean {
	return (declaration: Declaration) => {
		const { value } = declaration;
		const inlineProp = directionConfig.inlineIsHorizontal ? 'width' : 'height';
		const blockProp = directionConfig.inlineIsHorizontal ? 'height' : 'width';
		const prop = declaration.prop === 'block-size' ? blockProp : inlineProp;

		cloneDeclaration(
			declaration,
			value,
			prop,
		);

		return true;
	};
}
