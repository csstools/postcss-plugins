import type { ColorStop } from './color-stop-list';
import type { ComponentValue } from '@csstools/css-parser-algorithms';
import { isTokenComma } from '@csstools/css-tokenizer';
import type { ColorData} from '@csstools/css-color-parser';
import { color, SyntaxFlag } from '@csstools/css-color-parser';
import { isCommentNode } from '@csstools/css-parser-algorithms';
import { isTokenNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';

export function parseColorStops(componentValues: Array<ComponentValue>): Array<ColorStop> | false {
	const colorStops: Array<ColorStop> = [];

	let currentColorStop: {
		color?: ComponentValue,
		colorData?: ColorData,
		positionA?: ComponentValue,
		positionB?: ComponentValue,
	} = {};

	for (let i = 0; i < componentValues.length; i++) {
		const node = componentValues[i];
		if (isCommentNode(node) || isWhitespaceNode(node)) {
			continue;
		}

		if (isTokenNode(node) && isTokenComma(node.value)) {
			if (currentColorStop.color && currentColorStop.colorData && currentColorStop.positionA) {
				colorStops.push({ color: currentColorStop.color, colorData: currentColorStop.colorData, position: currentColorStop.positionA });

				if (currentColorStop.positionB) {
					colorStops.push({ color: currentColorStop.color, colorData: currentColorStop.colorData, position: currentColorStop.positionB });
				}

				currentColorStop = {};
				continue;
			}

			return false;
		}

		const colorData = color(node);
		if (colorData) {
			if (currentColorStop.color) {
				return false;
			}

			if (colorData.syntaxFlags.has(SyntaxFlag.Experimental)) {
				return false;
			}

			currentColorStop.color = node;
			currentColorStop.colorData = colorData;
			continue;
		}

		if (!currentColorStop.color) {
			// Positions before colors are not allowed.
			return false;
		}

		if (!currentColorStop.positionA) {
			currentColorStop.positionA = node;
			continue;
		}

		if (currentColorStop.positionA && !currentColorStop.positionB) {
			currentColorStop.positionB = node;
			continue;
		}

		return false;
	}

	if (!currentColorStop.color || !currentColorStop.positionA) {
		return false;
	}

	if (currentColorStop.color && currentColorStop.colorData && currentColorStop.positionA) {
		colorStops.push({ color: currentColorStop.color, colorData: currentColorStop.colorData, position: currentColorStop.positionA });

		if (currentColorStop.positionB) {
			colorStops.push({ color: currentColorStop.color, colorData: currentColorStop.colorData, position: currentColorStop.positionB });
		}
	}

	if (colorStops.length < 2) {
		return false;
	}

	return colorStops;
}
