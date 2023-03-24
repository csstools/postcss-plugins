import { color, ColorData } from '@csstools/css-color-parser';
import { ComponentValue, isTokenNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
import { isCommentNode } from '@csstools/css-parser-algorithms';
import { TokenType } from '@csstools/css-tokenizer';
import type { ColorStop } from './color-stop-list';

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

		if (isTokenNode(node) && node.value[0] === TokenType.Comma) {
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
		if (colorData && currentColorStop.color) {
			return false;
		}

		if (colorData) {
			currentColorStop.color = node;
			currentColorStop.colorData = colorData;
			continue;
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
