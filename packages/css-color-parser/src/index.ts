import { FunctionNode, isFunctionNode } from '@csstools/css-parser-algorithms';
import { rgb } from './functions/rgb';
export { ColorSpace } from './color-space';

export function color(colorFunction: FunctionNode) {
	if (!isFunctionNode(colorFunction)) {
		return;
	}

	if (colorFunction.getName().toLowerCase() === 'rgb' || colorFunction.getName().toLowerCase() === 'rgba') {
		return rgb(colorFunction);
	}
}
