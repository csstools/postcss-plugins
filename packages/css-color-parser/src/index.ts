import { ColorData } from './color-data';
import { ComponentValue, isFunctionNode, isTokenNode } from '@csstools/css-parser-algorithms';
import { TokenType } from '@csstools/css-tokenizer';
import { hex } from './functions/hex';
import { hsl } from './functions/hsl';
import { hwb } from './functions/hwb';
import { rgb } from './functions/rgb';
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

	if (isTokenNode(colorNode) && colorNode.value[0] === TokenType.Hash) {
		return hex(colorNode.value);
	}

	return -1;
}
