import type { ColorData } from './color-data';
import type { ComponentValue } from '@csstools/css-parser-algorithms';
import { TokenType } from '@csstools/css-tokenizer';
import { color as colorFn } from './functions/color';
import { colorKeyword } from './functions/color-keyword';
import { colorMix } from './functions/color-mix';
import { hex } from './functions/hex';
import { hsl } from './functions/hsl';
import { hwb } from './functions/hwb';
import { isFunctionNode, isTokenNode } from '@csstools/css-parser-algorithms';
import { lab } from './functions/lab';
import { lch } from './functions/lch';
import { namedColor } from './functions/named-color';
import { oklab } from './functions/oklab';
import { oklch } from './functions/oklch';
import { rgb } from './functions/rgb';
import { toLowerCaseAZ } from './util/to-lower-case-a-z';

export type { ColorData } from './color-data';
export { ColorNotation } from './color-notation';
export { SyntaxFlag } from './color-data';
export { colorDataTo, colorDataFitsRGB_Gamut, colorDataFitsDisplayP3_Gamut } from './color-data';
export { serializeP3 } from './serialize/p3';
export { serializeRGB } from './serialize/rgb';
export { serializeOKLCH } from './serialize/oklch';

/**
 * Convert a color function to a `ColorData` object.
 *
 * @param {ComponentValue} colorNode - The color function to be converted.
 * @returns {ColorData|false} The color function as a `ColorData` object or `false` if it could not be converted.
 */
export function color(colorNode: ComponentValue): ColorData | false {
	if (isFunctionNode(colorNode)) {
		const colorFunctionName = toLowerCaseAZ(colorNode.getName());

		switch (colorFunctionName) {
			case 'rgb':
			case 'rgba':
				return rgb(colorNode, color);
			case 'hsl':
			case 'hsla':
				return hsl(colorNode, color);
			case 'hwb':
				return hwb(colorNode, color);
			case 'lab':
				return lab(colorNode, color);
			case 'lch':
				return lch(colorNode, color);
			case 'oklab':
				return oklab(colorNode, color);
			case 'oklch':
				return oklch(colorNode, color);
			case 'color':
				return colorFn(colorNode, color);
			case 'color-mix':
				return colorMix(colorNode, color);
		}
	}

	if (isTokenNode(colorNode)) {
		if (colorNode.value[0] === TokenType.Hash) {
			return hex(colorNode.value);
		}

		if (colorNode.value[0] === TokenType.Ident) {
			const namedColorData = namedColor(colorNode.value[4].value);
			if (namedColorData !== false) {
				return namedColorData;
			}

			return colorKeyword(colorNode.value[4].value);
		}
	}

	return false;
}
