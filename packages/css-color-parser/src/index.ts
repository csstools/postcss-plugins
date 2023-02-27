import { FunctionNode, isFunctionNode } from '@csstools/css-parser-algorithms';
import { ColorData } from './color';
import { rgb } from './functions/rgb';
export { ColorSpace } from './color-space';

export function color(colorFunction: FunctionNode): ColorData | -1 {
	if (!isFunctionNode(colorFunction)) {
		return -1;
	}

	if (colorFunction.getName().toLowerCase() === 'rgb' || colorFunction.getName().toLowerCase() === 'rgba') {
		return rgb(colorFunction, color);
	}

	return -1;
}
