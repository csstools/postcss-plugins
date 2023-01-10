import { Declaration } from 'postcss';
import { cloneDeclaration } from './clone-declaration';
import { parseValueCouple } from '../utils/parse-value-couple';
import { DirectionConfig } from './types';

export function transformBorder(
	borderSetting: string,
	side: string,
): (declaration: Declaration) => boolean {
	return (declaration: Declaration) => {
		cloneDeclaration(
			declaration,
			declaration.value,
			`border-${side}-${borderSetting}`,
		);

		return true;
	};
}

export function transformBorderProperty(
	borderSetting: string,
	side: [string, string],
): (declaration: Declaration) => boolean {
	return (declaration: Declaration) => {
		const [sideA, sideB] = side;
		const [valueA, valueB] = parseValueCouple(declaration);

		cloneDeclaration(
			declaration,
			valueA,
			`border-${sideA}-${borderSetting}`,
		);

		cloneDeclaration(
			declaration,
			valueB,
			`border-${sideB}-${borderSetting}`,
		);

		return true;
	};
}

export function transformBorderShorthand(
	side: [string] | [string, string],
): (declaration: Declaration) => boolean {
	return (declaration: Declaration) => {
		side.forEach((sidePart) => cloneDeclaration(
			declaration,
			declaration.value,
			`border-${sidePart}`,
		));

		return true;
	};
}

export function transformBorderRadius(
	config: DirectionConfig,
): (declaration: Declaration) => boolean {
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

		cloneDeclaration(
			declaration,
			declaration.value,
			prop,
		);

		return true;
	};
}
