import { ColorData } from './color-data';
import { ComponentValue, isFunctionNode, isTokenNode } from '@csstools/css-parser-algorithms';
import { TokenType } from '@csstools/css-tokenizer';
import { colorKeyword } from './functions/color-keyword';
import { hex } from './functions/hex';
import { hsl } from './functions/hsl';
import { hwb } from './functions/hwb';
import { namedColor } from './functions/named-color';
import { rgb } from './functions/rgb';
import { toLowerCaseAZ } from './util/to-lower-case-a-z';
import { lab } from './functions/lab';
import { colorMix } from './functions/color-mix';
import { oklab } from './functions/oklab';
import { lch } from './functions/lch';
import { oklch } from './functions/oklch';
import { color as colorFn } from './functions/color';

export { ColorNotation } from './color-notation';
export { SyntaxFlag } from './color-data';
export { serializeRGB } from './serialize/rgb';
export { serializeP3 } from './serialize/p3';

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
			default:
				return false;
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

			const keywordColorData = colorKeyword(colorNode.value[4].value);
			if (keywordColorData !== false) {
				return keywordColorData;
			}

			return false;
		}

		return false;
	}

	return false;
}
