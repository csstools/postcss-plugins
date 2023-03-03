import { ColorData } from './color-data';
import { ComponentValue, isFunctionNode, isTokenNode } from '@csstools/css-parser-algorithms';
import { TokenType } from '@csstools/css-tokenizer';
import { hex } from './functions/hex';
import { hsl } from './functions/hsl';
import { hwb } from './functions/hwb';
import { rgb } from './functions/rgb';
import { namedColor } from './functions/named-color';
import { colorKeyword } from './functions/color-keyword';
export { ColorSpace } from './color-space';

export function color(colorNode: ComponentValue): ColorData | -1 {
	if (isFunctionNode(colorNode)) {
		const colorFunctionName = colorNode.getName().toLowerCase();

		if (colorFunctionName === 'rgb' || colorFunctionName === 'rgba') {
			return rgb(colorNode, color);
		}

		if (colorFunctionName === 'hsl' || colorFunctionName === 'hsla') {
			return hsl(colorNode, color);
		}

		if (colorFunctionName === 'hwb') {
			return hwb(colorNode, color);
		}

		return -1;
	}

	if (isTokenNode(colorNode)) {
		if (colorNode.value[0] === TokenType.Hash) {
			return hex(colorNode.value);
		}

		if (colorNode.value[0] === TokenType.Ident) {
			const namedColorData = namedColor(colorNode.value[4].value.toLowerCase());
			if (namedColorData !== -1) {
				return namedColorData;
			}

			const keywordColorData = colorKeyword(colorNode.value[4].value.toLowerCase());
			if (keywordColorData !== -1) {
				return keywordColorData;
			}

			return -1;
		}

		return -1;
	}

	return -1;
}
