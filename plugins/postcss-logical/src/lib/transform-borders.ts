import type { Declaration } from 'postcss';
import { cloneDeclaration } from './clone-declaration';
import { parseValueCouple } from '../utils/parse-value-couple';

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

		const transformed = parseValueCouple(declaration);
		if (!transformed) {
			return;
		}

		const [valueA, valueB] = transformed;

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
	start: string,
	end: string,
): (declaration: Declaration) => boolean {
	return (declaration: Declaration) => {
		let prop;

		switch (declaration.prop.toLowerCase()) {
			case 'border-start-start-radius':
				prop = `border-top-${start}-radius`;
				break;
			case 'border-start-end-radius':
				prop = `border-top-${end}-radius`;
				break;
			case 'border-end-start-radius':
				prop = `border-bottom-${start}-radius`;
				break;
			case 'border-end-end-radius':
				prop = `border-bottom-${end}-radius`;
				break;
		}

		cloneDeclaration(
			declaration,
			declaration.value,
			prop,
		);

		return true;
	};
}
