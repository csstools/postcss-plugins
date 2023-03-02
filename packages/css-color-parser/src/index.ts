import { FunctionNode, isFunctionNode } from '@csstools/css-parser-algorithms';
import { ColorData } from './color-data';
import { hsl } from './functions/hsl';
import { rgb } from './functions/rgb';
export { ColorSpace } from './color-space';

export function color(colorFunction: FunctionNode): ColorData | -1 {
	if (!isFunctionNode(colorFunction)) {
		return -1;
	}

	const colorFunctionName = colorFunction.getName().toLowerCase();

	if (colorFunctionName === 'rgb' || colorFunctionName === 'rgba') {
		return rgb(colorFunction, color);
	}

	if (colorFunctionName === 'hsl' || colorFunctionName === 'hsla') {
		return hsl(colorFunction, color);
	}

	return -1;
}
