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

export { ColorSpace } from './color-space';
export { SyntaxFlag } from './color-data';
export { serializeRGB } from './serialize/rgb';

export function color(colorNode: ComponentValue): ColorData | false {
	if (isFunctionNode(colorNode)) {
		const colorFunctionName = toLowerCaseAZ(colorNode.getName());

		if (colorFunctionName === 'rgb' || colorFunctionName === 'rgba') {
			return rgb(colorNode, color);
		}

		if (colorFunctionName === 'hsl' || colorFunctionName === 'hsla') {
			return hsl(colorNode, color);
		}

		if (colorFunctionName === 'hwb') {
			return hwb(colorNode, color);
		}

		if (colorFunctionName === 'lab') {
			return lab(colorNode, color);
		}

		if (colorFunctionName === 'color-mix') {
			return colorMix(colorNode, color);
		}

		return false;
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
