import type { Declaration } from 'postcss';
import { cloneDeclaration } from './clone-declaration';
import { parseValueCouple } from '../utils/parse-value-couple';
import type { DirectionConfig } from './types';

export function transformBorder(
	borderSetting: string,
	side: string,
): (declaration: Declaration) => Array<Declaration> {
	return (declaration: Declaration) => {
		return cloneDeclaration(
			declaration,
			declaration.value,
			`border-${side}-${borderSetting}`,
		);
	};
}

export function transformBorderProperty(
	borderSetting: string,
	side: [string, string],
): (declaration: Declaration) => Array<Declaration> {
	return (declaration: Declaration) => {
		const [sideA, sideB] = side;
		const [valueA, valueB] = parseValueCouple(declaration);

		return [
			...cloneDeclaration(
				declaration,
				valueA,
				`border-${sideA}-${borderSetting}`,
			),
			...cloneDeclaration(
				declaration,
				valueB,
				`border-${sideB}-${borderSetting}`,
			),
		];
	};
}

export function transformBorderShorthand(
	side: [string] | [string, string],
): (declaration: Declaration) => Array<Declaration> {
	return (declaration: Declaration) => {
		return side.flatMap((sidePart) => {
			return cloneDeclaration(
				declaration,
				declaration.value,
				`border-${sidePart}`,
			);
		});
	};
}

export function transformBorderRadius(
	config: DirectionConfig,
): (declaration: Declaration) => Array<Declaration> {
	return (declaration: Declaration) => {
		let prop;

		switch (declaration.prop.toLowerCase()) {
			case 'border-start-start-radius': {
				const replacement = config.inlineIsHorizontal ?
					`${config.block[0]}-${config.inline[0]}` :
					`${config.inline[0]}-${config.block[0]}`;

				prop = `border-${replacement}-radius`;
				break;
			}
			case 'border-start-end-radius': {
				const replacement = config.inlineIsHorizontal ?
					`${config.block[0]}-${config.inline[1]}` :
					`${config.inline[1]}-${config.block[0]}`;

				prop = `border-${replacement}-radius`;
				break;
			}
			case 'border-end-start-radius': {
				const replacement = config.inlineIsHorizontal ?
					`${config.block[1]}-${config.inline[0]}` :
					`${config.inline[0]}-${config.block[1]}`;

				prop = `border-${replacement}-radius`;
				break;
			}
			case 'border-end-end-radius': {
				const replacement = config.inlineIsHorizontal ?
					`${config.block[1]}-${config.inline[1]}` :
					`${config.inline[1]}-${config.block[1]}`;

				prop = `border-${replacement}-radius`;
				break;
			}
		}

		if (!prop) {
			return [];
		}

		return cloneDeclaration(
			declaration,
			declaration.value,
			prop,
		);
	};
}
