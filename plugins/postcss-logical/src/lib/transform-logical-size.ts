import type { Declaration } from 'postcss';
import valueParser from 'postcss-value-parser';
import { cloneDeclaration } from './clone-declaration';
import { DirectionConfig } from './types';
export function transformLogicalSize(
	directionConfig: DirectionConfig,
): (declaration: Declaration) => boolean {
	return (declaration: Declaration) => {
		const { value } = declaration;
		const valueAST = valueParser(value);
		const inlineValue = directionConfig.inlineIsHorizontal ? 'width' : 'height';
		const blockValue = directionConfig.inlineIsHorizontal ? 'height' : 'width';
		const prop = declaration.prop === 'block-size' ? blockValue : inlineValue;

		cloneDeclaration(
			declaration,
			valueAST.toString(),
			prop,
		);

		return true;
	};
}
